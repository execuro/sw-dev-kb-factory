---
id: platform/guidelines/6.7/storefront-code-guidelines.md
title: Storefront code guidelines
docType: guideline
version: "6.7"
summary: "Storefront rules: thin controllers over PageLoader/Page and Store API, route defaults, HTTP cache, JS plugins, theme styling, accessible rendering."
keywords: ["storefront", "controller", "page loader", "pagelet", "store api", "js plugin", "http cache", "theme json", "scss", "snippets", "cookie consent"]
sources: [{url: "https://developer.shopware.com/docs/resources/guidelines/code/storefront-controller.html", hash: "7124252319e62ddcdf76462708c0ca84470b5e717cdbd76b2978e4bdd2e87289"}, {url: "platform/dev/6.7/guides/plugins/plugins/storefront/**", hash: "4dcf3e83d73a25d1e1ea8e1e289885d6806f1eec7a317667087062677f709157"}, {url: "platform/dev/6.7/guides/plugins/themes/**", hash: "e3b6ddc2990c7ae5ea2c95088221a22043511f840024e7054841ca9a0b6b731e"}, {url: "https://developer.shopware.com/docs/resources/references/adr/2021-08-10-storefront-coding-standards.html", hash: "7be70f1bd7dacb1d6c8131ac21605a239bd7d30040333566c7d48da2a067a1b6"}]
codeVersion: "6.7.15.1+7d4303db"
lastBuilt: 2026-10-21
---

## controller structure

- Extend `Shopware\Storefront\Controller\StorefrontController`; set the class scope `#[Route(defaults: [PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [StorefrontRouteScope::ID]])]`.
- Each action: `#[Route]` with `path`, explicit `methods`, a return type, one purpose, and a `name` starting `frontend.`/`widgets.`/`payment.` — the only prefixes `Router` treats as Storefront, besides names in `storefront.router.allowed_routes` (6.7.2.0+).
- Inject services via the constructor into private properties; register the controller public with `call('setContainer', ...)` and import it in `Resources/config/routes.php` — no import, no URL.
- Use `renderStorefront()`, `redirectToRoute()`, `forwardToRoute()`, `trans()`; report user errors via flash bags.

Read more: https://developer.shopware.com/docs/resources/guidelines/code/storefront-controller.html

## controller page loader page

- No business logic and no repository in a controller: reads and writes go through a Store API route or a page loader, so every feature also exists in the Store API.
- A GET page route calls a loader that runs `genericPageLoader->load($request, $context)`, `ExamplePage::createFrom($page)`, fills it from Store API routes, dispatches its loaded event and returns the `Page`.
- Pages extend `Shopware\Storefront\Page\Page` with a `PageLoadedEvent` (`getPage()`); fragments use `Pagelet`/`PageletLoadedEvent` (`getPagelet()`). Give own loaders an interface so they stay decoratable.
- Add data to an existing page via its `*LoadedEvent` and `addExtension('<key>', $struct)`; read it as `page.extensions.<key>`.
- Write actions call the matching Store API route and return `createActionResponse($request)`.

Read more: https://developer.shopware.com/docs/resources/references/adr/2021-08-10-storefront-coding-standards.html

## route defaults

- Set `'XmlHttpRequest' => true` on every AJAX route; otherwise `StorefrontSubscriber` rejects the XHR call.
- Use `_loginRequired` (`PlatformRequest::ATTRIBUTE_LOGIN_REQUIRED`), plus `ATTRIBUTE_LOGIN_REQUIRED_ALLOW_GUEST` where guests may pass, instead of checking the customer in the action.
- Add `options: ['seo' => false]` to AJAX and utility routes.

Read more: platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-dynamic-content-via-ajax-calls.md

## http cache

- Set `_httpCache` (`PlatformRequest::ATTRIBUTE_HTTP_CACHE`) only on GET routes whose output is identical for all customers in the same context.
- Load cacheable data through Store API routes so their cache tags reach the response; anything else needs its own invalidation.
- Do not build on `CacheAttribute::$states`; deprecated, removed in 6.8.0.
- Pass data into the ESI header/footer only as scalars via `headerParameters`/`footerParameters`.

Read more: platform/dev/6.7/guides/plugins/plugins/storefront/advanced/add-caching-to-custom-controller.md

## template inheritance
> [expert]

- Override a template by mirroring its path under `<bundle>/Resources/views/` and opening the file with `{% sw_extends '@Storefront/storefront/<same path>' %}`. A wrong path or a block name that is not in *that* file is a silent no-op: grep the installed file, never recall a name from memory or an older version.
- Only `sw_extends`, `sw_include`, `sw_embed`, `sw_use`, `sw_import`, `sw_from` and `sw_source` walk the template chain; plain `extends`/`include` leave it.
- Chain order is the active theme's `theme.json` `views` list, later entries win (default `@Storefront` → `@Plugins` → the theme). `@Plugins` expands to every plugin and app not named there, ordered by `Bundle::getTemplatePriority()` (default 0) and app `template_load_priority`. So a theme override beats a plugin override, and `{{ parent() }}` renders the previous bundle in the chain, not necessarily core.
- Override the narrowest block that contains the change and call `{{ parent() }}`; leaving it out replaces every other extension of that block and must be stated. Declare each block name once per file; never copy sibling blocks or whole templates; never edit `vendor/`.
- A block whose comment says `@deprecated tag:v6.8.0 … Use X instead` is overridden as X. App templates are served from the `app_template` table, not from disk.
- Register Twig functions in an `AbstractExtension` tagged `twig.extension`; never query the database from them. Call `searchMedia` once per ID list, never in a loop.

Read more: platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-templates.md
Read more: platform/dev/6.7/guides/plugins/themes/inheritance/add-theme-inheritance.md

## twig override placement
> [expert]

- Nobody overrides the block → your bundle, `{{ parent() }}` plus the change. A project plugin or theme already overrides it → edit that file, never a second file for the same path. A marketplace plugin overrides it → override later in the chain (the theme) with `{{ parent() }}`. The markup sits in an included sub-template → override that template, not the includer. No block fits → the closest parent block, `{{ parent() }}`, add before or after; never re-render the parent's content.
- Look, spacing and Bootstrap variables belong to the theme (SCSS variables, `theme.json` fields); behaviour, new data and feature markup to a plugin; text to a snippet key, never a literal. One concern per file; a diff longer than the core block it changes is wrong.

## twig version traps
> [expert]

- Header and footer render through ESI on `frontend.header`/`frontend.footer`; their templates receive `header`/`footer` and `headerParameters`, never `page`.
- Bootstrap 5, no jQuery: `data-toggle` → `data-bs-toggle`, `data-dismiss` → `data-bs-dismiss`, `.ml-*/.mr-*` → `.ms-*/.me-*`, `.custom-select` → `.form-select`; the off-canvas cart trigger is `data-off-canvas-cart`. Use Bootstrap's own `data-bs-*` behaviour before writing a JS plugin.
- `DomAccess` and `HttpClient` are deprecated for 6.8 (native DOM and `fetch`); `sw_csrf` is gone; `macro` in app scripts is deprecated for `sw_macro_function`. Block layout moved between 6.4 and 6.7 (the buy widget lives in `component/buy-widget/`); a block name from an older version is a defect.

## javascript plugin system

- Extend `window.PluginBaseClass`: implement `init()`, declare `static options`, use `this.el`/`this.options`.
- Register in `src/Resources/app/storefront/src/main.js` via `window.PluginManager.register(name, class, selector)` — always a selector, preferably `() => import(...)`.
- Configure from Twig with `data-<plugin-name>-options="{{ options|json_encode|escape('html_attr') }}"`; merge core options with `replace_recursive`.
- Change core plugins by, in order: `$emitter` events, `PluginManager.override()`, `PluginManager.deregister(name, selector)`.
- Fetch with `fetch` against `XmlHttpRequest` routes; ship the compiled `dist/storefront/js/<name>/<name>.js`. Add external libraries in `layout_head_javascript_assets` with `{{ parent() }}` and `defer`.

Read more: platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md

## styling assets and snippets

- Plugin SCSS entry is `src/Resources/app/storefront/src/scss/base.scss` (depth 0 only); declare variables with `!default`.
- A theme declares `views`, `style`, `script`, `asset`, `config.fields`, `configInheritance` in `src/Resources/theme.json`; `overrides.scss` before `@Storefront` in `style`, `base.scss` after. Run `theme:refresh` after editing it, `theme:compile` after SCSS changes.
- Merchant-configurable values are theme config fields; use `ThemeCompilerEnrichScssVariablesEvent::addVariable()` only for computed values.
- Serve static files from `src/Resources/public` after `assets:install`, referenced with `asset()`.
- No hard-coded customer-visible text: `Resources/snippet/<domain>.<locale>.json` plus `|trans`; pass markup output through `|sw_sanitize`.

Read more: platform/dev/6.7/guides/plugins/themes/configuration/theme-configuration.md

## accessible and seo correct rendering

- `sw_icon`: decorative icons keep the default `ariaHidden`; meaningful ones set `ariaHidden: false` plus `ariaLabel`.
- `sw_thumbnails` with `sizes`, `alt`/`title`, and `loading: 'lazy'` off-screen.
- Build links with `seoUrl()` or `path()`, never concatenated URLs.
- Register every cookie via `CookieGroupCollectEvent`; load tracking only after consent (`COOKIE_CONFIGURATION_UPDATE` on `document.$emitter`).

Read more: platform/dev/6.7/guides/plugins/plugins/storefront/advanced/add-cookie-to-manager.md

## Code check (6.7.15.1+7d4303db)

- confirmed `createActionResponse()` — protected, takes Request — storefront/Controller/StorefrontController.php:126
- confirmed `PlatformRequest::ATTRIBUTE_HTTP_CACHE` — `_httpCache` — core/PlatformRequest.php:82
- confirmed `XmlHttpRequest` — required for XHR — storefront/Framework/Routing/StorefrontSubscriber.php:245
- deprecated `CacheAttribute::$states` — removed in v6.8.0 — core/Framework/Adapter/Cache/Http/CacheAttribute.php:27
- confirmed `frontend.` — Storefront route prefix — storefront/Framework/Routing/Router.php:204
- confirmed `CookieGroupCollectEvent` — cookie registration — core/Content/Cookie/Event/CookieGroupCollectEvent.php:18
