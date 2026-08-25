from django.db import models
from django.utils.text import slugify

from core.models import Orderable, SEOFields, TimeStamped


class Service(TimeStamped, SEOFields, Orderable):
    title = models.CharField(max_length=120)
    slug = models.SlugField(max_length=130, unique=True, blank=True)
    icon = models.CharField(
        max_length=50, blank=True, help_text="Icon key rendered by the frontend"
    )
    short_description = models.CharField(max_length=200)
    long_description = models.TextField(blank=True)
    is_published = models.BooleanField(default=True)

    class Meta(Orderable.Meta):
        pass

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)


class TestPrep(TimeStamped, SEOFields, Orderable):
    name = models.CharField(max_length=50, help_text="e.g. IELTS, PTE, SAT")
    slug = models.SlugField(max_length=60, unique=True, blank=True)
    description = models.TextField(blank=True)
    format_note = models.CharField(
        max_length=200, blank=True, help_text="e.g. Academic & General, computer-delivered"
    )
    schedule_note = models.CharField(max_length=200, blank=True)
    fees_note = models.CharField(max_length=120, blank=True)
    is_published = models.BooleanField(default=True)

    class Meta(Orderable.Meta):
        verbose_name = "Test Prep"
        verbose_name_plural = "Test Prep"

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
