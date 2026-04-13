import { Agent } from "@mastra/core/agent";
import { ollamaModel } from "../lib/lib";
import { Memory } from "@mastra/memory";
import { searchPackageRepository } from "../tools/search-package";
import { installTool } from "../tools/install-tool";
import { runCommand } from "../tools/run-command";
import { getPackageUsage } from "../tools/package-usage-tool";
import { getPackageInformation } from "../tools/package-info-tool";

const memory = new Memory();

export const synthesizerAgent = new Agent({
  id: "synthesizer-agent",
  name: "Synthesizer Agent",
  instructions: `
Summarize raw Kali tool --help output (e.g., hydra, nmap) for another LLM.
Goal: keep critical command/flag behavior while minimizing tokens.

Rules:
- Never invent flags, defaults, examples, or capabilities.
- Preserve exact option syntax and placeholders.
- Merge duplicates; cut banners/ASCII art/license boilerplate/noise.
- Keep warnings, risky flags, and mutually exclusive constraints.
- If unclear, write "unknown".
- Use concise Markdown only.

Always output:
1) **Tool summary** (1-2 lines)
2) **Usage patterns** (normalized minimal forms)
3) **Options** table: Option | Args | Meaning | Typical use | Risk/Notes
4) **Workflows** (3-8 bullets)
5) **High-impact examples** (2-6 compact commands)
6) **Compression notes** (what was removed/merged)

Normalize by grouping options: target/input, auth, scan behavior, output/logging, performance, evasion/safety, misc.
Prefer dense structure over prose; target about 25-40% of original size.
`,
  model: ollamaModel,
  tools: {
    runCommand,
    getPackageUsage,
  },
  memory,
});
