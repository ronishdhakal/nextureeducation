from django.contrib import admin

from .models import Program, University


@admin.register(University)
class UniversityAdmin(admin.ModelAdmin):
    list_display = ["name", "country", "city", "is_partner", "is_published", "order"]
    list_editable = ["order"]
    list_filter = ["country", "is_partner"]
    search_fields = ["name", "city"]


@admin.register(Program)
class ProgramAdmin(admin.ModelAdmin):
    list_display = ["field_of_study", "level", "is_published"]
    list_filter = ["level"]
    filter_horizontal = ["destinations"]
