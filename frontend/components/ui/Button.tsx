import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import Link from "next/link";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "ghost-light";
  className?: string;
  size?: "md" | "lg" | "xl";
  arrow?: boolean;
};

const VARIANTS: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-violet text-white hover:bg-violet-deep shadow-sm shadow-violet/25",
  secondary: "bg-white text-violet-deep border border-violet/30 hover:border-violet",
  ghost: "border border-violet text-violet-deep bg-white/60 hover:bg-violet-pale",
  "ghost-light": "border border-white/30 text-white hover:border-white hover:bg-white/10",
};

export function buttonClasses(
  variant: NonNullable<ButtonProps["variant"]> = "primary",
  size: NonNullable<ButtonProps["size"]> = "md",
  className = ""
) {
  const sizeClass =
    size === "xl"
      ? "px-8 py-4 text-base"
      : size === "lg"
        ? "px-7 py-3.5 text-sm"
        : "px-5 py-2.5 text-sm";
  return `group inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 ${sizeClass} ${VARIANTS[variant]} ${className}`;
}

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
  size = "md",
  arrow = false,
}: ButtonProps) {
  const sizeClass =
    size === "xl"
      ? "px-8 py-4 text-base"
      : size === "lg"
        ? "px-7 py-3.5 text-sm"
        : "px-5 py-2.5 text-sm";
  return (
    <Link
      href={href}
      className={`group inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 ${sizeClass} ${VARIANTS[variant]} ${className}`}
    >
      {children}
      {arrow ? (
        <ArrowRight
          className={`transition-transform duration-200 group-hover:translate-x-0.5 ${size === "xl" ? "size-5" : "size-4"}`}
          strokeWidth={2.2}
        />
      ) : null}
    </Link>
  );
}
