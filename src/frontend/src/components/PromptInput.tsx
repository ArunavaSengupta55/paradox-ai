import { LoadingSpinner } from "@/components/LoadingSpinner";
import { PromptTemplates } from "@/components/PromptTemplates";
import type { AppMode } from "@/types";
import { Scan, X } from "lucide-react";
import { useEffect, useRef } from "react";

const AUTO_DETECT_KEYWORDS: Record<AppMode, string[]> = {
  Text: [
    "explain",
    "write",
    "describe",
    "summarize",
    "analyze",
    "what is",
    "how to",
    "compare",
  ],
  Image: [
    "image",
    "picture",
    "photo",
    "visual",
    "design",
    "logo",
    "illustration",
    "color",
    "palette",
  ],
  Video: [
    "video",
    "film",
    "animation",
    "scene",
    "shot",
    "story",
    "script",
    "footage",
    "edit",
  ],
  Music: [
    "music",
    "song",
    "melody",
    "chord",
    "beat",
    "audio",
    "sound",
    "track",
    "compose",
    "rhythm",
  ],
  Analytics: [
    "data",
    "metric",
    "analytics",
    "chart",
    "graph",
    "statistics",
    "trend",
    "dashboard",
    "kpi",
  ],
};

function detectMode(text: string): AppMode | null {
  const lower = text.toLowerCase();
  const scores: Record<AppMode, number> = {
    Text: 0,
    Image: 0,
    Video: 0,
    Music: 0,
    Analytics: 0,
  };
  for (const [mode, keywords] of Object.entries(AUTO_DETECT_KEYWORDS) as [
    AppMode,
    string[],
  ][]) {
    for (const kw of keywords) {
      if (lower.includes(kw)) scores[mode]++;
    }
  }
  const best = (Object.entries(scores) as [AppMode, number][]).reduce((a, b) =>
    b[1] > a[1] ? b : a,
  );
  return best[1] > 0 ? best[0] : null;
}

interface PromptInputProps {
  prompt: string;
  currentMode: AppMode;
  isLoading: boolean;
  onPromptChange: (value: string) => void;
  onSubmit: () => void;
  onModeDetect: (mode: AppMode) => void;
}

export function PromptInput({
  prompt,
  currentMode,
  isLoading,
  onPromptChange,
  onSubmit,
  onModeDetect,
}: PromptInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 180)}px`;
  });

  // Focus textarea on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onSubmit();
    }
    if (e.key === "Escape") {
      onPromptChange("");
    }
  };

  const handleAutoDetect = () => {
    const detected = detectMode(prompt);
    if (detected) onModeDetect(detected);
  };

  return (
    <div
      className={`rounded-xl border transition-smooth ${
        isLoading
          ? "border-primary/50 shadow-[0_0_0_1px_oklch(var(--primary)/0.15)]"
          : "border-border focus-within:border-primary/50 focus-within:shadow-[0_0_0_1px_oklch(var(--primary)/0.15)]"
      } bg-card`}
    >
      <textarea
        ref={textareaRef}
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={`What's on your mind? (${currentMode} mode) — Ctrl+Enter to send, Esc to clear`}
        rows={3}
        className="w-full resize-none bg-transparent px-4 pt-4 pb-2 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none font-body leading-relaxed"
        disabled={isLoading}
        data-ocid="prompt.input"
        aria-label="Prompt input"
      />
      <div className="flex items-center justify-between px-3 pb-3 gap-2">
        <div className="flex items-center gap-1">
          <PromptTemplates mode={currentMode} onSelect={onPromptChange} />
          {prompt.trim().length > 5 && (
            <button
              type="button"
              onClick={handleAutoDetect}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-display text-muted-foreground hover:text-primary hover:bg-primary/10 transition-smooth border border-transparent hover:border-primary/20"
              data-ocid="prompt.autodetect_button"
              title="Auto-detect best mode for this prompt"
            >
              <Scan size={12} />
              Auto-detect
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-[10px] text-muted-foreground/40 font-display hidden sm:block">
            {prompt.length > 0 ? `${prompt.length} chars` : "Enter ↵ to send"}
          </span>

          {prompt.length > 0 && !isLoading && (
            <button
              type="button"
              onClick={() => onPromptChange("")}
              className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
              aria-label="Clear input"
              data-ocid="prompt.clear_button"
            >
              <X size={13} />
            </button>
          )}

          <button
            type="button"
            onClick={onSubmit}
            disabled={!prompt.trim() || isLoading}
            className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center transition-smooth hover:bg-primary/80 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            aria-label="Send prompt"
            data-ocid="prompt.submit_button"
          >
            {isLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="text-primary-foreground"
                aria-hidden="true"
              >
                <title>Send</title>
                <path d="M22 2L11 13" />
                <path d="M22 2L15 22 11 13 2 9l20-7z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
