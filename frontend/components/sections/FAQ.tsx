"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Section";
import { FAQ_ITEMS } from "@/lib/faq";

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div>
      <SectionHeading
        eyebrow="Questions"
        title="What students ask before they walk in."
        subcopy="If yours isn't here, that's what the free session is for."
      />

      <div className="mt-10 max-w-3xl divide-y divide-hairline overflow-hidden border border-hairline bg-paper shadow-soft">
        {FAQ_ITEMS.map((item, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={item.question} delay={i * 40}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className={`flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-violet-tint ${isOpen ? "bg-violet-tint" : ""}`}
              >
                <span className="font-display font-bold tracking-[-0.01em] text-ink">
                  {item.question}
                </span>
                <ChevronDown
                  className={`size-5 shrink-0 text-violet-deep transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen ? (
                <p className="max-w-xl px-6 pb-5 text-sm leading-relaxed text-ink/65">
                  {item.answer}
                </p>
              ) : null}
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
