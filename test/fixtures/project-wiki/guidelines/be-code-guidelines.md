---
title: BE code guidelines (project)
nav_order: 1
parent: Guidelines
grand_parent: Project wiki
tags: [guidelines, backend]
merge:
  dependency-injection: extend
  testing: override
  deprecated-api-usage: waive
  old-anchor-renamed: override
adr: []
last_synced: 2026-09-01
verified_against: 6.7.0.0
---
This project overrides some of Shopware's backend guidelines. This preamble is dropped
from the effective file — only `##` sections are merged in.

## Dependency injection

Prefer constructor property promotion project-wide, on top of Shopware's own rule.

## Testing

Every repository decorator needs an integration test in `tests/Integration`.

## Formatting

Line length is capped at 120 characters, not PSR-12's default — this anchor collides with
a platform section without being declared in `merge:`, so it is an undeclared override.

## Deprecated API usage

WAIVED: the legacy `ContainerAwareTrait` is still used by two bundles pending a migration ADR.

## Old anchor renamed

Kept for the anchor-rename regression case: `merge:` names an anchor the platform file no
longer has.

## Something else entirely

A project-only rule with no platform counterpart at all.
