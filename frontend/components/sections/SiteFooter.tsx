import Link from "next/link";

import { Logo } from "@/components/ui/Logo";
import type { Destination, Service, SiteSettings } from "@/lib/types";

const SOCIALS: { key: keyof SiteSettings; label: string }[] = [
  { key: "facebook_url", label: "Facebook" },
  { key: "instagram_url", label: "Instagram" },
  { key: "linkedin_url", label: "LinkedIn" },
  { key: "youtube_url", label: "YouTube" },
  { key: "tiktok_url", label: "TikTok" },
];

const COLUMNS = [
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/about" },
      { label: "Study Abroad", href: "/destination" },
      { label: "Classes", href: "/classes" },
      { label: "Blog", href: "/blog" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Success Stories", href: "/success-stories" },
      { label: "Events", href: "/events" },
      { label: "Universities", href: "/universities" },
    ],
  },
  {
    title: "Legal Information",
    links: [
      { label: "Legal Notice", href: "/pages/legal-notice" },
      { label: "Privacy Policy", href: "/pages/privacy-policy" },
      { label: "Terms Of Use", href: "/pages/terms-of-use" },
    ],
  },
];

export function SiteFooter({
  settings,
  services,
  destinations,
}: {
  settings: SiteSettings | null;
  services: Service[];
  destinations: Destination[];
}) {
  const columns = [
    COLUMNS[0],
    COLUMNS[1],
    ...(destinations.length
      ? [
          {
            title: "Study Abroad",
            links: destinations.slice(0, 7).map((d) => ({
              label: `Study in ${d.name}`,
              href: `/destination/${d.slug}`,
            })),
          },
        ]
      : []),
    ...(services.length
      ? [
          {
            title: "Services",
            links: services.slice(0, 6).map((s) => ({ label: s.title, href: `/services/${s.slug}` })),
          },
        ]
      : []),
    COLUMNS[2],
  ];
  const socials = SOCIALS.filter((s) => settings?.[s.key]);

  return (
    <footer className="mt-auto border-t border-hairline bg-paper text-ink">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-x-6 gap-y-8 px-6 pb-10 pt-11 sm:gap-10 sm:px-8 sm:pb-12 sm:pt-14 lg:grid-cols-[1.3fr_repeat(5,1fr)]">
        <div className="col-span-2 lg:col-span-1">
          <Logo className="mb-4" />
          <p className="max-w-xs text-sm leading-relaxed text-ink/65">
            Your trusted partner in international education. We help students achieve their
            dreams of studying abroad with personalized guidance and expert support.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <p className="mb-4 text-sm font-semibold text-violet-deep">{col.title}</p>
            <ul className="flex flex-col gap-2.5 text-sm text-ink/70">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition-colors hover:text-violet-deep">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-hairline">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-4 px-6 py-5 sm:flex-row sm:items-center sm:px-8">
          <p className="text-xs text-stone">
            © {new Date().getFullYear()} Nexture Education. All Rights Reserved.
          </p>
          {socials.length ? (
            <div className="flex flex-wrap gap-5">
              {socials.map(({ key, label }) => (
                <a
                  key={key}
                  href={settings?.[key] as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-violet-deep transition-opacity hover:opacity-70"
                >
                  {label}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
