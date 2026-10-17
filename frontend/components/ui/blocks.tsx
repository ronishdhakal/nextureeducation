import { Check, Search } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";

import { Breadcrumbs, type BreadcrumbItem } from "@/components/ui/Breadcrumbs";

/** Look of the small keyword line that is the page's H1 on landing pages. */
const KICKER_CLASS =
  "block font-sans text-xs font-medium uppercase leading-normal tracking-[0.06em] text-violet-deep";

export const WRAP = "mx-auto w-full max-w-6xl px-6 sm:px-8";

/** Listing-page hero: two-tone title with the landmarks artwork fading in on the right. */
export function PageHero({
  eyebrow,
  lead,
  accent,
  subcopy,
  upper = false,
  children,
}: {
  eyebrow?: string;
  lead: string;
  accent: string;
  subcopy: string;
  upper?: boolean;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-violet-pale/70 to-violet-tint">
      <Image
        src="/assets/home/background.png"
        alt=""
        width={577}
        height={433}
        loading="lazy"
        className="pointer-events-none absolute right-0 top-0 hidden h-auto w-[52%] max-w-2xl opacity-40 [mask-image:linear-gradient(to_left,black_40%,transparent),linear-gradient(to_bottom,black_55%,transparent)] [mask-composite:intersect] md:block"
      />
      <div className={`${WRAP} relative pb-10 pt-12 md:pt-16`}>
        {(() => {
          const headlineClass = `font-display text-3xl font-semibold leading-snug text-ink sm:text-[2.4rem] ${
            upper ? "uppercase" : ""
          }`;
          const headline = (
            <>
              {lead}
              <br />
              <span className="text-violet-deep">{accent}</span>
            </>
          );
          return eyebrow ? (
            <div>
              <h1 className={`${KICKER_CLASS} mb-3`}>{eyebrow}</h1>
              <h2 className={headlineClass}>{headline}</h2>
            </div>
          ) : (
            <h1 className={headlineClass}>{headline}</h1>
          );
        })()}
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink/70">{subcopy}</p>
        {children}
      </div>
    </section>
  );
}

export function SearchBox({
  value,
  onChange,
  placeholder,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  className?: string;
}) {
  return (
    <label
      className={`flex items-center gap-3 rounded-full border border-violet/30 bg-white px-5 py-2.5 shadow-soft focus-within:border-violet ${className}`}
    >
      <Search className="size-4 shrink-0 text-violet-deep" strokeWidth={2} />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-stone"
      />
    </label>
  );
}

export function DetailHero({
  title,
  kicker,
  summary,
  image,
  imageAlt,
  breadcrumbs,
  children,
}: {
  title: ReactNode;
  /** Keyword line shown above the title. When given it is the page's H1 and the title becomes an H2. */
  kicker?: string;
  summary?: string;
  image?: string | null;
  imageAlt: string;
  breadcrumbs?: BreadcrumbItem[];
  children?: ReactNode;
}) {
  return (
    <section className="bg-violet-pale/60">
      {breadcrumbs?.length ? (
        <div className={`${WRAP} pt-5`}>
          <Breadcrumbs items={breadcrumbs} />
        </div>
      ) : null}
      <div className={`${WRAP} grid items-center gap-8 py-8 md:grid-cols-2 md:py-10`}>
        <div className="flex flex-col items-start gap-4">
          {kicker ? (
            <div>
              <h1 className={`${KICKER_CLASS} mb-2 sm:text-sm`}>{kicker}</h1>
              <h2 className="font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
                {title}
              </h2>
            </div>
          ) : (
            <h1 className="font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
              {title}
            </h1>
          )}
          {summary ? <p className="max-w-sm text-sm leading-relaxed text-ink/70">{summary}</p> : null}
          {children}
        </div>
        <div className="aspect-[16/9] overflow-hidden bg-gradient-to-br from-violet-pale to-violet/30 shadow-float rounded-box">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={imageAlt}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="size-full object-cover"
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}

/** Section heading. `large` renders a real, sentence-case H2 for long-form content pages. */
export function DetailHeading({
  children,
  hint,
  large = false,
}: {
  children: ReactNode;
  hint?: string;
  large?: boolean;
}) {
  return (
    <div className="mb-4">
      <h2
        className={
          large
            ? "font-display text-xl font-semibold leading-snug text-brand sm:text-2xl"
            : "text-sm font-medium uppercase tracking-[0.02em] text-violet-dark"
        }
      >
        {children}
      </h2>
      {hint ? <p className="mt-1.5 text-sm text-ink/65">{hint}</p> : null}
    </div>
  );
}

export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-sm text-ink/80">
          <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-violet text-white">
            <Check className="size-2.5" strokeWidth={3.5} />
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export function Chip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2.5 border border-hairline bg-paper px-4 py-2.5 text-sm text-ink/85 rounded-box">
      <span className="size-1.5 bg-brand" aria-hidden />
      {label}
    </span>
  );
}

/** Two-digit index used instead of decorative icons. */
export function Index({ n }: { n: number }) {
  return (
    <span className="font-display text-sm font-semibold tabular-nums text-brand">
      {String(n).padStart(2, "0")}
    </span>
  );
}

export function CallToActionCard({
  title,
  text,
  children,
}: {
  title: string;
  text: string;
  children: ReactNode;
}) {
  return (
    <div className=" border border-hairline bg-paper p-6 shadow-float sm:p-8 rounded-box">
      <h2 className="text-sm font-medium uppercase text-violet-dark">{title}</h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink/70">{text}</p>
      <div className="mt-5">{children}</div>
    </div>
  );
}
