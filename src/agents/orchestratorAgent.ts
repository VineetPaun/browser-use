import { Agent } from "@openai/agents";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { createCoderAgent } from "./coderAgent.js";
import { createBrowserAgent } from "./browserAgent.js";
import { createResearchAgent } from "./researchAgent.js";
import { createSystemAgent } from "./systemAgent.js";
import { getApiKey, getDefaultModel } from "../config/settings.js";
import type { LanguageModelV1 } from "ai";

export interface OrchestratorOptions {
  modelId?: string;
}

export function createOrchestratorAgent(model: LanguageModelV1) {
  // Create specialized agents with the same model
  const coderAgent = createCoderAgent(model);
  const browserAgent = createBrowserAgent(model);
  const researchAgent = createResearchAgent(model);
  const systemAgent = createSystemAgent(model);

  return new Agent({
    name: "Orchestrator",
    instructions: `You are a powerful AI assistant that can help with a wide variety of tasks.

You have access to specialized agents that you can delegate to:

1. **Coder** - For coding, file operations, and software development
   - Reading and writing code files
   - Creating and modifying projects
   - Code analysis and refactoring

2. **Browser** - For web browsing and automation
   - Navigating websites
   - Filling forms and clicking buttons
   - Extracting information from web pages
   - Taking screenshots

3. **Researcher** - For web research and information gathering
   - Searching the web
   - Fetching and analyzing web content
   - Fact-finding and verification
   - Calculations and data analysis

4. **System** - For system tasks and shell commands
   - Running terminal commands
   - Environment information
   - DevOps and automation tasks

When a user asks for help:
1. Analyze their request
2. Decide which agent(s) can best handle the task
3. Delegate to the appropriate agent(s)
4. Synthesize the results into a helpful response

For complex tasks that span multiple domains, you may need to coordinate between multiple agents.

Always be helpful, accurate, and explain your reasoning.`,
    model: model as any,
    handoffs: [coderAgent, browserAgent, researchAgent, systemAgent],
  });
}

// Create orchestrator with a specific model ID
export function createOrchestrator(options: OrchestratorOptions = {}) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error(
      "OpenRouter API key not configured. Run: browser-use config --api-key YOUR_KEY"
    );
  }

  const modelId = options.modelId ?? getDefaultModel();
  const openrouter = createOpenRouter({ apiKey });
  const model = openrouter.chat(modelId);

  return createOrchestratorAgent(model);
}
