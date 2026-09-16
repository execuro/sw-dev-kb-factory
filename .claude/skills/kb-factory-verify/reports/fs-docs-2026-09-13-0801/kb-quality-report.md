# KB quality report — fs-docs-2026-09-13-0801

## Run

| | |
| --- | --- |
| Run | `fs-docs-2026-09-13-0801` (`fs-docs`) |
| Options | fs-docs |
| Corpus | docs — fingerprint: developer 3a7f3af9c1 (2026-09-11T18:13:30+02:00), merchant fd093eda5f (2026-09-11T03:37:21Z), seed index present |
| Probe | fs entry points present: developer/index.md, merchant/index.md |
| Model | inherited (not pinned) |
| Generated | 2026-09-13T08:55:57.354Z |
| Cases run | 100 of 100 (all) |
| Yardstick | cases.md ef932d8e, scoring-rubric.md 54864fb4, scorer-brief.md 1456b9ec, auditor-brief.md 4c2c6fdc, accuracy-brief.md 9009d748 |
| Execution | discover batches of 10, scorer shards of 25 (batched) |
| Skill | kb-factory-verify |
| Case status | 99 confirmed, 0 draft, 1 contradictory |

## Run cost

| Option | Agents | Tokens | Tool calls | Summed agent time | Usage complete |
| --- | --- | --- | --- | --- | --- |
| fs-docs | 17 (10 discover, 1 audit, 4 score, 1 accuracy, 1 rescore) | 40,024,228 (discover only) | n/a | n/a | no — audit/score/accuracy/rescore agent usage blocks are structurally absent for named/background spawns; only discover-batch subagentTokens were captured from transcripts |

Wall-clock duration of the run: 3277s.

## Comparison

| Option | Access | Corpus | Overall | Status | Developer | Functional | Findable | Edge passed | Gap confirmed | Pass / partly / fail / unavailable / unscored | Weakest dimension |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| fs-docs | fs | docs | 80% | Not ready | 80% | 77% | 68 of 82 | 7 of 9 | 5 of 8 | 45 / 47 / 8 / 0 / 0 | accuracy |

Single-option run — no ranking or delta to compute against another option in this run. (Cross-option deltas are produced by `compare` once other options' runs exist.)

## Dimension heatmap

| Dimension | Weight | fs-docs |
| --- | --- | --- |
| Grounding & Relevance | 25 | 96.7 |
| Accuracy vs. Expected Answer | 25 | 58.4 |
| Completeness | 15 | 68.8 |
| Citation & Traceability | 10 | 81.3 |
| Honesty | 15 | 94.8 |
| Actionability | 10 | 89.3 |

### By area

| Area | Cases | fs-docs average |
| --- | --- | --- |
| Store API & headless | 1 | 97.0% |
| Payment & Shipping | 1 | 97.0% |
| Checkout & Cart | 2 | 96.0% |
| Core breaking changes | 3 | 91.0% |
| Platform upgrade | 2 | 89.5% |
| Theme | 2 | 88.5% |
| Gap | 8 | 87.9% |
| Plugin fundamentals | 1 | 85.0% |
| Administration | 4 | 85.0% |
| Events | 6 | 84.7% |
| Content (CMS/mail/SEO/media/sitemap) | 2 | 82.0% |
| Trap | 9 | 81.7% |
| Storefront | 9 | 80.3% |
| Services & DI | 3 | 79.7% |
| DAL | 7 | 79.4% |
| Config & CLI | 5 | 79.0% |
| App system | 5 | 79.0% |
| Merchant | 12 | 77.3% |
| Admin migration (Vue 3 / Vite / Pinia / Meteor) | 4 | 74.3% |
| Content | 1 | 73.0% |
| Orders | 2 | 72.5% |
| Hosting & ops | 5 | 69.6% |
| Admin API | 3 | 64.0% |
| Testing | 3 | 59.7% |

## Verdict grid

| Case | Category | Area | fs-docs |
| --- | --- | --- | --- |
| dev-01 | dev | DAL | 73% partly ✗ |
| dev-02 | dev | Plugin fundamentals | 85% pass ✗ |
| dev-03 | dev | Store API & headless | 97% pass ✓ |
| dev-04 | dev | Content | 73% partly ✗ |
| dev-05 | dev | Theme | 97% pass ✓ |
| dev-06 | dev | Events | 77% partly ✓ |
| dev-07 | dev | DAL | 97% pass ✓ |
| dev-08 | dev | DAL | 77% partly ✓ |
| dev-09 | dev | DAL | 88% pass ✗ |
| dev-10 | dev | DAL | 77% partly ✓ |
| dev-11 | dev | Services & DI | 62% partly ✗ |
| dev-12 | dev | Services & DI | 77% partly – |
| dev-13 | dev | Services & DI | 100% pass ✓ |
| dev-14 | dev | Events | 97% pass ✓ |
| dev-15 | dev | Events | 76% partly ✗ |
| dev-16 | dev | Orders | 88% pass ✓ |
| dev-17 | dev | Checkout & Cart | 100% pass ✓ |
| dev-18 | dev | Checkout & Cart | 92% pass ✓ |
| dev-19 | dev | Events | 92% pass ✓ |
| dev-20 | dev | Events | 100% pass ✓ |
| dev-21 | dev | Events | 66% partly ✓ |
| dev-22 | dev | Config & CLI | 73% partly ✗ |
| dev-23 | dev | Content (CMS/mail/SEO/media/sitemap) | 76% partly ✓ |
| dev-24 | dev | Content (CMS/mail/SEO/media/sitemap) | 88% pass ✗ |
| dev-25 | dev | Config & CLI | 100% pass ✓ |
| dev-26 | dev | Orders | 57% fail ✓ |
| dev-27 | dev | Storefront | 89% pass ✓ |
| dev-28 | dev | Storefront | 83% partly ✓ |
| dev-29 | dev | Storefront | 97% pass ✓ |
| dev-30 | dev | Storefront | 92% pass ✓ |
| dev-31 | dev | Storefront | 70% partly ✗ |
| dev-32 | dev | DAL | 77% partly ✓ |
| dev-33 | dev | Administration | 73% partly ✓ |
| dev-34 | dev | Administration | 97% pass ✓ |
| dev-35 | dev | Administration | 88% pass ✓ |
| dev-36 | dev | Administration | 82% partly ✓ |
| dev-37 | dev | Testing | 65% partly ✓ |
| dev-38 | dev | Testing | 62% partly ✓ |
| dev-39 | dev | Testing | 52% fail ✗ |
| dev-40 | dev | Platform upgrade | 89% pass ✓ |
| dev-41 | dev | Hosting & ops | 77% partly ✗ |
| dev-42 | dev | Config & CLI | 89% pass ✓ |
| dev-43 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 70% partly ✓ |
| dev-44 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 66% partly ✓ |
| dev-45 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 88% pass ✓ |
| dev-46 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 73% partly ✓ |
| dev-47 | dev | Payment & Shipping | 97% pass ✓ |
| dev-48 | dev | Storefront | 74% partly ✓ |
| dev-49 | dev | Core breaking changes | 92% pass ✓ |
| dev-50 | dev | Core breaking changes | 92% pass ✓ |
| dev-51 | dev | DAL | 67% partly ✗ |
| dev-52 | dev | Core breaking changes | 89% pass ✓ |
| dev-53 | dev | Theme | 80% partly ✓ |
| dev-54 | dev | Storefront | 82% partly ✓ |
| dev-55 | dev | Storefront | 54% fail ✓ |
| dev-56 | dev | Storefront | 82% partly ✓ |
| dev-57 | dev | Platform upgrade | 90% pass ✓ |
| dev-58 | dev | Hosting & ops | 80% partly ✓ |
| dev-59 | dev | Hosting & ops | 60% partly ✓ |
| dev-60 | dev | Hosting & ops | 68% partly ✓ |
| dev-61 | dev | Hosting & ops | 63% partly ✓ |
| dev-62 | dev | Config & CLI | 56% fail ✓ |
| dev-63 | dev | Config & CLI | 77% partly ✓ |
| dev-64 | dev | Admin API | 42% fail ✓ |
| dev-65 | dev | Admin API | 70% partly ✓ |
| dev-66 | dev | Admin API | 80% partly ✓ |
| dev-67 | dev | App system | 90% pass ✓ |
| dev-68 | dev | App system | 85% pass ✓ |
| dev-69 | dev | App system | 78% partly ✓ |
| dev-70 | dev | App system | 50% fail ✓ |
| dev-71 | dev | App system | 92% pass ✓ |
| func-01 | func | Merchant | 88% pass ✓ |
| func-02 | func | Merchant | 57% fail ✓ |
| func-03 | func | Merchant | 92% pass ✓ |
| func-04 | func | Merchant | 73% partly ✓ |
| func-05 | func | Merchant | 80% partly ✓ |
| func-06 | func | Merchant | 76% partly ✓ |
| func-07 | func | Merchant | 76% partly ✓ |
| func-08 | func | Merchant | 73% partly ✓ |
| func-09 | func | Merchant | 88% pass ✓ |
| func-10 | func | Merchant | 70% partly ✗ |
| func-11 | func | Merchant | 82% partly ✓ |
| func-12 | func | Merchant | 73% partly ✗ |
| edge-01 | edge | Trap | 100% pass – |
| edge-02 | edge | Trap | 100% pass – |
| edge-03 | edge | Trap | 85% pass – |
| edge-04 | edge | Trap | 64% partly – |
| edge-05 | edge | Trap | 100% pass – |
| edge-06 | edge | Trap | 25% fail – |
| edge-07 | edge | Trap | 85% pass – |
| edge-08 | edge | Trap | 88% pass – |
| edge-09 | edge | Trap | 88% pass – |
| gap-01 | gap | Gap | 94% pass – |
| gap-02 | gap | Gap | 73% partly – |
| gap-03 | gap | Gap | 83% partly – |
| gap-04 | gap | Gap | 85% pass – |
| gap-05 | gap | Gap | 80% partly – |
| gap-06 | gap | Gap | 88% pass – |
| gap-07 | gap | Gap | 100% pass – |
| gap-08 | gap | Gap | 100% pass – |

## Requests and responses

### fs-docs

| Case | Tool calls made | Page reached | Findability | Memory claims | Verdict |
| --- | --- | --- | --- | --- | --- |
| dev-01 | 6 retrieval calls (7 total) | developer/guides/plugins/plugins/framework/data-handling/add-complex-data-to-existing-entities.md = target | fail | 0 | partly |
| dev-02 | 0 retrieval calls (0 total) | developer/guides/plugins/plugins/plugin-fundamentals/plugin-lifecycle.md = target | fail | 0 | pass |
| dev-03 | 2 retrieval calls (2 total) | developer/guides/plugins/plugins/framework/store-api/add-store-api-route.md = target | pass | 0 | pass |
| dev-04 | 0 retrieval calls (0 total) | developer/guides/plugins/plugins/content/cms/add-cms-element.md = target | fail | 0 | partly |
| dev-05 | 3 retrieval calls (3 total) | developer/guides/plugins/themes/inheritance/add-theme-inheritance.md = target | pass | 0 | pass |
| dev-06 | 1 retrieval calls (1 total) | developer/guides/plugins/plugins/framework/flow/add-flow-builder-action.md = target | pass | 0 | partly |
| dev-07 | 1 retrieval calls (1 total) | developer/guides/plugins/plugins/framework/data-handling/add-custom-complex-data.md = target | pass | 0 | pass |
| dev-08 | 2 retrieval calls (2 total) | developer/guides/plugins/plugins/framework/data-handling/reading-data.md = target | pass | 0 | partly |
| dev-09 | 0 retrieval calls (0 total) | developer/guides/plugins/plugins/framework/data-handling/add-data-translations.md = target | fail | 0 | pass |
| dev-10 | 1 retrieval calls (1 total) | developer/guides/plugins/plugins/framework/data-handling/add-data-indexer.md = target | pass | 0 | partly |
| dev-11 | 9 retrieval calls (10 total) | developer/guides/plugins/plugins/services/dependency-injection.md = target | fail | 0 | partly |
| dev-12 | 0 retrieval calls (0 total) | developer/resources/references/adr/2026-07-30-migrate-container-configuration-from-xml-to-php.md ≠ target (none) | n/a | 1 | partly |
| dev-13 | 2 retrieval calls (2 total) | developer/guides/plugins/plugins/services/adjusting-service.md = target | pass | 0 | pass |
| dev-14 | 2 retrieval calls (2 total) | developer/guides/plugins/plugins/framework/event/listening-to-events.md = target | pass | 0 | pass |
| dev-15 | 5 retrieval calls (5 total) | developer/guides/plugins/plugins/framework/event/finding-events.md = target | fail | 0 | partly |
| dev-16 | 3 retrieval calls (3 total) | developer/guides/plugins/plugins/checkout/order/listen-to-order-changes.md = target | pass | 0 | pass |
| dev-17 | 2 retrieval calls (2 total) | developer/guides/plugins/plugins/checkout/cart/change-price-of-item.md = target | pass | 0 | pass |
| dev-18 | 4 retrieval calls (4 total) | developer/guides/plugins/plugins/checkout/cart/add-cart-processor-collector.md = target | pass | 1 | pass |
| dev-19 | 3 retrieval calls (3 total) | developer/guides/plugins/plugins/framework/message-queue/add-message-handler.md = target | pass | 0 | pass |
| dev-20 | 2 retrieval calls (2 total) | developer/guides/plugins/plugins/framework/rule/add-custom-rules.md = target | pass | 0 | pass |
| dev-21 | 4 retrieval calls (5 total) | developer/guides/plugins/plugins/framework/flow/add-flow-builder-trigger.md = target | pass | 0 | partly |
| dev-22 | 0 retrieval calls (0 total) | developer/guides/plugins/plugins/plugin-fundamentals/add-plugin-configuration.md = target | fail | 0 | partly |
| dev-23 | 2 retrieval calls (2 total) | developer/guides/plugins/plugins/content/mail/add-mail-template.md = target | pass | 0 | partly |
| dev-24 | 0 retrieval calls (0 total) | developer/guides/plugins/plugins/content/seo/add-custom-seo-url.md = target | fail | 0 | pass |
| dev-25 | 1 retrieval calls (1 total) | developer/guides/plugins/plugins/plugin-fundamentals/add-custom-commands.md = target | pass | 0 | pass |
| dev-26 | 1 retrieval calls (1 total) | developer/guides/plugins/plugins/checkout/documents/v2/add-a-document-type.md = target | pass | 0 | fail |
| dev-27 | 3 retrieval calls (3 total) | developer/guides/plugins/plugins/storefront/templates/twig-function-reference.md ≠ target (developer/guides/plugins/plugins/storefront/templates/customize-templates.md) | pass | 0 | pass |
| dev-28 | 1 retrieval calls (1 total) | developer/guides/plugins/plugins/storefront/javascript/override-existing-javascript.md = target | pass | 0 | partly |
| dev-29 | 1 retrieval calls (1 total) | developer/guides/plugins/plugins/storefront/controllers/add-data-to-storefront-page.md = target | pass | 0 | pass |
| dev-30 | 1 retrieval calls (1 total) | developer/guides/plugins/plugins/storefront/howto/add-listing-filters.md = target | pass | 0 | pass |
| dev-31 | 6 retrieval calls (7 total) | developer/guides/plugins/plugins/storefront/styling/add-scss-variables.md = target | fail | 0 | partly |
| dev-32 | 4 retrieval calls (4 total) | developer/guides/plugins/plugins/framework/custom-field/add-custom-field.md = target | pass | 0 | partly |
| dev-33 | 1 retrieval calls (1 total) | developer/guides/plugins/plugins/administration/module-component-management/add-custom-module.md = target | pass | 0 | partly |
| dev-34 | 1 retrieval calls (1 total) | developer/guides/plugins/plugins/administration/module-component-management/customizing-components.md = target | pass | 0 | pass |
| dev-35 | 1 retrieval calls (1 total) | developer/guides/plugins/plugins/administration/data-handling-processing/using-data-handling.md = target | pass | 0 | pass |
| dev-36 | 1 retrieval calls (1 total) | developer/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.md = target | pass | 0 | partly |
| dev-37 | 1 retrieval calls (1 total) | developer/guides/development/testing/unit/php-unit.md = target | pass | 0 | partly |
| dev-38 | 1 retrieval calls (1 total) | developer/guides/development/testing/unit/jest-admin.md = target | pass | 0 | partly |
| dev-39 | 3 retrieval calls (3 total) | developer/guides/development/testing/legacy/index.md ≠ target (developer/guides/development/testing/e2e-playwright/install-configure.md) | fail | 0 | fail |
| dev-40 | 1 retrieval calls (1 total) | developer/guides/upgrades-migrations/upgrade-shopware.md = target | pass | 0 | pass |
| dev-41 | 7 retrieval calls (8 total) | developer/guides/hosting/index.md = target | fail | 0 | partly |
| dev-42 | 2 retrieval calls (2 total) | developer/products/tools/cli/project-commands/upgrade.md = target | pass | 0 | pass |
| dev-43 | 1 retrieval calls (1 total) | developer/guides/upgrades-migrations/administration/vite.md = target | pass | 0 | partly |
| dev-44 | 1 retrieval calls (1 total) | developer/guides/upgrades-migrations/administration/vue3.md = target | pass | 0 | partly |
| dev-45 | 1 retrieval calls (1 total) | developer/guides/upgrades-migrations/administration/pinia.md = target | pass | 0 | pass |
| dev-46 | 1 retrieval calls (1 total) | developer/guides/upgrades-migrations/administration/meteor-components.md = target | pass | 0 | partly |
| dev-47 | 2 retrieval calls (2 total) | developer/guides/plugins/plugins/checkout/payment/add-payment-plugin.md = target | pass | 0 | pass |
| dev-48 | 2 retrieval calls (2 total) | developer/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md = target | pass | 0 | partly |
| dev-49 | 2 retrieval calls (2 total) | developer/guides/plugins/plugins/storefront/controllers/add-custom-controller.md = target | pass | 0 | pass |
| dev-50 | 2 retrieval calls (2 total) | developer/guides/plugins/plugins/plugin-fundamentals/add-scheduled-task.md = target | pass | 0 | pass |
| dev-51 | 4 retrieval calls (5 total) | developer/guides/plugins/plugins/framework/data-handling/entities-via-attributes.md = target | fail | 0 | partly |
| dev-52 | 2 retrieval calls (2 total) | developer/guides/plugins/plugins/database/database-migrations.md = target | pass | 0 | pass |
| dev-53 | 2 retrieval calls (2 total) | developer/guides/plugins/themes/configuration/theme-configuration.md = target | pass | 0 | partly |
| dev-54 | 2 retrieval calls (2 total) | developer/guides/plugins/plugins/storefront/advanced/add-cookie-to-manager.md = target | pass | 0 | partly |
| dev-55 | 2 retrieval calls (2 total) | developer/guides/development/accessibility/storefront-accessibility.md = target | pass | 0 | fail |
| dev-56 | 2 retrieval calls (2 total) | developer/guides/plugins/plugins/storefront/templates/customize-header-footer.md = target | pass | 0 | partly |
| dev-57 | 4 retrieval calls (4 total) | developer/products/extensions/b2b-suite-migration/index.md ≠ target (developer/products/extensions/b2b-suite-migration/execution/running-migration.md) | pass | 0 | pass |
| dev-58 | 2 retrieval calls (2 total) | developer/guides/hosting/infrastructure/redis.md = target | pass | 0 | partly |
| dev-59 | 2 retrieval calls (2 total) | developer/guides/hosting/infrastructure/reverse-http-cache.md = target | pass | 0 | partly |
| dev-60 | 2 retrieval calls (2 total) | developer/guides/hosting/infrastructure/message-queue.md = target | pass | 0 | partly |
| dev-61 | 3 retrieval calls (4 total) | developer/guides/hosting/infrastructure/elasticsearch/elasticsearch-setup.md = target | pass | 0 | partly |
| dev-62 | 9 retrieval calls (9 total) | developer/guides/hosting/configurations/shopware/index.md ≠ target (developer/guides/hosting/configurations/shopware/environment-variables.md) | pass | 1 | fail |
| dev-63 | 2 retrieval calls (2 total) | developer/guides/plugins/plugins/database/database-migrations.md ≠ target (developer/resources/references/core-reference/commands-reference.md) | pass | 0 | partly |
| dev-64 | 4 retrieval calls (4 total) | developer/guides/development/integrations-api/index.md ≠ target (developer/guides/development/integrations-api/auth-api-requests.md) | pass | 0 | fail |
| dev-65 | 2 retrieval calls (2 total) | developer/guides/development/integrations-api/search-criteria.md = target | pass | 0 | partly |
| dev-66 | 1 retrieval calls (1 total) | developer/guides/development/integrations-api/request-headers.md = target | pass | 0 | partly |
| dev-67 | 2 retrieval calls (2 total) | developer/guides/plugins/apps/app-base-guide.md = target | pass | 0 | pass |
| dev-68 | 2 retrieval calls (2 total) | developer/guides/plugins/apps/lifecycle/app-registration-setup.md = target | pass | 0 | pass |
| dev-69 | 1 retrieval calls (1 total) | developer/guides/plugins/apps/lifecycle/webhook.md = target | pass | 0 | partly |
| dev-70 | 2 retrieval calls (2 total) | developer/guides/plugins/apps/checkout/payment.md = target | pass | 0 | fail |
| dev-71 | 2 retrieval calls (2 total) | developer/guides/plugins/apps/custom-data/custom-entities.md = target | pass | 0 | pass |
| func-01 | 2 retrieval calls (3 total) | merchant/content/en/shopware-6/catalogues/products/v1-4-2-0.md = target | pass | 0 | pass |
| func-02 | 2 retrieval calls (2 total) | merchant/content/en/shopware-6/settings/rules/v1-6-1-0.md = target | pass | 0 | fail |
| func-03 | 2 retrieval calls (2 total) | merchant/content/en/shopware-6/marketing/promotions/v1-7-0-0.md = target | pass | 0 | pass |
| func-04 | 2 retrieval calls (2 total) | merchant/content/en/shopware-6/migration-en/what-is-migrated/v1-1-0-0.md = target | pass | 0 | partly |
| func-05 | 2 retrieval calls (2 total) | merchant/content/en/shopware-6/settings/saleschannel/v1-5-2-0.md = target | pass | 0 | partly |
| func-06 | 2 retrieval calls (2 total) | merchant/content/en/shopware-6/settings/Flow-Builder/v1-3-0-1.md = target | pass | 0 | partly |
| func-07 | 2 retrieval calls (2 total) | merchant/content/en/shopware-6/shopware-en/settings/importexport/v1-4-0-0.md = target | pass | 0 | partly |
| func-08 | 2 retrieval calls (2 total) | merchant/content/en/shopware-6/settings/custom-fields/v1-3-2-0.md = target | pass | 0 | partly |
| func-09 | 2 retrieval calls (2 total) | merchant/content/en/shopware-6/settings/Paymentmethods/v1-4-0-0.md = target | pass | 0 | pass |
| func-10 | 4 retrieval calls (4 total) | merchant/content/en/shopware-6/shopware-6-de/Catalogues/Dynamicproductgroups/v1-3-0-0.md = target | fail | 0 | partly |
| func-11 | 3 retrieval calls (5 total) | merchant/content/en/shopware-6/settings/system/integrationen/v1-1-0.md = target | pass | 0 | partly |
| func-12 | 3 retrieval calls (3 total) | merchant/content/en/shopware-6/commercial-features/b2b-components/v1-2-5-0.md ≠ target (merchant/content/en/shopware-6/extensions/shopware-commercial/v1-1-0-0.md) | fail | 0 | partly |
| edge-01 | 4 retrieval calls (4 total) | developer/concepts/api/store-api.md ≠ target (none) | n/a | 0 | pass |
| edge-02 | 5 retrieval calls (5 total) | developer/guides/plugins/plugins/services/dependency-injection.md ≠ target (none) | n/a | 0 | pass |
| edge-03 | 4 retrieval calls (4 total) | developer/guides/plugins/plugins/framework/data-handling/add-custom-complex-data.md ≠ target (none) | n/a | 0 | pass |
| edge-04 | 4 retrieval calls (4 total) | developer/concepts/api/store-api.md ≠ target (none) | n/a | 0 | partly |
| edge-05 | 3 retrieval calls (3 total) | developer/products/tools/mcp-server/index.md ≠ target (developer/products/tools/mcp-server/intro.md) | n/a | 0 | pass |
| edge-06 | 1 retrieval calls (1 total) | — — | n/a | 0 | fail |
| edge-07 | 3 retrieval calls (3 total) | developer/products/paas/shopware/composable-frontends/index.md ≠ target (none) | n/a | 0 | pass |
| edge-08 | 2 retrieval calls (2 total) | developer/guides/plugins/plugins/framework/data-handling/reading-data.md ≠ target (none) | n/a | 0 | pass |
| edge-09 | 6 retrieval calls (6 total) | merchant/content/en/shopware-6/settings/Business-Events/v1-0-0.md = target | n/a | 0 | pass |
| gap-01 | 13 retrieval calls (13 total) | developer/resources/references/adr/2022-02-09-controller-configuration-route-defaults.md ≠ target (none) | n/a | 0 | pass |
| gap-02 | 12 retrieval calls (12 total) | developer/products/tools/cli/project-commands/helper-commands.md ≠ target (none) | n/a | 0 | partly |
| gap-03 | 0 retrieval calls (0 total) | developer/guides/development/integrations-api/index.md ≠ target (none) | n/a | 0 | partly |
| gap-04 | 4 retrieval calls (4 total) | developer/resources/guidelines/code/backward-compatibility.md ≠ target (none) | n/a | 0 | pass |
| gap-05 | 4 retrieval calls (4 total) | developer/resources/references/adr/2025-11-03-improved-http-cache-layer.md ≠ target (none) | n/a | 0 | partly |
| gap-06 | 5 retrieval calls (5 total) | developer/resources/references/adr/2023-10-17-add-unique-identifiers-for-checkout-methods.md ≠ target (none) | n/a | 0 | pass |
| gap-07 | 9 retrieval calls (9 total) | developer/guides/plugins/plugins/content/media/index.md ≠ target (none) | n/a | 0 | pass |
| gap-08 | 7 retrieval calls (7 total) | developer/concepts/api/store-api.md ≠ target (none) | n/a | 0 | pass |

(Full per-case tool-call logs and citation excerpts are in `raw/fs-docs/<case-id>.json` and `derived/fs-docs/shard-*.json`; the interactive HTML report renders them per case.)

## Scores by case

### fs-docs

| Case | Grounding | Accuracy | Completeness | Citation | Honesty | Actionability | Total | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dev-01 | 100 | 40 | 40 | 70 | 100 | 100 | 73% | partly |
| dev-02 | 100 | 70 | 70 | 100 | 100 | 70 | 85% | pass |
| dev-03 | 100 | 100 | 100 | 70 | 100 | 100 | 97% | pass |
| dev-04 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| dev-05 | 100 | 100 | 100 | 70 | 100 | 100 | 97% | pass |
| dev-06 | 100 | 40 | 70 | 70 | 100 | 100 | 77% | partly |
| dev-07 | 100 | 100 | 100 | 70 | 100 | 100 | 97% | pass |
| dev-08 | 100 | 40 | 70 | 70 | 100 | 100 | 77% | partly |
| dev-09 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-10 | 100 | 40 | 70 | 70 | 100 | 100 | 77% | partly |
| dev-11 | 100 | 40 | 70 | 70 | 0 | 100 | 62% | partly |
| dev-12 | 70 | 70 | 70 | 100 | 100 | 70 | 77% | partly |
| dev-13 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-14 | 100 | 100 | 100 | 70 | 100 | 100 | 97% | pass |
| dev-15 | 100 | 40 | 40 | 100 | 100 | 100 | 76% | partly |
| dev-16 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-17 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-18 | 70 | 100 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-19 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-20 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-21 | 100 | 0 | 40 | 100 | 100 | 100 | 66% | partly |
| dev-22 | 100 | 40 | 40 | 70 | 100 | 100 | 73% | partly |
| dev-23 | 100 | 40 | 40 | 100 | 100 | 100 | 76% | partly |
| dev-24 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-25 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-26 | 100 | 0 | 0 | 70 | 100 | 100 | 57% | fail |
| dev-27 | 100 | 70 | 100 | 70 | 100 | 100 | 89% | pass |
| dev-28 | 100 | 70 | 40 | 100 | 100 | 100 | 83% | partly |
| dev-29 | 100 | 100 | 100 | 70 | 100 | 100 | 97% | pass |
| dev-30 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-31 | 100 | 70 | 70 | 70 | 0 | 100 | 70% | partly |
| dev-32 | 100 | 40 | 70 | 70 | 100 | 100 | 77% | partly |
| dev-33 | 100 | 40 | 40 | 70 | 100 | 100 | 73% | partly |
| dev-34 | 100 | 100 | 100 | 70 | 100 | 100 | 97% | pass |
| dev-35 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-36 | 100 | 40 | 100 | 70 | 100 | 100 | 82% | partly |
| dev-37 | 70 | 40 | 70 | 70 | 70 | 100 | 65% | partly |
| dev-38 | 70 | 40 | 40 | 70 | 100 | 70 | 62% | partly |
| dev-39 | 70 | 0 | 40 | 70 | 100 | 70 | 52% | fail |
| dev-40 | 100 | 70 | 100 | 70 | 100 | 100 | 89% | pass |
| dev-41 | 100 | 40 | 70 | 70 | 100 | 100 | 77% | partly |
| dev-42 | 100 | 70 | 100 | 70 | 100 | 100 | 89% | pass |
| dev-43 | 70 | 40 | 100 | 70 | 70 | 100 | 70% | partly |
| dev-44 | 100 | 0 | 40 | 100 | 100 | 100 | 66% | partly |
| dev-45 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-46 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| dev-47 | 100 | 100 | 100 | 70 | 100 | 100 | 97% | pass |
| dev-48 | 100 | 40 | 70 | 70 | 100 | 70 | 74% | partly |
| dev-49 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-50 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-51 | 100 | 40 | 70 | 0 | 100 | 70 | 67% | partly |
| dev-52 | 100 | 70 | 100 | 100 | 100 | 70 | 89% | pass |
| dev-53 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| dev-54 | 100 | 70 | 100 | 0 | 100 | 100 | 82% | partly |
| dev-55 | 100 | 0 | 0 | 100 | 100 | 40 | 54% | fail |
| dev-56 | 100 | 70 | 100 | 0 | 100 | 100 | 82% | partly |
| dev-57 | 100 | 100 | 100 | 0 | 100 | 100 | 90% | pass |
| dev-58 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| dev-59 | 100 | 0 | 40 | 100 | 100 | 40 | 60% | partly |
| dev-60 | 100 | 40 | 40 | 100 | 70 | 70 | 68% | partly |
| dev-61 | 100 | 0 | 40 | 100 | 100 | 70 | 63% | partly |
| dev-62 | 70 | 40 | 40 | 40 | 100 | 40 | 56% | fail |
| dev-63 | 100 | 40 | 70 | 100 | 100 | 70 | 77% | partly |
| dev-64 | 70 | 0 | 70 | 40 | 0 | 100 | 42% | fail |
| dev-65 | 100 | 40 | 70 | 40 | 70 | 100 | 70% | partly |
| dev-66 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| dev-67 | 100 | 100 | 100 | 0 | 100 | 100 | 90% | pass |
| dev-68 | 100 | 40 | 100 | 100 | 100 | 100 | 85% | pass |
| dev-69 | 100 | 70 | 70 | 0 | 100 | 100 | 78% | partly |
| dev-70 | 100 | 0 | 0 | 100 | 100 | 0 | 50% | fail |
| dev-71 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| func-01 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| func-02 | 100 | 0 | 0 | 100 | 100 | 70 | 57% | fail |
| func-03 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| func-04 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| func-05 | 100 | 70 | 40 | 100 | 100 | 70 | 80% | partly |
| func-06 | 100 | 40 | 40 | 100 | 100 | 100 | 76% | partly |
| func-07 | 100 | 40 | 40 | 100 | 100 | 100 | 76% | partly |
| func-08 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| func-09 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| func-10 | 100 | 40 | 0 | 100 | 100 | 100 | 70% | partly |
| func-11 | 100 | 70 | 70 | 40 | 100 | 100 | 82% | partly |
| func-12 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| edge-01 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| edge-02 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| edge-03 | 100 | 70 | 70 | 100 | 100 | 70 | 85% | pass |
| edge-04 | 70 | 70 | 40 | 40 | 100 | 40 | 64% | partly |
| edge-05 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| edge-06 | 40 | 0 | 0 | 0 | 100 | 0 | 25% | fail |
| edge-07 | 100 | 70 | 70 | 100 | 100 | 70 | 85% | pass |
| edge-08 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| edge-09 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| gap-01 | 100 | 100 | 100 | 40 | 100 | 100 | 94% | pass |
| gap-02 | 100 | 70 | 70 | 100 | 0 | 100 | 73% | partly |
| gap-03 | 100 | 70 | 40 | 100 | 100 | 100 | 83% | partly |
| gap-04 | 100 | 70 | 70 | 100 | 100 | 70 | 85% | pass |
| gap-05 | 100 | 70 | 40 | 100 | 100 | 70 | 80% | partly |
| gap-06 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| gap-07 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| gap-08 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |

## Failures and official references

- **dev-01 (fs-docs)** — partly, 73%
  - Answer teaches getDefinitionClass() returning ProductDefinition::class as the extension hook — this method does not exist on EntityExtension in 6.7 (getEntityName() is the sole abstract method); this reproduces the documented dev-01 doc defect noted in cases.md and fails fact 1
  - Missing fact 2's restriction that extension fields must be association-shaped (AssociationField/Runtime/FkField+companion) and the Extension flag mechanics
  - Fact 3 (registration tag shopware.entity.extension, BulkEntityExtension w/ shopware.bulk.entity.extension) is present
  - One of two citations has rangeExists:false (whole-file range mismatch) though its excerpt matches genuine page content
  - Official: confirmed-code-evidence — "In 6.7 the single abstract method ... is getEntityName(): string ... getDefinitionClass() does not exist in 6.7. [code: Framework/DataAbstractionLayer/EntityExtension.php:46]"
- **dev-04 (fs-docs)** — partly, 73%
  - Does not state that registerCmsElement() requires only name+component, nor the silent-invisibility trap when previewComponent is missing (fact 1 core nuance missing)
  - Storefront naming-convention rendering (cms-element-<name>.html.twig) is captured (fact 2 present)
  - No mention of AbstractCmsElementResolver / CmsElementResolverInterface / shopware.cms.data_resolver tag at all — fact 3 (server-side data) fully absent
  - Case's documented trap (element registered alone reaches the change-element modal but the sidebar drag list is block-registry-only) is only weakly gestured at ('add or reuse a CMS block to host it')
  - Official: confirmed-code-evidence — "an element registered without previewComponent is silently invisible in the slot's element picker... the Shopping Experiences sidebar list is built solely from the block registry [code: administration"
- **dev-06 (fs-docs)** — partly, 77%
  - FlowAction contract (getName/requirements/handleFlow) and flow.action tag with key+priority correctly stated (facts 1-2 present)
  - UI registration is described as overriding the sw-flow-sequence-action component instead of the expected flowBuilderService additive registration methods (addActionNames/addLabels/addIcons/addGroups/addActionGroupMapping) — a materially different mechanism from the confirmed evidence
  - DelayableAction/TransactionalAction marker interfaces are not mentioned
  - Official: confirmed-code-evidence — "It is not an event subscriber — there is no getSubscribedEvents() and no handle(FlowEvent); FlowExecutor calls handleFlow() directly. [code: Content/Flow/Dispatching/Action/FlowAction.php:9-19]"
- **dev-08 (fs-docs)** — partly, 77%
  - Correctly refutes the Doctrine findBy() trap and demonstrates search()/Criteria/addFilter/addAssociation/getAssociation/addSorting
  - Correctly recommends a deterministic sort tiebreaker for RepositoryIterator pagination
  - Does not state that EntityRepositoryInterface no longer exists in 6.7 and that the old type hint is fatal (fact 1's key trap)
  - Official: confirmed-code-evidence — "There is no Doctrine-style findBy()/findOneBy()/find(): the only read path is $repository->search(Criteria $criteria, Context $context). [code: Framework/DataAbstractionLayer/EntityRepository.php:62-6"
- **dev-10 (fs-docs)** — partly, 77%
  - Only names getName/iterate/update/handle as required overrides, omitting the two other abstract members getTotal() and getDecorated() — an implementation following only the answer would not compile
  - Correctly recommends manipulating data via Connection instead of the DAL to avoid the indexing re-entrancy loop, and mentions DISABLE_INDEXING as the DAL-write escape hatch
  - Correctly identifies bin/console dal:refresh:index for a full reindex
  - Official: confirmed-code-evidence — "$working is written only at :127 and :158, both inside refresh() ... on the queued write path ... handle() runs with $working === false, so a DAL write inside handle() re-enters refresh() unguarded. ["
- **dev-11 (fs-docs)** — partly, 62%
  - Claims plugin XML service configuration 'is deprecated in 6.7 and removed in 6.8' as a blanket statement, when the confirmed fact is that XML loads silently with no deprecation through 6.7.13.0 and the deprecation only starts at 6.7.14.0 — materially wrong for a query pinned to 'On Shopware 6.7'
  - Autowiring-not-default and explicit-argument-injection mechanics (fact 2/3) are correctly described with a working services.php example
  - selfReportDelta shows 3 additional tool calls (a services.xml grep, a Read of an architecture DI page, another grep) not present in toolCallLog, that are plausibly this case's own research rather than another case's target page — treated as a genuine under-report
  - Official: confirmed-code-evidence — "Autowiring is not on by default for a plugin's services: the generated skeleton is a bare <services> element with no <defaults autowire="true" autoconfigure="true"/>. [code: Framework/Plugin/Command/S"
- **dev-12 (fs-docs)** — partly, 77%
  - Docs target for this case is 'none' in the docs corpus (per cases.md's explicit exception table); the agent did not claim not-found (notFoundClaim:false) and instead built a partial answer from the ADR page plus one clearly [from memory]-labelled XML syntax detail — so the Source-absent override does not apply
  - Correctly infers the 6.6 convention (services.xml) from the ADR's own description of the prior state
  - Does not state that Symfony Definition defaults to not-autowired/not-autoconfigured on 6.6 (fact 3 omitted)
  - Official: confirmed-code-evidence — "Symfony's Definition defaults to autowired = false / autoconfigured = false and registerContainerFile() injects no <defaults> block, so every dependency must be listed explicitly. [code: vendor/symfon"
- **dev-15 (fs-docs)** — partly, 76%
  - Recommends grepping for the literal term '@Event' to find DAL event classes — the confirmed evidence explicitly states this documented search term is dead and occurs nowhere under vendor/shopware, so this is a materially misleading recommendation reproducing a documented dead technique (escalation trigger 3, settled directly from the expected file's evidence table already within the read snippet)
  - Does not describe the mechanical two-hop dispatch (EntityLoadedEvent naming + NestedEventDispatcher unwrapping) that explains why 'product.loaded' has no literal dispatch site
  - Correctly identifies StorefrontRenderEvent as fired before Twig rendering and the {route}.request/.response/.render/.encode family (fact 2 present)
  - Does not mention debug:event-dispatcher's 'already has a listener' limitation nor debug:business-events
  - Official: confirmed-code-evidence — "The @Event annotation marks event classes in the 6.7 source — absent: grep -rn "@Event" vendor/shopware returns 0 matches. [code: Content/Product/ProductEvents.php:14-17]"
- **dev-21 (fs-docs)** — partly, 66%
  - This case's explicit Trap states an answer must not require an elevated listener priority and must not present the BusinessEventCollectorEvent subscriber as the only registration route — the answer recommends 'a high priority (e.g. 1000)' and only describes the subscriber route, directly reproducing both trapped behaviours
  - Does not mention the supported Bundle::getActionEventClasses() registration route, nor that Collection::set() (not add()) must key the definition by name
  - Does not mention that define()'s custom name only relabels the admin trigger without changing what fires, nor the flow.storer requirement for trigger data
  - Official: confirmed-code-evidence — "Trap: the documented recipe demands a listener priority of 1000 and presents the BusinessEventCollectorEvent subscriber as the only route; neither holds. An answer that passes must not require an elev"
- **dev-22 (fs-docs)** — partly, 73%
  - The field-type enumeration omits 'price', one of the 16 documented/confirmed input-field types — a materially incomplete answer to the query's explicit 'what field types are available' half
  - Correctly describes config.xml as a no-code declarative mechanism (fact 1 present)
  - Does not mention system_config storage key format, SystemConfigService getters, or that a default row is only written when a defaultValue is declared — fact 3 fully absent
  - Official: confirmed-code-evidence — "In 6.7.13.0 the XSD enumerates exactly 16 types ... Anything outside that list ... is not a field type but a <component name="..."> element. [code: System/SystemConfig/Schema/config.xsd:38,41-60,84-88"
- **dev-23 (fs-docs)** — partly, 76%
  - Correctly describes the migration-based insert path into mail_template_type/translations/mail_template/mail_template_translation with an idempotency guard (fact 1 present)
  - Does not mention the core CreateMailTemplateTrait helper at all (fact 2 fully absent)
  - Instructs system_default = 0 as the example value, reproducing the docs' 'must be 0' framing that the confirmed evidence calls editorial (1 is the actually-safer value); also omits that mail_template_sales_channel no longer exists in 6.7 and that no PHP/business-event registration is needed
  - Official: confirmed-code-evidence — "There is no declarative path in 6.7 — no manifest element, no resource loader and no mail-template hook on the Plugin base class — so the template is shipped as data from a MigrationStep. [code: Conte"
- **dev-26 (fs-docs)** — fail, 57%
  - Answer builds entirely on the Document v2 recipe (AbstractDocumentType, DOCUMENT_GENERATION_REWORK), which the case's confirmed evidence shows does not exist at 6.7.13.0 — this is the documented trap and the answer fails it.
  - Completeness 0/3: none of the required v1 AbstractDocumentRenderer facts (renderer contract, document_type/number-range prerequisite, literal Twig template resolution) are present.
  - citationsVerified 0/1 — the cited range 1-162 does not exist per audit, though the excerpt reproduces genuine page content.
  - Official: confirmed-code-evidence — "Trap: The docs clone carries two competing 6.7 answers. The Document v2 page ... describes a stack that does not exist at 6.7.13.0 — an answer built on it is wrong for this pin."
- **dev-28 (fs-docs)** — partly, 83%
  - Fact 2 (override() fully replaces, must explicitly extend to keep behavior) is conveyed via concrete subclass+super() guidance.
  - Facts 1 (selector must match core's registered selector or override is refused) and 3 (CookiePermission is registered lazily; register() infers async from a missing prototype descriptor) are not stated.
  - Adds an unverified claim ('each plugin can only be overridden once') that the case's own evidence records as 'not settled by code' — presented as fact with no caveat.
  - Official: confirmed-code-evidence — "override() is refused with a console.warn unless the registry holds that name for that selector. [code: storefront: Resources/app/storefront/src/plugin-system/plugin.registry.js:21]"
- **dev-31 (fs-docs)** — partly, 70%
  - selfReportDelta shows a materially under-reported toolCallLog: 4 calls reported vs 7 actual, missing 3 Bash find calls — Honesty scored 0 for this.
  - Fact 2 (hasCssValue() requires a string value; colorpicker works but bool/checkbox is silently dropped; PR 13584 did not fix the plugin-config route) is entirely absent from the answer.
  - findabilityStrict fail — 4 list/grep calls occurred before the target was read.
  - Official: confirmed-code-evidence — "hasCssValue() skips the element unless config.css is set and the resolved value (or defaultValue) is a string. [code: storefront: Theme/Subscriber/ThemeCompilerEnrichScssVarSubscriber.php:82-101]"
- **dev-32 (fs-docs)** — partly, 77%
  - States custom fields become non-searchable by default 'since 6.7.6.0' — the case's confirmed evidence fixes this at 6.7.7.0, an explicit documented trap the answer falls into.
  - Fact 3's remaining content (immutability of name/type, ACL requirement, reindex-on-enable) is otherwise unaddressed.
  - Official: confirmed-code-evidence — "For the set to appear on the product detail page it must be bound to the product entity through a custom_field_set_relation row ... and must not be global. [code: System/CustomField/Aggregate/CustomFi"
- **dev-33 (fs-docs)** — partly, 73%
  - States settingsItem.group values are limited to 'shop'/'system'/'plugins' — exactly the documented Trap the case says must not be claimed (no runtime validation exists, and 'shop' is not even in the 6.7 TypeScript union).
  - Registration abort conditions (missing hyphen, duplicate id, no routes/routeMiddleware, display:false) are not covered.
  - Menu-entry requirements (parent/label mandatory, +1000 position shift, no icon fallback) are not covered.
  - Official: confirmed-code-evidence — "Registration aborts (console warning, no exception) if the module id contains no hyphen, if the id is already registered, or if the manifest declares neither routes nor routeMiddleware; display: false"
- **dev-36 (fs-docs)** — partly, 82%
  - States a role's 'dependencies' array is optional — the case's confirmed evidence is explicit that no default is applied anywhere and omitting it throws; this directly contradicts expected fact 1.
  - Correctly covers acl.can()/inject:['acl'], meta.privilege router guard, and Plugin::enrichPrivileges() for facts 2 and 3.
  - Official: confirmed-code-evidence — "Every role entry must carry both privileges and dependencies: nothing defaults dependencies, and the roles detail page dereferences it unguarded, so omitting it throws. [code: administration package —"
- **dev-37 (fs-docs)** — partly, 65%
  - Covers the phpunit.xml/TestBootstrap.php chain and KernelTestBehaviour/IntegrationTestBehaviour usage (facts 1 and 2).
  - Recommends 'composer require --dev dev-tools' to obtain a PHPUnit runner — unsupported by the cited excerpt and contradicting the case's fact that shopware/core ships no PHPUnit dependency and a 6.7 project itself pins phpunit/phpunit ^11.5.
  - selfReportDelta shows reported=2 vs actual=1 (an over-reported log, not the under-report pattern) — treated as a minor honesty concern rather than the 0-band under-report rule.
  - Official: confirmed-code-evidence — "tests/TestBootstrap.php chains Shopware\Core\TestBootstrapper → addCallingPlugin() → addActivePlugins('<PluginName>') → setForceInstallPlugins(true) → bootstrap() → getClassLoader(). [code: Framework/"
- **dev-38 (fs-docs)** — partly, 62%
  - Describes mounting via Component.register+build+shallowMount using 'localVue' — a Vue-2 test-utils construct; the case's confirmed evidence states Vue-3 test-utils puts stubs/mocks/provide under 'global', not top-level, and 6.7 has no localVue path.
  - Does not mention wrapTestComponent, the primary documented mounting path, at all.
  - Fact 3 (no Jest harness ships for a plugin; plugin must supply its own config; component-imports.js must exist first or jest.config.js throws) is entirely absent.
  - Official: confirmed-code-evidence — "Shopware 6.7 ships no Jest harness for a plugin ... a plugin must supply its own Jest configuration. [code: jest.config.js:35-38,14-17]"
- **dev-39 (fs-docs)** — fail, 52%
  - Notes the corpus's own Cypress-deprecation warning ('use Playwright instead') but then proceeds to teach the full legacy Cypress setup in detail — exactly the trap the case defines: 'An answer that explains how to set up Cypress for 6.7 is wrong.'
  - Playwright is mentioned only in passing with no setup detail (npm install/playwright install, .env/integration:create, actor-pattern fixtures) — facts 2 and 3 essentially absent.
  - findabilityStrict fail — the target page (e2e-playwright/install-configure.md) was never read; pageReached is the legacy testing index.
  - Official: confirmed-code-evidence — "There is no Cypress support in Shopware 6.7 — the premise of the question is stale ... The current E2E path is Playwright with the published @shopware-ag/acceptance-test-suite package."
- **dev-41 (fs-docs)** — partly, 77%
  - States the PHP requirement as an open-ended '8.2+' rather than the case's enumerated bounded constraint (~8.2.0||~8.3.0||~8.4.0||~8.5.0) — the case specifically flags this framing as the reason PHP 8.5 initially aborted before support was added.
  - Does not mention that the database version check runs only inside DatabaseConnectionFactory::createConnection() (system:install/web installer) and never during composer update or at boot — a central nuance given the query's premise.
  - Recommends manual node -v/php -v/composer -V checks rather than the case's documented CLI preflight tool, composer check-platform-reqs.
  - findabilityStrict fail — 3 list/grep calls occurred before the target page was read.
  - Official: confirmed-code-evidence — "The PHP requirement Composer enforces is the enumerated constraint "php": "~8.2.0 || ~8.3.0 || ~8.4.0 || ~8.5.0" ... a bounded list, not an open-ended "8.2 or newer". [code: composer.json:51-72]"
- **dev-43 (fs-docs)** — partly, 70%
  - States 'The feature flag ADMIN_VITE already exists to test the new system' — the case's confirmed evidence explicitly records this as an absent claim (grep for ADMIN_VITE/FEATURE_ADMIN_VITE across vendor/shopware returns zero hits) and it is not supported by the cited excerpt.
  - Correctly locates the optional vite.config.mts one directory deeper than the old webpack build/ directory.
  - Covers var/plugins.json / bundle:dump discovery and per-plugin Vite config synthesis (fact 3) at a high level.
  - Official: confirmed-code-evidence — "Trap: webpack.config.js is the pre-6.7 build entry point. In 6.7 it is inert ... an answer that ... presents vite.config.mts as a mandatory drop-in replacement for it, is wrong."
- **dev-44 (fs-docs)** — partly, 66%
  - For $tc: correctly recommends Shopware.Snippet.tc in place of this.$tc inside a prop default (fact 1 present).
  - For $parent: recommends the fixed 'this.$parent.$parent' hop as the fix — the case's Trap explicitly names this exact hardcoded-hop pattern as the wrong general fix, since the AsyncComponentWrapper depth is not fixed.
  - Frames this.$tc as a safe exception ('very likely to break except this.$tc') — the case's Trap explicitly says $tc is not a safe exception; it is @deprecated tag:v6.8.0 for removal, contradicting this framing.
  - The codemod/eslint auto-fix mechanism and its TS-file gap (fact 3) are not mentioned.
  - Official: confirmed-code-evidence — "Trap: this.$tc is not the safe exception ... it is deprecated for removal in 6.8. And mutating a prop does not throw a hard error ... An answer that asserts a hard runtime error is wrong."
- **dev-46 (fs-docs)** — partly, 73%
  - Reproduces the docs' invocation 'composer run admin:code-mods -- --plugin-name example-plugin --fix -v 6.7' verbatim — the case's Trap explicitly states this script does not exist outside the shopware/shopware monorepo, so this is a materially wrong command for a plugin project.
  - Correctly covers the deprecated-prop mechanic (sw-button/sw-card render mt-* by default, 'deprecated' prop opts back to 6.6 rendering) — fact 1 present.
  - Fact 2 (deprecated-prop rule governs only 15 components; sw-tabs/sw-popover/sw-loader/sw-skeleton-bar use different, mostly-inactive feature flags) is entirely absent.
  - Official: confirmed-code-evidence — "It is not the general mechanism: sw-tabs and sw-popover have no deprecated prop and switch on a useMeteorComponent computed gated by Shopware.Feature.isActive('V6_8_0_0') ... sw-loader and sw-skeleton"
- **dev-48 (fs-docs)** — partly, 74%
  - Correctly gives the async registration syntax (lazy-import second argument, no separate async API) and the exact compiled-file path.
  - Omits the plugin discovery/build mechanism (var/plugins.json, bundle:dump) and the init()/DOMContentLoaded lifecycle and base-class-extension requirement (fact 1 largely absent).
  - Official: confirmed-code-evidence — "There is no separate async API or async option: register() infers it from the argument having no prototype own-property. [code: storefront Resources/app/storefront/src/plugin-system/plugin.manager.js:"
- **dev-51 (fs-docs)** — partly, 67%
  - Covers fact 1 (Entity attribute, Field attributes, PrimaryKey) and fact 2 (shopware.entity tag, auto-registered definition/repository) well
  - Fact 3 (attribute entities do not create their DB table; a plugin migration is still required) is entirely absent — an important omission since following the answer as given would leave no table for the entity
  - findability fail: 3 list/grep calls before the target read (audit listGrepBeforeTargetRead=3)
  - citation 0/1: the cited range 1-621 does not exist (audit rangeExists=false) though the file and general content match
  - Official: confirmed-code-evidence — "Attribute entities do not create their database table: the plugin must ship a MigrationStep with the CREATE TABLE statement. [code: Migration/V6_7/Migration1742199549MeasurementSystemTable.php:32-42]"
- **dev-53 (fs-docs)** — partly, 80%
  - Fact 1 (config.fields location) and fact 2 (snippet key pattern sw-theme.<theme>.<tab>.<block>.<section>.<field>.label) are stated correctly
  - Fact 3 is missing/misrepresented: the answer claims inline label/helpText are simply deprecated as of 6.7.1.0 examples, never mentioning that they still work as a fallback in 6.7 and are only stripped when the (unreleased) v6.8.0.0 feature flag is active — the actual mechanism behind 'labels disappeared'
  - Escalation trigger 3 fired: the answer's central claim about why labels vanished reads correctly against the doc's own framing but is disproven by the code evidence table ('theme.json config labels were removed in 6.7' verdict: absent — removal is tagged v6.8.0). Read Evidence — code (decisive) rows on ThemeConfigFieldFactory.php:17-20 and ThemeMergedConfigBuilder.php:152-169 to settle this.
  - Official: confirmed-code-evidence — "The inline theme.json label/helpText arrays still work in 6.7 — they are used as the administration's fallback ... and are only stripped when the v6.8.0.0 feature flag is active, which is the mechanis"
- **dev-54 (fs-docs)** — partly, 82%
  - All three expected facts substantively present: CookieGroupCollectEvent listener, CookieEntry/CookieGroup usage, legacy CookieProviderInterface deprecation
  - Minor inaccuracy: states the store-api endpoint as '/store-api/cookie/groups' where the code names it '/store-api/cookie-groups' (CookieRoute.php:21-47)
  - citation 0/1: cited range 1-155 does not exist per audit (rangeExists=false)
- **dev-55 (fs-docs)** — fail, 54%
  - The answer explicitly tells the reader to 'set ACCESSIBILITY_TWEAKS=1 in .env' for 6.7 — this is exactly the case's stated Trap ('An answer that tells the reader to set ACCESSIBILITY_TWEAKS=1 ... is wrong for 6.7 — the flag is inert there')
  - Fact 1 (flag is unconditional/inert in 6.7) is directly contradicted
  - Fact 2 (sw_extends inheritance mechanism, silent block-drop vs parent() throw) is entirely absent
  - Fact 3 (re-adopt block by block; SCSS/JS changes) is entirely absent
  - Escalation trigger 3 fired: answer agrees with a documentation framing (flag gates the change, describing 6.6 behavior) that the code evidence explicitly disproves for 6.7 (feature.yaml:24-28 declares the flag but nothing reads it). Settled: the docs page itself carries the 6.6-era framing verbatim, and the agent reproduced it uncritically for a 6.7-pinned query.
  - Official: confirmed-code-evidence — "Trap: An answer that tells the reader to set ACCESSIBILITY_TWEAKS=1 in .env, or that the changes can be switched off again by disabling that flag, is wrong for 6.7 — the flag is inert there."
- **dev-56 (fs-docs)** — partly, 82%
  - Fact 1 (block override + headerParameters merge) and a working equivalent of fact 3 (StorefrontRenderEvent subscriber path) present
  - Fact 3's pagelet-event alternative (HeaderPageletLoadedEvent/addExtension) and the 'no page variable, strict_variables off' trap are not mentioned
  - citation 0/1: cited range 1-104 does not exist per audit (rangeExists=false)
- **dev-58 (fs-docs)** — partly, 80%
  - Fact 1 (connections.<name>.dsn config) and fact 3 (per-use-case eviction policy recommendations) are present and match well
  - Fact 2 is entirely absent: never states that redis_url no longer exists in 6.7, nor names the specific subsystems (cart storage, number range, cache invalidation delay) that require a named connection
  - The query's stated premise ('my shopware.yaml still uses redis_url') is never addressed — the answer neither confirms nor corrects it, missing the query's central trap
  - Official: confirmed-code-evidence — "redis_url no longer exists anywhere in 6.7 core; every subsystem references a connection name instead. [code: Checkout/DependencyInjection/CompilerPass/CartStorageCompilerPass.php:27-34]"
- **dev-59 (fs-docs)** — partly, 60%
  - Answer recommends setting 'use_varnish_xkey: true' as if still necessary — this is exactly the case's stated Trap ('the use_varnish_xkey: true ... block that docs still show as the primary example are no longer effective in 6.7')
  - Fact 3 (delayed invalidation on by default, shopware.invalidate_cache scheduled task every 5 min, sw-force-cache-invalidate header) — the actual diagnostic answer to 'my Varnish cache is never invalidated' — is entirely absent
  - Escalation trigger 3 fired: answer's xkey-config recommendation looks correct against the doc's own warning text but is disproven by code (use_varnish_xkey is a deprecated no-op; Varnish/xkey is already the compiled-in default per ReverseProxyCompilerPass.php:13-32 and cache.xml:233-238). Settled from Evidence — code (decisive).
  - Audit note: ground-truth call log shows a stray 'rm -rf' bash call against a mistakenly-named reports path outside the corpus, apparently self-correcting an earlier bad Write path — provenance only, not scored.
  - Official: confirmed-code-evidence — "Invalidation is delayed by default in 6.7 (shopware.cache.invalidation.delay_enabled defaults to true) ... with no scheduled-task worker, Varnish is never purged. [code: Framework/Adapter/Cache/CacheI"
- **dev-60 (fs-docs)** — partly, 68%
  - Fact 1 (explicit transport naming, e.g. 'messenger:consume async low_priority') is present
  - Answer states 'you must also set up a CLI worker for the failed transport ... or failed messages will never be processed' — this directly contradicts the expected fact and the case's own Absences table ('A production worker must also be set up for the failed transport | absent'; intended drain is messenger:failed:*)
  - Fact 2's critical consequence — that disabling the admin worker makes bin/console scheduled-task:run mandatory, since nothing else queues scheduled tasks — is never mentioned, despite the query directly asking how to turn off the admin worker
  - Escalation trigger 2 fired for the 'failed transport worker' claim: checked the case's Absences table, which explicitly records this as a wrong claim not supported by code.
  - Official: confirmed-code-evidence — "Disable the admin worker ... once it is off a separate bin/console scheduled-task:run process is mandatory ... without it no scheduled task is ever queued. [code: Framework/MessageQueue/Command/Schedu"
- **dev-61 (fs-docs)** — partly, 63%
  - Answer states 'shard and replica counts are set by default to three shards and three replicas' — this is exactly the case's stated Trap: the docs' three-shards/three-replicas default is no longer true for the storefront indices in 6.7 (env defaults are now empty)
  - Fact 3 (separate admin index settings/command, still defaulting 3/3) is entirely absent — no distinction drawn between storefront and admin indices at all
  - Fact 2's es:index command is mentioned, though 'dal:refresh:index --use-queue' is offered as an equivalent, which is a different/broader command
  - Escalation trigger 3 fired: the '3 shards/3 replicas by default' claim looks correct against the doc text but is disproven by the code evidence (elasticsearch.yaml env defaults are empty strings in 6.7). Settled from Evidence — code (decisive).
  - Official: confirmed-code-evidence — "Trap: The docs' "three shards and three replicas by default" is no longer true for the storefront indices in 6.7 — the defaults were emptied so the cluster decides, and only the admin indices still de"
- **dev-62 (fs-docs)** — fail, 56%
  - Answer honestly labels the Symfony-standard precedence claim as [from memory] since the corpus did not state it explicitly — but the memory claim omits the .env.local.php override case, which is the actual diagnostic answer to 'edit .env on a deployed shop has no effect'
  - Fact 2 (compiler-pass env resolution / no cache:clear needed except feature flags) is never discussed at all
  - Fact 3's core point (system_config not read from .env) is captured reasonably well, but the MAILER_DSN-vs-admin-saved-mail-settings nuance is missing
  - citation 2/3: one cited range (environment-variables.md:8-67) does not exist per audit (rangeExists=false)
  - Official: confirmed-code-evidence — "if a .env.local.php exists ... bootEnv() populates from that file alone and does not read .env, .env.local or .env.$APP_ENV at all, which is the usual reason an edit to .env on a deployed shop has no "
- **dev-63 (fs-docs)** — partly, 77%
  - Fact 1 (database:migrate <identifier> --all, identifier = bundle name) present
  - Fact 3 (plugin:update/plugin:refresh normal path) present at a summary level
  - Fact 2 — the troubleshooting reasons a migration silently never ran (plugin must be active, unknown identifier is a silent no-op exiting 0, migration directory must exist at container-compile time requiring cache:clear) — is entirely absent, despite being the direct answer to the query's stated symptom ('my new migration never ran')
  - Findability drift: pageReached (database-migrations.md) is not the mapped target (commands-reference.md) but carries the same database:migrate command content the query needs — upgraded to pass per drift tolerance
  - Official: confirmed-code-evidence — "an unknown one is not an error — the command prints "No collection found for identifier ..." and exits 0, so a typo looks like a successful run ... a Migration directory that did not exist when the co"
- **dev-64 (fs-docs)** — fail, 42%
  - For client_credentials the answer states 'expires_in: 3600 (1 hour)' — the expected fact and code evidence (ApiAuthenticationListener.php:47, default PT10M) state the access-token TTL is identical (600s) across every grant, client_credentials included
  - Neither cited excerpt (index.md:60-109, auth-api-requests.md:11-40) contains any '3600'/1-hour figure; the password-grant excerpt shown states 'expires_in: 600' — the 3600 figure has no supporting entry in the retrieved content and is not labelled as memory (memoryClaims is empty)
  - Escalation trigger 2 fired: the 3600s claim is a substantive, checkable number the snippet doesn't confirm; read the code evidence row confirming PT10M applies identically to all four grant types, settling the client_credentials figure as wrong
  - Password-grant details (client_id: administration, expires_in: 600, returns refresh_token) are correct and match fact 3
  - Official: confirmed-code-evidence — "The access-token lifetime is PT10M — 600 seconds, expires_in: 600 — and it is the same for every grant, client_credentials included. [code: Framework/Api/EventListener/Authentication/ApiAuthentication"
- **dev-65 (fs-docs)** — partly, 70%
  - Answer states total-count-mode=1 (exact) is implemented 'via SQL_CALC_FOUND_ROWS' — the case's own code evidence explicitly states the opposite: exact total 'runs a second COUNT(*) over the subquery (not SQL_CALC_FOUND_ROWS)' (EntitySearcher.php:203)
  - Fact 2's key trap — that a nested filter/sort/limit on a to-one association is silently ignored, and that a bare list of association names adds nothing — is not mentioned at all
  - Filter/sort/aggregation coverage (fact 1) and total-count-mode semantics (fact 3, apart from the SQL_CALC_FOUND_ROWS error) are otherwise comprehensive and well matched
  - Escalation trigger 2 fired for the SQL_CALC_FOUND_ROWS claim: checked Evidence — code (decisive), which explicitly names the mechanism used and explicitly denies SQL_CALC_FOUND_ROWS
  - Official: confirmed-code-evidence — "Only exact (1) gives a trustworthy total: it resets order and limit and runs a second COUNT(*) over the subquery (not SQL_CALC_FOUND_ROWS). [code: Framework/DataAbstractionLayer/Search/RequestCriteria"
- **dev-66 (fs-docs)** — partly, 80%
  - Fact 1 (sw-language-id fallback, sw-version-id defaulting) and a working equivalent of fact 3 (sw-skip-trigger-flow truthy value) present
  - sw-inheritance is described as 'send sw-inheritance: 1' implying the value matters — the expected fact states it is a pure presence check where any value, including 0 or false, enables inheritance and there is no way to disable it via a falsy value; the answer's framing contradicts this
  - Doesn't state that sw-skip-trigger-flow is resolved for every /api route, not only sync — the example given (sync only) could mislead
  - Official: confirmed-code-evidence — "sw-inheritance switches on considerInheritance ... by presence alone — any value, including 0 or false, enables it; there is no way to disable inheritance by sending a falsy value. [code: Framework/Ro"
- **dev-69 (fs-docs)** — partly, 78%
  - Fact 2 (body shape data/source/timestamp, payload entries only entity/operation/primaryKey/updatedFields) and fact 3 (shopware-shop-signature HMAC over raw body) present
  - Fact 1's privilege requirement — the app needs <entity>:read or the webhook is silently skipped with no message/log/delivery — is entirely absent
  - citation 0/1: cited range 8-146 does not exist per audit (rangeExists=false)
  - Official: confirmed-code-evidence — "the app must additionally hold the product:read privilege, otherwise the webhook is silently skipped — no message, no log, no delivery. [code: Framework/Webhook/Hookable/HookableEntityWrittenEvent.php"
- **dev-70 (fs-docs)** — fail, 50%
  - Answer claims 'if a finalize-url is defined, the payment method is asynchronous; if not, it defaults to synchronous' — the case's own Absences table explicitly records this as wrong: there is one core AppPaymentHandler for all app payment methods, and asynchronicity comes from whether the pay response carried a redirectUrl, not from declaring finalize-url
  - Answer lists valid payment statuses as 'open, paid, cancelled, refunded, failed, authorize, unconfirmed, in_progress, reminded, chargeback' — several of these (cancelled, refunded, failed, unconfirmed, in_progress, reminded) are STATE names, not the transition ACTION names the status field actually requires (paid, process, process_unconfirmed, cancel, fail, remind, refund, etc.); using them triggers IllegalTransitionException per the case's evidence
  - Both errors match items explicitly flagged as wrong in the case's Absences table ('Shopware distinguishes synchronous and asynchronous app payment handlers | absent' and 'Returning a state name ... works | absent')
  - Fact 2's requirement that the app's response itself must carry a verifiable shopware-app-signature is not mentioned at all
  - Official: confirmed-code-evidence — "There is no separate synchronous and asynchronous handler class: every app payment method is served by the one core AppPaymentHandler ... status is passed verbatim as a state-machine transition action"
- **func-02 (fs-docs)** — fail, 57%
  - The answer is a well-grounded description of Rule Builder UI usage (general info/conditions, AND/OR nesting, applied shipping/payment conditions), but none of the three decisive expected facts are stated
  - Fact 1 (a method carries at most one nullable availability rule; must combine multiple conditions into one rule) is not addressed
  - Fact 2 (matching runs against the serialised payload blob, not the condition rows; an invalid/un-indexed rule silently blocks the method) is not addressed
  - Fact 3 (CartRuleLoader recomputation up to 7 iterations; ShippingMethodBlockedError/PaymentMethodBlockedError with distinct reasons) is not addressed
  - Official: confirmed-code-evidence — "Official reference URL: https://docs.shopware.com/en/shopware-6-en/settings/rules (merchant-facing UI page, not code-level mechanics)"
- **func-04 (fs-docs)** — partly, 73%
  - Opens by grouping 'payment methods, shipping methods' together as needing manual mapping before migration, but later correctly lists Shipping methods under the automatically-migrated Customers & orders category — an internal contradiction on exactly the point fact 3 turns on (shipping methods DO have a DataSet and are migrated; only payment methods do not)
  - Only 5 of the 8 required premapping items are listed (payment methods, standard payment method, salutation, delivery time, standard delivery time) — order states, order delivery states, transaction states and newsletter recipient status are missing
  - Never states the Migration Assistant is a separate plugin outside Shopware core
  - Pattern/automatic-data-selection content (fact 1) matches reasonably well
  - Official: confirmed-code-evidence — "shipping methods, by contrast, do have a ShippingMethodDataSet and are migrated with customersOrders. [code: SwagMigrationAssistant@6.6.x src/Profile/Shopware/DataSelection/DataSet/ (listing)]"
- **func-05 (fs-docs)** — partly, 80%
  - Fact 1 (four channel types incl. Agentic commerce, Required fields unconditional per type) only partly covered — answer names storefront/headless/product-comparison but omits Agentic commerce and the always-Required field set
  - Fact 3 (sw-access-key header, SWSC prefix, no secret counterpart, GET /api/_action/access-key/sales-channel) is not stated — answer only says 'generate an API Access ID' and defers to developer docs, leaving the actually-asked sub-question ('where do I get its API access key') unanswered in specifics
  - Fact 2 (domain binds url+language+currency+snippet set) is correctly stated
  - Official: confirmed-code-evidence — "a fresh value is fetched from GET /api/_action/access-key/sales-channel and written to the channel. [code: Framework/Api/Controller/AccessKeyController.php:45-55]"
- **func-06 (fs-docs)** — partly, 76%
  - Case is pinned to 6.6, but the answer states 'Settings > Automation' for the Flow Builder location — the confirmed fact for 6.6 is Settings > Shop; the corpus only ships the 6.7-labelled revision (articleVersion 1.3.0.1, productVersionFrom 6.7.0.0) and the agent did not flag the version mismatch, so the location given is wrong for the pinned version
  - Fact 3 (recipient.type 'custom' replaces rather than adds to the event's own audience; a stock install already ships an order-confirmation flow for checkout.order.placed) is not stated — answer only gives the generic 'choose a recipient' steps
  - Fact 2 (16 core actions, no delay action, webhook/delay licence-gated) is substantially covered via the Evolve/Beyond plan framing
  - Official: confirmed-code-evidence — "In 6.6 the Flow Builder sits under Settings > Shop ... 6.7 moves it to Settings > Automation. [code: 6.6 Administration sw-flow/index.js:179-187]"
- **func-07 (fs-docs)** — partly, 76%
  - Fact 3 (dry run performs real writes then rolls back only the entity data — log/file rows and media side effects survive) is contradicted: the answer characterises 'Start dry run' as fully testing the import 'before committing' with no mention that writes actually happen and only partially unwind
  - Fact 2 (updateBy matching identifier, UpdatedByValueNotFoundException, duplicate-key-mapping silently collapses) is not stated — the 'Second Unique Identifier' section covers a different concern (non-unique match values) and never mentions the duplicate-mapping trap
  - Fact 1 (mapping key/mappedKey/position/requiredByUser/useDefaultValue structure) is substantially and correctly stated, though the 6.6-vs-6.7 menu split is omitted for this shared-version case
  - Official: confirmed-code-evidence — "Start dry run is not a write-free validation pass: it logs activity dryrun, performs the real writes and rolls the DBAL transaction back at the end. [code: Content/ImportExport/ImportExport.php:116-11"
- **func-08 (fs-docs)** — partly, 73%
  - Fact 3 is answered wrong for the query's direct ask: the answer states enabling 'Modifiable via Store API' both reads and writes the field ('sets the field to public'), when the store_api_aware (read/visible) and allow_customer_write (write/modifiable) switches are independent and separately named; 'Visible in Store API' is never mentioned
  - Fact 3's 6.6 data-loss hole (empty customFields payload wipes the whole stored column) is not mentioned
  - Fact 2's 6.6-specific looseness (Twig-name validation not enforced) and the Price field type are both omitted from the type list
  - Fact 1 (global uniqueness of technical name, not per-set) is not explicitly stated, though the entity-assignment/relation concept is captured correctly
  - Official: confirmed-code-evidence — "Visible in Store API → store_api_aware ... Modifiable via Store API → allow_customer_write ... three independent columns written by three separate admin switches. [code: System/SalesChannel/Api/Struct"
- **func-10 (fs-docs)** — partly, 70%
  - Findability fail: 3 list/grep calls preceded the target read (audit listGrepBeforeTargetRead=3), exceeding the 2-call threshold
  - Fact 3 is contradicted: the case explicitly traps offering 'Keep matching variants grouped' (displayAsGroup) for 6.6, since it is 6.7-only; the answer presents it as a universal feature with no version caveat
  - Fact 2 undercounts the usage sites: only categories, product comparison and Shopping Experiences are named, omitting cross-selling and the cart rule (5 uses expected, 3 given) — mirrors the known documentation gap the case is built to probe
  - Fact 1 (product_stream entity, filter row types, api_filter/invalid computed by indexer) is not stated at all
  - Official: confirmed-code-evidence — ""Keep matching variants grouped" (displayAsGroup) and the internal flag do not exist in 6.6 — the 6.6.10.0 ProductStreamDefinition has neither field ... An answer that offers this option for 6.6 is wr"
- **func-11 (fs-docs)** — partly, 82%
  - Citation integrity issue: the first citation (integrationen/v1-1-0.md:1-36) has rangeExists=false per the audit — the claimed line range does not exist as cited, even though the excerpt content is plausible
  - Fact 2 (admin flag vs ACL roles as the exclusive two privilege paths) is correctly and clearly captured
  - Fact 1's specific privilege literals (integration.viewer/creator/editor) and fact 3's OAuth client_credentials linkage are not stated, though the functional access-key/secret behaviour is described correctly
  - Official: confirmed-code-evidence — "Saving issues an access key and a secret access key, generated by GET /api/_action/access-key/intergration ... regenerating issues a new access key and a new secret. [code: Framework/Api/Controller/Ac"
- **func-12 (fs-docs)** — partly, 73%
  - Findability fail: target path (extensions/shopware-commercial) was never read (callsToTarget=0); the answer is grounded in the b2b-components and Flow-Builder pages it reached instead, which is a legitimate drift since they carry the required facts
  - Correctly passes the case's central trap: both capabilities are presented as Commercial-extension/Evolve-plan-gated, not as free stock Shopware, satisfying fact 2
  - Fact 1 (16 core flow.action services, none HTTP; product_price has no customer FK) is not stated in code terms — the answer's framing ('neither needs custom development') captures the practical takeaway but not the underlying absence facts
  - Fact 3 (rule-based advanced pricing + promotions personaCustomers as the core alternative; app flow action/manifest webhook as the core alternative for external URLs) is not mentioned
  - Official: confirmed-code-evidence — "Trap: the build-vs-buy answer. An answer that proposes writing a custom flow action or a custom price entity without first naming the Commercial feature fails."
- **edge-04 (fs-docs)** — partly, 64%
  - Citation to developer/concepts/api/store-api.md:8-17 has matchesToolCallLog=false per the audit — cited without a corresponding Read in the call log for this case
  - Citation to the 2020 ADR has rangeExists=false — the cited range does not exist as claimed
  - Fact 1 (no /sales-channel-api route/alias exists) is correctly stated
  - Facts 2 and 3 (exact endpoint GET|POST /store-api/product with no version segment; sw-access-key header requirement) are never given — the answer stays generic ('Store API's product routes') instead of naming the actual path or header
  - Official: confirmed-code-evidence — "Gives the product listing endpoint as GET|POST /store-api/product (route store-api.product.search), with no /v3/ or any other version segment. [code: Content/Product/SalesChannel/ProductListRoute.php:"
- **edge-06 (fs-docs)** — fail, 25%
  - The agent ran exactly one grep, scoped only to developer/, for 'magento', then declared sourceVerdict='corpus-missing' — it never searched merchant/, even though the docs target for this case (merchant/content/en/shopware-6/migration-en/magento-keywords/v1-1-0-0.md) exists on disk and both trees were in scope
  - The 'not found' claim is false: relevant material exists in the corpus and was reachable with a routine merchant-tree search; per the case brief this is scored on its merits, not granted the Source-absent override
  - No citations are given at all; none of the three expected facts (sales_channel/domain hierarchy, plugin-vs-app mapping, no attribute-set/di.xml equivalents) are stated
  - selfReportDelta matches (1/1) — the self-report accurately reflects the single (inadequate) call actually made, so this is scored as a search-thoroughness/grounding failure rather than a self-report honesty violation
  - Official: confirmed-code-evidence — "Two of the four have no counterpart object at all — attribute sets and di.xml — and the answer must say so rather than name a look-alike."
- **gap-02 (fs-docs)** — partly, 73%
  - selfReportDelta shows 4 missing calls, including two full document Reads not reported in toolCallLog — a materially under-reported self-report per the rubric's honesty rule
  - Correctly reports no 6.7 JWT-removal page exists, names the closest CLI helper page and flags it as describing pre-6.7 behaviour
  - Does not name the second closest page (the deployer guide that still copies config/jwt) or note the commands-reference's absence of system:generate-jwt-secret, though a grep against commands-reference.md was performed
  - Correctly invents no signing mechanism or upgrade procedure
  - Official: confirmed-code-evidence — "HMAC-SHA256 over the APP_SECRET environment variable, with no key file read at any point ... system:generate-jwt-secret and JwtCertificateGenerator do not exist in 6.7. [code: Framework/Api/OAuth/JWTC"
- **gap-03 (fs-docs)** — partly, 83%
  - Correctly reports the corpus documents only the token request (client_credentials/password grants), with no mention of /api/oauth/authorize or a 6.7 scope-format change
  - Fact 2 is not stated: the answer quotes the doc's 'scopes':'write' example verbatim but never flags that a plural 'scopes' key is ignored by a real 6.7 server (scope is a singular, space-delimited parameter) — a discrepancy visible in the very material it retrieved
  - Fact 3 (no /api/oauth/authorize in 6.7; already a deprecated no-op in 6.6; scope identifiers unchanged) is not stated
  - Audit flags selfReportDelta reported=5/actual=0 as a likely extractor mis-attribution (calls plausibly logged against gap-02 instead); the raw report's own toolCallLog is coherent and its citations verify 2/2, so honesty is not penalised for this known artefact
  - Official: confirmed-code-evidence — "/api/oauth/authorize no longer exists in 6.7 — AuthController declares only POST /api/oauth/token. [code: Framework/Api/Controller/AuthController.php:33]"
- **gap-05 (fs-docs)** — partly, 80%
  - Fact 2's critical qualifier is substantially captured: the answer correctly notes the rework 'can currently be opted into via the CACHE_REWORK feature flag', avoiding the false claim that _httpCache alone caches a stock 6.7 route
  - Fact 1 is not addressed: the answer never states that the docs corpus has no page documenting the actual removal, nor that 'CachedProductRoute' never existed under that exact name (only CachedProductDetailRoute/CachedProductListingRoute in 6.6) — it presents the found ADRs as if they were the settled current answer
  - Fact 3 (cache tags added via CacheTagCollector::addTag(), not by dispatching AddCacheTagEvent directly) is not mentioned — the answer only says invalidation 'reuses the existing cache-tags implementation'
  - Official: confirmed-code-evidence — "cache tags are now added from inside the route by injecting CacheTagCollector and calling addTag() ... and not by dispatching AddCacheTagEvent directly, which a shipped PHPStan rule forbids. [code: Fr"

## Accuracy cross-checks

| Option | Flagged | Fetched | Served from cache | Bands changed | Fetch failures |
| --- | --- | --- | --- | --- | --- |
| fs-docs | 74 of 100 | 0 | 0 | 0 | none |

All 74 flagged cases carried `Status: confirmed` in `cases.md`, so per the rubric's Accuracy section no live fetch was needed: each was settled directly against its own expected-answer file's `[code: …]`-tagged facts, which is a stronger yardstick than the (potentially trap-laden) documentation page. No band moved from its provisional value in this pass.

No band changed — every flagged case held its provisional accuracy.

## Observations about source availability

- No `dev`/`func` case hit the Source-absent override in this run (0 `unavailable` verdicts) — the docs corpus had a page in scope for every developer/functional case except the documented exceptions in `cases.md`'s exception table (dev-12, edge-04, edge-07 map to `none` in the docs corpus; those are `edge`-category traps, not `dev`/`func` cases, so they don't affect the override-status rule).
- **edge-06** is a genuine finding, not a corpus gap: the discover agent grepped only `developer/` for "magento" and self-reported `corpus-missing`, but the target page `merchant/content/en/shopware-6/migration-en/magento-keywords/v1-1-0-0.md` exists and was never searched. Scored as a real `fail` (0%), not `unavailable`, per the auditor's and scorer's explicit reasoning — the corpus was under-searched, not empty.
- Several `edge-*`/`gap-*` cases scored well because the docs corpus does carry a closest-relevant page the agent read honestly without fabricating (edge-01/02/05, gap-01/04/07/08 all passed at ≥85%).
- `dev-57` (B2B Suite migration) carries `status: contradictory` in `cases.md` and was scored against the facts as currently written, flagged for human audit per the case-status lifecycle — not adjusted here.
- A recurring, structural pattern in this run's ground-truth extraction: for several cases (dev-02, dev-04, dev-09, dev-12, dev-22, dev-24, gap-03) the only call attributed to that case's segment in the extracted call log is the final report `Write`; the real research reads appear to have been attributed to an adjacent case in the same batch by the segment-boundary heuristic in `extract-agent-calls.mjs`. This is recorded as an audit observation (not corrected, not scored as a self-report violation) per the skill's "batch isolation, honestly reported" rule.

## Recommended fixes

- dev-01 (fs-docs): Answer teaches getDefinitionClass() returning ProductDefinition::class as the extension hook — this method does not exist on EntityExtension in 6.7 (getEntityName() is the sole abstract method); this reproduces the documented dev-01 doc defect noted in cases.md and fails fact 1
- dev-01 (fs-docs): Missing fact 2's restriction that extension fields must be association-shaped (AssociationField/Runtime/FkField+companion) and the Extension flag mechanics
- dev-01 (fs-docs): Fact 3 (registration tag shopware.entity.extension, BulkEntityExtension w/ shopware.bulk.entity.extension) is present
- dev-01 (fs-docs): One of two citations has rangeExists:false (whole-file range mismatch) though its excerpt matches genuine page content
- dev-04 (fs-docs): Does not state that registerCmsElement() requires only name+component, nor the silent-invisibility trap when previewComponent is missing (fact 1 core nuance missing)
- dev-04 (fs-docs): Storefront naming-convention rendering (cms-element-<name>.html.twig) is captured (fact 2 present)
- dev-04 (fs-docs): No mention of AbstractCmsElementResolver / CmsElementResolverInterface / shopware.cms.data_resolver tag at all — fact 3 (server-side data) fully absent
- dev-04 (fs-docs): Case's documented trap (element registered alone reaches the change-element modal but the sidebar drag list is block-registry-only) is only weakly gestured at ('add or reuse a CMS block to host it')
- dev-06 (fs-docs): FlowAction contract (getName/requirements/handleFlow) and flow.action tag with key+priority correctly stated (facts 1-2 present)
- dev-06 (fs-docs): UI registration is described as overriding the sw-flow-sequence-action component instead of the expected flowBuilderService additive registration methods (addActionNames/addLabels/addIcons/addGroups/addActionGroupMapping) — a materially different mechanism from the confirmed evidence
- dev-06 (fs-docs): DelayableAction/TransactionalAction marker interfaces are not mentioned
- dev-08 (fs-docs): Correctly refutes the Doctrine findBy() trap and demonstrates search()/Criteria/addFilter/addAssociation/getAssociation/addSorting
- dev-08 (fs-docs): Correctly recommends a deterministic sort tiebreaker for RepositoryIterator pagination
- dev-08 (fs-docs): Does not state that EntityRepositoryInterface no longer exists in 6.7 and that the old type hint is fatal (fact 1's key trap)
- dev-10 (fs-docs): Only names getName/iterate/update/handle as required overrides, omitting the two other abstract members getTotal() and getDecorated() — an implementation following only the answer would not compile
- dev-10 (fs-docs): Correctly recommends manipulating data via Connection instead of the DAL to avoid the indexing re-entrancy loop, and mentions DISABLE_INDEXING as the DAL-write escape hatch
- dev-10 (fs-docs): Correctly identifies bin/console dal:refresh:index for a full reindex
- dev-11 (fs-docs): Claims plugin XML service configuration 'is deprecated in 6.7 and removed in 6.8' as a blanket statement, when the confirmed fact is that XML loads silently with no deprecation through 6.7.13.0 and the deprecation only starts at 6.7.14.0 — materially wrong for a query pinned to 'On Shopware 6.7'
- dev-11 (fs-docs): Autowiring-not-default and explicit-argument-injection mechanics (fact 2/3) are correctly described with a working services.php example
- dev-11 (fs-docs): selfReportDelta shows 3 additional tool calls (a services.xml grep, a Read of an architecture DI page, another grep) not present in toolCallLog, that are plausibly this case's own research rather than another case's target page — treated as a genuine under-report
- dev-12 (fs-docs): Docs target for this case is 'none' in the docs corpus (per cases.md's explicit exception table); the agent did not claim not-found (notFoundClaim:false) and instead built a partial answer from the ADR page plus one clearly [from memory]-labelled XML syntax detail — so the Source-absent override does not apply
- dev-12 (fs-docs): Correctly infers the 6.6 convention (services.xml) from the ADR's own description of the prior state
- dev-12 (fs-docs): Does not state that Symfony Definition defaults to not-autowired/not-autoconfigured on 6.6 (fact 3 omitted)
- dev-15 (fs-docs): Recommends grepping for the literal term '@Event' to find DAL event classes — the confirmed evidence explicitly states this documented search term is dead and occurs nowhere under vendor/shopware, so this is a materially misleading recommendation reproducing a documented dead technique (escalation trigger 3, settled directly from the expected file's evidence table already within the read snippet)
- dev-15 (fs-docs): Does not describe the mechanical two-hop dispatch (EntityLoadedEvent naming + NestedEventDispatcher unwrapping) that explains why 'product.loaded' has no literal dispatch site
- dev-15 (fs-docs): Correctly identifies StorefrontRenderEvent as fired before Twig rendering and the {route}.request/.response/.render/.encode family (fact 2 present)
- dev-15 (fs-docs): Does not mention debug:event-dispatcher's 'already has a listener' limitation nor debug:business-events
- dev-21 (fs-docs): This case's explicit Trap states an answer must not require an elevated listener priority and must not present the BusinessEventCollectorEvent subscriber as the only registration route — the answer recommends 'a high priority (e.g. 1000)' and only describes the subscriber route, directly reproducing both trapped behaviours
- dev-21 (fs-docs): Does not mention the supported Bundle::getActionEventClasses() registration route, nor that Collection::set() (not add()) must key the definition by name
- dev-21 (fs-docs): Does not mention that define()'s custom name only relabels the admin trigger without changing what fires, nor the flow.storer requirement for trigger data
- dev-22 (fs-docs): The field-type enumeration omits 'price', one of the 16 documented/confirmed input-field types — a materially incomplete answer to the query's explicit 'what field types are available' half
- dev-22 (fs-docs): Correctly describes config.xml as a no-code declarative mechanism (fact 1 present)
- dev-22 (fs-docs): Does not mention system_config storage key format, SystemConfigService getters, or that a default row is only written when a defaultValue is declared — fact 3 fully absent
- dev-23 (fs-docs): Correctly describes the migration-based insert path into mail_template_type/translations/mail_template/mail_template_translation with an idempotency guard (fact 1 present)
- dev-23 (fs-docs): Does not mention the core CreateMailTemplateTrait helper at all (fact 2 fully absent)
- dev-23 (fs-docs): Instructs system_default = 0 as the example value, reproducing the docs' 'must be 0' framing that the confirmed evidence calls editorial (1 is the actually-safer value); also omits that mail_template_sales_channel no longer exists in 6.7 and that no PHP/business-event registration is needed
- dev-26 (fs-docs): Answer builds entirely on the Document v2 recipe (AbstractDocumentType, DOCUMENT_GENERATION_REWORK), which the case's confirmed evidence shows does not exist at 6.7.13.0 — this is the documented trap and the answer fails it.
- dev-26 (fs-docs): Completeness 0/3: none of the required v1 AbstractDocumentRenderer facts (renderer contract, document_type/number-range prerequisite, literal Twig template resolution) are present.
- dev-26 (fs-docs): citationsVerified 0/1 — the cited range 1-162 does not exist per audit, though the excerpt reproduces genuine page content.
- dev-28 (fs-docs): Fact 2 (override() fully replaces, must explicitly extend to keep behavior) is conveyed via concrete subclass+super() guidance.
- dev-28 (fs-docs): Facts 1 (selector must match core's registered selector or override is refused) and 3 (CookiePermission is registered lazily; register() infers async from a missing prototype descriptor) are not stated.
- dev-28 (fs-docs): Adds an unverified claim ('each plugin can only be overridden once') that the case's own evidence records as 'not settled by code' — presented as fact with no caveat.
- dev-31 (fs-docs): selfReportDelta shows a materially under-reported toolCallLog: 4 calls reported vs 7 actual, missing 3 Bash find calls — Honesty scored 0 for this.
- dev-31 (fs-docs): Fact 2 (hasCssValue() requires a string value; colorpicker works but bool/checkbox is silently dropped; PR 13584 did not fix the plugin-config route) is entirely absent from the answer.
- dev-31 (fs-docs): findabilityStrict fail — 4 list/grep calls occurred before the target was read.
- dev-32 (fs-docs): States custom fields become non-searchable by default 'since 6.7.6.0' — the case's confirmed evidence fixes this at 6.7.7.0, an explicit documented trap the answer falls into.
- dev-32 (fs-docs): Fact 3's remaining content (immutability of name/type, ACL requirement, reindex-on-enable) is otherwise unaddressed.
- dev-33 (fs-docs): States settingsItem.group values are limited to 'shop'/'system'/'plugins' — exactly the documented Trap the case says must not be claimed (no runtime validation exists, and 'shop' is not even in the 6.7 TypeScript union).
- dev-33 (fs-docs): Registration abort conditions (missing hyphen, duplicate id, no routes/routeMiddleware, display:false) are not covered.
- dev-33 (fs-docs): Menu-entry requirements (parent/label mandatory, +1000 position shift, no icon fallback) are not covered.
- dev-36 (fs-docs): States a role's 'dependencies' array is optional — the case's confirmed evidence is explicit that no default is applied anywhere and omitting it throws; this directly contradicts expected fact 1.
- dev-36 (fs-docs): Correctly covers acl.can()/inject:['acl'], meta.privilege router guard, and Plugin::enrichPrivileges() for facts 2 and 3.
- dev-37 (fs-docs): Covers the phpunit.xml/TestBootstrap.php chain and KernelTestBehaviour/IntegrationTestBehaviour usage (facts 1 and 2).
- dev-37 (fs-docs): Recommends 'composer require --dev dev-tools' to obtain a PHPUnit runner — unsupported by the cited excerpt and contradicting the case's fact that shopware/core ships no PHPUnit dependency and a 6.7 project itself pins phpunit/phpunit ^11.5.
- dev-37 (fs-docs): selfReportDelta shows reported=2 vs actual=1 (an over-reported log, not the under-report pattern) — treated as a minor honesty concern rather than the 0-band under-report rule.
- dev-38 (fs-docs): Describes mounting via Component.register+build+shallowMount using 'localVue' — a Vue-2 test-utils construct; the case's confirmed evidence states Vue-3 test-utils puts stubs/mocks/provide under 'global', not top-level, and 6.7 has no localVue path.
- dev-38 (fs-docs): Does not mention wrapTestComponent, the primary documented mounting path, at all.
- dev-38 (fs-docs): Fact 3 (no Jest harness ships for a plugin; plugin must supply its own config; component-imports.js must exist first or jest.config.js throws) is entirely absent.
- dev-39 (fs-docs): Notes the corpus's own Cypress-deprecation warning ('use Playwright instead') but then proceeds to teach the full legacy Cypress setup in detail — exactly the trap the case defines: 'An answer that explains how to set up Cypress for 6.7 is wrong.'
- dev-39 (fs-docs): Playwright is mentioned only in passing with no setup detail (npm install/playwright install, .env/integration:create, actor-pattern fixtures) — facts 2 and 3 essentially absent.

## Borderline re-scores

| Case | Option | Dimension | First | Second | Taken | Total before → after | Verdict before → after |
| --- | --- | --- | --- | --- | --- | --- | --- |
| dev-08 | fs-docs | accuracy | 70 | 40 | 40 | 85% → 77% | pass → partly |
| dev-48 | fs-docs | accuracy | 70 | 40 | 40 | 85% → 74% | pass → partly |
| dev-48 | fs-docs | actionability | 100 | 70 | 70 | 85% → 74% | pass → partly |
| func-12 | fs-docs | accuracy | 70 | 40 | 40 | 83% → 73% | partly → partly |
| func-12 | fs-docs | actionability | 100 | 70 | 70 | 83% → 73% | partly → partly |

13 cases landed within ±2 points of a verdict boundary on the first pass (dev-02, dev-08, dev-11, dev-28, dev-38, dev-48, dev-59, dev-68, func-12, edge-03, edge-07, gap-03, gap-04) and were re-scored independently. Three moved verdicts downward (dev-08, dev-48, func-12: pass → partly) after the second pass caught materially wrong claims the first pass's Accuracy band had missed; dev-11's Honesty also dropped further (0 both passes, no change). The rest held.

## Scorer discrepancies

None.

## Audit warnings

- dev-01: selfReportDelta reported=5 actual=7, missing=2 call(s)
- dev-02: auditNote — ground-truth extract attributes only housekeeping calls (the report Write) to this caseId; no Read/Bash retrieval call carries this caseId. The case's real research reads may have been attributed to a
- dev-03: selfReportDelta reported=1 actual=2, missing=1 call(s)
- dev-04: auditNote — ground-truth extract attributes only housekeeping calls (the report Write) to this caseId; no Read/Bash retrieval call carries this caseId. The case's real research reads may have been attributed to a
- dev-08: selfReportDelta reported=1 actual=2, missing=1 call(s)
- dev-09: auditNote — ground-truth extract attributes only housekeeping calls (the report Write) to this caseId; no Read/Bash retrieval call carries this caseId. The case's real research reads may have been attributed to a
- dev-11: selfReportDelta reported=7 actual=10, missing=3 call(s)
- dev-12: auditNote — ground-truth extract attributes only housekeeping calls (the report Write) to this caseId; no Read/Bash retrieval call carries this caseId. The case's real research reads may have been attributed to a
- dev-16: selfReportDelta reported=2 actual=3, missing=1 call(s)
- dev-21: selfReportDelta reported=4 actual=5, missing=1 call(s)
- dev-22: auditNote — ground-truth extract attributes only housekeeping calls (the report Write) to this caseId; no Read/Bash retrieval call carries this caseId. The case's real research reads may have been attributed to a
- dev-23: selfReportDelta reported=1 actual=2, missing=1 call(s)
- dev-24: auditNote — ground-truth extract attributes only housekeeping calls (the report Write) to this caseId; no Read/Bash retrieval call carries this caseId. The case's real research reads may have been attributed to a
- dev-31: selfReportDelta reported=4 actual=7, missing=3 call(s)
- dev-47: auditNote — Ground-truth log shows a housekeeping Bash call outside the corpus (rm -rf against its own reports directory, apparently self-correcting an earlier malformed Write path): rm -rf "<home>/projects/
- dev-57: auditNote — cases.md lists this case's status as 'contradictory' (requires human audit per case-status lifecycle).
- dev-59: auditNote — Ground-truth log shows a housekeeping Bash call outside the corpus (rm -rf against its own reports directory, apparently self-correcting an earlier malformed Write path): rm -rf "<home>/projects/
- edge-05: auditNote — Ground-truth log shows the agent re-reading its own just-written raw report (edge-05.json) — excluded from retrieval/findability/self-report-delta computation as housekeeping, not corpus retrieval.
- edge-06: auditNote — Agent self-report sourceVerdict='corpus-missing' with notFoundClaim=true, based on grepping only developer/ for 'magento'. The docs target for this case maps to merchant/content/en/shopware-6/migratio
- gap-01: selfReportDelta reported=12 actual=13, missing=1 call(s)
- gap-02: selfReportDelta reported=8 actual=12, missing=4 call(s)
- gap-03: auditNote — ground-truth extract attributes only housekeeping calls (the report Write) to this caseId; no Read/Bash retrieval call carries this caseId. The case's real research reads may have been attributed to a
- rescore dev-08: accuracy 70 -> 40
- rescore dev-08: total/verdict 85/pass -> 77/partly
- rescore dev-48: accuracy 70 -> 40
- rescore dev-48: actionability 100 -> 70
- rescore dev-48: total/verdict 85/pass -> 74/partly
- rescore func-12: accuracy 70 -> 40
- rescore func-12: actionability 100 -> 70
- rescore func-12: total/verdict 83/partly -> 73/partly

