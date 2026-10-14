"use client";

import { GenericResourceList } from "@/components/admin/GenericResourceList";
import { VISA_CONFIG } from "@/lib/adminResources";

export default function AdminVisaApplicationListPage() {
  return <GenericResourceList config={VISA_CONFIG} />;
}
