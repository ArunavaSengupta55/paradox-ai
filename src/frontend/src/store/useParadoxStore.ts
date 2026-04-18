import type {
  AppMode,
  HistoryEntry,
  ReasoningStyle,
  Theme,
  UserSettings,
} from "@/types";
import { DEFAULT_SETTINGS } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ParadoxState {
  // UI state
  currentMode: AppMode;
  reasoningStyle: ReasoningStyle;
  prompt: string;
  response: string | null;
  isLoading: boolean;
  activeEntryId: string | null;
  theme: Theme;

  // Persisted data
  history: HistoryEntry[];
  settings: UserSettings;

  // Actions
  setMode: (mode: AppMode) => void;
  setReasoningStyle: (style: ReasoningStyle) => void;
  setPrompt: (prompt: string) => void;
  setResponse: (response: string | null) => void;
  setLoading: (loading: boolean) => void;
  setActiveEntry: (id: string | null) => void;
  addHistoryEntry: (entry: HistoryEntry) => void;
  deleteHistoryEntry: (id: string) => void;
  clearHistory: () => void;
  loadEntry: (entry: HistoryEntry) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  toggleTheme: () => void;
}

export const useParadoxStore = create<ParadoxState>()(
  persist(
    (set, get) => ({
      currentMode: DEFAULT_SETTINGS.defaultMode,
      reasoningStyle: DEFAULT_SETTINGS.defaultReasoningStyle,
      prompt: "",
      response: null,
      isLoading: false,
      activeEntryId: null,
      theme: DEFAULT_SETTINGS.theme,

      history: [],
      settings: DEFAULT_SETTINGS,

      setMode: (mode) => set({ currentMode: mode }),
      setReasoningStyle: (style) => set({ reasoningStyle: style }),
      setPrompt: (prompt) => set({ prompt }),
      setResponse: (response) => set({ response }),
      setLoading: (loading) => set({ isLoading: loading }),
      setActiveEntry: (id) => set({ activeEntryId: id }),

      addHistoryEntry: (entry) =>
        set((state) => ({ history: [entry, ...state.history] })),

      deleteHistoryEntry: (id) =>
        set((state) => ({
          history: state.history.filter((e) => e.id !== id),
          activeEntryId:
            state.activeEntryId === id ? null : state.activeEntryId,
        })),

      clearHistory: () =>
        set({ history: [], activeEntryId: null, response: null }),

      loadEntry: (entry) =>
        set({
          currentMode: entry.mode,
          reasoningStyle: entry.reasoningStyle,
          prompt: entry.prompt,
          response: entry.response,
          activeEntryId: entry.id,
        }),

      updateSettings: (settings) =>
        set((state) => ({ settings: { ...state.settings, ...settings } })),

      toggleTheme: () => {
        const next: Theme = get().theme === "dark" ? "light" : "dark";
        set({ theme: next });
      },
    }),
    {
      name: "paradox-ai-store",
      partialize: (state) => ({
        history: state.history,
        settings: state.settings,
        theme: state.theme,
        currentMode: state.currentMode,
        reasoningStyle: state.reasoningStyle,
      }),
    },
  ),
);
