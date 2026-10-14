from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .models import ROLE_CHOICES, ROLE_MODULES, Profile, get_role

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(choices=ROLE_CHOICES, write_only=True)
    phone = serializers.CharField(required=False, allow_blank=True, write_only=True)
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    email = serializers.EmailField(required=True)
    username = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = [
            "id", "username", "first_name", "last_name", "email",
            "is_active", "role", "phone", "password", "last_login", "date_joined",
        ]
        read_only_fields = ["last_login", "date_joined"]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["role"] = get_role(instance) or "telecaller"
        data["phone"] = getattr(getattr(instance, "profile", None), "phone", "")
        return data

    def validate_email(self, value):
        value = value.strip().lower()
        taken = User.objects.filter(email__iexact=value)
        if self.instance:
            taken = taken.exclude(pk=self.instance.pk)
        if taken.exists():
            raise serializers.ValidationError("Another user already has this email.")
        return value

    def validate_password(self, value):
        if value:
            validate_password(value)
        return value

    def validate(self, attrs):
        if self.instance is None and not attrs.get("password"):
            raise serializers.ValidationError({"password": "A password is required."})
        return attrs

    def _save_profile(self, user, role, phone):
        profile, _ = Profile.objects.get_or_create(user=user)
        user.profile = profile
        if role is not None:
            profile.role = role
            # Keep Django's own flag in step so the Django admin stays usable for admins.
            user.is_staff = role == "admin"
            user.save(update_fields=["is_staff"])
        if phone is not None:
            profile.phone = phone
        profile.save()

    def create(self, validated_data):
        role = validated_data.pop("role")
        phone = validated_data.pop("phone", "")
        password = validated_data.pop("password")
        user = User(username=validated_data["email"], **validated_data)
        user.set_password(password)
        user.save()
        self._save_profile(user, role, phone)
        return user

    def update(self, instance, validated_data):
        role = validated_data.pop("role", None)
        phone = validated_data.pop("phone", None)
        password = validated_data.pop("password", "")
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if not instance.is_superuser and "email" in validated_data:
            instance.username = validated_data["email"]
        if password:
            instance.set_password(password)
        instance.save()
        if not instance.is_superuser:
            self._save_profile(instance, role, phone)
        return instance


def me_payload(user):
    role = get_role(user)
    return {
        "id": user.id,
        "username": user.username,
        "name": user.get_full_name() or user.username,
        "email": user.email,
        "role": role,
        "modules": ROLE_MODULES.get(role, []),
    }
