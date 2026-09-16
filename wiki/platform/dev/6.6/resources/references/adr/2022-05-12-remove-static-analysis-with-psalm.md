---
id: platform/dev/6.6/resources/references/adr/2022-05-12-remove-static-analysis-with-psalm.md
title: Remove static analysis with psalm
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2022-05-12-remove-static-analysis-with-psalm.html"
sourceHash: 8043f6405ba0404d3bb905d61e1cd630e8c18c00
keywords: ["phpstan", "psalm", "static analysis", "CI pipeline", "custom rules", "symfony extension", "phpunit extension", "code quality tooling", "ADR"]
summary: "Documents dropping psalm from CI in favor of phpstan alone, after the two tools' feature sets converged."
lastBuilt: "2026-09-15"
---
## What it is

ADR recording the decision to stop running Psalm alongside PHPStan for PHP static analysis in the Shopware 6 CI pipeline, and to remove Psalm entirely.

## When to use

Relevant when investigating why the CI pipeline only reports PHPStan errors, or when a contributor wonders why Psalm annotations/config are absent from the codebase despite older references to it.

## Key steps / config

- Context: running both `phpstan` and `psalm` in the same pipeline slowed the pipeline down and sometimes produced errors from the two tools that were incompatible with each other.
- Decision: Shopware decided to run only `phpstan` in CI and drop `psalm`, because by the time of this ADR the two tools had converged to a largely overlapping feature set (unlike early Shopware 6, when they had meaningfully different capabilities).
- Reasons given for keeping `phpstan` over `psalm`: it is easier to write custom `phpstan` rules than to extend `psalm`; the project already had custom `phpstan` rules in place; `phpstan` has more available extensions, for example for `symfony` and `phpunit`.
- Consequence: `psalm` was completely removed from the repository and from the CI configuration.

## Essential identifiers

- `phpstan`
- `psalm`

## Gotchas

Before this decision, the two tools could disagree on the same code, which is the root cause the ADR cites for dropping one of them. Contributors relying on old documentation or examples that reference `psalm` should expect it to no longer run or be configured anywhere in the repository.
