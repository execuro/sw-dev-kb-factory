# Page article outline

Section outline every `docType: developer` or `docType: functional` page article body must
follow (design spec, "Page frontmatter") — this is `wiki:pages`' own outline, not shared with
`wiki:hubs`/`wiki:guidelines`/`wiki:synonyms`, which have their own output shapes in
`prompts/hub.md`/`prompts/guideline.md`/`prompts/synonyms.md`. Referenced by
`ingest/platform/prompts/page.md` and validated at `wiki:pages --ingest`.

```
## What it is
## When to use
## Key steps / config
## Essential identifiers
## Gotchas
## Version notes
## Code check (<x.y.z.w>)
```

Rules:

- The six canonical `## ` headings above are allowed, exactly as spelled (case-sensitive), each at most once, and always in the order shown. A seventh `## Code check (<x.y.z.w>)` heading — `<x.y.z.w>` the installed `coreVersion` — follows them, last: REQUIRED on every item the batch item marks `codeCheck`, even when it has zero Tier 0 flags; it never appears on a plain item. It is excluded from the article's token-band count (it is verification bookkeeping, not prose).
- `## What it is` is always required. Any other section with nothing substantive to say is OMITTED entirely — no heading, no `—` placeholder.
- Nothing before the first heading except the closing `---` of the YAML frontmatter.
- Sub-structure inside a section (lists, `### `, tables, fenced code) is allowed.
- Verbatim artifacts are REQUIRED: preserve verbatim (in backticks or a short fenced block of ≤ ~12 lines) every un-guessable string the source gives for the topic — exact schema/XSD URLs, fully-qualified class names, config keys/env vars, CLI commands — and the skeletal shape of any JSON/XML/Twig payload the page discusses (structure with real key names; values may be elided). Full listings, sample responses, and multi-file code remain forbidden.
- When the source itself is shorter than the article length minimum, match the source's substance instead — NEVER pad, restate, or invent to reach the band.
