# `edge-03` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `edge-03` · `edge` · `Trap` |
| Version | `6.6 + 6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0959-82-91` |
| Core version | `6.7.13.0` |

**Query:** Where do the `#[ORM\Entity]` mapping attributes for my plugin's entity go in Shopware 6, and how do I get Doctrine's `EntityManager` injected into my service so I can persist it?

**Expected answer — every fact an answer must contain:**

1. States that Shopware 6 has no Doctrine ORM: `doctrine/orm` is not installed, no `#[ORM\*]` attribute appears anywhere in the platform, and no `EntityManager` service exists — so the mapping attributes have nowhere to go and `EntityManager` cannot be injected. The only Doctrine available is `Doctrine\DBAL\Connection`, for raw SQL. `[code: Framework/DependencyInjection/services.xml:70]`
2. Names the real mechanism: the entity is described to Shopware's Data Abstraction Layer either by an `EntityDefinition` service tagged `shopware.entity.definition`, or — in 6.7, and per the docs since 6.6.3.0 — by a class carrying Shopware's own `Shopware\Core\Framework\DataAbstractionLayer\Attribute\*` attributes (`#[Entity]`, `#[Field]`, `#[PrimaryKey]`, …) and tagged `shopware.entity`. Either way the container auto-creates a `<entity_name>.repository` service. `[code: Framework/DependencyInjection/CompilerPass/EntityCompilerPass.php:39-84]`
3. Names the persistence call: inject that `<entity_name>.repository` service, typed `EntityRepository`, and write with `create()`/`upsert()` taking an array payload plus a `Context` — there is no `persist()`/`flush()` unit of work. `[code: Framework/DataAbstractionLayer/EntityRepository.php:113,127]`

**Trap:** the Symfony reflex, and the single most likely wrong move an LLM makes in a Symfony-shaped repository. Shopware ships Doctrine **DBAL** only — there is no ORM layer, no `#[ORM\*]` mapping, no `EntityManager` service and no mapping directory to configure. Persistence goes through the Data Abstraction Layer; an answer that produces an ORM mapping fails Accuracy regardless of how well it is written.

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/add-custom-complex-data.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| A plugin entity is an `EntityDefinition` service tagged `shopware.entity.definition`; core does exactly this for products | `Content/DependencyInjection/product.xml:16-18` | `<service id="Shopware\Core\Content\Product\ProductDefinition"> <tag name="shopware.entity.definition"/>` |
| `EntityCompilerPass` consumes that tag, makes the definition public and auto-creates a `<entity_name>.repository` `EntityRepository` service | `Framework/DependencyInjection/CompilerPass/EntityCompilerPass.php:39-84` | `$services = $container->findTaggedServiceIds('shopware.entity.definition'); … $repositoryId = $instance->getEntityName() . '.repository';` |
| Mapping metadata, where attributes are used, is Shopware's own — `…DataAbstractionLayer\Attribute\Entity` is a final class-level attribute taking a DAL entity name | `Framework/DataAbstractionLayer/Attribute/Entity.php:9-31` | `#[\Attribute(\Attribute::TARGET_CLASS)] final class Entity { public function __construct(public string $name, …` |
| The sibling field attributes are all Shopware's own | `Framework/DataAbstractionLayer/Attribute/` | `Entity.php Field.php FieldType.php ForeignKey.php ManyToMany.php ManyToOne.php OneToMany.php OneToOne.php PrimaryKey.php Required.php Translations.php Version.php …` |
| Attribute entities are picked up from the `shopware.entity` tag, turned into an `AttributeEntityDefinition` and given a `<entity>.repository` | `Framework/DependencyInjection/CompilerPass/AttributeEntityCompilerPass.php:33-91` | `$services = $container->findTaggedServiceIds('shopware.entity'); … $container->setDefinition($entity . '.repository', $repository);` |
| Persisting goes through `EntityRepository::create()`/`upsert()` with a payload array and a `Context` | `Framework/DataAbstractionLayer/EntityRepository.php:113,127` | `public function upsert(array $data, Context $context): EntityWrittenContainerEvent` / `public function create(array $data, Context $context): EntityWrittenContainerEvent` |
| The Doctrine layer that is available is DBAL only, as a public service | `Framework/DependencyInjection/services.xml:70` | `<service id="Doctrine\DBAL\Connection" public="true">` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| `#[ORM\Entity]` mapping attributes are used for plugin entities | absent | `grep -rn 'ORM\\Entity'` over `vendor/shopware/core` and `vendor/shopware/storefront` returns no match. No Doctrine ORM mapping attribute is used or supported anywhere in the platform. |
| Doctrine's `EntityManager` can be injected into a plugin service | absent | `doctrine/orm` is not installed: `vendor/doctrine/` holds only `dbal`, `deprecations`, `inflector`, `instantiator`, `lexer`, and `composer.lock` lists the same set with no `doctrine/orm`. `grep -rn 'Doctrine\\ORM\\EntityManager'` over `vendor/shopware` returns nothing. Upstream is the same: a GitHub code search for `"doctrine/orm"` in `src/Core` `composer.json` returns 0 results, so it is absent in 6.6 too. |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| _none recorded_ | — |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| A forum thread asks outright why Doctrine cannot be used in Shopware 6 plugins; no accepted answer | 6.x (opened 2019-10-18) | open | https://forum.shopware.com/t/why-doctrine-can-not-be-use-in-shopware-6-plugins/62472 |
| Shopware's concept docs state that, unlike most Symfony applications, Shopware uses no ORM but a thin abstraction layer | 6.x | open | https://developer.shopware.com/docs/concepts/framework/data-abstraction-layer.html |
| Community answers route developers to `EntityDefinition` + migration + `EntityRepository` rather than any Doctrine mapping | 6.x | open | https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/add-custom-complex-data.html |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Does 6.6/6.7 require `doctrine/orm` or only `doctrine/dbal`? | code lane `vendor/doctrine/` listing, `composer.lock`, GitHub search over upstream `src/Core/composer.json` | DBAL only, in both versions. |
| Is `Doctrine\ORM\EntityManagerInterface` referenced anywhere? | code lane recursive grep over `vendor/shopware` | No — it cannot be autowired. |
| Which service id does a plugin get for raw SQL? | code lane `Framework/DependencyInjection/services.xml:70` | `Doctrine\DBAL\Connection`, public. |
| What is the real registration path for a plugin entity in 6.7? | code lane `EntityCompilerPass.php:39-84` and `AttributeEntityCompilerPass.php:33-91` | Tag `shopware.entity.definition` (definition class) or `shopware.entity` (attribute entity); both yield `<entity>.repository`. |
| Do any `#[ORM\...]` attributes appear in the source tree? | code lane grep | None. |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| Shopware uses no ORM but a thin abstraction layer (DAL) | "In contrast to most Symfony applications, Shopware uses no ORM, but a thin abstraction layer called the data abstraction layer \(DAL\)." | `developer/concepts/framework/data-abstraction-layer.md` | yes |
| A plugin introduces its table with an `EntityDefinition` subclass implementing `getEntityName` and `defineFields` | "your own definition has to extend from the class `…\EntityDefinition`, which enforces you to implement two methods…" | `developer/guides/plugins/plugins/framework/data-handling/add-custom-complex-data.md` | yes — the tagged-definition path in `EntityCompilerPass.php:39-84` |
| The entity name determines the table name and the `<the-name>.repository` DI service name | "* The database table name * The repository name in the DI container \(`<the-name>.repository`\)" | same page | repository name yes (`EntityCompilerPass.php:67-84`); the table-name half was not checked by the code lane |
| The database table is created by a plugin migration, not generated from mapping metadata | "creating a database table is done via [plugin migrations]…" | same page | not checked by the code lane — a doc claim only, not admitted to the facts |
| Attribute-based definition uses Shopware's own `DataAbstractionLayer\Attribute` namespace, possible since v6.6.3.0 | "Since Shopware v6.6.3.0, it has been possible to register entities via PHP attributes." | `developer/guides/plugins/plugins/framework/data-handling/entities-via-attributes.md` | attributes and the `shopware.entity` tag: yes, in 6.7. The "since 6.6.3.0" dating is a doc claim; the code lane verified 6.7 only |
| Attribute entities are registered by the `shopware.entity` tag, giving `<entity>.definition` and `<entity>.repository` | "Using the tag, Shopware automatically registers an `EntityDefinition` and `EntityRepository`…" | same page | yes — `AttributeEntityCompilerPass.php:33-91` |
| The only Doctrine namespace in the pages read is `Doctrine\DBAL\Connection`, used in migrations | "use Doctrine\DBAL\Connection;" | `developer/guides/plugins/plugins/database/database-migrations.md` | yes |
| Persistence goes through the `entity_name.repository` service injected as a constructor argument | "The repository's service name follows this pattern: `entity_name.repository`…" | `developer/guides/plugins/plugins/framework/data-handling/reading-data.md` | yes |

The docs lane recorded that the documentation presents two entity-definition mechanisms without stating which supersedes the other. The code settles this without conflict: both exist and both are supported in 6.7 — `EntityCompilerPass` for the hand-written definition tagged `shopware.entity.definition`, `AttributeEntityCompilerPass` for the attribute class tagged `shopware.entity`, the latter producing an `AttributeEntityDefinition` that is itself tagged `shopware.entity.definition`. Nothing in the code marks either as legacy.

Doc-lane caveat: the clones are gitignored, so that lane's recursive `Grep` for `Doctrine|EntityManager|ORM\Entity` returned nothing corpus-wide and proves nothing. Its per-page reads and `Glob` results stand.

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| _none — the documentation and the code agree that there is no ORM and that the DAL is the persistence path_ | — | — |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| States that Shopware 6 has no Doctrine ORM: no page documents `#[ORM\*]` mapping attributes, an `EntityManager` service or an ORM mapping path — Doctrine appears only as `Doctrine\DBAL\Connection` for raw SQL and migrations. | rewritten | The old wording grounded the absence in the documentation ("no page documents…"). It is now grounded in the code: `doctrine/orm` is not installed in 6.6 or 6.7, no `#[ORM\*]` attribute exists, `Doctrine\DBAL\Connection` is the registered service. |
| Names the real mechanism from a page it read: the entity is described by an `EntityDefinition` registered with the `shopware.entity.definition` tag (or the attribute entity tagged `shopware.entity`), the table is created by a `MigrationStep`, and the service injected for persistence is the generated `<entity_name>.repository` typed `EntityRepository`, written with `upsert()`/`create()` and a `Context`. | split and rewritten | Split into the registration fact and the persistence fact so each is separately checkable. "from a page it read" dropped. The `MigrationStep` clause was removed from the facts: the code lane did not verify it, and an unconfirmed doc claim is not admitted as a mechanism fact — it is recorded in the documentation table instead. |
| Invents no ORM bridge, `EntityManager` alias, `doctrine.yaml` mapping block or `#[ORM\*]`-to-DAL equivalence table. | removed | Subsumed by the rewritten fact 1, which states the absence positively with its code evidence. |
