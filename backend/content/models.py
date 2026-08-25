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
