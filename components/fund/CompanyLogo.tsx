import Image from "next/image";
import { getLogoForName } from "@/lib/amcs";

/**
 * Small AMC logo shown in fund rows. Falls back to a tinted monogram
 * (initials) when no logo file is mapped.
 *
 * Logos vary wildly in aspect ratio (HDFC is square-ish, Aditya Birla is wide,
 * ICICI has tall lettering). To keep rows aligned we render a fixed square
 * frame and let the image `object-contain` inside it — wide logos use the full
 * width, tall logos use the full height, all sit comfortably.
 */
export function CompanyLogo({ company, size = 40 }: { company: string; size?: number }) {
  const logo = getLogoForName(company);
  const padding = Math.max(4, Math.round(size * 0.12));

  if (logo) {
    return (
      <span
        className="inline-flex shrink-0 items-center justify-center rounded-lg border border-black/[0.06] bg-white overflow-hidden"
        style={{ width: size, height: size, padding }}
        aria-hidden
      >
        <Image
          src={logo}
          alt=""
          width={200}
          height={200}
          unoptimized
          className="block max-h-full max-w-full object-contain"
        />
      </span>
    );
  }

  const initials =
    (company || "?")
      .replace(/mutual fund|mf|asset management|asset manager/gi, "")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase() || "?";
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-lg bg-yale font-bold text-white"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.32) }}
      aria-hidden
    >
      {initials}
    </span>
  );
}
