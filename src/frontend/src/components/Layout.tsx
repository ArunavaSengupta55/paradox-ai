import { HistorySidebar } from "@/components/HistorySidebar";
import { LoadingSpinner, ResponseSkeleton } from "@/components/LoadingSpinner";
import { ModeIcon } from "@/components/ModeIcon";
import { SettingsPanel } from "@/components/SettingsPanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useParadox } from "@/hooks/useParadox";
import type { AppMode, ReasoningStyle } from "@/types";
import { Moon, Plus, Settings, Sun, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const MODES: AppMode[] = ["Text", "Image", "Video", "Music", "Analytics"];
const REASONING_STYLES: { id: ReasoningStyle; label: string; desc: string }[] =
  [
    {
      id: "Creative",
      label: "Creative",
      desc: "Imaginative, narrative-driven",
    },
    { id: "Analytical", label: "Analytical", desc: "Data-backed, structured" },
    { id: "Technical", label: "Technical", desc: "Systems-first, precise" },
  ];

const MODE_COLOR: Record<AppMode, string> = {
  Text: "text-primary",
  Image: "text-accent",
  Video: "text-[oklch(0.7_0.18_280)]",
  Music: "text-[oklch(0.7_0.18_150)]",
  Analytics: "text-[oklch(0.75_0.17_60)]",
};

function parseResponse(response: string) {
  const lines = response.split("\n");
  const sections: {
    heading: string;
    body: string;
    isH1?: boolean;
    key: string;
  }[] = [];
  let current: {
    heading: string;
    body: string;
    isH1?: boolean;
    key: string;
  } | null = null;
  let idx = 0;
  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (current) sections.push(current);
      current = { heading: line.slice(3), body: "", key: `s${idx++}` };
    } else if (line.startsWith("# ")) {
      if (current) sections.push(current);
      current = {
        heading: line.slice(2),
        body: "",
        isH1: true,
        key: `h${idx++}`,
      };
    } else if (current) {
      current.body = `${current.body}\n${line}`.trim();
    }
  }
  if (current) sections.push(current);
  return sections;
}

export function Layout() {
  const {
    currentMode,
    reasoningStyle,
    prompt,
    response,
    isLoading,
    history,
    theme,
    submitPrompt,
    changeMode,
    changeReasoningStyle,
    setPrompt,
    clearHistory,
    newConversation,
    toggleTheme,
  } = useParadox();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Apply theme class to document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Auto-resize textarea on prompt change
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      submitPrompt();
    }
  };

  const parsedResponse = response ? parseResponse(response) : null;

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 flex-shrink-0 flex flex-col bg-card border-r border-border">
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center">
            <Zap size={16} className="text-primary" />
          </div>
          <span className="font-display text-sm font-medium tracking-tight">
            Paradox.ai
          </span>
          <div className="ml-auto flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              data-ocid="theme.toggle"
            >
              {theme === "dark" ? <Sun size={13} /> : <Moon size={13} />}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={newConversation}
              aria-label="New conversation"
              data-ocid="new_conversation.button"
            >
              <Plus size={13} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setSettingsOpen(true)}
              aria-label="Open settings"
              data-ocid="settings.open_modal_button"
            >
              <Settings size={13} />
            </Button>
          </div>
        </div>

        {/* History — delegates to HistorySidebar with search + mode filter */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border">
          <span className="text-xs text-muted-foreground font-display uppercase tracking-widest">
            History
          </span>
        </div>
        <div className="flex-1 overflow-hidden">
          <HistorySidebar onClearAll={clearHistory} />
        </div>

        {/* Footer */}
        <div className="border-t border-border px-4 py-3">
          <p className="text-[10px] text-muted-foreground text-center">
            © {new Date().getFullYear()}.{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-smooth"
            >
              Built with caffeine.ai
            </a>
          </p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 bg-background">
        {/* Mode Tabs */}
        <header className="bg-card border-b border-border px-4 py-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            {MODES.map((mode) => (
              <button
                type="button"
                key={mode}
                onClick={() => {
                  changeMode(mode);
                  setPrompt("");
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-display whitespace-nowrap transition-smooth border ${
                  currentMode === mode
                    ? "bg-primary/10 border-primary/50 text-primary"
                    : "bg-transparent border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
                data-ocid={`mode.tab.${mode.toLowerCase()}`}
              >
                <ModeIcon
                  mode={mode}
                  size={14}
                  className={currentMode === mode ? MODE_COLOR[mode] : ""}
                />
                {mode}
              </button>
            ))}
          </div>
        </header>

        {/* Content area */}
        <div className="flex-1 flex min-h-0">
          {/* Center column */}
          <div className="flex-1 flex flex-col min-w-0 px-5 py-4 gap-4">
            {/* Prompt area */}
            <div
              className={`rounded-xl border transition-smooth ${isLoading ? "border-primary/60 shadow-[0_0_0_1px_oklch(var(--primary)/0.2)]" : "border-border focus-within:border-primary/60 focus-within:shadow-[0_0_0_1px_oklch(var(--primary)/0.2)]"} bg-card`}
            >
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`What's on your mind? (${currentMode} mode)`}
                rows={3}
                className="w-full resize-none bg-transparent px-4 pt-4 pb-2 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none font-body"
                disabled={isLoading}
                data-ocid="prompt.input"
              />
              <div className="flex items-center justify-between px-3 pb-3">
                <div className="flex items-center gap-1 text-muted-foreground/50">
                  <span className="text-[10px] font-display">
                    {prompt.length} chars
                  </span>
                  <span className="text-[10px]">·</span>
                  <span className="text-[10px] font-display">
                    Ctrl+Enter to send
                  </span>
                </div>
                <button
                  type="button"
                  onClick={submitPrompt}
                  disabled={!prompt.trim() || isLoading}
                  className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center transition-smooth hover:bg-primary/80 disabled:opacity-40 disabled:cursor-not-allowed"
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

            {/* Response area */}
            <ScrollArea className="flex-1 rounded-xl border border-border bg-card px-5 py-4">
              {isLoading && <ResponseSkeleton />}
              {!isLoading && !response && !parsedResponse && (
                <div
                  className="h-full flex flex-col items-center justify-center gap-3 py-16 text-center"
                  data-ocid="response.empty_state"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <ModeIcon
                      mode={currentMode}
                      size={20}
                      className="text-primary"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-display text-foreground/60">
                      Ready for your {currentMode.toLowerCase()} prompt
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Type a prompt above and press Enter
                    </p>
                  </div>
                </div>
              )}
              {!isLoading && parsedResponse && (
                <div className="fade-in space-y-5" data-ocid="response.card">
                  {parsedResponse.map((section) => (
                    <div
                      key={section.key}
                      className={section.isH1 ? "" : "accent-border-left pl-3"}
                    >
                      {section.isH1 ? (
                        <h2 className="accent-text text-lg font-display font-medium mb-2">
                          {section.heading}
                        </h2>
                      ) : (
                        <>
                          <h3 className="text-sm font-display font-medium text-primary mb-2">
                            {section.heading}
                          </h3>
                          <p className="text-sm text-foreground/80 leading-relaxed">
                            {section.body}
                          </p>
                        </>
                      )}
                    </div>
                  ))}
                  <Separator className="my-4" />
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ModeIcon mode={currentMode} size={12} />
                    <span>{currentMode}</span>
                    <span>·</span>
                    <span>{reasoningStyle}</span>
                    <Badge
                      variant="outline"
                      className="ml-auto text-[10px] h-5 font-display"
                    >
                      Paradox.ai
                    </Badge>
                  </div>
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Reasoning panel */}
          <aside className="w-56 flex-shrink-0 border-l border-border bg-card/50 px-4 py-4">
            <div className="mb-3">
              <p className="text-xs font-display font-medium text-foreground/80">
                Reasoning style
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Select your cognitive lens
              </p>
            </div>
            <div className="space-y-2">
              {REASONING_STYLES.map((style) => {
                const active = reasoningStyle === style.id;
                return (
                  <button
                    type="button"
                    key={style.id}
                    onClick={() => changeReasoningStyle(style.id)}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg border transition-smooth text-left ${
                      active
                        ? "bg-primary/10 border-primary/40 text-primary"
                        : "bg-transparent border-transparent hover:bg-muted/60 text-foreground/70"
                    }`}
                    data-ocid={`reasoning.${style.id.toLowerCase()}.toggle`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-smooth ${active ? "border-primary bg-primary" : "border-muted-foreground/40"}`}
                    >
                      {active && (
                        <div className="w-full h-full rounded-full scale-50 bg-primary-foreground" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-display leading-tight">
                        {style.label}
                      </p>
                      <p className="text-[10px] text-muted-foreground leading-tight mt-0.5 truncate">
                        {style.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <p className="text-[10px] font-display text-muted-foreground uppercase tracking-widest">
                Active Mode
              </p>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/20">
                <ModeIcon
                  mode={currentMode}
                  size={14}
                  className={MODE_COLOR[currentMode]}
                />
                <span className="text-xs font-display text-foreground/80">
                  {currentMode}
                </span>
              </div>
            </div>

            {history.length > 0 && (
              <>
                <Separator className="my-4" />
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
          </aside>
        </div>
      </main>

      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}
