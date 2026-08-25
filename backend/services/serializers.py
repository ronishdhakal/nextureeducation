from rest_framework import serializers

from .models import Service, TestPrep


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = "__all__"


class TestPrepSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestPrep
        fields = "__all__"
