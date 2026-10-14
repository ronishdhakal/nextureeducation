"use client";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { GenericResourceForm } from "@/components/admin/GenericResourceForm";
import { UNIVERSITY_CONFIG } from "@/lib/adminResources";

export default function NewUniversityPage() {
  return (
    <div>
      <AdminPageHeader title="New university" subtitle="Add a partner university." />
      <GenericResourceForm config={UNIVERSITY_CONFIG} />
    </div>
  );
}
