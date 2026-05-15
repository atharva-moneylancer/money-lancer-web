/**
 * NewsAPI client — https://newsapi.org
 * Free tier: 100 req/day (developer plan, server-side only).
 *
 * Revalidate is set to 1800s (30 min) so at most ~48 req/day are made,
 * well within the free limit even on a busy day.
 */

const KEY = process.env.NEWS_API_KEY ?? "";
const BASE = "https://newsapi.org/v2";

export type Article = {
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  source: string;
  author: string | null;
};

type RawArticle = {
  title?: string;
  description?: string | null;
  url?: string;
  urlToImage?: string | null;
  publishedAt?: string;
  source?: { name?: string };
  author?: string | null;
};

function clean(raw: RawArticle[]): Article[] {
  return raw
    .filter(
      (a) =>
        a.title &&
        a.title !== "[Removed]" &&
        a.url &&
        !a.url.includes("removed")
    )
    .map((a) => ({
      title: a.title!,
      description: a.description ?? null,
      url: a.url!,
      urlToImage: a.urlToImage ?? null,
      publishedAt: a.publishedAt ?? "",
      source: a.source?.name ?? "Unknown",
      author: a.author ?? null,
    }));
}

async function newsApiFetch(
  endpoint: string,
  params: Record<string, string>
): Promise<Article[]> {
  if (!KEY) return [];
  const url = new URL(`${BASE}/${endpoint}`);
  url.searchParams.set("apiKey", KEY);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url.toString(), {
    next: { revalidate: 86400 },
  });
  if (!res.ok) {
    console.warn("[news] NewsAPI error", res.status);
    return [];
  }
  const json = (await res.json()) as { articles?: RawArticle[] };
  return clean(json.articles ?? []);
}

/** Top Indian business headlines — used on the homepage strip. */
export async function getTopFinanceNews(count = 6): Promise<Article[]> {
  const articles = await newsApiFetch("top-headlines", {
    country: "in",
    category: "business",
    pageSize: String(Math.min(count, 20)),
  });
  return articles.slice(0, count);
}

/** Targeted mutual-fund / markets news — used on /insights full page. */
export async function getInsightsNews(
  topic: "markets" | "mutual-funds" | "tax" | "economy" = "markets",
  count = 12
): Promise<Article[]> {
  const queries: Record<typeof topic, string> = {
    markets:       "Nifty OR Sensex OR BSE OR NSE OR Indian stock market",
    "mutual-funds": "mutual fund OR SIP OR SEBI OR AMC OR NAV India",
    tax:           "income tax India OR capital gains OR ELSS OR 80C",
    economy:       "RBI OR repo rate OR inflation India OR GDP India",
  };

  const articles = await newsApiFetch("everything", {
    q: queries[topic],
    language: "en",
    sortBy: "publishedAt",
    pageSize: String(Math.min(count, 20)),
  });
  return articles.slice(0, count);
}

/** Relative time label, e.g. "2 hours ago" */
export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
