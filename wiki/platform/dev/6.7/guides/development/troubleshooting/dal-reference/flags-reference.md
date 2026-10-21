---
id: platform/dev/6.7/guides/development/troubleshooting/dal-reference/flags-reference.md
title: Flags Reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/troubleshooting/dal-reference/flags-reference.html
sourceHash: 560e068183b1299dac13d301aa04937ad8877ae0
codeCheckedAgainst: "6.7.15.1"
keywords: ["field flags", "dal flags", "ApiAware", "Required", "PrimaryKey", "WriteProtected", "Inherited", "CascadeDelete", "SetNullOnDelete", "RestrictDelete", "Runtime", "SearchRanking", "AllowHtml", "entity definition"]
summary: Reference of DAL field flag classes (ApiAware, Required, PrimaryKey, WriteProtected, CascadeDelete, Runtime, ...) and what each one does in 6.7.
lastBuilt: 2026-10-21
---
## What it is

A lookup table of the Data Abstraction Layer (DAL) field flags: classes in the namespace `Shopware\Core\Framework\DataAbstractionLayer\Field\Flag` that you add to a field in an `EntityDefinition` (via `addFlags()` / `setFlags()`) to change how it is read, written, deleted, inherited or searched.

## When to use

When you define or extend an entity's fields and need to know which flag gives the behaviour you want: API exposure, write protection, delete cascading, inheritance, or search weighting.

## Key steps / config

Flags are passed to a field instance, for example `(new StringField('name', 'name'))->addFlags(new ApiAware(), new Required())`. Constructor arguments in 6.7.15.1:

- `ApiAware(string ...$protectedSources)` — no argument: exposed in Admin API and Store API. Pass `AdminApiSource::class` and/or `SalesChannelApiSource::class` to restrict the scope.
- `WriteProtected(string ...$allowedScopes)` — only listed context scopes may write; optional `->allowWriteThroughAdminApi()`.
- `AllowHtml(bool $sanitized = true)` — HTML is sanitized by default.
- `CascadeDelete(bool $cloneRelevant = true)`
- `SetNullOnDelete(bool $enforcedByConstraint = true)`
- `Runtime(array $dependsOn = [])`
- `SearchRanking(float $ranking, bool $tokenize = true)` — constants `SearchRanking::HIGH_SEARCH_RANKING` (500), `MIDDLE_SEARCH_RANKING` (250), `LOW_SEARCH_RANKING` (80), `ASSOCIATION_SEARCH_RANKING` (0.25).
- `Deprecated(string $deprecatedSince, string $willBeRemovedIn, ?string $replacedBy = null)`
- `Since(string $since)`
- `ReverseInherited(string $propertyName)`

## Essential identifiers

| Flag | Effect |
|---|---|
| `AllowEmptyString` | Empty string on a text column is not treated as null |
| `AllowHtml` | Column may hold HTML; beware of injection |
| `ApiAware` | Field is readable through Store/Admin API |
| `CascadeDelete` | Deleting the referenced data deletes the related data |
| `Computed` | Value is computed by an indexer/external system, not writable via DAL |
| `Deprecated` | Field is deprecated and removed in the next major |
| `Extension` | Data lives in the entity's `$extensions`, not on the struct |
| `Immutable` | Write-once, then read-only |
| `Inherited` | Value can be inherited from the parent record |
| `PrimaryKey` | Part of the entity's primary key (usually `id`) |
| `Required` | Must be given on create; only checked during writes |
| `RestrictDelete` | Blocks deleting the entity while associated records exist |
| `ReverseInherited` | Reverse side of an inherited association |
| `Runtime` | Loaded at runtime by a subscriber/other class, e.g. entity extensions |
| `SearchRanking` | Weight of the field in a search query |
| `SetNullOnDelete` | Related data set to null on delete, a written event is dispatched |
| `Since` | Shopware version the field is available since |
| `WriteProtected` | Restricts API writes; protects indexed data |

## Gotchas

- Every `Field` gets `ApiAware(AdminApiSource::class)` in its constructor, and `setFlags()` re-adds it if absent — so all fields are Admin-API-readable by default; only adding `ApiAware` yourself exposes a field to the Store API. Calling `setFlags()` replaces all other flags.
- The installed flag directory contains flags this page does not list: `ApiCriteriaAware`, `AsArray`, `Choice`, `DoNotUseContext`, `IgnoreInOpenapiSchema`, `IgnoreInUnusedMediaSearch`, `NoConstraint`, `ResetOnClone`, `RuleAreas`.

## Code check (6.7.15.1)
- confirmed `ApiAware` — no args allows `/api/` and `/store-api/`, args restrict the allow list — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/ApiAware.php:11
- confirmed `Field::__construct()` — adds `ApiAware(AdminApiSource::class)` by default — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Field.php:35
- confirmed `Field::setFlags()` — re-adds Admin-only `ApiAware` when missing — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Field.php:59
- confirmed `WriteProtected` — variadic allowed scopes — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/WriteProtected.php:8
- confirmed `WriteProtected::allowWriteThroughAdminApi()` — omits the flag from the schema — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/WriteProtected.php:43
- confirmed `AllowHtml` — `$sanitized` defaults to true — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/AllowHtml.php:11
- confirmed `SearchRanking::HIGH_SEARCH_RANKING` — 500.0, with MIDDLE 250, LOW 80, ASSOCIATION 0.25 — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/SearchRanking.php:16
- confirmed `Deprecated` — takes deprecatedSince, willBeRemovedIn, optional replacedBy — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/Deprecated.php:8
- confirmed `Runtime` — optional `$dependsOn` array — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/Runtime.php:12
- confirmed `CascadeDelete` — `$cloneRelevant` defaults to true — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/CascadeDelete.php:11
