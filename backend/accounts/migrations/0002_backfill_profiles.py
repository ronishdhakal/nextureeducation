from django.conf import settings
from django.db import migrations


def backfill(apps, schema_editor):
    app_label, model_name = settings.AUTH_USER_MODEL.split(".")
    User = apps.get_model(app_label, model_name)
    Profile = apps.get_model("accounts", "Profile")
    for user in User.objects.all():
        Profile.objects.get_or_create(
            user=user,
            defaults={"role": "admin" if (user.is_superuser or user.is_staff) else "telecaller"},
        )


class Migration(migrations.Migration):
    dependencies = [
        ("accounts", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]
    operations = [migrations.RunPython(backfill, migrations.RunPython.noop)]
