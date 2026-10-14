import type { ReactNode } from "react";

export function AdminPageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 pb-6 mb-8 border-b border-hairline">
      <div>
        <h1 className="font-display font-extrabold text-2xl text-ink tracking-tight">{title}</h1>
        {subtitle ? <p className="text-sm text-stone mt-1.5">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}
