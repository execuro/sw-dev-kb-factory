---
id: platform/dev/6.6/products/cli/project-commands/project-config-sync.md
title: Project Config synchronization
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/cli/project-commands/project-config-sync.html
sourceHash: 1abbc2b141bb1f7b818da4df17562397f3b07097
keywords: ["shopware-cli", "project config init", "project config pull", "project config push", ".shopware-project.yml", "SHOPWARE_CLI_API_URL", "SHOPWARE_CLI_API_CLIENT_ID", "SHOPWARE_CLI_API_CLIENT_SECRET", "sync entity", "theme configuration", "system configuration"]
summary: "shopware-cli project config pull/push syncs theme, system config, mail templates and entities between Shopware environments."
lastBuilt: "2026-09-15"
---
## What it is

Shopware CLI can synchronize project configuration between environments: Theme Configuration, System Configuration (including extension configuration), Mail Templates, and Entity data.

## Key steps / config

Create a `.shopware-project.yml` in the project root (or use `shopware-cli project config init`), and configure API access.

Credentials can be set via environment variables instead of the file: `SHOPWARE_CLI_API_URL`, `SHOPWARE_CLI_API_CLIENT_ID`, `SHOPWARE_CLI_API_CLIENT_SECRET`, `SHOPWARE_CLI_API_USERNAME`, `SHOPWARE_CLI_API_PASSWORD`, `SHOPWARE_CLI_API_DISABLE_SSL_CHECK`. Use either the client ID/secret pair or the username/password pair.

Pull the current configuration:

```bash
shopware-cli project config pull
```

Push local changes (shows a diff and asks for confirmation):

```bash
shopware-cli project config push
```

Entity synchronization writes directly via the Shopware API:

```yaml
sync:
  entity:
    - entity: tax
      payload:
        name: 'Tax'
        taxRate: 19
```

To avoid duplicate entities on repeated syncs, add an `exists` criteria:

```yaml
sync:
  entity:
    - entity: tax
      exists:
        - type: equals
          field: name
          value: 'Tax'
      payload:
        name: 'Tax'
        taxRate: 19
```

## Essential identifiers

- `shopware-cli project config init` / `pull` / `push`
- `.shopware-project.yml`
- `SHOPWARE_CLI_API_URL`, `SHOPWARE_CLI_API_CLIENT_ID`, `SHOPWARE_CLI_API_CLIENT_SECRET`, `SHOPWARE_CLI_API_USERNAME`, `SHOPWARE_CLI_API_PASSWORD`, `SHOPWARE_CLI_API_DISABLE_SSL_CHECK`
- `sync.entity`

## Gotchas

Without a fixed entity ID or an `exists` criteria, repeated entity syncs create duplicate entities.
