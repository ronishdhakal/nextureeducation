"use client";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { GenericResourceForm } from "@/components/admin/GenericResourceForm";
import { EVENT_CONFIG } from "@/lib/adminResources";

export default function NewEventPage() {
  return (
    <div>
      <AdminPageHeader title="New event" subtitle="Add an education fair, session or webinar." />
      <GenericResourceForm config={EVENT_CONFIG} />
    </div>
  );
}
