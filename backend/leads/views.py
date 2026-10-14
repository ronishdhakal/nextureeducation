import logging
from datetime import timedelta

from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from accounts.models import ADMIN, COUNSELLOR, TELECALLER, get_role
from accounts.permissions import CRMPermission

from notifications.models import notify

from .models import CallLog, Lead
from .serializers import CallLogSerializer, LeadCreateSerializer, LeadSerializer
from .throttles import LeadCreateThrottle

logger = logging.getLogger(__name__)


def scope_leads(queryset, user):
    """Telecallers only ever see the leads assigned to them."""
    if get_role(user) == TELECALLER:
        return queryset.filter(assigned_to=user)
    return queryset


class CallLogViewSet(viewsets.ModelViewSet):
    queryset = CallLog.objects.select_related("lead", "created_by")
    serializer_class = CallLogSerializer
    permission_classes = [CRMPermission]
    filterset_fields = ["lead", "outcome"]
    ordering_fields = ["created_at"]

    def get_queryset(self):
        qs = super().get_queryset()
        if get_role(self.request.user) == TELECALLER:
            qs = qs.filter(lead__assigned_to=self.request.user)
        return qs

    def perform_create(self, serializer):
        lead = serializer.validated_data["lead"]
        if get_role(self.request.user) == TELECALLER and lead.assigned_to_id != self.request.user.id:
            raise PermissionDenied("This lead is not assigned to you.")
        log = serializer.save(created_by=self.request.user)
        # A call log is also the follow-up scheduler: the lead's next follow-up
        # always mirrors the latest log (and clears when that call needs none).
        lead.next_follow_up = log.follow_up_at
        if lead.status == "new":
            lead.status = "contacted"
        lead.save(update_fields=["next_follow_up", "status", "updated_at"])

    def perform_destroy(self, instance):
        if get_role(self.request.user) == TELECALLER:
            raise PermissionDenied()
        instance.delete()


class LeadViewSet(viewsets.ModelViewSet):
    queryset = Lead.objects.select_related("preferred_destination", "assigned_to")
    filterset_fields = [
        "status",
        "preferred_destination",
        "preferred_level",
        "temperature",
        "assigned_to",
    ]
    search_fields = ["name", "phone", "email"]
    ordering_fields = ["created_at", "status", "next_follow_up"]

    def get_serializer_class(self):
        if self.action == "create":
            return LeadCreateSerializer
        return LeadSerializer

    def get_permissions(self):
        if self.action == "create":
            return [AllowAny()]
        return [CRMPermission()]

    def get_throttles(self):
        if self.action == "create":
            return [LeadCreateThrottle()]
        return super().get_throttles()

    def get_queryset(self):
        qs = scope_leads(super().get_queryset(), self.request.user)
        params = self.request.query_params
        now = timezone.now()
        follow_up = params.get("follow_up")
        if follow_up == "overdue":
            qs = qs.filter(next_follow_up__lt=now).exclude(status="closed")
        elif follow_up == "today":
            start = timezone.localtime(now).replace(hour=0, minute=0, second=0, microsecond=0)
            qs = qs.filter(
                next_follow_up__gte=start, next_follow_up__lt=start + timedelta(days=1)
            ).exclude(status="closed")
        elif follow_up == "upcoming":
            qs = qs.filter(next_follow_up__gte=now).exclude(status="closed")
        if params.get("unassigned") == "1":
            qs = qs.filter(assigned_to__isnull=True)
        return qs

    def perform_update(self, serializer):
        # Only admins and counsellors hand leads out; telecallers work what they are given.
        if get_role(self.request.user) == TELECALLER:
            serializer.validated_data.pop("assigned_to", None)
        previous = serializer.instance.assigned_to_id
        lead = serializer.save()
        if lead.assigned_to_id and lead.assigned_to_id != previous:
            notify(
                "lead_assigned",
                f"{lead.name} has been assigned to you.",
                related="Inquiry",
                link="/admin/leads",
                user=lead.assigned_to,
            )

    def perform_destroy(self, instance):
        if get_role(self.request.user) not in {ADMIN, COUNSELLOR}:
            raise PermissionDenied()
        instance.delete()

    @action(detail=True, methods=["post"])
    def convert(self, request, pk=None):
        """Turn an inquiry into a student record, carrying over what we already know."""
        from crm.models import Student

        if get_role(request.user) not in {ADMIN, COUNSELLOR}:
            raise PermissionDenied("Only admins and counsellors can convert inquiries.")
        lead = self.get_object()
        if Student.objects.filter(lead=lead).exists():
            raise ValidationError("This inquiry has already been converted to a student.")
        level_map = {
            "foundation": "high_school",
            "diploma": "diploma",
            "bachelor": "bachelor",
            "master": "master",
            "phd": "master",
        }
        student = Student.objects.create(
            full_name=lead.name,
            email=lead.email,
            phone=lead.phone,
            destination=lead.preferred_destination,
            current_education_level=level_map.get(lead.preferred_level, ""),
            counsellor=lead.assigned_to if lead.assigned_to and get_role(lead.assigned_to) in {ADMIN, COUNSELLOR} else request.user,
            lead=lead,
            notes=lead.message,
        )
        lead.status = "qualified"
        lead.save(update_fields=["status", "updated_at"])
        return Response({"student": student.id}, status=201)

    @action(detail=False, methods=["get"])
    def summary(self, request):
        """Counts for the dashboard and the list tabs, scoped like the list itself."""
        qs = scope_leads(Lead.objects.all(), request.user)
        now = timezone.now()
        start = timezone.localtime(now).replace(hour=0, minute=0, second=0, microsecond=0)
        open_qs = qs.exclude(status="closed")
        return Response(
            {
                "total": qs.count(),
                "new": qs.filter(status="new").count(),
                "contacted": qs.filter(status="contacted").count(),
                "qualified": qs.filter(status="qualified").count(),
                "closed": qs.filter(status="closed").count(),
                "hot": open_qs.filter(temperature="hot").count(),
                "overdue": open_qs.filter(next_follow_up__lt=now).count(),
                "today": open_qs.filter(
                    next_follow_up__gte=start, next_follow_up__lt=start + timedelta(days=1)
                ).count(),
                "unassigned": qs.filter(assigned_to__isnull=True).count(),
            }
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Honeypot: silently pretend success without persisting anything.
        if serializer.validated_data.pop("website", ""):
            return Response(
                {"detail": "Thanks, we'll be in touch shortly."}, status=201
            )

        lead = Lead.objects.create(**serializer.validated_data)
        notify(
            "new_inquiry",
            f"New inquiry received. You have a new inquiry from {lead.name}.",
            related="Inquiry",
            link="/admin/leads",
            roles="admin,counsellor",
        )
        self._notify(lead)
        return Response(
            {"detail": "Thanks, we'll be in touch shortly.", "id": lead.id}, status=201
        )

    def _notify(self, lead: Lead):
        if not settings.LEAD_NOTIFICATION_EMAIL:
            return
        try:
            send_mail(
                subject=f"New inquiry: {lead.name}",
                message=(
                    f"Name: {lead.name}\n"
                    f"Phone: {lead.phone}\n"
                    f"Email: {lead.email}\n"
                    f"Destination: {lead.preferred_destination}\n"
                    f"Level: {lead.get_preferred_level_display()}\n"
                    f"Source: {lead.source_page}\n\n"
                    f"Message:\n{lead.message}"
                ),
                from_email=None,
                recipient_list=[settings.LEAD_NOTIFICATION_EMAIL],
                fail_silently=True,
            )
        except Exception:
            logger.exception("Failed to send lead notification email")
