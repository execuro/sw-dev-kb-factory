---
docType: developer
id: platform/dev/6.6/guides/plugins/apps/configuration.md
sourceHash: 6603267cbc908f6d901adeb77e05be23d64ae54a
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/configuration.html
title: Configuration
version: "6.6"
versions:
  - "6.6"
keywords: ["config.xml", "SystemConfig", "system-config", "systemConfig()", "system_config:read", "system_config:update", "system_config:create", "system_config:delete", "app scripts", "SystemConfigFacade", "config service", "domain query parameter"]
summary: "App config uses a config.xml plus the system-config API; values are keyed {appName}.config.{fieldName} and readable via twig/app scripts."
lastBuilt: 2026-09-15
---
## What it is

Describes how apps expose user-configurable settings via a `config.xml` file, and how those values are read or written afterward.

## When to use

When an app needs merchant-configurable settings shown under Administration > Extensions > My extensions, readable from the app backend, Storefront twig templates, or app scripts.

## Key steps / config

Place the file at:

```text
DemoApp
├── Resources
│   └── config
│       └── config.xml
└── manifest.xml
```

Config values are stored as part of `SystemConfig`, keyed `{appName}.config.{fieldName}`.

Read via API — `GET /api/_action/system-config?domain=DemoApp.config&salesChannelId={id}` (requires `system_config:read`), returning a JSON object of `{appName}.config.{field}` keys:

```txt
GET /api/_action/system-config?domain=DemoApp.config&salesChannelId=...
{
    "DemoApp.config.field1": true,
    "DemoApp.config.field2": "successfully configured"
}
```

Write via API — `POST /api/_action/system-config` with the config values as a JSON body and optional `salesChannelId` query param (requires `system_config:update`, `system_config:create`, `system_config:delete`).

Read in Storefront twig with the `config()` twig function: `{{ config('DemoApp.config.field1') }}`. Read in app scripts (available since Shopware 6.4.8.0) via the `config` service: `{% set configValue = services.config.app('field1') %}` (no prefix needed, no extra permission), or `services.config.get('core.listing.productsPerPage')` for any config value (needs `system_config:read`).

For development, configure the app via the Administration at `{APP_URL}/admin#/sw/extension/config/{appName}`.

## Essential identifiers

- `config.xml` in `Resources/config`
- `SystemConfig`, key pattern `{appName}.config.{fieldName}`
- `GET`/`POST /api/_action/system-config`
- `system_config:read`, `system_config:update`, `system_config:create`, `system_config:delete`
- `config()` twig function, `services.config.app()`, `services.config.get()`

## Gotchas

App scripts' `config` service was introduced in Shopware 6.4.8.0 and is unsupported before that version. Reading arbitrary config via `services.config.get()` requires `system_config:read`, unlike `services.config.app()`.
