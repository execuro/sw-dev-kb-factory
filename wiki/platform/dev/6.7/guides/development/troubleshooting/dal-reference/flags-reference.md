---
id: platform/dev/6.7/guides/development/troubleshooting/dal-reference/flags-reference.md
title: Flags Reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/troubleshooting/dal-reference/flags-reference.html
sourceHash: 560e068183b1299dac13d301aa04937ad8877ae0
codeCheckedAgainst: "6.7.13.0"
keywords: ["ApiAware", "Required", "PrimaryKey", "WriteProtected", "Inherited", "Runtime", "CascadeDelete", "SetNullOnDelete", "SearchRanking", "AllowHtml", "field flags", "dal flag", "entity definition"]
summary: DAL field flags (ApiAware, Required, PrimaryKey, WriteProtected, Inherited, CascadeDelete, SearchRanking and more) with meaning and constructor args.
lastBuilt: 2026-09-15
---
## What it is

Reference of the flag classes attached to DAL fields in an entity definition via `addFlags(...)`. All live in `Shopware\Core\Framework\DataAbstractionLayer\Field\Flag` and extend the abstract `Flag`.

## When to use

When defining entity fields and you need to control API exposure, write behaviour, inheritance, delete behaviour or search weighting.

## Key steps / config

| Flag | Meaning | Constructor args (installed) |
|---|---|---|
| `AllowEmptyString` | Empty string is not treated as null | none |
| `AllowHtml` | Column may contain HTML; beware of injection | `bool $sanitized = true` |
| `ApiAware` | Exposes field in Store/Admin API | `string ...$protectedSources` |
| `CascadeDelete` | Deleting referenced data deletes related data | `bool $cloneRelevant = true` |
| `Computed` | Computed by indexer/external system, not writable via DAL | |
| `Deprecated` | Field removed with next major | `string $deprecatedSince, string $willBeRemovedIn, ?string $replacedBy = null` |
| `Extension` | Data stored in `Entity::$extension` | |
| `Immutable` | Write-once, then read-only | |
| `Inherited` | Parent record can inherit the value | optional foreign key override |
| `PrimaryKey` | Part of the primary key (usually `id`) | none |
| `Required` | Must be given on create (write only) | none |
| `RestrictDelete` | Blocks entity deletion while associated records exist | |
| `ReverseInherited` | Reverse inheritance | `string $propertyName` |
| `Runtime` | Loaded at runtime by a subscriber/other class | `array $dependsOn = []` |
| `SearchRanking` | Search weight of the field | `float $ranking, bool $tokenize = true` |
| `SetNullOnDelete` | Related data set to null, Written event thrown | `bool $enforcedByConstraint = true` |
| `Since` | Version the field is available since | `string $since` |
| `WriteProtected` | Restricts API writes (protects indexed data) | `string ...$allowedScopes` |

`ApiAware` scopes: `AdminApiSource` (`/api/`) and `SalesChannelApiSource` (`/store-api/`); no argument means both.

## Essential identifiers

- Namespace `Shopware\Core\Framework\DataAbstractionLayer\Field\Flag`
- `ApiAware`, `Required`, `PrimaryKey`, `WriteProtected`, `Inherited`, `ReverseInherited`, `Runtime`, `Computed`, `Extension`, `Immutable`, `CascadeDelete`, `RestrictDelete`, `SetNullOnDelete`, `SearchRanking`, `AllowHtml`, `AllowEmptyString`, `Deprecated`, `Since`
- `AdminApiSource`, `SalesChannelApiSource`
- `SearchRanking::HIGH_SEARCH_RANKING` (500.0), `MIDDLE_SEARCH_RANKING` (250.0), `LOW_SEARCH_RANKING` (80.0), `ASSOCIATION_SEARCH_RANKING` (0.25)

## Gotchas

- The base `Field` class adds `ApiAware(AdminApiSource::class)`, so every field is Admin-API-visible by default; add `ApiAware` with `SalesChannelApiSource::class` (or no argument) to expose it in the Store API.
- `SystemSource` always passes the `ApiAware` source check.
- Installed flags not listed in the docs: `ApiCriteriaAware`, `AsArray`, `Choice`, `DoNotUseContext`, `IgnoreInOpenapiSchema`, `IgnoreInUnusedMediaSearch`, `NoConstraint`, `RuleAreas`.

## Code check (6.7.13.0)
- confirmed `ApiAware` — class extends Flag — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/ApiAware.php:11
- confirmed `ApiAware::__construct()` — no sources given allows both /api/ and /store-api/ — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/ApiAware.php:23
- confirmed `AdminApiSource` — base Field adds ApiAware(AdminApiSource::class) by default — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Field.php:36
- confirmed `Deprecated::__construct()` — requires deprecatedSince and willBeRemovedIn — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/Deprecated.php:10
- confirmed `Since` — class extends Flag, takes string $since — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/Since.php:8
- confirmed `SearchRanking::HIGH_SEARCH_RANKING` — 500.0 — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/SearchRanking.php:16
- confirmed `WriteProtected::__construct()` — variadic allowed scopes — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/WriteProtected.php:15
- confirmed `ReverseInherited::__construct()` — requires propertyName — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/ReverseInherited.php:10
- confirmed `AllowHtml::__construct()` — sanitized defaults to true — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/AllowHtml.php:13
- confirmed `SetNullOnDelete::__construct()` — enforcedByConstraint defaults to true — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/SetNullOnDelete.php:17
