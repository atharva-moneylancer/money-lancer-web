"use client";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { formatINR } from "@/lib/format";

export function MiniSipCalc({ inceptionReturn }: { inceptionReturn?: number }) {
  const [amount, setAmount] = useState(10000);
  const [years, setYears] = useState(10);
  const rate = inceptionReturn ?? 12;
  const total = useMemo(() => {
    const n = years * 12;
    const r = rate / 100 / 12;
    return amount * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  }, [amount, years, rate]);
  const invested = amount * years * 12;

  return (
    <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-soft">
      <div className="flex items-baseline justify-between">
        <h3 className="text-title-s font-semibold text-ink">What if you'd SIP'd here?</h3>
        <span className="text-[11px] text-slate2">@ {rate.toFixed(1)}% p.a.</span>
      </div>

      <div className="mt-5 space-y-4">
        <Slider label="Monthly SIP" value={formatINR(amount)} min={500} max={200000} step={500} v={amount} setV={setAmount} />
        <Slider label="Years" value={`${years} years`} min={1} max={25} step={1} v={years} setV={setYears} />
      </div>

      <div className="mt-6 rounded-xl bg-cloud p-5">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate2">Projected value</div>
        <div className="mt-1 tabular text-2xl font-bold text-yale">{formatINR(total)}</div>
        <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
          <div>Invested: <span className="tabular font-semibold text-graphite">{formatINR(invested)}</span></div>
          <div>Gained: <span className="tabular font-semibold text-success">{formatINR(total - invested)}</span></div>
        </div>
      </div>

      <Button className="mt-5 w-full" href="/#contact">Start this SIP →</Button>
      <p className="mt-3 text-[11px] text-slate2 leading-relaxed">
        Illustration based on fund's since-inception return. Past performance is not indicative of future returns.
      </p>
    </div>
  );
}

function Slider({ label, value, min, max, step, v, setV }: any) {
  const pct = ((v - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between"><label className="text-sm font-medium text-graphite">{label}</label><span className="tabular text-sm font-semibold text-yale">{value}</span></div>
      <input type="range" className="brand-slider mt-2 w-full" min={min} max={max} step={step} value={v} onChange={(e) => setV(+e.target.value)} style={{ ["--p" as any]: `${pct}%` }} />
    </div>
  );
}
