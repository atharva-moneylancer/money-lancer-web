import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionEyebrow } from "@/components/home/Services";
import { LiteYouTube } from "@/components/video/LiteYouTube";
import { type YouTubeVideo, formatRelative, formatViews, formatDuration, isRealVideo } from "@/lib/youtube";

export default function VideoSection({ videos }: { videos: YouTubeVideo[] }) {
  // If we couldn't fetch any real videos, hide the section entirely.
  const real = (videos || []).filter(isRealVideo);
  if (real.length === 0) return null;
  videos = real;
  const [featured, ...rest] = videos;
  const grid = rest.slice(0, 4);

  return (
    <section id="videos" className="py-24 lg:py-32 bg-white">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <SectionEyebrow label="Watch & learn" />
            <h2 className="mt-4 font-display text-headline font-bold tracking-tight text-ink">
              From the advisor desk, on video.
            </h2>
            <p className="mt-4 text-body-l text-slate1">
              Short, no-jargon explainers and market commentary from our team. New episodes every week.
            </p>
          </div>
          <Link
            href="/videos"
            className="inline-flex items-center text-sm font-semibold text-crayola hover:translate-x-1 transition-transform"
          >
            All videos →
          </Link>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.6fr,1fr]">
          {/* Featured video */}
          <article className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-soft">
            <LiteYouTube id={featured.id} title={featured.title} thumbnail={featured.thumbnail} />
            <div className="p-6">
              <h3 className="text-title-m font-bold text-ink">{featured.title}</h3>
              {featured.description && (
                <p className="mt-3 text-sm leading-relaxed text-slate1 line-clamp-3">{featured.description}</p>
              )}
              <div className="mt-4 flex items-center gap-3 text-xs text-slate2">
                <span>{featured.channelTitle}</span>
                <span className="h-1 w-1 rounded-full bg-mist" />
                <span>{formatRelative(featured.publishedAt)}</span>
                {featured.viewCount ? (
                  <>
                    <span className="h-1 w-1 rounded-full bg-mist" />
                    <span>{formatViews(featured.viewCount)}</span>
                  </>
                ) : null}
              </div>
            </div>
          </article>

          {/* Side list */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {grid.map((v) => (
              <article key={v.id} className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-soft hover:shadow-lift transition-all">
                <div className="grid sm:grid-cols-1 lg:grid-cols-[160px,1fr]">
                  <div className="lg:max-h-[110px]">
                    <LiteYouTube id={v.id} title={v.title} thumbnail={v.thumbnail} className="lg:!aspect-[16/10]" />
                  </div>
                  <div className="p-4">
                    <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-ink">{v.title}</h4>
                    <div className="mt-2 flex items-center gap-2 text-[11px] text-slate2">
                      <span>{formatRelative(v.publishedAt)}</span>
                      {v.duration ? (
                        <>
                          <span className="h-0.5 w-0.5 rounded-full bg-mist" />
                          <span className="tabular">{formatDuration(v.duration)}</span>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
