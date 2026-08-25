"use client";

import { GenericResourceEdit } from "@/components/admin/GenericResourceEdit";
import { UNIVERSITY_CONFIG } from "@/lib/adminResources";

export default function EditUniversityPage() {
  return <GenericResourceEdit config={UNIVERSITY_CONFIG} />;
}
