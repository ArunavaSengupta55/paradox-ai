import { ResponseSkeleton } from "@/components/LoadingSpinner";
import { ModeIcon } from "@/components/ModeIcon";
import { ModeSelector } from "@/components/ModeSelector";
import { PromptInput } from "@/components/PromptInput";
import { ReasoningStylePicker } from "@/components/ReasoningStylePicker";
import { ResponseCard } from "@/components/ResponseCard";
import { Separator } from "@/components/ui/separator";
import { useParadox } from "@/hooks/useParadox";
import type { AppMode } from "@/types";
import { useEffect, useRef } from "react";

const MODE_ICON_COLOR: Record<AppMode, string> = {
  Text: "text-primary",
  Image: "text-accent",
  Video: "text-[oklch(0.7_0.18_280)]",
  Music: "text-[oklch(0.7_0.18_150)]",
  Analytics: "text-[oklch(0.75_0.17_60)]",
};

export default function ChatPage() {
  const {
    currentMode,
    reasoningStyle,
    prompt,
    response,
    isLoading,
    history,
    activeEntryId,
    submitPrompt,
    changeMode,
    changeReasoningStyle,
    setPrompt,
  } = useParadox();

  const responseRef = useRef<HTMLDivElement>(null);

  // Scroll response into view when it appears
  useEffect(() => {
    if (response && responseRef.current) {
      responseRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [response]);

  // When mode changes, clear prompt and response (preserve history)
  const handleModeChange = (mode: AppMode) => {
    changeMode(mode);
    setPrompt("");
  };

  // Get active history entry for timestamp
  const activeEntry = activeEntryId
    ? history.find((e) => e.id === activeEntryId)
    : null;

  return (
    <div className="flex flex-col h-full min-h-0" data-ocid="chat.page">
      {/* Mode Tabs Header */}
      <header className="bg-card border-b border-border px-4 py-3 flex-shrink-0">
        <ModeSelector
          currentMode={currentMode}
          onModeChange={handleModeChange}
        />
      </header>

      {/* Main content */}
      <div className="flex-1 flex min-h-0">
        {/* Center workspace */}
        <div className="flex-1 flex flex-col gap-3 px-5 py-4 min-w-0 min-h-0">
          {/* Prompt input */}
          <div className="flex-shrink-0">
            <PromptInput
              prompt={prompt}
              currentMode={currentMode}
              isLoading={isLoading}
              onPromptChange={setPrompt}
              onSubmit={submitPrompt}
              onModeDetect={changeMode}
            />
          </div>

          {/* Response area */}
          <div
            ref={responseRef}
            className="flex-1 min-h-0 rounded-xl border border-border bg-card px-5 py-4 flex flex-col"
          >
            {isLoading && <ResponseSkeleton />}

            {!isLoading && !response && (
              <div
                className="flex-1 flex flex-col items-center justify-center gap-4 py-12 text-center"
                data-ocid="response.empty_state"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <ModeIcon
                    mode={currentMode}
                    size={22}
                    className={MODE_ICON_COLOR[currentMode]}
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-display text-foreground/60">
                    Ready for your {currentMode.toLowerCase()} prompt
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Type a prompt above, choose a template, or press Enter to
                    send
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 border border-border">
                    <span className="text-[10px] font-display text-muted-foreground uppercase tracking-widest">
                      Mode
                    </span>
                    <span className="text-[10px] font-display text-foreground/70">
                      {currentMode}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 border border-border">
                    <span className="text-[10px] font-display text-muted-foreground uppercase tracking-widest">
                      Style
                    </span>
                    <span className="text-[10px] font-display text-foreground/70">
                      {reasoningStyle}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {!isLoading && response && (
              <ResponseCard
                response={response}
                mode={currentMode}
                reasoningStyle={reasoningStyle}
                timestamp={activeEntry?.timestamp}
              />
            )}
          </div>
        </div>

        {/* Right sidebar — Reasoning + info panel */}
        <aside
          className="w-56 flex-shrink-0 border-l border-border bg-card/50 px-4 py-4 flex flex-col"
          data-ocid="reasoning.panel"
        >
          <ReasoningStylePicker
            selected={reasoningStyle}
            onSelect={changeReasoningStyle}
          />

          {/* Active mode display */}
          <div className="space-y-2 mb-4">
            <p className="text-[10px] font-display text-muted-foreground uppercase tracking-widest">
              Active Mode
            </p>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/20">
              <ModeIcon
                mode={currentMode}
                size={14}
                className={MODE_ICON_COLOR[currentMode]}
              />
              <span className="text-xs font-display text-foreground/80">
                {currentMode}
              </span>
            </div>
          </div>

          {history.length > 0 && (
            <>
              <Separator className="mb-4" />
              <div className="space-y-1">
                <p className="text-[10px] font-display text-muted-foreground uppercase tracking-widest">
                  Session
                </p>
                <div className="text-xs text-foreground/60">
                  <span className="font-display text-foreground/80">
                    {history.length}
                  </span>{" "}
                  conversation{history.length !== 1 ? "s" : ""}
                </div>
              </div>
            </>
          )}

          <div className="mt-auto pt-4">
            <div className="rounded-lg bg-muted/30 border border-border/50 px-3 py-2.5 space-y-1">
              <p className="text-[10px] font-display text-muted-foreground uppercase tracking-widest">
                Tips
              </p>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Use{" "}
                <kbd className="px-1 py-0.5 rounded bg-muted border border-border text-[9px] font-mono">
                  Enter
                </kbd>{" "}
                to send,{" "}
                <kbd className="px-1 py-0.5 rounded bg-muted border border-border text-[9px] font-mono">
                  Esc
                </kbd>{" "}
                to clear
              </p>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Try <span className="text-primary/70">Templates</span> for quick
                prompts
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
