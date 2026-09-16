---
id: platform/dev/6.7/products/extensions/b2b-suite/concept/method-structure.md
title: Method structure
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite/concept/method-structure.html
sourceHash: 53a32e3582ba2dcbbbb776f431350b3e69807573
codeCheckedAgainst: "6.7.13.0"
keywords: ["@internal", "Shopware\\B2B\\Common\\Controller", "GridHelper", "extractLimitAndOffset", "replaceable functions", "backward compatibility", "protected methods", "public methods", "typescript access modifiers", "b2b suite", "framework domain"]
summary: B2B Suite method compatibility rules - which functions are replaceable, @internal protected methods, public API stability, typed TypeScript methods.
lastBuilt: 2026-09-15
---
## What it is

Compatibility rules for overriding/replacing functions in the B2B Suite: which methods are stable across releases and which may change.

## When to use

Before decorating, extending or replacing a B2B Suite class or TypeScript method, to judge whether the method you depend on can change in a minor or major release.

## Key steps / config

- Almost every function in the B2B Suite is replaceable, but not every one stays compatible across versions.
- Only the **framework** domain has guaranteed rules limiting method changes per release. Methods in other domains depend on Shopware core and have to be adjusted when core changes.
- Framework, protected methods marked `@internal`: no compatibility guarantee; may change in minor versions. Example from `<b2b root>/components/Common/Controller/GridHelper.php` (namespace `Shopware\B2B\Common\Controller`):

```php
class GridHelper
{
    /**
     * @internal
     */
    protected function extractLimitAndOffset(Request $request, SearchStruct $struct): void
    { /* ... */ }
}
```

- Framework, public methods: kept compatible and unchanged until the next major version.
- TypeScript: methods always have access modifiers and full argument/return typing; Shopware's usual deprecation rules apply.

```typescript
export default class {
    public addClass(element: HTMLElement, name: string): void { /* ... */ }
}
```

## Essential identifiers

- `@internal` (annotation marking non-guaranteed protected methods)
- `Shopware\B2B\Common\Controller\GridHelper::extractLimitAndOffset()` (example)

## Gotchas

- Non-framework B2B domains have no stability guarantee at all, public or protected, because they track Shopware core changes.

## Code check (6.7.13.0)
- unverified `GridHelper` — B2B Suite extension not installed; no match under vendor/shopware roots
- unverified `GridHelper::extractLimitAndOffset()` — B2B Suite extension not installed; no match under vendor/shopware roots
- unverified `Shopware\B2B\Common\Controller` — B2B Suite namespace not present in vendor/shopware/core, storefront or administration
