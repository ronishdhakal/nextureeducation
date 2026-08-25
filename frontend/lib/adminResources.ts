export type FieldType =
  | "text"
  | "textarea"
  | "number"
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
  defaultValue?: unknown;
}

export interface ResourceConfig {
  resource: string;
  basePath: string;
  singularLabel: string;
  pluralLabel: string;
  description: string;
  fields: FieldConfig[];
  listColumns: { key: string; label: string }[];
  titleField: string;
}

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
    { key: "is_published", label: "Published" },
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
    { key: "long_description", label: "Long description", type: "textarea" },
    { key: "order", label: "Order", type: "number", defaultValue: 0 },
    { key: "is_published", label: "Published", type: "boolean", defaultValue: true },
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
    { key: "is_published", label: "Published" },
  ],
  fields: [
    { key: "name", label: "Name", type: "text", required: true },
    { key: "slug", label: "Slug", type: "text", hint: "Leave blank to auto-generate" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "format_note", label: "Format", type: "text" },
    { key: "schedule_note", label: "Schedule", type: "text" },
    { key: "fees_note", label: "Fees", type: "text" },
    { key: "order", label: "Order", type: "number", defaultValue: 0 },
    { key: "is_published", label: "Published", type: "boolean", defaultValue: true },
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
  description: "Student stories shown on the homepage and /success-stories.",
  titleField: "student_name",
  listColumns: [
    { key: "student_name", label: "Student" },
    { key: "is_featured", label: "Featured" },
    { key: "is_published", label: "Published" },
  ],
  fields: [
    { key: "student_name", label: "Student name", type: "text", required: true },
    { key: "destination", label: "Destination", type: "destination-select" },
    { key: "university", label: "University", type: "text" },
    { key: "quote", label: "Quote", type: "textarea", required: true },
    { key: "year", label: "Year", type: "number" },
    { key: "order", label: "Order", type: "number", defaultValue: 0 },
    { key: "is_featured", label: "Featured", type: "boolean" },
    { key: "is_published", label: "Published", type: "boolean", defaultValue: true },
  ],
};
