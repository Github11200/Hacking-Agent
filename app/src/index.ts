import { createCliRenderer, Text } from "@opentui/core";
import { mastra } from "./mastra";
import { $ } from "execa";
import { penetrationAgent } from "./mastra/agents/penetrator-agent";

const agent = mastra.getAgentById("penetrator-agent");

const stream = await agent.stream([
  {
    role: "user",
    content: `
Do a scan on my current network and just give general information about it.

{ "tools": [ { "package": "nmap", "installed": true },
{ "package": "netdiscover", "installed": true },
{ "package": "angry-ip-scan", "installed": true } ] }
    `,
  },
]);

let res = "";
for await (const chunk of stream.textStream) {
  console.log(chunk);
  res += chunk;
}
