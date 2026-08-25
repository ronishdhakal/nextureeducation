from rest_framework import serializers

from .models import Program, University


class UniversitySerializer(serializers.ModelSerializer):
    country_name = serializers.CharField(source="country.name", read_only=True)

    class Meta:
        model = University
        fields = "__all__"


class ProgramSerializer(serializers.ModelSerializer):
    level_display = serializers.CharField(source="get_level_display", read_only=True)

    class Meta:
        model = Program
        fields = "__all__"
