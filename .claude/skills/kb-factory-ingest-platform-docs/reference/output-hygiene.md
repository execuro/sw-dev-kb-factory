Output hygiene (rejected at ingest): the gate scans your whole output file — including
inside fenced code blocks, except where noted — and rejects:

- HTML comments `<!-- -->` (never wrap a manifest/XML sample in one — paste the tag
  verbatim, no comment markers).
- `<script` tags.
- `javascript:` URIs.
- `data:<mime>;...`/`data:<mime>,...` URIs (the real data-URI shape — a YAML `data:` map
  key is not one).
- Zero-width or bidirectional control characters.
- NUL byte, and any control character other than `\n`/`\t`.
- Any link that is not `https://` on an allowlisted host: `developer.shopware.com`,
  `docs.shopware.com` (or a subdomain of either), or `github.com/shopware/...`.
- Prompt-injection-like phrases, checked in prose only (outside fenced code): "ignore
  all/previous/prior instructions", "you are now ...", "system prompt", "disregard the/your
  previous/above ...", `<function_calls`, `<invoke`, `<tool_use`.
- A local filesystem path: `/Users/...`, `/home/...`, `C:\...`, or `$HOME`.
- A leaked secret name: `ANTHROPIC_...`, `GITHUB_TOKEN`, or a `Bearer <token>`-shaped
  string (20+ chars).
- A tooling-internal needle that must never reach shipped wiki content: `ingest/`,
  `kb-factory-`, `WIKI_ROOT`, `shopware-dev-knowledge-base` — write vendor/code citations
  package-relative (`vendor/shopware/...`, or for guidelines `core/...`, `storefront/...`,
  `administration/...`), never as an `ingest/...`/`.cache/...` path.

Exemption: page writers only (`kb-factory-ingest-writer`/`kb-factory-ingest-code-writer` on
page batches) may quote a non-allowlisted link or a `data:` URI verbatim from the item's
`sourcePath` text — citing upstream, not inventing. Hub, guideline and synonyms writers get
no such exemption; every URL they write must already be on the allowlist above.

Frontmatter shape (checked separately, still ingest-blocking):

- Double-quote any scalar value that could contain a literal `#` — an unquoted ` #` (or a
  `\"` before a `#`) truncates the rest of the line, including inside a flow list like
  `[a, b #c]`. Never write `\"` inside a double-quoted value.
- The whole frontmatter block must stay under the server's read window (~8 KB) or it is
  truncated and fails to parse.
- `summary`: non-empty string, ≤160 characters.
- `keywords`: 8–15 non-empty strings.
- `lastBuilt`: `YYYY-MM-DD`.
