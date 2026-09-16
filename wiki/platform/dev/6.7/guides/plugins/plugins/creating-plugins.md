---
id: platform/dev/6.7/guides/plugins/plugins/creating-plugins.md
title: Creating Plugins
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/creating-plugins.html
sourceHash: 64def524c5fc39befefcde86b1d7b324a08cda29
codeCheckedAgainst: "6.7.13.0"
keywords: ["plugin:create", "--no-scaffold", "--static", "shopware-platform-plugin", "extra.shopware-plugin-class", "Shopware\\Core\\Framework\\Plugin", "composer.json", "custom/plugins", "custom/static-plugins", "scaffold plugin", "new plugin", "plugin skeleton", "technical name", "extension"]
summary: "Scaffold a Shopware 6.7 plugin with bin/console plugin:create (options, generated files) and the composer.json fields Shopware requires to detect it."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/install-activate-plugin.md", "platform/dev/6.7/guides/plugins/plugins/dependencies/add-plugin-dependencies.md", "platform/dev/6.7/guides/development/tooling/shopware-toolbox.md", "platform/dev/6.7/guides/installation/_index.md"]
---
## What it is

How to create an installable Shopware 6.7 plugin skeleton: naming, `bin/console plugin:create`, the minimal layout, the base class and the `composer.json` fields Shopware checks. Prerequisites: PHP knowledge, a running instance ([Install Shopware 6](platform/dev/6.7/guides/installation/_index.md)), file system and CLI access.

## When to use

- Starting a new plugin in `custom/plugins` (or `custom/static-plugins`).
- A plugin does not appear in the Administration and `composer.json` needs checking.

## Key steps / config

1. **Name** in UpperCamelCase with a vendor prefix, e.g. `SwagBasicExample` (prefix required for the Shopware Community Store). The name is the technical name and must stay stable once distributed.
2. **Generate** from the project root:

```bash
bin/console plugin:create SwagBasicExample
bin/console plugin:create SwagBasicExample --static
bin/console plugin:create SwagBasicExample 'Swag\BasicExample' --no-scaffold
```

Arguments: `plugin-name`, `plugin-namespace` (prompted if missing). Always generated: `composer.json`, plugin base class, `config.xml`, `.gitignore`, PHPUnit setup. `--no-scaffold` (or answering "no" to "Would you like to scaffold optional plugin files?") skips all optional files. Optional generators: `--create-storefront-controller`, `--create-store-api-route`, `--create-event-subscriber`, `--create-command`, `--create-scheduled-task`, `--create-admin-module`, `--create-javascript-plugin`, `--create-custom-fieldset` (`custom-fields.xml`), `--entities=Example,Foo` (definition, entity, collection, migration per entity). Generators needing services append them to `src/Resources/config/services.php`.

3. **Structure**: `SwagBasicExample/composer.json` and `SwagBasicExample/src/SwagBasicExample.php`, where the class extends `Shopware\Core\Framework\Plugin`.

4. **composer.json** skeleton:

```json
{
  "name": "swag/basic-example", "version": "1.0.0",
  "type": "shopware-platform-plugin",
  "require": { "shopware/core": "~6.7.0" },
  "extra": {
    "shopware-plugin-class": "Swag\\BasicExample\\SwagBasicExample",
    "label": { "de-DE": "...", "en-GB": "..." },
    "description": { "de-DE": "...", "en-GB": "..." }
  },
  "autoload": { "psr-4": { "Swag\\BasicExample\\": "src/" } }
}
```

5. **Plugin dependencies**: add the other plugin's Composer name to `require` (e.g. `"swag/other-plugin": "^1.0"`); see [Add Plugin Dependencies](platform/dev/6.7/guides/plugins/plugins/dependencies/add-plugin-dependencies.md).
6. **Shopware Packagist** (optional): `composer config repositories.shopware composer https://packages.shopware.com`, which needs an API token and `auth.json` ([Extension Management](platform/dev/6.7/guides/hosting/installation-updates/extension-management.md)).
7. After changing services, routes or Twig templates run `bin/console cache:clear`, then [install and activate](platform/dev/6.7/guides/plugins/plugins/install-activate-plugin.md) the plugin.

## Essential identifiers

- `bin/console plugin:create` with `--static`, `--no-scaffold`, `--create-*`, `--entities`
- `Shopware\Core\Framework\Plugin`
- `"type": "shopware-platform-plugin"`, `extra.shopware-plugin-class`, `extra.label`, `autoload.psr-4`

## Gotchas

- Only Composer type `shopware-platform-plugin` counts as a plugin (`library`, `project`, `shopware-app` are ignored); a missing or empty `extra.shopware-plugin-class` or `extra.label` also prevents registration.
- `autoload.psr-4` must match the real directory; `src/` is recommended, not required.
- The command fails if the plugin directory already exists; non-interactive runs must pass name and namespace as arguments. Prompted answers are only validated to start uppercase.
- Quote the namespace argument (backslash); no spaces.
- Generated examples span several files and service definitions; deleting one can leave broken references. Output is tied to the Shopware version it ran on.
- Stale caches are the usual reason a generated file seems to have no effect.
- PHPStorm: the [Shopware 6 Toolbox](platform/dev/6.7/guides/development/tooling/shopware-toolbox.md) also generates components; verify [subscriber registration](platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md). Set up [CI](platform/dev/6.7/guides/development/testing/ci.md) with `shopware-cli extension build` early.

## Code check (6.7.13.0)
- confirmed `plugin:create` — command name — vendor/shopware/core/Framework/Plugin/Command/PluginCreateCommand.php:21
- confirmed `static` — option; directory becomes custom/static-plugins — vendor/shopware/core/Framework/Plugin/Command/PluginCreateCommand.php:47
- confirmed `no-scaffold` — option skipping generators that have a command option — vendor/shopware/core/Framework/Plugin/Command/PluginCreateCommand.php:48
- confirmed `plugin-namespace` — optional argument, prompted when interactive — vendor/shopware/core/Framework/Plugin/Command/PluginCreateCommand.php:46
- confirmed `EntityGenerator::OPTION_NAME` — option entities — vendor/shopware/core/Framework/Plugin/Command/Scaffolding/Generator/EntityGenerator.php:22
- confirmed `StorefrontControllerGenerator::OPTION_NAME` — option create-storefront-controller; other create options likewise — vendor/shopware/core/Framework/Plugin/Command/Scaffolding/Generator/StorefrontControllerGenerator.php:21
- confirmed `PluginFinder::COMPOSER_TYPE` — value shopware-platform-plugin — vendor/shopware/core/Framework/Plugin/Util/PluginFinder.php:20
- confirmed `PluginFinder::isPluginComposerValid()` — requires non-empty shopware-plugin-class and label — vendor/shopware/core/Framework/Plugin/Util/PluginFinder.php:96
- confirmed `Plugin` — abstract base class Shopware\Core\Framework\Plugin — vendor/shopware/core/Framework/Plugin.php:17
- unverified `cache:clear` — Symfony command, vendor/symfony out of scope
