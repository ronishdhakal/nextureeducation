"use client";

import { GenericResourceEdit } from "@/components/admin/GenericResourceEdit";
import { APPLICATION_CONFIG } from "@/lib/adminResources";

export default function EditApplicationPage() {
  return <GenericResourceEdit config={APPLICATION_CONFIG} />;
}
