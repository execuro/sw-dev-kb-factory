---
id: platform/dev/6.7/products/paas/shopware/fundamentals/snapshots.md
title: Snapshots
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/fundamentals/snapshots.html
sourceHash: 3a2e30b86ba57edd1a7a5d10df81c6f561b0dda2
codeCheckedAgainst: "6.7.15.1"
keywords: ["sw-paas snapshot create", "sw-paas snapshot list", "sw-paas snapshot restore", "sw-paas snapshot download-url", "sw-paas snapshot delete", "--snapshot-id", "--deployment-id", "--include-deleted", "snapshot", "backup", "database dump", "restore", "paas native"]
summary: Shopware PaaS Native snapshots (assets archive + database dump) of a deployment; create, list, get, restore, download-url and delete via sw-paas snapshot.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/paas/shopware/fundamentals/account.md"]
---
## What it is

Snapshots are backups of application deployments on Shopware PaaS Native. Each snapshot is a compressed archive containing the application assets and a database dump. They are managed with the `sw-paas snapshot` commands.

## When to use

Before risky changes (for example before updating Shopware), to roll a deployment back, or to download a copy of a deployment's assets and database.

## Key steps / config

If resource identifiers are omitted, the CLI prompts for the organization, project, application, deployment or snapshot where required.

```sh
sw-paas snapshot create
sw-paas snapshot create --deployment-id <deployment-id> --description "Before updating Shopware"
sw-paas snapshot list
sw-paas snapshot list --include-deleted
sw-paas snapshot get --snapshot-id <snapshot-id>
sw-paas snapshot restore --snapshot-id <snapshot-id>
sw-paas snapshot download-url --snapshot-id <snapshot-id>
sw-paas snapshot delete --snapshot-id <snapshot-id>
```

All snapshot commands accept selection of organization, project and application by name:

```sh
sw-paas snapshot list \
  --organization <organization-name> \
  --project <project-name> \
  --application <application-name> \
  --deployment-id <deployment-id>
```

## Essential identifiers

- `sw-paas snapshot create` (`--deployment-id`, `--description`)
- `sw-paas snapshot list` (`--include-deleted`)
- `sw-paas snapshot get` / `restore` / `download-url` / `delete` (`--snapshot-id`)
- `--organization`, `--project`, `--application` — name-based selection

## Gotchas

- `download-url` returns a URL for the archive rather than downloading it directly.
- With a strictly scoped service account token, name resolution may fail: use resource IDs instead of names, or grant the service account the policies needed for name resolution — see [Account / service accounts](platform/dev/6.7/products/paas/shopware/fundamentals/account.md).

## Code check (6.7.15.1)
- unverified `sw-paas snapshot create` — Shopware PaaS CLI command, not part of the installed Shopware packages
- unverified `sw-paas snapshot restore` — Shopware PaaS CLI command, out of scope of vendor/shopware
- unverified `sw-paas snapshot download-url` — Shopware PaaS CLI command, out of scope of vendor/shopware
