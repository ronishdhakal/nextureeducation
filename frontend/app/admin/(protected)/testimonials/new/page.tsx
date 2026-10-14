"use client";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { GenericResourceForm } from "@/components/admin/GenericResourceForm";
import { TESTIMONIAL_CONFIG } from "@/lib/adminResources";

export default function NewTestimonialPage() {
  return (
    <div>
      <AdminPageHeader title="New testimonial" subtitle="Add a student story." />
      <GenericResourceForm config={TESTIMONIAL_CONFIG} />
    </div>
  );
}
