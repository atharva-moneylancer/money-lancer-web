"use client";
import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { Slider, StatRow, TwoCol, CalcNote, Badge } from "@/components/calculator/CalcUI";
import { formatINR } from "@/lib/format";
import { Button } from "@/components/ui/Button";

type Mode = "fd" | "rd";

export default function FdRdPage() {
  const [mode, setMode] = useState<Mode>("fd");
  const [principal, setPrincipal] = useState(500000);
  const [monthly, setMonthly] = useState(10000);
  const [rate, setRate] = useState(7.0);
  const [years, setYears] = useState(5);
  const [compounding, setCompounding] = useState<"quarterly" | "monthly" | "annually">("quarterly");

  const result = useMemo(() => {
    const n = years * (compounding === "quarterly" ? 4 : compounding === "monthly" ? 12 : 1);
    const r = rate / 100 / (compounding === "quarterly" ? 4 : compounding === "monthly" ? 12 : 1);

    if (mode === "fd") {
      const maturity = principal * Math.pow(1 + r, n);
      const interest = maturity - principal;
      return { maturity, interest, invested: principal };
    } else {
      // RD: monthly deposits
      const months = years * 12;
      const monthlyRate = rate / 100 / 12;
      const maturity =
        monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
      const invested = monthly * months;
      const interest = maturity - invested;
      return { maturity, interest, invested };
    }
  }, [mode, principal, monthly, rate, years, compounding]);

  return (
    <CalculatorShell
      eyebrow="Fixed Income · FD / RD"
      title="FD & RD Calculator"
      subtitle="Calculate maturity value and interest earned on Fixed Deposits and Recurring Deposits."
    >
      <TwoCol>
        <div className="space-y-6">
          {/* FD / RD toggle */}
          <div className="flex rounded-xl border border-black/10 overflow-hidden text-sm font-semibold w-fit">
            <button onClick={() => setMode("fd")} className={`px-6 py-2.5 transition-colors ${mode === "fd" ? "bg-crayola text-white" : "bg-white text-graphite hover:bg-cloud"}`}>Fixed Deposit</button>
            <button onClick={() => setMode("rd")} className={`px-6 py-2.5 transition-colors ${mode === "rd" ? "bg-crayola text-white" : "bg-white text-graphite hover:bg-cloud"}`}>Recurring Deposit</button>
          </div>

          {mode === "fd" ? (
            <Slider label="Deposit amount" min={10000} max={10000000} step={10000} value={principal} setValue={setPrincipal} display={formatINR(principal, { compact: true })} minLabel="₹10K" maxLabel="₹1 Cr" />
          ) : (
            <Slider label="Monthly deposit" min={500} max={100000} step={500} value={monthly} setValue={setMonthly} display={formatINR(monthly, { compact: true })} minLabel="₹500" maxLabel="₹1L" />
          )}

          <Slider label="Interest rate" min={4} max={10} step={0.1} value={rate} setValue={setRate} display={`${rate.toFixed(1)}% p.a.`} minLabel="4%" maxLabel="10%" />
          <Slider label="Tenure" min={1} max={10} step={1} value={years} setValue={setYears} display={`${years} year${years > 1 ? "s" : ""}`} minLabel="1 yr" maxLabel="10 yrs" />

          {mode === "fd" && (
            <div>
              <div className="mb-2 text-sm font-medium text-graphite">Compounding frequency</div>
              <div className="flex gap-2">
                {(["quarterly", "monthly", "annually"] as const).map((c) => (
                  <button key={c} onClick={() => setCompounding(c)} className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors capitalize ${compounding === c ? "border-crayola bg-crayola text-white" : "border-black/10 bg-white text-graphite hover:border-crayola"}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          <CalcNote>
            FD interest is taxable as per your income slab. TDS @10% is deducted if interest
            exceeds ₹40,000/yr (₹50,000 for senior citizens). Consider ELSS or debt MFs for
            better post-tax returns.
          </CalcNote>
        </div>

        <div className="rounded-2xl bg-mesh-soft p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-2">
            <Badge color="yale">{mode === "fd" ? "Fixed Deposit" : "Recurring Deposit"}</Badge>
          </div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate2">Maturity value</div>
          <div className="mt-2 tabular text-4xl font-bold text-yale">
            {formatINR(result.maturity, { compact: true })}
          </div>
          <div className="mt-1 text-sm text-slate1">after {years} year{years > 1 ? "s" : ""}</div>

          <div className="mt-8 space-y-3">
            <StatRow label={mode === "fd" ? "Principal" : "Total deposited"} value={formatINR(result.invested, { compact: true })} swatch="bg-mist" />
            <StatRow label="Interest earned" value={formatINR(result.interest, { compact: true })} swatch="bg-crayola" accent="success" />
            <StatRow label="Effective rate" value={`${rate}% p.a.`} />
          </div>

          <div className="mt-8 flex gap-3">
            <Button href="/funds">Explore mutual funds →</Button>
            <Button variant="secondary" href="/calculators">All calculators</Button>
          </div>
        </div>
      </TwoCol>
    </CalculatorShell>
  );
}
