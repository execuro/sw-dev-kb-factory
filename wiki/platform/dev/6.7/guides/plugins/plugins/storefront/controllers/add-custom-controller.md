---
id: platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-controller.md
title: Add Custom Controller
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/controllers/add-custom-controller.html
sourceHash: 338b19be02546abf617fdaaa3045b81fc5d6a687
codeCheckedAgainst: "6.7.13.0"
keywords: ["StorefrontController", "renderStorefront", "StorefrontRouteScope::ID", "PlatformRequest::ATTRIBUTE_ROUTE_SCOPE", "_routeScope", "storefront.router.allowed_routes", "routes.php", "services.php", "setContainer", "frontend.example.example", "custom storefront route", "storefront controller"]
summary: "Add a Storefront controller: extend StorefrontController, set _routeScope storefront, register service with setContainer, import routes in routes.php."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-page.md", "platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-templates.md", "platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md"]
---
## What it is

How a plugin adds its own Storefront controller: the controller class with route attributes, its service definition, the route import, and the rendered Twig template.

## When to use

You need a new Storefront URL (e.g. `/example`) rendering your own template; also the first step of [creating a custom page](platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-page.md). Requires an existing plugin ([Plugin Base Guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md)).

## Key steps / config

1. **Controller** `<plugin root>/src/Storefront/Controller/ExampleController.php`, extending `Shopware\Storefront\Controller\StorefrontController`. The route scope must be set for every route (on the class, or per route via the `defaults` argument):
   ```php
   #[Route(defaults: [PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [StorefrontRouteScope::ID]])]
   class ExampleController extends StorefrontController
   {
       #[Route(path: '/example', name: 'frontend.example.example', methods: ['GET'])]
       public function showExample(Request $request, SalesChannelContext $context): Response
       {
           return $this->renderStorefront('@SwagBasicExample/storefront/page/example.html.twig', ['example' => 'Hello world']);
       }
   }
   ```
   Imports: `Shopware\Core\PlatformRequest`, `Shopware\Storefront\Framework\Routing\StorefrontRouteScope`, `Symfony\Component\Routing\Attribute\Route`. The `Request` and `SalesChannelContext` parameters are optional.
2. **Route names**: use a prefix matching the route's purpose (`frontend`, `widgets`, `payment`, `api`, `store-api`); only `frontend.`, `widgets.` and `payment.` identify a Storefront route.
3. **Service** in `src/Resources/config/services.php`:
   ```php
   $services->set(ExampleController::class)
       ->public()
       ->call('setContainer', [service('service_container')]);
   ```
4. **Route import** in `src/Resources/config/routes.php`; without it the controller exposes no URL:
   ```php
   $routes->import('../../Storefront/Controller/*Controller.php', 'attribute');
   ```
5. **Template** `src/Resources/views/storefront/page/example.html.twig` (see [Customize templates](platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-templates.md)):
   ```twig
   {% sw_extends '@Storefront/storefront/base.html.twig' %}
   {% block base_content %}...{% endblock %}
   ```
6. **Custom route names without prefix** (since 6.7.2.0): add `src/Resources/config/packages/storefront.yaml`
   ```yaml
   storefront:
       router:
           allowed_routes:
               - swag.test.foo-bar
   ```
   and load it in the plugin base class `build()` via a `DelegatingLoader` over `YamlFileLoader`/`GlobFileLoader`/`DirectoryLoader`, calling `$configLoader->load($confDir . '/{packages}/*.yaml', 'glob')`.

## Essential identifiers

- `Shopware\Storefront\Controller\StorefrontController`, `renderStorefront()`
- `PlatformRequest::ATTRIBUTE_ROUTE_SCOPE` (`_routeScope`), `StorefrontRouteScope::ID` (`storefront`)
- `storefront.router.allowed_routes`
- `setContainer`, `service_container`
- `routes.php`, `services.php`

## Gotchas

- The source prose mentions an `index.html.twig` in `views/storefront/page/example/`, but the controller example renders `@SwagBasicExample/storefront/page/example.html.twig`; the template file must match the path the controller passes.
- The `call('setContainer', ...)` in the service definition is necessary to set the DI container on the controller.

## Version notes

- Before 6.4.11.0 the scope used the `@RouteScope` annotation, deprecated for 6.5; use the `_routeScope` route default.
- `storefront.router.allowed_routes` is available since 6.7.2.0.

## Code check (6.7.13.0)
- confirmed `StorefrontController` — abstract base class — vendor/shopware/storefront/Controller/StorefrontController.php:40
- confirmed `StorefrontController::renderStorefront()` — `(string $view, array $parameters = []): Response` — vendor/shopware/storefront/Controller/StorefrontController.php:67
- confirmed `PlatformRequest::ATTRIBUTE_ROUTE_SCOPE` — value `_routeScope` — vendor/shopware/core/PlatformRequest.php:77
- confirmed `StorefrontRouteScope::ID` — value `storefront` — vendor/shopware/storefront/Framework/Routing/StorefrontRouteScope.php:14
- confirmed `allowed_routes` — config node under `storefront.router` — vendor/shopware/storefront/DependencyInjection/Configuration.php:42
- confirmed `storefront.router.allowed_routes` — injected into the Storefront Router — vendor/shopware/storefront/DependencyInjection/services.php:290
- confirmed `frontend.` — storefront routes are frontend./widgets./payment. prefixes or allowed routes — vendor/shopware/storefront/Framework/Routing/Router.php:204
- unverified `setContainer` — Symfony AbstractController method, vendor/symfony out of scope
