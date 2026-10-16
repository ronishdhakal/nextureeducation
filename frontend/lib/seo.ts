import type { Metadata } from "next";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nexture.edu.np";
const SITE_NAME = "Nexture Education";

/** Brand share image, generated at /og (see app/og/route.tsx). Pass a title to caption it. */
export function ogImageUrl(title?: string): string {
  const q = title ? `?title=${encodeURIComponent(title.slice(0, 90))}` : "";
  return `${SITE_URL}/og${q}`;
}

export function buildMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  absoluteTitle = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  /** Use the title exactly as written, without the site-wide " | Nexture Education" suffix. */
  absoluteTitle?: boolean;
}): Metadata {
  const url = `${SITE_URL}${path}`;
  const ogImage = image || ogImageUrl(title.replace(/\s*\|\s*Nexture.*$/, ""));
  const desc = description.replace(/\s+/g, " ").trim();

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description: desc,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description: desc,
      url,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      locale: "en_US",
      type,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [ogImage],
    },
  };
}

export type Crumb = { name: string; path: string };

/** BreadcrumbList structured data for a page. The first crumb is always Home. */
export function breadcrumbJsonLd(crumbs: Crumb[]) {
  const all: Crumb[] = [{ name: "Home", path: "/" }, ...crumbs];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${c.path === "/" ? "" : c.path}`,
    })),
  };
}
