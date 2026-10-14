"use client";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { GenericResourceForm } from "@/components/admin/GenericResourceForm";
import { POPUP_CONFIG } from "@/lib/adminResources";

export default function NewPopupPage() {
  return (
    <div>
      <AdminPageHeader title="New popup" subtitle="A square image visitors see once they land on the site." />
      <GenericResourceForm config={POPUP_CONFIG} />
    </div>
  );
}
