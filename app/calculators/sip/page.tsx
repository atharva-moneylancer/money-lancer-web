"use client";
import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { Button } from "@/components/ui/Button";
import { formatINR } from "@/lib/format";

export default function SipCalculatorPage() {
  const [amount, setAmount] = useState(10000);
  const [years, setYears] = useState(15);
  const [rate, setRate] = useState(12);

  const { invested, total, returns } = useMemo(() => {
    const n = years * 12;
    const r = rate / 100 / 12;
    const fv = amount * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const inv = amount * n;
    return { invested: inv, total: fv, returns: fv - inv };
  }, [amount, years, rate]);

  return (
    <CalculatorShell
      eyebrow="Wealth · SIP"
      title="SIP Returns Calculator"
      subtitle="Project the future value of a monthly SIP. Adjust the sliders to model different scenarios."
    >
      <div className="grid gap-8 rounded-2xl border border-black/[0.06] bg-white p-8 shadow-lift lg:grid-cols-2">
        <div className="space-y-6">
          <Slider label="Monthly investment" min={500} max={500000} step={500} value={amount} setValue={setAmount} display={formatINR(amount)} />
          <Slider label="Duration" min={1} max={30} step={1} value={years} setValue={setYears} display={`${years} years`} />
          <Slider label="Expected return" min={1} max={30} step={1} value={rate} setValue={setRate} display={`${rate}% p.a.`} />

          <div className="rounded-xl bg-cloud p-4 text-sm text-slate1">
            <strong className="text-graphite">Note:</strong> Equity-oriented mutual funds historically delivered
            10–14% CAGR over long horizons. Past performance is not indicative of future returns.
          </div>
        </div>

        <div className="rounded-2xl bg-mesh-soft p-6 lg:p-8">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate2">Projected value</div>
          <div className="mt-2 tabular text-4xl font-bold text-yale">{formatINR(total)}</div>
          <div className="mt-1 text-sm text-slate1">in {years} years</div>

          <div className="mt-8 space-y-3">
            <Stat label="Total invested" value={formatINR(invested)} swatch="bg-mist" />
            <Stat label="Wealth gained" value={formatINR(returns)} swatch="bg-crayola" />
          </div>

          <div className="mt-8 flex gap-3">
            <Button href="/#contact">Start this SIP →</Button>
            <Button variant="secondary" href="/funds">Pick a fund</Button>
          </div>
        </div>
      </div>
    </CalculatorShell>
  );
}

function Slider({ label, min, max, step, value, setValue, display }: { label: string; min: number; max: number; step: number; value: number; setValue: (n: number) => void; display: string }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-medium text-graphite">{label}</label>
        <span className="tabular text-base font-semibold text-yale">{display}</span>
      </div>
      <input
        type="range"
        className="brand-slider mt-2 w-full"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setValue(+e.target.value)}
        style={{ ["--p" as any]: `${pct}%` }}
      />
      <div className="mt-1 flex justify-between text-[11px] text-slate2">
        <span>{label === "Monthly investment" ? "₹500" : label === "Duration" ? "1 yr" : "1%"}</span>
        <span>{label === "Monthly investment" ? "₹5L" : label === "Duration" ? "30 yrs" : "30%"}</span>
      </div>
    </div>
  );
}

function Stat({ label, value, swatch }: { label: string; value: string; swatch: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-slate1">
        <span className={`inline-block h-2.5 w-2.5 rounded-full ${swatch}`} />
        {label}
      </div>
      <span className="tabular text-base font-semibold text-graphite">{value}</span>
    </div>
  );
}
