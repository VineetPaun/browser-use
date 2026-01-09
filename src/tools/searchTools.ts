import { tool } from "@openai/agents";
import { z } from "zod";

// Web search tool using DuckDuckGo (no API key required)
export const webSearchTool = tool({
  name: "web_search",
  description: "Search the web for information using DuckDuckGo",
  parameters: z.object({
    query: z.string().describe("The search query"),
    maxResults: z
      .number()
      .optional()
      .default(5)
      .describe("Maximum number of results to return"),
  }),
  execute: async ({ query, maxResults }) => {
    try {
      // Use DuckDuckGo HTML search (no API key needed)
      const encodedQuery = encodeURIComponent(query);
      const url = `https://html.duckduckgo.com/html/?q=${encodedQuery}`;

      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        },
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const html = await response.text();

      // Parse results from HTML (simple regex extraction)
      const results: Array<{ title: string; url: string; snippet: string }> =
        [];
      const resultRegex =
        /<a[^>]*class="result__a"[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>[\s\S]*?<a[^>]*class="result__snippet"[^>]*>([^<]*)<\/a>/gi;

      let match;
      while (
        (match = resultRegex.exec(html)) !== null &&
        results.length < maxResults
      ) {
        results.push({
          url: match[1],
          title: match[2].trim(),
          snippet: match[3].trim(),
        });
      }

      // Fallback: simpler parsing if regex fails
      if (results.length === 0) {
        const linkRegex = /<a[^>]*class="result__a"[^>]*>([^<]*)<\/a>/gi;
        while (
          (match = linkRegex.exec(html)) !== null &&
          results.length < maxResults
        ) {
          results.push({
            url: "",
            title: match[1].trim(),
            snippet: "No snippet available",
          });
        }
      }

      return {
        success: true,
        query,
        results,
        count: results.length,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: message };
    }
  },
});

// Fetch webpage content
export const fetchWebpageTool = tool({
  name: "fetch_webpage",
  description: "Fetch and extract text content from a webpage",
  parameters: z.object({
    url: z.string().url().describe("The URL of the webpage to fetch"),
  }),
  execute: async ({ url }) => {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      const html = await response.text();

      // Simple HTML to text extraction
      const textContent = html
        // Remove script and style tags
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
        // Remove HTML tags
        .replace(/<[^>]+>/g, " ")
        // Decode HTML entities
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        // Clean up whitespace
        .replace(/\s+/g, " ")
        .trim();

      // Truncate if too long
      const maxLength = 10000;
      const truncated =
        textContent.length > maxLength
          ? textContent.substring(0, maxLength) + "...[truncated]"
          : textContent;

      return {
        success: true,
        url,
        content: truncated,
        length: textContent.length,
        truncated: textContent.length > maxLength,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: message };
    }
  },
});

// Get current date/time
export const getDateTimeTool = tool({
  name: "get_datetime",
  description: "Get the current date and time",
  parameters: z.object({
    timezone: z
      .string()
      .optional()
      .default("UTC")
      .describe('Timezone (e.g., "America/New_York", "UTC")'),
  }),
  execute: async ({ timezone }) => {
    try {
      const now = new Date();
      const formatted = now.toLocaleString("en-US", {
        timeZone: timezone,
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short",
      });

      return {
        success: true,
        iso: now.toISOString(),
        formatted,
        timezone,
        timestamp: now.getTime(),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: message };
    }
  },
});

// Calculate math expressions
export const calculateTool = tool({
  name: "calculate",
  description: "Evaluate a mathematical expression",
  parameters: z.object({
    expression: z
      .string()
      .describe('The math expression to evaluate (e.g., "2 + 2", "sqrt(16)")'),
  }),
  execute: async ({ expression }) => {
    try {
      // Safe math evaluation (only allows numbers and basic operators)
      const sanitized = expression.replace(/[^0-9+\-*/().%\s^]/gi, "");

      // Replace ^ with ** for exponentiation
      const withPow = sanitized.replace(/\^/g, "**");

      // Use Function constructor for evaluation (safer than eval)
      const result = new Function(`return ${withPow}`)();

      if (typeof result !== "number" || isNaN(result)) {
        throw new Error("Invalid expression");
      }

      return {
        success: true,
        expression,
        result,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: message };
    }
  },
});

export const searchTools = [
  webSearchTool,
  fetchWebpageTool,
  getDateTimeTool,
  calculateTool,
];
