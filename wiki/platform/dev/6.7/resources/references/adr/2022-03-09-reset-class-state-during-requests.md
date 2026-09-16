---
id: platform/dev/6.7/resources/references/adr/2022-03-09-reset-class-state-during-requests.md
title: Use `ResetInterface` to reset instance state during requests
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-03-09-reset-class-state-during-requests.html
sourceHash: 90c6756ff32dc15e89685a14b790a643dab2910a
codeCheckedAgainst: "6.7.13.0"
keywords: ["ResetInterface", "Symfony\\Contracts\\Service\\ResetInterface", "kernel.reset", "reset()", "memoization", "instance state", "service reset", "IntegrationTestBehaviour", "roadrunner", "swoole", "long-running php", "adr"]
summary: "ADR: services memoizing data in instance properties implement Symfony ResetInterface reset() and get the kernel.reset tag so state clears between requests."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2022-03-09): any Shopware service that memoizes data in an instance variable must provide a way to reset it between requests, by implementing `\Symfony\Contracts\Service\ResetInterface` and tagging the service with `kernel.reset`.

## When to use

When writing a service that caches computed or fetched data in a property for reuse within a request. Classic PHP-FPM reboots the kernel per request, but application servers such as roadrunner or swoole share service instances across requests, and in the cloud the next request may belong to another shop/tenant, so unreset state would leak data from a different instance.

## Key steps / config

1. Implement `\Symfony\Contracts\Service\ResetInterface` and clear the memoized state in `public function reset(): void`:

```php
use Symfony\Contracts\Service\ResetInterface;

class FooService implements ResetInterface
{
    private array $data = [];

    public function getData(): array { /* memoize into $this->data */ }

    public function reset(): void
    {
        $this->data = [];
    }
}
```

2. Tag the service in the DI container (the same form core uses, e.g. in `product.xml`):

```xml
<service id="FooService">
    <tag name="kernel.reset" method="reset"/>
</service>
```

3. Exception: if the service already has an unrelated `reset` method, add a differently named method that clears the internal state and set that name in the tag's `method` attribute.

Symfony then resets the tagged services between requests automatically.

## Essential identifiers

- `\Symfony\Contracts\Service\ResetInterface`
- `public function reset(): void`
- `kernel.reset` (DI tag, attribute `method`)
- `IntegrationTestBehaviour`

## Gotchas

- The ADR says a hook in `IntegrationTestBehaviour` also resets this state between test cases, so tests should not use `Reflection` to overwrite private properties. Needing Reflection to reset state in a test is a red flag that the class should use `ResetInterface` plus `kernel.reset`.
- PHPUnit reuses service instances between test cases, which is another reason to make state resettable.

## Code check (6.7.13.0)
- confirmed `ResetInterface` — core services implement it with a reset() method, e.g. CurrencyFormatter — vendor/shopware/core/System/Currency/CurrencyFormatter.php:13
- confirmed `CurrencyFormatter::reset()` — clears memoized formatter array — vendor/shopware/core/System/Currency/CurrencyFormatter.php:42
- confirmed `kernel.reset` — tag with method="reset" used in core DI config — vendor/shopware/core/Content/DependencyInjection/product.xml:309
- confirmed `kernel.reset` — same tag form in service DI config — vendor/shopware/core/Service/DependencyInjection/services.xml:35
- confirmed `IntegrationTestBehaviour` — test trait exists in core — vendor/shopware/core/Framework/Test/TestCaseBase/IntegrationTestBehaviour.php:5
- confirmed `KernelLifecycleManager::ensureKernelShutdown()` — resets the container when it implements ResetInterface — vendor/shopware/core/Framework/Test/TestCaseBase/KernelLifecycleManager.php:185
- unverified `Symfony\Contracts\Service\ResetInterface` — interface definition lives in vendor/symfony, out of scope
