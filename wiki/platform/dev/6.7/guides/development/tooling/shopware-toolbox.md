---
id: platform/dev/6.7/guides/development/tooling/shopware-toolbox.md
title: Shopware 6 Toolbox
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/tooling/shopware-toolbox.html
sourceHash: 6ce823b5165d77f094c89930e4aa745aca08d155
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware 6 toolbox", "phpstorm plugin", "jetbrains", "sw_extends", "sw_include", "shopware-block", "twig block versioning", "live templates", "code generators", "inspections", "plugin:create", "composer.json store check", "ide support"]
summary: "Shopware 6 Toolbox PHPStorm plugin: generators, intentions, inspections, navigation, completion, shopware-block Twig versioning."
lastBuilt: 2026-10-21
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/creating-plugins.md
  - platform/dev/6.7/guides/plugins/plugins/framework/event/finding-events.md
  - platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md
---
## What it is

The Shopware 6 Toolbox is a plugin for PHPStorm and other JetBrains IDEs (not a standalone app) that adds Shopware-specific live templates, file generators, intentions, inspections, navigation, auto-completion and Twig block versioning. For plugin work it overlaps with `bin/console plugin:create` and the manual steps in [Creating Plugins](platform/dev/6.7/guides/plugins/plugins/creating-plugins.md), but runs inside the editor.

## When to use

- Scaffolding plugins, apps, migrations, scheduled tasks, admin modules/components or CMS blocks/elements from the IDE.
- Overriding Storefront Twig blocks or Administration components and keeping those overrides in sync with upstream after updates.
- Checking a plugin's `composer.json` against Shopware Store requirements before publishing.

## Key steps / config

Install: PHPStorm → Settings → Plugins → search "Shopware 6 Toolbox" → install, restart. It builds on the bundled PHP, Twig, Sass, YAML and JavaScript plugins and integrates with Symfony Support when installed. Telemetry: *Settings → Tools → Shopware 6 Toolbox*.

**Live templates:** Cmd/Ctrl + J lists them (changelog entries and other boilerplate).

**Generators** (*File → New → Shopware Platform*, or Ctrl/Cmd + N in the project tree):

| Group | Generates |
|---|---|
| Plugin | Plugin skeleton, `config.xml` |
| PHP | Scheduled task, database migration |
| App | App skeleton, custom entities, app script, CMS block/element |
| Administration | Vue component, Vue module, CMS block, CMS element |

**Intentions** (Alt+Enter / Option+Enter): *Extend Twig block* (override file plus `sw_extends` block), *Create event listener* (on an event class: creates a subscriber in a chosen plugin and registers it — see [Finding Events](platform/dev/6.7/guides/plugins/plugins/framework/event/finding-events.md)), *Extend admin component*, *Extend admin component method*, *Add/Update the Shopware 6 versioning comment*, *Show Twig block difference*.

**Inspections** (*Settings → Editor → Inspections → Shopware 6*, all on by default):

- PHP: class used instead of abstract class (Error) — services whose contract is an abstract class must be injected as that type, or the [decoration chain](platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md) breaks; Criteria IDs set by filter instead of constructor.
- Administration: missing snippet translation; deprecated Vue template slots.
- Script: service not available in scope; permission missing in `manifest.xml`.
- Store check: `composer.json` missing `extra.label`, `extra.description`, `extra.manufacturerLink`, `extra.supportLink` or `require.shopware/core`.

**Navigation:** Ctrl/Cmd + Click resolves admin components, mixins, modules, snippets, theme/system config keys, entity definitions, feature flags, Twig templates and blocks. `sw_extends`/`sw_include` references list every template registered under that view path (referenced bundle first, then plugin overrides); a block name resolves to the upstream block via the `sw_extends` chain.

**Auto-completion:** admin components, snippets, Storefront functions `theme_config`, `config`, `seoUrl`, `sw_include`, `sw_extends`, template paths (including `custom/plugins`), `this.repositoryFactory.create`, `Module.register` labels, feature flags; context-aware component completion only when the Twig file sits next to an `index.js`.

**Twig block versioning** — comment stored above the overriding block:

```twig
{# shopware-block: c1954b12f0c4...@v6.6.6.0 #}
{% block base_body_skip_to_content %}
    ...
{% endblock %}
```

The hash is SHA-256 of the upstream block content; the version comes from the Composer package or the extension's `composer.json`. Works for core templates and third-party extensions (Composer or `custom/plugins`). Twig inspections: upstream block changed (on), upstream block removed (on), Twig block deprecated (on), versioning comment missing (off; only reported for templates that `sw_extends` another). To add comments project-wide: enable *Shopware versioning block comment is missing*, run *Code → Inspect Code*, apply the quick fix.

**Project setup:** *New Project → Shopware* on the welcome screen; *Tools → Configure Shopware Project* for existing projects.

**Customize generated files:** *Settings → Editor → File and Code Templates*, edit the Shopware templates (project-wide or per IDE).

## Essential identifiers

- `sw_extends`, `sw_include`, `shopware-block` comment
- `theme_config`, `config`, `seoUrl`
- `plugin:create`
- `composer.json` keys `extra.label`, `extra.description`, `extra.manufacturerLink`, `extra.supportLink`, `require.shopware/core`
- `manifest.xml`, `config.xml`

## Gotchas

- *Show Twig block difference* only diffs against Shopware core templates; for third-party extensions the inspections report changes but no diff.
- If the `sw_extends` chain cannot be resolved, blocks carrying a versioning comment are treated as overrides, so a broken chain cannot hide upstream changes.
- `bin/console plugin:create` scaffolding cannot be customised; enforce in-house conventions through the Toolbox file templates instead.

## Code check (6.7.15.1)
- confirmed `plugin:create` — core command the Toolbox generators overlap with — vendor/shopware/core/Framework/Plugin/Command/PluginCreateCommand.php:22
- confirmed `sw_extends` — Twig tag registered by core token parser — vendor/shopware/core/Framework/Adapter/Twig/TokenParser/ExtendsTokenParser.php:68
- confirmed `sw_include` — Twig tag registered by core token parser — vendor/shopware/core/Framework/Adapter/Twig/TokenParser/IncludeTokenParser.php:51
- confirmed `theme_config` — Storefront Twig function — vendor/shopware/storefront/Framework/Twig/Extension/ConfigExtension.php:28
- confirmed `config` — core Twig function — vendor/shopware/core/Framework/Adapter/Twig/Extension/ConfigExtension.php:54
- confirmed `seoUrl` — core Twig function — vendor/shopware/core/Framework/Adapter/Twig/Extension/SeoUrlFunctionExtension.php:28
- confirmed `manufacturerLink` — read with label, description and supportLink from the composer.json extra block — vendor/shopware/core/Framework/Plugin/PluginService.php:223
- unverified `shopware-block` — comment format defined by the IDE plugin, not by Shopware code
- unverified `Shopware 6 Toolbox` — JetBrains plugin, outside the Shopware code roots
