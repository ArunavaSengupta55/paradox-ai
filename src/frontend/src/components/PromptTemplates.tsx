import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AppMode } from "@/types";
import { Sparkles } from "lucide-react";

const TEMPLATES: Record<AppMode, { label: string; prompt: string }[]> = {
  Text: [
    {
      label: "Explain a concept",
      prompt:
        "Explain the concept of [topic] in clear, structured terms with examples and practical applications.",
    },
    {
      label: "Compare & contrast",
      prompt:
        "Compare and contrast [A] vs [B]: key differences, trade-offs, and when to choose each.",
    },
    {
      label: "Step-by-step guide",
      prompt:
        "Provide a detailed step-by-step guide for [task], including prerequisites and common pitfalls.",
    },
    {
      label: "Critical analysis",
      prompt:
        "Critically analyze [subject]: strengths, weaknesses, opportunities, and potential risks.",
    },
  ],
  Image: [
    {
      label: "Describe visual style",
      prompt:
        "Describe the ideal visual style for [project]: mood, color palette, composition, and aesthetic direction.",
    },
    {
      label: "Brand identity concept",
      prompt:
        "Create a brand identity concept for [brand]: logo ideas, visual language, and imagery guidelines.",
    },
    {
      label: "Scene composition",
      prompt:
        "Describe a compelling scene composition for [subject]: framing, lighting, focal points, and atmosphere.",
    },
  ],
  Video: [
    {
      label: "Story arc outline",
      prompt:
        "Outline a compelling story arc for a video about [topic]: hook, build-up, climax, and resolution.",
    },
    {
      label: "Script structure",
      prompt:
        "Create a script structure for a [duration]-minute video on [topic] with talking points and visual cues.",
    },
    {
      label: "Engagement strategy",
      prompt:
        "Suggest an engagement strategy for a video series about [niche]: format, pacing, and retention tactics.",
    },
  ],
  Music: [
    {
      label: "Composition brief",
      prompt:
        "Describe a musical composition for [use case]: genre, tempo, key, instrumentation, and emotional arc.",
    },
    {
      label: "Chord progression",
      prompt:
        "Suggest a chord progression for a [mood] track in [genre] that evokes [emotion].",
    },
    {
      label: "Production style",
      prompt:
        "Describe the production style for a [genre] track: mix approach, effects chain, and sonic references.",
    },
  ],
  Analytics: [
    {
      label: "Metrics framework",
      prompt:
        "Design a metrics framework for tracking [goal]: KPIs, leading indicators, and measurement methodology.",
    },
    {
      label: "Data interpretation",
      prompt:
        "Interpret the following data pattern: [description]. What conclusions can we draw and what's uncertain?",
    },
    {
      label: "Dashboard design",
      prompt:
        "Design a dashboard layout for [use case]: key widgets, data hierarchies, and visualization types.",
    },
    {
      label: "A/B test analysis",
      prompt:
        "Analyze the results of an A/B test for [feature]: statistical significance, effect size, and next steps.",
    },
  ],
};

interface PromptTemplatesProps {
  mode: AppMode;
  onSelect: (prompt: string) => void;
}

export function PromptTemplates({ mode, onSelect }: PromptTemplatesProps) {
  const templates = TEMPLATES[mode];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-display text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth border border-transparent hover:border-border"
          data-ocid="prompt.templates.open_modal_button"
          aria-label="Smart prompt templates"
        >
          <Sparkles size={12} />
          Templates
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-80 bg-popover border-border"
        data-ocid="prompt.templates.popover"
      >
        <DropdownMenuLabel className="text-xs font-display text-muted-foreground uppercase tracking-widest pb-1">
          {mode} Templates
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {templates.map((tpl, i) => (
          <DropdownMenuItem
            key={tpl.label}
            onSelect={() => onSelect(tpl.prompt)}
            className="flex flex-col items-start gap-0.5 py-2.5 cursor-pointer"
            data-ocid={`prompt.templates.item.${i + 1}`}
          >
            <span className="text-xs font-display text-foreground">
              {tpl.label}
            </span>
            <span className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
              {tpl.prompt}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
