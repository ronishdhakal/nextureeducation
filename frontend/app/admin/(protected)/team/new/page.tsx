"use client";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { GenericResourceForm } from "@/components/admin/GenericResourceForm";
import { TEAM_CONFIG } from "@/lib/adminResources";

export default function NewTeamMemberPage() {
  return (
    <div>
      <AdminPageHeader title="New team member" subtitle="Add someone to the Meet Our Expert Team section." />
      <GenericResourceForm config={TEAM_CONFIG} />
    </div>
  );
}
