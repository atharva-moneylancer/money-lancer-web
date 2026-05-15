"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { CompanyLogo } from "@/components/fund/CompanyLogo";
import { formatNumberIN } from "@/lib/format";

type Fund = {
  scheme_amfi: string;
  scheme_amfi_short_name?: string;
  scheme_company?: string;
  scheme_company_short_name?: string;
  scheme_category?: string;
  price?: number;
  ter?: number;
  returns_abs_1year?: number;
  returns_cmp_3year?: number;
  returns_cmp_5year?: number;
};

type SortKey = "1y" | "3y" | "5y" | "ter";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "1y", label: "1Y Return" },
  { key: "3y", label: "3Y Return" },
  { key: "5y", label: "5Y Return" },
  { key: "ter", label: "Lowest TER" },
];

export function FundsListClient({
  funds,
  category,
}: {
  funds: Fund[];
  category: string;
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("1y");

  const filtered = useMemo(() => {
    // Normalise: lowercase, replace & → and, collapse non-alphanumeric to spaces
    const normalize = (s: string) =>
      s.toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, " ")
        .trim();

    const tokens = normalize(query).split(" ").filter(Boolean);

    const list = tokens.length
      ? funds.filter((f) => {
          const name = normalize(f.scheme_amfi_short_name || f.scheme_amfi || "");
          const company = normalize(f.scheme_company_short_name || f.scheme_company || "");
          // every token must appear in either the fund name or AMC name
          return tokens.every((t) => name.includes(t) || company.includes(t));
        })
      : funds;

    return [...list].sort((a, b) => {
      if (sort === "1y")
        return (b.returns_abs_1year ?? -999) - (a.returns_abs_1year ?? -999);
      if (sort === "3y")
        return (b.returns_cmp_3year ?? -999) - (a.returns_cmp_3year ?? -999);
      if (sort === "5y")
        return (b.returns_cmp_5year ?? -999) - (a.returns_cmp_5year ?? -999);
      if (sort === "ter") return (a.ter ?? 999) - (b.ter ?? 999);
      return 0;
    });
  }, [funds, query, sort]);

  return (
    <div>
      {/* Search + Sort bar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search input */}
        <div className="relative w-full sm:max-w-sm">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by fund or AMC name…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white py-2.5 pl-9 pr-9 text-sm text-graphite placeholder:text-slate2 focus:border-crayola focus:outline-none focus:ring-2 focus:ring-crayola/20"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate2 hover:text-graphite"
              aria-label="Clear search"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Sort pills — hidden in "all" mode since we only have NAV data there */}
        {category !== "all" && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-xs font-medium text-slate2">Sort:</span>
            {SORT_OPTIONS.map((o) => (
              <button
                key={o.key}
                onClick={() => setSort(o.key)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  sort === o.key
                    ? "bg-crayola text-white"
                    : "border border-black/10 bg-white text-graphite hover:border-crayola hover:text-crayola"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Result count / hint */}
      <div className="mb-3 flex items-center justify-between gap-4">
        <p className="text-xs text-slate2">
          {query
            ? `${filtered.length} of ${funds.length} funds`
            : `${funds.length} funds`}
        </p>
        {category === "all" && !query && (
          <p className="text-xs text-slate2">
            Showing a sample — search by name, or pick a category tab for full results.
          </p>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-soft">
        {/* Header */}
        <div className="grid grid-cols-12 gap-3 border-b border-black/5 bg-cloud px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate2">
          <div className="col-span-5">Scheme</div>
          <div className="col-span-2 text-right">NAV</div>
          <div
            className={`col-span-1 text-right ${sort === "1y" ? "text-crayola" : ""}`}
          >
            1Y
          </div>
          <div
            className={`col-span-1 text-right ${sort === "3y" ? "text-crayola" : ""}`}
          >
            3Y
          </div>
          <div
            className={`col-span-1 text-right ${sort === "5y" ? "text-crayola" : ""}`}
          >
            5Y
          </div>
          <div
            className={`col-span-2 text-right ${sort === "ter" ? "text-crayola" : ""}`}
          >
            TER
          </div>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="px-6 py-12 text-center text-sm text-slate2">
            No funds match "
            <span className="font-semibold text-graphite">{query}</span>"
          </div>
        )}

        {/* Rows */}
        {filtered.map((r) => (
          <Link
            key={r.scheme_amfi}
            href={`/funds/${encodeURIComponent(r.scheme_amfi)}`}
            className="grid grid-cols-12 items-center gap-3 border-b border-black/5 px-6 py-5 transition-colors last:border-0 hover:bg-cloud"
          >
            <div className="col-span-5 flex items-center gap-3">
              <CompanyLogo company={r.scheme_company || ""} />
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-ink">
                  {r.scheme_amfi_short_name || r.scheme_amfi}
                </div>
                <div className="mt-1 text-xs text-slate2">
                  {r.scheme_company_short_name || r.scheme_company} ·{" "}
                  {r.scheme_category}
                </div>
              </div>
            </div>
            <div className="col-span-2 text-right tabular text-sm font-semibold text-graphite">
              ₹{formatNumberIN(r.price ?? 0, 2)}
            </div>
            <Ret v={r.returns_abs_1year} active={sort === "1y"} />
            <Ret v={r.returns_cmp_3year} active={sort === "3y"} />
            <Ret v={r.returns_cmp_5year} active={sort === "5y"} />
            <div
              className={`col-span-2 text-right tabular text-sm ${
                sort === "ter"
                  ? "font-semibold text-graphite"
                  : "text-slate1"
              }`}
            >
              {r.ter ? `${r.ter.toFixed(2)}%` : "—"}
            </div>
          </Link>
        ))}
      </div>

      {/* Footer link — only shown for specific categories, not for "all" */}
      {filtered.length > 0 && category !== "all" && (
        <div className="mt-4 text-center text-xs text-slate2">
          <Link
            href={`/funds/category/${encodeURIComponent(category)}`}
            className="font-semibold text-crayola hover:underline"
          >
            See full {category} page →
          </Link>
        </div>
      )}
    </div>
  );
}

function Ret({ v, active }: { v?: number; active?: boolean }) {
  if (v == null)
    return (
      <div className="col-span-1 text-right text-sm text-slate2">—</div>
    );
  const ok = v >= 0;
  return (
    <div
      className={`col-span-1 text-right tabular text-sm font-semibold ${
        ok ? "text-success" : "text-critical"
      } ${active ? "underline decoration-dotted underline-offset-2" : ""}`}
    >
      {ok ? "+" : ""}
      {v.toFixed(1)}%
    </div>
  );
}
