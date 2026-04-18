import { ModeIcon } from "@/components/ModeIcon";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useParadox } from "@/hooks/useParadox";
import type { AppMode, HistoryEntry } from "@/types";
import { Clock, Search, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";

const ALL_MODES: AppMode[] = ["Text", "Image", "Video", "Music", "Analytics"];

const MODE_COLOR: Record<AppMode, string> = {
  Text: "text-primary",
  Image: "text-accent",
  Video: "text-[oklch(0.7_0.18_280)]",
  Music: "text-[oklch(0.7_0.18_150)]",
  Analytics: "text-[oklch(0.75_0.17_60)]",
};

const REASONING_BADGE_COLOR: Record<string, string> = {
  Creative: "border-[oklch(0.7_0.18_280)] text-[oklch(0.7_0.18_280)]",
  Analytical: "border-primary text-primary",
  Technical: "border-[oklch(0.7_0.18_150)] text-[oklch(0.7_0.18_150)]",
};

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(ts: number) {
  const d = new Date(ts);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return "Today";
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function groupHistory(entries: HistoryEntry[]) {
  const groups: { label: string; entries: HistoryEntry[] }[] = [];
  const seen: Record<string, number> = {};
  for (const e of entries) {
    const label = formatDate(e.timestamp);
    if (seen[label] === undefined) {
      seen[label] = groups.length;
      groups.push({ label, entries: [] });
    }
    groups[seen[label]].entries.push(e);
  }
  return groups;
}

interface HistoryItemProps {
  entry: HistoryEntry;
  index: number;
  isActive: boolean;
  onLoad: (entry: HistoryEntry) => void;
  onDelete: (id: string) => void;
}

function HistoryItem({
  entry,
  index,
  isActive,
  onLoad,
  onDelete,
}: HistoryItemProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirmDelete) {
      onDelete(entry.id);
    } else {
      setConfirmDelete(true);
    }
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDelete(false);
  };

  return (
    <button
      type="button"
      className={`group relative w-full flex items-start gap-2 px-2 py-2.5 rounded-md cursor-pointer transition-smooth mb-0.5 text-left ${
        isActive
          ? "bg-primary/10 border border-primary/20"
          : "border border-transparent hover:bg-muted/50 hover:border-border/60"
      }`}
      onClick={() => onLoad(entry)}
      data-ocid={`history.item.${index}`}
    >
      {/* Mode icon */}
      <div className={`mt-0.5 flex-shrink-0 ${MODE_COLOR[entry.mode]}`}>
        <ModeIcon mode={entry.mode} size={11} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1">
        <p className="text-xs leading-relaxed text-foreground/80 line-clamp-2 break-words">
          {entry.prompt.length > 50
            ? `${entry.prompt.slice(0, 50)}…`
            : entry.prompt}
        </p>
        <div className="flex items-center gap-1.5">
          <Badge
            variant="outline"
            className={`text-[9px] h-4 px-1.5 py-0 font-display border leading-none ${
              REASONING_BADGE_COLOR[entry.reasoningStyle] ??
              "border-border text-muted-foreground"
            }`}
          >
            {entry.reasoningStyle.slice(0, 4)}
          </Badge>
          <span className="text-[9px] text-muted-foreground flex items-center gap-0.5">
            <Clock size={8} />
            {formatTime(entry.timestamp)}
          </span>
        </div>
      </div>

      {/* Delete control */}
      <div
        className={`flex-shrink-0 flex items-center transition-smooth ${
          confirmDelete ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="presentation"
      >
        {confirmDelete ? (
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="text-[9px] text-destructive hover:underline font-display"
              onClick={handleDeleteClick}
              aria-label="Confirm delete"
              data-ocid={`history.delete_button.${index}`}
            >
              Del
            </button>
            <button
              type="button"
              className="text-[9px] text-muted-foreground hover:underline font-display"
              onClick={handleCancelDelete}
              aria-label="Cancel delete"
              data-ocid={`history.cancel_button.${index}`}
            >
              <X size={9} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="text-muted-foreground hover:text-destructive transition-smooth p-0.5"
            onClick={handleDeleteClick}
            aria-label="Delete history entry"
            data-ocid={`history.delete_button.${index}`}
          >
            <Trash2 size={10} />
          </button>
        )}
      </div>
    </button>
  );
}

interface HistorySidebarProps {
  onClearAll?: () => void;
}

export function HistorySidebar({ onClearAll }: HistorySidebarProps) {
  const { history, activeEntryId, loadEntry, deleteEntry } = useParadox();
  const [search, setSearch] = useState("");
  const [modeFilter, setModeFilter] = useState<AppMode | "All">("All");

  const filtered = useMemo(() => {
    return history.filter((e) => {
      const matchesMode = modeFilter === "All" || e.mode === modeFilter;
      const matchesSearch =
        !search.trim() || e.prompt.toLowerCase().includes(search.toLowerCase());
      return matchesMode && matchesSearch;
    });
  }, [history, search, modeFilter]);

  const grouped = useMemo(() => groupHistory(filtered), [filtered]);

  // Flat index tracker for deterministic data-ocid
  let globalIndex = 0;

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="px-3 pt-2 pb-1.5 space-y-2">
        <div className="relative">
          <Search
            size={11}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <Input
            type="text"
            placeholder="Search history..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-7 pl-7 pr-7 text-xs font-body bg-background border-border focus-visible:ring-primary/40 rounded-md"
            data-ocid="history.search_input"
          />
          {search && (
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              <X size={10} />
            </button>
          )}
        </div>

        {/* Mode filter pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
          <button
            type="button"
            onClick={() => setModeFilter("All")}
            className={`flex-shrink-0 text-[9px] font-display px-2 py-0.5 rounded-full border transition-smooth ${
              modeFilter === "All"
                ? "bg-primary/10 border-primary/40 text-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:border-border/80"
            }`}
            data-ocid="history.filter.all"
          >
            All
          </button>
          {ALL_MODES.map((m) => (
            <button
              type="button"
              key={m}
              onClick={() => setModeFilter(m)}
              className={`flex-shrink-0 flex items-center gap-1 text-[9px] font-display px-2 py-0.5 rounded-full border transition-smooth ${
                modeFilter === m
                  ? `bg-primary/10 border-primary/40 ${MODE_COLOR[m]}`
                  : "border-border text-muted-foreground hover:text-foreground hover:border-border/80"
              }`}
              data-ocid={`history.filter.${m.toLowerCase()}`}
            >
              <ModeIcon mode={m} size={8} />
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <ScrollArea className="flex-1">
        {filtered.length === 0 ? (
          <div
            className="px-4 py-10 text-center space-y-2"
            data-ocid="history.empty_state"
          >
            {history.length === 0 ? (
              <>
                <div className="w-10 h-10 mx-auto rounded-xl bg-muted/60 border border-border flex items-center justify-center">
                  <Clock size={18} className="text-muted-foreground" />
                </div>
                <p className="text-xs font-display text-foreground/60">
                  No history yet
                </p>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Your conversations will appear here after your first prompt.
                </p>
              </>
            ) : (
              <>
                <Search size={18} className="mx-auto text-muted-foreground" />
                <p className="text-xs font-display text-foreground/60">
                  No results found
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Try a different search or filter.
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="px-2 pb-4">
            {grouped.map(({ label, entries }) => (
              <div key={label}>
                <div className="px-2 py-1.5">
                  <span className="text-[10px] font-display text-muted-foreground uppercase tracking-widest">
                    {label}
                  </span>
                </div>
                {entries.map((entry) => {
                  globalIndex += 1;
                  const idx = globalIndex;
                  return (
                    <HistoryItem
                      key={entry.id}
                      entry={entry}
                      index={idx}
                      isActive={activeEntryId === entry.id}
                      onLoad={loadEntry}
                      onDelete={deleteEntry}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Clear all footer action */}
      {history.length > 0 && onClearAll && (
        <div className="px-3 py-2 border-t border-border">
          <button
            type="button"
            className="w-full text-[10px] font-display text-muted-foreground hover:text-destructive transition-smooth text-center"
            onClick={onClearAll}
            data-ocid="history.clear_button"
          >
            Clear all history
          </button>
        </div>
      )}
    </div>
  );
}
