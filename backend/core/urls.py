from rest_framework.routers import DefaultRouter

from catalog.views import ProgramViewSet, UniversityViewSet
from content.views import BlogPostViewSet, PageViewSet, TestimonialViewSet
from destinations.views import DestinationViewSet
from leads.views import LeadViewSet
from services.views import ServiceViewSet, TestPrepViewSet

from django.urls import include, path

from .views import BranchViewSet, SiteSettingsView, TeamMemberViewSet

router = DefaultRouter()
router.register("destinations", DestinationViewSet, basename="destination")
router.register("universities", UniversityViewSet, basename="university")
router.register("programs", ProgramViewSet, basename="program")
router.register("services", ServiceViewSet, basename="service")
router.register("test-prep", TestPrepViewSet, basename="testprep")
router.register("leads", LeadViewSet, basename="lead")
router.register("testimonials", TestimonialViewSet, basename="testimonial")
router.register("blog", BlogPostViewSet, basename="blogpost")
router.register("pages", PageViewSet, basename="page")
router.register("branches", BranchViewSet, basename="branch")
router.register("team", TeamMemberViewSet, basename="teammember")

urlpatterns = [
    path("settings/", SiteSettingsView.as_view(), name="site-settings"),
    path("", include(router.urls)),
]
