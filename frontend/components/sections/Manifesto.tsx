import { Reveal } from "@/components/ui/Reveal";

export function Manifesto() {
  return (
    <div className="bg-paper border-y border-hairline">
      <Reveal className="mx-auto w-full max-w-3xl px-6 sm:px-8 py-20 sm:py-28 text-center">
        <p className="font-display font-semibold text-2xl sm:text-3xl lg:text-4xl leading-[1.35] text-ink text-balance">
          If we wouldn&apos;t recommend it to <span className="italic font-accent font-medium text-violet-deep">our own family</span>, we
          don&apos;t recommend it to you. That&apos;s the whole standard.
        </p>
      </Reveal>
    </div>
  );
}
