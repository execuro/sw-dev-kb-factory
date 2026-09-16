---
id: platform/dev/6.7/products/paas/shopware/fundamentals/snapshots.md
title: Snapshots
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/fundamentals/snapshots.html
sourceHash: 3a2e30b86ba57edd1a7a5d10df81c6f561b0dda2
codeCheckedAgainst: "6.7.13.0"
keywords: ["sw-paas snapshot", "sw-paas snapshot create", "sw-paas snapshot restore", "sw-paas snapshot download-url", "--snapshot-id", "--deployment-id", "--include-deleted", "snapshots", "backup", "restore", "database dump", "service account"]
summary: "Shopware PaaS Native snapshots (assets archive + database dump): create, list, get, restore, download-url and delete via sw-paas snapshot commands."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/paas/shopware/fundamentals/account.md"]
---
## What it is

Snapshots are backups of Shopware PaaS Native application deployments. Each snapshot is a compressed archive containing the application assets and a database dump, managed with the `sw-paas snapshot` commands.

## When to use

Before risky changes such as updating Shopware, to restore an application deployment from an earlier backup, or to download a snapshot archive.

## Key steps / config

If resource identifiers are omitted, the CLI prompts for organization, project, application, deployment, or snapshot where required.

```sh
sw-paas snapshot create --deployment-id <deployment-id> --description "Before updating Shopware"
sw-paas snapshot list [--include-deleted]
sw-paas snapshot get --snapshot-id <snapshot-id>
sw-paas snapshot restore --snapshot-id <snapshot-id>
sw-paas snapshot download-url --snapshot-id <snapshot-id>
sw-paas snapshot delete --snapshot-id <snapshot-id>
```

- `create` without flags is interactive; `--deployment-id` and `--description` are optional.
- `list --include-deleted` also shows deleted snapshots.
- `get` displays snapshot details; `download-url` generates a URL for downloading the snapshot archive.

Selecting resources by name works on all snapshot commands:

```sh
sw-paas snapshot list \
  --organization <organization-name> \
  --project <project-name> \
  --application <application-name> \
  --deployment-id <deployment-id>
```

## Essential identifiers

- `sw-paas snapshot create|list|get|restore|download-url|delete`
- `--snapshot-id`, `--deployment-id`, `--description`, `--include-deleted`
- `--organization`, `--project`, `--application`

## Gotchas

- With a strictly scoped service account token, selecting resources by name needs extra permissions: use resource IDs instead, or grant the service account the policies required for name resolution. See [Account](platform/dev/6.7/products/paas/shopware/fundamentals/account.md).

## Code check (6.7.13.0)
- unverified `sw-paas snapshot create` — external PaaS CLI command, no match in vendor/shopware core or storefront, out of scope
- unverified `sw-paas snapshot restore` — external PaaS CLI command, out of scope
- unverified `sw-paas snapshot download-url` — external PaaS CLI command, out of scope
- unverified `--snapshot-id` — PaaS CLI flag, not part of the installed Shopware code
- unverified `--include-deleted` — PaaS CLI flag, not part of the installed Shopware code
