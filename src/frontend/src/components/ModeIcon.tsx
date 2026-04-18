import type { AppMode } from "@/types";
import { AlignLeft, BarChart2, Image, Music, Video } from "lucide-react";

interface ModeIconProps {
  mode: AppMode;
  className?: string;
  size?: number;
}

const ICON_MAP: Record<AppMode, React.ElementType> = {
  Text: AlignLeft,
  Image: Image,
  Video: Video,
  Music: Music,
  Analytics: BarChart2,
};

export function ModeIcon({ mode, className, size = 16 }: ModeIconProps) {
  const Icon = ICON_MAP[mode];
  return <Icon size={size} className={className} />;
}
