import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Risk Profiler",
  description:
    "Discover your investor personality in 5 minutes. Answer simple questions and get a personalised asset allocation recommendation from Money Lancer.",
};

export default function RiskProfilerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
