export type FieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "date"
  | "number"
  | "password"
  | "rating"
  | "relation"
  | "file"
  | "time"
  | "image"
  | "boolean"
  | "select"
  | "destination-select";

export interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  hint?: string;
  options?: { value: string; label: string }[];
  maxLength?: number;
  rows?: number;
  /** For type "relation": where the selectable records come from. */
  relation?: { resource: string; labelKey: string; plain?: boolean };
  defaultValue?: unknown;
}

export type ColumnKind =
  | "text"
  | "bool"
  | "live"
  | "date"
  | "role"
  | "name-flag"
  | "count"
  | "status"
  | "rating"
  | "excerpt"
  | "event-time"
  | "badge"
  | "file-link"
  | "appt-time";

export interface ListColumn {
  key: string;
  label: string;
  kind?: ColumnKind;
}

export interface ListFilter {
  key: string;
  label: string;
  options?: { value: string; label: string }[];
  /** Load the options from the API instead of listing them here. */
  optionsFrom?: { resource: string; labelKey: string; plain?: boolean };
}

export interface ListTab {
  key: string;
  allLabel: string;
  options: { value: string; label: string }[];
}

export interface ListStat {
  label: string;
  count: (rows: Record<string, unknown>[]) => number;
}

export interface ResourceConfig {
  resource: string;
  basePath: string;
  singularLabel: string;
  pluralLabel: string;
  description: string;
  searchPlaceholder?: string;
  ordering?: string;
  /** Computed status label per row, for kind: "status" columns and the Status filter. */
  statusOf?: (row: Record<string, unknown>) => string;
  statuses?: string[];
  filters?: ListFilter[];
  tabs?: ListTab;
  addLabel?: string;
  /** Send saves as multipart form data (models with a required file). */
  multipart?: boolean;
  stats?: ListStat[];
  fields: FieldConfig[];
  listColumns: ListColumn[];
  titleField: string;
}

const SEO_FIELDS: FieldConfig[] = [
  { key: "meta_title", label: "SEO title", type: "text", hint: "Leave blank to use the page title" },
  { key: "meta_description", label: "SEO description", type: "text" },
];

export const SERVICE_CONFIG: ResourceConfig = {
  resource: "services",
  basePath: "/admin/services",
  singularLabel: "Service",
  pluralLabel: "Services",
  description: "The services shown on the homepage and /services.",
  titleField: "title",
  listColumns: [
    { key: "title", label: "Title" },
    { key: "order", label: "Order" },
    { key: "is_published", label: "Status", kind: "live" },
  ],
  fields: [
    { key: "title", label: "Title", type: "text", required: true },
    { key: "slug", label: "Slug", type: "text", hint: "Leave blank to auto-generate" },
    {
      key: "icon",
      label: "Icon",
      type: "select",
      options: [
        { value: "compass", label: "Compass" },
        { value: "target", label: "Target" },
        { value: "file-text", label: "File" },
        { value: "stamp", label: "Stamp" },
        { value: "award", label: "Award" },
        { value: "plane", label: "Plane" },
      ],
    },
    { key: "short_description", label: "Short description", type: "textarea", required: true, maxLength: 200 },
    { key: "long_description", label: "Long description", type: "richtext" },
    { key: "order", label: "Order", type: "number", defaultValue: 0 },
    { key: "is_published", label: "Published", type: "boolean", defaultValue: true },
    ...SEO_FIELDS,
  ],
};

export const TESTPREP_CONFIG: ResourceConfig = {
  resource: "test-prep",
  basePath: "/admin/test-prep",
  singularLabel: "Test Prep",
  pluralLabel: "Test Prep",
  description: "IELTS, PTE, SAT and other test prep offerings.",
  titleField: "name",
  listColumns: [
    { key: "name", label: "Name" },
    { key: "order", label: "Order" },
    { key: "is_published", label: "Status", kind: "live" },
  ],
  fields: [
    { key: "name", label: "Name", type: "text", required: true },
    { key: "slug", label: "Slug", type: "text", hint: "Leave blank to auto-generate" },
    { key: "tagline", label: "Tagline", type: "text", hint: "e.g. Prove your English, unlock global opportunities." },
    { key: "hero_image", label: "Hero image", type: "image" },
    { key: "description", label: "Card description", type: "textarea", hint: "Short blurb shown on the course cards" },
    { key: "about", label: "About this test", type: "richtext" },
    { key: "key_highlights", label: "Key highlights", type: "richtext", hint: "Bullet list: one highlight per bullet" },
    { key: "why_choose_points", label: "Why choose our course", type: "richtext", hint: "Bullet list. Optional detail after a pipe: Title | short detail" },
    { key: "course_structure", label: "Course structure", type: "richtext", hint: "Add a Heading 3 per section (e.g. Listening), then a bullet list under each" },
    { key: "duration", label: "Duration", type: "text", hint: "e.g. 6-8 weeks" },
    { key: "class_mode", label: "Class mode", type: "text", hint: "e.g. Online / Offline" },
    { key: "batch_size", label: "Batch size", type: "text", hint: "e.g. Max 10 students" },
    { key: "format_note", label: "Format", type: "text" },
    { key: "schedule_note", label: "Schedule", type: "text" },
    { key: "fees_note", label: "Fees", type: "text" },
    { key: "order", label: "Order", type: "number", defaultValue: 0 },
    { key: "is_published", label: "Published", type: "boolean", defaultValue: true },
    ...SEO_FIELDS,
  ],
};

export const BRANCH_CONFIG: ResourceConfig = {
  resource: "branches",
  basePath: "/admin/branches",
  singularLabel: "Branch",
  pluralLabel: "Branches",
  description: "Office locations shown in the footer and on /contact.",
  titleField: "name",
  listColumns: [
    { key: "name", label: "Name" },
    { key: "is_head_office", label: "Head office" },
    { key: "is_active", label: "Active" },
  ],
  fields: [
    { key: "name", label: "Name", type: "text", required: true },
    { key: "address", label: "Address", type: "textarea", required: true },
    { key: "phone", label: "Phone", type: "text" },
    { key: "email", label: "Email", type: "text" },
    { key: "map_link", label: "Map link", type: "text" },
    { key: "order", label: "Order", type: "number", defaultValue: 0 },
    { key: "is_head_office", label: "Head office", type: "boolean" },
    { key: "is_active", label: "Active", type: "boolean", defaultValue: true },
  ],
};

export const TESTIMONIAL_CONFIG: ResourceConfig = {
  resource: "testimonials",
  basePath: "/admin/testimonials",
  singularLabel: "Testimonial",
  pluralLabel: "Testimonials",
  description: "Review and publish what students say about studying abroad with Nexture.",
  searchPlaceholder: "Search students",
  ordering: "-id",
  statuses: ["Published", "Draft"],
  statusOf: (row) => (row.is_published ? "Published" : "Draft"),
  titleField: "student_name",
  listColumns: [
    { key: "student_name", label: "Student name" },
    { key: "quote", label: "Testimonial", kind: "excerpt" },
    { key: "rating", label: "Ratings", kind: "rating" },
    { key: "destination_name", label: "Destination" },
    { key: "created_at", label: "Added on", kind: "date" },
    { key: "status", label: "Status", kind: "status" },
  ],
  fields: [
    { key: "student_name", label: "Student name", type: "text", required: true },
    { key: "rating", label: "Rating", type: "rating", defaultValue: 5 },
    { key: "photo", label: "Featured image", type: "image" },
    { key: "destination", label: "Destination", type: "destination-select" },
    { key: "university", label: "University", type: "text" },
    { key: "quote", label: "Quote", type: "textarea", required: true },
    { key: "year", label: "Year", type: "number" },
    { key: "order", label: "Order", type: "number", defaultValue: 0 },
    { key: "is_featured", label: "Featured", type: "boolean" },
    { key: "is_published", label: "Published", type: "boolean", defaultValue: true },
  ],
};

export const UNIVERSITY_CONFIG: ResourceConfig = {
  resource: "universities",
  basePath: "/admin/universities",
  singularLabel: "University",
  pluralLabel: "Universities",
  description: "Partner universities shown on destination pages and /universities.",
  titleField: "name",
  searchPlaceholder: "Search universities",
  ordering: "name",
  listColumns: [
    { key: "name", label: "University name" },
    { key: "country_name", label: "Destination" },
    { key: "city", label: "City" },
    { key: "ranking_note", label: "Global ranking" },
    { key: "is_partner", label: "Partner", kind: "bool" },
    { key: "is_published", label: "Status", kind: "live" },
  ],
  fields: [
    { key: "name", label: "Name", type: "text", required: true },
    { key: "country", label: "Country", type: "destination-select", required: true },
    { key: "logo", label: "Logo", type: "image" },
    { key: "cover_image", label: "Cover photo", type: "image", hint: "Campus photo shown on the destination page" },
    { key: "city", label: "City", type: "text" },
    { key: "ranking_note", label: "Ranking note", type: "text", hint: "e.g. Top 50 QS ranked" },
    { key: "programs_summary", label: "Programs summary", type: "richtext" },
    { key: "external_link", label: "Website", type: "text" },
    { key: "order", label: "Order", type: "number", defaultValue: 0 },
    { key: "is_partner", label: "Active partner", type: "boolean", defaultValue: true },
    { key: "is_published", label: "Published", type: "boolean", defaultValue: true },
  ],
};

export const BLOGPOST_CONFIG: ResourceConfig = {
  resource: "blog",
  basePath: "/admin/blog",
  singularLabel: "Blog Post",
  pluralLabel: "Blog",
  description: "Manage and publish articles shown on the blog.",
  searchPlaceholder: "Search blogs by title",
  ordering: "-published_at",
  statuses: ["Published", "Draft"],
  statusOf: (row) => (row.is_published ? "Published" : "Draft"),
  filters: [
    {
      key: "category",
      label: "Category",
      options: [
        { value: "study-abroad", label: "Study Abroad" },
        { value: "visa-guide", label: "Visa Guide" },
        { value: "scholarships", label: "Scholarships" },
        { value: "test-prep", label: "Test Prep" },
        { value: "news", label: "News" },
        { value: "general", label: "General" },
      ],
    },
  ],
  titleField: "title",
  listColumns: [
    { key: "title", label: "Title" },
    { key: "category_display", label: "Category" },
    { key: "author", label: "Author" },
    { key: "published_at", label: "Publish date", kind: "date" },
    { key: "status", label: "Status", kind: "status" },
  ],
  fields: [
    { key: "title", label: "Title", type: "text", required: true },
    { key: "slug", label: "Slug", type: "text", hint: "Leave blank to auto-generate" },
    {
      key: "category",
      label: "Category",
      type: "select",
      options: [
        { value: "study-abroad", label: "Study Abroad" },
        { value: "visa-guide", label: "Visa Guide" },
        { value: "scholarships", label: "Scholarships" },
        { value: "test-prep", label: "Test Prep" },
        { value: "news", label: "News" },
        { value: "general", label: "General" },
      ],
    },
    { key: "cover_image", label: "Featured image", type: "image" },
    { key: "excerpt", label: "Excerpt", type: "textarea", maxLength: 280, hint: "Shown on the blog list" },
    { key: "body", label: "Body", type: "richtext", required: true },
    { key: "author", label: "Author", type: "text" },
    { key: "published_at", label: "Publish date", type: "date" },
    { key: "is_published", label: "Published", type: "boolean", defaultValue: true },
    ...SEO_FIELDS,
  ],
};

export const PAGE_CONFIG: ResourceConfig = {
  resource: "pages",
  basePath: "/admin/pages",
  singularLabel: "Page",
  pluralLabel: "Pages",
  description: "Freeform pages (e.g. Privacy Policy) available at /pages/[slug].",
  titleField: "title",
  listColumns: [
    { key: "title", label: "Title" },
    { key: "slug", label: "Slug" },
    { key: "is_published", label: "Status", kind: "live" },
  ],
  fields: [
    { key: "title", label: "Title", type: "text", required: true },
    { key: "slug", label: "Slug", type: "text", hint: "Leave blank to auto-generate" },
    { key: "body", label: "Body", type: "richtext", required: true },
    { key: "is_published", label: "Published", type: "boolean", defaultValue: true },
    ...SEO_FIELDS,
  ],
};

export const EVENT_CONFIG: ResourceConfig = {
  resource: "events",
  basePath: "/admin/events",
  singularLabel: "Event",
  pluralLabel: "Events",
  description: "Manage and organize events, workshops and activities for students.",
  searchPlaceholder: "Search events by title, location",
  ordering: "-event_date",
  statuses: ["Upcoming", "Completed"],
  statusOf: (row) =>
    String(row.event_date) >= new Date().toISOString().slice(0, 10) ? "Upcoming" : "Completed",
  stats: [
    { label: "Total events", count: (rows) => rows.length },
    {
      label: "Upcoming",
      count: (rows) =>
        rows.filter((r) => String(r.event_date) >= new Date().toISOString().slice(0, 10)).length,
    },
    {
      label: "Completed",
      count: (rows) =>
        rows.filter((r) => String(r.event_date) < new Date().toISOString().slice(0, 10)).length,
    },
  ],
  filters: [
    {
      key: "category",
      label: "Category",
      options: [
        { value: "education-fair", label: "Education Fair" },
        { value: "university-session", label: "University Session" },
        { value: "webinar", label: "Webinar" },
        { value: "workshop", label: "Workshop" },
      ],
    },
  ],
  titleField: "title",
  listColumns: [
    { key: "title", label: "Title" },
    { key: "category_display", label: "Category" },
    { key: "venue", label: "Location" },
    { key: "organizer", label: "Organizer" },
    { key: "event_date", label: "Date & Time", kind: "event-time" },
    { key: "status", label: "Status", kind: "status" },
  ],
  fields: [
    { key: "title", label: "Title", type: "text", required: true },
    { key: "slug", label: "Slug", type: "text", hint: "Leave blank to auto-generate" },
    {
      key: "category",
      label: "Category",
      type: "select",
      options: [
        { value: "education-fair", label: "Education Fair" },
        { value: "university-session", label: "University Session" },
        { value: "webinar", label: "Webinar" },
        { value: "workshop", label: "Workshop" },
      ],
    },
    { key: "cover_image", label: "Cover image", type: "image" },
    { key: "summary", label: "Summary", type: "textarea", required: true, maxLength: 280 },
    { key: "event_date", label: "Date", type: "date", required: true },
    { key: "start_time", label: "Start time", type: "time" },
    { key: "end_time", label: "End time", type: "time" },
    {
      key: "mode",
      label: "Mode",
      type: "select",
      options: [
        { value: "in-person", label: "In person" },
        { value: "online", label: "Online" },
        { value: "hybrid", label: "Hybrid" },
      ],
    },
    {
      key: "registration_type",
      label: "Registration",
      type: "select",
      options: [
        { value: "open", label: "Open registration" },
        { value: "none", label: "No registration needed" },
        { value: "invite", label: "Invite only" },
      ],
    },
    { key: "venue", label: "Venue", type: "text", hint: "e.g. Kathmandu, Nepal" },
    { key: "organizer", label: "Organizer", type: "text", defaultValue: "Nexture Education" },
    { key: "about", label: "About the event", type: "richtext" },
    { key: "what_youll_discover", label: "What you will discover", type: "richtext", hint: "Bullet list" },
    { key: "why_attend", label: "Why attend", type: "richtext", hint: "Bullet list" },
    { key: "who_should_attend", label: "Who should attend", type: "richtext", hint: "Bullet list: one audience per bullet" },
    { key: "what_to_expect", label: "What to expect", type: "richtext", hint: "Bullet list. Optional detail after a pipe: Title | short detail" },
    { key: "is_published", label: "Published", type: "boolean", defaultValue: true },
    ...SEO_FIELDS,
  ],
};

export const DESTINATION_LIST_CONFIG: ResourceConfig = {
  resource: "destinations",
  basePath: "/admin/destinations",
  singularLabel: "Destination",
  pluralLabel: "Destinations",
  description: "Manage and explore study destinations around the world.",
  searchPlaceholder: "Search by country name",
  titleField: "name",
  listColumns: [
    { key: "name", label: "Destination", kind: "name-flag" },
    { key: "university_count", label: "Universities", kind: "count" },
    { key: "popular_intakes", label: "Intakes" },
    { key: "is_featured", label: "Featured", kind: "bool" },
    { key: "is_published", label: "Status", kind: "live" },
  ],
  fields: [],
};

export const USER_CONFIG: ResourceConfig = {
  resource: "users",
  basePath: "/admin/users",
  singularLabel: "User",
  pluralLabel: "Users & Roles",
  description: "Staff accounts and what each role can do.",
  searchPlaceholder: "Search by name or email",
  ordering: "email",
  titleField: "email",
  listColumns: [
    { key: "first_name", label: "First name" },
    { key: "last_name", label: "Last name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role", kind: "role" },
    { key: "is_active", label: "Active", kind: "bool" },
  ],
  fields: [
    { key: "first_name", label: "First name", type: "text", required: true },
    { key: "last_name", label: "Last name", type: "text" },
    { key: "email", label: "Email (used to sign in)", type: "text", required: true },
    { key: "phone", label: "Phone", type: "text" },
    {
      key: "role",
      label: "Role",
      type: "select",
      required: true,
      hint: "Admin: everything. Counsellor: all leads, assigns them. Telecaller: only leads assigned to them. Content manager: website content only.",
      options: [
        { value: "admin", label: "Admin" },
        { value: "counsellor", label: "Counsellor" },
        { value: "telecaller", label: "Telecaller" },
        { value: "content_manager", label: "Content manager" },
      ],
    },
    { key: "password", label: "Password", type: "password", required: true, hint: "Leave blank when editing to keep the current password." },
    { key: "is_active", label: "Active", type: "boolean", defaultValue: true },
  ],
};

const DESTINATION_REL = { resource: "destinations", labelKey: "name" } as const;
const STAFF_REL = { resource: "users/assignable", labelKey: "name", plain: true } as const;

export const STUDENT_CONFIG: ResourceConfig = {
  resource: "students",
  basePath: "/admin/students",
  singularLabel: "Student",
  pluralLabel: "Students",
  description: "Manage and track your student records effortlessly.",
  searchPlaceholder: "Search students",
  ordering: "-created_at",
  titleField: "full_name",
  tabs: {
    key: "status",
    allLabel: "All students",
    options: [{ value: "active", label: "Active" }, { value: "on_hold", label: "On hold" }, { value: "completed", label: "Completed" }],
  },
  filters: [
    { key: "destination", label: "Destination", optionsFrom: DESTINATION_REL },
    { key: "counsellor", label: "Counsellor", optionsFrom: STAFF_REL },
  ],
  listColumns: [
    { key: "full_name", label: "Student name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "destination_name", label: "Destination" },
    { key: "university_name", label: "University" },
    { key: "status_display", label: "Status", kind: "badge" },
  ],
  fields: [
    { key: "full_name", label: "Full name", type: "text", required: true },
    { key: "email", label: "Email address", type: "text" },
    { key: "phone", label: "Phone number", type: "text", required: true },
    { key: "date_of_birth", label: "Date of birth", type: "date" },
    { key: "gender", label: "Gender", type: "select", options: [{ value: "male", label: "Male" }, { value: "female", label: "Female" }, { value: "other", label: "Other" }] },
    { key: "address", label: "Address", type: "text" },
    { key: "current_education_level", label: "Current education level", type: "select", options: [{ value: "high_school", label: "High school (+2)" }, { value: "diploma", label: "Diploma" }, { value: "bachelor", label: "Bachelor's" }, { value: "master", label: "Master's" }, { value: "other", label: "Other" }] },
    { key: "field_of_study", label: "Field of study", type: "text" },
    { key: "destination", label: "Destination country", type: "relation", relation: DESTINATION_REL },
    { key: "preferred_university", label: "Preferred university", type: "relation", relation: { resource: "universities", labelKey: "name" } },
    { key: "counsellor", label: "Counsellor", type: "relation", relation: STAFF_REL },
    { key: "status", label: "Status", type: "select", options: [{ value: "active", label: "Active" }, { value: "on_hold", label: "On hold" }, { value: "completed", label: "Completed" }], defaultValue: "active" },
    { key: "photo", label: "Profile photo", type: "image" },
    { key: "notes", label: "Notes", type: "textarea", rows: 4 },
  ],
};

export const APPLICATION_CONFIG: ResourceConfig = {
  resource: "applications",
  basePath: "/admin/applications",
  singularLabel: "Application",
  pluralLabel: "Applications",
  description: "Track every university application from first draft to enrolment.",
  searchPlaceholder: "Search by student, university or course",
  ordering: "-created_at",
  titleField: "student_name",
  tabs: {
    key: "status",
    allLabel: "All applications",
    options: [{ value: "pending", label: "Pending" }, { value: "in_progress", label: "In progress" }, { value: "submitted", label: "Submitted" }, { value: "offer_received", label: "Offer received" }, { value: "accepted", label: "Offer accepted" }, { value: "enrolled", label: "Enrolled" }, { value: "rejected", label: "Rejected" }, { value: "withdrawn", label: "Withdrawn" }],
  },
  stats: [
    { label: "Total applications", count: (rows) => rows.length },
    {
      label: "In progress",
      count: (rows) => rows.filter((r) => ["pending", "in_progress", "submitted"].includes(String(r.status))).length,
    },
    {
      label: "Offers & enrolments",
      count: (rows) => rows.filter((r) => ["offer_received", "accepted", "enrolled"].includes(String(r.status))).length,
    },
  ],
  filters: [{ key: "destination", label: "Destination", optionsFrom: DESTINATION_REL }],
  listColumns: [
    { key: "student_name", label: "Student name" },
    { key: "destination_name", label: "Destination" },
    { key: "university_name", label: "University" },
    { key: "course", label: "Course" },
    { key: "intake", label: "Intake" },
    { key: "applied_on", label: "Applied on", kind: "date" },
    { key: "status_display", label: "Status", kind: "badge" },
  ],
  fields: [
    { key: "student", label: "Student", type: "relation", required: true, relation: { resource: "students", labelKey: "full_name" } },
    { key: "university", label: "University", type: "relation", relation: { resource: "universities", labelKey: "name" } },
    { key: "course", label: "Course / program", type: "text" },
    { key: "intake", label: "Intake", type: "text", hint: "e.g. February 2027" },
    { key: "status", label: "Status", type: "select", options: [{ value: "pending", label: "Pending" }, { value: "in_progress", label: "In progress" }, { value: "submitted", label: "Submitted" }, { value: "offer_received", label: "Offer received" }, { value: "accepted", label: "Offer accepted" }, { value: "enrolled", label: "Enrolled" }, { value: "rejected", label: "Rejected" }, { value: "withdrawn", label: "Withdrawn" }], defaultValue: "pending" },
    { key: "applied_on", label: "Applied on", type: "date" },
    { key: "notes", label: "Notes", type: "textarea", rows: 4 },
  ],
};

export const DOCUMENT_CONFIG: ResourceConfig = {
  resource: "documents",
  basePath: "/admin/documents",
  singularLabel: "Document",
  pluralLabel: "Documents",
  description: "Passports, transcripts and everything else collected from students.",
  searchPlaceholder: "Search by student or title",
  ordering: "-created_at",
  titleField: "student_name",
  multipart: true,
  tabs: {
    key: "status",
    allLabel: "All documents",
    options: [{ value: "pending", label: "Pending review" }, { value: "verified", label: "Verified" }, { value: "rejected", label: "Rejected" }],
  },
  filters: [{ key: "doc_type", label: "Type", options: [{ value: "passport", label: "Passport copy" }, { value: "transcript", label: "Academic transcript" }, { value: "certificate", label: "Certificate" }, { value: "cv", label: "CV / Resume" }, { value: "sop", label: "Statement of purpose" }, { value: "lor", label: "Letter of recommendation" }, { value: "english_test", label: "English test score" }, { value: "financial", label: "Financial document" }, { value: "photo", label: "Photograph" }, { value: "other", label: "Other" }] }],
  listColumns: [
    { key: "student_name", label: "Student name" },
    { key: "doc_type_display", label: "Document" },
    { key: "title", label: "Title" },
    { key: "created_at", label: "Uploaded", kind: "date" },
    { key: "status_display", label: "Status", kind: "badge" },
    { key: "file", label: "File", kind: "file-link" },
  ],
  fields: [
    { key: "student", label: "Student", type: "relation", required: true, relation: { resource: "students", labelKey: "full_name" } },
    { key: "doc_type", label: "Document type", type: "select", options: [{ value: "passport", label: "Passport copy" }, { value: "transcript", label: "Academic transcript" }, { value: "certificate", label: "Certificate" }, { value: "cv", label: "CV / Resume" }, { value: "sop", label: "Statement of purpose" }, { value: "lor", label: "Letter of recommendation" }, { value: "english_test", label: "English test score" }, { value: "financial", label: "Financial document" }, { value: "photo", label: "Photograph" }, { value: "other", label: "Other" }], defaultValue: "other" },
    { key: "title", label: "Title", type: "text", hint: "Optional, e.g. IELTS result Jan 2027" },
    { key: "status", label: "Status", type: "select", options: [{ value: "pending", label: "Pending review" }, { value: "verified", label: "Verified" }, { value: "rejected", label: "Rejected" }], defaultValue: "pending" },
    { key: "file", label: "File", type: "file" },
    { key: "notes", label: "Notes", type: "text" },
  ],
};

export const APPOINTMENT_CONFIG: ResourceConfig = {
  resource: "appointments",
  basePath: "/admin/counselling",
  singularLabel: "Appointment",
  pluralLabel: "Counselling",
  addLabel: "Schedule Appointment",
  description: "Manage student counselling sessions and track progress.",
  searchPlaceholder: "Search by student name, email or phone",
  ordering: "-date",
  titleField: "person_name",
  stats: [
    { label: "Total counselling sessions", count: (rows) => rows.length },
    { label: "Scheduled", count: (rows) => rows.filter((r) => r.status === "scheduled").length },
    { label: "Completed", count: (rows) => rows.filter((r) => r.status === "completed").length },
  ],
  filters: [
    { key: "counsellor", label: "Counsellor", optionsFrom: STAFF_REL },
    { key: "status", label: "Status", options: [{ value: "scheduled", label: "Scheduled" }, { value: "completed", label: "Completed" }, { value: "cancelled", label: "Cancelled" }, { value: "no_show", label: "No show" }] },
  ],
  listColumns: [
    { key: "person_name", label: "Student name" },
    { key: "person_email", label: "Email" },
    { key: "person_phone", label: "Phone" },
    { key: "counsellor_name", label: "Counsellor" },
    { key: "date", label: "Next appointment", kind: "appt-time" },
    { key: "status_display", label: "Status", kind: "badge" },
  ],
  fields: [
    { key: "student", label: "Student", type: "relation", relation: { resource: "students", labelKey: "full_name" }, hint: "Choose a student, or an inquiry below if they are not a student yet" },
    { key: "lead", label: "Or inquiry", type: "relation", relation: { resource: "leads", labelKey: "name" } },
    { key: "counsellor", label: "Counsellor", type: "relation", relation: STAFF_REL },
    { key: "status", label: "Status", type: "select", options: [{ value: "scheduled", label: "Scheduled" }, { value: "completed", label: "Completed" }, { value: "cancelled", label: "Cancelled" }, { value: "no_show", label: "No show" }], defaultValue: "scheduled" },
    { key: "date", label: "Date", type: "date", required: true },
    { key: "time", label: "Time", type: "time", required: true },
    { key: "priority", label: "Priority", type: "select", options: [{ value: "low", label: "Low" }, { value: "medium", label: "Medium" }, { value: "high", label: "High" }], defaultValue: "medium" },
    { key: "mode", label: "Mode", type: "select", options: [{ value: "in_office", label: "In office" }, { value: "online", label: "Online" }, { value: "phone", label: "Phone call" }], defaultValue: "in_office" },
    { key: "location", label: "Meeting link / location", type: "text" },
    { key: "notes", label: "Notes", type: "textarea", rows: 4 },
  ],
};

export const VISA_CONFIG: ResourceConfig = {
  resource: "visa-applications",
  basePath: "/admin/visa-applications",
  singularLabel: "Visa Application",
  pluralLabel: "Visa Applications",
  description: "Follow each student through visa preparation, interview and decision.",
  searchPlaceholder: "Search by student or visa type",
  ordering: "-created_at",
  titleField: "student_name",
  tabs: {
    key: "status",
    allLabel: "All visa applications",
    options: [{ value: "preparing", label: "Preparing" }, { value: "documents_ready", label: "Documents ready" }, { value: "interview_scheduled", label: "Interview scheduled" }, { value: "submitted", label: "Submitted" }, { value: "granted", label: "Granted" }, { value: "refused", label: "Refused" }],
  },
  filters: [{ key: "destination", label: "Destination", optionsFrom: DESTINATION_REL }],
  listColumns: [
    { key: "student_name", label: "Student name" },
    { key: "destination_name", label: "Destination" },
    { key: "visa_type", label: "Visa type" },
    { key: "interview_date", label: "Interview", kind: "date" },
    { key: "submitted_on", label: "Submitted", kind: "date" },
    { key: "status_display", label: "Status", kind: "badge" },
  ],
  fields: [
    { key: "student", label: "Student", type: "relation", required: true, relation: { resource: "students", labelKey: "full_name" } },
    { key: "destination", label: "Destination", type: "relation", relation: DESTINATION_REL },
    { key: "visa_type", label: "Visa type", type: "text", defaultValue: "Student visa" },
    { key: "status", label: "Status", type: "select", options: [{ value: "preparing", label: "Preparing" }, { value: "documents_ready", label: "Documents ready" }, { value: "interview_scheduled", label: "Interview scheduled" }, { value: "submitted", label: "Submitted" }, { value: "granted", label: "Granted" }, { value: "refused", label: "Refused" }], defaultValue: "preparing" },
    { key: "interview_date", label: "Interview date", type: "date" },
    { key: "submitted_on", label: "Submitted on", type: "date" },
    { key: "notes", label: "Notes", type: "textarea", rows: 4 },
  ],
};

export const POPUP_CONFIG: ResourceConfig = {
  resource: "popups",
  basePath: "/admin/popups",
  singularLabel: "Popup",
  pluralLabel: "Popups",
  description: "Square promotional popups shown to website visitors, same on phone and desktop.",
  searchPlaceholder: "Search popups",
  ordering: "-created_at",
  titleField: "title",
  multipart: true,
  statuses: ["Live", "Off"],
  statusOf: (row) => {
    const now = new Date().toISOString();
    const live =
      Boolean(row.is_active) &&
      (!row.start_at || String(row.start_at) <= now) &&
      (!row.end_at || String(row.end_at) >= now);
    return live ? "Live" : "Off";
  },
  listColumns: [
    { key: "title", label: "Popup" },
    { key: "image", label: "Image", kind: "file-link" },
    { key: "frequency_display", label: "Shows" },
    { key: "start_at", label: "Starts", kind: "date" },
    { key: "end_at", label: "Ends", kind: "date" },
    { key: "status", label: "Status", kind: "status" },
  ],
  fields: [
    { key: "title", label: "Name", type: "text", required: true, hint: "Internal name, also used as the image description" },
    { key: "image", label: "Square image", type: "image", hint: "Square, 1080 x 1080 recommended. Required." },
    { key: "link_url", label: "Link", type: "text", hint: "Optional: /contact, /events/some-fair or a full https:// address" },
    { key: "start_at", label: "Start date", type: "date", hint: "Leave empty to start immediately" },
    { key: "end_at", label: "End date", type: "date", hint: "Leave empty to run until switched off" },
    { key: "delay_seconds", label: "Show after (seconds)", type: "number", defaultValue: 3 },
    {
      key: "frequency",
      label: "How often",
      type: "select",
      defaultValue: "session",
      options: [
        { value: "session", label: "Once per visit" },
        { value: "daily", label: "Once a day" },
        { value: "always", label: "Every page load" },
      ],
    },
    {
      key: "show_on",
      label: "Where",
      type: "select",
      defaultValue: "all",
      options: [
        { value: "all", label: "Every page" },
        { value: "home", label: "Home page only" },
      ],
    },
    { key: "open_in_new_tab", label: "Open link in a new tab", type: "boolean" },
    { key: "is_active", label: "Active", type: "boolean", defaultValue: true },
  ],
};
