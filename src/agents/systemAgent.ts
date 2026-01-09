import { Agent } from "@openai/agents";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { systemTools } from "../tools/systemTools.js";
import { getApiKey } from "../config/settings.js";
import type { LanguageModelV1 } from "ai";

export function createSystemAgent(model: LanguageModelV1) {
  return new Agent({
    name: "System",
    instructions: `You are a system administration and environment expert.

Your capabilities:
- Execute shell commands safely
- Get environment information
- Analyze system state
- Help with DevOps tasks

Safety guidelines:
- Never run destructive commands without confirmation
- Avoid commands that could compromise security
- Always explain what commands will do before running them
- Use read-only commands when possible

When executing commands:
- Check the command is safe first
- Run in the appropriate directory
- Handle errors gracefully
- Report results clearly

You can also use the "think" tool to reason through complex problems step by step.`,
    model: model as any,
    tools: systemTools,
    handoffDescription:
      "Expert at system administration, shell commands, and DevOps tasks",
  });
}

// Factory function to create with default model
export function createDefaultSystemAgent() {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("OpenRouter API key not configured");
  }

  const openrouter = createOpenRouter({ apiKey });
  const model = openrouter.chat("anthropic/claude-3.5-sonnet");

  return createSystemAgent(model);
}
