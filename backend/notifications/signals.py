from django.db.models.signals import post_save
from django.dispatch import receiver

from events.models import Event

from .models import notify


@receiver(post_save, sender=Event)
def event_posted(sender, instance, created, **kwargs):
    if created and instance.is_published:
        notify(
            "event",
            f"New event posted. {instance.title} is now live.",
            related="Event",
            link=f"/admin/events/{instance.id}",
            roles="admin,content_manager,counsellor",
        )
