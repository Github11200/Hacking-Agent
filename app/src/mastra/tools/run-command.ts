import { Tool } from "@mastra/core/tools";
import z from "zod";
import { spawn } from "child_process";
import { StringDecoder } from "string_decoder";

export const runCommand = new Tool({
  id: "run-command",
  description: "Runs any command in the terminal",
  inputSchema: z.object({
    name: z
      .string()
      .describe("The name of the command, e.g. `ls` or `hashcat`"),
    args: z
      .array(z.string())
      .describe("The arguments to pass to the command, e.g. `-a`, `--needed`"),
  }),
  outputSchema: z
    .boolean()
    .describe("Returns true if the command executed successfully")
    .or(z.string().describe("The error message from running the command")),
  execute: async (commandInformation) => {
    const helpCommand = spawn(commandInformation.name, commandInformation.args);

    helpCommand.stdout.on("data", (data) => {
      const decoder = new StringDecoder("utf8");
      const message = decoder.write(data);
      console.log(message);
    });

    const commandResult: boolean | string = await new Promise(
      (resolve, reject) => {
        helpCommand.on("close", (_) => resolve(true));
        helpCommand.on("error", (err) => reject(err.message));
      },
    );

    return commandResult;
  },
});
