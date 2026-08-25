import Link from "next/link";

import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Section";
import { ServiceIcon } from "@/lib/icons";
import type { Service, TestPrep } from "@/lib/types";

const ACCENTS = ["text-violet bg-violet-pale", "text-[#8a5c00] bg-amber/20", "text-[#0d7a63] bg-mint/15"];

export function ServicesAndTestPrep({
  services,
  testPreps,
}: {
  services: Service[];
  testPreps: TestPrep[];
}) {
  return (
    <div className="flex flex-col gap-20">
      <div>
        <SectionHeading
          eyebrow="What we actually do"
          title="Six services. Zero upsells."
          subcopy="Every service exists because a real step in the process needed it — not because it sounded good on a brochure."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const accent = ACCENTS[i % ACCENTS.length];
            return (
              <Reveal key={service.id} delay={i * 60}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group flex flex-col gap-4 h-full rounded-2xl border border-hairline bg-paper p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_-20px_rgba(23,11,34,0.25)]"
                >
                  <span
                    className={`inline-flex size-11 items-center justify-center rounded-xl ${accent}`}
                  >
                    <ServiceIcon name={service.icon} className="size-5" />
                  </span>
                  <h3 className="font-display font-bold text-lg text-ink">{service.title}</h3>
                  <p className="text-sm text-ink/60 leading-relaxed flex-1">
                    {service.short_description}
                  </p>
                  <span className="text-sm font-semibold text-violet-deep inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    Learn more <span aria-hidden>→</span>
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>

      {testPreps.length ? (
        <div>
          <SectionHeading
            eyebrow="Test prep"
            title="IELTS, PTE & SAT — taught for your target score."
            subcopy="Not generic classes. Batches built around the band score or score range your shortlist actually needs."
          />

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {testPreps.map((tp) => (
              <Link
                key={tp.id}
                href="/test-prep"
                className="rounded-2xl border border-hairline bg-paper-2 p-6 transition-colors hover:border-violet/40"
              >
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-violet-deep mb-2">
                  {tp.name}
                </p>
                <p className="text-sm text-ink/65 leading-relaxed">{tp.description}</p>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
