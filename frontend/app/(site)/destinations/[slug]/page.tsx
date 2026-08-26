import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/JsonLd";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { PageHeader } from "@/components/sections/PageHeader";
import { InquiryForm } from "@/components/ui/InquiryForm";
import { Reveal } from "@/components/ui/Reveal";
import { RichText } from "@/components/ui/RichText";
import { Section, SectionHeading } from "@/components/ui/Section";
import { UniversityCard } from "@/components/ui/UniversityCard";
import { getDestination, getDestinations, getUniversities } from "@/lib/api";
import { getFlagSrc } from "@/lib/destinationFlags";
import { buildMetadata } from "@/lib/seo";
import { stripHtml } from "@/lib/text";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nexture.edu.np";
const CURRENT_YEAR = new Date().getFullYear();

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const destination = await getDestination(slug);
  if (!destination) return {};
  return buildMetadata({
    title: destination.meta_title || `Study in ${destination.name} from Nepal ${CURRENT_YEAR}`,
    description:
      destination.meta_description ||
      `A straight guide to studying in ${destination.name} from Nepal in ${CURRENT_YEAR} — real costs, intakes, and the visa process, from Nexture Education in Bagbazar, Kathmandu.`,
    path: `/destinations/${destination.slug}`,
  });
}

export default async function DestinationDetailPage({ params }: Props) {
  const { slug } = await params;
  const [destination, allDestinations] = await Promise.all([
    getDestination(slug),
    getDestinations(),
  ]);

  if (!destination) notFound();

  const universities = await getUniversities(destination.id);
  const flag = getFlagSrc(destination.slug);
  const name = destination.name;

  const FAQ_BLOCKS: {
    key: "cost_overview" | "intake_overview" | "visa_overview" | "eligibility_overview";
    question: string;
  }[] = [
    { key: "eligibility_overview", question: `Am I eligible to study in ${name} from Nepal?` },
    { key: "cost_overview", question: `How much does it cost to study in ${name} from Nepal?` },
    { key: "intake_overview", question: `When can I start? What are the ${name} intakes?` },
    { key: "visa_overview", question: `What's the student visa process for ${name}?` },
  ];
  const answeredBlocks = FAQ_BLOCKS.filter((b) => destination[b.key]);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "Destinations", item: `${SITE_URL}/destinations` },
            {
              "@type": "ListItem",
              position: 3,
              name: destination.name,
              item: `${SITE_URL}/destinations/${destination.slug}`,
            },
          ],
        }}
      />
      {answeredBlocks.length ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: answeredBlocks.map((b) => ({
              "@type": "Question",
              name: b.question,
              acceptedAnswer: { "@type": "Answer", text: stripHtml(destination[b.key] || "") },
            })),
          }}
        />
      ) : null}

      <PageHeader
        eyebrow={`${CURRENT_YEAR} intake guide`}
        title={`Study in ${name} from Nepal`}
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
            <p className="text-ink/70 leading-relaxed text-lg -mt-4">
              Every year, Nepali students choose {name} for what it actually offers — not just
              the brochure version. Here&apos;s what studying in {name} from Nepal involves in{" "}
              {CURRENT_YEAR}: real costs, intake timing, and the visa process, in plain terms.
            </p>

            {answeredBlocks.map((block) => (
              <div key={block.key}>
                <h2 className="font-display font-bold text-xl text-ink mb-3">{block.question}</h2>
                <RichText html={destination[block.key] || ""} className="text-ink/70" />
              </div>
            ))}

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
                  Partner universities in {name}
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {universities.map((u, i) => (
                    <Reveal key={u.id} delay={i * 50}>
                      <UniversityCard university={u} />
                    </Reveal>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="lg:sticky lg:top-24 h-fit rounded-lg border border-hairline bg-paper-2 p-6 sm:p-7">
            <SectionHeading
              title={`Thinking about ${name}?`}
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
