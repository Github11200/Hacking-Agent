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
  outputSchema: z.object({
    message: z.string().describe("The output from running the command"),
    successful: z
      .boolean()
      .describe("Whether running the command was successful or not"),
  }),
  execute: async (commandInformation) => {
    console.log("=================================");
    const helpCommand = spawn(commandInformation.name, commandInformation.args);

    let commandOutput = "";
    helpCommand.stdout.on("data", (data) => {
      const decoder = new StringDecoder("utf8");
      const message = decoder.write(data);
      commandOutput += message;
      console.log(message);
    });

    const commandResult: boolean | string = await new Promise(
      (resolve, reject) => {
        helpCommand.on("close", (_) => resolve(true));
        helpCommand.on("error", (err) => reject(err.message));
      },
    );

    if (typeof commandResult === "string") {
      return {
        message: `Output: ${commandOutput}\nError: ${commandResult}`,
        successful: false,
      };
    } else {
      return {
        message: commandOutput,
        successful: true,
      };
    }
  },
});
