import { createCliRenderer, Text } from "@opentui/core";
import { mastra } from "./mastra";

const renderer = await createCliRenderer({
  exitOnCtrlC: true,
});
