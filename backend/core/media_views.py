from django.core.files.storage import default_storage
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import AdminOnly

from .media_library import describe, list_media, referenced_media


class MediaLibraryView(APIView):
    """List stored files with search, folder filter and paging. Admin only: the
    bucket also holds private student documents."""

    permission_classes = [AdminOnly]

    def get(self, request):
        q = request.query_params.get("q", "").strip().lower()
        folder = request.query_params.get("folder", "").strip()
        try:
            page = max(1, int(request.query_params.get("page", 1)))
            page_size = min(100, max(1, int(request.query_params.get("page_size", 24))))
        except ValueError:
            page, page_size = 1, 24

        items = list_media()

        # folder facets are computed before filtering so the dropdown stays complete
        folders = {}
        for i in items:
            top = i["key"].split("/")[0] if "/" in i["key"] else ""
            folders[top] = folders.get(top, 0) + 1

        if folder:
            items = [i for i in items if (i["key"].split("/")[0] if "/" in i["key"] else "") == folder]
        if q:
            items = [i for i in items if q in i["key"].lower()]

        total = len(items)
        total_size = sum(i["size"] for i in items)
        start = (page - 1) * page_size
        used_keys, text_blob = referenced_media()
        results = [describe(i, used_keys, text_blob) for i in items[start : start + page_size]]

        return Response(
            {
                "count": total,
                "total_size": total_size,
                "page": page,
                "page_size": page_size,
                "folders": [{"name": n, "count": c} for n, c in sorted(folders.items())],
                "results": results,
            }
        )


class MediaDeleteView(APIView):
    permission_classes = [AdminOnly]

    def post(self, request):
        keys = request.data.get("keys") or []
        force = bool(request.data.get("force"))
        if not isinstance(keys, list) or not keys:
            return Response({"detail": "Select at least one file."}, status=400)
        if len(keys) > 500:
            return Response({"detail": "Delete at most 500 files at a time."}, status=400)

        # Only keys that really exist in storage can be deleted: no arbitrary paths.
        existing = {i["key"]: i for i in list_media()}
        used_keys, text_blob = referenced_media()

        deleted, skipped_in_use, missing = [], [], []
        for key in keys:
            if key not in existing:
                missing.append(key)
                continue
            in_use = key in used_keys or key in text_blob
            if in_use and not force:
                skipped_in_use.append(key)
                continue
            default_storage.delete(key)
            deleted.append(key)

        return Response(
            {"deleted": deleted, "skipped_in_use": skipped_in_use, "missing": missing}
        )
