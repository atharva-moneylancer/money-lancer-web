import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionEyebrow } from "@/components/home/Services";
import { SERVICES } from "@/lib/services";

export const metadata = { title: "Services" };

export default function ServicesIndex() {
  return (
    <div className="bg-mesh-soft pt-28">
      <Container className="pb-24">
        <SectionEyebrow label="Services" />
        <h1 className="mt-4 max-w-3xl font-display text-headline font-bold tracking-tight text-ink">
          A complete wealth practice for Indian families.
        </h1>
        <p className="mt-4 max-w-2xl text-body-l text-slate1">
          Every solution we offer, grouped so you can find the right starting point.
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="group flex flex-col justify-between rounded-2xl border border-black/[0.06] bg-white p-6 transition-all hover:-translate-y-1 hover:border-crayola/30 hover:shadow-lift"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-title-s font-semibold text-ink group-hover:text-crayola">{s.title}</h3>
                  {s.badge === "ELITE" && (
                    <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-bold tracking-wider text-[#7a5b00]">{s.badge}</span>
                  )}
                  {s.badge === "NEW" && (
                    <span className="rounded-full bg-electric/20 px-2 py-0.5 text-[10px] font-bold tracking-wider text-yale">{s.badge}</span>
                  )}
                </div>
                <p className="mt-3 text-sm text-slate1">{s.tagline}</p>
              </div>
              <div className="mt-6 inline-flex items-center text-sm font-semibold text-crayola">
                Learn more
                <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
