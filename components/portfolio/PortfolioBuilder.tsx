"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { SPOTLIGHT_GROUPS, type SpotlightFund, type FundGroup, type IconId } from "@/lib/portfolio-funds";
import { getAmcForName, type AMC } from "@/lib/amcs";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  SVG Icon System                                                    */
/* ------------------------------------------------------------------ */

function Icon({ id, className = "h-4 w-4" }: { id: string; className?: string }) {
  const props = { className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.75, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  switch (id) {
    case "bar-chart":
      return <svg {...props}><path d="M18 20V10M12 20V4M6 20v-6" /></svg>;
    case "trending-up":
      return <svg {...props}><path d="M22 7l-8.5 8.5-5-5L2 17" /><path d="M16 7h6v6" /></svg>;
    case "zap":
      return <svg {...props} fill="currentColor" stroke="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>;
    case "refresh":
      return <svg {...props}><path d="M23 4v6h-6" /><path d="M1 20v-6h6" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" /></svg>;
    case "crosshair":
      return <svg {...props}><circle cx="12" cy="12" r="10" /><path d="M22 12h-4M6 12H2M12 6V2M12 22v-4" /></svg>;
    case "search":
      return <svg {...props}><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>;
    case "scale":
      return <svg {...props}><path d="M12 3v18" /><path d="M4.5 7.5L12 3l7.5 4.5" /><path d="M4.5 7.5l-2 8h7l-2-8" /><path d="M19.5 7.5l-2 8h7l-2-8" /></svg>;
    case "grid":
      return <svg {...props}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>;
    case "droplet":
      return <svg {...props}><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" /></svg>;
    case "graduation":
      return <svg {...props}><path d="M22 10l-10-5L2 10l10 5 10-5z" /><path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5" /><path d="M22 10v6" /></svg>;
    case "flame":
      return <svg {...props}><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" /></svg>;
    case "globe":
      return <svg {...props}><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg>;
    case "diamond":
      return <svg {...props}><path d="M2.7 10.3a2.41 2.41 0 000 3.41l7.59 7.59a2.41 2.41 0 003.41 0l7.59-7.59a2.41 2.41 0 000-3.41L13.7 2.71a2.41 2.41 0 00-3.41 0z" /></svg>;
    case "building":
      return <svg {...props}><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01" /></svg>;
    case "coins":
      return <svg {...props}><circle cx="8" cy="8" r="6" /><path d="M18.09 10.37A6 6 0 1110.34 18" /><path d="M7 6h1v4" /><path d="M16.71 13.88l.7.71-2.82 2.82" /></svg>;
    /* Step icons */
    case "step-pick":
      return <svg {...props}><circle cx="12" cy="12" r="10" /><path d="M22 12h-4M6 12H2M12 6V2M12 22v-4" /></svg>;
    case "step-allocate":
      return <svg {...props}><circle cx="12" cy="12" r="10" /><path d="M12 2a10 10 0 0110 10" /><path d="M12 12l5-5" /></svg>;
    case "step-details":
      return <svg {...props}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
    case "step-send":
      return <svg {...props}><path d="M22 2L11 13" /><path d="M22 2L15 22l-4-9-9-4 20-7z" /></svg>;
    case "check":
      return <svg {...props}><path d="M20 6L9 17l-5-5" /></svg>;
    /* Risk profile icons */
    case "shield":
      return <svg {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
    case "balance":
      return <svg {...props}><path d="M12 3v18" /><path d="M4.5 7.5L12 3l7.5 4.5" /><path d="M4.5 7.5l-2 8h7l-2-8" /><path d="M19.5 7.5l-2 8h7l-2-8" /></svg>;
    case "rocket":
      return <svg {...props}><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" /><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></svg>;
    case "bolt":
      return <svg {...props} fill="currentColor" stroke="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>;
    /* Misc */
    case "pencil":
      return <svg {...props}><path d="M17 3a2.83 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>;
    case "sparkle":
      return <svg {...props}><path d="M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-6.26L4 10l5.91-1.74L12 2z" /></svg>;
    default:
      return <svg {...props}><circle cx="12" cy="12" r="10" /></svg>;
  }
}

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface SelectedFund {
  name: string;
  allocation: number;
  isSpotlight: boolean;
}

type Step = "pick" | "allocate" | "details" | "review";

const STEPS: { key: Step; label: string; icon: string }[] = [
  { key: "pick", label: "Pick Funds", icon: "step-pick" },
  { key: "allocate", label: "Allocate %", icon: "step-allocate" },
  { key: "details", label: "Your Info", icon: "step-details" },
  { key: "review", label: "Send", icon: "step-send" },
];

const WA_NUMBER = "919209039205";

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function PortfolioBuilder() {
  const [step, setStep] = useState<Step>("pick");
  const [selected, setSelected] = useState<SelectedFund[]>([]);
  const [customFund, setCustomFund] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const tabsRef = useRef<HTMLDivElement>(null);

  // Personal details
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [riskProfile, setRiskProfile] = useState("");
  const [investmentMode, setInvestmentMode] = useState<"SIP" | "Lumpsum" | "Both">("SIP");

  // Fund info modal
  const [modalFund, setModalFund] = useState<{ fund: SpotlightFund; group: FundGroup } | null>(null);

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

  /* Search — filters across all tabs, shows flat results */
  const searchResults = useMemo(() => {
    if (!searchQuery) return null;
    const q = searchQuery.toLowerCase();
    return SPOTLIGHT_GROUPS.flatMap((g) =>
      g.funds.filter((f) => f.name.toLowerCase().includes(q)).map((f) => ({ fund: f, group: g }))
    );
  }, [searchQuery]);

  /* Active group */
  const activeGroup = SPOTLIGHT_GROUPS[activeTab];

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

  const stepIndex = STEPS.findIndex((s) => s.key === step);

  /* scroll active tab into view */
  useEffect(() => {
    if (!tabsRef.current) return;
    const btn = tabsRef.current.children[activeTab] as HTMLElement | undefined;
    btn?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeTab]);

  return (
    <div className="mx-auto max-w-5xl">
      {/* ── Step indicator ── */}
      <div className="mb-10 flex items-center justify-center gap-0">
        {STEPS.map((s, i) => (
          <div key={s.key} className="flex items-center">
            <button
              onClick={() => { if (i < stepIndex) setStep(s.key); }}
              className={cn(
                "flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300",
                i === stepIndex
                  ? "bg-crayola text-white shadow-glow scale-105"
                  : i < stepIndex
                  ? "bg-emerald-50 text-emerald-700 cursor-pointer hover:bg-emerald-100"
                  : "bg-mist text-slate2"
              )}
            >
              {i < stepIndex
                ? <Icon id="check" className="h-4 w-4" />
                : <Icon id={s.icon} className="h-4 w-4" />
              }
              <span className="hidden sm:inline">{s.label}</span>
            </button>
            {i < STEPS.length - 1 && (
              <div className={cn(
                "mx-1 h-0.5 w-8 rounded-full sm:w-16",
                i < stepIndex ? "bg-emerald-300" : "bg-black/[0.06]"
              )} />
            )}
          </div>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/*  STEP 1: Pick Funds                                            */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {step === "pick" && (
        <div className="space-y-5">
          {/* Search bar */}
          <div className="relative">
            <svg className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
            <input
              type="text"
              placeholder="Search spotlight funds..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 w-full rounded-2xl border border-black/[0.08] bg-white pl-12 pr-4 text-[15px] text-ink shadow-soft transition-all placeholder:text-slate2 focus:border-crayola focus:outline-none focus:ring-2 focus:ring-crayola/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate2 hover:text-ink"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            )}
          </div>

          {/* Category tabs — horizontal scroll */}
          {!searchQuery && (
            <div className="relative">
              <div
                ref={tabsRef}
                className="scrollbar-hide flex gap-2 overflow-x-auto pb-1"
              >
                {SPOTLIGHT_GROUPS.map((g, i) => {
                  const count = g.funds.filter((f) => isSelected(f.name)).length;
                  return (
                    <button
                      key={g.label}
                      onClick={() => setActiveTab(i)}
                      className={cn(
                        "relative flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-200",
                        activeTab === i
                          ? `${g.color} ${g.colorText} shadow-sm ring-1 ring-inset ring-black/[0.05]`
                          : "bg-white text-slate1 hover:bg-mist"
                      )}
                    >
                      <Icon id={g.icon} className="h-4 w-4" />
                      <span className="whitespace-nowrap">{g.label}</span>
                      {count > 0 && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-crayola text-[10px] font-bold text-white">
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {/* Fade edges */}
              <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-cloud to-transparent" />
            </div>
          )}

          {/* Fund grid — search results OR active tab */}
          <div className="min-h-[280px]">
            {searchQuery && searchResults ? (
              searchResults.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {searchResults.map(({ fund, group }) => (
                    <FundCard
                      key={fund.name}
                      fund={fund}
                      group={group}
                      selected={isSelected(fund.name)}
                      onToggle={() => toggleFund(fund.name, true)}
                      onInfo={() => setModalFund({ fund, group })}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-mist text-slate2">
                    <Icon id="search" className="h-6 w-6" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-ink">
                    No spotlight funds match &ldquo;{searchQuery}&rdquo;
                  </p>
                  <p className="mt-1 text-sm text-slate2">
                    You can still add it manually below.
                  </p>
                </div>
              )
            ) : (
              <>
                {/* Active group header */}
                <div className="mb-4 flex items-center gap-3">
                  <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", activeGroup.color, activeGroup.colorText)}>
                    <Icon id={activeGroup.icon} className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-title-s font-bold text-ink">{activeGroup.label}</h3>
                    <p className="text-xs text-slate2">{activeGroup.funds.length} funds</p>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {activeGroup.funds.map((fund) => (
                    <FundCard
                      key={fund.name}
                      fund={fund}
                      group={activeGroup}
                      selected={isSelected(fund.name)}
                      onToggle={() => toggleFund(fund.name, true)}
                      onInfo={() => setModalFund({ fund, group: activeGroup })}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Add custom fund — compact */}
          <div className="rounded-2xl border border-dashed border-yale/20 bg-gradient-to-r from-yale/[0.02] to-crayola/[0.02] p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-yale/10 text-yale">
                <Icon id="pencil" className="h-3.5 w-3.5" />
              </span>
              <p className="text-sm font-semibold text-yale">Add any fund by name</p>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. SBI Bluechip Fund, Mirae Asset Large Cap..."
                value={customFund}
                onChange={(e) => setCustomFund(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustomFund()}
                className="h-11 flex-1 rounded-xl border border-black/[0.08] bg-white px-4 text-sm text-ink shadow-soft focus:border-crayola focus:outline-none focus:ring-2 focus:ring-crayola/20"
              />
              <button
                onClick={addCustomFund}
                disabled={!customFund.trim()}
                className="h-11 rounded-xl bg-yale px-5 text-sm font-semibold text-white shadow-soft transition-all hover:bg-yale/90 hover:shadow-md disabled:opacity-40"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Selected summary — sticky bottom */}
          {selected.length > 0 && (
            <div className="sticky bottom-4 z-20 overflow-hidden rounded-2xl border border-black/[0.06] bg-white/95 shadow-lift backdrop-blur-sm">
              <div className="flex items-center justify-between px-5 py-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-crayola text-sm font-bold text-white">
                      {selected.length}
                    </span>
                    <span className="text-sm font-semibold text-ink">
                      fund{selected.length !== 1 ? "s" : ""} selected
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {selected.map((s) => (
                      <span
                        key={s.name}
                        className="group inline-flex items-center gap-1 rounded-lg bg-crayola/[0.07] px-2.5 py-1 text-xs font-medium text-yale transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        {s.name.length > 20 ? s.name.slice(0, 20) + "..." : s.name}
                        <button
                          onClick={() => toggleFund(s.name, s.isSpotlight)}
                          className="text-yale/50 group-hover:text-red-500"
                        >
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M18 6L6 18M6 6l12 12" /></svg>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setStep("allocate")}
                  disabled={!canProceedFromPick}
                  className="ml-4 h-12 shrink-0 rounded-xl bg-crayola px-6 text-sm font-bold text-white shadow-lift transition-all hover:bg-[#1262d6] hover:shadow-glow disabled:opacity-40"
                >
                  Allocate &rarr;
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/*  STEP 2: Allocate                                              */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {step === "allocate" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-title-s font-bold text-ink">Set your allocation</h3>
              <p className="mt-1 text-sm text-slate1">
                Distribute 100% across your {selected.length} funds.
              </p>
            </div>
            <button
              onClick={equalSplit}
              className="flex items-center gap-1.5 h-10 rounded-xl border border-yale/20 bg-yale/5 px-5 text-sm font-semibold text-yale transition-all hover:bg-yale/10"
            >
              <Icon id="zap" className="h-3.5 w-3.5" />
              Split equally
            </button>
          </div>

          {/* Progress ring + bar */}
          <div className="flex items-center gap-4 rounded-2xl border border-black/[0.06] bg-white p-4 shadow-soft">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
              <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
                <path
                  d="M18 2.0845a15.9155 15.9155 0 010 31.831 15.9155 15.9155 0 010-31.831"
                  fill="none"
                  stroke="#f0f0f0"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845a15.9155 15.9155 0 010 31.831 15.9155 15.9155 0 010-31.831"
                  fill="none"
                  stroke={totalAllocation === 100 ? "#10b981" : totalAllocation > 100 ? "#ef4444" : "#1570EF"}
                  strokeWidth="3"
                  strokeDasharray={`${Math.min(totalAllocation, 100)}, 100`}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              </svg>
              <span className={cn(
                "absolute text-sm font-bold",
                totalAllocation === 100 ? "text-emerald-600" : totalAllocation > 100 ? "text-red-600" : "text-crayola"
              )}>
                {totalAllocation}%
              </span>
            </div>
            <div className="flex-1">
              <p className={cn(
                "text-sm font-semibold",
                totalAllocation === 100 ? "text-emerald-600" : totalAllocation > 100 ? "text-red-600" : "text-ink"
              )}>
                {totalAllocation === 100 ? "Perfect! Allocation complete" :
                 totalAllocation > 100 ? `Exceeds by ${totalAllocation - 100}%` :
                 `${100 - totalAllocation}% remaining`}
              </p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-mist">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    totalAllocation === 100 ? "bg-emerald-500" : totalAllocation > 100 ? "bg-red-500" : "bg-crayola"
                  )}
                  style={{ width: `${Math.min(totalAllocation, 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {selected.map((fund, idx) => (
              <div
                key={fund.name}
                className="group rounded-2xl border border-black/[0.06] bg-white p-4 shadow-soft transition-all hover:shadow-md"
              >
                {/* Top row: number + name + remove */}
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-mist text-xs font-bold text-slate2">
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{fund.name}</p>
                    {fund.isSpotlight && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <Icon id="sparkle" className="h-3 w-3 text-amber-500" />
                        <span className="text-[11px] text-amber-600">Spotlight</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setSelected((prev) => prev.filter((s) => s.name !== fund.name))}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate2 transition-all hover:bg-red-50 hover:text-red-500"
                    title="Remove"
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                {/* Bottom row: allocation controls */}
                <div className="mt-3 flex items-center gap-2">
                  {/* Minus button */}
                  <button
                    onClick={() => updateAllocation(fund.name, Math.max(0, fund.allocation - 5))}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-black/[0.08] bg-cloud text-slate1 transition-all hover:bg-mist hover:text-ink active:scale-95"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" d="M5 12h14" /></svg>
                  </button>

                  {/* Slider — visible on all screens */}
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={fund.allocation}
                    onChange={(e) => updateAllocation(fund.name, Number(e.target.value))}
                    className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-mist accent-crayola [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-crayola [&::-webkit-slider-thumb]:shadow-md"
                  />

                  {/* Plus button */}
                  <button
                    onClick={() => updateAllocation(fund.name, Math.min(100, fund.allocation + 5))}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-black/[0.08] bg-cloud text-slate1 transition-all hover:bg-mist hover:text-ink active:scale-95"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" d="M12 5v14M5 12h14" /></svg>
                  </button>

                  {/* Number input */}
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      placeholder="0"
                      value={fund.allocation || ""}
                      onChange={(e) =>
                        updateAllocation(fund.name, Math.max(0, Math.min(100, Number(e.target.value) || 0)))
                      }
                      className="h-10 w-[4.5rem] rounded-xl border border-black/[0.08] bg-cloud pr-7 text-center text-sm font-bold text-ink transition-all focus:border-crayola focus:bg-white focus:outline-none focus:ring-2 focus:ring-crayola/20"
                    />
                    <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate2">%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={() => setStep("pick")}
              className="h-11 rounded-xl border border-black/[0.08] bg-white px-6 text-sm font-semibold text-ink shadow-soft transition-all hover:bg-cloud"
            >
              &larr; Back
            </button>
            <button
              onClick={() => setStep("details")}
              disabled={!canProceedFromAllocate}
              className="h-11 rounded-xl bg-crayola px-6 text-sm font-bold text-white shadow-lift transition-all hover:bg-[#1262d6] hover:shadow-glow disabled:opacity-40"
            >
              Continue &rarr;
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/*  STEP 3: Details                                               */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {step === "details" && (
        <div className="mx-auto max-w-lg space-y-6">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-crayola/10 text-crayola">
              <Icon id="step-details" className="h-7 w-7" />
            </div>
            <h3 className="mt-3 text-title-s font-bold text-ink">Almost there!</h3>
            <p className="mt-1 text-sm text-slate1">
              We&apos;ll use these details to reach out and help you invest.
            </p>
          </div>

          <div className="space-y-4 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-soft">
            <FieldInput label="Full Name" value={name} onChange={setName} placeholder="Your name" required />
            <FieldInput label="Phone" value={phone} onChange={setPhone} placeholder="+91 ..." required />
            <FieldInput label="Email" value={email} onChange={setEmail} placeholder="you@email.com" type="email" />
            <FieldInput label="Investment Amount" value={amount} onChange={setAmount} placeholder="e.g. 50,000" required />

            <div>
              <label className="mb-2 block text-sm font-semibold text-ink">Risk Profile</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "Conservative", icon: "shield" as const, desc: "Low risk" },
                  { value: "Moderate", icon: "balance" as const, desc: "Balanced" },
                  { value: "Aggressive", icon: "rocket" as const, desc: "High growth" },
                  { value: "Very Aggressive", icon: "bolt" as const, desc: "Max returns" },
                ].map((r) => (
                  <button
                    key={r.value}
                    onClick={() => setRiskProfile(r.value)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-xl border p-3 text-left transition-all",
                      riskProfile === r.value
                        ? "border-crayola bg-crayola/[0.06] shadow-sm"
                        : "border-black/[0.06] bg-white hover:border-yale/20 hover:bg-mist"
                    )}
                  >
                    <div className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                      riskProfile === r.value ? "bg-crayola/10 text-crayola" : "bg-mist text-slate2"
                    )}>
                      <Icon id={r.icon} className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className={cn("text-sm font-semibold", riskProfile === r.value ? "text-crayola" : "text-ink")}>{r.value}</p>
                      <p className="text-[11px] text-slate2">{r.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-ink">Investment Mode</label>
              <div className="flex gap-2">
                {(["SIP", "Lumpsum", "Both"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setInvestmentMode(m)}
                    className={cn(
                      "flex-1 rounded-xl border py-3 text-sm font-semibold transition-all",
                      investmentMode === m
                        ? "border-crayola bg-crayola/[0.06] text-crayola shadow-sm"
                        : "border-black/[0.06] bg-white text-slate1 hover:border-yale/20"
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
              &larr; Back
            </button>
            <button
              onClick={() => setStep("review")}
              disabled={!canProceedFromDetails}
              className="h-11 rounded-xl bg-crayola px-6 text-sm font-bold text-white shadow-lift transition-all hover:bg-[#1262d6] hover:shadow-glow disabled:opacity-40"
            >
              Review &rarr;
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/*  STEP 4: Review & Send                                         */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {step === "review" && (
        <div className="mx-auto max-w-lg space-y-6">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Icon id="check" className="h-7 w-7" />
            </div>
            <h3 className="mt-3 text-title-s font-bold text-ink">Your portfolio is ready!</h3>
            <p className="mt-1 text-sm text-slate1">
              Review everything, then send it to our team.
            </p>
          </div>

          {/* Portfolio summary */}
          <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-soft">
            <div className="border-b border-black/[0.06] bg-mist/50 px-6 py-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate2">
                Portfolio &mdash; {selected.length} fund{selected.length !== 1 ? "s" : ""}
              </h4>
            </div>
            <div className="divide-y divide-black/[0.04] px-6">
              {selected.map((fund, i) => (
                <div key={fund.name} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-crayola/10 text-xs font-bold text-crayola">
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium text-ink">{fund.name}</span>
                  </div>
                  <span className="rounded-lg bg-yale/10 px-2.5 py-1 text-sm font-bold text-yale">
                    {fund.allocation}%
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between border-t border-black/[0.06] bg-emerald-50/50 px-6 py-3">
              <span className="text-sm font-semibold text-emerald-700">Total</span>
              <span className="text-sm font-bold text-emerald-700">{totalAllocation}%</span>
            </div>
          </div>

          {/* Details summary */}
          <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-soft">
            <div className="border-b border-black/[0.06] bg-mist/50 px-6 py-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate2">
                Your Details
              </h4>
            </div>
            <div className="divide-y divide-black/[0.04] px-6">
              <DetailRow label="Name" value={name} />
              <DetailRow label="Phone" value={phone} />
              {email && <DetailRow label="Email" value={email} />}
              <DetailRow label="Amount" value={`₹${amount}`} />
              <DetailRow label="Risk Profile" value={riskProfile} />
              <DetailRow label="Mode" value={investmentMode} />
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={() => setStep("details")}
              className="h-11 rounded-xl border border-black/[0.08] bg-white px-6 text-sm font-semibold text-ink shadow-soft transition-all hover:bg-cloud"
            >
              &larr; Back
            </button>
            <button
              onClick={sendWhatsApp}
              className="group h-12 rounded-xl bg-[#25D366] px-8 text-sm font-bold text-white shadow-lift transition-all hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(37,211,102,0.35)]"
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

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/*  Fund Info Modal                                                */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {modalFund && (
        <FundInfoModal
          fund={modalFund.fund}
          group={modalFund.group}
          selected={isSelected(modalFund.fund.name)}
          onToggle={() => toggleFund(modalFund.fund.name, true)}
          onClose={() => setModalFund(null)}
        />
      )}

      {/* scrollbar-hide utility */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function FundCard({
  fund,
  group,
  selected,
  onToggle,
  onInfo,
}: {
  fund: SpotlightFund;
  group: FundGroup;
  selected: boolean;
  onToggle: () => void;
  onInfo: () => void;
}) {
  const amc = getAmcForName(fund.name);

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border-2 p-5 text-left transition-all duration-200 cursor-pointer",
        selected
          ? `${group.colorBorder} bg-white shadow-md scale-[1.02]`
          : "border-transparent bg-white shadow-soft hover:shadow-lg hover:scale-[1.01]"
      )}
      onClick={onInfo}
    >
      {/* Select checkbox — top right */}
      <button
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        className={cn(
          "absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full transition-all duration-200 z-10",
          selected
            ? "bg-crayola text-white scale-100"
            : "border-2 border-black/[0.08] bg-white scale-90 group-hover:border-yale/30 hover:border-crayola hover:bg-crayola/5"
        )}
        title={selected ? "Remove from portfolio" : "Add to portfolio"}
      >
        {selected && <Icon id="check" className="h-3.5 w-3.5" />}
      </button>

      {/* AMC logo + category badge row */}
      <div className="flex items-center gap-2">
        {amc ? (
          <img
            src={amc.logo}
            alt={amc.name}
            className="h-7 w-7 rounded-md object-contain bg-white ring-1 ring-black/[0.06]"
          />
        ) : (
          <span className={cn("flex h-7 w-7 items-center justify-center rounded-md", group.color, group.colorText)}>
            <Icon id={group.icon} className="h-3.5 w-3.5" />
          </span>
        )}
        <span className={cn("inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[11px] font-semibold", group.color, group.colorText)}>
          {fund.category}
        </span>
      </div>

      {/* Fund name */}
      <p className="mt-2.5 pr-8 text-[15px] font-bold leading-snug text-ink">
        {fund.name}
      </p>

      {/* AMC name + investor count */}
      <div className="mt-3 flex items-center justify-between">
        {amc && (
          <span className="text-[11px] font-medium text-slate2">{amc.name}</span>
        )}
        <span className="text-xs font-medium text-amber-700 ml-auto">
          {fund.investors.toLocaleString("en-IN")} invested
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Fund Info Modal                                                    */
/* ------------------------------------------------------------------ */

function FundInfoModal({
  fund,
  group,
  selected,
  onToggle,
  onClose,
}: {
  fund: SpotlightFund;
  group: FundGroup;
  selected: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const amc = getAmcForName(fund.name);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-slate2 transition-colors hover:bg-black/10 hover:text-ink"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Header with AMC branding */}
        <div className={cn("px-6 pt-6 pb-5", group.color)}>
          <div className="flex items-center gap-3">
            {amc ? (
              <img
                src={amc.logo}
                alt={amc.name}
                className="h-12 w-12 rounded-xl object-contain bg-white p-1 ring-1 ring-black/[0.06] shadow-sm"
              />
            ) : (
              <span className={cn("flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm", group.colorText)}>
                <Icon id={group.icon} className="h-6 w-6" />
              </span>
            )}
            <div className="min-w-0 flex-1 pr-8">
              <h3 className="text-lg font-bold leading-snug text-ink">{fund.name}</h3>
              {amc && <p className="mt-0.5 text-sm text-slate1">{amc.name}</p>}
            </div>
          </div>
        </div>

        {/* Fund details */}
        <div className="px-6 py-5 space-y-4">
          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-mist p-3">
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate2">Category</p>
              <p className="mt-1 text-sm font-semibold text-ink">{fund.category}</p>
            </div>
            <div className="rounded-xl bg-mist p-3">
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate2">Type</p>
              <p className="mt-1 text-sm font-semibold text-ink">{group.label}</p>
            </div>
            <div className="rounded-xl bg-mist p-3">
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate2">Investors</p>
              <p className="mt-1 text-sm font-semibold text-ink">{fund.investors.toLocaleString("en-IN")}+</p>
            </div>
            <div className="rounded-xl bg-mist p-3">
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate2">Plan</p>
              <p className="mt-1 text-sm font-semibold text-ink">Regular</p>
            </div>
          </div>

          {/* Spotlight badge */}
          <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-3">
            <Icon id="sparkle" className="h-4 w-4 text-amber-500" />
            <p className="text-sm font-medium text-amber-800">
              In the Spotlight — curated by ML Research
            </p>
          </div>

          {/* Disclaimer */}
          <p className="text-[11px] leading-relaxed text-slate2">
            Mutual fund investments are subject to market risks. Read all scheme-related documents carefully.
            Past performance is not indicative of future results.
          </p>
        </div>

        {/* Action bar */}
        <div className="flex gap-3 border-t border-black/[0.06] bg-mist/30 px-6 py-4">
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-xl border border-black/[0.08] bg-white text-sm font-semibold text-ink transition-all hover:bg-cloud"
          >
            Close
          </button>
          <button
            onClick={() => { onToggle(); onClose(); }}
            className={cn(
              "flex-1 h-11 rounded-xl text-sm font-bold transition-all",
              selected
                ? "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                : "bg-crayola text-white shadow-lift hover:bg-[#1262d6] hover:shadow-glow"
            )}
          >
            {selected ? "Remove from Portfolio" : "Add to Portfolio"}
          </button>
        </div>
      </div>
    </div>
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
    <div className="flex justify-between py-2.5">
      <span className="text-sm text-slate2">{label}</span>
      <span className="text-sm font-semibold text-ink">{value}</span>
    </div>
  );
}
