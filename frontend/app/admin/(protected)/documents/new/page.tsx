"use client";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { GenericResourceForm } from "@/components/admin/GenericResourceForm";
import { DOCUMENT_CONFIG } from "@/lib/adminResources";

export default function NewDocumentPage() {
  return (
    <div>
      <AdminPageHeader title="New document" subtitle="Upload a student document." />
      <GenericResourceForm config={DOCUMENT_CONFIG} />
    </div>
  );
}
