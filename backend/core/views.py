from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Branch, SiteSettings, TeamMember
from .permissions import PublishedQuerysetMixin
from .serializers import BranchSerializer, SiteSettingsSerializer, TeamMemberSerializer


class SiteSettingsView(APIView):
    """Singleton site settings — GET is public, PUT/PATCH requires auth."""

    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        return Response(SiteSettingsSerializer(SiteSettings.load()).data)

    def put(self, request):
        return self._update(request)

    def patch(self, request):
        return self._update(request, partial=True)

    def _update(self, request, partial=False):
        instance = SiteSettings.load()
        serializer = SiteSettingsSerializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class BranchViewSet(PublishedQuerysetMixin, viewsets.ModelViewSet):
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer
    published_field = "is_active"
    filterset_fields = ["is_head_office", "is_active"]
    ordering_fields = ["order", "name"]
    search_fields = ["name", "address"]


class TeamMemberViewSet(PublishedQuerysetMixin, viewsets.ModelViewSet):
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer
    published_field = "is_active"
    ordering_fields = ["order", "name"]
    search_fields = ["name", "role"]
