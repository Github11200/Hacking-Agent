import { Agent } from "@mastra/core/agent";
import { ollamaModel } from "../lib/lib";
import { Memory } from "@mastra/memory";
import { searchPackageRepository } from "../tools/search-package";
import { installTool } from "../tools/install-tool";

const memory = new Memory();

export const toolInstallerAgent = new Agent({
  id: "tool-installer-agent",
  name: "Tool Installer Agent",
  instructions: `You are the Tool Installer Agent.

  You will be given a list of tools to install. Use the search package repository tool to figure out which package repository
  these tools belong to.

  Once that is found, use the install tool to actually have them installed on the user's computer.

  If the install tool returns true for success then you may return true as well to signify the tool was installed successfully.

  OUTPUT FORMAT
  Return ONLY valid JSON (no markdown, no code fences). The top-level value MUST be an object with a "tools" array:
  {
    "tools": [
      {
        "package": "<selected package name>" | null,
        "installed": true | false
      }
    ]
  }
  `,
  model: ollamaModel,
  tools: {
    searchPackageRepository,
    installTool,
  },
  memory,
});
