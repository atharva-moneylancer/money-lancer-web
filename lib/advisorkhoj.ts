/**
 * Server-side AdvisorKhoj API client.
 *
 * Every endpoint accepts `key` as a query param. Responses generally come back
 * as { status, status_msg, msg, ... } envelopes — be tolerant about exact shapes.
 *
 * Caching: `next.revalidate` chosen per endpoint based on how often the data
 * actually changes (NAVs hourly, scheme master weekly, etc).
 */

const BASE = process.env.ADVISORKHOJ_BASE_URL || "https://mfapi.advisorkhoj.com";
const MFBOX = process.env.ADVISORKHOJ_MFBOX_URL || "https://advisorkhoj.themfbox.com/advisory-tools";
const KEY = process.env.ADVISORKHOJ_API_KEY || "";

type Json = Record<string, unknown>;

function buildUrl(base: string, path: string, params: Record<string, string | number | undefined>) {
  const u = new URL(`${base}/${path.replace(/^\//, "")}`);
  u.searchParams.set("key", KEY);
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    u.searchParams.set(k, String(v));
  }
  return u.toString();
}

async function ahFetch<T = Json>(
  base: string,
  path: string,
  params: Record<string, string | number | undefined>,
  revalidate = 3600
): Promise<T> {
  const url = buildUrl(base, path, params);
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate },
  });
  if (!res.ok) throw new Error(`AdvisorKhoj ${path} → ${res.status}`);
  return (await res.json()) as T;
}

// ──────────────────────────────────────────────────────────────────────────────
// Scheme master & metadata
// ──────────────────────────────────────────────────────────────────────────────

export type SchemeListItem = {
  scheme_company: string;
  scheme_advisorkhoj_category: string;
  scheme_amfi: string;
  scheme_amfi_code: string;
  scheme_isin: string;
};

export async function getAllSchemes() {
  return ahFetch<{ scheme_list: SchemeListItem[] }>(BASE, "getAllMutualFundSchemesRegAndDir", {}, 7 * 24 * 3600);
}

export type SchemeInfo = {
  scheme_name: string;
  scheme_amfi_code: string;
  nav: number;
  nav_date: string;
  nav_change: number;
  nav_change_percentage: number;
  scheme_inception_return: number;
  benchmark_inception_return: number;
  scheme_objective: string;
  scheme_manager: string;
  riskometer_value: string;
  isin_no: string;
  isin_divreinvst_no: string;
  scheme_category: string;
  scheme_company: string;
  scheme_inception_date: string;
  asset_class: string;
  scheme_benchmark: string;
  scheme_benchmark_code: string;
  expense_ratio_percentage: number;
  expense_ratio_date: string;
  scheme_status: string;
  scheme_assets?: number;
};

export async function getSchemeInfo(scheme: string) {
  // Try the scheme name first (canonical param for getSchemeInfoLatest).
  // If it looks like a bare numeric AMFI code, resolve it to a name via the
  // master scheme list before retrying — keeps old AMFI-code URLs working.
  try {
    const r = await ahFetch<SchemeInfo>(BASE, "getSchemeInfoLatest", { scheme }, 3600);
    if (r && r.scheme_name) return r;
  } catch {
    // fall through to lookup
  }
  if (/^\d+$/.test(scheme)) {
    try {
      const master = await getAllSchemes();
      const match = master.scheme_list?.find((s) => s.scheme_amfi_code === scheme);
      if (match?.scheme_amfi) {
        return ahFetch<SchemeInfo>(BASE, "getSchemeInfoLatest", { scheme: match.scheme_amfi }, 3600);
      }
    } catch {
      // ignore
    }
  }
  // last resort — return whatever the API gave us (might be a partial / empty response)
  return ahFetch<SchemeInfo>(BASE, "getSchemeInfoLatest", { scheme }, 3600);
}

export async function getAllSchemeCategories() {
  return ahFetch<{ list: string[] }>(BASE, "getAllSchemeCategories", {}, 24 * 3600);
}

export async function getSchemesByCategory(category: string) {
  return ahFetch<{ list: string[] }>(BASE, "getAllMutualFundSchemesbyCategory", { category }, 24 * 3600);
}

export async function getSchemeListByAMCAndCategory(amc: string, category = "All", broad_category = "All") {
  return ahFetch<{ list: any[] }>(
    BASE,
    "getSchemeListByAMCAndCategory",
    { amc, category, broad_category },
    24 * 3600
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Performance / returns
// ──────────────────────────────────────────────────────────────────────────────

export type PerformanceRow = {
  scheme_amfi: string;
  scheme_amfi_code: string;
  scheme_category: string;
  scheme_company: string;
  scheme_company_short_name?: string;
  scheme_amfi_short_name?: string;
  category_short_name?: string;
  inception_date: string;
  price: number;
  price_date: string;
  price_change_onday: number;
  price_change_percent_onday: number;
  ter: number;
  scheme_assets: number;
  riskometer?: string;
  returns_abs_7days?: number;
  returns_abs_1month?: number;
  returns_abs_3month?: number;
  returns_abs_6month?: number;
  returns_abs_ytd?: number;
  returns_abs_1year?: number;
  returns_cmp_2year?: number;
  returns_cmp_3year?: number;
  returns_cmp_5year?: number;
  returns_cmp_10year?: number;
  returns_cmp_inception?: number;
};

export async function getCategoryTopPerformers(category: string, period: string) {
  return ahFetch<{ list: PerformanceRow[] }>(BASE, "getSchemePerformanceReturnsNew", { category, period }, 6 * 3600);
}

export type CategoryPerformanceRow = {
  sector: string;
  scheme_broad_category: string;
  returns_abs_1month?: number;
  returns_abs_3month?: number;
  returns_abs_6month?: number;
  returns_abs_ytd?: number;
  returns_abs_1year?: number;
  returns_cmp_3year?: number;
  returns_cmp_5year?: number;
  returns_cmp_10year?: number;
};

export async function getCategoryPerformance() {
  return ahFetch<{ list: CategoryPerformanceRow[] }>(BASE, "getCategoryPerformance", {}, 6 * 3600);
}

export async function getSchemeTrailingReturns(scheme: string) {
  return ahFetch<{
    scheme: string;
    list: Array<{
      period: string;
      scheme_return?: number;
      benchmark_return?: number;
      category_average_return?: number;
    }>;
  }>(BASE, "getSchemeTrailingReturns", { scheme }, 6 * 3600);
}

export async function getAnnualReturns(scheme: string) {
  return ahFetch<{
    scheme: string;
    list: Array<{
      year: string | number;
      scheme_return?: number;
      benchmark_return?: number;
      category_average_return?: number;
    }>;
  }>(BASE, "getAnnualReturnOfFunds", { scheme }, 24 * 3600);
}

// ──────────────────────────────────────────────────────────────────────────────
// NAV
// ──────────────────────────────────────────────────────────────────────────────

export type LatestNavRow = {
  scheme_code: string;
  scheme_name: string;
  mf_company: string;
  category: string;
  net_asset_value: number;
  nav_date: string;
  prev_net_asset_value: number;
  prev_nav_date: string;
  change_percent: number;
};

export async function getLatestNav(amc = "All", category = "All") {
  return ahFetch<{ list: LatestNavRow[]; nav_date: string }>(BASE, "getLatestNav", { amc, category }, 3600);
}

// ──────────────────────────────────────────────────────────────────────────────
// Calculators
// ──────────────────────────────────────────────────────────────────────────────

export type SipInstallment = {
  nav_date: string;
  nav: number;
  units: number;
  cumulative_units: number;
  cumulative_invested_amount: number;
  current_value: number;
};

export type SipCalculatorResult = {
  list: Array<{
    scheme: string;
    inception_date: string;
    nav_date: string;
    nav: number;
    units: number;
    no_of_installment: number;
    invested_amount: number;
    current_value: number;
    returns: number;
    sip_list: SipInstallment[];
    current_value_xirr?: number;
    scheme_benchmark?: string;
    latestNav?: number;
  }>;
};

export async function getSipReturnCalculator(p: {
  category: string;
  fund: string;
  amount: number;
  frequency?: "Monthly" | "Quarterly" | "Weekly" | "Fortnightly";
  startdate: string;
  enddate: string;
}) {
  return ahFetch<SipCalculatorResult>(
    BASE,
    "getSIPReturnCalculator",
    { ...p, frequency: p.frequency ?? "Monthly" },
    3600
  );
}

export async function getLumpSumReturns(p: {
  scheme: string;
  amount: number;
  startdate: string;
  enddate: string;
}) {
  return ahFetch<any>(BASE, "getLumpSumReturns", p, 3600);
}

export async function getSwpReturns(p: {
  scheme: string;
  initial_amount: number;
  withdrawal_amount: number;
  startdate: string;
  enddate: string;
  frequency?: "Monthly" | "Quarterly";
}) {
  return ahFetch<any>(BASE, "getSWPReturnCalculator", { ...p, frequency: p.frequency ?? "Monthly" }, 3600);
}

export async function getStepUpSipReturns(p: {
  scheme: string;
  amount: number;
  annual_step_up: number;
  startdate: string;
  enddate: string;
  frequency?: "Monthly" | "Quarterly";
}) {
  return ahFetch<any>(BASE, "getSIPReturnWithAnnualIncrease", { ...p, frequency: p.frequency ?? "Monthly" }, 3600);
}

export async function getTopSipFunds(p: { category: string; amount: number; period: number }) {
  return ahFetch<{
    list: Array<{
      scheme_name: string;
      scheme_company: string;
      current_cost: number;
      current_value: number;
      returns: number;
      rank_3_yr?: number;
    }>;
  }>(BASE, "getSIPReturnsForCategoryPeriodAmount", p, 6 * 3600);
}

export async function getTopLumpsumFunds(p: { category: string; amount: number; period: number }) {
  return ahFetch<{
    list: Array<{ scheme_name: string; scheme_company: string; current_cost: number; current_value: number; returns: number }>;
  }>(BASE, "getTopPerformingLumpsumFunds", p, 6 * 3600);
}

// ──────────────────────────────────────────────────────────────────────────────
// Risk & ranking
// ──────────────────────────────────────────────────────────────────────────────

export async function getQuartileRanking(scheme: string) {
  return ahFetch<any>(BASE, "getMutualFundQuartileRanking", { scheme }, 24 * 3600);
}

export async function getVolatilityRanking(scheme: string) {
  return ahFetch<any>(BASE, "getMutualFundVolatalityRanking", { scheme }, 24 * 3600);
}

export async function getMarketCaptureRatio(scheme: string) {
  return ahFetch<any>(BASE, "getMarketCaptureRatio", { scheme }, 24 * 3600);
}

// ──────────────────────────────────────────────────────────────────────────────
// Portfolio
// ──────────────────────────────────────────────────────────────────────────────

export type PortfolioAnalysis = {
  schemePortfolioHoldingsNamesString: string[];
  schemePortfolioHoldingsValuesString: number[];
  schemePortfolioHoldings: Record<string, number>;
  sectorNamesString?: string[];
  sectorValuesString?: number[];
  sectorAllocation?: Record<string, number>;
};

export async function getPortfolioAnalysis(scheme_name: string) {
  return ahFetch<PortfolioAnalysis>(BASE, "getPortfolioAnalysisNew", { scheme_name }, 24 * 3600);
}

export async function getPortfolioOverlap(scheme1: string, scheme2: string) {
  return ahFetch<any>(BASE, "getMutualfundPortfolioOverlap", { scheme1, scheme2 }, 24 * 3600);
}

// ──────────────────────────────────────────────────────────────────────────────
// Rolling returns / benchmark
// ──────────────────────────────────────────────────────────────────────────────

export async function getRollingReturnsVsBenchmark(p: { scheme: string; period: number; startdate?: string; enddate?: string }) {
  return ahFetch<any>(BASE, "getRollingReturnsVsBenchmark", p, 24 * 3600);
}

export async function getRollingReturnsMultipleSchemes(p: { scheme1: string; scheme2?: string; scheme3?: string; scheme4?: string; period: number }) {
  return ahFetch<any>(BASE, "getRollingReturnsMultipleSchemes", p, 24 * 3600);
}

export async function getBenchmarkPerformance() {
  return ahFetch<{ list: any[] }>(BASE, "getSchemeBenchmarkPerformance", {}, 6 * 3600);
}

// ──────────────────────────────────────────────────────────────────────────────
// Comparisons
// ──────────────────────────────────────────────────────────────────────────────

export async function getSchemePerformanceMultipleAmc(p: { schemes: string }) {
  // schemes = comma-separated list, per docs
  return ahFetch<{ list: any[] }>(BASE, "getSchemePerformanceMultipleAmc", p, 6 * 3600);
}

// ──────────────────────────────────────────────────────────────────────────────
// SIF (Specialized Investment Fund) — SEBI's new category
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Fetch the universe of SIF schemes. AdvisorKhoj's taxonomy may surface them
 * under one of several category labels (or not yet at all if they're very new).
 *
 * Strategy:
 *   1. Try known SIF category names via getSchemesByCategory
 *   2. Fall back to scanning the master scheme list and filtering by name/category
 *   3. Return a deduped list of { scheme_amfi, scheme_company, scheme_category }
 */
export async function getSIFSchemes(): Promise<Array<{ scheme_amfi: string; scheme_company: string; scheme_category: string; scheme_amfi_code?: string }>> {
  const candidates = [
    "Specialized Investment Fund",
    "SIF",
    "Equity: SIF",
    "Equity: Specialized Investment Fund",
    "Hybrid: SIF",
  ];

  const collected = new Map<string, { scheme_amfi: string; scheme_company: string; scheme_category: string; scheme_amfi_code?: string }>();

  // 1. Try category endpoints in parallel
  await Promise.all(
    candidates.map(async (cat) => {
      try {
        const r = await ahFetch<{ list?: string[] | any[] }>(BASE, "getAllMutualFundSchemesbyCategory", { category: cat }, 24 * 3600);
        const items = r.list || [];
        for (const x of items) {
          if (typeof x === "string") {
            collected.set(x, { scheme_amfi: x, scheme_company: "", scheme_category: cat });
          } else if (x && typeof x === "object") {
            const name = (x as any).scheme_amfi || (x as any).scheme_name || "";
            if (name) {
              collected.set(name, {
                scheme_amfi: name,
                scheme_company: (x as any).scheme_company || "",
                scheme_category: (x as any).scheme_category || cat,
                scheme_amfi_code: (x as any).scheme_amfi_code,
              });
            }
          }
        }
      } catch {
        // ignore — category may simply not exist
      }
    })
  );

  // 2. Fall back to master list scan
  if (collected.size === 0) {
    try {
      const master = await getAllSchemes();
      for (const s of master.scheme_list || []) {
        const blob = `${s.scheme_advisorkhoj_category || ""} ${s.scheme_amfi || ""}`;
        if (/\bSIF\b/i.test(blob) || /specialized\s+investment\s+fund/i.test(blob)) {
          collected.set(s.scheme_amfi, {
            scheme_amfi: s.scheme_amfi,
            scheme_company: s.scheme_company,
            scheme_category: s.scheme_advisorkhoj_category || "SIF",
            scheme_amfi_code: s.scheme_amfi_code,
          });
        }
      }
    } catch {
      // ignore
    }
  }

  return Array.from(collected.values()).filter((r) => !/\bdirect\b/i.test(r.scheme_amfi));
}

export { BASE as AH_BASE, MFBOX as AH_MFBOX };
