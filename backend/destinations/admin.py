from django.contrib import admin

from .models import Destination


@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    list_display = ["name", "country_code", "is_featured", "is_published", "order"]
    list_editable = ["order", "is_featured", "is_published"]
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ["name"]
