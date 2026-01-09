import React from "react";
import { Box, Text, useStdout } from "ink";

export interface Message {
  id: string;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  agentName?: string;
  toolName?: string;
  timestamp?: Date;
}

interface MessageItemProps {
  message: Message;
  terminalWidth?: number;
}

// Wrap text to fit within a given width
function wrapText(text: string, maxWidth: number): string[] {
  if (maxWidth <= 0) return [text];

  const lines: string[] = [];
  const paragraphs = text.split("\n");

  for (const paragraph of paragraphs) {
    if (paragraph.length <= maxWidth) {
      lines.push(paragraph);
      continue;
    }

    const words = paragraph.split(" ");
    let currentLine = "";

    for (const word of words) {
      if (currentLine.length === 0) {
        currentLine = word;
      } else if (currentLine.length + 1 + word.length <= maxWidth) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }
  }

  return lines.length > 0 ? lines : [""];
}

// Claude Code style message item
const MessageItem: React.FC<MessageItemProps> = ({
  message,
  terminalWidth = 80,
}) => {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";

  const contentWidth = Math.max(40, terminalWidth - 6);
  const lines = wrapText(message.content, contentWidth);

  // User messages: simple, no prefix
  if (isUser) {
    return (
      <Box flexDirection="column" paddingX={1}>
        <Box>
          <Text color="white" bold>
            &gt;{" "}
          </Text>
          <Text color="white">{lines[0]}</Text>
        </Box>
        {lines.slice(1).map((line, index) => (
          <Box key={index}>
            <Text> {line}</Text>
          </Box>
        ))}
      </Box>
    );
  }

  // System messages: dimmed
  if (isSystem) {
    return (
      <Box flexDirection="column" paddingX={1}>
        {lines.map((line, index) => (
          <Box key={index}>
            <Text dimColor>{line}</Text>
          </Box>
        ))}
      </Box>
    );
  }

  // AI/Assistant messages: with ✦ prefix
  return (
    <Box flexDirection="column" paddingX={1}>
      <Box>
        <Text color="gray">✦ </Text>
        <Text color="gray">{lines[0]}</Text>
      </Box>
      {lines.slice(1).map((line, index) => (
        <Box key={index}>
          <Text color="gray"> {line}</Text>
        </Box>
      ))}
    </Box>
  );
};

interface MessageListProps {
  messages: Message[];
  maxVisible?: number;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  maxVisible = 20,
}) => {
  const { stdout } = useStdout();
  const terminalWidth = stdout?.columns ?? 80;

  // Show only the last N messages
  const visibleMessages = messages.slice(-maxVisible);
  const hiddenCount = messages.length - visibleMessages.length;

  return (
    <Box flexDirection="column" paddingX={1}>
      {hiddenCount > 0 && (
        <Box marginBottom={1}>
          <Text dimColor italic>
            ... {hiddenCount} earlier message{hiddenCount > 1 ? "s" : ""} hidden
            ...
          </Text>
        </Box>
      )}
      {visibleMessages.map((message) => (
        <MessageItem
          key={message.id}
          message={message}
          terminalWidth={terminalWidth}
        />
      ))}
    </Box>
  );
};

// Streaming message component - Claude Code style
interface StreamingMessageProps {
  content: string;
  agentName?: string;
}

export const StreamingMessage: React.FC<StreamingMessageProps> = ({
  content,
}) => {
  const { stdout } = useStdout();
  const terminalWidth = stdout?.columns ?? 80;
  const contentWidth = Math.max(40, terminalWidth - 6);
  const lines = wrapText(content, contentWidth);

  return (
    <Box flexDirection="column" paddingX={1}>
      <Box>
        <Text color="gray">✦ </Text>
        <Text color="gray">{lines[0]}</Text>
        {lines.length === 1 && <Text color="gray">▊</Text>}
      </Box>
      {lines.slice(1).map((line, index) => (
        <Box key={index}>
          <Text color="gray"> {line}</Text>
          {index === lines.length - 2 && <Text color="gray">▊</Text>}
        </Box>
      ))}
    </Box>
  );
};
