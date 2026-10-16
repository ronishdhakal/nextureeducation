import { CalendarDays } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/JsonLd";
import {
  ConsultationAutoPrompt,
  ConsultationButton,
} from "@/components/ui/ConsultationProvider";
import { Chip, DetailHeading, DetailHero, Index, WRAP } from "@/components/ui/blocks";
import { RichText } from "@/components/ui/RichText";
import { getDestination, getUniversities, mediaUrl } from "@/lib/api";
import { parseLines } from "@/lib/lines";
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
      `A straight guide to studying in ${destination.name} from Nepal in ${CURRENT_YEAR}: real costs, intakes, and the visa process, from Nexture Education in Bagbazar, Kathmandu.`,
    path: `/destination/${destination.slug}`,
  });
}

const JOURNEY = [
  { title: "Consultation", detail: "Discuss your goals and choose the right course." },
  { title: "University Selection", detail: "Get personalized university options." },
  { title: "Application", detail: "Submit your documents and application." },
  { title: "Visa Process", detail: "Receive your visa and prepare for travel." },
  { title: "Pre-Departure Support", detail: "Get ready for your new journey." },
];

type RichKey =
  | "eligibility_overview"
  | "intake_overview"
  | "cost_overview"
  | "visa_overview"
  | "documents_overview"
  | "scholarships_overview"
  | "popular_courses_overview"
  | "additional_info";

export default async function DestinationDetailPage({ params }: Props) {
  const { slug } = await params;
  const destination = await getDestination(slug);
  if (!destination) notFound();

  const universities = await getUniversities(destination.id);
  const name = destination.name;

  const whyChoose = parseLines(destination.why_choose_points);
  const highlights = parseLines(destination.key_highlights);
  const areas = parseLines(destination.study_areas);

  const sections: { key: RichKey; title: string; hint?: string; question: string }[] = [
    {
      key: "eligibility_overview",
      title: `Admission Requirements for ${name}`,
      hint: "Requirements may vary by university and level of study, but generally include:",
      question: `Am I eligible to study in ${name} from Nepal?`,
    },
    {
      key: "intake_overview",
      title: `${name} Intakes`,
      question: `When can I start? What are the ${name} intakes?`,
    },
    { key: "cost_overview", title: `Cost of Studying in ${name}`, question: `How much does it cost to study in ${name} from Nepal?` },
    { key: "visa_overview", title: `${name} Student Visa Process`, question: `What's the student visa process for ${name}?` },
    { key: "documents_overview", title: `Documents Required for ${name}`, question: `What documents do I need to apply to ${name}?` },
    { key: "scholarships_overview", title: `Scholarships in ${name}`, question: `Are there scholarships to study in ${name}?` },
    { key: "popular_courses_overview", title: `Popular Courses in ${name}`, question: `What can I study in ${name}?` },
    { key: "additional_info", title: `Good to Know About ${name}`, question: "" },
  ];
  const filled = sections.filter((s) => destination[s.key]);
  const faq = filled.filter((s) => s.question);

  const updated = destination.updated_at
    ? new Date(destination.updated_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "Study Abroad", item: `${SITE_URL}/destination` },
            { "@type": "ListItem", position: 3, name, item: `${SITE_URL}/destination/${destination.slug}` },
          ],
        }}
      />
      {faq.length ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.map((s) => ({
              "@type": "Question",
              name: s.question,
              acceptedAnswer: { "@type": "Answer", text: stripHtml(destination[s.key] || "") },
            })),
          }}
        />
      ) : null}

      <ConsultationAutoPrompt
        destinationId={destination.id}
        message={`I am interested in studying in ${name}.`}
      />
      <DetailHero
        title={
          <>
            Study in <span className="text-violet-deep">{name}</span>
          </>
        }
        summary={destination.summary}
        image={mediaUrl(destination.hero_image)}
        imageAlt={`Studying in ${name}`}
      >
        <ConsultationButton
          arrow
          destinationId={destination.id}
          message={`I would like guidance on studying in ${name}.`}
        >
          Free Consultation
        </ConsultationButton>
        {updated ? (
          <span className="inline-flex items-center gap-1.5 border border-hairline bg-paper px-2.5 py-1 text-[11px] text-ink/70 rounded-md">
            <CalendarDays className="size-3 text-violet-deep" />
            {updated}
          </span>
        ) : null}
      </DetailHero>

      <div className={`${WRAP} flex flex-col gap-12 py-12`}>
        {destination.why_study_overview ? (
          <section>
            <DetailHeading large>Why Study in {name}?</DetailHeading>
            <RichText html={destination.why_study_overview} className="max-w-3xl text-ink/75" />
          </section>
        ) : null}

        {whyChoose.length ? (
          <section>
            <DetailHeading large>Why Choose {name}?</DetailHeading>
            <div className="flex flex-wrap gap-3">
              {whyChoose.map((w) => (
                <Chip key={w} label={w} />
              ))}
            </div>
          </section>
        ) : null}

        {highlights.length ? (
          <section>
            <DetailHeading large>Key Highlights</DetailHeading>
            <div className="grid gap-4 sm:grid-cols-3">
              {highlights.map((h, i) => (
                <div key={h} className="border border-hairline border-t-2 border-t-brand bg-paper p-4 rounded-box">
                  <Index n={i + 1} />
                  <p className="mt-2 text-sm leading-snug text-ink/80">{h}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {areas.length ? (
          <section>
            <DetailHeading large hint="Choose from a wide range of fields and find the program for your goals.">
              Popular Study Areas
            </DetailHeading>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {areas.map((a) => (
                <Chip key={a} label={a} />
              ))}
            </div>
          </section>
        ) : null}

        {filled.map((s) => (
          <section key={s.key}>
            <DetailHeading large hint={s.hint}>{s.title}</DetailHeading>
            <RichText html={destination[s.key] || ""} className="rich-checks max-w-3xl text-ink/75" />
          </section>
        ))}

        <section>
          <DetailHeading large hint="From consultation to arrival, we're with you at every step.">
            Your Application Journey
          </DetailHeading>
          <ol className="grid gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {JOURNEY.map((step, i) => (
              <li key={step.title}>
                <span className="flex size-6 items-center justify-center rounded-full bg-violet text-xs font-semibold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-2 text-xs font-semibold text-ink">{step.title}</h3>
                <p className="mt-1 text-[11px] leading-relaxed text-ink/65">{step.detail}</p>
              </li>
            ))}
          </ol>
        </section>

        {universities.length ? (
          <section>
            <div className="flex items-end justify-between gap-4">
              <DetailHeading large hint={`Explore some of the most popular universities among Nepali students.`}>
                Top Universities in {name}
              </DetailHeading>
              <Link href="/universities" className="mb-4 hidden text-xs text-violet-deep sm:block">
                View all universities →
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {universities.map((u) => {
                const cover = mediaUrl(u.cover_image);
                const logo = mediaUrl(u.logo);
                const href = u.external_link || "/universities";
                return (
                  <a
                    key={u.id}
                    href={href}
                    target={u.external_link ? "_blank" : undefined}
                    rel={u.external_link ? "noopener noreferrer" : undefined}
                    className="group overflow-hidden border border-hairline bg-paper shadow-float transition-transform hover:-translate-y-1 rounded-box"
                  >
                    <div className="h-32 bg-gradient-to-br from-violet-pale to-violet/30">
                      {cover ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={cover} alt="" loading="lazy" className="size-full object-cover" />
                      ) : null}
                    </div>
                    <div className="bg-violet-pale/60 p-3.5">
                      <div className="flex items-center gap-2.5">
                        {logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={logo} alt="" className="size-7  object-contain" />
                        ) : null}
                        <div className="min-w-0">
                          <p className="text-sm font-medium leading-tight text-violet-dark">{u.name}</p>
                          {u.city ? <p className="text-[11px] text-ink/60">{u.city}</p> : null}
                        </div>
                      </div>
                      <p className="mt-2 text-right text-[10px] text-ink/60">View details →</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>
        ) : null}

        <section>
          <DetailHeading large>Still Have Questions?</DetailHeading>
          <p className="max-w-xl text-sm leading-relaxed text-ink/75">
            Get expert guidance on courses, universities, costs and visa process. We&apos;re here
            to help you make the right decision.
          </p>
          <div className="mt-5">
            <ConsultationButton
              arrow
              destinationId={destination.id}
              message={`I would like guidance on studying in ${name}.`}
            >
              Talk To Our Counsellors
            </ConsultationButton>
          </div>
        </section>
      </div>
    </>
  );
}
