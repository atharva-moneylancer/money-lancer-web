"use client";
import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { Button } from "@/components/ui/Button";
import { formatINR } from "@/lib/format";

export default function RetirementPage() {
  const [age, setAge] = useState(32);
  const [retireAge, setRetireAge] = useState(60);
  const [monthlySpend, setMonthlySpend] = useState(50000);
  const [inflation, setInflation] = useState(6);
  const [postRate, setPostRate] = useState(8);
  const [growthRate, setGrowthRate] = useState(12);

  const { corpus, sip } = useMemo(() => {
    const years = retireAge - age;
    if (years <= 0) return { corpus: 0, sip: 0 };
    // Inflate monthly spend to retirement-year value
    const futureMonthly = monthlySpend * Math.pow(1 + inflation / 100, years);
    // Corpus needed for 25 years of withdrawals, real return = postRate - inflation
    const real = (postRate - inflation) / 100;
    const n = 25 * 12;
    const r = real / 12;
    const corpus = real <= 0
      ? futureMonthly * n
      : futureMonthly * ((1 - Math.pow(1 + r, -n)) / r);
    // Required monthly SIP to reach corpus
    const N = years * 12;
    const g = growthRate / 100 / 12;
    const sip = corpus / (((Math.pow(1 + g, N) - 1) / g) * (1 + g));
    return { corpus, sip };
  }, [age, retireAge, monthlySpend, inflation, postRate, growthRate]);

  return (
    <CalculatorShell eyebrow="Goals · Retirement" title="Retirement Corpus Calculator" subtitle="How big a corpus do you need, and what monthly SIP gets you there?">
      <div className="grid gap-8 rounded-2xl border border-black/[0.06] bg-white p-8 shadow-lift lg:grid-cols-2">
        <div className="space-y-5">
          <S label="Current age" v={age} d={`${age} yrs`} min={18} max={60} step={1} setV={setAge} />
          <S label="Retirement age" v={retireAge} d={`${retireAge} yrs`} min={45} max={75} step={1} setV={setRetireAge} />
          <S label="Today's monthly expenses" v={monthlySpend} d={formatINR(monthlySpend)} min={10000} max={500000} step={5000} setV={setMonthlySpend} />
          <S label="Inflation" v={inflation} d={`${inflation}% p.a.`} min={2} max={12} step={0.5} setV={setInflation} />
          <S label="Post-retirement return" v={postRate} d={`${postRate}% p.a.`} min={4} max={12} step={0.5} setV={setPostRate} />
          <S label="Growth phase return" v={growthRate} d={`${growthRate}% p.a.`} min={6} max={18} step={0.5} setV={setGrowthRate} />
        </div>
        <div className="rounded-2xl bg-mesh-soft p-8">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate2">Retirement corpus needed</div>
          <div className="mt-2 tabular text-3xl font-bold text-yale">{formatINR(corpus)}</div>
          <div className="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate2">Required monthly SIP</div>
          <div className="mt-1 tabular text-3xl font-bold text-crayola">{formatINR(sip)}</div>
          <p className="mt-4 text-sm text-slate1">
            Based on a 25-year retirement, inflation-adjusted withdrawals, and equity-led growth phase.
          </p>
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
      <div className="flex items-baseline justify-between"><label className="text-sm font-medium text-graphite">{label}</label><span className="tabular text-sm font-semibold text-yale">{d}</span></div>
      <input type="range" className="brand-slider mt-2 w-full" min={min} max={max} step={step} value={v} onChange={(e) => setV(+e.target.value)} style={{ ["--p" as any]: `${pct}%` }} />
    </div>
  );
}
