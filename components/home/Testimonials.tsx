"use client";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionEyebrow } from "@/components/home/Services";

const TS = [
  {
    quote:
      "Money Lancer has helped me grow my portfolio consistently with sound advice — they treat my SIPs like their own.",
    name: "Rajesh P.",
    role: "Business Owner, Pune",
  },
  {
    quote:
      "Goal-based investing gave me clarity for my children's education. Very professional and deeply personal.",
    name: "Sneha M.",
    role: "IT Professional, Bengaluru",
  },
  {
    quote:
      "Great customer service and transparent advisory. I feel confident about my financial future for the first time.",
    name: "Amit D.",
    role: "Retired Officer, Pune",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 lg:py-32 bg-cloud">
      <Container>
        <SectionEyebrow label="What clients say" />
        <h2 className="mt-4 max-w-3xl font-display text-headline font-bold tracking-tight text-ink">
          Real families. Real outcomes.
        </h2>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {TS.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              className="relative rounded-2xl border border-black/[0.06] bg-white p-7 shadow-soft hover:shadow-lift transition-all"
            >
              <svg viewBox="0 0 32 32" className="h-7 w-7 text-crayola/30" aria-hidden>
                <path d="M10 8c-3 0-6 3-6 7v9h9V14h-5c0-2 1-3 4-3V8h-2Zm14 0c-3 0-6 3-6 7v9h9V14h-5c0-2 1-3 4-3V8h-2Z" fill="currentColor" />
              </svg>
              <blockquote className="mt-3 text-body-m text-graphite leading-relaxed">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-yale text-sm font-bold text-white">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-ink">{t.name}</div>
                  <div className="text-xs text-slate2">{t.role}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
