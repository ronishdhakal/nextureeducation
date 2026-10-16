import { ArrowRight, Check, Star } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { InquiryForm } from "@/components/ui/InquiryForm";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { mediaUrl } from "@/lib/api";
import type { BlogPost, Destination, Service, Testimonial, TestPrep } from "@/lib/types";

const WRAP = "mx-auto w-full max-w-6xl px-6 sm:px-8";

/** White card with a soft shadow, as used across the Figma home page. */
const cardClass = "bg-white shadow-float rounded-box";

export function ServicesBlock({ services }: { services: Service[] }) {
  return (
    <section className="bg-paper-2">
      <div className={`${WRAP} grid items-center gap-8 py-11 md:grid-cols-[0.8fr_1.2fr] md:gap-14 md:py-20`}>
        <Reveal className="flex flex-col items-start gap-5">
          <SectionHeader
            eyebrow="Our Services"
            title="Your Journey, Guided Every Step Of The Way"
            subcopy="From choosing the right university to settling into your new destination, we provide personalized support throughout your study abroad journey."
          />
          <Button href="/services" size="lg" arrow className="mt-3">
            view all services
          </Button>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2">
          {services.slice(0, 4).map((s, i) => (
            <Reveal key={s.id} delay={i * 60}>
              <Link
                href={`/services/${s.slug}`}
                className={`${cardClass} block h-full p-6 transition-transform duration-300 hover:-translate-y-1`}
              >
                <h3 className="text-base font-normal text-ink sm:text-lg">{s.title}</h3>
                <p className="mt-3 line-clamp-3 text-[11px] leading-relaxed text-ink/70">
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
  { title: "Discover", detail: "Explore Your Options And Get Expert Advice." },
  { title: "Apply", detail: "Submit Your Application With Our Support." },
  { title: "Secure Visa", detail: "Complete Your Visa Process With Confidence." },
  { title: "Fly With Confidence", detail: "Start Your New Journey With Peace Of Mind." },
];

export function JourneySteps() {
  return (
    <section className="bg-paper">
      <div className={`${WRAP} py-11 md:py-20`}>
        <SectionHeader
          eyebrow="Your Journey"
          title="A Simple Path To Your Global Future"
          subcopy="We Make The Process Simple, Transparent And Stress-Free — So You Can Focus On Your Dreams."
        />
        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 70}>
              <li className={`${cardClass} h-full p-5`}>
                <span className="flex size-8 items-center justify-center rounded-full bg-violet text-sm font-semibold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-3 text-lg font-normal leading-snug text-ink">{step.title}</h3>
                <p className="mt-1 text-[11px] leading-relaxed text-ink/70">{step.detail}</p>
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
      <div className={`${WRAP} grid items-center gap-8 py-11 md:grid-cols-[1fr_1fr] md:gap-14 md:py-20`}>
        <Reveal className="flex flex-col items-start gap-5">
          <SectionHeader
            eyebrow="Test Preparation"
            title="Get Ready For Global Opportunities"
            subcopy="Prepare With Expert Training And Practice Tests For Your Dream University."
          />
          <Button href="/classes" size="lg" arrow className="mt-3">
            view all courses
          </Button>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2">
          {testPreps.slice(0, 4).map((t, i) => (
            <Reveal key={t.id} delay={i * 60}>
              <Link
                href={`/classes/${t.slug}`}
                className={`${cardClass} flex h-full flex-col p-5 transition-transform duration-300 hover:-translate-y-1`}
              >
                <h3 className="text-lg font-normal text-ink">{t.name}</h3>
                <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-ink/75">
                  {t.tagline || t.description}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs text-violet-deep">
                  Learn More <ArrowRight className="size-3.5" strokeWidth={1.8} />
                </span>
              </Link>
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
    <section className="bg-violet-pale/60">
      <div className={`${WRAP} py-11 md:py-20`}>
        <SectionHeader
          eyebrow="Student Success Stories"
          title="Real People. Real Dreams. Real Success."
          subcopy="Hear From Our Students Who Turned Their Dreams Into Reality With Nexture."
          linkLabel="View all stories"
          linkHref="/success-stories"
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3 lg:gap-14">
          {testimonials.slice(0, 3).map((t, i) => {
            const photo = mediaUrl(t.photo);
            return (
              <Reveal key={t.id} delay={i * 70}>
                <figure className={`${cardClass} flex h-full flex-col p-5`}>
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
                      <p className="text-[13px] font-medium leading-tight text-ink">{t.student_name}</p>
                      {t.destination_name ? (
                        <p className="text-[10px] text-ink/70">Student in {t.destination_name}</p>
                      ) : null}
                    </figcaption>
                  </div>
                  {t.headline ? (
                    <p className="mt-3 text-[15px] font-medium leading-snug text-violet-deep">
                      {t.headline}
                    </p>
                  ) : null}
                  <blockquote className="mt-1.5 line-clamp-4 flex-1 text-[11px] leading-relaxed text-ink/75">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <div className="mt-3 flex gap-0.5 text-violet" aria-label={`${t.rating ?? 5} out of 5 stars`}>
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
    <section className="bg-violet-tint" id="get-in-touch">
      <div className={`${WRAP} grid items-center gap-8 py-11 md:grid-cols-[0.8fr_1.2fr] md:gap-14 md:py-20`}>
        <div className="flex flex-col gap-4">
          <p className="text-xs font-medium uppercase tracking-[0.06em] text-violet-deep">
            Get In Touch
          </p>
          <h2 className="font-display text-2xl font-semibold leading-tight text-ink sm:text-[1.75rem]">
            Let&apos;s Plan Your Study Abroad Journey
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-ink/70">
            Have Questions Or Need Guidance? Fill Out The Form And Our Expert Counsellors Will Get
            Back To You As Soon As Possible.
          </p>
          <ul className="mt-3 flex flex-col gap-3 text-sm text-ink/75">
            {points.map((p) => (
              <li key={p} className="flex items-center gap-3">
                <span className="flex size-4 items-center justify-center rounded-full border border-violet text-violet">
                  <Check className="size-2.5" strokeWidth={3} />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className={`${cardClass} p-6 sm:p-8`}>
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
      className={`${cardClass} group flex h-full flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-1`}
    >
      {cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={cover} alt="" loading="lazy" className="h-32 w-full object-cover" />
      ) : (
        <div className="flex h-32 w-full items-center justify-center bg-violet-pale text-2xl font-semibold text-violet-deep">
          N
        </div>
      )}
      <div className="flex flex-1 flex-col px-5 pb-4 pt-4">
        <h3 className="text-lg font-normal leading-snug text-ink transition-colors group-hover:text-violet-deep">
          {post.title}
        </h3>
        <p className="mt-3 line-clamp-2 flex-1 text-[11px] leading-relaxed text-ink/70">{post.excerpt}</p>
        <div className="mt-5 flex items-center justify-between text-[11px]">
          <span className="text-ink/70">{formatDate(post.published_at)}</span>
          <span className="inline-flex items-center gap-1 text-violet-deep">
            Read More <ArrowRight className="size-3" strokeWidth={1.8} />
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
      <div className={`${WRAP} py-11 md:py-20`}>
        <SectionHeader
          eyebrow="Our Blog"
          title="Latest From Our Blog"
          titleClassName="uppercase"
          subcopy="Insights For Your Global Journey"
          linkLabel="View all Blogs"
          linkHref="/blog"
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
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
