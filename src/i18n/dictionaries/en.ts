/**
 * English source of truth for every public-facing string.
 *
 * The other dictionaries ("./fr", "./yo", "./ha", "./ig") type themselves
 * against `Dictionary`, so a missing or misspelled key anywhere fails the
 * build instead of silently rendering English.
 *
 * Strings INVOLVING BUSINESS DATA (services/projects names, testimonial and
 * FAQ bodies — things the owner authors in the dashboard) stay in English on
 * purpose: they come from Supabase rows and are not translated.
 */

export const en = {
  /** <title> and shared metadata. */
  meta: {
    title: "Prince Jahknow Crown Interior Services — Premium POP Ceilings & Plaster Decors",
    description:
      "Transform your space with premium POP ceiling installations, interior decoration, and custom finishing. Serving Lagos and surrounding areas.",
  },

  /** Header, mobile menu and navigation. */
  nav: {
    home: "Home",
    projects: "Projects",
    services: "Services",
    about: "About",
    contact: "Contact",
    menu: "Menu",
    closeMenu: "Close",
    openMenuAria: "Open menu",
    closeMenuAria: "Close menu",
    getQuote: "Get a quote",
    startProject: "Start a project",
    chatWhatsApp: "Chat on WhatsApp",
    language: "Language",
  },

  /** Home hero. */
  hero: {
    discipline: "POP ceilings · Feature walls · Interiors",
    headline1: "A finer finish",
    headline2: "for every room",
    intro:
      "Prince Jahknow Crown Interior Services designs and builds sculpted ceilings, feature walls and complete interiors across Lagos — drawn around your room, built and finished by hand.",
    quoteCta: "Get a quote",
    seeWork: "See our work",
    areas: "Lagos, Nigeria · {n} areas served",
    scroll: "Scroll to explore",
  },

  /** Live studio marquee under the hero. */
  status: {
    aria: "Studio status",
    updating: "Lagos weather updating",
    clear: "Clear skies",
    partly: "Partly cloudy",
    rain: "Rain in the area",
    sr: "Prince Jahknow Crown Interior Services is designing tailored interiors, building POP ceilings, and finishing feature walls.",
    updates: ["Designing tailored interiors", "Building POP ceilings", "Finishing feature walls"],
  },

  /** Stat band. */
  stats: [
    { label: "Spaces transformed", value: "120", unit: "+", detail: "Ceilings, walls and full interiors across Lagos." },
    { label: "Hands-on experience", value: "10", unit: "+ yrs", detail: "Designing and building under one roof." },
    { label: "Average client rating", value: "4.8", unit: "/5", detail: "From handover feedback, not a marketing survey." },
    { label: "Quote turnaround", value: "7", unit: "days", detail: "Clear, itemised and with no obligation." },
  ],

  /** Trust pillars band. */
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

  /** Services preview band. */
  servicesPreview: {
    eyebrow: "Services",
    title: "What we make",
    subtitle: "One team for the whole job — from sculpted ceilings and coves to the last coat of finish.",
    all: "All services",
  },

  /** Featured projects band. */
  featured: {
    eyebrow: "Selected work",
    title: "Spaces we have transformed",
    subtitle: "Recent ceilings, walls and interiors delivered across Lagos.",
    all: "View all projects",
  },

  /** Process band. */
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

  /** Testimonials band. */
  testimonials: {
    eyebrow: "Kind words",
    title: "Trusted by homeowners across Lagos",
    subtitle: "Real feedback from clients whose spaces we have finished.",
    rated: "Rated {rating} out of 5",
  },

  /** Closing CTA band. */
  cta: {
    eyebrow: "Start a conversation",
    title: "Ready to transform your space?",
    subtitle:
      "Tell us about the room — we'll come back with honest advice and a clear, itemised quote within a week.",
    quoteCta: "Get a quote",
    chatWhatsApp: "Chat on WhatsApp",
    viewProjects: "View projects",
  },

  /** Project card chrome. */
  card: {
    featured: "Featured",
    view: "View project",
  },

  /** /projects. */
  projectsIndex: {
    metaTitle: "Projects",
    metaDescription:
      "Selected POP ceilings, feature walls and interior finishing projects delivered across Lagos.",
    eyebrow: "Selected work",
    title: "Every ceiling has a story",
    subtitle:
      "A portfolio of ceilings, walls and full interiors across Lagos — every one finished by hand and inspected before handover.",
    ctaTitle: "Want your space on this page?",
    ctaSubtitle: "Tell us what you have in mind and we'll show you what's possible within your budget.",
  },

  /** /projects/[slug]. */
  projectDetail: {
    metaTitle: "Project",
    metaDescription:
      "A completed POP ceiling, feature wall or interior project by Prince Jahknow Crown Interior Services — photos, location and the scope of work.",
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

  /** /services. */
  servicesIndex: {
    metaTitle: "Services",
    metaDescription: "POP ceilings, feature walls, lighting design, wall finishes and full interior decoration across Lagos.",
    eyebrow: "Services",
    title1: "Finishing that",
    title2: "earns the space",
    subtitle:
      "One team for the whole job — from sculpted ceilings and coves to the last coat of finish. Every service is quoted clearly and delivered on schedule.",
    request: "Request this",
    ctaTitle: "Not sure which service you need?",
    ctaSubtitle: "Send a few photos of the space and we'll advise honestly — including what you don't need.",
    ctaButton: "Ask an expert",
  },

  /** /about. */
  about: {
    metaTitle: "About",
    metaDescription:
      "Prince Jahknow Crown Interior Services designs and builds premium POP ceilings and interiors across Lagos — one team, one standard, from first sketch to final handover.",
    eyebrow: "About",
    title: "Craftsmanship you notice every day",
    subtitle:
      "Prince Jahknow Crown Interior Services is a Lagos studio of designers, plasterers and finishers who treat the ceiling as the most important surface in the room.",
    storyEyebrow: "Our story",
    storyTitle: "Built on detail, not on promises",
    storyP1:
      "We started with a simple frustration: too many beautiful renders never survived contact with the real room. So we built a team that designs, builds and finishes under one roof — where the person who drew your ceiling is the person who signs it off.",
    storyP2:
      "That means honest quotes, tidy sites and a finish that still looks intentional years later. From a single accent ceiling to a complete home, the standard never changes.",
    quote: "We don't hand over until we'd happily live under it ourselves.",
    quoteAuthor: "The Prince Jahknow Crown Interior Services team",
    buildEyebrow: "Behind the build",
    buildTitle: "The part most portfolios skip",
    buildSubtitle:
      "Before the lighting and the finish, there is structure, plaster and patience. We show it because it's where quality is actually decided.",
    buildCaptions: ["Structure & scaffolding", "Shell in progress", "Roof on, systems in", "Finishing on site"],
  },

  /** /contact. */
  contact: {
    metaTitle: "Contact",
    metaDescription:
      "Talk to Prince Jahknow Crown Interior Services about your ceiling or interior project. Message on WhatsApp, call, email or find us on Instagram and Facebook — we usually reply within a few hours.",
    eyebrow: "Contact",
    title: "Let's talk about your space",
    subtitle: "Send photos of the room on WhatsApp — tell us what you have in mind and we'll tell you honestly what it takes.",
    fastest: "Fastest reply",
    chatTitle: "Chat on WhatsApp",
    chatBody:
      "Send photos and room sizes, tell us the timeline you are working to, and we will come back with a clear, itemised quote within a week. No obligation, no pressure.",
    startConversation: "Start a conversation",
    followUs: "Follow the studio",
    directEyebrow: "Direct",
    directTitle: "Or reach us the old-fashioned way",
    directSubtitle: "Call, email or visit the studio — we are happy to talk it through either way.",
    labelPhone: "Phone",
    labelEmail: "Email",
    labelStudio: "Studio",
    labelHours: "Hours",
    visitsNote:
      "Visits are by appointment — message on WhatsApp first so someone is expecting you. We work across Lagos, from Lekki to Surulere.",
    regNote: "BN Reg. No. {reg} · CAC, Nigeria",
    faqEyebrow: "Good to know",
    faqTitle: "Questions we hear a lot",
    faqSubtitle: "Still unsure about something? Message us — there's no such thing as a silly question.",
    ctaTitle: "Prefer a proper quote?",
    ctaSubtitle: "Send photos and dimensions on WhatsApp — receive a clear, itemised estimate within a week.",
    ctaButton: "Message us on WhatsApp",
  },

  /** /quote. */
  quote: {
    metaTitle: "Get a quote",
    metaDescription:
      "Request a free, itemised POP ceiling or interior decoration quote from Prince Jahknow Crown Interior Services. Clear pricing within a week.",
    eyebrow: "Free quote",
    title: "A quote you can plan around",
    subtitle:
      "No vague estimates, no hidden extras. Tell us about your project and we'll send a clear, itemised quote within a week.",
    stepsEyebrow: "What happens next",
    stepsTitle: "Four simple steps",
    steps: [
      { title: "Tell us about the space", description: "Share your location, room sizes and the look you're after." },
      { title: "Free site visit", description: "We measure, check the ceiling condition and talk through options." },
      { title: "Itemised quote", description: "A clear breakdown — materials, labour and lighting — within a week." },
      { title: "Scheduled start", description: "Approve the quote and we lock in a start date that suits you." },
    ],
    noPressure:
      "A quote is just information. Take your time, compare it, ask us anything — there's no obligation and no pressure.",
    faqEyebrow: "Details",
    faqTitle: "Before you send",
    faqSubtitle: "The questions we get asked most about pricing and process.",
  },

  /** Enquiry form (quote variant + short contact variant). */
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
      house: "House",
      apartment: "Apartment",
      office: "Office",
      shop: "Shop",
      restaurant: "Restaurant",
      hotel: "Hotel",
      church: "Church",
      other: "Other",
    },
  },

  /** Footer. */
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
    origin: "Lagos, Nigeria",
    homeAria: "{brand} — home",
  },

  /** Language switcher. */
  language: {
    label: "Language",
    names: { en: "English", fr: "Français", yo: "Yorùbá", ha: "Hausa", ig: "Igbo" },
  },

  /** Floating WhatsApp button. */
  whatsapp: {
    aria: "Chat on WhatsApp",
    label: "Chat on WhatsApp",
  },

  /** PWA install prompt. */
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

  /** Offline banner (client component). */
  offline: {
    banner: "Offline — we'll sync when you reconnect",
    reload: "Try again",
  },

  /** Intro splash (brand animation). */
  intro: {
    tagline: "Plaster Decors · Est. in Lagos",
    skip: "Press any key to skip",
  },

  /** FAQ answer bodies come from authored data; the questions live here too. */
  faqs: [
    {
      question: "How much does a POP ceiling cost?",
      answer:
        "It depends on the area, the complexity of the design and the lighting you choose. Send us your room sizes and we'll come back with a firm, itemised quote within a week.",
    },
    {
      question: "How long does a project take?",
      answer:
        "A single room typically takes 5–10 working days. Whole-home projects are phased so you always know what is happening next and when.",
    },
    {
      question: "Do you work outside Lagos?",
      answer:
        "Yes. We are based in Lagos and regularly take projects across Nigeria. Travel and logistics are always itemised upfront — never hidden.",
    },
    {
      question: "Can I see a design before you start?",
      answer:
        "Always. Every project begins with a 3D concept and material board so you approve exactly what will be built before work begins.",
    },
  ],
};

export type Dictionary = typeof en;
