import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionEyebrow } from "@/components/home/Services";
import { getCategoryTopPerformers } from "@/lib/advisorkhoj";
import { formatNumberIN } from "@/lib/format";
import { CompanyLogo } from "@/components/fund/CompanyLogo";
import { regularOnly } from "@/lib/funds";

// Server component — fetches at build / ISR time
export default async function LiveFunds() {
  let rows: Array<{
    code: string;
    name: string;
    company: string;
    cat: string;
    nav: number;
    r1y?: number;
    r3y?: number;
    r5y?: number;
  }> = [];

  try {
    const data = await getCategoryTopPerformers("Equity: Large Cap", "1y");
    rows = regularOnly(data.list).slice(0, 4).map((r) => ({
      code: r.scheme_amfi, // use scheme NAME — that's what getSchemeInfoLatest expects
      name: r.scheme_amfi_short_name || r.scheme_amfi,
      company: r.scheme_company_short_name || r.scheme_company,
      cat: r.scheme_category,
      nav: r.price,
      r1y: r.returns_abs_1year,
      r3y: r.returns_cmp_3year,
      r5y: r.returns_cmp_5year,
    }));
  } catch (e) {
    // graceful fallback if API is unavailable in dev
    rows = SAMPLE_FUNDS;
  }

  return (
    <section className="py-24 lg:py-32 bg-white">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <SectionEyebrow label="Live fund research" />
            <h2 className="mt-4 font-display text-headline font-bold tracking-tight text-ink">
              Top large-cap funds, refreshed daily.
            </h2>
            <p className="mt-4 text-body-l text-slate1">
              Powered by AdvisorKhoj. NAVs, returns and rankings updated as the market closes —
              not a static list.
            </p>
          </div>
          <Link href="/funds" className="inline-flex items-center text-sm font-semibold text-crayola hover:translate-x-1 transition-transform">
            Browse all funds →
          </Link>
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-soft">
          <div className="grid grid-cols-12 gap-3 border-b border-black/5 bg-cloud px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate2">
            <div className="col-span-5">Scheme</div>
            <div className="col-span-2 text-right">NAV</div>
            <div className="col-span-1 text-right">1Y</div>
            <div className="col-span-1 text-right">3Y</div>
            <div className="col-span-1 text-right">5Y</div>
            <div className="col-span-2 text-right">Action</div>
          </div>
          {rows.map((r) => (
            <Link
              key={r.code}
              href={`/funds/${encodeURIComponent(r.code)}`}
              className="grid grid-cols-12 items-center gap-3 border-b border-black/5 px-6 py-5 transition-colors last:border-0 hover:bg-cloud"
            >
              <div className="col-span-5 flex items-center gap-3">
                <CompanyLogo company={r.company} />
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-ink">{r.name}</div>
                  <div className="mt-1 inline-flex items-center gap-2 text-xs text-slate2">
                    <span className="truncate">{r.company}</span>
                    <span className="h-1 w-1 shrink-0 rounded-full bg-mist" />
                    <span className="truncate">{r.cat}</span>
                  </div>
                </div>
              </div>
              <div className="col-span-2 text-right tabular text-sm font-semibold text-graphite">
                ₹{formatNumberIN(r.nav, 2)}
              </div>
              <ReturnCell value={r.r1y} />
              <ReturnCell value={r.r3y} />
              <ReturnCell value={r.r5y} />
              <div className="col-span-2 text-right">
                <span className="inline-flex items-center rounded-lg bg-crayola/10 px-3 py-1.5 text-xs font-semibold text-crayola">
                  Start SIP →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

function ReturnCell({ value }: { value?: number }) {
  if (value === undefined || value === null) return <div className="col-span-1 text-right text-sm text-slate2">—</div>;
  const positive = value >= 0;
  return (
    <div className={`col-span-1 text-right tabular text-sm font-semibold ${positive ? "text-success" : "text-critical"}`}>
      {positive ? "+" : ""}
      {value.toFixed(1)}%
    </div>
  );
}

const SAMPLE_FUNDS = [
  { code: "HDFC Top 100 Fund - Regular Plan-Growth", name: "HDFC Top 100 Fund", company: "HDFC MF", cat: "Equity: Large Cap", nav: 1268.42, r1y: 24.3, r3y: 18.7, r5y: 17.2 },
  { code: "ICICI Prudential Bluechip Fund - Regular Plan-Growth", name: "ICICI Pru Bluechip Fund", company: "ICICI Pru MF", cat: "Equity: Large Cap", nav: 102.66, r1y: 28.5, r3y: 19.2, r5y: 18.8 },
  { code: "SBI Bluechip Fund - Regular Plan-Growth", name: "SBI Bluechip Fund", company: "SBI MF", cat: "Equity: Large Cap", nav: 92.40, r1y: 22.1, r3y: 16.4, r5y: 16.0 },
  { code: "Mirae Asset Large Cap Fund - Regular Plan-Growth", name: "Mirae Asset Large Cap Fund", company: "Mirae Asset MF", cat: "Equity: Large Cap", nav: 109.71, r1y: 26.8, r3y: 17.9, r5y: 18.5 },
];
