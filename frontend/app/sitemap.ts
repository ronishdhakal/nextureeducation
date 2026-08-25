import type { MetadataRoute } from "next";

import { getBlogPosts, getDestinations, getPages, getServices } from "@/lib/api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nexture.edu.np";

const STATIC_ROUTES = [
  "",
  "/destinations",
  "/services",
  "/test-prep",
  "/universities",
  "/success-stories",
  "/about",
  "/blog",
  "/contact",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [destinations, services, posts, pages] = await Promise.all([
    getDestinations(),
    getServices(),
    getBlogPosts(),
    getPages(),
  ]);

  const staticEntries = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }));

  const destinationEntries = destinations.map((d) => ({
    url: `${SITE_URL}/destinations/${d.slug}`,
    lastModified: new Date(),
  }));

  const serviceEntries = services.map((s) => ({
    url: `${SITE_URL}/services/${s.slug}`,
    lastModified: new Date(),
  }));

  const blogEntries = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: p.published_at ? new Date(p.published_at) : new Date(),
  }));

  const pageEntries = pages.map((p) => ({
    url: `${SITE_URL}/pages/${p.slug}`,
    lastModified: new Date(),
  }));

  return [...staticEntries, ...destinationEntries, ...serviceEntries, ...blogEntries, ...pageEntries];
}
