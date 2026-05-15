import Link from "next/link";
import { CompanyLogo } from "@/components/fund/CompanyLogo";
import { getSIFSchemes } from "@/lib/advisorkhoj";

// Server component — shows live SIF options pulled from AdvisorKhoj.
// Gracefully handles the "no SIFs surfaced yet" case since SIF is a brand-new
// SEBI category and AdvisorKhoj's coverage is evolving.
export default async function SIFList() {
  let schemes: Awaited<ReturnType<typeof getSIFSchemes>> = [];
  try {
    schemes = await getSIFSchemes();
  } catch {
    schemes = [];
  }

  if (schemes.length === 0) {
    return (
      <div className="rounded-2xl border border-black/[0.06] bg-white p-8 shadow-soft">
        <div className="flex items-start gap-4">
          <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-electric/15 text-yale">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
              <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div>
            <h3 className="text-title-s font-semibold text-ink">SIF launches are rolling out</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate1">
              SEBI notified the Specialized Investment Fund framework in 2024 and the first scheme
              launches began in 2025. The category is still small — our team tracks every approved
              filing and contacts you the day a relevant SIF opens. Drop us a note and we'll add
              you to the SIF launch alerts list.
            </p>
            <div className="mt-5">
              <Link
                href="/#contact"
                className="inline-flex items-center text-sm font-semibold text-crayola hover:translate-x-0.5 transition-transform"
              >
                Get SIF launch alerts →
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Group by company so the user can scan by AMC
  const grouped = new Map<string, typeof schemes>();
  for (const s of schemes) {
    const k = s.scheme_company || "Other";
    if (!grouped.has(k)) grouped.set(k, []);
    grouped.get(k)!.push(s);
  }

  return (
    <div className="rounded-2xl border border-black/[0.06] bg-white shadow-soft overflow-hidden">
      <div className="border-b border-black/5 bg-cloud px-6 py-4">
        <div className="flex items-baseline justify-between">
          <h3 className="text-title-s font-semibold text-ink">
            Live SIF options
            <span className="ml-2 rounded-full bg-electric/20 px-2 py-0.5 text-[10px] font-bold tracking-wider text-yale align-middle">
              {schemes.length}
            </span>
          </h3>
          <span className="text-[11px] text-slate2">Refreshed daily · Regular Plans only</span>
        </div>
      </div>

      <div className="divide-y divide-black/5">
        {[...grouped.entries()].map(([company, rows]) => (
          <div key={company} className="px-6 py-4">
            <div className="mb-3 flex items-center gap-3">
              <CompanyLogo company={company} size={32} />
              <div className="text-xs font-semibold uppercase tracking-wider text-slate2">{company || "Multiple AMCs"}</div>
              <span className="text-xs text-slate2">· {rows.length} scheme{rows.length > 1 ? "s" : ""}</span>
            </div>
            <div className="space-y-1.5">
              {rows.map((r) => (
                <Link
                  key={r.scheme_amfi}
                  href={`/funds/${encodeURIComponent(r.scheme_amfi)}`}
                  className="group flex items-center justify-between gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-cloud"
                >
                  <span className="truncate text-sm font-medium text-ink group-hover:text-crayola">{r.scheme_amfi}</span>
                  <span className="shrink-0 text-xs font-semibold text-crayola">View →</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
