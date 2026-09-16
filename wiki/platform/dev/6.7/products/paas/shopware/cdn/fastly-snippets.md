---
id: platform/dev/6.7/products/paas/shopware/cdn/fastly-snippets.md
title: Fastly Snippets
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/cdn/fastly-snippets.html
sourceHash: c0f80fdb1e5ed95a5b8997140f45651c46f61629
codeCheckedAgainst: "6.7.13.0"
keywords: ["fastly", "vcl snippets", "services.fastly.snippets_path", "fastly.disable_default_snippets", "application.yaml", "sw-paas application update", "snippet priority", "vcl subroutine", "storefront-", "cdn-", "config/fastly", "shopware paas native"]
summary: "Fastly VCL snippets on Shopware PaaS Native: services.fastly.snippets_path, folder layout per subroutine, priority order, storefront-/cdn- prefixes."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/paas/shopware/cdn/_index.md", "platform/dev/6.7/products/paas/shopware/fundamentals/application-yaml.md"]
---
## What it is

How to add custom Fastly VCL snippets to the Fastly services in front of a Shopware PaaS Native shop, alongside (or instead of) the default snippets PaaS deploys out of the box.

## When to use

When the default caching behaviour needs extending (headers, auth, geo, routing at the edge) or you want full control by disabling the default snippets.

## Key steps / config

1. Put snippet files in the repository, one sub-directory per VCL subroutine type.
2. Point `services.fastly.snippets_path` at that directory in [`application.yaml`](platform/dev/6.7/products/paas/shopware/fundamentals/application-yaml.md):

```yaml
services:
  fastly:
    disable_default_snippets: false
    snippets_path: config/fastly
```

| Option | Default | Meaning |
|---|---|---|
| `snippets_path` | unset | Repo-relative snippet directory; unset = no custom snippets, defaults stay |
| `disable_default_snippets` | `false` | `true` disables the PaaS default snippets |

3. Apply with `sw-paas application update`.

**Folder layout** – exactly one level deep, e.g. `config/fastly/recv/001-auth.vcl`, `config/fastly/deliver/001-headers.vcl`. Valid type directories: `init`, `recv`, `hash`, `hit`, `miss`, `pass`, `fetch`, `error`, `deliver`, `log`, `none`.

**Order** – within a type, files are sorted by name; the first gets Fastly priority `1`, the second `2`, etc. Lower priority runs first. Default snippets use priority `50`, so custom snippets of the same type run before them. Defaults cover `recv`, `fetch`, `miss`, `pass`, `deliver` on `storefront` and `recv`, `fetch`, `deliver` on `cdn`.

**Target service** – decided by the file name start:

| File | Deployed to |
|---|---|
| `recv/test.vcl` | `storefront` and `cdn` |
| `recv/storefront-test.vcl` | `storefront` only |
| `recv/cdn-test.vcl` | `cdn` only |

Put the prefix before the number: `storefront-001-shop-headers.vcl` (storefront only), not `001-storefront-shop-headers.vcl` (deployed to both). See [CDN](platform/dev/6.7/products/paas/shopware/cdn/_index.md) for the two services.

**Naming** – snippet name = type + file name without extension (`recv/001-auth.vcl` → `recv-001-auth`), used as a Kubernetes resource name: lowercase alphanumerics and `-` only.

## Essential identifiers

- `services.fastly.snippets_path`, `disable_default_snippets`
- `sw-paas application update`
- File prefixes `storefront-`, `cdn-`

## Gotchas

- Without `services.fastly.snippets_path`, snippet files in the repo are silently ignored.
- Deeper nesting (`config/fastly/recv/custom/default.vcl`) or files directly in `config/fastly/` fail the deployment.
- Underscores are rejected (`001_auth.vcl` → use `001-auth.vcl`); `a.b.vcl` and `a-b.vcl` both map to `recv-a-b` and collide.
- Unprefixed snippets go to both services, so they must be valid for shop and asset traffic.
- Validation on create/update fails when `snippets_path` is set but missing/empty, a file is outside a valid type directory, names contain underscores or collide, or VCL is syntactically invalid. Fix, push, and rerun `sw-paas application update`.

## Code check (6.7.13.0)
- unverified `services.fastly.snippets_path` — PaaS `application.yaml` option, handled by the PaaS platform outside vendor/shopware scope
- unverified `fastly.disable_default_snippets` — PaaS `application.yaml` option, outside vendor/shopware scope
- unverified `sw-paas application update` — PaaS CLI, outside vendor/shopware scope
- unverified `storefront-` — snippet file-name prefix rule enforced by PaaS deployment, outside vendor/shopware scope
