from django.contrib import admin

from .models import BlogPost, Page, Testimonial


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ["student_name", "destination", "year", "is_featured", "is_published", "order"]
    list_editable = ["order"]
    list_filter = ["destination", "is_featured"]


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ["title", "author", "published_at", "is_published"]
    prepopulated_fields = {"slug": ("title",)}
    search_fields = ["title"]


@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ["title", "is_published"]
    prepopulated_fields = {"slug": ("title",)}
