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
    description = models.TextField(blank=True, help_text="Short blurb shown on cards")
    tagline = models.CharField(max_length=200, blank=True)
    hero_image = models.ImageField(upload_to="test-prep/", blank=True, null=True)
    about = models.TextField(blank=True, help_text="Rich text: 'About this test'")
    key_highlights = models.TextField(blank=True, help_text="One highlight per line")
    why_choose_points = models.TextField(
        blank=True, help_text="One per line, as 'Title | short detail'"
    )
    course_structure = models.TextField(
        blank=True,
        help_text="Blocks separated by a blank line. First line = section name "
        "(e.g. Listening), each following line = one bullet.",
    )
    duration = models.CharField(max_length=100, blank=True, help_text="e.g. 6-8 weeks")
    class_mode = models.CharField(max_length=100, blank=True, help_text="e.g. Online / Offline")
    batch_size = models.CharField(max_length=100, blank=True, help_text="e.g. Max 10 students")
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
