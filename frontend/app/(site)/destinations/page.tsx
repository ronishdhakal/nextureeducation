import type { Metadata } from "next";

import { FinalCTA } from "@/components/sections/FinalCTA";
import { PageHeader } from "@/components/sections/PageHeader";
import { DestinationCard } from "@/components/ui/DestinationCard";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { getDestinations } from "@/lib/api";

export const metadata: Metadata = {
  title: "Destinations",
  description:
    "Six study destinations for Nepali students — Australia, Canada, the UK, New Zealand, Malta and South Korea — with real cost, intake and visa information.",
};

export default async function DestinationsPage() {
  const destinations = await getDestinations();

  return (
    <>
      <PageHeader
        eyebrow="Destinations"
        title="Six countries. Pick the one that fits your life, not just your grades."
        subcopy="Cost of living, intake seasons, visa requirements — the things that actually decide whether a move works."
      />

      <Section tone="paper">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((d, i) => (
            <Reveal key={d.id} delay={i * 60}>
              <DestinationCard destination={d} />
            </Reveal>
          ))}
        </div>
        {!destinations.length ? (
          <p className="text-ink/60">
            Destinations will appear here once they&apos;re added in the admin panel.
          </p>
        ) : null}
      </Section>

      <FinalCTA destinations={destinations} />
    </>
  );
}
