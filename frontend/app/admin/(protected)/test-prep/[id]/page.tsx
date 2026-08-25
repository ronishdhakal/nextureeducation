"use client";

import { GenericResourceEdit } from "@/components/admin/GenericResourceEdit";
import { TESTPREP_CONFIG } from "@/lib/adminResources";

export default function EditTestPrepPage() {
  return <GenericResourceEdit config={TESTPREP_CONFIG} />;
}
