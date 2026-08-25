import logging

from django.conf import settings
from django.core.mail import send_mail
from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Lead
from .serializers import LeadCreateSerializer, LeadSerializer
from .throttles import LeadCreateThrottle

logger = logging.getLogger(__name__)


class LeadViewSet(viewsets.ModelViewSet):
    queryset = Lead.objects.all()
    filterset_fields = ["status", "preferred_destination", "preferred_level"]
    search_fields = ["name", "phone", "email"]
    ordering_fields = ["created_at", "status"]

    def get_serializer_class(self):
        if self.action == "create":
            return LeadCreateSerializer
        return LeadSerializer

    def get_permissions(self):
        if self.action == "create":
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_throttles(self):
        if self.action == "create":
            return [LeadCreateThrottle()]
        return super().get_throttles()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Honeypot: silently pretend success without persisting anything.
        if serializer.validated_data.pop("website", ""):
            return Response(
                {"detail": "Thanks — we'll be in touch shortly."}, status=201
            )

        lead = Lead.objects.create(**serializer.validated_data)
        self._notify(lead)
        return Response(
            {"detail": "Thanks — we'll be in touch shortly.", "id": lead.id}, status=201
        )

    def _notify(self, lead: Lead):
        if not settings.LEAD_NOTIFICATION_EMAIL:
            return
        try:
            send_mail(
                subject=f"New inquiry — {lead.name}",
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
