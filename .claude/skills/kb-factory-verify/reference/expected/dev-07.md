# `dev-07` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-07` · `dev` · `DAL` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-11` · run `cases-review-2026-09-11-2118-2-11` |
| Core version | `6.7.13.0` |

**Query:** My plugin needs to store its own data in a new table — how do I define a custom DAL entity with its definition, entity and collection class so I get a repository for it?

**Expected answer — every fact an answer must contain:**

1. The definition extends `Shopware\Core\Framework\DataAbstractionLayer\EntityDefinition`, whose only abstract members are `getEntityName(): string` (returns the snake_case entity/table name, e.g. `swag_example`) and `protected defineFields(): FieldCollection` (must contain an `IdField` flagged `Required` + `PrimaryKey`). `getEntityClass()` and `getCollectionClass()` are **not** abstract — they default to `ArrayEntity::class` / `EntityCollection::class` and are overridden to point at the plugin's own entity class (extends `Entity`, `use EntityIdTrait`) and collection class (extends `EntityCollection`, overrides `protected getExpectedClass()`).  `[code: Framework/DataAbstractionLayer/EntityDefinition.php:130,458,267-278]`
2. The definition is registered as a service carrying the DI tag `shopware.entity.definition`. `EntityCompilerPass` instantiates the tagged class, calls `getEntityName()` on the instance and creates a public service `<entity_name>.repository` of class `EntityRepository` (e.g. `swag_example.repository`), aliased for autowiring by argument name. The entity name comes from `getEntityName()`, not from the tag's `entity` attribute.  `[code: Framework/DependencyInjection/CompilerPass/EntityCompilerPass.php:39-90]`
3. The DAL does not create the table: a plugin migration must `CREATE TABLE` with `id BINARY(16)` as primary key plus `created_at DATETIME(3) NOT NULL` and `updated_at DATETIME(3)`. Those two columns are not declared in `defineFields()` — `EntityDefinition::defaultFields()` adds `CreatedAtField`/`UpdatedAtField` automatically.  `[code: Framework/DataAbstractionLayer/EntityDefinition.php:450-456]`

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/add-custom-complex-data.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| `EntityDefinition` is abstract; only `getEntityName()` and `defineFields()` must be implemented | `Framework/DataAbstractionLayer/EntityDefinition.php:33,130,458` | `abstract public function getEntityName(): string;` … `abstract protected function defineFields(): FieldCollection;` |
| `getEntityClass()`/`getCollectionClass()` are concrete with defaults | `Framework/DataAbstractionLayer/EntityDefinition.php:267-278` | `public function getCollectionClass(): string { return EntityCollection::class; }` … `public function getEntityClass(): string { return ArrayEntity::class; }` |
| canonical definition shape shipped by core's scaffolder | `Framework/Plugin/Command/Scaffolding/stubs/entity-definition.stub:13-40` | `public const ENTITY_NAME = '{{ tableName }}';` … `(new IdField('id', 'id'))->addFlags(new Required(), new PrimaryKey()),` |
| entity class extends `Entity` and uses `EntityIdTrait` (`protected string $id` + `getId()/setId()` which also sets `_uniqueIdentifier`) | `Framework/Plugin/Command/Scaffolding/stubs/entity.stub:8-10` ; `Framework/DataAbstractionLayer/EntityIdTrait.php:9-22` | `class {{ entityName }}Entity extends Entity { use EntityIdTrait;` |
| collection class extends `EntityCollection` and overrides only `getExpectedClass()` | `Framework/Plugin/Command/Scaffolding/stubs/entity-collection.stub:16-21` ; `Framework/DataAbstractionLayer/EntityCollection.php:14,252` | `protected function getExpectedClass(): string { return {{ entityName }}Entity::class; }` |
| the scaffolder emits `<tag name="shopware.entity.definition" entity="{{ tableName }}" />` | `Framework/Plugin/Command/Scaffolding/Generator/EntityGenerator.php:26-29` | as cited |
| the tag is consumed and the repository synthesised from `getEntityName()` | `Framework/DependencyInjection/CompilerPass/EntityCompilerPass.php:39-90` | `$repositoryId = $instance->getEntityName() . '.repository';` … `$container->setDefinition($repositoryId, $repository); $repository->setPublic(true); $container->registerAliasForArgument($repositoryId, EntityRepository::class);` |
| the tag can also be applied by autoconfiguration to any `EntityDefinition` subclass | `Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:56-58` | `->registerForAutoconfiguration(EntityDefinition::class)->addTag('shopware.entity.definition');` |
| a wrongly-typed tagged service is a hard build failure | `Framework/DependencyInjection/CompilerPass/EntityCompilerPass.php:54-56` | `throw DependencyInjectionException::taggedServiceHasWrongType(...)` |
| the table comes from a migration, with `id BINARY(16)`, `created_at`, `updated_at` | `Framework/Plugin/Command/Scaffolding/stubs/migration.stub:17-30` ; `Framework/DataAbstractionLayer/EntityDefinition.php:450-456` | `CREATE TABLE IF NOT EXISTS \`{{ tableName }}\` ( \`id\` BINARY(16) NOT NULL, … )` ; `defaultFields()` returns `CreatedAtField`/`UpdatedAtField` |
| runtime lookup by name | `Framework/DataAbstractionLayer/DefinitionInstanceRegistry.php:38-46` | `public function getRepository(string $entityName): EntityRepository` |
| 6.7 also ships an attribute route (out of scope for this query, which names the definition/entity/collection triple): `#[Entity(name, …)]` on a single class, tag `shopware.entity`, compiled by `AttributeEntityCompilerPass` into an `AttributeEntityDefinition` plus the same `<name>.repository` | `Framework/DataAbstractionLayer/Attribute/Entity.php:10-31` ; `Framework/DependencyInjection/CompilerPass/AttributeEntityCompilerPass.php:33-45,62-66` ; `Content/MeasurementSystem/DataAbstractionLayer/MeasurementSystemEntity.php:22-41` | `#[Entity('measurement_system', since: '6.7.1.0')] class MeasurementSystemEntity extends EntityStruct` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| The `entity="…"` attribute on the tag is what tells Shopware the entity name | absent | `EntityCompilerPass` never reads tag attributes; it does `new $class()` and calls `getEntityName()` — `Framework/DependencyInjection/CompilerPass/EntityCompilerPass.php:63-68` |
| A plugin must declare its own `<entity>.repository` service | absent | the repository is synthesised only when `getDefinition($repositoryId)` throws `ServiceNotFoundException` — `Framework/DependencyInjection/CompilerPass/EntityCompilerPass.php:69-84` |
| `getEntityClass()`/`getCollectionClass()` are abstract | absent | both concrete with defaults — `Framework/DataAbstractionLayer/EntityDefinition.php:267-278` |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| core's scaffolder generates exactly the four artefacts (migration, entity, definition, collection) plus the services.xml tag | `Framework/Plugin/Command/Scaffolding/Generator/EntityGenerator.php:68-82` |
| table name = snake_case of the PascalCase entity name | `Framework/Plugin/Command/Scaffolding/Generator/EntityGenerator.php:163-166` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| `#[AutoconfigureTag('shopware.entity')]` in a bundle leaves `<entity>.repository` missing; reporter blames compiler-pass priority | 6.7 (since 6.7.1.0) | closed | https://github.com/shopware/shopware/issues/11915 |
| Entity class registered under `shopware.entity.definition` instead of the Definition class → `undefined method getEntityName` | trunk (2022) | closed | https://github.com/shopware/shopware/issues/2341 |
| Developer-training plugin type-hints `EntityRepositoryInterface`; moderator confirms the material is outdated | 6.5+ | closed | https://forum.shopware.com/t/entityrepositoryinterface-error-when-applying-shopware-6-developer-training-plugin/99783 |
| App `entities.xml` custom entity not writable over Admin API (`FRAMEWORK__DEFINITION_NOT_FOUND`) | 6.7.0.1 | closed | https://github.com/shopware/shopware/issues/11292 |
| Docs migration SQL for a custom table fails as written (duplicate constraint name, FK arity) | 6.5/6.6-era docs | closed | https://github.com/shopware/docs/issues/1577 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| which tag registers a plugin `EntityDefinition`, and is the `entity` attribute required? | code | `shopware.entity.definition`; the `entity` attribute is never read |
| is the repository service id still `<entity_name>.repository` and autowirable? | code | yes — created public and aliased for argument autowiring |
| which `EntityDefinition` members are abstract? | code | only `getEntityName()` and `defineFields()`; entity/collection classes fall back to `ArrayEntity`/`EntityCollection` |
| does `EntityRepositoryInterface` still exist in 6.7? | not examined by the code lane | not carried into the facts — the facts make no claim about the injected type hint |
| compiler-pass ordering vs `#[AutoconfigureTag]` (issue #11915) | not examined | bears only on the attribute/manual-tag route, which is outside this query's scope; no fact depends on it |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| definition extends `EntityDefinition` and must implement exactly two methods | "which enforces you to implement two methods: `getEntityName` and `defineFields`" | `add-custom-complex-data.md` | yes |
| `getEntityName()` drives table name and repository id | "The database table name / The repository name in the DI container (`<the-name>.repository`)" | `add-custom-complex-data.md` | yes |
| `created_at`/`updated_at` need not be declared | "they're included by default" | `add-custom-complex-data.md` | yes — `defaultFields()` |
| entity and collection classes are optional, generic classes substituted otherwise | "those will be replaced with generic classes otherwise" | `add-custom-complex-data.md` | yes |
| id handled by `EntityIdTrait` | "the ID field, which is handled by the `EntityIdTrait`" | `add-custom-complex-data.md` | yes |
| registered with tag `shopware.entity.definition` carrying an `entity` attribute that "has to contain the technical name" | "the respective `entity` attribute, which has to contain the technical name of your entity" | `add-custom-complex-data.md` | tag yes; the attribute requirement **no** |
| entity properties must be at least `protected` and never `readonly` | "The properties of your entity class have to be at least `protected` … For the same reason `readonly` properties are not allowed." | `add-custom-complex-data.md` | not examined by the code lane |
| attribute route since 6.6.3.0 registers definition and repository automatically | "Shopware automatically registers an `EntityDefinition` and `EntityRepository`" | `entities-via-attributes.md` | yes |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| the tag's `entity` attribute "has to contain the technical name of your entity" | `EntityCompilerPass` never reads the tag's attributes; the name comes from `$instance->getEntityName()` | `Framework/DependencyInjection/CompilerPass/EntityCompilerPass.php:63-68` |
| `add-custom-complex-data.md`: entity properties must be at least `protected`, for all `Struct` subclasses | core's own 6.7 attribute entities declare mapped properties `public` on classes extending the `Entity` struct | `Content/MeasurementSystem/DataAbstractionLayer/MeasurementSystemEntity.php:22-41` |
| two registration routes are documented on unlinked pages with neither stating which applies in 6.7 | both are live in the 6.7 container: `shopware.entity.definition` (classic) and `shopware.entity` (attribute), the latter compiled into the former | `Framework/DependencyInjection/CompilerPass/AttributeEntityCompilerPass.php:33-45,62-66` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| "The definition extends `Shopware\Core\Framework\DataAbstractionLayer\EntityDefinition` and implements `getEntityName()` (returns the snake_case entity/table name, e.g. `swag_example`), `getEntityClass()`, `getCollectionClass()` and `defineFields(): FieldCollection`." | rewritten | code shows only `getEntityName()` and `defineFields()` are abstract; `getEntityClass()`/`getCollectionClass()` are concrete defaults, and the old text presented all four as required |
| "Register the definition with the DI tag `shopware.entity.definition` carrying an `entity` attribute equal to the entity name; the repository is then available under the service id `<entity_name>.repository`, e.g. `swag_example.repository`." | rewritten | the tag and the repository id are confirmed, but the `entity` attribute is never read by `EntityCompilerPass` — the name comes from `getEntityName()` |
| "Entity class properties must be at least `protected` and must never be `readonly`, because the DAL assigns values by reflection (applies to every class extending `Struct`, not only `Entity`)." | removed | no code finding backs it — the code lane did not examine the hydrator's reflection path, and core's 6.7 attribute entities use `public` mapped properties. Replaced by the migration/`defaultFields()` fact, which the code does settle and which decides whether the answer works |
