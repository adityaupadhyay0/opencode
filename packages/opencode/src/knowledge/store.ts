import type { Entity, EntityType, Relation, KnowledgeGraph } from "./schema";

/**
 * KnowledgeStore manages the in-memory representation of the Org Knowledge Graph.
 * In Phase 1, this will be upgraded to a persistent SQLite/Drizzle store.
 */
export class KnowledgeStore {
  private entities: Map<string, Entity> = new Map();
  private relations: Relation[] = [];

  /**
   * Adds or updates an entity in the graph.
   */
  public upsertEntity(entity: Entity): void {
    const now = Date.now();
    if (this.entities.has(entity.id)) {
      const existing = this.entities.get(entity.id)!;
      this.entities.set(entity.id, {
        ...existing,
        ...entity,
        updatedAt: now,
      });
    } else {
      this.entities.set(entity.id, {
        ...entity,
        createdAt: entity.createdAt || now,
        updatedAt: now,
      });
    }
  }

  /**
   * Adds a relation between two entities.
   */
  public addRelation(relation: Relation): void {
    // Check if relation already exists to avoid duplicates
    const exists = this.relations.some(
      (r) =>
        r.fromId === relation.fromId &&
        r.toId === relation.toId &&
        r.label === relation.label
    );
    if (!exists) {
      this.relations.push(relation);
    }
  }

  /**
   * Retrieves an entity by its ID.
   */
  public getEntity(id: string): Entity | undefined {
    return this.entities.get(id);
  }

  /**
   * Finds entities based on a filter.
   */
  public findEntities(filter: Partial<Pick<Entity, "type" | "name">>): Entity[] {
    return Array.from(this.entities.values()).filter((e) => {
      if (filter.type && e.type !== filter.type) return false;
      if (filter.name && !e.name.toLowerCase().includes(filter.name.toLowerCase()))
        return false;
      return true;
    });
  }

  /**
   * Finds neighbors of an entity based on a relation label.
   */
  public getNeighbors(id: string, label?: string): Entity[] {
    return this.relations
      .filter((r) => r.fromId === id && (!label || r.label === label))
      .map((r) => this.entities.get(r.toId))
      .filter((e): e is Entity => !!e);
  }

  /**
   * Returns the entire graph.
   */
  public getGraph(): KnowledgeGraph {
    return {
      entities: Array.from(this.entities.values()),
      relations: [...this.relations],
    };
  }

  /**
   * Clears the store.
   */
  public clear(): void {
    this.entities.clear();
    this.relations = [];
  }
}

// Singleton instance for the MMP
export const globalStore = new KnowledgeStore();
