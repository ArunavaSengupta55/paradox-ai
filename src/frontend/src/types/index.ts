export type AppMode = "Text" | "Image" | "Video" | "Music" | "Analytics";

export type ReasoningStyle = "Creative" | "Analytical" | "Technical";

export type Theme = "dark" | "light";

export interface HistoryEntry {
  id: string;
  prompt: string;
  mode: AppMode;
  reasoningStyle: ReasoningStyle;
  response: string;
  timestamp: number;
}

export interface UserSettings {
  defaultMode: AppMode;
  defaultReasoningStyle: ReasoningStyle;
  theme: Theme;
}

export const DEFAULT_SETTINGS: UserSettings = {
  defaultMode: "Text",
  defaultReasoningStyle: "Analytical",
  theme: "dark",
};
