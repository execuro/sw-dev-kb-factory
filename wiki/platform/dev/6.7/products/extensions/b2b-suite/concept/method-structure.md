---
id: platform/dev/6.7/products/extensions/b2b-suite/concept/method-structure.md
title: Method structure
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite/concept/method-structure.html
sourceHash: 53a32e3582ba2dcbbbb776f431350b3e69807573
codeCheckedAgainst: "6.7.15.1"
keywords: ["b2b suite", "method structure", "@internal", "backward compatibility", "replaceable functions", "GridHelper", "Shopware\\B2B\\Common\\Controller", "extractLimitAndOffset", "protected methods", "public api", "typescript", "deprecation"]
summary: "B2B Suite compatibility rules: which methods are replaceable, @internal protected framework methods vs. public ones, and TypeScript typing rules."
lastBuilt: 2026-10-21
---
## What it is

Describes the compatibility guarantees for methods in the B2B Suite: which functions you can replace or override and how stable they are across releases.

## When to use

Consult it before overriding or calling a B2B Suite method from your own plugin, to judge whether the method may change in a minor or only in a major release.

## Key steps / config

- Almost every function in the B2B Suite is replaceable, but not all stay compatible across versions.
- Only the **framework** domain has guaranteed rules limiting method changes per release. Methods in other domains depend on the Shopware core and must be adjusted when the core changes.
- **Protected framework functions** marked with an `@internal` docblock are not guaranteed to stay compatible, even across minor versions. Example from `<b2b root>/components/Common/Controller/GridHelper.php` (namespace `Shopware\B2B\Common\Controller`):

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

- **Public framework functions** stay compatible and are not changed until the next major version.
- **TypeScript functions** always declare access modifiers and are fully typed (arguments and return types), e.g. `public addClass(element: HTMLElement, name: string): void`. The usual Shopware deprecation rules apply to them.

## Essential identifiers

- `@internal` — marks protected methods without compatibility guarantee
- `Shopware\B2B\Common\Controller\GridHelper` — example class
- `GridHelper::extractLimitAndOffset()` — example `@internal` protected method

## Gotchas

- Overriding an `@internal` protected method ties your code to the exact B2B Suite version; prefer public framework methods.
- Non-framework domains carry no stability guarantee because they follow Shopware core changes.

## Code check (6.7.15.1)
- unverified `Shopware\B2B\Common\Controller\GridHelper` — B2B Suite class, no occurrence in vendor/shopware/{core,storefront,administration}
- unverified `GridHelper::extractLimitAndOffset()` — B2B Suite method, out of scope of the installed packages
