import type { ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  tone?: "paper" | "ink";
  className?: string;
  id?: string;
};

export function Section({ children, tone = "paper", className = "", id }: SectionProps) {
  const toneClass = tone === "ink" ? "bg-ink text-paper" : "bg-paper text-ink";
  return (
    <section id={id} className={`${toneClass} ${className}`}>
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 py-16 sm:py-24">{children}</div>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="font-mono text-xs uppercase tracking-[0.2em] text-saffron-deep">
      {children}
    </span>
  );
}
