"use client";

import { GenericResourceList } from "@/components/admin/GenericResourceList";
import { APPLICATION_CONFIG } from "@/lib/adminResources";

export default function AdminApplicationListPage() {
  return <GenericResourceList config={APPLICATION_CONFIG} />;
}
