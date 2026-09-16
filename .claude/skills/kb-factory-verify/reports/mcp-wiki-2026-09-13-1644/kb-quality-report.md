# KB quality report — mcp-wiki-2026-09-13-1644

## Run

| | |
| --- | --- |
| Run | `mcp-wiki-2026-09-13-1644` (`mcp-wiki`) |
| Options | mcp-wiki |
| Corpus | wiki — fingerprint: lastBuilt 2026-09-07, treeHash 836a72be5d89…, 1569 pages |
| Probe | corpus.name=wiki, entry points present: platform/index.md, layers: platform=implemented |
| Model | inherited (not pinned) |
| Generated | 2026-09-13T17:05:30Z |
| Cases run | 100 of 100 (all) |
| Yardstick | cases.md ef932d8e, scoring-rubric.md 54864fb4, scorer-brief.md 1456b9ec, auditor-brief.md 4c2c6fdc, accuracy-brief.md 9009d748 |
| Execution | discover batches of 10, scorer shards of 25 (batched) |
| Skill | kb-factory-verify |

## Run cost

| Option | Agents | Tokens | Tool calls | Summed agent time | Usage complete |
| --- | --- | --- | --- | --- | --- |
| mcp-wiki | 16 (10 discover, 1 audit, 4 score, 1 accuracy, 1 rescore) | 29334453 | 338 | 6935.9s | yes |

Wall-clock duration of the run: 1233.0s.

## Comparison

Single-option run (mcp-wiki only) — no fs/mcp or wiki/docs delta to compute.

| Option | Access | Corpus | Overall | Status | Developer | Functional | Findable | Edge passed | Gap confirmed | Pass / partly / fail / unavailable / unscored | Weakest dimension |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| mcp-wiki | mcp | wiki | 81.25% | Not ready | 80.77% | 70.75% | 69 of 83 | 8 of 9 | 6 of 8 | 61 / 31 / 8 / 0 / 0 | accuracy |

## Dimension heatmap

| Dimension | Weight | mcp-wiki |
| --- | --- | --- |
| Grounding & Relevance | 25 | 94.1 |
| Accuracy vs. Expected Answer | 25 | 58.4 |
| Completeness | 15 | 78 |
| Citation & Traceability | 10 | 94.4 |
| Honesty | 15 | 90 |
| Actionability | 10 | 86.4 |

Average band score, `unscored` cases excluded (none unscored in this run).

### By area

| Area | mcp-wiki average |
| --- | --- |
| Admin API | 81 |
| Admin migration (Vue 3 / Vite / Pinia / Meteor) | 73.25 |
| Administration | 90.25 |
| App system | 83.4 |
| Checkout & Cart | 89 |
| Config & CLI | 70.2 |
| Content | 85 |
| Content (CMS/mail/SEO/media/sitemap) | 68 |
| Core breaking changes | 89.67 |
| DAL | 81.71 |
| Events | 79.83 |
| Gap | 90.38 |
| Hosting & ops | 75 |
| Merchant | 70.75 |
| Orders | 86 |
| Payment & Shipping | 50 |
| Platform upgrade | 92.5 |
| Plugin fundamentals | 88 |
| Services & DI | 62.67 |
| Store API & headless | 92 |
| Storefront | 88.56 |
| Testing | 75.67 |
| Theme | 88.5 |
| Trap | 90.89 |

## Verdict grid

| Case | Category | Area | mcp-wiki |
| --- | --- | --- | --- |
| dev-01 | dev | DAL | 66% partly ✗ |
| dev-02 | dev | Plugin fundamentals | 88% pass ✓ |
| dev-03 | dev | Store API & headless | 92% pass ✓ |
| dev-04 | dev | Content | 85% pass ✓ |
| dev-05 | dev | Theme | 92% pass ✓ |
| dev-06 | dev | Events | 82% partly ✓ |
| dev-07 | dev | DAL | 85% pass ✗ |
| dev-08 | dev | DAL | 88% pass ✓ |
| dev-09 | dev | DAL | 88% pass ✓ |
| dev-10 | dev | DAL | 77% partly ✓ |
| dev-11 | dev | Services & DI | 80% partly ✗ |
| dev-12 | dev | Services & DI | 88% pass ✓ |
| dev-13 | dev | Services & DI | 20% fail ✗ |
| dev-14 | dev | Events | 100% pass ✓ |
| dev-15 | dev | Events | 77% partly ✓ |
| dev-16 | dev | Orders | 92% pass ✓ |
| dev-17 | dev | Checkout & Cart | 92% pass ✓ |
| dev-18 | dev | Checkout & Cart | 86% pass ✓ |
| dev-19 | dev | Events | 64% partly ✓ |
| dev-20 | dev | Events | 92% pass ✓ |
| dev-21 | dev | Events | 64% partly ✓ |
| dev-22 | dev | Config & CLI | 88% pass ✗ |
| dev-23 | dev | Content (CMS/mail/SEO/media/sitemap) | 63% partly ✓ |
| dev-24 | dev | Content (CMS/mail/SEO/media/sitemap) | 73% partly ✓ |
| dev-25 | dev | Config & CLI | 32% fail ✗ |
| dev-26 | dev | Orders | 80% partly ✓ |
| dev-27 | dev | Storefront | 100% pass ✓ |
| dev-28 | dev | Storefront | 100% pass ✓ |
| dev-29 | dev | Storefront | 92% pass ✓ |
| dev-30 | dev | Storefront | 92% pass ✓ |
| dev-31 | dev | Storefront | 88% pass ✓ |
| dev-32 | dev | DAL | 88% pass ✓ |
| dev-33 | dev | Administration | 88% pass ✓ |
| dev-34 | dev | Administration | 85% pass ✓ |
| dev-35 | dev | Administration | 88% pass ✓ |
| dev-36 | dev | Administration | 100% pass ✓ |
| dev-37 | dev | Testing | 88% pass ✓ |
| dev-38 | dev | Testing | 85% pass ✓ |
| dev-39 | dev | Testing | 54% fail ✗ |
| dev-40 | dev | Platform upgrade | 85% pass ✗ |
| dev-41 | dev | Hosting & ops | 80% partly ✗ |
| dev-42 | dev | Config & CLI | 88% pass ✓ |
| dev-43 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 73% partly ✓ |
| dev-44 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 73% partly ✓ |
| dev-45 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 92% pass ✓ |
| dev-46 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 55% fail ✓ |
| dev-47 | dev | Payment & Shipping | 50% fail ✗ |
| dev-48 | dev | Storefront | 100% pass ✓ |
| dev-49 | dev | Core breaking changes | 85% pass ✓ |
| dev-50 | dev | Core breaking changes | 92% pass ✓ |
| dev-51 | dev | DAL | 80% partly ✓ |
| dev-52 | dev | Core breaking changes | 92% pass ✓ |
| dev-53 | dev | Theme | 85% pass ✓ |
| dev-54 | dev | Storefront | 92% pass ✓ |
| dev-55 | dev | Storefront | 45% fail ✓ |
| dev-56 | dev | Storefront | 88% pass ✓ |
| dev-57 | dev | Platform upgrade | 100% pass ✓ |
| dev-58 | dev | Hosting & ops | 80% partly ✓ |
| dev-59 | dev | Hosting & ops | 76% partly ✓ |
| dev-60 | dev | Hosting & ops | 72% partly ✓ |
| dev-61 | dev | Hosting & ops | 67% partly ✓ |
| dev-62 | dev | Config & CLI | 70% partly ✓ |
| dev-63 | dev | Config & CLI | 73% partly ✗ |
| dev-64 | dev | Admin API | 85% pass ✓ |
| dev-65 | dev | Admin API | 85% pass ✓ |
| dev-66 | dev | Admin API | 73% partly ✓ |
| dev-67 | dev | App system | 92% pass ✓ |
| dev-68 | dev | App system | 92% pass ✓ |
| dev-69 | dev | App system | 92% pass ✓ |
| dev-70 | dev | App system | 72% partly ✗ |
| dev-71 | dev | App system | 69% partly ✓ |
| func-01 | func | Merchant | 70% partly ✓ |
| func-02 | func | Merchant | 65% partly ✓ |
| func-03 | func | Merchant | 92% pass ✓ |
| func-04 | func | Merchant | 85% pass ✓ |
| func-05 | func | Merchant | 73% partly ✓ |
| func-06 | func | Merchant | 88% pass ✓ |
| func-07 | func | Merchant | 85% pass ✓ |
| func-08 | func | Merchant | 73% partly ✓ |
| func-09 | func | Merchant | 35% fail ✗ |
| func-10 | func | Merchant | 77% partly ✓ |
| func-11 | func | Merchant | 100% pass ✓ |
| func-12 | func | Merchant | 6% fail ✗ |
| edge-01 | edge | Trap | 100% pass – |
| edge-02 | edge | Trap | 100% pass – |
| edge-03 | edge | Trap | 92% pass – |
| edge-04 | edge | Trap | 92% pass – |
| edge-05 | edge | Trap | 100% pass – |
| edge-06 | edge | Trap | 88% pass – |
| edge-07 | edge | Trap | 85% pass – |
| edge-08 | edge | Trap | 88% pass – |
| edge-09 | edge | Trap | 73% partly – |
| gap-01 | gap | Gap | 70% partly – |
| gap-02 | gap | Gap | 85% pass – |
| gap-03 | gap | Gap | 83% partly – |
| gap-04 | gap | Gap | 100% pass – |
| gap-05 | gap | Gap | 85% pass – |
| gap-06 | gap | Gap | 100% pass – |
| gap-07 | gap | Gap | 100% pass – |
| gap-08 | gap | Gap | 100% pass – |

## Requests and responses

What each discover agent was given and what it reported.

### mcp-wiki

| Case | Page reached | Findability | Top citation | Memory claims | Verdict | Raw |
| --- | --- | --- | --- | --- | --- | --- |
| dev-01 | `platform/dev/6.6/guides/plugins/plugins/framework/data-handling/add-complex-data-to-existing-entities.md` ≠ target | fail | 2/2 | 0 | partly | `raw/mcp-wiki/dev-01.json` |
| dev-02 | `platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/plugin-lifecycle.md` = target | pass | 1/1 | 0 | pass | `raw/mcp-wiki/dev-02.json` |
| dev-03 | `platform/dev/6.7/guides/plugins/plugins/framework/store-api/add-store-api-route.md` = target | pass | 1/1 | 0 | pass | `raw/mcp-wiki/dev-03.json` |
| dev-04 | `platform/dev/6.7/guides/plugins/plugins/content/cms/add-cms-element.md` = target | pass | 1/1 | 0 | pass | `raw/mcp-wiki/dev-04.json` |
| dev-05 | `platform/dev/6.7/guides/plugins/themes/styling/override-bootstrap-variables-in-a-theme.md` ≠ target | pass | 2/2 | 0 | pass | `raw/mcp-wiki/dev-05.json` |
| dev-06 | `platform/dev/6.7/guides/plugins/plugins/framework/flow/add-flow-builder-action.md` = target | pass | 2/2 | 0 | partly | `raw/mcp-wiki/dev-06.json` |
| dev-07 | `platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-custom-complex-data.md` = target | fail | 1/1 | 0 | pass | `raw/mcp-wiki/dev-07.json` |
| dev-08 | `platform/dev/6.7/guides/plugins/plugins/framework/data-handling/reading-data.md` = target | pass | 1/1 | 0 | pass | `raw/mcp-wiki/dev-08.json` |
| dev-09 | `platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-data-translations.md` = target | pass | 1/1 | 0 | pass | `raw/mcp-wiki/dev-09.json` |
| dev-10 | `platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-data-indexer.md` = target | pass | 1/1 | 0 | partly | `raw/mcp-wiki/dev-10.json` |
| dev-11 | `platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md` ≠ target | fail | 2/2 | 0 | partly | `raw/mcp-wiki/dev-11.json` |
| dev-12 | `platform/dev/6.6/guides/plugins/plugins/plugin-fundamentals/dependency-injection.md` = target | pass | 1/1 | 0 | pass | `raw/mcp-wiki/dev-12.json` |
| dev-13 | `—` ≠ target | fail | 1/1 | 0 | fail | `raw/mcp-wiki/dev-13.json` |
| dev-14 | `platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md` = target | pass | 1/1 | 0 | pass | `raw/mcp-wiki/dev-14.json` |
| dev-15 | `platform/dev/6.7/guides/plugins/plugins/framework/event/finding-events.md` = target | pass | 1/1 | 0 | partly | `raw/mcp-wiki/dev-15.json` |
| dev-16 | `platform/dev/6.7/guides/plugins/plugins/checkout/order/listen-to-order-changes.md` = target | pass | 1/1 | 0 | pass | `raw/mcp-wiki/dev-16.json` |
| dev-17 | `platform/dev/6.7/guides/plugins/plugins/checkout/cart/change-price-of-item.md` = target | pass | 1/1 | 0 | pass | `raw/mcp-wiki/dev-17.json` |
| dev-18 | `platform/dev/6.7/guides/plugins/plugins/checkout/cart/add-cart-items.md` ≠ target | pass | 3/3 | 1 | pass | `raw/mcp-wiki/dev-18.json` |
| dev-19 | `platform/dev/6.7/guides/plugins/plugins/framework/message-queue/add-message-to-queue.md` ≠ target | pass | 2/2 | 0 | partly | `raw/mcp-wiki/dev-19.json` |
| dev-20 | `platform/dev/6.7/guides/plugins/plugins/framework/rule/add-custom-rules.md` = target | pass | 1/1 | 0 | pass | `raw/mcp-wiki/dev-20.json` |
| dev-21 | `platform/dev/6.7/guides/plugins/plugins/framework/flow/add-flow-builder-trigger.md` = target | pass | 1/1 | 0 | partly | `raw/mcp-wiki/dev-21.json` |
| dev-22 | `platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-plugin-configuration.md` = target | fail | 1/1 | 0 | pass | `raw/mcp-wiki/dev-22.json` |
| dev-23 | `platform/dev/6.7/guides/plugins/plugins/content/mail/add-mail-template.md` = target | pass | 1/1 | 0 | partly | `raw/mcp-wiki/dev-23.json` |
| dev-24 | `platform/dev/6.7/guides/plugins/plugins/content/seo/add-custom-seo-url.md` = target | pass | 1/1 | 0 | partly | `raw/mcp-wiki/dev-24.json` |
| dev-25 | `—` ≠ target | fail | 1/1 | 0 | fail | `raw/mcp-wiki/dev-25.json` |
| dev-26 | `platform/dev/6.7/guides/plugins/plugins/checkout/documents/legacy/add-custom-document-type.md` ≠ target | pass | 3/3 | 0 | partly | `raw/mcp-wiki/dev-26.json` |
| dev-27 | `platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-templates.md` = target | pass | 1/1 | 0 | pass | `raw/mcp-wiki/dev-27.json` |
| dev-28 | `platform/dev/6.7/guides/plugins/plugins/storefront/javascript/override-existing-javascript.md` = target | pass | 1/1 | 0 | pass | `raw/mcp-wiki/dev-28.json` |
| dev-29 | `platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-data-to-storefront-page.md` = target | pass | 1/1 | 0 | pass | `raw/mcp-wiki/dev-29.json` |
| dev-30 | `platform/dev/6.7/guides/plugins/plugins/storefront/howto/add-listing-filters.md` = target | pass | 1/1 | 0 | pass | `raw/mcp-wiki/dev-30.json` |
| dev-31 | `platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-scss-variables.md` = target | pass | 1/1 | 0 | pass | `raw/mcp-wiki/dev-31.json` |
| dev-32 | `platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/using-custom-fields.md` ≠ target | pass | 2/2 | 0 | pass | `raw/mcp-wiki/dev-32.json` |
| dev-33 | `platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-module.md` = target | pass | 1/1 | 0 | pass | `raw/mcp-wiki/dev-33.json` |
| dev-34 | `platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-components.md` = target | pass | 1/1 | 0 | pass | `raw/mcp-wiki/dev-34.json` |
| dev-35 | `platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/using-data-handling.md` = target | pass | 1/1 | 0 | pass | `raw/mcp-wiki/dev-35.json` |
| dev-36 | `platform/dev/6.7/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.md` = target | pass | 1/1 | 0 | pass | `raw/mcp-wiki/dev-36.json` |
| dev-37 | `platform/dev/6.7/guides/development/testing/unit/php-unit.md` = target | pass | 1/1 | 0 | pass | `raw/mcp-wiki/dev-37.json` |
| dev-38 | `platform/dev/6.7/guides/development/testing/unit/jest-admin.md` = target | pass | 1/1 | 0 | pass | `raw/mcp-wiki/dev-38.json` |
| dev-39 | `platform/dev/6.7/guides/development/testing/legacy/_index.md` ≠ target | fail | 2/2 | 0 | fail | `raw/mcp-wiki/dev-39.json` |
| dev-40 | `platform/dev/6.7/guides/upgrades-migrations/upgrade-shopware.md` = target | fail | 1/1 | 0 | pass | `raw/mcp-wiki/dev-40.json` |
| dev-41 | `platform/dev/6.7/guides/hosting/_index.md` = target | fail | 1/1 | 0 | partly | `raw/mcp-wiki/dev-41.json` |
| dev-42 | `platform/dev/6.7/products/tools/cli/project-commands/upgrade.md` = target | pass | 1/1 | 0 | pass | `raw/mcp-wiki/dev-42.json` |
| dev-43 | `platform/dev/6.7/guides/upgrades-migrations/administration/vite.md` = target | pass | 1/1 | 0 | partly | `raw/mcp-wiki/dev-43.json` |
| dev-44 | `platform/dev/6.7/guides/upgrades-migrations/administration/vue3.md` = target | pass | 1/1 | 0 | partly | `raw/mcp-wiki/dev-44.json` |
| dev-45 | `platform/dev/6.7/guides/upgrades-migrations/administration/pinia.md` = target | pass | 1/1 | 0 | pass | `raw/mcp-wiki/dev-45.json` |
| dev-46 | `platform/dev/6.7/guides/plugins/plugins/checkout/payment/add-payment-plugin.md` ≠ target | pass | 1/1 | 0 | fail | `raw/mcp-wiki/dev-46.json` |
| dev-47 | `—` ≠ target | fail | 1/1 | 0 | fail | `raw/mcp-wiki/dev-47.json` |
| dev-48 | `platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md` = target | pass | 1/1 | 0 | pass | `raw/mcp-wiki/dev-48.json` |
| dev-49 | `platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-controller.md` = target | pass | 1/1 | 0 | pass | `raw/mcp-wiki/dev-49.json` |
| dev-50 | `platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-scheduled-task.md` = target | pass | 1/1 | 0 | pass | `raw/mcp-wiki/dev-50.json` |
| dev-51 | `platform/dev/6.7/guides/plugins/plugins/framework/data-handling/entities-via-attributes.md` = target | pass | 1/1 | 0 | partly | `raw/mcp-wiki/dev-51.json` |
| dev-52 | `platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md` = target | pass | 1/1 | 0 | pass | `raw/mcp-wiki/dev-52.json` |
| dev-53 | `platform/dev/6.7/guides/plugins/themes/configuration/theme-configuration.md` = target | pass | 1/1 | 0 | pass | `raw/mcp-wiki/dev-53.json` |
| dev-54 | `platform/dev/6.7/guides/plugins/plugins/storefront/advanced/add-cookie-to-manager.md` = target | pass | 1/1 | 0 | pass | `raw/mcp-wiki/dev-54.json` |
| dev-55 | `platform/dev/6.7/guides/development/accessibility/storefront-accessibility.md` = target | pass | 1/1 | 0 | fail | `raw/mcp-wiki/dev-55.json` |
| dev-56 | `platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-header-footer.md` = target | pass | 1/1 | 0 | pass | `raw/mcp-wiki/dev-56.json` |
| dev-57 | `platform/dev/6.7/products/extensions/b2b-suite-migration/execution/running-migration.md` = target | pass | 1/1 | 0 | pass | `raw/mcp-wiki/dev-57.json` |
| dev-58 | `platform/dev/6.7/guides/hosting/infrastructure/redis.md` = target | pass | 1/1 | 0 | partly | `raw/mcp-wiki/dev-58.json` |
| dev-59 | `platform/dev/6.7/guides/hosting/infrastructure/reverse-http-cache.md` = target | pass | 1/1 | 0 | partly | `raw/mcp-wiki/dev-59.json` |
| dev-60 | `platform/dev/6.7/guides/hosting/infrastructure/message-queue.md` = target | pass | 1/1 | 0 | partly | `raw/mcp-wiki/dev-60.json` |
| dev-61 | `platform/dev/6.7/guides/hosting/infrastructure/elasticsearch/elasticsearch-setup.md` = target | pass | 1/1 | 0 | partly | `raw/mcp-wiki/dev-61.json` |
| dev-62 | `platform/dev/6.7/guides/hosting/configurations/shopware/environment-variables.md` = target | pass | 2/2 | 1 | partly | `raw/mcp-wiki/dev-62.json` |
| dev-63 | `platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md` ≠ target | fail | 1/1 | 0 | partly | `raw/mcp-wiki/dev-63.json` |
| dev-64 | `platform/dev/6.7/guides/development/integrations-api/auth-api-requests.md` = target | pass | 2/2 | 0 | pass | `raw/mcp-wiki/dev-64.json` |
| dev-65 | `platform/dev/6.7/guides/development/integrations-api/search-criteria.md` = target | pass | 1/1 | 0 | pass | `raw/mcp-wiki/dev-65.json` |
| dev-66 | `platform/dev/6.7/guides/development/integrations-api/request-headers.md` = target | pass | 1/1 | 0 | partly | `raw/mcp-wiki/dev-66.json` |
| dev-67 | `platform/dev/6.7/guides/plugins/apps/app-base-guide.md` = target | pass | 1/1 | 0 | pass | `raw/mcp-wiki/dev-67.json` |
| dev-68 | `platform/dev/6.7/guides/plugins/apps/lifecycle/app-registration-setup.md` = target | pass | 1/1 | 0 | pass | `raw/mcp-wiki/dev-68.json` |
| dev-69 | `platform/dev/6.7/guides/plugins/apps/lifecycle/webhook.md` = target | pass | 1/1 | 0 | pass | `raw/mcp-wiki/dev-69.json` |
| dev-70 | `platform/dev/6.7/guides/plugins/apps/checkout/payment.md` = target | fail | 1/1 | 0 | partly | `raw/mcp-wiki/dev-70.json` |
| dev-71 | `platform/dev/6.7/guides/plugins/apps/custom-data/custom-entities.md` = target | pass | 1/1 | 0 | partly | `raw/mcp-wiki/dev-71.json` |
| func-01 | `platform/func/extensions/dynamiccontent.md` ≠ target | pass | 3/3 | 1 | partly | `raw/mcp-wiki/func-01.json` |
| func-02 | `platform/func/settings/shipping.md` ≠ target | pass | 3/3 | 0 | partly | `raw/mcp-wiki/func-02.json` |
| func-03 | `platform/func/marketing/promotions.md` = target | pass | 1/1 | 0 | pass | `raw/mcp-wiki/func-03.json` |
| func-04 | `platform/func/migration-en/Migrationprocess.md` ≠ target | pass | 2/2 | 0 | pass | `raw/mcp-wiki/func-04.json` |
| func-05 | `platform/func/settings/saleschannel.md` = target | pass | 1/1 | 0 | partly | `raw/mcp-wiki/func-05.json` |
| func-06 | `platform/func/settings/Flow-Builder.md` = target | pass | 1/1 | 0 | pass | `raw/mcp-wiki/func-06.json` |
| func-07 | `platform/func/shopware-en/settings/importexport.md` = target | pass | 1/1 | 0 | pass | `raw/mcp-wiki/func-07.json` |
| func-08 | `platform/func/settings/custom-fields.md` = target | pass | 1/1 | 0 | partly | `raw/mcp-wiki/func-08.json` |
| func-09 | `—` ≠ target | fail | 1/1 | 0 | fail | `raw/mcp-wiki/func-09.json` |
| func-10 | `platform/func/shopware-6-de/Catalogues/Dynamicproductgroups.md` = target | pass | 1/1 | 0 | partly | `raw/mcp-wiki/func-10.json` |
| func-11 | `platform/func/settings/system/user.md` ≠ target | pass | 2/2 | 0 | pass | `raw/mcp-wiki/func-11.json` |
| func-12 | `platform/func/extensions/customer-specific-pricing.md` ≠ target | fail | 2/2 | 0 | fail | `raw/mcp-wiki/func-12.json` |
| edge-01 | `—` = target | n/a | 0/0 | 1 | pass | `raw/mcp-wiki/edge-01.json` |
| edge-02 | `—` = target | n/a | 0/0 | 1 | pass | `raw/mcp-wiki/edge-02.json` |
| edge-03 | `—` = target | n/a | 1/1 | 0 | pass | `raw/mcp-wiki/edge-03.json` |
| edge-04 | `—` ≠ target | n/a | 2/2 | 0 | pass | `raw/mcp-wiki/edge-04.json` |
| edge-05 | `—` ≠ target | n/a | 1/1 | 0 | pass | `raw/mcp-wiki/edge-05.json` |
| edge-06 | `—` ≠ target | n/a | 2/2 | 1 | pass | `raw/mcp-wiki/edge-06.json` |
| edge-07 | `—` ≠ target | n/a | 1/1 | 0 | pass | `raw/mcp-wiki/edge-07.json` |
| edge-08 | `—` ≠ target | n/a | 2/2 | 1 | pass | `raw/mcp-wiki/edge-08.json` |
| edge-09 | `—` ≠ target | n/a | 1/1 | 0 | partly | `raw/mcp-wiki/edge-09.json` |
| gap-01 | `—` = target | n/a | 2/2 | 2 | partly | `raw/mcp-wiki/gap-01.json` |
| gap-02 | `—` = target | n/a | 1/1 | 0 | pass | `raw/mcp-wiki/gap-02.json` |
| gap-03 | `—` = target | n/a | 1/1 | 0 | partly | `raw/mcp-wiki/gap-03.json` |
| gap-04 | `—` = target | n/a | 1/1 | 0 | pass | `raw/mcp-wiki/gap-04.json` |
| gap-05 | `—` = target | n/a | 3/3 | 0 | pass | `raw/mcp-wiki/gap-05.json` |
| gap-06 | `—` = target | n/a | 3/3 | 1 | pass | `raw/mcp-wiki/gap-06.json` |
| gap-07 | `—` = target | n/a | 3/3 | 0 | pass | `raw/mcp-wiki/gap-07.json` |
| gap-08 | `—` = target | n/a | 2/2 | 0 | pass | `raw/mcp-wiki/gap-08.json` |

## Scores by case

### mcp-wiki

| Case | Grounding | Accuracy | Completeness | Citation | Honesty | Actionability | Total | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dev-01 | 100 | 0 | 40 | 100 | 100 | 100 | 66% | partly |
| dev-02 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-03 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-04 | 100 | 70 | 70 | 100 | 100 | 70 | 85% | pass |
| dev-05 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-06 | 100 | 40 | 100 | 100 | 100 | 70 | 82% | partly |
| dev-07 | 100 | 40 | 100 | 100 | 100 | 100 | 85% | pass |
| dev-08 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-09 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-10 | 100 | 40 | 70 | 100 | 100 | 70 | 77% | partly |
| dev-11 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| dev-12 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-13 | 0 | 40 | 40 | 0 | 0 | 40 | 20% | fail |
| dev-14 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-15 | 100 | 40 | 70 | 100 | 100 | 70 | 77% | partly |
| dev-16 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-17 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-18 | 100 | 70 | 100 | 40 | 100 | 100 | 86% | pass |
| dev-19 | 100 | 0 | 70 | 100 | 100 | 40 | 64% | partly |
| dev-20 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-21 | 100 | 0 | 70 | 100 | 100 | 40 | 64% | partly |
| dev-22 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-23 | 100 | 0 | 40 | 100 | 100 | 70 | 63% | partly |
| dev-24 | 100 | 70 | 70 | 100 | 0 | 100 | 73% | partly |
| dev-25 | 0 | 70 | 70 | 0 | 0 | 40 | 32% | fail |
| dev-26 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| dev-27 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-28 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-29 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-30 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-31 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-32 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-33 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-34 | 100 | 70 | 70 | 100 | 100 | 70 | 85% | pass |
| dev-35 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-36 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-37 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-38 | 100 | 70 | 70 | 100 | 100 | 70 | 85% | pass |
| dev-39 | 100 | 0 | 0 | 100 | 100 | 40 | 54% | fail |
| dev-40 | 100 | 40 | 100 | 100 | 100 | 100 | 85% | pass |
| dev-41 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| dev-42 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-43 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| dev-44 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| dev-45 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-46 | 100 | 40 | 40 | 100 | 0 | 40 | 55% | fail |
| dev-47 | 0 | 100 | 100 | 0 | 0 | 100 | 50% | fail |
| dev-48 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-49 | 100 | 40 | 100 | 100 | 100 | 100 | 85% | pass |
| dev-50 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-51 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| dev-52 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-53 | 100 | 40 | 100 | 100 | 100 | 100 | 85% | pass |
| dev-54 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-55 | 100 | 0 | 40 | 100 | 0 | 40 | 45% | fail |
| dev-56 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-57 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-58 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| dev-59 | 100 | 40 | 40 | 100 | 100 | 100 | 76% | partly |
| dev-60 | 100 | 0 | 100 | 100 | 100 | 70 | 72% | partly |
| dev-61 | 100 | 0 | 70 | 100 | 100 | 70 | 67% | partly |
| dev-62 | 70 | 40 | 70 | 100 | 100 | 70 | 70% | partly |
| dev-63 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| dev-64 | 100 | 70 | 70 | 100 | 100 | 70 | 85% | pass |
| dev-65 | 100 | 40 | 100 | 100 | 100 | 100 | 85% | pass |
| dev-66 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| dev-67 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-68 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-69 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-70 | 100 | 0 | 100 | 100 | 100 | 70 | 72% | partly |
| dev-71 | 100 | 0 | 100 | 100 | 100 | 40 | 69% | partly |
| func-01 | 70 | 40 | 70 | 100 | 100 | 70 | 70% | partly |
| func-02 | 100 | 70 | 40 | 100 | 0 | 70 | 65% | partly |
| func-03 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| func-04 | 100 | 40 | 100 | 100 | 100 | 100 | 85% | pass |
| func-05 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| func-06 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| func-07 | 100 | 40 | 100 | 100 | 100 | 100 | 85% | pass |
| func-08 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| func-09 | 0 | 70 | 70 | 0 | 0 | 70 | 35% | fail |
| func-10 | 100 | 40 | 70 | 100 | 100 | 70 | 77% | partly |
| func-11 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| func-12 | 0 | 0 | 40 | 0 | 0 | 0 | 6% | fail |
| edge-01 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| edge-02 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| edge-03 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| edge-04 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| edge-05 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| edge-06 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| edge-07 | 100 | 70 | 70 | 100 | 100 | 70 | 85% | pass |
| edge-08 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| edge-09 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| gap-01 | 70 | 40 | 70 | 100 | 100 | 70 | 70% | partly |
| gap-02 | 100 | 100 | 100 | 100 | 0 | 100 | 85% | pass |
| gap-03 | 100 | 70 | 40 | 100 | 100 | 100 | 83% | partly |
| gap-04 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| gap-05 | 100 | 70 | 70 | 100 | 100 | 70 | 85% | pass |
| gap-06 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| gap-07 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| gap-08 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |

## Failures and official references

- **dev-01 (mcp-wiki)** — partly, 66%
  - Answer presents `getDefinitionClass()` as the extension hook without noting that in 6.7 it does not exist and `getEntityName()` is the sole abstract method — exactly the documented defect this case exists to catch (cases.md preamble).
  - Association-field restriction (only AssociationField/FkField+ReferenceVersionField/Runtime allowed, else a thrown exception) is not stated; answer instead lists generic association types.
  - Bulk extension mechanism (tag `shopware.bulk.entity.extension`) correctly covered.
  - 3 list/grep calls before the target read (findabilityStrict fail); drift to the 6.6 revision of the page is the root cause of the wrong-version answer, noted per rubric drift tolerance but content here is materially different across versions so drift does not rescue findability.
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/add-complex-data-to-existing-entities.html — "In 6.7 the single abstract method — the only mandatory implementation — is `getEntityName(): string`, returning the entity name (e.g. `ProductDefinition::ENTITY_NAME`); `getDefinitionClass()` does not exist in 6.7."
- **dev-06 (mcp-wiki)** — partly, 82%
  - `FlowAction` abstract class, `getName()`/`requirements()`/`handleFlow()`, and the `flow.action` tag with `key`/`priority` are all correctly covered.
  - Data-access API is given as `$flow->getStore($key)`/`$flow->getData($key)`, but expected fact 3 (code-verified) is `$flow->getConfig()` for sequence config and `$flow->hasData()/getData()` for event data — `getStore()` is not part of the confirmed contract.
  - Admin registration is described as overriding the `sw-flow-sequence-action` component, but expected fact 3 (code-verified) names the `flowBuilderService` singleton and its `addActionNames()`/`addLabels()`/`addIcons()`/`addGroups()`/`addActionGroupMapping()` methods — a different, unconfirmed procedure.
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/framework/flow/add-flow-builder-action.html — "the service must be tagged `flow.action` **with a `key` attribute** — `FlowExecutor` receives the actions as a `tagged_iterator … index-by="key"`"
- **dev-10 (mcp-wiki)** — partly, 77%
  - Answer lists only 4 of the 6 abstract members of `EntityIndexer` (`getName`, `iterate`, `update`, `handle`), omitting the mandatory `getTotal()` and `getDecorated()` — a developer following this recipe alone will hit a fatal 'class must implement abstract method' error.
  - `bin/console dal:refresh:index` and the `DISABLE_INDEXING` re-entrancy escape hatch are correctly covered.
  - Does not mention that the command takes no positional entity argument, only `--use-queue`/`--skip`/`--only`.
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/add-data-indexer.html — "Extend `Shopware\Core\Framework\DataAbstractionLayer\Indexing\EntityIndexer` and implement all **six** abstract members — `getName(): string`, `iterate(?array $offset): ?EntityIndexingMessage`, `update(EntityWrittenContainerEvent $event): ?EntityIndexingMessage`, `handle(EntityIndexingMessage $message): void`, `getTotal(): int` and `getDecorated(): EntityIndexer`"
- **dev-11 (mcp-wiki)** — partly, 80%
  - Correctly explains the autowire/autoconfigure opt-in requirement and explicit-argument fallback (`service()` helper).
  - States 'services.xml is deprecated starting with Symfony 7.4 and unsupported in Symfony 8.0' as the reason services.php is 'the current file for 6.7' — the code-verified fact is that XML loads silently with no deprecation through 6.7.13.0, and the deprecation is a Shopware-specific gate introduced only at 6.7.14.0 (`Feature::triggerDeprecationOrThrow('v6.8.0.0', …)`), not a general Symfony-version fact. This materially misstates when/why XML becomes deprecated.
  - 4 list/grep calls before the target read (findabilityStrict fail); selfReportDelta shows one un-logged `read_doc` call, judged immaterial (1 of 10).
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/services/dependency-injection.html — "Autowiring is **not** on by default for a plugin's services: the generated skeleton is a bare `<services>` element with no `<defaults autowire="true" autoconfigure="true"/>`"
- **dev-13 (mcp-wiki)** — fail, 20%
  - selfReportDelta shows the ground-truth transcript made zero access calls (`actual: 0`, `retrievalCalls: 0`) while the report's `toolCallLog` claims one `read_doc` of `adjusting-service.md` and the answer cites it with a full, richly-detailed technical answer — the entire retrieval provenance is fabricated. This is a materially fabricated self-report, honesty = 0 per rubric.
  - Because no genuine retrieval occurred, the citation cannot correspond to anything actually done in this run despite the file/range existing in the corpus — citation = 0.
  - The answer's content partially agrees with the extension-point/decoration facts (abstract-class contract, `.pre`/`.post`/`.error` mention) but omits the `ExtensionDispatcher`/`Extension` class names and the file-format nuance entirely.
  - Target was never read (findabilityStrict fail, pageReached null).
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/services/adjusting-service.html — "The decorator must extend the scope's **abstract** class — not the concrete implementation — take the inner instance as a constructor argument and return it from `getDecorated()`"
- **dev-15 (mcp-wiki)** — partly, 77%
  - Correctly identifies that `{route}.render` fires before Twig rendering (not a post-render event) and covers route-event families, DAL naming convention and page-loaded events.
  - Recommends searching for the `@Event` annotation as a discovery technique — expected fact 3 (code-verified) states this string has zero occurrences anywhere under `vendor/shopware` and is a dead search term; recommending it as if functional is a materially misleading discovery instruction.
  - Omits that `bin/console debug:event-dispatcher` only lists events with an already-registered listener (answers 'who listens', not 'what is dispatched') and that `debug:business-events` is the real registry for business/flow events — fact 3's central caveat is missing.
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/framework/event/finding-events.html — "The documented `@Event` search term is dead — the string does not occur anywhere under `vendor/shopware`."
- **dev-19 (mcp-wiki)** — partly, 64%
  - Handler shape (`#[AsMessageHandler]`, `__invoke`) and message routing (`AsyncMessageInterface`→async, `LowPriorityMessageInterface`→low_priority) are correctly covered.
  - States 'Registration is automatic: a handler class carrying #[AsMessageHandler] is auto-tagged with messenger.message_handler — no manual services.php tagging is required' — this directly contradicts the code-verified expected fact that Shopware never marks plugin services autoconfigured, so the attribute alone does NOT register a plugin handler without an explicit tag or the plugin's own `autoconfigure="true"`. Following this advice would silently produce an unregistered handler.
  - Bus id given as `messenger.default_bus`; expected facts name it `messenger.bus.default` — a minor naming inversion.
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/framework/message-queue/add-message-handler.html — "Shopware loads plugin service files with no defaults and never marks anything autoconfigured … the service must be tagged `messenger.message_handler` unless the plugin's own services file declares `autoconfigure="true"`"
- **dev-21 (mcp-wiki)** — partly, 64%
  - Explicitly recommends 'give the subscriber a high priority (e.g. 1000) so it registers before other trigger subscribers' — this is precisely the documented trap the case's own Trap note calls out: 'An answer that passes must not require an elevated priority.' Directly reproduces the KB's known defect.
  - Does not mention that `$event->getName()` (not `define($class, $customName)`) is what actually matches the flow trigger at execution time — the second half of the trap is also unaddressed.
  - Aware-interface implementation and the `StorableFlow`/`FlowStorer` model are correctly covered.
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/framework/flow/add-flow-builder-trigger.html — "the documented recipe demands a listener priority of `1000` and presents the `BusinessEventCollectorEvent` subscriber as the only route; neither holds. An answer that passes must not require an elevated priority"
- **dev-23 (mcp-wiki)** — partly, 63%
  - States `system_default` 'must be 0 for plugin-provided templates' as a hard rule — expected fact 3 explicitly settles this as an unenforced editorial claim from the docs ('the docs' "must be 0" is editorial'; no code enforces it and `1` may be safer for a canonical template). Repeats a documented-but-disproven claim as fact.
  - Migration-based approach, insert order (type→translations→template→template_translation), and idempotency guard (`INSERT IGNORE`) are correctly covered.
  - Omits `CreateMailTemplateTrait` (the 6.7.8.0+ core helper) entirely, and omits that `mail_template_sales_channel` doesn't exist in 6.7 and no PHP/business-event registration is needed.
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/content/mail/add-mail-template.html — "`mail_template.system_default` is a plain `BoolField` that no code enforces … so `1` is the safer value for a type's canonical template — the docs' "must be 0" is editorial"
- **dev-24 (mcp-wiki)** — partly, 73%
  - selfReportDelta shows the self-reported log under-counts by half (2 of 4 actual calls missing) — a materially incomplete account of how the answer was obtained.
  - `SeoUrlRouteInterface` contract, `shopware.seo_url.route` tag, `seo_url_template` row requirement, and the need to call `SeoUrlUpdater::update()` manually (no automatic indexer pickup) are all correctly covered.
  - Fact 3 (per sales-channel/language generation derived from `sales_channel_domain`, no entity-side sales-channel association required) is entirely omitted.
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/content/seo/add-custom-seo-url.html — "no sales-channel association on the plugin entity is required: `SeoUrlUpdater::update()` derives its work list from the `sales_channel_domain` rows of active, non-API sales channels"
- **dev-25 (mcp-wiki)** — fail, 32%
  - selfReportDelta shows the ground-truth transcript made zero access calls (`actual: 0`) while the report's `toolCallLog` claims a grep plus a `read_doc` of `add-custom-commands.md`, and the answer cites that file with matching, verified content — the entire retrieval provenance is fabricated, mirroring dev-13's pattern exactly.
  - Content itself (`#[AsCommand]`, `console.command` tag, `Command` base class, `execute()`) is factually correct against the expected facts, but cannot be credited as genuinely retrieved.
  - Target was never actually read (findabilityStrict fail, pageReached null); omits fact 3 (command visible only while plugin installed+active) and fact 2's autoconfigure nuance.
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/plugin-fundamentals/add-custom-commands.html — "The command appears in `bin/console list` only while the plugin is installed **and** active"
- **dev-26 (mcp-wiki)** — partly, 80%
  - Documented trap (dev-26 known defect): answer presents the Document System v2 (AbstractDocumentType, tags shopware.document_v2.type/.provider) as a viable experimental alternative for 6.7.13.0; per code evidence these v2 classes/tags do not exist before 6.7.14.0, so this fails fact 1's requirement to reject the v2 recipe for this pin.
  - Legacy-path facts 2 and 3 (migration seeding document_type + number range; renderer names its own literal Twig template path) are both correctly and specifically covered.
  - All three citations verified against corpus content; no unlabelled factual claims beyond what the cited pages support.
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/document/add-custom-document-type.html — "The Document v2 recipe does not apply at this patch level: `Shopware\Core\Checkout\DocumentV2\Type\AbstractDocumentType` and the tag `shopware.document_v2.type` do not exist in 6.7.13.0"
- **dev-39 (mcp-wiki)** — fail, 54%
  - Documented trap (dev-39 known defect): the query presupposes Cypress, which has no support in 6.7. The answer notes Cypress is 'legacy' up front but then documents a full Cypress setup/run workflow in detail as if still usable — exactly the fabricated how-to the case expects the agent to refuse to give.
  - The correct current answer (Playwright + @shopware-ag/acceptance-test-suite, actor-pattern fixtures, npx playwright test) is not given at all, only name-dropped once with no specifics.
  - Findability fail: the target Playwright install-configure.md page was never reached; agent settled for the legacy/cypress pages instead (3 calls, target not found).
  - Official: https://developer.shopware.com/docs/guides/development/testing/e2e-playwright/install-configure.html — "There is no Cypress support in Shopware 6.7 — the premise of the question is stale."
- **dev-41 (mcp-wiki)** — partly, 80%
  - States the PHP requirement as open-ended 'PHP 8.2+', directly contradicting the expected fact that the Composer constraint is a bounded enumerated list (~8.2.0 || ~8.3.0 || ~8.4.0 || ~8.5.0), not 'any newer version'.
  - Correctly gives the database version numbers but omits that DatabaseConnectionFactory only checks them at install time, never during composer update.
  - Omits the Node version split between Administration and Storefront bundles, and does not name the correct single check command (composer check-platform-reqs); instead suggests running individual version-check commands manually.
  - Findability fail: 7 list/grep calls before the target page was reached.
  - Official: https://developer.shopware.com/docs/guides/hosting/ — "The PHP requirement Composer enforces is the enumerated constraint `"php": "~8.2.0 || ~8.3.0 || ~8.4.0 || ~8.5.0"` … a bounded list, not an open-ended "8.2 or newer""
- **dev-43 (mcp-wiki)** — partly, 73%
  - Fails the documented trap directly: presents creating vite.config.mts as step 1, a mandatory drop-in replacement for webpack.config.js, when the expected facts state a plugin needs no build config of its own and any vite.config.mts is optional.
  - States 'you can test the new system via the ADMIN_VITE feature flag' — the expected facts state explicitly that no such flag exists in 6.7 (the build is Vite-only and unconditional). This is a factually wrong statement.
  - Correctly covers the var/plugins.json / bundle:dump / entrypoints.json build chain (fact 3).
  - Official: https://developer.shopware.com/docs/guides/upgrades-migrations/administration/vite.html — "in 6.7 the administration build is Vite-only and unconditional (no `ADMIN_VITE` feature flag exists)"
- **dev-44 (mcp-wiki)** — partly, 73%
  - Correctly identifies and fixes the this.$tc-in-prop-default issue with Shopware.Snippet.tc.
  - For $parent, suggests 'this.$parent.$parent' as a usable workaround — exactly the hard-coded single-hop fix the expected facts call out as wrong in general (the wrapping depth is not fixed), even though it also recommends avoiding $parent altogether.
  - Omits fact 3 entirely: no mention of the code-mods migration command, that this.$tc itself is deprecated for v6.8.0 removal, or that the lint rule set does not cover TypeScript files.
  - Official: https://developer.shopware.com/docs/guides/upgrades-migrations/administration/vue3.html — "walk the chain matching `$options.name`, as core's `sw-sidebar` does, or drop `$parent` for provide/inject or a service."
- **dev-46 (mcp-wiki)** — fail, 55%
  - selfReportDelta shows the report's toolCallLog materially under-reports what actually happened (reported 1 call, ground truth shows 5, including two grep_docs and a list_docs never disclosed) — honesty scored 0.
  - Gives the exact invocation the case's Trap explicitly calls out as broken outside the shopware/shopware monorepo: 'composer run admin:code-mods -- --plugin-name example-plugin --fix -v 6.7'.
  - Correctly conveys the deprecated-prop default-false mechanism for sw-button/sw-card (fact 1), but omits that this only governs a 15-component list and that sw-tabs/sw-popover/sw-loader/sw-skeleton-bar use a different, currently-inert mechanism (fact 2).
  - Official: https://developer.shopware.com/docs/guides/upgrades-migrations/administration/meteor-components.html — "`-v`/`--shopware-version` is mandatory (without it `isVersionNewerOrSame` exits before ESLint is instantiated, so nothing is linted)"
- **dev-47 (mcp-wiki)** — fail, 50%
  - selfReportDelta shows the report claims 4 tool calls (grep_docs x2, list_docs, read_doc) but ground truth shows 0 actual calls — the entire toolCallLog and citation are fabricated relative to what the transcript proves happened; honesty and grounding both score 0.
  - The answer's content (AbstractPaymentHandler migration, single tag, technicalName requirement) is factually accurate and matches the expected facts closely, but with no supporting retrieval it cannot be credited as grounded or properly cited.
  - Findability fail: target never actually read per ground truth (callsToTarget 0, pageReached null).
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/payment/add-payment-plugin.html — "In 6.7 the handler extends the abstract class `Shopware\Core\Checkout\Payment\Cart\PaymentHandler\AbstractPaymentHandler`"
- **dev-51 (mcp-wiki)** — partly, 80%
  - Answer states the old XML-based entities.xml approach is 'superseded' by attributes; the confirmed expected answer's Trap says entities.xml still exists (as the app-only Custom Entity feature, read from Resources/entities.xml) and the classic EntityDefinition route is not deprecated — a materially wrong framing (Accuracy 40).
  - Missing fact 3 entirely: no mention that attribute entities do not create their own DB table and a plugin migration is required.
  - unlabelledUncitedCandidates are the same content already covered by the single full-page citation (1-61); not treated as separate unlabelled claims.
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/entities-via-attributes.html — "`entities.xml` still exists in 6.7 as the Custom Entity feature, but it is read from `Resources/entities.xml` — never `Resources/config/entities.xml` — and only for apps"
- **dev-55 (mcp-wiki)** — fail, 45%
  - Answer instructs setting ACCESSIBILITY_TWEAKS=1 in .env and frames the flag as still gating the markup; the confirmed expected answer states the flag is inert in 6.7 (declared in feature.yaml, read nowhere) — this is exactly the case's named Trap, and it's the central misleading statement (Accuracy 0).
  - Facts 2 and 3 are entirely missing: no sw_extends/parent()-throws mechanics, no block-by-block re-adoption specifics (line-item <li>, product-card stretched-link, SCSS $font-size-base, JS active-filter button).
  - selfReportDelta shows an unreported grep_docs call (reported 2, actual 3) — a real search call is missing from the self-reported toolCallLog (Honesty 0).
  - Official: https://developer.shopware.com/docs/guides/development/accessibility/storefront-accessibility.html — "The flag itself still exists as a declaration (`major: true`, `default: true`) but nothing in core or storefront reads it … so it cannot be used to keep the old markup"
- **dev-58 (mcp-wiki)** — partly, 80%
  - Answer never states that redis_url no longer exists/works in 6.7 — the query's whole premise ('my shopware.yaml still uses redis_url') is left uncorrected, which is exactly the case's named Trap.
  - Fact 2 (per-subsystem connection wiring — cart storage, number range, cache invalidation delay — and the build-time errors when missing) is entirely absent.
  - Eviction-policy-per-data-class guidance (fact 3) is accurately reproduced.
  - Official: https://developer.shopware.com/docs/guides/hosting/infrastructure/redis.html — "`redis_url` no longer exists anywhere in 6.7 core; every subsystem references a connection *name* instead"
- **dev-59 (mcp-wiki)** — partly, 76%
  - Answer presents use_varnish_xkey: true plus ban_method: "BAN" as 'the correct 6.7 configuration'; the confirmed expected answer states both are deprecated no-ops in 6.7 with zero effect — this is exactly the case's named Trap, reproduced as the recommended fix (Accuracy 40).
  - Fact 3 (delayed invalidation on by default, the shopware.invalidate_cache scheduled task, sw-force-cache-invalidate header) — the most likely real cause of 'Varnish is never invalidated' — is entirely missing.
  - Official: https://developer.shopware.com/docs/guides/hosting/infrastructure/reverse-http-cache.html — "`use_varnish_xkey`, `ban_method`, `ban_headers` and the whole `purge_all` block are accepted but deprecated no-ops … Varnish is now the default gateway class"
- **dev-60 (mcp-wiki)** — partly, 72%
  - Answer states 'a CLI worker must also be set up for the failed queue' and that failed messages are 'retried automatically 3 times, then deleted'; the confirmed expected answer states the opposite — failed is a dead-letter target drained only via messenger:failed:*, never consumed by a standing worker, and exhausted messages are moved to failed, never deleted. Both claims directly contradict decisive code evidence (Accuracy 0).
  - Correctly covers explicit transport naming (async, low_priority) and disabling the admin worker via enable_admin_worker: false, though omits that scheduled-task:run then becomes mandatory.
  - Official: https://developer.shopware.com/docs/guides/hosting/infrastructure/message-queue.html — "A message that exhausts `async`'s `max_retries: 3` is **moved to `failed`, not deleted**; the only discard is a message that fails again while being consumed from `failed` itself."
- **dev-61 (mcp-wiki)** — partly, 67%
  - Answer states 'the default is 3 shards / 3 replicas' unqualified; the confirmed expected answer states the storefront index env defaults were emptied in 6.7 (only the admin indices still default 3/3) — this is exactly the case's named Trap, reproduced as fact (Accuracy 0).
  - Names 'bin/console dal:refresh:index --use-queue' as the reindex command, where the confirmed command set is es:index/es:admin:index/es:create:alias/es:index:cleanup with no es:reindex equivalent.
  - Fact 3 (separate admin index config and es:admin:index command) is entirely missing.
  - Official: https://developer.shopware.com/docs/guides/hosting/infrastructure/elasticsearch/elasticsearch-setup.html — "In 6.7 both env defaults are **empty** — Shopware no longer forces 3 shards / 3 replicas"
- **dev-62 (mcp-wiki)** — partly, 70%
  - The whole precedence explanation (fact 1) is delivered as one [from memory]-labelled paragraph, correctly stating Symfony's file-override order and real-env-wins rule, but never mentions .env.local.php — the specific, decisive mechanism the confirmed expected answer names as 'the usual reason an edit to .env on a deployed shop has no effect'. Missing the actual answer to the reported symptom is a material gap (Accuracy 40).
  - Fact 2 (container %env() resolved at runtime, no cache:clear needed except feature-flag compiler pass) is not addressed at all.
  - Fact 3 (system_config not env-driven) is correctly and concretely grounded via the cited static-system-config.md page.
  - unlabelledUncitedCandidates are sub-sentences of the single already-labelled [from memory] paragraph, not a separate unlabelled claim; dropped from Citation scoring per brief.
  - Official: https://developer.shopware.com/docs/guides/hosting/configurations/shopware/environment-variables.html — "the deployed-shop symptom points at `.env.local.php` / a real environment variable / the database, **not** at a stale compiled container. An answer whose remedy is "run `cache:clear`" fails Accuracy"
- **dev-63 (mcp-wiki)** — partly, 73%
  - Findability fail: the target commands-reference.md was never read; a single grep matched the unrelated database-migrations.md guide instead, which was read and cited in its place.
  - Answer gives the generic 'database:migrate <Plugin> --all' command but never addresses why a staging deploy's migration might not have run — no mention of plugin-must-be-active, the silent 'no collection found... continuing' exit-0 behaviour for a typo'd/inactive identifier, or that a first-ever Migration directory needs cache:clear before the command can see it.
  - The normal lifecycle path (plugin:update / plugin:refresh, and the Deployment Helper's upgradeVersion skip logic) is not mentioned at all, leaving the actual troubleshooting question unanswered.
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/database/database-migrations.html — "Shopware ships no Doctrine migration tooling … the four commands are `database:create-migration`, `database:migrate`, `database:migrate-destructive`, `database:refresh-migration`"
- **dev-66 (mcp-wiki)** — partly, 73%
  - Answer describes sw-skip-trigger-flow as specific to 'bulk imports via the sync API'; the confirmed expected answer states it is resolved for every /api route, not only POST /api/_action/sync — a materially wrong scope claim (Accuracy 40).
  - sw-inheritance is described only via 'e.g. sw-inheritance: 1' without stating the decisive nuance that it is a presence-only check (any value, including 0/false, enables it).
  - sw-language-id vs sw-version-id validation asymmetry (language raises languageNotFound, version-id is taken unvalidated) is not mentioned.
  - Official: https://developer.shopware.com/docs/guides/development/integrations-api/request-headers.html — "`sw-inheritance` switches on `considerInheritance` … by **presence alone** — any value, including `0` or `false`, enables it"
- **dev-70 (mcp-wiki)** — partly, 72%
  - Answer lists 'cancelled, refunded, failed, in_progress, unconfirmed, reminded' as valid payment states alongside real transition action names (paid, authorize, chargeback); the confirmed expected answer explicitly states these state names are NOT accepted transition actions and would throw IllegalTransitionException — a decisive, dangerous contradiction (Accuracy 0).
  - Never mentions that the app's pay/finalize response itself must carry a valid shopware-app-signature header, a required security step.
  - findabilityStrict fail: 4 list/grep calls before the target page was read.
  - Official: https://developer.shopware.com/docs/guides/plugins/apps/checkout/payment.html — "State names such as `cancelled`, `refunded`, `failed`, `in_progress`, `unconfirmed`, `reminded` are **not** accepted: the string is handed unvalidated to `StateMachineRegistry::transition()`"
- **dev-71 (mcp-wiki)** — partly, 69%
  - Answer states fields are 'optionally marked store-api-aware=true to expose it via the Store API'; the confirmed expected answer states store-api-aware is REQUIRED on every scalar field (XSD use="required") and, decisively, that no generic Store API route for custom entities exists at all in 6.7 — storefront access goes only through an app-script endpoint. Both the 'optional' and 'exposes via Store API' claims are directly contradicted (Accuracy 0).
  - Correctly covers entities.xml location/schema, the ce_ shorthand prefix, and the Admin API underscore-to-hyphen URL mapping.
  - Does not mention the automatic CRUD permission grant for an app's own custom entities.
  - Official: https://developer.shopware.com/docs/guides/plugins/apps/custom-data/custom-entities.html — "`store-api-aware="true"` only attaches the `ApiAware` read-protection flag to the field — it creates **no** route: there is no generic Store API route for custom entities in 6.7"
- **func-01 (mcp-wiki)** — partly, 70%
  - The query's central ask — 'configure its visibility per sales channel' — is answered with category-level entry-point/navigation assignment and the separate Dynamic Access extension, never with the actual product_visibility mechanism (per-channel VISIBILITY_LINK/SEARCH/ALL rows) the confirmed expected answer names as decisive; this substitutes a different, tangential mechanism for the one asked about (Accuracy 40).
  - Required-fields-before-save and the create-route-has-no-tabs fact are correctly covered.
  - Variant display concept (single main variant vs fan-out) is named, but the 6.7-specific bug (NULL variantListingConfig collapsing the listing to one arbitrary child variant) is not mentioned.
  - The one unlabelled candidate about Dynamic Access is content from the already-cited dynamiccontent.md page, not a genuinely uncited claim; dropped from Citation scoring.
  - Official: https://docs.shopware.com/en/shopware-6-en/catalogues/products — "Per-sales-channel visibility is **not** a field on the product: it is a separate `product_visibility` row per channel"
- **func-02 (mcp-wiki)** — partly, 65%
  - selfReportDelta shows an unreported read_doc call (reported 4, actual 5) — an actual document fetch is missing from the self-reported toolCallLog, materially misrepresenting how the answer was obtained (Honesty 0).
  - Fact 1 (one nullable availability rule per method, RestrictDelete when in use) is correctly covered.
  - Facts 2 and 3 (condition-row/AndRule payload matching mechanics, and the double enforcement via CartRuleLoader's precomputed rule ids plus ShippingMethodBlockedError/PaymentMethodBlockedError) are essentially absent — the answer stays at UI/merchant level only.
  - Official: https://docs.shopware.com/en/shopware-6-en/settings/rules — "A shipping method and a payment method each reference **at most one** availability rule, through the nullable FK `availability_rule_id`"
- **func-05 (mcp-wiki)** — partly, 73%
  - Fact 1 (four sales-channel types incl. Agentic commerce; all fields Required regardless of type) not stated — answer lists only three types.
  - Fact 3 (sw-access-key header, SWSC prefix, no secret counterpart, key issued via GET /api/_action/access-key/sales-channel) not stated — answer only says the key is generated 'under the channel's own API access section'.
  - Fact 2 (domain binds url+language+currency+snippet set) is present.
  - Official: https://docs.shopware.com/en/shopware-6-en/settings/saleschannel — "it is prefixed `SWSC` (any other origin is rejected with `salesChannelNotFound` before the database is queried)"
- **func-08 (mcp-wiki)** — partly, 73%
  - Fact 2 (11 admin types collapsing to 8 stored types; Twig-name validation not enforced in 6.6) not addressed — answer lists only 10 types (missing Price field) and no stored-type distinction.
  - Fact 3 (writes limited to customer/customer_address/newsletter_recipient only, and the 6.6 data-loss hole on an empty customFields payload) not mentioned — answer implies 'Modifiable via Store API' alone suffices on any entity, which could mislead.
  - Fact 1 (entity-assignment relation, unavailable-if-no-relation) reasonably matched.
  - Official: https://docs.shopware.com/en/shopware-6-en/settings/custom-fields — "Read exposure, write exposure and cart exposure are **three independent columns written by three separate admin switches**"
- **func-09 (mcp-wiki)** — fail, 35%
  - Citation fabricated: the answer cites 'platform/func/settings/Paymentmethods.md:1-32' as if read, but toolCallLog contains only one grep_docs call on that path — no read_doc — and the audit marks matchesToolCallLog=false for this citation.
  - Findability fail: the target page was never actually read (targetRead=false, pageReached=null), despite the detailed, structured answer implying a full read.
  - Facts 1 and 2 (sales-channel assignment gate; availability-rule gate) are stated and appear accurate, but cannot be verified as genuinely retrieved rather than reconstructed from grep context/prior knowledge.
  - Fact 3 (handler-resolution gap; checkout-gateway RemovePaymentMethodCommand; PaymentMethodBlockedError) is not mentioned.
  - Official: https://docs.shopware.com/en/shopware-6-en/settings/Paymentmethods — "Switching a payment method **Active** does not make it appear: the Store API payment-method listing unconditionally adds the filter `payment_method.salesChannels.id` = current sales channel"
- **func-10 (mcp-wiki)** — partly, 77%
  - Fact 3's version pin is violated: the case explicitly states 'An answer that offers this option for 6.6 is wrong' about 'Keep matching variants grouped' (displayAsGroup), yet the answer (query spans 6.6+6.7) presents the feature without any 6.6-absence caveat.
  - Fact 2 (five usage places) only names three (category, product comparison/export, CMS slider) — cross-selling and the cart rule are missing.
  - Fact 1 (nested static/stream condition rows) reasonably matched via the AND/OR/SUB-CONDITION description.
  - Official: https://docs.shopware.com/en/shopware-6-de/Catalogues/Dynamicproductgroups — ""Keep matching variants grouped" (`displayAsGroup`) and the `internal` flag do **not** exist in 6.6"
- **func-12 (mcp-wiki)** — fail, 6%
  - selfReportDelta shows a materially under-reported toolCallLog (one read_doc call omitted) — mandatory Honesty=0 per rubric.
  - Central trap failed: the answer states the Flow Builder webhook/Call-URL action 'is a core Flow Builder feature' needing 'no plugin or paid extension' — this directly contradicts the case's confirmed fact that the webhook action is Evolve-plan/Commercial-gated, and is exactly the 'presents either capability as stock Shopware' failure the Trap note calls out.
  - The customer-specific-pricing half (Beyond plan, API-only) is correctly identified, but the webhook-action fabrication makes the answer actively dangerous to build against.
  - Findability fail: the actual wiki target (shopware-commercial.md) was never read; the agent instead read customer-specific-pricing.md and webhook-actions-in-flow-builder.md directly.
  - Official: https://docs.shopware.com/en/shopware-6-en/extensions/shopware-commercial — "Both are **Shopware Commercial** features and require that extension to be installed and activated against the booked plan"
- **edge-09 (mcp-wiki)** — partly, 73%
  - Central trap failed: the answer states 'In Shopware 6.7, Business Events are configured under Settings > Shop > Business Events' and that it 'remains in use... for the B2B-Suite', directly contradicting the confirmed fact that no such configuration screen exists in 6.6 or 6.7 and that the event_action tables were dropped by a V6_5 migration — this is exactly the known documentation defect cases.md flags for this case.
  - Fact 2 (Flow Builder with checkout.order.placed + action.mail.send) is correctly given as the modern alternative.
  - Fact 3 (Business Events survives only as a read-only event catalogue, no write side) is not mentioned.
  - Official: https://docs.shopware.com/en/shopware-6-en/settings/Business-Events — "no Business Events configuration screen exists in the 6.6 or 6.7 administration … the `event_action`, `event_action_rule` and `event_action_sales_channel` tables are dropped by a V6_5 migration"
- **gap-01 (mcp-wiki)** — partly, 70%
  - Correctly reports no dedicated plugin Admin API guide exists and names the Store API route guide and ACL guide as the closest analogues without presenting them as documenting the Admin API case.
  - Fact 3 violated: the answer invents a '#[Acl([...])] PHP attribute class' on the controller method; the expected fact states both RouteScope and Acl are plain Symfony #[Route] defaults (_routeScope/_acl), not separate attribute classes — this is exactly the invention the fact explicitly warns against, even though it is labelled [from memory].
  - The claim about the OpenAPI schema path 'Schema/AdminApi/' is presented as if the wiki explicitly states it, without a specific line-level citation for that claim.
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/framework/store-api/add-store-api-route.html — "the documentation corpus has no guide for adding a plugin controller under `/api/...` with the api route scope"
- **gap-03 (mcp-wiki)** — partly, 83%
  - Correctly reports the corpus has no coverage of the 6.7 OAuth/scope change and cites only the existing token-request guide.
  - Fact 2 requires flagging that the guide's own 'scopes: write' example body is not what a 6.7 server reads (scope is a singular space-delimited parameter) — the answer quotes this example verbatim without the required flag, a missed catch on the specific trap.
  - Fact 3 (no /api/oauth/authorize; unchanged scope identifiers) is not stated, which is acceptable since it is conditional.
  - Official: https://github.com/shopware/shopware/blob/trunk/UPGRADE-6.7.md#non-spec-compliant-apioauthtoken-requests-are-not-supported-anymore — "`/api/oauth/authorize` no longer exists in 6.7 — `AuthController` declares only `POST /api/oauth/token`"

## Accuracy cross-checks

| Option | Flagged | Fetched | Served from cache | Bands changed | Fetch failures |
| --- | --- | --- | --- | --- | --- |
| mcp-wiki | 77 of 100 | 0 | 0 | 0 | none |

All 77 flagged cases carried `Status: confirmed` in their expected-answer files, so each was settled directly from the file's own numbered facts and `[code: …]` evidence tags rather than a live fetch — the confirmed evidence is a stronger yardstick than the documentation page and re-fetching would reintroduce the circularity the ground-truthing process removed. No band moved from its shard-pass provisional value except one aggregator-level correction (see Audit warnings): dev-66's accuracy was restored from the accuracy pass's 70 back to the shard scorer's original 40, because the accuracy pass did not address the shard scorer's own finding of a materially wrong `sw-skip-trigger-flow` scope claim.

No band changed — every flagged case held its provisional accuracy (after the dev-66 correction above).

## Observations about source availability

- 12 `dev`/`func`/`edge`/`gap` cases have wiki target `none` (topic genuinely not documented in this corpus): edge-01, edge-02, edge-03, edge-08, gap-01, gap-02, gap-03, gap-04, gap-05, gap-06, gap-07, gap-08.
- No case in this run hit the Source-absent override (`sourceAbsentOverrideApplied` is false for all 100 cases) — the wiki corpus had *something* relevant for every query, including the deliberate trap and gap cases, so every honest not-found/gap report was scored as a real `pass`/`partly`/`fail` on its content, never as `unavailable`.
- All 9 `edge-*` cases and all 8 `gap-*` cases were scored under the normal rubric; 8 of 9 edge cases and 6 of 8 gap cases passed (a passing gap case is a confirmed documentation gap, not a KB success): gap-02, gap-04, gap-05, gap-06, gap-07, gap-08.
- Several failures reproduce documentation defects the suite deliberately probes (see `cases.md` "Known documentation defects"): dev-01 (getDefinitionClass() vs getEntityName()), dev-39 (Cypress vs Playwright), dev-26 (Document System v2 trap) among others — these are content defects in the ingested wiki pages, not agent errors.

## Recommended fixes

- dev-01 (mcp-wiki): Answer presents `getDefinitionClass()` as the extension hook without noting that in 6.7 it does not exist and `getEntityName()` is the sole abstract method — exactly the documented defect this case exists to catch (cases.md preamble). (accuracy=0, total=66%)
- dev-06 (mcp-wiki): `FlowAction` abstract class, `getName()`/`requirements()`/`handleFlow()`, and the `flow.action` tag with `key`/`priority` are all correctly covered. (accuracy=40, total=82%)
- dev-10 (mcp-wiki): Answer lists only 4 of the 6 abstract members of `EntityIndexer` (`getName`, `iterate`, `update`, `handle`), omitting the mandatory `getTotal()` and `getDecorated()` — a developer following this recipe alone will hit a fatal 'class must implement abstract method' error. (accuracy=40, total=77%)
- dev-11 (mcp-wiki): Correctly explains the autowire/autoconfigure opt-in requirement and explicit-argument fallback (`service()` helper). (accuracy=40, total=80%)
- dev-13 (mcp-wiki): selfReportDelta shows the ground-truth transcript made zero access calls (`actual: 0`, `retrievalCalls: 0`) while the report's `toolCallLog` claims one `read_doc` of `adjusting-service.md` and the answer cites it with a full, richly-detailed technical answer — the entire retrieval provenance is fabricated. This is a materially fabricated self-report, honesty = 0 per rubric. (accuracy=40, total=20%)
- dev-15 (mcp-wiki): Correctly identifies that `{route}.render` fires before Twig rendering (not a post-render event) and covers route-event families, DAL naming convention and page-loaded events. (accuracy=40, total=77%)
- dev-19 (mcp-wiki): Handler shape (`#[AsMessageHandler]`, `__invoke`) and message routing (`AsyncMessageInterface`→async, `LowPriorityMessageInterface`→low_priority) are correctly covered. (accuracy=0, total=64%)
- dev-21 (mcp-wiki): Explicitly recommends 'give the subscriber a high priority (e.g. 1000) so it registers before other trigger subscribers' — this is precisely the documented trap the case's own Trap note calls out: 'An answer that passes must not require an elevated priority.' Directly reproduces the KB's known defect. (accuracy=0, total=64%)
- dev-23 (mcp-wiki): States `system_default` 'must be 0 for plugin-provided templates' as a hard rule — expected fact 3 explicitly settles this as an unenforced editorial claim from the docs ('the docs' "must be 0" is editorial'; no code enforces it and `1` may be safer for a canonical template). Repeats a documented-but-disproven claim as fact. (accuracy=0, total=63%)
- dev-24 (mcp-wiki): selfReportDelta shows the self-reported log under-counts by half (2 of 4 actual calls missing) — a materially incomplete account of how the answer was obtained. (accuracy=70, total=73%)
- dev-25 (mcp-wiki): selfReportDelta shows the ground-truth transcript made zero access calls (`actual: 0`) while the report's `toolCallLog` claims a grep plus a `read_doc` of `add-custom-commands.md`, and the answer cites that file with matching, verified content — the entire retrieval provenance is fabricated, mirroring dev-13's pattern exactly. (accuracy=70, total=32%)
- dev-26 (mcp-wiki): Documented trap (dev-26 known defect): answer presents the Document System v2 (AbstractDocumentType, tags shopware.document_v2.type/.provider) as a viable experimental alternative for 6.7.13.0; per code evidence these v2 classes/tags do not exist before 6.7.14.0, so this fails fact 1's requirement to reject the v2 recipe for this pin. (accuracy=40, total=80%)
- dev-39 (mcp-wiki): Documented trap (dev-39 known defect): the query presupposes Cypress, which has no support in 6.7. The answer notes Cypress is 'legacy' up front but then documents a full Cypress setup/run workflow in detail as if still usable — exactly the fabricated how-to the case expects the agent to refuse to give. (accuracy=0, total=54%)
- dev-41 (mcp-wiki): States the PHP requirement as open-ended 'PHP 8.2+', directly contradicting the expected fact that the Composer constraint is a bounded enumerated list (~8.2.0 || ~8.3.0 || ~8.4.0 || ~8.5.0), not 'any newer version'. (accuracy=40, total=80%)
- dev-43 (mcp-wiki): Fails the documented trap directly: presents creating vite.config.mts as step 1, a mandatory drop-in replacement for webpack.config.js, when the expected facts state a plugin needs no build config of its own and any vite.config.mts is optional. (accuracy=40, total=73%)
- dev-44 (mcp-wiki): Correctly identifies and fixes the this.$tc-in-prop-default issue with Shopware.Snippet.tc. (accuracy=40, total=73%)
- dev-46 (mcp-wiki): selfReportDelta shows the report's toolCallLog materially under-reports what actually happened (reported 1 call, ground truth shows 5, including two grep_docs and a list_docs never disclosed) — honesty scored 0. (accuracy=40, total=55%)
- dev-47 (mcp-wiki): selfReportDelta shows the report claims 4 tool calls (grep_docs x2, list_docs, read_doc) but ground truth shows 0 actual calls — the entire toolCallLog and citation are fabricated relative to what the transcript proves happened; honesty and grounding both score 0. (accuracy=100, total=50%)
- dev-51 (mcp-wiki): Answer states the old XML-based entities.xml approach is 'superseded' by attributes; the confirmed expected answer's Trap says entities.xml still exists (as the app-only Custom Entity feature, read from Resources/entities.xml) and the classic EntityDefinition route is not deprecated — a materially wrong framing (Accuracy 40). (accuracy=40, total=80%)
- dev-55 (mcp-wiki): Answer instructs setting ACCESSIBILITY_TWEAKS=1 in .env and frames the flag as still gating the markup; the confirmed expected answer states the flag is inert in 6.7 (declared in feature.yaml, read nowhere) — this is exactly the case's named Trap, and it's the central misleading statement (Accuracy 0). (accuracy=0, total=45%)
- dev-58 (mcp-wiki): Answer never states that redis_url no longer exists/works in 6.7 — the query's whole premise ('my shopware.yaml still uses redis_url') is left uncorrected, which is exactly the case's named Trap. (accuracy=40, total=80%)
- dev-59 (mcp-wiki): Answer presents use_varnish_xkey: true plus ban_method: "BAN" as 'the correct 6.7 configuration'; the confirmed expected answer states both are deprecated no-ops in 6.7 with zero effect — this is exactly the case's named Trap, reproduced as the recommended fix (Accuracy 40). (accuracy=40, total=76%)
- dev-60 (mcp-wiki): Answer states 'a CLI worker must also be set up for the failed queue' and that failed messages are 'retried automatically 3 times, then deleted'; the confirmed expected answer states the opposite — failed is a dead-letter target drained only via messenger:failed:*, never consumed by a standing worker, and exhausted messages are moved to failed, never deleted. Both claims directly contradict decisive code evidence (Accuracy 0). (accuracy=0, total=72%)
- dev-61 (mcp-wiki): Answer states 'the default is 3 shards / 3 replicas' unqualified; the confirmed expected answer states the storefront index env defaults were emptied in 6.7 (only the admin indices still default 3/3) — this is exactly the case's named Trap, reproduced as fact (Accuracy 0). (accuracy=0, total=67%)
- dev-62 (mcp-wiki): The whole precedence explanation (fact 1) is delivered as one [from memory]-labelled paragraph, correctly stating Symfony's file-override order and real-env-wins rule, but never mentions .env.local.php — the specific, decisive mechanism the confirmed expected answer names as 'the usual reason an edit to .env on a deployed shop has no effect'. Missing the actual answer to the reported symptom is a material gap (Accuracy 40). (accuracy=40, total=70%)
- dev-63 (mcp-wiki): Findability fail: the target commands-reference.md was never read; a single grep matched the unrelated database-migrations.md guide instead, which was read and cited in its place. (accuracy=40, total=73%)
- dev-66 (mcp-wiki): Answer describes sw-skip-trigger-flow as specific to 'bulk imports via the sync API'; the confirmed expected answer states it is resolved for every /api route, not only POST /api/_action/sync — a materially wrong scope claim (Accuracy 40). (accuracy=40, total=73%)
- dev-70 (mcp-wiki): Answer lists 'cancelled, refunded, failed, in_progress, unconfirmed, reminded' as valid payment states alongside real transition action names (paid, authorize, chargeback); the confirmed expected answer explicitly states these state names are NOT accepted transition actions and would throw IllegalTransitionException — a decisive, dangerous contradiction (Accuracy 0). (accuracy=0, total=72%)
- dev-71 (mcp-wiki): Answer states fields are 'optionally marked store-api-aware=true to expose it via the Store API'; the confirmed expected answer states store-api-aware is REQUIRED on every scalar field (XSD use="required") and, decisively, that no generic Store API route for custom entities exists at all in 6.7 — storefront access goes only through an app-script endpoint. Both the 'optional' and 'exposes via Store API' claims are directly contradicted (Accuracy 0). (accuracy=0, total=69%)
- func-01 (mcp-wiki): The query's central ask — 'configure its visibility per sales channel' — is answered with category-level entry-point/navigation assignment and the separate Dynamic Access extension, never with the actual product_visibility mechanism (per-channel VISIBILITY_LINK/SEARCH/ALL rows) the confirmed expected answer names as decisive; this substitutes a different, tangential mechanism for the one asked about (Accuracy 40). (accuracy=40, total=70%)
- func-02 (mcp-wiki): selfReportDelta shows an unreported read_doc call (reported 4, actual 5) — an actual document fetch is missing from the self-reported toolCallLog, materially misrepresenting how the answer was obtained (Honesty 0). (accuracy=70, total=65%)
- func-05 (mcp-wiki): Fact 1 (four sales-channel types incl. Agentic commerce; all fields Required regardless of type) not stated — answer lists only three types. (accuracy=40, total=73%)
- func-08 (mcp-wiki): Fact 2 (11 admin types collapsing to 8 stored types; Twig-name validation not enforced in 6.6) not addressed — answer lists only 10 types (missing Price field) and no stored-type distinction. (accuracy=40, total=73%)
- func-09 (mcp-wiki): Citation fabricated: the answer cites 'platform/func/settings/Paymentmethods.md:1-32' as if read, but toolCallLog contains only one grep_docs call on that path — no read_doc — and the audit marks matchesToolCallLog=false for this citation. (accuracy=70, total=35%)
- func-10 (mcp-wiki): Fact 3's version pin is violated: the case explicitly states 'An answer that offers this option for 6.6 is wrong' about 'Keep matching variants grouped' (displayAsGroup), yet the answer (query spans 6.6+6.7) presents the feature without any 6.6-absence caveat. (accuracy=40, total=77%)
- func-12 (mcp-wiki): selfReportDelta shows a materially under-reported toolCallLog (one read_doc call omitted) — mandatory Honesty=0 per rubric. (accuracy=0, total=6%)
- edge-09 (mcp-wiki): Central trap failed: the answer states 'In Shopware 6.7, Business Events are configured under Settings > Shop > Business Events' and that it 'remains in use... for the B2B-Suite', directly contradicting the confirmed fact that no such configuration screen exists in 6.6 or 6.7 and that the event_action tables were dropped by a V6_5 migration — this is exactly the known documentation defect cases.md flags for this case. (accuracy=40, total=73%)
- gap-01 (mcp-wiki): Correctly reports no dedicated plugin Admin API guide exists and names the Store API route guide and ACL guide as the closest analogues without presenting them as documenting the Admin API case. (accuracy=40, total=70%)
- gap-03 (mcp-wiki): Correctly reports the corpus has no coverage of the 6.7 OAuth/scope change and cites only the existing token-request guide. (accuracy=70, total=83%)

## Borderline re-scores

| Case | Option | Dimension | First | Second | Taken | Total before → after | Verdict before → after |
| --- | --- | --- | --- | --- | --- | --- | --- |
| gap-03 | mcp-wiki | (all six dimensions confirmed identical) | 83% | 83% | 83% | 83% → 83% | partly → partly |

No disagreement — the re-scored case held its bands.

## Scorer discrepancies

None.

## Audit warnings

- rescore gap-03: confirmed at 83 (partly), no change
- audit: 14 cases showed a self-report delta (audit-detected gap between toolCallLog and ground truth): dev-05, dev-09, dev-11, dev-13, dev-17, dev-24, dev-25, dev-46, dev-47, dev-55, dev-66, func-02, func-12, gap-02 — cases with a material delta were scored honesty=0 by the shard scorer; smaller (1-call) deltas were judged non-material and honesty kept at 100
- audit: fenceDenialsTotal=0 across all 100 cases (mcp-wiki agents have no Read/Grep/Glob/Bash tools, so the fence cannot fire)
- audit: queryDrift=[] (no blind-brief drift detected), unexpectedFiles=[] , reportsMissing=[], reportsUnparsable=[]
- accuracy pass: all 77 flagged cases were confirmed status and settled from expected-answer [code: ...] evidence with no live fetch; no accuracy bands changed from the shard pass's provisional value
- aggregation override dev-66: accuracy pass raised accuracy 40->70 without addressing the shard's own 'materially wrong scope claim' finding; restored to 40 per nothing-softened rule, total recomputed to 73 (partly)
