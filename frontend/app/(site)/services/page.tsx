import { FinalCTA } from "@/components/sections/FinalCTA";
import { PageHeader } from "@/components/sections/PageHeader";
import { ServicesAndTestPrep } from "@/components/sections/ServicesAndTestPrep";
import { Section } from "@/components/ui/Section";
import { getDestinations, getServices, getTestPreps } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Services",
  description:
    "Counseling, university matching, application support, visa support, scholarship guidance and pre-departure orientation — every step of studying abroad, in one place.",
  path: "/services",
});

export default async function ServicesPage() {
  const [services, testPreps, destinations] = await Promise.all([
    getServices(),
    getTestPreps(),
    getDestinations(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Everything between deciding and departing."
        subcopy="Six services, each one covering a step we've watched students get stuck on when they go it alone."
      />
      <Section tone="paper">
        <ServicesAndTestPrep services={services} testPreps={testPreps} />
      </Section>
      <FinalCTA destinations={destinations} />
    </>
  );
}
