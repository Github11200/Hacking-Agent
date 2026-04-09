import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";
import { InstallationResults, ToolsList } from "../lib/types";
import { toolNamesList } from "../lib/lib";
import { toolPickerAgent } from "../agents/tool-picker-agent";
import { toolInstallerAgent } from "../agents/tool-installer-agent";
import { penetrationAgent } from "../agents/penetrator-agent";

let userPrompt = "";

const getTools = createStep({
  id: "get-tools",
  description:
    "Get the Kali Linux tools needed to complete the penetration test",
  inputSchema: z
    .string()
    .describe("The task that you are supposed to complete"),
  outputSchema: z.object({
    tools: z.array(
      z.object({
        name: z.string(),
        installCommand: z.string(),
      }),
    ),
  }),
  execute: async ({ inputData }) => {
    userPrompt = inputData;

    let prompt = `This is what the user would like to achieve: ${inputData}

    These are the tools on the Kali Linux website:
    `;

    toolNamesList.forEach((tool, _, __) => {
      prompt += `- ${tool}\n`;
    });

    const response = await toolPickerAgent.stream([
      {
        role: "user",
        content: prompt,
      },
    ]);

    let jsonResponse = "";

    for await (const chunk of response.textStream) {
      process.stdout.write(chunk);
      jsonResponse += chunk;
    }

    const toolsList: ToolsList = JSON.parse(jsonResponse);

    return toolsList;
  },
});

const installTools = createStep({
  id: "install-tools",
  description: "Installs the tools based on the package names",
  inputSchema: z.object({
    tools: z.array(
      z.object({
        name: z.string(),
        installCommand: z.string(),
      }),
    ),
  }),
  outputSchema: z
    .array(z.string())
    .describe("Array of the packages that were successfully installed"),
  execute: async ({ inputData }) => {
    console.log(inputData);
    let successfullyInstalled: string[] = [];

    const promptLines: string[] = [];
    promptLines.push(`You are installing tools on Arch Linux.
For EACH tool below:
1) Call searchPackageRepository(...) to find the best matching Arch package (do not guess).
2) Then call installTool(...) for the selected package.
Prefer official Arch repositories when suitable; use AUR only if needed.
Attempt every tool even if earlier ones fail.
Return ONLY valid JSON: { "tools": [{ "package": string|null, "installed": boolean }, ...] }.
The tools array MUST have exactly one item per requested tool, in the same order.

Tools to install:`);

    inputData.tools.forEach((tool, idx) => {
      promptLines.push(
        `${idx + 1}) Name: ${tool.name}`,
        `   Install Command (Ubuntu/Kali hint): ${tool.installCommand}`,
      );
    });

    const res = await toolInstallerAgent.stream([
      {
        role: "user",
        content: promptLines.join("\n"),
      },
    ]);

    let agentOutput = "";
    for await (const chunk of res.textStream) agentOutput += chunk;

    const parsedOutput: InstallationResults = JSON.parse(agentOutput);

    for (const item of parsedOutput.tools ?? []) {
      if (item.installed && item.package)
        successfullyInstalled.push(item.package);
    }

    return successfullyInstalled;
  },
});

const penetrate = createStep({
  id: "penetrate",
  description: "Does the actual penetration for whatever the user asked about",
  inputSchema: z
    .array(z.string())
    .describe("Array of the packages that were successfully installed"),
  outputSchema: z.string().describe("The output of the LLM"),
  execute: async ({ inputData }) => {
    let prompt = `This is the user's prompt: ${userPrompt}\nThese tools were successfully installed:\n`;

    for (const tool of inputData) prompt += `- ${tool}\n`;

    prompt +=
      "Now do the penetration testing and find all the vulenerabilities and penetrate them.";

    const stream = await penetrationAgent.stream([
      {
        role: "user",
        content: prompt,
      },
    ]);

    let res = "";
    for await (const chunk of stream.textStream) res += chunk;

    return res;
  },
});

export const penetrationWorkflow = createWorkflow({
  id: "penetration-workflow",
  inputSchema: z
    .string()
    .describe("The penetration testing the user would like to do"),
  outputSchema: z
    .string()
    .describe("The output of the LLM after doing the penetrating"),
  steps: [getTools, installTools, penetrate],
})
  .then(getTools)
  .then(installTools)
  .then(penetrate);
