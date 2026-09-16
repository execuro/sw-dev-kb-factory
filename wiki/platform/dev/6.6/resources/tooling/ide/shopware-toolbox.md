---
id: platform/dev/6.6/resources/tooling/ide/shopware-toolbox.md
title: Shopware Toolbox
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/tooling/ide/shopware-toolbox.html
sourceHash: d1eb8f40330b11998de7d1522ad481bc2584f4d0
keywords: ["Shopware Toolbox", "Shopware 6 Toolbox", "JetBrains plugin", "live templates", "code generator", "config.xml generator", "Vue module generator", "scheduled task generator", "static code check", "auto-completion", "theme_config", "sw_include", "sw_extends", "repositoryFactory"]
summary: "Shopware 6 Toolbox is a JetBrains IDE plugin adding live templates, file generators, a guideline static check, and Shopware-aware auto-completion."
lastBuilt: "2026-09-15"
---
## What it is
Shopware 6 Toolbox is a helper plugin for JetBrains IDEs that adds live templates and scaffolding for common Shopware 6 development tasks, plus productivity features for Shopware developers.

## When to use
Install it when working on Shopware 6 plugins/apps in a JetBrains IDE and wanting faster scaffolding, guideline checks, and Shopware-aware code completion.

## Key steps / config
Install by searching `Shopware 6 Toolbox` in the JetBrains Marketplace, or install it from the marketplace website directly.

Current features:
- Live templates: use Cmd/Ctrl + J to see all available live templates.
- Generators: Vue.js Admin component, `config.xml`, Extend Storefront blocks with automatic file creation, Vue module, Scheduled task, Changelog.
- Static code check: shows an error when an abstract class is used incorrectly in the constructor (a guideline check).
- Auto-completion: Admin components; Snippets in Administration and Storefront; Storefront functions `theme_config`, `config`, `seoUrl`, `sw_include` and `sw_extends`; repositories accessed via `this.repositoryFactory.create`; `Module.register` labels; admin-component completion only shown when the twig file is next to an `index.js`; feature flags.

## Essential identifiers
- `theme_config`, `config`, `seoUrl`, `sw_include`, `sw_extends` (Storefront Twig functions autocompleted)
- `this.repositoryFactory.create`
- `Module.register`
- `config.xml` generator
