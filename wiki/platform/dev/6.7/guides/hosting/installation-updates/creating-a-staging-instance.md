---
id: platform/dev/6.7/guides/hosting/installation-updates/creating-a-staging-instance.md
title: Creating Staging Instance
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/installation-updates/creating-a-staging-instance.html
sourceHash: 22ec26ac9939f1453f15666a7a8413910e507c46
codeCheckedAgainst: "6.7.15.1"
keywords: ["staging", "staging mode", "system:setup:staging", "staging.yaml", "shopware.staging", "domain_rewrite", "SetupStagingEvent", "shopware-cli project dump", "SHOPWARE_ES_INDEX_PREFIX", "core.app.shopId", "test environment", "database copy", "anonymize"]
summary: Building a staging copy of a Shopware shop (DB dump, .env) and activating staging mode via system:setup:staging and shopware.staging config.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/tools/cli/installation.md", "platform/dev/6.7/products/tools/cli/project-commands/mysql-dump.md"]
---
## What it is

How to create a staging copy of a live shop and how to switch on Shopware's **staging mode** (since 6.6.1.0) on it. The staging environment (separate hosting, domain, database, Redis, search index prefix, `.env`) is your deployment work; staging mode is a console command that adjusts data inside that copy so it does not email customers, keep live app connections or live sales channel URLs.

## When to use

When setting up a test/staging instance from production data, or when a plugin must change its own data (e.g. switch a payment provider to test mode) when a staging copy is prepared.

## Key steps / config

1. **Install a separate Shopware instance** — preferably deploy from your Git repository; copying files also works. Use a separate (sub)domain and update `APP_URL` in `.env`. Keep the live domain under `Shopware Account > License Domain`.
2. **Duplicate the live database** — `mysqldump`/`mysql` must come from the same vendor and major version. Recommended: `shopware-cli` ([installation](platform/dev/6.7/products/tools/cli/installation.md)):
   ```bash
   shopware-cli project dump --clean --host localhost --username db_user --password db_pass --output shop.sql shopware
   shopware-cli project dump --clean --anonymize --host localhost --username db_user --password db_pass --output shop.sql shopware
   ```
   `--clean` excludes cart data; `--anonymize` removes personal data. Configure skipped tables/anonymized fields in `.config/shopware-project.yml` ([dump docs](platform/dev/6.7/products/tools/cli/project-commands/mysql-dump.md)).
3. **Configure the instance** — point `.env` at the staging database; with Elasticsearch/OpenSearch set `SHOPWARE_ES_INDEX_PREFIX`. Never share MySQL, Redis or search servers with live.
4. **Activate staging mode** — `./bin/console system:setup:staging` (add `--no-interaction --force` to skip the confirmation). It deletes apps with external connections and their integrations, resets the app instance ID, disables mail delivery, rewrites sales channel URLs (if configured), checks that no search indices exist, and shows a staging banner in Administration and Storefront. It does not copy installations, databases or files, nor touch live.

`config/packages/staging.yaml` (all booleans default `true`):

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

`domain_rewrite` rule `type`: `equal` (exact URL match, the default), `prefix` (replace leading part, `/en` paths kept) or `regex` (pattern in `match`, backreferences like `$1` in `replace`). The installed code also accepts `extensions.disable` (list) and `system_config` overrides under `shopware.staging`.

Plugin hook: subscribe to `Shopware\Core\Maintenance\Staging\Event\SetupStagingEvent`:

```php
class StagingSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [SetupStagingEvent::class => 'onSetupStaging'];
    }
    public function onSetupStaging(SetupStagingEvent $event): void { /* enable test mode */ }
}
```

## Essential identifiers

- `system:setup:staging` (`--force`)
- `Shopware\Core\Maintenance\Staging\Event\SetupStagingEvent`
- `shopware.staging.mailing.disable_delivery`, `shopware.staging.storefront.show_banner`, `shopware.staging.administration.show_banner`, `shopware.staging.sales_channel.domain_rewrite`, `shopware.staging.elasticsearch.check_for_existence`
- `SHOPWARE_ES_INDEX_PREFIX`, `APP_URL`
- `shopware-cli project dump`

## Gotchas

- Without staging mode, disable mail sending yourself and delete `core.app.shopId` from `system_config`, otherwise app data leaks between live and staging. 6.7.15.1 additionally stores `core.app.shopIdV2`.
- After running the command, reinstall apps so they get new instance IDs.
- The command overwrites data in the configured database — run it only against the staging database.
- Protect staging via basic auth (`.htaccess`/`auth_basic`), IP restriction, or an auth proxy; the source's Apache example exempts `/api` via `SetEnvIf Request_URI /api noauth=1`.

## Version notes

- Staging mode (`system:setup:staging`) is available since 6.6.1.0.

## Code check (6.7.15.1)
- confirmed `system:setup:staging` — command name — vendor/shopware/core/Maintenance/Staging/Command/SystemSetupStagingCommand.php:25
- confirmed `force` — option skipping confirmation — vendor/shopware/core/Maintenance/Staging/Command/SystemSetupStagingCommand.php:48
- confirmed `SetupStagingEvent` — dispatched by the command — vendor/shopware/core/Maintenance/Staging/Command/SystemSetupStagingCommand.php:68
- confirmed `disable_delivery` — staging.mailing, default true — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1264
- confirmed `show_banner` — storefront and administration, default true — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1269
- confirmed `domain_rewrite` — list of match/type/replace, type default `equal` — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1286
- confirmed `check_for_existence` — staging.elasticsearch, default true — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1299
- confirmed `regex` — rewrite types equal/regex/prefix handled — vendor/shopware/core/Maintenance/Staging/Handler/StagingSalesChannelHandler.php:40
- confirmed `core.app.shopId` — ShopIdProvider config key (plus `core.app.shopIdV2`) — vendor/shopware/core/Framework/App/ShopId/ShopIdProvider.php:23
- unverified `SHOPWARE_ES_INDEX_PREFIX` — Elasticsearch package, outside the checked roots
