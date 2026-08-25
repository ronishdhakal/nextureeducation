from django.contrib import admin

from .models import Branch, SiteSettings, TeamMember


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(Branch)
class BranchAdmin(admin.ModelAdmin):
    list_display = ["name", "is_head_office", "is_active", "order"]
    list_editable = ["order"]


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ["name", "role", "is_active", "order"]
    list_editable = ["order"]
