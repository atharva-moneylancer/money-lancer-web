import Link from "next/link";
import { Container } from "@/components/ui/Container";

export const metadata = { title: "KIM / SID / SAI / Factsheet" };

type AmcRow = {
  amc: string;
  sid: string | null;
  kim: string | null;
  sai: string | null;
  factsheet: string | null;
};

const AMCS: AmcRow[] = [
  {
    amc: "Aditya Birla Sun Life Mutual Fund",
    sid: "https://mutualfund.adityabirlacapital.com/forms-and-downloads/forms",
    kim: "https://mutualfund.adityabirlacapital.com/forms-and-downloads/forms",
    sai: "https://mutualfund.adityabirlacapital.com/forms-and-downloads/forms",
    factsheet: "https://mutualfund.adityabirlacapital.com/forms-and-downloads/factsheets",
  },
  {
    amc: "Axis Mutual Fund",
    sid: "https://www.axismf.com/statutory-disclosures",
    kim: "https://www.axismf.com/statutory-disclosures",
    sai: "https://www.axismf.com/statutory-disclosures",
    factsheet: "https://www.axismf.com/downloads",
  },
  {
    amc: "Bajaj Finserv Mutual Fund",
    sid: "https://www.bajajamc.com/downloads?sid-kim-products-forms",
    kim: "https://www.bajajamc.com/downloads?sid-kim-products-forms",
    sai: "https://www.bajajamc.com/downloads",
    factsheet: "https://www.bajajamc.com/downloads?factsheet",
  },
  {
    amc: "Bandhan Mutual Fund",
    sid: "https://bandhanmutual.com/downloads/sid",
    kim: "https://bandhanmutual.com/downloads/kim",
    sai: "https://bandhanmutual.com/downloads/sai",
    factsheet: "https://bandhanmutual.com/downloads/factsheets",
  },
  {
    amc: "Baroda BNP Paribas Mutual Fund",
    sid: "https://www.barodabnpparibasmf.in/downloads",
    kim: "https://www.barodabnpparibasmf.in/downloads",
    sai: "https://www.barodabnpparibasmf.in/downloads",
    factsheet: "https://www.barodabnpparibasmf.in/downloads",
  },
  {
    amc: "Canara Robeco Mutual Fund",
    sid: "https://www.canararobeco.com/forms-downloads/forms-and-information-documents/information-document/sid",
    kim: "https://www.canararobeco.com/forms-downloads/forms-and-information-documents/forms/application-form",
    sai: "https://www.canararobeco.com/forms-downloads/forms-and-information-documents/information-document/sai",
    factsheet: "https://www.canararobeco.com/forms-downloads/forms-and-information-documents/information-document/factsheets",
  },
  {
    amc: "DSP Mutual Fund",
    sid: "https://www.dspim.com/downloads?category=Information%20Documents&sub_category=SID/SAI",
    kim: "https://www.dspim.com/downloads?category=Information%20Documents&sub_category=Key%20Information%20Memorandum%20-%20KIM",
    sai: "https://www.dspim.com/downloads?category=Information%20Documents&sub_category=SID/SAI",
    factsheet: "https://www.dspim.com/downloads?category=Information%20Documents&sub_category=Factsheets",
  },
  {
    amc: "Edelweiss Mutual Fund",
    sid: "https://www.edelweissmf.com/downloads/scheme-information-document-funds",
    kim: "https://www.edelweissmf.com/downloads/forms",
    sai: "https://www.edelweissmf.com/downloads/sai-&-amendments",
    factsheet: "https://www.edelweissmf.com/downloads/factsheets",
  },
  {
    amc: "Franklin Templeton Mutual Fund",
    sid: "https://www.franklintempletonindia.com/downloads/fund-documents",
    kim: "https://www.franklintempletonindia.com/downloads/fund-documents",
    sai: "https://www.franklintempletonindia.com/downloads/fund-documents",
    factsheet: "https://www.franklintempletonindia.com/downloads/fund-documents",
  },
  {
    amc: "HDFC Mutual Fund",
    sid: "https://www.hdfcfund.com/investor-services/fund-documents/sid",
    kim: "https://www.hdfcfund.com/investor-services/fund-documents/kim",
    sai: "https://files.hdfcfund.com/s3fs-public/2023-05/SAI%20with%20updated%20Addendum%20dated%20May%2029%2C%202023_1.pdf",
    factsheet: "https://www.hdfcfund.com/investor-services/factsheets",
  },
  {
    amc: "Helios Mutual Fund",
    sid: "https://www.heliosmf.in/downloads/",
    kim: "https://www.heliosmf.in/downloads/",
    sai: "https://www.heliosmf.in/downloads/",
    factsheet: "https://www.heliosmf.in/downloads/",
  },
  {
    amc: "HSBC Mutual Fund",
    sid: "https://www.assetmanagement.hsbc.co.in/en/mutual-funds/investor-resources?Date=&Cap=&Doc=sid",
    kim: "https://www.assetmanagement.hsbc.co.in/en/mutual-funds/investor-resources?Date=&Cap=&Doc=kim,sid",
    sai: "https://www.assetmanagement.hsbc.co.in/en/mutual-funds/investor-resources?Date=&Cap=&Doc=kim,sid,sai",
    factsheet: "https://www.assetmanagement.hsbc.co.in/en/mutual-funds/search-results?q=factsheet&page=6#openTab=0",
  },
  {
    amc: "ICICI Prudential Mutual Fund",
    sid: "https://www.archive.icicipruamc.com/downloads/sid",
    kim: "https://www.archive.icicipruamc.com/downloads/kim",
    sai: "https://www.archive.icicipruamc.com/downloads/sai",
    factsheet: "https://www.archive.icicipruamc.com/downloads/factsheet-and-portfolio",
  },
  {
    amc: "Invesco Mutual Fund",
    sid: "https://invescomutualfund.com/literature-and-form?tab=Scheme",
    kim: "https://invescomutualfund.com/literature-and-form?tab=Documents",
    sai: "https://www.invescomutualfund.com/literature-and-form?tab=Documents",
    factsheet: "https://invescomutualfund.com/literature-and-form?tab=Factsheets",
  },
  {
    amc: "JM Financial Mutual Fund",
    sid: "https://www.jmfinancialmf.com/downloads/Scheme-related-documents",
    kim: "https://www.jmfinancialmf.com/downloads/Scheme-related-documents/Key-Information-Memorandum-(KIM)",
    sai: "https://www.jmfinancialmf.com/downloads/Scheme-related-documents/Statement-of-Additional-Information-(SAI)",
    factsheet: "https://www.jmfinancialmf.com/downloads/Factsheet/Factsheet",
  },
  {
    amc: "Kotak Mahindra Mutual Fund",
    sid: "https://www.kotakmf.com/Information/forms-and-downloads",
    kim: "https://www.kotakmf.com/Information/forms-and-downloads",
    sai: "https://www.kotakmf.com/Information/forms-and-downloads/Statement_of_Additional_Information/StatementofAdditionalInformationMarch312024.pdf",
    factsheet: "https://www.kotakmf.com/Information/forms-and-downloads/Factsheet/Factsheet_for_April_2024/KotakMFFactsheetApril2024.pdf",
  },
  {
    amc: "LIC Mutual Fund",
    sid: "https://www.licmf.com/sid-kim-sai",
    kim: "https://www.licmf.com/sid-kim-sai",
    sai: "https://www.licmf.com/sid-kim-sai",
    factsheet: "https://www.licmf.com/downloads/factsheet",
  },
  {
    amc: "Mahindra Manulife Mutual Fund",
    sid: "https://www.mahindramanulife.com/downloads#mandatory-disclosures",
    kim: "https://www.mahindramanulife.com/downloads#mandatory-disclosures",
    sai: "https://www.mahindramanulife.com/downloads#mandatory-disclosures",
    factsheet: "https://www.mahindramanulife.com/downloads#mandatory-disclosures",
  },
  {
    amc: "Mirae Asset Mutual Fund",
    sid: "https://www.miraeassetmf.co.in/downloads/forms",
    kim: "https://www.miraeassetmf.co.in/downloads/forms",
    sai: "https://www.miraeassetmf.co.in/downloads/forms",
    factsheet: "https://www.miraeassetmf.co.in/downloads/factsheet",
  },
  {
    amc: "Motilal Oswal Mutual Fund",
    sid: "https://www.motilaloswalmf.com/download/sid",
    kim: "https://www.motilaloswalmf.com/download/key-information-memorandum",
    sai: "https://www.motilaloswalmf.com/download/sai",
    factsheet: "https://www.motilaloswalmf.com/download/factsheets",
  },
  {
    amc: "Nippon India Mutual Fund",
    sid: "https://mf.nipponindiaim.com/investor-service/downloads/scheme-information-document",
    kim: null,
    sai: "https://mf.nipponindiaim.com/",
    factsheet: "https://mf.nipponindiaim.com/investor-service/downloads/factsheet-portfolio-and-other-disclosures",
  },
  {
    amc: "PGIM India Mutual Fund",
    sid: "https://www.pgimindiamf.com/forms-and-updates/sid-and-sai",
    kim: "https://www.pgimindiamf.com/forms-and-updates",
    sai: "https://www.pgimindiamf.com/forms-and-updates/sid-and-sai",
    factsheet: "https://www.pgimindiamf.com/forms-and-updates/fund-factsheet",
  },
  {
    amc: "PPFAS Mutual Fund",
    sid: "https://amc.ppfas.com/downloads/kim-sid-and-sai/",
    kim: "https://amc.ppfas.com/downloads/kim-sid-and-sai/",
    sai: "https://amc.ppfas.com/downloads/kim-sid-and-sai/",
    factsheet: "https://amc.ppfas.com/downloads/factsheet/",
  },
  {
    amc: "Quant Mutual Fund",
    sid: "https://quantmutual.com/downloads/kim",
    kim: "https://quantmutual.com/downloads/kim",
    sai: "https://quantmutual.com/downloads/kim",
    factsheet: "https://quantmutual.com/downloads/factsheet",
  },
  {
    amc: "Quantum Mutual Fund",
    sid: "https://www.quantumamc.com/regulatory-document",
    kim: "https://www.quantumamc.com/regulatory-document",
    sai: "https://www.quantumamc.com/regulatory-document",
    factsheet: "https://www.quantumamc.com/factsheets/combined/-1/0/0",
  },
  {
    amc: "SBI Mutual Fund",
    sid: "https://www.sbimf.com/offer-document-sid-kim",
    kim: "https://www.sbimf.com/offer-document-sid-kim",
    sai: "https://www.sbimf.com/docs/default-source/documents/statement-of-additional-information.pdf",
    factsheet: "https://www.sbimf.com/factsheets",
  },
  {
    amc: "Samco Mutual Fund",
    sid: "https://www.samcomf.com/downloads",
    kim: "https://www.samcomf.com/downloads",
    sai: "https://www.samcomf.com/downloads",
    factsheet: "https://www.samcomf.com/downloads",
  },
  {
    amc: "Sundaram Mutual Fund",
    sid: "https://www.sundarammutual.com/Downloads",
    kim: "https://www.sundarammutual.com/Downloads",
    sai: "https://www.sundarammutual.com/Downloads",
    factsheet: "https://www.sundarammutual.com/Downloads",
  },
  {
    amc: "Tata Mutual Fund",
    sid: "https://www.tatamutualfund.com/schemes-related/scheme-summary",
    kim: "https://www.tatamutualfund.com/forms/transaction-forms",
    sai: "https://www.tatamutualfund.com/forms",
    factsheet: "https://www.tatamutualfund.com/information-documents/factsheets",
  },
  {
    amc: "UTI Mutual Fund",
    sid: "https://www.utimf.com/downloads/sid",
    kim: "https://www.utimf.com/downloads/kyc",
    sai: "https://www.utimf.com/downloads/kyc",
    factsheet: "https://www.utimf.com/downloads/fact-sheet",
  },
];

function DocLink({ href }: { href: string | null }) {
  if (!href) return <span className="text-slate2">—</span>;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-semibold text-crayola hover:underline"
    >
      Click Here
    </a>
  );
}

export default function KimSidSaiPage() {
  return (
    <div className="bg-cloud pt-28">
      <Container className="pb-24 max-w-5xl">
        <Link
          href="/disclosures"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-semibold text-crayola hover:underline"
        >
          ← Back to Disclosures
        </Link>

        <h1 className="mt-4 font-display text-headline font-bold text-ink">
          KIM / SID / SAI / Factsheet
        </h1>

        <div className="mt-8 overflow-x-auto rounded-2xl border border-black/[0.06] bg-white shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead>
                <tr className="border-b border-black/5 bg-cloud text-[11px] font-semibold uppercase tracking-wider text-slate2">
                  <th className="px-5 py-3 text-center w-12">#</th>
                  <th className="px-5 py-3 text-left">AMC Name</th>
                  <th className="px-5 py-3 text-center">SID</th>
                  <th className="px-5 py-3 text-center">KIM</th>
                  <th className="px-5 py-3 text-center">SAI</th>
                  <th className="px-5 py-3 text-center">Factsheet</th>
                </tr>
              </thead>
              <tbody>
                {AMCS.map((row, i) => (
                  <tr
                    key={row.amc}
                    className="border-b border-black/5 transition-colors last:border-0 hover:bg-cloud"
                  >
                    <td className="px-5 py-4 text-center text-slate2">{i + 1}.</td>
                    <td className="px-5 py-4 font-medium text-graphite">{row.amc}</td>
                    <td className="px-5 py-4 text-center"><DocLink href={row.sid} /></td>
                    <td className="px-5 py-4 text-center"><DocLink href={row.kim} /></td>
                    <td className="px-5 py-4 text-center"><DocLink href={row.sai} /></td>
                    <td className="px-5 py-4 text-center"><DocLink href={row.factsheet} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Container>
    </div>
  );
}
