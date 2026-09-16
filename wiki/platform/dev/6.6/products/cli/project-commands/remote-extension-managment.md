---
id: platform/dev/6.6/products/cli/project-commands/remote-extension-managment.md
title: Remote Extension Management
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/cli/project-commands/remote-extension-managment.html
sourceHash: dd605edf9319206a26ae489d70b5159cad92077f
keywords: ["shopware-cli", "project extension list", "project extension install", "project extension uninstall", "project extension update", "project extension outdated", "project extension upload", "project extension delete", "Extension Manager", "Deployment Helper", "SaaS"]
summary: "shopware-cli project extension {list,install,uninstall,update,outdated,upload,delete} manage extensions via the Shopware API, for SaaS."
lastBuilt: "2026-09-15"
relatedPages: ["platform/dev/6.6/guides/hosting/installation-updates/deployments/deployment-helper.md", "platform/dev/6.6/products/cli/project-commands/project-config-sync.md"]
---
## What it is

Shopware CLI's extension manager installs and manages extensions in a Shopware project through the Shopware API, mirroring the Extension Manager in the Shopware 6 Administration but from the CLI.

## When to use

This functionality was designed for Shopware SaaS and should not be used for self-hosted installations; for self-hosted, use the Deployment Helper and install plugins via Composer instead (see [Deployment Helper](platform/dev/6.6/guides/hosting/installation-updates/deployments/deployment-helper.md)).

## Key steps / config

Requires a `.shopware-project.yml` or equivalent environment variables (see [Project Config synchronization](platform/dev/6.6/products/cli/project-commands/project-config-sync.md)), and login with username and password — the extension API can only be used by users.

```bash
shopware-cli project extension list
shopware-cli project extension install <extension-name>
shopware-cli project extension uninstall <extension-name>
shopware-cli project extension update <extension-name>
shopware-cli project extension outdated
shopware-cli project extension upload <path-to-extension-zip>
shopware-cli project extension delete <extension-name>
```

`outdated` shows extensions with an update available; `upload` uploads an extension to the Shopware instance; `delete` deletes an extension from the instance.

## Essential identifiers

- `shopware-cli project extension list/install/uninstall/update/outdated/upload/delete`

## Gotchas

The extension API can only be used by users logged in with username and password, not with API client credentials alone.
