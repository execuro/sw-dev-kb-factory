---
id: platform/dev/6.6/guides/plugins/plugins/plugin-fundamentals/adjusting-service.md
title: Adjusting a service
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceHash: c7c809b0ccf4cc5faefb92694cac0f37ed3e040f
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/plugin-fundamentals/adjusting-service.html
keywords: ["service decoration", "decorates", "getDecorated", "DecorationPatternException", "AbstractExampleService", "ExampleServiceDecorator", ".inner", "services.xml", "abstract class", "decorator pattern"]
summary: "Decorate an existing service by declaring decorates on a new service and implementing an abstract getDecorated() method."
lastBuilt: "2026-09-15"
---
## What it is

A guide on adjusting/extending an existing service using Symfony's service decoration pattern.

## When to use

Use this to modify or extend behavior of a service (from Shopware core or another plugin) without altering the original class.

## Key steps / config

1. Declare the decorator service with `decorates` pointing to the target, and pass the original via `.inner`:

```xml
<services>
    <service id="Swag\BasicExample\Service\ExampleService" />
    <service id="Swag\BasicExample\Service\ExampleServiceDecorator" decorates="Swag\BasicExample\Service\ExampleService">
        <argument type="service" id="Swag\BasicExample\Service\ExampleServiceDecorator.inner" />
    </service>
</services>
```

2. Define an abstract class with an abstract `getDecorated()` method returning its own type:

```php
abstract class AbstractExampleService
{
    abstract public function getDecorated(): AbstractExampleService;
    abstract public function doSomething(): string;
}
```

3. The base service extends the abstract class and throws `DecorationPatternException` from `getDecorated()` since it has no decoration yet.
4. The decorator extends the abstract class, accepts the decorated instance in its constructor, and returns it from `getDecorated()`.

## Essential identifiers

- `decorates` attribute
- `.inner` service reference suffix
- `getDecorated(): AbstractExampleService`
- `Shopware\Core\Framework\Plugin\Exception\DecorationPatternException`

## Gotchas

When adding new functions to a decoratable service, add them as normal (non-abstract) public functions first for backwards compatibility across multiple decorators, falling back to `getDecorated()->newMethod()`; only make the function abstract in a later release once every decorator implements it — adding it as abstract immediately causes errors for existing decorators that don't implement it yet.
