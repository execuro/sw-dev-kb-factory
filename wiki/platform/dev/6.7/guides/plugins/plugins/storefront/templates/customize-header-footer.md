---
id: platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-header-footer.md
title: Customize Header/Footer
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/templates/customize-header-footer.html
sourceHash: b281725752f5f530edd04e0d5143c63d15aecbc0
codeCheckedAgainst: "6.7.13.0"
keywords: ["header", "footer", "esi", "base_esi_header", "base_esi_footer", "headerParameters", "footerParameters", "frontend.header", "frontend.footer", "StorefrontRenderEvent", "base.html.twig", "sub-request", "page-dependent header"]
summary: "Header/footer are ESI sub-requests; pass page-dependent scalar data via headerParameters/footerParameters in base_esi_* blocks or StorefrontRenderEvent."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-data-to-storefront-page.md"]
---
## What it is

Since header and footer are loaded via ESI sub-requests (so they can be cached longer), their templates no longer see the current page data. This page shows how to pass page-dependent data into them, or replace them with custom templates.

## When to use

You need header or footer output that depends on the current page (e.g. the active route). For data that does not depend on the page, see [Add data to storefront page](platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-data-to-storefront-page.md).

## Key steps / config

1. In your plugin, extend `@Storefront/storefront/base.html.twig` and override `base_esi_header` (or `base_esi_footer`), merging into `headerParameters` (or `footerParameters`) before `parent()`:
   ```twig
   {% sw_extends '@Storefront/storefront/base.html.twig' %}
   {% block base_esi_header %}
       {% set headerParameters = headerParameters|merge({ 'vendorPrefixPluginName': { 'activeRoute': activeRoute } }) %}
       {{ parent() }}
   {% endblock %}
   ```
2. The parameters are sent as query parameters to the ESI route (`frontend.header`, `frontend.footer`) and passed to the header/footer template. Read them in `@Storefront/storefront/layout/header.html.twig`, block `header`, e.g. `headerParameters.vendorPrefixPluginName.activeRoute`. Works for plugins and apps.
3. Plugins alternatively listen to `StorefrontRenderEvent`: check `$event->getRequest()->attributes->get('_route') === 'frontend.header'`, read `$event->getParameter('headerParameters') ?? []`, add values (e.g. `$event->getSalesChannelContext()->getSalesChannelId()`), then `$event->setParameter('headerParameters', $headerParameters)`.
4. To use a completely custom header/footer, override `base_esi_header`/`base_esi_footer` in the page template without calling the ESI render, as the checkout confirm page does (it includes `header-minimal.html.twig`).

## Essential identifiers

- Blocks `base_esi_header`, `base_esi_footer` in `@Storefront/storefront/base.html.twig`
- Twig vars `headerParameters`, `footerParameters`
- Routes `frontend.header` (`/_esi/global/header`), `frontend.footer` (`/_esi/global/footer`)
- `StorefrontRenderEvent::getParameter()`, `setParameter()`, `getRequest()`, `getSalesChannelContext()`
- Template `@Storefront/storefront/layout/header.html.twig`, block `header`

## Gotchas

- `headerParameters` and `footerParameters` may contain only scalar values, since they become ESI query parameters.
- Replacing the header/footer template overwrites customizations from every other extension.
- If a custom template extends the original header or footer template, you must provide the `header`/`footer` pagelet data yourself (the checkout controller loads them via the header/footer pagelet loaders).
- Header/footer can no longer be customized purely from the current page data without these parameters.

## Code check (6.7.13.0)
- confirmed `base_esi_header` — renders ESI `frontend.header` with `headerParameters` — vendor/shopware/storefront/Resources/views/storefront/base.html.twig:54
- confirmed `base_esi_footer` — renders ESI `frontend.footer` with `footerParameters` — vendor/shopware/storefront/Resources/views/storefront/base.html.twig:113
- confirmed `frontend.header` — route `/_esi/global/header` — vendor/shopware/storefront/Controller/NavigationController.php:122
- confirmed `headerParameters` — taken from query and passed to header template — vendor/shopware/storefront/Controller/NavigationController.php:138
- confirmed `footerParameters` — taken from query and passed to footer template — vendor/shopware/storefront/Controller/NavigationController.php:160
- confirmed `StorefrontRenderEvent::getParameter()` — reads a render parameter — vendor/shopware/storefront/Event/StorefrontRenderEvent.php:69
- confirmed `StorefrontRenderEvent::setParameter()` — writes a render parameter — vendor/shopware/storefront/Event/StorefrontRenderEvent.php:74
- confirmed `header` — root block of layout header template — vendor/shopware/storefront/Resources/views/storefront/layout/header.html.twig:1
- confirmed `header-minimal.html.twig` — confirm page replaces ESI header — vendor/shopware/storefront/Resources/views/storefront/page/checkout/confirm/index.html.twig:4
- confirmed `HeaderPageletLoaderInterface` — checkout controller loads header data itself — vendor/shopware/storefront/Controller/CheckoutController.php:69
