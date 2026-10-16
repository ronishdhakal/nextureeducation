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
  university_count?: number;
  cost_overview?: string;
  intake_overview?: string;
  visa_overview?: string;
  eligibility_overview?: string;
  why_study_overview?: string;
  popular_courses_overview?: string;
  documents_overview?: string;
  scholarships_overview?: string;
  additional_info?: string;
  key_highlights?: string;
  why_choose_points?: string;
  study_areas?: string;
  updated_at?: string;
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
  tagline?: string;
  meta_title?: string;
  meta_description?: string;
  hero_image?: string | null;
  about?: string;
  key_highlights?: string;
  why_choose_points?: string;
  course_structure?: string;
  duration?: string;
  class_mode?: string;
  batch_size?: string;
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
  cover_image: string | null;
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
  rating?: number;
  headline?: string;
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
  email: string;
  facebook_url: string;
  instagram_url: string;
  linkedin_url: string;
  x_url: string;
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
  updated_at?: string;
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
  stat_students_label: string;
  stat_partner_universities_label: string;
  stat_visa_success_rate_label: string;
  stat_countries_label: string;
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
export type LeadTemperature = "hot" | "warm" | "cold";

export type CallOutcome =
  | "connected"
  | "no_answer"
  | "voicemail"
  | "wrong_number"
  | "follow_up_scheduled";

export interface CallLog {
  id: number;
  lead: number;
  outcome: CallOutcome;
  notes: string;
  follow_up_at: string | null;
  created_by_username: string;
  created_at: string;
}

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
  temperature: LeadTemperature;
  assigned_to: number | null;
  assigned_to_name: string;
  next_follow_up: string | null;
  created_at: string;
  updated_at: string;
}

export interface EventItem {
  id: number;
  title: string;
  slug: string;
  category: string;
  category_display: string;
  cover_image: string | null;
  summary: string;
  about: string;
  event_date: string;
  updated_at?: string;
  start_time: string | null;
  end_time: string | null;
  venue: string;
  mode?: string;
  organizer?: string;
  registration_type?: string;
  what_youll_discover: string;
  why_attend: string;
  who_should_attend: string;
  what_to_expect: string;
  meta_title?: string;
  meta_description?: string;
}

export interface LeadSummary {
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  closed: number;
  hot: number;
  overdue: number;
  today: number;
  unassigned: number;
}

export interface AssignableUser {
  id: number;
  name: string;
  role: string;
}

export interface PopupItem {
  id: number;
  title: string;
  image: string;
  link_url: string;
  open_in_new_tab: boolean;
  delay_seconds: number;
  frequency: "session" | "daily" | "always";
  show_on: "all" | "home";
  updated_at: string;
}
