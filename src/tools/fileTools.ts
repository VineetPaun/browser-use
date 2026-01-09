import { tool } from "@openai/agents";
import { z } from "zod";
import * as fs from "fs/promises";
import * as path from "path";

// Read file contents
export const readFileTool = tool({
  name: "read_file",
  description: "Read the contents of a file at the given path",
  parameters: z.object({
    filePath: z.string().describe("The path to the file to read"),
  }),
  execute: async ({ filePath }) => {
    try {
      const absolutePath = path.resolve(filePath);
      const content = await fs.readFile(absolutePath, "utf-8");
      return {
        success: true,
        path: absolutePath,
        content,
        size: content.length,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: message };
    }
  },
});

// Write file contents
export const writeFileTool = tool({
  name: "write_file",
  description:
    "Write content to a file at the given path. Creates directories if needed.",
  parameters: z.object({
    filePath: z.string().describe("The path to the file to write"),
    content: z.string().describe("The content to write to the file"),
  }),
  execute: async ({ filePath, content }) => {
    try {
      const absolutePath = path.resolve(filePath);
      const dir = path.dirname(absolutePath);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(absolutePath, content, "utf-8");
      return {
        success: true,
        path: absolutePath,
        bytesWritten: content.length,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: message };
    }
  },
});

// List directory contents
export const listDirectoryTool = tool({
  name: "list_directory",
  description: "List all files and directories in the given path",
  parameters: z.object({
    dirPath: z.string().describe("The path to the directory to list"),
    recursive: z
      .boolean()
      .optional()
      .default(false)
      .describe("Whether to list recursively"),
  }),
  execute: async ({ dirPath, recursive }) => {
    try {
      const absolutePath = path.resolve(dirPath);

      async function listRecursive(dir: string): Promise<string[]> {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        const results: string[] = [];

        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          const relativePath = path.relative(absolutePath, fullPath);

          if (entry.isDirectory()) {
            results.push(relativePath + "/");
            if (recursive) {
              const subEntries = await listRecursive(fullPath);
              results.push(...subEntries);
            }
          } else {
            results.push(relativePath);
          }
        }
        return results;
      }

      const entries = await listRecursive(absolutePath);
      return {
        success: true,
        path: absolutePath,
        entries,
        count: entries.length,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: message };
    }
  },
});

// Search files by pattern
export const searchFilesTool = tool({
  name: "search_files",
  description: "Search for files matching a pattern in a directory",
  parameters: z.object({
    dirPath: z.string().describe("The directory to search in"),
    pattern: z
      .string()
      .describe('The pattern to match (e.g., "*.ts", "*.json")'),
  }),
  execute: async ({ dirPath, pattern }) => {
    try {
      const absolutePath = path.resolve(dirPath);

      // Simple glob matching
      const regexPattern = pattern
        .replace(/\./g, "\\.")
        .replace(/\*/g, ".*")
        .replace(/\?/g, ".");

      const regex = new RegExp(`^${regexPattern}$`);

      async function searchRecursive(dir: string): Promise<string[]> {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        const results: string[] = [];

        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);

          if (entry.isDirectory()) {
            // Skip node_modules and hidden directories
            if (!entry.name.startsWith(".") && entry.name !== "node_modules") {
              const subResults = await searchRecursive(fullPath);
              results.push(...subResults);
            }
          } else if (regex.test(entry.name)) {
            results.push(path.relative(absolutePath, fullPath));
          }
        }
        return results;
      }

      const matches = await searchRecursive(absolutePath);
      return {
        success: true,
        path: absolutePath,
        pattern,
        matches,
        count: matches.length,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: message };
    }
  },
});

// Delete file
export const deleteFileTool = tool({
  name: "delete_file",
  description: "Delete a file at the given path",
  parameters: z.object({
    filePath: z.string().describe("The path to the file to delete"),
  }),
  execute: async ({ filePath }) => {
    try {
      const absolutePath = path.resolve(filePath);
      await fs.unlink(absolutePath);
      return {
        success: true,
        path: absolutePath,
        message: "File deleted successfully",
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: message };
    }
  },
});

// Create directory
export const createDirectoryTool = tool({
  name: "create_directory",
  description: "Create a directory at the given path",
  parameters: z.object({
    dirPath: z.string().describe("The path to the directory to create"),
  }),
  execute: async ({ dirPath }) => {
    try {
      const absolutePath = path.resolve(dirPath);
      await fs.mkdir(absolutePath, { recursive: true });
      return {
        success: true,
        path: absolutePath,
        message: "Directory created successfully",
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: message };
    }
  },
});

// Get file info
export const getFileInfoTool = tool({
  name: "get_file_info",
  description: "Get metadata about a file or directory",
  parameters: z.object({
    filePath: z.string().describe("The path to the file or directory"),
  }),
  execute: async ({ filePath }) => {
    try {
      const absolutePath = path.resolve(filePath);
      const stats = await fs.stat(absolutePath);

      return {
        success: true,
        path: absolutePath,
        info: {
          isFile: stats.isFile(),
          isDirectory: stats.isDirectory(),
          size: stats.size,
          created: stats.birthtime.toISOString(),
          modified: stats.mtime.toISOString(),
        },
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: message };
    }
  },
});

export const fileTools = [
  readFileTool,
  writeFileTool,
  listDirectoryTool,
  searchFilesTool,
  deleteFileTool,
  createDirectoryTool,
  getFileInfoTool,
];
