---
id: platform/dev/6.6/resources/references/adr/2023-05-25-exception-log-levels.md
title: Exception Log Level configuration
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2023-05-25-exception-log-levels.html"
sourceHash: "10894a5dc1e50980939ae3223eb2058032913eed"
keywords: ["exceptions configuration", "symfony/monolog-bridge", "ShopwareHttpException", "error code", "log level", "error level", "notice level", "framework.exceptions", "error logging", "domain exceptions"]
summary: "ADR adding Symfony's `exceptions` config to degrade expected 40x `ShopwareHttpException` cases from error to notice level."
lastBuilt: "2026-09-15"
---
## What it is
This ADR documents adding a platform configuration that degrades the log level of specific exceptions from `error` to `notice`, so that expected client-caused failures no longer pollute error logs.

## When to use
Relevant when investigating why certain exceptions are logged at a given level, when a project wants to adjust which exception classes are treated as errors versus notices, or when deciding how to log an exception raised from a shop with multiple exception cases in one class.

## Key steps / config
- By default, every uncaught PHP exception is logged at `error` level by `symfony/monolog-bridge`.
- Exceptions caused by malformed client requests are represented as `ShopwareHttpException` with an HTTP 40x status; logging these as "errors" produces noise that obscures real errors.
- The cloud product already used a configuration list logging some exception classes only as notices; this ADR brings that capability to the platform.
- The platform now uses Symfony's `exceptions` configuration (`framework.exceptions`) to degrade specific exception classes to notice level, so external hosters benefit from the same classification, and individual projects can still adjust it (e.g. to log every client error for debugging).
- Because Symfony's default `exceptions` config is keyed by exception class and Shopware's domain exceptions can hold multiple exception cases in a single class/file, an additional configuration option is added that keys off the Shopware-specific `error code` instead of the FQCN.
- Alternatives considered and rejected: configuring the log level via attributes or a method on the exception class itself, which would make per-project overrides harder.

## Essential identifiers
- `symfony/monolog-bridge`
- `ShopwareHttpException`
- Symfony `exceptions` configuration (`framework.exceptions`)

## Gotchas
Adding this configuration changes existing projects' error logging behavior; most cloud-specific exception-logging-mapping configuration is expected to become unnecessary once the platform-level configuration ships.
