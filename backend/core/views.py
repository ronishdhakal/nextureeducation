import os
import uuid

from django.core.files.storage import default_storage
from rest_framework import status, viewsets
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import ContentWritePermission

from .models import Branch, SiteSettings, TeamMember
from .permissions import PublishedQuerysetMixin
from .serializers import BranchSerializer, SiteSettingsSerializer, TeamMemberSerializer

EDITOR_UPLOAD_TYPES = {
    ".jpg": "image",
    ".jpeg": "image",
    ".png": "image",
    ".webp": "image",
    ".gif": "image",
    ".pdf": "document",
}
EDITOR_UPLOAD_MAX_BYTES = 10 * 1024 * 1024


class EditorMediaUploadView(APIView):
    """Lets the admin rich-text editor embed images and attach PDFs.

    Stateless by design: files land in storage under editor-uploads/ and the
    URL is handed straight back for the editor to insert into the HTML. No
    separate media-library model, since nothing else needs to query these.
    """

    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser]

    def post(self, request):
        upload = request.FILES.get("file")
        if not upload:
            return Response({"detail": "No file provided."}, status=status.HTTP_400_BAD_REQUEST)

        ext = os.path.splitext(upload.name)[1].lower()
        kind = EDITOR_UPLOAD_TYPES.get(ext)
        if not kind:
            return Response(
                {"detail": "Unsupported file type. Use JPG, PNG, WEBP, GIF or PDF."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if upload.size > EDITOR_UPLOAD_MAX_BYTES:
            return Response(
                {"detail": "File is too large. Maximum size is 10MB."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        saved_path = default_storage.save(f"editor-uploads/{uuid.uuid4().hex}{ext}", upload)
        url = request.build_absolute_uri(default_storage.url(saved_path))
        return Response(
            {"url": url, "name": upload.name, "type": kind}, status=status.HTTP_201_CREATED
        )


class SiteSettingsView(APIView):
    """Singleton site settings — GET is public, PUT/PATCH requires auth."""

    permission_classes = [ContentWritePermission]

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
