"use client";

import { GenericResourceEdit } from "@/components/admin/GenericResourceEdit";
import { APPOINTMENT_CONFIG } from "@/lib/adminResources";

export default function EditAppointmentPage() {
  return <GenericResourceEdit config={APPOINTMENT_CONFIG} />;
}
