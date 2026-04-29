import { useTheme } from "../context/theme";
import { useRoute } from "../context/route";
import { createMemo, For } from "solid-js";
import { globalStore } from "../../../../knowledge/store";
import { CTOSyncLogo } from "../component/logo";

export function Health() {
  const { theme } = useTheme();
  const route = useRoute();

  const teams = createMemo(() => globalStore.findEntities({ type: "team" }));
  const repos = createMemo(() => globalStore.findEntities({ type: "repository" }));

  return (
    <box flexGrow={1} padding={1}>
      <box flexDirection="row" justifyContent="space-between" marginBottom={1} alignItems="center">
        <box flexDirection="row" gap={2} alignItems="center">
          <CTOSyncLogo />
          <text fg={theme.primary} attributes="bold" marginLeft={2}>| Engineering Health Dashboard</text>
        </box>
        <text fg={theme.textMuted}>Press Esc to return</text>
      </box>

      <box flexDirection="row" gap={2} marginBottom={1}>
        <box borderStyle="round" borderColor={theme.border} paddingX={1} flexGrow={1}>
          <text attributes="bold" fg={theme.textMuted}>DEPLOYS / DAY</text>
          <text fg={theme.primary} attributes="bold" fontSize={2}>12.4</text>
          <text fg="green">↑ 12%</text>
        </box>
        <box borderStyle="round" borderColor={theme.border} paddingX={1} flexGrow={1}>
          <text attributes="bold" fg={theme.textMuted}>CHANGE FAILURE</text>
          <text fg="red" attributes="bold" fontSize={2}>2.1%</text>
          <text fg="green">↓ 0.4%</text>
        </box>
        <box borderStyle="round" borderColor={theme.border} paddingX={1} flexGrow={1}>
          <text attributes="bold" fg={theme.textMuted}>LEAD TIME</text>
          <text fg="yellow" attributes="bold" fontSize={2}>4.2d</text>
          <text fg="red">↑ 0.5d</text>
        </box>
      </box>

      <box flexDirection="row" flexGrow={1} gap={2}>
        <box flexGrow={1} borderStyle="round" borderColor={theme.border} padding={1}>
          <text attributes="bold" marginBottom={1}>Org Knowledge Graph</text>
          <box flexDirection="row" gap={4}>
            <box>
              <text fg={theme.textMuted}>Teams</text>
              <text attributes="bold" fg={theme.primary}>{teams().length}</text>
            </box>
            <box>
              <text fg={theme.textMuted}>Repositories</text>
              <text attributes="bold" fg={theme.primary}>{repos().length}</text>
            </box>
          </box>

          <box marginTop={1}>
            <text fg={theme.textMuted} marginBottom={1}>Recent Entities:</text>
            <For each={globalStore.findEntities({}).slice(-5)}>
              {(entity) => (
                <text fg={theme.text}>• <span style={{ fg: theme.primary }}>{entity.type.toUpperCase()}</span> {entity.name}</text>
              )}
            </For>
          </box>
        </box>

        <box width={40} borderStyle="round" borderColor={theme.border} padding={1}>
          <text attributes="bold" marginBottom={1}>Strategic Pulse</text>
          <box>
            <text fg={theme.textMuted}>Deployment Velocity</text>
            <text fg={theme.primary}> ▂▃▅▆▇ ▇▆▅▃▂ </text>
          </box>
          <box marginTop={1}>
            <text fg={theme.textMuted}>Lead Time Trend</text>
            <text fg="yellow">▇▆▅▃▂  ▂▃▅▆▇</text>
          </box>
          <box marginTop={1}>
            <text fg={theme.textMuted}>Change Failure Rate</text>
            <text fg="red">  ▂▃   ▂ </text>
          </box>
        </box>
      </box>
    </box>
  );
}
