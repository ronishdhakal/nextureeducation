export function Wave({
  className = "",
  fill = "var(--paper)",
  flip = false,
}: {
  className?: string;
  fill?: string;
  flip?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 1200 80"
      preserveAspectRatio="none"
      aria-hidden
      className={`block w-full ${flip ? "rotate-180" : ""} ${className}`}
    >
      <path
        d="M0,32 C150,80 300,0 450,24 C600,48 750,88 900,56 C1020,32 1140,8 1200,24 L1200,80 L0,80 Z"
        fill={fill}
      />
    </svg>
  );
}
