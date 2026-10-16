from rest_framework import serializers

from .models import BlogPost, Page, Popup, Testimonial


class TestimonialSerializer(serializers.ModelSerializer):
    destination_name = serializers.CharField(source="destination.name", read_only=True)

    class Meta:
        model = Testimonial
        fields = "__all__"


class BlogPostListSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source="get_category_display", read_only=True)

    class Meta:
        model = BlogPost
        fields = [
            "id", "title", "slug", "cover_image", "excerpt", "author", "published_at",
            "category", "category_display", "is_published", "created_at", "updated_at",
        ]


class BlogPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = "__all__"


class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = "__all__"


class PopupSerializer(serializers.ModelSerializer):
    frequency_display = serializers.CharField(source="get_frequency_display", read_only=True)

    class Meta:
        model = Popup
        fields = "__all__"
        read_only_fields = ["created_at", "updated_at"]
