import type {
  Branch,
  Destination,
  LeadPayload,
  Page,
  Paginated,
  Service,
  SiteSettings,
  Testimonial,
  TestPrep,
  BlogPost,
  EventItem,
  PopupItem,
  University,
  TeamMember,
} from "./types";

// Server components (SSR/ISR) can reach the backend over the docker-internal
// network via API_URL_INTERNAL; the browser always needs the public URL.
export const PUBLIC_API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
export const SERVER_API_BASE = process.env.API_URL_INTERNAL || PUBLIC_API_BASE;

async function apiFetch<T>(
  path: string,
  { revalidate = 120, ...rest }: RequestInit & { revalidate?: number } = {}
): Promise<T> {
  const res = await fetch(`${SERVER_API_BASE}${path}`, {
    ...rest,
    next: { revalidate },
  });
  if (!res.ok) {
    throw new Error(`API request failed (${res.status}): ${path}`);
  }
  return res.json();
}

/** Resolve a media path returned by the API into an absolute URL. */
export function mediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  // Browser-facing origin: SERVER_API_BASE may be the docker-internal host.
  const origin = PUBLIC_API_BASE.replace(/\/api\/?$/, "");
  return `${origin}${path}`;
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    return await apiFetch<SiteSettings>("/settings/", { revalidate: 300 });
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getDestinations(): Promise<Destination[]> {
  try {
    const data = await apiFetch<Paginated<Destination>>(
      "/destinations/?ordering=order&page_size=20"
    );
    return data.results;
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function getDestination(slug: string): Promise<Destination | null> {
  try {
    return await apiFetch<Destination>(`/destinations/${slug}/`);
  } catch {
    return null;
  }
}

export async function getServices(): Promise<Service[]> {
  try {
    const data = await apiFetch<Paginated<Service>>("/services/?ordering=order&page_size=20");
    return data.results;
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function getService(slug: string): Promise<Service | null> {
  try {
    return await apiFetch<Service>(`/services/${slug}/`);
  } catch {
    return null;
  }
}

export async function getTestPrep(slug: string): Promise<TestPrep | null> {
  try {
    return await apiFetch<TestPrep>(`/test-prep/${slug}/`);
  } catch {
    return null;
  }
}

export async function getEvents(): Promise<EventItem[]> {
  try {
    const data = await apiFetch<Paginated<EventItem>>("/events/?ordering=event_date&page_size=50");
    return data.results;
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function getEvent(slug: string): Promise<EventItem | null> {
  try {
    return await apiFetch<EventItem>(`/events/${slug}/`);
  } catch {
    return null;
  }
}

export async function getUniversities(countryId?: number): Promise<University[]> {
  try {
    const query = countryId ? `&country=${countryId}` : "";
    const data = await apiFetch<Paginated<University>>(
      `/universities/?ordering=order&page_size=50${query}`
    );
    return data.results;
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function getTestPreps(): Promise<TestPrep[]> {
  try {
    const data = await apiFetch<Paginated<TestPrep>>("/test-prep/?ordering=order&page_size=20");
    return data.results;
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function getTestimonials(destinationId?: number): Promise<Testimonial[]> {
  try {
    const filter = destinationId ? `&destination=${destinationId}` : "";
    const data = await apiFetch<Paginated<Testimonial>>(
      `/testimonials/?ordering=order&page_size=50${filter}`
    );
    return data.results;
  } catch (e) {
    console.error(e);
    return [];
  }
}

/** The newest popup that is switched on and inside its date window (the API filters this). */
export async function getActivePopup(): Promise<PopupItem | null> {
  try {
    const data = await apiFetch<Paginated<PopupItem>>("/popups/?ordering=-created_at&page_size=1", {
      revalidate: 60,
    });
    const popup = data.results[0];
    if (!popup) return null;
    return { ...popup, image: mediaUrl(popup.image) || "" };
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getBranches(): Promise<Branch[]> {
  try {
    const data = await apiFetch<Paginated<Branch>>("/branches/?ordering=order&page_size=20");
    return data.results;
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const data = await apiFetch<Paginated<TeamMember>>("/team/?ordering=order&page_size=50");
    return data.results;
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const data = await apiFetch<Paginated<BlogPost>>(
      "/blog/?ordering=-published_at&page_size=50"
    );
    return data.results;
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    return await apiFetch<BlogPost>(`/blog/${slug}/`);
  } catch {
    return null;
  }
}

export async function getPage(slug: string): Promise<Page | null> {
  try {
    return await apiFetch<Page>(`/pages/${slug}/`);
  } catch {
    return null;
  }
}

export async function getPages(): Promise<Page[]> {
  try {
    const data = await apiFetch<Paginated<Page>>("/pages/?page_size=50");
    return data.results;
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function createLead(payload: LeadPayload): Promise<{ detail: string }> {
  const res = await fetch(`${PUBLIC_API_BASE}/leads/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const firstError =
      typeof data === "object" && data
        ? Object.values(data).flat().filter(Boolean)[0]
        : null;
    throw new Error(
      (firstError as string) || "Something went wrong, please try again."
    );
  }
  return data;
}
