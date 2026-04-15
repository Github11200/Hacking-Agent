import { Tool } from "@mastra/core/tools";
import z from "zod";
import { $, execa } from "execa";

export const runCommand = new Tool({
  id: "run-command",
  description: "Runs any command in the terminal",
  inputSchema: z.object({
    name: z
      .string()
      .describe("The name of the command, e.g. `ls` or `hashcat`"),
    args: z
      .array(z.string())
      .describe("The arguments to pass to the command, e.g. `-a`, `--needed`")
      .or(z.undefined()),
  }),
  outputSchema: z.object({
    message: z.string().describe("The output from running the command"),
    successful: z
      .boolean()
      .describe("Whether running the command was successful or not"),
  }),
  execute: async (commandInformation) => {
    console.log("=================================");

    const result = await execa(
      commandInformation.name,
      commandInformation.args,
      { shell: true },
    );

    if (result.failed) {
      return {
        message: `Error: ${result.stderr}`,
        successful: false,
      };
    }

    return {
      message: `Output: ${result.stdout}`,
      successful: true,
    };
  },
});
