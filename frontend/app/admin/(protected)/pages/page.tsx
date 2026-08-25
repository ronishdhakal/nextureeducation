"use client";

import { GenericResourceList } from "@/components/admin/GenericResourceList";
import { PAGE_CONFIG } from "@/lib/adminResources";

export default function AdminPagesPage() {
  return <GenericResourceList config={PAGE_CONFIG} />;
}
