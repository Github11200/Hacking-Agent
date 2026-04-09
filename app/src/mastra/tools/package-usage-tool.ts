import { Tool } from "@mastra/core/tools";
import z from "zod";
import { spawn } from "child_process";
import { StringDecoder } from "string_decoder";

export const getPackageUsage = new Tool({
  id: "package-usage-tool",
  description: "Gets information about the package using --help",
  inputSchema: z
    .string()
    .describe(
      "The exact name of the downloaded package that you want to use --help on",
    ),
  outputSchema: z
    .string()
    .describe("The output of the --help command")
    .or(
      z
        .boolean()
        .describe(
          "Returns false if the command couldn't run since the pacakge doesn't exist",
        ),
    ),
  execute: async (packageName) => {
    const helpCommand = spawn(packageName, ["--help"]);

    let commandOutput = "";
    helpCommand.stdout.on("data", (data) => {
      const decoder = new StringDecoder("utf8");
      const message = decoder.write(data);
      commandOutput += message;
    });

    const commandResult: string | boolean = await new Promise(
      (resolve, reject) => {
        helpCommand.on("exit", (_) => {
          resolve(true);
        });

        helpCommand.on("error", (err) => {
          reject(err.message);
        });
      },
    );

    if (typeof commandResult === "string") return false;
    return commandOutput;
  },
});
