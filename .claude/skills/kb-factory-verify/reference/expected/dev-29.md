# `dev-29` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-29` · `dev` · `Storefront` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-11` · run `cases-review-2026-09-11-2117-22-31` |
| Core version | `6.7.13.0` |

**Query:** How do I add my own data to an existing Storefront page or pagelet from a plugin without overriding the core controller?

**Expected answer — every fact an answer must contain:**

1. Subscribe to the target page's or pagelet's `*LoadedEvent` from a Symfony `EventSubscriberInterface` registered with the `kernel.event_subscriber` tag, and attach the data to the struct handed over by the event — `$event->getPage()->addExtension(...)` / `$event->getPagelet()->addExtension(...)`. The loader dispatches the event with the fully built struct as its last step before returning it, so the mutation reaches the template; `addExtension()` is typed `addExtension(string $name, Struct $extension)`, so a plain array must go through `addArrayExtension()` (which wraps it in an `ArrayStruct`) and a scalar must be wrapped in a struct. The extension is then read in Twig as `<struct>.extensions.<name>`. `[code: storefront: Page/Product/ProductPageLoader.php:127-131; Pagelet/Footer/FooterPageletLoader.php:52-56; Framework/Struct/ExtendableTrait.php:21-35,98]`
2. In 6.7 the header and footer are **not** part of the surrounding page: `base.html.twig` renders both as ESI sub-requests (`render_esi(path('frontend.header'…))` / `frontend.footer`, paths `/_esi/global/header` and `/_esi/global/footer` since 6.7.1.0), served by `NavigationController::header()`/`::footer()`, which pass only `header` => `HeaderPagelet` and `footer` => `FooterPagelet` into the template — no `page` variable exists in `storefront/layout/header/*.twig` or `layout/footer/*.twig`. Data for the header or footer must therefore be attached in a `HeaderPageletLoadedEvent` / `FooterPageletLoadedEvent` subscriber (`Shopware\Storefront\Pagelet\Header\HeaderPageletLoadedEvent`, `…\Pagelet\Footer\FooterPageletLoadedEvent`, dispatched by `HeaderPageletLoader::load()` / `FooterPageletLoader::load()`) and is read as `footer.extensions.product_count.count`; an extension added in a `*PageLoadedEvent` subscriber is out of scope there and renders as nothing (silently, because `twig.strict_variables: false`). `[code: storefront: Resources/views/storefront/base.html.twig:55,114; Controller/NavigationController.php:120-162; Pagelet/Header/HeaderPageletLoader.php:73; Pagelet/Footer/FooterPageletLoader.php:52-56; Framework/Twig/TemplateDataExtension.php:71-79]`
3. The rule "do not call the DAL inside a page/pagelet loader, use a store-api route" is a documented contract carried as a class docblock on the core loaders (`HeaderPageletLoader`, `FooterPageletLoader` and ~26 page loaders): "Do not use direct or indirect repository calls in a PageletLoader. Always use a store-api route to get or put data." It is a convention, not a platform constraint on plugins: enforcement is a Danger PR rule that only inspects `src/Storefront/{Controller,Page,Pagelet}/*` inside shopware/shopware itself, and there is no PHPStan rule, attribute, runtime guard or deprecation annotation on `Pagelet`, `PageletLoadedEvent` or the concrete events restricting DAL use in a plugin's subscriber. `[code: storefront: Pagelet/Footer/FooterPageletLoader.php:20-24; Pagelet/Header/HeaderPageletLoader.php:23-25; core: DevOps/StaticAnalyze/Danger/Rules/EntityRepositoryInFrontendLayer.php:9-33]`

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/plugins/storefront/controllers/add-data-to-storefront-page.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| Every Storefront page loader dispatches a `*PageLoadedEvent` with the fully built page as its last step before returning | `../storefront/Page/Product/ProductPageLoader.php:127-131` | `$this->eventDispatcher->dispatch(new ProductPageLoadedEvent($page, $context, $request)); return $page;` |
| `PageLoadedEvent` is abstract and hands the subscriber the page, the `SalesChannelContext` and the `Request` | `../storefront/Page/PageLoadedEvent.php:14-40` | `abstract class PageLoadedEvent extends NestedEvent implements ShopwareSalesChannelEvent` … `abstract public function getPage();` |
| The concrete event exposes the typed page | `../storefront/Page/Product/ProductPageLoadedEvent.php:11-24` | `public function getPage(): ProductPage` |
| `Page extends Struct`, so `addExtension(string $name, Struct $extension)` and `addArrayExtension(string $name, array $extension)` are the supported ways to attach data — `addExtension()` requires a `Struct`, not a scalar | `../storefront/Page/Page.php:9`, `Framework/Struct/ExtendableTrait.php:21-35` | `public function addExtension(string $name, Struct $extension): void` … `public function addArrayExtension(string $name, array $extension): void { $this->extensions[$name] = new ArrayStruct($extension); }` |
| Extensions are read in Twig via the public accessors, as `.extensions.<name>`; Twig's `ANY_CALL` checks `ArrayAccess::offsetExists()` before the method lookup, so both a hand-rolled struct with `getCount()` and a plain `ArrayStruct(['count' => N])` resolve `…product_count.count` | `Framework/Struct/ExtendableTrait.php:98`, `vendor/twig/twig/src/Extension/CoreExtension.php:1712-1722` | `public function getExtensions(): array` … `$object instanceof \ArrayAccess => $object->offsetExists($arrayItem)` |
| Pagelets carry the same mechanism; `Pagelet` is an empty abstract extending `Struct` | `../storefront/Pagelet/PageletLoadedEvent.php:13-39`, `../storefront/Pagelet/Pagelet.php:9-11` | `abstract class PageletLoadedEvent extends NestedEvent …` … `abstract class Pagelet extends Struct {}` |
| 6.7.13.0 `base.html.twig` renders header and footer as ESI sub-requests, unconditionally — no feature flag, no inline fallback | `../storefront/Resources/views/storefront/base.html.twig:55,114` | `{{ render_esi(path('frontend.header', { headerParameters: headerParameters }), { ignore_errors: false } ) }}` … `{{ render_esi(path('frontend.footer', …) }}` |
| The ESI sub-request is served by `NavigationController::header()`/`::footer()`, which pass exactly two variables each — `header` => `HeaderPagelet` + `headerParameters`, `footer` => `FooterPagelet` + `footerParameters`. No `page` variable is passed | `../storefront/Controller/NavigationController.php:120-162` | `return $this->renderStorefront('@Storefront/storefront/layout/header.html.twig', ['header' => $header, 'headerParameters' => …]);` |
| `page` is not reachable in the header/footer ESI scope by any other route: `TemplateDataExtension::getGlobals()` registers `shopware`, `themeId`, `context`, `activeRoute` — never `page`. Core's own `layout/header/search.html.twig` prints `page.searchTerm` and renders empty only because `twig.strict_variables: false` | `../storefront/Framework/Twig/TemplateDataExtension.php:71-79`; `../storefront/Resources/views/storefront/layout/header/search.html.twig:29`; `Framework/Resources/config/packages/twig.yaml:3` | `return ['shopware' => […], 'themeId' => $themeId, …]` … `value="{{ page.searchTerm }}"` … `strict_variables: false` |
| `HeaderPageletLoadedEvent` and `FooterPageletLoadedEvent` exist under exactly those names, extend `PageletLoadedEvent`, and are dispatched by the loaders as the last step before returning the pagelet | `../storefront/Pagelet/Header/HeaderPageletLoader.php:73`; `../storefront/Pagelet/Footer/FooterPageletLoader.php:52-56`; `../storefront/Pagelet/Header/HeaderPageletLoadedEvent.php:12-24`; `../storefront/Pagelet/Footer/FooterPageletLoadedEvent.php:12-24` | `$this->eventDispatcher->dispatch(new FooterPageletLoadedEvent($pagelet, $salesChannelContext, $request)); return $pagelet;` |
| The route names `frontend.header` / `frontend.footer` are unchanged but their paths moved to `/_esi/global/header` and `/_esi/global/footer` in 6.7.1.0; both are declared `_esi => true`, `XmlHttpRequest => true`, `ATTRIBUTE_HTTP_CACHE => true`, i.e. the fragment is HTTP-cached independently of the page | `../storefront/Controller/NavigationController.php:120-130`; shopware/shopware `changelog/release-6-7-1-0/2025-07-01-change-path-of-header-and-footer-routes.md` (ref `refs/heads/trunk`) | `#[Route(path: '/_esi/global/header', name: 'frontend.header', defaults: ['XmlHttpRequest' => true, PlatformRequest::ATTRIBUTE_HTTP_CACHE => true, '_esi' => true], …)]` |
| The store-api-route rule exists in code as a class docblock on the loaders (also on ~26 page loaders and the Storefront controllers); core's own loaders honour it by consuming `AbstractPaymentMethodRoute` / `AbstractShippingMethodRoute` / `AbstractCurrencyRoute` / `AbstractLanguageRoute` | `../storefront/Pagelet/Header/HeaderPageletLoader.php:23-25`; `../storefront/Pagelet/Footer/FooterPageletLoader.php:20-24` | `/** * Do not use direct or indirect repository calls in a PageletLoader. Always use a store-api route to get or put data. */` |
| The contract is enforced only by a Danger PR rule inside shopware/shopware, matching `src/Storefront/{Controller,Page,Pagelet}/*`; the rule class is `@internal` and matches nothing outside those platform paths | `DevOps/StaticAnalyze/Danger/Rules/EntityRepositoryInFrontendLayer.php:9-33` | `$files->filterStatus(File::STATUS_MODIFIED)->matches('src/Storefront/Pagelet/*')->filter($isNewRepoUse)->getElements()` |
| For data that belongs in the loader's own DAL query, a criteria event fires *before* loading so a subscriber can add associations | `../storefront/Page/Product/ProductPageLoader.php:89` | `$this->eventDispatcher->dispatch(new ProductPageCriteriaEvent($productId, $criteria, $context));` |
| Page loading is also exposed to app scripts via `PageLoadedHook` (repository, system-config, sales-channel-repository, request facades) | `../storefront/Page/PageLoadedHook.php:18-31` | `abstract class PageLoadedHook extends Hook implements SalesChannelContextAware` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| A dedicated "page extension" interface or DI tag exists for enriching pages | absent | The mechanism is a plain Symfony `EventSubscriberInterface` on the concrete `*PageLoadedEvent` class; no Shopware-specific interface or enrichment tag appears under `../storefront/Page`. Core's own listeners subscribe by event class-string — `../storefront/Test/Controller/AuthTestSubscriber.php:22-28` |
| A `page` variable is available inside `storefront/layout/header/*.twig` and `layout/footer/*.twig`, so a `*PageLoadedEvent` extension can be read there | absent | `NavigationController::header()`/`footer()` pass only `['header'\|'footer', '*Parameters']` to `renderStorefront()`; `TemplateDataExtension::getGlobals()` never registers `page`; `renderStorefront()` adds nothing beyond the `StorefrontRenderEvent` parameters — `../storefront/Controller/NavigationController.php:131-162`, `../storefront/Framework/Twig/TemplateDataExtension.php:71-79`, `../storefront/Controller/StorefrontController.php:67-90` |
| `Pagelet` / `PageletLoadedEvent` (or the Header/Footer subclasses) carry a deprecation or restriction against DAL use in subscribers | absent | `Pagelet.php` is an empty abstract extending `Struct`; `PageletLoadedEvent` declares only `getPagelet()`/`getSalesChannelContext()`/`getContext()`/`getRequest()`; the only deprecations under `../storefront/Pagelet/` are `HeaderPagelet`'s v6.8.0 `activeLanguage`/`activeCurrency` accessors, unrelated to the DAL |
| A PHPStan rule forbids repository use in Storefront page/pagelet loaders | absent | No rule under `DevOps/StaticAnalyze/PHPStan/Rules` references `PageLoader`/`PageletLoader` or `EntityRepository` in that sense; the enforcement is the Danger PR rule instead |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| How a `*PageLoadedEvent` is subscribed to in practice (class-string key in `getSubscribedEvents()`) | `../storefront/Test/Controller/AuthTestSubscriber.php:22-28` |
| `FooterPageletLoader` consumes store-api routes (`AbstractPaymentMethodRoute` / `AbstractShippingMethodRoute`) and returns a `FooterPagelet` whose data the footer templates read | shopware/shopware `tests/unit/Storefront/Pagelet/Footer/FooterPageletLoaderTest.php` (ref `refs/heads/trunk`, blob `aee0a2d1fe202a22eb2a487f5e4520776be50032`) — not present in the trimmed vendor dist |
| `HeaderPageletLoader` integration test loads the real service from the container and calls `load(Request, SalesChannelContext)` — the same entry point the ESI sub-request uses | shopware/shopware `tests/integration/Storefront/Pagelet/HeaderPageletLoaderTest.php` (ref `refs/heads/trunk`, blob `b6bd720535a7e3bef399aae468d4f6bc5e40ce0b`) |

Deep-lane caveat: the trunk tests cited carry `#[Package('discovery')]`, a 6.8-era repackaging; no
6.7-branch-pinned copy was read, so they anchor the mechanism, not the 6.7 package annotation.

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| In 6.7 the header is rendered through `render_esi(path('frontend.header', …))` from `base.html.twig`, so inside header templates `page` is not the page — `page.searchTerm` is empty. Verified on 6.7.8.2 and trunk; fixed by PR 18915. | 6.7.8.2 / trunk | closed | https://github.com/shopware/shopware/issues/16168 |
| Core task "Document header and footer template extension with ESI" — maintainers acknowledged the post-ESI extension path was undocumented | 6.7 | closed | https://github.com/shopware/shopware/issues/8604 |
| ESI-rendered header/footer ignore `HttpCacheCookieEvent` / custom cache-hash variations, so plugin-contributed per-customer header data can come from the wrong cache entry | 6.7 | closed | https://github.com/shopware/shopware/issues/16445 |
| Further ESI/HTTP-cache complaints on 6.7 header/footer fragments | 6.7 | closed | https://github.com/shopware/shopware/issues/14723 |
| Forum thread asking how to pass subscriber data to the storefront view — recurring confusion | unclear | open | https://forum.shopware.com/discussion/66145/how-to-pass-data-to-the-storefront-view-page-from-subscriber |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Do `Page`/`Pagelet` still inherit `addExtension()`/`getExtension()` from `Struct`, and must the value be an object? | code | Yes — `Page.php:9` + `ExtendableTrait.php:21-35`; `addExtension()` is typed `Struct`, arrays go through `addArrayExtension()` |
| Is `Storefront\Page\PageLoadedEvent` still the class a subscriber listens to in 6.7? | code | Yes — abstract base at `PageLoadedEvent.php:14-40`, concrete events extend it |
| Are page extensions still read in Twig as `.extensions.<name>`? | code (deep) | Yes — `ExtendableTrait.php:98` plus Twig's `ANY_CALL` resolution order, `CoreExtension.php:1712-1722` |
| Does 6.7's `base.html.twig` render header/footer via `render_esi(…)`, and which struct is `page` inside header/footer templates? | code (deep) | Yes, unconditionally — `base.html.twig:55,114`. `page` is **not bound at all** in that scope; `header`/`footer` are the pagelets — `NavigationController.php:120-162` |
| Which event/pagelet must a plugin use to get data into the ESI-rendered header in 6.7? | code (deep) | `HeaderPageletLoadedEvent` / `FooterPageletLoadedEvent`, dispatched by `HeaderPageletLoader::load()` / `FooterPageletLoader::load()` |
| Is the store-api-route rule a code-level constraint? | code (deep) | It is an in-code docblock contract on the core loaders, enforced only by an `@internal` Danger PR rule scoped to `src/Storefront/*` — no constraint on plugin code |
| Do page-loaded subscribers still run before rendering when the response comes from the HTTP cache, and do Struct extensions survive into the cached response? | not settled by the deep pass; **not load-bearing for the facts** | Recorded as a caveat: the ESI header/footer fragment carries `ATTRIBUTE_HTTP_CACHE => true` and is cached independently of the page (`NavigationController.php:120-130`) |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| Listen to the page-loaded event and add data to the page object instead of overriding the controller | "you will have to listen on the page loaded event and then load the additional data and add it to the page object" | `…/controllers/add-data-to-storefront-page.md` | yes — `ProductPageLoader.php:127-131` |
| All pages and pagelets throw `Loaded` events | as quoted | same | yes — `PageLoadedEvent.php`, `PageletLoadedEvent.php`, `HeaderPageletLoader.php:73`, `FooterPageletLoader.php:52-56` |
| Register the subscriber with `->tag('kernel.event_subscriber')` | as quoted | same | not examined by the code lane (Symfony-level registration) |
| Attach via `$event->getPagelet()->addExtension('product_count', …)` | as quoted | same | partly — the method exists but is typed `Struct`; a scalar or plain array needs `ArrayStruct`/`addArrayExtension()` |
| Read it in Twig as `extensions.product_count.count` on the footer object | as quoted | same | yes, **on the `footer` variable only** — correct when the extension was added on the `FooterPagelet` in a `FooterPageletLoadedEvent` subscriber; the same path written as `page.extensions.…` in a header/footer template renders nothing |
| In a `Pagelet` event the DAL should not be called directly; use a store-api route | as quoted | same | as a contract on the core loaders, yes (`FooterPageletLoader.php:20-24`); as a constraint on plugin subscribers, no |
| Header/footer can still receive custom data directly via this same guide | "It is still possible to add custom data to the header and footer directly" | `…/templates/customize-header-footer.md` | yes, with a qualification the docs omit — only via the Header/Footer **pagelet** events; a `*PageLoadedEvent` extension is unreachable there |
| A custom pagelet struct extends `Storefront\Pagelet\Pagelet` and its event `Storefront\Pagelet\PageletLoadedEvent` | as quoted | `…/controllers/add-custom-pagelet.md` | yes — `PageletLoadedEvent.php:13-39`, `Pagelet.php:9-11` |

## Doc/code divergence

What the documentation asserts and what the code shows. A recorded finding, not a defect report —
this skill does not fix the docs or the wiki.

| docs claim | code shows | citation |
| --- | --- | --- |
| `addExtension('product_count', $productCountResponse->getProductCount())` — implying any value may be attached | `addExtension()` is typed `addExtension(string $name, Struct $extension)`; arrays must go through `addArrayExtension()`, which wraps them in an `ArrayStruct` | `Framework/Struct/ExtendableTrait.php:21-35` |
| "Since we are in a `Pagelet`-event, the DAL should not be called directly to fetch data. Instead, we should check whether a suitable `store-api` route exists." Justified in the docs on payload-size grounds ("would return far more information than necessary") | The sentence exists verbatim as a class docblock on the core loaders, so it is a real in-code contract — but it binds the platform's own `src/Storefront/{Controller,Page,Pagelet}/*` through an `@internal` Danger PR rule. No PHPStan rule, attribute, runtime guard or deprecation annotation restricts DAL use in a plugin's subscriber | `../storefront/Pagelet/Footer/FooterPageletLoader.php:20-24`; `DevOps/StaticAnalyze/Danger/Rules/EntityRepositoryInFrontendLayer.php:9-33` |
| "It is still possible to add custom data to the header and footer directly" (customize-header-footer), pointing back at the page guide without distinguishing page from pagelet | Header and footer are separate ESI sub-requests binding only `header`/`footer`; no `page` variable exists in that scope, so a page-struct extension is silently invisible there (`twig.strict_variables: false`). Core itself ships the dead expression `page.searchTerm` in `layout/header/search.html.twig:29` | `../storefront/Controller/NavigationController.php:120-162`; `../storefront/Resources/views/storefront/layout/header/search.html.twig:29`; `Framework/Resources/config/packages/twig.yaml:3` |
| The guide imports `Shopware\Core\Content\Product\SalesChannel\ProductCountRoute` while the route it teaches the reader to write lives in `Swag\BasicExample\…\ProductCountRoute`, and shows `services.php` twice with and without `->public()` | internal inconsistency in the guide; not a code finding | — |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| Subscribe to the page/pagelet `*LoadedEvent` (e.g. `FooterPageletLoadedEvent`) from an `EventSubscriberInterface` registered with the `kernel.event_subscriber` tag in `services.php`. | rewritten | Kept and confirmed (`ProductPageLoader.php:127-131`, `FooterPageletLoader.php:52-56`), extended with the `Struct`-typing of `addExtension()` and the `addArrayExtension()` route for arrays, which the old text omitted |
| Attach the value with `$event->getPagelet()->addExtension('product_count', …)` and read it in Twig as `footer.extensions.product_count.count`. | rewritten | The Twig path is correct but only because `footer` is the `FooterPagelet` bound by the ESI sub-request. The old fact did not say that header/footer are ESI sub-requests with no `page` in scope, so an answer that added the extension in a `*PageLoadedEvent` subscriber would have scored as correct while rendering nothing — `NavigationController.php:120-162`, `TemplateDataExtension.php:71-79` |
| Do not call the DAL directly inside the page/pagelet event handler — fetch the data through a Store API route (e.g. `AbstractProductCountRoute` at `/store-api/get-active-product-count`) instead. | rewritten | Stated as an absolute rule. Code shows it is a docblock contract on the core loaders enforced only by an `@internal` Danger rule over `src/Storefront/*` — binding on the platform, a convention for plugins. The `/store-api/get-active-product-count` example is the docs' own tutorial route, not a core route, and no code finding supports it as a fact |
