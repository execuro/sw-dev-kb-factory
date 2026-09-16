---
id: platform/dev/6.7/products/extensions/b2b-suite-migration/development/fields-mapping.md
title: Fields Mapping
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite-migration/development/fields-mapping.html
sourceHash: c969cb6365cb9cabe5e1ec4f844ce0e311ddb199
codeCheckedAgainst: "6.7.13.0"
keywords: ["fields", "field", "source", "target", "b2b suite migration", "b2b commercial", "field mapping", "relational mapping", "one-to-one mapping", "custom join field", "foreign key join", "handler", "migration xml"]
summary: "B2B Suite to B2B Commercial migration XML: <fields>/<field source target> mappings, one-to-one, dotted relational joins, [custom_field] join keys."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/extensions/b2b-suite-migration/development/handler.md"]
---
## What it is

How to declare column mappings from B2B Suite source tables to B2B Commercial target tables in the migration XML configuration, inside a component entity's `<fields>` element.

## When to use

When writing or extending a B2B Suite to B2B Commercial migration component and you need to say which source column (or joined column) fills which target column.

## Key steps / config

Mappings live in `<fields>`, one `<field>` per target column:

```xml
<fields>
  <field source="customer_id" target="customer_id"/>
  <field source="created_at" target="created_at"/>
</fields>
```

- `source` — field name in the source table (e.g. `customer_id` in `b2b_customer_data`).
- `target` — field name in the target table (e.g. `customer_id` in `b2b_business_partner`).

### One-to-one mapping

`<field source="customer_id" target="customer_id"/>` — direct transfer, no transformation.

### Relational mapping (joins via dotted path)

```xml
<field source="context_owner_id.b2b_store_front_auth.customer_id" target="business_partner_customer_id"/>
```

Joins the source table to `b2b_store_front_auth` on `context_owner_id = b2b_store_front_auth.id`, reads `customer_id`, writes it to `business_partner_customer_id`.

1. Basic format: `foreign_field.foreign_table.field_of_foreign_table`
   - `foreign_field` — column in the source table used for the join
   - `foreign_table` — related table to join
   - `field_of_foreign_table` — column read from the foreign table
2. Multiple joins, chained: `source="foo_id.foo.bar_id.bar.name"` joins `source_table.foo_id` to `foo.id`, then `foo.bar_id` to `bar.id`, and reads `bar.name`.
3. Custom join field: joins use the foreign table's `id` by default; put another column in square brackets:
   `source="foreign_field.foreign_table[custom_field].field_of_foreign_table"` joins to `foreign_table.custom_field` instead of `id`.

### Handler-based mapping

When a value needs custom transformation before it is written, add a handler to the `<field>` — see [Handlers](platform/dev/6.7/products/extensions/b2b-suite-migration/development/handler.md).

## Essential identifiers

- `<fields>`, `<field source="..." target="..."/>`
- Dotted relational path `foreign_field.foreign_table.field_of_foreign_table`
- Custom join key syntax `foreign_table[custom_field]`
- Example tables: `b2b_customer_data`, `b2b_business_partner`, `b2b_store_front_auth`

## Gotchas

- The foreign-key relationships used in a relational path must be valid, otherwise the migration errors.
- Without square brackets the join always targets the foreign table's `id` column.

## Code check (6.7.13.0)
- unverified `<fields>` — migration XML schema belongs to the Shopware Commercial B2B Suite migration extension, not present under vendor/shopware/{core,storefront,administration}
- unverified `b2b_business_partner` — B2B Commercial table, out of scope of the installed core/storefront/administration packages
- unverified `b2b_store_front_auth` — B2B Suite table, out of scope of the installed core/storefront/administration packages
