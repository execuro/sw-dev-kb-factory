---
id: platform/dev/6.7/products/paas/shopware/faq.md
title: Frequently Asked Questions
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/faq.html
sourceHash: e931b81d07829bbbeddc3650b241d8b3f685dd4f
codeCheckedAgainst: "6.7.15.1"
keywords: ["paas native faq", "sw-paas", "build vs deployment", "rollback", "system:update:prepare", "system:update:finish", "plugin:list", "dal:refresh:index", "runtime_extension_management", "SwagExtensionStore", "keepUserData", "egress ip", "snapshots", "backups", "fastly"]
summary: "Shopware PaaS Native FAQ: access, AWS eu-central-1, builds vs deployments, rollback, upgrades, extensions, backups, CDN, profilers, SLA and CLI exec."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/paas/shopware/guides/update-shopware.md", "platform/dev/6.7/products/paas/shopware/fundamentals/account.md", "platform/dev/6.7/products/paas/shopware/fundamentals/application-yaml.md", "platform/dev/6.7/products/paas/shopware/composable-frontends/_index.md"]
---
## What it is

Collected answers about operating Shopware on PaaS Native: access, platform limits, the build/deployment split, upgrades, extensions, data and backups, domains/CDN, configuration, monitoring, availability and the `sw-paas` CLI.

## When to use

When you need a quick fact about PaaS Native behaviour (what is self-service, what is platform-managed, which command to run) before reading the dedicated guide.

## Key steps / config

Access: authenticate with `sw-paas auth`, check roles with `sw-paas account whoami`. Add users via `sw-paas account user add` (admin, using the user's `sub`) or `sw-paas account user request` + `sw-paas account user requests resolve` ([Adding users](platform/dev/6.7/products/paas/shopware/guides/adding-users.md)). Repository access: create the project with `--create-ssh-key`, add the public key as a read-only deploy key ([repository access](platform/dev/6.7/products/paas/shopware/guides/setting-up-repository-access.md)). For CI/CD use a service account and `--organization-id`/`--project-id`/`--application-id` ([Account](platform/dev/6.7/products/paas/shopware/fundamentals/account.md)).

Build vs deployment:

```sh
sw-paas application build create    # build only, nothing goes live
sw-paas application build list
sw-paas application deploy create   # deploy an existing build
```

`sw-paas application update` runs both. Migrations run first at deploy time, then the [deployment helper](platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/extensions.md) flow and its hooks. Status: `sw-paas application list`; live events: `sw-paas watch`. Rollback: `sw-paas application update --commit-sha <sha>` or `sw-paas application deploy create --application-build-id <build-id>`.

Shopware upgrade ([guide](platform/dev/6.7/products/paas/shopware/guides/update-shopware.md)):
1. Update `shopware/core` in `composer.json`, `composer update --no-scripts`, `composer recipes:update`, commit, push.
2. Before deploying: `sw-paas exec --new` → `bin/console system:update:prepare`.
3. `sw-paas application update --commit-sha <sha>`.
4. After success: `sw-paas exec --new` → `bin/console system:update:finish`.

Extensions: verify with `bin/console plugin:list`. Removal needs two deployments: set state `remove` in `.shopware-project.yml` and deploy; then `composer remove <vendor>/<plugin>`, delete the override entry, deploy again (`keepUserData: true` preserves data). Private/paid packages need `SHOPWARE_PACKAGES_TOKEN` or `COMPOSER_AUTH` as a `buildenv` secret ([Vault](platform/dev/6.7/products/paas/shopware/guides/secrets-vault-guide.md)). In-app purchases require `SwagExtensionStore` installed via Composer.

Data: DB tunnel `sw-paas open service --service database --port 3306` ([Databases](platform/dev/6.7/products/paas/shopware/resources/databases.md)). Snapshots: `sw-paas snapshot create`, `sw-paas snapshot download-url`, `sw-paas snapshot list --deployment-id <deployment-id>` ([Snapshots](platform/dev/6.7/products/paas/shopware/fundamentals/snapshots.md)). Migration outline ends with `bin/console dal:refresh:index --use-queue`.

Domains: subdomain = one `CNAME` to `cdn.shopware.shop`; apex = four `A`, four `AAAA` and a `TXT` ownership record; then `sw-paas domain create`, deploy, assign in Admin ([CDN](platform/dev/6.7/products/paas/shopware/cdn/_index.md)). www-to-apex redirect needs `recv` and `error` VCL snippets via `services.fastly.snippets_path` ([Fastly snippets](platform/dev/6.7/products/paas/shopware/cdn/fastly-snippets.md)).

Config: `PHP_MAX_UPLOAD_SIZE`, `PHP_MAX_EXECUTION_TIME` as env vars ([PHP settings](platform/dev/6.7/products/paas/shopware/fundamentals/php-settings.md)). Cron jobs: declare in `application.yaml`, deploy, `sw-paas application cronjob update --id <cronjob-id> --enable` (or `--all`), deploy again ([Cron jobs](platform/dev/6.7/products/paas/shopware/guides/cronjobs.md)). Extra queues go in a separate config file, not `operator.yaml` ([message queues](platform/dev/6.7/products/paas/shopware/guides/message-queues.md)). Profilers: `BLACKFIRE_SERVER_ID` + `BLACKFIRE_SERVER_TOKEN` with `services.blackfire.enabled`, or `TIDEWAYS_API_KEY` with `services.tideways.enabled`.

## Essential identifiers

- `sw-paas exec --new` (interactive, existing container) vs `sw-paas command` (new container, non-interactive)
- `shopware/k8s-meta`, `application.yaml`, `.shopware-project.yml`
- Egress IPs (AWS `eu-central-1`): `18.156.111.92`, `52.59.182.116`, `18.159.165.194`

## Gotchas

- AWS `eu-central-1` only. Containers are stateless (use S3); no server customisation; `PHP_SESSION_HANDLER` must not be changed.
- Zero downtime only without migrations; migrations are forward-only. A broken failed deployment needs the infrastructure team, and `exec`/`command` refuse to start after one.
- Skipping `system:update:prepare`/`finish` yields a half-finished upgrade with no error.
- Deleting an extension package before uninstalling it leaves an unloadable registered extension.
- "Runtime extension management is disabled" persists even with `runtime_extension_management: true` — deliberate on PaaS.
- Backups: daily snapshot 01:00–02:00 UTC plus PITR, kept 7 days; object storage RPO about 30 minutes; PITR via support ticket. Clones copy DB and object storage (not code) and are not anonymised.
- OpenSearch indexing is not automatic ([OpenSearch](platform/dev/6.7/products/paas/shopware/guides/opensearch.md)).
- Blackfire and Tideways are mutually exclusive, shop-only, and suppress tracing ([Traces](platform/dev/6.7/products/paas/shopware/monitoring/traces.md)); create the secret before enabling.
- Only `stdout`/`stderr` logs are collected ([Logs](platform/dev/6.7/products/paas/shopware/monitoring/logs.md)).
- Windows/WSL: mTLS tunnels break under NAT; set WSL network mode `Host` or `Mirrored` ([Known issues](platform/dev/6.7/products/paas/shopware/known-issues.md)).

## Code check (6.7.15.1)
- confirmed `system:update:prepare` — console command name — vendor/shopware/core/Maintenance/System/Command/SystemUpdatePrepareCommand.php:22
- confirmed `system:update:finish` — console command name — vendor/shopware/core/Maintenance/System/Command/SystemUpdateFinishCommand.php:30
- confirmed `plugin:list` — console command name — vendor/shopware/core/Framework/Plugin/Command/PluginListCommand.php:29
- confirmed `dal:refresh:index` — console command name — vendor/shopware/core/Framework/DataAbstractionLayer/Command/RefreshIndexCommand.php:23
- confirmed `use-queue` — option of `dal:refresh:index` — vendor/shopware/core/Framework/DataAbstractionLayer/Command/RefreshIndexCommand.php:45
- confirmed `runtime_extension_management` — full key `shopware.deployment.runtime_extension_management`, core default `true` — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:352
- confirmed `disableExtensionManagement` — Admin flag derived from that parameter — vendor/shopware/core/Framework/Api/Controller/InfoController.php:217
- confirmed `keepUserData` — uninstall flag for extensions — vendor/shopware/core/Framework/Store/Services/AbstractExtensionLifecycle.php:18
- unverified `SwagExtensionStore` — separate plugin, not in the Shopware code roots
- unverified `PHP_SESSION_HANDLER` — Docker image / k8s-meta setting, out of scope of vendor/shopware
