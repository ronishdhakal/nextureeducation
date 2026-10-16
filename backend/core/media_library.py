"""Browse and delete the files in media storage (R2 bucket or the local media folder)."""

import os
from datetime import datetime, timezone

from django.apps import apps
from django.conf import settings
from django.core.files.storage import default_storage

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif"}
SKIP_APPS = {"admin", "auth", "contenttypes", "sessions"}


def list_media():
    """Every stored file as {key, size, modified}, newest first."""
    items = []
    if getattr(settings, "USE_R2_STORAGE", False):
        for obj in default_storage.bucket.objects.all():
            if obj.key.endswith("/"):
                continue
            items.append({"key": obj.key, "size": obj.size, "modified": obj.last_modified})
    else:
        root = str(settings.MEDIA_ROOT)
        for dirpath, _, files in os.walk(root):
            for name in files:
                full = os.path.join(dirpath, name)
                key = os.path.relpath(full, root).replace(os.sep, "/")
                stat = os.stat(full)
                items.append(
                    {
                        "key": key,
                        "size": stat.st_size,
                        "modified": datetime.fromtimestamp(stat.st_mtime, tz=timezone.utc),
                    }
                )
    items.sort(key=lambda i: i["modified"], reverse=True)
    return items


def referenced_media():
    """(file field values, one big string of all long text) so we can tell what is in use."""
    keys = set()
    texts = []
    for model in apps.get_models():
        if model._meta.app_label in SKIP_APPS:
            continue
        for field in model._meta.get_fields():
            if not getattr(field, "concrete", False) or field.many_to_many:
                continue
            kind = field.get_internal_type()
            if kind in ("FileField", "ImageField"):
                keys.update(v for v in model.objects.values_list(field.name, flat=True) if v)
            elif kind == "TextField":
                texts.extend(v for v in model.objects.values_list(field.name, flat=True) if v)
    return keys, "\n".join(texts)


def describe(item, used_keys, text_blob):
    key = item["key"]
    ext = os.path.splitext(key)[1].lower()
    return {
        "key": key,
        "name": os.path.basename(key),
        "folder": key.rsplit("/", 1)[0] if "/" in key else "",
        "size": item["size"],
        "modified": item["modified"].isoformat(),
        "url": default_storage.url(key),
        "is_image": ext in IMAGE_EXTENSIONS,
        "in_use": key in used_keys or key in text_blob,
    }
