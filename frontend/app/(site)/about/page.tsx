import { Eye, Gem, Globe2, Handshake, Heart, Landmark, Target, Users, type LucideIcon } from "lucide-react";
import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";

import { Button } from "@/components/ui/Button";
import { ConsultationButton } from "@/components/ui/ConsultationProvider";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getSiteSettings, getTeamMembers, mediaUrl } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About Us",
  description:
    "Nexture Education is a trusted international education consultancy in Bagbazar, Kathmandu, helping Nepali students turn global aspirations into reality.",
  path: "/about",
});

const OFFICE_IMAGE = "/assets/about/office.jpg";
const hasOfficeImage = existsSync(path.join(process.cwd(), "public", OFFICE_IMAGE));

const WRAP = "mx-auto w-full max-w-6xl px-6 sm:px-8";

const CORE: { Icon: LucideIcon; title: string; text: string }[] = [
  {
    Icon: Target,
    title: "Our Mission",
    text: "To provide reliable and personalized study abroad consultancy, empowering students to achieve their global dreams.",
  },
  {
    Icon: Eye,
    title: "Our Vision",
    text: "To be a leading global education consultancy, known for our integrity, excellence, and student success.",
  },
  {
    Icon: Gem,
    title: "Our Values",
    text: "Integrity, commitment, excellence, student-centric approach, and global mindset.",
  },
  {
    Icon: Heart,
    title: "Our Promise",
    text: "We stand with you at every step, from choosing the right university to settling into your new country.",
  },
];

const MILESTONES = [
  { year: "2014", text: "Founded with a vision to bring global education to Nepal." },
  { year: "2016", text: "Reached 500+ student placements across 10 countries." },
  { year: "2018", text: "Expanded partnerships with top universities worldwide." },
  { year: "2020", text: "Launched online learning support during the global pandemic." },
  { year: "2022", text: "Achieved the 2,000+ student milestone and 98% success rate." },
  { year: "2024", text: "Celebrating 10 years of excellence in international education." },
];

export default async function AboutPage() {
  const [settings, team] = await Promise.all([getSiteSettings(), getTeamMembers()]);

  const stats: { Icon: LucideIcon; value: string; label: string }[] = [
    { Icon: Users, value: settings?.stat_students_placed || "", label: "Student Guided" },
    { Icon: Landmark, value: settings?.stat_partner_universities || "", label: "University Partners" },
    { Icon: Globe2, value: settings?.stat_countries || "", label: "Global Destinations" },
  ].filter((st) => st.value);

  return (
    <>
      <section className="bg-paper">
        <div className="mx-auto grid w-full max-w-6xl items-stretch md:grid-cols-2">
          <div className="flex flex-col justify-center gap-4 px-6 py-14 sm:px-8 md:py-20">
            <p className="text-xs font-medium text-violet-deep">About us</p>
            <h1 className="font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
              About <span className="text-violet-deep">Nexture Education</span>
            </h1>
            <p className="text-sm font-semibold text-ink">Your Dream. Our Guidance.</p>
            <p className="max-w-md text-sm leading-relaxed text-ink/70">
              Nexture Education is a trusted international education consultancy, dedicated to
              helping students turn their global aspirations into reality. We provide
              personalized guidance, expert counseling, and complete support throughout your
              international education journey.
            </p>
            <div className="pt-3">
              <ConsultationButton arrow>Book Consultation</ConsultationButton>
            </div>
          </div>
          <div className="relative min-h-64 bg-gradient-to-br from-violet-pale to-violet/30 md:min-h-[26rem]">
            {hasOfficeImage ? (
              <Image
                src={OFFICE_IMAGE}
                alt="The Nexture Education office in Bagbazar, Kathmandu"
                fill
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            ) : null}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-violet-tint">
        <Image
          src="/assets/home/background.png"
          alt=""
          width={577}
          height={433}
          className="pointer-events-none absolute bottom-0 right-0 hidden h-auto w-[46%] max-w-xl opacity-40 md:block"
        />
        <div className={`${WRAP} relative py-14 md:py-16`}>
          <div className="max-w-xl">
            <p className="text-xs font-medium uppercase tracking-[0.06em] text-violet-deep">
              Our Story
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold leading-tight text-ink sm:text-[1.75rem]">
              From Dreams to Global Opportunities
            </h2>
            <div className="mt-4 flex flex-col gap-4 text-sm leading-relaxed text-ink/70">
              <p>
                Nexture Education was founded with a simple belief: every student deserves the
                right guidance, reliable information, and complete support to achieve their
                international education goals.
              </p>
              <p>
                What started as a small team of passionate counselors has grown into a trusted
                consultancy, helping students across Nepal and beyond pursue higher education at
                top universities worldwide.
              </p>
              <p>
                We work closely with students and their families to understand their goals,
                provide personalized guidance, and make the study abroad journey simple and
                transparent.
              </p>
            </div>
            <dl className="mt-7 flex flex-wrap gap-x-8 gap-y-4">
              {stats.map(({ Icon, value, label }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <Icon className="size-5 text-violet-deep" strokeWidth={2} />
                  <div>
                    <dd className="text-sm font-semibold text-ink">{value}</dd>
                    <dt className="text-[11px] text-stone">{label}</dt>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="bg-paper">
        <div className={`${WRAP} py-14 md:py-16`}>
          <SectionHeader
            eyebrow="Our Core"
            title="Our Mission, Vision & Values"
            subcopy="Guided by purpose. Driven by your success."
          />
          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CORE.map(({ Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 60}>
                <div className="h-full border border-hairline bg-paper p-5 shadow-soft">
                  <span className="inline-flex size-8 items-center justify-center rounded-full bg-violet-pale text-violet-deep">
                    <Icon className="size-4" strokeWidth={2} />
                  </span>
                  <h3 className="mt-3 text-sm font-medium text-ink">{title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-ink/65">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {team.length ? (
        <section className="bg-paper">
          <div className={`${WRAP} pb-14 md:pb-16`}>
            <SectionHeader
              eyebrow="Our Team"
              title="Meet Our Expert Team"
              subcopy="Our experienced and dedicated team is here to guide you at every step of your study abroad journey."
            />
            <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((m, i) => {
                const photo = mediaUrl(m.photo);
                return (
                  <Reveal key={m.id} delay={i * 60}>
                    <div className="flex h-full flex-col items-center border border-hairline bg-paper p-5 text-center shadow-soft">
                      {photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={photo} alt={m.name} className="size-16 rounded-full object-cover" />
                      ) : (
                        <span className="flex size-16 items-center justify-center rounded-full bg-violet-pale text-lg font-semibold text-violet-deep">
                          {m.name[0]}
                        </span>
                      )}
                      <p className="mt-3 text-sm font-medium text-ink">{m.name}</p>
                      <p className="text-xs text-ink/80">{m.role}</p>
                      {m.bio ? (
                        <p className="mt-2 line-clamp-4 text-[11px] leading-relaxed text-ink/60">
                          {m.bio}
                        </p>
                      ) : null}
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-violet-tint">
        <div className={`${WRAP} py-14 md:py-16`}>
          <SectionHeader
            eyebrow="Our Journey"
            title="A Milestone-Filled Path"
            subcopy="From a vision to a trusted name, here's how we grew."
          />
          <ol className="mt-10 grid gap-8 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
            {MILESTONES.map((m, i) => (
              <Reveal key={m.year} delay={i * 60}>
                <li className="relative border-t-2 border-violet/25 pt-5">
                  <span className="absolute -top-[7px] left-0 size-3 rounded-full bg-violet" />
                  <p className="text-sm font-semibold text-violet-deep">{m.year}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-ink/65">{m.text}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-paper">
        <div className={`${WRAP} flex flex-col items-start gap-5 py-14 md:py-16`}>
          <p className="text-xs font-medium uppercase tracking-[0.06em] text-violet-deep">
            Let&apos;s get started
          </p>
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-[1.75rem]">
            Ready to Start Your Journey?
          </h2>
          <p className="max-w-lg text-sm leading-relaxed text-ink/65">
            Join thousands of successful students who have achieved their dreams with Nexture
            Education. Let&apos;s make your international education goals a reality.
          </p>
          <div className="flex flex-wrap gap-3">
            <ConsultationButton arrow>Book Consultation</ConsultationButton>
            <Button href="/contact" variant="ghost">
              <Handshake className="size-4" strokeWidth={2} /> Get In Touch
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
