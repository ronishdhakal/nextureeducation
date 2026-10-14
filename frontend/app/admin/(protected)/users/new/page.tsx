"use client";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { GenericResourceForm } from "@/components/admin/GenericResourceForm";
import { USER_CONFIG } from "@/lib/adminResources";

export default function NewUserPage() {
  return (
    <div>
      <AdminPageHeader title="New user" subtitle="Create a staff account and choose its role." />
      <GenericResourceForm config={USER_CONFIG} />
    </div>
  );
}
