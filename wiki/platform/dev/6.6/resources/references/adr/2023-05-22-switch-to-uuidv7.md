---
id: platform/dev/6.6/resources/references/adr/2023-05-22-switch-to-uuidv7.md
title: Switch to UUIDv7
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2023-05-22-switch-to-uuidv7.html"
sourceHash: "3938761d81f4ebe634b3622cbe7f6312a2779ae6"
keywords: ["UUIDv7", "UUIDv4", "Uuid class", "primary key", "B-tree index", "database index", "bulk product insert", "time-based prefix", "DAL primary key", "performance guide"]
summary: "ADR switching Shopware's default primary-key generation from UUIDv4 to UUIDv7 for better B-tree index locality."
lastBuilt: "2026-09-15"
---
## What it is
This ADR documents switching the default UUID generation used for primary keys throughout Shopware from UUIDv4 to UUIDv7, implemented in the `Uuid` class.

## When to use
Relevant when reasoning about primary-key generation, database index performance, or bulk-insert behavior on entities that use Shopware's UUID primary keys, or when reading Shopware's performance guides that recommend UUIDv7.

## Key steps / config
- Context: UUIDs as primary keys ease integrating multiple data sources, but UUIDv4's fully random prefix makes database B-tree indexes inefficient, since new values are scattered across the index rather than appended near existing ones.
- UUIDv7 has a time-based prefix that is far less spread than UUIDv4's random prefix, letting the database keep the index more compact and allocate fewer new index pages.
- UUIDv4 and UUIDv7 share the same length and are indistinguishable to Shopware's own logic, so switching carries little risk of breaking existing behavior.
- The implementation effort is limited to changing the `Uuid` class's generation logic.
- Measured effect: switching to UUIDv7 improves the speed of bulk product inserts by about 8%.

## Essential identifiers
- `Uuid` class (generation logic changed to emit UUIDv7)

## Version notes
UUIDv7 becomes the default UUID generation strategy going forward, and Shopware's performance guides are updated to promote it as the preferred choice for new/bulk-insert-heavy workloads.
