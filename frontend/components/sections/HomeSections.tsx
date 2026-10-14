import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { InquiryForm } from "@/components/ui/InquiryForm";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { mediaUrl } from "@/lib/api";
import type { BlogPost, Destination, Service, Testimonial, TestPrep } from "@/lib/types";

const WRAP = "mx-auto w-full max-w-6xl px-6 sm:px-8";

const cardClass = " border border-hairline bg-paper p-5 shadow-soft";

export function ServicesBlock({ services }: { services: Service[] }) {
  return (
    <section className="bg-paper-2">
      <div className={`${WRAP} grid items-center gap-10 py-14 md:grid-cols-[0.9fr_1.1fr] md:py-16`}>
        <Reveal className="flex flex-col items-start gap-4">
          <SectionHeader
            eyebrow="Our Services"
            title="Your Journey, Guided Every Step Of The Way"
            subcopy="From choosing the right university to settling into your new destination, we provide personalized support throughout your study abroad journey."
          />
          <Button href="/services" arrow className="mt-2">
            View all services
          </Button>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2">
          {services.slice(0, 4).map((s, i) => (
            <Reveal key={s.id} delay={i * 60}>
              <Link
                href={`/services/${s.slug}`}
                className={`${cardClass} block h-full transition-shadow hover:shadow-float`}
              >
                <h3 className="text-base font-medium text-ink">{s.title}</h3>
                <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-ink/65">
                  {s.short_description}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  { title: "Free Counseling", detail: "We review your grades, budget and goals and tell you honestly what's realistic." },
  { title: "University Shortlist", detail: "A short, specific list of universities and courses matched to you." },
  { title: "Application & Offer", detail: "Documents, SOP and applications, prepared with you through to the offer letter." },
  { title: "Visa Preparation", detail: "Financial documents, mock interviews and a file built for your destination." },
  { title: "Pre-Departure", detail: "Accommodation, banking and travel guidance, sorted before you fly." },
];

export function JourneySteps() {
  return (
    <section className="bg-paper">
      <div className={`${WRAP} py-14 md:py-16`}>
        <SectionHeader eyebrow="Your Journey" title="A Simple Path To Your Global Future" />
        <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 70}>
              <li className="relative border-t-2 border-violet/25 pt-5">
                <span className="absolute -top-[7px] left-0 size-3 rounded-full bg-violet" />
                <p className="text-lg font-semibold text-violet-deep">0{i + 1}</p>
                <h3 className="mt-1 text-sm font-semibold text-ink">{step.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-ink/65">{step.detail}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function TestPrepBlock({ testPreps }: { testPreps: TestPrep[] }) {
  return (
    <section className="bg-paper-2">
      <div className={`${WRAP} grid items-center gap-10 py-14 md:grid-cols-[0.9fr_1.1fr] md:py-16`}>
        <Reveal className="flex flex-col items-start gap-4">
          <SectionHeader
            eyebrow="Test Preparation"
            title="Get Ready For Global Opportunities"
            subcopy="Prepare with expert training and practice tests for your dream university."
          />
          <Button href="/classes" arrow className="mt-2">
            View all courses
          </Button>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2">
          {testPreps.slice(0, 4).map((t, i) => (
            <Reveal key={t.id} delay={i * 60}>
              <div className={`${cardClass} flex h-full flex-col`}>
                <h3 className="text-base font-medium text-ink">{t.name}</h3>
                <p className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-ink/65">
                  {t.description}
                </p>
                <Link
                  href="/classes"
                  className="group mt-3 inline-flex items-center gap-1 text-xs font-medium text-violet-deep"
                >
                  Learn more
                  <ArrowRight
                    className="size-3.5 transition-transform group-hover:translate-x-0.5"
                    strokeWidth={2}
                  />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function StoriesBlock({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials.length) return null;
  return (
    <section className="bg-violet-tint">
      <div className={`${WRAP} py-14 md:py-16`}>
        <SectionHeader
          eyebrow="Student Success Stories"
          title="Real People. Real Dreams. Real Success."
          subcopy="Hear from our students who turned their dreams into reality with Nexture."
          linkLabel="View all stories"
          linkHref="/success-stories"
        />
        <div className="mt-9 grid gap-5 md:grid-cols-3">
          {testimonials.slice(0, 3).map((t, i) => {
            const photo = mediaUrl(t.photo);
            return (
              <Reveal key={t.id} delay={i * 70}>
                <figure className={`${cardClass} flex h-full flex-col`}>
                  <div className="flex items-center gap-3">
                    {photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={photo} alt={t.student_name} className="size-10 rounded-full object-cover" />
                    ) : (
                      <span className="flex size-10 items-center justify-center rounded-full bg-violet-pale text-xs font-semibold text-violet-deep">
                        {initials(t.student_name)}
                      </span>
                    )}
                    <figcaption>
                      <p className="text-sm font-medium text-ink">{t.student_name}</p>
                      {t.destination_name ? (
                        <p className="text-[11px] text-stone">Student in {t.destination_name}</p>
                      ) : null}
                    </figcaption>
                  </div>
                  <blockquote className="mt-4 line-clamp-4 flex-1 text-xs leading-relaxed text-ink/70">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <div className="mt-4 flex gap-0.5 text-violet" aria-label={`${t.rating ?? 5} out of 5 stars`}>
                    {Array.from({ length: t.rating ?? 5 }).map((_, n) => (
                      <Star key={n} className="size-3.5 fill-current" strokeWidth={0} />
                    ))}
                  </div>
                </figure>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ContactBlock({ destinations }: { destinations: Destination[] }) {
  const points = ["Personalized Counselling", "Quick Response", "Trusted By Thousands Of Students"];
  return (
    <section className="bg-violet-pale/50" id="get-in-touch">
      <div className={`${WRAP} grid items-center gap-10 py-14 md:grid-cols-[0.8fr_1.2fr] md:py-16`}>
        <div className="flex flex-col gap-4">
          <p className="text-xs font-medium uppercase tracking-[0.06em] text-violet-deep">
            Get In Touch
          </p>
          <h2 className="font-display text-2xl font-semibold leading-tight text-ink sm:text-[1.75rem]">
            Let&apos;s Plan Your Study Abroad Journey
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-ink/65">
            Have questions or need guidance? Fill out the form and our expert counsellors will
            get back to you as soon as possible.
          </p>
          <ul className="mt-2 flex flex-col gap-2.5 text-sm text-ink/70">
            {points.map((p) => (
              <li key={p} className="flex items-center gap-2.5">
                <span className="flex size-4 items-center justify-center rounded-full border border-violet text-violet">
                  <svg viewBox="0 0 12 12" className="size-2.5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2.5 6.5l2.2 2.2L9.5 3.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className=" border border-hairline bg-paper p-6 shadow-float sm:p-7">
          <InquiryForm destinations={destinations} sourcePage="/" />
        </div>
      </div>
    </section>
  );
}

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function BlogCard({ post }: { post: BlogPost }) {
  const cover = mediaUrl(post.cover_image);
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden border border-hairline bg-paper shadow-soft transition-shadow hover:shadow-float"
    >
      {cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={cover} alt="" loading="lazy" className="h-40 w-full object-cover" />
      ) : (
        <div className="flex h-40 w-full items-center justify-center bg-violet-pale text-2xl font-semibold text-violet-deep">
          N
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="text-base font-medium leading-snug text-ink transition-colors group-hover:text-violet-deep">
          {post.title}
        </h3>
        <p className="line-clamp-2 flex-1 text-xs leading-relaxed text-ink/65">{post.excerpt}</p>
        <div className="mt-2 flex items-center justify-between text-[11px]">
          <span className="text-stone">{formatDate(post.published_at)}</span>
          <span className="inline-flex items-center gap-1 text-violet-deep">
            Read more <ArrowRight className="size-3" strokeWidth={2} />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function BlogBlock({ posts }: { posts: BlogPost[] }) {
  if (!posts.length) return null;
  return (
    <section className="bg-paper">
      <div className={`${WRAP} py-14 md:py-16`}>
        <SectionHeader
          eyebrow="Our Blog"
          title="Latest From Our Blog"
          subcopy="Insights for your global journey."
          linkLabel="View all blogs"
          linkHref="/blog"
        />
        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 3).map((post, i) => (
            <Reveal key={post.id} delay={i * 70}>
              <BlogCard post={post} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
