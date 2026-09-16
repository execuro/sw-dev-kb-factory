---
id: platform/hubs/plugin.md
title: plugin
summary: "Plugin development hub: concepts, area guides (checkout, content, admin), extension types, rate limiter, in-app purchases, store quality guidelines."
keywords: ["plugin", "extension", "symfony bundle", "composer package", "plugin development", "plugin lifecycle", "checkout", "administration", "cms", "mail", "sitemap", "elasticsearch", "rate limiter", "in-app purchases", "store quality guidelines"]
members: ["platform/dev/6.6/concepts/extensions/plugins-concept.md", "platform/dev/6.6/guides/plugins/plugins/administration/_index.md", "platform/dev/6.6/guides/plugins/plugins/checkout/cart/_index.md", "platform/dev/6.6/guides/plugins/plugins/checkout/cart/customize-price-calculation.md", "platform/dev/6.6/guides/plugins/plugins/checkout/document/_index.md", "platform/dev/6.6/guides/plugins/plugins/checkout/order/_index.md", "platform/dev/6.6/guides/plugins/plugins/checkout/payment/_index.md", "platform/dev/6.6/guides/plugins/plugins/content/_index.md", "platform/dev/6.6/guides/plugins/plugins/content/cms/_index.md", "platform/dev/6.6/guides/plugins/plugins/content/mail/_index.md", "platform/dev/6.6/guides/plugins/plugins/content/sitemap/_index.md", "platform/dev/6.6/guides/plugins/plugins/elasticsearch/_index.md", "platform/dev/6.6/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/guides/development/_index.md", "platform/dev/6.7/guides/development/extensions/_index.md", "platform/dev/6.7/guides/development/testing/store/quality-guidelines.md", "platform/dev/6.7/guides/plugins/_index.md", "platform/dev/6.7/guides/plugins/plugins/_index.md", "platform/dev/6.7/guides/plugins/plugins/framework/rate-limiter/_index.md", "platform/dev/6.7/guides/plugins/plugins/in-app-purchases.md", "platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md", "platform/func/migration-en/magento-keywords.md"]
lastBuilt: 2026-09-15
---

Plugins are Symfony bundles that run inside the Shopware Core process, are packaged as Composer packages, and (unlike apps) are not usable on Shopware Cloud. Come to this hub instead of grepping directly when you need to decide which area guide (checkout, content, administration, elasticsearch, framework) covers a plugin task, when you need the plugin scaffolding/lifecycle steps, or when you need to compare plugins against apps/themes.

### Developer — 6.6 plugin guides

- [Plugins](platform/dev/6.6/concepts/extensions/plugins-concept.md) — concept: plugins are Symfony bundles, Core-process, Composer-packaged, not usable on Shopware Cloud.
- [Administration](platform/dev/6.6/guides/plugins/plugins/administration/_index.md) — section overview for extending the Administration panel (custom sections, modules, dashboards, settings).
- [Cart](platform/dev/6.6/guides/plugins/plugins/checkout/cart/_index.md) — overview of cart plugin capabilities: line items, discounts, custom prices, tax, checkout integration, validation.
- [Customize price calculation](platform/dev/6.6/guides/plugins/plugins/checkout/cart/customize-price-calculation.md) — decorate `ProductPriceCalculator`'s `calculate` method via service decoration to globally adjust product prices.
- [Document](platform/dev/6.6/guides/plugins/plugins/checkout/document/_index.md) — index for document generation/management plugin capabilities in checkout.
- [Order](platform/dev/6.6/guides/plugins/plugins/checkout/order/_index.md) — index for order placement, management, status, customization, notifications, history.
- [Payment](platform/dev/6.6/guides/plugins/plugins/checkout/payment/_index.md) — index for payment method integration, status tracking, refunds/cancellations, notifications.
- [Content](platform/dev/6.6/guides/plugins/plugins/content/_index.md) — index for content, mail, SEO, sitemap and media management plugin capabilities.
- [CMS](platform/dev/6.6/guides/plugins/plugins/content/cms/_index.md) — index for CMS plugin area: blocks, elements, Admin SDK access.
- [Mail](platform/dev/6.6/guides/plugins/plugins/content/mail/_index.md) — index for adding mail data and configuring mail templates.
- [Sitemap](platform/dev/6.6/guides/plugins/plugins/content/sitemap/_index.md) — index for custom sitemaps and modifying sitemap entries for SEO.
- [Elasticsearch](platform/dev/6.6/guides/plugins/plugins/elasticsearch/_index.md) — index for extending entity fields into the Elasticsearch search engine.
- [Plugin Base Guide](platform/dev/6.6/guides/plugins/plugins/plugin-base-guide.md) — walks through creating, structuring, and installing a first plugin (class, `composer.json`, console commands).

### Developer — 6.7 plugin/extension guides

- [Development](platform/dev/6.7/guides/development/_index.md) — 6.7 development entry page: extension types, typical workflow, Admin access, tooling (`bin/console`, `shopware-cli`, Deployment Helper).
- [Extensions](platform/dev/6.7/guides/development/extensions/_index.md) — plugin vs app vs theme comparison (Cloud, DB schema, routes/commands) plus entry points for creating, validating, releasing, and MCP-extending extensions.
- [Quality Guidelines for Store Extensions](platform/dev/6.7/guides/development/testing/store/quality-guidelines.md) — Shopware Store review process (PHPStan, SonarQube, manual review), test-on-latest-version requirement, topic page map.
- [Extensions](platform/dev/6.7/guides/plugins/_index.md) — near-duplicate of the extensions comparison above, framed from the plugins-guide entry point: plugins (full system access, self-hosted only) vs apps (external, HTTP API, Cloud-compatible); themes are plugins.
- [Plugins](platform/dev/6.7/guides/plugins/plugins/_index.md) — when to use a plugin vs theme vs app; static plugins vs managed plugins vs Shopware/Symfony bundles.
- [Rate Limiter](platform/dev/6.7/guides/plugins/plugins/framework/rate-limiter/_index.md) — caps how many API requests a key may make per time period (`shopware.api.rate_limiter`, `ensureAccepted`, `RateLimitExceededException`).
- [In-App Purchases (IAP)](platform/dev/6.7/guides/plugins/plugins/in-app-purchases.md) — request checkout via `inAppPurchaseCheckout`, check `InAppPurchase::isActive` in PHP/admin, `InAppPurchasesGatewayEvent`.
- [Plugin Base Guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md) — near-duplicate title of the 6.6 base guide but different content: a roadmap of 6.7 plugin-development steps linking to focused guides, scaffolding via `plugin:create` and Toolbox, upgrade tips.

### Merchant

- [Magento Keywords](platform/func/migration-en/magento-keywords.md) — Magento-to-Shopware terminology dictionary, including how Magento "extensions" map to Shopware plugins/apps in the admin UI.
</content>
