import { Command } from "commander";
import React from "react";
import { render } from "ink";
import { App } from "../ui/App.js";
import { getDefaultModel } from "../../config/settings.js";

export function createChatCommand(program: Command) {
  program
    .command("chat")
    .description("Start an interactive chat session with the AI")
    .option(
      "-m, --model <model>",
      "Model to use (e.g., anthropic/claude-3.5-sonnet)"
    )
    .action(async (options) => {
      const modelId = options.model ?? getDefaultModel();

      const { waitUntilExit } = render(
        React.createElement(App, { initialModel: modelId })
      );

      await waitUntilExit();
    });
}
