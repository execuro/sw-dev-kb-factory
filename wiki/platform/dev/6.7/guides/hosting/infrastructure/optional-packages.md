---
id: platform/dev/6.7/guides/hosting/infrastructure/optional-packages.md
title: Optional Packages
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/infrastructure/optional-packages.html
sourceHash: 68854461a5f9eb31d090563f5c36d87ff34caa48
codeCheckedAgainst: "6.7.15.1"
keywords: ["optional packages", "shopware/dev-tools", "shopware/paas-meta", "shopware/fastly-meta", "composer require", "symfony profiler", "paas", "fastly", "minimal project template", "ext-amqp", "dev tooling"]
summary: Composer packages for the minimal Shopware project template - shopware/dev-tools (profiler), shopware/paas-meta (PaaS), shopware/fastly-meta.
lastBuilt: 2026-10-21
---
## What it is

The minimal Shopware project template ships without infrastructure integrations or developer tooling. This page lists the optional Composer packages that add them.

## When to use

- You want the Symfony profiler and related development tools in a local or dev setup.
- You deploy to a Platform-as-a-Service environment.
- You put Fastly in front of the shop as reverse HTTP cache.

## Key steps / config

| Purpose | Command |
|---|---|
| Symfony profiler and development tools | `composer require --dev shopware/dev-tools` |
| PaaS integration | `composer require shopware/paas-meta --ignore-platform-req=ext-amqp` |
| Fastly integration | `composer require shopware/fastly-meta` |

Install `shopware/dev-tools` as a dev dependency (`--dev`). The PaaS meta package is installed with `--ignore-platform-req=ext-amqp`, which tells Composer not to enforce the `amqp` PHP extension requirement at install time.

## Essential identifiers

- `shopware/dev-tools`
- `shopware/paas-meta`
- `shopware/fastly-meta`

## Gotchas

- Without `shopware/dev-tools`, the core demo-data command refuses to run and asks you to install that package.
- `shopware/fastly-meta` only adds the package; Fastly is still switched on through `shopware.http_cache.reverse_proxy.fastly` in `shopware.yaml` (see the Reverse HTTP Cache page).

## Code check (6.7.15.1)
- confirmed `shopware/dev-tools` — listed in core composer suggest for profiler/faker — vendor/shopware/core/composer.json:162
- confirmed `shopware/dev-tools` — demo-data command requires it — vendor/shopware/core/Framework/Demodata/Command/DemodataCommand.php:177
- confirmed `reverse_proxy.fastly` — Fastly config node in core — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1458
- unverified `shopware/paas-meta` — separate Composer meta package, not in the code roots
- unverified `shopware/fastly-meta` — separate Composer meta package, not in the code roots
