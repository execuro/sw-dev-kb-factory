---
id: platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/store.md
title: Store and License
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/installation-updates/deployments/deployment-helper/store.html
sourceHash: 9e1597c5b2940e6c571c63f478fefdc6c4690dbe
codeCheckedAgainst: "6.7.13.0"
keywords: ["SHOPWARE_STORE_ACCOUNT_EMAIL", "SHOPWARE_STORE_ACCOUNT_PASSWORD", "SHOPWARE_STORE_SHOP_SECRET", "SHOPWARE_STORE_LICENSE_DOMAIN", "deployment.store.license-domain", ".shopware-project.yml", "core.store.licenseHost", "license domain", "store credentials", "deployment helper", "app registration", "shopware account"]
summary: "Store credentials (SHOPWARE_STORE_* env vars or shop secret) and license domain the Deployment Helper needs to install apps during deployment."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/concepts/extensions/apps-concept.md", "platform/dev/6.7/guides/plugins/plugins/_index.md"]
---
## What it is

How the Deployment Helper authenticates against the Shopware Store and which license domain it uses. The license domain is the primary domain registered in your Shopware Account; it identifies the shop in the Store and is required to install/update extensions, register apps, and verify licensing and entitlements.

## When to use

- Automated deployments that install or update [apps](platform/dev/6.7/concepts/extensions/apps-concept.md): app installation performs a registration handshake that needs valid account credentials (email + password, or shop secret), the license domain, and a shop ID. Without a license domain, app installation fails.
- If you only use [plugins](platform/dev/6.7/guides/plugins/plugins/_index.md), no license domain is needed, but no official Shopware apps can be installed.

## Key steps / config

1. Provide credentials as environment variables from your CI/CD secret store (never commit them to Git):
   - `SHOPWARE_STORE_ACCOUNT_EMAIL`
   - `SHOPWARE_STORE_ACCOUNT_PASSWORD`
   - `SHOPWARE_STORE_LICENSE_DOMAIN`
2. For PaaS Native environments, use the shop secret instead of email/password: `SHOPWARE_STORE_SHOP_SECRET` plus `SHOPWARE_STORE_LICENSE_DOMAIN`.
3. Optionally hardcode the (non-secret) license domain in `.shopware-project.yml`:

```yaml
deployment:
  store:
    license-domain: 'example.com'
```

4. `SHOPWARE_STORE_LICENSE_DOMAIN` overrides the YAML value if both are set.

Across environments: use the same account credentials for production, staging and dev; only the license domain changes (e.g. `example.com` for prod, `staging.example.com` for staging, `dev.example.com` optionally for dev). Register multiple domains in the Shopware Account if needed.

In the installed core, the license domain and shop secret are persisted as system config keys `core.store.licenseHost` and `core.store.shopSecret`; the CLI command `store:login` accepts a `--host` option that writes `core.store.licenseHost`.

## Essential identifiers

- `SHOPWARE_STORE_ACCOUNT_EMAIL`, `SHOPWARE_STORE_ACCOUNT_PASSWORD`
- `SHOPWARE_STORE_SHOP_SECRET`
- `SHOPWARE_STORE_LICENSE_DOMAIN`
- `deployment.store.license-domain` in `.shopware-project.yml`
- `core.store.licenseHost`, `core.store.shopSecret` (system config)
- `store:login`

## Gotchas

- After deployment the Administration extension manager may show "not logged in". This is expected: the Deployment Helper is logged in to the Store only during deployment; each Administration user must log in manually in the UI.
- License domains are optional for Community Edition but required for Plus/Enterprise editions.
- Credentials are per account, not per environment — do not create separate credentials for staging.

## Code check (6.7.13.0)
- confirmed `core.store.licenseHost` — license domain config key used by the Store services — vendor/shopware/core/Framework/Store/Services/StoreService.php:22
- confirmed `core.store.shopSecret` — shop secret config key used for Store requests — vendor/shopware/core/Framework/Store/Authentication/StoreRequestOptionsProvider.php:24
- confirmed `store:login` — core CLI login to the Store — vendor/shopware/core/Framework/Store/Command/StoreLoginCommand.php:29
- confirmed `host` — `store:login` option "License host", stored into `core.store.licenseHost` — vendor/shopware/core/Framework/Store/Command/StoreLoginCommand.php:52
- unverified `SHOPWARE_STORE_ACCOUNT_EMAIL` — read by shopware/deployment-helper, outside the checked vendor roots
- unverified `SHOPWARE_STORE_ACCOUNT_PASSWORD` — read by shopware/deployment-helper, out of scope
- unverified `SHOPWARE_STORE_SHOP_SECRET` — read by shopware/deployment-helper, out of scope
- unverified `SHOPWARE_STORE_LICENSE_DOMAIN` — read by shopware/deployment-helper, out of scope; override precedence not checkable
- unverified `deployment.store.license-domain` — `.shopware-project.yml` schema belongs to deployment-helper, out of scope
