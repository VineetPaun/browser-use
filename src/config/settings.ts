import Conf from "conf";
import { DEFAULT_MODEL } from "./models.js";

interface Settings {
  apiKey: string;
  defaultModel: string;
  streamingEnabled: boolean;
  theme: "default" | "minimal" | "colorful";
}

const config = new Conf<Settings>({
  projectName: "browser-use",
  defaults: {
    apiKey: "",
    defaultModel: DEFAULT_MODEL,
    streamingEnabled: true,
    theme: "default",
  },
});

export function getSettings(): Settings {
  return {
    apiKey: config.get("apiKey"),
    defaultModel: config.get("defaultModel"),
    streamingEnabled: config.get("streamingEnabled"),
    theme: config.get("theme"),
  };
}

export function setApiKey(key: string): void {
  config.set("apiKey", key);
}

export function getApiKey(): string {
  // Check environment variable first, then config
  return process.env.OPENROUTER_API_KEY ?? config.get("apiKey");
}

export function setDefaultModel(modelId: string): void {
  config.set("defaultModel", modelId);
}

export function getDefaultModel(): string {
  return config.get("defaultModel");
}

export function setStreamingEnabled(enabled: boolean): void {
  config.set("streamingEnabled", enabled);
}

export function isStreamingEnabled(): boolean {
  return config.get("streamingEnabled");
}

export function setTheme(theme: Settings["theme"]): void {
  config.set("theme", theme);
}

export function getTheme(): Settings["theme"] {
  return config.get("theme");
}

export function clearSettings(): void {
  config.clear();
}

export { config };
