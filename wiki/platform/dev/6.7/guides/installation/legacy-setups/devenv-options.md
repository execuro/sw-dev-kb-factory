---
id: platform/dev/6.7/guides/installation/legacy-setups/devenv-options.md
title: Additional Devenv Config
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/installation/legacy-setups/devenv-options.html
sourceHash: 0c2573f93d36bc4b53e1d0b5bde23c0f69315640
codeCheckedAgainst: "6.7.15.1"
keywords: ["devenv", "devenv.local.nix", "devenv.local.yaml", "lib.mkForce", "xdebug", "blackfire", "rabbitmq", "opensearch", "mariadb", "MESSENGER_TRANSPORT_DSN", "APP_URL", "sales-channel:update:domain", "varnish", "caddy virtualHosts", "nix"]
summary: Devenv overrides in devenv.local.nix - Blackfire, Xdebug, RabbitMQ, OpenSearch, MariaDB, custom ports/vhosts, Varnish, pinned package versions.
lastBuilt: 2026-10-21
---
## What it is

Optional overrides for the legacy Devenv setup. All snippets go into `devenv.local.nix` in the project root, which Devenv merges with the `devenv.nix` from `frosh/devenv-meta`. After changes run `devenv down` and `devenv up` (without Direnv, also re-enter the Devenv shell).

## When to use

Enabling profiling/debugging or extra services, switching the database, resolving port conflicts, running several projects at once, or matching production package versions in a Devenv-based project.

## Key steps / config

Every file starts with `{ pkgs, config, lib, ... }:` followed by an attribute set:

```nix
{
  services.blackfire.enable = true;           # plus server-id/server-token/client-id/client-token
  languages.php.extensions = [ "xdebug" ];    # languages.php.ini: xdebug.mode = debug ...
  services.rabbitmq.enable = true;
  services.rabbitmq.managementPlugin.enable = true;
  services.opensearch.enable = true;
  services.mysql.package = lib.mkForce pkgs.mariadb;
  services.mysql.settings.mysqld.port = 3307;
  services.adminer.listen = "127.0.0.1:8011";
}
```

- **RabbitMQ:** Devenv enables the `amqp` PHP extension and sets `MESSENGER_TRANSPORT_DSN` to `amqp://guest:guest@127.0.0.1:5672/%2f/messages`; also run `composer require symfony/amqp-messenger`.
- **OpenSearch:** Devenv sets `OPENSEARCH_URL` (127.0.0.1 port 9200), `SHOPWARE_ES_ENABLED=1` and `SHOPWARE_ES_INDEXING_ENABLED=1`; then run `bin/console es:index`.
- **Custom MySQL port:** `DATABASE_URL` follows automatically.
- **Caddy port / vhost:** replace the default vhost with `services.caddy.virtualHosts = lib.mkForce { ":8001".extraConfig = '' root * public  php_fastcgi unix/${config.languages.php.fpm.pools.web.socket} ... ''; };` and set `env.APP_URL` to the matching URL (127.0.0.1 port 8001, or a custom host such as `shopware.swag` resolved via `/etc/hosts`).
- **Already installed shop:** update the domain in Administration (**Sales Channels > Storefront > Domains**) or run an SQL `UPDATE sales_channel_domain SET url = ...` via `mysql ... -P "$MYSQL_TCP_PORT"` in a fresh Devenv shell, then `bin/console cache:clear`.
- **Multiple projects:** move ports — Caddy vhost + `env.APP_URL`, `services.mysql.settings.mysqld.port`, `services.redis.port = 6380`, `services.mailpit.smtpListenAddress`, `services.mailpit.uiListenAddress`, `services.adminer.listen`. `DATABASE_URL`, `MAILER_DSN` and the Redis session configuration follow.
- **Varnish:** `services.caddy` proxies localhost to Varnish (`reverse_proxy 127.0.0.1:6081` with `header_up Host sw.localhost`) and serves Shopware on `sw.localhost`; `services.varnish` with `listen = "127.0.0.1:6081"`, `extraModules = [ pkgs.varnishPackages.modules ]` (xkey) and a `vcl` whose `backend default` and `acl purgers` point at `sw.localhost`.
- **Older package version:** add an input in `devenv.local.yaml` (`inputs.nixpkgs-mysql80.url: github:NixOS/nixpkgs/nixos-25.05`), import it in a `let` block and set `services.mysql.package = lib.mkForce pkgs-mysql80.mysql80;`. For the whole team use `devenv.yaml`/`devenv.nix` and commit `devenv.lock`.

## Essential identifiers

- `devenv.local.nix`, `devenv.local.yaml`, `lib.mkForce`
- `MESSENGER_TRANSPORT_DSN`, `APP_URL`, `DATABASE_URL`, `MYSQL_TCP_PORT`
- `sales_channel_domain`, `bin/console cache:clear`, `bin/console es:index`

## Gotchas

- `lib.mkForce` is needed for MariaDB (default sets the MySQL package) and for vhosts (otherwise Caddy still listens on port 8000 alongside yours).
- MySQL and MariaDB cannot share a data directory, and MySQL cannot open a directory created by a newer version: remove `<PROJECT_ROOT>/.devenv/state/mysql` (deletes the local DB) and reinstall.
- `bin/console sales-channel:update:domain` only replaces the host and keeps the old port, so it cannot change the port.
- Maintenance: `devenv down` stops services started with `devenv up -d` (foreground: `Ctrl+C`); `devenv gc` then `nix store gc` free disk space. On WSL2 use localhost instead of 127.0.0.1 if port 8000 is unreachable.

## Code check (6.7.15.1)
- confirmed `sales-channel:update:domain` — console command name — vendor/shopware/core/Maintenance/SalesChannel/Command/SalesChannelUpdateDomainCommand.php:25
- confirmed `SalesChannelUpdateDomainCommand::replaceDomain()` — replaces only `host`, port is re-appended — vendor/shopware/core/Maintenance/SalesChannel/Command/SalesChannelUpdateDomainCommand.php:67
- confirmed `sales_channel_domain` — entity/table name — vendor/shopware/core/System/SalesChannel/Aggregate/SalesChannelDomain/SalesChannelDomainDefinition.php:34
- confirmed `MESSENGER_TRANSPORT_DSN` — env var feeding the messenger transport, default doctrine DSN — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:3
- unverified `es:index` — Elasticsearch package, outside the checked roots
- unverified `SHOPWARE_ES_ENABLED` — Elasticsearch package config, outside the checked roots
- unverified `devenv.local.nix` — Devenv / frosh/devenv-meta tooling, out of scope
