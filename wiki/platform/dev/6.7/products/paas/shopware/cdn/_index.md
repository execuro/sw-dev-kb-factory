---
id: platform/dev/6.7/products/paas/shopware/cdn/_index.md
title: CDN
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/cdn/
sourceHash: ff60531259f417c7c19a664c5c8dac9ae4030a98
codeCheckedAgainst: "6.7.15.1"
keywords: ["cdn", "content delivery network", "fastly", "paas native", "edge caching", "http cache", "storefront", "soft purge", "cache invalidation", "vcl snippets", "custom domains", "s3 public bucket"]
summary: Fastly CDN in Shopware PaaS Native - preconfigured edge HTTP cache, soft purge, and the two Fastly services storefront and cdn.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/paas/shopware/cdn/fastly-snippets.md", "platform/dev/6.7/products/paas/shopware/cdn/custom-domains.md"]
---
## What it is

Overview of the Content Delivery Network setup in Shopware PaaS Native. Fastly is the primary CDN: it stores the HTTP cache on the edge server nearest to the customer, which lowers global response times, takes load off the application servers, and reduces Redis cache usage because HTTP cache is handled at the CDN level. Traffic spikes are absorbed at the edge without affecting the application.

## When to use

Read this when you need to know how caching and asset delivery work on a PaaS Native environment, which Fastly services exist, or where to go for VCL snippet customisation and custom domain setup.

## Key steps / config

- Fastly is configured and enabled by default in every PaaS Native environment. No additional Shopware configuration is required; the PaaS platform handles all Fastly setup and cache management.
- The integration provides automatic cache invalidation, soft purge (keeps performance up while caches update), and deployment-helper management of VCL snippets - see [Fastly snippets](platform/dev/6.7/products/paas/shopware/cdn/fastly-snippets.md).
- Two Fastly services are configured:
  - `storefront` - proxies the storefront and admin Shopware instances.
  - `cdn` - proxies all CDN assets hosted on S3 (public bucket).
- Custom domain configuration (prerequisites, DNS records, step-by-step setup) is on its own page: [Custom Domains](platform/dev/6.7/products/paas/shopware/cdn/custom-domains.md).

## Essential identifiers

- Fastly service `storefront` (shop + admin traffic)
- Fastly service `cdn` (S3 public bucket assets)
- In core, page cache purges go through `FastlyReverseProxyGateway` and media/asset purges through `FastlyMediaReverseProxy`; both send a `fastly-soft-purge` header with their purge requests.

## Code check (6.7.15.1)
- confirmed `FastlyReverseProxyGateway` — core Fastly gateway for HTTP cache invalidation — vendor/shopware/core/Framework/Adapter/Cache/ReverseProxy/FastlyReverseProxyGateway.php:19
- confirmed `fastly-soft-purge` — purge requests carry the soft-purge header — vendor/shopware/core/Framework/Adapter/Cache/ReverseProxy/FastlyReverseProxyGateway.php:56
- confirmed `shopware.http_cache.reverse_proxy.fastly.soft_purge` — core default `'0'` unless the environment sets it — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1464
- confirmed `FastlyMediaReverseProxy` — separate purge path for media/CDN assets — vendor/shopware/core/Content/Media/Infrastructure/Path/FastlyMediaReverseProxy.php:16
- confirmed `shopware.cdn.fastly.soft_purge` — core default false for asset purges — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:217
- unverified `storefront`/`cdn` Fastly services — PaaS platform infrastructure, not in Shopware code
