import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionEyebrow } from "@/components/home/Services";

export const metadata: Metadata = {
  title: "Calculators",
  description:
    "Free financial calculators — SIP, lumpsum, goal planning, retirement, tax savings, EMI and more. Plan your wealth with Money Lancer.",
};

type Calc = { href: string; title: string; desc: string; badge?: string };

const CALCS: { group: string; icon: string; items: Calc[] }[] = [
  {
    group: "Wealth Building",
    icon: "📈",
    items: [
      { href: "/calculators/sip", title: "SIP Calculator", desc: "Project the future value of your monthly SIP." },
      { href: "/calculators/stepup-sip", title: "Step-up SIP", desc: "Increase your SIP each year and see the compounding impact." },
      { href: "/calculators/lumpsum", title: "Lumpsum", desc: "Future value of a one-time investment." },
      { href: "/calculators/swp", title: "SWP", desc: "Model monthly withdrawals from a corpus." },
      { href: "/calculators/fd-rd", title: "FD / RD", desc: "Maturity value and interest on Fixed & Recurring Deposits." },
    ],
  },
  {
    group: "Goals",
    icon: "🎯",
    items: [
      { href: "/calculators/fire", title: "FIRE Calculator", desc: "Find your Financial Independence number and timeline.", badge: "Popular" },
      { href: "/calculators/retirement", title: "Retirement Corpus", desc: "Build the corpus that funds your retirement." },
      { href: "/calculators/goal", title: "Goal-based Investing", desc: "Required SIP for any financial goal." },
      { href: "/calculators/children", title: "Children's Education", desc: "Future cost of education and monthly SIP needed." },
      { href: "/calculators/marriage", title: "Marriage Corpus", desc: "Plan your or your child's wedding fund." },
      { href: "/calculators/home", title: "Home Down-Payment", desc: "Save for your down payment, stamp duty, and registration." },
    ],
  },
  {
    group: "Tax Planning",
    icon: "🧾",
    items: [
      { href: "/calculators/income-tax", title: "Income Tax", desc: "Old vs New regime — which saves you more?", badge: "FY 2024–25" },
      { href: "/calculators/hra", title: "HRA Exemption", desc: "Calculate your House Rent Allowance tax exemption." },
      { href: "/calculators/capital-gains", title: "Capital Gains", desc: "STCG / LTCG tax on equity, debt, real estate, and gold.", badge: "Budget 2024" },
      { href: "/calculators/elss-vs-ppf", title: "ELSS vs PPF", desc: "Post-tax comparison of the two most popular 80C options." },
    ],
  },
  {
    group: "Retirement & Pension",
    icon: "🏖️",
    items: [
      { href: "/calculators/nps", title: "NPS Calculator", desc: "Corpus, lump sum, and monthly pension from the National Pension System." },
      { href: "/calculators/ppf", title: "PPF Calculator", desc: "Tax-free maturity value of your Public Provident Fund." },
    ],
  },
  {
    group: "Loans",
    icon: "🏦",
    items: [
      { href: "/calculators/emi", title: "EMI Calculator", desc: "Monthly EMI and total interest for any loan." },
      { href: "/calculators/inflation", title: "Inflation Impact", desc: "See how inflation erodes purchasing power — and what you need to earn to beat it." },
    ],
  },
];

export default function CalculatorsHub() {
  return (
    <div className="bg-mesh-soft pt-28">
      <Container className="pb-24">
        <SectionEyebrow label="Calculators" />
        <h1 className="mt-4 max-w-3xl font-display text-headline font-bold tracking-tight text-ink">
          Tools that turn intent into action.
        </h1>
        <p className="mt-4 max-w-2xl text-body-l text-slate1">
          Every calculator here uses the same engine that powers our advisor desk. Use them to
          model scenarios — then talk to us to put them into action.
        </p>

        {/* Quick jump */}
        <div className="mt-8 flex flex-wrap gap-2">
          {CALCS.map((g) => (
            <a
              key={g.group}
              href={`#${g.group.toLowerCase().replace(/\s+/g, "-")}`}
              className="rounded-full border border-black/10 bg-white px-4 py-1.5 text-xs font-semibold text-graphite transition-colors hover:border-crayola hover:text-crayola"
            >
              {g.icon} {g.group}
            </a>
          ))}
        </div>

        {CALCS.map((g) => (
          <section
            key={g.group}
            id={g.group.toLowerCase().replace(/\s+/g, "-")}
            className="mt-14 scroll-mt-28"
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{g.icon}</span>
              <h2 className="text-title-m font-bold text-yale">{g.group}</h2>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  className="group relative rounded-2xl border border-black/[0.06] bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:border-crayola/30 hover:shadow-lift"
                >
                  {c.badge && (
                    <span className="absolute right-4 top-4 rounded-full bg-crayola/10 px-2.5 py-0.5 text-[10px] font-semibold text-crayola">
                      {c.badge}
                    </span>
                  )}
                  <div className="text-title-s font-semibold text-ink transition-colors group-hover:text-crayola">
                    {c.title}
                  </div>
                  <p className="mt-2 text-sm text-slate1">{c.desc}</p>
                  <div className="mt-4 inline-flex items-center text-sm font-semibold text-crayola">
                    Open
                    <svg
                      className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M5 12h14M13 5l7 7-7 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}

        {/* CTA */}
        <div className="mt-20 rounded-3xl bg-navy p-10 text-white md:p-14">
          <div className="max-w-2xl">
            <h3 className="font-display text-title-l font-bold">
              Numbers are a starting point, not the answer.
            </h3>
            <p className="mt-3 text-white/75">
              Every calculator gives you a projection. Our advisors help you build the actual
              investment strategy — right funds, right allocation, right timing.
            </p>
            <div className="mt-6">
              <Link
                href="/#contact"
                className="inline-flex items-center rounded-full bg-crayola px-6 py-3 text-sm font-semibold text-white shadow-cta transition-all hover:bg-yale"
              >
                Talk to an advisor →
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
