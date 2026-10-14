"use client";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { GenericResourceForm } from "@/components/admin/GenericResourceForm";
import { APPLICATION_CONFIG } from "@/lib/adminResources";

export default function NewApplicationPage() {
  return (
    <div>
      <AdminPageHeader title="New application" subtitle="Record a university application." />
      <GenericResourceForm config={APPLICATION_CONFIG} />
    </div>
  );
}
