import Link from "next/link";

import { Button } from "@/components/ui/Button";

const QUICK_LINKS = [
  { label: "About", href: "/about" },
  { label: "Study Abroad", href: "/destination" },
  { label: "Classes", href: "/classes" },
  { label: "Events", href: "/events" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

/** The "page not found" content, shared by the site layout and the root fallback. */
export function NotFoundView() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-violet-pale/70 via-violet-tint to-paper">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-6 py-20 text-center sm:py-28">
        <p
          aria-hidden
          className="font-display text-[6.5rem] font-semibold leading-none text-violet sm:text-[9rem]"
        >
          404
        </p>
        <h1 className="mt-4 font-display text-2xl font-semibold text-ink sm:text-3xl">
          Page not found
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/70 sm:text-base">
          The page you are looking for may have moved, been renamed or never existed. Check the
          address, or head back to somewhere that does.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button href="/" size="lg" arrow>
            Back to Home
          </Button>
          <Button href="/destination" variant="ghost" size="lg">
            Explore Destinations
          </Button>
        </div>

        <nav aria-label="Helpful pages" className="mt-10">
          <p className="text-xs uppercase tracking-[0.06em] text-ink/55">Or try one of these</p>
          <ul className="mt-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-violet-deep transition-opacity hover:opacity-70">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
