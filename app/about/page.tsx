import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionEyebrow } from "@/components/home/Services";
import { Button } from "@/components/ui/Button";
import { AwardSlideshow } from "@/components/home/AwardSlideshow";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <div className="bg-mesh-soft pt-28">
        <Container className="pb-20">
          <SectionEyebrow label="About Money Lancer" />
          <h1 className="mt-4 max-w-3xl font-display text-headline font-bold tracking-tight text-ink">
            25 years of helping Indian families build wealth — one goal at a time.
          </h1>
          <p className="mt-6 max-w-3xl text-body-l text-slate1">
            Money Lancer Investments was founded in 1999 by Mr. Santosh Pardeshi in Pune, with a
            simple belief: financial advice should be personal, transparent, and free of jargon.
            Today, we serve hundreds of families across India — from young professionals starting
            their first SIP to retirees managing multi-generational legacy.
          </p>
          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {[
              { title: "Trust", body: "Independent, fee-transparent advisory — your interests come first, always." },
              { title: "Discipline", body: "Goal-based portfolios that survive market cycles instead of chasing fads." },
              { title: "Partnership", body: "Long-term relationships, not one-off transactions. We grow with you." },
            ].map((v) => (
              <div key={v.title} className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-soft">
                <h3 className="text-title-s font-semibold text-ink">{v.title}</h3>
                <p className="mt-2 text-sm text-slate1">{v.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* Leadership — Santosh (founder), wider feature */}
      <section className="relative overflow-hidden py-24 lg:py-32 bg-white">
        <div className="hex-pattern absolute inset-0 opacity-[0.04] pointer-events-none" />
        <Container>
          <SectionEyebrow label="Leadership" />
          <h2 className="mt-4 max-w-3xl font-display text-headline font-bold tracking-tight text-ink">
            The people behind your portfolio.
          </h2>

          {/* Santosh — feature row */}
          <div className="mt-16 grid items-center gap-12 lg:grid-cols-[5fr,6fr] lg:gap-16">
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <svg className="pointer-events-none absolute -left-8 -top-8 z-0 h-36 w-36 opacity-40" viewBox="0 0 200 200">
                <defs>
                  <linearGradient id="ab-hex-1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#1675F4" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#64E9EE" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                <path d="M100 8 L180 52 V148 L100 192 L20 148 V52 Z" fill="url(#ab-hex-1)" />
              </svg>
              <svg className="pointer-events-none absolute -bottom-6 -right-4 z-0 h-28 w-28 opacity-60" viewBox="0 0 200 200">
                <defs>
                  <linearGradient id="ab-hex-2" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#0B3B7A" />
                    <stop offset="100%" stopColor="#1675F4" />
                  </linearGradient>
                </defs>
                <path d="M100 8 L180 52 V148 L100 192 L20 148 V52 Z" fill="url(#ab-hex-2)" />
              </svg>
              <div className="relative z-10 overflow-hidden rounded-3xl border border-black/[0.06] bg-white shadow-lift">
                <Image
                  src="/people/santosh.jpg"
                  alt="Mr. Santosh Pardeshi, founder of Money Lancer Investments"
                  width={1800}
                  height={1200}
                  className="block aspect-[4/3] w-full object-cover"
                />
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-crayola">Founder</div>
              <h3 className="mt-3 font-display text-title-l font-bold tracking-tight text-ink">Santosh Pardeshi</h3>
              <p className="mt-2 text-sm text-slate2">Founder · 25+ years in wealth management</p>
              <blockquote className="relative mt-6 max-w-xl">
                <svg viewBox="0 0 32 32" className="h-8 w-8 text-crayola/30" aria-hidden>
                  <path d="M10 8c-3 0-6 3-6 7v9h9V14h-5c0-2 1-3 4-3V8h-2Zm14 0c-3 0-6 3-6 7v9h9V14h-5c0-2 1-3 4-3V8h-2Z" fill="currentColor" />
                </svg>
                <p className="mt-3 text-body-l leading-relaxed text-graphite">
                  If your clients are happy and satisfied, you are successful. Everything else —
                  AUM, awards, recognition — follows from that one principle.
                </p>
              </blockquote>
              <p className="mt-6 max-w-xl text-body-m leading-relaxed text-slate1">
                Mr. Pardeshi founded Money Lancer Investments in Pune in 1999. He has personally
                guided portfolios for hundreds of families across India through every market cycle
                since the dotcom era — recessions, rallies, demonetisation, and the pandemic. His
                approach has remained the same throughout: goal-based investing, long-horizon
                discipline, and complete transparency.
              </p>
            </div>
          </div>

          {/* Sarthak — flipped row, slightly smaller */}
          <div className="mt-24 grid items-center gap-12 lg:grid-cols-[6fr,5fr] lg:gap-16">
            <div className="order-2 lg:order-1">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-crayola">Next generation</div>
              <h3 className="mt-3 font-display text-title-l font-bold tracking-tight text-ink">Sarthak Pardeshi</h3>
              <p className="mt-2 text-sm text-slate2">Wealth Advisor</p>
              <p className="mt-6 max-w-xl text-body-m leading-relaxed text-slate1">
                Sarthak represents the next generation of Money Lancer — bringing technology,
                modern asset classes (SIF, GIFT City, AIF) and a digital-first client experience
                to the firm's 25-year foundation. He works hands-on with younger investors building
                their first portfolios as well as with established families adding new products to
                a long-standing relationship.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button href="/#contact">Schedule a meeting</Button>
                <Button variant="secondary" href="/funds">Explore funds</Button>
              </div>
            </div>

            <div className="relative order-1 mx-auto w-full max-w-sm lg:order-2 lg:max-w-none">
              <svg className="pointer-events-none absolute -right-6 -top-6 z-0 h-28 w-28 opacity-50" viewBox="0 0 200 200">
                <defs>
                  <linearGradient id="ab-hex-3" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#64E9EE" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#1675F4" stopOpacity="0.2" />
                  </linearGradient>
                </defs>
                <path d="M100 8 L180 52 V148 L100 192 L20 148 V52 Z" fill="url(#ab-hex-3)" />
              </svg>
              <svg className="pointer-events-none absolute -bottom-8 -left-6 z-0 h-32 w-32 opacity-50" viewBox="0 0 200 200">
                <defs>
                  <linearGradient id="ab-hex-4" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#1675F4" />
                    <stop offset="100%" stopColor="#0B3B7A" />
                  </linearGradient>
                </defs>
                <path d="M100 8 L180 52 V148 L100 192 L20 148 V52 Z" fill="url(#ab-hex-4)" />
              </svg>
              <div className="relative z-10 overflow-hidden rounded-3xl border border-black/[0.06] bg-white shadow-lift">
                <Image
                  src="/people/sarthak.jpg"
                  alt="Sarthak Pardeshi, wealth advisor at Money Lancer Investments"
                  width={1800}
                  height={2700}
                  className="block aspect-[3/4] w-full object-cover object-top"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <AwardSlideshow />

      {/* Closing CTA */}
      <Container className="pb-24">
        <div className="rounded-3xl bg-navy p-10 text-white md:p-14">
          <h3 className="font-display text-title-l font-bold">Want to work with us?</h3>
          <p className="mt-3 max-w-xl text-white/75">
            A 30-minute conversation with our team. No obligation, no jargon — just honest answers
            about your money, your goals and what we'd actually recommend.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="light" href="/#contact">Book a free consultation</Button>
            <Button variant="ghost" href="/funds" className="text-white border border-white/20 hover:bg-white/10">
              Explore funds
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
}
