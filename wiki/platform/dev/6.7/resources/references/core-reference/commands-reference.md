---
id: platform/dev/6.7/resources/references/core-reference/commands-reference.md
title: Commands Reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/core-reference/commands-reference.html
sourceHash: 65e4715186ad15042ea888b63e7f22c168b56cc8
codeCheckedAgainst: "6.7.13.0"
keywords: ["bin/console", "cli", "console commands", "cache:clear", "plugin:install", "theme:compile", "scheduled-task:run", "messenger:consume", "dal:refresh:index", "media:delete-unused", "system:install", "make:plugin", "translation:install", "bundle:dump", "symfony console"]
summary: "Shopware 6.7 bin/console commands by namespace: app, cache, dal, database, es, media, plugin, scheduled-task, system, theme, translation, make:plugin."
lastBuilt: 2026-09-15
---
## What it is

The list of `bin/console` commands available in a Shopware 6.7 project, grouped by namespace (Shopware-specific plus Symfony framework commands), with one-line descriptions.

## When to use

When you need the exact name of a CLI command for maintenance, deployment, plugin/app lifecycle, indexing, caching, scaffolding or debugging.

## Key steps / config

Run from the project root: `bin/console [command] [parameters]`.

- General: `about`, `completion`, `help`, `list`.
- Administration: `administration:delete-extension-local-public-files`, `administration:delete-files-after-build`.
- App: `app:activate`, `app:create`, `app:deactivate`, `app:install`, `app:list`, `app:refresh` (alias `app:update`), `app:uninstall`, `app:url-change:resolve`, `app:validate`.
- Assets / bundle: `assets:install`; `bundle:dump` (aliases `administration:dump:plugins`, `administration:dump:bundles`).
- Cache: `cache:clear`, `cache:clear:all`, `cache:clear:delayed`, `cache:clear:http`, `cache:warmup`, `cache:watch:delayed`, `cache:pool:clear|delete|invalidate-tags|list|prune`; `http:cache:warm:up`.
- Cart / number range: `cart:migrate` (redis carts to database), `number-range:migrate`.
- Changelog: `changelog:change|check|create|release`.
- Customer: `customer:delete-unused-guests`.
- DAL: `dal:create:entities`, `dal:create:hydrators`, `dal:create:schema`, `dal:migration:create`, `dal:refresh:index`, `dal:validate`.
- Database: `database:migrate`, `database:migrate-destructive`, `database:create-migration`, `database:refresh-migration`, `database:clean-personal-data`.
- Debug: `debug:business-events` plus Symfony `debug:autowiring|config|container|dotenv|event-dispatcher|messenger|router|scheduler|serializer|translation|twig|validator`.
- Elasticsearch: `es:index`, `es:index:cleanup`, `es:reset`, `es:status`, `es:create:alias`, `es:mapping:update`, `es:test:analyzer`, `es:admin:index|mapping:update|reset|test`.
- Feature flags: `feature:enable`, `feature:disable`, `feature:list`, `feature:dump` (alias `administration:dump:features`).
- Framework / data: `framework:demodata`, `framework:dump:class:schema`, `framework:schema`, `import:entity` (CSV), `import-export:delete-expired`, `integration:create`.
- Lint / mail: `lint:container|translations|twig|xliff|yaml`, `mailer:test`.
- Scaffolding: `make:plugin:` + `admin-module`, `command`, `composer`, `config`, `custom-fieldset`, `entity`, `event-subscriber`, `javascript-plugin`, `plugin-class`, `scheduled-task`, `store-api-route`, `storefront-controller`, `tests`.
- Media: `media:delete-local-thumbnails`, `media:delete-unused` (`--dry-run`, `--grace-period-days=10`, `--folder-entity=PRODUCT`), `media:generate-media-types`, `media:generate-thumbnails`, `media:update-path`.
- Messenger: `messenger:consume`, `messenger:failed:remove|retry|show`, `messenger:setup-transports`, `messenger:stats`, `messenger:stop-workers`.
- Plugin: `plugin:refresh`, `plugin:install`, `plugin:activate`, `plugin:deactivate`, `plugin:uninstall`, `plugin:update`, `plugin:update:all`, `plugin:create`, `plugin:list`, `plugin:zip-import`.
- Sales channel: `sales-channel:create`, `sales-channel:create:storefront`, `sales-channel:list`, `sales-channel:maintenance:enable|disable`, `sales-channel:update:domain`.
- Scheduled tasks: `scheduled-task:register`, `scheduled-task:run`, `scheduled-task:run-single`, `scheduled-task:list`, `scheduled-task:deactivate`, `scheduled-task:schedule`.
- Secrets: `secrets:set|reveal|list|remove|generate-keys|decrypt-to-local|encrypt-from-local`.
- System: `system:install`, `system:setup`, `system:setup:staging`, `system:configure-shop`, `system:check`, `system:is-installed`, `system:config:get`, `system:config:set`, `system:generate-app-secret`, `system:update:prepare`, `system:update:finish`.
- Theme: `theme:change`, `theme:compile`, `theme:create`, `theme:dump`, `theme:prepare-icons`, `theme:refresh`.
- Translation: `translation:install`, `translation:update`, `translation:list`, `translation:extract`, `translation:lint-filenames` (`--fix`), `translation:pull`, `translation:push`, `translation:validate`.
- Other: `product-export:generate`, `router:match`, `s3:set-visibility`, `services:install`, `sitemap:generate`, `state-machine:dump`, `store:download`, `store:login`, `user:create`, `user:list`, `user:change-password`, `dotenv:dump`, `error:dump`, `server:dump`, `server:log`.

## Gotchas

- `administration:delete-extension-local-public-files` should run after `assets:install`.
- `media:delete-unused` skips media uploaded within the grace period (default 20 days); try `--dry-run` first.
- `system:is-installed` returns exit code 0 when Shopware is installed — usable in scripts.
- `snippets:validate` is only a deprecated alias of `translation:validate` in 6.7, removed in 6.8.
- `es:*` commands come from the Elasticsearch bundle.

## Version notes

- `scheduled-task:run-single` and `scheduled-task:list`: since 6.5.5.0. `scheduled-task:deactivate` and `scheduled-task:schedule`: since 6.7.2.0.

## Code check (6.7.13.0)
- confirmed `scheduled-task:deactivate` — AsCommand name — vendor/shopware/core/Framework/MessageQueue/Command/DeactivateScheduledTaskCommand.php:17
- confirmed `scheduled-task:schedule` — AsCommand name — vendor/shopware/core/Framework/MessageQueue/Command/ScheduleScheduledTaskCommand.php:17
- confirmed `app:refresh` — alias `app:update` — vendor/shopware/core/Framework/App/Command/RefreshAppCommand.php:26
- confirmed `bundle:dump` — aliases `administration:dump:plugins`, `administration:dump:bundles` — vendor/shopware/core/Framework/Plugin/Command/BundleDumpCommand.php:14
- confirmed `feature:dump` — alias `administration:dump:features` — vendor/shopware/core/Framework/Feature/Command/FeatureDumpCommand.php:15
- confirmed `grace-period-days` — `media:delete-unused` option, default 20 — vendor/shopware/core/Content/Media/Commands/DeleteNotUsedMediaCommand.php:46
- confirmed `translation:validate` — AsCommand name — vendor/shopware/core/System/Snippet/Command/ValidateSnippetsCommand.php:26
- deprecated `snippets:validate` — alias removed in v6.8.0 — vendor/shopware/core/System/Snippet/Command/ValidateSnippetsCommand.php:21
- confirmed `make:plugin:` — scaffolding commands registered with this prefix — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/CreateGeneratorScaffoldingCommandPass.php:42
- unverified `es:index` — shopware/elasticsearch package, outside the checked roots
