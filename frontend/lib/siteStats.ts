/**
 * The four headline numbers shown under the home hero and on the About page.
 * Fixed in code on purpose: they do not depend on anything entered in the admin.
 * Change them here, in one place.
 */
export const SITE_STATS = {
  students: { value: "625+", label: "Students" },
  visa: { value: "95%", label: "Visa Rate" },
  universities: { value: "50+", label: "Universities" },
  destinations: { value: "5+", label: "Destinations" },
} as const;
