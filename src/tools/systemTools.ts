import { tool } from "@openai/agents";
import { z } from "zod";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// Execute shell command
export const shellCommandTool = tool({
  name: "run_command",
  description:
    "Execute a shell command and return the output. Use with caution.",
  parameters: z.object({
    command: z.string().describe("The shell command to execute"),
    cwd: z.string().optional().describe("Working directory for the command"),
  }),
  execute: async ({ command, cwd }) => {
    try {
      // Block dangerous commands
      const blockedPatterns = [
        /rm\s+-rf\s+[\/~]/i,
        /sudo/i,
        /chmod\s+777/i,
        />\s*\/dev\//i,
        /mkfs/i,
        /dd\s+if=/i,
      ];

      for (const pattern of blockedPatterns) {
        if (pattern.test(command)) {
          return {
            success: false,
            error: "Command blocked for safety reasons",
          };
        }
      }

      const { stdout, stderr } = await execAsync(command, {
        cwd: cwd ?? process.cwd(),
        timeout: 30000, // 30 second timeout
        maxBuffer: 1024 * 1024, // 1MB buffer
      });

      return {
        success: true,
        command,
        stdout: stdout.trim(),
        stderr: stderr.trim(),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: message };
    }
  },
});

// Get environment info
export const getEnvInfoTool = tool({
  name: "get_env_info",
  description: "Get information about the current environment",
  parameters: z.object({}),
  execute: async () => {
    return {
      success: true,
      info: {
        platform: process.platform,
        arch: process.arch,
        nodeVersion: process.version,
        cwd: process.cwd(),
        home: process.env.HOME ?? process.env.USERPROFILE,
        shell: process.env.SHELL ?? process.env.COMSPEC,
      },
    };
  },
});

// Memory/thinking tool for complex reasoning
export const thinkTool = tool({
  name: "think",
  description:
    "Use this tool to think through complex problems step by step. Write your reasoning here.",
  parameters: z.object({
    thought: z.string().describe("Your thought process or reasoning"),
  }),
  execute: async ({ thought }) => {
    return {
      success: true,
      recorded: true,
      thought,
    };
  },
});

// Ask user for input
export const askUserTool = tool({
  name: "ask_user",
  description:
    "Ask the user for clarification or additional information when needed",
  parameters: z.object({
    question: z.string().describe("The question to ask the user"),
  }),
  execute: async ({ question }) => {
    // This will be handled by the UI layer
    return {
      success: true,
      type: "user_input_required",
      question,
    };
  },
});

export const systemTools = [
  shellCommandTool,
  getEnvInfoTool,
  thinkTool,
  askUserTool,
];
