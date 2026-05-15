"use client";
import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { Slider, StatRow, TwoCol, CalcNote } from "@/components/calculator/CalcUI";
import { formatINR } from "@/lib/format";
import { Button } from "@/components/ui/Button";

const PPF_RATE = 7.1; // current PPF rate

export default function PpfPage() {
  const [annual, setAnnual] = useState(150000);
  const [years, setYears] = useState(15);
  const [currentBalance, setCurrentBalance] = useState(0);

  const result = useMemo(() => {
    const r = PPF_RATE / 100;
    let balance = currentBalance;
    let totalInvested = 0;
    const yearWise: { year: number; invested: number; balance: number; interest: number }[] = [];

    for (let y = 1; y <= years; y++) {
      const interest = (balance + annual) * r;
      balance = balance + annual + interest;
      totalInvested += annual;
      yearWise.push({ year: y, invested: totalInvested, balance, interest });
    }

    return {
      maturity: balance,
      totalInvested: totalInvested + currentBalance,
      interestEarned: balance - totalInvested - currentBalance,
      yearWise,
    };
  }, [annual, years, currentBalance]);

  return (
    <CalculatorShell
      eyebrow="Tax-Saving · PPF"
      title="PPF Calculator"
      subtitle={`Public Provident Fund at ${PPF_RATE}% p.a. — tax-free maturity, EEE status. Model your PPF corpus over the lock-in period.`}
    >
      <TwoCol>
        <div className="space-y-6">
          <Slider label="Annual investment" min={500} max={150000} step={500} value={annual} setValue={setAnnual} display={formatINR(annual)} minLabel="₹500" maxLabel="₹1.5L" />
          <Slider label="Investment period" min={1} max={30} step={1} value={years} setValue={setYears} display={`${years} years`} minLabel="1 yr" maxLabel="30 yrs" />
          <Slider label="Existing PPF balance" min={0} max={5000000} step={10000} value={currentBalance} setValue={setCurrentBalance} display={formatINR(currentBalance, { compact: true })} minLabel="₹0" maxLabel="₹50L" />

          <CalcNote>
            PPF has a 15-year lock-in from account opening. Extensions are in 5-year blocks. Annual
            investment limit is ₹1.5L (also claimable under Section 80C). Interest is tax-free.
          </CalcNote>

          {/* Year-wise mini table */}
          {result.yearWise.length <= 20 && (
            <div className="overflow-hidden rounded-xl border border-black/[0.06]">
              <div className="grid grid-cols-3 bg-cloud px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate2">
                <div>Year</div>
                <div className="text-right">Invested</div>
                <div className="text-right">Balance</div>
              </div>
              <div className="max-h-48 overflow-y-auto">
                {result.yearWise.map((r) => (
                  <div key={r.year} className="grid grid-cols-3 border-t border-black/5 px-4 py-1.5 text-xs">
                    <div className="text-slate2">Year {r.year}</div>
                    <div className="text-right tabular text-graphite">{formatINR(r.invested, { compact: true })}</div>
                    <div className="text-right tabular font-semibold text-yale">{formatINR(r.balance, { compact: true })}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-mesh-soft p-6 lg:p-8">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate2">
            Maturity value
          </div>
          <div className="mt-2 tabular text-4xl font-bold text-yale">
            {formatINR(result.maturity, { compact: true })}
          </div>
          <div className="mt-1 text-sm text-slate1">after {years} years · completely tax-free</div>

          <div className="mt-8 space-y-3">
            <StatRow label="Total invested" value={formatINR(result.totalInvested, { compact: true })} swatch="bg-mist" />
            <StatRow label="Interest earned (tax-free)" value={formatINR(result.interestEarned, { compact: true })} swatch="bg-spring" accent="success" />
            <StatRow label="Effective rate" value={`${PPF_RATE}% p.a.`} />
          </div>

          <div className="mt-8 flex gap-3">
            <Button href="/calculators/elss-vs-ppf">Compare with ELSS →</Button>
            <Button variant="secondary" href="/calculators">All calculators</Button>
          </div>
        </div>
      </TwoCol>
    </CalculatorShell>
  );
}
