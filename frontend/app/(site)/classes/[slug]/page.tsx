import {
  ArrowRight,
  CalendarClock,
  Check,
  FileText,
  Monitor,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CourseStructureTabs } from "@/components/sections/CourseStructureTabs";
import {
  ConsultationAutoPrompt,
  ConsultationButton,
} from "@/components/ui/ConsultationProvider";
import { DetailHeading, DetailHero, Index, WRAP } from "@/components/ui/blocks";
import { RichText } from "@/components/ui/RichText";
import { getTestPrep, getTestPreps, mediaUrl } from "@/lib/api";
import { parseBlocks, parseLines, parseTitled } from "@/lib/lines";
import { buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const t = await getTestPrep(slug);
  if (!t) return {};
  return buildMetadata({
    title: t.meta_title || `${t.name} Preparation Classes in Kathmandu`,
    description:
      t.meta_description ||
      t.tagline ||
      `${t.name} preparation with expert trainers, mock tests and personalized guidance at Nexture Education, Bagbazar, Kathmandu.`,
    path: `/classes/${t.slug}`,
  });
}

export default async function ClassDetailPage({ params }: Props) {
  const { slug } = await params;
  const [test, all] = await Promise.all([getTestPrep(slug), getTestPreps()]);
  if (!test) notFound();

  const name = test.name;
  const highlights = parseLines(test.key_highlights);
  const why = parseTitled(test.why_choose_points);
  const structure = parseBlocks(test.course_structure);
  const related = all.filter((t) => t.id !== test.id).slice(0, 3);

  const facts: { Icon: LucideIcon; label: string; value: string }[] = [
    { Icon: CalendarClock, label: "Duration", value: test.duration || "" },
    { Icon: Monitor, label: "Class mode", value: test.class_mode || "" },
    { Icon: Users, label: "Batch size", value: test.batch_size || "" },
    { Icon: FileText, label: "Format", value: test.format_note || "" },
    { Icon: CalendarClock, label: "Schedule", value: test.schedule_note || "" },
    { Icon: Wallet, label: "Fees", value: test.fees_note || "" },
  ].filter((f) => f.value);

  return (
    <>
      <ConsultationAutoPrompt message={`I am interested in ${name} classes.`} />
      <DetailHero
        title={
          <>
            {name} <span className="text-violet-deep">Preparation</span>
          </>
        }
        summary={test.tagline || test.description}
        image={mediaUrl(test.hero_image)}
        imageAlt={`${name} preparation class`}
      >
        <ConsultationButton arrow message={`I would like to book a free demo class for ${name}.`}>
          Book a Free Demo Class
        </ConsultationButton>
      </DetailHero>

      <div className={`${WRAP} grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-14`}>
        <div className="flex min-w-0 flex-col gap-12">
          {test.about ? (
            <section>
              <DetailHeading large>About {name}</DetailHeading>
              <RichText html={test.about} className="max-w-3xl text-ink/75" />
            </section>
          ) : null}

          {highlights.length ? (
            <section>
              <DetailHeading large>{name} Key Highlights</DetailHeading>
              <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-sm text-ink/80">
                    <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-violet text-white">
                      <Check className="size-2.5" strokeWidth={3.5} />
                    </span>
                    {h}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {why.length ? (
            <section>
              <DetailHeading large>Why Choose Our {name} Course?</DetailHeading>
              <div className="grid gap-4 sm:grid-cols-2">
                {why.map((w, i) => (
                  <div key={w.title} className="border border-hairline border-t-2 border-t-brand bg-paper p-5">
                    <Index n={i + 1} />
                    <h3 className="mt-2 text-sm font-semibold text-ink">{w.title}</h3>
                    {w.detail ? (
                      <p className="mt-1.5 text-sm leading-relaxed text-ink/70">{w.detail}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {structure.length ? (
            <section>
              <DetailHeading large hint="Pick a section to see what the course covers.">
                {name} Course Structure
              </DetailHeading>
              <CourseStructureTabs blocks={structure} />
            </section>
          ) : null}

          {related.length ? (
            <section>
              <DetailHeading large>Related Courses</DetailHeading>
              <div className="grid gap-4 sm:grid-cols-3">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/classes/${r.slug}`}
                    className="group flex flex-col border border-hairline bg-paper p-5 shadow-soft transition-shadow hover:shadow-float"
                  >
                    <h3 className="text-sm font-semibold uppercase text-violet-dark">{r.name}</h3>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-ink/65">
                      {r.tagline || r.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-violet-deep">
                      Learn more
                      <ArrowRight
                        className="size-3.5 transition-transform group-hover:translate-x-0.5"
                        strokeWidth={2}
                      />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <aside className="h-fit lg:sticky lg:top-24">
          <div className="border border-hairline bg-paper shadow-float">
            <div className="border-b border-hairline bg-violet-tint px-5 py-4">
              <h2 className="font-display text-base font-semibold text-brand">Course Details</h2>
            </div>
            {facts.length ? (
              <dl className="divide-y divide-hairline">
                {facts.map(({ Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3 px-5 py-3.5">
                    <Icon className="mt-0.5 size-4 shrink-0 text-violet-deep" strokeWidth={2} />
                    <div>
                      <dt className="text-[11px] uppercase tracking-wide text-stone">{label}</dt>
                      <dd className="mt-0.5 text-sm text-ink">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="px-5 py-4 text-sm text-stone">Details coming soon.</p>
            )}
            <div className="border-t border-hairline p-5">
              <p className="text-sm font-medium text-ink">Not sure which test is right for you?</p>
              <p className="mt-1.5 text-xs leading-relaxed text-ink/65">
                Talk to our counsellors for guidance based on your goals, university requirements
                and target country.
              </p>
              <ConsultationButton
                arrow
                className="mt-4 w-full"
                message={`I have a question about the ${name} course.`}
              >
                Talk To Our Counsellors
              </ConsultationButton>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
