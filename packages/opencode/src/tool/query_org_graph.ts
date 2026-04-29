import { Effect, Schema } from "effect";
import * as Tool from "./tool";
import { queryOrgGraph } from "../strategy/knowledge/tool";
import { ZodOverride } from "@/util/effect-zod";

/**
 * Native tool wrapper for queryOrgGraph
 */
export const QueryOrgGraphTool = Tool.define(
  "query_org_graph",
  Effect.gen(function* () {
    const parameters = Schema.declare<unknown>((u): u is unknown => true).annotate({
      [ZodOverride]: queryOrgGraph.args,
    });

    return {
      description: queryOrgGraph.description,
      parameters,
      execute: (args, toolCtx) =>
        Effect.gen(function* () {
          const result = yield* Effect.promise(() => queryOrgGraph.execute(args as any, {} as any));
          return {
            title: "Org Knowledge Graph Query",
            metadata: {},
            output: result,
          };
        }),
    };
  }),
);
