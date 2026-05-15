import Link from "next/link";
import { Container } from "@/components/ui/Container";

export const metadata = { title: "Investor Grievances" };

export default function InvestorGrievancesPage() {
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
          Procedure for Redressal of Investor Grievances
        </h1>

        <div className="mt-8 space-y-6 text-body-m text-slate1 leading-relaxed">
          <p>
            In case, the client has any suggestions or feedback, he / she can follow the process
            mentioned below:
          </p>

          <ol className="space-y-5 list-none">
            <li className="flex gap-4">
              <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-crayola text-[11px] font-bold text-white">1</span>
              <div>
                <p>
                  The Client can contact Money Lancer Investments Private Limited in person, by
                  telephone or in writing by email at the following:
                </p>
                <div className="mt-3 rounded-xl border border-black/[0.07] bg-white p-5 text-sm space-y-1">
                  <p className="font-semibold text-ink">Money Lancer Investments Private Limited</p>
                  <p>Office No. 107/108 4th Dimension Building, Near Abhishek Veg Hotel,<br />Erandwane, Pune – 411004</p>
                  <p><strong className="text-graphite">Grievance Officer:</strong> Mrs. Pallavi Jadhav</p>
                  <p>
                    <strong className="text-graphite">Tel:</strong>{" "}
                    <a href="tel:+919423004307" className="text-crayola hover:underline">+(91) 94230 04307</a>
                  </p>
                  <p>
                    <strong className="text-graphite">Email:</strong>{" "}
                    <a href="mailto:support@mymoneylancer.com" className="text-crayola hover:underline">support@mymoneylancer.com</a>
                  </p>
                </div>
                <p className="mt-3">
                  If a client is not satisfied with the services and would like to lodge a
                  complaint, the client is requested to first talk to the authorised
                  representative from Money Lancer. The Client can discuss and be rest assured
                  that the complaint will be resolved on best effort basis within{" "}
                  <strong className="text-graphite">7 working days</strong>.
                </p>
              </div>
            </li>

            <li className="flex gap-4">
              <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-crayola text-[11px] font-bold text-white">2</span>
              <p>
                If the Client is still not satisfied with the response or the handling of the
                complaint by the authorized representative, the Client can approach and write an
                email to{" "}
                <strong className="text-graphite">Mr Santosh Eknath Pardeshi, Director</strong>, at{" "}
                <a href="mailto:moneylancermf@gmail.com" className="text-crayola hover:underline">
                  moneylancermf@gmail.com
                </a>{" "}
                with complete details. Mr Santosh Pardeshi will get in touch with you at the
                earliest and try to resolve your complaint as soon as possible.
              </p>
            </li>

            <li className="flex gap-4">
              <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-crayola text-[11px] font-bold text-white">3</span>
              <p>
                If the complaint is not resolved within a period of one month, the Client may
                refer the complaint to the regulator — The Securities and Exchange Board of India
                (SEBI). SEBI has launched a centralised web-based complaints redress system{" "}
                <strong className="text-graphite">'SCORES'</strong>. The link to the platform is{" "}
                <a
                  href="https://scores.sebi.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-crayola hover:underline"
                >
                  scores.sebi.gov.in
                </a>
                .
              </p>
            </li>

            <li className="flex gap-4">
              <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-crayola text-[11px] font-bold text-white">4</span>
              <p>
                An ODR Portal could be accessed if unsatisfied with the response. Your attention
                is drawn to the SEBI circular no.{" "}
                <strong className="text-graphite">
                  SEBI/HO/OIAE/OIAE_IAD-1/P/CIR/2023/131 dated July 31, 2023
                </strong>
                , on "Online Resolution of Disputes in the Indian Securities Market". A common
                Online Dispute Resolution Portal ("ODR Portal") which harnesses conciliation and
                online arbitration for resolution of disputes arising in the Indian Securities
                Market has been established. ODR Portal can be accessed at{" "}
                <a
                  href="https://smartodr.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-crayola hover:underline"
                >
                  smartodr.in
                </a>
                .
              </p>
            </li>

            <li className="flex gap-4">
              <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-crayola text-[11px] font-bold text-white">5</span>
              <div>
                <p>
                  Alternatively, the Client can write to SEBI at the following address:
                </p>
                <div className="mt-3 rounded-xl border border-black/[0.07] bg-white p-5 text-sm space-y-1">
                  <p className="font-semibold text-ink">Office of Investor Assistance and Education</p>
                  <p>SEBI Bhavan, Plot No. C4-A, G Block,<br />Bandra Kurla Complex, Bandra (E), Mumbai – 400051</p>
                  <p><strong className="text-graphite">Telephone:</strong> +91-22-2644 9000 / 4045 9000</p>
                  <p><strong className="text-graphite">Fax:</strong> +91-22-2644 9016-20 / 4045 9016-20</p>
                </div>
              </div>
            </li>
          </ol>
        </div>
      </Container>
    </div>
  );
}
