---
id: platform/dev/6.7/products/paas/shopware/guides/clone-application.md
title: Clone Application
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/guides/clone-application.html
sourceHash: 9cc540d2ea889825076d78e9904f2d5f0fc193c4
codeCheckedAgainst: "6.7.15.1"
keywords: ["sw-paas application clone", "sw-paas app deploy list", "sw-paas open admin", "sw-paas exec --new", "user:change-password", "dal:refresh:index", "DEPLOYING_STORE_SUCCESS", "clone application", "copy database", "snapshot restore", "paas native", "staging copy"]
summary: Copy a PaaS Native app's database and storage to another app in the same org with sw-paas application clone; post-clone steps.
lastBuilt: 2026-10-21
---
## What it is

Cloning in Shopware PaaS Native copies the database and object storage (filesystem) content of an existing application to another application in the same organization. It works by creating a snapshot of the source application and restoring that snapshot onto the target. The codebase is **not** copied: the target keeps its own commit.

## When to use

- Feature testing on a copy without touching the original.
- Disaster recovery: back up by cloning into a different project.
- Development environments: copy production data into a dev application for realistic testing.

## Key steps / config

**Prerequisites**

- Source and target are in the same organization (cross-organization cloning is not possible) and you have access to both projects.
- The target application already exists and has been deployed, ideally on the same commit as the source.
- The latest source deployment succeeded (state `DEPLOYING_STORE_SUCCESS`). Check with `sw-paas app deploy list`. If the state is `DEPLOYING_STORE_FAILED`, do not clone — fix the deployment or pick an earlier successful one.

**Clone**

- Interactive: `sw-paas application clone` with no parameters prompts for source organization, project, application and deployment, then target project (same organization only) and an existing target application.
- Manual:

```shell
sw-paas application clone \
  --organization-id <organization-id> \
  --project-id <source-project-id> \
  --application-id <source-application-id> \
  --target-application-id <target-application-id> \
  --target-project-id <target-project-id>
```

The process runs in two stages: snapshot creation (database + filesystem of the source at the selected deployment), then snapshot restoration onto the target, overwriting its existing data. Monitor with `sw-paas app deploy list` or `sw-paas app deploy get`; the clone is complete once the status shows `DEPLOYING_STORE_SUCCESS`.

**Post-clone tasks** (source = App A, target = App B)

1. Admin password: App B has App A's admin password. Fetch it by running `sw-paas open admin` and selecting App A. Either change it in the Administration (user profile > **Your profile** > **Password**, entering the password `sw-paas open admin` shows for App B as the new one and App A's password in the verification modal), or open `sw-paas exec --new` and run `bin/console user:change-password admin`.
2. OpenSearch: if enabled, open `sw-paas exec --new` and run `bin/console dal:refresh:index --use-queue`.
3. Sales channel domain: the clone keeps the source domain configuration. In the Administration of the clone, open each sales channel, scroll to **Domains** and set the clone's domain (its assigned `shopware.shop` domain or a custom domain).

## Essential identifiers

- `sw-paas application clone` (flags `--organization-id`, `--project-id`, `--application-id`, `--target-application-id`, `--target-project-id`)
- `sw-paas app deploy list`, `sw-paas app deploy get`
- `sw-paas open admin`, `sw-paas exec --new`
- `bin/console user:change-password admin`
- `bin/console dal:refresh:index --use-queue`
- Deployment states `DEPLOYING_STORE_SUCCESS`, `DEPLOYING_STORE_FAILED`

## Gotchas

- Only data is cloned, not code — keep the target on the same commit as the source.
- Restoration overwrites all existing target data.
- Database content is not anonymized; the restored snapshot includes everything, including scheduled task data stored in the database.
- Duration depends on data size.

## Code check (6.7.15.1)
- confirmed `user:change-password` — console command name; takes a required `username` argument — vendor/shopware/core/Maintenance/User/Command/UserChangePasswordCommand.php:27
- confirmed `UserChangePasswordCommand::configure()` — declares the `username` argument and a `--password`/`-p` option — vendor/shopware/core/Maintenance/User/Command/UserChangePasswordCommand.php:43
- confirmed `dal:refresh:index` — console command name — vendor/shopware/core/Framework/DataAbstractionLayer/Command/RefreshIndexCommand.php:23
- confirmed `use-queue` — option of `dal:refresh:index`, passed to the indexer registry so indexing is queued — vendor/shopware/core/Framework/DataAbstractionLayer/Command/RefreshIndexCommand.php:45
- unverified `sw-paas application clone` — PaaS CLI, outside the Shopware code roots
- unverified `DEPLOYING_STORE_SUCCESS` — PaaS deployment state, outside the Shopware code roots
