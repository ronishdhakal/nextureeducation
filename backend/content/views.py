from rest_framework import viewsets

from core.permissions import PublishedQuerysetMixin, SlugOrPkLookupMixin

from .models import BlogPost, Page, Testimonial
from .serializers import (
    BlogPostListSerializer,
    BlogPostSerializer,
    PageSerializer,
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
