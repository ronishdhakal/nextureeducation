import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

/** Eyebrow + title + subcopy, with an optional "view all" link on the right. */
export function SectionHeader({
  eyebrow,
  title,
  subcopy,
  linkLabel,
  linkHref,
  align = "left",
}: {
  eyebrow: string;
  title: ReactNode;
  subcopy?: string;
  linkLabel?: string;
  linkHref?: string;
  align?: "left" | "center";
}) {
  return (
    <div className="flex items-start justify-between gap-6">
      <div className={`flex flex-col gap-2 ${align === "center" ? "mx-auto text-center" : ""}`}>
        <p className="text-xs font-medium uppercase tracking-[0.06em] text-violet-deep">
          {eyebrow}
        </p>
        <h2 className="font-display text-2xl font-semibold leading-tight text-ink text-balance sm:text-[1.75rem]">
          {title}
        </h2>
        {subcopy ? (
          <p className="max-w-lg text-sm leading-relaxed text-ink/65">{subcopy}</p>
        ) : null}
      </div>
      {linkLabel && linkHref ? (
        <Link
          href={linkHref}
          className="group hidden shrink-0 items-center gap-2 text-sm font-medium text-violet-deep sm:inline-flex"
        >
          {linkLabel}
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-0.5"
            strokeWidth={2}
          />
        </Link>
      ) : null}
    </div>
  );
}
