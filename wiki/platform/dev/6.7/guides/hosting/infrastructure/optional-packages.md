---
id: platform/dev/6.7/guides/hosting/infrastructure/optional-packages.md
title: Optional Packages
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/infrastructure/optional-packages.html
sourceHash: 68854461a5f9eb31d090563f5c36d87ff34caa48
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopware/dev-tools", "shopware/paas-meta", "shopware/fastly-meta", "composer require", "ext-amqp", "symfony profiler", "minimal project template", "paas", "fastly", "optional packages", "developer tooling"]
summary: Composer packages to add to the minimal Shopware project template - shopware/dev-tools (profiler), shopware/paas-meta (PaaS), shopware/fastly-meta (Fastly).
lastBuilt: 2026-09-15
---
## What it is

The minimal Shopware project template ships without infrastructure integrations or developer tooling. This page lists the optional Composer meta-packages that add them.

## When to use

When a project created from the minimal template needs the Symfony profiler and dev tools, a Platform-as-a-Service integration, or Fastly support.

## Key steps / config

Install only what the project needs:

| Purpose | Command |
|---|---|
| Symfony profiler and related development tools | `composer require --dev shopware/dev-tools` |
| PaaS integration | `composer require shopware/paas-meta --ignore-platform-req=ext-amqp` |
| Fastly integration | `composer require shopware/fastly-meta` |

## Essential identifiers

- `shopware/dev-tools` (require-dev)
- `shopware/paas-meta`
- `shopware/fastly-meta`
- `--ignore-platform-req=ext-amqp`

## Gotchas

- `shopware/dev-tools` is a development dependency — install it with `--dev` so it is not part of production installs.
- The PaaS command passes `--ignore-platform-req=ext-amqp`, so Composer does not fail when the PHP `amqp` extension is missing locally.
- The meta-packages only pull in dependencies; the Fastly integration itself is configured in core (a `fastly` node exists in the reverse-proxy config, backed by `FastlyReverseProxyGateway`).

## Code check (6.7.13.0)
- unverified `shopware/dev-tools` — composer package outside the checked roots (core, storefront, administration src)
- unverified `shopware/paas-meta` — composer meta-package, not part of the checked roots
- unverified `shopware/fastly-meta` — composer meta-package, not part of the checked roots
- unverified `ext-amqp` — Composer platform requirement, not declared in core composer.json
- confirmed `fastly` — reverse-proxy Fastly config node in core — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1413
- confirmed `FastlyReverseProxyGateway` — core Fastly gateway class — vendor/shopware/core/Framework/Adapter/Cache/ReverseProxy/FastlyReverseProxyGateway.php:19
