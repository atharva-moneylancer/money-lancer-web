"use client";
import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionEyebrow } from "@/components/home/Services";
import { Button } from "@/components/ui/Button";

// Metadata export is not supported in client components — set it in a parent layout if needed.

const QUESTIONS = [
  {
    q: "What's your primary investment goal?",
    options: [
      { label: "Capital preservation — protect what I have", score: 1 },
      { label: "Steady income with low volatility", score: 2 },
      { label: "Balanced growth and income", score: 3 },
      { label: "Long-term wealth creation, can ride volatility", score: 4 },
      { label: "Aggressive growth, willing to take big swings", score: 5 },
    ],
  },
  {
    q: "How long can you keep this money invested?",
    options: [
      { label: "Less than 1 year", score: 1 },
      { label: "1–3 years", score: 2 },
      { label: "3–5 years", score: 3 },
      { label: "5–10 years", score: 4 },
      { label: "More than 10 years", score: 5 },
    ],
  },
  {
    q: "If your portfolio fell 20% in 3 months, you would:",
    options: [
      { label: "Sell everything immediately", score: 1 },
      { label: "Sell some to limit losses", score: 2 },
      { label: "Hold and wait it out", score: 3 },
      { label: "Continue my regular SIPs", score: 4 },
      { label: "Invest more — it's a sale", score: 5 },
    ],
  },
  {
    q: "Your annual income relative to your expenses:",
    options: [
      { label: "I just about break even", score: 1 },
      { label: "I save 10–20%", score: 2 },
      { label: "I save 20–30%", score: 3 },
      { label: "I save 30–50%", score: 4 },
      { label: "I save more than 50%", score: 5 },
    ],
  },
  {
    q: "Have you invested in equity or equity mutual funds before?",
    options: [
      { label: "No, this would be my first time", score: 1 },
      { label: "A little — through ULIPs / NPS", score: 2 },
      { label: "Yes, with mixed results", score: 3 },
      { label: "Yes, regularly for 2+ years", score: 4 },
      { label: "Yes, I trade actively or invest large amounts", score: 5 },
    ],
  },
  {
    q: "Your job and income stability:",
    options: [
      { label: "Variable / contract-based", score: 2 },
      { label: "Self-employed / business owner", score: 3 },
      { label: "Salaried in a private firm", score: 4 },
      { label: "Salaried in a government / PSU role", score: 5 },
    ],
  },
  {
    q: "Existing emergency fund — months of expenses covered:",
    options: [
      { label: "None", score: 1 },
      { label: "1–2 months", score: 2 },
      { label: "3–6 months", score: 3 },
      { label: "6–12 months", score: 4 },
      { label: "More than 12 months", score: 5 },
    ],
  },
  {
    q: "Your age:",
    options: [
      { label: "Over 60", score: 1 },
      { label: "50–60", score: 2 },
      { label: "40–50", score: 3 },
      { label: "30–40", score: 4 },
      { label: "Under 30", score: 5 },
    ],
  },
  {
    q: "Dependents who rely on your income:",
    options: [
      { label: "Multiple, including elderly parents and children", score: 2 },
      { label: "Spouse and 1+ children", score: 3 },
      { label: "Spouse only", score: 4 },
      { label: "No financial dependents", score: 5 },
    ],
  },
  {
    q: "What return do you expect from this investment over the long run?",
    options: [
      { label: "Beat inflation (6–7% p.a.)", score: 2 },
      { label: "Beat FD significantly (10–12% p.a.)", score: 3 },
      { label: "Equity-like returns (12–15% p.a.)", score: 4 },
      { label: "Aggressive (15%+ p.a., I know it's not guaranteed)", score: 5 },
    ],
  },
];

const PROFILES = [
  { min: 0, max: 18, name: "Conservative", color: "text-success", alloc: { equity: 15, debt: 65, gold: 10, cash: 10 }, summary: "Capital preservation comes first. Equity is a small share to outpace inflation; the bulk sits in high-quality debt and cash equivalents." },
  { min: 19, max: 28, name: "Moderate", color: "text-yale", alloc: { equity: 40, debt: 45, gold: 10, cash: 5 }, summary: "A balanced mix. Enough equity to grow real wealth over a decade, enough debt to stay calm through corrections." },
  { min: 29, max: 38, name: "Moderately Aggressive", color: "text-crayola", alloc: { equity: 65, debt: 25, gold: 5, cash: 5 }, summary: "Growth-focused with shock absorbers. Equity does the heavy lifting; debt smooths the ride." },
  { min: 39, max: 50, name: "Aggressive", color: "text-critical", alloc: { equity: 80, debt: 10, gold: 5, cash: 5 }, summary: "Wealth creation is the goal and you can stomach volatility. Almost entirely equity, diversified across caps and geographies." },
];

export default function RiskProfilerPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  const handle = (score: number) => {
    const next = [...answers, score];
    setAnswers(next);
    if (step + 1 >= QUESTIONS.length) setDone(true);
    else setStep(step + 1);
  };

  const total = answers.reduce((a, b) => a + b, 0);
  const profile = PROFILES.find((p) => total >= p.min && total <= p.max) ?? PROFILES[1];
  const progress = (step / QUESTIONS.length) * 100;

  if (done) {
    return (
      <div className="bg-mesh-soft pt-28">
        <Container className="pb-24">
          <SectionEyebrow label="Your risk profile" />
          <h1 className={`mt-4 font-display text-headline font-bold tracking-tight ${profile.color}`}>{profile.name}</h1>
          <p className="mt-4 max-w-2xl text-body-l text-slate1">{profile.summary}</p>

          <div className="mt-12 grid gap-6 lg:grid-cols-[2fr,1fr]">
            <div className="rounded-2xl border border-black/[0.06] bg-white p-8 shadow-soft">
              <h2 className="text-title-m font-bold text-yale">Suggested allocation</h2>
              <div className="mt-6 space-y-4">
                <AllocBar label="Equity" pct={profile.alloc.equity} color="bg-crayola" />
                <AllocBar label="Debt" pct={profile.alloc.debt} color="bg-yale" />
                <AllocBar label="Gold" pct={profile.alloc.gold} color="bg-gold" />
                <AllocBar label="Cash" pct={profile.alloc.cash} color="bg-mist" />
              </div>
              <p className="mt-8 text-xs leading-relaxed text-slate2">
                This is a directional starting point. Your final allocation should account for your specific goals, taxes,
                existing investments and any liquidity needs — which we'll work out together.
              </p>
            </div>

            <div className="rounded-2xl bg-navy p-7 text-white">
              <h3 className="text-title-s font-semibold">Get a personalised portfolio</h3>
              <p className="mt-2 text-sm text-white/75">
                We'll translate this into specific funds across your equity, debt and gold buckets — chosen to match your tax bracket and horizon.
              </p>
              <Button variant="light" href="/#contact" className="mt-5 w-full">Book a free consultation</Button>
            </div>
          </div>

          <div className="mt-12 flex gap-3">
            <Button variant="secondary" onClick={() => { setStep(0); setAnswers([]); setDone(false); }}>Retake the quiz</Button>
            <Button variant="ghost" href="/calculators" className="border border-black/10">Try the calculators</Button>
          </div>
        </Container>
      </div>
    );
  }

  const current = QUESTIONS[step];

  return (
    <div className="bg-mesh-soft pt-28">
      <Container className="pb-24">
        <SectionEyebrow label="Risk profiler" />
        <h1 className="mt-4 max-w-3xl font-display text-headline font-bold tracking-tight text-ink">
          Find your investing personality.
        </h1>
        <p className="mt-4 max-w-2xl text-body-l text-slate1">
          10 quick questions. We'll suggest a starting allocation across equity, debt, gold and cash that fits how you actually invest.
        </p>

        <div className="mt-10 max-w-3xl">
          <div className="flex items-center justify-between text-xs text-slate2">
            <span>Question {step + 1} of {QUESTIONS.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-mist">
            <div className="h-full bg-crayola transition-all" style={{ width: `${progress + 100/QUESTIONS.length}%` }} />
          </div>

          <div className="mt-10 rounded-2xl border border-black/[0.06] bg-white p-8 shadow-lift md:p-10">
            <h2 className="text-title-m font-bold text-ink">{current.q}</h2>
            <div className="mt-6 space-y-3">
              {current.options.map((o) => (
                <button
                  key={o.label}
                  onClick={() => handle(o.score)}
                  className="group flex w-full items-center justify-between rounded-xl border border-black/[0.06] bg-cloud px-5 py-4 text-left transition-all hover:border-crayola hover:bg-white hover:shadow-soft"
                >
                  <span className="text-sm font-medium text-graphite group-hover:text-crayola">{o.label}</span>
                  <svg className="h-4 w-4 text-slate2 transition-all group-hover:translate-x-1 group-hover:text-crayola" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              ))}
            </div>
            {step > 0 && (
              <button onClick={() => { setStep(step - 1); setAnswers(answers.slice(0, -1)); }} className="mt-6 text-xs font-semibold text-slate2 hover:text-graphite">
                ← Previous question
              </button>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

function AllocBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-graphite">{label}</span>
        <span className="tabular text-base font-semibold text-yale">{pct}%</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-cloud">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
