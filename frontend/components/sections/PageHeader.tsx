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
    <div className="bg-paper-2 border-b border-hairline">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 pt-14 sm:pt-16 pb-14 sm:pb-16">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-deep">
          {eyebrow}
        </span>
        <h1 className="mt-4 font-display font-bold text-3xl sm:text-4xl text-ink leading-[1.15] text-balance max-w-2xl">
          {title}
        </h1>
        {subcopy ? <p className="mt-4 text-ink/65 max-w-xl text-lg">{subcopy}</p> : null}
        {children}
      </div>
    </div>
  );
}
