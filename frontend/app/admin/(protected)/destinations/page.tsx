"use client";

import { GenericResourceList } from "@/components/admin/GenericResourceList";
import { DESTINATION_LIST_CONFIG } from "@/lib/adminResources";

export default function AdminDestinationsPage() {
  return <GenericResourceList config={DESTINATION_LIST_CONFIG} />;
}
