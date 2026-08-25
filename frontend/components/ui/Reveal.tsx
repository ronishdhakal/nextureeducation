import type { ReactNode } from "react";

/**
 * Historically wrapped children in a scroll-triggered fade-in. Removed: it
 * relied on IntersectionObserver firing before content was ever read, which
 * left below-the-fold sections stuck invisible when it didn't fire in time.
 * Kept as a pass-through so call sites don't need to change.
 */
export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
