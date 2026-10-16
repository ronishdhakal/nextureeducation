"use client";

import { GenericResourceList } from "@/components/admin/GenericResourceList";
import { TEAM_CONFIG } from "@/lib/adminResources";

export default function AdminTeamPage() {
  return <GenericResourceList config={TEAM_CONFIG} />;
}
