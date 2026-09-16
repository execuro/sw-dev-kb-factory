---
id: platform/dev/6.7/guides/hosting/installation-updates/creating-a-staging-instance.md
title: Creating Staging Instance
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/installation-updates/creating-a-staging-instance.html
sourceHash: cab669b88579b3649ccc34d90fb4517117fd8da8
codeCheckedAgainst: "6.7.13.0"
keywords: ["staging", "staging mode", "system:setup:staging", "shopware.staging", "domain_rewrite", "SetupStagingEvent", "shopware-cli project dump", "anonymize database", "SHOPWARE_ES_INDEX_PREFIX", "core.app.shopId", "test environment", "staging.yaml", "disable_delivery"]
summary: Build a staging copy of a shop (DB dump, separate .env) and activate staging mode with system:setup:staging and config/packages/staging.yaml.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/tools/cli/installation.md", "platform/dev/6.7/products/tools/cli/project-commands/mysql-dump.md"]
---
## What it is

Guide for creating a staging environment (a non-production copy of the shop: own hosting, domain, database, Redis, search index prefix, `.env`) and then enabling Shopware's staging mode (since 6.6.1.0) on it, which adjusts data inside that instance so it does not mail customers, keep live app connections or live sales channel URLs.

## When to use

Testing updates, extensions or features on a copy of production data without affecting the live shop.

## Key steps / config

1. Deploy the same codebase to a separate installation (preferably from Git), on its own domain/subdomain; update `APP_URL` in `.env`. Keep the live domain as the license domain in the Shopware Account.
2. Duplicate the live database. Recommended: `shopware-cli` (see [installation](platform/dev/6.7/products/tools/cli/installation.md), [dump options via `.shopware-project.yml`](platform/dev/6.7/products/tools/cli/project-commands/mysql-dump.md)):

```bash
shopware-cli project dump --clean --host localhost --username db_user --password db_pass --output shop.sql shopware
shopware-cli project dump --clean --anonymize --host localhost --username db_user --password db_pass --output shop.sql shopware
```

`--clean` excludes cart data, `--anonymize` removes personal data. `mysqldump` and `mysql` must be the same vendor and major version.
3. Point `.env` to the staging database; with Elasticsearch/OpenSearch set a distinct `SHOPWARE_ES_INDEX_PREFIX`. Never share MySQL, Redis or search servers with live.
4. Activate staging mode: `./bin/console system:setup:staging` (add `--no-interaction --force` to skip the confirmation). It deletes apps with external connections and their integrations, resets the app instance ID, disables mail delivery, rewrites sales channel URLs, verifies no search indices exist, and shows admin/storefront banners. It does not copy code, database or files.

Configuration in `config/packages/staging.yaml` (defaults from code):

```yaml
shopware:
    staging:
        mailing: { disable_delivery: true }
        storefront: { show_banner: true }
        administration: { show_banner: true }
        sales_channel:
            domain_rewrite:
                - { type: equal, match: 'https://my-live-store.com', replace: 'https://my-staging-store.com' }
        elasticsearch: { check_for_existence: true }
```

`domain_rewrite.type`: `equal` (default; exact URL match), `prefix` (replace the URL start, e.g. `/en` path kept), `regex` (`match` is a PCRE such as `'/https?:\/\/(\w+)\.(\w+)$/m'`, `replace` may use `$1`, `$2`). The installed code also accepts `extensions.disable` (list of extensions) and `system_config` overrides under `shopware.staging`.

5. After staging mode, reinstall needed apps to get new, isolated instance IDs.
6. Protect access (basic auth, IP firewall, OAuth proxy). Apache example keeps `/api` open:

```apache
SetEnvIf Request_URI /api noauth=1
<RequireAny>
Require env noauth
Require env REDIRECT_noauth
Require valid-user
</RequireAny>
```

7. Plugins can react via `Shopware\Core\Maintenance\Staging\Event\SetupStagingEvent` (subscribe with `EventSubscriberInterface::getSubscribedEvents()` returning `[SetupStagingEvent::class => 'onSetupStaging']`), e.g. to switch a payment provider to test mode.

## Essential identifiers

- `system:setup:staging` (`--force`)
- `shopware.staging.mailing.disable_delivery`, `.storefront.show_banner`, `.administration.show_banner`, `.sales_channel.domain_rewrite`, `.elasticsearch.check_for_existence`
- `Shopware\Core\Maintenance\Staging\Event\SetupStagingEvent`
- `shopware-cli project dump --clean --anonymize`
- `SHOPWARE_ES_INDEX_PREFIX`, `APP_URL`

## Gotchas

- Without staging mode, manually disable mail sending and delete `core.app.shopId` from `system_config`, otherwise apps leak data between live and staging.
- `SetupStagingEvent` is marked `@internal` in the installed code, so its constructor/properties may change without deprecation.
- With `ComposerPluginLoader`, extensions listed for disabling cannot be disabled by the command; uninstall them with Composer.
- The command sets system config flag `core.staging` after dispatching the event.

## Version notes

- 6.6.1.0: staging mode and `system:setup:staging` introduced.

## Code check (6.7.13.0)
- confirmed `system:setup:staging` — command, confirmation skipped with `--force` — vendor/shopware/core/Maintenance/Staging/Command/SystemSetupStagingCommand.php:24
- confirmed `SetupStagingEvent` — dispatched by the command; class is `@internal` — vendor/shopware/core/Maintenance/Staging/Event/SetupStagingEvent.php:15
- confirmed `SetupStagingEvent::CONFIG_FLAG` — value `core.staging` — vendor/shopware/core/Maintenance/Staging/Event/SetupStagingEvent.php:17
- confirmed `staging.mailing.disable_delivery` — default true — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1228
- confirmed `staging.storefront.show_banner` — default true (administration likewise) — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1233
- confirmed `domain_rewrite.type` — default `equal` — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1254
- confirmed `regex` — rewrite types equal/regex/prefix handled — vendor/shopware/core/Maintenance/Staging/Handler/StagingSalesChannelHandler.php:40
- confirmed `staging.elasticsearch.check_for_existence` — default true — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1263
- confirmed `core.app.shopId` — `ShopIdProvider::SHOP_ID_SYSTEM_CONFIG_KEY` — vendor/shopware/core/Framework/App/ShopId/ShopIdProvider.php:23
- confirmed `SHOPWARE_ES_INDEX_PREFIX` — env var, default `sw` — vendor/shopware/core/Installer/Configuration/EnvConfigWriter.php:51
