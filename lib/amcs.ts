/**
 * AMC directory used across the site — partner strip on homepage, AMC pages,
 * fund-detail company badges, etc. The `apiName` is the canonical AdvisorKhoj
 * AMC name (used as the `amc` query param in getSchemeListByAMCAndCategory etc).
 *
 * Logo files live in /public/amcs/. Add an entry here when a new logo is dropped
 * into the folder.
 */

export type AMC = {
  slug: string;            // URL slug used at /funds/amc/[slug]
  name: string;            // Friendly display name
  apiName: string;         // Full name to pass to AdvisorKhoj
  logo: string;            // /amcs/foo.webp
  /** Short codes / abbreviations AdvisorKhoj sometimes returns instead of the full company name. */
  aliases?: string[];
};

export const AMCS: AMC[] = [
  { slug: "360-one",                 name: "360 ONE",                       apiName: "360 ONE Mutual Fund",                          logo: "/amcs/360.webp",          aliases: ["360ONE", "360 ONE MF", "IIFLMF"] },
  { slug: "abakkus",                 name: "Abakkus",                       apiName: "Abakkus Asset Manager",                        logo: "/amcs/abakkus.webp",      aliases: ["AbakkusMF"] },
  { slug: "aditya-birla-sun-life",   name: "Aditya Birla Sun Life",         apiName: "Aditya Birla Sun Life Mutual Fund",            logo: "/amcs/aditya.webp",       aliases: ["AdityaBirlaMF", "ABSLMF", "Birla Sun Life"] },
  { slug: "axis",                    name: "Axis",                          apiName: "Axis Mutual Fund",                             logo: "/amcs/axis.webp",         aliases: ["AxisMF"] },
  { slug: "bajaj-finserv",           name: "Bajaj Finserv",                 apiName: "Bajaj Finserv Mutual Fund",                    logo: "/amcs/bajaj.webp",        aliases: ["BajajMF", "Bajaj"] },
  { slug: "bandhan",                 name: "Bandhan",                       apiName: "Bandhan Mutual Fund",                          logo: "/amcs/bandhan.webp",      aliases: ["BandhanMF"] },
  { slug: "bank-of-india",           name: "Bank of India",                 apiName: "Bank of India Mutual Fund",                    logo: "/amcs/bank.webp",         aliases: ["BOI", "BOIMF", "Bank of India MF"] },
  { slug: "baroda-bnp-paribas",      name: "Baroda BNP Paribas",            apiName: "Baroda BNP Paribas Mutual Fund",               logo: "/amcs/barodabnpparibasmutualfund.webp", aliases: ["BarodaBNPMF", "BNP Paribas", "Baroda BNP"] },
  { slug: "canara-robeco",           name: "Canara Robeco",                 apiName: "Canara Robeco Mutual Fund",                    logo: "/amcs/canara.webp",       aliases: ["CanaraMF", "Canara"] },
  { slug: "capitalmind",             name: "Capitalmind",                   apiName: "Capitalmind Mutual Fund",                      logo: "/amcs/capitalmind.webp",  aliases: ["CapitalmindMF"] },
  { slug: "choice",                  name: "Choice",                        apiName: "Choice Mutual Fund",                           logo: "/amcs/choice.webp",       aliases: ["ChoiceMF"] },
  { slug: "dsp",                     name: "DSP",                           apiName: "DSP Mutual Fund",                              logo: "/amcs/dsp.webp",          aliases: ["DSPMF", "DSP BlackRock"] },
  { slug: "edelweiss",               name: "Edelweiss",                     apiName: "Edelweiss Mutual Fund",                        logo: "/amcs/edelweiss.webp",    aliases: ["EdelweissMF"] },
  { slug: "franklin-templeton",      name: "Franklin Templeton",            apiName: "Franklin Templeton Mutual Fund",               logo: "/amcs/franklin.webp",     aliases: ["FranklinMF", "Franklin"] },
  { slug: "hdfc",                    name: "HDFC",                          apiName: "HDFC Mutual Fund",                             logo: "/amcs/hdfc.webp",         aliases: ["HDFCMF"] },
  { slug: "helios",                  name: "Helios",                        apiName: "Helios Mutual Fund",                           logo: "/amcs/helios.webp",       aliases: ["HeliosMF"] },
  { slug: "hsbc",                    name: "HSBC",                          apiName: "HSBC Mutual Fund",                             logo: "/amcs/hsbc.webp",         aliases: ["HSBCMF"] },
  { slug: "icici-prudential",        name: "ICICI Prudential",              apiName: "ICICI Prudential Mutual Fund",                 logo: "/amcs/icici.webp",        aliases: ["ICICIPruMF", "ICICI Pru", "ICICI Prudential MF"] },
  { slug: "invesco",                 name: "Invesco",                       apiName: "Invesco Mutual Fund",                          logo: "/amcs/invesco.webp",      aliases: ["InvescoMF", "Invesco India"] },
  { slug: "iti",                     name: "ITI",                           apiName: "ITI Mutual Fund",                              logo: "/amcs/iti.webp",          aliases: ["ITIMF"] },
  { slug: "jio-blackrock",           name: "Jio BlackRock",                 apiName: "Jio BlackRock Mutual Fund",                    logo: "/amcs/jioblackrock.webp", aliases: ["JioBlackRockMF", "Jio"] },
  { slug: "jm-financial",            name: "JM Financial",                  apiName: "JM Financial Mutual Fund",                     logo: "/amcs/jm.webp",           aliases: ["JMMF", "JM"] },
  { slug: "kotak",                   name: "Kotak Mahindra",                apiName: "Kotak Mahindra Mutual Fund",                   logo: "/amcs/kotak.webp",        aliases: ["KotakMF", "Kotak"] },
  { slug: "lic",                     name: "LIC",                           apiName: "LIC Mutual Fund",                              logo: "/amcs/lic.webp",          aliases: ["LICMF"] },
  { slug: "mahindra-manulife",       name: "Mahindra Manulife",             apiName: "Mahindra Manulife Mutual Fund",                logo: "/amcs/mahindra.webp",     aliases: ["MahindraMF", "Mahindra"] },
  { slug: "mirae-asset",             name: "Mirae Asset",                   apiName: "Mirae Asset Mutual Fund",                      logo: "/amcs/mirae.webp",        aliases: ["MiraeMF", "Mirae"] },
  { slug: "motilal-oswal",           name: "Motilal Oswal",                 apiName: "Motilal Oswal Mutual Fund",                    logo: "/amcs/motilal.webp",      aliases: ["MotilalMF", "Motilal"] },
  { slug: "navi",                    name: "Navi",                          apiName: "Navi Mutual Fund",                             logo: "/amcs/navi.webp",         aliases: ["NaviMF"] },
  { slug: "nippon-india",            name: "Nippon India",                  apiName: "Nippon India Mutual Fund",                     logo: "/amcs/nippon.png",        aliases: ["NipponIndiaMF", "Nippon", "Reliance MF"] },
  { slug: "nj",                      name: "NJ",                            apiName: "NJ Mutual Fund",                               logo: "/amcs/nj.webp",           aliases: ["NJMF"] },
  { slug: "pgim",                    name: "PGIM India",                    apiName: "PGIM India Mutual Fund",                       logo: "/amcs/pgim.webp",         aliases: ["PGIMMF", "PGIM"] },
  { slug: "quant",                   name: "Quant",                         apiName: "Quant Mutual Fund",                            logo: "/amcs/quant.webp",        aliases: ["QuantMF"] },
  { slug: "quantum",                 name: "Quantum",                       apiName: "Quantum Mutual Fund",                          logo: "/amcs/quantum.webp",      aliases: ["QuantumMF"] },
  { slug: "samco",                   name: "Samco",                         apiName: "Samco Mutual Fund",                            logo: "/amcs/samco.webp",        aliases: ["SamcoMF"] },
  { slug: "sbi",                     name: "SBI",                           apiName: "SBI Mutual Fund",                              logo: "/amcs/sbi.webp",          aliases: ["SBIMF"] },
  { slug: "sundaram",                name: "Sundaram",                      apiName: "Sundaram Mutual Fund",                         logo: "/amcs/sundaram.webp",     aliases: ["SundaramMF"] },
  { slug: "tata",                    name: "Tata",                          apiName: "Tata Mutual Fund",                             logo: "/amcs/tata.webp",         aliases: ["TataMF"] },
  { slug: "taurus",                  name: "Taurus",                        apiName: "Taurus Mutual Fund",                           logo: "/amcs/taurus.webp",       aliases: ["TaurusMF"] },
  { slug: "the-wealth-company",       name: "The Wealth Company",            apiName: "The Mutual Fund",                              logo: "/amcs/the.webp",          aliases: ["TheMF", "TheWealth"] },
  { slug: "trust",                   name: "Trust",                         apiName: "Trust Mutual Fund",                            logo: "/amcs/trust.webp",        aliases: ["TrustMF"] },
  { slug: "unifi",                   name: "Unifi",                         apiName: "Unifi Mutual Fund",                            logo: "/amcs/unifi.webp",        aliases: ["UnifiMF"] },
  { slug: "union",                   name: "Union",                         apiName: "Union Mutual Fund",                            logo: "/amcs/union.webp",        aliases: ["UnionMF"] },
  { slug: "uti",                     name: "UTI",                           apiName: "UTI Mutual Fund",                              logo: "/amcs/uti.webp",          aliases: ["UTIMF"] },
  { slug: "white-oak",               name: "WhiteOak Capital",              apiName: "WhiteOak Capital Mutual Fund",                 logo: "/amcs/whiteoak.webp",     aliases: ["WhiteOakMF", "WhiteOak"] },
  { slug: "zerodha",                 name: "Zerodha",                       apiName: "Zerodha Mutual Fund",                          logo: "/amcs/zerodha.webp",      aliases: ["ZerodhaMF"] },
  { slug: "groww",                   name: "Groww",                         apiName: "Groww Mutual Fund",                            logo: "/amcs/groww.webp",        aliases: ["GrowwMF", "Groww"] },
  { slug: "ppfas",                   name: "Parag Parikh",                  apiName: "PPFAS Mutual Fund",                            logo: "/amcs/ppfas.webp",        aliases: ["PPFAS", "ParagParikh", "Parag Parikh MF"] },
];

export function getAmcBySlug(slug: string) {
  return AMCS.find((a) => a.slug === slug);
}

const _norm = (s: string) => (s || "").toLowerCase().replace(/[\s\.\-_/]+/g, "");

/** Does the AMC match this free-text company name (from AdvisorKhoj)? */
export function amcMatches(amc: AMC, company: string): boolean {
  if (!company) return false;
  const n = _norm(company);
  const candidates = [amc.name, amc.apiName, amc.slug.replace(/-/g, " "), ...(amc.aliases || [])].map(_norm);
  return candidates.some((c) => c && (n.includes(c) || c.includes(n)));
}

const norm = (s: string) => (s || "").toLowerCase().replace(/[\s\.\-_/]+/g, "");

/** Best-effort logo lookup by free-text company name. Matches against name,
 * apiName, slug and aliases — using a normalized (alpha-only, lowercase)
 * comparison so "BOIMF", "Bank of India MF" and "Bank of India" all resolve. */
export function getLogoForName(name: string): string | null {
  if (!name) return null;
  const n = norm(name);
  const hit = AMCS.find((a) => {
    const candidates = [a.name, a.apiName, a.slug.replace(/-/g, " "), ...(a.aliases || [])].map(norm);
    return candidates.some((c) => c && (n.includes(c) || c.includes(n)));
  });
  return hit?.logo ?? null;
}

export function getAmcForName(name: string): AMC | null {
  if (!name) return null;
  const n = norm(name);
  return (
    AMCS.find((a) => {
      const candidates = [a.name, a.apiName, a.slug.replace(/-/g, " "), ...(a.aliases || [])].map(norm);
      return candidates.some((c) => c && (n.includes(c) || c.includes(n)));
    }) ?? null
  );
}
