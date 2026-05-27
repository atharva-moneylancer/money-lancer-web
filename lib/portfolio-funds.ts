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
    funds: [
      sf("Bandhan Large & Midcap Fund", "Large & Mid Cap"),
      sf("DSP Large & Midcap Fund", "Large & Mid Cap"),
      sf("Axis Large & Midcap Fund", "Large & Mid Cap"),
    ],
  },
  {
    label: "Mid Cap",
    funds: [
      sf("Edelweiss Midcap Fund", "Mid Cap"),
      sf("Whiteoak Midcap Fund", "Mid Cap"),
      sf("HDFC Midcap Fund", "Mid Cap"),
    ],
  },
  {
    label: "Small Cap",
    funds: [
      sf("Bandhan Smallcap Fund", "Small Cap"),
      sf("Invesco India Smallcap Fund", "Small Cap"),
      sf("Mahindra Smallcap Fund", "Small Cap"),
    ],
  },
  {
    label: "Flexi Cap",
    funds: [
      sf("Bajaj Flexi Cap Fund", "Flexi Cap"),
      sf("WhiteOak Capital Flexi Cap Fund", "Flexi Cap"),
      sf("PPFAS Flexi Cap Fund", "Flexi Cap"),
    ],
  },
  {
    label: "Multi Cap",
    funds: [
      sf("Kotak Multi Cap Fund", "Multi Cap"),
      sf("Axis Multi Cap Fund", "Multi Cap"),
      sf("Nippon Multi Cap Fund", "Multi Cap"),
    ],
  },
  {
    label: "Focused Fund",
    funds: [
      sf("HDFC Focused Equity Fund", "Focused"),
      sf("ICICI Pru Focused Equity Fund", "Focused"),
      sf("Mahindra Manulife Focused Fund", "Focused"),
    ],
  },
  {
    label: "Aggressive Hybrid",
    funds: [
      sf("ICICI Pru Equity & Debt Fund", "Aggressive Hybrid"),
      sf("Edelweiss Aggressive Hybrid Fund", "Aggressive Hybrid"),
      sf("Bank of India Mid & Small Cap Equity & Debt Fund", "Aggressive Hybrid"),
    ],
  },
  {
    label: "Multi-Asset Allocation",
    funds: [
      sf("Kotak Multi-asset Allocation Fund", "Multi Asset"),
      sf("DSP Multi-asset Allocation Fund", "Multi Asset"),
      sf("Nippon India Multi-Asset Omni FoF", "Multi Asset FoF"),
    ],
  },
  {
    label: "Equity Savings & Liquid",
    funds: [
      sf("ICICI Equity Savings Fund", "Equity Savings"),
      sf("ICICI Ultra-short Fund", "Ultra Short Duration"),
    ],
  },
  {
    label: "Solution-Oriented",
    funds: [
      sf("HDFC Retirement Fund", "Retirement"),
      sf("HDFC Children's Fund", "Children"),
      sf("SBI Children's Fund", "Children"),
    ],
  },
  {
    label: "Thematic & Sectoral",
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
    label: "International & Commodities",
    funds: [
      sf("DSP Global Equity Fund", "International"),
      sf("Whiteoak Ashoka Emerging Markets Fund", "International"),
      sf("Edelweiss Gold & Silver ETF FOF", "Gold"),
      sf("Kotak Gold FOF", "Gold"),
    ],
  },
  {
    label: "SIF (₹10L min)",
    funds: [
      sf("ITI Diviniti SIF", "SIF"),
      sf("ICICI Pru Ex Top 100 SIF", "SIF"),
    ],
  },
  {
    label: "PMS",
    funds: [
      sf("Ckredence Wealth PMS", "PMS"),
      sf("Philips Capital PMS", "PMS"),
    ],
  },
  {
    label: "IDCW",
    funds: [
      sf("Bandhan Aggressive Hybrid Fund – IDCW", "IDCW"),
    ],
  },
];

/** Flat list of all spotlight fund names for quick lookup. */
export const ALL_SPOTLIGHT_NAMES = new Set(
  SPOTLIGHT_GROUPS.flatMap((g) => g.funds.map((f) => f.name))
);
