import type { Metadata } from "next";

import { FinalCTA } from "@/components/sections/FinalCTA";
import { PageHeader } from "@/components/sections/PageHeader";
import { Section } from "@/components/ui/Section";
import { UniversityCard } from "@/components/ui/UniversityCard";
import { getDestinations, getUniversities } from "@/lib/api";

export const metadata: Metadata = {
  title: "Partner Universities",
  description: "Universities we work with across Australia, Canada, the UK, New Zealand, Malta and South Korea.",
};

export default async function UniversitiesPage() {
  const [universities, destinations] = await Promise.all([
    getUniversities(),
    getDestinations(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Universities"
        title="Our partner network."
        subcopy="Every university here is one we have an active working relationship with — not just a name on a list."
      />

      <Section tone="paper">
        {universities.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {universities.map((u) => (
              <UniversityCard key={u.id} university={u} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-hairline p-10 text-center text-ink/60">
            Our partner university list is being updated — get in touch and we&apos;ll match
            you directly.
          </div>
        )}
      </Section>

      <FinalCTA destinations={destinations} />
    </>
  );
}
