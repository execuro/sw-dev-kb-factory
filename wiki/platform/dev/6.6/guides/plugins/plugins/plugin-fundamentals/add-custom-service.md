---
id: platform/dev/6.6/guides/plugins/plugins/plugin-fundamentals/add-custom-service.md
title: Add custom service
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/plugin-fundamentals/add-custom-service.html
sourceHash: 611ec3032741f82b3e761ed4cce6950b18969435
keywords: ["custom service", "services.xml", "DI container", "dependency injection", "service container", "ExampleService", "plugin service", "Symfony service", "service id", "private services", "public services", "add-custom-service"]
summary: How to register a custom PHP service class in a Shopware 6 plugin via a services.xml file in the Symfony DI container.
lastBuilt: 2026-09-15
---
## What it is

This guide explains how to add a custom service to a Shopware 6 plugin using the Symfony Dependency Injection (DI) Container. A service is a plain PHP class that encapsulates reusable logic and is registered so the container can instantiate and inject it elsewhere.

## When to use

Use this when a plugin needs its own business-logic class (for example, a helper that performs an operation such as `doSomething()`) that other plugin code — subscribers, controllers, commands — should be able to obtain from the container rather than instantiate directly.

## Key steps / config

1. Create a plugin first (see the Plugin base guide) — this guide assumes one already exists.
2. Add a `services.xml` file at `<plugin root>/src/Resources/config/services.xml`. Shopware automatically loads a file with exactly this name from that directory.
3. Declare the service inside it:

```xml
<?xml version="1.0" ?>
<container xmlns="http://symfony.com/schema/dic/services"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xsi:schemaLocation="http://symfony.com/schema/dic/services http://symfony.com/schema/dic/services/services-1.0.xsd">
    <services>
        <service id="Swag\BasicExample\Service\ExampleService" />
    </services>
</container>
```

4. Create the corresponding PHP class at `<plugin root>/src/Service/ExampleService.php`, in namespace `Swag\BasicExample\Service`, e.g. a class `ExampleService` with a method `doSomething(): void`.

## Essential identifiers

- `services.xml` — `<plugin root>/src/Resources/config/services.xml`
- `Swag\BasicExample\Service\ExampleService` — example service class and its `id`
- schema `http://symfony.com/schema/dic/services/services-1.0.xsd`

## Gotchas

By default, all services declared in Shopware 6 are marked **private**. A private service can only be injected as a dependency of another service; it cannot be fetched directly from the container from outside.
