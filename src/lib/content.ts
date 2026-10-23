import {
  Sparkles,
  Home,
  Clock,
  ShieldCheck,
  Layers,
  Tv,
  Lamp,
  Sofa,
  PaintRoller,
  Ruler,
  type LucideIcon,
} from "lucide-react";
import type { ImageKey } from "@/lib/image-manifest";

/**
 * Placeholder marketing content for the public site.
 *
 * This is intentionally static so the UI is fully explorable before the
 * Supabase tables are populated. Swap these arrays for `getProjects()`,
 * `getServices()` and `getTestimonials()` from "@/lib/supabase/queries"
 * once the database has real records.
 */

export interface ServiceItem {
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon;
  /** Key into IMAGES (see "@/lib/image-manifest"). */
  image: ImageKey;
  highlights: string[];
}

export const SERVICES: ServiceItem[] = [
  {
    slug: "pop-ceilings",
    name: "POP Ceiling Design",
    description:
      "Sculpted plaster-of-paris ceilings that turn an ordinary room into a statement.",
    icon: Layers,
    image: "ceiling-led-strips",
    highlights: ["Suspended & drop ceilings", "Cove & recessed details", "Bulkheads & curves"],
  },
  {
    slug: "tv-feature-walls",
    name: "TV & Feature Walls",
    description:
      "Bespoke media walls with integrated panelling, shelving and concealed wiring.",
    icon: Tv,
    image: "living-feature-wall",
    highlights: ["Fluted & 3D panels", "Concealed cable management", "Built-in lighting niches"],
  },
  {
    slug: "lighting-design",
    name: "Lighting & Cove Design",
    description:
      "Layered lighting plans — cove, spot and accent — that give every surface warmth.",
    icon: Lamp,
    image: "bedroom-rgb-lighting",
    highlights: ["Ambient cove lighting", "LED profile strips", "Scene-based controls"],
  },
  {
    slug: "interior-decoration",
    name: "Interior Decoration",
    description:
      "Full-room styling: finishes, fittings and furniture that make a space feel finished.",
    icon: Sofa,
    image: "classic-living-room",
    highlights: ["Curated finishes", "Furniture & fittings", "Colour & material boards"],
  },
  {
    slug: "wall-finishes",
    name: "Wall Panelling & Finishes",
    description:
      "Microcement, wood panelling and textured paint applied with a craftsman's hand.",
    icon: PaintRoller,
    image: "bedroom-timber-panelling",
    highlights: ["Microcement & travertine", "Timber slat panelling", "Venetian plaster"],
  },
  {
    slug: "design-consultation",
    name: "3D Design & Consultation",
    description:
      "See your space before we build it, with photoreal concept renders and a clear plan.",
    icon: Ruler,
    image: "build-shell-01",
    highlights: ["3D concept renders", "Material selection", "Detailed cost plan"],
  },
];

export interface ProjectItem {
  slug: string;
  title: string;
  location: string;
  category: string;
  style: string;
  summary: string;
  services: string[];
  /** Key into IMAGES (see "@/lib/image-manifest"); omitted for DB rows. */
  image?: ImageKey;
  /** Direct image URL (Supabase Storage); preferred over `image` when set. */
  imageSrc?: string;
  /** Accent surface kept for card art direction fallbacks. */
  tone: string;
  featured?: boolean;
}

export const PROJECTS: ProjectItem[] = [
  {
    slug: "lekki-penthouse-ceiling",
    title: "Penthouse Ceiling",
    location: "Lekki, Lagos",
    category: "POP Ceilings",
    style: "Luxury",
    summary:
      "A double-height stairwell ceiling finished with layered coves and a floating chandelier pocket.",
    services: ["POP Ceiling", "Lighting", "Feature Wall"],
    image: "living-linear-cove",
    tone: "#ded5bd",
    featured: true,
  },
  {
    slug: "ikoyi-media-wall",
    title: "Illuminated Media Wall",
    location: "Ikoyi, Lagos",
    category: "TV Walls",
    style: "Modern",
    summary:
      "Fluted timber panelling wraps a 75-inch screen with hidden storage and warm accent lighting.",
    services: ["TV Wall", "Joinery"],
    image: "living-feature-wall",
    tone: "#cfc9b6",
    featured: true,
  },
  {
    slug: "ajah-family-duplex",
    title: "Family Duplex",
    location: "Ajah, Lagos",
    category: "Living Rooms",
    style: "Contemporary",
    summary:
      "A full ground-floor transformation: ceiling, lighting, panelling and soft furnishing.",
    services: ["Interior Decoration", "Lighting"],
    image: "classic-living-room",
    tone: "#dcd6c2",
    featured: true,
  },
  {
    slug: "victoria-island-office",
    title: "Corporate Reception",
    location: "Victoria Island",
    category: "Commercial",
    style: "Minimal",
    summary:
      "A calm, brand-led reception ceiling with linear light and acoustic timber baffles.",
    services: ["Commercial", "Lighting"],
    image: "ceiling-geometric-cove",
    tone: "#c9c2ad",
  },
  {
    slug: "maryland-master-suite",
    title: "Master Suite Retreat",
    location: "Maryland, Lagos",
    category: "Bedrooms",
    style: "Classic",
    summary:
      "A tray ceiling with concealed cove light and a velvet-upholstered headboard wall.",
    services: ["Bedrooms", "Upholstery"],
    image: "bedroom-timber-panelling",
    tone: "#b08968",
  },
  {
    slug: "lekki-restaurant-interior",
    title: "Boutique Restaurant",
    location: "Lekki Phase 1",
    category: "Commercial",
    style: "African Modern",
    summary:
      "Warm sculpted ceilings and patterned screens set the mood for an intimate dining room.",
    services: ["Commercial", "Interior Decoration"],
    image: "ceiling-led-strips",
    tone: "#e7e1cd",
  },
];

export interface TestimonialItem {
  name: string;
  location: string;
  content: string;
  rating: number;
  projectType: string;
}

export const TESTIMONIALS: TestimonialItem[] = [
  {
    name: "Adaeze O.",
    location: "Lekki Phase 1",
    rating: 5,
    projectType: "Living Room Ceiling",
    content:
      "They understood the look I wanted from a single photo and delivered something better. The finishing is immaculate.",
  },
  {
    name: "Tunde A.",
    location: "Ikoyi",
    rating: 5,
    projectType: "TV & Feature Wall",
    content:
      "Clean work, no mess, and finished two days early. The concealed lighting makes the whole room.",
  },
  {
    name: "Chiamaka N.",
    location: "Ajah",
    rating: 5,
    projectType: "Full Interior",
    content:
      "From the 3D design to the final handover everything was clear and on budget. I have already referred two friends.",
  },
];

export interface StatItem {
  value: string;
  unit?: string;
  label: string;
  detail: string;
}

export const STATS: StatItem[] = [
  {
    value: "120",
    unit: "+",
    label: "Spaces transformed",
    detail: "Ceilings, walls and full interiors across Lagos.",
  },
  {
    value: "10",
    unit: "+ yrs",
    label: "Hands-on experience",
    detail: "Designing and building under one roof.",
  },
  {
    value: "4.8",
    unit: "/5",
    label: "Average client rating",
    detail: "From handover feedback, not a marketing survey.",
  },
  {
    value: "7",
    unit: "days",
    label: "Quote turnaround",
    detail: "Clear, itemised and with no obligation.",
  },
];

export interface TrustPillar {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const TRUST_PILLARS: TrustPillar[] = [
  {
    icon: Sparkles,
    title: "Premium Materials",
    description: "Only trusted, durable materials — no shortcuts hidden behind a finish.",
  },
  {
    icon: Home,
    title: "Made For Your Space",
    description: "Every design is drawn around your room, your light and how you live.",
  },
  {
    icon: Clock,
    title: "On Schedule",
    description: "Clear timelines and tidy sites, with progress you can actually see.",
  },
  {
    icon: ShieldCheck,
    title: "Aftercare Included",
    description: "A backed guarantee and follow-up support after every handover.",
  },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQS: FaqItem[] = [
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
];
