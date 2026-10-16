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

      <div className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-3 ${showHeading ? "mt-12" : ""}`}>
        {testimonials.map((t, i) => {
          const photo = mediaUrl(t.photo);
          return (
            <Reveal key={t.id} delay={i * 60}>
              <div className="flex h-full flex-col border border-hairline bg-paper p-6 shadow-soft rounded-box">
                <p className="flex-1 leading-relaxed text-ink/75">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-5 flex items-center gap-3 border-t border-hairline pt-4">
                  {photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photo}
                      alt={`${t.student_name}${t.destination_name ? `, student in ${t.destination_name}` : ""}`}
                      className="size-10 rounded-full object-cover border border-hairline"
                    />
                  ) : (
                    <span className="size-10 rounded-full bg-violet-pale text-violet-deep text-sm font-bold flex items-center justify-center">
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
