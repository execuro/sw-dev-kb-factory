---
id: platform/dev/6.7/products/sales-agent/best-practices/app-deployment/aws.md
title: AWS
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/sales-agent/best-practices/app-deployment/aws.html
sourceHash: 6d30bc9cbe795b1897ba7c6ed8d10b53c6678995
codeCheckedAgainst: "6.7.13.0"
keywords: ["aws amplify", "amazon elasticache", "REDIS_CACHE", "REDIS_HOST", "REDIS_PORT", "REDIS_PASSWORD", "REDIS_TLS", ".env.template", "upstash", "redis cloud", "sales agent deployment", "aws hosting", "custom domain"]
summary: Deploy the Sales Agent Nuxt frontend to AWS Amplify with Redis via Amazon ElastiCache or Upstash/Redis Cloud, using REDIS_* environment variables.
lastBuilt: 2026-09-15
---
## What it is

Guide for deploying the Sales Agent frontend source code to AWS Amplify Hosting, including how to provide the Redis cache the app needs, since Amplify does not include Redis.

## When to use

- Hosting the Sales Agent Nuxt app on AWS with Git-based auto-deploy.
- Choosing between Amazon ElastiCache and a serverless Redis provider for an Amplify deployment.

## Key steps / config

Prerequisites: an AWS account; the frontend source code cloned and pushed to your own Git repository (e.g. GitHub).

Redis, option 1 — Amazon ElastiCache:

1. Open the ElastiCache Console, click "Create", choose "Redis OSS" as cluster engine.
2. Configure cluster settings (node type, replicas, etc.).
3. Configure security groups to allow access from the Amplify app.
4. Note the **Primary Endpoint** for the Redis connection.

Redis, option 2 — serverless providers with public endpoints (no VPC setup): Upstash (serverless Redis with REST API support) or Redis Cloud.

Redis environment variables (set in the Amplify Console under "Environment variables", or in `.env.template`):

```bash
REDIS_CACHE=true
REDIS_HOST=your-redis-endpoint.cache.amazonaws.com
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
REDIS_TLS=true
```

Deploy:

1. Log in to the AWS Amplify Hosting Console and create a new app.
2. Select and authorize your Git provider, choose the main branch (auto-deploys on changes to it).
3. Name the app; make sure build settings are auto-detected.
4. Under Advanced Settings, set the environment variables declared in `.env.template`.
5. Confirm and click "Save and Deploy".

Custom domain: after deploying, point custom domains or subdomains to the site following AWS's Amplify custom-domains user guide.

## Essential identifiers

- `REDIS_CACHE`, `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`, `REDIS_TLS`
- `.env.template`

## Gotchas

- ElastiCache runs inside a VPC; Amplify runs outside a VPC by default, so connecting needs extra configuration such as VPC peering or a public endpoint. For serverless setups the source recommends option 2.
- `REDIS_TLS=true` is recommended for production.

## Code check (6.7.13.0)
- unverified `REDIS_HOST` — env var of the separate Sales Agent Nuxt app; not present in vendor/shopware packages
- unverified `REDIS_CACHE` — Nitro cache toggle of the Sales Agent app, out of scope of installed Shopware code
- unverified `.env.template` — file of the licensed Sales Agent repository, not in vendor/shopware
