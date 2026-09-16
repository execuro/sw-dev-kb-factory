---
id: platform/hubs/sales-channel.md
title: sales channel
summary: "Sales channels: creation, domains, theming, payment/shipping/newsletter config, i18n, migration and merchant setup guides."
keywords: ["sales channel", "sales channel domains", "theme", "apps as themes", "internationalization", "payment methods", "shipping methods", "newsletter", "administration overview", "migration", "magento", "shopware 5 migration", "digital sales rooms", "agentic commerce", "social commerce"]
members: ["platform/dev/6.6/guides/plugins/apps/storefront/apps-as-themes.md", "platform/dev/6.6/products/digital-sales-rooms/configuration/domain-config.md", "platform/dev/6.6/products/extensions/b2b-components/shopping-lists/concepts/entities-and-schema.md", "platform/dev/6.6/resources/guidelines/code/events.md", "platform/func/extensions/agentic-commerce.md", "platform/func/features/social-commerce.md", "platform/func/first-steps/administration-overview.md", "platform/func/first-steps/internationalization.md", "platform/func/migration-en/magento-firststeps.md", "platform/func/migration-en/magento-keywords.md", "platform/func/migration-en/what-is-migrated.md", "platform/func/saas/Frequently-asked-questions.md", "platform/func/settings/Business-Events.md", "platform/func/settings/Newsletter-configuration.md", "platform/func/settings/Paymentmethods.md", "platform/func/settings/address.md", "platform/func/settings/saleschannel.md", "platform/func/shopware-6-de/marketing/newsletterrecipients.md", "platform/func/shopware-6-de/saas/Shipping.md", "platform/func/shopware-en/settings/login-registration.md", "platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/Dutch.md", "platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/English.md", "platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/Irish.md", "platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/Italian.md", "platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/Polish.md", "platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/Swiss.md", "platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/bilinguale.md", "platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/language-pack.md"]
lastBuilt: "2026-09-15"
---

This hub gathers everything touching the "sales channel" concept: how sales channels are created and configured in the administration, how apps/themes attach to them, how payment, shipping, newsletter and address settings scope to them, how sales-channel-aware events behave in code, and the merchant-facing guides (internationalization, migration from Magento/Shopware 5, and per-country store setup) that reference sales-channel configuration throughout. Come here instead of grepping directly when a task spans several of these settings areas or needs the merchant-vs-developer split at a glance.

**Developer**

- [Apps as themes](platform/dev/6.6/guides/plugins/apps/storefront/apps-as-themes.md) — an app becomes a theme by shipping `theme.json` in its Resources folder; without it, changes apply to all sales channels.
- [Domain Configuration](platform/dev/6.6/products/digital-sales-rooms/configuration/domain-config.md) — how to add the Digital Sales Rooms frontend app domain(s) to a sales channel's Domains section.
- [Entities & Schema](platform/dev/6.6/products/extensions/b2b-components/shopping-lists/concepts/entities-and-schema.md) — shopping list entity groups products for a customer/sales channel; line items reference each product and quantity.
- [Events](platform/dev/6.6/resources/guidelines/code/events.md) — every event implements `ShopwareEvent`; sales-channel events also implement `ShopwareSalesChannelEvent` and `SalesChannelAware` and must not alter program flow.

**Merchant — core sales channel configuration**

- [Saleschannel](platform/func/settings/saleschannel.md) — how sales channels are created, configured (navigation, domains, payment/shipping, hreflang, API access, theme, analytics) and managed.
- [Address](platform/func/settings/address.md) — configures whether the zip code is shown before or after the city name, per sales channel.
- [Paymentmethods](platform/func/settings/Paymentmethods.md) — configuring payment methods: technical names, position, availability rules and storefront visibility.
- [Shipping](platform/func/shopware-6-de/saas/Shipping.md) — shipping methods, availability rules, and price matrices; carrier assignment happens per order, not per method.
- [Business Events](platform/func/settings/Business-Events.md) — assigns Shopware events to email templates with optional Rule Builder conditions and sales-channel scoping; superseded by Flow Builder.
- [Newsletter Configuration](platform/func/settings/Newsletter-configuration.md) — newsletter double opt-in settings, email recipient configuration, and registration link building.
- [Newsletterrecipients](platform/func/shopware-6-de/marketing/newsletterrecipients.md) — admin overview of newsletter recipients under Marketing: status meanings, filtering, editing tags.
- [Login Registration](platform/func/shopware-en/settings/login-registration.md) — Settings > Customer > Log-in & sign-up: registration fields, double opt-in, guest orders, password rules, customer assignment.
- [Administration Overview](platform/func/first-steps/administration-overview.md) — admin login via `/admin`, the menu bar, configuration areas, search, and notifications.
- [Internationalization](platform/func/first-steps/internationalization.md) — add languages, activate countries, set currencies/taxes, and translate snippets, products, and Shopping Experiences.

**Merchant — extensions and channels**

- [Agentic Commerce](platform/func/extensions/agentic-commerce.md) — beta extension exposing a shop to AI agents via UCP and a JSONL product feed sales channel for ChatGPT/Google Merchant Center.
- [Social Commerce](platform/func/features/social-commerce.md) — lets merchants use Facebook, Instagram and Pinterest as additional sales channels, typically via an export feed.
- [Frequently Asked Questions](platform/func/saas/Frequently-asked-questions.md) — SaaS-only FAQ: shop suspension, test orders, maintenance mode, support and backups.

**Merchant — migration**

- [Magento Firststeps](platform/func/migration-en/magento-firststeps.md) — migrated data, attribute mapping, and points needing manual review when migrating from Magento.
- [Magento Keywords](platform/func/migration-en/magento-keywords.md) — Magento-to-Shopware terminology dictionary and admin UI mapping.
- [What Is Migrated](platform/func/migration-en/what-is-migrated.md) — what data migrates automatically from Shopware 5 to Shopware 6, what needs manual mapping, and post-migration checks.

**Merchant — per-country store setup** (near-duplicate walkthroughs, one per locale, each covering sales-channel language/domain/currency/tax defaults)

- [Dutch](platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/Dutch.md) — Netherlands setup: installer language, sales channel, domain, 21% tax, footer/landing pages, demo data.
- [English](platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/English.md) — United Kingdom setup: sales channel defaults, domain, 20% tax rate, footer/landing pages.
- [Irish](platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/Irish.md) — Ireland setup using English: sales channel defaults, domain, 23% tax rate.
- [Italian](platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/Italian.md) — Italy setup: sales channel defaults, domain, 22% tax rate.
- [Polish](platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/Polish.md) — installer language, admin language, sales-channel language and demo-data translation.
- [Swiss](platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/Swiss.md) — Switzerland with German and French: admin language, sales channel and per-domain settings.
- [Bilinguale](platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/bilinguale.md) — bilingual German/French Swiss store using the unified Shopware language pack extension.
- [Language Pack](platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/language-pack.md) — Netherlands/Dutch setup using the unified Shopware language pack extension; overlaps with the Dutch guide above.
