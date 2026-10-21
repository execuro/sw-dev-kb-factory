---
id: platform/dev/6.7/products/paas/shopware-paas/blackfire.md
title: Blackfire
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware-paas/blackfire.html
sourceHash: f41034eb4e9cd44d245f824f6293cb5ad9d92023
codeCheckedAgainst: "6.7.15.1"
keywords: ["blackfire", "apm", "profiling", "performance monitoring", "shopware paas", "upsun", "platform.sh", "continuous profiling", "deterministic profiling", "browser extension", "observability"]
summary: Blackfire APM bundled with Enterprise Shopware PaaS projects - features, access via PaaS Console and Upsun login, browser extensions for profiling.
lastBuilt: 2026-10-21
---
## What it is

Blackfire is a continuous observability (APM) solution bundled with every Enterprise Shopware PaaS project at no extra fee. Everyone invited to the project can use it, and all environments can be monitored. It shows when, where and why performance issues happen.

## When to use

When you need to find slow transactions, background jobs, services or third-party calls on a Shopware PaaS environment, profile a specific request, or add performance checks to CI.

## Key steps / config

Features:

- **Monitoring**: live metrics; slow transactions, background jobs, services, third-party calls.
- **Deterministic profiling**: function-call level metrics to find bottleneck root causes.
- **Continuous profiling**: profiling plus monitoring with low overhead; hotspots, resource usage, timeframe comparison.
- **Testing**: performance budget control.
- **Alerting**: warnings on abnormal behaviour.
- **Recommendations**: issue detection with documented resolutions.
- **CI/CD integration**: add Blackfire to test pipelines, or use its open-source crawler, tester and scraper.

Access:

1. Open the Blackfire link on the Shopware PaaS Console at the environment level.
2. You are redirected to the Upsun authentication portal.
3. On first login, use your Shopware PaaS email and run the "reset password" workflow to set your Upsun password.

Deterministic profiling: install the Firefox or Chrome Blackfire browser extension to trigger profiles of targeted transactions or groups of transactions. Blackfire's self-onboarding guide is at `https://docs.blackfire.io/onboarding/index`.

## Gotchas

- Platform.sh is now Upsun; references to Platform.sh in code, docs or older material mean the same thing.
- Blackfire is bundled with Enterprise Shopware PaaS projects specifically.

## Code check (6.7.15.1)
- confirmed `Blackfire` — core only references it in a comment recommending it for measuring escaper performance; no integration code ships in core — vendor/shopware/core/Framework/Adapter/Twig/Runtime/CachedEscaperRuntime.php:36
- unverified `Upsun` — hosting/authentication provider, not referenced in the installed Shopware packages
