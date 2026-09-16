---
name: kb-factory-ingest-lint
description: Run the ShopwareDevKnowledgeBase platform wiki's build+lint pair in an isolated forked context and return only the error count, the error list, and the warning count. A sub-step of kb-factory-ingest-platform-docs' Step 9 (Lint), used instead of running lint inline when the caller wants raw lint output kept out of the main conversation. Never fixes a lint error, never edits wiki content, config, prompts or ingest tooling, never runs sync/pages/hubs/guidelines/synonyms/eval. Tooling skill of the kb-factory-* family — not for project feature work.
when_to_use: Trigger phrases — "lint the KB wiki", "check KB lint errors", "kb-factory-ingest-lint", "run KB build and lint without the full log".
argument-hint: [--wiki <root>]
allowed-tools: Bash(npm run wiki:build*) Bash(npm run wiki:lint*)
context: fork
background: false
model: haiku
user-invocable: true
---

# kb-factory-ingest-lint

Runs the platform wiki's build then lint step and reports only the numbers and the error
list — no judgment, no fixes.

Commands run from the factory root (the repository root in a standalone clone) — `npm run`
resolves `package.json` from the current directory, so no `--prefix` is needed.

## Procedure

1. `npm run wiki:build -- --layer platform [--wiki <root>]`.
2. `npm run wiki:lint -- --layer platform [--wiki <root>]`.
3. Parse the lint command's JSON stdout line for `errors`, the error list, and `warnings`.

`--wiki <root>` (when given in `$ARGUMENTS`) is passed to both commands; default is `./wiki`.

## Never

- Fix, edit, or explain away a lint error — report it as given.
- Edit any wiki content, `index.md`, `manifest.json`, `config.json`, prompts, or ingest
  tooling.
- Run `wiki:sync`, `wiki:pages`, `wiki:hubs`, `wiki:guidelines`, `wiki:synonyms`, or
  `wiki:eval` — build and lint only.
- Launch any sub-agent — this skill has no `Agent` tool grant.

## Report

At most 8 lines:

```
errors: <N>
<one line per error: path — message>
warnings: <N>
```

If `wiki:build` fails before lint can run, report that failure instead and stop.
