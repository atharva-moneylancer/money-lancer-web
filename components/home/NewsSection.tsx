import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionEyebrow } from "@/components/home/Services";
import { ArticleImage } from "@/components/ui/ArticleImage";
import type { Article } from "@/lib/news";
import { timeAgo } from "@/lib/news";

export function NewsSection({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;

  return (
    <section className="bg-white py-20">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <SectionEyebrow label="Market Insights" />
            <h2 className="mt-3 font-display text-title-l font-bold tracking-tight text-ink">
              What&apos;s moving the market
            </h2>
          </div>
          <Link
            href="/insights"
            className="text-sm font-semibold text-crayola hover:underline"
          >
            All insights →
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.slice(0, 6).map((a) => (
            <a
              key={a.url}
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-2xl border border-black/[0.06] bg-white shadow-soft transition-all hover:-translate-y-1 hover:border-crayola/20 hover:shadow-lift overflow-hidden"
            >
              {/* Thumbnail */}
              {a.urlToImage && (
                <div className="news-thumb h-44 w-full overflow-hidden bg-cloud">
                  <ArticleImage src={a.urlToImage} alt="" />
                </div>
              )}

              <div className="flex flex-1 flex-col p-5">
                {/* Source + time */}
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate2">
                  <span className="text-crayola">{a.source}</span>
                  <span>·</span>
                  <span>{timeAgo(a.publishedAt)}</span>
                </div>

                {/* Title */}
                <h3 className="mt-2 text-sm font-semibold leading-snug text-ink transition-colors group-hover:text-crayola line-clamp-3">
                  {a.title}
                </h3>

                {/* Description */}
                {a.description && (
                  <p className="mt-2 text-xs leading-relaxed text-slate1 line-clamp-2">
                    {a.description}
                  </p>
                )}

                <div className="mt-auto pt-4 text-xs font-semibold text-crayola">
                  Read more →
                </div>
              </div>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
