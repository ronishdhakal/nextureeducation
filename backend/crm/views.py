from django.db.models import Count
from rest_framework import viewsets
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser

from accounts.models import ADMIN, COUNSELLOR, get_role
from rest_framework.permissions import BasePermission

from .models import Appointment, Application, Document, Student, VisaApplication
from .serializers import (
    AppointmentSerializer,
    ApplicationSerializer,
    DocumentSerializer,
    StudentSerializer,
    VisaApplicationSerializer,
)


class StudentDesk(BasePermission):
    """Student records hold passports and academic history: admins and counsellors only."""

    def has_permission(self, request, view):
        return get_role(request.user) in {ADMIN, COUNSELLOR}


class DeskViewSet(viewsets.ModelViewSet):
    permission_classes = [StudentDesk]
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    ordering_fields = ["created_at", "id"]


class StudentViewSet(DeskViewSet):
    queryset = Student.objects.select_related("destination", "preferred_university", "counsellor")
    serializer_class = StudentSerializer
    filterset_fields = ["status", "destination", "counsellor", "current_education_level"]
    search_fields = ["full_name", "email", "phone"]

    def get_queryset(self):
        return super().get_queryset().annotate(application_count=Count("applications", distinct=True))


class ApplicationViewSet(DeskViewSet):
    queryset = Application.objects.select_related("student", "university", "destination")
    serializer_class = ApplicationSerializer
    filterset_fields = ["status", "student", "university", "destination"]
    search_fields = ["student__full_name", "university__name", "course"]


class DocumentViewSet(DeskViewSet):
    queryset = Document.objects.select_related("student")
    serializer_class = DocumentSerializer
    filterset_fields = ["student", "application", "doc_type", "status"]
    search_fields = ["student__full_name", "title"]

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)


class AppointmentViewSet(DeskViewSet):
    queryset = Appointment.objects.select_related("student", "lead", "counsellor")
    serializer_class = AppointmentSerializer
    filterset_fields = ["status", "counsellor", "student", "mode", "priority"]
    search_fields = ["student__full_name", "lead__name", "location"]
    ordering_fields = ["date", "time", "created_at"]

    def perform_create(self, serializer):
        serializer.save(counsellor=serializer.validated_data.get("counsellor") or self.request.user)


class VisaApplicationViewSet(DeskViewSet):
    queryset = VisaApplication.objects.select_related("student", "destination")
    serializer_class = VisaApplicationSerializer
    filterset_fields = ["status", "student", "destination"]
    search_fields = ["student__full_name", "visa_type"]
