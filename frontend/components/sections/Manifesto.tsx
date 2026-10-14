import { Reveal } from "@/components/ui/Reveal";

export function Manifesto() {
  return (
    <div className="border-y border-hairline bg-paper">
      <Reveal className="mx-auto w-full max-w-3xl px-6 py-20 text-center sm:px-8 sm:py-24">
        <p className="font-display text-2xl font-semibold leading-[1.4] text-ink text-balance sm:text-3xl">
          If we wouldn&apos;t recommend it to{" "}
          <span className="text-violet-deep">our own family</span>, we don&apos;t recommend it
          to you. That&apos;s the whole standard.
        </p>
      </Reveal>
    </div>
  );
}
