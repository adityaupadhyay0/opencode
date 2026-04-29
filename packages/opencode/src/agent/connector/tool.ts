import { ToolDefinition } from "@opencode-ai/plugin";
import { z } from "zod";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { Instance } from "../../project/instance";

/**
 * Tool for the Connector Agent to write new skills to the codebase.
 */
export const writeSkill: ToolDefinition = {
  description: "Writes a new TypeScript skill to the CTOSync generated skills directory. Use this to implement new integrations.",
  args: {
    name: z.string().describe("The filename of the skill (e.g., 'linear')"),
    code: z.string().describe("The full TypeScript code for the skill"),
    instructions: z.string().describe("The frontmatter and instructions for the SKILL.md"),
  },
  execute: async (args) => {
    const root = Instance.directory;
    const skillsDir = path.join(root, "packages/opencode/src/skill/generated", args.name);

    try {
      await fs.mkdir(skillsDir, { recursive: true });

      // Write the logic
      await fs.writeFile(path.join(skillsDir, "index.ts"), args.code);

      // Write the SKILL.md
      const skillMd = `---
name: ${args.name}
description: Autonomous integration for ${args.name}
---
${args.instructions}`;

      await fs.writeFile(path.join(skillsDir, "SKILL.md"), skillMd);

      return `Successfully synthesized skill "${args.name}" in ${skillsDir}.`;
    } catch (error) {
      return `Failed to write skill: ${error}`;
    }
  },
};
