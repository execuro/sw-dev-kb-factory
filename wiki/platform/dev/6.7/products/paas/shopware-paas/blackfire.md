---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/products/paas/shopware-paas/blackfire.md
sourceHash: f41034eb4e9cd44d245f824f6293cb5ad9d92023
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware-paas/blackfire.html
title: Blackfire
version: "6.7"
versions:
  - "6.7"
keywords: ["blackfire", "apm", "shopware paas", "upsun", "platform.sh", "profiling", "continuous profiling", "deterministic profiling", "monitoring", "performance", "alerting", "browser extension"]
summary: "Blackfire APM bundled with Enterprise Shopware PaaS: monitoring, deterministic and continuous profiling, access via PaaS Console and Upsun login."
lastBuilt: 2026-09-15
---
## What it is

Blackfire is the observability/APM solution bundled with every Enterprise Shopware PaaS project at no additional fee. Everyone invited to the project can use it, and all environments can be monitored. It shows when, where and why performance issues happen.

Features listed by the source:

- **Monitoring** — live metrics: slow transactions, background jobs, services, third-party calls.
- **Deterministic profiling** — function-call level runtime analysis to find bottleneck root causes.
- **Continuous profiling** — profiling plus monitoring with low overhead; find hotspots and compare timeframes.
- **Testing** — performance budget control.
- **Alerting** — warnings on abnormal behaviour.
- **Recommendations** — issue detection with documented resolutions.
- **CI/CD integration** — add Blackfire to test pipelines (open-source crawler/tester/scraper available).

## When to use

You run a Shopware store on Enterprise Shopware PaaS and need to investigate slow requests, background jobs or regressions, or want profiling in CI.

## Key steps / config

1. Open the Shopware PaaS Console and use the Blackfire link at the **environment** level.
2. You are redirected to the Upsun authentication portal.
3. On first login, enter your usual Shopware PaaS email and use the "reset password" workflow to set an Upsun password.
4. Follow Blackfire's self-onboarding guide (documentation and videos).
5. For deterministic profiling of specific transactions, install the Blackfire browser extension for Firefox or Chrome and trigger profiles from there.

## Gotchas

- Platform.sh has been renamed Upsun; references to Platform.sh in code, docs or older material mean Upsun.
- Blackfire is included only for **Enterprise** Shopware PaaS projects.

## Code check (6.7.13.0)
- unverified `Blackfire` — PaaS-bundled external APM; no integration code in vendor/shopware (only a code comment mentions it)
- unverified `Upsun` — hosting platform authentication portal, outside vendor/shopware
