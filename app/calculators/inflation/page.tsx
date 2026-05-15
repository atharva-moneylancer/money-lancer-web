"use client";
import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { Slider, StatRow, TwoCol, CalcNote } from "@/components/calculator/CalcUI";
import { formatINR } from "@/lib/format";
import { Button } from "@/components/ui/Button";

export default function InflationPage() {
  const [amount, setAmount] = useState(100000);
  const [inflation, setInflation] = useState(6);
  const [years, setYears] = useState(10);
  const [investReturn, setInvestReturn] = useState(12);

  const result = useMemo(() => {
    const futureValueNeeded = amount * Math.pow(1 + inflation / 100, years);
    const realValueOfToday = amount / Math.pow(1 + inflation / 100, years);
    const purchasingPowerLoss = amount - realValueOfToday;
    // Investment growth without inflation adjustment
    const nominalGrowth = amount * Math.pow(1 + investReturn / 100, years);
    // Real return = (1 + nominal) / (1 + inflation) - 1
    const realReturn = (1 + investReturn / 100) / (1 + inflation / 100) - 1;
    const realGrowth = amount * Math.pow(1 + realReturn, years);
    return {
      futureValueNeeded,
      realValueOfToday,
      purchasingPowerLoss,
      nominalGrowth,
      realGrowth,
      realReturn: realReturn * 100,
    };
  }, [amount, inflation, years, investReturn]);

  return (
    <CalculatorShell
      eyebrow="Planning · Inflation"
      title="Inflation Impact Calculator"
      subtitle="See how inflation erodes purchasing power over time — and how much your investments must earn to stay ahead."
    >
      <TwoCol>
        <div className="space-y-6">
          <Slider label="Today's value / expense" min={10000} max={10000000} step={10000} value={amount} setValue={setAmount} display={formatINR(amount, { compact: true })} minLabel="₹10K" maxLabel="₹1 Cr" />
          <Slider label="Inflation rate" min={2} max={12} step={0.5} value={inflation} setValue={setInflation} display={`${inflation}% p.a.`} minLabel="2%" maxLabel="12%" />
          <Slider label="Time horizon" min={1} max={40} step={1} value={years} setValue={setYears} display={`${years} years`} minLabel="1 yr" maxLabel="40 yrs" />
          <Slider label="Expected investment return" min={5} max={20} step={0.5} value={investReturn} setValue={setInvestReturn} display={`${investReturn}% p.a.`} minLabel="5%" maxLabel="20%" />
          <CalcNote>
            India&apos;s average CPI inflation has been ~5–6% over the last decade. Food and
            education inflate faster — plan for 7–8% for those specific goals.
          </CalcNote>
        </div>

        <div className="rounded-2xl bg-mesh-soft p-6 lg:p-8">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate2">
            You&apos;ll need in {years} years
          </div>
          <div className="mt-2 tabular text-4xl font-bold text-yale">
            {formatINR(result.futureValueNeeded, { compact: true })}
          </div>
          <div className="mt-1 text-sm text-slate1">
            to match today&apos;s {formatINR(amount, { compact: true })} in value
          </div>

          <div className="mt-8 space-y-3">
            <StatRow label="Purchasing power lost" value={formatINR(result.purchasingPowerLoss, { compact: true })} swatch="bg-critical/60" accent="critical" />
            <StatRow label="Nominal investment value" value={formatINR(result.nominalGrowth, { compact: true })} swatch="bg-mist" />
            <StatRow label="Real (inflation-adjusted) value" value={formatINR(result.realGrowth, { compact: true })} swatch="bg-crayola" accent={result.realGrowth >= result.futureValueNeeded ? "success" : "critical"} />
            <StatRow label="Real return rate" value={`${result.realReturn.toFixed(2)}% p.a.`} accent={result.realReturn > 0 ? "success" : "critical"} />
          </div>

          <div className="mt-8 flex gap-3">
            <Button href="/#contact">Inflation-proof my portfolio →</Button>
            <Button variant="secondary" href="/calculators">All calculators</Button>
          </div>
        </div>
      </TwoCol>
    </CalculatorShell>
  );
}
