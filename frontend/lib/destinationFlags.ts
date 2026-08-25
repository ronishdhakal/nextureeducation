// Flag SVGs live in /public/assets/destinations, named to match each
// Destination's slug. Kept as a static frontend asset (not backend media)
// since national flags don't change and don't need CMS management.
const FLAG_SLUGS = new Set([
  "australia",
  "canada",
  "malta",
  "new-zealand",
  "south-korea",
  "uk",
]);

export function getFlagSrc(slug: string): string | null {
  return FLAG_SLUGS.has(slug) ? `/assets/destinations/${slug}.svg` : null;
}
