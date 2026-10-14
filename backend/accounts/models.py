from django.conf import settings
from django.db import models

ADMIN = "admin"
COUNSELLOR = "counsellor"
TELECALLER = "telecaller"
CONTENT_MANAGER = "content_manager"

ROLE_CHOICES = [
    (ADMIN, "Admin"),
    (COUNSELLOR, "Counsellor"),
    (TELECALLER, "Telecaller"),
    (CONTENT_MANAGER, "Content manager"),
]

# Which areas of the admin panel each role can open. The frontend hides nav
# entries from this list; the API enforces the same rules independently.
ROLE_MODULES = {
    ADMIN: ["dashboard", "leads", "students", "content", "users", "settings"],
    COUNSELLOR: ["dashboard", "leads", "students"],
    TELECALLER: ["dashboard", "leads"],
    CONTENT_MANAGER: ["dashboard", "content"],
}


class Profile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile"
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=TELECALLER)
    phone = models.CharField(max_length=30, blank=True)

    def __str__(self):
        return f"{self.user.username} ({self.get_role_display()})"


def get_role(user):
    """Role for a user. Superusers are always admins; a staff user created
    before roles existed has no profile and keeps full access."""
    if not user or not user.is_authenticated:
        return None
    if user.is_superuser:
        return ADMIN
    profile = getattr(user, "profile", None)
    if profile:
        return profile.role
    return ADMIN if user.is_staff else None
