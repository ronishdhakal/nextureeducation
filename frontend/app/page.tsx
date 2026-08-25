import { SiteHeader } from "@/components/sections/SiteHeader";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { Section } from "@/components/ui/Section";
import { BoardingPass } from "@/components/ui/BoardingPass";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Section tone="ink" className="pt-14 sm:pt-20 pb-24 sm:pb-32">
          <BoardingPass
            variant="hero"
            reference="NXT-0825"
            from={{ code: "KTM", city: "Kathmandu" }}
            to={{ code: "ABROAD", city: "7 countries" }}
            headline={
              <>
                Studying abroad, without the sales pitch.
              </>
            }
            subcopy="We help Nepali students get into the right university in Australia, Canada, the USA, the UK, New Zealand, Denmark and South Korea — and get the visa to go with it."
            stats={[
              { label: "Students placed", value: "1,200+" },
              { label: "Partner unis", value: "85+" },
              { label: "Visa success", value: "92%" },
              { label: "Countries", value: "07" },
            ]}
            cta={{ label: "Book a free session", href: "/contact" }}
          />
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
