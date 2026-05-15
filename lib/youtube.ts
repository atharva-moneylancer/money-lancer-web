/**
 * YouTube video feed for Money Lancer.
 *
 * Two backends:
 *
 *   1. RSS feed (default — no API key needed).
 *      Returns the latest 15 videos. Limited metadata (no view counts,
 *      no playlist info, no duration), but rock-solid and free.
 *
 *   2. YouTube Data API v3 (if YOUTUBE_API_KEY is set).
 *      Richer metadata — view counts, durations, descriptions, playlists.
 *
 * Configure via `.env.local`:
 *   YOUTUBE_CHANNEL_ID         (preferred — e.g. UC1234567890abcdef)
 *   YOUTUBE_CHANNEL_HANDLE     (fallback — e.g. @moneylancer)
 *   YOUTUBE_API_KEY            (optional — upgrades to Data API)
 */

export type YouTubeVideo = {
  id: string;
  title: string;
  description?: string;
  thumbnail: string;
  publishedAt: string;
  channelTitle?: string;
  viewCount?: number;
  duration?: string; // ISO 8601 PT#M#S (when using Data API)
  /** True if this isn't a real video — UI should hide the section or mark as preview. */
  isFallback?: boolean;
};

export function isRealVideo(v: YouTubeVideo) {
  return !v.isFallback && !!v.id && !v.id.startsWith("demo");
}

// Read env at call-time so a `.env.local` change picks up after restart even
// if hot-reload re-evaluates module init. (process.env is always live in Node.)
const getEnv = () => ({
  channelId: process.env.YOUTUBE_CHANNEL_ID || "",
  channelHandle: process.env.YOUTUBE_CHANNEL_HANDLE || "",
  apiKey: process.env.YOUTUBE_API_KEY || "",
});

const FALLBACK_VIDEOS: YouTubeVideo[] = [
  // Marked isFallback: true so the UI knows to hide the section instead of
  // pretending these are real.
  {
    id: "demo1",
    title: "How to choose your first mutual fund (5-step framework)",
    description: "Preview placeholder — connect a YOUTUBE_CHANNEL_ID to see real videos.",
    thumbnail: "/amcs/hdfc.webp",
    publishedAt: "2026-05-01T10:00:00Z",
    channelTitle: "Money Lancer Investments",
    isFallback: true,
  },
];

/** Resolve a channel handle (e.g. "@moneylancer") to a channel ID via the Data API. */
async function resolveHandleToId(handle: string, apiKey: string): Promise<string | null> {
  if (!apiKey) return null;
  const h = handle.replace(/^@/, "");
  const url = `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=@${encodeURIComponent(h)}&key=${apiKey}`;
  try {
    const r = await fetch(url, { next: { revalidate: 7 * 24 * 3600 } });
    if (!r.ok) return null;
    const j = (await r.json()) as any;
    return j?.items?.[0]?.id ?? null;
  } catch {
    return null;
  }
}

/** Fetch videos via YouTube RSS — no API key required. */
async function fetchViaRss(channelId: string): Promise<YouTubeVideo[]> {
  const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`;
  const r = await fetch(url, {
    headers: {
      Accept: "application/atom+xml,text/xml,*/*",
      "User-Agent": "Mozilla/5.0 (compatible; MoneyLancerBot/1.0)",
    },
    next: { revalidate: 30 * 60 }, // 30 min
  });
  if (!r.ok) throw new Error(`YouTube RSS ${r.status}`);
  const xml = await r.text();
  return parseRss(xml);
}

/**
 * Fallback when RSS 404s. Fetches the channel's main page HTML and extracts
 * recent video IDs from the embedded ytInitialData JSON. Works for any
 * publicly-visible channel and doesn't require an API key.
 */
async function fetchViaChannelPage(channelIdOrHandle: string): Promise<YouTubeVideo[]> {
  const isHandle = channelIdOrHandle.startsWith("@");
  const url = isHandle
    ? `https://www.youtube.com/${channelIdOrHandle}/videos`
    : `https://www.youtube.com/channel/${channelIdOrHandle}/videos`;
  const r = await fetch(url, {
    headers: {
      Accept: "text/html",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9",
    },
    next: { revalidate: 30 * 60 },
  });
  if (!r.ok) throw new Error(`channel page ${r.status}`);
  const html = await r.text();

  // Pull out the channel's canonical name + identity
  const channelTitle =
    /<meta property="og:title" content="([^"]+)"/.exec(html)?.[1] ||
    /"title":"([^"]+)","navigationEndpoint/.exec(html)?.[1] ||
    "Money Lancer";

  // ytInitialData contains a list of richItemRenderers for each video on the
  // /videos tab. Pull video IDs + titles + thumbnails from those.
  // Each item has shape: { videoId: "...", title: { runs: [{ text: "..." }] },
  // publishedTimeText: { simpleText: "..." }, thumbnail: { thumbnails: [...] } }
  const videoIdMatches = [...html.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)];
  const seen = new Set<string>();
  const ids: string[] = [];
  for (const m of videoIdMatches) {
    if (!seen.has(m[1])) {
      seen.add(m[1]);
      ids.push(m[1]);
    }
    if (ids.length >= 20) break;
  }

  // Match each id to its title — try several patterns since YouTube's HTML
  // structure shifts. Falls back to oEmbed enrichment below.
  return ids.map((id): YouTubeVideo => {
    const idx = html.indexOf(`"videoId":"${id}"`);
    let title = "";
    let publishedAt = "";
    if (idx !== -1) {
      // Look at a generous window around the videoId — title can be before OR after.
      const slice = html.slice(Math.max(0, idx - 2000), idx + 4000);
      title =
        // {"text":"..."} inside title.runs
        (/"title":\s*\{"runs":\s*\[\s*\{"text":"((?:[^"\\]|\\.)+)"/.exec(slice)?.[1]) ||
        // simpleText form
        (/"title":\s*\{"simpleText":"((?:[^"\\]|\\.)+)"/.exec(slice)?.[1]) ||
        // accessibility label is reliable: "<title> by <channel> <date> <views>"
        (() => {
          const al =
            /"accessibility":\s*\{"accessibilityData":\s*\{"label":"((?:[^"\\]|\\.)+)"/.exec(slice)?.[1];
          if (!al) return null;
          // Strip " by Channel Name …" tail
          return al.split(/ by /i)[0];
        })() ||
        "";
      const rel =
        /"publishedTimeText":\s*\{"simpleText":"((?:[^"\\]|\\.)+)"/.exec(slice)?.[1] || "";
      publishedAt = rel ? relativeToIso(rel) : "";
    }
    return {
      id,
      title: decodeJsonString(title),
      publishedAt,
      thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      channelTitle,
    };
  });
}

/**
 * Enrich any videos missing a title by hitting YouTube's public oEmbed endpoint.
 * No API key required. Each call returns { title, author_name, thumbnail_url }.
 * Cached 24h per video.
 */
async function enrichWithOembed(videos: YouTubeVideo[]): Promise<YouTubeVideo[]> {
  return Promise.all(
    videos.map(async (v) => {
      if (v.title && v.title.length > 2) return v;
      try {
        const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${encodeURIComponent(v.id)}&format=json`;
        const r = await fetch(url, {
          headers: {
            Accept: "application/json",
            "User-Agent": "Mozilla/5.0 (compatible; MoneyLancerBot/1.0)",
          },
          next: { revalidate: 24 * 3600 },
        });
        if (!r.ok) return v;
        const j = (await r.json()) as {
          title?: string;
          author_name?: string;
          thumbnail_url?: string;
        };
        return {
          ...v,
          title: v.title || j.title || v.title,
          channelTitle: v.channelTitle || j.author_name,
          // Prefer the higher-quality thumbnail oEmbed returns
          thumbnail: j.thumbnail_url || v.thumbnail,
        };
      } catch {
        return v;
      }
    })
  );
}

function decodeJsonString(s: string) {
  // YouTube ytInitialData strings escape unicode; this handles the common ones
  return s
    .replace(/\\u0026/g, "&")
    .replace(/\\u003c/g, "<")
    .replace(/\\u003e/g, ">")
    .replace(/\\"/g, '"')
    .replace(/\\n/g, " ")
    .trim();
}

function relativeToIso(rel: string): string {
  // "3 days ago" / "2 weeks ago" / "1 month ago" → approximate ISO date
  const m = /(\d+)\s+(second|minute|hour|day|week|month|year)s?\s+ago/i.exec(rel);
  if (!m) return "";
  const n = Number(m[1]);
  const unit = m[2].toLowerCase();
  const multipliers: Record<string, number> = {
    second: 1000,
    minute: 60_000,
    hour: 3_600_000,
    day: 86_400_000,
    week: 7 * 86_400_000,
    month: 30 * 86_400_000,
    year: 365 * 86_400_000,
  };
  const ms = multipliers[unit] || 86_400_000;
  return new Date(Date.now() - n * ms).toISOString();
}

function parseRss(xml: string): YouTubeVideo[] {
  // YouTube's atom feed is predictable; regex is sufficient and avoids deps.
  const out: YouTubeVideo[] = [];
  const channelTitle =
    /<author>[\s\S]*?<name>([^<]+)<\/name>/.exec(xml)?.[1] || "Money Lancer";
  const entries = xml.split("<entry>").slice(1);
  for (const e of entries) {
    const id =
      /<yt:videoId>([^<]+)<\/yt:videoId>/.exec(e)?.[1] ||
      /<id>yt:video:([^<]+)<\/id>/.exec(e)?.[1] ||
      "";
    if (!id) continue;
    const title = decodeXml(/<title>([\s\S]*?)<\/title>/.exec(e)?.[1] || "");
    const publishedAt = /<published>([^<]+)<\/published>/.exec(e)?.[1] || "";
    const description = decodeXml(
      /<media:description>([\s\S]*?)<\/media:description>/.exec(e)?.[1] || ""
    ).slice(0, 240);
    out.push({
      id,
      title,
      publishedAt,
      description,
      thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      channelTitle,
    });
  }
  return out;
}

function decodeXml(s: string) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

/** Fetch via YouTube Data API v3 — needs YOUTUBE_API_KEY. Richer metadata. */
async function fetchViaApi(channelId: string, apiKey: string): Promise<YouTubeVideo[]> {
  // Step 1: get the channel's uploads playlist id.
  const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails,snippet&id=${channelId}&key=${apiKey}`;
  const cr = await fetch(channelUrl, { next: { revalidate: 24 * 3600 } });
  if (!cr.ok) throw new Error(`YouTube Data API channels ${cr.status}`);
  const cj = (await cr.json()) as any;
  const uploadsId = cj?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  const channelTitle = cj?.items?.[0]?.snippet?.title || "Money Lancer";
  if (!uploadsId) return [];

  // Step 2: pull the most recent 20 items from that playlist.
  const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsId}&maxResults=20&key=${apiKey}`;
  const pr = await fetch(playlistUrl, { next: { revalidate: 30 * 60 } });
  if (!pr.ok) throw new Error(`YouTube Data API playlistItems ${pr.status}`);
  const pj = (await pr.json()) as any;

  const ids = (pj.items || []).map((i: any) => i?.contentDetails?.videoId).filter(Boolean);
  if (ids.length === 0) return [];

  // Step 3: hydrate with stats + content details (durations, views).
  const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${ids.join(",")}&key=${apiKey}`;
  const vr = await fetch(videosUrl, { next: { revalidate: 30 * 60 } });
  if (!vr.ok) throw new Error(`YouTube Data API videos ${vr.status}`);
  const vj = (await vr.json()) as any;

  return (vj.items || []).map((v: any): YouTubeVideo => ({
    id: v.id,
    title: v?.snippet?.title || "",
    description: (v?.snippet?.description || "").slice(0, 240),
    thumbnail:
      v?.snippet?.thumbnails?.maxres?.url ||
      v?.snippet?.thumbnails?.standard?.url ||
      v?.snippet?.thumbnails?.high?.url ||
      `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
    publishedAt: v?.snippet?.publishedAt || "",
    channelTitle: v?.snippet?.channelTitle || channelTitle,
    viewCount: Number(v?.statistics?.viewCount) || undefined,
    duration: v?.contentDetails?.duration || undefined,
  }));
}

/**
 * Resolve a handle (@something) to a canonical channel ID by scraping its page.
 * The page HTML embeds `"externalId":"UC..."` in ytInitialData. Cached for a week.
 */
async function resolveHandleViaPage(handle: string): Promise<string | null> {
  const url = `https://www.youtube.com/${handle.startsWith("@") ? handle : "@" + handle}`;
  try {
    const r = await fetch(url, {
      headers: {
        Accept: "text/html",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
      },
      next: { revalidate: 7 * 24 * 3600 },
    });
    if (!r.ok) return null;
    const html = await r.text();
    return (
      /"externalId":"(UC[A-Za-z0-9_-]{22})"/.exec(html)?.[1] ||
      /<meta itemprop="channelId" content="(UC[A-Za-z0-9_-]{22})"/.exec(html)?.[1] ||
      null
    );
  } catch {
    return null;
  }
}

/** Main entry point — server-side, called by the homepage and /videos page. */
export async function getYouTubeVideos(limit = 12): Promise<YouTubeVideo[]> {
  const { channelId: envId, channelHandle, apiKey } = getEnv();
  let channelId = envId;

  // Resolve handle → channel ID even without an API key (scrape the handle page).
  if (!channelId && channelHandle) {
    if (apiKey) {
      const r = await resolveHandleToId(channelHandle, apiKey);
      if (r) channelId = r;
    }
    if (!channelId) {
      const r = await resolveHandleViaPage(channelHandle);
      if (r) {
        channelId = r;
        if (process.env.NODE_ENV !== "production") {
          console.log(`[youtube] Resolved handle ${channelHandle} → channelId ${channelId}`);
        }
      }
    }
  }

  if (!channelId && !channelHandle) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[youtube] No YOUTUBE_CHANNEL_ID or YOUTUBE_CHANNEL_HANDLE set — using fallback.");
    }
    return FALLBACK_VIDEOS;
  }

  // Try Data API first if we have the key + a resolved channel ID.
  if (channelId && apiKey) {
    try {
      const v = await fetchViaApi(channelId, apiKey);
      if (v.length > 0) return v.slice(0, limit);
    } catch (e) {
      if (process.env.NODE_ENV !== "production") console.warn("[youtube] Data API failed, falling back to RSS:", (e as Error).message);
    }
  }

  // RSS — needs channel ID.
  if (channelId) {
    try {
      const v = await fetchViaRss(channelId);
      if (v.length > 0) return v.slice(0, limit);
      if (process.env.NODE_ENV !== "production") console.warn(`[youtube] RSS for ${channelId} returned 0 videos`);
    } catch (e) {
      if (process.env.NODE_ENV !== "production") console.warn("[youtube] RSS failed:", (e as Error).message);
    }
  }

  // Last resort: scrape the channel page (works with handle OR channel ID).
  try {
    const v = await fetchViaChannelPage(channelHandle || channelId);
    if (v.length > 0) {
      // The scrape gives us IDs reliably but title parsing is fragile — fill
      // any missing titles via YouTube's oEmbed endpoint.
      const enriched = await enrichWithOembed(v);
      if (process.env.NODE_ENV !== "production")
        console.log(`[youtube] Channel-page scrape returned ${enriched.length} videos`);
      return enriched.slice(0, limit);
    }
  } catch (e) {
    if (process.env.NODE_ENV !== "production")
      console.warn("[youtube] Channel-page scrape failed:", (e as Error).message);
  }

  return FALLBACK_VIDEOS;
}

/** Format ISO 8601 duration (PT#H#M#S) → "12:34". */
export function formatDuration(iso?: string): string {
  if (!iso) return "";
  const m = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(iso);
  if (!m) return "";
  const h = Number(m[1] || 0);
  const min = Number(m[2] || 0);
  const sec = Number(m[3] || 0);
  if (h > 0) return `${h}:${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${min}:${String(sec).padStart(2, "0")}`;
}

export function formatViews(n?: number): string {
  if (!n) return "";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M views`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K views`;
  return `${n} views`;
}

export function formatRelative(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const diff = Math.max(0, Date.now() - d.getTime());
  const day = 24 * 3600 * 1000;
  if (diff < day) return "today";
  if (diff < 2 * day) return "yesterday";
  if (diff < 30 * day) return `${Math.floor(diff / day)} days ago`;
  if (diff < 365 * day) return `${Math.floor(diff / (30 * day))} months ago`;
  return `${Math.floor(diff / (365 * day))} years ago`;
}
