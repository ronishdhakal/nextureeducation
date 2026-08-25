"use client";

import { GenericResourceEdit } from "@/components/admin/GenericResourceEdit";
import { BRANCH_CONFIG } from "@/lib/adminResources";

export default function EditBranchPage() {
  return <GenericResourceEdit config={BRANCH_CONFIG} />;
}
