"use client";

import { GenericResourceEdit } from "@/components/admin/GenericResourceEdit";
import { SERVICE_CONFIG } from "@/lib/adminResources";

export default function EditServicePage() {
  return <GenericResourceEdit config={SERVICE_CONFIG} />;
}
