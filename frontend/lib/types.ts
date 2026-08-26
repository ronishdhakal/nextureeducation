export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Destination {
  id: number;
  name: string;
  slug: string;
  country_code: string;
  flag_image: string | null;
  hero_image?: string | null;
  summary: string;
  cost_overview?: string;
  intake_overview?: string;
  visa_overview?: string;
  eligibility_overview?: string;
  popular_intakes: string;
  is_featured: boolean;
  is_published?: boolean;
  order: number;
  meta_title?: string;
  meta_description?: string;
}

export interface Service {
  id: number;
  title: string;
  slug: string;
  icon: string;
  short_description: string;
  long_description: string;
  order: number;
  meta_title?: string;
  meta_description?: string;
}

export interface TestPrep {
  id: number;
  name: string;
  slug: string;
  description: string;
  format_note: string;
  schedule_note: string;
  fees_note: string;
  order: number;
}

export interface University {
  id: number;
  name: string;
  country: number;
  country_name: string;
  logo: string | null;
  city: string;
  ranking_note: string;
  programs_summary: string;
  external_link: string;
  is_partner: boolean;
  order: number;
}

export interface Testimonial {
  id: number;
  student_name: string;
  photo: string | null;
  destination: number | null;
  destination_name: string;
  university: string;
  quote: string;
  year: number | null;
  is_featured: boolean;
  order: number;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  photo: string | null;
  bio: string;
  order: number;
}

export interface Branch {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  map_link: string;
  is_head_office: boolean;
  order: number;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  cover_image: string | null;
  excerpt: string;
  body?: string;
  author: string;
  published_at: string | null;
  meta_title?: string;
  meta_description?: string;
}

export interface Page {
  id: number;
  title: string;
  slug: string;
  body: string;
  meta_title?: string;
  meta_description?: string;
}

export interface SiteSettings {
  id: number;
  logo: string | null;
  phone: string;
  email: string;
  address: string;
  whatsapp_number: string;
  facebook_url: string;
  instagram_url: string;
  linkedin_url: string;
  youtube_url: string;
  tiktok_url: string;
  hero_eyebrow: string;
  hero_headline: string;
  hero_subcopy: string;
  stat_students_placed: string;
  stat_partner_universities: string;
  stat_visa_success_rate: string;
  stat_countries: string;
}

export type PreferredLevel =
  | "foundation"
  | "diploma"
  | "bachelor"
  | "master"
  | "phd"
  | "undecided";

export interface LeadPayload {
  name: string;
  phone: string;
  email?: string;
  preferred_destination?: number | null;
  preferred_level?: PreferredLevel;
  message?: string;
  source_page?: string;
  website?: string; // honeypot — always left blank by real users
}

export type LeadStatus = "new" | "contacted" | "qualified" | "closed";

export interface Lead {
  id: number;
  name: string;
  phone: string;
  email: string;
  preferred_destination: number | null;
  destination_name: string;
  preferred_level: PreferredLevel;
  message: string;
  source_page: string;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
}
