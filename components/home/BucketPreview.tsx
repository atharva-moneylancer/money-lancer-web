import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionEyebrow } from "@/components/home/Services";
import { BUCKET_CONFIGS, type BucketConfig } from "@/lib/buckets";

/**
 * Homepage preview showing 4 highlighted buckets (one per group).
 * Intentionally lightweight — no API calls, just static config data.
 */
const FEATURED_SLUGS = ["high-growth", "retirement-builder", "conservative-income", "all-weather"];
const FEATURED = FEATURED_SLUGS
  .map((s) => BUCKET_CONFIGS.find((b) => b.slug === s)!)
  .filter(Boolean);

export default function BucketPreview() {
  return (
    <section className="py-24 lg:py-32 bg-mesh-soft">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <SectionEyebrow label="Fund Buckets" />
            <h2 className="mt-4 font-display text-headline font-bold tracking-tight text-ink">
              Curated portfolios, not random picks.
            </h2>
            <p className="mt-4 text-body-l text-slate1">
              16 ready-made fund buckets for every goal and risk appetite — dynamically
              assembled from top-performing Regular-plan funds.
            </p>
          </div>
          <Link
            href="/funds/buckets"
            className="inline-flex items-center text-sm font-semibold text-crayola hover:translate-x-1 transition-transform"
          >
            View all 16 buckets →
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED.map((bucket) => (
            <FeaturedCard key={bucket.slug} bucket={bucket} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function FeaturedCard({ bucket }: { bucket: BucketConfig }) {
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
      <div
        className={`absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${bucket.accent}`}
      />
      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="text-2xl">{bucket.icon}</span>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wider ${riskColor[bucket.riskLevel] ?? "bg-mist text-slate2"}`}
          >
            {bucket.riskLevel}
          </span>
        </div>
        <h3 className="mt-4 text-title-s font-semibold text-ink">{bucket.name}</h3>
        <p className="mt-1 text-sm text-slate1">{bucket.tagline}</p>
        <div className="mt-3 flex items-center gap-3 text-xs text-slate2">
          <span>{bucket.holdingPeriod}</span>
          <span className="h-1 w-1 rounded-full bg-mist" />
          <span>{bucket.funds.length} funds</span>
        </div>
      </div>
      <div className="relative mt-5 inline-flex items-center text-sm font-semibold text-crayola">
        Explore bucket
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
