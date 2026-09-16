---
id: platform/hubs/storefront.md
title: storefront
summary: "Storefront hub: architecture, page/pagelet loading, theming, plugin/app customization, accessibility, security ADRs, and B2B Suite storefront guides."
keywords: ["storefront", "theme", "theme inheritance", "twig templates", "storefront plugin", "storefront app", "page loader", "pagelet", "scss styling", "accessibility", "csrf", "b2b suite", "api", "deployments"]
members: [platform/dev/6.6/concepts/api/_index.md, platform/dev/6.6/concepts/framework/architecture/storefront-concept.md, platform/dev/6.6/guides/hosting/installation-updates/deployments/_index.md, platform/dev/6.6/guides/plugins/apps/_index.md, platform/dev/6.6/guides/plugins/apps/storefront/_index.md, platform/dev/6.6/guides/plugins/plugins/storefront/_index.md, platform/dev/6.6/products/extensions/b2b-suite/guides/_index.md, platform/dev/6.6/products/extensions/b2b-suite/guides/storefront/_index.md, platform/dev/6.6/resources/references/adr/2020-11-20-add-login-required-annotation.md, platform/dev/6.6/resources/references/adr/2021-09-22-refactor-theme-inheritance.md, platform/dev/6.6/resources/references/adr/2022-09-28-mapping-of-product-area.md, platform/dev/6.6/resources/references/adr/2022-11-16-deprecate-csrf.md, platform/dev/6.6/resources/references/adr/2022-21-11-replace-drop-shadow-with-box-shadow.md, platform/dev/6.6/resources/references/adr/2022-25-11-run-lighthouse-test-ine2e-env.md, platform/dev/6.6/resources/references/adr/2025-01-01-remove-asterisk-next-to-every-price.md, platform/dev/6.6/resources/references/storefront-reference/_index.md, platform/dev/6.7/concepts/framework/architecture/_index.md, platform/dev/6.7/concepts/framework/architecture/storefront-concept.md, platform/dev/6.7/guides/development/accessibility/accessibility-checklist.md, platform/dev/6.7/guides/development/testing/store/storefront-performance-and-errors.md, platform/dev/6.7/guides/plugins/plugins/storefront/_index.md, platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-custom-assets.md, platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-custom-styling.md, platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-icons.md, platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-templates.md, platform/dev/6.7/guides/plugins/themes/inheritance/_index.md, platform/dev/6.7/guides/plugins/themes/inheritance/add-theme-inheritance-without-resources.md, platform/dev/6.7/guides/plugins/themes/inheritance/add-theme-inheritance.md, platform/dev/6.7/guides/plugins/themes/styling/override-bootstrap-variables-in-a-theme.md, platform/dev/6.7/products/extensions/b2b-suite/guides/_index.md, platform/dev/6.7/products/extensions/b2b-suite/guides/storefront/_index.md, platform/dev/6.7/resources/guidelines/code/platform-domains.md, platform/dev/6.7/resources/guidelines/code/session-and-state.md, platform/dev/6.7/resources/references/adr/2020-09-08-custom-field-label-loading-in-storefront.md, platform/dev/6.7/resources/references/adr/2021-09-22-refactor-theme-inheritance.md, platform/func/features/shopware-rise/immersive-elements.md]
lastBuilt: 2026-09-15
---

Come here for anything about the Shopware Storefront: its Page/Pagelet PHP architecture,
Twig template overriding, SCSS/theme customization and inheritance, plugin and app
extension points, accessibility and performance rules, and the ADRs that shaped storefront
security and rendering behaviour. Prefer this hub over grepping directly when the question
spans template overrides, theming, or storefront-facing plugin/app development, since the
relevant guidance is split across several `6.6`/`6.7` guide trees plus ADRs.

### Concepts and architecture

- [Storefront](platform/dev/6.6/concepts/framework/architecture/storefront-concept.md) — 6.6: the Storefront PHP component's Page/Pagelet system, composite data loading via the Store API, Twig templating, snippet-based translations.
- [Storefront](platform/dev/6.7/concepts/framework/architecture/storefront-concept.md) — 6.7 version of the same concept page (Page/PageLoader/PageLoadedEvent pattern, directory layout, snippet files); near-duplicate of the 6.6 entry above, kept per-version.
- [Architecture](platform/dev/6.7/concepts/framework/architecture/_index.md) — 6.7 overview placing Storefront alongside Core, Administration, API-first design, plugins/events and the message queue.
- [API](platform/dev/6.6/concepts/api/_index.md) — Store API (storefront integrations) vs Admin API, and supported auth methods.

### Plugin and app extension (grouped by version)

6.6:
- [Storefront](platform/dev/6.6/guides/plugins/plugins/storefront/_index.md) — plugin customization of templates, styles and components.
- [Apps](platform/dev/6.6/guides/plugins/apps/_index.md) — App SDK/plugin system/App scripts overview for extending storefront and admin.
- [Storefront](platform/dev/6.6/guides/plugins/apps/storefront/_index.md) — apps modifying Storefront templates, JS, styling and assets without an external server.

6.7:
- [Storefront](platform/dev/6.7/guides/plugins/plugins/storefront/_index.md) — plugin guide index (controllers, templates, JS, styling/assets); near-duplicate of the 6.6 plugin-storefront entry above.
- [Add Custom Assets](platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-custom-assets.md) — `src/Resources/public`, `assets:install`, Twig `asset()`/SCSS `$sw-asset-public-url`.
- [Add Custom Styling](platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-custom-styling.md) — plugin `base.scss`, `storefront-build`/`storefront-watch`.
- [Add Custom Icons](platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-icons.md) — `sw_icon` tag and custom icon packs.
- [Customize Templates](platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-templates.md) — overriding Twig templates via `sw_extends`.

### Theming (6.7)

- [Inheritance](platform/dev/6.7/guides/plugins/themes/inheritance/_index.md) — theme inheritance guide index.
- [Theme with Bootstrap styling](platform/dev/6.7/guides/plugins/themes/inheritance/add-theme-inheritance-without-resources.md) — `@StorefrontBootstrap` instead of `@Storefront` for a Bootstrap-only theme.
- [Theme Inheritance](platform/dev/6.7/guides/plugins/themes/inheritance/add-theme-inheritance.md) — extending a theme via `theme.json`'s `views`/`style`/`script`/`asset`/`configInheritance`.
- [Override Bootstrap variables in a Theme](platform/dev/6.7/guides/plugins/themes/styling/override-bootstrap-variables-in-a-theme.md) — `overrides.scss` before `@Storefront`, then `theme:compile`.

### Guidelines, testing and deployment

- [Platform Domains](platform/dev/6.7/resources/guidelines/code/platform-domains.md) — Storefront may depend only on Core; enforced via phpat.
- [Session and State](platform/dev/6.7/resources/guidelines/code/session-and-state.md) — PHP session handling belongs to the Storefront domain, not Core.
- [Accessibility Checklist](platform/dev/6.7/guides/development/accessibility/accessibility-checklist.md) — semantic HTML, ARIA, focus/keyboard, skip links.
- [Storefront, performance, and errors](platform/dev/6.7/guides/development/testing/store/storefront-performance-and-errors.md) — Store review rules (Lighthouse, no inline CSS, no new console errors/404s).
- [Deployments](platform/dev/6.6/guides/hosting/installation-updates/deployments/_index.md) — building Administration/Storefront assets without a database.
- [Storefront Reference](platform/dev/6.6/resources/references/storefront-reference/_index.md) — index of storefront Twig functions/filters/extensions.

### ADRs (lifecycle/security decisions)

- [Add the login required annotation](platform/dev/6.6/resources/references/adr/2020-11-20-add-login-required-annotation.md) — `@LoginRequired` guarding store-api/storefront routes.
- [Refactor theme inheritance](platform/dev/6.6/resources/references/adr/2021-09-22-refactor-theme-inheritance.md) and its [6.7 counterpart](platform/dev/6.7/resources/references/adr/2021-09-22-refactor-theme-inheritance.md) — same ADR (`configInheritance` in `theme.json`), duplicated per version.
- [Mapping of product area](platform/dev/6.6/resources/references/adr/2022-09-28-mapping-of-product-area.md) — `@package <area>` annotation mapping code to owning teams.
- [Deprecate the storefront CSRF implementation](platform/dev/6.6/resources/references/adr/2022-11-16-deprecate-csrf.md) — CSRF protection removed in favour of SameSite cookies from the 6.5 browser baseline.
- [Replace drop-shadow with box-shadow](platform/dev/6.6/resources/references/adr/2022-21-11-replace-drop-shadow-with-box-shadow.md) — Safari performance fix.
- [Run Lighthouse tests in E2E env](platform/dev/6.6/resources/references/adr/2022-25-11-run-lighthouse-test-ine2e-env.md) — `APP_ENV=e2e` instead of `prod` for Lighthouse runs.
- [Remove the asterisk next to every price and replace it with actual text](platform/dev/6.6/resources/references/adr/2025-01-01-remove-asterisk-next-to-every-price.md) — gated by `ACCESSIBILITY_TWEAKS` until v6.7.0.
- [CustomField label loading in storefront](platform/dev/6.7/resources/references/adr/2020-09-08-custom-field-label-loading-in-storefront.md) — auto-generated `customFields.<name>` snippets per snippet set.

### B2B Suite storefront (grouped by version)

- [Guides](platform/dev/6.6/products/extensions/b2b-suite/guides/_index.md) / [Guides](platform/dev/6.7/products/extensions/b2b-suite/guides/_index.md) — B2B Suite guide entry points (installation, Core/Storefront/Administration), near-identical per version.
- [Storefront](platform/dev/6.6/products/extensions/b2b-suite/guides/storefront/_index.md) / [Storefront](platform/dev/6.7/products/extensions/b2b-suite/guides/storefront/_index.md) — B2B Storefront guides (ajax panel, product search, complex views, modal component, ACL routing), near-identical per version.

### Merchant / feature docs

- [Immersive Elements](platform/func/features/shopware-rise/immersive-elements.md) — Rise/Evolve/Beyond-plan extension adding 3D elements to the storefront Commerce section.
</content>
