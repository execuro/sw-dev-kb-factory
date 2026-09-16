---
id: platform/dev/6.6/products/paas/shopware-paas/fastly.md
title: Fastly
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/paas/shopware-paas/fastly.html"
sourceHash: "243333c0e693dc0520d02c45439eced970204ec4"
keywords: ["fastly", "cdn", "edge cache", "http cache", "shopware paas", "FASTLY_API_TOKEN", "FASTLY_SERVICE_ID", "composer req fastly", ".platform/routes.yaml", "redis cache"]
summary: Enabling Fastly CDN edge caching on Shopware PaaS reduces Redis cache load and response times.
lastBuilt: "2026-09-15"
---
## What it is

This page describes enabling Fastly as the HTTP cache layer for a Shopware PaaS deployment. Fastly stores the HTTP cache on edge servers close to the end customer instead of using the platform's Redis-backed cache.

## When to use

Use this when you want to reduce response times worldwide and offload the HTTP cache from Redis onto Fastly's edge network. Fastly is supported in Shopware versions 6.4.11 or newer.

## Key steps / config

1. Ensure `FASTLY_API_TOKEN` and `FASTLY_SERVICE_ID` are set in the environment (contact support if missing).
2. Install the Fastly Composer package: `composer req fastly`.
3. Disable caching in `.platform/routes.yaml`.
4. Push the new config; Fastly gets enabled.

## Essential identifiers

- `FASTLY_API_TOKEN`
- `FASTLY_SERVICE_ID`
- `composer req fastly`
- `.platform/routes.yaml`

## Version notes

Fastly support requires Shopware 6.4.11 or newer.
