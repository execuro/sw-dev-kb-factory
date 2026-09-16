---
id: platform/dev/6.7/guides/plugins/plugins/dependencies/_index.md
title: Dependencies
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/dependencies/
sourceHash: d1d86047e147d5927ae92f7c67afd7d180db2ce2
codeCheckedAgainst: "6.7.13.0"
keywords: ["plugin dependencies", "composer.json", "require", "composer packages", "npm packages", "RequirementsValidator", "shopware-platform-plugin", "plugin requirements", "vendor bundling", "administration npm", "storefront npm"]
summary: "Overview of plugin dependency management in Shopware 6.7: requiring other plugins, bundling Composer packages, and NPM packages for Administration/Storefront."
lastBuilt: 2026-09-15
---
## What it is

Section index for managing plugin dependencies in Shopware. It groups three guides:

- declaring a dependency on other plugins (plugin requirements),
- adding and bundling Composer dependencies,
- installing and configuring NPM packages for the Administration or the Storefront.

According to the source, proper dependency management keeps plugins compatible, makes installation behave predictably, and integrates cleanly with Shopware's build and package systems.

## When to use

- Your plugin cannot work without another plugin and must declare that requirement.
- Your plugin's PHP code needs a third-party Composer library.
- Your Administration or Storefront JavaScript needs an NPM package.

## Key steps / config

1. Plugin-to-plugin and Composer dependencies are both declared in the plugin's `composer.json` `require` section; the plugin package itself uses `"type": "shopware-platform-plugin"`.
2. When a plugin is not managed by Composer, Shopware validates the `require` entries itself on install, update and activate via `Shopware\Core\Framework\Plugin\Requirement\RequirementsValidator`; for Composer-managed plugins Composer does the check (activation is still validated).
3. NPM packages for Administration or Storefront are covered in the NPM dependencies guide of this section.

## Essential identifiers

- `composer.json` `require`
- `shopware-platform-plugin`
- `Shopware\Core\Framework\Plugin\Requirement\RequirementsValidator`

## Code check (6.7.13.0)
- confirmed `shopware-platform-plugin` — composer type recognised as plugin — vendor/shopware/core/Framework/Plugin/Util/PluginFinder.php:20
- confirmed `RequirementsValidator::validateRequirements()` — validates plugin requirements — vendor/shopware/core/Framework/Plugin/Requirement/RequirementsValidator.php:50
- confirmed `getManagedByComposer` — Composer-managed plugins skip manual check except on activate — vendor/shopware/core/Framework/Plugin/Requirement/RequirementsValidator.php:52
- confirmed `validateRequirements` — called on install — vendor/shopware/core/Framework/Plugin/PluginLifecycleService.php:137
- unverified `npm packages` — build tooling not checked in the vendor PHP/admin roots
