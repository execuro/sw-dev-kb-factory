---
id: platform/dev/6.7/guides/installation/legacy-setups/devenv-options.md
title: Additional Devenv Config
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/installation/legacy-setups/devenv-options.html
sourceHash: c55fd3472f17187628f29688b23cecc120a5798a
codeCheckedAgainst: "6.7.13.0"
keywords: ["devenv.local.nix", "devenv reload", "devenv gc", "devenv down", "services.blackfire", "languages.php.extensions", "xdebug", "services.mysql.package", "mariadb", "services.caddy.virtualHosts", "services.adminer.listen", "services.varnish", "xkey", "overrideAttrs", "pin package version"]
summary: "Devenv devenv.local.nix recipes: Blackfire, Xdebug, MariaDB, MySQL/Caddy/Adminer ports, Varnish with xkey, pinned package versions, cleanup."
lastBuilt: 2026-09-15
---
## What it is

A collection of optional overrides for a Devenv-based Shopware development environment. Every snippet goes into `<PROJECT_ROOT>/devenv.local.nix`, which wraps its settings in `{ pkgs, config, lib, ... }: { ... }`.

## When to use

You already run Shopware with Devenv and need profiling/debugging, a different database engine, non-default ports or virtual hosts, a local Varnish reverse cache, an older service version, or want to clean up the Nix store.

## Key steps / config

All options below are Devenv/Nix options set in `devenv.local.nix`; apply changes with `devenv reload`.

- **Blackfire**: `services.blackfire.enable = true;` plus `services.blackfire.server-id`, `services.blackfire.server-token`, `services.blackfire.client-id`, `services.blackfire.client-token` (your credentials).
- **Xdebug**:
  ```nix
  languages.php.extensions = [ "xdebug" ];
  languages.php.ini = ''
    xdebug.mode = debug
    xdebug.discover_client_host = 1
    xdebug.client_host = 127.0.0.1
  '';
  ```
- **MariaDB instead of MySQL**: `services.mysql.package = pkgs.mariadb;`
- **Custom MySQL port**: `services.mysql.settings = { mysqld = { port = 33881; }; };`
- **Caddy port / virtual host**: define `services.caddy.virtualHosts.":8029"` (port only) or a key with scheme, host and port such as `shopware.swag:8029` prefixed with the http scheme, each with:
  ```nix
  extraConfig = ''
    root * public
    php_fastcgi unix/${config.languages.php.fpm.pools.web.socket}
    file_server
  '';
  ```
- **Adminer port**: `services.adminer.listen = "127.0.0.1:9084";`
- **Varnish**: enable `services.caddy` with a localhost virtual host that does `reverse_proxy 127.0.0.1:6081` (with `header_up Host sw.localhost`), and serve the app itself from a second virtual host `sw.localhost` (add it to `/etc/hosts` if needed). Then:
  ```nix
  services.varnish = {
    enable = true;
    package = pkgs.varnish;
    listen = "127.0.0.1:6081";
    extraModules = [ pkgs.varnishPackages.modules ]; # xkey module
    vcl = '' backend default { .host = "sw.localhost"; .port = "80"; } acl purgers { ... } '';
  };
  ```
  The VCL is a slightly adjusted version of the Shopware reverse-HTTP-cache Varnish config; the `purgers` ACL must contain the app server addresses (`sw.localhost`, `127.0.0.1`, `localhost`, `::1`).
- **Pin an older package**: wrap the package in `let ... in` with `overrideAttrs`, e.g. `pkgs.mysql80.overrideAttrs (oldAttrs: { version = "8.0.33"; src = pkgs.fetchFromGitHub { owner = "mysql"; repo = "mysql-server"; rev = "mysql-8.0.33"; sha256 = "..."; }; })`, then set `package = mysql8033;`. RabbitMQ works the same with `pkgs.rabbitmq-server.overrideAttrs` and `pkgs.fetchurl`.
- **Maintenance**: `devenv gc` removes unused packages, services and caches; `devenv down` stops services.

## Essential identifiers

- `devenv.local.nix`, `devenv reload`, `devenv gc`, `devenv down`
- `services.blackfire.*`, `languages.php.extensions`, `languages.php.ini`
- `services.mysql.package`, `services.mysql.settings`
- `services.caddy.virtualHosts`, `config.languages.php.fpm.pools.web.socket`
- `services.adminer.listen`, `services.varnish`, `pkgs.varnishPackages.modules`

## Gotchas

- Leave `sha256` empty on the first run of a pinned fetch; Nix prompts with the expected hash.
- Pinning versions may increase build time; use only when necessary.
- If processes remain after `devenv down`, as a last resort kill processes whose command line contains `/nix/store`.
- If the app at `127.0.0.1:8000` is not reachable in the browser, try `localhost:8000` instead; common on WSL2 under Windows. On macOS/Linux, `127.0.0.1:8000` should work.

## Code check (6.7.13.0)
- unverified `services.varnish` — Devenv/Nix option, outside vendor/shopware scope
- unverified `services.caddy.virtualHosts` — Devenv/Nix option, outside vendor/shopware scope
- unverified `languages.php.extensions` — Devenv/Nix option, outside vendor/shopware scope
- unverified `services.blackfire.enable` — Devenv/Nix option, outside vendor/shopware scope
- confirmed `xkey` — Varnish gateway purges by the xkey header, matching the xkey module requirement — vendor/shopware/core/Framework/Adapter/Cache/ReverseProxy/VarnishReverseProxyGateway.php:54
- confirmed `VarnishReverseProxyGateway` — core Varnish reverse proxy gateway class exists — vendor/shopware/core/Framework/Adapter/Cache/ReverseProxy/VarnishReverseProxyGateway.php:21
