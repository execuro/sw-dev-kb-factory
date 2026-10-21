---
id: platform/hubs/sales-channel.md
title: "sales channel"
summary: "Sales channels: entities, domains, context and events (developer) plus admin setup, store language guides, themes and migration notes (merchant)."
keywords: ["sales channel", "sales_channel_domain", "product_visibility", "SalesChannelContext", "access key", "headless", "hreflang", "storefront theme", "social commerce", "language pack", "snippet set", "domains"]
members: ["platform/dev/6.6/concepts/commerce/catalog/sales-channels.md", "platform/dev/6.6/guides/plugins/apps/storefront/apps-as-themes.md", "platform/dev/6.6/products/digital-sales-rooms/configuration/domain-config.md", "platform/dev/6.6/products/extensions/b2b-components/shopping-lists/concepts/entities-and-schema.md", "platform/dev/6.6/resources/guidelines/code/events.md", "platform/dev/6.7/concepts/commerce/catalog/sales-channels.md", "platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-scss-variables-via-subscriber.md", "platform/dev/6.7/guides/plugins/themes/_index.md", "platform/func/features/social-commerce.md", "platform/func/first-steps/administration-overview.md", "platform/func/first-steps/internationalization.md", "platform/func/migration-en/magento-firststeps.md", "platform/func/migration-en/magento-keywords.md", "platform/func/migration-en/what-is-migrated.md", "platform/func/saas/Frequently-asked-questions.md", "platform/func/settings/Business-Events.md", "platform/func/settings/Newsletter-configuration.md", "platform/func/settings/Paymentmethods.md", "platform/func/settings/address.md", "platform/func/settings/saleschannel.md", "platform/func/shopware-6-de/marketing/newsletterrecipients.md", "platform/func/shopware-6-de/saas/Shipping.md", "platform/func/shopware-en/settings/login-registration.md", "platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/Dutch.md", "platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/English.md", "platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/Irish.md", "platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/Italian.md", "platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/Polish.md", "platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/Swiss.md", "platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/bilinguale.md", "platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/language-pack.md"]
lastBuilt: 2026-10-21
---
# Sales channel

A sales channel exposes the catalog to one audience (Storefront, headless Store API client, product feed or app) with its own defaults for language, currency, country, payment and shipping, plus domains and navigation roots. Come here to find the concept pages (entities, context creation, events), the admin configuration guide, and the many pages that mention sales-channel scoping (payment, shipping, newsletter, address, language setup). Use `read_doc` on the member that matches the question.

## Developer

### Shopware 6.7

- [Sales Channels](platform/dev/6.7/concepts/commerce/catalog/sales-channels.md) — `sales_channel`, `sales_channel_domain`, `product_visibility`, `SalesChannelContext` creation, Store API context routes and events.
- [Storefront Themes](platform/dev/6.7/guides/plugins/themes/_index.md) — themes as plugins implementing `ThemeInterface` or apps with `theme.json`, assigned per sales channel.
- [Add SCSS Variables via Subscriber](platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-scss-variables-via-subscriber.md) — `ThemeCompilerEnrichScssVariablesEvent` subscriber with `addVariable()`.

### Shopware 6.6

- [Sales Channels](platform/dev/6.6/concepts/commerce/catalog/sales-channels.md) — 6.6 concept page: multi-store setup, domains, access key. Same topic as the 6.7 page above; prefer the 6.7 page for current behaviour.
- [Apps as themes](platform/dev/6.6/guides/plugins/apps/storefront/apps-as-themes.md) — an app becomes a theme by shipping `theme.json`; without it changes apply to all sales channels.
- [Events](platform/dev/6.6/resources/guidelines/code/events.md) — event rules, including `ShopwareSalesChannelEvent` and `SalesChannelAware`.
- [Domain Configuration](platform/dev/6.6/products/digital-sales-rooms/configuration/domain-config.md) — adding the Digital Sales Rooms frontend app domain to a sales channel.
- [Entities & Schema](platform/dev/6.6/products/extensions/b2b-components/shopping-lists/concepts/entities-and-schema.md) — B2B Components shopping list entities tied to a customer and sales channel.

## Merchant

### Configuration and administration

- [Saleschannel](platform/func/settings/saleschannel.md) — create and configure channels: navigation, domains, payment/shipping, hreflang, API access, theme, analytics.
- [Administration Overview](platform/func/first-steps/administration-overview.md) — admin login, menu bar, configuration areas.
- [Login Registration](platform/func/shopware-en/settings/login-registration.md) — registration, double opt-in, guest orders, customer assignment.
- [Paymentmethods](platform/func/settings/Paymentmethods.md) — technical names, availability rules, storefront visibility.
- [Shipping](platform/func/shopware-6-de/saas/Shipping.md) — shipping methods, availability rules, price matrices.
- [Address](platform/func/settings/address.md) — zip code position per sales channel.
- [Business Events](platform/func/settings/Business-Events.md) — events to email templates with sales-channel scoping; superseded by Flow Builder.
- [Newsletter Configuration](platform/func/settings/Newsletter-configuration.md) — double opt-in and registration link.
- [Newsletterrecipients](platform/func/shopware-6-de/marketing/newsletterrecipients.md) — recipient overview, status and filtering.
- [Social Commerce](platform/func/features/social-commerce.md) — Facebook, Instagram and Pinterest as channels, typically via export feed.
- [Frequently Asked Questions](platform/func/saas/Frequently-asked-questions.md) — SaaS-only FAQ: suspended shops, test orders, maintenance mode.

### Languages and internationalization

- [Internationalization](platform/func/first-steps/internationalization.md) — languages, countries, currencies, taxes, snippets.
- [language-pack](platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/language-pack.md) — Dutch store via the unified language pack extension.
- [Bilinguale](platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/bilinguale.md) — bilingual German/French Swiss store via the language pack.
- [Swiss](platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/Swiss.md) — Switzerland with German and French.
- [Dutch](platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/Dutch.md) — Netherlands in Dutch (21% tax).
- [English](platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/English.md) — United Kingdom in English (20% tax).
- [Irish](platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/Irish.md) — Ireland in English (23% tax).
- [Italian](platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/Italian.md) — Italy in Italian (22% tax).
- [Polish](platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/Polish.md) — Poland in Polish, including admin language.

Dutch and language-pack overlap: both cover a Netherlands Dutch store, the latter using the language pack extension.

### Migration

- [What Is Migrated](platform/func/migration-en/what-is-migrated.md) — Shopware 5 to 6 data migrated automatically versus manual mapping.
- [Magento Firststeps](platform/func/migration-en/magento-firststeps.md) — migrating a Magento shop.
- [Magento Keywords](platform/func/migration-en/magento-keywords.md) — Magento-to-Shopware terminology.
