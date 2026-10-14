from django.contrib.auth import get_user_model
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ADMIN, COUNSELLOR, TELECALLER, get_role
from .permissions import AdminOnly
from .serializers import UserSerializer, me_payload

User = get_user_model()


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(me_payload(request.user))


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.select_related("profile").order_by("username")
    serializer_class = UserSerializer
    permission_classes = [AdminOnly]
    search_fields = ["username", "first_name", "last_name", "email"]

    def get_permissions(self):
        if self.action == "assignable":
            return [IsAuthenticated()]
        return super().get_permissions()

    def perform_destroy(self, instance):
        if instance.pk == self.request.user.pk:
            raise ValidationError("You cannot delete your own account.")
        instance.delete()

    def perform_update(self, serializer):
        if serializer.instance.pk == self.request.user.pk and (
            serializer.validated_data.get("is_active") is False
            or serializer.validated_data.get("role", ADMIN) != ADMIN
        ):
            raise ValidationError("You cannot deactivate or demote your own account.")
        serializer.save()

    @action(detail=False, methods=["get"])
    def assignable(self, request):
        """Staff a lead can be assigned to; used by the lead screens."""
        if get_role(request.user) not in {ADMIN, COUNSELLOR}:
            raise PermissionDenied()
        users = [
            u
            for u in User.objects.filter(is_active=True).select_related("profile")
            if get_role(u) in {ADMIN, COUNSELLOR, TELECALLER}
        ]
        return Response(
            [
                {"id": u.id, "name": u.get_full_name() or u.username, "role": get_role(u)}
                for u in users
            ]
        )
