import React from "react";
import { Box, Text } from "ink";

interface StatusBarProps {
  modelName: string;
  status: "ready" | "thinking" | "executing" | "error";
  tokenCount?: number;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  modelName,
  status,
  tokenCount,
}) => {
  return (
    <Box paddingX={1}>
      <Text dimColor>Using </Text>
      <Text color="white">{modelName}</Text>
      {tokenCount !== undefined && (
        <>
          <Text dimColor> · </Text>
          <Text dimColor>{tokenCount.toLocaleString()} tokens</Text>
        </>
      )}
    </Box>
  );
};

// Help bar showing available commands - minimal Claude style
export const HelpBar: React.FC = () => {
  return (
    <Box paddingX={1}>
      <Text dimColor>/help for commands · Ctrl+C to exit</Text>
    </Box>
  );
};

// Welcome message - not needed with code snippet banner
interface WelcomeProps {
  modelName: string;
}

export const Welcome: React.FC<WelcomeProps> = ({ modelName }) => {
  return null; // Banner handles the welcome now
};

// Error display
interface ErrorDisplayProps {
  error: string;
  suggestion?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  suggestion,
}) => {
  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor="red"
      paddingX={2}
      paddingY={1}
    >
      <Text color="red" bold>
        ✕ Error
      </Text>
      <Text color="red">{error}</Text>
      {suggestion && (
        <Box marginTop={1}>
          <Text dimColor>💡 {suggestion}</Text>
        </Box>
      )}
    </Box>
  );
};

// Success message
interface SuccessDisplayProps {
  message: string;
}

export const SuccessDisplay: React.FC<SuccessDisplayProps> = ({ message }) => {
  return (
    <Box paddingX={1}>
      <Text color="green">✓ {message}</Text>
    </Box>
  );
};
