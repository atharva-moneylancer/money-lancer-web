"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AMCS } from "@/lib/amcs";

type Props = {
  perSlideDesktop?: number;
  perSlideTablet?: number;
  perSlideMobile?: number;
  autoplayMs?: number;
};

export function AmcSlideshow({
  perSlideDesktop = 7,
  perSlideTablet = 5,
  perSlideMobile = 3,
  autoplayMs = 4500,
}: Props) {
  const [perSlide, setPerSlide] = useState(perSlideDesktop);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const direction = useRef(1);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) setPerSlide(perSlideMobile);
      else if (w < 1024) setPerSlide(perSlideTablet);
      else setPerSlide(perSlideDesktop);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [perSlideDesktop, perSlideTablet, perSlideMobile]);

  const slides = useMemo(() => {
    const out: typeof AMCS[] = [];
    for (let i = 0; i < AMCS.length; i += perSlide) out.push(AMCS.slice(i, i + perSlide));
    return out;
  }, [perSlide]);

  const total = slides.length;
  const safeIndex = total === 0 ? 0 : index % total;

  useEffect(() => {
    if (paused || total <= 1) return;
    const t = setInterval(() => {
      direction.current = 1;
      setIndex((i) => (i + 1) % total);
    }, autoplayMs);
    return () => clearInterval(t);
  }, [paused, total, autoplayMs]);

  const go = (delta: number) => {
    direction.current = delta;
    setIndex((i) => (i + delta + total) % total);
  };

  if (total === 0) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-label="Fund houses we distribute"
    >
      <div className="relative overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-soft">
        <AnimatePresence mode="wait" custom={direction.current}>
          <motion.div
            key={safeIndex}
            custom={direction.current}
            initial={{ opacity: 0, x: direction.current * 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction.current * -30 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="grid items-stretch px-14 py-6 md:px-16 md:py-8"
            style={{ gridTemplateColumns: `repeat(${perSlide}, minmax(0, 1fr))` }}
          >
            {slides[safeIndex].map((amc) => (
              <Link
                key={amc.slug}
                href={`/funds/amc/${amc.slug}`}
                title={amc.name}
                aria-label={amc.name}
                className="group flex flex-col items-center justify-center gap-2 rounded-xl px-3 py-3 transition-all hover:bg-cloud"
              >
                {/* Logo frame — fixed height, image scales to fit by both axes */}
                <span className="flex h-14 w-full items-center justify-center">
                  <Image
                    src={amc.logo}
                    alt={amc.name}
                    width={200}
                    height={120}
                    className="block max-h-14 max-w-full w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </span>
                <span className="block truncate text-center text-[11px] font-medium text-slate2 group-hover:text-crayola transition-colors">
                  {amc.name}
                </span>
              </Link>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Prev / Next controls */}
        <button
          aria-label="Previous"
          onClick={() => go(-1)}
          className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-graphite shadow-soft transition-all hover:border-crayola hover:text-crayola"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
            <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          aria-label="Next"
          onClick={() => go(1)}
          className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-graphite shadow-soft transition-all hover:border-crayola hover:text-crayola"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
            <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="mt-4 flex items-center justify-center gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Slide ${i + 1}`}
            onClick={() => {
              direction.current = i > safeIndex ? 1 : -1;
              setIndex(i);
            }}
            className={`h-1.5 rounded-full transition-all ${
              i === safeIndex ? "w-6 bg-crayola" : "w-1.5 bg-mist hover:bg-slate2"
            }`}
          />
        ))}
      </div>

      <div className="mt-2 text-center text-[11px] text-slate2">
        Hover to pause · {AMCS.length} AMCs · auto-rotating
      </div>
    </div>
  );
}
