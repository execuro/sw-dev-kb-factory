---
id: platform/dev/6.6/resources/references/adr/2021-08-31-refactor-admin-build-process-to-webpack-multi-compiler-mode.md
title: Refactor admin build process to webpack-multi-compiler mode
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/adr/2021-08-31-refactor-admin-build-process-to-webpack-multi-compiler-mode.html
sourceHash: 90abf3083fe52ec440c5164e7b1801ce8e1f9679
keywords: ["webpack-multi-compiler", "webpack", "tree-shaking", "administration build", "plugin build isolation", "watch mode", "core and plugin bundling", "administration webpack config"]
summary: "ADR: administration build switches to webpack-multi-compiler mode so each plugin builds isolated from the core and other plugins."
lastBuilt: "2026-09-15"
---
## What it is

An architecture decision record changing the administration build process to webpack's multi-compiler mode, so admin plugins are compiled fully isolated from the core and from each other.

## Key steps / config

- Previously Webpack treated Core and plugins as one combined program, so tree-shaking could remove or add dependencies depending on which plugins were installed, and a plugin's custom Webpack config could unintentionally apply to the core too — making a plugin's built files work only when built together with a matching core.
- The fix keeps Webpack (already familiar to plugin developers) but uses webpack-multi-compiler to build several independent configurations that do not affect each other; watch mode continues to work the same way.
- The refactor is backward compatible: no plugin developer has to change anything, and plugin developers can now customize their own Webpack configuration without risking incompatibility with the core.

## Essential identifiers

- webpack-multi-compiler mode
- tree-shaking

## Gotchas

Previously, plugin build artifacts could become incompatible with the core unless rebuilt together with it; the multi-compiler refactor removes that coupling without requiring plugin code changes.
