import { DestinationsCarousel } from "@/components/sections/DestinationsCarousel";
import { Hero } from "@/components/sections/Hero";
import {
  BlogBlock,
  ContactBlock,
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
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Best Consultancy in Bagbazar, Kathmandu, Nepal",
  description:
    "Nexture Education is the best consultancy in Bagbazar, Kathmandu, Nepal for studying abroad. Counseling, university selection, visa support and test prep for Nepali students.",
  path: "/",
});

export default async function Home() {
  const [settings, destinations, services, testPreps, testimonials, posts] = await Promise.all([
    getSiteSettings(),
    getDestinations(),
    getServices(),
    getTestPreps(),
    getTestimonials(),
    getBlogPosts(),
  ]);

  return (
    <>
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
      <TestPrepBlock testPreps={testPreps} />
      <StoriesBlock testimonials={testimonials} />
      <ContactBlock destinations={destinations} />
      <BlogBlock posts={posts} />
    </>
  );
}
