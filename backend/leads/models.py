from django.conf import settings
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

    TEMPERATURE_CHOICES = [
        ("hot", "Hot"),
        ("warm", "Warm"),
        ("cold", "Cold"),
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
    temperature = models.CharField(max_length=10, choices=TEMPERATURE_CHOICES, default="warm")
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="assigned_leads",
    )
    next_follow_up = models.DateTimeField(
        null=True, blank=True, help_text="Set from the latest call log"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} ({self.get_status_display()})"


class CallLog(models.Model):
    OUTCOME_CHOICES = [
        ("connected", "Connected"),
        ("no_answer", "No answer"),
        ("voicemail", "Left voicemail"),
        ("wrong_number", "Wrong number"),
        ("follow_up_scheduled", "Follow-up scheduled"),
    ]

    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name="call_logs")
    outcome = models.CharField(max_length=20, choices=OUTCOME_CHOICES, default="connected")
    notes = models.TextField(blank=True, help_text="What was discussed on the call")
    follow_up_at = models.DateTimeField(
        null=True, blank=True, help_text="When to call back, if a follow-up is needed"
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.lead.name}: {self.get_outcome_display()} ({self.created_at:%Y-%m-%d})"
