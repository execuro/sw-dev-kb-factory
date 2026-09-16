# `dev-49` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-49` · `dev` · `Core breaking changes` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0921-42-51` |
| Core version | `6.7.13.0` |

**Query:** My storefront controller still uses the `@Route` and `@RouteScope` annotations from 6.4 — what is the attribute form in Shopware 6.7 and how are the routes wired?

**Expected answer — every fact an answer must contain:**

1. The Route class is imported from `Symfony\Component\Routing\Attribute\Route` and the scope is a `#[Route]` default, normally on the class: `#[Route(defaults: [PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [StorefrontRouteScope::ID]])]` (`_routeScope` => `['storefront']`); no `RouteScope` annotation or attribute class exists in 6.7, and a missing scope makes `RouteScopeListener::checkScope()` throw at runtime. `[code: Storefront/Controller/AccountOrderController.php:43,49 (shopware/storefront)]` `[code: PlatformRequest.php:77]` `[code: Framework/Routing/RouteScopeListener.php:104-115]`
2. Routes are wired by a route file under the plugin's `Resources/config/` matching the `{routes}` glob — `routes.php`, `routes.xml`, `routes.yaml` or `routes.yml` all work, since `Bundle::configureRoutes()` globs with `Kernel::CONFIG_EXTS = '.{php,xml,yaml,yml}'` — that imports the controller files with the **`attribute`** loader type; the controller must also be a public service with `setContainer` called on it. A 6.4-era `type="annotation"` import throws `LoaderLoadException` on symfony/routing 7.4, which ships no annotation loader. `[code: Framework/Bundle.php:78-87]` `[code: Kernel.php:40]` `[code: Storefront/Resources/config/routes.xml:8-9 (shopware/storefront)]` `[code: Storefront/DependencyInjection/controller.php:147-155 (shopware/storefront)]` `[code: vendor/symfony/routing/Loader/AttributeFileLoader.php:64-67]`
3. The storefront route **name** must start with `frontend.`, `widgets.` or `payment.` — the only three prefixes `Router::isStorefrontRoute()` accepts — or be listed verbatim under the `storefront.router.allowed_routes` config key (exact-name allow list, added in 6.7.2.0). `api` and `store-api` are URL **path** prefixes of a different mechanism and are not storefront route-name prefixes. `[code: Storefront/Framework/Routing/Router.php:198-207 (shopware/storefront)]` `[code: Storefront/DependencyInjection/Configuration.php:39-46 (shopware/storefront)]`

**Trap:** `@RouteScope` / `@Route` annotations were replaced by PHP attributes and the route-scope default; the query deliberately names the annotation form.

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/plugins/storefront/controllers/add-custom-controller.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| Storefront controllers import the Symfony attribute class, not the annotation class | `Storefront/Controller/AccountOrderController.php:43` (shopware/storefront) | `use Symfony\Component\Routing\Attribute\Route;` |
| The scope is a class-level `#[Route]` default, not a separate annotation | `Storefront/Controller/AccountOrderController.php:49` | `#[Route(defaults: [PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [StorefrontRouteScope::ID]])]` |
| `ATTRIBUTE_ROUTE_SCOPE` is `_routeScope` | `PlatformRequest.php:77` | `public const ATTRIBUTE_ROUTE_SCOPE = '_routeScope';` |
| The storefront scope id is `storefront` | `Storefront/Framework/Routing/StorefrontRouteScope.php:12-15` | `final public const ID = 'storefront';` |
| Other former annotations are now defaults keys | `PlatformRequest.php:75-83` | `_loginRequired`, `_loginRequiredAllowGuest`, `_noStore`, `_acl`, `_captcha` |
| Core storefront imports controller files with the `attribute` loader type | `Storefront/Resources/config/routes.xml:8-9` | `<import resource="../../Controller/**/*Controller.php" type="attribute" />` |
| Any bundle/plugin's `Resources/config/{routes}*` is globbed automatically | `Framework/Bundle.php:78-87` | `$routes->import($confDir . '/{routes}' . Kernel::CONFIG_EXTS, 'glob');` |
| The glob accepts php/xml/yaml/yml, so `routes.php` is loaded exactly like `routes.xml` | `Kernel.php:40` | `final public const CONFIG_EXTS = '.{php,xml,yaml,yml}';` |
| Scope enforcement is runtime, on `kernel.controller` | `Framework/Routing/RouteScopeListener.php:104-115` | `throw RoutingException::invalidRouteScope($currentRequest->attributes->get('_route'));` |
| Scope objects are collected via the `shopware.route_scope` tag | `Framework/DependencyInjection/services.xml:577-578` | `<argument type="tagged_iterator" tag="shopware.route_scope"/>` |
| A PHPStan rule fails any controller method with no class- or method-level scope | `DevOps/StaticAnalyze/PHPStan/Rules/RouteScopeRule.php:67-79` | `'Method %s::%s() has no route scope defined. …'` |
| Storefront route-name prefixes are exactly three, in the storefront Router | `Storefront/Framework/Routing/Router.php:198-207` | `str_starts_with($name, 'frontend.') \|\| str_starts_with($name, 'widgets.') \|\| str_starts_with($name, 'payment.')` |
| The prefix decides URL **generation** (sales-channel base URL splicing), not registration | `Storefront/Framework/Routing/Router.php:99-101` | `if (!$this->isStorefrontRoute($name)) { return $this->decorated->generate(...); }` |
| `api` / `store-api` are path prefixes from a separate mechanism | `Framework/DependencyInjection/CompilerPass/RouteScopeCompilerPass.php:25-28` | `$container->setParameter('shopware.routing.registered_api_prefixes', $apiPrefixes);` |
| `storefront.router.allowed_routes` exists in 6.7.13.0 as an exact-name allow list | `Storefront/DependencyInjection/Configuration.php:39-46`; `Storefront/DependencyInjection/services.php:285-291` | `->arrayNode('allowed_routes')->prototype('string')` ; `param('storefront.router.allowed_routes')` |
| It was introduced in 6.7.2.0 | `changelog/release-6-7-2-0/2025-08-04-allow-storefront-routes-without-prefix.md`; absent from `Configuration.php` @ v6.7.1.0 | "allows the usage of routes without the `frontend`, `widgets` or `payment` prefix" |
| Core registers storefront controllers public with `setContainer` | `Storefront/DependencyInjection/controller.php:147-155` | `$services->defaults()->public(); … ->call('setContainer', [service('service_container')]);` |
| `setContainer` is Symfony's `AbstractController::setContainer`; `StorefrontController extends AbstractController` | `Storefront/Controller/StorefrontController.php:40`; `vendor/symfony/framework-bundle/Controller/AbstractController.php:61-70` | `abstract class StorefrontController extends AbstractController` |
| The 6.7 `plugin:create` scaffold emits `type="attribute"` and a public service with `setContainer` | `Framework/Plugin/Command/Scaffolding/Generator/StorefrontControllerGenerator.php:25-33,35-39` | `<import resource="../../Storefront/Controller/**/*Controller.php" type="attribute" />` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| A `Shopware\Core\Framework\Routing\Annotation\RouteScope` attribute/annotation class | absent | `Framework/Routing/Annotation/` holds only `CriteriaValueResolver.php`; `Framework/Routing/RouteScope.php:9-24` is a service scope object, not an attribute class |
| Shopware still loads routes with the `annotation` loader type | absent | no `type="annotation"` anywhere under `vendor/shopware/`; all imports use `type="attribute"` |
| `Symfony\Component\Routing\Annotation\Route` is a usable class here | absent | symfony/routing 7.4 ships it only as an `if (false)` stub, deprecated since 7.4 (`vendor/symfony/routing/Annotation/Route.php:12-25`) |
| symfony/routing 7.4 still accepts `type="annotation"` in an import | absent | no `AnnotationFileLoader`/`AnnotationDirectoryLoader` in 7.4.15; every `supports()` accepts only `'attribute'`; `Loader::resolve()` throws `LoaderLoadException` (`vendor/symfony/config/Loader/Loader.php:58-71`) |
| `StorefrontRouteScope::getRoutePrefixes()` holds the storefront name prefixes | absent | `StorefrontRouteScope` declares only `ID`, `isAllowed()`, `getId()`; inherited `AbstractRouteScope::getRoutePrefixes()` returns `[]` |
| A single enforced list `frontend, widgets, payment, api, store-api` | absent | no such list in code; three are route-name prefixes in `Router::isStorefrontRoute()`, two are path prefixes from `ApiRouteScope::ALLOWED_PATH` / `StoreApiRouteScope::ALLOWED_PATH` |
| The 6.7 (or current 6.6) `plugin:create` scaffold emits `type="annotation"` (issue #3582) | absent | the heredoc reads `type="attribute"` at 6.7.13.0 and byte-identically at upstream v6.6.10.0 |
| An automated test covers `storefront.router.allowed_routes` | absent | no `RouterTest.php` under `src/Storefront`; GitHub code search for `allowed_routes` in PHP returns nothing |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| Removing `_routeScope` from the request attributes makes `RouteScopeListener` throw | `tests/integration/Core/Framework/Routing/RouteScopeListenerTest.php` @ v6.7.13.0 (`testRouteScopeListenerFailsHardWithoutAnnotation`) |
| Scope is a list of scope ids under `_routeScope` | same file, `createRequest()` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| `plugin:create` scaffolds `routes.xml` with `type="annotation"`; reporter asks for `type="attribute"` and a docs fix | 6.6 | closed | https://github.com/shopware/shopware/issues/3582 |
| Core controller still importing `Routing\Annotation\Route` | 6.6 | closed | https://github.com/shopware/shopware/issues/3590 |
| Mass `@RouteScope` deprecation warnings from plugins once `V6_5_0_0` is on | 6.4 | closed | https://github.com/shopware/shopware/issues/2528 |
| Request for PHP 8 attribute forms; `RouteScope` was annotation-only at 6.4.8.1 | 6.4 | closed | https://github.com/shopware/shopware/issues/2377 |
| ADR/changelog dating the move of route config into Route defaults (6.4.11.0) | 6.4 | closed | https://developer.shopware.com/docs/resources/references/adr/2022-02-09-controller-configuration-route-defaults.html |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Does `Framework\Routing\Annotation\RouteScope` still exist in 6.7? | code lane | No — absent; only the non-attribute scope service class remains |
| Is the scope read from `_routeScope` in `#[Route(defaults: …)]`, and as array or string? | code lane | Yes, `_routeScope`, an array of scope ids |
| Which Route namespace do 6.7 storefront controllers import? | code lane | `Symfony\Component\Routing\Attribute\Route` |
| Does `plugin:create` still scaffold `type="annotation"` in 6.7 (#3582)? | deep pass | No — `type="attribute"` at 6.7.13.0 and at upstream v6.6.10.0; the report does not apply to a current tree |
| Does Symfony's loader in 6.7 still accept `type="annotation"`? | deep pass | No — no annotation loader in symfony/routing 7.4.15; the import throws `LoaderLoadException` |
| Which class enforces the storefront name prefixes, and what is the set? | deep pass | `Router::isStorefrontRoute()`; exactly `frontend.`, `widgets.`, `payment.` |
| Does `storefront.router.allowed_routes` exist, and is the 6.7.2.0 claim right? | deep pass | Yes and yes — exact-name allow list, absent at v6.7.1.0, changelog in release-6-7-2-0 |
| Must the controller be a public service with `setContainer`? | deep pass | Yes — how core and the scaffold both register it |
| Must the route file be `routes.xml`? | deep pass | No — `routes.php`/`.yaml`/`.yml` are globbed identically |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| Scope is defined via `Route` `defaults`/`_routeScope` and must be set for every route | "needs to be set for every route" | add-custom-controller.md:29 | yes — `RouteScopeListener.php:104-115`, `RouteScopeRule.php:67-79` |
| Example imports the `Attribute\Route` namespace | `use Symfony\Component\Routing\Attribute\Route;` | add-custom-controller.md:53 | yes — `AccountOrderController.php:43` |
| Class-level scope form | `#[Route(defaults: [PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [StorefrontRouteScope::ID]])]` | add-custom-controller.md:55 | yes — `AccountOrderController.php:49` |
| Scope may alternatively be declared per route method | "It is also possible to define the `_routeScope` per route." | add-custom-controller.md:108 | yes — `RouteScopeRule.php:67-79` accepts either |
| `@RouteScope` is "deprecated for the 6.5 major version"; no removal version stated | see quote | add-custom-controller.md:37-38 | no — code shows it is gone in 6.7; docs never say when |
| Routes wired by a public service with `setContainer` called on it | "the `call` method … necessary in order to set the DI container" | add-custom-controller.md:168 | yes — `controller.php:147-155`; `AbstractController::setContainer` |
| Routes discovered by `routes.php` importing controllers with the `attribute` type | `$routes->import('../../Storefront/Controller/*Controller.php', 'attribute');` | add-custom-controller.md:186 | yes — `routes.php` is globbed via `Kernel::CONFIG_EXTS`; `attribute` type confirmed |
| Route names must use `frontend`, `widgets`, `payment`, `api` or `store-api` | see quote | add-custom-controller.md:101-102 | partly — only the three name prefixes exist; `api`/`store-api` are path prefixes |
| Since 6.7.2.0 unprefixed names can be allowed via `storefront.router.allowed_routes` | "This feature is available since Shopware 6.7.2.0" | add-custom-controller.md:251 | yes — `Configuration.php:39-46`, changelog release-6-7-2-0 |
| Coding guideline: the class requires the scope Route attribute | see docs lane | storefront-controller.md:21 | yes — `AccountOrderController.php:49` |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| `@RouteScope` is "deprecated for the 6.5 major version" (present tense, still readable as available) | No such annotation class exists in 6.7 at all | `Framework/Routing/Annotation/` (only `CriteriaValueResolver.php`); `Framework/Routing/RouteScope.php:9-24` |
| Route names should use `frontend`, `widgets`, `payment`, `api` or `store-api` — one list | Two unrelated mechanisms: three route-**name** prefixes in `Router::isStorefrontRoute()`, and `api`/`store-api` as URL **path** prefixes feeding `shopware.routing.registered_api_prefixes` | `Storefront/Framework/Routing/Router.php:198-207`; `Framework/Routing/ApiRouteScope.php:16`; `Framework/Routing/StoreApiRouteScope.php:16` |
| Docs show `routes.php` as the route file; core ships `routes.xml` | Both load — `Bundle::configureRoutes()` globs `{routes}` with `.{php,xml,yaml,yml}`; XML is convention, and symfony/routing 7.4 now deprecates the XML format itself | `Framework/Bundle.php:78-87`; `Kernel.php:40`; `vendor/symfony/routing/Loader/XmlFileLoader.php:45` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| The route scope is a class-level attribute: `#[Route(defaults: [PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [StorefrontRouteScope::ID]])]` on a class extending `Shopware\Storefront\Controller\StorefrontController`; the `@RouteScope` annotation is deprecated since the 6.5 major. | rewritten | the attribute form is confirmed, but "deprecated since the 6.5 major" is a docs claim the code disproves for 6.7 — no `RouteScope` annotation/attribute class exists at all; the Symfony `Attribute\Route` import and the runtime enforcement point were missing |
| Route names must use one of the prefixes `frontend`, `widgets`, `payment`, `api` or `store-api`, or be listed under `storefront.router.allowed_routes` (available since 6.7.2.0). | rewritten | `Router::isStorefrontRoute()` accepts exactly `frontend.`, `widgets.`, `payment.`; `api`/`store-api` are URL path prefixes of a separate mechanism and never route-name prefixes. The `allowed_routes` clause and its 6.7.2.0 pin are confirmed and kept, with "exact-name allow list" made explicit |
| Routes are imported from `PLUGIN_ROOT/src/Resources/config/routes.php` via `$routes->import('../../Storefront/Controller/*Controller.php', 'attribute')`, and the controller is registered public with `setContainer` in `services.php`. | rewritten | both halves are confirmed, but the fact over-pinned the filename: `Kernel::CONFIG_EXTS = '.{php,xml,yaml,yml}'` makes `routes.php`/`.xml`/`.yaml`/`.yml` equivalent. Added the load-bearing breaking change the query asks about — `type="annotation"` now throws `LoaderLoadException` on symfony/routing 7.4 |
