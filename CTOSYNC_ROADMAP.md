# CTOSync Development Roadmap
> **Version:** 1.0 (Official)
> **Status:** Phase 0 - Strategic Foundation
> **Stack:** TypeScript · Bun · SolidJS + opentui (TUI) · MCP (integrations)
> **Fork Base:** opencode-ai/opencode

---

## 1. Executive Summary
CTOSync is a technical leadership command center. It leverages the OpenCode AI engine to provide CTOs with high-level visibility, strategic advice, and autonomous integration capabilities, all within a rich Terminal User Interface (TUI).

This roadmap transitions from a foundational strategic layer (MMP) to a full-featured technical leadership suite (V1) and finally to an enterprise-grade scalable platform.

---

## Phase 0: MMP (Minimum Marketable Product) `[P0]`
**Goal:** Deliver the "Strategy Agent" and the autonomous "Connector" engine.

---

### TASK-001 · Branding & Agent Registry `[x]`

**What:** Rebrand the OpenCode TUI and register the `ctosync` and `connector` agents.

**Where:**
- `packages/opencode/src/cli/logo.ts`
- `packages/opencode/src/agent/agent.ts`
- `packages/opencode/src/agent/prompt/ctosync.txt`
- `packages/opencode/src/agent/prompt/connector.txt`

**How:**
1.  Add `ctosync` ASCII logo to `logo.ts`.
2.  Register `ctosync` (primary) and `connector` (subagent) in `agent.ts`.
3.  Draft system prompts focusing on strategic advice and autonomous coding.

**Done When:**
- [x] Running `bun dev` shows the CTOSync logo.
- [x] `ctosync` and `connector` agents are selectable in the TUI (Tab switcher).

---

### TASK-002 · Org Knowledge Graph — Core Engine `[P0]`

**What:** Build the internal data structure for tracking organizational metadata (teams, tech stack, roadmaps).

**Where:**
- `packages/opencode/src/knowledge/schema.ts`
- `packages/opencode/src/knowledge/store.ts`
- `packages/opencode/src/knowledge/ingestor.ts`

**How:**
1.  **Define Schema**: Create `schema.ts` with interfaces for `Entity` (Team, Repo, Stack, OKR) and `Relation` (owns, depends_on).
2.  **Implement Store**: Build `store.ts` using an in-memory Map (for MMP) that allows querying by type and relationship.
3.  **Build Ingestor**: Create `ingestor.ts` to parse a local `ctosync.json` file and seed the store on startup.

**Done When:**
- [ ] The `ctosync` agent can answer "List our current teams" by querying the Knowledge Graph.
- [ ] `ctosync.json` changes are reflected in the agent's knowledge after a restart.

---

### TASK-003 · Connector Agent — Autonomous Skills `[P0]`

**What:** Enable the `connector` agent to autonomously research APIs and write new "Skills."

**Where:**
- `packages/opencode/src/agent/connector.ts`
- `packages/opencode/src/skill/generated/`

**How:**
1.  **Tools**: Define a `writeSkill(name: string, code: string)` tool for the `connector` agent.
2.  **Research**: Ensure the agent has the `websearch` and `webfetch` tools enabled to read API documentation.
3.  **Verification**: Implement a loop where the agent generates a verification test and runs it to confirm the integration works.

**Done When:**
- [ ] Typing `/connect linear` in the TUI causes the agent to generate a functional Linear skill in `src/skill/generated/linear.ts`.

---

## Phase 1: V1 (Beta Launch) `[P1]`
**Goal:** Deliver the full suite of "10 Killer Features" and multi-project management.

---

### TASK-004 · Engineering Health Dashboard (F-02) `[P1]`

**What:** A rich TUI view for DORA metrics and team velocity.

**Where:**
- `packages/opencode/src/cli/cmd/tui/routes/health.tsx`
- `packages/opencode/src/cli/cmd/tui/component/metrics/`

**How:**
1.  **Routing**: Add a new route `/health` to the TUI router.
2.  **Visualization**: Use `opentui` components to build a layout for:
    - Deployment Frequency & Change Failure Rate.
    - Cycle time trends using ASCII/Block charts.
3.  **Data**: Aggregate metrics from the Knowledge Graph (populated by GitHub/Jira connectors).

**Done When:**
- [ ] Command `/health` opens a metrics dashboard in the terminal.

---

### TASK-005 · Executive Report Engine (F-03) `[P1]`

**What:** Automated generation of technical summaries for boards and investors.

**Where:**
- `packages/opencode/src/strategy/reports/engine.ts`

**How:**
1.  **Summarization**: Implement a tool that pulls the last 30 days of metrics and events from the Knowledge Graph.
2.  **Persona**: Use a specialized prompt to "translate" technical data into a narrative Markdown report.
3.  **Output**: Save the reports to a `reports/` directory.

**Done When:**
- [ ] `/report --type board` generates a professional executive digest Markdown file.

---

### TASK-006 · Multi-Project War Room (F-06) `[P1]`

**What:** Workspace isolation for Fractional CTOs and Agencies.

**Where:**
- `packages/opencode/src/workspace/manager.ts`
- `packages/opencode/src/cli/cmd/tui/component/dialog-workspace.tsx`

**How:**
1.  **Isolation**: Implement `WorkspaceManager` to switch between independent `KnowledgeStore` and session instances.
2.  **UI**: Add a TUI modal (Tab+W) to switch between active client workspaces.

**Done When:**
- [ ] Switching workspaces reloads the entire context and agent memory for a specific project.

---

### TASK-007 · Tech Debt Radar (F-04) `[P1]`

**What:** AI-powered scan of repositories to identify and quantify technical debt.

**Where:**
- `packages/opencode/src/strategy/techdebt/radar.ts`

**How:**
1.  **Scanning**: Implement a background scanner using `ast-grep` or specialized regex patterns.
2.  **Impact Mapping**: Map code issues to business impact scores (Engineering Hours) based on team velocity.
3.  **Prioritization**: Render a ranked list of debt items in the TUI.

**Done When:**
- [ ] `/techdebt` shows a ranked list of debt with ROI estimates for fixing.

---

## Phase 2: Final Production (Enterprise) `[P2]`
**Goal:** Commercialization, security, and enterprise readiness at scale.

---

### TASK-008 · Security & Compliance Watchdog (F-08) `[P2]`

**What:** High-level risk assessments and compliance tracking (SOC2, GDPR).

**How:**
1.  **Aggregation**: Integrate CVE data (Snyk/GitHub Security) into the Knowledge Graph via the Connector Agent.
2.  **Risk Score**: Implement `/security` command to show "Compliance Drift" and "Security Debt."

**Done When:**
- [ ] CTO can see a unified risk score across all projects in the TUI.

---

### TASK-009 · SaaS Gateway & Multi-Tenancy `[P2]`

**What:** Multi-user support, SSO, and cloud-hosted infrastructure.

**Where:**
- `packages/opencode/src/server/auth/`
- `infra/sst.config.ts`

**How:**
1.  **Auth**: Implement OAuth2 (Google/Okta) in the server adapter.
2.  **Deployment**: Build Docker images for the headless agent.
3.  **Infrastructure**: Deploy via SST/AWS with multi-tenant database isolation.

**Done When:**
- [ ] Secure multi-user login is live on the managed SaaS platform.

---

## 5. Summary of Core TUI Commands
| Command | Phase | Description |
| :--- | :--- | :--- |
| `/chat` | MMP | Strategic advice with Org Context. |
| `/connect <api>` | MMP | Autonomously build a new integration. |
| `/health` | V1 | View DORA and team health dashboard. |
| `/report` | V1 | Generate executive-ready summaries. |
| `/techdebt` | V1 | View tech debt score and roadmap. |
| `/workspace` | V1 | Switch between clients/projects. |
| `/security` | Final | High-level risk and compliance overview. |
