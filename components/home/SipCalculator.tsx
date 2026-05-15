"use client";
import { useMemo, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { formatINR } from "@/lib/format";
import { SectionEyebrow } from "@/components/home/Services";
import { motion } from "framer-motion";

export default function SipCalculator() {
  const [amount, setAmount] = useState(10000);
  const [years, setYears] = useState(15);
  const [rate, setRate] = useState(12);

  const { invested, returns, total, series } = useMemo(() => {
    const months = years * 12;
    const r = rate / 100 / 12;
    const fv = amount * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
    const inv = amount * months;
    const series: { year: number; invested: number; value: number }[] = [];
    for (let y = 1; y <= years; y++) {
      const n = y * 12;
      const fvY = amount * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
      series.push({ year: y, invested: amount * n, value: fvY });
    }
    return { invested: inv, returns: fv - inv, total: fv, series };
  }, [amount, years, rate]);

  const pctInvested = (invested / total) * 100;

  return (
    <section className="py-24 lg:py-32 bg-mesh-soft">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionEyebrow label="Try it yourself" />
            <h2 className="mt-4 font-display text-headline font-bold tracking-tight text-ink">
              Watch your SIP <br />
              <span className="bg-gradient-to-r from-crayola to-yale bg-clip-text text-transparent">
                compound into wealth.
              </span>
            </h2>
            <p className="mt-4 max-w-md text-body-l text-slate1">
              A simple calculator powered by the same engine that runs our advisor desk. Adjust the
              sliders to see how time and consistency do the heavy lifting.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/calculators">All calculators</Button>
              <Button variant="secondary" href="/funds">Browse funds</Button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl border border-black/[0.06] bg-white p-6 shadow-lift md:p-8"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-5">
                <SliderRow
                  label="Monthly SIP"
                  value={formatINR(amount)}
                  min={500}
                  max={500000}
                  step={500}
                  setValue={setAmount}
                  rawValue={amount}
                />
                <SliderRow
                  label="Duration"
                  value={`${years} year${years > 1 ? "s" : ""}`}
                  min={1}
                  max={30}
                  step={1}
                  setValue={setYears}
                  rawValue={years}
                />
                <SliderRow
                  label="Expected return"
                  value={`${rate}% p.a.`}
                  min={1}
                  max={30}
                  step={1}
                  setValue={setRate}
                  rawValue={rate}
                />
              </div>

              <div className="relative flex flex-col items-center justify-center">
                <DonutChart
                  invested={pctInvested}
                  returns={100 - pctInvested}
                />
                <div className="mt-6 w-full space-y-2 text-sm">
                  <Row label="Invested" value={formatINR(invested)} swatch="bg-mist" />
                  <Row label="Returns" value={formatINR(returns)} swatch="bg-crayola" />
                  <div className="my-2 border-t border-black/10" />
                  <Row label="Total value" value={formatINR(total)} bold />
                </div>
              </div>
            </div>

            {/* growth chart */}
            <div className="mt-6 rounded-xl bg-cloud p-4">
              <AreaSparkline data={series} />
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate2">
                <span>Year 1</span>
                <span>Year {years}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  setValue,
  rawValue,
}: {
  label: string;
  value: string;
  min: number;
  max: number;
  step: number;
  setValue: (n: number) => void;
  rawValue: number;
}) {
  const pct = ((rawValue - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-medium text-graphite">{label}</label>
        <span className="tabular text-sm font-semibold text-yale">{value}</span>
      </div>
      <input
        type="range"
        className="brand-slider mt-2 w-full"
        min={min}
        max={max}
        step={step}
        value={rawValue}
        onChange={(e) => setValue(+e.target.value)}
        style={{ ["--p" as any]: `${pct}%` }}
      />
    </div>
  );
}

function Row({ label, value, swatch, bold }: { label: string; value: string; swatch?: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-slate1">
        {swatch && <span className={`inline-block h-2.5 w-2.5 rounded-full ${swatch}`} />}
        {label}
      </div>
      <span className={`tabular ${bold ? "text-yale text-lg font-bold" : "text-graphite font-semibold"}`}>{value}</span>
    </div>
  );
}

function DonutChart({ invested, returns }: { invested: number; returns: number }) {
  const r = 64;
  const c = 2 * Math.PI * r;
  const investedLen = (invested / 100) * c;
  return (
    <svg width="200" height="200" viewBox="0 0 160 160">
      <circle cx="80" cy="80" r={r} fill="none" stroke="#D4D4D4" strokeWidth="20" />
      <motion.circle
        cx="80"
        cy="80"
        r={r}
        fill="none"
        stroke="#1675F4"
        strokeWidth="20"
        strokeDasharray={`${c}`}
        animate={{ strokeDashoffset: c - (returns / 100) * c }}
        transition={{ duration: 1, ease: "easeOut" }}
        transform="rotate(-90 80 80)"
      />
      <text x="80" y="76" textAnchor="middle" className="fill-slate1" fontSize="11">Returns</text>
      <text x="80" y="94" textAnchor="middle" className="fill-yale tabular" fontWeight="700" fontSize="20">
        {Math.round(returns)}%
      </text>
    </svg>
  );
}

function AreaSparkline({ data }: { data: { year: number; invested: number; value: number }[] }) {
  if (data.length === 0) return null;
  const max = Math.max(...data.map((d) => d.value));
  const w = 600;
  const h = 90;
  const px = (i: number) => (i / (data.length - 1)) * w;
  const py = (v: number) => h - (v / max) * h;
  const pathValue = data.map((d, i) => `${i === 0 ? "M" : "L"} ${px(i)} ${py(d.value)}`).join(" ");
  const pathInvested = data.map((d, i) => `${i === 0 ? "M" : "L"} ${px(i)} ${py(d.invested)}`).join(" ");
  const fillValue = `${pathValue} L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-24 w-full">
      <defs>
        <linearGradient id="sip-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1675F4" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#1675F4" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fillValue} fill="url(#sip-fill)" />
      <path d={pathInvested} stroke="#D4D4D4" strokeWidth="2" fill="none" strokeDasharray="4 4" />
      <path d={pathValue} stroke="#1675F4" strokeWidth="2.5" fill="none" />
    </svg>
  );
}
