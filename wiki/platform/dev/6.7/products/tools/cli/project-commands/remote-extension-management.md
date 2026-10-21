---
id: platform/dev/6.7/products/tools/cli/project-commands/remote-extension-management.md
title: Remote Extension Management
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/cli/project-commands/remote-extension-management.html
sourceHash: 325d481f2ac2d47bf84229a93a5d08b5668a8261
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware-cli project extension", "project extension install", "project extension upload", "project extension list", "project extension outdated", "remote extension management", "plugin install via api", "saas extensions", "--env", "environments", ".config/shopware-project.yml", "runtime_extension_management", "/api/_action/extension"]
summary: shopware-cli project extension list/install/uninstall/update/upload/delete/activate/deactivate manages extensions on a remote shop via the Admin API.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/_index.md", "platform/dev/6.7/guides/development/tooling/fixture-bundle.md", "platform/dev/6.7/guides/development/dev-environment.md"]
---
## What it is

`shopware-cli project extension ...` is a CLI wrapper around Shopware's extension management through the Admin API — the same capabilities as the Administration's Extension Manager, but scriptable. It is widely used by Shopware SaaS customers to upload extensions and drive their lifecycle on hosted shops without the Admin UI.

## When to use

Automating extension upload, install, update and activation on a Shopware SaaS instance. For self-hosted installations the source recommends the [Deployment Helper](platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/_index.md) with all plugins installed via Composer instead.

## Key steps / config

1. Provide the connection in `.config/shopware-project.yml` or environment variables (see [Fixture Bundle](platform/dev/6.7/guides/development/tooling/fixture-bundle.md)). Log in with a username and password — the extension API is usable only by users.
2. Optionally target a named environment from the `environments` section with the global `-e`/`--env` flag (see [Development Environment](platform/dev/6.7/guides/development/dev-environment.md)); its `url` and `admin_api` credentials are used:
   ```bash
   shopware-cli project extension list -e staging
   ```
3. Commands:

| Command | Action |
|---|---|
| `shopware-cli project extension list` | List all extensions |
| `shopware-cli project extension install <extension-name>` | Install |
| `shopware-cli project extension uninstall <extension-name>` | Uninstall |
| `shopware-cli project extension update <extension-name>` | Update |
| `shopware-cli project extension outdated` | Show extensions with an available update |
| `shopware-cli project extension upload <path-to-extension-zip>` | Upload a zip to the instance |
| `shopware-cli project extension delete <extension-name>` | Delete from the instance |
| `shopware-cli project extension activate <extension-name>` | Activate an installed extension |
| `shopware-cli project extension deactivate <extension-name>` | Deactivate an installed extension |

The shop side is served by the core `/api/_action/extension/...` routes (`upload`, `install/{type}/{technicalName}`, `uninstall/...`, `remove/...`, `activate/...`, `deactivate/...`, `update/...`, `installed`).

## Essential identifiers

- `shopware-cli project extension list|install|uninstall|update|outdated|upload|delete|activate|deactivate`
- `-e` / `--env`, `environments`, `.config/shopware-project.yml`
- `shopware.deployment.runtime_extension_management`
- Core routes `api.extension.upload`, `api.extension.install`, `api.extension.activate`

## Gotchas

- An unknown `--env` name makes the command fail rather than silently falling back to the default configuration.
- Integration credentials do not work for the extension API; use user login.
- The installed core rejects these actions when `shopware.deployment.runtime_extension_management` is `false` (default `true`), so a deployment-helper style setup with runtime management disabled blocks them.
- Upload must be a zip (`application/zip` MIME type) and requires the `system.plugin_upload` ACL privilege.

## Code check (6.7.15.1)
- confirmed `/api/_action/extension/upload` — upload route, ACL `system.plugin_upload` — vendor/shopware/core/Framework/Store/Api/ExtensionStoreActionsController.php:58
- confirmed `/api/_action/extension/install/{type}/{technicalName}` — install route — vendor/shopware/core/Framework/Store/Api/ExtensionStoreActionsController.php:122
- confirmed `/api/_action/extension/uninstall/{type}/{technicalName}` — uninstall route — vendor/shopware/core/Framework/Store/Api/ExtensionStoreActionsController.php:136
- confirmed `/api/_action/extension/remove/{type}/{technicalName}` — removal route behind the CLI `delete` — vendor/shopware/core/Framework/Store/Api/ExtensionStoreActionsController.php:155
- confirmed `/api/_action/extension/activate/{type}/{technicalName}` — activate route (PUT) — vendor/shopware/core/Framework/Store/Api/ExtensionStoreActionsController.php:174
- confirmed `/api/_action/extension/deactivate/{type}/{technicalName}` — deactivate route (PUT) — vendor/shopware/core/Framework/Store/Api/ExtensionStoreActionsController.php:188
- confirmed `/api/_action/extension/update/{type}/{technicalName}` — update route — vendor/shopware/core/Framework/Store/Api/ExtensionStoreActionsController.php:202
- confirmed `/api/_action/extension/installed` — list of installed extensions — vendor/shopware/core/Framework/Store/Api/ExtensionStoreDataController.php:42
- confirmed `runtime_extension_management` — boolean, default true; actions throw when disabled — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:352
- unverified `shopware-cli project extension` — Go CLI, not part of the Shopware core/storefront/administration packages
