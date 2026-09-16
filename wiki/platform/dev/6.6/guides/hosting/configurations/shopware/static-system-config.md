---
id: platform/dev/6.6/guides/hosting/configurations/shopware/static-system-config.md
title: Static System Configuration
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/hosting/configurations/shopware/static-system-config.html
sourceHash: 9f70a055820245ea066e5830400fac005c8de230
keywords: ["static system configuration", "config/packages", "system_config", "core.listing.allowBuyInListing", "sales channel configuration", "database configuration override", "environment variables", "config overlay", "shopware.system_config.default", "yaml configuration", "administration lock", "symfony config processor"]
summary: "config/packages YAML overrides database system_config values per sales channel and locks the field in Administration (since 6.6.4.0)."
lastBuilt: 2026-09-15
---
## What it is
Static system configuration lets you set Shopware system config values in `config/packages` YAML files that overwrite the values stored in the database, available since Shopware 6.6.4.0.

## When to use
Use it when a configuration must stay fixed and not be editable by users in the Administration, when you want configuration versioned in the repository, or when different environments (dev/staging/prod) need different values.

## Key steps / config
Create a file at `config/packages/<name>.yaml`. The database configuration loads first, then the `config/packages` overlay is applied on top; matching keys are replaced by the file value, and the field becomes locked in the Administration.

```yaml
shopware:
  system_config:
    default:
      core.listing.allowBuyInListing: true
    # Disable it for the specific sales channel
    0188da12724970b9b4a708298259b171:
      core.listing.allowBuyInListing: false
```

Environment variables can be used via Symfony configuration processors:

```yaml
shopware:
  system_config:
    default:
      core.listing.allowBuyInListing: '%env(bool:ALLOW_BUY_IN_LISTING)%'
```

Set the variable in `.env.local`:
```dotenv
ALLOW_BUY_IN_LISTING=true
```

## Essential identifiers
- `config/packages/<name>.yaml`
- `shopware.system_config.default`
- `core.listing.allowBuyInListing`
- `%env(bool:...)%`

## Gotchas
Once a key is overwritten this way, the user can no longer change that configuration in the Administration.

## Version notes
Available since Shopware 6.6.4.0.
