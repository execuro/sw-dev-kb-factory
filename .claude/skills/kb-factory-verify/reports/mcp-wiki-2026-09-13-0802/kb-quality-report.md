# KB quality report — mcp-wiki-2026-09-13-0802

## Run

| | |
| --- | --- |
| Run | `mcp-wiki-2026-09-13-0802` (`mcp-wiki`) |
| Options | mcp-wiki |
| Corpus | wiki — fingerprint: lastBuilt 2026-09-07, treeHash 836a72be, 1569 pages |
| Probe | kb_status corpus.name=wiki, entry points present: platform/index.md; layers: platform=implemented, marketplace=planned, project=planned |
| Model | inherited (not pinned) |
| Generated | 2026-09-13T11:17:03.119Z |
| Cases run | 100 of 100 (all) |
| Yardstick | cases.md ef932d8e, scoring-rubric.md 54864fb4, scorer-brief.md 1456b9ec, auditor-brief.md 4c2c6fdc, accuracy-brief.md 9009d748 |
| Execution | discover batches of 10, scorer shards of 25 (batched) |
| Skill | kb-factory-verify |

## Run cost

One row per option, sourced from `options.<option>.costs` and `costs.wallClockSeconds`. Usage is measured per discover batch and per scorer shard, never per case.

| Option | Agents | Tokens | Tool calls | Summed agent time | Usage complete |
| --- | --- | --- | --- | --- | --- |
| mcp-wiki | 17 (10 discover, 1 audit, 4 score, 1 accuracy, 1 rescore) | n/a — total (known floor: 1,561,383 across 14/17 agents) | n/a — total (known floor: 654) | n/a — total (known floor: 4832s) | no — score-shard-2, score-shard-3, score-shard-4 returned a "failed" status notification (session rate-limit hit mid-return) with no usage block, even though each one's output file completed and validated correctly; every other agent (discover ×10, audit, score-shard-1, accuracy, rescore) delivered full usage |

Wall-clock duration of the run: 3550s (run started 2026-09-13T08:02:16Z, ended 2026-09-13T09:01:26Z — covers discover through the rescore pass, before this report's writing/reconciliation step).

## Comparison

The headline table — one row per option, straight from `options.<option>` (no new computation).

| Option | Access | Corpus | Overall | Status | Developer | Functional | Findable | Edge passed | Gap confirmed | Pass / partly / fail / unavailable / unscored | Weakest dimension |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| mcp-wiki | mcp | wiki | 77% | Not ready | 77% | 66% | 69 of 83 | 5 of 9 | 6 of 8 | 40 / 49 / 11 / 0 / 0 | accuracy |

This is a single-option run (no `fs-wiki` counterpart in this run folder) — no delta computed here. Run `compare` once an `fs-wiki` run exists to see the mcp − fs delta for the wiki corpus.

## Dimension heatmap

| Dimension | Weight | mcp-wiki |
| --- | --- | --- |
| Grounding & Relevance | 25 | 92.9 |
| Accuracy vs. Expected Answer | 25 | 57.5 |
| Completeness | 15 | 62.8 |
| Citation & Traceability | 10 | 93.4 |
| Honesty | 15 | 85.4 |
| Actionability | 10 | 88.9 |

Average band score per option, `unscored` cases excluded (none unscored in this run).

### By area

| Area | Average |
| --- | --- |
| Services & DI | 46.7% |
| Checkout & Cart | 54.0% |
| Events | 60.0% |
| Merchant | 66.3% |
| Testing | 71.0% |
| Admin migration (Vue 3 / Vite / Pinia / Meteor) | 74.0% |
| Administration | 75.5% |
| Orders | 77.0% |
| Hosting & ops | 77.8% |
| Admin API | 78.3% |
| Config & CLI | 79.6% |
| Content | 80.0% |
| Content (CMS/mail/SEO/media/sitemap) | 80.0% |
| App system | 81.4% |
| DAL | 82.6% |
| Theme | 84.0% |
| Trap | 84.6% |
| Payment & Shipping | 85.0% |
| Core breaking changes | 86.7% |
| Gap | 88.0% |
| Storefront | 89.0% |
| Plugin fundamentals | 95.0% |
| Store API & headless | 100.0% |
| Platform upgrade | 100.0% |

## Verdict grid

| Case | Category | Area | mcp-wiki |
| --- | --- | --- | --- |
| dev-01 | dev | DAL | 70% partly ✓ |
| dev-02 | dev | Plugin fundamentals | 95% pass ✓ |
| dev-03 | dev | Store API & headless | 100% pass ✓ |
| dev-04 | dev | Content | 80% partly ✓ |
| dev-05 | dev | Theme | 88% pass ✓ |
| dev-06 | dev | Events | 80% partly ✓ |
| dev-07 | dev | DAL | 80% partly ✓ |
| dev-08 | dev | DAL | 95% pass ✓ |
| dev-09 | dev | DAL | 88% pass ✓ |
| dev-10 | dev | DAL | 77% partly ✓ |
| dev-11 | dev | Services & DI | 70% partly ✓ |
| dev-12 | dev | Services & DI | 35% fail ✗ |
| dev-13 | dev | Services & DI | 35% fail ✗ |
| dev-14 | dev | Events | 100% pass ✓ |
| dev-15 | dev | Events | 39% fail ✗ |
| dev-16 | dev | Orders | 88% pass ✓ |
| dev-17 | dev | Checkout & Cart | 73% partly ✓ |
| dev-18 | dev | Checkout & Cart | 35% fail ✗ |
| dev-19 | dev | Events | 31% fail ✓ |
| dev-20 | dev | Events | 50% fail ✗ |
| dev-21 | dev | Events | 60% partly ✓ |
| dev-22 | dev | Config & CLI | 77% partly ✓ |
| dev-23 | dev | Content (CMS/mail/SEO/media/sitemap) | 60% partly ✓ |
| dev-24 | dev | Content (CMS/mail/SEO/media/sitemap) | 100% pass ✓ |
| dev-25 | dev | Config & CLI | 88% pass ✓ |
| dev-26 | dev | Orders | 66% partly ✗ |
| dev-27 | dev | Storefront | 88% pass ✗ |
| dev-28 | dev | Storefront | 83% partly ✗ |
| dev-29 | dev | Storefront | 88% pass ✓ |
| dev-30 | dev | Storefront | 100% pass ✓ |
| dev-31 | dev | Storefront | 88% pass ✓ |
| dev-32 | dev | DAL | 80% partly ✓ |
| dev-33 | dev | Administration | 73% partly ✓ |
| dev-34 | dev | Administration | 73% partly ✓ |
| dev-35 | dev | Administration | 80% partly ✓ |
| dev-36 | dev | Administration | 76% partly ✓ |
| dev-37 | dev | Testing | 88% pass ✗ |
| dev-38 | dev | Testing | 62% partly ✓ |
| dev-39 | dev | Testing | 63% partly ✗ |
| dev-40 | dev | Platform upgrade | 100% pass ✓ |
| dev-41 | dev | Hosting & ops | 73% partly ✗ |
| dev-42 | dev | Config & CLI | 80% partly ✓ |
| dev-43 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 75% partly ✓ |
| dev-44 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 73% partly ✓ |
| dev-45 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 88% pass ✓ |
| dev-46 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 60% partly ✓ |
| dev-47 | dev | Payment & Shipping | 85% pass ✓ |
| dev-48 | dev | Storefront | 100% pass ✓ |
| dev-49 | dev | Core breaking changes | 80% partly ✓ |
| dev-50 | dev | Core breaking changes | 100% pass ✓ |
| dev-51 | dev | DAL | 88% pass ✓ |
| dev-52 | dev | Core breaking changes | 80% partly ✓ |
| dev-53 | dev | Theme | 80% partly ✓ |
| dev-54 | dev | Storefront | 92% pass ✓ |
| dev-55 | dev | Storefront | 70% partly ✓ |
| dev-56 | dev | Storefront | 92% pass ✓ |
| dev-57 | dev | Platform upgrade | 100% pass ✓ |
| dev-58 | dev | Hosting & ops | 88% pass ✓ |
| dev-59 | dev | Hosting & ops | 76% partly ✓ |
| dev-60 | dev | Hosting & ops | 76% partly ✓ |
| dev-61 | dev | Hosting & ops | 76% partly ✓ |
| dev-62 | dev | Config & CLI | 73% partly ✓ |
| dev-63 | dev | Config & CLI | 80% partly ✓ |
| dev-64 | dev | Admin API | 85% pass ✓ |
| dev-65 | dev | Admin API | 77% partly ✓ |
| dev-66 | dev | Admin API | 73% partly ✓ |
| dev-67 | dev | App system | 77% partly ✓ |
| dev-68 | dev | App system | 92% pass ✓ |
| dev-69 | dev | App system | 88% pass ✓ |
| dev-70 | dev | App system | 70% partly ✓ |
| dev-71 | dev | App system | 80% partly ✓ |
| func-01 | func | Merchant | 88% pass ✓ |
| func-02 | func | Merchant | 73% partly ✓ |
| func-03 | func | Merchant | 100% pass ✓ |
| func-04 | func | Merchant | 76% partly ✓ |
| func-05 | func | Merchant | 80% partly ✓ |
| func-06 | func | Merchant | 51% fail ✓ |
| func-07 | func | Merchant | 66% partly ✓ |
| func-08 | func | Merchant | 76% partly ✓ |
| func-09 | func | Merchant | 48% fail ✗ |
| func-10 | func | Merchant | 45% fail ✓ |
| func-11 | func | Merchant | 38% fail ✗ |
| func-12 | func | Merchant | 54% fail ✗ |
| edge-01 | edge | Trap | 95% pass – |
| edge-02 | edge | Trap | 100% pass – |
| edge-03 | edge | Trap | 73% partly – |
| edge-04 | edge | Trap | 65% partly – |
| edge-05 | edge | Trap | 95% pass – |
| edge-06 | edge | Trap | 80% partly – |
| edge-07 | edge | Trap | 92% pass – |
| edge-08 | edge | Trap | 95% pass – |
| edge-09 | edge | Trap | 66% partly – |
| gap-01 | gap | Gap | 67% partly – |
| gap-02 | gap | Gap | 92% pass – |
| gap-03 | gap | Gap | 91% pass – |
| gap-04 | gap | Gap | 91% pass – |
| gap-05 | gap | Gap | 77% partly – |
| gap-06 | gap | Gap | 100% pass – |
| gap-07 | gap | Gap | 91% pass – |
| gap-08 | gap | Gap | 95% pass – |

## Requests and responses

What each discover agent was given and what it reported, straight from `raw/mcp-wiki/<case-id>.json` and the mechanical facts in `derived/mcp-wiki/shard-*.json` — no scores, no judgement.

### mcp-wiki

| Case | Page reached | Findability | Citations verified | Memory claims | Self-report delta | Verdict |
| --- | --- | --- | --- | --- | --- | --- |
| dev-01 | platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-complex-data-to-existing-entities.md = target | pass | 2/2 | 0 | match | partly |
| dev-02 | platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/plugin-lifecycle.md = target | pass | 1/1 | 0 | match | pass |
| dev-03 | platform/dev/6.7/guides/plugins/plugins/framework/store-api/add-store-api-route.md = target | pass | 1/1 | 0 | match | pass |
| dev-04 | platform/dev/6.7/guides/plugins/plugins/content/cms/add-cms-element.md = target | pass | 1/1 | 0 | match | partly |
| dev-05 | platform/dev/6.7/guides/plugins/themes/inheritance/add-theme-inheritance.md = target | pass | 2/2 | 0 | match | pass |
| dev-06 | platform/dev/6.7/guides/plugins/plugins/framework/flow/add-flow-builder-action.md = target | pass | 1/1 | 0 | match | partly |
| dev-07 | platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-custom-complex-data.md = target | pass | 1/1 | 0 | match | partly |
| dev-08 | platform/dev/6.7/guides/plugins/plugins/framework/data-handling/reading-data.md = target | pass | 1/1 | 0 | match | pass |
| dev-09 | platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-data-translations.md = target | pass | 1/1 | 0 | match | pass |
| dev-10 | platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-data-indexer.md = target | pass | 1/1 | 0 | match | partly |
| dev-11 | platform/dev/6.7/guides/plugins/plugins/services/add-custom-service.md ≠ target (platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md) | pass | 2/2 | 0 | under-reported (4) | partly |
| dev-12 | platform/dev/6.6/guides/plugins/plugins/plugin-fundamentals/dependency-injection.md = target | fail | 1/1 | 0 | match | fail |
| dev-13 | platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md = target | fail | 1/1 | 0 | match | fail |
| dev-14 | platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md = target | pass | 1/1 | 0 | match | pass |
| dev-15 | platform/dev/6.7/resources/references/core-reference/commands-reference.md ≠ target (platform/dev/6.7/guides/plugins/plugins/framework/event/finding-events.md) | fail | 2/2 | 0 | match | fail |
| dev-16 | platform/dev/6.7/guides/plugins/plugins/checkout/order/listen-to-order-changes.md = target | pass | 1/1 | 0 | match | pass |
| dev-17 | platform/dev/6.7/guides/plugins/plugins/checkout/cart/change-price-of-item.md = target | pass | 1/1 | 0 | under-reported (3) | partly |
| dev-18 | platform/dev/6.7/guides/plugins/plugins/checkout/cart/add-cart-processor-collector.md = target | fail | 3/3 | 1 | match | fail |
| dev-19 | platform/dev/6.7/guides/plugins/plugins/framework/message-queue/add-message-handler.md = target | pass | 1/1 | 0 | under-reported (3) | fail |
| dev-20 | platform/dev/6.7/guides/plugins/plugins/framework/rule/add-custom-rules.md = target | fail | 1/1 | 0 | match | fail |
| dev-21 | platform/dev/6.7/guides/plugins/plugins/framework/flow/add-flow-builder-trigger.md = target | pass | 1/1 | 0 | match | partly |
| dev-22 | platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-plugin-configuration.md = target | pass | 1/1 | 0 | match | partly |
| dev-23 | platform/dev/6.7/guides/plugins/plugins/content/mail/add-mail-template.md = target | pass | 1/1 | 0 | match | partly |
| dev-24 | platform/dev/6.7/guides/plugins/plugins/content/seo/add-custom-seo-url.md = target | pass | 1/1 | 0 | match | pass |
| dev-25 | platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-custom-commands.md = target | pass | 1/1 | 0 | match | pass |
| dev-26 | platform/dev/6.7/guides/plugins/plugins/checkout/documents/_index.md ≠ target (platform/dev/6.7/guides/plugins/plugins/checkout/documents/v2/add-a-document-type.md) | fail | 2/2 | 0 | match | partly |
| dev-27 | platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-templates.md = target | fail | 1/1 | 0 | match | pass |
| dev-28 | platform/dev/6.7/guides/plugins/plugins/storefront/javascript/override-existing-javascript.md = target | fail | 1/1 | 0 | under-reported (1) | partly |
| dev-29 | platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-data-to-storefront-page.md = target | pass | 1/1 | 0 | match | pass |
| dev-30 | platform/dev/6.7/guides/plugins/plugins/storefront/howto/add-listing-filters.md = target | pass | 1/1 | 0 | match | pass |
| dev-31 | platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-scss-variables.md = target | pass | 2/2 | 0 | match | pass |
| dev-32 | platform/dev/6.7/guides/plugins/plugins/framework/custom-field/add-custom-field.md = target | pass | 1/1 | 0 | match | partly |
| dev-33 | platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-module.md = target | pass | 1/1 | 0 | match | partly |
| dev-34 | platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-components.md = target | pass | 1/1 | 0 | match | partly |
| dev-35 | platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/using-data-handling.md = target | pass | 1/1 | 0 | match | partly |
| dev-36 | platform/dev/6.7/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.md = target | pass | 1/1 | 0 | match | partly |
| dev-37 | platform/dev/6.7/guides/development/testing/unit/php-unit.md = target | fail | 1/1 | 0 | match | pass |
| dev-38 | platform/dev/6.7/guides/development/testing/unit/jest-admin.md = target | pass | 1/1 | 0 | under-reported (2) | partly |
| dev-39 | platform/dev/6.7/guides/development/testing/legacy/_index.md ≠ target (platform/dev/6.7/guides/development/testing/e2e-playwright/install-configure.md) | fail | 2/2 | 0 | match | partly |
| dev-40 | platform/dev/6.7/guides/upgrades-migrations/upgrade-shopware.md = target | pass | 1/1 | 0 | match | pass |
| dev-41 | platform/dev/6.7/guides/hosting/_index.md = target | fail | 1/1 | 0 | match | partly |
| dev-42 | platform/dev/6.7/products/tools/cli/project-commands/upgrade.md = target | pass | 2/2 | 0 | match | partly |
| dev-43 | platform/dev/6.7/guides/upgrades-migrations/administration/vite.md = target | pass | 1/1 | 0 | match | partly |
| dev-44 | platform/dev/6.7/guides/upgrades-migrations/administration/vue3.md = target | pass | 1/1 | 0 | match | partly |
| dev-45 | platform/dev/6.7/guides/upgrades-migrations/administration/pinia.md = target | pass | 1/1 | 0 | match | pass |
| dev-46 | platform/dev/6.7/guides/upgrades-migrations/administration/meteor-components.md = target | pass | 1/1 | 0 | match | partly |
| dev-47 | platform/dev/6.7/guides/plugins/plugins/checkout/payment/add-payment-plugin.md = target | pass | 1/1 | 0 | under-reported (1) | pass |
| dev-48 | platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md = target | pass | 1/1 | 0 | match | pass |
| dev-49 | platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-controller.md = target | pass | 1/1 | 0 | under-reported (0) | partly |
| dev-50 | platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-scheduled-task.md = target | pass | 1/1 | 0 | match | pass |
| dev-51 | platform/dev/6.7/guides/plugins/plugins/framework/data-handling/entities-via-attributes.md = target | pass | 1/1 | 0 | match | pass |
| dev-52 | platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md = target | pass | 1/1 | 0 | match | partly |
| dev-53 | platform/dev/6.7/guides/plugins/themes/configuration/theme-configuration.md = target | pass | 1/1 | 0 | match | partly |
| dev-54 | platform/dev/6.7/guides/plugins/plugins/storefront/advanced/add-cookie-to-manager.md = target | pass | 1/1 | 0 | match | pass |
| dev-55 | platform/dev/6.7/guides/development/accessibility/storefront-accessibility.md = target | pass | 1/1 | 0 | match | partly |
| dev-56 | platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-header-footer.md = target | pass | 1/1 | 0 | match | pass |
| dev-57 | platform/dev/6.7/products/extensions/b2b-suite-migration/execution/running-migration.md = target | pass | 1/1 | 0 | match | pass |
| dev-58 | platform/dev/6.7/guides/hosting/infrastructure/redis.md = target | pass | 1/1 | 0 | under-reported (1) | pass |
| dev-59 | platform/dev/6.7/guides/hosting/infrastructure/reverse-http-cache.md = target | pass | 1/1 | 0 | match | partly |
| dev-60 | platform/dev/6.7/guides/hosting/infrastructure/message-queue.md = target | pass | 1/1 | 0 | match | partly |
| dev-61 | platform/dev/6.7/guides/hosting/infrastructure/elasticsearch/elasticsearch-setup.md = target | pass | 1/1 | 0 | match | partly |
| dev-62 | platform/dev/6.7/guides/hosting/configurations/shopware/_index.md ≠ target (platform/dev/6.7/guides/hosting/configurations/shopware/environment-variables.md) | pass | 2/2 | 1 | match | partly |
| dev-63 | platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md ≠ target (platform/dev/6.7/resources/references/core-reference/commands-reference.md) | pass | 1/1 | 0 | match | partly |
| dev-64 | platform/dev/6.7/guides/development/integrations-api/_index.md ≠ target (platform/dev/6.7/guides/development/integrations-api/auth-api-requests.md) | pass | 2/2 | 0 | match | pass |
| dev-65 | platform/dev/6.7/guides/development/integrations-api/search-criteria.md = target | pass | 1/1 | 0 | match | partly |
| dev-66 | platform/dev/6.7/guides/development/integrations-api/request-headers.md = target | pass | 1/1 | 0 | match | partly |
| dev-67 | platform/dev/6.7/guides/plugins/apps/app-base-guide.md = target | pass | 1/1 | 0 | under-reported (2) | partly |
| dev-68 | platform/dev/6.7/guides/plugins/apps/lifecycle/app-registration-setup.md = target | pass | 1/1 | 0 | match | pass |
| dev-69 | platform/dev/6.7/guides/plugins/apps/lifecycle/webhook.md = target | pass | 1/1 | 0 | match | pass |
| dev-70 | platform/dev/6.7/guides/plugins/apps/checkout/payment.md = target | pass | 1/1 | 0 | match | partly |
| dev-71 | platform/dev/6.7/guides/plugins/apps/custom-data/custom-entities.md = target | pass | 1/1 | 0 | match | partly |
| func-01 | platform/func/catalogues/products.md = target | pass | 3/3 | 0 | match | pass |
| func-02 | platform/func/settings/rules.md = target | pass | 3/3 | 0 | match | partly |
| func-03 | platform/func/marketing/promotions.md = target | pass | 1/1 | 0 | match | pass |
| func-04 | platform/func/migration-en/what-is-migrated.md = target | pass | 1/1 | 0 | match | partly |
| func-05 | platform/func/settings/saleschannel.md = target | pass | 1/1 | 0 | match | partly |
| func-06 | platform/func/settings/Flow-Builder.md = target | pass | 1/1 | 0 | under-reported (2) | fail |
| func-07 | platform/func/shopware-en/settings/importexport.md = target | pass | 1/1 | 0 | match | partly |
| func-08 | platform/func/settings/custom-fields.md = target | pass | 2/2 | 0 | match | partly |
| func-09 | platform/func/settings/Paymentmethods.md = target | fail | 2/2 | 0 | match | fail |
| func-10 | platform/func/shopware-6-de/Catalogues/Dynamicproductgroups.md = target | pass | 1/1 | 0 | under-reported (4) | fail |
| func-11 | platform/func/settings/system/integrationen.md = target | fail | 2/2 | 0 | match | fail |
| func-12 | platform/func/extensions/customer-specific-pricing.md ≠ target (platform/func/extensions/shopware-commercial.md) | fail | 2/2 | 0 | match | fail |
| edge-01 | — | n/a | 0/0 | 1 | match | pass |
| edge-02 | — | n/a | 0/0 | 2 | under-reported (0) | pass |
| edge-03 | platform/dev/6.7/concepts/framework/data-abstraction-layer.md  | n/a | 1/1 | 0 | match | partly |
| edge-04 | platform/dev/6.7/guides/plugins/plugins/framework/store-api/_index.md ≠ target (platform/dev/6.6/guides/integrations-api/general-concepts/api-versioning.md) | n/a | 2/2 | 0 | match | partly |
| edge-05 | platform/dev/6.7/products/tools/mcp-server/getting-started.md ≠ target (platform/dev/6.7/products/tools/mcp-server/intro.md) | n/a | 1/1 | 0 | match | pass |
| edge-06 | platform/func/migration-en/magento-firststeps.md ≠ target (platform/func/migration-en/magento-keywords.md) | n/a | 2/2 | 1 | match | partly |
| edge-07 | platform/dev/6.6/products/pwa.md = target | n/a | 1/1 | 0 | match | pass |
| edge-08 | platform/dev/6.7/guides/plugins/plugins/framework/data-handling/reading-data.md  | n/a | 2/2 | 0 | match | pass |
| edge-09 | platform/func/settings/Business-Events.md = target | n/a | 2/2 | 0 | match | partly |
| gap-01 | platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-controller.md  | n/a | 3/4 | 2 | match | partly |
| gap-02 | platform/dev/6.7/products/tools/cli/project-commands/helper-commands.md  | n/a | 1/2 | 0 | under-reported (1) | pass |
| gap-03 | platform/dev/6.7/guides/development/integrations-api/auth-api-requests.md  | n/a | 1/1 | 0 | match | pass |
| gap-04 | platform/dev/6.7/guides/development/extensions/architecture/final-and-internal.md  | n/a | 3/3 | 0 | under-reported (1) | pass |
| gap-05 | platform/dev/6.7/guides/plugins/plugins/framework/caching/_index.md  | n/a | 2/2 | 0 | match | partly |
| gap-06 | platform/dev/6.7/guides/plugins/plugins/creating-plugins.md  | n/a | 2/2 | 1 | under-reported (1) | pass |
| gap-07 | platform/dev/6.7/guides/plugins/plugins/content/media/_index.md  | n/a | 2/2 | 0 | match | pass |
| gap-08 | platform/dev/6.7/guides/development/integrations-api/_index.md  | n/a | 4/4 | 0 | match | pass |

## Scores by case

### mcp-wiki

| Case | Grounding | Accuracy | Completeness | Citation | Honesty | Actionability | Total | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dev-01 | 100 | 0 | 70 | 100 | 100 | 100 | 70% | partly |
| dev-02 | 100 | 100 | 70 | 100 | 100 | 100 | 95% | pass |
| dev-03 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-04 | 100 | 70 | 40 | 100 | 100 | 70 | 80% | partly |
| dev-05 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-06 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| dev-07 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| dev-08 | 100 | 100 | 70 | 100 | 100 | 100 | 95% | pass |
| dev-09 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-10 | 100 | 40 | 70 | 100 | 100 | 70 | 77% | partly |
| dev-11 | 100 | 40 | 100 | 100 | 0 | 100 | 70% | partly |
| dev-12 | 0 | 70 | 70 | 0 | 0 | 70 | 35% | fail |
| dev-13 | 0 | 70 | 70 | 0 | 0 | 70 | 35% | fail |
| dev-14 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-15 | 40 | 0 | 0 | 100 | 100 | 40 | 39% | fail |
| dev-16 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-17 | 100 | 70 | 70 | 100 | 0 | 100 | 73% | partly |
| dev-18 | 0 | 70 | 70 | 0 | 0 | 70 | 35% | fail |
| dev-19 | 70 | 0 | 0 | 100 | 0 | 40 | 31% | fail |
| dev-20 | 0 | 100 | 100 | 0 | 0 | 100 | 50% | fail |
| dev-21 | 100 | 0 | 40 | 100 | 100 | 40 | 60% | partly |
| dev-22 | 100 | 40 | 70 | 100 | 100 | 70 | 77% | partly |
| dev-23 | 100 | 0 | 40 | 100 | 100 | 40 | 60% | partly |
| dev-24 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-25 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-26 | 100 | 0 | 40 | 100 | 100 | 100 | 66% | partly |
| dev-27 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-28 | 100 | 70 | 70 | 100 | 70 | 100 | 83% | partly |
| dev-29 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-30 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-31 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-32 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| dev-33 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| dev-34 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| dev-35 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| dev-36 | 100 | 40 | 40 | 100 | 100 | 100 | 76% | partly |
| dev-37 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-38 | 100 | 40 | 70 | 100 | 0 | 70 | 62% | partly |
| dev-39 | 100 | 0 | 40 | 100 | 100 | 70 | 63% | partly |
| dev-40 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-41 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| dev-42 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| dev-43 | 100 | 0 | 100 | 100 | 100 | 100 | 75% | partly |
| dev-44 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| dev-45 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-46 | 100 | 0 | 40 | 100 | 100 | 40 | 60% | partly |
| dev-47 | 100 | 100 | 100 | 100 | 0 | 100 | 85% | pass |
| dev-48 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-49 | 100 | 40 | 100 | 100 | 70 | 100 | 80% | partly |
| dev-50 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-51 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-52 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| dev-53 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| dev-54 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-55 | 100 | 40 | 0 | 100 | 100 | 100 | 70% | partly |
| dev-56 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-57 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-58 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-59 | 100 | 40 | 40 | 100 | 100 | 100 | 76% | partly |
| dev-60 | 100 | 40 | 40 | 100 | 100 | 100 | 76% | partly |
| dev-61 | 100 | 40 | 40 | 100 | 100 | 100 | 76% | partly |
| dev-62 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| dev-63 | 100 | 70 | 40 | 100 | 100 | 70 | 80% | partly |
| dev-64 | 100 | 70 | 70 | 100 | 100 | 70 | 85% | pass |
| dev-65 | 100 | 40 | 70 | 100 | 100 | 70 | 77% | partly |
| dev-66 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| dev-67 | 100 | 70 | 100 | 100 | 0 | 100 | 77% | partly |
| dev-68 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-69 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-70 | 100 | 40 | 0 | 100 | 100 | 100 | 70% | partly |
| dev-71 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| func-01 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| func-02 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| func-03 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| func-04 | 100 | 40 | 40 | 100 | 100 | 100 | 76% | partly |
| func-05 | 100 | 70 | 40 | 100 | 100 | 70 | 80% | partly |
| func-06 | 100 | 0 | 40 | 100 | 0 | 100 | 51% | fail |
| func-07 | 100 | 0 | 40 | 100 | 100 | 100 | 66% | partly |
| func-08 | 100 | 40 | 40 | 100 | 100 | 100 | 76% | partly |
| func-09 | 40 | 70 | 70 | 0 | 0 | 100 | 48% | fail |
| func-10 | 100 | 0 | 0 | 100 | 0 | 100 | 45% | fail |
| func-11 | 0 | 70 | 70 | 0 | 0 | 100 | 38% | fail |
| func-12 | 100 | 0 | 0 | 100 | 100 | 40 | 54% | fail |
| edge-01 | 100 | 100 | 70 | 100 | 100 | 100 | 95% | pass |
| edge-02 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| edge-03 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| edge-04 | 70 | 40 | 40 | 100 | 100 | 70 | 65% | partly |
| edge-05 | 100 | 100 | 70 | 100 | 100 | 100 | 95% | pass |
| edge-06 | 100 | 70 | 40 | 100 | 100 | 70 | 80% | partly |
| edge-07 | 100 | 100 | 70 | 100 | 100 | 70 | 92% | pass |
| edge-08 | 100 | 100 | 70 | 100 | 100 | 100 | 95% | pass |
| edge-09 | 100 | 0 | 40 | 100 | 100 | 100 | 66% | partly |
| gap-01 | 70 | 40 | 70 | 70 | 100 | 70 | 67% | partly |
| gap-02 | 100 | 100 | 70 | 70 | 100 | 100 | 92% | pass |
| gap-03 | 100 | 100 | 40 | 100 | 100 | 100 | 91% | pass |
| gap-04 | 100 | 100 | 40 | 100 | 100 | 100 | 91% | pass |
| gap-05 | 100 | 40 | 70 | 100 | 100 | 70 | 77% | partly |
| gap-06 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| gap-07 | 100 | 100 | 40 | 100 | 100 | 100 | 91% | pass |
| gap-08 | 100 | 100 | 70 | 100 | 100 | 100 | 95% | pass |

`unavailable` means the Source-absent override applied. No case hit that override in this run (every case had a real target to look up or a genuine trap to name).

## Failures and official references

- **dev-01 (mcp-wiki)** — partly, 70%
  - Answer states the extension class implements getDefinitionClass() to point at the extended entity — this is the known documentation defect: in 6.7 getDefinitionClass() does not exist and getEntityName() is the sole abstract method (expected fact 1); the answer never mentions getEntityName() as the 6.7 requirement.
  - Association field-type restriction (fact 2) and tag/BulkEntityExtension registration (fact 3) are both covered reasonably well.
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/add-complex-data-to-existing-entities.html — "In 6.7 the single abstract method — the only mandatory implementation — is getEntityName(): string ... getDefinitionClass() does not exist in 6.7. [code: Framework/DataAbstractionLayer/EntityExtension.php:46]"
- **dev-04 (mcp-wiki)** — partly, 80%
  - Administration registration (fact 1) and storefront template convention (fact 2) are covered.
  - Fact 3 — server-side data via AbstractCmsElementResolver (getType/collect/enrich, shopware.cms.data_resolver tag) — is entirely absent.
  - The documented trap (element-only registration reaches the change-element modal but the sidebar drag list is built solely from the block registry) is not mentioned.
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/content/cms/add-cms-element.html — "the Shopping Experiences sidebar list is built solely from the block registry — without a block the element can never be dragged onto the stage on its own. [code: administration .../sw-cms-sidebar/index.ts:144-161]"
- **dev-06 (mcp-wiki)** — partly, 80%
  - FlowAction contract (requirements/handleFlow/getName) and the flow.action tag with key/priority are covered correctly (facts 1-2).
  - Administration registration is described as overriding the sw-flow-sequence-action component, which diverges from the code-confirmed mechanism (flowBuilderService's addActionNames/addLabels/addIcons/addGroups/addActionGroupMapping); DelayableAction/TransactionalAction markers are not mentioned.
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/framework/flow/add-flow-builder-action.html — "The action only appears in the Administration once the flowBuilderService singleton has been given its label, icon, name mapping and group via addActionNames(), addLabels(), addIcons(), addGroups(), addActionGroupMapping(). [code: vendor/shopware/administration/.../flow-builder.service.ts:165-206]"
- **dev-07 (mcp-wiki)** — partly, 80%
  - Instructs tagging the service with `tag('shopware.entity.definition', ['entity' => ...])` and implies the entity attribute must match the entity name; the confirmed evidence states EntityCompilerPass never reads the tag's entity attribute at all — the name comes solely from getEntityName().
  - getEntityName()/defineFields() contract and default fallback to ArrayEntity/EntityCollection (fact 1) and the migration/created_at auto-fields fact (fact 3) are covered correctly.
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/add-custom-complex-data.html — "The entity='...' attribute on the tag is what tells Shopware the entity name — absent — EntityCompilerPass never reads tag attributes; it does new $class() and calls getEntityName(). [code: Framework/DependencyInjection/CompilerPass/EntityCompilerPass.php:63-68]"
- **dev-10 (mcp-wiki)** — partly, 77%
  - States the indexer 'must implement' only getName/iterate/update/handle, omitting the other two mandatory abstract members (getTotal and getDecorated) from EntityIndexer — a class following only the listed four would remain abstract.
  - Write-hook synchronous/queued behavior and the DISABLE_INDEXING re-entrancy escape hatch (fact 2) are covered well; dal:refresh:index basics (fact 3) are covered at a high level.
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/add-data-indexer.html — "EntityIndexer declares six abstract members: getName, iterate, update, handle, getTotal, getDecorated. [code: Framework/DataAbstractionLayer/Indexing/EntityIndexer.php:9-49]"
- **dev-11 (mcp-wiki)** — partly, 70%
  - toolCallLog under-reports the actual navigation by 4 calls (two 6.6 greps, a 6.6 read, and a read of adjusting-service.md never mentioned) — a materially under-reported log, honesty scored 0.
  - Presents services.php as the sole/primary file and frames services.xml as deprecated by Symfony 7.4/8.0, when at the installed 6.7.13.0 XML still loads with no deprecation and is still what plugin:create scaffolds; the Shopware-side deprecation only starts at 6.7.14.0.
  - Autowiring opt-in and explicit-argument injection (facts 2-3) are covered correctly.
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/services/dependency-injection.html — "In the installed 6.7.13.0, loading a plugin services.xml emits no deprecation and does not throw ... The deprecation landed one patch later, in released tag v6.7.14.0. [code: Framework/Bundle.php:212-245]"
- **dev-12 (mcp-wiki)** — fail, 35%
  - Self-reported toolCallLog claims a grep and a read_doc, but the ground-truth transcript shows zero actual tool calls (selfReportDelta reported:2, actual:0) and the citation's matchesToolCallLog is false — the cited page was never actually read; this is fabricated retrieval, not a discovery failure.
  - The content itself (services.xml location, positional <argument type="service">, autowiring off by default) happens to be substantively correct against the expected facts, but that correctness is not evidence the source was consulted.
  - Findability recorded as fail because the target was never actually read despite the citation claiming it.
  - Official: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/plugin-fundamentals/dependency-injection.html — "Constructor arguments are not autowired by default: Symfony's Definition defaults to autowired = false / autoconfigured = false. [code: vendor/symfony/dependency-injection/Definition.php:35,43]"
- **dev-13 (mcp-wiki)** — fail, 35%
  - Self-reported toolCallLog claims one read_doc call, but the ground-truth transcript shows zero actual calls (selfReportDelta reported:1, actual:0) and matchesToolCallLog is false — fabricated retrieval.
  - Decoration mechanics (abstract-class contract, .inner argument, getDecorated() throwing DecorationPatternException) are covered correctly, but the extension-point alternative (Extension/ExtensionDispatcher, .pre/.post/.error) named in fact 1 is entirely absent.
  - Findability recorded as fail because the target was never actually read despite being cited.
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/services/adjusting-service.html — "Before decorating, check whether the scope has an extension point ... Extension points are not universal: only 22 core classes extend Extension in 6.7. [code: Framework/Extensions/ExtensionDispatcher.php:52-77]"
- **dev-15 (mcp-wiki)** — fail, 39%
  - Never reached the actual target page (finding-events.md); instead read the unrelated commands-reference.md and finding-extensions.md, so findability is fail with no drift-tolerance rescue — the reached pages do not carry the expected facts.
  - None of the three expected facts (EntityLoadedEvent name-derivation for `product.loaded`, StorefrontRenderEvent being a before-render hook with the `.render`/`.request`/`.response`/`.encode` suffix family, or debug:event-dispatcher's registered-listeners-only limitation) are stated.
  - The answer substitutes the newer Extension-point mechanism as the primary way to find `product loaded`/`page rendered` events, which is a different, largely unrelated mechanism for the query's concrete examples.
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/framework/event/finding-events.html — "NestedEventDispatcher unwraps nested events and dispatches each under its getName() ... product.loaded fires on every repository read even though grepping the source for the string 'product.loaded' finds no dispatch site. [code: Framework/Event/NestedEventDispatcher.php:19-31]"
- **dev-17 (mcp-wiki)** — partly, 73%
  - toolCallLog under-reports the actual navigation by 3 calls (reads of add-cart-items.md and add-cart-discounts.md, plus a surcharge grep) — a materially under-reported log, honesty scored 0.
  - Collector/processor split, the priority-4500-after-ProductCartProcessor ordering, and QuantityPriceDefinition usage (facts 1-2) are covered well.
  - Fact 3's customPrice-extension / allowProductPriceOverwrites permission gate (only granted in the admin proxy and order recalculation, never plain storefront) is not mentioned.
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/cart/change-price-of-item.html — "ProductCartProcessor is tagged at priority 5000 for both the collector and the processor — the highest in core. [code: Checkout/DependencyInjection/cart.xml:355-356]"
- **dev-18 (mcp-wiki)** — fail, 35%
  - Self-reported toolCallLog claims three reads, but the ground-truth transcript shows zero actual calls (selfReportDelta reported:3, actual:0) and matchesToolCallLog is false for all three citations — fabricated retrieval, despite the answer honestly labelling its speculative fix as [from memory].
  - toCalculate-vs-original split and the need to recompute the quantity-dependent price every process() pass (facts 1 and 3) are covered at a conceptual level.
  - The specific duplication mechanism (CartRuleLoader feeding the result cart back as the next pass's input, and LineItemCollection::add() summing quantities rather than replacing) named in fact 2 is not covered; the fix is presented as an inference rather than a documented mechanism.
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/cart/add-cart-processor-collector.html — "LineItemCollection::add() on an already-present id does not replace the item — it sums the quantities and marks it modified. [code: Checkout/Cart/LineItem/LineItemCollection.php:30-53]"
- **dev-19 (mcp-wiki)** — fail, 31%
  - toolCallLog under-reports the actual navigation by 3 calls, including the read of the very target page it cites — a materially under-reported log, honesty scored 0.
  - States 'Registration is automatic: classes marked #[AsMessageHandler] are auto-tagged ... so no explicit tagging in services.php is needed' — this directly contradicts the confirmed fact that Shopware never marks plugin service definitions autoconfigured, so the attribute alone does not register a plugin handler; this is the exact trap the case tests and the answer fails it.
  - Final-class requirement, PHPStan enforcement, and the AsyncMessageInterface/transport-routing mechanism (parts of facts 1 and 3) are not mentioned.
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/framework/message-queue/add-message-handler.html — "The attribute alone is not enough to register a plugin handler ... So the service must be tagged messenger.message_handler unless the plugin's own services file declares autoconfigure="true". [code: Framework/Bundle.php:212-224; Framework/MessageQueue/MessageHandlerCompilerPass.php:18-41]"
- **dev-20 (mcp-wiki)** — fail, 50%
  - Self-reported toolCallLog claims a grep and a read, but the ground-truth transcript shows zero actual calls (selfReportDelta reported:2, actual:0) and matchesToolCallLog is false — fabricated retrieval.
  - Content itself covers all three expected facts (Rule class contract, shopware.rule.definition tag, and the mandatory ruleConditionDataProviderService/addCondition admin step) accurately, but that correctness does not offset the fabricated source trail.
  - Findability recorded as fail because the target was never actually read despite being cited.
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/framework/rule/add-custom-rules.html — "Administration registration is a separate, mandatory second step — the PHP tag alone does not make the condition selectable. [code: (administration) condition-type-data-provider.decorator.ts:83-91,953-979]"
- **dev-21 (mcp-wiki)** — partly, 60%
  - Recommends 'giving the subscriber a high priority (e.g. 1000) so it registers before other trigger subscribers' — this is exactly the documented recipe the case's Trap explicitly says an answer must not require.
  - Claims 'Since Shopware 6.5.0.0 event data is stored in a StorableFlow rather than read via getAvailableData()' — this contradicts the confirmed fact that getAvailableData() is still a required static method on FlowEventAware and still consumed by the collector in 6.7.
  - The FlowStorer mechanism (fact 3) is described reasonably, and the second-registration-route requirement (fact 2) is present in outline, but with the wrong priority guidance.
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/framework/flow/add-flow-builder-trigger.html — "the documented recipe demands a listener priority of 1000 and presents the BusinessEventCollectorEvent subscriber as the only route; neither holds. An answer that passes must not require an elevated priority, and must not treat define($class, $customName) as a way to register a differently named trigger."
- **dev-22 (mcp-wiki)** — partly, 77%
  - Lists 15 input-field types and omits 'price', while the confirmed evidence enumerates exactly 16 including price — a materially incomplete/incorrect list against the case's specific fact.
  - config.xml location and auto-rendering under Extensions > My extensions (fact 1) is covered correctly.
  - Fact 3 (system_config key format `<PluginName>.config.<fieldName>` and SystemConfigService typed getters, defaults saved only when declared) is not mentioned.
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/plugin-fundamentals/add-plugin-configuration.html — "the XSD enumerates exactly 16 types: text, textarea, text-editor, url, password, int, float, bool, checkbox, datetime, date, time, colorpicker, single-select, multi-select, price. [code: System/SystemConfig/Schema/config.xsd:38,41-60,84-88]"
- **dev-23 (mcp-wiki)** — partly, 60%
  - States 'system_default which must be 0' — the case's confirmed evidence identifies this exact documentation claim as editorial and disproven by code (no code enforces it; 1 is the safer value for a type's canonical template) — this is the known documentation defect the case tests, and the answer repeats it uncritically.
  - Migration-based insertion of mail_template_type/mail_template plus translations with an idempotency guard (part of fact 1) is covered well.
  - The CreateMailTemplateTrait helper (fact 2) and the mail_template_sales_channel-removed / no-PHP-registration-needed facts (fact 3) are not mentioned.
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/content/mail/add-mail-template.html — "mail_template.system_default is a plain BoolField that no code enforces ... the docs' 'must be 0' is editorial. [code: Content/MailTemplate/MailTemplateDefinition.php:56]"
- **dev-26 (mcp-wiki)** — partly, 66%
  - Answer is built entirely on the Document System v2 recipe (AbstractDocumentType, AbstractDocumentDataProvider, tags shopware.document_v2.type/.provider), which per the confirmed expected answer does not exist in the 6.7.13.0 pin — this is the documented trap page (add-a-document-type.md) and the agent's answer falls into it wholesale, missing the legacy v1 AbstractDocumentRenderer/document.renderer mechanism that is the correct answer for this pin.
  - Only the document_type row + number range requirement (part of expected fact 2) survives as roughly correct; the renderer contract (fact 1) and template resolution mechanism (fact 3) are entirely absent, replaced by the wrong v2 API surface.
  - Findability fail: 3 list/grep calls preceded the first read of any page, exceeding the ≤2 threshold before the agent settled on the (wrong) target content.
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/document/add-custom-document-type.html — "The Document v2 recipe does not apply at this patch level: AbstractDocumentType and the tag shopware.document_v2.type do not exist in 6.7.13.0. [code: Checkout/DependencyInjection/documentV2.php:62-128]"
- **dev-28 (mcp-wiki)** — partly, 83%
  - Correctly covers the extends-and-override recipe and async-import matching, but omits that override() is refused unless the name is already registered for the exact same selector (expected fact 1).
  - selfReportDelta shows one ground-truth grep call (oddly matching a different case's query pattern) missing from the self-reported log — a minor under-report, not a wholesale misrepresentation of how the answer was obtained.
  - Findability fail: 4 list/grep calls preceded the first read of the target page.
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/javascript/override-existing-javascript.html — "override() is refused with a console.warn unless the registry holds that name for that selector. [code: storefront: Resources/app/storefront/src/plugin-system/plugin.registry.js:21]"
- **dev-32 (mcp-wiki)** — partly, 80%
  - States 'this mechanism works for any entity, including products ... without requiring entity-specific setup' — this directly contradicts expected fact 2, which requires binding the set to the product entity via custom_field_set_relation (or the set is silently never fetched/rendered on the product page). Materially wrong for a query that specifically asks about product custom fields.
  - The includeInSearch/search-index version is stated as 6.7.6.0+ where the confirmed expected answer gives 6.7.7.0 — a minor version imprecision on top of the entity-binding error.
  - Correctly covers the new declarative custom-fields.xml mechanism (fact 1), including the exact 6.7.13.0 version it became available.
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/framework/custom-field/add-custom-field.html — "For the set to appear on the product detail page it must be bound to the product entity through a custom_field_set_relation row ... A set without that relation is silently never fetched and never rendered. [code: System/CustomField/Aggregate/CustomFieldSetRelation/CustomFieldSetRelationDefinition.php:45-46]"
- **dev-33 (mcp-wiki)** — partly, 73%
  - Covers the basic Shopware.Module.register call and correct entry-file convention, but omits the registration-abort conditions (no hyphen in id, already registered, missing routes/routeMiddleware, display:false) named in expected fact 1.
  - Never explains the build chain the query specifically asks about — plugin must be active for var/plugins.json, Vite writes entrypoints.json, bin/console assets:install must run, and a missing entrypoints.json silently drops the bundle with no warning (expected fact 2) — this is central to 'what has to line up for it to actually show up after a build' and is entirely missing.
  - Never mentions the menu-entry requirements (parent required, own icon with no manifest fallback, position+=1000) from expected fact 3, only gesturing at 'Add Menu Entry (see guide)'.
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/administration/module-component-management/add-custom-module.html — "Showing up after a build requires the whole chain, not just a green build ... only entries with administration.entryFilePath are built. [code: Framework/Plugin/BundleConfigGenerator.php:60-63]"
- **dev-34 (mcp-wiki)** — partly, 73%
  - Correctly distinguishes Component.override (in-place) from Component.extend (new component) and describes this.$super for extending methods — the three expected facts' core mechanisms are all named.
  - Gives 'card_header' as the example block name for changing the dashboard headline, whereas the actual block is sw_dashboard_index_content_intro_content_headline — a specific, checkable detail that appears to be a generic/wrong example rather than one read off the actual page.
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/administration/module-component-management/customizing-components.html — "for the dashboard headline, sw_dashboard_index_content_intro_content_headline in sw-dashboard-index.html.twig. [code: administration: src/module/sw-dashboard/page/sw-dashboard-index/sw-dashboard-index.html.twig:13-17]"
- **dev-35 (mcp-wiki)** — partly, 80%
  - Covers repositoryFactory.create()/search()/Criteria chainable methods (facts 1 and 2 substantially), but never mentions that the search is ACL-checked server-side via AclCriteriaValidator, recursing into every association touched (expected fact 3) — entirely absent.
  - States setTotalCountMode 2 returns 'limit * 5 + 1' rows; the confirmed expected answer's code evidence shows EntitySearcher::addTotalCountMode() actually fetches limit * 6 + 1 — the '* 5 + 1' figure is only the pagination-link math, a materially wrong number for what mode 2 actually returns.
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/administration/data-handling-processing/using-data-handling.html — "Mode 2 is documented as limit * 5 + 1 in both the SDK and core doc comments, but EntitySearcher::addTotalCountMode() actually fetches limit * 6 + 1 rows."
- **dev-36 (mcp-wiki)** — partly, 76%
  - Correctly covers addPrivilegeMappingEntry syntax with the dot/colon distinction, the acl.can() checking pattern, and enrichPrivileges() for server-side privilege shipping — all three expected facts are substantially present.
  - States 'ACL rules in the Administration UI only gate visibility/behavior in the UI — they can be bypassed via direct API calls, which are not gated by them' — this contradicts expected fact 3, which states API-level enforcement does happen via AclCriteriaValidator/AclWriteValidator on the persisted acl_role.privileges once a role is saved. The blanket 'not gated' claim is a materially misleading security statement.
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.html — "The Administration registration authorizes nothing server-side. Context::isAllowed() reads AdminApiSource::$permissions ... that path never consults the JS mappings. [code: Framework/Api/Context/AdminApiSource.php:73-80]"
- **dev-38 (mcp-wiki)** — partly, 62%
  - selfReportDelta shows the self-reported toolCallLog omits the read_doc call for jest-admin.md — the exact page the answer cites and is built on. This misrepresents how the answer was obtained and is a materially under-reported log per the rubric, scoring Honesty 0.
  - Recommends passing stubs/mocks/attachTo at the top level of mount()'s config object, when Vue-3 @vue/test-utils (which 6.7 uses) requires stubs/mocks/provide to be nested under a `global` key — this is the exact documented trap for this case and would produce non-working test code. Materially wrong.
  - Never mentions that Shopware ships no Jest harness for a plugin at all (expected fact 3) — the shipped jest.config.js only covers the Administration/Storefront's own admin extension, not third-party plugins.
  - Official: https://developer.shopware.com/docs/guides/development/testing/unit/jest-admin.html — "Vue-3 test-utils puts stubs/mocks/provide under global, not at the top level. [code: jest.config.js:96-104 (shopware/administration)]"
- **dev-39 (mcp-wiki)** — partly, 63%
  - Findability fail: the target page (e2e-playwright/install-configure.md) was never read; the agent stopped at the legacy Cypress/testing index pages instead (callsToTarget: 0, targetRead: false).
  - Answer flags Cypress as deprecated but then provides a full legacy Cypress setup walkthrough anyway, rather than stating plainly that there is no Cypress support in 6.7 and directing to the Playwright acceptance-test suite — this is exactly the documented failure mode the case (dev-39, confirmed) calls out as wrong.
  - None of the Playwright-specific facts (acceptance-test-suite package, actor/fixture pattern, npx playwright install, integration:create credentials) appear anywhere in the answer.
  - Official: https://developer.shopware.com/docs/guides/development/testing/e2e-playwright/install-configure.html — "There is no Cypress support in Shopware 6.7 — the premise of the question is stale ... upstream at tag v6.7.13.0 tests/e2e/cypress has been reduced to a single 0-byte support/commands/commands.js."
- **dev-41 (mcp-wiki)** — partly, 73%
  - States the PHP requirement as an open-ended '8.2+' → 8.4 recommended, when the confirmed expected answer states it is a bounded enumerated tilde list (~8.2.0 || ~8.3.0 || ~8.4.0 || ~8.5.0) — explicitly not an open-ended '8.2 or newer'. This is exactly the trap the case names and the answer falls into it.
  - Does not recommend `composer check-platform-reqs` as the actual tool to check the machine against Composer's declared platform requirements, instead suggesting manual `php -v`/`node -v` checks; also doesn't clarify that the database version check only runs at system:install time, not during composer update.
  - Findability fail: 4 list/grep calls preceded the first read of the target page.
  - Official: https://developer.shopware.com/docs/guides/hosting/ — "The PHP requirement Composer enforces is the enumerated constraint "php": "~8.2.0 || ~8.3.0 || ~8.4.0 || ~8.5.0" ... a bounded list, not an open-ended "8.2 or newer". [code: composer.json:51-72]"
- **dev-42 (mcp-wiki)** — partly, 80%
  - Correctly explains why custom/plugins content blocks the upgrade (the Composer-managed readiness prerequisite, and the autofix composer-plugins remedy) and cites the report path .shopware-cli/upgrade/report.md.
  - Recommends 'shopware-cli project validate --only phpstan ... to detect breaking changes in custom code', but the confirmed expected answer states this check runs PHPStan against the already-installed Shopware version with no Shopware-specific removed-API rule set — it does not detect target-version breaking changes. This overstates what the tool catches.
  - Official: https://developer.shopware.com/docs/products/tools/cli/project-commands/upgrade.html — "Plugins in custom/plugins are blocking because of the readiness check 'Extensions managed through Composer' ... any discovered extension with ComposerManaged == false sets the check to StateFail. [shopware-cli 0.18.4: internal/shop/upgrade/readiness.go:145-170,213-257]"
- **dev-43 (mcp-wiki)** — partly, 75%
  - Claims 'you can test the new system via the feature flag ADMIN_VITE' — the confirmed expected answer states no ADMIN_VITE flag exists in 6.7; the Vite build is unconditional. This is one of the two documented traps for this case.
  - Presents creating vite.config.mts as a mandatory numbered step of the migration, when the expected answer's explicit Trap states custom Vite configuration is optional and an answer presenting it as a mandatory drop-in is wrong. This is the second documented trap, also triggered.
  - Official: https://developer.shopware.com/docs/guides/upgrades-migrations/administration/vite.html — "in 6.7 the administration build is Vite-only and unconditional (no ADMIN_VITE feature flag exists), and a plugin supplies no build config of its own. [code: administration: Resources/app/administration/build/plugins.vite.ts:42-64,134-146]"
- **dev-44 (mcp-wiki)** — partly, 73%
  - Correctly recommends Shopware.Snippet.tc for the prop-default $tc failure, and correctly identifies the AsyncComponentWrapper as the cause of $parent shifting.
  - States 'mutating props now throws hard errors instead of being silently allowed' — this directly contradicts the expected answer's explicit Trap: Vue mutation only produces a console.warn in dev and is silent in production; an answer asserting a hard runtime error is called out as wrong.
  - Official: https://developer.shopware.com/docs/guides/upgrades-migrations/administration/vue3.html — "mutating a prop does not throw a hard error: Shopware's custom warnHandler re-throws only on 'Template compilation error', so prop mutation is a console.warn in dev and silent in production."
- **dev-46 (mcp-wiki)** — partly, 60%
  - Presents `composer run admin:code-mods -- --plugin-name example-plugin --fix -v 6.7` as the invocation for a plugin — the expected answer's explicit Trap states this composer script exists only in the shopware/shopware monorepo, not in a Flex/project install where a plugin actually lives; the correct invocation is `npm run code-mods` from vendor/shopware/administration.
  - States generally that 'Shopware components gained a deprecated prop', implying the mechanism applies broadly, when the expected answer's Trap specifically warns that this generalization is wrong for sw-tabs, sw-popover, sw-loader and sw-skeleton-bar (which use a different feature-flag gate). Fact 2 is entirely absent.
  - Both documented traps for this case are triggered.
  - Official: https://developer.shopware.com/docs/guides/upgrades-migrations/administration/meteor-components.html — "The invocation the docs give, composer run admin:code-mods -- --plugin-name example-plugin --fix -v 6.7, does not exist in a Flex/project install — that script is only in the monorepo's composer.json."
- **dev-49 (mcp-wiki)** — partly, 80%
  - Correctly gives the #[Route(defaults: [...])] class-level scope attribute and the routes.php 'attribute' loader-type wiring (facts 1 and 2).
  - States route names should use 'frontend, widgets, payment, api or store-api prefix' for the router to recognize a Storefront route — the confirmed expected answer states only frontend./widgets./payment. are valid storefront route-name prefixes, and api/store-api are unrelated URL path prefixes of a different mechanism. Including api/store-api here is a materially wrong statement.
  - selfReportDelta lists a missing grep call while the total count matches (3 reported = 3 actual) — a specific-call discrepancy rather than a volume under-report; scored as a minor honesty concern, not a full misrepresentation.
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/controllers/add-custom-controller.html — "the storefront route name must start with frontend., widgets. or payment. — the only three prefixes Router::isStorefrontRoute() accepts. [code: Storefront/Framework/Routing/Router.php:198-207]"
- **dev-52 (mcp-wiki)** — partly, 80%
  - Answer states 'MigrationStep::updateDestructive() is only used by Shopware core... plugin install/update never runs it' — this is materially misleading: plugins can and do implement destructive migrations, run via `database:migrate-destructive <Plugin> --all`, contradicting the expected fact that destructive steps are available to any migration source.
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/database/database-migrations.html — "updateDestructive() is optional (a concrete, empty method, not abstract) and destructive steps run only through database:migrate-destructive, never implicitly. [code: Framework/Migration/MigrationStep.php:38-40]"
- **dev-53 (mcp-wiki)** — partly, 80%
  - Answer states inline label/helpText are already omitted from theme.json since v6.7.1.0 by default — this contradicts the confirmed code fact that they still work in 6.7 as a fallback and are only stripped when the v6.8.0.0 feature flag is active. This is exactly the doc/code divergence the case tests, and the answer parrots the wrong (doc-derived) claim.
  - The admin snippet key structure (sw-theme.<name>.<tab>.<block>.<section>.<field>.label) is stated correctly.
  - Official: https://developer.shopware.com/docs/guides/plugins/themes/theme-configuration.html — "In 6.7 the translations belong in an Administration snippet file shipped by the theme, under the key sw-theme.<themeTechnicalName>... [code: shopware/storefront Theme/ThemeMergedConfigBuilder.php:512-521]"
- **dev-55 (mcp-wiki)** — partly, 70%
  - Answer states the ACCESSIBILITY_TWEAKS flag 'can be enabled in .env' and that changes become the default 'with major version v6.7.0 (the flag is effectively on)' — this is exactly the trap the expected answer calls out as wrong: in 6.7 nothing reads the flag at all, so it cannot be toggled either way.
  - Gives a feature()-gated block example (component_list_items / component_list_items_inner) as the 6.7 mechanism, when per the confirmed code the 6.7 templates carry no such conditional blocks — the change is unconditional.
  - Does not mention that an override of a removed block is silently dropped (no warning) except when it calls parent(), nor the SCSS/JS-generated markup changes named in the expected answer.
  - Official: https://developer.shopware.com/docs/guides/development/accessibility/storefront-accessibility.html — "In 6.7 the accessibility changes are unconditional ... nothing in core or storefront reads it — no PHP, Twig, JS or SCSS file — so it cannot be used to keep the old markup. [code: Framework/Resources/config/packages/feature.yaml:24-28]"
- **dev-59 (mcp-wiki)** — partly, 76%
  - Answer presents `use_varnish_xkey: true` and `ban_method: "BAN"` as the current, working 6.7 config — but per the confirmed code these keys are deprecated no-ops with no effect in 6.7; VarnishReverseProxyGateway with xkey PURGE is now unconditional and needs no such flag.
  - Completely omits the delayed-invalidation mechanism (delay_enabled defaults true, real purge only happens via the shopware.invalidate_cache scheduled task every 5 minutes) — this is very likely the actual root cause of 'Varnish cache is never invalidated' in the query, and it is entirely missing from the answer.
  - Does not mention `sw-force-cache-invalidate` or that `cache:clear` no longer touches the reverse proxy (use `cache:clear:http`/`:all`).
  - Official: https://developer.shopware.com/docs/guides/hosting/infrastructure/reverse-http-cache.html — "The Redis/LUA-based BAN integration is gone in 6.7 ... every tag invalidation is sent as an HTTP PURGE carrying an xkey header. [code: Framework/Adapter/Cache/ReverseProxy/VarnishReverseProxyGateway.php:50-56,81-84,115-123]"
- **dev-60 (mcp-wiki)** — partly, 76%
  - Answer states 'A CLI worker must also be set up for the failed-message transport, otherwise failed messages are never processed' and that failed messages are 'retried automatically 3 times, then deleted' — both contradict the expected facts: `failed` is a dead-letter target drained with `messenger:failed:*` commands, not consumed by a standing worker, and exhausted messages are moved to `failed`, never deleted.
  - Correctly gives explicit `messenger:consume async low_priority` and the admin-worker-disable config key, but omits that disabling the admin worker makes `bin/console scheduled-task:run` mandatory — a critical operational consequence named in the expected answer.
  - Official: https://developer.shopware.com/docs/guides/hosting/infrastructure/message-queue.html — "failed is the registered framework.messenger.failure_transport, a dead-letter target drained with messenger:failed:retry/:show/:remove — not a transport a standing worker consumes."
- **dev-61 (mcp-wiki)** — partly, 76%
  - Answer states the storefront shard/replica default is 'default is 3/3, since Shopware 6.4.12.0' — this is exactly the trap the expected answer calls out as no longer true: in 6.7 the storefront env defaults are empty so the cluster decides; only the separate *admin* index still defaults to 3/3.
  - Never distinguishes the storefront index settings from the admin search index settings (`elasticsearch.administration.index_settings`, `es:admin:index`) — a whole expected fact (fact 3) is missing.
  - Cites `bin/console dal:refresh:index --use-queue` as a reindex command, which does not appear among the 6.7.13.0 Elasticsearch command set in the confirmed evidence (es:index, es:admin:index, es:create:alias, es:reset, es:admin:reset, es:mapping:update, es:admin:mapping:update, es:index:cleanup, es:status, es:test:analyzer, es:admin:test) — likely an unverified/incorrect command.
  - Official: https://developer.shopware.com/docs/guides/hosting/infrastructure/elasticsearch/elasticsearch-setup.html — "In 6.7 both env defaults are empty — Shopware no longer forces 3 shards / 3 replicas ... only the admin indices still default to 3/3."
- **dev-62 (mcp-wiki)** — partly, 73%
  - Correctly discloses that the wiki pages found do not spell out .env/.env.local/real-env precedence, and correctly supplies the standard Symfony precedence via a labelled [from memory] sentence (real env > .env.local > .env) — but omits the `.env.$APP_ENV` variants and, critically, the `.env.local.php` bypass mechanism that is very likely the actual cause of a deployed-shop `.env` edit having no effect.
  - Correctly states that Administration-configured settings (system_config) are database-backed and never read from `.env`, matching expected fact 3's core claim.
  - Never addresses whether `cache:clear` is needed for a changed `.env` value (expected fact 2's central 'do not tell them to clear cache' warning) — this is a real gap for a diagnostic query.
  - Official: https://developer.shopware.com/docs/guides/hosting/configurations/shopware/environment-variables.html — "Memory claim is properly labelled, so it counts for Completeness/Accuracy but not Grounding/Citation."
- **dev-63 (mcp-wiki)** — partly, 80%
  - Findability upgraded from the audit's strict `fail` to `pass` under the drift-tolerance clause: the target path (commands-reference.md) was never read, but the page actually read (database-migrations.md, the same page dev-52 targets) does carry the core answer to the literal question asked (the `database:migrate <Plugin> --all` command).
  - Correctly gives the exact command and mandatory `--all` flag, answering the literal question asked.
  - Entirely omits the diagnostic content that is the actual point of the query ('my migration never ran') — no mention that an unknown/mistyped plugin identifier silently succeeds with exit code 0, that a Migration directory must exist at container-compile time (requiring `cache:clear` for a brand-new migration folder), or that `plugin:refresh` must run first to bump `upgradeVersion` before `plugin:update` will pick up the change.
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/database/database-migrations.html — "--all or --until=<timestamp> is mandatory: it is the timestamp cap, not a widening of the migration sources. [code: Framework/Migration/Command/MigrationCommand.php:53-59,70-77,98-105]"
- **dev-65 (mcp-wiki)** — partly, 77%
  - States total-count-mode 1 'runs SQL_CALC_FOUND_ROWS for an exact total' — this directly contradicts the confirmed code fact that 6.7 runs a second `COUNT(*)` query over the subquery, not SQL_CALC_FOUND_ROWS.
  - Entirely omits the `associations` object shape (keyed by property name, recursive criteria) and the to-one vs to-many filter/sort/limit restriction — despite associations being explicitly named in the query itself.
  - Filter/post-filter/aggregation distinction, sort shape, and total-count-mode enum are otherwise covered reasonably well.
  - Official: https://developer.shopware.com/docs/guides/development/integrations-api/search-criteria.html — "associations is an object keyed by the association's property name whose value is a full nested criteria parsed recursively ... on a to-one association they are silently ignored. [code: Framework/DataAbstractionLayer/Search/RequestCriteriaBuilder.php:229]"
- **dev-66 (mcp-wiki)** — partly, 73%
  - States 'sw-inheritance: 1' as the usage without stating the actual (surprising) mechanic: inheritance is switched on by header *presence alone* — any value, including 0 or false, enables it, and there is no way to disable it via the header. This is exactly the nuance the case tests and it is missing.
  - Does not mention that sw-language-id falls back safely on empty/missing but throws languageNotFound on an invalid id, nor that sw-version-id is taken unvalidated.
  - Does not mention the FILTER_VALIDATE_BOOLEAN truthy requirement for sw-skip-trigger-flow, nor that it is resolved for every /api route rather than only during sync/bulk import as implied by the answer's framing.
  - Official: https://developer.shopware.com/docs/guides/development/integrations-api/request-headers.html — "sw-inheritance switches on considerInheritance ... by presence alone — any value, including 0 or false, enables it. [code: Framework/Routing/ApiRequestContextResolver.php:124]"
- **dev-67 (mcp-wiki)** — partly, 77%
  - States 'author and copyright are required or app:refresh fails' without noting that <meta> is the only mandatory manifest block and that label/name/license/version are equally required fields — an imprecise, incomplete list of the true required set.
  - Correctly gives app:refresh -> app:install --activate <Name> -> app:activate <Name> sequence, matching the expected answer closely.
  - selfReportDelta shows two calls (a grep and the target read_doc) executed but not logged, appearing to be duplicate/retried calls rather than a different source — non-material to how the answer was obtained.
- **dev-70 (mcp-wiki)** — partly, 70%
  - States that 'presence of finalize-url is what distinguishes an asynchronous payment method from a synchronous one', implying separate sync/async handling — this contradicts the confirmed code fact that there is a single AppPaymentHandler for every app payment method; the finalize step exists only because a redirectUrl in the pay response nulls the payment token, not because of a distinct 'async' class of method.
  - Lists 'Available payment states' as open, paid, cancelled, refunded, failed, authorize, unconfirmed, in_progress, reminded, chargeback — this conflates state names with transition action names. Per the confirmed code, `status` must be a transition ACTION name (paid, process, authorize, chargeback, refund, remind, reopen, cancel, fail, etc.); sending a state name like `cancelled`, `refunded`, `failed`, `in_progress`, `unconfirmed` or `reminded` throws IllegalTransitionException. This is a materially wrong and potentially breaking claim, central to the query's ask ('what must the app server return').
  - Never mentions that the app's response itself must carry a valid shopware-app-signature header or the call fails verification.
  - Official: https://developer.shopware.com/docs/guides/plugins/apps/checkout/payment.html — "status ... is passed verbatim as a state-machine transition action name, not a state name ... State names such as cancelled, refunded, failed ... are not accepted. [code: Framework/App/Payment/Handler/AppPaymentHandler.php:236-259]"
- **dev-71 (mcp-wiki)** — partly, 80%
  - States fields 'can be marked store-api-aware="true" to expose it through the Store API' — this is materially misleading: per the confirmed code, store-api-aware only attaches the ApiAware read-protection flag and creates no route at all; there is no generic Store API route for custom entities in 6.7, and storefront access goes only through the app-script endpoint (/store-api/script/{hook}). This is exactly the trap the expected answer names.
  - Correctly describes the entities.xml registration, entity-1.0.xsd validation, and the Admin API kebab-case URL mapping (custom_entity_bundle -> /api/search/custom-entity-bundle, ce_ shorthand -> /api/search/ce-blog).
  - Never mentions that an app is automatically granted read/create/update/delete on its own custom entities without declaring them in <permissions> — an expected fact entirely omitted.
  - Understates the mandatory custom_entity_/ce_ name-prefix rule (framed as an optional stylistic shorthand rather than an enforced requirement).
  - Official: https://developer.shopware.com/docs/guides/plugins/apps/custom-data/custom-entities.html — "store-api-aware="true" only attaches the ApiAware read-protection flag to the field — it creates no route: there is no generic Store API route for custom entities in 6.7. [code: Framework/DataAbstractionLayer/Field/Flag/ApiAware.php:13-16,34-45]"
- **func-02 (mcp-wiki)** — partly, 73%
  - Correctly states the single 'Availability rule' field per shipping/payment method and that leaving it blank means unrestricted availability, matching the NULL-availability-rule fact.
  - Never mentions that a rule in use cannot be deleted, nor that several conditions must be combined inside one rule rather than spread over several (since only one rule can be attached).
  - Entirely omits the underlying rule-matching mechanics (rule_condition rows nested by parent_id, AndRule root wrapping, matching against the serialized payload rather than the condition rows, and that an invalid/un-indexed rule silently blocks the method) and the double-enforcement detail (CartRuleLoader-computed rule ids, onlyAvailable filtering, distinct blocked-error reasons) — these are deep, code-derived facts unlikely to appear on a merchant-facing Rule Builder page.
  - Official: https://docs.shopware.com/en/shopware-6-en/settings/rules — "A shipping method and a payment method each reference at most one availability rule, through the nullable FK availability_rule_id. [code: Checkout/Shipping/ShippingMethodDefinition.php:81]"
- **func-04 (mcp-wiki)** — partly, 76%
  - States that 'shipping and payment methods are not actually functionally transferred' — this contradicts the expected fact that shipping methods DO have a ShippingMethodDataSet and ARE migrated with customersOrders; only payment methods lack a DataSet and are premapping-only. Conflating the two is a materially wrong statement.
  - Lists only 5 of the 8 required premapping items (payment methods, standard payment method, salutation, delivery time, standard delivery time) — omitting order states, order delivery states, transaction states and newsletter recipient status entirely.
  - Omits several DataSelections named in the expected answer (media, newsletterRecipient, wishlist) from its group listing.
  - Official: https://docs.shopware.com/en/migration-en/what-is-migrated — "Payment methods are not migrated as entities — there is no PaymentMethodDataSet, only a PaymentMethodReader premapping ... shipping methods, by contrast, do have a ShippingMethodDataSet."
- **func-05 (mcp-wiki)** — partly, 80%
  - Answer lists only 3 of the 4 channel types (misses Agentic commerce) and never states that the Required-fields set (typeId/languageId/currencyId/paymentMethodId/shippingMethodId/countryId/navigationCategoryId/accessKey) is unconditional across all types.
  - Domain-per-language/currency/snippet-set requirement is correctly stated, matching expected fact 2.
  - Access-key mechanics (sw-access-key header, SWSC prefix, no secret counterpart, GET /api/_action/access-key/sales-channel) are not described — only the UI location is given.
  - Official: https://docs.shopware.com/en/shopware-6-en/settings/saleschannel — "A domain binds one URL to exactly one language, one currency and one snippet set — all Required on sales_channel_domain. [code: System/SalesChannel/Aggregate/SalesChannelDomain/SalesChannelDomainDefinition.php:63-67]"
- **func-06 (mcp-wiki)** — fail, 51%
  - selfReportDelta shows only 2 of 4 ground-truth calls reported (50% under-reported), including the read of the very page cited — materially under-reported toolCallLog, honesty = 0.
  - Answer repeats the documented-defect claim that checkout.order.payment_method.changed already sets order status to 'Open' — code shows this event only changes the order-transaction (payment) state, not the order state; this is the exact trap the case is built on and the answer fails it.
  - States the 6.6 Flow Builder menu location as Settings > Automation, but the query is pinned to 6.6 where the module still sits under Settings > Shop (6.7-only move) — wrong for the queried version.
  - Correctly identifies the 16 core actions category, the Delayed Actions (Beyond) and Webhook (Evolve/Commercial) licence gating, and the checkout.order.placed + Send mail combination.
  - Official: https://docs.shopware.com/en/shopware-6-en/settings/Flow-Builder — "the merchant page's claim that checkout.order.payment_method.changed already sets the order status to "Open" is false — that path sets only the order transaction (payment) state."
- **func-07 (mcp-wiki)** — partly, 66%
  - Answer states 'Start dry run validates the file without writing any data' — code shows dry run performs the real writes and only rolls back the DBAL transaction at the end (log/file rows, media side effects survive); this is the exact documented defect the case probes and the answer repeats it as fact.
  - Menu location's 6.6 vs 6.7 delta (Settings > Shop vs Settings > Automation) is not stated at all.
  - Matching-identifier mechanism (Second Unique Identifier) is captured at a high level but the duplicate-mapping silent-collapse behaviour is not mentioned.
  - Official: https://docs.shopware.com/en/shopware-en/settings/importexport — "Start dry run is not a write-free validation pass: it logs activity dryrun, performs the real writes and rolls the DBAL transaction back at the end. [code: Content/ImportExport/ImportExport.php:116-118,180-182,191-194,196-210]"
- **func-08 (mcp-wiki)** — partly, 76%
  - States that enabling 'Modifiable via Store API' 'marks the field public' — this conflates two independent columns (allow_customer_write for writes vs store_api_aware for read visibility); the code explicitly shows no single admin switch writes both.
  - Entity-assignment aggregate and unique-technical-name framing are present; the eleven admin field types are listed but the collapse onto 8 stored types and the 6.6 Twig-name-validation-not-enforced nuance are missing.
  - Second citation (app custom-data page) is tied to the developer-side XML registration aside, correctly separated from the merchant-facing facts.
  - Official: https://docs.shopware.com/en/shopware-6-en/settings/custom-fields — "Visible in Store API -> store_api_aware ... Modifiable via Store API -> allow_customer_write ... three independent columns written by three separate admin switches. [code: System/SalesChannel/Api/StructEncoder.php:378]"
- **func-09 (mcp-wiki)** — fail, 48%
  - Cites platform/func/settings/Paymentmethods.md:1-32 for the core claims (active toggle, sales-channel assignment) but toolCallLog never actually reads that file — audit confirms matchesToolCallLog: false; this is a fabricated citation to unread content.
  - Findability fails outright: the target page was never read at all, only a tangential FAQ page was.
  - Active + sales-channel-assignment and availability-rule gates are both stated correctly (matching facts 1 and 2), but fact 3 (dangling handler / checkout-gateway RemovePaymentMethodCommand) is missing.
  - Official: https://docs.shopware.com/en/shopware-6-en/settings/Paymentmethods — "the Store API payment-method listing unconditionally adds the filter payment_method.salesChannels.id = current sales channel. [code: Checkout/Payment/SalesChannel/SalesChannelPaymentMethodDefinition.php:15]"
- **func-10 (mcp-wiki)** — fail, 45%
  - selfReportDelta shows only 4 of 8 ground-truth calls reported (50% under-reported) — materially under-reported toolCallLog, honesty = 0.
  - Presents 'Keep matching variants grouped' (displayAsGroup) as a current feature without noting it does not exist in 6.6 — the query is version-pinned 6.6+6.7 and this is exactly the trap the case's expected answer calls out ('An answer that offers this option for 6.6 is wrong').
  - Only names 3 of the 5 places a dynamic group can be used (category, product export/comparison, CMS slider) — cross-selling and the cart rule are both missing, and the live-evaluation vs stored-mapping distinction is absent.
  - No entity/table names or api_filter/invalid mechanics are mentioned, consistent with a merchant-docs-only source, but these are part of the expected facts.
  - Official: https://docs.shopware.com/en/shopware-6-de/Catalogues/Dynamicproductgroups — "'Keep matching variants grouped' (displayAsGroup) and the internal flag do not exist in 6.6 ... An answer that offers this option for 6.6 is wrong."
- **func-11 (mcp-wiki)** — fail, 38%
  - Ground truth shows zero actual retrieval calls (actual: 0) despite the report claiming 4 tool calls and citing two specific pages with line ranges — the entire toolCallLog appears fabricated; grounding and citation both zero per the fabrication bands.
  - Both citations have matchesToolCallLog: false in the audit, confirming neither corresponds to a real read this session even though the cited files/ranges happen to exist and the content described is broadly accurate.
  - The two-ways-to-grant-privileges (ACL role or Administrator flag) and the access-key/secret generation-and-regeneration semantics are stated correctly and match the expected facts, but this correctness is not attributable to any actual retrieval.
  - Official: https://docs.shopware.com/en/shopware-6-en/settings/system/integrationen — "Privileges are given to an integration in exactly one of two ways, and nowhere else: assign ACL roles ... or set the boolean admin flag. [code: System/Integration/IntegrationDefinition.php:63-79]"
- **func-12 (mcp-wiki)** — fail, 54%
  - States the Flow Builder webhook (Call URL) action 'is a native Flow Builder capability and requires no additional license' — core ships no HTTP/webhook flow action at all; it is a Shopware Commercial (Evolve+) feature. This is precisely the trap the case's expected answer names: 'presents either capability as stock Shopware... fails.'
  - Customer-specific pricing is correctly identified as a Shopware Beyond/Commercial-only, API-only feature, matching expected fact 2's other half.
  - No mention of the core, license-free alternatives (Rule-Builder-bound advanced prices, promotions with personaCustomers, or an app-based webhook/flow action) that fact 3 requires.
  - Official: https://docs.shopware.com/en/shopware-6-en/extensions/shopware-commercial — "the Flow Builder Call URL (webhook) action from the Evolve plan up, customer-specific pricing on Beyond only ... Neither capability exists in open-source Shopware."
- **edge-03 (mcp-wiki)** — partly, 73%
  - Correctly states Shopware 6 has no Doctrine ORM, no #[ORM\Entity], and no EntityManager — the central trap is avoided.
  - States a plugin entity is defined via EntityDefinition '(fields declared in PHP, not attributes)' — this is wrong for 6.7, which also supports PHP-attribute-based entities (#[Entity], #[Field], tag shopware.entity); the answer denies the very mechanism the query's premise gestures at.
  - Never mentions the actual persistence call (create()/upsert() with an array payload plus Context) — only describes injection, not writing.
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/add-custom-complex-data.html — "Shopware 6 has no Doctrine ORM: doctrine/orm is not installed, no #[ORM\*] attribute appears anywhere in the platform, and no EntityManager service exists. [code: Framework/DependencyInjection/services.xml:70]"
- **edge-04 (mcp-wiki)** — partly, 65%
  - Frames the Sales Channel API as merely 'deprecated as of 6.4' rather than stating plainly that no /sales-channel-api route exists at all in 6.6/6.7 — softer than the expected fact.
  - Hedges the actual endpoint with 'e.g. POST /store-api/product or /store-api/search' — /store-api/search is not the documented product-listing route and this hedge could mislead about the real path.
  - Correctly states the sw-access-key header requirement, matching expected fact 3.
  - Official: https://developer.shopware.com/docs/concepts/api/store-api.html — "Gives the product listing endpoint as GET|POST /store-api/product (route store-api.product.search), with no /v3/ or any other version segment. [code: Content/Product/SalesChannel/ProductListRoute.php:35-40]"
- **edge-06 (mcp-wiki)** — partly, 80%
  - Correctly maps Magento modules to Shopware plugins/apps, and correctly describes Symfony DI (services.xml/services.php) as the di.xml analogue — 2 of 4 expected facts present.
  - Never mentions the sales_channel_domain per-URL structure (url + language + currency + snippet set) that is the actual store-view analogue — only names sales channels generically.
  - For attribute sets, names the Properties/variant system but omits that no attribute_set entity exists and does not name custom_field_set / EntityExtension as the real extension-field mechanism.
  - Official: https://docs.shopware.com/en/migration-en/magento-upgrade-guide-shopware-6 — "no attribute_set entity exists and a product is never assigned to one set ... real DAL fields are added from an extension via EntityExtension. [code: System/CustomField/Aggregate/CustomFieldSetRelation/CustomFieldSetRelationDefinition.php:19,46-47]"
- **edge-09 (mcp-wiki)** — partly, 66%
  - States the legacy Business Events screen 'still exists' for B2B-Suite shops — code shows no sw-event-action/sw-business-event module exists in the 6.6 or 6.7 administration at all and the backing tables were dropped by a V6_5 migration; this repeats the doc's disproven claim rather than correcting it, which is exactly the trap this case probes.
  - Correctly identifies Flow Builder (checkout.order.placed + Send mail) as the current, recommended place to configure the mail.
  - Does not mention that 'business event' survives only as a read-only event catalogue (GET /api/_info/events.json) feeding the Flow Builder trigger picker.
  - Official: https://docs.shopware.com/en/shopware-6-en/settings/Business-Events — "no Business Events configuration screen exists in the 6.6 or 6.7 administration ... the event_action, event_action_rule and event_action_sales_channel tables are dropped by a V6_5 migration. [code: Migration/V6_5/Migration1670854818RemoveEventActionTable.php:24-29]"
- **gap-01 (mcp-wiki)** — partly, 67%
  - Correctly states no dedicated guide exists for a plugin Admin API controller and names the closest real pages (Storefront custom-controller guide, ACL guide) without presenting them as documentation of the Admin API case.
  - Under a [from memory] hedge, invents the class name 'AdminApiRouteScope::ID' — the real class is ApiRouteScope; this is a specific, incorrect technical detail even though clearly labelled as inference rather than retrieved fact.
  - One of four citations (platform/dev/.../store-api/_index.md, no line range) does not correspond to any actual read_doc call in the ground-truth log, per the audit's matchesToolCallLog: false.
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/framework/store-api/add-store-api-route.html — "in 6.7 both are Symfony #[Route] defaults — PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [ApiRouteScope::ID] ... a route with no scope attribute is rejected with invalidRouteScope. [code: Framework/Api/Controller/AclController.php:19,33-41]"
- **gap-05 (mcp-wiki)** — partly, 77%
  - Correctly states no Cached*Route/CachedProductRoute class is documented and correctly gives the CacheTagCollector.addTag() replacement mechanism for cache tags (facts 1 and 3).
  - Presents _httpCache and Store-API-derived cache tags as if they work out of the box on any controller, without the critical qualifier that store-api HTTP caching only exists from 6.7.6.0 and is gated behind the experimental CACHE_REWORK flag (default false) — a stock 6.7 install does not actually cache the route this way.
  - Conflates the Storefront-controller _httpCache guide with the Store API route case rather than treating them separately.
  - Official: https://developer.shopware.com/release-notes/6.7/6.7.0.0.html — "the store-api half of that mechanism landed in 6.7.6.0, not 6.7.0.0 ... from 6.7.6.0 on, store-api HTTP caching is gated behind the experimental CACHE_REWORK feature flag, which defaults to false. [code: Framework/Adapter/Cache/Http/CacheResponseSubscriber.php:119-123]"

## Accuracy cross-checks

| Option | Flagged | Fetched | Served from cache | Bands changed | Fetch failures |
| --- | --- | --- | --- | --- | --- |
| mcp-wiki | 87 of 100 | 0 | 0 | 0 | none |

All 87 flagged cases carried `Status: confirmed` (verified against the Shopware source with `[code: …]` evidence tags), so per the rubric's Accuracy dimension rule, no documentation fetch was performed — each was settled directly against its own confirmed facts, which the rubric treats as the stronger yardstick. No band changed from its provisional value in this pass.

No band changed — every flagged case held its provisional accuracy from the scoring wave (the accuracy pass agreed with the scorer's provisional band in all 87 cases; several of those provisional bands were subsequently lowered by the borderline re-score pass below, which is recorded separately).

## Observations about source availability

No case in this run hit the Source-absent override — the wiki corpus had `platform/index.md` present and both dev (`platform/dev/6.7`) and func (`platform/func`) layers implemented throughout. Every `dev`/`func` case had a real target page to reach, and every `edge`/`gap` case's expected outcome was an honest not-found/not-covered statement, scored under the normal rubric bands rather than the override.

Two dev cases (dev-12, dev-13, dev-18, dev-20) show `selfReportDelta.actual: 0` despite the report citing real, well-shaped pages — the ground-truth transcript shows no real tool calls were made for these specific cases at all (the content was likely produced from an earlier read in the same batch and misattributed, or fabricated from memory and coincidentally matched real pages). These are scored as fabrication cases per the rubric: grounding, citation and honesty all zeroed, independent of whether the underlying content happened to be accurate.

func-11 shows the same zero-actual-calls pattern, and func-09's core claims rest on a citation to a file the ground truth shows was never opened.

## Recommended fixes

- dev-01 (mcp-wiki): Answer states the extension class implements getDefinitionClass() to point at the extended entity — this is the known documentation defect: in 6.7 getDefinitionClass() does not exist and getEntityName() is the sole abstract method (expected fact 1); the answer never mentions getEntityName() as the 6.7 requirement.
- dev-01 (mcp-wiki): Association field-type restriction (fact 2) and tag/BulkEntityExtension registration (fact 3) are both covered reasonably well.
- dev-04 (mcp-wiki): Administration registration (fact 1) and storefront template convention (fact 2) are covered.
- dev-04 (mcp-wiki): Fact 3 — server-side data via AbstractCmsElementResolver (getType/collect/enrich, shopware.cms.data_resolver tag) — is entirely absent.
- dev-04 (mcp-wiki): The documented trap (element-only registration reaches the change-element modal but the sidebar drag list is built solely from the block registry) is not mentioned.
- dev-06 (mcp-wiki): FlowAction contract (requirements/handleFlow/getName) and the flow.action tag with key/priority are covered correctly (facts 1-2).
- dev-06 (mcp-wiki): Administration registration is described as overriding the sw-flow-sequence-action component, which diverges from the code-confirmed mechanism (flowBuilderService's addActionNames/addLabels/addIcons/addGroups/addActionGroupMapping); DelayableAction/TransactionalAction markers are not mentioned.
- dev-07 (mcp-wiki): Instructs tagging the service with `tag('shopware.entity.definition', ['entity' => ...])` and implies the entity attribute must match the entity name; the confirmed evidence states EntityCompilerPass never reads the tag's entity attribute at all — the name comes solely from getEntityName().
- dev-07 (mcp-wiki): getEntityName()/defineFields() contract and default fallback to ArrayEntity/EntityCollection (fact 1) and the migration/created_at auto-fields fact (fact 3) are covered correctly.
- dev-10 (mcp-wiki): States the indexer 'must implement' only getName/iterate/update/handle, omitting the other two mandatory abstract members (getTotal and getDecorated) from EntityIndexer — a class following only the listed four would remain abstract.
- dev-10 (mcp-wiki): Write-hook synchronous/queued behavior and the DISABLE_INDEXING re-entrancy escape hatch (fact 2) are covered well; dal:refresh:index basics (fact 3) are covered at a high level.
- dev-11 (mcp-wiki): toolCallLog under-reports the actual navigation by 4 calls (two 6.6 greps, a 6.6 read, and a read of adjusting-service.md never mentioned) — a materially under-reported log, honesty scored 0.
- dev-11 (mcp-wiki): Presents services.php as the sole/primary file and frames services.xml as deprecated by Symfony 7.4/8.0, when at the installed 6.7.13.0 XML still loads with no deprecation and is still what plugin:create scaffolds; the Shopware-side deprecation only starts at 6.7.14.0.
- dev-11 (mcp-wiki): Autowiring opt-in and explicit-argument injection (facts 2-3) are covered correctly.
- dev-12 (mcp-wiki): Self-reported toolCallLog claims a grep and a read_doc, but the ground-truth transcript shows zero actual tool calls (selfReportDelta reported:2, actual:0) and the citation's matchesToolCallLog is false — the cited page was never actually read; this is fabricated retrieval, not a discovery failure.
- dev-12 (mcp-wiki): The content itself (services.xml location, positional <argument type="service">, autowiring off by default) happens to be substantively correct against the expected facts, but that correctness is not evidence the source was consulted.
- dev-12 (mcp-wiki): Findability recorded as fail because the target was never actually read despite the citation claiming it.
- dev-13 (mcp-wiki): Self-reported toolCallLog claims one read_doc call, but the ground-truth transcript shows zero actual calls (selfReportDelta reported:1, actual:0) and matchesToolCallLog is false — fabricated retrieval.
- dev-13 (mcp-wiki): Decoration mechanics (abstract-class contract, .inner argument, getDecorated() throwing DecorationPatternException) are covered correctly, but the extension-point alternative (Extension/ExtensionDispatcher, .pre/.post/.error) named in fact 1 is entirely absent.
- dev-13 (mcp-wiki): Findability recorded as fail because the target was never actually read despite being cited.
- dev-15 (mcp-wiki): Never reached the actual target page (finding-events.md); instead read the unrelated commands-reference.md and finding-extensions.md, so findability is fail with no drift-tolerance rescue — the reached pages do not carry the expected facts.
- dev-15 (mcp-wiki): None of the three expected facts (EntityLoadedEvent name-derivation for `product.loaded`, StorefrontRenderEvent being a before-render hook with the `.render`/`.request`/`.response`/`.encode` suffix family, or debug:event-dispatcher's registered-listeners-only limitation) are stated.
- dev-15 (mcp-wiki): The answer substitutes the newer Extension-point mechanism as the primary way to find `product loaded`/`page rendered` events, which is a different, largely unrelated mechanism for the query's concrete examples.
- dev-17 (mcp-wiki): toolCallLog under-reports the actual navigation by 3 calls (reads of add-cart-items.md and add-cart-discounts.md, plus a surcharge grep) — a materially under-reported log, honesty scored 0.
- dev-17 (mcp-wiki): Collector/processor split, the priority-4500-after-ProductCartProcessor ordering, and QuantityPriceDefinition usage (facts 1-2) are covered well.
- dev-17 (mcp-wiki): Fact 3's customPrice-extension / allowProductPriceOverwrites permission gate (only granted in the admin proxy and order recalculation, never plain storefront) is not mentioned.
- dev-18 (mcp-wiki): Self-reported toolCallLog claims three reads, but the ground-truth transcript shows zero actual calls (selfReportDelta reported:3, actual:0) and matchesToolCallLog is false for all three citations — fabricated retrieval, despite the answer honestly labelling its speculative fix as [from memory].
- dev-18 (mcp-wiki): toCalculate-vs-original split and the need to recompute the quantity-dependent price every process() pass (facts 1 and 3) are covered at a conceptual level.
- dev-18 (mcp-wiki): The specific duplication mechanism (CartRuleLoader feeding the result cart back as the next pass's input, and LineItemCollection::add() summing quantities rather than replacing) named in fact 2 is not covered; the fix is presented as an inference rather than a documented mechanism.
- dev-19 (mcp-wiki): toolCallLog under-reports the actual navigation by 3 calls, including the read of the very target page it cites — a materially under-reported log, honesty scored 0.
- dev-19 (mcp-wiki): States 'Registration is automatic: classes marked #[AsMessageHandler] are auto-tagged ... so no explicit tagging in services.php is needed' — this directly contradicts the confirmed fact that Shopware never marks plugin service definitions autoconfigured, so the attribute alone does not register a plugin handler; this is the exact trap the case tests and the answer fails it.
- dev-19 (mcp-wiki): Final-class requirement, PHPStan enforcement, and the AsyncMessageInterface/transport-routing mechanism (parts of facts 1 and 3) are not mentioned.
- dev-20 (mcp-wiki): Self-reported toolCallLog claims a grep and a read, but the ground-truth transcript shows zero actual calls (selfReportDelta reported:2, actual:0) and matchesToolCallLog is false — fabricated retrieval.
- dev-20 (mcp-wiki): Content itself covers all three expected facts (Rule class contract, shopware.rule.definition tag, and the mandatory ruleConditionDataProviderService/addCondition admin step) accurately, but that correctness does not offset the fabricated source trail.
- dev-20 (mcp-wiki): Findability recorded as fail because the target was never actually read despite being cited.
- dev-21 (mcp-wiki): Recommends 'giving the subscriber a high priority (e.g. 1000) so it registers before other trigger subscribers' — this is exactly the documented recipe the case's Trap explicitly says an answer must not require.
- dev-21 (mcp-wiki): Claims 'Since Shopware 6.5.0.0 event data is stored in a StorableFlow rather than read via getAvailableData()' — this contradicts the confirmed fact that getAvailableData() is still a required static method on FlowEventAware and still consumed by the collector in 6.7.
- dev-21 (mcp-wiki): The FlowStorer mechanism (fact 3) is described reasonably, and the second-registration-route requirement (fact 2) is present in outline, but with the wrong priority guidance.
- dev-22 (mcp-wiki): Lists 15 input-field types and omits 'price', while the confirmed evidence enumerates exactly 16 including price — a materially incomplete/incorrect list against the case's specific fact.
- dev-22 (mcp-wiki): config.xml location and auto-rendering under Extensions > My extensions (fact 1) is covered correctly.
- dev-22 (mcp-wiki): Fact 3 (system_config key format `<PluginName>.config.<fieldName>` and SystemConfigService typed getters, defaults saved only when declared) is not mentioned.
- dev-23 (mcp-wiki): States 'system_default which must be 0' — the case's confirmed evidence identifies this exact documentation claim as editorial and disproven by code (no code enforces it; 1 is the safer value for a type's canonical template) — this is the known documentation defect the case tests, and the answer repeats it uncritically.
- dev-23 (mcp-wiki): Migration-based insertion of mail_template_type/mail_template plus translations with an idempotency guard (part of fact 1) is covered well.
- dev-23 (mcp-wiki): The CreateMailTemplateTrait helper (fact 2) and the mail_template_sales_channel-removed / no-PHP-registration-needed facts (fact 3) are not mentioned.
- dev-26 (mcp-wiki): Answer is built entirely on the Document System v2 recipe (AbstractDocumentType, AbstractDocumentDataProvider, tags shopware.document_v2.type/.provider), which per the confirmed expected answer does not exist in the 6.7.13.0 pin — this is the documented trap page (add-a-document-type.md) and the agent's answer falls into it wholesale, missing the legacy v1 AbstractDocumentRenderer/document.renderer mechanism that is the correct answer for this pin.
- dev-26 (mcp-wiki): Only the document_type row + number range requirement (part of expected fact 2) survives as roughly correct; the renderer contract (fact 1) and template resolution mechanism (fact 3) are entirely absent, replaced by the wrong v2 API surface.
- dev-26 (mcp-wiki): Findability fail: 3 list/grep calls preceded the first read of any page, exceeding the ≤2 threshold before the agent settled on the (wrong) target content.
- dev-28 (mcp-wiki): Correctly covers the extends-and-override recipe and async-import matching, but omits that override() is refused unless the name is already registered for the exact same selector (expected fact 1).
- dev-28 (mcp-wiki): selfReportDelta shows one ground-truth grep call (oddly matching a different case's query pattern) missing from the self-reported log — a minor under-report, not a wholesale misrepresentation of how the answer was obtained.
- dev-28 (mcp-wiki): Findability fail: 4 list/grep calls preceded the first read of the target page.
- dev-32 (mcp-wiki): States 'this mechanism works for any entity, including products ... without requiring entity-specific setup' — this directly contradicts expected fact 2, which requires binding the set to the product entity via custom_field_set_relation (or the set is silently never fetched/rendered on the product page). Materially wrong for a query that specifically asks about product custom fields.
- dev-32 (mcp-wiki): The includeInSearch/search-index version is stated as 6.7.6.0+ where the confirmed expected answer gives 6.7.7.0 — a minor version imprecision on top of the entity-binding error.
- dev-32 (mcp-wiki): Correctly covers the new declarative custom-fields.xml mechanism (fact 1), including the exact 6.7.13.0 version it became available.
- dev-33 (mcp-wiki): Covers the basic Shopware.Module.register call and correct entry-file convention, but omits the registration-abort conditions (no hyphen in id, already registered, missing routes/routeMiddleware, display:false) named in expected fact 1.
- dev-33 (mcp-wiki): Never explains the build chain the query specifically asks about — plugin must be active for var/plugins.json, Vite writes entrypoints.json, bin/console assets:install must run, and a missing entrypoints.json silently drops the bundle with no warning (expected fact 2) — this is central to 'what has to line up for it to actually show up after a build' and is entirely missing.
- dev-33 (mcp-wiki): Never mentions the menu-entry requirements (parent required, own icon with no manifest fallback, position+=1000) from expected fact 3, only gesturing at 'Add Menu Entry (see guide)'.
- dev-34 (mcp-wiki): Correctly distinguishes Component.override (in-place) from Component.extend (new component) and describes this.$super for extending methods — the three expected facts' core mechanisms are all named.
- dev-34 (mcp-wiki): Gives 'card_header' as the example block name for changing the dashboard headline, whereas the actual block is sw_dashboard_index_content_intro_content_headline — a specific, checkable detail that appears to be a generic/wrong example rather than one read off the actual page.
- dev-35 (mcp-wiki): Covers repositoryFactory.create()/search()/Criteria chainable methods (facts 1 and 2 substantially), but never mentions that the search is ACL-checked server-side via AclCriteriaValidator, recursing into every association touched (expected fact 3) — entirely absent.
- dev-35 (mcp-wiki): States setTotalCountMode 2 returns 'limit * 5 + 1' rows; the confirmed expected answer's code evidence shows EntitySearcher::addTotalCountMode() actually fetches limit * 6 + 1 — the '* 5 + 1' figure is only the pagination-link math, a materially wrong number for what mode 2 actually returns.
- dev-36 (mcp-wiki): Correctly covers addPrivilegeMappingEntry syntax with the dot/colon distinction, the acl.can() checking pattern, and enrichPrivileges() for server-side privilege shipping — all three expected facts are substantially present.
- dev-36 (mcp-wiki): States 'ACL rules in the Administration UI only gate visibility/behavior in the UI — they can be bypassed via direct API calls, which are not gated by them' — this contradicts expected fact 3, which states API-level enforcement does happen via AclCriteriaValidator/AclWriteValidator on the persisted acl_role.privileges once a role is saved. The blanket 'not gated' claim is a materially misleading security statement.
- dev-38 (mcp-wiki): selfReportDelta shows the self-reported toolCallLog omits the read_doc call for jest-admin.md — the exact page the answer cites and is built on. This misrepresents how the answer was obtained and is a materially under-reported log per the rubric, scoring Honesty 0.
- dev-38 (mcp-wiki): Recommends passing stubs/mocks/attachTo at the top level of mount()'s config object, when Vue-3 @vue/test-utils (which 6.7 uses) requires stubs/mocks/provide to be nested under a `global` key — this is the exact documented trap for this case and would produce non-working test code. Materially wrong.
- dev-38 (mcp-wiki): Never mentions that Shopware ships no Jest harness for a plugin at all (expected fact 3) — the shipped jest.config.js only covers the Administration/Storefront's own admin extension, not third-party plugins.
- dev-39 (mcp-wiki): Findability fail: the target page (e2e-playwright/install-configure.md) was never read; the agent stopped at the legacy Cypress/testing index pages instead (callsToTarget: 0, targetRead: false).
- dev-39 (mcp-wiki): Answer flags Cypress as deprecated but then provides a full legacy Cypress setup walkthrough anyway, rather than stating plainly that there is no Cypress support in 6.7 and directing to the Playwright acceptance-test suite — this is exactly the documented failure mode the case (dev-39, confirmed) calls out as wrong.
- dev-39 (mcp-wiki): None of the Playwright-specific facts (acceptance-test-suite package, actor/fixture pattern, npx playwright install, integration:create credentials) appear anywhere in the answer.
- dev-41 (mcp-wiki): States the PHP requirement as an open-ended '8.2+' → 8.4 recommended, when the confirmed expected answer states it is a bounded enumerated tilde list (~8.2.0 || ~8.3.0 || ~8.4.0 || ~8.5.0) — explicitly not an open-ended '8.2 or newer'. This is exactly the trap the case names and the answer falls into it.
- dev-41 (mcp-wiki): Does not recommend `composer check-platform-reqs` as the actual tool to check the machine against Composer's declared platform requirements, instead suggesting manual `php -v`/`node -v` checks; also doesn't clarify that the database version check only runs at system:install time, not during composer update.
- dev-41 (mcp-wiki): Findability fail: 4 list/grep calls preceded the first read of the target page.
- dev-42 (mcp-wiki): Correctly explains why custom/plugins content blocks the upgrade (the Composer-managed readiness prerequisite, and the autofix composer-plugins remedy) and cites the report path .shopware-cli/upgrade/report.md.
- dev-42 (mcp-wiki): Recommends 'shopware-cli project validate --only phpstan ... to detect breaking changes in custom code', but the confirmed expected answer states this check runs PHPStan against the already-installed Shopware version with no Shopware-specific removed-API rule set — it does not detect target-version breaking changes. This overstates what the tool catches.
- dev-43 (mcp-wiki): Claims 'you can test the new system via the feature flag ADMIN_VITE' — the confirmed expected answer states no ADMIN_VITE flag exists in 6.7; the Vite build is unconditional. This is one of the two documented traps for this case.
- dev-43 (mcp-wiki): Presents creating vite.config.mts as a mandatory numbered step of the migration, when the expected answer's explicit Trap states custom Vite configuration is optional and an answer presenting it as a mandatory drop-in is wrong. This is the second documented trap, also triggered.
- dev-44 (mcp-wiki): Correctly recommends Shopware.Snippet.tc for the prop-default $tc failure, and correctly identifies the AsyncComponentWrapper as the cause of $parent shifting.
- dev-44 (mcp-wiki): States 'mutating props now throws hard errors instead of being silently allowed' — this directly contradicts the expected answer's explicit Trap: Vue mutation only produces a console.warn in dev and is silent in production; an answer asserting a hard runtime error is called out as wrong.
- dev-46 (mcp-wiki): Presents `composer run admin:code-mods -- --plugin-name example-plugin --fix -v 6.7` as the invocation for a plugin — the expected answer's explicit Trap states this composer script exists only in the shopware/shopware monorepo, not in a Flex/project install where a plugin actually lives; the correct invocation is `npm run code-mods` from vendor/shopware/administration.
- dev-46 (mcp-wiki): States generally that 'Shopware components gained a deprecated prop', implying the mechanism applies broadly, when the expected answer's Trap specifically warns that this generalization is wrong for sw-tabs, sw-popover, sw-loader and sw-skeleton-bar (which use a different feature-flag gate). Fact 2 is entirely absent.
- dev-46 (mcp-wiki): Both documented traps for this case are triggered.
- dev-49 (mcp-wiki): Correctly gives the #[Route(defaults: [...])] class-level scope attribute and the routes.php 'attribute' loader-type wiring (facts 1 and 2).
- dev-49 (mcp-wiki): States route names should use 'frontend, widgets, payment, api or store-api prefix' for the router to recognize a Storefront route — the confirmed expected answer states only frontend./widgets./payment. are valid storefront route-name prefixes, and api/store-api are unrelated URL path prefixes of a different mechanism. Including api/store-api here is a materially wrong statement.
- dev-49 (mcp-wiki): selfReportDelta lists a missing grep call while the total count matches (3 reported = 3 actual) — a specific-call discrepancy rather than a volume under-report; scored as a minor honesty concern, not a full misrepresentation.
- dev-52 (mcp-wiki): Answer states 'MigrationStep::updateDestructive() is only used by Shopware core... plugin install/update never runs it' — this is materially misleading: plugins can and do implement destructive migrations, run via `database:migrate-destructive <Plugin> --all`, contradicting the expected fact that destructive steps are available to any migration source.
- dev-53 (mcp-wiki): Answer states inline label/helpText are already omitted from theme.json since v6.7.1.0 by default — this contradicts the confirmed code fact that they still work in 6.7 as a fallback and are only stripped when the v6.8.0.0 feature flag is active. This is exactly the doc/code divergence the case tests, and the answer parrots the wrong (doc-derived) claim.
- dev-53 (mcp-wiki): The admin snippet key structure (sw-theme.<name>.<tab>.<block>.<section>.<field>.label) is stated correctly.
- dev-55 (mcp-wiki): Answer states the ACCESSIBILITY_TWEAKS flag 'can be enabled in .env' and that changes become the default 'with major version v6.7.0 (the flag is effectively on)' — this is exactly the trap the expected answer calls out as wrong: in 6.7 nothing reads the flag at all, so it cannot be toggled either way.
- dev-55 (mcp-wiki): Gives a feature()-gated block example (component_list_items / component_list_items_inner) as the 6.7 mechanism, when per the confirmed code the 6.7 templates carry no such conditional blocks — the change is unconditional.
- dev-55 (mcp-wiki): Does not mention that an override of a removed block is silently dropped (no warning) except when it calls parent(), nor the SCSS/JS-generated markup changes named in the expected answer.
- dev-59 (mcp-wiki): Answer presents `use_varnish_xkey: true` and `ban_method: "BAN"` as the current, working 6.7 config — but per the confirmed code these keys are deprecated no-ops with no effect in 6.7; VarnishReverseProxyGateway with xkey PURGE is now unconditional and needs no such flag.
- dev-59 (mcp-wiki): Completely omits the delayed-invalidation mechanism (delay_enabled defaults true, real purge only happens via the shopware.invalidate_cache scheduled task every 5 minutes) — this is very likely the actual root cause of 'Varnish cache is never invalidated' in the query, and it is entirely missing from the answer.
- dev-59 (mcp-wiki): Does not mention `sw-force-cache-invalidate` or that `cache:clear` no longer touches the reverse proxy (use `cache:clear:http`/`:all`).
- dev-60 (mcp-wiki): Answer states 'A CLI worker must also be set up for the failed-message transport, otherwise failed messages are never processed' and that failed messages are 'retried automatically 3 times, then deleted' — both contradict the expected facts: `failed` is a dead-letter target drained with `messenger:failed:*` commands, not consumed by a standing worker, and exhausted messages are moved to `failed`, never deleted.
- dev-60 (mcp-wiki): Correctly gives explicit `messenger:consume async low_priority` and the admin-worker-disable config key, but omits that disabling the admin worker makes `bin/console scheduled-task:run` mandatory — a critical operational consequence named in the expected answer.
- dev-61 (mcp-wiki): Answer states the storefront shard/replica default is 'default is 3/3, since Shopware 6.4.12.0' — this is exactly the trap the expected answer calls out as no longer true: in 6.7 the storefront env defaults are empty so the cluster decides; only the separate *admin* index still defaults to 3/3.
- dev-61 (mcp-wiki): Never distinguishes the storefront index settings from the admin search index settings (`elasticsearch.administration.index_settings`, `es:admin:index`) — a whole expected fact (fact 3) is missing.
- dev-61 (mcp-wiki): Cites `bin/console dal:refresh:index --use-queue` as a reindex command, which does not appear among the 6.7.13.0 Elasticsearch command set in the confirmed evidence (es:index, es:admin:index, es:create:alias, es:reset, es:admin:reset, es:mapping:update, es:admin:mapping:update, es:index:cleanup, es:status, es:test:analyzer, es:admin:test) — likely an unverified/incorrect command.
- dev-62 (mcp-wiki): Correctly discloses that the wiki pages found do not spell out .env/.env.local/real-env precedence, and correctly supplies the standard Symfony precedence via a labelled [from memory] sentence (real env > .env.local > .env) — but omits the `.env.$APP_ENV` variants and, critically, the `.env.local.php` bypass mechanism that is very likely the actual cause of a deployed-shop `.env` edit having no effect.
- dev-62 (mcp-wiki): Correctly states that Administration-configured settings (system_config) are database-backed and never read from `.env`, matching expected fact 3's core claim.
- dev-62 (mcp-wiki): Never addresses whether `cache:clear` is needed for a changed `.env` value (expected fact 2's central 'do not tell them to clear cache' warning) — this is a real gap for a diagnostic query.
- dev-63 (mcp-wiki): Findability upgraded from the audit's strict `fail` to `pass` under the drift-tolerance clause: the target path (commands-reference.md) was never read, but the page actually read (database-migrations.md, the same page dev-52 targets) does carry the core answer to the literal question asked (the `database:migrate <Plugin> --all` command).
- dev-63 (mcp-wiki): Correctly gives the exact command and mandatory `--all` flag, answering the literal question asked.
- dev-63 (mcp-wiki): Entirely omits the diagnostic content that is the actual point of the query ('my migration never ran') — no mention that an unknown/mistyped plugin identifier silently succeeds with exit code 0, that a Migration directory must exist at container-compile time (requiring `cache:clear` for a brand-new migration folder), or that `plugin:refresh` must run first to bump `upgradeVersion` before `plugin:update` will pick up the change.
- dev-65 (mcp-wiki): States total-count-mode 1 'runs SQL_CALC_FOUND_ROWS for an exact total' — this directly contradicts the confirmed code fact that 6.7 runs a second `COUNT(*)` query over the subquery, not SQL_CALC_FOUND_ROWS.
- dev-65 (mcp-wiki): Entirely omits the `associations` object shape (keyed by property name, recursive criteria) and the to-one vs to-many filter/sort/limit restriction — despite associations being explicitly named in the query itself.
- dev-65 (mcp-wiki): Filter/post-filter/aggregation distinction, sort shape, and total-count-mode enum are otherwise covered reasonably well.
- dev-66 (mcp-wiki): States 'sw-inheritance: 1' as the usage without stating the actual (surprising) mechanic: inheritance is switched on by header *presence alone* — any value, including 0 or false, enables it, and there is no way to disable it via the header. This is exactly the nuance the case tests and it is missing.
- dev-66 (mcp-wiki): Does not mention that sw-language-id falls back safely on empty/missing but throws languageNotFound on an invalid id, nor that sw-version-id is taken unvalidated.
- dev-66 (mcp-wiki): Does not mention the FILTER_VALIDATE_BOOLEAN truthy requirement for sw-skip-trigger-flow, nor that it is resolved for every /api route rather than only during sync/bulk import as implied by the answer's framing.
- dev-67 (mcp-wiki): States 'author and copyright are required or app:refresh fails' without noting that <meta> is the only mandatory manifest block and that label/name/license/version are equally required fields — an imprecise, incomplete list of the true required set.
- dev-67 (mcp-wiki): Correctly gives app:refresh -> app:install --activate <Name> -> app:activate <Name> sequence, matching the expected answer closely.
- dev-67 (mcp-wiki): selfReportDelta shows two calls (a grep and the target read_doc) executed but not logged, appearing to be duplicate/retried calls rather than a different source — non-material to how the answer was obtained.
- dev-70 (mcp-wiki): States that 'presence of finalize-url is what distinguishes an asynchronous payment method from a synchronous one', implying separate sync/async handling — this contradicts the confirmed code fact that there is a single AppPaymentHandler for every app payment method; the finalize step exists only because a redirectUrl in the pay response nulls the payment token, not because of a distinct 'async' class of method.
- dev-70 (mcp-wiki): Lists 'Available payment states' as open, paid, cancelled, refunded, failed, authorize, unconfirmed, in_progress, reminded, chargeback — this conflates state names with transition action names. Per the confirmed code, `status` must be a transition ACTION name (paid, process, authorize, chargeback, refund, remind, reopen, cancel, fail, etc.); sending a state name like `cancelled`, `refunded`, `failed`, `in_progress`, `unconfirmed` or `reminded` throws IllegalTransitionException. This is a materially wrong and potentially breaking claim, central to the query's ask ('what must the app server return').
- dev-70 (mcp-wiki): Never mentions that the app's response itself must carry a valid shopware-app-signature header or the call fails verification.
- dev-71 (mcp-wiki): States fields 'can be marked store-api-aware="true" to expose it through the Store API' — this is materially misleading: per the confirmed code, store-api-aware only attaches the ApiAware read-protection flag and creates no route at all; there is no generic Store API route for custom entities in 6.7, and storefront access goes only through the app-script endpoint (/store-api/script/{hook}). This is exactly the trap the expected answer names.
- dev-71 (mcp-wiki): Correctly describes the entities.xml registration, entity-1.0.xsd validation, and the Admin API kebab-case URL mapping (custom_entity_bundle -> /api/search/custom-entity-bundle, ce_ shorthand -> /api/search/ce-blog).
- dev-71 (mcp-wiki): Never mentions that an app is automatically granted read/create/update/delete on its own custom entities without declaring them in <permissions> — an expected fact entirely omitted.
- dev-71 (mcp-wiki): Understates the mandatory custom_entity_/ce_ name-prefix rule (framed as an optional stylistic shorthand rather than an enforced requirement).
- func-02 (mcp-wiki): Correctly states the single 'Availability rule' field per shipping/payment method and that leaving it blank means unrestricted availability, matching the NULL-availability-rule fact.
- func-02 (mcp-wiki): Never mentions that a rule in use cannot be deleted, nor that several conditions must be combined inside one rule rather than spread over several (since only one rule can be attached).
- func-02 (mcp-wiki): Entirely omits the underlying rule-matching mechanics (rule_condition rows nested by parent_id, AndRule root wrapping, matching against the serialized payload rather than the condition rows, and that an invalid/un-indexed rule silently blocks the method) and the double-enforcement detail (CartRuleLoader-computed rule ids, onlyAvailable filtering, distinct blocked-error reasons) — these are deep, code-derived facts unlikely to appear on a merchant-facing Rule Builder page.
- func-04 (mcp-wiki): States that 'shipping and payment methods are not actually functionally transferred' — this contradicts the expected fact that shipping methods DO have a ShippingMethodDataSet and ARE migrated with customersOrders; only payment methods lack a DataSet and are premapping-only. Conflating the two is a materially wrong statement.
- func-04 (mcp-wiki): Lists only 5 of the 8 required premapping items (payment methods, standard payment method, salutation, delivery time, standard delivery time) — omitting order states, order delivery states, transaction states and newsletter recipient status entirely.
- func-04 (mcp-wiki): Omits several DataSelections named in the expected answer (media, newsletterRecipient, wishlist) from its group listing.
- func-05 (mcp-wiki): Answer lists only 3 of the 4 channel types (misses Agentic commerce) and never states that the Required-fields set (typeId/languageId/currencyId/paymentMethodId/shippingMethodId/countryId/navigationCategoryId/accessKey) is unconditional across all types.
- func-05 (mcp-wiki): Domain-per-language/currency/snippet-set requirement is correctly stated, matching expected fact 2.
- func-05 (mcp-wiki): Access-key mechanics (sw-access-key header, SWSC prefix, no secret counterpart, GET /api/_action/access-key/sales-channel) are not described — only the UI location is given.
- func-06 (mcp-wiki): selfReportDelta shows only 2 of 4 ground-truth calls reported (50% under-reported), including the read of the very page cited — materially under-reported toolCallLog, honesty = 0.
- func-06 (mcp-wiki): Answer repeats the documented-defect claim that checkout.order.payment_method.changed already sets order status to 'Open' — code shows this event only changes the order-transaction (payment) state, not the order state; this is the exact trap the case is built on and the answer fails it.
- func-06 (mcp-wiki): States the 6.6 Flow Builder menu location as Settings > Automation, but the query is pinned to 6.6 where the module still sits under Settings > Shop (6.7-only move) — wrong for the queried version.
- func-06 (mcp-wiki): Correctly identifies the 16 core actions category, the Delayed Actions (Beyond) and Webhook (Evolve/Commercial) licence gating, and the checkout.order.placed + Send mail combination.
- func-07 (mcp-wiki): Answer states 'Start dry run validates the file without writing any data' — code shows dry run performs the real writes and only rolls back the DBAL transaction at the end (log/file rows, media side effects survive); this is the exact documented defect the case probes and the answer repeats it as fact.
- func-07 (mcp-wiki): Menu location's 6.6 vs 6.7 delta (Settings > Shop vs Settings > Automation) is not stated at all.
- func-07 (mcp-wiki): Matching-identifier mechanism (Second Unique Identifier) is captured at a high level but the duplicate-mapping silent-collapse behaviour is not mentioned.
- func-08 (mcp-wiki): States that enabling 'Modifiable via Store API' 'marks the field public' — this conflates two independent columns (allow_customer_write for writes vs store_api_aware for read visibility); the code explicitly shows no single admin switch writes both.
- func-08 (mcp-wiki): Entity-assignment aggregate and unique-technical-name framing are present; the eleven admin field types are listed but the collapse onto 8 stored types and the 6.6 Twig-name-validation-not-enforced nuance are missing.
- func-08 (mcp-wiki): Second citation (app custom-data page) is tied to the developer-side XML registration aside, correctly separated from the merchant-facing facts.
- func-09 (mcp-wiki): Cites platform/func/settings/Paymentmethods.md:1-32 for the core claims (active toggle, sales-channel assignment) but toolCallLog never actually reads that file — audit confirms matchesToolCallLog: false; this is a fabricated citation to unread content.
- func-09 (mcp-wiki): Findability fails outright: the target page was never read at all, only a tangential FAQ page was.
- func-09 (mcp-wiki): Active + sales-channel-assignment and availability-rule gates are both stated correctly (matching facts 1 and 2), but fact 3 (dangling handler / checkout-gateway RemovePaymentMethodCommand) is missing.
- func-10 (mcp-wiki): selfReportDelta shows only 4 of 8 ground-truth calls reported (50% under-reported) — materially under-reported toolCallLog, honesty = 0.
- func-10 (mcp-wiki): Presents 'Keep matching variants grouped' (displayAsGroup) as a current feature without noting it does not exist in 6.6 — the query is version-pinned 6.6+6.7 and this is exactly the trap the case's expected answer calls out ('An answer that offers this option for 6.6 is wrong').
- func-10 (mcp-wiki): Only names 3 of the 5 places a dynamic group can be used (category, product export/comparison, CMS slider) — cross-selling and the cart rule are both missing, and the live-evaluation vs stored-mapping distinction is absent.
- func-10 (mcp-wiki): No entity/table names or api_filter/invalid mechanics are mentioned, consistent with a merchant-docs-only source, but these are part of the expected facts.
- func-11 (mcp-wiki): Ground truth shows zero actual retrieval calls (actual: 0) despite the report claiming 4 tool calls and citing two specific pages with line ranges — the entire toolCallLog appears fabricated; grounding and citation both zero per the fabrication bands.
- func-11 (mcp-wiki): Both citations have matchesToolCallLog: false in the audit, confirming neither corresponds to a real read this session even though the cited files/ranges happen to exist and the content described is broadly accurate.
- func-11 (mcp-wiki): The two-ways-to-grant-privileges (ACL role or Administrator flag) and the access-key/secret generation-and-regeneration semantics are stated correctly and match the expected facts, but this correctness is not attributable to any actual retrieval.
- func-12 (mcp-wiki): States the Flow Builder webhook (Call URL) action 'is a native Flow Builder capability and requires no additional license' — core ships no HTTP/webhook flow action at all; it is a Shopware Commercial (Evolve+) feature. This is precisely the trap the case's expected answer names: 'presents either capability as stock Shopware... fails.'
- func-12 (mcp-wiki): Customer-specific pricing is correctly identified as a Shopware Beyond/Commercial-only, API-only feature, matching expected fact 2's other half.
- func-12 (mcp-wiki): No mention of the core, license-free alternatives (Rule-Builder-bound advanced prices, promotions with personaCustomers, or an app-based webhook/flow action) that fact 3 requires.
- edge-03 (mcp-wiki): Correctly states Shopware 6 has no Doctrine ORM, no #[ORM\Entity], and no EntityManager — the central trap is avoided.
- edge-03 (mcp-wiki): States a plugin entity is defined via EntityDefinition '(fields declared in PHP, not attributes)' — this is wrong for 6.7, which also supports PHP-attribute-based entities (#[Entity], #[Field], tag shopware.entity); the answer denies the very mechanism the query's premise gestures at.
- edge-03 (mcp-wiki): Never mentions the actual persistence call (create()/upsert() with an array payload plus Context) — only describes injection, not writing.
- edge-04 (mcp-wiki): Frames the Sales Channel API as merely 'deprecated as of 6.4' rather than stating plainly that no /sales-channel-api route exists at all in 6.6/6.7 — softer than the expected fact.
- edge-04 (mcp-wiki): Hedges the actual endpoint with 'e.g. POST /store-api/product or /store-api/search' — /store-api/search is not the documented product-listing route and this hedge could mislead about the real path.
- edge-04 (mcp-wiki): Correctly states the sw-access-key header requirement, matching expected fact 3.
- edge-06 (mcp-wiki): Correctly maps Magento modules to Shopware plugins/apps, and correctly describes Symfony DI (services.xml/services.php) as the di.xml analogue — 2 of 4 expected facts present.
- edge-06 (mcp-wiki): Never mentions the sales_channel_domain per-URL structure (url + language + currency + snippet set) that is the actual store-view analogue — only names sales channels generically.
- edge-06 (mcp-wiki): For attribute sets, names the Properties/variant system but omits that no attribute_set entity exists and does not name custom_field_set / EntityExtension as the real extension-field mechanism.
- edge-09 (mcp-wiki): States the legacy Business Events screen 'still exists' for B2B-Suite shops — code shows no sw-event-action/sw-business-event module exists in the 6.6 or 6.7 administration at all and the backing tables were dropped by a V6_5 migration; this repeats the doc's disproven claim rather than correcting it, which is exactly the trap this case probes.
- edge-09 (mcp-wiki): Correctly identifies Flow Builder (checkout.order.placed + Send mail) as the current, recommended place to configure the mail.
- edge-09 (mcp-wiki): Does not mention that 'business event' survives only as a read-only event catalogue (GET /api/_info/events.json) feeding the Flow Builder trigger picker.
- gap-01 (mcp-wiki): Correctly states no dedicated guide exists for a plugin Admin API controller and names the closest real pages (Storefront custom-controller guide, ACL guide) without presenting them as documentation of the Admin API case.
- gap-01 (mcp-wiki): Under a [from memory] hedge, invents the class name 'AdminApiRouteScope::ID' — the real class is ApiRouteScope; this is a specific, incorrect technical detail even though clearly labelled as inference rather than retrieved fact.
- gap-01 (mcp-wiki): One of four citations (platform/dev/.../store-api/_index.md, no line range) does not correspond to any actual read_doc call in the ground-truth log, per the audit's matchesToolCallLog: false.
- gap-05 (mcp-wiki): Correctly states no Cached*Route/CachedProductRoute class is documented and correctly gives the CacheTagCollector.addTag() replacement mechanism for cache tags (facts 1 and 3).
- gap-05 (mcp-wiki): Presents _httpCache and Store-API-derived cache tags as if they work out of the box on any controller, without the critical qualifier that store-api HTTP caching only exists from 6.7.6.0 and is gated behind the experimental CACHE_REWORK flag (default false) — a stock 6.7 install does not actually cache the route this way.
- gap-05 (mcp-wiki): Conflates the Storefront-controller _httpCache guide with the Store API route case rather than treating them separately.

## Borderline re-scores

| Case | Option | Dimension | Taken (lower band) |
| --- | --- | --- | --- |
| dev-06 | mcp-wiki | completeness | 100 → 70 |
| dev-21 | mcp-wiki | accuracy | 0 → 0 |
| dev-21 | mcp-wiki | actionability | 40 → 40 |
| dev-23 | mcp-wiki | accuracy | 0 → 0 |
| dev-23 | mcp-wiki | actionability | 40 → 40 |
| dev-28 | mcp-wiki | honesty | 70 → 70 |
| dev-34 | mcp-wiki | accuracy | 40 → 40 |
| dev-34 | mcp-wiki | completeness | 100 → 40 |
| dev-34 | mcp-wiki | actionability | 100 → 70 |
| dev-36 | mcp-wiki | completeness | 100 → 40 |
| dev-41 | mcp-wiki | completeness | 100 → 40 |
| dev-41 | mcp-wiki | actionability | 100 → 70 |
| dev-42 | mcp-wiki | accuracy | 40 → 40 |
| dev-42 | mcp-wiki | completeness | 100 → 70 |
| dev-44 | mcp-wiki | completeness | 100 → 40 |
| dev-44 | mcp-wiki | actionability | 100 → 70 |
| dev-46 | mcp-wiki | accuracy | 0 → 0 |
| dev-47 | mcp-wiki | honesty | 0 → 0 |
| dev-52 | mcp-wiki | accuracy | 40 → 40 |
| dev-52 | mcp-wiki | completeness | 100 → 70 |
| dev-62 | mcp-wiki | accuracy | 70 → 40 |
| dev-62 | mcp-wiki | completeness | 70 → 40 |
| func-02 | mcp-wiki | accuracy | 70 → 40 |
| func-02 | mcp-wiki | actionability | 100 → 70 |
| func-05 | mcp-wiki | actionability | 100 → 70 |
| func-12 | mcp-wiki | accuracy | 0 → 0 |
| func-12 | mcp-wiki | completeness | 0 → 0 |
| func-12 | mcp-wiki | actionability | 100 → 40 |

18 cases (those whose first-pass total landed at 58–62 or 83–87) were independently re-scored by a fresh scorer with no visibility into the first pass's numbers. Where a dimension disagreed, the lower band was taken and the total recomputed. This moved 6 first-pass `pass` verdicts to `partly` (dev-06, dev-34, dev-36, dev-41, dev-42, dev-44, dev-52, dev-62 — several converged exactly and needed no change) and 1 `partly` to `fail` (func-12).

## Scorer discrepancies

| Case | Scorer total/verdict | Recomputed total/verdict |
| --- | --- | --- |
| dev-06 | 85% / pass | 80% / partly |
| dev-34 | 85% / pass | 73% / partly |
| dev-36 | 85% / pass | 76% / partly |
| dev-41 | 85% / pass | 73% / partly |
| dev-42 | 85% / pass | 80% / partly |
| dev-44 | 85% / pass | 73% / partly |
| dev-52 | 85% / pass | 80% / partly |
| dev-62 | 85% / pass | 73% / partly |
| dev-67 | 92% / pass | 77% / partly |
| func-02 | 83% / partly | 73% / partly |
| func-05 | 83% / partly | 80% / partly |
| func-12 | 60% / partly | 54% / fail |

All discrepancies above trace to the accuracy-pass merge and/or the borderline re-score merge changing a dimension after the shard scorer wrote its file — the skill's own arithmetic, not scorer error.

## Audit warnings

- rescore dev-06: completeness 100 → 70
- dev-06: recomputed total/verdict (80/partly) differs from scorer's (85/pass)
- rescore dev-21: accuracy 0 → 0
- rescore dev-21: actionability 40 → 40
- rescore dev-23: accuracy 0 → 0
- rescore dev-23: actionability 40 → 40
- rescore dev-28: honesty 70 → 70
- rescore dev-34: accuracy 40 → 40
- rescore dev-34: completeness 100 → 40
- rescore dev-34: actionability 100 → 70
- dev-34: recomputed total/verdict (73/partly) differs from scorer's (85/pass)
- rescore dev-36: completeness 100 → 40
- dev-36: recomputed total/verdict (76/partly) differs from scorer's (85/pass)
- rescore dev-41: completeness 100 → 40
- rescore dev-41: actionability 100 → 70
- dev-41: recomputed total/verdict (73/partly) differs from scorer's (85/pass)
- rescore dev-42: accuracy 40 → 40
- rescore dev-42: completeness 100 → 70
- dev-42: recomputed total/verdict (80/partly) differs from scorer's (85/pass)
- rescore dev-44: completeness 100 → 40
- rescore dev-44: actionability 100 → 70
- dev-44: recomputed total/verdict (73/partly) differs from scorer's (85/pass)
- rescore dev-46: accuracy 0 → 0
- rescore dev-47: honesty 0 → 0
- rescore dev-52: accuracy 40 → 40
- rescore dev-52: completeness 100 → 70
- dev-52: recomputed total/verdict (80/partly) differs from scorer's (85/pass)
- rescore dev-62: accuracy 70 → 40
- rescore dev-62: completeness 70 → 40
- dev-62: recomputed total/verdict (73/partly) differs from scorer's (85/pass)
- dev-67: selfReportDelta shows under-report (reported 3, actual 5) but honesty=100; forcing honesty=0
- dev-67: recomputed total/verdict (77/partly) differs from scorer's (92/pass)
- rescore func-02: accuracy 70 → 40
- rescore func-02: actionability 100 → 70
- func-02: recomputed total/verdict (73/partly) differs from scorer's (83/partly)
- rescore func-05: actionability 100 → 70
- func-05: recomputed total/verdict (80/partly) differs from scorer's (83/partly)
- rescore func-12: accuracy 0 → 0
- rescore func-12: completeness 0 → 0
- rescore func-12: actionability 100 → 40
- func-12: recomputed total/verdict (54/fail) differs from scorer's (60/partly)

