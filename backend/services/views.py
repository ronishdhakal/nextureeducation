from rest_framework import viewsets

from core.permissions import PublishedQuerysetMixin, SlugOrPkLookupMixin

from .models import Service, TestPrep
from .serializers import ServiceSerializer, TestPrepSerializer


class ServiceViewSet(SlugOrPkLookupMixin, PublishedQuerysetMixin, viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    lookup_field = "slug"
    ordering_fields = ["order", "title"]
    search_fields = ["title", "short_description"]


class TestPrepViewSet(SlugOrPkLookupMixin, PublishedQuerysetMixin, viewsets.ModelViewSet):
    queryset = TestPrep.objects.all()
    serializer_class = TestPrepSerializer
    lookup_field = "slug"
    ordering_fields = ["order", "name"]
    search_fields = ["name"]
