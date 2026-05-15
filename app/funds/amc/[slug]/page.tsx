import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { SectionEyebrow } from "@/components/home/Services";
import { Button } from "@/components/ui/Button";
import { getAllSchemes, getSchemeListByAMCAndCategory } from "@/lib/advisorkhoj";
import { AMCS, getAmcBySlug, amcMatches } from "@/lib/amcs";
import { isRegularPlan } from "@/lib/funds";

export const revalidate = 24 * 3600;

type Params = { params: { slug: string } };

export async function generateStaticParams() {
  return AMCS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Params) {
  const amc = getAmcBySlug(params.slug);
  return { title: amc ? `${amc.name} schemes` : "AMC" };
}

type Row = { code: string; name: string; category: string; isin?: string };

export default async function AMCPage({ params }: Params) {
  const amc = getAmcBySlug(params.slug);
  if (!amc) notFound();

  let list: Row[] = [];

  // Try the dedicated endpoint first.
  try {
    const r = await getSchemeListByAMCAndCategory(amc.apiName);
    if (r?.list?.length) {
      list = r.list
        .map((x: any) => ({
          code: x.scheme_amfi || x.scheme_name || x.scheme_amfi_short_name || "",
          name: x.scheme_amfi || x.scheme_name || x.scheme_amfi_short_name || "",
          category: x.scheme_category || x.category || "Other",
        }))
        .filter((r) => isRegularPlan(r.name));
    }
  } catch {
    // ignore — falling through to master list filter
  }

  // Fall back to the cached master scheme list and filter by company.
  if (list.length === 0) {
    try {
      const m = await getAllSchemes();
      const filtered = (m?.scheme_list || [])
        .filter((s) => amcMatches(amc, s.scheme_company))
        .filter((s) => isRegularPlan(s.scheme_amfi));
      list = filtered.map((s) => ({
        code: s.scheme_amfi,
        name: s.scheme_amfi,
        category: s.scheme_advisorkhoj_category || "Other",
        isin: s.scheme_isin,
      }));
    } catch {
      // ignore
    }
  }

  // Dedupe by canonical scheme name (Growth / IDCW / etc share a core name).
  const seen = new Set<string>();
  list = list.filter((r) => {
    const k = r.name
      .replace(/\s+\-\s+(direct|regular)\s+plan.*$/i, "")
      .replace(/\s+-\s+(growth|idcw|dividend).*$/i, "")
      .toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  // Group by category and sort
  const grouped = new Map<string, Row[]>();
  list.forEach((r) => {
    if (!grouped.has(r.category)) grouped.set(r.category, []);
    grouped.get(r.category)!.push(r);
  });
  const sortedCats = [...grouped.entries()].sort((a, b) => b[1].length - a[1].length);

  return (
    <div className="bg-cloud pt-28">
      <Container className="pb-12">
        <Link href="/funds" className="text-sm font-semibold text-crayola hover:underline">← All AMCs</Link>
        <div className="mt-5 flex flex-wrap items-center gap-6">
          <div className="flex h-20 w-32 items-center justify-center rounded-2xl border border-black/[0.06] bg-white p-3 shadow-soft">
            <Image src={amc.logo} alt={amc.name} width={160} height={56} className="max-h-14 w-auto object-contain" />
          </div>
          <div>
            <SectionEyebrow label="AMC research" />
            <h1 className="mt-3 font-display text-headline font-bold tracking-tight text-ink">{amc.name}</h1>
            <p className="mt-2 max-w-xl text-body-m text-slate1">
              All open-ended schemes from {amc.name} we distribute, grouped by category. Click any scheme for the full breakdown.
            </p>
            {list.length > 0 && (
              <p className="mt-2 text-xs text-slate2">
                {list.length} schemes across {grouped.size} categories
              </p>
            )}
          </div>
        </div>
      </Container>

      <Container className="pb-24">
        {sortedCats.length === 0 && (
          <div className="mt-2 rounded-2xl border border-black/[0.06] bg-white p-12 text-center text-sm text-slate1">
            Couldn't load schemes right now. Try the{" "}
            <Link href="/funds" className="text-crayola underline">
              all-funds view
            </Link>
            .
          </div>
        )}

        {sortedCats.map(([cat, rows]) => (
          <section key={cat} className="mt-10">
            <div className="flex items-baseline justify-between">
              <h2 className="text-title-m font-bold text-yale">
                {cat} <span className="ml-2 text-sm font-normal text-slate2">({rows.length})</span>
              </h2>
              <Link href={`/funds/category/${encodeURIComponent(cat)}`} className="text-sm font-semibold text-crayola hover:underline">
                Category rankings →
              </Link>
            </div>
            <div className="mt-4 overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-soft">
              {rows.slice(0, 20).map((r) => (
                <Link
                  key={r.code + r.name}
                  href={`/funds/${encodeURIComponent(r.name)}`}
                  className="flex items-center justify-between gap-4 border-b border-black/5 px-6 py-4 transition-colors last:border-0 hover:bg-cloud"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="inline-flex h-8 w-12 shrink-0 items-center justify-center rounded-md border border-black/[0.06] bg-white p-1">
                      <Image src={amc.logo} alt="" width={40} height={20} className="max-h-full w-auto object-contain" />
                    </span>
                    <span className="truncate text-sm font-semibold text-ink">{r.name}</span>
                  </div>
                  <span className="shrink-0 text-xs font-semibold text-crayola">View →</span>
                </Link>
              ))}
            </div>
            {rows.length > 20 && (
              <div className="mt-3 text-right text-xs text-slate2">+ {rows.length - 20} more {cat} schemes</div>
            )}
          </section>
        ))}

        <div className="mt-12 rounded-3xl bg-navy p-10 text-white md:p-14">
          <h3 className="font-display text-title-l font-bold">Not sure where to start?</h3>
          <p className="mt-3 max-w-xl text-white/75">
            Our team will shortlist the right {amc.name} scheme — or peer scheme from another AMC — for your goal and risk profile.
          </p>
          <div className="mt-6 flex gap-3">
            <Button variant="light" href="/#contact">Book a call</Button>
            <Button variant="ghost" href="/funds" className="text-white border border-white/20 hover:bg-white/10">
              Browse other AMCs
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
