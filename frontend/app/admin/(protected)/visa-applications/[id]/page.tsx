"use client";

import { GenericResourceEdit } from "@/components/admin/GenericResourceEdit";
import { VISA_CONFIG } from "@/lib/adminResources";

export default function EditVisaApplicationPage() {
  return <GenericResourceEdit config={VISA_CONFIG} />;
}
