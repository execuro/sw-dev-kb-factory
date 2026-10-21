---
id: platform/dev/6.7/resources/references/core-reference/commands-reference.md
title: Commands Reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/core-reference/commands-reference.html
sourceHash: 9439dff48d9a3c4c0bc8a2d8e38e105aa57f5638
codeCheckedAgainst: "6.7.15.1"
keywords: ["bin/console", "cli commands", "console", "system:install", "plugin:install", "app:install", "cache:clear", "theme:compile", "scheduled-task:run", "messenger:consume", "es:index", "media:delete-unused", "make:plugin", "dal:refresh:index", "database:migrate"]
summary: Shopware 6.7 bin/console command list by namespace (system, plugin, app, cache, dal, media, scheduled-task, theme, ...) plus system:install options.
lastBuilt: 2026-10-21
---
## What it is

The list of console commands available in a Shopware 6.7 project, grouped by namespace, run through the project's CLI as `bin/console [command] [parameters]`.

## When to use

When you need the exact name of a setup, maintenance, build or debugging command — installing the system, managing plugins/apps, clearing caches, reindexing, generating thumbnails or scaffolding plugin code.

## Key steps / config

Commands by namespace; `{a,b}` expands to one command per entry, aliases in brackets:

- **General**: `about`, `completion`, `help`, `list`
- **Administration**: `administration:delete-extension-local-public-files` (run after `assets:install`), `administration:delete-files-after-build`
- **App**: `app:{activate,create,deactivate,install,list,uninstall,validate}`, `app:refresh` [`app:update`], `app:secret:rotate` (rotate shared secret and integration credentials), `app:shop-id:change` (change shop ID via a resolution strategy)
- **Assets / Bundle**: `assets:install`, `bundle:dump` [`administration:dump:plugins`, `administration:dump:bundles`]
- **Cache**: `cache:clear`, `cache:clear:{all,delayed,http}`, `cache:pool:{clear,delete,invalidate-tags,list,prune}`, `cache:warmup`, `cache:watch:delayed`
- **Cart**: `cart:migrate` (Redis to database)
- **Config / Customer**: `config:dump-reference`, `customer:delete-unused-guests`
- **DAL**: `dal:create:{entities,hydrators,schema}`, `dal:migration:create`, `dal:refresh:index`, `dal:validate`
- **Database**: `database:{clean-personal-data,create-migration,migrate,migrate-destructive,refresh-migration}`
- **Debug**: `debug:{autowiring,business-events,config,container,dotenv,event-dispatcher,messenger,router,scheduler,serializer,translation,twig,validator}`
- **Elasticsearch**: `es:admin:{index,mapping:update,reset}`, `es:create:alias`, `es:index`, `es:index:cleanup`, `es:mapping:update`, `es:reset`, `es:status`, `es:test:analyzer`
- **Feature**: `feature:{disable,enable,list}`, `feature:dump` [`administration:dump:features`]
- **Framework**: `framework:demodata`, `framework:dump:class:schema`, `framework:schema`
- **Lint**: `lint:{container,translations,twig,xliff,yaml}`
- **Make plugin** (scaffolding): `make:plugin:{admin-module,command,composer,config,custom-fieldset,entity,event-subscriber,javascript-plugin,plugin-class,scheduled-task,store-api-route,storefront-controller,tests}`
- **Media**: `media:delete-local-thumbnails`, `media:delete-unused`, `media:generate-media-types`, `media:generate-thumbnails`, `media:update-path`
- **Messenger**: `messenger:consume`, `messenger:failed:{remove,retry,show}`, `messenger:setup-transports`, `messenger:stats`, `messenger:stop-workers`
- **Plugin**: `plugin:{activate,create,deactivate,install,list,refresh,uninstall,update,zip-import}`, `plugin:update:all`
- **Sales channel**: `sales-channel:create`, `sales-channel:create:storefront`, `sales-channel:list`, `sales-channel:maintenance:{enable,disable}`, `sales-channel:update:domain`
- **Scheduled task**: `scheduled-task:{register,run,run-single,list,deactivate,schedule}`
- **Secrets**: `secrets:{decrypt-to-local,encrypt-from-local,generate-keys,list,remove,reveal,set}`
- **System**: `system:{check,configure-shop,generate-app-secret,install,is-installed,setup}`, `system:config:{get,set}`, `system:setup:staging`, `system:update:{prepare,finish}`; `system:is-installed` returns exit code 0 when installed
- **Theme**: `theme:{change,compile,create,dump,prepare-icons,refresh}`
- **Translation**: `translation:{install,update,list,validate,extract,pull,push}`, `translation:lint-filenames` (`--fix` renames)
- **User**: `user:{change-password,create,list}`
- **Other**: `dotenv:dump`, `error:dump`, `import:entity`, `import-export:delete-expired`, `integration:create`, `mailer:test`, `number-range:migrate`, `product-export:generate`, `router:match`, `s3:set-visibility`, `server:{dump,log}`, `services:install`, `sitemap:generate`, `state-machine:dump`, `store:{download,login}`

`media:delete-unused` options: `--dry-run` (paginated preview, nothing deleted), `--grace-period-days=10` (only media uploaded before now minus n days; default 20), `--folder-entity=PRODUCT` (only that entity's default folder).

`system:install` options (see `bin/console system:install --help`): `--create-database`, `--drop-database`, `--basic-setup` (Storefront sales channel + admin user), `-f`/`--force` (ignore existing `install.lock`), `--no-assign-theme`, `--shop-name`, `--shop-email`, `--shop-locale`, `--shop-currency`, `--skip-assets-install`, `--skip-first-run-wizard`.

## Gotchas

- `make:plugin:*` commands are generated: each service tagged `shopware.scaffold.generator` (a `ScaffoldingGenerator`) becomes `make:plugin:<name>`, derived from its class short name minus `-generator`.
- `media:delete-unused` also accepts `--report`, `--limit` and `--offset` in 6.7.15.1; `--report` and `--dry-run` cannot be combined.
- The aliases `app:url-change:resolve` (for `app:shop-id:change`) and `snippets:validate` (for `translation:validate`) are deprecated and removed in 6.8.0.
- `changelog:{change,check,create,release}` and `es:admin:test` are listed by the source but not defined in the installed core, Storefront or Administration code; `debug:*`, `lint:*`, `secrets:*` and `translation:{extract,pull,push}` are Symfony commands.

## Version notes

- `scheduled-task:run-single` and `scheduled-task:list`: since 6.5.5.0.
- `scheduled-task:deactivate` and `scheduled-task:schedule`: since 6.7.2.0.
- `http:cache:warm:up` is still listed by the source, but no such command is defined in the installed 6.7.15.1 code.

## Code check (6.7.15.1)
- confirmed `system:install` — command name — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:31
- confirmed `skip-first-run-wizard` — one of the eleven documented options, all present — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:60
- confirmed `scheduled-task:deactivate` — command name — vendor/shopware/core/Framework/MessageQueue/Command/DeactivateScheduledTaskCommand.php:18
- confirmed `grace-period-days` — default 20 as documented — vendor/shopware/core/Content/Media/Commands/DeleteNotUsedMediaCommand.php:46
- confirmed `make:plugin:` — prefix built from tagged scaffolding generator class names — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/CreateGeneratorScaffoldingCommandPass.php:42
- confirmed `cart:migrate` — migrates carts from Redis to database — vendor/shopware/core/Checkout/Cart/Command/CartMigrateCommand.php:31
- deprecated `app:url-change:resolve` — alias of `app:shop-id:change`, removed in v6.8.0 — vendor/shopware/core/Framework/App/Command/ChangeShopIdCommand.php:23
- deprecated `snippets:validate` — alias of `translation:validate`, removed in v6.8.0 — vendor/shopware/core/System/Snippet/Command/ValidateSnippetsCommand.php:50
- unverified `http:cache:warm:up` — no definition found in vendor/shopware core, storefront or administration
- unverified `translation:pull` — Symfony framework command, vendor/symfony out of scope
