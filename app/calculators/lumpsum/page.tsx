"use client";
import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { Button } from "@/components/ui/Button";
import { formatINR } from "@/lib/format";

export default function LumpsumPage() {
  const [amount, setAmount] = useState(500000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(12);
  const total = useMemo(() => amount * Math.pow(1 + rate / 100, years), [amount, rate, years]);

  return (
    <CalculatorShell eyebrow="Wealth · Lumpsum" title="Lumpsum Calculator" subtitle="Project the future value of a one-time investment compounded annually.">
      <div className="grid gap-8 rounded-2xl border border-black/[0.06] bg-white p-8 shadow-lift lg:grid-cols-2">
        <div className="space-y-6">
          <S label="Invested" v={amount} d={formatINR(amount)} min={10000} max={10000000} step={10000} setV={setAmount} />
          <S label="Years" v={years} d={`${years} years`} min={1} max={30} step={1} setV={setYears} />
          <S label="Expected return" v={rate} d={`${rate}% p.a.`} min={1} max={30} step={1} setV={setRate} />
        </div>
        <div className="rounded-2xl bg-mesh-soft p-8">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate2">Future value</div>
          <div className="mt-2 tabular text-4xl font-bold text-yale">{formatINR(total)}</div>
          <div className="mt-1 text-sm text-slate1">in {years} years</div>
          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div>Invested<div className="tabular font-semibold text-graphite">{formatINR(amount)}</div></div>
            <div>Gained<div className="tabular font-semibold text-success">{formatINR(total - amount)}</div></div>
          </div>
          <div className="mt-8"><Button href="/#contact">Talk to an advisor →</Button></div>
        </div>
      </div>
    </CalculatorShell>
  );
}
function S({ label, v, d, min, max, step, setV }: any) {
  const pct = ((v - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between"><label className="text-sm font-medium text-graphite">{label}</label><span className="tabular font-semibold text-yale">{d}</span></div>
      <input type="range" className="brand-slider mt-2 w-full" min={min} max={max} step={step} value={v} onChange={(e) => setV(+e.target.value)} style={{ ["--p" as any]: `${pct}%` }} />
    </div>
  );
}
