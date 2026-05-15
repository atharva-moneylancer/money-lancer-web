import { NextRequest, NextResponse } from "next/server";

const BASE = process.env.ADVISORKHOJ_BASE_URL || "https://mfapi.advisorkhoj.com";
const MFBOX = process.env.ADVISORKHOJ_MFBOX_URL || "https://advisorkhoj.themfbox.com/advisory-tools";
const KEY = process.env.ADVISORKHOJ_API_KEY || "";

/**
 * Server-side proxy for AdvisorKhoj endpoints.
 * Hides the API key from the browser. All endpoint paths are passed through
 * as-is and forwarded to the AdvisorKhoj origin.
 *
 *   GET /api/advisorkhoj/getSchemeInfoLatest?scheme=...
 *   GET /api/advisorkhoj/_mfbox/getSchemeListByAMCAndCategory?amc=All&category=All&broad_category=All
 *
 * The `_mfbox/...` prefix routes to the secondary host.
 */
export async function GET(req: NextRequest, ctx: { params: { path: string[] } }) {
  const segs = ctx.params.path || [];
  const useMfbox = segs[0] === "_mfbox";
  const path = (useMfbox ? segs.slice(1) : segs).join("/");
  const base = useMfbox ? MFBOX : BASE;

  if (!KEY) return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  if (!path) return NextResponse.json({ error: "No endpoint specified" }, { status: 400 });

  const upstream = new URL(`${base}/${path}`);
  upstream.searchParams.set("key", KEY);
  req.nextUrl.searchParams.forEach((v, k) => upstream.searchParams.set(k, v));

  try {
    const r = await fetch(upstream.toString(), {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });
    const body = await r.text();
    return new NextResponse(body, {
      status: r.status,
      headers: {
        "content-type": r.headers.get("content-type") ?? "application/json",
        "cache-control": "s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: "Upstream fetch failed", detail: e?.message }, { status: 502 });
  }
}
