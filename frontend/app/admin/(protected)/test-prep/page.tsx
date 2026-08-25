"use client";

import { GenericResourceList } from "@/components/admin/GenericResourceList";
import { TESTPREP_CONFIG } from "@/lib/adminResources";

export default function AdminTestPrepPage() {
  return <GenericResourceList config={TESTPREP_CONFIG} />;
}
