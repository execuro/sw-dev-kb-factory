---
id: platform/dev/6.7/resources/guidelines/code/platform-domains.md
title: Platform Domains
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/code/platform-domains.html
sourceHash: d06bb2dc663e0bfd444c587036039ce4bc57cdf3
codeCheckedAgainst: "6.7.13.0"
keywords: ["Core", "Storefront", "Administration", "Elasticsearch", "domain dependencies", "namespace restrictions", "RestrictNamespacesRule", "phpat", "architecture rules", "bundle dependencies", "coding guidelines"]
summary: "Allowed dependencies between Shopware domains: Core depends on none; Administration, Storefront and Elasticsearch may depend only on Core. Enforced via phpat."
lastBuilt: 2026-09-15
---
## What it is

A Shopware coding guideline defining which of the four platform domains (`Core`, `Administration`, `Storefront`, `Elasticsearch`) may depend on which — covering both classes and assets.

## When to use

When adding code to one of the Shopware platform bundles and deciding whether a class or asset from another domain may be referenced.

## Key steps / config

| Domain | May depend on | Must not depend on |
|---|---|---|
| `Core` | nothing | `Storefront`, `Administration`, `Elasticsearch` |
| `Administration` | `Core` | `Storefront`, `Elasticsearch` |
| `Elasticsearch` | `Core` | `Storefront`, `Administration` |
| `Storefront` | `Core` | `Administration`, `Elasticsearch` |

In the installed code these rules are enforced as phpat architecture tests in `Shopware\Core\DevOps\StaticAnalyze\PHPStan\Rules\RestrictNamespacesRule` — one `#[TestRule]` method per domain (`restrictNamespacesInCore()`, `restrictNamespacesInAdministration()`, `restrictNamespacesInElasticsearch()`, `restrictNamespacesInStorefront()`), each forbidding classes in `Shopware\<Domain>` from depending on the listed namespaces.

## Essential identifiers

- `Shopware\Core`, `Shopware\Administration`, `Shopware\Storefront`, `Shopware\Elasticsearch`
- `RestrictNamespacesRule`, `phpat.restrictNamespacesInCore`

## Gotchas

- The installed core still contains a few suppressed violations, e.g. `Shopware\Core\Framework\Notification\NotificationEntity` extends the Administration `NotificationEntity` with a `@phpstan-ignore phpat.restrictNamespacesInCore` marked for removal in the next major. Do not treat such cases as precedent.

## Code check (6.7.13.0)
- confirmed `RestrictNamespacesRule::restrictNamespacesInCore()` — Core must not depend on Administration, Elasticsearch, Storefront — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/Rules/RestrictNamespacesRule.php:38
- confirmed `RestrictNamespacesRule::restrictNamespacesInAdministration()` — forbids Elasticsearch and Storefront — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/Rules/RestrictNamespacesRule.php:25
- confirmed `RestrictNamespacesRule::restrictNamespacesInElasticsearch()` — forbids Administration and Storefront — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/Rules/RestrictNamespacesRule.php:52
- confirmed `RestrictNamespacesRule::restrictNamespacesInStorefront()` — forbids Administration and Elasticsearch — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/Rules/RestrictNamespacesRule.php:65
- deprecated `NotificationEntity` — core class extending the Administration entity, rule ignored until v6.8.0 — vendor/shopware/core/Framework/Notification/NotificationEntity.php:14
