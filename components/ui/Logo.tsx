import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Money Lancer brand assets — the real PNGs under /public/brand/ (placed there
 * from the official `moneylancer_logos` folder).
 *
 *   logomark.png            — hex shield, mark only
 *   horizontal.png          — mark + wordmark beside (default lockup)
 *   horizontal-tagline.png  — horizontal lockup + tagline
 *   vertical.png            — mark above wordmark
 *   vertical-tagline.png    — vertical lockup + tagline
 *
 * For dark surfaces (e.g. the navy footer) we render the same PNG with a CSS
 * filter that silhouettes it to white — matching the "white on dark" usage in
 * the official Brand Guidelines PDF.
 */

export function LogoMark({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <Image
      src="/brand/logomark.png"
      alt="Money Lancer"
      width={128}
      height={128}
      priority
      className={cn(
        "block h-9 w-9 object-contain",
        inverted && "brightness-0 invert",
        className
      )}
    />
  );
}

type Variant = "horizontal" | "vertical" | "horizontal-tagline" | "vertical-tagline";

const VARIANT_SRC: Record<Variant, string> = {
  horizontal: "/brand/horizontal.png",
  vertical: "/brand/vertical.png",
  "horizontal-tagline": "/brand/horizontal-tagline.png",
  "vertical-tagline": "/brand/vertical-tagline.png",
};

const VARIANT_INTRINSIC: Record<Variant, { w: number; h: number }> = {
  horizontal: { w: 1200, h: 320 },
  vertical: { w: 800, h: 800 },
  "horizontal-tagline": { w: 1200, h: 400 },
  "vertical-tagline": { w: 800, h: 900 },
};

export function LogoLockup({
  className,
  inverted = false,
  variant = "horizontal",
}: {
  className?: string;
  inverted?: boolean;
  variant?: Variant;
}) {
  const { w, h } = VARIANT_INTRINSIC[variant];
  return (
    <Image
      src={VARIANT_SRC[variant]}
      alt="Money Lancer"
      width={w}
      height={h}
      priority
      className={cn(
        "block w-auto",
        variant.startsWith("horizontal") ? "h-8" : "h-12",
        inverted && "brightness-0 invert",
        className
      )}
    />
  );
}
