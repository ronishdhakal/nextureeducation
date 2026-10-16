import Image from "next/image";
import Link from "next/link";

export function Logo({ className = "", priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2 shrink-0 ${className}`}>
      <Image
        src="/assets/nexture-logo.png"
        alt="Nexture Education logo"
        width={340}
        height={110}
        priority={priority}
        className="h-11 w-auto object-contain"
      />
    </Link>
  );
}
