"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  Award,
  Building2,
  FileText,
  Globe2,
  LayoutDashboard,
  LogOut,
  Menu,
  Newspaper,
  Settings,
  Users,
  X,
} from "lucide-react";

import { adminLogout } from "@/lib/adminApi";

const NAV = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Leads", href: "/admin/leads", icon: Users },
  { label: "Destinations", href: "/admin/destinations", icon: Globe2 },
  { label: "Services", href: "/admin/services", icon: Award },
  { label: "Test Prep", href: "/admin/test-prep", icon: FileText },
  { label: "Testimonials", href: "/admin/testimonials", icon: Newspaper },
  { label: "Branches", href: "/admin/branches", icon: Building2 },
  { label: "Site Settings", href: "/admin/settings", icon: Settings },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await adminLogout();
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen flex bg-[#f6f5f8] text-ink font-sans">
      <aside
        className={`fixed lg:sticky top-0 z-40 h-screen w-64 shrink-0 bg-ink text-white flex flex-col transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <Link href="/admin/dashboard" className="font-display font-extrabold text-lg">
            Nexture <span className="text-violet-pale">CRM</span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-white/70"
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {NAV.map((item) => {
            const active = pathname?.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  active ? "bg-violet text-white" : "text-white/65 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="size-4.5" strokeWidth={2} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white/65 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut className="size-4.5" strokeWidth={2} />
            Log out
          </button>
        </div>
      </aside>

      {mobileOpen ? (
        <button
          aria-label="Close menu overlay"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-ink/40 lg:hidden"
        />
      ) : null}

      <div className="flex-1 min-w-0">
        <header className="lg:hidden sticky top-0 z-20 bg-white border-b border-hairline px-4 py-3 flex items-center justify-between">
          <span className="font-display font-bold">Nexture CRM</span>
          <button type="button" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu className="size-5" />
          </button>
        </header>
        <main className="p-6 sm:p-10 max-w-6xl mx-auto">{children}</main>
      </div>
    </div>
  );
}
