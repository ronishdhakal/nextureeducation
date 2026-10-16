"use client";

import { GenericResourceEdit } from "@/components/admin/GenericResourceEdit";
import { TEAM_CONFIG } from "@/lib/adminResources";

export default function EditTeamMemberPage() {
  return <GenericResourceEdit config={TEAM_CONFIG} />;
}
