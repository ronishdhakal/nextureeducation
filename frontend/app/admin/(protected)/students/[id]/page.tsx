"use client";

import { GenericResourceEdit } from "@/components/admin/GenericResourceEdit";
import { STUDENT_CONFIG } from "@/lib/adminResources";

export default function EditStudentPage() {
  return <GenericResourceEdit config={STUDENT_CONFIG} />;
}
