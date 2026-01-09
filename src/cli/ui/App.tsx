import React, { useState, useEffect, useCallback } from "react";
import { Box, Text, useApp, useInput } from "ink";
import { generateText, streamText } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { Banner, SimpleBanner } from "./Banner.js";
import { MessageList, type Message, StreamingMessage } from "./MessageList.js";
import { AdvancedInput } from "./InputPrompt.js";
import { ModelSelector, CurrentModel } from "./ModelSelector.js";
import {
  LoadingSpinner,
  ThinkingIndicator,
  ToolExecutionIndicator,
} from "./Spinner.js";
import { Welcome, HelpBar, ErrorDisplay, SuccessDisplay } from "./StatusBar.js";
import {
  getApiKey,
  getDefaultModel,
  setDefaultModel,
} from "../../config/settings.js";
import { getModelDisplayName, AVAILABLE_MODELS } from "../../config/models.js";
import { allTools } from "../../tools/index.js";

interface AppProps {
  initialModel?: string;
}

type AppState = "welcome" | "chat" | "model-select" | "error";

export const App: React.FC<AppProps> = ({ initialModel }) => {
  const { exit } = useApp();
  const [state, setState] = useState<AppState>("welcome");
  const [messages, setMessages] = useState<Message[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [modelId, setModelId] = useState(initialModel ?? getDefaultModel());
  const [isProcessing, setIsProcessing] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [currentTool, setCurrentTool] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check API key on mount
  useEffect(() => {
    const apiKey = getApiKey();
    if (!apiKey) {
      setError("OpenRouter API key not configured");
      setState("error");
    } else {
      // Auto-advance to chat after welcome
      const timer = setTimeout(() => setState("chat"), 100);
      return () => clearTimeout(timer);
    }
  }, []);

  // Handle keyboard shortcuts
  useInput((input, key) => {
    if (key.escape) {
      if (state === "model-select") {
        setState("chat");
      }
    }

    if (key.ctrl && input === "c") {
      exit();
    }
  });

  const addMessage = useCallback((message: Omit<Message, "id">) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  }, []);

  const handleSubmit = useCallback(
    async (input: string) => {
      // Handle slash commands
      if (input.startsWith("/")) {
        const command = input.slice(1).toLowerCase().trim();

        if (command === "model" || command === "models") {
          setState("model-select");
          return;
        }

        if (command === "clear") {
          setMessages([]);
          addMessage({ role: "system", content: "Conversation cleared." });
          return;
        }

        if (command === "help") {
          addMessage({
            role: "system",
            content: `Available commands:
  /model  - Change the AI model
  /clear  - Clear conversation history
  /help   - Show this help message
  /exit   - Exit the application`,
          });
          return;
        }

        if (command === "exit" || command === "quit") {
          exit();
          return;
        }

        addMessage({
          role: "system",
          content: `Unknown command: /${command}. Type /help for available commands.`,
        });
        return;
      }

      // Add user message
      addMessage({ role: "user", content: input });
      setHistory((prev) => [...prev, input]);
      setIsProcessing(true);
      setStreamingContent("");
      setError(null);

      try {
        const apiKey = getApiKey();
        if (!apiKey) {
          throw new Error("API key not configured");
        }

        const openrouter = createOpenRouter({ apiKey });
        const model = openrouter.chat(modelId);

        // Build conversation history for context
        const conversationMessages = messages
          .filter((m) => m.role === "user" || m.role === "assistant")
          .map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          }));

        // Use streamText for real-time response
        const result = streamText({
          model,
          messages: [...conversationMessages, { role: "user", content: input }],
          system: `You are Browser Use, a helpful AI assistant with access to various tools.
You can help with coding, web browsing, research, and system tasks.
Be concise but thorough. Use tools when appropriate.
Current date: ${new Date().toLocaleDateString()}`,
        });

        let fullResponse = "";

        try {
          for await (const chunk of result.textStream) {
            fullResponse += chunk;
            setStreamingContent(fullResponse);
          }
        } catch (streamError) {
          // If streaming fails, try to get the full text
          try {
            fullResponse = await result.text;
          } catch {
            throw streamError;
          }
        }

        setStreamingContent("");

        if (fullResponse.trim()) {
          addMessage({
            role: "assistant",
            content: fullResponse,
            agentName: "AI",
          });
        } else {
          addMessage({
            role: "system",
            content:
              "Received empty response from the model. Try again or switch models with /model",
          });
        }
      } catch (err) {
        let errorMessage = err instanceof Error ? err.message : "Unknown error";

        // Provide helpful messages for common errors
        if (errorMessage.toLowerCase().includes("unauthorized")) {
          errorMessage =
            "Invalid API key. Get a valid key at https://openrouter.ai/keys and run: /config set-key YOUR_KEY";
        } else if (errorMessage.toLowerCase().includes("rate limit")) {
          errorMessage =
            "Rate limited. Wait a moment and try again, or switch to a different model with /model";
        } else if (errorMessage.toLowerCase().includes("insufficient")) {
          errorMessage =
            "Insufficient credits. Add credits at https://openrouter.ai or use a free model like google/gemini-2.0-flash-exp:free";
        }

        setError(errorMessage);
        addMessage({
          role: "system",
          content: `Error: ${errorMessage}`,
        });
      } finally {
        setIsProcessing(false);
        setCurrentTool(null);
      }
    },
    [messages, modelId, addMessage, exit]
  );

  const handleModelSelect = useCallback(
    (newModelId: string) => {
      setModelId(newModelId);
      setDefaultModel(newModelId);
      setState("chat");
      addMessage({
        role: "system",
        content: `Switched to ${getModelDisplayName(newModelId)}`,
      });
    },
    [addMessage]
  );

  // Error state
  if (state === "error" && error) {
    return (
      <Box flexDirection="column" padding={1}>
        <SimpleBanner />
        <ErrorDisplay
          error={error}
          suggestion="Run: browser-use config set-key YOUR_OPENROUTER_KEY"
        />
      </Box>
    );
  }

  // Model selection state
  if (state === "model-select") {
    return (
      <Box flexDirection="column" padding={1}>
        <SimpleBanner />
        <ModelSelector onSelect={handleModelSelect} currentModel={modelId} />
        <Box marginTop={1} paddingX={1}>
          <Text dimColor>Press Escape to cancel</Text>
        </Box>
      </Box>
    );
  }

  // Main chat interface - Claude Code style
  return (
    <Box flexDirection="column">
      {messages.length === 0 && <Banner />}

      <MessageList messages={messages} />

      {streamingContent && <StreamingMessage content={streamingContent} />}

      {isProcessing && !streamingContent && <ThinkingIndicator />}

      <AdvancedInput
        onSubmit={handleSubmit}
        history={history}
        disabled={isProcessing}
      />
    </Box>
  );
};

export default App;
