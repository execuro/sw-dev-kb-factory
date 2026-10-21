---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/products/extensions/_index.md
sourceHash: 0fc2533361963d528ff8a4971baf807e1fe1367a
sourceUrl: https://developer.shopware.com/docs/products/extensions/
title: Extensions
version: "6.7"
versions:
  - "6.7"
keywords: ["extensions", "shopware extensions", "migration assistant", "SwagMigrationAssistant", "b2b suite", "SwagB2bPlatform", "b2b components", "advanced search", "subscriptions", "data migration", "quick order", "order lists", "budgets"]
summary: "Index of Shopware's own extensions: Migration Assistant, B2B Suite, B2B Components, Advanced Search and Subscriptions."
lastBuilt: 2026-10-21
---
## What it is

Section index of the special extensions Shopware itself provides. The source lists five, each with a one-line description:

- **Migration Assistant**: an extension that connects the source shop and the target shop to migrate data between them.
- **B2B Suite**: equips the store with the most important B2B functions, including workflows, order lists, budgets and quick orders.
- **B2B Components**: lets you enhance the shop with individual essential B2B functionalities.
- **Advanced Search**: offers the possibility to customize the search fields.
- **Subscriptions**: lets you offer products on a subscription basis.

## When to use

You need to find which Shopware-provided extension covers data migration, B2B functions, search customization or subscription selling before opening its section.

## Code check (6.7.15.1)
- confirmed `SwagMigrationAssistant` — listed as a first-party plugin in the translation config; the extension itself is not in core — vendor/shopware/core/System/Resources/translation.yaml:13
- confirmed `SwagB2bPlatform` — listed as a first-party plugin in the translation config — vendor/shopware/core/System/Resources/translation.yaml:9
- unverified `Advanced Search` — extension not shipped in the core, storefront or administration packages
- unverified `Subscriptions` — extension not shipped in the core, storefront or administration packages
