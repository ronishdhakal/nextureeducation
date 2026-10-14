from rest_framework import serializers

from .models import Destination


class DestinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destination
        fields = "__all__"


class DestinationListSerializer(serializers.ModelSerializer):
    """Lighter payload for grid/list views."""

    university_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = Destination
        fields = [
            "id",
            "name",
            "slug",
            "country_code",
            "flag_image",
            "hero_image",
            "summary",
            "popular_intakes",
            "university_count",
            "is_featured",
            "is_published",
            "order",
        ]
