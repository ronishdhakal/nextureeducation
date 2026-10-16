"use client";

import NextImage from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  Award,
  Bell,
  BookOpen,
  CalendarDays,
  ClipboardList,
  FolderOpen,
  Headphones,
  Inbox,
  Megaphone,
  Stamp,
  UserRound,
  Building2,
  FileStack,
  FileText,
  GraduationCap,
  Globe2,
  LayoutDashboard,
  LogOut,
  Menu,
  Newspaper,
  Settings,
  ShieldCheck,
  X,
} from "lucide-react";

import { Logo } from "@/components/ui/Logo";
import { adminLogout } from "@/lib/adminApi";
import { moduleForPath, ROLE_LABELS, useAdmin, type AdminModule } from "@/lib/adminContext";

const NAV_GROUPS: {
  label: string;
  items: { label: string; href: string; icon: typeof LayoutDashboard; module: AdminModule }[];
}[] = [
  {
    label: "Management",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, module: "dashboard" },
      { label: "Students", href: "/admin/students", icon: UserRound, module: "students" },
      { label: "Applications", href: "/admin/applications", icon: ClipboardList, module: "students" },
      { label: "Universities", href: "/admin/universities", icon: GraduationCap, module: "content" },
      { label: "Destinations", href: "/admin/destinations", icon: Globe2, module: "content" },
    ],
  },
  {
    label: "Consultancy",
    items: [
      { label: "Inquiries", href: "/admin/leads", icon: Inbox, module: "leads" },
      { label: "Counselling", href: "/admin/counselling", icon: Headphones, module: "students" },
      { label: "Visa Applications", href: "/admin/visa-applications", icon: Stamp, module: "students" },
      { label: "Documents", href: "/admin/documents", icon: FolderOpen, module: "students" },
    ],
  },
  {
    label: "Content Management",
    items: [
      { label: "Services", href: "/admin/services", icon: Award, module: "content" },
      { label: "Test Prep", href: "/admin/test-prep", icon: FileText, module: "content" },
      { label: "Events", href: "/admin/events", icon: CalendarDays, module: "content" },
      { label: "Blog", href: "/admin/blog", icon: BookOpen, module: "content" },
      { label: "Popups", href: "/admin/popups", icon: Megaphone, module: "content" },
      { label: "Testimonials", href: "/admin/testimonials", icon: Newspaper, module: "content" },
      { label: "Pages", href: "/admin/pages", icon: FileStack, module: "content" },
    ],
  },
  {
    label: "Settings",
    items: [
      { label: "Users & Roles", href: "/admin/users", icon: ShieldCheck, module: "users" },
      { label: "Branches", href: "/admin/branches", icon: Building2, module: "settings" },
      { label: "Site Settings", href: "/admin/settings", icon: Settings, module: "settings" },
    ],
  },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, loaded } = useAdmin();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user) return;
    const refresh = () =>
      fetch("/api/admin/proxy/notifications/unread_count")
        .then((r) => (r.ok ? r.json() : { count: 0 }))
        .then((d) => setUnread(d.count ?? 0))
        .catch(() => {});
    refresh();
    window.addEventListener("notifications:changed", refresh);
    const timer = window.setInterval(refresh, 60000);
    return () => {
      window.removeEventListener("notifications:changed", refresh);
      window.clearInterval(timer);
    };
  }, [user, pathname]);

  const groups = NAV_GROUPS.map((g) => ({
    ...g,
    items: g.items.filter((i) => (user ? user.modules.includes(i.module) : false)),
  })).filter((g) => g.items.length);
  const allowed = !user || user.modules.includes(moduleForPath(pathname || ""));

  async function handleLogout() {
    await adminLogout();
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen flex bg-white text-ink font-sans">
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen w-64 shrink-0 bg-white border-r border-hairline flex flex-col transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-hairline">
          <Logo />
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-stone"
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="admin-scroll flex-1 px-3 py-5 flex flex-col gap-5 overflow-y-auto">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="px-3.5 mb-1.5 text-sm font-medium text-ink">
                {group.label}
              </p>
              <div className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const active = pathname?.startsWith(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`rounded-box flex items-center gap-3 px-3.5 py-2 text-[13px] transition-colors ${
                        active
                          ? "bg-violet-pale font-medium text-violet-deep"
                          : "text-ink/65 hover:bg-violet-tint hover:text-violet-deep"
                      }`}
                    >
                      <Icon className="size-4" strokeWidth={1.8} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-hairline px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-violet-pale">
              <NextImage src="/assets/nexture-icon.png" alt="" width={32} height={32} className="size-8 object-cover" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-ink">{user?.name || "Nexture Education"}</p>
              <p className="truncate text-[11px] text-stone">{user ? ROLE_LABELS[user.role] : "Staff account"}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-3 inline-flex items-center gap-2 text-sm text-violet-deep transition-colors hover:text-violet-dark"
          >
            <LogOut className="size-4" strokeWidth={1.8} />
            Logout
          </button>
        </div>
      </aside>

      {mobileOpen ? (
        <button
          aria-label="Close menu overlay"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-ink/40 md:hidden"
        />
      ) : null}

      <div className="flex-1 min-w-0">
        <header className="md:hidden sticky top-0 z-20 bg-white border-b border-hairline px-4 py-3 flex items-center justify-between">
          <Logo />
          <button type="button" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu className="size-5" />
          </button>
        </header>
        <div className="hidden items-center justify-end px-10 pt-6 md:flex">
          <Link
            href="/admin/notifications"
            aria-label={unread ? `${unread} unread notifications` : "Notifications"}
            className="relative rounded-full p-2 text-violet-deep transition-colors hover:bg-violet-pale"
          >
            <Bell className="size-5" strokeWidth={1.8} />
            {unread ? (
              <span className="absolute -right-0.5 -top-0.5 flex min-w-4 items-center justify-center rounded-full bg-violet px-1 text-[10px] font-semibold leading-4 text-white">
                {unread > 99 ? "99+" : unread}
              </span>
            ) : null}
          </Link>
        </div>
        <main className="p-6 sm:p-10 md:pt-4">
          {!loaded ? null : allowed ? (
            children
          ) : (
            <div className="max-w-md border border-hairline p-8 rounded-box">
              <h1 className="font-display text-lg font-semibold text-ink">No access</h1>
              <p className="mt-2 text-sm text-ink/65">
                Your role ({user ? ROLE_LABELS[user.role] : "unknown"}) doesn&apos;t include this
                area. Ask an admin if you need it.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
