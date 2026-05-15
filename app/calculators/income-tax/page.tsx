"use client";
import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { Slider, StatRow, TwoCol, CalcNote, Badge } from "@/components/calculator/CalcUI";
import { formatINR } from "@/lib/format";
import { Button } from "@/components/ui/Button";

function newRegimeTax(income: number): number {
  // FY 2024-25 new regime slabs
  if (income <= 300000) return 0;
  if (income <= 700000) return (income - 300000) * 0.05;
  if (income <= 1000000) return 20000 + (income - 700000) * 0.10;
  if (income <= 1200000) return 50000 + (income - 1000000) * 0.15;
  if (income <= 1500000) return 80000 + (income - 1200000) * 0.20;
  return 110000 + (income - 1500000) * 0.30;
}

function oldRegimeTax(income: number): number {
  // FY 2024-25 old regime slabs
  if (income <= 250000) return 0;
  if (income <= 500000) return (income - 250000) * 0.05;
  if (income <= 1000000) return 12500 + (income - 500000) * 0.20;
  return 112500 + (income - 1000000) * 0.30;
}

function cess(tax: number) { return tax * 0.04; }
function surcharge(tax: number, income: number) {
  if (income > 50000000) return tax * 0.37;
  if (income > 20000000) return tax * 0.25;
  if (income > 10000000) return tax * 0.15;
  if (income > 5000000) return tax * 0.10;
  return 0;
}

export default function IncomeTaxPage() {
  const [grossSalary, setGrossSalary] = useState(1500000);
  const [hra, setHra] = useState(300000);
  const [rentPaid, setRentPaid] = useState(240000);
  const [sec80c, setSec80c] = useState(150000);
  const [nps80ccd, setNps80ccd] = useState(50000);
  const [sec80d, setSec80d] = useState(25000);
  const [homeLoanInt, setHomeLoanInt] = useState(0);
  const [stdDeduction] = useState(50000); // fixed for salaried

  const result = useMemo(() => {
    // Old regime deductions
    const hraExempt = Math.min(hra, rentPaid - grossSalary * 0.1 * (12 / 12));
    const total80c = Math.min(sec80c, 150000);
    const total80ccd = Math.min(nps80ccd, 50000);
    const total80d = Math.min(sec80d, 25000);
    const total24b = Math.min(homeLoanInt, 200000);

    const oldDeductions =
      stdDeduction + Math.max(0, hraExempt) + total80c + total80ccd + total80d + total24b;
    const oldTaxableIncome = Math.max(0, grossSalary - oldDeductions);
    const oldBaseTax = oldRegimeTax(oldTaxableIncome);
    const oldSurcharge = surcharge(oldBaseTax, oldTaxableIncome);
    const oldTotal = oldBaseTax + oldSurcharge + cess(oldBaseTax + oldSurcharge);

    // New regime — only std deduction + NPS 80CCD(2) employer (simplified here)
    const newDeductions = stdDeduction; // + optional employer NPS
    const newTaxableIncome = Math.max(0, grossSalary - newDeductions);
    const newBaseTax = newRegimeTax(newTaxableIncome);
    // Rebate u/s 87A: if taxable income <= 7L, full rebate
    const rebate = newTaxableIncome <= 700000 ? Math.min(newBaseTax, 25000) : 0;
    const newBaseTaxAfterRebate = Math.max(0, newBaseTax - rebate);
    const newSurcharge = surcharge(newBaseTaxAfterRebate, newTaxableIncome);
    const newTotal = newBaseTaxAfterRebate + newSurcharge + cess(newBaseTaxAfterRebate + newSurcharge);

    const saving = oldTotal - newTotal;
    const betterRegime = saving >= 0 ? "new" : "old";

    return {
      oldTaxableIncome,
      oldDeductions,
      oldTotal,
      newTaxableIncome,
      newDeductions,
      newTotal,
      saving: Math.abs(saving),
      betterRegime,
    };
  }, [grossSalary, hra, rentPaid, sec80c, nps80ccd, sec80d, homeLoanInt, stdDeduction]);

  return (
    <CalculatorShell
      eyebrow="Tax · Income Tax"
      title="Income Tax Calculator"
      subtitle="Compare Old vs New tax regime for FY 2024–25. See which saves you more and by how much."
    >
      <TwoCol>
        <div className="space-y-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate2">Income</div>
          <Slider label="Gross annual salary (CTC)" min={300000} max={10000000} step={50000} value={grossSalary} setValue={setGrossSalary} display={formatINR(grossSalary, { compact: true })} minLabel="₹3L" maxLabel="₹1 Cr" />

          <div className="text-xs font-semibold uppercase tracking-wider text-slate2 pt-2">Old Regime Deductions</div>
          <Slider label="HRA received" min={0} max={600000} step={10000} value={hra} setValue={setHra} display={formatINR(hra, { compact: true })} minLabel="₹0" maxLabel="₹6L" />
          <Slider label="Annual rent paid" min={0} max={600000} step={10000} value={rentPaid} setValue={setRentPaid} display={formatINR(rentPaid, { compact: true })} minLabel="₹0" maxLabel="₹6L" />
          <Slider label="Section 80C (PF, ELSS, LIC…)" min={0} max={150000} step={5000} value={sec80c} setValue={setSec80c} display={formatINR(sec80c)} minLabel="₹0" maxLabel="₹1.5L" />
          <Slider label="NPS (80CCD(1B))" min={0} max={50000} step={5000} value={nps80ccd} setValue={setNps80ccd} display={formatINR(nps80ccd)} minLabel="₹0" maxLabel="₹50K" />
          <Slider label="Health insurance (80D)" min={0} max={50000} step={1000} value={sec80d} setValue={setSec80d} display={formatINR(sec80d)} minLabel="₹0" maxLabel="₹50K" />
          <Slider label="Home loan interest (24b)" min={0} max={200000} step={10000} value={homeLoanInt} setValue={setHomeLoanInt} display={formatINR(homeLoanInt)} minLabel="₹0" maxLabel="₹2L" />
          <CalcNote>
            This is a simplified estimate. Actual liability may vary. Consult a tax advisor for
            accurate filing. Standard deduction ₹50,000 applied automatically.
          </CalcNote>
        </div>

        <div className="space-y-4">
          {/* Winner badge */}
          <div className={`rounded-2xl p-6 ${result.betterRegime === "new" ? "bg-spring/10 border border-spring/30" : "bg-crayola/10 border border-crayola/30"}`}>
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate2">
                {result.betterRegime === "new" ? "New Regime" : "Old Regime"} saves you
              </div>
              <Badge color={result.betterRegime === "new" ? "success" : "yale"}>
                Better for you
              </Badge>
            </div>
            <div className="mt-2 tabular text-4xl font-bold text-yale">
              {formatINR(result.saving)}
            </div>
          </div>

          {/* Side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div className={`rounded-xl border p-4 ${result.betterRegime === "old" ? "border-crayola bg-crayola/5" : "border-black/[0.06] bg-white"}`}>
              <div className="text-xs font-semibold text-slate2 uppercase tracking-wider mb-2">Old Regime</div>
              <div className="tabular text-xl font-bold text-yale">{formatINR(result.oldTotal)}</div>
              <div className="mt-2 space-y-1 text-xs text-slate2">
                <div>Taxable: {formatINR(result.oldTaxableIncome, { compact: true })}</div>
                <div>Deductions: {formatINR(result.oldDeductions, { compact: true })}</div>
              </div>
            </div>
            <div className={`rounded-xl border p-4 ${result.betterRegime === "new" ? "border-spring bg-spring/5" : "border-black/[0.06] bg-white"}`}>
              <div className="text-xs font-semibold text-slate2 uppercase tracking-wider mb-2">New Regime</div>
              <div className="tabular text-xl font-bold text-yale">{formatINR(result.newTotal)}</div>
              <div className="mt-2 space-y-1 text-xs text-slate2">
                <div>Taxable: {formatINR(result.newTaxableIncome, { compact: true })}</div>
                <div>Deductions: {formatINR(result.newDeductions, { compact: true })}</div>
              </div>
            </div>
          </div>

          <div className="mt-2 flex gap-3">
            <Button href="/#contact">Talk to our tax expert →</Button>
            <Button variant="secondary" href="/calculators">All calculators</Button>
          </div>
        </div>
      </TwoCol>
    </CalculatorShell>
  );
}
