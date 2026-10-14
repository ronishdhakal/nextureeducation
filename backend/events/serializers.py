from rest_framework import serializers

from .models import Event


class EventSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source="get_category_display", read_only=True)

    class Meta:
        model = Event
        fields = "__all__"
