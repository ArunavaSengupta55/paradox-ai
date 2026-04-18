import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Timestamp = bigint;
export interface HistoryEntry {
    id: EntryId;
    mode: Mode;
    reasoningStyle: ReasoningStyle;
    response: string;
    timestamp: Timestamp;
    prompt: string;
}
export type EntryId = bigint;
export interface UserSettings {
    theme: Theme;
    defaultMode: Mode;
    defaultReasoningStyle: ReasoningStyle;
}
export enum Mode {
    Analytics = "Analytics",
    Text = "Text",
    Image = "Image",
    Music = "Music",
    Video = "Video"
}
export enum ReasoningStyle {
    Creative = "Creative",
    Technical = "Technical",
    Analytical = "Analytical"
}
export enum Theme {
    Light = "Light",
    Dark = "Dark"
}
export interface backendInterface {
    clearHistory(): Promise<void>;
    deleteHistoryEntry(id: EntryId): Promise<boolean>;
    getHistory(): Promise<Array<HistoryEntry>>;
    getSettings(): Promise<UserSettings | null>;
    saveHistoryEntry(prompt: string, mode: Mode, reasoningStyle: ReasoningStyle, response: string): Promise<EntryId>;
    saveSettings(settings: UserSettings): Promise<void>;
}
