import { AdminShell } from "@/components/admin/AdminShell";
import { AdminProvider } from "@/lib/adminContext";

export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  );
}
