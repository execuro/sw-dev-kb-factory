# `func-10` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `func-10` · `func` · `Merchant` |
| Version | `6.6 + 6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-1011-find-cases-that-are-not` |
| Core version | `6.7.13.0` |

**Query:** How do dynamic product groups work in the administration and where can the resulting group be used?

**Expected answer — every fact an answer must contain:**

1. A dynamic product group is the `product_stream` entity, edited in the administration module `sw-product-stream` (documented path **Catalogues > Dynamic product groups** `[docs-only]`). The merchant edits the translated name/description and the condition rows in `product_stream_filter` — each row has `type` `static` (a leaf condition) or `stream` (a nested AND/OR group), plus `field`, `operator`, `value`, `parameters`, `position` and parent/children (`queries`), which is how sub-conditions nest. `api_filter` and `invalid` are WriteProtected: `ProductStreamIndexer` compiles the rows into `api_filter` on every write and sets `invalid = 1` when they do not parse.  `[code: Content/ProductStream/DataAbstractionLayer/ProductStreamIndexer.php:108]`
2. The finished group can be referenced in five places, not three: a category with `productAssignmentType = 'product_stream'` and a `productStreamId`; product cross-selling of type product stream (`product_cross_selling.product_stream_id`); the CMS product-slider element's `product_stream` source; a product export (product comparison feed); and the cart rule `cartLineItemInProductStream`. The first four re-evaluate the compiled filters live through `ProductStreamBuilder::enrichCriteria`, so the group stores no product list; only the rule reads the materialised `product_stream_mapping` table, maintained asynchronously by the `product_stream_mapping.indexer`.  `[code: Content/Product/SalesChannel/Listing/ProductListingRoute.php:106]`
3. **Version pin:** "Keep matching variants grouped" (`displayAsGroup`) and the `internal` flag do **not** exist in 6.6 — the 6.6.10.0 `ProductStreamDefinition` has neither field. In 6.7 `displayAsGroup = false` adds `ProductListingLoader::STATE_SKIP_ADD_GROUPING` so matching variants are listed individually instead of grouped under their main product, and `internal = true` hides the group from the administration list. An answer that offers this option for 6.6 is wrong.  `[code: Content/ProductStream/Service/ProductStreamBuilder.php:34]`

**Trap:** "Product stream" is the developer/API name for the same object (`product_stream` entity, `productStreamId`), so a developer-side grep for "product stream" and the merchant page use different vocabulary; the merchant page never says "product stream" in its own headings.

**Official reference URL:** https://docs.shopware.com/en/shopware-6-de/Catalogues/Dynamicproductgroups
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| The group is `product_stream`; `api_filter` and `invalid` are computed, not merchant-set | `Content/ProductStream/ProductStreamDefinition.php` (defineFields) | `(new JsonField('api_filter', 'apiFilter'))->addFlags(new WriteProtected())` / `(new BoolField('invalid', 'invalid'))->addFlags(new WriteProtected())` |
| Conditions are `product_stream_filter` rows, `static` (leaf) or `stream` (group), nested via children `queries` | `Content/ProductStream/Aggregate/ProductStreamFilter/ProductStreamFilterDefinition.php` (defineFields) | `(new StringField('type', 'type'))->addFlags(new Required())->setDescription('Type is either \`static\` or \`stream\`.')` … `new ChildrenAssociationField(self::class, 'queries')` |
| The indexer compiles filters to `api_filter`, or flags `invalid` | `Content/ProductStream/DataAbstractionLayer/ProductStreamIndexer.php:108-129` | `UPDATE product_stream SET api_filter = :serialized, invalid = :invalid WHERE id = :id` … `catch (InvalidFilterQueryException\|SearchRequestException) { $invalid = true; }` |
| Filters are parsed generically against `ProductDefinition`, so any product DAL field/association path is usable | `Content/ProductStream/DataAbstractionLayer/ProductStreamIndexer.php:157-158` | `$parsed = QueryStringParser::fromArray($this->productDefinition, $value, $searchException);` |
| Read time: filters are re-applied to the criteria; no `api_filter` throws `NoFilterException` | `Content/ProductStream/Service/ProductStreamBuilder.php` (enrichCriteria/parseFilters) | `$criteria->addFilter(...$this->parseFilters($stream, $id));` … `if (!$data) { throw new NoFilterException($id); }` |
| Use 1 — category listing via `productAssignmentType = 'product_stream'` | `Content/Product/SalesChannel/Listing/ProductListingRoute.php:106-117` | `if ($productAssignmentType === CategoryDefinition::PRODUCT_ASSIGNMENT_TYPE_PRODUCT_STREAM && \is_string($productStreamId) ...) { ... enrichCriteria(...) }` |
| The category assignment type is Required, defaulting to manual `product` | `Content/Category/CategoryDefinition.php:71-138` | `final public const PRODUCT_ASSIGNMENT_TYPE_PRODUCT_STREAM = 'product_stream';` |
| Use 2 — product cross-selling of type product stream | `Content/Product/Aggregate/ProductCrossSelling/ProductCrossSellingDefinition.php:60-97` | `'type' => self::TYPE_PRODUCT_STREAM,` … `(new FkField('product_stream_id', 'productStreamId', ProductStreamDefinition::class))` |
| Use 3 — CMS product slider source | `Content/Product/Cms/ProductSlider/ProductStreamProcessor.php:54-57` | `public function getSource(): string { return 'product_stream'; }` |
| Use 4 — product exports (comparison feed); in 6.7 the association is RestrictDelete | `Content/ProductStream/ProductStreamDefinition.php` (defineFields) | `(new OneToManyAssociationField('productExports', ProductExportDefinition::class, 'product_stream_id', 'id'))->addFlags(new RestrictDelete())` |
| Use 5 — the cart rule `cartLineItemInProductStream` | `Checkout/Cart/Rule/LineItemInProductStreamRule.php:22-51` | `final public const RULE_NAME = 'cartLineItemInProductStream';` |
| Rule membership is precomputed in `product_stream_mapping` by an async indexer | `Content/Product/DataAbstractionLayer/ProductStreamUpdater.php:56` | `return 'product_stream_mapping.indexer';` |
| Version delta: `internal`, `display_as_group` and the reverse `products` association are 6.7-only | `https://github.com/shopware/shopware/blob/v6.6.10.0/src/Core/Content/ProductStream/ProductStreamDefinition.php` vs `Content/ProductStream/ProductStreamDefinition.php` | 6.6: translations, filters, productCrossSellings, productExports, categories — nothing else. 6.7 adds `(new BoolField('internal', 'internal'))`, `(new BoolField('display_as_group', 'displayAsGroup'))`, `ManyToManyAssociationField('products', ...)` |
| `displayAsGroup = false` skips variant grouping | `Content/ProductStream/Service/ProductStreamBuilder.php:34-41` | `if (!$stream->isDisplayAsGroup()) { $criteria->addState(ProductListingLoader::STATE_SKIP_ADD_GROUPING); }` |
| `internal = true` hides the group from the admin list | `administration/.../module/sw-product-stream/page/sw-product-stream-list/index.js:79` | `criteria.addFilter(Criteria.equals('internal', false));` |
| The admin module and its preview modal | `administration/.../module/sw-product-stream` (directory listing) | `page: sw-product-stream-detail, sw-product-stream-list; component: sw-product-stream-filter, sw-product-stream-modal-preview, …` |
| The preview is its own admin route and deliberately includes inactive products | `administration/Controller/AdminProductStreamController.php:43-90` | `#[Route(path: '/api/_admin/product-stream-preview/{salesChannelId}', ...)]` … `// remove query for active field as we also want to preview inactive products` `array_pop($queries);` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| A dynamic product group stores its matching products | partly absent | The stream stores only the compiled `api_filter`; category listing, cross-selling, CMS slider and product exports all re-evaluate at query time. The only materialised membership is `product_stream_mapping`, serving the rule builder and cache invalidation (`Content/Product/DataAbstractionLayer/ProductStreamUpdater.php:56`) |
| `internal` and `displayAsGroup` exist in 6.6 | absent in 6.6 | The 6.6.10.0 `ProductStreamDefinition` field list contains neither bool field (`https://github.com/shopware/shopware/blob/v6.6.10.0/src/Core/Content/ProductStream/ProductStreamDefinition.php`) |
| An `invalid` stream is blocked from being assigned | absent | `invalid` is only a WriteProtected flag written by the indexer; no consumer checks it before use — the builder simply throws `NoFilterException` for the missing `api_filter` (`Content/ProductStream/Service/ProductStreamBuilder.php` parseFilters) |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| The cross-selling usage shape (`type: 'productStream'` + `productStreamId`) | `Content/Test/Product/ProductBuilder.php:43` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| Editing (as opposed to adding) a condition never recalculates `product.stream_ids`, so rules keep matching removed products until `dal:refresh:index` | 6.7 | closed | https://github.com/shopware/shopware/issues/18680 |
| Comparison export rebuilds the filters via `ProductStreamBuilder` instead of reading the mapping, so export and preview disagree | 6.7 | open | https://github.com/shopware/shopware/issues/17359 |
| Assigning a product to a category does not reindex groups filtering on that category | 6.6 | open | https://github.com/shopware/shopware/issues/6774 |
| Products assigned to a subcategory through a group do not appear in the parent category listing | 6.7 | open | https://github.com/shopware/shopware/issues/13661 |
| Category detail page's product preview is empty for a dynamic assignment type | 6.7 | open | https://github.com/shopware/shopware/issues/18203 |
| "Keep matching variants grouped" keeps returning a stale storefront-presentation variant | 6.7 | open | https://github.com/shopware/shopware/issues/20130 |
| Stale manual cross-selling assignments survive switching back to a dynamic group | 6.7 | open | https://github.com/shopware/shopware/issues/19441 |
| Stream cross-selling does not exclude the currently viewed variant | 6.7 | closed | https://github.com/shopware/shopware/issues/18914 |
| `core.listing.partialDataLoading` + stream cross-selling returns HTTP 500 | 6.7 | closed | https://github.com/shopware/shopware/issues/18587 |
| Feature request: groups cannot be nested from other groups | unclear | open | https://github.com/shopware/shopware/issues/10503 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Is membership stored or evaluated live, and which consumer uses which? | code | Both, split by consumer: listing / cross-selling / CMS slider / export re-evaluate live via `ProductStreamBuilder`; only the cart rule uses `product_stream_mapping`. Stated in fact 2. |
| Which entity is the dynamic product group, and what is `apiFilter` for? | code | `product_stream`; `api_filter` is the compiled form of the `product_stream_filter` rows, WriteProtected. Stated in fact 1. |
| Where can a stream be referenced? | code | Five places, enumerated in fact 2 — two more than the merchant docs name. |
| Is the mapping indexer reliably triggered (issues 18680, 6774)? | not settled | These are indexer-staleness defects. Fact 2 only states that the mapping is maintained asynchronously by `product_stream_mapping.indexer`, which is code-backed and consistent with the reports; no fact claims the mapping is always current. |
| What does "Keep matching variants grouped" map to? | code | `displayAsGroup`, 6.7-only, `STATE_SKIP_ADD_GROUPING` when false. Stated in fact 3. |
| Can a condition reference another stream? | code (indirect) | The filter `type` values are only `static` and `stream` (a nested group of the same stream) and filters are parsed against `ProductDefinition`; no stream-referencing filter type was found. Not turned into a fact — the code lane did not enumerate the admin field list. |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| Groups live under Catalogues > Dynamic product groups and are formed by dynamic rules usable in several places | "The dynamic product groups can be found in the **admin** under **Catalogues > Dynamic product groups**." | merchant `…/Dynamicproductgroups/v1-2-2-0.md:10` | partly — the admin module `sw-product-stream` exists; the menu path itself is `[docs-only]` |
| Conditions combine with AND/OR and nest via SUB-CONDITION indefinitely | "You can also nest the conditions by using the **SUB-CONDITION (5)** button. … This can be continued indefinitely." | merchant `…/v1-2-2-0.md:39` | yes — `type = 'stream'` groups with a `ChildrenAssociationField('queries')` |
| A Preview button shows the products that would currently belong to the group | "The **Preview (7)** button shows you all products that would belong to the dynamic product group…" | merchant `…/v1-2-2-0.md:41` | yes — `POST /api/_admin/product-stream-preview/{salesChannelId}` |
| A status shows whether the group's rules are valid and usable | "The status indicates whether a product group uses valid rules and can therefore be used." | merchant `…/v1-2-2-0.md:19` | yes for the flag (`invalid`, written by the indexer); **no** for "can therefore be used" — nothing checks it before use |
| Six operators are available: Is equal to / not equal to / equal to any of / not equal to any of / equal to all of / not equal to all of | "You can choose one of the these operators: …" | merchant `…/v1-2-2-0.md:47-48` | not checked — the admin operator list per field type was not read; removed from the facts |
| From 6.7.13 the available operators depend on the selected property | "The available operators depend on the selected property." | merchant `…/v1-3-0-0.md:48` | not checked |
| Custom fields can be used as criteria | "…you can also use custom fields that you have configured yourself." | merchant `…/v1-2-2-0.md:112` | consistent — filters are parsed generically against `ProductDefinition`, which carries custom fields; not asserted as a fact |
| Three places of use: categories, product comparison feeds, Shopping Experiences product sliders | "In the shopping experiences, you can use dynamic product groups to fill product sliders." | merchant `…/v1-2-2-0.md:125-137` | incomplete — code shows five (see divergence) |
| "Keep matching variants grouped" controls whether matching variants stay under a shared main product | "When the setting is enabled, the variants remain grouped under a shared main product. …" | merchant `…/v1-3-0-0.md:30` (page declared from 6.7.13.0; absent from the 6.6/early-6.7 page) | yes for 6.7 — `displayAsGroup` / `STATE_SKIP_ADD_GROUPING`; the field does not exist in 6.6 |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| A dynamic product group can be used in three places: categories, product comparison feeds and Shopping Experiences product sliders. | Five: those three plus product cross-selling (`product_cross_selling.product_stream_id`) and the cart rule `cartLineItemInProductStream`. | `Content/Product/Aggregate/ProductCrossSelling/ProductCrossSellingDefinition.php:60-97`, `Checkout/Cart/Rule/LineItemInProductStreamRule.php:22-51` |
| The status indicates whether a group "can therefore be used". | `invalid` is a WriteProtected flag only; no consumer checks it before using the stream — an invalid stream simply has no `api_filter` and makes `ProductStreamBuilder` throw `NoFilterException`. | `Content/ProductStream/Service/ProductStreamBuilder.php` (parseFilters) |
| Groups "are automatically updated when new products meet the selected conditions". | True for the four live consumers, which re-evaluate the filters per query; membership for the cart rule is a materialised table refreshed asynchronously by `product_stream_mapping.indexer`, so rule matching is not live. | `Content/Product/DataAbstractionLayer/ProductStreamUpdater.php:56` |
| "Keep matching variants grouped" is presented without a version qualifier in the suite's fact, and the docs page carrying it is declared from 6.7.13.0. | The `display_as_group` field does not exist in 6.6.10.0 at all; it is 6.7-only. | `https://github.com/shopware/shopware/blob/v6.6.10.0/src/Core/Content/ProductStream/ProductStreamDefinition.php` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| Dynamic product groups are managed under **Catalogues > Dynamic product groups** and assemble products by rule-based conditions instead of manual assignment; a unique **Name** is required. | rewritten | The module and the rule-based assembly are confirmed (`sw-product-stream`, `product_stream` + `product_stream_filter`), and the fact now states the mechanism that decides usability: the indexer compiles the filter rows into the WriteProtected `api_filter` and flags `invalid`. "A unique **Name** is required" was dropped — no lane shows a Required or unique constraint on the stream name. |
| In **Conditions** a property and a condition are chained with **AND** or **OR** or nested via **SUB-CONDITION** (nesting can continue indefinitely), the **Preview** button shows which products currently match, and multi-value properties support the operators Is equal to / Is not equal to / Is equal to any of / Is not equal to any of / Is equal to all of / Is not equal to all of. | rewritten | Nesting is confirmed by the `static`/`stream` filter types with a children association, and the preview by its own admin route; both are folded into fact 1. The six-operator enumeration was removed: no lane verified the admin operator list, and the two in-force merchant pages disagree about whether the list is unconditional (v1-2-2-0.md:47) or property-dependent (v1-3-0-0.md:48). |
| **Keep matching variants grouped** keeps matching variants under their main product in categories, cross-selling and CMS product sliders; the finished group is assigned to a category (dynamic content), a product comparison feed, or a product slider element in the **Commerce** block category of Shopping Experiences. | split and corrected | The option is 6.7-only — absent from the 6.6.10.0 definition — so the version delta is now stated explicitly (fact 3) with its mechanism (`STATE_SKIP_ADD_GROUPING`), and the `internal` flag is named alongside. The list of use sites moved to fact 2 and grew from three to the five the code shows, with the live-evaluation vs materialised-mapping split that decides whether an answer is usable. |
