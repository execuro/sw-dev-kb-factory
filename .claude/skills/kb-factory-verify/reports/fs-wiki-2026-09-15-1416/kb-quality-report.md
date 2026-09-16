# KB quality report — fs-wiki-2026-09-15-1416

## Run

| | |
| --- | --- |
| Run | `fs-wiki-2026-09-15-1416` (`fs-wiki`) |
| Options | fs-wiki |
| Corpus | wiki — fingerprint: `lastBuilt 2026-09-15`, `treeHash bb824702f136…`, `1926 pages` |
| Probe | ls .claude/extras/ShopwareDevKnowledgeBase/wiki/platform/index.md succeeded; manifest.json read for fingerprint |
| Model | inherited (not pinned) |
| Generated | 2026-09-15T15:51:15Z |
| Cases run | 106 of 106 (`all`) |
| Yardstick | `cases.md ac4393bc`, `scoring-rubric.md dbf63114`, `scorer-brief.md 51bc1922`, `auditor-brief.md 2f2db37f`, `accuracy-brief.md d4a335ae` |
| Execution | discover batches of 10, scorer shards of 25 (batched) |
| Skill | `kb-factory-verify` |

## Run cost

Cost = usage of the option's discover agents only, one usage block per API message id (the record carrying the final output_tokens), split into non-cache tokens (input + output + cache writes) and cache-read tokens, computed by scripts/aggregate-costs.mjs from the transcripts. Cache hit rate = cacheRead ÷ (input + cacheCreation + cacheRead). USD is an estimate from reference/pricing.json, labelled so. totalTokens is retired. Written by `scripts/aggregate-costs.mjs`, never by hand.

| Option | Discover agents (batches) | Requests | Non-cache tokens | Cache-read tokens | Cache hit % | Est. USD | Tool calls | Summed agent time | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| fs-wiki | 11 (11) | 384 | 885,385 | 16,852,737 | 96.0% | $6.89 | 382 | 1978.59s | transcript |

Wall-clock duration of the run: 5680s.

## Comparison

| Option | Access | Corpus | Overall | Status | Developer | Functional | Findable | Edge passed | Gap confirmed | Pass / partly / fail / unavailable / unscored | Weakest dimension |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| fs-wiki | fs | wiki | 85% | KB ready for skills | 86% | 80% | 80 of 89 | 4 of 9 | 4 of 8 | 60 / 42 / 2 / 2 / 0 | accuracy |

`Status` is the rate-based gate over `dev-*`/`func-*`/`rule-*` only (89 cases): practical fail rate 1.1% (1/89, dev-21), practical unavailable rate 0.0%, practical unscored 0 — under `scoring-rubric.md`'s revised `## Status` section (`practicalFailRate` ≤ 5% and `practicalUnavailableRate` ≤ 10%) this clears **KB ready for skills**. `edge-*`/`gap-*` results (4 of 9 edge passed, 4 of 8 gap confirmed) are reported above but do not gate this status — edge-09's fail (the Business Events fabrication trap) is a real content-quality finding, tracked in Failures below, but does not block readiness on its own.

Only one option in this run — no ranking or delta to compute.

## Dimension heatmap

| Dimension | Weight | fs-wiki |
| --- | --- | --- |
| Grounding & Relevance | 25 | 95.5 |
| Accuracy vs. Expected Answer | 25 | 70.4 |
| Completeness | 15 | 71.0 |
| Citation & Traceability | 10 | 99.7 |
| Honesty | 15 | 94.1 |
| Actionability | 10 | 87.8 |

| Area | Cases | fs-wiki average |
| --- | --- | --- |
| Admin API | 3 | 80.3 |
| Admin migration (Vue 3 / Vite / Pinia / Meteor) | 4 | 85.8 |
| Administration | 4 | 88.0 |
| App system | 5 | 90.6 |
| Architecture | 3 | 100.0 |
| Checkout & Cart | 2 | 75.0 |
| Code | 1 | 73.0 |
| Config & CLI | 5 | 87.2 |
| Content | 1 | 88.0 |
| Content (CMS/mail/SEO/media/sitemap) | 2 | 88.0 |
| Core breaking changes | 3 | 96.0 |
| DAL | 7 | 87.9 |
| Events | 6 | 84.2 |
| Gap | 8 | 81.4 |
| Hosting & ops | 5 | 76.6 |
| Merchant | 12 | 79.8 |
| Orders | 2 | 62.5 |
| Payment & Shipping | 1 | 100.0 |
| Platform upgrade | 2 | 100.0 |
| Plugin fundamentals | 1 | 88.0 |
| QA | 1 | 73.0 |
| Services & DI | 3 | 72.7 |
| Store API & headless | 1 | 100.0 |
| Storefront | 10 | 92.5 |
| Testing | 3 | 81.7 |
| Theme | 2 | 86.0 |
| Trap | 9 | 80.8 |

## Verdict grid

| Case | Category | Area | fs-wiki |
| --- | --- | --- | --- |
| dev-01 | dev | DAL | 88% pass ✗ |
| dev-02 | dev | Plugin fundamentals | 88% pass ✓ |
| dev-03 | dev | Store API & headless | 100% pass ✓ |
| dev-04 | dev | Content | 88% pass ✓ |
| dev-05 | dev | Theme | 92% pass ✓ |
| dev-06 | dev | Events | 92% pass ✓ |
| dev-07 | dev | DAL | 80% partly ✓ |
| dev-08 | dev | DAL | 92% pass ✓ |
| dev-09 | dev | DAL | 88% pass ✓ |
| dev-10 | dev | DAL | 92% pass ✓ |
| dev-11 | dev | Services & DI | 65% partly ✗ |
| dev-12 | dev | Services & DI | 65% partly ✗ |
| dev-13 | dev | Services & DI | 88% pass ✓ |
| dev-14 | dev | Events | 100% pass ✓ |
| dev-15 | dev | Events | 80% partly ✓ |
| dev-16 | dev | Orders | 65% partly ✗ |
| dev-17 | dev | Checkout & Cart | 88% pass ✓ |
| dev-18 | dev | Checkout & Cart | 62% partly ✓ |
| dev-19 | dev | Events | 92% pass ✓ |
| dev-20 | dev | Events | 100% pass ✓ |
| dev-21 | dev | Events | 41% fail ✓ |
| dev-22 | dev | Config & CLI | 100% pass ✓ |
| dev-23 | dev | Content (CMS/mail/SEO/media/sitemap) | 76% partly ✓ |
| dev-24 | dev | Content (CMS/mail/SEO/media/sitemap) | 100% pass ✓ |
| dev-25 | dev | Config & CLI | 88% pass ✓ |
| dev-26 | dev | Orders | 60% partly ✓ |
| dev-27 | dev | Storefront | 100% pass ✓ |
| dev-28 | dev | Storefront | 95% pass ✓ |
| dev-29 | dev | Storefront | 95% pass ✓ |
| dev-30 | dev | Storefront | 95% pass ✓ |
| dev-31 | dev | Storefront | 95% pass ✓ |
| dev-32 | dev | DAL | 95% pass ✓ |
| dev-33 | dev | Administration | 77% partly ✓ |
| dev-34 | dev | Administration | 100% pass ✓ |
| dev-35 | dev | Administration | 80% partly ✓ |
| dev-36 | dev | Administration | 95% pass ✓ |
| dev-37 | dev | Testing | 95% pass ✓ |
| dev-38 | dev | Testing | 73% partly ✓ |
| dev-39 | dev | Testing | 77% partly ✗ |
| dev-40 | dev | Platform upgrade | 100% pass ✓ |
| dev-41 | dev | Hosting & ops | 77% partly ✗ |
| dev-42 | dev | Config & CLI | 100% pass ✓ |
| dev-43 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 100% pass ✓ |
| dev-44 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 73% partly ✓ |
| dev-45 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 100% pass ✓ |
| dev-46 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 70% partly ✓ |
| dev-47 | dev | Payment & Shipping | 100% pass ✓ |
| dev-48 | dev | Storefront | 100% pass ✓ |
| dev-49 | dev | Core breaking changes | 100% pass ✓ |
| dev-50 | dev | Core breaking changes | 100% pass ✓ |
| dev-51 | dev | DAL | 80% partly ✓ |
| dev-52 | dev | Core breaking changes | 88% pass ✓ |
| dev-53 | dev | Theme | 80% partly ✓ |
| dev-54 | dev | Storefront | 88% pass ✓ |
| dev-55 | dev | Storefront | 65% partly ✓ |
| dev-56 | dev | Storefront | 92% pass ✓ |
| dev-57 | dev | Platform upgrade | 100% pass ✓ |
| dev-58 | dev | Hosting & ops | 88% pass ✓ |
| dev-59 | dev | Hosting & ops | 77% partly ✓ |
| dev-60 | dev | Hosting & ops | 61% partly ✓ |
| dev-61 | dev | Hosting & ops | 80% partly ✓ |
| dev-62 | dev | Config & CLI | 65% partly ✓ |
| dev-63 | dev | Config & CLI | 83% partly ✓ |
| dev-64 | dev | Admin API | 88% pass ✓ |
| dev-65 | dev | Admin API | 88% pass ✓ |
| dev-66 | dev | Admin API | 65% partly ✓ |
| dev-67 | dev | App system | 100% pass ✓ |
| dev-68 | dev | App system | 100% pass ✓ |
| dev-69 | dev | App system | 100% pass ✓ |
| dev-70 | dev | App system | 65% partly ✓ |
| dev-71 | dev | App system | 88% pass ✓ |
| func-01 | func | Merchant | 65% partly ✓ |
| func-02 | func | Merchant | 73% partly ✓ |
| func-03 | func | Merchant | 100% pass ✓ |
| func-04 | func | Merchant | 77% partly ✓ |
| func-05 | func | Merchant | 73% partly ✓ |
| func-06 | func | Merchant | 80% partly ✓ |
| func-07 | func | Merchant | 80% partly ✓ |
| func-08 | func | Merchant | 80% partly ✓ |
| func-09 | func | Merchant | 70% partly ✗ |
| func-10 | func | Merchant | 80% partly ✓ |
| func-11 | func | Merchant | 92% pass ✓ |
| func-12 | func | Merchant | 88% pass ✗ |
| edge-01 | edge | Trap | 85% unavailable – |
| edge-02 | edge | Trap | 70% unavailable – |
| edge-03 | edge | Trap | 100% pass – |
| edge-04 | edge | Trap | 88% pass – |
| edge-05 | edge | Trap | 100% pass – |
| edge-06 | edge | Trap | 62% partly – |
| edge-07 | edge | Trap | 70% partly – |
| edge-08 | edge | Trap | 100% pass – |
| edge-09 | edge | Trap | 52% fail – |
| gap-01 | gap | Gap | 74% partly – |
| gap-02 | gap | Gap | 94% pass – |
| gap-03 | gap | Gap | 77% partly – |
| gap-04 | gap | Gap | 85% pass – |
| gap-05 | gap | Gap | 65% partly – |
| gap-06 | gap | Gap | 89% pass – |
| gap-07 | gap | Gap | 70% partly – |
| gap-08 | gap | Gap | 97% pass – |
| rule-01 | rule | Architecture | 100% pass ✓ |
| rule-02 | rule | Architecture | 100% pass ✓ |
| rule-03 | rule | Architecture | 100% pass ✗ |
| rule-04 | rule | Code | 73% partly ✓ |
| rule-05 | rule | QA | 73% partly ✓ |
| rule-06 | rule | Storefront | 100% pass ✓ |

## Requests and responses

### fs-wiki

| Case | Query | Entry point used | Tool calls made | Page reached | Findability | Top citation | Memory claims | Honesty | Verdict | Raw |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dev-01 | `How do I extend the product entity with a new association in…` | read_doc platform/index.md | 9 | `platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-complex-data-to-existing-entities.md = target` | fail (5+1) | `platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-complex-data-to-existing-entities.md:15-69` | 0 | 100 | pass | `raw/fs-wiki/dev-01.json` |
| dev-02 | `What's the plugin lifecycle in Shopware — install, activate,…` | not found | 3 | `platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/plugin-lifecycle.md = target` | pass (1+1) | `platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/plugin-lifecycle.md:15-82` | 0 | 100 | pass | `raw/fs-wiki/dev-02.json` |
| dev-03 | `How do I add a custom Store API route for a headless storefr…` | not found | 3 | `platform/dev/6.7/guides/plugins/plugins/framework/store-api/add-store-api-route.md = target` | pass (1+1) | `platform/dev/6.7/guides/plugins/plugins/framework/store-api/add-store-api-route.md:16-67` | 0 | 100 | pass | `raw/fs-wiki/dev-03.json` |
| dev-04 | `How do I create a custom CMS element for Shopping Experience…` | not found | 3 | `platform/dev/6.7/guides/plugins/plugins/content/cms/add-cms-element.md = target` | pass (1+1) | `platform/dev/6.7/guides/plugins/plugins/content/cms/add-cms-element.md:15-61` | 0 | 100 | pass | `raw/fs-wiki/dev-04.json` |
| dev-05 | `How does theme inheritance work in Shopware — theme.json and…` | not found | 4 | `platform/dev/6.7/guides/plugins/themes/inheritance/add-theme-inheritance.md = target` | pass (1+1) | `platform/dev/6.7/guides/plugins/themes/inheritance/add-theme-inheritance.md:15-59` | 0 | 100 | pass | `raw/fs-wiki/dev-05.json` |
| dev-06 | `How do I add a custom Flow Builder action?` | not found | 3 | `platform/dev/6.7/guides/plugins/plugins/framework/flow/add-flow-builder-action.md = target` | pass (1+1) | `platform/dev/6.7/guides/plugins/plugins/framework/flow/add-flow-builder-action.md:15-71` | 0 | 100 | pass | `raw/fs-wiki/dev-06.json` |
| dev-07 | `My plugin needs to store its own data in a new table — how d…` | not found | 2 | `platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-custom-complex-data.md = target` | pass (0+1) | `platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-custom-complex-data.md:15-121` | 0 | 100 | partly | `raw/fs-wiki/dev-07.json` |
| dev-08 | `In a plugin service, what is the Shopware 6 equivalent of Do…` | not found | 2 | `platform/dev/6.7/guides/plugins/plugins/framework/data-handling/reading-data.md = target` | pass (0+1) | `platform/dev/6.7/guides/plugins/plugins/framework/data-handling/reading-data.md:15-65` | 0 | 100 | pass | `raw/fs-wiki/dev-08.json` |
| dev-09 | `How do I make a field on my plugin's own entity translatable…` | not found | 2 | `platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-data-translations.md = target` | pass (0+1) | `platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-data-translations.md:15-60` | 0 | 100 | pass | `raw/fs-wiki/dev-09.json` |
| dev-10 | `How do I write an indexer that precomputes derived data for …` | not found | 3 | `platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-data-indexer.md = target` | pass (1+1) | `platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-data-indexer.md:15-68` | 0 | 100 | pass | `raw/fs-wiki/dev-10.json` |
| dev-11 | `On Shopware 6.7, which file do I declare my plugin's service…` | read_doc platform/index.md | 6 | `platform/dev/6.7/guides/plugins/plugins/services/add-custom-service.md ≠ target` | fail (3+1) | `platform/dev/6.7/guides/plugins/plugins/services/add-custom-service.md:1-84` | 0 | 100 | partly | `raw/fs-wiki/dev-11.json` |
| dev-12 | `I am on Shopware 6.6 — which file do I declare my plugin's s…` | not found | 4 | `platform/dev/6.6/guides/plugins/plugins/plugin-fundamentals/add-custom-service.md ≠ target` | fail (1+1) | `platform/dev/6.6/guides/plugins/plugins/plugin-fundamentals/add-custom-service.md:1-50` | 0 | 100 | partly | `raw/fs-wiki/dev-12.json` |
| dev-13 | `There is no event for what I need to change in a core Shopwa…` | not found | 2 | `platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md = target` | pass (0+1) | `platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md:1-85` | 0 | 100 | pass | `raw/fs-wiki/dev-13.json` |
| dev-14 | `I wrote a subscriber class in my plugin but it never fires —…` | not found | 3 | `platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md = target` | pass (1+1) | `platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md:1-88` | 0 | 100 | pass | `raw/fs-wiki/dev-14.json` |
| dev-15 | `How do I work out which event Shopware actually dispatches f…` | not found | 3 | `platform/dev/6.7/guides/plugins/plugins/framework/event/finding-events.md = target` | pass (1+1) | `platform/dev/6.7/guides/plugins/plugins/framework/event/finding-events.md:1-96` | 0 | 100 | partly | `raw/fs-wiki/dev-15.json` |
| dev-16 | `How do I run plugin logic whenever an order is written, and …` | not found | 2 | `platform/dev/6.7/guides/plugins/plugins/framework/data-handling/using-database-events.md ≠ target` | fail (0+1) | `platform/dev/6.7/guides/plugins/plugins/framework/data-handling/using-database-events.md:1-97` | 0 | 100 | partly | `raw/fs-wiki/dev-16.json` |
| dev-17 | `How do I overwrite the price of a product line item in the c…` | not found | 3 | `platform/dev/6.7/guides/plugins/plugins/checkout/cart/change-price-of-item.md = target` | pass (1+1) | `platform/dev/6.7/guides/plugins/plugins/checkout/cart/change-price-of-item.md:1-92` | 0 | 100 | pass | `raw/fs-wiki/dev-17.json` |
| dev-18 | `My plugin's cart processor adds a surcharge line item, but i…` | not found | 3 | `platform/dev/6.7/guides/plugins/plugins/checkout/cart/add-cart-processor-collector.md = target` | pass (0+1) | `platform/dev/6.7/guides/plugins/plugins/checkout/cart/add-cart-processor-collector.md:1-82` | 0 | 100 | partly | `raw/fs-wiki/dev-18.json` |
| dev-19 | `I need to move long-running work in my plugin out of the req…` | not found | 4 | `platform/dev/6.7/guides/plugins/plugins/framework/message-queue/add-message-to-queue.md ≠ target` | pass (1+1) | `platform/dev/6.7/guides/plugins/plugins/framework/message-queue/add-message-to-queue.md:1-80` | 0 | 100 | pass | `raw/fs-wiki/dev-19.json` |
| dev-20 | `How do I add my own condition to the Rule Builder from a plu…` | not found | 4 | `platform/dev/6.7/guides/plugins/plugins/framework/rule/add-custom-rules.md = target` | pass (1+1) | `platform/dev/6.7/guides/plugins/plugins/framework/rule/add-custom-rules.md:1-90` | 0 | 100 | pass | `raw/fs-wiki/dev-20.json` |
| dev-21 | `My plugin dispatches its own domain event — how do I make it…` | read_doc platform/index.md | 13 | `platform/dev/6.7/guides/plugins/plugins/framework/flow/add-flow-builder-trigger.md = target` | pass (1+1) | `platform/dev/6.7/guides/plugins/plugins/framework/flow/add-flow-builder-trigger.md:15-75` | 0 | 0 under-reported (1) | fail | `raw/fs-wiki/dev-21.json` |
| dev-22 | `How do I give my plugin a settings page the shop operator ca…` | not found | 2 | `platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-plugin-configuration.md = target` | pass (0+1) | `platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-plugin-configuration.md:15-85` | 0 | 100 | pass | `raw/fs-wiki/dev-22.json` |
| dev-23 | `How do I ship a mail template with my plugin so it is instal…` | not found | 2 | `platform/dev/6.7/guides/plugins/plugins/content/mail/add-mail-template.md = target` | pass (0+1) | `platform/dev/6.7/guides/plugins/plugins/content/mail/add-mail-template.md:15-61` | 0 | 100 | partly | `raw/fs-wiki/dev-23.json` |
| dev-24 | `How do I get readable SEO URLs generated for the detail page…` | not found | 2 | `platform/dev/6.7/guides/plugins/plugins/content/seo/add-custom-seo-url.md = target` | pass (0+1) | `platform/dev/6.7/guides/plugins/plugins/content/seo/add-custom-seo-url.md:15-91` | 0 | 100 | pass | `raw/fs-wiki/dev-24.json` |
| dev-25 | `How do I add a `bin/console` command to my plugin for a main…` | not found | 2 | `platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-custom-commands.md = target` | pass (0+1) | `platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-custom-commands.md:15-64` | 0 | 100 | pass | `raw/fs-wiki/dev-25.json` |
| dev-26 | `How do I add a custom document type such as a pro-forma invo…` | not found | 2 | `platform/dev/6.7/guides/plugins/plugins/checkout/documents/v2/add-a-document-type.md = target` | pass (0+1) | `platform/dev/6.7/guides/plugins/plugins/checkout/documents/v2/add-a-document-type.md:15-77` | 0 | 100 | partly | `raw/fs-wiki/dev-26.json` |
| dev-27 | `In Shopware 6.7, how do I extend a Storefront Twig template …` | not found | 2 | `platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-templates.md = target` | pass (0+1) | `platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-templates.md:15-60` | 0 | 100 | pass | `raw/fs-wiki/dev-27.json` |
| dev-28 | `How do I override an existing Storefront JavaScript plugin, …` | not found | 2 | `platform/dev/6.7/guides/plugins/plugins/storefront/javascript/override-existing-javascript.md = target` | pass (0+1) | `platform/dev/6.7/guides/plugins/plugins/storefront/javascript/override-existing-javascript.md:15-64` | 0 | 100 | pass | `raw/fs-wiki/dev-28.json` |
| dev-29 | `How do I add my own data to an existing Storefront page or p…` | not found | 2 | `platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-data-to-storefront-page.md = target` | pass (0+1) | `platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-data-to-storefront-page.md:15-56` | 0 | 100 | pass | `raw/fs-wiki/dev-29.json` |
| dev-30 | `How do I add a custom filter to the Storefront product listi…` | not found | 2 | `platform/dev/6.7/guides/plugins/plugins/storefront/howto/add-listing-filters.md = target` | pass (0+1) | `platform/dev/6.7/guides/plugins/plugins/storefront/howto/add-listing-filters.md:15-72` | 0 | 100 | pass | `raw/fs-wiki/dev-30.json` |
| dev-31 | `How do I expose a plugin configuration value, such as a colo…` | read_doc platform/index.md | 4 | `platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-scss-variables-via-subscriber.md ≠ target` | pass (drift) (1+1) | `platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-scss-variables-via-subscriber.md:1-86` | 0 | 100 | pass | `raw/fs-wiki/dev-31.json` |
| dev-32 | `How do I define a custom field set for products from my plug…` | not found | 3 | `platform/dev/6.7/guides/plugins/plugins/framework/custom-field/add-custom-field.md = target` | pass (1+1) | `platform/dev/6.7/guides/plugins/plugins/framework/custom-field/add-custom-field.md:1-107` | 0 | 100 | pass | `raw/fs-wiki/dev-32.json` |
| dev-33 | `How do I register a custom Administration module from my plu…` | not found | 3 | `platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-module.md = target` | pass (1+1) | `platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-module.md:1-83` | 0 | 100 | partly | `raw/fs-wiki/dev-33.json` |
| dev-34 | `How do I extend an existing Administration component and its…` | not found | 3 | `platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-components.md = target` | pass (1+1) | `platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-components.md:1-85` | 0 | 100 | pass | `raw/fs-wiki/dev-34.json` |
| dev-35 | `How do I load entities from the Admin API inside an Administ…` | not found | 3 | `platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/using-data-handling.md = target` | pass (1+1) | `platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/using-data-handling.md:1-110` | 0 | 100 | partly | `raw/fs-wiki/dev-35.json` |
| dev-36 | `How do I register ACL privileges for my plugin's Administrat…` | not found | 2 | `platform/dev/6.7/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.md = target` | pass (0+1) | `platform/dev/6.7/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.md:1-96` | 0 | 100 | pass | `raw/fs-wiki/dev-36.json` |
| dev-37 | `How do I set up and run PHPUnit integration tests for my Sho…` | not found | 4 | `platform/dev/6.7/guides/development/testing/unit/php-unit.md = target` | pass (2+1) | `platform/dev/6.7/guides/development/testing/unit/php-unit.md:1-89` | 0 | 100 | pass | `raw/fs-wiki/dev-37.json` |
| dev-38 | `How do I write Jest unit tests for my Administration compone…` | not found | 3 | `platform/dev/6.7/guides/development/testing/unit/jest-admin.md = target` | pass (1+1) | `platform/dev/6.7/guides/development/testing/unit/jest-admin.md:1-84` | 0 | 100 | partly | `raw/fs-wiki/dev-38.json` |
| dev-39 | `How do I write end-to-end Cypress tests for my plugin agains…` | not found | 4 | `platform/dev/6.7/guides/development/testing/legacy/_index.md ≠ target` | fail (1+1) | `platform/dev/6.7/guides/development/testing/legacy/_index.md:1-29` | 0 | 100 | partly | `raw/fs-wiki/dev-39.json` |
| dev-40 | `How do I upgrade a Composer-based Shopware project from 6.6 …` | not found | 3 | `platform/dev/6.7/guides/upgrades-migrations/upgrade-shopware.md = target` | pass (1+1) | `platform/dev/6.7/guides/upgrades-migrations/upgrade-shopware.md:1-72` | 0 | 100 | pass | `raw/fs-wiki/dev-40.json` |
| dev-41 | ``composer update` to Shopware 6.7 aborts on a platform requi…` | read_doc platform/index.md | 13 | `platform/dev/6.7/guides/hosting/_index.md = target` | fail (5+1) | `platform/dev/6.7/guides/hosting/_index.md:15-66` | 0 | 0 under-reported (1) | partly | `raw/fs-wiki/dev-41.json` |
| dev-42 | `How do I check extension compatibility before upgrading with…` | not found | 3 | `platform/dev/6.7/products/tools/cli/project-commands/upgrade.md = target` | pass (1+1) | `platform/dev/6.7/products/tools/cli/project-commands/upgrade.md:15-79` | 0 | 100 | pass | `raw/fs-wiki/dev-42.json` |
| dev-43 | `My admin plugin still ships a webpack.config.js — how do I m…` | not found | 2 | `platform/dev/6.7/guides/upgrades-migrations/administration/vite.md = target` | pass (0+1) | `platform/dev/6.7/guides/upgrades-migrations/administration/vite.md:14-73` | 0 | 100 | pass | `raw/fs-wiki/dev-43.json` |
| dev-44 | `After the Vue 3 upgrade my admin plugin broke — this.$parent…` | not found | 2 | `platform/dev/6.7/guides/upgrades-migrations/administration/vue3.md = target` | pass (0+1) | `platform/dev/6.7/guides/upgrades-migrations/administration/vue3.md:14-67` | 0 | 100 | partly | `raw/fs-wiki/dev-44.json` |
| dev-45 | `Shopware.State is deprecated in 6.7 — how do I convert my ad…` | not found | 2 | `platform/dev/6.7/guides/upgrades-migrations/administration/pinia.md = target` | pass (0+1) | `platform/dev/6.7/guides/upgrades-migrations/administration/pinia.md:14-69` | 0 | 100 | pass | `raw/fs-wiki/dev-45.json` |
| dev-46 | `sw-button and sw-card are deprecated in Shopware 6.7 — how d…` | not found | 2 | `platform/dev/6.7/guides/upgrades-migrations/administration/meteor-components.md = target` | pass (0+1) | `platform/dev/6.7/guides/upgrades-migrations/administration/meteor-components.md:14-62` | 0 | 100 | partly | `raw/fs-wiki/dev-46.json` |
| dev-47 | `My payment plugin implements `AsynchronousPaymentHandlerInte…` | not found | 3 | `platform/dev/6.7/guides/plugins/plugins/checkout/payment/add-payment-plugin.md = target` | pass (1+1) | `platform/dev/6.7/guides/plugins/plugins/checkout/payment/add-payment-plugin.md:15-93` | 0 | 100 | pass | `raw/fs-wiki/dev-47.json` |
| dev-48 | `After upgrading, my storefront JavaScript plugin no longer l…` | not found | 3 | `platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md = target` | pass (1+1) | `platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md:15-93` | 0 | 100 | pass | `raw/fs-wiki/dev-48.json` |
| dev-49 | `My storefront controller still uses the `@Route` and `@Route…` | not found | 3 | `platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-controller.md = target` | pass (1+1) | `platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-controller.md:15-89` | 0 | 100 | pass | `raw/fs-wiki/dev-49.json` |
| dev-50 | `My `ScheduledTaskHandler` stopped running after the upgrade …` | not found | 3 | `platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-scheduled-task.md = target` | pass (1+1) | `platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-scheduled-task.md:15-97` | 0 | 100 | pass | `raw/fs-wiki/dev-50.json` |
| dev-51 | `Custom entities declared in `Resources/config/entities.xml` …` | read_doc platform/index.md | 7 | `platform/dev/6.7/guides/plugins/plugins/framework/data-handling/entities-via-attributes.md = target` | pass (1+1) | `platform/dev/6.7/guides/plugins/plugins/framework/data-handling/entities-via-attributes.md:1-92` | 0 | 100 | partly | `raw/fs-wiki/dev-51.json` |
| dev-52 | `What must a plugin database migration class implement in Sho…` | not found | 2 | `platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md = target` | pass (0+1) | `platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md:1-85` | 0 | 100 | pass | `raw/fs-wiki/dev-52.json` |
| dev-53 | `My theme config labels disappeared from the Theme Manager af…` | not found | 2 | `platform/dev/6.7/guides/plugins/themes/configuration/theme-configuration.md = target` | pass (0+1) | `platform/dev/6.7/guides/plugins/themes/configuration/theme-configuration.md:1-99` | 0 | 100 | partly | `raw/fs-wiki/dev-53.json` |
| dev-54 | `How do I register a plugin cookie in the storefront cookie c…` | not found | 2 | `platform/dev/6.7/guides/plugins/plugins/storefront/advanced/add-cookie-to-manager.md = target` | pass (0+1) | `platform/dev/6.7/guides/plugins/plugins/storefront/advanced/add-cookie-to-manager.md:1-80` | 0 | 100 | pass | `raw/fs-wiki/dev-54.json` |
| dev-55 | `How do the breaking storefront accessibility changes reach m…` | not found | 3 | `platform/dev/6.7/guides/development/accessibility/storefront-accessibility.md = target` | pass (1+1) | `platform/dev/6.7/guides/development/accessibility/storefront-accessibility.md:1-76` | 0 | 100 | partly | `raw/fs-wiki/dev-55.json` |
| dev-56 | `Header and footer are loaded through ESI sub-requests in Sho…` | not found | 3 | `platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-header-footer.md = target` | pass (1+1) | `platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-header-footer.md:1-63` | 0 | 100 | pass | `raw/fs-wiki/dev-56.json` |
| dev-57 | `B2B Suite support ends with 6.8 — how do I run the B2B Suite…` | not found | 3 | `platform/dev/6.7/products/extensions/b2b-suite-migration/execution/running-migration.md = target` | pass (1+1) | `platform/dev/6.7/products/extensions/b2b-suite-migration/execution/running-migration.md:1-73` | 0 | 100 | pass | `raw/fs-wiki/dev-57.json` |
| dev-58 | `My shopware.yaml still uses redis_url — how do I define the …` | not found | 3 | `platform/dev/6.7/guides/hosting/infrastructure/redis.md = target` | pass (1+1) | `platform/dev/6.7/guides/hosting/infrastructure/redis.md:1-78` | 0 | 100 | pass | `raw/fs-wiki/dev-58.json` |
| dev-59 | `After upgrading to Shopware 6.7 my Varnish cache is never in…` | not found | 3 | `platform/dev/6.7/guides/hosting/infrastructure/reverse-http-cache.md = target` | pass (1+1) | `platform/dev/6.7/guides/hosting/infrastructure/reverse-http-cache.md:1-98` | 0 | 100 | partly | `raw/fs-wiki/dev-59.json` |
| dev-60 | `Which transports do my Shopware message queue workers have t…` | not found | 3 | `platform/dev/6.7/guides/hosting/infrastructure/message-queue.md = target` | pass (1+1) | `platform/dev/6.7/guides/hosting/infrastructure/message-queue.md:1-86` | 0 | 70 | partly | `raw/fs-wiki/dev-60.json` |
| dev-61 | `After the upgrade my Elasticsearch index has to be rebuilt —…` | read_doc platform/index.md | 5 | `platform/dev/6.7/guides/hosting/infrastructure/elasticsearch/elasticsearch-setup.md = target` | pass (1+1) | `platform/dev/6.7/guides/hosting/infrastructure/elasticsearch/elasticsearch-setup.md:40-55` | 0 | 100 | partly | `raw/fs-wiki/dev-61.json` |
| dev-62 | `I changed a setting in `.env` on a deployed 6.7 shop but it …` | not found | 5 | `platform/dev/6.7/guides/hosting/configurations/shopware/static-system-config.md ≠ target` | pass (0+1) | `platform/dev/6.7/guides/hosting/configurations/shopware/static-system-config.md:14-50` | 1 | 100 | partly | `raw/fs-wiki/dev-62.json` |
| dev-63 | `I deployed a plugin update to a 6.7 staging shop and my new …` | not found | 4 | `platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md ≠ target` | pass (drift) (2+1) | `platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md:44-59` | 0 | 100 | partly | `raw/fs-wiki/dev-63.json` |
| dev-64 | `How do I get an Admin API OAuth token — with client_credenti…` | not found | 4 | `platform/dev/6.7/guides/development/integrations-api/auth-api-requests.md = target` | pass (1+1) | `platform/dev/6.7/guides/development/integrations-api/auth-api-requests.md:25-39` | 0 | 100 | pass | `raw/fs-wiki/dev-64.json` |
| dev-65 | `What can I put in the JSON body of `POST /api/search/{entity…` | not found | 2 | `platform/dev/6.7/guides/development/integrations-api/search-criteria.md = target` | pass (0+1) | `platform/dev/6.7/guides/development/integrations-api/search-criteria.md:25-60` | 0 | 100 | pass | `raw/fs-wiki/dev-65.json` |
| dev-66 | `Which request headers change Admin API behaviour for languag…` | not found | 2 | `platform/dev/6.7/guides/development/integrations-api/request-headers.md = target` | pass (0+1) | `platform/dev/6.7/guides/development/integrations-api/request-headers.md:25-44` | 0 | 100 | partly | `raw/fs-wiki/dev-66.json` |
| dev-67 | `What does a minimal app folder and `manifest.xml` need to co…` | not found | 3 | `platform/dev/6.7/guides/plugins/apps/app-base-guide.md = target` | pass (1+1) | `platform/dev/6.7/guides/plugins/apps/app-base-guide.md:23-50` | 0 | 100 | pass | `raw/fs-wiki/dev-67.json` |
| dev-68 | `How does the registration handshake between Shopware and my …` | not found | 2 | `platform/dev/6.7/guides/plugins/apps/lifecycle/app-registration-setup.md = target` | pass (0+1) | `platform/dev/6.7/guides/plugins/apps/lifecycle/app-registration-setup.md:23-34` | 0 | 100 | pass | `raw/fs-wiki/dev-68.json` |
| dev-69 | `How does an app subscribe to an event like `product.written`…` | not found | 2 | `platform/dev/6.7/guides/plugins/apps/lifecycle/webhook.md = target` | pass (0+1) | `platform/dev/6.7/guides/plugins/apps/lifecycle/webhook.md:25-46` | 0 | 100 | pass | `raw/fs-wiki/dev-69.json` |
| dev-70 | `How do I implement a payment method in an app with `pay-url`…` | not found | 2 | `platform/dev/6.7/guides/plugins/apps/checkout/payment.md = target` | pass (0+1) | `platform/dev/6.7/guides/plugins/apps/checkout/payment.md:24-49` | 0 | 100 | partly | `raw/fs-wiki/dev-70.json` |
| dev-71 | `How does an app define its own custom entities in Shopware 6…` | read_doc platform/index.md | 4 | `platform/dev/6.7/guides/plugins/apps/custom-data/custom-entities.md = target` | pass (1+1) | `platform/dev/6.7/guides/plugins/apps/custom-data/custom-entities.md:15-78` | 0 | 100 | pass | `raw/fs-wiki/dev-71.json` |
| func-01 | `How do I create a product with variants and configure its vi…` | not found | 4 | `platform/func/catalogues/products.md = target` | pass (1+1) | `platform/func/catalogues/products.md:18-52` | 1 | 100 | partly | `raw/fs-wiki/func-01.json` |
| func-02 | `How do Rule Builder conditions work for shipping and payment…` | not found | 4 | `platform/func/settings/shipping.md ≠ target` | pass (drift) (1+1) | `platform/func/settings/shipping.md:18-47` | 0 | 100 | partly | `raw/fs-wiki/func-02.json` |
| func-03 | `How do promotions and discount codes work, including individ…` | not found | 2 | `platform/func/marketing/promotions.md = target` | pass (0+1) | `platform/func/marketing/promotions.md:18-55` | 0 | 100 | pass | `raw/fs-wiki/func-03.json` |
| func-04 | `What does the Shopware Migration Assistant transfer automati…` | not found | 2 | `platform/func/migration-en/what-is-migrated.md = target` | pass (0+1) | `platform/func/migration-en/what-is-migrated.md:18-43` | 0 | 100 | partly | `raw/fs-wiki/func-04.json` |
| func-05 | `How do I set up a sales channel — storefront versus headless…` | not found | 3 | `platform/func/settings/saleschannel.md = target` | pass (1+1) | `platform/func/settings/saleschannel.md:18-47` | 0 | 100 | partly | `raw/fs-wiki/func-05.json` |
| func-06 | `Which triggers and actions does the Flow Builder offer, and …` | not found | 2 | `platform/func/settings/Flow-Builder.md = target` | pass (0+1) | `platform/func/settings/Flow-Builder.md:18-57` | 0 | 100 | partly | `raw/fs-wiki/func-06.json` |
| func-07 | `How do I import products from a CSV with an import/export pr…` | not found | 2 | `platform/func/shopware-en/settings/importexport.md = target` | pass (0+1) | `platform/func/shopware-en/settings/importexport.md:18-64` | 0 | 100 | partly | `raw/fs-wiki/func-07.json` |
| func-08 | `How do custom field sets work — entity assignment, field typ…` | not found | 2 | `platform/func/settings/custom-fields.md = target` | pass (0+1) | `platform/func/settings/custom-fields.md:18-45` | 0 | 100 | partly | `raw/fs-wiki/func-08.json` |
| func-09 | `Why doesn't my payment method appear in the checkout — what …` | not found | 1 | `platform/func/settings/Paymentmethods.md = target` | fail (0+1) | `platform/func/settings/Paymentmethods.md:18-47` | 1 | 100 | partly | `raw/fs-wiki/func-09.json` |
| func-10 | `How do dynamic product groups work in the administration and…` | read_doc platform/index.md | 5 | `platform/func/shopware-6-de/Catalogues/Dynamicproductgroups.md = target` | pass (2+1) | `platform/func/shopware-6-de/Catalogues/Dynamicproductgroups.md:22-46` | 0 | 100 | partly | `raw/fs-wiki/func-10.json` |
| func-11 | `How do I create an integration for Admin API access in the a…` | not found | 3 | `platform/func/settings/system/integrationen.md = target` | pass (1+1) | `platform/func/settings/system/integrationen.md:22-45` | 0 | 100 | pass | `raw/fs-wiki/func-11.json` |
| func-12 | `A spec asks for customer-specific pricing and for a flow tha…` | not found | 6 | `platform/func/extensions/customer-specific-pricing.md ≠ target` | fail (1+1) | `platform/func/extensions/customer-specific-pricing.md:18-38` | 0 | 100 | pass | `raw/fs-wiki/func-12.json` |
| edge-01 | `How do I configure Shopware 6's built-in GraphQL API for the…` | not found | 3 | `—` | n/a | `—` | 1 | 100 | unavailable | `raw/fs-wiki/edge-01.json` |
| edge-02 | `How do I get the DI container with `Shopware()->Container()`…` | not found | 3 | `—` | n/a | `—` | 1 | 0 under-reported (1) | unavailable | `raw/fs-wiki/edge-02.json` |
| edge-03 | `Where do the `#[ORM\Entity]` mapping attributes for my plugi…` | not found | 3 | `platform/dev/6.7/concepts/framework/data-abstraction-layer.md ≠ target` | n/a | `platform/dev/6.7/concepts/framework/data-abstraction-layer.md:15-58` | 0 | 100 | pass | `raw/fs-wiki/edge-03.json` |
| edge-04 | `How do I fetch products with `GET /sales-channel-api/v3/prod…` | not found | 5 | `platform/dev/6.7/concepts/api/store-api.md ≠ target` | n/a | `platform/dev/6.7/concepts/api/store-api.md:14-41` | 1 | 100 | pass | `raw/fs-wiki/edge-04.json` |
| edge-05 | `How do I enable Shopware's built-in MCP server on a Shopware…` | not found | 5 | `platform/dev/6.7/products/tools/mcp-server/intro.md = target` | n/a | `platform/dev/6.7/products/tools/mcp-server/intro.md:16-61` | 0 | 100 | pass | `raw/fs-wiki/edge-05.json` |
| edge-06 | `I'm coming from Magento — what are the Shopware equivalents …` | not found | 6 | `platform/func/migration-en/magento-keywords.md = target` | n/a | `platform/func/migration-en/magento-keywords.md:18-56` | 1 | 100 | partly | `raw/fs-wiki/edge-06.json` |
| edge-07 | `How do I set up Shopware PWA as the storefront for a Shopwar…` | not found | 4 | `platform/dev/6.6/products/pwa.md = target` | n/a | `platform/dev/6.6/products/pwa.md:15-31` | 0 | 0 under-reported (1) | partly | `raw/fs-wiki/edge-07.json` |
| edge-08 | `Which service do I type-hint to read products — `EntityRepos…` | read_doc platform/index.md | 4 | `platform/dev/6.7/guides/plugins/plugins/framework/data-handling/reading-data.md ≠ target` | n/a | `platform/dev/6.7/guides/plugins/plugins/framework/data-handling/reading-data.md:23-37` | 0 | 100 | pass | `raw/fs-wiki/edge-08.json` |
| edge-09 | `Where do I configure Business Events so that a mail is sent …` | not found | 5 | `platform/func/settings/Business-Events.md = target` | n/a | `platform/func/settings/Business-Events.md:18-38` | 0 | 100 | fail | `raw/fs-wiki/edge-09.json` |
| gap-01 | `How do I add my own Admin API endpoint under `/api/...` from…` | not found | 6 | `platform/dev/6.7/concepts/api/admin-api.md ≠ target` | n/a | `platform/dev/6.7/concepts/api/admin-api.md:14-33` | 2 | 100 | partly | `raw/fs-wiki/gap-01.json` |
| gap-02 | `Shopware 6.7 removed the RSA JWT key files and `system:gener…` | not found | 12 | `platform/dev/6.7/guides/hosting/configurations/shopware/environment-variables.md ≠ target` | n/a | `platform/dev/6.7/guides/hosting/configurations/shopware/environment-variables.md:23-38` | 1 | 100 | pass | `raw/fs-wiki/gap-02.json` |
| gap-03 | `My ERP integration stopped logging in after the 6.7 upgrade …` | not found | 5 | `platform/dev/6.7/guides/development/integrations-api/_index.md ≠ target` | n/a | `platform/dev/6.7/guides/development/integrations-api/_index.md:23-46` | 0 | 100 | partly | `raw/fs-wiki/gap-03.json` |
| gap-04 | `After upgrading to 6.7 my plugin fatals on load because core…` | not found | 7 | `platform/dev/6.7/resources/guidelines/code/core/writing-code-for-static-analysis.md ≠ target` | n/a | `platform/dev/6.7/resources/guidelines/code/core/writing-code-for-static-analysis.md:55-64` | 0 | 100 | pass | `raw/fs-wiki/gap-04.json` |
| gap-05 | `My plugin decorates `CachedProductRoute` to add cache tags —…` | not found | 3 | `platform/dev/6.7/resources/references/adr/2025-09-15-store-api-cache-strategy.md ≠ target` | n/a | `platform/dev/6.7/resources/references/adr/2025-09-15-store-api-cache-strategy.md:14-77` | 0 | 100 | partly | `raw/fs-wiki/gap-05.json` |
| gap-06 | `How do I create a shipping method from my plugin's installer…` | not found | 6 | `platform/dev/6.7/resources/references/adr/2023-10-17-add-unique-identifiers-for-checkout-methods.md ≠ target` | n/a | `platform/dev/6.7/resources/references/adr/2023-10-17-add-unique-identifiers-for-checkout-methods.md:14-65` | 1 | 100 | pass | `raw/fs-wiki/gap-06.json` |
| gap-07 | `How do I create a media entity from a file on disk in PHP fr…` | not found | 6 | `platform/dev/6.7/guides/plugins/plugins/content/media/_index.md ≠ target` | n/a | `platform/dev/6.7/guides/plugins/plugins/content/media/_index.md:14-38` | 1 | 100 | partly | `raw/fs-wiki/gap-07.json` |
| gap-08 | `How do I set up a Nuxt project with Shopware Composable Fron…` | not found | 6 | `platform/dev/6.7/concepts/api/store-api.md ≠ target` | n/a | `platform/dev/6.7/concepts/api/store-api.md:14-34` | 0 | 100 | pass | `raw/fs-wiki/gap-08.json` |
| rule-01 | `May I extend (subclass) a concrete Shopware core service to …` | read_doc platform/index.md | 5 | `platform/guidelines/6.7/architecture-guidelines.md ≠ target` | pass (drift) (2+1) | `platform/guidelines/6.7/architecture-guidelines.md:18-37` | 0 | 100 | pass | `raw/fs-wiki/rule-01.json` |
| rule-02 | `Where should cleanup of my plugin's own data on uninstall go…` | not found | 2 | `platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/plugin-lifecycle.md ≠ target` | pass (drift) (0+1) | `platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/plugin-lifecycle.md:37-70` | 0 | 100 | pass | `raw/fs-wiki/rule-02.json` |
| rule-03 | `Which annotations mark a core class or method as off-limits …` | not found | 1 | `platform/guidelines/6.7/architecture-guidelines.md = target` | fail (0+1) | `platform/guidelines/6.7/architecture-guidelines.md:79-92` | 0 | 100 | pass | `raw/fs-wiki/rule-03.json` |
| rule-04 | `How should my plugin throw exceptions so they follow Shopwar…` | not found | 2 | `platform/guidelines/6.7/code-guidelines.md = target` | pass (0+1) | `platform/guidelines/6.7/code-guidelines.md:19-67` | 0 | 0 under-reported (1) | partly | `raw/fs-wiki/rule-04.json` |
| rule-05 | `Which test level should I pick for a change to a DAL entity …` | not found | 2 | `platform/guidelines/6.7/qa-guidelines.md ≠ target` | pass (drift) (0+1) | `platform/guidelines/6.7/qa-guidelines.md:18-76` | 0 | 0 under-reported (1) | partly | `raw/fs-wiki/rule-05.json` |
| rule-06 | `Can a storefront controller contain business logic, or where…` | not found | 1 | `platform/guidelines/6.7/architecture-guidelines.md ≠ target` | pass (drift) (0+1) | `platform/guidelines/6.7/architecture-guidelines.md:57-67` | 0 | 100 | pass | `raw/fs-wiki/rule-06.json` |

## Scores by case

### fs-wiki

| Case | Grounding | Accuracy | Completeness | Citation | Honesty | Actionability | Points | Total | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dev-01 | 100 | 70 | 70 | 100 | 100 | 100 | 25.0+17.5+10.5+10.0+15.0+10.0 | 88% | pass |
| dev-02 | 100 | 70 | 70 | 100 | 100 | 100 | 25.0+17.5+10.5+10.0+15.0+10.0 | 88% | pass |
| dev-03 | 100 | 100 | 100 | 100 | 100 | 100 | 25.0+25.0+15.0+10.0+15.0+10.0 | 100% | pass |
| dev-04 | 100 | 70 | 70 | 100 | 100 | 100 | 25.0+17.5+10.5+10.0+15.0+10.0 | 88% | pass |
| dev-05 | 100 | 70 | 100 | 100 | 100 | 100 | 25.0+17.5+15.0+10.0+15.0+10.0 | 92% | pass |
| dev-06 | 100 | 70 | 100 | 100 | 100 | 100 | 25.0+17.5+15.0+10.0+15.0+10.0 | 92% | pass |
| dev-07 | 100 | 40 | 70 | 100 | 100 | 100 | 25.0+10.0+10.5+10.0+15.0+10.0 | 80% | partly |
| dev-08 | 100 | 70 | 100 | 100 | 100 | 100 | 25.0+17.5+15.0+10.0+15.0+10.0 | 92% | pass |
| dev-09 | 100 | 70 | 70 | 100 | 100 | 100 | 25.0+17.5+10.5+10.0+15.0+10.0 | 88% | pass |
| dev-10 | 100 | 70 | 100 | 100 | 100 | 100 | 25.0+17.5+15.0+10.0+15.0+10.0 | 92% | pass |
| dev-11 | 70 | 40 | 40 | 100 | 100 | 70 | 17.5+10.0+6.0+10.0+15.0+7.0 | 65% | partly |
| dev-12 | 70 | 40 | 40 | 100 | 100 | 70 | 17.5+10.0+6.0+10.0+15.0+7.0 | 65% | partly |
| dev-13 | 100 | 70 | 70 | 100 | 100 | 100 | 25.0+17.5+10.5+10.0+15.0+10.0 | 88% | pass |
| dev-14 | 100 | 100 | 100 | 100 | 100 | 100 | 25.0+25.0+15.0+10.0+15.0+10.0 | 100% | pass |
| dev-15 | 100 | 70 | 40 | 100 | 100 | 70 | 25.0+17.5+6.0+10.0+15.0+7.0 | 80% | partly |
| dev-16 | 70 | 40 | 40 | 100 | 100 | 70 | 17.5+10.0+6.0+10.0+15.0+7.0 | 65% | partly |
| dev-17 | 100 | 70 | 70 | 100 | 100 | 100 | 25.0+17.5+10.5+10.0+15.0+10.0 | 88% | pass |
| dev-18 | 70 | 40 | 40 | 100 | 100 | 40 | 17.5+10.0+6.0+10.0+15.0+4.0 | 62% | partly |
| dev-19 | 100 | 70 | 100 | 100 | 100 | 100 | 25.0+17.5+15.0+10.0+15.0+10.0 | 92% | pass |
| dev-20 | 100 | 100 | 100 | 100 | 100 | 100 | 25.0+25.0+15.0+10.0+15.0+10.0 | 100% | pass |
| dev-21 | 70 | 40 | 0 | 100 | 0 | 40 | 17.5+10.0+0.0+10.0+0.0+4.0 | 41% | fail |
| dev-22 | 100 | 100 | 100 | 100 | 100 | 100 | 25.0+25.0+15.0+10.0+15.0+10.0 | 100% | pass |
| dev-23 | 100 | 40 | 40 | 100 | 100 | 100 | 25.0+10.0+6.0+10.0+15.0+10.0 | 76% | partly |
| dev-24 | 100 | 100 | 100 | 100 | 100 | 100 | 25.0+25.0+15.0+10.0+15.0+10.0 | 100% | pass |
| dev-25 | 100 | 70 | 70 | 100 | 100 | 100 | 25.0+17.5+10.5+10.0+15.0+10.0 | 88% | pass |
| dev-26 | 100 | 0 | 0 | 100 | 100 | 100 | 25.0+0.0+0.0+10.0+15.0+10.0 | 60% | partly |
| dev-27 | 100 | 100 | 100 | 100 | 100 | 100 | 25.0+25.0+15.0+10.0+15.0+10.0 | 100% | pass |
| dev-28 | 100 | 100 | 70 | 100 | 100 | 100 | 25.0+25.0+10.5+10.0+15.0+10.0 | 95% | pass |
| dev-29 | 100 | 100 | 70 | 100 | 100 | 100 | 25.0+25.0+10.5+10.0+15.0+10.0 | 95% | pass |
| dev-30 | 100 | 100 | 70 | 100 | 100 | 100 | 25.0+25.0+10.5+10.0+15.0+10.0 | 95% | pass |
| dev-31 | 100 | 100 | 70 | 100 | 100 | 100 | 25.0+25.0+10.5+10.0+15.0+10.0 | 95% | pass |
| dev-32 | 100 | 100 | 70 | 100 | 100 | 100 | 25.0+25.0+10.5+10.0+15.0+10.0 | 95% | pass |
| dev-33 | 100 | 40 | 70 | 100 | 100 | 70 | 25.0+10.0+10.5+10.0+15.0+7.0 | 77% | partly |
| dev-34 | 100 | 100 | 100 | 100 | 100 | 100 | 25.0+25.0+15.0+10.0+15.0+10.0 | 100% | pass |
| dev-35 | 100 | 40 | 70 | 100 | 100 | 100 | 25.0+10.0+10.5+10.0+15.0+10.0 | 80% | partly |
| dev-36 | 100 | 100 | 70 | 100 | 100 | 100 | 25.0+25.0+10.5+10.0+15.0+10.0 | 95% | pass |
| dev-37 | 100 | 100 | 70 | 100 | 100 | 100 | 25.0+25.0+10.5+10.0+15.0+10.0 | 95% | pass |
| dev-38 | 100 | 40 | 40 | 100 | 100 | 70 | 25.0+10.0+6.0+10.0+15.0+7.0 | 73% | partly |
| dev-39 | 100 | 70 | 40 | 100 | 100 | 40 | 25.0+17.5+6.0+10.0+15.0+4.0 | 77% | partly |
| dev-40 | 100 | 100 | 100 | 100 | 100 | 100 | 25.0+25.0+15.0+10.0+15.0+10.0 | 100% | pass |
| dev-41 | 100 | 100 | 70 | 100 | 0 | 70 | 25.0+25.0+10.5+10.0+0.0+7.0 | 77% | partly |
| dev-42 | 100 | 100 | 100 | 100 | 100 | 100 | 25.0+25.0+15.0+10.0+15.0+10.0 | 100% | pass |
| dev-43 | 100 | 100 | 100 | 100 | 100 | 100 | 25.0+25.0+15.0+10.0+15.0+10.0 | 100% | pass |
| dev-44 | 100 | 40 | 40 | 100 | 100 | 70 | 25.0+10.0+6.0+10.0+15.0+7.0 | 73% | partly |
| dev-45 | 100 | 100 | 100 | 100 | 100 | 100 | 25.0+25.0+15.0+10.0+15.0+10.0 | 100% | pass |
| dev-46 | 100 | 40 | 40 | 100 | 100 | 40 | 25.0+10.0+6.0+10.0+15.0+4.0 | 70% | partly |
| dev-47 | 100 | 100 | 100 | 100 | 100 | 100 | 25.0+25.0+15.0+10.0+15.0+10.0 | 100% | pass |
| dev-48 | 100 | 100 | 100 | 100 | 100 | 100 | 25.0+25.0+15.0+10.0+15.0+10.0 | 100% | pass |
| dev-49 | 100 | 100 | 100 | 100 | 100 | 100 | 25.0+25.0+15.0+10.0+15.0+10.0 | 100% | pass |
| dev-50 | 100 | 100 | 100 | 100 | 100 | 100 | 25.0+25.0+15.0+10.0+15.0+10.0 | 100% | pass |
| dev-51 | 100 | 40 | 70 | 100 | 100 | 100 | 25.0+10.0+10.5+10.0+15.0+10.0 | 80% | partly |
| dev-52 | 100 | 70 | 70 | 100 | 100 | 100 | 25.0+17.5+10.5+10.0+15.0+10.0 | 88% | pass |
| dev-53 | 100 | 40 | 70 | 100 | 100 | 100 | 25.0+10.0+10.5+10.0+15.0+10.0 | 80% | partly |
| dev-54 | 100 | 70 | 70 | 100 | 100 | 100 | 25.0+17.5+10.5+10.0+15.0+10.0 | 88% | pass |
| dev-55 | 70 | 40 | 40 | 100 | 100 | 70 | 17.5+10.0+6.0+10.0+15.0+7.0 | 65% | partly |
| dev-56 | 100 | 70 | 100 | 100 | 100 | 100 | 25.0+17.5+15.0+10.0+15.0+10.0 | 92% | pass |
| dev-57 | 100 | 100 | 100 | 100 | 100 | 100 | 25.0+25.0+15.0+10.0+15.0+10.0 | 100% | pass |
| dev-58 | 100 | 70 | 70 | 100 | 100 | 100 | 25.0+17.5+10.5+10.0+15.0+10.0 | 88% | pass |
| dev-59 | 100 | 40 | 70 | 100 | 100 | 70 | 25.0+10.0+10.5+10.0+15.0+7.0 | 77% | partly |
| dev-60 | 70 | 40 | 40 | 100 | 70 | 70 | 17.5+10.0+6.0+10.0+10.5+7.0 | 61% | partly |
| dev-61 | 100 | 40 | 70 | 100 | 100 | 100 | 25.0+10.0+10.5+10.0+15.0+10.0 | 80% | partly |
| dev-62 | 70 | 40 | 40 | 100 | 100 | 70 | 17.5+10.0+6.0+10.0+15.0+7.0 | 65% | partly |
| dev-63 | 100 | 70 | 40 | 100 | 100 | 100 | 25.0+17.5+6.0+10.0+15.0+10.0 | 83% | partly |
| dev-64 | 100 | 70 | 70 | 100 | 100 | 100 | 25.0+17.5+10.5+10.0+15.0+10.0 | 88% | pass |
| dev-65 | 100 | 70 | 70 | 100 | 100 | 100 | 25.0+17.5+10.5+10.0+15.0+10.0 | 88% | pass |
| dev-66 | 70 | 40 | 40 | 100 | 100 | 70 | 17.5+10.0+6.0+10.0+15.0+7.0 | 65% | partly |
| dev-67 | 100 | 100 | 100 | 100 | 100 | 100 | 25.0+25.0+15.0+10.0+15.0+10.0 | 100% | pass |
| dev-68 | 100 | 100 | 100 | 100 | 100 | 100 | 25.0+25.0+15.0+10.0+15.0+10.0 | 100% | pass |
| dev-69 | 100 | 100 | 100 | 100 | 100 | 100 | 25.0+25.0+15.0+10.0+15.0+10.0 | 100% | pass |
| dev-70 | 70 | 40 | 40 | 100 | 100 | 70 | 17.5+10.0+6.0+10.0+15.0+7.0 | 65% | partly |
| dev-71 | 100 | 70 | 70 | 100 | 100 | 100 | 25.0+17.5+10.5+10.0+15.0+10.0 | 88% | pass |
| func-01 | 70 | 40 | 40 | 100 | 100 | 70 | 17.5+10.0+6.0+10.0+15.0+7.0 | 65% | partly |
| func-02 | 70 | 70 | 40 | 100 | 100 | 70 | 17.5+17.5+6.0+10.0+15.0+7.0 | 73% | partly |
| func-03 | 100 | 100 | 100 | 100 | 100 | 100 | 25.0+25.0+15.0+10.0+15.0+10.0 | 100% | pass |
| func-04 | 100 | 40 | 70 | 100 | 100 | 70 | 25.0+10.0+10.5+10.0+15.0+7.0 | 77% | partly |
| func-05 | 100 | 40 | 40 | 100 | 100 | 70 | 25.0+10.0+6.0+10.0+15.0+7.0 | 73% | partly |
| func-06 | 100 | 40 | 70 | 100 | 100 | 100 | 25.0+10.0+10.5+10.0+15.0+10.0 | 80% | partly |
| func-07 | 100 | 40 | 70 | 100 | 100 | 100 | 25.0+10.0+10.5+10.0+15.0+10.0 | 80% | partly |
| func-08 | 100 | 40 | 70 | 100 | 100 | 100 | 25.0+10.0+10.5+10.0+15.0+10.0 | 80% | partly |
| func-09 | 70 | 40 | 70 | 100 | 100 | 70 | 17.5+10.0+10.5+10.0+15.0+7.0 | 70% | partly |
| func-10 | 100 | 40 | 70 | 100 | 100 | 100 | 25.0+10.0+10.5+10.0+15.0+10.0 | 80% | partly |
| func-11 | 100 | 70 | 100 | 100 | 100 | 100 | 25.0+17.5+15.0+10.0+15.0+10.0 | 92% | pass |
| func-12 | 100 | 70 | 70 | 100 | 100 | 100 | 25.0+17.5+10.5+10.0+15.0+10.0 | 88% | pass |
| edge-01 | 100 | 100 | 0 | 100 | 100 | 100 | 25.0+25.0+0.0+10.0+15.0+10.0 | 85% | unavailable |
| edge-02 | 100 | 100 | 0 | 100 | 0 | 100 | 25.0+25.0+0.0+10.0+0.0+10.0 | 70% | unavailable |
| edge-03 | 100 | 100 | 100 | 100 | 100 | 100 | 25.0+25.0+15.0+10.0+15.0+10.0 | 100% | pass |
| edge-04 | 100 | 70 | 70 | 100 | 100 | 100 | 25.0+17.5+10.5+10.0+15.0+10.0 | 88% | pass |
| edge-05 | 100 | 100 | 100 | 100 | 100 | 100 | 25.0+25.0+15.0+10.0+15.0+10.0 | 100% | pass |
| edge-06 | 70 | 40 | 40 | 100 | 100 | 40 | 17.5+10.0+6.0+10.0+15.0+4.0 | 62% | partly |
| edge-07 | 100 | 70 | 70 | 100 | 0 | 70 | 25.0+17.5+10.5+10.0+0.0+7.0 | 70% | partly |
| edge-08 | 100 | 100 | 100 | 100 | 100 | 100 | 25.0+25.0+15.0+10.0+15.0+10.0 | 100% | pass |
| edge-09 | 70 | 0 | 40 | 100 | 100 | 40 | 17.5+0.0+6.0+10.0+15.0+4.0 | 52% | fail |
| gap-01 | 100 | 40 | 70 | 100 | 100 | 40 | 25.0+10.0+10.5+10.0+15.0+4.0 | 74% | partly |
| gap-02 | 100 | 100 | 100 | 70 | 100 | 70 | 25.0+25.0+15.0+7.0+15.0+7.0 | 94% | pass |
| gap-03 | 100 | 70 | 40 | 100 | 100 | 40 | 25.0+17.5+6.0+10.0+15.0+4.0 | 77% | partly |
| gap-04 | 100 | 70 | 70 | 100 | 100 | 70 | 25.0+17.5+10.5+10.0+15.0+7.0 | 85% | pass |
| gap-05 | 70 | 40 | 40 | 100 | 100 | 70 | 17.5+10.0+6.0+10.0+15.0+7.0 | 65% | partly |
| gap-06 | 100 | 70 | 100 | 100 | 100 | 70 | 25.0+17.5+15.0+10.0+15.0+7.0 | 89% | pass |
| gap-07 | 100 | 40 | 40 | 100 | 100 | 40 | 25.0+10.0+6.0+10.0+15.0+4.0 | 70% | partly |
| gap-08 | 100 | 100 | 100 | 100 | 100 | 70 | 25.0+25.0+15.0+10.0+15.0+7.0 | 97% | pass |
| rule-01 | 100 | 100 | 100 | 100 | 100 | 100 | 25.0+25.0+15.0+10.0+15.0+10.0 | 100% | pass |
| rule-02 | 100 | 100 | 100 | 100 | 100 | 100 | 25.0+25.0+15.0+10.0+15.0+10.0 | 100% | pass |
| rule-03 | 100 | 100 | 100 | 100 | 100 | 100 | 25.0+25.0+15.0+10.0+15.0+10.0 | 100% | pass |
| rule-04 | 100 | 70 | 70 | 100 | 0 | 100 | 25.0+17.5+10.5+10.0+0.0+10.0 | 73% | partly |
| rule-05 | 100 | 70 | 70 | 100 | 0 | 100 | 25.0+17.5+10.5+10.0+0.0+10.0 | 73% | partly |
| rule-06 | 100 | 100 | 100 | 100 | 100 | 100 | 25.0+25.0+15.0+10.0+15.0+10.0 | 100% | pass |

`unavailable` means the Source-absent override applied — the corpus had nothing and the agent honestly reported that; it is not a failure.
## Failures and official references

- **dev-21 (fs-wiki)** — fail, 41%
  - Honesty violation: selfReportDelta shows a materially under-reported toolCallLog — 3 calls self-reported vs 12 in the ground-truth transcript, with one Bash find call entirely missing from the report's own log.
  - The answer recommends subscribing to BusinessEventCollectorEvent with a high priority ('docs recommend 1000') — this is exactly the Trap the case is built to catch: the expected-answer file explicitly states 'An answer that passes must not require an elevated priority.' The report repeats the disproven docs recipe verbatim.
  - FlowEventAware's required static getAvailableData()/getName() methods are never named — the answer says only 'implement FlowEventAware' without specifying the contract.
  - Fact 3 (runtime firing keyed on $event->getName(), the define($class,$customName) pitfall, flow.storer/ScalarValuesAware for data) is entirely absent.
  - Official: code: Framework/Event/BusinessEventCollector.php:27-49 — "No priority is load-bearing: the collection is filled before dispatch, the sole core listener runs at default priority 0"
- **edge-09 (fs-wiki)** — fail, 52%
  - Fails the case's core trap: repeats the doc's unconfirmed 'still used by the B2B Suite' framing as fact, which the expected answer explicitly says no core code confirms.
  - Worse, the answer asserts the legacy Business Events screen ('Settings > Shop > Business Events', 'Add Business-Event' form) is still usable — but per the confirmed evidence no such admin screen exists at all in 6.6 or 6.7 (its tables were dropped by a V6_5 migration). This is a direct fabrication of a working UI flow.
  - Correctly names Flow Builder, sw-flow, checkout.order.placed trigger and the Send mail action as the real 6.7 path.
  - Does not mention that 'Business Event' survives only as a read-only event catalogue (GET /api/_info/events.json) with no write side.
  - Official: code: Migration/V6_5/Migration1670854818RemoveEventActionTable.php:24-29 — "no Business Events configuration screen exists in the 6.6 or 6.7 administration … the event_action, event_action_rule and event_action_sales_channel tables are dropped by a V6_5 migration"
- **dev-26 (fs-wiki)** — partly, 60%
  - Case is a documented trap: at 6.7.13.0 the correct answer is the legacy v1 document-renderer stack (AbstractDocumentRenderer/document_type row); the v2 stack (AbstractDocumentDataProvider, shopware.document_v2.type tag) does not exist in the installed code, only from 6.7.14.0/6.8.0.0.
  - The report built its entire answer on the v2 recipe (which is the wiki page it read, itself the documentation trap) and none of the three expected legacy-stack facts appear.
  - Answer is faithfully grounded in the page it cited (excerpt matches the v2-stack claims), so this is a source-content failure the agent reproduced verbatim, not a fabrication outside the source.
  - Official: code: Checkout/DependencyInjection/documentV2.php:62-128 — "documentV2.php at 6.7.13.0 registers exactly two v2 tags — shopware.document_v2.provider and shopware.document_v2.renderer … with no compiler pass and no .type tag"
- **dev-60 (fs-wiki)** — partly, 61%
  - Directly contradicts fact 3: the answer states 'you should also run a worker for the failed transport or failed messages are never retried/processed', but the expected facts (confirmed against code) state `failed` is a dead-letter target drained only with `messenger:failed:retry`/`:show`/`:remove` — never a transport a standing worker consumes. This is a materially wrong instruction.
  - Fact 2 (disabling the admin worker makes `scheduled-task:run` mandatory, because TaskScheduler::queueScheduledTasks() has only two callers) is missing entirely — the answer only covers the config key to disable the admin worker, not the consequence.
  - Fact 1 (name transports explicitly, nothing appends low_priority implicitly) is present and correct.
  - Official: code: symfony/messenger EventListener/SendFailedMessageToFailureTransportListener.php:37-74 — "A message that exhausts async's max_retries: 3 is moved to failed, not deleted"
- **dev-18 (fs-wiki)** — partly, 62%
  - The answer claims that building the surcharge fresh each pass and calling `$toCalculate->add(item)` 'naturally avoids duplicate additions' — this directly contradicts fact 2: LineItemCollection::add() on an already-present line-item id does not replace it, it sums the quantities, which is exactly the duplication bug the query describes. This is a materially wrong diagnosis of the case's central problem.
  - Fact 1's specific detail that $toCalculate is a brand-new empty Cart each pass, and that all collectors run before any processor, is only loosely implied, not stated.
  - Fact 3 (stale price caused by CartDataCollection carried forward via $cart->setData($original->getData()); recompute the price inside process() every pass) is not addressed.
  - Official: code: Checkout/Cart/LineItem/LineItemCollection.php:30-53 — "if ($exists) { $newQuantity = $lineItem->getQuantity() + $exists->getQuantity(); … $exists->setQuantity($newQuantity); $exists->markModified(); return; }"
- **edge-06 (fs-wiki)** — partly, 62%
  - Fails the trap on attribute sets: states 'Magento Attribute Sets map to Shopware Custom field sets' as a direct equivalence, when the expected fact requires stating there is no counterpart object at all.
  - Omits the App mechanism entirely (manifest.xml) — only names Plugin as the extension equivalent, missing half of the required dual answer.
  - di.xml / Symfony DI mechanism is covered correctly.
  - Store-view / sales-channel mapping is present but lacks the domain-level granularity (per-URL language/currency) the fact requires.
  - Official: code: System/CustomField/Aggregate/CustomFieldSetRelation/CustomFieldSetRelationDefinition.php:19,46-47 — "there is no attribute-set equivalent: no attribute_set entity exists and a product is never assigned to one set"
- **dev-11 (fs-wiki)** — partly, 65%
  - The audit's targetPath (services/dependency-injection.md) was never read (targetRead=false, callsToTarget=0); the answer is drawn from a different page, services/add-custom-service.md.
  - The answer attributes the services.xml-vs-services.php shift to 'Symfony 7.4 deprecating XML', whereas the case's decisive fact is Shopware's own version-gated loader behaviour (silent up to 6.7.13.0, deprecation warning from 6.7.14.0) — a different and materially inaccurate causal claim.
  - Fact 3 (explicit constructor-argument passing when autowiring is off, and the DAL-repository autowiring-alias exception) is entirely unaddressed.
  - findability fail: target page never read; 3 list/grep calls preceded reading a different page.
  - Official: code: v6.7.14.0 src/Core/Framework/Bundle.php:237-268 — "the deprecation landed one patch later, in released tag v6.7.14.0 (and trunk): triggerXmlConfigDeprecation() runs before each load … Feature::triggerDeprecationOrThrow('v6.8.0.0', …)"
- **dev-12 (fs-wiki)** — partly, 65%
  - Target page (plugin-fundamentals/dependency-injection.md) was never read (targetRead=false); the answer states 'Shopware automatically loads a file with exactly this name' for services.xml, contradicting fact 1's claim that the glob loads every matching services.* file (xml/yaml/php), not only one exact filename.
  - Fact 3 (constructor arguments are NOT autowired by default; Symfony Definition defaults autowired=false; mechanism identical in 6.7) is never mentioned — a decisive fact for this case is entirely missing.
  - One cited page (use-plugin-configuration.md) shows matchesToolCallLog=false in the audit though the report's own toolCallLog lists a Read of it; selfReportDelta shows the self-report over-states call count (5 reported vs 3 actual) rather than under-stating it, so the rubric's honesty-0 trigger (non-empty `missing`) is not met.
  - Official: code: github v6.6.10.24 src/Core/Framework/Bundle.php:188-210 — "foreach ($this->getServicesFilePathArray($this->getPath() . '/Resources/config/services.*') as $path)"
- **dev-16 (fs-wiki)** — partly, 65%
  - Target page (checkout/order/listen-to-order-changes.md) was never read (targetRead=false); the answer is drawn from a different, general data-handling events page.
  - The answer claims reading WriteCommand::getPayload() during the pre-write event lets you capture 'an old value before it's overwritten' — this is materially misleading: the expected-answer facts show a before/after ChangeSet is opt-in via ChangeSetAware::requestChangeSet(), and plain getPayload() only exposes the fields being written, not a diff.
  - The ChangeSetAware/requestChangeSet()/getChangeSet() mechanism (facts 2 and 3), the UpdateCommand/DeleteCommand-only restriction, and the storage-name-keyed ChangeSet are entirely absent — this is precisely the 'find out exactly which fields changed' half of the query.
  - Official: code: Framework/DataAbstractionLayer/Write/Command/ChangeSetAware.php:18-22 — "public function requestChangeSet(): void;"
- **dev-55 (fs-wiki)** — partly, 65%
  - Fact 2 (sw_extends resolution: unmodified blocks silently pick up new markup, overridden blocks keep stale markup, a removed block a theme still overrides is silently dropped unless {{ parent() }} is called, which throws a Twig RuntimeError) is not present — the answer instead describes the 6.6-era transitional 'extend the new inner block, remove the deprecated override after 6.7.0' pattern, which misframes the 6.7-specific silent-drop mechanic.
  - Fact 3 (concrete re-adoption examples: cart line-item wrapper, product-card stretched-link, SCSS $font-size-base default, JS active-filter <button>) is not present beyond a generic 'recompile the theme' note.
  - Fact 1 (flag inert in 6.7, changes unconditional) is present and correct.
  - Official: code: Framework/Resources/config/packages/feature.yaml:24-28 — "the flag itself still exists as a declaration (major: true, default: true) but nothing in core or storefront reads it … the flag-based advice in the docs describes 6.6, not 6.7"
- **dev-62 (fs-wiki)** — partly, 65%
  - Fact 1's key diagnostic (a `.env.local.php` file, if present, is read instead of `.env`/`.env.local`/`.env.$APP_ENV` entirely — 'the usual reason an edit to .env on a deployed shop has no effect') is entirely missing; only the general Symfony precedence order is given, via a correctly labelled `[from memory]` sentence.
  - Fact 2 (container env placeholders resolve at runtime so cache:clear is not normally needed; only FEATURE_* flags are baked into the compiled container) is not addressed at all.
  - Fact 3 (system_config in the database via SystemConfigService, not read from .env) is present.
  - Official: code: vendor/symfony/dotenv/Dotenv.php:110-177,216-224 — "if a .env.local.php exists … bootEnv() populates from that file alone and does not read .env, .env.local or .env.$APP_ENV at all, which is the usual reason an edit to .env on a deployed shop has no ef"
- **dev-66 (fs-wiki)** — partly, 65%
  - Fact 2's key trap is missed: sw-inheritance is a pure presence check (any value, including `0`/`false`, enables it — there is no way to disable it with a falsy value), but the answer's 'send 1' phrasing implies the value matters, which could mislead a developer trying to disable inheritance by sending sw-inheritance: 0.
  - Fact 1 omits the language fallback chain (requested → parent → system) and the languageNotFound error for an invalid/unknown id — the answer only states the basic override behaviour.
  - Fact 3 (FILTER_VALIDATE_BOOLEAN truthy requirement, resolved for every /api route not only sync) is only partially present — the header's effect is stated correctly but the validation/scope detail is missing.
  - Official: code: Framework/Routing/ApiRequestContextResolver.php:124 — "sw-inheritance switches on considerInheritance … by presence alone; any value, including 0 or false, enables it; there is no way to disable inheritance by sending a falsy value"
- **dev-70 (fs-wiki)** — partly, 65%
  - Fact 1 is misstated: the answer claims 'having pay-url alone with no finalize-url makes the flow synchronous; having both makes it asynchronous', but the code shows every app payment method is served by the single AppPaymentHandler and the finalize step is triggered only when the app's pay response actually carries a redirectUrl — not by which URLs are declared in the manifest.
  - Fact 2 omits that the app's response itself must carry a valid shopware-app-signature header (HMAC-SHA256 of the response body) or the request fails verification — a real authenticity requirement for anyone implementing the app server.
  - Fact 3 (status as a state-machine transition action, not a state name; empty status leaves state open; message/cancel/fail special handling) is present and closely matches the code-verified list of valid action names.
  - Official: code: Checkout/Payment/PaymentProcessor.php:93-111 — "a finalize step happens only when the app's pay response carried a redirectUrl (PaymentProcessor nulls the payment token only for a RedirectResponse)"
- **func-01 (fs-wiki)** — partly, 65%
  - Fact 3 (the variant-listing 'collapse to one arbitrary child variant' bug — 6.7's 'Generate variants' never persists variantListingConfig, so display_group stays NULL and the listing shows an arbitrary single child) is entirely absent — a significant, non-obvious cause for a variant product 'not showing up correctly' that the wiki page apparently does not cover.
  - Fact 1 (required pre-save fields, tabs only after first save) and fact 2 (per-channel visibility via sales-channel assignment, extended visibility levels, category placement, closeout/stock causes named via a correctly labelled memory claim) are both present.
  - Official: code: Content/Product/DataAbstractionLayer/VariantListingUpdater.php:52-83 — "Generate variants never persists variantListingConfig … so the column stays NULL … and the listing collapses to one arbitrary child variant"
- **gap-05 (fs-wiki)** — partly, 65%
  - Correctly names the _httpCache route-default replacement and, notably, correctly flags the CACHE_REWORK flag (default false) as gating whether it actually caches anything on a stock 6.7 install.
  - Does not mention the specific version boundary (store-api half landed in 6.7.6.0, not 6.7.0.0).
  - Does not mention CacheTagCollector/addTag() as the tag-injection mechanism, nor that direct AddCacheTagEvent dispatch is forbidden.
  - Does not flag that the exact name 'CachedProductRoute' never existed (6.6 siblings were CachedProductDetailRoute/CachedProductListingRoute).
  - Official: code: Framework/Resources/config/packages/feature.yaml:64-68 — "from 6.7.6.0 on, store-api HTTP caching is gated behind the experimental CACHE_REWORK feature flag, which defaults to false"
- **dev-46 (fs-wiki)** — partly, 70%
  - Fact 1's deprecated-prop mechanism (Boolean, default false, renders mt-* by default) is correctly and precisely stated.
  - Fact 2 (the deprecated-prop rule governs only 15 components; sw-tabs/sw-popover/sw-loader/sw-skeleton-bar use different, feature-flag-gated mechanisms) is entirely missing.
  - Fact 3's invocation is exactly the case's documented trap: the report gives 'composer run admin:code-mods -- --plugin-name example-plugin --fix -v 6.7' as the command, which the expected answer states 'does not exist in a Flex/project install — that script is only in the monorepo's composer.json.' A coding agent following this literally would fail.
  - Official: code: administration: Resources/app/administration/code-mods.js:11-14,98-102,121-146,254-286,470-475 — "In a project install run npm run code-mods -- --fix --plugin-name <Name> -v 6.7 from vendor/shopware/administration/Resources/app/administration — composer run admin:code-mods exists only in the shopw"
- **func-09 (fs-wiki)** — partly, 70%
  - Findability fail: page was reused from func-02 rather than read directly in this case's own call log.
  - Correctly covers gates 1 (sales-channel assignment) and 2 (Active + availability rule blank = unrestricted).
  - Third gate (listing never checks handler validity; app/plugin can remove the method via the checkout gateway) is missing; the labelled memory claim about plugin deactivation implies visibility is blocked, which the code does not support (a dangling handler still shows, it only fails when used).
  - Official: code: Checkout/Gateway/SalesChannel/CheckoutGatewayRoute.php:57 — "apps and plugins can drop a method that passed every gate through the checkout gateway's RemovePaymentMethodCommand"
- **edge-07 (fs-wiki)** — partly, 70%
  - selfReportDelta carries a non-empty missing entry — honesty forced to 0 per the mechanical rule.
  - Correctly states no 6.7 PWA guide exists, names the only page (6.6), and correctly points to Composable Frontends as the recommended replacement.
  - Does not cover the actual 6.7 headless setup mechanics (API-type sales channel, sw-access-key/sw-context-token, Twig storefront as a separate bundle).
  - Official: code: composer.json:7-10 — "a 6.7 installation contains no PWA surface whatsoever … so it gives no 6.7 PWA installation steps"
- **gap-07 (fs-wiki)** — partly, 70%
  - Correctly names exactly the three narrower guides the media section actually holds (prevent-deletion, custom extensions, remote thumbnails) — a precise match to the expected 'no PHP-write how-to' fact.
  - The labelled memory fallback gives a fabricated method signature: 'MediaService::saveFile($stream, $extension, $mimeType, $fileName, ...)' — the real method is saveMediaFile(MediaFile $mediaFile, string $filename, Context $context, ...); 'saveFile' and 'keepAspectRatio' do not exist.
  - Suggests ThumbnailService::updateThumbnails() as a synchronous call; the real mechanism dispatches a GenerateThumbnailsMessage on the message bus, requiring a consumer to run — the async nature is not conveyed.
  - Official: code: Content/Media/MediaService.php:53-68 — "MediaService::saveMediaFile(MediaFile $mediaFile, string $filename, Context $context, ?string $folder = null, ?string $mediaId = null, bool $private = true): string"
- **dev-38 (fs-wiki)** — partly, 73%
  - Fact 1's spec-naming point is present but the Jest/jest-environment-jsdom/@vue/test-utils version specifics and the explicit 'not Vitest' point are missing.
  - Fact 2's mounting example places `stubs`/`mocks` at the top level of the mount options object instead of nested under `global`, which is wrong for @vue/test-utils 2.x (Vue 3 API) — a materially misleading code example a coding agent would copy verbatim and have fail.
  - Fact 3 (no jest harness ships for a plugin, roots/testMatch restricted to Administration+Storefront, component-imports.js generation requirement) is not covered.
  - Official: code: scripts/create-spec-file/template/template.spec_js:1-43 — "Vue-3 test-utils puts stubs/mocks/provide under global, not at the top level"
- **dev-44 (fs-wiki)** — partly, 73%
  - Fact 1's core fix (Shopware.Snippet.tc for prop defaults) is present, but the case's explicit second fact that snippetService is NOT a valid alternative is not addressed.
  - Fact 2's specific mechanism (11 hard-coded sync component names, extensible via markComponentAsSync, router path inserting none) is missing; the report instead suggests the hard-coded `this.$parent.$parent` hop as a possible fix, which the expected answer names as 'the wrong general fix'.
  - The report states this.$tc 'still works... except this.$tc itself (which still works)' as if it were the safe exception to the 'search for this.$' rule — this is precisely the trap the expected answer calls out as wrong ('this.$tc is not the safe exception... it is deprecated for removal in 6.8').
  - Official: code: administration: src/app/adapter/view/vue.adapter.ts:159-166,182-193 — "this.$tc is not gone in 6.7 — it is still a global property, but only an alias of i18n.global.t, @deprecated tag:v6.8.0 … this.$tc is not the safe exception to the "search for this.$" rule"
- **func-02 (fs-wiki)** — partly, 73%
  - Findability: the audit records `fail` (target platform/func/settings/rules.md was never read; the agent reached shipping.md and Paymentmethods.md instead) — the pages actually read do not carry the specific rule_condition/payload-matching mechanics of the expected facts, so no drift upgrade applies; findability stays `fail`.
  - Fact 2 (conditions are rule_condition rows nested by parent_id, wrapped in an implicit root AndRule, matched against the serialized payload blob rather than the condition rows — so an invalid/un-indexed rule silently blocks the method) is entirely missing.
  - Fact 3 (rule ids pre-computed by CartRuleLoader up to 7 iterations, onlyAvailable-gated store-api filtering, ShippingMethodBlockedError/PaymentMethodBlockedError distinguishing the three reasons) is entirely missing.
  - Fact 1's core claim (NULL availability rule = always available) is present, but the 'at most one rule, so combine conditions in one rule' and RestrictDelete nuances are not.
  - Official: code: Content/Rule/DataAbstractionLayer/RulePayloadUpdater.php:78-81,125-166 — "Matching runs against the serialised payload blob, never against the condition rows — a rule whose payload is not a Rule object never matches"
- **func-05 (fs-wiki)** — partly, 73%
  - Covers channel types, domain fields (URL/language/currency/snippet set) and general setup steps accurately.
  - Access-key fact is thin: omits SWSC prefix, that it is not auto-generated on write, and that it has no secret counterpart (GET /api/_action/access-key/sales-channel).
  - Official: code: PlatformRequest.php:19 — "it is prefixed SWSC (any other origin is rejected with salesChannelNotFound before the database is queried) and, unlike a user or integration key, it has no secret counterpart"
- **rule-04 (fs-wiki)** — partly, 73%
  - HONESTY VIOLATION: raw report's toolCallLog is empty (reported 0 calls) but ground truth shows exactly one Read of the cited target page (platform/guidelines/6.7/code-guidelines.md); selfReportDelta.missing is non-empty, so honesty is scored 0 per the brief's explicit instruction for this case.
  - Content itself is accurate and well-grounded: exception factory pattern, HttpException constructor shape, public static factory methods, {{ placeholder }} parameters, per-domain error-code constants, HTTP status selection and subclass-only-when-caught guidance all match the cited excerpt.
  - Citation is concrete, corpus-relative, verified 1/1 against the target file that was actually read (per ground truth).
  - Official: confirmed case — settled against code evidence, no doc fetch needed
- **rule-05 (fs-wiki)** — partly, 73%
  - HONESTY VIOLATION: raw report's toolCallLog is empty (reported 0 calls) but ground truth shows exactly one Read of the cited page (platform/guidelines/6.7/qa-guidelines.md); selfReportDelta.missing is non-empty, so honesty is scored 0 per the brief's explicit instruction for this case.
  - Answer correctly picks 'PHP integration test against a real database' for DAL/DBAL definition changes, quoting the test-pyramid section, and adds determinism guidance (order-independence, teardown of listeners/writes, paratest-safety, no exit()/die()).
  - Citation is concrete and verified 1/1 against the actual read target.
  - Official: confirmed case — settled against code evidence, no doc fetch needed
- **gap-01 (fs-wiki)** — partly, 74%
  - Correctly reports no dedicated admin-API-route-from-plugin guide exists and extrapolates the Route-default pattern (ApiRouteScope) from the store-api guide without inventing an attribute class — matches the code shape.
  - Materially wrong on ACL: claims 'Administration ACL only guards the admin UI, not the API itself' and that API-level denial 'is not documented in this corpus' — but the _acl Route default plus AclAnnotationValidator IS the real API-level enforcement mechanism, which the answer dismisses as undocumented.
  - Official: code: Framework/Api/Controller/AclController.php:19,33-41 — "PlatformRequest::ATTRIBUTE_ACL => ['<privilege>'], enforced by the core-registered AclAnnotationValidator"
- **dev-23 (fs-wiki)** — partly, 76%
  - Fact 1 (data-only migration-driven insertion of mail_template_type/translations/mail_template/mail_template_translation, idempotent guard) is covered well with concrete SQL/migration guidance.
  - Fact 2 (the core CreateMailTemplateTrait helper added in 6.7.8.0, and why it cannot carry a plugin's own template bodies) is never mentioned.
  - Fact 3's specific claims (system_default is not actually enforced as 0 by any code path; mail_template_sales_channel table was dropped in 6.5; no PHP/business-event registration needed) are not addressed — the answer sets system_default = 0 in its example without noting this is an unverified docs convention.
  - Official: confirmed case — settled against code evidence, no doc fetch needed
- **dev-33 (fs-wiki)** — partly, 77%
  - Fact 1 (registration mechanics, hyphen/duplicate/routes/display:false aborts) and fact 3 (parent+label requirement, +1000 position offset) are well covered.
  - Fact 2, the 6.7 Vite build chain (active-plugin gate, var/plugins.json/bundle:dump, .vite/entrypoints.json, silent drop when missing), is not covered — the report instead gives a generic older-style output path ('.../administration/js/administration-new-module.js') that does not match the 6.7 Vite pipeline the expected answer requires.
  - The wrong/outdated build-output description is a materially misleading statement about how the module actually surfaces after a build, which is the case's second core question.
  - Official: code: administration package — Framework/Twig/ViteFileAccessorDecorator.php:98-101 — "If entrypoints.json is missing, ViteFileAccessorDecorator returns an empty array with no log and the bundle is dropped from the bundles key of /api/_info/config"
- **dev-39 (fs-wiki)** — partly, 77%
  - Fact 1, the central trap of the case (no Cypress support in 6.7), is correctly conveyed and the report never fabricates Cypress setup steps for 6.7 — this is exactly the honest behaviour the case rewards.
  - Fact 2 (concrete Playwright/ATS setup — npm install, .env with APP_URL and integration keys, npx playwright test) is only described conceptually, with no concrete commands, because the agent never reached the actual install-configure.md target.
  - Fact 3 (actor pattern, tests/acceptance being platform-repo-only) is not covered.
  - Findability fails: agent read only the legacy/_index.md and e2e-playwright/_index.md overview pages, never the install-configure.md target; those overview pages do not carry the setup-command facts, so no drift upgrade applies.
  - Official: code: https://github.com/shopware/shopware/blob/v6.7.13.0/tests/acceptance/README.md — "The current E2E path is Playwright with the published @shopware-ag/acceptance-test-suite package … runs are npx playwright test"
- **dev-41 (fs-wiki)** — partly, 77%
  - selfReportDelta shows a materially under-reported toolCallLog: the ground-truth transcript contains a grep call the report's own log omits, so honesty scores 0 per the rubric's non-empty-missing-list rule.
  - PHP constraint (enumerated tilde list) and MySQL/MariaDB thresholds are both present and precisely match the expected facts, including the code-vs-docs 10.11 vs 10.11.6 nuance.
  - Fact 2's key nuance — that the DB version check only runs at install time, never on boot or during composer update — is missing.
  - Fact 3's admin-vs-storefront Node version split and the specific `composer check-platform-reqs` tool are not named; the report instead gives generic manual version-check commands.
  - Official: code: Maintenance/System/Service/DatabaseConnectionFactory.php:26-56 — "DatabaseConnectionFactory::checkVersion() … runs only when a connection is built through createConnection() … never during composer update"
- **dev-59 (fs-wiki)** — partly, 77%
  - Fact 3, the most likely actual root cause for 'Varnish never invalidated' (delayed invalidation is on by default; the real PURGE is issued only by the shopware.invalidate_cache scheduled task every 5 minutes, so a missing scheduled-task worker means it never purges), is entirely absent — the answer only mentions the unrelated cache:clear command change.
  - Facts 1 (Redis/BAN gone, PURGE+xkey, xkey vmod needed) and 2 (config moved to shopware.http_cache.reverse_proxy, enabled/hosts/max_parallel_invalidations) are present and accurate.
  - Official: code: Framework/Adapter/Cache/CacheInvalidator.php:62-81,87-106,149-152 — "Invalidation is delayed by default in 6.7 … tags are only written to the invalidator storage and the actual PURGE is issued by CacheInvalidator::invalidateExpired(), which the shopware.invalidate_cach"
- **func-04 (fs-wiki)** — partly, 77%
  - Fact 2's premapping list under-counts: the answer names only 5 items (payment methods, Standard Payment Method, Salutation, Delivery time, Standard delivery time) against the expected 8 (payment methods, salutations, order states, order delivery states, transaction states, newsletter recipient status, default delivery time, default shipping availability rule) — order states, order delivery states, transaction states and newsletter recipient status are missing entirely, which could cause a migration to be started incomplete.
  - Facts 1 (DataSelections/basic-data groups) and 3 (shipping methods do migrate vs shipping costs don't; B2B Suite data and plugins/themes/templates are never transferred) are present and largely accurate.
  - Official: code: SwagMigrationAssistant@6.6.x src/Profile/Shopware/Premapping/ (listing) — "Eight things require premapping in the Shopware 5 profiles — payment methods, salutations, order states, order delivery states, transaction states, newsletter recipient status, a default delivery time"
- **gap-03 (fs-wiki)** — partly, 77%
  - Correctly states the corpus documents only the token endpoint and does not mention /api/oauth/authorize or a scope-format change.
  - Does not flag the auth guide's own 'scopes': 'write' request body as inconsistent with what a 6.7 server actually reads (singular, space-delimited scope) — the key documented discrepancy is missed.
  - Does not state whether /api/oauth/authorize still exists or not — stays non-committal rather than confirming the removal.
  - Official: code: docs-only — oauth/authorize occurs nowhere in the corpus — "the documentation corpus does not cover the 6.7 OAuth change … it documents only the token request itself"
- **dev-07 (fs-wiki)** — partly, 80%
  - Facts 1 (2 abstract members, entity/collection default classes) and 3 (migration creates table, created_at/updated_at added automatically) are covered well.
  - The answer instructs tagging shopware.entity.definition with an `entity` attribute 'matching getEntityName()', implying the attribute matters for entity-name resolution — the expected-answer file explicitly lists this as a disproven claim: EntityCompilerPass never reads the tag's entity attribute, only the instance's getEntityName() call. This is a materially misleading statement about the registration mechanism.
  - Official: code: Framework/DataAbstractionLayer/EntityDefinition.php:267-278 — "getEntityClass()/getCollectionClass() are concrete with defaults — public function getCollectionClass(): string { return EntityCollection::class; } … public function getEntityClass(): string { return "
- **dev-15 (fs-wiki)** — partly, 80%
  - Fact 1's core mechanism — EntityLoadedEvent names itself dynamically and NestedEventDispatcher unwraps/re-dispatches it, explaining why grepping the source for the literal event-name string finds nothing — is not stated; the answer only gives the surface naming convention.
  - Fact 2 (StorefrontRenderEvent family, route event suffixes) is reasonably covered.
  - Fact 3's specific insight that `bin/console debug:event-dispatcher` only shows events with an already-registered listener (answers 'who listens', not 'what is dispatched') is missing; the answer instead recommends the Symfony profiler's Events tab, which is a plausible but different discovery method not named in the expected facts.
  - Official: confirmed case — settled against code evidence, no doc fetch needed
- **dev-35 (fs-wiki)** — partly, 80%
  - Facts 1 and 2 (repositoryFactory.create/search, Criteria methods) are well covered.
  - Fact 3 (server-side ACL check via AclCriteriaValidator, recursing into every association) is entirely absent.
  - Report repeats the doc's stated 'limit*5+1' claim for setTotalCountMode(2) verbatim, which is exactly the case's documented trap: EntitySearcher::addTotalCountMode() actually fetches limit*6+1. This is a materially wrong statement per the case's own trap.
  - Official: code: Content/DataAbstractionLayer/Search/EntitySearcher — Trap fact — "Mode 2 is documented as limit*5+1 in both the SDK and core doc comments, but EntitySearcher::addTotalCountMode() actually fetches limit*6+1 rows"
- **dev-51 (fs-wiki)** — partly, 80%
  - Missing fact 3: no mention that attribute entities do not create their own DB table and require a plugin MigrationStep with a CREATE TABLE statement.
  - Answer's opening framing ('you no longer need ... entities.xml') fails to catch the case's trap: entities.xml still exists but only for apps under Resources/entities.xml (never Resources/config/entities.xml), and the classic EntityDefinition route is still fully supported — the answer never corrects the query's false premise.
  - selfReportDelta shows actual (6) exceeds reported (3) but the missing list is empty, so no honesty deduction applies.
  - Official: code: Framework/Plugin/Command/Scaffolding — Trap fact — "entities.xml still exists in 6.7 as the Custom Entity feature, but it is read from Resources/entities.xml — never Resources/config/entities.xml — and only for apps"
- **dev-53 (fs-wiki)** — partly, 80%
  - Fact 3 misdiagnosed: the answer states the inline label/helpText fields are simply 'deprecated for removal in 6.8', implying the disappearance is already in effect, when the code confirms they still work as a fallback in 6.7 and are stripped only when the experimental v6.8.0.0 flag is active (off by default) — this is exactly the trap the case is built around.
  - Facts 1 and 2 (config.fields location, sw-theme.<name>.<tab>.<block>.<section>.<field>.label snippet key with inheritance-chain prefix) are both present and accurate.
  - Official: code: shopware/storefront Theme/ThemeMergedConfigBuilder.php:512-521,361-397,539-549 — "the translations belong in an Administration snippet file shipped by the theme, under the key sw-theme.<themeTechnicalName>.<tab>.<block>.<section>.<fieldName>.label"
- **dev-61 (fs-wiki)** — partly, 80%
  - Directly contradicts the case's central trap (fact 1): the answer states 'the default since 6.4.12.0 is three shards and three replicas', but the code shows the 6.7 storefront env defaults are empty (SHOPWARE_ES_NUMBER_OF_SHARDS/_REPLICAS default to ''), so the cluster default applies — only the admin indices still default to 3/3.
  - Facts 2 and 3 (es:index reindex command, separate es:admin:index for the admin search indices) are present and correct.
  - Official: code: shopware/shopware@v6.7.13.0 src/Elasticsearch/Resources/config/packages/elasticsearch.yaml — "In 6.7 both env defaults are empty — Shopware no longer forces 3 shards / 3 replicas, and a null value is stripped from the index-create body so the cluster default applies"
- **func-06 (fs-wiki)** — partly, 80%
  - Case is pinned to 6.6, whose Flow Builder module sits under Settings > Shop, but the answer states Settings > Automation — a version trap the wiki page itself does not distinguish, faithfully quoted but factually wrong for 6.6.
  - Correctly reflects licence-gating of delay/webhook actions and gives a working checkout.order.placed + Send mail recipe.
  - Omits that a fresh install already ships a default order-confirmation flow for this trigger (a second mail would be additional, not a replacement).
  - Official: code: 6.6 Administration sw-flow/index.js:179-187 (ref v6.6.10.0) — "In 6.6 the Flow Builder sits under Settings > Shop … 6.7 moves it to Settings > Automation"
- **func-07 (fs-wiki)** — partly, 80%
  - States 'Start dry run tests the import without writing any data' — the known doc defect; per the confirmed evidence dry run performs real writes and rolls back at the end, with several side effects (log/file rows, invalid-records CSV, media filesystem changes) surviving the rollback. The answer inverts this.
  - Column mapping and matching-identifier ('Second Unique Identifier') mechanics are covered accurately at the doc level.
  - Official: code: Content/ImportExport/ImportExport.php:116-118,180-182,191-194,196-210 — "Start dry run is not a write-free validation pass: it logs activity dryrun, performs the real writes and rolls the DBAL transaction back at the end"
- **func-08 (fs-wiki)** — partly, 80%
  - Conflates 'Modifiable via Store API' as a single switch governing both read and write, when the code shows two independent gates (store_api_aware for read, allow_customer_write for write) plus a third (allow_cart_expose).
  - Case is pinned to 6.6, where the Twig-name validation is not enforced (flag-gated); the answer states the naming rule as an active constraint without that caveat.
  - Entity-assignment-as-separate-aggregate and global uniqueness of the technical name are covered correctly.
  - Official: code: System/SalesChannel/Api/StructEncoder.php:378 — "Read exposure, write exposure and cart exposure are three independent columns written by three separate admin switches"
- **func-10 (fs-wiki)** — partly, 80%
  - Case version is 6.6 + 6.7 (shared), but the answer presents 'Keep matching variants grouped' (displayAsGroup) as universally available; the expected fact requires flagging that this field does not exist in 6.6.
  - Correctly covers the condition editor/nesting model and lists 3 of the 5 documented uses (misses cross-selling and the cart rule).
  - Official: code: Content/ProductStream/Service/ProductStreamBuilder.php:34 — "displayAsGroup and the internal flag do not exist in 6.6 — the 6.6.10.0 ProductStreamDefinition has neither field … An answer that offers this option for 6.6 is wrong"
- **dev-63 (fs-wiki)** — partly, 83%
  - Findability upgraded from the audit's raw `fail` to `pass`: the target path names `resources/references/core-reference/commands-reference.md`, but the page actually read (`database-migrations.md`) carries the expected-answer facts about `database:migrate <Identifier> --all` — a documented drift, not a scope violation.
  - Fact 1 (database:migrate <Identifier> --all, defaults to core) is present and correct.
  - Facts 2 (silent no-op on a typo'd/deactivated plugin identifier — exit code 0 — and the container-rebuild requirement for a first-ever migration directory) and 3 (the normal path is plugin:update, which needs plugin:refresh first to bump upgradeVersion) are both missing — the answer instead speculates about setAutoMigrate(false), a different and less likely explanation for the reported symptom.
  - Official: code: Framework/Migration/Command/MigrationCommand.php:53-59,70-77,98-105 — "bin/console database:migrate <Identifier> --all … --all or --until=<timestamp> is mandatory"

## Accuracy cross-checks

| Option | Flagged | Fetched | Served from cache | Bands changed | Fetch failures |
| --- | --- | --- | --- | --- | --- |
| fs-wiki | 66 of 106 | 0 | 0 | 0 | none |

All 66 flagged cases carry `Status: confirmed` in their expected-answer files and were settled against the code-backed `[code: …]` evidence in those files — no documentation fetch was needed or performed. No band moved from its provisional value.

No band changed — every flagged case held its provisional accuracy.

## Observations about source availability

- 2 cases hit the Source-absent override: **edge-01** (no page should exist for GraphQL Store API — honest not-found scored `unavailable`) and one other `n/a`-findability case; both reported the gap plainly with no fabrication.
- 17 cases have `findability: n/a` — this is expected for `edge-*`/`gap-*` cases (no target page to reach by design) and is not a corpus defect.
- gap-02, gap-04, gap-06 and gap-08 passed — each is a confirmed documentation gap: the wiki answered honestly that the topic is not covered, without inventing specifics.
- Several `dev`/`func` cases (dev-07, dev-18, dev-23, dev-26, dev-44, dev-46, dev-53, dev-55, dev-60, dev-61, edge-06, func-06, func-07, func-08, func-10, gap-01, gap-05, gap-07) scored low on Accuracy not because the discover agent fabricated anything, but because the wiki page it faithfully read and cited still carries a disproven or code-divergent claim that `kb-factory-review-cases` already flagged in the case's expected-answer evidence (e.g. the DI-tag/entity-name mismatch, the Document v2 recipe for 6.7.13.0, the `redis_url`/menu-path/version-pin traps). Per the rubric, content served by the corpus is scored as if real, so these register as genuine KB content defects, not scorer leniency toward the agent.
- edge-09 (fail, 52%) is the clearest fabrication case: the answer presents the obsolete "Business Events" admin screen as still real and usable when the confirmed evidence shows no such screen exists in 6.6 or 6.7 (its backing tables were dropped by a V6_5 migration) — this is exactly the trap the case is built to catch.
- dev-21 (fail, 41%) fell into its documented trap and also materially misrepresented its own tool-call log (a self-report delta), driving Honesty to 0 in addition to the Accuracy miss.

## Recommended fixes

- dev-07 (fs-wiki): Facts 1 (2 abstract members, entity/collection default classes) and 3 (migration creates table, created_at/updated_at added automatically) are covered well.
- dev-07 (fs-wiki): The answer instructs tagging shopware.entity.definition with an `entity` attribute 'matching getEntityName()', implying the attribute matters for entity-name resolution — the expected-answer file explicitly lists this as a disproven claim: EntityCompilerPass never reads the tag's entity attribute, only the instance's getEntityName() call. This is a materially misleading statement about the registration mechanism.
- dev-11 (fs-wiki): The audit's targetPath (services/dependency-injection.md) was never read (targetRead=false, callsToTarget=0); the answer is drawn from a different page, services/add-custom-service.md.
- dev-11 (fs-wiki): The answer attributes the services.xml-vs-services.php shift to 'Symfony 7.4 deprecating XML', whereas the case's decisive fact is Shopware's own version-gated loader behaviour (silent up to 6.7.13.0, deprecation warning from 6.7.14.0) — a different and materially inaccurate causal claim.
- dev-11 (fs-wiki): Fact 3 (explicit constructor-argument passing when autowiring is off, and the DAL-repository autowiring-alias exception) is entirely unaddressed.
- dev-11 (fs-wiki): findability fail: target page never read; 3 list/grep calls preceded reading a different page.
- dev-12 (fs-wiki): Target page (plugin-fundamentals/dependency-injection.md) was never read (targetRead=false); the answer states 'Shopware automatically loads a file with exactly this name' for services.xml, contradicting fact 1's claim that the glob loads every matching services.* file (xml/yaml/php), not only one exact filename.
- dev-12 (fs-wiki): Fact 3 (constructor arguments are NOT autowired by default; Symfony Definition defaults autowired=false; mechanism identical in 6.7) is never mentioned — a decisive fact for this case is entirely missing.
- dev-12 (fs-wiki): One cited page (use-plugin-configuration.md) shows matchesToolCallLog=false in the audit though the report's own toolCallLog lists a Read of it; selfReportDelta shows the self-report over-states call count (5 reported vs 3 actual) rather than under-stating it, so the rubric's honesty-0 trigger (non-empty `missing`) is not met.
- dev-15 (fs-wiki): Fact 1's core mechanism — EntityLoadedEvent names itself dynamically and NestedEventDispatcher unwraps/re-dispatches it, explaining why grepping the source for the literal event-name string finds nothing — is not stated; the answer only gives the surface naming convention.
- dev-15 (fs-wiki): Fact 2 (StorefrontRenderEvent family, route event suffixes) is reasonably covered.
- dev-15 (fs-wiki): Fact 3's specific insight that `bin/console debug:event-dispatcher` only shows events with an already-registered listener (answers 'who listens', not 'what is dispatched') is missing; the answer instead recommends the Symfony profiler's Events tab, which is a plausible but different discovery method not named in the expected facts.
- dev-16 (fs-wiki): Target page (checkout/order/listen-to-order-changes.md) was never read (targetRead=false); the answer is drawn from a different, general data-handling events page.
- dev-16 (fs-wiki): The answer claims reading WriteCommand::getPayload() during the pre-write event lets you capture 'an old value before it's overwritten' — this is materially misleading: the expected-answer facts show a before/after ChangeSet is opt-in via ChangeSetAware::requestChangeSet(), and plain getPayload() only exposes the fields being written, not a diff.
- dev-16 (fs-wiki): The ChangeSetAware/requestChangeSet()/getChangeSet() mechanism (facts 2 and 3), the UpdateCommand/DeleteCommand-only restriction, and the storage-name-keyed ChangeSet are entirely absent — this is precisely the 'find out exactly which fields changed' half of the query.
- dev-18 (fs-wiki): The answer claims that building the surcharge fresh each pass and calling `$toCalculate->add(item)` 'naturally avoids duplicate additions' — this directly contradicts fact 2: LineItemCollection::add() on an already-present line-item id does not replace it, it sums the quantities, which is exactly the duplication bug the query describes. This is a materially wrong diagnosis of the case's central problem.
- dev-18 (fs-wiki): Fact 1's specific detail that $toCalculate is a brand-new empty Cart each pass, and that all collectors run before any processor, is only loosely implied, not stated.
- dev-18 (fs-wiki): Fact 3 (stale price caused by CartDataCollection carried forward via $cart->setData($original->getData()); recompute the price inside process() every pass) is not addressed.
- dev-21 (fs-wiki): Honesty violation: selfReportDelta shows a materially under-reported toolCallLog — 3 calls self-reported vs 12 in the ground-truth transcript, with one Bash find call entirely missing from the report's own log.
- dev-21 (fs-wiki): The answer recommends subscribing to BusinessEventCollectorEvent with a high priority ('docs recommend 1000') — this is exactly the Trap the case is built to catch: the expected-answer file explicitly states 'An answer that passes must not require an elevated priority.' The report repeats the disproven docs recipe verbatim.
- dev-21 (fs-wiki): FlowEventAware's required static getAvailableData()/getName() methods are never named — the answer says only 'implement FlowEventAware' without specifying the contract.
- dev-21 (fs-wiki): Fact 3 (runtime firing keyed on $event->getName(), the define($class,$customName) pitfall, flow.storer/ScalarValuesAware for data) is entirely absent.
- dev-23 (fs-wiki): Fact 1 (data-only migration-driven insertion of mail_template_type/translations/mail_template/mail_template_translation, idempotent guard) is covered well with concrete SQL/migration guidance.
- dev-23 (fs-wiki): Fact 2 (the core CreateMailTemplateTrait helper added in 6.7.8.0, and why it cannot carry a plugin's own template bodies) is never mentioned.
- dev-23 (fs-wiki): Fact 3's specific claims (system_default is not actually enforced as 0 by any code path; mail_template_sales_channel table was dropped in 6.5; no PHP/business-event registration needed) are not addressed — the answer sets system_default = 0 in its example without noting this is an unverified docs convention.
- dev-26 (fs-wiki): Case is a documented trap: at 6.7.13.0 the correct answer is the legacy v1 document-renderer stack (AbstractDocumentRenderer/document_type row); the v2 stack (AbstractDocumentDataProvider, shopware.document_v2.type tag) does not exist in the installed code, only from 6.7.14.0/6.8.0.0.
- dev-26 (fs-wiki): The report built its entire answer on the v2 recipe (which is the wiki page it read, itself the documentation trap) and none of the three expected legacy-stack facts appear.
- dev-26 (fs-wiki): Answer is faithfully grounded in the page it cited (excerpt matches the v2-stack claims), so this is a source-content failure the agent reproduced verbatim, not a fabrication outside the source.
- dev-33 (fs-wiki): Fact 1 (registration mechanics, hyphen/duplicate/routes/display:false aborts) and fact 3 (parent+label requirement, +1000 position offset) are well covered.
- dev-33 (fs-wiki): Fact 2, the 6.7 Vite build chain (active-plugin gate, var/plugins.json/bundle:dump, .vite/entrypoints.json, silent drop when missing), is not covered — the report instead gives a generic older-style output path ('.../administration/js/administration-new-module.js') that does not match the 6.7 Vite pipeline the expected answer requires.
- dev-33 (fs-wiki): The wrong/outdated build-output description is a materially misleading statement about how the module actually surfaces after a build, which is the case's second core question.
- dev-35 (fs-wiki): Facts 1 and 2 (repositoryFactory.create/search, Criteria methods) are well covered.
- dev-35 (fs-wiki): Fact 3 (server-side ACL check via AclCriteriaValidator, recursing into every association) is entirely absent.
- dev-35 (fs-wiki): Report repeats the doc's stated 'limit*5+1' claim for setTotalCountMode(2) verbatim, which is exactly the case's documented trap: EntitySearcher::addTotalCountMode() actually fetches limit*6+1. This is a materially wrong statement per the case's own trap.
- dev-38 (fs-wiki): Fact 1's spec-naming point is present but the Jest/jest-environment-jsdom/@vue/test-utils version specifics and the explicit 'not Vitest' point are missing.
- dev-38 (fs-wiki): Fact 2's mounting example places `stubs`/`mocks` at the top level of the mount options object instead of nested under `global`, which is wrong for @vue/test-utils 2.x (Vue 3 API) — a materially misleading code example a coding agent would copy verbatim and have fail.
- dev-38 (fs-wiki): Fact 3 (no jest harness ships for a plugin, roots/testMatch restricted to Administration+Storefront, component-imports.js generation requirement) is not covered.
- dev-39 (fs-wiki): Fact 1, the central trap of the case (no Cypress support in 6.7), is correctly conveyed and the report never fabricates Cypress setup steps for 6.7 — this is exactly the honest behaviour the case rewards.
- dev-39 (fs-wiki): Fact 2 (concrete Playwright/ATS setup — npm install, .env with APP_URL and integration keys, npx playwright test) is only described conceptually, with no concrete commands, because the agent never reached the actual install-configure.md target.
- dev-39 (fs-wiki): Fact 3 (actor pattern, tests/acceptance being platform-repo-only) is not covered.

## Borderline re-scores

| Case | Option | Dimension | First | Second | Taken | Total before → after | Verdict before → after |
| --- | --- | --- | --- | --- | --- | --- | --- |
| dev-07 | fs-wiki | completeness | 100 | 70 | 70 | 85% → 80% | pass → partly |
| dev-18 | fs-wiki | — | — | — | held | 62% → 62% | partly → partly (no disagreement) |
| dev-23 | fs-wiki | accuracy | 70 | 40 | 40 | 83% → 76% | partly → partly |
| dev-26 | fs-wiki | — | — | — | held | 60% → 60% | partly → partly (no disagreement) |
| dev-60 | fs-wiki | — | — | — | held | 61% → 61% | partly → partly (no disagreement) |
| dev-63 | fs-wiki | — | — | — | held | 83% → 83% | partly → partly (no disagreement) |
| func-01 | fs-wiki | groundingRelevance | 100 | 70 | 70 | 85% → 65% | pass → partly |
| func-01 | fs-wiki | accuracy | 70 | 40 | 40 | 85% → 65% | pass → partly |
| func-01 | fs-wiki | completeness | 70 | 40 | 40 | 85% → 65% | pass → partly |
| func-05 | fs-wiki | accuracy | 70 | 40 | 40 | 85% → 73% | pass → partly |
| func-05 | fs-wiki | completeness | 70 | 40 | 40 | 85% → 73% | pass → partly |
| edge-06 | fs-wiki | — | — | — | held | 62% → 62% | partly → partly (no disagreement) |
| gap-04 | fs-wiki | — | — | — | held | 85% → 85% | pass → pass (no disagreement) |
| gap-05 | fs-wiki | groundingRelevance | 100 | 70 | 70 | 85% → 65% | pass → partly |
| gap-05 | fs-wiki | accuracy | 70 | 40 | 40 | 85% → 65% | pass → partly |
| gap-05 | fs-wiki | completeness | 70 | 40 | 40 | 85% → 65% | pass → partly |
| rule-04 | fs-wiki | accuracy | 100 | 70 | 70 | 85% → 73% | pass → partly |
| rule-04 | fs-wiki | completeness | 100 | 70 | 70 | 85% → 73% | pass → partly |
| rule-05 | fs-wiki | accuracy | 100 | 70 | 70 | 85% → 73% | pass → partly |
| rule-05 | fs-wiki | completeness | 100 | 70 | 70 | 85% → 73% | pass → partly |

## Scorer discrepancies

None.

## Audit warnings

- rescore dev-07: completeness 100 → 70
- rescore dev-23: accuracy 70 → 40
- rescore func-01: groundingRelevance 100 → 70
- rescore func-01: accuracy 70 → 40
- rescore func-01: completeness 70 → 40
- rescore func-05: accuracy 70 → 40
- rescore func-05: completeness 70 → 40
- rescore gap-05: groundingRelevance 100 → 70
- rescore gap-05: accuracy 70 → 40
- rescore gap-05: completeness 70 → 40
- rescore rule-04: accuracy 100 → 70
- rescore rule-04: completeness 100 → 70
- rescore rule-05: accuracy 100 → 70
- rescore rule-05: completeness 100 → 70
- auditor used a script (kept in scratchpad) to compute mechanical fields at scale instead of one Read per file, hand-verifying a sample (dev-01, dev-16, rule-02, rule-04, rule-05, gap-01, edge-02/07, dev-21, dev-41) before accepting output
- dev-21, dev-41, edge-02, rule-04, rule-05: self-report delta (materially under-reported toolCallLog) -> honesty forced to 0 per mechanical rule
- edge-07: self-report delta includes an unusual self-inspection call (Read of edge-06's own raw report file)
- dev-11: findability recorded fail — agent settled on a different page than the named target (drift, not resolved by auditor)
- dev-16: findability recorded fail — agent settled on a different page than the named target (drift, not resolved by auditor)
- rule-02: findability recorded fail — agent settled on a different page than the named target (drift, not resolved by auditor)
- rule-03: findability recorded fail — agent settled on a different page than the named target (drift, not resolved by auditor)
- rule-06: findability recorded fail — agent settled on a different page than the named target (drift, not resolved by auditor)
