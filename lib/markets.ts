/**
 * Server-side market quotes.
 *
 * Primary  → Twelve Data (set TWELVE_DATA_API_KEY in .env.local)
 *             Free tier: 800 credits/day. At 10-min revalidation and 4
 *             symbols per batch call that's ~384 credits/day — well within limits.
 *
 * Fallback → Stooq (indices + gold) + Frankfurter (USD/INR)
 *             No API key required; works immediately out of the box.
 *
 * Twelve Data symbols:
 *   NIFTY50    NIFTY 50 index
 *   SENSEX     BSE SENSEX index
 *   XAU/USD    Gold spot (USD per troy oz)
 *   USD/INR    Forex pair
 *
 * Stooq symbols (fallback):
 *   ^nfu       NIFTY 50
 *   ^bsesn     BSE SENSEX
 *   xauusd     Gold spot
 */

export type Quote = {
  label: string;
  value: string;
  delta: string; // e.g. "+0.42%"
  up: boolean;
};

const TD_KEY = process.env.TWELVE_DATA_API_KEY ?? "";

const fmt = (v: number, d: number) =>
  v.toLocaleString("en-IN", { minimumFractionDigits: d, maximumFractionDigits: d });

const fmtDelta = (v: number) => `${v >= 0 ? "+" : ""}${v.toFixed(2)}%`;

const GOLD_OZ_TO_10G = 10 / 31.1034768;

const FALLBACK: Quote[] = [
  { label: "NIFTY 50",   value: "—", delta: "—", up: true },
  { label: "SENSEX",     value: "—", delta: "—", up: true },
  { label: "GOLD ₹/10g", value: "—", delta: "—", up: true },
  { label: "USD / INR",  value: "—", delta: "—", up: true },
];

// ─── Twelve Data ─────────────────────────────────────────────────────────────

type TDQuote = {
  close?: string;
  percent_change?: string;
  status?: string;
};

async function fetchTwelveData(): Promise<Quote[]> {
  const symbols = "NIFTY50,SENSEX,XAU/USD,USD/INR";
  const url = `https://api.twelvedata.com/quote?symbol=${symbols}&apikey=${TD_KEY}`;

  const res = await fetch(url, { next: { revalidate: 600 } });
  if (!res.ok) throw new Error(`TwelveData HTTP ${res.status}`);

  const json = (await res.json()) as Record<string, TDQuote>;

  // API returns { code, message } at top level on auth errors
  if ((json as any).code) throw new Error((json as any).message ?? "TwelveData error");

  const get = (sym: string): TDQuote => json[sym] ?? {};
  const price = (q: TDQuote) => parseFloat(q.close ?? "0") || 0;
  const pct   = (q: TDQuote) => parseFloat(q.percent_change ?? "0") || 0;

  const nifty  = get("NIFTY50");
  const sensex = get("SENSEX");
  const gold   = get("XAU/USD");
  const usdInr = get("USD/INR");

  const usdInrPrice  = price(usdInr);
  const goldOzUsd    = price(gold);
  const goldInr10g   = goldOzUsd && usdInrPrice
    ? goldOzUsd * usdInrPrice * GOLD_OZ_TO_10G
    : 0;

  const niftyPct  = pct(nifty);
  const sensexPct = pct(sensex);
  const goldPct   = pct(gold);
  const inrPct    = pct(usdInr);

  return [
    {
      label: "NIFTY 50",
      value: price(nifty) ? fmt(price(nifty), 2) : "—",
      delta: fmtDelta(niftyPct),
      up: niftyPct >= 0,
    },
    {
      label: "SENSEX",
      value: price(sensex) ? fmt(price(sensex), 2) : "—",
      delta: fmtDelta(sensexPct),
      up: sensexPct >= 0,
    },
    {
      label: "GOLD ₹/10g",
      value: goldInr10g ? fmt(goldInr10g, 0) : "—",
      delta: fmtDelta(goldPct),
      up: goldPct >= 0,
    },
    {
      label: "USD / INR",
      value: usdInrPrice ? fmt(usdInrPrice, 2) : "—",
      delta: fmtDelta(inrPct),
      up: inrPct >= 0,
    },
  ];
}

// ─── Yahoo Finance + Frankfurter fallback ────────────────────────────────────

type YFMeta = {
  regularMarketPrice?: number;
  chartPreviousClose?: number;
  previousClose?: number;
  regularMarketChangePercent?: number;
};

async function yfChart(symbol: string): Promise<YFMeta | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=2d`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        "Accept": "application/json",
      },
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.chart?.result?.[0]?.meta ?? null;
  } catch {
    return null;
  }
}

function yfDelta(meta: YFMeta | null): number {
  if (!meta) return 0;
  if (meta.regularMarketChangePercent != null) return meta.regularMarketChangePercent;
  const price = meta.regularMarketPrice ?? 0;
  const prev  = meta.chartPreviousClose ?? meta.previousClose ?? 0;
  return prev > 0 ? ((price - prev) / prev) * 100 : 0;
}

async function fetchFallback(): Promise<Quote[]> {
  // Yahoo Finance: ^NSEI = NIFTY 50, ^BSESN = SENSEX, GC=F = Gold (USD/oz), USDINR=X = USD/INR
  const [nifty, sensex, gold, usdInrYF, fxRes] = await Promise.all([
    yfChart("^NSEI"),
    yfChart("^BSESN"),
    yfChart("GC=F"),
    yfChart("USDINR=X"),
    fetch("https://api.frankfurter.app/latest?from=USD&to=INR", {
      next: { revalidate: 300 },
    }).then((r) => r.json()).catch(() => null) as Promise<{ rates?: { INR?: number } } | null>,
  ]);

  // Prefer Yahoo Finance for USD/INR; Frankfurter as backup
  const inrRate = (usdInrYF?.regularMarketPrice ?? 0) || (fxRes?.rates?.INR ?? 0);
  const goldUsd = gold?.regularMarketPrice ?? 0;
  const goldInr10g = goldUsd && inrRate ? goldUsd * inrRate * GOLD_OZ_TO_10G : 0;

  const niftyPrice  = nifty?.regularMarketPrice  ?? 0;
  const sensexPrice = sensex?.regularMarketPrice ?? 0;

  return [
    {
      label: "NIFTY 50",
      value: niftyPrice  ? fmt(niftyPrice, 2)  : "—",
      delta: fmtDelta(yfDelta(nifty)),
      up: yfDelta(nifty) >= 0,
    },
    {
      label: "SENSEX",
      value: sensexPrice ? fmt(sensexPrice, 2) : "—",
      delta: fmtDelta(yfDelta(sensex)),
      up: yfDelta(sensex) >= 0,
    },
    {
      label: "GOLD ₹/10g",
      value: goldInr10g  ? fmt(goldInr10g, 0)  : "—",
      delta: fmtDelta(yfDelta(gold)),
      up: yfDelta(gold) >= 0,
    },
    {
      label: "USD / INR",
      value: inrRate     ? fmt(inrRate, 2)      : "—",
      delta: fmtDelta(yfDelta(usdInrYF)),
      up: yfDelta(usdInrYF) >= 0,
    },
  ];
}

// ─── Main export ─────────────────────────────────────────────────────────────

export async function getMarketQuotes(): Promise<Quote[]> {
  // Use Twelve Data if key is configured; otherwise fall back to Stooq
  if (TD_KEY) {
    try {
      return await fetchTwelveData();
    } catch (e) {
      console.warn("[markets] Twelve Data failed, falling back to Stooq:", e);
    }
  }

  try {
    return await fetchFallback();
  } catch {
    return FALLBACK;
  }
}
