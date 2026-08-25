from django.contrib import admin

from .models import Service, TestPrep


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ["title", "is_published", "order"]
    list_editable = ["order"]
    prepopulated_fields = {"slug": ("title",)}


@admin.register(TestPrep)
class TestPrepAdmin(admin.ModelAdmin):
    list_display = ["name", "is_published", "order"]
    list_editable = ["order"]
    prepopulated_fields = {"slug": ("name",)}
