import type { Entity, EntityType, Relation } from "../../knowledge/schema";
import { globalStore } from "../../knowledge/store";
import { z } from "zod";
import type { ToolDefinition } from "@opencode-ai/plugin";

/**
 * Tool for the Strategic Agent to query the Org Knowledge Graph.
 */
export const queryOrgGraph: ToolDefinition = {
  description:
    "Queries the CTOSync Org Knowledge Graph for information about teams, repositories, tech stacks, and OKRs.",
  args: {
    type: z
      .enum(["team", "contributor", "repository", "epic", "decision", "stack", "vendor", "okr"])
      .optional()
      .describe("Filter by entity type"),
    name: z.string().optional().describe("Filter by entity name (partial match)"),
    id: z.string().optional().describe("Get a specific entity by ID"),
    neighborsOf: z.string().optional().describe("Get neighbors of a specific entity ID"),
    relationLabel: z.string().optional().describe("Filter neighbors by relation label (e.g., 'owns')"),
  },
  execute: async (args) => {
    const id = args.id as string | undefined;
    if (id) {
      const entity = globalStore.getEntity(id);
      return entity ? JSON.stringify(entity, null, 2) : `Entity with ID "${id}" not found.`;
    }

    const neighborsOf = args.neighborsOf as string | undefined;
    const relationLabel = args.relationLabel as string | undefined;
    if (neighborsOf) {
      const neighbors = globalStore.getNeighbors(neighborsOf, relationLabel);
      return neighbors.length > 0
        ? JSON.stringify(neighbors, null, 2)
        : `No neighbors found for "${neighborsOf}"${relationLabel ? ` with label "${relationLabel}"` : ""}.`;
    }

    const type = args.type as EntityType | undefined;
    const name = args.name as string | undefined;
    const entities = globalStore.findEntities({
      type,
      name,
    });

    return entities.length > 0 ? JSON.stringify(entities, null, 2) : "No entities found matching the criteria.";
  },
};
