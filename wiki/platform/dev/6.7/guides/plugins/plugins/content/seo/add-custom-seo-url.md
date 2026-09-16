---
id: platform/dev/6.7/guides/plugins/plugins/content/seo/add-custom-seo-url.md
title: Add Custom SEO URLs
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/content/seo/add-custom-seo-url.html
sourceHash: e470e3491402b80d05c3fa184f6a2583c54ccdb9
codeCheckedAgainst: "6.7.13.0"
keywords: ["SeoUrlRouteInterface", "SeoUrlRouteConfig", "SeoUrlMapping", "SeoUrlUpdater", "SeoUrlPersister", "shopware.seo_url.route", "seo_url", "seo_url_template", "ImportTranslationsTrait", "seo url", "friendly url", "translated url", "custom entity seo", "url rewrite"]
summary: Create static (migration into seo_url) and dynamic SEO URLs (SeoUrlRouteInterface + seo_url_template, or SeoUrlPersister) for custom routes and entities.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-controller.md", "platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md", "platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-custom-complex-data.md", "platform/dev/6.7/guides/plugins/plugins/framework/data-handling/using-database-events.md"]
---
## What it is

How a plugin adds SEO URLs for its own storefront routes: static URLs written once by a migration, dynamic URLs generated for DAL entities via a SEO URL route class, and dynamic URLs for non-entity content written with `SeoUrlPersister`.

## When to use

- A custom controller route (e.g. `/example`, name `frontend.example.example`) should be reachable via translated paths like `Example-Page` / `Beispiel-Seite`.
- A custom entity needs a SEO URL created/updated/deleted with the entity.
- External or non-DAL content needs SEO URLs.

## Key steps / config

### Static SEO URL (migration)

Insert one `seo_url` row per sales channel and language, e.g. with `Shopware\Core\Migration\Traits\ImportTranslationsTrait::importTranslation()` and a `Translations(german, english)` object:

```php
class Migration1619094740AddStaticSeoUrl extends MigrationStep
{
    use ImportTranslationsTrait;
    public function getCreationTimestamp(): int { return 1619094740; }
    public function update(Connection $connection): void
    {
        $this->importTranslation('seo_url', new Translations($germanRow, $englishRow), $connection);
    }
}
```

Row columns: `id`, `sales_channel_id` (Storefront channel, `Defaults::SALES_CHANNEL_TYPE_STOREFRONT`), `foreign_key`, `route_name` (`frontend.example.example`), `path_info` (`/example`), `is_canonical` 1, `is_modified` 0, `is_deleted` 0, plus the translated `seo_path_info`.

### Dynamic SEO URLs for entities

1. Implement `Shopware\Core\Content\Seo\SeoUrlRoute\SeoUrlRouteInterface` — required: `getConfig()` (from `EntitySeoUrlRouteInterface`), `prepareCriteria()` with a `SalesChannelEntity` second parameter, and `getMapping()`:

```php
class ExamplePageSeoUrlRoute implements SeoUrlRouteInterface
{
    public const ROUTE_NAME = 'frontend.example.example';
    public const DEFAULT_TEMPLATE = '{{ example.name }}';
    public function getConfig(): SeoUrlRouteConfig
    { return new SeoUrlRouteConfig($this->exampleDefinition, self::ROUTE_NAME, self::DEFAULT_TEMPLATE, true); }
    public function prepareCriteria(Criteria $criteria, SalesChannelEntity $salesChannel): void { /* filters, associations */ }
    public function getMapping(Entity $example, ?SalesChannelEntity $salesChannel): SeoUrlMapping
    { return new SeoUrlMapping($example, ['exampleId' => $example->getId()], ['example' => $example->jsonSerialize()]); }
}
```

   `getMapping` must supply every template variable (`example.name` needs key `example`) and should reject other entity types.
2. Register with tag `shopware.seo_url.route`.
3. Subscribe to `swag_example.written` and `swag_example.deleted`; call `Shopware\Core\Content\Seo\SeoUrlUpdater::update(ExamplePageSeoUrlRoute::ROUTE_NAME, $event->getIds())`.
4. Migration into `seo_url_template`: `id`, `sales_channel_id` null, `route_name` = `ROUTE_NAME`, `entity_name` = `swag_example`, `template` = `DEFAULT_TEMPLATE`, `created_at` (`Defaults::STORAGE_DATE_TIME_FORMAT`).

### Dynamic SEO URLs for custom content

Call `Shopware\Core\Content\Seo\SeoUrlPersister::updateSeoUrls(Context $context, string $routeName, array $foreignKeys, iterable $seoUrls, SalesChannelEntity $salesChannel)`. URL entry shape:

```php
['salesChannelId' => ..., 'foreignKey' => ..., 'routeName' => self::ROUTE_NAME,
 'pathInfo' => '/example-path/' . $id, 'isCanonical' => true, 'seoPathInfo' => '/' . $slug]
```

To soft-delete, pass the IDs as `$foreignKeys` with an empty `$seoUrls` array: those rows get `is_deleted` = 1 (not removed). The language comes from the `Context`; construct `new Context($source, $ruleIds, $currencyId, [$languageId])` to target one.

## Essential identifiers

- `SeoUrlRouteInterface`, `SeoUrlRouteConfig`, `SeoUrlMapping` (`Shopware\Core\Content\Seo\SeoUrlRoute`)
- Tag `shopware.seo_url.route`
- `Shopware\Core\Content\Seo\SeoUrlUpdater::update()`, `Shopware\Core\Content\Seo\SeoUrlPersister::updateSeoUrls()`
- `ImportTranslationsTrait`, `Translations` (`Shopware\Core\Migration\Traits`)
- Tables `seo_url`, `seo_url_template`

## Gotchas

- `SeoUrlUpdater::update()` silently does nothing without a `seo_url_template` row for the route.
- The German static URL only resolves if the sales channel has a German domain.
- Soft-deleted SEO routes stay reachable; the controller must check the content exists.
- The docs show `prepareCriteria(Criteria $criteria)` and a four-argument `updateSeoUrls(...)`; both fail against 6.7.13.0 signatures.

## Code check (6.7.13.0)
- corrected `SeoUrlRouteInterface::prepareCriteria()` — docs: only `Criteria $criteria`, installed adds `SalesChannelEntity $salesChannel` — vendor/shopware/core/Content/Seo/SeoUrlRoute/SeoUrlRouteInterface.php:13
- confirmed `SeoUrlRouteInterface::getMapping()` — signature matches docs — vendor/shopware/core/Content/Seo/SeoUrlRoute/SeoUrlRouteInterface.php:15
- confirmed `EntitySeoUrlRouteInterface::getConfig()` — inherited required member — vendor/shopware/core/Content/Seo/SeoUrlRoute/EntitySeoUrlRouteInterface.php:13
- confirmed `shopware.seo_url.route` — consumed by SeoUrlRouteRegistry — vendor/shopware/core/Framework/DependencyInjection/seo.xml:45
- corrected `SeoUrlPersister::updateSeoUrls()` — docs: 4 arguments, installed requires `SalesChannelEntity $salesChannel` — vendor/shopware/core/Content/Seo/SeoUrlPersister.php:43
- confirmed `SeoUrlUpdater::update()` — returns early without template — vendor/shopware/core/Content/Seo/SeoUrlUpdater.php:44
- confirmed `SeoUrlRouteConfig::__construct()` — definition, routeName, template, skipInvalid — vendor/shopware/core/Content/Seo/SeoUrlRoute/SeoUrlRouteConfig.php:12
- confirmed `SeoUrlMapping::__construct()` — entity, infoPathContext, seoPathInfoContext — vendor/shopware/core/Content/Seo/SeoUrlRoute/SeoUrlMapping.php:15
- confirmed `ImportTranslationsTrait::importTranslation()` — table, Translations, Connection — vendor/shopware/core/Migration/Traits/ImportTranslationsTrait.php:13
- confirmed `MigrationStep::getCreationTimestamp()` — abstract required member — vendor/shopware/core/Framework/Migration/MigrationStep.php:28
