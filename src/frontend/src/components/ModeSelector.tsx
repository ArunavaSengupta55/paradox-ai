import { ModeIcon } from "@/components/ModeIcon";
import type { AppMode } from "@/types";

const MODES: AppMode[] = ["Text", "Image", "Video", "Music", "Analytics"];

const MODE_ACTIVE_COLOR: Record<AppMode, string> = {
  Text: "border-primary/60 bg-primary/10 text-primary",
  Image: "border-accent/60 bg-accent/10 text-accent",
  Video:
    "border-[oklch(0.7_0.18_280)]/60 bg-[oklch(0.7_0.18_280)]/10 text-[oklch(0.7_0.18_280)]",
  Music:
    "border-[oklch(0.7_0.18_150)]/60 bg-[oklch(0.7_0.18_150)]/10 text-[oklch(0.7_0.18_150)]",
  Analytics:
    "border-[oklch(0.75_0.17_60)]/60 bg-[oklch(0.75_0.17_60)]/10 text-[oklch(0.75_0.17_60)]",
};

const MODE_ICON_COLOR: Record<AppMode, string> = {
  Text: "text-primary",
  Image: "text-accent",
  Video: "text-[oklch(0.7_0.18_280)]",
  Music: "text-[oklch(0.7_0.18_150)]",
  Analytics: "text-[oklch(0.75_0.17_60)]",
};

interface ModeSelectorProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

export function ModeSelector({ currentMode, onModeChange }: ModeSelectorProps) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto">
      {MODES.map((mode) => {
        const isActive = currentMode === mode;
        return (
          <button
            key={mode}
            type="button"
            onClick={() => onModeChange(mode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-display whitespace-nowrap transition-smooth border ${
              isActive
                ? MODE_ACTIVE_COLOR[mode]
                : "bg-transparent border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
            data-ocid={`mode.tab.${mode.toLowerCase()}`}
            aria-pressed={isActive}
          >
            <ModeIcon
              mode={mode}
              size={14}
              className={isActive ? MODE_ICON_COLOR[mode] : ""}
            />
            {mode}
          </button>
        );
      })}
    </div>
  );
}

export { MODE_ICON_COLOR };
