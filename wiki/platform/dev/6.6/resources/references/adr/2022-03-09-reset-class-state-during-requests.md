---
id: platform/dev/6.6/resources/references/adr/2022-03-09-reset-class-state-during-requests.md
title: Use `ResetInterface` to reset instance state during requests
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2022-03-09-reset-class-state-during-requests.html"
sourceHash: "90c6756ff32dc15e89685a14b790a643dab2910a"
keywords: ["ResetInterface", "kernel.reset", "memoization", "reset()", "IntegrationTestBehaviour", "roadrunner", "swoole", "PHP-FPM", "service state", "instance variable cache", "architecture decision record"]
summary: "ADR: services that memoize data in instance variables must implement ResetInterface and be tagged kernel.reset so state doesn't leak across requests."
lastBuilt: "2026-09-15"
---
## What it is
Architecture decision record requiring services that memoize data in an instance variable to reset that state between requests, for compatibility with long-lived PHP application servers (roadrunner, swoole) where the kernel is not rebooted per request.

## When to use
When implementing a service that caches/memoizes data in an instance property, to avoid serving stale data across requests or, worse, data from a different tenant in cloud environments.

## Key steps / config
- Implement `\Symfony\Contracts\Service\ResetInterface`, which adds `public function reset(): void`.
- If a service already has a `reset` method for other purposes, add a differently named method instead and configure that name in the service tag.
- Tag the service so Symfony calls the reset method automatically between requests:

```xml
<service id="FooService">
    <tag name="kernel.reset" method="reset"/>
</service>
```

```php
class FooService implements ResetInterface
{
    private array $data = [];

    public function reset(): void
    {
        $this->data = [];
    }
}
```

## Essential identifiers
- `\Symfony\Contracts\Service\ResetInterface`
- `reset(): void`
- `kernel.reset` DI tag
- `IntegrationTestBehaviour`

## Gotchas
Relying on `Reflection` in test cases to manually reset private/internal instance state is considered a red flag — it signals the class should implement `ResetInterface` and the `kernel.reset` tag instead. The project also added a hook to `IntegrationTestBehaviour` that resets this state between test cases.
