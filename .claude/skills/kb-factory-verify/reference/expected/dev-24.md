# `dev-24` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-24` · `dev` · `Content (CMS/mail/SEO/media/sitemap)` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-11` · run `cases-review-2026-09-11-2117-22-31` |
| Core version | `6.7.13.0` |

**Query:** How do I get readable SEO URLs generated for the detail pages of my plugin's own entity?

**Expected answer — every fact an answer must contain:**

1. Implement `SeoUrlRouteInterface` — `getConfig()` returning a `SeoUrlRouteConfig(EntityDefinition, routeName, template, skipInvalid = true, primaryKeyParameterKey = null)`, `prepareCriteria(Criteria $criteria, SalesChannelEntity $salesChannel): void` and `getMapping(Entity $entity, ?SalesChannelEntity $salesChannel): SeoUrlMapping` — and register the service with the tag `shopware.seo_url.route` (autoconfiguration adds it to every `SeoUrlRouteInterface` service). The Symfony route named in the config must exist and accept the entity's id parameter, because the non-SEO `path_info` is produced by `$this->router->generate($config->getRouteName(), $mapping->getInfoPathContext())`. The fifth `primaryKeyParameterKey` argument is optional and is *not* used by the generation path; it is only needed if the plugin itself calls `EntityRouteResolver::generateSeoUrlPlaceholder()`/`generateUrl()` for that entity, where `getPrimaryKeyParameter()` throws `SeoUrlRouteConfigException` ("Missing parameter key for primary key") when it is null. `[code: Content/Seo/SeoUrlRoute/SeoUrlRouteInterface.php:11-16, Content/Seo/SeoUrlRoute/SeoUrlRouteConfig.php:12-18, :54-61, Content/Seo/SeoUrlGenerator.php:110-117, Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:176-178]`
2. The tagged service alone generates nothing — two further steps are mandatory. A `seo_url_template` row for the route with `sales_channel_id` NULL (the default template, carrying `route_name`, `entity_name`, `template`) must exist, or `SeoUrlUpdater::loadUrlTemplate()` throws `SeoException::invalidTemplate('Default templates not configured')`. And no indexer picks the route up: the storefront `SeoUrlUpdateListener` subscribes only to the product, category and landing-page indexer events, so the plugin must call `SeoUrlUpdater::update(RouteClass::ROUTE_NAME, $ids)` itself from its own indexer or a written/deleted subscriber. `[code: Content/Seo/SeoUrlUpdater.php:115-126, :44-53; storefront package Framework/Seo/SeoUrlRoute/SeoUrlUpdateListener.php:40-74]`
3. Generation is per sales channel and per language, and no sales-channel association on the plugin entity is required: `SeoUrlUpdater::update()` derives its work list from the `sales_channel_domain` rows of active, non-API sales channels and returns without doing anything when there are none, and `SeoUrlGenerator::generateUrls()` always calls `$seoUrl->setSalesChannelId($salesChannel->getId())`, so rows are never written once with `sales_channel_id` NULL. `[code: Content/Seo/SeoUrlUpdater.php:46-49, :95-139, Content/Seo/SeoUrlGenerator.php:125-128]`

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/plugins/content/seo/add-custom-seo-url.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| `SeoUrlRouteInterface` requires `getConfig()` (inherited), `prepareCriteria(Criteria, SalesChannelEntity)` and `getMapping(Entity, ?SalesChannelEntity)` | `Content/Seo/SeoUrlRoute/SeoUrlRouteInterface.php:11-16` | `public function prepareCriteria(Criteria $criteria, SalesChannelEntity $salesChannel): void;` |
| `getConfig()` comes from `EntitySeoUrlRouteInterface`, which is `@internal` | `Content/Seo/SeoUrlRoute/EntitySeoUrlRouteInterface.php:8-13` | `/** @internal */ interface EntitySeoUrlRouteInterface { public function getConfig(): SeoUrlRouteConfig; }` |
| The tag `shopware.seo_url.route` is consumed by exactly one service, `SeoUrlRouteRegistry`, as a tagged_iterator; autoconfiguration applies it to every `SeoUrlRouteInterface` implementation | `Framework/DependencyInjection/seo.xml:44-46`; `Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:176-178` | `->registerForAutoconfiguration(SeoUrlRouteInterface::class)->addTag('shopware.seo_url.route');` |
| `EntityRouteResolver` consumes a **separate** tag, `shopware.entity.seo_url.route` (contract `EntitySeoUrlRouteInterface`), carried in core only by the three store-api routes | `Framework/DependencyInjection/seo.xml:63-68`; `DevOps/StaticAnalyze/PHPStan/tagged-service-contracts.php:95,122` | `<argument type="tagged_iterator" tag="shopware.entity.seo_url.route"/>` |
| `primaryKeyParameterKey` is the optional fifth config argument and the generation path never reads it — `path_info` comes from `getMapping(...)->getInfoPathContext()` | `Content/Seo/SeoUrlRoute/SeoUrlRouteConfig.php:12-18`; `Content/Seo/SeoUrlGenerator.php:110-117` | `private readonly ?string $primaryKeyParameterKey = null,` / `$pathInfo = $this->router->generate($config->getRouteName(), $mapping->getInfoPathContext());` |
| `getPrimaryKeyParameter()` throws `SeoUrlRouteConfigException::routeConfigMissingParameterKeyForPrimaryKey()` when the key is null; no fallback, no `skipInvalid` guard | `Content/Seo/SeoUrlRoute/SeoUrlRouteConfig.php:54-61`; `Content/Seo/Exception/SeoUrlRouteConfigException.php:15-23` | `if ($this->primaryKeyParameterKey === null) { throw SeoUrlRouteConfigException::routeConfigMissingParameterKeyForPrimaryKey(...); }` |
| Only `EntityRouteResolver::generateSeoUrlPlaceholder()` and `::generateUrl()` call it, resolving the config via `SeoUrlRouteRegistry` first and the store-api iterator only as fallback | `Content/Seo/SeoUrlRoute/EntityRouteResolver.php:36-53, :55-73` | `$route = array_first($this->registry->findByDefinition($entityName));` |
| Core callers of `EntityRouteResolver` all pass core entity names (`CategoryUrlGenerator`, `CategoryBreadcrumbBuilder`, the three sitemap providers), so a plugin entity route omitting the key still generates URLs | `Content/Category/Service/CategoryUrlGenerator.php:28-35`; `Content/Category/Service/CategoryBreadcrumbBuilder.php:47`; `Content/Sitemap/Provider/ProductUrlProvider.php:44` | `private readonly EntityRouteResolver $entityRouteResolver,` |
| `EntityRouteResolver` is absent from the generation chain `SeoUrlUpdateListener → SeoUrlUpdater::update() → SeoUrlRouteRegistry::findByRouteName() → SeoUrlGenerator → SeoUrlPersister` | `Content/Seo/SeoUrlUpdater.php:44-85` | `$urls = $this->seoUrlGenerator->generate($ids, $template, $route, $languageContext, $salesChannel);` |
| A `seo_url_template` row with `sales_channel_id` NULL is mandatory | `Content/Seo/SeoUrlUpdater.php:115-126` | `if (!\array_key_exists('', $salesChannelTemplates)) { throw SeoException::invalidTemplate('Default templates not configured'); }` |
| No indexer wiring for a plugin route: the storefront listener subscribes to three core indexer events only | storefront package `Framework/Seo/SeoUrlRoute/SeoUrlUpdateListener.php:40-74` | `ProductEvents::PRODUCT_INDEXER_EVENT => 'updateProductUrls',` |
| Work list comes from `sales_channel_domain` of active, non-API sales channels; none means no generation | `Content/Seo/SeoUrlUpdater.php:46-49, :60-85, :95-139` | `INNER JOIN sales_channel ON ... sales_channel.active = 1 ... AND sales_channel.type_id != :apiTypeId` |
| Rows are always written per sales channel, never with `sales_channel_id` NULL | `Content/Seo/SeoUrlGenerator.php:125-128`; `Content/Seo/SeoUrlPersister.php:102-105` | `$seoUrl->setSalesChannelId($salesChannel->getId());` |
| `is_deleted` is set only by `SeoUrlPersister`: foreign keys that yielded no URL are flagged `1`, those that did are reset to `0`; `foreign_key` is a plain `IdField`, so no DB cascade | `Content/Seo/SeoUrlPersister.php:118, :124-135, :314-331`; `Content/Seo/SeoUrl/SeoUrlDefinition.php:51` | `$deletedIds = array_diff($foreignKeys, $updatedFks); $this->markAsDeleted(true, $deletedIds, $salesChannelId);` |
| A row with `is_deleted = 1` is **not** resolvable — every read path filters `is_deleted = 0` | `Content/Seo/SeoResolver.php:70-75, :141-149`; `Content/Seo/SeoUrlPlaceholderHandler.php:102`; `Content/Sitemap/Provider/AbstractUrlProvider.php:36`; `Content/Seo/SeoUrl/SalesChannel/SalesChannelSeoUrlDefinition.php:26-28` | `->andWhere('seo_url.is_deleted = 0');` |
| 6.7.13.0 still `continue`s past an entity whose template renders null/empty, so its live row gets flagged deleted (issue #19203); fixed on trunk only, by yielding with an error | `Content/Seo/SeoUrlGenerator.php:119-123` (6.7.13.0) vs shopware/shopware `src/Core/Content/Seo/SeoUrlGenerator.php` @ trunk `ee66a4c` | `if ($seoPathInfo === null \|\| $seoPathInfo === '') { continue; }` |
| `seo_url` requires language_id, foreign_key, route_name (max 50), path_info, seo_path_info; `seo_url_template` requires entity_name (64) and route_name | `Content/Seo/SeoUrl/SeoUrlDefinition.php:52-56`; `Content/Seo/SeoUrlTemplate/SeoUrlTemplateDefinition.php:51-53` | `(new StringField('route_name', 'routeName', 50))->addFlags(new ApiAware(), new Required())` |
| Template rendering uses Twig with the slugify autoescape strategy | `Content/Seo/SeoUrlGenerator.php:36` | `final public const ESCAPE_SLUGIFY = 'slugifyurlencode';` |
| `ConfiguredSeoUrlRoute` decorates an existing route under a different config | `Content/Seo/ConfiguredSeoUrlRoute.php:16-22` | `class ConfiguredSeoUrlRoute implements SeoUrlRouteInterface` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| `EntityRouteResolver` keeps a hard-coded store-api route list a plugin cannot enter, gating SEO URL generation | absent | its 4th argument is a plain `tagged_iterator` on `shopware.entity.seo_url.route`, which any service may carry; it is only a fallback after `SeoUrlRouteRegistry`, and it appears nowhere in the generation chain (`Framework/DependencyInjection/seo.xml:63-68`; `Content/Seo/SeoUrlRoute/EntityRouteResolver.php:55-73`) |
| A soft-deleted `seo_url` row stays reachable, so the controller must check `isDeleted` (old expected fact 3) | absent | `SeoResolver` filters `is_deleted = 0` on both the primary and the canonical-fallback query, and so do `SeoUrlPlaceholderHandler`, `AbstractUrlProvider` and `SalesChannelSeoUrlDefinition`; no core controller inspects `isDeleted` (`Content/Seo/SeoResolver.php:75,149`) |
| Registering a `SeoUrlRouteInterface` service makes Shopware regenerate URLs automatically on entity write | absent | the only wiring is the storefront `SeoUrlUpdateListener` on three hardcoded indexer events; no generic entity_written listener calls `SeoUrlUpdater` (storefront `Framework/Seo/SeoUrlRoute/SeoUrlUpdateListener.php:41-45`) |
| `AutoconfigureCompilerPass` auto-tags `EntitySeoUrlRouteInterface` implementations | absent | it registers autoconfiguration for `SeoUrlRouteInterface` → `shopware.seo_url.route` only; the entity tag must be written by hand (`Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:176-178`) |
| The Symfony route option `options: ['seo' => true]` makes a route SEO-capable | absent | the literal appears on 7 routes but nothing reads it; generation is driven solely by the tagged service plus the `seo_url_template` row (storefront `Controller/NavigationController.php:52`) |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| A core `SeoUrlRouteInterface` implementation that **omits** the fifth `primaryKeyParameterKey` and still generates SEO URLs end to end | `Content/Test/TestProductSeoUrlRoute.php:37-45` |
| Integration test of the per-sales-channel model: a plugin-style route updated manually, a row for the storefront channel and none for the headless (API) channel, plus the mandatory default `seo_url_template` insert | shopware/shopware `tests/integration/Core/Content/Seo/SeoUrlUpdaterTest.php` @ `v6.7.13.0` (`61765d9`), `testSeoLanguageInheritance` |
| Minimal working custom SEO route with its Symfony route declaration | `Content/Test/TestProductSeoUrlRoute.php:22-44` |
| Production reference with `prepareCriteria` filters and a `primaryKeyParameterKey` | storefront `Framework/Seo/SeoUrlRoute/ProductPageSeoUrlRoute.php:32-40` |
| Explicit service registration shape (definition arg + tag) | storefront `DependencyInjection/seo.php:25-29` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| "Decoupling Storefront Routes from Core" introduced `EntitySeoUrlRouteInterface`, `primaryKeyParameterKey` and an `EntityRouteResolver` | 6.7 | merged | https://github.com/shopware/shopware/pull/17596 |
| That refactor reported to break core's category route: a config without `primaryKeyParameterKey` throws on every navigation render | 6.7.13.0 | closed | https://github.com/shopware/shopware/issues/19648 |
| A template rendering to an empty string silently flags `seo_url` rows `is_deleted = 1`, producing 404s | 6.6/6.7 | closed | https://github.com/shopware/shopware/issues/19203 |
| SEO URLs not generated on create/activate, only after a later write | 6.7.9.0 | closed | https://github.com/shopware/shopware/issues/17205 |
| `prepareCriteria` narrowing silently excludes entities (link categories) | 6.7 | closed | https://github.com/shopware/shopware/issues/16313 |
| The add-custom-seo-url guide's example still uses annotations | unclear | closed | https://github.com/shopware/docs/issues/1224 |
| `SeoUrlPersister::updateCanonicalSeoUrls()` promoting a second canonical row → unique constraint violations | 6.7.13.0 | open | https://github.com/shopware/shopware/issues/19647 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Which methods does `SeoUrlRouteInterface` declare in 6.7; is `extractIdsToUpdate` still required? | code lane | settled: three methods — `getConfig()` (from `EntitySeoUrlRouteInterface`), `prepareCriteria(Criteria, SalesChannelEntity)`, `getMapping(Entity, ?SalesChannelEntity)`; no `extractIdsToUpdate` |
| Must a plugin config pass the fifth `primaryKeyParameterKey`? | deep code lane | settled: no — the generation path never calls `getPrimaryKeyParameter()`; only `EntityRouteResolver` does, so the key is needed only when the plugin calls that resolver for its own entity. A core test route omits it and generates fine |
| Does `EntityRouteResolver` hold a hard-coded route list a plugin cannot extend, and does it gate generation? | deep code lane | settled: no on both counts — a second, hand-written tag `shopware.entity.seo_url.route` feeds a plain tagged_iterator used only as a fallback after `SeoUrlRouteRegistry`, and the resolver is absent from the generation chain |
| What triggers regeneration for a custom entity? | code lane | settled: nothing generic; the plugin must call `SeoUrlUpdater::update()` itself |
| Does `SeoUrlGenerator` still drop entities whose template renders empty? | deep code lane | settled: yes on 6.7.13.0 (`continue` at `SeoUrlGenerator.php:119-123`); the fix that yields with an error exists on trunk only |
| What sets `is_deleted`, and does a flagged row stay resolvable? | deep code lane | settled: `SeoUrlPersister::markAsDeleted()` for foreign keys that yielded no URL; a flagged row is filtered out of every read path, so it is **not** reachable |
| Is a sales-channel assignment required for generation? | deep code lane | settled: no association is needed, but at least one active non-API sales channel with a domain is; rows are always written per sales channel |
| The exact trigger of issue #19648 (tag ordering) | not settled | the code proves the throw path is reached from navigation rendering, but not that a plugin route ordinarily wins `array_first()` over core's `NavigationPageSeoUrlRoute`. Not load-bearing: it concerns core's category route, not what a plugin's own entity route must pass |
| Is `defaults: ['_seo_url' => true]` still needed on the storefront controller route? | code lane, partially | `options: ['seo' => true]` shown unread by any code; the `_seo_url` default specifically was not checked and is not part of the facts |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| Built-in `SeoUrlRoute` classes create the `seo_url` entries automatically | "will then create the respective `seo_url` entries automatically" | `developer/guides/plugins/plugins/content/seo/add-custom-seo-url.md` | no — no generic listener exists; the plugin must call `SeoUrlUpdater` |
| The class implements `SeoUrlRouteInterface` with three methods | "comes with three necessary methods" | same | yes |
| `getConfig` returns a `SeoUrlRouteConfig` from definition, route name and path (sample passes an unexplained fourth `true`) | "containing your entity's definition, the technical name of the route …" | same | partially — the fourth is `skipInvalid` and a fifth `primaryKeyParameterKey` exists, optional and unused by generation |
| `prepareCriteria` may narrow the entity set | "narrow down which entities may be used" | same | yes (the signature takes the sales channel too) |
| `getMapping` returns a `SeoUrlMapping` whose keys match the template variables | "you have to provide the data for the key `example`" | same | yes |
| Register with the tag `shopware.seo_url.route` | "registered to the container using the tag" | same | yes (also autoconfigured) |
| A `.written` subscriber must call `SeoUrlUpdater::update()` | "you then have to execute the `update` method" | same | yes |
| A `seo_url_template` row with route_name, entity_name, template is required | "An entry in the table `seo_url_template`" | same | yes — and the row with `sales_channel_id` NULL is the mandatory one |
| Deletion sets `seo_url.is_deleted = 1` rather than removing the row | "the column `is_deleted` … has to be set to `1`" | same | yes — `SeoUrlPersister::markAsDeleted()`, via a foreign key that yields no URL |
| A deleted SEO URL stays reachable, so the controller must check | "this SEO route will remain accessible" | same | **no** — every read path filters `is_deleted = 0`; the storefront 404s at routing |
| Non-DAL content uses `SeoUrlPersister::updateSeoUrls()` directly | "will then use the `SeoUrlPersister`" | same | consistent with the persister's API; the non-DAL path itself was not exercised |
| Static URLs are written into `seo_url` by a migration via `ImportTranslationsTrait` | "treat the `seo_url` table like a translation table" | same | not examined |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| The tagged route class creates `seo_url` entries automatically | Only the storefront `SeoUrlUpdateListener` wires updates, for three hardcoded indexer events; a plugin must call `SeoUrlUpdater::update()` itself | storefront `Framework/Seo/SeoUrlRoute/SeoUrlUpdateListener.php:40-74` |
| A SEO URL marked deleted remains accessible, so the controller must check that the content still exists | `is_deleted = 1` rows are excluded by every read path — `SeoResolver` (both queries), `SeoUrlPlaceholderHandler`, `AbstractUrlProvider`, `SalesChannelSeoUrlDefinition`; the request 404s before any controller runs | `Content/Seo/SeoResolver.php:70-75, :141-149` |
| `prepareCriteria(Criteria $criteria)` | The interface declares `prepareCriteria(Criteria $criteria, SalesChannelEntity $salesChannel): void` | `Content/Seo/SeoUrlRoute/SeoUrlRouteInterface.php:11-16` |
| `SeoUrlRouteConfig` is built from definition + route name + template (+ an unexplained `true`) | The fourth argument is `skipInvalid`; a fifth optional `primaryKeyParameterKey` exists, used only by `EntityRouteResolver` | `Content/Seo/SeoUrlRoute/SeoUrlRouteConfig.php:12-18, :54-61` |
| The `seo_url_template` row carries a `sales_channel_id` | The row with `sales_channel_id` NULL (the default) is the mandatory one; without it `SeoUrlUpdater` throws | `Content/Seo/SeoUrlUpdater.php:115-126` |
| `getConfig()` is part of the interface a plugin implements | It is inherited from `EntitySeoUrlRouteInterface`, which is marked `@internal` | `Content/Seo/SeoUrlRoute/EntitySeoUrlRouteInterface.php:8-13` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| Implement `SeoUrlRouteInterface` with `getConfig()` (returning a `SeoUrlRouteConfig`), `prepareCriteria(Criteria $criteria)` and `getMapping(Entity $entity, ?SalesChannelEntity $salesChannel)` (returning a `SeoUrlMapping`), and register it with the service tag `shopware.seo_url.route`. | rewritten | `prepareCriteria` takes a second `SalesChannelEntity` argument; the config's full signature (incl. `skipInvalid` and the optional `primaryKeyParameterKey`) and the router-registered route requirement are load-bearing and were missing |
| Keep URLs in sync by calling `Shopware\Core\Content\Seo\SeoUrlUpdater::update(RouteClass::ROUTE_NAME, $event->getIds())` from the entity's `<entity>.written` and `<entity>.deleted` DAL events, and add a `seo_url_template` row with `route_name`, `entity_name`, `template` and `sales_channel_id`. | rewritten | correct in substance, but the mandatory row is the **default** one with `sales_channel_id` NULL — `loadUrlTemplate()` throws `invalidTemplate('Default templates not configured')` without it |
| Deleting content does not remove the `seo_url` row — it only sets `is_deleted` to `1`, so the route stays technically reachable and the controller must still check that the content exists. | removed | code disproves the load-bearing half: `SeoResolver` filters `seo_url.is_deleted = 0` on both its queries, as do `SeoUrlPlaceholderHandler`, `AbstractUrlProvider` and `SalesChannelSeoUrlDefinition`, so a flagged row 404s at routing and no controller check is needed (`Content/Seo/SeoResolver.php:70-75, :141-149`) |
| — | added | fact 3: generation is per sales channel and requires at least one active non-API sales channel with a domain, while no sales-channel association on the entity is needed (`Content/Seo/SeoUrlUpdater.php:46-49, :95-139`) |
