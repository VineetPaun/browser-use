import React from "react";
import { Box, Text } from "ink";

// Claude Code style welcome with code snippet
export const Banner: React.FC = () => {
  return (
    <Box flexDirection="column" marginBottom={1} paddingX={1}>
      <Text color="gray"> ✦</Text>
      <Text>
        <Text color="gray"> Welcome to </Text>
        <Text color="red">Browser Use</Text>
        <Text color="gray">!</Text>
      </Text>
      <Text> </Text>
      <Text>
        {" "}
        <Text color="red">while</Text>
        <Text color="gray">(exploring) {"{"}</Text>
      </Text>
      <Text color="gray">
        {" "}
        <Text color="yellow">discover_patterns</Text>
        <Text color="gray">();</Text>
      </Text>
      <Text color="gray">
        {" "}
        <Text color="yellow">make_connections</Text>
        <Text color="gray">();</Text>
      </Text>
      <Text color="gray">
        {" "}
        <Text color="yellow">build_solutions</Text>
        <Text color="gray">(creative);</Text>
      </Text>
      <Text> </Text>
      <Text>
        {" "}
        <Text color="red">if</Text>
        <Text color="gray"> (blocked) {"{"}</Text>
      </Text>
      <Text color="gray">
        {" "}
        <Text color="yellow">try_new_approach</Text>
        <Text color="gray">();</Text>
      </Text>
      <Text color="gray"> {"}"}</Text>
      <Text color="gray"> {"}"}</Text>
    </Box>
  );
};

// Simple text-based banner
export const SimpleBanner: React.FC = () => {
  return (
    <Box flexDirection="column" marginBottom={1} paddingX={1}>
      <Text>
        <Text color="gray">✦ </Text>
        <Text color="red">Browser Use</Text>
      </Text>
    </Box>
  );
};
