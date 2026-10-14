from django.db.models import Q
from django.utils import timezone
from rest_framework import viewsets

from core.permissions import PublishedQuerysetMixin, SlugOrPkLookupMixin

from .models import BlogPost, Page, Popup, Testimonial
from .serializers import (
    BlogPostListSerializer,
    BlogPostSerializer,
    PageSerializer,
    PopupSerializer,
    TestimonialSerializer,
)


class TestimonialViewSet(PublishedQuerysetMixin, viewsets.ModelViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer
    filterset_fields = ["destination", "is_featured", "is_published"]
    ordering_fields = ["order", "year"]


class BlogPostViewSet(SlugOrPkLookupMixin, PublishedQuerysetMixin, viewsets.ModelViewSet):
    queryset = BlogPost.objects.all()
    lookup_field = "slug"
    ordering_fields = ["published_at", "created_at"]
    search_fields = ["title", "excerpt"]

    def get_serializer_class(self):
        if self.action == "list":
            return BlogPostListSerializer
        return BlogPostSerializer


class PageViewSet(SlugOrPkLookupMixin, PublishedQuerysetMixin, viewsets.ModelViewSet):
    queryset = Page.objects.all()
    serializer_class = PageSerializer
    lookup_field = "slug"


class PopupViewSet(viewsets.ModelViewSet):
    """Public visitors only receive popups that are switched on and inside their date window."""

    queryset = Popup.objects.all()
    serializer_class = PopupSerializer
    filterset_fields = ["is_active", "show_on"]
    ordering_fields = ["created_at"]
    search_fields = ["title"]

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        if user and user.is_authenticated:
            return qs
        now = timezone.now()
        return qs.filter(is_active=True).filter(
            Q(start_at__isnull=True) | Q(start_at__lte=now)
        ).filter(Q(end_at__isnull=True) | Q(end_at__gte=now))
