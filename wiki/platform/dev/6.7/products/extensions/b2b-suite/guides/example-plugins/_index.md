---
id: platform/dev/6.7/products/extensions/b2b-suite/guides/example-plugins/_index.md
title: Example Plugins
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite/guides/example-plugins/
sourceHash: 9df256fee568d8e2d342d02cbf7b986cabf16e08
codeCheckedAgainst: "6.7.13.0"
keywords: ["b2b suite", "example plugins", "B2bAcl", "B2bAjaxPanel", "B2bAuditLog", "B2bAuth", "B2bLogin", "B2bRestApi", "B2bServiceExtension", "B2bTemplateExtension", "SwagB2bPlatform", "sample code"]
summary: Downloadable B2B Suite example plugins (B2bAcl, B2bAjaxPanel, B2bAuditLog, B2bAuth, B2bLogin, B2bRestApi, B2bServiceExtension, B2bTemplateExtension).
lastBuilt: 2026-09-15
---
## What it is

A list of example plugins (distributed as zip downloads on the documentation site) that demonstrate how to extend the B2B Suite.

## When to use

When you need a working reference for a specific B2B Suite extension point before writing your own plugin.

## Essential identifiers

| Plugin | Demonstrates |
|---|---|
| `B2bAcl` | ACL implementation incl. frontend usage; also CRUD and listing usage |
| `B2bAjaxPanel` | Ajax Panels and how to use them |
| `B2bAuditLog` | An implementation of the audit log component |
| `B2bAuth` | Logging in as a certain user |
| `B2bLogin` | Replacing the e-mail login with a staff-number login |
| `B2bRestApi` | The `RestApi` routing |
| `B2bServiceExtension` | Extending a service |
| `B2bTemplateExtension` | Extending the `SwagB2bPlatform` templates |

## Gotchas

- The examples target the B2B Suite plugin (`SwagB2bPlatform`), which is not part of Shopware core; none of their classes exist in a core-only installation.

## Code check (6.7.13.0)
- confirmed `SwagB2bPlatform` — listed only as a plugin name in core's translation plugin list, no code in core — vendor/shopware/core/System/Resources/translation.yaml:6
- unverified `B2bAcl` — example plugin zip, not in vendor/shopware
- unverified `B2bAjaxPanel` — example plugin zip, out of scope
- unverified `B2bAuditLog` — example plugin zip, out of scope
- unverified `B2bAuth` — example plugin zip, out of scope
- unverified `B2bLogin` — example plugin zip, out of scope
- unverified `B2bRestApi` — example plugin zip, out of scope
- unverified `B2bServiceExtension` — example plugin zip, out of scope
- unverified `B2bTemplateExtension` — example plugin zip, out of scope
