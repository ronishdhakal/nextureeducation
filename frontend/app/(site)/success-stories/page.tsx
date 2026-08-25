import type { Metadata } from "next";

import { FinalCTA } from "@/components/sections/FinalCTA";
import { PageHeader } from "@/components/sections/PageHeader";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { Section } from "@/components/ui/Section";
import { getDestinations, getTestimonials } from "@/lib/api";

export const metadata: Metadata = {
  title: "Success Stories",
  description: "Real notes from students Nexture Education has worked with, in their own words.",
};

export default async function SuccessStoriesPage() {
  const [testimonials, destinations] = await Promise.all([
    getTestimonials(),
    getDestinations(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Success Stories"
        title="Students who went through this exact process."
        subcopy="No actors, no stock photos — just people who sat across the table from us and made it abroad."
      />

      <Section tone="paper">
        {testimonials.length ? (
          <TestimonialsSection testimonials={testimonials} showHeading={false} />
        ) : (
          <div className="rounded-lg border border-hairline p-10 text-center text-ink/60">
            We&apos;re gathering student stories — check back soon, or ask us directly during
            your session.
          </div>
        )}
      </Section>

      <FinalCTA destinations={destinations} />
    </>
  );
}
