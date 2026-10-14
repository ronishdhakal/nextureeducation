import { TestPrepExplorer } from "@/components/sections/Explorers";
import { ConsultationButton } from "@/components/ui/ConsultationProvider";
import { CallToActionCard, PageHero, WRAP } from "@/components/ui/blocks";
import { getTestPreps } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Test Prep: IELTS, PTE & Duolingo",
  description:
    "Expert guidance and structured preparation for IELTS, PTE and Duolingo, built around the score your target universities require.",
  path: "/classes",
});

export default async function TestPrepPage() {
  const testPreps = await getTestPreps();

  return (
    <>
      <PageHero
        eyebrow="Test Prep"
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
