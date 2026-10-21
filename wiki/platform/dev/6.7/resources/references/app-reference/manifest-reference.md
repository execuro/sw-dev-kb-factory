---
id: platform/dev/6.7/resources/references/app-reference/manifest-reference.md
title: Manifest Reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/app-reference/manifest-reference.html
sourceHash: 914a571cd5ca9eda82628ff03bd069027f30d27d
codeCheckedAgainst: "6.7.15.1"
keywords: ["manifest.xml", "app manifest", "meta", "setup", "requirements", "public-access", "permissions", "crud", "allowed-hosts", "webhooks", "template-load-priority", "payments", "shipping-methods", "rule-conditions", "tax-provider"]
summary: Section-by-section reference of the app manifest.xml - meta, setup, requirements (public-access), permissions/crud, hosts, webhooks, admin, payments, tax.
lastBuilt: 2026-10-21
relatedPages:
  - platform/dev/6.7/guides/plugins/apps/lifecycle/app-registration-setup.md
  - platform/dev/6.7/guides/plugins/apps/storefront/_index.md
  - platform/dev/6.7/guides/plugins/apps/lifecycle/webhook.md
  - platform/dev/6.7/guides/plugins/apps/administration/add-custom-modules.md
---
## What it is

Reference of the top-level sections of an app's `manifest.xml`. Only `<meta>` is required; every other section is optional and only needed when the app uses that feature. In the installed 6.7 code the root `<manifest>` element is defined by `manifest-3.0.xsd` as an `xs:all` group, so section order does not matter and each section appears at most once.

## When to use

When writing or reviewing an app manifest and you need to know which top-level element configures which feature, and which guide covers it in detail.

## Key steps / config

Top-level sections of `<manifest>`:

- `<meta>` (required) — app meta information: `name`, `label`, `description`, `author`, `copyright`, `version`, `icon`, `license`, `compatibility`, `privacy`, `privacyPolicyExtensions`.
- `<setup>` — omit if Shopware and the app server do not communicate. Holds `registrationUrl` and the optional `secret` for local development. See [App registration & backend setup](platform/dev/6.7/guides/plugins/apps/lifecycle/app-registration-setup.md).
- `<requirements>` (since `6.7.10.0`) — environment preconditions checked before setup/installation. Presence of a child element enables it. Available: `<public-access/>`.
- `<storefront>` — `template-load-priority` (int, default `0`). See the [storefront guide](platform/dev/6.7/guides/plugins/apps/storefront/_index.md) and [SEO URLs for App Routes](platform/dev/6.7/guides/plugins/apps/storefront/seo-urls.md).
- `<permissions>` — `<read>`, `<create>`, `<update>`, `<delete>` per entity, the `<crud>` shortcut (since 6.7.3.0; grants all four), and `<permission>` for additional privileges.
- `<allowed-hosts>` (since `6.4.12.0`) — `<host>` entries for every external endpoint the app talks to.
- `<webhooks>` — `<webhook>` entries; the `name` attribute must be unique. See the [webhook guide](platform/dev/6.7/guides/plugins/apps/lifecycle/webhook.md).
- `<admin>` — `action-button`, `module`, `main-module`, `base-app-url`. See [add custom modules](platform/dev/6.7/guides/plugins/apps/administration/add-custom-modules.md).
- `<cookies>` — a single cookie or a cookie group for the consent manager. See [cookies with apps](platform/dev/6.7/guides/plugins/apps/storefront/cookies-with-apps.md).
- `<payments>` — `payment-method` entries handled by the app server. See [app payment](platform/dev/6.7/guides/plugins/apps/checkout/payment.md).
- `<shipping-methods>` — `shipping-method` entries. See [shipping methods](platform/dev/6.7/guides/plugins/apps/checkout/shipping-methods.md).
- `<rule-conditions>` — `rule-condition` with `identifier`, `name`, `group`, `script`, `constraints`. See [rule conditions](platform/dev/6.7/guides/plugins/apps/rule-builder/add-custom-rule-conditions.md).
- `<tax>` — `tax-provider` with `identifier`, `name`, `priority`, `process-url`. See [tax provider](platform/dev/6.7/guides/plugins/apps/checkout/tax-provider.md).

```xml
<manifest>
    <meta>...</meta>
    <requirements><public-access/></requirements>
    <permissions>
        <crud>product</crud>
        <read>order</read>
    </permissions>
    <allowed-hosts><host>...</host></allowed-hosts>
</manifest>
```

`<crud>product</crud>` is equivalent to `<read>product</read>`, `<create>product</create>`, `<update>product</update>`, `<delete>product</delete>`.

### `public-access` checks

The validator checks that:

- `APP_URL` is set and uses HTTPS;
- the host is not `localhost`, an IP address, or a reserved domain (`.local`, `.test`, `.example`, ...);
- the host resolves via DNS to a public IP address;
- `/api/_info/health-check` on `APP_URL` returns HTTP 200 (1 s timeout, no redirects followed).

## Essential identifiers

- `manifest.xml`, `<meta>`, `<setup>`, `<requirements>`, `<public-access/>`
- `<permissions>`, `<crud>`, `<allowed-hosts>`, `<webhooks>`, `<admin>`, `<storefront>`, `template-load-priority`
- `<cookies>`, `<payments>`, `<shipping-methods>`, `<rule-conditions>`, `<tax>`
- `APP_URL`, `/api/_info/health-check`

## Gotchas

- Rule condition `identifier` must be unique and must not change; changing it creates a separate rule condition and existing uses of the old one are lost.
- `public-access` is best-effort: a temporary network issue can make it fail, and passing once does not guarantee the shop stays reachable.
- Use the individual permission elements instead of `<crud>` if the app must support versions before 6.7.3.0.
- Inline `<custom-fields>` in the manifest is marked `@deprecated tag:v6.8.0` in the installed schema; define custom fields in a separate `Resources/config/custom-fields.xml` instead. See [custom fields](platform/dev/6.7/guides/plugins/apps/custom-data/custom-fields.md).
- In the installed `manifest-3.0.xsd`, the `storefront` type only declares `template-load-priority`; the schema also contains `gateways` and `documents` sections that this page does not describe.

## Version notes

- `<allowed-hosts>`: since 6.4.12.0. `<crud>`: since 6.7.3.0. `<requirements>` / `public-access`: since 6.7.10.0.
- Inline `<custom-fields>` is scheduled for removal in 6.8.0.

## Code check (6.7.15.1)
- confirmed `meta` — only required manifest child (no minOccurs="0") — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:8
- confirmed `requirements` — optional manifest section — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:155
- confirmed `PublicAccess::name()` — returns `public-access` — vendor/shopware/core/Framework/App/Validation/Requirements/PublicAccess.php:68
- confirmed `APP_URL` — must be set, HTTPS, public, DNS-resolvable — vendor/shopware/core/Framework/App/Validation/Requirements/PublicAccess.php:45
- confirmed `/api/_info/health-check` — must return HTTP 200 — vendor/shopware/core/Framework/App/Validation/Requirements/PublicAccess.php:57
- confirmed `crud` — permissions shortcut element — vendor/shopware/core/Framework/App/Manifest/Xml/Permission/Permissions.php:109
- confirmed `allowed-hosts` — list of `host` elements — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:240
- confirmed `template-load-priority` — only storefront child, int, default 0 — vendor/shopware/core/Framework/App/Manifest/Xml/Storefront/Storefront.php:31
- confirmed `tax-provider` — identifier, name, priority, process-url — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:620
- deprecated `custom-fields` — inline definition removed in v6.8.0 — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:68
