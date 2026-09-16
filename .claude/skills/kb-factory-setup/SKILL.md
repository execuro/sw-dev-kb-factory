---
name: kb-factory-setup
description: Make a fresh clone of the KB Factory ready to run — install the two kb-verify hooks and the KB_* root variables into the factory's own .claude/settings.json, and create the external sources under .sources/ via npm run setup. Shows a diff and asks before writing, merges rather than replaces, never removes or loosens an existing rule, and is safe to re-run after an update. Claude-Code-only by design. Tooling skill of the kb-factory-* family — it configures the factory, it never ingests, verifies or edits wiki content.
when_to_use: Trigger phrases — "set up the KB factory", "kb-factory-setup", "a fresh KB clone won't run", "install the kb-verify hooks", "the scope fence isn't registered", "prepare the factory for ingestion".
argument-hint: [--check]
allowed-tools: Read Edit Write Glob AskUserQuestion Bash(npm run setup*) Bash(ls *) Bash(git -C * rev-parse *)
user-invocable: true
---

# KB Factory setup

Writes the factory's local configuration. A fresh clone of the factory is not ready for
`kb-factory-verify` or an ingest writer run until this has been run: the objectivity model depends
on two hooks that no clone can install for itself, and the code check depends on sources that are
deliberately not committed.

**Claude-Code-only** by design: the hooks and sub-agents this skill installs are Claude Code
features. Other assistants are served by the npm package the factory *produces* — an stdio MCP
server any MCP client can run — not by running the factory itself.

## What it installs

Two groups, both into the **factory's own** `.claude/settings.json` (never the consumer's):

### 1. The hooks — without these the benchmark measures nothing

| Hook | Event | Why it is not optional |
| --- | --- | --- |
| `kb-verify-scope-fence.sh` | `PreToolUse`, matcher `Read\|Grep\|Glob\|Bash\|Write` | Makes each verify option's corpus isolation real rather than promised, and fences the four ingest writers to their own read/write scopes. `kb-factory-verify` refuses to start without it, and rightly: a run without the fence is not a measurement |
| `kb-verify-record-transcript.sh` | `SubagentStop`, matcher `.*discover-.*` | Records each discover agent's transcript path, which is where the auditor's ground-truth call log comes from. Without it every access-cost number would fall back to an agent's self-report |

### 2. The `KB_*` roots

These eight names are **the only root configuration in the system**: `src/paths.ts` reads them, both
hooks read them, the skills interpolate them, and this skill writes them. `KB_CORPUS` and
`KB_VERIFY_DENIAL_LOG` are deliberately *not* in the set — they are run-scoped, not installation-scoped.

| Variable | Value |
| --- | --- |
| `KB_FACTORY_ROOT` | the factory directory |
| `KB_SOURCES_ROOT` | `<factory>/.sources` |
| `KB_SHOPWARE_ROOT` | `<factory>/.sources/shopware` |
| `KB_DOCS_ROOT` | `<factory>/.sources/docs` |
| `KB_WIKI_ROOT` | `<factory>/wiki` |
| `KB_CACHE_ROOT` | `<factory>/ingest/platform/.cache` |
| `KB_REPORTS_ROOT` | `<factory>/.claude/skills/kb-factory-verify/reports` |
| `KB_PROJECT_WIKI` | the **host** project's `docs/project-wiki` — the one root that is genuinely not the factory's |

Everything still works read-only without them: `paths.ts` anchors on its own module location and the
hooks probe for the factory's `package.json`. The variables make that explicit and survive a move.

## Steps

### 1. Detect the layout

Probe, in order, and say which one was found:

| Probe | Layout | `<factory>` |
| --- | --- | --- |
| `${CLAUDE_PROJECT_DIR}/sw-ai-sdk/libs/sw-dev-kb-factory/package.json` exists | vendored inside a host project | that directory |
| `${CLAUDE_PROJECT_DIR}/sw-dev-kb-factory/package.json` exists | checked out beside a host project | that directory |
| `${CLAUDE_PROJECT_DIR}/package.json` names the factory | standalone factory repository | `${CLAUDE_PROJECT_DIR}` |

This one probe is why nothing else in the factory needs editing when it moves.

### 2. Report the current state

Read `<factory>/.claude/settings.json` (absent is normal on a fresh clone) and print one table:

| Row | Ticked when |
| --- | --- |
| Scope fence hook | registered under `hooks.PreToolUse` with a matcher covering `Read\|Grep\|Glob\|Bash\|Write` |
| Transcript hook | registered under `hooks.SubagentStop` with a matcher covering `.*discover-.*` |
| Hook scripts executable | both `.sh` files exist and are `+x` |
| `KB_*` roots | all eight present in `env` and pointing at the detected layout |
| External sources | `.sources/manifest.json` exists and every entry it lists is `status: "ok"` or a documented skip |

With `--check`, stop here. Print the table and nothing else; write nothing.

### 3. Ask once

If every row is ticked, say so and stop — a satisfied setup asks nothing.

Otherwise show the **exact diff** that would be written to `.claude/settings.json` and ask the user
to approve it, in one question. Ask the user and use a structured question tool if you have one
(Claude Code: `AskUserQuestion`), then end the turn if no reply arrives inline; otherwise ask as a
numbered list with the recommended option first.

### 4. Write

On approval:

- **Merge, never replace.** Read the existing settings, add only the missing entries, preserve every
  other key byte-for-byte. Never remove or loosen a rule the user already has — if a hook is present
  with a different matcher, report it and leave it alone rather than overwriting someone's
  deliberate narrowing.
- `chmod +x` the two hook scripts if needed.
- Run `npm run setup` (from the factory root) for the External sources row. It is idempotent, resumable
  and an offline no-op when already satisfied, so re-running it is always safe.
- A **skipped merchant clone is not a failure** — an optional source that cannot be fetched is
  reported and the run continues: the merchant repository is private, the committed
  `wiki/platform/func/` layer stays usable, and the row is reported as a documented skip rather than
  a missing prerequisite.

### 5. Re-check and report

Re-run step 2's checks and print the table again, then one line: what is ready, and what is still
outstanding with the command that fixes it.

## Boundaries

- Writes exactly one file (`<factory>/.claude/settings.json`) plus whatever `npm run setup` creates
  under the gitignored `.sources/`. Never touches wiki content, `kb.config.json`,
  `ingest/platform/config.json`, prompts, state or any report.
- Never commits.
- Never installs anything into a **consumer's** settings — a consumer project is configured by its
  own setup command, and the
  two must not be confused: this one configures the factory that *builds* the KB.
