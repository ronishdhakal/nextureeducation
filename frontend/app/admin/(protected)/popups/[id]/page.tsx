"use client";

import { GenericResourceEdit } from "@/components/admin/GenericResourceEdit";
import { POPUP_CONFIG } from "@/lib/adminResources";

export default function EditPopupPage() {
  return <GenericResourceEdit config={POPUP_CONFIG} />;
}
