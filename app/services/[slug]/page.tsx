import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionEyebrow } from "@/components/home/Services";
import { SERVICES, getService } from "@/lib/services";
import SIFList from "@/components/services/SIFList";
import SifOfferings from "@/components/fund/SifOfferings";

export const revalidate = 24 * 3600;

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const s = getService(params.slug);
  return { title: s?.title || "Service" };
}

export async function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const s = getService(params.slug);
  if (!s) notFound();

  return (
    <div className="bg-mesh-soft pt-28">
      <Container className="pb-16">
        <Link href="/#services" className="text-sm font-semibold text-crayola hover:underline">← All services</Link>
        <div className="mt-5 flex items-center gap-3">
          <SectionEyebrow label="Service" />
          {s.badge === "ELITE" && (
            <span className="rounded-full bg-gold/15 px-3 py-1 text-[10px] font-bold tracking-wider text-[#7a5b00]">ELITE</span>
          )}
          {s.badge === "NEW" && (
            <span className="rounded-full bg-electric/20 px-3 py-1 text-[10px] font-bold tracking-wider text-yale">NEW</span>
          )}
        </div>
        <h1 className="mt-4 max-w-3xl font-display text-headline font-bold tracking-tight text-ink">{s.title}</h1>
        <p className="mt-4 max-w-2xl text-body-l text-slate1">{s.tagline}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          {s.cta && <Button href={s.cta.href}>{s.cta.label}</Button>}
          {s.ctaSecondary && <Button variant="secondary" href={s.ctaSecondary.href}>{s.ctaSecondary.label}</Button>}
        </div>
      </Container>

      <Container className="pb-16">
        <div className="grid gap-10 lg:grid-cols-[2fr,1fr]">
          <article className="space-y-6">
            <div className="rounded-2xl border border-black/[0.06] bg-white p-8 shadow-soft">
              <h2 className="text-title-m font-bold text-yale">What this is</h2>
              <p className="mt-4 text-body-m leading-relaxed text-slate1">{s.intro}</p>
              <ul className="mt-6 space-y-3">
                {s.bullets.map((b) => (
                  <li key={b} className="flex gap-3 text-sm text-graphite">
                    <span className="mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                      <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none"><path d="M5 12l5 5 9-11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {s.slug === "sif" && (
              <div>
                <h2 className="text-title-m font-bold text-yale">Available SIF options</h2>
                <p className="mt-2 text-sm text-slate1">
                  We add a fund here once it's approved by SEBI and we've
                  reviewed the manager's track record.
                </p>
                <div className="mt-4">
                  <SIFList />
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-black/[0.06] bg-white p-8 shadow-soft">
              <h2 className="text-title-m font-bold text-yale">FAQ</h2>
              <dl className="mt-5 divide-y divide-black/5">
                {s.faqs.map((f) => (
                  <div key={f.q} className="py-5 first:pt-0 last:pb-0">
                    <dt className="text-title-s font-semibold text-ink">{f.q}</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-slate1">{f.a}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </article>

          <aside className="space-y-5">
            <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-soft">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate2">Best for</div>
              <ul className="mt-3 space-y-2 text-sm text-graphite">
                {s.bestFor.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-crayola" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {s.notFor && s.notFor.length > 0 && (
              <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-soft">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate2">Not the right fit if</div>
                <ul className="mt-3 space-y-2 text-sm text-graphite">
                  {s.notFor.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-critical" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-2xl bg-navy p-6 text-white">
              <h3 className="text-title-s font-semibold">Personalised advice</h3>
              <p className="mt-2 text-sm text-white/75">Tell us your situation and we'll send a 1-page recommendation in 24 hours.</p>
              <Button variant="light" href="/#contact" className="mt-4 w-full">Book a call</Button>
            </div>
          </aside>
        </div>
      </Container>


      <Container className="pb-24">
        <h3 className="text-title-m font-bold text-yale">Other services</h3>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.filter((x) => x.slug !== s.slug).slice(0, 4).map((o) => (
            <Link
              key={o.slug}
              href={`/services/${o.slug}`}
              className="rounded-xl border border-black/[0.06] bg-white p-5 transition-all hover:border-crayola/30 hover:shadow-lift"
            >
              <div className="text-sm font-semibold text-ink">{o.title}</div>
              <div className="mt-2 text-xs text-slate1">{o.tagline}</div>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
