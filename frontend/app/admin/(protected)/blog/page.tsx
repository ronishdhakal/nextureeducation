"use client";

import { GenericResourceList } from "@/components/admin/GenericResourceList";
import { BLOGPOST_CONFIG } from "@/lib/adminResources";

export default function AdminBlogPage() {
  return <GenericResourceList config={BLOGPOST_CONFIG} />;
}
