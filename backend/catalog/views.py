from rest_framework import viewsets

from core.permissions import PublishedQuerysetMixin

from .models import Program, University
from .serializers import ProgramSerializer, UniversitySerializer


class UniversityViewSet(PublishedQuerysetMixin, viewsets.ModelViewSet):
    queryset = University.objects.all()
    serializer_class = UniversitySerializer
    filterset_fields = ["country", "is_partner", "is_published"]
    ordering_fields = ["order", "name"]
    search_fields = ["name", "city"]


class ProgramViewSet(PublishedQuerysetMixin, viewsets.ModelViewSet):
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer
    filterset_fields = ["level", "destinations", "is_published"]
    search_fields = ["field_of_study"]
