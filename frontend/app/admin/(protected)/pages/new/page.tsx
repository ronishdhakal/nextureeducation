"use client";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { GenericResourceForm } from "@/components/admin/GenericResourceForm";
import { PAGE_CONFIG } from "@/lib/adminResources";

export default function NewPagePage() {
  return (
    <div>
      <AdminPageHeader title="New page" subtitle="Add a freeform page, e.g. a Privacy Policy." />
      <GenericResourceForm config={PAGE_CONFIG} />
    </div>
  );
}
