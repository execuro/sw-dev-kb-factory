---
id: platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/hosting.md
title: Hosting and Integrations
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/installation-updates/deployments/deployment-helper/hosting.html
sourceHash: 98bc8a363a744be95db9f9d0dc39fe2b233acf2d
codeCheckedAgainst: "6.7.13.0"
keywords: ["deployment helper", "platform.sh", "upsun", "paas native", "kubernetes operator", "fastly", "vcl snippets", "shopware/fastly-meta", "FASTLY_API_TOKEN", "FASTLY_SERVICE_ID", "FASTLY_DISABLE_SNIPPET_UPDATE", "fastly:snippet:deploy", "FastlyServiceUpdater"]
summary: "Deployment Helper on Platform.sh/Upsun, PaaS Native and the Kubernetes operator, plus automatic and manual Fastly VCL snippet deployment."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/paas/shopware/cdn/fastly-snippets.md"]
---
## What it is

How the Shopware Deployment Helper integrates with hosting platforms (Platform.sh/Upsun, PaaS Native, Kubernetes operator) and how it deploys and manages Fastly VCL snippets.

## When to use

When running the Deployment Helper on a managed platform or in Kubernetes, or when a Fastly-fronted shop should get its VCL snippets deployed as part of each deployment.

## Key steps / config

**Platform.sh (Upsun)** — detected from the environment, no extra configuration:

- automatic production vs staging detection; staging setup runs automatically in non-production environments
- vault-backed secrets such as `SHOPWARE_STORE_ACCOUNT_EMAIL`, `SHOPWARE_STORE_ACCOUNT_PASSWORD`
- automatic Fastly VCL snippet deployment if configured

**PaaS Native** — the Deployment Helper is invoked in the deploy step of the CI/CD pipeline; configure `.shopware-project.yml` as usual.

**Kubernetes** — the Shopware operator (https://github.com/shopware/shopware-operator) spawns a one-time job/pod that runs the Deployment Helper; it does not run it directly. Configure `.shopware-project.yml` normally.

**Fastly VCL snippets** (see [Fastly snippets](platform/dev/6.7/products/paas/shopware/cdn/fastly-snippets.md)):

1. Install the meta package: `composer require shopware/fastly-meta`
2. Set `FASTLY_API_TOKEN` and `FASTLY_SERVICE_ID`.
3. Automatic deployment during the regular run happens only when a `config/fastly` directory exists **and** `FASTLY_DISABLE_SNIPPET_UPDATE` is not `1`.
4. To manage snippets yourself: `export FASTLY_DISABLE_SNIPPET_UPDATE=1`.

Manual commands:

- `./vendor/bin/shopware-deployment-helper fastly:snippet:list` — list deployed snippets
- `./vendor/bin/shopware-deployment-helper fastly:snippet:deploy` — deploy all snippets
- `./vendor/bin/shopware-deployment-helper fastly:snippet:remove <name>` — remove a snippet by name

Implementation: `FastlyServiceUpdater` (https://github.com/shopware/deployment-helper/blob/main/src/Integration/Fastly/FastlyServiceUpdater.php).

## Essential identifiers

- `shopware/fastly-meta`
- `FASTLY_API_TOKEN`, `FASTLY_SERVICE_ID`, `FASTLY_DISABLE_SNIPPET_UPDATE`
- `config/fastly`
- `fastly:snippet:list`, `fastly:snippet:deploy`, `fastly:snippet:remove`
- `SHOPWARE_STORE_ACCOUNT_EMAIL`, `SHOPWARE_STORE_ACCOUNT_PASSWORD`

## Gotchas

- Without a `config/fastly` directory, no snippets are deployed automatically even when both Fastly env vars are set.

## Code check (6.7.13.0)
- unverified `FastlyServiceUpdater` — shopware/deployment-helper package, outside code-check roots
- unverified `FASTLY_API_TOKEN` — read by the deployment-helper package, outside code-check roots
- unverified `FASTLY_SERVICE_ID` — read by the deployment-helper package, outside code-check roots
- unverified `FASTLY_DISABLE_SNIPPET_UPDATE` — deployment-helper package, outside code-check roots
- unverified `fastly:snippet:deploy` — deployment-helper CLI command, outside code-check roots
- unverified `SHOPWARE_STORE_ACCOUNT_EMAIL` — Platform.sh/deployment-helper integration, outside code-check roots
