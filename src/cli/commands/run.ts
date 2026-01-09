import { Command } from "commander";
import chalk from "chalk";
import gradient from "gradient-string";
import ora from "ora";
import { generateText } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { getApiKey, getDefaultModel } from "../../config/settings.js";
import { getModelDisplayName } from "../../config/models.js";

export function createRunCommand(program: Command) {
  program
    .command("run <task>")
    .description("Run a one-off task and get the result")
    .option("-m, --model <model>", "Model to use")
    .option("-v, --verbose", "Show detailed output")
    .action(async (task: string, options) => {
      const apiKey = getApiKey();

      if (!apiKey) {
        console.log(chalk.red("✕ OpenRouter API key not configured"));
        console.log(chalk.dim("Run: browser-use config --api-key YOUR_KEY"));
        process.exit(1);
      }

      const modelId = options.model ?? getDefaultModel();
      const modelName = getModelDisplayName(modelId);

      console.log();
      console.log(gradient(["#00D9FF", "#BD00FF"])("Browser Use"));
      console.log(chalk.dim(`Using ${modelName}`));
      console.log();

      const spinner = ora({
        text: "Thinking...",
        spinner: "dots",
        color: "cyan",
      }).start();

      try {
        const openrouter = createOpenRouter({ apiKey });
        const model = openrouter.chat(modelId);

        const result = await generateText({
          model,
          prompt: task,
          system: `You are Browser Use, a helpful AI assistant.
Be concise but thorough. Provide direct, actionable answers.
Current date: ${new Date().toLocaleDateString()}`,
        });

        spinner.stop();

        console.log(chalk.cyan("AI: ") + result.text);
        console.log();

        if (options.verbose && result.usage) {
          console.log(chalk.dim(`Tokens: ${result.usage.totalTokens}`));
        }
      } catch (error) {
        spinner.stop();
        const message =
          error instanceof Error ? error.message : "Unknown error";
        console.log(chalk.red("✕ Error: ") + message);
        process.exit(1);
      }
    });
}
