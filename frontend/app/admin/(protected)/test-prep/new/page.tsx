import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { GenericResourceForm } from "@/components/admin/GenericResourceForm";
import { TESTPREP_CONFIG } from "@/lib/adminResources";

export default function NewTestPrepPage() {
  return (
    <div>
      <AdminPageHeader title="New test prep" subtitle="Add an IELTS, PTE, SAT or other offering." />
      <GenericResourceForm config={TESTPREP_CONFIG} />
    </div>
  );
}
