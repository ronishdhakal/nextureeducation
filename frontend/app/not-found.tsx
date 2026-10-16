import type { Metadata } from "next";
import Link from "next/link";

import { NotFoundView } from "@/components/sections/NotFoundView";
import { Logo } from "@/components/ui/Logo";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

/**
 * Fallback for addresses that match no route at all. These render outside the site
 * layout, so this page brings its own light header and footer.
 */
export default function RootNotFound() {
  return (
    <>
      <header className="border-b border-hairline bg-paper">
        <div className="mx-auto flex w-full max-w-6xl items-center px-6 py-3.5 sm:px-8">
          <Logo />
        </div>
      </header>
      <main className="flex-1">
        <NotFoundView />
      </main>
      <footer className="border-t border-hairline bg-paper">
        <div className="mx-auto w-full max-w-6xl px-6 py-5 text-xs text-stone sm:px-8">
          © {new Date().getFullYear()} Nexture Education. All Rights Reserved.{" "}
          <Link href="/contact" className="text-violet-deep hover:underline">
            Contact us
          </Link>
        </div>
      </footer>
    </>
  );
}
