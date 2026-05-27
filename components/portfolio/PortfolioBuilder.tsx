"use client";

import { useState, useMemo } from "react";
import { SPOTLIGHT_GROUPS, type SpotlightFund } from "@/lib/portfolio-funds";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface SelectedFund {
  name: string;
  allocation: number; // percentage 0-100
  isSpotlight: boolean;
}

type Step = "pick" | "allocate" | "details" | "review";

const STEPS: { key: Step; label: string }[] = [
  { key: "pick", label: "Pick Funds" },
  { key: "allocate", label: "Allocate" },
  { key: "details", label: "Your Details" },
  { key: "review", label: "Review & Send" },
];

const WA_NUMBER = "919209039205";

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function PortfolioBuilder() {
  const [step, setStep] = useState<Step>("pick");
  const [selected, setSelected] = useState<SelectedFund[]>([]);
  const [customFund, setCustomFund] = useState("");
  const [filterGroup, setFilterGroup] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Personal details
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [riskProfile, setRiskProfile] = useState("");
  const [investmentMode, setInvestmentMode] = useState<"SIP" | "Lumpsum" | "Both">("SIP");

  /* helpers */
  const isSelected = (fundName: string) => selected.some((s) => s.name === fundName);
  const totalAllocation = selected.reduce((sum, s) => sum + s.allocation, 0);

  const toggleFund = (fundName: string, spotlight: boolean) => {
    if (isSelected(fundName)) {
      setSelected((prev) => prev.filter((s) => s.name !== fundName));
    } else {
      setSelected((prev) => [...prev, { name: fundName, allocation: 0, isSpotlight: spotlight }]);
    }
  };

  const addCustomFund = () => {
    const trimmed = customFund.trim();
    if (!trimmed || isSelected(trimmed)) return;
    setSelected((prev) => [...prev, { name: trimmed, allocation: 0, isSpotlight: false }]);
    setCustomFund("");
  };

  const updateAllocation = (fundName: string, value: number) => {
    setSelected((prev) =>
      prev.map((s) => (s.name === fundName ? { ...s, allocation: value } : s))
    );
  };

  const equalSplit = () => {
    const each = Math.floor(100 / selected.length);
    const remainder = 100 - each * selected.length;
    setSelected((prev) =>
      prev.map((s, i) => ({ ...s, allocation: each + (i < remainder ? 1 : 0) }))
    );
  };

  /* Filtered spotlight funds */
  const filteredGroups = useMemo(() => {
    let groups = SPOTLIGHT_GROUPS;
    if (filterGroup) groups = groups.filter((g) => g.label === filterGroup);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      groups = groups
        .map((g) => ({
          ...g,
          funds: g.funds.filter((f) => f.name.toLowerCase().includes(q)),
        }))
        .filter((g) => g.funds.length > 0);
    }
    return groups;
  }, [filterGroup, searchQuery]);

  /* WhatsApp message builder */
  const sendWhatsApp = () => {
    const lines = [
      `Hi Money Lancer! Here's my custom portfolio:`,
      ``,
      `Name: ${name}`,
      `Phone: ${phone}`,
      email ? `Email: ${email}` : null,
      `Investment Amount: ₹${amount}`,
      `Risk Profile: ${riskProfile}`,
      `Mode: ${investmentMode}`,
      ``,
      `--- Portfolio ---`,
      ...selected.map((s) => `• ${s.name}: ${s.allocation}%`),
      ``,
      `Total allocation: ${totalAllocation}%`,
      ``,
      `Please review and help me get started!`,
    ]
      .filter((l) => l !== null)
      .join("%0A");

    window.open(`https://wa.me/${WA_NUMBER}?text=${lines}`, "_blank");
  };

  const canProceedFromPick = selected.length >= 1;
  const canProceedFromAllocate = totalAllocation === 100 && selected.length >= 1;
  const canProceedFromDetails = name.trim() && phone.trim() && amount.trim() && riskProfile;

  /* ------------------------------------------------------------------ */
  /*  Step indicator                                                     */
  /* ------------------------------------------------------------------ */

  const stepIndex = STEPS.findIndex((s) => s.key === step);

  return (
    <div className="mx-auto max-w-5xl">
      {/* Step indicator */}
      <div className="mb-10 flex items-center justify-center gap-1 sm:gap-2">
        {STEPS.map((s, i) => (
          <div key={s.key} className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => {
                // Only allow going back
                if (i < stepIndex) setStep(s.key);
              }}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all sm:h-10 sm:w-10",
                i === stepIndex
                  ? "bg-crayola text-white shadow-glow"
                  : i < stepIndex
                  ? "bg-yale/10 text-yale cursor-pointer hover:bg-yale/20"
                  : "bg-mist text-slate2"
              )}
            >
              {i < stepIndex ? "✓" : i + 1}
            </button>
            <span
              className={cn(
                "hidden text-sm font-medium sm:block",
                i === stepIndex ? "text-ink" : "text-slate2"
              )}
            >
              {s.label}
            </span>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "h-px w-6 sm:w-12",
                  i < stepIndex ? "bg-yale/30" : "bg-black/[0.06]"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* ---- STEP 1: Pick Funds ---- */}
      {step === "pick" && (
        <div className="space-y-6">
          {/* Search + filter bar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
              <input
                type="text"
                placeholder="Search funds or type any fund name…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 w-full rounded-xl border border-black/[0.08] bg-white pl-10 pr-4 text-sm text-ink shadow-soft transition-all focus:border-crayola focus:outline-none focus:ring-2 focus:ring-crayola/20"
              />
            </div>
            <select
              value={filterGroup || ""}
              onChange={(e) => setFilterGroup(e.target.value || null)}
              className="h-11 rounded-xl border border-black/[0.08] bg-white px-4 text-sm text-ink shadow-soft focus:border-crayola focus:outline-none"
            >
              <option value="">All categories</option>
              {SPOTLIGHT_GROUPS.map((g) => (
                <option key={g.label} value={g.label}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>

          {/* Add custom fund */}
          <div className="rounded-xl border border-dashed border-yale/30 bg-yale/[0.03] p-4">
            <p className="mb-2 text-sm font-semibold text-yale">
              Don&apos;t see your fund? Add any fund by name:
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. SBI Bluechip Fund"
                value={customFund}
                onChange={(e) => setCustomFund(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustomFund()}
                className="h-10 flex-1 rounded-lg border border-black/[0.08] bg-white px-3 text-sm text-ink focus:border-crayola focus:outline-none"
              />
              <button
                onClick={addCustomFund}
                disabled={!customFund.trim()}
                className="h-10 rounded-lg bg-yale px-4 text-sm font-semibold text-white transition-all hover:bg-yale/90 disabled:opacity-40"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Spotlight funds grid */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="text-lg">✦</span>
              <h3 className="text-title-s font-bold text-ink">In the Spotlight</h3>
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700">
                ML Research Picks
              </span>
            </div>

            {filteredGroups.map((group) => (
              <div key={group.label} className="mb-6">
                <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate2">
                  {group.label}
                </h4>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {group.funds.map((fund) => (
                    <FundCard
                      key={fund.name}
                      fund={fund}
                      selected={isSelected(fund.name)}
                      onToggle={() => toggleFund(fund.name, true)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Selected summary bar */}
          {selected.length > 0 && (
            <div className="sticky bottom-4 z-10 flex items-center justify-between rounded-2xl border border-black/[0.06] bg-white px-5 py-4 shadow-lift">
              <div>
                <span className="text-sm font-semibold text-ink">
                  {selected.length} fund{selected.length !== 1 ? "s" : ""} selected
                </span>
                <div className="mt-0.5 flex flex-wrap gap-1">
                  {selected.map((s) => (
                    <span
                      key={s.name}
                      className="inline-flex items-center gap-1 rounded-full bg-yale/10 px-2 py-0.5 text-[11px] font-medium text-yale"
                    >
                      {s.name.length > 25 ? s.name.slice(0, 25) + "…" : s.name}
                      <button
                        onClick={() => toggleFund(s.name, s.isSpotlight)}
                        className="ml-0.5 text-yale/60 hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setStep("allocate")}
                disabled={!canProceedFromPick}
                className="h-11 rounded-xl bg-crayola px-6 text-sm font-semibold text-white shadow-lift transition-all hover:bg-[#1262d6] hover:shadow-glow disabled:opacity-40"
              >
                Next: Allocate →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ---- STEP 2: Allocate ---- */}
      {step === "allocate" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-title-s font-bold text-ink">Set your allocation</h3>
              <p className="mt-1 text-sm text-slate1">
                Distribute 100% across your selected funds.
              </p>
            </div>
            <button
              onClick={equalSplit}
              className="h-9 rounded-lg border border-yale/20 bg-yale/5 px-4 text-sm font-semibold text-yale transition-all hover:bg-yale/10"
            >
              Split equally
            </button>
          </div>

          {/* Allocation progress bar */}
          <div className="overflow-hidden rounded-full bg-mist">
            <div
              className={cn(
                "h-3 rounded-full transition-all duration-300",
                totalAllocation === 100
                  ? "bg-emerald-500"
                  : totalAllocation > 100
                  ? "bg-red-500"
                  : "bg-crayola"
              )}
              style={{ width: `${Math.min(totalAllocation, 100)}%` }}
            />
          </div>
          <p
            className={cn(
              "text-center text-sm font-semibold",
              totalAllocation === 100
                ? "text-emerald-600"
                : totalAllocation > 100
                ? "text-red-600"
                : "text-slate1"
            )}
          >
            {totalAllocation}% allocated
            {totalAllocation !== 100 && (
              <span className="font-normal text-slate2">
                {" "}
                — {totalAllocation < 100 ? `${100 - totalAllocation}% remaining` : "exceeds 100%"}
              </span>
            )}
          </p>

          <div className="space-y-3">
            {selected.map((fund) => (
              <div
                key={fund.name}
                className="flex items-center gap-4 rounded-xl border border-black/[0.06] bg-white p-4 shadow-soft"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{fund.name}</p>
                  {fund.isSpotlight && (
                    <span className="text-[11px] text-amber-600">✦ Spotlight</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={fund.allocation}
                    onChange={(e) => updateAllocation(fund.name, Number(e.target.value))}
                    className="hidden w-28 accent-crayola sm:block"
                  />
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={fund.allocation || ""}
                      onChange={(e) =>
                        updateAllocation(fund.name, Math.max(0, Math.min(100, Number(e.target.value) || 0)))
                      }
                      className="h-10 w-16 rounded-lg border border-black/[0.08] bg-cloud text-center text-sm font-semibold text-ink focus:border-crayola focus:outline-none"
                    />
                    <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate2">
                      %
                    </span>
                  </div>
                  <button
                    onClick={() => setSelected((prev) => prev.filter((s) => s.name !== fund.name))}
                    className="h-10 w-10 rounded-lg text-slate2 transition-colors hover:bg-red-50 hover:text-red-500"
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep("pick")}
              className="h-11 rounded-xl border border-black/[0.08] bg-white px-6 text-sm font-semibold text-ink shadow-soft transition-all hover:bg-cloud"
            >
              ← Back
            </button>
            <button
              onClick={() => setStep("details")}
              disabled={!canProceedFromAllocate}
              className="h-11 rounded-xl bg-crayola px-6 text-sm font-semibold text-white shadow-lift transition-all hover:bg-[#1262d6] hover:shadow-glow disabled:opacity-40"
            >
              Next: Your Details →
            </button>
          </div>
        </div>
      )}

      {/* ---- STEP 3: Details ---- */}
      {step === "details" && (
        <div className="mx-auto max-w-lg space-y-6">
          <div>
            <h3 className="text-title-s font-bold text-ink">Almost there!</h3>
            <p className="mt-1 text-sm text-slate1">
              We&apos;ll use these details to reach out and help you invest.
            </p>
          </div>

          <div className="space-y-4 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-soft">
            <FieldInput label="Full Name" value={name} onChange={setName} placeholder="Your name" required />
            <FieldInput label="Phone" value={phone} onChange={setPhone} placeholder="+91 …" required />
            <FieldInput label="Email" value={email} onChange={setEmail} placeholder="you@email.com" type="email" />
            <FieldInput label="Investment Amount (₹)" value={amount} onChange={setAmount} placeholder="e.g. 50000" required />

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">Risk Profile</label>
              <div className="flex flex-wrap gap-2">
                {["Conservative", "Moderate", "Aggressive", "Very Aggressive"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRiskProfile(r)}
                    className={cn(
                      "rounded-lg border px-4 py-2 text-sm font-medium transition-all",
                      riskProfile === r
                        ? "border-crayola bg-crayola/10 text-crayola"
                        : "border-black/[0.08] bg-white text-slate1 hover:border-yale/30"
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">Investment Mode</label>
              <div className="flex gap-2">
                {(["SIP", "Lumpsum", "Both"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setInvestmentMode(m)}
                    className={cn(
                      "rounded-lg border px-4 py-2 text-sm font-medium transition-all",
                      investmentMode === m
                        ? "border-crayola bg-crayola/10 text-crayola"
                        : "border-black/[0.08] bg-white text-slate1 hover:border-yale/30"
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep("allocate")}
              className="h-11 rounded-xl border border-black/[0.08] bg-white px-6 text-sm font-semibold text-ink shadow-soft transition-all hover:bg-cloud"
            >
              ← Back
            </button>
            <button
              onClick={() => setStep("review")}
              disabled={!canProceedFromDetails}
              className="h-11 rounded-xl bg-crayola px-6 text-sm font-semibold text-white shadow-lift transition-all hover:bg-[#1262d6] hover:shadow-glow disabled:opacity-40"
            >
              Review Portfolio →
            </button>
          </div>
        </div>
      )}

      {/* ---- STEP 4: Review & Send ---- */}
      {step === "review" && (
        <div className="mx-auto max-w-lg space-y-6">
          <div>
            <h3 className="text-title-s font-bold text-ink">Review your portfolio</h3>
            <p className="mt-1 text-sm text-slate1">
              Confirm everything looks good, then send it to our team via WhatsApp.
            </p>
          </div>

          {/* Portfolio summary */}
          <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-soft">
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate2">
              Portfolio Composition
            </h4>
            <div className="space-y-2">
              {selected.map((fund) => (
                <div key={fund.name} className="flex items-center justify-between rounded-lg bg-cloud/50 px-3 py-2">
                  <span className="text-sm font-medium text-ink">
                    {fund.isSpotlight && <span className="mr-1 text-amber-500">✦</span>}
                    {fund.name}
                  </span>
                  <span className="text-sm font-bold text-yale">{fund.allocation}%</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-between border-t border-black/[0.06] pt-3">
              <span className="text-sm font-semibold text-ink">Total</span>
              <span className="text-sm font-bold text-emerald-600">{totalAllocation}%</span>
            </div>
          </div>

          {/* Personal details summary */}
          <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-soft">
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate2">
              Your Details
            </h4>
            <div className="space-y-1.5 text-sm">
              <DetailRow label="Name" value={name} />
              <DetailRow label="Phone" value={phone} />
              {email && <DetailRow label="Email" value={email} />}
              <DetailRow label="Amount" value={`₹${amount}`} />
              <DetailRow label="Risk Profile" value={riskProfile} />
              <DetailRow label="Mode" value={investmentMode} />
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep("details")}
              className="h-11 rounded-xl border border-black/[0.08] bg-white px-6 text-sm font-semibold text-ink shadow-soft transition-all hover:bg-cloud"
            >
              ← Back
            </button>
            <button
              onClick={sendWhatsApp}
              className="group h-12 rounded-xl bg-[#25D366] px-8 text-sm font-bold text-white shadow-lift transition-all hover:shadow-[0_8px_30px_rgba(37,211,102,0.35)]"
            >
              <span className="flex items-center gap-2">
                <svg viewBox="0 0 32 32" className="h-5 w-5" fill="white">
                  <path d="M16 2C8.268 2 2 8.268 2 16c0 2.456.665 4.754 1.82 6.73L2 30l7.47-1.793A13.93 13.93 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2Zm0 2c6.627 0 12 5.373 12 12s-5.373 12-12 12a11.93 11.93 0 0 1-6.13-1.693l-.44-.267-4.574 1.097 1.14-4.44-.293-.46A11.93 11.93 0 0 1 4 16C4 9.373 9.373 4 16 4Zm-3.177 6.5c-.23 0-.6.086-.915.43-.314.344-1.2 1.172-1.2 2.857s1.228 3.314 1.4 3.543c.171.229 2.4 3.828 5.914 5.214 2.914 1.143 3.515.914 4.143.857.629-.057 2.029-.829 2.315-1.629.286-.8.286-1.486.2-1.629-.086-.143-.314-.229-.657-.4s-2.028-1-2.343-1.114c-.314-.115-.543-.172-.771.171-.23.343-.886 1.115-1.086 1.343-.2.229-.4.258-.743.086-.343-.172-1.448-.534-2.757-1.7-1.02-.908-1.708-2.03-1.909-2.372-.2-.343-.02-.529.15-.7.155-.153.343-.4.515-.6.171-.2.229-.343.343-.572.115-.229.057-.429-.028-.6-.086-.172-.758-1.872-1.057-2.558-.257-.6-.523-.6-.729-.6l-.628-.014Z" />
                </svg>
                Send via WhatsApp
              </span>
            </button>
          </div>

          <p className="text-center text-[11px] leading-relaxed text-slate2">
            Your portfolio will be sent to our advisory team. A Money Lancer advisor (ARN-175445)
            will reach out to help you execute this portfolio. Mutual fund investments are subject
            to market risks. Read all scheme-related documents carefully.
          </p>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function FundCard({
  fund,
  selected,
  onToggle,
}: {
  fund: SpotlightFund;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "group relative rounded-xl border p-4 text-left transition-all",
        selected
          ? "border-crayola bg-crayola/[0.04] shadow-[0_0_0_1px_theme(colors.crayola)]"
          : "border-black/[0.06] bg-white shadow-soft hover:border-yale/30 hover:shadow-md"
      )}
    >
      {/* Checkmark */}
      <div
        className={cn(
          "absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold transition-all",
          selected ? "bg-crayola text-white" : "border border-black/[0.1] bg-cloud text-transparent"
        )}
      >
        ✓
      </div>

      <p className="pr-7 text-sm font-semibold text-ink">{fund.name}</p>
      <p className="mt-0.5 text-[11px] text-slate2">{fund.category}</p>

      <div className="mt-2 flex items-center gap-1 text-[11px] text-amber-600">
        <svg viewBox="0 0 16 16" className="h-3 w-3 fill-amber-500">
          <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM8 3a5 5 0 110 10A5 5 0 018 3zm0 1.5a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5zM5.5 9.5c0-1.1 1.12-2 2.5-2s2.5.9 2.5 2v.5h-5v-.5z" />
        </svg>
        <span>{fund.investors.toLocaleString("en-IN")} Moneylancers invested</span>
      </div>
    </button>
  );
}

function FieldInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
        {required && <span className="ml-0.5 text-red-400">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="h-11 w-full rounded-xl border border-black/[0.08] bg-cloud px-4 text-sm text-ink transition-all focus:border-crayola focus:bg-white focus:outline-none focus:ring-2 focus:ring-crayola/20"
      />
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-slate2">{label}</span>
      <span className="font-medium text-ink">{value}</span>
    </div>
  );
}
