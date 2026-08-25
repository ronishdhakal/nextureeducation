"use client";

import { GenericResourceList } from "@/components/admin/GenericResourceList";
import { BRANCH_CONFIG } from "@/lib/adminResources";

export default function AdminBranchesPage() {
  return <GenericResourceList config={BRANCH_CONFIG} />;
}
