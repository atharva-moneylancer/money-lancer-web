import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { LogoLockup } from "@/components/ui/Logo";

const SOCIAL = [
  {
    label: "LinkedIn",
    href: "https://in.linkedin.com/company/money-lancer-investment-pvt-ltd",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@Money_Lancer_Investments",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/moneylancer_investments/",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="mt-24 bg-navy text-white">
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <LogoLockup inverted />
            <p className="mt-4 text-sm text-white/70 leading-relaxed">
              Personalised wealth management trusted by Indian families since 1999. SEBI-compliant
              mutual fund distributors & wealth managers based in Pune.
            </p>
            <div className="mt-5 flex gap-4">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="text-white/60 transition-colors hover:text-electric"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <FooterCol title="Explore" links={[
            { href: "/#services", label: "Services" },
            { href: "/funds", label: "Fund Research" },
            { href: "/calculators", label: "Calculators" },
            { href: "/videos", label: "Videos" },
            { href: "/about", label: "About" },
          ]} />

          <FooterCol title="Solutions" links={[
            { href: "/services/mutual-funds", label: "Mutual Funds" },
            { href: "/services/sif", label: "SIF" },
            { href: "/services/ncds", label: "NCDs" },
            { href: "/services/bonds", label: "Bonds" },
            { href: "/services/insurance", label: "Insurance" },
            { href: "/services/loans", label: "Loans" },
          ]} />

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-white/60">Contact</h4>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              <li>
                <a href="tel:+919209039205" className="hover:text-electric">
                  +91 92090 39205
                </a>
              </li>
              <li>
                <a href="mailto:contact@mymoneylancer.com" className="hover:text-electric">
                  contact@mymoneylancer.com
                </a>
              </li>
              <li>Pune, Maharashtra, India</li>
            </ul>
          </div>
        </div>

        <hr className="my-10 border-white/10" />

        <div className="grid gap-4 text-xs text-white/60 md:grid-cols-2">
          <p>
            <strong className="text-white/80">AMFI Reg. No.:</strong> ARN-189009
            <br />
            Money Lancer Investments is an AMFI-registered Mutual Fund Distributor.
          </p>
          <div className="md:text-right">
            <Link href="/disclosures" className="underline hover:text-electric">Disclosures</Link>{" · "}
            <Link href="/disclosures/mf-commission-disclosure" className="underline hover:text-electric">Commission Disclosure</Link>{" · "}
            <Link href="/disclosures/investor-grievances" className="underline hover:text-electric">Grievance Redressal</Link>
          </div>
        </div>

        <p className="mt-6 text-[11px] leading-relaxed text-white/40">
          Mutual fund investments are subject to market risks. Read all scheme-related documents
          carefully. Past performance is not indicative of future returns. The information shown
          on this website is for general informational purposes only and does not constitute
          investment advice.
        </p>

        <p className="mt-8 text-xs text-white/40">
          © {new Date().getFullYear()} Money Lancer Investments. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold uppercase tracking-wide text-white/60">{title}</h4>
      <ul className="mt-4 space-y-2 text-sm text-white/80">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="hover:text-electric">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
