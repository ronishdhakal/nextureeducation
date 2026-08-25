import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  subcopy,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  subcopy?: string;
  children?: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden bg-ink">
      <div
        aria-hidden
        className="absolute -top-24 -right-24 size-72 rounded-full opacity-60 blur-3xl"
        style={{
          background: "radial-gradient(circle, var(--violet) 0%, transparent 70%)",
        }}
      />
      <div className="relative mx-auto w-full max-w-6xl px-6 sm:px-8 pt-16 sm:pt-20 pb-16 sm:pb-20">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-violet-pale">
          <span className="size-1.5 rounded-full bg-amber" />
          {eyebrow}
        </span>
        <h1 className="mt-5 font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white leading-[1.08] text-balance max-w-2xl">
          {title}
        </h1>
        {subcopy ? <p className="mt-4 text-white/70 max-w-xl text-lg">{subcopy}</p> : null}
        {children}
      </div>
    </div>
  );
}
