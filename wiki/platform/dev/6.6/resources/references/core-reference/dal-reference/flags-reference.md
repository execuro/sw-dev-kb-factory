---
id: platform/dev/6.6/resources/references/core-reference/dal-reference/flags-reference.md
title: Flags Reference
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/core-reference/dal-reference/flags-reference.html
sourceHash: f015553e4b7655f6faef80c1489b4d6fb43f460e
keywords: ["flags reference", "ApiAware", "PrimaryKey", "Required", "CascadeDelete", "SetNullOnDelete", "RestrictDelete", "Computed", "Runtime", "WriteProtected", "Deprecated flag", "Inherited", "DAL flags", "field flags"]
summary: "Reference for DAL Field flag classes: ApiAware, PrimaryKey, Required, CascadeDelete, Computed, Runtime, WriteProtected and more."
lastBuilt: 2026-09-15
---
## What it is

Reference table of the flag classes that can be attached to a DAL `Field` to change its behaviour (API exposure, deletion cascading, write protection, computed/runtime values, etc.).

## When to use

Use this page when defining or reviewing an entity's field definitions and needing to know what a given flag class does.

## Essential identifiers

- `ApiAware` — exposes a field in the Store/Admin API; scope restrictable to `AdminApiSource`/`SalesChannelApiSource`; enabled for Admin API by default via the base `Field` class
- `PrimaryKey` — marks the field as part of the entity's primary key (usually the ID field)
- `Required` — field must be specified on entity create (write-time only)
- `CascadeDelete` — deletes related data when the referenced association is deleted
- `SetNullOnDelete` — sets related data to null (and dispatches a Written event) when the reference is deleted
- `RestrictDelete` — blocks deleting the entity if an associated record with this flag exists
- `Computed` — value is computed by an indexer or external system; not writable via the DAL
- `Runtime` — value is loaded at runtime by an event subscriber or other class (used in entity extensions)
- `WriteProtected` — restricts write access via API, typically to protect indexed data
- `Deprecated` — marks a field to be removed in the next major version
- `Inherited` / `ReverseInherited` — data can be inherited by/from the parent record
- `Extension` — data is stored in `Entity::$extension`, not part of the struct itself
- `Since` — defines from which Shopware version the field is available
- `AllowEmptyString`, `AllowHtml`, `SearchRanking`

## Gotchas

`AllowHtml` allows HTML-escaped data in a column; be aware of injection possibilities when using it.
