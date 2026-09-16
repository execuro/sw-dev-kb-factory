---
id: platform/dev/6.7/products/paas/shopware/guides/clone-application.md
title: Clone Application
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/guides/clone-application.html
sourceHash: bbc7d784a51d37abecd94310639cdec077b8144c
codeCheckedAgainst: "6.7.13.0"
keywords: ["sw-paas application clone", "sw-paas app deploy list", "DEPLOYING_STORE_SUCCESS", "DEPLOYING_STORE_FAILED", "sw-paas open admin", "sw-paas exec --new", "user:change-password", "dal:refresh:index", "snapshot", "clone application", "copy shop", "reindex opensearch"]
summary: "Clone a PaaS Native application via snapshot/restore with sw-paas application clone; prerequisites, monitoring, and post-clone password, reindex, domain tasks."
lastBuilt: 2026-09-15
---
## What it is

How to copy an existing Shopware PaaS Native application (codebase, database and filesystem) to another application in the same organization. The CLI creates a snapshot of the source application and restores it to the target, overwriting existing data.

## When to use

Feature testing without touching the original, disaster-recovery copies into other projects, or filling development environments with production data.

## Key steps / config

1. Prerequisites: source and target in the same organization; access to both projects; target application exists (or you may create it); the source's latest deployment is in state `DEPLOYING_STORE_SUCCESS`. Check with `sw-paas app deploy list`.
2. Clone interactively with `sw-paas application clone` (select source organization, project, application, deployment; then target project and existing application), or pass IDs:
   ```sh
   sw-paas application clone \
     --organization-id <organization-id> \
     --project-id <source-project-id> \
     --application-id <source-application-id> \
     --target-application-id <target-application-id> \
     --target-project-id <target-project-id>
   ```
3. Monitor with `sw-paas app deploy list` or `sw-paas app deploy get`; the clone is done when the status is `DEPLOYING_STORE_SUCCESS`.
4. Post-clone tasks on the target (App B):
   - Admin password: App B has App A's admin password. Run `sw-paas open admin` for App A to get it and log in to App B, then set the password shown by `sw-paas open admin` for App B under **Your profile** → **Password** (confirm with App A's password). Or open `sw-paas exec --new` and run `bin/console user:change-password admin`.
   - OpenSearch (if enabled): in `sw-paas exec --new`, run `bin/console dal:refresh:index --use-queue`.
   - Sales channel domain: in the Administration, open each sales channel, scroll to **Domains** and change the domain to the clone's domain (e.g. its `shopware.shop` domain or a custom domain).

## Essential identifiers

- `sw-paas application clone` with `--organization-id`, `--project-id`, `--application-id`, `--target-application-id`, `--target-project-id`
- `sw-paas app deploy list`, `sw-paas app deploy get`
- `DEPLOYING_STORE_SUCCESS`, `DEPLOYING_STORE_FAILED`
- `sw-paas open admin`, `sw-paas exec --new`
- `bin/console user:change-password admin` (argument `username`; option `--password`/`-p`, otherwise prompted)
- `bin/console dal:refresh:index --use-queue`

## Gotchas

- Cloning across organizations is not possible.
- Do not clone when the source deployment state is `DEPLOYING_STORE_FAILED`; fix it or use an earlier successful deployment.
- The target's existing data is overwritten.
- Cloning does not anonymize the database; the copy includes all data, including scheduled task data stored in the database.
- The clone keeps the source's domain configuration until you change it in the sales channel.

## Code check (6.7.13.0)
- confirmed `user:change-password` — console command exists — vendor/shopware/core/Maintenance/User/Command/UserChangePasswordCommand.php:26
- confirmed `username` — required argument, so `admin` is passed positionally; `--password`/`-p` optional, prompted if omitted — vendor/shopware/core/Maintenance/User/Command/UserChangePasswordCommand.php:43
- confirmed `dal:refresh:index` — console command exists — vendor/shopware/core/Framework/DataAbstractionLayer/Command/RefreshIndexCommand.php:22
- confirmed `use-queue` — option of `dal:refresh:index`, passed to the indexer registry to index via the message queue — vendor/shopware/core/Framework/DataAbstractionLayer/Command/RefreshIndexCommand.php:45
- unverified `sw-paas application clone` — external PaaS CLI, not part of vendor/shopware
- unverified `DEPLOYING_STORE_SUCCESS` — PaaS deployment state, not present in the installed Shopware code
