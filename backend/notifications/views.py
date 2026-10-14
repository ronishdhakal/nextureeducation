from django.db.models import Q
from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from accounts.models import get_role

from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    type_display = serializers.CharField(source="get_type_display", read_only=True)

    class Meta:
        model = Notification
        fields = ["id", "type", "type_display", "message", "related_to", "link", "is_read", "created_at"]
        read_only_fields = ["type", "message", "related_to", "link", "created_at"]


class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["type", "is_read"]
    ordering_fields = ["created_at"]
    search_fields = ["message"]
    http_method_names = ["get", "patch", "delete", "post", "head", "options"]

    def get_queryset(self):
        user = self.request.user
        role = get_role(user) or ""
        mine = Q(user=user) | Q(user__isnull=True, roles__contains=role) if role else Q(user=user)
        return Notification.objects.filter(mine)

    def create(self, request, *args, **kwargs):
        return Response(status=405)

    @action(detail=False, methods=["get"])
    def unread_count(self, request):
        return Response({"count": self.get_queryset().filter(is_read=False).count()})

    @action(detail=False, methods=["post"])
    def mark_all_read(self, request):
        updated = self.get_queryset().filter(is_read=False).update(is_read=True)
        return Response({"updated": updated})
