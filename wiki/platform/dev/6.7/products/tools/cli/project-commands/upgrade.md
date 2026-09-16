---
id: platform/dev/6.7/products/tools/cli/project-commands/upgrade.md
title: Upgrade a Shopware Project
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/cli/project-commands/upgrade.html
sourceHash: c6b901c3ec917cc66abd4299192c6a0ba81b18b9
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopware-cli project upgrade", "upgrade wizard", "update shopware", "--dry-run", "--no-interaction", "--target", "--no-audit", "--disable-git", "shopware/deployment-helper", "composer update", ".shopware-cli/upgrade/report.md", "shopware-cli project autofix composer-plugins", "extension compatibility", "preflight"]
summary: shopware-cli project upgrade - local-first wizard with readiness checks, Composer resolution, plan review, local run and a report; --dry-run preflight.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/upgrades-migrations/upgrade-shopware.md", "platform/dev/6.7/guides/hosting/installation-updates/performing-updates.md", "platform/dev/6.7/products/tools/cli/project-commands/autofix.md", "platform/dev/6.7/products/tools/cli/validation.md"]
---
## What it is

`shopware-cli project upgrade` guides a Shopware project through a local-first upgrade: readiness checks, Composer-managed extension analysis, a Composer resolution check of the target dependency set, plan review, local execution, and a shareable Markdown report. It does not deploy to production.

## When to use

Upgrading a Composer-based Shopware project to a newer version, interactively or as a non-interactive preflight in CI/scripts/agent workflows. For the wider procedure see [Upgrade Shopware](platform/dev/6.7/guides/upgrades-migrations/upgrade-shopware.md) and [Performing Shopware Updates](platform/dev/6.7/guides/hosting/installation-updates/performing-updates.md).

## Key steps / config

Prerequisites checked by the wizard (run on a Git branch or disposable copy):

- `composer.lock` exists and contains the installed `shopware/core` version.
- Clean Git working tree (only a warning outside a Git repo; `--disable-git` skips Git checks).
- All discovered extensions are Composer-managed; PHP and Composer available via the project's environment (Docker executor included).
- Deployment Helper workflow available — `shopware/deployment-helper` can be added during the upgrade.

Preparation:

1. `shopware-cli project validate` — find removed/renamed Shopware PHP types in custom code (see [validation](platform/dev/6.7/products/tools/cli/validation.md)).
2. `shopware-cli project autofix composer-plugins` — migrate extensions from `custom/plugins` to Composer (see [autofix](platform/dev/6.7/products/tools/cli/project-commands/autofix.md)).

Interactive run: `shopware-cli project upgrade` — six phases: readiness, target version choice, extension compatibility + Composer resolution check, plan review, local apply with live logs, report. Readiness/preparation phases are read-only.

Execution steps once started:

1. Back up `composer.json` and `composer.lock`.
2. Rewrite Shopware and resolved extension requirements in `composer.json`.
3. `composer update --with-all-dependencies`
4. `composer symfony:recipes:install --force --reset` (best-effort; failure is a warning)
5. `vendor/bin/shopware-deployment-helper run`
6. Write the upgrade report.

Non-interactive preflight:

```bash
shopware-cli project upgrade --no-interaction --target latest-patch --dry-run
```

`--target` is required with `--no-interaction`: an exact version (e.g. `6.7.13.0`), `recommended`, or `latest-patch`. `--dry-run` runs checks, analysis and Composer resolution, prints the plan, writes a report, and stops before changing files. Drop `--dry-run` to execute. `--no-audit` disables Composer's security-advisory block for the workflow.

Report: `.shopware-cli/upgrade/report.md` (execution log also under `.shopware-cli/upgrade/`) — source/target versions, readiness and PHP requirements, planned Composer changes, extension results (blocked / needs review / needs update / OK), changelogs, predicted package changes, raw Composer conflict output.

## Essential identifiers

- `shopware-cli project upgrade`, `--no-interaction`, `--target`, `--dry-run`, `--no-audit`, `--disable-git`
- `shopware-cli project validate`, `shopware-cli project autofix composer-plugins`
- `shopware/deployment-helper`, `vendor/bin/shopware-deployment-helper run`
- `.shopware-cli/upgrade/report.md`

## Gotchas

- Extensions outside `vendor/` (e.g. `custom/plugins`) block the readiness check.
- Composer resolution is the final gate; Store/repository metadata may be incomplete. If Composer cannot resolve, the wizard stops before modifying the project.
- On failure or cancel, only `composer.json`/`composer.lock` are restored; other files changed by tools are not rolled back — start from clean Git state.
- Use `--no-audit` only after accepting the reported security risk.
- A successful run does not rewrite incompatible extension code, create missing extension releases, or replace testing and deployment.

## Code check (6.7.13.0)
- unverified `shopware-cli project upgrade` — Shopware CLI (Go tool), not part of vendor/shopware
- unverified `shopware/deployment-helper` — separate package, not referenced in vendor/shopware core/storefront
- unverified `.shopware-cli/upgrade/report.md` — CLI output path, out of scope of vendor/shopware
- confirmed `shopware/core` — package name the readiness check reads from composer.lock — vendor/shopware/core/composer.json:2
- confirmed `custom/plugins` — default local plugin directory outside Composer — vendor/shopware/core/Framework/Plugin/KernelPluginLoader/KernelPluginLoader.php:50
