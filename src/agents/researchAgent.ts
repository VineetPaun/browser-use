import { Agent } from "@openai/agents";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { searchTools } from "../tools/searchTools.js";
import { getApiKey } from "../config/settings.js";
import type { LanguageModelV1 } from "ai";

export function createResearchAgent(model: LanguageModelV1) {
  return new Agent({
    name: "Researcher",
    instructions: `You are an expert research assistant.

Your capabilities:
- Search the web for information
- Fetch and analyze webpage content
- Synthesize information from multiple sources
- Perform calculations
- Get current date and time

Research methodology:
1. Understand the research question
2. Break it into searchable queries
3. Search for relevant information
4. Verify facts across multiple sources
5. Synthesize findings into clear answers

When researching:
- Use specific, targeted search queries
- Evaluate source credibility
- Cross-reference important facts
- Cite your sources when possible
- Distinguish between facts and opinions

Always provide comprehensive, well-organized answers with sources.`,
    model: model as any,
    tools: searchTools,
    handoffDescription:
      "Expert at web research, information gathering, and fact-finding",
  });
}

// Factory function to create with default model
export function createDefaultResearchAgent() {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("OpenRouter API key not configured");
  }

  const openrouter = createOpenRouter({ apiKey });
  const model = openrouter.chat("anthropic/claude-3.5-sonnet");

  return createResearchAgent(model);
}
