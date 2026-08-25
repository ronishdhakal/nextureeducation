"use client";

import { GenericResourceEdit } from "@/components/admin/GenericResourceEdit";
import { BLOGPOST_CONFIG } from "@/lib/adminResources";

export default function EditBlogPostPage() {
  return <GenericResourceEdit config={BLOGPOST_CONFIG} />;
}
