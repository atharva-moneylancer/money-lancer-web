import { NextResponse } from "next/server";
import { getMarketQuotes } from "@/lib/markets";

// Optional client-side endpoint — useful if you ever want the ticker to
// poll from the browser. Server-side rendering uses the lib directly.
export async function GET() {
  const quotes = await getMarketQuotes();
  return NextResponse.json(
    { quotes, fetched_at: new Date().toISOString() },
    {
      headers: { "cache-control": "s-maxage=60, stale-while-revalidate=300" },
    }
  );
}
