"use client";

import { GenericResourceList } from "@/components/admin/GenericResourceList";
import { EVENT_CONFIG } from "@/lib/adminResources";

export default function AdminEventsPage() {
  return <GenericResourceList config={EVENT_CONFIG} />;
}
