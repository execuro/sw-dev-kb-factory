---
id: platform/dev/6.7/products/extensions/b2b-suite-migration/development/fields-mapping.md
title: Fields Mapping
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite-migration/development/fields-mapping.html
sourceHash: c969cb6365cb9cabe5e1ec4f844ce0e311ddb199
codeCheckedAgainst: "6.7.15.1"
keywords: ["b2b suite migration", "field mapping", "fields", "field source target", "one-to-one mapping", "relational mapping", "join", "custom join field", "handler", "xml configuration", "b2b_store_front_auth", "b2b_business_partner"]
summary: XML <field source target> syntax for B2B Suite migration - one-to-one, relational dotted joins, multi-hop joins, [custom_field] join keys, handlers.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/extensions/b2b-suite-migration/development/handler.md"]
---
## What it is

The syntax of the `<fields>` block in a B2B Suite to B2B Commercial migration XML mapping: how a column of a B2B Suite source table is mapped to a column of a B2B Commercial target table, directly or through joins.

## When to use

When writing or extending the `<fields>` of an entity in a migration component's XML configuration.

## Key steps / config

Each `<field>` inside `<fields>` maps `source` (source-table column) to `target` (target-table column).

### One-to-one mapping

Direct copy, no transformation — e.g. `customer_id` in `b2b_customer_data` to `customer_id` in `b2b_business_partner`.

```xml
<fields>
  <field source="customer_id" target="customer_id"/>
  <field source="created_at" target="created_at"/>
</fields>
```

### Relational mapping

Fetch a value from a related table by joining through a foreign key. Format: `foreign_field.foreign_table.field_of_foreign_table`.

- `foreign_field` — column in the source table used for the join;
- `foreign_table` — related table to join;
- `field_of_foreign_table` — column to read from it.

`<field source="context_owner_id.b2b_store_front_auth.customer_id" target="business_partner_customer_id"/>` joins on `context_owner_id = b2b_store_front_auth.id` and maps `b2b_store_front_auth.customer_id` to `business_partner_customer_id`.

**Multiple joins** chain hops: `source="foo_id.foo.bar_id.bar.name"` joins `source_table.foo_id` to `foo.id`, then `foo.bar_id` to `bar.id`, and reads `bar.name`.

**Custom join field**: joins use the foreign table's `id` by default; name a different column in square brackets — `source="foreign_field.foreign_table[custom_field].field_of_foreign_table"` joins to `foreign_table.custom_field` instead of `id`.

### Handler-based mapping

When data needs custom transformation before it reaches the target field(s), use a handler — see [Handler](platform/dev/6.7/products/extensions/b2b-suite-migration/development/handler.md).

## Essential identifiers

- `<fields>`, `<field source="..." target="..."/>`
- `foreign_field.foreign_table.field_of_foreign_table`
- `foreign_table[custom_field]`

## Gotchas

- Foreign key relationships used in relational mappings must be valid, otherwise the migration errors.

## Code check (6.7.15.1)
- unverified `b2b_store_front_auth` — B2B Suite table, not defined in core/storefront/administration; out of scope
- unverified `b2b_business_partner` — B2B Commercial (SwagCommercial) table; out of scope
- unverified `field` — XML element of the SwagCommercial migration schema; out of scope
