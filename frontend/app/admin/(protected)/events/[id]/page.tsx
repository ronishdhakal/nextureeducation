"use client";

import { GenericResourceEdit } from "@/components/admin/GenericResourceEdit";
import { EVENT_CONFIG } from "@/lib/adminResources";

export default function EditEventPage() {
  return <GenericResourceEdit config={EVENT_CONFIG} />;
}
