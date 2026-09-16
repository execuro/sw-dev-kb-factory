---
id: platform/dev/6.6/guides/plugins/plugins/storefront/add-custom-controller.md
title: Add custom controller
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/storefront/add-custom-controller.html
sourceHash: b9b2da8bc79993cca6cd403592d183496e1e6493
keywords: ["custom controller", "StorefrontController", "Route attribute", "_routeScope", "routes.xml", "renderStorefront", "services.xml controller", "route naming prefix", "RouteScope deprecated", "storefront route"]
summary: "How to create a custom Storefront controller: extend StorefrontController, define a routed method, register services.xml and routes.xml."
lastBuilt: "2026-09-15"
---
## What it is

Explains how to create a custom Storefront controller by extending `StorefrontController`, defining a route, and registering it.

## Key steps / config

1. Create a controller extending `Shopware\Storefront\Controller\StorefrontController`, with `_routeScope` set via the `Route` attribute (required on every route; here `storefront`):

```php
#[Route(defaults: ['_routeScope' => ['storefront']])]
class ExampleController extends StorefrontController
{
    #[Route(path: '/example', name: 'frontend.example.example', methods: ['GET'])]
    public function showExample(): Response
    {
        return $this->renderStorefront('@SwagBasicExample/storefront/page/example.html.twig', [
            'example' => 'Hello world'
        ]);
    }
}
```

Route names should use one of the prefixes `frontend`, `widgets`, `payment`, `api`, or `store-api` depending on the route's purpose. `_routeScope` can also be set per-route instead of on the class.

2. Register the controller in `services.xml`, public, with `setContainer`/`setTwig` calls:

```xml
<service id="Swag\BasicExample\Storefront\Controller\ExampleController" public="true">
    <call method="setContainer">
        <argument type="service" id="service_container"/>
    </call>
    <call method="setTwig">
        <argument type="service" id="twig"/>
    </call>
</service>
```

3. Register a `routes.xml` at `<plugin root>/src/Resources/config/` importing the controller:

```xml
<routes xmlns="http://symfony.com/schema/routing"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://symfony.com/schema/routing
        https://symfony.com/schema/routing/routing-1.0.xsd">
    <import resource="../../Storefront/Controller/*Controller.php" type="attribute" />
</routes>
```

4. Add the corresponding Twig template, e.g. extending `base.html.twig` and overriding `base_content`.

## Essential identifiers

- `Shopware\Storefront\Controller\StorefrontController`
- Route defaults key `_routeScope`
- `renderStorefront()`
- `routes.xml`, `services.xml`
- Route name prefixes: `frontend`, `widgets`, `payment`, `api`, `store-api`

## Gotchas

Prior to Shopware 6.4.11.0, `_routeScope` was configured via the `@RouteScope` annotation; that annotation-based way is deprecated as of the 6.5 major version.

## Version notes

`_routeScope` route-default configuration (as shown) replaces the `@RouteScope` annotation used before Shopware 6.4.11.0; the annotation form is deprecated starting with the 6.5 major.
