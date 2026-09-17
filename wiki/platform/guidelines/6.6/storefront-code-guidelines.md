---
id: platform/guidelines/6.6/storefront-code-guidelines.md
title: Storefront code guidelines
docType: guideline
version: "6.6"
summary: "Storefront rules for 6.6: thin controllers, PageLoader to Page, JS PluginManager, HTTP cache defaults, themes, assets, SCSS, snippets."
keywords: ["storefront", "storefrontcontroller", "page loader", "pagelet", "pluginmanager", "_httpcache", "xmlhttprequest", "store-api", "theme.json", "scss", "snippets"]
sources: [{url: "https://developer.shopware.com/docs/v6.6/resources/guidelines/code/storefront-controller.html", hash: "faedd30998c9049d5f592e49e74491151e8e0fda47282c4092f1db4f909dafa5"}, {url: "platform/dev/6.6/guides/plugins/plugins/storefront/**", hash: "c872cf3f50866ba4645b8cf5487e233dfd6b2f269c13586475ede2f7650cf339"}, {url: "platform/dev/6.6/guides/plugins/themes/**", hash: "74601d06ef48b995f1b7ee9fd7b3c1efe9c452062ac557eee8191b190d906dcd"}, {url: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2021-08-10-storefront-coding-standards.html", hash: "571bc8af9e75bb9d7c24371c51c6cceca89b773613d7290fbfea87cc6f9f5aa9"}]
codeVersion: "6.6.10.24+87965325"
lastBuilt: 2026-09-17
---

## controller structure

- Extend `Shopware\Storefront\Controller\StorefrontController`; put `#[Route(defaults: ['_routeScope' => ['storefront']])]` on the class.
- Give each action a `#[Route]` with `path`, a `name` starting with `frontend.`, explicit `methods` and a return type; one purpose per route.
- Inject services via the constructor into private properties, register the service `public="true"` (else its routes are dropped), import `routes.xml` with `type="attribute"`.
- Render with `renderStorefront()`, translate with `$this->trans()`.

Read more: https://developer.shopware.com/docs/v6.6/resources/guidelines/code/storefront-controller.html

## no business logic in controllers

- Never use a repository directly in a controller, page loader or pagelet subscriber; go through a Store API route, creating one if missing, so every feature is API-reachable.
- End write actions with `createActionResponse($request)` — it honours `redirectTo`/`redirectParameters` and `forwardTo`/`forwardParameters`.
- Report user errors via flash bags (`addFlash()`, `addCartErrors()`).

Read more: https://developer.shopware.com/docs/v6.6/resources/references/adr/2021-08-10-storefront-coding-standards.html

## page and pagelet loaders

- Full-page routes call a PageLoader returning a Page object, passed as `page` to `renderStorefront()`.
- In the loader use `GenericPageLoaderInterface::load($request, $context)`, build with `YourPage::createFrom($page)`, fill it, dispatch a `PageLoadedEvent` subclass.
- Pages extend `Shopware\Storefront\Page\Page`; pagelets extend `Shopware\Storefront\Pagelet\Pagelet`, are built with `new` (never `createFrom()`), events extend `PageletLoadedEvent`.
- Add data to an existing page by subscribing to its loaded event and calling `addExtension()`.

Read more: platform/dev/6.6/guides/plugins/plugins/storefront/add-custom-page.md

## http cache and ajax routes

- Use `defaults: ['_httpCache' => true]` only where output is identical for all customers; invalidation follows the cache tags of the Store API routes used.
- Mark `fetch`/AJAX routes `defaults: ['XmlHttpRequest' => true]`, or `StorefrontSubscriber::preventPageLoadingFromXmlHttpRequest` denies the request.
- Prefer `_loginRequired` (plus `_loginRequiredAllowGuest`) over manual login checks; add `options: ['seo' => true]` to page routes needing SEO URLs.

Read more: platform/dev/6.6/guides/plugins/plugins/storefront/add-caching-to-custom-controller.md

## twig template inheritance
> [expert]

- Override a template by mirroring its path under `<bundle>/Resources/views/` and opening the file with `{% sw_extends '@Storefront/storefront/<same path>' %}`. A wrong path, a block name that is not in *that* file, or a deprecated forwarder file (`page/product-detail/buy-widget*.html.twig` — extend `component/buy-widget/*` instead) is a silent no-op: grep the installed file and read its first lines, never recall a name.
- Only `sw_extends` and `sw_include` walk the template chain in 6.6; `sw_embed`, `sw_use`, `sw_import` and `sw_source` do not exist before 6.7, and plain `extends`/`include` leave the chain.
- Chain order is the active theme's `theme.json` `views` list, later entries win (default `@Storefront` → `@Plugins` → the theme). `@Plugins` expands to every plugin and app not named there, ordered by `Bundle::getTemplatePriority()` (default 0) and app `template_load_priority`. So a theme override beats a plugin override, and `{{ parent() }}` renders the previous bundle in the chain, not necessarily core.
- Override the narrowest block that contains the change and call `{{ parent() }}`; leaving it out replaces every other extension of that block and must be stated. Declare each block name once per file; never copy sibling blocks or whole templates; never edit `vendor/`. Never override `layout_head_javascript_hmr_mode` without `{{ parent() }}`, or the Storefront JS breaks.
- Core templates branch on `feature('ACCESSIBILITY_TWEAKS')` and `feature('v6.7.0.0')`: override the block name of the flagged branch (the 6.7 structure); if the shop runs the flag off and the old branch has a different name, override both in the same file, each with `{{ parent() }}`. A block whose comment says `@deprecated tag:v6.7.0 … Use X instead` or `Block will be moved to …` is overridden as the named replacement.
- Output custom-field or user-provided HTML through `|sw_sanitize`; text is a snippet key with `|trans`, never a literal. Adjust core option arrays with `|replace_recursive`, never by redefinition. Never load database data in a custom Twig function (`AbstractExtension` tagged `twig.extension`); call `searchMedia` once with all IDs, never in a loop.
- App templates are served from the `app_template` table, not from disk.

Read more: platform/dev/6.6/guides/plugins/plugins/storefront/customize-templates.md
Read more: platform/dev/6.6/guides/plugins/themes/add-theme-inheritance.md

## twig override placement
> [expert]

- The shop's flag state is in `.env` (`ACCESSIBILITY_TWEAKS`, `V6_7_0_0`, `CACHE_REWORK`, `FEATURE_ALL`); an override is tested under the state the shop runs.
- Nobody overrides the block → your bundle, `{{ parent() }}` plus the change. A project plugin or theme already overrides it → edit that file, never a second file for the same path. A marketplace plugin overrides it → override later in the chain (the theme) with `{{ parent() }}`. The markup sits in an included sub-template → override that template, not the includer. No block fits → the closest parent block, `{{ parent() }}`, add before or after; never re-render the parent's content.
- Look, spacing and Bootstrap variables belong to the theme (SCSS variables, `theme.json` fields); behaviour, new data and feature markup to a plugin; text to a snippet key, never a literal. One concern per file; a diff longer than the core block it changes is wrong.

## twig version traps
> [expert]

- Header and footer are inline: `base.html.twig` includes `layout/header/header.html.twig` in `base_header` and the footer in `base_footer`, both reading `page.header`/`page.footer`; the ESI routes `frontend.header`/`frontend.footer` run only with `CACHE_REWORK=1` or `FEATURE_ALL=major`. The `base_*` header and footer blocks are deprecated for 6.7 — override blocks inside `layout/header/*.html.twig`, whose names survive the move.
- Markup marked `@deprecated tag:v6.7.0` (the price asterisk, `<div>` line-item wrappers that become `<ul>`/`<li>`, the form-validation plugin, input name prefixes) is no base for new code.
- Bootstrap 5.3, no jQuery: `data-toggle` → `data-bs-toggle`, `data-dismiss` → `data-bs-dismiss`, `.ml-*/.mr-*` → `.ms-*/.me-*`, `.custom-select` → `.form-select`; the off-canvas cart trigger is `data-off-canvas-cart`. `sw_csrf` is gone; `HttpClient` and `DomAccess` still exist but are deprecated in 6.7 — use `fetch` and native DOM.

Read more: platform/dev/6.6/resources/accessibility/storefront/_index.md

## javascript plugin system

- Extend `window.PluginBaseClass` with `init()`, register in `src/Resources/app/storefront/src/main.js` via `PluginManager.register(name, class, selector)` bound to a data attribute; use a dynamic import so it loads only where needed.
- Declare defaults in `static options`, override per element with a `data-<plugin-name-kebab>-options` JSON attribute.
- Adjust core plugins with `PluginManager.override()` / `deregister()` and read them via `getPluginInstanceFromElement()` plus `$emitter.subscribe()`; never patch core files.
- Use native `fetch`; subscribe `document.$emitter` to `COOKIE_CONFIGURATION_UPDATE` for consent and decorate `CookieProviderInterface::getCookieGroups()` for cookies. Keep JS in the bundle, use a `defer` script tag only when required, ship the built `dist` output.

Read more: platform/dev/6.6/guides/plugins/plugins/storefront/override-existing-javascript.md

## styles assets and icons

- Put plugin styles in `src/Resources/app/storefront/src/scss/base.scss`; give configurable variables a `!default` fallback.
- Expose config to SCSS via the `config.xml` `<css>` tag or `ThemeCompilerEnrichScssVariablesEvent::addVariable($name, $value, $sanitize)` (no `$` prefix, kebab-case); recompile the theme after.
- Ship static files in `src/Resources/public/`, install with `bin/console assets:install`, reference via `asset('bundles/<plugin>/…', 'asset')`; render icons with `sw_icon`, always with `namespace` for custom sets.
- Render images with `sw_thumbnails`, passing `loading: 'lazy'`, `alt` and `title` through `attributes`.

Read more: platform/dev/6.6/guides/plugins/plugins/storefront/add-custom-assets.md

## theme structure and configuration

- Use a theme only for sales-channel-scoped appearance: it implements `Shopware\Storefront\Framework\ThemeInterface` and needs no PHP; behaviour belongs in a plugin.
- Configure `src/Resources/theme.json` (`views`, `style`, `script`, `asset`, `config.fields`, `configInheritance`), keep Bootstrap variable overrides in the `overrides.scss` entry listed before `@Storefront` in `style`, and run `bin/console theme:refresh` after changes.
- Never overwrite a third-party theme's variables — a rename there breaks compilation.

Read more: platform/dev/6.6/guides/plugins/themes/theme-configuration.md

## snippets

- Put snippet files in `src/Resources/snippet/` as `<name>.<locale>.json`; `.base.json` only for a new base language.
- Output text as a snippet key (`| trans` in Twig, `$this->trans()` in a controller, the `translator` service elsewhere) with `%placeholder%` parameters, never a literal.

Read more: platform/dev/6.6/guides/plugins/plugins/storefront/add-translations.md

## Code check (6.6.10.24+87965325)

- deprecated `setTwig` — `@deprecated tag:v6.7.0` — storefront/Controller/StorefrontController.php:46
- confirmed `preventPageLoadingFromXmlHttpRequest` — denies XHR lacking the default — storefront/Framework/Routing/StorefrontSubscriber.php:189
