import { mediaUrl } from "@/lib/api";
import type { University } from "@/lib/types";

export function UniversityCard({ university }: { university: University }) {
  const logo = mediaUrl(university.logo);
  return (
    <div className="flex items-center gap-4 rounded-lg border border-hairline bg-paper p-5">
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logo} alt="" className="size-12 rounded-lg object-contain border border-hairline p-1" />
      ) : (
        <span className="size-12 rounded-lg bg-violet-pale text-violet-deep font-display font-bold flex items-center justify-center text-lg">
          {university.name[0]}
        </span>
      )}
      <div className="min-w-0">
        <p className="font-display font-bold text-ink truncate">{university.name}</p>
        <p className="text-xs text-stone">
          {[university.city, university.ranking_note].filter(Boolean).join(" · ")}
        </p>
      </div>
    </div>
  );
}
