"use client";

import { GenericResourceEdit } from "@/components/admin/GenericResourceEdit";
import { USER_CONFIG } from "@/lib/adminResources";

export default function EditUserPage() {
  return <GenericResourceEdit config={USER_CONFIG} />;
}
