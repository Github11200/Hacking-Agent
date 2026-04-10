import { Agent } from "@mastra/core/agent";
import { ollamaModel } from "../lib/lib";
import { Memory } from "@mastra/memory";
import { searchPackageRepository } from "../tools/search-package";
import { installTool } from "../tools/install-tool";
import { runCommand } from "../tools/run-command";
import { getPackageUsage } from "../tools/package-usage-tool";
import { getPackageInformation } from "../tools/package-info-tool";

const memory = new Memory();

export const penetrationAgent = new Agent({
  id: "penetrator-agent",
  name: "Penetration Agent",
  instructions: `
  You are a penetration agent whose responsibility is to penetrate something based on the user's prompt.

  Two agents before you have already found relevant tools and installed them and you will be given a list of tools that were successfully installed.

  Using these tools, you can figure out how to use them using the getPackageUsage tool which will use --help with the tool name. This tool requires the
  following input:

  {
    package: "name of the tool (e.g. hydra or nmap)"
  }

  You also have another tool for running commands in the terminal. This tool requries the command name and arguments that need to be passed. If you
  are unsure of the arguments required then make sure to use the getPackageUsage tool first.

  Continue looping through these tools and running commands until the desired penetration test has been completed.

  Once you are done, and only when the penetration has been completed, can you tell the user the outcome of the penetrationo test and any information
  that was gathered.
`,
  model: ollamaModel,
  tools: {
    runCommand,
    getPackageUsage,
  },
  memory,
});
