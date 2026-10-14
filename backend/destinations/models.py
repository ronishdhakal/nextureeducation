from django.db import models
from django.utils.text import slugify

from core.models import Orderable, SEOFields, TimeStamped


class Destination(TimeStamped, SEOFields, Orderable):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=110, unique=True, blank=True)
    country_code = models.CharField(
        max_length=8, blank=True, help_text="Short code used in UI, e.g. AUS, CAN, USA"
    )
    flag_image = models.ImageField(upload_to="destinations/flags/", blank=True, null=True)
    hero_image = models.ImageField(upload_to="destinations/hero/", blank=True, null=True)

    summary = models.CharField(
        max_length=280, help_text="Short teaser shown on destination cards"
    )
    cost_overview = models.TextField(blank=True, help_text="Rich text: tuition & living costs")
    intake_overview = models.TextField(blank=True, help_text="Rich text: intake seasons")
    visa_overview = models.TextField(blank=True, help_text="Rich text: visa process")
    eligibility_overview = models.TextField(
        blank=True, help_text="Rich text: entry requirements, eligibility"
    )
    why_study_overview = models.TextField(
        blank=True, help_text="Rich text: why study here, what makes it worth choosing"
    )
    popular_courses_overview = models.TextField(
        blank=True, help_text="Rich text: popular fields of study, in-demand courses"
    )
    documents_overview = models.TextField(
        blank=True, help_text="Rich text: documents required for the application"
    )
    scholarships_overview = models.TextField(
        blank=True, help_text="Rich text: scholarships & financial aid options"
    )
    additional_info = models.TextField(
        blank=True,
        help_text="Rich text: anything else specific to this destination that doesn't fit the other sections",
    )
    key_highlights = models.TextField(
        blank=True, help_text="One highlight per line, shown as cards on the detail page"
    )
    why_choose_points = models.TextField(
        blank=True, help_text="One short point per line, shown as chips under 'Why choose'"
    )
    study_areas = models.TextField(
        blank=True, help_text="One field of study per line, e.g. Engineering"
    )
    popular_intakes = models.CharField(
        max_length=200, blank=True, help_text="e.g. February, July, September"
    )

    is_featured = models.BooleanField(default=False)
    is_published = models.BooleanField(default=True)

    class Meta(Orderable.Meta):
        pass

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
