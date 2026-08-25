"use client";

import { GenericResourceList } from "@/components/admin/GenericResourceList";
import { TESTIMONIAL_CONFIG } from "@/lib/adminResources";

export default function AdminTestimonialsPage() {
  return <GenericResourceList config={TESTIMONIAL_CONFIG} />;
}
