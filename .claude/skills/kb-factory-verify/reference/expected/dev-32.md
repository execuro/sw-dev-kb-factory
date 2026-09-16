# `dev-32` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-32` · `dev` · `DAL` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0921-32-41` |
| Core version | `6.7.13.0` |

**Query:** How do I define a custom field set for products from my plugin so merchants can edit the values in the Administration?

**Expected answer — every fact an answer must contain:**

1. Since 6.7.13.0 a plugin declares its sets declaratively in `<plugin root>/src/Resources/config/custom-fields.xml` — `PluginLifecycleService` reads exactly that path, validates it against `System/CustomField/Schema/custom-fields-1.0.xsd` and persists it via `CustomFieldSetPersister::sync()` with `appId = null` and `extensionName = <plugin name>`; the sync runs on install and on update (update also deleting sets dropped from the XML) and uninstall removes the plugin's sets unless `keepUserData()` is set. The imperative alternative — an upsert into the `custom_field_set.repository` from a lifecycle hook — remains supported. `[code: Framework/Plugin/PluginLifecycleService.php:569-583]`
2. For the set to appear on the product detail page it must be bound to the product entity through a `custom_field_set_relation` row (`<related-entities><product/></related-entities>` in the XML, or `'relations' => [['entityName' => 'product']]` in the repository payload) and must not be `global`: the Administration loads sets filtered on `relations.entityName = 'product'`, and `sw-custom-field-set-renderer` additionally filters `global = 0`. A set without that relation is silently never fetched and never rendered. `[code: System/CustomField/Aggregate/CustomFieldSetRelation/CustomFieldSetRelationDefinition.php:45-46]` · `[code: administration/.../sw-custom-field-set-renderer/index.js:142-149]`
3. The set and field technical names and each field's type are `Immutable` — the persister omits them on update, so a later XML edit renames nothing on existing rows, and the admin disables those inputs unless the record is new. Editing values requires the `custom_field.editor` ACL privilege. Custom fields are not searchable by default (since 6.7.7.0, not 6.7.6.0); a field needs `include-in-search` / `includeInSearch = true`, and enabling it on an existing product field additionally requires a search-index rebuild because nothing re-runs the keyword indexer. `[code: System/CustomField/Xml/CustomFieldSet.php:70-98]` · `[code: System/CustomField/CustomFieldDefinition.php:53]`

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/plugins/framework/custom-field/add-custom-field.html
<!-- expected:end -->

## Evidence — code (decisive)

Source version read: `6.7.13.0`.

| fact | citation | excerpt |
| --- | --- | --- |
| A plugin declares custom field sets in an XML file; `PluginLifecycleService` reads exactly this path | `Framework/Plugin/PluginLifecycleService.php:569-571` | `$xmlFile = $pluginBaseClass->getPath() . '/Resources/config/custom-fields.xml';` |
| The file is XSD-validated and persisted with `appId = null` and `extensionName = <plugin name>` | `Framework/Plugin/PluginLifecycleService.php:581-583` | `$customFields = CustomFieldXmlLoader::load($xmlFile); $this->customFieldSetPersister->sync($customFields, null, $pluginBaseClass->getName(), $context);` |
| Loader validates against `Schema/custom-fields-1.0.xsd`, so an invalid file throws at install time | `System/CustomField/CustomFieldXmlLoader.php:15-19` | `private const XSD_FILE = __DIR__ . '/Schema/custom-fields-1.0.xsd';` |
| Sync runs on install (`deleteMissingXml=false`) and update (`true`); sets are removed on uninstall unless `keepUserData()` | `Framework/Plugin/PluginLifecycleService.php:163,252,325` | `163: syncPluginCustomFields(..., false); 252: removePluginCustomFields(...); 325: syncPluginCustomFields(..., true);` |
| The route is 6.7.13.0 — PR 15729 ships no `changelog/` entry; at its merge commit the feature sits under `# 6.7.13.0 (upcoming)` in `RELEASE_INFO-6.7.md`, and under the released `# 6.7.13.0` header in trunk | `https://raw.githubusercontent.com/shopware/shopware/cc226a48f28068d04ff39d19649d67ffdfda8848/RELEASE_INFO-6.7.md:1` | `# 6.7.13.0 (upcoming)` … `### Declarative custom fields via \`Resources/config/custom-fields.xml\`` |
| Apps use the parallel handler, which now prefers the same file over the manifest `<custom-fields>` (deprecated for v6.8.0.0) | `Framework/App/Lifecycle/Handler/CustomFieldLifecycleHandler.php:33-45` | `// Prefer Resources/config/custom-fields.xml file over inline manifest definition` |
| Plugin ownership is tracked in `custom_field_set.extension_name`; apps keep `app_id` | `System/CustomField/CustomFieldSetPersister.php:122-138` | `if ($appId !== null) { ... } elseif ($extensionName !== null) { ... WHERE extension_name = :extensionName` |
| `extension_name` is a 6.7 addition | `Migration/V6_7/Migration1780929430AddExtensionNameToCustomFieldSet.php:26-29` | `ALTER TABLE 'custom_field_set' ADD COLUMN 'extension_name' VARCHAR(255) NULL` |
| XML shape: `<custom-fields>` → `<custom-field-set>` with `<name>`, translatable `<label>`, `<related-entities>`, `<fields>`; optional `global` attribute (default false) | `System/CustomField/Schema/custom-fields-1.0.xsd:3-22` | `<xs:attribute type="xs:boolean" name="global" default="false"/>` |
| `<product/>` is an allowed `<related-entities>` child; an entity outside the enumeration fails validation | `System/CustomField/Schema/custom-fields-1.0.xsd:147-179` | `<xs:element name="product" type="empty" minOccurs="0"/>` |
| Field elements: int, float, text, text-area, bool, datetime, single-select, multi-select, single-entity-select, multi-entity-select, color-picker, media-selection, price | `System/CustomField/Schema/custom-fields-1.0.xsd:23-42` | `<xs:element name="int" type="custom-field-int-type" .../>` |
| Per-field options incl. `include-in-search` (default false) | `System/CustomField/Schema/custom-fields-1.0.xsd:43-53` | `<xs:element name="include-in-search" type="xs:boolean" minOccurs="0" default="false"/>` |
| `label`, `name`, `relatedEntities`, `fields` are mandatory beyond the XSD | `System/CustomField/Xml/CustomFieldSet.php:19-24` | `protected const REQUIRED_FIELDS = ['label','name','relatedEntities','fields',];` |
| Set name and field name/type are Immutable — later XML edits do not rename existing rows | `System/CustomField/Xml/CustomFieldSet.php:70-98` | `// custom_fields.name and custom_fields.type is immutable, thus only set if the set is new` |
| Immutable flags on the DAL definitions | `System/CustomField/Aggregate/CustomFieldSet/CustomFieldSetDefinition.php:60`; `System/CustomField/CustomFieldDefinition.php:60-61` | `(new StringField('name','name'))->addFlags(new Required(), new Immutable())` |
| Each XML field type class writes `componentName` and `customFieldType` into config (the base class adds label/helpText/customFieldPosition) | `System/CustomField/Xml/CustomFieldTypes/TextField.php:29-40` | `'config' => ['type' => 'text', 'placeholder' => …, 'componentName' => 'sw-field', 'customFieldType' => 'text',]` |
| The set↔entity link is `custom_field_set_relation` (`set_id` + `entity_name`, max 63) | `System/CustomField/Aggregate/CustomFieldSetRelation/CustomFieldSetRelationDefinition.php:45-46` | `(new StringField('entity_name','entityName', 63))->addFlags(new Required())` |
| The product detail page loads sets filtered on `relations.entityName = 'product'`; the renderer additionally filters `global = 0` — a set without that relation is never fetched | `administration/.../sw-product-detail/index.js:285-292`; `administration/.../sw-custom-field-set-renderer/index.js:142-149` | `criteria.addFilter(Criteria.equals('relations.entityName', 'product'));` / `criteria.addFilter(Criteria.equals('global', 0));` |
| Rendering never depends on `componentName`: `sw-form-field-renderer` falls back to a `type`→component map ending in `mt-text-field` | `administration/.../sw-form-field-renderer/index.js:160-170,325-356` | `return this.config.componentName \|\| this.getComponentFromType();` / `return components[type] ?? 'mt-text-field';` |
| The renderer receives a deep clone of the whole `custom_field` entity, so its `type` column reaches the `type` prop | `administration/.../sw-custom-field-set-renderer/index.js:462-495` | `const customFieldClone = Shopware.Utils.object.cloneDeep(customField);` |
| Settings > Custom fields hides only app-owned sets, so plugin sets stay listed | `administration/.../sw-settings-custom-field-set-list/index.js:74` | `criteria.addFilter(Criteria.equals('appId', null));` |
| Admin disables technical-name/type inputs unless new; editing needs `custom_field.editor` | `administration/.../sw-custom-field-set-detail-base.html.twig:16` | `:disabled="!set._isNew \|\| !acl.can('custom_field.editor') \|\| undefined"` |
| Exposure defaults on the entity, incl. `includeInSearch => false` | `System/CustomField/CustomFieldDefinition.php:48-53` | `'allowCustomerWrites' => false, 'allowCartExpose' => false, 'storeApiAware' => true, 'includeInSearch' => false,` |
| "Not searchable by default" is 6.7.7.0, not 6.7.6.0 (section under the `# 6.7.7.0` header; backing migrations 1764064756/57) | `https://raw.githubusercontent.com/shopware/shopware/trunk/RELEASE_INFO-6.7.md:3739,3760-3766` | `# 6.7.7.0` … `Custom fields are now **not searchable by default**.` |
| `includeInSearch` is only a gate: search reads `product_search_config_field.searchable`, which the keyword indexer joins; turning the flag off deletes those rows and nothing re-runs the indexer when it is turned on | `Framework/DataAbstractionLayer/Search/SearchConfigLoader.php:41-48`; `Content/Product/DataAbstractionLayer/SearchKeywordUpdater.php:371`; `Content/Product/Subscriber/CustomFieldSearchableSubscriber.php:45-73` | `product_search_config_field.searchable = 1` / `DELETE FROM product_search_config_field WHERE custom_field_id IN (:customFieldIds)` |
| Searchability is declarable from XML since 6.7.13.0 | `System/CustomField/Xml/CustomFieldTypes/CustomFieldType.php:71-73` | `if ($this->includeInSearch) { $entityArray['includeInSearch'] = true; }` |
| Admin type options the case assumes are all settable in 6.7.13.0: multi-select for `select`, date/time subtype, int/float for `number` | `administration/.../sw-custom-field-type-select/index.js:11-14,42-53`; `.../sw-custom-field-type-date/index.js:16-29`; `.../sw-custom-field-type-number/index.js:17-26,36-52` | `this.currentCustomField.config.componentName = 'sw-multi-select';` / `numberTypes: [{value:'int'},{value:'float'}]` |
| Repository route still supported: upsert set + `relations` (`entityName`) + `customFields` | `Framework/Demodata/Generator/CustomFieldGenerator.php:186,198-210` | `'relations' => $relations, 'customFields' => $attributes` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| The `Plugin` base class offers a custom-field registration hook | absent | no `CustomField`/`custom-fields` reference in `Framework/Plugin.php`; all handling is in `PluginLifecycleService` |
| Plugin sets are registered through `manifest.xml` | absent for plugins | manifest is the app path (`Framework/App/Lifecycle/Handler/CustomFieldLifecycleHandler.php:19,39`, passes an appId); plugins use `custom-fields.xml` with `appId = null` |
| A plugin must add a `custom_fields` column or DAL field first | absent | nothing in the path touches entity schema (`System/CustomField/CustomFieldSetPersister.php:109-117`) |
| A console command re-imports a plugin's `custom-fields.xml` | absent | `syncPluginCustomFields` is private, called only from install/update (`Framework/Plugin/PluginLifecycleService.php:569`) |
| A field whose config lacks `componentName`/`customFieldType` renders as nothing | absent | the only gate is `v-if="entity && customField.config"`; resolution ends in `components[type] ?? 'mt-text-field'` (`sw-form-field-renderer/index.js:355`) |
| Writing `include_in_search = 1` triggers a search-keyword reindex | absent | the only subscriber reacts solely to `includeInSearch === false` and only deletes rows (`Content/Product/Subscriber/CustomFieldSearchableSubscriber.php:45-61`) |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| Payload shape the `custom_field_set` repository accepts (set + relations + customFields in one upsert) | `Framework/Demodata/Generator/CustomFieldGenerator.php:198-210` |
| `sw-form-field-renderer` mounted with a config lacking `componentName` renders `mt-text-field` | `https://raw.githubusercontent.com/shopware/shopware/v6.7.13.0/src/Administration/…/sw-form-field-renderer.spec.js:14-26,113-129` (stripped from the vendor dist) |
| Integration coverage of the plugin `custom-fields.xml` lifecycle | shopware/shopware PR 15729: `tests/integration/Core/Framework/Plugin/PluginLifecycleServiceTest.php`, `tests/unit/Core/System/CustomField/CustomFieldXmlLoaderTest.php` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| Maintainer PR adds the declarative `Resources/config/custom-fields.xml` route loaded by `PluginLifecycleService`; `plugin:create` now scaffolds the XML stub instead of a PHP installer | 6.7 (opened 2026-03-23, merged 2026-06-24) | merged | https://github.com/shopware/shopware/pull/15729 |
| Companion PR doing the same for mail templates — a broader move to `Resources/config/*.xml` | 6.7 | merged | https://github.com/shopware/shopware/pull/15743 |
| Admin custom-field configuration UI reported broken: `multi select` not persisted, no date/time subtype choice, no int/float choice for number | 6.7.3.1 | closed | https://github.com/shopware/shopware/issues/13189 |
| Sets created via `customFieldSetRepository->create()` never appear in the Administration; no documented resolution | unclear (2022) | open | https://forum.shopware.com/t/custom-fields-are-not-showing-in-administration/93690 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Does the XML route exist and is it lifecycle-synced? | code | settled — `PluginLifecycleService.php:569-583,163,252,325` |
| Does the XSD exist and what does a product-scoped set require? | code | settled — `Schema/custom-fields-1.0.xsd:3-22,147-179`; `Xml/CustomFieldSet.php:19-24` |
| Minimal payload for the repository route | code | settled — `Framework/Demodata/Generator/CustomFieldGenerator.php:198-210` |
| Which minor introduced plugin `custom-fields.xml` | deep | settled — 6.7.13.0, from `RELEASE_INFO-6.7.md` at PR 15729's merge commit `cc226a4` |
| Does the admin render an XML-declared field, and why do repository-created sets not appear? | deep | settled — rendering never needs `componentName` (`sw-form-field-renderer/index.js:160-170,325-356`); the forum failure is a **loading** failure: no `relations.entityName = product` row, so the set is never fetched (`sw-product-detail/index.js:285-292`) |
| Do the admin type options (select multi, date/time subtype, number int/float) work in 6.7? | deep | settled — all three present in 6.7.13.0; issue 13189 closed against 12855/12343, both fixed before this tree |
| Is the "not searchable by default" pin 6.7.6.0? | deep | settled — no, 6.7.7.0 (`RELEASE_INFO-6.7.md:3739,3760-3766`) |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| From 6.7.13.0 a plugin may declare sets in `Resources/config/custom-fields.xml`; Shopware handles create/update/remove | "you can define them declaratively in a `Resources/config/custom-fields.xml` file … no `CustomFieldsInstaller` service or lifecycle hooks required." | `add-custom-field.md:217` | yes, incl. the 6.7.13.0 pin — `PluginLifecycleService.php:569-583`; `RELEASE_INFO-6.7.md` at `cc226a4` |
| File path is `<plugin root>/src/Resources/config/custom-fields.xml` | "Place the file at `<plugin root>/src/Resources/config/custom-fields.xml`:" | `add-custom-field.md:219` | yes — `getPath() . '/Resources/config/custom-fields.xml'` |
| Sync semantics: present → create/update, absent → removed, uninstall without keeping data → removed | "Sets and fields that were previously defined by your plugin but are no longer in the XML are removed." | `add-custom-field.md:223-227` | yes — `PluginLifecycleService.php:163,252,325`; `CustomFieldSetPersister.php:122-138` |
| The plugin XML format is identical to the app manifest format | "The XML format is identical to the one apps use in their manifest." | `add-custom-field.md:233` | partly — same loader and persister, but plugins pass `extensionName` and apps an `appId` |
| `<related-entities><product/></related-entities>`, types as element names, optional position/required/help-text | snippet lines 3,12-14 | `developer/snippets/config/custom-fields-standalone.xml` | yes — `Schema/custom-fields-1.0.xsd:23-53,147-179` |
| Imperative route uses the `custom_field_set.repository` service | "you have to use the custom fieldset repository … via the `custom_field_set.repository` key" | `add-custom-field.md:243` | yes — upsert shape at `CustomFieldGenerator.php:198-210` |
| Field type drives the admin control and write validation | "the Administration will use this information to display a proper field." | `add-custom-field.md:307` | yes — `sw-form-field-renderer/index.js:160-170,325-356`; XML field classes also write `componentName`/`customFieldType` (`TextField.php:29-40`) |
| From **6.7.6.0** custom fields are not searchable unless `includeInSearch = true`, and enabling it needs an index rebuild | "By default, custom fields are **not searchable**." | `add-custom-field.md:317` (pinned 6.7.6.0 at :314) | default and rebuild yes; **the version pin is wrong — 6.7.7.0** |
| `global` must be false for the set to be editable/deletable in the admin | "you need to set global to false" | `add-custom-field.md:322` | consistent on the product page — the renderer filters `global = 0` (`sw-custom-field-set-renderer/index.js:142-149`) |
| Sets bind to an entity via `relations.entityName` | "criteria.addFilter(Criteria.equals('relations.entityName', 'product'));" | `using-custom-fields.md:71-72` | yes — `CustomFieldSetRelationDefinition.php:45-46`; `sw-product-detail/index.js:285-292` |
| Custom fields store scalar values only (JSON column) | "Custom fields, therefore, can only be used to store scalar values." | `add-custom-field.md:12` | not checked |
| Creating a custom field auto-creates a snippet in all snippet sets | "it is automatically created as a snippet in all snippet sets" | merchant `custom-fields/v1-3-2-0.md:43` | not checked |

Docs-only context (intent/business, code cannot express):

- Declarative XML is the recommended default; the repository route is for runtime-created sets (`add-custom-field.md:246`).
- Names are a global namespace, so a vendor prefix is a convention (`add-custom-field.md:230`).
- Merchants find the module under Settings > System > Custom fields; values should be edited in the store's default language so inheritance applies (merchant `v1-3-2-0.md:11,13`).
- A set with no assigned area is created but unusable (merchant `v1-3-2-0.md:34`).

Internal doc inconsistencies reported by the docs lane:

- `add-custom-field.md:331` tells plugin authors to remove the set themselves on uninstall, while `:227` says Shopware does it automatically.
- The "Add custom fields to an entity" example uses `'global' => true` (`:281`) while `:322` says `global` must be false for admin editability.
- `using-custom-fields.md:22` links a prerequisite page at a path different from the framework guide.

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| "Available starting with Shopware 6.7.6.0" for custom fields not being searchable by default | the feature is documented under the `# 6.7.7.0` release section, with backing migrations timestamped 2025-11-25 | `https://raw.githubusercontent.com/shopware/shopware/trunk/RELEASE_INFO-6.7.md:3739,3760-3766` |
| The plugin XML format is "identical" to the app manifest format | the same loader/persister is shared, but plugins are persisted with `extensionName` and `appId = null` while apps pass `appId`, and the inline manifest form is deprecated for v6.8.0.0 in favour of the same file | `System/CustomField/CustomFieldSetPersister.php:122-138`; `Framework/App/Lifecycle/Handler/CustomFieldLifecycleHandler.php:33-45` |
| (round 1, now withdrawn) the XML route writes no `componentName`/`customFieldType` | the base class writes label/helpText/position, but every concrete field type class adds `componentName` and `customFieldType` on top | `System/CustomField/Xml/CustomFieldTypes/TextField.php:29-40` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| Since Shopware 6.7.13.0 a set can be declared in `<plugin root>/src/Resources/config/custom-fields.xml`, which Shopware syncs on install/update/uninstall with no `CustomFieldsInstaller` service needed; the imperative alternative creates the set through the `custom_field_set.repository` service. | rewritten | correct, but untagged and silent on the XSD validation and the `extensionName`/`keepUserData` semantics that decide whether the sync actually happens; now fact 1 with `PluginLifecycleService.php:569-583` |
| Custom field names are global and must carry a vendor prefix (e.g. `swag_example_size`) for both the set name and each field name. | removed | docs convention only — no lane found any code enforcing a prefix, and it does not decide whether merchants can edit the values. Its slot goes to the `relations.entityName = 'product'` requirement, which the deep pass shows is the actual reason a set does not appear (`sw-product-detail/index.js:285-292`) |
| Custom fields are not searchable by default since 6.7.6.0 — a field needs `includeInSearch => true` plus a search index rebuild to be picked up in search. | rewritten | the version pin is wrong: the deep pass places the change in 6.7.7.0 (`RELEASE_INFO-6.7.md:3739`). Default and rebuild requirement are confirmed and kept in fact 3 |
