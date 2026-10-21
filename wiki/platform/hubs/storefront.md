---
id: platform/hubs/storefront.md
title: storefront
summary: Storefront navigation hub - Page/Pagelet concept, plugin and app customization, themes, sales channels, related ADRs and B2B Suite storefront.
keywords: ["storefront", "pagelet", "page loader", "theme inheritance", "theme.json", "storefront plugin", "sales channel", "twig", "csrf", "session", "b2b suite storefront", "adr"]
members: ["platform/dev/6.6/concepts/api/_index.md", "platform/dev/6.6/concepts/commerce/catalog/sales-channels.md", "platform/dev/6.6/concepts/framework/architecture/storefront-concept.md", "platform/dev/6.6/guides/hosting/installation-updates/deployments/_index.md", "platform/dev/6.6/guides/plugins/apps/_index.md", "platform/dev/6.6/guides/plugins/apps/storefront/_index.md", "platform/dev/6.6/guides/plugins/plugins/storefront/_index.md", "platform/dev/6.6/products/extensions/b2b-suite/guides/_index.md", "platform/dev/6.6/products/extensions/b2b-suite/guides/storefront/_index.md", "platform/dev/6.6/resources/references/adr/2020-11-20-add-login-required-annotation.md", "platform/dev/6.6/resources/references/adr/2021-09-22-refactor-theme-inheritance.md", "platform/dev/6.6/resources/references/adr/2022-09-28-mapping-of-product-area.md", "platform/dev/6.6/resources/references/adr/2022-11-16-deprecate-csrf.md", "platform/dev/6.6/resources/references/adr/2022-21-11-replace-drop-shadow-with-box-shadow.md", "platform/dev/6.6/resources/references/adr/2022-25-11-run-lighthouse-test-ine2e-env.md", "platform/dev/6.6/resources/references/adr/2025-01-01-remove-asterisk-next-to-every-price.md", "platform/dev/6.6/resources/references/storefront-reference/_index.md", "platform/dev/6.7/concepts/commerce/catalog/sales-channels.md", "platform/dev/6.7/concepts/framework/architecture/_index.md", "platform/dev/6.7/concepts/framework/architecture/storefront-concept.md", "platform/dev/6.7/guides/plugins/plugins/architecture/dependency-injection-dependency-handling.md", "platform/dev/6.7/guides/plugins/plugins/storefront/_index.md", "platform/dev/6.7/guides/plugins/themes/inheritance/_index.md", "platform/dev/6.7/guides/plugins/themes/inheritance/add-theme-inheritance-without-resources.md", "platform/dev/6.7/guides/plugins/themes/inheritance/add-theme-inheritance.md", "platform/dev/6.7/products/extensions/b2b-suite/guides/storefront/_index.md", "platform/dev/6.7/products/paas/shopware/cdn/_index.md", "platform/dev/6.7/resources/guidelines/code/platform-domains.md", "platform/dev/6.7/resources/guidelines/code/session-and-state.md", "platform/dev/6.7/resources/references/adr/2021-09-22-refactor-theme-inheritance.md", "platform/func/features/shopware-rise/immersive-elements.md"]
lastBuilt: 2026-10-21
---

# Storefront

The Storefront is the Twig/Bootstrap frontend layer on top of the Core, built from Pages and Pagelets that load data through Store API routes. Come here when a question touches Storefront architecture, customizing it with plugins, apps or themes, theme inheritance, or Storefront-specific decisions (CSRF, session, price display). Several topics exist in both 6.6 and 6.7; where a page appears twice, the 6.7 copy is the current one and the 6.6 copy is the same subject for the older release.

## Dev 6.7

Concepts and architecture
- [Architecture](platform/dev/6.7/concepts/framework/architecture/_index.md) - Core, Storefront and Administration domains on a Symfony, API-first base.
- [Storefront](platform/dev/6.7/concepts/framework/architecture/storefront-concept.md) - Page/Pagelet/loader/event composition via Store API routes, directory layout, snippets.
- [Sales Channels](platform/dev/6.7/concepts/commerce/catalog/sales-channels.md) - domains, navigation roots, SalesChannelContext creation and Store API context routes.

Plugins and themes
- [Storefront](platform/dev/6.7/guides/plugins/plugins/storefront/_index.md) - Storefront plugin guides: controllers, pages, templates, JavaScript, styling.
- [Dependency Injection & Dependency Handling](platform/dev/6.7/guides/plugins/plugins/architecture/dependency-injection-dependency-handling.md) - Core vs Storefront boundaries, no session or request access in Core services.
- [Inheritance](platform/dev/6.7/guides/plugins/themes/inheritance/_index.md) - section index for extending and composing themes.
- [Theme Inheritance](platform/dev/6.7/guides/plugins/themes/inheritance/add-theme-inheritance.md) - extend a theme through @ThemeName placeholders and configInheritance in theme.json.
- [Theme with Bootstrap styling](platform/dev/6.7/guides/plugins/themes/inheritance/add-theme-inheritance-without-resources.md) - use @StorefrontBootstrap instead of @Storefront for plain Bootstrap SCSS.

Guidelines and ADRs
- [Platform Domains](platform/dev/6.7/resources/guidelines/code/platform-domains.md) - allowed dependencies between Core, Administration, Storefront and Elasticsearch.
- [Session and State](platform/dev/6.7/resources/guidelines/code/session-and-state.md) - Core must not access the PHP session; session handling belongs in the Storefront.
- [Refactor theme inheritance](platform/dev/6.7/resources/references/adr/2021-09-22-refactor-theme-inheritance.md) - configInheritance in theme.json (same ADR as the 6.6 copy).

Extensions and hosting
- [Storefront](platform/dev/6.7/products/extensions/b2b-suite/guides/storefront/_index.md) - B2B Suite Storefront component: ajax panel, product search, modal, ACL routing.
- [CDN](platform/dev/6.7/products/paas/shopware/cdn/_index.md) - Fastly CDN in PaaS Native with soft purge and edge HTTP cache.

## Dev 6.6

Concepts and guides
- [API](platform/dev/6.6/concepts/api/_index.md) - Store API for storefront integrations and Admin API, with auth methods.
- [Sales Channels](platform/dev/6.6/concepts/commerce/catalog/sales-channels.md) - multiple stores per instance; domains set language, currency and snippet set.
- [Storefront](platform/dev/6.6/concepts/framework/architecture/storefront-concept.md) - the Storefront PHP component, Pagelets, Twig and snippets.
- [Storefront](platform/dev/6.6/guides/plugins/plugins/storefront/_index.md) - how plugins customize templates, styles and components.
- [Apps](platform/dev/6.6/guides/plugins/apps/_index.md) - apps via App SDK, plugin system or App scripts.
- [Storefront](platform/dev/6.6/guides/plugins/apps/storefront/_index.md) - apps modifying templates, JavaScript, styling and assets without an external server.
- [Deployments](platform/dev/6.6/guides/hosting/installation-updates/deployments/_index.md) - deployment guides and building Storefront/Administration assets without a database.
- [Storefront Reference](platform/dev/6.6/resources/references/storefront-reference/_index.md) - Storefront functions, filters and extensions.

B2B Suite
- [Guides](platform/dev/6.6/products/extensions/b2b-suite/guides/_index.md) - installation and Core, Storefront, Administration components.
- [Storefront](platform/dev/6.6/products/extensions/b2b-suite/guides/storefront/_index.md) - B2B Suite Storefront guides index.

ADRs
- [Add the login required annotation](platform/dev/6.6/resources/references/adr/2020-11-20-add-login-required-annotation.md) - @LoginRequired for store-api/storefront routes.
- [Refactor theme inheritance](platform/dev/6.6/resources/references/adr/2021-09-22-refactor-theme-inheritance.md) - configInheritance in theme.json (same ADR as the 6.7 copy).
- [Mapping of product area](platform/dev/6.6/resources/references/adr/2022-09-28-mapping-of-product-area.md) - @package annotation mapping code to teams.
- [Deprecate the storefront CSRF implementation](platform/dev/6.6/resources/references/adr/2022-11-16-deprecate-csrf.md) - CSRF protection replaced by SameSite cookies from the 6.5 browser baseline.
- [Replace drop-shadow with box-shadow](platform/dev/6.6/resources/references/adr/2022-21-11-replace-drop-shadow-with-box-shadow.md) - Safari performance fix.
- [Run Lighthouse tests in E2E env](platform/dev/6.6/resources/references/adr/2022-25-11-run-lighthouse-test-ine2e-env.md) - APP_ENV=e2e instead of prod to avoid admin worker timeouts.
- [Remove the asterisk next to every price and replace it with actual text](platform/dev/6.6/resources/references/adr/2025-01-01-remove-asterisk-next-to-every-price.md) - gated by ACCESSIBILITY_TWEAKS until v6.7.0.

## Functional (plan-gated)

- [Immersive Elements](platform/func/features/shopware-rise/immersive-elements.md) - 3D elements in the Storefront Commerce section; included in Rise, Evolve and Beyond plans.
