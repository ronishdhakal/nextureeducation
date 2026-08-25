"use client";

import { GenericResourceEdit } from "@/components/admin/GenericResourceEdit";
import { TESTIMONIAL_CONFIG } from "@/lib/adminResources";

export default function EditTestimonialPage() {
  return <GenericResourceEdit config={TESTIMONIAL_CONFIG} />;
}
