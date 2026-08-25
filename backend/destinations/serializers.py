from rest_framework import serializers

from .models import Destination


class DestinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destination
        fields = "__all__"


class DestinationListSerializer(serializers.ModelSerializer):
    """Lighter payload for grid/list views."""

    class Meta:
        model = Destination
        fields = [
            "id",
            "name",
            "slug",
            "country_code",
            "flag_image",
            "summary",
            "popular_intakes",
            "is_featured",
            "is_published",
            "order",
        ]
