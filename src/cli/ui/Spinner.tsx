import React from "react";
import { Box, Text } from "ink";
import Spinner from "ink-spinner";

interface LoadingSpinnerProps {
  text?: string;
  type?: "dots" | "line" | "arc" | "bouncingBar";
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  text = "Thinking...",
  type = "dots",
}) => {
  return (
    <Box paddingX={1}>
      <Text color="gray">✦ </Text>
      <Text color="gray">{text}</Text>
    </Box>
  );
};

interface ThinkingIndicatorProps {
  agentName?: string;
}

// Claude Code style "Simmering..." indicator
export const ThinkingIndicator: React.FC<ThinkingIndicatorProps> = ({
  agentName = "Agent",
}) => {
  return (
    <Box paddingX={1}>
      <Text color="gray">✦ </Text>
      <Text color="gray">Thinking...</Text>
    </Box>
  );
};

interface ToolExecutionIndicatorProps {
  toolName: string;
}

export const ToolExecutionIndicator: React.FC<ToolExecutionIndicatorProps> = ({
  toolName,
}) => {
  return (
    <Box paddingX={1}>
      <Text color="gray">✦ </Text>
      <Text color="gray">Running </Text>
      <Text color="white">{toolName}</Text>
      <Text dimColor>...</Text>
    </Box>
  );
};
