"use client";
import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { formatINR } from "@/lib/format";
import { Button } from "@/components/ui/Button";

export default function SwpPage() {
  const [corpus, setCorpus] = useState(5000000);
  const [withdraw, setWithdraw] = useState(40000);
  const [rate, setRate] = useState(8);

  const { months, ending } = useMemo(() => {
    let value = corpus;
    const r = rate / 100 / 12;
    let m = 0;
    while (value > withdraw && m < 50 * 12) {
      value = (value - withdraw) * (1 + r);
      m += 1;
    }
    return { months: m, ending: Math.max(value, 0) };
  }, [corpus, withdraw, rate]);

  const yrs = Math.floor(months / 12);
  const mo = months % 12;

  return (
    <CalculatorShell eyebrow="Wealth · SWP" title="SWP Calculator" subtitle="How long will your corpus last with regular monthly withdrawals?">
      <div className="grid gap-8 rounded-2xl border border-black/[0.06] bg-white p-8 shadow-lift lg:grid-cols-2">
        <div className="space-y-6">
          <S label="Starting corpus" v={corpus} d={formatINR(corpus)} min={500000} max={50000000} step={50000} setV={setCorpus} />
          <S label="Monthly withdrawal" v={withdraw} d={formatINR(withdraw)} min={5000} max={500000} step={1000} setV={setWithdraw} />
          <S label="Expected return" v={rate} d={`${rate}% p.a.`} min={4} max={14} step={0.5} setV={setRate} />
        </div>
        <div className="rounded-2xl bg-mesh-soft p-8">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate2">Corpus lasts</div>
          <div className="mt-2 tabular text-4xl font-bold text-yale">{yrs} yrs {mo > 0 ? `${mo} mo` : ""}</div>
          <div className="mt-4 text-sm text-slate1">Ending balance: <span className="tabular font-semibold text-graphite">{formatINR(ending)}</span></div>
          <div className="mt-6"><Button href="/#contact">Start my retirement income →</Button></div>
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
