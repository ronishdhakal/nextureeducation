import type { ReactNode } from "react";

type Tone = "paper" | "tint" | "ink";

type SectionProps = {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  innerClassName?: string;
  id?: string;
};

const TONE_CLASSES: Record<Tone, string> = {
  paper: "bg-paper text-ink",
  tint: "bg-paper-2 text-ink",
  ink: "bg-ink text-paper",
};

export function Section({
  children,
  tone = "paper",
  className = "",
  innerClassName = "",
  id,
}: SectionProps) {
  return (
    <section id={id} className={`relative ${TONE_CLASSES[tone]} ${className}`}>
      <div className={`mx-auto w-full max-w-6xl px-6 sm:px-8 py-16 sm:py-24 ${innerClassName}`}>
        {children}
      </div>
    </section>
  );
}

export function Eyebrow({
  children,
  tone = "violet",
}: {
  children: ReactNode;
  tone?: "violet" | "paper";
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] ${
        tone === "violet" ? "text-violet-deep" : "text-paper/70"
      }`}
    >
      <span
        className={`size-1.5 rounded-full ${tone === "violet" ? "bg-violet" : "bg-amber"}`}
      />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subcopy,
  tone = "violet",
  align = "left",
}: {
  eyebrow?: string;
  title: ReactNode;
  subcopy?: string;
  tone?: "violet" | "paper";
  align?: "left" | "center";
}) {
  return (
    <div
      className={`flex flex-col gap-4 max-w-2xl ${align === "center" ? "mx-auto text-center items-center" : ""}`}
    >
      {eyebrow ? <Eyebrow tone={tone}>{eyebrow}</Eyebrow> : null}
      <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] text-balance">
        {title}
      </h2>
      {subcopy ? (
        <p className={`text-base sm:text-lg ${tone === "paper" ? "text-paper/70" : "text-ink/65"}`}>
          {subcopy}
        </p>
      ) : null}
    </div>
  );
}
