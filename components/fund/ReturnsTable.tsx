"use client";
import { formatNumberIN } from "@/lib/format";

type Row = { label: string; scheme?: number; benchmark?: number; category?: number };

export function ReturnsTable({ rows }: { rows: Row[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-soft">
      <div className="grid grid-cols-12 gap-3 border-b border-black/5 bg-cloud px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate2">
        <div className="col-span-3">Period</div>
        <div className="col-span-3 text-right">This fund</div>
        <div className="col-span-3 text-right">Benchmark</div>
        <div className="col-span-3 text-right">Category avg</div>
      </div>
      {rows.map((r) => (
        <div key={r.label} className="grid grid-cols-12 items-center gap-3 border-b border-black/5 px-6 py-4 last:border-0">
          <div className="col-span-3 text-sm font-medium text-graphite">{r.label}</div>
          <Cell v={r.scheme} bold />
          <Cell v={r.benchmark} />
          <Cell v={r.category} />
        </div>
      ))}
    </div>
  );
}

function Cell({ v, bold }: { v?: number; bold?: boolean }) {
  if (v == null || !Number.isFinite(v)) return <div className="col-span-3 text-right text-sm text-slate2">—</div>;
  const ok = v >= 0;
  return (
    <div className={`col-span-3 text-right tabular text-sm ${bold ? "font-bold" : "font-semibold"} ${ok ? "text-success" : "text-critical"}`}>
      {ok ? "+" : ""}{v.toFixed(2)}%
    </div>
  );
}
