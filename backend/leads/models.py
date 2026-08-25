from django.db import models

from destinations.models import Destination


class Lead(models.Model):
    STATUS_CHOICES = [
        ("new", "New"),
        ("contacted", "Contacted"),
        ("qualified", "Qualified"),
        ("closed", "Closed"),
    ]

    LEVEL_CHOICES = [
        ("foundation", "Foundation"),
        ("diploma", "Diploma"),
        ("bachelor", "Bachelor"),
        ("master", "Master"),
        ("phd", "PhD"),
        ("undecided", "Not sure yet"),
    ]

    name = models.CharField(max_length=120)
    phone = models.CharField(max_length=30)
    email = models.EmailField(blank=True)
    preferred_destination = models.ForeignKey(
        Destination, null=True, blank=True, on_delete=models.SET_NULL, related_name="leads"
    )
    preferred_level = models.CharField(
        max_length=20, choices=LEVEL_CHOICES, blank=True, default="undecided"
    )
    message = models.TextField(blank=True)
    source_page = models.CharField(max_length=150, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="new")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} ({self.get_status_display()})"
