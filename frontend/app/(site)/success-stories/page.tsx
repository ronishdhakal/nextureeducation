import { FinalCTA } from "@/components/sections/FinalCTA";
import { PageHeader } from "@/components/sections/PageHeader";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { Section } from "@/components/ui/Section";
import { getDestinations, getTestimonials } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Student Success Stories",
  description:
    "Read real stories from Nepali students who studied abroad with Nexture Education, the study abroad consultancy in Bagbazar, Kathmandu, in their own words.",
  path: "/success-stories",
});

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
        subcopy="No actors, no stock photos. Just people who sat across the table from us and made it abroad."
      />

      <Section tone="paper">
        {testimonials.length ? (
          <TestimonialsSection testimonials={testimonials} showHeading={false} />
        ) : (
          <div className=" border border-hairline p-10 text-center text-ink/60 rounded-box">
            We&apos;re gathering student stories. Check back soon, or ask us directly during
            your session.
          </div>
        )}
      </Section>

      <FinalCTA destinations={destinations} />
    </>
  );
}
