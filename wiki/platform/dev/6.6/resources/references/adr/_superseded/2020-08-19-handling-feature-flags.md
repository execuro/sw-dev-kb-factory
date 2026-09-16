---
id: platform/dev/6.6/resources/references/adr/_superseded/2020-08-19-handling-feature-flags.md
title: Handling feature flags
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/adr/_superseded/2020-08-19-handling-feature-flags.html
sourceHash: 44912a43a3f3cdc30393c5da2192d267812d3a87
keywords: ["feature flag", "NotFoundHttpException", "@internal", "@feature-deprecated", "entity definitions", "new routes", "new services", "deprecation annotation", "superseded", "workflow"]
summary: "Superseded ADR defining what must sit behind a feature flag: routes, entity definitions, services, and annotation conventions."
lastBuilt: 2026-09-15
---
## What it is

This is a superseded ADR that defines how to encapsulate feature changes behind a feature flag for common cases, so a merge request can be reviewed against a consistent standard. It states it is superseded by a later ADR on feature flags for major versions.

## When to use

Historical reference for the original rules on what must be hidden behind a feature flag: new entity definitions, new services/subscribers/events/resolvers, changes to current classes, new routes, and unavoidable additions like new constants.

## Key steps / config

- Everything reachable from external calls (routes, API definitions, schema) must be hidden behind the flag; changed/introduced code must not execute when the flag is inactive.
- New Entity Definitions and new Services/subscribers/events/resolvers must be hidden behind the flag in the container.
- Changes in current classes should be conditioned on the flag.
- Access to new constants or public functions that cannot be gated must be annotated, e.g.:

```php
//@internal (flag:FEATURE_NEXT_1128)
const NEW_FEATURE_CONST = true;
```

- New Routes must return `NotFoundHttpException` when the flag is inactive.
- Planned deprecations must not use the official `@deprecated` annotation (to avoid making deprecations public before release); use `@feature-deprecated (flag:FEATURE_NEXT_1128)` instead, which is replaced with the real `@deprecated` annotation once the flag is removed.

## Essential identifiers

- `NotFoundHttpException`
- `@internal`
- `@feature-deprecated`
- `@deprecated`

## Gotchas

Everything behind a feature flag is considered unstable and can be removed or changed at any time, which is why planned deprecations use `@feature-deprecated` rather than the public `@deprecated` annotation until the feature ships.
