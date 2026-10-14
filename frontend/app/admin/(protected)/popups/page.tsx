"use client";

import { GenericResourceList } from "@/components/admin/GenericResourceList";
import { POPUP_CONFIG } from "@/lib/adminResources";

export default function AdminPopupsPage() {
  return <GenericResourceList config={POPUP_CONFIG} />;
}
