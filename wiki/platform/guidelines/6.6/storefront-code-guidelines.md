---
id: platform/guidelines/6.6/storefront-code-guidelines.md
title: Storefront code guidelines
docType: guideline
version: "6.6"
summary: "Storefront rules for 6.6: thin controllers, PageLoader to Page, sw_extends overrides, JS PluginManager, HTTP cache route defaults, assets and SCSS."
keywords: ["storefront", "storefrontcontroller", "page loader", "pagelet", "sw_extends", "pluginmanager", "pluginbaseclass", "_httpcache", "xmlhttprequest", "store-api", "scss variables", "cookie consent", "twig"]
sources: [{url: "https://developer.shopware.com/docs/v6.6/resources/guidelines/code/storefront-controller.html", hash: "faedd30998c9049d5f592e49e74491151e8e0fda47282c4092f1db4f909dafa5"}, {url: "platform/dev/6.6/guides/plugins/plugins/storefront/**", hash: "c872cf3f50866ba4645b8cf5487e233dfd6b2f269c13586475ede2f7650cf339"}, {url: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2021-08-10-storefront-coding-standards.html", hash: "571bc8af9e75bb9d7c24371c51c6cceca89b773613d7290fbfea87cc6f9f5aa9"}]
codeVersion: "6.6.10.24+87965325"
lastBuilt: 2026-09-15
---

## controller structure

- Extend `Shopware\Storefront\Controller\StorefrontController` (abstract) for every Storefront controller.
- Put `#[Route(defaults: ['_routeScope' => ['storefront']])]` on the class; core controllers such as `NavigationController` do exactly this. Never use the old `@RouteScope` annotation.
- Give every action a `#[Route]` with `path`, `name` and explicit `methods`; start the route name with `frontend.` (other prefixes: `widgets`, `payment`, `api`, `store-api` by purpose).
- Declare a return type on every action, keep one purpose per route, keep function names concise.
- Inject dependencies through the constructor into private properties and define them in the DI container. Only the container and Twig come in via `setContainer`/`setTwig` calls.
- Register the controller service `public="true"` (otherwise its routes can be removed from the container) and import it through `Resources/config/routes.xml` with `type="attribute"`.
- Render pages with `renderStorefront()`; translate with `$this->trans()` in controllers or the `translator` service elsewhere.

Read more: https://developer.shopware.com/docs/v6.6/resources/guidelines/code/storefront-controller.html
Read more: platform/dev/6.6/guides/plugins/plugins/storefront/add-custom-controller.md

## no business logic in controllers

- Never put business logic in a Storefront controller and never use a repository directly in a controller, page loader or pagelet subscriber. Fetch data through a Store API route instead (create one if missing).
- Every Storefront feature must also be reachable via the Store API; every write action calls the corresponding Store API route.
- Finish write actions with `createActionResponse($request)` so callers can steer the result via `redirectTo`/`redirectParameters` or `forwardTo`/`forwardParameters`.
- Report user-facing errors through Symfony flash bags.
- When only aggregated values are needed, use aggregations rather than a full search.

Read more: https://developer.shopware.com/docs/v6.6/resources/references/adr/2021-08-10-storefront-coding-standards.html
Read more: platform/dev/6.6/guides/plugins/plugins/storefront/add-data-to-storefront-page.md

## page and pagelet loaders

- For a route that renders a full page: controller calls a PageLoader, the loader returns a Page object, the controller passes it as `page` to `renderStorefront()`.
- In a page loader, call `GenericPageLoaderInterface::load($request, $context)` for header/footer data, convert with `YourPage::createFrom($page)`, set custom data, then dispatch a `PageLoadedEvent` subclass.
- Page structs extend `Shopware\Storefront\Page\Page`; page events extend `Shopware\Storefront\Page\PageLoadedEvent`.
- A pagelet is a reusable page fraction: struct extends `Shopware\Storefront\Pagelet\Pagelet`, created with `new`, never `createFrom()` and never via `GenericPageLoaderInterface`; its event extends `Shopware\Storefront\Pagelet\PageletLoadedEvent`.
- To add data to an existing page, subscribe to its page or pagelet loaded event (e.g. `FooterPageletLoadedEvent`) and attach results with `addExtension()`; read them in Twig via `page.<pagelet>.extensions.<name>`.

Read more: platform/dev/6.6/guides/plugins/plugins/storefront/add-custom-page.md
Read more: platform/dev/6.6/guides/plugins/plugins/storefront/add-custom-pagelet.md

## http cache and ajax routes

- Set `defaults: ['_httpCache' => true]` only on routes whose output is the same for all customers (core: `frontend.home.page`, `frontend.navigation.page`).
- The cache varies on the `logged-in` and `cart-filled` states. Invalidation follows the cache tags of the Store API routes that supplied the data, so a controller that loads data only via Store API routes needs no extra invalidation.
- Mark any route called by `fetch`/AJAX with `defaults: ['XmlHttpRequest' => true]`. For XHR requests in `storefront` scope, `StorefrontSubscriber::preventPageLoadingFromXmlHttpRequest` throws access denied when this default is missing.
- Use `_loginRequired` (and `_loginRequiredAllowGuest`) to require a logged-in customer instead of checking manually.
- Set `options: ['seo' => true]` on page routes that should get SEO URLs.

Read more: platform/dev/6.6/guides/plugins/plugins/storefront/add-caching-to-custom-controller.md
Read more: platform/dev/6.6/guides/plugins/plugins/storefront/add-dynamic-content-via-ajax-calls.md

## twig template inheritance

- Override a core template by mirroring its path under `<plugin>/src/Resources/views/` and starting with `{% sw_extends '@Storefront/storefront/...' %}`. A mismatched path is silently ignored.
- Override only the smallest block needed and call `{{ parent() }}` unless full replacement is intended; use `sw_include` for Storefront components.
- Never override `layout_head_javascript_hmr_mode` without `{{ parent() }}`, or core Storefront JS breaks.
- Output custom-field or user-provided HTML through `|sw_sanitize`; use snippet keys with `|trans` instead of hard-coded text (custom fields: `customFields.<field_name>`).
- Adjust core option arrays with `|replace_recursive` rather than redefining them.
- Do not load database data in custom Twig functions (`AbstractExtension` tagged `twig.extension`). `searchMedia` runs a query, so call it once with all IDs, never inside a loop.

Read more: platform/dev/6.6/guides/plugins/plugins/storefront/customize-templates.md
Read more: platform/dev/6.6/guides/plugins/plugins/storefront/using-custom-fields-storefront.md
Read more: platform/dev/6.6/guides/plugins/plugins/storefront/use-media-thumbnails.md

## javascript plugin system

- Write Storefront JS as a class extending `window.PluginBaseClass` with an `init()` method. Register it in `src/Resources/app/storefront/src/main.js` via `PluginManager.register(name, class, selector)` and bind to a data-attribute selector so it only runs where needed.
- Prefer async registration (`() => import('./x.plugin')`) so the plugin is loaded only when its selector is on the page.
- Declare defaults in `static options`; configure per element via `data-<plugin-name-kebab>-options` (JSON). The plugin base class merges them over the defaults.
- Change core plugins with `PluginManager.override(name, class, selector)` (deregister and re-register, so the last override wins), or remove them with `PluginManager.deregister(name, selector)`. Do not patch core files.
- React to other plugins without overriding them: get the instance via `PluginManager.getPluginInstanceFromElement(el, name)`, then `$emitter.subscribe(...)`. Events are notifications only.
- Use native `fetch` for data requests; use `PseudoModalUtil` or `data-ajax-modal`/`data-url` for modals; use `data-date-picker` for date inputs.
- React to consent changes by subscribing `document.$emitter` to `COOKIE_CONFIGURATION_UPDATE`. Register plugin cookies by decorating `CookieProviderInterface::getCookieGroups()`.
- Rebuild after changes (`./bin/build-storefront.sh`) and ship the compiled `dist` output.

Read more: platform/dev/6.6/guides/plugins/plugins/storefront/add-custom-javascript.md
Read more: platform/dev/6.6/guides/plugins/plugins/storefront/override-existing-javascript.md
Read more: platform/dev/6.6/guides/plugins/plugins/storefront/add-cookie-to-manager.md

## script tags and performance

- Put JS in the `main.js` bundle. Add a separate script tag only for a technical reason (for example a third-party library's placement requirement).
- Load external scripts with `defer` (or `async` if the library requires it). A blocking script before the Storefront JS delays rendering and Storefront JS execution.
- Set `loading: 'lazy'` via `sw_thumbnails` `attributes` for images outside the initial viewport, and pass `alt`/`title` there. `sizes` accepts Bootstrap breakpoint keys only.

Read more: platform/dev/6.6/guides/plugins/plugins/storefront/add-javascript-as-script-tag.md
Read more: platform/dev/6.6/guides/plugins/plugins/storefront/use-media-thumbnails.md

## styles assets and icons

- Put plugin styles in `src/Resources/app/storefront/src/scss/base.scss`. Give every configurable variable a `!default` fallback.
- Expose config values to SCSS with the `config.xml` `<css>` tag, or subscribe to `ThemeCompilerEnrichScssVariablesEvent` and call `addVariable($name, $value, $sanitize)` (no `$` prefix, kebab-case). Read per sales channel config with `getSalesChannelId()`, and remember the theme must be recompiled.
- Ship static files in `src/Resources/public/`, install with `bin/console assets:install`, and reference them via `asset('bundles/<plugin>/...', 'asset')` or `$sw-asset-public-url` in SCSS.
- Render icons with `sw_icon` and always set `namespace` for custom icons, or the default icon is shown.

Read more: platform/dev/6.6/guides/plugins/plugins/storefront/add-custom-styling.md
Read more: platform/dev/6.6/guides/plugins/plugins/storefront/add-scss-variables-via-subscriber.md
Read more: platform/dev/6.6/guides/plugins/plugins/storefront/add-custom-assets.md
Read more: platform/dev/6.6/guides/plugins/plugins/storefront/add-icons.md
