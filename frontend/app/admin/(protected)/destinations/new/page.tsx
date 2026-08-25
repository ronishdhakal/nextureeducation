import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DestinationForm } from "@/components/admin/DestinationForm";

export default function NewDestinationPage() {
  return (
    <div>
      <AdminPageHeader title="New destination" subtitle="Add a country students can apply to." />
      <DestinationForm />
    </div>
  );
}
