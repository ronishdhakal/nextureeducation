from django.contrib import admin

from .models import CallLog, Lead


class CallLogInline(admin.TabularInline):
    model = CallLog
    extra = 0
    fields = ["outcome", "notes", "follow_up_at", "created_by", "created_at"]
    readonly_fields = ["created_by", "created_at"]


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ["name", "phone", "preferred_destination", "temperature", "status", "created_at"]
    list_editable = ["status", "temperature"]
    list_filter = ["status", "temperature", "preferred_destination", "preferred_level"]
    search_fields = ["name", "phone", "email"]
    date_hierarchy = "created_at"
    inlines = [CallLogInline]


@admin.register(CallLog)
class CallLogAdmin(admin.ModelAdmin):
    list_display = ["lead", "outcome", "follow_up_at", "created_by", "created_at"]
    list_filter = ["outcome"]
    search_fields = ["lead__name", "notes"]
    date_hierarchy = "created_at"
