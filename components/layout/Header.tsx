"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LogoLockup } from "@/components/ui/Logo";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/#services", label: "Services" },
  { href: "/funds", label: "Fund Research" },
  { href: "/funds/buckets", label: "Buckets" },
  { href: "/calculators", label: "Calculators" },
  { href: "/insights", label: "Insights" },
  { href: "/videos", label: "Videos" },
  { href: "/about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "backdrop-blur-xl bg-white/80 border-b border-black/5" : "bg-transparent"
      )}
    >
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="shrink-0">
          <LogoLockup />
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-graphite">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="relative hover:text-crayola transition-colors"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" href="https://mymoneylancer.investwell.app/app/#/login">
            Login
          </Button>
          <Button size="sm" href="/#contact" className="hidden sm:inline-flex">
            Book a call
          </Button>
          <button
            aria-label="Menu"
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-black/10"
            onClick={() => setOpen((s) => !s)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </Container>

      {/* mobile menu */}
      {open && (
        <div className="md:hidden border-t border-black/5 bg-white/95 backdrop-blur-xl">
          <Container className="py-4">
            <ul className="space-y-2 text-sm font-medium text-graphite">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link onClick={() => setOpen(false)} className="block py-2" href={n.href}>
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </div>
      )}
    </header>
  );
}
