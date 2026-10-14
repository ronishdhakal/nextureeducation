"use client";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { GenericResourceForm } from "@/components/admin/GenericResourceForm";
import { BRANCH_CONFIG } from "@/lib/adminResources";

export default function NewBranchPage() {
  return (
    <div>
      <AdminPageHeader title="New branch" subtitle="Add an office location." />
      <GenericResourceForm config={BRANCH_CONFIG} />
    </div>
  );
}
