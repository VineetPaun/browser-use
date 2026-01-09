import React, { useState } from "react";
import { Box, Text } from "ink";
import SelectInput from "ink-select-input";
import gradient from "gradient-string";
import { AVAILABLE_MODELS, type ModelConfig } from "../../config/models.js";

interface ModelSelectorProps {
  onSelect: (modelId: string) => void;
  currentModel?: string;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  onSelect,
  currentModel,
}) => {
  const items = AVAILABLE_MODELS.map((model) => ({
    label: `${model.name}${model.id === currentModel ? " ✓" : ""}`,
    value: model.id,
    model,
  }));

  const handleSelect = (item: { value: string }) => {
    onSelect(item.value);
  };

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold>{gradient(["#00D9FF", "#BD00FF"])("Select a Model")}</Text>
      </Box>
      <SelectInput items={items} onSelect={handleSelect} />
    </Box>
  );
};

// Model info display
interface ModelInfoProps {
  model: ModelConfig;
}

export const ModelInfo: React.FC<ModelInfoProps> = ({ model }) => {
  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor="gray"
      paddingX={2}
      paddingY={1}
    >
      <Text bold color="cyan">
        {model.name}
      </Text>
      <Text dimColor>{model.description}</Text>
      <Box marginTop={1}>
        <Text dimColor>Context: </Text>
        <Text>{(model.contextWindow / 1000).toFixed(0)}K tokens</Text>
      </Box>
      <Box>
        <Text dimColor>Cost: </Text>
        <Text>
          ${model.costPer1kTokens.input}/1K in, ${model.costPer1kTokens.output}
          /1K out
        </Text>
      </Box>
    </Box>
  );
};

// Compact model display
interface CurrentModelProps {
  modelId: string;
}

export const CurrentModel: React.FC<CurrentModelProps> = ({ modelId }) => {
  const model = AVAILABLE_MODELS.find((m) => m.id === modelId);
  const displayName = model?.name ?? modelId;

  return (
    <Box>
      <Text dimColor>Model: </Text>
      <Text color="cyan">{displayName}</Text>
      {model?.costPer1kTokens.input === 0 && <Text color="green"> (free)</Text>}
    </Box>
  );
};
