export type Service = {
  slug: string;
  title: string;
  tagline: string;
  intro: string;
  bullets: string[];
  bestFor: string[];
  notFor?: string[];
  faqs: { q: string; a: string }[];
  cta?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  badge?: "ELITE" | "NEW";
};

export const SERVICES: Service[] = [
  {
    slug: "mutual-funds",
    title: "Mutual Funds",
    tagline: "Curated SIPs and lumpsum portfolios that match your goals.",
    intro:
      "Open-ended schemes from 45+ AMCs, chosen for you based on your risk profile, time horizon and tax situation — not on commission incentives. Every fund we recommend is researched in-house and reviewed annually for fit.",
    bullets: [
      "Equity, Hybrid, Debt and Index funds across every SEBI category",
      "Goal-tagged SIPs that map to retirement, education, home, marriage",
      "Annual portfolio review with rebalancing recommendations",
      "Tax-efficient withdrawals at goal time (LTCG harvesting, STP into debt)",
      "Regular Plans only — backed by a continuous advisor relationship",
    ],
    bestFor: ["First-time investors", "Salaried professionals", "Goal-based investing", "Tax-saving via ELSS"],
    cta: { label: "Talk to us", href: "/#contact" },
    ctaSecondary: { label: "Browse funds", href: "/funds" },
    faqs: [
      { q: "What's the minimum SIP amount?", a: "Most schemes start at ₹100–500 per month. Some specialised categories require ₹1,000+." },
      { q: "How are you compensated?", a: "AMCs pay us a trail commission embedded in the expense ratio of Regular Plans. We don't charge you separately." },
      { q: "Why Regular Plans and not Direct Plans?", a: "Direct Plans are for DIY investors who want zero advisor involvement. Regular Plans bundle the advisory cost into the expense ratio — small in absolute terms, but covers your full review-and-rebalance relationship with us." },
      { q: "Can I switch funds anytime?", a: "Yes — open-ended schemes allow redemption on any business day, subject to exit load and tax implications." },
    ],
  },
  {
    slug: "sif",
    title: "SIF — Specialized Investment Fund",
    tagline: "SEBI's new investment category for sophisticated strategies.",
    badge: "NEW",
    intro:
      "Specialized Investment Funds (SIFs) are SEBI's newest investment vehicle, launched in 2024. They bridge the gap between mutual funds (₹100 minimum, broad strategies) and PMS (₹50 lakh minimum, fully custom mandates). With a ₹10 lakh minimum investment and a wider toolkit — derivatives, short positions, sectoral concentration — SIFs bring PMS-style sophistication to a much wider audience.",
    bullets: [
      "Minimum investment ₹10 lakhs as per SEBI norms",
      "Long-short, sectoral, multi-asset and absolute-return strategies",
      "Pooled vehicle structure — easier to enter and exit than PMS",
      "Higher TER than mutual funds, lower than PMS performance fees",
      "Curated SIF launches from established AMCs only",
    ],
    bestFor: [
      "Investors above the ₹10 lakh threshold seeking PMS-style exposure",
      "Looking for hedged or absolute-return strategies",
      "Wanting concentrated bets beyond what mutual funds allow",
    ],
    notFor: ["First-time investors", "Short-horizon (<3 years) capital"],
    cta: { label: "Get curated SIF options", href: "/#contact" },
    faqs: [
      { q: "How is a SIF different from a mutual fund?", a: "Mutual funds are tightly regulated on concentration, derivatives use, and short positions. SIFs operate under a more flexible mandate — allowing strategies like long-short equity, sector rotation, and use of derivatives for alpha (not just hedging) — but they require a higher minimum." },
      { q: "How is a SIF different from PMS?", a: "PMS gives you direct ownership of stocks in your demat with a fully custom strategy. SIFs are pooled — you own units of the fund. SIFs have a lower minimum (₹10L vs ₹50L for PMS) and lower fees, but less customisation." },
      { q: "When were SIFs introduced?", a: "SEBI notified the Specialized Investment Fund framework in 2024. The first SIF launches began rolling out in 2025; our team curates only those with strong manager track records." },
      { q: "How are SIFs taxed?", a: "Tax treatment depends on the underlying asset mix — equity-oriented SIFs (≥65% equity) are taxed like equity mutual funds; debt-oriented SIFs are taxed at slab rate. We'll model the after-tax outcome for your specific situation." },
    ],
  },
  {
    slug: "ncds",
    title: "Non-Convertible Debentures (NCDs)",
    tagline: "Fixed-income corporate debt, higher coupons than FDs.",
    intro:
      "NCDs are debt instruments issued by companies to raise capital, paying a fixed coupon (typically 8-12% p.a.) over a defined tenure. Yields beat bank fixed deposits, with the trade-off being credit risk based on the issuer. We help you pick listed, credit-rated NCDs that match your income and risk needs — and stay clear of the rest.",
    bullets: [
      "Secured NCDs (backed by company assets) and unsecured NCDs",
      "Coupon options: monthly, quarterly, annual, cumulative",
      "Tenures from 1 to 10 years across issuers",
      "Listed NCDs — exchange liquidity if you need to exit before maturity",
      "Credit-rating filtered shortlist — we don't push unrated or low-rated paper",
    ],
    bestFor: [
      "Investors looking for predictable income above FD rates",
      "Retirees building a monthly-income ladder",
      "Diversifying away from bank deposits within the fixed-income bucket",
    ],
    notFor: ["Investors who can't afford any principal risk (stick to G-Secs)", "Those needing 100% liquidity at any time"],
    cta: { label: "See current NCD offerings", href: "/#contact" },
    faqs: [
      { q: "How are NCDs different from bank FDs?", a: "FDs are issued by banks and carry implicit RBI oversight + ₹5 lakh DICGC insurance. NCDs are issued by companies — usually offer 1-3% higher yields but carry the issuer's credit risk. A AAA-rated NCD from a top NBFC is very different from an unrated small-issuer NCD." },
      { q: "What credit ratings should I look for?", a: "We typically stay in AAA / AA+ rated paper for conservative portfolios; AA / AA- can earn extra yield for risk-tolerant investors. Below A, only with strong issuer-specific reasoning." },
      { q: "How are NCDs taxed?", a: "Interest income is taxed at your slab rate. Capital gains on sale before maturity are taxed as STCG (slab rate, <1 year) or LTCG (10% without indexation, ≥1 year for listed NCDs)." },
      { q: "Can I exit before maturity?", a: "Listed NCDs trade on BSE/NSE — you can sell anytime, though spreads can be wide for less-liquid issues. Unlisted NCDs are typically hold-to-maturity." },
    ],
  },
  {
    slug: "bonds",
    title: "Bonds",
    tagline: "Predictable income across government, corporate and tax-free issues.",
    intro:
      "Bonds are debt instruments offering predictable income with a defined maturity. They sit at the foundation of every well-diversified portfolio — smoothing returns during equity drawdowns and funding near-term goals. We help you build the fixed-income side of your portfolio across the full risk spectrum.",
    bullets: [
      "Government Securities (G-Secs) — zero default risk, sovereign-backed",
      "State Development Loans (SDLs) — small yield pickup over G-Secs",
      "Corporate bonds — credit-rated, higher yields, varied tenures",
      "Tax-free Bonds — interest exempt from income tax (great for high tax brackets)",
      "Sovereign Gold Bonds — gold exposure with 2.5% p.a. interest",
      "Ladder strategies — staggered maturities for predictable cashflows",
    ],
    bestFor: [
      "Retirees and pre-retirees seeking predictable income",
      "Anyone above the 20% tax slab considering tax-free bonds",
      "Building the safe sleeve of a diversified portfolio",
    ],
    cta: { label: "Build your bond portfolio", href: "/#contact" },
    faqs: [
      { q: "How do bond returns compare to FDs?", a: "G-Secs and high-quality corporate bonds typically yield 1-2% more than equivalent-tenure FDs. Tax-free bonds can give a post-tax yield equivalent to 9-10%+ FD rates for investors in the highest tax slab." },
      { q: "Are bonds risk-free?", a: "G-Secs are essentially default risk-free (the Indian government can print rupees if needed). All bonds carry interest rate risk — when rates rise, existing bond prices fall. Hold-to-maturity avoids this, but mark-to-market matters if you may need to sell early." },
      { q: "What's a Sovereign Gold Bond?", a: "Issued by RBI on behalf of the Government of India. You get gold exposure (price-linked to grams of 999 gold) PLUS 2.5% annual interest, with capital gains on maturity exempt from tax. Issued in tranches — we keep clients informed of upcoming series." },
      { q: "How are bond gains taxed?", a: "Interest is taxed at slab rate (except tax-free bonds). Capital gains on sale before maturity: STCG at slab rate if held <1 year, LTCG at 10% without indexation if ≥1 year (listed bonds). Tax-free bonds: zero tax on interest." },
    ],
  },
  {
    slug: "insurance",
    title: "Insurance",
    tagline: "Right cover at the right cost — life, health, term.",
    intro:
      "Insurance is the foundation of a financial plan, not an afterthought. We're not in the business of pushing endowment policies that mix insurance with weak investment returns. Pure term life cover, family floater health cover, top-ups, and critical illness riders — chosen for value, not for the commission they pay us.",
    bullets: [
      "Pure term life cover (typically ₹1 Cr+ sum assured for most clients)",
      "Family floater + individual health policies with top-ups",
      "Critical illness and personal accident riders",
      "Annual review at policy renewal — sum assured kept ahead of inflation",
      "Independent — we compare quotes across 8+ insurers",
    ],
    bestFor: ["Everyone — adequate cover comes before any equity investment"],
    cta: { label: "Get a quote", href: "/#contact" },
    faqs: [
      { q: "Do you sell ULIPs or endowment plans?", a: "We rarely recommend them. The same goals (life cover + long-term investing) are achieved more cheaply with separate term insurance and mutual funds — and you get full transparency on what's earning what." },
      { q: "How much life cover do I need?", a: "A common rule of thumb is 15-20× your annual income, adjusted for outstanding loans and dependents' future needs. We'll work the actual number for your situation." },
      { q: "Term insurance till what age?", a: "Cover should last as long as someone depends on your income. Most clients hold term policies till retirement (age 60-65). Cover beyond that age is usually unnecessary if your investment corpus is on track." },
      { q: "Health insurance via my employer — do I still need a personal policy?", a: "Yes. Employer cover ends the day you leave the company. A personal floater started young gives you a no-claim bonus, lifelong renewability, and continuity that an employer plan can't." },
    ],
  },
  {
    slug: "loans",
    title: "Loans",
    tagline: "Right loan, simplified processing.",
    intro:
      "Sometimes the right financial move is borrowing, not redeeming investments. Home loans, loan against mutual funds, education loans and personal loans through our network of bank and NBFC partners. We help you compare rates, negotiate terms, and structure the loan tax-efficiently.",
    bullets: [
      "Home loans — rate comparison across 8+ banks, balance-transfer opportunities",
      "Loan against mutual funds — borrow without redeeming your portfolio",
      "Education loans for higher studies in India and abroad",
      "Personal loans — only when other options don't fit",
      "Tax planning around home-loan interest deduction (₹2L u/s 24)",
    ],
    bestFor: ["First-time home buyers", "Investors avoiding redemption", "Education funding", "Balance-transfer for existing high-rate loans"],
    cta: { label: "Check eligibility", href: "/#contact" },
    faqs: [
      { q: "What's a loan against mutual funds?", a: "You pledge your mutual fund units to a bank/NBFC and get an overdraft facility (typically 50-80% of NAV). You pay interest only on the amount drawn, and continue to earn returns on the pledged units — much cheaper than a personal loan and avoids capital gains tax from redemption." },
      { q: "Should I prepay my home loan or invest more?", a: "Depends on your loan rate vs. expected investment return after tax. Home loan interest is partially tax-deductible (₹2L u/s 24); equity LTCG is taxed at 12.5% above ₹1.25L/yr. We'll model both paths and let the numbers decide." },
      { q: "How is your loan service compensated?", a: "We earn a one-time DSA commission from the lender — same rate regardless of which bank you choose, so we pick the best rate for you, not for us." },
    ],
  },
];

export function getService(slug: string) {
  return SERVICES.find((s) => s.slug === slug);
}
