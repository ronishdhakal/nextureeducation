"use client";

class AdminApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`/api/admin/proxy/${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init.headers },
  });

  if (res.status === 401) {
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- forced hard reload clears stale client state after session expiry
    if (typeof window !== "undefined") window.location.href = "/admin/login";
    throw new AdminApiError("Session expired.", 401);
  }

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message =
      (data && typeof data === "object"
        ? Object.entries(data)
            .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
            .join(" · ")
        : null) || "Something went wrong.";
    throw new AdminApiError(message, res.status);
  }

  return data as T;
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// No trailing slash on these proxy paths — Next.js redirects "/x/" -> "/x" by
// default, which would silently turn every call into an extra round trip.
// The proxy route itself appends the trailing slash Django expects.

export function listResource<T>(resource: string, query = ""): Promise<Paginated<T>> {
  return request<Paginated<T>>(`${resource}${query}`);
}

export function getResource<T>(resource: string, id: number | string): Promise<T> {
  return request<T>(`${resource}/${id}`);
}

export function createResource<T>(resource: string, data: unknown): Promise<T> {
  return request<T>(`${resource}`, { method: "POST", body: JSON.stringify(data) });
}

export function updateResource<T>(
  resource: string,
  id: number | string,
  data: unknown
): Promise<T> {
  return request<T>(`${resource}/${id}`, { method: "PATCH", body: JSON.stringify(data) });
}

export function deleteResource(resource: string, id: number | string): Promise<null> {
  return request<null>(`${resource}/${id}`, { method: "DELETE" });
}

export function getSiteSettingsAdmin<T>(): Promise<T> {
  return request<T>("settings");
}

export function updateSiteSettingsAdmin<T>(data: unknown): Promise<T> {
  return request<T>("settings", { method: "PATCH", body: JSON.stringify(data) });
}

export async function adminLogin(username: string, password: string): Promise<void> {
  const res = await fetch("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || "Invalid username or password.");
  }
}

export async function adminLogout(): Promise<void> {
  await fetch("/api/admin/logout", { method: "POST" });
}
