import { Agent } from "@mastra/core/agent";
import { ollamaModel } from "../lib/lib";
import { getPackageInformation } from "../tools/package-info-tool";
import { Memory } from "@mastra/memory";

const memory = new Memory();

export const toolPickerAgent = new Agent({
  id: "tool-picker-agent",
  name: "Tool Picker Agent",
  instructions: `You pick the most relevant Kali Linux security tools for the user's objective.

CRITICAL: You MUST use the getPackageInformation tool before responding. Never guess tool details.

PROCESS:
1. Identify some candidate tools from Kali Linux that match the user's objective
2. USE getPackageInformation tool for EACH candidate (call the tool multiple times if needed)
3. From the package info, extract the exact install command and verify tool details
4. Select the MOST relevant tools based on the package information, if all are relevant, give them all.
5. Output ONLY the JSON below - NO explanations and no other characters as this raw JSON will be parsed

OUTPUT FORMAT:
{
  "tools": [
    {
      "name": "exact-tool-name",
      "installCommand": "sudo apt install tool-name"
    }
  ]
}

RULES:
- ALWAYS call getPackageInformation before outputting
- Extract "install command" from package info "How to install" section
- Output ONLY valid JSON`,
  model: ollamaModel,
  tools: { getPackageInformation },
  memory,
});
