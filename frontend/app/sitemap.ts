import type { MetadataRoute } from "next";

import {
  getBlogPosts,
  getDestinations,
  getEvents,
  getPages,
  getServices,
  getTestPreps,
  mediaUrl,
} from "@/lib/api";
import { SITE_URL } from "@/lib/seo";

type Entry = MetadataRoute.Sitemap[number];

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: Entry["changeFrequency"] }[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/destination", priority: 0.9, changeFrequency: "weekly" },
  { path: "/classes", priority: 0.8, changeFrequency: "weekly" },
  { path: "/events", priority: 0.7, changeFrequency: "weekly" },
  { path: "/services", priority: 0.7, changeFrequency: "monthly" },
  { path: "/universities", priority: 0.7, changeFrequency: "monthly" },
  { path: "/success-stories", priority: 0.6, changeFrequency: "monthly" },
  { path: "/about", priority: 0.6, changeFrequency: "yearly" },
  { path: "/blog", priority: 0.7, changeFrequency: "daily" },
  { path: "/contact", priority: 0.6, changeFrequency: "yearly" },
  { path: "/sitemap", priority: 0.2, changeFrequency: "monthly" },
];

/** Only real dates: a made-up "modified today" on every page makes Google ignore the field. */
const when = (iso?: string | null) => (iso ? new Date(iso) : undefined);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [destinations, services, posts, pages, classes, events] = await Promise.all([
    getDestinations(),
    getServices(),
    getBlogPosts(),
    getPages(),
    getTestPreps(),
    getEvents(),
  ]);

  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    priority: r.priority,
    changeFrequency: r.changeFrequency,
  }));

  for (const d of destinations) {
    const image = mediaUrl(d.hero_image ?? null);
    entries.push({
      url: `${SITE_URL}/destination/${d.slug}`,
      lastModified: when(d.updated_at),
      priority: 0.9,
      changeFrequency: "monthly",
      ...(image ? { images: [image] } : {}),
    });
  }
  for (const c of classes) {
    const image = mediaUrl(c.hero_image ?? null);
    entries.push({
      url: `${SITE_URL}/classes/${c.slug}`,
      lastModified: when((c as { updated_at?: string }).updated_at),
      priority: 0.8,
      changeFrequency: "monthly",
      ...(image ? { images: [image] } : {}),
    });
  }
  for (const e of events) {
    const image = mediaUrl(e.cover_image);
    entries.push({
      url: `${SITE_URL}/events/${e.slug}`,
      lastModified: when(e.updated_at),
      priority: 0.6,
      changeFrequency: "weekly",
      ...(image ? { images: [image] } : {}),
    });
  }
  for (const s of services) {
    entries.push({
      url: `${SITE_URL}/services/${s.slug}`,
      lastModified: when((s as { updated_at?: string }).updated_at),
      priority: 0.6,
      changeFrequency: "monthly",
    });
  }
  for (const p of posts) {
    const image = mediaUrl(p.cover_image);
    entries.push({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: when(p.updated_at) || when(p.published_at),
      priority: 0.6,
      changeFrequency: "monthly",
      ...(image ? { images: [image] } : {}),
    });
  }
  for (const p of pages) {
    entries.push({
      url: `${SITE_URL}/pages/${p.slug}`,
      lastModified: when((p as { updated_at?: string }).updated_at),
      priority: 0.2,
      changeFrequency: "yearly",
    });
  }

  return entries;
}
