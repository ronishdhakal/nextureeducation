import { TestPrepExplorer } from "@/components/sections/Explorers";
import { ConsultationButton } from "@/components/ui/ConsultationProvider";
import { CallToActionCard, PageHero, WRAP } from "@/components/ui/blocks";
import type { Metadata } from "next";

import { getTestPreps } from "@/lib/api";
import { joinNames } from "@/lib/faq";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const classes = await getTestPreps();
  const names = joinNames(classes.slice(0, 3).map((c) => c.name)) || "IELTS";
  return buildMetadata({
    title: `Best ${names.replace(" and ", ", ")} Classes in Bagbazar | Nexture`.slice(0, 70),
    absoluteTitle: true,
    description: `Best ${names} classes in Bagbazar, Kathmandu: expert trainers, mock tests and a free demo class at Nexture Education. Book your seat today.`,
    path: "/classes",
  });
}

export default async function TestPrepPage() {
  const testPreps = await getTestPreps();
  const names = joinNames(testPreps.slice(0, 3).map((c) => c.name)) || "IELTS";

  return (
    <>
      <PageHero
        eyebrow={`Best ${names} Classes in Bagbazar, Kathmandu`}
        lead="Prepare for a Better"
        accent="Tomorrow"
        subcopy="Get expert guidance and structured preparation for IELTS, PTE and Duolingo, and take the next step towards your global education journey."
      />
      <TestPrepExplorer testPreps={testPreps} />
      <section className="bg-violet-tint pb-16">
        <div className={WRAP}>
          <CallToActionCard
            title="Not sure which test is right for you?"
            text="Talk to our expert counsellors and get personalized guidance based on your goals, university requirements and target country."
          >
            <ConsultationButton arrow message="I need help choosing the right test and class.">
              Talk To Our Counsellors
            </ConsultationButton>
          </CallToActionCard>
        </div>
      </section>
    </>
  );
}
