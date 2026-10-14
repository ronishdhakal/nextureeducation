from rest_framework import serializers

from .models import CallLog, Lead


class LeadSerializer(serializers.ModelSerializer):
    """Used for the admin inbox — full read/write."""

    destination_name = serializers.CharField(
        source="preferred_destination.name", read_only=True, default=""
    )
    assigned_to_name = serializers.SerializerMethodField()

    class Meta:
        model = Lead
        fields = "__all__"
        read_only_fields = ["created_at", "updated_at", "next_follow_up"]

    def get_assigned_to_name(self, obj):
        user = obj.assigned_to
        return (user.get_full_name() or user.username) if user else ""


class LeadCreateSerializer(serializers.ModelSerializer):
    """Used by the public inquiry forms. Includes an honeypot field."""

    website = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = Lead
        fields = [
            "name",
            "phone",
            "email",
            "preferred_destination",
            "preferred_level",
            "message",
            "source_page",
            "website",
        ]

    def validate_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Please tell us your name.")
        return value.strip()

    def validate_phone(self, value):
        digits = "".join(ch for ch in value if ch.isdigit())
        if len(digits) < 7:
            raise serializers.ValidationError("Please enter a valid phone number.")
        return value.strip()


class CallLogSerializer(serializers.ModelSerializer):
    created_by_username = serializers.CharField(
        source="created_by.username", read_only=True, default=""
    )

    class Meta:
        model = CallLog
        fields = "__all__"
        read_only_fields = ["created_by", "created_at"]
