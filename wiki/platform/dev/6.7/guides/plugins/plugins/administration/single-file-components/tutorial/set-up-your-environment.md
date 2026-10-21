---
id: platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/tutorial/set-up-your-environment.md
title: 1. Set up your environment
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/single-file-components/tutorial/set-up-your-environment.html
sourceHash: 322ceba44482f16ef5043c45ec4e5aba617a9068
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware-cli project create", "shopware-cli project dev", "framework:demodata", "dal:refresh:index", "plugin:install --activate", "admin-watch", "admin-build", "main.ts", "SwagProductMargin", "shopware-platform-plugin", "single file components", "sfc tutorial", "docker dev environment", "administration build"]
summary: SFC tutorial chapter 1 - create a Docker shop with Shopware CLI, demo data, an empty admin plugin with main.ts, and the admin watch/build commands.
lastBuilt: 2026-10-21
---
## What it is

Chapter 1 of the Administration Single File Component (SFC) tutorial: a Docker-based shop created with Shopware CLI, demo data, and an installed plugin `SwagProductMargin` that contains no Administration code yet.

## When to use

Before writing the first `.override.vue` file of the tutorial, or whenever you need a minimal plugin skeleton whose Administration code the build picks up.

## Key steps / config

1. Install Docker and Shopware CLI, then create and start a shop from `trunk`:
   - `shopware-cli project create swag-sfc-tutorial dev-trunk --docker`
   - `cd swag-sfc-tutorial` then `shopware-cli project dev` (starts containers, installs Shopware, opens a dashboard with shop/admin URLs and credentials).
2. Run shop commands inside the `web` container: `shopware-cli project console <cmd>` (alias `swx <cmd>`), or `docker compose exec web <cmd>` / `docker compose exec web bash`. Inside the container, `bin/console <cmd>` is equivalent.
3. Demo data (needs a product with a purchase price):
   - `shopware-cli project composer require --dev shopware/dev-tools`
   - `shopware-cli project console framework:demodata --env=prod`
   - `shopware-cli project console dal:refresh:index`
4. Plugin structure below `custom/plugins`:

```text
custom/plugins/SwagProductMargin/
├── composer.json
└── src/
    ├── SwagProductMargin.php
    └── Resources/app/administration/src/main.ts
```

   `main.ts` is the entry point and stays empty in this tutorial, but must exist for the plugin's Administration code to be picked up. Everything below `src/Resources/app/administration/src/` may be organised freely; the build searches the whole tree.
5. `composer.json` skeleton:

```json
{
    "name": "swag/product-margin",
    "type": "shopware-platform-plugin",
    "autoload": { "psr-4": { "Swag\\ProductMargin\\": "src/" } },
    "extra": {
        "shopware-plugin-class": "Swag\\ProductMargin\\SwagProductMargin",
        "label": { "en-GB": "Product margin" }
    }
}
```

   The plugin class `Swag\ProductMargin\SwagProductMargin` extends `Shopware\Core\Framework\Plugin` with an empty body.
6. Once per new plugin: `shopware-cli project console plugin:refresh`, then `shopware-cli project console plugin:install --activate SwagProductMargin`.
7. Build: `shopware-cli project admin-watch` (HMR, for chapters 2-5) or `shopware-cli project admin-build` (production-style static assets; run at least once before shipping).
8. Checkpoint: **Extensions → My extensions** lists `Product margin` as active.

## Essential identifiers

- `shopware-cli project create`, `shopware-cli project dev`, `shopware-cli project console`, `swx`
- `framework:demodata`, `dal:refresh:index`, `plugin:refresh`, `plugin:install --activate`
- `shopware-cli project admin-watch`, `shopware-cli project admin-build`
- `src/Resources/app/administration/src/main.ts`
- `shopware-platform-plugin`, `shopware-plugin-class`, `Shopware\Core\Framework\Plugin`

## Gotchas

- `framework:demodata` refuses to run outside the `prod` environment; pass `--env=prod`. It also requires `shopware/dev-tools`.
- Service hostnames only resolve inside the containers, so console commands must run in the `web` container.
- Editing files inside an already activated plugin needs no `plugin:refresh`/`plugin:install`.

## Version notes

- The tutorial targets `dev-trunk` or any release from 6.7.16.0 on. The installed 6.7.15.1 ships the SFC override runtime (`sw-block`, override setup merging) but not the editor tooling console commands below.
- The source's ESLint/TypeScript tooling step uses `shopware-cli project console administration:setup-extension-tooling` (writes `tsconfig.json` and `eslint.config.mjs`) and `shopware-cli project console administration:check-extensions -- --only=SwagProductMargin` (the `--` is required). If `vue-tsc` is missing: `docker compose exec web npm ci --prefix vendor/shopware/administration/Resources/app/administration`. In the shopware/shopware repository the equivalents are `composer admin:setup-extension-tooling` and `composer admin:check-extensions`. Both are marked experimental; 6.7.15.1 only has an experimental `ADMIN_EXTENSION_TOOLING` feature flag (default off) referring to the composer variant.

## Code check (6.7.15.1)
- confirmed `framework:demodata` — console command name — vendor/shopware/core/Framework/Demodata/Command/DemodataCommand.php:44
- confirmed `DemodataCommand::execute()` — aborts unless kernel env is `prod` — vendor/shopware/core/Framework/Demodata/Command/DemodataCommand.php:84
- confirmed `shopware/dev-tools` — demodata errors without this package — vendor/shopware/core/Framework/Demodata/Command/DemodataCommand.php:177
- confirmed `dal:refresh:index` — console command name — vendor/shopware/core/Framework/DataAbstractionLayer/Command/RefreshIndexCommand.php:23
- confirmed `plugin:refresh` — console command name — vendor/shopware/core/Framework/Plugin/Command/PluginRefreshCommand.php:22
- confirmed `plugin:install` — `--activate` option exists — vendor/shopware/core/Framework/Plugin/Command/Lifecycle/PluginInstallCommand.php:28
- confirmed `PluginFinder::COMPOSER_TYPE` — value `shopware-platform-plugin` — vendor/shopware/core/Framework/Plugin/Util/PluginFinder.php:20
- confirmed `shopware-plugin-class` — composer extra key read by the plugin finder — vendor/shopware/core/Framework/Plugin/Util/PluginFinder.php:21
- absent `administration:setup-extension-tooling` — no console command of this name in 6.7.15.1; arrives with 6.7.16.0/trunk
- absent `administration:check-extensions` — no console command of this name in 6.7.15.1
