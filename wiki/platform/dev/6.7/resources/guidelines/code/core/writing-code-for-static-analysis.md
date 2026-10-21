---
id: platform/dev/6.7/resources/guidelines/code/core/writing-code-for-static-analysis.md
title: Writing code for static analysis
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/code/core/writing-code-for-static-analysis.html
sourceHash: 56b3ebff827ab937c9eef7426972678aa32173a6
codeCheckedAgainst: "6.7.15.1"
keywords: ["phpstan", "static analysis", "type narrowing", "assert()", "@var", "@param", "@return", "list<T>", "array_values", "type casts", "assertNotNull", "assertInstanceOf", "generics", "array shapes"]
summary: "Core guideline for PHPStan-friendly code: narrow types via runtime checks, then assert(), then @var as last resort; prefer list<T> for value lists."
lastBuilt: 2026-10-21
---
## What it is

A core coding guideline (mirrored from the Shopware repository's `coding-guidelines/core/writing-code-for-static-analysis.md`) on writing PHP that PHPStan can analyze, mainly how to narrow types when generic or dynamic code yields `Foo|null`, `mixed` or `object`. Psalm is no longer used (ADR "Remove static analysis with Psalm").

## When to use

When fixing PHPStan errors such as `Can not call method getFoo() on Foo\\Bar|null.` or `Method Foo\\Bar::getFoo() expected first parameter to be string, but string|int|null given.`, or when deciding whether to write `@var`/`@param`/`@return` annotations.

## Key steps / config

Approaches in order of preference:

1. **Explicit runtime checks** — preferred in production code; afterwards a type mismatch is impossible further down. Downside: the error case must be handled explicitly.
   ```php
   $foo = $bar->getFoo(); // Foo|null
   if ($foo === null) {
       throw new \InvalidArgumentException('Foo must not be null');
   }
   // likewise: if (!is_string($foo)) ..., if (!$foo instanceof Foo) ...
   ```
   - **Type casts** (`(string) $foo`) are not the go-to solution: PHP's casting magic can hide the root cause (e.g. null silently becomes `''`), and static analysis cannot catch unexpected casts. Use only when the possible inputs and the cast result are known.
   - **In unit tests** use PHPUnit's type-ensuring asserts — `static::assertNotNull($foo)`, `static::assertIsString($foo)`, `static::assertInstanceOf(Foo::class, $foo)`. They give full type safety at test runtime; in tests there is basically no case for the later approaches.
2. **PHP's built-in `assert()`** — `assert($foo !== null)`, `assert(is_string($foo))`, `assert($foo instanceof Foo)`. Evaluated only in development/test (asserts should be disabled in production), so no full type safety, but a failing check throws a generic `AssertionError` with no manual error handling.
3. **`@var` annotations** — last resort. `/** @var Foo $foo */` narrows types for static analysis only and is ignored at runtime. PHPStan 1.10+ detects `@var` contradicting native types, but otherwise a wrong `@var` can actively hide mismatches.

**Docblock types.** Use `@var`, `@param` and `@return` only for what language features cannot express: generics, array shapes, and special PHPStan types such as `class-string` or integer ranges. Intersection and union types are native language features — write them natively.

**Prefer `list<T>` over `array<T>`** for sequential value collections without semantic keys; it states the shape precisely and lets static analysis catch accidental associative arrays.

```php
/**
 * @return list<string|bool|int|float>
 */
public function getChoices(): array
```

After `array_merge(...)` or `array_unique(...)`, normalize back to list shape with `array_values(...)`.

## Essential identifiers

- `assert()`, `AssertionError`
- `@var`, `@param`, `@return`, `list<T>`, `class-string`
- `static::assertNotNull()`, `static::assertIsString()`, `static::assertInstanceOf()`
- `array_values()`

## Gotchas

- Because `assert()` is switched off in production, code relying on it can still meet unexpected types there.
- `array_unique()` preserves keys, so its result is no longer a `list` without `array_values()`.

## Code check (6.7.15.1)
- confirmed `Choice::getChoices()` — returns `list<string|bool|int|float>` as in the guideline example — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/Choice.php:26
- confirmed `FieldEnumProviderInterface::getChoices()` — same `list<...>` return annotation — vendor/shopware/core/Framework/DataAbstractionLayer/FieldSerializer/FieldEnumProviderInterface.php:15
- confirmed `PHPStan\Rules\Rule` — core ships custom PHPStan rules under DevOps/StaticAnalyze — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/Rules/Internal/InternalClassRule.php:9
- unverified `assert()` — PHP language built-in, not Shopware code
- unverified `@var` — PHPStan docblock semantics live in vendor/phpstan, out of scope
