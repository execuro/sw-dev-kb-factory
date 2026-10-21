---
id: platform/dev/6.7/guides/plugins/plugins/creating-plugins.md
title: Creating Plugins
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/creating-plugins.html
sourceHash: 64def524c5fc39befefcde86b1d7b324a08cda29
codeCheckedAgainst: "6.7.15.1"
keywords: ["plugin:create", "--no-scaffold", "--static", "shopware-platform-plugin", "shopware-plugin-class", "Shopware\\Core\\Framework\\Plugin", "composer.json", "custom/plugins", "scaffold plugin", "create plugin", "plugin skeleton", "plugin base class", "extension"]
summary: Scaffold a Shopware 6.7 plugin with bin/console plugin:create (options, generated files) and the composer.json fields Shopware requires to detect it.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/installation/_index.md", "platform/dev/6.7/guides/development/tooling/shopware-toolbox.md", "platform/dev/6.7/guides/plugins/plugins/install-activate-plugin.md", "platform/dev/6.7/guides/plugins/plugins/dependencies/add-plugin-dependencies.md"]
---
## What it is

This page covers creating a basic Shopware 6 plugin under `custom/plugins` with `bin/console plugin:create`. It also lists the `composer.json` fields Shopware needs to detect and register the plugin, and the base class the plugin must extend.

## When to use

Use it when you start a new plugin on a running Shopware 6 instance (see [Install Shopware 6](platform/dev/6.7/guides/installation/_index.md)) and have file system and CLI access.

## Key steps / config

1. **Pick a name** in UpperCamelCase with a vendor prefix, e.g. `SwagBasicExample`. The prefix is required for publishing in the Shopware Community Store. The name becomes the technical name. Keep it stable after distribution, because renaming it can break matching with existing installations.
2. **Generate** from the project root:

```bash
bin/console plugin:create SwagBasicExample
bin/console plugin:create SwagBasicExample --static          # into custom/static-plugins
bin/console plugin:create SwagBasicExample 'Swag\BasicExample' --no-scaffold
```

The two optional arguments are `plugin-name` and `plugin-namespace`, both PascalCase. When an argument is omitted, the command asks for it. When `--no-scaffold` is not passed and the command runs interactively, it asks "Would you like to scaffold optional plugin files?". Answering no has the same effect as the flag. The required files are always generated: `composer.json`, the plugin base class, `config.xml`, `.gitignore` and the PHPUnit setup.

Optional generators, each also asked interactively:

| Option | Generates |
|---|---|
| `--create-storefront-controller` | Storefront controller, template, `routes.php` entry |
| `--create-store-api-route` | Store API route + abstract + response class |
| `--create-event-subscriber` | Event subscriber (`src/Subscriber/`) |
| `--create-command` | Console command (`src/Command/`) |
| `--create-scheduled-task` | Scheduled task (`src/ScheduledTask/`) |
| `--create-admin-module` | Admin module with snippets (`src/Resources/app/administration/`) |
| `--create-javascript-plugin` | Storefront JS plugin (`src/Resources/app/storefront/src/`) |
| `--create-custom-fieldset` | `src/Resources/config/custom-fields.xml` |
| `--entities=Example,Foo` | Definition, entity, collection, migration per entity |

Generators that need services append to `src/Resources/config/services.php`. Run `bin/console cache:clear` after changing services, routes or Twig templates.

3. **Minimal structure** at `custom/plugins/SwagBasicExample/` is `composer.json` and `src/SwagBasicExample.php`. The base class:

```php
namespace Swag\BasicExample;
use Shopware\Core\Framework\Plugin;
class SwagBasicExample extends Plugin {}
```

4. **`composer.json`**. Skeleton (values elided):

```json
{
  "name": "swag/basic-example",
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

It must contain `"type": "shopware-platform-plugin"`, `shopware/core` in `require`, `extra.shopware-plugin-class`, a non-empty `extra.label`, and a PSR-4 autoload that matches the directory layout.

5. **Plugin dependencies.** Add other plugins to `require`, e.g. `"swag/other-plugin": "^1.0"`. Shopware then enforces that they are installed and activated first. See [Add Plugin Dependencies](platform/dev/6.7/guides/plugins/plugins/dependencies/add-plugin-dependencies.md).
6. **Optional Shopware Packagist:** `composer config repositories.shopware composer https://packages.shopware.com`. This needs an API token in `auth.json`, see [Extension Management](platform/dev/6.7/guides/hosting/installation-updates/extension-management.md).
7. **Next:** [install and activate](platform/dev/6.7/guides/plugins/plugins/install-activate-plugin.md) the plugin.

## Essential identifiers

- `bin/console plugin:create`, `--static`, `--no-scaffold`
- `Shopware\Core\Framework\Plugin` (base class)
- `shopware-platform-plugin` (Composer type)
- `extra.shopware-plugin-class`, `extra.label`
- `custom/plugins`, `custom/static-plugins`

## Gotchas

- `shopware-platform-plugin` is the only Composer type Shopware treats as a plugin. `library`, `project` and `shopware-app` packages never show up in the Administration.
- A package with an empty or missing `extra.shopware-plugin-class` or `extra.label` is rejected.
- Pass the namespace argument in quotes, because the backslash is part of it. Don't use names with spaces.
- Generated examples span several files and service definitions. Deleting only one of them can leave broken references, so prefer `--no-scaffold` and add features from their focused guides.
- `plugin:create` fails if the target plugin directory already exists.
- Generated output matches the Shopware version that ran the command. Compare it with the focused guides when supporting several versions.
- For subscribers created with the [PHPStorm Toolbox](platform/dev/6.7/guides/development/tooling/shopware-toolbox.md), check the service registration described in [Listening to events](platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md).

## Version notes

Shopware 6.7 also introduced a `technicalName` requirement for payment and shipping methods, a separate concept from the plugin technical name (see the 6.7.0.0 release notes).

## Code check (6.7.15.1)
- confirmed `plugin:create` — console command name — vendor/shopware/core/Framework/Plugin/Command/PluginCreateCommand.php:22
- confirmed `static` — option targets custom/static-plugins — vendor/shopware/core/Framework/Plugin/Command/PluginCreateCommand.php:47
- confirmed `no-scaffold` — skips generators that have a command option — vendor/shopware/core/Framework/Plugin/Command/PluginCreateCommand.php:48
- confirmed `Would you like to scaffold optional plugin files?` — interactive prompt, default yes — vendor/shopware/core/Framework/Plugin/Command/PluginCreateCommand.php:110
- confirmed `entities` — EntityGenerator option name — vendor/shopware/core/Framework/Plugin/Command/Scaffolding/Generator/EntityGenerator.php:22
- confirmed `create-custom-fieldset` — generator option name; the other create-* options exist likewise — vendor/shopware/core/Framework/Plugin/Command/Scaffolding/Generator/CustomFieldsetGenerator.php:19
- confirmed `PluginFinder::COMPOSER_TYPE` — value shopware-platform-plugin, exact type match required — vendor/shopware/core/Framework/Plugin/Util/PluginFinder.php:20
- confirmed `shopware-plugin-class` — must be set and non-empty, with non-empty extra.label — vendor/shopware/core/Framework/Plugin/Util/PluginFinder.php:21
- confirmed `Plugin` — abstract base class Shopware\Core\Framework\Plugin — vendor/shopware/core/Framework/Plugin.php:17
