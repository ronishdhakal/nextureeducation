"use client";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { GenericResourceForm } from "@/components/admin/GenericResourceForm";
import { VISA_CONFIG } from "@/lib/adminResources";

export default function NewVisaApplicationPage() {
  return (
    <div>
      <AdminPageHeader title="New visa application" subtitle="Track a visa application." />
      <GenericResourceForm config={VISA_CONFIG} />
    </div>
  );
}
