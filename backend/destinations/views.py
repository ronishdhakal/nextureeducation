from django.db.models import Count
from rest_framework import viewsets

from core.permissions import PublishedQuerysetMixin, SlugOrPkLookupMixin

from .models import Destination
from .serializers import DestinationListSerializer, DestinationSerializer


class DestinationViewSet(SlugOrPkLookupMixin, PublishedQuerysetMixin, viewsets.ModelViewSet):
    queryset = Destination.objects.all()
    lookup_field = "slug"
    filterset_fields = ["is_featured", "is_published"]
    ordering_fields = ["order", "name"]
    search_fields = ["name", "summary"]

    def get_queryset(self):
        return super().get_queryset().annotate(university_count=Count("universities"))

    def get_serializer_class(self):
        if self.action == "list":
            return DestinationListSerializer
        return DestinationSerializer
