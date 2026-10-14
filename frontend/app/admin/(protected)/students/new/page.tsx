"use client";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { GenericResourceForm } from "@/components/admin/GenericResourceForm";
import { STUDENT_CONFIG } from "@/lib/adminResources";

export default function NewStudentPage() {
  return (
    <div>
      <AdminPageHeader title="New student" subtitle="Add a student record." />
      <GenericResourceForm config={STUDENT_CONFIG} />
    </div>
  );
}
