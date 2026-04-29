import { z } from "zod";

/**
 * CTOSync Org Knowledge Graph Schema
 */

export const EntityTypeSchema = z.enum([
  "team",
  "contributor",
  "repository",
  "epic",
  "decision",
  "stack",
  "vendor",
  "okr",
]);

export type EntityType = z.infer<typeof EntityTypeSchema>;

export const EntitySchema = z.object({
  id: z.string(),
  type: EntityTypeSchema,
  name: z.string(),
  metadata: z.record(z.string(), z.unknown()).default({}),
  createdAt: z.number().optional(),
  updatedAt: z.number().optional(),
});

export type Entity = z.infer<typeof EntitySchema>;

export const RelationSchema = z.object({
  fromId: z.string(),
  toId: z.string(),
  label: z.string().describe("e.g., 'owns', 'manages', 'depends_on', 'contributes_to'"),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type Relation = z.infer<typeof RelationSchema>;

export const KnowledgeGraphSchema = z.object({
  entities: z.array(EntitySchema),
  relations: z.array(RelationSchema),
});

export type KnowledgeGraph = z.infer<typeof KnowledgeGraphSchema>;

/**
 * Ingestor interface for populating the graph.
 */
export interface Ingestor {
  ingest(path: string): Promise<void>;
}
