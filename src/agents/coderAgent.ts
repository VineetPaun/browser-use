import { Agent } from "@openai/agents";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { fileTools } from "../tools/fileTools.js";
import { getApiKey } from "../config/settings.js";
import type { LanguageModelV1 } from "ai";

export function createCoderAgent(model: LanguageModelV1) {
  return new Agent({
    name: "Coder",
    instructions: `You are an expert software developer and code assistant.

Your capabilities:
- Read, write, and modify code files
- Search through codebases
- Create new files and directories
- Analyze code structure and suggest improvements

When writing code:
- Follow best practices and coding conventions
- Add helpful comments where appropriate
- Consider edge cases and error handling
- Use modern syntax and patterns

When asked to modify code:
- First read the existing code to understand context
- Make minimal, focused changes
- Preserve existing style and conventions

Always explain what you're doing and why.`,
    model: model as any,
    tools: fileTools,
    handoffDescription:
      "Expert at coding, file operations, and software development tasks",
  });
}

// Factory function to create with default model
export function createDefaultCoderAgent() {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("OpenRouter API key not configured");
  }

  const openrouter = createOpenRouter({ apiKey });
  const model = openrouter.chat("anthropic/claude-3.5-sonnet");

  return createCoderAgent(model);
}
