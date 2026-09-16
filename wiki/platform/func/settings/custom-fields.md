---
id: platform/func/settings/custom-fields.md
title: Custom Fields
docType: functional
version: "6.5"
versions: ["6.5", "6.6"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/settings/custom-fields"
sourceHash: 55e7c2cb58f39953bc678f83d2c93a869251f4392bf4d3a43d9650b1ba2365f7
revision:
  current: true
  range: "6.4.14.0 - 6.6.8.2"
  swMin: "6.4.14.0"
  swMax: "6.6.8.2"
keywords: ["custom fields", "custom field set", "technical name", "modifiable via store api", "available in shopping carts", "rule builder", "object selection", "select field", "text editor", "data mapping", "shopping experiences", "twig special characters"]
summary: Documents custom field sets and field types in Shopware — configuration options, storefront exposure, and Store API visibility.
lastBuilt: 2026-09-15
---
## What it is

Custom fields let merchants add their own data fields to entities like products or categories, for use in the Rule Builder, storefront templates, or the Store API. Managed under **Settings > System > Custom fields**.

## When to use

Used when the standard system fields are insufficient — e.g. storing extra product attributes, showing them in the storefront, or referencing them from the Rule Builder.

## Key steps / config

Custom fields are grouped into **Sets** (created via **New set**), each requiring a unique **technical name** that cannot be changed later, a **position**, a **label** (optionally per admin language), and the program areas (e.g. products, categories) the set applies to; a set with no area selected is created but unavailable anywhere.

Within a set, **New custom field** opens a type-specific form. Common options across types: **Technical name** (required, unique, immutable), **Position**, **Available in shopping carts** (needed for Rule Builder/template use), **Modifiable via Store API** (makes the field publicly writable/readable — must not be used for sensitive data), **Label**, **Help text**, and type-specific options like **Placeholder**.

Field types covered: **Select** (single/multi option list), **Object selection** (references entities: dynamic product group, experience world, manufacturer, category, customer, country, delivery method, product, sales channel, payment method — object type fixed after creation), **Text field**, **Media**, **Number** (integer/float, with Steps/Min/Maximum), **Date/Time**, **Checkbox**, **Active/Inactive switch** (stores `0`/`1`), **Text Editor**, **Color picker**.

Custom fields can be linked to text blocks in **Shopping Experiences**: add a Text or Text & images block, open its settings (gear icon), click **Data Mapping**, then select the custom field; **Remove Data Mapping** undoes the link.

## Essential identifiers

- **Settings > System > Custom fields**
- **Technical name** — required, unique, immutable per field/set
- **Modifiable via Store API** toggle
- **Available in shopping carts** toggle

## Gotchas

CustomFields should always be edited in the store's default language, since inheritance to other languages depends on it — otherwise rules relying on the value may not apply in all languages. Technical names must not contain Twig special characters such as `-` or `#`, or product exports can error. When a custom field is created, it is automatically added as a snippet in all snippet sets, without needing database changes.
