"use client";
import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { Slider, StatRow, TwoCol, CalcNote } from "@/components/calculator/CalcUI";
import { formatINR } from "@/lib/format";
import { Button } from "@/components/ui/Button";

export default function EmiCalculatorPage() {
  const [principal, setPrincipal] = useState(5000000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const result = useMemo(() => {
    const r = rate / 100 / 12;
    const n = tenure * 12;
    const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = emi * n;
    const interest = total - principal;
    const interestPct = (interest / total) * 100;
    return { emi, total, interest, interestPct };
  }, [principal, rate, tenure]);

  return (
    <CalculatorShell
      eyebrow="Loans · EMI"
      title="EMI Calculator"
      subtitle="Calculate your monthly EMI for home, car, or personal loans. See the total interest you pay over the loan tenure."
    >
      <TwoCol>
        <div className="space-y-6">
          <Slider label="Loan amount" min={100000} max={50000000} step={100000} value={principal} setValue={setPrincipal} display={formatINR(principal, { compact: true })} minLabel="₹1L" maxLabel="₹5 Cr" />
          <Slider label="Interest rate" min={5} max={20} step={0.1} value={rate} setValue={setRate} display={`${rate.toFixed(1)}% p.a.`} minLabel="5%" maxLabel="20%" />
          <Slider label="Loan tenure" min={1} max={30} step={1} value={tenure} setValue={setTenure} display={`${tenure} years`} minLabel="1 yr" maxLabel="30 yrs" />
          <CalcNote>
            Home loan rates typically range 8–9.5%, car loans 7–11%, personal loans 10–18%.
            Compare EMIs before you choose the loan tenure.
          </CalcNote>
        </div>

        <div className="rounded-2xl bg-mesh-soft p-6 lg:p-8">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate2">Monthly EMI</div>
          <div className="mt-2 tabular text-4xl font-bold text-yale">{formatINR(result.emi)}</div>
          <div className="mt-1 text-sm text-slate1">for {tenure} years</div>

          <div className="mt-8 space-y-3">
            <StatRow label="Principal amount" value={formatINR(principal)} swatch="bg-crayola" />
            <StatRow label="Total interest" value={formatINR(result.interest)} swatch="bg-critical/60" accent="critical" />
            <StatRow label="Total payment" value={formatINR(result.total)} />
          </div>

          {/* Interest ratio bar */}
          <div className="mt-6">
            <div className="mb-1 flex justify-between text-xs text-slate2">
              <span>Principal {(100 - result.interestPct).toFixed(0)}%</span>
              <span>Interest {result.interestPct.toFixed(0)}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-mist">
              <div className="h-full rounded-full bg-critical/70" style={{ width: `${result.interestPct}%` }} />
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <Button href="/#contact">Get loan advice →</Button>
            <Button variant="secondary" href="/calculators">All calculators</Button>
          </div>
        </div>
      </TwoCol>
    </CalculatorShell>
  );
}
