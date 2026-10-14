"use client";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { GenericResourceForm } from "@/components/admin/GenericResourceForm";
import { APPOINTMENT_CONFIG } from "@/lib/adminResources";

export default function NewAppointmentPage() {
  return (
    <div>
      <AdminPageHeader title="New appointment" subtitle="Book a counselling or consultation session." />
      <GenericResourceForm config={APPOINTMENT_CONFIG} />
    </div>
  );
}
