import { createCliRenderer, Text } from "@opentui/core";
import { mastra } from "./mastra";

// const renderer = await createCliRenderer({
//   exitOnCtrlC: true,
// });
//

let prompt =
  "Search the package repository for the following tools and install them:\n\n";

const tools = [
  {
    name: "hashcat",
    installCommand: "install",
  },
  {
    name: "hashcat",
    installCommand: "install",
  },
];

tools.forEach((tool, idx) => {
  prompt += `- Name: ${tool.name}\nInstall Command (Ubuntu/Kali hint): ${tool.installCommand}\n\n`;
});

console.log(prompt);
