import { DestinationsExplorer } from "@/components/sections/Explorers";
import { PageHero } from "@/components/ui/blocks";
import { getDestinations } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";

const CURRENT_YEAR = new Date().getFullYear();

export const metadata = buildMetadata({
  title: `Study Abroad from Nepal ${CURRENT_YEAR}: Destinations`,
  description: `Popular study abroad destinations for Nepali students in ${CURRENT_YEAR}, with detailed information about costs, intakes and visas for each country.`,
  path: "/destination",
});

export default async function DestinationsPage() {
  const destinations = await getDestinations();

  return (
    <>
      <PageHero
        eyebrow="Study Abroad"
        lead="Popular Study"
        accent="Destinations"
        upper
        subcopy="Explore top destinations for international education with detailed information about each country."
      />
      <DestinationsExplorer destinations={destinations} />
    </>
  );
}
