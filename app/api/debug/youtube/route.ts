import { NextResponse } from "next/server";

// Debug endpoint — disabled in production
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { getYouTubeVideos } = await import("@/lib/youtube");

  const env = {
    channelId: process.env.YOUTUBE_CHANNEL_ID || "(not set)",
    channelHandle: process.env.YOUTUBE_CHANNEL_HANDLE || "(not set)",
    hasApiKey: Boolean(process.env.YOUTUBE_API_KEY),
  };

  const videos = await getYouTubeVideos(12);
  return NextResponse.json({
    env,
    videoCount: videos.length,
    allFallback: videos.every((v) => v.id.startsWith("demo")),
    firstThree: videos.slice(0, 3).map((v) => ({
      id: v.id,
      title: v.title,
      isFallback: v.id.startsWith("demo"),
    })),
  });
}
