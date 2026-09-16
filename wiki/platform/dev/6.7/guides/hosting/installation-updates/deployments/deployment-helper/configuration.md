---
id: platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/configuration.md
title: Configuration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/installation-updates/deployments/deployment-helper/configuration.html
sourceHash: f7dc01e4509f11f13d4703a9dad6f64affefba1d
codeCheckedAgainst: "6.7.13.0"
keywords: [".shopware-project.yml", ".shopware-project.local.yml", "deployment helper config", "deployment.hooks", "extension-management", "force-update", "one-time-tasks", "theme-compile", "%php.bin%", "opensearch.index-on-install", "!reset", "!override", "maintenance mode", "staging", "hooks"]
summary: Deployment Helper .shopware-project.yml reference - hooks, extension-management, one-time-tasks, maintenance, cache, theme-compile, local overrides.
lastBuilt: 2026-09-15
---
## What it is

Reference for the Deployment Helper's `.shopware-project.yml` in the project root: every key under `deployment`, hook timing, multi-step hooks, `%php.bin%`, parallel theme compilation, OpenSearch indexing on install, and `.shopware-project.local.yml` overrides with custom YAML merge tags. Every section is optional; configure only what you use.

## When to use

When customising what `shopware-deployment-helper run` does: running scripts at deploy phases, excluding/force-updating/removing extensions, one-off tasks, enabling maintenance or staging mode, or overriding config locally.

## Key steps / config

Minimal file:

```yaml
deployment:
  extension-management:
    enabled: true
  store:
    license-domain: 'example.com'
```

Hooks and extension management (skeleton):

```yaml
deployment:
  hooks:
    pre: |          # also: post, pre-install, post-install, pre-update, post-update
      echo "..."
  extension-management:
    enabled: true   # manages custom/plugins, custom/apps and Composer extensions
    exclude: [Name]          # not managed; handle via one-time-tasks
    force-update: [Name]     # always reinstalled even if version unchanged
    overrides:
      MyPlugin: { state: ignore }            # same as exclude
      AnotherPlugin: { state: inactive }     # installed but inactive
      RemoveThisPlugin: { state: remove, keepUserData: true }
```

Other sections with defaults:

```yaml
deployment:
  one-time-tasks:
    - id: foo
      when: after        # "before" = prior to system:update; default after
      script: |
        ./bin/console --version
  store: { license-domain: 'example.com' }
  staging: { enabled: false }          # runs system:setup:staging --no-interaction --force post-deploy
  maintenance: { enabled: false }      # storefront maintenance around system:update:finish
  cache: { always_clear: false }       # clear HTTP/object cache after every deployment
  theme-compile: { parallel: false, workers: null }
  opensearch: { index-on-install: false }
```

Hook execution order (install and update): `pre` → `pre-install`/`pre-update` → `system:install` or `system:update:finish` → extension management → `post-install`/`post-update` → PostDeploy listeners (cache clear, Fastly) → `post`.

Multi-step hooks: a hook may be a list; each step is an object `{ title, script }` (title shown in output) or a plain script string. The single-script form still works.

```yaml
deployment:
  hooks:
    post:
      - title: Warm up the cache
        script: |
          %php.bin% bin/console cache:warmup
      - ./notify.sh
```

`%php.bin%`: use in hook and one-time-task scripts instead of bare `php` so the same PHP binary as the Deployment Helper runs (matters with several PHP versions installed).

`force-update`: without it, extensions are only updated when the codebase version is newer than the installed one.

Theme compilation: default is serial `theme:compile --active-only`; skip with `--skip-theme-compile`. `theme-compile.parallel: true` (Shopware 6.5.6+) auto-detects CPU count or uses `workers`, seeds each unique theme once single-threaded, then compiles sales channels in parallel up to `workers`.

`opensearch.index-on-install`: creates OpenSearch indexes after a fresh install; `shopware-cli project create --deployment shopware-paas` generates it as `true`, otherwise defaults to `false`.

Local overrides: `.shopware-project.local.yml` (git-ignored) is deep-merged onto the base: scalars replaced, maps merged recursively, lists appended (order kept, no dedup). Custom tags:

- `!reset` on one field — base value discarded, only the tagged value used (scalar, list or map).
- `!override` on a mapping — whole section replaced, no recursive merge, unlisted keys removed.

```yaml
deployment:
  extension-management:
    exclude: !reset
      - OnlyThisPlugin
  hooks: !override
    pre: |
      echo "Only this hook"
```

## Essential identifiers

- `.shopware-project.yml`, `.shopware-project.local.yml`
- `deployment.hooks.{pre,post,pre-install,post-install,pre-update,post-update}`
- `deployment.extension-management.{enabled,exclude,force-update,overrides}`; `state: ignore|inactive|remove`, `keepUserData`
- `deployment.one-time-tasks[].{id,when,script}`
- `deployment.store.license-domain`, `deployment.staging.enabled`, `deployment.maintenance.enabled`, `deployment.cache.always_clear`
- `deployment.theme-compile.{parallel,workers}`, `deployment.opensearch.index-on-install`
- `%php.bin%`, `!reset`, `!override`

## Gotchas

- With `extension-management.enabled`, extensions installed at runtime (e.g. via the Store in the Administration) can conflict during deployment.
- Generic YAML parsers/linters may reject `!reset`/`!override` in the local file; use a Deployment Helper version that supports them.
- Maintenance mode cache clears are independent of `cache.always_clear`.

## Version notes

- Parallel theme compilation requires Shopware 6.5.6+.

## Code check (6.7.13.0)
- confirmed `system:install` — core command run in the install flow — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:27
- confirmed `system:update:finish` — core command wrapped by maintenance mode and update hooks — vendor/shopware/core/Maintenance/System/Command/SystemUpdateFinishCommand.php:29
- confirmed `system:setup:staging` — core staging command — vendor/shopware/core/Maintenance/Staging/Command/SystemSetupStagingCommand.php:24
- confirmed `force` — system:setup:staging has --force option — vendor/shopware/core/Maintenance/Staging/Command/SystemSetupStagingCommand.php:48
- confirmed `theme:compile` — storefront command — vendor/shopware/storefront/Theme/Command/ThemeCompileCommand.php:19
- confirmed `active-only` — theme:compile option compiling only active sales channels — vendor/shopware/storefront/Theme/Command/ThemeCompileCommand.php:42
- confirmed `sales-channel:maintenance:enable` — core maintenance toggle is per sales channel — vendor/shopware/core/Maintenance/SalesChannel/Command/SalesChannelMaintenanceEnableCommand.php:21
- unverified `.shopware-project.yml` — parsed by the Deployment Helper package, outside the checked roots
- unverified `%php.bin%` — Deployment Helper placeholder, outside the checked roots
- unverified `cache:warmup` — Symfony framework command, out of scope
