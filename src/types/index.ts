// Database Types (matches Supabase schema)
export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  location: string;
  category: ProjectCategory;
  featured: boolean;
  cover_image: string;
  services: string[];
  style: string | null;
  summary: string | null;
  completion_date: string | null;
  duration: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  type: "gallery" | "before" | "after";
  sort_order: number;
  created_at: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string;
  highlights: string[] | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  whatsapp: string | null;
  email: string | null;
  service: string;
  property_type: PropertyType;
  location: string;
  room: string | null;
  budget: BudgetRange | null;
  description: string | null;
  images: string[];
  status: EnquiryStatus;
  created_at: string;
}

export interface Consultation {
  id: string;
  name: string;
  phone: string;
  whatsapp: string | null;
  location: string;
  preferred_date: string;
  preferred_time: string;
  service: string;
  notes: string | null;
  status: ConsultationStatus;
  created_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  content: string;
  image: string | null;
  rating: number;
  project_type: string | null;
  published: boolean;
  created_at: string;
}

// Enums
export type ProjectCategory =
  | "all"
  | "pop-ceilings"
  | "living-rooms"
  | "bedrooms"
  | "tv-walls"
  | "offices"
  | "commercial"
  | "lighting"
  | "interior-decoration";

export type PropertyType =
  | "house"
  | "apartment"
  | "office"
  | "shop"
  | "restaurant"
  | "hotel"
  | "church"
  | "other";

export type EnquiryStatus =
  | "new"
  | "contacted"
  | "inspection-scheduled"
  | "quoted"
  | "won"
  | "lost";

export type ConsultationStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

export type BudgetRange =
  | "500k-1m"
  | "1m-2m"
  | "2m-5m"
  | "5m+"
  | "not-sure";

export type DesignStyle =
  | "modern"
  | "luxury"
  | "minimal"
  | "classic"
  | "contemporary"
  | "african-modern";

// Form Types
export interface QuoteRequestForm {
  // Step 1
  service: string;
  // Step 2
  property_type: PropertyType;
  // Step 3
  state: string;
  city: string;
  area: string;
  // Step 4
  room: string;
  // Step 5
  project_size: string;
  square_meters?: number;
  // Step 6
  budget?: BudgetRange;
  // Step 7
  images?: File[];
  // Step 8
  name: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  // Step 9
  description?: string;
}

export interface ConsultationRequestForm {
  name: string;
  phone: string;
  whatsapp?: string;
  location: string;
  preferred_date: string;
  preferred_time: string;
  service: string;
  notes?: string;
}

// Component Props
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export interface SelectOption {
  label: string;
  value: string;
}
