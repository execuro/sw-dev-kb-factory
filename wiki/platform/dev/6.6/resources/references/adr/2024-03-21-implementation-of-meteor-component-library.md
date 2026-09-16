---
id: platform/dev/6.6/resources/references/adr/2024-03-21-implementation-of-meteor-component-library.md
title: Implementation of Meteor Component Library
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2024-03-21-implementation-of-meteor-component-library.html"
sourceHash: db0df2bb28371b20bec70fc181b23a385ea8cc54
keywords: ["Meteor Component Library", "mt- prefix", "sw- components", "mt-button", "mt-data-table", "sw-data-grid", "major feature flag 6.7", "codemod", "wrapper component", "administration base components", "component migration"]
summary: "ADR: Meteor components replace admin base components, prefixed `mt-`, running in parallel with `sw-` components behind the 6.7 major flag."
lastBuilt: 2026-09-15
---
## What it is
Architecture decision record on replacing the administration's base components with the Meteor Component Library, run in parallel during the 6.6 major and switched via a feature flag.

## When to use
Relevant when building or migrating admin UI components and deciding whether to use the legacy `sw-` components or the new `mt-` Meteor components.

## Key steps / config
- New Meteor components and their CSS classes use the `mt-` prefix to avoid naming conflicts with existing `sw-` components; old exports are kept (console-warned as deprecated) so existing imports keep working.
- During 6.6, both libraries run in parallel; developers switch between them using the major feature flag 6.7, or use `mt-` components directly.
- Each component is wrapped in a "wrapper" component that renders the old or new implementation depending on the feature flag.
- An automatic code migration tool (codemod) replaces old components, properties and slot usage with their Meteor equivalents for common cases; edge cases need manual adjustment.
- Components with large implementation differences (e.g. `sw-data-grid` vs. `mt-data-table`) keep their old implementation with a deprecation note rather than being force-migrated; manual migrations containing breaking changes must be released behind a feature flag.

## Essential identifiers
- Meteor components prefixed `mt-` (e.g. `mt-button`, `mt-example`)
- Legacy components prefixed `sw-` (e.g. `sw-button`, `sw-data-grid`, `sw-example`)
- major feature flag 6.7

## Gotchas
Not every migration case is covered by the codemod; developers may need to use it as a base and modify manually. Complex components like `sw-data-grid` are not migrated automatically and keep coexisting with their Meteor counterpart under deprecation.
