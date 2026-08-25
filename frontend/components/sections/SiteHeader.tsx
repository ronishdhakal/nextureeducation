"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import type { SiteSettings } from "@/lib/types";

const NAV_LINKS = [
  { label: "Destinations", href: "/destinations" },
  { label: "Services", href: "/services" },
  { label: "Test Prep", href: "/test-prep" },
  { label: "Success Stories", href: "/success-stories" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
];

export function SiteHeader({ settings }: { settings: SiteSettings | null }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-paper/90 backdrop-blur border-b border-hairline">
      <div className="bg-ink text-white">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 flex items-center justify-between py-1.5 text-xs font-mono text-white/60">
          <span>{settings?.address || "Bagbazar, Kathmandu"}</span>
          <a
            href={`tel:${(settings?.phone || "+9779800000000").replace(/\s/g, "")}`}
            className="hover:text-amber transition-colors"
          >
            {settings?.phone || "+977 98-0000-0000"}
          </a>
        </div>
      </div>

      <nav className="mx-auto w-full max-w-6xl px-6 sm:px-8 flex items-center justify-between py-3">
        <Logo />

        <ul className="hidden lg:flex items-center gap-7 text-sm font-medium text-ink/80">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="hover:text-violet transition-colors">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <Button href="/contact">Book a Session</Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle menu"
          className="lg:hidden inline-flex flex-col gap-1.5 p-2 -mr-2"
        >
          <span
            className={`block h-0.5 w-6 bg-ink transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
          />
          <span className={`block h-0.5 w-6 bg-ink transition-opacity ${open ? "opacity-0" : ""}`} />
          <span
            className={`block h-0.5 w-6 bg-ink transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </nav>

      {open ? (
        <div className="lg:hidden border-t border-hairline bg-paper px-6 sm:px-8 py-5 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-base font-medium text-ink/80 hover:text-violet"
            >
              {link.label}
            </Link>
          ))}
          <Button href="/contact" className="mt-2 w-full">
            Book a Session
          </Button>
        </div>
      ) : null}
    </header>
  );
}
