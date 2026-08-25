import type { Metadata } from "next";

import { FinalCTA } from "@/components/sections/FinalCTA";
import { PageHeader } from "@/components/sections/PageHeader";
import { StatsBand } from "@/components/sections/StatsBand";
import { Section, SectionHeading } from "@/components/ui/Section";
import {
  getBranches,
  getDestinations,
  getSiteSettings,
  getTeamMembers,
  mediaUrl,
} from "@/lib/api";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why Nexture Education exists, how we work, and where to find us in Kathmandu.",
};

const VALUES = [
  {
    title: "We say no when the answer is no",
    detail:
      "If a university or country isn't a realistic fit for your grades or budget, we'll tell you before you spend a rupee on it — not after.",
  },
  {
    title: "One counselor, start to finish",
    detail: "You work with the same person from your first session to your visa decision, not a different desk at every stage.",
  },
  {
    title: "No commission-driven shortlists",
    detail: "Our university recommendations are matched to you first — partnerships come second.",
  },
];

export default async function AboutPage() {
  const [settings, branches, team, destinations] = await Promise.all([
    getSiteSettings(),
    getBranches(),
    getTeamMembers(),
    getDestinations(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="About Nexture"
        title="Your next step to a bright future."
        subcopy="We started Nexture Education because too many students were making a life-changing decision based on a sales pitch instead of straight information. We built the counseling process we wished existed."
      />

      <Section tone="paper">
        <SectionHeading eyebrow="How we work" title="Three things we don't compromise on." />
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {VALUES.map((v) => (
            <div key={v.title} className="rounded-lg border border-hairline bg-paper-2 p-6">
              <h3 className="font-display font-bold text-lg text-ink mb-2">{v.title}</h3>
              <p className="text-sm text-ink/65 leading-relaxed">{v.detail}</p>
            </div>
          ))}
        </div>
      </Section>

      <StatsBand settings={settings} />

      {team.length ? (
        <Section tone="tint">
          <SectionHeading eyebrow="The team" title="Who you'll actually talk to." />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => {
              const photo = mediaUrl(member.photo);
              return (
                <div key={member.id} className="text-center">
                  {photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photo}
                      alt={member.name}
                      className="size-24 mx-auto rounded-full object-cover border border-hairline"
                    />
                  ) : (
                    <div className="size-24 mx-auto rounded-full bg-violet-pale text-violet-deep font-display font-bold text-2xl flex items-center justify-center">
                      {member.name[0]}
                    </div>
                  )}
                  <p className="mt-4 font-display font-bold text-ink">{member.name}</p>
                  <p className="text-xs text-stone">{member.role}</p>
                </div>
              );
            })}
          </div>
        </Section>
      ) : null}

      {branches.length ? (
        <Section tone="paper">
          <SectionHeading eyebrow="Find us" title="Visit our office." />
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {branches.map((b) => (
              <div key={b.id} className="rounded-lg border border-hairline bg-paper-2 p-6">
                <p className="font-display font-bold text-ink">{b.name}</p>
                <p className="text-sm text-ink/65 mt-2 leading-relaxed">{b.address}</p>
                <p className="text-sm text-ink/65 mt-1">
                  {b.phone} {b.email ? `· ${b.email}` : ""}
                </p>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      <FinalCTA destinations={destinations} />
    </>
  );
}
