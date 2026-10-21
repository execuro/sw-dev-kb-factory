---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/content/seo/add-custom-seo-url.md
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-controller.md
  - platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md
  - platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-custom-complex-data.md
  - platform/dev/6.7/guides/plugins/plugins/framework/data-handling/using-database-events.md
sourceHash: e470e3491402b80d05c3fa184f6a2583c54ccdb9
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/content/seo/add-custom-seo-url.html
title: Add Custom SEO URLs
version: "6.7"
versions:
  - "6.7"
keywords: ["SeoUrlRouteInterface", "SeoUrlRouteConfig", "SeoUrlMapping", "SeoUrlUpdater", "SeoUrlPersister", "shopware.seo_url.route", "seo_url", "seo_url_template", "ImportTranslationsTrait", "seo url", "friendly url", "dynamic seo url", "custom entity seo", "url rewrite"]
summary: Static SEO URLs via seo_url migration; dynamic ones via SeoUrlRouteInterface, shopware.seo_url.route, SeoUrlUpdater and SeoUrlPersister::updateSeoUrls().
lastBuilt: 2026-10-21
---
## What it is

This page shows how a plugin adds SEO URLs in three cases:

- **Static** SEO URLs for a fixed custom Storefront route.
- **Dynamic** SEO URLs for custom DAL entities, generated through a `SeoUrlRouteInterface` implementation.
- **Dynamic** SEO URLs for non-entity content, written directly with `SeoUrlPersister`.

## When to use

- You have a custom controller route such as `/example` that needs a translated SEO path.
- You have a custom entity whose name should become its URL and stay in sync on write and delete.
- You have external or dynamic content that needs `seo_url` entries.

## Key steps / config

### Static SEO URL (migration)

Take the route name (`frontend.example.example`) and path (`/example`) from the controller. Insert one `seo_url` row per sales channel and language in a `MigrationStep`. Use `Shopware\Core\Migration\Traits\ImportTranslationsTrait::importTranslation('seo_url', new Translations($german, $english), $connection)`:

```php
class Migration1619094740AddStaticSeoUrl extends MigrationStep
{
    use ImportTranslationsTrait;
    public function getCreationTimestamp(): int { return 1619094740; }
    public function update(Connection $connection): void { /* importTranslation(...) */ }
}
```

Row keys: `id`, `sales_channel_id` (looked up by `type_id` = `Defaults::SALES_CHANNEL_TYPE_STOREFRONT`), `foreign_key`, `route_name`, `path_info`, `is_canonical`, `is_modified`, `is_deleted`, plus a translated `seo_path_info` (`Example-Page` / `Beispiel-Seite`).

### Dynamic SEO URL for entities

1. Implement `Shopware\Core\Content\Seo\SeoUrlRoute\SeoUrlRouteInterface`. It requires `getConfig()`, `prepareCriteria()` and `getMapping()`:

```php
class ExamplePageSeoUrlRoute implements SeoUrlRouteInterface
{
    public const ROUTE_NAME = 'frontend.example.example';
    public const DEFAULT_TEMPLATE = '{{ example.name }}';
    public function getConfig(): SeoUrlRouteConfig
    { return new SeoUrlRouteConfig($this->exampleDefinition, self::ROUTE_NAME, self::DEFAULT_TEMPLATE, true); }
    public function prepareCriteria(Criteria $criteria, SalesChannelEntity $salesChannel): void { /* filters, associations */ }
    public function getMapping(Entity $entity, ?SalesChannelEntity $salesChannel): SeoUrlMapping
    { /* check instanceof ExampleEntity; return new SeoUrlMapping($entity, ['exampleId' => ...], ['example' => $json]); */ }
}
```

   - `SeoUrlRouteConfig(definition, routeName, template, skipInvalid = true)` describes the route.
   - `prepareCriteria` narrows or extends the entity fetch, e.g. an `active` filter or associations.
   - `SeoUrlMapping(entity, infoPathContext, seoPathInfoContext)` must supply every variable the template uses (`example` for `example.name`).
2. Register the class with the tag `shopware.seo_url.route`. Services implementing `SeoUrlRouteInterface` are also autoconfigured with that tag.
3. Subscribe to the entity's DAL events, `swag_example.written` and `swag_example.deleted`, and call `Shopware\Core\Content\Seo\SeoUrlUpdater::update(ExamplePageSeoUrlRoute::ROUTE_NAME, $event->getIds())`. Register the subscriber with `kernel.event_subscriber`.
4. Add a migration that inserts a `seo_url_template` row with these keys:
   - `id`
   - `sales_channel_id` (`null`)
   - `route_name` (`ROUTE_NAME`)
   - `entity_name` (`swag_example`)
   - `template` (`DEFAULT_TEMPLATE`)
   - `created_at` (formatted with `Defaults::STORAGE_DATE_TIME_FORMAT`)

### Dynamic SEO URL for custom (non-entity) content

Build URL arrays with the keys `salesChannelId`, `foreignKey`, `routeName`, `pathInfo`, `isCanonical` and `seoPathInfo` (e.g. slugified with `Cocur\Slugify\SlugifyInterface`). Then call:

```php
$this->seoUrlPersister->updateSeoUrls($context, self::ROUTE_NAME, $foreignKeys, $urls, $salesChannel);
```

The fifth argument, a `SalesChannelEntity`, is required in 6.7. To soft-delete, call `updateSeoUrls($context, self::ROUTE_NAME, $ids, [], $salesChannel)`. This marks the entries `is_deleted` and does not remove the rows. To write for a specific language, build a `new Context(source, ruleIds, currencyId, [$languageId])` and pass it in.

## Essential identifiers

- `Shopware\Core\Content\Seo\SeoUrlRoute\SeoUrlRouteInterface`, `SeoUrlRouteConfig`, `SeoUrlMapping`
- `Shopware\Core\Content\Seo\SeoUrlUpdater::update(string $routeName, array $ids)`
- `Shopware\Core\Content\Seo\SeoUrlPersister::updateSeoUrls(Context, string, array, iterable, SalesChannelEntity)`
- DI tag `shopware.seo_url.route`
- Tables `seo_url`, `seo_url_template`
- `ImportTranslationsTrait`, `Translations`

## Gotchas

- The German SEO URL only resolves if the sales channel has a German domain configured.
- `SeoUrlUpdater` needs a `seo_url_template` row for the route, or no URLs are generated.
- In `getMapping`, check the entity type, because the method can receive other entities.
- Soft-deleted SEO URLs still route to your controller. Check in the controller that the content still exists.
- The source's `prepareCriteria(Criteria $criteria)` and four-argument `updateSeoUrls(...)` calls do not match the 6.7 signatures. Use the forms above.

## Code check (6.7.15.1)
- confirmed `SeoUrlRouteInterface::getMapping()` — Entity + ?SalesChannelEntity, returns SeoUrlMapping — vendor/shopware/core/Content/Seo/SeoUrlRoute/SeoUrlRouteInterface.php:12
- confirmed `EntitySeoUrlRouteInterface::getConfig()` — inherited by SeoUrlRouteInterface — vendor/shopware/core/Content/Seo/SeoUrlRoute/EntitySeoUrlRouteInterface.php:15
- corrected `EntitySeoUrlRouteInterface::prepareCriteria()` — docs: prepareCriteria(Criteria $criteria); also requires SalesChannelEntity $salesChannel — vendor/shopware/core/Content/Seo/SeoUrlRoute/EntitySeoUrlRouteInterface.php:17
- corrected `SeoUrlPersister::updateSeoUrls()` — docs: four arguments; fifth SalesChannelEntity $salesChannel is required — vendor/shopware/core/Content/Seo/SeoUrlPersister.php:43
- confirmed `SeoUrlUpdater::update()` — (string $routeName, array $ids) — vendor/shopware/core/Content/Seo/SeoUrlUpdater.php:46
- confirmed `shopware.seo_url.route` — autoconfigured tag for SeoUrlRouteInterface — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:179
- confirmed `SeoUrlRouteConfig` — (definition, routeName, template, skipInvalid = true, primaryKeyParameterKey) — vendor/shopware/core/Content/Seo/SeoUrlRoute/SeoUrlRouteConfig.php:12
- confirmed `SeoUrlMapping` — (entity, infoPathContext, seoPathInfoContext, error) — vendor/shopware/core/Content/Seo/SeoUrlRoute/SeoUrlMapping.php:9
- confirmed `ImportTranslationsTrait::importTranslation()` — (string $table, Translations, Connection) — vendor/shopware/core/Migration/Traits/ImportTranslationsTrait.php:13
- confirmed `MigrationStep::getCreationTimestamp()` — abstract, with update(Connection) at line 33 — vendor/shopware/core/Framework/Migration/MigrationStep.php:28
