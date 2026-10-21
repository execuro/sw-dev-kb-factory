---
id: platform/dev/6.7/guides/plugins/plugins/storefront/_index.md
title: Storefront
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/
sourceHash: 4daef7317d78e32b4ffa3ba8248539846d87e35c
codeCheckedAgainst: "6.7.15.1"
keywords: ["storefront", "storefront plugin", "StorefrontController", "StorefrontRouteScope", "PluginManager", "controllers", "twig templates", "javascript plugin", "scss styling", "assets", "pagelet", "theme customization"]
summary: Overview of Storefront plugin guides - controllers, pages, templates, JavaScript, styling and advanced topics - and the order they are usually applied in.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/concepts/framework/architecture/storefront-concept.md", "platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-controller.md", "platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-templates.md", "platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md"]
---
## What it is

Entry page for the Storefront section of the plugin guides. The [Storefront](platform/dev/6.7/concepts/framework/architecture/storefront-concept.md) is Shopware's customer-facing layer; a plugin extends it to add pages or endpoints, modify templates and layouts, inject dynamic data, add JavaScript behaviour, and customize styling and assets. The section mirrors the folder structure inside `/storefront`.

## When to use

Use it to pick the right guide for a Storefront customization in a plugin. For headless frontends, the source points to the Composable Frontends guide (`https://developer.shopware.com/frontends/`) instead of extending the default Storefront.

## Key steps / config

Typical sequence (start in `/controllers` and move downward as needed):

1. Add or extend a controller - [Add custom controller](platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-controller.md), [Add custom page](platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-page.md), [Add custom pagelet](platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-pagelet.md), [Add dynamic content via AJAX calls](platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-dynamic-content-via-ajax-calls.md).
2. Render or override a template - [Customize templates](platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-templates.md), [Customize header & footer](platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-header-footer.md), [Add Twig function](platform/dev/6.7/guides/plugins/plugins/storefront/templates/add-custom-twig-function.md), [Twig functions reference](platform/dev/6.7/guides/plugins/plugins/storefront/templates/twig-function-reference.md).
3. Inject data into the page - [Add data to a storefront page](platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-data-to-storefront-page.md).
4. Enhance behaviour with JavaScript - [Add custom JavaScript](platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md), [Override existing JavaScript](platform/dev/6.7/guides/plugins/plugins/storefront/javascript/override-existing-javascript.md), [React to JavaScript events](platform/dev/6.7/guides/plugins/plugins/storefront/javascript/reacting-to-javascript-events.md), [Plugin and helper reference](platform/dev/6.7/guides/plugins/plugins/storefront/javascript/plugin-reference.md).
5. Apply styling and assets - [Add custom styling](platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-custom-styling.md), [Add SCSS variables](platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-scss-variables.md), [Add icons](platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-icons.md), [Add translations](platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-translations.md).

Advanced topics: [caching for custom controllers](platform/dev/6.7/guides/plugins/plugins/storefront/advanced/add-caching-to-custom-controller.md), [adding a cookie to the consent manager](platform/dev/6.7/guides/plugins/plugins/storefront/advanced/add-cookie-to-manager.md), [reacting to consent changes](platform/dev/6.7/guides/plugins/plugins/storefront/advanced/reacting-to-cookie-consent-changes.md), [removing a JS plugin](platform/dev/6.7/guides/plugins/plugins/storefront/advanced/remove-unnecessary-js-plugin.md). How-tos cover captcha, listing sorting/filters, media thumbnails, nested line items, modals, custom fields and the datepicker.

After changing Storefront code, [rebuild the assets](platform/dev/6.7/guides/development/tooling/using-watchers.md).

## Essential identifiers

- `Shopware\Storefront\Controller\StorefrontController` - base class for Storefront controllers
- `Shopware\Storefront\Framework\Routing\StorefrontRouteScope` - route scope `storefront`
- `PluginManager` - registers Storefront JavaScript plugins

## Code check (6.7.15.1)
- confirmed `StorefrontController` — abstract base controller exists — vendor/shopware/storefront/Controller/StorefrontController.php:41
- confirmed `StorefrontController::renderStorefront()` — protected render helper — vendor/shopware/storefront/Controller/StorefrontController.php:68
- confirmed `StorefrontRouteScope::ID` — value `storefront` — vendor/shopware/storefront/Framework/Routing/StorefrontRouteScope.php:14
- confirmed `PluginManager.register()` — static JS plugin registration — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.manager.js:839
