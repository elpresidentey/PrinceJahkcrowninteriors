import { whatsappUrl } from "@/lib/utils";

// Business Information
export const BUSINESS_INFO = {
  name: "Prince Jahknow Crown Interior Services",
  shortName: "PJC",
  tagline: "Premium POP Ceilings & Plaster Decors",
  description: "Transform your space with premium POP ceiling installations, interior decoration, and custom finishing.",
  phone: "+234 810 303 3773",
  whatsapp: "2348103033773",
  email: "jahknowcrown@gmail.com",
  address: "59 Catholic Mission Street, Oteyi Garden Estate, Abule Ado, Lagos State",
  regNo: "7973322", // CAC Business Name Registration No.
  areasServed: [
    "Lekki",
    "Ajah",
    "Ikoyi",
    "Victoria Island",
    "Ikeja",
    "Yaba",
    "Surulere",
    "Festac",
    "Maryland",
    "Magodo",
    "Lagos Island",
    "Lagos Mainland",
  ],
} as const;

// WhatsApp enquiry deep link — every "Get a quote" CTA lands straight in chat
export const WHATSAPP_QUOTE_MESSAGE = "Hello Prince Jahknow Crown Interior Services, I'd like a quote for my project.";
export const WHATSAPP_QUOTE_URL = whatsappUrl(BUSINESS_INFO.whatsapp, WHATSAPP_QUOTE_MESSAGE);

// Social Media Links
export const SOCIAL_LINKS = {
  instagram: "https://instagram.com/crownjahknow",
  facebook: "https://www.facebook.com/100078699825483",
} as const;

// Project Categories
export const PROJECT_CATEGORIES = [
  { label: "All Projects", value: "all" },
  { label: "POP Ceilings", value: "pop-ceilings" },
  { label: "Living Rooms", value: "living-rooms" },
  { label: "Bedrooms", value: "bedrooms" },
  { label: "TV Walls", value: "tv-walls" },
  { label: "Offices", value: "offices" },
  { label: "Commercial", value: "commercial" },
  { label: "Lighting", value: "lighting" },
  { label: "Interior Decoration", value: "interior-decoration" },
] as const;

// Design Styles
export const DESIGN_STYLES = [
  { label: "Modern", value: "modern" },
  { label: "Luxury", value: "luxury" },
  { label: "Minimal", value: "minimal" },
  { label: "Classic", value: "classic" },
  { label: "Contemporary", value: "contemporary" },
  { label: "African Modern", value: "african-modern" },
] as const;

// Property Types
export const PROPERTY_TYPES = [
  { label: "House", value: "house" },
  { label: "Apartment", value: "apartment" },
  { label: "Office", value: "office" },
  { label: "Shop", value: "shop" },
  { label: "Restaurant", value: "restaurant" },
  { label: "Hotel", value: "hotel" },
  { label: "Church", value: "church" },
  { label: "Other", value: "other" },
] as const;

// Enquiry Status
export const ENQUIRY_STATUS = [
  { label: "New", value: "new" },
  { label: "Contacted", value: "contacted" },
  { label: "Inspection Scheduled", value: "inspection-scheduled" },
  { label: "Quoted", value: "quoted" },
  { label: "Won", value: "won" },
  { label: "Lost", value: "lost" },
] as const;

// Consultation Status
export const CONSULTATION_STATUS = [
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
] as const;

// Room Types
export const ROOM_TYPES = [
  { label: "Living Room", value: "living-room" },
  { label: "Bedroom", value: "bedroom" },
  { label: "Dining Room", value: "dining-room" },
  { label: "Kitchen", value: "kitchen" },
  { label: "Office", value: "office" },
  { label: "Multiple Rooms", value: "multiple-rooms" },
  { label: "Entire Property", value: "entire-property" },
] as const;

// Project Sizes
export const PROJECT_SIZES = [
  { label: "Small", value: "small" },
  { label: "Medium", value: "medium" },
  { label: "Large", value: "large" },
  { label: "Entire Building", value: "entire-building" },
] as const;

// Nigerian States
export const NIGERIAN_STATES = [
  { label: "Lagos", value: "lagos" },
  { label: "Abuja (FCT)", value: "abuja" },
  { label: "Ogun", value: "ogun" },
  { label: "Oyo", value: "oyo" },
  { label: "Rivers", value: "rivers" },
  { label: "Kano", value: "kano" },
  // Add more states as needed
] as const;

// Lagos Areas (for location dropdown)
export const LAGOS_AREAS = [
  { label: "Lekki", value: "lekki" },
  { label: "Ajah", value: "ajah" },
  { label: "Ikoyi", value: "ikoyi" },
  { label: "Victoria Island", value: "victoria-island" },
  { label: "Ikeja", value: "ikeja" },
  { label: "Yaba", value: "yaba" },
  { label: "Surulere", value: "surulere" },
  { label: "Festac", value: "festac" },
  { label: "Maryland", value: "maryland" },
  { label: "Magodo", value: "magodo" },
  { label: "Lagos Island", value: "lagos-island" },
  { label: "Lagos Mainland", value: "lagos-mainland" },
  { label: "Other", value: "other" },
] as const;

// Our Process Steps
export const PROCESS_STEPS = [
  {
    number: "01",
    title: "Consultation",
    description: "Tell us about your project and vision.",
  },
  {
    number: "02",
    title: "Inspection",
    description: "We visit and assess your space.",
  },
  {
    number: "03",
    title: "Design",
    description: "We recommend suitable designs and finishes.",
  },
  {
    number: "04",
    title: "Quotation",
    description: "You receive a detailed project estimate.",
  },
  {
    number: "05",
    title: "Installation",
    description: "Our team transforms your space.",
  },
  {
    number: "06",
    title: "Handover",
    description: "Final inspection and project completion.",
  },
] as const;

// Features/Benefits
export const FEATURES = [
  {
    title: "Premium Quality",
    description: "High-quality materials and expert craftsmanship",
    icon: "Sparkles",
  },
  {
    title: "Custom Designs",
    description: "Tailored solutions that match your vision",
    icon: "Home",
  },
  {
    title: "Timely Delivery",
    description: "Projects completed on schedule",
    icon: "Clock",
  },
  {
    title: "Guaranteed Work",
    description: "Quality assurance on all projects",
    icon: "Shield",
  },
] as const;

// Navigation Links
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

// Meta Defaults
export const META_DEFAULTS = {
  title: "Prince Jahknow Crown Interior Services — Premium POP Ceilings & Plaster Decors",
  description: "Transform your space with premium POP ceiling installations, interior decoration, and custom finishing. Serving Lagos and surrounding areas.",
  keywords: "POP ceiling, interior decoration, interior finishing, Lagos, Nigeria, POP installer, ceiling design, TV wall, lighting design",
  siteName: "Prince Jahknow Crown Interior Services",
  locale: "en_NG",
  type: "website",
} as const;
