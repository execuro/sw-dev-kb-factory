---
id: platform/hubs/paas-native.md
title: "PaaS Native"
summary: "Shopware PaaS Native (6.7): sw-paas CLI, applications, secrets, Fastly CDN, cron jobs, OpenSearch, monitoring and updates."
keywords: ["paas native", "sw-paas", "application.yaml", "fastly", "vault", "k8s-meta", "cronjobs", "opensearch", "grafana", "snapshots", "composable frontends"]
members: ["platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/hosting.md", "platform/dev/6.7/products/paas/shopware/cdn/_index.md", "platform/dev/6.7/products/paas/shopware/cdn/custom-domains.md", "platform/dev/6.7/products/paas/shopware/cdn/fastly-snippets.md", "platform/dev/6.7/products/paas/shopware/cdn/reverse-proxy.md", "platform/dev/6.7/products/paas/shopware/cdn/security-features.md", "platform/dev/6.7/products/paas/shopware/composable-frontends/_index.md", "platform/dev/6.7/products/paas/shopware/fundamentals/applications.md", "platform/dev/6.7/products/paas/shopware/fundamentals/environment-variables.md", "platform/dev/6.7/products/paas/shopware/fundamentals/k8s-meta.md", "platform/dev/6.7/products/paas/shopware/fundamentals/organization.md", "platform/dev/6.7/products/paas/shopware/fundamentals/php-settings.md", "platform/dev/6.7/products/paas/shopware/fundamentals/plugins-store-authentication.md", "platform/dev/6.7/products/paas/shopware/fundamentals/project.md", "platform/dev/6.7/products/paas/shopware/fundamentals/secrets.md", "platform/dev/6.7/products/paas/shopware/fundamentals/snapshots.md", "platform/dev/6.7/products/paas/shopware/get-started/_index.md", "platform/dev/6.7/products/paas/shopware/get-started/prepare-codebase.md", "platform/dev/6.7/products/paas/shopware/get-started/quickstart.md", "platform/dev/6.7/products/paas/shopware/guides/_index.md", "platform/dev/6.7/products/paas/shopware/guides/clone-application.md", "platform/dev/6.7/products/paas/shopware/guides/cronjobs.md", "platform/dev/6.7/products/paas/shopware/guides/opensearch.md", "platform/dev/6.7/products/paas/shopware/guides/secrets-vault-guide.md", "platform/dev/6.7/products/paas/shopware/guides/setting-up-repository-access.md", "platform/dev/6.7/products/paas/shopware/guides/update-shopware.md", "platform/dev/6.7/products/paas/shopware/monitoring/blackfire.md", "platform/dev/6.7/products/paas/shopware/monitoring/logs.md", "platform/dev/6.7/products/paas/shopware/monitoring/tideways.md", "platform/dev/6.7/products/paas/shopware/monitoring/traces.md", "platform/dev/6.7/products/paas/shopware/monitoring/watch.md"]
lastBuilt: 2026-10-21
---

# PaaS Native

This hub covers Shopware PaaS Native, the managed platform driven by the `sw-paas` CLI and an `application.yaml` file per application. Come here for onboarding, projects and applications, secrets and environment variables, the Fastly CDN, operations guides (cron jobs, OpenSearch, cloning, updates) and monitoring. All members are for 6.7; there are no 6.5 or 6.6 variants. The Deployment Helper page lives under the hosting guides but is listed here because it describes PaaS Native behavior.

## Get started

- [Get Started](platform/dev/6.7/products/paas/shopware/get-started/_index.md) — entry section for onboarding: CLI setup, codebase preparation, first application.
- [Prepare Shopware codebase](platform/dev/6.7/products/paas/shopware/get-started/prepare-codebase.md) — Composer-only plugins, shopware/k8s-meta (^2.0 for 6.7), application.yaml, extension removal.
- [Quickstart](platform/dev/6.7/products/paas/shopware/get-started/quickstart.md) — install sw-paas, create a project with a deploy key, create an application, watch for DEPLOYING_STORE_SUCCESS.

## Fundamentals

- [Organizations](platform/dev/6.7/products/paas/shopware/fundamentals/organization.md) — top-level unit for projects and users, member roles and sw-paas user commands.
- [Projects](platform/dev/6.7/products/paas/shopware/fundamentals/project.md) — maps a GitHub/Bitbucket/GitLab repo to deployable apps.
- [Applications](platform/dev/6.7/products/paas/shopware/fundamentals/applications.md) — resource defaults, build/update/deploy commands, rolling deployments, exec/command, domains.
- [Environment variables](platform/dev/6.7/products/paas/shopware/fundamentals/environment-variables.md) — precedence of .env, application.yaml and vault secrets; scope RUN or BUILD.
- [Secrets](platform/dev/6.7/products/paas/shopware/fundamentals/secrets.md) — Vault secret types env, buildenv, ssh and the sw-paas vault commands.
- [Plugin Store Authentication](platform/dev/6.7/products/paas/shopware/fundamentals/plugins-store-authentication.md) — SHOPWARE_PACKAGES_TOKEN and COMPOSER_AUTH build secrets.
- [PHP settings](platform/dev/6.7/products/paas/shopware/fundamentals/php-settings.md) — PHP_MAX_UPLOAD_SIZE, PHP_MAX_EXECUTION_TIME; PHP_SESSION_HANDLER is platform-managed.
- [K8s Meta Package](platform/dev/6.7/products/paas/shopware/fundamentals/k8s-meta.md) — shopware/k8s-meta metapackage, the operator.yaml it installs, overriding its config.
- [Snapshots](platform/dev/6.7/products/paas/shopware/fundamentals/snapshots.md) — assets archive plus database dump; create, list, restore, download-url, delete.

## CDN and frontends

- [CDN](platform/dev/6.7/products/paas/shopware/cdn/_index.md) — preconfigured Fastly edge HTTP cache, soft purge, storefront and cdn services.
- [Custom Domains](platform/dev/6.7/products/paas/shopware/cdn/custom-domains.md) — DNS records, _shopware-challenge TXT, sw-paas domain create, assignment in admin.
- [Fastly Snippets](platform/dev/6.7/products/paas/shopware/cdn/fastly-snippets.md) — custom VCL via services.fastly.snippets_path, priority by file name.
- [HTTP Reverse Proxy Configuration](platform/dev/6.7/products/paas/shopware/cdn/reverse-proxy.md) — stale-while-revalidate and stale-if-error defaults and overrides.
- [Security Features](platform/dev/6.7/products/paas/shopware/cdn/security-features.md) — Fastly NGWAF Core feature set enabled by default.
- [Composable Frontends](platform/dev/6.7/products/paas/shopware/composable-frontends/_index.md) — kind: cfe applications: Node.js version, /api/healthz, Dockerfile, ISR.

## Guides

- [Guides](platform/dev/6.7/products/paas/shopware/guides/_index.md) — entry page for the how-to guides.
- [How to set up repository access](platform/dev/6.7/products/paas/shopware/guides/setting-up-repository-access.md) — SSH deploy key for a private Git repo.
- [Using the Vault](platform/dev/6.7/products/paas/shopware/guides/secrets-vault-guide.md) — create, list, get, edit and delete secrets; system-managed secrets.
- [Manage Cron Jobs](platform/dev/6.7/products/paas/shopware/guides/cronjobs.md) — cronJobs in application.yaml and sw-paas application cronjob commands.
- [How to set up OpenSearch](platform/dev/6.7/products/paas/shopware/guides/opensearch.md) — services.opensearch.enabled, then dal:refresh:index --use-queue.
- [Clone Application](platform/dev/6.7/products/paas/shopware/guides/clone-application.md) — copy database and storage to another app; post-clone steps.
- [Update Shopware in PaaS Native](platform/dev/6.7/products/paas/shopware/guides/update-shopware.md) — snapshot, bump shopware/core, system:update:prepare, application update.

## Monitoring

- [Logs](platform/dev/6.7/products/paas/shopware/monitoring/logs.md) — runtime, deployment, cron job and command logs via CLI or Grafana; 45-day retention.
- [Traces](platform/dev/6.7/products/paas/shopware/monitoring/traces.md) — Grafana Explore with the Tempo data source; 14-day retention.
- [Monitor events](platform/dev/6.7/products/paas/shopware/monitoring/watch.md) — sw-paas watch, event filters, deployment status history.
- [Blackfire](platform/dev/6.7/products/paas/shopware/monitoring/blackfire.md) — services.blackfire.enabled plus BLACKFIRE_SERVER_ID/TOKEN secrets.
- [Tideways](platform/dev/6.7/products/paas/shopware/monitoring/tideways.md) — services.tideways.enabled plus TIDEWAYS_API_KEY secret.

## Related hosting guide

- [Hosting and Integrations](platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/hosting.md) — Deployment Helper on Platform.sh/Upsun, PaaS Native and the Kubernetes operator; Fastly VCL snippet deployment.
