"use client";

import { GenericResourceEdit } from "@/components/admin/GenericResourceEdit";
import { DOCUMENT_CONFIG } from "@/lib/adminResources";

export default function EditDocumentPage() {
  return <GenericResourceEdit config={DOCUMENT_CONFIG} />;
}
