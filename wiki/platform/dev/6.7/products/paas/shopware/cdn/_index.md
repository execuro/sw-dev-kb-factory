---
id: platform/dev/6.7/products/paas/shopware/cdn/_index.md
title: CDN
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/cdn/
sourceHash: 9c357d1459b0c17c28b994a79bb9049425167398
codeCheckedAgainst: "6.7.13.0"
keywords: ["fastly", "cdn", "custom domain", "sw-paas domain create", "sw-paas org list", "cdn.shopware.shop", "_shopware-challenge", "dns records", "apex domain", "cname", "edge caching", "shopware paas native", "sw-paas application deploy create"]
summary: "Fastly CDN on Shopware PaaS Native (storefront and cdn services) and custom domain setup: DNS CNAME/A/AAAA/TXT records, sw-paas domain create."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/paas/shopware/cdn/fastly-snippets.md"]
---
## What it is

Fastly is the CDN of Shopware PaaS Native: it stores HTTP cache at edge servers near customers, reducing latency, application load and Redis cache usage. The page also covers attaching custom domains to a PaaS shop through Fastly.

## When to use

When you need to understand HTTP caching on PaaS Native, or when serving a shop under your own domain (apex or subdomain).

## Key steps / config

**Fastly** is enabled and configured automatically; no Shopware configuration is needed. The integration includes automatic cache invalidation, soft purge, and deployment-helper management of VCL snippets (see [Fastly snippets](platform/dev/6.7/products/paas/shopware/cdn/fastly-snippets.md)). Two Fastly services exist:

- `storefront` – proxies the storefront and admin Shopware instances.
- `cdn` – proxies CDN assets hosted on S3 (public bucket).

**Custom domain** (prerequisites: `sw-paas` CLI configured, organization ID from `sw-paas org list`, DNS access, deploy permissions):

1. Configure DNS records:
   - Subdomain (non-apex): one `CNAME` to `cdn.shopware.shop`, e.g. `shop.example.com.  IN  CNAME  cdn.shopware.shop.`
   - Apex domain: four `A` records `151.101.3.52`, `151.101.67.52`, `151.101.131.52`, `151.101.195.52` and four `AAAA` records `2a04:4e42::820`, `2a04:4e42:200::820`, `2a04:4e42:400::820`, `2a04:4e42:600::820`.
2. Ownership `TXT` record: `_shopware-challenge.<domain> IN TXT "shopware-challenge=<organization id>"` (for FQDN `myshop.example.com` the domain is `example.com`).
3. Verify propagation: `dig shop.example.com CNAME`, `dig example.com A`, `dig example.com AAAA`, `dig _shopware-challenge.example.com TXT`.
4. Create the domain: `sw-paas domain create` (once per domain; multiple domains per shop allowed).
5. Deploy to activate: `sw-paas application deploy create` or `sw-paas application update` (same commit is fine).
6. In the Administration, associate the domain with the desired storefront / sales channel.

## Essential identifiers

- `sw-paas domain create`, `sw-paas org list`, `sw-paas application deploy get`
- `cdn.shopware.shop`, `_shopware-challenge.<domain>`, `shopware-challenge=<organization id>`
- Fastly services `storefront` and `cdn`

## Gotchas

- DNS records must be fully propagated **before** `sw-paas domain create`; the platform validates A/AAAA/TXT (apex) or CNAME (non-apex) in real time via public DNS and rejects the domain otherwise.
- The TXT challenge record must stay as long as the domain is configured in PaaS; its value must match the org ID exactly.
- Propagation typically takes 15–30 minutes, up to 48 hours depending on TTL. Query another resolver with `dig @8.8.8.8 example.com A`.
- Domain created but no traffic: check deployment status with `sw-paas application deploy get`, the storefront domain assignment in Shopware, caches, and remaining propagation delay.

## Code check (6.7.13.0)
- confirmed `FastlyReverseProxyGateway` — core Fastly gateway purging by `surrogate-key` via the Fastly API; PaaS wiring itself is not in vendor code — vendor/shopware/core/Framework/Adapter/Cache/ReverseProxy/FastlyReverseProxyGateway.php:19
- confirmed `fastly-soft-purge` — soft purge header sent on purge requests — vendor/shopware/core/Framework/Adapter/Cache/ReverseProxy/FastlyReverseProxyGateway.php:56
- confirmed `shopware.http_cache.reverse_proxy.fastly` — core reverse-proxy Fastly config node — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:18
- confirmed `shopware.cdn.fastly.soft_purge` — core default `false` for asset CDN purges — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:205
- unverified `sw-paas domain create` — PaaS CLI, outside vendor/shopware scope
- unverified `cdn.shopware.shop` — PaaS DNS target, outside vendor/shopware scope
- unverified `_shopware-challenge` — PaaS domain validation, outside vendor/shopware scope
