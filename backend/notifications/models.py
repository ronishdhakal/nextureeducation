from django.conf import settings
from django.db import models


class Notification(models.Model):
    TYPE_CHOICES = [
        ("new_inquiry", "New Inquiry"),
        ("lead_assigned", "Lead Assigned"),
        ("event", "Event Announcement"),
    ]

    type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    message = models.CharField(max_length=300)
    related_to = models.CharField(max_length=50, blank=True)
    link = models.CharField(max_length=200, blank=True, help_text="Admin path to open")
    # Addressed either to one person, or to everyone holding one of these roles.
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="notifications",
    )
    roles = models.CharField(max_length=100, blank=True, help_text="Comma separated roles")
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.message


def notify(type, message, related="", link="", user=None, roles=""):
    return Notification.objects.create(
        type=type, message=message[:300], related_to=related, link=link, user=user, roles=roles
    )
