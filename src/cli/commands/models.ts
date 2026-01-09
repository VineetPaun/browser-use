import { Command } from "commander";
import chalk from "chalk";
import gradient from "gradient-string";
import { AVAILABLE_MODELS } from "../../config/models.js";
import { getApiKey, getDefaultModel } from "../../config/settings.js";

export function createModelsCommand(program: Command) {
  program
    .command("models")
    .description("List available AI models")
    .option("-f, --free", "Show only free models")
    .action((options) => {
      console.log();
      console.log(gradient(["#00D9FF", "#BD00FF"])("Available Models"));
      console.log();

      const currentModel = getDefaultModel();
      let models = AVAILABLE_MODELS;

      if (options.free) {
        models = models.filter((m) => m.costPer1kTokens.input === 0);
      }

      for (const model of models) {
        const isCurrent = model.id === currentModel;
        const prefix = isCurrent ? chalk.green("→ ") : "  ";
        const name = isCurrent
          ? chalk.bold.cyan(model.name)
          : chalk.bold(model.name);
        const free =
          model.costPer1kTokens.input === 0 ? chalk.green(" FREE") : "";

        console.log(prefix + name + free);
        console.log(chalk.dim(`    ID: ${model.id}`));
        console.log(chalk.dim(`    ${model.description}`));
        console.log(
          chalk.dim(
            `    Context: ${(model.contextWindow / 1000).toFixed(0)}K tokens`
          )
        );

        if (model.costPer1kTokens.input > 0) {
          console.log(
            chalk.dim(
              `    Cost: $${model.costPer1kTokens.input}/1K in, $${model.costPer1kTokens.output}/1K out`
            )
          );
        }
        console.log();
      }

      console.log(chalk.dim("Use: browser-use config set-model <model-id>"));
      console.log();
    });
}
