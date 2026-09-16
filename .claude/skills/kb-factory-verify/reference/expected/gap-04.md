# `gap-04` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `gap-04` · `gap` · `Gap` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0959-92-100` |
| Core version | `6.7.13.0` |

**Query:** After upgrading to 6.7 my plugin fatals on load because core class properties now have native PHP types — which properties must I retype in my subclasses?

**Expected answer — every fact an answer must contain:**

1. States that the documentation corpus has no page about the 6.7 native property types change and cannot list the affected properties — the phrase "native type" occurs nowhere in it.  `[docs-only]`
2. Names the closest material actually read — the backward-compatibility guideline (the `#[PropertyTypeNarrowing]` / `#[PropertyTypeWidening]` announcement attributes and the invariance rule "stop redeclaring the property", whose examples target v6.8.0, not 6.7) — without claiming it covers the 6.7 change.  `[docs-only]`
3. States that no enumerable list exists: the change was applied repo-wide to every untyped PHP class property in Core, Administration and Storefront, so the only reliable enumeration is grepping the 6.6 tree of the classes the plugin actually extends for `@deprecated tag:v6.7.0 - Will be natively typed` and taking the paired `@var`. Shopware ships no command or shim that reports which subclass properties need retyping. It invents no property list or class names.  `[code: Framework/DataAbstractionLayer/Entity.php:14-29]`

**Official reference URL:** https://github.com/shopware/shopware/blob/trunk/UPGRADE-6.7.md#native-types-for-php-class-properties
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| The change is repo-wide, not a bounded list; extenders must retype every property they redeclare | `github.com/shopware/shopware@v6.7.0.0 changelog/release-6-6-9-0/2024-11-11-properties-native-type.md` | "A \"deprecation\" message was added to every PHP class property without a native type. … If you extend classes with such properties, you will also need to add the type accordingly during the major update." |
| The 6.6 marker identifying the affected properties is the docblock line plus its `@var` | `github.com/shopware/shopware@v6.6.10.0 src/Core/Framework/DataAbstractionLayer/Entity.php` | `@deprecated tag:v6.7.0 - Will be natively typed` + `@var string` on `protected $_uniqueIdentifier;` |
| Base `Entity` now declares five typed properties; `$_uniqueIdentifier` has no default and is therefore uninitialized | `Framework/DataAbstractionLayer/Entity.php:14-29` | `protected string $_uniqueIdentifier;` / `protected ?string $versionId = null;` / `protected array $translated = [];` / `protected ?\DateTimeInterface $createdAt = null;` |
| `ProductEntity` went from ~90 untyped properties to 94 typed declarations, types following the old `@var` | `Content/Product/ProductEntity.php:49-77` | `protected ?string $parentId = null;` / `protected int $childCount = 0;` / `protected ?PriceCollection $price = null;` |
| Some new types carry no default, so reading before write is now a PHP Error rather than `null` | `Content/Product/ProductEntity.php:53,71,73,75,175,274` | `protected int $autoIncrement;` / `protected string $productNumber;` / `protected ProductPriceCollection $prices;` |
| Storefront `Page`: only `$metaInformation` survives, typed `?MetaInformation = null`; four other 6.6 properties were removed rather than typed | `vendor/shopware/storefront/Page/Page.php:11` | `protected ?MetaInformation $metaInformation = null;` |
| `ProductPage` shows the same uninitialized-property hazard | `vendor/shopware/storefront/Page/Product/ProductPage.php:18-26` | `protected SalesChannelProductEntity $product;` / `protected CmsPageEntity $cmsPage;` |
| The typing wave is finished for ordinary classes in 6.7; remaining markers are Constraint classes tagged v6.8.0 | `Framework/DataAbstractionLayer/Validation/EntityExists.php:40` | `@deprecated tag:v6.8.0 - reason:new-optional-parameter - … constructor property promotion` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| An enumerable, bounded list of core properties that changed type in 6.7 | absent | The change was applied to "every PHP class property without a native type" in Core, Administration and Storefront; no such list exists in the source. The only enumeration is the set of 6.6 `@deprecated tag:v6.7.0 - Will be natively typed` markers on the classes a given plugin extends. |
| A compatibility shim or a command reporting which subclass properties need retyping | absent | No such tool in `vendor/shopware/core`; the only related tooling is `DevOps/StaticAnalyze/PHPStan/Rules/`, none of which targets subclass property typing. |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| _None found._ | — |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| Shopware's own planning ticket classifies the migration as "a break for protected and public properties" | 6.7 (planned in 6.6) | closed | github.com/shopware/shopware/issues/10624 |
| Merged breaking-change PR adding native types namespace by namespace (`Shopware\Core\System`), one of a series | 6.7 | merged | github.com/shopware/shopware/pull/6839 |
| Practitioner writeup: "audit every class you extend"; gives no enumeration | 6.7 | open | tobias-schaefer.com/blog/shopware-migration-66-to-67/ |
| Community tooling answer is `ShopwareSetList::SHOPWARE_6_7_0` in FriendsOfShopware/shopware-rector | 6.7 | open | github.com/FriendsOfShopware/shopware-rector |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Is there a single authoritative list of the properties that gained native types? | code | No — the changelog entry states the change covers every untyped property; no list exists in the source. |
| Does `Entity` have native types on its own properties in 6.7? | code | Yes, five of them; `$_uniqueIdentifier` is uninitialized (`Entity.php:14-29`). |
| Nullable-with-default or uninitialized typed properties — which failure mode? | code | Both occur: most are nullable with defaults, but several (`$autoIncrement`, `$productNumber`, `$stock`, `$sales`, `$prices`) have no default. |
| Is the 6.6 `@deprecated tag:v6.7.0 - Will be natively typed` marker greppable for planning an upgrade? | code | Yes — confirmed on the v6.6.10.0 tree; it is the only reliable enumeration method. |
| Do `Struct` / `Collection` / `ArrayEntity` base classes also change visibility at the same time? | not settled | Not traced; not load-bearing for the facts above. |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| The 6.7.0.0 release notes state all PHP class properties now have a native type and tell extenders to add them | "All PHP class properties now have a native type. If you have extended classes with properties, which didn't have a native type before, make sure you now add them as well." | live release-notes/6.7/6.7.0.0.html | yes — matches the repo changelog entry |
| The release-notes entry enumerates nothing and links to no list | "#### Native types for PHP class properties" | live release-notes/6.7/6.7.0.0.html | yes — no such list exists in the source either |
| The BC guideline states property types are invariant and tells extenders to stop redeclaring the property | "PHP property types are invariant, so no redeclaration can use both the current and announced type." | `resources/guidelines/code/backward-compatibility.md:390` | yes — invariance is why subclasses fatal |
| Property type changes are announced with `#[PropertyTypeNarrowing]` / `#[PropertyTypeWidening]` | "\| `#[PropertyTypeNarrowing]` \| A property type becomes narrower \| …" | `resources/guidelines/code/backward-compatibility.md:112` | not applicable to 6.7 — that mechanism's examples target v6.8.0 |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| The corpus contains no occurrence of "native type"; the only related page is the general BC guideline, whose examples target v6.8.0 | The 6.7 change is real, repo-wide, and recorded in the repo changelog shipped with the v6.7.0.0 tag | `changelog/release-6-6-9-0/2024-11-11-properties-native-type.md` (v6.7.0.0) |
| The BC guideline's remedy is announcement attributes plus "stop redeclaring the property" | For 6.7 there were no announcement attributes; the 6.6 signal was the `@deprecated tag:v6.7.0 - Will be natively typed` docblock, and typed-without-default properties add a second failure mode the guideline does not mention | `Content/Product/ProductEntity.php:53,71,73,75` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| States that the source has no page about the 6.7 native property types change and cannot list the affected properties. | rewritten | Kept, sharpened with the docs lane's checkable finding: the phrase "native type" occurs nowhere in the corpus. |
| Points at the upgrade guide page (`platform/dev/6.7/guides/upgrades-migrations/upgrade-shopware.md`) or the extension architecture pages as the closest material actually read, without claiming they cover it. | rewritten | The docs lane found neither of those as the nearest material for this case; it found the backward-compatibility guideline and the 6.5 language-features page. Naming a page the lane never read would reward an invented citation. |
| Invents no property list, class names or code. | rewritten | Replaced with the code-settled positive statement — no enumerable list exists, and the only reliable method is grepping the 6.6 markers on the extended classes — with the prohibition kept as its tail. |
