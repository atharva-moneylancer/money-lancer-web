import Image from "next/image";
import Link from "next/link";
import { getAllSchemes } from "@/lib/advisorkhoj";
import { sifOnly } from "@/lib/funds";
import { getLogoForName } from "@/lib/amcs";

/**
 * Server component that pulls Regular SIFs from the AdvisorKhoj master
 * scheme list and renders them as cards. If no SIFs are surfaced yet
 * (the category was only opened by SEBI in 2024), the component renders
 * an "expected soon" message instead.
 */
export default async function SifOfferings() {
  let schemes: Array<{ name: string; company: string; category: string }> = [];

  try {
    const m = await getAllSchemes();
    const filtered = sifOnly(m?.scheme_list || []);

    // Deduplicate Growth / IDCW variants
    const seen = new Set<string>();
    schemes = filtered
      .map((s: any) => ({
        name: s.scheme_amfi || s.scheme_name || "",
        company: s.scheme_company || "",
        category: s.scheme_advisorkhoj_category || s.scheme_category || "SIF",
      }))
      .filter((s) => {
        const k = s.name
          .replace(/\s+\-\s+(direct|regular)\s+plan.*$/i, "")
          .replace(/\s+-\s+(growth|idcw|dividend).*$/i, "")
          .toLowerCase();
        if (seen.has(k)) return false;
        seen.add(k);
        return s.name.length > 0;
      });
  } catch {
    schemes = [];
  }

  if (schemes.length === 0) {
    return (
      <section className="mt-12 rounded-2xl border border-black/[0.06] bg-white p-8 shadow-soft">
        <div className="inline-flex items-center gap-2 rounded-full bg-electric/15 px-3 py-1 text-[11px] font-bold tracking-wider text-yale">
          NEW CATEGORY
        </div>
        <h2 className="mt-4 font-display text-title-l font-bold text-ink">
          First SIF launches expected shortly
        </h2>
        <p className="mt-3 max-w-2xl text-body-m text-slate1">
          SEBI notified the SIF framework in late 2024. Leading AMCs are filing their first
          offerings now. We'll surface every Regular-Plan SIF here as it launches — and notify
          clients who've expressed interest before public launch.
        </p>
        <div className="mt-5">
          <Link
            href="/#contact"
            className="inline-flex items-center text-sm font-semibold text-crayola hover:translate-x-1 transition-transform"
          >
            Get notified about new SIFs →
          </Link>
        </div>
      </section>
    );
  }

  // Group by AMC
  const grouped = new Map<string, typeof schemes>();
  schemes.forEach((s) => {
    if (!grouped.has(s.company)) grouped.set(s.company, []);
    grouped.get(s.company)!.push(s);
  });
  const sortedByAMC = [...grouped.entries()].sort((a, b) => b[1].length - a[1].length);

  return (
    <section className="mt-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-crayola">
            <span className="h-px w-6 bg-crayola/40" />
            Available SIFs
          </div>
          <h2 className="mt-3 font-display text-title-l font-bold text-ink">
            SIF offerings we distribute
          </h2>
          <p className="mt-2 text-body-m text-slate1">
            Regular-Plan SIFs from {grouped.size} fund {grouped.size === 1 ? "house" : "houses"}.
            Updated daily.
          </p>
        </div>
        <div className="text-xs text-slate2">{schemes.length} schemes</div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {sortedByAMC.map(([amc, list]) => {
          const logo = getLogoForName(amc);
          return (
            <article
              key={amc}
              className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-soft hover:shadow-lift transition-all"
            >
              <header className="flex items-center gap-3 border-b border-black/5 pb-4">
                {logo ? (
                  <span className="inline-flex h-10 w-16 items-center justify-center rounded-md border border-black/[0.06] bg-white p-1">
                    <Image src={logo} alt={amc} width={56} height={28} className="max-h-7 w-auto object-contain" />
                  </span>
                ) : (
                  <span className="inline-flex h-10 w-16 items-center justify-center rounded-md bg-yale text-xs font-bold text-white">
                    {amc.charAt(0)}
                  </span>
                )}
                <div>
                  <div className="text-sm font-semibold text-ink">{amc}</div>
                  <div className="text-xs text-slate2">
                    {list.length} SIF {list.length === 1 ? "scheme" : "schemes"}
                  </div>
                </div>
              </header>
              <ul className="mt-3 divide-y divide-black/5">
                {list.slice(0, 6).map((s) => (
                  <li key={s.name}>
                    <Link
                      href={`/funds/${encodeURIComponent(s.name)}`}
                      className="flex items-center justify-between gap-3 py-3 hover:text-crayola"
                    >
                      <span className="truncate text-sm font-medium text-graphite">{s.name}</span>
                      <span className="shrink-0 text-[11px] font-semibold text-crayola">View →</span>
                    </Link>
                  </li>
                ))}
              </ul>
              {list.length > 6 && (
                <div className="mt-2 text-right text-[11px] text-slate2">+ {list.length - 6} more</div>
              )}
            </article>
          );
        })}
      </div>

      <p className="mt-6 text-[11px] leading-relaxed text-slate2">
        Data refreshed weekly. SIFs require ₹10 lakh minimum investment
        per SEBI norms. Every SIF here is the Regular Plan — backed by a continuous advisor relationship.
      </p>
    </section>
  );
}
