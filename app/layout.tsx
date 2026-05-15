import type { Metadata } from "next";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "@fontsource/manrope/800.css";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/ui/WhatsAppFloat";

export const metadata: Metadata = {
  metadataBase: new URL("https://mymoneylancer.com"),
  title: {
    default: "Money Lancer — Your Financial Partner",
    template: "%s · Money Lancer",
  },
  description:
    "Personalised wealth management for Indian families. Mutual funds, PMS, AIF, insurance, retirement and tax-efficient investing — trusted since 1999.",
  openGraph: {
    title: "Money Lancer — Your Financial Partner",
    description:
      "Personalised wealth management for Indian families. Mutual funds, PMS, AIF, insurance, retirement and tax-efficient investing.",
    siteName: "Money Lancer",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/brand/horizontal.png",
        width: 1200,
        height: 630,
        alt: "Money Lancer — Your Financial Partner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/brand/horizontal.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
