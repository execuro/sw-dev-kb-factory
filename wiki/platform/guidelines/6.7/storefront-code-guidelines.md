---
id: platform/guidelines/6.7/storefront-code-guidelines.md
title: Storefront code guidelines
docType: guideline
version: "6.7"
summary: "Storefront rules: thin controllers over PageLoader/Page and Store API, route defaults, HTTP cache, JS plugins, theme styling, accessible rendering."
keywords: ["storefront", "controller", "page loader", "pagelet", "store api", "js plugin", "http cache", "theme json", "scss", "snippets"]
sources: [{url: "https://developer.shopware.com/docs/resources/guidelines/code/storefront-controller.html", hash: "7124252319e62ddcdf76462708c0ca84470b5e717cdbd76b2978e4bdd2e87289"}, {url: "platform/dev/6.7/guides/plugins/plugins/storefront/**", hash: "c2c6156e8a1de6ca07b3e5c55348bb65563c08a6dc26f75340827696fcd74239"}, {url: "platform/dev/6.7/guides/plugins/themes/**", hash: "c9a596adf946aed6280f7f99d0812d6599754c29e6c9c096ab3b5e1061948744"}, {url: "https://developer.shopware.com/docs/resources/references/adr/2021-08-10-storefront-coding-standards.html", hash: "7be70f1bd7dacb1d6c8131ac21605a239bd7d30040333566c7d48da2a067a1b6"}]
codeVersion: "6.7.13.0+3e5b9bc0"
lastBuilt: 2026-09-17
---

## controller structure

- Extend `Shopware\Storefront\Controller\StorefrontController` and set the class scope `#[Route(defaults: [PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [StorefrontRouteScope::ID]])]`.
- Give each action a `#[Route]` with `path`, explicit `methods`, a return type hint and a `name` starting `frontend.` (or `widgets.`/`payment.` — the only prefixes `Router` treats as Storefront); one route, one purpose.
- Inject services through the constructor into private properties declared in the DI definition, register the controller public, and import it in `Resources/config/routes.php` — no import, no URL.
- Use `renderStorefront()`, `redirectToRoute()`, `forwardToRoute()`, `trans()`; report user errors through Symfony flash bags.

Read more: https://developer.shopware.com/docs/resources/guidelines/code/storefront-controller.html

## controller page loader page

- No business logic and no repository access in a controller: reads and writes go through a Store API route or a page loader, so every Storefront feature also exists in the Store API.
- A GET page route calls a loader returning a `Page`: `$this->genericPageLoader->load($request, $context)`, `ExamplePage::createFrom($page)`, fill from Store API routes, dispatch the loaded event, return it.
- Page structs extend `Shopware\Storefront\Page\Page`, their events `PageLoadedEvent` (`getPage()`); fragments use `Pagelet`/`PageletLoadedEvent` (`getPagelet()`). Give own loaders an interface so they stay decoratable.
- Add data to an existing page by subscribing to its `*LoadedEvent` and `addExtension('<key>', $struct)`; read it in Twig as `page.extensions.<key>`.
- Write actions call the matching Store API route and return `createActionResponse($request)`.

Read more: https://developer.shopware.com/docs/resources/references/adr/2021-08-10-storefront-coding-standards.html

## route defaults

- Set `'XmlHttpRequest' => true` on every route called via AJAX; without it `StorefrontSubscriber` denies XHR calls to Storefront routes.
- Use `PlatformRequest::ATTRIBUTE_LOGIN_REQUIRED` (`_loginRequired`), plus `ATTRIBUTE_LOGIN_REQUIRED_ALLOW_GUEST` where guests may pass, instead of checking the customer in the action.
- Add `options: ['seo' => false]` to AJAX and utility routes that are not landing pages.

Read more: platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-dynamic-content-via-ajax-calls.md

## http cache

- Set `PlatformRequest::ATTRIBUTE_HTTP_CACHE` (`_httpCache`) only on routes whose output is identical for all customers in the same context.
- Load cacheable data through Store API routes: their cache tags reach the response, so invalidation works. Data loaded any other way is never invalidated.
- Do not build on `CacheAttribute::$states`; deprecated, removed in 6.8.0.
- Pass data into the ESI header/footer only as scalars, via `headerParameters`/`footerParameters`; they become query parameters.

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

- Write behaviour as a class extending `window.PluginBaseClass`: implement `init()`, declare `static options`, work on `this.el`/`this.options`.
- Register in `src/Resources/app/storefront/src/main.js` with `window.PluginManager.register(name, class, selector)` — always a selector, preferably `() => import(...)`.
- Configure from Twig with `data-<plugin-name>-options="{{ options|json_encode|escape('html_attr') }}"`.
- Change core plugins by, in order: `$emitter` events on the instance, `PluginManager.override()`, `PluginManager.deregister(name, selector)`.
- Fetch data with `fetch` against routes flagged `XmlHttpRequest`; ship the compiled `dist/storefront/js/<name>/<name>.js`. Add script tags only for external libraries, in `layout_head_javascript_assets`, with `{{ parent() }}` and `defer`.

Read more: platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md

## styling assets and snippets

- Plugin SCSS entry is `src/Resources/app/storefront/src/scss/base.scss` (only that file at depth 0 is picked up); declare variables with `!default`.
- A theme declares ordered `views`, `style`, `script`, `asset`, `config.fields`, `configInheritance` in `src/Resources/theme.json`, `overrides.scss` before `@Storefront` in `style`, `base.scss` after. Run `theme:refresh` after editing it, `theme:compile` after SCSS changes.
- Expose merchant-configurable values as theme config fields; use a `ThemeCompilerEnrichScssVariablesEvent` subscriber (`addVariable()`) only for computed or per-sales-channel values.
- Serve static files from `src/Resources/public` after `assets:install` and reference them with `asset()`.
- Never hard-code customer-visible text: ship `Resources/snippet/<domain>.<locale>.json`, use `|trans`, and pass markup-bearing output through `|sw_sanitize`.

Read more: platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-custom-styling.md
Read more: platform/dev/6.7/guides/plugins/themes/configuration/theme-configuration.md

## accessible and seo correct rendering

- Render icons with `sw_icon`: decorative ones keep the default `ariaHidden`, meaningful ones set `ariaHidden: false` plus `ariaLabel`.
- Render images with `sw_thumbnails` and pass `sizes`, `alt`/`title` and `loading: 'lazy'` for off-screen images.
- Build links with `seoUrl('<route>', params)` or `path()`, never concatenated URLs.
- Register every cookie a feature sets via `CookieGroupCollectEvent`; load tracking only after consent (`COOKIE_CONFIGURATION_UPDATE` on `document.$emitter`).

Read more: platform/dev/6.7/guides/plugins/plugins/storefront/howto/use-media-thumbnails.md

## Code check (6.7.13.0+3e5b9bc0)

- confirmed `StorefrontController` — abstract base — storefront/Controller/StorefrontController.php:40
- confirmed `createActionResponse()` — protected, takes Request — storefront/Controller/StorefrontController.php:125
- confirmed `PlatformRequest::ATTRIBUTE_HTTP_CACHE` — `_httpCache` — core/PlatformRequest.php:80
- confirmed `PlatformRequest::ATTRIBUTE_LOGIN_REQUIRED` — `_loginRequired` — core/PlatformRequest.php:82
- confirmed `XmlHttpRequest` — required for XHR — storefront/Framework/Routing/StorefrontSubscriber.php:245
- confirmed `GenericPageLoaderInterface::load()` — returns Page — storefront/Page/GenericPageLoaderInterface.php:12
- deprecated `CacheAttribute::$states` — removed in v6.8.0 — core/Framework/Adapter/Cache/Http/CacheAttribute.php:27
- confirmed `window.PluginBaseClass` — global — storefront/Resources/app/storefront/src/plugin-system/plugin.manager.js:799
- confirmed `base.scss` — depth-0 entry — storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:202
- confirmed `frontend.` — Storefront route prefix — storefront/Framework/Routing/Router.php:204
