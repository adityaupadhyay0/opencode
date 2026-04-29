import { KnowledgeStore, globalStore } from "./store";
import { AppFileSystem } from "@opencode-ai/core/filesystem";
import { Instance } from "../project/instance";
import * as path from "path";
import { Log } from "../util";

const log = Log.create({ service: "knowledge.auto-explorer" });

/**
 * AutoExplorer scans the project structure to discover technical context
 * and update the Org Knowledge Graph.
 */
export class AutoExplorer {
  constructor(
    private store: KnowledgeStore = globalStore,
    private fs: AppFileSystem.Interface
  ) {}

  /**
   * Performs an initial scan of the worktree.
   */
  public async scan(): Promise<void> {
    const root = Instance.directory;
    log.info("Starting auto-exploration", { root });

    try {
      // 1. Identify the root as a repository if it contains .git
      const isGit = await this.fs.existsSafe(path.join(root, ".git"));
      if (isGit) {
        const repoName = path.basename(root);
        this.store.upsertEntity({
          id: `repo-${repoName}`,
          type: "repository",
          name: repoName,
          metadata: { path: root, managed: true },
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }

      // 2. Scan for packages (Monorepo support)
      const packagesDir = path.join(root, "packages");
      if (await this.fs.existsSafe(packagesDir)) {
        const entries = await this.fs.readDirectoryEntries(packagesDir);
        for (const entry of entries) {
          if (entry.type === "directory") {
            const pkgPath = path.join(packagesDir, entry.name);
            this.store.upsertEntity({
              id: `repo-${entry.name}`,
              type: "repository",
              name: entry.name,
              metadata: { path: pkgPath, parent: "packages" },
              createdAt: Date.now(),
              updatedAt: Date.now(),
            });
          }
        }
      }

      log.info("Auto-exploration complete", {
        entities: this.store.findEntities({}).length
      });
    } catch (error) {
      log.error("Auto-exploration failed", { error });
    }
  }
}

export const createAutoExplorer = (fs: AppFileSystem.Interface) => new AutoExplorer(globalStore, fs);
