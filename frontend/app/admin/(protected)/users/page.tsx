"use client";

import { GenericResourceList } from "@/components/admin/GenericResourceList";
import { USER_CONFIG } from "@/lib/adminResources";

export default function AdminUsersPage() {
  return <GenericResourceList config={USER_CONFIG} />;
}
