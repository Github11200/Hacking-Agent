import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";
import { ToolsList } from "../lib/types";
import { toolNamesList } from "../lib/lib";

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
  execute: async ({ inputData, mastra }) => {
    const toolPickerAgent = mastra?.getAgent("toolPickerAgent");

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
  execute: async (toolsToInstall) => {
    for (let tool of toolsToInstall.tools) {
    }
  },
});

const penetrationWorkflow = createWorkflow({
  id: "penetration-workflow",
  inputSchema: z.object({
    task: z
      .string()
      .describe("The penetration testing the user would like to do"),
  }),
  outputSchema: z.object({
    result: z
      .string()
      .describe(
        "The result of the penetration test and and vulnerabilities found.",
      ),
  }),
  steps: [getTools],
});
