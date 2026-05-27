/**
 * Curated fund universe for the Portfolio Builder.
 * "In the Spotlight" funds selected by ML Research team.
 * Clients can also add any fund by name (free-text).
 */

export interface SpotlightFund {
  name: string;
  category: string;
  /** Pseudo-random "investor count" seeded from fund name — stable across renders. */
  investors: number;
}

export interface FundGroup {
  label: string;
  icon: string;
  color: string;          // tailwind bg class for the category pill
  colorText: string;      // tailwind text class
  colorBorder: string;    // tailwind border class for selected card
  funds: SpotlightFund[];
}

/* ---------- deterministic pseudo-random 800-1900 from fund name ---------- */
function seedFromName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return 800 + (Math.abs(h) % 1101); // 800..1900
}

function sf(name: string, category: string): SpotlightFund {
  return { name, category, investors: seedFromName(name) };
}

/** Spotlight funds grouped by category — curated by ML Research. */
export const SPOTLIGHT_GROUPS: FundGroup[] = [
  {
    label: "Large & Mid Cap",
    icon: "📊",
    color: "bg-blue-50", colorText: "text-blue-700", colorBorder: "border-blue-400",
    funds: [
      sf("Bandhan Large & Midcap Fund", "Large & Mid Cap"),
      sf("DSP Large & Midcap Fund", "Large & Mid Cap"),
      sf("Axis Large & Midcap Fund", "Large & Mid Cap"),
    ],
  },
  {
    label: "Mid Cap",
    icon: "🚀",
    color: "bg-indigo-50", colorText: "text-indigo-700", colorBorder: "border-indigo-400",
    funds: [
      sf("Edelweiss Midcap Fund", "Mid Cap"),
      sf("Whiteoak Midcap Fund", "Mid Cap"),
      sf("HDFC Midcap Fund", "Mid Cap"),
    ],
  },
  {
    label: "Small Cap",
    icon: "⚡",
    color: "bg-purple-50", colorText: "text-purple-700", colorBorder: "border-purple-400",
    funds: [
      sf("Bandhan Smallcap Fund", "Small Cap"),
      sf("Invesco India Smallcap Fund", "Small Cap"),
      sf("Mahindra Smallcap Fund", "Small Cap"),
    ],
  },
  {
    label: "Flexi Cap",
    icon: "🔄",
    color: "bg-cyan-50", colorText: "text-cyan-700", colorBorder: "border-cyan-400",
    funds: [
      sf("Bajaj Flexi Cap Fund", "Flexi Cap"),
      sf("WhiteOak Capital Flexi Cap Fund", "Flexi Cap"),
      sf("PPFAS Flexi Cap Fund", "Flexi Cap"),
    ],
  },
  {
    label: "Multi Cap",
    icon: "🎯",
    color: "bg-teal-50", colorText: "text-teal-700", colorBorder: "border-teal-400",
    funds: [
      sf("Kotak Multi Cap Fund", "Multi Cap"),
      sf("Axis Multi Cap Fund", "Multi Cap"),
      sf("Nippon Multi Cap Fund", "Multi Cap"),
    ],
  },
  {
    label: "Focused",
    icon: "🔍",
    color: "bg-sky-50", colorText: "text-sky-700", colorBorder: "border-sky-400",
    funds: [
      sf("HDFC Focused Equity Fund", "Focused"),
      sf("ICICI Pru Focused Equity Fund", "Focused"),
      sf("Mahindra Manulife Focused Fund", "Focused"),
    ],
  },
  {
    label: "Hybrid",
    icon: "⚖️",
    color: "bg-emerald-50", colorText: "text-emerald-700", colorBorder: "border-emerald-400",
    funds: [
      sf("ICICI Pru Equity & Debt Fund", "Aggressive Hybrid"),
      sf("Edelweiss Aggressive Hybrid Fund", "Aggressive Hybrid"),
      sf("Bank of India Mid & Small Cap Equity & Debt Fund", "Aggressive Hybrid"),
    ],
  },
  {
    label: "Multi-Asset",
    icon: "🧩",
    color: "bg-lime-50", colorText: "text-lime-700", colorBorder: "border-lime-500",
    funds: [
      sf("Kotak Multi-asset Allocation Fund", "Multi Asset"),
      sf("DSP Multi-asset Allocation Fund", "Multi Asset"),
      sf("Nippon India Multi-Asset Omni FoF", "Multi Asset FoF"),
    ],
  },
  {
    label: "Savings & Liquid",
    icon: "💧",
    color: "bg-green-50", colorText: "text-green-700", colorBorder: "border-green-400",
    funds: [
      sf("ICICI Equity Savings Fund", "Equity Savings"),
      sf("ICICI Ultra-short Fund", "Ultra Short Duration"),
    ],
  },
  {
    label: "Life Goals",
    icon: "🎓",
    color: "bg-amber-50", colorText: "text-amber-700", colorBorder: "border-amber-400",
    funds: [
      sf("HDFC Retirement Fund", "Retirement"),
      sf("HDFC Children's Fund", "Children"),
      sf("SBI Children's Fund", "Children"),
    ],
  },
  {
    label: "Thematic",
    icon: "🔥",
    color: "bg-orange-50", colorText: "text-orange-700", colorBorder: "border-orange-400",
    funds: [
      sf("ICICI India Opportunities Fund", "Thematic"),
      sf("Mahindra Business Cycle Fund", "Thematic"),
      sf("Franklin India Opportunities Fund", "Thematic"),
      sf("ICICI Thematic Advantage Fund", "Thematic"),
      sf("Sundaram Services Fund", "Sectoral"),
      sf("Kotak Pioneer Fund", "Thematic"),
    ],
  },
  {
    label: "Global",
    icon: "🌍",
    color: "bg-violet-50", colorText: "text-violet-700", colorBorder: "border-violet-400",
    funds: [
      sf("DSP Global Equity Fund", "International"),
      sf("Whiteoak Ashoka Emerging Markets Fund", "International"),
      sf("Edelweiss Gold & Silver ETF FOF", "Gold"),
      sf("Kotak Gold FOF", "Gold"),
    ],
  },
  {
    label: "SIF",
    icon: "💎",
    color: "bg-rose-50", colorText: "text-rose-700", colorBorder: "border-rose-400",
    funds: [
      sf("ITI Diviniti SIF", "SIF"),
      sf("ICICI Pru Ex Top 100 SIF", "SIF"),
    ],
  },
  {
    label: "PMS",
    icon: "🏛️",
    color: "bg-slate-100", colorText: "text-slate-700", colorBorder: "border-slate-400",
    funds: [
      sf("Ckredence Wealth PMS", "PMS"),
      sf("Philips Capital PMS", "PMS"),
    ],
  },
  {
    label: "IDCW",
    icon: "💰",
    color: "bg-yellow-50", colorText: "text-yellow-700", colorBorder: "border-yellow-400",
    funds: [
      sf("Bandhan Aggressive Hybrid Fund – IDCW", "IDCW"),
    ],
  },
];

/** Flat list of all spotlight fund names for quick lookup. */
export const ALL_SPOTLIGHT_NAMES = new Set(
  SPOTLIGHT_GROUPS.flatMap((g) => g.funds.map((f) => f.name))
);
