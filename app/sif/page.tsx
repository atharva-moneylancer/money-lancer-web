import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionEyebrow } from "@/components/home/Services";
import { getSIFSchemes } from "@/lib/advisorkhoj";
import { CompanyLogo } from "@/components/fund/CompanyLogo";

export const metadata = { title: "SIF — Specialized Investment Funds — Money Lancer" };
export const revalidate = 21600; // 6 hours

export default async function SIFPage() {
  let schemes: Awaited<ReturnType<typeof getSIFSchemes>> = [];
  let fetchError = false;

  try {
    schemes = await getSIFSchemes();
  } catch {
    fetchError = true;
  }

  return (
    <div className="bg-mesh-soft pt-28">
      <Container className="pb-24">
        <SectionEyebrow label="Specialized Investment Funds" />

        <div className="mt-4 flex flex-wrap items-start justify-between gap-6">
          <div>
            <h1 className="max-w-3xl font-display text-headline font-bold tracking-tight text-ink">
              SIF — India's newest investment category.
            </h1>
            <p className="mt-4 max-w-2xl text-body-l text-slate1">
              SEBI's Specialized Investment Fund framework brings PMS-style strategies to
              mutual fund wrappers. Minimum ₹10 lakh. Actively managed, benchmark-agnostic mandates.
            </p>
          </div>

          <Link
            href="/#contact"
            className="shrink-0 rounded-full bg-crayola px-6 py-3 text-sm font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
          >
            Talk to an advisor →
          </Link>
        </div>

        {/* What is SIF explainer */}
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            {
              label: "Minimum Investment",
              value: "₹10 Lakh",
              sub: "per strategy, per investor",
            },
            {
              label: "Strategy Style",
              value: "PMS-grade",
              sub: "benchmark-agnostic mandates",
            },
            {
              label: "Regulatory Framework",
              value: "SEBI SIF",
              sub: "Circular dated March 2025",
            },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-soft"
            >
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate2">
                {kpi.label}
              </p>
              <p className="mt-2 font-display text-title-l font-bold text-crayola">{kpi.value}</p>
              <p className="mt-1 text-xs text-slate1">{kpi.sub}</p>
            </div>
          ))}
        </div>

        {/* Scheme list */}
        <div className="mt-14">
          <h2 className="font-display text-title-m font-bold text-ink">
            Available SIF Schemes
          </h2>
          <p className="mt-1 text-sm text-slate1">
            Data refreshes every 6 hours.
          </p>

          {fetchError ? (
            <div className="mt-6 rounded-2xl border border-black/[0.06] bg-white px-6 py-14 text-center shadow-soft">
              <p className="text-sm font-semibold text-graphite">Couldn't load SIF data</p>
              <p className="mt-1 text-xs text-slate2">Please try again in a few minutes.</p>
            </div>
          ) : schemes.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-black/[0.06] bg-white px-6 py-14 text-center shadow-soft">
              <p className="text-2xl mb-3">🚀</p>
              <p className="text-sm font-semibold text-graphite">No SIF schemes listed yet</p>
              <p className="mt-1 text-xs text-slate2">
                SIF is a brand-new SEBI category. AMCs are still filing their schemes.
                Check back soon — or{" "}
                <Link href="/#contact" className="text-crayola underline">
                  talk to us
                </Link>{" "}
                to be notified when they launch.
              </p>
            </div>
          ) : (
            <div className="mt-6 overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-soft">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/[0.06] bg-cloud/50">
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate2">
                      AMC
                    </th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate2">
                      Scheme Name
                    </th>
                    <th className="hidden px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate2 sm:table-cell">
                      Category
                    </th>
                    <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate2">
                      &nbsp;
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.04]">
                  {schemes.map((s, i) => (
                    <tr
                      key={`${s.scheme_amfi}-${i}`}
                      className="transition-colors hover:bg-cloud/40"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <CompanyLogo company={s.scheme_company} size={32} />
                          <span className="hidden text-xs font-medium text-graphite sm:block">
                            {s.scheme_company || "—"}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-ink leading-snug">{s.scheme_amfi}</p>
                        <p className="mt-0.5 text-xs text-slate2 sm:hidden">
                          {s.scheme_company}
                        </p>
                      </td>
                      <td className="hidden px-5 py-4 text-xs text-slate1 sm:table-cell">
                        {s.scheme_category}
                      </td>
                      <td className="px-5 py-4 text-right">
                        {s.scheme_amfi_code ? (
                          <Link
                            href={`/funds/${encodeURIComponent(s.scheme_amfi)}`}
                            className="text-xs font-semibold text-crayola hover:underline"
                          >
                            Details →
                          </Link>
                        ) : (
                          <span className="text-xs text-slate2">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* CTA strip */}
        <div className="mt-14 rounded-2xl bg-gradient-to-br from-crayola/10 to-electric/10 border border-crayola/20 p-8 text-center">
          <h3 className="font-display text-title-m font-bold text-ink">
            Not sure if SIF is right for you?
          </h3>
          <p className="mt-2 text-sm text-slate1 max-w-md mx-auto">
            SIFs are designed for investors with a longer horizon and higher risk appetite.
            Our advisors can help you evaluate whether they fit your portfolio.
          </p>
          <Link
            href="/#contact"
            className="mt-6 inline-flex rounded-full bg-crayola px-7 py-3 text-sm font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
          >
            Book a free consultation
          </Link>
        </div>
      </Container>
    </div>
  );
}
