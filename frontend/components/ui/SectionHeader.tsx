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
  titleClassName = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  subcopy?: string;
  linkLabel?: string;
  linkHref?: string;
  align?: "left" | "center";
  titleClassName?: string;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
      <div className={`flex flex-col gap-2 ${align === "center" ? "mx-auto text-center" : ""}`}>
        {eyebrow ? (
          <p className="text-xs font-medium uppercase tracking-[0.06em] text-violet-deep">
            {eyebrow}
          </p>
        ) : null}
        <h2 className={`font-display text-2xl font-semibold leading-tight text-ink text-balance sm:text-[1.75rem] ${titleClassName}`}>
          {title}
        </h2>
        {subcopy ? (
          <p className="max-w-lg text-sm leading-relaxed text-ink/65">{subcopy}</p>
        ) : null}
      </div>
      {linkLabel && linkHref ? (
        <Link
          href={linkHref}
          className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-violet-deep"
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
