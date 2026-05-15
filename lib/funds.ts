/**
 * Helpers for the Regular vs Direct plan distinction.
 *
 * Money Lancer is an AMFI-registered Mutual Fund Distributor — we earn trail
 * commission only on Regular plans, so the website shows Regular plans only
 * throughout. Direct plans are for DIY investors who transact directly with
 * the AMC.
 *
 * AdvisorKhoj returns both Direct and Regular variants of every scheme. We
 * filter at the page/component layer using these helpers so all list views
 * stay consistent.
 */

/**
 * True if a scheme name looks like a Direct Plan.
 *
 * Direct plans always contain the word "direct" in their canonical name:
 *   "HDFC Top 100 Fund - Direct Plan-Growth"
 *   "ICICI Prudential Bluechip Fund - Direct - Growth"
 *   "HDFC Top 100 Fund - Direct Plan - IDCW"
 *
 * We match the whole-word "direct" (case-insensitive) which avoids false
 * positives from words like "Director" or "Indirect" (neither appears in
 * Indian MF scheme names anyway, but the whole-word boundary is safer).
 */
export function isDirectPlan(name: string): boolean {
  if (!name) return false;
  return /\bdirect\b/i.test(name);
}

/** Inverse — true for Regular plans (and any scheme without a plan suffix). */
export function isRegularPlan(name: string): boolean {
  return !isDirectPlan(name);
}

/**
 * Filter a list of API rows to Regular-only.
 * Tolerant — falls back to obvious fields when `scheme_amfi` is missing.
 */
export function regularOnly<T extends Record<string, any>>(rows: T[] | undefined | null): T[] {
  if (!rows) return [];
  return rows.filter((r) => {
    const name = r.scheme_amfi || r.scheme_name || r.scheme_amfi_short_name || "";
    return isRegularPlan(name);
  });
}

/**
 * True if the row looks like a Specialized Investment Fund (SEBI's new
 * category, launched 2024). AdvisorKhoj surfaces SIFs in one of two ways:
 *   - scheme_advisorkhoj_category contains "SIF" or "Specialized Investment"
 *   - the scheme name itself includes the words
 */
export function isSIF(row: Record<string, any>): boolean {
  const cat = String(row.scheme_advisorkhoj_category || row.scheme_category || row.category || "");
  const name = String(row.scheme_amfi || row.scheme_name || row.scheme_amfi_short_name || "");
  const blob = `${cat} ${name}`;
  return /\bSIF\b/i.test(blob) || /specialized\s+investment\s+fund/i.test(blob);
}

/** Convenience filter for SIF-only rows. */
export function sifOnly<T extends Record<string, any>>(rows: T[] | undefined | null): T[] {
  if (!rows) return [];
  return rows.filter(isSIF).filter((r) => {
    const name = r.scheme_amfi || r.scheme_name || r.scheme_amfi_short_name || "";
    return isRegularPlan(name);
  });
}
