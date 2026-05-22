/**
 * Fund Buckets — curated portfolios assembled from live AdvisorKhoj data.
 *
 * Each bucket defines:
 *  - allocation "slots" — a category + weight + count describing which funds
 *    the server should pull when building the bucket
 *  - metadata: risk level, recommended holding period, SIP range, description
 *
 * At build/ISR time, `hydrateBucket()` fetches the top-performing Regular
 * plans for each slot and computes portfolio-level analytics (weighted CAGR,
 * blended TER, Sharpe-like metrics derived from available returns).
 */

import {
  getCategoryTopPerformers,
  PerformanceRow,
} from "@/lib/advisorkhoj";
import { regularOnly } from "@/lib/funds";

// ────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────

export type RiskLevel =
  | "Low"
  | "Low to Moderate"
  | "Moderate"
  | "Moderately High"
  | "High"
  | "Very High";

export type BucketSlot = {
  /** AdvisorKhoj category string, e.g. "Equity: Large Cap" */
  category: string;
  /** Display label for the allocation row */
  label: string;
  /** Portfolio weight in [0,1] — all slots for a bucket should sum to 1 */
  weight: number;
  /** How many top funds to pick from this category */
  pick: number;
};

export type BucketConfig = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  group: "Wealth Creation" | "Goal-Based" | "Conservative & Income" | "Thematic & Satellite";
  riskLevel: RiskLevel;
  /** Recommended holding period in human-readable form */
  holdingPeriod: string;
  /** Min recommended monthly SIP in ₹ */
  sipMin: number;
  /** Max recommended monthly SIP in ₹ */
  sipMax: number;
  /** Allocation slots that drive dynamic fund selection */
  slots: BucketSlot[];
  /** Accent colour class for the card gradient */
  accent: string;
  /** Icon label (emoji for now, swap for SVG later) */
  icon: string;
};

/** A hydrated slot with live fund data */
export type HydratedSlot = BucketSlot & {
  funds: PerformanceRow[];
};

export type PortfolioAnalytics = {
  /** Weighted blended 1Y absolute return */
  blend1y: number | null;
  /** Weighted blended 3Y CAGR */
  blend3y: number | null;
  /** Weighted blended 5Y CAGR */
  blend5y: number | null;
  /** Weighted average TER */
  weightedTer: number | null;
  /** Simple Sharpe-like ratio: blend3y / stdev of slot 3Y returns */
  sharpeProxy: number | null;
  /** Sortino-like proxy: blend3y / downside deviation of slot 3Y returns */
  sortinoProxy: number | null;
  /** Max drawdown proxy — worst 1Y return among constituent funds */
  maxDrawdownProxy: number | null;
  /** Total number of constituent funds */
  fundCount: number;
};

export type HydratedBucket = Omit<BucketConfig, "slots"> & {
  slots: HydratedSlot[];
  analytics: PortfolioAnalytics;
};

// ────────────────────────────────────────────────────────────────────────────
// Bucket configurations — 16 buckets in 4 groups of 4
// ────────────────────────────────────────────────────────────────────────────

export const BUCKET_CONFIGS: BucketConfig[] = [
  // ── Wealth Creation ──────────────────────────────────────────────────────
  {
    slug: "high-growth",
    name: "High Growth",
    tagline: "Maximum capital appreciation",
    description:
      "An aggressive portfolio for investors with a long horizon and high risk appetite. Combines small-cap and mid-cap exposure with multi-cap diversification for maximum growth potential.",
    group: "Wealth Creation",
    riskLevel: "Very High",
    holdingPeriod: "7+ years",
    sipMin: 5000,
    sipMax: 50000,
    accent: "from-critical/15 via-transparent to-transparent",
    icon: "🚀",
    slots: [
      { category: "Equity: Small Cap", label: "Small Cap", weight: 0.35, pick: 2 },
      { category: "Equity: Mid Cap", label: "Mid Cap", weight: 0.35, pick: 2 },
      { category: "Equity: Multi Cap", label: "Multi Cap", weight: 0.15, pick: 1 },
      { category: "Equity: Flexi Cap", label: "Flexi Cap", weight: 0.15, pick: 1 },
    ],
  },
  {
    slug: "steady-compounder",
    name: "Steady Compounder",
    tagline: "Consistent wealth creation",
    description:
      "A core portfolio built around large-cap stability with flexi-cap and focused-fund upside. Designed for investors who want steady compounding without extreme volatility.",
    group: "Wealth Creation",
    riskLevel: "Moderately High",
    holdingPeriod: "5+ years",
    sipMin: 5000,
    sipMax: 100000,
    accent: "from-crayola/15 via-transparent to-transparent",
    icon: "📈",
    slots: [
      { category: "Equity: Large Cap", label: "Large Cap", weight: 0.55, pick: 2 },
      { category: "Equity: Flexi Cap", label: "Flexi Cap", weight: 0.25, pick: 1 },
      { category: "Equity: Focused Fund", label: "Focused Fund", weight: 0.20, pick: 1 },
    ],
  },
  {
    slug: "tax-saver-elss",
    name: "Tax Saver (ELSS)",
    tagline: "Save tax, grow wealth",
    description:
      "The only mutual fund category that offers Section 80C tax deductions with a 3-year lock-in. Triple benefit — tax saving, equity growth, and the shortest lock-in among 80C instruments.",
    group: "Wealth Creation",
    riskLevel: "High",
    holdingPeriod: "3+ years (lock-in)",
    sipMin: 500,
    sipMax: 12500,
    accent: "from-spring/20 via-transparent to-transparent",
    icon: "🏦",
    slots: [
      { category: "Equity: ELSS", label: "ELSS", weight: 1.0, pick: 3 },
    ],
  },
  {
    slug: "mid-cap-momentum",
    name: "Mid Cap Momentum",
    tagline: "Ride the mid-cap wave",
    description:
      "A concentrated mid-cap bet for investors who believe in the structural growth story of India's mid-sized companies. Higher volatility, higher potential.",
    group: "Wealth Creation",
    riskLevel: "Very High",
    holdingPeriod: "5+ years",
    sipMin: 3000,
    sipMax: 30000,
    accent: "from-electric/20 via-transparent to-transparent",
    icon: "⚡",
    slots: [
      { category: "Equity: Mid Cap", label: "Mid Cap", weight: 1.0, pick: 4 },
    ],
  },

  // ── Goal-Based ───────────────────────────────────────────────────────────
  {
    slug: "retirement-builder",
    name: "Retirement Builder",
    tagline: "Build your retirement corpus",
    description:
      "A diversified long-term portfolio that balances growth with gradual de-risking. Equity-heavy for accumulation years with a debt and hybrid cushion to smooth returns.",
    group: "Goal-Based",
    riskLevel: "Moderately High",
    holdingPeriod: "10+ years",
    sipMin: 5000,
    sipMax: 100000,
    accent: "from-yale/10 via-transparent to-transparent",
    icon: "🏖️",
    slots: [
      { category: "Equity: Large Cap", label: "Large Cap", weight: 0.30, pick: 1 },
      { category: "Equity: Flexi Cap", label: "Flexi Cap", weight: 0.20, pick: 1 },
      { category: "Equity: Mid Cap", label: "Mid Cap", weight: 0.15, pick: 1 },
      { category: "Hybrid: Aggressive", label: "Aggressive Hybrid", weight: 0.15, pick: 1 },
      { category: "Debt: Short Duration", label: "Short Duration Debt", weight: 0.10, pick: 1 },
      { category: "Hybrid: Multi Asset Allocation", label: "Multi Asset", weight: 0.10, pick: 1 },
    ],
  },
  {
    slug: "childs-future",
    name: "Child's Future",
    tagline: "Invest in their dreams",
    description:
      "A goal-oriented portfolio for your child's education or career — starts equity-heavy for growth and includes hybrid/debt stabilisers for the final years before the goal.",
    group: "Goal-Based",
    riskLevel: "Moderately High",
    holdingPeriod: "10+ years",
    sipMin: 2000,
    sipMax: 50000,
    accent: "from-electric/15 via-transparent to-transparent",
    icon: "👶",
    slots: [
      { category: "Equity: Multi Cap", label: "Multi Cap", weight: 0.25, pick: 1 },
      { category: "Equity: Large Cap", label: "Large Cap", weight: 0.25, pick: 1 },
      { category: "Equity: Small Cap", label: "Small Cap", weight: 0.15, pick: 1 },
      { category: "Hybrid: Aggressive", label: "Aggressive Hybrid", weight: 0.20, pick: 1 },
      { category: "Debt: Short Duration", label: "Short Duration Debt", weight: 0.15, pick: 1 },
    ],
  },
  {
    slug: "first-home-fund",
    name: "First Home Fund",
    tagline: "Save for your down payment",
    description:
      "A medium-term portfolio designed for a 3-5 year home down-payment goal. Balances equity upside through hybrid funds with debt stability for capital protection as your goal nears.",
    group: "Goal-Based",
    riskLevel: "Moderate",
    holdingPeriod: "3–5 years",
    sipMin: 5000,
    sipMax: 50000,
    accent: "from-gold/15 via-transparent to-transparent",
    icon: "🏠",
    slots: [
      { category: "Hybrid: Aggressive", label: "Aggressive Hybrid", weight: 0.30, pick: 1 },
      { category: "Hybrid: Equity Savings", label: "Equity Savings", weight: 0.25, pick: 1 },
      { category: "Debt: Short Duration", label: "Short Duration Debt", weight: 0.25, pick: 1 },
      { category: "Debt: Ultra Short Duration", label: "Ultra Short Duration", weight: 0.20, pick: 1 },
    ],
  },
  {
    slug: "dream-goal-fund",
    name: "Dream Goal Fund",
    tagline: "For goals 1–3 years away",
    description:
      "A conservative short-term portfolio for near-term goals — a vacation, wedding, or big purchase. Prioritises capital safety with modest equity exposure through hybrid funds.",
    group: "Goal-Based",
    riskLevel: "Low to Moderate",
    holdingPeriod: "1–3 years",
    sipMin: 5000,
    sipMax: 100000,
    accent: "from-spring/15 via-transparent to-transparent",
    icon: "✨",
    slots: [
      { category: "Hybrid: Equity Savings", label: "Equity Savings", weight: 0.30, pick: 1 },
      { category: "Hybrid: Conservative", label: "Conservative Hybrid", weight: 0.30, pick: 1 },
      { category: "Debt: Short Duration", label: "Short Duration Debt", weight: 0.25, pick: 1 },
      { category: "Debt: Ultra Short Duration", label: "Ultra Short Duration", weight: 0.15, pick: 1 },
    ],
  },

  // ── Conservative & Income ────────────────────────────────────────────────
  {
    slug: "conservative-income",
    name: "Conservative Income",
    tagline: "Stability with modest income",
    description:
      "A low-risk portfolio for capital preservation with incremental income. Ideal for investors who want better-than-FD returns without meaningful equity risk.",
    group: "Conservative & Income",
    riskLevel: "Low to Moderate",
    holdingPeriod: "1–3 years",
    sipMin: 10000,
    sipMax: 500000,
    accent: "from-spring/15 via-transparent to-transparent",
    icon: "🛡️",
    slots: [
      { category: "Hybrid: Conservative", label: "Conservative Hybrid", weight: 0.35, pick: 1 },
      { category: "Debt: Corporate Bond", label: "Corporate Bond", weight: 0.35, pick: 2 },
      { category: "Hybrid: Arbitrage", label: "Arbitrage", weight: 0.30, pick: 1 },
    ],
  },
  {
    slug: "monthly-income-swp",
    name: "Monthly Income (SWP)",
    tagline: "Regular cash flow via SWP",
    description:
      "Designed for systematic withdrawal — invest a lump sum and withdraw monthly via SWP. The portfolio grows in the background while you draw a regular income.",
    group: "Conservative & Income",
    riskLevel: "Moderate",
    holdingPeriod: "3+ years",
    sipMin: 10000,
    sipMax: 500000,
    accent: "from-gold/15 via-transparent to-transparent",
    icon: "💰",
    slots: [
      { category: "Hybrid: Aggressive", label: "Aggressive Hybrid", weight: 0.30, pick: 1 },
      { category: "Hybrid: Conservative", label: "Conservative Hybrid", weight: 0.25, pick: 1 },
      { category: "Debt: Corporate Bond", label: "Corporate Bond", weight: 0.25, pick: 1 },
      { category: "Hybrid: Arbitrage", label: "Arbitrage", weight: 0.20, pick: 1 },
    ],
  },
  {
    slug: "liquid-parking",
    name: "Liquid Parking",
    tagline: "Park idle cash smartly",
    description:
      "For surplus cash that needs to be deployed within days to weeks. Near-zero volatility with overnight-to-ultra-short debt funds — better than a savings account.",
    group: "Conservative & Income",
    riskLevel: "Low",
    holdingPeriod: "1 day – 3 months",
    sipMin: 10000,
    sipMax: 1000000,
    accent: "from-crayola/10 via-transparent to-transparent",
    icon: "🏧",
    slots: [
      { category: "Debt: Liquid", label: "Liquid", weight: 0.60, pick: 2 },
      { category: "Debt: Ultra Short Duration", label: "Ultra Short Duration", weight: 0.40, pick: 1 },
    ],
  },
  {
    slug: "senior-citizen-stable",
    name: "Senior Citizen Stable",
    tagline: "Safety-first for retirees",
    description:
      "A defensive portfolio for retirees prioritising capital safety and predictable income. Minimal equity exposure, high-quality debt, and arbitrage for tax efficiency.",
    group: "Conservative & Income",
    riskLevel: "Low to Moderate",
    holdingPeriod: "1–3 years",
    sipMin: 10000,
    sipMax: 200000,
    accent: "from-yale/10 via-transparent to-transparent",
    icon: "🧓",
    slots: [
      { category: "Debt: Short Duration", label: "Short Duration Debt", weight: 0.35, pick: 2 },
      { category: "Hybrid: Conservative", label: "Conservative Hybrid", weight: 0.35, pick: 1 },
      { category: "Hybrid: Arbitrage", label: "Arbitrage", weight: 0.30, pick: 1 },
    ],
  },

  // ── Thematic & Satellite ─────────────────────────────────────────────────
  {
    slug: "global-diversifier",
    name: "Global Diversifier",
    tagline: "Go beyond India",
    description:
      "Diversify outside the Indian market with international fund-of-funds. Access US, global, and emerging market equities through rupee-denominated vehicles.",
    group: "Thematic & Satellite",
    riskLevel: "High",
    holdingPeriod: "5+ years",
    sipMin: 3000,
    sipMax: 25000,
    accent: "from-electric/20 via-transparent to-transparent",
    icon: "🌍",
    slots: [
      { category: "Fund of Funds-Overseas", label: "International FoF", weight: 1.0, pick: 4 },
    ],
  },
  {
    slug: "top-3-themes",
    name: "Top 3 Themes",
    tagline: "Ride the hottest sectors",
    description:
      "A tactical satellite allocation picking the top-performing thematic, sectoral, and value funds. Rotates quarterly based on momentum — not a buy-and-forget bucket.",
    group: "Thematic & Satellite",
    riskLevel: "Very High",
    holdingPeriod: "3+ years",
    sipMin: 3000,
    sipMax: 30000,
    accent: "from-critical/15 via-transparent to-transparent",
    icon: "🎯",
    slots: [
      { category: "Equity: Value Fund", label: "Value / Contra", weight: 0.34, pick: 1 },
      { category: "Equity: Dividend Yield", label: "Dividend Yield", weight: 0.33, pick: 1 },
      { category: "Equity: Focused Fund", label: "Focused Fund", weight: 0.33, pick: 1 },
    ],
  },
  {
    slug: "all-weather",
    name: "All-Weather Portfolio",
    tagline: "Built for any market cycle",
    description:
      "A diversified multi-asset portfolio that aims to deliver in bull markets, bear markets, and everything in between. Spreads risk across equity, debt, gold, and hybrid strategies.",
    group: "Thematic & Satellite",
    riskLevel: "Moderate",
    holdingPeriod: "5+ years",
    sipMin: 5000,
    sipMax: 50000,
    accent: "from-gold/15 via-transparent to-transparent",
    icon: "🌦️",
    slots: [
      { category: "Hybrid: Multi Asset Allocation", label: "Multi Asset", weight: 0.25, pick: 1 },
      { category: "Equity: Large Cap", label: "Large Cap", weight: 0.20, pick: 1 },
      { category: "Hybrid: Aggressive", label: "Aggressive Hybrid", weight: 0.20, pick: 1 },
      { category: "Debt: Short Duration", label: "Short Duration Debt", weight: 0.15, pick: 1 },
      { category: "Hybrid: Arbitrage", label: "Arbitrage", weight: 0.20, pick: 1 },
    ],
  },
  {
    slug: "gold-commodities-hedge",
    name: "Gold & Commodities Hedge",
    tagline: "Hedge against inflation",
    description:
      "An inflation hedge through gold and multi-asset funds with commodity exposure. Acts as portfolio insurance — tends to rise when equities and bonds fall.",
    group: "Thematic & Satellite",
    riskLevel: "Moderately High",
    holdingPeriod: "3+ years",
    sipMin: 2000,
    sipMax: 20000,
    accent: "from-gold/20 via-transparent to-transparent",
    icon: "🥇",
    slots: [
      { category: "Fund of Funds-Gold", label: "Gold FoF", weight: 0.50, pick: 2 },
      { category: "Hybrid: Multi Asset Allocation", label: "Multi Asset", weight: 0.50, pick: 1 },
    ],
  },
];

// ────────────────────────────────────────────────────────────────────────────
// Group helpers
// ────────────────────────────────────────────────────────────────────────────

export const BUCKET_GROUPS = [
  "Wealth Creation",
  "Goal-Based",
  "Conservative & Income",
  "Thematic & Satellite",
] as const;

export function getBucketsByGroup(group: string): BucketConfig[] {
  return BUCKET_CONFIGS.filter((b) => b.group === group);
}

export function getBucketBySlug(slug: string): BucketConfig | undefined {
  return BUCKET_CONFIGS.find((b) => b.slug === slug);
}

// ────────────────────────────────────────────────────────────────────────────
// Hydration — fetch live fund data for a bucket
// ────────────────────────────────────────────────────────────────────────────

/** Cache of fetched category data to avoid duplicate API calls within a render */
const categoryCache = new Map<string, Promise<PerformanceRow[]>>();

async function fetchCategoryFunds(category: string): Promise<PerformanceRow[]> {
  if (!categoryCache.has(category)) {
    categoryCache.set(
      category,
      getCategoryTopPerformers(category, "1y")
        .then((d) => regularOnly(d.list || []))
        .catch(() => [])
    );
  }
  return categoryCache.get(category)!;
}

/**
 * Pick the top N funds by 3Y CAGR (falling back to 1Y) for a category.
 * If fewer than N are available, returns what's there.
 */
function pickTopFunds(funds: PerformanceRow[], count: number): PerformanceRow[] {
  return [...funds]
    .sort((a, b) => (b.returns_cmp_3year ?? b.returns_abs_1year ?? 0) - (a.returns_cmp_3year ?? a.returns_abs_1year ?? 0))
    .slice(0, count);
}

/**
 * Estimated annualized volatility (standard deviation of returns) by MF category.
 * Based on historical 5-10 year data for Indian mutual funds. These are approximate
 * mid-range values — actual fund volatility varies.
 *
 * Sources: AMFI, Value Research, Morningstar India historical data.
 */
const CATEGORY_VOLATILITY: Record<string, number> = {
  // Pure equity — 15-25%
  "Equity: Large Cap": 15,
  "Equity: Mid Cap": 20,
  "Equity: Small Cap": 24,
  "Equity: Flexi Cap": 16,
  "Equity: Multi Cap": 17,
  "Equity: ELSS": 17,
  "Equity: Value Fund": 18,
  "Equity: Focused Fund": 17,
  "Equity: Dividend Yield": 15,
  // Hybrid — 8-14%
  "Hybrid: Aggressive": 13,
  "Hybrid: Conservative": 6,
  "Hybrid: Equity Savings": 7,
  "Hybrid: Arbitrage": 2,
  "Hybrid: Multi Asset Allocation": 10,
  // Debt — 1-6%
  "Debt: Short Duration": 3,
  "Debt: Ultra Short Duration": 1.5,
  "Debt: Liquid": 0.5,
  "Debt: Corporate Bond": 4,
  // FoF / International — 16-22%
  "Fund of Funds-Overseas": 18,
  "Fund of Funds-Gold": 14,
};

/** Fallback volatility when category isn't in the map */
const DEFAULT_VOLATILITY = 15;

/**
 * Estimate portfolio-level annualized volatility from weighted category volatilities.
 * Assumes imperfect correlation (0.6) between slots to give a modest diversification benefit.
 */
function estimatePortfolioVolatility(slots: HydratedSlot[]): number {
  // Weighted average of category vols (no diversification benefit = upper bound)
  let weightedVol = 0;
  for (const slot of slots) {
    const catVol = CATEGORY_VOLATILITY[slot.category] ?? DEFAULT_VOLATILITY;
    weightedVol += catVol * slot.weight;
  }
  // Apply a diversification discount — sqrt of weighted variance with ρ=0.6
  // For a multi-asset portfolio, perfect correlation gives weightedVol,
  // but real correlation is lower. Using sqrt(ρ) ≈ 0.77 as a scaling factor.
  const diversifiedVol = weightedVol * 0.85; // ~15% diversification benefit
  return Math.max(diversifiedVol, 0.5);
}

/** Compute portfolio-level analytics from hydrated slots */
function computeAnalytics(slots: HydratedSlot[]): PortfolioAnalytics {
  let blend1y = 0, blend3y = 0, blend5y = 0, weightedTer = 0;
  let has1y = false, has3y = false, has5y = false, hasTer = false;
  let fundCount = 0;
  const returns3y: number[] = [];

  for (const slot of slots) {
    const perFundWeight = slot.funds.length > 0 ? slot.weight / slot.funds.length : 0;
    for (const f of slot.funds) {
      fundCount++;
      if (f.returns_abs_1year != null) { blend1y += f.returns_abs_1year * perFundWeight; has1y = true; }
      if (f.returns_cmp_3year != null) {
        blend3y += f.returns_cmp_3year * perFundWeight;
        has3y = true;
        returns3y.push(f.returns_cmp_3year);
      }
      if (f.returns_cmp_5year != null) { blend5y += f.returns_cmp_5year * perFundWeight; has5y = true; }
      if (f.ter != null && f.ter > 0) { weightedTer += f.ter * perFundWeight; hasTer = true; }
    }
  }

  // Sharpe & Sortino proxies using category-based estimated annualized volatility.
  // We can't compute real time-series volatility from trailing returns alone, so we
  // use well-known historical volatility ranges for Indian MF categories as proxies.
  const rf = 6; // India risk-free rate proxy (10Y G-Sec ≈ 7%, short-term T-bill ≈ 6%)
  let sharpeProxy: number | null = null;
  let sortinoProxy: number | null = null;

  // Estimate portfolio volatility from weighted category volatilities
  const portfolioVol = estimatePortfolioVolatility(slots);

  if (has3y && portfolioVol > 0) {
    sharpeProxy = +((blend3y - rf) / portfolioVol).toFixed(2);
    // Sortino uses downside deviation — typically ~65-70% of total vol for equity,
    // ~50% for debt/hybrid. Use 0.65 as a blended assumption.
    const downsideDev = portfolioVol * 0.65;
    if (downsideDev > 0) sortinoProxy = +((blend3y - rf) / downsideDev).toFixed(2);
  }

  // Max drawdown proxy — worst 1Y return
  let maxDrawdownProxy: number | null = null;
  const all1y = slots.flatMap((s) => s.funds.map((f) => f.returns_abs_1year).filter((v): v is number => v != null));
  if (all1y.length > 0) maxDrawdownProxy = Math.min(...all1y);

  return {
    blend1y: has1y ? +blend1y.toFixed(1) : null,
    blend3y: has3y ? +blend3y.toFixed(1) : null,
    blend5y: has5y ? +blend5y.toFixed(1) : null,
    weightedTer: hasTer ? +weightedTer.toFixed(2) : null,
    sharpeProxy,
    sortinoProxy,
    maxDrawdownProxy: maxDrawdownProxy != null ? +maxDrawdownProxy.toFixed(1) : null,
    fundCount,
  };
}

/** Hydrate a single bucket with live data */
export async function hydrateBucket(config: BucketConfig): Promise<HydratedBucket> {
  // Fetch all unique categories in parallel
  const uniqueCats = [...new Set(config.slots.map((s) => s.category))];
  await Promise.all(uniqueCats.map(fetchCategoryFunds));

  const hydratedSlots: HydratedSlot[] = await Promise.all(
    config.slots.map(async (slot) => {
      const catFunds = await fetchCategoryFunds(slot.category);
      const picked = pickTopFunds(catFunds, slot.pick);
      return { ...slot, funds: picked };
    })
  );

  const analytics = computeAnalytics(hydratedSlots);

  return { ...config, slots: hydratedSlots, analytics };
}

/** Hydrate all buckets (for the index page) */
export async function hydrateAllBuckets(): Promise<HydratedBucket[]> {
  // Clear category cache for fresh data
  categoryCache.clear();
  return Promise.all(BUCKET_CONFIGS.map(hydrateBucket));
}

/** Format a number with Indian comma style */
export function formatINR(n: number): string {
  return n.toLocaleString("en-IN");
}
