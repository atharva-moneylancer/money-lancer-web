import Link from "next/link";
import { Container } from "@/components/ui/Container";

export function CalculatorShell({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-mesh-soft pt-28">
      <Container className="pb-24">
        <Link href="/calculators" className="text-sm font-semibold text-crayola hover:underline">← All calculators</Link>
        <div className="mt-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-crayola">
          <span className="h-px w-6 bg-crayola/40" />
          {eyebrow}
        </div>
        <h1 className="mt-3 max-w-3xl font-display text-headline font-bold tracking-tight text-ink">{title}</h1>
        <p className="mt-4 max-w-2xl text-body-l text-slate1">{subtitle}</p>
        <div className="mt-10">{children}</div>
      </Container>
    </div>
  );
}
