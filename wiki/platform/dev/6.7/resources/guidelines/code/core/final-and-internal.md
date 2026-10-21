---
id: platform/dev/6.7/resources/guidelines/code/core/final-and-internal.md
title: Final and internal annotation
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/code/core/final-and-internal.html
sourceHash: 3a6b4e9126a2af79519ea6e63fee5c8ad814f2b7
codeCheckedAgainst: "6.7.15.1"
keywords: ["@final", "@internal", "final annotation", "internal annotation", "public api", "private api", "backward compatibility", "breaking changes", "docblock annotation", "BecomesFinal", "BecomesInternal", "service decoration"]
summary: "Core guideline on @final and @internal docblock annotations: which class changes Shopware allows for each, and what extending or using them means."
lastBuilt: 2026-10-21
---
## What it is

The Shopware core coding guideline on the `@final` and `@internal` docblock annotations. They mark classes and services as public or private API and define which breaking changes developers must expect.

## When to use

- You write a core class and decide whether third parties may use it, extend it, or neither.
- You consume a core class and need to know what backward-compatibility guarantee applies.

## Key steps / config

**`@final`** — developers may use the class but should not extend it.

Allowed changes to a `@final` class:

- adding new public methods, properties or constants;
- adding new optional parameters to public methods;
- any change to protected and private methods, properties and constants;
- widening the type of public method parameters.

Not allowed:

- removing public methods, properties or constants;
- removing public method parameters;
- narrowing the type of public methods, properties or constants.

**`@internal`** — the class is private API and should not be used or extended by other developers. It can be changed without restriction and removed without deprecation.

Example from core: `Shopware\Core\Checkout\Cart\RuleLoader` is annotated `@final` with the note "Depend on the AbstractRuleLoader which is the definition of public API for this scope", and its constructor is `@internal`.

## Essential identifiers

- `@final`
- `@internal`

## Gotchas

- Both are only doc annotations, not the PHP `final` keyword or a language-level restriction. Developers can still extend a `@final` class and replace the service in the DI container, or use/replace an `@internal` class — not recommended, possible, and without any guarantees.
- The installed code also has BCChange attributes `#[BecomesFinal]` and `#[BecomesInternal]` to announce that a class will become final or internal in a future major (e.g. `Shopware\Core\Framework\Feature` carries `#[BecomesFinal(version: 'v6.8.0')]`); the PHPStan `DecorationPatternRule` treats them like the annotations.

## Code check (6.7.15.1)
- confirmed `@final` — RuleLoader marked final via docblock only — vendor/shopware/core/Checkout/Cart/RuleLoader.php:16
- confirmed `@internal` — constructor marked internal — vendor/shopware/core/Checkout/Cart/RuleLoader.php:22
- confirmed `BecomesFinal` — BCChange attribute announcing a future final — vendor/shopware/core/Framework/Feature.php:17
- confirmed `BecomesInternal` — honoured by the decoration PHPStan rule as @internal — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/Rules/DecorationPatternRule.php:144
- confirmed `DecorationPatternRule` — rejects decoratable abstract classes marked @final — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/Rules/DecorationPatternRule.php:35
