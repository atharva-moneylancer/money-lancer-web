import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { SectionEyebrow } from "@/components/home/Services";
import { CompanyLogo } from "@/components/fund/CompanyLogo";
import { RiskMeter } from "@/components/fund/RiskMeter";
import { formatNumberIN } from "@/lib/format";
import {
  BUCKET_CONFIGS,
  getBucketBySlug,
  hydrateBucket,
  HydratedBucket,
} from "@/lib/buckets";
import { PerformanceRow } from "@/lib/advisorkhoj";

export const revalidate = 21600;

export async function generateStaticParams() {
  return BUCKET_CONFIGS.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const config = getBucketBySlug(params.slug);
  if (!config) return { title: "Bucket not found" };
  return {
    title: `${config.name} Bucket — ${config.tagline} | Money Lancer`,
    description: config.description,
  };
}

export default async function BucketDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const config = getBucketBySlug(params.slug);
  if (!config) notFound();

  let bucket: HydratedBucket;
  try {
    bucket = await hydrateBucket(config);
  } catch {
    // Show the page with empty fund data if API fails
    bucket = {
      ...config,
      hydratedFunds: [],
      analytics: {
        blend1y: null,
        blend3y: null,
        blend5y: null,
        weightedTer: null,
        maxDrawdownProxy: null,
        fundCount: 0,
      },
    };
  }

  const { analytics } = bucket;

  return (
    <div className="bg-mesh-soft pt-28 pb-24">
      <Container>
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate2">
          <Link href="/funds" className="hover:text-crayola transition-colors">
            Fund Research
          </Link>
          <span>/</span>
          <Link href="/funds/buckets" className="hover:text-crayola transition-colors">
            Buckets
          </Link>
          <span>/</span>
          <span className="text-ink font-medium">{config.name}</span>
        </nav>

        {/* Header */}
        <div className="mt-6 flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{config.icon}</span>
              <div>
                <SectionEyebrow label={config.group} />
                <h1 className="mt-1 font-display text-headline font-bold tracking-tight text-ink">
                  {config.name}
                </h1>
              </div>
            </div>
            <p className="mt-4 text-body-l text-slate1">{config.description}</p>
          </div>

          {/* Quick stats card */}
          <div className="shrink-0 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-soft w-full sm:w-auto sm:min-w-[280px]">
            <div className="grid grid-cols-2 gap-4">
              <QuickStat label="Risk Level" value={config.riskLevel} />
              <QuickStat label="Holding Period" value={config.holdingPeriod} />
              <QuickStat
                label="SIP Range"
                value={`₹${formatNumberIN(config.sipMin)} – ₹${formatNumberIN(config.sipMax)}`}
              />
              <QuickStat label="Funds" value={String(config.funds.length)} />
            </div>
          </div>
        </div>

        {/* Portfolio analytics */}
        <div className="mt-10">
          <h2 className="text-title-m font-bold text-yale">Portfolio Analytics</h2>
          <p className="mt-1 text-sm text-slate2">
            Blended metrics based on equal-weight fund composition. Updated daily.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <MetricCard
              label="Blended 1Y"
              value={analytics.blend1y}
              suffix="%"
              colored
            />
            <MetricCard
              label="Blended 3Y CAGR"
              value={analytics.blend3y}
              suffix="%"
              colored
            />
            <MetricCard
              label="Blended 5Y CAGR"
              value={analytics.blend5y}
              suffix="%"
              colored
            />
            <MetricCard
              label="Avg TER"
              value={analytics.weightedTer}
              suffix="%"
            />
            <MetricCard
              label="Max Drawdown"
              value={analytics.maxDrawdownProxy}
              suffix="%"
              colored
              info="Worst 1Y return among constituent funds"
            />
          </div>
        </div>

        {/* Risk meter */}
        <div className="mt-10 max-w-sm">
          <RiskMeter value={config.riskLevel} />
        </div>

        {/* Fund composition */}
        <div className="mt-12">
          <h2 className="text-title-m font-bold text-yale">Fund Composition</h2>
          <p className="mt-1 text-sm text-slate2">
            {config.funds.length} funds, equally weighted ({(100 / config.funds.length).toFixed(1)}% each).
          </p>

          {bucket.hydratedFunds.length === 0 ? (
            <div className="mt-5 rounded-xl border border-black/[0.06] bg-white p-6">
              <p className="text-sm text-slate2">
                Fund data temporarily unavailable. Please check back later.
              </p>
            </div>
          ) : (
            <div className="mt-5 overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-soft">
              {/* Table header */}
              <div className="grid grid-cols-12 gap-3 border-b border-black/5 px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate2">
                <div className="col-span-5">Scheme</div>
                <div className="col-span-2 text-right">NAV</div>
                <div className="col-span-1 text-right">1Y</div>
                <div className="col-span-1 text-right">3Y</div>
                <div className="col-span-1 text-right">5Y</div>
                <div className="col-span-2 text-right">TER</div>
              </div>

              {/* Fund rows */}
              {bucket.hydratedFunds.map((f) => (
                <FundRow key={f.scheme_amfi} fund={f} />
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-2xl border border-crayola/20 bg-crayola/5 p-8 text-center">
          <h3 className="text-title-m font-bold text-ink">
            Ready to start investing in this bucket?
          </h3>
          <p className="mt-2 text-sm text-slate1 max-w-xl mx-auto">
            Speak with a Money Lancer advisor to set up SIPs for this bucket
            portfolio — or customise it to your exact needs.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/#contact"
              className="inline-flex items-center rounded-lg bg-crayola px-6 py-3 text-sm font-semibold text-white shadow-glow transition-all hover:bg-yale"
            >
              Book a call →
            </Link>
            <Link
              href="/funds/buckets"
              className="inline-flex items-center rounded-lg border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-graphite transition-all hover:border-crayola/30"
            >
              View all buckets
            </Link>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 rounded-xl border border-black/[0.06] bg-cloud p-6 text-xs text-slate2 leading-relaxed">
          <strong className="text-graphite">Important:</strong> This is a model portfolio for educational
          purposes — not personalised investment advice. Blended returns are equal-weight averages
          computed from constituent fund data and are approximations.
          Past performance does not guarantee future results. All funds
          shown are Regular Plans. Mutual fund investments are subject to market risks — read all
          scheme-related documents carefully. ARN-175445.
        </div>
      </Container>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Sub-components
// ────────────────────────────────────────────────────────────────────────────

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate2">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-ink">{value}</div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  suffix = "",
  colored = false,
  info,
}: {
  label: string;
  value: number | null;
  suffix?: string;
  colored?: boolean;
  info?: string;
}) {
  const display = value != null ? `${value >= 0 && colored ? "+" : ""}${value}${suffix}` : "—";
  const color =
    colored && value != null
      ? value >= 0
        ? "text-success"
        : "text-critical"
      : "text-ink";

  return (
    <div className="rounded-xl border border-black/[0.06] bg-white p-4 shadow-soft">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate2">
        {label}
      </div>
      <div className={`mt-2 text-xl font-bold tabular ${color}`}>{display}</div>
      {info && <div className="mt-1 text-[10px] text-slate2 leading-tight">{info}</div>}
    </div>
  );
}

function FundRow({ fund: f }: { fund: PerformanceRow }) {
  return (
    <Link
      href={`/funds/${encodeURIComponent(f.scheme_amfi)}`}
      className="grid grid-cols-12 items-center gap-3 border-b border-black/5 px-6 py-5 transition-colors last:border-0 hover:bg-cloud"
    >
      <div className="col-span-5 flex items-center gap-3">
        <CompanyLogo company={f.scheme_company_short_name || f.scheme_company} />
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-ink">
            {f.scheme_amfi_short_name || f.scheme_amfi}
          </div>
          <div className="mt-1 inline-flex items-center gap-2 text-xs text-slate2">
            <span className="truncate">{f.scheme_company_short_name || f.scheme_company}</span>
            <span className="h-1 w-1 shrink-0 rounded-full bg-mist" />
            <span className="truncate">{f.scheme_category}</span>
          </div>
        </div>
      </div>

      <div className="col-span-2 text-right tabular text-sm font-semibold text-graphite">
        ₹{formatNumberIN(f.price, 2)}
      </div>

      <ReturnCell value={f.returns_abs_1year} />
      <ReturnCell value={f.returns_cmp_3year} />
      <ReturnCell value={f.returns_cmp_5year} />

      <div className="col-span-2 text-right tabular text-sm text-slate1">
        {f.ter != null && f.ter > 0 ? `${f.ter.toFixed(2)}%` : "—"}
      </div>
    </Link>
  );
}

function ReturnCell({ value }: { value?: number }) {
  if (value === undefined || value === null)
    return (
      <div className="col-span-1 text-right text-sm text-slate2">—</div>
    );
  const positive = value >= 0;
  return (
    <div
      className={`col-span-1 text-right tabular text-sm font-semibold ${
        positive ? "text-success" : "text-critical"
      }`}
    >
      {positive ? "+" : ""}
      {value.toFixed(1)}%
    </div>
  );
}
