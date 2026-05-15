import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionEyebrow } from "@/components/home/Services";
import { Button } from "@/components/ui/Button";
import { LiteYouTube } from "@/components/video/LiteYouTube";
import { getYouTubeVideos, formatRelative, formatDuration, formatViews, isRealVideo } from "@/lib/youtube";

export const metadata = { title: "Videos" };
export const revalidate = 1800; // 30 min

export default async function VideosPage() {
  const all = await getYouTubeVideos(24);
  const videos = all.filter(isRealVideo);
  if (!videos || videos.length === 0) {
    return (
      <div className="bg-cloud pt-28">
        <Container className="pb-24">
          <h1 className="font-display text-headline font-bold text-ink">Videos</h1>
          <p className="mt-3 text-body-l text-slate1">No videos available yet. Check back soon.</p>
        </Container>
      </div>
    );
  }
  const [featured, ...rest] = videos;

  return (
    <div className="bg-mesh-soft pt-28">
      <Container className="pb-12">
        <SectionEyebrow label="Watch & learn" />
        <h1 className="mt-4 max-w-3xl font-display text-headline font-bold tracking-tight text-ink">
          Our latest, in your feed.
        </h1>
        <p className="mt-4 max-w-2xl text-body-l text-slate1">
          Short market briefings, fund reviews, and no-jargon explainers from the Money Lancer team.
        </p>
      </Container>

      {/* Featured */}
      <Container className="pb-16">
        <article className="grid items-center gap-8 lg:grid-cols-[1.6fr,1fr]">
          <LiteYouTube id={featured.id} title={featured.title} thumbnail={featured.thumbnail} className="shadow-lift" />
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-crayola">Most recent</div>
            <h2 className="mt-3 font-display text-title-l font-bold text-ink">{featured.title}</h2>
            {featured.description && (
              <p className="mt-4 max-w-xl text-body-m leading-relaxed text-slate1">{featured.description}</p>
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
            <div className="mt-6">
              <Button variant="secondary" href={`https://www.youtube.com/watch?v=${featured.id}`}>
                Open on YouTube ↗
              </Button>
            </div>
          </div>
        </article>
      </Container>

      {/* Grid */}
      <Container className="pb-24">
        <h3 className="text-title-m font-bold text-yale">More episodes</h3>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((v) => (
            <article key={v.id} className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-soft hover:shadow-lift transition-all">
              <LiteYouTube id={v.id} title={v.title} thumbnail={v.thumbnail} />
              <div className="p-5">
                <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-ink">{v.title}</h4>
                <div className="mt-2 flex items-center gap-2 text-[11px] text-slate2">
                  <span>{formatRelative(v.publishedAt)}</span>
                  {v.duration ? (
                    <>
                      <span className="h-0.5 w-0.5 rounded-full bg-mist" />
                      <span className="tabular">{formatDuration(v.duration)}</span>
                    </>
                  ) : null}
                  {v.viewCount ? (
                    <>
                      <span className="h-0.5 w-0.5 rounded-full bg-mist" />
                      <span>{formatViews(v.viewCount)}</span>
                    </>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 rounded-3xl bg-navy p-10 text-white md:p-14">
          <h3 className="font-display text-title-l font-bold">Don't miss the next episode</h3>
          <p className="mt-3 max-w-xl text-white/75">
            New explainers every week. Subscribe on YouTube or get a weekly digest delivered to your inbox.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="light" href="https://www.youtube.com/@Money_Lancer_Investments">Subscribe on YouTube ↗</Button>
            <Button variant="ghost" href="/#contact" className="text-white border border-white/20 hover:bg-white/10">
              Talk to an advisor
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
