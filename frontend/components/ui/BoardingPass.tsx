import type { ReactNode } from "react";

/**
 * The signature component of "The Passage" design system: a boarding-pass
 * shaped card reused across the hero, destination grid, and final CTA so the
 * whole site reads as one continuous journey.
 */

type Stat = { label: string; value: string };

type BoardingPassBase = {
  className?: string;
  /** Background the punched notches should match — the surface the card sits on. */
  punch?: "paper" | "ink";
};

type HeroProps = BoardingPassBase & {
  variant: "hero";
  eyebrow?: string;
  headline: ReactNode;
  subcopy?: string;
  from: { code: string; city: string };
  to: { code: string; city: string };
  stats: Stat[];
  cta: { label: string; href: string };
  reference: string;
};

type DestinationProps = BoardingPassBase & {
  variant: "destination";
  country: string;
  code: string;
  summary: string;
  intakes: string;
  href: string;
  featured?: boolean;
};

type CtaProps = BoardingPassBase & {
  variant: "cta";
  eyebrow?: string;
  headline: ReactNode;
  subcopy?: string;
  reference: string;
  children: ReactNode;
};

export type BoardingPassProps = HeroProps | DestinationProps | CtaProps;

function Notches({ punch = "paper" }: { punch?: "paper" | "ink" }) {
  const fill = punch === "ink" ? "bg-ink" : "bg-paper";
  return (
    <>
      <span
        aria-hidden
        className={`absolute -top-3 left-[72%] -translate-x-1/2 size-6 rounded-full ${fill} md:left-auto md:right-[calc(15rem-0.75rem)]`}
      />
      <span
        aria-hidden
        className={`absolute -bottom-3 left-[72%] -translate-x-1/2 size-6 rounded-full ${fill} md:left-auto md:right-[calc(15rem-0.75rem)]`}
      />
    </>
  );
}

function Perforation() {
  return (
    <div
      aria-hidden
      className="relative shrink-0 border-t border-dashed border-ink/25 md:border-t-0 md:border-l md:h-auto self-stretch"
    />
  );
}

function StatBlock({ label, value }: Stat) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone">
        {label}
      </span>
      <span className="font-mono text-sm text-ink">{value}</span>
    </div>
  );
}

export function BoardingPass(props: BoardingPassProps) {
  if (props.variant === "hero") return <HeroPass {...props} />;
  if (props.variant === "destination") return <DestinationPass {...props} />;
  return <CtaPass {...props} />;
}

function HeroPass({
  eyebrow = "BOARDING PASS",
  headline,
  subcopy,
  from,
  to,
  stats,
  cta,
  reference,
  className = "",
  punch = "ink",
}: HeroProps) {
  return (
    <div
      className={`relative flex flex-col md:flex-row bg-paper text-ink rounded-2xl shadow-[0_24px_60px_-24px_rgba(0,0,0,0.45)] overflow-visible ${className}`}
    >
      <Notches punch={punch} />
      <div className="flex-1 p-7 sm:p-9 flex flex-col gap-6">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-stone">
          <span>{eyebrow}</span>
          <span>Ref. {reference}</span>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex flex-col">
            <span className="font-mono text-2xl sm:text-3xl tracking-tight text-ink">
              {from.code}
            </span>
            <span className="text-xs text-stone">{from.city}</span>
          </div>
          <div className="flex-1 h-px bg-ink/15 relative">
            <span className="absolute -top-2.5 right-0 text-saffron-deep">✈</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="font-mono text-2xl sm:text-3xl tracking-tight text-ink">
              {to.code}
            </span>
            <span className="text-xs text-stone">{to.city}</span>
          </div>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.05] tracking-tight text-ink">
          {headline}
        </h1>
        {subcopy ? (
          <p className="text-base sm:text-lg text-ink/70 max-w-prose">{subcopy}</p>
        ) : null}
      </div>

      <Perforation />

      <div className="md:w-60 shrink-0 p-7 sm:p-9 flex flex-col justify-between gap-6">
        <div className="grid grid-cols-2 gap-x-4 gap-y-5">
          {stats.map((s) => (
            <StatBlock key={s.label} {...s} />
          ))}
        </div>
        <a
          href={cta.href}
          className="inline-flex items-center justify-center rounded-full bg-saffron text-ink font-semibold px-5 py-3 text-sm transition-transform duration-200 hover:-translate-y-0.5 hover:bg-saffron-deep hover:text-paper focus-visible:-translate-y-0.5"
        >
          {cta.label}
        </a>
      </div>
    </div>
  );
}

function DestinationPass({
  country,
  code,
  summary,
  intakes,
  href,
  featured,
  className = "",
  punch = "paper",
}: DestinationProps) {
  return (
    <a
      href={href}
      className={`group relative flex flex-col bg-paper text-ink rounded-2xl border border-hairline overflow-visible transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_20px_44px_-20px_rgba(23,36,30,0.35)] ${className}`}
    >
      <Notches punch={punch} />
      <div className="flex items-center justify-between px-6 pt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-stone">
        <span>{featured ? "Featured route" : "Route"}</span>
        <span>{code}</span>
      </div>

      <div className="px-6 pt-3 pb-6 flex-1">
        <h3 className="font-display text-2xl text-ink mb-2">{country}</h3>
        <p className="text-sm text-ink/70 leading-relaxed">{summary}</p>
      </div>

      <div className="border-t border-dashed border-ink/20" />

      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone">
            Intakes
          </span>
          <span className="font-mono text-xs text-ink">{intakes}</span>
        </div>
        <span className="font-mono text-xs text-jade group-hover:text-saffron-deep transition-colors">
          View route →
        </span>
      </div>
    </a>
  );
}

function CtaPass({
  eyebrow = "FINAL CALL",
  headline,
  subcopy,
  reference,
  children,
  className = "",
  punch = "paper",
}: CtaProps) {
  return (
    <div
      className={`relative flex flex-col md:flex-row bg-ink-2 text-paper rounded-2xl overflow-visible ${className}`}
    >
      <Notches punch={punch === "paper" ? "ink" : "paper"} />
      <div className="flex-1 p-7 sm:p-10 flex flex-col gap-4 justify-center">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-paper/50">
          <span>{eyebrow}</span>
          <span>Ref. {reference}</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl leading-tight">{headline}</h2>
        {subcopy ? <p className="text-paper/70 max-w-prose">{subcopy}</p> : null}
      </div>

      <Perforation />

      <div className="md:w-96 shrink-0 p-7 sm:p-10 flex flex-col justify-center">
        {children}
      </div>
    </div>
  );
}
