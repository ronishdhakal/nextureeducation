import type { Metadata } from "next";

import { NotFoundView } from "@/components/sections/NotFoundView";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

/** Shown inside the site layout (header and footer) when a site page calls notFound(). */
export default function SiteNotFound() {
  return <NotFoundView />;
}
