import { generateMockResponse } from "@/lib/mockAI";
import { useParadoxStore } from "@/store/useParadoxStore";
import type { AppMode, ReasoningStyle } from "@/types";
import { useCallback } from "react";

export function useParadox() {
  const store = useParadoxStore();

  const submitPrompt = useCallback(async () => {
    const { prompt, currentMode, reasoningStyle } = store;
    if (!prompt.trim() || store.isLoading) return;

    store.setLoading(true);
    store.setResponse(null);

    try {
      const response = await generateMockResponse(
        prompt.trim(),
        currentMode,
        reasoningStyle,
      );
      store.setResponse(response);

      const entry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        prompt: prompt.trim(),
        mode: currentMode,
        reasoningStyle,
        response,
        timestamp: Date.now(),
      };
      store.addHistoryEntry(entry);
      store.setActiveEntry(entry.id);
    } finally {
      store.setLoading(false);
    }
  }, [store]);

  const changeMode = useCallback(
    (mode: AppMode) => {
      store.setMode(mode);
    },
    [store],
  );

  const changeReasoningStyle = useCallback(
    (style: ReasoningStyle) => {
      store.setReasoningStyle(style);
    },
    [store],
  );

  const newConversation = useCallback(() => {
    store.setPrompt("");
    store.setResponse(null);
    store.setActiveEntry(null);
  }, [store]);

  return {
    currentMode: store.currentMode,
    reasoningStyle: store.reasoningStyle,
    prompt: store.prompt,
    response: store.response,
    isLoading: store.isLoading,
    history: store.history,
    activeEntryId: store.activeEntryId,
    theme: store.theme,
    submitPrompt,
    changeMode,
    changeReasoningStyle,
    setPrompt: store.setPrompt,
    loadEntry: store.loadEntry,
    deleteEntry: store.deleteHistoryEntry,
    clearHistory: store.clearHistory,
    newConversation,
    toggleTheme: store.toggleTheme,
  };
}
