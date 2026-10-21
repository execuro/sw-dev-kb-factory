---
id: platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/store.md
title: Store and License
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/installation-updates/deployments/deployment-helper/store.html
sourceHash: 28c241355fdeb0f9474fc7046c2ef3ec7922e1a3
codeCheckedAgainst: "6.7.15.1"
keywords: ["license domain", "store authentication", "deployment helper", "SHOPWARE_STORE_ACCOUNT_EMAIL", "SHOPWARE_STORE_ACCOUNT_PASSWORD", "SHOPWARE_STORE_LICENSE_DOMAIN", "SHOPWARE_STORE_SHOP_SECRET", "deployment.store.license-domain", "core.store.licenseHost", "shopware account", "app registration", "extension manager"]
summary: Store credentials and license domain for the Deployment Helper - SHOPWARE_STORE_* env vars, license-domain config, why apps need them.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/concepts/extensions/apps-concept.md", "platform/dev/6.7/guides/plugins/plugins/_index.md"]
---
## What it is

How the Deployment Helper (DH) authenticates against the Shopware Store and which license domain it uses, so extensions can be installed/updated and apps registered during automated deployments.

## When to use

When deployments must install or update Store extensions, and in particular whenever [apps](platform/dev/6.7/concepts/extensions/apps-concept.md) are installed — app registration needs a license domain.

## Key steps / config

The license domain is the primary domain registered with your Shopware Account (e.g. `example.com`). Installing/updating an app requires a registration handshake with: valid Shopware Account credentials (email + password, or shop secret), the license domain, and a shop ID (unique per instance).

Set credentials as CI/CD secrets (never commit them):

```bash
export SHOPWARE_STORE_ACCOUNT_EMAIL=your-account@example.com
export SHOPWARE_STORE_ACCOUNT_PASSWORD=your-account-password
export SHOPWARE_STORE_LICENSE_DOMAIN=example.com
```

PaaS Native alternative, using the shop secret instead of email/password:

```bash
export SHOPWARE_STORE_SHOP_SECRET=your-shop-secret
export SHOPWARE_STORE_LICENSE_DOMAIN=example.com
```

The license domain is not secret and may be set in `.config/shopware-project.yml`:

```yaml
deployment:
  store:
    license-domain: 'example.com'
```

`SHOPWARE_STORE_LICENSE_DOMAIN` overrides the YAML value when both are set. In core, the license domain is stored as system config `core.store.licenseHost` (admin card "Shopware Account" → "Licence domain"); the shop secret as `core.store.shopSecret`.

Across environments: same account credentials everywhere; only the license domain changes, e.g. `example.com` (production), `staging.example.com` (staging), `dev.example.com` (optional dev). Register multiple domains in the Shopware Account if needed.

## Essential identifiers

- `SHOPWARE_STORE_ACCOUNT_EMAIL`, `SHOPWARE_STORE_ACCOUNT_PASSWORD`
- `SHOPWARE_STORE_SHOP_SECRET`
- `SHOPWARE_STORE_LICENSE_DOMAIN`, `deployment.store.license-domain`
- `core.store.licenseHost`, `core.store.shopSecret` (core system config)

## Gotchas

- Without a license domain, app installation fails. Plugin-only projects ([plugins](platform/dev/6.7/guides/plugins/plugins/_index.md)) do not need one, but then no official Shopware apps can be installed.
- The source states license domains are optional for Community Edition but required for Plus/Enterprise.
- After deployment the Administration extension manager may show "not logged in" — expected: DH is logged in to the Store only during deployment; each Admin user logs in separately.

## Code check (6.7.15.1)
- confirmed `core.store.licenseHost` — system config key for the license domain — vendor/shopware/core/Framework/Store/Authentication/StoreRequestOptionsProvider.php:23
- confirmed `core.store.shopSecret` — system config key for the shop secret — vendor/shopware/core/Framework/Store/Authentication/StoreRequestOptionsProvider.php:24
- confirmed `licenseHost` — "Licence domain" field in the Shopware Account config card — vendor/shopware/core/System/Resources/config/store.xml:9
- confirmed `store:login` — core CLI login; `--host` writes `core.store.licenseHost` — vendor/shopware/core/Framework/Store/Command/StoreLoginCommand.php:30
- unverified `SHOPWARE_STORE_ACCOUNT_EMAIL` — read by Deployment Helper (shopware/deployment-helper), out of scope
- unverified `SHOPWARE_STORE_SHOP_SECRET` — Deployment Helper env var, out of scope
- unverified `SHOPWARE_STORE_LICENSE_DOMAIN` — Deployment Helper env var; override precedence not verifiable in core
- unverified `deployment.store.license-domain` — Deployment Helper config key, out of scope
