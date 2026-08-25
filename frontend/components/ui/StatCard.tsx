export function StatCard({
  value,
  label,
  className = "",
}: {
  value: string;
  label: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <p className="font-display font-bold text-3xl sm:text-4xl text-ink leading-none">
        {value}
      </p>
      <p className="text-xs sm:text-sm font-medium uppercase tracking-wide text-stone">
        {label}
      </p>
    </div>
  );
}
