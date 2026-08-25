"use client";

import { GenericResourceEdit } from "@/components/admin/GenericResourceEdit";
import { PAGE_CONFIG } from "@/lib/adminResources";

export default function EditPagePage() {
  return <GenericResourceEdit config={PAGE_CONFIG} />;
}
