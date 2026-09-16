---
id: platform/guidelines/6.7/storefront-code-guidelines.md
title: Storefront code guidelines
docType: guideline
version: "6.7"
summary: "Storefront rules: sw_extends overrides, thin controllers via PageLoader/Page and Store API, JS PluginManager plugins, cache-safe accessible rendering."
keywords: ["storefront", "storefront controller", "page loader", "pagelet", "sw_extends", "twig blocks", "js plugin", "pluginmanager", "http cache", "xmlhttprequest", "scss", "snippets", "accessibility", "seo"]
sources: [{url: "https://developer.shopware.com/docs/resources/guidelines/code/storefront-controller.html", hash: "7124252319e62ddcdf76462708c0ca84470b5e717cdbd76b2978e4bdd2e87289"}, {url: "platform/dev/6.7/guides/plugins/plugins/storefront/**", hash: "c2c6156e8a1de6ca07b3e5c55348bb65563c08a6dc26f75340827696fcd74239"}, {url: "https://developer.shopware.com/docs/resources/references/adr/2021-08-10-storefront-coding-standards.html", hash: "7be70f1bd7dacb1d6c8131ac21605a239bd7d30040333566c7d48da2a067a1b6"}]
codeVersion: "6.7.13.0+8da531fe"
lastBuilt: 2026-09-15
---

## controller structure

- Extend `Shopware\Storefront\Controller\StorefrontController`, never Symfony's `AbstractController` directly.
- Set the class route scope: `#[Route(defaults: [PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [StorefrontRouteScope::ID]])]`.
- Give each action its own `#[Route]` with `path`, `name`, explicit `methods` and a return type hint; one route, one purpose, concise action names.
- Name routes `frontend.*` (pages), `widgets.*` (fragments) or `payment.*` — the Storefront `Router` treats those prefixes as Storefront routes.
- Inject dependencies via the constructor into private properties defined in the DI service definition. Register the controller public with `setContainer` called, and import it in `Resources/config/routes.php` — without the import no URL exists.
- Use base-class helpers `renderStorefront()`, `redirectToRoute()`, `forwardToRoute()`, `trans()`; report user errors via Symfony flash bags.

Read more: https://developer.shopware.com/docs/resources/guidelines/code/storefront-controller.html
Read more: platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-controller.md

## controller page loader page

- No business logic and no repository access in a Storefront controller. Reads and writes go through a Store API route or a page loader, so every Storefront feature also exists in the Store API.
- A GET route rendering a full page calls a page loader returning a `Page`: `$this->genericPageLoader->load($request, $context)` (`GenericPageLoaderInterface`), `ExamplePage::createFrom($page)`, fill via Store API routes, dispatch the loaded event, return the page.
- Page structs extend `Shopware\Storefront\Page\Page`; their events extend `PageLoadedEvent` and implement `getPage()`.
- Reusable fragments are pagelets: struct extends `Shopware\Storefront\Pagelet\Pagelet`, event extends `PageletLoadedEvent` implementing `getPagelet()`. Page loaders may call pagelet loaders.
- Give own loaders an interface so other extensions can decorate them.
- To add data to an existing page, subscribe to its `*LoadedEvent`, load via Store API and attach with `addExtension('<key>', $struct)`; read in Twig via `page.extensions.<key>`.
- Write actions call the matching Store API route and return `createActionResponse($request)` so redirects and forwards stay configurable.

Read more: https://developer.shopware.com/docs/resources/references/adr/2021-08-10-storefront-coding-standards.html
Read more: platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-page.md
Read more: platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-data-to-storefront-page.md

## route defaults

- Set `'XmlHttpRequest' => true` on every route called via AJAX; `StorefrontSubscriber::preventPageLoadingFromXmlHttpRequest()` rejects XHR calls to routes without it.
- Use `PlatformRequest::ATTRIBUTE_LOGIN_REQUIRED` (`_loginRequired`) instead of checking the customer in the action; add `ATTRIBUTE_LOGIN_REQUIRED_ALLOW_GUEST` where guests are allowed.
- Add `options: ['seo' => false]` to AJAX and utility routes that are not landing pages, as core does.

Read more: platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-dynamic-content-via-ajax-calls.md

## http cache

- Set `PlatformRequest::ATTRIBUTE_HTTP_CACHE` (`_httpCache`) only on routes whose output is identical for all customers in the same context.
- Load cacheable data through Store API routes: their cache tags are collected into the response, so invalidation reaches the page. Data loaded any other way is not invalidated.
- Do not build on cache states or `CacheAttribute::$states`; deprecated, removed in 6.8.0.
- Pass page data into the ESI header/footer only via `headerParameters`/`footerParameters` in blocks `base_esi_header`/`base_esi_footer` — scalars only, they become query parameters.

Read more: platform/dev/6.7/guides/plugins/plugins/storefront/advanced/add-caching-to-custom-controller.md
Read more: platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-header-footer.md

## template inheritance

- Override a template by mirroring its path under `<plugin>/src/Resources/views/` and starting with `{% sw_extends '@Storefront/storefront/...' %}`; never copy whole core templates or use plain `extends`/`include`.
- Use the inheritance-aware tags (`sw_include`, `sw_embed`, `sw_use`, `sw_import`, `sw_from`, `sw_source`) so other plugins and themes stay in the chain.
- Override the narrowest block and call `{{ parent() }}` unless replacing output is the goal; replacing a block drops other extensions' changes.
- Verify block names against the installed templates before overriding.
- Register Twig functions in an `AbstractExtension` tagged `twig.extension`; never query the database from them. Call `searchMedia` once per ID list, never in a loop.

Read more: platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-templates.md
Read more: platform/dev/6.7/guides/plugins/plugins/storefront/templates/twig-function-reference.md

## javascript plugin system

- Write behaviour as a class extending `window.PluginBaseClass`: implement `init()`, declare `static options`, work on `this.el`/`this.options`.
- Register in `src/Resources/app/storefront/src/main.js` with `window.PluginManager.register(name, class, selector)`. Always pass a selector; prefer `() => import(...)` so code loads only where it matches.
- Configure from Twig with `data-<plugin-name>-options="{{ options|json_encode|escape('html_attr') }}"` built from an overridable Twig variable.
- To change core plugins prefer, in order: `$emitter` events on the instance (`PluginManager.getPluginInstanceFromElement(el, name)`), `PluginManager.override()`, `PluginManager.deregister(name, selector)`.
- Fetch runtime data with `fetch` against Storefront routes flagged `XmlHttpRequest`.
- Keep own code in the build; add script tags only for external libraries, in block `layout_head_javascript_assets` with `{{ parent() }}` and `defer`.
- Rebuild the storefront and ship the compiled `dist/storefront/js/<plugin-name>/<plugin-name>.js`.

Read more: platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md
Read more: platform/dev/6.7/guides/plugins/plugins/storefront/javascript/override-existing-javascript.md

## styling assets and snippets

- Put plugin SCSS entry in `src/Resources/app/storefront/src/scss/base.scss` (only that file at depth 0 is picked up); declare variables with `!default`.
- Expose merchant-configurable values via theme config; use a `ThemeCompilerEnrichScssVariablesEvent` subscriber (`addVariable()`) only for computed or per-sales-channel values.
- Serve static files from `src/Resources/public` after `assets:install` and reference them with `asset()`.
- Never hard-code customer-visible text: ship `Resources/snippet/<domain>.<locale>.json` and use `|trans`. Pass markup-bearing snippet or custom-field output through `|sw_sanitize`.

Read more: platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-custom-styling.md
Read more: platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-translations.md

## accessible and seo correct rendering

- Render icons with `sw_icon`; decorative icons keep default `ariaHidden`, meaningful ones set `ariaHidden: false` plus `ariaLabel`.
- Render images with `sw_thumbnails` and pass `sizes`; provide `alt`/`title` and `loading: 'lazy'` for off-screen images.
- Build links with `seoUrl('<route>', params)` or `path()`, never concatenated URLs.
- Register every cookie a feature sets via `CookieGroupCollectEvent`; load tracking only after consent (`COOKIE_CONFIGURATION_UPDATE` on `document.$emitter`).

Read more: platform/dev/6.7/guides/plugins/plugins/storefront/howto/use-media-thumbnails.md
Read more: platform/dev/6.7/guides/plugins/plugins/storefront/advanced/add-cookie-to-manager.md

## Code check (6.7.13.0+8da531fe)

- confirmed `StorefrontController` — abstract base — storefront/Controller/StorefrontController.php:40
- confirmed `createActionResponse()` — protected, takes Request — storefront/Controller/StorefrontController.php:125
- confirmed `PlatformRequest::ATTRIBUTE_HTTP_CACHE` — `_httpCache` — core/PlatformRequest.php:80
- confirmed `PlatformRequest::ATTRIBUTE_LOGIN_REQUIRED` — `_loginRequired` — core/PlatformRequest.php:82
- confirmed `frontend.` — Storefront route prefix check — storefront/Framework/Routing/Router.php:204
- confirmed `XmlHttpRequest` — required for XHR — storefront/Framework/Routing/StorefrontSubscriber.php:245
- confirmed `GenericPageLoaderInterface::load()` — returns Page — storefront/Page/GenericPageLoaderInterface.php:12
- confirmed `PageLoadedEvent::getPage()` — abstract — storefront/Page/PageLoadedEvent.php:25
- deprecated `CacheAttribute::$states` — removed in v6.8.0 — core/Framework/Adapter/Cache/Http/CacheAttribute.php:27
- confirmed `sw_extends` — token parser tag — core/Framework/Adapter/Twig/TokenParser/ExtendsTokenParser.php:68
- confirmed `PluginManager.override()` — static — storefront/Resources/app/storefront/src/plugin-system/plugin.manager.js:698
- confirmed `window.PluginBaseClass` — global — storefront/Resources/app/storefront/src/plugin-system/plugin.manager.js:799
- confirmed `base.scss` — depth-0 entry — storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:202
- confirmed `ariaHidden` — defaults to true — storefront/Resources/views/storefront/utilities/icon.html.twig:14
- confirmed `seo` — core XHR routes set false — storefront/Controller/CookieController.php:37
