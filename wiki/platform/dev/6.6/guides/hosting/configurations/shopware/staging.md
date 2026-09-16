---
id: platform/dev/6.6/guides/hosting/configurations/shopware/staging.md
title: Staging
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/hosting/configurations/shopware/staging.html
sourceHash: 013728b77ac2d8d6d0744f5e72ee0257beb348b4
keywords: ["staging mode", "system:setup:staging", "config/packages/staging.yaml", "domain_rewrite", "shopware-cli project dump", "SetupStagingEvent", "SHOPWARE_ES_INDEX_PREFIX", "staging environment", "anonymize data"]
summary: "Staging mode (since 6.6.1.0) prepares a duplicated Shopware instance for testing via system:setup:staging and staging.yaml."
lastBuilt: "2026-09-15"
---
## What it is

Since Shopware 6.6.1.0, Shopware has an integrated staging mode that prepares an already-copied shop instance to be used as a test environment, without itself duplicating the installation, database, or files.

## When to use

Use this after deploying a second Shopware instance (e.g. from the same Git repository) and copying its database, to safely turn that copy into a staging environment that behaves differently from production (no outgoing e-mail, rewritten domains, a visible staging banner).

## Key steps / config

1. Create a second instance, ideally by deploying from the same Git repository as the live environment.
2. Copy the database (e.g. with `mysqldump`/`mysql`, matching major version/vendor, or via `shopware-cli project dump --clean [--anonymize] --host <host> --username <user> --password <pass> --output shop.sql <db>`), and configurable via `.shopware-project.yml`.
3. Update `.env` for the staging database; set `SHOPWARE_ES_INDEX_PREFIX` if using ElasticSearch/OpenSearch, to avoid index conflicts with production.
4. Activate staging mode: `./bin/console system:setup:staging` (accepts `--no-interaction`).
5. Protect the staging environment (e.g. `.htaccess`/`auth_basic`, IP restriction, or an OAuth proxy).

Staging behavior is configured in `config/packages/staging.yaml`:

```yaml
shopware:
    staging:
        mailing:
            disable_delivery: true
        storefront:
            show_banner: true
        administration:
            show_banner: true
        sales_channel:
            domain_rewrite:
        elasticsearch:
            check_for_existence: true
```

`domain_rewrite` rewrites Sales Channel URLs to the staging domain using rule `type: equal`, `type: prefix`, or `type: regex`, each with `match`/`replace`.

Plugins can react to activation by subscribing to `Shopware\Core\Maintenance\Staging\Event\SetupStagingEvent`, dispatched by `system:setup:staging`.

## Essential identifiers

- `system:setup:staging` console command
- `config/packages/staging.yaml`
- `shopware.staging.sales_channel.domain_rewrite`
- `Shopware\Core\Maintenance\Staging\Event\SetupStagingEvent`
- `shopware-cli project dump`
- `SHOPWARE_ES_INDEX_PREFIX`

## Gotchas

- Staging mode only modifies data inside the instance; it does not duplicate the installation, copy the database, or copy files, and does not modify the live environment.
- Sharing MySQL, Redis, or ElasticSearch/OpenSearch resources between live and staging is not recommended — it can corrupt data and affect live performance.
- Activating staging deletes all apps with an active external connection and resets the instance ID, so apps must be reinstalled afterward as an isolated instance.
