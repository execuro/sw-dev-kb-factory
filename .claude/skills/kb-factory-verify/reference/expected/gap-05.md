# `gap-05` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `gap-05` · `gap` · `Gap` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0959-92-100` |
| Core version | `6.7.13.0` |

**Query:** My plugin decorates `CachedProductRoute` to add cache tags — where did the `Cached*Route` classes go in Shopware 6.7 and how do I cache a Store API route now?

**Expected answer — every fact an answer must contain:**

1. States that the `Cached*Route` decorators are gone in 6.7 — no `Cached*Route` class exists in core or storefront, and the `AbstractCacheTracer`/`CacheTracer` service they used ships no longer — so there is nothing left to decorate; and that the documentation corpus carries no 6.7 page covering the removal or a migration path (the removal is stated only in the live 6.7.0.0 release notes, while the extendability guide still teaches the abstract/concrete/cache-decorator triple and links `CachedCategoryRoute.php` at tag v6.4.12.0 as current).  `[code: Content/Product/SalesChannel/ ; Framework/Adapter/Cache/ (grep `class Cached` returns no route class)]`
2. Names the replacement as a route default rather than a decorator — `defaults: [PlatformRequest::ATTRIBUTE_HTTP_CACHE => true]`, i.e. `'_httpCache'` — **and qualifies it**: the store-api half of that mechanism landed in **6.7.6.0**, not 6.7.0.0 (at v6.7.0.0 and v6.7.5.0 `CacheResponseSubscriber` has no store-api area at all and `ProductDetailRoute` carries no `_httpCache`), and from 6.7.6.0 on, store-api HTTP caching is gated behind the experimental `CACHE_REWORK` feature flag, which defaults to `false`. On a stock 6.7.6.0+ install a store-api response is short-circuited before any cache-control is written and keeps Symfony's default `no-cache, private`, so declaring `_httpCache` alone does not cache the route.  `[code: Framework/Adapter/Cache/Http/CacheResponseSubscriber.php:119-123 ; Framework/Resources/config/packages/feature.yaml:64-68 ; Content/Product/SalesChannel/Detail/ProductDetailRoute.php:85-92]`
3. States that cache tags are now added from inside the route by injecting `CacheTagCollector` and calling `addTag()` — the collector de-duplicates per request URI and `CacheStore::write()`/`ReverseProxyCache::write()` read the tags back — and not by dispatching `AddCacheTagEvent` directly, which a shipped PHPStan rule forbids outside the collector. `CacheTagCollector` is a private service, so it must be injected (services.xml argument or autowired type-hint), not fetched from the container.  `[code: Framework/Adapter/Cache/CacheTagCollector.php:56-71 ; DevOps/StaticAnalyze/PHPStan/Rules/NoAddCacheTagEventRule.php:17-21 ; Framework/DependencyInjection/cache.xml:159-163]`

**Trap:** the query names `CachedProductRoute`. No class by that exact name ever existed — the 6.6 siblings are `CachedProductDetailRoute` / `CachedProductListingRoute`. An answer must not invent it, and must not offer a 6.7 decorator class or claim the docs document the removal.

**Official reference URL:** https://developer.shopware.com/release-notes/6.7/6.7.0.0.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| In 6.6 `CachedProductDetailRoute` still existed but was marked for removal; it cached by decorating the route and tagging a Symfony cache item. | `https://github.com/shopware/shopware/blob/v6.6.10.0/src/Core/Content/Product/SalesChannel/Detail/CachedProductDetailRoute.php` | `/** @deprecated tag:v6.7.0 - reason:decoration-will-be-removed - Will be removed */ class CachedProductDetailRoute extends AbstractProductDetailRoute` |
| The replacement mechanism is a route default: a Store API route opts into HTTP caching with `PlatformRequest::ATTRIBUTE_HTTP_CACHE` (`'_httpCache'`). | `Content/Product/SalesChannel/Detail/ProductDetailRoute.php:85-92` | `defaults: [PlatformRequest::ATTRIBUTE_ENTITY => ProductDefinition::ENTITY_NAME, PlatformRequest::ATTRIBUTE_HTTP_CACHE => true]` |
| `'_httpCache'` may be `true` or an array of options (clientMaxAge, sharedMaxAge, maxAge, states) normalised into a `CacheAttribute`. | `PlatformRequest.php:80` ; `Framework/Adapter/Cache/Http/CacheAttribute.php:9-40` | `public const ATTRIBUTE_HTTP_CACHE = '_httpCache';` |
| Tags are no longer computed in a decorator: the route itself pushes them into `CacheTagCollector`. | `Content/Product/SalesChannel/Detail/ProductDetailRoute.php:133` | `$this->cacheTagCollector->addTag(EntityCacheKeyGenerator::buildProductTag($parent));` |
| `CacheTagCollector::addTag()` de-duplicates per request URI and dispatches `AddCacheTagEvent` itself; the collector is its own listener and `CacheStore`/`ReverseProxyCache` read tags via `$this->collector->get($request)`. | `Framework/Adapter/Cache/CacheTagCollector.php:13-15,32-38,56-71` ; `Framework/Adapter/Cache/Http/CacheStore.php:155` | `$tags = $this->collector->get($request);` |
| Direct instantiation/dispatch of `AddCacheTagEvent` is forbidden by a shipped PHPStan rule naming `addTag()` as the replacement. | `DevOps/StaticAnalyze/PHPStan/Rules/NoAddCacheTagEventRule.php:17-21,52-71` | `'Direct instantiation of %s is forbidden; use %s->addTag(%s) instead.'` |
| `CacheTagCollector` is **not** a public service (no `public="true"`, no alias, no `<defaults public="true">`), so it must be injected rather than fetched from the container. | `Framework/DependencyInjection/cache.xml:159-163,1-7` | `<service id="Shopware\Core\Framework\Adapter\Cache\CacheTagCollector">` with no `public` attribute |
| **Gate:** with `CACHE_REWORK` and `v6.8.0.0` off, a store-api-area response is short-circuited in `setResponseCache` regardless of `_httpCache`; the area is a pure function of the route scope. | `Framework/Adapter/Cache/Http/CacheResponseSubscriber.php:85,119-123` | `if ($area === self::POLICY_AREA_STORE_API && !Feature::isActive('CACHE_REWORK') && !Feature::isActive('v6.8.0.0')) { $this->noCache($request, $response, $area); return; }` |
| The failure mode is a no-op, not a no-store: `noCache()` returns without touching cache-control unless the route carries `ATTRIBUTE_NO_STORE`, so the response keeps `Cache-Control: no-cache, private`. | `Framework/Adapter/Cache/Http/CacheResponseSubscriber.php:246-256` | `if (!Feature::isActive('CACHE_REWORK') && !Feature::isActive('v6.8.0.0')) { if ($this->isNoStoreRoute($request)) { $this->addNoStoreHeader($request, $response); } return; }` |
| No other core path caches it: the storefront area is unreachable for a store-api request; `store_api.cacheable` is only reached through `applyPolicy()`, which the gate bypasses; Symfony's `HttpCache` only stores a cacheable response, and `ReverseProxyCache::write()` only sends tags, never cache-control. | `Framework/Adapter/Kernel/HttpCacheKernel.php:44-59` ; `Framework/Adapter/Cache/ReverseProxy/ReverseProxyCache.php:52-76` ; `Framework/Resources/config/packages/shopware.yaml:149-172` | `if ($response->isCacheable()) { $this->store($request, $response);` / `$this->gateway->tag(\array_values($tags), $request->getPathInfo(), $response);` |
| `CACHE_REWORK` is `default: false` on 6.7.13.0 and its description names Store-API caching among the behaviours it unlocks. | `Framework/Resources/config/packages/feature.yaml:64-68` | `- name: CACHE_REWORK\n  default: false\n  description: "Experimental! … Enable caching for Store-API."` |
| **Version boundary:** at v6.7.0.0 and v6.7.5.0 `CacheResponseSubscriber` has no area concept (no `POLICY_AREA_STORE_API`, no `isStoreApi()`, no `Feature` usage) and simply applies `setSharedMaxAge()` to any route carrying `_httpCache`. | `github shopware/shopware refs/tags/v6.7.0.0, v6.7.5.0 src/Core/Framework/Adapter/Cache/Http/CacheResponseSubscriber.php` | `$cache = $request->attributes->get(PlatformRequest::ATTRIBUTE_HTTP_CACHE); if (!$cache) { return; } … $response->setSharedMaxAge($maxAge);` |
| The store-api route defaults landed in the same release: `ProductDetailRoute` has no `_httpCache` at v6.7.0.0/v6.7.5.0 and carries it at v6.7.6.0. | `github shopware/shopware refs/tags/v6.7.5.0 vs v6.7.6.0 src/Core/Content/Product/SalesChannel/Detail/ProductDetailRoute.php` | v6.7.5.0 `defaults: ['_entity' => 'product']` vs v6.7.6.0 `defaults: [… PlatformRequest::ATTRIBUTE_HTTP_CACHE => true]` |
| On 6.7.13.0 exactly 21 core Store API routes carry `ATTRIBUTE_HTTP_CACHE => true` (catalogue + system: Category/Navigation/Product*/Cms/Breadcrumb/SeoUrl/LandingPage/Media, Language/Currency/CountryState/Country/Salutation). All `Checkout/*` store-api routes carry none. | `grep 'ATTRIBUTE_HTTP_CACHE' over Content/ and System/` ; e.g. `Content/Category/SalesChannel/CategoryListRoute.php:42` | `defaults: [PlatformRequest::ATTRIBUTE_ENTITY => CategoryDefinition::ENTITY_NAME, PlatformRequest::ATTRIBUTE_HTTP_CACHE => true],` |
| Legacy per-route cache events survive only as deprecated husks. | `Framework/Adapter/Cache/StoreApiRouteCacheTagsEvent.php:16-18` | `/** @deprecated tag:v6.8.0 - Will be removed in 6.8.0 as it was not used anymore */` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| `Cached*Route` classes exist in 6.7 and can be decorated | absent | `find vendor/shopware/core -name 'Cached*Route.php'` returns nothing at 6.7.13.0; `grep 'class Cached'` over core and storefront returns only non-route caches (`CachedRuleLoader`, `CachedFlowLoader`, `CachedSystemConfigLoader`, …). |
| A class literally named `CachedProductRoute` ever existed | absent | The 6.6 tree carries `CachedProductDetailRoute` / `CachedProductListingRoute`-style names; no `CachedProductRoute` was found. |
| `AbstractCacheTracer` / `CacheTracer` still ships | absent | `find` returns nothing; `Framework/Adapter/Cache/` carries `CacheTagCollector` and `CacheTagCollection` instead. |
| A store-api response gets the `store_api.cacheable` policy when the route sets `_httpCache`, on a stock 6.7 install | absent | `applyPolicy()` — the only caller of `CachePolicyProvider::getPolicy()` — is unreachable for the store_api area unless `CACHE_REWORK`/`v6.8.0.0` is active; the gate at `CacheResponseSubscriber.php:119` returns first. |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| A store-api route with `_httpCache => true` and the flags disabled is not cached; the cache hash is never computed and the header is `no-cache, private`. | `tests/unit/Core/Framework/Adapter/Cache/Http/CacheResponseSubscriberTest.php:769-790` (`testStoreApiNoCacheRework`, v6.7.13.0) |
| With the rework active the store_api policy applies (`public, s-maxage=200`); POST and routes without the attribute fall to the uncacheable policy. | `tests/unit/Core/Framework/Adapter/Cache/Http/CacheResponseSubscriberTest.php:694-750` |
| The supported plugin pattern: constructor-inject `CacheTagCollector` into a store-api route and call `addTag()`. | `tests/unit/Core/Content/Breadcrumb/SalesChannel/BreadcrumbRouteTest.php:31,55-61` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| Maintainer epic confirming the gap the removal left: developers needed "workarounds or community modules" for Store-API caching; plan was to enable HttpCache for store-api routes and deprecate the `SwagStoreApiCache` hot-fix plugin. | 6.7 | closed 2026-01-09 | https://github.com/shopware/shopware/issues/7783 |
| Merged PR "feat: enable store api routes caching", milestone **6.7.6.0** — marks Store API routes for caching, changes `CacheResponseSubscriber`, adds global/local policies. | 6.7.6.0 | merged | https://github.com/shopware/shopware/pull/12370 |
| Technical task naming the mechanism as `defaults: ['_httpCache' => true]`, "similarly to the Storefront". | 6.7.6.0 | closed | https://github.com/shopware/shopware/issues/12391 |
| Follow-up cross-checking which `SwagStoreApiCache` routes should be cacheable in core, "also for plugins". | 6.7 | closed | https://github.com/shopware/shopware/issues/13199 |
| Production bug: a decorator that redeclared `#[Route]` lost it and route resolution picked the core class; fixed by "chore: don't override routes in decorators". | 6.6.10.19 | closed | https://github.com/shopware/shopware/issues/17552 |
| 6.7.0.0 release notes: Store-API route caching removed, `Cached*Route` classes removed; a plugin extending them gets a class-not-found error. | 6.7.0.0 | closed | https://developer.shopware.com/release-notes/6.7/6.7.0.0.html |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Do any `Cached*Route` classes still exist in 6.7? | code lane + deep pass | No. `grep 'class Cached'` over core and storefront returns no route class. |
| Does `_httpCache` work for Store API routes across 6.7? | deep pass Q2 | No — it is a 6.7.6.0 feature; v6.7.0.0/v6.7.5.0 have no store-api area and no `_httpCache` defaults. Fact 2 carries the qualifier. |
| Which core Store API routes carry the flag? | deep pass Q3 | 21 catalogue/system routes; no `Checkout/*` route. |
| Does the 6.7 subscriber support the global/local cache policies from PR #12370? | deep pass Q1 | The `store_api.cacheable` policy exists in `shopware.yaml` but is unreachable with `CACHE_REWORK` off. |
| Is `getDecorated()` decoration still the way to wrap a Store API route, and must a decorator redeclare `#[Route]`? | not settled by code | Not needed for the facts: fact 3 states the tag mechanism, which no longer depends on decoration. |
| Which service adds tags now — `CacheTagCollection` / `AbstractCacheTracer` / something else? | deep pass Q4 | `CacheTagCollector::addTag()`, injected privately; `AddCacheTagEvent` dispatch is forbidden by a PHPStan rule. `AbstractCacheTracer` is gone. |
| Is `shopwareLabs/SwagStoreApiCache` still referenced by core? | not settled by code | Not needed for the facts; no fact rests on it. |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| Store-API route caching was removed and the `Cached*Route` classes with it. | "The Store-API route caching has been removed. This means that the `Cached*Route` classes will be removed." | https://developer.shopware.com/release-notes/6.7/6.7.0.0.html | **yes** — no `Cached*Route` exists at 6.7.13.0 |
| "Fine-grained caching is removed". | "Fine-grained caching is removed" | https://developer.shopware.com/release-notes/6.7/6.7.0.0.html | not checked; no fact rests on it |
| The plugin caching guide describes only the HTTP-Cache and object caches, naming no Store API route cache. | "There is the HTTP-Cache on the outer level and then multiple smaller internal 'Object Caches'…" | `guides/plugins/plugins/framework/caching/index.md:20-21` | consistent; the guide gives no store-api migration path |
| Custom cache tags are added via the `CacheTagCollector` service. | "To add your own cache tags to the HTTP-Cache, you can use the `CacheTagCollector` service." | `guides/plugins/plugins/framework/caching/index.md:234` | **yes** — `CacheTagCollector.php:56-71` |
| Custom tags are invalidated by passing them to `CacheInvalidator`. | "To invalidate the cache, you need to call the `CacheInvalidator` service and pass the tag you want to invalidate." | `guides/plugins/plugins/framework/caching/index.md:254` | not checked by any lane; excluded from the facts |
| Object caches support no custom tags or cache-key manipulation. | "…adding custom tags or manipulating the cache key is not supported for the various object caches." | `guides/plugins/plugins/framework/caching/index.md:362` | not checked; no fact rests on it |
| The Store API override guide presents route decoration and shows influencing caching only by setting a `cache-control` header. | `$exampleResponse->headers->add([ 'cache-control' => "max-age=10000" ])` | `guides/plugins/plugins/framework/store-api/override-existing-route.md:62` | no code lane confirmation of this as a supported caching path |
| The extendability guide presents a Cache decorator as part of the standard Store API route triple, linking `CachedCategoryRoute` at v6.4.12.0. | "…a [Concrete implementation] and a [Cache decorator](…/v6.4.12.0/…/CachedCategoryRoute.php)." | `guides/development/extensions/architecture/extendability.md:72` | **no** — the class does not exist in 6.7 |
| Tag-based invalidation requires the `redis_tag_aware` adapter. | "…it requires the `redis_tag_aware` adapter (configured above)." | `guides/hosting/performance/caches.md:170` | not checked; no fact rests on it |

Docs-lane coverage for this case: **partial**. The removal is stated only in the live 6.7.0.0 release notes; the corpus has no page announcing it and no migration guidance for a plugin that decorated a `Cached*Route`.

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| The extendability guide teaches the abstract/concrete/**cache decorator** triple and links `CachedCategoryRoute.php` (v6.4.12.0) as a current example. | No `Cached*Route` class exists at 6.7.13.0, and `AbstractCacheTracer`/`CacheTracer` no longer ship — there is nothing to decorate. | `extendability.md:72` vs `Content/Product/SalesChannel/` ; `Framework/Adapter/Cache/` |
| The plugin caching guide offers `CacheTagCollector` + `CacheInvalidator` as *the* tag mechanism, written for the HTTP-Cache, and never mentions Store API route caching. | `CacheTagCollector` is confirmed, but store-api HTTP caching is gated behind `CACHE_REWORK` (default `false`), so the guide's mechanism does not by itself make a Store API route cacheable on a stock 6.7. | `caching/index.md:234` vs `CacheResponseSubscriber.php:119-123` ; `feature.yaml:64-68` |
| Neither the release notes nor the corpus state that the `_httpCache` store-api mechanism is a 6.7.6.0 addition rather than 6.7.0.0 behaviour. | `CacheResponseSubscriber` at v6.7.0.0/v6.7.5.0 has no store-api area; `ProductDetailRoute` gains `_httpCache` only at v6.7.6.0. | `github refs/tags/v6.7.0.0, v6.7.5.0, v6.7.6.0` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| States that no 6.7 page mentions `CachedProductRoute` or the `Cached*Route` decorators, so the source never confirms their removal in so many words. | rewritten | The docs half stands (the corpus has no page on the removal), but the fact stopped at the documentation gap. Code settles the reality the gap hides: the classes and `AbstractCacheTracer` are absent, and the corpus additionally carries a *stale* page teaching the decorator as current (`extendability.md:72`) — which the old wording denied by saying no page mentions them. |
| Names the closest 6.7 page actually read. The best answer reaches the caching guide and reports what it does document — adding tags with `CacheTagCollector` and invalidating with `CacheInvalidator`, plus delayed invalidation through the `shopware.invalidate_cache` scheduled task — as the current mechanism, while saying the decorator question itself is unanswered; naming only the HTTP cache configuration page is acceptable but weaker. | removed | Three defects. (a) The `shopware.invalidate_cache` scheduled-task claim is evidenced by no lane: the docs lane, the authority on corpus contents, quotes nothing of the kind, so it is unsupported and is dropped. (b) "naming only the HTTP cache configuration page is acceptable but weaker" is a tolerance clause. (c) The fact graded *which page was read* rather than what is true; replaced by the `_httpCache` mechanism with its 6.7.6.0 and `CACHE_REWORK` qualifiers, which the code settles. |
| Invents no 6.7 decorator class or route default, and does not claim the docs state that the decorators were removed. | rewritten | "Invents no route default" is now wrong: `_httpCache` **is** a real 6.7.6.0+ route default. The anti-invention requirement is preserved in the Trap row (no `CachedProductRoute` ever existed; no 6.7 decorator class), and the tag mechanism is stated positively in fact 3. |
