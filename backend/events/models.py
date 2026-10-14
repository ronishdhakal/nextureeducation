from django.db import models
from django.utils.text import slugify

from core.models import SEOFields, TimeStamped


class Event(TimeStamped, SEOFields):
    CATEGORY_CHOICES = [
        ("education-fair", "Education Fair"),
        ("university-session", "University Session"),
        ("webinar", "Webinar"),
        ("workshop", "Workshop"),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    category = models.CharField(
        max_length=30, choices=CATEGORY_CHOICES, default="education-fair"
    )
    cover_image = models.ImageField(upload_to="events/", blank=True, null=True)
    summary = models.CharField(max_length=280, help_text="Short teaser for cards and the hero")
    about = models.TextField(blank=True, help_text="Rich text: 'About the event'")

    event_date = models.DateField()
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    MODE_CHOICES = [
        ("in-person", "In person"),
        ("online", "Online"),
        ("hybrid", "Hybrid"),
    ]
    REGISTRATION_CHOICES = [
        ("open", "Open registration"),
        ("none", "No registration needed"),
        ("invite", "Invite only"),
    ]

    mode = models.CharField(max_length=20, choices=MODE_CHOICES, default="in-person")
    registration_type = models.CharField(
        max_length=20, choices=REGISTRATION_CHOICES, default="open"
    )
    organizer = models.CharField(max_length=150, default="Nexture Education")
    venue = models.CharField(max_length=200, blank=True, help_text="e.g. Kathmandu, Nepal")

    what_youll_discover = models.TextField(blank=True, help_text="One point per line")
    why_attend = models.TextField(blank=True, help_text="One point per line")
    who_should_attend = models.TextField(blank=True, help_text="One audience per line")
    what_to_expect = models.TextField(
        blank=True, help_text="One per line, as 'Title | short detail'"
    )

    is_published = models.BooleanField(default=True)

    class Meta:
        ordering = ["event_date", "start_time"]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
