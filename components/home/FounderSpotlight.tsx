"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionEyebrow } from "@/components/home/Services";
import { Button } from "@/components/ui/Button";

/**
 * Founder spotlight — Santosh Pardeshi.
 * Split layout: portrait on the left framed by hex motifs, pull-quote
 * + credentials on the right. Sits between testimonials and CTA on the homepage.
 */
export default function FounderSpotlight() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32 bg-cloud">
      {/* subtle hex grid backdrop */}
      <div className="hex-pattern absolute inset-0 opacity-[0.04] pointer-events-none" />

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[5fr,6fr] lg:gap-16">
          {/* Portrait — left, framed with hex shapes */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
          >
            {/* decorative hex behind photo */}
            <svg
              className="pointer-events-none absolute -left-10 -top-10 z-0 h-40 w-40 opacity-40"
              viewBox="0 0 200 200"
            >
              <defs>
                <linearGradient id="founder-hex-a" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#1675F4" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#64E9EE" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              <path d="M100 8 L180 52 V148 L100 192 L20 148 V52 Z" fill="url(#founder-hex-a)" />
            </svg>
            <svg
              className="pointer-events-none absolute -bottom-8 -right-6 z-0 h-32 w-32 opacity-50"
              viewBox="0 0 200 200"
            >
              <defs>
                <linearGradient id="founder-hex-b" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#0B3B7A" />
                  <stop offset="100%" stopColor="#1675F4" />
                </linearGradient>
              </defs>
              <path d="M100 8 L180 52 V148 L100 192 L20 148 V52 Z" fill="url(#founder-hex-b)" />
            </svg>

            {/* photo */}
            <div className="relative z-10 overflow-hidden rounded-3xl border border-black/[0.06] bg-white shadow-lift">
              <Image
                src="/people/santosh.jpg"
                alt="Mr. Santosh Pardeshi, founder of Money Lancer Investments"
                width={1800}
                height={1200}
                className="block aspect-[4/3] w-full object-cover"
                priority={false}
              />
              {/* signature card pinned to the corner */}
              <div className="absolute bottom-5 left-5 max-w-[80%] rounded-xl bg-white/95 px-4 py-3 shadow-soft backdrop-blur">
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-crayola">Founder</div>
                <div className="mt-0.5 text-sm font-bold text-ink">Santosh Pardeshi</div>
                <div className="mt-0.5 text-[11px] text-slate2">Building trust since 1999</div>
              </div>
            </div>
          </motion.div>

          {/* Copy — right */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <SectionEyebrow label="Meet the founder" />
            <h2 className="mt-4 font-display text-headline font-bold tracking-tight text-ink">
              25+ years of helping<br className="hidden md:block" /> Indian families build wealth.
            </h2>

            <blockquote className="relative mt-8 max-w-xl">
              <svg viewBox="0 0 32 32" className="h-10 w-10 text-crayola/30" aria-hidden>
                <path d="M10 8c-3 0-6 3-6 7v9h9V14h-5c0-2 1-3 4-3V8h-2Zm14 0c-3 0-6 3-6 7v9h9V14h-5c0-2 1-3 4-3V8h-2Z" fill="currentColor" />
              </svg>
              <p className="mt-3 text-body-l leading-relaxed text-graphite">
                If your clients are happy and satisfied, you are successful. Everything else —
                AUM, awards, recognition — follows from that one principle.
              </p>
              <footer className="mt-5 text-sm text-slate2">— Santosh Pardeshi</footer>
            </blockquote>

            <p className="mt-6 max-w-xl text-body-m leading-relaxed text-slate1">
              Founded Money Lancer Investments in Pune in 1999. Personally manages portfolios
              for hundreds of families across India, with a focus on goal-based investing,
              long-horizon discipline and transparent advisory.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/about">More about us</Button>
              <Button variant="secondary" href="/#contact">Book a meeting</Button>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
