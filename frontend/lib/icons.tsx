import {
  Award,
  Compass,
  FileText,
  GraduationCap,
  Plane,
  Stamp,
  Target,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  compass: Compass,
  target: Target,
  "file-text": FileText,
  stamp: Stamp,
  award: Award,
  plane: Plane,
};

export function getIcon(key: string): LucideIcon {
  return ICON_MAP[key] || GraduationCap;
}

/** Renders an icon by its backend key. A stable component (not created during render). */
export function ServiceIcon({
  name,
  className,
  strokeWidth = 2.2,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  const Icon = ICON_MAP[name] || GraduationCap;
  return <Icon className={className} strokeWidth={strokeWidth} />;
}
