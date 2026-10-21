---
id: platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/configuration.md
title: Configuration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/installation-updates/deployments/deployment-helper/configuration.html
sourceHash: 1fda18459d11323b56627f38de808ad262379bde
codeCheckedAgainst: "6.7.15.1"
keywords: [".config/shopware-project.yml", ".config/shopware-project.local.yml", "deployment.hooks", "post-extension-on-project-install", "extension-management", "force-update", "one-time-tasks", "theme-compile", "index-on-install", "%php.bin%", "!reset", "!override", "deployment helper config", "deploy hooks", "yaml configuration"]
summary: Deployment Helper .config/shopware-project.yml reference - hooks, extension management, one-time tasks, theme compile, local overrides.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/tools/cli/configuration.md"]
---
## What it is

The configuration reference for the Deployment Helper. The file is `.config/shopware-project.yml` in the project root. Every section is optional; configure only the keys you use. The Shopware CLI defines the lookup priority for this file and its legacy fallbacks (see [CLI configuration](platform/dev/6.7/products/tools/cli/configuration.md)).

## When to use

- Add custom scripts at fixed points of the deployment, control which extensions the helper manages, set the Store license domain, enable maintenance mode, staging mode, cache clearing, parallel theme compilation or OpenSearch indexing on install.
- Override settings locally without changing the committed file.

## Key steps / config

Full key map (values shown are the documented defaults or examples):

```yaml
deployment:
  hooks: { pre, post, pre-install, post-extension-on-project-install, post-install, pre-update, post-update }
  extension-management:
    enabled: true
    exclude: [Name]
    force-update: [Name]
    overrides: { MyPlugin: { state: ignore }, AnotherPlugin: { state: inactive }, RemoveThisPlugin: { state: remove, keepUserData: true } }
  one-time-tasks: [{ id: foo, when: after, script: "..." }]   # when: before | after (default)
  store: { license-domain: 'example.com' }
  staging: { enabled: false }
  maintenance: { enabled: false }
  cache: { always_clear: false }
  theme-compile: { parallel: false, workers: null }
  opensearch: { index-on-install: false }
```

- `staging.enabled`: a PostDeploy listener runs `system:setup:staging --no-interaction --force` after deployment and extension management.
- `maintenance.enabled`: puts the Storefront into maintenance mode before `system:update:finish` and restores it afterwards. Both switches are followed by a cache clear.
- `cache.always_clear`: clears the HTTP and object cache after every deployment through a PostDeploy listener. This is independent of the maintenance-mode clears.
- `extension-management.enabled`: installs and updates everything in `custom/plugins`, `custom/apps` and Composer. Extensions installed at runtime through the Store can conflict with it.
- `exclude`: extensions the helper does not manage; handle them with one-time tasks. `force-update`: extensions that are reinstalled on every deployment even if the version is unchanged. Without it, the helper updates an extension only when the codebase version is newer than the installed one.

### Hook order (fresh install)

1. `pre`
2. `pre-install`
3. `system:install` runs, then extension management
4. `post-extension-on-project-install` (fresh install only, after all plugin and app lifecycle operations)
5. Optional OpenSearch indexing
6. `post-install`
7. `post`, after all PostDeploy listeners

On updates, use `post-update`. `post-extension-on-project-install` does not run on updates.

### Multi-step hooks

A hook can be one script string or a list of steps. A step is either `{ title, script }` or a plain string:

```yaml
deployment:
  hooks:
    post:
      - title: Warm up the cache
        script: |
          %php.bin% bin/console cache:warmup
    pre-update:
      - echo "first step"
```

In hooks and one-time tasks, use `%php.bin%` instead of `php` so the script runs under the same PHP binary as the helper.

### Theme compilation

- Default (serial): runs `theme:compile --active-only` once.
- Skip it with `--skip-theme-compile` if CI already compiled the theme.
- Parallel (requires Shopware 6.5.6+): set `theme-compile.parallel: true` and optionally `workers`. The helper detects the CPU count unless `workers` is set, seeds each unique theme once single-threaded, then compiles sales channels in parallel, up to `workers` at a time.

### OpenSearch

`opensearch.index-on-install: true` creates the indexes right after a fresh install. `shopware-cli project create --deployment shopware-paas` generates a config with this set to `true`.

### Local overrides

`.config/shopware-project.local.yml` (add it to `.gitignore`) is deep-merged on top of the base file:

- Scalars are replaced.
- Maps are merged recursively.
- Lists from the local file are appended to the base list, in order, without deduplication.

The custom tags `!reset` and `!override` are interpreted by the helper itself:

- `!reset` on one field discards the inherited value for that field only. Lists lose all inherited items; maps keep only the keys you define.
- `!override` on a mapping turns off deep-merging for the whole section. Keys you do not list are removed.

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

- `.config/shopware-project.yml`, `.config/shopware-project.local.yml`
- `deployment.hooks.{pre,post,pre-install,post-extension-on-project-install,post-install,pre-update,post-update}`
- `deployment.extension-management.{enabled,exclude,force-update,overrides}`, override `state: ignore|inactive|remove`, `keepUserData`
- `deployment.one-time-tasks[].{id,when,script}`
- `deployment.store.license-domain`, `deployment.staging.enabled`, `deployment.maintenance.enabled`, `deployment.cache.always_clear`
- `deployment.theme-compile.{parallel,workers}`, `deployment.opensearch.index-on-install`
- `%php.bin%`, `!reset`, `!override`

## Gotchas

- Generic YAML parsers and linters may reject the custom `!reset`/`!override` tags in the local file. Make sure your tooling allows them, and check the helper changelog for the minimum version that supports them.
- Single-script hooks keep working; the list form is optional.

## Code check (6.7.15.1)
- confirmed `system:setup:staging` — core command run by the staging listener — vendor/shopware/core/Maintenance/Staging/Command/SystemSetupStagingCommand.php:25
- confirmed `force` — `system:setup:staging` option exists — vendor/shopware/core/Maintenance/Staging/Command/SystemSetupStagingCommand.php:48
- confirmed `system:update:finish` — core command maintenance mode wraps — vendor/shopware/core/Maintenance/System/Command/SystemUpdateFinishCommand.php:30
- confirmed `active-only` — `theme:compile` option exists — vendor/shopware/storefront/Theme/Command/ThemeCompileCommand.php:43
- confirmed `only` — per-sales-channel `theme:compile` option used for parallel compile — vendor/shopware/storefront/Theme/Command/ThemeCompileCommand.php:44
- confirmed `system:install` — core command run before extension management on fresh install — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:31
- unverified `.config/shopware-project.yml` — parsed by the deployment-helper / shopware-cli packages, out of scope
- unverified `%php.bin%` — placeholder resolved by the deployment-helper package, out of scope
- unverified `!reset` — custom YAML tag of the deployment-helper package, out of scope
- unverified `cache:warmup` — Symfony FrameworkBundle command, out of scope
