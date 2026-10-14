from django.db import migrations


def backfill(apps, schema_editor):
    Lead = apps.get_model("leads", "Lead")
    for lead in Lead.objects.all():
        log = lead.call_logs.order_by("-created_at").first()
        if log and log.follow_up_at:
            lead.next_follow_up = log.follow_up_at
            lead.save(update_fields=["next_follow_up"])


class Migration(migrations.Migration):
    dependencies = [("leads", "0004_lead_assigned_to_lead_next_follow_up")]
    operations = [migrations.RunPython(backfill, migrations.RunPython.noop)]
