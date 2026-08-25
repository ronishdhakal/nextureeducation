export function SiteFooter() {
  return (
    <footer className="bg-ink text-paper mt-auto">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 py-16 grid gap-10 sm:grid-cols-3">
        <div>
          <p className="font-display text-xl mb-3">
            Nexture <span className="text-saffron">Education</span>
          </p>
          <p className="text-sm text-paper/60 max-w-xs">
            Straight talk on studying abroad — counseling, applications, visas and
            test prep for Nepali students headed to seven countries.
          </p>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-paper/40 mb-3">
            Head Office
          </p>
          <p className="text-sm text-paper/70 leading-relaxed">
            Bagbazar, Kathmandu, Nepal
            <br />
            +977 98-0000-0000
            <br />
            hello@nexture.edu.np
          </p>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-paper/40 mb-3">
            Follow
          </p>
          <div className="flex gap-4 text-sm">
            <a href="#" className="hover:text-saffron transition-colors">
              Facebook
            </a>
            <a href="#" className="hover:text-saffron transition-colors">
              Instagram
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-paper/10 py-6">
        <p className="mx-auto w-full max-w-6xl px-6 sm:px-8 text-xs font-mono text-paper/40">
          © {new Date().getFullYear()} Nexture Education. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
