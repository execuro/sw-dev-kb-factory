---
docType: developer
id: platform/dev/6.6/guides/hosting/installation-updates/deployments/deployment-helper.md
sourceHash: 38f970c833adb6452799664896580c461eb8940c
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/hosting/installation-updates/deployments/deployment-helper.html
title: Deployment Helper
version: "6.6"
versions: ["6.6"]
keywords: ["Deployment Helper", "shopware/deployment-helper", "shopware-deployment-helper", ".shopware-project.yml", "extension-management", "one-time-tasks", "Fastly", "FASTLY_API_KEY", "FASTLY_SERVICE_ID", "SHOPWARE_STORE_ACCOUNT_EMAIL", "SHOPWARE_STORE_LICENSE_DOMAIN", "install", "update"]
summary: "Composer tool that unifies post-upload deployment steps: install/update Shopware, manage extensions, compile theme, run one-time tasks."
lastBuilt: "2026-09-15"
---
## What it is

The Deployment Helper is a Composer tool that unifies the steps executed after code has been uploaded to the server, checking whether Shopware is installed and waiting for the database if needed.

## When to use

Use it during traditional or containerized deployments to install/update Shopware, install or update extensions (apps and plugins), compile the theme, and run custom or one-time commands.

## Key steps / config

Install and run:

```bash
composer require shopware/deployment-helper
vendor/bin/shopware-deployment-helper run
```

Configure via `.shopware-project.yml` in the project root:

```yaml
deployment:
  hooks:
    pre: ...
    post: ...
    pre-install: ...
    post-install: ...
    pre-update: ...
    post-update: ...
  extension-management:
    enabled: true
    exclude:
      - Name
    overrides:
      MyPlugin:
        state: ignore
      AnotherPlugin:
        state: inactive
      RemoveThisPlugin:
        state: remove
        keepUserData: true
  one-time-tasks:
    - id: foo
      script: |
        ./bin/console --version
  store:
    license-domain: 'example.com'
```

Environment variables: `INSTALL_LOCALE` (default `en-GB`), `INSTALL_CURRENCY` (default `EUR`), `INSTALL_ADMIN_USERNAME` (default `admin`), `INSTALL_ADMIN_PASSWORD` (default `shopware`), `SALES_CHANNEL_URL`, `SHOPWARE_DEPLOYMENT_TIMEOUT` (default `300`), `SHOPWARE_STORE_ACCOUNT_EMAIL`, `SHOPWARE_STORE_ACCOUNT_PASSWORD`, `SHOPWARE_STORE_LICENSE_DOMAIN`.

One-time tasks: list with `./vendor/bin/shopware-deployment-helper one-time-task:list`; remove marking with `./vendor/bin/shopware-deployment-helper one-time-task:unmark <id>` (re-runs next update); mark as run with `./vendor/bin/shopware-deployment-helper one-time-task:mark <id>`.

Fastly integration: `composer require shopware/fastly-meta`, then set `FASTLY_API_KEY` and `FASTLY_SERVICE_ID`. Manage snippets with `./vendor/bin/shopware-deployment-helper fastly:snippet:list` and `fastly:snippet:remove <name>`.

To remove an extension, first set it to `remove` in `.shopware-project.yml` under `overrides`, deploy, then delete the extension's source and its entry from `.shopware-project.yml`, and deploy again. Find extension names via `./bin/console plugin:list`.

## Essential identifiers

- `shopware/deployment-helper`
- `vendor/bin/shopware-deployment-helper run`
- `.shopware-project.yml`
- `extension-management`
- `one-time-tasks`
- `shopware/fastly-meta`
- `FASTLY_API_KEY`, `FASTLY_SERVICE_ID`
- `./bin/console plugin:list`

## Gotchas

The Deployment Helper only logs in to the Shopware Store for system tasks (extension installation/updates); every Administration user must still log in manually to use the Extension Manager UI. `SHOPWARE_STORE_LICENSE_DOMAIN` overwrites the `license-domain` value from `.shopware-project.yml` when set.
