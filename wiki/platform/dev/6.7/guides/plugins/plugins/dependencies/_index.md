---
id: platform/dev/6.7/guides/plugins/plugins/dependencies/_index.md
title: Dependencies
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/dependencies/
sourceHash: d1d86047e147d5927ae92f7c67afd7d180db2ce2
codeCheckedAgainst: "6.7.15.1"
keywords: ["plugin dependencies", "composer.json", "require", "composer dependencies", "npm dependencies", "npm packages", "plugin requirements", "third-party packages", "executeComposerCommands", "RequirementsValidator"]
summary: Index of plugin dependency guides - requiring other plugins, Composer packages, and NPM packages for Administration or Storefront.
lastBuilt: 2026-10-21
---
## What it is

Section index for managing plugin dependencies in Shopware 6.7. It groups three guides:

- **Add plugin dependencies** — declare that your plugin requires another plugin (via Composer `require` in `composer.json`).
- **Using Composer dependencies** — add third-party PHP packages and bundle them with the plugin.
- **Using NPM dependencies** — install and configure NPM packages for the Administration or Storefront.

## When to use

Start here when a plugin needs another plugin, a PHP library, or a JavaScript package. The source stresses that proper dependency management keeps plugins compatible, makes installation behave predictably, and integrates cleanly with Shopware's build and package systems.

## Code check (6.7.15.1)
- confirmed `RequirementsValidator::validateRequirements()` — checks a plugin's Composer requirements on lifecycle actions — vendor/shopware/core/Framework/Plugin/Requirement/RequirementsValidator.php:50
- confirmed `Plugin::executeComposerCommands()` — opt-in for running Composer during install, default `false` — vendor/shopware/core/Framework/Plugin.php:92
- unverified `NPM dependencies` — handled by the Administration/Storefront build tooling, not checked here
