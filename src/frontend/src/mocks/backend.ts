import type { backendInterface, HistoryEntry, UserSettings } from "../backend";
import { Mode, ReasoningStyle, Theme } from "../backend";

const sampleHistory: HistoryEntry[] = [
  {
    id: BigInt(1),
    mode: Mode.Text,
    reasoningStyle: ReasoningStyle.Analytical,
    prompt: "Explain quantum computing in simple terms",
    response:
      "Quantum computing leverages quantum mechanical phenomena like superposition and entanglement to process information. Unlike classical bits (0 or 1), qubits can exist in multiple states simultaneously, enabling parallel computation at unprecedented scales.\n\n**Key advantages:**\n- Exponential speedup for specific problems\n- Breakthrough potential in cryptography and drug discovery\n- Optimization of complex systems (logistics, finance)",
    timestamp: BigInt(Date.now() - 3600000) * BigInt(1000000),
  },
  {
    id: BigInt(2),
    mode: Mode.Analytics,
    reasoningStyle: ReasoningStyle.Technical,
    prompt: "Analyze market trends for AI startups in 2025",
    response:
      "**Market Analysis: AI Startups 2025**\n\nFunding activity has surged 340% YoY, with generative AI commanding 62% of venture capital. Key sectors: infrastructure (34%), enterprise SaaS (28%), vertical AI (22%), consumer (16%).\n\n**Emerging signals:**\n- Edge AI deployment up 5x\n- Regulatory compliance tools in high demand\n- Foundation model commoditization accelerating",
    timestamp: BigInt(Date.now() - 7200000) * BigInt(1000000),
  },
  {
    id: BigInt(3),
    mode: Mode.Image,
    reasoningStyle: ReasoningStyle.Creative,
    prompt: "Generate a futuristic cityscape at dusk",
    response:
      "Image generated: A sweeping panorama of Neo-Tokyo 2087, with bioluminescent towers reflecting off rain-slicked streets. Holographic advertisements cascade between skyscrapers as autonomous vehicles trace light trails through elevated highways. The sky bleeds from deep violet to amber at the horizon.",
    timestamp: BigInt(Date.now() - 86400000) * BigInt(1000000),
  },
];

const defaultSettings: UserSettings = {
  theme: Theme.Dark,
  defaultMode: Mode.Text,
  defaultReasoningStyle: ReasoningStyle.Analytical,
};

let nextId = BigInt(4);
const history = [...sampleHistory];
let settings: UserSettings | null = defaultSettings;

export const mockBackend: backendInterface = {
  getHistory: async () => [...history].reverse(),
  saveHistoryEntry: async (prompt, mode, reasoningStyle, response) => {
    const id = nextId++;
    history.push({
      id,
      mode,
      reasoningStyle,
      prompt,
      response,
      timestamp: BigInt(Date.now()) * BigInt(1000000),
    });
    return id;
  },
  deleteHistoryEntry: async (id) => {
    const idx = history.findIndex((e) => e.id === id);
    if (idx !== -1) {
      history.splice(idx, 1);
      return true;
    }
    return false;
  },
  clearHistory: async () => {
    history.length = 0;
  },
  getSettings: async () => settings,
  saveSettings: async (s) => {
    settings = s;
  },
};
