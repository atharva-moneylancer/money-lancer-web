import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ReturnsTable } from "@/components/fund/ReturnsTable";
import { HoldingsBlock } from "@/components/fund/HoldingsBlock";
import { RiskMeter } from "@/components/fund/RiskMeter";
import { RiskStatsBlock } from "@/components/fund/RiskStatsBlock";
import { MiniSipCalc } from "@/components/fund/MiniSipCalc";
import {
  getSchemeInfo,
  getSchemeTrailingReturns,
  getAnnualReturns,
  getPortfolioAnalysis,
  getCategoryTopPerformers,
  getVolatilityRanking,
  getMarketCaptureRatio,
} from "@/lib/advisorkhoj";
import { getLogoForName } from "@/lib/amcs";
import { CompanyLogo } from "@/components/fund/CompanyLogo";
import { formatNumberIN } from "@/lib/format";
import { regularOnly } from "@/lib/funds";

export const revalidate = 3600;

type Params = { params: { scheme: string } };

export default async function FundDetail({ params }: Params) {
  const schemeKey = decodeURIComponent(params.scheme);

  let info: any = null;
  try {
    info = await getSchemeInfo(schemeKey);
  } catch {
    notFound();
  }
  if (!info?.scheme_name) notFound();

  // We're an MFD — only Regular plans are distributed. If someone lands on
  // a Direct-plan URL, redirect them to the Regular equivalent (or, if we
  // can't find it, 404 — we don't want Direct content on our site).
  if (/\bdirect\b/i.test(info.scheme_name)) {
    const regularName = info.scheme_name.replace(/\bdirect\b/gi, "Regular");
    const { redirect } = await import("next/navigation");
    redirect(`/funds/${encodeURIComponent(regularName)}`);
  }

  // Pull richer datasets in parallel; tolerate failure
  const [trailing, annual, port, peers, volatility, capture] = await Promise.all([
    getSchemeTrailingReturns(info.scheme_name).catch(() => null),
    getAnnualReturns(info.scheme_name).catch(() => null),
    getPortfolioAnalysis(info.scheme_name).catch(() => null),
    getCategoryTopPerformers(info.scheme_category, "1y").catch(() => null),
    getVolatilityRanking(info.scheme_name).catch(() => null),
    getMarketCaptureRatio(info.scheme_name).catch(() => null),
  ]);

  const returnsRows = normalizeReturns(trailing);
  const top = normalizeHoldings(port);
  const sectors = normalizeSectors(port);
  const peerList = regularOnly(peers?.list).filter((p: any) => p.scheme_amfi !== info.scheme_name).slice(0, 5);

  return (
    <div className="bg-cloud pt-28">
      <Container className="pb-24">
        <Link href={`/funds/category/${encodeURIComponent(info.scheme_category)}`} className="text-sm font-semibold text-crayola hover:underline">
          ← {info.scheme_category}
        </Link>

        {/* Header */}
        <div className="mt-5 grid items-start gap-6 lg:grid-cols-[1fr,auto]">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              {(() => {
                const logo = getLogoForName(info.scheme_company || "");
                return logo ? (
                  <span className="inline-flex h-10 w-16 shrink-0 items-center justify-center rounded-md border border-black/[0.06] bg-white p-1">
                    <Image src={logo} alt={info.scheme_company} width={56} height={28} className="max-h-7 w-auto object-contain" />
                  </span>
                ) : null;
              })()}
              <div className="text-xs uppercase tracking-wider text-slate2">
                {info.scheme_company} · {info.scheme_category}
              </div>
            </div>
            <h1 className="mt-3 font-display text-title-l font-bold text-ink">{info.scheme_name}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate1">{info.scheme_objective}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Pill>{info.asset_class}</Pill>
              <Pill>Benchmark · {info.scheme_benchmark}</Pill>
              <Pill>TER · {Number(info.expense_ratio_percentage ?? 0).toFixed(2)}%</Pill>
              <Pill>Inception · {info.scheme_inception_date}</Pill>
            </div>
          </div>
          <div className="rounded-2xl border border-black/[0.06] bg-white px-6 py-4 shadow-soft">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate2">NAV</div>
            <div className="mt-1 tabular text-3xl font-bold text-yale">₹{formatNumberIN(info.nav, 2)}</div>
            <div className={`mt-0.5 text-sm tabular ${info.nav_change_percentage >= 0 ? "text-success" : "text-critical"}`}>
              {info.nav_change_percentage >= 0 ? "+" : ""}
              {Number(info.nav_change_percentage ?? 0).toFixed(2)}% · as of {info.nav_date}
            </div>
          </div>
        </div>

        {/* Key stats */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat title="Since inception" value={`${Number(info.scheme_inception_return ?? 0).toFixed(2)}%`} accent="success" sub="CAGR" />
          <Stat title="Benchmark (inception)" value={`${Number(info.benchmark_inception_return ?? 0).toFixed(2)}%`} sub="CAGR" />
          <Stat title="Fund size" value={info.scheme_assets ? `₹${formatNumberIN(Number(info.scheme_assets) / 100, 0)} Cr` : "—"} sub="AUM" />
          <Stat title="Expense ratio" value={`${Number(info.expense_ratio_percentage ?? 0).toFixed(2)}%`} sub={info.expense_ratio_date || ""} />
        </div>

        {/* Returns table */}
        <section className="mt-14">
          <SectionTitle eyebrow="Performance" title="Returns vs benchmark & category" />
          <div className="mt-6">
            {returnsRows.length > 0 ? (
              <ReturnsTable rows={returnsRows} />
            ) : (
              <FallbackReturns info={info} />
            )}
          </div>
        </section>

        {/* Annual returns */}
        {annual?.list && annual.list.length > 0 && (
          <section className="mt-14">
            <SectionTitle eyebrow="Calendar year returns" title="Year-by-year, scheme vs benchmark" />
            <AnnualChart rows={annual.list} />
          </section>
        )}

        {/* Holdings + Sectors + SIP calc + risk */}
        <section className="mt-14 grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div>
            <SectionTitle eyebrow="Portfolio" title="Where the money is invested" />
            <div className="mt-6">
              <HoldingsBlock top={top} sectors={sectors} />
            </div>
          </div>
          <div className="space-y-6">
            <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-soft">
              <RiskMeter value={info.riskometer_value} />
            </div>
            <MiniSipCalc inceptionReturn={info.scheme_inception_return} />
          </div>
        </section>

        {/* Risk statistics — Sharpe, Sortino, Std Dev, Beta, Alpha, etc. */}
        <section className="mt-14">
          <SectionTitle eyebrow="Risk Analysis" title="How this fund manages risk" />
          <div className="mt-6">
            <RiskStatsBlock
              volatility={volatility as Record<string, unknown> | null}
              capture={capture as Record<string, unknown> | null}
            />
            {!volatility && !capture && (
              <div className="rounded-2xl border border-black/[0.06] bg-white px-6 py-8 text-center text-sm text-slate2 shadow-soft">
                Risk statistics are not available for this fund yet.
              </div>
            )}
          </div>
        </section>

        {/* Fund manager */}
        <section className="mt-14 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-black/[0.06] bg-white p-7 shadow-soft">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate2">Fund manager</div>
            <div className="mt-3 flex items-center gap-4">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-yale text-lg font-bold text-white">
                {(info.scheme_manager || "?").charAt(0)}
              </div>
              <div>
                <div className="text-title-s font-semibold text-ink">{info.scheme_manager || "—"}</div>
                <div className="text-sm text-slate2">Manager since fund inception data not available</div>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-black/[0.06] bg-white p-7 shadow-soft">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate2">ISIN & identifiers</div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <KV k="AMFI code" v={info.scheme_amfi_code} />
              <KV k="ISIN (Growth)" v={info.isin_no} />
              <KV k="ISIN (Div Re-inv)" v={info.isin_divreinvst_no} />
              <KV k="Status" v={info.scheme_status} />
            </div>
          </div>
        </section>

        {/* Peers */}
        {peerList.length > 0 && (
          <section className="mt-14">
            <SectionTitle eyebrow="Peers" title={`Other ${info.scheme_category} funds`} />
            <div className="mt-6 overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-soft">
              {peerList.map((p: any) => (
                <Link
                  key={p.scheme_amfi}
                  href={`/funds/${encodeURIComponent(p.scheme_amfi)}`}
                  className="grid grid-cols-12 items-center gap-3 border-b border-black/5 px-6 py-4 transition-colors last:border-0 hover:bg-cloud"
                >
                  <div className="col-span-6 flex items-center gap-3">
                    <CompanyLogo company={p.scheme_company} size={32} />
                    <div className="min-w-0 truncate text-sm font-semibold text-ink">{p.scheme_amfi_short_name || p.scheme_amfi}</div>
                  </div>
                  <div className="col-span-2 text-right tabular text-sm text-graphite">₹{formatNumberIN(p.price, 2)}</div>
                  <Ret v={p.returns_abs_1year} label="1Y" />
                  <Ret v={p.returns_cmp_3year} label="3Y" />
                  <Ret v={p.returns_cmp_5year} label="5Y" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="mt-16 rounded-3xl bg-navy p-10 text-white md:p-14">
          <div className="max-w-2xl">
            <h3 className="font-display text-title-l font-bold">Want a personalised recommendation?</h3>
            <p className="mt-3 text-white/75">
              Our team will tell you whether this fund fits your goals, allocation and risk profile —
              and suggest peers if it doesn't.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="light" href="/#contact">Talk to us</Button>
              <Button variant="ghost" className="text-white border border-white/20 hover:bg-white/10" href={`/funds/compare?a=${encodeURIComponent(info.scheme_name)}`}>
                Compare with another fund
              </Button>
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}

function FallbackReturns({ info }: { info: any }) {
  // If detailed returns endpoint fails, show what we have
  return (
    <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-soft">
      <p className="text-sm text-slate1">
        Since inception: <span className="tabular font-semibold text-success">+{Number(info.scheme_inception_return ?? 0).toFixed(2)}%</span> CAGR
        vs benchmark <span className="tabular font-semibold text-graphite">+{Number(info.benchmark_inception_return ?? 0).toFixed(2)}%</span>.
      </p>
    </div>
  );
}

function AnnualChart({ rows }: { rows: any[] }) {
  // Simple bar chart per year
  const items = rows.slice(-8);
  const max = Math.max(0, ...items.flatMap((r) => [Number(r.scheme_return) || 0, Number(r.benchmark_return) || 0]));
  const min = Math.min(0, ...items.flatMap((r) => [Number(r.scheme_return) || 0, Number(r.benchmark_return) || 0]));
  const range = max - min;
  return (
    <div className="mt-6 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-soft">
      <div className="flex items-end gap-4 overflow-x-auto pb-2">
        {items.map((r, i) => {
          const sv = Number(r.scheme_return) || 0;
          const bv = Number(r.benchmark_return) || 0;
          return (
            <div key={i} className="flex min-w-[64px] flex-col items-center gap-2">
              <div className="flex h-40 items-end gap-1">
                <Bar value={sv} range={range} min={min} color="bg-crayola" label={`${sv.toFixed(1)}%`} />
                <Bar value={bv} range={range} min={min} color="bg-mist" label={`${bv.toFixed(1)}%`} />
              </div>
              <div className="text-[11px] text-slate2">{r.year}</div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex gap-4 text-xs text-slate1">
        <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-crayola" /> Scheme</span>
        <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-mist" /> Benchmark</span>
      </div>
    </div>
  );
}

function Bar({ value, range, min, color, label }: { value: number; range: number; min: number; color: string; label: string }) {
  const h = range > 0 ? (Math.abs(value) / range) * 100 : 5;
  return (
    <div className="flex flex-col items-center justify-end">
      <span className="mb-1 text-[9px] text-slate2 tabular">{label}</span>
      <div className={`w-3 ${color}`} style={{ height: `${Math.max(2, h)}%`, minHeight: 4 }} />
    </div>
  );
}

function normalizeReturns(t: any) {
  if (!t?.list) return [];
  return t.list
    .map((r: any) => ({
      label: r.period,
      scheme: Number(r.scheme_return),
      benchmark: Number(r.benchmark_return),
      category: Number(r.category_average_return),
    }))
    .filter((r: any) => r.label);
}

function normalizeHoldings(p: any): Array<{ name: string; pct: number }> {
  if (!p) return [];
  const names: string[] = p.schemePortfolioHoldingsNamesString || [];
  const vals: number[] = p.schemePortfolioHoldingsValuesString || [];
  if (names.length && vals.length) {
    return names.map((n, i) => ({ name: n, pct: Number(vals[i]) || 0 }));
  }
  const obj = p.schemePortfolioHoldings || {};
  return Object.entries(obj).map(([name, pct]) => ({ name, pct: Number(pct) || 0 }));
}

function normalizeSectors(p: any): Array<{ name: string; pct: number }> {
  if (!p) return [];
  const names: string[] = p.sectorNamesString || [];
  const vals: number[] = p.sectorValuesString || [];
  if (names.length && vals.length) return names.map((n, i) => ({ name: n, pct: Number(vals[i]) || 0 }));
  const obj = p.sectorAllocation || {};
  return Object.entries(obj).map(([name, pct]) => ({ name, pct: Number(pct) || 0 }));
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-cloud px-3 py-1 text-xs font-medium text-graphite border border-black/[0.05]">{children}</span>;
}

function Stat({ title, value, sub, accent }: { title: string; value: string; sub?: string; accent?: "success" }) {
  return (
    <div className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-soft">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate2">{title}</div>
      <div className={`mt-2 tabular text-xl font-bold ${accent === "success" ? "text-success" : "text-yale"}`}>{value}</div>
      {sub && <div className="mt-0.5 text-xs text-slate2">{sub}</div>}
    </div>
  );
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="text-[11px] text-slate2 uppercase tracking-wider">{k}</div>
      <div className="text-sm font-semibold text-graphite tabular">{v || "—"}</div>
    </div>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-crayola">
        <span className="h-px w-6 bg-crayola/40" />
        {eyebrow}
      </div>
      <h2 className="mt-3 font-display text-title-l font-bold text-ink">{title}</h2>
    </div>
  );
}

function Ret({ v, label }: { v?: number; label: string }) {
  if (v == null) return <div className="col-span-1 text-right text-xs text-slate2">{label} —</div>;
  const ok = v >= 0;
  return (
    <div className="col-span-1 text-right text-xs tabular">
      <div className="text-[10px] text-slate2">{label}</div>
      <div className={`font-semibold ${ok ? "text-success" : "text-critical"}`}>{ok ? "+" : ""}{v.toFixed(1)}%</div>
    </div>
  );
}
