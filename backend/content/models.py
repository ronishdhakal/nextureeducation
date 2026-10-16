from django.db import models
from django.utils.text import slugify

from core.models import Orderable, SEOFields, TimeStamped
from destinations.models import Destination


class Testimonial(TimeStamped, Orderable):
    student_name = models.CharField(max_length=120)
    photo = models.ImageField(upload_to="testimonials/", blank=True, null=True)
    destination = models.ForeignKey(
        Destination, null=True, blank=True, on_delete=models.SET_NULL, related_name="testimonials"
    )
    university = models.CharField(max_length=150, blank=True)
    headline = models.CharField(
        max_length=80, blank=True, help_text="Short title above the quote, e.g. Smooth and Stress-Free!"
    )
    rating = models.PositiveSmallIntegerField(default=5, help_text="1 to 5 stars")
    quote = models.TextField()
    year = models.PositiveIntegerField(null=True, blank=True)
    is_featured = models.BooleanField(default=False)
    is_published = models.BooleanField(default=True)

    class Meta(Orderable.Meta):
        pass

    def __str__(self):
        return self.student_name


class BlogPost(TimeStamped, SEOFields):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    CATEGORY_CHOICES = [
        ("study-abroad", "Study Abroad"),
        ("visa-guide", "Visa Guide"),
        ("scholarships", "Scholarships"),
        ("test-prep", "Test Prep"),
        ("news", "News"),
        ("general", "General"),
    ]

    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, default="general")
    cover_image = models.ImageField(upload_to="blog/covers/", blank=True, null=True)
    excerpt = models.CharField(max_length=280, blank=True)
    body = models.TextField()
    author = models.CharField(max_length=120, blank=True)
    published_at = models.DateTimeField(null=True, blank=True)
    is_published = models.BooleanField(default=True)

    class Meta:
        ordering = ["-published_at", "-created_at"]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)


class Page(TimeStamped, SEOFields):
    title = models.CharField(max_length=150)
    slug = models.SlugField(max_length=160, unique=True, blank=True)
    body = models.TextField()
    is_published = models.BooleanField(default=True)

    class Meta:
        ordering = ["title"]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)


class Popup(TimeStamped):
    """A square promotional popup (offer, intake notice, event) shown on the public site."""

    FREQUENCY_CHOICES = [
        ("session", "Once per visit"),
        ("daily", "Once a day"),
        ("always", "Every page load"),
    ]
    PAGES_CHOICES = [
        ("all", "Every page"),
        ("home", "Home page only"),
    ]

    title = models.CharField(max_length=150, help_text="Internal name, also used as the image description")
    image = models.ImageField(upload_to="popups/", help_text="Square image, 1080 x 1080 recommended")
    link_url = models.CharField(
        max_length=300, blank=True, help_text="Where the image links to: /contact, /events/some-fair or a full URL"
    )
    open_in_new_tab = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    start_at = models.DateTimeField(null=True, blank=True, help_text="Leave empty to start immediately")
    end_at = models.DateTimeField(null=True, blank=True, help_text="Leave empty to run until switched off")
    delay_seconds = models.PositiveSmallIntegerField(default=3, help_text="Seconds after the page loads")
    frequency = models.CharField(max_length=10, choices=FREQUENCY_CHOICES, default="session")
    show_on = models.CharField(max_length=10, choices=PAGES_CHOICES, default="all")

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title
