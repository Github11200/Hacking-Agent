import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";
import { ToolsList } from "../lib/types";

export const tools = [
  "hashcat",
  "hydra",
  "metasploit-framework",
  "gemini-cli",
  "nmap",
  "wireshark",
  "aircrack-ng",
  "wifite",
  "responder",
  "fluxion",
  "powershell",
  "sherlock",
  "hping3",
  "sqlmap",
  "bloodhound",
  "gobuster",
  "autopsy",
  "maltego",
  "impacket-scripts",
  "netcat",
  "dirb",
  "snort",
  "whatweb",
  "amass",
  "ettercap",
  "mimikatz",
  "theharvester",
  "subfinder",
  "steghide",
  "recon-ng",
  "reaver",
  "nikto",
  "john",
  "crunch",
  "hexstrike-ai",
  "dnsrecon",
  "dnsenum",
  "dirbuster",
  "bettercap",
  "wpscan",
  "dirsearch",
  "crackmapexec",
  "beef-xss",
  "airgeddon",
  "parsero",
  "netexec",
  "netdiscover",
  "mitm6",
  "armitage",
  "sublist3r",
  "macchanger",
  "evil-winrm",
  "dmitry",
  "chisel",
  "binwalk",
  "yara",
  "wifiphisher",
  "scapy",
  "ffuf",
  "feroxbuster",
  "arjun",
  "yersinia",
  "tiger",
  "tcpdump",
  "sstimap",
  "spiderfoot",
  "smtp-user-enum",
  "rainbowcrack",
  "medusa",
  "ligolo-ng",
  "kismet",
  "fern-wifi-cracker",
  "enum4linux",
  "caido",
  "bulk-extractor",
  "autorecon",
  "assetfinder",
  "veil",
  "tinja",
  "sqlsus",
  "pspy",
  "ollydbg",
  "nuclei",
  "metagoofil",
  "maryam",
  "legion",
  "kerberoast",
  "jadx",
  "hoaxshell",
  "hashid",
  "goldeneye",
  "ghidra",
  "dsniff",
  "cowpatty",
  "cewl",
  "capstone",
  "cadaver",
  "burpsuite",
  "arp-scan",
  "apktool",
];

const getTools = createStep({
  id: "get-tools",
  description:
    "Get the Kali Linux tools needed to complete the penetration test",
  inputSchema: z
    .string()
    .describe("The task that you are supposed to complete"),
  outputSchema: z.object({
    tools: z.array(
      z.object({
        name: z.string(),
        installCommand: z.string(),
      }),
    ),
  }),
  execute: async ({ inputData, mastra }) => {
    const toolPickerAgent = mastra?.getAgent("toolPickerAgent");

    let prompt = `This is what the user would like to achieve: ${inputData}

    These are the tools on the Kali Linux website:
    `;

    tools.forEach((tool, _, __) => {
      prompt += `- ${tool}\n`;
    });

    const response = await toolPickerAgent.stream([
      {
        role: "user",
        content: prompt,
      },
    ]);

    let jsonResponse = "";

    for await (const chunk of response.textStream) {
      process.stdout.write(chunk);
      jsonResponse += chunk;
    }

    const toolsList: ToolsList = JSON.parse(jsonResponse);

    return toolsList;
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
