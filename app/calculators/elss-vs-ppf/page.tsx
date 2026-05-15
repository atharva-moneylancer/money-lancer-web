"use client";
import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";
import { Slider, StatRow, TwoCol, CalcNote, Badge } from "@/components/calculator/CalcUI";
import { formatINR } from "@/lib/format";
import { Button } from "@/components/ui/Button";

const PPF_RATE = 7.1;

export default function ElssVsPpfPage() {
  const [annual, setAnnual] = useState(150000);
  const [years, setYears] = useState(15);
  const [elssReturn, setElssReturn] = useState(12);
  const [taxBracket, setTaxBracket] = useState(30);

  const result = useMemo(() => {
    const r_ppf = PPF_RATE / 100;
    const r_elss = elssReturn / 100;

    // PPF: compounded annually, fully tax-free maturity
    let ppfBalance = 0;
    for (let y = 0; y < years; y++) {
      ppfBalance = (ppfBalance + annual) * (1 + r_ppf);
    }
    const ppfInterest = ppfBalance - annual * years;
    const ppfPostTax = ppfBalance; // EEE — entirely tax-free

    // ELSS: 3-year lock-in, compounded annually
    // After 3 yrs, LTCG @10% on gains above 1L/year
    let elssBalance = 0;
    for (let y = 0; y < years; y++) {
      elssBalance = (elssBalance + annual) * (1 + r_elss);
    }
    const elssGain = elssBalance - annual * years;
    // LTCG: 10% on gains beyond ₹1L exemption per year
    const exemptedGain = Math.min(elssGain, 100000); // simplified annual exemption
    const taxableGain = Math.max(0, elssGain - exemptedGain);
    const ltcgTax = taxableGain * 0.1;
    const elssPostTax = elssBalance - ltcgTax;

    // Tax saving (80C) — same for both since both qualify
    const taxSaving = Math.min(annual, 150000) * (taxBracket / 100);

    const winner = elssPostTax > ppfPostTax ? "ELSS" : "PPF";
    const winnerAmount = Math.abs(elssPostTax - ppfPostTax);

    return {
      ppfBalance,
      ppfPostTax,
      ppfInterest,
      elssBalance,
      elssPostTax,
      elssGain,
      ltcgTax,
      taxSaving,
      winner,
      winnerAmount,
    };
  }, [annual, years, elssReturn, taxBracket]);

  return (
    <CalculatorShell
      eyebrow="Tax-Saving · ELSS vs PPF"
      title="ELSS vs PPF Calculator"
      subtitle="Both qualify for 80C deduction. Compare their post-tax returns over your investment horizon."
    >
      <TwoCol>
        <div className="space-y-6">
          <Slider label="Annual investment" min={500} max={150000} step={500} value={annual} setValue={setAnnual} display={formatINR(annual)} minLabel="₹500" maxLabel="₹1.5L" />
          <Slider label="Investment period" min={3} max={30} step={1} value={years} setValue={setYears} display={`${years} years`} minLabel="3 yrs" maxLabel="30 yrs" />
          <Slider label="Expected ELSS return" min={8} max={20} step={0.5} value={elssReturn} setValue={setElssReturn} display={`${elssReturn}% p.a.`} minLabel="8%" maxLabel="20%" />
          <Slider label="Your tax bracket" min={5} max={30} step={5} value={taxBracket} setValue={setTaxBracket} display={`${taxBracket}%`} minLabel="5%" maxLabel="30%" />

          <div className="rounded-xl border border-black/[0.06] bg-white p-4 text-sm">
            <div className="font-semibold text-graphite mb-2">Quick comparison</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate2">
              <div className="font-semibold text-ink">ELSS</div>
              <div className="font-semibold text-ink">PPF</div>
              <div>Lock-in: 3 years</div>
              <div>Lock-in: 15 years</div>
              <div>Market-linked returns</div>
              <div>Fixed {PPF_RATE}% (govt)</div>
              <div>LTCG 10% on gains &gt;₹1L</div>
              <div>Fully tax-free (EEE)</div>
              <div>Higher risk, higher return</div>
              <div>No risk, guaranteed</div>
            </div>
          </div>

          <CalcNote>
            ELSS returns assumed at {elssReturn}% — actual equity returns vary. PPF rate ({PPF_RATE}%)
            is subject to quarterly government revision. LTCG computation simplified.
          </CalcNote>
        </div>

        <div className="space-y-4">
          <div className={`rounded-2xl p-6 border ${result.winner === "ELSS" ? "border-crayola/30 bg-crayola/5" : "border-spring/30 bg-spring/10"}`}>
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate2">
                {result.winner} wins by
              </div>
              <Badge color={result.winner === "ELSS" ? "yale" : "success"}>{result.winner} is better</Badge>
            </div>
            <div className="mt-2 tabular text-4xl font-bold text-yale">
              {formatINR(result.winnerAmount, { compact: true })}
            </div>
            <div className="mt-1 text-sm text-slate1">post-tax difference over {years} years</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-black/[0.06] bg-white p-4">
              <div className="text-xs font-semibold text-slate2 uppercase tracking-wider mb-3">ELSS</div>
              <StatRow label="Gross value" value={formatINR(result.elssBalance, { compact: true })} />
              <StatRow label="LTCG tax" value={formatINR(result.ltcgTax, { compact: true })} accent="critical" />
              <div className="mt-2 pt-2 border-t border-black/5">
                <StatRow label="Post-tax" value={formatINR(result.elssPostTax, { compact: true })} accent="success" />
              </div>
            </div>
            <div className="rounded-xl border border-black/[0.06] bg-white p-4">
              <div className="text-xs font-semibold text-slate2 uppercase tracking-wider mb-3">PPF</div>
              <StatRow label="Gross value" value={formatINR(result.ppfBalance, { compact: true })} />
              <StatRow label="Tax" value="₹0 (EEE)" accent="success" />
              <div className="mt-2 pt-2 border-t border-black/5">
                <StatRow label="Post-tax" value={formatINR(result.ppfPostTax, { compact: true })} accent="success" />
              </div>
            </div>
          </div>

          <StatRow label="Annual 80C tax saving (both)" value={formatINR(result.taxSaving) + "/yr"} accent="success" />

          <div className="flex gap-3">
            <Button href="/#contact">Help me decide →</Button>
            <Button variant="secondary" href="/calculators">All calculators</Button>
          </div>
        </div>
      </TwoCol>
    </CalculatorShell>
  );
}
