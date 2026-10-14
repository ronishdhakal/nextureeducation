"use client";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { GenericResourceForm } from "@/components/admin/GenericResourceForm";
import { SERVICE_CONFIG } from "@/lib/adminResources";

export default function NewServicePage() {
  return (
    <div>
      <AdminPageHeader title="New service" subtitle="Add a service shown on the public site." />
      <GenericResourceForm config={SERVICE_CONFIG} />
    </div>
  );
}
