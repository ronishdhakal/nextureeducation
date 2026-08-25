import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Section";
import { mediaUrl } from "@/lib/api";
import type { Testimonial } from "@/lib/types";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function TestimonialsSection({
  testimonials,
  showHeading = true,
}: {
  testimonials: Testimonial[];
  showHeading?: boolean;
}) {
  if (!testimonials.length) return null;

  return (
    <div>
      {showHeading ? (
        <SectionHeading
          eyebrow="Student stories"
          title="They didn't just get a visa. They picked the right one."
          subcopy="A few notes from students we've worked with, in their own words."
        />
      ) : null}

      <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${showHeading ? "mt-14" : ""}`}>
        {testimonials.map((t, i) => {
          const photo = mediaUrl(t.photo);
          return (
            <Reveal key={t.id} delay={i * 70}>
              <div
                className={`relative h-full rounded-2xl bg-paper border border-hairline p-6 shadow-[0_16px_36px_-20px_rgba(23,11,34,0.25)] ${
                  i % 2 === 0 ? "-rotate-1" : "rotate-1"
                } hover:rotate-0 transition-transform duration-300`}
              >
                <span
                  aria-hidden
                  className="absolute -top-2.5 -right-2.5 size-8 rounded-full bg-amber flex items-center justify-center text-ink text-xs font-mono font-bold rotate-6"
                >
                  ✓
                </span>
                <p className="text-ink/75 leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3">
                  {photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photo}
                      alt=""
                      className="size-10 rounded-full object-cover border border-hairline"
                    />
                  ) : (
                    <span className="size-10 rounded-full bg-violet-pale text-violet-deep font-mono text-sm font-bold flex items-center justify-center">
                      {initials(t.student_name)}
                    </span>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-ink">{t.student_name}</p>
                    <p className="text-xs text-stone">
                      {[t.university, t.destination_name].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
