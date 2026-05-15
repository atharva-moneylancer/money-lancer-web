"use client";
import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { formatINR } from "@/lib/format";
import { Button } from "@/components/ui/Button";

export default function StepupSipPage() {
  const [amount, setAmount] = useState(10000);
  const [years, setYears] = useState(15);
  const [rate, setRate] = useState(12);
  const [step, setStep] = useState(10);

  const { total, invested } = useMemo(() => {
    let value = 0;
    let monthly = amount;
    let invested = 0;
    const r = rate / 100 / 12;
    for (let y = 0; y < years; y++) {
      for (let m = 0; m < 12; m++) {
        value = (value + monthly) * (1 + r);
        invested += monthly;
      }
      monthly = monthly * (1 + step / 100);
    }
    return { total: value, invested };
  }, [amount, years, rate, step]);

  return (
    <CalculatorShell eyebrow="Wealth · Step-up SIP" title="Step-up SIP Calculator" subtitle="What if you increased your SIP every year? Watch the compounding effect.">
      <div className="grid gap-8 rounded-2xl border border-black/[0.06] bg-white p-8 shadow-lift lg:grid-cols-2">
        <div className="space-y-6">
          <S label="Starting SIP" v={amount} d={formatINR(amount)} min={500} max={500000} step={500} setV={setAmount} />
          <S label="Annual step-up" v={step} d={`${step}%`} min={0} max={30} step={1} setV={setStep} />
          <S label="Years" v={years} d={`${years} years`} min={1} max={30} step={1} setV={setYears} />
          <S label="Return" v={rate} d={`${rate}% p.a.`} min={6} max={20} step={0.5} setV={setRate} />
        </div>
        <div className="rounded-2xl bg-mesh-soft p-8">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate2">Final value</div>
          <div className="mt-2 tabular text-4xl font-bold text-yale">{formatINR(total)}</div>
          <div className="mt-4 text-sm text-slate1">Total invested: <span className="tabular font-semibold text-graphite">{formatINR(invested)}</span></div>
          <div className="text-sm text-slate1">Wealth gained: <span className="tabular font-semibold text-success">{formatINR(total - invested)}</span></div>
          <div className="mt-6"><Button href="/#contact">Start investing →</Button></div>
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
