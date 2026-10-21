---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/resources/references/adr/2022-05-12-remove-static-analysis-with-psalm.md
sourceHash: 8043f6405ba0404d3bb905d61e1cd630e8c18c00
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-05-12-remove-static-analysis-with-psalm.html
title: Remove static analysis with psalm
version: "6.7"
versions:
  - "6.7"
keywords: ["psalm", "phpstan", "static analysis", "static-analyse", "ci pipeline", "custom phpstan rules", "shopware/phpstan-extension", "rules.neon", "extension.neon", "core-rules.neon", "code quality", "adr"]
summary: "ADR: Shopware dropped psalm and kept phpstan as its only PHP static analyser in CI, because custom phpstan rules and extensions were easier to maintain."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2022-05-12). Shopware used to run two PHP static analysers in CI, `phpstan` and `psalm`. This record removes `psalm` from the repository and the CI and keeps `phpstan` as the only one.

## When to use

- You are choosing a static analyser for Shopware core or plugin code and want to match the core toolchain.
- You come across old `psalm` annotations or configuration and wonder whether they are still maintained.

## Key steps / config

Reasons given for the decision:

- Running both tools slowed the pipeline, and the two could report errors that contradicted each other.
- The tools had largely converged on a common feature set since Shopware 6 began.
- Custom `phpstan` rules are easier to write than `psalm` extensions, and Shopware already had custom `phpstan` rules.
- `phpstan` has more extensions, for example for `symfony` and `phpunit`.

The installed code ships Shopware's rules under `Shopware\Core\DevOps\StaticAnalyze\PHPStan`, packaged as `shopware/phpstan-extension` (`composer require --dev shopware/phpstan-extension`). With `phpstan/extension-installer` the extension is enabled automatically. To configure it by hand, add the files to the project's `phpstan.neon`:

```neon
includes:
    - vendor/shopware/phpstan-extension/extension.neon
    - vendor/shopware/phpstan-extension/rules.neon
```

`core-rules.neon` holds rules for core development. It is not included automatically and has to be added by hand.

## Essential identifiers

- `phpstan`, `shopware/phpstan-extension`
- `extension.neon` (type extensions), `rules.neon` (Shopware rules), `core-rules.neon` (core-only rules)
- Namespace `Shopware\Core\DevOps\StaticAnalyze\PHPStan\Rules`

## Gotchas

- `psalm` no longer appears in the Shopware core, storefront or administration sources, so do not expect psalm-specific annotations or configuration from core to be maintained.

## Code check (6.7.15.1)
- unverified `psalm` — no occurrence in the three package roots; repository CI config is out of scope
- confirmed `shopware/phpstan-extension` — composer package for the phpstan rules — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/README.md:9
- confirmed `rules.neon` — include path for Shopware rules — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/README.md:25
- confirmed `extension.neon` — include path for type extensions — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/README.md:24
- confirmed `core-rules.neon` — not auto-included — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/README.md:60
- confirmed `RuleConditionHasRuleConfigRule` — example custom phpstan rule — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/rules.neon:5
