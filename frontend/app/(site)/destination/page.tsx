import { DestinationsExplorer } from "@/components/sections/Explorers";
import { PageHero } from "@/components/ui/blocks";
import { getDestinations } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";

const CURRENT_YEAR = new Date().getFullYear();

export const metadata = buildMetadata({
  title: `Best Consultancy in Nepal for Study Abroad | Nexture`,
  absoluteTitle: true,
  description: `Compare study abroad destinations for Nepali students in ${CURRENT_YEAR}: universities, costs, intakes and visas, with Nexture Education in Bagbazar, Kathmandu.`,
  path: "/destination",
});

export default async function DestinationsPage() {
  const destinations = await getDestinations();

  return (
    <>
      <PageHero
        eyebrow="Best Consultancy in Nepal for Study Abroad"
        lead="Popular Study"
        accent="Destinations"
        upper
        subcopy="Explore top destinations for international education with detailed information about each country."
      />
      <DestinationsExplorer destinations={destinations} />
    </>
  );
}
