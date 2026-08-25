import type { ReactNode } from "react";

const COLORS = {
  violet: "bg-violet-pale text-violet-deep",
  amber: "bg-amber/15 text-[#8a5c00]",
  ink: "bg-ink text-paper",
  outline: "border border-current/25 text-ink",
};

export function Badge({
  children,
  color = "violet",
  className = "",
}: {
  children: ReactNode;
  color?: keyof typeof COLORS;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${COLORS[color]} ${className}`}
    >
      {children}
    </span>
  );
}
