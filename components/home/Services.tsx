"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

const SERVICES = [
  {
    title: "Mutual Funds",
    desc: "Curated SIPs and lumpsum portfolios — Regular Plans, full advisor relationship.",
    href: "/services/mutual-funds",
    accent: "from-crayola/15 via-transparent to-transparent",
    Icon: IconPie,
  },
  {
    title: "SIF",
    desc: "SEBI's new Specialized Investment Fund category — PMS-style strategies, ₹10L minimum.",
    href: "/sif",
    badge: "NEW",
    accent: "from-electric/20 via-transparent to-transparent",
    Icon: IconSpark,
  },
  {
    title: "Bonds & NCDs",
    desc: "G-Secs, SDLs, tax-free bonds, Sovereign Gold Bonds, and corporate NCDs with FD-beating coupons.",
    href: "/services/bonds",
    Icon: IconBuilding,
  },
  {
    title: "Insurance",
    desc: "Life, health and term cover — independent, jargon-free advisory.",
    href: "/services/insurance",
    Icon: IconShield,
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 lg:py-32">
      <Container>
        <SectionEyebrow label="What we do" />
        <h2 className="mt-4 max-w-3xl font-display text-headline font-bold text-ink">
          A complete wealth practice,<br className="hidden md:block" /> not just a fund distributor.
        </h2>
        <p className="mt-4 max-w-2xl text-body-l text-slate1">
          From your first SIP to multi-generational legacy investing — every product, every
          conversation tailored to your goals.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: i * 0.04 }}
              className=""
            >
              <Link
                href={s.href}
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-crayola/30 hover:shadow-lift"
              >
                <div className={`absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${s.accent ?? "from-crayola/10 via-transparent to-transparent"}`} />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-crayola/10 text-crayola">
                      <s.Icon className="h-5 w-5" />
                    </div>
                    {s.badge && (
                      <span className="rounded-full bg-electric/15 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-yale">
                        {s.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-5 text-title-s font-semibold text-ink">{s.title}</h3>
                  <p className="mt-2 text-sm text-slate1">{s.desc}</p>
                </div>
                <div className="relative mt-6 inline-flex items-center text-sm font-semibold text-crayola">
                  Learn more
                  <svg className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function SectionEyebrow({ label }: { label: string }) {
  return (
    <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-crayola">
      <span className="h-px w-6 bg-crayola/40" />
      {label}
    </div>
  );
}

// Inline stroked icons (Phosphor-inspired)
function IconPie(p: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M12 3a9 9 0 1 0 9 9h-9V3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M14 3v7h7a9 9 0 0 0-7-7Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
function IconSpark(p: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M12 3l2.6 6.4L21 12l-6.4 2.6L12 21l-2.6-6.4L3 12l6.4-2.6L12 3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
function IconDoc(p: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M7 3h7l5 5v13H7z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M14 3v5h5M9 13h6M9 17h6M9 9h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function IconBuilding(p: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M4 21V8h16v13M4 8l8-5 8 5M9 21v-6h6v6M9 12h2M13 12h2M9 16h2M13 16h2" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
function IconShield(p: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconCoin(p: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <ellipse cx="12" cy="6" rx="8" ry="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
