# `gap-01` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `gap-01` · `gap` · `Gap` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0959-92-100` |
| Core version | `6.7.13.0` |

**Query:** How do I add my own Admin API endpoint under `/api/...` from a plugin — a controller with the api route scope and its ACL?

**Expected answer — every fact an answer must contain:**

1. States that the documentation corpus has no guide for adding a plugin controller under `/api/...` with the api route scope: guides exist for Storefront controllers and Store API routes only, and `api` as a `_routeScope` value appears nowhere in it.  `[docs-only]`
2. Names the closest pages actually present — the Store API route guide, the Storefront custom-controller guide, and the 2022 route-defaults ADR that lists `@Acl` → `_acl` and `@RouteScope` → `_routeScope` — without presenting any of them as documentation of the Admin API case.  `[docs-only]`
3. Invents no `#[RouteScope]` or `#[Acl]` PHP attribute class: in 6.7 both are Symfony `#[Route]` defaults — `PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [ApiRouteScope::ID]` (`'api'`, mandatory — a route with no scope attribute is rejected with `invalidRouteScope`) and `PlatformRequest::ATTRIBUTE_ACL => ['<privilege>']`, enforced by the core-registered `AclAnnotationValidator`.  `[code: Framework/Api/Controller/AclController.php:19,33-41]`

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/plugins/framework/store-api/add-store-api-route.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| The api scope is a `#[Route]` default on the controller class | `Framework/Api/Controller/AclController.php:19` | `#[Route(defaults: [PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [ApiRouteScope::ID]])]` |
| The attribute keys are constants | `PlatformRequest.php:75-77` | `public const ATTRIBUTE_ACL = '_acl';` / `public const ATTRIBUTE_ROUTE_SCOPE = '_routeScope';` |
| `ApiRouteScope::ID` is `'api'`; the scope admits only `AdminApiSource` (or `SystemSource` when `auth_required=false`) | `Framework/Routing/ApiRouteScope.php:15,30,33` | `final public const ID = 'api';` … `return $context->getSource() instanceof AdminApiSource;` |
| A route without `_routeScope` is rejected outright — the default is mandatory | `Framework/Routing/RouteScopeListener.php:111-116` | `throw RoutingException::invalidRouteScope($currentRequest->attributes->get('_route'));` |
| ACL is enforced per route by `AclAnnotationValidator` on `KernelEvents::CONTROLLER` | `Framework/Api/Acl/AclAnnotationValidator.php:41-69` | `if (!$context->isAllowed($privilege)) { throw ApiException::missingPrivileges([$privilege]); }` |
| The validator is wired in core with `kernel.event_subscriber` — a plugin activates nothing | `Framework/DependencyInjection/acl.xml:22-25` | `<tag name="kernel.event_subscriber"/>` |
| Per-method declaration: `_acl` is a plain string list alongside `auth_required` | `Framework/Api/Controller/AclController.php:33-41` | `PlatformRequest::ATTRIBUTE_ACL => ['api_acl_privileges_get'],` |
| Plugin routes are imported from `<bundle>/Resources/config/routes.*` | `Framework/Bundle.php:78-87` | `$routes->import($confDir . '/{routes}/*' . Kernel::CONFIG_EXTS, 'glob');` |
| Controllers are loaded attribute-based | `Framework/Resources/config/routes.xml:7` | `<import resource="../../Api/Controller/**/*Controller.php" type="attribute" />` |
| Route-only privileges surface to the admin as "additional privileges" | `Framework/Api/Controller/AclController.php:102` | `$acl = $route->getDefault(PlatformRequest::ATTRIBUTE_ACL);` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| A dedicated `#[RouteScope]` or `#[Acl]` PHP attribute class in 6.7 | absent | `Framework/Routing/RouteScope.php:12-15` is an `AbstractRouteScope` implementation, not an attribute; no `Acl` attribute class exists. Scope and ACL travel only as Route defaults. |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| `_acl` in Route attributes is the sanctioned mechanism — a PHPStan rule validates the privilege strings | `DevOps/StaticAnalyze/PHPStan/Rules/AclValidPermissionsInRouteAttributesRule.php` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| Custom `/api/...` controller 404'd after 6.6 until redeclared with `#[Route(defaults: ['_routeScope' => ['api'], …])]` | 6.6 | closed | forum.shopware.com/t/…/103684 |
| shopware/docs issue: the ACL guide documents only the administration (JS) side, omitting the PHP privilege registration | unclear | closed | github.com/shopware/docs/issues/775 |
| Non-entity "additional" privilege silently dropped on role save | 6.6.10.2 | closed | github.com/shopware/shopware/issues/7697 |
| Privileges added via `enrichPrivileges()` missing from the "all" permission set of a new role | unclear | closed | github.com/shopware/shopware/issues/4087 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Is `_routeScope` still read from Route defaults in 6.7, or is there a separate attribute? | code | Route defaults only; no attribute class exists (`AclController.php:19`, `RouteScope.php:12-15`). |
| Which class enforces ACL on an Admin API controller in 6.7? | code | `AclAnnotationValidator`, reading the `_acl` request attribute (`AclAnnotationValidator.php:41-69`). |
| Is the PHP attribute the only route ACL mechanism, or is there config-file wiring? | code | `_acl` Route default; the PHPStan rule is its only other consumer. |
| How must a plugin register a custom privilege so it can be granted in a role? | not settled | Code lane did not trace into the administration bundle; not load-bearing for the facts above. |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| A route scope must be defined via Route defaults for every route; examples name only storefront and store-api | "needs to be set for every route" | `guides/plugins/plugins/storefront/controllers/add-custom-controller.md:29` | yes — `RouteScopeListener.php:111-116` |
| The Store API guide sets the scope via `PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [StoreApiRouteScope::ID]`; no `ApiRouteScope` example exists | `#[Route(defaults: [PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [StoreApiRouteScope::ID]])]` | `…/store-api/add-store-api-route.md:71` | yes — same shape with `ApiRouteScope::ID` in core |
| An ADR records `@Acl` → `_acl` and `@RouteScope` → `_routeScope` | "`@Acl` -> `_acl` … `@RouteScope` -> `_routeScope`" | `resources/references/adr/2022-02-09-controller-configuration-route-defaults.md:53-59` | yes |
| Custom privileges are registered server-side by overriding `Plugin::enrichPrivileges()` | "override the `enrichPrivileges` method and return a list of your custom privileges" | `…/permissions-error-handling/add-acl-rules.md:419-421` | not checked by the code lane |
| Administration privileges are UI-level only; API permissions are `entity_name:operation` | "these combinations are not API permissions" | `…/add-acl-rules.md:56` | partially — route `_acl` privileges are free-form strings, not entity:operation |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| The corpus documents route scopes only for storefront and store-api; no page covers the `api` scope | `ApiRouteScope::ID = 'api'` is a first-class scope with the same Route-defaults mechanism | `Framework/Routing/ApiRouteScope.php:15` |
| The ACL guide presents API permissions as `entity_name:operation` | Route-level `_acl` privileges are arbitrary strings validated only against the registered privilege set | `Framework/Api/Controller/AclController.php:33-41,102` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| States that the source has a Store API route guide but no equivalent guide for adding an Admin API route from a plugin. | rewritten | Kept, sharpened with what the docs lane actually established: `api` as a `_routeScope` value occurs nowhere in the corpus. |
| Names the closest page actually read (the Store API route guide and/or the storefront controller guide) as the nearest pattern, without presenting it as documentation of the admin case. | rewritten | Adds the route-defaults ADR, which the docs lane found and which is the nearest thing to admin-scope material. |
| Invents no admin route scope constant, tag or ACL attribute as if it were documented. | rewritten | Code settles what the real mechanism is, so the fact now states it positively instead of only forbidding invention. |
