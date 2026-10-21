---
id: platform/dev/6.7/concepts/framework/translations/extension-points.md
title: Extension points
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/framework/translations/extension-points.html
sourceHash: 937f71a80ad67ac0466fa07c6f6528712a95de35
codeCheckedAgainst: "6.7.15.1"
keywords: ["StorefrontSnippetsExtension", "SnippetsThemeResolveEvent", "TranslationLoadedEvent", "TranslationRemovedEvent", "AbstractTranslationConfigLoader", "TranslationLoader", "SnippetFileLoader", "SnippetValidatorInterface", "SnippetEvents", "translation:install", "snippet override", "translation decoration"]
summary: "Translation system extension points: snippet files, StorefrontSnippetsExtension, translation events, CLI, storage, config, decoration."
lastBuilt: 2026-10-21
relatedPages:
  - platform/dev/6.7/concepts/framework/translations/built-in-translation-system.md
  - platform/dev/6.7/guides/plugins/plugins/framework/extension/finding-extensions.md
  - platform/dev/6.7/concepts/framework/translations/automated-translation-updates.md
  - platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md
---
## What it is

Where the translation system — snippets, the [built-in download system](platform/dev/6.7/concepts/framework/translations/built-in-translation-system.md), and the storefront snippet runtime — can be extended, from the lightest option to the most involved.

## When to use

Choosing how to override translations, change storefront snippets at runtime, react to locale install/removal, automate updates, relocate storage, or replace loading/validation logic.

## Key steps / config

1. **Snippets (no PHP):** edit strings under *Settings → Snippets* (database overrides win), or ship files in a bundle's `Resources/snippet` directory (scanned automatically). Storefront files use `<domain>.<locale>.json`, e.g. `storefront.fr-FR.json`; the `messages` domain is reserved for `messages.<language>.base.json`.
2. **Runtime changes:** `Shopware\Core\System\Snippet\Extension\StorefrontSnippetsExtension`, dispatched in `SnippetService::getStorefrontSnippets()` via the [extension event system](platform/dev/6.7/guides/plugins/plugins/framework/extension/finding-extensions.md). `onPre()`: adjust `$extension->snippets` before database overrides, or `stopPropagation()` and set `result`. `onPost()`: modify `$extension->result`.

```php
public static function getSubscribedEvents(): array
{
    return [StorefrontSnippetsExtension::onPost() => 'afterSnippetsResolved'];
}

public function afterSnippetsResolved(StorefrontSnippetsExtension $extension): void
{
    $extension->result['header.search.placeholder'] = 'Rechercher…';
}
```

   Public properties: `snippets`, `locale`, `catalog`, `snippetSetId`, `fallbackLocale`, `salesChannelId`, `unusedThemes`, plus `result`. `SnippetsThemeResolveEvent` influences which themes count as used/unused.
3. **Events** (`Shopware\Core\System\Snippet\Event`): `TranslationLoadedEvent` (`locale`, `Context`, after `TranslationLoader::load()`), `TranslationRemovedEvent` (`locale`, from `TranslationRemover`). DAL lifecycle events: `Shopware\Core\System\Snippet\SnippetEvents` (e.g. `SNIPPET_WRITTEN_EVENT`).
4. **CLI / task:** `translation:install` (`--locales` or `--all`), `translation:update`, `translation:list`, `translation:lint-filenames` (`--fix`), `translation:validate`; scheduled task `translation.update`.
5. **Storage:** downloads go through the `shopware.filesystem.private` Flysystem adapter.
6. **Config:** override `translation.yaml` fields via `shopware.translation` in `config/packages`; to distribute own translations set `repository_url`, add the plugin to `plugins` (plus `plugin_mapping` if names differ).
7. **Decoration** ([pattern](platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md)) — decorate the service ID and delegate to the inner instance:

| Service ID | Base |
|---|---|
| `Shopware\Core\System\Snippet\Service\AbstractTranslationConfigLoader` | abstract: `getDecorated()`, `load()` |
| `Shopware\Core\System\Snippet\Service\TranslationLoader` | extends `AbstractTranslationLoader` |
| `Shopware\Core\System\Snippet\Files\SnippetFileLoader` | implements `SnippetFileLoaderInterface` |
| `Shopware\Core\System\Snippet\SnippetValidatorInterface` | interface |

```xml
<service id="MyPlugin\Service\CustomTranslationConfigLoader"
         decorates="Shopware\Core\System\Snippet\Service\AbstractTranslationConfigLoader">
    <argument type="service" id="MyPlugin\Service\CustomTranslationConfigLoader.inner"/>
</service>
```

## Essential identifiers

`StorefrontSnippetsExtension`, `SnippetsThemeResolveEvent`, `TranslationLoadedEvent`, `TranslationRemovedEvent`, `SnippetEvents`, `AbstractTranslationConfigLoader`, `TranslationLoader`, `SnippetFileLoader`, `SnippetValidatorInterface`

## Gotchas

- `TranslationConfigLoader` is `@internal`; its `getDecorated()` throws `DecorationPatternException` — decorate the abstract alias.
- `TranslationLoader::getDecorated()` also throws. Contrary to the docs, `AbstractTranslationLoader` is registered as an alias, but `TranslationUpdater` injects the concrete `TranslationLoader` ID — decorate that ID.
- `StorefrontSnippetsExtension` is `final` with a Shopware-owned constructor.
- `AbstractTranslationLoader::pluginTranslationExists()` is deprecated for 6.8.0; override `pluginTranslationExistsForLocale()`.

## Code check (6.7.15.1)
- confirmed `StorefrontSnippetsExtension` — final, public constructor properties — vendor/shopware/core/System/Snippet/Extension/StorefrontSnippetsExtension.php:15
- confirmed `SnippetService::getStorefrontSnippets()` — dispatches the extension — vendor/shopware/core/System/Snippet/SnippetService.php:96
- confirmed `Extension::onPost()` — static event-name helper — vendor/shopware/core/Framework/Extensions/Extension.php:47
- confirmed `TranslationLoadedEvent` — dispatched in `TranslationLoader::load()` with locale and context — vendor/shopware/core/System/Snippet/Service/TranslationLoader.php:83
- confirmed `TranslationRemovedEvent` — dispatched by TranslationRemover — vendor/shopware/core/System/Snippet/Service/TranslationRemover.php:43
- confirmed `SnippetEvents::SNIPPET_WRITTEN_EVENT` — `snippet.written` — vendor/shopware/core/System/Snippet/SnippetEvents.php:10
- confirmed `TranslationConfigLoader::getDecorated()` — throws DecorationPatternException — vendor/shopware/core/System/Snippet/Service/TranslationConfigLoader.php:61
- corrected `AbstractTranslationLoader` — docs: no abstract alias for TranslationLoader — vendor/shopware/core/System/DependencyInjection/snippet.php:180
- confirmed `TranslationLoader` — concrete ID injected into TranslationUpdater — vendor/shopware/core/System/DependencyInjection/snippet.php:192
- deprecated `AbstractTranslationLoader::pluginTranslationExists()` — removal in 6.8.0 — vendor/shopware/core/System/Snippet/Service/AbstractTranslationLoader.php:38
