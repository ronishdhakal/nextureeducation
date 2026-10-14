import os
import uuid

from django.conf import settings
from django.db import models

from catalog.models import University
from destinations.models import Destination


def document_upload_path(instance, filename):
    """Unguessable file names: student documents (passports, transcripts) must
    never be discoverable by guessing a URL."""
    ext = os.path.splitext(filename)[1].lower()
    return f"student-documents/{uuid.uuid4().hex}{ext}"


class Student(models.Model):
    STATUS_CHOICES = [
        ("active", "Active"),
        ("on_hold", "On hold"),
        ("completed", "Completed"),
    ]
    GENDER_CHOICES = [("male", "Male"), ("female", "Female"), ("other", "Other")]
    EDUCATION_CHOICES = [
        ("high_school", "High school (+2)"),
        ("diploma", "Diploma"),
        ("bachelor", "Bachelor's"),
        ("master", "Master's"),
        ("other", "Other"),
    ]

    full_name = models.CharField(max_length=150)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=30)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True)
    address = models.CharField(max_length=255, blank=True)
    photo = models.ImageField(upload_to="students/photos/", blank=True, null=True)

    current_education_level = models.CharField(max_length=20, choices=EDUCATION_CHOICES, blank=True)
    field_of_study = models.CharField(max_length=150, blank=True)
    destination = models.ForeignKey(
        Destination, null=True, blank=True, on_delete=models.SET_NULL, related_name="students"
    )
    preferred_university = models.ForeignKey(
        University, null=True, blank=True, on_delete=models.SET_NULL, related_name="students"
    )

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")
    counsellor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="students",
    )
    lead = models.OneToOneField(
        "leads.Lead", null=True, blank=True, on_delete=models.SET_NULL, related_name="student"
    )
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.full_name


class Application(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("in_progress", "In progress"),
        ("submitted", "Submitted"),
        ("offer_received", "Offer received"),
        ("accepted", "Offer accepted"),
        ("enrolled", "Enrolled"),
        ("rejected", "Rejected"),
        ("withdrawn", "Withdrawn"),
    ]

    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="applications")
    university = models.ForeignKey(
        University, null=True, blank=True, on_delete=models.SET_NULL, related_name="applications"
    )
    destination = models.ForeignKey(
        Destination, null=True, blank=True, on_delete=models.SET_NULL, related_name="applications"
    )
    course = models.CharField(max_length=200, blank=True, help_text="Program applied for")
    intake = models.CharField(max_length=60, blank=True, help_text="e.g. February 2027")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    applied_on = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.student} to {self.university or 'university TBD'}"

    def save(self, *args, **kwargs):
        if self.university_id and not self.destination_id:
            self.destination_id = self.university.country_id
        super().save(*args, **kwargs)


class Document(models.Model):
    TYPE_CHOICES = [
        ("passport", "Passport copy"),
        ("transcript", "Academic transcript"),
        ("certificate", "Certificate"),
        ("cv", "CV / Resume"),
        ("sop", "Statement of purpose"),
        ("lor", "Letter of recommendation"),
        ("english_test", "English test score"),
        ("financial", "Financial document"),
        ("photo", "Photograph"),
        ("other", "Other"),
    ]
    STATUS_CHOICES = [
        ("pending", "Pending review"),
        ("verified", "Verified"),
        ("rejected", "Rejected"),
    ]

    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="documents")
    application = models.ForeignKey(
        Application, null=True, blank=True, on_delete=models.SET_NULL, related_name="documents"
    )
    doc_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default="other")
    title = models.CharField(max_length=150, blank=True)
    file = models.FileField(upload_to=document_upload_path)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    notes = models.CharField(max_length=255, blank=True)
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.get_doc_type_display()} for {self.student}"


class Appointment(models.Model):
    STATUS_CHOICES = [
        ("scheduled", "Scheduled"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
        ("no_show", "No show"),
    ]
    PRIORITY_CHOICES = [("low", "Low"), ("medium", "Medium"), ("high", "High")]
    MODE_CHOICES = [("in_office", "In office"), ("online", "Online"), ("phone", "Phone call")]

    student = models.ForeignKey(
        Student, null=True, blank=True, on_delete=models.CASCADE, related_name="appointments"
    )
    lead = models.ForeignKey(
        "leads.Lead", null=True, blank=True, on_delete=models.CASCADE, related_name="appointments"
    )
    counsellor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="appointments",
    )
    date = models.DateField()
    time = models.TimeField()
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default="medium")
    mode = models.CharField(max_length=10, choices=MODE_CHOICES, default="in_office")
    location = models.CharField(max_length=255, blank=True, help_text="Meeting link or office location")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="scheduled")
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["date", "time"]

    def __str__(self):
        return f"{self.date} {self.time}"


class VisaApplication(models.Model):
    STATUS_CHOICES = [
        ("preparing", "Preparing"),
        ("documents_ready", "Documents ready"),
        ("interview_scheduled", "Interview scheduled"),
        ("submitted", "Submitted"),
        ("granted", "Granted"),
        ("refused", "Refused"),
    ]

    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="visa_applications")
    application = models.ForeignKey(
        Application, null=True, blank=True, on_delete=models.SET_NULL, related_name="visas"
    )
    destination = models.ForeignKey(
        Destination, null=True, blank=True, on_delete=models.SET_NULL, related_name="visa_applications"
    )
    visa_type = models.CharField(max_length=100, default="Student visa")
    status = models.CharField(max_length=25, choices=STATUS_CHOICES, default="preparing")
    interview_date = models.DateField(null=True, blank=True)
    submitted_on = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.student} {self.visa_type}"
