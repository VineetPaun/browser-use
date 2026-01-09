import { Command } from "commander";
import chalk from "chalk";
import gradient from "gradient-string";
import {
  setApiKey,
  getApiKey,
  setDefaultModel,
  getDefaultModel,
  clearSettings,
} from "../../config/settings.js";
import { AVAILABLE_MODELS, getModelDisplayName } from "../../config/models.js";

export function createConfigCommand(program: Command) {
  const config = program
    .command("config")
    .description("Configure Browser Use settings");

  // Set API key
  config
    .command("set-key <key>")
    .alias("--api-key")
    .description("Set your OpenRouter API key")
    .action((key: string) => {
      setApiKey(key);
      console.log(chalk.green("✓ API key saved successfully"));
    });

  // Show current config
  config
    .command("show")
    .description("Show current configuration")
    .action(() => {
      const apiKey = getApiKey();
      const model = getDefaultModel();

      console.log();
      console.log(
        gradient(["#00D9FF", "#BD00FF"])("Browser Use Configuration")
      );
      console.log();
      console.log(
        chalk.dim("API Key: ") +
          (apiKey ? chalk.green("✓ Configured") : chalk.red("✕ Not set"))
      );
      console.log(
        chalk.dim("Default Model: ") + chalk.cyan(getModelDisplayName(model))
      );
      console.log();
    });

  // Set default model
  config
    .command("set-model <model>")
    .description("Set the default model to use")
    .action((modelId: string) => {
      // Validate model exists
      const model = AVAILABLE_MODELS.find((m) => m.id === modelId);

      if (!model) {
        console.log(chalk.yellow("⚠ Unknown model: " + modelId));
        console.log(
          chalk.dim("Setting anyway - make sure it exists on OpenRouter")
        );
      }

      setDefaultModel(modelId);
      console.log(
        chalk.green("✓ Default model set to: ") +
          chalk.cyan(getModelDisplayName(modelId))
      );
    });

  // List available models
  config
    .command("models")
    .description("List available models")
    .action(() => {
      console.log();
      console.log(gradient(["#00D9FF", "#BD00FF"])("Available Models"));
      console.log();

      const currentModel = getDefaultModel();

      for (const model of AVAILABLE_MODELS) {
        const isCurrent = model.id === currentModel;
        const prefix = isCurrent ? chalk.green("→ ") : "  ";
        const name = isCurrent ? chalk.bold.cyan(model.name) : model.name;
        const free =
          model.costPer1kTokens.input === 0 ? chalk.green(" (free)") : "";

        console.log(prefix + name + free);
        console.log(chalk.dim(`    ${model.id}`));
        console.log(chalk.dim(`    ${model.description}`));
        console.log();
      }
    });

  // Reset config
  config
    .command("reset")
    .description("Reset all settings to defaults")
    .action(() => {
      clearSettings();
      console.log(chalk.green("✓ Settings reset to defaults"));
    });

  // Allow --api-key flag on main config command
  config
    .option("--api-key <key>", "Set your OpenRouter API key")
    .action((options) => {
      if (options.apiKey) {
        setApiKey(options.apiKey);
        console.log(chalk.green("✓ API key saved successfully"));
      } else {
        // Show help if no subcommand
        config.help();
      }
    });
}
