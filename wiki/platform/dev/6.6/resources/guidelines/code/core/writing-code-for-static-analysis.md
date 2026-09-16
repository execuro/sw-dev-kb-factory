---
id: platform/dev/6.6/resources/guidelines/code/core/writing-code-for-static-analysis.md
title: Writing code for static analysis
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/guidelines/code/core/writing-code-for-static-analysis.html"
sourceHash: "7cc699c161398dea2888677c9c3a3d6261782b77"
keywords: ["phpstan", "static analysis", "type checks", "assert()", "@var annotation", "@param", "@return", "instanceof", "is_string", "type casting", "generics", "array shapes", "class-string", "docblock types"]
summary: "Ranks three ways to help PHPStan narrow types in Shopware core code: explicit runtime checks, assert(), then @var annotations as last resort."
lastBuilt: "2026-09-15"
---
## What it is
Guidance on writing PHP code so PHPStan (the static analysis tool Shopware core relies on) can correctly narrow types, addressing common errors like `Can not call method getFoo() on Foo\Bar|null.`

## When to use
When a piece of code is implemented generically and PHP's dynamic typing makes PHPStan unable to infer a concrete type, e.g. a method returns `Foo|null` but only `Foo` is expected at that point.

## Key steps / config
Three approaches, in preferred order:

1. **Explicit runtime type/null checks** — e.g. `if ($foo === null) { throw new \InvalidArgumentException(...); }` or `!is_string($foo)` or `!$foo instanceof Foo`. Preferred because mismatches can no longer occur further down the code; downside is the error case must be handled explicitly. Type casts (`(string) $foo`) should be avoided as the go-to solution since PHP's type juggling can hide the real cause of an error.
2. **`assert()` during development/test** — e.g. `assert($foo !== null);`, `assert(is_string($foo));`, `assert($foo instanceof Foo);`. Asserts throw a generic `AssertionError` but are typically disabled in production configuration, so they do not guarantee full runtime type safety.
3. **`@var` annotations** — e.g. `/** @var Foo $foo */`. Evaluated only by static analysis, ignored at runtime, so they offer no real type safety and a wrong annotation can hide a real mismatch; use only as a last resort.

In unit tests, prefer PHPUnit type-asserting methods (`static::assertNotNull($foo)`, `static::assertIsString($foo)`, `static::assertInstanceOf(Foo::class, $foo)`) since these are evaluated at test runtime.

## Essential identifiers
- `assert()`
- `@var`, `@param`, `@return` annotations
- `static::assertNotNull()`, `static::assertIsString()`, `static::assertInstanceOf()`

## Gotchas
`@var`/`@param`/`@return` annotations should only be used for cases language features cannot express, mainly generics, array shapes, and special PHPStan types such as `class-string` or integer ranges. Native `Intersection & Union Types` should use the language feature instead of an annotation. A wrong `@var` annotation can actively hide a type mismatch that static analysis would otherwise catch.
