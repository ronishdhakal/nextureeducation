import { EventsExplorer } from "@/components/sections/Explorers";
import { PageHero } from "@/components/ui/blocks";
import { getEvents } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Upcoming Events: Education Fairs & Sessions",
  description:
    "Education fairs, university sessions and webinars from Nexture Education. Connect, learn and take the next step toward your global education journey.",
  path: "/events",
});

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <>
      <PageHero
        eyebrow="Education Fairs & Sessions in Kathmandu"
        lead="Upcoming"
        accent="Events"
        upper
        subcopy="Connect, learn and take the next step toward your global education journey."
      />
      <EventsExplorer events={events} />
    </>
  );
}
