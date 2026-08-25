from django.contrib import admin

from .models import Lead


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ["name", "phone", "preferred_destination", "status", "created_at"]
    list_editable = ["status"]
    list_filter = ["status", "preferred_destination", "preferred_level"]
    search_fields = ["name", "phone", "email"]
    date_hierarchy = "created_at"
