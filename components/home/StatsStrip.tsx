"use client";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { Container } from "@/components/ui/Container";
import { formatNumberIN } from "@/lib/format";

const STATS = [
  { label: "AUM Managed", value: 500, suffix: " Cr INR", caption: "as of 2025" },
  { label: "Clients", value: 2500, suffix: "+", caption: "across India" },
  { label: "Years of trust", value: 25, suffix: " yrs", caption: "since 1999" },
  { label: "AMC partners", value: 40, suffix: "+", caption: "fund houses" },
];

export default function StatsStrip() {
  return (
    <section className="relative -mt-6">
      <Container>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-black/5 bg-black/5 shadow-lift md:grid-cols-4">
          {STATS.map((s) => (
            <StatTile key={s.label} {...s} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function StatTile({ label, value, suffix, caption }: { label: string; value: number; suffix: string; caption: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => formatNumberIN(v));
  useEffect(() => {
    if (inView) {
      const controls = animate(mv, value, { duration: 1.8, ease: "easeOut" });
      return () => controls.stop();
    }
  }, [inView, mv, value]);

  return (
    <div ref={ref} className="group relative bg-white p-6 md:p-8">
      <div className="text-[11px] uppercase tracking-[0.14em] text-slate2">{label}</div>
      <div className="mt-3 flex items-baseline gap-1 text-yale">
        <motion.span className="tabular text-3xl md:text-4xl font-bold">{rounded}</motion.span>
        <span className="text-xl font-semibold text-graphite">{suffix}</span>
      </div>
      <div className="mt-1 text-sm text-slate2">{caption}</div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-crayola/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  );
}
