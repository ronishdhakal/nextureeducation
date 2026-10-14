from django.db import models


class TimeStamped(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class SEOFields(models.Model):
    meta_title = models.CharField(max_length=70, blank=True)
    meta_description = models.CharField(max_length=160, blank=True)
    og_image = models.ImageField(upload_to="seo/", blank=True, null=True)

    class Meta:
        abstract = True


class Orderable(models.Model):
    order = models.PositiveIntegerField(default=0)

    class Meta:
        abstract = True
        ordering = ["order"]


class SiteSettings(models.Model):
    """Singleton holding site-wide editable content."""

    logo = models.ImageField(upload_to="site/", blank=True, null=True)
    phone = models.CharField(max_length=30, blank=True)
    email = models.EmailField(blank=True)
    address = models.CharField(max_length=255, blank=True)
    whatsapp_number = models.CharField(max_length=30, blank=True)

    facebook_url = models.URLField(blank=True)
    instagram_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    youtube_url = models.URLField(blank=True)
    tiktok_url = models.URLField(blank=True)

    hero_eyebrow = models.CharField(max_length=100, blank=True)
    hero_headline = models.CharField(max_length=200, blank=True)
    hero_subcopy = models.TextField(blank=True)

    stat_students_placed = models.CharField(max_length=20, blank=True)
    stat_partner_universities = models.CharField(max_length=20, blank=True)
    stat_visa_success_rate = models.CharField(max_length=20, blank=True)
    stat_countries = models.CharField(max_length=20, blank=True)

    class Meta:
        verbose_name = "Site Settings"
        verbose_name_plural = "Site Settings"

    def __str__(self):
        return "Site Settings"

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        pass

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class Branch(TimeStamped, Orderable):
    name = models.CharField(max_length=120)
    address = models.CharField(max_length=255)
    phone = models.CharField(max_length=30, blank=True)
    email = models.EmailField(blank=True)
    map_link = models.URLField(blank=True)
    is_head_office = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    class Meta(Orderable.Meta):
        verbose_name_plural = "Branches"

    def __str__(self):
        return self.name


class TeamMember(TimeStamped, Orderable):
    name = models.CharField(max_length=120)
    role = models.CharField(max_length=120)
    photo = models.ImageField(upload_to="team/", blank=True, null=True)
    bio = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    class Meta(Orderable.Meta):
        pass

    def __str__(self):
        return f"{self.name} ({self.role})"
