---
id: platform/dev/6.7/resources/references/adr/2021-08-31-refactor-admin-build-process-to-webpack-multi-compiler-mode.md
title: Refactor admin build process to webpack-multi-compiler mode
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2021-08-31-refactor-admin-build-process-to-webpack-multi-compiler-mode.html
sourceHash: 90abf3083fe52ec440c5164e7b1801ce8e1f9679
codeCheckedAgainst: "6.7.13.0"
keywords: ["webpack", "webpack-multi-compiler", "multi compiler", "administration build", "admin build", "plugin build isolation", "tree-shaking", "webpack configuration", "watch mode", "vite", "sw-plugin-dev.json", "adr"]
summary: "ADR (2021): admin build uses webpack multi-compiler mode so each plugin is bundled in isolation from core and other plugins; backward compatible."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record (2021-08-31) that switched the Administration build to webpack's multi-compiler mode, so the core and each plugin are compiled as independent configurations.

## When to use

When a plugin's built Administration files only work if rebuilt together with the core, or when a plugin needs its own webpack configuration without affecting the core build.

## Key steps / config

Problem before the change:
- Webpack treated core plus all installed plugins as one program; tree-shaking removed or added shared dependencies depending on which plugins were installed, so prebuilt plugin files could be incompatible with a differently built core.
- A custom webpack configuration in a plugin was also applied to the core build, so the plugin sometimes only worked when both were built together.

Decision:
- Stay on webpack (widely known, already in use; switching bundlers would require analysis and force plugin developers to learn a new tool).
- Use the webpack multi-compiler to build several independent configurations that don't affect each other; watch mode keeps working.

Consequences:
- Each plugin is built fully isolated and cannot modify or affect other plugins or the core.
- Plugin developers can customise their webpack configuration freely.
- Implemented backward compatibly: plugin developers don't have to change anything.

## Gotchas

- This ADR records the 2021 webpack decision. The installed 6.7 Administration source also references a Vite build path (`plugins.vite.ts`) next to `webpack.config.js`, and the plugin scaffolder ignores an `src/.vite` directory — check which build tool your Shopware version actually uses before relying on webpack-specific configuration.

## Code check (6.7.13.0)
- confirmed `sw-plugin-dev.json` — dev-mode plugin list loaded by the admin, comment names both `webpack.config.js` and `plugins.vite.ts` as producer — vendor/shopware/administration/Resources/app/administration/src/core/application.ts:617
- confirmed `plugins.vite.ts` — Vite plugin build referenced as alternative producer of plugin metadata — vendor/shopware/administration/Resources/app/administration/src/core/application.ts:620
- confirmed `.vite` — plugin scaffold gitignore excludes the admin Vite cache directory — vendor/shopware/core/Framework/Plugin/Command/Scaffolding/Generator/GitignoreGenerator.php:52
- unverified `webpack-multi-compiler` — build configuration lives outside the admin `src` root, out of scope
