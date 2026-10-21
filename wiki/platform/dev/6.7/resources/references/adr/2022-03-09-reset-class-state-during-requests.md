---
id: platform/dev/6.7/resources/references/adr/2022-03-09-reset-class-state-during-requests.md
title: Use `ResetInterface` to reset instance state during requests
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-03-09-reset-class-state-during-requests.html
sourceHash: 90c6756ff32dc15e89685a14b790a643dab2910a
codeCheckedAgainst: "6.7.15.1"
keywords: ["ResetInterface", "Symfony\\Contracts\\Service\\ResetInterface", "kernel.reset", "reset()", "services_resetter", "memoization", "instance state", "IntegrationTestBehaviour", "CacheTestBehaviour", "roadrunner", "swoole", "application server", "stale data"]
summary: "ADR: services that memoize data in instance properties implement ResetInterface and get the kernel.reset tag so state is cleared between requests."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2022-03-09, area core). Many services memoize data in instance variables to reuse it within one request. That relied on PHP-FPM-style behaviour where each request gets fresh service instances. With long-running PHP application servers (e.g. roadrunner, swoole) service instances may be shared across requests, so memoized state must be reset explicitly.

## When to use

When writing or reviewing a service that caches data in a property (e.g. `private array $data = []` filled lazily), or when a test needs to reset a service's internal state between test cases.

## Key steps / config

1. Implement `\Symfony\Contracts\Service\ResetInterface` and clear the memoized state in `public function reset(): void`:
   ```php
   use Symfony\Contracts\Service\ResetInterface;

   class FooService implements ResetInterface
   {
       private array $data = [];
       public function getData(): array { /* memoize into $this->data */ }
       public function reset(): void { $this->data = []; }
   }
   ```
2. Tag the service with Symfony's `kernel.reset` tag, naming the reset method. The ADR shows the XML form:
   ```xml
   <service id="FooService">
       <tag name="kernel.reset" method="reset"/>
   </service>
   ```
   6.7 core declares its own services in PHP DI config files with the equivalent `->tag('kernel.reset', ['method' => 'reset'])`.
3. If the class already has an unrelated `reset` method, add a differently named method for clearing internal state and set that name as the tag's `method`.

Symfony then resets tagged services between requests. Shopware's integration test behaviour also resets them between test cases.

## Essential identifiers

- `Symfony\Contracts\Service\ResetInterface`, `reset(): void`
- DI tag `kernel.reset` with attribute `method`
- `services_resetter` (container service called to reset tagged services)
- `IntegrationTestBehaviour` (test trait)

## Gotchas

- In cloud setups the next request may belong to a different shop/tenant; an un-reset service would serve another instance's data, not just stale data.
- Resetting private properties via `Reflection` in tests is a red flag; use `ResetInterface` plus the `kernel.reset` tag instead.
- PHPUnit reuses service instances across test cases, which is another reason to make state resettable.
- In 6.7 the test hook lives in `CacheTestBehaviour::clearCacheData()` (run `#[Before]` and `#[After]` each test), which `IntegrationTestBehaviour` pulls in; it calls `services_resetter`'s `reset()`.

## Code check (6.7.15.1)
- confirmed `ResetInterface` — implemented by core services that memoize state — vendor/shopware/core/System/Locale/LanguageLocaleCodeProvider.php:13
- confirmed `LanguageLocaleCodeProvider::reset()` — public reset(): void — vendor/shopware/core/System/Locale/LanguageLocaleCodeProvider.php:57
- confirmed `kernel.reset` — tag with `method => reset` in core DI config — vendor/shopware/core/System/DependencyInjection/locale.php:30
- confirmed `IntegrationTestBehaviour` — trait including CacheTestBehaviour — vendor/shopware/core/Framework/Test/TestCaseBase/IntegrationTestBehaviour.php:5
- confirmed `services_resetter` — reset before/after each test — vendor/shopware/core/Framework/Test/TestCaseBase/CacheTestBehaviour.php:21
- corrected `CacheTestBehaviour::clearCacheData()` — docs: hook in IntegrationTestBehaviour; code: in CacheTestBehaviour used by it — vendor/shopware/core/Framework/Test/TestCaseBase/CacheTestBehaviour.php:14
- unverified `kernel.reset` semantics — reset between requests is Symfony behaviour, vendor/symfony out of scope
