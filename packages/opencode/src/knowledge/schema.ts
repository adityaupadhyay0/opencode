/**
 * CTOSync Org Knowledge Graph Schema
 *
 * Defines the core entities and relations that the Strategic Agent uses
 * to understand the organization.
 */

export type EntityType =
  | 'team'
  | 'contributor'
  | 'repository'
  | 'epic'
  | 'decision'
  | 'stack'
  | 'vendor'
  | 'okr';

export interface Entity {
  id: string;
  type: EntityType;
  name: string;
  metadata: Record<string, any>;
  createdAt: number;
  updatedAt: number;
}

export interface Relation {
  fromId: string;
  toId: string;
  label: string; // e.g., 'owns', 'manages', 'depends_on', 'contributes_to'
  metadata?: Record<string, any>;
}

export interface KnowledgeGraph {
  entities: Entity[];
  relations: Relation[];
}

/**
 * Example Ingestor Interface
 */
export interface Ingestor {
  ingest(path: string): Promise<KnowledgeGraph>;
}
