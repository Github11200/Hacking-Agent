import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";
import { InstallationStatus, ToolsList } from "../lib/types";
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
    let successfullyInstalled: string[] = [];

    for (let tool of inputData.tools) {
      const res = await toolInstallerAgent.stream([
        {
          role: "user",
          content: `
          Here is the tool you need to install:
            Name: ${tool.name}
            Install Command (on Ubuntu, convert it to Arch): ${tool.installCommand}`,
        },
      ]);

      let agentOutput = "";
      for await (const chunk of res.textStream) agentOutput += chunk;

      const parsedOutput: InstallationStatus = JSON.parse(agentOutput);

      if (parsedOutput.installed)
        successfullyInstalled.push(parsedOutput.package);
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
