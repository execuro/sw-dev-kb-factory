# `func-04` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `func-04` · `func` · `Merchant` |
| Version | `6.6` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-1011-find-cases-that-are-not` |
| Core version | `6.7.13.0` (installed); the Migration Assistant facts are read from `shopware/SwagMigrationAssistant` at `refs/heads/6.6.x`, the branch matching the 6.6 pin — the plugin is **not** part of core |

**Query:** What does the Shopware Migration Assistant transfer automatically from Shopware 5, and what has to be mapped by hand before the migration starts?

**Expected answer — every fact an answer must contain:**

1. The Migration Assistant is a separate plugin (`shopware/SwagMigrationAssistant`), not part of Shopware core, and it exposes what can be transferred as DataSelections: `basicSettings`, `products`, `customersOrders`, `media`, `newsletterRecipient`, `productReview`, `promotion`, `seoUrl` and `wishlist`. `basicSettings` is the mandatory base selection (priority -100, `BASIC_DATA_TYPE`) and carries languages, categories, customer groups (with their attributes), currencies, sales channels and number ranges. `[code: SwagMigrationAssistant@6.6.x src/Profile/Shopware/DataSelection/ (listing); src/Profile/Shopware/DataSelection/BasicSettingsDataSelection.php:49-62]`
2. Eight things require premapping in the Shopware 5 profiles — payment methods, salutations, order states, order delivery states, transaction states, newsletter recipient status, a default delivery time and a default shipping availability rule. Premapping is mandatory and enforced server-side: `RunService::startMigrationRun` throws `premappingIsIncomplete` if any entry still has an empty `destinationUuid`. Order states are pre-filled from a hardcoded translation table, and preselection only fills entries that are still empty, so a manual choice is never overwritten. `[code: SwagMigrationAssistant@6.6.x src/Profile/Shopware/Premapping/ (listing); src/Migration/Run/RunService.php:93-95,270-284; src/Profile/Shopware/Premapping/OrderStateReader.php:152-200]`
3. Payment methods are **not** migrated as entities — there is no `PaymentMethodDataSet`, only a `PaymentMethodReader` premapping, so each Shopware 5 payment means must be pointed at an existing Shopware 6 payment method by hand; shipping methods, by contrast, do have a `ShippingMethodDataSet` and are migrated with `customersOrders`. `default_delivery_time` and `default_shipping_availability_rule` are synthetic single rows with no Shopware 5 counterpart at all, so the target entities must exist in Shopware 6 first. No DataSet exists for plugins, themes, templates, shopping worlds or B2B Suite data — none of it is transferred. `[code: SwagMigrationAssistant@6.6.x src/Profile/Shopware/DataSelection/DataSet/ (listing); src/Profile/Shopware/Premapping/PaymentMethodReader.php; src/Profile/Shopware/Premapping/DeliveryTimeReader.php:27,94; src/Profile/Shopware/Premapping/DefaultShippingAvailabilityRuleReader.php:27,94]`

**Official reference URL:** https://docs.shopware.com/en/migration-en/what-is-migrated
<!-- expected:end -->

## Evidence — code (decisive)

All plugin citations are `shopware/SwagMigrationAssistant` at `refs/heads/6.6.x`. The plugin is not installed in this project (`vendor/shopware` holds only administration, core, deployment-helper and storefront; `custom/plugins` is empty).

| fact | citation | excerpt |
| --- | --- | --- |
| Four Shopware 5 profile variants plus a shared profile | `src/Profile/` listing | `Shopware  Shopware54  Shopware55  Shopware56  Shopware57  Shopware6` |
| Nine shipped DataSelections | `src/Profile/Shopware/DataSelection/` listing | `BasicSettingsDataSelection.php  CustomerAndOrderDataSelection.php  MediaDataSelection.php  NewsletterRecipientDataSelection.php  ProductDataSelection.php  ProductReviewDataSelection.php  PromotionDataSelection.php  SeoUrlDataSelection.php  WishlistDataSelection.php` |
| basicSettings is mandatory and its content | `src/Profile/Shopware/DataSelection/BasicSettingsDataSelection.php:49-62` | `-100, true, DataSelectionStruct::BASIC_DATA_TYPE` / `new LanguageDataSet(), new CategoryAttributeDataSet(), new CategoryDataSet(), new CustomerGroupAttributeDataSet(), new CustomerGroupDataSet(), new CurrencyDataSet(), new SalesChannelDataSet(), new NumberRangeDataSet(),` |
| Products selection content | `src/Profile/Shopware/DataSelection/ProductDataSelection.php` | `new MediaFolderDataSet(), new ProductAttributeDataSet(), … new CrossSellingDataSet(), new MainVariantRelationDataSet(),` |
| Customers & orders selection content | `src/Profile/Shopware/DataSelection/CustomerAndOrderDataSelection.php` | `new CustomerDataSet(), new ShippingMethodDataSet(), new OrderDataSet(), new OrderDocumentDataSet(),` |
| Premapping is a hard gate on starting a run | `src/Migration/Run/RunService.php:93-95,270-284` | `if (!$this->isPremmappingValid(...)) { throw MigrationException::premappingIsIncomplete(); }` / `if ($mapping->getDestinationUuid() === '') { return false; }` |
| The eight premapping readers | `src/Profile/Shopware/Premapping/` listing | `DefaultShippingAvailabilityRuleReader.php  DeliveryTimeReader.php  NewsletterRecipientStatusReader.php  OrderDeliveryStateReader.php  OrderStateReader.php  PaymentMethodReader.php  SalutationReader.php  TransactionStateReader.php` |
| Readers are conditional on the selected data | `src/Profile/Shopware/Premapping/PaymentMethodReader.php:68-77` | `\in_array(CustomerAndOrderDataSelection::IDENTIFIER, $entityGroupNames, true) \|\| … ProductReviewDataSelection … PromotionDataSelection … WishlistDataSelection` |
| Premapping values come from Shopware 5 tables | `PaymentMethodReader.php:100`; `OrderStateReader.php:88`; `SalutationReader.php:90,99` | `$gateway->readTable($migrationContext, 's_core_paymentmeans');` / `'s_core_states'` / `'s_core_config_elements', ['name' => 'shopsalutations']` |
| Order-state preselection is hardcoded and non-destructive | `OrderStateReader.php:152-200` | `if ($item->getDestinationUuid() !== '') { continue; }` / `case -1: // cancelled` … `case 2: // completed` |
| Two synthetic premapping rows | `DeliveryTimeReader.php:27,94`; `DefaultShippingAvailabilityRuleReader.php:27,94` | `public const SOURCE_ID = 'default_delivery_time';` / `public const SOURCE_ID = 'default_shipping_availability_rule';` |
| Confirmed premapping is persisted twice; empty entries are skipped on write | `src/Migration/Service/PremappingService.php` | `if (!isset($identifier) \|\| $identifier === '') { continue; }` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| The Migration Assistant is part of core / available in this installation | absent | `vendor/shopware/` holds only administration, core, deployment-helper, storefront; `custom/plugins/` is empty |
| Plugins, themes or template customisations are migrated | absent | `src/Profile/Shopware/DataSelection/DataSet/` contains no plugin, theme, template or config DataSet |
| Payment methods are transferred as entities | absent | No `PaymentMethodDataSet`; payment methods exist only as a premapping reader. Shipping methods do have a `ShippingMethodDataSet` |
| Premapping is only a UI convenience and a run can start without it | absent | `RunService::startMigrationRun` throws before the run is created — `src/Migration/Run/RunService.php:93-95` |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| Admin-side mirror of the same completeness rule | `tests/Jest/src/module/swag-migration/store/migration.store.spec.js` (default branch) |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| Customers migrated even when only another data set was selected | Core 6.7.8.2 / plugin 16.1.1 | closed | https://github.com/shopware/shopware/issues/15881 |
| SW5 ≤ 5.4 order migration fails on `invoice_shipping_tax_rate` | SW5 ≤ 5.4 | closed | https://github.com/shopware/shopware/issues/4714 |
| `product_configurator_setting.position` not migrated | SW5 → SW6 | closed | https://github.com/shopware/shopware/issues/4765 |
| Shipment tracking numbers not migrated | unclear | closed | https://github.com/shopware/shopware/issues/5621 |
| Merchants miss that the Migration Connector plugin is needed on the SW5 side | 6.6 era | open | https://github.com/shopware/shopware/issues/10633 |
| Plugin CHANGELOG records repeated premapping and custom-field fixes — behaviour depends on the plugin version, not only the core version | plugin-version dependent | merged | https://github.com/shopware/SwagMigrationAssistant/blob/trunk/CHANGELOG.md |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Is the Migration Assistant in this source tree at all? | code | No — a separately versioned plugin; the case is ground-truthed against `refs/heads/6.6.x` of that repo, stated in the header |
| Which premapping readers exist for the Shopware 5 profile? | code | The eight listed in fact 2 |
| Must premapping be complete before a run starts? | code | Yes — `premappingIsIncomplete` is thrown before the run is created |
| Does the SW5 order converter still read `invoice_shipping_tax_rate` unconditionally? | not settled | Converters were not read field by field; no fact above asserts per-field converter behaviour |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| Basic data is mandatory, everything else selectable | "The basic data is mandatory, everything else can be selected as needed." | merchant `migration-en/what-is-migrated/v1-0-0-0.md` | yes — priority -100, `BASIC_DATA_TYPE`, `true` |
| Payment and shipping methods need mapping and must exist in Shopware 6 first | "Not everything is migrated automatically, some things like payment methods and shipping methods need to be mapped." | merchant `migration-en/what-is-migrated/v1-0-0-0.md` | partially — payment methods yes; shipping methods have a `ShippingMethodDataSet` and are migrated |
| Exactly five fields must be mapped by hand: payment methods, standard payment method, salutation, delivery time, standard delivery time | (bullet list) | merchant `migration-en/what-is-migrated/v1-0-0-0.md` | no — code shows eight premapping readers |
| Products selection content | "Products, Properties, Product options, Product properties, Translations, Cross-selling, Main variant relations" | merchant `migration-en/what-is-migrated/v1-0-0-0.md` | yes — matches `ProductDataSelection` |
| Customers & orders content | "Customers, Shipping methods, Orders, Order documents" | merchant `migration-en/what-is-migrated/v1-0-0-0.md` | yes — matches `CustomerAndOrderDataSelection` |
| Mapping cannot be redone after a reset | "even if you reset the migration you can't map the fields again" | merchant `migration-en/what-is-migrated/v1-0-0-0.md` | not checked |
| B2B Suite data cannot be transferred | "A transfer of data from the B2B Suite from Shopware 5 to Shopware 6 is not possible." | merchant `migration-en/what-is-migrated/v1-1-0-0.md` (6.7 page only) | yes, indirectly — no such DataSet exists in the 6.6.x DataSet listing |
| The extension must be installed on both the SW6 target and the SW5 source shop | "It is also necessary to install the extension **Migration Assistant** in your Shopware 5 Shop" | merchant `migration-en/Migrationprocess/v1-0-0-0.md` | not checked — gateway requirements were not read |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| The 6.6 page lists five fields to map by hand (payment methods, standard payment method, salutation, delivery time, standard delivery time) | Eight premapping readers exist: payment methods, salutations, order states, order delivery states, transaction states, newsletter recipient status, default delivery time, default shipping availability rule — and there is no separate "standard payment method" reader | `src/Profile/Shopware/Premapping/` listing at `refs/heads/6.6.x` |
| The docs list only five DataSelections in scope for the answer (Basic data, Products, Customers & orders, Promotions, SEO URLs, Product reviews) | Nine selections ship, including `media`, `newsletterRecipient` and `wishlist` | `src/Profile/Shopware/DataSelection/` listing |
| The docs describe premapping as part of a "data check" that surfaces unassigned data | It is a hard server-side precondition: the run is refused with `premappingIsIncomplete` | `src/Migration/Run/RunService.php:93-95` |
| Shipping methods appear both as automatically migrated and as needing manual recreation across the doc pages | A `ShippingMethodDataSet` exists and runs with `customersOrders`; what has no DataSet is the shipping *cost* model | `src/Profile/Shopware/DataSelection/CustomerAndOrderDataSelection.php` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| The mandatory Basic data group covers Categories, Customer groups, Currencies, Sales channels and Number ranges; further groups are Products, Customers & orders, Promotions, SEO URLs and Product reviews. | replaced | Correct as far as it went but incomplete: `basicSettings` also carries languages and the category/customer-group attribute sets, and four further selections ship (`media`, `newsletterRecipient`, `wishlist` in addition to those listed). |
| Payment methods, Standard Payment Method, Salutation, Delivery time and Standard delivery time must be mapped manually before the migration, and those target entries have to exist in Shopware 6 first. | replaced | The docs' five-item list is wrong against code: there are eight premapping readers and no separate "standard payment method" reader. The "must exist in Shopware 6 first" half is retained in new fact 3, backed by the two synthetic premapping rows. |
| B2B Suite data cannot be transferred from Shopware 5 to Shopware 6, and fields cannot be re-mapped after a reset — the migration must be deleted and recreated. | split | The B2B half is retained in new fact 3 as part of the code-backed absence of any such DataSet. The re-mapping-after-reset half is removed: it is a code-expressible claim the code lane did not check, so it is not admissible as `[docs-only]` context. |
