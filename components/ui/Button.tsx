"use client";
import Link from "next/link";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "light";
type Size = "sm" | "md" | "lg";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
  href?: string;
};

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-crayola text-white hover:bg-[#1262d6] shadow-lift hover:shadow-glow",
  secondary:
    "bg-white text-yale border border-yale/15 hover:border-crayola hover:text-crayola",
  ghost: "bg-transparent text-current hover:bg-black/5",
  light:
    "bg-white text-yale shadow-lift hover:bg-cloud",
};
const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-4 text-sm rounded-lg",
  md: "h-11 px-5 text-[15px] rounded-xl",
  lg: "h-14 px-7 text-base rounded-xl",
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = "primary", size = "md", className, href, children, ...rest },
  ref
) {
  const cls = cn(
    "inline-flex items-center justify-center gap-2 font-semibold tracking-tight transition-all duration-200 active:translate-y-px disabled:opacity-50 disabled:pointer-events-none",
    variantClasses[variant],
    sizeClasses[size],
    className
  );
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button ref={ref} className={cls} {...rest}>
      {children}
    </button>
  );
});
