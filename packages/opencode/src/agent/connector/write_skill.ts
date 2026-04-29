import { Effect, Schema } from "effect";
import * as Tool from "../../tool/tool";
import { writeSkill } from "./tool";
import { ZodOverride } from "@/util/effect-zod";

/**
 * Native tool wrapper for writeSkill
 */
export const WriteSkillTool = Tool.define(
  "write_skill",
  Effect.gen(function* () {
    const parameters = Schema.declare<unknown>((u): u is unknown => true).annotate({
      [ZodOverride]: writeSkill.args,
    });

    return {
      description: writeSkill.description,
      parameters,
      execute: (args, toolCtx) =>
        Effect.gen(function* () {
          const result = yield* Effect.promise(() => writeSkill.execute(args as any, {} as any));
          return {
            title: "Skill Synthesis",
            metadata: {},
            output: result,
          };
        }),
    };
  }),
);
