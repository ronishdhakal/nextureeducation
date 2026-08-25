import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FinalCTA } from "@/components/sections/FinalCTA";
import { PageHeader } from "@/components/sections/PageHeader";
import { InquiryForm } from "@/components/ui/InquiryForm";
import { RichText } from "@/components/ui/RichText";
import { Section, SectionHeading } from "@/components/ui/Section";
import { UniversityCard } from "@/components/ui/UniversityCard";
import { getDestination, getDestinations, getUniversities } from "@/lib/api";
import { getFlagSrc } from "@/lib/destinationFlags";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const destination = await getDestination(slug);
  if (!destination) return {};
  return {
    title: destination.meta_title || `Study in ${destination.name}`,
    description: destination.meta_description || destination.summary,
  };
}

const INFO_BLOCKS: { key: "cost_overview" | "intake_overview" | "visa_overview"; label: string }[] = [
  { key: "cost_overview", label: "Cost of living & tuition" },
  { key: "intake_overview", label: "Intakes" },
  { key: "visa_overview", label: "Visa process" },
];

export default async function DestinationDetailPage({ params }: Props) {
  const { slug } = await params;
  const [destination, allDestinations] = await Promise.all([
    getDestination(slug),
    getDestinations(),
  ]);

  if (!destination) notFound();

  const universities = await getUniversities(destination.id);
  const flag = getFlagSrc(destination.slug);

  return (
    <>
      <PageHeader
        eyebrow={`Study in ${destination.country_code || destination.name}`}
        title={destination.name}
        subcopy={destination.summary}
      >
        {flag ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={flag}
            alt=""
            className="mt-6 h-8 w-12 rounded-sm object-cover border border-hairline"
          />
        ) : null}
      </PageHeader>

      <Section tone="paper">
        <div className="grid lg:grid-cols-[1fr_0.7fr] gap-16">
          <div className="flex flex-col gap-12">
            {INFO_BLOCKS.map((block) => {
              const value = destination[block.key];
              if (!value) return null;
              return (
                <div key={block.key}>
                  <h2 className="font-display font-bold text-xl text-ink mb-3">{block.label}</h2>
                  <RichText html={value} className="text-ink/70" />
                </div>
              );
            })}

            {destination.popular_intakes ? (
              <div className="flex items-center gap-3 rounded-lg bg-violet-pale px-5 py-4 w-fit">
                <span className="text-xs font-semibold uppercase tracking-wide text-violet-deep">
                  Popular intakes
                </span>
                <span className="text-sm text-violet-deep font-semibold">
                  {destination.popular_intakes}
                </span>
              </div>
            ) : null}

            {universities.length ? (
              <div>
                <h2 className="font-display font-bold text-xl text-ink mb-4">
                  Partner universities in {destination.name}
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {universities.map((u) => (
                    <UniversityCard key={u.id} university={u} />
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="lg:sticky lg:top-24 h-fit rounded-lg border border-hairline bg-paper-2 p-6 sm:p-7">
            <SectionHeading
              title={`Thinking about ${destination.name}?`}
              subcopy="Tell us a bit about yourself — we'll call within one business day."
            />
            <div className="mt-6">
              <InquiryForm
                destinations={allDestinations}
                defaultDestinationId={destination.id}
                sourcePage={`/destinations/${destination.slug}`}
                variant="compact"
              />
            </div>
          </div>
        </div>
      </Section>

      <FinalCTA destinations={allDestinations} />
    </>
  );
}
