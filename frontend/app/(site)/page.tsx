import type { Metadata } from "next";

import { JsonLd } from "@/components/JsonLd";
import { DestinationsCarousel } from "@/components/sections/DestinationsCarousel";
import { Hero } from "@/components/sections/Hero";
import {
  BestConsultancyBlock,
  BlogBlock,
  ContactBlock,
  HomeFaq,
  JourneySteps,
  ServicesBlock,
  StoriesBlock,
  TestPrepBlock,
} from "@/components/sections/HomeSections";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  getBlogPosts,
  getDestinations,
  getServices,
  getSiteSettings,
  getTestPreps,
  getTestimonials,
} from "@/lib/api";
import { buildHomeFaq, joinNames } from "@/lib/faq";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const destinations = await getDestinations();
  const names = destinations.slice(0, 3).map((d) => d.name);
  const where = names.length ? ` for ${joinNames(names)}` : " for studying abroad";
  return buildMetadata({
    title: "Best Consultancy in Bagbazar, Nepal | Nexture Education",
    absoluteTitle: true,
    description: `Best consultancy in Bagbazar, Nepal${where}: free counselling, university selection, visa help and IELTS/PTE classes at Nexture Education.`,
    path: "/",
  });
}

export default async function Home() {
  const [settings, destinations, services, testPreps, testimonials, posts] = await Promise.all([
    getSiteSettings(),
    getDestinations(),
    getServices(),
    getTestPreps(),
    getTestimonials(),
    getBlogPosts(),
  ]);

  const faq = buildHomeFaq(destinations);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }}
      />
      <Hero settings={settings} />

      <section className="bg-paper" id="destinations">
        <div className="mx-auto w-full max-w-6xl px-6 pb-11 pt-11 sm:px-8 md:pb-16 md:pt-14">
          <SectionHeader
            eyebrow="Popular Destinations"
            title="Explore Your Dream Destination"
            subcopy="From world-class education to vibrant cultures, discover the best countries for your academic and career goals."
            linkLabel="View all Destinations"
            linkHref="/destination"
          />
          <Reveal className="mt-9 md:px-0">
            <DestinationsCarousel destinations={destinations} />
          </Reveal>
        </div>
      </section>

      <ServicesBlock services={services} />
      <JourneySteps />
      <BestConsultancyBlock destinations={destinations} />
      <TestPrepBlock testPreps={testPreps} />
      <StoriesBlock testimonials={testimonials} />
      <HomeFaq items={faq} />
      <ContactBlock destinations={destinations} />
      <BlogBlock posts={posts} />
    </>
  );
}
