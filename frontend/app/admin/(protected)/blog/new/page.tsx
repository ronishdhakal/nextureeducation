"use client";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { GenericResourceForm } from "@/components/admin/GenericResourceForm";
import { BLOGPOST_CONFIG } from "@/lib/adminResources";

export default function NewBlogPostPage() {
  return (
    <div>
      <AdminPageHeader title="New blog post" subtitle="Write a new article for /blog." />
      <GenericResourceForm config={BLOGPOST_CONFIG} />
    </div>
  );
}
