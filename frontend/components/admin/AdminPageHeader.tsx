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
    <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
      <div>
        <h1 className="font-display font-extrabold text-2xl text-ink">{title}</h1>
        {subtitle ? <p className="text-sm text-stone mt-1">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}
