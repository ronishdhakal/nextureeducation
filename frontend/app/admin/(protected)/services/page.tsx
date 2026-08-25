"use client";

import { GenericResourceList } from "@/components/admin/GenericResourceList";
import { SERVICE_CONFIG } from "@/lib/adminResources";

export default function AdminServicesPage() {
  return <GenericResourceList config={SERVICE_CONFIG} />;
}
