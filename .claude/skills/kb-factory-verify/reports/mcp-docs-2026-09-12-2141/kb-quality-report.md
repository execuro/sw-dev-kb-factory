# KB quality report — mcp-docs-2026-09-12-2141

## Run

| | |
| --- | --- |
| Run | `mcp-docs-2026-09-12-2141` (`mcp-docs`) |
| Options | mcp-docs |
| Corpus | docs — fingerprint: developer 3a7f3af9c1 (2026-09-11T18:13:30+02:00), merchant fd093eda5f (2026-09-11T03:37:21Z) |
| Probe | kb_status corpus.name=docs, entry points present (developer/index.md, merchant/index.md), layers developer=implemented, merchant=implemented, platform=planned, marketplace=planned, project=planned |
| Model | inherited (not pinned) |
| Generated | 2026-09-13T05:37:15.623Z |
| Cases run | 100 of 100 (all) |
| Yardstick | cases.md ef932d8e, scoring-rubric.md 06199943, scorer-brief.md e256f8be, auditor-brief.md 4bd00bc6, accuracy-brief.md 9009d748 (rubricVersion 2) |
| Execution | discover batches of 10, scorer shards of 25 (batched); one borderline rescore pass (10 cases) |
| Skill | kb-factory-verify |
| Case status | 99 confirmed, 0 draft, 1 contradictory |

## Run cost

One row per option, sourced from `options.<option>.costs` and `costs.wallClockSeconds`. Usage is measured per discover batch and per scorer shard, never per case.

| Option | Agents | Tokens | Tool calls | Summed agent time | Usage complete |
| --- | --- | --- | --- | --- | --- |
| mcp-docs | 17 (10 discover, 1 audit, 4 score, 1 accuracy, 1 rescore) | 42,904,156 | 371 | 7819s | yes |

Wall-clock duration of the run: 28570s.

## Comparison

The headline table — one row per option, straight from `options.<option>` (no new computation).

| Option | Access | Corpus | Overall | Status | Developer | Functional | Findable | Edge passed | Gap confirmed | Pass / partly / fail / unavailable / unscored | Weakest dimension |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| mcp-docs | mcp | docs | 74% | Not ready | 72% | 75% | 52 of 83 | 3 of 9 | 4 of 8 | 31 / 51 / 17 / 1 / 0 | accuracy |

This run measured a single option (`mcp-docs`); no ranking or cross-option delta applies — that requires `compare` against a run of another option.

## Dimension heatmap

| Dimension | Weight | mcp-docs |
| --- | --- | --- |
| Grounding & Relevance | 25 | 85.6 |
| Accuracy vs. Expected Answer | 25 | 60.6 |
| Completeness | 15 | 69.9 |
| Citation & Traceability | 10 | 70.5 |
| Honesty | 15 | 78.0 |
| Actionability | 10 | 86.8 |

Average band score, `unscored` cases excluded (none in this run).

### By area

| Area | mcp-docs average |
| --- | --- |
| Checkout & Cart | 34% |
| Content (CMS/mail/SEO/media/sitemap) | 53% |
| Events | 53% |
| Config & CLI | 58% |
| Services & DI | 61% |
| Storefront | 67% |
| Orders | 69% |
| Testing | 70% |
| Hosting & ops | 74% |
| Admin API | 74% |
| Administration | 75% |
| Merchant | 75% |
| Content | 79% |
| DAL | 80% |
| Admin migration (Vue 3 / Vite / Pinia / Meteor) | 81% |
| Gap | 82% |
| Trap | 82% |
| App system | 88% |
| Plugin fundamentals | 88% |
| Theme | 89% |
| Core breaking changes | 90% |
| Payment & Shipping | 92% |
| Platform upgrade | 96% |
| Store API & headless | 100% |

## Verdict grid

| Case | Category | Area | mcp-docs |
| --- | --- | --- | --- |
| dev-01 | dev | DAL | 77% partly ✗ |
| dev-02 | dev | Plugin fundamentals | 88% pass ✓ |
| dev-03 | dev | Store API & headless | 100% pass ✓ |
| dev-04 | dev | Content | 79% partly ✓ |
| dev-05 | dev | Theme | 100% pass ✓ |
| dev-06 | dev | Events | 88% pass ✓ |
| dev-07 | dev | DAL | 80% partly ✓ |
| dev-08 | dev | DAL | 79% partly ✓ |
| dev-09 | dev | DAL | 88% pass ✓ |
| dev-10 | dev | DAL | 77% partly ✓ |
| dev-11 | dev | Services & DI | 77% partly ✗ |
| dev-12 | dev | Services & DI | 67% unavailable – |
| dev-13 | dev | Services & DI | 38% fail ✗ |
| dev-14 | dev | Events | 38% fail ✗ |
| dev-15 | dev | Events | 35% fail ✗ |
| dev-16 | dev | Orders | 73% partly ✗ |
| dev-17 | dev | Checkout & Cart | 38% fail ✗ |
| dev-18 | dev | Checkout & Cart | 30% fail ✗ |
| dev-19 | dev | Events | 65% partly ✗ |
| dev-20 | dev | Events | 42% fail ✗ |
| dev-21 | dev | Events | 52% fail ✓ |
| dev-22 | dev | Config & CLI | 38% fail ✗ |
| dev-23 | dev | Content (CMS/mail/SEO/media/sitemap) | 68% partly ✓ |
| dev-24 | dev | Content (CMS/mail/SEO/media/sitemap) | 38% fail ✗ |
| dev-25 | dev | Config & CLI | 73% partly ✗ |
| dev-26 | dev | Orders | 65% partly ✓ |
| dev-27 | dev | Storefront | 39% fail ✗ |
| dev-28 | dev | Storefront | 77% partly ✓ |
| dev-29 | dev | Storefront | 35% fail ✗ |
| dev-30 | dev | Storefront | 42% fail ✗ |
| dev-31 | dev | Storefront | 65% partly ✗ |
| dev-32 | dev | DAL | 80% partly ✓ |
| dev-33 | dev | Administration | 41% fail ✓ |
| dev-34 | dev | Administration | 92% pass ✓ |
| dev-35 | dev | Administration | 88% pass ✓ |
| dev-36 | dev | Administration | 77% partly ✓ |
| dev-37 | dev | Testing | 88% pass ✓ |
| dev-38 | dev | Testing | 77% partly ✓ |
| dev-39 | dev | Testing | 46% fail ✗ |
| dev-40 | dev | Platform upgrade | 92% pass ✗ |
| dev-41 | dev | Hosting & ops | 65% partly ✗ |
| dev-42 | dev | Config & CLI | 38% fail ✗ |
| dev-43 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 82% partly ✓ |
| dev-44 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 77% partly ✗ |
| dev-45 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 88% pass ✓ |
| dev-46 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 77% partly ✓ |
| dev-47 | dev | Payment & Shipping | 92% pass ✓ |
| dev-48 | dev | Storefront | 92% pass ✓ |
| dev-49 | dev | Core breaking changes | 82% partly ✓ |
| dev-50 | dev | Core breaking changes | 88% pass ✓ |
| dev-51 | dev | DAL | 77% partly ✗ |
| dev-52 | dev | Core breaking changes | 100% pass ✓ |
| dev-53 | dev | Theme | 77% partly ✓ |
| dev-54 | dev | Storefront | 92% pass ✓ |
| dev-55 | dev | Storefront | 70% partly ✓ |
| dev-56 | dev | Storefront | 92% pass ✓ |
| dev-57 | dev | Platform upgrade | 100% pass ✗ |
| dev-58 | dev | Hosting & ops | 88% pass ✓ |
| dev-59 | dev | Hosting & ops | 74% partly ✓ |
| dev-60 | dev | Hosting & ops | 73% partly ✓ |
| dev-61 | dev | Hosting & ops | 70% partly ✓ |
| dev-62 | dev | Config & CLI | 70% partly ✓ |
| dev-63 | dev | Config & CLI | 73% partly ✗ |
| dev-64 | dev | Admin API | 77% partly ✗ |
| dev-65 | dev | Admin API | 73% partly ✓ |
| dev-66 | dev | Admin API | 73% partly ✓ |
| dev-67 | dev | App system | 92% pass ✓ |
| dev-68 | dev | App system | 92% pass ✓ |
| dev-69 | dev | App system | 92% pass ✓ |
| dev-70 | dev | App system | 70% partly ✓ |
| dev-71 | dev | App system | 92% pass ✓ |
| func-01 | func | Merchant | 65% partly ✓ |
| func-02 | func | Merchant | 74% partly ✓ |
| func-03 | func | Merchant | 100% pass ✓ |
| func-04 | func | Merchant | 73% partly ✗ |
| func-05 | func | Merchant | 70% partly ✗ |
| func-06 | func | Merchant | 70% partly ✓ |
| func-07 | func | Merchant | 74% partly ✓ |
| func-08 | func | Merchant | 70% partly ✓ |
| func-09 | func | Merchant | 82% partly ✓ |
| func-10 | func | Merchant | 52% fail ✗ |
| func-11 | func | Merchant | 86% pass ✓ |
| func-12 | func | Merchant | 82% partly ✗ |
| edge-01 | edge | Trap | 83% partly – |
| edge-02 | edge | Trap | 79% partly – |
| edge-03 | edge | Trap | 94% pass – |
| edge-04 | edge | Trap | 86% pass – |
| edge-05 | edge | Trap | 82% partly – |
| edge-06 | edge | Trap | 74% partly – |
| edge-07 | edge | Trap | 79% partly – |
| edge-08 | edge | Trap | 94% pass – |
| edge-09 | edge | Trap | 70% partly – |
| gap-01 | gap | Gap | 94% pass – |
| gap-02 | gap | Gap | 94% pass – |
| gap-03 | gap | Gap | 77% partly – |
| gap-04 | gap | Gap | 94% pass – |
| gap-05 | gap | Gap | 59% fail – |
| gap-06 | gap | Gap | 94% pass – |
| gap-07 | gap | Gap | 71% partly – |
| gap-08 | gap | Gap | 71% partly – |

## Requests and responses

### mcp-docs

| Case | Query | Entry point used | Tool calls made | Page reached | Findability | Top citation | Memory claims | Honesty | Verdict | Raw |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dev-01 | `How do I extend the product entity with a new association in` | developer/index.md or merchant/index.md | 7 | developer/guides/plugins/plugins/framework/data-handling/add-complex-data-to-existing-entities.md = target | fail (1 calls) | `developer/guides/plugins/plugins/framework/data-ha` | 0 | 100 | partly | `raw/mcp-docs/dev-01.json` |
| dev-02 | `What's the plugin lifecycle in Shopware — install, activate,` | developer/index.md or merchant/index.md | 2 | developer/guides/plugins/plugins/plugin-fundamentals/plugin-lifecycle.md = target | pass (1 calls) | `developer/guides/plugins/plugins/plugin-fundamenta` | 0 | 100 | pass | `raw/mcp-docs/dev-02.json` |
| dev-03 | `How do I add a custom Store API route for a headless storefr` | developer/index.md or merchant/index.md | 3 | developer/guides/plugins/plugins/framework/store-api/add-store-api-route.md = target | pass (1 calls) | `developer/guides/plugins/plugins/framework/store-a` | 0 | 100 | pass | `raw/mcp-docs/dev-03.json` |
| dev-04 | `How do I create a custom CMS element for Shopping Experience` | developer/index.md or merchant/index.md | 2 | developer/guides/plugins/plugins/content/cms/add-cms-element.md = target | pass (1 calls) | `developer/guides/plugins/plugins/content/cms/add-c` | 0 | 100 | partly | `raw/mcp-docs/dev-04.json` |
| dev-05 | `How does theme inheritance work in Shopware — theme.json and` | developer/index.md or merchant/index.md | 2 | developer/guides/plugins/themes/inheritance/add-theme-inheritance.md = target | pass (1 calls) | `developer/guides/plugins/themes/inheritance/add-th` | 0 | 100 (under-reported 1) | pass | `raw/mcp-docs/dev-05.json` |
| dev-06 | `How do I add a custom Flow Builder action?` | developer/index.md or merchant/index.md | 2 | developer/guides/plugins/plugins/framework/flow/add-flow-builder-action.md = target | pass (1 calls) | `developer/guides/plugins/plugins/framework/flow/ad` | 0 | 100 | pass | `raw/mcp-docs/dev-06.json` |
| dev-07 | `My plugin needs to store its own data in a new table — how d` | developer/index.md or merchant/index.md | 1 | developer/guides/plugins/plugins/framework/data-handling/add-custom-complex-data.md = target | pass (1 calls) | `developer/guides/plugins/plugins/framework/data-ha` | 0 | 100 | partly | `raw/mcp-docs/dev-07.json` |
| dev-08 | `In a plugin service, what is the Shopware 6 equivalent of Do` | developer/index.md or merchant/index.md | 1 | developer/guides/plugins/plugins/framework/data-handling/reading-data.md = target | pass (1 calls) | `developer/guides/plugins/plugins/framework/data-ha` | 0 | 100 | partly | `raw/mcp-docs/dev-08.json` |
| dev-09 | `How do I make a field on my plugin's own entity translatable` | developer/index.md or merchant/index.md | 1 | developer/guides/plugins/plugins/framework/data-handling/add-data-translations.md = target | pass (1 calls) | `developer/guides/plugins/plugins/framework/data-ha` | 0 | 100 | pass | `raw/mcp-docs/dev-09.json` |
| dev-10 | `How do I write an indexer that precomputes derived data for ` | developer/index.md or merchant/index.md | 1 | developer/guides/plugins/plugins/framework/data-handling/add-data-indexer.md = target | pass (1 calls) | `developer/guides/plugins/plugins/framework/data-ha` | 0 | 100 | partly | `raw/mcp-docs/dev-10.json` |
| dev-11 | `On Shopware 6.7, which file do I declare my plugin's service` | developer/index.md or merchant/index.md | 8 | developer/guides/plugins/plugins/services/adjusting-service.md ≠ target | fail (1 calls) | `developer/guides/plugins/plugins/services/add-cust` | 0 | 0 (under-reported 2) | partly | `raw/mcp-docs/dev-11.json` |
| dev-12 | `I am on Shopware 6.6 — which file do I declare my plugin's s` | developer/index.md or merchant/index.md | 2 | developer/resources/references/adr/2026-03-17-mcp-server-placement-and-extensibility.md ≠ target | n/a | `developer/resources/references/adr/2026-07-30-migr` | 1 | 100 (under-reported 2) | unavailable | `raw/mcp-docs/dev-12.json` |
| dev-13 | `There is no event for what I need to change in a core Shopwa` | developer/index.md or merchant/index.md | 0 | developer/guides/plugins/plugins/framework/event/finding-events.md ≠ target | fail (0 calls) | `developer/guides/plugins/plugins/services/adjustin` | 0 | 0 (under-reported 2) | fail | `raw/mcp-docs/dev-13.json` |
| dev-14 | `I wrote a subscriber class in my plugin but it never fires —` | developer/index.md or merchant/index.md | 2 | — | fail (0 calls) | `developer/guides/plugins/plugins/framework/event/l` | 0 | 0 (under-reported -2) | fail | `raw/mcp-docs/dev-14.json` |
| dev-15 | `How do I work out which event Shopware actually dispatches f` | developer/index.md or merchant/index.md | 1 | — | fail (0 calls) | `developer/guides/plugins/plugins/framework/event/f` | 0 | 0 (under-reported -1) | fail | `raw/mcp-docs/dev-15.json` |
| dev-16 | `How do I run plugin logic whenever an order is written, and ` | developer/index.md or merchant/index.md | 5 | developer/guides/plugins/plugins/checkout/cart/add-cart-discounts.md ≠ target | fail (1 calls) | `developer/guides/plugins/plugins/checkout/order/li` | 0 | 0 (under-reported 5) | partly | `raw/mcp-docs/dev-16.json` |
| dev-17 | `How do I overwrite the price of a product line item in the c` | developer/index.md or merchant/index.md | 2 | — | fail (0 calls) | `developer/guides/plugins/plugins/checkout/cart/cha` | 0 | 0 (under-reported -2) | fail | `raw/mcp-docs/dev-17.json` |
| dev-18 | `My plugin's cart processor adds a surcharge line item, but i` | developer/index.md or merchant/index.md | 2 | — | fail (0 calls) | `developer/guides/plugins/plugins/checkout/cart/add` | 0 | 0 (under-reported -2) | fail | `raw/mcp-docs/dev-18.json` |
| dev-19 | `I need to move long-running work in my plugin out of the req` | developer/index.md or merchant/index.md | 3 | developer/guides/plugins/plugins/framework/message-queue/add-message-to-queue.md ≠ target | fail (1 calls) | `developer/guides/plugins/plugins/framework/message` | 0 | 0 (under-reported 3) | partly | `raw/mcp-docs/dev-19.json` |
| dev-20 | `How do I add my own condition to the Rule Builder from a plu` | developer/index.md or merchant/index.md | 2 | — | fail (0 calls) | `developer/guides/plugins/plugins/framework/rule/ad` | 0 | 0 (under-reported -2) | fail | `raw/mcp-docs/dev-20.json` |
| dev-21 | `My plugin dispatches its own domain event — how do I make it` | developer/index.md or merchant/index.md | 4 | developer/guides/plugins/plugins/plugin-fundamentals/add-plugin-configuration.md ≠ target | pass (1 calls) | `developer/guides/plugins/plugins/framework/flow/ad` | 0 | 0 (under-reported 2) | fail | `raw/mcp-docs/dev-21.json` |
| dev-22 | `How do I give my plugin a settings page the shop operator ca` | developer/index.md or merchant/index.md | 2 | — | fail (0 calls) | `developer/guides/plugins/plugins/plugin-fundamenta` | 0 | 0 (under-reported -2) | fail | `raw/mcp-docs/dev-22.json` |
| dev-23 | `How do I ship a mail template with my plugin so it is instal` | developer/index.md or merchant/index.md | 2 | developer/guides/plugins/plugins/content/seo/add-custom-seo-url.md ≠ target | pass (1 calls) | `developer/guides/plugins/plugins/content/mail/add-` | 0 | 0 (under-reported 2) | partly | `raw/mcp-docs/dev-23.json` |
| dev-24 | `How do I get readable SEO URLs generated for the detail page` | developer/index.md or merchant/index.md | 2 | — | fail (0 calls) | `developer/guides/plugins/plugins/content/seo/add-c` | 0 | 0 (under-reported -2) | fail | `raw/mcp-docs/dev-24.json` |
| dev-25 | `How do I add a `bin/console` command to my plugin for a main` | developer/index.md or merchant/index.md | 3 | developer/guides/plugins/plugins/plugin-fundamentals/add-custom-commands.md = target | fail (1 calls) | `developer/guides/plugins/plugins/plugin-fundamenta` | 0 | 0 (under-reported 10) | partly | `raw/mcp-docs/dev-25.json` |
| dev-26 | `How do I add a custom document type such as a pro-forma invo` | developer/index.md or merchant/index.md | 3 | developer/guides/plugins/plugins/checkout/documents/legacy/add-custom-document-type.md ≠ target | pass (1 calls) | `developer/guides/plugins/plugins/checkout/document` | 0 | 100 | partly | `raw/mcp-docs/dev-26.json` |
| dev-27 | `In Shopware 6.7, how do I extend a Storefront Twig template ` | developer/index.md or merchant/index.md | 4 | — | fail (0 calls) | `developer/guides/plugins/plugins/storefront/templa` | 0 | 0 (under-reported -4) | fail | `raw/mcp-docs/dev-27.json` |
| dev-28 | `How do I override an existing Storefront JavaScript plugin, ` | developer/index.md or merchant/index.md | 1 | developer/guides/plugins/plugins/storefront/howto/add-listing-filters.md ≠ target | pass (1 calls) | `developer/guides/plugins/plugins/storefront/javasc` | 0 | 0 (under-reported 2) | partly | `raw/mcp-docs/dev-28.json` |
| dev-29 | `How do I add my own data to an existing Storefront page or p` | developer/index.md or merchant/index.md | 1 | — | fail (0 calls) | `developer/guides/plugins/plugins/storefront/contro` | 0 | 0 (under-reported -1) | fail | `raw/mcp-docs/dev-29.json` |
| dev-30 | `How do I add a custom filter to the Storefront product listi` | developer/index.md or merchant/index.md | 1 | — | fail (0 calls) | `developer/guides/plugins/plugins/storefront/howto/` | 0 | 0 (under-reported -1) | fail | `raw/mcp-docs/dev-30.json` |
| dev-31 | `How do I expose a plugin configuration value, such as a colo` | developer/index.md or merchant/index.md | 5 | developer/guides/plugins/plugins/storefront/styling/add-scss-variables-via-subscriber.md ≠ target | fail (0 calls) | `developer/guides/plugins/plugins/storefront/stylin` | 0 | 100 | partly | `raw/mcp-docs/dev-31.json` |
| dev-32 | `How do I define a custom field set for products from my plug` | developer/index.md or merchant/index.md | 3 | developer/guides/plugins/plugins/administration/data-handling-processing/using-custom-fields.md ≠ target | pass (1 calls) | `developer/guides/plugins/plugins/framework/custom-` | 0 | 100 | partly | `raw/mcp-docs/dev-32.json` |
| dev-33 | `How do I register a custom Administration module from my plu` | developer/index.md or merchant/index.md | 2 | developer/guides/plugins/plugins/administration/module-component-management/add-custom-module.md = target | pass (2 calls) | `developer/guides/plugins/plugins/administration/mo` | 0 | 0 (under-reported 1) | fail | `raw/mcp-docs/dev-33.json` |
| dev-34 | `How do I extend an existing Administration component and its` | developer/index.md or merchant/index.md | 1 | developer/guides/plugins/plugins/administration/module-component-management/customizing-components.md = target | pass (1 calls) | `developer/guides/plugins/plugins/administration/mo` | 0 | 100 | pass | `raw/mcp-docs/dev-34.json` |
| dev-35 | `How do I load entities from the Admin API inside an Administ` | developer/index.md or merchant/index.md | 2 | developer/guides/plugins/plugins/administration/data-handling-processing/using-data-handling.md = target | pass (1 calls) | `developer/guides/plugins/plugins/administration/da` | 0 | 100 (under-reported 1) | pass | `raw/mcp-docs/dev-35.json` |
| dev-36 | `How do I register ACL privileges for my plugin's Administrat` | developer/index.md or merchant/index.md | 2 | developer/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.md = target | pass (1 calls) | `developer/guides/plugins/plugins/administration/pe` | 0 | 100 (under-reported 1) | partly | `raw/mcp-docs/dev-36.json` |
| dev-37 | `How do I set up and run PHPUnit integration tests for my Sho` | developer/index.md or merchant/index.md | 4 | developer/guides/development/testing/index.md ≠ target | pass (1 calls) | `developer/guides/development/testing/unit/php-unit` | 0 | 100 | pass | `raw/mcp-docs/dev-37.json` |
| dev-38 | `How do I write Jest unit tests for my Administration compone` | developer/index.md or merchant/index.md | 1 | developer/guides/development/testing/unit/jest-admin.md = target | pass (1 calls) | `developer/guides/development/testing/unit/jest-adm` | 0 | 100 | partly | `raw/mcp-docs/dev-38.json` |
| dev-39 | `How do I write end-to-end Cypress tests for my plugin agains` | developer/index.md or merchant/index.md | 2 | developer/guides/development/testing/legacy/cypress/index.md ≠ target | fail (0 calls) | `developer/guides/development/testing/legacy/cypres` | 0 | 100 | fail | `raw/mcp-docs/dev-39.json` |
| dev-40 | `How do I upgrade a Composer-based Shopware project from 6.6 ` | developer/index.md or merchant/index.md | 4 | developer/guides/upgrades-migrations/upgrade-shopware.md = target | fail (1 calls) | `developer/guides/upgrades-migrations/upgrade-shopw` | 0 | 100 | pass | `raw/mcp-docs/dev-40.json` |
| dev-41 | ``composer update` to Shopware 6.7 aborts on a platform requi` | developer/index.md or merchant/index.md | 11 | developer/products/tools/cli/validation.md ≠ target | fail (1 calls) | `developer/guides/hosting/index.md:15-29` | 0 | 100 (under-reported 1) | partly | `raw/mcp-docs/dev-41.json` |
| dev-42 | `How do I check extension compatibility before upgrading with` | developer/index.md or merchant/index.md | 0 | — | fail (0 calls) | `developer/products/tools/cli/project-commands/upgr` | 0 | 0 | fail | `raw/mcp-docs/dev-42.json` |
| dev-43 | `My admin plugin still ships a webpack.config.js — how do I m` | developer/index.md or merchant/index.md | 1 | developer/guides/upgrades-migrations/administration/vite.md = target | pass (1 calls) | `developer/guides/upgrades-migrations/administratio` | 0 | 100 | partly | `raw/mcp-docs/dev-43.json` |
| dev-44 | `After the Vue 3 upgrade my admin plugin broke — this.$parent` | developer/index.md or merchant/index.md | 4 | developer/guides/upgrades-migrations/administration/vue3.md = target | fail (2 calls) | `developer/guides/upgrades-migrations/administratio` | 0 | 100 (under-reported 2) | partly | `raw/mcp-docs/dev-44.json` |
| dev-45 | `Shopware.State is deprecated in 6.7 — how do I convert my ad` | developer/index.md or merchant/index.md | 1 | developer/guides/upgrades-migrations/administration/pinia.md = target | pass (1 calls) | `developer/guides/upgrades-migrations/administratio` | 0 | 100 | pass | `raw/mcp-docs/dev-45.json` |
| dev-46 | `sw-button and sw-card are deprecated in Shopware 6.7 — how d` | developer/index.md or merchant/index.md | 1 | developer/guides/upgrades-migrations/administration/meteor-components.md = target | pass (1 calls) | `developer/guides/upgrades-migrations/administratio` | 0 | 100 | partly | `raw/mcp-docs/dev-46.json` |
| dev-47 | `My payment plugin implements `AsynchronousPaymentHandlerInte` | developer/index.md or merchant/index.md | 3 | developer/guides/plugins/plugins/checkout/payment/add-payment-plugin.md = target | pass (1 calls) | `developer/guides/plugins/plugins/checkout/payment/` | 0 | 100 | pass | `raw/mcp-docs/dev-47.json` |
| dev-48 | `After upgrading, my storefront JavaScript plugin no longer l` | developer/index.md or merchant/index.md | 2 | developer/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md = target | pass (1 calls) | `developer/guides/plugins/plugins/storefront/javasc` | 0 | 100 | pass | `raw/mcp-docs/dev-48.json` |
| dev-49 | `My storefront controller still uses the `@Route` and `@Route` | developer/index.md or merchant/index.md | 3 | developer/guides/plugins/plugins/storefront/controllers/add-custom-controller.md = target | pass (3 calls) | `developer/guides/plugins/plugins/storefront/contro` | 0 | 100 (under-reported 2) | partly | `raw/mcp-docs/dev-49.json` |
| dev-50 | `My `ScheduledTaskHandler` stopped running after the upgrade ` | developer/index.md or merchant/index.md | 1 | developer/guides/plugins/plugins/plugin-fundamentals/add-scheduled-task.md = target | pass (1 calls) | `developer/guides/plugins/plugins/plugin-fundamenta` | 0 | 100 | pass | `raw/mcp-docs/dev-50.json` |
| dev-51 | `Custom entities declared in `Resources/config/entities.xml` ` | developer/index.md or merchant/index.md | 6 | developer/guides/upgrades-migrations/index.md ≠ target | fail (1 calls) | `developer/guides/plugins/plugins/framework/data-ha` | 0 | 100 (under-reported 2) | partly | `raw/mcp-docs/dev-51.json` |
| dev-52 | `What must a plugin database migration class implement in Sho` | developer/index.md or merchant/index.md | 3 | developer/guides/plugins/plugins/database/database-migrations.md = target | pass (1 calls) | `developer/guides/plugins/plugins/database/database` | 0 | 100 | pass | `raw/mcp-docs/dev-52.json` |
| dev-53 | `My theme config labels disappeared from the Theme Manager af` | developer/index.md or merchant/index.md | 1 | developer/guides/plugins/themes/configuration/theme-configuration.md = target | pass (1 calls) | `developer/guides/plugins/themes/configuration/them` | 0 | 100 | partly | `raw/mcp-docs/dev-53.json` |
| dev-54 | `How do I register a plugin cookie in the storefront cookie c` | developer/index.md or merchant/index.md | 1 | developer/guides/plugins/plugins/storefront/advanced/add-cookie-to-manager.md = target | pass (1 calls) | `developer/guides/plugins/plugins/storefront/advanc` | 0 | 100 | pass | `raw/mcp-docs/dev-54.json` |
| dev-55 | `How do the breaking storefront accessibility changes reach m` | developer/index.md or merchant/index.md | 1 | developer/guides/development/accessibility/storefront-accessibility.md = target | pass (1 calls) | `developer/guides/development/accessibility/storefr` | 0 | 100 | partly | `raw/mcp-docs/dev-55.json` |
| dev-56 | `Header and footer are loaded through ESI sub-requests in Sho` | developer/index.md or merchant/index.md | 2 | developer/guides/plugins/plugins/storefront/templates/customize-header-footer.md = target | pass (1 calls) | `developer/guides/plugins/plugins/storefront/templa` | 0 | 100 | pass | `raw/mcp-docs/dev-56.json` |
| dev-57 | `B2B Suite support ends with 6.8 — how do I run the B2B Suite` | developer/index.md or merchant/index.md | 6 | developer/products/extensions/b2b-suite-migration/execution/prerequisites.md ≠ target | fail (1 calls) | `developer/products/extensions/b2b-suite-migration/` | 0 | 100 (under-reported 1) | pass | `raw/mcp-docs/dev-57.json` |
| dev-58 | `My shopware.yaml still uses redis_url — how do I define the ` | developer/index.md or merchant/index.md | 2 | developer/guides/hosting/infrastructure/redis.md = target | pass (1 calls) | `developer/guides/hosting/infrastructure/redis.md:1` | 0 | 100 | pass | `raw/mcp-docs/dev-58.json` |
| dev-59 | `After upgrading to Shopware 6.7 my Varnish cache is never in` | developer/index.md or merchant/index.md | 1 | developer/guides/hosting/infrastructure/reverse-http-cache.md = target | pass (1 calls) | `developer/guides/hosting/infrastructure/reverse-ht` | 0 | 100 | partly | `raw/mcp-docs/dev-59.json` |
| dev-60 | `Which transports do my Shopware message queue workers have t` | developer/index.md or merchant/index.md | 2 | developer/guides/hosting/infrastructure/message-queue.md = target | pass (1 calls) | `developer/guides/hosting/infrastructure/message-qu` | 0 | 100 | partly | `raw/mcp-docs/dev-60.json` |
| dev-61 | `After the upgrade my Elasticsearch index has to be rebuilt —` | developer/index.md or merchant/index.md | 5 | developer/guides/hosting/infrastructure/elasticsearch/elasticsearch-setup.md = target | pass (1 calls) | `developer/guides/hosting/infrastructure/elasticsea` | 0 | 100 | partly | `raw/mcp-docs/dev-61.json` |
| dev-62 | `I changed a setting in .env on a deployed 6.7 shop but it st` | developer/index.md or merchant/index.md | 9 | developer/guides/hosting/performance/performance-tweaks.md ≠ target | pass (1 calls) | `developer/guides/hosting/configurations/shopware/i` | 1 | 0 (under-reported 4) | partly | `raw/mcp-docs/dev-62.json` |
| dev-63 | `I deployed a plugin update to a 6.7 staging shop and my new ` | developer/index.md or merchant/index.md | 2 | developer/guides/plugins/plugins/database/database-migrations.md ≠ target | fail (0 calls) | `developer/guides/plugins/plugins/database/database` | 0 | 100 | partly | `raw/mcp-docs/dev-63.json` |
| dev-64 | `How do I get an Admin API OAuth token — with client_credenti` | developer/index.md or merchant/index.md | 4 | developer/guides/development/integrations-api/index.md ≠ target | fail (1 calls) | `developer/guides/development/integrations-api/inde` | 0 | 100 (under-reported 2) | partly | `raw/mcp-docs/dev-64.json` |
| dev-65 | `What can I put in the JSON body of POST /api/search/{entity}` | developer/index.md or merchant/index.md | 1 | developer/guides/development/integrations-api/search-criteria.md = target | pass (1 calls) | `developer/guides/development/integrations-api/sear` | 0 | 100 | partly | `raw/mcp-docs/dev-65.json` |
| dev-66 | `Which request headers change Admin API behaviour for languag` | developer/index.md or merchant/index.md | 1 | developer/guides/development/integrations-api/request-headers.md = target | pass (2 calls) | `developer/guides/development/integrations-api/requ` | 0 | 100 (under-reported 1) | partly | `raw/mcp-docs/dev-66.json` |
| dev-67 | `What does a minimal app folder and manifest.xml need to cont` | developer/index.md or merchant/index.md | 3 | developer/guides/plugins/apps/app-base-guide.md = target | pass (2 calls) | `developer/guides/plugins/apps/app-base-guide.md:1-` | 0 | 100 (under-reported 1) | pass | `raw/mcp-docs/dev-67.json` |
| dev-68 | `How does the registration handshake between Shopware and my ` | developer/index.md or merchant/index.md | 1 | developer/guides/plugins/apps/lifecycle/app-registration-setup.md = target | pass (1 calls) | `developer/guides/plugins/apps/lifecycle/app-regist` | 0 | 100 | pass | `raw/mcp-docs/dev-68.json` |
| dev-69 | `How does an app subscribe to an event like product.written, ` | developer/index.md or merchant/index.md | 1 | developer/guides/plugins/apps/lifecycle/webhook.md = target | pass (1 calls) | `developer/guides/plugins/apps/lifecycle/webhook.md` | 0 | 100 | pass | `raw/mcp-docs/dev-69.json` |
| dev-70 | `How do I implement a payment method in an app with pay-url a` | developer/index.md or merchant/index.md | 1 | developer/guides/plugins/apps/checkout/payment.md = target | pass (1 calls) | `developer/guides/plugins/apps/checkout/payment.md:` | 0 | 100 | partly | `raw/mcp-docs/dev-70.json` |
| dev-71 | `How does an app define its own custom entities in Shopware 6` | developer/index.md or merchant/index.md | 5 | developer/guides/plugins/apps/custom-data/custom-entities.md = target | pass (1 calls) | `developer/guides/plugins/apps/custom-data/custom-e` | 0 | 100 | pass | `raw/mcp-docs/dev-71.json` |
| func-01 | `How do I create a product with variants and configure its vi` | developer/index.md or merchant/index.md | 2 | merchant/content/en/shopware-6/catalogues/products/v1-4-2-0.md = target | pass (1 calls) | `merchant/content/en/shopware-6/catalogues/products` | 0 | 100 | partly | `raw/mcp-docs/func-01.json` |
| func-02 | `How do Rule Builder conditions work for shipping and payment` | developer/index.md or merchant/index.md | 2 | merchant/content/en/shopware-6/settings/rules/v1-6-1-0.md = target | pass (1 calls) | `merchant/content/en/shopware-6/settings/rules/v1-6` | 0 | 100 | partly | `raw/mcp-docs/func-02.json` |
| func-03 | `How do promotions and discount codes work, including individ` | developer/index.md or merchant/index.md | 2 | merchant/content/en/shopware-6/marketing/promotions/v1-7-0-0.md = target | pass (1 calls) | `merchant/content/en/shopware-6/marketing/promotion` | 0 | 100 | pass | `raw/mcp-docs/func-03.json` |
| func-04 | `What does the Shopware Migration Assistant transfer automati` | developer/index.md or merchant/index.md | 4 | merchant/content/en/shopware-6/migration-en/index.md ≠ target | fail (0 calls) | `merchant/content/en/shopware-6/migration-en/Migrat` | 0 | 100 | partly | `raw/mcp-docs/func-04.json` |
| func-05 | `How do I set up a sales channel — storefront versus headless` | developer/index.md or merchant/index.md | 5 | merchant/content/en/shopware-6/settings/saleschannel/v1-5-2-0.md = target | fail (1 calls) | `merchant/content/en/shopware-6/settings/saleschann` | 0 | 100 | partly | `raw/mcp-docs/func-05.json` |
| func-06 | `Which triggers and actions does the Flow Builder offer, and ` | developer/index.md or merchant/index.md | 1 | merchant/content/en/shopware-6/settings/Flow-Builder/v1-3-0-1.md = target | pass (1 calls) | `merchant/content/en/shopware-6/settings/Flow-Build` | 0 | 100 | partly | `raw/mcp-docs/func-06.json` |
| func-07 | `How do I import products from a CSV with an import/export pr` | developer/index.md or merchant/index.md | 5 | merchant/content/en/shopware-6/shopware-en/settings/importexport/v1-4-0-0.md = target | pass (5 calls) | `merchant/content/en/shopware-6/shopware-en/setting` | 0 | 100 (under-reported 3) | partly | `raw/mcp-docs/func-07.json` |
| func-08 | `How do custom field sets work — entity assignment, field typ` | developer/index.md or merchant/index.md | 1 | merchant/content/en/shopware-6/settings/custom-fields/v1-3-1.md ≠ target | pass (0 calls) | `merchant/content/en/shopware-6/settings/custom-fie` | 0 | 100 | partly | `raw/mcp-docs/func-08.json` |
| func-09 | `Why doesn't my payment method appear in the checkout — what ` | developer/index.md or merchant/index.md | 1 | merchant/content/en/shopware-6/settings/Paymentmethods/v1-4-0-0.md = target | pass (1 calls) | `merchant/content/en/shopware-6/settings/Paymentmet` | 0 | 100 | partly | `raw/mcp-docs/func-09.json` |
| func-10 | `How do dynamic product groups work in the administration and` | developer/index.md or merchant/index.md | 11 | merchant/content/en/shopware-6/shopware-6-de/Catalogues/Dynamicproductgroups/v1-3-0-0.md = target | fail (1 calls) | `merchant/content/en/shopware-6/shopware-6-de/Catal` | 0 | 0 (under-reported 2) | fail | `raw/mcp-docs/func-10.json` |
| func-11 | `How do I create an integration for Admin API access in the a` | developer/index.md or merchant/index.md | 3 | merchant/content/en/shopware-6/settings/system/user/v1-3-0.md ≠ target | pass (2 calls) | `merchant/content/en/shopware-6/settings/system/int` | 0 | 100 (under-reported 1) | pass | `raw/mcp-docs/func-11.json` |
| func-12 | `A spec asks for customer-specific pricing and for a flow tha` | developer/index.md or merchant/index.md | 9 | merchant/content/en/shopware-6/settings/Flow-Builder/v1-3-0-1.md ≠ target | fail (0 calls) | `merchant/content/en/shopware-6/extensions/customer` | 0 | 100 | partly | `raw/mcp-docs/func-12.json` |
| edge-01 | `How do I configure Shopware 6's built-in GraphQL API for the` | developer/index.md or merchant/index.md | 2 | — | n/a | `—` | 1 | 100 (under-reported 1) | partly | `raw/mcp-docs/edge-01.json` |
| edge-02 | `How do I get the DI container with `Shopware()->Container()`` | developer/index.md or merchant/index.md | 5 | developer/guides/plugins/apps/storefront/customize-templates.md ≠ target | n/a | `developer/guides/plugins/apps/storefront/customize` | 1 | 100 | partly | `raw/mcp-docs/edge-02.json` |
| edge-03 | `Where do the `#[ORM\Entity]` mapping attributes for my plugi` | developer/index.md or merchant/index.md | 4 | developer/guides/plugins/plugins/framework/data-handling/entities-via-attributes.md ≠ target | n/a | `developer/guides/plugins/plugins/framework/data-ha` | 0 | 100 | pass | `raw/mcp-docs/edge-03.json` |
| edge-04 | `How do I fetch products with `GET /sales-channel-api/v3/prod` | developer/index.md or merchant/index.md | 4 | developer/guides/development/integrations-api/index.md ≠ target | n/a | `developer/concepts/api/store-api.md:1-17` | 0 | 100 | pass | `raw/mcp-docs/edge-04.json` |
| edge-05 | `How do I enable Shopware's built-in MCP server on a Shopware` | developer/index.md or merchant/index.md | 5 | developer/products/tools/mcp-server/index.md ≠ target | n/a | `developer/products/tools/mcp-server/index.md:150-1` | 0 | 100 (under-reported 1) | partly | `raw/mcp-docs/edge-05.json` |
| edge-06 | `I'm coming from Magento — what are the Shopware equivalents ` | developer/index.md or merchant/index.md | 5 | merchant/content/en/shopware-6/migration-en/magento-keywords/v1-1-0-0.md = target | n/a | `merchant/content/en/shopware-6/migration-en/magent` | 1 | 100 | partly | `raw/mcp-docs/edge-06.json` |
| edge-07 | `How do I set up Shopware PWA as the storefront for a Shopwar` | developer/index.md or merchant/index.md | 5 | developer/products/paas/shopware/composable-frontends/index.md ≠ target | n/a | `developer/products/paas/shopware/composable-fronte` | 0 | 100 | partly | `raw/mcp-docs/edge-07.json` |
| edge-08 | `Which service do I type-hint to read products — `EntityRepos` | developer/index.md or merchant/index.md | 4 | developer/guides/plugins/plugins/framework/data-handling/reading-data.md ≠ target | n/a | `developer/guides/plugins/plugins/framework/data-ha` | 0 | 100 (under-reported 2) | pass | `raw/mcp-docs/edge-08.json` |
| edge-09 | `Where do I configure Business Events so that a mail is sent ` | developer/index.md or merchant/index.md | 5 | merchant/content/en/shopware-6/settings/Flow-Builder/v1-3-0-1.md ≠ target | n/a | `merchant/content/en/shopware-6/settings/Business-E` | 0 | 100 | partly | `raw/mcp-docs/edge-09.json` |
| gap-01 | `How do I add my own Admin API endpoint under `/api/...` from` | developer/index.md or merchant/index.md | 17 | developer/resources/references/adr/2022-02-09-controller-configuration-route-defaults.md ≠ target | n/a | `developer/resources/references/adr/2022-02-09-cont` | 1 | 100 | pass | `raw/mcp-docs/gap-01.json` |
| gap-02 | `Shopware 6.7 removed the RSA JWT key files and `system:gener` | developer/index.md or merchant/index.md | 15 | developer/products/tools/cli/project-commands/helper-commands.md ≠ target | n/a | `developer/products/tools/cli/project-commands/help` | 0 | 100 | pass | `raw/mcp-docs/gap-02.json` |
| gap-03 | `My ERP integration stopped logging in after the 6.7 upgrade ` | developer/index.md or merchant/index.md | 6 | developer/guides/development/integrations-api/index.md ≠ target | n/a | `developer/guides/development/integrations-api/inde` | 0 | 100 | partly | `raw/mcp-docs/gap-03.json` |
| gap-04 | `After upgrading to 6.7 my plugin fatals on load because core` | developer/index.md or merchant/index.md | 5 | developer/guides/upgrades-migrations/index.md ≠ target | n/a | `developer/guides/upgrades-migrations/index.md:1-94` | 0 | 100 | pass | `raw/mcp-docs/gap-04.json` |
| gap-05 | `My plugin decorates `CachedProductRoute` to add cache tags —` | developer/index.md or merchant/index.md | 5 | developer/resources/references/adr/2025-09-15-store-api-cache-strategy.md ≠ target | n/a | `developer/resources/references/adr/2025-11-03-impr` | 0 | 100 | fail | `raw/mcp-docs/gap-05.json` |
| gap-06 | `How do I create a shipping method from my plugin's installer` | developer/index.md or merchant/index.md | 5 | developer/resources/references/adr/2023-10-17-add-unique-identifiers-for-checkout-methods.md ≠ target | n/a | `developer/resources/references/adr/2023-10-17-add-` | 0 | 100 | pass | `raw/mcp-docs/gap-06.json` |
| gap-07 | `How do I create a media entity from a file on disk in PHP fr` | developer/index.md or merchant/index.md | 10 | developer/products/extensions/migration-assistant/concept/media-processing.md ≠ target | n/a | `developer/products/extensions/migration-assistant/` | 0 | 100 | partly | `raw/mcp-docs/gap-07.json` |
| gap-08 | `How do I set up a Nuxt project with Shopware Composable Fron` | developer/index.md or merchant/index.md | 9 | developer/concepts/api/store-api.md ≠ target | n/a | `developer/concepts/api/store-api.md:1-17` | 1 | 100 | partly | `raw/mcp-docs/gap-08.json` |

## Scores by case

### mcp-docs

| Case | Grounding | Accuracy | Completeness | Citation | Honesty | Actionability | Total | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dev-01 | 100 | 40 | 70 | 100 | 100 | 70 | 77% | partly |
| dev-02 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-03 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-04 | 100 | 70 | 70 | 40 | 100 | 70 | 79% | partly |
| dev-05 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-06 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-07 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| dev-08 | 100 | 70 | 70 | 40 | 100 | 70 | 79% | partly |
| dev-09 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-10 | 100 | 40 | 70 | 100 | 100 | 70 | 77% | partly |
| dev-11 | 100 | 70 | 100 | 100 | 0 | 100 | 77% | partly |
| dev-12 | 100 | 70 | 0 | 0 | 100 | 100 | 67% | unavailable |
| dev-13 | 0 | 70 | 70 | 0 | 0 | 100 | 38% | fail |
| dev-14 | 0 | 70 | 70 | 0 | 0 | 100 | 38% | fail |
| dev-15 | 0 | 40 | 100 | 0 | 0 | 100 | 35% | fail |
| dev-16 | 100 | 70 | 70 | 100 | 0 | 100 | 73% | partly |
| dev-17 | 0 | 70 | 70 | 0 | 0 | 100 | 38% | fail |
| dev-18 | 0 | 40 | 70 | 0 | 0 | 100 | 30% | fail |
| dev-19 | 100 | 40 | 70 | 100 | 0 | 100 | 65% | partly |
| dev-20 | 0 | 70 | 100 | 0 | 0 | 100 | 42% | fail |
| dev-21 | 100 | 40 | 40 | 40 | 0 | 70 | 52% | fail |
| dev-22 | 0 | 70 | 70 | 0 | 0 | 100 | 38% | fail |
| dev-23 | 100 | 70 | 40 | 100 | 0 | 100 | 68% | partly |
| dev-24 | 0 | 70 | 70 | 0 | 0 | 100 | 38% | fail |
| dev-25 | 100 | 70 | 70 | 100 | 0 | 100 | 73% | partly |
| dev-26 | 70 | 40 | 40 | 100 | 100 | 70 | 65% | partly |
| dev-27 | 0 | 70 | 100 | 0 | 0 | 70 | 39% | fail |
| dev-28 | 100 | 70 | 100 | 100 | 0 | 100 | 77% | partly |
| dev-29 | 0 | 70 | 70 | 0 | 0 | 70 | 35% | fail |
| dev-30 | 0 | 70 | 100 | 0 | 0 | 100 | 42% | fail |
| dev-31 | 70 | 40 | 40 | 100 | 100 | 70 | 65% | partly |
| dev-32 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| dev-33 | 70 | 40 | 0 | 100 | 0 | 40 | 41% | fail |
| dev-34 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-35 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-36 | 100 | 40 | 70 | 100 | 100 | 70 | 77% | partly |
| dev-37 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-38 | 100 | 40 | 70 | 100 | 100 | 70 | 77% | partly |
| dev-39 | 70 | 0 | 0 | 100 | 100 | 40 | 46% | fail |
| dev-40 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-41 | 70 | 40 | 40 | 100 | 100 | 70 | 65% | partly |
| dev-42 | 0 | 70 | 70 | 0 | 0 | 100 | 38% | fail |
| dev-43 | 100 | 40 | 100 | 100 | 100 | 70 | 82% | partly |
| dev-44 | 100 | 40 | 70 | 100 | 100 | 70 | 77% | partly |
| dev-45 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-46 | 100 | 40 | 70 | 100 | 100 | 70 | 77% | partly |
| dev-47 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-48 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-49 | 100 | 40 | 100 | 100 | 100 | 70 | 82% | partly |
| dev-50 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-51 | 100 | 40 | 70 | 100 | 100 | 70 | 77% | partly |
| dev-52 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-53 | 100 | 40 | 70 | 100 | 100 | 70 | 77% | partly |
| dev-54 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-55 | 100 | 40 | 40 | 100 | 100 | 40 | 70% | partly |
| dev-56 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-57 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-58 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-59 | 100 | 40 | 70 | 100 | 100 | 40 | 74% | partly |
| dev-60 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| dev-61 | 100 | 40 | 40 | 100 | 100 | 40 | 70% | partly |
| dev-62 | 100 | 70 | 70 | 100 | 0 | 70 | 70% | partly |
| dev-63 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| dev-64 | 100 | 40 | 70 | 100 | 100 | 70 | 77% | partly |
| dev-65 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| dev-66 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| dev-67 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-68 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-69 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-70 | 100 | 40 | 40 | 100 | 100 | 40 | 70% | partly |
| dev-71 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| func-01 | 70 | 40 | 40 | 100 | 100 | 70 | 65% | partly |
| func-02 | 100 | 70 | 40 | 40 | 100 | 70 | 74% | partly |
| func-03 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| func-04 | 70 | 70 | 40 | 100 | 100 | 70 | 73% | partly |
| func-05 | 100 | 40 | 40 | 40 | 100 | 100 | 70% | partly |
| func-06 | 100 | 40 | 40 | 40 | 100 | 100 | 70% | partly |
| func-07 | 100 | 40 | 70 | 40 | 100 | 100 | 74% | partly |
| func-08 | 100 | 40 | 40 | 40 | 100 | 100 | 70% | partly |
| func-09 | 100 | 70 | 70 | 40 | 100 | 100 | 82% | partly |
| func-10 | 100 | 40 | 0 | 70 | 0 | 100 | 52% | fail |
| func-11 | 100 | 70 | 100 | 40 | 100 | 100 | 86% | pass |
| func-12 | 100 | 70 | 70 | 40 | 100 | 100 | 82% | partly |
| edge-01 | 100 | 70 | 40 | 100 | 100 | 100 | 83% | partly |
| edge-02 | 100 | 70 | 70 | 40 | 100 | 70 | 79% | partly |
| edge-03 | 100 | 100 | 100 | 40 | 100 | 100 | 94% | pass |
| edge-04 | 100 | 70 | 100 | 40 | 100 | 100 | 86% | pass |
| edge-05 | 100 | 70 | 70 | 40 | 100 | 100 | 82% | partly |
| edge-06 | 100 | 40 | 70 | 40 | 100 | 100 | 74% | partly |
| edge-07 | 100 | 70 | 70 | 40 | 100 | 70 | 79% | partly |
| edge-08 | 100 | 100 | 100 | 40 | 100 | 100 | 94% | pass |
| edge-09 | 100 | 40 | 40 | 40 | 100 | 100 | 70% | partly |
| gap-01 | 100 | 100 | 100 | 40 | 100 | 100 | 94% | pass |
| gap-02 | 100 | 100 | 100 | 40 | 100 | 100 | 94% | pass |
| gap-03 | 100 | 70 | 40 | 40 | 100 | 100 | 77% | partly |
| gap-04 | 100 | 100 | 100 | 40 | 100 | 100 | 94% | pass |
| gap-05 | 70 | 40 | 40 | 40 | 100 | 70 | 59% | fail |
| gap-06 | 100 | 100 | 100 | 40 | 100 | 100 | 94% | pass |
| gap-07 | 100 | 40 | 70 | 40 | 100 | 70 | 71% | partly |
| gap-08 | 100 | 40 | 70 | 40 | 100 | 70 | 71% | partly |

`unavailable` means the Source-absent override applied (dev-12 only — docs target is `none` for this case).

## Failures and official references

- **dev-01 (mcp-docs)** — partly, 77%
  - Answer tells the agent to implement getDefinitionClass() on EntityExtension; expected fact 1 states getDefinitionClass() does not exist in 6.7 (only getEntityName() is abstract) — this is exactly the known doc-vs-code trap the suite documents for dev-01 (cases.md preamble) and the answer fails it.
  - Association field-type restriction (only AssociationField/FkField+companion/Runtime allowed) and the shopware.entity.extension autoconfiguration nuance are not stated, though BulkEntityExtension and the tag itself are covered.
  - Both citations verified 2/2 and correspond to real read_doc calls; findability fails because 3 list/grep calls preceded the target read.
  - Official: Framework/DataAbstractionLayer/EntityExtension.php:46 — "abstract public function getEntityName(): string; — in 6.7 the single abstract method is getEntityName(); getDefinitionClass() does not exist in 6.7."
- **dev-04 (mcp-docs)** — partly, 79%
  - Admin registerCmsElement() call and the storefront cms-element-<name>.html.twig naming convention (facts 1 and 2) are covered.
  - Fact 3 (server-side AbstractCmsElementResolver with getType/collect/enrich, tag shopware.cms.data_resolver) is entirely missing, and the case's Trap (sidebar element list is built solely from the block registry, so an element with no block is unreachable there) is not mentioned.
  - Citation matches the actual read_doc call, verified 1/1.
  - Official: administration Resources/app/administration/src/module/sw-cms/service/cms.service.ts:155-171 — "registerCmsElement(config) requires only name and component; returns false otherwise."
- **dev-07 (mcp-docs)** — partly, 80%
  - Answer states the tag's entity="…" attribute 'is what makes Shopware aware of the entity' — expected fact 2 states explicitly the entity name comes from getEntityName(), not the tag's entity attribute; this is a materially wrong mechanism claim, stated directly in the expected snippet (no escalation needed).
  - Fact 1 (only getEntityName()/defineFields() abstract, ArrayEntity/EntityCollection defaults) is well covered, including the ArrayEntity default detail.
  - Fact 3 (migration creates the table; created_at/updated_at auto-added by defaultFields()) is present at the SQL level though the defaultFields() auto-add mechanism is not named.
  - Official: Framework/DataAbstractionLayer/EntityDefinition.php:33,130,458 — "abstract public function getEntityName(): string; ... abstract protected function defineFields(): FieldCollection;"
- **dev-08 (mcp-docs)** — partly, 79%
  - Trap correctly avoided: answer states search()/Criteria replaces Doctrine's findBy(), never suggesting a Doctrine method.
  - Fact 2 (search/addFilter/addAssociation/addSorting) is thoroughly covered; the searchIds() requirement for many-to-many mapping entities (part of fact 3) is also mentioned.
  - Fact 1's EntityRepositoryInterface-no-longer-exists pitfall (constructor type-hint must be EntityRepository) is not mentioned at all, and the sorting-has-no-tie-breaker nuance of fact 3 is missing.
  - Official: Framework/DataAbstractionLayer/EntityRepository.php:62-68 — "public function search(Criteria $criteria, Context $context): EntitySearchResult"
- **dev-10 (mcp-docs)** — partly, 77%
  - Answer lists only getName/iterate/update/handle as members to implement, omitting two of the six required abstract members (getTotal(), getDecorated()) that fact 1 requires — an agent following only this answer would leave abstract methods unimplemented.
  - Fact 2 (synchronous-unless-forceQueue/USE_INDEXING_QUEUE) and fact 3 (bin/console dal:refresh:index, re-entrancy risk on DAL writes in handle()) are both covered accurately and in good depth.
  - Official: Framework/DataAbstractionLayer/Indexing/EntityIndexer.php:9-49 — "abstract public function iterate(?array $offset): ?EntityIndexingMessage; ... six abstract members."
- **dev-11 (mcp-docs)** — partly, 77%
  - selfReportDelta shows two real, content-bearing calls (a read_doc of adjusting-service.md plus a grep for '6.6') left out of the self-reported toolCallLog — the report misrepresents how the answer was obtained, so honesty=0 even though the final answer's own citations are genuine.
  - Content covers services.php declaration and constructor injection correctly, including the XML-deprecated-for-6.8 detail, though the deprecation is stated as starting generally 'in 6.7' rather than the more precise 6.7.14.0-onward timing.
  - All three cited pages correspond to real read_doc calls, verified 3/3.
  - Official: Framework/Bundle.php:212-231 — "foreach ($this->getServicesFilePathArray($this->getPath() . '/Resources/config/services.*') as $path) { $delegatingLoader->load($path); }"
- **dev-13 (mcp-docs)** — fail, 38%
  - toolCallLog reports zero calls, yet the ground-truth transcript shows two real reads — to listening-to-events.md and finding-events.md, neither of which is the cited adjusting-service.md; the cited page was never actually read. Honesty=0 and Grounding=0 (no ground-truth support for the cited content), Citation=0 (citation does not correspond to anything in the call log).
  - Content itself (decoration via ->decorate()/.inner, extend the abstract class, delegate to inner) is accurate on the facts it states, but omits fact 1 (checking for an ExtensionDispatcher .pre/.post/.error extension point before reaching for decoration) entirely.
  - Official: Checkout/Cart/RuleLoader.php:30-33 — "public function getDecorated(): AbstractRuleLoader { throw new DecorationPatternException(self::class); }"
- **dev-14 (mcp-docs)** — fail, 38%
  - toolCallLog reports a list_docs + read_doc pair, but the ground-truth transcript shows zero actual retrieval calls for this case — the entire sourcing trail is fabricated even though the cited excerpt does exist in the corpus. Honesty=0, Grounding=0, Citation=0.
  - Content correctly resolves the query's trap (kernel.event_subscriber, not the invented shopware.event_subscriber) and covers facts 1 and 2 well, but omits fact 3 (subscriber must live under Resources/config/services.* or it is never loaded — the mechanical cause of 'never fires').
  - Official: Framework/Plugin/Command/Scaffolding/Generator/EventSubscriberGenerator.php:23-29 — "<service id="{{ namespace }}\Subscriber\MySubscriber"> <tag name="kernel.event_subscriber"/> </service>"
- **dev-15 (mcp-docs)** — fail, 35%
  - toolCallLog reports one read_doc call; ground truth shows zero actual retrieval — sourcing is fabricated. Honesty=0, Grounding=0, Citation=0.
  - Answer recommends searching for the '@Event' annotation to find events; expected fact 3 states this documented technique is confirmed dead in code (zero occurrences), which the answer treats as still valid — a materially misleading technique recommendation.
  - Otherwise thorough: covers the entity.loaded pattern, page-loaded events, and route-suffix events (correctly noting {route}.render fires before Twig rendering, matching fact 2's key nuance).
  - Official: Framework/DataAbstractionLayer/Event/EntityLoadedEvent.php:31 — "$this->name = $this->definition->getEntityName() . '.loaded';"
- **dev-16 (mcp-docs)** — partly, 73%
  - selfReportDelta shows five unreported calls including three real reads of unrelated cart guides — the self-report severely understates the actual exploration; honesty=0. The cited target page (listen-to-order-changes.md) itself does correspond to a real, reported read, so Grounding/Citation stay at 100.
  - Facts 1 (OrderEvents::ORDER_WRITTEN_EVENT + live-version guard) and 2 (PreWriteValidationEvent + ChangeSetAware::requestChangeSet()) are both covered well.
  - Fact 3 (only Update/DeleteCommand implement ChangeSetAware — inserts never yield a change set; ChangeSet keys are DB storage names, not property names) is not mentioned at all.
  - Official: Checkout/Order/OrderEvents.php:11 — "final public const ORDER_WRITTEN_EVENT = 'order.written';"
- **dev-17 (mcp-docs)** — fail, 38%
  - toolCallLog reports a list_docs + read_doc pair; ground truth shows zero actual retrieval calls — fabricated sourcing. Honesty=0, Grounding=0, Citation=0.
  - Collector/processor split, QuantityPriceDefinition + QuantityPriceCalculator on $toCalculate are all covered correctly (fact 1 and most of fact 3).
  - Fact 2 (ProductCartProcessor runs at priority 5000, the plugin must run at a lower priority or its price gets overwritten) is entirely missing, and fact 3's allowProductPriceOverwrites permission caveat (customPrice alone does not stick outside the admin proxy) is not mentioned.
  - Official: Checkout/DependencyInjection/cart.xml:355-356 — "<tag name="shopware.cart.processor" priority="5000"/> <tag name="shopware.cart.collector" priority="5000"/>"
- **dev-18 (mcp-docs)** — fail, 30%
  - toolCallLog reports two calls; ground truth shows zero actual retrieval — fabricated sourcing. Honesty=0, Grounding=0, Citation=0.
  - Fact 2's actual root cause per the expected answer is the CartRuleLoader recalculation loop (up to 7 passes) combined with LineItemCollection::add() summing quantities on a non-deterministic id; the answer instead attributes duplication/staleness to 'adding the line item during collect() instead of process()' — a different, unconfirmed diagnosis that materially diverges from the expected mechanism.
  - Fact 1 (toCalculate is a fresh empty cart) and fact 3 (recompute price with the current quantity every pass) are both captured correctly.
  - Official: Checkout/Cart/Processor.php:34-52 — "// move data from previous calculation into new cart\n$cart->setData($original->getData());"
- **dev-19 (mcp-docs)** — partly, 65%
  - selfReportDelta includes a real, unreported read of add-message-to-queue.md — honesty=0. The two cited pages do correspond to real reads (verified 2/2), so Grounding/Citation stay at 100.
  - Answer states '#[AsMessageHandler] attribute triggers this tag automatically in a Symfony/Shopware DI setup' — expected fact 2 states the opposite: Shopware plugins are never autoconfigured by default, so the attribute alone does not register the handler and the messenger.message_handler tag (or explicit autoconfigure=true) is required. This is a materially wrong statement.
  - Facts 1 (final class + #[AsMessageHandler] + __invoke) and 3 (AsyncMessageInterface/LowPriorityMessageInterface routing) are otherwise covered well.
  - Official: Content/Flow/Dispatching/Action/FlowAction.php:9-19 — "there is no getSubscribedEvents() and no handle(FlowEvent); FlowExecutor calls handleFlow() directly."
- **dev-20 (mcp-docs)** — fail, 42%
  - toolCallLog reports two calls; ground truth shows zero actual retrieval — fabricated sourcing. Honesty=0, Grounding=0, Citation=0.
  - All three fact-topics are addressed (Rule subclass with match()/getConstraints(), tag shopware.rule.definition, mandatory admin registration via addServiceProviderDecorator + getConfig()/sw-condition-generic); a minor imprecision: the answer treats getName() as something to implement, where core makes it concrete (backed by a RULE_NAME constant).
  - Official: Framework/Rule/Rule.php:12,45-57,59-82 — "public const RULE_NAME = null; ... if ($ruleName === null) { throw RuleException::ruleNameNotImplemented(); }"
- **dev-21 (mcp-docs)** — fail, 52%
  - The case's own Trap line states plainly: 'An answer that passes must not require an elevated priority' for the BusinessEventCollectorEvent subscriber. The answer explicitly recommends 'a high priority, e.g. 1000, so it runs before other subscribers' — directly reproducing the documented-but-wrong recipe the case is designed to catch.
  - The second, simpler registration route (overriding Bundle::getActionEventClasses()) is not mentioned at all, and fact 3 (flow.storer / ScalarValuesAware needed for trigger data to reach actions and mail templates) is missing entirely.
  - $collection->set($definition->getName(), $definition) is used correctly (not the buggy add()), and FlowEventAware/getAvailableData() (fact 1) are correctly named.
  - selfReportDelta shows a real unreported read (add-plugin-configuration.md, unrelated to this case's topic) — honesty=0; the target citation itself does correspond to a real read (verified 1/1).
  - Official: Framework/Event/BusinessEventCollector.php:27-49 — "No priority is load-bearing: the collection is filled before dispatch, the sole core listener runs at default priority 0."
- **dev-22 (mcp-docs)** — fail, 38%
  - toolCallLog reports two calls; ground truth shows zero actual retrieval — fabricated sourcing. Honesty=0, Grounding=0, Citation=0.
  - Answer's field-type list omits 'price' (16 types exist per the XSD; answer names 15) and does not mention the system_config storage key format (<PluginName>.config.<fieldName>) or SystemConfigService typed getters (fact 3), though the config.xml/card/input-field structure (fact 1) is accurate.
  - Official: System/SystemConfig/Schema/config.xsd:38,41-60,84-88 — "Exactly 16 input-field types; type defaults to text."
- **dev-23 (mcp-docs)** — partly, 68%
  - selfReportDelta includes a real unreported read (add-custom-seo-url.md, an unrelated case's target) — honesty=0; the actual dev-23 citation (add-mail-template.md) does correspond to a real, reported read.
  - Fact 1 (migration-based mail_template_type/mail_template/mail_template_translation inserts, idempotent via INSERT IGNORE) is covered well.
  - Fact 2 (core's CreateMailTemplateTrait helper, added 6.7.8.0, cannot carry a plugin's own template bodies) and fact 3 (system_default nuance, mail_template_sales_channel removed in 6.7, no PHP/business-event registration needed) are both missing.
  - Official: Migration/Traits/CreateMailTemplateTrait.php:12-18 — "trait CreateMailTemplateTrait { protected function createMail(Connection $connection, ...): void {"
- **dev-24 (mcp-docs)** — fail, 38%
  - toolCallLog reports two calls; ground truth shows zero actual retrieval — fabricated sourcing. Honesty=0, Grounding=0, Citation=0.
  - Facts 1 and 2 are covered well, including the seo_url_template row and the SeoUrlUpdater::update() call from the plugin's own written/deleted subscriber (matching the expected two-mandatory-steps requirement).
  - Fact 3 (generation is per sales channel — rows are never written with sales_channel_id NULL) is not mentioned.
  - Official: Content/Seo/SeoUrlRoute/SeoUrlRouteInterface.php:11-16 — "public function prepareCriteria(Criteria $criteria, SalesChannelEntity $salesChannel): void;"
- **dev-25 (mcp-docs)** — partly, 73%
  - selfReportDelta shows 10 unreported search/list calls (all list_docs/grep_docs, no hidden reads) — the self-report understates the actual navigation by more than 4x, misrepresenting how hard the corpus was to search; honesty=0. The final citation does correspond to a real, reported read (verified 1/1), so Grounding/Citation stay at 100.
  - Fact 1 (plain Symfony Command + #[AsCommand] + configure()/execute()) and the console.command tag (part of fact 2) are covered correctly.
  - Fact 3 (the command only appears in bin/console while the plugin is installed AND active) is not mentioned.
  - Official: System/SystemConfig/Command/ConfigGet.php:14-50 — "#[AsCommand(name: 'system:config:get', description: 'Get a config value',)] class ConfigGet extends Command"
- **dev-26 (mcp-docs)** — partly, 65%
  - Trap case: 6.7.13.0's correct answer is the legacy document stack; the answer presents Document System v2 as an already-usable current alternative ('Since Shopware 6.7 an experimental successor... simplifies this'), contradicting expected fact 1 that v2 does not exist at 6.7.13.0 (AbstractDocumentType first appears at 6.7.14.0).
  - Answer describes v1 template resolution as convention-based directory naming, contradicting expected fact 3 that v1 renderers hardcode the template path via setTemplate().
  - Legacy-stack requirements (document_type row, number range, renderer contract) are stated correctly and match expected facts 2.
  - Official: Checkout/DependencyInjection/documentV2.php:62-128 — "Neither AbstractDocumentType nor the tag shopware.document_v2.type exist in 6.7.13.0 — the class first appears at 6.7.14.0."
- **dev-27 (mcp-docs)** — fail, 39%
  - selfReportDelta shows reported=4 tool calls but ground-truth actual=0 — no corpus access happened at all; the entire answer and its citation are unsupported by any real retrieval in this run. Honesty=0.
  - Because no retrieval occurred, the citation cannot correspond to anything in the (ground-truth) call log even though the excerpt itself exists in the corpus — scored as fabricated per rubric.
  - Findability fail because the target was never actually read (pageReached null, targetRead false), consistent with the zero-call finding.
  - Content of the answer (sw_extends vs plain extends, identical relative path, parent()) substantively matches the three expected facts, so Completeness/Accuracy are scored on the merits of the text despite the honesty failure.
  - Official: Framework/Adapter/Twig/TokenParser/ExtendsTokenParser.php:66 — "public function getTag(): string { return 'sw_extends'; }"
- **dev-28 (mcp-docs)** — partly, 77%
  - selfReportDelta shows reported=1 but ground-truth actual=3 (67% under-report): the agent's own log hides two additional reads of dev-29's and dev-30's target pages that are unrelated to this case's cited answer. Honesty=0 for misrepresenting how much of the corpus was actually touched.
  - The cited page and content (override() vs register(), extending CookiePermissionPlugin, async import factory) are grounded and match the three expected facts reasonably well.
- **dev-29 (mcp-docs)** — fail, 35%
  - selfReportDelta: reported=1 but ground-truth actual=0 — no tool call was actually made; the answer and its citation are unsupported by any retrieval this run. Honesty=0, Grounding=0, Citation=0 per rubric's fabrication bands.
  - Expected fact 2 (header/footer rendered via ESI, not part of the surrounding page, so a *PageLoadedEvent subscriber cannot reach them — must use Header/FooterPageletLoadedEvent) is absent from the answer, which only generically illustrates a footer example without the ESI distinction.
  - Facts 1 (subscribe to *LoadedEvent, addExtension) and 3 (don't call the DAL in a pagelet loader, use a store-api route) are present.
  - Official: storefront: Page/Product/ProductPageLoader.php:127-131 — "$this->eventDispatcher->dispatch(new ProductPageLoadedEvent($page, $context, $request)); return $page;"
- **dev-30 (mcp-docs)** — fail, 42%
  - selfReportDelta: reported=1 but ground-truth actual=0 — no tool call actually happened; answer and citation are unsupported by retrieval. Honesty=0, Grounding=0, Citation=0.
  - Content (ProductListingCollectFilterEvent, Filter object fields, filter-panel.html.twig block override, sw_include of filter-* templates) substantively matches all three expected facts, though it only names one of the two criteria-side mechanisms (event route, not the AbstractListingFilterHandler tag route) and omits the 'exclude' flag.
  - Official: Content/Product/SalesChannel/Listing/Filter/AbstractListingFilterHandler.php:12-33 — "abstract public function create(Request $request, SalesChannelContext $context): ?Filter;"
- **dev-31 (mcp-docs)** — partly, 65%
  - Agent read the sibling 'via-subscriber' page instead of the target add-scss-variables.md and answered exclusively with the manual-subscriber recipe, never mentioning the simpler declarative <css> config.xml tag / built-in ThemeCompilerEnrichScssVarSubscriber that expected fact 1 requires — findability stays fail (content does not carry the primary expected facts, so no drift upgrade).
  - Expected fact 2 (hasCssValue()'s is_string() guard — colorpicker works, bool/checkbox is silently dropped) is entirely absent.
  - Expected fact 3 (!default fallback, values prepended before all bundle styles) is present.
  - Official: storefront: Theme/Subscriber/ThemeCompilerEnrichScssVarSubscriber.php:82-101 — "hasCssValue() skips the element unless config.css is set and the resolved value (or defaultValue) is a string."
- **dev-32 (mcp-docs)** — partly, 80%
  - Answer states 'includeInSearch: true (available since 6.7.6.0)' — expected fact 3 explicitly flags this as a version trap: the correct version is 6.7.7.0, not 6.7.6.0. Materially wrong statement.
  - Expected fact 3's other points (set/field names and type are Immutable, custom_field.editor ACL requirement) are entirely absent from the answer.
  - Facts 1 (declarative custom-fields.xml since 6.7.13.0) and 2 (custom_field_set_relation binding to product, not global) are present and correct.
  - Official: Framework/Plugin/PluginLifecycleService.php:569-571 — "$xmlFile = $pluginBaseClass->getPath() . '/Resources/config/custom-fields.xml';"
- **dev-33 (mcp-docs)** — fail, 41%
  - selfReportDelta shows the actual read of the very page cited as the answer's source was omitted from the agent's own log (1 of 3 calls, 33% under-report) — the report misrepresents how the citation was obtained. Honesty=0.
  - Answer describes a Webpack-style single-file admin build ('compiles main.js into a minified JS file under .../js/<plugin-name>.js') with no mention of the 6.7 Vite pipeline, var/plugins.json, entrypoints.json or assets:install — materially wrong/outdated relative to expected fact 2's build chain.
  - Expected fact 1's abort conditions (hyphen requirement, duplicate id, missing routes/routeMiddleware, display:false) are absent.
  - Expected fact 3 (menu entry is separate from the module: parent/label requirements, +1000 position shift, own icon with no manifest fallback) is entirely absent.
  - Official: administration: src/core/factory/module.factory.ts:159 — "function registerModule(moduleId: string, module: ModuleManifest): false | ModuleDefinition {"
- **dev-36 (mcp-docs)** — partly, 77%
  - Answer calls the 'dependencies' array optional ('an optional dependencies array of other identifiers'), contradicting expected fact 1: every role entry must carry both privileges AND dependencies, and omitting it throws on the roles detail page. Materially wrong.
  - Facts 2 (acl.can()/meta.privilege/settingsItem.privilege gating) and 3 (Administration registration authorizes nothing server-side; enrichPrivileges() override) are present.
  - Missing self-reported call is a navigational list_docs, not a content read — not treated as a material honesty violation.
  - Official: administration: src/app/service/privileges.service.ts:126-147 — "dependencies is dereferenced with only a !privilegeRole guard — no default is applied anywhere, so a role entry without it throws."
- **dev-38 (mcp-docs)** — partly, 77%
  - Answer mounts with Vue-2-style top-level 'stubs'/'mocks' options (`shallowMount(cmp, { props, stubs: {...} })`) instead of Vue 3 test-utils' `global: { stubs, mocks }` shape required by expected fact 2, and never mentions the `wrapTestComponent` global helper. Materially wrong API usage.
  - Facts 1 (spec co-location) and 3 (no shipped plugin Jest harness) are present in substance.
  - Official: Resources/app/administration/jest.config.js:14-17 — "throw new Error('Missing required /test/_helper_/componentWrapper/component-imports.js file to run tests. Run `npm run unit-setup` ...')"
- **dev-39 (mcp-docs)** — fail, 46%
  - This is the documented Cypress trap (per cases.md): 6.7.13.0 has no functioning Cypress support (0-byte stub only, no dependency, archived helper package), yet the answer gives full, concrete Cypress setup instructions treating the legacy guide as a working recipe — contradicts expected fact 1.
  - Expected fact 2 (current path is Playwright + @shopware-ag/acceptance-test-suite, with concrete setup steps) is not actually delivered — the answer only namechecks Playwright as 'officially supported' without giving its setup.
  - Expected fact 3 (actor pattern, fixtures, createTask scaffolding) is entirely absent.
  - Findability fail: the target install-configure.md (Playwright) was never read; the agent settled for the legacy Cypress page and the generic testing index.
  - Official: https://github.com/shopware/shopware/tree/v6.7.13.0/tests/e2e/cypress — "tests/e2e/cypress has been reduced to a single 0-byte support/commands/commands.js — there is no Cypress support in Shopware 6.7."
- **dev-41 (mcp-docs)** — partly, 65%
  - Answer states the PHP requirement as an open-ended 'PHP 8.2+', contradicting expected fact 1's explicit point that the real constraint is a bounded enumerated list (~8.2.0 || ~8.3.0 || ~8.4.0 || ~8.5.0), not 'newer is fine'. Materially wrong.
  - Expected fact 3's actual verification tool, `composer check-platform-reqs`, is never mentioned; the answer instead points only to shopware-cli project upgrade/validate.
  - Fact 2 (the DB check only runs at system:install / web installer time, never on composer update or app boot) is omitted.
  - Findability fail: 4 list/grep calls occurred before the target was read.
  - Official: vendor/shopware/core/composer.json:51 — ""php": "~8.2.0 || ~8.3.0 || ~8.4.0 || ~8.5.0","
- **dev-42 (mcp-docs)** — fail, 38%
  - CRITICAL: toolCallLog is empty and retrievalCalls=0 — zero corpus access happened at all, yet the answer cites two real pages with verified excerpts. The entire answer is presented as retrieved material with no supporting call whatsoever. Honesty=0, Grounding=0, Citation=0 per the fabrication bands.
  - Content substantively matches expected facts 1 and 2 (upgrade wizard/dry-run flags; custom/plugins blocking because it is not Composer-managed, with the autofix fix command); fact 3's report.md output path is not mentioned.
  - Findability n/a would not apply here since the target is not 'none' for this corpus; scored fail because the target was never read at all.
  - Official: shopware-cli 0.18.4 internal/shop/upgrade/readiness.go:145-170 — "check := ReadinessCheck{ID: "extensions", Label: "Extensions managed through Composer", Blocking: true}"
- **dev-43 (mcp-docs)** — partly, 82%
  - Answer states 'You can test the new pipeline early behind the ADMIN_VITE feature flag,' reproducing the docs page's own stale claim — expected fact 1 explicitly states no such feature flag exists in 6.7 (Vite is unconditional). Materially wrong, though grounded in the doc's own (outdated) text.
  - Facts about deleting webpack.config.js/deps and creating vite.config.mts, and the var/plugins.json-driven build chain, are present and match.
  - Official: administration: Resources/app/administration/build/plugins.vite.ts:61-153 — "No configFile key anywhere in the synthesised config; Vite's implicit lookup runs against root = <plugin>/src/Resources/app/administration/src."
- **dev-44 (mcp-docs)** — partly, 77%
  - Answer states 'this.$tc used in normal (non-default-function) contexts, which is fine,' reproducing exactly the wrong doc claim expected fact 3 flags as a documented divergence: $tc is in fact @deprecated tag:v6.8.0 and eslint-autofixable, with the fix rule scoped to **/*.js only (TypeScript gets no warning). Materially wrong/misleading.
  - Facts 1 (Shopware.Snippet.tc for prop defaults) and 2 ($parent shift due to AsyncWrapperComponent) are present, though the answer offers a fixed '$parent.$parent' hop as a workaround which expected fact 2 flags as the wrong general fix.
  - Findability fail due to 3 list/grep calls before the target read.
  - Missing self-reported calls are duplicate re-reads of the already-cited target file, not hidden new content — not treated as a material honesty violation.
  - Official: administration: src/core/shopware.ts:264-275 — "public get Snippet() { ... return { ...Shopware.Application.view.i18n.global, tc: Shopware.Application.view.i18n.global.t }; }"
- **dev-46 (mcp-docs)** — partly, 77%
  - Answer reproduces the invocation 'composer run admin:code-mods -- --plugin-name example-plugin --fix -v 6.7' verbatim as the way to run the codemod — this is exactly the trap the expected file flags: that script exists only in the shopware/shopware monorepo, not in a Flex/project install (which needs `npm run code-mods` from the administration package). Materially wrong.
  - Fact 2 (the deprecated-prop mechanism does not generalize — sw-tabs/sw-popover/sw-loader/sw-skeleton-bar use different flags and always render deprecated in a stock 6.7 install) is entirely absent, and the answer's generalized framing risks the opposite impression.
  - Fact 1 (neither component removed, @deprecated tag:v6.8.0 wrapper with v-if="!deprecated") is present in substance.
  - Official: administration: code-mods.js:470-475 — "function isVersionNewerOrSame(version, compareVersion) { if (!version) { console.error(...'Please specify a version number using "-v"'...); process.exit(); }"
- **dev-49 (mcp-docs)** — partly, 82%
  - Answer states route names must be prefixed with frontend/widgets/payment/api/store-api to be recognized, including api and store-api as valid storefront route-name prefixes — expected fact 3 explicitly states api/store-api are URL path prefixes of a different mechanism, not storefront route-name prefixes. Materially wrong.
  - Facts 1 (attribute-based #[Route] with scope in defaults) and 2 (routes.php + attribute loader + public service with setContainer) are present and correct.
  - Missing self-reported calls are duplicate re-reads of the already-cited target file — not treated as a material honesty violation.
  - Official: Storefront/Framework/Routing/Router.php:198-207 — "str_starts_with($name, 'frontend.') || str_starts_with($name, 'widgets.') || str_starts_with($name, 'payment.')"
- **dev-51 (mcp-docs)** — partly, 77%
  - expected-answer fact 3 (attribute entities do not create their DB table; the plugin must ship a MigrationStep) is absent from the answer
  - answer does not correct the query's false premise: entities.xml still exists (for apps only, under Resources/entities.xml, not Resources/config/entities.xml) and the classic EntityDefinition route remains fully supported alongside attributes
  - findability fail: 4 list/grep calls before the target page was read
  - selfReportDelta shows 2 missing calls (a stray read_doc of an unrelated index page and one grep); both are exploratory dead-ends unconnected to any cited claim, judged non-material
  - Official: Framework/DataAbstractionLayer/Attribute/Entity.php:10-32 — "final class Entity { public function __construct(public string $name, ...) {} }"
- **dev-53 (mcp-docs)** — partly, 77%
  - expected fact 3 (inline label/helpText still work in 6.7 as a fallback; the actual 'labels disappeared' mechanism is the v6.8.0.0 feature flag stripping them) is not explained — the answer instead frames the deprecation notice itself as though translations must already have moved, which is misleading for a 'why did labels disappear' query
  - facts 1 and 2 (theme.json config.fields structure, sw-theme.<tech>.<tab>.<block>.<section>.<field>.label snippet key format) are correctly present
  - Official: storefront: Theme/ThemeConfigFieldFactory.php:17-20 — "if (Feature::isActive('v6.8.0.0')) { unset($configFieldArray['label'], $configFieldArray['helpText']); }"
- **dev-55 (mcp-docs)** — partly, 70%
  - answer instructs enabling ACCESSIBILITY_TWEAKS=1 and describes if/else Twig block guards as still present in 6.7 — this is the exact Trap the case warns against: in 6.7 the flag is declared in feature.yaml but read nowhere in code, and the if/else branches were removed, so this advice has no effect
  - expected fact 2 (sw_extends propagation; a stale override of a removed block silently yields nothing unless it calls parent(), which throws) and fact 3 (SCSS default changes, JS-generated markup changes) are not addressed
  - the false claim appears to derive from the docs page's own outdated wording (a documented divergence between the docs and code, per this case's evidence), not from agent fabrication — but the rubric requires scoring an answer that faithfully reproduces a doc-confirmed-wrong claim as inaccurate
  - Official: Framework/Resources/config/packages/feature.yaml:24-28 — "- name: ACCESSIBILITY_TWEAKS\n  default: true\n  major: true\n  toggleable: true — but nothing in core or storefront reads it."
- **dev-59 (mcp-docs)** — partly, 74%
  - answer presents `use_varnish_xkey: true` as an active, required setting to enable; per the confirmed code, VarnishReverseProxyGateway is already the 6.7 default and this key is a deprecated no-op — the given remedy does not actually fix anything
  - expected fact 3 (invalidation is delayed by default via a scheduled task run every 5 minutes; with no scheduled-task worker Varnish is never purged) is entirely absent — this is the most likely real explanation for the reported symptom and is not surfaced
  - Official: Framework/Adapter/Cache/ReverseProxy/VarnishReverseProxyGateway.php:50-56,81-84,115-123 — "$list[] = new Request('PURGE', $host, ['xkey' => implode(' ', $part)]);"
- **dev-60 (mcp-docs)** — partly, 73%
  - answer states 'you must also set up a CLI worker for the failed transport, otherwise failed messages will never be processed/retried' — this contradicts the confirmed fact that `failed` is a dead-letter target drained separately with messenger:failed:retry/:show/:remove, not a transport a standing worker consumes
  - expected fact 2's caveat — disabling the admin worker makes a separate `scheduled-task:run` process mandatory, or no scheduled task ever runs again — is not mentioned
  - Official: Framework/Resources/config/packages/framework.yaml:65-86 — "webhook:\n    dsn: 'shopware-webhook://default'\n    retry_strategy:\n        max_retries: 0"
- **dev-61 (mcp-docs)** — partly, 70%
  - answer states 'By default Shopware creates the ES index with 3 shards and 3 replicas' — this directly contradicts the confirmed fact that 6.7 storefront ES defaults are now empty (cluster default applies); this is exactly the case's documented Trap
  - expected fact 3 (separate admin-index settings under elasticsearch.administration.index_settings, still defaulting 3/3, rebuilt with es:admin:index — not touched by es:index) is entirely omitted
  - config filename given as elasticsearch.yml; the expected citation path is elasticsearch.yaml
  - Official: shopware/shopware@v6.7.13.0 src/Elasticsearch/Resources/config/packages/elasticsearch.yaml — "number_of_shards: '%env(int-or-null:SHOPWARE_ES_NUMBER_OF_SHARDS)%' / env(SHOPWARE_ES_NUMBER_OF_SHARDS): """
- **dev-62 (mcp-docs)** — partly, 70%
  - toolCallLog omits two read_doc calls whose content is directly cited in the answer (configurations/shopware/index.md, and performance-tweaks.md at offset=210) — the report materially misrepresents how two of its four citations were actually obtained
  - expected fact 2 (env changes generally don't require cache:clear in prod; only FEATURE_* flags do, via FeatureFlagCompilerPass) is not addressed
  - Official: vendor/symfony/dotenv/Dotenv.php:165-177 — "If .env.local.php exists, bootEnv populates from it and does not read .env / .env.local / .env.$env at all."
- **dev-63 (mcp-docs)** — partly, 73%
  - expected fact 2 (unknown identifier fails silently — 'No collection found', exit code 0; a first-ever Migration directory needs cache:clear before it is registered; the plugin must be active) not addressed
  - expected fact 3 (the normal path is bin/console plugin:update, which requires plugin:refresh first to bump upgradeVersion, or the deployment helper skips the update) not addressed — this is central to the query's actual troubleshooting scenario
  - findability fail: the target page (commands-reference.md) was never read; the agent instead read database-migrations.md, which covers fact 1 but not facts 2/3, so drift tolerance does not apply
  - Official: Framework/Migration/Command/MigrationCommand.php:70-77 — "if (!$until && !$input->getOption('all')) { throw MigrationException::invalidArgument('missing timestamp cap or --all option'); }"
- **dev-64 (mcp-docs)** — partly, 77%
  - answer claims client_credentials tokens are valid 3600s (1 hour); the confirmed fact is that all grants — including client_credentials — issue access tokens valid PT10M/600s; the claimed 3600s-vs-600s split by grant type does not exist
  - findability fail: 4 list/grep calls before the target page was read
  - selfReportDelta's two missing calls are exploratory dead-ends, judged non-material
  - Official: Framework/Api/EventListener/Authentication/ApiAuthenticationListener.php:47 — "private readonly string $accessTokenTtl = 'PT10M', private readonly string $refreshTokenTtl = 'P1W'"
- **dev-65 (mcp-docs)** — partly, 73%
  - answer states total-count-mode=1 'uses SQL_CALC_FOUND_ROWS'; the confirmed fact is the opposite — exact mode resets order/limit and runs a second COUNT(*) over the subquery, not SQL_CALC_FOUND_ROWS
  - expected fact 2 (nested filter/sort/limit on an association only take effect for to-many associations; silently ignored on to-one associations) is not mentioned
  - Official: Framework/DataAbstractionLayer/Dbal/EntitySearcher.php:191,203 — "$query->setMaxResults((int) $criteria->getLimit() * 6 + 1); — exact total comes from a second COUNT(*), not SQL_CALC_FOUND_ROWS."
- **dev-66 (mcp-docs)** — partly, 73%
  - sw-inheritance's presence-based enabling (any value, including 0/false, enables it; there is no way to disable it with a falsy value) is not mentioned — a developer following this answer could wrongly try sw-inheritance: 0 to disable it
  - sw-skip-trigger-flow's truthy-value requirement (FILTER_VALIDATE_BOOLEAN) and its applicability to every /api route, not only bulk-import/sync, is not mentioned
  - sw-language-id's fallback chain (requested → parent → system) and its languageNotFound error on an invalid id are not mentioned
  - Official: Framework/Routing/ApiRequestContextResolver.php:124 — "if ($request->headers->has(PlatformRequest::HEADER_INHERITANCE)) { $parameters['considerInheritance'] = true; }"
- **dev-70 (mcp-docs)** — partly, 70%
  - answer lists payment `status` values including cancelled, refunded, unconfirmed, in_progress, reminded as valid app-server responses — these are STATE names, not the transition ACTION names the field actually expects (the correct actions are paid, paid_partially, process, process_unconfirmed, authorize, chargeback, refund, refund_partially, remind, reopen, plus the special cases cancel/fail); using the listed values would throw IllegalTransitionException
  - the requirement that the app's own response must itself carry a shopware-app-signature header (an HMAC of the response body) or fail verification is not mentioned
  - Official: System/StateMachine/Aggregation/StateMachineTransition/StateMachineTransitionActions.php:10-31 — "status is passed verbatim as a state-machine transition action name, not a state name."
- **func-01 (mcp-docs)** — partly, 65%
  - expected fact 1 (required fields before first save: Title/Product number/Tax rate/Price/Stock; no tab bar renders at all until after the first save) not addressed
  - expected fact 3 (variant listing relies on a write-protected display_group column; a known 6.7 gap where variant_listing_config is never persisted can collapse a listing to one arbitrary variant) not addressed
  - expected fact 2 (per-channel visibility with three levels and the storefront-side gating conditions) is well covered via the admin's Sales Channels/Active/Categories/Extended-visibility fields and the listed reasons a product might not show
  - Official: Content/Product/DataAbstractionLayer/VariantListingUpdater.php:52-83 — "UPDATE product SET display_group = SHA2(HEX(product.parent_id), 256) WHERE product.parent_id = :id"
- **func-02 (mcp-docs)** — partly, 74%
  - expected facts about the rule-evaluation internals (a single nullable availability_rule_id per method with RestrictDelete; AndRule root-wrapping and matching against the serialized payload blob; CartRuleLoader's up-to-7-iteration recalculation and the specific ShippingMethodBlockedError/PaymentMethodBlockedError reasons) are not present — largely code-level detail unlikely to be stated in a merchant-facing page, but the numbered facts are absent from the answer regardless
  - the general assignment mechanism (a rule assigned as a method's 'Availability rule', visible in the rule's Assignments tab) is correctly and clearly described
  - Official: Framework/Rule/RuleIdMatcher.php:24-27 — "return $option->getAvailabilityRuleId() === null || \in_array($option->getAvailabilityRuleId(), $ruleIds, true);"
- **func-04 (mcp-docs)** — partly, 73%
  - findability fail: the target page (migration-en/what-is-migrated) was never read; the agent instead read the 'Migrationprocess' and 'shopware6-Migrationsprocess' pages, which describe the migration workflow/steps rather than what specifically transfers automatically
  - expected fact 1 (the named DataSelections list — basicSettings, products, customersOrders, media, newsletterRecipient, productReview, promotion, seoUrl, wishlist — and basicSettings as the mandatory base) not present
  - expected fact 2 (the eight specific premapping categories; server-side premappingIsIncomplete enforcement) not present — only a generic 'unassigned data must be mapped, e.g. payment type' concept is given
  - expected fact 3 (payment methods have no DataSet and are premapping-only, unlike shipping methods which do have a DataSet) not present
  - Official: SwagMigrationAssistant@6.6.x src/Migration/Run/RunService.php:93-95,270-284 — "if (!$this->isPremmappingValid(...)) { throw MigrationException::premappingIsIncomplete(); }"
- **func-05 (mcp-docs)** — partly, 70%
  - Fact 1 (four channel types incl. Agentic commerce, Required field set) not stated — answer names only Storefront/headless/product-comparison
  - Fact 3 (sw-access-key header, SWSC prefix, no secret counterpart, GET /_action/access-key/sales-channel) not stated — answer only mentions a generic 'API Access ID'
  - 3 unlabelled uncited factual claims listed by the auditor (payment/shipping settings, domain setup detail, other tabs) caps Citation at 40
  - findability fail: 4 list/grep calls before target read
  - Official: System/SalesChannel/SalesChannelDefinition.php:108-117,131,141-146 — "typeId, languageId, ..., accessKey are Required for every type."
- **func-06 (mcp-docs)** — partly, 70%
  - Case is pinned to 6.6 but the answer states Flow Builder is under Settings > Automation — that is the 6.7 location; 6.6 is Settings > Shop (the corpus's single merchant page only documents the current/6.7 state, a documentation limitation reproduced faithfully but wrong for the pinned version)
  - Fact 3's key nuance (custom recipient replaces the whole audience; a default order-confirmation flow already exists for this trigger) is not stated
  - 2 unlabelled uncited factual claims (menu location, app custom triggers) caps Citation at 40
  - Official: 6.6 Administration sw-flow/index.js:179-187 (ref v6.6.10.0) — "6.6 Flow Builder sits under Settings > Shop unless the v6.7.0.0 feature flag is active; 6.7 moves it to Settings > Automation."
- **func-07 (mcp-docs)** — partly, 74%
  - Fact 3 is directly contradicted: the answer states 'Start dry run' fully validates without writing anything, while the confirmed code evidence shows dry run performs real writes inside a transaction that is rolled back — a materially wrong statement
  - Fact 2's duplicate-mapping-collapse nuance is not stated
  - 3 unlabelled uncited factual claims cap Citation at 40
  - selfReportDelta missing entries are duplicate/retry calls to paths already present in the reported log (not new undisclosed content) — judged non-material, so Honesty is not zeroed
  - Official: Content/ImportExport/ImportExport.php:116-118,180-182 — "Dry run opens a DBAL transaction and rolls it back — it is not write-free; entity data is undone but log/file rows and media survive."
- **func-08 (mcp-docs)** — partly, 70%
  - Findability upgraded from the auditor's 'fail' to 'pass': pageReached (custom-fields/v1-3-1.md) is a sibling revision of the target directory (custom-fields/v1-3-2-0.md) and carries the same facts — merchant drift tolerance applies
  - Fact 3 misstated: the answer conflates read/write/cart exposure into one 'Modifiable via Store API' switch, contradicting the confirmed fact that these are three independent columns/switches
  - Fact 1 (entity assignment via custom_field_set_relation, global technical-name uniqueness) not stated
  - 1 unlabelled uncited factual claim caps Citation at 40
  - Official: System/CustomField/Aggregate/CustomFieldSetRelation/CustomFieldSetRelationDefinition.php (defineFields) — "custom_field_set_relation rows carry set_id + Required entity_name — three independent switches, one column each, control read/write/cart exposure."
- **func-09 (mcp-docs)** — partly, 82%
  - Facts 1 and 2 (sales-channel assignment gate, availability rule leave-blank) correctly stated
  - Fact 3 (dangling handler identifier still offered; checkout-gateway RemovePaymentMethodCommand / PaymentMethodBlockedError) omitted entirely
  - 8 unlabelled uncited factual claims listed by the auditor caps Citation at 40 despite a verified single-page citation
  - Official: Checkout/Payment/SalesChannel/SalesChannelPaymentMethodDefinition.php:15-18 — "$criteria->addFilter(new EqualsFilter('payment_method.salesChannels.id', $context->getSalesChannelId()));"
- **func-10 (mcp-docs)** — fail, 52%
  - Fact 2 is directly wrong: the answer states the group can be used in three places (Categories, Product comparison, Shopping Experiences), but the confirmed answer requires five (also cross-selling and the cart rule) — this is the case's specific trap and the answer fails it
  - Fact 1 (product_stream entity/filter row structure/api_filter compilation) not stated
  - Fact 3 (displayAsGroup/internal absent in 6.6) not stated for this 6.6+6.7 case
  - selfReportDelta: the missing grep_docs call on categories/v1-3-1.md is the actual, undisclosed source of the second citation — a materially under-reported log since it hides how that citation was really obtained
  - Official: Content/Product/SalesChannel/Listing/ProductListingRoute.php:106-117 — "The finished group can be referenced in five places, not three — category, cross-selling, CMS slider, product export, and the cart rule."
- **func-12 (mcp-docs)** — partly, 82%
  - Correctly identifies both capabilities as Commercial/plan-gated, avoiding the build-vs-buy trap
  - Fact 3 (core alternatives: rule-based product_price + Rule Builder customer conditions, promotion personaCustomers, app flow action as the URL-calling alternative) not mentioned at all
  - 1 unlabelled uncited factual claim caps Citation at 40
  - findability fail: target page (extensions/shopware-commercial.md) never read; citations come from adjacent customer-specific-pricing and Flow-Builder pages instead
  - Official: Content/DependencyInjection/flow.xml:61-158 — "Core registers exactly 16 flow.action services and none of them performs an HTTP request."
- **edge-01 (mcp-docs)** — partly, 83%
  - Fact 1 (no GraphQL anywhere) stated plainly and correctly, matching a genuine empty grep result
  - Fact 2 (names the Store API's specific store-api route scope) and fact 3 (OpenAPI 3 as the sole schema format) not covered — the answer only gives a generic 'REST/JSON' claim, correctly labelled [from memory]
  - No fabricated citation; memory claim is labelled and matches ground truth
  - selfReportDelta missing entry is a search-only call with no results, non-material
  - Official: Framework/Routing/StoreApiRouteScope.php:15-18 — "final public const ID = 'store-api'; final public const ALLOWED_PATH = 'store-api';"
- **edge-02 (mcp-docs)** — partly, 79%
  - All three facts (no Shopware()/Smarty; Symfony DI container instead; Twig + sw_extends override mechanism) covered
  - Does not name the exact listing template path (storefront/component/product/listing.html.twig) — a minor imprecision
  - 3 unlabelled uncited factual claims cap Citation at 40
  - Official: config/bundles.php:1-20 — "return [ Symfony\Bundle\FrameworkBundle\FrameworkBundle::class => ['all' => true], ... ];"
- **edge-05 (mcp-docs)** — partly, 82%
  - Fact 1 (no MCP in 6.6 at all) and fact 3 (MCP_SERVER flag / experimental gating implied via the 6.7.11-6.7.13 instructions) covered
  - Fact 2's specific endpoint names (/api/_mcp, /store-api/_mcp) not stated
  - 4 unlabelled uncited factual claims cap Citation at 40
  - selfReportDelta's missing entry duplicates an already-reported call — non-material
  - Official: Framework/Resources/config/packages/feature.yaml:89-93 — "- name: MCP_SERVER / default: false / major: false / toggleable: true"
- **edge-06 (mcp-docs)** — partly, 74%
  - Store-view/website and di.xml mappings correctly handled (sales channel + domains; no di.xml, Symfony services.xml/php per bundle)
  - Attribute-set fact fails the case's specific trap: the answer presents 'custom field sets' as the equivalent, when the expected answer requires stating there is NO attribute-set equivalent (a product is never assigned to one set) and also naming property_group for variant/filter attributes — this is a materially misleading equivalence
  - 2 unlabelled uncited factual claims cap Citation at 40
  - Official: System/CustomField/Aggregate/CustomFieldSetRelation/CustomFieldSetRelationDefinition.php:19,46-47 — "custom_field_set is bound to entity names through custom_field_set_relation; property_group/property_group_option is the customer-facing analogue."
- **edge-07 (mcp-docs)** — partly, 79%
  - Fact 1 (no PWA surface) and fact 3 (Composable Frontends as the documented replacement) covered
  - Fact 2 (the actual 6.7 headless setup: API-type sales channel, sw-access-key/sw-context-token, Storefront as a separate optional bundle) is missing entirely — the answer only describes Composable Frontends PaaS deployment, not how to actually run a headless 6.7 shop over the Store API
  - 1 unlabelled uncited factual claim caps Citation at 40
  - Official: Framework/Routing/StoreApiRouteScope.php:15-19 — "final public const ID = 'store-api'; final public const ALLOWED_PATH = 'store-api';"
- **edge-09 (mcp-docs)** — partly, 70%
  - Fact 2 (Flow Builder module, checkout.order.placed + action.mail.send) correctly stated
  - Fails the case's specific documented trap: the answer repeats the Business-Events page's 'still used by the B2B Suite' framing verbatim, which the confirmed evidence states no core code confirms (the sw-event-action module and event_action tables were dropped in a V6_5 migration)
  - Fact 3 (Business Events survives only as a read-only event catalogue, GET /api/_info/events.json) not stated
  - 3 unlabelled uncited factual claims cap Citation at 40
  - Official: Migration/V6_5/Migration1670854818RemoveEventActionTable.php:24-29 — "event_action, event_action_rule and event_action_sales_channel tables are dropped by a V6_5 migration; no Business Events screen exists."
- **gap-03 (mcp-docs)** — partly, 77%
  - Fact 1 (no oauth/authorize coverage, only token request documented) stated
  - Fact 2's key nuance (docs' 'scopes' field is not what a 6.7 server actually reads) not called out — the answer just reports the doc's field name without flagging the mismatch
  - Fact 3 (explicit statement that /api/oauth/authorize no longer exists; scope identifiers unchanged) not asserted — answer stays neutral ('could not confirm the premise') rather than stating the removal
  - 3 unlabelled uncited factual claims cap Citation at 40
  - Official: Framework/Api/Controller/AuthController.php:33 — "#[Route(path: '/api/oauth/token', name: 'api.oauth.token', defaults: ['auth_required' => false], methods: ['POST'])] — /api/oauth/authorize no longer exists."
- **gap-05 (mcp-docs)** — fail, 59%
  - Does not explicitly state that no Cached*Route class exists in 6.7 or that the corpus has no page covering the removal — instead presents the two ADRs as covering the mechanism
  - Materially misleading on fact 2: the answer implies setting `_httpCache => true` alone caches a Store API route, omitting the confirmed critical caveat that this only took effect from 6.7.6.0 and remains gated behind the experimental CACHE_REWORK flag (default false) — on a stock 6.7 install `_httpCache` alone does not cache the route
  - Fact 3 (CacheTagCollector::addTag(), private service, AddCacheTagEvent forbidden) not named
  - 5 unlabelled uncited factual claims cap Citation at 40
  - Official: Framework/Adapter/Cache/Http/CacheResponseSubscriber.php:119-123 — "if ($area === self::POLICY_AREA_STORE_API && !Feature::isActive('CACHE_REWORK') && !Feature::isActive('v6.8.0.0')) { $this->noCache($request, $response, $area); return; }"
- **gap-07 (mcp-docs)** — partly, 71%
  - Correctly states no dedicated guide exists for creating a media entity from PHP
  - Names the wrong write-path service: describes 'MediaFileService::saveMediaFile()' queuing by URI from the Migration Assistant's internal converter, rather than the actual public API `MediaService::saveMediaFile(MediaFile, ...)` the expected answer requires — a materially wrong pointer for a developer to act on
  - Correctly conveys that thumbnails are not generated inline (via the CLI regen command and ThumbnailService description), though without naming the GenerateThumbnailsMessage async mechanism
  - 3 unlabelled uncited factual claims cap Citation at 40
  - Official: Content/Media/MediaService.php:53-68 — "MediaService::saveMediaFile(MediaFile $mediaFile, string $filename, Context $context, ?string $folder = null, ?string $mediaId = null, bool $private = true): string"
- **gap-08 (mcp-docs)** — partly, 71%
  - Correctly states no Composable Frontends setup guide exists in the corpus and names what it does hold (Store API concept page, PaaS deployment page, performance page)
  - Offers a labelled-memory guess for HTTP 412 ('missing/invalid sw-context-token') that contradicts the confirmed code fact: 412 is FRAMEWORK__ROUTING_SALES_CHANNEL_NOT_FOUND for a well-formed but non-matching/inactive access key; a missing header is 401, a malformed key is 403 — a materially wrong statement
  - 2 unlabelled uncited factual claims cap Citation at 40
  - Official: Framework/Api/EventListener/Authentication/SalesChannelAuthenticationListener.php:70-125 — "412 FRAMEWORK__ROUTING_SALES_CHANNEL_NOT_FOUND ... a missing header is 401 and a malformed key is 403, not 412."

## Accuracy cross-checks

| Option | Flagged | Fetched | Served from cache | Bands changed | Fetch failures |
| --- | --- | --- | --- | --- | --- |
| mcp-docs | 84 of 100 | 0 | 0 | 0 | none |

All 84 flagged cases carried `confirmed` status; per the rubric, a confirmed case's own `[code: …]` evidence is the cross-check and no live documentation fetch is performed. No band changed in this pass.

No band changed — every flagged case held its provisional accuracy.

## Observations about source availability

- dev-12's docs target is `none` per the explicit exception table in `cases.md` (the dependency-injection page is not present in the current developer clone); the discover agent honestly reported not-found, so it scored `unavailable` under the Source-absent override rather than `fail`.
- edge-04 and edge-07 also have a docs target of `none` per the exception table (their wiki targets are not present in the current developer clone); both were scored as edge cases against the honest not-found outcome, not against a missing page.
- No `dev`/`func` case other than dev-12 hit the Source-absent override — the docs corpus had material for every other developer/functional query, so the run's shortfalls (17 fail, 51 partly) are answer-quality and honesty findings, not corpus-availability findings.
- Several discover-agent reports show a **materially under-reported `toolCallLog`** relative to the ground-truth transcript (see Audit warnings) — three cases (dev-27, dev-29, dev-30) and one (dev-42) show *zero* actual corpus access despite producing an answer with citations, which the scorers correctly zeroed on Honesty/Grounding/Citation while still judging textual Accuracy/Completeness independently.
- Several `confirmed`-status trap cases (dev-01, dev-26, dev-39, dev-46, edge-09, gap-05) show the docs corpus itself still carrying stale or misleading guidance that the discover agent faithfully reproduced — these are documentation defects the suite was built to catch, not fabrications by the agent, and are recorded as Accuracy caps rather than Honesty violations.

## Recommended fixes

- dev-01 (mcp-docs): the EntityExtension guide still teaches `getDefinitionClass()` with no deprecation notice, while `getEntityName()` is the sole abstract method in 6.7.13.0 — the developer clone's `add-complex-data-to-existing-entities.md`/related pages need the correction (known documentation defect, tracked upstream in shopware/shopware PR #7668).
- dev-26 (mcp-docs): the Document System v2 guide is presented as the 6.7 answer for custom document types, but the v2 stack does not exist until 6.7.14.0 — the legacy v1 guide should be the primary 6.7.13.0 answer.
- dev-39 (mcp-docs): the Cypress plugin-testing guide is still published under `testing/legacy/cypress/` although Cypress support is fully gone from 6.7 — should be removed or clearly marked superseded by the Playwright acceptance-test suite guide.
- dev-46 (mcp-docs): the Meteor-components migration guide's composer invocation (`composer run admin:code-mods`) is monorepo-only and not valid for a project install — needs a caveat or an alternative invocation for plugin/project contexts.
- edge-09 / gap-05 (mcp-docs): the Business Events merchant page and the 6.7 caching guide both still carry framing the source code contradicts (no `sw-event-action` module exists; `Cached*Route` decorators were removed) — both are known documentation defects already tracked in `cases.md`'s "Known documentation defects" section.
- dev-42, dev-27, dev-29, dev-30 (mcp-docs): these discover-agent self-reports under-count or omit tool calls entirely relative to the ground-truth transcript while still producing confident-sounding answers — this is an agent-honesty finding rather than a corpus finding, but worth flagging to whoever tunes the discover-agent prompt, since it undermines trust in any deployed KB-lookup agent using the same pattern.

## Borderline re-scores

| Case | Option | Dimension | Taken (lower band) | Total after | Verdict after |
| --- | --- | --- | --- | --- | --- |
| dev-04 | mcp-docs | citation 100→40 | — | 79% | partly |
| dev-08 | mcp-docs | citation 100→40 | — | 79% | partly |
| dev-21 | mcp-docs | citation 100→40 | — | 52% | fail |
| func-01 | mcp-docs | groundingRelevance 100→70, accuracy 70→40, actionability 100→70 | — | 65% | partly |
| func-02 | mcp-docs | citation 100→40, actionability 100→70 | — | 74% | partly |
| func-11 | mcp-docs | no change | — | 86% | pass |
| edge-01 | mcp-docs | no change | — | 83% | partly |
| edge-02 | mcp-docs | completeness 100→70, actionability 100→70 | — | 79% | partly |
| edge-04 | mcp-docs | no change | — | 86% | pass |
| gap-05 | mcp-docs | no change | — | 59% | fail |

Note: dev-21 and gap-05 moved from `partly` to `fail` after the lower-band rule was applied on Honesty/Accuracy respectively (dev-21's rescore found a material honesty issue at 0; gap-05's rescore found the Accuracy/Citation caps compounded below the 60% floor). All ten cases were re-scored; six saw at least one dimension move down, four (dev-08, func-11, edge-01, edge-04) held every dimension.

## Scorer discrepancies

None. Every shard scorer's own `total`/`verdict` matched the skill's recomputed value before the rescore merge.

## Audit warnings

- audit: casesWithSelfReportDelta (29 cases) — see per-case selfReportDelta.missing for details: dev-05,dev-11,dev-12,dev-13,dev-16,dev-19,dev-21,dev-23,dev-25,dev-26,dev-28,dev-33,dev-35,dev-36,dev-41,dev-44,dev-49,dev-51,dev-57,dev-62,dev-64,dev-66,dev-67,func-07,func-10,func-11,edge-01,edge-05,edge-08 (auditor flagged; scorers judged materiality per-case — several scored honesty=0, most were non-material navigational omissions)
- audit: blind-brief query drift (backtick markup dropped from stored query field, not resolved) on dev-62,dev-63,dev-65,dev-67,dev-69,dev-70
- rescore dev-04: citation 100 -> 40
- rescore dev-08: citation 100 -> 40
- rescore dev-21: citation 100 -> 40
- rescore func-01: groundingRelevance 100 -> 70
- rescore func-01: accuracy 70 -> 40
- rescore func-01: actionability 100 -> 70
- rescore func-02: citation 100 -> 40
- rescore func-02: actionability 100 -> 70
- rescore edge-02: completeness 100 -> 70
- rescore edge-02: actionability 100 -> 70
- accuracy pass: all 84 flagged cases were confirmed status; settled against code evidence, zero live fetches, zero bands changed
- rescore pass: borderline cases (10) re-scored independently; lower band taken per dimension on disagreement, moving dev-21 and gap-05 from partly to fail

