import { Agent } from "@openai/agents";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { browserTools } from "../tools/browserTools.js";
import { getApiKey } from "../config/settings.js";
import type { LanguageModelV1 } from "ai";

export function createBrowserAgent(model: LanguageModelV1) {
  return new Agent({
    name: "Browser",
    instructions: `You are an expert web browser automation agent.

Your capabilities:
- Navigate to websites
- Click on elements
- Fill out forms
- Take screenshots
- Extract content from pages
- Find and follow links

When browsing:
- Wait for pages to load before interacting
- Use clear, specific selectors
- Handle errors gracefully
- Report what you see on each page

Navigation tips:
- Always verify the page loaded correctly
- Use descriptive text or CSS selectors to find elements
- Scroll if needed to find elements
- Take screenshots to document your progress

Be methodical and describe what you observe on each page.`,
    model: model as any,
    tools: browserTools,
    handoffDescription:
      "Expert at browser automation, web scraping, and navigating websites",
  });
}

// Factory function to create with default model
export function createDefaultBrowserAgent() {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("OpenRouter API key not configured");
  }

  const openrouter = createOpenRouter({ apiKey });
  const model = openrouter.chat("anthropic/claude-3.5-sonnet");

  return createBrowserAgent(model);
}
