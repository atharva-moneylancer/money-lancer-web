/**
 * Fund Buckets — curated portfolios assembled from live AdvisorKhoj data.
 *
 * Each bucket defines a flat list of specific named funds (FundSpec[]).
 * At build/ISR time, `hydrateBucket()` fetches category data from AdvisorKhoj
 * and matches each fund by name to pull live performance data.
 * All funds in a bucket are equally weighted (1/N).
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

export type FundSpec = {
  /** Display name shown in UI */
  name: string;
  /** Substring to match against scheme_amfi in API response (case-insensitive) */
  match: string;
  /** AdvisorKhoj category to search within */
  category: string;
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
  /** Specific funds in this bucket */
  funds: FundSpec[];
  /** Accent colour class for the card gradient */
  accent: string;
  /** Icon label (emoji for now, swap for SVG later) */
  icon: string;
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
  /** Max drawdown proxy — worst 1Y return among constituent funds */
  maxDrawdownProxy: number | null;
  /** Total number of constituent funds found */
  fundCount: number;
};

export type HydratedBucket = BucketConfig & {
  /** Live fund data matched from API */
  hydratedFunds: PerformanceRow[];
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
      "An aggressive portfolio for investors with a long horizon and high risk appetite. Combines small-cap and mid-cap exposure for maximum growth potential.",
    group: "Wealth Creation",
    riskLevel: "Very High",
    holdingPeriod: "7+ years",
    sipMin: 5000,
    sipMax: 50000,
    accent: "from-critical/15 via-transparent to-transparent",
    icon: "🚀",
    funds: [
      { name: "Bandhan Small Cap Fund", match: "Bandhan Small Cap", category: "Equity: Small Cap" },
      { name: "Invesco India Smallcap Fund", match: "Invesco India Smallcap", category: "Equity: Small Cap" },
      { name: "Edelweiss Mid Cap Fund", match: "Edelweiss Mid Cap", category: "Equity: Mid Cap" },
      { name: "WhiteOak Capital Mid Cap Fund", match: "WhiteOak Capital Mid Cap", category: "Equity: Mid Cap" },
      { name: "HDFC Mid Cap Opportunities Fund", match: "HDFC Mid Cap", category: "Equity: Mid Cap" },
    ],
  },
  {
    slug: "steady-compounder",
    name: "Steady Compounder",
    tagline: "Consistent wealth creation",
    description:
      "A core portfolio built around flexi-cap versatility and multi-cap diversification. Designed for investors who want steady compounding without extreme volatility.",
    group: "Wealth Creation",
    riskLevel: "Moderately High",
    holdingPeriod: "5+ years",
    sipMin: 5000,
    sipMax: 100000,
    accent: "from-crayola/15 via-transparent to-transparent",
    icon: "📈",
    funds: [
      { name: "Bajaj Finserv Flexi Cap Fund", match: "Bajaj Finserv Flexi Cap", category: "Equity: Flexi Cap" },
      { name: "WhiteOak Capital Flexi Cap Fund", match: "WhiteOak Capital Flexi Cap", category: "Equity: Flexi Cap" },
      { name: "Parag Parikh Flexi Cap Fund", match: "Parag Parikh Flexi Cap", category: "Equity: Flexi Cap" },
      { name: "Kotak Multicap Fund", match: "Kotak Multicap", category: "Equity: Multi Cap" },
      { name: "Axis Multicap Fund", match: "Axis Multicap", category: "Equity: Multi Cap" },
    ],
  },
  {
    slug: "core-allocation",
    name: "Core Allocation",
    tagline: "Core allocation",
    description:
      "A focused large & mid-cap portfolio offering the stability of blue-chips with the growth potential of quality mid-caps. Ideal as a core equity holding.",
    group: "Wealth Creation",
    riskLevel: "High",
    holdingPeriod: "5+ years",
    sipMin: 5000,
    sipMax: 50000,
    accent: "from-spring/20 via-transparent to-transparent",
    icon: "🏦",
    funds: [
      { name: "Bandhan Large & Mid Cap Fund", match: "Bandhan Large & Mid Cap", category: "Equity: Large and Mid Cap" },
      { name: "DSP Large & Mid Cap Fund", match: "DSP Large & Mid Cap", category: "Equity: Large and Mid Cap" },
      { name: "Axis Large & Mid Cap Fund", match: "Axis Large & Mid Cap", category: "Equity: Large and Mid Cap" },
    ],
  },
  {
    slug: "mid-cap-momentum",
    name: "Mid Cap Momentum",
    tagline: "Ride the mid-cap wave",
    description:
      "A concentrated mid-cap and large & mid-cap bet for investors who believe in the structural growth story of India's mid-sized companies. Higher volatility, higher potential.",
    group: "Wealth Creation",
    riskLevel: "Very High",
    holdingPeriod: "5+ years",
    sipMin: 3000,
    sipMax: 30000,
    accent: "from-electric/20 via-transparent to-transparent",
    icon: "⚡",
    funds: [
      { name: "Edelweiss Mid Cap Fund", match: "Edelweiss Mid Cap", category: "Equity: Mid Cap" },
      { name: "WhiteOak Capital Mid Cap Fund", match: "WhiteOak Capital Mid Cap", category: "Equity: Mid Cap" },
      { name: "HDFC Mid Cap Opportunities Fund", match: "HDFC Mid Cap", category: "Equity: Mid Cap" },
      { name: "Bandhan Large & Mid Cap Fund", match: "Bandhan Large & Mid Cap", category: "Equity: Large and Mid Cap" },
    ],
  },

  // ── Goal-Based ───────────────────────────────────────────────────────────
  {
    slug: "retirement-builder",
    name: "Retirement Builder",
    tagline: "Build your retirement corpus",
    description:
      "A diversified long-term portfolio combining retirement-specific funds with equity and hybrid exposure. Designed for accumulation years with gradual de-risking.",
    group: "Goal-Based",
    riskLevel: "Moderately High",
    holdingPeriod: "10+ years",
    sipMin: 5000,
    sipMax: 100000,
    accent: "from-yale/10 via-transparent to-transparent",
    icon: "🏖️",
    funds: [
      { name: "HDFC Retirement Savings Fund", match: "HDFC Retirement Savings", category: "Retirement Fund" },
      { name: "ICICI Pru Equity & Debt Fund", match: "ICICI Prudential Equity & Debt", category: "Hybrid: Aggressive" },
      { name: "Edelweiss Aggressive Hybrid Fund", match: "Edelweiss Aggressive Hybrid", category: "Hybrid: Aggressive" },
      { name: "Bank of India Mid & Small Cap Equity & Debt Fund", match: "Bank of India Mid & Small Cap", category: "Hybrid: Aggressive" },
      { name: "Parag Parikh Flexi Cap Fund", match: "Parag Parikh Flexi Cap", category: "Equity: Flexi Cap" },
      { name: "Nippon India Multi Cap Fund", match: "Nippon India Multi Cap", category: "Equity: Multi Cap" },
    ],
  },
  {
    slug: "childs-future",
    name: "Child's Future",
    tagline: "Invest in their dreams",
    description:
      "A goal-oriented portfolio for your child's education or career — combines children's-specific funds with hybrid and multi-asset strategies for balanced growth.",
    group: "Goal-Based",
    riskLevel: "Moderately High",
    holdingPeriod: "10+ years",
    sipMin: 2000,
    sipMax: 50000,
    accent: "from-electric/15 via-transparent to-transparent",
    icon: "👶",
    funds: [
      { name: "HDFC Children's Fund", match: "HDFC Childrens", category: "Childrens Fund" },
      { name: "SBI Children's Fund", match: "SBI Childrens", category: "Childrens Fund" },
      { name: "ICICI Pru Equity & Debt Fund", match: "ICICI Prudential Equity & Debt", category: "Hybrid: Aggressive" },
      { name: "Kotak Multi Asset Allocation Fund", match: "Kotak Multi Asset", category: "Hybrid: Multi Asset Allocation" },
      { name: "DSP Multi Asset Allocation Fund", match: "DSP Multi Asset", category: "Hybrid: Multi Asset Allocation" },
    ],
  },
  {
    slug: "first-home-fund",
    name: "First Home Fund",
    tagline: "Save for your down payment",
    description:
      "A medium-term portfolio designed for a 3-5 year home down-payment goal. Multi-asset and equity savings funds balance growth with capital protection.",
    group: "Goal-Based",
    riskLevel: "Moderate",
    holdingPeriod: "3–5 years",
    sipMin: 5000,
    sipMax: 50000,
    accent: "from-gold/15 via-transparent to-transparent",
    icon: "🏠",
    funds: [
      { name: "Kotak Multi Asset Allocation Fund", match: "Kotak Multi Asset", category: "Hybrid: Multi Asset Allocation" },
      { name: "DSP Multi Asset Allocation Fund", match: "DSP Multi Asset", category: "Hybrid: Multi Asset Allocation" },
      { name: "Nippon India Multi Asset Allocation Fund", match: "Nippon India Multi Asset", category: "Hybrid: Multi Asset Allocation" },
      { name: "ICICI Pru Equity Savings Fund", match: "ICICI Prudential Equity Savings", category: "Hybrid: Equity Savings" },
    ],
  },
  {
    slug: "dream-goal-fund",
    name: "Dream Goal Fund",
    tagline: "For goals 1–3 years away",
    description:
      "A conservative short-term portfolio for near-term goals — a vacation, wedding, or big purchase. Prioritises capital safety with modest equity exposure.",
    group: "Goal-Based",
    riskLevel: "Low to Moderate",
    holdingPeriod: "1–3 years",
    sipMin: 5000,
    sipMax: 100000,
    accent: "from-spring/15 via-transparent to-transparent",
    icon: "✨",
    funds: [
      { name: "ICICI Pru Equity Savings Fund", match: "ICICI Prudential Equity Savings", category: "Hybrid: Equity Savings" },
      { name: "ICICI Pru Ultra Short Term Fund", match: "ICICI Prudential Ultra Short", category: "Debt: Ultra Short Duration" },
      { name: "Edelweiss Aggressive Hybrid Fund", match: "Edelweiss Aggressive Hybrid", category: "Hybrid: Aggressive" },
      { name: "DSP Multi Asset Allocation Fund", match: "DSP Multi Asset", category: "Hybrid: Multi Asset Allocation" },
    ],
  },

  // ── Conservative & Income ────────────────────────────────────────────────
  {
    slug: "conservative-income",
    name: "Conservative Income",
    tagline: "Stability with modest income",
    description:
      "A low-risk portfolio for capital preservation with incremental income. Combines equity savings, ultra-short debt, and hybrid funds for better-than-FD returns.",
    group: "Conservative & Income",
    riskLevel: "Low to Moderate",
    holdingPeriod: "1–3 years",
    sipMin: 10000,
    sipMax: 500000,
    accent: "from-spring/15 via-transparent to-transparent",
    icon: "🛡️",
    funds: [
      { name: "ICICI Pru Equity Savings Fund", match: "ICICI Prudential Equity Savings", category: "Hybrid: Equity Savings" },
      { name: "ICICI Pru Ultra Short Term Fund", match: "ICICI Prudential Ultra Short", category: "Debt: Ultra Short Duration" },
      { name: "Bandhan Aggressive Hybrid Fund", match: "Bandhan Aggressive Hybrid", category: "Hybrid: Aggressive" },
      { name: "Kotak Multi Asset Allocation Fund", match: "Kotak Multi Asset", category: "Hybrid: Multi Asset Allocation" },
    ],
  },
  {
    slug: "monthly-income-swp",
    name: "Monthly Income (SWP)",
    tagline: "Regular cash flow via SWP",
    description:
      "Designed for systematic withdrawal — invest a lump sum and withdraw monthly via SWP. Aggressive hybrid and multi-asset funds grow in the background while you draw regular income.",
    group: "Conservative & Income",
    riskLevel: "Moderate",
    holdingPeriod: "3+ years",
    sipMin: 10000,
    sipMax: 500000,
    accent: "from-gold/15 via-transparent to-transparent",
    icon: "💰",
    funds: [
      { name: "ICICI Pru Equity & Debt Fund", match: "ICICI Prudential Equity & Debt", category: "Hybrid: Aggressive" },
      { name: "Edelweiss Aggressive Hybrid Fund", match: "Edelweiss Aggressive Hybrid", category: "Hybrid: Aggressive" },
      { name: "Kotak Multi Asset Allocation Fund", match: "Kotak Multi Asset", category: "Hybrid: Multi Asset Allocation" },
      { name: "DSP Multi Asset Allocation Fund", match: "DSP Multi Asset", category: "Hybrid: Multi Asset Allocation" },
    ],
  },
  {
    slug: "liquid-parking",
    name: "Liquid Parking",
    tagline: "Park idle cash smartly",
    description:
      "For surplus cash that needs to be deployed within days to weeks. Ultra-short debt and multi-asset funds for near-zero volatility — better than a savings account.",
    group: "Conservative & Income",
    riskLevel: "Low",
    holdingPeriod: "1 day – 3 months",
    sipMin: 10000,
    sipMax: 1000000,
    accent: "from-crayola/10 via-transparent to-transparent",
    icon: "🏧",
    funds: [
      { name: "ICICI Pru Ultra Short Term Fund", match: "ICICI Prudential Ultra Short", category: "Debt: Ultra Short Duration" },
      { name: "Nippon India Multi Asset Allocation Fund", match: "Nippon India Multi Asset", category: "Hybrid: Multi Asset Allocation" },
      { name: "Kotak Multi Asset Allocation Fund", match: "Kotak Multi Asset", category: "Hybrid: Multi Asset Allocation" },
    ],
  },
  {
    slug: "senior-citizen-stable",
    name: "Senior Citizen Stable",
    tagline: "Safety-first for retirees",
    description:
      "A defensive portfolio for retirees prioritising capital safety and predictable income. Equity savings and retirement funds with multi-asset cushioning.",
    group: "Conservative & Income",
    riskLevel: "Low to Moderate",
    holdingPeriod: "1–3 years",
    sipMin: 10000,
    sipMax: 200000,
    accent: "from-yale/10 via-transparent to-transparent",
    icon: "🧓",
    funds: [
      { name: "ICICI Pru Equity Savings Fund", match: "ICICI Prudential Equity Savings", category: "Hybrid: Equity Savings" },
      { name: "HDFC Retirement Savings Fund", match: "HDFC Retirement Savings", category: "Retirement Fund" },
      { name: "Bandhan Aggressive Hybrid Fund", match: "Bandhan Aggressive Hybrid", category: "Hybrid: Aggressive" },
      { name: "Nippon India Multi Asset Allocation Fund", match: "Nippon India Multi Asset", category: "Hybrid: Multi Asset Allocation" },
    ],
  },

  // ── Thematic & Satellite ─────────────────────────────────────────────────
  {
    slug: "global-diversifier",
    name: "Global Diversifier",
    tagline: "Go beyond India",
    description:
      "Diversify outside the Indian market with international fund-of-funds and globally diversified flexi-cap strategies. Access global equities through rupee-denominated vehicles.",
    group: "Thematic & Satellite",
    riskLevel: "High",
    holdingPeriod: "5+ years",
    sipMin: 3000,
    sipMax: 25000,
    accent: "from-electric/20 via-transparent to-transparent",
    icon: "🌍",
    funds: [
      { name: "DSP Global Innovation FoF", match: "DSP Global Innovation", category: "Fund of Funds-Overseas" },
      { name: "DSP US Specific Equity FoF", match: "DSP US Specific Equity", category: "Fund of Funds-Overseas" },
      { name: "Parag Parikh Flexi Cap Fund", match: "Parag Parikh Flexi Cap", category: "Equity: Flexi Cap" },
      { name: "Axis Large & Mid Cap Fund", match: "Axis Large & Mid Cap", category: "Equity: Large and Mid Cap" },
    ],
  },
  {
    slug: "strong-alpha-funds",
    name: "Strong Alpha Funds",
    tagline: "Thematic and strategic exposure",
    description:
      "A tactical satellite allocation picking high-conviction thematic, business cycle, and innovation funds. For investors seeking alpha beyond core holdings.",
    group: "Thematic & Satellite",
    riskLevel: "Very High",
    holdingPeriod: "3+ years",
    sipMin: 3000,
    sipMax: 30000,
    accent: "from-critical/15 via-transparent to-transparent",
    icon: "🎯",
    funds: [
      { name: "ICICI Prudential India Opportunities Fund", match: "ICICI Prudential India Opportunities", category: "Equity: Thematic-Others" },
      { name: "Mahindra Manulife Business Cycle Fund", match: "Mahindra Manulife Business Cycle", category: "Equity: Thematic-Business-Cycle" },
      { name: "Franklin India Opportunities Fund", match: "Franklin India Opportunities", category: "Equity: Thematic-Others" },
      { name: "Sundaram Services Fund", match: "Sundaram Services", category: "Equity: Thematic-Others" },
      { name: "Kotak Pioneer Fund", match: "Kotak Pioneer", category: "Equity: Thematic-Innovation" },
      { name: "ICICI Prudential Conglomerate Fund", match: "ICICI Prudential Conglomerate", category: "Equity: Thematic-Others" },
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
    funds: [
      { name: "Kotak Multi Asset Allocation Fund", match: "Kotak Multi Asset", category: "Hybrid: Multi Asset Allocation" },
      { name: "DSP Multi Asset Allocation Fund", match: "DSP Multi Asset", category: "Hybrid: Multi Asset Allocation" },
      { name: "Nippon India Multi Asset Allocation Fund", match: "Nippon India Multi Asset", category: "Hybrid: Multi Asset Allocation" },
      { name: "ICICI Pru Equity & Debt Fund", match: "ICICI Prudential Equity & Debt", category: "Hybrid: Aggressive" },
      { name: "Parag Parikh Flexi Cap Fund", match: "Parag Parikh Flexi Cap", category: "Equity: Flexi Cap" },
    ],
  },
  {
    slug: "gold-commodities-hedge",
    name: "Gold & Commodities Hedge",
    tagline: "Hedge against inflation",
    description:
      "An inflation hedge through gold and gold-silver ETF fund-of-funds. Acts as portfolio insurance — tends to rise when equities and bonds fall.",
    group: "Thematic & Satellite",
    riskLevel: "Moderately High",
    holdingPeriod: "3+ years",
    sipMin: 2000,
    sipMax: 20000,
    accent: "from-gold/20 via-transparent to-transparent",
    icon: "🥇",
    funds: [
      { name: "Edelweiss Gold & Silver ETF FoF", match: "Edelweiss Gold and Silver", category: "Fund of Funds-Domestic-Gold and Silver" },
      { name: "Kotak Gold Fund", match: "Kotak Gold Fund", category: "Fund of Funds-Domestic-Gold" },
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
 * Find a specific fund by name within a category's fund list.
 * Uses case-insensitive substring matching.
 */
function findFundByName(funds: PerformanceRow[], match: string): PerformanceRow | undefined {
  const needle = match.toLowerCase();
  return funds.find((f) => (f.scheme_amfi || "").toLowerCase().includes(needle));
}

/** Compute portfolio-level analytics from equally-weighted funds */
function computeAnalytics(funds: PerformanceRow[]): PortfolioAnalytics {
  const n = funds.length;
  if (n === 0) {
    return { blend1y: null, blend3y: null, blend5y: null, weightedTer: null, maxDrawdownProxy: null, fundCount: 0 };
  }

  const w = 1 / n; // equal weight
  let blend1y = 0, blend3y = 0, blend5y = 0, weightedTer = 0;
  let has1y = false, has3y = false, has5y = false, hasTer = false;

  for (const f of funds) {
    if (f.returns_abs_1year != null) { blend1y += f.returns_abs_1year * w; has1y = true; }
    if (f.returns_cmp_3year != null) { blend3y += f.returns_cmp_3year * w; has3y = true; }
    if (f.returns_cmp_5year != null) { blend5y += f.returns_cmp_5year * w; has5y = true; }
    if (f.ter != null && f.ter > 0) { weightedTer += f.ter * w; hasTer = true; }
  }

  // Max drawdown proxy — worst 1Y return
  const all1y = funds.map((f) => f.returns_abs_1year).filter((v): v is number => v != null);
  const maxDrawdownProxy = all1y.length > 0 ? Math.min(...all1y) : null;

  return {
    blend1y: has1y ? +blend1y.toFixed(1) : null,
    blend3y: has3y ? +blend3y.toFixed(1) : null,
    blend5y: has5y ? +blend5y.toFixed(1) : null,
    weightedTer: hasTer ? +weightedTer.toFixed(2) : null,
    maxDrawdownProxy: maxDrawdownProxy != null ? +maxDrawdownProxy.toFixed(1) : null,
    fundCount: n,
  };
}

/** Hydrate a single bucket with live data */
export async function hydrateBucket(config: BucketConfig): Promise<HydratedBucket> {
  // Collect all unique categories needed for this bucket
  const uniqueCats = [...new Set(config.funds.map((f) => f.category))];

  // Fetch all categories in parallel
  await Promise.all(uniqueCats.map(fetchCategoryFunds));

  // Match each fund spec to a real fund from the API
  const matched: PerformanceRow[] = [];
  for (const spec of config.funds) {
    const catFunds = await fetchCategoryFunds(spec.category);
    const found = findFundByName(catFunds, spec.match);
    if (found) {
      matched.push(found);
    }
    // If not found, skip silently — the fund count will reflect actual matches
  }

  const analytics = computeAnalytics(matched);

  return { ...config, hydratedFunds: matched, analytics };
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
