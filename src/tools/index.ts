export { fileTools } from "./fileTools.js";
export { searchTools } from "./searchTools.js";
export { browserTools, closeBrowser } from "./browserTools.js";
export { systemTools } from "./systemTools.js";

import { fileTools } from "./fileTools.js";
import { searchTools } from "./searchTools.js";
import { browserTools } from "./browserTools.js";
import { systemTools } from "./systemTools.js";

// All tools combined
export const allTools = [
  ...fileTools,
  ...searchTools,
  ...browserTools,
  ...systemTools,
];
