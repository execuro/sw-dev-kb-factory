# `edge-06` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `edge-06` · `edge` · `Trap` |
| Version | `6.6 + 6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0959-82-91` |
| Core version | `6.7.13.0` |

**Query:** I'm coming from Magento — what are the Shopware equivalents of store views, extensions, attribute sets and `di.xml`?

**Expected answer — every fact an answer must contain:**

1. States that Shopware has no website/store/store-view hierarchy: the levels are the `sales_channel` entity (typed by `sales_channel_type`) and its `sales_channel_domain` rows, each domain carrying its own URL, language, currency and snippet set — so per-URL localisation lives on the domain, not on a separate store-view object.  `[code: System/SalesChannel/Aggregate/SalesChannelDomain/SalesChannelDomainDefinition.php:63-67]`
2. Maps a Magento module onto Shopware's two extension mechanisms: a **plugin** — a PHP Symfony bundle extending `Shopware\Core\Framework\Plugin`, discovered by the Composer package type `shopware-platform-plugin` — or an **app**, declared by a `manifest.xml` validated against `manifest-3.0.xsd` and stored as an `app` entity, shipping no PHP into the shop.  `[code: Framework/Plugin/Util/PluginFinder.php:20]`
3. States that there is no attribute-set equivalent: no `attribute_set` entity exists and a product is never assigned to one set — `custom_field_set` is bound to entity *names* through `custom_field_set_relation`, customer-facing variant/filter attributes are `property_group`/`property_group_option`, and real DAL fields are added from an extension via `EntityExtension` (abstract `getEntityName()`).  `[code: System/CustomField/Aggregate/CustomFieldSetRelation/CustomFieldSetRelationDefinition.php:19,46-47]`
4. States that no `di.xml` exists anywhere in Shopware: dependency injection is Symfony's container, each bundle auto-loading `Resources/config/services.{xml,yml,php}`, with service decoration as the analogue of Magento's preferences/interceptors.  `[code: Framework/Bundle.php:211-229]`

**Trap:** Magento terminology invites invented one-to-one mappings. Two of the four have no counterpart object at all — attribute sets and `di.xml` — and the answer must say so rather than name a look-alike.

**Official reference URL:** https://docs.shopware.com/en/migration-en/magento-upgrade-guide-shopware-6
<!-- expected:end -->

All code citations are from 6.7.13.0. The code lane did not separately re-check 6.6; no lane reports a difference between the lines for any concept cited here, and the facts avoid the one item the code lane flags as 6.7-line-specific (the Agentic Commerce sales-channel type).

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| The storefront-facing scoping unit is `sales_channel`; its type is a separate `sales_channel_type` entity | `System/SalesChannel/SalesChannelDefinition.php:72` | `final public const ENTITY_NAME = 'sales_channel';` |
| `sales_channel_domain` is one row per URL with its own language, currency and snippet set | `System/SalesChannel/Aggregate/SalesChannelDomain/SalesChannelDomainDefinition.php:63-67` | `StringField('url'…Required)`, `FkField('language_id'…)`, `FkField('currency_id'…)`, `FkField('snippet_set_id'…)` |
| A sales channel has many domains plus m:n languages and currencies | `System/SalesChannel/SalesChannelDefinition.php:141-142,168` | `OneToManyAssociationField('domains', SalesChannelDomainDefinition::class, …)` |
| Sales channel types are fixed ids: Storefront, API/headless, Product Comparison, and Agentic Commerce in this 6.7 line | `Defaults.php:27-33` | `SALES_CHANNEL_TYPE_API`, `SALES_CHANNEL_TYPE_STOREFRONT`, `SALES_CHANNEL_TYPE_PRODUCT_COMPARISON`, `SALES_CHANNEL_TYPE_AGENTIC_COMMERCE` |
| A plugin is a Symfony bundle | `Framework/Plugin.php:17` | `abstract class Plugin extends Bundle` |
| Plugins are discovered by the Composer package type | `Framework/Plugin/Util/PluginFinder.php:20` | `final public const COMPOSER_TYPE = 'shopware-platform-plugin';` |
| An app is a `manifest.xml` validated against `manifest-3.0.xsd`, stored as an `app` entity | `Framework/App/Manifest/Manifest.php:33,90-93` | `private const XSD_FILE = __DIR__ . '/Schema/manifest-3.0.xsd';` |
| A theme is a first-class entity provided by the Storefront bundle, not by core | `storefront/Theme/ThemeDefinition.php:31` | `final public const ENTITY_NAME = 'theme';` |
| Custom field sets carry name/config/active/global and an owning extension name | `System/CustomField/Aggregate/CustomFieldSet/CustomFieldSetDefinition.php:31,62-68` | `final public const ENTITY_NAME = 'custom_field_set';` |
| Custom field sets bind to entities by **name**, per entity type | `System/CustomField/Aggregate/CustomFieldSetRelation/CustomFieldSetRelationDefinition.php:19,46-47` | `StringField('entity_name', 'entityName', 63)->addFlags(new Required())` |
| Variant/filter attributes are a separate concept | `Content/Property/PropertyGroupDefinition.php:25` | `final public const ENTITY_NAME = 'property_group';` |
| Real DAL fields are added via EntityExtension, `getEntityName()` abstract | `Framework/DataAbstractionLayer/EntityExtension.php:9,18,46` | `abstract public function getEntityName(): string;` |
| Each bundle auto-loads `Resources/config/services.{xml,yml,php}` | `Framework/Bundle.php:211-229` | `foreach ($this->getServicesFilePathArray($this->getPath() . '/Resources/config/services.*') as $path) { $delegatingLoader->load($path); }` |
| Service decoration is used throughout core | `Framework/DependencyInjection/services.xml:270` | `<service id="…\Translator" decorates="translator">` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| Shopware has a `di.xml` | absent | `find` over the whole `vendor/shopware` tree returns no file named `di.xml`; the only DI formats a bundle loads are `services.xml` / `services.yml` / `services.php` under `Resources/config` (`Framework/Bundle.php:221`). |
| Shopware has a Magento-style attribute set a product is assigned to | absent | No `attribute_set` entity. Custom field sets attach to entity *names* via `custom_field_set_relation` (optionally to individual products via the `product_custom_field_set` m:n), so a product is never restricted to one set. |
| Shopware has a website / store / store-view three-level hierarchy | absent | No `website` or `store_view` entity; the only levels are `sales_channel` (typed by `sales_channel_type`) and its `sales_channel_domain` rows. |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| A storefront sales channel is created from a `typeId` plus domains — no store-view layer | `Framework/Test/Seo/StorefrontSalesChannelTestHelper.php:100` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| A Magento developer reports Shopware DI is explicit Symfony wiring, not Magento's largely-optional `di.xml` | 6.x | open | https://www.p16r.nl/2021-04-05-shopware-6-from-a-magento-perspective/ |
| Same author: Magento configurables do not map cleanly — Shopware exposes variants, not the parent | unclear | open | same |
| Shopware's Magento migration docs state the attribute-set concept has no counterpart; EAV attributes land as custom fields | 6.x | open | https://docs.shopware.com/en/migration-en/magento-upgrade-guide-shopware-6 |
| Migration docs: Magento Stores become sales channels, shop views supply the languages | 6.x | open | https://docs.shopware.com/en/migration-en/magento-migrationsprocess |
| Writers warn entity extensions and custom fields are different mechanisms and get conflated | 6.x | open | https://developer.shopware.com/docs/guides/plugins/plugins/framework/custom-field/add-custom-field.html |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Is 'store view' best mapped to SalesChannel, SalesChannelDomain or Language in 6.7? | `SalesChannelDomainDefinition.php:63-67`, `SalesChannelDefinition.php:168` | The domain row carries url + language + currency + snippet set and a sales channel has many of them — the per-URL unit is the domain. |
| In 6.7, is `getEntityName()` abstract on EntityExtension? | `Framework/DataAbstractionLayer/EntityExtension.php:46` | Yes, abstract. |
| Is 'extension' the right umbrella term — plugin, app or theme? | `Framework/Plugin/Util/PluginFinder.php:20`, `Framework/App/Manifest/Manifest.php:33`, `storefront/Theme/ThemeDefinition.php:31` | Plugin (composer type `shopware-platform-plugin`) and app (manifest.xml); theme is an entity of the Storefront bundle. |
| Does plugin service wiring live in `Resources/config/services.xml`, and is autowiring on by default? | partly settled | The loading path is settled (`Framework/Bundle.php:211-229`); the autowire/autoconfigure default was not examined. Not load-bearing — no fact claims anything about autowiring. |
| Do 6.6/6.7 still ship a declarative `Resources/config/custom-fields.xml`? | not settled | No lane examined it. Not load-bearing — no fact names a declarative custom-field format. |
| Is there a product-type discriminator column on `product` in 6.7? | not settled | No lane examined it. Not load-bearing — no fact claims anything about product types. |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| Sales channels let one instance serve multiple "stores" with their own language, currency, domains and navigation | "…so one Shopware instance can serve multiple “stores” without duplicating data." | `developer/concepts/commerce/catalog/sales-channels.md` | yes |
| Per-domain localisation is configured on sales channel domains | "`sales_channel_domain`: URL + language + currency + snippet set." | same | yes |
| Shopware offers exactly two extension types, plugins and apps | "Shopware offers two extension types: **Plugins** … **Apps**" | `developer/guides/development/extensions/index.md` | yes for the two mechanisms; code additionally shows `theme` is its own entity in the Storefront bundle |
| Apps cannot modify the database schema; plugins cannot run in Cloud | "Apps cannot modify the database schema." | same | not examined by the code lane |
| Custom fields add extra data to entities such as products, assigned per entity | "…assign them to specific entities." | `developer/guides/plugins/plugins/framework/custom-field/index.md` | yes — binding is by `entity_name` |
| Shopware's DI is Symfony's service container | "For more details, see the Symfony documentation" | `developer/guides/plugins/plugins/services/dependency-injection.md` | yes |
| Services are registered in `services.php` | "Familiarity with `services.php` is helpful" | `developer/guides/plugins/plugins/plugin-fundamentals/add-scheduled-task.md` | yes — `services.php` is one of the three loaded formats |

The docs lane also reported that a Grep for "Magento" across the clone returned no files. That Grep is not
evidence: the docs clones are gitignored, so the lane's recursive Grep returned zero matches corpus-wide.
No claim here rests on it, and the merchant-side Magento migration pages cited by the community lane
exist.

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| Two extension types, plugins and apps, themes being a stripped-down plugin | Both mechanisms exist as described; `theme` is additionally a first-class DAL entity, provided by the Storefront bundle rather than by core | `storefront/Theme/ThemeDefinition.php:31` |
| Developer docs describe no grouping construct equivalent to an attribute set | Confirmed structurally: no `attribute_set` entity; sets bind per entity name | `System/CustomField/Aggregate/CustomFieldSetRelation/CustomFieldSetRelationDefinition.php:19,46-47` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| Magento websites/store views map to **Sales channels** (types Storefront, Product comparison, Headless); Magento extensions map to plugins / the Extension Store. | rewritten | Two problems: the type list is incomplete for the 6.7 line (code shows a fourth type, Agentic Commerce), and it stops at the sales channel, where the per-URL unit carrying language/currency/snippet set is `sales_channel_domain`. "Extension Store" is a distribution channel, not an extension mechanism, and appears in no lane report; the mechanisms are plugin and app. |
| Attributes map to Properties or Custom fields and attribute sets to custom field sets; configurable products map to variants. | rewritten | Code disproves the attribute-set half: `custom_field_set` binds to entity *names* via `custom_field_set_relation`, so a product is never assigned to one set and there is no attribute-set counterpart. The configurable-product clause is dropped — it is outside the four things the query asks about and no code finding was gathered for it. |
| States that `di.xml` has no entry in the dictionary (no invented equivalent), optionally pointing at the Shopware DI guide if read. | rewritten | "No entry in the dictionary" grades the documentation, not the answer, and the "optionally … if read" clause is a tolerance clause. Code settles the real answer: no `di.xml` file exists, DI is Symfony's container loading `Resources/config/services.{xml,yml,php}`, decoration replacing preferences/interceptors. |
