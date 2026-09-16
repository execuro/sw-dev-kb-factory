---
id: platform/dev/6.7/resources/references/adr/2022-05-12-remove-static-analysis-with-psalm.md
title: Remove static analysis with psalm
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-05-12-remove-static-analysis-with-psalm.html
sourceHash: 8043f6405ba0404d3bb905d61e1cd630e8c18c00
codeCheckedAgainst: "6.7.13.0"
keywords: ["psalm", "phpstan", "static analysis", "static-analyse", "custom phpstan rules", "ci pipeline", "code quality", "php linting", "adr"]
summary: "ADR 2022-05-12: Shopware removes psalm and keeps phpstan as its only PHP static analysis tool in the repository and CI."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2022-05-12, area core) deciding to stop running both `phpstan` and `psalm` over Shopware's PHP code and to keep only `phpstan`. `psalm` is removed completely from the repository and the CI.

## When to use

When setting up static analysis for Shopware core contributions or for a plugin aligned with core tooling, or when wondering why core ships no psalm configuration or annotations tooling.

## Key steps / config

Decision rationale from the ADR:

- Running both tools slowed the pipeline and produced mutually incompatible error reports.
- The tools converged to a common feature set, so running both is no longer needed.
- `phpstan` was chosen because custom `phpstan` rules are easier to write than psalm extensions, Shopware already had custom `phpstan` rules, and more extensions exist for it (e.g. for `symfony` or `phpunit`).

In the installed core, the custom rules live under `Shopware\Core\DevOps\StaticAnalyze\PHPStan\Rules\` and are registered in `DevOps/StaticAnalyze/PHPStan/rules.neon` (for example `RuleConditionHasRuleConfigRule`, `RouteScopeRule`).

## Essential identifiers

- `phpstan`
- `Shopware\Core\DevOps\StaticAnalyze\PHPStan\Rules\`
- `rules.neon`

## Gotchas

- `psalm` is not used by core any more; configure analysis with `phpstan` only.

## Code check (6.7.13.0)
- confirmed `rules` — phpstan rules list with Shopware custom rule classes — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/rules.neon:1
- confirmed `RuleConditionHasRuleConfigRule` — custom phpstan rule registered in core — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/rules.neon:5
- confirmed `RouteScopeRule` — custom phpstan rule registered in core — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/rules.neon:13
- unverified `psalm` — no match in vendor/shopware/core or storefront; CI configuration is out of scope
