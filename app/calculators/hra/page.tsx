"use client";
import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { Slider, StatRow, TwoCol, CalcNote, Badge } from "@/components/calculator/CalcUI";
import { formatINR } from "@/lib/format";
import { Button } from "@/components/ui/Button";

export default function HraPage() {
  const [basicSalary, setBasicSalary] = useState(600000); // annual
  const [hraReceived, setHraReceived] = useState(240000); // annual
  const [rentPaid, setRentPaid] = useState(180000); // annual
  const [isMetro, setIsMetro] = useState(true);

  const result = useMemo(() => {
    // HRA exemption = minimum of:
    // 1. Actual HRA received
    // 2. Rent paid - 10% of basic
    // 3. 50% of basic (metro) / 40% of basic (non-metro)
    const actual = hraReceived;
    const rentMinus10 = Math.max(0, rentPaid - basicSalary * 0.1);
    const pctBasic = basicSalary * (isMetro ? 0.5 : 0.4);

    const exemption = Math.min(actual, rentMinus10, pctBasic);
    const taxableHra = Math.max(0, hraReceived - exemption);

    return { exemption, taxableHra, actual, rentMinus10, pctBasic };
  }, [basicSalary, hraReceived, rentPaid, isMetro]);

  return (
    <CalculatorShell
      eyebrow="Tax · HRA"
      title="HRA Exemption Calculator"
      subtitle="Calculate how much of your House Rent Allowance is exempt from income tax. Available under the Old Tax Regime only."
    >
      <TwoCol>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-graphite">City type</span>
            <div className="flex rounded-xl border border-black/10 overflow-hidden text-sm font-semibold">
              <button onClick={() => setIsMetro(true)} className={`px-4 py-2 transition-colors ${isMetro ? "bg-crayola text-white" : "bg-white text-graphite hover:bg-cloud"}`}>Metro</button>
              <button onClick={() => setIsMetro(false)} className={`px-4 py-2 transition-colors ${!isMetro ? "bg-crayola text-white" : "bg-white text-graphite hover:bg-cloud"}`}>Non-Metro</button>
            </div>
            <Badge color={isMetro ? "yale" : "success"}>{isMetro ? "50% of Basic" : "40% of Basic"}</Badge>
          </div>

          <Slider label="Basic salary (annual)" min={120000} max={5000000} step={12000} value={basicSalary} setValue={setBasicSalary} display={formatINR(basicSalary, { compact: true })} minLabel="₹1.2L" maxLabel="₹50L" />
          <Slider label="HRA received (annual)" min={0} max={2400000} step={12000} value={hraReceived} setValue={setHraReceived} display={formatINR(hraReceived, { compact: true })} minLabel="₹0" maxLabel="₹24L" />
          <Slider label="Rent paid (annual)" min={0} max={2400000} step={12000} value={rentPaid} setValue={setRentPaid} display={formatINR(rentPaid, { compact: true })} minLabel="₹0" maxLabel="₹24L" />

          <CalcNote>
            HRA exemption is available only under the Old Tax Regime and only if you actually pay
            rent. For rent &gt;₹1L/month (₹12L/year), landlord&apos;s PAN is mandatory.
          </CalcNote>
        </div>

        <div className="rounded-2xl bg-mesh-soft p-6 lg:p-8">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate2">
            HRA Exemption
          </div>
          <div className="mt-2 tabular text-4xl font-bold text-success">
            {formatINR(result.exemption)}
          </div>
          <div className="mt-1 text-sm text-slate1">exempt from income tax annually</div>

          <div className="mt-8 space-y-3">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate2 mb-2">
              Minimum of three limits
            </div>
            <StatRow label="① Actual HRA received" value={formatINR(result.actual)} />
            <StatRow label="② Rent paid − 10% of basic" value={formatINR(result.rentMinus10)} />
            <StatRow label={`③ ${isMetro ? "50" : "40"}% of basic (${isMetro ? "metro" : "non-metro"})`} value={formatINR(result.pctBasic)} />
            <div className="border-t border-black/10 pt-3">
              <StatRow label="HRA exempt (minimum above)" value={formatINR(result.exemption)} accent="success" />
              <StatRow label="Taxable HRA" value={formatINR(result.taxableHra)} accent={result.taxableHra > 0 ? "critical" : "success"} />
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <Button href="/calculators/income-tax">Full tax calculation →</Button>
            <Button variant="secondary" href="/calculators">All calculators</Button>
          </div>
        </div>
      </TwoCol>
    </CalculatorShell>
  );
}
