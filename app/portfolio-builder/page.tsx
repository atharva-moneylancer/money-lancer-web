import { Container } from "@/components/ui/Container";
import { SectionEyebrow } from "@/components/home/Services";
import PortfolioBuilder from "@/components/portfolio/PortfolioBuilder";

export const metadata = {
  title: "Portfolio Builder — Build Your Custom Mutual Fund Portfolio | Money Lancer",
  description:
    "Pick from our research-backed spotlight funds or add any fund you like. Set your allocation, share your details, and send it to our advisory team via WhatsApp.",
  openGraph: {
    title: "Portfolio Builder | Money Lancer",
    description:
      "Build your custom mutual fund portfolio from spotlight funds curated by ML Research. Send to our team via WhatsApp.",
  },
};

export default function PortfolioBuilderPage() {
  return (
    <main className="relative overflow-hidden bg-cloud pb-24 pt-32">
      {/* Background decoration */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2">
        <div className="h-[600px] w-[600px] rounded-full bg-crayola/[0.04] blur-[120px]" />
      </div>

      <Container>
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <SectionEyebrow label="Portfolio Builder" />
          <h1 className="mt-4 font-display text-headline font-bold tracking-tight text-ink">
            Build your portfolio in minutes.
          </h1>
          <p className="mt-4 text-body-l text-slate1">
            Browse spotlight funds picked by our research team, or add any fund
            you prefer. Set your allocation and send it straight to our advisors.
          </p>
        </div>

        <PortfolioBuilder />
      </Container>
    </main>
  );
}
