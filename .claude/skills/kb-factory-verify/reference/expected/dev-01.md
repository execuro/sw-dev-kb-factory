# `dev-01` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-01` · `dev` · `DAL` |
| Version | `6.6 + 6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-11` · run `review-2026-09-11-1836` |

**Query:** How do I extend the product entity with a new association in Shopware's Data Abstraction Layer?

**Expected answer — every fact an answer must contain:**

1. The extension class extends the abstract class `Shopware\Core\Framework\DataAbstractionLayer\EntityExtension` and adds the association by overriding the non-abstract hook `extendFields(FieldCollection $collection): void`. In 6.7 the single abstract method — the only mandatory implementation — is `getEntityName(): string`, returning the entity name (e.g. `ProductDefinition::ENTITY_NAME`); `getDefinitionClass()` does not exist in 6.7. In 6.6 the abstract method is still `getDefinitionClass(): string` returning `ProductDefinition::class`, deprecated for removal in 6.7, while `getEntityName()` is non-abstract and optional — a class implementing both works on both versions. `[code: Framework/DataAbstractionLayer/EntityExtension.php:46, :18; 6.6 at v6.6.10.0 src/Core/Framework/DataAbstractionLayer/EntityExtension.php]`
2. An extension may only add association-shaped fields: `AssociationField` of any kind, a `Runtime`-flagged field, a `ReferenceVersionField`, or an `FkField` whose companion `ManyToOne`/`OneToOne` association is added by the same extension — anything else throws `Only AssociationFields, FkFields/ReferenceVersionFields for a ManyToOneAssociationField or fields flagged as Runtime can be added as Extension.` The new data therefore lives in its own `EntityDefinition` (registered with the tag `shopware.entity.definition`), linked by e.g. a `OneToOneAssociationField` added in `extendFields()`; scalar values belong in custom fields, not in an extension. The framework stamps every extension field with the `Extension` flag, so the data is read back as `$entity->getExtension('name')`, and the association is not autoloaded unless requested via `addAssociation('name')` or `addAssociation('extensions.name')`. `[code: Framework/DataAbstractionLayer/EntityDefinition.php:160, Framework/DataAbstractionLayer/DataAbstractionLayerException.php:1241, Framework/DataAbstractionLayer/Dbal/EntityHydrator.php:220, Framework/DataAbstractionLayer/Search/Criteria.php:246]`
3. The service is registered with the tag `shopware.entity.extension` (Symfony autoconfiguration applies it to every `EntityExtension` subclass; core tags explicitly anyway). The multi-entity variant is the separate abstract class `BulkEntityExtension` — single abstract method `collect(): \Generator` yielding `entityName => list<Field>`, final empty constructor, tagged `shopware.bulk.entity.extension` — present in both 6.6.10.0 and 6.7. The tags are consumed differently: in 6.7 at container-build time by `SalesChannelEntityCompilerPass`, where an unknown entity name aborts the build with `definitionNotFound`; in 6.6 at boot by `ExtensionRegistry`, where an unknown entity/definition is silently skipped. `[code: Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:72, :76; Framework/DataAbstractionLayer/BulkEntityExtension.php:9; System/DependencyInjection/CompilerPass/SalesChannelEntityCompilerPass.php:232, :241; 6.6 at v6.6.10.0 src/Core/Framework/DataAbstractionLayer/ExtensionRegistry.php]`

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/add-complex-data-to-existing-entities.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| Installed core is 6.7.13.0 | `vendor/composer/installed.php:909` | `'pretty_version' => 'v6.7.13.0',` |
| The base class is an abstract class, not an interface | `Framework/DataAbstractionLayer/EntityExtension.php:9` | `abstract class EntityExtension` |
| `getEntityName(): string` is the only abstract method in 6.7 | `Framework/DataAbstractionLayer/EntityExtension.php:46` | `abstract public function getEntityName(): string;` |
| `extendFields()` is a non-abstract empty hook | `Framework/DataAbstractionLayer/EntityExtension.php:18` | `public function extendFields(FieldCollection $collection): void\n{\n}` |
| 6.7 adds optional `modifyFields()`, modify-only | `Framework/DataAbstractionLayer/EntityExtension.php:33` | `public function modifyFields(FieldCollection $collection): void` |
| `modifyFields()` is non-additive by construction (throwaway collection) | `Framework/DataAbstractionLayer/EntityDefinition.php:212` | `$extension->modifyFields(new FieldCollection($fields));` |
| Third hook `extendProtections()` | `Framework/DataAbstractionLayer/EntityExtension.php:42` | `public function extendProtections(EntityProtectionCollection $protections): void` |
| The tag `shopware.entity.extension` is auto-applied by autoconfiguration | `Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:72` | `->registerForAutoconfiguration(EntityExtension::class)->addTag('shopware.entity.extension');` |
| The bulk tag `shopware.bulk.entity.extension` likewise | `Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:76` | `->registerForAutoconfiguration(BulkEntityExtension::class)->addTag('shopware.bulk.entity.extension');` |
| Autoconfigure pass runs before the consuming pass | `Framework/Framework.php:141` | `addCompilerPass(new AutoconfigureCompilerPass(), PassConfig::TYPE_BEFORE_OPTIMIZATION, 1000);` |
| `SalesChannelEntityCompilerPass` is the only consumer of the tag in 6.7 | `System/DependencyInjection/CompilerPass/SalesChannelEntityCompilerPass.php:232` | `foreach ($container->findTaggedServiceIds('shopware.entity.extension') as $id => $tags) {` |
| That pass is registered unconditionally by the System bundle | `System/System.php:62` | `$container->addCompilerPass(new SalesChannelEntityCompilerPass());` |
| The pass instantiates the class without its constructor | `System/DependencyInjection/CompilerPass/SalesChannelEntityCompilerPass.php:239` | `(new \ReflectionClass($className))->newInstanceWithoutConstructor();` |
| An entity name matching no `shopware.entity.definition` service is a hard build error | `System/DependencyInjection/CompilerPass/SalesChannelEntityCompilerPass.php:241` | `throw DependencyInjectionException::definitionNotFound($classObject->getEntityName());` |
| Registration appends `addExtension()` to the base and sales-channel definitions | `System/DependencyInjection/CompilerPass/SalesChannelEntityCompilerPass.php:249` | `$definition->addMethodCall('addExtension', [new Reference($id)]);` |
| `addExtension()` is final and invalidates the field cache | `Framework/DataAbstractionLayer/EntityDefinition.php:91` | `final public function addExtension(EntityExtension $extension): void` |
| `BulkEntityExtension`: final empty constructor, abstract `collect(): \Generator` | `Framework/DataAbstractionLayer/BulkEntityExtension.php:9` | `abstract public function collect(): \Generator;` |
| Bulk tag consumed in the same pass | `System/DependencyInjection/CompilerPass/SalesChannelEntityCompilerPass.php:265` | `foreach ($container->findTaggedServiceIds('shopware.bulk.entity.extension') as $id => $tags) {` |
| `collect()` is called at build time; unknown entity throws | `System/DependencyInjection/CompilerPass/SalesChannelEntityCompilerPass.php:274` | `throw DependencyInjectionException::definitionNotFound($entity);` |
| `FilteredBulkEntityExtension` adapts bulk to per-entity | `Framework/DataAbstractionLayer/FilteredBulkEntityExtension.php:13` | `class FilteredBulkEntityExtension extends EntityExtension` |
| In-core bulk example yields fields for two entities | `Framework/Notification/NotificationBulkEntityExtension.php:19` | `yield IntegrationDefinition::ENTITY_NAME => [ new OneToManyAssociationField(...) ];` |
| …registered by explicit XML tag | `Framework/DependencyInjection/notification.xml:7` | `<tag name="shopware.bulk.entity.extension"/>` |
| Legal field types are enforced in `getFields()`; `extendFields()` receives a fresh empty collection | `Framework/DataAbstractionLayer/EntityDefinition.php:160` | `$new = new FieldCollection(); $extension->extendFields($new); … throw DataAbstractionLayerException::wrongFieldTypeForExtension();` |
| The `Extension` flag is added by the framework, not the developer | `Framework/DataAbstractionLayer/Field/Flag/Extension.php:7` | `Defines that the data of this field is stored in an Entity::$extension …` |
| Exact error text for an illegal scalar extension field | `Framework/DataAbstractionLayer/DataAbstractionLayerException.php:1241` | `'Only AssociationFields, FkFields/ReferenceVersionFields for a ManyToOneAssociationField or fields flagged as Runtime can be added as Extension.'` |
| An `FkField`'s companion association must come from the same extension | `Framework/DataAbstractionLayer/EntityDefinition.php:473` | `private function hasAssociationWithStorageName(string $storageName, FieldCollection $new): bool` |
| Error text for an `FkField` without companion association | `Framework/DataAbstractionLayer/DataAbstractionLayerException.php:1231` | `'FkField {{ foreignKeyName }} has no configured OneToOneAssociationField or ManyToOneAssociationField …'` |
| `Runtime` is the escape hatch for non-persisted extension data | `Framework/DataAbstractionLayer/Field/Flag/Runtime.php:7` | `Defines that the data of the field will be loaded at runtime by an event subscriber …` |
| To-one data is routed into the extensions bag | `Framework/DataAbstractionLayer/Dbal/EntityHydrator.php:220` | `if ($field->is(Extension::class)) { … $entity->addExtension($property, $association); }` |
| To-many data likewise | `Framework/DataAbstractionLayer/Dbal/EntityReader.php:677` | `$entity->addExtension($association->getPropertyName(), $structData);` |
| Read access is `getExtension()` from `ExtendableTrait` | `Framework/Struct/ExtendableTrait.php:51` | `public function getExtension(string $name): ?Struct` |
| Criteria accepts both `'myAssoc'` and `'extensions.myAssoc'` | `Framework/DataAbstractionLayer/Search/Criteria.php:246` | `if ($part === 'extensions') { continue; }` |
| Same skip in SQL accessor resolution | `Framework/DataAbstractionLayer/Dbal/EntityDefinitionQueryHelper.php:116` | `if ($part === 'extensions') { continue; }` |
| Write payload may nest under `'extensions'` | `Framework/DataAbstractionLayer/Write/WriteCommandExtractor.php:124` | `if ($property === 'extensions') {` |
| JSON:API emits extensions as a separate relationship record | `Framework/Api/Serializer/JsonApiEncoder.php:258` | `$serialized->addRelationship('extensions', [...]);` |
| Real plugin-shaped in-core example on `order` | `Content/ProductExport/Tracking/Extension/OrderSalesChannelTrackingExtension.php:16` | `class OrderSalesChannelTrackingExtension extends EntityExtension { … return OrderDefinition::ENTITY_NAME; }` |
| …registered by explicit tag in a PHP DI file | `Content/DependencyInjection/product_export_tracking.php:26` | `->tag('shopware.entity.extension');` |
| Extension fields can carry ordinary flags (`CascadeDelete`, `Inherited`) | `Framework/Test/DataAbstractionLayer/Field/TestDefinition/OneToOneInheritedProductExtension.php:19` | `->addFlags(new CascadeDelete(), new Inherited())` |
| Deactivating a plugin strips its extensions by namespace | `Framework/Plugin/PluginLifecycleService.php:709` | `$definition->removeExtensions($pluginNamespace);` |
| 6.6: `getDefinitionClass()` abstract, deprecated for 6.7; `getEntityName()` non-abstract | `github v6.6.10.0 src/Core/Framework/DataAbstractionLayer/EntityExtension.php` | `@deprecated tag:v6.7.0 … abstract public function getDefinitionClass(): string;` |
| 6.6: `modifyFields()` does not exist | `github v6.6.10.0 src/Core/Framework/DataAbstractionLayer/EntityExtension.php` | class has only `extendFields`, `extendProtections`, `getDefinitionClass`, `getEntityName` |
| 6.6: tags consumed at runtime by `ExtensionRegistry` from `Framework::boot()`, flag-gated | `github v6.6.10.0 src/Core/Framework/Framework.php` | `if (!Feature::isActive('v6.7.0.0')) { … ExtensionRegistry … configureExtensions(...) }` |
| 6.6: `ExtensionRegistry` receives both tags as tagged iterators | `github v6.6.10.0 src/Core/Framework/DependencyInjection/data-abstraction-layer.xml` | `<argument type="tagged_iterator" tag="shopware.entity.extension"/>` |
| 6.6: entity-name path preferred, `getDefinitionClass()` fallback | `github v6.6.10.0 src/Core/Framework/DataAbstractionLayer/ExtensionRegistry.php` | `if (!empty($extension->getEntityName())) { … } $class = $extension->getDefinitionClass();` |
| 6.6: unknown definition is silently skipped (opposite of 6.7) | `github v6.6.10.0 src/Core/Framework/DataAbstractionLayer/ExtensionRegistry.php` | `catch (DefinitionNotFoundException) { return; }` |
| 6.6: the 6.7-style compiler pass exists but is feature-flag gated | `github v6.6.10.0 src/Core/System/DependencyInjection/CompilerPass/SalesChannelEntityCompilerPass.php` | `if (Feature::isActive('v6.7.0.0')) { $this->addExtensions(...); }` |
| 6.6: `BulkEntityExtension` already exists, identical in shape | `github v6.6.10.0 src/Core/Framework/DataAbstractionLayer/BulkEntityExtension.php` | `abstract public function collect(): \Generator;` |
| 6.6: bulk extensions were wrapped in an anonymous `EntityExtension` supplying `getDefinitionClass()` | `github v6.6.10.0 src/Core/Framework/DataAbstractionLayer/ExtensionRegistry.php` | `return new class($fields, $definition->getClass(), $entity) extends EntityExtension { … }` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| `EntityExtension::getDefinitionClass()` names the extended entity (6.5/6.6 idiom) | absent in 6.7 | 6.7.13.0 declares only `extendFields`, `modifyFields`, `extendProtections`, abstract `getEntityName`; grep for `getDefinitionClass` returns only the unrelated private `DefinitionInstanceRegistry::getDefinitionClassByEntityName()`. `Framework/DataAbstractionLayer/EntityExtension.php:46` |
| `ExtensionRegistry` attaches entity extensions at boot | absent in 6.7 | `grep -rn 'ExtensionRegistry'` over `vendor/shopware/core` returns nothing; replaced by `SalesChannelEntityCompilerPass::addExtensions()` (`:219`) |
| An entity-extension tag exists that nothing reads | not a finding — both tags are consumed | `shopware.entity.extension` at `SalesChannelEntityCompilerPass.php:232`, `shopware.bulk.entity.extension` at `:265` |
| An existing entity can be extended with a PHP attribute (`#[Entity]`-style) | absent | `Framework/DataAbstractionLayer/Attribute/` contains no extension attribute; no `EntityExtension` hit in `Attribute/` or `AttributeEntityCompiler.php` |
| A plain scalar field can be added by an `EntityExtension` | absent / rejected at runtime | `EntityDefinition::getFields()` throws `wrongFieldTypeForExtension()` (`EntityDefinition.php:185`) |
| Extension data is exposed as a normal getter on the core entity class | absent | Hydrator and reader call `$entity->addExtension(...)`; access is `ExtendableTrait::getExtension($name)` (`Dbal/EntityHydrator.php:220`) |
| `modifyFields()` can remove a field | absent by design | docblock at `EntityExtension.php:24`; `EntityDefinition` hands it a throwaway `FieldCollection` |
| A `BulkEntityExtension` can take constructor dependencies | absent | final empty constructor (`BulkEntityExtension.php:14`); built via `newInstanceWithoutConstructor()` |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| A scalar extension field is rejected with the exact message | `github v6.7.1.0 tests/integration/Core/Framework/DataAbstractionLayer/EntityExtensionTest.php` (`testICantAddScalarExtensions`) |
| Runtime, `FkField`, association and `ReferenceVersion` extensions are accepted | same file (`testICanAddRuntimeExtensions`, `testICanAddFkFieldsAsExtensions`, `testICanAddAssociationExtensions`) |
| `modifyFields()` can neither add nor remove fields | same file (`testICantAddOrRemoveFieldsByModifyFields`) |
| The DB column must exist first; data read back via `hasExtension`/`getExtension` | same file (`ALTER TABLE product ADD COLUMN my_tax_id …`) |
| Write payload works top-level and nested under `extensions` | same file (`$data['extensions']['myPrices'] = …`) |
| The extension association is not autoloaded; must be requested as `'myPrices'` or `'extensions.myPrices'` | same file |
| Test helper attaching an extension to a definition | `Framework/Test/DataAbstractionLayer/Field/DataAbstractionLayerFieldTestBehaviour.php:127` |
| Canonical fixture: product extension adding OneToOne + OneToMany | `Framework/Test/DataAbstractionLayer/Field/TestDefinition/ProductExtension.php:18` |
| Canonical fixture: `FkField` + companion `ManyToOneAssociationField` together | `Framework/Test/DataAbstractionLayer/Field/TestDefinition/ToOneProductExtension.php:18` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| Maintainer mitelg: the `EntityExtension` abstract-method change was missing from the upgrade guide | 6.7 | closed | https://github.com/shopware/shopware/pull/7668 |
| Draft PR `remove! implementations of EntityExtension::getDefinitionClass` | 6.7 | closed | https://github.com/shopware/shopware/pull/6742 |
| Third-party migration write-up: `getEntityName optional -> abstract (required)` | 6.7 | open | https://www.xictron.com/en/blog/shopware-plugins-6-7-migration-symfony-vite-2026/ |
| Extension on an attribute-based entity threw `Definition does not exist`; fixed by #8385 | 6.7 | closed | https://github.com/shopware/shopware/issues/8393 |
| `modifyFields()` added because `extendFields()` always receives an empty field list | 6.7 | merged | https://github.com/shopware/shopware/pull/10531 |
| `modifyFields()` extended to grow JsonField mapping (6.7.15.0) | 6.7 | merged | https://github.com/shopware/shopware/pull/19665 |
| `Inherited()` ManyToOne extension on product generates invalid SQL; needs extra property-named column | 6.6 | closed | https://github.com/shopware/shopware/issues/7181 |
| ManyToMany custom entity no longer loaded for variants | 6.6 | closed | https://github.com/shopware/shopware/issues/6987 |
| Reproducer: OneToOne extension not inherited by variants | unclear | open | https://github.com/sgoetzie/Shopware6OneToOneExtensionInheritanceDemo |
| Extension association lands under `entity.extensions.<assoc>`, breaking Admin validation bubbling | 6.6 | merged | https://github.com/shopware/shopware/pull/9454 |
| `BulkEntityExtension` proposal (this PR closed unmerged) | unclear | closed | https://github.com/shopware/shopware/pull/5363 |
| `dal:validate` crashes on missing `ENTITY_NAME` constant | 6.7 | closed | https://github.com/shopware/shopware/issues/19725 |
| Docs issue: associating two existing entities is not covered by the guide | unclear | closed | https://github.com/shopware/docs/issues/1100 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Does `getDefinitionClass()` still exist in 6.7; is `getEntityName()` abstract? | code | `getDefinitionClass()` absent; `getEntityName()` is the sole abstract method (`EntityExtension.php:46`) |
| Is `getEntityName()` present and optional in 6.6? | code (v6.6.10.0) | Yes — non-abstract with a deprecation trigger; `getDefinitionClass()` is the abstract one |
| What happens to a 6.6-era extension implementing only `getDefinitionClass()` on 6.7? | code | It does not satisfy the abstract `getEntityName()`; the 6.6 idiom cannot be loaded as-is on 6.7 |
| Does `modifyFields()` exist in 6.7 and not in 6.6; does `extendFields()` receive an empty collection? | code | Yes to both — `EntityExtension.php:33`, `EntityDefinition.php:212`, and `EntityDefinition.php:160` creates `new FieldCollection()` per extension |
| Does `BulkEntityExtension` exist in 6.6 and 6.7; is its tag different? | code | Exists in both, byte-identical in shape; tag `shopware.bulk.entity.extension` is distinct |
| Exact DI tag, and is an explicit tag required? | code | `shopware.entity.extension`; autoconfiguration applies it to every subclass (`AutoconfigureCompilerPass.php:72`), core tags explicitly anyway |
| Which pass/registry consumes the tags and when? | code | 6.7: `SalesChannelEntityCompilerPass` at build time (unknown name = hard error); 6.6: `ExtensionRegistry` at boot (unknown name silently skipped) |
| Is extension-association data returned without `addAssociation()`? | code (test anchor) | No — it must be requested, via `'name'` or `'extensions.name'` |
| Does adding an association need a migration column, and the extra property-named column for inheritance? | not settled | Not material: the expected-answer facts do not turn on the inheritance column; the code lane did not read `InheritanceUpdater` |
| Does `Inherited()` on a ManyToOne extension still emit `Unknown column product.<property>`? | not settled | Not material to the facts; a community report may never decide it |
| Can an `EntityExtension` extend an attribute-defined entity at this patch level? | not settled | Not material: the query targets `product`, a classic `EntityDefinition` entity |
| Does the new definition need an `ENTITY_NAME` constant? | not settled | Not material: it concerns `dal:validate`/PHPStan on the plugin's own definition, not the extension contract |
| Where does the extension association appear on the loaded entity? | code | Under the extensions bag: `$entity->getExtension('name')` (`EntityHydrator.php:220`, `ExtendableTrait.php:51`) |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| The base class forces implementing `getDefinitionClass`, pointing at `ProductDefinition` | "Our class needs to extend from the abstract `…EntityExtension` class, which forces you to implement the `getDefinitionClass` method." | `…/data-handling/add-complex-data-to-existing-entities.md:26` | No — contradicted for 6.7; true for 6.6 |
| New fields are added by overriding `extendFields` | "You add new fields by overriding the method `extendFields`…" | same file `:28` | Yes — `EntityExtension.php:18`, `EntityDefinition.php:160` |
| The sample's two methods are `extendFields()` and `getDefinitionClass(): string` | `class CustomExtension extends EntityExtension { … getDefinitionClass() … }` | same file `:42-55` | Partly — `extendFields` yes; `getDefinitionClass` absent in 6.7 |
| The extension is tagged `shopware.entity.extension` in `services.php` | `->tag('shopware.entity.extension');` | same file `:72-73` | Yes — `AutoconfigureCompilerPass.php:72`, `SalesChannelEntityCompilerPass.php:232` |
| The `product` table must not gain a column; add a new table joined OneToOne | "Since you must not extend the `product` table with a new column…" | same file `:79` | Consistent — scalar extension fields are rejected (`EntityDefinition.php:160`) |
| The example adds a `OneToOneAssociationField` with `autoload` true plus `CascadeDelete` | `(new OneToOneAssociationField('exampleExtension', 'id', 'product_id', …, true))->addFlags(new CascadeDelete())` | same file `:98-100` | Yes for shape and flags — `OneToOneInheritedProductExtension.php:19`, `ProductExtension.php:18` |
| `OneToOneAssociationField` parameter order and meanings | propertyName, storageName, referenceField, referenceClass, autoload | same file `:112-116` | Consistent with in-core fixtures |
| `CascadeDelete` associations are considered in the clone process | "Associations marked with the `CascadeDelete` flag are considered in the clone process." | same file `:118-119` | Not examined by the code lane |
| The new definition is tagged `shopware.entity.definition` with an `entity` attribute | `->tag('shopware.entity.definition', ['entity' => 'swag_example_extension']);` | same file `:199-200` | Yes — the entity-name map is built from that tag; a miss throws `definitionNotFound` (`SalesChannelEntityCompilerPass.php:241`) |
| Inverse side: `FkField`, `ReferenceVersionField` (versioned entities only), inverse `OneToOneAssociationField` | see quote | same file `:163-167` | Consistent — `ToOneProductExtension.php:18` |
| Parameter order is reversed on the inverse side and matters | "…the other way around. This order is important." | same file `:179` | Not examined |
| A migration must create the table, with unique + composite FK constraints | see quote | same file `:235-236` | Not examined (test anchor shows the column must exist first) |
| FK constraints recommended even though associations handle loading | see quote | same file `:246` | Not examined |
| The association is written through the extended entity's repository under the extension property | `'exampleExtension' => ['customString' => 'foo bar']` | same file `:255-260` | Yes — `WriteCommandExtractor.php:124` also accepts the nested `extensions` form |
| Field without a table: attach at runtime via the loaded event and `addExtension`, value must be a struct | see quote | same file `:302-304` | Yes — `Flag/Runtime.php:7`, `ExtendableTrait.php:51` (`?Struct`) |
| `BulkEntityExtension` since 6.6.10.0, `collect(): \Generator`, tag `shopware.bulk.entity.extension` | see quote | same file `:329-333`, `:361` | Yes — `BulkEntityExtension.php:9`, `AutoconfigureCompilerPass.php:76` |
| The caching guide's sample implements `getEntityName(): string` returning `RuleDefinition::ENTITY_NAME` | see quote | `…/framework/caching/index.md:166-173` | Yes — this is the 6.7-correct form |
| B2B guide: attribute entities have no definition class, so reference by entity-name string | see quote | `…/b2b-components/organization-unit/guides/extending-organization-entity.md:17` | Consistent with `getEntityName()`; the attribute-entity extension path itself was not examined |
| 6.6.10.0 release notes: `getDefinitionClass` deprecated, replaced by `getEntityName` | see quote | `developer.shopware.com/release-notes/6.6/6.6.10.0.html` | Yes — the 6.6.10.0 class carries `@deprecated tag:v6.7.0` |
| 6.7.0.0 release notes list "Change in entity extensions" without elaboration | "Change in entity extensions" | `developer.shopware.com/release-notes/6.7/6.7.0.0.html` | n/a |
| `autoload` true on both extension and definition causes recursion / OOM | see quote | `…/data-handling/add-data-associations.md:119` | Not examined by the code lane |
| Elasticsearch guide: extension fields need `ApiAware` to be searchable; Runtime fields are not; sample uses `getDefinitionClass` | see quote | `…/elasticsearch/add-product-entity-extension-to-elasticsearch.md:83-94` | Partly — `getDefinitionClass` absent in 6.7; the searchability claim was not examined |
| Flags reference: `Runtime` = loaded at runtime; `Extension` = stored in `Entity::$extension` | see quote | `…/dal-reference/flags-reference.md:19` | Yes — `Flag/Extension.php:7`, `Flag/Runtime.php:7` |
| Field flags can be modified from an entity extension | see quote | `…/data-handling/using-flags.md:22` | Yes in 6.7 via `modifyFields()`; not possible in 6.6 |
| Custom fields hold scalars only; associations need an entity extension | see quote | `…/custom-field/add-custom-field.md:12` | Consistent — scalar extension fields throw |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| The canonical guide (live-labelled v6.7 stable) states `EntityExtension` "forces you to implement the `getDefinitionClass` method" and all its samples implement it | `getDefinitionClass()` does not exist in 6.7; the sole abstract method is `getEntityName(): string`. The guide's sample class cannot be instantiated on 6.7 | `Framework/DataAbstractionLayer/EntityExtension.php:46` vs `add-complex-data-to-existing-entities.md:26,42-55` |
| The guide carries no deprecation notice for `getDefinitionClass`, while the 6.6.10.0 release notes deprecate it | 6.6.10.0 declares `@deprecated tag:v6.7.0 - Implement getEntityName instead`; 6.7 removed it | `github v6.6.10.0 …/EntityExtension.php` |
| The docs clone answers nowhere whether `getDefinitionClass` survives into 6.7 (the 6.7.0.0 notes say only "Change in entity extensions") | Removed; the 6.7 wiring moved from `ExtensionRegistry` at boot to `SalesChannelEntityCompilerPass` at container build | `System/DependencyInjection/CompilerPass/SalesChannelEntityCompilerPass.php:232` |
| The Elasticsearch guide's extension sample also implements `getDefinitionClass` | Same removal applies | `Framework/DataAbstractionLayer/EntityExtension.php:46` |
| The guide documents `extendFields` as the only field hook | 6.7 also has `modifyFields()` (modify-only) and `extendProtections()` | `Framework/DataAbstractionLayer/EntityExtension.php:33,42` |
| Docs describe the tag as something you write in `services.php` | True, but Symfony autoconfiguration already applies both tags to every subclass | `Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:72,76` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| Extend `Shopware\Core\Framework\DataAbstractionLayer\EntityExtension` and implement `extendFields(FieldCollection $collection)`; the extended entity is named by `getDefinitionClass()` (what the page shows) — an answer that also states that `getDefinitionClass()` is deprecated since 6.6.10 and `getEntityName()` is abstract in 6.7 is the best answer, an answer with only `getDefinitionClass()` is still accepted (known documentation defect, see the preamble). | removed, replaced by new fact 1 | Code shows `getDefinitionClass()` does not exist in 6.7 (`EntityExtension.php:46`), so the fact taught the wrong method for half the version pin, and the tolerance clause explicitly rewarded the wrong answer |
| The new data lives in its own `EntityDefinition` (tagged `shopware.entity.definition`) linked through an association field added in `extendFields()`, e.g. `OneToOneAssociationField` with the `CascadeDelete` flag; scalar values belong in custom fields, not in an extension. | amended into new fact 2 | Correct as far as it went; code adds the enforced rule set and error message (`EntityDefinition.php:160`, `DataAbstractionLayerException.php:1241`) and the access path `$entity->getExtension()` plus the non-autoload requirement, all load-bearing for a usable answer |
| The extension is registered with the service tag `shopware.entity.extension` (bulk variant since 6.6.10: `BulkEntityExtension` tagged `shopware.bulk.entity.extension`). | amended into new fact 3 | Tags confirmed; added `collect(): \Generator` as the bulk contract and the 6.6-vs-6.7 consumption difference (boot-time silent skip vs. build-time hard error), which decides how a wrong entity name is diagnosed |
| — | added to fact 1 | `getEntityName(): string` is the single mandatory abstract method in 6.7 (`EntityExtension.php:46`) |
