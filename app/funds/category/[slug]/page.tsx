import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionEyebrow } from "@/components/home/Services";
import { Button } from "@/components/ui/Button";
import { getCategoryTopPerformers, getCategoryPerformance } from "@/lib/advisorkhoj";
import { CompanyLogo } from "@/components/fund/CompanyLogo";
import { regularOnly } from "@/lib/funds";
import { formatNumberIN } from "@/lib/format";

export const revalidate = 21600;

type Params = { params: { slug: string } };

export async function generateMetadata({ params }: Params) {
  return { title: `${decodeURIComponent(params.slug)} funds` };
}

const PERIODS = [
  { id: "1y", label: "1Y" },
  { id: "3y", label: "3Y" },
  { id: "5y", label: "5Y" },
  { id: "10y", label: "10Y" },
];

export default async function CategoryPage({ params, searchParams }: Params & { searchParams: { period?: string } }) {
  const cat = decodeURIComponent(params.slug);
  const period = searchParams.period || "1y";

  let funds: any[] = [];
  try {
    const d = await getCategoryTopPerformers(cat, period);
    funds = regularOnly(d.list);
  } catch {}

  let catRow: any = null;
  try {
    const all = await getCategoryPerformance();
    catRow = (all.list || []).find((c: any) => (c.sector || "").toLowerCase() === cat.toLowerCase());
  } catch {}

  return (
    <div className="bg-mesh-soft pt-28">
      <Container className="pb-12">
        <Link href="/funds" className="text-sm font-semibold text-crayola hover:underline">← All categories</Link>
        <SectionEyebrow label="Category research" />
        <h1 className="mt-4 max-w-3xl font-display text-headline font-bold tracking-tight text-ink">{cat}</h1>
        <p className="mt-4 max-w-2xl text-body-l text-slate1">
          Live rankings within {cat}. Click any fund for the full breakdown — returns, holdings, risk metrics.
        </p>

        {catRow && (
          <div className="mt-8 grid gap-3 sm:grid-cols-4">
            {[
              { l: "1Y", v: catRow.returns_abs_1year },
              { l: "3Y", v: catRow.returns_cmp_3year },
              { l: "5Y", v: catRow.returns_cmp_5year },
              { l: "10Y", v: catRow.returns_cmp_10year },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-soft">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate2">Category avg · {s.l}</div>
                <div className={`mt-2 tabular text-2xl font-bold ${s.v != null && s.v >= 0 ? "text-success" : "text-critical"}`}>
                  {s.v != null ? `${s.v >= 0 ? "+" : ""}${s.v.toFixed(1)}%` : "—"}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <div className="text-sm font-semibold text-graphite">Sort by:</div>
          {PERIODS.map((p) => (
            <Link
              key={p.id}
              href={`/funds/category/${encodeURIComponent(cat)}?period=${p.id}`}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                p.id === period
                  ? "border-crayola bg-crayola text-white"
                  : "border-black/10 bg-white text-graphite hover:border-crayola hover:text-crayola"
              }`}
            >
              {p.label}
            </Link>
          ))}
        </div>
      </Container>

      <Container className="pb-24">
        <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-soft">
          <div className="grid grid-cols-12 gap-3 border-b border-black/5 bg-cloud px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate2">
            <div className="col-span-5">Scheme</div>
            <div className="col-span-2 text-right">NAV</div>
            <div className="col-span-1 text-right">1Y</div>
            <div className="col-span-1 text-right">3Y</div>
            <div className="col-span-1 text-right">5Y</div>
            <div className="col-span-2 text-right">Compare</div>
          </div>
          {funds.length === 0 && (
            <div className="px-6 py-12 text-center text-sm text-slate2">No funds found in this category. Try a different period.</div>
          )}
          {funds.map((r: any) => (
            <div key={r.scheme_amfi} className="grid grid-cols-12 items-center gap-3 border-b border-black/5 px-6 py-5 transition-colors last:border-0 hover:bg-cloud">
              <Link href={`/funds/${encodeURIComponent(r.scheme_amfi)}`} className="col-span-5 flex items-center gap-3">
                <CompanyLogo company={r.scheme_company} />
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-ink hover:text-crayola">{r.scheme_amfi_short_name || r.scheme_amfi}</div>
                  <div className="mt-1 text-xs text-slate2">{r.scheme_company_short_name || r.scheme_company}</div>
                </div>
              </Link>
              <div className="col-span-2 text-right tabular text-sm font-semibold text-graphite">₹{formatNumberIN(r.price, 2)}</div>
              <Ret v={r.returns_abs_1year} />
              <Ret v={r.returns_cmp_3year} />
              <Ret v={r.returns_cmp_5year} />
              <div className="col-span-2 text-right">
                <Link href={`/funds/compare?a=${encodeURIComponent(r.scheme_amfi)}`} className="inline-flex items-center rounded-lg bg-crayola/10 px-3 py-1.5 text-xs font-semibold text-crayola hover:bg-crayola hover:text-white">
                  Compare
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button variant="secondary" href="/funds">All categories</Button>
        </div>
      </Container>
    </div>
  );
}

function Ret({ v }: { v?: number }) {
  if (v == null) return <div className="col-span-1 text-right text-sm text-slate2">—</div>;
  const ok = v >= 0;
  return <div className={`col-span-1 text-right tabular text-sm font-semibold ${ok ? "text-success" : "text-critical"}`}>{ok ? "+" : ""}{v.toFixed(1)}%</div>;
}
