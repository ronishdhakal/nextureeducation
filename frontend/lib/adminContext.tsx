"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type AdminRole = "admin" | "counsellor" | "telecaller" | "content_manager";
export type AdminModule =
  | "dashboard"
  | "leads"
  | "students"
  | "content"
  | "users"
  | "settings";

export interface AdminUser {
  id: number;
  username: string;
  name: string;
  email: string;
  role: AdminRole;
  modules: AdminModule[];
}

export const ROLE_LABELS: Record<AdminRole, string> = {
  admin: "Admin",
  counsellor: "Counsellor",
  telecaller: "Telecaller",
  content_manager: "Content manager",
};

const AdminContext = createContext<{ user: AdminUser | null; loaded: boolean }>({
  user: null,
  loaded: false,
});

export function AdminProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ user: AdminUser | null; loaded: boolean }>({
    user: null,
    loaded: false,
  });

  useEffect(() => {
    fetch("/api/admin/proxy/auth/me")
      .then(async (res) => {
        if (res.status === 401) {
          // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- hard reload clears stale state
          window.location.href = "/admin/login";
          return null;
        }
        return res.ok ? ((await res.json()) as AdminUser) : null;
      })
      .then((user) => setState({ user, loaded: true }))
      .catch(() => setState({ user: null, loaded: true }));
  }, []);

  return <AdminContext.Provider value={state}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  return useContext(AdminContext);
}

/** Which module of the panel a pathname belongs to. */
export function moduleForPath(pathname: string): AdminModule {
  if (pathname.startsWith("/admin/dashboard") || pathname.startsWith("/admin/notifications"))
    return "dashboard";
  if (pathname.startsWith("/admin/leads")) return "leads";
  if (
    ["/admin/students", "/admin/applications", "/admin/documents", "/admin/counselling", "/admin/visa-applications"].some(
      (p) => pathname.startsWith(p)
    )
  )
    return "students";
  if (pathname.startsWith("/admin/users")) return "users";
  if (pathname.startsWith("/admin/settings") || pathname.startsWith("/admin/branches"))
    return "settings";
  return "content";
}
