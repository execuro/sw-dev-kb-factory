---
id: platform/dev/6.7/products/tools/cli/project-commands/local-proxy.md
title: Local Proxy
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/cli/project-commands/local-proxy.html
sourceHash: 3fdc34bff34541d4ec2e4fc33b8eb731a5f4aa86
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware-cli project proxy", "project proxy setup", "project proxy up", "project proxy down", "project proxy verify", "--local-domain", "shopware.local", "local proxy", "multiple shops in parallel", "traefik", "coredns", "local https certificate"]
summary: shopware-cli project proxy runs several dev shops in parallel on HTTPS hostnames like my-shop.shopware.local via shared Traefik and CoreDNS.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/tools/cli/project-commands/dev-environment.md", "platform/dev/6.7/guides/development/dev-environment.md"]
---
## What it is

The shopware-cli local proxy lets any number of `shopware-cli project dev` shops run in parallel. A plain dev environment publishes fixed host ports (`8000`, `9080`, …), so a second shop collides; under the proxy each shop gets a stable HTTPS hostname (e.g. `https://my-shop.shopware.local`) behind one shared reverse proxy and publishes no host ports. For the single-shop workflow see [Development Environment](platform/dev/6.7/products/tools/cli/project-commands/dev-environment.md).

## When to use

When you work on several Shopware projects at the same time and want them all running without port juggling.

## Key steps / config

How it works: a CoreDNS container answers every `*.shopware.local` name with `127.0.0.1`; a shared Traefik container (port 443) routes by requested hostname to the matching shop container; a local certificate authority signs the HTTPS certificates and is trusted once per machine. Nothing leaves the machine.

1. One-time machine setup (the only `sudo` step — points the OS resolver at the local DNS and installs the CA into trust stores):
   ```bash
   shopware-cli project proxy setup
   shopware-cli project proxy setup --domain shopware.test   # persisted machine-wide
   ```
2. New project: `shopware-cli project create my-shop` asks whether to use local domains and offers to run the machine setup; then `cd my-shop && shopware-cli project dev`. Non-interactive (setup already done): `shopware-cli project create --local-domain --no-interaction my-shop`.
3. Existing port-based project: `shopware-cli project proxy up` to opt in, `shopware-cli project proxy down` to revert. `proxy up` records the previous `APP_URL`, sales-channel domain and configuration; `proxy down` restores them exactly.

| Command | Purpose |
|---|---|
| `project proxy setup` | DNS routing + HTTPS trust; flags `--domain`, `--skip-trust` |
| `project proxy up` / `down` | Register-and-start / remove-stop-restore the current project |
| `project proxy status` | Whether the current project is registered |
| `project proxy list` | All registered projects with URLs (Shop, Admin `/admin`) and running state |
| `project proxy verify` | Bottom-up health check: Docker, DNS, resolver, Traefik, HTTPS |
| `project proxy teardown` | Remove every project, stop proxy and DNS; flag `--force` |

## Essential identifiers

- `shopware-cli project proxy setup|up|down|status|list|verify|teardown`
- `shopware-cli project create --local-domain --no-interaction`
- `--domain`, `--skip-trust`, `--force`
- `*.shopware.local`, `APP_URL`

## Gotchas

- Requires Docker; macOS or Linux only — on Windows run shopware-cli inside WSL2.
- If a shop is unreachable, `shopware-cli project proxy verify` stops at the first broken layer and prints the fix.
- `--local-domain` with `--no-interaction` assumes `project proxy setup` was already run on the machine.

## Code check (6.7.15.1)
- confirmed `APP_URL` — core reads the shop URL from this env var — vendor/shopware/core/Maintenance/System/Service/AppUrlVerifier.php:37
- confirmed `sales_channel_domain` — entity holding sales-channel domain URLs that `proxy up`/`down` rewrite — vendor/shopware/core/System/SalesChannel/Aggregate/SalesChannelDomain/SalesChannelDomainDefinition.php:34
- unverified `shopware-cli project proxy` — Go CLI, not part of the Shopware core/storefront/administration packages
- unverified `*.shopware.local` — DNS/Traefik setup provided by shopware-cli, outside the Shopware packages
