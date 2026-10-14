"use client";

import { GenericResourceList } from "@/components/admin/GenericResourceList";
import { DOCUMENT_CONFIG } from "@/lib/adminResources";

export default function AdminDocumentListPage() {
  return <GenericResourceList config={DOCUMENT_CONFIG} />;
}
