import { Separator } from "@/components/ui/separator";
import type { ReasoningStyle } from "@/types";

const STYLES: {
  id: ReasoningStyle;
  label: string;
  desc: string;
  icon: string;
}[] = [
  {
    id: "Creative",
    label: "Creative",
    desc: "Imaginative, narrative-driven",
    icon: "✦",
  },
  {
    id: "Analytical",
    label: "Analytical",
    desc: "Data-backed, structured",
    icon: "◈",
  },
  {
    id: "Technical",
    label: "Technical",
    desc: "Systems-first, precise",
    icon: "⟨⟩",
  },
];

interface ReasoningStylePickerProps {
  selected: ReasoningStyle;
  onSelect: (style: ReasoningStyle) => void;
}

export function ReasoningStylePicker({
  selected,
  onSelect,
}: ReasoningStylePickerProps) {
  return (
    <div>
      <div className="mb-3">
        <p className="text-xs font-display font-medium text-foreground/80">
          Reasoning style
        </p>
        <p className="text-[10px] text-muted-foreground mt-0.5">
          Select your cognitive lens
        </p>
      </div>
      <div className="space-y-1.5">
        {STYLES.map((style) => {
          const isActive = selected === style.id;
          return (
            <button
              key={style.id}
              type="button"
              onClick={() => onSelect(style.id)}
              className={`w-full flex items-center gap-3 p-2.5 rounded-lg border transition-smooth text-left ${
                isActive
                  ? "bg-primary/10 border-primary/40 text-primary"
                  : "bg-transparent border-transparent hover:bg-muted/60 text-foreground/70"
              }`}
              data-ocid={`reasoning.${style.id.toLowerCase()}.toggle`}
              aria-pressed={isActive}
            >
              <div
                className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-smooth ${
                  isActive
                    ? "border-primary bg-primary"
                    : "border-muted-foreground/40"
                }`}
              >
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-display leading-tight">
                  {style.label}
                </p>
                <p className="text-[10px] text-muted-foreground leading-tight mt-0.5 truncate">
                  {style.desc}
                </p>
              </div>
              <span
                className={`text-sm flex-shrink-0 font-mono transition-smooth ${
                  isActive ? "text-primary" : "text-muted-foreground/30"
                }`}
                aria-hidden="true"
              >
                {style.icon}
              </span>
            </button>
          );
        })}
      </div>
      <Separator className="my-4" />
    </div>
  );
}
