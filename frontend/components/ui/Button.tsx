import type { ReactNode } from "react";
import Link from "next/link";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "ghost-light";
  className?: string;
  size?: "md" | "lg";
};

const VARIANTS: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-violet text-white shadow-[0_10px_30px_-10px_rgba(163,32,244,0.6)] hover:bg-violet-deep hover:shadow-[0_14px_36px_-8px_rgba(163,32,244,0.7)]",
  secondary: "bg-amber text-ink hover:bg-[#ffc456]",
  ghost: "border border-ink/15 text-ink hover:border-violet hover:text-violet-deep",
  "ghost-light": "border border-white/25 text-white hover:border-white hover:bg-white/10",
};

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
  size = "md",
}: ButtonProps) {
  const sizeClass = size === "lg" ? "px-7 py-3.5 text-base" : "px-5 py-3 text-sm";
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 hover:-translate-y-0.5 focus-visible:-translate-y-0.5 ${sizeClass} ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
