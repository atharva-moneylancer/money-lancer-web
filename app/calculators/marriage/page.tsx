"use client";
import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { Slider, StatRow, TwoCol, CalcNote } from "@/components/calculator/CalcUI";
import { formatINR } from "@/lib/format";
import { Button } from "@/components/ui/Button";

export default function MarriagePage() {
  const [years, setYears] = useState(5);
  const [budgetToday, setBudgetToday] = useState(3000000);
  const [inflation, setInflation] = useState(7);
  const [returnRate, setReturnRate] = useState(11);
  const [currentSavings, setCurrentSavings] = useState(300000);

  const result = useMemo(() => {
    const futureCorpus = budgetToday * Math.pow(1 + inflation / 100, years);
    const fvCurrentSavings = currentSavings * Math.pow(1 + returnRate / 100, years);
    const gap = Math.max(0, futureCorpus - fvCurrentSavings);

    const monthlyRate = returnRate / 100 / 12;
    const n = years * 12;
    const sipNeeded =
      gap > 0
        ? gap / (((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate) * (1 + monthlyRate))
        : 0;

    return { futureCorpus, fvCurrentSavings, gap, sipNeeded };
  }, [years, budgetToday, inflation, returnRate, currentSavings]);

  return (
    <CalculatorShell
      eyebrow="Goals · Marriage"
      title="Marriage Corpus Calculator"
      subtitle="Plan ahead for your or your child's wedding. Estimate the future cost and calculate the monthly SIP to get there."
    >
      <TwoCol>
        <div className="space-y-6">
          <Slider label="Years to wedding" min={1} max={20} step={1} value={years} setValue={setYears} display={`${years} years`} minLabel="1 yr" maxLabel="20 yrs" />
          <Slider label="Today's wedding budget" min={500000} max={20000000} step={100000} value={budgetToday} setValue={setBudgetToday} display={formatINR(budgetToday, { compact: true })} minLabel="₹5L" maxLabel="₹2 Cr" />
          <Slider label="Inflation on wedding costs" min={3} max={12} step={0.5} value={inflation} setValue={setInflation} display={`${inflation}% p.a.`} minLabel="3%" maxLabel="12%" />
          <Slider label="Expected investment return" min={6} max={16} step={0.5} value={returnRate} setValue={setReturnRate} display={`${returnRate}% p.a.`} minLabel="6%" maxLabel="16%" />
          <Slider label="Current savings for this goal" min={0} max={5000000} step={50000} value={currentSavings} setValue={setCurrentSavings} display={formatINR(currentSavings, { compact: true })} minLabel="₹0" maxLabel="₹50L" />
          <CalcNote>
            Wedding costs in India inflate significantly. Starting an equity SIP 5–10 years in
            advance dramatically reduces the monthly burden. Shift to safer debt funds 1–2 years
            before the event.
          </CalcNote>
        </div>

        <div className="rounded-2xl bg-mesh-soft p-6 lg:p-8">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate2">
            Monthly SIP needed
          </div>
          <div className="mt-2 tabular text-4xl font-bold text-yale">
            {result.sipNeeded > 0 ? formatINR(result.sipNeeded) : "Corpus covered!"}
          </div>
          <div className="mt-1 text-sm text-slate1">for {years} years</div>

          <div className="mt-8 space-y-3">
            <StatRow label="Future wedding corpus needed" value={formatINR(result.futureCorpus, { compact: true })} swatch="bg-critical/60" />
            <StatRow label="Current savings will grow to" value={formatINR(result.fvCurrentSavings, { compact: true })} swatch="bg-spring" accent="success" />
            <div className="border-t border-black/10 pt-2">
              <StatRow label="Funding gap" value={formatINR(result.gap, { compact: true })} accent={result.gap > 0 ? "critical" : "success"} />
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <Button href="/#contact">Start wedding SIP →</Button>
            <Button variant="secondary" href="/calculators">All calculators</Button>
          </div>
        </div>
      </TwoCol>
    </CalculatorShell>
  );
}
