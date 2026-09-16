---
id: platform/dev/6.6/resources/references/core-reference/commands-reference.md
title: Commands Reference
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/core-reference/commands-reference.html
sourceHash: 4e1d8bd07e66aaec2f7b6293402bf0a5b757a672
keywords: ["commands reference", "bin/console", "CLI", "cache:clear", "dal:validate", "plugin:install", "system:install", "theme:compile", "sales-channel:create", "messenger:consume", "scheduled-task:run", "console commands", "database:migrate"]
summary: "Reference list of Shopware CLI commands runnable via bin/console, grouped by domain (cache, dal, plugin, system, theme, etc.)."
lastBuilt: 2026-09-15
---
## What it is

Reference listing of the CLI commands available through the Shopware command line interface (`bin/console`), grouped by domain area.

## When to use

Use this page to look up the exact command name for a CLI operation (cache, plugin, theme, database, elasticsearch, messenger, sales channel, system setup, etc.).

## Key steps / config

Commands are invoked as:

```bash
$ bin/console [command] [parameters]
```

Domain groups documented: General, Administration, App, Assets, Bundle, Cache, Cart, Changelog, Config, Customer, Dal, Database, Debug, Es (Elasticsearch), Feature, Framework, Http, Import, Import-export, Lint, Mailer, Media, Messenger, Number-range, Plugin, Product-export, Router, S3, Sales-channel, Scheduled-task, Secrets, Sitemap, Snippets, State-machine, Store, System, Theme, User.

## Essential identifiers

- `cache:clear`, `cache:warmup`, `cache:pool:clear`
- `dal:create:entities`, `dal:create:schema`, `dal:validate`, `dal:refresh:index`
- `database:migrate`, `database:migrate-destructive`, `database:create-migration`
- `plugin:install`, `plugin:activate`, `plugin:refresh`, `plugin:zip-import`
- `app:install`, `app:activate`, `app:validate`
- `theme:compile`, `theme:change`, `theme:refresh`
- `sales-channel:create`, `sales-channel:create:storefront`
- `system:install`, `system:setup`, `system:update:prepare`, `system:update:finish`
- `scheduled-task:run`, `scheduled-task:run-single` (6.5.5.0), `scheduled-task:list` (6.5.5.0)
- `es:index`, `es:reset`, `es:status`
- `messenger:consume`, `messenger:stop-workers`
- `debug:autowiring`, `debug:container`, `debug:router`, `debug:business-events`
- `media:delete-unused` (`--dry-run`, `--grace-period-days=10`, `--folder-entity`)
- `secrets:generate-keys`, `secrets:set`, `secrets:list`
- `user:create`, `user:change-password`

## Gotchas

`scheduled-task:run-single` and `scheduled-task:list` were added in version 6.5.5.0. `media:delete-unused` defaults to a 20-day grace period, so media uploaded in the last 20 days is never deleted by default even if unused.
