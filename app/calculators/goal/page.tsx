"use client";
import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { Button } from "@/components/ui/Button";
import { formatINR } from "@/lib/format";

export default function GoalPage() {
  const [goal, setGoal] = useState(2500000);
  const [years, setYears] = useState(8);
  const [rate, setRate] = useState(12);
  const sip = useMemo(() => {
    const n = years * 12;
    const r = rate / 100 / 12;
    return goal / (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
  }, [goal, years, rate]);

  return (
    <CalculatorShell eyebrow="Goals · Target" title="Goal Calculator" subtitle="What monthly SIP gets you to your target by your deadline?">
      <div className="grid gap-8 rounded-2xl border border-black/[0.06] bg-white p-8 shadow-lift lg:grid-cols-2">
        <div className="space-y-6">
          <S label="Target amount" v={goal} d={formatINR(goal)} min={100000} max={50000000} step={100000} setV={setGoal} />
          <S label="Years to goal" v={years} d={`${years} years`} min={1} max={30} step={1} setV={setYears} />
          <S label="Expected return" v={rate} d={`${rate}% p.a.`} min={6} max={20} step={0.5} setV={setRate} />
        </div>
        <div className="rounded-2xl bg-mesh-soft p-8">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate2">Required monthly SIP</div>
          <div className="mt-2 tabular text-4xl font-bold text-crayola">{formatINR(sip)}</div>
          <p className="mt-3 text-sm text-slate1">to reach {formatINR(goal)} in {years} years.</p>
          <div className="mt-8"><Button href="/#contact">Set up this SIP →</Button></div>
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
