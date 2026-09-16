# `dev-51` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-51` · `dev` · `DAL` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0921-42-51` |
| Core version | `6.7.13.0` |

**Query:** Custom entities declared in `Resources/config/entities.xml` no longer work for my plugin in Shopware 6.7 — how do I define and register a DAL entity with PHP attributes instead?

**Expected answer — every fact an answer must contain:**

1. The entity is a plain class extending `Shopware\Core\Framework\DataAbstractionLayer\Entity` and carrying the class attribute `#[Entity('example_entity')]` from `Shopware\Core\Framework\DataAbstractionLayer\Attribute\` (first parameter `name` required; optional `parent`, `since`, `collectionClass`, `hydratorClass`, `inheritanceAware`); fields are typed public properties with `#[Field(type: FieldType::…)]` plus modifier attributes such as `#[PrimaryKey]`, `#[Required]`, `#[Translations]`, and no `EntityDefinition` subclass is written — the definition is derived by reflection at container-compile time.  `[code: Framework/DataAbstractionLayer/Attribute/Entity.php:10-32]` `[code: Framework/DataAbstractionLayer/AttributeEntityCompiler.php:141-184]`
2. Registration is the DI tag `shopware.entity` on the entity class service (added automatically by autoconfiguration for classes carrying `#[Entity]`); `AttributeEntityCompilerPass` then synthesises `<entity_name>.definition` (an `AttributeEntityDefinition` tagged `shopware.entity.definition`), `<entity_name>.repository`, and the translation/mapping definitions.  `[code: Framework/DependencyInjection/CompilerPass/AttributeEntityCompilerPass.php:31-72]` `[code: Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:51-54]`
3. Attribute entities do **not** create their database table: the plugin must ship a `MigrationStep` with the `CREATE TABLE` statement (and the `_translation` table for translated fields), exactly as core does for its own attribute entities.  `[code: Migration/V6_7/Migration1742199549MeasurementSystemTable.php:32-42]`

**Trap:** The premise is wrong twice over. `entities.xml` still exists in 6.7 as the Custom Entity feature, but it is read from `Resources/entities.xml` — never `Resources/config/entities.xml` — and only for apps: `CustomEntityLifecycleService` exposes only `updateApp(AppEntity)` and the plugin lifecycle never calls it. The classic `EntityDefinition` + `shopware.entity.definition` route is also still fully supported and is not deprecated by the attribute API.

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/entities-via-attributes.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| `#[Entity]` is a class attribute: name + parent, since, collectionClass, hydratorClass, inheritanceAware | `Framework/DataAbstractionLayer/Attribute/Entity.php:10-32` | `#[\Attribute(\Attribute::TARGET_CLASS)] final class Entity { public function __construct(public string $name, public ?string $parent = null, public ?string $since = null, public string $collectionClass = EntityCollection::class, public string $hydratorClass = EntityHydrator::class, public bool $inheritanceAware = false,) {} }` |
| `#[Field]` is a property attribute; `api` defaults to `false` (`bool|array`) | `Framework/DataAbstractionLayer/Attribute/Field.php:13-28` | `#[\Attribute(\Attribute::TARGET_PROPERTY)] class Field { public function __construct(public string $type, public bool $translated = false, public bool|array $api = false, public ?string $column = null, public int $maxLength = 255,) {} }` |
| Supported scalar types | `Framework/DataAbstractionLayer/Attribute/FieldType.php:8-23` | `enum FieldType: string { public const UUID = 'uuid'; public const STRING = 'string'; … public const PRICE = 'price'; }` |
| Full attribute set in 6.7 | `Framework/DataAbstractionLayer/Attribute/` (directory listing) | AllowEmptyString, AllowHtml, AutoIncrement, CustomFields, Entity, Field, FieldType, ForeignKey, Inherited, ListField, ManyToMany, ManyToOne, OnDelete, OneToMany, OneToOne, Password, PrimaryKey, Protection, ReferenceVersion, Required, ReverseInherited, SearchRanking, Serialized, State, Translations, Version |
| Definition derived by reflection; class must extend the `Entity` struct | `Framework/DataAbstractionLayer/AttributeEntityCompiler.php:141-184` | `$reflection = new \ReflectionClass($class); $collection = $reflection->getAttributes(Entity::class); … 'entity_class' => $class, 'entity_name' => $instance->name,` |
| `shopware.entity` tag drives definition/repository generation | `Framework/DependencyInjection/CompilerPass/AttributeEntityCompilerPass.php:31-72` | `$services = $container->findTaggedServiceIds('shopware.entity'); … $definition->addTag('shopware.entity.definition'); $container->setDefinition($entity . '.definition', $definition);` |
| The tag is applied by autoconfiguration from the attribute itself | `Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:51-54` | `->registerAttributeForAutoconfiguration(Entity::class, static function (ChildDefinition $definition): void { $definition->addTag('shopware.entity'); });` |
| Pass ordering | `Framework/Framework.php:122` | `$container->addCompilerPass(new AttributeEntityCompilerPass(new AttributeEntityCompiler()), PassConfig::TYPE_BEFORE_OPTIMIZATION, 99);` |
| Core reference registration (the shape a plugin's services.xml needs) | `Content/DependencyInjection/measurement_system.xml:7-13` | `<service id="Shopware\Core\Content\MeasurementSystem\DataAbstractionLayer\MeasurementSystemEntity"><tag name="shopware.entity"/></service>` |
| Complete core example incl. translated fields, OneToMany, Translations, CustomFields | `Content/MeasurementSystem/DataAbstractionLayer/MeasurementSystemEntity.php:22-47` | `#[Entity('measurement_system', since: '6.7.1.0')] class MeasurementSystemEntity extends EntityStruct { … #[PrimaryKey] #[Field(type: FieldType::UUID, api: true)] public string $id; … #[Translations] public ?array $translations = null;` |
| The table is created by an ordinary migration, not by the attribute system | `Migration/V6_7/Migration1742199549MeasurementSystemTable.php:32-42` | `CREATE TABLE IF NOT EXISTS \`measurement_system\` ( \`id\` BINARY(16) NOT NULL, …` |
| Classic `EntityDefinition` route unchanged and still consumed | `Framework/DependencyInjection/CompilerPass/EntityCompilerPass.php:38-61` | `$services = $container->findTaggedServiceIds('shopware.entity.definition'); … if (\in_array($class, [AttributeEntityDefinition::class, AttributeTranslationDefinition::class, AttributeMappingDefinition::class], true)) { continue; }` |
| `entities.xml` still exists as the Custom Entity file name | `System/CustomEntity/Xml/CustomEntityXmlSchema.php:15` | `final public const FILENAME = 'entities.xml';` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| A plugin can declare custom entities in `Resources/config/entities.xml` | absent | The Custom Entity loader joins the file name directly to the extension's `Resources` directory, i.e. `Resources/entities.xml`; only `admin-ui.xml` is read from the `config` subdirectory. `System/CustomEntity/CustomEntityLifecycleService.php:164-179` |
| `entities.xml` is read for plugins in 6.7 | absent | `CustomEntityLifecycleService` exposes only `updateApp(AppEntity)`, resolving the filesystem via `SourceResolver::filesystemForApp`. There is no `updatePlugin()`/`updateBundle()`, and grep for `CustomEntityLifecycle` under `Framework/Plugin/` returns nothing — app-only in this version. `System/CustomEntity/CustomEntityLifecycleService.php:46-58` |
| Attribute entities get their table created automatically | absent | `AttributeEntityCompilerPass` only registers container definitions and repositories; the only schema updater (`CustomEntitySchemaUpdater`) is driven by `CustomEntityLifecycleService` for `entities.xml`, not by the `shopware.entity` tag. `Framework/DependencyInjection/CompilerPass/AttributeEntityCompilerPass.php:31-55` |
| Tests for the attribute entity pass ship in the dist package | absent | grep over `Test/` and `Framework/Test/` for `AttributeEntity` returns nothing; the tests exist only upstream under `tests/unit/…`. |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| Tag `shopware.entity` produces `<name>.definition`, `<name>_translation.definition` and the ManyToMany mapping definition, all tagged `shopware.entity.definition` | `tests/unit/Core/Framework/DependencyInjection/CompilerPass/AttributeEntityCompilerPassTest.php` @ `v6.7.13.0` (read from GitHub; dist strips tests) |
| The smallest valid `#[Entity]` class — `#[Entity('test_attribute_entity')] class TestAttributeEntity extends EntityStruct` with `#[PrimaryKey] #[Field(type: FieldType::UUID)] public string $id;` and a non-nullable `#[Required] #[Field(type: FieldType::STRING, translated: true)] public string $name;` | same file, `v6.7.13.0` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| Tracker task "Deprecate custom entity for plugins", bot-closed with "solved in Shopware version 6.6.10.0"; no body text or migration note | 6.6.10 | closed | https://github.com/shopware/shopware/issues/5799 |
| SpiGAndromeda: the attribute system "covers only about 55% of field types and 50% of flags"; missing inheritance awareness, tree fields, Runtime/Computed, entity defaults, Elasticsearch generation, automatic Store API routes. Explicitly: "Deprecating the traditional EntityDefinition system is not intended. Both approaches will coexist." | 6.6.3.0 onwards | open | https://github.com/shopware/shopware/issues/14741 |
| matthias-nijland: attribute entities share `AttributeEntityDefinition`, so `new EntityType(MyEntity::class)` throws | ^6.6.0 | open | https://github.com/shopware/shopware/issues/15457 |
| DelphiXE5: `#[AutoconfigureTag('shopware.entity')]` in a bundle produced a missing `{entityName}.repository`, diagnosed as compiler-pass ordering (pass at beforeOptimization 1000 vs Symfony's autoconfigure pass at 100) | since 6.7.1.0 | closed | https://github.com/shopware/shopware/issues/11915 |
| "Definition does not exist" when creating an entity extension on an attribute entity definition | 6.6/6.7 era | closed | https://github.com/shopware/shopware/issues/8393 |
| The official Custom Entities guide is written for apps and states `Resources/entities.xml`, while the query says `Resources/config/entities.xml` | unclear | open | https://developer.shopware.com/docs/guides/plugins/apps/custom-data/custom-entities.html |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Which path is `entities.xml` read from? | `System/CustomEntity/CustomEntityLifecycleService.php:164-179` | `Resources/entities.xml`; `Resources/config/entities.xml` is never read. |
| Is custom-entity support for plugins removed in 6.7? | `CustomEntityLifecycleService.php:46-58` + no `CustomEntityLifecycle` reference under `Framework/Plugin/` | The lifecycle service is reachable only for apps; no plugin code path invokes it. |
| Does the traditional `EntityDefinition` route still work in 6.7? | `Framework/DependencyInjection/CompilerPass/EntityCompilerPass.php:38-61` | Yes — the tag is still collected; only the three attribute-derived definition classes are skipped. Coexistence confirmed, matching #14741. |
| Which registration mechanism does an attribute entity need, and at what pass priority? | `Framework/Framework.php:122`, `AutoconfigureCompilerPass.php:51-54` | Tag `shopware.entity`, applied explicitly or by attribute autoconfiguration; the pass now runs at `BEFORE_OPTIMIZATION` priority 99, not the 1000 reported in #11915. |
| Exact `#[Entity]` signature — do `inheritance`/`defaults` exist? | `Attribute/Entity.php:10-32` | Parameters are `name`, `parent`, `since`, `collectionClass`, `hydratorClass`, `inheritanceAware`. No `inheritance` or `defaults` parameter. |
| Which field/flag attributes exist? | `Framework/DataAbstractionLayer/Attribute/` listing | The 26 listed above; `#[Runtime]`, `#[Computed]`, `#[Parent]`, `#[Children]` are not among them (`#[SearchRanking]` does exist). |
| Does the entity class have to extend the `Entity` struct? | `AttributeEntityCompiler.php:141-184`; core examples | Yes — core attribute entities extend `Shopware\Core\Framework\DataAbstractionLayer\Entity`. |
| Do attribute entities get automatic Store API routes? | not examined by the code lane | Not settled; deliberately kept out of the facts. |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| Entity registration via PHP attributes exists since 6.6.3.0 | "Since Shopware v6.6.3.0, it has been possible to register entities via PHP attributes." | `entities-via-attributes.md:12` | not checked (version history not examined); the API itself is confirmed present in 6.7.13.0 |
| Class extends `Entity` and carries the `Entity` attribute; `name` required and unique | "This is done by creating a new class extending `Entity` and adding the `Entity` attribute to it. The `name` parameter denotes the name of the entity. It is required and must be unique." | `entities-via-attributes.md:17-18` | yes — `Attribute/Entity.php:10-32`, `AttributeEntityCompiler.php:141-184` |
| The attribute is `…\DataAbstractionLayer\Attribute\Entity`, aliased `EntityAttribute` in examples | "use Shopware\\Core\\Framework\\DataAbstractionLayer\\Attribute\\Entity as EntityAttribute;" | `entities-via-attributes.md:33` | yes — class path confirmed; the alias is a docs convention, core uses the plain import |
| A primary key must be defined with `PrimaryKey`, UUID recommended | "You have to define a primary key. … it is recommended to use a `UUID`." | `entities-via-attributes.md:24-25` | yes — `#[PrimaryKey] #[Field(type: FieldType::UUID)]` in core entity and upstream fixture |
| `collectionClass` available since 6.6.9.0, defaults to `EntityCollection` | "You can also supply the entity collection class … The default `EntityCollection` class is used if none is specified." | `entities-via-attributes.md:20-22` | yes for the parameter and default — `Attribute/Entity.php:10-32`; the version claim not checked |
| Registration via `services.php` with the `shopware.entity` tag | "To register the entity, you have to add this class to the DI container in the `services.php` file … by adding the `shopware.entity` tag." | `entities-via-attributes.md:50-51` | yes for the tag — `AttributeEntityCompilerPass.php:31-72`; the file format is irrelevant (core uses XML) |
| Shopware auto-registers `<name>.definition` and `<name>.repository` | "Those are registered in the DI container with the names `example_entity.definition` and `example_entity.repository`." | `entities-via-attributes.md:60-61` | yes — `AttributeEntityCompilerPass.php:31-72` |
| A `Field` FQCN may be used as the `type` since 6.6.9.0 | "It is also possible to directly define the field type with any class extending `…\\Field\\Field`." | `entities-via-attributes.md:104-105` | not checked by the code lane |
| Special field types have their own attribute classes (`AutoIncrement`, `ForeignKey`) | "They have their own PHP attribute class, for example the `AutoIncrement` or `ForeignKey` field." | `entities-via-attributes.md:140-141` | yes — both present in the attribute directory |
| Apps register custom entities in `Resources/entities.xml` | "To use custom entities, register them in your app's `Resources/entities.xml` file:" | `custom-entities.md:14` | yes — `CustomEntityLifecycleService.php:164-179` |
| Plugins register an `EntityDefinition` subclass with `shopware.entity.definition` (presented as current, no deprecation note) | "…registering your class in your `services.php` file and by using the `shopware.entity.definition` tag" | `add-custom-complex-data.md:159` | yes — `EntityCompilerPass.php:38-61` |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| No documentation page mentions `Resources/config/entities.xml`, and none states that `entities.xml` stopped working for plugins in 6.7 — the query's premise is unsupported by the docs and simply unexplained. | The path read is `Resources/entities.xml`, and the lifecycle service that reads it is reachable only through `updateApp(AppEntity)` — no plugin code path invokes it in 6.7. | `System/CustomEntity/CustomEntityLifecycleService.php:46-58,164-179` |
| Two plugin routes are documented side by side with no precedence and no version marker: `add-custom-complex-data.md` presents `EntityDefinition` + `shopware.entity.definition` as the way, `entities-via-attributes.md` presents `#[Entity]` + `shopware.entity`. | Both are live in 6.7: `EntityCompilerPass` still collects `shopware.entity.definition` and merely skips the three attribute-derived definition classes. | `Framework/DependencyInjection/CompilerPass/EntityCompilerPass.php:38-61` |
| `entities-via-attributes.md` is versioned as 6.6.3.0/6.6.9.0 material and the clone has no 6.7 page, so nothing documents the 6.7 status of either mechanism. | The attribute API is present and wired in 6.7.13.0 with the pass registered from `Framework::build`. | `Framework/Framework.php:122` |
| No documentation page consulted states that an attribute entity needs its own database migration. | Nothing in the attribute pass touches the schema; core creates its attribute-entity tables with explicit `MigrationStep` `CREATE TABLE` statements. | `Migration/V6_7/Migration1742199549MeasurementSystemTable.php:32-42` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| `The entity class extends `Entity` and carries the class-level `Entity` attribute (`#[EntityAttribute('example_entity')]`, `name` required and unique, optional `collectionClass` since 6.6.9.0), with `#[PrimaryKey]` and `#[Field(type: FieldType::UUID)]` on the id property; the attributes live under `Shopware\Core\Framework\DataAbstractionLayer\Attribute\`.` | kept, rewritten | Confirmed by code; restated with the real `#[Entity]` parameter list and the fact that no `EntityDefinition` subclass is written, and the docs-only `EntityAttribute` alias dropped as a docs convention. |
| `Registration is a DI tag: `$services->set(ExampleEntity::class)->tag('shopware.entity');`, which auto-registers `<entity_name>.definition` and `<entity_name>.repository`.` | kept, rewritten | Confirmed by code; extended with autoconfiguration from the `#[Entity]` attribute and the translation/mapping definitions the pass also synthesises. |
| `Fields are not exposed through the API by default — set `Field(..., api: true)` or scope with `api: [AdminApiSource::class]` / `[SalesChannelApiSource::class]`; translated fields (`translated: true`) and the `Translations` property must be nullable.` | removed | Only the first half is code-backed (`Attribute/Field.php:13-28` shows `public bool|array $api = false`); the `AdminApiSource`/`SalesChannelApiSource` scoping was not verified, and "translated fields … must be nullable" is disproved by the upstream 6.7.13.0 fixture, which declares a non-nullable `#[Required] #[Field(type: FieldType::STRING, translated: true)] public string $name;`. |
| — | added | "Attribute entities do not create their database table; the plugin must ship a `MigrationStep`." Load-bearing and missing from the old set: an answer following the old facts yields an entity whose table does not exist. `Migration/V6_7/Migration1742199549MeasurementSystemTable.php:32-42` |
| `**Trap:** `entities.xml` (the plugin custom-entity format) is not documented anywhere in the 6.7 corpus; the replacement is the attribute-based entity, which is what the target page describes.` | replaced | Wrong on the facts: `entities.xml` is documented (for apps) and still exists in 6.7 — it is the *plugin* path that does not exist, and the file name is `Resources/entities.xml`, not `Resources/config/entities.xml`. The new trap also records that the classic `EntityDefinition` route is not dead. |
