import React, { useState } from "react";
import { Box, Text, useInput } from "ink";
import TextInput from "ink-text-input";

interface InputPromptProps {
  onSubmit: (value: string) => void;
  placeholder?: string;
  prefix?: string;
  disabled?: boolean;
}

export const InputPrompt: React.FC<InputPromptProps> = ({
  onSubmit,
  placeholder = "Type your message...",
  prefix = ">",
  disabled = false,
}) => {
  const [value, setValue] = useState("");

  const handleSubmit = (input: string) => {
    if (input.trim() && !disabled) {
      onSubmit(input.trim());
      setValue("");
    }
  };

  return (
    <Box borderStyle="single" borderColor="gray" paddingX={1} marginTop={1}>
      <Text color="white">{prefix} </Text>
      {disabled ? (
        <Text dimColor>{placeholder}</Text>
      ) : (
        <TextInput
          value={value}
          onChange={setValue}
          onSubmit={handleSubmit}
          placeholder={placeholder}
        />
      )}
    </Box>
  );
};

// Multi-line input with history - Claude Code style
interface AdvancedInputProps {
  onSubmit: (value: string) => void;
  history?: string[];
  disabled?: boolean;
}

export const AdvancedInput: React.FC<AdvancedInputProps> = ({
  onSubmit,
  history = [],
  disabled = false,
}) => {
  const [value, setValue] = useState("");
  const [historyIndex, setHistoryIndex] = useState(-1);

  useInput((input, key) => {
    if (disabled) return;

    // Navigate history with up/down arrows
    if (key.upArrow && history.length > 0) {
      const newIndex = Math.min(historyIndex + 1, history.length - 1);
      setHistoryIndex(newIndex);
      setValue(history[history.length - 1 - newIndex] ?? "");
    }

    if (key.downArrow && historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setValue(history[history.length - 1 - newIndex] ?? "");
    }

    if (key.downArrow && historyIndex === 0) {
      setHistoryIndex(-1);
      setValue("");
    }
  });

  const handleSubmit = (input: string) => {
    if (input.trim() && !disabled) {
      onSubmit(input.trim());
      setValue("");
      setHistoryIndex(-1);
    }
  };

  return (
    <Box borderStyle="single" borderColor="gray" paddingX={1} marginTop={1}>
      <Text color="white">&gt; </Text>
      {disabled ? (
        <Text dimColor>Waiting for response...</Text>
      ) : (
        <TextInput
          value={value}
          onChange={setValue}
          onSubmit={handleSubmit}
          placeholder="Ask me anything... (Ctrl+C to exit)"
        />
      )}
    </Box>
  );
};
