---
id: platform/dev/6.7/guides/plugins/plugins/storefront/_index.md
title: Storefront
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/
sourceHash: 4daef7317d78e32b4ffa3ba8248539846d87e35c
codeCheckedAgainst: "6.7.13.0"
keywords: ["storefront", "storefront plugin", "controllers", "templates", "twig", "javascript", "scss", "styling", "assets", "caching", "cookie consent", "customer-facing", "theme extension"]
summary: Index of plugin guides for extending the Storefront - controllers, templates, data injection, JavaScript, styling/assets, how-tos and advanced topics.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/concepts/framework/architecture/storefront-concept.md", "platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-controller.md", "platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-templates.md", "platform/dev/6.7/guides/development/tooling/using-watchers.md"]
---
## What it is

Entry point for plugin guides that extend the [Storefront](platform/dev/6.7/concepts/framework/architecture/storefront-concept.md), Shopware's customer-facing layer: adding pages or endpoints, modifying templates and layouts, injecting dynamic data, adding JavaScript behavior, and customizing styling and assets. The section mirrors the docs' `/storefront` folder structure.

## When to use

Start here when a plugin must change what shop customers see or how the Storefront behaves, and you need the guide for a specific layer (controller, template, JS, SCSS, assets). For headless frontends, the source points to Composable Frontends (https://developer.shopware.com/frontends/) instead of extending the default Storefront.

## Key steps / config

Typical workflow order:

1. Add or extend a controller
2. Render or override a template
3. Inject data into the page
4. Enhance behavior with JavaScript
5. Apply styling and assets

Start with the `/controllers` guides and move down as needed. After changing Storefront code, [rebuild your assets](platform/dev/6.7/guides/development/tooling/using-watchers.md).

### Subfolders

- `/controllers` — new routes and pages or extending existing ones: [custom controller](platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-controller.md), [custom page](platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-page.md), [add data to a page](platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-data-to-storefront-page.md); also custom pagelet and AJAX dynamic content.
- `/templates` — override or extend Twig templates and blocks: [customize templates](platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-templates.md), [Twig function reference](platform/dev/6.7/guides/plugins/plugins/storefront/templates/twig-function-reference.md); also custom Twig function and header/footer.
- `/javascript` — extend or override frontend behavior: [custom JS](platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md), [plugin and helper reference](platform/dev/6.7/guides/plugins/plugins/storefront/javascript/plugin-reference.md); also script tag, fetching data, overriding JS, JS events.
- `/styling` — appearance and resources: [custom styling](platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-custom-styling.md), [custom assets](platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-custom-assets.md); also icons, SCSS variables (static or via subscriber), translations.
- `/howto` — focused use cases: captcha, listing sorting and filters, media thumbnails, nested line items, modal window, custom fields, datepicker.
- `/advanced` — infrastructure and optimization: [caching for a custom controller](platform/dev/6.7/guides/plugins/plugins/storefront/advanced/add-caching-to-custom-controller.md), [cookie to manager](platform/dev/6.7/guides/plugins/plugins/storefront/advanced/add-cookie-to-manager.md); also reacting to cookie consent changes and removing an unnecessary JS plugin.

## Code check (6.7.13.0)
- confirmed `StorefrontController` — abstract base for Storefront controllers — vendor/shopware/storefront/Controller/StorefrontController.php:40
- confirmed `StorefrontController::renderStorefront()` — renders Storefront Twig templates — vendor/shopware/storefront/Controller/StorefrontController.php:67
- confirmed `StorefrontRouteScope::ID` — value `storefront` — vendor/shopware/storefront/Framework/Routing/StorefrontRouteScope.php:14
- confirmed `CookieGroupCollectEvent` — event for adding cookies (advanced guides) — vendor/shopware/core/Content/Cookie/Event/CookieGroupCollectEvent.php:15
