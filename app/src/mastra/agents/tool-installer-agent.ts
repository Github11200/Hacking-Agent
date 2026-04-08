import { Agent } from "@mastra/core/agent";
import { ollamaModel } from "../lib/lib";
import { getPackageInformation } from "../tools/package-info-tool";
import { Memory } from "@mastra/memory";
import { searchPackageRepository } from "../tools/search-package";
import { installTool } from "../tools/install-tool";

const memory = new Memory();

export const toolInstallerAgent = new Agent({
  id: "tool-installer-agent",
  name: "Tool Installer Agent",
  instructions: ``,
  model: ollamaModel,
  tools: { searchPackageRepository, installTool },
  memory,
});
