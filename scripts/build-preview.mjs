// Generate preview.html with Manrope woff2 fonts inlined as base64 data: URIs.
// Run: node scripts/build-preview.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const WEIGHTS = [400, 500, 600, 700, 800];

const faces = WEIGHTS.map((w) => {
  const file = resolve(
    root,
    `node_modules/@fontsource/manrope/files/manrope-latin-${w}-normal.woff2`
  );
  const b64 = readFileSync(file).toString("base64");
  return `@font-face{font-family:'Manrope';font-style:normal;font-display:swap;font-weight:${w};src:url(data:font/woff2;base64,${b64}) format('woff2');}`;
}).join("\n");

const html = String.raw`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Money Lancer — Design Preview</title>
<style>
${faces}
  :root { color-scheme: light;
    --crayola:#1675F4; --yale:#0B3B7A; --navy:#08234A; --electric:#64E9EE;
    --spring:#40F99B; --gold:#FFD700; --ink:#0F1729; --graphite:#333; --slate1:#555; --slate2:#808080; --mist:#D4D4D4; --cloud:#FAFCFF;
    --success:#31783E; --critical:#CC6666;
  }
  * { box-sizing: border-box; }
  html, body { margin:0; padding:0; }
  body { font-family:"Manrope", system-ui, sans-serif; color:var(--ink); background:var(--cloud); font-feature-settings:"ss01","tnum"; -webkit-font-smoothing:antialiased; }
  .container { max-width:1280px; margin:0 auto; padding:0 24px; }
  .tabular { font-variant-numeric: tabular-nums; }
  header { position:fixed; inset:0 0 auto 0; z-index:50; backdrop-filter: blur(20px); background: rgba(255,255,255,0.7); border-bottom: 1px solid rgba(0,0,0,0.05); }
  header .container { display:flex; align-items:center; justify-content:space-between; height:64px; }
  .logo { display:inline-flex; align-items:center; gap:8px; font-weight:600; font-size:18px; color:var(--ink); text-decoration:none; }
  .logo svg { width:32px; height:32px; }
  nav { display:flex; gap:28px; }
  nav a { color:var(--graphite); text-decoration:none; font-size:14px; font-weight:500; }
  nav a:hover { color:var(--crayola); }
  .btn { display:inline-flex; align-items:center; justify-content:center; gap:8px; font-weight:600; border-radius:12px; padding:0 18px; height:42px; font-size:14px; cursor:pointer; text-decoration:none; transition: all 0.2s; }
  .btn-primary { background:var(--crayola); color:#fff; box-shadow:0 8px 30px rgba(11,59,122,0.10); }
  .btn-primary:hover { background:#1262d6; box-shadow:0 0 0 1px rgba(22,117,244,0.20), 0 16px 48px -12px rgba(22,117,244,0.35); }
  .btn-secondary { background:#fff; color:var(--yale); border:1px solid rgba(11,59,122,0.15); }
  .btn-secondary:hover { border-color:var(--crayola); color:var(--crayola); }
  .btn-ghost { background:transparent; color:#fff; border:1px solid rgba(255,255,255,0.2); }
  .btn-light { background:#fff; color:var(--yale); box-shadow:0 8px 30px rgba(11,59,122,0.10); }
  .btn-lg { height:56px; font-size:16px; padding:0 28px; border-radius:14px; }
  .hero {
    position:relative; overflow:hidden;
    background:
      radial-gradient(at 12% 18%, #1675F4 0%, transparent 38%),
      radial-gradient(at 88% 0%, #64E9EE 0%, transparent 32%),
      radial-gradient(at 75% 80%, #0B3B7A 0%, transparent 50%),
      linear-gradient(180deg, #08234A 0%, #0B3B7A 100%);
    color:#fff; padding: 144px 0 144px;
  }
  .hex-pattern { position:absolute; inset:0; opacity:0.07; pointer-events:none;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='92'><path d='M40 2 L77 22 L77 70 L40 90 L3 70 L3 22 Z' fill='none' stroke='%231675F4' stroke-opacity='0.6' stroke-width='1'/></svg>");
    background-size: 80px 92px;
  }
  .noise { position:absolute; inset:0; pointer-events:none;
    background-image:
      repeating-radial-gradient(circle at 20% 30%, rgba(255,255,255,0.04) 0, transparent 1px),
      repeating-radial-gradient(circle at 70% 80%, rgba(255,255,255,0.03) 0, transparent 1px);
    opacity:0.6; mix-blend-mode:overlay;
  }
  .hex-deco { position:absolute; pointer-events:none; }
  .hex1 { top:-80px; right:-120px; width:640px; opacity:0.6; animation: float 22s ease-in-out infinite; }
  .hex2 { top:14%; right:10%; width:200px; opacity:0.8; animation: float 14s ease-in-out infinite; }
  .hex3 { bottom:-80px; left:-40px; width:280px; opacity:0.3; animation: float 22s ease-in-out infinite reverse; }
  @keyframes float { 0%,100% { transform: translateY(0) translateX(0); } 50% { transform: translateY(-30px) translateX(20px); } }
  .badge { display:inline-flex; align-items:center; gap:8px; padding:6px 14px; border-radius:999px; border:1px solid rgba(255,255,255,0.15); background:rgba(255,255,255,0.05); font-size:12px; font-weight:500; backdrop-filter: blur(10px); }
  .dot { width:6px; height:6px; border-radius:50%; background:var(--spring); animation: pulseSoft 3.5s ease-in-out infinite; }
  @keyframes pulseSoft { 0%,100% { opacity:1 } 50% { opacity:0.5 } }
  h1.display { font-family:"Manrope", system-ui, sans-serif; font-size: clamp(48px, 7vw, 96px); line-height:1.02; letter-spacing:-0.03em; font-weight:700; margin: 24px 0 0; max-width: 1000px; }
  h1.display .accent { background: linear-gradient(90deg, #64E9EE, #fff, #64E9EE); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .hero p.lead { font-size:18px; line-height:1.55; max-width: 600px; color: rgba(255,255,255,0.75); margin: 28px 0 0; }
  .hero .ctas { display:flex; gap:12px; flex-wrap:wrap; margin-top:36px; }
  .ticker { display:grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap:16px; margin-top:56px; max-width:700px; }
  .ticker .tile { border:1px solid rgba(255,255,255,0.10); background:rgba(255,255,255,0.06); padding:14px 16px; border-radius:14px; backdrop-filter: blur(10px); }
  .ticker .label { font-size:10px; text-transform:uppercase; letter-spacing:0.14em; color:rgba(255,255,255,0.55); }
  .ticker .value { font-size:18px; font-weight:600; margin-top:4px; }
  .ticker .delta { font-size:12px; margin-left:6px; }
  .ticker .delta.up { color: var(--spring); }
  .ticker .delta.down { color: var(--critical); }
  .hero-wave { position:absolute; bottom:-1px; left:0; width:100%; }
  .stats { margin-top:-24px; position:relative; }
  .stats-grid { display:grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap:1px; background: rgba(0,0,0,0.05); border-radius:16px; overflow:hidden; box-shadow: 0 8px 30px rgba(11,59,122,0.10); border:1px solid rgba(0,0,0,0.05); }
  .stat { background:#fff; padding: 28px; }
  .stat .label { font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:var(--slate2); }
  .stat .v { display:flex; align-items:baseline; gap:4px; margin-top:12px; color: var(--yale); }
  .stat .v .num { font-size:32px; font-weight:700; }
  .stat .v .suf { font-size:18px; color: var(--graphite); font-weight:600; }
  .stat .cap { font-size:13px; color:var(--slate2); margin-top:4px; }
  section.pad { padding: 96px 0; }
  .eyebrow { display:inline-flex; align-items:center; gap:8px; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.18em; color:var(--crayola); }
  .eyebrow::before { content:""; width:24px; height:1px; background: rgba(22,117,244,0.4); }
  h2.section { font-family:"Manrope", system-ui, sans-serif; font-size: clamp(36px, 5vw, 64px); line-height:1.05; letter-spacing:-0.025em; font-weight:700; color: var(--ink); margin: 16px 0 0; }
  p.lead-light { font-size:18px; color:var(--slate1); margin-top:16px; max-width:640px; line-height:1.55; }
  .services-grid { display:grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap:16px; margin-top:48px; }
  .service { background:#fff; border:1px solid rgba(0,0,0,0.06); border-radius:16px; padding:24px; transition: all 0.3s; cursor:pointer; position:relative; overflow:hidden; display:flex; flex-direction:column; justify-content:space-between; min-height:200px; text-decoration:none; color:inherit; }
  .service:hover { transform: translateY(-4px); border-color: rgba(22,117,244,0.3); box-shadow: 0 8px 30px rgba(11,59,122,0.10); }
  .service .ic { width:40px; height:40px; border-radius:12px; background:rgba(22,117,244,0.10); color:var(--crayola); display:inline-flex; align-items:center; justify-content:center; }
  .service h3 { margin: 18px 0 0; font-size:18px; font-weight:600; }
  .service p { margin: 8px 0 0; font-size:14px; color:var(--slate1); }
  .service .more { margin-top:24px; color:var(--crayola); font-size:14px; font-weight:600; display:inline-flex; align-items:center; gap:4px; }
  .service.wide { grid-column: span 2; }
  .badge-elite { font-size:10px; letter-spacing:0.1em; font-weight:700; color:#7a5b00; background: rgba(255,215,0,0.15); padding: 2px 8px; border-radius:999px; }
  .partner-strip { background:#fff; border-top:1px solid rgba(0,0,0,0.05); border-bottom:1px solid rgba(0,0,0,0.05); padding: 36px 0; }
  .partner-strip .lbl { text-align:center; font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:0.18em; color:var(--slate2); }
  .partner-row { display:flex; flex-wrap:wrap; justify-content:center; gap:40px 36px; margin-top:24px; }
  .partner-row span { font-size:14px; font-weight:600; color: rgba(85,85,85,0.8); }
  .funds-table { margin-top:48px; border:1px solid rgba(0,0,0,0.06); border-radius:16px; background:#fff; overflow:hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.04); }
  .funds-row { display:grid; grid-template-columns: 5fr 2fr 1fr 1fr 1fr 2fr; gap:12px; padding: 18px 24px; align-items:center; border-bottom:1px solid rgba(0,0,0,0.05); }
  .funds-row.head { background:var(--cloud); padding: 12px 24px; font-size:11px; letter-spacing:0.1em; text-transform:uppercase; color:var(--slate2); font-weight:600; }
  .funds-row:last-child { border-bottom:none; }
  .funds-row:hover { background: var(--cloud); }
  .funds-row .nm { font-size:14px; font-weight:600; }
  .funds-row .meta { margin-top:4px; font-size:12px; color:var(--slate2); }
  .funds-row .nav, .funds-row .ret { text-align:right; font-size:14px; font-weight:600; }
  .funds-row .ret.up { color: var(--success); }
  .funds-row .ret.down { color: var(--critical); }
  .funds-row .cta { text-align:right; }
  .pill { display:inline-block; background: rgba(22,117,244,0.10); color:var(--crayola); font-size:12px; font-weight:600; padding: 6px 12px; border-radius:8px; }
  .sip { padding: 96px 0;
    background:
      radial-gradient(at 0% 0%, rgba(22,117,244,0.10) 0%, transparent 40%),
      radial-gradient(at 100% 0%, rgba(100,233,238,0.18) 0%, transparent 40%),
      linear-gradient(180deg, #FAFCFF 0%, #FFFFFF 100%);
  }
  .sip-grid { display:grid; grid-template-columns: 1fr 1fr; gap:48px; align-items:center; }
  .sip-card { background:#fff; border:1px solid rgba(0,0,0,0.06); border-radius:16px; padding:32px; box-shadow: 0 8px 30px rgba(11,59,122,0.10); }
  .sip-inner { display:grid; grid-template-columns: 1fr 1fr; gap:24px; }
  .slider-row { margin-bottom:18px; }
  .slider-row .top { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:8px; }
  .slider-row label { font-size:14px; font-weight:500; color:var(--graphite); }
  .slider-row .val { font-size:14px; font-weight:600; color:var(--yale); }
  input[type=range] { width:100%; -webkit-appearance:none; appearance:none; height:6px; border-radius:999px; background: linear-gradient(to right, var(--crayola) var(--p,50%), #e5edfb var(--p,50%)); outline:none; }
  input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; appearance:none; width:22px; height:22px; border-radius:999px; background:#fff; border:2px solid var(--crayola); box-shadow:0 4px 10px rgba(22,117,244,0.25); cursor:pointer; }
  .donut-wrap { display:flex; flex-direction:column; align-items:center; }
  .sumlist { width:100%; margin-top:24px; font-size:14px; }
  .sumlist .r { display:flex; justify-content:space-between; padding:6px 0; color:var(--slate1); }
  .sumlist .r.bold { padding-top:12px; border-top:1px solid rgba(0,0,0,0.10); margin-top:6px; color:var(--yale); font-weight:700; }
  .sumlist .swatch { width:10px; height:10px; border-radius:999px; display:inline-block; margin-right:8px; vertical-align:middle; }
  .why-grid { display:grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap:20px; margin-top:48px; }
  .why-card { background:var(--cloud); border:1px solid rgba(0,0,0,0.06); border-radius:16px; padding:24px; transition: all 0.3s; position:relative; overflow:hidden; }
  .why-card:hover { background:#fff; border-color: rgba(22,117,244,0.3); box-shadow: 0 8px 30px rgba(11,59,122,0.10); }
  .why-card .glow { position:absolute; right:-24px; top:-24px; width:96px; height:96px; background: rgba(22,117,244,0.08); border-radius:50%; filter: blur(40px); }
  .why-card .ic { position:relative; width:44px; height:44px; border-radius:12px; background:var(--yale); color:#fff; display:inline-flex; align-items:center; justify-content:center; }
  .why-card h3 { margin: 18px 0 0; font-size:18px; font-weight:600; position:relative; }
  .why-card p { margin: 8px 0 0; font-size:14px; color:var(--slate1); position:relative; line-height:1.5; }
  .cta-section { padding: 96px 0; }
  .cta-block { position:relative; overflow:hidden; background: var(--navy); color:#fff; border-radius:24px; padding: 72px 64px; }
  .cta-block .hex-cta-1 { position:absolute; top:-48px; right:-48px; width:280px; opacity:0.3; }
  .cta-block .hex-cta-2 { position:absolute; bottom:-60px; right:-128px; width:320px; opacity:0.2; }
  .cta-block .eyebrow-w { color: var(--electric); font-size:11px; text-transform:uppercase; letter-spacing:0.18em; font-weight:600; }
  .cta-block h2 { font-family:"Manrope", system-ui, sans-serif; margin: 16px 0 0; font-size: clamp(36px, 5vw, 64px); font-weight:700; line-height:1.05; letter-spacing:-0.025em; max-width:640px; position:relative; }
  .cta-block p { margin: 16px 0 0; max-width:640px; color: rgba(255,255,255,0.75); font-size:18px; position:relative; }
  .cta-block .ctas { margin-top:32px; display:flex; gap:12px; flex-wrap:wrap; position:relative; }
  footer { background: var(--navy); color:#fff; padding: 64px 0 32px; margin-top:96px; }
  footer .grid { display:grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap:48px; }
  footer h4 { font-size:12px; text-transform:uppercase; letter-spacing:0.12em; color: rgba(255,255,255,0.6); margin: 0 0 16px; }
  footer a { display:block; color:rgba(255,255,255,0.8); text-decoration:none; font-size:14px; padding:4px 0; }
  footer a:hover { color: var(--electric); }
  footer .arn { margin-top:40px; padding-top:24px; border-top:1px solid rgba(255,255,255,0.10); font-size:12px; color:rgba(255,255,255,0.6); }
  footer .risk { margin-top:24px; font-size:11px; color: rgba(255,255,255,0.4); line-height:1.6; }
  footer .copy { margin-top:32px; font-size:12px; color:rgba(255,255,255,0.4); }
  @media (max-width: 880px) {
    .stats-grid { grid-template-columns: repeat(2,1fr); }
    .services-grid { grid-template-columns: repeat(2,1fr); }
    .service.wide { grid-column: span 2; }
    .sip-grid { grid-template-columns: 1fr; }
    .sip-inner { grid-template-columns: 1fr; }
    .why-grid { grid-template-columns: repeat(2,1fr); }
    .funds-row { grid-template-columns: 5fr 2fr 1fr 1fr; }
    .funds-row .col-5y, .funds-row .col-cta { display:none; }
    .ticker { grid-template-columns: repeat(2,1fr); }
    nav { display:none; }
    footer .grid { grid-template-columns: 1fr 1fr; }
    .cta-block { padding: 48px 28px; }
  }
</style>
</head>
<body>

<header>
  <div class="container">
    <a class="logo" href="#">
      <svg viewBox="0 0 64 64"><defs><linearGradient id="mlh" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#1675F4"/><stop offset="100%" stop-color="#0B3B7A"/></linearGradient></defs><path d="M32 3.5 L57.5 18 V46 L32 60.5 L6.5 46 V18 Z" fill="url(#mlh)"/><path d="M18 44 L28 20 L34 32 L44 20 L50 44" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
      Money Lancer
    </a>
    <nav>
      <a href="#services">Services</a>
      <a href="#funds">Fund Research</a>
      <a href="#calculators">Calculators</a>
      <a href="#about">About</a>
      <a href="#contact">Contact</a>
    </nav>
    <div style="display:flex; gap:8px;">
      <a class="btn btn-secondary" href="#" style="height:36px; font-size:13px;">Login</a>
      <a class="btn btn-primary" href="#contact" style="height:36px; font-size:13px;">Book a call</a>
    </div>
  </div>
</header>

<section class="hero">
  <div class="noise"></div>
  <div class="hex-pattern"></div>
  <svg class="hex-deco hex1" viewBox="0 0 200 200">
    <defs><linearGradient id="hexA" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#1675F4" stop-opacity="0.7"/><stop offset="100%" stop-color="#64E9EE" stop-opacity="0.15"/></linearGradient></defs>
    <path d="M100 8 L180 52 V148 L100 192 L20 148 V52 Z" fill="url(#hexA)"/>
  </svg>
  <svg class="hex-deco hex2" viewBox="0 0 200 200">
    <defs><linearGradient id="hexB" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#1675F4"/><stop offset="100%" stop-color="#0B3B7A"/></linearGradient></defs>
    <path d="M100 8 L180 52 V148 L100 192 L20 148 V52 Z" fill="url(#hexB)"/>
    <path d="M48 132 L80 76 L98 100 L130 60 L150 132" stroke="#fff" stroke-width="6" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
  </svg>
  <svg class="hex-deco hex3" viewBox="0 0 200 200"><path d="M100 8 L180 52 V148 L100 192 L20 148 V52 Z" fill="#64E9EE"/></svg>

  <div class="container" style="position:relative; z-index:10;">
    <span class="badge"><span class="dot"></span> Trusted by Indian families since 1999</span>
    <h1 class="display">
      Build wealth<br/>
      with a partner<br/>
      who's with you for<br/>
      <span class="accent">every season of life.</span>
    </h1>
    <p class="lead">Personalised mutual fund guidance, retirement investing, PMS, AIF and goal-based investing — backed by 25+ years of experience and a tech-first client experience.</p>
    <div class="ctas">
      <a class="btn btn-light btn-lg" href="#contact">Start your investment journey →</a>
      <a class="btn btn-ghost btn-lg" href="#funds">Explore funds</a>
    </div>

    <div class="ticker">
      <div class="tile"><div class="label">NIFTY 50</div><div class="value tabular">24,815.40<span class="delta up">+0.42%</span></div></div>
      <div class="tile"><div class="label">SENSEX</div><div class="value tabular">81,372.11<span class="delta up">+0.38%</span></div></div>
      <div class="tile"><div class="label">GOLD ₹/10g</div><div class="value tabular">76,210<span class="delta down">-0.12%</span></div></div>
      <div class="tile"><div class="label">USD/INR</div><div class="value tabular">83.92<span class="delta up">+0.05%</span></div></div>
    </div>
  </div>

  <svg class="hero-wave" viewBox="0 0 1440 80" preserveAspectRatio="none">
    <path d="M0 80 L1440 80 L1440 30 Q720 80 0 30 Z" fill="#FAFCFF"/>
  </svg>
</section>

<section class="stats">
  <div class="container">
    <div class="stats-grid">
      <div class="stat"><div class="label">AUM Managed</div><div class="v"><span class="num tabular" data-target="500">500</span><span class="suf"> Cr INR</span></div><div class="cap">as of 2025</div></div>
      <div class="stat"><div class="label">Clients</div><div class="v"><span class="num tabular" data-target="2500">2,500</span><span class="suf">+</span></div><div class="cap">across India</div></div>
      <div class="stat"><div class="label">Years of trust</div><div class="v"><span class="num tabular" data-target="25">25</span><span class="suf"> yrs</span></div><div class="cap">since 1999</div></div>
      <div class="stat"><div class="label">AMC partners</div><div class="v"><span class="num tabular" data-target="40">40</span><span class="suf">+</span></div><div class="cap">fund houses</div></div>
    </div>
  </div>
</section>

<section id="services" class="pad">
  <div class="container">
    <span class="eyebrow">What we do</span>
    <h2 class="section">A complete wealth practice,<br>not just a fund distributor.</h2>
    <p class="lead-light">From your first SIP to multi-generational legacy investing — every product, every conversation tailored to your goals.</p>
    <div class="services-grid">
      <a class="service wide" href="#funds">
        <div>
          <div class="ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3a9 9 0 1 0 9 9h-9V3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M14 3v7h7a9 9 0 0 0-7-7Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg></div>
          <h3>Mutual Funds</h3>
          <p>Curated SIPs and lumpsum portfolios that match your risk profile and life goals.</p>
        </div>
        <span class="more">Learn more →</span>
      </a>
      <a class="service" href="#"><div><div class="ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 12c0-3 2-5 5-5h6c3 0 5 2 5 5 0 1.4-.5 2.6-1.4 3.5L18 19h-2v-2h-3v2H9v-2c-3 0-6-2-6-5Z" stroke="currentColor" stroke-width="1.6"/><circle cx="8" cy="11" r="0.9" fill="currentColor"/></svg></div><h3>Retirement Funds</h3><p>Tax-efficient retirement corpus building.</p></div><span class="more">Learn more →</span></a>
      <a class="service" href="#"><div><div class="ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M2 9l10-4 10 4-10 4-10-4Z" stroke="currentColor" stroke-width="1.6"/><path d="M6 11v5a6 6 0 0 0 12 0v-5" stroke="currentColor" stroke-width="1.6"/></svg></div><h3>Children's Education</h3><p>Disciplined investing for your child's future.</p></div><span class="more">Learn more →</span></a>
      <a class="service" href="#"><div><div class="ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3Z" stroke="currentColor" stroke-width="1.6"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="1.6"/></svg></div><h3>Insurance</h3><p>Life, health and term cover — independent advisory.</p></div><span class="more">Learn more →</span></a>
      <a class="service" href="#"><div><div class="ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="6" rx="8" ry="3" stroke="currentColor" stroke-width="1.6"/><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" stroke="currentColor" stroke-width="1.6"/></svg></div><h3>Loans</h3><p>Right loan, simplified processing.</p></div><span class="more">Learn more →</span></a>
      <a class="service wide" href="#" style="background: linear-gradient(135deg, rgba(255,215,0,0.06), transparent);">
        <div>
          <div style="display:flex; align-items:center; justify-content:space-between;">
            <div class="ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 20h18M5 16l4-4 3 3 7-8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
            <span class="badge-elite">ELITE</span>
          </div>
          <h3>PMS & AIF</h3>
          <p>Curated portfolios from SEBI-registered managers for HNIs.</p>
        </div>
        <span class="more">Learn more →</span>
      </a>
      <a class="service" href="#"><div><div class="ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 21V5l8-2 8 2v16M9 21v-5h6v5M8 9h2M8 13h2M14 9h2M14 13h2" stroke="currentColor" stroke-width="1.6"/></svg></div><h3>Fractional Real Estate</h3><p>Premium commercial property, low ticket size.</p></div><span class="more">Learn more →</span></a>
      <a class="service" href="#"><div><div class="ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><path d="M3 12h18M12 3c3 3.5 3 14 0 18M12 3c-3 3.5-3 14 0 18" stroke="currentColor" stroke-width="1.6"/></svg></div><h3>GIFT City Products</h3><p>Tax-efficient global investing via IFSC.</p></div><span class="more">Learn more →</span></a>
    </div>
  </div>
</section>

<div class="partner-strip">
  <div class="container">
    <div class="lbl">Distributing schemes from 40+ AMCs</div>
    <div class="partner-row">
      <span>HDFC</span><span>ICICI Prudential</span><span>SBI</span><span>Aditya Birla</span><span>Mirae</span><span>Axis</span><span>Nippon India</span><span>Kotak</span><span>DSP</span><span>Franklin Templeton</span><span>UTI</span><span>Tata</span>
    </div>
  </div>
</div>

<section id="funds" class="pad" style="background:#fff;">
  <div class="container">
    <div style="display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:24px;">
      <div style="max-width:640px;">
        <span class="eyebrow">Live fund research</span>
        <h2 class="section">Top large-cap funds, refreshed daily.</h2>
        <p class="lead-light">Powered by AdvisorKhoj. NAVs, returns and rankings updated as the market closes — not a static list.</p>
      </div>
      <a href="#" style="color:var(--crayola); font-weight:600; font-size:14px;">Browse all funds →</a>
    </div>
    <div class="funds-table">
      <div class="funds-row head">
        <div>Scheme</div><div style="text-align:right;">NAV</div><div style="text-align:right;">1Y</div><div style="text-align:right;">3Y</div><div style="text-align:right;" class="col-5y">5Y</div><div style="text-align:right;" class="col-cta">Action</div>
      </div>
      <div class="funds-row">
        <div><div class="nm">HDFC Large Cap Fund - Reg</div><div class="meta">HDFC MF · Equity: Large Cap</div></div>
        <div class="nav tabular">₹1,268.42</div>
        <div class="ret up tabular">+24.3%</div>
        <div class="ret up tabular">+18.7%</div>
        <div class="ret up tabular col-5y">+17.2%</div>
        <div class="cta col-cta"><span class="pill">Start SIP →</span></div>
      </div>
      <div class="funds-row">
        <div><div class="nm">ICICI Pru Bluechip Fund</div><div class="meta">ICICI Pru MF · Equity: Large Cap</div></div>
        <div class="nav tabular">₹102.66</div>
        <div class="ret up tabular">+28.5%</div>
        <div class="ret up tabular">+19.2%</div>
        <div class="ret up tabular col-5y">+18.8%</div>
        <div class="cta col-cta"><span class="pill">Start SIP →</span></div>
      </div>
      <div class="funds-row">
        <div><div class="nm">SBI Bluechip Fund</div><div class="meta">SBI MF · Equity: Large Cap</div></div>
        <div class="nav tabular">₹92.40</div>
        <div class="ret up tabular">+22.1%</div>
        <div class="ret up tabular">+16.4%</div>
        <div class="ret up tabular col-5y">+16.0%</div>
        <div class="cta col-cta"><span class="pill">Start SIP →</span></div>
      </div>
      <div class="funds-row">
        <div><div class="nm">Mirae Asset Large Cap Fund</div><div class="meta">Mirae Asset MF · Equity: Large Cap</div></div>
        <div class="nav tabular">₹109.71</div>
        <div class="ret up tabular">+26.8%</div>
        <div class="ret up tabular">+17.9%</div>
        <div class="ret up tabular col-5y">+18.5%</div>
        <div class="cta col-cta"><span class="pill">Start SIP →</span></div>
      </div>
    </div>
  </div>
</section>

<section id="calculators" class="sip">
  <div class="container">
    <div class="sip-grid">
      <div>
        <span class="eyebrow">Try it yourself</span>
        <h2 class="section">Watch your SIP <br/><span style="background:linear-gradient(90deg, var(--crayola), var(--yale)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;">compound into wealth.</span></h2>
        <p class="lead-light" style="max-width:440px;">A simple calculator powered by the same engine that runs our advisor desk. Adjust the sliders to see how time and consistency do the heavy lifting.</p>
        <div style="display:flex; gap:12px; margin-top:32px;">
          <a class="btn btn-primary" href="#">All calculators</a>
          <a class="btn btn-secondary" href="#">Browse funds</a>
        </div>
      </div>
      <div class="sip-card">
        <div class="sip-inner">
          <div>
            <div class="slider-row">
              <div class="top"><label>Monthly SIP</label><span class="val tabular" id="ms">₹10,000</span></div>
              <input id="amount" type="range" min="500" max="500000" step="500" value="10000">
            </div>
            <div class="slider-row">
              <div class="top"><label>Duration</label><span class="val tabular" id="ys">15 years</span></div>
              <input id="years" type="range" min="1" max="30" step="1" value="15">
            </div>
            <div class="slider-row">
              <div class="top"><label>Expected return</label><span class="val tabular" id="rs">12% p.a.</span></div>
              <input id="rate" type="range" min="1" max="30" step="1" value="12">
            </div>
          </div>
          <div class="donut-wrap">
            <svg width="200" height="200" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="64" fill="none" stroke="#D4D4D4" stroke-width="20"/>
              <circle id="donut" cx="80" cy="80" r="64" fill="none" stroke="#1675F4" stroke-width="20" stroke-dasharray="402" stroke-dashoffset="160" transform="rotate(-90 80 80)"/>
              <text x="80" y="76" text-anchor="middle" fill="#555" font-size="11">Returns</text>
              <text id="donutPct" x="80" y="94" text-anchor="middle" fill="#0B3B7A" font-weight="700" font-size="20" class="tabular">60%</text>
            </svg>
            <div class="sumlist">
              <div class="r"><span><span class="swatch" style="background:#D4D4D4;"></span>Invested</span><span class="tabular" id="invR">₹18,00,000</span></div>
              <div class="r"><span><span class="swatch" style="background:#1675F4;"></span>Returns</span><span class="tabular" id="retR">₹32,55,432</span></div>
              <div class="r bold"><span>Total</span><span class="tabular" id="totR">₹50,55,432</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="pad" style="background:#fff;">
  <div class="container">
    <span class="eyebrow">Why Money Lancer</span>
    <h2 class="section">Built for steady growth.<br>Engineered for trust.</h2>
    <div class="why-grid">
      <div class="why-card"><span class="glow"></span><div class="ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.6"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7" stroke="currentColor" stroke-width="1.6"/></svg></div><h3>Client-Centric Approach</h3><p>Every portfolio begins with your goals and risk profile — not the latest hot fund.</p></div>
      <div class="why-card"><span class="glow"></span><div class="ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3v18M5 21h14M5 9l3-6 3 6M14 9l3-6 3 6" stroke="currentColor" stroke-width="1.6"/></svg></div><h3>Transparent & Ethical</h3><p>No hidden charges. Plain-English explanations. Independent advisory you can trust.</p></div>
      <div class="why-card"><span class="glow"></span><div class="ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3l2 4 4 .6-3 3 .7 4-3.7-2-3.7 2 .7-4-3-3 4-.6 2-4Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg></div><h3>Experienced Team</h3><p>25+ years building portfolios across every market cycle since 1999.</p></div>
      <div class="why-card"><span class="glow"></span><div class="ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="6" y="6" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M9 3v3M12 3v3M15 3v3M9 18v3M12 18v3M15 18v3M3 9h3M3 12h3M3 15h3M18 9h3M18 12h3M18 15h3" stroke="currentColor" stroke-width="1.6"/></svg></div><h3>Technology Driven</h3><p>Live dashboards, goal trackers and instant SIP onboarding through our app.</p></div>
    </div>
  </div>
</section>

<section id="contact" class="cta-section">
  <div class="container">
    <div class="cta-block">
      <svg class="hex-cta-1" viewBox="0 0 200 200"><path d="M100 8 L180 52 V148 L100 192 L20 148 V52 Z" fill="#1675F4"/></svg>
      <svg class="hex-cta-2" viewBox="0 0 200 200"><path d="M100 8 L180 52 V148 L100 192 L20 148 V52 Z" fill="#64E9EE"/></svg>
      <span class="eyebrow-w">Get started</span>
      <h2>Let's build your portfolio together.</h2>
      <p>A 30-minute conversation with a senior advisor. No obligation, no jargon. We'll understand your goals and show you exactly where you stand.</p>
      <div class="ctas">
        <a class="btn btn-light btn-lg" href="#">Book a free consultation</a>
        <a class="btn btn-ghost btn-lg" href="#">WhatsApp us</a>
      </div>
    </div>
  </div>
</section>

<footer>
  <div class="container">
    <div class="grid">
      <div>
        <div class="logo" style="color:#fff;">
          <svg viewBox="0 0 64 64"><defs><linearGradient id="mlf" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#1675F4"/><stop offset="100%" stop-color="#0B3B7A"/></linearGradient></defs><path d="M32 3.5 L57.5 18 V46 L32 60.5 L6.5 46 V18 Z" fill="url(#mlf)"/><path d="M18 44 L28 20 L34 32 L44 20 L50 44" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span style="color:#fff;">Money Lancer</span>
        </div>
        <p style="font-size:14px; color:rgba(255,255,255,0.7); margin-top:14px; line-height:1.55;">Personalised wealth management trusted by Indian families since 1999. SEBI-compliant mutual fund distributors & wealth managers based in Pune.</p>
      </div>
      <div>
        <h4>Explore</h4>
        <a href="#services">Services</a>
        <a href="#funds">Fund Research</a>
        <a href="#calculators">Calculators</a>
        <a href="#about">About</a>
      </div>
      <div>
        <h4>Solutions</h4>
        <a href="#">Mutual Funds</a>
        <a href="#">Retirement Investing</a>
        <a href="#">SIP Investing</a>
        <a href="#">Tax Saving (ELSS)</a>
      </div>
      <div>
        <h4>Contact</h4>
        <a href="tel:+910000000000">+91 XXXXX XXXXX</a>
        <a href="mailto:contact@mymoneylancer.com">contact@mymoneylancer.com</a>
        <a href="#">Pune, Maharashtra, India</a>
      </div>
    </div>
    <div class="arn">
      <strong style="color:rgba(255,255,255,0.8);">AMFI Reg. No.:</strong> ARN-XXXXX  ·  <strong style="color:rgba(255,255,255,0.8);">Date of Initial Registration:</strong> DD-MM-YYYY · Money Lancer Investments is an AMFI-registered Mutual Fund Distributor.
    </div>
    <p class="risk">Mutual fund investments are subject to market risks. Read all scheme-related documents carefully. Past performance is not indicative of future returns. The information shown on this website is for general informational purposes only and does not constitute investment advice.</p>
    <p class="copy">© 2025 Money Lancer Investments. All rights reserved.</p>
  </div>
</footer>

<script>
  const fmtINR = (v) => "₹" + Math.round(v).toLocaleString("en-IN");
  const a = document.getElementById("amount"), y = document.getElementById("years"), r = document.getElementById("rate");
  const ms = document.getElementById("ms"), ys = document.getElementById("ys"), rs = document.getElementById("rs");
  const invR = document.getElementById("invR"), retR = document.getElementById("retR"), totR = document.getElementById("totR");
  const donut = document.getElementById("donut"), donutPct = document.getElementById("donutPct");
  function tick(el) {
    const min = +el.min, max = +el.max, val = +el.value;
    el.style.setProperty("--p", ((val - min) / (max - min)) * 100 + "%");
  }
  function calc() {
    const amount = +a.value, years = +y.value, rate = +r.value;
    const n = years * 12, rm = rate/100/12;
    const fv = amount * ((Math.pow(1+rm, n) - 1) / rm) * (1+rm);
    const inv = amount * n;
    ms.textContent = fmtINR(amount); ys.textContent = years + " years"; rs.textContent = rate + "% p.a.";
    invR.textContent = fmtINR(inv); retR.textContent = fmtINR(fv - inv); totR.textContent = fmtINR(fv);
    const pct = (fv - inv) / fv * 100;
    const C = 2 * Math.PI * 64;
    donut.setAttribute("stroke-dasharray", C);
    donut.setAttribute("stroke-dashoffset", C - (pct/100) * C);
    donutPct.textContent = Math.round(pct) + "%";
    [a,y,r].forEach(tick);
  }
  [a,y,r].forEach(el => el.addEventListener("input", calc));
  calc();

  const stats = document.querySelectorAll(".stat .num");
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        const el = en.target;
        const target = +el.dataset.target;
        let cur = 0; const step = target / 60;
        el.textContent = "0";
        const t = setInterval(() => {
          cur += step;
          if (cur >= target) { el.textContent = target.toLocaleString("en-IN"); clearInterval(t); }
          else el.textContent = Math.round(cur).toLocaleString("en-IN");
        }, 18);
        io.unobserve(el);
      }
    });
  }, { threshold: 0.6 });
  stats.forEach(s => io.observe(s));
</script>
</body>
</html>`;

writeFileSync(resolve(root, "preview.html"), html);
console.log("preview.html written,", html.length, "bytes");
