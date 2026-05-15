import Link from "next/link";
import { Container } from "@/components/ui/Container";

export const metadata = { title: "MF Commission Disclosure" };

const COMMISSIONS = [
  { category: "Equity Funds",                                         trail: "0.40 – 1.60%" },
  { category: "Hybrid Funds",                                         trail: "0.30 – 1.40%" },
  { category: "ELSS",                                                 trail: "0.70 – 1.30%" },
  { category: "Overnight / Liquid Funds",                             trail: "0.025 – 0.10%" },
  { category: "Ultra Short Duration / Low Duration / Money Market",   trail: "0.10 – 0.90%" },
  { category: "Short Duration / Medium Duration / Credit Risk",       trail: "0.10 – 1.00%" },
  { category: "Long Duration / Income / Gilt",                        trail: "0.30 – 0.90%" },
];

export default function MFCommissionPage() {
  return (
    <div className="bg-cloud pt-28">
      <Container className="pb-24 max-w-3xl">
        <Link
          href="/disclosures"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-semibold text-crayola hover:underline"
        >
          ← Back to Disclosures
        </Link>

        <h1 className="mt-4 font-display text-headline font-bold text-ink">
          Mutual Fund Disclosure of Commission / Brokerage
        </h1>

        <p className="mt-4 text-sm font-semibold text-graphite">
          Money Lancer Investments Pvt Ltd. (AMFI Registration No. ARN-189009)
        </p>

        <p className="mt-6 text-body-m text-slate1 leading-relaxed">
          In accordance with the extant regulations (SEBI circular:{" "}
          <strong className="text-graphite">SEBI/IMD/CIR No. 4/168230/09</strong>), following
          are the details of the comparative commission that Money Lancer may earn from various
          fund-houses, whose products are being distributed:
        </p>

        {/* Commission table */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-soft">
          {/* Header */}
          <div className="grid grid-cols-3 gap-3 border-b border-black/5 bg-cloud px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate2">
            <div className="col-span-1">Category</div>
            <div className="col-span-1 text-center">Upfront Brokerage</div>
            <div className="col-span-1 text-center">Trail Commission p.a.</div>
          </div>
          {COMMISSIONS.map((row) => (
            <div
              key={row.category}
              className="grid grid-cols-3 gap-3 border-b border-black/5 px-6 py-4 text-sm last:border-0"
            >
              <div className="col-span-1 font-medium text-graphite">{row.category}</div>
              <div className="col-span-1 text-center text-slate1">0%</div>
              <div className="col-span-1 text-center font-semibold text-ink">{row.trail}</div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-8 rounded-xl border border-black/[0.07] bg-white p-5 text-xs text-slate1 leading-relaxed space-y-3">
          <p>
            The above-mentioned rates are indicative rates and the same will be updated from
            time to time upon receipt of actual rates from respective Asset Management Companies
            (AMCs). Commissions are subject to claw back. All commissions are subject to GST.
          </p>
          <p>
            Further, the rates are subject to change without any prior consent and at the
            discretion and agreement between Money Lancer and the respective AMCs. The commission
            details will be regularly updated on this website and customers are advised to check
            the same before making any investment.
          </p>
          <p>
            Money Lancer has opted as "Opt Out" Distributor and hence no transaction charges
            shall be deducted by AMCs from Clients' Investment amount for the transactions done
            under the ARN Code. Details of Scheme level commission on Mutual funds are available
            with your Service Relationship Manager and would be produced on demand.
          </p>
          <p>
            Investments in mutual funds are subject to market risk and customers should read the
            scheme related documents / key information documents of the Mutual Funds / Schemes.
          </p>
        </div>
      </Container>
    </div>
  );
}
