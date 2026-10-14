from rest_framework import viewsets

from core.permissions import PublishedQuerysetMixin, SlugOrPkLookupMixin

from .models import Event
from .serializers import EventSerializer


class EventViewSet(SlugOrPkLookupMixin, PublishedQuerysetMixin, viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    lookup_field = "slug"
    filterset_fields = ["category", "is_published"]
    ordering_fields = ["event_date", "title"]
    search_fields = ["title", "summary", "venue"]
