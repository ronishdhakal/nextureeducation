"use client";

import { GenericResourceList } from "@/components/admin/GenericResourceList";
import { STUDENT_CONFIG } from "@/lib/adminResources";

export default function AdminStudentListPage() {
  return <GenericResourceList config={STUDENT_CONFIG} />;
}
