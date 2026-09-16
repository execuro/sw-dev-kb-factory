# KB quality report — mcp-wiki-2026-09-13-1150

## Run

| | |
| --- | --- |
| Run | `mcp-wiki-2026-09-13-1150` (`mcp-wiki`) |
| Options | `mcp-wiki` |
| Corpus | wiki — fingerprint: lastBuilt `2026-09-07`, treeHash `836a72be5d89…`, 1569 pages |
| Probe | `kb_status corpus.name == wiki`, entry points present: `platform/index.md`; layers: platform=implemented, marketplace=planned, project=planned |
| Model | inherited (not pinned) |
| Generated | 2026-09-13T12:45:27Z |
| Cases run | 100 of 100 (`all`) |
| Yardstick | cases.md `ef932d8e`, scoring-rubric.md `54864fb4`, scorer-brief.md `1456b9ec`, auditor-brief.md `4c2c6fdc`, accuracy-brief.md `9009d748` (rubricVersion 2) |
| Execution | discover batches of 10, scorer shards of 25 (batched) |
| Skill | `kb-factory-verify` |

## Run cost

| Option | Agents | Tokens | Tool calls | Summed agent time | Usage complete |
| --- | --- | --- | --- | --- | --- |
| mcp-wiki | 17 (10 discover, 1 audit, 4 score, 1 accuracy, 1 rescore) | 2436586 | 840 | 7228.0s | yes |

Wall-clock duration of the run: 3290.0s.

## Comparison

The headline table — one row per option, straight from `options.<option>` (no new computation). This run tested a single option; no cross-option comparison is produced here (use `compare` mode for that).

| Option | Access | Corpus | Overall | Status | Developer | Functional | Findable | Edge passed | Gap confirmed | Pass / partly / fail / unavailable / unscored | Weakest dimension |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| mcp-wiki | mcp | wiki | 79.8% | Not ready | 79.5% | 75.2% | 60 of 83 | 4 of 9 | 2 of 8 | 38 / 44 / 10 / 8 / 0 | accuracy |

## Dimension heatmap

| Dimension | Weight | mcp-wiki |
| --- | --- | --- |
| Grounding & Relevance | 25 | 96.7 |
| Accuracy vs. Expected Answer | 25 | 60.5 |
| Completeness | 15 | 61.3 |
| Citation & Traceability | 10 | 99.4 |
| Honesty | 15 | 86.0 |
| Actionability | 10 | 86.6 |

Average band score, `unscored` cases excluded (none unscored this run).

| Area | Cases | mcp-wiki average |
| --- | --- | --- |
| Admin API | 3 | 81.3 |
| Admin migration | 4 | 87.8 |
| Administration | 4 | 77.5 |
| App system | 5 | 84.8 |
| Checkout & Cart | 2 | 75.0 |
| Config & CLI | 5 | 76.2 |
| Content | 3 | 78.3 |
| Core breaking changes | 3 | 93.3 |
| DAL | 7 | 80.0 |
| Events | 6 | 73.3 |
| Gap | 8 | 82.1 |
| Hosting & ops | 5 | 70.0 |
| Merchant | 12 | 75.2 |
| Orders | 2 | 77.0 |
| Payment & Shipping | 1 | 85.0 |
| Platform upgrade | 2 | 100.0 |
| Plugin fundamentals | 1 | 80.0 |
| Services & DI | 3 | 71.7 |
| Store API & headless | 1 | 100.0 |
| Storefront | 9 | 81.6 |
| Testing | 3 | 64.0 |
| Theme | 2 | 78.5 |
| Trap | 9 | 86.7 |

## Verdict grid

| Case | Category | Area | mcp-wiki |
| --- | --- | --- | --- |
| dev-01 | dev | DAL | 55% fail ✗ |
| dev-02 | dev | Plugin fundamentals | 80% partly ✓ |
| dev-03 | dev | Store API & headless | 100% pass ✓ |
| dev-04 | dev | Content | 85% pass ✓ |
| dev-05 | dev | Theme | 77% partly ✓ |
| dev-06 | dev | Events | 80% partly ✗ |
| dev-07 | dev | DAL | 92% pass ✓ |
| dev-08 | dev | DAL | 73% partly ✓ |
| dev-09 | dev | DAL | 88% pass ✗ |
| dev-10 | dev | DAL | 77% partly ✗ |
| dev-11 | dev | Services & DI | 50% fail ✗ |
| dev-12 | dev | Services & DI | 88% pass ✗ |
| dev-13 | dev | Services & DI | 77% partly ✓ |
| dev-14 | dev | Events | 100% pass ✗ |
| dev-15 | dev | Events | 65% partly ✓ |
| dev-16 | dev | Orders | 88% pass ✓ |
| dev-17 | dev | Checkout & Cart | 73% partly ✓ |
| dev-18 | dev | Checkout & Cart | 77% partly ✗ |
| dev-19 | dev | Events | 55% fail ✓ |
| dev-20 | dev | Events | 88% pass ✓ |
| dev-21 | dev | Events | 52% fail ✓ |
| dev-22 | dev | Config & CLI | 77% partly ✓ |
| dev-23 | dev | Content | 73% partly ✓ |
| dev-24 | dev | Content | 77% partly ✓ |
| dev-25 | dev | Config & CLI | 88% pass ✓ |
| dev-26 | dev | Orders | 66% partly ✓ |
| dev-27 | dev | Storefront | 77% partly ✗ |
| dev-28 | dev | Storefront | 73% partly ✗ |
| dev-29 | dev | Storefront | 95% pass ✗ |
| dev-30 | dev | Storefront | 100% pass ✗ |
| dev-31 | dev | Storefront | 55% fail ✗ |
| dev-32 | dev | DAL | 95% pass ✗ |
| dev-33 | dev | Administration | 50% fail ✓ |
| dev-34 | dev | Administration | 100% pass ✗ |
| dev-35 | dev | Administration | 65% partly ✓ |
| dev-36 | dev | Administration | 95% pass ✗ |
| dev-37 | dev | Testing | 73% partly ✗ |
| dev-38 | dev | Testing | 73% partly ✗ |
| dev-39 | dev | Testing | 46% fail ✗ |
| dev-40 | dev | Platform upgrade | 100% pass ✗ |
| dev-41 | dev | Hosting & ops | 76% partly ✗ |
| dev-42 | dev | Config & CLI | 76% partly ✓ |
| dev-43 | dev | Admin migration | 85% pass ✓ |
| dev-44 | dev | Admin migration | 95% pass ✓ |
| dev-45 | dev | Admin migration | 95% pass ✓ |
| dev-46 | dev | Admin migration | 76% partly ✓ |
| dev-47 | dev | Payment & Shipping | 85% pass ✓ |
| dev-48 | dev | Storefront | 100% pass ✓ |
| dev-49 | dev | Core breaking changes | 80% partly ✓ |
| dev-50 | dev | Core breaking changes | 100% pass ✓ |
| dev-51 | dev | DAL | 80% partly ✗ |
| dev-52 | dev | Core breaking changes | 100% pass ✓ |
| dev-53 | dev | Theme | 80% partly ✓ |
| dev-54 | dev | Storefront | 92% pass ✓ |
| dev-55 | dev | Storefront | 50% fail ✓ |
| dev-56 | dev | Storefront | 92% pass ✓ |
| dev-57 | dev | Platform upgrade | 100% pass ✓ |
| dev-58 | dev | Hosting & ops | 88% pass ✓ |
| dev-59 | dev | Hosting & ops | 56% fail ✓ |
| dev-60 | dev | Hosting & ops | 70% partly ✓ |
| dev-61 | dev | Hosting & ops | 60% partly ✓ |
| dev-62 | dev | Config & CLI | 67% partly ✓ |
| dev-63 | dev | Config & CLI | 73% partly ✓ |
| dev-64 | dev | Admin API | 85% pass ✓ |
| dev-65 | dev | Admin API | 80% partly ✓ |
| dev-66 | dev | Admin API | 79% partly ✓ |
| dev-67 | dev | App system | 92% pass ✓ |
| dev-68 | dev | App system | 92% pass ✓ |
| dev-69 | dev | App system | 92% pass ✓ |
| dev-70 | dev | App system | 74% partly ✓ |
| dev-71 | dev | App system | 74% partly ✓ |
| func-01 | func | Merchant | 70% partly ✓ |
| func-02 | func | Merchant | 80% partly ✓ |
| func-03 | func | Merchant | 92% pass ✓ |
| func-04 | func | Merchant | 52% fail ✓ |
| func-05 | func | Merchant | 76% partly ✓ |
| func-06 | func | Merchant | 76% partly ✓ |
| func-07 | func | Merchant | 76% partly ✓ |
| func-08 | func | Merchant | 73% partly ✓ |
| func-09 | func | Merchant | 73% partly ✓ |
| func-10 | func | Merchant | 76% partly ✓ |
| func-11 | func | Merchant | 88% pass ✗ |
| func-12 | func | Merchant | 70% partly ✓ |
| edge-01 | edge | Trap | 85% unavailable – |
| edge-02 | edge | Trap | 85% unavailable – |
| edge-03 | edge | Trap | 85% unavailable – |
| edge-04 | edge | Trap | 88% pass – |
| edge-05 | edge | Trap | 100% pass – |
| edge-06 | edge | Trap | 76% partly – |
| edge-07 | edge | Trap | 85% pass – |
| edge-08 | edge | Trap | 100% pass – |
| edge-09 | edge | Trap | 76% partly – |
| gap-01 | gap | Gap | 85% unavailable – |
| gap-02 | gap | Gap | 64% unavailable – |
| gap-03 | gap | Gap | 85% unavailable – |
| gap-04 | gap | Gap | 85% unavailable – |
| gap-05 | gap | Gap | 88% pass – |
| gap-06 | gap | Gap | 88% pass – |
| gap-07 | gap | Gap | 85% unavailable – |
| gap-08 | gap | Gap | 77% partly – |

## Requests and responses

What each discover agent was given and what it reported, straight from `raw/mcp-wiki/<case-id>.json` and the mechanical facts in `derived/mcp-wiki/shard-*.json` — no scores, no judgement.

### mcp-wiki

| Case | Page reached | Findability | Memory claims | Honesty | Verdict |
| --- | --- | --- | --- | --- | --- |
| dev-01 | platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-data-associations.md ≠ target (platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-complex-data-to-existing-entities.md) | fail | 0 | 100 under-reported (8→9) | fail |
| dev-02 | platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/plugin-lifecycle.md = target | pass | 0 | 100 under-reported (2→3) | partly |
| dev-03 | platform/dev/6.7/guides/plugins/plugins/framework/store-api/add-store-api-route.md = target | pass | 0 | 100 under-reported (3→4) | pass |
| dev-04 | platform/dev/6.7/guides/plugins/plugins/content/cms/add-cms-element.md = target | pass | 0 | 100 under-reported (2→3) | pass |
| dev-05 | platform/dev/6.7/guides/plugins/plugins/framework/flow/add-flow-builder-action.md ≠ target (platform/dev/6.7/guides/plugins/themes/inheritance/add-theme-inheritance.md) | pass | 0 | 0 under-reported (4→9) | partly |
| dev-06 | — ≠ target (platform/dev/6.7/guides/plugins/plugins/framework/flow/add-flow-builder-action.md) | fail | 0 | 100  | partly |
| dev-07 | platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-custom-complex-data.md = target | pass | 0 | 100 under-reported (2→3) | pass |
| dev-08 | platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-data-indexer.md ≠ target (platform/dev/6.7/guides/plugins/plugins/framework/data-handling/reading-data.md) | pass | 0 | 0 under-reported (1→5) | partly |
| dev-09 | — ≠ target (platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-data-translations.md) | fail | 0 | 100  | pass |
| dev-10 | — ≠ target (platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-data-indexer.md) | fail | 0 | 100  | partly |
| dev-11 | platform/dev/6.6/guides/plugins/plugins/plugin-fundamentals/dependency-injection.md ≠ target (platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md) | fail | 0 | 0 under-reported (10→12) | fail |
| dev-12 | — ≠ target (platform/dev/6.6/guides/plugins/plugins/plugin-fundamentals/dependency-injection.md) | fail | 0 | 100  | pass |
| dev-13 | platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md ≠ target (platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md) | pass | 0 | 0 under-reported (3→6) | partly |
| dev-14 | — ≠ target (platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md) | fail | 0 | 100  | pass |
| dev-15 | platform/dev/6.7/guides/plugins/plugins/framework/event/finding-events.md = target | pass | 0 | 100 under-reported (3→4) | partly |
| dev-16 | platform/dev/6.7/guides/plugins/plugins/checkout/order/listen-to-order-changes.md = target | pass | 0 | 100 under-reported (1→2) | pass |
| dev-17 | platform/dev/6.7/guides/plugins/plugins/checkout/cart/add-cart-processor-collector.md ≠ target (platform/dev/6.7/guides/plugins/plugins/checkout/cart/change-price-of-item.md) | pass | 0 | 0 under-reported (2→7) | partly |
| dev-18 | — ≠ target (platform/dev/6.7/guides/plugins/plugins/checkout/cart/add-cart-processor-collector.md) | fail | 1 | 100  | partly |
| dev-19 | platform/dev/6.7/guides/plugins/plugins/framework/message-queue/add-message-to-queue.md ≠ target (platform/dev/6.7/guides/plugins/plugins/framework/message-queue/add-message-handler.md) | pass | 0 | 0 under-reported (3→5) | fail |
| dev-20 | platform/dev/6.7/guides/plugins/plugins/framework/rule/add-custom-rules.md = target | pass | 0 | 100 under-reported (2→3) | pass |
| dev-21 | platform/dev/6.7/guides/plugins/plugins/framework/flow/add-flow-builder-trigger.md = target | pass | 0 | 100 under-reported (5→6) | fail |
| dev-22 | platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-plugin-configuration.md = target | pass | 0 | 100 under-reported (3→4) | partly |
| dev-23 | platform/dev/6.7/guides/plugins/plugins/content/mail/add-mail-template.md = target | pass | 0 | 100 under-reported (3→4) | partly |
| dev-24 | platform/dev/6.7/guides/plugins/plugins/content/seo/add-custom-seo-url.md = target | pass | 0 | 100 under-reported (2→3) | partly |
| dev-25 | platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-custom-commands.md = target | pass | 0 | 100 under-reported (2→3) | pass |
| dev-26 | platform/dev/6.7/guides/plugins/plugins/checkout/documents/v2/add-a-document-type.md = target | pass | 0 | 100 under-reported (4→5) | partly |
| dev-27 | platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-templates.md = target | fail | 0 | 0 under-reported (3→6) | partly |
| dev-28 | platform/dev/6.7/guides/plugins/plugins/storefront/howto/add-listing-filters.md ≠ target (platform/dev/6.7/guides/plugins/plugins/storefront/javascript/override-existing-javascript.md) | fail | 0 | 0 under-reported (3→8) | partly |
| dev-29 | — ≠ target (platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-data-to-storefront-page.md) | fail | 0 | 100  | pass |
| dev-30 | — ≠ target (platform/dev/6.7/guides/plugins/plugins/storefront/howto/add-listing-filters.md) | fail | 0 | 100  | pass |
| dev-31 | platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/using-custom-fields.md ≠ target (platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-scss-variables.md) | fail | 0 | 0 under-reported (4→8) | fail |
| dev-32 | — ≠ target (platform/dev/6.7/guides/plugins/plugins/framework/custom-field/add-custom-field.md) | fail | 0 | 100  | pass |
| dev-33 | platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-module.md = target | pass | 0 | 0 under-reported (2→6) | fail |
| dev-34 | — ≠ target (platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-components.md) | fail | 0 | 100  | pass |
| dev-35 | platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/using-data-handling.md = target | pass | 0 | 0 under-reported (2→5) | partly |
| dev-36 | — ≠ target (platform/dev/6.7/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.md) | fail | 0 | 100  | pass |
| dev-37 | platform/dev/6.7/guides/development/testing/unit/jest-admin.md ≠ target (platform/dev/6.7/guides/development/testing/unit/php-unit.md) | fail | 0 | 0 under-reported (2→7) | partly |
| dev-38 | — ≠ target (platform/dev/6.7/guides/development/testing/unit/jest-admin.md) | fail | 0 | 100  | partly |
| dev-39 | platform/dev/6.7/guides/development/testing/legacy/cypress/_index.md ≠ target (platform/dev/6.7/guides/development/testing/e2e-playwright/install-configure.md) | fail | 0 | 100  | fail |
| dev-40 | platform/dev/6.7/guides/upgrades-migrations/upgrade-shopware.md = target | fail | 0 | 100 under-reported (4→5) | pass |
| dev-41 | platform/dev/6.7/guides/hosting/_index.md = target | fail | 0 | 100 under-reported (14→15) | partly |
| dev-42 | platform/dev/6.7/products/tools/cli/project-commands/upgrade.md = target | pass | 0 | 100 under-reported (3→4) | partly |
| dev-43 | platform/dev/6.7/guides/upgrades-migrations/administration/vite.md = target | pass | 0 | 100 under-reported (2→3) | pass |
| dev-44 | platform/dev/6.7/guides/upgrades-migrations/administration/vue3.md = target | pass | 0 | 100 under-reported (3→5) | pass |
| dev-45 | platform/dev/6.7/guides/upgrades-migrations/administration/pinia.md = target | pass | 0 | 100 under-reported (1→2) | pass |
| dev-46 | platform/dev/6.7/guides/upgrades-migrations/administration/meteor-components.md = target | pass | 0 | 100 under-reported (1→2) | partly |
| dev-47 | platform/dev/6.7/guides/plugins/plugins/checkout/payment/add-payment-plugin.md = target | pass | 0 | 100 under-reported (2→3) | pass |
| dev-48 | platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md = target | pass | 0 | 100 under-reported (2→3) | pass |
| dev-49 | platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-controller.md = target | pass | 0 | 100 under-reported (2→3) | partly |
| dev-50 | platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-scheduled-task.md = target | pass | 0 | 100 under-reported (2→3) | pass |
| dev-51 | platform/dev/6.7/guides/plugins/plugins/framework/data-handling/entities-via-attributes.md = target | fail | 0 | 100 under-reported (8→9) | partly |
| dev-52 | platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md = target | pass | 0 | 100 under-reported (1→2) | pass |
| dev-53 | platform/dev/6.7/guides/plugins/themes/configuration/theme-configuration.md = target | pass | 0 | 100 under-reported (3→4) | partly |
| dev-54 | platform/dev/6.7/guides/plugins/plugins/storefront/advanced/add-cookie-to-manager.md = target | pass | 0 | 100 under-reported (2→3) | pass |
| dev-55 | platform/dev/6.7/guides/development/accessibility/storefront-accessibility.md = target | pass | 0 | 100 under-reported (2→4) | fail |
| dev-56 | platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-header-footer.md = target | pass | 0 | 100 under-reported (2→3) | pass |
| dev-57 | platform/dev/6.7/products/extensions/b2b-suite-migration/execution/running-migration.md = target | pass | 0 | 100 under-reported (3→4) | pass |
| dev-58 | platform/dev/6.7/guides/hosting/infrastructure/redis.md = target | pass | 0 | 100 under-reported (4→5) | pass |
| dev-59 | platform/dev/6.7/guides/hosting/infrastructure/reverse-http-cache.md = target | pass | 0 | 100 under-reported (2→3) | fail |
| dev-60 | platform/dev/6.7/guides/hosting/infrastructure/message-queue.md = target | pass | 0 | 100 under-reported (2→3) | partly |
| dev-61 | platform/dev/6.7/guides/hosting/infrastructure/elasticsearch/elasticsearch-setup.md = target | pass | 0 | 100 under-reported (5→6) | partly |
| dev-62 | platform/dev/6.7/guides/hosting/configurations/shopware/static-system-config.md ≠ target (platform/dev/6.7/guides/hosting/configurations/shopware/environment-variables.md) | pass | 1 | 100 under-reported (5→6) | partly |
| dev-63 | platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md ≠ target (platform/dev/6.7/resources/references/core-reference/commands-reference.md) | pass | 0 | 100 under-reported (3→4) | partly |
| dev-64 | platform/dev/6.7/guides/development/integrations-api/_index.md ≠ target (platform/dev/6.7/guides/development/integrations-api/auth-api-requests.md) | pass | 1 | 100 under-reported (3→4) | pass |
| dev-65 | platform/dev/6.7/guides/development/integrations-api/search-criteria.md = target | pass | 0 | 100 under-reported (1→2) | partly |
| dev-66 | platform/dev/6.7/guides/development/integrations-api/request-headers.md = target | pass | 0 | 100 under-reported (1→2) | partly |
| dev-67 | platform/dev/6.7/guides/plugins/apps/app-base-guide.md = target | pass | 0 | 100 under-reported (3→4) | pass |
| dev-68 | platform/dev/6.7/guides/plugins/apps/lifecycle/app-registration-setup.md = target | pass | 0 | 100 under-reported (1→2) | pass |
| dev-69 | platform/dev/6.7/guides/plugins/apps/lifecycle/webhook.md = target | pass | 0 | 100 under-reported (1→2) | pass |
| dev-70 | platform/dev/6.7/guides/plugins/apps/checkout/payment.md = target | pass | 0 | 100 under-reported (2→3) | partly |
| dev-71 | platform/dev/6.7/guides/plugins/apps/custom-data/custom-entities.md = target | pass | 0 | 100 under-reported (4→5) | partly |
| func-01 | platform/func/first-steps/first-run-wizard.md ≠ target (platform/func/catalogues/products.md) | pass | 0 | 100 under-reported (6→7) | partly |
| func-02 | platform/func/shopware-6-de/saas/Shipping.md ≠ target (platform/func/settings/rules.md) | pass | 0 | 100 under-reported (3→5) | partly |
| func-03 | platform/func/marketing/promotions.md = target | pass | 0 | 100 under-reported (2→4) | pass |
| func-04 | platform/func/migration-en/what-is-migrated.md = target | pass | 0 | 100 under-reported (1→2) | fail |
| func-05 | platform/func/settings/saleschannel.md = target | pass | 0 | 100 under-reported (3→4) | partly |
| func-06 | platform/func/settings/Flow-Builder.md = target | pass | 0 | 100 under-reported (1→2) | partly |
| func-07 | platform/func/shopware-en/settings/importexport.md = target | pass | 0 | 100 under-reported (1→2) | partly |
| func-08 | platform/func/settings/custom-fields.md = target | pass | 0 | 100 under-reported (2→3) | partly |
| func-09 | platform/func/settings/Paymentmethods.md = target | pass | 0 | 0 under-reported (2→3) | partly |
| func-10 | platform/func/settings/system/integrationen.md ≠ target (platform/func/shopware-6-de/Catalogues/Dynamicproductgroups.md) | pass | 0 | 100 under-reported (4→7) | partly |
| func-11 | — ≠ target (platform/func/settings/system/integrationen.md) | fail | 0 | 100  | pass |
| func-12 | platform/func/extensions/customer-specific-pricing.md ≠ target (platform/func/extensions/shopware-commercial.md) | pass | 0 | 100  | partly |
| edge-01 | platform/hubs/store-api.md n/a | n/a | 0 | 100 under-reported (6→7) | unavailable |
| edge-02 | platform/hubs/dependency-injection.md n/a | n/a | 0 | 100 under-reported (3→4) | unavailable |
| edge-03 | platform/hubs/data-abstraction-layer.md n/a | n/a | 0 | 100 under-reported (3→4) | unavailable |
| edge-04 | platform/dev/6.7/guides/plugins/plugins/framework/store-api/_index.md ≠ target (platform/dev/6.6/guides/integrations-api/general-concepts/api-versioning.md) | n/a | 0 | 100 under-reported (3→5) | pass |
| edge-05 | platform/dev/6.7/products/tools/mcp-server/intro.md = target | n/a | 0 | 100 under-reported (4→5) | pass |
| edge-06 | platform/func/migration-en/magento-keywords.md = target | n/a | 1 | 100 under-reported (3→5) | partly |
| edge-07 | platform/dev/6.6/products/pwa.md = target | n/a | 0 | 100 under-reported (4→5) | pass |
| edge-08 | platform/func/settings/Flow-Builder.md n/a | n/a | 1 | 100 under-reported (5→14) | pass |
| edge-09 | — ≠ target (platform/func/settings/Business-Events.md) | n/a | 0 | 100  | partly |
| gap-01 | platform/dev/6.7/guides/plugins/plugins/framework/store-api/add-store-api-route.md n/a | n/a | 0 | 100 under-reported (11→14) | unavailable |
| gap-02 | platform/dev/6.7/guides/upgrades-migrations/upgrade-shopware.md n/a | n/a | 0 | 0 under-reported (8→12) | unavailable |
| gap-03 | platform/dev/6.7/concepts/api/admin-api.md n/a | n/a | 0 | 100  | unavailable |
| gap-04 | platform/dev/6.7/guides/upgrades-migrations/_index.md n/a | n/a | 0 | 100 under-reported (3→4) | unavailable |
| gap-05 | platform/dev/6.7/guides/plugins/plugins/storefront/advanced/add-caching-to-custom-controller.md n/a | n/a | 0 | 100 under-reported (6→7) | pass |
| gap-06 | platform/dev/6.7/guides/plugins/apps/checkout/shipping-methods.md n/a | n/a | 1 | 100 under-reported (7→8) | pass |
| gap-07 | platform/dev/6.7/guides/plugins/plugins/content/media/_index.md n/a | n/a | 0 | 100 under-reported (3→4) | unavailable |
| gap-08 | platform/hubs/store-api.md n/a | n/a | 1 | 100 under-reported (7→8) | partly |

## Scores by case

### mcp-wiki

| Case | Grounding | Accuracy | Completeness | Citation | Honesty | Actionability | Total | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dev-01 | 70 | 0 | 40 | 100 | 100 | 70 | 55% | fail |
| dev-02 | 100 | 70 | 40 | 100 | 100 | 70 | 80% | partly |
| dev-03 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-04 | 100 | 70 | 70 | 100 | 100 | 70 | 85% | pass |
| dev-05 | 100 | 70 | 100 | 100 | 0 | 100 | 77% | partly |
| dev-06 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| dev-07 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-08 | 100 | 70 | 70 | 100 | 0 | 100 | 73% | partly |
| dev-09 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-10 | 100 | 40 | 70 | 100 | 100 | 70 | 77% | partly |
| dev-11 | 70 | 40 | 40 | 100 | 0 | 70 | 50% | fail |
| dev-12 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-13 | 100 | 70 | 100 | 100 | 0 | 100 | 77% | partly |
| dev-14 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-15 | 70 | 40 | 40 | 100 | 100 | 70 | 65% | partly |
| dev-16 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-17 | 100 | 70 | 70 | 100 | 0 | 100 | 73% | partly |
| dev-18 | 70 | 70 | 70 | 100 | 100 | 70 | 77% | partly |
| dev-19 | 70 | 40 | 70 | 100 | 0 | 70 | 55% | fail |
| dev-20 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-21 | 70 | 0 | 40 | 100 | 100 | 40 | 52% | fail |
| dev-22 | 100 | 40 | 70 | 100 | 100 | 70 | 77% | partly |
| dev-23 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| dev-24 | 100 | 40 | 70 | 100 | 100 | 70 | 77% | partly |
| dev-25 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-26 | 100 | 0 | 40 | 100 | 100 | 100 | 66% | partly |
| dev-27 | 100 | 70 | 100 | 100 | 0 | 100 | 77% | partly |
| dev-28 | 100 | 70 | 70 | 100 | 0 | 100 | 73% | partly |
| dev-29 | 100 | 100 | 70 | 100 | 100 | 100 | 95% | pass |
| dev-30 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-31 | 100 | 40 | 0 | 100 | 0 | 100 | 55% | fail |
| dev-32 | 100 | 100 | 70 | 100 | 100 | 100 | 95% | pass |
| dev-33 | 70 | 40 | 40 | 100 | 0 | 70 | 50% | fail |
| dev-34 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-35 | 100 | 40 | 70 | 100 | 0 | 100 | 65% | partly |
| dev-36 | 100 | 100 | 70 | 100 | 100 | 100 | 95% | pass |
| dev-37 | 100 | 70 | 70 | 100 | 0 | 100 | 73% | partly |
| dev-38 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| dev-39 | 70 | 0 | 0 | 100 | 100 | 40 | 46% | fail |
| dev-40 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-41 | 100 | 40 | 40 | 100 | 100 | 100 | 76% | partly |
| dev-42 | 100 | 40 | 40 | 100 | 100 | 100 | 76% | partly |
| dev-43 | 100 | 40 | 100 | 100 | 100 | 100 | 85% | pass |
| dev-44 | 100 | 100 | 70 | 100 | 100 | 100 | 95% | pass |
| dev-45 | 100 | 100 | 70 | 100 | 100 | 100 | 95% | pass |
| dev-46 | 100 | 40 | 40 | 100 | 100 | 100 | 76% | partly |
| dev-47 | 100 | 40 | 100 | 100 | 100 | 100 | 85% | pass |
| dev-48 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-49 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| dev-50 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-51 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| dev-52 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-53 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| dev-54 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-55 | 100 | 0 | 0 | 100 | 100 | 0 | 50% | fail |
| dev-56 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-57 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-58 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-59 | 100 | 0 | 40 | 100 | 100 | 0 | 56% | fail |
| dev-60 | 100 | 40 | 40 | 100 | 100 | 40 | 70% | partly |
| dev-61 | 100 | 0 | 40 | 100 | 100 | 40 | 60% | partly |
| dev-62 | 70 | 40 | 70 | 100 | 100 | 40 | 67% | partly |
| dev-63 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| dev-64 | 70 | 70 | 100 | 100 | 100 | 100 | 85% | pass |
| dev-65 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| dev-66 | 100 | 40 | 100 | 100 | 100 | 40 | 79% | partly |
| dev-67 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-68 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-69 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-70 | 100 | 40 | 70 | 100 | 100 | 40 | 74% | partly |
| dev-71 | 100 | 40 | 70 | 100 | 100 | 40 | 74% | partly |
| func-01 | 100 | 40 | 40 | 100 | 100 | 40 | 70% | partly |
| func-02 | 100 | 70 | 40 | 100 | 100 | 70 | 80% | partly |
| func-03 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| func-04 | 70 | 0 | 40 | 100 | 100 | 40 | 52% | fail |
| func-05 | 100 | 40 | 40 | 100 | 100 | 100 | 76% | partly |
| func-06 | 100 | 40 | 40 | 100 | 100 | 100 | 76% | partly |
| func-07 | 100 | 40 | 40 | 100 | 100 | 100 | 76% | partly |
| func-08 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| func-09 | 100 | 70 | 70 | 100 | 0 | 100 | 73% | partly |
| func-10 | 100 | 40 | 40 | 100 | 100 | 100 | 76% | partly |
| func-11 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| func-12 | 100 | 40 | 0 | 100 | 100 | 100 | 70% | partly |
| edge-01 | 100 | 100 | 0 | 100 | 100 | 100 | 85% | unavailable |
| edge-02 | 100 | 100 | 0 | 100 | 100 | 100 | 85% | unavailable |
| edge-03 | 100 | 100 | 0 | 100 | 100 | 100 | 85% | unavailable |
| edge-04 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| edge-05 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| edge-06 | 100 | 40 | 40 | 100 | 100 | 100 | 76% | partly |
| edge-07 | 100 | 70 | 70 | 100 | 100 | 70 | 85% | pass |
| edge-08 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| edge-09 | 100 | 40 | 40 | 100 | 100 | 100 | 76% | partly |
| gap-01 | 100 | 100 | 0 | 100 | 100 | 100 | 85% | unavailable |
| gap-02 | 100 | 100 | 0 | 40 | 0 | 100 | 64% | unavailable |
| gap-03 | 100 | 100 | 0 | 100 | 100 | 100 | 85% | unavailable |
| gap-04 | 100 | 100 | 0 | 100 | 100 | 100 | 85% | unavailable |
| gap-05 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| gap-06 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| gap-07 | 100 | 100 | 0 | 100 | 100 | 100 | 85% | unavailable |
| gap-08 | 100 | 40 | 70 | 100 | 100 | 70 | 77% | partly |

`unavailable` means the Source-absent override applied — the corpus had nothing and the agent honestly reported that; it is not a failure.

## Failures and official references

- **dev-01 (mcp-wiki)** — fail, 55%
  - Answer instructs implementing getDefinitionClass() returning ProductDefinition::class as the 6.7 recipe; the case is explicitly designed to fail this exact trap since 6.7.13.0 removed getDefinitionClass() and made getEntityName() the sole abstract method.
  - Findability fail: target (add-complex-data-to-existing-entities.md) never read for the 6.7 side; agent read the 6.6 version plus an unrelated 6.7 associations page (add-data-associations.md), which does not cover the EntityExtension mechanism the query asks about.
  - Missing the association-field-type restriction (only AssociationField/Runtime/FkField-with-companion allowed) required by expected fact 2.
  - Official: code: Framework/DataAbstractionLayer/EntityExtension.php:46 — "abstract public function getEntityName(): string;"
- **dev-02 (mcp-wiki)** — partly, 80%
  - Hooks are covered but keepUserData() is described only conceptually; the read-only getter/no-setter fact and the specific four items core removes only when keepUserData()===false are never stated.
  - PluginLifecycleService install/uninstall orchestration and the CLI flags (plugin:install --activate, plugin:uninstall --keep-user-data) are not mentioned at all.
  - Official: code: Framework/Plugin/PluginLifecycleService.php:222-251 — "keepUserData gates exactly four core cleanup steps; assets and the plugin's uninstall() hook run regardless"
- **dev-05 (mcp-wiki)** — partly, 77%
  - selfReportDelta shows 3 unreported tool calls (reported 4 vs ground-truth 9) — honesty scored 0 per rubric for a materially under-reported call log.
  - All three theme-inheritance facts (theme.json arrays, views ordering, SCSS concatenation/!default ordering) are substantively covered, with only the !default mechanism stated loosely rather than by name.
- **dev-06 (mcp-wiki)** — partly, 80%
  - FlowAction class shape, tag/key/priority, and handleFlow data access are covered correctly.
  - Admin-side registration is described as overriding sw-flow-sequence-action + snippet labels, rather than the actual flowBuilderService.addActionNames()/addLabels()/addIcons()/addGroups()/addActionGroupMapping() singleton API — a materially different (and unverified) registration mechanism.
  - DelayableAction/TransactionalAction marker interfaces are never mentioned.
  - Official: code: Content/Flow/Dispatching/Action/FlowAction.php:9-19 — "abstract public function requirements(): array; abstract public function handleFlow(StorableFlow $flow): void; abstract public static function getName(): string;"
- **dev-08 (mcp-wiki)** — partly, 73%
  - selfReportDelta shows 2 unreported read_doc calls (reported 1 vs actual 5) — honesty scored 0 per rubric.
  - The trap fact (EntityRepositoryInterface removed in 6.7, must type-hint EntityRepository) is never addressed even though the answer correctly frames the query's Doctrine findBy() trap conceptually.
  - search()/Criteria/addAssociation/addSorting/searchIds()/tie-breaker guidance all substantially match the expected facts.
  - Official: code: Framework/DataAbstractionLayer/EntityRepository.php:62-68 — "public function search(Criteria $criteria, Context $context): EntitySearchResult"
- **dev-10 (mcp-wiki)** — partly, 77%
  - Only 4 of the 6 abstract EntityIndexer members are named (getName/iterate/update/handle); getTotal() and getDecorated() are omitted, which would leave a real subclass failing to compile — a materially incomplete recipe.
  - The DISABLE_INDEXING re-entrancy guidance and bin/console dal:refresh:index for a full reindex both match the expected facts.
  - Official: code: Framework/DataAbstractionLayer/Indexing/EntityIndexer.php:9-39 — "abstract public function iterate(?array $offset): ?EntityIndexingMessage;"
- **dev-11 (mcp-wiki)** — fail, 50%
  - selfReportDelta shows an unreported read_doc call — honesty scored 0 per rubric.
  - Claims services.php 'replaces' services.xml for Shopware 6.7, but at the pinned 6.7.13.0 version XML still loads with no deprecation and is what the scaffolding still emits; the deprecation only starts at 6.7.14.0 — a materially wrong, version-sensitive claim the case is designed to catch.
  - Autowiring-is-not-default-and-repository-alias facts (fact 2/3) are not clearly stated.
  - Official: code: Framework/Bundle.php:212-231 — "foreach ($this->getServicesFilePathArray($this->getPath() . '/Resources/config/services.*') as $path) { $delegatingLoader->load($path); }"
- **dev-13 (mcp-wiki)** — partly, 77%
  - selfReportDelta shows 2 unreported calls — honesty scored 0 per rubric.
  - All three facts (extension-point pre/post/error events as a first check, decoration mechanics with .inner, abstract-class + DecorationPatternException contract) are covered well.
- **dev-15 (mcp-wiki)** — partly, 65%
  - Recommends 'find it by searching for @Event' as a discovery technique; the case's own evidence confirms the @Event annotation has zero occurrences under vendor/shopware and is a dead search term — a materially wrong/misleading recommendation.
  - The pre-render nature of StorefrontRenderEvent and the route-suffix taxonomy ({route}.request/.response/.render/.encode) are covered reasonably well.
  - debug:event-dispatcher's limitation (lists only registered listeners, not dispatched events) and debug:business-events are not mentioned.
  - Official: code: absence table — Framework/Routing/RouteEventSubscriber.php:27-33 and vendor/shopware grep — "The @Event annotation marks event classes in the 6.7 source — absent; grep -rn "@Event" vendor/shopware returns 0 matches"
- **dev-17 (mcp-wiki)** — partly, 73%
  - selfReportDelta shows 4 unreported calls — honesty scored 0 per rubric.
  - Combined collector/processor class, priority 4500 (matches the documented number), and QuantityPriceDefinition construction are all covered correctly.
  - The customPrice extension + allowProductPriceOverwrites permission gating (fact 3's central caveat about who can actually pin a price) is not mentioned.
  - Official: code: Checkout/Cart/CartProcessorInterface.php:12 — "process(CartDataCollection $data, Cart $original, Cart $toCalculate, SalesChannelContext $context, CartBehavior $behavior)"
- **dev-18 (mcp-wiki)** — partly, 77%
  - Correctly states $toCalculate vs $original and the collect-fetches/process-applies split.
  - The actual duplication mechanism (CartRuleLoader's up-to-7-iteration recalculation loop feeding results back in, and LineItemCollection::add() summing quantities rather than replacing) is not explained; the answer instead cites the unrelated cart-discounts stackable/removable flags, with a clearly labelled [from memory] fallback admitting the gap.
  - The CartDataCollection-carried-forward staleness mechanism ($cart->setData($original->getData())) is not mentioned at all.
  - Official: code: Checkout/Cart/CartDataCollectorInterface.php:12 — "collect(CartDataCollection $data, Cart $original, SalesChannelContext $context, CartBehavior $behavior)"
- **dev-19 (mcp-wiki)** — fail, 55%
  - selfReportDelta shows an unreported grep_docs call — honesty scored 0 per rubric.
  - States the bus id is 'messenger.default_bus'; the confirmed id is the reverse, 'messenger.bus.default'.
  - States the invoking middleware is 'handle_messages' (plural); the case's evidence explicitly confirms the correct, singular name is 'handle_message' and flags the plural form as a known wrong claim.
  - Claims #[AsMessageHandler] alone is 'automatically registered ... no manual services.php/xml registration is needed' for a plugin handler; the confirmed fact is the opposite — Shopware never marks plugin definitions autoconfigured, so the explicit messenger.message_handler tag (or the plugin's own autoconfigure=true) is required.
  - Official: code: Framework/MessageQueue/MessageHandlerCompilerPass.php:18-41 — "MessageHandlerCompilerPass collapses the tag list to one merged tag (hand-written tag values winning)"
- **dev-21 (mcp-wiki)** — fail, 52%
  - Recommends giving the BusinessEventCollectorEvent subscriber 'a high priority (e.g. 1000) so it registers before other trigger subscribers' — this is precisely the case's documented trap; the confirmed fact states no elevated priority is needed and the collect path reads all listeners before a final name-based sort.
  - Claims StorableFlow 'replaces getAvailableData()' since 6.5.0.0; the confirmed fact states getAvailableData() is still required by FlowEventAware and still consumed by the collector in 6.7.
  - Bundle::getActionEventClasses() (the alternative, tag-free registration route) is never mentioned, and the Collection::set()-vs-add() correctness distinction is dropped.
  - Official: code: Framework/Bundle.php:121-129,197-206 — "No elevated priority is needed, and there is no service tag that registers a flow trigger."
- **dev-22 (mcp-wiki)** — partly, 77%
  - config.xml location/card structure and the field-type enumeration are covered, though the enumerated list is missing the 16th type ('price').
  - How the values are actually read back (system_config key <PluginName>.config.<field>, SystemConfigService typed getters, and defaults only being written for fields with <defaultValue>) is not mentioned at all.
  - Official: code: System/SystemConfig/Schema/config.xsd:38,41-60,84-88 — "In 6.7.13.0 the XSD enumerates exactly 16 types: text, textarea, text-editor, url, password, int, float, bool, checkbox, datetime, date, time, colorpicker, single-select, multi-select, price."
- **dev-23 (mcp-wiki)** — partly, 73%
  - States system_default 'must be 0'; the case's confirmed code evidence shows this is editorial and that 1 is actually the safer value for a type's canonical template (the idempotency lookup itself only matches system_default=1).
  - The core CreateMailTemplateTrait helper (added 6.7.8.0) is never mentioned, though the migration-based, technical_name-guarded insert pattern the answer describes is otherwise sound.
  - Official: code: Content/MailTemplate/MailTemplateDefinition.php:56 — "mail_template.system_default is a plain BoolField that no code enforces ... so 1 is the safer value ... the docs' 'must be 0' is editorial"
- **dev-24 (mcp-wiki)** — partly, 77%
  - States that a soft-deleted (is_deleted=1) seo_url row 'stays reachable, so the controller must still check whether the underlying content exists'; the case's confirmed code evidence shows every read path (SeoResolver, SeoUrlPlaceholderHandler, sitemap providers) filters is_deleted=0, so a deleted row is not reachable at all — this is the exact superseded/refuted claim the case now flags as wrong.
  - SeoUrlRouteInterface implementation, tag registration, seo_url_template row requirement, and manually calling SeoUrlUpdater::update() from a written/deleted subscriber are all covered correctly.
  - Official: code: Content/Seo/SeoUrlUpdater.php:115-126,44-53 — "the storefront SeoUrlUpdateListener subscribes only to the product, category and landing-page indexer events, so the plugin must call SeoUrlUpdater::update() itself"
- **dev-26 (mcp-wiki)** — partly, 66%
  - This is the confirmed trap case: the wiki's cataloged target IS the Document v2 page, and the case's expected answer states v2 does not exist at 6.7.13.0 (AbstractDocumentType/tag shopware.document_v2.type absent, first appears 6.7.14.0). The report builds its whole answer on the v2 recipe (AbstractDocumentType, AbstractDocumentDataProvider, shopware.document_v2.type/.provider tags) as if it were current and usable, which the case's confirmed evidence says is wrong for this pin.
  - Report does correctly state the document_type DB row + number range document_<technical_name> requirement (matches expected fact 2), but omits the legacy AbstractDocumentRenderer/document.renderer stack that is actually correct at 6.7.13.0 (fact 1) and the literal-template-path mechanism (fact 3).
  - selfReportDelta shows reported 4 vs actual 5 with no specific missing calls named — not treated as material.
  - Official: code: Checkout/DependencyInjection/documentV2.php:62-128 — "AbstractDocumentType and the tag shopware.document_v2.type do not exist in 6.7.13.0 (the class first appears at 6.7.14.0)"
- **dev-27 (mcp-wiki)** — partly, 77%
  - Answer correctly names sw_extends as the required tag (not plain extends), correctly explains multi-inheritance and why {% extends %} would drop other plugins' changes, correctly gives the identical-relative-path rule and {{ parent() }} usage — all three expected facts are present.
  - selfReportDelta shows the self-reported toolCallLog omits two grep_docs calls that the ground-truth transcript shows were made (reported 3 vs actual 6) — a materially under-reported log, so honesty is 0 regardless of the answer's own accuracy.
  - Findability fails: 4 list/grep calls occurred before the target read, over the 2-call threshold.
- **dev-28 (mcp-wiki)** — partly, 73%
  - Answer covers the extends-with-super pattern and the correct override()/async-import call, matching expected facts 2 and 3 reasonably well, but never states the exact requirement that override() is refused unless the name is already registered for that exact selector (fact 1 not clearly stated).
  - Answer adds the unresolved community claim 'each JavaScript plugin can only be overridden once' as if settled fact; expected evidence records this as an open/unclear community signal, not a code-confirmed rule — a minor imprecision.
  - selfReportDelta shows a large gap (3 reported vs 8 actual calls), with named missing calls including reads of other cases' target pages — the audit's auditNotes flag this as possible cross-case log-attribution drift, but per instructions the numbers are taken as authoritative and this counts as a materially under-reported log.
  - Official: code: storefront Resources/app/storefront/src/plugin-system/plugin.manager.js:698 — "PluginManager.override('CookiePermission', MyCookiePermission, '[data-cookie-permission]')"
- **dev-31 (mcp-wiki)** — fail, 55%
  - The agent read and answered from the alternate 'add-scss-variables-via-subscriber.md' page, describing a hand-written kernel.event_subscriber approach, instead of the declarative <css> config.xml route that the case's expected answer says is the correct out-of-the-box mechanism requiring no plugin listener at all — none of the case's three expected facts (config.xml <css> tag + hasCssValue string-only guard, bool/checkbox exclusion, !default fallback + emission order) are stated.
  - The subscriber-based approach the report describes is not itself fabricated (it is a real, documented alternate page), but it directly contradicts expected fact 1's explicit point that 'the plugin needs no listener of its own' — presenting the more complex route as necessary is a materially misleading answer to this specific query.
  - selfReportDelta shows reported 4 vs actual 8, with named missing calls including reads of what the audit flags as dev-32's target page (cross-case log-attribution drift per auditNotes) — treated as a materially under-reported log per instructions.
  - Official: code: storefront Theme/Subscriber/ThemeCompilerEnrichScssVarSubscriber.php:42-79 — "ThemeCompilerEnrichScssVarSubscriber ... emits $<css value>: <stored value or defaultValue>; into theme-variables.scss during theme compilation"
- **dev-33 (mcp-wiki)** — fail, 50%
  - Answer covers Module.register and 'type: plugin by convention' (loosely matching part of fact 1) but omits all the abort conditions that make a module silently fail to register (no hyphen in id, duplicate id, no routes/routeMiddleware, display:false) and omits the full build chain (var/plugins.json, vite entrypoints.json, assets:install) from fact 2, mentioning only 'plugin must be active and rebuilt'.
  - Answer states 'settingsItem group: shop/system/plugins' as if these are the valid values — this is exactly the confirmed-wrong claim the case's Trap explicitly warns against (no runtime validation exists, and 'shop' is not even in the 6.7 TypeScript union).
  - selfReportDelta shows reported 2 vs actual 6, with named missing calls including a read of what the audit flags as dev-34's target page (cross-case attribution per auditNotes) — treated as a materially under-reported log.
  - Official: code: administration package Resources/app/administration/src/core/factory/module.factory.ts:159,170-177,180-189,192-198,202-210 — "Registration aborts (console warning, no exception) if the module id contains no hyphen, if the id is already registered, or if the manifest declares neither routes nor routeMiddleware"
- **dev-35 (mcp-wiki)** — partly, 65%
  - Answer covers repositoryFactory.create()/search()/Criteria construction well (facts 1 and much of fact 2) but never mentions the server-side ACL validation of the search (AclCriteriaValidator recursing into associations, 403 on missing privileges) — fact 3 is entirely absent.
  - Answer states setTotalCountMode(2) is 'limit*5+1, a fast next-page-exists approximation' — this repeats the documented-but-code-contradicted value; the case's confirmed evidence shows EntitySearcher::addTotalCountMode() actually fetches limit*6+1, and the case's own Trap explicitly warns against restating the doc figure as fact without that caveat.
  - selfReportDelta shows reported 2 vs actual 5, with a named missing read of what the audit flags as dev-36's target page (cross-case attribution per auditNotes) — treated as a materially under-reported log.
  - Official: code: administration package src/core/data/repository-factory.data.ts:41-62 — "create(entityName, route = '', options = {})"
- **dev-37 (mcp-wiki)** — partly, 73%
  - Answer correctly covers phpunit.xml + tests/TestBootstrap.php with the exact TestBootstrapper chain (addCallingPlugin/addActivePlugins/setForceInstallPlugins) and IntegrationTestBehaviour's transaction/cache behaviour (facts 1 and 2 present), but never mentions the DATABASE_URL '_test' suffix rewrite or that PHPUnit is not shipped by shopware/core (fact 3 absent).
  - Answer recommends 'composer require --dev dev-tools' before running tests, a specific claim not corroborated anywhere in the case's evidence file; treated as an unverifiable detail rather than a confirmed error since the citation is to the actual target page read.
  - selfReportDelta shows reported 2 vs actual 7, with named missing calls including a read of what the audit flags as dev-38's target page (cross-case attribution per auditNotes) — treated as a materially under-reported log.
  - Official: code: Framework/Plugin/Command/Scaffolding/stubs/test-bootstrap.stub:1-12 — "TestBootstrapper -> addCallingPlugin() -> addActivePlugins('<PluginName>') -> setForceInstallPlugins(true) -> bootstrap() -> getClassLoader()"
- **dev-38 (mcp-wiki)** — partly, 73%
  - Answer mentions .spec.js/.spec.ts co-location but never states the Jest 30 + jsdom + @vue/test-utils 2.4.6 (Vue 3) toolchain or that 6.7 uses Jest, not Vitest (fact 1 absent).
  - Answer describes mounting via mount()/shallowMount() 'passing props, stubs, mocks and attachTo: document.body' without stating that vue-test-utils 2 requires stubs/mocks/provide nested under a global key — this is exactly the trap the case's expected answer calls out, and is a materially wrong/misleading detail for Vue 3 (fact 2 only partially present).
  - Answer never mentions that 6.7 ships no Jest harness for a plugin (roots/testMatch cover only Administration/Storefront, no jest-preset package, plugin:create scaffolds no jest config) — fact 3 entirely absent, and the answer's commands (composer run admin:create:test, admin:unit) are presented as generally available without that caveat.
  - Official: code: Resources/app/administration/jest.config.js:50,61,166-181 (shopware/administration) — "6.7 Administration is Jest, not Vitest"
- **dev-39 (mcp-wiki)** — fail, 46%
  - This is the confirmed trap case: the case's expected answer states there is no Cypress support in 6.7 at all (tests/e2e/cypress reduced to a 0-byte file upstream) and that the correct answer is the Playwright acceptance-test suite. The report instead gives a full, detailed Cypress setup tutorial for the plugin, with only a passing note that Cypress is 'documented as legacy' — this is exactly the failure mode the case's confirmed evidence calls out.
  - None of the three expected facts (no Cypress support/premise is stale, the Playwright/@shopware-ag/acceptance-test-suite setup and run commands, the actor-pattern test structure) are stated as the actual answer.
  - Citation is genuinely to the legacy cypress page and its excerpt does support the claims made about that page's content, so grounding and citation are not at fault — the failure is that the report answers the query with obsolete guidance instead of flagging it as such.
  - Official: code: https://github.com/shopware/shopware/tree/v6.7.13.0/tests/e2e/cypress — "upstream at tag v6.7.13.0 tests/e2e/cypress has been reduced to a single 0-byte support/commands/commands.js"
- **dev-41 (mcp-wiki)** — partly, 76%
  - Answer gives 'PHP 8.2+ → 8.4' as an open-ended recommended range rather than the actual enumerated Composer constraint (~8.2.0 || ~8.3.0 || ~8.4.0 || ~8.5.0) — this is exactly the trap the case's expected answer explicitly warns against ('a bounded list, not an open-ended 8.2 or newer'), though it does correctly carry memory_limit>=512M and max_execution_time>=30 from fact 1.
  - Answer gives the correct MySQL/MariaDB version floors but never states the crucial point that the check only runs at system:install/web-installer time, never on composer update or app boot — omitting the fact that answers why 'composer update aborting' says nothing about the database (fact 2 largely absent).
  - Answer gives a single unified Node version range instead of noting the Administration and Storefront builds declare different, stricter Node/npm engine ranges, and never mentions that nothing enforces this (EBADENGINE warning only) or names composer check-platform-reqs as the actual CLI preflight tool (fact 3 largely absent).
  - Official: code: composer.json:51-72 — ""php": "~8.2.0 || ~8.3.0 || ~8.4.0 || ~8.5.0""
- **dev-42 (mcp-wiki)** — partly, 76%
  - Answer covers the upgrade wizard flow and correctly identifies that plugins in custom/plugins must be Composer-managed to pass the wizard's prerequisites, matching much of expected fact 2, but never names the specific readiness-check label/blocking mechanism, its exact message text, or the 0.18.4 vendor-or-lock managed-package change.
  - Answer never mentions that 'project upgrade-check' is a separate, deprecated legacy command, nor the --target/--dry-run semantics precisely (fact 1 only partially present), and never mentions the hardcoded report.md path or its bucket structure (fact 3 absent).
  - Answer states 'shopware-cli project validate --only phpstan can be run before a Shopware upgrade specifically to detect breaking changes' — the case's expected evidence explicitly records that PHPStan in project validate runs only against the already-installed Shopware version with no Shopware-specific removed/renamed-API rule set, so it does not detect upcoming breaking changes as claimed; this is a materially misleading statement.
  - Official: shopware-cli 0.18.4: cmd/project/project_upgrade.go:71-76 — "--target is required in non-interactive mode and accepts an exact catalog version, recommended or latest-patch"
- **dev-46 (mcp-wiki)** — partly, 76%
  - Answer correctly explains the deprecated prop (default false = Meteor component used by default), matching part of fact 1, but never mentions that this deprecated-prop pattern governs only 15 named components and that sw-tabs/sw-popover/sw-loader/sw-skeleton-bar use an entirely different, feature-flag-gated mechanism that always renders the deprecated variant in a stock 6.7 install — fact 2 entirely absent, and the answer implicitly generalises the deprecated-prop pattern, which the case's Trap explicitly warns against.
  - Answer gives the codemod invocation as `composer run admin:code-mods -- --plugin-name example-plugin --fix -v 6.7` — the case's expected answer and Trap explicitly state this composer script exists only in the shopware/shopware monorepo and does not exist in a Flex/project install; the correct invocation is `npm run code-mods` from the administration package. This is a materially wrong command.
  - Answer never mentions the **/*.html.twig-only scope, the sw-→mt- rename mechanics, the six special-case mappings, or that sw-data-grid is not renamed (fact 3 largely absent).
  - Official: code: administration Resources/app/administration/src/app/component/base/sw-button/sw-button.html.twig:1-20 — "the template condition is exactly v-if="!deprecated", with v-else falling back to sw-button-deprecated"
- **dev-49 (mcp-wiki)** — partly, 80%
  - Answer gives the exact #[Route(defaults: [PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [StorefrontRouteScope::ID]])] attribute form (fact 1) and the public-service-with-setContainer + attribute-loader routes.php wiring (fact 2), both correctly.
  - Answer states route names should use one of 'frontend, widgets, payment, api, or store-api' prefixes — the case's expected answer explicitly states only three (frontend./widgets./payment.) are route-name prefixes accepted by Router::isStorefrontRoute(), and api/store-api are unrelated URL path prefixes from a different mechanism, not route-name prefixes. This conflation is exactly the confirmed-wrong claim the case's evidence calls out, even though the answer does separately and correctly mention the 6.7.2.0 storefront.router.allowed_routes addition.
  - Official: code: Storefront/Controller/AccountOrderController.php:43,49 (shopware/storefront) — "#[Route(defaults: [PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [StorefrontRouteScope::ID]])]"
- **dev-51 (mcp-wiki)** — partly, 80%
  - Covers fact 1 (class attribute, #[Entity], required name) and fact 2 (shopware.entity tag drives definition/repository generation) reasonably well.
  - Omits fact 3 entirely: never states that attribute entities do not create their own DB table and that a plugin migration is required — a developer following only this answer would not know the table has to be created.
  - Does not address the query's false premise (Resources/config/entities.xml never existed for plugins; entities.xml is app-only) — repeats the trap instead of correcting it.
  - Findability fail: 4 list/grep calls before the target read.
  - selfReportDelta +1 with empty missing list — a generic, non-material undercount seen across nearly all cases in this shard, not treated as dishonesty.
  - Official: code: Migration/V6_7/Migration1742199549MeasurementSystemTable.php:32-42 — "Attribute entities do not create their database table: the plugin must ship a MigrationStep with the CREATE TABLE statement"
- **dev-53 (mcp-wiki)** — partly, 80%
  - Fact 1 (config.fields.<name>) and fact 2 (sw-theme.<name>.<tab>.<block>.<section>.<field>.label snippet key) covered.
  - Fact 3 is stated backwards: the answer claims label/helpText are omitted unconditionally 'since v6.7.1.0', when the code shows they still work as a fallback in 6.7 and are only stripped under the v6.8.0.0 feature flag — this is a materially wrong statement, not merely an omission.
  - The answer's remedy correctly points to admin snippet files and theme:refresh.
  - Official: code: shopware/storefront Theme/ThemeConfigField.php:14-19 — "the inline theme.json label/helpText arrays still work in 6.7 ... only stripped when the v6.8.0.0 feature flag is active"
- **dev-55 (mcp-wiki)** — fail, 50%
  - The answer directly hits the case's documented trap: it claims ACCESSIBILITY_TWEAKS is still an active toggle in 6.7 and even recommends setting ACCESSIBILITY_TWEAKS=1 in .env to 'preview' changes — the expected answer explicitly states the flag is inert in 6.7 and that this exact recommendation is wrong.
  - Facts 2 and 3 (sw_extends/silent block drop, concrete markup changes) are not addressed at all.
  - selfReportDelta's 'missing' entry names the same read_doc call already present in the self-reported log — a duplicate-count artifact, not a hidden action; not treated as a Honesty violation.
  - Official: code: Framework/Resources/config/packages/feature.yaml:24-28 — "the flag itself still exists as a declaration ... but nothing in core or storefront reads it ... the flag-based advice in the docs describes 6.6, not 6.7"
- **dev-59 (mcp-wiki)** — fail, 56%
  - The answer's recommended fix is the exact anti-pattern the case's Trap warns against: it presents ban_method/use_varnish_xkey as the needed configuration, when the expected answer states these are deprecated no-ops that do nothing in 6.7.
  - Fact 3 (delayed invalidation on by default, requiring the scheduled task / a worker, sw-force-cache-invalidate header) is entirely missing — this is very likely the actual root cause of the symptom in the query and is not addressed at all.
  - Fact 1 (xkey/PURGE replacing BAN) is roughly present.
  - Official: code: Framework/DependencyInjection/Configuration.php:1378-1412 — "use_varnish_xkey, ban_method, ban_headers and the whole purge_all block are accepted but deprecated no-ops slated for removal in 6.8.0"
- **dev-60 (mcp-wiki)** — partly, 70%
  - Fact 1 (explicit naming of async/low_priority) is correctly reflected in the example commands.
  - Fact 2 (disabling the admin worker requires a separate bin/console scheduled-task:run process, or no scheduled task ever runs) is never mentioned.
  - Fact 3 is directly contradicted: the answer states a CLI worker must be set up for the 'failed' transport and that failed messages are 'retried automatically 3 times, then deleted' — the expected answer explicitly states failed is a dead-letter target drained with messenger:failed:*, never consumed by a standing worker, and messages are moved to failed rather than deleted.
  - Official: code: symfony/messenger EventListener/SendFailedMessageToFailureTransportListener.php:37-74 — "A message that exhausts async's max_retries: 3 is moved to failed, not deleted"
- **dev-61 (mcp-wiki)** — partly, 60%
  - The answer repeats exactly the case's documented Trap: it states the shard/replica default is still 3/3 'since Shopware 6.4.12.0', while the expected answer states 6.7 storefront index defaults were emptied so the cluster decides (only the admin indices still default 3/3).
  - Fact 3 (separate admin index settings/command, es:admin:index) is entirely missing.
  - Command bin/console es:index (fact 2) is correctly named, but the answer also cites 'bin/console dal:refresh:index --use-queue', which does not appear among the documented 6.7 elasticsearch commands.
  - Official: code: shopware/shopware@v6.7.13.0 src/Elasticsearch/Resources/config/packages/elasticsearch.yaml — "In 6.7 both env defaults are empty — Shopware no longer forces 3 shards / 3 replicas"
- **dev-62 (mcp-wiki)** — partly, 67%
  - The central precedence claim (fact 1) is delivered as a labelled [from memory] statement rather than grounded in a retrieved page, and never mentions .env.local.php — the specific mechanism the expected answer identifies as the usual real-world cause of the exact symptom in the query.
  - Fact 2 (no cache:clear needed except for feature flags) is not addressed at all.
  - Fact 3 (system_config is DB-backed, not read from .env) is present and accurate.
  - Memory claim is correctly labelled, which keeps Honesty at 100 despite not counting for Grounding.
  - Official: code: vendor/symfony/dotenv/Dotenv.php:110-177,216-224 — "if a .env.local.php exists ... bootEnv() populates from that file alone and does not read .env, .env.local or .env.$APP_ENV at all"
- **dev-63 (mcp-wiki)** — partly, 73%
  - Fact 1's core command shape (database:migrate <PluginName> --all) is present, but --until as an alternative cap and the separate database:migrate-destructive command are not mentioned.
  - Fact 2 (silent-success on an unknown identifier, plugin-must-be-active, container-compile-time directory registration needing cache:clear) is entirely missing — these are the actual documented reasons a migration silently does not run, which is exactly what the query asks about.
  - Fact 3 (plugin:update as the normal path, plugin:refresh prerequisite for upgradeVersion) is entirely missing.
  - Findability upgraded from the audit's 'fail' to 'pass': the page actually read (database-migrations.md) is not cases.md's listed target (commands-reference.md) but is exactly the page named as the case's own official reference URL and carries fact 1.
  - Official: code: Framework/Migration/Command/MigrationCommand.php:53-59,70-77,98-105 — "bin/console database:migrate <Identifier> --all"
- **dev-65 (mcp-wiki)** — partly, 80%
  - Facts 1 and 3 (top-level keys, post-filter/aggregation interaction, total-count-mode values) are stated and mostly correct.
  - Fact 3 contains one materially wrong technical detail: the answer states 'exact' total count runs SQL_CALC_FOUND_ROWS, but the expected answer explicitly states the mechanism is a second COUNT(*) over the subquery, 'not SQL_CALC_FOUND_ROWS' — a fact called out precisely because it is a common misconception.
  - Fact 2's associations shape is present at a basic level but omits the to-one vs to-many nested-filter/sort restriction nuance.
  - Official: code: Framework/DataAbstractionLayer/Dbal/EntitySearcher.php:191,203 — "Only exact (1) gives a trustworthy total: it resets order and limit and runs a second COUNT(*) over the subquery (not SQL_CALC_FOUND_ROWS)"
- **dev-66 (mcp-wiki)** — partly, 79%
  - All four headers are named, but each is stated at a bare surface level.
  - Fact 2's key nuance (sw-inheritance is a presence check — any value including 0/false enables it, there is no way to disable via a falsy value) is missing; the example 'sw-inheritance: 1' could mislead a reader into thinking a falsy value would disable it.
  - Fact 3 is understated to the point of being misleading: the answer frames sw-skip-trigger-flow as specific to bulk imports 'via the sync API', while the expected answer states it is resolved for every /api route, not only sync.
  - Fact 1's language-fallback chain and version-id validation status are not mentioned.
  - Official: code: Framework/Routing/ApiRequestContextResolver.php:124 — "sw-inheritance switches on considerInheritance by presence alone — any value, including 0 or false, enables it"
- **dev-70 (mcp-wiki)** — partly, 74%
  - Fact 1's manifest shape and the sync/async distinction are present, framed slightly imprecisely as separate handler behaviour rather than the single AppPaymentHandler branching on redirectUrl.
  - Fact 2's payload structure and response shape are covered loosely but omit the response-signature verification requirement (shopware-app-signature on the app's own response) and the 20-second timeout.
  - Fact 3 — the exact status action-name alphabet the app server must return (paid, paid_partially, process, authorize, cancel, fail, etc.) and the 6.7 rename of pay->paid/do_pay->process — is entirely missing, which is the central 'what must the app server return' answer the query asks for.
  - Official: code: System/StateMachine/Aggregation/StateMachineTransition/StateMachineTransitionActions.php:10-31 — "Valid for order_transaction in 6.7: paid, paid_partially, process, process_unconfirmed, authorize, chargeback, refund, refund_partially, remind, reopen"
- **dev-71 (mcp-wiki)** — partly, 74%
  - Fact 1 (Resources/entities.xml, entity-1.0.xsd) and fact 2 (Admin API underscore-to-hyphen URL mapping, automatic repository) are covered.
  - Fact 3 is directly contradicted: the answer states 'fields can be marked store-api-aware=true to expose them via the Store API', while the expected answer states this is exactly the trap — store-api-aware only attaches the ApiAware read-protection flag and creates no route; there is no generic Store API route for custom entities in 6.7.
  - Official: code: Framework/Script/Api/ScriptStoreApiRoute.php:36 — "there is no generic Store API route for custom entities in 6.7, and storefront access goes through an app script endpoint"
- **func-01 (mcp-wiki)** — partly, 70%
  - Fact 1 (required fields before first save, tabs appear post-save) is present.
  - Fact 2 (per-channel product_visibility row, three canonical levels, active/route-threshold gating) is not addressed — the answer substitutes an unrelated First Run Wizard default-visibility setting and a separate Dynamic Access extension mechanism, neither of which is the product_visibility mechanism the case asks about.
  - Fact 3's admin labels are wrong: the answer names the display modes 'Single main variant' / 'Fan out properties in product list', which the expected-answer file's evidence explicitly lists as non-existent strings in the 6.7 administration — the real labels are 'Display single product' / 'Expand property values in product listings'.
  - Official: code: Content/Product/SalesChannel/ProductAvailableFilter.php:17-29 — "ProductAvailableFilter ANDs visibilities.visibility >= threshold, visibilities.salesChannelId = <current channel> and product.active = true"
- **func-02 (mcp-wiki)** — partly, 80%
  - Fact 1 (single availability rule per method, cannot delete a rule in use) explicitly present.
  - Fact 2's AND/OR combining logic is present at a functional level, without the technical root-AndRule/payload-matching detail (appropriate depth for a merchant-facing case).
  - Fact 3 (CartRuleLoader recomputation, the specific blocked-error reasons for payment) is entirely missing.
  - Official: code: Checkout/Shipping/ShippingMethodDefinition.php:81 — "a shipping method and a payment method each reference at most one availability rule, through the nullable FK availability_rule_id"
- **func-04 (mcp-wiki)** — fail, 52%
  - Fact 1's DataSelection list is roughly present, but never states the Migration Assistant is a separate plugin outside core.
  - Fact 2 is materially wrong: the answer lists 'payment methods, the standard payment method, salutation, delivery time, and the standard delivery time' as the premapping set, omitting order states, order delivery states, transaction states and newsletter recipient status entirely, and duplicating items that do not match the actual eight-item list.
  - Fact 3 is directly contradicted: the answer states shipping methods 'still are not functionally transferred' alongside payment methods, when the expected answer's key distinguishing claim is that shipping methods DO have a ShippingMethodDataSet and are migrated with customersOrders — only payment methods lack a DataSet.
  - Official: code: SwagMigrationAssistant@6.6.x src/Profile/Shopware/Premapping/PaymentMethodReader.php — "Payment methods are not migrated as entities — there is no PaymentMethodDataSet, only a PaymentMethodReader premapping"
- **func-05 (mcp-wiki)** — partly, 76%
  - Answer names only 3 sales-channel types (storefront, headless, product-comparison) but 6.7.13.0 ships 4 including 'Agentic commerce'; the uniform-required-fields fact is also missing.
  - Access-key mechanism is described vaguely ('API Access ID/key ... generated under the sales channel's API access setting') and omits the sw-access-key header, the SWSC prefix, and the fact it has no secret counterpart.
  - Domain-binds-one-URL-to-one-language/currency/snippet fact is correctly captured; headless-needs-no-domain is not stated.
  - Citation and grounding are solid — the single citation matches the read call and its content.
  - Official: code: PlatformRequest.php:19 — "it is prefixed SWSC (any other origin is rejected with salesChannelNotFound before the database is queried)"
- **func-06 (mcp-wiki)** — partly, 76%
  - Answer states 6.6's Flow Builder sits under Settings > Automation, but the expected fact (and the 6.6 admin module) puts it under Settings > Shop — a wrong menu path for the pinned 6.6 version.
  - Core action count (16, identical 6.6/6.7) and the recipient.type='custom' audience-replacement trap are not stated; the answer's general trigger/action listing is otherwise solid.
  - Existing stock order-confirmation flow (so a merchant flow adds a mail rather than replacing one) is not mentioned.
  - Citation is clean — single citation matches the sole read_doc call.
  - Official: code: Content/Flow/Dispatching/Action/SendMailAction.php:104-118,303-325 — "'custom' replaces that audience entirely with the configured address map"
- **func-07 (mcp-wiki)** — partly, 76%
  - Answer states 'Start dry run to validate without writing any data', which contradicts the confirmed fact that a dry run performs the real writes and only rolls back the DBAL transaction — log/file rows and media filesystem side effects survive. This is a materially misleading statement for a developer relying on dry run being side-effect free.
  - Menu-path version split (Settings>Shop in 6.6 vs Settings>Automation in 6.7) is not mentioned.
  - 'Second Unique Identifier' matching-mechanism concept is captured reasonably well, though the duplicate-mapping-collapse edge case is omitted.
  - Citation is clean and matches the sole read_doc call.
  - Official: code: Content/ImportExport/DataAbstractionLayer/Serializer/PrimaryKeyResolver.php:68-78,85-89,107-120 — "PrimaryKeyResolver looks the mapped value up with an EqualsFilter ... writes the found id into the record, turning an insert into an update"
- **func-08 (mcp-wiki)** — partly, 73%
  - Correctly answers the core question (custom field is Store-API-writable only when 'Modifiable via Store API' is enabled) but omits that writes are limited to customer/customer_address/newsletter_recipient routes only.
  - Does not state the field-name-is-globally-unique fact, nor that a set with no entity relation is blocked everywhere.
  - Lists roughly the eleven admin field types but does not note they collapse onto 8 stored DAL types, nor the version-conditional Twig-name validation.
  - Citation is clean and matches the tool call.
  - Official: code: System/SalesChannel/Api/StructEncoder.php:378 — "'Visible in Store API' -> store_api_aware (StructEncoder strips every field with store_api_aware = 0 from Store API responses)"
- **func-09 (mcp-wiki)** — partly, 73%
  - The report's self-declared toolCallLog has only 2 calls (grep + one read_doc), yet the answer cites a second page ('platform/func/saas/payment.md') that was never logged as read — the audit's ground-truth actual call count (3) confirms a real, undisclosed read_doc call. This materially misrepresents how the answer was obtained.
  - Correctly states sales-channel assignment and the Availability-rule gate (facts 1 and 2 of the expected answer).
  - Omits the code-level fact that the checkout gateway can programmatically remove an otherwise-eligible method (RemovePaymentMethodCommand) and that a dangling handler is not filtered out.
  - The cited content itself is real and verified (2/2) — the problem is self-report honesty, not fabrication.
  - Official: code: Checkout/Payment/SalesChannel/SalesChannelPaymentMethodDefinition.php:15 — "the Store API payment-method listing unconditionally adds the filter payment_method.salesChannels.id = current sales channel"
- **func-10 (mcp-wiki)** — partly, 76%
  - Answer names only 3 of the 5 places a dynamic product group can be used (category, product export/comparison, CMS slider) — cross-selling and the cart rule 'cartLineItemInProductStream' are omitted.
  - Presents 'Keep matching variants grouped' as generally available without noting displayAsGroup/internal do not exist in 6.6 — a version-pin inaccuracy for this 6.6+6.7 shared case.
  - Static/stream filter-row typing and the computed api_filter/invalid fields are not mentioned.
  - Citation is clean and matches the read_doc call for the actual target page.
  - Official: code: System/Integration/IntegrationDefinition.php:63-79 — "assign ACL roles ... or set the boolean admin flag, which makes the request source an admin source that skips ACL write validation"
- **func-12 (mcp-wiki)** — partly, 70%
  - Correctly gates Customer Specific Pricing behind the Beyond plan + Commercial extension, matching expected fact 2 for that capability.
  - Incorrectly states 'Flow Builder already ships a webhook action ... the wiki page does not mention any extra license or plan requirement' — this fails the case's central trap: the Call URL/webhook flow action is Commercial-gated (Evolve plan+), and core ships no HTTP-calling flow action at all (16 flow.action services, none HTTP-related).
  - Does not mention the core-only alternatives (rule-based advanced pricing via product_price+Rule Builder, promotion personaCustomers, or the app-based webhook path) that fact 3 requires.
  - Citation is grounded in the two actually-read pages; 2/2 verified.
  - Official: code: Content/DependencyInjection/flow.xml:61-158 — "core registers exactly 16 flow.action services and none of them performs an HTTP request"
- **edge-06 (mcp-wiki)** — partly, 76%
  - Falls directly into the case's documented trap: states 'Attribute Sets map to Custom field sets', when the expected answer requires stating there is NO attribute-set equivalent in Shopware 6 — this is the exact wrong move the case is designed to catch.
  - Correctly maps Store View/Store/Website to Sales channel and Extension to Plugin.
  - Appropriately hedges the di.xml mapping with a labelled memory claim rather than presenting it as documented, though it still offers Symfony DI as a look-alike rather than flatly stating there is no di.xml equivalent.
  - Citations (2/2) are verified; the memory claim is properly labelled so it does not count against Citation or Grounding.
  - Official: code: System/SalesChannel/Aggregate/SalesChannelDomain/SalesChannelDomainDefinition.php:63-67 — "each domain carrying its own URL, language, currency and snippet set — so per-URL localisation lives on the domain, not on a separate store-view object"
- **edge-09 (mcp-wiki)** — partly, 76%
  - Repeats the exact disproven documentation framing this case is designed to catch: states the legacy 'Business Events' screen 'still exists' under Settings > Shop and is 'actively used for the B2B-Suite', when the confirmed code evidence (dropped event_action* tables, no sw-event-action/sw-business-event admin module) shows no such screen exists in 6.6 or 6.7.
  - Correctly names Flow Builder with the checkout.order.placed trigger and Send mail action as the actual configuration path — the practically useful half of the answer is right.
  - Does not state that 'business event' survives only as a read-only event catalogue with no write side.
  - Citations (2/2) are verified and match what the doc pages actually say — the doc itself carries the misleading framing, which the case's known-defects list explicitly records.
  - Official: code: Migration/V6_5/Migration1670854818RemoveEventActionTable.php:24-29 — "the event_action, event_action_rule and event_action_sales_channel tables are dropped by a V6_5 migration"
- **gap-08 (mcp-wiki)** — partly, 77%
  - Correctly states the corpus has no Composable Frontends/Nuxt setup guide and no page mentioning HTTP 412, and names only the PaaS-deployment page and Store API concept pages as what the corpus actually holds — matches expected facts 1 and 2 well.
  - The labelled memory claim explaining HTTP 412 conflates a missing sw-access-key header with a 412 response, when the confirmed code fact is that a missing header is 401, not 412 — this is a materially wrong statement in a portion that counts toward Accuracy since it is a memory claim.
  - Citations (3/3) are verified; the memory claim is properly labelled so it does not affect Citation or Grounding.
  - Official: code: Framework/Api/EventListener/Authentication/SalesChannelAuthenticationListener.php:70-125 — "returns 412 FRAMEWORK__ROUTING_SALES_CHANNEL_NOT_FOUND when that key is well-formed but is not a sales-channel key or matches no active sales channel"

## Accuracy cross-checks

| Option | Flagged | Fetched | Served from cache | Bands changed | Fetch failures |
| --- | --- | --- | --- | --- | --- |
| mcp-wiki | 87 of 100 | 0 | 0 | 0 | none |

All 87 flagged cases carry `Status: confirmed` in cases.md; per the rubric, a confirmed case's facts (already verified against the Shopware source, carrying `[code: …]` tags) are the cross-check, and re-fetching the documentation would reintroduce the circularity the suite removed. The accuracy pass settled every flagged case against its expected-answer file's own code evidence rather than a live fetch — 87 cases settled this way, 0 fetched.

No band changed — every flagged case held its provisional accuracy from the scoring wave (before the borderline second-opinion pass, see below).

## Observations about source availability

8 cases hit the Source-absent override under mcp-wiki: edge-01, edge-02, edge-03, gap-01, gap-02, gap-03, gap-04, gap-07.
- edge-01, edge-02, edge-03: the wiki genuinely carries no page for these traps (GraphQL API, Smarty/DI container, Doctrine ORM) — target `none`; the agent reported not-found honestly.
- gap-01, gap-02, gap-03, gap-04, gap-07: confirmed documentation gaps — the wiki has no plugin-side Admin API route guide, no coverage of the 6.7 JWT-key removal, no coverage of the OAuth `scope` format change, no coverage of native-PHP-type retyping, and no PHP-side media-creation guide. These are correct `unavailable` outcomes, not KB defects to blame the corpus for beyond noting the gap.
- dev-12 and edge-04, edge-07 have real docs targets other than `none` in this corpus (wiki carries the pages) and did not need the override.
- edge-05, edge-06, edge-07, edge-08, edge-09 and gap-05, gap-06, gap-08 were scored normally (not `unavailable`) because the wiki had a relevant page to read, even where that page repeats a documentation defect the case is designed to catch (edge-09/Business Events, gap-05/caching removal).

## Recommended fixes

- dev-01 (mcp-wiki): Answer instructs implementing getDefinitionClass() returning ProductDefinition::class as the 6.7 recipe; the case is explicitly designed to fail this exact trap since 6.7.13.0 removed getDefinitionClass() and made getEntityName() the sole abstract method.
- dev-02 (mcp-wiki): Hooks are covered but keepUserData() is described only conceptually; the read-only getter/no-setter fact and the specific four items core removes only when keepUserData()===false are never stated.
- dev-05 (mcp-wiki): selfReportDelta shows 3 unreported tool calls (reported 4 vs ground-truth 9) — honesty scored 0 per rubric for a materially under-reported call log.
- dev-06 (mcp-wiki): FlowAction class shape, tag/key/priority, and handleFlow data access are covered correctly.
- dev-08 (mcp-wiki): selfReportDelta shows 2 unreported read_doc calls (reported 1 vs actual 5) — honesty scored 0 per rubric.
- dev-10 (mcp-wiki): Only 4 of the 6 abstract EntityIndexer members are named (getName/iterate/update/handle); getTotal() and getDecorated() are omitted, which would leave a real subclass failing to compile — a materially incomplete recipe.
- dev-11 (mcp-wiki): selfReportDelta shows an unreported read_doc call — honesty scored 0 per rubric.
- dev-13 (mcp-wiki): selfReportDelta shows 2 unreported calls — honesty scored 0 per rubric.
- dev-15 (mcp-wiki): Recommends 'find it by searching for @Event' as a discovery technique; the case's own evidence confirms the @Event annotation has zero occurrences under vendor/shopware and is a dead search term — a materially wrong/misleading recommendation.
- dev-17 (mcp-wiki): selfReportDelta shows 4 unreported calls — honesty scored 0 per rubric.
- dev-18 (mcp-wiki): Correctly states $toCalculate vs $original and the collect-fetches/process-applies split.
- dev-19 (mcp-wiki): selfReportDelta shows an unreported grep_docs call — honesty scored 0 per rubric.
- dev-21 (mcp-wiki): Recommends giving the BusinessEventCollectorEvent subscriber 'a high priority (e.g. 1000) so it registers before other trigger subscribers' — this is precisely the case's documented trap; the confirmed fact states no elevated priority is needed and the collect path reads all listeners before a final name-based sort.
- dev-22 (mcp-wiki): config.xml location/card structure and the field-type enumeration are covered, though the enumerated list is missing the 16th type ('price').
- dev-23 (mcp-wiki): States system_default 'must be 0'; the case's confirmed code evidence shows this is editorial and that 1 is actually the safer value for a type's canonical template (the idempotency lookup itself only matches system_default=1).
- dev-24 (mcp-wiki): States that a soft-deleted (is_deleted=1) seo_url row 'stays reachable, so the controller must still check whether the underlying content exists'; the case's confirmed code evidence shows every read path (SeoResolver, SeoUrlPlaceholderHandler, sitemap providers) filters is_deleted=0, so a deleted row is not reachable at all — this is the exact superseded/refuted claim the case now flags as wrong.
- dev-26 (mcp-wiki): This is the confirmed trap case: the wiki's cataloged target IS the Document v2 page, and the case's expected answer states v2 does not exist at 6.7.13.0 (AbstractDocumentType/tag shopware.document_v2.type absent, first appears 6.7.14.0). The report builds its whole answer on the v2 recipe (AbstractDocumentType, AbstractDocumentDataProvider, shopware.document_v2.type/.provider tags) as if it were current and usable, which the case's confirmed evidence says is wrong for this pin.
- dev-27 (mcp-wiki): Answer correctly names sw_extends as the required tag (not plain extends), correctly explains multi-inheritance and why {% extends %} would drop other plugins' changes, correctly gives the identical-relative-path rule and {{ parent() }} usage — all three expected facts are present.
- dev-28 (mcp-wiki): Answer covers the extends-with-super pattern and the correct override()/async-import call, matching expected facts 2 and 3 reasonably well, but never states the exact requirement that override() is refused unless the name is already registered for that exact selector (fact 1 not clearly stated).
- dev-31 (mcp-wiki): The agent read and answered from the alternate 'add-scss-variables-via-subscriber.md' page, describing a hand-written kernel.event_subscriber approach, instead of the declarative <css> config.xml route that the case's expected answer says is the correct out-of-the-box mechanism requiring no plugin listener at all — none of the case's three expected facts (config.xml <css> tag + hasCssValue string-only guard, bool/checkbox exclusion, !default fallback + emission order) are stated.
- dev-33 (mcp-wiki): Answer covers Module.register and 'type: plugin by convention' (loosely matching part of fact 1) but omits all the abort conditions that make a module silently fail to register (no hyphen in id, duplicate id, no routes/routeMiddleware, display:false) and omits the full build chain (var/plugins.json, vite entrypoints.json, assets:install) from fact 2, mentioning only 'plugin must be active and rebuilt'.
- dev-35 (mcp-wiki): Answer covers repositoryFactory.create()/search()/Criteria construction well (facts 1 and much of fact 2) but never mentions the server-side ACL validation of the search (AclCriteriaValidator recursing into associations, 403 on missing privileges) — fact 3 is entirely absent.
- dev-37 (mcp-wiki): Answer correctly covers phpunit.xml + tests/TestBootstrap.php with the exact TestBootstrapper chain (addCallingPlugin/addActivePlugins/setForceInstallPlugins) and IntegrationTestBehaviour's transaction/cache behaviour (facts 1 and 2 present), but never mentions the DATABASE_URL '_test' suffix rewrite or that PHPUnit is not shipped by shopware/core (fact 3 absent).
- dev-38 (mcp-wiki): Answer mentions .spec.js/.spec.ts co-location but never states the Jest 30 + jsdom + @vue/test-utils 2.4.6 (Vue 3) toolchain or that 6.7 uses Jest, not Vitest (fact 1 absent).
- dev-39 (mcp-wiki): This is the confirmed trap case: the case's expected answer states there is no Cypress support in 6.7 at all (tests/e2e/cypress reduced to a 0-byte file upstream) and that the correct answer is the Playwright acceptance-test suite. The report instead gives a full, detailed Cypress setup tutorial for the plugin, with only a passing note that Cypress is 'documented as legacy' — this is exactly the failure mode the case's confirmed evidence calls out.
- dev-41 (mcp-wiki): Answer gives 'PHP 8.2+ → 8.4' as an open-ended recommended range rather than the actual enumerated Composer constraint (~8.2.0 || ~8.3.0 || ~8.4.0 || ~8.5.0) — this is exactly the trap the case's expected answer explicitly warns against ('a bounded list, not an open-ended 8.2 or newer'), though it does correctly carry memory_limit>=512M and max_execution_time>=30 from fact 1.
- dev-42 (mcp-wiki): Answer covers the upgrade wizard flow and correctly identifies that plugins in custom/plugins must be Composer-managed to pass the wizard's prerequisites, matching much of expected fact 2, but never names the specific readiness-check label/blocking mechanism, its exact message text, or the 0.18.4 vendor-or-lock managed-package change.
- dev-46 (mcp-wiki): Answer correctly explains the deprecated prop (default false = Meteor component used by default), matching part of fact 1, but never mentions that this deprecated-prop pattern governs only 15 named components and that sw-tabs/sw-popover/sw-loader/sw-skeleton-bar use an entirely different, feature-flag-gated mechanism that always renders the deprecated variant in a stock 6.7 install — fact 2 entirely absent, and the answer implicitly generalises the deprecated-prop pattern, which the case's Trap explicitly warns against.
- dev-49 (mcp-wiki): Answer gives the exact #[Route(defaults: [PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [StorefrontRouteScope::ID]])] attribute form (fact 1) and the public-service-with-setContainer + attribute-loader routes.php wiring (fact 2), both correctly.
- dev-51 (mcp-wiki): Covers fact 1 (class attribute, #[Entity], required name) and fact 2 (shopware.entity tag drives definition/repository generation) reasonably well.
- dev-53 (mcp-wiki): Fact 1 (config.fields.<name>) and fact 2 (sw-theme.<name>.<tab>.<block>.<section>.<field>.label snippet key) covered.
- dev-55 (mcp-wiki): The answer directly hits the case's documented trap: it claims ACCESSIBILITY_TWEAKS is still an active toggle in 6.7 and even recommends setting ACCESSIBILITY_TWEAKS=1 in .env to 'preview' changes — the expected answer explicitly states the flag is inert in 6.7 and that this exact recommendation is wrong.
- dev-59 (mcp-wiki): The answer's recommended fix is the exact anti-pattern the case's Trap warns against: it presents ban_method/use_varnish_xkey as the needed configuration, when the expected answer states these are deprecated no-ops that do nothing in 6.7.
- dev-60 (mcp-wiki): Fact 1 (explicit naming of async/low_priority) is correctly reflected in the example commands.
- dev-61 (mcp-wiki): The answer repeats exactly the case's documented Trap: it states the shard/replica default is still 3/3 'since Shopware 6.4.12.0', while the expected answer states 6.7 storefront index defaults were emptied so the cluster decides (only the admin indices still default 3/3).
- dev-62 (mcp-wiki): The central precedence claim (fact 1) is delivered as a labelled [from memory] statement rather than grounded in a retrieved page, and never mentions .env.local.php — the specific mechanism the expected answer identifies as the usual real-world cause of the exact symptom in the query.
- dev-63 (mcp-wiki): Fact 1's core command shape (database:migrate <PluginName> --all) is present, but --until as an alternative cap and the separate database:migrate-destructive command are not mentioned.
- dev-65 (mcp-wiki): Facts 1 and 3 (top-level keys, post-filter/aggregation interaction, total-count-mode values) are stated and mostly correct.
- dev-66 (mcp-wiki): All four headers are named, but each is stated at a bare surface level.
- dev-70 (mcp-wiki): Fact 1's manifest shape and the sync/async distinction are present, framed slightly imprecisely as separate handler behaviour rather than the single AppPaymentHandler branching on redirectUrl.

## Borderline re-scores

| Case | Option | Dimension | First | Second | Taken | Total before → after |
| --- | --- | --- | --- | --- | --- | --- |
| dev-22 | mcp-wiki | accuracy | 70 | 40 | 40 | 85% → 77% |
| dev-27 | mcp-wiki | accuracy | 100 | 70 | 70 | 85% → 77% |
| dev-33 | mcp-wiki | groundingRelevance | 100 | 70 | 70 | 61% → 50% |
| dev-33 | mcp-wiki | actionability | 100 | 70 | 70 | 61% → 50% |
| dev-39 | mcp-wiki | groundingRelevance | 100 | 70 | 70 | 60% → 46% |
| dev-39 | mcp-wiki | actionability | 100 | 40 | 40 | 60% → 46% |
| dev-65 | mcp-wiki | completeness | 100 | 70 | 70 | 85% → 80% |
| func-02 | mcp-wiki | completeness | 70 | 40 | 40 | 85% → 80% |
| func-04 | mcp-wiki | groundingRelevance | 100 | 70 | 70 | 60% → 52% |
| func-08 | mcp-wiki | accuracy | 70 | 40 | 40 | 83% → 73% |
| func-08 | mcp-wiki | actionability | 100 | 70 | 70 | 83% → 73% |

Borderline candidates re-scored with no band change: dev-04, dev-43, dev-47, dev-61.

## Scorer discrepancies

None — the first-pass scorer's `total`/`verdict` matched the skill's recomputation for every case prior to the borderline re-score merge.

## Audit warnings

- retrievalTurns is approximated as the sequential retrieval-call count per case; per-call parallel-turn grouping is not present in the ground-truth extractor's output (applies to every case in this run).
- audit-reported selfReportDelta present (non-material over/under-report by 1, or attributable to caseId-boundary drift) for: dev-05, dev-08, dev-11, dev-13, dev-17, dev-19, dev-27, dev-28, dev-31, dev-33, dev-35, dev-37, dev-55, func-10, edge-02, edge-08, gap-01, gap-02
- batch calls.json caseId attribution drifted across adjacent case boundaries for these groups (a case's real retrieval calls sometimes stamped to its neighbour): dev-05/dev-06, dev-08/dev-09/dev-10, dev-11/dev-12, dev-13/dev-14, dev-17/dev-18, dev-28/dev-29/dev-30, dev-31/dev-32, dev-33/dev-34, dev-35/dev-36, dev-37/dev-38, dev-43/dev-44, func-01/func-02/func-03, func-10/func-11, edge-03/edge-04, edge-05/edge-06, edge-08/edge-09, gap-01/gap-02/gap-03. Access-cost fields for the 'victim' cases (retrievalCalls=0) were excluded from accessCost aggregates as warmCasesExcluded; scores were computed per audit shard's numbers as instructed, not corrected.
- borderline second opinion resolved 14 cases within +/-2 of a verdict boundary; lower band taken per dimension per the nothing-softened rule (see per-case discrepancy list in warnings above).
