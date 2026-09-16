---
id: platform/dev/6.7/concepts/framework/translations/extension-points.md
title: Extension points
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/framework/translations/extension-points.html
sourceHash: 937f71a80ad67ac0466fa07c6f6528712a95de35
codeCheckedAgainst: "6.7.13.0"
keywords: ["StorefrontSnippetsExtension", "SnippetsThemeResolveEvent", "TranslationLoadedEvent", "TranslationRemovedEvent", "SnippetEvents", "TranslationLoader", "TranslationConfigLoader", "SnippetFileLoader", "SnippetValidatorInterface", "shopware.filesystem.private", "translation:install", "snippet override", "service decoration", "translation events"]
summary: "Ways to extend Shopware 6.7 translations: snippet files, StorefrontSnippetsExtension, translation events, CLI, Flysystem storage, service decoration."
lastBuilt: 2026-09-15
relatedPages:
  - platform/dev/6.7/concepts/framework/translations/built-in-translation-system.md
  - platform/dev/6.7/guides/plugins/plugins/framework/extension/finding-extensions.md
  - platform/dev/6.7/guides/hosting/infrastructure/filesystem.md
  - platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md
---
## What it is

Overview of the extension points of the translation system — snippets, the [built-in download system](platform/dev/6.7/concepts/framework/translations/built-in-translation-system.md), and the storefront snippet runtime — from lightest to most involved.

## When to use

Choosing how to override or ship translations, alter storefront snippets at runtime, react to language install/removal, automate installation, relocate storage, or replace loading/validation logic.

## Key steps / config

1. **Snippet overrides**: edit strings under *Settings → Snippets* (database overrides win), or ship files in a bundle's `Resources/snippet` directory (scanned automatically). Storefront files use `<domain>.<locale>.json` (e.g. `storefront.fr-FR.json`); the `messages` domain is reserved for `messages.<language>.base.json`.
2. **Runtime storefront snippets**: `Shopware\Core\System\Snippet\Extension\StorefrontSnippetsExtension` (dispatched in `SnippetService::getStorefrontSnippets()`, see [extension events](platform/dev/6.7/guides/plugins/plugins/framework/extension/finding-extensions.md)). `onPre()`: adjust `$extension->snippets`, or `stopPropagation()` and set `result`. `onPost()`: modify `$extension->result`. Public properties: `snippets`, `locale`, `catalog`, `snippetSetId`, `fallbackLocale`, `salesChannelId`, `unusedThemes`.
   ```php
   public static function getSubscribedEvents(): array
   {
       return [StorefrontSnippetsExtension::onPost() => 'afterSnippetsResolved'];
   }
   ```
   `Shopware\Core\System\Snippet\Event\SnippetsThemeResolveEvent` influences which themes count as used per sales channel.
3. **Events** (`Shopware\Core\System\Snippet\Event`): `TranslationLoadedEvent` (after `TranslationLoader::load()`, payload `locale`, `Context`), `TranslationRemovedEvent` (from `TranslationRemover`, payload `locale`). DAL events: `Shopware\Core\System\Snippet\SnippetEvents` (e.g. `SNIPPET_WRITTEN_EVENT`).
4. **CLI**: `translation:install`, `translation:update`, `translation:list`, `translation:lint-filenames` (`--fix`), `translation:validate`; scheduled task `translation.update` (`Shopware\Core\System\Snippet\ScheduledTask\UpdateTranslationsTask`).
5. **Storage**: downloads are written via the `shopware.filesystem.private` Flysystem adapter ([filesystem guide](platform/dev/6.7/guides/hosting/infrastructure/filesystem.md)).
6. **Service decoration** ([pattern](platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md)), service IDs present in the shop container:
   - `Shopware\Core\System\Snippet\Service\TranslationConfigLoader` — decorator implements `getDecorated()` and `load()`
   - `Shopware\Core\System\Snippet\Service\TranslationLoader` — extends `AbstractTranslationLoader`; commands inject this concrete ID
   - `Shopware\Core\System\Snippet\Files\SnippetFileLoader` — implements `SnippetFileLoaderInterface`
   - `Shopware\Core\System\Snippet\SnippetValidatorInterface`
   ```xml
   <service id="MyPlugin\Service\CustomTranslationConfigLoader"
            decorates="Shopware\Core\System\Snippet\Service\TranslationConfigLoader">
       <argument type="service" id="MyPlugin\Service\CustomTranslationConfigLoader.inner"/>
   </service>
   ```
   Both concrete loaders are `@internal` and their `getDecorated()` throws `DecorationPatternException`; your decorator returns the injected inner instance.

## Essential identifiers

- `StorefrontSnippetsExtension`, `SnippetsThemeResolveEvent`, `TranslationLoadedEvent`, `TranslationRemovedEvent`, `SnippetEvents`
- `TranslationConfigLoader`, `TranslationLoader`, `AbstractTranslationLoader`, `SnippetFileLoader`, `SnippetValidatorInterface`
- `shopware.filesystem.private`, `translation.update`

## Gotchas

- Upstream docs say to decorate `Shopware\Core\System\Snippet\Service\AbstractTranslationConfigLoader`; in 6.7.13.0 that alias exists only in the installer container, the shop container registers the concrete `TranslationConfigLoader` ID.
- Upstream docs describe a `shopware.translation` config section (`repository_url`, `plugin_mapping`); no such config tree exists in 6.7.13.0 — configuration comes from the shipped `translation.yaml` only.
- `AbstractTranslationLoader::pluginTranslationExists()` is deprecated for removal in v6.8.0 but still abstract; override `pluginTranslationExistsForLocale()` for locale-aware behaviour.
- `StorefrontSnippetsExtension` is `final` and Shopware owns its constructor — use its events and properties, do not extend it.

## Code check (6.7.13.0)
- confirmed `StorefrontSnippetsExtension` — final class, extends Extension — vendor/shopware/core/System/Snippet/Extension/StorefrontSnippetsExtension.php:15
- confirmed `onPost` — static event-name method on base Extension — vendor/shopware/core/Framework/Extensions/Extension.php:47
- confirmed `SnippetsThemeResolveEvent` — dispatched in SnippetService — vendor/shopware/core/System/Snippet/SnippetService.php:105
- confirmed `TranslationLoadedEvent` — dispatched with locale and context — vendor/shopware/core/System/Snippet/Service/TranslationLoader.php:81
- confirmed `TranslationRemovedEvent` — dispatched with locale — vendor/shopware/core/System/Snippet/Service/TranslationRemover.php:43
- confirmed `SNIPPET_WRITTEN_EVENT` — value snippet.written — vendor/shopware/core/System/Snippet/SnippetEvents.php:10
- confirmed `shopware.filesystem.private` — first argument of TranslationLoader — vendor/shopware/core/System/DependencyInjection/snippet.xml:87
- corrected `AbstractTranslationConfigLoader` — docs: alias decoratable in the shop; only defined in installer container — vendor/shopware/core/Installer/DependencyInjection/services.xml:171
- deprecated `pluginTranslationExists` — tag v6.8.0, use pluginTranslationExistsForLocale — vendor/shopware/core/System/Snippet/Service/AbstractTranslationLoader.php:23
- absent `repository_url` — no shopware.translation config tree in installed code
