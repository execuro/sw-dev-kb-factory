---
id: platform/dev/6.7/resources/references/app-reference/manifest-reference.md
title: Manifest Reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/app-reference/manifest-reference.html
sourceHash: 5766129a9d0450ef4e6526b765ae036c4256a146
codeCheckedAgainst: "6.7.13.0"
keywords: ["manifest.xml", "manifest-3.0.xsd", "app manifest", "meta", "setup", "requirements", "public-access", "permissions", "crud", "allowed-hosts", "webhooks", "payments", "shipping-methods", "rule-conditions", "tax"]
summary: "Reference of app manifest.xml sections: required meta, setup, requirements (public-access), permissions/crud, webhooks, payments, tax."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/apps/lifecycle/app-registration-setup.md", "platform/dev/6.7/guides/plugins/apps/lifecycle/webhook.md", "platform/dev/6.7/guides/plugins/apps/checkout/payment.md", "platform/dev/6.7/guides/plugins/apps/administration/add-custom-modules.md"]
---
## What it is

Overview of every top-level section of an app's `manifest.xml`. In 6.7 the core validates manifests against `manifest-3.0.xsd`. Only `meta` is required; all other sections are optional.

## When to use

When writing or reviewing an app manifest and you need to know which section to add for a capability (registration, permissions, webhooks, admin modules, checkout integrations) and since which version it exists.

## Key steps / config

Top-level children of `<manifest>` (unordered; only `meta` required):

```xml
<manifest>
  <meta>...</meta>
  <setup>registrationUrl, secret</setup>
  <requirements><public-access/></requirements>
  <storefront><template-load-priority>...</template-load-priority></storefront>
  <permissions><read>product</read><crud>product</crud></permissions>
  <allowed-hosts><host>...</host></allowed-hosts>
  <webhooks/> <admin/> <cookies/> <payments/> <shipping-methods/> <rule-conditions/> <tax/>
</manifest>
```

- **meta** (required): app metadata.
- **setup**: omit if Shopware and the app need no communication; see [App registration & backend setup](platform/dev/6.7/guides/plugins/apps/lifecycle/app-registration-setup.md).
- **requirements** (since `6.7.10.0`): environment preconditions for setup/installation. Available: `public-access` — best-effort check that `APP_URL` is set and uses HTTPS, the host is not `localhost`, an IP address or a reserved domain (`.local`, `.test`, `.example`), resolves via DNS to a public IP, and `/api/_info/health-check` returns HTTP 200.
- **storefront**: template load priority ([storefront guide](platform/dev/6.7/guides/plugins/apps/storefront/_index.md)).
- **permissions**: `read`, `create`, `update`, `delete` per entity, or `<crud>` granting all four (since 6.7.3.0).
- **allowed-hosts** (since `6.4.12.0`): external endpoints the app talks to.
- **webhooks**: names must be unique ([webhook guide](platform/dev/6.7/guides/plugins/apps/lifecycle/webhook.md)).
- **admin**: Administration extension, e.g. custom modules.
- **cookies**: single cookie or cookie group for the consent manager ([cookies with apps](platform/dev/6.7/guides/plugins/apps/storefront/cookies-with-apps.md)).
- **payments** / **shipping-methods**: methods handled by the external app server.
- **rule-conditions**: identifier must be unique and stable ([rule conditions](platform/dev/6.7/guides/plugins/apps/rule-builder/add-custom-rule-conditions.md)).
- **tax**: external tax provider ([tax provider](platform/dev/6.7/guides/plugins/apps/checkout/tax-provider.md)).

## Essential identifiers

- `manifest.xml`, `manifest-3.0.xsd`
- `meta`, `setup`, `requirements`, `public-access`, `storefront`, `template-load-priority`, `permissions`, `crud`, `allowed-hosts`, `webhooks`, `admin`, `cookies`, `payments`, `shipping-methods`, `rule-conditions`, `tax`
- `APP_URL`, `/api/_info/health-check`

## Gotchas

- Changing a rule condition identifier creates a separate condition; uses of the old one are lost.
- `<crud>` is unavailable before 6.7.3.0 — use individual elements for older targets.
- `public-access` passing once does not guarantee the condition keeps holding; transient network issues can fail it.
- Inline `custom-fields` in the manifest is deprecated for v6.8.0 in the installed schema; define them in `Resources/config/custom-fields.xml` instead ([custom fields guide](platform/dev/6.7/guides/plugins/apps/custom-data/custom-fields.md)).

## Version notes

- `allowed-hosts` since 6.4.12.0; `crud` since 6.7.3.0; `requirements` / `public-access` since 6.7.10.0.

## Code check (6.7.13.0)
- confirmed `manifest-3.0.xsd` — schema used to validate manifests — vendor/shopware/core/Framework/App/Manifest/Manifest.php:33
- confirmed `meta` — only top-level element without minOccurs="0" — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:8
- confirmed `requirements` — optional element accepting any requirement child — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:144
- confirmed `PublicAccess::name()` — returns public-access — vendor/shopware/core/Framework/App/Validation/Requirements/PublicAccess.php:70
- confirmed `/api/_info/health-check` — health endpoint probed under APP_URL — vendor/shopware/core/Framework/App/Validation/Requirements/PublicAccess.php:57
- confirmed `crud` — expands to read/create/update/delete — vendor/shopware/core/Framework/App/Manifest/Xml/Permission/Permissions.php:98
- confirmed `template-load-priority` — storefront child element — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:216
- confirmed `uniqueWebhookName` — webhook names unique — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:87
- confirmed `uniqueRuleConditionName` — rule condition identifiers unique — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:127
- deprecated `custom-fields` — inline manifest custom-fields removed in v6.8.0 — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:69
