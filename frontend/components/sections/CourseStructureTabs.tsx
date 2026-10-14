"use client";

import { Check } from "lucide-react";
import { useState } from "react";

export function CourseStructureTabs({ blocks }: { blocks: { title: string; items: string[] }[] }) {
  const [active, setActive] = useState(0);
  const current = blocks[active];
  if (!current) return null;

  return (
    <div>
      <div role="tablist" className="flex flex-wrap gap-3">
        {blocks.map((b, i) => (
          <button
            key={b.title}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={`min-w-28 px-5 py-2 text-xs font-medium transition-colors ${
              i === active
                ? "bg-violet text-white shadow-sm shadow-violet/25"
                : "bg-violet-pale text-ink/80 hover:bg-violet-pale/70"
            }`}
          >
            {b.title}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        className="mt-5 max-w-2xl border border-hairline bg-violet-tint p-5 shadow-soft"
      >
        <h3 className="text-sm font-medium text-violet-dark">{current.title}</h3>
        <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
          {current.items.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-ink/75">
              <span className="mt-0.5 flex size-3.5 shrink-0 items-center justify-center rounded-full bg-violet text-white">
                <Check className="size-2" strokeWidth={4} />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
