"use client";
import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { Slider, StatRow, ResultPanel, TwoCol, CalcNote, Badge } from "@/components/calculator/CalcUI";
import { formatINR } from "@/lib/format";

export default function FireCalculatorPage() {
  const [currentAge, setCurrentAge] = useState(30);
  const [targetAge, setTargetAge] = useState(45);
  const [monthlyExpenses, setMonthlyExpenses] = useState(75000);
  const [currentSavings, setCurrentSavings] = useState(500000);
  const [monthlySavings, setMonthlySavings] = useState(30000);
  const [returnRate, setReturnRate] = useState(12);
  const [inflationRate, setInflationRate] = useState(6);
  const [withdrawalRate, setWithdrawalRate] = useState(4);

  const result = useMemo(() => {
    const years = targetAge - currentAge;
    if (years <= 0) return null;

    // Annual expenses in today's money
    const annualExpensesNow = monthlyExpenses * 12;

    // Future annual expenses at target age (inflation-adjusted)
    const inflatedAnnualExpenses =
      annualExpensesNow * Math.pow(1 + inflationRate / 100, years);

    // FIRE corpus needed = inflated annual expenses / withdrawal rate
    const fireCorpus = inflatedAnnualExpenses / (withdrawalRate / 100);

    // Future value of current savings
    const r = returnRate / 100;
    const fvCurrentSavings = currentSavings * Math.pow(1 + r, years);

    // Future value of monthly SIP
    const monthlyRate = returnRate / 100 / 12;
    const n = years * 12;
    const fvSip =
      monthlySavings *
      ((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate) *
      (1 + monthlyRate);

    const projectedCorpus = fvCurrentSavings + fvSip;
    const gap = fireCorpus - projectedCorpus;

    // Monthly SIP needed to hit FIRE corpus (from current savings)
    // fireCorpus = fvCurrentSavings + SIP_needed * ((1+r)^n - 1)/r * (1+r)
    const sipNeeded =
      (fireCorpus - fvCurrentSavings) /
      (((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate) * (1 + monthlyRate));

    // Monthly income from corpus at target age
    const monthlyPassiveIncome = (projectedCorpus * (withdrawalRate / 100)) / 12;

    return {
      years,
      fireCorpus,
      projectedCorpus,
      gap,
      sipNeeded: Math.max(0, sipNeeded),
      monthlyPassiveIncome,
      inflatedAnnualExpenses,
      onTrack: projectedCorpus >= fireCorpus,
    };
  }, [
    currentAge,
    targetAge,
    monthlyExpenses,
    currentSavings,
    monthlySavings,
    returnRate,
    inflationRate,
    withdrawalRate,
  ]);

  return (
    <CalculatorShell
      eyebrow="Goals · FIRE"
      title="FIRE Calculator"
      subtitle="Financial Independence, Retire Early. Find your FIRE number — the corpus that lets your investments pay your expenses forever."
    >
      {/* What is FIRE */}
      <div className="mb-8 rounded-2xl border border-crayola/20 bg-crayola/5 p-6">
        <div className="flex flex-wrap items-start gap-4">
          <div>
            <div className="text-sm font-semibold text-yale">The 4% Rule</div>
            <p className="mt-1 text-sm text-slate1">
              A corpus is considered "FIRE-ready" when a{" "}
              <strong className="text-graphite">{withdrawalRate}% annual withdrawal</strong> covers
              all your expenses — leaving the rest to keep growing. This means your FIRE number is
              roughly <strong className="text-graphite">25× your annual expenses</strong> (at 4% withdrawal).
            </p>
          </div>
        </div>
      </div>

      <TwoCol>
        <div className="space-y-6">
          <Slider label="Current age" min={20} max={55} step={1} value={currentAge} setValue={setCurrentAge} display={`${currentAge} yrs`} minLabel="20" maxLabel="55" />
          <Slider label="Target FIRE age" min={currentAge + 1} max={65} step={1} value={targetAge} setValue={setTargetAge} display={`${targetAge} yrs`} minLabel={`${currentAge + 1}`} maxLabel="65" />
          <Slider label="Monthly expenses (today)" min={20000} max={500000} step={5000} value={monthlyExpenses} setValue={setMonthlyExpenses} display={formatINR(monthlyExpenses, { compact: true })} minLabel="₹20K" maxLabel="₹5L" />
          <Slider label="Current savings / investments" min={0} max={10000000} step={50000} value={currentSavings} setValue={setCurrentSavings} display={formatINR(currentSavings, { compact: true })} minLabel="₹0" maxLabel="₹1 Cr" />
          <Slider label="Monthly savings (SIP)" min={0} max={300000} step={2000} value={monthlySavings} setValue={setMonthlySavings} display={formatINR(monthlySavings, { compact: true })} minLabel="₹0" maxLabel="₹3L" />
          <Slider label="Expected investment return" min={6} max={18} step={0.5} value={returnRate} setValue={setReturnRate} display={`${returnRate}% p.a.`} minLabel="6%" maxLabel="18%" />
          <Slider label="Inflation rate" min={3} max={10} step={0.5} value={inflationRate} setValue={setInflationRate} display={`${inflationRate}% p.a.`} minLabel="3%" maxLabel="10%" />
          <Slider label="Safe withdrawal rate" min={2} max={6} step={0.5} value={withdrawalRate} setValue={setWithdrawalRate} display={`${withdrawalRate}%`} minLabel="2%" maxLabel="6%" />

          <CalcNote>
            The 4% rule originated from the Trinity Study (US). For India, many advisors recommend
            3–3.5% given higher inflation. Adjust the withdrawal rate slider accordingly.
          </CalcNote>
        </div>

        {result ? (
          <div className="space-y-4">
            {/* FIRE status */}
            <div className={`rounded-2xl p-6 ${result.onTrack ? "bg-spring/10 border border-spring/30" : "bg-mesh-soft"}`}>
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate2">
                  Your FIRE number
                </div>
                <Badge color={result.onTrack ? "success" : "yale"}>
                  {result.onTrack ? "On track 🎯" : `${result.years} yrs to go`}
                </Badge>
              </div>
              <div className="mt-2 tabular text-4xl font-bold text-yale">
                {formatINR(result.fireCorpus, { compact: true })}
              </div>
              <div className="mt-1 text-sm text-slate1">
                corpus needed at age {targetAge} · covers{" "}
                {formatINR(result.inflatedAnnualExpenses, { compact: true })}/yr expenses
              </div>
            </div>

            {/* Projection vs required */}
            <div className="rounded-2xl border border-black/[0.06] bg-white p-5 space-y-3">
              <StatRow label="Projected corpus at target age" value={formatINR(result.projectedCorpus, { compact: true })} swatch="bg-crayola" />
              <StatRow label="FIRE corpus needed" value={formatINR(result.fireCorpus, { compact: true })} swatch="bg-mist" />
              <div className="border-t border-black/5 pt-3">
                <StatRow
                  label={result.gap > 0 ? "Shortfall" : "Surplus"}
                  value={formatINR(Math.abs(result.gap), { compact: true })}
                  accent={result.gap > 0 ? "critical" : "success"}
                />
              </div>
            </div>

            {/* What you need */}
            <div className="rounded-2xl border border-black/[0.06] bg-white p-5 space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate2 mb-2">To hit FIRE on time</div>
              <StatRow
                label="Monthly SIP needed"
                value={formatINR(result.sipNeeded, { compact: true })}
                accent={result.sipNeeded > monthlySavings ? "critical" : "success"}
              />
              <StatRow
                label="Monthly passive income at FIRE"
                value={formatINR(result.monthlyPassiveIncome, { compact: true })}
                accent="success"
              />
            </div>

            <div className="mt-4 flex gap-3">
              <a href="/#contact" className="inline-flex items-center rounded-full bg-crayola px-5 py-2.5 text-sm font-semibold text-white shadow-cta transition-all hover:bg-yale">
                Plan my FIRE journey →
              </a>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center rounded-2xl bg-cloud p-8 text-sm text-slate2">
            Target age must be greater than current age.
          </div>
        )}
      </TwoCol>
    </CalculatorShell>
  );
}
