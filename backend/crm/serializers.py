from rest_framework import serializers

from .models import Appointment, Application, Document, Student, VisaApplication


def user_name(user):
    return (user.get_full_name() or user.username) if user else ""


class StudentSerializer(serializers.ModelSerializer):
    destination_name = serializers.CharField(source="destination.name", read_only=True, default="")
    university_name = serializers.CharField(
        source="preferred_university.name", read_only=True, default=""
    )
    counsellor_name = serializers.SerializerMethodField()
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    application_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = Student
        fields = "__all__"
        read_only_fields = ["lead", "created_at", "updated_at"]

    def get_counsellor_name(self, obj):
        return user_name(obj.counsellor)


class ApplicationSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.full_name", read_only=True)
    university_name = serializers.CharField(source="university.name", read_only=True, default="")
    destination_name = serializers.CharField(source="destination.name", read_only=True, default="")
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Application
        fields = "__all__"
        read_only_fields = ["created_at", "updated_at"]


class DocumentSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.full_name", read_only=True)
    doc_type_display = serializers.CharField(source="get_doc_type_display", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Document
        fields = "__all__"
        read_only_fields = ["uploaded_by", "created_at"]


class AppointmentSerializer(serializers.ModelSerializer):
    person_name = serializers.SerializerMethodField()
    person_email = serializers.SerializerMethodField()
    person_phone = serializers.SerializerMethodField()
    counsellor_name = serializers.SerializerMethodField()
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    priority_display = serializers.CharField(source="get_priority_display", read_only=True)
    mode_display = serializers.CharField(source="get_mode_display", read_only=True)

    class Meta:
        model = Appointment
        fields = "__all__"
        read_only_fields = ["created_at"]

    def _person(self, obj):
        return obj.student or obj.lead

    def get_person_name(self, obj):
        p = self._person(obj)
        return (getattr(p, "full_name", None) or getattr(p, "name", "")) if p else ""

    def get_person_email(self, obj):
        p = self._person(obj)
        return p.email if p else ""

    def get_person_phone(self, obj):
        p = self._person(obj)
        return p.phone if p else ""

    def get_counsellor_name(self, obj):
        return user_name(obj.counsellor)

    def validate(self, attrs):
        student = attrs.get("student", getattr(self.instance, "student", None))
        lead = attrs.get("lead", getattr(self.instance, "lead", None))
        if not student and not lead:
            raise serializers.ValidationError("Choose a student (or an inquiry) for this appointment.")
        return attrs


class VisaApplicationSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.full_name", read_only=True)
    destination_name = serializers.CharField(source="destination.name", read_only=True, default="")
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = VisaApplication
        fields = "__all__"
        read_only_fields = ["created_at", "updated_at"]
