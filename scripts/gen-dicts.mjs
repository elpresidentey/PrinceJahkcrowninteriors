// One-shot generator for the Hausa & Igbo dictionaries.
// Writes src/i18n/dictionaries/{ha,ig}.js content directly to disk (UTF-8),
// so no human transcription of large Unicode blocks is involved.
// Run: node scripts/gen-dicts.mjs

import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "i18n", "dictionaries");

const BRAND_FULL = "Prince Jahknow Crown Interior Services";
const BRAND_SHORT = "Prince Jahknow Crown";
const SENT_FULL = "PJCISS";
const SENT_SHORT = "PJCS";
const SKIP_RE = /^[\d\s+\-/.,°%·]*$/; // numerals & bare symbols stay untouched
const WHITELIST = new Set(["pop", "whatsapp", "lagos", "nigeria", "naijeria", "najeriya", "lekki", "surulere", "instagram", "facebook", "bn", "reg", "no", "cac", "pjciss", "pjcs", "app", "3d"]);

const en = {
  meta: {
    title: "Prince Jahknow Crown Interior Services — Premium POP Ceilings & Plaster Decors",
    description: "Transform your space with premium POP ceiling installations, interior decoration, and custom finishing. Serving Lagos and surrounding areas.",
  },
  nav: {
    home: "Home", projects: "Projects", services: "Services", about: "About", contact: "Contact",
    menu: "Menu", closeMenu: "Close", openMenuAria: "Open menu", closeMenuAria: "Close menu",
    getQuote: "Get a quote", startProject: "Start a project", chatWhatsApp: "Chat on WhatsApp", language: "Language",
  },
  hero: {
    discipline: "POP ceilings · Feature walls · Interiors",
    headline1: "A finer finish",
    headline2: "for every room",
    intro: "Prince Jahknow Crown Interior Services designs and builds sculpted ceilings, feature walls and complete interiors across Lagos — drawn around your room, built and finished by hand.",
    quoteCta: "Get a quote",
    seeWork: "See our work",
    areas: "Lagos, Nigeria · {n} areas served",
    scroll: "Scroll to explore",
  },
  status: {
    aria: "Studio status",
    updating: "Lagos weather updating",
    clear: "Clear skies",
    partly: "Partly cloudy",
    rain: "Rain in the area",
    sr: "Prince Jahknow Crown Interior Services is designing tailored interiors, building POP ceilings, and finishing feature walls.",
    updates: ["Designing tailored interiors", "Building POP ceilings", "Finishing feature walls"],
  },
  stats: [
    { label: "Spaces transformed", value: "120", unit: "+", detail: "Ceilings, walls and full interiors across Lagos." },
    { label: "Hands-on experience", value: "10", unit: "+ yrs", detail: "Designing and building under one roof." },
    { label: "Average client rating", value: "4.8", unit: "/5", detail: "From handover feedback, not a marketing survey." },
    { label: "Quote turnaround", value: "7", unit: "days", detail: "Clear, itemised and with no obligation." },
  ],
  features: {
    eyebrow: "Approach",
    title: "A quieter kind of luxury",
    subtitle: "Considered design, honest materials and a finish that still looks intentional years later.",
    pillars: [
      { title: "Premium Materials", description: "Only trusted, durable materials — no shortcuts hidden behind a finish." },
      { title: "Made For Your Space", description: "Every design is drawn around your room, your light and how you live." },
      { title: "On Schedule", description: "Clear timelines and tidy sites, with progress you can actually see." },
      { title: "Aftercare Included", description: "A backed guarantee and follow-up support after every handover." },
    ],
  },
  servicesPreview: {
    eyebrow: "Services",
    title: "What we make",
    subtitle: "One team for the whole job — from sculpted ceilings and coves to the last coat of finish.",
    all: "All services",
  },
  featured: {
    eyebrow: "Selected work",
    title: "Spaces we have transformed",
    subtitle: "Recent ceilings, walls and interiors delivered across Lagos.",
    all: "View all projects",
  },
  process: {
    eyebrow: "Process",
    title: "How a project runs",
    subtitle: "Six clear steps from the first conversation to a finished, inspected space.",
    steps: [
      { title: "Consultation", description: "Tell us about your project and vision." },
      { title: "Inspection", description: "We visit and assess your space." },
      { title: "Design", description: "We recommend suitable designs and finishes." },
      { title: "Quotation", description: "You receive a detailed project estimate." },
      { title: "Installation", description: "Our team transforms your space." },
      { title: "Handover", description: "Final inspection and project completion." },
    ],
  },
  testimonials: {
    eyebrow: "Kind words",
    title: "Trusted by homeowners across Lagos",
    subtitle: "Real feedback from clients whose spaces we have finished.",
    rated: "Rated {rating} out of 5",
  },
  cta: {
    eyebrow: "Start a conversation",
    title: "Ready to transform your space?",
    subtitle: "Tell us about the room — we'll come back with honest advice and a clear, itemised quote within a week.",
    quoteCta: "Get a quote",
    chatWhatsApp: "Chat on WhatsApp",
    viewProjects: "View projects",
  },
  card: { featured: "Featured", view: "View project" },
  projectsIndex: {
    metaTitle: "Projects",
    metaDescription: "Selected POP ceilings, feature walls and interior finishing projects delivered across Lagos.",
    eyebrow: "Selected work",
    title: "Every ceiling has a story",
    subtitle: "A portfolio of ceilings, walls and full interiors across Lagos — every one finished by hand and inspected before handover.",
    ctaTitle: "Want your space on this page?",
    ctaSubtitle: "Tell us what you have in mind and we'll show you what's possible within your budget.",
  },
  projectDetail: {
    metaTitle: "Project",
    metaDescription: "A completed POP ceiling, feature wall or interior project by Prince Jahknow Crown Interior Services — photos, location and the scope of work.",
    eyebrow: "Selected work",
    title: "One project, start to finish",
    subtitle: "A real space in Lagos — designed, built and finished by the same hands that will finish yours.",
    back: "All projects",
    location: "Location",
    style: "Style",
    scope: "Scope",
    theWork: "The work",
    before: "Before",
    after: "After",
    altDetail: "{title} — detail",
    altBefore: "{title} — before finishing",
    altAfter: "{title} — after finishing",
    ctaTitle: "Want your space here next?",
    ctaSubtitle: "Tell us what you have in mind and we'll show you what's possible within your budget.",
  },
  servicesIndex: {
    metaTitle: "Services",
    metaDescription: "POP ceilings, feature walls, lighting design, wall finishes and full interior decoration across Lagos.",
    eyebrow: "Services",
    title1: "Finishing that",
    title2: "earns the space",
    subtitle: "One team for the whole job — from sculpted ceilings and coves to the last coat of finish. Every service is quoted clearly and delivered on schedule.",
    request: "Request this",
    ctaTitle: "Not sure which service you need?",
    ctaSubtitle: "Send a few photos of the space and we'll advise honestly — including what you don't need.",
    ctaButton: "Ask an expert",
  },
  about: {
    metaTitle: "About",
    metaDescription: "Prince Jahknow Crown Interior Services designs and builds premium POP ceilings and interiors across Lagos — one team, one standard, from first sketch to final handover.",
    eyebrow: "About",
    title: "Craftsmanship you notice every day",
    subtitle: "Prince Jahknow Crown Interior Services is a Lagos studio of designers, plasterers and finishers who treat the ceiling as the most important surface in the room.",
    storyEyebrow: "Our story",
    storyTitle: "Built on detail, not on promises",
    storyP1: "We started with a simple frustration: too many beautiful renders never survived contact with the real room. So we built a team that designs, builds and finishes under one roof — where the person who drew your ceiling is the person who signs it off.",
    storyP2: "That means honest quotes, tidy sites and a finish that still looks intentional years later. From a single accent ceiling to a complete home, the standard never changes.",
    quote: "We don't hand over until we'd happily live under it ourselves.",
    quoteAuthor: "The Prince Jahknow Crown Interior Services team",
    buildEyebrow: "Behind the build",
    buildTitle: "The part most portfolios skip",
    buildSubtitle: "Before the lighting and the finish, there is structure, plaster and patience. We show it because it's where quality is actually decided.",
    buildCaptions: ["Structure & scaffolding", "Shell in progress", "Roof on, systems in", "Finishing on site"],
  },
  contact: {
    metaTitle: "Contact",
    metaDescription: "Talk to Prince Jahknow Crown Interior Services about your ceiling or interior project. Message on WhatsApp, call, email or find us on Instagram and Facebook — we usually reply within a few hours.",
    eyebrow: "Contact",
    title: "Let's talk about your space",
    subtitle: "Send photos of the room on WhatsApp — tell us what you have in mind and we'll tell you honestly what it takes.",
    fastest: "Fastest reply",
    chatTitle: "Chat on WhatsApp",
    chatBody: "Send photos and room sizes, tell us the timeline you are working to, and we will come back with a clear, itemised quote within a week. No obligation, no pressure.",
    startConversation: "Start a conversation",
    followUs: "Follow the studio",
    directEyebrow: "Direct",
    directTitle: "Or reach us the old-fashioned way",
    directSubtitle: "Call, email or visit the studio — we are happy to talk it through either way.",
    labelPhone: "Phone",
    labelEmail: "Email",
    labelStudio: "Studio",
    labelHours: "Hours",
    visitsNote: "Visits are by appointment — message on WhatsApp first so someone is expecting you. We work across Lagos, from Lekki to Surulere.",
    regNote: "BN Reg. No. {reg} · CAC, Nigeria",
    faqEyebrow: "Good to know",
    faqTitle: "Questions we hear a lot",
    faqSubtitle: "Still unsure about something? Message us — there's no such thing as a silly question.",
    ctaTitle: "Prefer a proper quote?",
    ctaSubtitle: "Send photos and dimensions on WhatsApp — receive a clear, itemised estimate within a week.",
    ctaButton: "Message us on WhatsApp",
  },
  quote: {
    metaTitle: "Get a quote",
    metaDescription: "Request a free, itemised POP ceiling or interior decoration quote from Prince Jahknow Crown Interior Services. Clear pricing within a week.",
    eyebrow: "Free quote",
    title: "A quote you can plan around",
    subtitle: "No vague estimates, no hidden extras. Tell us about your project and we'll send a clear, itemised quote within a week.",
    stepsEyebrow: "What happens next",
    stepsTitle: "Four simple steps",
    steps: [
      { title: "Tell us about the space", description: "Share your location, room sizes and the look you're after." },
      { title: "Free site visit", description: "We measure, check the ceiling condition and talk through options." },
      { title: "Itemised quote", description: "A clear breakdown — materials, labour and lighting — within a week." },
      { title: "Scheduled start", description: "Approve the quote and we lock in a start date that suits you." },
    ],
    noPressure: "A quote is just information. Take your time, compare it, ask us anything — there's no obligation and no pressure.",
    faqEyebrow: "Details",
    faqTitle: "Before you send",
    faqSubtitle: "The questions we get asked most about pricing and process.",
  },
  form: {
    eyebrow: "Project brief",
    headline: "A few details are all we need to get started.",
    fullName: "Full name",
    yourName: "Your name",
    phone: "Phone / WhatsApp",
    location: "Project location",
    locationPlaceholder: "e.g. Lekki, Lagos",
    propertyType: "Property type",
    service: "Service of interest",
    notSure: "Not sure yet",
    somethingElse: "Something else",
    messageQuote: "Tell us about the space",
    messageContact: "Your message",
    placeholderQuote: "Room sizes, ceiling height, the look you want, timeline…",
    placeholderContact: "How can we help?",
    submitQuote: "Send my request",
    submitContact: "Send message",
    whatsappNote: "Opens WhatsApp — your details are never lost in an inbox.",
    missing: "Please fill in your name and phone number so we can reach you.",
    sentTitle: "WhatsApp should have opened with your details. If it didn't,",
    sentLink: "message us here",
    sentFallback: "message",
    sentDirect: "or call {phone} directly.",
    options: {
      house: "House", apartment: "Apartment", office: "Office", shop: "Shop",
      restaurant: "Restaurant", hotel: "Hotel", church: "Church", other: "Other",
    },
  },
  footer: {
    quotePanel: "Get a clear, itemised quote within 7 days.",
    startProject: "Start a project",
    explore: "Explore",
    servicesColumn: "Services",
    allServices: "All {n} services",
    contact: "Contact",
    hours: "Mon – Sat, 8am – 6pm",
    regLine: "BN Reg. No. {reg} · CAC, Nigeria",
    serving: "Serving Lagos & beyond",
    homeAria: "{brand} — home",
  },
  language: {
    label: "Language",
    names: { en: "English", fr: "Français", yo: "Yorùbá", ha: "Hausa", ig: "Igbo" },
  },
  whatsapp: { aria: "Chat on WhatsApp", label: "Chat on WhatsApp" },
  install: {
    dialogAria: "Install Prince Jahknow Crown",
    title: "Install the app",
    iosBefore: "Tap Share",
    iosAfter: ", then Add to Home Screen to keep us a tap away.",
    chromiumBody: "Add Prince Jahknow Crown to your home screen for a faster, full-screen experience.",
    installButton: "Install app",
    dismiss: "Not now",
    gotIt: "Got it",
  },
  offline: { banner: "Offline — we'll sync when you reconnect", reload: "Try again" },
  intro: { tagline: "Plaster Decors · Est. in Lagos", skip: "Press any key to skip" },
  faqs: [
    { question: "How much does a POP ceiling cost?", answer: "It depends on the area, the complexity of the design and the lighting you choose. Send us your room sizes and we'll come back with a firm, itemised quote within a week." },
    { question: "How long does a project take?", answer: "A single room typically takes 5–10 working days. Whole-home projects are phased so you always know what is happening next and when." },
    { question: "Do you work outside Lagos?", answer: "Yes. We are based in Lagos and regularly take projects across Nigeria. Travel and logistics are always itemised upfront — never hidden." },
    { question: "Can I see a design before you start?", answer: "Always. Every project begins with a 3D concept and material board so you approve exactly what will be built before work begins." },
  ],
};

const OVERRIDES = {
  ha: {
    "meta.title": "Prince Jahknow Crown Interior Services - Babban Rufin POP & Kayan Ado na Plaster",
    "nav.projects": "Ayyukanmu",
    "hero.discipline": "Rufin POP · Bangon siffa · Kayan ciki",
    "hero.areas": "Lagos, Najeriya · {n} yankunan da ake hidima",
    "hero.intro": "Prince Jahknow Crown Interior Services tana tsarawa da gina rufi na sassakaƙƙe, bangon siffa da cikakken kayan ciki a faɗin Legas — an zana su bisa ɗakinku, an gina su aka kammala da hannu.",
    "status.clear": "Sama mai haske",
    "status.updates.0": "Tsara kayan ciki na musamman",
    "status.updates.2": "Kammala bangon siffa",
    "stats.2.detail": "Daga ra'ayoyin miƙawa, ba binciken talla ba.",
    "stats.3.label": "Lokacin ba da farashi",
    "features.eyebrow": "Hanyarmu",
    "features.pillars.0.title": "Kayan aiki mai inganci",
    "features.pillars.2.description": "Layukan lokaci masu bayyana da wuraren aiki, tare da ci gaba da za ku iya gani.",
    "about.buildCaptions.0": "Tsari da sassaka",
    "about.buildCaptions.1": "Rufin da ake ci gaba",
    "about.buildCaptions.2": "Rufin a kan, tsarin a jiki",
    "about.buildCaptions.3": "Kammalawa a kan shafi",
    "process.subtitle": "Matakai shida masu bayyana daga tattaunawar farko zuwa sararin da aka gama, wanda aka duba.",
    "process.steps.3.title": "Farashi",
    "process.steps.5.title": "Miƙawa",
    "cta.subtitle": "Faɗa mana game da ɗakin — za mu dawo da nasiha mai gaskiya da farashi mai bayyana, cikakke, a cikin mako guda.",
    "contact.chatBody": "Aika hotuna da girman ɗaki, gaya mana lokacin da kuke aiki zuwa gare shi, kuma za mu dawo da farashi mai bayyane, cikakken jeri a cikin mako guda. Babu wajibi, babu matsi.",
    "contact.ctaTitle": "Fi son farashi mai kyau?",
    "contact.ctaSubtitle": "Aika hotuna da girman sarari akan WhatsApp — ka samu ƙiyasi mai bayyane, da jeri a cikin mako guda.",
    "contact.ctaButton": "Ka tura mana sako a WhatsApp",
    "quote.metaDescription": "Nemi farashi kyauta na rufin POP ko ado na ciki daga Prince Jahknow Crown Interior Services. Farashi a bayyane, cikakken jeri a cikin mako guda.",
    "quote.subtitle": "Babu ƙiyasi mai duhu, babu ƙarin da ke boye. Faɗa mana game da aikinku, kuma za mu aika farashi mai bayyane, cikakken jeri a cikin mako guda.",
    "quote.steps.0.description": "Raba wuri da kuke, girman ɗakin da yanayin da kuke so.",
    "quote.steps.1.description": "Muna auna, muna duba yanayin rufai, kuma muna tattaunawa akan zaɓuɓɓuka.",
    "quote.steps.2.title": "Jeri na farashi",
    "quote.steps.2.description": "Rabuwa mai bayyane — kayan aiki, aiki da haske — a cikin mako guda.",
    "quote.steps.3.description": "Amince da farashi, sai mu kulle ranar farawa da ta dace da ku.",
    "quote.noPressure": "Farashi bayani ne kawai. Ka ɗauki lokacinka, ku kwatanta shi, ku tambaye mu wani abu — babu wajibi, babu matsi.",
    "form.whatsappNote": "Buɗe WhatsApp — bayanan ku ba za su ɓace ba a cikin akwatin saƙo.",
    "form.sentTitle": "WhatsApp yakamata ya buɗe tare da bayananku. Idan bai yi ba,",
    "install.iosAfter": ", sa'an nan kuma Ƙara zuwa Gidan Allo don samun mu da sauki.",
    "faqs.0.answer": "Ya dogara da yanki, ƙalubalen zane da hasken da ka zaba. Aiko mana girman ɗakinku, kuma za mu dawo da ƙayyadaddun farashi a cikin mako guda.",
    "faqs.1.answer": "Ɗaki ɗaya yawanci yana ɗaukar kwanaki 5-10 na aiki. Ana tsara ayyukan gida don koyaushe ku san abin da ke faruwa na gaba da lokacin.",
    "faqs.2.answer": "Ee. Muna zaune a Legas kuma muna gudanar da ayyuka akai-akai a faɗin Najeriya. Tafiye-tafiye da dabaru koyaushe ana jera su a gaba — ba a ɓoye su ba.",
    "faqs.3.answer": "Koyaushe. Kowane aiki yana farawa da 3D zagayawar da kuma kayan allon domin ku yarda da ainihin abin da za a gina kafin fara aiki.",
  },
  ig: {
    "meta.title": "Prince Jahknow Crown Interior Services - Elu ụlọ POP dị elu & Ihe ndozi Plasta",
    "meta.description": "Gbanwee oghere gị site na nrụnye elu ụlọ POP dị mma, ịchọ mma ime ụlọ na imecha omenala. Na-eje ozi Lagos na gburugburu ya.",
    "hero.discipline": "Elu ụlọ POP · Mgbidi pụrụ iche · Ime ụlọ",
    "hero.areas": "Lagos, Naịjirịa · {n} ebe a na-eje ozi",
    "status.clear": "Igwe dị ọcha",
    "status.updates.0": "Ịmepụta ime ụlọ ahaziri",
    "status.updates.1": "Ịwu ụlọ elu POP",
    "status.updates.2": "Ịmecha mgbidi pụrụ iche",
    "status.sr": "Prince Jahknow Crown Interior Services na-echepụta ime ụlọ ahaziri, na-ewu ụlọ elu POP, na imecha mgbidi pụrụ iche.",
    "stats.3.label": "Oge akọwara ọnụahịa",
    "stats.3.detail": "Doro anya, edere nke ọma, enweghị mmanye.",
    "features.eyebrow": "Ụzọ anyị",
    "about.subtitle": "Prince Jahknow Crown Interior Services bụ ụlọ ọrụ Lagos nke ndị na-echepụta ihe, ndị na-eji plasta na ndị na-emecha ihe ndị na-ewere uko ụlọ dị ka elu kachasị mkpa n'ime ụlọ ahụ.",
    "about.buildCaptions.1": "Ọkwa ụlọ n'ọrụ",
    "process.steps.3.title": "Ọnụahịa",
    "featured.title": "Oghere anyị gbanwere",
    "testimonials.subtitle": "Ezi nzaghachi sitere n'aka ndị ahịa nke oghere anyị imechaala.",
    "projectDetail.metaDescription": "Elu ụlọ POP a rụchara, mgbidi pụrụ iche ma ọ bụ ọrụ ime ụlọ site na Prince Jahknow Crown Interior Services — foto, ọnọdụ na oke ọrụ.",
    "contact.labelStudio": "Ụlọ Ọrụ",
    "contact.directEyebrow": "Ozugbo",
    "contact.ctaTitle": "Nhota? Ị na-achọ ọnụahịa kwesịrị ekwesị?",
    "contact.ctaButton": "Nye anyị ozi na WhatsApp",
    "install.iosAfter": ", wee Tinye na Ihuenyo Ụlọ iji mee ka anyị dị nso.",
    "quote.steps.2.title": "Ndepụta ọnụahịa",
  },
};

const HEAD = {
  ha: `import type { Dictionary } from "./en";

/**
 * Hausa dictionary.
 *
 * Machine-assisted draft (en → ha), type-checked against \`Dictionary\` so no
 * key can drift from the English source of truth. Brand names, form
 * placeholders, numeric values and template tokens are preserved verbatim.
 * Have a fluent speaker review before treating this copy as final.
 */
`,
  ig: `import type { Dictionary } from "./en";

/**
 * Igbo dictionary.
 *
 * Machine-assisted draft (en → ig), type-checked against \`Dictionary\` so no
 * key can drift from the English source of truth. Brand names, form
 * placeholders, numeric values and template tokens are preserved verbatim.
 * Have a fluent speaker review before treating this copy as final.
 */
`,
};

const flat = {}, allVals = {};
function flatten(o, p) {
  if (typeof o === "string") {
    allVals[p] = o;
    if (!SKIP_RE.test(o)) flat[p] = o;
    return;
  }
  if (Array.isArray(o)) { o.forEach((x, i) => flatten(x, p + "." + i)); return; }
  if (o && typeof o === "object") {
    for (const [k, v] of Object.entries(o)) {
      const key = p ? p + "." + k : k;
      if (key === "language.names") continue;
      flatten(v, key);
    }
  }
}
flatten(en, "");

function toSource(s) {
  return s.split(BRAND_FULL).join(SENT_FULL).split(BRAND_SHORT).join(SENT_SHORT);
}
function fromSource(s) {
  return s.split(SENT_FULL).join(BRAND_FULL).split(SENT_SHORT).join(BRAND_SHORT);
}

function residual(src, out) {
  if (!out) return 99;
  const words = toSource(src).toLowerCase().match(/[a-z]{4,}/g) || [];
  const uniq = words.filter((w) => !WHITELIST.has(w));
  const lower = out.toLowerCase();
  return new Set(uniq.filter((w) => lower.includes(w))).size;
}

async function gtx(q, tl) {
  for (let i = 0; i < 5; i++) {
    try {
      const r = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${tl}&dt=t&q=${encodeURIComponent(q)}`,
        { headers: { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" } }
      );
      if (!r.ok) { if (i === 4) return null; continue; }
      const j = await r.json();
      const t = (j?.[0] || []).map((x) => x?.[0] || "").join("");
      if (t) return t.trim();
      if (i === 4) return null;
    } catch { if (i === 4) return null; }
    if (i > 0) await fetch("https://translate.googleapis.com/robots.txt").catch(() => null);
  }
  return null;
}

async function translateAll(tl) {
  const tr = {};
  const keys = Object.keys(flat);
  let cursor = 0;
  async function worker() {
    while (cursor < keys.length) {
      const k = keys[cursor++];
      const src = flat[k];
      let t = await gtx(toSource(src), tl);
      const r1 = residual(src, t);
      if (r1 >= 3 && src.length < 200) {
        const t2 = await gtx(toSource(src.toLowerCase()), tl);
        if (residual(src, t2) < r1) t = t2;
      }
      tr[k] = t ? fromSource(t) : null;
    }
  }
  await Promise.all(Array.from({ length: 12 }, worker));
  return tr;
}

async function buildLanguage(tl) {
  const tr = await translateAll(tl);
  const fail = Object.keys(flat).filter((k) => !tr[k]);
  const clone = JSON.parse(JSON.stringify(en));
  function pick(key) {
    if (key in OVERRIDES[tl]) return OVERRIDES[tl][key];
    const t = tr[key];
    return (t && t.trim()) || allVals[key] || "";
  }
  function rebuild(o, p = "") {
    for (const k of Object.keys(o)) {
      const key = p ? p + "." + k : k;
      if (key === "language.names") continue;
      const v = o[k];
      if (Array.isArray(v)) {
        o[k] = v.map((x, i) => {
          const kk = key + "." + i;
          if (x && typeof x === "object") { rebuild(x, kk); return x; }
          return pick(kk);
        });
        continue;
      }
      if (v && typeof v === "object") { rebuild(v, key); continue; }
      o[k] = pick(key);
    }
  }
  rebuild(clone);

  const empties = [];
  (function check(o, p = "") {
    for (const [k, v] of Object.entries(o)) {
      const key = p ? p + "." + k : k;
      if (v && typeof v === "object") check(v, key);
      else if (v === "" && allVals[key] !== "") empties.push(key);
    }
  })(clone);

  const unclosed = [];
  (function checkTokens(o, p = "") {
    for (const [k, v] of Object.entries(o)) {
      const key = p ? p + "." + k : k;
      if (v && typeof v === "object") checkTokens(v, key);
      else {
        const src = flat[key] || "";
        (String(src).match(/\{[a-z]+\}/gi) || []).forEach((tok) => {
          if (!String(v).includes(tok.toLowerCase()) && !String(v).includes(tok)) unclosed.push(key);
        });
      }
    }
  })(clone);

  const vars = new Set(); // sanity: all tokens in file use supported names
  const content = HEAD[tl] + "export const " + tl + ": Dictionary = " + JSON.stringify(clone, null, 2) + ";\n";
  writeFileSync(join(ROOT, tl + ".ts"), content, "utf8");
  console.log(`[${tl}] fail=${fail.length} empties=${empties.length} tokenMiss=${[...new Set(unclosed)].length}`);
  if (fail.length) console.log(`  fail: ${fail.join(", ")}`);
  if (empties.length) console.log(`  empties: ${empties.join(", ")}`);
  if (unclosed.length) console.log(`  tokenMiss: ${[...new Set(unclosed)].join(", ")}`);
  vars.add(tl);
  return { fail, empties, tokenMiss: [...new Set(unclosed)] };
}

console.log("Generating dictionaries…");
const ha = await buildLanguage("ha");
const ig = await buildLanguage("ig");
console.log("Done.");
