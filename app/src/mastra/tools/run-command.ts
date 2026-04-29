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
  onInputDelta: ({ inputTextDelta }) => {
    console.log(inputTextDelta);
  },
  execute: async (commandInformation, context) => {
    console.log("=================================");

    const result = execa(commandInformation.name, commandInformation.args, {
      shell: true,
    });

    let data = "";
    for await (const line of result) {
      data += line;
      await context?.writer?.write({
        content: line,
        type: "data",
        id: "run-command",
      });
    }

    return {
      message: `Output: ${data}`,
      successful: true,
    };
  },
});
