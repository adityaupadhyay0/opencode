import { Plugin } from "../plugin"
import { Format } from "../format"
import { LSP } from "../lsp"
import { File } from "../file"
import { Snapshot } from "../snapshot"
import * as Project from "./project"
import * as Vcs from "./vcs"
import { Bus } from "../bus"
import { Command } from "../command"
import { Instance } from "./instance"
import { Log } from "@/util"
import { FileWatcher } from "@/file/watcher"
import { ShareNext } from "@/share"
import * as Effect from "effect/Effect"
import { Config } from "@/config"
import { defaultIngestor } from "../knowledge/ingestor"
import { createAutoExplorer } from "../knowledge/auto-explorer"
import { Filesystem } from "@/util"
import { AppFileSystem } from "@opencode-ai/core/filesystem"
import path from "path"

export const InstanceBootstrap = Effect.gen(function* () {
  Log.Default.info("bootstrapping", { directory: Instance.directory })
  // everything depends on config so eager load it for nice traces
  yield* Config.Service.use((svc) => svc.get())
  // Plugin can mutate config so it has to be initialized before anything else.
  yield* Plugin.Service.use((svc) => svc.init())
  yield* Effect.all(
    [
      LSP.Service,
      ShareNext.Service,
      Format.Service,
      File.Service,
      FileWatcher.Service,
      Vcs.Service,
      Snapshot.Service,
    ].map((s) => Effect.forkDetach(s.use((i) => i.init()))),
  ).pipe(Effect.withSpan("InstanceBootstrap.init"))

  // CTOSync: Ingest organizational context if present
  const ctosyncPath = path.join(Instance.directory, "ctosync.json")
  if (yield* Effect.promise(() => Filesystem.exists(ctosyncPath))) {
    Log.Default.info("CTOSync: found ctosync.json, ingesting...", { path: ctosyncPath })
    yield* Effect.promise(() => defaultIngestor.ingest(ctosyncPath)).pipe(Effect.ignore)
  }

  // CTOSync: Auto-explore technical structure
  const appFs = yield* AppFileSystem.Service
  const explorer = createAutoExplorer(appFs)
  yield* Effect.promise(() => explorer.scan()).pipe(Effect.ignore)

  yield* Bus.Service.use((svc) =>
    svc.subscribeCallback(Command.Event.Executed, async (payload) => {
      if (payload.properties.name === Command.Default.INIT) {
        Project.setInitialized(Instance.project.id)
      }
    }),
  )
}).pipe(Effect.withSpan("InstanceBootstrap"))
