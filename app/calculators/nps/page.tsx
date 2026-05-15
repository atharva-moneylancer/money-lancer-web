"use client";
import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { Slider, StatRow, TwoCol, CalcNote } from "@/components/calculator/CalcUI";
import { formatINR } from "@/lib/format";
import { Button } from "@/components/ui/Button";

export default function NpsPage() {
  const [currentAge, setCurrentAge] = useState(30);
  const [monthlyContrib, setMonthlyContrib] = useState(10000);
  const [employerContrib, setEmployerContrib] = useState(0);
  const [returnRate, setReturnRate] = useState(10);
  const [annuityPct, setAnnuityPct] = useState(40);
  const [annuityRate, setAnnuityRate] = useState(6);

  const result = useMemo(() => {
    const retirementAge = 60;
    const years = retirementAge - currentAge;
    if (years <= 0) return null;

    const totalMonthly = monthlyContrib + employerContrib;
    const monthlyRate = returnRate / 100 / 12;
    const n = years * 12;

    const corpus =
      totalMonthly * ((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate) * (1 + monthlyRate);

    const lumpsum = corpus * ((100 - annuityPct) / 100); // 60% max lumpsum
    const annuityCorpus = corpus * (annuityPct / 100);
    const monthlyPension = (annuityCorpus * (annuityRate / 100)) / 12;
    const totalInvested = totalMonthly * n;

    // Tax benefit: 80C (1.5L) + 80CCD(1B) (50K) + employer (10% of basic, no limit)
    const annualContrib = monthlyContrib * 12;
    const taxBenefit80ccd1b = Math.min(50000, annualContrib);

    return {
      corpus,
      lumpsum,
      annuityCorpus,
      monthlyPension,
      totalInvested,
      years,
      taxBenefit80ccd1b,
    };
  }, [currentAge, monthlyContrib, employerContrib, returnRate, annuityPct, annuityRate]);

  return (
    <CalculatorShell
      eyebrow="Retirement · NPS"
      title="NPS Calculator"
      subtitle="National Pension System — model your retirement corpus, lump sum, and monthly pension. Includes 80CCD(1B) additional tax deduction of ₹50,000."
    >
      <TwoCol>
        <div className="space-y-6">
          <Slider label="Current age" min={18} max={55} step={1} value={currentAge} setValue={setCurrentAge} display={`${currentAge} yrs`} minLabel="18" maxLabel="55" />
          <Slider label="Monthly contribution (self)" min={500} max={100000} step={500} value={monthlyContrib} setValue={setMonthlyContrib} display={formatINR(monthlyContrib, { compact: true })} minLabel="₹500" maxLabel="₹1L" />
          <Slider label="Monthly employer contribution" min={0} max={100000} step={500} value={employerContrib} setValue={setEmployerContrib} display={formatINR(employerContrib, { compact: true })} minLabel="₹0" maxLabel="₹1L" />
          <Slider label="Expected return" min={6} max={14} step={0.5} value={returnRate} setValue={setReturnRate} display={`${returnRate}% p.a.`} minLabel="6%" maxLabel="14%" />
          <Slider label="Annuity purchase %" min={40} max={100} step={5} value={annuityPct} setValue={setAnnuityPct} display={`${annuityPct}%`} minLabel="40%" maxLabel="100%" />
          <Slider label="Annuity rate" min={4} max={9} step={0.5} value={annuityRate} setValue={setAnnuityRate} display={`${annuityRate}% p.a.`} minLabel="4%" maxLabel="9%" />
          <CalcNote>
            NPS retirement age is 60. Minimum 40% of corpus must be used to purchase an annuity.
            Up to 60% can be withdrawn tax-free as lump sum. Annuity income is taxable.
          </CalcNote>
        </div>

        {result ? (
          <div className="rounded-2xl bg-mesh-soft p-6 lg:p-8 space-y-6">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate2">Total NPS Corpus at 60</div>
              <div className="mt-2 tabular text-4xl font-bold text-yale">
                {formatINR(result.corpus, { compact: true })}
              </div>
              <div className="mt-1 text-sm text-slate1">after {result.years} years</div>
            </div>

            <div className="space-y-3">
              <StatRow label="Tax-free lump sum ({100 - annuityPct}%)" value={formatINR(result.lumpsum, { compact: true })} swatch="bg-crayola" />
              <StatRow label="Annuity corpus ({annuityPct}%)" value={formatINR(result.annuityCorpus, { compact: true })} swatch="bg-mist" />
              <StatRow label="Monthly pension (est.)" value={formatINR(result.monthlyPension)} accent="success" />
              <StatRow label="Total invested" value={formatINR(result.totalInvested, { compact: true })} />
              <StatRow label="Extra tax saving (80CCD 1B)" value={formatINR(result.taxBenefit80ccd1b) + "/yr"} accent="success" />
            </div>

            <div className="flex gap-3">
              <Button href="/#contact">Open NPS account →</Button>
              <Button variant="secondary" href="/calculators">All calculators</Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center rounded-2xl bg-cloud p-8 text-sm text-slate2">
            Age must be below 60.
          </div>
        )}
      </TwoCol>
    </CalculatorShell>
  );
}
