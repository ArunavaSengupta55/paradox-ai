import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useParadoxStore } from "@/store/useParadoxStore";
import type { AppMode, HistoryEntry, ReasoningStyle, Theme } from "@/types";
import { Check, Download, Moon, Sun, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

const MODES: AppMode[] = ["Text", "Image", "Video", "Music", "Analytics"];
const REASONING_STYLES: ReasoningStyle[] = [
  "Creative",
  "Analytical",
  "Technical",
];
const THEMES: { id: Theme; label: string; icon: React.ReactNode }[] = [
  { id: "dark", label: "Dark", icon: <Moon size={13} /> },
  { id: "light", label: "Light", icon: <Sun size={13} /> },
];

interface SettingRowProps {
  label: string;
  description?: string;
  children: React.ReactNode;
}

function SettingRow({ label, description, children }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <div className="min-w-0">
        <p className="text-xs font-display text-foreground/90 leading-tight">
          {label}
        </p>
        {description && (
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {description}
          </p>
        )}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

interface SegmentedControlProps<T extends string> {
  options: { id: T; label: string; icon?: React.ReactNode }[];
  value: T;
  onChange: (v: T) => void;
  ocidPrefix: string;
}

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ocidPrefix,
}: SegmentedControlProps<T>) {
  return (
    <div className="flex items-center gap-0.5 bg-muted/60 rounded-md p-0.5 border border-border">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-display transition-smooth ${
            value === opt.id
              ? "bg-card text-primary shadow-sm border border-border"
              : "text-muted-foreground hover:text-foreground"
          }`}
          data-ocid={`${ocidPrefix}.${opt.id.toLowerCase()}`}
        >
          {opt.icon}
          {opt.label}
        </button>
      ))}
    </div>
  );
}

interface SelectDropdownProps<T extends string> {
  options: T[];
  value: T;
  onChange: (v: T) => void;
  ocidPrefix: string;
}

function SelectDropdown<T extends string>({
  options,
  value,
  onChange,
  ocidPrefix,
}: SelectDropdownProps<T>) {
  return (
    <div className="flex flex-col gap-1">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded text-[10px] font-display transition-smooth border ${
            value === opt
              ? "bg-primary/10 border-primary/30 text-primary"
              : "bg-transparent border-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          }`}
          data-ocid={`${ocidPrefix}.${opt.toLowerCase()}`}
        >
          {opt}
          {value === opt && <Check size={10} className="text-primary" />}
        </button>
      ))}
    </div>
  );
}

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const {
    settings,
    theme,
    updateSettings,
    clearHistory,
    history,
    toggleTheme,
  } = useParadoxStore();
  const panelRef = useRef<HTMLDivElement>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [exportDone, setExportDone] = useState(false);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    // Delay to avoid the open-click triggering close
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClick);
    }, 50);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [isOpen, onClose]);

  const handleThemeChange = useCallback(
    (t: Theme) => {
      updateSettings({ theme: t });
      // Sync live theme
      if (t !== theme) toggleTheme();
    },
    [updateSettings, theme, toggleTheme],
  );

  const handleExport = useCallback(() => {
    const data: HistoryEntry[] = history;
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `paradox-history-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportDone(true);
    setTimeout(() => setExportDone(false), 2000);
  }, [history]);

  const handleClearConfirm = useCallback(() => {
    clearHistory();
    setConfirmClear(false);
  }, [clearHistory]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 380,
            damping: 36,
            mass: 0.8,
          }}
          className="fixed top-0 right-0 h-full w-72 z-50 bg-card border-l border-border shadow-2xl flex flex-col"
          data-ocid="settings.panel"
          aria-label="Settings panel"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-border">
            <div>
              <p className="text-sm font-display font-medium tracking-tight text-foreground">
                Settings
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Preferences & data
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={onClose}
              aria-label="Close settings"
              data-ocid="settings.close_button"
            >
              <X size={14} />
            </Button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
            {/* Appearance */}
            <p className="text-[10px] font-display text-muted-foreground uppercase tracking-widest pt-1 pb-0.5">
              Appearance
            </p>

            <SettingRow label="Theme" description="Interface color scheme">
              <SegmentedControl
                options={THEMES.map((t) => ({
                  id: t.id,
                  label: t.label,
                  icon: t.icon,
                }))}
                value={theme}
                onChange={handleThemeChange}
                ocidPrefix="settings.theme"
              />
            </SettingRow>

            <Separator />

            {/* Defaults */}
            <p className="text-[10px] font-display text-muted-foreground uppercase tracking-widest pt-2 pb-0.5">
              Defaults
            </p>

            <SettingRow
              label="Default Mode"
              description="Starting mode for new conversations"
            >
              <div />
            </SettingRow>
            <SelectDropdown
              options={MODES}
              value={settings.defaultMode}
              onChange={(v) => updateSettings({ defaultMode: v })}
              ocidPrefix="settings.default_mode"
            />

            <div className="pt-1" />

            <SettingRow
              label="Reasoning Style"
              description="Default cognitive approach"
            >
              <div />
            </SettingRow>
            <SelectDropdown
              options={REASONING_STYLES}
              value={settings.defaultReasoningStyle}
              onChange={(v) => updateSettings({ defaultReasoningStyle: v })}
              ocidPrefix="settings.default_reasoning"
            />

            <Separator />

            {/* Data */}
            <p className="text-[10px] font-display text-muted-foreground uppercase tracking-widest pt-2 pb-0.5">
              Data
            </p>

            <SettingRow
              label="Chat History"
              description={`${history.length} conversation${history.length !== 1 ? "s" : ""} stored`}
            >
              <div />
            </SettingRow>

            {/* Export */}
            <button
              type="button"
              onClick={handleExport}
              disabled={history.length === 0}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg border border-border bg-transparent text-xs font-display text-foreground/80 hover:bg-muted/60 hover:text-foreground transition-smooth disabled:opacity-40 disabled:cursor-not-allowed"
              data-ocid="settings.export_button"
            >
              {exportDone ? (
                <Check size={13} className="text-primary" />
              ) : (
                <Download size={13} />
              )}
              <span>{exportDone ? "Exported!" : "Export History as JSON"}</span>
            </button>

            {/* Clear */}
            {!confirmClear ? (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                disabled={history.length === 0}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg border border-transparent bg-transparent text-xs font-display text-destructive/80 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-smooth disabled:opacity-40 disabled:cursor-not-allowed"
                data-ocid="settings.clear_button"
              >
                <Trash2 size={13} />
                <span>Clear All History</span>
              </button>
            ) : (
              <div
                className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 space-y-2"
                data-ocid="settings.clear_confirm.dialog"
              >
                <p className="text-xs text-destructive font-display">
                  Delete all {history.length} conversation
                  {history.length !== 1 ? "s" : ""}?
                </p>
                <p className="text-[10px] text-muted-foreground">
                  This action cannot be undone.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleClearConfirm}
                    className="flex-1 px-2 py-1.5 rounded bg-destructive text-destructive-foreground text-[10px] font-display hover:bg-destructive/80 transition-smooth"
                    data-ocid="settings.clear_confirm.confirm_button"
                  >
                    Delete All
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmClear(false)}
                    className="flex-1 px-2 py-1.5 rounded bg-muted text-muted-foreground text-[10px] font-display hover:bg-muted/80 transition-smooth"
                    data-ocid="settings.clear_confirm.cancel_button"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer glow accent */}
          <div className="px-4 py-3 border-t border-border">
            <p className="text-[10px] text-muted-foreground text-center font-display">
              Settings saved automatically
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
