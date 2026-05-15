"use client";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import type { Quote } from "@/lib/markets";

const FALLBACK_QUOTES: Quote[] = [
  { label: "NIFTY 50", value: "—", delta: "—", up: true },
  { label: "SENSEX", value: "—", delta: "—", up: true },
  { label: "GOLD ₹/10g", value: "—", delta: "—", up: true },
  { label: "USD / INR", value: "—", delta: "—", up: true },
];

export default function Hero({ quotes }: { quotes?: Quote[] }) {
  const tickers = quotes && quotes.length === 4 ? quotes : FALLBACK_QUOTES;
  return (
    <section className="relative isolate overflow-hidden bg-mesh-hero text-white">
      {/* noise + grid overlays */}
      <div className="noise-overlay" />
      <FloatingHexagons />

      <Container className="relative z-10 pt-36 pb-28 lg:pt-44 lg:pb-36">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium tracking-wide text-white/80 backdrop-blur"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-spring animate-pulse-soft" />
          Trusted by Indian families since 1999
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
          }}
          className="mt-6 max-w-5xl font-display text-display font-bold leading-[1.02] tracking-tight"
        >
          {["Build wealth", "with a partner", "who's with you for"].map((line, i) => (
            <motion.span
              key={i}
              variants={{
                hidden: { opacity: 0, y: 24 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
              }}
              className="block"
            >
              {line}
            </motion.span>
          ))}
          <motion.span
            variants={{
              hidden: { opacity: 0, y: 24 },
              show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
            }}
            className="block"
          >
            <span className="bg-gradient-to-r from-electric via-white to-electric bg-clip-text text-transparent">
              every season of life.
            </span>
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-7 max-w-2xl text-body-l text-white/75"
        >
          Personalised mutual fund guidance, retirement investing, PMS, AIF and goal-based investing
          — backed by 25+ years of experience and a tech-first client experience.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.6 }}
          className="mt-9 flex flex-wrap items-center gap-3"
        >
          <Button size="lg" variant="light" href="/#contact">
            Start your investment journey →
          </Button>
          <Button size="lg" variant="ghost" className="text-white border border-white/20 hover:bg-white/10" href="/funds">
            Explore funds
          </Button>
        </motion.div>

        {/* Market ticker strip — live from Yahoo Finance via /lib/markets.ts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-6 max-w-3xl"
        >
          {tickers.map((m) => (
            <div
              key={m.label}
              className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur"
            >
              <div className="text-[10px] uppercase tracking-wider text-white/55">{m.label}</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="tabular text-lg font-semibold">{m.value}</span>
                <span className={`text-xs tabular ${m.up ? "text-spring" : "text-critical"}`}>
                  {m.delta}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </Container>

      {/* curve fade out */}
      <svg
        className="absolute bottom-[-1px] left-0 w-full"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path d="M0 80 L1440 80 L1440 30 Q720 80 0 30 Z" fill="#FAFCFF" />
      </svg>
    </section>
  );
}

function FloatingHexagons() {
  // Layered SVG hex motif that subtly drifts — echoes the logo
  return (
    <>
      <svg
        className="pointer-events-none absolute right-[-120px] top-[-80px] z-0 animate-float-slower opacity-60"
        width="640"
        height="640"
        viewBox="0 0 200 200"
      >
        <defs>
          <linearGradient id="hexA" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1675F4" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#64E9EE" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        <path d="M100 8 L180 52 V148 L100 192 L20 148 V52 Z" fill="url(#hexA)" />
      </svg>

      <svg
        className="pointer-events-none absolute right-[10%] top-[14%] z-0 animate-float-slow opacity-80"
        width="200"
        height="200"
        viewBox="0 0 200 200"
      >
        <defs>
          <linearGradient id="hexB" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1675F4" />
            <stop offset="100%" stopColor="#0B3B7A" />
          </linearGradient>
        </defs>
        <path d="M100 8 L180 52 V148 L100 192 L20 148 V52 Z" fill="url(#hexB)" />
      </svg>

      <svg
        className="pointer-events-none absolute left-[-40px] bottom-[-80px] z-0 animate-float-slower opacity-30"
        width="280"
        height="280"
        viewBox="0 0 200 200"
      >
        <path d="M100 8 L180 52 V148 L100 192 L20 148 V52 Z" fill="#64E9EE" />
      </svg>

      {/* grid */}
      <div className="hex-pattern absolute inset-0 z-0 opacity-[0.07]" />
    </>
  );
}
