# `edge-08` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `edge-08` · `edge` · `Trap` |
| Version | `6.6 + 6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0959-82-91` |
| Core version | `6.7.13.0` |

**Query:** Which service do I type-hint to read products — `EntityRepositoryInterface` — and how do I inject it into my plugin service?

**Expected answer — every fact an answer must contain:**

1. States that `EntityRepositoryInterface` does not exist in 6.6 or 6.7 — it was removed in 6.5, and type-hinting it is a fatal "class not found". The type to hint is the concrete, `@final`, generic class `Shopware\Core\Framework\DataAbstractionLayer\EntityRepository`, which implements no repository interface. `[code: Framework/DataAbstractionLayer/EntityRepository.php:30-36]`
2. Names the injection: products are read through the public service `product.repository`, auto-created per entity definition by `EntityCompilerPass`, passed as an explicit constructor argument in the plugin's service configuration (`<argument type="service" id="product.repository"/>` / `service('product.repository')`). `[code: Framework/DependencyInjection/CompilerPass/EntityCompilerPass.php:39,67-84]`
3. If the answer relies on autowiring instead, it states the naming requirement: the pass registers the alias `EntityRepository $productRepository` from the service id, so the constructor argument must be named after the entity in camelCase — a plain `EntityRepository $repository` matches no alias. `[code: Framework/DependencyInjection/CompilerPass/EntityCompilerPass.php:87-88]`

**Trap:** `EntityRepositoryInterface` was removed in 6.5; repositories are injected as `EntityRepository` (`product.repository`).

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/reading-data.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| The type to hint is the concrete `EntityRepository` class — `@final`, generic, implementing no interface | `Framework/DataAbstractionLayer/EntityRepository.php:30-36` | `/** * @final * * @template TEntityCollection of EntityCollection */ #[Package('framework')] class EntityRepository` |
| Its constructor is `@internal` — the container builds it | `Framework/DataAbstractionLayer/EntityRepository.php:40-51` | `/** * @internal */ public function __construct(private readonly EntityDefinition $definition, …` |
| Each tagged entity definition gets a public `<entity_name>.repository` service, so products are read via `product.repository` | `Framework/DependencyInjection/CompilerPass/EntityCompilerPass.php:39,67-84` | `$services = $container->findTaggedServiceIds('shopware.entity.definition'); … $repositoryId = $instance->getEntityName() . '.repository'; … $repository->setPublic(true);` |
| The same pass registers the named autowiring alias, so autowiring matches only `EntityRepository $productRepository` | `Framework/DependencyInjection/CompilerPass/EntityCompilerPass.php:87-88` | `$container->registerAliasForArgument($repositoryId, EntityRepository::class);` |
| Symfony derives that alias name from the service id: `'<type> $<parsedName>'` | `vendor/symfony/dependency-injection/ContainerBuilder.php:1501-1518` | `$parsedName = (new Target($name ??= $id))->getParsedName(); … return $this->setAlias($type.' $'.$parsedName, $id);` |
| The explicit XML wiring form used throughout core | `Content/DependencyInjection/product.xml:457` | `<argument type="service" id="product.repository"/>` |
| Runtime resolution returns the concrete class too | `Framework/DataAbstractionLayer/DefinitionInstanceRegistry.php:39` | `public function getRepository(string $entityName): EntityRepository` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| `EntityRepositoryInterface` is the service to type-hint | absent | `grep -rn 'EntityRepositoryInterface'` over `vendor/shopware/{core,storefront,administration}` returns zero matches, and `Framework/DataAbstractionLayer/` contains only `EntityRepository.php`. Type-hinting it in 6.7 is a fatal "class not found". |
| `EntityRepositoryInterface` still exists in 6.6 | absent | The directory listing of `src/Core/Framework/DataAbstractionLayer` at tag `v6.6.10.0` contains `EntityRepository.php` and no `EntityRepositoryInterface.php`. Upstream `UPGRADE-6.5.md` carries the section "`EntityRepositoryInterface` removal": "All type hints from EntityRepositoryInterface should be changed to EntityRepository, you can use rector for that." |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| How a repository is injected in practice (core's own wiring) | `Content/DependencyInjection/product.xml:456-457` — `<argument type="service" id="product.repository"/>` |
| Constructor-injected, generically typed repository in a real core service | `Content/Product/SalesChannel/Listing/ProductListingRoute.php:34-42` — `/** @param EntityRepository<CategoryCollection> $categoryRepository */ … private readonly EntityRepository $categoryRepository,` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| `UPGRADE-6.5.md` states `EntityRepositoryInterface` and `SalesChannelRepositoryInterface` were removed and the classes declared final; offers a Rector rule | 6.5 (so 6.6/6.7 too) | merged | https://github.com/shopware/shopware/blob/trunk/UPGRADE-6.5.md |
| A developer following Shopware's own training plugin hit a TypeError because the constructor type-hinted `EntityRepositoryInterface`; answer: "Just write EntityRepository instead" | 6.5+ | open | https://forum.shopware.com/t/entityrepositoryinterface-error-when-applying-shopware-6-developer-training-plugin/99783 |
| During the 6.4 deprecation window, decorators not extending `EntityRepository` broke the new concrete type hint | 6.4 → 6.5 | closed | https://github.com/shopware/shopware/issues/2945 |
| The 6.4.13.0 "internal repositories" changelog is the origin of the internalisation / final change | 6.4.13.0 | merged | https://github.com/shopware/shopware/blob/trunk/changelog/release-6-4-13-0/2022-05-23-internal-repositories.md |
| A core architecture rule discourages direct `EntityRepository` use in the Storefront frontend layer (Controller/Page/Pagelet) in favour of Store API routes; the Danger regex was inert until repaired by PR #18263 | 6.7 (rule older) | closed | https://github.com/shopware/shopware/issues/18261 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Does `EntityRepositoryInterface` exist in the 6.6 and 6.7 trees? | code lane: local grep + directory listing at `v6.6.10.0` | No, in neither. |
| Is `EntityRepository` final, and does it carry generics affecting the type hint? | code lane `EntityRepository.php:30-36` | `@final` with `@template TEntityCollection`; the hint is the bare class, the collection type is a docblock generic. |
| Which service id must a plugin reference for products, and where is it generated? | code lane `EntityCompilerPass.php:39,67-84` | `product.repository`, generated from the `shopware.entity.definition` tag. |
| Does autowiring work, or must the argument be passed explicitly? | code lane `EntityCompilerPass.php:87-88` + `ContainerBuilder.php:1501-1518` | Both work, but autowiring only via the named alias `EntityRepository $productRepository`; the explicit argument is what core itself uses. |
| Does 6.7 still ship a `SalesChannelRepositoryInterface`? | not examined by the code lane | Out of scope for this case's facts, which concern the product repository only. |
| Does `.danger.php` still carry the frontend-layer repository rule? | not examined by the code lane | An architecture preference about *where* to inject, not about the type or the service id; it does not bear on the facts. |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| The type to import and type-hint is the concrete class `EntityRepository` | "use Shopware\Core\Framework\DataAbstractionLayer\EntityRepository;" | `developer/…/data-handling/reading-data.md` | yes — `EntityRepository.php:30-36` |
| The constructor example type-hints `EntityRepository` | "public function __construct(EntityRepository $productRepository)" | same page | yes, and the argument name matches the autowiring alias |
| The writing-data page likewise type-hints the concrete class | "public function __construct(EntityRepository $productRepository, EntityRepository $taxRepository)" | `developer/…/data-handling/writing-data.md` | yes |
| Repositories are per-entity, auto-generated, and must be injected | "Dealing with the Data Abstraction Layer is done by using the automatically generated repositories for each entity…" | `developer/…/data-handling/reading-data.md` | yes — `EntityCompilerPass.php:67-84` |
| The service id pattern is `entity_name.repository`, giving `product.repository` | "The repository's service name follows this pattern: `entity_name.repository`." | same page | yes |
| Injection is performed by explicit service argument in `services.php` | "$services->set(ReadingData::class)->args([service('product.repository')]);" | same page | yes — mirrors core's own `product.xml:457` |
| No page read mentions `EntityRepositoryInterface`, and no upgrade page in the clone documents its removal | absence established by `Glob` for `**/*upgrade*` plus targeted greps and a live fetch of the current page | same page | consistent with code |

Doc-lane caveat: the clones are gitignored, so that lane's recursive `Grep` returned nothing corpus-wide; the lane verified this by re-running the pattern against an explicit file path, which did match. Its per-page greps, `Glob` results and live fetch stand. The lane also recorded an unverified candidate: a search snippet for the archived `docs/v6.4/…/reading-data.html` page appears to still show `EntityRepositoryInterface`, but fetching that URL returned HTTP 404 so no quote could be taken. 6.4 is outside this case's version pin either way, so it does not bear on the facts.

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| The current documentation asserts the `EntityRepository` type-hint without dating the change, and the developer-docs clone contains no page recording that `EntityRepositoryInterface` ever existed or was removed | The removal is documented upstream in the repository, not in the developer docs: `UPGRADE-6.5.md`, section "`EntityRepositoryInterface` removal" | https://github.com/shopware/shopware/blob/trunk/UPGRADE-6.5.md |
| The documentation shows only the explicit-service-argument style and separately describes autowiring, without stating that repository autowiring depends on the argument name | `EntityCompilerPass` registers the alias `EntityRepository $productRepository` from the service id, so a differently named argument is not autowirable | `Framework/DependencyInjection/CompilerPass/EntityCompilerPass.php:87-88` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| States that `EntityRepositoryInterface` does not appear in the current documentation (removed in 6.5) and that the type is `Shopware\Core\Framework\DataAbstractionLayer\EntityRepository`. | rewritten | "does not appear in the current documentation" is the wrong ground: the code shows the class does not exist at all in 6.6 or 6.7, so hinting it is a fatal error. The fact now says that, and adds that `EntityRepository` is final and implements no interface. |
| Names the injection: the `product.repository` service passed as a constructor argument in the plugin's service configuration. | rewritten | Kept and tied to the compiler pass that creates the service, with core's own wiring form as the concrete shape. |
| Invents no interface, alias or compatibility shim. | replaced | Subsumed by the rewritten fact 1. Replaced by a load-bearing fact the old set missed: repository autowiring works only through the alias `EntityRepository $productRepository`, which the code registers from the service id — an answer that tells a developer to autowire `EntityRepository $repository` does not work. |
