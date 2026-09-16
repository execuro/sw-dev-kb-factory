---
id: "platform/dev/6.6/products/cli/project-commands/autofix.md"
title: "Autofixer"
docType: "developer"
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/cli/project-commands/autofix.html"
sourceHash: "e8a5307b796e4ef455544d7f019d8f8c33ef36dc"
relatedPages: ["platform/dev/6.6/guides/hosting/installation-updates/extension-managment.md"]
keywords: ["shopware-cli project autofix flex", "shopware-cli project autofix composer-plugins", "Symfony Flex migration", "Shopware Packagist", "custom/plugins", "Shopware Packages Token", "project autofix", "composer.json migration", "bin/console migration"]
summary: "Documents shopware-cli's project autofix commands for migrating to Symfony Flex and moving custom/plugins to Composer."
lastBuilt: "2026-09-15"
---
## What it is
Documents Shopware-CLI's built-in autofixers for project migrations: migrating a project to Symfony Flex, and migrating locally installed `custom/plugins` extensions to be managed via Composer.

## When to use
Use the Flex autofixer when upgrading a pre-6.5 project that does not yet use Symfony Flex, so its configuration files move to the correct locations automatically. Use the Composer-plugins autofixer when you want to manage Shopware Store extensions and custom plugins as Composer dependencies instead of files dropped into `custom/plugins`.

## Key steps / config
Migrate a project to Symfony Flex:

```bash
shopware-cli project autofix flex
```

This command deletes unnecessary configuration files and updates the `composer.json` file and the `bin/console` file to use the new configuration layout. Prior to Shopware 6.5, projects did not use Symfony Flex, so the project structure and the location of some configuration files differed.

Migrate `custom/plugins` extensions to Composer:

```bash
shopware-cli project autofix composer-plugins
```

This helper migrates locally installed plugins to Composer through Shopware Packagist for the Shopware Store. It requires a Shopware Packages Token, available in the Shopware Account under "Shops" > "Licenses" > "..." of an extension, then "Install via Composer". Managing extensions via Composer is described further in the [extension management](platform/dev/6.6/guides/hosting/installation-updates/extension-managment.md) guide.

## Essential identifiers
- `shopware-cli project autofix flex` — migrates a project to Symfony Flex
- `shopware-cli project autofix composer-plugins` — migrates `custom/plugins` extensions to Composer via Shopware Packagist

## Gotchas
Back up the project before running `shopware-cli project autofix flex`, since it deletes configuration files it considers unnecessary.
