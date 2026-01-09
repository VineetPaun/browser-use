import { tool } from "@openai/agents";
import { z } from "zod";
import { chromium, Browser, Page, BrowserContext } from "playwright";

// Browser state management
let browser: Browser | null = null;
let context: BrowserContext | null = null;
let page: Page | null = null;

// Initialize browser
async function ensureBrowser(): Promise<Page> {
  if (!browser) {
    browser = await chromium.launch({
      headless: true,
    });
    context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    });
    page = await context.newPage();
  }
  return page!;
}

// Close browser
export async function closeBrowser(): Promise<void> {
  if (browser) {
    await browser.close();
    browser = null;
    context = null;
    page = null;
  }
}

// Navigate to URL
export const navigateTool = tool({
  name: "browser_navigate",
  description: "Navigate the browser to a URL",
  parameters: z.object({
    url: z.string().describe("The URL to navigate to"),
  }),
  execute: async ({ url }) => {
    try {
      const browserPage = await ensureBrowser();

      // Add protocol if missing
      const fullUrl = url.startsWith("http") ? url : `https://${url}`;

      await browserPage.goto(fullUrl, { waitUntil: "domcontentloaded" });

      return {
        success: true,
        url: browserPage.url(),
        title: await browserPage.title(),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: message };
    }
  },
});

// Take screenshot
export const screenshotTool = tool({
  name: "browser_screenshot",
  description: "Take a screenshot of the current page",
  parameters: z.object({
    filename: z
      .string()
      .optional()
      .default("screenshot.png")
      .describe("Filename to save the screenshot"),
    fullPage: z
      .boolean()
      .optional()
      .default(false)
      .describe("Whether to take a full page screenshot"),
  }),
  execute: async ({ filename, fullPage }) => {
    try {
      const browserPage = await ensureBrowser();
      const path = `./screenshots/${filename}`;

      await browserPage.screenshot({ path, fullPage });

      return {
        success: true,
        path,
        url: browserPage.url(),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: message };
    }
  },
});

// Click element
export const clickTool = tool({
  name: "browser_click",
  description: "Click on an element on the page",
  parameters: z.object({
    selector: z.string().describe("CSS selector or text content to click"),
  }),
  execute: async ({ selector }) => {
    try {
      const browserPage = await ensureBrowser();

      // Try CSS selector first, then text content
      try {
        await browserPage.click(selector, { timeout: 5000 });
      } catch {
        // Try clicking by text content
        await browserPage.click(`text="${selector}"`, { timeout: 5000 });
      }

      return {
        success: true,
        clicked: selector,
        url: browserPage.url(),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: message };
    }
  },
});

// Type text
export const typeTool = tool({
  name: "browser_type",
  description: "Type text into an input field",
  parameters: z.object({
    selector: z.string().describe("CSS selector for the input field"),
    text: z.string().describe("Text to type"),
    clear: z
      .boolean()
      .optional()
      .default(true)
      .describe("Whether to clear the field first"),
  }),
  execute: async ({ selector, text, clear }) => {
    try {
      const browserPage = await ensureBrowser();

      if (clear) {
        await browserPage.fill(selector, text);
      } else {
        await browserPage.type(selector, text);
      }

      return {
        success: true,
        selector,
        typed: text,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: message };
    }
  },
});

// Get page content
export const getContentTool = tool({
  name: "browser_get_content",
  description: "Get the text content of the current page",
  parameters: z.object({
    selector: z
      .string()
      .optional()
      .describe("CSS selector to get content from (defaults to body)"),
  }),
  execute: async ({ selector }) => {
    try {
      const browserPage = await ensureBrowser();

      const element = await browserPage.$(selector ?? "body");
      const content = element ? await element.textContent() : null;

      // Truncate if too long
      const maxLength = 10000;
      const truncated =
        content && content.length > maxLength
          ? content.substring(0, maxLength) + "...[truncated]"
          : content;

      return {
        success: true,
        url: browserPage.url(),
        title: await browserPage.title(),
        content: truncated ?? "No content found",
        length: content?.length ?? 0,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: message };
    }
  },
});

// Get all links on page
export const getLinksTool = tool({
  name: "browser_get_links",
  description: "Get all links on the current page",
  parameters: z.object({
    filter: z.string().optional().describe("Optional text to filter links by"),
  }),
  execute: async ({ filter }) => {
    try {
      const browserPage = await ensureBrowser();

      const links = await browserPage.$$eval("a[href]", (anchors) =>
        anchors
          .map((a) => ({
            text: a.textContent?.trim() ?? "",
            href: a.href,
          }))
          .filter((l) => l.text && l.href)
      );

      const filtered = filter
        ? links.filter(
            (l) =>
              l.text.toLowerCase().includes(filter.toLowerCase()) ||
              l.href.toLowerCase().includes(filter.toLowerCase())
          )
        : links;

      return {
        success: true,
        url: browserPage.url(),
        links: filtered.slice(0, 50), // Limit results
        count: filtered.length,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: message };
    }
  },
});

// Scroll page
export const scrollTool = tool({
  name: "browser_scroll",
  description: "Scroll the page up or down",
  parameters: z.object({
    direction: z.enum(["up", "down"]).describe("Direction to scroll"),
    amount: z
      .number()
      .optional()
      .default(500)
      .describe("Amount to scroll in pixels"),
  }),
  execute: async ({ direction, amount }) => {
    try {
      const browserPage = await ensureBrowser();

      const scrollAmount = direction === "down" ? amount : -amount;
      await browserPage.evaluate(`window.scrollBy(0, ${scrollAmount})`);

      return {
        success: true,
        direction,
        amount,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: message };
    }
  },
});

// Go back
export const goBackTool = tool({
  name: "browser_go_back",
  description: "Go back to the previous page",
  parameters: z.object({}),
  execute: async () => {
    try {
      const browserPage = await ensureBrowser();
      await browserPage.goBack();

      return {
        success: true,
        url: browserPage.url(),
        title: await browserPage.title(),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: message };
    }
  },
});

// Wait for element
export const waitForElementTool = tool({
  name: "browser_wait_for",
  description: "Wait for an element to appear on the page",
  parameters: z.object({
    selector: z.string().describe("CSS selector to wait for"),
    timeout: z
      .number()
      .optional()
      .default(10000)
      .describe("Timeout in milliseconds"),
  }),
  execute: async ({ selector, timeout }) => {
    try {
      const browserPage = await ensureBrowser();
      await browserPage.waitForSelector(selector, { timeout });

      return {
        success: true,
        selector,
        found: true,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: message };
    }
  },
});

export const browserTools = [
  navigateTool,
  screenshotTool,
  clickTool,
  typeTool,
  getContentTool,
  getLinksTool,
  scrollTool,
  goBackTool,
  waitForElementTool,
];
