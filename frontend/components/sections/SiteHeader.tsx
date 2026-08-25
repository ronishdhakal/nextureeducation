const NAV_LINKS = [
  { label: "Destinations", href: "/destinations" },
  { label: "Services", href: "/services" },
  { label: "Test Prep", href: "/test-prep" },
  { label: "Success Stories", href: "/success-stories" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
];

export function SiteHeader() {
  return (
    <header className="bg-ink text-paper">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 flex items-center justify-between py-2 text-xs font-mono text-paper/60 border-b border-paper/10">
        <span>Bagbazar, Kathmandu</span>
        <a href="tel:+9779800000000" className="hover:text-saffron transition-colors">
          +977 98-0000-0000
        </a>
      </div>
      <nav className="mx-auto w-full max-w-6xl px-6 sm:px-8 flex items-center justify-between py-4">
        <a href="/" className="font-display text-xl tracking-tight">
          Nexture <span className="text-saffron">Education</span>
        </a>
        <ul className="hidden md:flex items-center gap-8 text-sm">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="hover:text-saffron transition-colors">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="/contact"
          className="inline-flex items-center justify-center rounded-full bg-saffron text-ink font-semibold px-4 py-2 text-sm transition-transform duration-200 hover:-translate-y-0.5 hover:bg-saffron-deep hover:text-paper"
        >
          Book a Session
        </a>
      </nav>
    </header>
  );
}
