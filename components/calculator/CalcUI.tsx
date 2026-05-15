"use client";
/**
 * Shared primitives used across all calculator pages.
 * Import Slider, StatRow, ResultPanel, CalcNote from here.
 */
import { Button } from "@/components/ui/Button";

// ── Slider ────────────────────────────────────────────────────────────────────
export function Slider({
  label,
  min,
  max,
  step,
  value,
  setValue,
  display,
  minLabel,
  maxLabel,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  setValue: (n: number) => void;
  display: string;
  minLabel?: string;
  maxLabel?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-medium text-graphite">{label}</label>
        <span className="tabular text-base font-semibold text-yale">{display}</span>
      </div>
      <input
        type="range"
        className="brand-slider mt-2 w-full"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setValue(+e.target.value)}
        style={{ ["--p" as any]: `${pct}%` }}
      />
      {(minLabel || maxLabel) && (
        <div className="mt-1 flex justify-between text-[11px] text-slate2">
          <span>{minLabel ?? ""}</span>
          <span>{maxLabel ?? ""}</span>
        </div>
      )}
    </div>
  );
}

// ── StatRow ───────────────────────────────────────────────────────────────────
export function StatRow({
  label,
  value,
  swatch,
  accent,
}: {
  label: string;
  value: string;
  swatch?: string;
  accent?: "success" | "critical" | "yale";
}) {
  const color =
    accent === "success"
      ? "text-success"
      : accent === "critical"
      ? "text-critical"
      : "text-graphite";
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-slate1">
        {swatch && (
          <span className={`inline-block h-2.5 w-2.5 rounded-full ${swatch}`} />
        )}
        {label}
      </div>
      <span className={`tabular text-base font-semibold ${color}`}>{value}</span>
    </div>
  );
}

// ── ResultPanel ───────────────────────────────────────────────────────────────
export function ResultPanel({
  eyebrow,
  headline,
  sub,
  children,
  cta,
}: {
  eyebrow: string;
  headline: string;
  sub?: string;
  children?: React.ReactNode;
  cta?: { label: string; href: string };
}) {
  return (
    <div className="rounded-2xl bg-mesh-soft p-6 lg:p-8">
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate2">
        {eyebrow}
      </div>
      <div className="mt-2 tabular text-4xl font-bold text-yale">{headline}</div>
      {sub && <div className="mt-1 text-sm text-slate1">{sub}</div>}
      {children && <div className="mt-8 space-y-3">{children}</div>}
      <div className="mt-8 flex gap-3">
        <Button href="/#contact">
          {cta?.label ?? "Talk to an advisor →"}
        </Button>
        <Button variant="secondary" href="/calculators">
          All calculators
        </Button>
      </div>
    </div>
  );
}

// ── CalcNote ──────────────────────────────────────────────────────────────────
export function CalcNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-cloud p-4 text-sm text-slate1">
      <strong className="text-graphite">Note: </strong>
      {children}
    </div>
  );
}

// ── TwoCol layout ─────────────────────────────────────────────────────────────
export function TwoCol({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-8 rounded-2xl border border-black/[0.06] bg-white p-8 shadow-lift lg:grid-cols-2">
      {children}
    </div>
  );
}

// ── Badge ─────────────────────────────────────────────────────────────────────
export function Badge({
  children,
  color = "yale",
}: {
  children: React.ReactNode;
  color?: "yale" | "success" | "critical" | "gold";
}) {
  const cls =
    color === "success"
      ? "bg-spring/20 text-emerald-700"
      : color === "critical"
      ? "bg-red-100 text-red-700"
      : color === "gold"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-yale/10 text-yale";
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${cls}`}
    >
      {children}
    </span>
  );
}
