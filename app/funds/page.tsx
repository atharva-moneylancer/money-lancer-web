import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionEyebrow } from "@/components/home/Services";
import { Button } from "@/components/ui/Button";
import { getCategoryTopPerformers, getCategoryPerformance } from "@/lib/advisorkhoj";
import { AmcSlideshow } from "@/components/fund/AmcSlideshow";
import { CategoryFilter } from "@/components/fund/CategoryFilter";
import { FundsListClient } from "@/components/fund/FundsListClient";
import { regularOnly } from "@/lib/funds";

export const metadata = { title: "Fund Research" };
export const revalidate = 21600;

// Fallback groups if the API is unavailable
const FALLBACK_GROUPS: { group: string; cats: string[] }[] = [
  {
    group: "Equity",
    cats: [
      "Equity: Large Cap", "Equity: Mid Cap", "Equity: Small Cap",
      "Equity: Flexi Cap", "Equity: ELSS", "Index Fund",
    ],
  },
  { group: "Hybrid", cats: ["Hybrid: Aggressive"] },
  { group: "Debt", cats: ["Debt: Short Duration", "Debt: Liquid"] },
];

/** Order broad categories consistently in the UI */
const BROAD_ORDER = ["Equity", "Hybrid", "Debt", "Solution Oriented", "Other"];

/**
 * Collapse "Thematic-*" and "Sectoral-*" API sub-categories into single
 * representative pills so the page doesn't show 20+ Thematic variants.
 * Returns the first value seen for each collapsed group (used as the URL param).
 */
/**
 * Collapse noisy sub-category variants into single representative pills.
 * Thematic-*, Sectoral-*, and Fund of Funds-* each collapse to one entry.
 */
function collapseCats(cats: string[]): { value: string; label: string }[] {
  const out: { value: string; label: string }[] = [];
  let thematicValue = "";
  let sectoralValue = "";
  let fofValue = "";

  for (const cat of cats) {
    const lower = cat.toLowerCase();
    if (/^thematic/i.test(cat) && cat.includes("-")) {
      if (!thematicValue) thematicValue = cat;
    } else if (/^sectoral/i.test(cat) && cat.includes("-")) {
      if (!sectoralValue) sectoralValue = cat;
    } else if (/^fund of funds/i.test(cat)) {
      if (!fofValue) fofValue = cat;
    } else {
      const label = cat.replace(/^[^:]+:\s*/, "");
      out.push({ value: cat, label });
    }
  }

  if (thematicValue) out.push({ value: thematicValue, label: "Thematic" });
  if (sectoralValue) out.push({ value: sectoralValue, label: "Sectoral" });
  if (fofValue) out.push({ value: fofValue, label: "Fund of Funds" });

  return out;
}

function buildCatGroups(
  catPerf: { sector: string; scheme_broad_category: string }[]
): { group: string; items: { value: string; label: string }[] }[] {
  if (!catPerf.length)
    return FALLBACK_GROUPS.map((g) => ({
      group: g.group,
      items: g.cats.map((c) => ({ value: c, label: c.replace(/^[^:]+:\s*/, "") })),
    }));

  const map = new Map<string, string[]>();
  for (const { sector, scheme_broad_category } of catPerf) {
    if (!sector) continue;
    // Clean group name: strip trailing " Schemes" / " Scheme"
    const g = (scheme_broad_category || "Other")
      .replace(/\s+schemes?$/i, "")
      .trim();
    if (!map.has(g)) map.set(g, []);
    map.get(g)!.push(sector);
  }

  const sorted = [...map.keys()].sort((a, b) => {
    const ai = BROAD_ORDER.indexOf(a);
    const bi = BROAD_ORDER.indexOf(b);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return a.localeCompare(b);
  });

  return sorted.map((g) => ({ group: g, items: collapseCats(map.get(g)!) }));
}

export default async function FundsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  let catPerf: { sector: string; scheme_broad_category: string }[] = [];
  try {
    const c = await getCategoryPerformance();
    catPerf = (c.list || []) as typeof catPerf;
  } catch {}

  const catGroups = buildCatGroups(catPerf);
  // "all" is the default — shows the full fund universe so the search bar is useful immediately
  const cat = searchParams.category ?? "all";

  let funds: any[] = [];
  try {
    if (cat === "all") {
      // Fetch top performers from popular categories in parallel instead of
      // requesting "All" which returns a 2.5 MB payload that times out on
      // Vercel's serverless functions.
      const popularCats = [
        "Equity: Large Cap",
        "Equity: Mid Cap",
        "Equity: Small Cap",
        "Equity: Flexi Cap",
        "Equity: ELSS",
        "Hybrid: Aggressive",
        "Debt: Short Duration",
        "Debt: Liquid",
      ];
      const results = await Promise.all(
        popularCats.map((c) =>
          getCategoryTopPerformers(c, "1y").catch(() => ({ list: [] as any[] }))
        )
      );
      funds = regularOnly(results.flatMap((r) => r.list || []))
        .sort((a: any, b: any) => (b.returns_abs_1year ?? 0) - (a.returns_abs_1year ?? 0))
        .slice(0, 100);
    } else {
      const d = await getCategoryTopPerformers(cat, "1y");
      funds = regularOnly(d.list || []);
    }
  } catch {}

  return (
    <div className="bg-mesh-soft pt-28">
      <Container className="pb-12">
        <SectionEyebrow label="Fund Research" />
        <h1 className="mt-4 max-w-3xl font-display text-headline font-bold tracking-tight text-ink">
          Research every fund. Pick the right ones.
        </h1>
        <p className="mt-4 max-w-2xl text-body-l text-slate1">
          Live data from AdvisorKhoj. Compare returns, expense ratios and
          rankings across categories and AMCs.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/funds/buckets" variant="primary" size="md">
            View curated buckets →
          </Button>
          <Button href="/funds/compare" variant="secondary" size="md">
            Compare funds
          </Button>
          <Button href="/risk-profiler" variant="secondary" size="md">
            Take risk profiler
          </Button>
        </div>

        {/* Category filter — two-tier tab + pill */}
        <CategoryFilter groups={catGroups} selected={cat} />
      </Container>

      {/* Searchable, sortable fund list (client component) */}
      <Container className="pb-12">
        {funds.length === 0 ? (
          <div className="rounded-2xl border border-black/[0.06] bg-white px-6 py-12 text-center text-sm text-slate2 shadow-soft">
            Couldn&apos;t load funds for <span className="font-semibold text-graphite">{cat}</span>. Please try again in a moment.
          </div>
        ) : (
          <FundsListClient funds={funds} category={cat} />
        )}
      </Container>

      {/* Category snapshot */}
      <Container className="pb-16">
        <h3 className="text-title-m font-bold text-yale">Category snapshot</h3>
        <p className="mt-1 text-sm text-slate1">
          Median category returns across major fund categories.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {catPerf.slice(0, 8).map((c: any) => (
            <Link
              key={c.sector}
              href={`/funds/category/${encodeURIComponent(c.sector)}`}
              className="rounded-xl border border-black/[0.06] bg-white p-5 transition-all hover:border-crayola/30 hover:shadow-lift"
            >
              <div className="text-xs uppercase tracking-wider text-slate2">
                {c.scheme_broad_category}
              </div>
              <div className="mt-1 text-sm font-semibold text-ink">
                {c.sector}
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <Mini label="1Y" v={c.returns_abs_1year} />
                <Mini label="3Y" v={c.returns_cmp_3year} />
                <Mini label="5Y" v={c.returns_cmp_5year} />
              </div>
            </Link>
          ))}
        </div>
      </Container>

      {/* AMC directory — slideshow */}
      <Container className="pb-24">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="text-title-m font-bold text-yale">By AMC</h3>
            <p className="mt-1 text-sm text-slate1">
              Explore schemes from every fund house we distribute.
            </p>
          </div>
          <Link
            href="/funds/compare"
            className="text-sm font-semibold text-crayola hover:underline"
          >
            Compare funds across AMCs →
          </Link>
        </div>
        <div className="mt-6">
          <AmcSlideshow />
        </div>
      </Container>
    </div>
  );
}

function Mini({ label, v }: { label: string; v?: number }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-slate2">
        {label}
      </div>
      <div
        className={`tabular text-sm font-semibold ${
          v != null && v >= 0 ? "text-success" : "text-critical"
        }`}
      >
        {v != null ? `${v >= 0 ? "+" : ""}${v.toFixed(1)}%` : "—"}
      </div>
    </div>
  );
}
