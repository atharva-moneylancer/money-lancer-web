"use client";
import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { Slider, StatRow, TwoCol, CalcNote } from "@/components/calculator/CalcUI";
import { formatINR } from "@/lib/format";
import { Button } from "@/components/ui/Button";

export default function HomeDownPaymentPage() {
  const [homeValue, setHomeValue] = useState(8000000);
  const [downPctTarget, setDownPctTarget] = useState(20);
  const [years, setYears] = useState(5);
  const [currentSavings, setCurrentSavings] = useState(500000);
  const [returnRate, setReturnRate] = useState(10);
  const [appreciation, setAppreciation] = useState(8);

  const result = useMemo(() => {
    const futureHomeValue = homeValue * Math.pow(1 + appreciation / 100, years);
    const downPaymentNeeded = futureHomeValue * (downPctTarget / 100);
    const registrationCosts = futureHomeValue * 0.07; // stamp duty + registration ~7%

    const totalTarget = downPaymentNeeded + registrationCosts;

    const monthlyRate = returnRate / 100 / 12;
    const n = years * 12;

    // FV of current savings
    const fvCurrentSavings = currentSavings * Math.pow(1 + returnRate / 100, years);

    // Monthly SIP needed to bridge gap
    const gap = Math.max(0, totalTarget - fvCurrentSavings);
    const sipNeeded =
      gap > 0
        ? gap / (((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate) * (1 + monthlyRate))
        : 0;

    const loanAmount = futureHomeValue - downPaymentNeeded;
    const loanEmi = (() => {
      const r = 9 / 100 / 12; // assumed 9% home loan
      const nEmi = 20 * 12;
      return (loanAmount * r * Math.pow(1 + r, nEmi)) / (Math.pow(1 + r, nEmi) - 1);
    })();

    return {
      futureHomeValue,
      downPaymentNeeded,
      registrationCosts,
      totalTarget,
      fvCurrentSavings,
      sipNeeded,
      loanAmount,
      loanEmi,
      gap,
    };
  }, [homeValue, downPctTarget, years, currentSavings, returnRate, appreciation]);

  return (
    <CalculatorShell
      eyebrow="Goals · Home"
      title="Home Down-Payment Calculator"
      subtitle="Plan your down payment savings, estimate stamp duty & registration costs, and calculate the home loan you'll need."
    >
      <TwoCol>
        <div className="space-y-6">
          <Slider label="Current home value / target" min={1000000} max={100000000} step={500000} value={homeValue} setValue={setHomeValue} display={formatINR(homeValue, { compact: true })} minLabel="₹10L" maxLabel="₹10 Cr" />
          <Slider label="Down payment %" min={10} max={40} step={5} value={downPctTarget} setValue={setDownPctTarget} display={`${downPctTarget}%`} minLabel="10%" maxLabel="40%" />
          <Slider label="Years to purchase" min={1} max={15} step={1} value={years} setValue={setYears} display={`${years} years`} minLabel="1 yr" maxLabel="15 yrs" />
          <Slider label="Current savings earmarked" min={0} max={5000000} step={50000} value={currentSavings} setValue={setCurrentSavings} display={formatINR(currentSavings, { compact: true })} minLabel="₹0" maxLabel="₹50L" />
          <Slider label="Expected investment return" min={6} max={15} step={0.5} value={returnRate} setValue={setReturnRate} display={`${returnRate}% p.a.`} minLabel="6%" maxLabel="15%" />
          <Slider label="Property price appreciation" min={3} max={15} step={1} value={appreciation} setValue={setAppreciation} display={`${appreciation}% p.a.`} minLabel="3%" maxLabel="15%" />
          <CalcNote>
            Stamp duty and registration estimated at ~7% of property value. Actual rates vary by
            state. Home loan EMI assumed at 9% for 20 years on remaining loan amount.
          </CalcNote>
        </div>

        <div className="rounded-2xl bg-mesh-soft p-6 lg:p-8">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate2">
            Monthly SIP needed
          </div>
          <div className="mt-2 tabular text-4xl font-bold text-yale">
            {result.sipNeeded > 0 ? formatINR(result.sipNeeded) : "You're covered!"}
          </div>
          <div className="mt-1 text-sm text-slate1">to build the down payment in {years} years</div>

          <div className="mt-8 space-y-3">
            <StatRow label={`Future home value (${appreciation}% p.a.)`} value={formatINR(result.futureHomeValue, { compact: true })} />
            <StatRow label={`Down payment (${downPctTarget}%)`} value={formatINR(result.downPaymentNeeded, { compact: true })} swatch="bg-crayola" />
            <StatRow label="Stamp duty + registration (~7%)" value={formatINR(result.registrationCosts, { compact: true })} swatch="bg-mist" />
            <div className="border-t border-black/10 pt-2">
              <StatRow label="Total cash needed" value={formatINR(result.totalTarget, { compact: true })} />
              <StatRow label="Savings growth by then" value={formatINR(result.fvCurrentSavings, { compact: true })} accent="success" />
            </div>
            <div className="border-t border-black/10 pt-2">
              <StatRow label="Home loan required" value={formatINR(result.loanAmount, { compact: true })} />
              <StatRow label="Est. EMI (9%, 20 yrs)" value={formatINR(result.loanEmi)} />
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <Button href="/#contact">Start saving for home →</Button>
            <Button variant="secondary" href="/calculators/emi">EMI Calculator</Button>
          </div>
        </div>
      </TwoCol>
    </CalculatorShell>
  );
}
