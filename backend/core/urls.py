from rest_framework.routers import DefaultRouter

from accounts.views import MeView, UserViewSet
from crm.views import (
    AppointmentViewSet,
    ApplicationViewSet,
    DocumentViewSet,
    StudentViewSet,
    VisaApplicationViewSet,
)
from catalog.views import ProgramViewSet, UniversityViewSet
from content.views import BlogPostViewSet, PageViewSet, PopupViewSet, TestimonialViewSet
from destinations.views import DestinationViewSet
from events.views import EventViewSet
from notifications.views import NotificationViewSet
from leads.views import CallLogViewSet, LeadViewSet
from services.views import ServiceViewSet, TestPrepViewSet

from django.urls import include, path

from .media_views import MediaDeleteView, MediaLibraryView
from .views import (
    BranchViewSet,
    EditorMediaUploadView,
    SiteSettingsView,
    TeamMemberViewSet,
)

router = DefaultRouter()
router.register("destinations", DestinationViewSet, basename="destination")
router.register("universities", UniversityViewSet, basename="university")
router.register("programs", ProgramViewSet, basename="program")
router.register("services", ServiceViewSet, basename="service")
router.register("test-prep", TestPrepViewSet, basename="testprep")
router.register("leads", LeadViewSet, basename="lead")
router.register("call-logs", CallLogViewSet, basename="calllog")
router.register("testimonials", TestimonialViewSet, basename="testimonial")
router.register("blog", BlogPostViewSet, basename="blogpost")
router.register("pages", PageViewSet, basename="page")
router.register("branches", BranchViewSet, basename="branch")
router.register("notifications", NotificationViewSet, basename="notification")
router.register("students", StudentViewSet, basename="student")
router.register("applications", ApplicationViewSet, basename="application")
router.register("documents", DocumentViewSet, basename="document")
router.register("appointments", AppointmentViewSet, basename="appointment")
router.register("visa-applications", VisaApplicationViewSet, basename="visaapplication")
router.register("popups", PopupViewSet, basename="popup")
router.register("users", UserViewSet, basename="user")
router.register("team", TeamMemberViewSet, basename="teammember")
router.register("events", EventViewSet, basename="event")

urlpatterns = [
    path("auth/me/", MeView.as_view(), name="auth-me"),
    path("settings/", SiteSettingsView.as_view(), name="site-settings"),
    path("media/library/", MediaLibraryView.as_view(), name="media-library"),
    path("media/library/delete/", MediaDeleteView.as_view(), name="media-library-delete"),
    path("media/upload/", EditorMediaUploadView.as_view(), name="editor-media-upload"),
    path("", include(router.urls)),
]
