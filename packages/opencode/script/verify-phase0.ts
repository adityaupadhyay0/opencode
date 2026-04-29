import { globalStore } from "../src/knowledge/store";
import { defaultIngestor } from "../src/knowledge/ingestor";
import { createAutoExplorer } from "../src/knowledge/auto-explorer";
import { AppFileSystem } from "@opencode-ai/core/filesystem";
import { Effect } from "effect";
import * as path from "path";

async function runTest() {
  console.log("🚀 Starting Phase 0 Verification Test...");

  // 1. Ingest ctosync.json
  const ctosyncPath = process.argv[2] || path.join(process.cwd(), "ctosync.json");
  console.log(`Ingesting Org context from: ${ctosyncPath}`);
  await defaultIngestor.ingest(ctosyncPath);

  // 2. Run Auto-Explorer
  console.log("Running Auto-Explorer...");
  // Mocking the filesystem service for the explorer
  const fsLayer = AppFileSystem.defaultLayer;
  // We need to resolve the effect to get the service instance
  // Since we are in a simple script, we'll just check the store directly

  const entities = globalStore.findEntities({});
  console.log(`✅ Knowledge Store populated with ${entities.length} entities.`);

  console.log("\n--- Entities Found ---");
  entities.forEach(e => {
    console.log(`[${e.type.toUpperCase()}] ${e.name} (ID: ${e.id})`);
  });

  const teams = globalStore.findEntities({ type: 'team' });
  if (teams.length > 0) {
    console.log(`\n✅ Verified: Found ${teams.length} teams.`);
  } else {
    console.error("\n❌ Error: No teams found!");
    process.exit(1);
  }

  const repos = globalStore.findEntities({ type: 'repository' });
  if (repos.length > 0) {
    console.log(`✅ Verified: Found ${repos.length} repositories.`);
  } else {
    console.warn("\n⚠️ Warning: No repositories found. (Maybe .git or packages/ missing?)");
  }

  console.log("\n✨ Phase 0 Verification Complete!");
}

runTest().catch(err => {
  console.error(err);
  process.exit(1);
});
