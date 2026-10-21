---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/products/tools/cli/project-commands/upgrade.md
relatedPages:
  - platform/dev/6.7/products/tools/cli/validation.md
  - platform/dev/6.7/products/tools/cli/project-commands/autofix.md
  - platform/dev/6.7/guides/upgrades-migrations/upgrade-shopware.md
  - platform/dev/6.7/guides/hosting/installation-updates/performing-updates.md
sourceHash: c6b901c3ec917cc66abd4299192c6a0ba81b18b9
sourceUrl: https://developer.shopware.com/docs/products/tools/cli/project-commands/upgrade.html
title: Upgrade a Shopware Project
version: "6.7"
versions:
  - "6.7"
keywords: ["shopware-cli project upgrade", "upgrade wizard", "update shopware version", "--target", "--dry-run", "--no-interaction", "--no-audit", "--disable-git", "shopware/deployment-helper", "composer update --with-all-dependencies", ".shopware-cli/upgrade/report.md", "extension compatibility", "shopware-cli project autofix composer-plugins"]
summary: "shopware-cli project upgrade: local upgrade wizard with readiness and Composer resolution checks, --dry-run preflight and a Markdown upgrade report."
lastBuilt: 2026-10-21
---
## What it is

`shopware-cli project upgrade` is a wizard that upgrades a Shopware project locally: it checks readiness, analyzes Composer-managed extensions, verifies the target dependency set with a Composer dry run, shows the plan, applies the upgrade and writes a shareable Markdown report. It does not deploy — test, commit and deploy through your normal process.

## When to use

Moving a project to a newer Shopware version, interactively or in CI/scripts/agent workflows via a non-interactive preflight. For the wider procedure see [Upgrade Shopware](platform/dev/6.7/guides/upgrades-migrations/upgrade-shopware.md) and [Performing Shopware Updates](platform/dev/6.7/guides/hosting/installation-updates/performing-updates.md).

## Key steps / config

Prerequisites checked by the wizard (run on a Git branch or disposable copy):

- `composer.lock` exists and contains the installed `shopware/core` version.
- Clean Git working tree (outside a Git repo it only warns; `--disable-git` skips Git checks).
- All extensions are Composer-managed — extensions in `custom/plugins` block readiness; migrate them with `shopware-cli project autofix composer-plugins` ([autofix](platform/dev/6.7/products/tools/cli/project-commands/autofix.md)).
- PHP and Composer available through the project's configured environment (Docker: via the project executor).
- `shopware/deployment-helper` available; the wizard can add it if missing.

Before starting, run `shopware-cli project validate` to find references to removed/renamed Shopware PHP types ([validation](platform/dev/6.7/products/tools/cli/validation.md)).

Interactive run: `shopware-cli project upgrade`. Phases: readiness → target version → extension analysis + Composer resolution → review plan → apply locally → report. The first phases are read-only.

Applying the upgrade:

1. Back up `composer.json` and `composer.lock`.
2. Rewrite Shopware and resolved extension requirements in `composer.json`.
3. `composer update --with-all-dependencies`
4. `composer symfony:recipes:install --force --reset` (best-effort; failure is only a warning)
5. `vendor/bin/shopware-deployment-helper run`
6. Write the report.

Non-interactive preflight:

```bash
shopware-cli project upgrade \
  --no-interaction \
  --target latest-patch \
  --dry-run
```

With `--no-interaction`, `--target` is required: an exact version (e.g. `6.7.13.0`), `recommended` or `latest-patch`. `--dry-run` runs all checks, prints the plan, writes a report and stops before changing files; drop it to execute. `--no-audit` disables Composer's security-advisory block.

Output: `.shopware-cli/upgrade/report.md` plus an execution log below `.shopware-cli/upgrade/`. The report lists versions, readiness/PHP requirements, planned Composer changes, extension results (blocked / needs review / needs update / OK), changelogs and raw Composer conflict output on failure.

## Essential identifiers

- `shopware-cli project upgrade`
- `--no-interaction`, `--target`, `--dry-run`, `--no-audit`, `--disable-git`
- `shopware-cli project validate`, `shopware-cli project autofix composer-plugins`
- `vendor/bin/shopware-deployment-helper run`
- `.shopware-cli/upgrade/report.md`

## Gotchas

- Composer resolution is the final gate; it overrides incomplete Store metadata. If it fails, the wizard stops before modifying the project.
- On failure or cancel only `composer.json`/`composer.lock` are restored — other changed files are not rolled back.
- Use `--no-audit` only after accepting the reported security risk.
- A successful run does not fix incompatible custom code, create missing extension releases, replace testing, or deploy.

## Code check (6.7.15.1)
- unverified `shopware-cli project upgrade` — command lives in the separate Shopware CLI tool, outside vendor/shopware, out of scope
- unverified `--target` — Shopware CLI option, out of scope
- unverified `--no-audit` — Shopware CLI option passed to Composer, out of scope
- unverified `.shopware-cli/upgrade/report.md` — Shopware CLI output path, out of scope
- unverified `shopware/deployment-helper` — separate package, not under vendor/shopware/{core,storefront,administration}
- confirmed `custom/plugins` — default local plugin directory, which the wizard requires migrating to Composer — vendor/shopware/core/Framework/Plugin/KernelPluginLoader/KernelPluginLoader.php:50
