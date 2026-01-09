#!/usr/bin/env node
import "dotenv/config";
import { Command } from "commander";
import chalk from "chalk";
import React from "react";
import { render } from "ink";

import {
  createChatCommand,
  createRunCommand,
  createConfigCommand,
  createModelsCommand,
} from "./cli/commands/index.js";
import { App } from "./cli/ui/App.js";
import { getApiKey, getDefaultModel } from "./config/settings.js";

const program = new Command();

program
  .name("browser-use")
  .description("Multi-agent CLI powered by OpenRouter")
  .version("1.0.0");

// Register commands
createChatCommand(program);
createRunCommand(program);
createConfigCommand(program);
createModelsCommand(program);

// Default action (no command) - start interactive chat
program.action(async () => {
  const apiKey = getApiKey();

  if (!apiKey) {
    console.log();
    console.log(chalk.yellow("  ⚠ OpenRouter API key not configured"));
    console.log();
    console.log(chalk.dim("  To get started:"));
    console.log(
      chalk.dim("    1. Get your API key at https://openrouter.ai/keys")
    );
    console.log(
      chalk.dim("    2. Run: browser-use config set-key YOUR_API_KEY")
    );
    console.log();
    process.exit(1);
  }

  // Start interactive chat
  const { waitUntilExit } = render(
    React.createElement(App, { initialModel: getDefaultModel() })
  );

  await waitUntilExit();
});

// Parse arguments
program.parse();
