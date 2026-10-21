---
id: platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/hosting.md
title: Hosting and Integrations
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/installation-updates/deployments/deployment-helper/hosting.html
sourceHash: e0b7e75a35391ce1bc14c1a4953c47af2dde3ab4
codeCheckedAgainst: "6.7.15.1"
keywords: ["deployment helper", "shopware-deployment-helper", "platform.sh", "upsun", "paas native", "kubernetes operator", "fastly", "vcl snippets", "shopware/fastly-meta", "FASTLY_API_TOKEN", "FASTLY_SERVICE_ID", "FASTLY_DISABLE_SNIPPET_UPDATE", "fastly:snippet:deploy", ".config/shopware-project.yml"]
summary: How the Deployment Helper behaves on Platform.sh/Upsun, PaaS Native and the Kubernetes operator, and how it deploys Fastly VCL snippets.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/paas/shopware/cdn/fastly-snippets.md"]
---
## What it is

Describes how the Shopware Deployment Helper (DH) integrates with hosting platforms (Platform.sh/Upsun, PaaS Native, Kubernetes operator) and how it deploys and maintains Fastly VCL snippets.

## When to use

When running DH on one of these hosting setups, or when Fastly VCL snippets should be deployed automatically as part of each deployment (or managed manually).

## Key steps / config

**Platform.sh (Upsun)** — detected from the environment, no extra configuration. DH then:
- detects production vs staging automatically and runs the staging setup in non-production environments;
- uses vault-backed secrets for `SHOPWARE_STORE_ACCOUNT_EMAIL`, `SHOPWARE_STORE_ACCOUNT_PASSWORD`, etc.;
- deploys Fastly VCL snippets automatically (if configured).

**PaaS Native** — DH is invoked in the deploy step of the CI/CD pipeline; configure `.config/shopware-project.yml` as usual, same flow as Platform.sh or manual deployments.

**Kubernetes / operator** — the Shopware operator (`https://github.com/shopware/shopware-operator`) does not run DH directly; it spawns a one-time pod job that invokes DH. Configure `.config/shopware-project.yml` normally.

**Fastly VCL snippets**
1. Install the meta package after DH:
   ```bash
   composer require shopware/fastly-meta
   ```
2. Set `FASTLY_API_TOKEN` and `FASTLY_SERVICE_ID`.
3. Snippets deploy during the regular DH run only when **both**: a `config/fastly` directory exists in the project, **and** `FASTLY_DISABLE_SNIPPET_UPDATE` is not `1`.
4. To manage snippets yourself: `export FASTLY_DISABLE_SNIPPET_UPDATE=1`.

Manual commands:
- `./vendor/bin/shopware-deployment-helper fastly:snippet:list` — list deployed snippets
- `./vendor/bin/shopware-deployment-helper fastly:snippet:deploy` — deploy all snippets
- `./vendor/bin/shopware-deployment-helper fastly:snippet:remove <name>` — remove a snippet by name

Implementation: `FastlyServiceUpdater` in the deployment-helper repository (`https://github.com/shopware/deployment-helper/blob/main/src/Integration/Fastly/FastlyServiceUpdater.php`). Snippet content itself: see [Fastly snippets](platform/dev/6.7/products/paas/shopware/cdn/fastly-snippets.md).

## Essential identifiers

- `shopware/fastly-meta`
- `FASTLY_API_TOKEN`, `FASTLY_SERVICE_ID`, `FASTLY_DISABLE_SNIPPET_UPDATE`
- `config/fastly`, `.config/shopware-project.yml`
- `fastly:snippet:list`, `fastly:snippet:deploy`, `fastly:snippet:remove`
- `FastlyServiceUpdater`

## Gotchas

- Without a `config/fastly` directory, no snippets are deployed even if both Fastly env vars are set.
- The Kubernetes operator runs DH as a separate job, not inside the app pod.
- The Fastly CDN settings in Shopware core (`shopware.cdn.fastly.api_key`, used for cache purging) are separate from the DH snippet env vars.

## Code check (6.7.15.1)
- confirmed `shopware.cdn.fastly` — core has its own Fastly config block (`api_key`, `soft_purge`, `max_parallel_invalidations`), separate from DH snippet deployment — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:215
- unverified `FASTLY_API_TOKEN` — read by Deployment Helper, not by core; shopware/deployment-helper package out of scope
- unverified `FASTLY_SERVICE_ID` — Deployment Helper env var; out of scope
- unverified `FASTLY_DISABLE_SNIPPET_UPDATE` — Deployment Helper env var; out of scope
- unverified `fastly:snippet:deploy` — Deployment Helper command, not a core console command; out of scope
- unverified `FastlyServiceUpdater` — class lives in shopware/deployment-helper; out of scope
- unverified `SHOPWARE_STORE_ACCOUNT_EMAIL` — Deployment Helper env var; out of scope
