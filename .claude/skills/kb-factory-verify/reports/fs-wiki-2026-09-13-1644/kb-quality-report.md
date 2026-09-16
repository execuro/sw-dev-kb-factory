# KB quality report — fs-wiki-2026-09-13-1644

## Run

| | |
| --- | --- |
| Run | `fs-wiki-2026-09-13-1644` (`fs-wiki`) |
| Options | fs-wiki |
| Corpus | wiki — fingerprint: `lastBuilt 2026-09-07`, `treeHash 836a72be5d89…`, 1569 pages |
| Probe | corpus.name=wiki, entry point `platform/index.md` present; manifest read OK |
| Model | inherited (not pinned) |
| Generated | 2026-09-13T17:35:34Z |
| Cases run | 100 of 100 (`all`) |
| Yardstick | `cases.md ef932d8e`, `scoring-rubric.md 54864fb4`, `scorer-brief.md 1456b9ec`, `auditor-brief.md 4c2c6fdc`, `accuracy-brief.md 9009d748` |
| Execution | discover batches of 10, scorer shards of 25 (batched) |
| Skill | `kb-factory-verify` |

## Run cost

| Option | Agents | Tokens | Tool calls | Summed agent time | Usage complete |
| --- | --- | --- | --- | --- | --- |
| fs-wiki | 17 (10 discover, 1 audit, 4 score, 1 accuracy, 1 rescore) | 24802395 | n/a | n/a | yes — discover batches only; audit/score/accuracy/rescore usage not captured (background teammate spawns) |

Wall-clock duration of the run: 3054s.

## Comparison

| Option | Access | Corpus | Overall | Status | Developer | Functional | Findable | Edge passed | Gap confirmed | Pass / partly / fail / unavailable / unscored | Weakest dimension |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| fs-wiki | fs | wiki | 78% | Not ready | 77% | 76% | 70 of 83 | 5 of 9 | 7 of 8 | 46 / 42 / 12 / 0 / 0 | accuracy |

Only one option in this run (`fs-wiki` alone) — no ranking or delta to compute.

## Dimension heatmap

| Dimension | Weight | fs-wiki |
| --- | --- | --- |
| Grounding & Relevance | 25 | 93.1 |
| Accuracy vs. Expected Answer | 25 | 59.5 |
| Completeness | 15 | 68.8 |
| Citation & Traceability | 10 | 90.0 |
| Honesty | 15 | 83.8 |
| Actionability | 10 | 84.6 |

### Area averages

| Area | fs-wiki average |
| --- | --- |
| Payment & Shipping | 100.0 |
| Gap | 92.0 |
| Theme | 90.0 |
| Storefront | 88.3 |
| Content | 88.0 |
| Services & DI | 88.0 |
| Core breaking changes | 86.7 |
| Administration | 85.2 |
| Orders | 84.0 |
| DAL | 83.3 |
| Admin API | 82.3 |
| Config & CLI | 80.4 |
| Plugin fundamentals | 80.0 |
| Events | 80.0 |
| Trap | 78.9 |
| Content (CMS/mail/SEO/media/sitemap) | 78.0 |
| Merchant | 76.2 |
| Store API & headless | 73.0 |
| Admin migration (Vue 3 / Vite / Pinia / Meteor) | 70.2 |
| Hosting & ops | 64.8 |
| Testing | 64.0 |
| Platform upgrade | 55.0 |
| App system | 51.2 |
| Checkout & Cart | 46.5 |

## Verdict grid

| Case | Category | Area | fs-wiki |
| --- | --- | --- | --- |
| dev-01 | dev | DAL | 66% partly ✓ |
| dev-02 | dev | Plugin fundamentals | 80% partly ✓ |
| dev-03 | dev | Store API & headless | 73% partly ✓ |
| dev-04 | dev | Content | 88% pass ✓ |
| dev-05 | dev | Theme | 100% pass ✓ |
| dev-06 | dev | Events | 80% partly ✓ |
| dev-07 | dev | DAL | 88% pass ✓ |
| dev-08 | dev | DAL | 100% pass ✓ |
| dev-09 | dev | DAL | 88% pass ✓ |
| dev-10 | dev | DAL | 88% pass ✓ |
| dev-11 | dev | Services & DI | 88% pass ✓ |
| dev-12 | dev | Services & DI | 88% pass ✓ |
| dev-13 | dev | Services & DI | 88% pass ✓ |
| dev-14 | dev | Events | 100% pass ✓ |
| dev-15 | dev | Events | 77% partly ✓ |
| dev-16 | dev | Orders | 88% pass ✓ |
| dev-17 | dev | Checkout & Cart | 73% partly ✓ |
| dev-18 | dev | Checkout & Cart | 20% fail ✗ |
| dev-19 | dev | Events | 77% partly ✓ |
| dev-20 | dev | Events | 92% pass ✓ |
| dev-21 | dev | Events | 54% fail ✓ |
| dev-22 | dev | Config & CLI | 88% pass ✓ |
| dev-23 | dev | Content (CMS/mail/SEO/media/sitemap) | 76% partly ✓ |
| dev-24 | dev | Content (CMS/mail/SEO/media/sitemap) | 80% partly ✓ |
| dev-25 | dev | Config & CLI | 88% pass ✓ |
| dev-26 | dev | Orders | 80% partly ✓ |
| dev-27 | dev | Storefront | 100% pass ✓ |
| dev-28 | dev | Storefront | 88% pass ✓ |
| dev-29 | dev | Storefront | 83% partly ✓ |
| dev-30 | dev | Storefront | 88% pass ✓ |
| dev-31 | dev | Storefront | 88% pass ✓ |
| dev-32 | dev | DAL | 73% partly ✓ |
| dev-33 | dev | Administration | 73% partly ✓ |
| dev-34 | dev | Administration | 85% pass ✓ |
| dev-35 | dev | Administration | 88% pass ✓ |
| dev-36 | dev | Administration | 95% pass ✓ |
| dev-37 | dev | Testing | 80% partly ✗ |
| dev-38 | dev | Testing | 73% partly ✓ |
| dev-39 | dev | Testing | 39% fail ✗ |
| dev-40 | dev | Platform upgrade | 30% fail ✗ |
| dev-41 | dev | Hosting & ops | 76% partly ✓ |
| dev-42 | dev | Config & CLI | 88% pass ✓ |
| dev-43 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 73% partly ✓ |
| dev-44 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 60% partly ✓ |
| dev-45 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 88% pass ✓ |
| dev-46 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 60% partly ✓ |
| dev-47 | dev | Payment & Shipping | 100% pass ✓ |
| dev-48 | dev | Storefront | 100% pass ✓ |
| dev-49 | dev | Core breaking changes | 80% partly ✓ |
| dev-50 | dev | Core breaking changes | 88% pass ✓ |
| dev-51 | dev | DAL | 80% partly ✓ |
| dev-52 | dev | Core breaking changes | 92% pass ✓ |
| dev-53 | dev | Theme | 80% partly ✓ |
| dev-54 | dev | Storefront | 92% pass ✓ |
| dev-55 | dev | Storefront | 64% partly ✓ |
| dev-56 | dev | Storefront | 92% pass ✓ |
| dev-57 | dev | Platform upgrade | 80% partly ✓ |
| dev-58 | dev | Hosting & ops | 73% partly ✓ |
| dev-59 | dev | Hosting & ops | 24% fail ✗ |
| dev-60 | dev | Hosting & ops | 80% partly ✓ |
| dev-61 | dev | Hosting & ops | 71% partly ✓ |
| dev-62 | dev | Config & CLI | 80% partly ✓ |
| dev-63 | dev | Config & CLI | 58% fail ✓ |
| dev-64 | dev | Admin API | 85% pass ✓ |
| dev-65 | dev | Admin API | 80% partly ✓ |
| dev-66 | dev | Admin API | 82% partly ✓ |
| dev-67 | dev | App system | 70% partly ✓ |
| dev-68 | dev | App system | 39% fail ✗ |
| dev-69 | dev | App system | 35% fail ✗ |
| dev-70 | dev | App system | 24% fail ✗ |
| dev-71 | dev | App system | 88% pass ✓ |
| func-01 | func | Merchant | 70% partly ✗ |
| func-02 | func | Merchant | 88% pass ✓ |
| func-03 | func | Merchant | 92% pass ✓ |
| func-04 | func | Merchant | 73% partly ✓ |
| func-05 | func | Merchant | 70% partly ✗ |
| func-06 | func | Merchant | 77% partly ✓ |
| func-07 | func | Merchant | 77% partly ✓ |
| func-08 | func | Merchant | 68% partly ✓ |
| func-09 | func | Merchant | 74% partly ✗ |
| func-10 | func | Merchant | 55% fail ✗ |
| func-11 | func | Merchant | 100% pass ✓ |
| func-12 | func | Merchant | 70% partly ✗ |
| edge-01 | edge | Trap | 100% pass – |
| edge-02 | edge | Trap | 100% pass – |
| edge-03 | edge | Trap | 100% pass – |
| edge-04 | edge | Trap | 82% partly – |
| edge-05 | edge | Trap | 70% partly – |
| edge-06 | edge | Trap | 37% fail – |
| edge-07 | edge | Trap | 85% pass – |
| edge-08 | edge | Trap | 88% pass – |
| edge-09 | edge | Trap | 48% fail – |
| gap-01 | gap | Gap | 92% pass – |
| gap-02 | gap | Gap | 97% pass – |
| gap-03 | gap | Gap | 88% pass – |
| gap-04 | gap | Gap | 88% pass – |
| gap-05 | gap | Gap | 77% partly – |
| gap-06 | gap | Gap | 97% pass – |
| gap-07 | gap | Gap | 100% pass – |
| gap-08 | gap | Gap | 97% pass – |

## Requests and responses

### fs-wiki

| Case | Tool calls made | Page reached | Findability | Memory claims | Verdict |
| --- | --- | --- | --- | --- | --- |
| dev-01 | 5 | platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-complex-data-to-existing-entities.md = target | pass | 0 | partly |
| dev-02 | 3 | platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/plugin-lifecycle.md = target | pass | 0 | partly |
| dev-03 | 4 | platform/dev/6.7/guides/plugins/plugins/framework/store-api/add-store-api-route.md = target | pass | 0 | partly |
| dev-04 | 3 | platform/dev/6.7/guides/plugins/plugins/content/cms/add-cms-element.md = target | pass | 0 | pass |
| dev-05 | 3 | platform/dev/6.7/guides/plugins/themes/inheritance/add-theme-inheritance.md = target | pass | 0 | pass |
| dev-06 | 3 | platform/dev/6.7/guides/plugins/plugins/framework/flow/add-flow-builder-action.md = target | pass | 0 | partly |
| dev-07 | 3 | platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-custom-complex-data.md = target | pass | 0 | pass |
| dev-08 | 4 | platform/dev/6.7/guides/plugins/plugins/framework/data-handling/reading-data.md = target | pass | 0 | pass |
| dev-09 | 2 | platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-data-translations.md = target | pass | 0 | pass |
| dev-10 | 6 | platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-data-indexer.md = target | pass | 0 | pass |
| dev-11 | 7 | platform/dev/6.7/guides/plugins/plugins/services/add-custom-service.md ≠ target (platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md) | pass | 0 | pass |
| dev-12 | 3 | platform/dev/6.6/guides/plugins/plugins/plugin-fundamentals/dependency-injection.md = target | pass | 0 | pass |
| dev-13 | 3 | platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md = target | pass | 0 | pass |
| dev-14 | 3 | platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md = target | pass | 0 | pass |
| dev-15 | 3 | platform/dev/6.7/guides/plugins/plugins/framework/event/finding-events.md = target | pass | 0 | partly |
| dev-16 | 2 | platform/dev/6.7/guides/plugins/plugins/checkout/order/listen-to-order-changes.md = target | pass | 0 | pass |
| dev-17 | 7 | platform/dev/6.7/guides/plugins/plugins/checkout/cart/add-cart-discounts.md ≠ target (platform/dev/6.7/guides/plugins/plugins/checkout/cart/change-price-of-item.md) | pass | 0 | partly |
| dev-18 | 1 | — ≠ target (platform/dev/6.7/guides/plugins/plugins/checkout/cart/add-cart-processor-collector.md) | fail | 0 | fail |
| dev-19 | 4 | platform/dev/6.7/guides/plugins/plugins/framework/message-queue/add-message-to-queue.md ≠ target (platform/dev/6.7/guides/plugins/plugins/framework/message-queue/add-message-handler.md) | pass | 0 | partly |
| dev-20 | 3 | platform/dev/6.7/guides/plugins/plugins/framework/rule/add-custom-rules.md = target | pass | 0 | pass |
| dev-21 | 4 | platform/dev/6.7/guides/plugins/plugins/framework/flow/add-flow-builder-trigger.md = target | pass | 0 | fail |
| dev-22 | 3 | platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-plugin-configuration.md = target | pass | 0 | pass |
| dev-23 | 3 | platform/dev/6.7/guides/plugins/plugins/content/mail/add-mail-template.md = target | pass | 0 | partly |
| dev-24 | 3 | platform/dev/6.7/guides/plugins/plugins/content/seo/add-custom-seo-url.md = target | pass | 0 | partly |
| dev-25 | 3 | platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-custom-commands.md = target | pass | 0 | pass |
| dev-26 | 4 | platform/dev/6.7/guides/plugins/plugins/checkout/documents/legacy/add-custom-document-type.md ≠ target (platform/dev/6.7/guides/plugins/plugins/checkout/documents/v2/add-a-document-type.md) | pass | 0 | partly |
| dev-27 | 3 | platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-templates.md = target | pass | 0 | pass |
| dev-28 | 3 | platform/dev/6.7/guides/plugins/plugins/storefront/javascript/override-existing-javascript.md = target | pass | 0 | pass |
| dev-29 | 2 | platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-data-to-storefront-page.md = target | pass | 0 | partly |
| dev-30 | 4 | platform/dev/6.7/guides/plugins/plugins/storefront/howto/add-listing-filters.md = target | pass | 0 | pass |
| dev-31 | 6 | platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-scss-variables.md = target | pass | 0 | pass |
| dev-32 | 3 | platform/dev/6.7/guides/plugins/plugins/framework/custom-field/add-custom-field.md = target | pass | 0 | partly |
| dev-33 | 3 | platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-module.md = target | pass | 0 | partly |
| dev-34 | 3 | platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-components.md = target | pass | 0 | pass |
| dev-35 | 4 | platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/using-data-handling.md = target | pass | 0 | pass |
| dev-36 | 3 | platform/dev/6.7/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.md = target | pass | 0 | pass |
| dev-37 | 5 | platform/dev/6.7/guides/development/testing/unit/php-unit.md = target | fail | 0 | partly |
| dev-38 | 2 | platform/dev/6.7/guides/development/testing/unit/jest-admin.md = target | pass | 0 | partly |
| dev-39 | 6 | platform/dev/6.7/guides/upgrades-migrations/upgrade-shopware.md ≠ target (platform/dev/6.7/guides/development/testing/e2e-playwright/install-configure.md) | fail | 0 | fail |
| dev-40 | 1 | — ≠ target (platform/dev/6.7/guides/upgrades-migrations/upgrade-shopware.md) | fail | 0 | fail |
| dev-41 | 5 | platform/dev/6.7/guides/installation/system-requirements.md ≠ target (platform/dev/6.7/guides/hosting/_index.md) | pass | 0 | partly |
| dev-42 | 4 | platform/dev/6.7/products/tools/cli/validation.md ≠ target (platform/dev/6.7/products/tools/cli/project-commands/upgrade.md) | pass | 0 | pass |
| dev-43 | 3 | platform/dev/6.7/guides/upgrades-migrations/administration/vite.md = target | pass | 0 | partly |
| dev-44 | 4 | platform/dev/6.7/guides/upgrades-migrations/administration/vue3.md = target | pass | 0 | partly |
| dev-45 | 2 | platform/dev/6.7/guides/upgrades-migrations/administration/pinia.md = target | pass | 0 | pass |
| dev-46 | 2 | platform/dev/6.7/guides/upgrades-migrations/administration/meteor-components.md = target | pass | 0 | partly |
| dev-47 | 4 | platform/dev/6.7/guides/plugins/plugins/checkout/payment/add-payment-plugin.md = target | pass | 0 | pass |
| dev-48 | 3 | platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md = target | pass | 0 | pass |
| dev-49 | 3 | platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-controller.md = target | pass | 0 | partly |
| dev-50 | 3 | platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-scheduled-task.md = target | pass | 0 | pass |
| dev-51 | 4 | platform/dev/6.7/guides/plugins/plugins/framework/data-handling/entities-via-attributes.md = target | pass | 0 | partly |
| dev-52 | 3 | platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md = target | pass | 0 | pass |
| dev-53 | 3 | platform/dev/6.7/guides/plugins/themes/configuration/theme-configuration.md = target | pass | 0 | partly |
| dev-54 | 3 | platform/dev/6.7/guides/plugins/plugins/storefront/advanced/add-cookie-to-manager.md = target | pass | 0 | pass |
| dev-55 | 3 | platform/dev/6.7/guides/development/accessibility/storefront-accessibility.md = target | pass | 0 | partly |
| dev-56 | 3 | platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-header-footer.md = target | pass | 0 | pass |
| dev-57 | 3 | platform/dev/6.7/products/extensions/b2b-suite-migration/development/validation-and-run.md ≠ target (platform/dev/6.7/products/extensions/b2b-suite-migration/execution/running-migration.md) | pass | 0 | partly |
| dev-58 | 6 | platform/dev/6.7/guides/hosting/infrastructure/reverse-http-cache.md ≠ target (platform/dev/6.7/guides/hosting/infrastructure/redis.md) | pass | 0 | partly |
| dev-59 | 1 | — ≠ target (platform/dev/6.7/guides/hosting/infrastructure/reverse-http-cache.md) | fail | 0 | fail |
| dev-60 | 3 | platform/dev/6.7/guides/hosting/infrastructure/message-queue.md = target | pass | 0 | partly |
| dev-61 | 4 | platform/dev/6.7/guides/hosting/infrastructure/elasticsearch/elasticsearch-setup.md = target | pass | 0 | partly |
| dev-62 | 7 | platform/dev/6.7/guides/hosting/configurations/shopware/_index.md ≠ target (platform/dev/6.7/guides/hosting/configurations/shopware/environment-variables.md) | pass | 1 | partly |
| dev-63 | 5 | platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md ≠ target (platform/dev/6.7/resources/references/core-reference/commands-reference.md) | pass | 0 | fail |
| dev-64 | 4 | platform/dev/6.7/guides/development/integrations-api/_index.md ≠ target (platform/dev/6.7/guides/development/integrations-api/auth-api-requests.md) | pass | 0 | pass |
| dev-65 | 2 | platform/dev/6.7/guides/development/integrations-api/search-criteria.md = target | pass | 0 | partly |
| dev-66 | 2 | platform/dev/6.7/guides/development/integrations-api/request-headers.md = target | pass | 0 | partly |
| dev-67 | 7 | platform/dev/6.7/guides/plugins/apps/checkout/payment.md ≠ target (platform/dev/6.7/guides/plugins/apps/app-base-guide.md) | pass | 0 | partly |
| dev-68 | 2 | — ≠ target (platform/dev/6.7/guides/plugins/apps/lifecycle/app-registration-setup.md) | fail | 0 | fail |
| dev-69 | 2 | — ≠ target (platform/dev/6.7/guides/plugins/apps/lifecycle/webhook.md) | fail | 0 | fail |
| dev-70 | 1 | — ≠ target (platform/dev/6.7/guides/plugins/apps/checkout/payment.md) | fail | 0 | fail |
| dev-71 | 4 | platform/dev/6.7/guides/plugins/apps/custom-data/custom-entities.md = target | pass | 0 | pass |
| func-01 | 10 | platform/func/settings/saleschannel.md ≠ target (platform/func/catalogues/products.md) | fail | 1 | partly |
| func-02 | 7 | platform/func/tutorials-and-faq/rule-builder-example-rules.md ≠ target (platform/func/settings/rules.md) | pass | 0 | pass |
| func-03 | 3 | platform/func/marketing/promotions.md = target | pass | 0 | pass |
| func-04 | 3 | platform/func/migration-en/what-is-migrated.md = target | pass | 0 | partly |
| func-05 | 2 | — ≠ target (platform/func/settings/saleschannel.md) | fail | 0 | partly |
| func-06 | 3 | platform/func/settings/Flow-Builder.md = target | pass | 0 | partly |
| func-07 | 2 | platform/func/shopware-en/settings/importexport.md = target | pass | 0 | partly |
| func-08 | 5 | platform/func/settings/custom-fields.md = target | pass | 0 | partly |
| func-09 | 1 | — ≠ target (platform/func/settings/Paymentmethods.md) | fail | 0 | partly |
| func-10 | 6 | platform/func/shopware-6-de/Catalogues/Dynamicproductgroups.md = target | fail | 0 | fail |
| func-11 | 4 | platform/func/settings/system/user.md ≠ target (platform/func/settings/system/integrationen.md) | pass | 0 | pass |
| func-12 | 5 | platform/func/features/webhook-actions-in-flow-builder.md ≠ target (platform/func/extensions/shopware-commercial.md) | fail | 0 | partly |
| edge-01 | 4 | — ≠ target (none) | n/a | 1 | pass |
| edge-02 | 2 | — ≠ target (none) | n/a | 1 | pass |
| edge-03 | 3 | platform/dev/6.7/concepts/framework/data-abstraction-layer.md ≠ target (none) | n/a | 0 | pass |
| edge-04 | 5 | platform/dev/6.7/concepts/api/store-api.md ≠ target (platform/dev/6.6/guides/integrations-api/general-concepts/api-versioning.md) | n/a | 1 | partly |
| edge-05 | 6 | platform/func/migration-en/magento-keywords.md ≠ target (platform/dev/6.7/products/tools/mcp-server/intro.md) | n/a | 1 | partly |
| edge-06 | 1 | — ≠ target (platform/func/migration-en/magento-keywords.md) | n/a | 1 | fail |
| edge-07 | 5 | platform/dev/6.6/products/pwa.md = target | n/a | 0 | pass |
| edge-08 | 8 | platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md ≠ target (none) | n/a | 0 | pass |
| edge-09 | 5 | platform/func/settings/Flow-Builder.md ≠ target (platform/func/settings/Business-Events.md) | n/a | 0 | fail |
| gap-01 | 10 | platform/dev/6.7/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.md ≠ target (none) | n/a | 0 | pass |
| gap-02 | 7 | platform/dev/6.7/products/tools/cli/project-commands/helper-commands.md ≠ target (none) | n/a | 0 | pass |
| gap-03 | 4 | platform/dev/6.7/guides/development/integrations-api/_index.md ≠ target (none) | n/a | 0 | pass |
| gap-04 | 6 | platform/dev/6.7/guides/upgrades-migrations/_index.md ≠ target (none) | n/a | 0 | pass |
| gap-05 | 4 | platform/dev/6.7/guides/plugins/plugins/storefront/advanced/add-caching-to-custom-controller.md ≠ target (none) | n/a | 0 | partly |
| gap-06 | 6 | platform/dev/6.7/guides/plugins/plugins/checkout/payment/add-payment-plugin.md ≠ target (none) | n/a | 1 | pass |
| gap-07 | 5 | platform/dev/6.7/guides/plugins/plugins/content/media/_index.md ≠ target (none) | n/a | 0 | pass |
| gap-08 | 6 | platform/dev/6.7/concepts/api/store-api.md ≠ target (none) | n/a | 0 | pass |

## Scores by case

### fs-wiki

| Case | Grounding | Accuracy | Completeness | Citation | Honesty | Actionability | Total | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dev-01 | 100 | 0 | 40 | 100 | 100 | 100 | 66% | partly |
| dev-02 | 100 | 70 | 40 | 100 | 100 | 70 | 80% | partly |
| dev-03 | 100 | 70 | 70 | 100 | 0 | 100 | 73% | partly |
| dev-04 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-05 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-06 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| dev-07 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-08 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-09 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-10 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-11 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-12 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-13 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-14 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-15 | 100 | 40 | 70 | 100 | 100 | 70 | 77% | partly |
| dev-16 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-17 | 100 | 70 | 70 | 100 | 0 | 100 | 73% | partly |
| dev-18 | 0 | 40 | 40 | 0 | 0 | 40 | 20% | fail |
| dev-19 | 100 | 40 | 70 | 100 | 100 | 70 | 77% | partly |
| dev-20 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-21 | 100 | 0 | 0 | 100 | 100 | 40 | 54% | fail |
| dev-22 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-23 | 100 | 40 | 40 | 100 | 100 | 100 | 76% | partly |
| dev-24 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| dev-25 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-26 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| dev-27 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-28 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-29 | 100 | 70 | 40 | 100 | 100 | 100 | 83% | partly |
| dev-30 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-31 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-32 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| dev-33 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| dev-34 | 100 | 70 | 70 | 100 | 100 | 70 | 85% | pass |
| dev-35 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-36 | 100 | 100 | 70 | 100 | 100 | 100 | 95% | pass |
| dev-37 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| dev-38 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| dev-39 | 100 | 0 | 0 | 100 | 0 | 40 | 39% | fail |
| dev-40 | 0 | 40 | 70 | 0 | 0 | 100 | 30% | fail |
| dev-41 | 100 | 40 | 40 | 100 | 100 | 100 | 76% | partly |
| dev-42 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-43 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| dev-44 | 100 | 0 | 40 | 100 | 100 | 40 | 60% | partly |
| dev-45 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-46 | 100 | 0 | 40 | 100 | 100 | 40 | 60% | partly |
| dev-47 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-48 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-49 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| dev-50 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-51 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| dev-52 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-53 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| dev-54 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-55 | 100 | 40 | 0 | 100 | 100 | 40 | 64% | partly |
| dev-56 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-57 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| dev-58 | 100 | 70 | 70 | 100 | 0 | 100 | 73% | partly |
| dev-59 | 0 | 40 | 70 | 0 | 0 | 40 | 24% | fail |
| dev-60 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| dev-61 | 100 | 40 | 70 | 40 | 100 | 70 | 71% | partly |
| dev-62 | 100 | 70 | 40 | 100 | 100 | 70 | 80% | partly |
| dev-63 | 100 | 40 | 40 | 100 | 0 | 70 | 58% | fail |
| dev-64 | 100 | 70 | 70 | 100 | 100 | 70 | 85% | pass |
| dev-65 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| dev-66 | 100 | 40 | 100 | 100 | 100 | 70 | 82% | partly |
| dev-67 | 100 | 40 | 100 | 100 | 0 | 100 | 70% | partly |
| dev-68 | 0 | 70 | 100 | 0 | 0 | 70 | 39% | fail |
| dev-69 | 0 | 70 | 70 | 0 | 0 | 70 | 35% | fail |
| dev-70 | 0 | 40 | 70 | 0 | 0 | 40 | 24% | fail |
| dev-71 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| func-01 | 100 | 40 | 40 | 70 | 100 | 70 | 70% | partly |
| func-02 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| func-03 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| func-04 | 100 | 40 | 70 | 100 | 70 | 70 | 73% | partly |
| func-05 | 100 | 40 | 40 | 70 | 100 | 70 | 70% | partly |
| func-06 | 100 | 40 | 70 | 100 | 100 | 70 | 77% | partly |
| func-07 | 100 | 40 | 70 | 100 | 100 | 70 | 77% | partly |
| func-08 | 100 | 40 | 40 | 100 | 70 | 70 | 68% | partly |
| func-09 | 100 | 70 | 70 | 40 | 70 | 70 | 74% | partly |
| func-10 | 100 | 40 | 40 | 100 | 0 | 40 | 55% | fail |
| func-11 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| func-12 | 100 | 40 | 40 | 70 | 100 | 70 | 70% | partly |
| edge-01 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| edge-02 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| edge-03 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| edge-04 | 100 | 70 | 70 | 70 | 100 | 70 | 82% | partly |
| edge-05 | 100 | 70 | 70 | 100 | 0 | 70 | 70% | partly |
| edge-06 | 40 | 40 | 70 | 0 | 0 | 70 | 37% | fail |
| edge-07 | 100 | 70 | 70 | 100 | 100 | 70 | 85% | pass |
| edge-08 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| edge-09 | 70 | 0 | 40 | 100 | 100 | 0 | 48% | fail |
| gap-01 | 100 | 100 | 100 | 100 | 70 | 70 | 92% | pass |
| gap-02 | 100 | 100 | 100 | 70 | 100 | 100 | 97% | pass |
| gap-03 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| gap-04 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| gap-05 | 100 | 40 | 70 | 100 | 100 | 70 | 77% | partly |
| gap-06 | 100 | 100 | 100 | 100 | 100 | 70 | 97% | pass |
| gap-07 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| gap-08 | 100 | 100 | 100 | 70 | 100 | 100 | 97% | pass |

## Failures and official references

- **dev-01 (fs-wiki)** — partly, 66%
  - Answer instructs overriding getDefinitionClass() as the abstract method for a 6.7 entity extension, but expected fact 1 (within the marked snippet) states getDefinitionClass() does not exist in 6.7 and getEntityName() is the sole abstract method — this reproduces the suite's known documentation-defect trap called out in cases.md
  - Expected fact 2's association-field-type constraint (only AssociationField/Runtime/FkField-with-companion may be added, else a thrown exception) is not stated
  - Expected fact 3's BulkEntityExtension consumption difference (6.7 build-time hard error vs 6.6 boot-time silent-skip) is not covered, though both tag names are given correctly
  - Official: Framework/DataAbstractionLayer/EntityExtension.php:46 — "abstract public function getEntityName(): string; getDefinitionClass() does not exist in 6.7."
- **dev-02 (fs-wiki)** — partly, 80%
  - Expected fact 2's core mechanism (keepUserData=false triggers core to auto-remove only migrations/config/custom entities/custom fields, while uninstall() and assets always run) is not stated — the answer only says the plugin must respect the flag itself
  - Expected fact 3 (PluginLifecycleService install/uninstall order, CLI --activate/--keep-user-data flags, false default) is entirely absent
  - The seven lifecycle hooks and the keepUserData early-return pattern are accurately covered
  - Official: Framework/Plugin/PluginLifecycleService.php:222-251 — "keepUserData() gates exactly four core cleanup steps; assets and the plugin's uninstall() hook run regardless."
- **dev-03 (fs-wiki)** — partly, 73%
  - selfReportDelta shows the self-reported toolCallLog omits the Read of the actual target page (add-store-api-route.md) that the answer's own citation depends on — reported 2 calls, ground truth shows 3 — a materially under-reported log
  - Expected fact 2's detail that the route never encodes JSON itself (a kernel.response listener converts the Struct) is not stated
  - Expected fact 3's caveat that an inactive plugin has no routes at all is not stated
  - Official: Framework/Routing/StoreApiRouteScope.php:13-19 — "Declaring the scope is mandatory; a missing or unsatisfied scope throws at request time."
- **dev-06 (fs-wiki)** — partly, 80%
  - Uses '$flow->getStore($key)' for Aware data and '$flow->getData($key)' for event/additional data, which is not confirmed by the expected facts (which specify $flow->getConfig() for sequence config and $flow->getData(<Aware constant>) for event data) — a likely-inaccurate API split
  - Admin registration is described via overriding the sw-flow-sequence-action component rather than the confirmed flowBuilderService.addActionNames()/addLabels()/addIcons()/addGroups()/addActionGroupMapping() methods, and DelayableAction/TransactionalAction markers are not mentioned
  - The flow.action tag with key and priority attributes, and the FlowAction abstract contract, are correctly covered
  - Official: Content/DependencyInjection/flow.xml:61,64-67 — "Registration is the flow.action tag and the tag must carry key; missing/mismatched key is a silent no-op."
- **dev-15 (fs-wiki)** — partly, 77%
  - Recommends searching for the literal term '@Event' to find event-class constants, but expected fact 3 (within the marked snippet) explicitly states this search term is dead and does not occur anywhere in the 6.7 source — a materially misleading discovery tip
  - Does not mention bin/console debug:event-dispatcher or debug:business-events, so the fact that debug:event-dispatcher only lists already-registered listeners (not what is dispatched) is missing
  - DAL event naming and the render-before-Twig / page-loaded-event points are reasonably covered
  - Official: Framework/DataAbstractionLayer/Event/EntityLoadedEvent.php:31 — "EntityLoadedEvent sets its own name to <entityName>.loaded."
- **dev-17 (fs-wiki)** — partly, 73%
  - selfReportDelta shows 4 undisclosed calls (reads of architecture/cart-process.md and checkout/cart/add-cart-discounts.md, plus an index.md read and a glob) missing from the self-reported toolCallLog — reported 2 calls, ground truth shows 6 — a materially under-reported log
  - Expected fact 3's customPrice-extension + allowProductPriceOverwrites-permission gate (core only grants it in admin/order-recalculation contexts) is not mentioned
  - Collector/processor split, QuantityPriceDefinition construction and the documented priority 4500 are accurately covered
  - Official: Checkout/DependencyInjection/cart.xml:355-356 — "ProductCartProcessor is priority 5000 for both tags."
- **dev-18 (fs-wiki)** — fail, 20%
  - Ground truth shows zero retrieval calls for this case's turn (selfReportDelta reported 4, actual 0), and all three citations have matchesToolCallLog: false — the answer is not grounded in anything actually retrieved for this specific query
  - Findability fail: the target page (add-cart-processor-collector.md) was never read this turn; pageReached is null
  - Diagnoses the duplication/staleness cause as 'mutating $original instead of $toCalculate', but the expected facts attribute duplication to CartRuleLoader's up-to-7-iteration re-run (which feeds the result cart back in as the next pass's input) plus LineItemCollection::add() summing quantities on an existing id rather than replacing — a materially different and incomplete mechanism
  - No mention of a deterministic line-item id / exists()-set() idempotency pattern, or of re-stamping quantity on the QuantityPriceDefinition each pass
  - Official: Checkout/Cart/Processor.php:34-52 — "$toCalculate is a brand-new empty Cart each calculation; only a few scalars and the data collection carry over."
- **dev-19 (fs-wiki)** — partly, 77%
  - States '#[AsMessageHandler] ... no manual services.php tagging is required' — this directly contradicts expected fact 2, which states Shopware never marks plugin definitions autoconfigured, so the messenger.message_handler tag (or the plugin's own autoconfigure=true) is required for a plugin handler to actually register
  - Does not mention that the handler must be final or that a PHPStan rule enforces it
  - AsyncMessageInterface/LowPriorityMessageInterface routing and dispatch via the injected bus are correctly covered
  - Official: Framework/App/MessageHandler/RotateAppSecretHandler.php:9-29 — "Handler shape: final class, #[AsMessageHandler] attribute, __invoke."
- **dev-21 (fs-wiki)** — fail, 54%
  - States the BusinessEventCollectorEvent subscriber should use 'a high priority (e.g. 1000)' — this is exactly the case's Trap; the confirmed fact is that no elevated priority is needed and the documented 1000-priority recipe does not hold
  - States getAvailableData() has been superseded by StorableFlow since 6.5 and is no longer used, directly contradicting the expected fact that getAvailableData() is still required and still consumed by the collector in 6.7
  - Does not mention the Bundle::getActionEventClasses() registration route, the flow.storer/ScalarValuesAware requirement for trigger data, or that define()'s custom name does not change what fires the trigger
  - Official: Framework/Event/FlowEventAware.php:9-14 — "FlowEventAware mandates static getAvailableData() and getName(), and extends ShopwareEvent."
- **dev-23 (fs-wiki)** — partly, 76%
  - States mail_template.system_default 'must be 0' — this directly contradicts expected fact 3 (within the marked snippet), which states this is editorial: system_default is unenforced by code and 1 is actually the safer value for a type's canonical template
  - CreateMailTemplateTrait (added 6.7.8.0, and its inability to carry a plugin's own template bodies) is not mentioned at all
  - MigrationStep-based insertion into mail_template_type/translation and mail_template/translation with idempotency guarding is otherwise accurately covered
  - Official: Content/MailTemplate/MailTemplateDefinition.php:56 — "system_default is a plain BoolField with only ApiAware — no Required, WriteProtected, Computed or default."
- **dev-24 (fs-wiki)** — partly, 80%
  - States that a soft-deleted seo_url row 'stays reachable, so the controller still needs to check whether the underlying content exists' — escalated (trigger 3: doc claim looks right but is disproven by code) to the expected file's Absences table beyond the marked snippet, which confirms SeoResolver and every other read path already filter is_deleted=0 and no core controller performs this check; the claim is a documented divergence and is wrong
  - Correctly identifies that the tagged service alone generates nothing and the plugin must call SeoUrlUpdater::update() itself, since SeoUrlUpdateListener only covers product/category/landing-page
  - Does not mention the per-sales-channel/per-language generation nuance or that rows are never written with sales_channel_id NULL
  - Official: Content/Seo/SeoUrlRoute/SeoUrlRouteConfig.php:54-61 — "getPrimaryKeyParameter() throws when the key is null; no fallback, no skipInvalid guard."
- **dev-26 (fs-wiki)** — partly, 80%
  - This is the confirmed trap case: at 6.7.13.0 the Document v2 stack (AbstractDocumentType, shopware.document_v2.type tag) does not exist, but the answer presents it as a currently valid alternative recipe with those exact (non-existent) classes/tags — a materially misleading statement per the case's explicit trap.
  - Legacy-stack facts (renderer, service tag, document_type row + number range) are covered accurately (facts 1-2 substantially present).
  - Fact 3 (literal setTemplate() resolution, DocumentFileRendererRegistry, optional document_base_config) is not stated; answer only describes a generic sw_extends template pattern.
  - Official: Checkout/Document/Renderer/AbstractDocumentRenderer.php:19-29 — "Extension point for a new document type is AbstractDocumentRenderer, three abstract methods."
- **dev-29 (fs-wiki)** — partly, 83%
  - Fact 1 (addExtension/getExtension mechanism) present; fact 2 (6.7 header/footer rendered via ESI, no `page` variable in header/footer templates, must use Header/FooterPageletLoadedEvent) is not stated even though the example is footer-specific — the crucial correction is missing.
  - Fact 3 (store-api convention is only Danger-PR enforced, not a plugin constraint) is not explicitly stated, though the answer does correctly recommend a Store API route.
  - Audit notes toolCallLog over-reports by one call versus ground truth (2 vs 1) — minor, not treated as a materially under-reported log.
  - Official: storefront: Page/Product/ProductPageLoader.php:127-131 — "Every Storefront page loader dispatches a *PageLoadedEvent with the fully built page as its last step."
- **dev-32 (fs-wiki)** — partly, 73%
  - Fact 2 (bind the set to the product entity via a custom_field_set_relation, and it must not be global) is never stated — the repository example even sets `'global' => true` with no `relations` key, which would not surface the set on the product detail page as the query asks.
  - Fact 3 (immutable name/type, custom_field.editor ACL, search index rebuild needed) is largely absent aside from a general mention of includeInSearch.
  - Fact 1 (declarative custom-fields.xml since 6.7.13.0) is present and accurate.
  - Official: Framework/Plugin/PluginLifecycleService.php:569-571 — "A plugin declares custom field sets in an XML file; PluginLifecycleService reads exactly this path."
- **dev-33 (fs-wiki)** — partly, 73%
  - Directly reproduces the case's explicit trap: answer states settingsItem.group is 'shop, system, or plugins', but the expected answer explicitly says this is not a restricted/validated set and 'shop' is not even in the 6.7 union.
  - Fact 2 (build chain: active plugin -> var/plugins.json -> Vite entrypoints.json -> assets:install, silent drop if missing) is only shallowly covered ('build the Administration JS... plugin must be activated').
  - Fact 3 (menu entry requires parent+non-empty label, position+=1000, own icon with no fallback) is not covered.
  - Fact 1 core registration mechanism (Module.register from index.js imported by main.js) is present.
  - Official: administration package — src/core/factory/module.factory.ts:159 — "Registration goes through the module factory's registerModule(moduleId, module)."
- **dev-37 (fs-wiki)** — partly, 80%
  - Findability fail: 3 list/grep calls before reading the target page (over the 2-call threshold).
  - Facts 1 (phpunit.xml + TestBootstrap chain) and 2 (IntegrationTestBehaviour/KernelTestBehaviour) present at a reasonable level of detail.
  - Fact 3 is replaced by an unverified/likely-wrong claim: 'install the flex template dev-tools package (composer require --dev dev-tools)' instead of the expected fact that PHPUnit is not shipped by shopware/core and the project must require phpunit/phpunit ^11.5 itself; no mention of the DATABASE_URL _test suffix.
  - Official: Framework/Plugin/Command/Scaffolding/stubs/test-bootstrap.stub:1-12 — "Scaffolded bootstrap chains addCallingPlugin + addActivePlugins + setForceInstallPlugins(true)."
- **dev-38 (fs-wiki)** — partly, 73%
  - Fact 1 (spec co-location) present at a high level; does not mention wrapTestComponent (one of the two documented mounting routes) or that Vue Test Utils 2 requires stubs/mocks/provide under a `global` key — the shown mount() call omits that nesting, which would fail in Vue 3 test-utils.
  - Fact 3 (Shopware ships no Jest harness for a plugin; a plugin must supply its own config) is missing entirely — the answer instead presents monorepo-only commands (composer run admin:unit, admin:create:test) as if usable for a standalone plugin.
  - Official: Resources/app/administration/jest.config.js:50,61,166-181 — "Specs run under Jest 30 with jest-environment-jsdom and @vue/test-utils 2.4.6."
- **dev-39 (fs-wiki)** — fail, 39%
  - This is the confirmed Cypress trap: the answer explains in detail how to set up Cypress E2E tests for a 6.7 plugin, which the expected answer states is definitively wrong — there is no Cypress support in 6.7 (0-byte stub, no dependency, no npm script); the correct answer is the Playwright acceptance-test suite, which is never mentioned.
  - Findability fail: target (testing/e2e-playwright/install-configure.md) was never read; the agent instead read and cited the legacy Cypress page.
  - selfReportDelta shows the agent's toolCallLog materially under-reports its actual actions (ground truth includes a Bash call and a Read of upgrade-shopware.md that were never logged) — honesty is scored 0 per the rubric's under-reporting rule.
  - Official: https://github.com/shopware/shopware/tree/v6.7.13.0/tests/e2e/cypress — "Upstream tests/e2e/cypress at v6.7.13.0 holds one 0-byte file."
- **dev-40 (fs-wiki)** — fail, 30%
  - Ground truth shows zero actual retrieval calls for this case's turn (selfReportDelta reported=2, actual=0; auditNotes flags a self-report overstatement), yet the report cites a specific line range and presents detailed content as if freshly read — the audit's citation entry has matchesToolCallLog=false. Honesty and Citation both score 0 per the rubric.
  - Findability fail: target page was never actually read (pageReached null in ground truth).
  - Content itself (composer.json constraint change, recipes:update, system:update:finish) is largely accurate on the facts it states, but mischaracterizes the Flex recipe refresh as 'optional' when the expected answer says it is mandatory (symfony.lock pins recipes owning bin/console etc.) — a materially wrong statement.
  - Official: Maintenance/System/Command/SystemUpdateFinishCommand.php:84-107 — "system:update:finish dispatches UpdatePreFinishEvent, runs migrations, dispatches UpdatePostFinishEvent."
- **dev-41 (fs-wiki)** — partly, 76%
  - States 'PHP 8.2+ (recommended 8.4)' — exactly the wrong open-ended framing the expected answer explicitly warns against; the real constraint is a bounded enumerated tilde list (~8.2.0||~8.3.0||~8.4.0||~8.5.0), not '8.2 or newer'.
  - Database thresholds (MariaDB>=10.11.6/MySQL>=8.0.22, Innovation unsupported) are correct, but omits that the version check only runs at system:install/web-installer time, never at composer update or boot — the exact nuance the query needs.
  - Node requirement is given as a single figure without noting the Administration and Storefront packages declare different engine ranges, and does not mention `composer check-platform-reqs` as the CLI tool to check before retrying.
  - Official: composer.json:51-72 — "php constraint is ~8.2.0 || ~8.3.0 || ~8.4.0 || ~8.5.0, a bounded list."
- **dev-43 (fs-wiki)** — partly, 73%
  - Directly contradicts a called-out fact: states 'the new system can be tested behind the ADMIN_VITE feature flag', but the expected answer states no such flag exists — 6.7's admin build is Vite-only and unconditional.
  - Correctly identifies vite.config.mts's location (fact 2's path), but omits that Shopware's inline config always overrides root/build.outDir/base.
  - Fact 3 (var/plugins.json driving the build, bundle:dump, entrypoints.json, /api/_info/config) is substantially present.
  - Official: administration: Resources/app/administration/build/plugins.vite.ts:42-64,134-146 — "build/plugins.vite.ts synthesises a complete Vite config per extension."
- **dev-44 (fs-wiki)** — partly, 60%
  - Directly reproduces two explicit traps: (1) claims 'this.$tc itself being one of the few exceptions that still works' — the expected answer explicitly forbids this claim (this.$tc is deprecated for removal in 6.8); (2) claims 'mutating props now throws hard errors' — the expected answer explicitly states this is wrong (console.warn in dev, silent in prod).
  - Offers 'this.$parent.$parent' as a workaround for the $parent shift, which is exactly the wrong hard-coded-hop fix the expected answer warns against (depth is not fixed).
  - Fact 1 ($tc in a prop default -> Shopware.Snippet.tc) is correctly stated.
  - Official: administration: Resources/app/administration/src/core/shopware.ts:264-275 — "Shopware.Snippet.tc('…') is the getter that spreads the running app's i18n.global."
- **dev-46 (fs-wiki)** — partly, 60%
  - Directly reproduces the case's explicit trap invocation: gives 'composer run admin:code-mods -- --plugin-name example-plugin --fix -v 6.7' as the command, which the expected answer explicitly states does not exist in a Flex/project install (monorepo-only script).
  - Fact 2 (the deprecated-prop mechanism governs only 15 components; sw-tabs/sw-popover/sw-loader/sw-skeleton-bar use a different, feature-flag-gated mechanism that always renders the deprecated variant on stock 6.7) is not mentioned at all.
  - Fact 1's core mechanism (deprecated prop, default false, Meteor rendered by default) is correctly conveyed.
  - Official: administration: src/app/component/base/sw-button/sw-button.html.twig:1-20 — "Neither sw-button nor sw-card is removed in 6.7 — both are @deprecated tag:v6.8.0 wrapper components."
- **dev-49 (fs-wiki)** — partly, 80%
  - States route names should use 'frontend, widgets, payment, api or store-api' prefixes — the expected answer explicitly states api/store-api are URL path prefixes of a different mechanism, NOT storefront route-name prefixes; only frontend./widgets./payment. are valid.
  - Facts 1 (#[Route] attribute + ATTRIBUTE_ROUTE_SCOPE default) and 2 (routes.php glob + attribute loader type + setContainer) are correctly and precisely stated.
  - Official: Storefront/Controller/AccountOrderController.php:43,49 (shopware/storefront) — "Route class imported from Symfony\Component\Routing\Attribute\Route; scope is a #[Route] default."
- **dev-51 (fs-wiki)** — partly, 80%
  - expected-answer fact 3 (attribute entities do not auto-create their DB table; a plugin MigrationStep with CREATE TABLE is still required) is entirely absent from the answer
  - the answer frames the attribute route as replacing 'the old XML config approach' for plugins, missing the case's Trap: Resources/config/entities.xml was never read for plugins and the classic EntityDefinition route is unchanged and still fully supported — this materially misrepresents the premise
  - Official: Framework/DataAbstractionLayer/Attribute/Entity.php:10-32 — "Entity is a plain class extending Entity and carrying the class attribute #[Entity('example_entity')]."
- **dev-53 (fs-wiki)** — partly, 80%
  - answer states 'since 6.7.1.0, label/helpText are omitted from theme.json field objects entirely', which materially contradicts expected fact 3: inline label/helpText still work in 6.7 as a fallback and are only stripped when the v6.8.0.0 feature flag is active — a wrong, unconditional-removal claim
  - Official: shopware/storefront Theme/StorefrontPluginConfigurationFactory.php:144 — "Config fields are declared in the bundle's Resources/theme.json under config.fields.<fieldName>."
- **dev-55 (fs-wiki)** — partly, 64%
  - answer directly commits the case's documented Trap: it states the accessibility changes 'stay inactive by default until the flag is set (ACCESSIBILITY_TWEAKS=1 in .env)', while expected fact 1 states the flag is inert in 6.7 and nothing reads it — the changes cannot be switched off
  - expected-answer fact 2 (sw_extends/TemplateFinder mechanism, silent drop of stale block overrides, loud RuntimeError only on parent()) is entirely absent
  - expected-answer fact 3 (concrete remedy examples: cart line-item <li>, product-card stretched-link, SCSS $font-size-base default, listing.plugin.js aria-label button) is entirely absent
  - Official: Framework/Resources/config/packages/feature.yaml:24-28 — "The ACCESSIBILITY_TWEAKS flag itself still exists as a declaration but nothing in core or storefront reads it."
- **dev-57 (fs-wiki)** — partly, 80%
  - audit marks findability fail (target running-migration.md never read); upgraded to pass under the drift tolerance — the page actually read, validation-and-run.md, is the sibling execution-lane page carrying the b2b:migrate:validate/progress/commercial/rollback command set the answer relies on
  - expected fact 2 (employee_management always migrates first, prerequisite for other components) is entirely absent from the answer
  - expected fact 1's --batch-size=100 option is not mentioned
  - Official: https://developer.shopware.com/docs/products/extensions/b2b-suite-migration/execution/running-migration.html — "The employee_management component is a prerequisite for all other B2B components and is migrated first by default, regardless of the specified order."
- **dev-58 (fs-wiki)** — partly, 73%
  - selfReportDelta shows a materially under-reported toolCallLog: report claims 2 calls, ground truth shows 4, including an unreported Read of reverse-http-cache.md (dev-59's target) — Honesty scored 0 per rubric regardless of the answer's own content quality
  - expected fact 2 (redis_url removed entirely; every subsystem — cart storage, number range, cache invalidation delay, increment pools — references a named connection, not a URL) is entirely absent from the answer
  - Official: Framework/DependencyInjection/Configuration.php:1581-1600 — "Connections declared under shopware.redis.connections.<name>.dsn — dsn is the only child node and required."
- **dev-59 (fs-wiki)** — fail, 24%
  - ground truth shows 0 actual retrieval calls in this case's turn although the report claims 2 and cites reverse-http-cache.md:1-89 with matchesToolCallLog: false — the content was not obtained via a call made in this turn (likely reused from dev-58's cross-contaminated read); Grounding, Citation and Honesty all score 0 per the rubric's 'no supporting toolCallLog result' / 'fabricates content' bands
  - findability fail: target never read this turn (0 retrieval calls, pageReached null)
  - content itself reproduces the case's documented Trap almost verbatim: it presents 'use_varnish_xkey: true' plus 'ban_method: BAN' as the correct 6.7 config, when expected fact 2 states these are deprecated no-ops with no effect in 6.7
  - expected fact 3's central diagnostic (delayed invalidation on by default, 5-minute scheduled task, sw-force-cache-invalidate header) is entirely absent from the answer, which is the actual likely cause of the reported symptom
  - Official: Framework/DependencyInjection/cache.xml:233-238 — "RedisReverseProxyGateway no longer exists; VarnishReverseProxyGateway is now the default gateway class."
- **dev-60 (fs-wiki)** — partly, 80%
  - answer states 'you must also set up a CLI worker for the failed transport, otherwise failed messages are never processed... then deleted' — this directly contradicts expected fact 3: failed is a dead-letter target drained with messenger:failed:*, never consumed by a standing worker, and exhausted messages are moved to failed, not deleted
  - expected fact 2's consequence (disabling the admin worker makes a separate bin/console scheduled-task:run process mandatory, or no scheduled task is ever queued) is not mentioned — only the disabling config key is given
  - Official: Framework/Resources/config/packages/framework.yaml:57-93 — "Every transport must be named explicitly on the command line — nothing appends low_priority implicitly."
- **dev-61 (fs-wiki)** — partly, 71%
  - answer states the shard/replica default is 3/3, directly reproducing the case's documented Trap: expected fact 1 states the 6.7 storefront defaults were emptied so the cluster decides, and only the admin indices still default 3/3
  - expected fact 3 (separate admin index config/command, still 3/3, es:admin:index, es:index does not touch it) is entirely absent
  - the answer names 'bin/console dal:migration:create' and 'dal:refresh:index --use-queue' as reindex commands; neither appears in the cited excerpt's full 6.7 command list (es:index, es:admin:index, es:create:alias, es:reset, es:admin:reset, es:mapping:update, es:admin:mapping:update, es:index:cleanup, es:status, es:test:analyzer, es:admin:test) and is not marked [from memory] — an unlabelled, uncited factual claim, capping Citation at 40
  - Official: shopware/shopware@v6.7.13.0 src/Elasticsearch/Resources/config/packages/elasticsearch.yaml — "In 6.7 both storefront index env defaults for shards/replicas are empty."
- **dev-62 (fs-wiki)** — partly, 80%
  - the [from memory]-labelled precedence statement (real env > .env.local > .env) correctly matches expected fact 1's core Symfony precedence, but the .env.local.php special case (which usually explains why an edit to .env has no effect on a deployed shop) is never mentioned
  - expected fact 2 (a changed .env value does not need cache:clear in prod, except FEATURE_* flags) is not addressed at all — the answer neither states nor contradicts it
  - Official: vendor/symfony/dotenv/Dotenv.php:110-177,216-224 — "A real environment variable wins over every .env file; later .env files override earlier ones."
- **dev-63 (fs-wiki)** — fail, 58%
  - selfReportDelta shows a materially under-reported toolCallLog (reported 2, actual 4, two unreported calls) — Honesty scored 0 per rubric
  - audit marks findability fail against target commands-reference.md; upgraded to pass under the drift tolerance since the page actually read, database-migrations.md, is the case's own official reference URL page and does carry the database:migrate command content
  - expected fact 2 (installed+active requirement, silent 'no collection found... continuing' exit-0 on a typo'd identifier, cache:clear needed only for a brand-new Migration directory) is entirely absent — this is the central diagnostic the query asks for ('my new migration never ran')
  - expected fact 3 (normal path is plugin:update, gated by plugin:refresh reading upgradeVersion; Deployment Helper skips a plugin whose upgradeVersion is unchanged) is not mentioned
  - Official: Framework/Migration/Command/MigrationCommand.php:53-59,70-77,98-105 — "database:migrate <Identifier> --all; identifier is the plugin's bundle name."
- **dev-65 (fs-wiki)** — partly, 80%
  - answer states total-count-mode: 1 'runs SQL_CALC_FOUND_ROWS for an exact total', which directly contradicts expected fact 3: exact mode runs a second COUNT(*) over the subquery, not SQL_CALC_FOUND_ROWS — a materially wrong technical detail
  - expected fact 2's to-one vs to-many nuance (a nested filter/sort/limit on a to-one association is silently ignored; only to-many reaches SQL) is entirely absent — only the general 'associations = nested criteria like a join' description is given
  - Official: Framework/DataAbstractionLayer/Search/RequestCriteriaBuilder.php:40, :86, :284 — "Accepted top-level keys are exactly ids, total-count-mode, limit, page, includes, excludes, filter, grouping, post-filter, query, term, sort, aggregations, associations, fields."
- **dev-66 (fs-wiki)** — partly, 82%
  - answer frames sw-skip-trigger-flow as scoped to 'bulk imports via the Sync API', while expected fact 3 states it is resolved for every /api route, not only POST /api/_action/sync — a materially misleading scoping claim
  - sw-inheritance is illustrated only with 'sw-inheritance: 1' with no mention that it is a presence check (any value, including 0/false, enables it) — could mislead a reader into thinking a falsy value disables inheritance, per expected fact 2
  - Official: Framework/Routing/ApiRequestContextResolver.php:114 — "sw-language-id sets the context language, expanded into requested -> parent -> system fallback."
- **dev-67 (fs-wiki)** — partly, 70%
  - selfReportDelta shows a materially under-reported toolCallLog: reported 2 calls, ground truth shows 5, missing three unreported Reads — including the target pages of dev-68/69/70, which those cases' own turns then show as 0 actual retrieval calls — Honesty scored 0 per rubric regardless of this case's own content quality
- **dev-68 (fs-wiki)** — fail, 39%
  - ground truth shows 0 actual retrieval calls in this case's own turn although the report claims 1 and cites app-registration-setup.md:27-92 with matchesToolCallLog: false — the content was not obtained via a call made in this turn (the actual read happened during dev-67's turn per that case's selfReportDelta); Grounding, Citation and Honesty score 0 per the rubric's 'no supporting toolCallLog result'/'fabricates content' bands
  - findability fail: target never read this turn
  - the answer content itself (once judged on its own merits) is accurate against the three expected facts but omits the 6.7-specific rule that a returned secret identical to the currently stored one is rejected
  - Official: Framework/App/Lifecycle/Registration/PrivateHandshake.php:31-58 — "Shopware sends a GET to <setup><registrationUrl> carrying shopware-app-signature and sw-version."
- **dev-69 (fs-wiki)** — fail, 35%
  - ground truth shows 0 actual retrieval calls in this case's own turn although the report claims 1 and cites webhook.md:18-59 with matchesToolCallLog: false — the content was not obtained via a call made in this turn (the actual read happened during dev-67's turn); Grounding, Citation and Honesty score 0 per rubric
  - findability fail: target never read this turn
  - content itself omits expected fact 1's privilege requirement (the app must hold <entity>:read or the webhook is silently skipped — no message, no log, no delivery)
  - Official: Framework/Webhook/Hookable/HookableEntityWrittenEvent.php:42-45 — "The app must hold the product:read privilege, otherwise the webhook is silently skipped."
- **dev-70 (fs-wiki)** — fail, 24%
  - ground truth shows 0 actual retrieval calls in this case's own turn although the report claims 1 and cites payment.md:17-66 with matchesToolCallLog: false — the content was not obtained via a call made in this turn (the actual read happened during dev-67's turn); Grounding, Citation and Honesty score 0 per rubric
  - findability fail: target never read this turn
  - the answer's payment-state list ('open, paid, cancelled, refunded, failed, authorize, unconfirmed, in_progress, reminded, chargeback') conflates state names with the state-machine transition action names the app must actually return; expected fact 3 states state names such as cancelled/refunded/failed/in_progress/unconfirmed/reminded are NOT accepted action names — a materially misleading claim that could cause a developer to send an invalid status
  - Official: Framework/App/Manifest/Schema/manifest-3.0.xsd:520-538 — "Only identifier and name are mandatory; pay-url, finalize-url, validate-url, refund-url, recurring-url are optional."
- **func-01 (fs-wiki)** — partly, 70%
  - findability fail is a legitimate call-count fail (3 list/grep calls before the target was read, target actually was read per audit) — no drift adjustment applies
  - expected fact 2 (per-channel visibility is a separate product_visibility row with exactly three levels — link/search/all — gated per route threshold) is entirely absent; the answer instead only describes assigning products/categories to a sales channel's Products tab, a materially different and incomplete mechanism for the exact query asked ('configure its visibility per sales channel')
  - expected fact 3 (the 6.7 variant-listing display_group bug — a NULL variant_listing_config after 'Generate variants' leaves the listing showing one arbitrary child variant) is entirely absent, missing the central 'why might it not show up' diagnosis
  - citation to platform/func/catalogues/product-overview.md:32-34 has matchesToolCallLog: false per the audit — one of three citations does not correspond to a logged read call
  - Official: Content/Product/ProductDefinition.php:161,172,173,180 — "On the create route no tab bar is rendered at all until first save."
- **func-04 (fs-wiki)** — partly, 73%
  - answer states 'shipping and payment methods are not actually transferred automatically... need to be recreated', but expected fact 3 states shipping methods DO have a ShippingMethodDataSet and ARE migrated with customersOrders — only payment methods lack a DataSet; the answer wrongly extends the payment-methods limitation to shipping methods too
  - expected fact 2's eight premapping items are reduced to five in the answer (payment methods, standard payment method, salutation, delivery time, standard delivery time), omitting order states, order delivery states, transaction states and newsletter recipient status entirely, along with the mandatory-enforcement and non-destructive-preselection mechanics
  - selfReportDelta shows reported 2 vs actual 1, but the toolCallLog entry itself discloses the reuse ('(reused earlier grep output listing migration pages)') rather than concealing it — treated as a minor claim outrunning support (Honesty 70), not a fabrication
  - Official: SwagMigrationAssistant@6.6.x src/Profile/Shopware/DataSelection/BasicSettingsDataSelection.php:49-62 — "basicSettings is the mandatory base selection carrying languages, categories, customer groups, currencies, sales channels and number ranges."
- **func-05 (fs-wiki)** — partly, 70%
  - fact 1 (four sales-channel types incl. Agentic Commerce; all fields Required regardless of type) absent — answer names only three channel types and never states the required-field invariance
  - fact 3 (sw-access-key header, SWSC prefix, no secret counterpart) absent — answer only says the key is fetched from 'Status/API access area' without the header name or the no-secret distinction
  - findability fail: target page was grepped but never actually Read per the ground-truth call log (single grep call only), despite the answer containing narrative far beyond a bare grep match
  - citation's matchesToolCallLog is false — the cited range was not confirmed against a logged read_doc/Read call
  - Official: Defaults.php:27-33 — "6.7.13.0 ships four channel type UUIDs: Storefront, API, Product comparison, Agentic commerce."
- **func-06 (fs-wiki)** — partly, 77%
  - case is version-pinned 6.6, but the answer places the Flow Builder under 'Settings > Automation' — the 6.7 location; expected fact 1 requires 'Settings > Shop' for 6.6
  - answer repeats the doc's known-false claim that `checkout.order.payment_method.changed` already sets order status to 'Open' — this is exactly the case's second documented trap and the answer fails it
  - expected fact 3 nuance (recipient.type 'custom' replaces rather than merges the audience; a default order-confirmation flow already exists) is not stated
  - Official: 6.6 Administration sw-flow/index.js:179-187 (ref v6.6.10.0) — "In 6.6 the Flow Builder sits under Settings > Shop; 6.7 moves it to Settings > Automation."
- **func-07 (fs-wiki)** — partly, 77%
  - answer states dry run 'validates without writing any data' — this directly contradicts the code-confirmed fact that dry run performs the real writes and only rolls back the entity transaction, leaving logs/files/media side effects behind
  - fact 1's version-specific menu difference (6.6 Shop vs 6.7 Automation) is collapsed into a single 'Settings > Automation' statement for this 6.6+6.7 shared case
  - fact 2's duplicate-mapping-silently-collapses trap is not mentioned
  - Official: Content/ImportExport/ImportExport.php:116-118,180-182,191-194,196-210 — "Start dry run performs the real writes and rolls the DBAL transaction back at the end."
- **func-08 (fs-wiki)** — partly, 68%
  - fact 1's global (not per-set) technical-name uniqueness and the 'set with no relation is blocked everywhere' rule are not stated
  - fact 2's version delta (6.6 does not enforce the Twig-variable-name pattern) and the eleven-to-eight stored-type collapse are missing
  - fact 3 conflates 'Modifiable via Store API' with public visibility ('marks the field public') — the three independent switches (read/write/cart) are not distinguished, which materially misrepresents the write-gate semantics
  - selfReportDelta shows one unreported call to an unrelated file (Paymentmethods.md); treated as a minor, non-material omission (single dead-end call, unrelated to the cited answer content) rather than a fabrication signal
  - Official: System/CustomField/Aggregate/CustomFieldSetRelation/CustomFieldSetRelationDefinition.php — "A set with no relation row serves no entity — such a field is blocked on every entity for reads and writes."
- **func-09 (fs-wiki)** — partly, 74%
  - toolCallLog is empty ([]) yet the answer cites a specific line range whose content is verified accurate — the ground-truth call log also shows zero calls for this case's turn, so the cited content has no logged retrieval support this turn
  - facts 1 and 2 (sales-channel assignment gate, availability-rule gate) are correctly and specifically stated
  - fact 3 (dangling handler still offered; checkout gateway can drop a passing method; blocked-error reason 'not allowed') is entirely absent
  - administration path given as 'Settings > Commerce' though the case is pinned to 6.6, where the docs-only path is 'Settings > Shop'
  - Official: Checkout/Payment/SalesChannel/SalesChannelPaymentMethodDefinition.php:15 — "Store API payment-method listing unconditionally adds the filter payment_method.salesChannels.id = current sales channel."
- **func-10 (fs-wiki)** — fail, 55%
  - selfReportDelta shows the actual Read of the cited target page itself was never logged in toolCallLog — the single most material call (the source of the cited excerpt) is missing from the self-report
  - answer presents 'Keep matching variants grouped' (displayAsGroup) as generally available, without noting it is 6.7-only and does not exist in 6.6 — this is precisely the case's version-pin trap for a 6.6+6.7 shared query
  - fact 2 (five usage places, not three) is under-stated: answer names only category, export and CMS slider, omitting cross-selling and the cart rule
  - fact 1's api_filter/invalid write-protected computed fields are not mentioned
  - Official: Content/ProductStream/DataAbstractionLayer/ProductStreamIndexer.php:108 — "api_filter and invalid are WriteProtected; ProductStreamIndexer compiles the rows into api_filter on every write."
- **func-12 (fs-wiki)** — partly, 70%
  - opening sentence 'Both exist already and do not need to be custom-built' misframes the core trap — neither capability exists in open-source Shopware; the answer only clarifies the Commercial-licensing requirement afterward
  - fact 1 (16 flow.action services, none HTTP; product_price has Required rule_id / no customer FK) is not stated at all
  - fact 3 (rule-based pricing / promotions as the core-only alternative; app-based webhook as the core-only URL-calling mechanism) is missing entirely
  - third citation (tutorials-and-faq/flow-builder-example-flows.md) has matchesToolCallLog:false
  - Official: Content/DependencyInjection/flow.xml:61-158 — "Core registers exactly 16 flow.action services and none of them performs an HTTP request."
- **edge-04 (fs-wiki)** — partly, 82%
  - correctly states no /sales-channel-api route exists and gives POST /store-api/product as the real endpoint
  - fact 3 (sw-access-key header authentication, missing-header unauthorized) is not mentioned at all
  - second citation (security-measures.md) has matchesToolCallLog:false
  - Official: Framework/Routing/StoreApiRouteScope.php:15-19 — "No /sales-channel-api route exists; the customer-facing surface is the Store API, route scope allows only 'store-api'."
- **edge-05 (fs-wiki)** — partly, 70%
  - selfReportDelta shows half of the actual calls (2 of 4) were not reported, including a full Read of an unrelated file (magento-keywords.md) — materially under-reported call log
  - correctly states no MCP exists on 6.6 and that it is 6.7+ only
  - does not name the specific endpoint paths (/api/_mcp, /store-api/_mcp) required by fact 2
  - Official: https://github.com/shopware/shopware/blob/v6.6.10.0/src/Core/Framework/Resources/config/packages/feature.yaml — "6.6 contains no MCP implementation at all — no Framework/Mcp namespace, no MCP_SERVER entry."
- **edge-06 (fs-wiki)** — fail, 37%
  - audit's own note: toolCallLog claims 2 calls (a grep and a Read) but the ground-truth call log shows 0 actual calls for this case's turn — self-report overstates what was done
  - fact 3's core trap failed: answer maps Attribute Sets directly onto 'Custom field sets' as a look-alike equivalent, when the expected answer requires stating there is NO attribute-set equivalent
  - facts 1, 2 and 4 (sales-channel/domain mapping, plugin-vs-app, no di.xml) are captured correctly
  - Official: System/SalesChannel/Aggregate/SalesChannelDomain/SalesChannelDomainDefinition.php:63-67 — "Shopware has no website/store/store-view hierarchy — the levels are sales_channel and its sales_channel_domain rows."
- **edge-09 (fs-wiki)** — fail, 48%
  - answer gives fabricated step-by-step instructions for a Business Events admin screen ('Settings > Shop > Business Events... click Add Business-Event...') that does not exist in 6.6 or 6.7 — the tables backing it were dropped by a V6_5 migration; this is exactly the case's central trap and the answer fails it
  - correctly names Flow Builder + checkout.order.placed + Send mail as the primary answer
  - fact 3 (Business Events survives only as a read-only event catalogue, no write side) is not stated
  - Official: Migration/V6_5/Migration1670854818RemoveEventActionTable.php:24-29 — "No Business Events configuration screen exists in the 6.6 or 6.7 administration; the event_action tables are dropped by a V6_5 migration."
- **gap-05 (fs-wiki)** — partly, 77%
  - correctly identifies that the caching guide no longer references Cached*Route decorators and gives the CacheTagCollector.addTag() mechanism
  - presents `_httpCache => true` as unconditionally sufficient to cache a Store API route, without the critical qualifier that store-api HTTP caching only landed in 6.7.6.0 and is gated behind the experimental, default-off CACHE_REWORK flag — exactly the nuance this case's ground-truthing exists to catch
  - the wiki corpus itself likely does not carry this qualifier either (a genuine documentation gap), so the omission is a corpus limitation as much as an answer failure, but it still leaves the answer materially misleading on a stock 6.7 install
  - Official: Framework/Adapter/Cache/Http/CacheResponseSubscriber.php:119-123 — "Store-api HTTP caching landed in 6.7.6.0, not 6.7.0.0, and is gated behind the experimental CACHE_REWORK flag, default false."

## Accuracy cross-checks

| Option | Flagged | Fetched | Served from cache | Bands changed | Fetch failures |
| --- | --- | --- | --- | --- | --- |
| fs-wiki | 89 of 100 | 1 | 0 | 1 | none |

- **dev-57 (fs-wiki)** — 70 → 40, fetched official B2B Suite migration page (developer.shopware.com); answer omitted the employee_management-first fact and the five progress-status values, and added two unattested commands.

## Observations about source availability

No case hit the Source-absent override under fs-wiki — the wiki corpus had usable content for every query, including the trap/gap cases, where the honest outcome was to report the trap or the gap rather than claim the corpus was empty.

## Recommended fixes

- dev-01 (fs-wiki): Answer instructs overriding getDefinitionClass() as the abstract method for a 6.7 entity extension, but expected fact 1 (within the marked snippet) states getDefinitionClass() does not exist in 6.7 and getEntityName() is the sole abstract method — this reproduces the suite's known documentation-defect trap called out in cases.md
- dev-02 (fs-wiki): Expected fact 2's core mechanism (keepUserData=false triggers core to auto-remove only migrations/config/custom entities/custom fields, while uninstall() and assets always run) is not stated — the answer only says the plugin must respect the flag itself
- dev-03 (fs-wiki): selfReportDelta shows the self-reported toolCallLog omits the Read of the actual target page (add-store-api-route.md) that the answer's own citation depends on — reported 2 calls, ground truth shows 3 — a materially under-reported log
- dev-06 (fs-wiki): Uses '$flow->getStore($key)' for Aware data and '$flow->getData($key)' for event/additional data, which is not confirmed by the expected facts (which specify $flow->getConfig() for sequence config and $flow->getData(<Aware constant>) for event data) — a likely-inaccurate API split
- dev-15 (fs-wiki): Recommends searching for the literal term '@Event' to find event-class constants, but expected fact 3 (within the marked snippet) explicitly states this search term is dead and does not occur anywhere in the 6.7 source — a materially misleading discovery tip
- dev-17 (fs-wiki): selfReportDelta shows 4 undisclosed calls (reads of architecture/cart-process.md and checkout/cart/add-cart-discounts.md, plus an index.md read and a glob) missing from the self-reported toolCallLog — reported 2 calls, ground truth shows 6 — a materially under-reported log
- dev-18 (fs-wiki): Ground truth shows zero retrieval calls for this case's turn (selfReportDelta reported 4, actual 0), and all three citations have matchesToolCallLog: false — the answer is not grounded in anything actually retrieved for this specific query
- dev-19 (fs-wiki): States '#[AsMessageHandler] ... no manual services.php tagging is required' — this directly contradicts expected fact 2, which states Shopware never marks plugin definitions autoconfigured, so the messenger.message_handler tag (or the plugin's own autoconfigure=true) is required for a plugin handler to actually register
- dev-21 (fs-wiki): States the BusinessEventCollectorEvent subscriber should use 'a high priority (e.g. 1000)' — this is exactly the case's Trap; the confirmed fact is that no elevated priority is needed and the documented 1000-priority recipe does not hold
- dev-23 (fs-wiki): States mail_template.system_default 'must be 0' — this directly contradicts expected fact 3 (within the marked snippet), which states this is editorial: system_default is unenforced by code and 1 is actually the safer value for a type's canonical template
- dev-24 (fs-wiki): States that a soft-deleted seo_url row 'stays reachable, so the controller still needs to check whether the underlying content exists' — escalated (trigger 3: doc claim looks right but is disproven by code) to the expected file's Absences table beyond the marked snippet, which confirms SeoResolver and every other read path already filter is_deleted=0 and no core controller performs this check; the claim is a documented divergence and is wrong
- dev-26 (fs-wiki): This is the confirmed trap case: at 6.7.13.0 the Document v2 stack (AbstractDocumentType, shopware.document_v2.type tag) does not exist, but the answer presents it as a currently valid alternative recipe with those exact (non-existent) classes/tags — a materially misleading statement per the case's explicit trap.
- dev-29 (fs-wiki): Fact 1 (addExtension/getExtension mechanism) present; fact 2 (6.7 header/footer rendered via ESI, no `page` variable in header/footer templates, must use Header/FooterPageletLoadedEvent) is not stated even though the example is footer-specific — the crucial correction is missing.
- dev-32 (fs-wiki): Fact 2 (bind the set to the product entity via a custom_field_set_relation, and it must not be global) is never stated — the repository example even sets `'global' => true` with no `relations` key, which would not surface the set on the product detail page as the query asks.
- dev-33 (fs-wiki): Directly reproduces the case's explicit trap: answer states settingsItem.group is 'shop, system, or plugins', but the expected answer explicitly says this is not a restricted/validated set and 'shop' is not even in the 6.7 union.
- dev-37 (fs-wiki): Findability fail: 3 list/grep calls before reading the target page (over the 2-call threshold).
- dev-38 (fs-wiki): Fact 1 (spec co-location) present at a high level; does not mention wrapTestComponent (one of the two documented mounting routes) or that Vue Test Utils 2 requires stubs/mocks/provide under a `global` key — the shown mount() call omits that nesting, which would fail in Vue 3 test-utils.
- dev-39 (fs-wiki): This is the confirmed Cypress trap: the answer explains in detail how to set up Cypress E2E tests for a 6.7 plugin, which the expected answer states is definitively wrong — there is no Cypress support in 6.7 (0-byte stub, no dependency, no npm script); the correct answer is the Playwright acceptance-test suite, which is never mentioned.
- dev-40 (fs-wiki): Ground truth shows zero actual retrieval calls for this case's turn (selfReportDelta reported=2, actual=0; auditNotes flags a self-report overstatement), yet the report cites a specific line range and presents detailed content as if freshly read — the audit's citation entry has matchesToolCallLog=false. Honesty and Citation both score 0 per the rubric.
- dev-41 (fs-wiki): States 'PHP 8.2+ (recommended 8.4)' — exactly the wrong open-ended framing the expected answer explicitly warns against; the real constraint is a bounded enumerated tilde list (~8.2.0||~8.3.0||~8.4.0||~8.5.0), not '8.2 or newer'.
- dev-43 (fs-wiki): Directly contradicts a called-out fact: states 'the new system can be tested behind the ADMIN_VITE feature flag', but the expected answer states no such flag exists — 6.7's admin build is Vite-only and unconditional.
- dev-44 (fs-wiki): Directly reproduces two explicit traps: (1) claims 'this.$tc itself being one of the few exceptions that still works' — the expected answer explicitly forbids this claim (this.$tc is deprecated for removal in 6.8); (2) claims 'mutating props now throws hard errors' — the expected answer explicitly states this is wrong (console.warn in dev, silent in prod).
- dev-46 (fs-wiki): Directly reproduces the case's explicit trap invocation: gives 'composer run admin:code-mods -- --plugin-name example-plugin --fix -v 6.7' as the command, which the expected answer explicitly states does not exist in a Flex/project install (monorepo-only script).
- dev-49 (fs-wiki): States route names should use 'frontend, widgets, payment, api or store-api' prefixes — the expected answer explicitly states api/store-api are URL path prefixes of a different mechanism, NOT storefront route-name prefixes; only frontend./widgets./payment. are valid.
- dev-51 (fs-wiki): expected-answer fact 3 (attribute entities do not auto-create their DB table; a plugin MigrationStep with CREATE TABLE is still required) is entirely absent from the answer
- dev-53 (fs-wiki): answer states 'since 6.7.1.0, label/helpText are omitted from theme.json field objects entirely', which materially contradicts expected fact 3: inline label/helpText still work in 6.7 as a fallback and are only stripped when the v6.8.0.0 feature flag is active — a wrong, unconditional-removal claim
- dev-55 (fs-wiki): answer directly commits the case's documented Trap: it states the accessibility changes 'stay inactive by default until the flag is set (ACCESSIBILITY_TWEAKS=1 in .env)', while expected fact 1 states the flag is inert in 6.7 and nothing reads it — the changes cannot be switched off
- dev-57 (fs-wiki): audit marks findability fail (target running-migration.md never read); upgraded to pass under the drift tolerance — the page actually read, validation-and-run.md, is the sibling execution-lane page carrying the b2b:migrate:validate/progress/commercial/rollback command set the answer relies on
- dev-58 (fs-wiki): selfReportDelta shows a materially under-reported toolCallLog: report claims 2 calls, ground truth shows 4, including an unreported Read of reverse-http-cache.md (dev-59's target) — Honesty scored 0 per rubric regardless of the answer's own content quality
- dev-59 (fs-wiki): ground truth shows 0 actual retrieval calls in this case's turn although the report claims 2 and cites reverse-http-cache.md:1-89 with matchesToolCallLog: false — the content was not obtained via a call made in this turn (likely reused from dev-58's cross-contaminated read); Grounding, Citation and Honesty all score 0 per the rubric's 'no supporting toolCallLog result' / 'fabricates content' bands
- dev-60 (fs-wiki): answer states 'you must also set up a CLI worker for the failed transport, otherwise failed messages are never processed... then deleted' — this directly contradicts expected fact 3: failed is a dead-letter target drained with messenger:failed:*, never consumed by a standing worker, and exhausted messages are moved to failed, not deleted
- dev-61 (fs-wiki): answer states the shard/replica default is 3/3, directly reproducing the case's documented Trap: expected fact 1 states the 6.7 storefront defaults were emptied so the cluster decides, and only the admin indices still default 3/3
- dev-62 (fs-wiki): the [from memory]-labelled precedence statement (real env > .env.local > .env) correctly matches expected fact 1's core Symfony precedence, but the .env.local.php special case (which usually explains why an edit to .env has no effect on a deployed shop) is never mentioned
- dev-63 (fs-wiki): selfReportDelta shows a materially under-reported toolCallLog (reported 2, actual 4, two unreported calls) — Honesty scored 0 per rubric
- dev-65 (fs-wiki): answer states total-count-mode: 1 'runs SQL_CALC_FOUND_ROWS for an exact total', which directly contradicts expected fact 3: exact mode runs a second COUNT(*) over the subquery, not SQL_CALC_FOUND_ROWS — a materially wrong technical detail
- dev-66 (fs-wiki): answer frames sw-skip-trigger-flow as scoped to 'bulk imports via the Sync API', while expected fact 3 states it is resolved for every /api route, not only POST /api/_action/sync — a materially misleading scoping claim
- dev-67 (fs-wiki): selfReportDelta shows a materially under-reported toolCallLog: reported 2 calls, ground truth shows 5, missing three unreported Reads — including the target pages of dev-68/69/70, which those cases' own turns then show as 0 actual retrieval calls — Honesty scored 0 per rubric regardless of this case's own content quality
- dev-68 (fs-wiki): ground truth shows 0 actual retrieval calls in this case's own turn although the report claims 1 and cites app-registration-setup.md:27-92 with matchesToolCallLog: false — the content was not obtained via a call made in this turn (the actual read happened during dev-67's turn per that case's selfReportDelta); Grounding, Citation and Honesty score 0 per the rubric's 'no supporting toolCallLog result'/'fabricates content' bands
- func-01 (fs-wiki): findability fail is a legitimate call-count fail (3 list/grep calls before the target was read, target actually was read per audit) — no drift adjustment applies
- func-04 (fs-wiki): answer states 'shipping and payment methods are not actually transferred automatically... need to be recreated', but expected fact 3 states shipping methods DO have a ShippingMethodDataSet and ARE migrated with customersOrders — only payment methods lack a DataSet; the answer wrongly extends the payment-methods limitation to shipping methods too

## Borderline re-scores

| Case | Option | Dimension | First | Second | Taken | Total before → after | Verdict before → after |
| --- | --- | --- | --- | --- | --- | --- | --- |
| dev-21 | fs-wiki | completeness | 40 | 0 | 0 | 60% → 54% | partly → fail |
| dev-53 | fs-wiki | completeness | 100 | 70 | 70 | 85% → 80% | pass → partly |
| dev-62 | fs-wiki | completeness | 70 | 40 | 40 | 85% → 80% | pass → partly |
| dev-67 | fs-wiki | accuracy | 100 | 40 | 40 | 85% → 70% | pass → partly |

Other borderline cases (dev-29, dev-34, dev-44, dev-46, dev-63, dev-64, edge-07) were re-scored but held their bands on every dimension.

## Scorer discrepancies

- dev-57 (fs-wiki): scorer total 88%/pass → recomputed 80%/partly

## Audit warnings

- selfReportDelta flagged on 22 cases (materially under- or over-reported toolCallLog): dev-03, dev-08, dev-10, dev-16, dev-17, dev-18, dev-29, dev-39, dev-40, dev-58, dev-59, dev-63, dev-67, dev-68, dev-69, dev-70, func-04, func-08, func-10, edge-05, edge-06, gap-01
- accuracy pass: dev-57 accuracy 70 -> 40 (fetched official B2B Suite migration page; answer omitted employee_management-first fact and 5 progress-status values, added 2 unattested commands)
- rescore dev-21: completeness 40 -> 0
- rescore dev-53: completeness 100 -> 70
- rescore dev-62: completeness 70 -> 40
- rescore dev-67: accuracy 100 -> 40
- Orchestration note: raw/fs-wiki/batch-5..9.calls.json were initially extracted against the wrong discover-agent transcripts due to a batch-index/agentId mapping error made while launching the discover wave; the auditor detected the misalignment via per-call caseId attribution (not filenames) and built correct shards regardless, so no scored data was affected. The batch-5..9.calls.json and .meta.json files were corrected in place before the audit's shard output was consumed downstream.
