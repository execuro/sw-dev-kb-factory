# Source activation

One row per version-entry (plus the portal). `Active` sources are the only ones `sync`/`pages`/`hubs` ever touch by default (`all-active`, or a bare phase name with no source given); an explicit source argument is checked against this table by Step 0 before any work starts.

| Source | docType | Branch/space | Active | Note |
|---|---|---|---|---|
| `developer:6.7` | `developer` | git branch `main` (`github.com/shopware/docs`), content fetched via `raw.githubusercontent.com` | Active | Current version; weekly refresh cadence (10–13 commits/week) |
| `developer:6.6` | `developer` | git branch `v6.6` (`github.com/shopware/docs`), content fetched via `raw.githubusercontent.com` | Active | Frozen since 2026-04-24; branch HEAD-SHA check makes sync a near no-op after the first run |
| `merchant` | `functional` | docs.shopware.com `/en/shopware-6-en` (enumerated via Algolia index `WikiEntry`, appId `NW0OL237LC`) | Active | Versioned per article revision, not per branch; no change signal, so `contentHash` needs a fetch every sync |
| `developer:6.5` | `developer` | git branch `v6.5` (`github.com/shopware/docs`) | **Inactive** — registered, deactivated | Frozen since 2026-04-24. Reactivatable: flip `active:true` on the `6.5` version-entry inside the `developer` source in `ingest/platform/config.json` (not the whole source), then run `developer:6.5` explicitly. Never remove this row from the design or this table |
| `developer-portal` | — (`docType: []`, not content-bearing) | `developer.shopware.com` (`llms.txt`, `sitemap.xml` only) | **Inactive** — registered, deactivated by default, non-content | Not a source this skill ever syncs, builds, or invokes directly. It exists solely to carry the portal's llms.txt/sitemap so the `developer` source's own sync process can reactivate its "unpublished-page" gate (suppressing GitHub content not yet live on the public docs site). While inactive — the default — zero requests reach developer.shopware.com during sync. It is never a valid argument to this skill. |

## The `guidelines` phase's own inputs (not a `pages`/`hubs`-style source)

The `guidelines` phase never takes `--source`; its `sourceInputs` draw on the same downloads the
page sources already produce, plus the `6.6` code checkout — there is no separate guidelines
source, because the developer docs are downloaded whole:

- **`docs:` inputs** — resolved from the `developer:<v>` download's `ingest/platform/.cache/src/developer/<v>/`.
  The `developer` source downloads the complete upstream docs (guidelines and ADRs included,
  upstream `.docsignore` not applied); `docs:` may name any dev page, not only the former
  guidelines/ADR folders. Pending until `wiki:sync` has synced `developer:<v>` at least once.
- **`merchant:` inputs** — resolved from the `merchant` download's `ingest/platform/.cache/src/merchant/`
  (e.g. UX/UI rules from merchant pages). Pending until `wiki:sync` has synced `merchant` at least once.
- **The `6.6` pinned code checkout** — a shallow sparse `git clone` (HTTPS, `github.com`) of
  the `6.6` tag into `.sources/shopware/6.6/`, needed only because `6.6` is not the
  installed vendor major; `code:` `sourceInputs` for `6.6` items read from it. `7.x`/installed-major
  items read `vendor/shopware/` directly and need no checkout.

## Step 0 resolution rule

- Argument is `developer:6.7`, `developer:6.6`, or `merchant` → that source only, scoped through `sync`/`pages`/`hubs` via the CLI's `--source <id>` flag.
- Argument is `all-active` (or `all`, or omitted) → all three active sources.
- Argument is `developer:6.5` → **do no work**. Reply with exactly this shape: "`developer:6.5` is registered but deactivated (frozen since 2026-04-24). Reactivate it by flipping `active:true` on the `6.5` version-entry inside the `developer` source in `ingest/platform/config.json` (not the whole source) before running this skill against it." Stop — do not fall through to a generic unknown-argument error.
- Argument is `developer-portal` → **do no work**. `developer-portal` is never a valid argument to this skill — it's consulted internally by the `developer` source's own sync process (for the optional unpublished-page gate) and is never run standalone. Reply that it's out of this skill's directly-invocable scope and stop.
- Argument is `sync`, `pages`, `hubs`, `guidelines`, `build`, `synonyms`, `lint`, or `eval` → that phase alone, scope = all active sources for `sync`/`pages`/`hubs`; `guidelines`/`build`/`synonyms`/`lint`/`eval` never take a source (the CLI's `--source` flag) — `guidelines` instead takes an optional `--version <v>`.
- Anything else → list the valid values from this table and this list, and stop.
