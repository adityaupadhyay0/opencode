import { KnowledgeStore, globalStore } from "./store";
import type { EntityType } from "./schema";
import * as fs from "node:fs/promises";

/**
 * JSONIngestor handles seeding the KnowledgeStore from ctosync.json.
 */
export class JSONIngestor {
  constructor(private store: KnowledgeStore = globalStore) {}

  /**
   * Reads and parses ctosync.json to populate the store.
   */
  public async ingest(path: string): Promise<void> {
    try {
      const content = await fs.readFile(path, "utf-8");
      const data = JSON.parse(content);

      // 1. Ingest Org Meta
      if (data.org) {
        this.store.upsertEntity({
          id: "org-root",
          type: "vendor" as EntityType, // Using vendor as a catch-all for org root in MMP
          name: data.org.name,
          metadata: data.org,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }

      // 2. Ingest Teams
      if (Array.isArray(data.teams)) {
        for (const team of data.teams) {
          this.store.upsertEntity({
            id: team.id,
            type: "team",
            name: team.name,
            metadata: { members: team.members, stack: team.stack },
            createdAt: Date.now(),
            updatedAt: Date.now(),
          });
        }
      }

      // 3. Ingest Repositories
      if (Array.isArray(data.repositories)) {
        for (const repo of data.repositories) {
          this.store.upsertEntity({
            id: repo.id,
            type: "repository",
            name: repo.name,
            metadata: {},
            createdAt: Date.now(),
            updatedAt: Date.now(),
          });

          // Add ownership relation
          if (repo.owner) {
            this.store.addRelation({
              fromId: repo.owner,
              toId: repo.id,
              label: "owns",
            });
          }
        }
      }

      // 4. Ingest OKRs
      if (Array.isArray(data.okrs)) {
        for (const okr of data.okrs) {
          this.store.upsertEntity({
            id: okr.id,
            type: "okr",
            name: okr.objective,
            metadata: { owner: okr.owner },
            createdAt: Date.now(),
            updatedAt: Date.now(),
          });

          if (okr.owner) {
            this.store.addRelation({
              fromId: okr.owner,
              toId: okr.id,
              label: "contributes_to",
            });
          }
        }
      }
    } catch (error) {
      console.error(`[CTOSync] Failed to ingest ${path}:`, error);
      throw error;
    }
  }
}

export const defaultIngestor = new JSONIngestor();
