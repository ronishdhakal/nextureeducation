import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";

import { PageHeader } from "@/components/sections/PageHeader";
import { InquiryForm } from "@/components/ui/InquiryForm";
import { Section, SectionHeading } from "@/components/ui/Section";
import { getBranches, getDestinations, getSiteSettings } from "@/lib/api";

export const metadata: Metadata = {
  title: "Contact",
  description: "Book a free counseling session with Nexture Education in Bagbazar, Kathmandu.",
};

export default async function ContactPage() {
  const [settings, branches, destinations] = await Promise.all([
    getSiteSettings(),
    getBranches(),
    getDestinations(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let's talk about your next step."
        subcopy="Fill out the form, call us, or just walk in — whichever is easiest for you."
      />

      <Section tone="paper">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-16">
          <div className="flex flex-col gap-8">
            <div className="flex items-start gap-4">
              <span className="inline-flex size-11 items-center justify-center rounded-xl bg-violet-pale text-violet-deep shrink-0">
                <Phone className="size-5" strokeWidth={2.2} />
              </span>
              <div>
                <p className="font-display font-bold text-ink">Call or WhatsApp</p>
                <a
                  href={`tel:${(settings?.phone || "").replace(/\s/g, "")}`}
                  className="text-ink/65 hover:text-violet-deep transition-colors"
                >
                  {settings?.phone || "+977 98-0000-0000"}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="inline-flex size-11 items-center justify-center rounded-xl bg-violet-pale text-violet-deep shrink-0">
                <Mail className="size-5" strokeWidth={2.2} />
              </span>
              <div>
                <p className="font-display font-bold text-ink">Email</p>
                <a
                  href={`mailto:${settings?.email || "hello@nexture.edu.np"}`}
                  className="text-ink/65 hover:text-violet-deep transition-colors"
                >
                  {settings?.email || "hello@nexture.edu.np"}
                </a>
              </div>
            </div>

            {branches.map((b) => (
              <div key={b.id} className="flex items-start gap-4">
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-violet-pale text-violet-deep shrink-0">
                  <MapPin className="size-5" strokeWidth={2.2} />
                </span>
                <div>
                  <p className="font-display font-bold text-ink">{b.name}</p>
                  <p className="text-ink/65">{b.address}</p>
                  {b.map_link ? (
                    <a
                      href={b.map_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-violet-deep hover:underline"
                    >
                      Get directions →
                    </a>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-hairline bg-paper-2 p-6 sm:p-8">
            <SectionHeading
              title="Book a free session"
              subcopy="No obligation, no sales pressure — just a straight conversation about your options."
            />
            <div className="mt-8">
              <InquiryForm destinations={destinations} sourcePage="/contact" variant="full" />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
