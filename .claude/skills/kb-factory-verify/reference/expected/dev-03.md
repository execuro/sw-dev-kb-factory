# `dev-03` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-03` · `dev` · `Store API & headless` |
| Version | `6.6 + 6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-11` · run `cases-review-2026-09-11-2118-2-11` |
| Core version | `6.7.13.0` |

**Query:** How do I add a custom Store API route for a headless storefront?

**Expected answer — every fact an answer must contain:**

1. Core's pattern is an abstract route class declaring `getDecorated(): AbstractExampleRoute` and `load(Criteria, SalesChannelContext): ExampleRouteResponse`, plus a concrete class extending it whose `getDecorated()` throws `DecorationPatternException`. The concrete class carries a class-level `#[Route(defaults: [PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [StoreApiRouteScope::ID]])]` — equivalently the raw `['_routeScope' => ['store-api']]`, since the constants are exactly those strings, and the 6.6 stub uses the raw form while 6.7 uses the constants — and a method-level `#[Route]` whose path starts `/store-api/`. Both the scope default and the `/store-api` path prefix are required: `RouteScopeListener` throws `invalidRouteScope` at request time when the scope is missing or unsatisfied. `[code: Framework/Routing/StoreApiRouteScope.php:13-19]`
2. `load()` returns a class extending `Shopware\Core\System\SalesChannel\StoreApiResponse`, which is concrete and wraps a single `Struct` (`__construct(protected Struct $object)`). The route never encodes JSON itself: `StoreApiResponseListener` on `kernel.response` runs the Struct through `StructEncoder` and replaces the result with a `JsonResponse`. If `load()` takes a `Criteria` argument, the route must also declare `defaults: [PlatformRequest::ATTRIBUTE_ENTITY => <entity name>]`, or `CriteriaValueResolver` throws `missingRouteAttribute`. `[code: System/SalesChannel/StoreApiResponse.php:14-32]`
3. Registration is two separate steps, and the plugin must be active: the class is registered as a service, and its route attributes are imported by `<plugin root>/src/Resources/config/routes.xml` / `routes.php` using the **attribute** loader (`<import resource="../../Core/**/*Route.php" type="attribute" />`). `Bundle::configureRoutes()` imports only that location, and `Plugin::configureRoutes()` returns early while the plugin is inactive, so an inactive plugin has no routes at all. `[code: Framework/Plugin.php:70-77]`

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/plugins/framework/store-api/add-store-api-route.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| Core ships a scaffolding generator for this exact task (`--create-store-api-route`), producing abstract route + route + response, a services.xml entry and a routes.xml import | `Framework/Plugin/Command/Scaffolding/Generator/StoreApiRouteGenerator.php:18-36,60-81` | `public const OPTION_NAME = 'create-store-api-route';` … `<import resource="../../Core/**/*Route.php" type="attribute" />` |
| Canonical 6.7 route shape | `Framework/Plugin/Command/Scaffolding/stubs/store-api-route.stub:13-33` | `#[Route(defaults: [PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [StoreApiRouteScope::ID]])]` … `public function getDecorated(): AbstractExampleRoute { throw new DecorationPatternException(self::class); }` … `#[Route(path: '/store-api/example', name: 'store-api.example.search', methods: ['GET', 'POST'])]` |
| The attribute class is `Symfony\Component\Routing\Attribute\Route` | `Framework/Plugin/Command/Scaffolding/stubs/store-api-route.stub:11` | `use Symfony\Component\Routing\Attribute\Route;` |
| The abstract half declares exactly two abstract methods | `Framework/Plugin/Command/Scaffolding/stubs/store-api-abstract-route.stub:9-13` | `abstract public function getDecorated(): AbstractExampleRoute;` / `abstract public function load(Criteria $criteria, SalesChannelContext $context): ExampleRouteResponse;` |
| `StoreApiResponse` is a concrete `Response` wrapping one `Struct` | `System/SalesChannel/StoreApiResponse.php:14-32` | `class StoreApiResponse extends Response { use VariablesAccessTrait; public function __construct(protected Struct $object)` |
| JSON encoding happens in a `kernel.response` listener, not in the route | `System/SalesChannel/Api/StoreApiResponseListener.php:41-75` | `if (!$response instanceof StoreApiResponse) { return; }` … `$jsonResponse = new JsonResponse(null, $response->getStatusCode(), $response->headers->all());` |
| The scope id is the literal `store-api` and the scope also restricts the path prefix | `Framework/Routing/StoreApiRouteScope.php:13-19` | `final public const ID = 'store-api'; final public const ALLOWED_PATH = 'store-api';` |
| Declaring the scope is mandatory; a missing or unsatisfied scope throws at request time | `Framework/Routing/RouteScopeListener.php:48-68,104-116` | `throw RoutingException::invalidRouteScope($mainRequest->attributes->get('_route'));` |
| Auth: the Context source must be a `SalesChannelApiSource` unless `auth_required` is false; credentials travel in `sw-access-key` / `sw-context-token` | `Framework/Routing/StoreApiRouteScope.php:20-34`, `PlatformRequest.php:18-19` | `if (!$request->attributes->get('auth_required', false)) { return true; }` … `return $requestContext->getSource() instanceof SalesChannelApiSource;` |
| A public store-api route sets `defaults: ['auth_required' => false]` | `Content/ProductExport/SalesChannel/ExportController.php:51` | `#[Route(path: '/store-api/product-export/{accessKey}/{fileName}', …, defaults: ['auth_required' => false])]` |
| `SalesChannelContext` is injected by a value resolver matching the exact type | `System/SalesChannel/Context/SalesChannelContextValueResolver.php:18-25` | `if ($argument->getType() !== SalesChannelContext::class) { return; }` |
| A `Criteria` argument requires an `_entity` default | `Framework/Routing/Annotation/CriteriaValueResolver.php:31-56` | `if ($entity === '') { … throw RoutingException::missingRouteAttribute('default "_entity" value', $route); }` |
| Routes are discovered from `<bundle>/Resources/config/routes*`, and an inactive plugin imports none | `Framework/Bundle.php:78-88`, `Framework/Plugin.php:70-77` | `$routes->import($confDir . '/{routes}/*' . Kernel::CONFIG_EXTS, 'glob');` … `if (!$this->isActive()) { return; }` |
| Core's own routes.xml imports route classes with `type="attribute"` | `Content/Resources/config/routes.xml:7-11` | `<import resource="../../Media/SalesChannel/**/*Route.php" type="attribute" />` |
| Core registers route services `public="true"`; decorators use `decorates=` + `.inner` | `Content/DependencyInjection/product.xml:411-431` | `<service id="…ResolveCriteriaProductListingRoute" decorates="…ProductListingRoute" decoration-priority="-2000" public="true">` |
| A production route confirming the full contract, with `_entity` and `_httpCache` | `Content/Product/SalesChannel/Listing/ProductListingRoute.php:29,57-63` | `defaults: [PlatformRequest::ATTRIBUTE_ENTITY => ProductDefinition::ENTITY_NAME, PlatformRequest::ATTRIBUTE_HTTP_CACHE => true]` |
| 6.6 vs 6.7: the v6.6.10.0 stub uses raw strings, otherwise identical | `https://github.com/shopware/shopware/blob/v6.6.10.0/src/Core/Framework/Plugin/Command/Scaffolding/stubs/store-api-route.stub` | `#[Route(defaults: ['_routeScope' => ['store-api']])]` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| A dedicated framework base class/interface a store-api route must extend (`AbstractStoreApiRoute`, `StoreApiController`) | absent | No such type; the route extends only its own plugin-local abstract class — `Framework/Plugin/Command/Scaffolding/stubs/store-api-abstract-route.stub:9` |
| The abstract-route + `getDecorated()` pattern is enforced by the framework | absent | `getDecorated()` is on no framework interface; nothing in `RouteScopeListener`, the value resolvers or the response listener calls it. It is a convention enabling Symfony decoration — `Content/Product/SalesChannel/Listing/AbstractProductListingRoute.php:14-18` |
| `StoreApiResponse` is abstract | absent | `class StoreApiResponse extends Response` — concrete — `System/SalesChannel/StoreApiResponse.php:14` |
| A plugin's store-api route is reachable while installed but not activated | contradicted | `Plugin::configureRoutes()` returns early when `!isActive()` — `Framework/Plugin.php:70-77` |
| Core's scaffolded stub is runnable as generated | contradicted | The stub's `load()` takes a `Criteria` but sets no `_entity` default, so `CriteriaValueResolver` throws. Same omission at v6.6.10.0 — `stubs/store-api-route.stub:22-30` vs `Framework/Routing/Annotation/CriteriaValueResolver.php:37-42` |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| The generator core itself uses to produce a store-api route (the dist package ships no `Test/` tree) | `Framework/Plugin/Command/Scaffolding/Generator/StoreApiRouteGenerator.php:66-81` |
| A production core route exercising the full contract | `Content/Product/SalesChannel/Listing/ProductListingRoute.php:57-64` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| `routes.xml` with `type="annotation"` stopped loading after the Symfony 7 move; resolution was `type="attribute"` plus `Routing\Attribute\Route` | 6.6 | closed | https://forum.shopware.com/t/controller-routes-in-shopware-6-6-0-0-rc3/103029 |
| A plugin store-api route never appears in `debug:router`; no confirmed resolution in the thread | 6.x (2024) | open | https://forum.shopware.com/t/plugin-api-route-wird-nicht-gefunden/104501 |
| A shipped route threw "Invalid route scope for route store-api.shopping-list.change-name" | 6.7.0 | closed | https://github.com/shopware/shopware/issues/7865 |
| Dropping the `#[Route]` attribute from a decorator moved the path back to core's route — the attribute, not the decoration, binds the path | 6.6.10.19 | closed | https://github.com/shopware/shopware/issues/17552 |
| Headless installs break when route helpers reference Storefront classes | unclear | closed | https://github.com/shopware/shopware/issues/13852 |
| Docs reported to mix attributes and annotations in route examples | 6.5 era | closed | https://github.com/shopware/docs/issues/1224 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| `attribute` or `annotation` loader in 6.7? | code | `attribute` — core's `Content/Resources/config/routes.xml:7-11` and the scaffolding's routes.xml entry |
| Which `Route` class is imported? | code | `Symfony\Component\Routing\Attribute\Route`, in both 6.6 and 6.7 stubs |
| Raw `'_routeScope' => ['store-api']` or the constants? | code | Both; `ATTRIBUTE_ROUTE_SCOPE === '_routeScope'` and `StoreApiRouteScope::ID === 'store-api'`. 6.6 stub raw, 6.7 stub constants |
| Is the abstract route + `getDecorated()` required? | code | Not enforced by the framework; it is core's convention and the only thing that makes the route decoratable |
| Where must the plugin routes file live? | code | `<plugin>/src/Resources/config/routes*` — `Framework/Bundle.php:78-88`; nothing is imported while the plugin is inactive |
| Is `_entity` / `_httpCache` required or supported? | code | `_entity` is required whenever a `Criteria` argument is used; `_httpCache` is optional and present on core routes in 6.7.13.0 |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| Abstract class + concrete class so the route can be decorated | "we use abstract classes to make our routes more decoratable" | add-store-api-route.md:22 | yes as convention — not framework-enforced |
| The abstract class holds `getDecorated()` and `load(Criteria, SalesChannelContext)` | "This class has to contain a method `getDecorated` and a method `load`…" | add-store-api-route.md:30 | yes — `store-api-abstract-route.stub:9-13` |
| Class-level scope attribute with the constants | "#[Route(defaults: [PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [StoreApiRouteScope::ID]])]" | add-store-api-route.md:71 | yes — `store-api-route.stub:13` |
| The scope attribute is required on each route class or API method | "Each route class or API method requires the attribute…" | store-api/index.md:19 | yes — `RouteScopeListener.php:104-116` |
| `getDecorated()` must throw `DecorationPatternException` | "must throw a `DecorationPatternException` because it has no decoration yet" | add-store-api-route.md:96 | yes — `store-api-route.stub:20-23` |
| `_entity` "just marks the entity that the api will return" | "The `_entity` in the defaults of the `Route` attribute just marks the entity…" | add-store-api-route.md:98 | partially — it is what `CriteriaValueResolver` requires to build a `Criteria`; without it the request throws |
| Response extends `StoreApiResponse`, inheriting `$object` of type `EntitySearchResult` | "consequently inheriting a property `$object` of type `…EntitySearchResult`" | add-store-api-route.md:122 | partially — the property is typed `Struct`, not `EntitySearchResult` |
| The route is registered as a service in a PHP `ContainerConfigurator` | "$services->set(ExampleRoute::class)->args([service('swag_example.repository')]);" | add-store-api-route.md:113-114 | not as the only form — 6.7 scaffolding emits a `services.xml` entry |
| Discovery needs `routes.php` at `src/Resources/config/` importing with the attribute loader | "$routes->import('../../Core/**/*Route.php', 'attribute');" | add-store-api-route.md:149,160 | yes — `Framework/Bundle.php:78-88` |
| Service registration and route import are separate concerns | "a route class can be present and correctly registered as a service without becoming a Store API endpoint" | add-store-api-route.md:151 | yes — the import is what binds the attributes |
| A route must return a `StoreApiResponse` and may contain only one object | "A route response can only contain one object." | store-api/index.md:24-27 | yes — `StoreApiResponse::__construct(protected Struct $object)` |
| The Store API is publicly accessible, needing only contextual headers | "the Store API is publicly accessible and only requires contextual headers" | concepts/api/index.md:17 | partially — `StoreApiRouteScope::isAllowed()` requires a `SalesChannelApiSource` unless `auth_required` is false |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| Response `$object` is of type `EntitySearchResult` | The property is `protected Struct $object`; any Struct is accepted | `System/SalesChannel/StoreApiResponse.php:14-32` |
| Service registration is shown only as `services.php` | 6.7.13.0 scaffolding still emits a `services.xml` entry for the generated route | `Framework/Plugin/Command/Scaffolding/Generator/StoreApiRouteGenerator.php:24-30` |
| `_entity` "just marks the entity that the api will return" | It is load-bearing: without it a `Criteria` argument cannot be resolved and the request throws `missingRouteAttribute` | `Framework/Routing/Annotation/CriteriaValueResolver.php:37-42` |
| The docs do not mention that an inactive plugin exposes no routes | `Plugin::configureRoutes()` returns early when the plugin is inactive | `Framework/Plugin.php:70-77` |
| The docs do not mention `auth_required` | A store-api route is only reachable with a sales-channel Context source unless `auth_required => false` is declared | `Framework/Routing/StoreApiRouteScope.php:20-34` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| An abstract route class declaring `getDecorated()` and `load()`, implemented with a `#[Route]` attribute whose defaults set the `store-api` route scope (`'_routeScope' => ['store-api']` or the `StoreApiRouteScope::ID` constant — both correct) and a `/store-api/...` path. | rewritten | Kept — code confirms both scope forms are literally equal and shows 6.6 uses the raw strings, 6.7 the constants. Added the mandatory `/store-api` path prefix and the request-time `invalidRouteScope` failure, and marked `getDecorated()` as convention rather than framework requirement |
| The route returns a `StoreApiResponse` wrapping a `Struct`. | rewritten | Confirmed and extended with the automatic JSON encoding in `StoreApiResponseListener` and the `_entity` default a `Criteria` argument requires — the latter breaks even core's own stub |
| Decorate via the `getDecorated()` pattern rather than overriding, to keep the decoration chain intact. (Service registration is `services.php` on 6.7 and `services.xml` on 6.6 — neither is wrong.) | removed | The decoration half is folded into fact 1; the parenthetical is a tolerance clause the code lane did not support — 6.7.13.0 scaffolding itself emits `services.xml`. Replaced by the discovery fact (routes file + attribute loader + plugin must be active), which the code lane shows actually decides whether the endpoint exists |
