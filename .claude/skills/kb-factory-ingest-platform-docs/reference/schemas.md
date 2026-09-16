# Schemas (authoritative for this repository)

Read this before preparing an agent brief or reviewing ingest output. Condensed from the design spec — if this file and the design spec ever disagree, the design spec wins; update this file to match.

## Ids = wiki-relative paths

| Kind | Path pattern | Example |
|---|---|---|
| Developer page | `platform/dev/<version>/<repo-path-without-.md>.md`; a source `index.md` becomes `_index.md` (`index.md` is reserved for the directory index) | `platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md` |
| Merchant page, current revision | `platform/func/<seoUrl-without-/en/shopware-6-en/>.md` | `platform/func/settings/rules.md` |
| Merchant page, older revision | `…@<swMin>.md` | `platform/func/settings/rules@6.6.10.0.md` |
| Hub | `platform/hubs/<slug>.md` | `platform/hubs/store-api.md` |

**Shared articles**: a developer article identical across versions (same blob SHA on `main`/`v6.6`/`v6.5`) is stored **once**, under the **newest** covered version's path. Its frontmatter `versions` lists every covered major and `sourceUrls` maps each to its URL. Every older version's directory `index.md` still gets a line pointing at the single stored path — lint requires every `index.md` line to resolve to a file whose `versions` contains that directory's version.

All paths are wiki-root-relative and start with the layer (`platform/...`); never relative to the containing file. No `:` or spaces in any path (Windows-safe).

## Page frontmatter

```yaml
---
id: platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md   # = path, exactly
title: Plugin base guide
docType: developer            # | functional
version: "6.7"                 # directory version (dev) or lowest covered major (func)
versions: ["6.7"]              # every major this article is valid for; >1 for shared/range-spanning articles
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/plugin-base-guide.html
sourceUrls: { "6.7": "…", "6.6": "…" }   # shared articles only
sourceHash: <content identity: dev = blob SHA, merchant = sha256 of the fetched markdown>
keywords: ["plugin", "bootstrap", "composer.json", "Plugin class", "install", "activate", "plugin lifecycle", "PluginEntity"]   # 8-15 double-quoted strings, identifiers (verbatim case) + plain-language aliases
summary: One line, used verbatim in index.md   # ≤ 160 chars
lastBuilt: 2026-08-30
relatedPages: [platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals.md]  # optional, ≤4 wiki-relative paths
supersedes: null                # optional; wiki-relative path of the article this one replaces, or null
supersededBy: null              # optional; wiki-relative path of the article that replaces this one, or null
codeCheckedAgainst: "6.7.13.0"  # optional; prefilled by prepare for dev pages of the installed major, never changed by the writer
---
## What it is              # always required
## When to use             # optional — omit entirely when empty
## Key steps / config      # optional — omit entirely when empty
## Essential identifiers   # optional — omit entirely when empty
## Gotchas                 # optional — omit entirely when empty
## Version notes           # optional — omit entirely when empty
## Code check (<coreVersion>)  # REQUIRED, last section — present iff the page's item carried `codeCheck`; see below
```

Merchant pages additionally carry `revision: { range, swMin, swMax, current }`. Body length: 300–800 tokens, up to 1,200 for source pages > 1.5k words (flagged `long` at prepare); the floor scales with the source — effective minimum = min(300, estimated source tokens), so a thin source may honestly yield a proportionally short article, never padded to reach the band. Only the six canonical `## ` headings above are allowed, exactly as spelled (case-sensitive), each at most once, and always in the order shown, plus the seventh and last `## Code check (<coreVersion>)` section, REQUIRED on `codeCheck` items and never present otherwise. `## What it is` is always required. Any other section with nothing substantive to say is OMITTED entirely — no heading, no `—` placeholder. `estimateTokens` (token-band check) excludes the `## Code check` section, so it never counts against the 800-token band.

### `## Code check (<coreVersion>)` (REQUIRED on codeCheck items, absent on plain items)

Written by the writer for page items whose prepared work item carries `codeCheck: { coreVersion, flags }` — developer pages whose `version` equals the installed major. `<coreVersion>` = that item's `codeCheck.coreVersion`, verbatim (e.g. `## Code check (6.7.13.0)`). One line per checked identifier, at most `max(10, number of Tier-0-flagged identifiers)` — the cap never drops below what coverage requires:

```
- confirmed `getEntityName()` — abstract method the plugin must implement — vendor/shopware/core/Framework/DataAbstractionLayer/EntityExtension.php:46
- absent `getDefinitionClass` — no longer declared on EntityExtension
- corrected `use_varnish_xkey` — docs: enabled by default; code: opt-in, requires `SHOPWARE_HTTP_CACHE_ENABLED` — vendor/shopware/core/Framework/Adapter/Cache/CacheStateSubscriber.php:88
```

Status is one of `confirmed | corrected | absent | deprecated | unread | unverified`. `absent` and `unverified` lines carry no `vendor/shopware/…:<line>` path; every other status cites a repo-relative `vendor/shopware/...` path and line. Every identifier in the item's `codeCheck.flags` must appear here with the same status the flag names, and none of those identifiers may appear in `## Key steps / config` or `## Essential identifiers` — those sections state what the installed code actually does. `codeCheckedAgainst` in frontmatter is prefilled at prepare time and the writer never changes it.

Verbatim artifacts are REQUIRED: preserve verbatim (in backticks or a short fenced block of ≤ ~12 lines) every un-guessable string the source gives for the topic — exact schema/XSD URLs, fully-qualified class names, config keys/env vars, CLI commands — and the skeletal shape of any JSON/XML/Twig payload the page discusses (structure with real key names; values may be elided). Full listings, sample responses, and multi-file code remain forbidden.

`relatedPages`/`supersedes`/`supersededBy` are optional structural cross-links (all three absent on every page ingested before this field existed — validation must not require them). `relatedPages` holds up to 4 wiki-relative paths to pages actually seen in the writer's own input batch, never invented ones. `supersedes`/`supersededBy` name the wiki-relative path of the article this one replaces / is replaced by (e.g. a maintenance-mode page pointing at its successor), or `null`. Lint fails if any of these paths does not resolve to a page in the corpus.

## Directory `index.md` line format

One line per page, sorted by path, header block names the directory + version/docType + this format:

```
platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md — Plugin base guide — Create, register and install a plugin skeleton. — plugin, bootstrap, composer.json, Plugin class
```

`path — title — summary — keywords`. In `platform/func/index.md` the title is followed by the covered majors in brackets so a grep for a version hits the right revision: `Rules [6.6, 6.7]`. Shared developer articles get a line in **every** version index they cover, each line pointing at the single stored path.

Source directory `index.md` files are stored as `_index.md` (an ordinary page with page frontmatter) so `index.md` stays reserved for the generated directory index.

## Guideline frontmatter (`wiki/platform/guidelines/<version>/<file>`, optional layer)

```yaml
---
id: platform/guidelines/6.7/backend-architecture-guidelines.md   # = path, exactly — flat filename must end -guidelines.md
title: Backend architecture guidelines
docType: guideline
version: "6.7"                 # quoted string
summary: One line, <=160 chars
keywords: [8-15 lowercase terms]
sources: [{url: "https://developer.shopware.com/docs/...", hash: "..."}, {url: "platform/dev/{v}/...", hash: "..."}]   # ONE line, one entry per curated sourceInputs pattern (not per resolved file); a wiki: pattern's url is the bare wiki-relative path, no "wiki:" prefix — only a code: pattern's url keeps its "code:" prefix
codeVersion: "6.7.13.0+a1b2c3d4"  # quoted; <installed coreVersion>+<vendorHash's first 8 hex chars> (or the pinned checkout's equivalent for 6.6)
lastBuilt: 2026-08-30
---
## Index                        # base files only (base: null, non-empty surfaceFiles) — first heading, links every surface file's wikiPath
## <rule theme>                 # one or more, imperative rules, "Read more: <sources[].url or platform/... path>" per section
## Code check (<codeVersion>)   # required whenever codeCheck.flags is non-empty; otherwise omitted
```

No `sourceUrl`/`versions` fields (unlike page frontmatter) — provenance lives entirely in `sources[]`. `id`/`docType`/`version`/`sources`/`codeVersion` are prefilled at prepare and never changed by the writer. A `Read more:` target is exactly a `sources[].url` or an existing `platform/…` wiki path — never the item's `readPath`. Every markdown link starts with `platform/` or is an `https://` URL on the allowlist (`developer.shopware.com`, `docs.shopware.com`, `github.com/shopware`).

### `## Code check (<codeVersion>)` (guideline files)

Same six statuses as the page version (`confirmed | corrected | absent | deprecated | unread | unverified`), at most 20 lines, but citations are package-relative, not repo-relative: `<core|storefront|administration>/<path-under-that-package-root>:<line>` — resolved against the item's own `codeRoot.packageRoots` (installed `vendor/shopware/<pkg>` or, for `6.6`, the pinned checkout's `src/<Package>`). An `administration/...` citation also accepts the fuller `Resources/app/administration/src/...` form, and a leading `vendor/shopware/` is tolerated on any package. Every identifier in the item's `codeCheck.flags` (`absent`/`deprecated`/`unread`, Tier-0-scanned from `docs:` `sourceInputs` only) must appear here with that same status.

### Size caps

Each guideline file ≤ 12 KB (`sizeLimits.guidelineFileMaxBytes`); a base file plus any one surface file together ≤ 20 KB (`sizeLimits.guidelinePairMaxBytes`).

## Hub frontmatter

```yaml
---
id: platform/hubs/store-api.md
title: Store API
keywords: [store api, checkout, cart, sales-channel]
summary: One line overview of the hub's scope.
members: [platform/dev/6.7/guides/plugins/plugins/checkout/cart/add-cart-discounts.md, …]
lastBuilt: 2026-08-30
---
```

Body = overview prose with relative links to every member, grouped by version where members differ. Ingest requires `members[]` ⊆ existing page paths, every body link resolves, no link leaves `platform/`; a scope that resolves to zero members is simply never prepared (`wiki:hubs --prepare` skips it) — there is no automatic deletion of an already-built hub file whose members later drop to zero. Hubs are cross-cutting topic overviews, **not** a coverage layer — a page belonging to no hub is normal and is not linted (per-directory `index.md` covers every page).

### Hub scopes — `config.json` `hubs[]` (optional)

`{ slug, title, pathPrefixes?, keywords? }[]`. Empty (the default) means hub scopes are **auto-derived** from page-frontmatter keyword clusters: a keyword becomes a hub only when ≥4 pages carry it *and* those pages span more than one directory (a single-directory keyword is already served by that directory's `index.md`), near-identical page-sets are merged, and the ranked result is capped at 30. A non-empty list pins an explicit scope set instead, replacing auto-derivation entirely. Membership resolves as the union of `pathPrefixes` (prefix/glob on page paths) and `keywords` (matched against each built page's frontmatter `keywords`).

## `manifest.json` (per layer, `wiki/platform/manifest.json`)

```json
{
  "contract": 1,
  "versions": ["6.5", "6.6", "6.7"],
  "lastBuilt": "2026-08-30",
  "coreVersion": "6.7.13.0",
  "vendorHash": "sha256 of vendor/composer/installed.json + vendor/composer/autoload_classmap.php",
  "counts": { "dev/6.7": 812, "dev/6.6": 598, "dev/6.5": 466, "func": 228, "hubs": 28 },
  "hubs": 28,
  "pages": {
    "platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md": { "sourceHash": "…", "fileHash": "…" }
  },
  "treeHash": "sha256 over sorted `path:fileHash` lines"
}
```

`coreVersion`/`vendorHash` are written by `wiki:build` from the installed vendor tree (empty/omitted when `codeCheck.enabled` is false) and are carried through by `kb_status`.

Content provenance only — no tool configuration, no ingestion state, no endpoints, no keys. `fileHash` = sha256 of the committed file. `treeHash` = sha256 over the sorted `path:fileHash` lines. ≤ 1 MB. An unknown `contract` major means the layer is not served.

## Synonyms line format (`wiki/platform/synonyms.md`, optional)

One line per concept, sorted by canonical term:

```
promotion — voucher, coupon, discount code, Gutschein, Aktion, PromotionEntity, /store-api/checkout/cart/line-item — platform/dev/6.7/guides/plugins/plugins/checkout/cart/add-cart-discounts.md, platform/func/marketing/promotions.md
```

`canonical term — synonyms, aliases, German UI terms (from merchant pages), class/route/config names — path, path, …`. Every input keyword cluster must land on some line — enforced as a hard ingest failure (`validateSynonymsBatch`), not a lint warning; every path must resolve (lint error if not, on the already-merged file). Merchant pages are the source of the German UI terms since they name admin menus/buttons directly.

## Large-file splitting (hard 512 KB cap on every generated file)

| File | Rule |
|---|---|
| Directory `index.md` | never exceeds the cap (indexes are per directory); if it would, `wiki:build` **fails** — split the source-directory mapping in `config.json` |
| `synonyms.md` | over its own 256 KB cap (`sizeLimits.synonymsMaxBytes`, tighter than the 512 KB generated-file cap) → becomes `platform/synonyms/index.md` (parts + canonical-term ranges) + `platform/synonyms/part-<n>.md` |
| `platform/index.md` | stays small — overview + links only, never lists pages |

Lint errors on any generated file > 512 KB, or any committed file > 1 MB. There is no part-splitting for an over-cap article or hub file in the current implementation — each is checked against its own per-kind byte cap (`pageMaxBytes` 32 KB, `hubMaxBytes` 64 KB) at ingest and rejected outright if it exceeds it; only `synonyms.md` splits.
