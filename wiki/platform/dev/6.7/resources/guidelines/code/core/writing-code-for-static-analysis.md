---
id: platform/dev/6.7/resources/guidelines/code/core/writing-code-for-static-analysis.md
title: Writing code for static analysis
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/code/core/writing-code-for-static-analysis.html
sourceHash: 56b3ebff827ab937c9eef7426972678aa32173a6
codeCheckedAgainst: "6.7.13.0"
keywords: ["phpstan", "static analysis", "type narrowing", "assert()", "AssertionError", "@var", "@param", "@return", "list<T>", "array_values", "static::assertNotNull", "static::assertInstanceOf", "type casts", "coding guidelines", "generics"]
summary: "Core guideline for PHPStan-friendly code: narrow types via runtime checks, then assert(), then @var as last resort; prefer list<T> over array<T>."
lastBuilt: 2026-09-15
---
## What it is

A Shopware core coding guideline (mirrored from the `coding-guidelines/core` folder of the Shopware repository) on writing PHP that PHPStan can analyse: how to narrow types when generic/dynamic code yields `Foo|null`, `mixed` or `object`, and when to use PHPDoc annotations. Psalm is no longer used (ADR "Remove static analysis with Psalm").

## When to use

When fixing PHPStan errors such as `Can not call method getFoo() on Foo\Bar|null.` or `Method Foo\Bar::getFoo() expected first parameter to be string, but string|int|null given.` in core or plugin code, or when deciding whether a PHPDoc type annotation is justified.

## Key steps / config

Approaches in order of preference:

1. **Explicit runtime checks** (preferred) — `null` checks, `is_string()`, `instanceof`, then handle the error case (throw, default value, etc.). Guarantees no mismatch further down.
   ```php
   $foo = $bar->getFoo(); // Foo|null
   if ($foo === null) {
       throw new \InvalidArgumentException('Foo must not be null');
   }
   ```
   - **Type casts** (`(string) $foo`) also enforce types at runtime but can hide unexpected conversions (e.g. `null` to `''`) and are invisible to static analysis — use only when the possible inputs are known.
   - **Unit tests**: use PHPUnit type asserts — `static::assertNotNull($foo)`, `static::assertIsString($foo)`, `static::assertInstanceOf(Foo::class, $foo)`. In tests this is basically always the right choice.
2. **`assert()`** — `assert($foo !== null)`, `assert(is_string($foo))`, `assert($foo instanceof Foo)`. Throws a generic `AssertionError`; evaluated only where assertions are enabled (dev/test), recommended off in production, so no full runtime type safety.
3. **`@var` annotations** (last resort) — `/** @var Foo $foo */`. Ignored at runtime; PHPStan 1.10+ detects `@var` contradicting native types, but otherwise a wrong `@var` can hide real mismatches.

PHPDoc `@var`/`@param`/`@return` only for what the language cannot express: generics, array shapes, special PHPStan types (`class-string`, integer ranges). Union and intersection types are native — use them instead.

Sequential value collections: declare `list<T>`, not `array<T>`, and re-normalise with `array_values(...)` after `array_merge(...)`/`array_unique(...)`:

```php
/**
 * @return list<string|bool|int|float>
 */
public function getChoices(): array
```

## Essential identifiers

- `assert()`, `AssertionError`
- `static::assertNotNull`, `static::assertIsString`, `static::assertInstanceOf`
- `@var`, `@param`, `@return`, `list<T>`, `array_values(...)`

## Gotchas

- Type casts and `@var` both can mask the root cause of a type error; the bug surfaces later, far from its origin.
- `assert()` checks are skipped where assertions are disabled, so production can still hit a mismatch never seen in dev/test.
- Beyond this guideline, the installed core ships its own PHPStan rules, e.g. `PropertyNativeTypeRule` reports class properties without a native type (except `@var resource`/`@var callable`).

## Code check (6.7.13.0)
- confirmed `assert()` — used in core for instanceof narrowing — vendor/shopware/core/Checkout/Cart/Facade/ProductsFacade.php:95
- confirmed `FieldEnumProviderInterface::getChoices()` — declared with `@return list<string|bool|int|float>` as in the docs example — vendor/shopware/core/Framework/DataAbstractionLayer/FieldSerializer/FieldEnumProviderInterface.php:13
- confirmed `PropertyNativeTypeRule` — core PHPStan rule requiring native property types — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/Rules/PropertyNativeTypeRule.php:26
- unverified `static::assertNotNull` — PHPUnit API, outside the vendor/shopware roots
- unverified `phpstan 1.10 @var lie detector` — PHPStan feature, outside the vendor/shopware roots
