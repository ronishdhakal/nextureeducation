"use client";

import { GenericResourceList } from "@/components/admin/GenericResourceList";
import { UNIVERSITY_CONFIG } from "@/lib/adminResources";

export default function AdminUniversitiesPage() {
  return <GenericResourceList config={UNIVERSITY_CONFIG} />;
}
