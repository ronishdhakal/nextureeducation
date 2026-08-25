import { FinalCTA } from "@/components/sections/FinalCTA";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { ServicesAndTestPrep } from "@/components/sections/ServicesAndTestPrep";
import { StatsBand } from "@/components/sections/StatsBand";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { DestinationCard } from "@/components/ui/DestinationCard";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeading } from "@/components/ui/Section";
import {
  getDestinations,
  getServices,
  getSiteSettings,
  getTestPreps,
  getTestimonials,
} from "@/lib/api";

export default async function Home() {
  const [settings, destinations, services, testPreps, testimonials] = await Promise.all([
    getSiteSettings(),
    getDestinations(),
    getServices(),
    getTestPreps(),
    getTestimonials(),
  ]);

  return (
    <>
      <Hero settings={settings} destinationCount={destinations.length} />

      <Section tone="paper" id="destinations">
        <SectionHeading
          eyebrow="Where you can go"
          title="Seven countries. One honest shortlist."
          subcopy="Every destination page has real numbers — cost, intakes, visa process — not just a photo of a campus."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((d, i) => (
            <Reveal key={d.id} delay={i * 60}>
              <DestinationCard destination={d} index={i} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="tint">
        <HowItWorks />
      </Section>

      <Section tone="paper">
        <ServicesAndTestPrep services={services} testPreps={testPreps} />
      </Section>

      <StatsBand settings={settings} />

      {testimonials.length ? (
        <Section tone="tint">
          <TestimonialsSection testimonials={testimonials} />
        </Section>
      ) : null}

      <FinalCTA destinations={destinations} />
    </>
  );
}
