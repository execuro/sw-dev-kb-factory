---
id: platform/dev/6.6/products/paas/shopware-paas/blackfire.md
title: Blackfire
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/paas/shopware-paas/blackfire.html"
sourceHash: "72536afc21387626ae1fb100c00d18bbb02266a1"
keywords: ["Blackfire", "continuous observability", "APM", "profiling", "performance monitoring", "Shopware PaaS", "Enterprise Shopware PaaS", "Platform.sh", "deterministic profiling", "continuous profiling", "CI/CD integration", "self-onboarding guide"]
summary: "Blackfire is a bundled APM/profiling tool on Enterprise Shopware PaaS projects, offering monitoring, profiling, alerting and CI/CD integration."
lastBuilt: "2026-09-15"
---

## What it is

Blackfire is a Continuous Observability solution bundled with every Enterprise Shopware PaaS project at no additional fee. Everyone invited to the project can access it, and it can monitor all environments. It is an Application Performance Monitoring (APM) tool that shows when, where, and why performance issues happen.

## When to use

Use Blackfire when you need to diagnose slow transactions, background jobs, services, or third-party calls in a Shopware PaaS Native project, or when you want to run performance budget tests and get actionable recommendations before or after a deployment.

## Key steps / config

Blackfire's main features, as documented:

- **Monitoring** — live metrics from the app to identify slow transactions, background jobs, services, or third-party calls.
- **Deterministic Profiling** — deep, runtime code analysis producing function-call level metrics to spot bottleneck root causes.
- **Continuous Profiling** — combines profiling and monitoring with minimal overhead to identify hotspots, optimize resource usage, and compare timeframes.
- **Testing** — performance budget control to verify code behavior and performance.
- **Alerting** — warnings upon abnormal behaviors.
- **Recommendations** — actionable insights with documented resolution advice.
- **CI/CD integration** — can be added to any testing pipeline, including an Open-Source crawler, tester, and scraper.

**Access**: the link to Blackfire is found on the Shopware PaaS Console at the environment level. Clicking it redirects to the Platform.sh authentication portal. On first authentication, use the usual Shopware PaaS email and follow the "reset password" workflow to set a Platform.sh password.

For onboarding, the documentation points to a self-onboarding guide with extensive documentation and videos. For Deterministic Profiling, the documentation recommends installing the Firefox Blackfire extension or the Chrome Blackfire extension to trigger profiles of targeted transactions or groups of transactions.

## Essential identifiers

- Shopware PaaS Console (environment-level Blackfire access link)
- Platform.sh authentication portal
- Firefox Blackfire extension / Chrome Blackfire extension

## Gotchas

First-time authentication requires using the Shopware PaaS email together with the "reset password" workflow to establish a Platform.sh password — a plain login will not work without that step.
