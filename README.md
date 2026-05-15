# Money Lancer — Web (revamp)

A Next.js 14 rebuild of mymoneylancer.com with AdvisorKhoj integration for live mutual fund data.

## What's inside

```
money-lancer-web/
├── app/
│   ├── page.tsx                  Homepage (Hero, Stats, Services, Live Funds, SIP, Why, Testimonials, CTA)
│   ├── funds/
│   │   ├── page.tsx              Fund research hub — categories + top performers (AdvisorKhoj)
│   │   └── [scheme]/page.tsx     Fund detail page (NAV, returns, manager, benchmark)
│   ├── calculators/
│   │   ├── page.tsx              Calculators hub
│   │   ├── sip/page.tsx          SIP calculator
│   │   ├── lumpsum/page.tsx      Lumpsum
│   │   ├── stepup-sip/page.tsx   Step-up SIP
│   │   ├── swp/page.tsx          SWP
│   │   ├── retirement/page.tsx   Retirement corpus calculator
│   │   └── goal/page.tsx         Goal calculator
│   ├── about/page.tsx
│   ├── disclosures/page.tsx
│   └── api/advisorkhoj/[...path]/route.ts   Server-side proxy (hides API key)
├── components/
│   ├── home/                     Hero, StatsStrip, Services, LiveFunds, SipCalculator, etc.
│   ├── calculator/CalculatorShell.tsx
│   ├── layout/Header.tsx, Footer.tsx
│   └── ui/                       Button, Container, Logo
├── lib/
│   ├── advisorkhoj.ts            Typed AdvisorKhoj client
│   ├── format.ts                 INR + date helpers
│   └── utils.ts
├── tailwind.config.ts            Brand tokens (Yale Blue, Crayola, Electric, Spring, Gold…)
├── .env.local                    AdvisorKhoj API key (already filled in)
└── package.json
```

## Run locally

```bash
cd "money-lancer-web"
npm install
npm run dev
# open http://localhost:3001
```

For a production build:

```bash
npm run build
npm start
```

## Brand tokens

Match the official Brand Guidelines PDF:

| Token | Hex | Use |
|---|---|---|
| `crayola` | `#1675F4` | Primary CTA, links, highlights |
| `yale`    | `#0B3B7A` | Strong headings, dark CTA fill |
| `navy`    | `#08234A` | Hero background base |
| `electric`| `#64E9EE` | Accent, hover glow |
| `spring`  | `#40F99B` | Positive returns, success |
| `gold`    | `#FFD700` | Elite tier (PMS, AIF) |
| `graphite`| `#333333` | Body text |
| `cloud`   | `#FAFCFF` | Page background |

Font: Manrope (loaded from Google Fonts, weights 400 / 500 / 600 / 700 / 800).

## AdvisorKhoj integration

All AdvisorKhoj calls go through `lib/advisorkhoj.ts` server-side. The API key from `.env.local` is never exposed to the browser. A typed proxy route is available at `/api/advisorkhoj/<path>?...` if you need client-side calls.

Endpoints wired up:
- `getAllSchemes`, `getSchemeInfoLatest`, `getAllSchemeCategories`, `getAllMutualFundSchemesbyCategory`
- `getSchemePerformanceReturnsNew`, `getCategoryPerformance`, `getLatestNav`
- `getSIPReturnCalculator`, `getSIPReturnsForCategoryPeriodAmount`
- `getPortfolioAnalysisNew`, `getSchemeBenchmarkPerformance`

ISR revalidation defaults: NAV/returns 1h, scheme master 1 week, category list 24h.

## What was built

**Homepage (revamped from scratch)**
- Hero: mesh-gradient navy background, floating animated hexagons (echoing the logo), stagger-revealed headline, live market ticker with NIFTY / SENSEX / Gold / USD-INR
- Stats strip: AUM / Families / Years / AMC partners, animated count-up that stops at real values (fixes the runaway-counter bug on the old site)
- Services bento grid: 8 services with hover-lift cards, "ELITE" badge on PMS/AIF, brand-tinted icons
- Partner AMC strip
- Live Funds module: top 4 large-cap funds pulled from AdvisorKhoj at build/ISR time
- Interactive SIP calculator with animated donut and area chart
- Why-Choose-Us 4-up grid with iconography
- Testimonials with quote cards
- CTA block with working contact form (WhatsApp deeplink)
- Full footer with ARN, disclosures links, risk disclaimer

**Fund research module**
- `/funds` — categorised top-performer table, sticky category tabs
- `/funds/[scheme]` — fund detail with NAV, returns, expense ratio, fund manager, benchmark, risk

**Calculators hub**
- `/calculators` — directory
- SIP, Step-up SIP, Lumpsum, SWP, Retirement, Goal — all with brand sliders, animated readouts, and "Talk to advisor" lead-capture CTAs

**Compliance / trust**
- Disclosures page with ARN placeholder, risk disclaimer, grievance, privacy, terms
- Sticky-aware header with backdrop blur on scroll
- Manrope typography sitewide
- All numeric readouts use tabular-nums
- `prefers-reduced-motion` respected throughout

## Next phases (not yet built)

- YouTube video hub (`/videos`) via YouTube Data API v3
- Risk profiler quiz
- Portfolio analyzer (CAS upload)
- Blog / Knowledge Hub
- NRI / Tax / Retirement / Child verticals as hubs
- Real testimonials, advisor team page, AMC logos as images
- Schema.org structured data
- Hindi / Marathi locale support

## Replace before going live

In `.env.local` or `components/layout/Footer.tsx` / `components/home/CTA.tsx`:
- ARN number and date of registration
- Real phone, email, WhatsApp number
- Social media links
- Real client names + photos (with permission) for testimonials

In `components/layout/Header.tsx`:
- Login URL points to the existing Investwell portal — confirm this is correct.
