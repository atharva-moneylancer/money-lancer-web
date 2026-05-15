"use client";
import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { Slider, StatRow, TwoCol, CalcNote } from "@/components/calculator/CalcUI";
import { formatINR } from "@/lib/format";
import { Button } from "@/components/ui/Button";

export default function ChildrenEducationPage() {
  const [childAge, setChildAge] = useState(5);
  const [targetAge, setTargetAge] = useState(18);
  const [currentCost, setCurrentCost] = useState(2000000); // today's college cost
  const [educationInflation, setEducationInflation] = useState(8);
  const [returnRate, setReturnRate] = useState(12);
  const [currentSavings, setCurrentSavings] = useState(200000);

  const result = useMemo(() => {
    const years = targetAge - childAge;
    if (years <= 0) return null;

    const futureCost = currentCost * Math.pow(1 + educationInflation / 100, years);
    const fvCurrentSavings = currentSavings * Math.pow(1 + returnRate / 100, years);
    const gap = Math.max(0, futureCost - fvCurrentSavings);

    const monthlyRate = returnRate / 100 / 12;
    const n = years * 12;
    const sipNeeded =
      gap > 0
        ? gap / (((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate) * (1 + monthlyRate))
        : 0;

    const lumpsumNeeded = gap > 0 ? gap / Math.pow(1 + returnRate / 100, years) : 0;

    return {
      years,
      futureCost,
      fvCurrentSavings,
      gap,
      sipNeeded,
      lumpsumNeeded,
    };
  }, [childAge, targetAge, currentCost, educationInflation, returnRate, currentSavings]);

  return (
    <CalculatorShell
      eyebrow="Goals · Education"
      title="Children's Education Calculator"
      subtitle="Estimate the future cost of your child's education and calculate how much to save monthly to get there."
    >
      <TwoCol>
        <div className="space-y-6">
          <Slider label="Child's current age" min={0} max={17} step={1} value={childAge} setValue={setChildAge} display={`${childAge} years`} minLabel="0" maxLabel="17" />
          <Slider label="Education start age" min={childAge + 1} max={25} step={1} value={targetAge} setValue={setTargetAge} display={`${targetAge} years`} minLabel={`${childAge + 1}`} maxLabel="25" />
          <Slider label="Today's education cost" min={500000} max={20000000} step={100000} value={currentCost} setValue={setCurrentCost} display={formatINR(currentCost, { compact: true })} minLabel="₹5L" maxLabel="₹2 Cr" />
          <Slider label="Education inflation" min={5} max={15} step={0.5} value={educationInflation} setValue={setEducationInflation} display={`${educationInflation}% p.a.`} minLabel="5%" maxLabel="15%" />
          <Slider label="Expected return on savings" min={6} max={18} step={0.5} value={returnRate} setValue={setReturnRate} display={`${returnRate}% p.a.`} minLabel="6%" maxLabel="18%" />
          <Slider label="Current education savings" min={0} max={5000000} step={50000} value={currentSavings} setValue={setCurrentSavings} display={formatINR(currentSavings, { compact: true })} minLabel="₹0" maxLabel="₹50L" />
          <CalcNote>
            Education inflation in India is typically 8–10% p.a. — much higher than general
            inflation. Starting a dedicated SIP early with equity mutual funds is the most
            effective way to build this corpus.
          </CalcNote>
        </div>

        {result ? (
          <div className="rounded-2xl bg-mesh-soft p-6 lg:p-8">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate2">
              Monthly SIP needed
            </div>
            <div className="mt-2 tabular text-4xl font-bold text-yale">
              {result.sipNeeded > 0 ? formatINR(result.sipNeeded) : "You're covered!"}
            </div>
            <div className="mt-1 text-sm text-slate1">
              {result.years} years to go · target by age {targetAge}
            </div>

            <div className="mt-8 space-y-3">
              <StatRow label="Future education cost" value={formatINR(result.futureCost, { compact: true })} swatch="bg-critical/60" />
              <StatRow label="Current savings will grow to" value={formatINR(result.fvCurrentSavings, { compact: true })} swatch="bg-spring" accent="success" />
              <div className="border-t border-black/10 pt-2">
                <StatRow label="Funding gap" value={formatINR(result.gap, { compact: true })} accent={result.gap > 0 ? "critical" : "success"} />
                <StatRow label="Lump sum needed today (alt.)" value={formatINR(result.lumpsumNeeded, { compact: true })} />
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <Button href="/#contact">Start education SIP →</Button>
              <Button variant="secondary" href="/calculators">All calculators</Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center rounded-2xl bg-cloud p-8 text-sm text-slate2">
            Target age must be greater than child&apos;s current age.
          </div>
        )}
      </TwoCol>
    </CalculatorShell>
  );
}
