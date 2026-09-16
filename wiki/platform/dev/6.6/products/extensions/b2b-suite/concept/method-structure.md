---
id: platform/dev/6.6/products/extensions/b2b-suite/concept/method-structure.md
title: Method structure
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/extensions/b2b-suite/concept/method-structure.html"
sourceHash: "53a32e3582ba2dcbbbb776f431350b3e69807573"
keywords: ["method structure", "b2b suite", "@internal", "protected functions", "public functions", "framework domain", "typescript functions", "access modifiers", "deprecation", "replaceable functions", "binary compatibility"]
summary: "Explains which B2B Suite methods (framework domain, @internal, public, TypeScript) are guaranteed compatible across versions."
lastBuilt: "2026-09-15"
---
## What it is

Explains which functions in the B2B Suite are considered replaceable/stable across version changes, and how PHP and TypeScript method visibility maps to compatibility guarantees.

## When to use

Consult before relying on a B2B Suite method staying stable across a minor/major release, or before overriding a method in a custom plugin.

## Key steps / config

- Almost every function in the B2B Suite is replaceable, but not all are guaranteed compatible across every version change.
- Only the framework domain has guaranteed rules limiting per-release changes to each method; methods in other domains depend on the Shopware core and may need adjustment when the core changes.
- Protected functions marked `@internal` are not guaranteed compatible and may change on minor version changes, e.g.:

```php
/**
 * @internal
 */
protected function extractLimitAndOffset(Request $request, SearchStruct $struct): void
```

- Public functions are made to be compatible and are not changed until a major version change.
- TypeScript functions always declare access modifiers and are fully typed (arguments and return types); the same deprecation rules used elsewhere in Shopware apply to them.

## Essential identifiers

- `@internal` (PHPDoc annotation marking a protected function as unstable)

## Gotchas

An `@internal`-annotated protected function can change even on a minor version bump; only public framework functions are guaranteed until a major version change.
