---
id: platform/dev/6.7/products/sales-agent/best-practices/app-deployment/aws.md
title: AWS
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/sales-agent/best-practices/app-deployment/aws.html
sourceHash: 6d30bc9cbe795b1897ba7c6ed8d10b53c6678995
codeCheckedAgainst: "6.7.15.1"
keywords: ["sales agent", "aws amplify", "aws", "deploy", "amazon elasticache", "redis", "upstash", "redis cloud", "REDIS_CACHE", "REDIS_HOST", "REDIS_TLS", ".env.template", "environment variables", "custom domain"]
summary: Deploy the Sales Agent frontend app to AWS Amplify, with Redis caching via Amazon ElastiCache or a serverless provider and REDIS_* env vars.
lastBuilt: 2026-10-21
---
## What it is

A deployment guide for hosting the Sales Agent frontend source code on AWS Amplify, including how to provide the Redis cache the app uses, since Amplify does not include Redis by default.

## When to use

Use it when you want the Sales Agent frontend hosted on AWS Amplify with auto-deploys from a Git branch, and need to decide where the Redis cache lives (Amazon ElastiCache or an external serverless Redis).

## Key steps / config

Prerequisites: an AWS account, and the frontend source code cloned and pushed to your own Git repository (for example GitHub).

**Redis, option 1 — Amazon ElastiCache** (managed, Redis-compatible):

1. Open the ElastiCache Console, click "Create", choose "Redis OSS" as the cluster engine.
2. Configure cluster settings (node type, number of replicas, etc.).
3. Configure security groups so the Amplify application can reach the cluster.
4. Note the **Primary Endpoint** for the Redis connection.

**Redis, option 2 — serverless providers** with public endpoints, needing no VPC configuration: Upstash (serverless Redis with REST API support) or Redis Cloud (managed Redis with public endpoints).

**Redis environment variables** — set them in the Amplify Console under "Environment variables" in the app settings, or include them in `.env.template`:

```bash
REDIS_CACHE=true
REDIS_HOST=your-redis-endpoint.cache.amazonaws.com
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
REDIS_TLS=true  # recommended for production
```

**Deploy:**

1. Log in to the AWS Amplify Hosting Console and create a new app.
2. Select and authorize your Git repository provider and pick the main branch (it auto-deploys on changes to that branch).
3. Name the app and make sure the build settings are auto-detected.
4. Under Advanced Settings, set the environment variables declared in `.env.template`.
5. Confirm and click "Save and Deploy".

**Custom domain:** after deployment you can point custom domains or subdomains at the site, following AWS's Amplify custom-domain user guide.

## Essential identifiers

- Env vars: `REDIS_CACHE`, `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`, `REDIS_TLS`
- File: `.env.template`
- ElastiCache engine: "Redis OSS"; connection value: **Primary Endpoint**

## Gotchas

- ElastiCache runs inside a VPC, while AWS Amplify runs outside a VPC by default. Connecting them needs extra configuration such as VPC peering or a public endpoint; for serverless setups the source recommends option 2 (Upstash or Redis Cloud) instead.

## Code check (6.7.15.1)
- unverified `REDIS_CACHE` — Sales Agent frontend app env var; not present in vendor/shopware core, storefront or administration
- unverified `REDIS_HOST` — Sales Agent frontend app env var; not present in vendor/shopware core, storefront or administration
- unverified `REDIS_TLS` — Sales Agent frontend app env var; not present in vendor/shopware core, storefront or administration
- unverified `.env.template` — file of the separate Sales Agent Nuxt app, out of scope for vendor/shopware
