from django.shortcuts import get_object_or_404


class SlugOrPkLookupMixin:
    """Public URLs address these objects by slug; the admin CRM addresses them
    by numeric id. Accept either on the detail routes."""

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        lookup_value = self.kwargs[self.lookup_url_kwarg or self.lookup_field]
        if str(lookup_value).isdigit():
            obj = get_object_or_404(queryset, pk=lookup_value)
        else:
            obj = get_object_or_404(queryset, slug=lookup_value)
        self.check_object_permissions(self.request, obj)
        return obj


class PublishedQuerysetMixin:
    """Anonymous/public requests only see published/active rows; staff see everything.

    Combined with the project-wide IsAuthenticatedOrReadOnly permission this gives
    every model both a public read-only API and an authenticated CRUD API without
    duplicating endpoints.
    """

    published_field = "is_published"

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        if not (user and user.is_authenticated):
            qs = qs.filter(**{self.published_field: True})
        return qs
