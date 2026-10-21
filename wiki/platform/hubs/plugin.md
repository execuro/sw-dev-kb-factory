---
id: platform/hubs/plugin.md
title: plugin
summary: "Hub for Shopware plugins: concepts, plugin vs app, base guide, checkout/content/Elasticsearch areas (6.6), 6.7 plugin overview, Store quality."
keywords: ["plugin", "static plugin", "managed plugin", "symfony bundle", "plugin vs app", "extensions", "plugin base guide", "custom/plugins", "store quality guidelines", "meteor admin sdk", "checkout plugins", "shopware cloud"]
members: ["platform/dev/6.6/concepts/extensions/plugins-concept.md", "platform/dev/6.6/guides/plugins/plugins/administration/_index.md", "platform/dev/6.6/guides/plugins/plugins/checkout/cart/_index.md", "platform/dev/6.6/guides/plugins/plugins/checkout/cart/customize-price-calculation.md", "platform/dev/6.6/guides/plugins/plugins/checkout/document/_index.md", "platform/dev/6.6/guides/plugins/plugins/checkout/order/_index.md", "platform/dev/6.6/guides/plugins/plugins/checkout/payment/_index.md", "platform/dev/6.6/guides/plugins/plugins/content/_index.md", "platform/dev/6.6/guides/plugins/plugins/content/cms/_index.md", "platform/dev/6.6/guides/plugins/plugins/content/mail/_index.md", "platform/dev/6.6/guides/plugins/plugins/content/sitemap/_index.md", "platform/dev/6.6/guides/plugins/plugins/elasticsearch/_index.md", "platform/dev/6.6/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/concepts/extensions/_index.md", "platform/dev/6.7/guides/development/_index.md", "platform/dev/6.7/guides/development/extensions/_index.md", "platform/dev/6.7/guides/development/testing/store/quality-guidelines.md", "platform/dev/6.7/guides/plugins/_index.md", "platform/dev/6.7/guides/plugins/apps/administration/meteor-admin-sdk.md", "platform/dev/6.7/guides/plugins/plugins/_index.md", "platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/add-filter.md", "platform/dev/6.7/guides/plugins/plugins/content/mail/_index.md", "platform/dev/6.7/guides/plugins/plugins/content/media/_index.md", "platform/func/migration-en/magento-keywords.md"]
lastBuilt: 2026-10-21
---
Plugins are the in-process Shopware extension type: Symfony-bundle based, running inside the Core process, with database access and service overriding, self-hosted only. Come here to decide plugin vs app, to find the plugin base guide, or to locate the per-area plugin guides (checkout, content, Administration, Elasticsearch) before grepping.

## Developer, 6.6

Concept and base guide:

- [Plugins](platform/dev/6.6/concepts/extensions/plugins-concept.md) — plugins extend Symfony bundles, ship as Composer packages, and are not usable on Shopware cloud (use an app there).
- [Plugin Base Guide](platform/dev/6.6/guides/plugins/plugins/plugin-base-guide.md) — creating, structuring and installing a first plugin (`plugin:create`, `plugin:refresh`, `plugin:install`, `composer.json`).

Administration:

- [Administration](platform/dev/6.6/guides/plugins/plugins/administration/_index.md) — section overview: custom sections, modules, dashboards and settings.

Checkout:

- [Cart](platform/dev/6.6/guides/plugins/plugins/checkout/cart/_index.md) — cart plugin capabilities: products, discounts, custom prices, tax, validation.
- [Customize price calculation](platform/dev/6.6/guides/plugins/plugins/checkout/cart/customize-price-calculation.md) — decorating `ProductPriceCalculator` to adjust product prices globally.
- [Document](platform/dev/6.6/guides/plugins/plugins/checkout/document/_index.md) — index of document generation and management capabilities.
- [Order](platform/dev/6.6/guides/plugins/plugins/checkout/order/_index.md) — index of order placement, management, status and notification capabilities.
- [Payment](platform/dev/6.6/guides/plugins/plugins/checkout/payment/_index.md) — index of payment method integration, status, refunds and notifications.

Content and search:

- [Content](platform/dev/6.6/guides/plugins/plugins/content/_index.md) — index of content, mail, SEO, sitemap and media areas.
- [CMS](platform/dev/6.6/guides/plugins/plugins/content/cms/_index.md) — CMS blocks, elements and Admin SDK access.
- [Mail](platform/dev/6.6/guides/plugins/plugins/content/mail/_index.md) — adding mail data and configuring mail templates.
- [Sitemap](platform/dev/6.6/guides/plugins/plugins/content/sitemap/_index.md) — custom sitemaps and modifying sitemap entries.
- [Elasticsearch](platform/dev/6.6/guides/plugins/plugins/elasticsearch/_index.md) — extending entity fields into the Elasticsearch search engine.

## Developer, 6.7

Extension types and plugin overview:

- [Extensions](platform/dev/6.7/concepts/extensions/_index.md) — concept page: apps (external, webhooks, cloud-compatible) vs plugins (in-process, not supported in cloud).
- [Extensions](platform/dev/6.7/guides/plugins/_index.md) — 6.7 guide entry page with a plugin vs app capability table; overlaps the two other "Extensions" pages below, which carry a similar table.
- [Extensions](platform/dev/6.7/guides/development/extensions/_index.md) — extension type comparison plus entry points for build, validate and release.
- [Development](platform/dev/6.7/guides/development/_index.md) — 6.7 development entry point: workflow, `bin/console`, Shopware CLI, IDE tooling.
- [Plugins](platform/dev/6.7/guides/plugins/plugins/_index.md) — managed plugins vs static plugins vs bundles, and when to pick each.

Administration, content and Store:

- [Meteor Admin SDK](platform/dev/6.7/guides/plugins/apps/administration/meteor-admin-sdk.md) — `@shopware-ag/meteor-admin-sdk`, a TypeScript library for apps and plugins to extend the Administration.
- [Add Filter](platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/add-filter.md) — registering an Administration filter with `Shopware.Filter.register`.
- [Mail](platform/dev/6.7/guides/plugins/plugins/content/mail/_index.md) — 6.7 mail guides: template data and shipping mail templates (counterpart of the 6.6 Mail page).
- [Media](platform/dev/6.7/guides/plugins/plugins/content/media/_index.md) — protecting media from `media:delete-unused`, custom file extensions, remote thumbnails.
- [Quality Guidelines for Store Extensions](platform/dev/6.7/guides/development/testing/store/quality-guidelines.md) — Store review of plugins and apps, automated and manual.

## Merchant

- [Magento Keywords](platform/func/migration-en/magento-keywords.md) — Magento-to-Shopware terminology dictionary for merchants migrating; mentions extensions only as a mapped term.
