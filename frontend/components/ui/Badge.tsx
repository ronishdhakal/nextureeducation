import type { ReactNode } from "react";

const COLORS = {
  violet: "bg-violet-pale text-violet-deep",
  amber: "bg-amber/20 text-[#8a5c00]",
  mint: "bg-mint/15 text-[#0d7a63]",
  ink: "bg-ink text-paper",
};

export function Badge({
  children,
  color = "violet",
  tilt = false,
  className = "",
}: {
  children: ReactNode;
  color?: keyof typeof COLORS;
  tilt?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-mono font-semibold uppercase tracking-wide ${COLORS[color]} ${tilt ? "-rotate-2" : ""} ${className}`}
    >
      {children}
    </span>
  );
}
