import { Tool } from "@mastra/core/tools";
import z from "zod";
import { execa } from "execa";
import { synthesizerAgent } from "../agents/synthesizer-agent";
import { mastra } from "..";

export const getPackageUsage = new Tool({
  id: "package-usage-tool",
  description: "Gets information about the package using --help",
  inputSchema: z.object({
    package: z
      .string()
      .describe(
        "The exact name of the downloaded package that you want to use --help on",
      ),
  }),
  outputSchema: z.object({
    message: z.string().describe("The output from running the command"),
    successful: z
      .boolean()
      .describe("Whether running the command was successful or not"),
  }),
  execute: async (data) => {
    const result = await execa(data.package, ["--help"], { shell: true });

    if (result.failed) {
      return {
        message: `Error: ${result.stderr}`,
        successful: false,
      };
    }

    // const stream = await synthesizerAgent.stream(
    //   `Synthesize the following output:\n${result.stdout}`,
    // );

    // let synthesizedOutput = "";
    // for await (const chunk of stream.textStream) {
    //   console.log(chunk);
    //   synthesizedOutput += chunk;
    // }

    return {
      message: `Output: ${result.stdout}`,
      successful: true,
    };
  },
});
