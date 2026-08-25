import Link from "next/link";

import type { Branch, SiteSettings } from "@/lib/types";

const SOCIALS: { key: keyof SiteSettings; label: string }[] = [
  { key: "facebook_url", label: "Facebook" },
  { key: "instagram_url", label: "Instagram" },
  { key: "linkedin_url", label: "LinkedIn" },
  { key: "youtube_url", label: "YouTube" },
  { key: "tiktok_url", label: "TikTok" },
];

const NAV = [
  { label: "Destinations", href: "/destinations" },
  { label: "Services", href: "/services" },
  { label: "Test Prep", href: "/test-prep" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function SiteFooter({
  settings,
  branches,
}: {
  settings: SiteSettings | null;
  branches: Branch[];
}) {
  const socials = SOCIALS.filter((s) => settings?.[s.key]);
  const headOffice = branches.find((b) => b.is_head_office) || branches[0];

  return (
    <footer className="relative bg-ink text-white mt-auto">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 pt-16 sm:pt-20 pb-12 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <p className="font-display font-extrabold text-2xl mb-3">
            Nexture <span className="text-violet-pale">Education</span>
          </p>
          <p className="text-sm text-white/60 max-w-xs leading-relaxed">
            Your next step to a bright future — straight talk on studying abroad, from the
            first conversation to the day you land.
          </p>
          {socials.length ? (
            <div className="flex gap-4 mt-6 text-sm">
              {socials.map((s) => (
                <a
                  key={s.key}
                  href={settings?.[s.key] as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-violet-pale transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/35 mb-4">
            Explore
          </p>
          <ul className="flex flex-col gap-3 text-sm text-white/70">
            {NAV.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-violet-pale transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/35 mb-4">
            {headOffice?.name || "Head Office"}
          </p>
          <p className="text-sm text-white/70 leading-relaxed">
            {headOffice?.address || settings?.address || "Bagbazar, Kathmandu, Nepal"}
            <br />
            {headOffice?.phone || settings?.phone}
            <br />
            {headOffice?.email || settings?.email}
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-6">
        <p className="mx-auto w-full max-w-6xl px-6 sm:px-8 text-xs text-white/35">
          © {new Date().getFullYear()} Nexture Education. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
