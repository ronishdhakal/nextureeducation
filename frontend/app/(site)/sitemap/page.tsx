import Link from "next/link";

import { WRAP } from "@/components/ui/blocks";
import {
  getBlogPosts,
  getDestinations,
  getEvents,
  getPages,
  getServices,
  getTestPreps,
} from "@/lib/api";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Sitemap: All Pages",
  description:
    "Every page on the Nexture Education website: study abroad destinations, IELTS and PTE classes, events, services, blog posts and more.",
  path: "/sitemap",
});

function Group({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  if (!links.length) return null;
  return (
    <section>
      <h2 className="font-display text-xl font-semibold text-brand">{title}</h2>
      <ul className="mt-4 flex flex-col gap-2 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-ink/80 transition-colors hover:text-violet-deep">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function SitemapPage() {
  const [destinations, classes, events, services, posts, pages] = await Promise.all([
    getDestinations(),
    getTestPreps(),
    getEvents(),
    getServices(),
    getBlogPosts(),
    getPages(),
  ]);

  return (
    <div className={`${WRAP} py-12 md:py-16`}>
      <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Sitemap</h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink/70">
        Every page on the Nexture Education website, in one place.
      </p>

      <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        <Group
          title="Main pages"
          links={[
            { label: "Home", href: "/" },
            { label: "About Us", href: "/about" },
            { label: "Our Team", href: "/team" },
            { label: "Study Abroad Destinations", href: "/destination" },
            { label: "Classes", href: "/classes" },
            { label: "Events", href: "/events" },
            { label: "Services", href: "/services" },
            { label: "Partner Universities", href: "/universities" },
            { label: "Success Stories", href: "/success-stories" },
            { label: "Blog", href: "/blog" },
            { label: "Contact", href: "/contact" },
          ]}
        />
        <Group
          title="Study abroad"
          links={destinations.map((d) => ({
            label: `Best Consultancy in Nepal for ${d.name}`,
            href: `/destination/${d.slug}`,
          }))}
        />
        <Group
          title="Classes"
          links={classes.map((c) => ({ label: `${c.name} Preparation`, href: `/classes/${c.slug}` }))}
        />
        <Group
          title="Services"
          links={services.map((s) => ({ label: s.title, href: `/services/${s.slug}` }))}
        />
        <Group
          title="Events"
          links={events.map((e) => ({ label: e.title, href: `/events/${e.slug}` }))}
        />
        <Group
          title="Blog"
          links={posts.map((p) => ({ label: p.title, href: `/blog/${p.slug}` }))}
        />
        <Group
          title="Information"
          links={pages.map((p) => ({ label: p.title, href: `/pages/${p.slug}` }))}
        />
      </div>
    </div>
  );
}
