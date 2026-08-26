"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Scroll-triggered fade/rise-in. Safe by construction: the hidden state is
 * only ever applied client-side after mount, so content the server rendered
 * (crawlers, JS-disabled clients, or a slow/failed IntersectionObserver) is
 * always fully visible by default — it can only go opacity 1 -> 0 -> 1, never
 * start hidden and get stuck that way. prefers-reduced-motion is enforced in
 * CSS (see .reveal in globals.css) so it can't be defeated by timing either.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    if (node.getBoundingClientRect().top < window.innerHeight) {
      // Already on screen at mount — nothing to animate, just show it.
      return;
    }

    setArmed(true);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -80px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${armed ? (visible ? "reveal-in" : "reveal-out") : ""} ${className}`}
      style={armed && visible ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
