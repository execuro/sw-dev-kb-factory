---
id: platform/dev/6.7/resources/guidelines/code/platform-domains.md
title: Platform Domains
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/code/platform-domains.html
sourceHash: d06bb2dc663e0bfd444c587036039ce4bc57cdf3
codeCheckedAgainst: "6.7.15.1"
keywords: ["platform domains", "Core", "Storefront", "Administration", "Elasticsearch", "domain dependencies", "namespace restriction", "RestrictNamespacesRule", "phpat", "architecture rules", "coding guidelines", "bundle boundaries"]
summary: Allowed dependencies between Shopware's Core, Administration, Storefront and Elasticsearch domains; Core depends on none of the others.
lastBuilt: 2026-10-21
---
## What it is

A coding guideline for the Shopware platform repository that fixes which of the four top-level domains (bundles) may depend on which. `Core` is the base; `Administration`, `Storefront` and `Elasticsearch` may each build on `Core`, but never on each other, and `Core` may not use anything from them.

## When to use

When contributing to the Shopware platform itself, or reviewing a change that adds a `use` statement, service reference or asset across bundle boundaries — e.g. deciding whether a Core service may reference a Storefront class, or whether Elasticsearch code may use an Administration helper.

## Key steps / config

Dependency matrix (neither classes nor assets may cross a forbidden edge):

| Domain | May depend on | Must not depend on |
|---|---|---|
| `Core` | — | `Storefront`, `Administration`, `Elasticsearch` |
| `Administration` | `Core` | `Storefront`, `Elasticsearch` |
| `Elasticsearch` | `Core` | `Storefront`, `Administration` |
| `Storefront` | `Core` | `Administration`, `Elasticsearch` |

In the installed code the class-level part of this matrix is enforced by PHPat architecture rules in `Shopware\Core\DevOps\StaticAnalyze\PHPStan\Rules\RestrictNamespacesRule`, one rule per domain (`restrictNamespacesInCore`, `restrictNamespacesInAdministration`, `restrictNamespacesInElasticsearch`, `restrictNamespacesInStorefront`), each stating that classes in `Shopware\<Domain>` "should not depend on" the forbidden namespaces. A violation surfaces as a PHPStan error with identifier prefix `phpat.`; a deliberate exception needs an explicit `@phpstan-ignore phpat.restrictNamespacesInCore` with a reason.

## Essential identifiers

- Namespaces: `Shopware\Core`, `Shopware\Administration`, `Shopware\Storefront`, `Shopware\Elasticsearch`
- `Shopware\Core\DevOps\StaticAnalyze\PHPStan\Rules\RestrictNamespacesRule`
- `restrictNamespacesInCore`, `restrictNamespacesInAdministration`, `restrictNamespacesInElasticsearch`, `restrictNamespacesInStorefront`

## Gotchas

- The rule covers assets too ("neither classes nor assets"), but the PHPat rules only check PHP class dependencies; asset coupling is a review concern.
- Core code occasionally needs a Storefront class name only as a constant (e.g. `InternalClassRule` comparing against `StorefrontController::class`); the installed code marks such spots with `@phpstan-ignore phpat.restrictNamespacesInCore` rather than lifting the rule.

## Code check (6.7.15.1)
- confirmed `RestrictNamespacesRule` — PHPat test-rule class defining the four domain namespaces — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/Rules/RestrictNamespacesRule.php:17
- confirmed `RestrictNamespacesRule::restrictNamespacesInCore()` — Core must not depend on Administration, Elasticsearch, Storefront — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/Rules/RestrictNamespacesRule.php:38
- confirmed `RestrictNamespacesRule::restrictNamespacesInAdministration()` — Administration must not depend on Elasticsearch, Storefront — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/Rules/RestrictNamespacesRule.php:25
- confirmed `RestrictNamespacesRule::restrictNamespacesInElasticsearch()` — Elasticsearch must not depend on Administration, Storefront — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/Rules/RestrictNamespacesRule.php:52
- confirmed `RestrictNamespacesRule::restrictNamespacesInStorefront()` — Storefront must not depend on Administration, Elasticsearch — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/Rules/RestrictNamespacesRule.php:65
- confirmed `phpat.restrictNamespacesInCore` — ignore marker used where Core references a Storefront class constant — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/Rules/Internal/InternalClassRule.php:202
- confirmed `ServiceDefinitionRule::BUNDLES` — the four bundles Administration, Core, Elasticsearch, Storefront — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/Rules/ServiceDefinitionRule.php:30
