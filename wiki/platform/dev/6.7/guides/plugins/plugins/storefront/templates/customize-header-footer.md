---
id: platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-header-footer.md
title: Customize Header/Footer
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/templates/customize-header-footer.html
sourceHash: e4637dc59f15a3b670aa605c123106ec87dea93c
codeCheckedAgainst: "6.7.15.1"
keywords: ["header", "footer", "esi", "base_esi_header", "base_esi_footer", "headerParameters", "footerParameters", "frontend.header", "frontend.footer", "StorefrontRenderEvent", "render_esi", "base.html.twig", "sub-request"]
summary: Pass page data to the ESI-loaded 6.7 Storefront header/footer via headerParameters/footerParameters in base_esi blocks or StorefrontRenderEvent.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-templates.md", "platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-data-to-storefront-page.md"]
---
## What it is

Since Shopware 6.7.0.0 the Storefront header and footer are loaded via ESI sub-requests (routes `frontend.header` and `frontend.footer`), so they can stay cached longer and no longer see the data of the page that embeds them. This page shows how to pass page-dependent data to them, or replace them.

## When to use

When header or footer markup must depend on the current page (e.g. the active route). For page-independent custom data, use [Add data to storefront page](platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-data-to-storefront-page.md) instead. Prerequisite: [Plugin Base Guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md).

## Key steps / config

1. Extend `base.html.twig` and override `base_esi_header` (or `base_esi_footer`), merging data into `headerParameters` (or `footerParameters`) before `parent()`. Core renders `render_esi(path('frontend.header', { headerParameters: headerParameters }))`, so the values travel as query parameters:

```twig
{% sw_extends '@Storefront/storefront/base.html.twig' %}
{% block base_esi_header %}
    {% set headerParameters = headerParameters|merge({ 'vendorPrefixPluginName': { 'activeRoute': activeRoute } }) %}
    {{ parent() }}
{% endblock %}
```

2. Read them in the header template — the `frontend.header` controller passes the `headerParameters` query value to `@Storefront/storefront/layout/header.html.twig`:

```twig
{% sw_extends '@Storefront/storefront/layout/header.html.twig' %}
{% block header %}
    {{ dump(headerParameters.vendorPrefixPluginName.activeRoute) }}
    {{ parent() }}
{% endblock %}
```

This works in plugins and apps.

3. Plugins only: alternatively listen to `StorefrontRenderEvent`, check `$event->getRequest()->attributes->get('_route') === 'frontend.header'`, then read/modify via `$event->getParameter('headerParameters')` and `$event->setParameter('headerParameters', ...)` (e.g. adding `$event->getSalesChannelContext()->getSalesChannelId()`).

4. To load a completely custom header/footer, override `base_esi_header` without `parent()`, as core's checkout confirm page does with `{% sw_include '@Storefront/storefront/layout/header/header-minimal.html.twig' %}`.

## Essential identifiers

- `base_esi_header`, `base_esi_footer` (in `Storefront/Resources/views/storefront/base.html.twig`)
- `headerParameters`, `footerParameters`
- `frontend.header` (`/_esi/global/header`), `frontend.footer` (`/_esi/global/footer`)
- `Shopware\Storefront\Event\StorefrontRenderEvent`

## Gotchas

- `headerParameters` and `footerParameters` may contain only scalar values — they are query parameters of the ESI routes.
- Replacing the header/footer template overwrites customizations from every other extension.
- If a custom template extends the original header/footer, make sure the `header`/`footer` data is available to it.

## Version notes

- Before 6.7.0.0 header and footer are not ESI-loaded and are extended like any other template ([Customize Templates](platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-templates.md)).

## Code check (6.7.15.1)
- confirmed `base_esi_header` — renders `frontend.header` via `render_esi` with `headerParameters` — vendor/shopware/storefront/Resources/views/storefront/base.html.twig:54
- confirmed `base_esi_footer` — renders `frontend.footer` with `footerParameters` — vendor/shopware/storefront/Resources/views/storefront/base.html.twig:113
- confirmed `frontend.header` — ESI route `/_esi/global/header` — vendor/shopware/storefront/Controller/NavigationController.php:122
- confirmed `headerParameters` — taken from the request query and passed to header.html.twig — vendor/shopware/storefront/Controller/NavigationController.php:138
- confirmed `frontend.footer` — ESI route `/_esi/global/footer` — vendor/shopware/storefront/Controller/NavigationController.php:144
- confirmed `footerParameters` — taken from the request query and passed to footer.html.twig — vendor/shopware/storefront/Controller/NavigationController.php:160
- confirmed `StorefrontRenderEvent` — event class — vendor/shopware/storefront/Event/StorefrontRenderEvent.php:13
- confirmed `StorefrontRenderEvent::setParameter()` — public setter — vendor/shopware/storefront/Event/StorefrontRenderEvent.php:74
- confirmed `StorefrontRenderEvent::getParameter()` — public getter — vendor/shopware/storefront/Event/StorefrontRenderEvent.php:69
- confirmed `header` — root block of layout/header.html.twig — vendor/shopware/storefront/Resources/views/storefront/layout/header.html.twig:1
