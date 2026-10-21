---
id: platform/dev/6.7/products/paas/shopware/cdn/fastly-snippets.md
title: Fastly Snippets
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/cdn/fastly-snippets.html
sourceHash: 1c799d9b8544e35af353d82f9d6d3a9bb44c58ca
codeCheckedAgainst: "6.7.15.1"
keywords: ["fastly", "vcl snippets", "services.fastly.snippets_path", "fastly.disable_default_snippets", "application.yaml", "sw-paas application update", "snippet priority", "vcl subroutine", "recv", "deliver", "storefront-", "cdn-", "paas native"]
summary: Custom Fastly VCL snippets on PaaS Native - services.fastly.snippets_path, per-subroutine folders, priority by file name, storefront-/cdn- prefixes.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/paas/shopware/fundamentals/application-yaml.md", "platform/dev/6.7/products/paas/shopware/cdn/_index.md"]
---
## What it is

How to add custom Fastly VCL snippets to the Fastly services in front of a Shopware PaaS Native shop. A maintained set of default snippets is deployed and enabled out of the box; you can add your own alongside them or disable the defaults and take full control. Custom snippets are read from your project repository during deployment.

## When to use

When you need custom edge logic (headers, auth, geo, URL normalisation, routing) in Fastly for the shop or its assets, or need to replace the default Shopware caching snippets.

## Key steps / config

1. Configure Fastly under `services` in [`application.yaml`](platform/dev/6.7/products/paas/shopware/fundamentals/application-yaml.md):
   ```yaml
   services:
     fastly:
       disable_default_snippets: false
       snippets_path: config/fastly
   ```
   - `snippets_path` (default unset): directory relative to the application root (the directory with `application.yaml`). Unset = no custom snippets deployed, defaults stay on. **Without it, snippet files are ignored.**
   - `disable_default_snippets` (default `false`): `true` disables the default snippets.
2. Lay out the directory exactly one level deep - one sub-directory per VCL subroutine type, files directly inside (e.g. `config/fastly/recv/001-auth.vcl`). Valid types: `init`, `recv`, `hash`, `hit`, `miss`, `pass`, `fetch`, `error`, `deliver`, `log`, `none`.
3. Order: within a type, files are sorted by name and get priority `1`, `2`, ... (lower runs first). Prefix with numbers (`001-`, `002-`). Default snippets use priority `50`, so custom snippets of the same type run before them. Defaults cover `recv`, `fetch`, `miss`, `pass`, `deliver` on `storefront` and `recv`, `fetch`, `deliver` on `cdn`.
4. Target a service by file-name prefix: `recv/test.vcl` goes to `storefront` and `cdn`; `recv/storefront-test.vcl` to `storefront` only; `recv/cdn-test.vcl` to `cdn` only. The prefix must be at the start (`storefront-001-shop-headers.vcl`, not `001-storefront-shop-headers.vcl`).
5. Apply with `sw-paas application update`.

## Essential identifiers

- `services.fastly.snippets_path`, `fastly.disable_default_snippets`
- `sw-paas application update`
- Fastly services `storefront` and `cdn`; prefixes `storefront-`, `cdn-`
- Snippet name = type + file name without extension (`recv/001-auth.vcl` -> `recv-001-auth`)

## Gotchas

- Deeper nesting (`config/fastly/recv/custom/default.vcl`) or a file directly in `config/fastly/` fails the deployment.
- Snippet names are Kubernetes resource names: lowercase alphanumerics and `-` only; underscores are rejected (`001_auth.vcl` -> use `001-auth.vcl`); names must be unique per type (`a.b.vcl` and `a-b.vcl` both become `recv-a-b` and collide).
- Unprefixed snippets run on both services - make sure they are valid for shop and asset traffic; session/routing logic belongs in `storefront-` files.
- Deployment fails when `snippets_path` is set but missing/empty, a file is outside a valid type directory, a name has an underscore or collides, or VCL is syntactically invalid. Fix, push, and rerun `sw-paas application update`.

## Code check (6.7.15.1)
- unverified `services.fastly.snippets_path` — PaaS `application.yaml` option, not read by Shopware code
- unverified `fastly.disable_default_snippets` — PaaS deployment option, out of scope
- unverified `sw-paas application update` — PaaS CLI, not part of Shopware code
- confirmed `FastlyReverseProxyGateway` — core purges the Fastly service the snippets are deployed to — vendor/shopware/core/Framework/Adapter/Cache/ReverseProxy/FastlyReverseProxyGateway.php:19
