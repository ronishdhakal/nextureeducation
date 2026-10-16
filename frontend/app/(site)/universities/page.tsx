import { FinalCTA } from "@/components/sections/FinalCTA";
import { PageHeader } from "@/components/sections/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { UniversityCard } from "@/components/ui/UniversityCard";
import { getDestinations, getUniversities } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Partner Universities",
  description: "Universities we work with across Australia, Canada, the UK, New Zealand, Malta and South Korea.",
  path: "/universities",
});

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
        subcopy="Every university here is one we have an active working relationship with, not just a name on a list."
      />

      <Section tone="paper">
        {universities.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {universities.map((u, i) => (
              <Reveal key={u.id} delay={i * 50}>
                <UniversityCard university={u} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className=" border border-hairline p-10 text-center text-ink/60 rounded-box">
            Our partner university list is being updated. Get in touch and we&apos;ll match
            you directly.
          </div>
        )}
      </Section>

      <FinalCTA destinations={destinations} />
    </>
  );
}
