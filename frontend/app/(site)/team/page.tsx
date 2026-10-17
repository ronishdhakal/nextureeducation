import { JsonLd } from "@/components/JsonLd";
import { TeamGrid } from "@/components/sections/TeamGrid";
import { ConsultationButton } from "@/components/ui/ConsultationProvider";
import { CallToActionCard, PageHero, WRAP } from "@/components/ui/blocks";
import { getTeamMembers, mediaUrl } from "@/lib/api";
import { breadcrumbJsonLd, buildMetadata, SITE_URL } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Our Team: Counsellors in Bagbazar, Kathmandu | Nexture",
  absoluteTitle: true,
  description:
    "Meet the experienced counsellors and staff of Nexture Education in Bagbazar, Kathmandu, who guide Nepali students through university applications, visas and test prep.",
  path: "/team",
});

export default async function TeamPage() {
  const team = await getTeamMembers();

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Our Team", path: "/team" }])} />
      {team.length ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Nexture Education team",
            itemListElement: team.map((m, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "Person",
                name: m.name,
                jobTitle: m.role,
                description: m.bio || undefined,
                image: mediaUrl(m.photo) || undefined,
                worksFor: { "@type": "EducationalOrganization", name: "Nexture Education", url: SITE_URL },
                sameAs: [m.facebook_url, m.instagram_url, m.linkedin_url, m.x_url].filter(Boolean),
              },
            })),
          }}
        />
      ) : null}

      <PageHero
        eyebrow="Nexture Education Team in Bagbazar, Kathmandu"
        lead="Meet Our"
        accent="Expert Team"
        subcopy="Our experienced and dedicated team is here to guide you at every step of your study abroad journey."
      />

      <section className="bg-violet-tint pb-10">
        <div className={`${WRAP} pt-2`}>
          {team.length ? (
            <TeamGrid members={team} fullBio />
          ) : (
            <p className="py-12 text-center text-sm text-stone">
              Our team profiles will appear here soon.
            </p>
          )}
        </div>
      </section>

      <section className="bg-violet-tint pb-16">
        <div className={WRAP}>
          <CallToActionCard
            title="Want to talk to our team?"
            text="Book a free consultation and a counsellor will walk you through the countries, universities and visa steps that fit your goals."
          >
            <ConsultationButton arrow message="I would like to speak to a counsellor.">
              Book a Free Consultation
            </ConsultationButton>
          </CallToActionCard>
        </div>
      </section>
    </>
  );
}
