import Link from "next/link";
import { Container } from "@/components/ui/Container";

export const metadata = { title: "Disclosures" };

const CARDS = [
  {
    href: "/disclosures/investor-grievances",
    title: "Investor Grievances",
    desc: "Know how to raise and resolve concerns related to your investments.",
  },
  {
    href: "/disclosures/mf-commission-disclosure",
    title: "MF Commission Disclosure",
    desc: "Understand how Money Lancer earns commissions from AMCs.",
  },
  {
    href: "/disclosures/kim-sid-sai-factsheet",
    title: "KIM SID SAI Factsheet",
    desc: "Read essential scheme details before making investment decisions.",
  },
];

export default function DisclosuresPage() {
  return (
    <div className="bg-cloud pt-28">
      <Container className="pb-24 max-w-4xl">
        <h1 className="font-display text-headline font-bold text-ink">Disclosures</h1>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {CARDS.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group flex flex-col justify-between rounded-2xl border border-black/[0.07] bg-white p-6 shadow-soft transition-shadow hover:shadow-lift"
            >
              <div>
                <h2 className="text-title-s font-bold text-ink group-hover:text-crayola transition-colors">
                  {c.title}
                </h2>
                <p className="mt-2 text-sm text-slate1 leading-relaxed">{c.desc}</p>
              </div>
              <span className="mt-6 text-xs font-semibold uppercase tracking-wide text-crayola">
                Read more →
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
