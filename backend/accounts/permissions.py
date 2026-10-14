from rest_framework.permissions import SAFE_METHODS, BasePermission

from .models import ADMIN, CONTENT_MANAGER, COUNSELLOR, TELECALLER, get_role

CONTENT_ROLES = {ADMIN, CONTENT_MANAGER}
CRM_ROLES = {ADMIN, COUNSELLOR, TELECALLER}


class ContentWritePermission(BasePermission):
    """Public content is readable by anyone; only admins and content managers edit it."""

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return get_role(request.user) in CONTENT_ROLES


class CRMPermission(BasePermission):
    def has_permission(self, request, view):
        return get_role(request.user) in CRM_ROLES


class AdminOnly(BasePermission):
    def has_permission(self, request, view):
        return get_role(request.user) == ADMIN


__all__ = [
    "ADMIN",
    "COUNSELLOR",
    "TELECALLER",
    "AdminOnly",
    "CRMPermission",
    "ContentWritePermission",
    "get_role",
]
