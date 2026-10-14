from django.contrib import admin

from .models import Appointment, Application, Document, Student, VisaApplication

for model in (Student, Application, Document, Appointment, VisaApplication):
    admin.site.register(model)
