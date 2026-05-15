import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionEyebrow } from "@/components/home/Services";
import { ArticleImage } from "@/components/ui/ArticleImage";
import { getInsightsNews, timeAgo } from "@/lib/news";
import type { Article } from "@/lib/news";

export const metadata = { title: "Market Insights — Money Lancer" };
export const revalidate = 86400; // 24 hours

const TOPICS = [
  { key: "markets",      label: "Markets" },
  { key: "mutual-funds", label: "Mutual Funds" },
  { key: "tax",          label: "Tax & Planning" },
  { key: "economy",      label: "Economy" },
] as const;

type Topic = typeof TOPICS[number]["key"];

export default async function InsightsPage({
  searchParams,
}: {
  searchParams: { topic?: string };
}) {
  const topic = (TOPICS.find((t) => t.key === searchParams.topic)?.key ?? "markets") as Topic;
  const articles = await getInsightsNews(topic, 12);

  return (
    <div className="bg-mesh-soft pt-28">
      <Container className="pb-24">
        <SectionEyebrow label="Insights" />
        <h1 className="mt-4 max-w-3xl font-display text-headline font-bold tracking-tight text-ink">
          Stay ahead of the market.
        </h1>
        <p className="mt-4 max-w-2xl text-body-l text-slate1">
          Curated financial news on markets, mutual funds, tax, and the Indian economy — updated every 30 minutes.
        </p>

        {/* Topic tabs */}
        <div className="mt-10 flex flex-wrap gap-2">
          {TOPICS.map((t) => (
            <Link
              key={t.key}
              href={`/insights?topic=${t.key}`}
              className={`rounded-full border px-5 py-2 text-sm font-semibold transition-colors ${
                t.key === topic
                  ? "border-crayola bg-crayola text-white"
                  : "border-black/10 bg-white text-graphite hover:border-crayola hover:text-crayola"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>

        {/* Articles grid */}
        {articles.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-black/[0.06] bg-white px-6 py-16 text-center shadow-soft">
            <p className="text-sm font-semibold text-graphite">No articles right now</p>
            <p className="mt-1 text-xs text-slate2">
              {process.env.NEWS_API_KEY
                ? "The news feed will refresh in 30 minutes."
                : "Add NEWS_API_KEY to .env.local to enable this section."}
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <ArticleCard key={a.url} article={a} />
            ))}
          </div>
        )}

        {/* Attribution */}
        <p className="mt-10 text-center text-xs text-slate2">
          News sourced from{" "}
          <a
            href="https://newsapi.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-crayola"
          >
            NewsAPI
          </a>
          . Money Lancer is not responsible for third-party content.
        </p>
      </Container>
    </div>
  );
}

function ArticleCard({ article: a }: { article: Article }) {
  return (
    <a
      href={a.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-soft transition-all hover:-translate-y-1 hover:border-crayola/20 hover:shadow-lift"
    >
      {/* Thumbnail */}
      {a.urlToImage ? (
        <div className="news-thumb h-48 w-full overflow-hidden bg-cloud">
          <ArticleImage src={a.urlToImage} alt="" />
        </div>
      ) : (
        <div className="flex h-48 items-center justify-center bg-gradient-to-br from-cloud to-mist">
          <span className="text-3xl opacity-30">📰</span>
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        {/* Source · time */}
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate2">
          <span className="text-crayola">{a.source}</span>
          <span>·</span>
          <span>{timeAgo(a.publishedAt)}</span>
        </div>

        <h2 className="mt-2 text-sm font-semibold leading-snug text-ink transition-colors group-hover:text-crayola line-clamp-3">
          {a.title}
        </h2>

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
  );
}
