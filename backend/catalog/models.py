from django.db import models

from core.models import Orderable, TimeStamped
from destinations.models import Destination


class University(TimeStamped, Orderable):
    name = models.CharField(max_length=150)
    country = models.ForeignKey(
        Destination, related_name="universities", on_delete=models.CASCADE
    )
    logo = models.ImageField(upload_to="universities/logos/", blank=True, null=True)
    city = models.CharField(max_length=100, blank=True)
    ranking_note = models.CharField(max_length=150, blank=True)
    programs_summary = models.TextField(blank=True)
    external_link = models.URLField(blank=True)
    is_partner = models.BooleanField(default=True)
    is_published = models.BooleanField(default=True)

    class Meta(Orderable.Meta):
        verbose_name_plural = "Universities"

    def __str__(self):
        return self.name


class Program(TimeStamped):
    LEVEL_CHOICES = [
        ("foundation", "Foundation"),
        ("diploma", "Diploma"),
        ("bachelor", "Bachelor"),
        ("master", "Master"),
        ("phd", "PhD"),
    ]

    level = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    field_of_study = models.CharField(max_length=150)
    destinations = models.ManyToManyField(Destination, related_name="programs", blank=True)
    is_published = models.BooleanField(default=True)

    class Meta:
        ordering = ["field_of_study"]

    def __str__(self):
        return f"{self.get_level_display()} — {self.field_of_study}"
