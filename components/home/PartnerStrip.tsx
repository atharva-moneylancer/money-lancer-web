import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { AMCS } from "@/lib/amcs";

// Two rows of AMC logos that auto-scroll continuously.
// Each row is duplicated inline so the CSS marquee can loop seamlessly
// (translateX 0 → -50%) without a visible reset.
export default function PartnerStrip() {
  const row1 = AMCS.slice(0, Math.ceil(AMCS.length / 2));
  const row2 = AMCS.slice(Math.ceil(AMCS.length / 2));

  return (
    <section className="relative border-y border-black/5 bg-white py-14 overflow-hidden">
      <Container>
        <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-slate2">
          Distributing schemes from 40+ AMCs
        </p>
      </Container>

      <div className="mt-10 space-y-6">
        <MarqueeRow items={row1} duration={55} />
        <MarqueeRow items={row2} duration={65} reverse />
      </div>

      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />
    </section>
  );
}

function MarqueeRow({ items, duration, reverse }: { items: typeof AMCS; duration: number; reverse?: boolean }) {
  return (
    <div className="relative w-full overflow-hidden">
      <div
        className="ml-marquee"
        data-reverse={reverse ? "true" : "false"}
        style={{ ["--marquee-duration" as any]: `${duration}s` }}
      >
        {/* Duplicate the row so the animation loops seamlessly. The transform
            travels 0 → -50%, which is exactly one full row's width. */}
        <Track items={items} />
        <Track items={items} ariaHidden />
      </div>
    </div>
  );
}

function Track({ items, ariaHidden }: { items: typeof AMCS; ariaHidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center gap-12 pr-12" aria-hidden={ariaHidden}>
      {items.map((amc) => (
        <Link
          key={amc.slug + (ariaHidden ? "-clone" : "")}
          href={`/funds/amc/${amc.slug}`}
          className="group relative flex h-12 w-32 shrink-0 items-center justify-center"
          aria-label={ariaHidden ? undefined : amc.name}
          tabIndex={ariaHidden ? -1 : 0}
        >
          <Image
            src={amc.logo}
            alt={amc.name}
            width={120}
            height={40}
            className="max-h-10 w-auto object-contain opacity-60 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0"
          />
        </Link>
      ))}
    </div>
  );
}
