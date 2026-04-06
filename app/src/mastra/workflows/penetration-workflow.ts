import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";

const getTools = createStep({
  id: "get-tools",
  description:
    "Get the Kali Linux tools needed to complete the penetration test",
  inputSchema: z
    .string()
    .describe("The task that you are supposed to complete"),
  outputSchema: z
    .array(
      z
        .string()
        .describe(
          "The name of the tool from the Kali Linux tool documentation",
        ),
    )
    .describe("The list of tools that will be needed"),
  execute: async ({ inputData }) => {
    return ["hi"];
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
