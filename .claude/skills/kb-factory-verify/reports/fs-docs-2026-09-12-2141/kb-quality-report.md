# KB quality report — fs-docs-2026-09-12-2141

## Run

| | |
| --- | --- |
| Run | `fs-docs-2026-09-12-2141` (`fs-docs`) |
| Options | fs-docs |
| Corpus | docs — fingerprint: developer 3a7f3af9 (2026-09-11T18:13:30+02:00), merchant fd093eda (2026-09-11T03:37:21Z) |
| Probe | developer/index.md present, merchant/index.md present |
| Model | inherited (not pinned) |
| Generated | 2026-09-13T06:00:30Z |
| Cases run | 100 of 100 (all) |
| Yardstick | cases.md ef932d8e, scoring-rubric.md 06199943, scorer-brief.md e256f8be, auditor-brief.md 4bd00bc6, accuracy-brief.md 9009d748 |
| Execution | discover batches of 10, scorer shards of 25 (batched) |
| Skill | kb-factory-verify |

## Run cost

| Option | Agents | Tokens | Tool calls | Summed agent time | Usage complete |
| --- | --- | --- | --- | --- | --- |
| fs-docs | 17 (10 discover, 1 audit, 4 score, 1 accuracy, 1 rescore) | ~38.4M (cache-inclusive, summed across agent usage blocks) | n/a (per-call tool-call counts not exposed in agent usage blocks) | n/a | no — per-agent tool-call and duration figures were not exposed by the harness for named/teammate agent spawns (structural limitation noted in the skill); token totals are the sum of each agent completion notification |

Wall-clock duration of the run: 29929s (~499 minutes).

## Comparison

| Option | Access | Corpus | Overall | Status | Developer | Functional | Findable | Edge passed | Gap confirmed | Pass / partly / fail / unavailable / unscored | Weakest dimension |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| fs-docs | fs | docs | 83% | Not ready | 82.1% | 82.3% | 76 of 82 | 5 of 9 | 4 of 7 | 52 / 39 / 7 / 1 / 1 | accuracy |

Single-option run — no ranking or delta to compute (needs a second option in the same run, or use `compare`).

## Dimension heatmap

| Dimension | Weight | fs-docs |
| --- | --- | --- |
| Grounding & Relevance | 25 | 95.8 |
| Accuracy vs. Expected Answer | 25 | 64.9 |
| Completeness | 15 | 71.1 |
| Citation & Traceability | 10 | 97.1 |
| Honesty | 15 | 94.9 |
| Actionability | 10 | 84.2 |

### By area

| Area | Cases | fs-docs average |
| --- | --- | --- |
| Admin API | 3 | 83% |
| Admin migration (Vue 3 / Vite / Pinia / Meteor) | 4 | 65.3% |
| Administration | 4 | 80.8% |
| App system | 5 | 82.4% |
| Checkout & Cart | 2 | 82% |
| Config & CLI | 5 | 85.8% |
| Content | 1 | 88% |
| Content (CMS/mail/SEO/media/sitemap) | 2 | 82.5% |
| Core breaking changes | 3 | 87.3% |
| DAL | 7 | 83.3% |
| Events | 6 | 83.3% |
| Gap | 7 | 91.3% |
| Hosting & ops | 5 | 74.6% |
| Merchant | 12 | 82.3% |
| Orders | 2 | 85% |
| Payment & Shipping | 1 | 70% |
| Platform upgrade | 2 | 100% |
| Plugin fundamentals | 1 | 88% |
| Services & DI | 3 | 72.7% |
| Store API & headless | 1 | 100% |
| Storefront | 9 | 86.1% |
| Testing | 3 | 69.7% |
| Theme | 2 | 94% |
| Trap | 9 | 85% |

## Verdict grid

| Case | Category | Area | fs-docs |
| --- | --- | --- | --- |
| dev-01 | dev | DAL | 66% partly ✗ |
| dev-02 | dev | Plugin fundamentals | 88% pass ✓ |
| dev-03 | dev | Store API & headless | 100% pass ✓ |
| dev-04 | dev | Content | 88% pass ✓ |
| dev-05 | dev | Theme | 100% pass ✓ |
| dev-06 | dev | Events | 77% partly ✓ |
| dev-07 | dev | DAL | 80% partly ✓ |
| dev-08 | dev | DAL | 100% pass ✓ |
| dev-09 | dev | DAL | 88% pass ✓ |
| dev-10 | dev | DAL | 77% partly ✓ |
| dev-11 | dev | Services & DI | 85% pass ✓ |
| dev-12 | dev | Services & DI | 45% fail – |
| dev-13 | dev | Services & DI | 88% pass ✓ |
| dev-14 | dev | Events | 100% pass ✓ |
| dev-15 | dev | Events | 73% partly ✓ |
| dev-16 | dev | Orders | 100% pass ✓ |
| dev-17 | dev | Checkout & Cart | 100% pass ✓ |
| dev-18 | dev | Checkout & Cart | 64% partly ✓ |
| dev-19 | dev | Events | 77% partly ✓ |
| dev-20 | dev | Events | 100% pass ✓ |
| dev-21 | dev | Events | 73% partly ✓ |
| dev-22 | dev | Config & CLI | 77% partly ✓ |
| dev-23 | dev | Content (CMS/mail/SEO/media/sitemap) | 80% partly ✓ |
| dev-24 | dev | Content (CMS/mail/SEO/media/sitemap) | 85% pass ✓ |
| dev-25 | dev | Config & CLI | 100% pass ✓ |
| dev-26 | dev | Orders | 70% partly ✓ |
| dev-27 | dev | Storefront | 100% pass ✓ |
| dev-28 | dev | Storefront | 100% pass ✓ |
| dev-29 | dev | Storefront | 88% pass ✓ |
| dev-30 | dev | Storefront | 100% pass ✓ |
| dev-31 | dev | Storefront | 65% partly ✗ |
| dev-32 | dev | DAL | 77% partly ✓ |
| dev-33 | dev | Administration | 46% fail ✓ |
| dev-34 | dev | Administration | 100% pass ✓ |
| dev-35 | dev | Administration | 85% pass ✓ |
| dev-36 | dev | Administration | 92% pass ✓ |
| dev-37 | dev | Testing | 85% pass ✓ |
| dev-38 | dev | Testing | 62% partly ✓ |
| dev-39 | dev | Testing | 62% partly ✗ |
| dev-40 | dev | Platform upgrade | 100% pass ✓ |
| dev-41 | dev | Hosting & ops | 52% fail ✓ |
| dev-42 | dev | Config & CLI | 92% pass ✓ |
| dev-43 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 70% partly ✓ |
| dev-44 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 57% fail ✓ |
| dev-45 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 82% partly ✓ |
| dev-46 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 52% fail ✓ |
| dev-47 | dev | Payment & Shipping | 70% partly ✓ |
| dev-48 | dev | Storefront | 92% pass ✓ |
| dev-49 | dev | Core breaking changes | 70% partly ✓ |
| dev-50 | dev | Core breaking changes | 100% pass ✓ |
| dev-51 | dev | DAL | 95% pass ✓ |
| dev-52 | dev | Core breaking changes | 92% pass ✓ |
| dev-53 | dev | Theme | 88% pass ✓ |
| dev-54 | dev | Storefront | 92% pass ✗ |
| dev-55 | dev | Storefront | 46% fail ✓ |
| dev-56 | dev | Storefront | 92% pass ✓ |
| dev-57 | dev | Platform upgrade | 100% pass ✓ |
| dev-58 | dev | Hosting & ops | 95% pass ✓ |
| dev-59 | dev | Hosting & ops | 80% partly ✓ |
| dev-60 | dev | Hosting & ops | 73% partly ✓ |
| dev-61 | dev | Hosting & ops | 73% partly ✓ |
| dev-62 | dev | Config & CLI | 80% partly ✓ |
| dev-63 | dev | Config & CLI | 80% partly ✗ |
| dev-64 | dev | Admin API | 77% partly ✓ |
| dev-65 | dev | Admin API | 80% partly ✓ |
| dev-66 | dev | Admin API | 92% pass ✓ |
| dev-67 | dev | App system | 92% pass ✓ |
| dev-68 | dev | App system | 92% pass ✓ |
| dev-69 | dev | App system | 88% pass ✓ |
| dev-70 | dev | App system | 67% partly ✓ |
| dev-71 | dev | App system | 73% partly ✓ |
| func-01 | func | Merchant | 88% pass ✓ |
| func-02 | func | Merchant | 88% pass ✓ |
| func-03 | func | Merchant | 100% pass ✓ |
| func-04 | func | Merchant | 77% partly ✓ |
| func-05 | func | Merchant | 73% partly ✓ |
| func-06 | func | Merchant | 76% partly ✓ |
| func-07 | func | Merchant | 80% partly ✓ |
| func-08 | func | Merchant | 77% partly ✓ |
| func-09 | func | Merchant | 88% pass ✓ |
| func-10 | func | Merchant | 67% partly ✓ |
| func-11 | func | Merchant | 88% pass ✓ |
| func-12 | func | Merchant | 85% pass ✗ |
| edge-01 | edge | Trap | 100% pass – |
| edge-02 | edge | Trap | 100% pass – |
| edge-03 | edge | Trap | 100% pass – |
| edge-04 | edge | Trap | 65% partly – |
| edge-05 | edge | Trap | 95% pass – |
| edge-06 | edge | Trap | 55% fail – |
| edge-07 | edge | Trap | 70% partly – |
| edge-08 | edge | Trap | 100% pass – |
| edge-09 | edge | Trap | 80% partly – |
| gap-01 | gap | Gap | 77% partly – |
| gap-02 | gap | Gap | 85% unavailable – |
| gap-03 | gap | Gap | — unscored |
| gap-04 | gap | Gap | 100% pass – |
| gap-05 | gap | Gap | 80% partly – |
| gap-06 | gap | Gap | 100% pass – |
| gap-07 | gap | Gap | 97% pass – |
| gap-08 | gap | Gap | 100% pass – |

## Requests and responses

### fs-docs

| Case | Page reached | Findability | Memory claims | Honesty | Verdict |
| --- | --- | --- | --- | --- | --- |
| dev-01 | developer/guides/plugins/plugins/framework/data-handling/add-complex-data-to-existing-entities.md = target | fail (1+1) | 0 | 100 | partly |
| dev-02 | developer/guides/plugins/plugins/plugin-fundamentals/plugin-lifecycle.md = target | pass (0+1) | 0 | 100 | pass |
| dev-03 | developer/guides/plugins/plugins/framework/store-api/add-store-api-route.md = target | pass (0+1) | 0 | 100 | pass |
| dev-04 | developer/guides/plugins/plugins/content/cms/add-cms-element.md = target | pass (0+1) | 0 | 100 | pass |
| dev-05 | developer/guides/plugins/themes/inheritance/add-theme-inheritance.md = target | pass (0+1) | 0 | 100 | pass |
| dev-06 | developer/guides/plugins/plugins/framework/flow/add-flow-builder-action.md = target | pass (0+1) | 0 | 100 | partly |
| dev-07 | developer/guides/plugins/plugins/framework/data-handling/add-custom-complex-data.md = target | pass (0+1) | 0 | 100 | partly |
| dev-08 | developer/guides/plugins/plugins/framework/data-handling/reading-data.md = target | pass (0+1) | 0 | 100 | pass |
| dev-09 | developer/guides/plugins/plugins/framework/data-handling/add-data-translations.md = target | pass (0+1) | 0 | 100 | pass |
| dev-10 | developer/guides/plugins/plugins/framework/data-handling/add-data-indexer.md = target | pass (0+1) | 0 | 100 | partly |
| dev-11 | developer/guides/plugins/plugins/services/add-custom-service.md ≠ target (developer/guides/plugins/plugins/services/dependency-injection.md) | pass (1+1) | 0 | 100 | pass |
| dev-12 | developer/resources/references/adr/2026-07-30-migrate-container-configuration-from-xml-to-php.md (target: none) | n/a (0+1) | 1 | 0 (under-reported/fabricated) | fail |
| dev-13 | developer/guides/plugins/plugins/services/adjusting-service.md = target | pass (1+1) | 0 | 100 | pass |
| dev-14 | developer/guides/plugins/plugins/framework/event/listening-to-events.md = target | pass (1+1) | 0 | 100 | pass |
| dev-15 | developer/guides/plugins/plugins/framework/event/finding-events.md = target | pass (1+1) | 0 | 100 | partly |
| dev-16 | developer/guides/plugins/plugins/checkout/order/listen-to-order-changes.md = target | pass (1+1) | 0 | 100 | pass |
| dev-17 | developer/guides/plugins/plugins/checkout/cart/change-price-of-item.md = target | pass (1+1) | 0 | 100 | pass |
| dev-18 | developer/guides/plugins/plugins/checkout/cart/add-cart-processor-collector.md = target | pass (1+1) | 0 | 100 | partly |
| dev-19 | developer/guides/plugins/plugins/framework/message-queue/add-message-handler.md = target | pass (1+1) | 0 | 100 | partly |
| dev-20 | developer/guides/plugins/plugins/framework/rule/add-custom-rules.md = target | pass (1+1) | 0 | 100 | pass |
| dev-21 | developer/guides/plugins/plugins/framework/flow/add-flow-builder-trigger.md = target | pass (1+1) | 0 | 100 | partly |
| dev-22 | developer/guides/plugins/plugins/plugin-fundamentals/add-plugin-configuration.md = target | pass (1+1) | 0 | 100 | partly |
| dev-23 | developer/guides/plugins/plugins/content/mail/add-mail-template.md = target | pass (1+1) | 0 | 100 | partly |
| dev-24 | developer/guides/plugins/plugins/content/seo/add-custom-seo-url.md = target | pass (1+1) | 0 | 100 | pass |
| dev-25 | developer/guides/plugins/plugins/plugin-fundamentals/add-custom-commands.md = target | pass (0+1) | 0 | 100 | pass |
| dev-26 | developer/guides/plugins/plugins/checkout/documents/legacy/add-custom-document-type.md ≠ target (developer/guides/plugins/plugins/checkout/documents/v2/add-a-document-type.md) | pass (0+1) | 0 | 100 | partly |
| dev-27 | developer/guides/plugins/plugins/storefront/templates/customize-templates.md = target | pass (1+1) | 0 | 100 | pass |
| dev-28 | developer/guides/plugins/plugins/storefront/javascript/override-existing-javascript.md = target | pass (1+1) | 0 | 100 | pass |
| dev-29 | developer/guides/plugins/plugins/storefront/controllers/add-data-to-storefront-page.md = target | pass (1+1) | 0 | 100 | pass |
| dev-30 | developer/guides/plugins/plugins/storefront/howto/add-listing-filters.md = target | pass (1+1) | 0 | 100 | pass |
| dev-31 | developer/guides/plugins/plugins/storefront/styling/add-scss-variables-via-subscriber.md ≠ target (developer/guides/plugins/plugins/storefront/styling/add-scss-variables.md) | fail (0+1) | 0 | 100 | partly |
| dev-32 | developer/guides/plugins/plugins/framework/custom-field/add-custom-field.md = target | pass (1+1) | 0 | 100 | partly |
| dev-33 | developer/guides/plugins/plugins/administration/module-component-management/add-custom-module.md = target | pass (1+1) | 0 | 100 | fail |
| dev-34 | developer/guides/plugins/plugins/administration/module-component-management/customizing-components.md = target | pass (1+1) | 0 | 100 | pass |
| dev-35 | developer/guides/plugins/plugins/administration/data-handling-processing/using-data-handling.md = target | pass (1+1) | 0 | 100 | pass |
| dev-36 | developer/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.md = target | pass (1+1) | 0 | 100 | pass |
| dev-37 | developer/guides/development/testing/unit/php-unit.md = target | pass (1+1) | 0 | 100 | pass |
| dev-38 | developer/guides/development/testing/unit/jest-admin.md = target | pass (1+1) | 0 | 100 | partly |
| dev-39 | developer/guides/development/testing/index.md ≠ target (developer/guides/development/testing/e2e-playwright/install-configure.md) | fail (0+1) | 0 | 100 | partly |
| dev-40 | developer/guides/upgrades-migrations/upgrade-shopware.md = target | pass (1+1) | 0 | 100 | pass |
| dev-41 | developer/guides/hosting/index.md = target | pass (1+1) | 0 | 100 | fail |
| dev-42 | developer/products/tools/cli/project-commands/upgrade.md = target | pass (1+1) | 0 | 100 | pass |
| dev-43 | developer/guides/upgrades-migrations/administration/vite.md = target | pass (1+1) | 0 | 100 | partly |
| dev-44 | developer/guides/upgrades-migrations/administration/vue3.md = target | pass (1+1) | 0 | 100 | fail |
| dev-45 | developer/guides/upgrades-migrations/administration/pinia.md = target | pass (0+1) | 0 | 100 | partly |
| dev-46 | developer/guides/upgrades-migrations/administration/meteor-components.md = target | pass (1+1) | 0 | 100 | fail |
| dev-47 | developer/guides/plugins/plugins/checkout/payment/add-payment-plugin.md = target | pass (1+1) | 0 | 100 | partly |
| dev-48 | developer/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md = target | pass (1+1) | 0 | 100 | pass |
| dev-49 | developer/guides/plugins/plugins/storefront/controllers/add-custom-controller.md = target | pass (1+1) | 0 | 100 | partly |
| dev-50 | developer/guides/plugins/plugins/plugin-fundamentals/add-scheduled-task.md = target | pass (1+1) | 0 | 100 | pass |
| dev-51 | developer/guides/plugins/plugins/framework/data-handling/entities-via-attributes.md = target | pass (1+1) | 0 | 100 | pass |
| dev-52 | developer/guides/plugins/plugins/database/database-migrations.md = target | pass (1+1) | 0 | 100 | pass |
| dev-53 | developer/guides/plugins/themes/configuration/theme-configuration.md = target | pass (1+1) | 0 | 100 | pass |
| dev-54 | developer/guides/plugins/plugins/storefront/advanced/add-cookie-to-manager.md = target | fail (0+1) | 0 | 100 | pass |
| dev-55 | developer/guides/development/accessibility/storefront-accessibility.md = target | pass (1+1) | 0 | 100 | fail |
| dev-56 | developer/guides/plugins/plugins/storefront/templates/customize-header-footer.md = target | pass (1+1) | 0 | 100 | pass |
| dev-57 | developer/products/extensions/b2b-suite-migration/index.md ≠ target (developer/products/extensions/b2b-suite-migration/execution/running-migration.md) | pass (1+1) | 0 | 100 | pass |
| dev-58 | developer/guides/hosting/infrastructure/redis.md = target | pass (1+1) | 0 | 100 | pass |
| dev-59 | developer/guides/hosting/infrastructure/reverse-http-cache.md = target | pass (1+1) | 0 | 100 | partly |
| dev-60 | developer/guides/hosting/infrastructure/message-queue.md = target | pass (1+1) | 0 | 100 | partly |
| dev-61 | developer/guides/hosting/infrastructure/elasticsearch/elasticsearch-setup.md = target | pass (1+1) | 0 | 100 | partly |
| dev-62 | developer/guides/hosting/configurations/shopware/index.md ≠ target (developer/guides/hosting/configurations/shopware/environment-variables.md) | pass (1+1) | 0 | 100 | partly |
| dev-63 | developer/guides/plugins/plugins/database/database-migrations.md ≠ target (developer/resources/references/core-reference/commands-reference.md) | fail (0+1) | 0 | 100 | partly |
| dev-64 | developer/guides/development/integrations-api/index.md ≠ target (developer/guides/development/integrations-api/auth-api-requests.md) | pass (1+1) | 0 | 100 | partly |
| dev-65 | developer/guides/development/integrations-api/search-criteria.md = target | pass (1+1) | 0 | 100 | partly |
| dev-66 | developer/guides/development/integrations-api/request-headers.md = target | pass (1+1) | 0 | 100 | pass |
| dev-67 | developer/guides/plugins/apps/app-base-guide.md = target | pass (1+1) | 0 | 100 | pass |
| dev-68 | developer/guides/plugins/apps/lifecycle/app-registration-setup.md = target | pass (1+1) | 0 | 100 | pass |
| dev-69 | developer/guides/plugins/apps/lifecycle/webhook.md = target | pass (1+1) | 0 | 100 | pass |
| dev-70 | developer/guides/plugins/apps/checkout/payment.md = target | pass (1+1) | 0 | 100 | partly |
| dev-71 | developer/guides/plugins/apps/custom-data/custom-entities.md = target | pass (1+1) | 0 | 100 | partly |
| func-01 | merchant/content/en/shopware-6/catalogues/products/v1-4-2-0.md = target | pass (1+1) | 0 | 100 | pass |
| func-02 | merchant/content/en/shopware-6/settings/rules/v1-6-1-0.md = target | pass (1+1) | 0 | 100 | pass |
| func-03 | merchant/content/en/shopware-6/marketing/promotions/v1-7-0-0.md = target | pass (1+1) | 0 | 100 | pass |
| func-04 | merchant/content/en/shopware-6/migration-en/what-is-migrated/v1-1-0-0.md = target | pass (1+1) | 0 | 100 | partly |
| func-05 | merchant/content/en/shopware-6/settings/saleschannel/v1-5-2-0.md = target | pass (1+1) | 0 | 100 | partly |
| func-06 | merchant/content/en/shopware-6/settings/Flow-Builder/v1-3-0-1.md = target | pass (1+1) | 0 | 100 | partly |
| func-07 | merchant/content/en/shopware-6/shopware-en/settings/importexport/v1-4-0-0.md = target | pass (1+1) | 0 | 100 | partly |
| func-08 | merchant/content/en/shopware-6/settings/custom-fields/v1-3-2-0.md = target | pass (1+1) | 0 | 100 | partly |
| func-09 | merchant/content/en/shopware-6/settings/Paymentmethods/v1-4-0-0.md = target | pass (1+1) | 0 | 100 | pass |
| func-10 | merchant/content/en/shopware-6/shopware-6-de/Catalogues/Dynamicproductgroups/v1-3-0-0.md = target | pass (1+1) | 0 | 100 | partly |
| func-11 | merchant/content/en/shopware-6/settings/system/integrationen/v1-1-0.md = target | pass (1+1) | 0 | 100 | pass |
| func-12 | merchant/content/en/shopware-6/extensions/customer-specific-pricing/v1-0-0-1.md ≠ target (merchant/content/en/shopware-6/extensions/shopware-commercial/v1-1-0-0.md) | fail (0+1) | 0 | 100 | pass |
| edge-01 | developer/concepts/api/index.md (target: none) | n/a (0+1) | 0 | 100 | pass |
| edge-02 | developer/guides/plugins/plugins/services/dependency-injection.md (target: none) | n/a (0+1) | 0 | 100 | pass |
| edge-03 | developer/concepts/framework/data-abstraction-layer.md (target: none) | n/a (0+1) | 0 | 100 | pass |
| edge-04 | developer/guides/development/integrations-api/index.md (target: none) | n/a (0+1) | 0 | 0 (under-reported/fabricated) | partly |
| edge-05 | developer/products/tools/mcp-server/getting-started.md ≠ target (developer/products/tools/mcp-server/intro.md) | n/a (0+1) | 0 | 100 | pass |
| edge-06 | merchant/content/en/shopware-6/migration-en/magento-keywords/v1-1-0-0.md = target | n/a (1+1) | 1 | 0 (under-reported/fabricated) | fail |
| edge-07 | developer/products/paas/shopware/composable-frontends/index.md (target: none) | n/a (0+1) | 0 | 0 (under-reported/fabricated) | partly |
| edge-08 | developer/guides/plugins/plugins/framework/data-handling/reading-data.md (target: none) | n/a (0+1) | 0 | 100 | pass |
| edge-09 | merchant/content/en/shopware-6/settings/Business-Events/v1-0-0.md = target | n/a (1+1) | 0 | 100 | partly |
| gap-01 | developer/guides/plugins/plugins/framework/store-api/add-store-api-route.md (target: none) | n/a (0+1) | 0 | 0 (under-reported/fabricated) | partly |
| gap-02 | developer/products/tools/cli/project-commands/helper-commands.md (target: none) | n/a (0+1) | 0 | 100 | unavailable |
| gap-03 | — | — | — | — | unscored (Raw report failed JSON.parse (unescaped control character in the query string) per the auditor; no reliable answer/citations/toolCallLog could be extracted.) |
| gap-04 | developer/resources/guidelines/code/backward-compatibility.md (target: none) | n/a (0+1) | 0 | 100 | pass |
| gap-05 | developer/resources/references/adr/2025-09-15-store-api-cache-strategy.md (target: none) | n/a (0+1) | 0 | 100 | partly |
| gap-06 | developer/guides/plugins/plugins/checkout/payment/add-payment-plugin.md (target: none) | n/a (0+1) | 0 | 100 | pass |
| gap-07 | developer/products/extensions/migration-assistant/concept/media-processing.md (target: none) | n/a (0+1) | 0 | 100 | pass |
| gap-08 | developer/products/paas/shopware/composable-frontends/index.md (target: none) | n/a (0+1) | 0 | 100 | pass |

_Full per-call detail (tool sequence, citations, excerpts) lives in raw/fs-docs/<case-id>.json and derived/fs-docs/shard-*.json; this table summarizes rather than restates it, per the skill's token budget._

## Scores by case

### fs-docs

| Case | Grounding | Accuracy | Completeness | Citation | Honesty | Actionability | Points | Total | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dev-01 | 100 | 0 | 40 | 100 | 100 | 100 | 25+0+6+10+15+10 | 66% | partly |
| dev-02 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| dev-03 | 100 | 100 | 100 | 100 | 100 | 100 | 25+25+15+10+15+10 | 100% | pass |
| dev-04 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| dev-05 | 100 | 100 | 100 | 100 | 100 | 100 | 25+25+15+10+15+10 | 100% | pass |
| dev-06 | 100 | 40 | 70 | 100 | 100 | 70 | 25+10+10.5+10+15+7 | 77% | partly |
| dev-07 | 100 | 40 | 70 | 100 | 100 | 100 | 25+10+10.5+10+15+10 | 80% | partly |
| dev-08 | 100 | 100 | 100 | 100 | 100 | 100 | 25+25+15+10+15+10 | 100% | pass |
| dev-09 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| dev-10 | 100 | 40 | 70 | 100 | 100 | 70 | 25+10+10.5+10+15+7 | 77% | partly |
| dev-11 | 100 | 40 | 100 | 100 | 100 | 100 | 25+10+15+10+15+10 | 85% | pass |
| dev-12 | 40 | 70 | 70 | 0 | 0 | 70 | 10+17.5+10.5+0+0+7 | 45% | fail |
| dev-13 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| dev-14 | 100 | 100 | 100 | 100 | 100 | 100 | 25+25+15+10+15+10 | 100% | pass |
| dev-15 | 100 | 40 | 40 | 100 | 100 | 70 | 25+10+6+10+15+7 | 73% | partly |
| dev-16 | 100 | 100 | 100 | 100 | 100 | 100 | 25+25+15+10+15+10 | 100% | pass |
| dev-17 | 100 | 100 | 100 | 100 | 100 | 100 | 25+25+15+10+15+10 | 100% | pass |
| dev-18 | 100 | 0 | 70 | 100 | 100 | 40 | 25+0+10.5+10+15+4 | 64% | partly |
| dev-19 | 100 | 40 | 70 | 100 | 100 | 70 | 25+10+10.5+10+15+7 | 77% | partly |
| dev-20 | 100 | 100 | 100 | 100 | 100 | 100 | 25+25+15+10+15+10 | 100% | pass |
| dev-21 | 100 | 40 | 40 | 100 | 100 | 70 | 25+10+6+10+15+7 | 73% | partly |
| dev-22 | 100 | 40 | 70 | 100 | 100 | 70 | 25+10+10.5+10+15+7 | 77% | partly |
| dev-23 | 100 | 70 | 40 | 100 | 100 | 70 | 25+17.5+6+10+15+7 | 80% | partly |
| dev-24 | 100 | 70 | 70 | 100 | 100 | 70 | 25+17.5+10.5+10+15+7 | 85% | pass |
| dev-25 | 100 | 100 | 100 | 100 | 100 | 100 | 25+25+15+10+15+10 | 100% | pass |
| dev-26 | 70 | 40 | 70 | 100 | 100 | 70 | 17.5+10+10.5+10+15+7 | 70% | partly |
| dev-27 | 100 | 100 | 100 | 100 | 100 | 100 | 25+25+15+10+15+10 | 100% | pass |
| dev-28 | 100 | 100 | 100 | 100 | 100 | 100 | 25+25+15+10+15+10 | 100% | pass |
| dev-29 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| dev-30 | 100 | 100 | 100 | 100 | 100 | 100 | 25+25+15+10+15+10 | 100% | pass |
| dev-31 | 70 | 40 | 40 | 100 | 100 | 70 | 17.5+10+6+10+15+7 | 65% | partly |
| dev-32 | 100 | 40 | 70 | 100 | 100 | 70 | 25+10+10.5+10+15+7 | 77% | partly |
| dev-33 | 70 | 0 | 0 | 100 | 100 | 40 | 17.5+0+0+10+15+4 | 46% | fail |
| dev-34 | 100 | 100 | 100 | 100 | 100 | 100 | 25+25+15+10+15+10 | 100% | pass |
| dev-35 | 100 | 70 | 70 | 100 | 100 | 70 | 25+17.5+10.5+10+15+7 | 85% | pass |
| dev-36 | 100 | 70 | 100 | 100 | 100 | 100 | 25+17.5+15+10+15+10 | 92% | pass |
| dev-37 | 100 | 70 | 70 | 70 | 100 | 100 | 25+17.5+10.5+7+15+10 | 85% | pass |
| dev-38 | 70 | 40 | 40 | 100 | 100 | 40 | 17.5+10+6+10+15+4 | 62% | partly |
| dev-39 | 70 | 40 | 40 | 100 | 100 | 40 | 17.5+10+6+10+15+4 | 62% | partly |
| dev-40 | 100 | 100 | 100 | 100 | 100 | 100 | 25+25+15+10+15+10 | 100% | pass |
| dev-41 | 70 | 0 | 40 | 100 | 100 | 40 | 17.5+0+6+10+15+4 | 52% | fail |
| dev-42 | 100 | 100 | 70 | 100 | 100 | 70 | 25+25+10.5+10+15+7 | 92% | pass |
| dev-43 | 70 | 40 | 70 | 100 | 100 | 70 | 17.5+10+10.5+10+15+7 | 70% | partly |
| dev-44 | 70 | 0 | 70 | 100 | 100 | 40 | 17.5+0+10.5+10+15+4 | 57% | fail |
| dev-45 | 100 | 70 | 70 | 70 | 100 | 70 | 25+17.5+10.5+7+15+7 | 82% | partly |
| dev-46 | 70 | 0 | 40 | 100 | 100 | 40 | 17.5+0+6+10+15+4 | 52% | fail |
| dev-47 | 70 | 40 | 70 | 100 | 100 | 70 | 17.5+10+10.5+10+15+7 | 70% | partly |
| dev-48 | 100 | 100 | 70 | 100 | 100 | 70 | 25+25+10.5+10+15+7 | 92% | pass |
| dev-49 | 70 | 40 | 70 | 100 | 100 | 70 | 17.5+10+10.5+10+15+7 | 70% | partly |
| dev-50 | 100 | 100 | 100 | 100 | 100 | 100 | 25+25+15+10+15+10 | 100% | pass |
| dev-51 | 100 | 100 | 70 | 100 | 100 | 100 | 25+25+10.5+10+15+10 | 95% | pass |
| dev-52 | 100 | 70 | 100 | 100 | 100 | 100 | 25+17.5+15+10+15+10 | 92% | pass |
| dev-53 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| dev-54 | 100 | 70 | 100 | 100 | 100 | 100 | 25+17.5+15+10+15+10 | 92% | pass |
| dev-55 | 70 | 0 | 0 | 100 | 100 | 40 | 17.5+0+0+10+15+4 | 46% | fail |
| dev-56 | 100 | 70 | 100 | 100 | 100 | 100 | 25+17.5+15+10+15+10 | 92% | pass |
| dev-57 | 100 | 100 | 100 | 100 | 100 | 100 | 25+25+15+10+15+10 | 100% | pass |
| dev-58 | 100 | 100 | 70 | 100 | 100 | 100 | 25+25+10.5+10+15+10 | 95% | pass |
| dev-59 | 100 | 40 | 70 | 100 | 100 | 100 | 25+10+10.5+10+15+10 | 80% | partly |
| dev-60 | 100 | 40 | 40 | 100 | 100 | 70 | 25+10+6+10+15+7 | 73% | partly |
| dev-61 | 100 | 40 | 40 | 100 | 100 | 70 | 25+10+6+10+15+7 | 73% | partly |
| dev-62 | 100 | 70 | 40 | 100 | 100 | 70 | 25+17.5+6+10+15+7 | 80% | partly |
| dev-63 | 100 | 70 | 40 | 100 | 100 | 70 | 25+17.5+6+10+15+7 | 80% | partly |
| dev-64 | 100 | 40 | 70 | 100 | 100 | 70 | 25+10+10.5+10+15+7 | 77% | partly |
| dev-65 | 100 | 40 | 70 | 100 | 100 | 100 | 25+10+10.5+10+15+10 | 80% | partly |
| dev-66 | 100 | 70 | 100 | 100 | 100 | 100 | 25+17.5+15+10+15+10 | 92% | pass |
| dev-67 | 100 | 70 | 100 | 100 | 100 | 100 | 25+17.5+15+10+15+10 | 92% | pass |
| dev-68 | 100 | 70 | 100 | 100 | 100 | 100 | 25+17.5+15+10+15+10 | 92% | pass |
| dev-69 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| dev-70 | 100 | 0 | 70 | 100 | 100 | 70 | 25+0+10.5+10+15+7 | 67% | partly |
| dev-71 | 100 | 40 | 40 | 100 | 100 | 70 | 25+10+6+10+15+7 | 73% | partly |
| func-01 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| func-02 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| func-03 | 100 | 100 | 100 | 100 | 100 | 100 | 25+25+15+10+15+10 | 100% | pass |
| func-04 | 100 | 40 | 70 | 100 | 100 | 70 | 25+10+10.5+10+15+7 | 77% | partly |
| func-05 | 100 | 40 | 40 | 100 | 100 | 70 | 25+10+6+10+15+7 | 73% | partly |
| func-06 | 100 | 40 | 40 | 100 | 100 | 100 | 25+10+6+10+15+10 | 76% | partly |
| func-07 | 100 | 40 | 70 | 100 | 100 | 100 | 25+10+10.5+10+15+10 | 80% | partly |
| func-08 | 100 | 40 | 70 | 100 | 100 | 70 | 25+10+10.5+10+15+7 | 77% | partly |
| func-09 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| func-10 | 100 | 40 | 0 | 100 | 100 | 70 | 25+10+0+10+15+7 | 67% | partly |
| func-11 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| func-12 | 100 | 70 | 70 | 100 | 100 | 70 | 25+17.5+10.5+10+15+7 | 85% | pass |
| edge-01 | 100 | 100 | 100 | 100 | 100 | 100 | 25+25+15+10+15+10 | 100% | pass |
| edge-02 | 100 | 100 | 100 | 100 | 100 | 100 | 25+25+15+10+15+10 | 100% | pass |
| edge-03 | 100 | 100 | 100 | 100 | 100 | 100 | 25+25+15+10+15+10 | 100% | pass |
| edge-04 | 100 | 70 | 40 | 100 | 0 | 70 | 25+17.5+6+10+0+7 | 65% | partly |
| edge-05 | 100 | 100 | 70 | 100 | 100 | 100 | 25+25+10.5+10+15+10 | 95% | pass |
| edge-06 | 100 | 40 | 40 | 70 | 0 | 70 | 25+10+6+7+0+7 | 55% | fail |
| edge-07 | 100 | 100 | 70 | 0 | 0 | 100 | 25+25+10.5+0+0+10 | 70% | partly |
| edge-08 | 100 | 100 | 100 | 100 | 100 | 100 | 25+25+15+10+15+10 | 100% | pass |
| edge-09 | 100 | 40 | 70 | 100 | 100 | 100 | 25+10+10.5+10+15+10 | 80% | partly |
| gap-01 | 100 | 100 | 70 | 100 | 0 | 70 | 25+25+10.5+10+0+7 | 77% | partly |
| gap-02 | 100 | 100 | 0 | 100 | 100 | 100 | 25+25+0+10+15+10 | 85% | unavailable |
| gap-03 | — | — | — | — | — | — | — | — | unscored |
| gap-04 | 100 | 100 | 100 | 100 | 100 | 100 | 25+25+15+10+15+10 | 100% | pass |
| gap-05 | 100 | 70 | 40 | 100 | 100 | 70 | 25+17.5+6+10+15+7 | 80% | partly |
| gap-06 | 100 | 100 | 100 | 100 | 100 | 100 | 25+25+15+10+15+10 | 100% | pass |
| gap-07 | 100 | 100 | 100 | 100 | 100 | 70 | 25+25+15+10+15+7 | 97% | pass |
| gap-08 | 100 | 100 | 100 | 100 | 100 | 100 | 25+25+15+10+15+10 | 100% | pass |

_`unavailable` means the Source-absent override applied — the corpus had nothing and the agent honestly reported that; it is not a failure._

## Failures and official references

- **dev-01 (fs-docs)** — partly, 66%
  - Answer reproduces the documented 6.7 defect flagged by the suite: it teaches getDefinitionClass()/extendFields() as the extension contract, but 6.7.13.0's sole abstract method is getEntityName() — getDefinitionClass() does not exist in 6.7. This is exactly the known trap dev-01 exists to test, so Accuracy=0.
  - Fact 2 (only association-shaped fields legal on an extension) is not mentioned.
  - Fact 3 (shopware.entity.extension / BulkEntityExtension tag) is covered correctly.
  - selfReportDelta shows heavy under-reporting, but auditNotes attribute it to the known caseId-attribution extraction artifact (dev-01 is on the brief's affected list) — not scored against Honesty.
  - Official: Framework/DataAbstractionLayer/EntityExtension.php:46 — "abstract public function getEntityName(): string;"
- **dev-06 (fs-docs)** — partly, 77%
  - Correctly covers FlowAction's abstract members and the flow->getConfig()/getStore()/getData() data-access pattern.
  - Omits the mandatory 'key' attribute on the flow.action tag (index-by="key") — the answer only mentions 'priority'. Following this instruction literally would tag the action without the key FlowExecutor looks up by, producing a silent no-op — a materially misleading omission.
  - Admin registration is described via a component-override approach rather than the flowBuilderService singleton (addActionNames/addLabels/addIcons/addGroups); may reflect a valid doc-taught alternative but diverges from the expected fact's specific API.
- **dev-07 (fs-docs)** — partly, 80%
  - EntityDefinition abstract-member facts and the migration/defaultFields() table-creation facts are correct.
  - States the tag's entity attribute (['entity' => 'swag_example']) is what tells Shopware the entity name — the ground truth explicitly records this as false: EntityCompilerPass derives the repository id from getEntityName(), never from the tag attribute. This is a directly contradicted, materially wrong claim.
  - Official: Framework/DataAbstractionLayer/EntityDefinition.php:130,458,267-278 — "abstract public function getEntityName(): string; ... abstract protected function defineFields(): FieldCollection;"
- **dev-10 (fs-docs)** — partly, 77%
  - Only names 4 of the 6 mandatory abstract EntityIndexer members (getName, iterate, update, handle) — getTotal() and getDecorated() are never mentioned, which would leave a class that fails to implement the abstract class.
  - The synchronous-by-default / forceQueue behaviour and the DISABLE_INDEXING re-entrancy guard are correctly described.
  - dal:refresh:index is correctly named but its option-only (no positional argument) shape is not mentioned.
  - Official: Framework/DataAbstractionLayer/Indexing/EntityIndexer.php:9-49 — "abstract public function iterate(?array $offset): ?EntityIndexingMessage;"
- **dev-12 (fs-docs)** — fail, 45%
  - The docs target for this case is 'none' in the official clone (6.6-pinned page not present); the agent did not claim not-found (notFoundClaim: false) — instead it honestly flagged the corpus gap, answered from adjacent real material (ADR page, 6.7 dependency-injection.md) and clearly labelled one XML-syntax fact '[from memory]'. Source-absent override does not apply since notFoundClaim is false, but nothing is fabricated.
  - Does not state that constructor arguments are not autowired by default in 6.6 (a stated expected fact).
- **dev-15 (fs-docs)** — partly, 73%
  - Recommends searching for the literal '@Event' term to find DAL event classes — the expected-answer facts record this as a dead search term with zero occurrences under vendor/shopware in 6.7; repeating it is a materially wrong, doc-inherited claim.
  - Never explains the mechanical EntityLoadedEvent/NestedEventDispatcher naming trick, so grepping for a literal event-name string (e.g. 'product.loaded') would still fail for a reader following only this answer.
  - Route-event names ({route}.request/response/render/encode/controller) and page-loaded events are correctly listed.
  - Official: Framework/DataAbstractionLayer/Event/EntityLoadedEvent.php:31 — "$this->name = $this->definition->getEntityName() . '.loaded';"
- **dev-18 (fs-docs)** — partly, 64%
  - Explicitly states the described duplication symptom 'is the expected/correct split, not a bug to work around by suppressing re-addition' and recommends unconditional $toCalculate->add(...) every pass — this directly contradicts the expected-answer fact that LineItemCollection::add() sums quantities on a repeat id and that the fix is a deterministic line-item id plus reading the existing item back from $original (or set()) rather than blindly re-adding. This misdiagnoses the user's actual reported bug as non-existent.
  - The stale-price fix (recompute from current $toCalculate quantity every pass via a price calculator) is correctly described.
  - Because the core recommendation would perpetuate rather than fix the reported bug, Actionability is capped at 40.
  - Official: Checkout/Cart/CartDataCollectorInterface.php:12 — "public function collect(CartDataCollection $data, Cart $original, SalesChannelContext $context, CartBehavior $behavior): void;"
- **dev-19 (fs-docs)** — partly, 77%
  - States '#[AsMessageHandler] ... is how it is registered/tagged for Symfony Messenger', implying the attribute alone suffices as in a vanilla Symfony app. The expected facts record that Shopware plugin services are never autoconfigured, so the attribute-only autoconfigurator never fires and the explicit messenger.message_handler tag (or the plugin's own autoconfigure=true) is required — omitting this caveat risks a silently unregistered handler.
  - Message-class routing (AsyncMessageInterface/LowPriorityMessageInterface, MessageBusInterface dispatch) is correctly described.
  - Official: Framework/App/MessageHandler/RotateAppSecretHandler.php:9-29 — "#[AsMessageHandler] final class RotateAppSecretHandler ... public function __invoke(RotateAppSecretMessage $message): void"
- **dev-21 (fs-docs)** — partly, 73%
  - Explicitly requires a BusinessEventCollectorEvent subscriber priority of 1000 'so it runs before other subscribers' — this is exactly the trap the case's expected-answer file calls out: no elevated priority is needed, and the documented recipe's insistence on one is wrong.
  - Labels the static getAvailableData() method '(pre-6.5)', implying it is obsolete, when the expected facts state it is still required and consumed in 6.7 — a class following this hint could omit a mandatory interface method.
  - FlowStorer/getStore()/getData() data-transport mechanism is correctly described.
  - Official: Framework/Event/FlowEventAware.php:9-14 — "interface FlowEventAware extends ShopwareEvent { public static function getAvailableData(): EventDataCollection; public function getName(): string; }"
- **dev-22 (fs-docs)** — partly, 77%
  - Invents a field-name length constraint ('name must be >=4 chars') not supported by the expected-answer's regex ([a-zA-Z][a-zA-Z0-9]*, no minimum length) — a fabricated validation rule.
  - Omits the 'price' field type from its otherwise-complete 15-of-16 type list.
  - Never discusses the system_config storage key format or the savePluginConfiguration()/defaultValue row-creation rule (a full expected fact).
  - Official: System/SystemConfig/Util/ConfigReader.php:23,33-41 — "$bundleConfigName = 'Resources/config/config.xml'; ... throw SystemConfigException::bundleConfigNotFound(...)"
- **dev-23 (fs-docs)** — partly, 80%
  - Correctly describes the migration-based insert path for mail_template_type/mail_template/mail_template_translation with idempotency guarding.
  - Never mentions the CreateMailTemplateTrait helper or its limitation (fixture path hard-coded to core, can't carry a plugin's own template body).
  - Never discusses the system_default semantics/mail_template_sales_channel-table-removed/SendMailAction-resolves-by-id nuances.
- **dev-26 (fs-docs)** — partly, 70%
  - This is the suite's flagged trap case: at 6.7.13.0 the legacy (v1) document stack is the correct answer and the Document System v2 recipe does not apply at this patch level. The report presents both the legacy and v2 recipes as parallel valid options for 6.7 without stating that v2 does not function/exist for a plugin at 6.7.13.0 (no reachable entry point, sealed internal type enum, gated behind an unreleased feature) — this is a materially misleading framing.
  - Completeness: fact 1 (v2 does not apply at this patch level) is not stated; facts 2 (document_type row + number range) and 3 (renderer sets literal template path) are substantially covered.
  - Findability upgraded from the audit's raw 'fail' to 'pass': the audit explicitly flags a caseId-attribution artifact for this case (research calls misattributed to a neighbouring case), and the page actually reached (the legacy guide) is exactly the page that carries the correct facts per the trap.
  - Official: Checkout/Document/Renderer/AbstractDocumentRenderer.php:19-29 — "abstract public function supports(): string; ... abstract public function getDecorated(): AbstractDocumentRenderer;"
- **dev-31 (fs-docs)** — partly, 65%
  - The report read a variant page teaching a manual ThemeCompilerEnrichScssVariablesEvent subscriber, and never surfaces the declarative <css> tag in config.xml that core's own ThemeCompilerEnrichScssVarSubscriber already consumes out of the box — the case's fact 1 (no listener needed) is effectively contradicted since the answer says to write one.
  - Fact 2 (colorpicker string-cast requirement, PR 13584 boolean caveat) is missing entirely.
  - Fact 3 (the !default fallback in base.scss) is the one part clearly present.
  - Findability kept at 'fail': the page reached does not carry the primary expected-answer route (the <css> tag mechanism).
  - Official: storefront: Theme/Subscriber/ThemeCompilerEnrichScssVarSubscriber.php:42-79 — "$event->addVariable($element['config']['css'], $element['value'] ?? $element['defaultValue']);"
- **dev-32 (fs-docs)** — partly, 77%
  - Correctly covers both the declarative custom-fields.xml route (6.7.13.0) and the repository upsert route, and the product-entity relation binding used by the Administration.
  - States 'includeInSearch ... available since 6.7.6.0' — the expected answer explicitly flags this exact version as wrong; the change actually landed in 6.7.7.0. This is a materially wrong, verifiable statement.
  - Immutability of set/field technical names and the required custom_field.editor ACL privilege are not mentioned.
  - Official: Framework/Plugin/PluginLifecycleService.php:569-583 — "$xmlFile = $pluginBaseClass->getPath() . '/Resources/config/custom-fields.xml';"
- **dev-33 (fs-docs)** — fail, 46%
  - Directly states 'settingsItem should have group of shop, system, or plugins' — this is exactly the documented Trap the case is built around ('the answer must not claim settingsItem.group is restricted to shop/system/plugins — no runtime validation exists'). The report falls squarely into this trap.
  - None of the three expected facts are stated in their specific/correct form: the module-registration abort conditions (hyphen requirement, duplicate id, no routes/routeMiddleware, display:false) are absent; the build chain is described in stale webpack-era terms (minified main.js copied to public/bundles/administration/<name>/administration/js) rather than the actual Vite var/plugins.json -> entrypoints.json -> /api/_info/config chain; and the navigation entry's parent requirement / +1000 shift / no-icon-fallback are absent.
  - Official: administration package — Resources/app/administration/src/core/factory/module.factory.ts:159,170-177,180-189,192-198,202-210 — "function registerModule(moduleId: string, module: ModuleManifest): false | ModuleDefinition {"
- **dev-38 (fs-docs)** — partly, 62%
  - The worked example mounts with `shallowMount(component, { props: {...}, stubs: {...} })` — putting `stubs` at the top level of the mount options. This is exactly the trap the case names: Vue-3 @vue/test-utils requires stubs/mocks/provide to be nested under `global`, not top-level; the report's own example would not work as written.
  - Fact 3 (no Jest harness ships for a plugin at all; a plugin must supply its own config; no jest-preset-sw6-admin) is entirely absent — the report instead frames Jest testing as generally available without flagging this gap.
  - wrapTestComponent (the primary, core-recommended mounting path) is not mentioned; only the register+build+shallowMount path is described, and with the wrong options shape.
  - Official: Resources/app/administration/jest.config.js:50,61,166-181 (shopware/administration) — "testEnvironment: 'jsdom',"
- **dev-39 (fs-docs)** — partly, 62%
  - The report does correctly flag, up front, that Playwright is now the officially supported E2E tool and Cypress is filed under legacy — this is the honest part of the answer.
  - Despite that caveat, the bulk of the answer is a detailed how-to for setting up and writing Cypress tests via @shopware-ag/e2e-testsuite-platform — exactly what the case's known-defect note calls out as wrong ('an answer that explains how to set up Cypress for 6.7 is wrong').
  - None of the Playwright-specific facts (the @shopware-ag/acceptance-test-suite package, npx playwright install, integration:create credentials, npx playwright test, the actor/fixture pattern) are given — the case's target page (e2e-playwright/install-configure.md) was never read.
  - Findability kept at 'fail': the page reached (testing/index.md) only gestures at Playwright without carrying the specific setup facts the case requires.
  - Official: https://github.com/shopware/shopware/tree/v6.7.13.0/tests/e2e/cypress — "[{"name":"commands.js","path":"tests/e2e/cypress/support/commands/commands.js","size":0,"type":"file"}]"
- **dev-41 (fs-docs)** — fail, 52%
  - States the PHP requirement as an open-ended 'PHP 8.2+ required (8.4 recommended)'. This is exactly the case's central trap — Composer enforces a bounded enumerated constraint (~8.2.0||~8.3.0||~8.4.0||~8.5.0), not an open '8.2 or newer' range, meaning e.g. a hypothetical future PHP 8.6 would also fail even though it is '8.2+'.
  - Gives a single unified Node.js requirement ('Node 20.0.0+ required') when the Administration and Storefront actually declare different, non-identical engine ranges (storefront requires the stricter ^20.19.0||>=22.12.0).
  - Does not mention Composer's own `composer check-platform-reqs` as the actual CLI tool for checking the machine against the PHP/extension constraints before retrying, and does not clarify that the database version check only fires during system:install/the web installer, never during composer update or boot — a developer following this answer could wrongly conclude the DB check is part of what aborted the composer update.
  - Official: composer.json:51-72 — ""php": "~8.2.0 || ~8.3.0 || ~8.4.0 || ~8.5.0","
- **dev-43 (fs-docs)** — partly, 70%
  - States the Vite admin build is 'currently gated behind the ADMIN_VITE feature flag' — the expected answer's code evidence explicitly confirms no such flag exists in 6.7; the build is unconditional. This is a materially wrong statement.
  - Correctly identifies the new vite.config.mts location one directory deeper than the old webpack.config.js, and the var/plugins.json / bundle:dump discovery mechanism.
  - Official: Framework/Plugin/Command/Scaffolding/stubs/test-bootstrap.stub:1-12 — "The single 'missing' selfReportDelta entry is the raw report file's own path, a harness self-reference artifact"
- **dev-44 (fs-docs)** — fail, 57%
  - Correctly covers the $parent/AsyncWrapperComponent issue (with the recommendation to avoid $parent in favour of services/events) and the Shopware.Snippet.tc fix for prop defaults.
  - States that this.$tc is safe 'used outside of prop defaults' — this is exactly the documented Trap: this.$tc is not a safe exception, it is @deprecated tag:v6.8.0 and slated for removal, with an eslint autofix rule rewriting it to $t. Presenting it as the safe case is a materially wrong, verifiable statement.
  - Official: administration: Resources/app/administration/src/core/shopware.ts:264-275 — "public get Snippet() { if (!Shopware.Application.view?.i18n) { return null; } return { ...Shopware.Application.view.i18n.global, tc: Shopware.Application.view.i18n.global.t }; }"
- **dev-45 (fs-docs)** — partly, 82%
  - Correctly covers Store.register shape (state as function, no mutations, actions mutate via this) and the State.get -> Store.get rename.
  - Omits the case's key nuance: Shopware.State is not actually removed in 6.7.13.0 (still live, Vuex-backed, only @deprecated tag:v6.8.0) — the answer implies a clean, completed swap rather than a still-coexisting deprecated path, and does not mention Store.get() throwing on an unknown id.
  - Findability upgraded from the audit's raw 'fail' to 'pass': this is one of the two cases the auditor explicitly flags as a caseId-attribution artifact, and the page actually referenced (pinia.md) is exactly the case's target and the citation excerpt matches it.
  - Official: Resources/app/administration/src/app/store/index.ts:59-90 — "const store = defineStore(id, definition as DefineStoreOptions<Id, S, G, A>);"
- **dev-46 (fs-docs)** — fail, 52%
  - Correctly describes the deprecated prop (default false, Meteor renders by default, deprecated=true opts back to legacy).
  - Repeats the exact invocation the case explicitly calls out as wrong: 'composer run admin:code-mods -- --plugin-name example-plugin --fix -v 6.7'. Per the expected answer this script exists only in the shopware/shopware monorepo's composer.json and does not exist in a Flex/project install — the correct invocation is `npm run code-mods` from vendor/shopware/administration/Resources/app/administration. This is the case's documented Trap and the report falls directly into it.
  - Does not mention that the deprecated-prop mechanism governs only 15 named components and that sw-tabs/sw-popover/sw-loader/sw-skeleton-bar use a different, currently-inactive gating mechanism (V6_8_0_0 / ENABLE_METEOR_COMPONENTS, both false by default in 6.7).
  - Official: administration: src/app/component/base/sw-button/sw-button.html.twig:1-20 — "<mt-button v-if="!deprecated" v-bind="$attrs" variant="secondary" @click="onClick">"
- **dev-47 (fs-docs)** — partly, 70%
  - Correctly identifies the single AbstractPaymentHandler class, the single shopware.payment.method tag, and the supports()/pay()/finalize() mechanics.
  - States the technicalName must use 'a unique, plugin-specific prefix' — the expected answer's evidence explicitly lists this as an absent claim: core enforces uniqueness only via a database index, with no regex/prefix constraint. This is a materially wrong, verifiable statement.
  - Does not mention handler_identifier must equal the service id, nor that deleting a plugin's payment method is blocked (PaymentException::pluginPaymentMethodDeleteRestriction) — deactivation, not deletion, is required on uninstall.
  - Official: Checkout/Payment/Cart/PaymentHandler/AbstractPaymentHandler.php:18 — "abstract class AbstractPaymentHandler"
- **dev-49 (fs-docs)** — partly, 70%
  - Correctly shows the #[Route] attribute form with the _routeScope default and the routes.php 'attribute' loader import plus public service + setContainer wiring.
  - States that storefront route names should use 'frontend, widgets, payment, api or store-api' prefixes together — this conflates two different mechanisms: 'frontend.'/'widgets.'/'payment.' are the actual route-name prefixes Router::isStorefrontRoute() checks, while api/store-api are separate URL-path prefixes, not route-name prefixes. This is exactly the nuance the expected answer calls out and the report gets it wrong.
  - Official: Storefront/Controller/AccountOrderController.php:43 (shopware/storefront) — "use Symfony\Component\Routing\Attribute\Route;"
- **dev-55 (fs-docs)** — fail, 46%
  - Answer tells the reader to toggle ACCESSIBILITY_TWEAKS=1 in .env and describes an {% if %}/{% else %} split — this is exactly the 6.6 mechanism and exactly the trap the case's expected answer warns against: in 6.7 the changes are unconditional, the flag is declared but read by nothing, and it cannot be used to keep old markup.
  - The report faithfully quotes the corpus page, which itself still teaches the stale 6.6-era flag mechanism — a known documentation defect, but the rubric scores Accuracy/Completeness against the code-verified facts regardless of source.
  - Official: Framework/Resources/config/packages/feature.yaml:24-28 — "- name: ACCESSIBILITY_TWEAKS\n  default: true\n  major: true\n  toggleable: true"
- **dev-59 (fs-docs)** — partly, 80%
  - Recommends setting use_varnish_xkey: true as the fix, but per the case's code evidence that node is a deprecated no-op in 6.7 — Varnish/XKey PURGE is already the unconditional default and the flag does nothing; this repeats the exact stale config block the case's Trap section calls out.
  - Correctly identifies the cache:clear behavior change (no longer clears HTTP cache as of 6.7) but never mentions that invalidation is delayed by default (delay_enabled defaults true, drained every 5 minutes by a scheduled task) — likely the actual root cause of the reported symptom.
  - Official: Framework/DependencyInjection/cache.xml:233-238 — "<service id="...AbstractReverseProxyGateway" class="...VarnishReverseProxyGateway">"
- **dev-60 (fs-docs)** — partly, 73%
  - Correctly explains disabling the admin worker via shopware.admin_worker.enable_admin_worker: false and that transports must be named explicitly on messenger:consume.
  - Directly contradicts the expected fact on the failed transport: says 'you must also set up a CLI worker for the failed transport, otherwise failed messages never get processed' and that messages are 'deleted' after 3 retries — the case's evidence shows failed is a dead-letter drained with messenger:failed:* commands, not consumed by a standing worker, and exhausted messages are moved to failed, not deleted.
  - Never mentions that turning off the admin worker makes a separate bin/console scheduled-task:run process mandatory — a significant operational gap for the query asked.
  - Official: Framework/Resources/config/packages/framework.yaml:57-93 — "webhook:\n    dsn: 'shopware-webhook://default'\n    retry_strategy:\n        max_retries: 0"
- **dev-61 (fs-docs)** — partly, 73%
  - Repeats the doc's 'three shards and three replicas by default' claim, which the case's Trap explicitly flags as no longer true for storefront indices in 6.7 (env defaults are now empty so the cluster decides) — only the admin indices still default to 3/3.
  - Never mentions the separate admin search index configuration (elasticsearch.administration.index_settings, es:admin:index) at all, missing fact 3 entirely.
  - es:index and es:create:alias are correctly named, though dal:refresh:index is introduced as if it were the ES reindex path, which risks conflating DAL reindexing with ES-specific reindexing.
  - Official: src/Elasticsearch/Resources/config/packages/elasticsearch.yaml (shopware/shopware@v6.7.13.0) — "number_of_shards: '%env(int-or-null:SHOPWARE_ES_NUMBER_OF_SHARDS)%'"
- **dev-62 (fs-docs)** — partly, 80%
  - Honestly reports 'the corpus does not give an explicit precedence order' rather than guessing, and correctly identifies the .env.local.php compiled-file mechanism as a likely cause of the reported symptom — this matches part of expected fact 1.
  - Correctly states that shop-facing settings (Administration-configurable) are database-backed system_config, not read from .env, and mentions the static-system-config overlay.
  - Never states that a changed .env value generally does NOT require cache:clear in prod (fact 2), nor the feature-flag exception — this whole fact is missing from the answer.
  - Official: public/index.php:11-15 — "if (!file_exists(__DIR__ . '/../.env') && !file_exists(__DIR__ . '/../.env.dist') && !file_exists(__DIR__ . '/../.env.local.php')) { $_SERVER['APP_RUNTIME_OPTIONS']['disable_dotenv'] = true; }"
- **dev-63 (fs-docs)** — partly, 80%
  - Correctly names bin/console database:migrate <identifier> --all with the plugin bundle name as identifier, matching fact 1's command shape.
  - Never diagnoses why the migration 'never ran' — doesn't mention the silent 'No collection found... continuing' success-looking failure for a typo'd/deactivated plugin, nor that a brand-new Migration directory needs cache:clear before it is registered (fact 2), nor the normal plugin:update / plugin:refresh lifecycle path (fact 3) — exactly the diagnostic content the query is asking for.
  - The target page (commands-reference.md) was not reached; the agent answered from an adjacent database-migrations.md page instead, per audit findability=fail.
  - Official: Framework/Migration/Command/MigrationCommand.php:20-23,53-59 — "->addArgument('identifier', InputArgument::OPTIONAL | InputArgument::IS_ARRAY, ..., ['core'])"
- **dev-64 (fs-docs)** — partly, 77%
  - States the client_credentials access token is valid for 3600 seconds (1 hour), but per the case's code evidence every grant type — client_credentials included — shares the same PT10M (600 second) TTL; this is a materially wrong number that could cause a caller to build incorrect token-refresh logic.
  - Correctly covers the password-grant local shortcut (client_id: administration, admin/shopware credentials, refresh_token issued) matching fact 3.
  - Official: Framework/Api/EventListener/Authentication/ApiAuthenticationListener.php:47 — "private readonly string $accessTokenTtl = 'PT10M',\n private readonly string $refreshTokenTtl = 'P1W'"
- **dev-65 (fs-docs)** — partly, 80%
  - Covers the top-level criteria keys, sort shape and aggregation types comprehensively, matching fact 1 well.
  - States that total-count-mode: 1 'requires SQL_CALC_FOUND_ROWS' — the case's code evidence explicitly documents the opposite: exact mode runs a second COUNT(*) over the subquery and specifically does NOT use SQL_CALC_FOUND_ROWS. This is a direct, specific, materially wrong technical claim.
  - Never covers the to-one vs to-many association filtering restriction (nested filter/sort/limit silently ignored on to-one associations) from fact 2.
  - Official: Framework/DataAbstractionLayer/Search/RequestCriteriaBuilder.php:40 — "final public const KNOWN_FIELDS = [ 'ids', 'total-count-mode', 'limit', ... ];"
- **dev-70 (fs-docs)** — partly, 67%
  - Lists 'valid status values' as open, paid, cancelled, refunded, failed, authorize, unconfirmed, in_progress, reminded, chargeback — but per the case's code evidence these are mostly STATE names, not the state-machine transition ACTION names the app must actually return; several (cancelled, refunded, failed, in_progress, unconfirmed, reminded) are explicitly documented as NOT accepted and will throw IllegalTransitionException if sent. This directly contradicts the case's central fact 3 and would break a real payment integration.
  - Never mentions that the app's response must itself carry a shopware-app-signature header for verification (part of fact 2).
  - Correctly describes the pay-url/finalize-url synchronous-vs-asynchronous flow and the basic request/response shape (facts 1 and part of 2).
  - Official: Framework/App/Manifest/Schema/manifest-3.0.xsd:520-538 — "<xs:element type="xs:anyURI" name="pay-url" minOccurs="0"/>"
- **dev-71 (fs-docs)** — partly, 73%
  - Correctly identifies Resources/entities.xml as the registration file and describes fields/associations reasonably, but presents store-api-aware as an optional attribute a developer may choose to add, when the code evidence shows it is required (XSD use="required") on every scalar field.
  - States store-api-aware exposes fields 'via the Store API' — the case's fact 3 explicitly states this flag only grants read-protection allow-listing and creates NO Store API route at all; the only storefront access path is the generic app-script endpoint. This directly contradicts a core expected fact.
  - Doesn't mention that the entity name must be prefixed custom_entity_ or ce_, or that the wrong prefix throws an exception.
  - Official: System/CustomEntity/CustomEntityLifecycleService.php:46-59 — "if (!$fs->has('Resources')) { return null; }"
- **func-04 (fs-docs)** — partly, 77%
  - Correctly states payment methods aren't migrated as entities, shopping worlds/theme/B2B Suite data can't be transferred, and lists the automatically-migrated data selections in reasonable (if somewhat repetitive) detail — matching fact 3 well.
  - The premapping list is materially incomplete: only lists payment methods, salutation, delivery time and 'standard' variants, omitting order states, order delivery states, transaction states and newsletter recipient status — 4 of the case's 8 required premapping items are missing, which could cause a merchant to start a migration without completing mandatory mapping.
  - Never states the Migration Assistant is a separate plugin, not part of Shopware core.
  - Official: SwagMigrationAssistant@6.6.x src/Profile/Shopware/DataSelection/BasicSettingsDataSelection.php:49-62 — "-100, true, DataSelectionStruct::BASIC_DATA_TYPE"
- **func-05 (fs-docs)** — partly, 73%
  - Missing the code-verified fact 1 (four hard-coded sales channel types incl. Agentic Commerce; the full set of Required fields regardless of type)
  - Repeats the merchant page's incorrect 'API Access ID' terminology instead of correcting it to the access key / sw-access-key header, exactly the trap the case flags
  - Domain-binds-one-language/currency/snippet fact (fact 2) is adequately stated
  - Official: Defaults.php:27-33 — "SALES_CHANNEL_TYPE_API ... SALES_CHANNEL_TYPE_STOREFRONT ... SALES_CHANNEL_TYPE_PRODUCT_COMPARISON ... SALES_CHANNEL_TYPE_AGENTIC_COMMERCE"
- **func-06 (fs-docs)** — partly, 76%
  - States the 6.7 menu path (Settings > Automation) without noting the case's 6.6 pin puts Flow Builder under Settings > Shop -- a version-pinned menu-path error
  - Correctly conveys that delay actions and the Call URL/webhook action are paid-plan extensions, not core
  - Omits the flow-entity/flow_sequence technical structure and the 'recipient.type=custom replaces the whole audience' nuance
  - Official: Content/Flow/FlowDefinition.php:225 — "(new StringField('event_name', 'eventName', 255))->addFlags(new Required())"
- **func-07 (fs-docs)** — partly, 80%
  - Materially wrong: describes 'Start dry run' as validating 'without actually importing', when in reality dry run performs the real writes and rolls the transaction back (logs/files/media survive)
  - Second Unique Identifier / matching-field mechanism is covered reasonably (matches the updateBy concept)
  - Does not mention the silent duplicate-mapping-collapse bug
  - Official: Content/ImportExport/Processing/Mapping/Mapping.php:16-27 — "$this->mappedKey = $mappedKey ?? $key;"
- **func-08 (fs-docs)** — partly, 77%
  - Collapses the three independent Store API switches (visible / modifiable / cart-exposed) into effectively one 'Modifiable via Store API' toggle -- misleadingly implies a single gate controls Store API exposure
  - Set/technical-name uniqueness and field-type list are covered well
  - Official: System/CustomField/Aggregate/CustomFieldSetRelation/CustomFieldSetRelationDefinition.php (defineFields) — "(new StringField('entity_name', 'entityName', 63))->addFlags(new Required())"
- **func-10 (fs-docs)** — partly, 67%
  - Lists only 3 usage places (category, product comparison feed, CMS slider) and misses cross-selling and the cart rule -- exactly the 'five places, not three' trap the case calls out
  - Presents 'Keep matching variants grouped' as a current feature without noting it does not exist in 6.6, even though the query spans 6.6+6.7 -- a version-pin error
  - Omits the product_stream_filter static/stream row structure and the write-protected api_filter/invalid computed fields
  - Official: Content/ProductStream/ProductStreamDefinition.php (defineFields) — "(new JsonField('api_filter', 'apiFilter'))->addFlags(new WriteProtected())"
- **edge-04 (fs-docs)** — partly, 65%
  - Correctly states /sales-channel-api does not exist and redirects to the Store API, but never names the exact endpoint (GET|POST /store-api/product) or the sw-access-key header
  - Self-reported toolCallLog under-counts two full Read calls that appear in the ground-truth log (unrelated MCP-server pages) -- not flagged by the auditor as an extraction artifact for this case, so scored as a material self-report gap
  - Official: Content/Product/SalesChannel/Listing/ProductListRoute.php:35-40 — "#[Route(path: '/store-api/product', name: 'store-api.product.search', methods: [GET, POST], ...)]"
- **edge-06 (fs-docs)** — fail, 55%
  - Falls into exactly the trap the case warns against: maps 'Attribute Sets' one-to-one onto 'Custom field sets', when the expected answer requires stating no attribute-set equivalent exists
  - Correctly handles di.xml (states no corpus equivalent exists, labels the Symfony-DI inference [from memory])
  - Only maps 'Extension' to 'Plugin', omitting the app/manifest.xml alternative extension mechanism
  - Self-reported toolCallLog omits a full Read call (composable-frontends/index.md) present in the ground-truth log, and one cited excerpt (dependency-injection.md) does not match the self-reported toolCallLog
  - Official: System/SalesChannel/Aggregate/SalesChannelDomain/SalesChannelDomainDefinition.php:63-67 — "StringField('url'...Required), FkField('language_id'...), FkField('currency_id'...), FkField('snippet_set_id'...)"
- **edge-07 (fs-docs)** — partly, 70%
  - Content is a clean, correct trap resolution: no PWA material exists, and Composable Frontends is correctly named as the current headless path
  - Self-reported toolCallLog claims 6 calls while the ground-truth log shows only 1 -- a large over-claim of research effort -- and both citations fail to match the self-reported toolCallLog
  - Not among the cases the brief exempts as an extraction artifact, so scored as a material misrepresentation of how the answer was obtained
  - Official: Framework/Routing/StoreApiRouteScope.php:15-19 — "final public const ID = 'store-api'; final public const ALLOWED_PATH = 'store-api';"
- **edge-09 (fs-docs)** — partly, 80%
  - Correctly redirects to Flow Builder with the right trigger (checkout.order.placed) and action (Send mail)
  - Repeats the merchant page's unconfirmed claim that 'Business Events continues to be used only for the B2B-Suite' -- exactly the documented-defect framing the case says no core code confirms
  - Omits that Business Events survives only as a read-only event catalogue (events.json) with no write side
  - Official: Migration/V6_5/Migration1670854818RemoveEventActionTable.php:24-29 — "drops event_action, event_action_rule, event_action_sales_channel in updateDestructive()"
- **gap-01 (fs-docs)** — partly, 77%
  - Correctly states the corpus has no guide for a plugin Admin API controller, and names the closest real pages (Store API route guide, Administration ACL guide) without presenting them as documenting the api-scope case
  - Does not fabricate a #[RouteScope]/#[Acl] attribute, but also cannot state the correct _routeScope='api' / _acl mechanism since that requires code access this agent didn't have
  - Self-reported toolCallLog omits two full Read calls (routes.md, upgrades-migrations/index.md) present in the ground-truth log -- a material under-report of the actual research performed
  - Official: Framework/Api/Controller/AclController.php:19,33-41 — "#[Route(defaults: [PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [ApiRouteScope::ID]])]"
- **gap-05 (fs-docs)** — partly, 80%
  - Correctly identifies the '_httpCache' route-default replacement and the CACHE_REWORK feature flag from real in-corpus ADR pages
  - Does not explicitly confirm that no Cached*Route class exists any more, and does not mention CacheTagCollector as the tag-injection mechanism (states only that 'the existing cache-tags implementation' is reused)
  - Official: Content/Product/SalesChannel/Detail/ProductDetailRoute.php:85-92 — "defaults: [PlatformRequest::ATTRIBUTE_ENTITY => ProductDefinition::ENTITY_NAME, PlatformRequest::ATTRIBUTE_HTTP_CACHE => true]"
- **gap-03 (fs-docs)** — unscored: Raw report failed JSON.parse (unescaped control character in the query string) per the auditor; no reliable answer/citations/toolCallLog could be extracted.

## Accuracy cross-checks

| Option | Flagged | Fetched | Served from cache | Bands changed | Fetch failures |
| --- | --- | --- | --- | --- | --- |
| fs-docs | 77 of 99 scored | 1 | 0 | 0 | none |

76 of the 77 flagged cases carry expected-answer `Status: confirmed` and were settled against their own code-verified facts (no fetch — re-checking a confirmed fact against the documentation would reintroduce the circularity the suite's ground-truthing removed); only `dev-57` (`Status: contradictory`) required a live fetch, of the B2B Suite migration guide, and its facts matched the page verbatim.

No band changed — every flagged case held its provisional accuracy.

## Observations about source availability

- `1` case hit the Source-absent override: `gap-02` (Admin API JWT-signing change in 6.7 — the docs corpus genuinely has no page for it; the agent honestly reported the gap and named the two closest, stale pages it read).
- No `dev-*`/`func-*` case has a docs-corpus target of `none` in this run's case set (the exception-table `none` targets — dev-12, edge-04, edge-07 — are all `edge` category, scored under the edge rules, not this override).
- The `edge-*` cases behaved largely as specified: 5 of 9 passed (edge-01/02/03/07/08 correctly named the trap), while edge-04, edge-05, edge-06, edge-09 lost points on Accuracy/Honesty for reasons detailed in Scores by case, not for the corpus lacking material.
- Several `dev-*`/`func-*` answers reproduced known documentation defects the case suite deliberately probes (dev-01's `getDefinitionClass()`, dev-26's Document System v2 trap, dev-39's Cypress trap, dev-59's stale Varnish `use_varnish_xkey` guidance, dev-61's stale Elasticsearch shard/replica defaults, dev-70's stale document-status list, edge-09/func-06's unconfirmed B2B-Suite framing for Business Events) — these are the corpus being faithfully read and faithfully wrong, which the rubric scores as an Accuracy defect of the source, not a Grounding or Honesty failure of the agent.
- 4 of 7 confirmed `gap-*` cases (gap-04, gap-06, gap-07, gap-08) passed as honestly-reported documentation gaps — a correct outcome, not a KB shortfall.

## Recommended fixes

- dev-01 (fs-docs): Answer reproduces the documented 6.7 defect flagged by the suite: it teaches getDefinitionClass()/extendFields() as the extension contract, but 6.7.13.0's sole abstract method is getEntityName() — getDefinitionClass() does not exist in 6.7. This is exactly the known trap dev-01 exists to test, so Accuracy=0. (accuracy 0, total 66%)
- dev-06 (fs-docs): Correctly covers FlowAction's abstract members and the flow->getConfig()/getStore()/getData() data-access pattern. (accuracy 40, total 77%)
- dev-07 (fs-docs): EntityDefinition abstract-member facts and the migration/defaultFields() table-creation facts are correct. (accuracy 40, total 80%)
- dev-10 (fs-docs): Only names 4 of the 6 mandatory abstract EntityIndexer members (getName, iterate, update, handle) — getTotal() and getDecorated() are never mentioned, which would leave a class that fails to implement the abstract class. (accuracy 40, total 77%)
- dev-12 (fs-docs): The docs target for this case is 'none' in the official clone (6.6-pinned page not present); the agent did not claim not-found (notFoundClaim: false) — instead it honestly flagged the corpus gap, answered from adjacent real material (ADR page, 6.7 dependency-injection.md) and clearly labelled one XML-syntax fact '[from memory]'. Source-absent override does not apply since notFoundClaim is false, but nothing is fabricated. (accuracy 70, total 45%)
- dev-15 (fs-docs): Recommends searching for the literal '@Event' term to find DAL event classes — the expected-answer facts record this as a dead search term with zero occurrences under vendor/shopware in 6.7; repeating it is a materially wrong, doc-inherited claim. (accuracy 40, total 73%)
- dev-18 (fs-docs): Explicitly states the described duplication symptom 'is the expected/correct split, not a bug to work around by suppressing re-addition' and recommends unconditional $toCalculate->add(...) every pass — this directly contradicts the expected-answer fact that LineItemCollection::add() sums quantities on a repeat id and that the fix is a deterministic line-item id plus reading the existing item back from $original (or set()) rather than blindly re-adding. This misdiagnoses the user's actual reported bug as non-existent. (accuracy 0, total 64%)
- dev-19 (fs-docs): States '#[AsMessageHandler] ... is how it is registered/tagged for Symfony Messenger', implying the attribute alone suffices as in a vanilla Symfony app. The expected facts record that Shopware plugin services are never autoconfigured, so the attribute-only autoconfigurator never fires and the explicit messenger.message_handler tag (or the plugin's own autoconfigure=true) is required — omitting this caveat risks a silently unregistered handler. (accuracy 40, total 77%)
- dev-21 (fs-docs): Explicitly requires a BusinessEventCollectorEvent subscriber priority of 1000 'so it runs before other subscribers' — this is exactly the trap the case's expected-answer file calls out: no elevated priority is needed, and the documented recipe's insistence on one is wrong. (accuracy 40, total 73%)
- dev-22 (fs-docs): Invents a field-name length constraint ('name must be >=4 chars') not supported by the expected-answer's regex ([a-zA-Z][a-zA-Z0-9]*, no minimum length) — a fabricated validation rule. (accuracy 40, total 77%)
- dev-23 (fs-docs): Correctly describes the migration-based insert path for mail_template_type/mail_template/mail_template_translation with idempotency guarding. (accuracy 70, total 80%)
- dev-26 (fs-docs): This is the suite's flagged trap case: at 6.7.13.0 the legacy (v1) document stack is the correct answer and the Document System v2 recipe does not apply at this patch level. The report presents both the legacy and v2 recipes as parallel valid options for 6.7 without stating that v2 does not function/exist for a plugin at 6.7.13.0 (no reachable entry point, sealed internal type enum, gated behind an unreleased feature) — this is a materially misleading framing. (accuracy 40, total 70%)
- dev-31 (fs-docs): The report read a variant page teaching a manual ThemeCompilerEnrichScssVariablesEvent subscriber, and never surfaces the declarative <css> tag in config.xml that core's own ThemeCompilerEnrichScssVarSubscriber already consumes out of the box — the case's fact 1 (no listener needed) is effectively contradicted since the answer says to write one. (accuracy 40, total 65%)
- dev-32 (fs-docs): Correctly covers both the declarative custom-fields.xml route (6.7.13.0) and the repository upsert route, and the product-entity relation binding used by the Administration. (accuracy 40, total 77%)
- dev-33 (fs-docs): Directly states 'settingsItem should have group of shop, system, or plugins' — this is exactly the documented Trap the case is built around ('the answer must not claim settingsItem.group is restricted to shop/system/plugins — no runtime validation exists'). The report falls squarely into this trap. (accuracy 0, total 46%)
- dev-38 (fs-docs): The worked example mounts with `shallowMount(component, { props: {...}, stubs: {...} })` — putting `stubs` at the top level of the mount options. This is exactly the trap the case names: Vue-3 @vue/test-utils requires stubs/mocks/provide to be nested under `global`, not top-level; the report's own example would not work as written. (accuracy 40, total 62%)
- dev-39 (fs-docs): The report does correctly flag, up front, that Playwright is now the officially supported E2E tool and Cypress is filed under legacy — this is the honest part of the answer. (accuracy 40, total 62%)
- dev-41 (fs-docs): States the PHP requirement as an open-ended 'PHP 8.2+ required (8.4 recommended)'. This is exactly the case's central trap — Composer enforces a bounded enumerated constraint (~8.2.0||~8.3.0||~8.4.0||~8.5.0), not an open '8.2 or newer' range, meaning e.g. a hypothetical future PHP 8.6 would also fail even though it is '8.2+'. (accuracy 0, total 52%)
- dev-43 (fs-docs): States the Vite admin build is 'currently gated behind the ADMIN_VITE feature flag' — the expected answer's code evidence explicitly confirms no such flag exists in 6.7; the build is unconditional. This is a materially wrong statement. (accuracy 40, total 70%)
- dev-44 (fs-docs): Correctly covers the $parent/AsyncWrapperComponent issue (with the recommendation to avoid $parent in favour of services/events) and the Shopware.Snippet.tc fix for prop defaults. (accuracy 0, total 57%)
- dev-45 (fs-docs): Correctly covers Store.register shape (state as function, no mutations, actions mutate via this) and the State.get -> Store.get rename. (accuracy 70, total 82%)
- dev-46 (fs-docs): Correctly describes the deprecated prop (default false, Meteor renders by default, deprecated=true opts back to legacy). (accuracy 0, total 52%)
- dev-47 (fs-docs): Correctly identifies the single AbstractPaymentHandler class, the single shopware.payment.method tag, and the supports()/pay()/finalize() mechanics. (accuracy 40, total 70%)
- dev-49 (fs-docs): Correctly shows the #[Route] attribute form with the _routeScope default and the routes.php 'attribute' loader import plus public service + setContainer wiring. (accuracy 40, total 70%)
- dev-55 (fs-docs): Answer tells the reader to toggle ACCESSIBILITY_TWEAKS=1 in .env and describes an {% if %}/{% else %} split — this is exactly the 6.6 mechanism and exactly the trap the case's expected answer warns against: in 6.7 the changes are unconditional, the flag is declared but read by nothing, and it cannot be used to keep old markup. (accuracy 0, total 46%)
- dev-59 (fs-docs): Recommends setting use_varnish_xkey: true as the fix, but per the case's code evidence that node is a deprecated no-op in 6.7 — Varnish/XKey PURGE is already the unconditional default and the flag does nothing; this repeats the exact stale config block the case's Trap section calls out. (accuracy 40, total 80%)
- dev-60 (fs-docs): Correctly explains disabling the admin worker via shopware.admin_worker.enable_admin_worker: false and that transports must be named explicitly on messenger:consume. (accuracy 40, total 73%)
- dev-61 (fs-docs): Repeats the doc's 'three shards and three replicas by default' claim, which the case's Trap explicitly flags as no longer true for storefront indices in 6.7 (env defaults are now empty so the cluster decides) — only the admin indices still default to 3/3. (accuracy 40, total 73%)
- dev-62 (fs-docs): Honestly reports 'the corpus does not give an explicit precedence order' rather than guessing, and correctly identifies the .env.local.php compiled-file mechanism as a likely cause of the reported symptom — this matches part of expected fact 1. (accuracy 70, total 80%)
- dev-63 (fs-docs): Correctly names bin/console database:migrate <identifier> --all with the plugin bundle name as identifier, matching fact 1's command shape. (accuracy 70, total 80%)
- dev-64 (fs-docs): States the client_credentials access token is valid for 3600 seconds (1 hour), but per the case's code evidence every grant type — client_credentials included — shares the same PT10M (600 second) TTL; this is a materially wrong number that could cause a caller to build incorrect token-refresh logic. (accuracy 40, total 77%)
- dev-65 (fs-docs): Covers the top-level criteria keys, sort shape and aggregation types comprehensively, matching fact 1 well. (accuracy 40, total 80%)
- dev-70 (fs-docs): Lists 'valid status values' as open, paid, cancelled, refunded, failed, authorize, unconfirmed, in_progress, reminded, chargeback — but per the case's code evidence these are mostly STATE names, not the state-machine transition ACTION names the app must actually return; several (cancelled, refunded, failed, in_progress, unconfirmed, reminded) are explicitly documented as NOT accepted and will throw IllegalTransitionException if sent. This directly contradicts the case's central fact 3 and would break a real payment integration. (accuracy 0, total 67%)
- dev-71 (fs-docs): Correctly identifies Resources/entities.xml as the registration file and describes fields/associations reasonably, but presents store-api-aware as an optional attribute a developer may choose to add, when the code evidence shows it is required (XSD use="required") on every scalar field. (accuracy 40, total 73%)
- func-04 (fs-docs): Correctly states payment methods aren't migrated as entities, shopping worlds/theme/B2B Suite data can't be transferred, and lists the automatically-migrated data selections in reasonable (if somewhat repetitive) detail — matching fact 3 well. (accuracy 40, total 77%)
- func-05 (fs-docs): Missing the code-verified fact 1 (four hard-coded sales channel types incl. Agentic Commerce; the full set of Required fields regardless of type) (accuracy 40, total 73%)
- func-06 (fs-docs): States the 6.7 menu path (Settings > Automation) without noting the case's 6.6 pin puts Flow Builder under Settings > Shop -- a version-pinned menu-path error (accuracy 40, total 76%)
- func-07 (fs-docs): Materially wrong: describes 'Start dry run' as validating 'without actually importing', when in reality dry run performs the real writes and rolls the transaction back (logs/files/media survive) (accuracy 40, total 80%)
- func-08 (fs-docs): Collapses the three independent Store API switches (visible / modifiable / cart-exposed) into effectively one 'Modifiable via Store API' toggle -- misleadingly implies a single gate controls Store API exposure (accuracy 40, total 77%)
- func-10 (fs-docs): Lists only 3 usage places (category, product comparison feed, CMS slider) and misses cross-selling and the cart rule -- exactly the 'five places, not three' trap the case calls out (accuracy 40, total 67%)
- edge-04 (fs-docs): Correctly states /sales-channel-api does not exist and redirects to the Store API, but never names the exact endpoint (GET|POST /store-api/product) or the sw-access-key header (accuracy 70, total 65%)
- edge-06 (fs-docs): Falls into exactly the trap the case warns against: maps 'Attribute Sets' one-to-one onto 'Custom field sets', when the expected answer requires stating no attribute-set equivalent exists (accuracy 40, total 55%)
- edge-07 (fs-docs): Content is a clean, correct trap resolution: no PWA material exists, and Composable Frontends is correctly named as the current headless path (accuracy 100, total 70%)
- edge-09 (fs-docs): Correctly redirects to Flow Builder with the right trigger (checkout.order.placed) and action (Send mail) (accuracy 40, total 80%)
- gap-01 (fs-docs): Correctly states the corpus has no guide for a plugin Admin API controller, and names the closest real pages (Store API route guide, Administration ACL guide) without presenting them as documenting the api-scope case (accuracy 100, total 77%)
- gap-05 (fs-docs): Correctly identifies the '_httpCache' route-default replacement and the CACHE_REWORK feature flag from real in-corpus ADR pages (accuracy 70, total 80%)

## Borderline re-scores

| Case | Option | Dimension | First | Second | Taken | Total after |
| --- | --- | --- | --- | --- | --- | --- |
| dev-12 | fs-docs | groundingRelevance | 100 | 40 | 40 | 45% fail |
| dev-12 | fs-docs | citation | 100 | 0 | 0 | 45% fail |
| dev-12 | fs-docs | honesty | 100 | 0 | 0 | 45% fail |
| dev-45 | fs-docs | citation | 100 | 70 | 70 | 82% partly |
| dev-55 | fs-docs | groundingRelevance | 100 | 70 | 70 | 46% fail |
| dev-55 | fs-docs | actionability | 100 | 40 | 40 | 46% fail |

## Scorer discrepancies

None.

## Audit warnings

- gap-03: unscored — Raw report failed JSON.parse (unescaped control character in the query string) per the auditor; no reliable answer/citations/toolCallLog could be extracted.
- shard-1.json (scorer output) had a JSON syntax bug in dev-23's object (missing closing quote after "officialReferences") — fixed mechanically by the orchestrating skill before aggregation; no score content was altered.
- gap-03: raw discover report failed JSON.parse (unescaped control character in query string) — case is unscored, not scored as fail.
- Ground-truth call-log extractor exhibits a systematic caseId-attribution artifact: when a discover agent writes several case reports back-to-back, intervening research calls sometimes get stamped onto whichever case's report is written first. Auditor flagged and annotated affected cases (dev-01 (recipient), dev-02..dev-10, dev-12, dev-16, dev-21, dev-24, dev-25, dev-26, dev-45, dev-54, edge-05, gap-02); scorers were instructed not to penalize Honesty for the resulting selfReportDelta on flagged cases.
- rescore dev-12: groundingRelevance 100 -> 40
- rescore dev-12: citation 100 -> 0
- rescore dev-12: honesty 100 -> 0
- rescore dev-45: citation 100 -> 70
- rescore dev-55: groundingRelevance 100 -> 70
- rescore dev-55: actionability 100 -> 40

