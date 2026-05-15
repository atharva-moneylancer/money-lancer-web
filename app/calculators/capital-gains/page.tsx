"use client";
import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { StatRow, TwoCol, CalcNote, Badge } from "@/components/calculator/CalcUI";
import { formatINR } from "@/lib/format";
import { Button } from "@/components/ui/Button";

// CII for indexation (debt funds / real estate) — base year 2001-02 = 100
const CII: Record<number, number> = {
  2001: 100, 2002: 105, 2003: 109, 2004: 113, 2005: 117, 2006: 122, 2007: 129,
  2008: 137, 2009: 148, 2010: 167, 2011: 184, 2012: 200, 2013: 220, 2014: 240,
  2015: 254, 2016: 264, 2017: 272, 2018: 280, 2019: 289, 2020: 301, 2021: 317,
  2022: 331, 2023: 348, 2024: 363, 2025: 376,
};

type AssetType = "equity-mf" | "debt-mf" | "real-estate" | "gold";

const ASSET_OPTIONS: { key: AssetType; label: string }[] = [
  { key: "equity-mf", label: "Equity MF / Shares" },
  { key: "debt-mf", label: "Debt MF" },
  { key: "real-estate", label: "Real Estate" },
  { key: "gold", label: "Gold / SGB" },
];

export default function CapitalGainsPage() {
  const [asset, setAsset] = useState<AssetType>("equity-mf");
  const [purchasePrice, setPurchasePrice] = useState(500000);
  const [salePrice, setSalePrice] = useState(800000);
  const [purchaseYear, setPurchaseYear] = useState(2020);
  const [saleYear, setSaleYear] = useState(2025);

  const result = useMemo(() => {
    const holdingYears = saleYear - purchaseYear;
    const grossGain = salePrice - purchasePrice;

    // Determine STCG/LTCG thresholds
    const ltcgThreshold = asset === "equity-mf" ? 1 : asset === "debt-mf" ? 2 : 2; // years
    const isLTCG = holdingYears >= ltcgThreshold;

    let taxRate = 0;
    let indexedCost = purchasePrice;
    let taxableGain = grossGain;
    let exemption = 0;

    if (asset === "equity-mf") {
      if (isLTCG) {
        // LTCG: 12.5% on gains above ₹1.25L (budget 2024)
        exemption = 125000;
        taxableGain = Math.max(0, grossGain - exemption);
        taxRate = 12.5;
      } else {
        // STCG: 20% (budget 2024)
        taxRate = 20;
      }
    } else if (asset === "debt-mf") {
      // Post Apr 2023 amendment: slab rate regardless of holding period
      taxRate = 30; // assuming highest slab — user should check their slab
      taxableGain = grossGain;
    } else if (asset === "real-estate" || asset === "gold") {
      if (isLTCG) {
        // LTCG: 12.5% without indexation (budget 2024) OR 20% with indexation (grandfathered)
        // Use 12.5% without indexation (new default)
        taxRate = 12.5;
        taxableGain = grossGain;
      } else {
        taxRate = 30; // slab rate for STCG
      }
    }

    const tax = Math.max(0, taxableGain * (taxRate / 100));
    const cess = tax * 0.04;
    const totalTax = tax + cess;
    const netGain = grossGain - totalTax;

    return {
      holdingYears,
      isLTCG,
      grossGain,
      indexedCost,
      taxableGain,
      exemption,
      taxRate,
      tax,
      cess,
      totalTax,
      netGain,
    };
  }, [asset, purchasePrice, salePrice, purchaseYear, saleYear]);

  return (
    <CalculatorShell
      eyebrow="Tax · Capital Gains"
      title="Capital Gains Tax Calculator"
      subtitle="Calculate STCG/LTCG tax on equity funds, debt funds, real estate, and gold. Reflects Finance Act 2024 rates."
    >
      <TwoCol>
        <div className="space-y-6">
          {/* Asset type */}
          <div>
            <div className="mb-2 text-sm font-medium text-graphite">Asset type</div>
            <div className="flex flex-wrap gap-2">
              {ASSET_OPTIONS.map((o) => (
                <button
                  key={o.key}
                  onClick={() => setAsset(o.key)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
                    asset === o.key
                      ? "border-crayola bg-crayola text-white"
                      : "border-black/10 bg-white text-graphite hover:border-crayola hover:text-crayola"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <NumInput label="Purchase price (₹)" value={purchasePrice} setValue={setPurchasePrice} />
          <NumInput label="Sale price (₹)" value={salePrice} setValue={setSalePrice} />

          <div className="grid grid-cols-2 gap-4">
            <YearInput label="Purchase year" value={purchaseYear} setValue={setPurchaseYear} />
            <YearInput label="Sale year" value={saleYear} setValue={setSaleYear} />
          </div>

          <CalcNote>
            Rates reflect Finance Act 2024 (effective Jul 23, 2024). Equity LTCG threshold raised
            to ₹1.25L. LTCG rate: 12.5% (equity) without indexation. Consult a CA for actual
            filing — surcharge may apply on high gains.
          </CalcNote>
        </div>

        <div className="rounded-2xl bg-mesh-soft p-6 lg:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate2">
                Capital Gains Type
              </div>
              <Badge color={result.isLTCG ? "success" : "critical"}>
                {result.isLTCG ? "Long-Term (LTCG)" : "Short-Term (STCG)"}
              </Badge>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate2">
                Holding
              </div>
              <div className="text-sm font-semibold text-graphite">
                {result.holdingYears} yr{result.holdingYears !== 1 ? "s" : ""}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <StatRow label="Sale price" value={formatINR(salePrice)} />
            <StatRow label="Purchase price" value={formatINR(purchasePrice)} />
            <StatRow label="Gross gain" value={formatINR(result.grossGain)} accent={result.grossGain >= 0 ? "success" : "critical"} />
            {result.exemption > 0 && (
              <StatRow label="Exemption (₹1.25L for equity)" value={`− ${formatINR(result.exemption)}`} accent="success" />
            )}
            <StatRow label="Taxable gain" value={formatINR(result.taxableGain)} />
          </div>

          <div className="border-t border-black/10 pt-4 space-y-3">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate2">Tax breakdown</div>
            <StatRow label={`Tax @ ${result.taxRate}%`} value={formatINR(result.tax)} accent="critical" />
            <StatRow label="Cess @ 4%" value={formatINR(result.cess)} accent="critical" />
            <StatRow label="Total tax liability" value={formatINR(result.totalTax)} accent="critical" />
            <div className="border-t border-black/10 pt-3">
              <StatRow label="Net gain after tax" value={formatINR(result.netGain)} accent={result.netGain >= 0 ? "success" : "critical"} />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button href="/#contact">Talk to our tax advisor →</Button>
            <Button variant="secondary" href="/calculators">All calculators</Button>
          </div>
        </div>
      </TwoCol>
    </CalculatorShell>
  );
}

function NumInput({ label, value, setValue }: { label: string; value: number; setValue: (n: number) => void }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-graphite">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold tabular text-yale focus:border-crayola focus:outline-none focus:ring-2 focus:ring-crayola/20"
      />
    </div>
  );
}

function YearInput({ label, value, setValue }: { label: string; value: number; setValue: (n: number) => void }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-graphite">{label}</label>
      <input
        type="number"
        value={value}
        min={2000}
        max={2040}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold tabular text-yale focus:border-crayola focus:outline-none focus:ring-2 focus:ring-crayola/20"
      />
    </div>
  );
}
