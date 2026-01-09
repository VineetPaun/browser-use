import { createOpenRouter } from "@openrouter/ai-sdk-provider";

// OpenRouter model configurations
export interface ModelConfig {
  id: string;
  name: string;
  description: string;
  contextWindow: number;
  costPer1kTokens: { input: number; output: number };
}

// Popular models available through OpenRouter
export const AVAILABLE_MODELS: ModelConfig[] = [
  {
    id: "anthropic/claude-sonnet-4",
    name: "Claude Sonnet 4",
    description: "Latest Claude model - Best for complex reasoning",
    contextWindow: 200000,
    costPer1kTokens: { input: 0.003, output: 0.015 },
  },
  {
    id: "anthropic/claude-3.5-sonnet",
    name: "Claude 3.5 Sonnet",
    description: "Excellent balance of speed and intelligence",
    contextWindow: 200000,
    costPer1kTokens: { input: 0.003, output: 0.015 },
  },
  {
    id: "openai/gpt-4o",
    name: "GPT-4o",
    description: "OpenAI flagship model - Fast and capable",
    contextWindow: 128000,
    costPer1kTokens: { input: 0.005, output: 0.015 },
  },
  {
    id: "openai/gpt-4o-mini",
    name: "GPT-4o Mini",
    description: "Fast and affordable for simpler tasks",
    contextWindow: 128000,
    costPer1kTokens: { input: 0.00015, output: 0.0006 },
  },
  {
    id: "google/gemini-2.0-flash-exp:free",
    name: "Gemini 2.0 Flash (Free)",
    description: "Free tier - Great for testing",
    contextWindow: 1000000,
    costPer1kTokens: { input: 0, output: 0 },
  },
  {
    id: "google/gemini-pro-1.5",
    name: "Gemini Pro 1.5",
    description: "Long context window - 1M tokens",
    contextWindow: 1000000,
    costPer1kTokens: { input: 0.00125, output: 0.005 },
  },
  {
    id: "meta-llama/llama-3.3-70b-instruct",
    name: "Llama 3.3 70B",
    description: "Open source - Excellent performance",
    contextWindow: 131072,
    costPer1kTokens: { input: 0.00035, output: 0.0004 },
  },
  {
    id: "mistralai/mistral-large",
    name: "Mistral Large",
    description: "Mistral flagship - Strong reasoning",
    contextWindow: 128000,
    costPer1kTokens: { input: 0.002, output: 0.006 },
  },
  {
    id: "deepseek/deepseek-chat",
    name: "DeepSeek V3",
    description: "Cost-effective with strong coding abilities",
    contextWindow: 64000,
    costPer1kTokens: { input: 0.00014, output: 0.00028 },
  },
  {
    id: "qwen/qwen-2.5-72b-instruct",
    name: "Qwen 2.5 72B",
    description: "Strong multilingual and coding model",
    contextWindow: 131072,
    costPer1kTokens: { input: 0.00035, output: 0.0004 },
  },
];

// Create OpenRouter provider instance
export function createOpenRouterProvider(apiKey: string) {
  return createOpenRouter({
    apiKey,
  });
}

// Get model by ID
export function getModelById(modelId: string): ModelConfig | undefined {
  return AVAILABLE_MODELS.find((m) => m.id === modelId);
}

// Get model display name
export function getModelDisplayName(modelId: string): string {
  const model = getModelById(modelId);
  return model?.name ?? modelId;
}

// Default model
export const DEFAULT_MODEL = "google/gemini-2.0-flash-exp:free";
