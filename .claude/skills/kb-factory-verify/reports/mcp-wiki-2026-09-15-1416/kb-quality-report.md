# KB quality report — mcp-wiki-2026-09-15-1416

## Run

| | |
| --- | --- |
| Run | `mcp-wiki-2026-09-15-1416` (`mcp-wiki`) |
| Options | `mcp-wiki` |
| Corpus | wiki — fingerprint: `lastBuilt 2026-09-15`, `treeHash bb824702f136…`, 1975 pages |
| Probe | `kb_status corpus.name=wiki`, entry points present: `platform/index.md`; platform layer `implemented` (coreVersion 6.7.13.0); project layer `planned` |
| Model | inherited (not pinned) |
| Generated | 2026-09-15T16:02:40Z |
| Cases run | 106 of 106 (`all`) |
| Yardstick | `cases.md ac4393bc`, `scoring-rubric.md dbf63114`, `scorer-brief.md 51bc1922`, `auditor-brief.md 2f2db37f`, `accuracy-brief.md d4a335ae` |
| Execution | discover batches of 10, scorer shards of 25 (`batched`) |
| Skill | `kb-factory-verify` |

## Run cost

Cost = usage of the option's discover agents only, one usage block per API message id (the record carrying the final output_tokens), split into non-cache tokens (input + output + cache writes) and cache-read tokens, computed by scripts/aggregate-costs.mjs from the transcripts. Cache hit rate = cacheRead ÷ (input + cacheCreation + cacheRead). USD is an estimate from reference/pricing.json, labelled so. totalTokens is retired. Written by `scripts/aggregate-costs.mjs`, never by hand.

| Option | Discover agents (batches) | Requests | Non-cache tokens | Cache-read tokens | Cache hit % | Est. USD | Tool calls | Summed agent time | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| mcp-wiki | 11 (11) | 385 | 976,114 | 18,211,243 | 95.8% | $7.43 | 452 | 1998.98s | transcript |

Wall-clock duration of the run: n/as.

## Comparison

Single-option run — no cross-option comparison table (that is `compare`'s job).

| Option | Access | Corpus | Overall | Status | Developer | Functional | Findable | Edge passed | Gap confirmed | Pass / partly / fail / unavailable / unscored | Weakest dimension |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `mcp-wiki` | mcp | wiki | 84% | Not ready | 85% | 72% | 74 of 83 | 6 of 9 | 2 of 8 | 57 / 43 / 6 / 0 / 0 | accuracy |

## Dimension heatmap

| Dimension | Weight | `mcp-wiki` |
| --- | --- | --- |
| Grounding & Relevance | 25 | 99 |
| Accuracy vs. Expected Answer | 25 | 68 |
| Completeness | 15 | 70 |
| Citation & Traceability | 10 | 99 |
| Honesty | 15 | 92 |
| Actionability | 10 | 85 |

Average band score, over all 106 scored cases (0 unscored).

| Area | Cases | `mcp-wiki` average |
| --- | --- | --- |
| Store API & headless | 1 | 100% |
| Platform upgrade | 2 | 100% |
| Payment & Shipping | 1 | 100% |
| QA | 1 | 100% |
| Storefront | 10 | 95% |
| Architecture | 3 | 95% |
| Core breaking changes | 3 | 95% |
| Administration | 4 | 91% |
| Theme | 2 | 90% |
| Trap | 9 | 89% |
| DAL | 7 | 88% |
| Admin API | 3 | 87% |
| Events | 6 | 86% |
| Content | 1 | 85% |
| Code | 1 | 85% |
| App system | 5 | 85% |
| Config & CLI | 5 | 82% |
| Gap | 8 | 81% |
| Admin migration (Vue 3 / Vite / Pinia / Meteor) | 4 | 80% |
| Hosting & ops | 5 | 79% |
| Services & DI | 3 | 78% |
| Orders | 2 | 75% |
| Plugin fundamentals | 1 | 74% |
| Content (CMS/mail/SEO/media/sitemap) | 2 | 73% |
| Merchant | 12 | 72% |
| Testing | 3 | 67% |
| Checkout & Cart | 2 | 64% |

## Verdict grid

| Case | Category | Area | `mcp-wiki` |
| --- | --- | --- | --- |
| dev-01 | dev | DAL | 80% partly ✓ |
| dev-02 | dev | Plugin fundamentals | 74% partly ✓ |
| dev-03 | dev | Store API & headless | 100% pass ✓ |
| dev-04 | dev | Content | 85% pass ✓ |
| dev-05 | dev | Theme | 100% pass ✓ |
| dev-06 | dev | Events | 95% pass ✓ |
| dev-07 | dev | DAL | 80% partly ✓ |
| dev-08 | dev | DAL | 100% pass ✓ |
| dev-09 | dev | DAL | 95% pass ✓ |
| dev-10 | dev | DAL | 100% pass ✓ |
| dev-11 | dev | Services & DI | 73% partly ✗ |
| dev-12 | dev | Services & DI | 65% partly ✗ |
| dev-13 | dev | Services & DI | 95% pass ✓ |
| dev-14 | dev | Events | 95% pass ✓ |
| dev-15 | dev | Events | 73% partly ✓ |
| dev-16 | dev | Orders | 100% pass ✓ |
| dev-17 | dev | Checkout & Cart | 77% partly ✓ |
| dev-18 | dev | Checkout & Cart | 50% fail ✗ |
| dev-19 | dev | Events | 82% partly ✓ |
| dev-20 | dev | Events | 100% pass ✓ |
| dev-21 | dev | Events | 73% partly ✓ |
| dev-22 | dev | Config & CLI | 100% pass ✓ |
| dev-23 | dev | Content (CMS/mail/SEO/media/sitemap) | 73% partly ✓ |
| dev-24 | dev | Content (CMS/mail/SEO/media/sitemap) | 73% partly ✓ |
| dev-25 | dev | Config & CLI | 95% pass ✓ |
| dev-26 | dev | Orders | 50% fail ✓ |
| dev-27 | dev | Storefront | 100% pass ✓ |
| dev-28 | dev | Storefront | 100% pass ✓ |
| dev-29 | dev | Storefront | 88% pass ✓ |
| dev-30 | dev | Storefront | 95% pass ✓ |
| dev-31 | dev | Storefront | 100% pass ✓ |
| dev-32 | dev | DAL | 73% partly ✓ |
| dev-33 | dev | Administration | 77% partly ✓ |
| dev-34 | dev | Administration | 100% pass ✓ |
| dev-35 | dev | Administration | 88% pass ✓ |
| dev-36 | dev | Administration | 100% pass ✓ |
| dev-37 | dev | Testing | 80% partly ✓ |
| dev-38 | dev | Testing | 70% partly ✓ |
| dev-39 | dev | Testing | 50% fail ✗ |
| dev-40 | dev | Platform upgrade | 100% pass ✓ |
| dev-41 | dev | Hosting & ops | 80% partly ✗ |
| dev-42 | dev | Config & CLI | 85% pass ✓ |
| dev-43 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 100% pass ✓ |
| dev-44 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 50% fail ✓ |
| dev-45 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 100% pass ✓ |
| dev-46 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 70% partly ✓ |
| dev-47 | dev | Payment & Shipping | 100% pass ✓ |
| dev-48 | dev | Storefront | 100% pass ✓ |
| dev-49 | dev | Core breaking changes | 92% pass ✓ |
| dev-50 | dev | Core breaking changes | 100% pass ✓ |
| dev-51 | dev | DAL | 88% pass ✗ |
| dev-52 | dev | Core breaking changes | 92% pass ✓ |
| dev-53 | dev | Theme | 80% partly ✓ |
| dev-54 | dev | Storefront | 88% pass ✓ |
| dev-55 | dev | Storefront | 92% pass ✓ |
| dev-56 | dev | Storefront | 88% pass ✓ |
| dev-57 | dev | Platform upgrade | 100% pass ✓ |
| dev-58 | dev | Hosting & ops | 92% pass ✓ |
| dev-59 | dev | Hosting & ops | 77% partly ✓ |
| dev-60 | dev | Hosting & ops | 73% partly ✓ |
| dev-61 | dev | Hosting & ops | 73% partly ✓ |
| dev-62 | dev | Config & CLI | 41% fail ✓ |
| dev-63 | dev | Config & CLI | 88% pass ✓ |
| dev-64 | dev | Admin API | 100% pass ✓ |
| dev-65 | dev | Admin API | 88% pass ✓ |
| dev-66 | dev | Admin API | 73% partly ✓ |
| dev-67 | dev | App system | 80% partly ✓ |
| dev-68 | dev | App system | 70% partly ✓ |
| dev-69 | dev | App system | 100% pass ✓ |
| dev-70 | dev | App system | 85% pass ✓ |
| dev-71 | dev | App system | 88% pass ✓ |
| func-01 | func | Merchant | 65% partly ✓ |
| func-02 | func | Merchant | 65% partly ✓ |
| func-03 | func | Merchant | 92% pass ✓ |
| func-04 | func | Merchant | 82% partly ✓ |
| func-05 | func | Merchant | 67% partly ✗ |
| func-06 | func | Merchant | 70% partly ✓ |
| func-07 | func | Merchant | 67% partly ✓ |
| func-08 | func | Merchant | 67% partly ✓ |
| func-09 | func | Merchant | 77% partly ✗ |
| func-10 | func | Merchant | 52% fail ✓ |
| func-11 | func | Merchant | 80% partly ✓ |
| func-12 | func | Merchant | 80% partly ✗ |
| edge-01 | edge | Trap | 100% pass – |
| edge-02 | edge | Trap | 95% pass – |
| edge-03 | edge | Trap | 100% pass – |
| edge-04 | edge | Trap | 100% pass – |
| edge-05 | edge | Trap | 100% pass – |
| edge-06 | edge | Trap | 73% partly – |
| edge-07 | edge | Trap | 85% pass – |
| edge-08 | edge | Trap | 73% partly – |
| edge-09 | edge | Trap | 73% partly – |
| gap-01 | gap | Gap | 77% partly – |
| gap-02 | gap | Gap | 73% partly – |
| gap-03 | gap | Gap | 80% partly – |
| gap-04 | gap | Gap | 80% partly – |
| gap-05 | gap | Gap | 85% pass – |
| gap-06 | gap | Gap | 80% partly – |
| gap-07 | gap | Gap | 73% partly – |
| gap-08 | gap | Gap | 100% pass – |
| rule-01 | rule | Architecture | 85% pass ✗ |
| rule-02 | rule | Architecture | 100% pass ✗ |
| rule-03 | rule | Architecture | 100% pass ✗ |
| rule-04 | rule | Code | 85% pass ✓ |
| rule-05 | rule | QA | 100% pass ✗ |
| rule-06 | rule | Storefront | 100% pass ✗ |

## Requests and responses

### `mcp-wiki`

| Case | Tool calls made | Page reached | Findability | Citations verified | Memory claims | Honesty | Verdict | Raw |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dev-01 | 7 | platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-complex-data-to-existing-entities.md = target | pass | 2/2 | 0 | 100 | partly | `raw/mcp-wiki/dev-01.json` |
| dev-02 | 3 | platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/plugin-lifecycle.md = target | pass | 1/1 | 0 | 0 | partly | `raw/mcp-wiki/dev-02.json` |
| dev-03 | 3 | platform/dev/6.7/guides/plugins/plugins/framework/store-api/add-store-api-route.md = target | pass | 1/1 | 0 | 100 | pass | `raw/mcp-wiki/dev-03.json` |
| dev-04 | 4 | platform/dev/6.7/guides/plugins/plugins/content/cms/add-cms-element.md = target | pass | 1/1 | 0 | 100 | pass | `raw/mcp-wiki/dev-04.json` |
| dev-05 | 4 | platform/dev/6.7/guides/plugins/themes/theme-base-guide.md ≠ target (platform/dev/6.7/guides/plugins/themes/inheritance/add-theme-inheritance.md) | pass | 2/2 | 0 | 100 | pass | `raw/mcp-wiki/dev-05.json` |
| dev-06 | 3 | platform/dev/6.7/guides/plugins/plugins/framework/flow/add-flow-builder-action.md = target | pass | 1/1 | 0 | 100 | pass | `raw/mcp-wiki/dev-06.json` |
| dev-07 | 2 | platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-custom-complex-data.md = target | pass | 1/1 | 0 | 100 | partly | `raw/mcp-wiki/dev-07.json` |
| dev-08 | 3 | platform/dev/6.7/guides/plugins/plugins/framework/data-handling/reading-data.md = target | pass | 1/1 | 0 | 100 | pass | `raw/mcp-wiki/dev-08.json` |
| dev-09 | 3 | platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-data-translations.md = target | pass | 1/1 | 0 | 100 | pass | `raw/mcp-wiki/dev-09.json` |
| dev-10 | 3 | platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-data-indexer.md = target | pass | 1/1 | 0 | 100 | pass | `raw/mcp-wiki/dev-10.json` |
| dev-11 | 8 | platform/dev/6.7/guides/plugins/plugins/services/add-custom-service.md ≠ target (platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md) | fail | 2/2 | 0 | 100 | partly | `raw/mcp-wiki/dev-11.json` |
| dev-12 | 10 | platform/dev/6.6/resources/references/adr/2023-05-16-symfony-dependency-management.md ≠ target (platform/dev/6.6/guides/plugins/plugins/plugin-fundamentals/dependency-injection.md) | fail | 2/2 | 0 | 100 | partly | `raw/mcp-wiki/dev-12.json` |
| dev-13 | 3 | platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md = target | pass | 1/1 | 0 | 100 | pass | `raw/mcp-wiki/dev-13.json` |
| dev-14 | 2 | platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md = target | pass | 1/1 | 0 | 100 | pass | `raw/mcp-wiki/dev-14.json` |
| dev-15 | 4 | platform/dev/6.7/guides/plugins/plugins/framework/event/finding-events.md = target | pass | 1/1 | 0 | 100 | partly | `raw/mcp-wiki/dev-15.json` |
| dev-16 | 3 | platform/dev/6.7/guides/plugins/plugins/checkout/order/listen-to-order-changes.md = target | pass | 1/1 | 0 | 100 | pass | `raw/mcp-wiki/dev-16.json` |
| dev-17 | 3 | platform/dev/6.7/guides/plugins/plugins/checkout/cart/change-price-of-item.md = target | pass | 1/1 | 0 | 100 | partly | `raw/mcp-wiki/dev-17.json` |
| dev-18 | 4 | platform/dev/6.7/guides/plugins/plugins/checkout/cart/add-cart-items.md ≠ target (platform/dev/6.7/guides/plugins/plugins/checkout/cart/add-cart-processor-collector.md) | fail | 2/2 | 0 | 40 | fail | `raw/mcp-wiki/dev-18.json` |
| dev-19 | 5 | platform/dev/6.7/guides/plugins/plugins/framework/message-queue/add-message-to-queue.md ≠ target (platform/dev/6.7/guides/plugins/plugins/framework/message-queue/add-message-handler.md) | pass | 2/2 | 0 | 100 | partly | `raw/mcp-wiki/dev-19.json` |
| dev-20 | 2 | platform/dev/6.7/guides/plugins/plugins/framework/rule/add-custom-rules.md = target | pass | 1/1 | 0 | 100 | pass | `raw/mcp-wiki/dev-20.json` |
| dev-21 | 6 | platform/dev/6.7/guides/plugins/plugins/framework/flow/add-flow-builder-trigger.md = target | pass | 1/1 | 0 | 100 | partly | `raw/mcp-wiki/dev-21.json` |
| dev-22 | 3 | platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-plugin-configuration.md = target | pass | 1/1 | 0 | 100 | pass | `raw/mcp-wiki/dev-22.json` |
| dev-23 | 3 | platform/dev/6.7/guides/plugins/plugins/content/mail/add-mail-template.md = target | pass | 1/1 | 0 | 100 | partly | `raw/mcp-wiki/dev-23.json` |
| dev-24 | 3 | platform/dev/6.7/guides/plugins/plugins/content/seo/add-custom-seo-url.md = target | pass | 1/1 | 0 | 100 | partly | `raw/mcp-wiki/dev-24.json` |
| dev-25 | 3 | platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-custom-commands.md = target | pass | 1/1 | 0 | 100 | pass | `raw/mcp-wiki/dev-25.json` |
| dev-26 | 3 | platform/dev/6.7/guides/plugins/plugins/checkout/documents/v2/add-a-document-type.md = target | pass | 1/1 | 0 | 100 | fail | `raw/mcp-wiki/dev-26.json` |
| dev-27 | 3 | platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-templates.md = target | pass | 1/1 | 0 | 100 | pass | `raw/mcp-wiki/dev-27.json` |
| dev-28 | 4 | platform/dev/6.7/guides/plugins/plugins/storefront/javascript/override-existing-javascript.md = target | pass | 1/1 | 0 | 100 | pass | `raw/mcp-wiki/dev-28.json` |
| dev-29 | 4 | platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-data-to-storefront-page.md = target | pass | 1/1 | 0 | 100 | pass | `raw/mcp-wiki/dev-29.json` |
| dev-30 | 3 | platform/dev/6.7/guides/plugins/plugins/storefront/howto/add-listing-filters.md = target | pass | 1/1 | 0 | 100 | pass | `raw/mcp-wiki/dev-30.json` |
| dev-31 | 7 | platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-scss-variables.md = target | pass | 2/2 | 0 | 100 | pass | `raw/mcp-wiki/dev-31.json` |
| dev-32 | 4 | platform/dev/6.7/guides/plugins/plugins/framework/custom-field/add-custom-field.md = target | pass | 1/1 | 0 | 100 | partly | `raw/mcp-wiki/dev-32.json` |
| dev-33 | 3 | platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-module.md = target | pass | 1/1 | 0 | 100 | partly | `raw/mcp-wiki/dev-33.json` |
| dev-34 | 3 | platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-components.md = target | pass | 1/1 | 0 | 100 | pass | `raw/mcp-wiki/dev-34.json` |
| dev-35 | 3 | platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/using-data-handling.md = target | pass | 1/1 | 0 | 100 | pass | `raw/mcp-wiki/dev-35.json` |
| dev-36 | 3 | platform/dev/6.7/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.md = target | pass | 1/1 | 0 | 100 | pass | `raw/mcp-wiki/dev-36.json` |
| dev-37 | 3 | platform/dev/6.7/guides/development/testing/unit/php-unit.md = target | pass | 1/1 | 0 | 100 | partly | `raw/mcp-wiki/dev-37.json` |
| dev-38 | 3 | platform/dev/6.7/guides/development/testing/unit/jest-admin.md = target | pass | 1/1 | 0 | 100 | partly | `raw/mcp-wiki/dev-38.json` |
| dev-39 | 5 | platform/dev/6.7/guides/development/testing/_index.md ≠ target (platform/dev/6.7/guides/development/testing/e2e-playwright/install-configure.md) | fail | 2/2 | 0 | 100 | fail | `raw/mcp-wiki/dev-39.json` |
| dev-40 | 3 | platform/dev/6.7/guides/upgrades-migrations/upgrade-shopware.md = target | pass | 1/1 | 0 | 100 | pass | `raw/mcp-wiki/dev-40.json` |
| dev-41 | 10 | platform/dev/6.7/guides/hosting/infrastructure/database.md ≠ target (platform/dev/6.7/guides/hosting/_index.md) | fail | 1/1 | 0 | 100 | partly | `raw/mcp-wiki/dev-41.json` |
| dev-42 | 4 | platform/dev/6.7/products/tools/cli/project-commands/upgrade.md = target | pass | 1/1 | 0 | 100 | pass | `raw/mcp-wiki/dev-42.json` |
| dev-43 | 3 | platform/dev/6.7/guides/upgrades-migrations/administration/vite.md = target | pass | 1/1 | 0 | 100 | pass | `raw/mcp-wiki/dev-43.json` |
| dev-44 | 5 | platform/dev/6.7/guides/upgrades-migrations/administration/vue3.md = target | pass | 1/1 | 0 | 100 | fail | `raw/mcp-wiki/dev-44.json` |
| dev-45 | 3 | platform/dev/6.7/guides/upgrades-migrations/administration/pinia.md = target | pass | 1/1 | 0 | 100 | pass | `raw/mcp-wiki/dev-45.json` |
| dev-46 | 3 | platform/dev/6.7/guides/upgrades-migrations/administration/meteor-components.md = target | pass | 1/1 | 0 | 100 | partly | `raw/mcp-wiki/dev-46.json` |
| dev-47 | 3 | platform/dev/6.7/guides/plugins/plugins/checkout/payment/add-payment-plugin.md = target | pass | 1/1 | 0 | 100 | pass | `raw/mcp-wiki/dev-47.json` |
| dev-48 | 3 | platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md = target | pass | 1/1 | 0 | 100 | pass | `raw/mcp-wiki/dev-48.json` |
| dev-49 | 3 | platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-controller.md = target | pass | 1/1 | 0 | 100 | pass | `raw/mcp-wiki/dev-49.json` |
| dev-50 | 3 | platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-scheduled-task.md = target | pass | 1/1 | 0 | 100 | pass | `raw/mcp-wiki/dev-50.json` |
| dev-51 | 8 | platform/dev/6.7/guides/plugins/plugins/framework/data-handling/entities-via-attributes.md = target | fail | 1/1 | 0 | 100 | pass | `raw/mcp-wiki/dev-51.json` |
| dev-52 | 3 | platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md = target | pass | 1/1 | 0 | 100 | pass | `raw/mcp-wiki/dev-52.json` |
| dev-53 | 3 | platform/dev/6.7/guides/plugins/themes/configuration/theme-configuration.md = target | pass | 1/1 | 0 | 100 | partly | `raw/mcp-wiki/dev-53.json` |
| dev-54 | 3 | platform/dev/6.7/guides/plugins/plugins/storefront/advanced/add-cookie-to-manager.md = target | pass | 1/1 | 0 | 100 | pass | `raw/mcp-wiki/dev-54.json` |
| dev-55 | 3 | platform/dev/6.7/guides/development/accessibility/storefront-accessibility.md = target | pass | 1/1 | 0 | 100 | pass | `raw/mcp-wiki/dev-55.json` |
| dev-56 | 4 | platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-header-footer.md = target | pass | 1/1 | 0 | 100 | pass | `raw/mcp-wiki/dev-56.json` |
| dev-57 | 3 | platform/dev/6.7/products/extensions/b2b-suite-migration/execution/running-migration.md = target | pass | 1/1 | 0 | 100 | pass | `raw/mcp-wiki/dev-57.json` |
| dev-58 | 4 | platform/dev/6.7/guides/hosting/infrastructure/redis.md = target | pass | 1/1 | 0 | 100 | pass | `raw/mcp-wiki/dev-58.json` |
| dev-59 | 3 | platform/dev/6.7/guides/hosting/infrastructure/reverse-http-cache.md = target | pass | 1/1 | 0 | 100 | partly | `raw/mcp-wiki/dev-59.json` |
| dev-60 | 3 | platform/dev/6.7/guides/hosting/infrastructure/message-queue.md = target | pass | 1/1 | 0 | 100 | partly | `raw/mcp-wiki/dev-60.json` |
| dev-61 | 6 | platform/dev/6.7/guides/hosting/infrastructure/elasticsearch/elasticsearch-setup.md = target | pass | 1/1 | 0 | 100 | partly | `raw/mcp-wiki/dev-61.json` |
| dev-62 | 7 | platform/dev/6.7/guides/hosting/configurations/shopware/environment-variables.md = target | pass | 2/2 | 1 | under-reported (4) | fail | `raw/mcp-wiki/dev-62.json` |
| dev-63 | 2 | platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md ≠ target (platform/dev/6.7/resources/references/core-reference/commands-reference.md) | pass | 1/1 | 0 | 100 | pass | `raw/mcp-wiki/dev-63.json` |
| dev-64 | 4 | platform/dev/6.7/guides/development/integrations-api/auth-api-requests.md = target | pass | 2/2 | 0 | 100 | pass | `raw/mcp-wiki/dev-64.json` |
| dev-65 | 2 | platform/dev/6.7/guides/development/integrations-api/search-criteria.md = target | pass | 1/1 | 0 | 100 | pass | `raw/mcp-wiki/dev-65.json` |
| dev-66 | 2 | platform/dev/6.7/guides/development/integrations-api/request-headers.md = target | pass | 1/1 | 0 | 100 | partly | `raw/mcp-wiki/dev-66.json` |
| dev-67 | 4 | platform/dev/6.7/guides/plugins/apps/app-base-guide.md = target | pass | 1/1 | 0 | 100 | partly | `raw/mcp-wiki/dev-67.json` |
| dev-68 | 3 | platform/dev/6.7/guides/plugins/apps/lifecycle/app-registration-setup.md = target | pass | 1/1 | 0 | under-reported (1) | partly | `raw/mcp-wiki/dev-68.json` |
| dev-69 | 2 | platform/dev/6.7/guides/plugins/apps/lifecycle/webhook.md = target | pass | 1/1 | 0 | 100 | pass | `raw/mcp-wiki/dev-69.json` |
| dev-70 | 2 | platform/dev/6.7/guides/plugins/apps/checkout/payment.md = target | pass | 1/1 | 0 | 100 | pass | `raw/mcp-wiki/dev-70.json` |
| dev-71 | 5 | platform/dev/6.7/guides/plugins/apps/custom-data/custom-entities.md = target | pass | 1/1 | 0 | 100 | pass | `raw/mcp-wiki/dev-71.json` |
| func-01 | 5 | platform/func/catalogues/product-overview.md ≠ target (platform/func/catalogues/products.md) | pass | 2/2 | 0 | 100 | partly | `raw/mcp-wiki/func-01.json` |
| func-02 | 3 | platform/func/settings/Paymentmethods.md ≠ target (platform/func/settings/rules.md) | pass | 2/2 | 0 | 100 | partly | `raw/mcp-wiki/func-02.json` |
| func-03 | 3 | platform/func/marketing/promotions.md = target | pass | 1/1 | 0 | 100 | pass | `raw/mcp-wiki/func-03.json` |
| func-04 | 2 | platform/func/migration-en/what-is-migrated.md = target | pass | 1/1 | 0 | 100 | partly | `raw/mcp-wiki/func-04.json` |
| func-05 | 5 | platform/func/settings/saleschannel.md = target | fail | 1/1 | 0 | 100 | partly | `raw/mcp-wiki/func-05.json` |
| func-06 | 2 | platform/func/settings/Flow-Builder.md = target | pass | 1/1 | 0 | 100 | partly | `raw/mcp-wiki/func-06.json` |
| func-07 | 2 | platform/func/shopware-en/settings/importexport.md = target | pass | 1/1 | 0 | 100 | partly | `raw/mcp-wiki/func-07.json` |
| func-08 | 2 | platform/func/settings/custom-fields.md = target | pass | 1/1 | 0 | 100 | partly | `raw/mcp-wiki/func-08.json` |
| func-09 | 1 | platform/func/settings/rules.md ≠ target (platform/func/settings/Paymentmethods.md) | fail | 2/2 | 0 | 100 | partly | `raw/mcp-wiki/func-09.json` |
| func-10 | 6 | platform/func/shopware-6-de/Catalogues/Dynamicproductgroups.md = target | pass | 1/1 | 0 | under-reported (1) | fail | `raw/mcp-wiki/func-10.json` |
| func-11 | 2 | platform/func/settings/system/integrationen.md = target | pass | 1/1 | 0 | 100 | partly | `raw/mcp-wiki/func-11.json` |
| func-12 | 6 | platform/func/settings/Flow-Builder.md ≠ target (platform/func/extensions/shopware-commercial.md) | fail | 2/2 | 0 | 100 | partly | `raw/mcp-wiki/func-12.json` |
| edge-01 | 4 | platform/hubs/store-api.md ≠ target (none) | n/a | 1/1 | 0 | 100 | pass | `raw/mcp-wiki/edge-01.json` |
| edge-02 | 4 | platform/hubs/dependency-injection.md ≠ target (none) | n/a | 1/1 | 0 | 100 | pass | `raw/mcp-wiki/edge-02.json` |
| edge-03 | 5 | platform/dev/6.7/guides/plugins/plugins/framework/data-handling/entities-via-attributes.md ≠ target (none) | n/a | 1/1 | 0 | 100 | pass | `raw/mcp-wiki/edge-03.json` |
| edge-04 | 6 | platform/dev/6.7/guides/development/integrations-api/_index.md ≠ target (platform/dev/6.6/guides/integrations-api/general-concepts/api-versioning.md) | n/a | 1/1 | 1 | 100 | pass | `raw/mcp-wiki/edge-04.json` |
| edge-05 | 5 | platform/dev/6.7/products/tools/mcp-server/intro.md = target | n/a | 2/2 | 0 | 100 | pass | `raw/mcp-wiki/edge-05.json` |
| edge-06 | 5 | platform/func/migration-en/magento-firststeps.md ≠ target (platform/func/migration-en/magento-keywords.md) | n/a | 2/2 | 1 | 100 | partly | `raw/mcp-wiki/edge-06.json` |
| edge-07 | 4 | platform/dev/6.6/products/pwa.md = target | n/a | 1/1 | 0 | 100 | pass | `raw/mcp-wiki/edge-07.json` |
| edge-08 | 6 | platform/dev/6.7/guides/plugins/plugins/framework/data-handling/reading-data.md ≠ target (none) | n/a | 1/1 | 0 | 100 | partly | `raw/mcp-wiki/edge-08.json` |
| edge-09 | 5 | platform/func/settings/Flow-Builder.md ≠ target (platform/func/settings/Business-Events.md) | n/a | 2/2 | 0 | 100 | partly | `raw/mcp-wiki/edge-09.json` |
| gap-01 | 13 | platform/dev/6.7/concepts/api/admin-api.md ≠ target (none) | n/a | 2/2 | 1 | 100 | partly | `raw/mcp-wiki/gap-01.json` |
| gap-02 | 12 | platform/dev/6.7/products/tools/cli/project-commands/helper-commands.md ≠ target (none) | n/a | 1/1 | 0 | under-reported (1) | partly | `raw/mcp-wiki/gap-02.json` |
| gap-03 | 7 | platform/dev/6.7/guides/development/integrations-api/_index.md ≠ target (none) | n/a | 2/2 | 0 | 100 | partly | `raw/mcp-wiki/gap-03.json` |
| gap-04 | 7 | platform/dev/6.7/guides/upgrades-migrations/_index.md ≠ target (none) | n/a | 1/1 | 0 | 100 | partly | `raw/mcp-wiki/gap-04.json` |
| gap-05 | 5 | platform/dev/6.7/guides/plugins/plugins/framework/caching/_index.md ≠ target (none) | n/a | 2/2 | 0 | 100 | pass | `raw/mcp-wiki/gap-05.json` |
| gap-06 | 9 | platform/dev/6.7/guides/plugins/plugins/framework/data-handling/writing-data.md ≠ target (none) | n/a | 3/3 | 0 | under-reported (1) | partly | `raw/mcp-wiki/gap-06.json` |
| gap-07 | 5 | platform/dev/6.7/products/extensions/migration-assistant/concept/media-processing.md ≠ target (none) | n/a | 2/2 | 1 | 100 | partly | `raw/mcp-wiki/gap-07.json` |
| gap-08 | 8 | platform/dev/6.7/guides/development/integrations-api/request-headers.md ≠ target (none) | n/a | 2/2 | 0 | 100 | pass | `raw/mcp-wiki/gap-08.json` |
| rule-01 | 9 | platform/guidelines/6.7/architecture-guidelines.md ≠ target (platform/guidelines/6.7/be-code-guidelines.md) | fail | 2/2 | 0 | under-reported (1) | pass | `raw/mcp-wiki/rule-01.json` |
| rule-02 | 3 | platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/plugin-lifecycle.md ≠ target (platform/guidelines/6.7/be-architecture-guidelines.md) | fail | 1/1 | 0 | 100 | pass | `raw/mcp-wiki/rule-02.json` |
| rule-03 | 2 | platform/guidelines/6.7/architecture-guidelines.md = target | fail | 1/1 | 0 | 100 | pass | `raw/mcp-wiki/rule-03.json` |
| rule-04 | 5 | platform/guidelines/6.7/code-guidelines.md = target | pass | 1/1 | 0 | under-reported (1) | pass | `raw/mcp-wiki/rule-04.json` |
| rule-05 | 4 | platform/guidelines/6.7/qa-guidelines.md ≠ target (platform/guidelines/6.7/be-qa-guidelines.md) | fail | 2/2 | 0 | 100 | pass | `raw/mcp-wiki/rule-05.json` |
| rule-06 | 2 | platform/guidelines/6.7/architecture-guidelines.md ≠ target (platform/guidelines/6.7/storefront-code-guidelines.md) | fail | 1/1 | 0 | 100 | pass | `raw/mcp-wiki/rule-06.json` |

## Scores by case

### `mcp-wiki`

| Case | Grounding | Accuracy | Completeness | Citation | Honesty | Actionability | Total | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dev-01 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| dev-02 | 100 | 100 | 70 | 40 | 0 | 100 | 74% | partly |
| dev-03 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-04 | 100 | 70 | 70 | 100 | 100 | 70 | 85% | pass |
| dev-05 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-06 | 100 | 100 | 70 | 100 | 100 | 100 | 95% | pass |
| dev-07 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| dev-08 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-09 | 100 | 100 | 70 | 100 | 100 | 100 | 95% | pass |
| dev-10 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-11 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| dev-12 | 70 | 40 | 40 | 100 | 100 | 70 | 65% | partly |
| dev-13 | 100 | 100 | 70 | 100 | 100 | 100 | 95% | pass |
| dev-14 | 100 | 100 | 70 | 100 | 100 | 100 | 95% | pass |
| dev-15 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| dev-16 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-17 | 100 | 40 | 70 | 100 | 100 | 70 | 77% | partly |
| dev-18 | 70 | 40 | 40 | 70 | 40 | 40 | 50% | fail |
| dev-19 | 100 | 40 | 100 | 100 | 100 | 70 | 82% | partly |
| dev-20 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-21 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| dev-22 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-23 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| dev-24 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| dev-25 | 100 | 100 | 70 | 100 | 100 | 100 | 95% | pass |
| dev-26 | 100 | 0 | 0 | 100 | 100 | 0 | 50% | fail |
| dev-27 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-28 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-29 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-30 | 100 | 100 | 70 | 100 | 100 | 100 | 95% | pass |
| dev-31 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-32 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| dev-33 | 100 | 40 | 70 | 100 | 100 | 70 | 77% | partly |
| dev-34 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-35 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-36 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-37 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| dev-38 | 100 | 40 | 40 | 100 | 100 | 40 | 70% | partly |
| dev-39 | 100 | 0 | 0 | 100 | 100 | 0 | 50% | fail |
| dev-40 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-41 | 100 | 70 | 40 | 100 | 100 | 70 | 80% | partly |
| dev-42 | 100 | 40 | 100 | 100 | 100 | 100 | 85% | pass |
| dev-43 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-44 | 100 | 0 | 0 | 100 | 100 | 0 | 50% | fail |
| dev-45 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-46 | 100 | 40 | 40 | 100 | 100 | 40 | 70% | partly |
| dev-47 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-48 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-49 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-50 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-51 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-52 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-53 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| dev-54 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-55 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-56 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-57 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-58 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-59 | 100 | 40 | 70 | 100 | 100 | 70 | 77% | partly |
| dev-60 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| dev-61 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| dev-62 | 70 | 40 | 40 | 40 | 0 | 40 | 41% | fail |
| dev-63 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-64 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-65 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-66 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| dev-67 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| dev-68 | 100 | 40 | 100 | 100 | 0 | 100 | 70% | partly |
| dev-69 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-70 | 100 | 40 | 100 | 100 | 100 | 100 | 85% | pass |
| dev-71 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| func-01 | 70 | 40 | 40 | 100 | 100 | 70 | 65% | partly |
| func-02 | 70 | 40 | 40 | 100 | 100 | 70 | 65% | partly |
| func-03 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| func-04 | 100 | 40 | 100 | 100 | 100 | 70 | 82% | partly |
| func-05 | 100 | 40 | 0 | 100 | 100 | 70 | 67% | partly |
| func-06 | 100 | 40 | 0 | 100 | 100 | 100 | 70% | partly |
| func-07 | 100 | 40 | 0 | 100 | 100 | 70 | 67% | partly |
| func-08 | 100 | 40 | 0 | 100 | 100 | 70 | 67% | partly |
| func-09 | 100 | 40 | 70 | 100 | 100 | 70 | 77% | partly |
| func-10 | 100 | 40 | 0 | 100 | 0 | 70 | 52% | fail |
| func-11 | 100 | 70 | 40 | 100 | 100 | 70 | 80% | partly |
| func-12 | 100 | 70 | 40 | 100 | 100 | 70 | 80% | partly |
| edge-01 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| edge-02 | 100 | 100 | 70 | 100 | 100 | 100 | 95% | pass |
| edge-03 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| edge-04 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| edge-05 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| edge-06 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| edge-07 | 100 | 70 | 70 | 100 | 100 | 70 | 85% | pass |
| edge-08 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| edge-09 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| gap-01 | 100 | 40 | 70 | 100 | 100 | 70 | 77% | partly |
| gap-02 | 100 | 70 | 70 | 100 | 0 | 100 | 73% | partly |
| gap-03 | 100 | 70 | 40 | 100 | 100 | 70 | 80% | partly |
| gap-04 | 100 | 70 | 40 | 100 | 100 | 70 | 80% | partly |
| gap-05 | 100 | 70 | 70 | 100 | 100 | 70 | 85% | pass |
| gap-06 | 100 | 100 | 70 | 100 | 0 | 100 | 80% | partly |
| gap-07 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| gap-08 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| rule-01 | 100 | 100 | 100 | 100 | 0 | 100 | 85% | pass |
| rule-02 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| rule-03 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| rule-04 | 100 | 100 | 100 | 100 | 0 | 100 | 85% | pass |
| rule-05 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| rule-06 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |

`unavailable` means the Source-absent override applied — the corpus had nothing and the agent honestly reported that; it is not a failure. No case hit `unavailable` in this run.

## Failures and official references

- **dev-01 (mcp-wiki)** — partly, 80%
  - Report gives a single 6.7-only recipe (implement getEntityName()) for a case pinned 6.6+6.7; on 6.6 getDefinitionClass() is the abstract method and implementing only getEntityName() would be a fatal PHP error — expected fact 1's version split is not addressed.
  - Illegal-field-type error and the Extension flag mechanism (fact 2) are only loosely paraphrased ('associations between two custom entities... FkField plus association fields'), missing the exact allowed-type list and error text, but the essence is present.
  - Tag shopware.entity.extension and BulkEntityExtension/shopware.bulk.entity.extension (fact 3) both correctly stated.
  - Official: [code: Framework/DataAbstractionLayer/EntityExtension.php:46] — "6.7.13.0 declares only extendFields, modifyFields, extendProtections, and the abstract getEntityName(); getDefinitionClass() is absent (Absences table row 1)."
- **dev-02 (mcp-wiki)** — partly, 74%
  - Audit flags an unlabelled uncited factual claim: 'in the installed code, activate() actually runs after the plugin is already flagged active... contrary to a docs description'. This is stated as verified code fact but is not labelled [from memory] and has no citation, and the agent's only tools are wiki docs — it cannot have verified 'the installed code'. Per rubric this presents an unsourced claim as retrieved material, so Honesty = 0; the same unlabelled claim caps Citation at 40.
  - Fact 3 (PluginLifecycleService install/uninstall order, CLI commands bin/console plugin:install --activate / plugin:uninstall --keep-user-data, default keepUserData=false) is not mentioned at all — no CLI guidance given.
  - Facts 1 (seven hooks) and 2 (keepUserData getter, early-return contract, what core deletes) are both correctly and fully stated.
  - Official: [code: Framework/Plugin.php:37-68] — "Seven overridable lifecycle hooks, all with empty default bodies, none abstract."
- **dev-07 (mcp-wiki)** — partly, 80%
  - Report states the tag's `entity` attribute 'should match getEntityName() exactly' and implies this is required, but the expected file's Absences table states EntityCompilerPass never reads the tag's entity attribute at all — only getEntityName() on the instantiated class drives the repository id. This is a materially wrong claim about what actually matters.
  - Facts about EntityDefinition's two abstract members and the migration owning table creation (created_at/updated_at auto-added) are correctly and fully stated.
  - Official: [code: Framework/DependencyInjection/CompilerPass/EntityCompilerPass.php:63-68] — "EntityCompilerPass never reads tag attributes; it does new $class() and calls getEntityName() — the entity="…" attribute is not what tells Shopware the entity name (Absences table)."
- **dev-11 (mcp-wiki)** — partly, 73%
  - Findability fail: 3 list/grep calls before the target was read (audit listGrepBeforeTargetRead=3, >2).
  - Report attributes the services.xml deprecation to 'Symfony 7.4' generically, while the expected answer pins it to Shopware's own 6.7.14.0 version-sensitive behaviour (silent up to 6.7.13.0, deprecated/throwing from 6.7.14.0) — a materially different and imprecise framing.
  - Fact 2 (autowiring is NOT on by default for plugin services — the crux of the query) is never stated plainly; the answer presents autowire-vs-explicit as a neutral choice without saying which is the default.
  - Fact 3's DAL-repository autowiring-alias exception is not mentioned.
  - Official: [code: Framework/Bundle.php:212-231] — "foreach ($this->getServicesFilePathArray($this->getPath() . '/Resources/config/services.*') as $path) { $delegatingLoader->load($path); }"
- **dev-12 (mcp-wiki)** — partly, 65%
  - Findability fail: the actual dependency-injection.md target was never reached (targetRead=false per audit); 7 list/grep calls occurred first, well over the 2-call threshold.
  - Report states 'Symfony autowiring is enabled core-wide in Shopware' — this directly contradicts expected fact 3: on 6.6 (and 6.7) a plugin's Definition defaults to autowired=false/autoconfigured=false and Bundle::registerContainerFile() injects no <defaults> block, so nothing is autowired unless the plugin opts in.
  - Report also implies only a file literally named services.xml is loaded ('Shopware automatically loads a file with exactly this name'), while the expected fact 1 states the loader globs services.* (xml/yaml/php all load).
  - The answer is grounded in real pages (add-custom-service.md, the Symfony DI ADR) but the two headline claims above appear to over-generalise from what those pages actually say.
  - Official: [code: vendor/symfony/dependency-injection/Definition.php:35,43] — "private bool $autoconfigured = false; … private bool $autowired = false;"
- **dev-15 (mcp-wiki)** — partly, 73%
  - The query specifically asks about the event 'after a page is rendered'; the expected fact 2 states there is no post-render event (StorefrontRenderEvent fires before the Twig call). The report lists '{route}.render (Storefront, StorefrontRenderEvent)' among route events without clarifying this is a before-render hook, which could mislead a reader into believing it fires after rendering.
  - Fact 3's specific discovery tools (bin/console debug:event-dispatcher showing only already-registered listeners, and the dead '@Event' search term) are not mentioned; the report instead recommends the Symfony profiler's Events tab, a different (plausible but unverified against this fact) route.
  - Fact 1's mechanism (EntityLoadedEvent name-string plus NestedEventDispatcher unwrapping, explaining why grepping for 'product.loaded' finds no dispatch site) is simplified to 'auto-generated per entity' without the underlying mechanism.
  - Official: [code: Framework/DataAbstractionLayer/Event/EntityLoadedEvent.php:31] — "$this->name = $this->definition->getEntityName() . '.loaded';"
- **dev-17 (mcp-wiki)** — partly, 77%
  - The critical gotcha in fact 3 — a custom price alone does not stick because shouldPriceBeRecalculated() also requires the allowProductPriceOverwrites permission on CartBehavior, which core only grants in admin/order-recalculation contexts and never in a plain storefront request — is entirely omitted. Following the report's recipe as given in a normal storefront request would plausibly have the price overwritten back by ProductCartProcessor.
  - Collector/processor split, priority 4500 vs core's 5000, and QuantityPriceDefinition/QuantityPriceCalculator usage (facts 1 and 2, and the first half of fact 3) are all correctly stated.
  - Official: [code: Checkout/Cart/Price/Struct/QuantityPriceDefinition.php:32-38] — "public function __construct(protected float $price, protected TaxRuleCollection $taxRules, protected int $quantity = 1)"
- **dev-18 (mcp-wiki)** — fail, 50%
  - Findability fail: the actual target (add-cart-processor-collector.md) was never read; the answer draws on a reused citation from dev-17 plus add-cart-discounts.md instead.
  - The report's root-cause theory for duplication ('if added to $original it survives to the next calc's original') misdiagnoses the mechanism — the expected fact 2 explains duplication via the CartRuleLoader recalculation loop (up to 7 passes feeding results back as input) plus LineItemCollection::add() summing quantities rather than replacing, requiring a deterministic line-item id and reading the existing item back from $original. A processor never legitimately writes to $original in the first place, so the report's causal chain is not how core actually behaves.
  - Fact 1 (CartDataCollectorInterface has no $toCalculate parameter at all — only the processor can place items) is not stated.
  - Fact 3 (stale price via CartDataCollection carried forward, recompute in process() every pass) is captured reasonably well in practical terms.
  - Official: [code: Checkout/Cart/CartDataCollectorInterface.php:12] — "public function collect(CartDataCollection $data, Cart $original, SalesChannelContext $context, CartBehavior $behavior): void; — no $toCalculate parameter."
- **dev-19 (mcp-wiki)** — partly, 82%
  - Report gives the injected-bus service id as 'messenger.default_bus', while the expected fact 3 (and Symfony's actual alias) is 'messenger.bus.default' — the two strings are inverted; a developer copying the literal id would get a not-found service.
  - All three facts are otherwise substantially present: handler shape with #[AsMessageHandler] and no base class, the requirement to also tag messenger.message_handler because attribute-only autoconfiguration is not enabled by Shopware, and AsyncMessageInterface/LowPriorityMessageInterface routing.
  - Official: [code: Framework/App/MessageHandler/RotateAppSecretHandler.php:9-29] — "#[AsMessageHandler] final class RotateAppSecretHandler { public function __invoke(RotateAppSecretMessage $message): void }"
- **dev-21 (mcp-wiki)** — partly, 73%
  - The report explicitly requires listener priority 1000 for the BusinessEventCollectorEvent subscriber ('register a subscriber... with priority 1000'), which is exactly the case's flagged Trap: the expected answer states no elevated priority is needed, and 'an answer that passes must not require an elevated priority'.
  - The report does not distinguish set() vs add() on the collection (expected fact 2: add() must not be used or by-name lookups miss), nor mention the alternative Bundle::getActionEventClasses() registration route.
  - Fact 3 (flow.storer tag needed for trigger data to reach actions/mail templates, ScalarValuesAware) is not mentioned.
  - Fact 1 (FlowEventAware contract) is reasonably covered.
  - Official: [code: Framework/Event/FlowEventAware.php:9-14] — "interface FlowEventAware extends ShopwareEvent { public static function getAvailableData(): EventDataCollection; public function getName(): string; }"
- **dev-23 (mcp-wiki)** — partly, 73%
  - Report inserts mail_template with system_default = 0, repeating an editorial documentation instruction that expected fact 3's code evidence disputes: only the trait's idempotency lookup and the SSO invitation service filter on systemDefault=true, so 1 is the safer value for a type's canonical template and the docs' 'must be 0' claim is called out as editorial, not enforced by code.
  - The core helper Shopware\Core\Migration\Traits\CreateMailTemplateTrait (fact 2) is not mentioned at all.
  - The migration-based, data-only shipping approach (fact 1) is correctly described.
  - Official: [code: Content/MailTemplate/MailTemplateDefinition.php:56] — "(new BoolField('system_default', 'systemDefault'))->addFlags(new ApiAware()) — plain field, no code enforces it; docs' 'must be 0' is editorial."
- **dev-24 (mcp-wiki)** — partly, 73%
  - Report claims that without a matching seo_url_template row the mechanism 'silently does nothing', but expected fact 2 states SeoUrlUpdater::loadUrlTemplate() throws SeoException::invalidTemplate('Default templates not configured') — a direct contradiction of observable behaviour.
  - Fact 3 (per sales-channel/per-language generation, no sales-channel association required on the plugin entity) is not mentioned.
  - Fact 1 (SeoUrlRouteInterface contract, tag shopware.seo_url.route) is correctly stated; the workaround of subscribing to written/deleted events and calling SeoUrlUpdater::update() addresses the indexer-gap half of fact 2 even without naming SeoUrlUpdateListener's limited scope.
  - Official: [code: Content/Seo/SeoUrlRoute/SeoUrlRouteInterface.php:11-16] — "public function prepareCriteria(Criteria $criteria, SalesChannelEntity $salesChannel): void;"
- **dev-26 (mcp-wiki)** — fail, 50%
  - Answer is built entirely on the Document System v2 recipe (AbstractDocumentDataProvider, AbstractRenderData, shopware.document_v2.provider/.renderer), which is exactly the documented trap for a 6.7.13.0 pin: the case's ground truth shows no controller/route/flow action reaches the v2 generator, so a plugin built this way registers but is never invoked.
  - None of the 3 expected v1-stack facts (AbstractDocumentRenderer, document_type row + number range requirement, literal setTemplate() resolution) are present.
  - Citation is mechanically sound (real page, verified range) but the page itself is the known trap the case is testing.
  - Report's toolCallLog matches ground truth; no under-reporting.
  - Official: [code: Checkout/DocumentV2/Type/AbstractDocumentType — absent at v6.7.13.0] — "No Type/ directory under Checkout/DocumentV2 at 6.7.13.0; AbstractDocumentType first appears at tag v6.7.14.0 — the Document v2 recipe does not apply at this patch level (Absences table)."
- **dev-32 (mcp-wiki)** — partly, 73%
  - States 'includeInSearch available since 6.7.6.0' — the case's ground truth fixes this at 6.7.7.0; a materially wrong version number for a migration-relevant fact.
  - The imperative repository example payload omits the `relations` key binding the set to the product entity — per expected fact 2 a set without that relation is silently never fetched/rendered, so the example as given would not satisfy the query ('for products').
  - Declarative-XML route (since 6.7.13.0) is described correctly; that part of fact 1 is present.
  - Does not mention set/field-name immutability or the custom_field.editor ACL requirement (part of fact 3).
  - Official: [code: System/CustomField/Aggregate/CustomFieldSetRelation/CustomFieldSetRelationDefinition.php:45-46] — "(new StringField('entity_name','entityName', 63))->addFlags(new Required()) — the set↔entity link is custom_field_set_relation."
- **dev-33 (mcp-wiki)** — partly, 77%
  - Registration mechanics (hyphenated id, duplicate/display:false aborts, routes-or-routeMiddleware requirement) and the menu-entry rules (parent required, +1000 offset) both match expected facts 1 and 3.
  - Fact 2 (the Vite build chain: active plugin needed for var/plugins.json, .vite/entrypoints.json, silent bundle drop when missing, only bin/console system:check surfaces it) is essentially absent — the build description names webpack-era output paths (js/administration-new-module.js) and composer scripts without any Vite-specific mechanics, which is materially incomplete/misleading for '6.7' specifically.
  - Official: [code: administration src/core/factory/module.factory.ts:159] — "function registerModule(moduleId: string, module: ModuleManifest): false | ModuleDefinition {"
- **dev-37 (mcp-wiki)** — partly, 80%
  - phpunit.xml/TestBootstrap.php scaffolding chain (addCallingPlugin -> addActivePlugins -> setForceInstallPlugins(true) -> bootstrap() -> getClassLoader()) matches expected fact 1 almost verbatim.
  - IntegrationTestBehaviour/KernelTestBehaviour::getContainer() mechanics match fact 2.
  - Fact 3 (TestBootstrapper forces DATABASE_URL to end in _test; PHPUnit is not shipped by shopware/core; a 6.7 project pins phpunit/phpunit ^11.5) is replaced by a different, unverified claim ('composer require --dev dev-tools provides the PHPUnit binary'), which contradicts the expected mechanism — a materially wrong statement about where PHPUnit comes from.
  - Official: [code: vendor/shopware/core/composer.json — no require-dev / phpunit entry] — "shopware/core depends on PHPUnit, so installing core gives you a test runner — absent: vendor/shopware/core/composer.json has no require-dev block (Absences table)."
- **dev-38 (mcp-wiki)** — partly, 70%
  - Spec co-location (<name>.spec.js next to source) matches part of fact 1, but Jest version, jest-environment-jsdom, and @vue/test-utils 2.4.6 are never named.
  - The mount example puts `props`, `stubs`, `mocks`, `attachTo` at the TOP level of the shallowMount() options object instead of nested under `global` — exactly the Vue-3 test-utils mistake the expected answer calls out; this code would not correctly apply stubs/mocks under Vue 3 test-utils. `wrapTestComponent` is never mentioned.
  - Presents `composer run admin:create:test` / `composer run admin:unit` as usable tooling without noting that 6.7 ships no Jest harness for a plugin at all and that these scripts exist only in the shopware/shopware monorepo — materially misleading for a plugin author.
  - Official: [code: Resources/app/administration/jest.config.js:96-104] — "setupFilesAfterEnv: [… '/test/_setup/setup-shopware.js', 'jest-expect-message', '/test/_setup/prepare_environment.js'] — wrapTestComponent/flushPromises are globals, not imports."
- **dev-39 (mcp-wiki)** — fail, 50%
  - Findability fail: never read the actual target (e2e-playwright/install-configure.md); read the legacy Cypress page and the testing index instead.
  - Answer gives a full, detailed how-to for setting up Cypress in 6.7 (npm install @shopware-ag/e2e-testsuite-platform, etc.) despite the package being archived and Cypress support being functionally gone at 6.7.13.0 — exactly the fabricated 'how-to' the case's not-found/edge bands score 0 for.
  - Playwright is mentioned only as a passing reference to a directory path; none of the 3 expected facts (no Cypress support at all, the actual Playwright acceptance-test-suite setup, the actor-pattern test structure) are actually stated.
  - Citations are real and verified, but both are the known trap/legacy pages, not the correct target.
  - Official: [code: tests/e2e/cypress — reduced to a single 0-byte file at v6.7.13.0] — "no cypress.config.*, cypress/ directory, cypress dependency or cypress npm script exists in shopware/core, shopware/storefront or shopware/administration (Absences table)."
- **dev-41 (mcp-wiki)** — partly, 80%
  - Findability fail: 4 list/grep calls before reaching a page carrying the facts; also read a non-existent installation/system-requirements.md path along the way.
  - PHP tilde-range constraint, extension list, memory_limit/max_execution_time thresholds match fact 1 closely and precisely.
  - Fact 2's key insight — that the database-version check runs only inside system:install/the web installer, never during composer update or app boot, so a green `composer update` proves nothing about the DB — is entirely missing; only the version numbers are given.
  - Fact 3's key insight — that `composer check-platform-reqs` is the actual CLI preflight tool, and that `bin/console system:check` does NOT answer this question — is missing; the answer instead recommends manual `php -v`/`php -m` checks, which work but bypass the idiomatic answer to 'how do I check the machine'.
  - Node version given (20.0.0 minimum) doesn't distinguish the stricter Storefront requirement (^20.19.0) from the Administration's (^20.0.0).
  - Official: [code: vendor/composer/composer/src/Composer/Command/CheckPlatformReqsCommand.php:29-30] — "$this->setName('check-platform-reqs')->setDescription('Check that platform requirements are satisfied')"
- **dev-44 (mcp-wiki)** — fail, 50%
  - States 'this.$tc still works... with the explicit exception' — this is precisely the trap the expected answer calls out as wrong: $tc is deprecated tag:v6.8.0, not a safe exception to the 'search for this.$' rule.
  - Suggests 'you may need this.$parent.$parent' as the $parent fix — precisely the wrong general fix the expected answer names: the async-wrapper depth is not fixed (11 sync-listed components, router path insert none), so a hard-coded extra hop is unreliable; the correct guidance is to walk the chain by $options.name or avoid $parent.
  - Also correctly identifies Shopware.Snippet.tc as the prop-default replacement, but the two trap statements above make the overall answer actively misleading on both named breakages.
  - Fact 3 (eslint no-tc-translation autofix scoped to **/*.js only, TS plugins get no warning) is entirely absent.
  - Official: [code: administration Resources/app/administration/src/core/shopware.ts:264-275] — "public get Snippet() { if (!Shopware.Application.view?.i18n) { return null; } return { ...Shopware.Application.view.i18n.global, tc: ... }; } — this.$tc in a prop default has no component this."
- **dev-46 (mcp-wiki)** — partly, 70%
  - Gives the exact invocation `composer run admin:code-mods -- --plugin-name example-plugin --fix -v 6.7` — the case's expected answer explicitly names this as a trap: that composer script exists only in the shopware/shopware monorepo, not in a Flex/plugin install, where `npm run code-mods` from vendor/shopware/administration must be used instead.
  - Describes the `deprecated` prop bridge generically via sw-url-field rather than confirming it applies to sw-button/sw-card specifically as asked.
  - Fact 2 — that sw-tabs/sw-popover/sw-loader/sw-skeleton-bar do NOT follow the same deprecated-prop mechanism and, given their flags default false/undeclared, always render the deprecated variant regardless of markup in 6.7 — is entirely absent, so the answer implicitly (wrongly) generalises the deprecated-prop pattern.
  - Official: [code: administration code-mods.js:11-14] — "npm run code-mods -- --fix --plugin-name <Name> -v 6.7 is the invocation from vendor/shopware/administration/Resources/app/administration; composer run admin:code-mods exists only in the monorepo."
- **dev-53 (mcp-wiki)** — partly, 80%
  - Snippet-key mechanism (fact 2: sw-theme prefix, per tab/block/section, default substitution, index for options) is covered accurately and thoroughly.
  - Misdiagnoses the root cause of 'labels disappeared': frames inline label/helpText as already being phased out in 6.7, when code shows they still work as the admin's fallback in 6.7 and are only stripped under the experimental v6.8.0.0 flag — the actual mechanism the case probes. This is a materially misleading root-cause claim.
  - Fact 1 (unknown-key-is-fatal) nuance omitted.
  - Official: [code: shopware/storefront Theme/ThemeConfigField.php:14-19] — "The inline theme.json label/helpText arrays still work in 6.7 — used as fallback when no snippet matches, stripped only when the v6.8.0.0 feature flag is active."
- **dev-59 (mcp-wiki)** — partly, 77%
  - Correctly covers the config-key move and the Redis/BAN-to-xkey change (fact 1 & 2 core content).
  - Misses the case's central diagnostic fact entirely: delayed invalidation is on by default in 6.7 and the actual PURGE only happens via the `shopware.invalidate_cache` scheduled task (every 5 min) — without a scheduled-task worker, Varnish is never purged. This is the most likely real cause of 'Varnish cache is never invalidated' and is unaddressed.
  - Does not mention sw-force-cache-invalidate or that purge failures are only logged.
  - Official: [code: Framework/Adapter/Cache/CacheInvalidator.php:62-81,87-106,149-152] — "Invalidation is delayed by default in 6.7 (delay_enabled defaults to true); the actual PURGE is issued by CacheInvalidator::invalidateExpired(), run by the shopware.invalidate_cache scheduled task."
- **dev-60 (mcp-wiki)** — partly, 73%
  - Repeats two disproven docs claims as fact: that a CLI worker must also be run for the `failed` transport (code shows `failed` is a dead-letter target drained by messenger:failed:*, not a standing-worker transport — a second failure there discards the message), and that production workers should cover `webhook` (the case explicitly states naming webhook for a default 6.7 install is wrong, since WEBHOOKS_REWORK defaults off).
  - Omits that disabling the admin worker makes `scheduled-task:run` mandatory (queueScheduledTasks() has only two callers).
  - Correctly covers explicit-transport-naming (fact 1) and the admin_worker.enable_admin_worker toggle.
  - Official: [code: Framework/Webhook/Transport/WebhookTransport.php:50-63,86-88] — "with WEBHOOKS_REWORK off (the default) WebhookTransport::send() forwards the envelope to async and get() returns [] — a CLI worker must not be given webhook."
- **dev-61 (mcp-wiki)** — partly, 73%
  - States 'default is three shards, three replicas' for the storefront indices — this is exactly the case's Trap: in 6.7 the storefront env defaults were emptied so the cluster decides; only the admin indices still default 3/3 (deprecated for 6.8).
  - Omits the admin search indices entirely (separate elasticsearch.administration.index_settings block, es:admin:index command) — fact 3 is missing.
  - Correctly names es:index as the reindex command and es:create:alias as the manual alias fallback, but recommends `cache:clear` for .env changes and `dal:refresh:index`, neither of which is confirmed as the Elasticsearch bundle's own mechanism.
  - Official: [code: shopware/shopware@v6.7.13.0 src/Elasticsearch/Resources/config/packages/elasticsearch.yaml] — "In 6.7 both env defaults are empty — Shopware no longer forces 3 shards / 3 replicas for the storefront indices."
- **dev-62 (mcp-wiki)** — fail, 41%
  - selfReportDelta shows 4 undisclosed grep_docs calls (reported 2, actual 6) — the report misrepresents how the answer was obtained; Honesty = 0 per rubric.
  - States 'after changing .env values, Shopware requires bin/console cache:clear for them to take effect' — this is the case's explicit Trap: 'An answer whose remedy is cache:clear fails Accuracy.' The env-var reference page's precedence order (fact 1) is only given via a labelled [from memory] claim, not read from the source.
  - Carries an unlabelled, uncited factual claim about BLUE_GREEN_DEPLOYMENT (audit's unlabelledUncitedCandidates), capping Citation at 40.
  - Fact 3 (system_config/mailer not read from .env at all) is entirely missing.
  - Official: [code: Framework/DependencyInjection/CompilerPass/FeatureFlagCompilerPass.php:28-32] — "An answer whose remedy is 'run cache:clear' fails Accuracy, as does one that presents every Shopware setting as an env var (case Trap)."
- **dev-66 (mcp-wiki)** — partly, 73%
  - Very thin answer relative to the case's key traps: presents sw-inheritance as needing value '1' rather than stating it is a bare presence check (any value, including 0/false, enables it).
  - Presents sw-skip-trigger-flow only in the context of POST /api/_action/sync, omitting that it is resolved for every /api route.
  - sw-version-id described as defaulting to 'the most recent record' rather than the live version, and its lack of validation is not mentioned; sw-language-id's fallback chain and languageNotFound error are not mentioned.
  - Official: [code: Framework/Routing/ApiRequestContextResolver.php:114] — "$languageId = $request->headers->get(PlatformRequest::HEADER_LANGUAGE_ID, ''); if ($languageId !== '') {"
- **dev-67 (mcp-wiki)** — partly, 80%
  - States 'app:refresh fails if author/copyright are missing or empty' — this is the case's documented doc/code divergence: an empty element passes the isset()-only check and installs; a genuinely missing element is swallowed and app:refresh reports 'Nothing to install...' instead of failing.
  - Omits fact 2 entirely: the folder name must equal <meta><name>, enforced case-insensitively by AppNameValidator on install/refresh/validate.
  - Install/activate command sequence (fact 3) is covered accurately and completely.
  - Official: [code: Framework/App/Validation/AppNameValidator.php:17-28] — "The folder name must equal <meta><name> (case-insensitive); a mismatch aborts install/refresh unless --no-validate is passed — contradicts an 'app:refresh fails on missing/empty author' claim."
- **dev-68 (mcp-wiki)** — partly, 70%
  - selfReportDelta shows an undisclosed grep_docs call not in the self-reported toolCallLog -> Honesty = 0 per rubric, regardless of the content quality otherwise.
  - Content is otherwise excellent and comprehensive: all three facts (GET handshake headers, proof formula, confirmation POST signed with the new secret plus the -previous header on re-registration, secret-must-differ rule) are accurately covered.
  - Official: none recorded
- **func-01 (mcp-wiki)** — partly, 65%
  - Covers the required-fields-before-save list and describes visibility/sales-channel assignment only at a UI level, not the technical product_visibility mechanism (3 enforced levels, per-route thresholds, closeout gating).
  - Entirely omits the case's core diagnostic fact for a variant product: the write-protected display_group derived from variant_listing_config, and the known 6.7 bug where 'Generate variants' never persists that config, causing the listing to show one arbitrary child variant instead of the parent. This is squarely what 'why might it not show up' is asking for a variant product.
  - Tab-gating description ('additional tabs become available') repeats the less-precise framing the case's own change log corrected — the create route in fact renders no tab bar at all, not just fewer tabs.
  - Official: [code: Content/Product/Aggregate/ProductVisibility/ProductVisibilityDefinition.php:24-28,63-68] — "final public const VISIBILITY_LINK = 10; … VISIBILITY_SEARCH = 20; … VISIBILITY_ALL = 30; all three fields Required."
- **func-02 (mcp-wiki)** — partly, 65%
  - Correctly states the NULL-availability-rule-means-unrestricted behaviour and that an in-use rule cannot be deleted (fact 1's core points).
  - Entirely omits fact 2: the payload/serialization matching mechanism (an invalid or un-indexed rule's payload never matches, silently blocking the method it guards).
  - Entirely omits fact 3: the two-stage enforcement (route-level onlyAvailable filtering vs cart-validation ShippingMethodBlockedError/PaymentMethodBlockedError with distinct reasons).
  - Answer is mostly generic Rule Builder UI description (menu path, AND/OR, priority) that the case's own review found unsupported by any code lane.
  - Official: [code: Checkout/Shipping/ShippingMethodDefinition.php:81] — "(new FkField('availability_rule_id', 'availabilityRuleId', RuleDefinition::class)) — one nullable availability rule per shipping/payment method."
- **func-04 (mcp-wiki)** — partly, 82%
  - Repeats the docs' 5-item premapping list (payment methods, 'Standard Payment Method', salutation, delivery time, standard delivery time) verbatim — this is the case's documented doc/code divergence: there are 8 premapping readers (also order states, order delivery states, transaction states, newsletter recipient status), and no separate 'Standard Payment Method' reader exists at all.
  - Correctly avoids conflating shipping methods (which do have a DataSet and are migrated) with shipping costs (which don't); B2B Suite and template/shopping-world non-transfer are correctly stated.
  - DataSelections list is reasonably complete though not naming languages/newsletterRecipient/wishlist individually.
  - Official: [code: SwagMigrationAssistant@6.6.x src/Migration/Run/RunService.php:93-95,270-284] — "Eight things require premapping in the Shopware 5 profiles — not five — enforced server-side via premappingIsIncomplete."
- **func-05 (mcp-wiki)** — partly, 67%
  - Names only 3 sales-channel types (storefront/headless/product comparison), missing the 4th (Agentic commerce) and the fact that all Required fields apply regardless of type.
  - States only that domains carry URL/language/currency/snippet set but never states only Storefront-type channels are served by domain routing, nor that a headless channel needs no domain.
  - Access-key mechanism is reduced to 'API access section...produces an API Access ID' — no sw-access-key header, no SWSC prefix, no 'no secret counterpart', no GET /api/_action/access-key/sales-channel endpoint; repeats the docs-only 'API Access ID' naming the expected answer flags as outdated.
  - findabilityStrict fail per audit (3 list/grep calls before target).
  - Official: [code: System/SalesChannel/SalesChannelDefinition.php:108-117,131,141-146] — "typeId, languageId, customerGroupId, currencyId, paymentMethodId, shippingMethodId, countryId, navigationCategoryId and accessKey are Required for every sales channel type."
- **func-06 (mcp-wiki)** — partly, 70%
  - Case is pinned to 6.6, but answer opens with 'under Settings > Automation' — the expected 6.6 menu path is Settings > Shop; this is the exact version-pin error the case is designed to catch.
  - Does not state that recipient.type=custom REPLACES rather than adds to the event audience, and does not state a stock install already ships a default order-confirmation flow for checkout.order.placed.
  - Trigger list is presented as an example set (not closed), which is roughly consistent, but the 23+ hard-coded classes / state-machine / app-event assembly mechanism is not stated.
  - Actionable concrete steps for creating the flow are given clearly.
  - Official: [code: 6.6 Administration sw-flow/index.js:179-187 (ref v6.6.10.0)] — "In 6.6 the Flow Builder sits under Settings > Shop; 6.7 moves it to Settings > Automation."
- **func-07 (mcp-wiki)** — partly, 67%
  - States 'Start dry run...test the import without writing any data' — directly contradicts the confirmed fact that dry run performs the real writes then rolls back (log/file rows, invalid-CSV and media filesystem changes survive).
  - Repeats 'import can only add information, never remove it' unqualified — disproven for whole-column JSON fields such as price, which are replaced wholesale.
  - Presents the menu path unconditionally as Automation without the 6.6-vs-6.7 version split the case (6.6+6.7) requires.
  - Mentions the Second Unique Identifier matching mechanism but not that a duplicate key-to-column mapping silently collapses.
  - Official: [code: Content/ImportExport/ImportExport.php:116-118,180-182,191-194,196-210] — "Start dry run is not a write-free validation pass: it performs the real writes and rolls the DBAL transaction back at the end."
- **func-08 (mcp-wiki)** — partly, 67%
  - States 'Modifiable via Store API' makes a field 'publicly writable/readable' — conflates the write gate (allow_customer_write) with the separate read gate (store_api_aware); this is the exact known doc/code divergence.
  - Lists 10 field types (matches known doc omission of Price field) but does not state the 8 collapsed stored types nor that the Twig-name validation is unenforced in 6.6.
  - Does not state custom_field_set_relation as a separate aggregate or that field technical names are globally unique, not per-set.
  - No mention of the 6.6 all-non-whitelisted-write data-loss hole.
  - Official: [code: System/SalesChannel/Api/StructEncoder.php:378] — "Read, write and cart exposure are three independent columns written by three separate admin switches: store_api_aware, allow_customer_write, allow_cart_expose."
- **func-09 (mcp-wiki)** — partly, 77%
  - Correctly states both gate 1 (active + sales-channel assignment) and gate 2 (availability rule, blank=unrestricted) — 2 of 3 expected facts present.
  - Missing the 4th, code-only gate: the checkout gateway can add/remove methods after all DB gates pass (not documented, so expected).
  - Repeats the disproven doc claim that changing the Technical name 'can break existing payment method references' — code shows handler resolution keys off handler_identifier, not technical_name.
  - Citations are reused from func-02 in the same batch (reusedFrom) and are counted as backed per rubric.
  - Official: [code: Checkout/Payment/SalesChannel/SalesChannelPaymentMethodDefinition.php:15] — "$criteria->addFilter(new EqualsFilter('payment_method.salesChannels.id', $context->getSalesChannelId()));"
- **func-10 (mcp-wiki)** — fail, 52%
  - selfReportDelta has a non-empty missing list (grep_docs:platform/func::integration) — the self-reported toolCallLog under-reports the ground-truth call log, so Honesty scores 0 per rubric.
  - Offers 'Keep matching variants grouped' unconditionally for a case pinned 6.6+6.7 — this option does not exist in 6.6 at all, exactly the disallowed pitfall the expected answer warns against.
  - Lists only 3 places of use (categories, comparison feeds, product sliders), missing cross-selling and the cart rule — matches the known doc undercount (5 real places).
  - No mention of the product_stream entity / api_filter compiled-by-indexer mechanism.
  - Official: [code: Content/ProductStream/DataAbstractionLayer/ProductStreamIndexer.php:108] — "api_filter and invalid are WriteProtected: ProductStreamIndexer compiles the rows into api_filter on every write."
- **func-11 (mcp-wiki)** — partly, 80%
  - Fact 3 (access key/secret issued once, regenerate replaces both) is captured clearly and matches the code-confirmed doc claims.
  - Fact 1 (module route, privilege strings integration.viewer/.creator/.editor) is not stated — only the generic admin path is given.
  - Fact 2's mechanism (WriteProtected(SYSTEM_SCOPE) admin flag, separate updateAdmin API call, mutual exclusivity with ACL roles) is reduced to the plain doc-level 'administrator permissions or a role' statement.
  - No wrong/misleading statement identified — omission rather than inaccuracy.
  - Official: [code: administration src/module/sw-integration/index.js:14-46] — "settingsItem: { group: 'system', to: 'sw.integration.index', icon: 'regular-cog', privilege: 'integration.viewer' }"
- **func-12 (mcp-wiki)** — partly, 80%
  - Correctly identifies both features as Commercial-gated (customer-specific pricing: Beyond plan, API-only, no admin module; webhook action: Evolve plan) — matches fact 2 well and avoids the Trap (does not propose building either from scratch).
  - Does not state fact 1's code-level detail (16 core flow actions none HTTP, product_price.rule_id Required with no custom_price entity, checkout.order.placed trigger itself is core).
  - Does not name fact 3's OSS alternatives (rule-based Rule Builder customer conditions, promotion personaCustomers, app flow action / manifest webhook for external URL).
  - Expected target page platform/func/extensions/shopware-commercial.md was never read (findability fail); the answer is grounded instead in customer-specific-pricing.md and Flow-Builder.md, which happen to carry the relevant facts (drift, not violation).
  - Official: [code: Content/DependencyInjection/flow.xml:61-158] — "Core registers exactly 16 flow actions through the flow.action tagged iterator, none HTTP-related."
- **edge-06 (mcp-wiki)** — partly, 73%
  - Maps Magento attribute sets 1:1 onto 'custom field sets' without stating the structural difference the case's Trap explicitly requires (no attribute-set entity; custom_field_set binds by entity name, not per-product-type).
  - Names only the plugin mechanism for extensions, omitting the app (manifest.xml) mechanism entirely.
  - Store-view mapping is muddled ('shop view... falls back to Magento's default language') rather than clearly stating sales_channel_domain is the per-URL unit.
  - di.xml half correctly answered from labeled memory (Symfony DI, services.{xml,php}, decoration).
  - Official: [code: System/CustomField/Aggregate/CustomFieldSetRelation/CustomFieldSetRelationDefinition.php:19,46-47] — "No attribute-set equivalent exists: custom_field_set is bound to entity names through custom_field_set_relation, not a 1:1 attribute-set mapping (case Trap)."
- **edge-08 (mcp-wiki)** — partly, 73%
  - Calls EntityRepositoryInterface 'an older/outdated name' rather than stating it does not exist at all and causes a fatal class-not-found error — materially softer/less precise than the expected fact.
  - Correctly names injection via product.repository service with explicit constructor argument.
  - Does not state the autowiring naming requirement (the alias only resolves for EntityRepository $productRepository, not a differently-named argument).
  - Official: [code: Framework/DataAbstractionLayer/EntityRepository.php:30-36] — "/** * @final * * @template TEntityCollection of EntityCollection */ class EntityRepository — EntityRepositoryInterface does not exist."
- **edge-09 (mcp-wiki)** — partly, 73%
  - Repeats the exact disproven doc framing ('superseded by the Flow Builder starting with 6.4.8.0... now used only for the B2B-Suite') that the expected answer explicitly forbids repeating without correction — fails the case's central Trap.
  - Does not state that no Business Events admin screen exists in 6.6/6.7 at all (module absent, event_action tables dropped).
  - Correctly names Flow Builder, Settings > Automation, checkout.order.placed trigger and Send mail action.
  - Does not mention that 'business event' survives only as a read-only catalogue via GET /api/_info/events.json.
  - Official: [code: Migration/V6_5/Migration1670854818RemoveEventActionTable.php:24-29] — "the event_action, event_action_rule and event_action_sales_channel tables are dropped by a V6_5 migration — no Business Events configuration screen exists."
- **gap-01 (mcp-wiki)** — partly, 77%
  - Correctly states no dedicated Admin API route guide exists for plugins; names the Admin API concept page and Store API route guide as the closest material (misses the 2022 route-defaults ADR).
  - Introduces, as a labeled memory claim, a '#[Acl([...])] PHP attribute class' — this is factually wrong: 6.7 has no dedicated Acl attribute class, only the _acl Route default enforced by AclAnnotationValidator, which is exactly the invention the case's fact 3 forbids.
  - The memory label correctly excludes this from Citation scoring, but it counts against Accuracy as a materially wrong statement.
  - Official: [code: Framework/Api/Controller/AclController.php:19,33-41] — "In 6.7 both scope and ACL are Symfony #[Route] defaults (_routeScope, _acl) — there is no #[RouteScope] or #[Acl] PHP attribute class."
- **gap-02 (mcp-wiki)** — partly, 73%
  - selfReportDelta has a non-empty missing list — the self-reported toolCallLog under-reports the ground-truth call log, so Honesty scores 0 per rubric.
  - Correctly finds nothing on the 6.7-specific JWT/RSA-key removal and cites the CLI helper's stale 'required only before 6.5' note.
  - Does not name the deployer guide's config/jwt copy step nor the commands-reference listing generate-app-secret (not generate-jwt-secret).
  - Correctly avoids inventing what now signs tokens (HMAC/APP_SECRET) — clean honest not-found on that half.
  - Official: [code: Framework/Api/OAuth/JWTConfigurationFactory.php:20-36] — "$secret = (string) EnvironmentHelper::getVariable('APP_SECRET'); … Configuration::forSymmetricSigner(new Hmac256(), $key)"
- **gap-03 (mcp-wiki)** — partly, 80%
  - Correctly states nothing in the corpus covers the 6.7 OAuth change and that oauth/authorize appears nowhere.
  - Does not flag the auth guide's 'scopes": "write"' example as stale/wrong for 6.7 (the server reads a singular space-delimited scope parameter).
  - Does not positively state that /api/oauth/authorize no longer exists in 6.7 — only that no page mentions it, which is weaker than the required fact.
  - Honest hedge at the end ('may be a genuine gap...or may not exist as stated') avoids fabrication but is somewhat non-committal.
  - Official: [code: Framework/Api/Controller/AuthController.php:33] — "#[Route(path: '/api/oauth/token', name: 'api.oauth.token', defaults: ['auth_required' => false], methods: ['POST'])] — no /authorize route exists in 6.7."
- **gap-04 (mcp-wiki)** — partly, 80%
  - Correctly states no page enumerates the native-typed properties and 'native type' does not occur in the corpus.
  - Does not name the backward-compatibility guideline (PropertyTypeNarrowing/Widening attributes, targeting v6.8.0) as the closest material, despite grepping backward-compatibility.md directly.
  - Does not state the only reliable enumeration method (grepping the 6.6 tree for the @deprecated tag:v6.7.0 markers).
  - Invents no property list or class names — clean on that count.
  - Official: [code: Framework/DataAbstractionLayer/Entity.php:14-29] — "protected string $_uniqueIdentifier; … protected ?string $versionId = null; — no enumerable list of affected properties exists; the change is repo-wide."
- **gap-06 (mcp-wiki)** — partly, 80%
  - selfReportDelta has a non-empty missing list — the self-reported toolCallLog under-reports the ground-truth call log, so Honesty scores 0 per rubric.
  - Correctly acknowledges no single step-by-step guide exists and assembles the answer from separate pages, but does not name the actual closest analogues the expected fact specifies (the app-manifest shipping guide and the payment-plugin installer guide) — uses different plugin-fundamentals pages instead.
  - Correctly states technicalName is Required, unique, and required from 6.7.0.0 (optional pre-6.7), matching the ADR-derived fact well.
  - Correctly presents shipping_method.repository + upsert() as the mechanism, which matches the code-confirmed 'only route that exists'.
  - Official: [code: Checkout/Shipping/ShippingMethodDefinition.php:77] — "(new StringField('technical_name', 'technicalName'))->addFlags(new ApiAware(), new Required()),"
- **gap-07 (mcp-wiki)** — partly, 73%
  - Correctly states the wiki has no plugin guide for creating a media entity from disk, and correctly enumerates the 3 narrow topics the media plugin index actually covers.
  - Labeled memory claim misnames the method as 'saveFile()' rather than the real MediaService::saveMediaFile(), and omits the $private-defaults-true detail.
  - Labeled memory claim states thumbnail generation happens 'as part of the write pipeline', which understates/contradicts that generation is dispatched asynchronously via GenerateThumbnailsMessage on the message bus.
  - Memory content is clearly labeled and does not affect Citation, but the method-name and timing errors count against Accuracy.
  - Official: [code: Content/Media/MediaService.php:53-68] — "MediaService::saveMediaFile(MediaFile $mediaFile, string $filename, Context $context, ?string $folder = null, ?string $mediaId = null, bool $private = true): string"

## Accuracy cross-checks

| Option | Flagged | Fetched | Served from cache | Bands changed | Fetch failures |
| --- | --- | --- | --- | --- | --- |
| `mcp-wiki` | 77 of 106 | 0 | 0 | 0 | none |

All 77 flagged cases carried `Status: confirmed` and were settled against their own `[code: …]` evidence tags (per the accuracy brief's confirmed-case rule) rather than fetched live against the official docs — no WebFetch/WebSearch calls were made, and no cache entries were created. 0 bands changed.

No band changed — every flagged case held its provisional accuracy.

## Observations about source availability

No case hit the Source-absent override in this run — the wiki's `platform/` layer is `implemented` (969 pages at dev/6.7, 744 at dev/6.6, 213 func, 10+10 guidelines) and every discover agent found relevant material for every query, including the six `dev`/`func` cases whose docs-corpus target is `none` (dev-12, dev-41, edge-04, edge-07 exception table — not applicable here since this is the wiki option) and the eight `gap-*` cases, six of which were correctly reported as an honest documentation gap (see below).

`gap-*` cases confirmed as documentation gaps by a passing, honest not-found: gap-05, gap-08 (2 of 8). The other 6 gap cases scored below pass because the agent either omitted required honest-gap framing or (func-10, gap-02, gap-06) under-reported its own tool-call log.

`edge-*` traps not fully caught: edge-06, edge-08, edge-09 — edge-06 (Magento migration) presented an unqualified 1:1 attribute-set mapping instead of naming the structural absence the trap tests for, and edge-08/edge-09 repeated stale documentation framing.

Several `confirmed`-status cases scored below pass because the wiki page (ingested from the official documentation) faithfully repeats a documented doc/code divergence the case is specifically designed to probe: dev-26 (Document System v2 trap), dev-39 (Cypress trap), dev-44 (Vue 3 migration traps), dev-59/dev-60/dev-61 (caching/message-queue/Elasticsearch defaults), dev-62 (`.env` cache:clear trap), dev-67/dev-70 (app-system claims), func-06/func-07/func-08/func-09/edge-09 (merchant pages not code-corrected). These are documentation-fidelity failures of the ingested content, not corpus-discovery failures — the agent read the right page and reported it accurately; the page itself is wrong or incomplete relative to the installed Shopware 6.7.13.0 source.

## Recommended fixes

Derived strictly from scorer `findings` on cases below `pass`:

- **dev-01** (mcp-wiki): Report gives a single 6.7-only recipe (implement getEntityName()) for a case pinned 6.6+6.7; on 6.6 getDefinitionClass() is the abstract method and implementing only getEntityName() would be a fatal PHP error — expected fact 1's version split is not addressed.
- **dev-01** (mcp-wiki): Illegal-field-type error and the Extension flag mechanism (fact 2) are only loosely paraphrased ('associations between two custom entities... FkField plus association fields'), missing the exact allowed-type list and error text, but the essence is present.
- **dev-01** (mcp-wiki): Tag shopware.entity.extension and BulkEntityExtension/shopware.bulk.entity.extension (fact 3) both correctly stated.
- **dev-02** (mcp-wiki): Audit flags an unlabelled uncited factual claim: 'in the installed code, activate() actually runs after the plugin is already flagged active... contrary to a docs description'. This is stated as verified code fact but is not labelled [from memory] and has no citation, and the agent's only tools are wiki docs — it cannot have verified 'the installed code'. Per rubric this presents an unsourced claim as retrieved material, so Honesty = 0; the same unlabelled claim caps Citation at 40.
- **dev-02** (mcp-wiki): Fact 3 (PluginLifecycleService install/uninstall order, CLI commands bin/console plugin:install --activate / plugin:uninstall --keep-user-data, default keepUserData=false) is not mentioned at all — no CLI guidance given.
- **dev-02** (mcp-wiki): Facts 1 (seven hooks) and 2 (keepUserData getter, early-return contract, what core deletes) are both correctly and fully stated.
- **dev-07** (mcp-wiki): Report states the tag's `entity` attribute 'should match getEntityName() exactly' and implies this is required, but the expected file's Absences table states EntityCompilerPass never reads the tag's entity attribute at all — only getEntityName() on the instantiated class drives the repository id. This is a materially wrong claim about what actually matters.
- **dev-07** (mcp-wiki): Facts about EntityDefinition's two abstract members and the migration owning table creation (created_at/updated_at auto-added) are correctly and fully stated.
- **dev-11** (mcp-wiki): Findability fail: 3 list/grep calls before the target was read (audit listGrepBeforeTargetRead=3, >2).
- **dev-11** (mcp-wiki): Report attributes the services.xml deprecation to 'Symfony 7.4' generically, while the expected answer pins it to Shopware's own 6.7.14.0 version-sensitive behaviour (silent up to 6.7.13.0, deprecated/throwing from 6.7.14.0) — a materially different and imprecise framing.
- **dev-11** (mcp-wiki): Fact 2 (autowiring is NOT on by default for plugin services — the crux of the query) is never stated plainly; the answer presents autowire-vs-explicit as a neutral choice without saying which is the default.
- **dev-11** (mcp-wiki): Fact 3's DAL-repository autowiring-alias exception is not mentioned.
- **dev-12** (mcp-wiki): Findability fail: the actual dependency-injection.md target was never reached (targetRead=false per audit); 7 list/grep calls occurred first, well over the 2-call threshold.
- **dev-12** (mcp-wiki): Report states 'Symfony autowiring is enabled core-wide in Shopware' — this directly contradicts expected fact 3: on 6.6 (and 6.7) a plugin's Definition defaults to autowired=false/autoconfigured=false and Bundle::registerContainerFile() injects no <defaults> block, so nothing is autowired unless the plugin opts in.
- **dev-12** (mcp-wiki): Report also implies only a file literally named services.xml is loaded ('Shopware automatically loads a file with exactly this name'), while the expected fact 1 states the loader globs services.* (xml/yaml/php all load).
- **dev-12** (mcp-wiki): The answer is grounded in real pages (add-custom-service.md, the Symfony DI ADR) but the two headline claims above appear to over-generalise from what those pages actually say.
- **dev-15** (mcp-wiki): The query specifically asks about the event 'after a page is rendered'; the expected fact 2 states there is no post-render event (StorefrontRenderEvent fires before the Twig call). The report lists '{route}.render (Storefront, StorefrontRenderEvent)' among route events without clarifying this is a before-render hook, which could mislead a reader into believing it fires after rendering.
- **dev-15** (mcp-wiki): Fact 3's specific discovery tools (bin/console debug:event-dispatcher showing only already-registered listeners, and the dead '@Event' search term) are not mentioned; the report instead recommends the Symfony profiler's Events tab, a different (plausible but unverified against this fact) route.
- **dev-15** (mcp-wiki): Fact 1's mechanism (EntityLoadedEvent name-string plus NestedEventDispatcher unwrapping, explaining why grepping for 'product.loaded' finds no dispatch site) is simplified to 'auto-generated per entity' without the underlying mechanism.
- **dev-17** (mcp-wiki): The critical gotcha in fact 3 — a custom price alone does not stick because shouldPriceBeRecalculated() also requires the allowProductPriceOverwrites permission on CartBehavior, which core only grants in admin/order-recalculation contexts and never in a plain storefront request — is entirely omitted. Following the report's recipe as given in a normal storefront request would plausibly have the price overwritten back by ProductCartProcessor.
- **dev-17** (mcp-wiki): Collector/processor split, priority 4500 vs core's 5000, and QuantityPriceDefinition/QuantityPriceCalculator usage (facts 1 and 2, and the first half of fact 3) are all correctly stated.
- **dev-18** (mcp-wiki): Findability fail: the actual target (add-cart-processor-collector.md) was never read; the answer draws on a reused citation from dev-17 plus add-cart-discounts.md instead.
- **dev-18** (mcp-wiki): The report's root-cause theory for duplication ('if added to $original it survives to the next calc's original') misdiagnoses the mechanism — the expected fact 2 explains duplication via the CartRuleLoader recalculation loop (up to 7 passes feeding results back as input) plus LineItemCollection::add() summing quantities rather than replacing, requiring a deterministic line-item id and reading the existing item back from $original. A processor never legitimately writes to $original in the first place, so the report's causal chain is not how core actually behaves.
- **dev-18** (mcp-wiki): Fact 1 (CartDataCollectorInterface has no $toCalculate parameter at all — only the processor can place items) is not stated.
- **dev-18** (mcp-wiki): Fact 3 (stale price via CartDataCollection carried forward, recompute in process() every pass) is captured reasonably well in practical terms.
- **dev-19** (mcp-wiki): Report gives the injected-bus service id as 'messenger.default_bus', while the expected fact 3 (and Symfony's actual alias) is 'messenger.bus.default' — the two strings are inverted; a developer copying the literal id would get a not-found service.
- **dev-19** (mcp-wiki): All three facts are otherwise substantially present: handler shape with #[AsMessageHandler] and no base class, the requirement to also tag messenger.message_handler because attribute-only autoconfiguration is not enabled by Shopware, and AsyncMessageInterface/LowPriorityMessageInterface routing.
- **dev-21** (mcp-wiki): The report explicitly requires listener priority 1000 for the BusinessEventCollectorEvent subscriber ('register a subscriber... with priority 1000'), which is exactly the case's flagged Trap: the expected answer states no elevated priority is needed, and 'an answer that passes must not require an elevated priority'.
- **dev-21** (mcp-wiki): The report does not distinguish set() vs add() on the collection (expected fact 2: add() must not be used or by-name lookups miss), nor mention the alternative Bundle::getActionEventClasses() registration route.
- **dev-21** (mcp-wiki): Fact 3 (flow.storer tag needed for trigger data to reach actions/mail templates, ScalarValuesAware) is not mentioned.
- **dev-21** (mcp-wiki): Fact 1 (FlowEventAware contract) is reasonably covered.
- **dev-23** (mcp-wiki): Report inserts mail_template with system_default = 0, repeating an editorial documentation instruction that expected fact 3's code evidence disputes: only the trait's idempotency lookup and the SSO invitation service filter on systemDefault=true, so 1 is the safer value for a type's canonical template and the docs' 'must be 0' claim is called out as editorial, not enforced by code.
- **dev-23** (mcp-wiki): The core helper Shopware\Core\Migration\Traits\CreateMailTemplateTrait (fact 2) is not mentioned at all.
- **dev-23** (mcp-wiki): The migration-based, data-only shipping approach (fact 1) is correctly described.
- **dev-24** (mcp-wiki): Report claims that without a matching seo_url_template row the mechanism 'silently does nothing', but expected fact 2 states SeoUrlUpdater::loadUrlTemplate() throws SeoException::invalidTemplate('Default templates not configured') — a direct contradiction of observable behaviour.
- **dev-24** (mcp-wiki): Fact 3 (per sales-channel/per-language generation, no sales-channel association required on the plugin entity) is not mentioned.
- **dev-24** (mcp-wiki): Fact 1 (SeoUrlRouteInterface contract, tag shopware.seo_url.route) is correctly stated; the workaround of subscribing to written/deleted events and calling SeoUrlUpdater::update() addresses the indexer-gap half of fact 2 even without naming SeoUrlUpdateListener's limited scope.
- **dev-26** (mcp-wiki): Answer is built entirely on the Document System v2 recipe (AbstractDocumentDataProvider, AbstractRenderData, shopware.document_v2.provider/.renderer), which is exactly the documented trap for a 6.7.13.0 pin: the case's ground truth shows no controller/route/flow action reaches the v2 generator, so a plugin built this way registers but is never invoked.
- **dev-26** (mcp-wiki): None of the 3 expected v1-stack facts (AbstractDocumentRenderer, document_type row + number range requirement, literal setTemplate() resolution) are present.
- **dev-26** (mcp-wiki): Citation is mechanically sound (real page, verified range) but the page itself is the known trap the case is testing.
- **dev-26** (mcp-wiki): Report's toolCallLog matches ground truth; no under-reporting.
- **dev-32** (mcp-wiki): States 'includeInSearch available since 6.7.6.0' — the case's ground truth fixes this at 6.7.7.0; a materially wrong version number for a migration-relevant fact.
- **dev-32** (mcp-wiki): The imperative repository example payload omits the `relations` key binding the set to the product entity — per expected fact 2 a set without that relation is silently never fetched/rendered, so the example as given would not satisfy the query ('for products').
- **dev-32** (mcp-wiki): Declarative-XML route (since 6.7.13.0) is described correctly; that part of fact 1 is present.
- **dev-32** (mcp-wiki): Does not mention set/field-name immutability or the custom_field.editor ACL requirement (part of fact 3).
- **dev-33** (mcp-wiki): Registration mechanics (hyphenated id, duplicate/display:false aborts, routes-or-routeMiddleware requirement) and the menu-entry rules (parent required, +1000 offset) both match expected facts 1 and 3.
- **dev-33** (mcp-wiki): Fact 2 (the Vite build chain: active plugin needed for var/plugins.json, .vite/entrypoints.json, silent bundle drop when missing, only bin/console system:check surfaces it) is essentially absent — the build description names webpack-era output paths (js/administration-new-module.js) and composer scripts without any Vite-specific mechanics, which is materially incomplete/misleading for '6.7' specifically.
- **dev-37** (mcp-wiki): phpunit.xml/TestBootstrap.php scaffolding chain (addCallingPlugin -> addActivePlugins -> setForceInstallPlugins(true) -> bootstrap() -> getClassLoader()) matches expected fact 1 almost verbatim.
- **dev-37** (mcp-wiki): IntegrationTestBehaviour/KernelTestBehaviour::getContainer() mechanics match fact 2.
- **dev-37** (mcp-wiki): Fact 3 (TestBootstrapper forces DATABASE_URL to end in _test; PHPUnit is not shipped by shopware/core; a 6.7 project pins phpunit/phpunit ^11.5) is replaced by a different, unverified claim ('composer require --dev dev-tools provides the PHPUnit binary'), which contradicts the expected mechanism — a materially wrong statement about where PHPUnit comes from.
- **dev-38** (mcp-wiki): Spec co-location (<name>.spec.js next to source) matches part of fact 1, but Jest version, jest-environment-jsdom, and @vue/test-utils 2.4.6 are never named.
- **dev-38** (mcp-wiki): The mount example puts `props`, `stubs`, `mocks`, `attachTo` at the TOP level of the shallowMount() options object instead of nested under `global` — exactly the Vue-3 test-utils mistake the expected answer calls out; this code would not correctly apply stubs/mocks under Vue 3 test-utils. `wrapTestComponent` is never mentioned.
- **dev-38** (mcp-wiki): Presents `composer run admin:create:test` / `composer run admin:unit` as usable tooling without noting that 6.7 ships no Jest harness for a plugin at all and that these scripts exist only in the shopware/shopware monorepo — materially misleading for a plugin author.
- **dev-39** (mcp-wiki): Findability fail: never read the actual target (e2e-playwright/install-configure.md); read the legacy Cypress page and the testing index instead.
- **dev-39** (mcp-wiki): Answer gives a full, detailed how-to for setting up Cypress in 6.7 (npm install @shopware-ag/e2e-testsuite-platform, etc.) despite the package being archived and Cypress support being functionally gone at 6.7.13.0 — exactly the fabricated 'how-to' the case's not-found/edge bands score 0 for.
- **dev-39** (mcp-wiki): Playwright is mentioned only as a passing reference to a directory path; none of the 3 expected facts (no Cypress support at all, the actual Playwright acceptance-test-suite setup, the actor-pattern test structure) are actually stated.
- **dev-39** (mcp-wiki): Citations are real and verified, but both are the known trap/legacy pages, not the correct target.
- **dev-41** (mcp-wiki): Findability fail: 4 list/grep calls before reaching a page carrying the facts; also read a non-existent installation/system-requirements.md path along the way.
- **dev-41** (mcp-wiki): PHP tilde-range constraint, extension list, memory_limit/max_execution_time thresholds match fact 1 closely and precisely.
- **dev-41** (mcp-wiki): Fact 2's key insight — that the database-version check runs only inside system:install/the web installer, never during composer update or app boot, so a green `composer update` proves nothing about the DB — is entirely missing; only the version numbers are given.
- **dev-41** (mcp-wiki): Fact 3's key insight — that `composer check-platform-reqs` is the actual CLI preflight tool, and that `bin/console system:check` does NOT answer this question — is missing; the answer instead recommends manual `php -v`/`php -m` checks, which work but bypass the idiomatic answer to 'how do I check the machine'.
- **dev-41** (mcp-wiki): Node version given (20.0.0 minimum) doesn't distinguish the stricter Storefront requirement (^20.19.0) from the Administration's (^20.0.0).
- **dev-44** (mcp-wiki): States 'this.$tc still works... with the explicit exception' — this is precisely the trap the expected answer calls out as wrong: $tc is deprecated tag:v6.8.0, not a safe exception to the 'search for this.$' rule.
- **dev-44** (mcp-wiki): Suggests 'you may need this.$parent.$parent' as the $parent fix — precisely the wrong general fix the expected answer names: the async-wrapper depth is not fixed (11 sync-listed components, router path insert none), so a hard-coded extra hop is unreliable; the correct guidance is to walk the chain by $options.name or avoid $parent.
- **dev-44** (mcp-wiki): Also correctly identifies Shopware.Snippet.tc as the prop-default replacement, but the two trap statements above make the overall answer actively misleading on both named breakages.
- **dev-44** (mcp-wiki): Fact 3 (eslint no-tc-translation autofix scoped to **/*.js only, TS plugins get no warning) is entirely absent.
- **dev-46** (mcp-wiki): Gives the exact invocation `composer run admin:code-mods -- --plugin-name example-plugin --fix -v 6.7` — the case's expected answer explicitly names this as a trap: that composer script exists only in the shopware/shopware monorepo, not in a Flex/plugin install, where `npm run code-mods` from vendor/shopware/administration must be used instead.
- **dev-46** (mcp-wiki): Describes the `deprecated` prop bridge generically via sw-url-field rather than confirming it applies to sw-button/sw-card specifically as asked.
- **dev-46** (mcp-wiki): Fact 2 — that sw-tabs/sw-popover/sw-loader/sw-skeleton-bar do NOT follow the same deprecated-prop mechanism and, given their flags default false/undeclared, always render the deprecated variant regardless of markup in 6.7 — is entirely absent, so the answer implicitly (wrongly) generalises the deprecated-prop pattern.
- **dev-53** (mcp-wiki): Snippet-key mechanism (fact 2: sw-theme prefix, per tab/block/section, default substitution, index for options) is covered accurately and thoroughly.
- **dev-53** (mcp-wiki): Misdiagnoses the root cause of 'labels disappeared': frames inline label/helpText as already being phased out in 6.7, when code shows they still work as the admin's fallback in 6.7 and are only stripped under the experimental v6.8.0.0 flag — the actual mechanism the case probes. This is a materially misleading root-cause claim.
- **dev-53** (mcp-wiki): Fact 1 (unknown-key-is-fatal) nuance omitted.
- **dev-59** (mcp-wiki): Correctly covers the config-key move and the Redis/BAN-to-xkey change (fact 1 & 2 core content).
- **dev-59** (mcp-wiki): Misses the case's central diagnostic fact entirely: delayed invalidation is on by default in 6.7 and the actual PURGE only happens via the `shopware.invalidate_cache` scheduled task (every 5 min) — without a scheduled-task worker, Varnish is never purged. This is the most likely real cause of 'Varnish cache is never invalidated' and is unaddressed.
- **dev-59** (mcp-wiki): Does not mention sw-force-cache-invalidate or that purge failures are only logged.
- **dev-60** (mcp-wiki): Repeats two disproven docs claims as fact: that a CLI worker must also be run for the `failed` transport (code shows `failed` is a dead-letter target drained by messenger:failed:*, not a standing-worker transport — a second failure there discards the message), and that production workers should cover `webhook` (the case explicitly states naming webhook for a default 6.7 install is wrong, since WEBHOOKS_REWORK defaults off).
- **dev-60** (mcp-wiki): Omits that disabling the admin worker makes `scheduled-task:run` mandatory (queueScheduledTasks() has only two callers).
- **dev-60** (mcp-wiki): Correctly covers explicit-transport-naming (fact 1) and the admin_worker.enable_admin_worker toggle.
- **dev-61** (mcp-wiki): States 'default is three shards, three replicas' for the storefront indices — this is exactly the case's Trap: in 6.7 the storefront env defaults were emptied so the cluster decides; only the admin indices still default 3/3 (deprecated for 6.8).
- **dev-61** (mcp-wiki): Omits the admin search indices entirely (separate elasticsearch.administration.index_settings block, es:admin:index command) — fact 3 is missing.
- **dev-61** (mcp-wiki): Correctly names es:index as the reindex command and es:create:alias as the manual alias fallback, but recommends `cache:clear` for .env changes and `dal:refresh:index`, neither of which is confirmed as the Elasticsearch bundle's own mechanism.
- **dev-62** (mcp-wiki): selfReportDelta shows 4 undisclosed grep_docs calls (reported 2, actual 6) — the report misrepresents how the answer was obtained; Honesty = 0 per rubric.
- **dev-62** (mcp-wiki): States 'after changing .env values, Shopware requires bin/console cache:clear for them to take effect' — this is the case's explicit Trap: 'An answer whose remedy is cache:clear fails Accuracy.' The env-var reference page's precedence order (fact 1) is only given via a labelled [from memory] claim, not read from the source.
- **dev-62** (mcp-wiki): Carries an unlabelled, uncited factual claim about BLUE_GREEN_DEPLOYMENT (audit's unlabelledUncitedCandidates), capping Citation at 40.
- **dev-62** (mcp-wiki): Fact 3 (system_config/mailer not read from .env at all) is entirely missing.
- **dev-66** (mcp-wiki): Very thin answer relative to the case's key traps: presents sw-inheritance as needing value '1' rather than stating it is a bare presence check (any value, including 0/false, enables it).
- **dev-66** (mcp-wiki): Presents sw-skip-trigger-flow only in the context of POST /api/_action/sync, omitting that it is resolved for every /api route.
- **dev-66** (mcp-wiki): sw-version-id described as defaulting to 'the most recent record' rather than the live version, and its lack of validation is not mentioned; sw-language-id's fallback chain and languageNotFound error are not mentioned.
- **dev-67** (mcp-wiki): States 'app:refresh fails if author/copyright are missing or empty' — this is the case's documented doc/code divergence: an empty element passes the isset()-only check and installs; a genuinely missing element is swallowed and app:refresh reports 'Nothing to install...' instead of failing.
- **dev-67** (mcp-wiki): Omits fact 2 entirely: the folder name must equal <meta><name>, enforced case-insensitively by AppNameValidator on install/refresh/validate.
- **dev-67** (mcp-wiki): Install/activate command sequence (fact 3) is covered accurately and completely.
- **dev-68** (mcp-wiki): selfReportDelta shows an undisclosed grep_docs call not in the self-reported toolCallLog -> Honesty = 0 per rubric, regardless of the content quality otherwise.
- **dev-68** (mcp-wiki): Content is otherwise excellent and comprehensive: all three facts (GET handshake headers, proof formula, confirmation POST signed with the new secret plus the -previous header on re-registration, secret-must-differ rule) are accurately covered.
- **func-01** (mcp-wiki): Covers the required-fields-before-save list and describes visibility/sales-channel assignment only at a UI level, not the technical product_visibility mechanism (3 enforced levels, per-route thresholds, closeout gating).
- **func-01** (mcp-wiki): Entirely omits the case's core diagnostic fact for a variant product: the write-protected display_group derived from variant_listing_config, and the known 6.7 bug where 'Generate variants' never persists that config, causing the listing to show one arbitrary child variant instead of the parent. This is squarely what 'why might it not show up' is asking for a variant product.
- **func-01** (mcp-wiki): Tab-gating description ('additional tabs become available') repeats the less-precise framing the case's own change log corrected — the create route in fact renders no tab bar at all, not just fewer tabs.
- **func-02** (mcp-wiki): Correctly states the NULL-availability-rule-means-unrestricted behaviour and that an in-use rule cannot be deleted (fact 1's core points).
- **func-02** (mcp-wiki): Entirely omits fact 2: the payload/serialization matching mechanism (an invalid or un-indexed rule's payload never matches, silently blocking the method it guards).
- **func-02** (mcp-wiki): Entirely omits fact 3: the two-stage enforcement (route-level onlyAvailable filtering vs cart-validation ShippingMethodBlockedError/PaymentMethodBlockedError with distinct reasons).
- **func-02** (mcp-wiki): Answer is mostly generic Rule Builder UI description (menu path, AND/OR, priority) that the case's own review found unsupported by any code lane.
- **func-04** (mcp-wiki): Repeats the docs' 5-item premapping list (payment methods, 'Standard Payment Method', salutation, delivery time, standard delivery time) verbatim — this is the case's documented doc/code divergence: there are 8 premapping readers (also order states, order delivery states, transaction states, newsletter recipient status), and no separate 'Standard Payment Method' reader exists at all.
- **func-04** (mcp-wiki): Correctly avoids conflating shipping methods (which do have a DataSet and are migrated) with shipping costs (which don't); B2B Suite and template/shopping-world non-transfer are correctly stated.
- **func-04** (mcp-wiki): DataSelections list is reasonably complete though not naming languages/newsletterRecipient/wishlist individually.
- **func-05** (mcp-wiki): Names only 3 sales-channel types (storefront/headless/product comparison), missing the 4th (Agentic commerce) and the fact that all Required fields apply regardless of type.
- **func-05** (mcp-wiki): States only that domains carry URL/language/currency/snippet set but never states only Storefront-type channels are served by domain routing, nor that a headless channel needs no domain.
- **func-05** (mcp-wiki): Access-key mechanism is reduced to 'API access section...produces an API Access ID' — no sw-access-key header, no SWSC prefix, no 'no secret counterpart', no GET /api/_action/access-key/sales-channel endpoint; repeats the docs-only 'API Access ID' naming the expected answer flags as outdated.
- **func-05** (mcp-wiki): findabilityStrict fail per audit (3 list/grep calls before target).
- **func-06** (mcp-wiki): Case is pinned to 6.6, but answer opens with 'under Settings > Automation' — the expected 6.6 menu path is Settings > Shop; this is the exact version-pin error the case is designed to catch.
- **func-06** (mcp-wiki): Does not state that recipient.type=custom REPLACES rather than adds to the event audience, and does not state a stock install already ships a default order-confirmation flow for checkout.order.placed.
- **func-06** (mcp-wiki): Trigger list is presented as an example set (not closed), which is roughly consistent, but the 23+ hard-coded classes / state-machine / app-event assembly mechanism is not stated.
- **func-06** (mcp-wiki): Actionable concrete steps for creating the flow are given clearly.
- **func-07** (mcp-wiki): States 'Start dry run...test the import without writing any data' — directly contradicts the confirmed fact that dry run performs the real writes then rolls back (log/file rows, invalid-CSV and media filesystem changes survive).
- **func-07** (mcp-wiki): Repeats 'import can only add information, never remove it' unqualified — disproven for whole-column JSON fields such as price, which are replaced wholesale.
- **func-07** (mcp-wiki): Presents the menu path unconditionally as Automation without the 6.6-vs-6.7 version split the case (6.6+6.7) requires.
- **func-07** (mcp-wiki): Mentions the Second Unique Identifier matching mechanism but not that a duplicate key-to-column mapping silently collapses.
- **func-08** (mcp-wiki): States 'Modifiable via Store API' makes a field 'publicly writable/readable' — conflates the write gate (allow_customer_write) with the separate read gate (store_api_aware); this is the exact known doc/code divergence.
- **func-08** (mcp-wiki): Lists 10 field types (matches known doc omission of Price field) but does not state the 8 collapsed stored types nor that the Twig-name validation is unenforced in 6.6.
- **func-08** (mcp-wiki): Does not state custom_field_set_relation as a separate aggregate or that field technical names are globally unique, not per-set.
- **func-08** (mcp-wiki): No mention of the 6.6 all-non-whitelisted-write data-loss hole.
- **func-09** (mcp-wiki): Correctly states both gate 1 (active + sales-channel assignment) and gate 2 (availability rule, blank=unrestricted) — 2 of 3 expected facts present.
- **func-09** (mcp-wiki): Missing the 4th, code-only gate: the checkout gateway can add/remove methods after all DB gates pass (not documented, so expected).
- **func-09** (mcp-wiki): Repeats the disproven doc claim that changing the Technical name 'can break existing payment method references' — code shows handler resolution keys off handler_identifier, not technical_name.
- **func-09** (mcp-wiki): Citations are reused from func-02 in the same batch (reusedFrom) and are counted as backed per rubric.
- **func-10** (mcp-wiki): selfReportDelta has a non-empty missing list (grep_docs:platform/func::integration) — the self-reported toolCallLog under-reports the ground-truth call log, so Honesty scores 0 per rubric.
- **func-10** (mcp-wiki): Offers 'Keep matching variants grouped' unconditionally for a case pinned 6.6+6.7 — this option does not exist in 6.6 at all, exactly the disallowed pitfall the expected answer warns against.
- **func-10** (mcp-wiki): Lists only 3 places of use (categories, comparison feeds, product sliders), missing cross-selling and the cart rule — matches the known doc undercount (5 real places).
- **func-10** (mcp-wiki): No mention of the product_stream entity / api_filter compiled-by-indexer mechanism.
- **func-11** (mcp-wiki): Fact 3 (access key/secret issued once, regenerate replaces both) is captured clearly and matches the code-confirmed doc claims.
- **func-11** (mcp-wiki): Fact 1 (module route, privilege strings integration.viewer/.creator/.editor) is not stated — only the generic admin path is given.
- **func-11** (mcp-wiki): Fact 2's mechanism (WriteProtected(SYSTEM_SCOPE) admin flag, separate updateAdmin API call, mutual exclusivity with ACL roles) is reduced to the plain doc-level 'administrator permissions or a role' statement.
- **func-11** (mcp-wiki): No wrong/misleading statement identified — omission rather than inaccuracy.
- **func-12** (mcp-wiki): Correctly identifies both features as Commercial-gated (customer-specific pricing: Beyond plan, API-only, no admin module; webhook action: Evolve plan) — matches fact 2 well and avoids the Trap (does not propose building either from scratch).
- **func-12** (mcp-wiki): Does not state fact 1's code-level detail (16 core flow actions none HTTP, product_price.rule_id Required with no custom_price entity, checkout.order.placed trigger itself is core).
- **func-12** (mcp-wiki): Does not name fact 3's OSS alternatives (rule-based Rule Builder customer conditions, promotion personaCustomers, app flow action / manifest webhook for external URL).
- **func-12** (mcp-wiki): Expected target page platform/func/extensions/shopware-commercial.md was never read (findability fail); the answer is grounded instead in customer-specific-pricing.md and Flow-Builder.md, which happen to carry the relevant facts (drift, not violation).
- **edge-06** (mcp-wiki): Maps Magento attribute sets 1:1 onto 'custom field sets' without stating the structural difference the case's Trap explicitly requires (no attribute-set entity; custom_field_set binds by entity name, not per-product-type).
- **edge-06** (mcp-wiki): Names only the plugin mechanism for extensions, omitting the app (manifest.xml) mechanism entirely.
- **edge-06** (mcp-wiki): Store-view mapping is muddled ('shop view... falls back to Magento's default language') rather than clearly stating sales_channel_domain is the per-URL unit.
- **edge-06** (mcp-wiki): di.xml half correctly answered from labeled memory (Symfony DI, services.{xml,php}, decoration).
- **edge-08** (mcp-wiki): Calls EntityRepositoryInterface 'an older/outdated name' rather than stating it does not exist at all and causes a fatal class-not-found error — materially softer/less precise than the expected fact.
- **edge-08** (mcp-wiki): Correctly names injection via product.repository service with explicit constructor argument.
- **edge-08** (mcp-wiki): Does not state the autowiring naming requirement (the alias only resolves for EntityRepository $productRepository, not a differently-named argument).
- **edge-09** (mcp-wiki): Repeats the exact disproven doc framing ('superseded by the Flow Builder starting with 6.4.8.0... now used only for the B2B-Suite') that the expected answer explicitly forbids repeating without correction — fails the case's central Trap.
- **edge-09** (mcp-wiki): Does not state that no Business Events admin screen exists in 6.6/6.7 at all (module absent, event_action tables dropped).
- **edge-09** (mcp-wiki): Correctly names Flow Builder, Settings > Automation, checkout.order.placed trigger and Send mail action.
- **edge-09** (mcp-wiki): Does not mention that 'business event' survives only as a read-only catalogue via GET /api/_info/events.json.
- **gap-01** (mcp-wiki): Correctly states no dedicated Admin API route guide exists for plugins; names the Admin API concept page and Store API route guide as the closest material (misses the 2022 route-defaults ADR).
- **gap-01** (mcp-wiki): Introduces, as a labeled memory claim, a '#[Acl([...])] PHP attribute class' — this is factually wrong: 6.7 has no dedicated Acl attribute class, only the _acl Route default enforced by AclAnnotationValidator, which is exactly the invention the case's fact 3 forbids.
- **gap-01** (mcp-wiki): The memory label correctly excludes this from Citation scoring, but it counts against Accuracy as a materially wrong statement.
- **gap-02** (mcp-wiki): selfReportDelta has a non-empty missing list — the self-reported toolCallLog under-reports the ground-truth call log, so Honesty scores 0 per rubric.
- **gap-02** (mcp-wiki): Correctly finds nothing on the 6.7-specific JWT/RSA-key removal and cites the CLI helper's stale 'required only before 6.5' note.
- **gap-02** (mcp-wiki): Does not name the deployer guide's config/jwt copy step nor the commands-reference listing generate-app-secret (not generate-jwt-secret).
- **gap-02** (mcp-wiki): Correctly avoids inventing what now signs tokens (HMAC/APP_SECRET) — clean honest not-found on that half.
- **gap-03** (mcp-wiki): Correctly states nothing in the corpus covers the 6.7 OAuth change and that oauth/authorize appears nowhere.
- **gap-03** (mcp-wiki): Does not flag the auth guide's 'scopes": "write"' example as stale/wrong for 6.7 (the server reads a singular space-delimited scope parameter).
- **gap-03** (mcp-wiki): Does not positively state that /api/oauth/authorize no longer exists in 6.7 — only that no page mentions it, which is weaker than the required fact.
- **gap-03** (mcp-wiki): Honest hedge at the end ('may be a genuine gap...or may not exist as stated') avoids fabrication but is somewhat non-committal.
- **gap-04** (mcp-wiki): Correctly states no page enumerates the native-typed properties and 'native type' does not occur in the corpus.
- **gap-04** (mcp-wiki): Does not name the backward-compatibility guideline (PropertyTypeNarrowing/Widening attributes, targeting v6.8.0) as the closest material, despite grepping backward-compatibility.md directly.
- **gap-04** (mcp-wiki): Does not state the only reliable enumeration method (grepping the 6.6 tree for the @deprecated tag:v6.7.0 markers).
- **gap-04** (mcp-wiki): Invents no property list or class names — clean on that count.
- **gap-06** (mcp-wiki): selfReportDelta has a non-empty missing list — the self-reported toolCallLog under-reports the ground-truth call log, so Honesty scores 0 per rubric.
- **gap-06** (mcp-wiki): Correctly acknowledges no single step-by-step guide exists and assembles the answer from separate pages, but does not name the actual closest analogues the expected fact specifies (the app-manifest shipping guide and the payment-plugin installer guide) — uses different plugin-fundamentals pages instead.
- **gap-06** (mcp-wiki): Correctly states technicalName is Required, unique, and required from 6.7.0.0 (optional pre-6.7), matching the ADR-derived fact well.
- **gap-06** (mcp-wiki): Correctly presents shipping_method.repository + upsert() as the mechanism, which matches the code-confirmed 'only route that exists'.
- **gap-07** (mcp-wiki): Correctly states the wiki has no plugin guide for creating a media entity from disk, and correctly enumerates the 3 narrow topics the media plugin index actually covers.
- **gap-07** (mcp-wiki): Labeled memory claim misnames the method as 'saveFile()' rather than the real MediaService::saveMediaFile(), and omits the $private-defaults-true detail.
- **gap-07** (mcp-wiki): Labeled memory claim states thumbnail generation happens 'as part of the write pipeline', which understates/contradicts that generation is dispatched asynchronously via GenerateThumbnailsMessage on the message bus.
- **gap-07** (mcp-wiki): Memory content is clearly labeled and does not affect Citation, but the method-name and timing errors count against Accuracy.

## Borderline re-scores

| Case | Option | Dimension | First | Second | Taken | Total before → after | Verdict before → after |
| --- | --- | --- | --- | --- | --- | --- | --- |
| dev-04 | mcp-wiki | (no dimension changed) | — | — | — | 85% → 85% | pass → pass |
| dev-18 | mcp-wiki | citation | 100 | 70 | 70 | 62% → 50% | partly → fail |
| dev-18 | mcp-wiki | honesty | 100 | 40 | 40 | (combined with citation change above) | (combined) |
| dev-42 | mcp-wiki | (no dimension changed) | — | — | — | 85% → 85% | pass → pass |
| dev-68 | mcp-wiki | accuracy | 100 | 40 | 40 | 85% → 70% | pass → partly |
| dev-70 | mcp-wiki | (no dimension changed) | — | — | — | 85% → 85% | pass → pass |
| func-11 | mcp-wiki | actionability | 100 | 70 | 70 | 83% → 80% | partly → partly |
| edge-07 | mcp-wiki | (no dimension changed) | — | — | — | 85% → 85% | pass → pass |
| gap-05 | mcp-wiki | (no dimension changed) | — | — | — | 85% → 85% | pass → pass |
| rule-01 | mcp-wiki | (no dimension changed by rescore; honesty already forced to 0 by the selfReportDelta rule) | — | — | — | 85% → 85% | pass → pass |
| rule-04 | mcp-wiki | (no dimension changed by rescore; honesty already forced to 0 by the selfReportDelta rule) | — | — | — | 85% → 85% | pass → pass |

## Scorer discrepancies

None.

## Audit warnings

- rule-01: selfReportDelta.missing non-empty but scorer left honesty=100; forced honesty=0 and recomputed total per aggregation rule (audit notes this as likely cross-case batch-attribution noise, but the rule is applied regardless)
- rule-04: selfReportDelta.missing non-empty but scorer left honesty=100; forced honesty=0 and recomputed total per aggregation rule (same batch-attribution caveat as rule-01)
- rescore dev-04: no dimension changed (lower-band-wins had no effect); total confirmed 85, pass
- rescore dev-18: citation 100->70, honesty 100->40 (lower band wins); total 62->50, verdict partly->fail
- rescore dev-42: no dimension changed; total confirmed 85, pass
- rescore dev-68: accuracy 100->40 (lower band wins); total 85->70, verdict pass->partly
- rescore dev-70: no dimension changed; total confirmed 85, pass
- rescore func-11: actionability 100->70 (lower band wins); total 83->80, verdict stays partly
- rescore edge-07: no dimension changed; total confirmed 85, pass
- rescore gap-05: no dimension changed; total confirmed 85, pass
- rescore rule-01: no dimension changed by rescore itself (honesty already forced to 0 by the selfReportDelta rule above); total confirmed 85, pass
- rescore rule-04: no dimension changed by rescore itself (honesty already forced to 0 by the selfReportDelta rule above); total confirmed 85, pass
- audit: 8 cases flagged with selfReportDelta (dev-62, dev-63, dev-68, func-10, gap-02, gap-06, rule-01, rule-04) — see per-case notes; only cases where the scorer left honesty>0 despite a non-empty missing list were force-corrected during aggregation (rule-01, rule-04); dev-62/func-10/gap-02/gap-06/dev-68 already had honesty scored 0 or were separately corrected in the rescore pass
- audit: retrievalLines in the audit shards equals retrievalCalls for every sampled case rather than a true line count of returned MCP JSON payloads — recorded as computed by the auditor per the skill's 'never recompute audit arithmetic' rule; retrievalBytes is the more informative payload-size metric for this run
- warm cases excluded from access-cost aggregates: func-09, rule-03 (retrievalCalls=0 with a same-batch reused citation)
- accuracy pass: all 77 flagged cases had Status=confirmed and were settled against their own [code: ...] evidence tags rather than fetched live, per the brief's confirmed-case rule; 0 bands changed
