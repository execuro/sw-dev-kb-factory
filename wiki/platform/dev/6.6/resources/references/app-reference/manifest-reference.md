---
id: platform/dev/6.6/resources/references/app-reference/manifest-reference.md
title: Manifest Reference
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/app-reference/manifest-reference.html
sourceHash: c4c934a382ef0571a8ceb24336d10f14f5a3025e
keywords: ["manifest.xml", "app manifest", "meta information", "setup", "storefront priority", "permissions", "allowed-hosts", "webhooks", "admin extension", "custom fields", "cookies", "payments", "shipping-methods", "rule conditions", "tax provider"]
summary: "Overview of manifest.xml sections: meta, setup, storefront, permissions, allowed hosts, webhooks, admin, custom fields, cookies, payments, shipping, rules, tax."
lastBuilt: 2026-09-15
---
## What it is

This page enumerates the sections of an app's manifest, each configured via a dedicated snippet block referenced by the doc (`meta.xml`, `setup.xml`, `storefront.xml`, `permissions.xml`, `allowed-hosts.xml`, `webhooks.xml`, `admin.xml`, `custom-fields.xml`, `cookies.xml`, `cookies-group.xml`, `payments.xml`, `shipping-methods.xml`, `rule-conditions.xml`, `tax.xml`).

## Key steps / config

- **Meta information** — required app metadata.
- **Setup** — can be omitted if the app needs no Shopware-to-app communication; see the app base guide's registration request.
- **Storefront** — needed only if the app template requires higher load priority than other plugins/apps.
- **Permissions** — optional; omit if the app needs none.
- **Allowed hosts** — lists external endpoints the app talks to; available since `6.4.12.0`.
- **Webhooks** — registers webhooks the app wants to receive; each webhook name must be unique.
- **Admin extension** — only needed to extend the Administration.
- **Custom fields** — declared via the manifest for custom-fields apps.
- **Cookies** — adds a single cookie, or a cookie group (`cookies-group.xml`), to the consent manager.
- **Payments** — registers payment methods, handled synchronously/asynchronously via an external app-server.
- **Shipping methods** — registers shipping methods, handled synchronously/asynchronously via an external app-server.
- **Rule conditions** — the rule condition identifier must be unique and must not change, or a separate rule condition is created and existing uses of the old one are lost.
- **Tax** — registers an external tax provider that calculates taxes on the fly.

## Essential identifiers

- `manifest.xml` (app manifest, sections shown by snippet file names): `meta.xml`, `setup.xml`, `storefront.xml`, `permissions.xml`, `allowed-hosts.xml`, `webhooks.xml`, `admin.xml`, `custom-fields.xml`, `cookies.xml`, `cookies-group.xml`, `payments.xml`, `shipping-methods.xml`, `rule-conditions.xml`, `tax.xml`

## Gotchas

- A rule condition's identifier must never change once set, or the old condition is orphaned and a new one is created in its place.
- Allowed hosts configuration is only available starting `6.4.12.0`.
