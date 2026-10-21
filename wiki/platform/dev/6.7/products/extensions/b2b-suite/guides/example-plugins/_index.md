---
id: platform/dev/6.7/products/extensions/b2b-suite/guides/example-plugins/_index.md
title: Example Plugins
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite/guides/example-plugins/
sourceHash: 9df256fee568d8e2d342d02cbf7b986cabf16e08
codeCheckedAgainst: "6.7.15.1"
keywords: ["b2b suite", "example plugins", "B2bAcl", "B2bAjaxPanel", "B2bAuditLog", "B2bAuth", "B2bLogin", "B2bRestApi", "B2bServiceExtension", "B2bTemplateExtension", "SwagB2bPlatform", "sample code", "extend b2b suite"]
summary: List of downloadable B2B Suite example plugins (B2bAcl, B2bAjaxPanel, B2bAuditLog, B2bRestApi, ...) showing how to extend SwagB2bPlatform.
lastBuilt: 2026-10-21
---
## What it is

An overview table of example plugins, shipped as zip downloads alongside the B2B Suite docs, each demonstrating one extension point of the B2B Suite (`SwagB2bPlatform`).

## When to use

When you need a working reference implementation before extending a specific B2B Suite component — ACL, ajax panels, audit log, authentication, login, REST API routing, service decoration or template extension.

## Key steps / config

| Plugin | What it demonstrates |
|---|---|
| `B2bAcl` | The ACL implementation including frontend usage; also shows CRUD and listing usage |
| `B2bAjaxPanel` | Ajax panels and how to use them |
| `B2bAuditLog` | An implementation of the audit log component |
| `B2bAuth` | Logging in as a certain user |
| `B2bLogin` | Replacing the e-mail login with a staff-number login |
| `B2bRestApi` | The `RestApi` routing |
| `B2bServiceExtension` | Extending a B2B Suite service |
| `B2bTemplateExtension` | Extending the `SwagB2bPlatform` templates |

Each entry is a downloadable archive named after the plugin (e.g. `B2bAcl.zip`).

## Essential identifiers

- `SwagB2bPlatform` — the B2B Suite plugin these examples extend
- `B2bAcl`, `B2bAjaxPanel`, `B2bAuditLog`, `B2bAuth`, `B2bLogin`, `B2bRestApi`, `B2bServiceExtension`, `B2bTemplateExtension`

## Gotchas

- The B2B Suite and its example plugins are not part of `shopware/core`, `shopware/storefront` or `shopware/administration`; none of the example plugin names occur in the installed platform code, so they can only be checked against the downloaded archives.

## Code check (6.7.15.1)
- confirmed `SwagB2bPlatform` — listed only as an external plugin name in core's translation plugin list, not shipped in core — vendor/shopware/core/System/Resources/translation.yaml:9
- unverified `B2bAcl` — example plugin archive from the B2B Suite docs, outside the platform packages
- unverified `B2bAjaxPanel` — example plugin archive from the B2B Suite docs, outside the platform packages
- unverified `B2bRestApi` — example plugin archive from the B2B Suite docs, outside the platform packages
- unverified `B2bAuditLog` — example plugin archive from the B2B Suite docs, outside the platform packages
