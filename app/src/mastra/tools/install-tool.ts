import { Tool } from "@mastra/core/tools";
import z from "zod";
import { spawn } from "child_process";
import { StringDecoder } from "string_decoder";

export const installTool = new Tool({
  id: "install-tool",
  description: "Install the tool onto the user's current system",
  inputSchema: z.object({
    package: z
      .string()
      .describe("The exact name of the Kali Linux tool you want to download"),
    repository: z.enum([
      "Arch User Repository (AUR)",
      "Offical Arch Repositories",
    ]),
  }),
  outputSchema: z
    .boolean()
    .describe("Returns true if the package was installed successfully")
    .or(z.string().describe("The error message from installing the package")),
  execute: async (packageInformation) => {
    let installCommand;
    if (packageInformation.repository === "Arch User Repository (AUR)")
      installCommand = spawn("yay", [
        "-S",
        packageInformation.package,
        "--noconfirm",
      ]);
    else installCommand = spawn("sudo", ["pacman", "-Syu", "--noconfirm"]);

    installCommand.stdout.on("data", (data) => {
      const decoder = new StringDecoder("utf8");
      const message = decoder.write(data);
      console.log(message.trim());
    });

    // Check when the command is done then return a result

    return false;
  },
});
