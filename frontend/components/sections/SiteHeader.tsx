"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ConsultationButton } from "@/components/ui/ConsultationProvider";
import { Logo } from "@/components/ui/Logo";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Study Abroad", href: "/destination" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-paper/95 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-3.5 sm:px-8">
        <Logo />

        <ul className="hidden items-center gap-9 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-xs font-semibold uppercase tracking-[0.04em] transition-colors hover:text-violet-deep ${
                  isActive(link.href) ? "text-violet-deep" : "text-ink"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <ConsultationButton arrow>Book Consultation</ConsultationButton>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle menu"
          className="-mr-2 inline-flex flex-col gap-1.5 p-2 lg:hidden"
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
        <div className="flex flex-col gap-4 border-t border-hairline bg-paper px-6 py-5 sm:px-8 lg:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`text-sm font-semibold uppercase tracking-[0.04em] ${
                isActive(link.href) ? "text-violet-deep" : "text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <ConsultationButton arrow className="mt-2 w-full">
            Book Consultation
          </ConsultationButton>
        </div>
      ) : null}
    </header>
  );
}
