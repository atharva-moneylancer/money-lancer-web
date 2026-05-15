"use client";
import { formatNumberIN } from "@/lib/format";

export function HoldingsBlock({
  top,
  sectors,
}: {
  top: Array<{ name: string; pct: number }>;
  sectors: Array<{ name: string; pct: number }>;
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card title="Top holdings" rows={top.slice(0, 10)} />
      <Card title="Sector allocation" rows={sectors.slice(0, 10)} colorBy />
    </div>
  );
}

function Card({ title, rows, colorBy }: { title: string; rows: Array<{ name: string; pct: number }>; colorBy?: boolean }) {
  const max = Math.max(1, ...rows.map((r) => r.pct));
  const palette = ["bg-crayola", "bg-yale", "bg-electric", "bg-spring", "bg-gold", "bg-slate1", "bg-mist", "bg-crayola/70", "bg-yale/70", "bg-electric/70"];
  return (
    <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-soft">
      <h3 className="text-title-s font-semibold text-ink">{title}</h3>
      <div className="mt-4 space-y-2.5">
        {rows.length === 0 && <div className="text-sm text-slate2">Not available.</div>}
        {rows.map((r, i) => (
          <div key={r.name} className="text-sm">
            <div className="flex items-center justify-between">
              <span className="truncate pr-3 text-graphite">{r.name}</span>
              <span className="tabular font-semibold text-yale">{r.pct.toFixed(2)}%</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-cloud">
              <div className={`h-full rounded-full ${colorBy ? palette[i % palette.length] : "bg-crayola"}`} style={{ width: `${(r.pct / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
