---
id: platform/dev/6.6/resources/references/app-reference/script-reference/miscellaneous-script-services-reference.md
title: Miscellaneous script services reference
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/app-reference/script-reference/miscellaneous-script-services-reference.html
sourceHash: 08754beaff6ed8b33b9153f57bf5560c8a0a7eae
keywords: ["ArrayFacade", "SystemConfigFacade", "services.config", "system config", "app config", "config.xml", "system_config:read", "array manipulation", "script services"]
summary: "ArrayFacade for array manipulation and services.config for reading system/app configuration values in app scripts."
lastBuilt: "2026-09-15"
---

## What it is
Reference documentation for two general-purpose script-service facades: `Shopware\Core\Framework\Script\Facade\ArrayFacade`, a wrapper around PHP arrays for use inside Twig scripts, and `services.config` (`Shopware\Core\System\SystemConfig\Facade\SystemConfigFacade`), which reads shop and app configuration values.

## When to use
Use `ArrayFacade` whenever a script needs to build or manipulate an array-like structure (it can also be accessed like a normal array in Twig, e.g. `array.foo`, `array.has('foo')`, `foreach array as key => value`). Use `services.config` when a script needs to read a system config value (e.g. `core.listing.defaultSorting`) or the current app's own configuration values.

## Key steps / config
`ArrayFacade` methods:
- `set(key, value)` — adds/overwrites an element by key.
- `push(value)` — appends a value.
- `removeBy(index)` — removes the value at the given index.
- `remove(value)` — removes a given value if present.
- `reset()` — clears all entries.
- `merge(array)` / `replace(array)` — recursively merge/replace with another `array` or `ArrayFacade`.
- `count()` — returns the element count.
- `all()` — returns all elements.

`services.config` methods:
- `get(key, salesChannelId = null)` — reads any system_config value; requires the `system_config:read` privilege. Example key: `core.listing.productsPerPage`.
- `app(key, salesChannelId = null)` — reads the app's own configuration value as defined in `config.xml`, e.g. `exampleTextField`; no additional privilege required.

```twig
{% set systemConfig = services.config.get('core.listing.productsPerPage') %}
{% set appConfig = services.config.app('app_config') %}
```

## Essential identifiers
- `Shopware\Core\Framework\Script\Facade\ArrayFacade`
- `Shopware\Core\System\SystemConfig\Facade\SystemConfigFacade` (`services.config`)
- `system_config:read` privilege

## Gotchas
`services.config.get()` requires the `system_config:read` privilege on the app; `services.config.app()` only reads the calling app's own configuration and needs no extra privilege.
