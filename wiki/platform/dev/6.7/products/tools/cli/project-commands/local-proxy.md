---
id: platform/dev/6.7/products/tools/cli/project-commands/local-proxy.md
title: Local Proxy
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/cli/project-commands/local-proxy.html
sourceHash: 3fdc34bff34541d4ec2e4fc33b8eb731a5f4aa86
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopware-cli project proxy setup", "shopware-cli project proxy up", "shopware-cli project proxy down", "shopware-cli project proxy verify", "--local-domain", "shopware.local", "traefik", "coredns", "multiple shops in parallel", "local https domains", "port conflicts"]
summary: "shopware-cli project proxy: shared Traefik + CoreDNS reverse proxy giving each local shop its own *.shopware.local HTTPS hostname, so shops run side by side."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/tools/cli/project-commands/dev-environment.md", "platform/dev/6.7/guides/development/dev-environment.md"]
---
## What it is

The local proxy lets several `shopware-cli project dev` shops run at once. Instead of publishing fixed host ports (`8000`, `9080`, …), each shop is reachable at its own HTTPS hostname such as `my-shop.shopware.local` through one shared reverse proxy.

## When to use

When you need more than one local Shopware project running simultaneously and the single-shop [dev environment](platform/dev/6.7/products/tools/cli/project-commands/dev-environment.md) collides on ports.

## Key steps / config

Architecture: a CoreDNS container answers every `*.shopware.local` name with `127.0.0.1`; a shared Traefik container (`:443`) routes by hostname to the shop container; a local certificate authority signs the HTTPS certificates. Shops under the proxy publish no host ports.

1. One-time machine setup (the only `sudo` step — resolver routing and CA trust):

```bash
shopware-cli project proxy setup
shopware-cli project proxy setup --domain shopware.test   # other base domain, persisted
```

2. New project: `shopware-cli project create my-shop` asks about local domains and can run the setup; then `cd my-shop && shopware-cli project dev`. Non-interactive: `shopware-cli project create --local-domain --no-interaction my-shop` (setup must already be done).

3. Existing project: `shopware-cli project proxy up` to opt in, `shopware-cli project proxy down` to stop and restore the previous `APP_URL`, sales-channel domain and configuration.

| Command | Purpose |
|---|---|
| `project proxy setup` | DNS routing + HTTPS trust; flags `--domain`, `--skip-trust` |
| `project proxy up` / `down` | Register+start / remove+stop+restore URLs |
| `project proxy status` | Is the current project registered |
| `project proxy list` | All registered projects, URLs, running state |
| `project proxy verify` | Health-check Docker, DNS, resolver, Traefik, HTTPS |
| `project proxy teardown` | Remove all projects, stop proxy and DNS; `--force` |

## Essential identifiers

- `shopware-cli project proxy setup|up|down|status|list|verify|teardown`
- `shopware-cli project create --local-domain --no-interaction`
- `*.shopware.local`, `APP_URL`, sales channel domain

## Gotchas

- If a shop is unreachable, run `shopware-cli project proxy verify`; it stops at the first broken layer and prints a fix.
- Requires Docker and macOS or Linux; on Windows run shopware-cli inside WSL2.

## Code check (6.7.13.0)
- confirmed `APP_URL` — core reads it as the fallback request URL, which is why `proxy up`/`down` must rewrite it — vendor/shopware/core/Framework/Adapter/Filesystem/FilesystemFactory.php:144
- confirmed `sales_channel_domain` — entity holding the sales-channel domain URLs the proxy changes — vendor/shopware/core/System/SalesChannel/Aggregate/SalesChannelDomain/SalesChannelDomainDefinition.php:31
- unverified `shopware-cli project proxy` — Go shopware-cli commands and flags, out of scope
- unverified `shopware.local` — CoreDNS/Traefik setup is shopware-cli tooling, out of scope
