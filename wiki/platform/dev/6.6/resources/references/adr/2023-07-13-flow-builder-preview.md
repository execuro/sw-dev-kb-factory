---
id: platform/dev/6.6/resources/references/adr/2023-07-13-flow-builder-preview.md
title: Flow Builder Preview
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2023-07-13-flow-builder-preview.html"
sourceHash: "55c243740ad2e0a6247f5e7fdd5348946aa4ad73"
keywords: ["flow builder", "flow builder preview", "Previewable interface", "handleFlow", "flow action", "flow logging", "PreviewResponseStruct", "administration flow"]
summary: "ADR: a new optional Previewable interface lets flow actions describe what a flow would do without executing it, shown in the administration."
lastBuilt: "2026-09-15"
---
## What it is
Architecture decision record introducing a "Flow Builder Preview" feature that lets merchants preview a flow's steps and decisions without actually executing the flow's actions.

## When to use
Relevant when building or reviewing Flow Builder actions and deciding whether to implement preview support, or when debugging why a flow action shows as "skipped" in the administration preview.

## Key steps / config
- Preview evaluates the flow's path by executing its rules and validates action input data, but leaves how much "real" code runs up to each action.
- It will not execute flow actions (i.e. not call the action's `handleFlow` method) and will not run one large transaction against the database that gets rolled back later.
- Implementing preview is entirely optional per action; actions that don't implement it are marked "skipped" in the administration.
- New core interface for actions that opt in:
```php
interface Previewable
{
    public function preview(...): PreviewResponseStruct
}
```

## Essential identifiers
- `Previewable` interface
- `PreviewResponseStruct`
- `handleFlow` method

## Gotchas
Preview execution behaves differently from real execution, so developers should keep an action's preview implementation as close as possible to its real implementation, or the preview may mislead the merchant. Flow Builder Logging is a separate, related feature not covered by this ADR.
