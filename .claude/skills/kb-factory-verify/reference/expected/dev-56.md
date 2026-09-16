# `dev-56` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-56` · `dev` · `Storefront` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0922-52-61` |
| Core version | `6.7.13.0` |

**Query:** Header and footer are loaded through ESI sub-requests in Shopware 6.7, so page data is gone in my header template — how do I pass my own data into the header/footer now?

**Expected answer — every fact an answer must contain:**

1. To carry page-side data into the fragment, extend `@Storefront/storefront/base.html.twig` and override `base_esi_header` / `base_esi_footer`, merging into the `headerParameters` / `footerParameters` Twig variables before `{{ parent() }}` (e.g. `headerParameters|merge({ 'vendorPrefixPluginName': { 'activeRoute': activeRoute } })`). The block renders `render_esi(path('frontend.header', { headerParameters: headerParameters }), { ignore_errors: false })`; `NavigationController::header()` reads them straight off the query bag and forwards them to `layout/header.html.twig`, where they are read back as `headerParameters.vendorPrefixPluginName.activeRoute`. `[code: shopware/storefront Resources/views/storefront/base.html.twig:54-56,113-115]` `[code: shopware/storefront Controller/NavigationController.php:120-162]`
2. That channel is a URL query string, so only query-expressible scalars/arrays travel — objects and entities cannot. It also has a cache cost: the ESI route is marked HTTP-cacheable and the cache key is built from the request URI including its non-ignored query parameters, so each distinct value produces its own cached header fragment. `[code: shopware/storefront Resources/views/storefront/base.html.twig:55]` `[code: Framework/Adapter/Cache/Http/HttpCacheKeyGenerator.php:95-115]`
3. For anything non-scalar, inject inside the sub-request instead: `renderStorefront()` dispatches `StorefrontRenderEvent` for the header/footer render too, so a plugin subscriber that filters on `$event->getRequest()->attributes->get('_route') === 'frontend.header'` can `setParameter()` arbitrary template variables; or subscribe to `HeaderPageletLoadedEvent` / `FooterPageletLoadedEvent` and `addExtension()` on the pagelet struct, read in Twig as `header.extensions.<name>`. Note the pagelet is bound as `header` (not `page`) — there is no `page` variable in the sub-request at all, and `strict_variables` is off, so a leftover `page.foo` silently renders nothing. `[code: shopware/storefront Controller/StorefrontController.php:67-90]` `[code: shopware/storefront Pagelet/Header/HeaderPageletLoader.php:43-75]` `[code: shopware/storefront Resources/views/storefront/layout/header.html.twig:14-29]`

**Trap:** There is no `page` object and no dedicated "pass data to the header" API beyond these paths; `page.*` in an ESI-rendered header fails silently rather than erroring, which is how the missing search term shipped in core itself.

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/plugins/storefront/templates/customize-header-footer.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| 6.7 renders header/footer unconditionally via `render_esi`, passing the parameter arrays as query parameters | `shopware/storefront Resources/views/storefront/base.html.twig:54-56,113-115` | `{% block base_esi_header %}{{ render_esi(path('frontend.header', { headerParameters: headerParameters }), { ignore_errors: false } ) }}{% endblock %}` |
| ESI is enabled in the shipped framework config, so this is a real sub-request | `Framework/Resources/config/packages/framework.yaml:12` | `esi: true` |
| In 6.6 the same call sat behind the `cache_rework` flag with inline header markup as the other branch | `github.com/shopware/shopware blob v6.6.10.0 src/Storefront/…/base.html.twig:41-49` | `{% if feature('cache_rework') %} {{ render_esi(url('frontend.header')) }} … {% else %} {% block base_header %}` |
| The sub-request controller passes only the pagelet and the query parameters — no `page` | `shopware/storefront Controller/NavigationController.php:120-162` | `return $this->renderStorefront('@Storefront/storefront/layout/header.html.twig', ['header' => $header, 'headerParameters' => $request->query->all()['headerParameters'] ?? []]);` |
| `headerParameters`/`footerParameters` are defaults on `StorefrontRenderEvent`, so the main page render can fill them | `shopware/storefront Event/StorefrontRenderEvent.php:29-33` | `$this->parameters = array_merge(['context' => $context, 'headerParameters' => [], 'footerParameters' => []], $parameters);` |
| `renderStorefront()` dispatches `StorefrontRenderEvent` for the header/footer render as well | `shopware/storefront Controller/StorefrontController.php:67-90` | `$event = new StorefrontRenderEvent($view, $parameters, $request, $salesChannelContext); … dispatch($event); … $this->render($view, $event->getParameters(), …)` |
| The pagelets are loaded inside the ESI request and dispatch a `PageletLoadedEvent`; the pagelet is a `Struct`, so `addExtension()` works | `shopware/storefront Pagelet/Header/HeaderPageletLoader.php:43-75`, `Pagelet/Header/HeaderPageletLoadedEvent.php:11-22` | `$this->eventDispatcher->dispatch(new HeaderPageletLoadedEvent($page, $context, $request));` |
| The header template consumes the pagelet as `header`, not `page.header` | `shopware/storefront Resources/views/storefront/layout/header.html.twig:14-29` | `{% sw_include '@Storefront/storefront/layout/navbar/navbar.html.twig' with { header: header } %}` … `{% if header.navigation %}` |
| Only query-expressible data travels through `path()` → `http_build_query` | `shopware/storefront Resources/views/storefront/base.html.twig:55` | `render_esi(path('frontend.header', { headerParameters: headerParameters }), …)` |
| The HTTP cache key includes non-ignored query parameters, so each distinct value fragments the cache | `Framework/Adapter/Cache/Http/HttpCacheKeyGenerator.php:95-115` | `$params = $request->query->all(); … ksort($params); $params = http_build_query($params);` |
| Twig globals come from the current request, so `activeRoute`/`controllerName`/`formViolations` describe `frontend.header` inside the fragment | `shopware/storefront Framework/Twig/TemplateDataExtension.php:34-88` | `'activeRoute' => $request->attributes->get('_route'),` |
| Upstream changelog documents exactly the block-override and the `StorefrontRenderEvent` paths | `github.com/shopware/shopware blob trunk changelog/release-6-7-0-0/2025-04-30-improve-extensibility-of-header-and-footer-esi-templates.md` | `{% set headerParameters = headerParameters|merge({ 'vendorPrefixPluginName': { 'activeRoute': activeRoute } }) %}` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| The header template can still reach the page object (`page.header`, `page.metaInformation`) | absent | `NavigationController::header()/footer()` add no `page` key anywhere in the sub-request and `header.html.twig` references `header.*` only; `strict_variables` is false (`Framework/Resources/config/packages/twig.yaml:3`), so `page.foo` yields nothing instead of erroring |
| A dedicated "pass data to header" service/API beyond the two parameter arrays | absent | `grep -rn 'headerParameters\|footerParameters'` over core and storefront returns four production hits: the two `render_esi` calls, the controller reads, and the `StorefrontRenderEvent` defaults |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| The controller reads the parameters off the query bag and forwards them to the template | `shopware/shopware @ trunk tests/unit/Storefront/Controller/NavigationControllerTest.php:241-269` |
| The parameter arrays default to empty and can be set on the render event | `shopware/shopware @ trunk tests/unit/Storefront/Event/StorefrontRenderEventTest.php:19-49` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| Maintainer: with ESI it is no longer easy to customise header/footer per page; needed documenting | 6.7 | closed | shopware/shopware#8604 |
| Core's own header hit it — `page.searchTerm` resolves empty under ESI | 6.7 | closed | shopware/shopware#16168 (fixed by #18915) |
| `HttpCacheCookieEvent` / `sw-cache-hash` variations do not reach the ESI fragments | 6.7 | closed (not_planned) | shopware/shopware#16445 |
| Per-page dynamic footer content became identical everywhere with HTTP cache on | 6.7 | closed (not_planned) | shopware/shopware#14723 |
| The ESI routes collide with a SEO URL named `/footer` | 6.7 | closed (duplicate) | shopware/shopware#11418 |
| Migration write-up: `GenericPageLoader` injections no longer reach header/footer | 6.7 | open | tobias-schaefer.com 6.6→6.7 migration |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| What does the 6.7 header ESI call look like and where is `headerParameters` defaulted? | code | `render_esi(path('frontend.header', { headerParameters: headerParameters }), { ignore_errors: false })` in `base_esi_header`; defaulted on `StorefrontRenderEvent` |
| What is `page` bound to inside the sub-request? | code | nothing — the controller passes only `header`/`headerParameters`; there is no `page` key |
| Is there a pagelet loaded event to extend? | code | yes — `HeaderPageletLoadedEvent`/`FooterPageletLoadedEvent`, dispatched by the pagelet loaders inside the ESI request |
| Do the ESI query parameters form part of the fragment cache key? | code | yes for non-ignored keys (`HttpCacheKeyGenerator:95-115`); whether custom keys are on the injected `ignoredParameters` list was not resolved |
| Is the ESI rendering gated by a flag a project can turn off? | code | no — unconditional in 6.7; the 6.6 `cache_rework` gate is gone |
| How did #18915 fix the missing search term? | unsettled | the fixing commit was not read; it does not change the mechanisms above |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| Header/footer are loaded via sub-requests and no longer depend on the current page data | "The header and footer are now loaded with sub-requests and are therefore no longer dependent on the current page data." | customize-header-footer.md | yes |
| Page-dependent customisation requires extra ESI parameters via `base_esi_header` / `base_esi_footer` in `base.html.twig` | "The needed block names are `base_esi_header` and `base_esi_footer`." | customize-header-footer.md | yes |
| The mechanism is merging into `headerParameters` before `parent()` | "{% set headerParameters = headerParameters\|merge({ … }) %} {{ parent() }}" | customize-header-footer.md | yes |
| The parameters are passed to the header route as query parameters and through to the template | "The `headerParameters` are passed to the header route as query parameters …" | customize-header-footer.md | yes |
| The arrays may only contain scalar values | "…can only contain scalar values, as they are also query parameters for the ESI routes." | customize-header-footer.md | yes in substance — the transport is `http_build_query`, which also carries nested arrays of scalars, as core's own example does |
| The block approach works in plugins and apps; `StorefrontRenderEvent` is plugin-only | "This approach works both in plugins and apps." | customize-header-footer.md | partly — the event subscriber is PHP, hence plugin-only; the plugin/app split itself is not expressed in code |
| The sub-request is identified by `_route === 'frontend.header'`, read/written via `getParameter`/`setParameter` | "if ($event->getRequest()->attributes->get('_route') !== 'frontend.header') { return; }" | customize-header-footer.md | yes |
| Custom data can still be added directly via the pagelet-loaded event | "It is still possible to add custom data to the header and footer directly …" | customize-header-footer.md | yes — `HeaderPageletLoadedEvent`/`FooterPageletLoadedEvent` exist and fire inside the ESI request |
| Data is attached with `addExtension()` on the pagelet and read as `footer.extensions.<name>` | "$event->getPagelet()->addExtension('product_count', …);" | add-data-to-storefront-page.md | yes — the pagelet is a `Struct` |
| Loading a wholly custom header/footer template overwrites every other extension's customisations | "Please be aware, that this will overwrite customizations from every other extension." | customize-header-footer.md | not checked by the code lane |

Intent/business context the code cannot express: ESI loading was introduced because header and footer change rarely and can stay cached longer — a deliberate trade of extension flexibility for cacheability; the scalar-only restriction is presented as a consequence of the transport, not an API rule.

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| "It is no longer possible to customize the header and footer depending on the current page data" (stated as a restriction, then contradicted lower on the same page) | it is possible, by three code-supported routes: the `headerParameters` query channel, a `StorefrontRenderEvent` subscriber filtered on the ESI route, and a `*PageletLoadedEvent` extension | `shopware/storefront Controller/StorefrontController.php:67-90` |
| The parameters "can only contain scalar values" | the transport is `path()` → `http_build_query`, which also carries nested arrays of scalars — core's own documented example passes `{ 'vendorPrefixPluginName': { 'activeRoute': … } }`; what is excluded is objects | `shopware/storefront Resources/views/storefront/base.html.twig:55` |
| The docs do not mention any cost of adding parameters | each distinct non-ignored query parameter value produces its own cached header fragment | `Framework/Adapter/Cache/Http/HttpCacheKeyGenerator.php:95-115` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| Extend `Storefront/Resources/views/storefront/base.html.twig` and override the blocks `base_esi_header` / `base_esi_footer`, merging values into `headerParameters` / `footerParameters` (e.g. `headerParameters\|merge({ 'vendorPrefixPluginName': { 'activeRoute': activeRoute } })`); these are passed as query parameters to the header/footer ESI route and read back as `headerParameters.vendorPrefixPluginName.activeRoute`. | confirmed, tagged | backed by the `render_esi` call in `base.html.twig` and by `NavigationController::header()` reading `$request->query->all()['headerParameters']` |
| `headerParameters` and `footerParameters` may only contain scalar values, because they double as ESI query parameters. | rewritten | the transport constraint is real but the phrasing is too narrow — nested arrays of scalars travel (core's own example uses one); objects are what cannot. Extended with the fragment-cache cost the old set missed |
| Alternatively a plugin subscribes to `StorefrontRenderEvent`, checks `$event->getRequest()->attributes->get('_route') === 'frontend.header'` and calls `$event->setParameter('headerParameters', $headerParameters)`. | rewritten | confirmed, and broadened: inside the sub-request the subscriber can set arbitrary non-scalar template variables, and `HeaderPageletLoadedEvent`/`FooterPageletLoadedEvent` + `addExtension()` is the second in-sub-request route. Added the `header`-not-`page` binding and the silent-failure behaviour, which is what the query's symptom actually is |
