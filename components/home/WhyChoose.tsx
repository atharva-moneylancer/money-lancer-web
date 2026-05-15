"use client";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionEyebrow } from "@/components/home/Services";

const WHYS = [
  {
    title: "Client-Centric Approach",
    body: "Every portfolio begins with your goals and risk profile — not the latest hot fund.",
    Icon: IconUser,
  },
  {
    title: "Transparent & Ethical",
    body: "No hidden charges. Plain-English explanations. Independent advisory you can trust.",
    Icon: IconScale,
  },
  {
    title: "Experienced Team",
    body: "25+ years building portfolios across every market cycle since 1999.",
    Icon: IconStars,
  },
  {
    title: "Technology Driven",
    body: "Live dashboards, goal trackers and instant SIP onboarding through our app.",
    Icon: IconChip,
  },
];

export default function WhyChoose() {
  return (
    <section id="why-choose-us" className="py-24 lg:py-32 bg-white">
      <Container>
        <div className="max-w-3xl">
          <SectionEyebrow label="Why Money Lancer" />
          <h2 className="mt-4 font-display text-headline font-bold tracking-tight text-ink">
            Built for steady growth.<br className="hidden md:block" /> Engineered for trust.
          </h2>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {WHYS.map((w, i) => (
            <motion.div
              key={w.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: i * 0.06 }}
              className="group relative overflow-hidden rounded-2xl border border-black/[0.06] bg-cloud p-6 hover:border-crayola/30 hover:bg-white hover:shadow-lift transition-all"
            >
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-crayola/8 blur-2xl transition-opacity group-hover:opacity-100" />
              <div className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl bg-yale text-white">
                <w.Icon className="h-5 w-5" />
              </div>
              <h3 className="relative mt-5 text-title-s font-semibold text-ink">{w.title}</h3>
              <p className="relative mt-2 text-sm leading-relaxed text-slate1">{w.body}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function IconUser(p: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 21c0-4 4-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
function IconScale(p: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M12 3v18M5 21h14M5 9l3-6 3 6M14 9l3-6 3 6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M2 9c1.5 2.5 5.5 2.5 7 0M15 9c1.5 2.5 5.5 2.5 7 0" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
function IconStars(p: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M12 3l2 4 4 .6-3 3 .7 4-3.7-2-3.7 2 .7-4-3-3 4-.6 2-4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
function IconChip(p: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <rect x="6" y="6" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 3v3M12 3v3M15 3v3M9 18v3M12 18v3M15 18v3M3 9h3M3 12h3M3 15h3M18 9h3M18 12h3M18 15h3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
