---
id: platform/dev/6.7/products/tools/cli/project-commands/remote-extension-management.md
title: Remote Extension Management
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/cli/project-commands/remote-extension-management.html
sourceHash: 31f41441d8590125d40c7e1dc1004880f5eb8c0d
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopware-cli project extension", "shopware-cli project extension upload", "shopware-cli project extension install", "shopware-cli project extension activate", "shopware-cli project extension outdated", "/api/_action/extension/upload", "shopware.deployment.runtime_extension_management", "system.plugin_upload", "-e/--env", "extension manager cli", "shopware saas", "plugin lifecycle remote"]
summary: "shopware-cli project extension commands: list, install, update, upload, activate etc. of extensions on a remote shop via the Admin API; meant for SaaS."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/_index.md", "platform/dev/6.7/guides/development/dev-environment.md", "platform/dev/6.7/guides/development/tooling/fixture-bundle.md"]
---
## What it is

`shopware-cli project extension` wraps Shopware's extension management Admin API so extensions can be uploaded, installed and lifecycle-managed on a remote shop from the CLI, with the same capabilities as the Administration's Extension Manager.

## When to use

Automating extension uploads and lifecycle on hosted Shopware SaaS shops. For self-hosted installations the source recommends the [Deployment Helper](platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/_index.md) with Composer-installed plugins instead.

## Key steps / config

1. Provide connection data via `.shopware-project.yml` or environment variables, and log in with **username and password** (the extension API can be used only by users).
2. Optionally target a named environment from the `environments` section with `-e`/`--env` (uses that environment's `url` and `admin_api`; an unknown name fails instead of falling back):

```bash
shopware-cli project extension list -e staging
```

3. Commands:

```bash
shopware-cli project extension list
shopware-cli project extension install <extension-name>
shopware-cli project extension uninstall <extension-name>
shopware-cli project extension update <extension-name>
shopware-cli project extension outdated
shopware-cli project extension upload <path-to-extension-zip>
shopware-cli project extension delete <extension-name>
shopware-cli project extension activate <extension-name>
shopware-cli project extension deactivate <extension-name>
```

Core-side Admin API routes backing these operations: `/api/_action/extension/installed` (GET), `/api/_action/extension/upload` (POST, file field `file`, must be `application/zip`), `/api/_action/extension/install|uninstall|remove|update/{type}/{technicalName}` (POST), `/api/_action/extension/activate|deactivate/{type}/{technicalName}` (PUT).

## Essential identifiers

- `shopware-cli project extension list|install|uninstall|update|outdated|upload|delete|activate|deactivate`
- `-e`/`--env`, `environments`, `.shopware-project.yml`
- `/api/_action/extension/upload`, ACL privilege `system.plugin_upload`
- `shopware.deployment.runtime_extension_management`

## Gotchas

- Not intended for self-hosted shops (source info box).
- Log in with a user's username and password; the extension API is user-only.
- Core rejects upload/install/uninstall/remove/activate/deactivate/update calls when `shopware.deployment.runtime_extension_management` is `false` (default `true`); upload additionally requires the `system.plugin_upload` privilege.

## Code check (6.7.13.0)
- confirmed `/api/_action/extension/upload` — POST, ACL `system.plugin_upload`, zip only — vendor/shopware/core/Framework/Store/Api/ExtensionStoreActionsController.php:58
- confirmed `/api/_action/extension/install/{type}/{technicalName}` — POST — vendor/shopware/core/Framework/Store/Api/ExtensionStoreActionsController.php:122
- confirmed `/api/_action/extension/uninstall/{type}/{technicalName}` — POST, optional `keepUserData` — vendor/shopware/core/Framework/Store/Api/ExtensionStoreActionsController.php:136
- confirmed `/api/_action/extension/remove/{type}/{technicalName}` — POST, core counterpart of delete — vendor/shopware/core/Framework/Store/Api/ExtensionStoreActionsController.php:155
- confirmed `/api/_action/extension/activate/{type}/{technicalName}` — PUT — vendor/shopware/core/Framework/Store/Api/ExtensionStoreActionsController.php:174
- confirmed `/api/_action/extension/deactivate/{type}/{technicalName}` — PUT — vendor/shopware/core/Framework/Store/Api/ExtensionStoreActionsController.php:188
- confirmed `/api/_action/extension/update/{type}/{technicalName}` — POST, optional `allowNewPermissions` — vendor/shopware/core/Framework/Store/Api/ExtensionStoreActionsController.php:202
- confirmed `/api/_action/extension/installed` — GET list of installed extensions — vendor/shopware/core/Framework/Store/Api/ExtensionStoreDataController.php:42
- confirmed `runtime_extension_management` — `shopware.deployment` boolean, default true; false blocks the action routes — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:331
- unverified `shopware-cli project extension` — Go shopware-cli commands, `-e`/`--env` and user-only login check, out of scope
