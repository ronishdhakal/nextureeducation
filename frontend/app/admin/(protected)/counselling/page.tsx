"use client";

import { GenericResourceList } from "@/components/admin/GenericResourceList";
import { APPOINTMENT_CONFIG } from "@/lib/adminResources";

export default function AdminAppointmentListPage() {
  return <GenericResourceList config={APPOINTMENT_CONFIG} />;
}
