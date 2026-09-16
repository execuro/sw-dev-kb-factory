---
id: platform/dev/6.7/guides/development/tooling/shopware-toolbox.md
title: Shopware 6 Toolbox
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/tooling/shopware-toolbox.html
sourceHash: 6ce823b5165d77f094c89930e4aa745aca08d155
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopware 6 toolbox", "phpstorm plugin", "jetbrains", "ide support", "code generators", "twig block versioning", "shopware-block", "sw_extends", "sw_include", "theme_config", "inspections", "live templates", "create event listener", "file templates"]
summary: "Shopware 6 Toolbox PHPStorm plugin: generators, intentions, inspections, navigation, Twig block versioning (shopware-block comments)."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/creating-plugins.md", "platform/dev/6.7/guides/plugins/plugins/framework/event/finding-events.md", "platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md"]
---
## What it is

The Shopware 6 Toolbox is a plugin for PHPStorm and other JetBrains IDEs (not a standalone application) that adds Shopware-specific live templates, code generators, intentions, inspections, navigation, auto-completion and Twig block versioning.

## When to use

- Scaffolding plugins/apps/admin modules from inside the IDE instead of `bin/console plugin:create` or manual file creation (see `platform/dev/6.7/guides/plugins/plugins/creating-plugins.md`).
- Tracking whether Storefront Twig block overrides (`sw_extends`) are outdated after a Shopware or extension update.
- Enforcing in-house conventions on generated files.

## Key steps / config

**Installation:** PHPStorm → Settings → Plugins → search "Shopware 6 Toolbox" → install, restart. Builds on the bundled PHP, Twig, Sass, YAML and JavaScript plugins; integrates with the Symfony Support plugin if installed. Telemetry: *Settings → Tools → Shopware 6 Toolbox*.

**Live templates:** Cmd/Ctrl + J lists them (changelog entries and other boilerplate).

**Generators** (*File → New → Shopware Platform*, or Ctrl/Cmd + N in the project tree):

| Group | Generates |
|---|---|
| Plugin | Plugin skeleton, `config.xml` |
| PHP | Scheduled task, database migration |
| App | App skeleton, custom entities, app script, CMS block/element |
| Administration | Vue component, Vue module, CMS block, CMS element |

Context actions: *Extend this block* on a Storefront Twig block; *Extend component* / *Extend method* for Administration overrides.

**Intentions** (Alt+Enter / Option+Enter): Extend Twig block (creates override file and `sw_extends` block), Create event listener (creates a subscriber in a chosen plugin and registers it; see `platform/dev/6.7/guides/plugins/plugins/framework/event/finding-events.md`), Extend admin component, Extend admin component method, Add/Update the Shopware 6 versioning comment, Show Twig block difference.

**Inspections** (*Settings → Editor → Inspections → Shopware 6*, all enabled by default):
- PHP: class used instead of abstract class (Error) — enforces decoration via the abstract class contract (`platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md`); Criteria IDs set by filter instead of constructor.
- Administration: missing snippet translation; deprecated Vue template slots.
- Script: service not available in scope; permission missing in `manifest.xml`.
- Store check: `composer.json` missing `extra.label`, `extra.description`, `extra.manufacturerLink`, `extra.supportLink` or `require.shopware/core`.

**Twig block versioning:** a comment above the overriding block stores a SHA-256 hash of the upstream block plus the extension version (from the Composer package or the extension's `composer.json`):

```twig
{# shopware-block: c1954b12f0c4...@v6.6.6.0 #}
{% block base_body_skip_to_content %}
    ...
{% endblock %}
```

Upstream is resolved through the `sw_extends` chain; works for core templates and third-party extensions (Composer or `custom/plugins`). Twig inspections: upstream block changed (on), upstream block removed (on), Twig block deprecated (on), versioning comment missing (off; only for templates that extend another). To add comments project-wide: enable *Shopware versioning block comment is missing*, run *Code → Inspect Code*, apply the quick fix.

**Navigation / completion:** Ctrl/Cmd + Click resolves admin components, mixins, modules, snippets, theme and system config keys, entity definitions, feature flags, Twig templates and blocks. `sw_extends`/`sw_include` navigation lists the referenced bundle first, then all plugin overrides. Completion covers admin components, snippets, `theme_config`, `config`, `seoUrl`, `sw_include`, `sw_extends`, template paths, `this.repositoryFactory.create`, `Module.register` labels, feature flags.

**Project setup:** *New Project → Shopware*; *Tools → Configure Shopware Project*.

**Customizing generated files:** *Settings → Editor → File and Code Templates*, edit the Shopware templates (project-wide or per IDE).

## Essential identifiers

- `shopware-block` versioning comment
- `sw_extends`, `sw_include`, `theme_config`, `config`, `seoUrl`
- `composer.json` store fields: `extra.label`, `extra.description`, `extra.manufacturerLink`, `extra.supportLink`, `require.shopware/core`
- `manifest.xml`, `config.xml`

## Gotchas

- *Show Twig block difference* diffs only against Shopware core templates; for third-party extensions the inspections report changes but no diff is shown.
- If the `sw_extends` chain cannot be resolved, blocks with a versioning comment are treated as overrides, so a broken chain does not hide upstream changes or removals.
- Scaffolding of `bin/console plugin:create` cannot be customized via templates; use the Toolbox file templates for in-house conventions.
- Context-aware admin component completion works only when the Twig file sits next to an `index.js`.

## Code check (6.7.13.0)
- confirmed `sw_extends` — Twig tag registered by core — vendor/shopware/core/Framework/Adapter/Twig/TokenParser/ExtendsTokenParser.php:68
- confirmed `sw_include` — Twig tag registered by core — vendor/shopware/core/Framework/Adapter/Twig/TokenParser/IncludeTokenParser.php:51
- confirmed `theme_config` — Storefront Twig function — vendor/shopware/storefront/Framework/Twig/Extension/ConfigExtension.php:28
- confirmed `config` — core Twig function — vendor/shopware/core/Framework/Adapter/Twig/Extension/ConfigExtension.php:54
- confirmed `seoUrl` — core Twig function — vendor/shopware/core/Framework/Adapter/Twig/Extension/SeoUrlFunctionExtension.php:29
- confirmed `base_body_skip_to_content` — block exists in storefront base template — vendor/shopware/storefront/Resources/views/storefront/base.html.twig:36
- confirmed `Module.register` — admin global maps to ModuleFactory.registerModule — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:123
- confirmed `plugin:create` — core scaffolding command — vendor/shopware/core/Framework/Plugin/Command/PluginCreateCommand.php:21
- unverified `shopware-block` — comment format is produced by the IDE plugin, not by vendor/shopware code
