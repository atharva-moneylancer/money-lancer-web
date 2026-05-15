import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionEyebrow } from "@/components/home/Services";
import { Button } from "@/components/ui/Button";
import { getSchemeInfo, getCategoryTopPerformers } from "@/lib/advisorkhoj";
import { formatNumberIN } from "@/lib/format";
import { regularOnly } from "@/lib/funds";

export const revalidate = 3600;
export const metadata = { title: "Compare funds" };

type SP = { searchParams: { a?: string; b?: string; c?: string; d?: string } };

export default async function ComparePage({ searchParams }: SP) {
  const codes = [searchParams.a, searchParams.b, searchParams.c, searchParams.d].filter(Boolean) as string[];

  // Fetch info for each code in parallel
  const infos = await Promise.all(
    codes.map((c) =>
      getSchemeInfo(decodeURIComponent(c)).catch(() => null)
    )
  );
  const valid = infos.filter((i): i is any => Boolean(i?.scheme_name));

  // Suggest a few funds if we have <2 selected
  let suggestions: any[] = [];
  if (valid.length < 2) {
    try {
      const cat = valid[0]?.scheme_category || "Equity: Large Cap";
      const r = await getCategoryTopPerformers(cat, "1y");
      suggestions = regularOnly(r.list).slice(0, 6);
    } catch {}
  }

  return (
    <div className="bg-cloud pt-28">
      <Container className="pb-24">
        <Link href="/funds" className="text-sm font-semibold text-crayola hover:underline">← All funds</Link>
        <div className="mt-4">
          <SectionEyebrow label="Fund comparison" />
          <h1 className="mt-4 max-w-3xl font-display text-headline font-bold tracking-tight text-ink">
            See which fund actually fits you.
          </h1>
          <p className="mt-4 max-w-2xl text-body-l text-slate1">
            Compare returns, expense ratios, AUM and risk side-by-side. Add up to four funds.
          </p>
        </div>

        {valid.length === 0 ? (
          <SelectorEmpty suggestions={suggestions} />
        ) : (
          <ComparisonGrid funds={valid} suggestions={suggestions} />
        )}

        <div className="mt-16 rounded-3xl bg-navy p-10 text-white md:p-14">
          <h3 className="font-display text-title-l font-bold">Need help picking?</h3>
          <p className="mt-3 max-w-xl text-white/75">
            Our team can shortlist 3–5 funds for your specific goal, risk profile and tax situation in 30 minutes.
          </p>
          <div className="mt-6"><Button variant="light" href="/#contact">Talk to us</Button></div>
        </div>
      </Container>
    </div>
  );
}

function SelectorEmpty({ suggestions }: { suggestions: any[] }) {
  return (
    <div className="mt-12 rounded-2xl border border-black/[0.06] bg-white p-10 shadow-soft">
      <h3 className="text-title-s font-semibold text-ink">Pick funds to compare</h3>
      <p className="mt-2 text-sm text-slate1">Start with one of these top large-cap funds, then add more from the fund pages.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {suggestions.map((s: any) => (
          <Link
            key={s.scheme_amfi}
            href={`/funds/compare?a=${encodeURIComponent(s.scheme_amfi)}`}
            className="group rounded-xl border border-black/[0.06] bg-cloud p-4 hover:border-crayola/30 hover:bg-white transition-all"
          >
            <div className="text-sm font-semibold text-ink">{s.scheme_amfi_short_name || s.scheme_amfi}</div>
            <div className="mt-1 text-xs text-slate2">{s.scheme_company_short_name || s.scheme_company}</div>
            <div className="mt-3 text-sm font-semibold text-crayola">Add to compare →</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ComparisonGrid({ funds, suggestions }: { funds: any[]; suggestions: any[] }) {
  // 1st col is the row label, then one col per fund
  const cols = funds.length;
  return (
    <div className="mt-10 overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-soft">
      {/* header row */}
      <div className="grid border-b border-black/5 bg-cloud" style={{ gridTemplateColumns: `220px repeat(${cols}, minmax(0,1fr))` }}>
        <div className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate2">Fund</div>
        {funds.map((f) => (
          <div key={f.scheme_name} className="border-l border-black/5 px-5 py-4">
            <div className="text-xs text-slate2">{f.scheme_company}</div>
            <div className="mt-0.5 text-sm font-semibold text-ink">{f.scheme_name}</div>
            <div className="mt-1 text-[11px] text-slate2">{f.scheme_category}</div>
          </div>
        ))}
      </div>

      {[
        { k: "NAV", v: (f: any) => `₹${formatNumberIN(f.nav, 2)}` },
        { k: "1-day change", v: (f: any) => fmtRet(f.nav_change_percentage) },
        { k: "Inception return", v: (f: any) => fmtRet(f.scheme_inception_return), acc: "success" as const },
        { k: "Benchmark (inception)", v: (f: any) => fmtRet(f.benchmark_inception_return) },
        { k: "Expense ratio", v: (f: any) => `${Number(f.expense_ratio_percentage ?? 0).toFixed(2)}%` },
        { k: "Riskometer", v: (f: any) => f.riskometer_value || "—" },
        { k: "Benchmark", v: (f: any) => f.scheme_benchmark || "—" },
        { k: "Fund manager", v: (f: any) => f.scheme_manager || "—" },
        { k: "Inception date", v: (f: any) => f.scheme_inception_date },
        { k: "Asset class", v: (f: any) => f.asset_class },
      ].map((row, i) => (
        <div key={row.k} className={`grid items-stretch ${i % 2 === 1 ? "bg-cloud/40" : ""}`} style={{ gridTemplateColumns: `220px repeat(${cols}, minmax(0,1fr))` }}>
          <div className="border-t border-black/5 px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate2">{row.k}</div>
          {funds.map((f) => (
            <div key={f.scheme_name} className="border-l border-t border-black/5 px-5 py-4 text-sm font-semibold text-graphite tabular">
              {row.v(f)}
            </div>
          ))}
        </div>
      ))}

      <div className="grid items-center gap-3 border-t border-black/5 bg-cloud px-5 py-4" style={{ gridTemplateColumns: `220px repeat(${cols}, minmax(0,1fr))` }}>
        <div className="text-xs text-slate2">Open fund page</div>
        {funds.map((f) => (
          <div key={f.scheme_name} className="border-l border-black/5 px-5">
            <Link href={`/funds/${encodeURIComponent(f.scheme_name)}`} className="text-sm font-semibold text-crayola hover:underline">
              View detail →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

function fmtRet(v?: number) {
  if (v == null || !Number.isFinite(v)) return "—";
  const ok = v >= 0;
  return `${ok ? "+" : ""}${Number(v).toFixed(2)}%`;
}
