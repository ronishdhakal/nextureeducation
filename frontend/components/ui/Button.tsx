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
  primary: "bg-violet text-white hover:bg-violet-deep",
  secondary: "bg-white text-violet-deep border border-violet/30 hover:border-violet",
  ghost: "border border-ink/20 text-ink hover:border-violet hover:text-violet-deep",
  "ghost-light": "border border-white/30 text-white hover:border-white hover:bg-white/10",
};

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
  size = "md",
}: ButtonProps) {
  const sizeClass = size === "lg" ? "px-6 py-3 text-base" : "px-5 py-2.5 text-sm";
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors duration-150 ${sizeClass} ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
