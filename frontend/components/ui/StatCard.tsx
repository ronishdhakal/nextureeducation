export function StatCard({
  value,
  label,
  rotate = "0",
  className = "",
}: {
  value: string;
  label: string;
  rotate?: "0" | "left" | "right";
  className?: string;
}) {
  const rotation =
    rotate === "left" ? "-rotate-3" : rotate === "right" ? "rotate-2" : "";
  return (
    <div
      className={`${rotation} bg-paper rounded-2xl border border-hairline shadow-[0_16px_40px_-16px_rgba(23,11,34,0.25)] px-5 py-4 transition-transform duration-300 hover:rotate-0 hover:-translate-y-1 ${className}`}
    >
      <p className="font-display font-extrabold text-2xl sm:text-3xl text-ink leading-none">
        {value}
      </p>
      <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-stone">
        {label}
      </p>
    </div>
  );
}
