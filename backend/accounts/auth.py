from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

User = get_user_model()


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Sign in with email + password. The email is resolved to the account's
    username, so Django's own username-based auth keeps working underneath."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields.pop("username", None)
        self.fields["email"] = serializers.EmailField()

    def validate(self, attrs):
        email = attrs.get("email", "").strip()
        user = User.objects.filter(email__iexact=email).order_by("id").first()
        # Same message for an unknown email and a wrong password.
        attrs["username"] = user.get_username() if user else "\x00"
        attrs.pop("email", None)
        return super().validate(attrs)


class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer
