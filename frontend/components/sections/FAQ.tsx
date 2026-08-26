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

      <div className="mt-10 max-w-3xl border-t border-hairline">
        {FAQ_ITEMS.map((item, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={item.question} delay={i * 40} className="border-b border-hairline">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between gap-4 py-5 text-left"
              >
                <span className="font-display font-bold text-ink">{item.question}</span>
                <ChevronDown
                  className={`size-5 shrink-0 text-violet-deep transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen ? (
                <p className="pb-5 text-sm text-ink/65 leading-relaxed max-w-xl">{item.answer}</p>
              ) : null}
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
