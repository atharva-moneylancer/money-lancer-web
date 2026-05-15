"use client";

type Stat = {
  label: string;
  value: string | null;
  description: string;
  higherIsBetter?: boolean;
  lowerIsBetter?: boolean;
};

function extract(obj: Record<string, unknown>, ...keys: string[]): unknown {
  for (const k of keys) {
    if (obj[k] !== undefined && obj[k] !== null && obj[k] !== "" && obj[k] !== "N/A") {
      return obj[k];
    }
  }
  return null;
}

function fmt(v: unknown, decimals = 2): string | null {
  if (v === null || v === undefined) return null;
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  return n.toFixed(decimals);
}

function fmtPct(v: unknown, decimals = 2): string | null {
  const s = fmt(v, decimals);
  return s ? `${s}%` : null;
}

function valueColor(
  value: string | null,
  higherIsBetter?: boolean,
  lowerIsBetter?: boolean
): string {
  if (!value || value === "—") return "text-slate2";
  const n = Number(value.replace("%", ""));
  if (!Number.isFinite(n)) return "text-yale";
  if (higherIsBetter) return n > 0 ? "text-success" : n < 0 ? "text-critical" : "text-yale";
  if (lowerIsBetter) return n < 1 ? "text-success" : n > 1.5 ? "text-critical" : "text-yale";
  return "text-yale";
}

export function RiskStatsBlock({
  volatility,
  capture,
}: {
  volatility: Record<string, unknown> | null;
  capture: Record<string, unknown> | null;
}) {
  // Flatten nested list arrays if the API wraps data in { list: [...] }
  const v: Record<string, unknown> =
    (Array.isArray((volatility as any)?.list)
      ? (volatility as any).list[0]
      : volatility) || {};
  const c: Record<string, unknown> =
    (Array.isArray((capture as any)?.list)
      ? (capture as any).list[0]
      : capture) || {};

  const merged = { ...v, ...c };

  const stats: Stat[] = [
    {
      label: "Sharpe Ratio",
      value: fmt(extract(merged, "sharpe_ratio", "sharpe", "sharpeRatio")),
      description: "Risk-adjusted return · higher = better",
      higherIsBetter: true,
    },
    {
      label: "Sortino Ratio",
      value: fmt(extract(merged, "sortino_ratio", "sortino", "sortinoRatio")),
      description: "Downside risk-adjusted · higher = better",
      higherIsBetter: true,
    },
    {
      label: "Std Deviation",
      value: fmtPct(
        extract(merged, "standard_deviation", "std_deviation", "stddev", "volatility")
      ),
      description: "Annualised return volatility",
      lowerIsBetter: true,
    },
    {
      label: "Beta",
      value: fmt(extract(merged, "beta")),
      description: "Market sensitivity · 1 = moves with market",
    },
    {
      label: "Alpha",
      value: fmtPct(extract(merged, "alpha")),
      description: "Excess return vs benchmark",
      higherIsBetter: true,
    },
    {
      label: "R²",
      value: fmt(extract(merged, "r_squared", "r2", "rsquared", "r_square")),
      description: "Correlation with benchmark",
    },
    {
      label: "Upside Capture",
      value: fmtPct(
        extract(merged, "upside_capture", "upside_capture_ratio", "upsideCapture")
      ),
      description: "% of benchmark upside captured",
      higherIsBetter: true,
    },
    {
      label: "Downside Capture",
      value: fmtPct(
        extract(merged, "downside_capture", "downside_capture_ratio", "downsideCapture")
      ),
      description: "% of benchmark downside captured · lower = better",
      lowerIsBetter: true,
    },
  ];

  const hasAnyData = stats.some((s) => s.value !== null);
  if (!hasAnyData) return null;

  return (
    <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-soft">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate2">
            Risk Statistics
          </div>
          <div className="mt-0.5 text-xs text-slate2">3-year rolling · vs benchmark</div>
        </div>
        <span className="rounded-full border border-black/[0.06] bg-cloud px-2.5 py-1 text-[10px] font-medium text-slate2">
          AdvisorKhoj
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
        {stats.map((s) => {
          const color = valueColor(s.value, s.higherIsBetter, s.lowerIsBetter);
          return (
            <div key={s.label}>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate2">
                {s.label}
              </div>
              <div className={`mt-1 tabular text-xl font-bold ${color}`}>
                {s.value ?? "—"}
              </div>
              <div className="mt-0.5 text-[10px] leading-tight text-slate2">
                {s.description}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-5 flex flex-wrap gap-4 border-t border-black/[0.06] pt-4 text-[10px] text-slate2">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-success" />
          Favourable
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-critical" />
          Unfavourable
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-yale" />
          Neutral / informational
        </span>
      </div>
    </div>
  );
}
