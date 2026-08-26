import { JsonLd } from "@/components/JsonLd";
import { FAQSection } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Manifesto } from "@/components/sections/Manifesto";
import { ServicesAndTestPrep } from "@/components/sections/ServicesAndTestPrep";
import { StatsBand } from "@/components/sections/StatsBand";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { WhyLocal } from "@/components/sections/WhyLocal";
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
import { FAQ_ITEMS } from "@/lib/faq";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Best Consultancy in Bagbazar, Kathmandu, Nepal",
  description:
    "Nexture Education is the best consultancy in Bagbazar, Kathmandu, Nepal for studying abroad — counseling, university selection, visa support and test prep for Australia, Canada, the UK, New Zealand, Malta and South Korea.",
  path: "/",
});

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
          title="Six countries. One honest shortlist."
          subcopy="Every destination page has real numbers — cost, intakes, visa process — not just a photo of a campus."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((d, i) => (
            <Reveal key={d.id} delay={i * 60}>
              <DestinationCard destination={d} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="tint">
        <HowItWorks />
      </Section>

      <Manifesto />

      <Section tone="paper">
        <WhyLocal settings={settings} />
      </Section>

      <Section tone="tint">
        <ServicesAndTestPrep services={services} testPreps={testPreps} />
      </Section>

      <StatsBand settings={settings} />

      {testimonials.length ? (
        <Section tone="paper">
          <TestimonialsSection testimonials={testimonials} />
        </Section>
      ) : null}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ_ITEMS.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }}
      />
      <Section tone={testimonials.length ? "tint" : "paper"}>
        <FAQSection />
      </Section>

      <FinalCTA destinations={destinations} />
    </>
  );
}
