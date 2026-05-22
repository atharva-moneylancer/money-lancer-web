import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionEyebrow } from "@/components/home/Services";
import { Button } from "@/components/ui/Button";
import {
  BUCKET_GROUPS,
  getBucketsByGroup,
  hydrateAllBuckets,
  HydratedBucket,
  type BucketConfig,
} from "@/lib/buckets";

export const metadata = {
  title: "Fund Buckets — Curated Portfolios | Money Lancer",
  description:
    "16 curated mutual fund portfolios for every goal — from aggressive growth to retirement income. Dynamic fund selection, portfolio analytics, and recommended SIP amounts.",
};

export const revalidate = 21600; // 6 hours

export default async function BucketsPage() {
  let buckets: HydratedBucket[] = [];
  try {
    buckets = await hydrateAllBuckets();
  } catch {
    // If hydration fails, show static configs without analytics
  }

  // Group buckets — fall back to static configs if hydration failed
  const grouped = BUCKET_GROUPS.map((group) => ({
    group,
    buckets: buckets.length > 0
      ? buckets.filter((b) => b.group === group)
      : getBucketsByGroup(group),
  }));

  return (
    <div className="bg-mesh-soft pt-28 pb-24">
      <Container>
        {/* Header */}
        <SectionEyebrow label="Fund Buckets" />
        <h1 className="mt-4 max-w-3xl font-display text-headline font-bold tracking-tight text-ink">
          Curated portfolios for every goal.
        </h1>
        <p className="mt-4 max-w-2xl text-body-l text-slate1">
          16 ready-made fund portfolios — dynamically assembled from top-performing
          Regular-plan funds. Pick a bucket, start a SIP.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/risk-profiler" variant="primary" size="md">
            Find your risk profile →
          </Button>
          <Button href="/funds" variant="secondary" size="md">
            Browse all funds
          </Button>
        </div>

        {/* Bucket groups */}
        <div className="mt-16 space-y-16">
          {grouped.map(({ group, buckets: groupBuckets }) => (
            <section key={group}>
              <div className="flex items-center gap-3 mb-8">
                <h2 className="text-title-l font-bold text-yale">{group}</h2>
                <div className="h-px flex-1 bg-mist" />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {groupBuckets.map((bucket) => (
                  <BucketCard
                    key={bucket.slug}
                    bucket={bucket}
                    analytics={"analytics" in bucket ? (bucket as HydratedBucket).analytics : undefined}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-16 rounded-xl border border-black/[0.06] bg-cloud p-6 text-xs text-slate2 leading-relaxed">
          <strong className="text-graphite">Important:</strong> Fund buckets are
          curated model portfolios for educational purposes. They are not personalised
          investment advice. Past performance does not guarantee future results.
          All funds shown are Regular Plans only. Mutual fund investments are subject
          to market risks — read all scheme-related documents carefully.
          ARN-175445 | AMFI-registered Mutual Fund Distributor.
        </div>
      </Container>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────

function BucketCard({
  bucket,
  analytics,
}: {
  bucket: BucketConfig | HydratedBucket;
  analytics?: HydratedBucket["analytics"];
}) {
  const riskColor: Record<string, string> = {
    Low: "bg-spring/20 text-success",
    "Low to Moderate": "bg-spring/15 text-success",
    Moderate: "bg-gold/15 text-warning",
    "Moderately High": "bg-gold/20 text-warning",
    High: "bg-critical/15 text-critical",
    "Very High": "bg-critical/20 text-critical",
  };

  return (
    <Link
      href={`/funds/buckets/${bucket.slug}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-crayola/30 hover:shadow-lift"
    >
      {/* Hover gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${bucket.accent}`}
      />

      <div className="relative">
        {/* Icon + Risk badge */}
        <div className="flex items-center justify-between">
          <span className="text-2xl">{bucket.icon}</span>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wider ${riskColor[bucket.riskLevel] ?? "bg-mist text-slate2"}`}
          >
            {bucket.riskLevel}
          </span>
        </div>

        {/* Name + tagline */}
        <h3 className="mt-4 text-title-s font-semibold text-ink">{bucket.name}</h3>
        <p className="mt-1 text-sm text-slate1 line-clamp-2">{bucket.tagline}</p>

        {/* Key metrics */}
        <div className="mt-4 grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
          <div>
            <div className="text-slate2">Holding period</div>
            <div className="font-semibold text-graphite">{bucket.holdingPeriod}</div>
          </div>
          <div>
            <div className="text-slate2">Funds</div>
            <div className="font-semibold text-graphite">
              {analytics?.fundCount ?? bucket.slots.reduce((s, sl) => s + sl.pick, 0)}
            </div>
          </div>
          {analytics?.blend3y != null && (
            <div>
              <div className="text-slate2">Blended 3Y CAGR</div>
              <div className={`font-semibold ${analytics.blend3y >= 0 ? "text-success" : "text-critical"}`}>
                {analytics.blend3y >= 0 ? "+" : ""}{analytics.blend3y}%
              </div>
            </div>
          )}
          {analytics?.weightedTer != null && (
            <div>
              <div className="text-slate2">Avg TER</div>
              <div className="font-semibold text-graphite">{analytics.weightedTer}%</div>
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="relative mt-5 inline-flex items-center text-sm font-semibold text-crayola">
        View bucket
        <svg
          className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M5 12h14M13 5l7 7-7 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </Link>
  );
}
