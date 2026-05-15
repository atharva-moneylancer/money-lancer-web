"use client";

const LEVELS = ["Low", "Low to Moderate", "Moderate", "Moderately High", "High", "Very High"];

export function RiskMeter({ value }: { value: string }) {
  const idx = Math.max(0, LEVELS.findIndex((l) => l.toLowerCase() === (value || "").toLowerCase()));
  const pct = ((idx + 0.5) / LEVELS.length) * 100;
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate2">Riskometer</div>
      <div className="mt-3 relative h-3 w-full overflow-hidden rounded-full bg-gradient-to-r from-spring via-gold to-critical">
        <div
          className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-yale shadow-lift"
          style={{ left: `${pct}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-slate2">
        <span>Low</span>
        <span>Very High</span>
      </div>
      <div className="mt-2 text-sm font-semibold text-ink">{value || "—"}</div>
    </div>
  );
}
