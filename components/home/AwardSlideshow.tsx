"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";

const AWARDS = Array.from({ length: 14 }, (_, i) => `/awards/award-${String(i + 1).padStart(2, "0")}.webp`);

const INTERVAL = 3500; // ms between slides

export function AwardSlideshow() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(() => setCurrent((c) => (c + 1) % AWARDS.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + AWARDS.length) % AWARDS.length), []);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(next, INTERVAL);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused, next]);

  return (
    <section className="py-24 lg:py-32 bg-navy overflow-hidden">
      <Container>
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-electric">
            Recognition
          </p>
          <h2 className="mt-3 font-display text-headline font-bold tracking-tight text-white">
            Awards &amp; Accolades
          </h2>
          <p className="mt-3 text-body-l text-white/60 max-w-xl mx-auto">
            Recognised by leading industry bodies for excellence in mutual fund distribution
            and investor service since 1999.
          </p>
        </div>

        {/* Slideshow */}
        <div
          className="relative mx-auto max-w-sm"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Award card */}
          <div className="relative overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10 shadow-2xl aspect-[3/4]">
            {AWARDS.map((src, i) => (
              <div
                key={src}
                className="absolute inset-0 transition-opacity duration-700"
                style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
              >
                <Image
                  src={src}
                  alt={`Award ${i + 1}`}
                  fill
                  className="object-contain p-6"
                  sizes="400px"
                  priority={i === 0}
                />
              </div>
            ))}

            {/* Prev / Next buttons */}
            <button
              onClick={() => { prev(); setPaused(true); }}
              aria-label="Previous award"
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/25"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => { next(); setPaused(true); }}
              aria-label="Next award"
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/25"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Dot indicators */}
          <div className="mt-6 flex justify-center gap-1.5">
            {AWARDS.map((_, i) => (
              <button
                key={i}
                onClick={() => { setCurrent(i); setPaused(true); }}
                aria-label={`Go to award ${i + 1}`}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: i === current ? "24px" : "6px",
                  backgroundColor: i === current ? "rgb(var(--color-electric, 22 117 244))" : "rgba(255,255,255,0.3)",
                }}
              />
            ))}
          </div>

          {/* Counter */}
          <p className="mt-4 text-center text-xs text-white/40">
            {current + 1} / {AWARDS.length}
          </p>
        </div>
      </Container>
    </section>
  );
}
