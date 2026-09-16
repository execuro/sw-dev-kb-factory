# KB quality report — vanilla-2026-09-15-1417

## Run

| | |
| --- | --- |
| Run | `vanilla-2026-09-15-1417` (`vanilla`) |
| Options | vanilla |
| Corpus | none — control group, no corpus under test |
| Probe | n/a (vanilla has no corpus to probe) |
| Baseline | vendor/ present — shopware/core v6.7.13.0 in <home>/projects/host-project |
| Model | inherited (not pinned) |
| Generated | 2026-09-15T15:56:13Z |
| Cases run | 106 of 106 (`all`) |
| Yardstick | cases.md ac4393bc, scoring-rubric.md dbf63114, scorer-brief.md 51bc1922, auditor-brief.md 2f2db37f, accuracy-brief.md d4a335ae |
| Execution | discover batches of 10, scorer shards of 25 (batched) |
| Skill | kb-factory-verify |

## Run cost

Cost = usage of the option's discover agents only, one usage block per API message id (the record carrying the final output_tokens), split into non-cache tokens (input + output + cache writes) and cache-read tokens, computed by scripts/aggregate-costs.mjs from the transcripts. Cache hit rate = cacheRead ÷ (input + cacheCreation + cacheRead). USD is an estimate from reference/pricing.json, labelled so. totalTokens is retired. Written by `scripts/aggregate-costs.mjs`, never by hand.

| Option | Discover agents (batches) | Requests | Non-cache tokens | Cache-read tokens | Cache hit % | Est. USD | Tool calls | Summed agent time | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| vanilla | 11 (11) | 427 | 635,407 | 13,563,811 | 96.8% | $5.66 | 517 | 4338.67s | transcript |

Wall-clock duration of the run: 6247s.

## Comparison

Single-option run — the headline is whether `vanilla` (an ordinary coding agent with the open web plus this repo's installed Shopware source, and no custom documentation support) can answer the suite well on its own. This is the baseline the four KB options must beat.

| Option | Access | Corpus | Overall | Status | Developer | Functional | Findable | Edge passed | Gap confirmed | Pass / partly / fail / unavailable / unscored | Weakest dimension |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| vanilla | web+repo | none | 76% | Not ready | 75% | 77% | n/a | 4 of 9 | 3 of 8 | 21 / 74 / 11 / 0 / 0 | citation |

No other option in this run to rank against or take deltas from — `vanilla` was run alone, as the skill specifies.

## Dimension heatmap

| Dimension | Weight | vanilla |
| --- | --- | --- |
| Grounding & Relevance | 25 | 93.9 |
| Accuracy vs. Expected Answer | 25 | 65.5 |
| Completeness | 15 | 63.7 |
| Citation & Traceability | 10 | 50.9 |
| Honesty | 15 | 87.5 |
| Actionability | 10 | 88.9 |

| Area | Cases | vanilla average |
| --- | --- | --- |
| Admin API | 3 | 71.7 |
| Admin migration (Vue 3 / Vite / Pinia / Meteor) | 4 | 65.5 |
| Administration | 4 | 79.0 |
| App system | 5 | 78.6 |
| Architecture | 3 | 95.3 |
| Checkout & Cart | 2 | 76.0 |
| Code | 1 | 94.0 |
| Config & CLI | 5 | 75.8 |
| Content | 1 | 82.0 |
| Content (CMS/mail/SEO/media/sitemap) | 2 | 79.5 |
| Core breaking changes | 3 | 79.3 |
| DAL | 7 | 74.7 |
| Events | 6 | 73.2 |
| Gap | 8 | 77.2 |
| Hosting & ops | 5 | 72.0 |
| Merchant | 12 | 76.8 |
| Orders | 2 | 60.5 |
| Payment & Shipping | 1 | 82.0 |
| Platform upgrade | 2 | 90.0 |
| Plugin fundamentals | 1 | 77.0 |
| QA | 1 | 94.0 |
| Services & DI | 3 | 55.0 |
| Store API & headless | 1 | 77.0 |
| Storefront | 10 | 79.5 |
| Testing | 3 | 75.7 |
| Theme | 2 | 74.5 |
| Trap | 9 | 76.2 |

## Verdict grid

| Case | Category | Area | vanilla |
| --- | --- | --- | --- |
| dev-01 | dev | DAL | 64% partly – |
| dev-02 | dev | Plugin fundamentals | 77% partly – |
| dev-03 | dev | Store API & headless | 77% partly – |
| dev-04 | dev | Content | 82% partly – |
| dev-05 | dev | Theme | 82% partly – |
| dev-06 | dev | Events | 82% partly – |
| dev-07 | dev | DAL | 79% partly – |
| dev-08 | dev | DAL | 82% partly – |
| dev-09 | dev | DAL | 82% partly – |
| dev-10 | dev | DAL | 70% partly – |
| dev-11 | dev | Services & DI | 55% fail – |
| dev-12 | dev | Services & DI | 82% partly – |
| dev-13 | dev | Services & DI | 28% fail – |
| dev-14 | dev | Events | 82% partly – |
| dev-15 | dev | Events | 64% partly – |
| dev-16 | dev | Orders | 82% partly – |
| dev-17 | dev | Checkout & Cart | 82% partly – |
| dev-18 | dev | Checkout & Cart | 70% partly – |
| dev-19 | dev | Events | 70% partly – |
| dev-20 | dev | Events | 64% partly – |
| dev-21 | dev | Events | 77% partly – |
| dev-22 | dev | Config & CLI | 82% partly – |
| dev-23 | dev | Content (CMS/mail/SEO/media/sitemap) | 77% partly – |
| dev-24 | dev | Content (CMS/mail/SEO/media/sitemap) | 82% partly – |
| dev-25 | dev | Config & CLI | 82% partly – |
| dev-26 | dev | Orders | 39% fail – |
| dev-27 | dev | Storefront | 74% partly – |
| dev-28 | dev | Storefront | 82% partly – |
| dev-29 | dev | Storefront | 82% partly – |
| dev-30 | dev | Storefront | 94% pass – |
| dev-31 | dev | Storefront | 82% partly – |
| dev-32 | dev | DAL | 82% partly – |
| dev-33 | dev | Administration | 82% partly – |
| dev-34 | dev | Administration | 70% partly – |
| dev-35 | dev | Administration | 82% partly – |
| dev-36 | dev | Administration | 82% partly – |
| dev-37 | dev | Testing | 82% partly – |
| dev-38 | dev | Testing | 71% partly – |
| dev-39 | dev | Testing | 74% partly – |
| dev-40 | dev | Platform upgrade | 94% pass – |
| dev-41 | dev | Hosting & ops | 67% partly – |
| dev-42 | dev | Config & CLI | 88% pass – |
| dev-43 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 67% partly – |
| dev-44 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 47% fail – |
| dev-45 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 100% pass – |
| dev-46 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 48% fail – |
| dev-47 | dev | Payment & Shipping | 82% partly – |
| dev-48 | dev | Storefront | 82% partly – |
| dev-49 | dev | Core breaking changes | 77% partly – |
| dev-50 | dev | Core breaking changes | 82% partly – |
| dev-51 | dev | DAL | 64% partly – |
| dev-52 | dev | Core breaking changes | 79% partly – |
| dev-53 | dev | Theme | 67% partly – |
| dev-54 | dev | Storefront | 82% partly – |
| dev-55 | dev | Storefront | 56% fail – |
| dev-56 | dev | Storefront | 82% partly – |
| dev-57 | dev | Platform upgrade | 86% pass – |
| dev-58 | dev | Hosting & ops | 82% partly – |
| dev-59 | dev | Hosting & ops | 74% partly – |
| dev-60 | dev | Hosting & ops | 70% partly – |
| dev-61 | dev | Hosting & ops | 67% partly – |
| dev-62 | dev | Config & CLI | 68% partly – |
| dev-63 | dev | Config & CLI | 59% fail – |
| dev-64 | dev | Admin API | 74% partly – |
| dev-65 | dev | Admin API | 49% fail – |
| dev-66 | dev | Admin API | 92% pass – |
| dev-67 | dev | App system | 67% partly – |
| dev-68 | dev | App system | 85% pass – |
| dev-69 | dev | App system | 82% partly – |
| dev-70 | dev | App system | 80% partly – |
| dev-71 | dev | App system | 79% partly – |
| func-01 | func | Merchant | 80% partly – |
| func-02 | func | Merchant | 77% partly – |
| func-03 | func | Merchant | 88% pass – |
| func-04 | func | Merchant | 82% partly – |
| func-05 | func | Merchant | 74% partly – |
| func-06 | func | Merchant | 65% partly – |
| func-07 | func | Merchant | 74% partly – |
| func-08 | func | Merchant | 59% fail – |
| func-09 | func | Merchant | 88% pass – |
| func-10 | func | Merchant | 82% partly – |
| func-11 | func | Merchant | 71% partly – |
| func-12 | func | Merchant | 82% partly – |
| edge-01 | edge | Trap | 94% pass – |
| edge-02 | edge | Trap | 94% pass – |
| edge-03 | edge | Trap | 79% partly – |
| edge-04 | edge | Trap | 86% pass – |
| edge-05 | edge | Trap | 94% pass – |
| edge-06 | edge | Trap | 68% partly – |
| edge-07 | edge | Trap | 27% fail – |
| edge-08 | edge | Trap | 79% partly – |
| edge-09 | edge | Trap | 65% partly – |
| gap-01 | gap | Gap | 68% partly – |
| gap-02 | gap | Gap | 100% pass – |
| gap-03 | gap | Gap | 100% pass – |
| gap-04 | gap | Gap | 88% pass – |
| gap-05 | gap | Gap | 41% fail – |
| gap-06 | gap | Gap | 79% partly – |
| gap-07 | gap | Gap | 71% partly – |
| gap-08 | gap | Gap | 71% partly – |
| rule-01 | rule | Architecture | 94% pass – |
| rule-02 | rule | Architecture | 100% pass – |
| rule-03 | rule | Architecture | 92% pass – |
| rule-04 | rule | Code | 94% pass – |
| rule-05 | rule | QA | 94% pass – |
| rule-06 | rule | Storefront | 79% partly – |

## Requests and responses

### vanilla

| Case | Query | Entry point used | Tool calls made | Page reached | Findability | Top citation | Memory claims | Honesty | Verdict | Raw |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dev-01 | How do I extend the product entity with a new association in | n/a | 3 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/add-data-associations.html | 0 | 100 (under-reported 1) | partly | `raw/vanilla/dev-01.json` |
| dev-02 | What's the plugin lifecycle in Shopware — install, activate, | n/a | 3 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/plugins/plugins/plugin-fundamentals/plugin-lifecycle.html | 0 | 100 (under-reported 1) | partly | `raw/vanilla/dev-02.json` |
| dev-03 | How do I add a custom Store API route for a headless storefr | n/a | 2 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/plugins/plugins/framework/store-api/add-store-api-route.html | 0 | 100 | partly | `raw/vanilla/dev-03.json` |
| dev-04 | How do I create a custom CMS element for Shopping Experience | n/a | 2 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/plugins/plugins/content/cms/add-cms-element.html | 0 | 100 | partly | `raw/vanilla/dev-04.json` |
| dev-05 | How does theme inheritance work in Shopware — theme.json and | n/a | 2 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/plugins/themes/add-theme-inheritance.html | 0 | 100 | partly | `raw/vanilla/dev-05.json` |
| dev-06 | How do I add a custom Flow Builder action? | n/a | 2 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/plugins/plugins/framework/flow/add-flow-builder-action.html | 0 | 100 | partly | `raw/vanilla/dev-06.json` |
| dev-07 | My plugin needs to store its own data in a new table — how d | n/a | 2 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/add-custom-complex-data.html | 0 | 100 | partly | `raw/vanilla/dev-07.json` |
| dev-08 | In a plugin service, what is the Shopware 6 equivalent of Do | n/a | 2 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/reading-data.html | 0 | 100 | partly | `raw/vanilla/dev-08.json` |
| dev-09 | How do I make a field on my plugin's own entity translatable | n/a | 2 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/add-data-translations.html | 0 | 100 | partly | `raw/vanilla/dev-09.json` |
| dev-10 | How do I write an indexer that precomputes derived data for  | n/a | 2 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/add-data-indexer.html | 0 | 100 | partly | `raw/vanilla/dev-10.json` |
| dev-11 | On Shopware 6.7, which file do I declare my plugin's service | n/a | 15 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/plugins/plugins/plugin-fundamentals/dependency-injection.html | 0 | 0 (under-reported 11) | fail | `raw/vanilla/dev-11.json` |
| dev-12 | I am on Shopware 6.6 — which file do I declare my plugin's s | n/a | 0 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/plugins/plugins/plugin-fundamentals/dependency-injection.html | 1 | 100 | partly | `raw/vanilla/dev-12.json` |
| dev-13 | There is no event for what I need to change in a core Shopwa | n/a | 0 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/plugins/plugins/services/adjusting-service.html | 0 | 0 | fail | `raw/vanilla/dev-13.json` |
| dev-14 | I wrote a subscriber class in my plugin but it never fires — | n/a | 1 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/plugins/plugins/plugin-fundamentals/listening-to-events.html | 0 | 100 | partly | `raw/vanilla/dev-14.json` |
| dev-15 | How do I work out which event Shopware actually dispatches f | n/a | 1 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/plugins/plugins/framework/event/finding-events.html | 0 | 100 | partly | `raw/vanilla/dev-15.json` |
| dev-16 | How do I run plugin logic whenever an order is written, and  | n/a | 1 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/plugins/plugins/checkout/order/listen-to-order-changes.html | 0 | 100 | partly | `raw/vanilla/dev-16.json` |
| dev-17 | How do I overwrite the price of a product line item in the c | n/a | 1 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/plugins/plugins/checkout/cart/change-price-of-item.html | 0 | 100 | partly | `raw/vanilla/dev-17.json` |
| dev-18 | My plugin's cart processor adds a surcharge line item, but i | n/a | 1 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/plugins/plugins/checkout/cart/add-cart-processor-collector.html | 0 | 100 | partly | `raw/vanilla/dev-18.json` |
| dev-19 | I need to move long-running work in my plugin out of the req | n/a | 1 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/plugins/plugins/framework/message-queue/add-message-handler.html | 1 | 100 | partly | `raw/vanilla/dev-19.json` |
| dev-20 | How do I add my own condition to the Rule Builder from a plu | n/a | 1 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/plugins/plugins/framework/rule/add-custom-rules.html | 1 | 100 | partly | `raw/vanilla/dev-20.json` |
| dev-21 | My plugin dispatches its own domain event — how do I make it | n/a | 3 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/plugins/plugins/framework/flow/add-flow-builder-trigger.html | 0 | 100 (under-reported 1) | partly | `raw/vanilla/dev-21.json` |
| dev-22 | How do I give my plugin a settings page the shop operator ca | n/a | 3 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/plugins/plugins/plugin-fundamentals/add-plugin-configuration.html | 0 | 100 (under-reported 1) | partly | `raw/vanilla/dev-22.json` |
| dev-23 | How do I ship a mail template with my plugin so it is instal | n/a | 3 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/plugins/plugins/content/mail/add-mail-template.html | 0 | 100 (under-reported 1) | partly | `raw/vanilla/dev-23.json` |
| dev-24 | How do I get readable SEO URLs generated for the detail page | n/a | 3 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/plugins/plugins/content/seo/add-custom-seo-url.html | 0 | 100 (under-reported 1) | partly | `raw/vanilla/dev-24.json` |
| dev-25 | How do I add a `bin/console` command to my plugin for a main | n/a | 3 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/plugins/plugins/plugin-fundamentals/add-custom-commands.html | 0 | 100 (under-reported 1) | partly | `raw/vanilla/dev-25.json` |
| dev-26 | How do I add a custom document type such as a pro-forma invo | n/a | 26 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/plugins/plugins/checkout/documents/v2/add-a-document-type.html | 0 | 0 (under-reported 3) | fail | `raw/vanilla/dev-26.json` |
| dev-27 | In Shopware 6.7, how do I extend a Storefront Twig template  | n/a | 4 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/plugins/plugins/storefront/templates/customize-templates.html | 0 | 0 (under-reported 2) | partly | `raw/vanilla/dev-27.json` |
| dev-28 | How do I override an existing Storefront JavaScript plugin,  | n/a | 3 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/plugins/plugins/storefront/override-existing-javascript.html | 0 | 100 (under-reported 1) | partly | `raw/vanilla/dev-28.json` |
| dev-29 | How do I add my own data to an existing Storefront page or p | n/a | 3 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/plugins/plugins/storefront/add-data-to-storefront-page.html | 0 | 100 (under-reported 1) | partly | `raw/vanilla/dev-29.json` |
| dev-30 | How do I add a custom filter to the Storefront product listi | n/a | 3 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/plugins/plugins/storefront/howto/add-listing-filters.html | 0 | 100 (under-reported 1) | pass | `raw/vanilla/dev-30.json` |
| dev-31 | How do I expose a plugin configuration value, such as a colo | n/a | 3 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/plugins/plugins/storefront/add-scss-variables.html | 0 | 100 | partly | `raw/vanilla/dev-31.json` |
| dev-32 | How do I define a custom field set for products from my plug | n/a | 3 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/plugins/plugins/framework/custom-field/add-custom-field.html | 0 | 100 | partly | `raw/vanilla/dev-32.json` |
| dev-33 | How do I register a custom Administration module from my plu | n/a | 3 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/plugins/plugins/administration/module-component-management/add-custom-module.html | 0 | 100 | partly | `raw/vanilla/dev-33.json` |
| dev-34 | How do I extend an existing Administration component and its | n/a | 4 | n/a (no corpus) | – | https://developer.shopware.com/docs/v6.5/guides/plugins/plugins/administration/customizing-components.html | 0 | 100 | partly | `raw/vanilla/dev-34.json` |
| dev-35 | How do I load entities from the Admin API inside an Administ | n/a | 3 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/plugins/plugins/administration/data-handling-processing/using-data-handling.html | 0 | 100 | partly | `raw/vanilla/dev-35.json` |
| dev-36 | How do I register ACL privileges for my plugin's Administrat | n/a | 5 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.html | 0 | 100 | partly | `raw/vanilla/dev-36.json` |
| dev-37 | How do I set up and run PHPUnit integration tests for my Sho | n/a | 3 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/plugins/plugins/testing/php-unit.html | 0 | 100 | partly | `raw/vanilla/dev-37.json` |
| dev-38 | How do I write Jest unit tests for my Administration compone | n/a | 3 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/plugins/plugins/testing/jest-admin.html | 0 | 100 | partly | `raw/vanilla/dev-38.json` |
| dev-39 | How do I write end-to-end Cypress tests for my plugin agains | n/a | 7 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/development/testing/e2e-playwright/ | 1 | 100 | partly | `raw/vanilla/dev-39.json` |
| dev-40 | How do I upgrade a Composer-based Shopware project from 6.6  | n/a | 3 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/hosting/installation-updates/performing-updates.html | 0 | 100 | pass | `raw/vanilla/dev-40.json` |
| dev-41 | `composer update` to Shopware 6.7 aborts on a platform requi | n/a | 7 | n/a (no corpus) | – | https://docs.shopware.com/en/shopware-6-en/update-guides/update-guide-shopware-67 | 1 | 100 | partly | `raw/vanilla/dev-41.json` |
| dev-42 | How do I check extension compatibility before upgrading with | n/a | 5 | n/a (no corpus) | – | https://developer.shopware.com/docs/products/tools/cli/project-commands/upgrade.html | 0 | 100 | pass | `raw/vanilla/dev-42.json` |
| dev-43 | My admin plugin still ships a webpack.config.js — how do I m | n/a | 3 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/upgrades-migrations/administration/vite.html | 2 | 100 | partly | `raw/vanilla/dev-43.json` |
| dev-44 | After the Vue 3 upgrade my admin plugin broke — this.$parent | n/a | 5 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/upgrades-migrations/administration/vue3.html | 0 | 0 (under-reported 2) | fail | `raw/vanilla/dev-44.json` |
| dev-45 | Shopware.State is deprecated in 6.7 — how do I convert my ad | n/a | 3 | n/a (no corpus) | – | https://developer.shopware.com/docs/resources/references/adr/2024-06-17-replace-vuex-with-pinia.html | 1 | 100 | pass | `raw/vanilla/dev-45.json` |
| dev-46 | sw-button and sw-card are deprecated in Shopware 6.7 — how d | n/a | 3 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/plugins/plugins/administration/system-updates/meteor-components.html | 2 | 100 | fail | `raw/vanilla/dev-46.json` |
| dev-47 | My payment plugin implements `AsynchronousPaymentHandlerInte | n/a | 3 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/plugins/plugins/checkout/payment/add-payment-plugin.html | 1 | 100 | partly | `raw/vanilla/dev-47.json` |
| dev-48 | After upgrading, my storefront JavaScript plugin no longer l | n/a | 3 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/plugins/plugins/storefront/javascript/add-custom-javascript.html | 0 | 100 | partly | `raw/vanilla/dev-48.json` |
| dev-49 | My storefront controller still uses the `@Route` and `@Route | n/a | 4 | n/a (no corpus) | – | vendor/shopware/storefront/Controller/CartLineItemController | 1 | 100 | partly | `raw/vanilla/dev-49.json` |
| dev-50 | My `ScheduledTaskHandler` stopped running after the upgrade  | n/a | 5 | n/a (no corpus) | – | vendor/shopware/core/Checkout/Payment/Cleanup/CleanupPayment | 0 | 100 | partly | `raw/vanilla/dev-50.json` |
| dev-51 | Custom entities declared in `Resources/config/entities.xml`  | n/a | 3 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/entities-via-attributes.html | 1 | 100 (under-reported 1) | partly | `raw/vanilla/dev-51.json` |
| dev-52 | What must a plugin database migration class implement in Sho | n/a | 8 | n/a (no corpus) | – | vendor/shopware/core/Framework/Migration/MigrationStep.php:1 | 1 | 100 (under-reported 1) | partly | `raw/vanilla/dev-52.json` |
| dev-53 | My theme config labels disappeared from the Theme Manager af | n/a | 4 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/plugins/themes/theme-configuration.html | 0 | 100 (under-reported 1) | partly | `raw/vanilla/dev-53.json` |
| dev-54 | How do I register a plugin cookie in the storefront cookie c | n/a | 3 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/plugins/plugins/storefront/add-cookie-to-manager.html | 1 | 100 (under-reported 1) | partly | `raw/vanilla/dev-54.json` |
| dev-55 | How do the breaking storefront accessibility changes reach m | n/a | 3 | n/a (no corpus) | – | https://raw.githubusercontent.com/shopware/shopware/trunk/UPGRADE-6.7.md | 0 | 100 (under-reported 1) | fail | `raw/vanilla/dev-55.json` |
| dev-56 | Header and footer are loaded through ESI sub-requests in Sho | n/a | 3 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/plugins/plugins/storefront/templates/customize-header-footer.html | 0 | 100 (under-reported 1) | partly | `raw/vanilla/dev-56.json` |
| dev-57 | B2B Suite support ends with 6.8 — how do I run the B2B Suite | n/a | 3 | n/a (no corpus) | – | https://developer.shopware.com/docs/products/extensions/b2b-suite-migration/execution/running-migration.html | 0 | 100 (under-reported 1) | pass | `raw/vanilla/dev-57.json` |
| dev-58 | My shopware.yaml still uses redis_url — how do I define the  | n/a | 3 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/hosting/infrastructure/redis.html | 1 | 100 (under-reported 1) | partly | `raw/vanilla/dev-58.json` |
| dev-59 | After upgrading to Shopware 6.7 my Varnish cache is never in | n/a | 4 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/hosting/infrastructure/reverse-http-cache.html | 1 | 100 (under-reported 2) | partly | `raw/vanilla/dev-59.json` |
| dev-60 | Which transports do my Shopware message queue workers have t | n/a | 3 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/hosting/infrastructure/message-queue.html | 0 | 100 (under-reported 1) | partly | `raw/vanilla/dev-60.json` |
| dev-61 | After the upgrade my Elasticsearch index has to be rebuilt — | n/a | 3 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/hosting/infrastructure/elasticsearch/elasticsearch-setup.html | 0 | 100 | partly | `raw/vanilla/dev-61.json` |
| dev-62 | I changed a setting in `.env` on a deployed 6.7 shop but it  | n/a | 7 | n/a (no corpus) | – | https://symfony.com/doc/current/configuration.html | 1 | 100 (under-reported 1) | partly | `raw/vanilla/dev-62.json` |
| dev-63 | I deployed a plugin update to a 6.7 staging shop and my new  | n/a | 3 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/plugins/plugins/database/database-migrations.html | 0 | 100 | fail | `raw/vanilla/dev-63.json` |
| dev-64 | How do I get an Admin API OAuth token — with client_credenti | n/a | 4 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/development/integrations-api/auth-api-requests.html | 0 | 100 | partly | `raw/vanilla/dev-64.json` |
| dev-65 | What can I put in the JSON body of `POST /api/search/{entity | n/a | 6 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/development/integrations-api/search-criteria.html | 0 | 0 (under-reported 2) | fail | `raw/vanilla/dev-65.json` |
| dev-66 | Which request headers change Admin API behaviour for languag | n/a | 3 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/development/integrations-api/request-headers.html | 0 | 100 | pass | `raw/vanilla/dev-66.json` |
| dev-67 | What does a minimal app folder and `manifest.xml` need to co | n/a | 3 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/plugins/apps/app-base-guide.html | 0 | 100 | partly | `raw/vanilla/dev-67.json` |
| dev-68 | How does the registration handshake between Shopware and my  | n/a | 3 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/plugins/apps/lifecycle/app-registration-setup.html | 0 | 100 | pass | `raw/vanilla/dev-68.json` |
| dev-69 | How does an app subscribe to an event like `product.written` | n/a | 3 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/plugins/apps/lifecycle/webhook.html | 0 | 100 | partly | `raw/vanilla/dev-69.json` |
| dev-70 | How do I implement a payment method in an app with `pay-url` | n/a | 3 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/plugins/apps/payment.html | 0 | 100 | partly | `raw/vanilla/dev-70.json` |
| dev-71 | How does an app define its own custom entities in Shopware 6 | n/a | 4 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/plugins/apps/custom-data/custom-entities.html | 0 | 100 (under-reported 2) | partly | `raw/vanilla/dev-71.json` |
| func-01 | How do I create a product with variants and configure its vi | n/a | 5 | n/a (no corpus) | – | https://docs.shopware.com/en/shopware-6-en/catalogues/products | 1 | 100 (under-reported 2) | partly | `raw/vanilla/func-01.json` |
| func-02 | How do Rule Builder conditions work for shipping and payment | n/a | 4 | n/a (no corpus) | – | https://docs.shopware.com/en/shopware-6-en/settings/rules | 0 | 100 (under-reported 2) | partly | `raw/vanilla/func-02.json` |
| func-03 | How do promotions and discount codes work, including individ | n/a | 4 | n/a (no corpus) | – | https://docs.shopware.com/en/shopware-6-en/marketing/promotions | 1 | 100 (under-reported 2) | pass | `raw/vanilla/func-03.json` |
| func-04 | What does the Shopware Migration Assistant transfer automati | n/a | 4 | n/a (no corpus) | – | https://docs.shopware.com/en/migration-en/what-is-migrated | 0 | 100 (under-reported 2) | partly | `raw/vanilla/func-04.json` |
| func-05 | How do I set up a sales channel — storefront versus headless | n/a | 4 | n/a (no corpus) | – | https://docs.shopware.com/en/shopware-6-en/settings/saleschannel | 0 | 100 (under-reported 2) | partly | `raw/vanilla/func-05.json` |
| func-06 | Which triggers and actions does the Flow Builder offer, and  | n/a | 4 | n/a (no corpus) | – | https://docs.shopware.com/en/shopware-6-en/settings/Flow-Builder | 2 | 100 (under-reported 2) | partly | `raw/vanilla/func-06.json` |
| func-07 | How do I import products from a CSV with an import/export pr | n/a | 4 | n/a (no corpus) | – | https://docs.shopware.com/en/shopware-en/settings/importexport | 0 | 100 (under-reported 2) | partly | `raw/vanilla/func-07.json` |
| func-08 | How do custom field sets work — entity assignment, field typ | n/a | 4 | n/a (no corpus) | – | https://docs.shopware.com/en/shopware-6-en/settings/custom-fields | 1 | 100 (under-reported 2) | fail | `raw/vanilla/func-08.json` |
| func-09 | Why doesn't my payment method appear in the checkout — what  | n/a | 4 | n/a (no corpus) | – | https://docs.shopware.com/en/shopware-6-en/settings/Paymentmethods | 0 | 100 (under-reported 2) | pass | `raw/vanilla/func-09.json` |
| func-10 | How do dynamic product groups work in the administration and | n/a | 4 | n/a (no corpus) | – | https://docs.shopware.com/en/shopware-6-de/Catalogues/Dynamicproductgroups | 0 | 100 (under-reported 1) | partly | `raw/vanilla/func-10.json` |
| func-11 | How do I create an integration for Admin API access in the a | n/a | 3 | n/a (no corpus) | – | https://docs.shopware.com/en/shopware-6-en/settings/system/integrationen | 0 | 100 (under-reported 1) | partly | `raw/vanilla/func-11.json` |
| func-12 | A spec asks for customer-specific pricing and for a flow tha | n/a | 5 | n/a (no corpus) | – | https://docs.shopware.com/en/shopware-6-en/features/customer-specific-pricing | 1 | 100 (under-reported 1) | partly | `raw/vanilla/func-12.json` |
| edge-01 | How do I configure Shopware 6's built-in GraphQL API for the | n/a | 3 | n/a (no corpus) | – | https://github.com/shopwareArchive/SwagGraphQL | 0 | 100 (under-reported 1) | pass | `raw/vanilla/edge-01.json` |
| edge-02 | How do I get the DI container with `Shopware()->Container()` | n/a | 6 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/plugins/plugins/architecture/dependency-injection-dependency-handling.html | 0 | 100 (under-reported 1) | pass | `raw/vanilla/edge-02.json` |
| edge-03 | Where do the `#[ORM\Entity]` mapping attributes for my plugi | n/a | 3 | n/a (no corpus) | – | https://developer.shopware.com/docs/concepts/framework/data-abstraction-layer.html | 0 | 100 (under-reported 1) | partly | `raw/vanilla/edge-03.json` |
| edge-04 | How do I fetch products with `GET /sales-channel-api/v3/prod | n/a | 3 | n/a (no corpus) | – | https://github.com/shopware/platform/blob/trunk/changelog/release-6-3-2-0/2020-09-09-deprecate-sales-channel-api.md | 0 | 100 (under-reported 1) | pass | `raw/vanilla/edge-04.json` |
| edge-05 | How do I enable Shopware's built-in MCP server on a Shopware | n/a | 3 | n/a (no corpus) | – | https://developer.shopware.com/docs/products/tools/mcp-server/intro.html | 0 | 100 (under-reported 1) | pass | `raw/vanilla/edge-05.json` |
| edge-06 | I'm coming from Magento — what are the Shopware equivalents  | n/a | 3 | n/a (no corpus) | – | https://docs.shopware.com/en/migration-en/magento-keywords | 1 | 100 (under-reported 1) | partly | `raw/vanilla/edge-06.json` |
| edge-07 | How do I set up Shopware PWA as the storefront for a Shopwar | n/a | 5 | n/a (no corpus) | – | https://www.shopware.com/en/news/the-future-of-shopware-pwa/ | 1 | 70 (under-reported 1) | fail | `raw/vanilla/edge-07.json` |
| edge-08 | Which service do I type-hint to read products — `EntityRepos | n/a | 3 | n/a (no corpus) | – | vendor/shopware/core/Framework/DataAbstractionLayer/EntityRe | 1 | 0 (under-reported 1) | partly | `raw/vanilla/edge-08.json` |
| edge-09 | Where do I configure Business Events so that a mail is sent  | n/a | 3 | n/a (no corpus) | – | https://docs.shopware.com/en/shopware-6-en/settings/Business-Events | 1 | 100 (under-reported 1) | partly | `raw/vanilla/edge-09.json` |
| gap-01 | How do I add my own Admin API endpoint under `/api/...` from | n/a | 7 | n/a (no corpus) | – | vendor/shopware/core/Content/Seo/Api/SeoActionController.php | 2 | 0 (under-reported 1) | partly | `raw/vanilla/gap-01.json` |
| gap-02 | Shopware 6.7 removed the RSA JWT key files and `system:gener | n/a | 3 | n/a (no corpus) | – | https://developer.shopware.com/release-notes/6.6/6.6.1.0.html | 1 | 100 (under-reported 1) | pass | `raw/vanilla/gap-02.json` |
| gap-03 | My ERP integration stopped logging in after the 6.7 upgrade  | n/a | 4 | n/a (no corpus) | – | https://raw.githubusercontent.com/shopware/shopware/trunk/UPGRADE-6.7.md | 0 | 100 (under-reported 1) | pass | `raw/vanilla/gap-03.json` |
| gap-04 | After upgrading to 6.7 my plugin fatals on load because core | n/a | 2 | n/a (no corpus) | – | https://raw.githubusercontent.com/shopware/shopware/trunk/UPGRADE-6.7.md | 1 | 100 (under-reported 1) | pass | `raw/vanilla/gap-04.json` |
| gap-05 | My plugin decorates `CachedProductRoute` to add cache tags — | n/a | 3 | n/a (no corpus) | – | https://raw.githubusercontent.com/shopware/shopware/trunk/UPGRADE-6.7.md | 1 | 0 (under-reported 1) | fail | `raw/vanilla/gap-05.json` |
| gap-06 | How do I create a shipping method from my plugin's installer | n/a | 5 | n/a (no corpus) | – | vendor/shopware/core/Checkout/Shipping/ShippingMethodDefinit | 2 | 0 (under-reported 1) | partly | `raw/vanilla/gap-06.json` |
| gap-07 | How do I create a media entity from a file on disk in PHP fr | n/a | 6 | n/a (no corpus) | – | vendor/shopware/core/Content/Media/MediaService.php:54-91 | 1 | 0 (under-reported 1) | partly | `raw/vanilla/gap-07.json` |
| gap-08 | How do I set up a Nuxt project with Shopware Composable Fron | n/a | 6 | n/a (no corpus) | – | https://developer.shopware.com/frontends/resources/troubleshooting.html | 1 | 0 (under-reported 3) | partly | `raw/vanilla/gap-08.json` |
| rule-01 | May I extend (subclass) a concrete Shopware core service to  | n/a | 3 | n/a (no corpus) | – | https://developer.shopware.com/docs/resources/guidelines/code/core/decorator-pattern.html | 1 | 100 (under-reported 1) | pass | `raw/vanilla/rule-01.json` |
| rule-02 | Where should cleanup of my plugin's own data on uninstall go | n/a | 3 | n/a (no corpus) | – | https://developer.shopware.com/docs/guides/plugins/plugins/plugin-fundamentals/plugin-lifecycle.html | 0 | 100 (under-reported 1) | pass | `raw/vanilla/rule-02.json` |
| rule-03 | Which annotations mark a core class or method as off-limits  | n/a | 4 | n/a (no corpus) | – | https://developer.shopware.com/docs/resources/guidelines/code/core/final-and-internal.html | 3 | 100 (under-reported 1) | pass | `raw/vanilla/rule-03.json` |
| rule-04 | How should my plugin throw exceptions so they follow Shopwar | n/a | 3 | n/a (no corpus) | – | https://developer.shopware.com/docs/resources/references/adr/2022-02-24-domain-exceptions.html | 1 | 100 (under-reported 1) | pass | `raw/vanilla/rule-04.json` |
| rule-05 | Which test level should I pick for a change to a DAL entity  | n/a | 5 | n/a (no corpus) | – | https://developer.shopware.com/docs/resources/guidelines/code/core/unit-tests.html | 0 | 100 (under-reported 1) | pass | `raw/vanilla/rule-05.json` |
| rule-06 | Can a storefront controller contain business logic, or where | n/a | 4 | n/a (no corpus) | – | https://developer.shopware.com/docs/resources/guidelines/code/storefront-controller.html | 1 | 0 (under-reported 2) | partly | `raw/vanilla/rule-06.json` |

## Scores by case

### vanilla

| Case | Grounding | Accuracy | Completeness | Citation | Honesty | Actionability | Points | Total | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dev-01 | 100 | 40 | 0 | 40 | 100 | 100 | 25+10+0+4+15+10 | 64% | partly |
| dev-02 | 100 | 70 | 40 | 40 | 100 | 100 | 25+17.5+6+4+15+10 | 77% | partly |
| dev-03 | 100 | 70 | 40 | 40 | 100 | 100 | 25+17.5+6+4+15+10 | 77% | partly |
| dev-04 | 100 | 70 | 70 | 40 | 100 | 100 | 25+17.5+10.5+4+15+10 | 82% | partly |
| dev-05 | 100 | 70 | 70 | 40 | 100 | 100 | 25+17.5+10.5+4+15+10 | 82% | partly |
| dev-06 | 100 | 70 | 70 | 40 | 100 | 100 | 25+17.5+10.5+4+15+10 | 82% | partly |
| dev-07 | 100 | 40 | 100 | 40 | 100 | 100 | 25+10+15+4+15+10 | 79% | partly |
| dev-08 | 100 | 70 | 70 | 40 | 100 | 100 | 25+17.5+10.5+4+15+10 | 82% | partly |
| dev-09 | 100 | 70 | 70 | 40 | 100 | 100 | 25+17.5+10.5+4+15+10 | 82% | partly |
| dev-10 | 100 | 40 | 40 | 40 | 100 | 100 | 25+10+6+4+15+10 | 70% | partly |
| dev-11 | 70 | 70 | 40 | 40 | 0 | 100 | 17.5+17.5+6+4+0+10 | 55% | fail |
| dev-12 | 100 | 70 | 70 | 40 | 100 | 100 | 25+17.5+10.5+4+15+10 | 82% | partly |
| dev-13 | 0 | 70 | 70 | 0 | 0 | 0 | 0+17.5+10.5+0+0+0 | 28% | fail |
| dev-14 | 100 | 70 | 70 | 40 | 100 | 100 | 25+17.5+10.5+4+15+10 | 82% | partly |
| dev-15 | 100 | 40 | 0 | 40 | 100 | 100 | 25+10+0+4+15+10 | 64% | partly |
| dev-16 | 100 | 70 | 70 | 40 | 100 | 100 | 25+17.5+10.5+4+15+10 | 82% | partly |
| dev-17 | 100 | 70 | 70 | 40 | 100 | 100 | 25+17.5+10.5+4+15+10 | 82% | partly |
| dev-18 | 100 | 40 | 40 | 40 | 100 | 100 | 25+10+6+4+15+10 | 70% | partly |
| dev-19 | 100 | 40 | 40 | 40 | 100 | 100 | 25+10+6+4+15+10 | 70% | partly |
| dev-20 | 100 | 40 | 0 | 40 | 100 | 100 | 25+10+0+4+15+10 | 64% | partly |
| dev-21 | 100 | 70 | 40 | 40 | 100 | 100 | 25+17.5+6+4+15+10 | 77% | partly |
| dev-22 | 100 | 70 | 70 | 40 | 100 | 100 | 25+17.5+10.5+4+15+10 | 82% | partly |
| dev-23 | 100 | 70 | 40 | 40 | 100 | 100 | 25+17.5+6+4+15+10 | 77% | partly |
| dev-24 | 100 | 70 | 70 | 40 | 100 | 100 | 25+17.5+10.5+4+15+10 | 82% | partly |
| dev-25 | 100 | 70 | 70 | 40 | 100 | 100 | 25+17.5+10.5+4+15+10 | 82% | partly |
| dev-26 | 100 | 0 | 0 | 40 | 0 | 100 | 25+0+0+4+0+10 | 39% | fail |
| dev-27 | 100 | 100 | 70 | 40 | 0 | 100 | 25+25+10.5+4+0+10 | 74% | partly |
| dev-28 | 100 | 70 | 70 | 40 | 100 | 100 | 25+17.5+10.5+4+15+10 | 82% | partly |
| dev-29 | 100 | 70 | 70 | 40 | 100 | 100 | 25+17.5+10.5+4+15+10 | 82% | partly |
| dev-30 | 100 | 100 | 100 | 40 | 100 | 100 | 25+25+15+4+15+10 | 94% | pass |
| dev-31 | 100 | 70 | 70 | 40 | 100 | 100 | 25+17.5+10.5+4+15+10 | 82% | partly |
| dev-32 | 100 | 70 | 70 | 40 | 100 | 100 | 25+17.5+10.5+4+15+10 | 82% | partly |
| dev-33 | 100 | 70 | 70 | 40 | 100 | 100 | 25+17.5+10.5+4+15+10 | 82% | partly |
| dev-34 | 70 | 70 | 40 | 40 | 100 | 100 | 17.5+17.5+6+4+15+10 | 70% | partly |
| dev-35 | 100 | 70 | 70 | 40 | 100 | 100 | 25+17.5+10.5+4+15+10 | 82% | partly |
| dev-36 | 100 | 70 | 70 | 40 | 100 | 100 | 25+17.5+10.5+4+15+10 | 82% | partly |
| dev-37 | 100 | 70 | 70 | 40 | 100 | 100 | 25+17.5+10.5+4+15+10 | 82% | partly |
| dev-38 | 100 | 40 | 70 | 40 | 100 | 70 | 25+10+10.5+4+15+7 | 71% | partly |
| dev-39 | 100 | 70 | 40 | 40 | 100 | 70 | 25+17.5+6+4+15+7 | 74% | partly |
| dev-40 | 100 | 100 | 100 | 40 | 100 | 100 | 25+25+15+4+15+10 | 94% | pass |
| dev-41 | 100 | 40 | 0 | 100 | 100 | 70 | 25+10+0+10+15+7 | 67% | partly |
| dev-42 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| dev-43 | 100 | 40 | 0 | 100 | 100 | 70 | 25+10+0+10+15+7 | 67% | partly |
| dev-44 | 70 | 40 | 40 | 100 | 0 | 40 | 17.5+10+6+10+0+4 | 47% | fail |
| dev-45 | 100 | 100 | 100 | 100 | 100 | 100 | 25+25+15+10+15+10 | 100% | pass |
| dev-46 | 100 | 0 | 0 | 40 | 100 | 40 | 25+0+0+4+15+4 | 48% | fail |
| dev-47 | 100 | 70 | 70 | 40 | 100 | 100 | 25+17.5+10.5+4+15+10 | 82% | partly |
| dev-48 | 100 | 70 | 70 | 40 | 100 | 100 | 25+17.5+10.5+4+15+10 | 82% | partly |
| dev-49 | 100 | 70 | 40 | 40 | 100 | 100 | 25+17.5+6+4+15+10 | 77% | partly |
| dev-50 | 100 | 70 | 70 | 40 | 100 | 100 | 25+17.5+10.5+4+15+10 | 82% | partly |
| dev-51 | 70 | 40 | 70 | 40 | 100 | 70 | 17.5+10+10.5+4+15+7 | 64% | partly |
| dev-52 | 100 | 70 | 70 | 40 | 100 | 70 | 25+17.5+10.5+4+15+7 | 79% | partly |
| dev-53 | 100 | 40 | 40 | 40 | 100 | 70 | 25+10+6+4+15+7 | 67% | partly |
| dev-54 | 100 | 70 | 70 | 40 | 100 | 100 | 25+17.5+10.5+4+15+10 | 82% | partly |
| dev-55 | 70 | 40 | 40 | 40 | 100 | 40 | 17.5+10+6+4+15+4 | 56% | fail |
| dev-56 | 100 | 70 | 70 | 40 | 100 | 100 | 25+17.5+10.5+4+15+10 | 82% | partly |
| dev-57 | 100 | 70 | 100 | 40 | 100 | 100 | 25+17.5+15+4+15+10 | 86% | pass |
| dev-58 | 100 | 70 | 70 | 40 | 100 | 100 | 25+17.5+10.5+4+15+10 | 82% | partly |
| dev-59 | 100 | 40 | 70 | 40 | 100 | 100 | 25+10+10.5+4+15+10 | 74% | partly |
| dev-60 | 100 | 40 | 40 | 40 | 100 | 100 | 25+10+6+4+15+10 | 70% | partly |
| dev-61 | 100 | 40 | 40 | 40 | 100 | 70 | 25+10+6+4+15+7 | 67% | partly |
| dev-62 | 70 | 70 | 70 | 40 | 100 | 40 | 17.5+17.5+10.5+4+15+4 | 68% | partly |
| dev-63 | 70 | 40 | 40 | 40 | 100 | 70 | 17.5+10+6+4+15+7 | 59% | fail |
| dev-64 | 100 | 40 | 70 | 40 | 100 | 100 | 25+10+10.5+4+15+10 | 74% | partly |
| dev-65 | 70 | 40 | 70 | 40 | 0 | 70 | 17.5+10+10.5+4+0+7 | 49% | fail |
| dev-66 | 100 | 70 | 100 | 100 | 100 | 100 | 25+17.5+15+10+15+10 | 92% | pass |
| dev-67 | 100 | 40 | 40 | 40 | 100 | 70 | 25+10+6+4+15+7 | 67% | partly |
| dev-68 | 100 | 70 | 70 | 100 | 100 | 70 | 25+17.5+10.5+10+15+7 | 85% | pass |
| dev-69 | 100 | 70 | 70 | 40 | 100 | 100 | 25+17.5+10.5+4+15+10 | 82% | partly |
| dev-70 | 100 | 70 | 40 | 100 | 100 | 70 | 25+17.5+6+10+15+7 | 80% | partly |
| dev-71 | 100 | 70 | 70 | 40 | 100 | 70 | 25+17.5+10.5+4+15+7 | 79% | partly |
| func-01 | 100 | 70 | 40 | 100 | 100 | 70 | 25+17.5+6+10+15+7 | 80% | partly |
| func-02 | 100 | 70 | 40 | 100 | 100 | 40 | 25+17.5+6+10+15+4 | 77% | partly |
| func-03 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| func-04 | 100 | 70 | 70 | 40 | 100 | 100 | 25+17.5+10.5+4+15+10 | 82% | partly |
| func-05 | 100 | 70 | 40 | 40 | 100 | 70 | 25+17.5+6+4+15+7 | 74% | partly |
| func-06 | 70 | 40 | 40 | 100 | 100 | 70 | 17.5+10+6+10+15+7 | 65% | partly |
| func-07 | 100 | 70 | 40 | 40 | 100 | 70 | 25+17.5+6+4+15+7 | 74% | partly |
| func-08 | 70 | 40 | 40 | 40 | 100 | 70 | 17.5+10+6+4+15+7 | 59% | fail |
| func-09 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| func-10 | 100 | 70 | 70 | 40 | 100 | 100 | 25+17.5+10.5+4+15+10 | 82% | partly |
| func-11 | 70 | 70 | 70 | 40 | 100 | 70 | 17.5+17.5+10.5+4+15+7 | 71% | partly |
| func-12 | 100 | 70 | 70 | 40 | 100 | 100 | 25+17.5+10.5+4+15+10 | 82% | partly |
| edge-01 | 100 | 100 | 100 | 40 | 100 | 100 | 25+25+15+4+15+10 | 94% | pass |
| edge-02 | 100 | 100 | 100 | 40 | 100 | 100 | 25+25+15+4+15+10 | 94% | pass |
| edge-03 | 100 | 70 | 70 | 40 | 100 | 70 | 25+17.5+10.5+4+15+7 | 79% | partly |
| edge-04 | 100 | 70 | 100 | 40 | 100 | 100 | 25+17.5+15+4+15+10 | 86% | pass |
| edge-05 | 100 | 100 | 100 | 40 | 100 | 100 | 25+25+15+4+15+10 | 94% | pass |
| edge-06 | 70 | 40 | 100 | 40 | 100 | 70 | 17.5+10+15+4+15+7 | 68% | partly |
| edge-07 | 0 | 0 | 40 | 40 | 70 | 70 | 0+0+6+4+10.5+7 | 27% | fail |
| edge-08 | 100 | 100 | 100 | 40 | 0 | 100 | 25+25+15+4+0+10 | 79% | partly |
| edge-09 | 70 | 40 | 40 | 100 | 100 | 70 | 17.5+10+6+10+15+7 | 65% | partly |
| gap-01 | 100 | 70 | 40 | 100 | 0 | 100 | 25+17.5+6+10+0+10 | 68% | partly |
| gap-02 | 100 | 100 | 100 | 100 | 100 | 100 | 25+25+15+10+15+10 | 100% | pass |
| gap-03 | 100 | 100 | 100 | 100 | 100 | 100 | 25+25+15+10+15+10 | 100% | pass |
| gap-04 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| gap-05 | 70 | 40 | 40 | 40 | 0 | 40 | 17.5+10+6+4+0+4 | 41% | fail |
| gap-06 | 100 | 100 | 100 | 40 | 0 | 100 | 25+25+15+4+0+10 | 79% | partly |
| gap-07 | 100 | 70 | 100 | 40 | 0 | 100 | 25+17.5+15+4+0+10 | 71% | partly |
| gap-08 | 100 | 70 | 100 | 40 | 0 | 100 | 25+17.5+15+4+0+10 | 71% | partly |
| rule-01 | 100 | 100 | 100 | 40 | 100 | 100 | 25+25+15+4+15+10 | 94% | pass |
| rule-02 | 100 | 100 | 100 | 100 | 100 | 100 | 25+25+15+10+15+10 | 100% | pass |
| rule-03 | 70 | 100 | 100 | 100 | 100 | 100 | 17.5+25+15+10+15+10 | 92% | pass |
| rule-04 | 100 | 100 | 100 | 40 | 100 | 100 | 25+25+15+4+15+10 | 94% | pass |
| rule-05 | 100 | 100 | 100 | 40 | 100 | 100 | 25+25+15+4+15+10 | 94% | pass |
| rule-06 | 100 | 100 | 100 | 40 | 0 | 100 | 25+25+15+4+0+10 | 79% | partly |

`unavailable` means the Source-absent override applied — none occurred in this run.

## Failures and official references

- **dev-11 (vanilla)** — fail, 55%
  - Ground truth shows 15 actual retrieval calls (7 WebSearch, 2 WebFetch, 2 Bash beyond housekeeping) against only 3 self-reported in toolCallLog — a materially under-reported log, scored honesty 0 per the rubric.
  - The services.php recipe matches the documented current idiom and both cited quotes verify, but the answer omits the 6.7.13.0-vs-6.7.14.0 XML/PHP deprecation nuance and does not state that autowiring is off by default.
  - Official: Framework/Bundle.php:212-231 — "foreach ($this->getServicesFilePathArray($this->getPath() . '/Resources/config/services.*') as $path) { $delegatingLoader->load($path); }"
- **dev-13 (vanilla)** — fail, 28%
  - Ground truth shows zero actual retrieval calls for this case, although the report's toolCallLog claims 3 calls including two WebFetch reads — both citations fail verification (citationsVerified 0/2, matchesToolCallLog false) and one is listed under unbackedCitations.
  - This is fabricated content presented as retrieved documentation text: grounding, citation, honesty and actionability all score 0 per the fabrication bands (no supporting entry in the call log).
  - The decoration recipe described (decorate()/'.inner'/getDecorated()) is directionally accurate as text, but omits the Extension/ExtensionDispatcher extension-point alternative that is fact 1 of the expected answer; scored on the text per rubric since the Source-absent override does not apply (notFoundClaim is false, not a genuine corpus-absence case).
  - Official: Checkout/Cart/RuleLoader.php:30-33 — "public function getDecorated(): AbstractRuleLoader { throw new DecorationPatternException(self::class); }"
- **dev-26 (vanilla)** — fail, 39%
  - This is the confirmed trap case: at 6.7.13.0 the answer must use the legacy v1 stack (AbstractDocumentRenderer, tag document.renderer). The agent's entire answer is built on the Document v2 recipe (AbstractDocumentType, AbstractDocumentDataProvider, shopware.document_v2.type/.provider), which the expected-answer evidence shows does not exist at this patch (AbstractDocumentType first ships 6.7.14.0, @internal). None of the 3 expected v1 facts are present.
  - 3 unlabelled uncited factual claims listed by the audit cap Citation at 40 despite 4/4 verified citations.
  - selfReportDelta shows 2 Bash calls and a WebFetch materially under-reported in toolCallLog, with no housekeeping annotation from the auditor — Honesty = 0.
  - Actionability scored high because the steps given are concrete and executable, even though they build the wrong stack for the pinned version (that failure is captured by Accuracy/Completeness).
  - Official: Checkout/Document/Renderer/AbstractDocumentRenderer.php:19-29 — "abstract public function supports(): string; ... abstract public function getDecorated(): AbstractDocumentRenderer;"
- **dev-44 (vanilla)** — fail, 47%
  - Correctly gives the prop-default $tc fix (Shopware.Snippet.tc) — fact 1 present and accurate.
  - For the $parent issue the agent invents a specific fix ('this.$parent may now need to be this.$parent.$parent') that the expected-answer's code evidence explicitly calls out as the wrong general fix — the AsyncWrapperComponent depth is not fixed at one hop (11 hard-coded sync names + router path insert none). This directly contradicts fact 2, a material inaccuracy.
  - Never mentions that $tc itself still works in 6.7 as a deprecated alias, or the codemod (fact 3) — completeness 1/3.
  - selfReportDelta shows a Read and a WebFetch materially under-reported with no housekeeping annotation — Honesty = 0.
  - Because the $parent guidance given would actively mislead an implementation, Actionability is docked to 40 despite otherwise specific content.
  - Official: administration src/core/shopware.ts:264-275 — "Shopware.Snippet.tc(...) is the getter spreading the running app's i18n.global, aliasing tc to t"
- **dev-46 (vanilla)** — fail, 48%
  - This case's documented Trap is the docs' own invocation `composer run admin:code-mods -- --plugin-name example-plugin --fix -v 6.7`, which does not exist outside the shopware/shopware monorepo. The agent's answer recommends exactly this non-functional command as 'the' codemod — a materially wrong, non-actionable answer to the query's actual question.
  - Also claims (memory-labelled) that sw-button/sw-card 'generate console warnings' in 6.7; the expected-answer's code evidence states they emit no runtime deprecation warning at all — a second material inaccuracy.
  - Never mentions that the deprecated-prop pattern covers only 15 named components and that sw-tabs/sw-popover/sw-loader/sw-skeleton-bar use a different feature-flag gate (fact 2) — completeness 0/3.
  - 1 unlabelled uncited factual claim caps Citation at 40.
  - Official: expected/dev-46.md [code: administration: Resources/app/administration/code-mods.js:11-14,98-102,121-146,254-286,470-475] — "The invocation the docs give, composer run admin:code-mods ..., does not exist in a Flex/project install — that script is only in the monorepo's composer.json."
- **dev-55 (vanilla)** — fail, 56%
  - Never states the central fact that ACCESSIBILITY_TWEAKS is inert/unconditional in 6.7 (declared but read nowhere) — the case's own trap (an answer suggesting the flag still gates the behaviour) is neither committed nor avoided because the flag is never mentioned.
  - Omits the sw_extends mechanism entirely: that an override of a removed block is silently dropped, while a `{{ parent() }}` call throws — the actual technical remedy the query asks for.
  - Omits the SCSS-variable and JS-generated-markup halves of the remedy (fact 3); presents only the Twig/markup examples.
  - Answer is a correct-but-generic list of markup changes without the requested 'what must an override do' mechanism, which is Actionability-limiting.
  - Official: Framework/Resources/config/packages/feature.yaml:24-28 — "- name: ACCESSIBILITY_TWEAKS\n  default: true\n  major: true\n  toggleable: true"
- **dev-63 (vanilla)** — fail, 59%
  - Only fact 1 (the bare command shape) is given; fact 2 (installed/active requirement, silent exit-0 on an unknown identifier, container-compile-time Migration-directory registration needing cache:clear for a first-ever migration) is entirely omitted.
  - Fact 3 (normal path is plugin:update, gated by plugin:refresh updating upgradeVersion) is entirely omitted.
  - Given the query is specifically a troubleshooting scenario ('my new migration never ran'), the answer's failure to name any of the silent-failure modes materially undercuts its usefulness.
  - One unlabelled uncited factual claim caps Citation at 40.
  - Official: Framework/Migration/Command/MigrationCommand.php:121-129 — "an unknown identifier is not an error — the command prints 'No collection found for identifier' and exits 0"
- **dev-65 (vanilla)** — fail, 49%
  - Claims total-count-mode=1 (exact) works via 'SQL_CALC_FOUND_ROWS' — ground truth is a second COUNT(*) query over a subquery, not SQL_CALC_FOUND_ROWS; this specific mechanism is not supported by the cited excerpt and is stated as fact rather than flagged as memory/uncertain.
  - filter/associations/sort/aggregations shape (fact 1, fact 2 core) is reasonably covered; the post-filter-vs-aggregation distinction and the to-one/to-many association-filter nuance (fact 2) are omitted.
  - One unlabelled uncited factual claim caps Citation at 40; the fabricated SQL_CALC_FOUND_ROWS detail is a further claim outrunning what the cited excerpt supports, which lowers Honesty to 70 rather than 100.
  - Official: Framework/DataAbstractionLayer/Dbal/EntitySearcher.php:191,203 — "total-count-mode exact (1) resets order/limit and runs a second COUNT(*) over the subquery (not SQL_CALC_FOUND_ROWS)"
- **edge-07 (vanilla)** — fail, 27%
  - Correctly names Shopware Frontends as the recommended successor, but then fabricates a detailed 'classic PWA setup is still technically possible on 6.7' walkthrough ([from memory]: npm packages, Headless sales-channel, .env config) despite the case's own evidence that 6.7 carries zero PWA references anywhere in core/storefront/administration
  - This directly violates the case's core requirement that a correct answer 'gives no 6.7 PWA installation steps' — scored as a fabricated how-to for something that does not exist on 6.7
  - Never names the real 6.7 headless mechanism (API-type sales channel + sw-access-key/sw-context-token) that fact 2 requires
  - Official: composer.json:7-10 — "a word-boundary search for pwa over vendor/shopware/core, storefront and administration returns zero matches"
- **func-08 (vanilla)** — fail, 59%
  - Covers set/entity assignment, field-type list and Store-API write gist correctly, but omits the three-independent-switches architecture, the restriction to 3 entities, global (not per-set) name uniqueness, and the 6.6 data-loss bug
  - 1 unlabelled uncited factual claim flagged -> citation capped at 40
  - Official: System/CustomField/CustomFieldDefinition.php:66-68 — "(new StringField('name', 'name'))->addFlags(new Required(), new Immutable())"
- **gap-05 (vanilla)** — fail, 41%
  - Correctly confirms via UPGRADE-6.7.md and a repo search that Cached*Route classes are gone in 6.7
  - The suggested replacement mechanism is vague and wrong in the details: never names the real _httpCache route default or CacheTagCollector::addTag(), and completely omits the critical qualifier that store-api HTTP caching only landed in 6.7.6.0 gated behind the CACHE_REWORK flag (default false) — so on a stock 6.7 install nothing described actually caches the route
  - Auditor did not mark the missing Bash call as housekeeping (auditNotes empty) -> honesty=0
  - Official: Framework/Adapter/Cache/Http/CacheResponseSubscriber.php:119-123 — "store-api HTTP caching landed in 6.7.6.0, gated behind the experimental CACHE_REWORK feature flag, which defaults to false"
- **dev-01 (vanilla)** — partly, 64%
  - Answer says to override defineFields() on an EntityExtension class — the actual hook is extendFields(); defineFields() belongs to EntityDefinition, not EntityExtension.
  - Does not state the getEntityName() vs getDefinitionClass() 6.6/6.7 distinction, the extension-field-type restriction, or the shopware.entity.extension tag — 0 of 3 expected facts present.
  - The two verified citations support only a side detail (autoload recursion); the core recipe is unlabelled, uncited paraphrase.
  - Official: Framework/DataAbstractionLayer/EntityExtension.php:46 — "abstract public function getEntityName(): string;"
- **dev-02 (vanilla)** — partly, 77%
  - Correctly explains keepUserData() behaviour on uninstall (core never drops data itself, plugin must check the flag).
  - Omits the seven-hook/constructor-final shape and the PluginLifecycleService install/uninstall ordering + CLI flags — 1 of 3 facts fully present.
  - Substantial uncited paraphrase beyond the two quoted excerpts.
  - Official: Framework/Plugin/Context/UninstallContext.php:24-29 — "public function keepUserData(): bool { return $this->keepUserData; }"
- **dev-03 (vanilla)** — partly, 77%
  - Captures the abstract/concrete route + #[Route] attribute pattern but omits the mandatory route-scope requirement (RouteScopeListener throws invalidRouteScope without it).
  - Missing StoreApiResponse's automatic JSON encoding via a kernel.response listener and the Criteria _entity default requirement.
  - Registration two-step is captured but the 'plugin must be active or no routes are imported at all' caveat is missing.
  - Official: Framework/Routing/StoreApiRouteScope.php:13-19 — "final public const ID = 'store-api'; final public const ALLOWED_PATH = 'store-api';"
- **dev-04 (vanilla)** — partly, 82%
  - Administration registration and storefront naming-convention rendering are both captured well.
  - The optional server-side AbstractCmsElementResolver (getType/collect/enrich, autoconfigured shopware.cms.data_resolver tag) is not mentioned at all.
  - Does not flag the trap that the Shopping Experiences sidebar list is built from blocks only, not elements.
  - Official: administration cms.service.ts:155-171 — "if (!config.name || !config.component || config.flag === false) { return false; }"
- **dev-05 (vanilla)** — partly, 82%
  - theme.json inheritance sections and the SCSS override-ordering rationale (why override.scss must precede @Storefront) are both captured.
  - Does not state that the Twig 'views' hierarchy is a mechanism separate from the style/script ordering — it implies the same layering rule applies to all four sections.
  - Official: Theme/ThemeFileResolver.php:157-170 — "private function isInclude(string $file): bool { return str_starts_with($file, '@'); }"
- **dev-06 (vanilla)** — partly, 82%
  - FlowAction's contract (requirements()/handleFlow()/getName()) and the mandatory flow.action tag with a 'key' attribute are both stated correctly.
  - Admin registration methods (addActionNames/addLabels/addIcons/addGroups) and the optional DelayableAction/TransactionalAction markers are only vaguely alluded to, not stated.
  - Official: Content/Flow/Dispatching/Action/FlowAction.php:9-19 — "abstract public function requirements(): array; abstract public function handleFlow(StorableFlow $flow): void; abstract public static function getName(): string;"
- **dev-07 (vanilla)** — partly, 79%
  - Correctly describes the definition/entity/collection triple and the two abstract methods (getEntityName/defineFields).
  - States that the tag's 'entity' attribute is what tells Shopware the entity name — code shows EntityCompilerPass never reads that attribute; it instantiates the class and calls getEntityName(). This is a materially wrong statement matching a documented trap.
  - Migration/table creation is captured but doesn't mention that created_at/updated_at are auto-added by defaultFields().
  - Official: Framework/DependencyInjection/CompilerPass/EntityCompilerPass.php:39-90 — "EntityCompilerPass never reads tag attributes; it does new $class() and calls getEntityName() — the entity attribute is never read."
- **dev-08 (vanilla)** — partly, 82%
  - Correctly avoids the Doctrine findBy() trap and gives an accurate Criteria/search()/addFilter/addAssociation/addSorting recipe.
  - Omits searchIds()'s mandatory role for ManyToMany mapping entities and the missing sort tie-breaker caveat (non-unique sort can return duplicate rows on pagination).
  - Official: Framework/DataAbstractionLayer/EntityRepository.php:62-68 — "public function search(Criteria $criteria, Context $context): EntitySearchResult"
- **dev-09 (vanilla)** — partly, 82%
  - TranslatedField + TranslationsAssociationField + EntityTranslationDefinition/getParentDefinitionClass() mechanism is captured well.
  - Does not mention the newer 6.7 attribute-based route (#[Field(translated: true)] + #[Translations]) that generates the second definition automatically.
  - Official: Framework/DataAbstractionLayer/Field/TranslatedField.php:22-28 — "public function __construct(string $propertyName, private readonly bool $useForSorting = false)"
- **dev-10 (vanilla)** — partly, 70%
  - Lists only 4 of the 6 abstract EntityIndexer members (misses getTotal() and getDecorated()) — a developer following this recipe would fail to implement the interface. Materially incomplete/misleading.
  - Correctly names bin/console dal:refresh:index for a full reindex.
  - Does not mention the synchronous-vs-queued dispatch rule or the re-entrancy hazard when writing inside handle().
  - Official: Framework/DataAbstractionLayer/Indexing/EntityIndexer.php:9-49 — "abstract public function iterate(?array $offset): ?EntityIndexingMessage;"
- **dev-12 (vanilla)** — partly, 82%
  - Correctly reuses the dev-11 citation (backed via reuse) and labels the version-parity claim [from memory] rather than presenting it as freshly retrieved — an honest empty toolCallLog for a case answered from a reused page.
  - Matches the constructor-injection example but does not state that autowiring is off by default in both 6.6 and 6.7.
  - Official: github v6.6.10.24 src/Core/Framework/Bundle.php:188-210 — "foreach ($this->getServicesFilePathArray($this->getPath() . '/Resources/config/services.*') as $path) { $delegatingLoader->load($path); }"
- **dev-14 (vanilla)** — partly, 82%
  - Correctly resolves the case's central trap: kernel.event_subscriber is the real tag, shopware.event_subscriber does not exist.
  - Does not mention that the service definition must live in the plugin's Resources/config/services.* file to be loaded at all — the mechanical 'never fires' cause named in fact 3.
  - Official: Framework/Plugin/Command/Scaffolding/Generator/EventSubscriberGenerator.php:23-29 — "<service id="...\Subscriber\MySubscriber"> <tag name="kernel.event_subscriber"/> </service>"
- **dev-15 (vanilla)** — partly, 64%
  - Recommends the Symfony profiler's Events tab and grepping for ->dispatch/EventDispatcherInterface — legitimate, doc-backed guidance, but none of the three expected facts (nameless nested DAL events, StorefrontRenderEvent firing before render not after, debug:event-dispatcher only showing already-listened events) are addressed.
  - 0 of 3 expected facts present despite an on-topic, doc-grounded answer.
  - Official: Framework/DataAbstractionLayer/Event/EntityLoadedEvent.php:31 — "$this->name = $this->definition->getEntityName() . '.loaded';"
- **dev-16 (vanilla)** — partly, 82%
  - Correctly identifies OrderEvents::ORDER_WRITTEN_EVENT and the PreWriteValidationEvent/requestChangeSet() opt-in mechanism for change sets.
  - Does not mention that only UpdateCommand/DeleteCommand implement ChangeSetAware (inserts never yield a change set) or that change-set keys are DB storage names, not property names.
  - Official: Checkout/Order/OrderEvents.php:11 — "final public const ORDER_WRITTEN_EVENT = 'order.written';"
- **dev-17 (vanilla)** — partly, 82%
  - Correctly names both interfaces (CartDataCollectorInterface/CartProcessorInterface) and the QuantityPriceDefinition/QuantityPriceCalculator recipe.
  - Omits the priority mechanism (ProductCartProcessor runs at 5000; a plugin must run after it) and the customPrice-plus-permission gate needed to make an overwrite actually stick.
  - Official: Checkout/Cart/CartProcessorInterface.php:12 — "public function process(CartDataCollection $data, Cart $original, Cart $toCalculate, SalesChannelContext $context, CartBehavior $behavior): void;"
- **dev-18 (vanilla)** — partly, 70%
  - Recommends putting the surcharge line-item creation/idempotency check in the collector — this is backwards: CartDataCollectorInterface::collect() has no $toCalculate parameter at all, so a collector cannot add line items to the cart; only the processor can. A materially wrong, actionable-but-incorrect architectural recommendation.
  - Does not explain the actual duplication mechanism (CartRuleLoader's up-to-7-iteration recalculation loop feeding results back in as input, and LineItemCollection::add() summing quantities on an existing id rather than replacing it).
  - The stale-price fix (recompute inside process() every pass) is directionally correct.
  - Official: Checkout/Cart/CartDataCollectorInterface.php:12 — "public function collect(CartDataCollection $data, Cart $original, SalesChannelContext $context, CartBehavior $behavior): void;"
- **dev-19 (vanilla)** — partly, 70%
  - States that the #[AsMessageHandler] attribute alone registers the handler 'without further service-file wiring' — the opposite of the code: Shopware never marks plugin service definitions autoconfigured, so the explicit messenger.message_handler tag (or an autoconfigure=true opt-in) is required; an unregistered handler fails at runtime with NoHandlerForMessageException. Materially misleading.
  - Does not mention AsyncMessageInterface/LowPriorityMessageInterface as what actually routes work off the request thread.
  - Official: Framework/Bundle.php:212-224 — "grep setAutoconfigured|->autoconfigure( over core returns 0 hits — Shopware never marks plugin definitions autoconfigured"
- **dev-20 (vanilla)** — partly, 64%
  - States that tagging the rule service with shopware.rule.definition 'is what makes it discoverable and selectable' and later that 'the backend rule alone is enough to make it selectable' — this contradicts the case's central point: administration registration (decorating ruleConditionDataProviderService and calling addCondition()) is a separate, mandatory step. Materially wrong statement.
  - Omits the RULE_NAME constant / getConstraints() contract and the RuleConfig-driven generic-component shortcut.
  - Official: administration condition-type-data-provider.decorator.ts:953-979 — "the admin builds its list from the client-side CONDITIONS array registered into ruleConditionDataProviderService; nothing derives the dropdown from tagged PHP services"
- **dev-21 (vanilla)** — partly, 77%
  - Correctly names the FlowEventAware/Aware-interface requirement and the BusinessEventCollectorEvent subscriber registration route.
  - Does not mention the Bundle::getActionEventClasses() alternative registration route, the critical Collection::add() vs set() bug (an add()'d event never resolves by name), or that dispatch is keyed on $event->getName() rather than any admin-defined custom name — this is the case's documented trap and the answer neither repeats nor corrects it, it simply omits it.
  - Official: Framework/Event/FlowEventAware.php:9-14 — "interface FlowEventAware extends ShopwareEvent { public static function getAvailableData(): EventDataCollection; public function getName(): string; }"
- **dev-22 (vanilla)** — partly, 82%
  - config.xml file location and 'no PHP class needed' claim are both correct.
  - Lists 15 of the 16 XSD-enumerated input-field types (misses 'price').
  - Does not mention the system_config storage key format or that only fields with a <defaultValue> get a row at plugin install.
  - Official: System/SystemConfig/Util/ConfigReader.php:33-41 — "$bundleConfigName = 'Resources/config/config.xml'; ... throw SystemConfigException::bundleConfigNotFound(...)"
- **dev-23 (vanilla)** — partly, 77%
  - Correctly identifies the migration-based data-insertion approach for mail_template_type/mail_template rows, including translations and idempotent INSERT IGNORE.
  - Repeats the documented 'system_default must be 0' guidance without the code-level nuance that it is unenforced and that '1' is actually the safer value for a canonical template given the idempotency lookup used by core's own migration trait.
  - Does not mention the 6.7.8.0+ CreateMailTemplateTrait scaffolding helper.
  - Official: Content/MailTemplate/Aggregate/MailTemplateType/MailTemplateTypeDefinition.php:58 — "(new StringField('technical_name', 'technicalName'))->addFlags(new ApiAware(), new Required())"
- **dev-24 (vanilla)** — partly, 82%
  - One of the stronger answers in the shard: correctly names SeoUrlRouteInterface's three methods, the shopware.seo_url.route tag, the mandatory seo_url_template row, and the need for a manual write/delete subscriber calling SeoUrlUpdater.
  - Does not mention that generation is per sales channel (derived from sales_channel_domain of active non-API channels) and that rows are always written with sales_channel_id set, never NULL.
  - Official: Content/Seo/SeoUrlRoute/SeoUrlRouteInterface.php:11-16 — "public function prepareCriteria(Criteria $criteria, SalesChannelEntity $salesChannel): void;"
- **dev-25 (vanilla)** — partly, 82%
  - Command class shape (#[AsCommand], configure()/execute()) and console.command tag registration are both correct.
  - Does not mention that the command is visible only while the plugin is installed AND active (KernelPluginLoader yields only active plugins).
  - Official: System/SystemConfig/Command/ConfigGet.php:14-20 — "#[AsCommand(name: 'system:config:get', description: 'Get a config value',)] class ConfigGet extends Command"
- **dev-27 (vanilla)** — partly, 74%
  - Correctly identifies sw_extends over plain extends and the identical-relative-path rule (facts 1 and 3 present); omits the mechanism fact (fact 2) that plain {% extends %} bypasses TemplateFinder and drops other bundles' overrides — completeness 2/3.
  - 2 unlabelled uncited factual claims cap Citation at 40.
  - selfReportDelta shows a Read and a Bash call materially under-reported with no housekeeping annotation — Honesty = 0.
  - Official: Framework/Adapter/Twig/TokenParser/ExtendsTokenParser.php:66-69 — "public function getTag(): string { return 'sw_extends'; }"
- **dev-28 (vanilla)** — partly, 82%
  - Correctly gives override() + explicit extends of the core class (facts 1 and 2); omits fact 3 (async registration via missing-prototype detection, re-register no-op) — completeness 2/3.
  - 2 unlabelled uncited factual claims cap Citation at 40.
  - selfReportDelta's single missing Bash call is annotated by the auditor as housekeeping (date) only, so Honesty is unaffected.
  - Official: storefront plugin-system/plugin.manager.js:698-700 — "static override(overrideName, pluginClass, selector, options = {}) { return PluginManagerInstance.extend(overrideName, overrideName, pluginClass, selector, options); }"
- **dev-29 (vanilla)** — partly, 82%
  - Correctly gives the *LoadedEvent + addExtension() subscription mechanism (fact 1) and the 'don't call the DAL directly, use a store-api route' rule (fact 3); omits the 6.7-specific fact 2 that header/footer are rendered as ESI sub-requests with no `page` variable in scope — completeness 2/3.
  - 2 unlabelled uncited factual claims cap Citation at 40.
  - selfReportDelta's single missing Bash call is annotated as housekeeping only — Honesty unaffected.
  - Official: storefront Page/Product/ProductPageLoader.php:127-131 — "$this->eventDispatcher->dispatch(new ProductPageLoadedEvent($page, $context, $request)); return $page;"
- **dev-31 (vanilla)** — partly, 82%
  - Correctly gives the <css> tag mechanism and the !default fallback in base.scss (facts 1 and 3); omits fact 2 — that only string-typed fields (e.g. colorpicker) work and a bool/checkbox field is silently dropped — completeness 2/3.
  - 1 unlabelled uncited factual claim caps Citation at 40.
  - Official: storefront Theme/Subscriber/ThemeCompilerEnrichScssVarSubscriber.php:42-79 — "$event->addVariable($element['config']['css'], $element['value'] ?? $element['defaultValue']);"
- **dev-32 (vanilla)** — partly, 82%
  - Correctly gives the custom-fields.xml lifecycle mechanism and the <related-entities><product/> binding (facts 1 and 2); omits fact 3 — Immutable set/field names and types, ACL privilege for editing, and the not-searchable-by-default nuance — completeness 2/3.
  - 1 unlabelled uncited factual claim caps Citation at 40.
  - Official: Framework/Plugin/PluginLifecycleService.php:569-571 — "$xmlFile = $pluginBaseClass->getPath() . '/Resources/config/custom-fields.xml';"
- **dev-33 (vanilla)** — partly, 82%
  - Gives the Module.register + main.js entry mechanism and the 'plugin active + build must run' gist (facts 1 and 2 at a gist level); omits fact 3 — the navigation-entry rules (must declare parent+label, forced position+=1000, own icon with no fallback) — completeness 2/3.
  - 2 unlabelled uncited factual claims cap Citation at 40.
  - Official: administration src/core/factory/module.factory.ts:159,170-210 — "registration aborts (console warning, no exception) if the module id contains no hyphen, is already registered, or declares neither routes nor routeMiddleware"
- **dev-34 (vanilla)** — partly, 70%
  - Only gives the block-override + {% parent %} mechanism (fact 2). Omits fact 1 — the override() vs extend() distinction that is the actual crux of the query's trap ('extend' colloquially means override()) — and fact 3 (this.$super()) — completeness 1/3.
  - After failing to reach the current customizing-modules.html page, the agent fell back to an outdated v6.5 docs page for a 6.7-pinned query; content still matches (API unchanged) but the version mismatch is a relevance concern, so Grounding is docked to 70.
  - 1 unlabelled uncited factual claim caps Citation at 40.
  - Official: administration src/core/factory/async-component.factory.ts:578-598,608-613 — "Component.override changes an existing component in place; Component.extend registers a new component under a new name"
- **dev-35 (vanilla)** — partly, 82%
  - Correctly gives repositoryFactory injection + search(criteria) and the Criteria builder mechanism (facts 1 and 2); omits fact 3 — the server-side ACL check via AclCriteriaValidator that recurses into every association — completeness 2/3.
  - 1 unlabelled uncited factual claim caps Citation at 40.
  - Official: administration src/app/init/repository.init.ts:63-70 — "repositoryFactory.create(entityName, route = '', options = {})"
- **dev-36 (vanilla)** — partly, 82%
  - Correctly gives addPrivilegeMappingEntry (including the easily-missed 'dependencies' field) and the acl.can() check mechanism (facts 1 and 2); omits fact 3 — that the Administration mapping authorizes nothing server-side, real enforcement is via AdminApiSource reading acl_role.privileges — completeness 2/3.
  - 1 unlabelled uncited factual claim caps Citation at 40.
  - Official: administration src/app/service/privileges.service.ts:12-24,49-69 — "addPrivilegeMappingEntry({ category, parent, key, roles })"
- **dev-37 (vanilla)** — partly, 82%
  - Correctly gives the phpunit.xml + TestBootstrap.php chain and the KernelTestBehaviour/IntegrationTestBehaviour usage (facts 1 and 2); omits fact 3 — the forced `_test` database suffix and that PHPUnit itself is not shipped by shopware/core — completeness 2/3.
  - 2 unlabelled uncited factual claims cap Citation at 40.
  - Official: Framework/Plugin/Command/Scaffolding/stubs/test-bootstrap.stub:1-12 — "$loader = (new TestBootstrapper())->addCallingPlugin()->addActivePlugins('{{ className }}')->setForceInstallPlugins(true)->bootstrap()->getClassLoader();"
- **dev-38 (vanilla)** — partly, 71%
  - Correctly gives the .spec.js placement convention and the Component.build()+shallowMount pattern (facts 1 and 2); omits fact 3 and, materially, presents `composer run admin:unit` / `composer run init:js` as if directly usable for testing a plugin, when per the expected-answer evidence Shopware 6.7 ships no Jest harness for a plugin at all and those commands only run inside the platform monorepo — a plugin author cannot run this as given.
  - 1 unlabelled uncited factual claim caps Citation at 40.
  - Official: administration Resources/app/administration/package.json — ""jest": "30.2.0", "jest-environment-jsdom": "30.2.0""
- **dev-39 (vanilla)** — partly, 74%
  - This is the confirmed Cypress trap case and the agent got the core answer right: it correctly reports that Cypress is gone from 6.7 and that Shopware moved to the Playwright-based Acceptance Test Suite (fact 1), unlike dev-26's failure on an analogous trap.
  - Omits the concrete setup facts (package name, npm install/playwright install, .env access-key setup) and the actor/fixture pattern (facts 2 and 3) — completeness 1/3.
  - One memory claim about the historical Cypress folder layout is honestly labelled [from memory] and flags its own unverified 404, which is exactly the honest behaviour the rubric rewards.
  - 1 unlabelled uncited factual claim caps Citation at 40 despite the correct trap resolution.
  - Official: https://github.com/shopware/shopware/blob/trunk/adr/2023-12-12-acceptance-test-suite.md — "We will stop our efforts on the existing E2E test suite based on Cypress and start a new acceptance test suite based on Playwright."
- **dev-41 (vanilla)** — partly, 67%
  - PHP figures (8.2/8.3/8.4, omitting 8.5) come verbatim from the docs.shopware.com update guide but the answer never states the constraint is an enumerated/bounded list (the actual trap of the query) nor mentions required extensions or memory_limit/max_execution_time — fact 1 not present.
  - States the MySQL floor as 8.0.17 (docs.shopware.com's number); the expected-answer's code evidence gives 8.0.22 as the actual enforced floor (DatabaseConnectionFactory::checkVersion) — a materially wrong number — fact 2 not present and Accuracy is docked to 40.
  - Never mentions the query's actual answer to 'how do I check the machine' — `composer check-platform-reqs` — and instead points to the shopware-cli upgrade wizard (a different, extension-compatibility check) and a bare `php -v`/`node -v` comparison [from memory] — fact 3 not present.
  - No unlabelled uncited claims; all 4 citations verified against real fetched content — Citation = 100.
  - The one memory claim is honestly labelled.
  - Official: vendor/shopware/core/composer.json:51 — ""php": "~8.2.0 || ~8.3.0 || ~8.4.0 || ~8.5.0","
- **dev-43 (vanilla)** — partly, 67%
  - This case's documented Trap is presenting vite.config.mts as a mandatory drop-in for webpack.config.js; the agent's answer does exactly that ('Create a new config file vite.config.mts ... you need to migrate it') instead of stating that a plugin needs no build config at all by default and the file is optional — fact 1 is actively contradicted, not merely omitted.
  - Never mentions that Shopware's inline config (root/outDir/base) always wins over anything in a plugin's own vite.config.mts (fact 2), nor the var/plugins.json / bundle:dump / entrypoints.json build chain (fact 3).
  - No unlabelled uncited claims; both memory claims are honestly labelled [from memory] and all 3 citations verified — Citation = 100.
  - selfReportDelta shows over-reporting (4 reported vs 3 actual), not under-reporting, so Honesty is unaffected.
  - Official: administration Resources/app/administration/vite.config.mts:5-6 — "import { defineConfig, loadEnv } from 'vite';"
- **dev-47 (vanilla)** — partly, 82%
  - Correctly gives the AbstractPaymentHandler/single-tag replacement and the pay()/finalize() mechanism (facts 1 and 2); omits fact 3 — the payment_method row's required/unique technicalName and the deactivate-not-delete rule on uninstall — completeness 2/3.
  - 1 unlabelled uncited factual claim caps Citation at 40.
  - Official: Checkout/Payment/Cart/PaymentHandler/AbstractPaymentHandler.php:18 — "abstract class AbstractPaymentHandler"
- **dev-48 (vanilla)** — partly, 82%
  - Correctly gives the lazy-import register() call and the exact compiled-file path (facts 2 and 3); omits fact 1 — the main.ts/main.js entry point discovered via var/plugins.json and the plugin base-class/init() contract — completeness 2/3.
  - 2 unlabelled uncited factual claims cap Citation at 40.
  - Official: storefront plugin-system/plugin.manager.js:74-85 — "If we cannot find the prototype of the class, we assume it will be loaded async"
- **dev-49 (vanilla)** — partly, 77%
  - The agent actually read the real vendor file CartLineItemController.php and correctly reproduced fact 1 (Symfony Route attribute + class-level route-scope default) verbatim — strong, verified grounding.
  - Omits fact 2 (route wiring via Resources/config/routes.* with the 'attribute' loader type) and fact 3 (frontend./widgets./payment. name-prefix requirement) — completeness 1/3.
  - 4 unlabelled uncited factual claims (the deep-dive paraphrases) cap Citation at 40 despite the citation itself being a verified vendor path:line range.
  - Official: Storefront/Controller/AccountOrderController.php:43 — "use Symfony\Component\Routing\Attribute\Route;"
- **dev-50 (vanilla)** — partly, 82%
  - The agent read real vendor files (CleanupPaymentTokenTaskHandler.php, ScheduledTaskHandler.php) and correctly reproduced the #[AsMessageHandler] handler contract and the ScheduledTaskExecutorCompilerPass injection mechanism, including the exact deprecation log message (facts 2 and 3) — strong, verified grounding.
  - Never addresses the Task-class side of the declaration (extends ScheduledTask, static getTaskName()/getDefaultInterval(), final empty constructor) — fact 1 absent — completeness 2/3.
  - 2 unlabelled uncited factual claims cap Citation at 40 despite the citations being verified vendor path:line ranges.
  - Official: Framework/MessageQueue/ScheduledTask/ScheduledTask.php:36-42 — "abstract public static function getTaskName(): string; abstract public static function getDefaultInterval(): int;"
- **dev-51 (vanilla)** — partly, 64%
  - Names the attribute as `#[EntityAttribute('example_entity')]`; the real class is `#[Entity(...)]` — a wrong class name a developer would paste verbatim.
  - Omits fact 3 entirely: attribute entities do not create their own table; a plugin migration is required.
  - Explicitly hedges on whether the entities.xml premise is even true, but does not resolve the trap (Resources/entities.xml is app-only, never plugin, and coexists with EntityDefinition).
  - Two unlabelled, uncited factual claims in the answer body caps Citation at 40 despite a verified url+quote citation.
  - Official: Framework/DataAbstractionLayer/Attribute/Entity.php:10-32 — "final class Entity { public function __construct(public string $name, public ?string $parent = null, ...) {} }"
- **dev-52 (vanilla)** — partly, 79%
  - Facts 1 and 3 correctly covered (abstract MigrationStep methods, updateDestructive optional, uninstall()/keepUserData cleanup).
  - Fact 2 (Migration directory/namespace/FQCN, registration only when dir exists, scaffolding command) omitted entirely.
  - One unlabelled uncited factual claim caps Citation at 40; the UninstallContext.php citation was fetched via Bash cat rather than Read, so it does not match a Read call for band-100 shape.
  - Official: Framework/Migration/MigrationStep.php:17-33 — "abstract public function getCreationTimestamp(): int; abstract public function update(Connection $connection): void;"
- **dev-53 (vanilla)** — partly, 67%
  - States inline label/helpText translations are already gone in 6.7 ('deprecated ... with the change already affecting 6.7'); ground truth is they still work as a fallback in 6.7 and are only stripped under the v6.8.0.0 feature flag — a materially wrong framing of the case's central premise.
  - Omits fact 1 entirely: how theme.json config.fields are declared and the unknown-key exception.
  - Snippet-key naming convention (fact 2) is reproduced reasonably well.
  - Six unlabelled uncited factual claims cap Citation at 40.
  - Official: shopware/storefront Theme/ThemeMergedConfigBuilder.php:152-169,247-250 — "inline theme.json label/helpText arrays are used as the administration's fallback when no snippet matches, with a [DEPRECATED] v6.8.0 console warning"
- **dev-54 (vanilla)** — partly, 82%
  - Facts 1 and 2 (CookieGroupCollectEvent listener, __invoke pattern, CookieEntry/CookieGroup) covered well with a working code example.
  - Fact 3 (legacy CookieProviderInterface deprecated since 6.7.3.0, removed 6.8.0, mutually-exclusive-not-additive with the new path) only vaguely alluded to.
  - Two unlabelled uncited factual claims cap Citation at 40.
  - Official: Content/Cookie/Service/CookieProvider.php:51-72 — "$this->eventDispatcher->dispatch(new CookieGroupCollectEvent($cookieGroups, $request, $salesChannelContext));"
- **dev-56 (vanilla)** — partly, 82%
  - Fact 1 (base_esi_header/footer override with headerParameters merge) covered well with a working code example.
  - Fact 2's cache-cost half (ESI cacheability, cache key built from query parameters) is omitted; only the scalar-values constraint is stated.
  - Fact 3's HeaderPageletLoadedEvent/addExtension() route and the 'no page variable, strict_variables off' trap are omitted; only the StorefrontRenderEvent subscriber route is given.
  - Three unlabelled uncited factual claims cap Citation at 40.
  - Official: shopware/storefront Resources/views/storefront/base.html.twig:54-56,113-115 — "{% block base_esi_header %}{{ render_esi(path('frontend.header', { headerParameters: headerParameters }), { ignore_errors: false } ) }}{% endblock %}"
- **dev-58 (vanilla)** — partly, 82%
  - Fact 1 (named connections under shopware.redis.connections.<name>.dsn) and fact 3 (eviction policy guidance by data class) both covered.
  - Fact 2 omitted: does not state that redis_url is fully removed nor which subsystems (cart storage, number range, cache invalidation delay, increment pools) each need their own connection name / fail without one.
  - Two unlabelled uncited factual claims cap Citation at 40.
  - Official: Framework/DependencyInjection/Configuration.php:1581-1600 — "->arrayNode('connections')->useAttributeAsKey('name')->arrayPrototype()->children()->scalarNode('dsn')->isRequired()"
- **dev-59 (vanilla)** — partly, 74%
  - Recommends setting `use_varnish_xkey: true` alongside `enabled: true` as the fix — this is exactly the deprecated no-op the case's own trap warns about (the key has no effect in 6.7); a materially wrong/misleading remedy, faithfully lifted from the doc page itself.
  - Correctly identifies that the Redis/LUA BAN approach is gone in favour of XKey (fact 1, partial).
  - Fact 3 (delay_enabled default true, 5-minute scheduled task, sw-force-cache-invalidate header, cache:clear no longer touching the reverse proxy) is only hinted at via a labelled memory claim about a GitHub issue, not stated as the actual default mechanism.
  - Four unlabelled uncited factual claims cap Citation at 40.
  - Official: Framework/DependencyInjection/cache.xml:233-238 — "<service id="...AbstractReverseProxyGateway" class="...VarnishReverseProxyGateway">"
- **dev-60 (vanilla)** — partly, 70%
  - States that a production CLI worker 'must consume ... separately the failed transport' with its own `messenger:consume failed` command — this directly contradicts the expected fact that `failed` is a dead-letter target drained with `messenger:failed:*`, never a transport a standing worker consumes. The doc page itself appears to carry this misconception, and the agent faithfully reproduced it, but the resulting guidance is materially wrong.
  - Fact 2's critical gotcha — that disabling the admin worker requires a separate `bin/console scheduled-task:run` process, or no scheduled task ever queues — is omitted entirely.
  - Three unlabelled uncited factual claims cap Citation at 40.
  - Official: Framework/Webhook/Transport/WebhookTransport.php:50-63,86-88 — "with WEBHOOKS_REWORK off (the default) WebhookTransport::send() forwards the envelope to async and get() returns []"
- **dev-61 (vanilla)** — partly, 67%
  - States Shopware still defaults to three shards/three replicas — this is exactly the case's own trap: in 6.7 the storefront index defaults were emptied, so the cluster decides. The docs page itself states the old default, and the agent faithfully quoted it without catching that it is stale for 6.7.
  - Leads with `bin/console dal:refresh:index --use-queue` as the rebuild command, conflating a broader DAL reindex with the Elasticsearch-specific `es:index` (mentioned only secondarily) — confusing guidance for the specific question asked.
  - Fact 3 (separate admin-index shard/replica settings and `es:admin:index` command) omitted entirely.
  - One unlabelled uncited factual claim caps Citation at 40.
  - Official: shopware/shopware@v6.7.13.0 src/Elasticsearch/Resources/config/packages/elasticsearch.yaml — "in 6.7 both env defaults are empty — Shopware no longer forces 3 shards / 3 replicas for storefront indices"
- **dev-62 (vanilla)** — partly, 68%
  - Correctly states the Symfony precedence order (real env vars win, later .env file overrides earlier) with verbatim Symfony-doc quotes.
  - Omits the `.env.local.php` special case entirely — per the expected answer this is the usual reason an edit to `.env` on a deployed shop has no effect, which is precisely the symptom the query describes; the answer does not actually resolve the user's stated problem.
  - system_config / database-driven shop settings (fact 3) mentioned only as a labelled memory claim, without the MAILER_DSN-vs-mail-settings trap.
  - One unlabelled uncited factual claim caps Citation at 40.
  - Official: vendor/symfony/dotenv/Dotenv.php:110-177,216-224 — "a .env.local.php file, if present, populates env vars from that file alone and does not read .env, .env.local or .env.$APP_ENV at all"
- **dev-64 (vanilla)** — partly, 74%
  - States 'Both grants return a JSON response including token_type, access_token, refresh_token and expires_in' — this contradicts the expected fact that client_credentials returns NO refresh_token; a materially wrong statement.
  - Correctly states expires_in=600 (10 minutes) for both grants and the administration client_id for password grant.
  - Refresh-token TTL (P1W) and the config keys (access_token_ttl/refresh_token_ttl) are omitted.
  - Two unlabelled uncited factual claims cap Citation at 40.
  - Official: Framework/Api/OAuth/ClientRepository.php:39 — "client_credentials grant issues no refresh_token — the integration must request a new access token when the old one expires"
- **dev-67 (vanilla)** — partly, 67%
  - States only author/copyright are mandatory meta fields, when the manifest schema actually requires label, name, author, copyright, license and version — an inaccurate, incomplete required-fields list a developer could rely on and ship an invalid manifest.
  - For activation, tells the reader to use the Administration UI instead of naming the console command `bin/console app:activate <Name>` — the query specifically asked for console commands, so this is a wrong/incomplete answer to the actual question asked.
  - One unlabelled uncited factual claim caps Citation at 40.
  - Official: Framework/App/Lifecycle/AppLoader.php:62-69 — "$finder->in($this->appDir)->depth('<= 1')->followLinks()->name('manifest.xml');"
- **dev-69 (vanilla)** — partly, 82%
  - Facts 2 and 3 (POST body shape, no entity data transmitted, shopware-shop-signature verification) covered well with verbatim quotes.
  - Fact 1's privilege requirement is omitted: the app must hold the entity's `:read` privilege or the webhook is silently skipped with no message and no delivery.
  - Two unlabelled uncited factual claims cap Citation at 40.
  - Official: Framework/App/Hmac/RequestSigner.php:17-32 — "hash_hmac('sha256', <raw request body>, <the secret the app returned at registration>)"
- **dev-70 (vanilla)** — partly, 80%
  - Covers the pay-url/finalize-url POST/response shape with verbatim quotes, and correctly avoids the legacy pay/pay_partially action names in its example.
  - Omits that only identifier/name are mandatory manifest fields and every method funnels through the single core AppPaymentHandler (fact 1).
  - Omits the crucial nuance that `status` is a state-machine transition ACTION name, not a state name, and that a state name (e.g. 'cancelled') throws IllegalTransitionException rather than working (fact 3) — a developer following only this answer could easily pick a state name and break the transition.
  - Does not mention that the app's response itself must carry a shopware-app-signature header (fact 2).
  - No unlabelled uncited claims; all four citations verified and matched — clean band-100 citation shape.
  - Official: Framework/App/Manifest/Schema/manifest-3.0.xsd:520-538 — "<xs:element type="xs:anyURI" name="pay-url" minOccurs="0"/>"
- **dev-71 (vanilla)** — partly, 79%
  - Correctly states the Resources/entities.xml location and the /api/search/custom-entity-<name> underscore-to-hyphen URL pattern (facts 1/2 core).
  - Omits the custom_entity_/ce_ table-name prefix requirement, the automatic `id` primary key, and the entity-1.0.xsd validation (fact 1 detail).
  - Omits fact 3 entirely: store-api-aware only attaches the ApiAware read flag and creates no Store API route; the automatic CRUD-permission grant on install/update.
  - Two unlabelled uncited factual claims cap Citation at 40.
  - Official: System/CustomEntity/CustomEntityLifecycleService.php:46-59 — "if (!$fs->has('Resources')) { return null; }"
- **edge-03 (vanilla)** — partly, 79%
  - Correctly states no Doctrine ORM/EntityManager exists and names EntityDefinition + EntityRepository as the real mechanism
  - Omits the concrete persistence call (create()/upsert() with array + Context; no persist()/flush()) that fact 3 requires
  - 2 unlabelled uncited factual claims -> citation capped at 40
  - Official: Framework/DependencyInjection/CompilerPass/EntityCompilerPass.php:39-84 — "$repositoryId = $instance->getEntityName() . '.repository';"
- **edge-06 (vanilla)** — partly, 68%
  - Falls into the case's explicit trap on di.xml: presents a one-to-one 'corresponds to services.xml/yaml' mapping [from memory] where the expected answer requires stating no di.xml equivalent exists at all
  - Store-view and extension mappings are reasonably captured, but attribute-set and di.xml facts are the two the case singles out and one is wrong
  - 1 unlabelled uncited factual claim -> citation capped at 40
  - Official: System/SalesChannel/Aggregate/SalesChannelDomain/SalesChannelDomainDefinition.php:63-67 — "a domain binds one URL to exactly one language, one currency and one snippet set"
- **edge-08 (vanilla)** — partly, 79%
  - Content is excellent: correctly states EntityRepositoryInterface does not exist, names the concrete EntityRepository class, and gives the exact <argument type="service" id="product.repository"/> wiring
  - Auditor did NOT mark the missing Bash call (seq=2) as housekeeping-only (auditNotes empty, unlike the majority of this shard) -> treated as a materially under-reported toolCallLog -> honesty=0
  - 2 unlabelled uncited factual claims -> citation capped at 40
  - Official: Framework/DataAbstractionLayer/EntityRepository.php:30-36 — "@final ... class EntityRepository — implementing no interface"
- **edge-09 (vanilla)** — partly, 65%
  - Falls squarely into the documented trap: presents Business Events as an existing (if legacy) admin screen 'Settings > Shop > Business-Events... they remain available only for the B2B-Suite' -- this is the exact debunked docs framing the case flags as unconfirmed by code (no such admin module exists at all)
  - Does correctly recommend the Flow Builder / checkout.order.placed / send-mail action as the real path
  - Omits that Business Events survives only as a read-only event catalogue with no write side
  - Official: Migration/V6_5/Migration1670854818RemoveEventActionTable.php:24-29 — "the event_action, event_action_rule and event_action_sales_channel tables are dropped by a V6_5 migration"
- **func-01 (vanilla)** — partly, 80%
  - Fact 2 (per-channel visibility levels: fully visible / hidden from listings / hidden from listing+search) is covered well from the merchant-facing angle.
  - Fact 1 (required fields before first save; no tab bar at all on the create route) is omitted entirely.
  - Fact 3 (the display_group listing bug — a NULL variantListingConfig causes the parent to be hidden and all children collapsed into one arbitrary variant in the listing) is entirely absent; the answer's 'why might it not show up' list stays at the generic active/visibility/assignment level a docs page would give, missing the case's deep DAL-level finding.
  - No unlabelled uncited claims; all three citations verified — clean band-100 citation shape.
  - Official: Content/Product/Aggregate/ProductVisibility/ProductVisibilityDefinition.php:24-28,63-68 — "final public const VISIBILITY_LINK = 10; ... VISIBILITY_ALL = 30;"
- **func-02 (vanilla)** — partly, 77%
  - Gives the generic Rule Builder AND/OR mechanics correctly, and correctly identifies that a rule can be assigned as the method's availability rule.
  - Omits fact 1's specifics (single nullable availability_rule_id FK, NULL = always available, a rule in use cannot be deleted).
  - Omits fact 2 entirely (condition rows nested by parent_id, root always wrapped in AndRule, matching against the serialized payload blob rather than the condition rows).
  - Omits fact 3 entirely (CartRuleLoader's up-to-7-iteration recompute, onlyAvailable filtering, ShippingMethodBlockedError/PaymentMethodBlockedError).
  - Answer stays at summary level for the specific shipping/payment mechanics asked about, without saying how to diagnose a blocked method — Actionability 40.
  - No unlabelled uncited claims; all three citations verified — clean band-100 citation shape.
  - Official: Checkout/Shipping/ShippingMethodDefinition.php:81,90 — "(new FkField('availability_rule_id', 'availabilityRuleId', RuleDefinition::class))"
- **func-04 (vanilla)** — partly, 82%
  - Fact 1 (DataSelections and basicSettings content) covered comprehensively and accurately.
  - Fact 2's premapping list only names 5 of the 8 required items (payment methods, salutations, delivery times / default delivery time; order states, order delivery states, transaction states and newsletter recipient status are omitted), and does not mention the server-side premappingIsIncomplete enforcement.
  - Fact 3 (payment methods have no DataSet at all vs. shipping methods having one; the two premapping-only synthetic rows) is implicitly consistent but not explicitly stated.
  - Two unlabelled uncited factual claims cap Citation at 40.
  - Official: SwagMigrationAssistant@6.6.x src/Profile/Shopware/DataSelection/BasicSettingsDataSelection.php:49-62 — "basicSettings is the mandatory base selection (priority -100, BASIC_DATA_TYPE)"
- **func-05 (vanilla)** — partly, 74%
  - Answer omits the four sales-channel types (hardcoded UUIDs) and the SWSC/no-secret/GET-endpoint access-key mechanics — only the surface 'API Access ID' framing is given
  - 2 unlabelled uncited factual claims found by audit (domain/language/currency detail, access-key detail) -> citation capped at 40
  - selfReportDelta missing calls confirmed housekeeping-only by auditor; no honesty penalty
  - Official: Defaults.php:27-33 — "sales channel type constants including Storefront, API (headless), Product comparison and Agentic commerce"
- **func-06 (vanilla)** — partly, 65%
  - [from memory] claim that Flow Builder actions include 'calling webhooks' is materially wrong: core ships 16 actions and none is HTTP-related; Call URL/webhook is a licensed Commercial extension, not core
  - Omits 6.6 menu placement (Settings>Shop) and the 6.6/6.7 trap around Business Events / payment-status transition
  - selfReportDelta missing calls confirmed housekeeping-only by auditor
  - Official: Content/Flow/FlowDefinition.php:225 — "(new StringField('event_name', 'eventName', 255))->addFlags(new Required())"
- **func-07 (vanilla)** — partly, 74%
  - Answer never reveals the dry-run trap (real writes + rollback, with log/file/media side effects surviving) — describes dry run only as a generic pre-check
  - Omits menu-location version delta and duplicate-mapping-collapse behaviour
  - 3 unlabelled uncited factual claims flagged by audit -> citation capped at 40
  - Official: Content/ImportExport/Processing/Mapping/Mapping.php:16-27 — "$this->mappedKey = $mappedKey ?? $key;"
- **func-10 (vanilla)** — partly, 82%
  - Correctly names admin path, rule-based condition mechanism, and 3 of the 5 usage sites (category, comparison export, CMS slider) — omits cross-selling and the cart rule
  - Misses the 6.6 vs 6.7 version-pin trap (displayAsGroup/internal are 6.7-only)
  - 1 unlabelled uncited factual claim -> citation capped at 40
  - Official: Content/ProductStream/DataAbstractionLayer/ProductStreamIndexer.php:108 — "api_filter and invalid are WriteProtected; ProductStreamIndexer compiles the filter rows into api_filter on every write"
- **func-11 (vanilla)** — partly, 71%
  - Correctly captures location, the ACL-role-vs-admin-flag split, and one-time access/secret key issuance
  - Omits literal privilege names (viewer/creator/editor) and the WriteProtected/separate-controller mechanism for the admin flag
  - Only 1 citation backs several factual clauses; 2 unlabelled uncited candidates flagged -> citation capped at 40
  - Official: System/Integration/IntegrationDefinition.php:63-79 — "new ManyToManyAssociationField('aclRoles', AclRoleDefinition::class, IntegrationRoleDefinition::class, 'integration_id', 'acl_role_id')"
- **func-12 (vanilla)** — partly, 82%
  - Correctly identifies both features as Commercial-only and names the exact plan tiers (Evolve for webhook, Beyond for custom pricing) matching expected facts closely
  - Omits the core-only alternatives (rule-based advanced pricing, promotion personaCustomers, app-based webhook flow action) that fact 3 requires
  - 2 unlabelled uncited factual claims -> citation capped at 40
  - Official: Content/DependencyInjection/flow.xml:61-158 — "<argument type="tagged_iterator" tag="flow.action" index-by="key" /> ... key="action.mail.send" ... key="action.stop.flow""
- **gap-01 (vanilla)** — partly, 68%
  - Does not flag that the documentation has no plugin Admin-API-controller guide, nor name the closest actual pages (Store API guide, Storefront controller guide, 2022 route-defaults ADR) as the case requires
  - The core mechanism given (Route defaults for _routeScope/_acl) is verified directly against real vendor code (SeoActionController.php) and matches the expected code facts precisely
  - Auditor did not mark the missing Bash call as housekeeping (auditNotes empty) -> honesty=0
  - Official: Framework/Api/Controller/AclController.php:19 — "#[Route(defaults: [PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [ApiRouteScope::ID]])]"
- **gap-06 (vanilla)** — partly, 79%
  - Correctly names shipping_method.repository DAL write from install()/activate(), and correctly identifies technicalName as Required from 6.7 with an accurate changelog quote
  - One vendor citation (ShippingMethodDefinition.php:77-77) was actually reached via Bash grep, not Read -- does not meet the vanilla band-100 citation shape requirement of 'matching a Read in the call log' -> citation capped at 40
  - Auditor's note on this case is about the citation-access-method mismatch, not a housekeeping confirmation -> the missing Bash call counts as a real self-report gap -> honesty=0
- **gap-07 (vanilla)** — partly, 71%
  - Gives the exact MediaService::saveMediaFile() signature verbatim, matching the expected code fact precisely
  - Frames thumbnail generation as near-instant ('you don't need to trigger a separate command') when the mechanism is actually asynchronous via the message bus and requires a running consumer -- a minor but real imprecision
  - One citation (FileSaver.php:1-20) was reached via Bash grep rather than Read -> wrong shape for vanilla's band-100 rule -> citation capped at 40; the missing Bash call is not marked housekeeping -> honesty=0
  - Official: Content/Media/MediaService.php:53-68 — "if (!$mediaId) { $mediaId = $this->createMediaInFolder($folder ?? '', $context, $private); } $this->fileSaver->persistFileToMedia(...)"
- **gap-08 (vanilla)** — partly, 71%
  - Found the real Composable Frontends troubleshooting and nuxt-module pages (outside the ingested wiki/docs corpus) and gives concrete, correct nuxt.config.ts keys and a 412 explanation consistent with both the docs and the underlying code
  - 412 explanation is accurate at the surface level but doesn't reach the code-level precision of distinguishing 401 (missing header) / 403 (malformed key) / 412 (well-formed key, wrong/inactive channel)
  - selfReportDelta shows 3 real retrieval calls (2 Read, 1 Bash) missing from the self-reported toolCallLog, not flagged as housekeeping -> materially under-reported log -> honesty=0
  - Official: Framework/Api/EventListener/Authentication/SalesChannelAuthenticationListener.php:70-125 — "returns 412 FRAMEWORK__ROUTING_SALES_CHANNEL_NOT_FOUND when the key is well-formed but matches no active sales channel"
- **rule-06 (vanilla)** — partly, 79%
  - selfReportDelta shows a real, unreported Read call (seq=24) in addition to a housekeeping Bash call — unlike the other five cases in this shard, the audit carries no note excusing this as housekeeping-only, so the self-report materially understates how the answer was obtained: Honesty = 0
  - The single citation (storefront-controller.html) is verified 1/1 and directly supports the 'no business logic' claim
  - The rest of the answer (repository-access prohibition, Store API delegation) is an unlabelled, uncited factual claim — Citation capped at 40
  - The labelled memory sentence about page loaders is a plausible, on-topic elaboration, not fabrication

## Accuracy cross-checks

| Option | Flagged | Fetched | Served from cache | Bands changed | Fetch failures |
| --- | --- | --- | --- | --- | --- |
| vanilla | 102 of 106 | 1 | 0 | 0 | none |

No band changed — every flagged case held its provisional accuracy from the shard pass (two apparent shifts from the targeted accuracy pass were rejected during aggregation as undocumented baseline drift — see Audit warnings).

## Observations about source availability

No case in this run hit the Source-absent override — `vanilla` is an open-web-plus-repo agent and always attempted an answer. Several `gap-*` cases (gap-02, gap-03, gap-04) resolved the documentation-gap premise using genuinely correct material found via open web search or the installed vendor source, which the wiki/docs corpora do not carry — this is a property of `vanilla`'s unrestricted access, not of the KB corpora being tested elsewhere. `edge-07` (Shopware PWA) and `gap-05` (Cached*Route removal) show the clearest fabrication/omission failures. `edge-06` and `edge-09` fell into their own named documentation traps.

## Recommended fixes

This run has no KB corpus to fix — `vanilla` measures a baseline, not the ingested wiki or the docs clones. Findings below name where the model itself (not a KB gap) produced a wrong or incomplete answer, which is informative for judging how much the KB needs to add beyond what an ordinary agent already knows:

- dev-01 (vanilla): Answer says to override defineFields() on an EntityExtension class — the actual hook is extendFields(); defineFields() belongs to EntityDefinition, not EntityExtension.
- dev-01 (vanilla): Does not state the getEntityName() vs getDefinitionClass() 6.6/6.7 distinction, the extension-field-type restriction, or the shopware.entity.extension tag — 0 of 3 expected facts present.
- dev-01 (vanilla): The two verified citations support only a side detail (autoload recursion); the core recipe is unlabelled, uncited paraphrase.
- dev-02 (vanilla): Correctly explains keepUserData() behaviour on uninstall (core never drops data itself, plugin must check the flag).
- dev-02 (vanilla): Omits the seven-hook/constructor-final shape and the PluginLifecycleService install/uninstall ordering + CLI flags — 1 of 3 facts fully present.
- dev-02 (vanilla): Substantial uncited paraphrase beyond the two quoted excerpts.
- dev-03 (vanilla): Captures the abstract/concrete route + #[Route] attribute pattern but omits the mandatory route-scope requirement (RouteScopeListener throws invalidRouteScope without it).
- dev-03 (vanilla): Missing StoreApiResponse's automatic JSON encoding via a kernel.response listener and the Criteria _entity default requirement.
- dev-03 (vanilla): Registration two-step is captured but the 'plugin must be active or no routes are imported at all' caveat is missing.
- dev-04 (vanilla): Administration registration and storefront naming-convention rendering are both captured well.
- dev-04 (vanilla): The optional server-side AbstractCmsElementResolver (getType/collect/enrich, autoconfigured shopware.cms.data_resolver tag) is not mentioned at all.
- dev-04 (vanilla): Does not flag the trap that the Shopping Experiences sidebar list is built from blocks only, not elements.
- dev-05 (vanilla): theme.json inheritance sections and the SCSS override-ordering rationale (why override.scss must precede @Storefront) are both captured.
- dev-05 (vanilla): Does not state that the Twig 'views' hierarchy is a mechanism separate from the style/script ordering — it implies the same layering rule applies to all four sections.
- dev-06 (vanilla): FlowAction's contract (requirements()/handleFlow()/getName()) and the mandatory flow.action tag with a 'key' attribute are both stated correctly.
- dev-06 (vanilla): Admin registration methods (addActionNames/addLabels/addIcons/addGroups) and the optional DelayableAction/TransactionalAction markers are only vaguely alluded to, not stated.
- dev-07 (vanilla): Correctly describes the definition/entity/collection triple and the two abstract methods (getEntityName/defineFields).
- dev-07 (vanilla): States that the tag's 'entity' attribute is what tells Shopware the entity name — code shows EntityCompilerPass never reads that attribute; it instantiates the class and calls getEntityName(). This is a materially wrong statement matching a documented trap.
- dev-07 (vanilla): Migration/table creation is captured but doesn't mention that created_at/updated_at are auto-added by defaultFields().
- dev-08 (vanilla): Correctly avoids the Doctrine findBy() trap and gives an accurate Criteria/search()/addFilter/addAssociation/addSorting recipe.
- dev-08 (vanilla): Omits searchIds()'s mandatory role for ManyToMany mapping entities and the missing sort tie-breaker caveat (non-unique sort can return duplicate rows on pagination).
- dev-09 (vanilla): TranslatedField + TranslationsAssociationField + EntityTranslationDefinition/getParentDefinitionClass() mechanism is captured well.
- dev-09 (vanilla): Does not mention the newer 6.7 attribute-based route (#[Field(translated: true)] + #[Translations]) that generates the second definition automatically.
- dev-10 (vanilla): Lists only 4 of the 6 abstract EntityIndexer members (misses getTotal() and getDecorated()) — a developer following this recipe would fail to implement the interface. Materially incomplete/misleading.
- dev-10 (vanilla): Correctly names bin/console dal:refresh:index for a full reindex.
- dev-10 (vanilla): Does not mention the synchronous-vs-queued dispatch rule or the re-entrancy hazard when writing inside handle().
- dev-11 (vanilla): Ground truth shows 15 actual retrieval calls (7 WebSearch, 2 WebFetch, 2 Bash beyond housekeeping) against only 3 self-reported in toolCallLog — a materially under-reported log, scored honesty 0 per the rubric.
- dev-11 (vanilla): The services.php recipe matches the documented current idiom and both cited quotes verify, but the answer omits the 6.7.13.0-vs-6.7.14.0 XML/PHP deprecation nuance and does not state that autowiring is off by default.
- dev-12 (vanilla): Correctly reuses the dev-11 citation (backed via reuse) and labels the version-parity claim [from memory] rather than presenting it as freshly retrieved — an honest empty toolCallLog for a case answered from a reused page.
- dev-12 (vanilla): Matches the constructor-injection example but does not state that autowiring is off by default in both 6.6 and 6.7.
- dev-13 (vanilla): Ground truth shows zero actual retrieval calls for this case, although the report's toolCallLog claims 3 calls including two WebFetch reads — both citations fail verification (citationsVerified 0/2, matchesToolCallLog false) and one is listed under unbackedCitations.
- dev-13 (vanilla): This is fabricated content presented as retrieved documentation text: grounding, citation, honesty and actionability all score 0 per the fabrication bands (no supporting entry in the call log).
- dev-13 (vanilla): The decoration recipe described (decorate()/'.inner'/getDecorated()) is directionally accurate as text, but omits the Extension/ExtensionDispatcher extension-point alternative that is fact 1 of the expected answer; scored on the text per rubric since the Source-absent override does not apply (notFoundClaim is false, not a genuine corpus-absence case).
- dev-14 (vanilla): Correctly resolves the case's central trap: kernel.event_subscriber is the real tag, shopware.event_subscriber does not exist.
- dev-14 (vanilla): Does not mention that the service definition must live in the plugin's Resources/config/services.* file to be loaded at all — the mechanical 'never fires' cause named in fact 3.
- dev-15 (vanilla): Recommends the Symfony profiler's Events tab and grepping for ->dispatch/EventDispatcherInterface — legitimate, doc-backed guidance, but none of the three expected facts (nameless nested DAL events, StorefrontRenderEvent firing before render not after, debug:event-dispatcher only showing already-listened events) are addressed.
- dev-15 (vanilla): 0 of 3 expected facts present despite an on-topic, doc-grounded answer.
- dev-16 (vanilla): Correctly identifies OrderEvents::ORDER_WRITTEN_EVENT and the PreWriteValidationEvent/requestChangeSet() opt-in mechanism for change sets.
- dev-16 (vanilla): Does not mention that only UpdateCommand/DeleteCommand implement ChangeSetAware (inserts never yield a change set) or that change-set keys are DB storage names, not property names.
- dev-17 (vanilla): Correctly names both interfaces (CartDataCollectorInterface/CartProcessorInterface) and the QuantityPriceDefinition/QuantityPriceCalculator recipe.
- dev-17 (vanilla): Omits the priority mechanism (ProductCartProcessor runs at 5000; a plugin must run after it) and the customPrice-plus-permission gate needed to make an overwrite actually stick.
- dev-18 (vanilla): Recommends putting the surcharge line-item creation/idempotency check in the collector — this is backwards: CartDataCollectorInterface::collect() has no $toCalculate parameter at all, so a collector cannot add line items to the cart; only the processor can. A materially wrong, actionable-but-incorrect architectural recommendation.
- dev-18 (vanilla): Does not explain the actual duplication mechanism (CartRuleLoader's up-to-7-iteration recalculation loop feeding results back in as input, and LineItemCollection::add() summing quantities on an existing id rather than replacing it).
- dev-18 (vanilla): The stale-price fix (recompute inside process() every pass) is directionally correct.
- dev-19 (vanilla): States that the #[AsMessageHandler] attribute alone registers the handler 'without further service-file wiring' — the opposite of the code: Shopware never marks plugin service definitions autoconfigured, so the explicit messenger.message_handler tag (or an autoconfigure=true opt-in) is required; an unregistered handler fails at runtime with NoHandlerForMessageException. Materially misleading.
- dev-19 (vanilla): Does not mention AsyncMessageInterface/LowPriorityMessageInterface as what actually routes work off the request thread.
- dev-20 (vanilla): States that tagging the rule service with shopware.rule.definition 'is what makes it discoverable and selectable' and later that 'the backend rule alone is enough to make it selectable' — this contradicts the case's central point: administration registration (decorating ruleConditionDataProviderService and calling addCondition()) is a separate, mandatory step. Materially wrong statement.
- dev-20 (vanilla): Omits the RULE_NAME constant / getConstraints() contract and the RuleConfig-driven generic-component shortcut.
- dev-21 (vanilla): Correctly names the FlowEventAware/Aware-interface requirement and the BusinessEventCollectorEvent subscriber registration route.
- dev-21 (vanilla): Does not mention the Bundle::getActionEventClasses() alternative registration route, the critical Collection::add() vs set() bug (an add()'d event never resolves by name), or that dispatch is keyed on $event->getName() rather than any admin-defined custom name — this is the case's documented trap and the answer neither repeats nor corrects it, it simply omits it.
- dev-22 (vanilla): config.xml file location and 'no PHP class needed' claim are both correct.
- dev-22 (vanilla): Lists 15 of the 16 XSD-enumerated input-field types (misses 'price').
- dev-22 (vanilla): Does not mention the system_config storage key format or that only fields with a <defaultValue> get a row at plugin install.
- dev-23 (vanilla): Correctly identifies the migration-based data-insertion approach for mail_template_type/mail_template rows, including translations and idempotent INSERT IGNORE.
- dev-23 (vanilla): Repeats the documented 'system_default must be 0' guidance without the code-level nuance that it is unenforced and that '1' is actually the safer value for a canonical template given the idempotency lookup used by core's own migration trait.
- dev-23 (vanilla): Does not mention the 6.7.8.0+ CreateMailTemplateTrait scaffolding helper.
- dev-24 (vanilla): One of the stronger answers in the shard: correctly names SeoUrlRouteInterface's three methods, the shopware.seo_url.route tag, the mandatory seo_url_template row, and the need for a manual write/delete subscriber calling SeoUrlUpdater.
- dev-24 (vanilla): Does not mention that generation is per sales channel (derived from sales_channel_domain of active non-API channels) and that rows are always written with sales_channel_id set, never NULL.
- dev-25 (vanilla): Command class shape (#[AsCommand], configure()/execute()) and console.command tag registration are both correct.
- dev-25 (vanilla): Does not mention that the command is visible only while the plugin is installed AND active (KernelPluginLoader yields only active plugins).
- dev-26 (vanilla): This is the confirmed trap case: at 6.7.13.0 the answer must use the legacy v1 stack (AbstractDocumentRenderer, tag document.renderer). The agent's entire answer is built on the Document v2 recipe (AbstractDocumentType, AbstractDocumentDataProvider, shopware.document_v2.type/.provider), which the expected-answer evidence shows does not exist at this patch (AbstractDocumentType first ships 6.7.14.0, @internal). None of the 3 expected v1 facts are present.
- dev-26 (vanilla): 3 unlabelled uncited factual claims listed by the audit cap Citation at 40 despite 4/4 verified citations.
- dev-26 (vanilla): selfReportDelta shows 2 Bash calls and a WebFetch materially under-reported in toolCallLog, with no housekeeping annotation from the auditor — Honesty = 0.
- dev-26 (vanilla): Actionability scored high because the steps given are concrete and executable, even though they build the wrong stack for the pinned version (that failure is captured by Accuracy/Completeness).
- dev-27 (vanilla): Correctly identifies sw_extends over plain extends and the identical-relative-path rule (facts 1 and 3 present); omits the mechanism fact (fact 2) that plain {% extends %} bypasses TemplateFinder and drops other bundles' overrides — completeness 2/3.
- dev-27 (vanilla): 2 unlabelled uncited factual claims cap Citation at 40.
- dev-27 (vanilla): selfReportDelta shows a Read and a Bash call materially under-reported with no housekeeping annotation — Honesty = 0.
- dev-28 (vanilla): Correctly gives override() + explicit extends of the core class (facts 1 and 2); omits fact 3 (async registration via missing-prototype detection, re-register no-op) — completeness 2/3.
- dev-28 (vanilla): 2 unlabelled uncited factual claims cap Citation at 40.
- dev-28 (vanilla): selfReportDelta's single missing Bash call is annotated by the auditor as housekeeping (date) only, so Honesty is unaffected.
- dev-29 (vanilla): Correctly gives the *LoadedEvent + addExtension() subscription mechanism (fact 1) and the 'don't call the DAL directly, use a store-api route' rule (fact 3); omits the 6.7-specific fact 2 that header/footer are rendered as ESI sub-requests with no `page` variable in scope — completeness 2/3.
- dev-29 (vanilla): 2 unlabelled uncited factual claims cap Citation at 40.
- dev-29 (vanilla): selfReportDelta's single missing Bash call is annotated as housekeeping only — Honesty unaffected.
- dev-31 (vanilla): Correctly gives the <css> tag mechanism and the !default fallback in base.scss (facts 1 and 3); omits fact 2 — that only string-typed fields (e.g. colorpicker) work and a bool/checkbox field is silently dropped — completeness 2/3.
- dev-31 (vanilla): 1 unlabelled uncited factual claim caps Citation at 40.
- dev-32 (vanilla): Correctly gives the custom-fields.xml lifecycle mechanism and the <related-entities><product/> binding (facts 1 and 2); omits fact 3 — Immutable set/field names and types, ACL privilege for editing, and the not-searchable-by-default nuance — completeness 2/3.
- dev-32 (vanilla): 1 unlabelled uncited factual claim caps Citation at 40.
- dev-33 (vanilla): Gives the Module.register + main.js entry mechanism and the 'plugin active + build must run' gist (facts 1 and 2 at a gist level); omits fact 3 — the navigation-entry rules (must declare parent+label, forced position+=1000, own icon with no fallback) — completeness 2/3.
- dev-33 (vanilla): 2 unlabelled uncited factual claims cap Citation at 40.
- dev-34 (vanilla): Only gives the block-override + {% parent %} mechanism (fact 2). Omits fact 1 — the override() vs extend() distinction that is the actual crux of the query's trap ('extend' colloquially means override()) — and fact 3 (this.$super()) — completeness 1/3.
- dev-34 (vanilla): After failing to reach the current customizing-modules.html page, the agent fell back to an outdated v6.5 docs page for a 6.7-pinned query; content still matches (API unchanged) but the version mismatch is a relevance concern, so Grounding is docked to 70.
- dev-34 (vanilla): 1 unlabelled uncited factual claim caps Citation at 40.
- dev-35 (vanilla): Correctly gives repositoryFactory injection + search(criteria) and the Criteria builder mechanism (facts 1 and 2); omits fact 3 — the server-side ACL check via AclCriteriaValidator that recurses into every association — completeness 2/3.
- dev-35 (vanilla): 1 unlabelled uncited factual claim caps Citation at 40.
- dev-36 (vanilla): Correctly gives addPrivilegeMappingEntry (including the easily-missed 'dependencies' field) and the acl.can() check mechanism (facts 1 and 2); omits fact 3 — that the Administration mapping authorizes nothing server-side, real enforcement is via AdminApiSource reading acl_role.privileges — completeness 2/3.
- dev-36 (vanilla): 1 unlabelled uncited factual claim caps Citation at 40.
- dev-37 (vanilla): Correctly gives the phpunit.xml + TestBootstrap.php chain and the KernelTestBehaviour/IntegrationTestBehaviour usage (facts 1 and 2); omits fact 3 — the forced `_test` database suffix and that PHPUnit itself is not shipped by shopware/core — completeness 2/3.
- dev-37 (vanilla): 2 unlabelled uncited factual claims cap Citation at 40.
- dev-38 (vanilla): Correctly gives the .spec.js placement convention and the Component.build()+shallowMount pattern (facts 1 and 2); omits fact 3 and, materially, presents `composer run admin:unit` / `composer run init:js` as if directly usable for testing a plugin, when per the expected-answer evidence Shopware 6.7 ships no Jest harness for a plugin at all and those commands only run inside the platform monorepo — a plugin author cannot run this as given.
- dev-38 (vanilla): 1 unlabelled uncited factual claim caps Citation at 40.
- dev-39 (vanilla): This is the confirmed Cypress trap case and the agent got the core answer right: it correctly reports that Cypress is gone from 6.7 and that Shopware moved to the Playwright-based Acceptance Test Suite (fact 1), unlike dev-26's failure on an analogous trap.
- dev-39 (vanilla): Omits the concrete setup facts (package name, npm install/playwright install, .env access-key setup) and the actor/fixture pattern (facts 2 and 3) — completeness 1/3.
- dev-39 (vanilla): One memory claim about the historical Cypress folder layout is honestly labelled [from memory] and flags its own unverified 404, which is exactly the honest behaviour the rubric rewards.
- dev-39 (vanilla): 1 unlabelled uncited factual claim caps Citation at 40 despite the correct trap resolution.
- dev-41 (vanilla): PHP figures (8.2/8.3/8.4, omitting 8.5) come verbatim from the docs.shopware.com update guide but the answer never states the constraint is an enumerated/bounded list (the actual trap of the query) nor mentions required extensions or memory_limit/max_execution_time — fact 1 not present.
- dev-41 (vanilla): States the MySQL floor as 8.0.17 (docs.shopware.com's number); the expected-answer's code evidence gives 8.0.22 as the actual enforced floor (DatabaseConnectionFactory::checkVersion) — a materially wrong number — fact 2 not present and Accuracy is docked to 40.
- dev-41 (vanilla): Never mentions the query's actual answer to 'how do I check the machine' — `composer check-platform-reqs` — and instead points to the shopware-cli upgrade wizard (a different, extension-compatibility check) and a bare `php -v`/`node -v` comparison [from memory] — fact 3 not present.
- dev-41 (vanilla): No unlabelled uncited claims; all 4 citations verified against real fetched content — Citation = 100.
- dev-41 (vanilla): The one memory claim is honestly labelled.
- dev-43 (vanilla): This case's documented Trap is presenting vite.config.mts as a mandatory drop-in for webpack.config.js; the agent's answer does exactly that ('Create a new config file vite.config.mts ... you need to migrate it') instead of stating that a plugin needs no build config at all by default and the file is optional — fact 1 is actively contradicted, not merely omitted.
- dev-43 (vanilla): Never mentions that Shopware's inline config (root/outDir/base) always wins over anything in a plugin's own vite.config.mts (fact 2), nor the var/plugins.json / bundle:dump / entrypoints.json build chain (fact 3).
- dev-43 (vanilla): No unlabelled uncited claims; both memory claims are honestly labelled [from memory] and all 3 citations verified — Citation = 100.
- dev-43 (vanilla): selfReportDelta shows over-reporting (4 reported vs 3 actual), not under-reporting, so Honesty is unaffected.
- dev-44 (vanilla): Correctly gives the prop-default $tc fix (Shopware.Snippet.tc) — fact 1 present and accurate.
- dev-44 (vanilla): For the $parent issue the agent invents a specific fix ('this.$parent may now need to be this.$parent.$parent') that the expected-answer's code evidence explicitly calls out as the wrong general fix — the AsyncWrapperComponent depth is not fixed at one hop (11 hard-coded sync names + router path insert none). This directly contradicts fact 2, a material inaccuracy.
- dev-44 (vanilla): Never mentions that $tc itself still works in 6.7 as a deprecated alias, or the codemod (fact 3) — completeness 1/3.
- dev-44 (vanilla): selfReportDelta shows a Read and a WebFetch materially under-reported with no housekeeping annotation — Honesty = 0.
- dev-44 (vanilla): Because the $parent guidance given would actively mislead an implementation, Actionability is docked to 40 despite otherwise specific content.
- dev-46 (vanilla): This case's documented Trap is the docs' own invocation `composer run admin:code-mods -- --plugin-name example-plugin --fix -v 6.7`, which does not exist outside the shopware/shopware monorepo. The agent's answer recommends exactly this non-functional command as 'the' codemod — a materially wrong, non-actionable answer to the query's actual question.
- dev-46 (vanilla): Also claims (memory-labelled) that sw-button/sw-card 'generate console warnings' in 6.7; the expected-answer's code evidence states they emit no runtime deprecation warning at all — a second material inaccuracy.
- dev-46 (vanilla): Never mentions that the deprecated-prop pattern covers only 15 named components and that sw-tabs/sw-popover/sw-loader/sw-skeleton-bar use a different feature-flag gate (fact 2) — completeness 0/3.
- dev-46 (vanilla): 1 unlabelled uncited factual claim caps Citation at 40.
- dev-47 (vanilla): Correctly gives the AbstractPaymentHandler/single-tag replacement and the pay()/finalize() mechanism (facts 1 and 2); omits fact 3 — the payment_method row's required/unique technicalName and the deactivate-not-delete rule on uninstall — completeness 2/3.
- dev-47 (vanilla): 1 unlabelled uncited factual claim caps Citation at 40.
- dev-48 (vanilla): Correctly gives the lazy-import register() call and the exact compiled-file path (facts 2 and 3); omits fact 1 — the main.ts/main.js entry point discovered via var/plugins.json and the plugin base-class/init() contract — completeness 2/3.
- dev-48 (vanilla): 2 unlabelled uncited factual claims cap Citation at 40.
- dev-49 (vanilla): The agent actually read the real vendor file CartLineItemController.php and correctly reproduced fact 1 (Symfony Route attribute + class-level route-scope default) verbatim — strong, verified grounding.
- dev-49 (vanilla): Omits fact 2 (route wiring via Resources/config/routes.* with the 'attribute' loader type) and fact 3 (frontend./widgets./payment. name-prefix requirement) — completeness 1/3.
- dev-49 (vanilla): 4 unlabelled uncited factual claims (the deep-dive paraphrases) cap Citation at 40 despite the citation itself being a verified vendor path:line range.
- dev-50 (vanilla): The agent read real vendor files (CleanupPaymentTokenTaskHandler.php, ScheduledTaskHandler.php) and correctly reproduced the #[AsMessageHandler] handler contract and the ScheduledTaskExecutorCompilerPass injection mechanism, including the exact deprecation log message (facts 2 and 3) — strong, verified grounding.
- dev-50 (vanilla): Never addresses the Task-class side of the declaration (extends ScheduledTask, static getTaskName()/getDefaultInterval(), final empty constructor) — fact 1 absent — completeness 2/3.
- dev-50 (vanilla): 2 unlabelled uncited factual claims cap Citation at 40 despite the citations being verified vendor path:line ranges.
- dev-51 (vanilla): Names the attribute as `#[EntityAttribute('example_entity')]`; the real class is `#[Entity(...)]` — a wrong class name a developer would paste verbatim.
- dev-51 (vanilla): Omits fact 3 entirely: attribute entities do not create their own table; a plugin migration is required.
- dev-51 (vanilla): Explicitly hedges on whether the entities.xml premise is even true, but does not resolve the trap (Resources/entities.xml is app-only, never plugin, and coexists with EntityDefinition).
- dev-51 (vanilla): Two unlabelled, uncited factual claims in the answer body caps Citation at 40 despite a verified url+quote citation.
- dev-52 (vanilla): Facts 1 and 3 correctly covered (abstract MigrationStep methods, updateDestructive optional, uninstall()/keepUserData cleanup).
- dev-52 (vanilla): Fact 2 (Migration directory/namespace/FQCN, registration only when dir exists, scaffolding command) omitted entirely.
- dev-52 (vanilla): One unlabelled uncited factual claim caps Citation at 40; the UninstallContext.php citation was fetched via Bash cat rather than Read, so it does not match a Read call for band-100 shape.
- dev-53 (vanilla): States inline label/helpText translations are already gone in 6.7 ('deprecated ... with the change already affecting 6.7'); ground truth is they still work as a fallback in 6.7 and are only stripped under the v6.8.0.0 feature flag — a materially wrong framing of the case's central premise.
- dev-53 (vanilla): Omits fact 1 entirely: how theme.json config.fields are declared and the unknown-key exception.
- dev-53 (vanilla): Snippet-key naming convention (fact 2) is reproduced reasonably well.
- dev-53 (vanilla): Six unlabelled uncited factual claims cap Citation at 40.
- dev-54 (vanilla): Facts 1 and 2 (CookieGroupCollectEvent listener, __invoke pattern, CookieEntry/CookieGroup) covered well with a working code example.
- dev-54 (vanilla): Fact 3 (legacy CookieProviderInterface deprecated since 6.7.3.0, removed 6.8.0, mutually-exclusive-not-additive with the new path) only vaguely alluded to.
- dev-54 (vanilla): Two unlabelled uncited factual claims cap Citation at 40.
- dev-55 (vanilla): Never states the central fact that ACCESSIBILITY_TWEAKS is inert/unconditional in 6.7 (declared but read nowhere) — the case's own trap (an answer suggesting the flag still gates the behaviour) is neither committed nor avoided because the flag is never mentioned.
- dev-55 (vanilla): Omits the sw_extends mechanism entirely: that an override of a removed block is silently dropped, while a `{{ parent() }}` call throws — the actual technical remedy the query asks for.
- dev-55 (vanilla): Omits the SCSS-variable and JS-generated-markup halves of the remedy (fact 3); presents only the Twig/markup examples.
- dev-55 (vanilla): Answer is a correct-but-generic list of markup changes without the requested 'what must an override do' mechanism, which is Actionability-limiting.
- dev-56 (vanilla): Fact 1 (base_esi_header/footer override with headerParameters merge) covered well with a working code example.
- dev-56 (vanilla): Fact 2's cache-cost half (ESI cacheability, cache key built from query parameters) is omitted; only the scalar-values constraint is stated.
- dev-56 (vanilla): Fact 3's HeaderPageletLoadedEvent/addExtension() route and the 'no page variable, strict_variables off' trap are omitted; only the StorefrontRenderEvent subscriber route is given.
- dev-56 (vanilla): Three unlabelled uncited factual claims cap Citation at 40.
- dev-58 (vanilla): Fact 1 (named connections under shopware.redis.connections.<name>.dsn) and fact 3 (eviction policy guidance by data class) both covered.
- dev-58 (vanilla): Fact 2 omitted: does not state that redis_url is fully removed nor which subsystems (cart storage, number range, cache invalidation delay, increment pools) each need their own connection name / fail without one.
- dev-58 (vanilla): Two unlabelled uncited factual claims cap Citation at 40.
- dev-59 (vanilla): Recommends setting `use_varnish_xkey: true` alongside `enabled: true` as the fix — this is exactly the deprecated no-op the case's own trap warns about (the key has no effect in 6.7); a materially wrong/misleading remedy, faithfully lifted from the doc page itself.
- dev-59 (vanilla): Correctly identifies that the Redis/LUA BAN approach is gone in favour of XKey (fact 1, partial).
- dev-59 (vanilla): Fact 3 (delay_enabled default true, 5-minute scheduled task, sw-force-cache-invalidate header, cache:clear no longer touching the reverse proxy) is only hinted at via a labelled memory claim about a GitHub issue, not stated as the actual default mechanism.
- dev-59 (vanilla): Four unlabelled uncited factual claims cap Citation at 40.
- dev-60 (vanilla): States that a production CLI worker 'must consume ... separately the failed transport' with its own `messenger:consume failed` command — this directly contradicts the expected fact that `failed` is a dead-letter target drained with `messenger:failed:*`, never a transport a standing worker consumes. The doc page itself appears to carry this misconception, and the agent faithfully reproduced it, but the resulting guidance is materially wrong.
- dev-60 (vanilla): Fact 2's critical gotcha — that disabling the admin worker requires a separate `bin/console scheduled-task:run` process, or no scheduled task ever queues — is omitted entirely.
- dev-60 (vanilla): Three unlabelled uncited factual claims cap Citation at 40.
- dev-61 (vanilla): States Shopware still defaults to three shards/three replicas — this is exactly the case's own trap: in 6.7 the storefront index defaults were emptied, so the cluster decides. The docs page itself states the old default, and the agent faithfully quoted it without catching that it is stale for 6.7.
- dev-61 (vanilla): Leads with `bin/console dal:refresh:index --use-queue` as the rebuild command, conflating a broader DAL reindex with the Elasticsearch-specific `es:index` (mentioned only secondarily) — confusing guidance for the specific question asked.
- dev-61 (vanilla): Fact 3 (separate admin-index shard/replica settings and `es:admin:index` command) omitted entirely.
- dev-61 (vanilla): One unlabelled uncited factual claim caps Citation at 40.
- dev-62 (vanilla): Correctly states the Symfony precedence order (real env vars win, later .env file overrides earlier) with verbatim Symfony-doc quotes.
- dev-62 (vanilla): Omits the `.env.local.php` special case entirely — per the expected answer this is the usual reason an edit to `.env` on a deployed shop has no effect, which is precisely the symptom the query describes; the answer does not actually resolve the user's stated problem.
- dev-62 (vanilla): system_config / database-driven shop settings (fact 3) mentioned only as a labelled memory claim, without the MAILER_DSN-vs-mail-settings trap.
- dev-62 (vanilla): One unlabelled uncited factual claim caps Citation at 40.
- dev-63 (vanilla): Only fact 1 (the bare command shape) is given; fact 2 (installed/active requirement, silent exit-0 on an unknown identifier, container-compile-time Migration-directory registration needing cache:clear for a first-ever migration) is entirely omitted.
- dev-63 (vanilla): Fact 3 (normal path is plugin:update, gated by plugin:refresh updating upgradeVersion) is entirely omitted.
- dev-63 (vanilla): Given the query is specifically a troubleshooting scenario ('my new migration never ran'), the answer's failure to name any of the silent-failure modes materially undercuts its usefulness.
- dev-63 (vanilla): One unlabelled uncited factual claim caps Citation at 40.
- dev-64 (vanilla): States 'Both grants return a JSON response including token_type, access_token, refresh_token and expires_in' — this contradicts the expected fact that client_credentials returns NO refresh_token; a materially wrong statement.
- dev-64 (vanilla): Correctly states expires_in=600 (10 minutes) for both grants and the administration client_id for password grant.
- dev-64 (vanilla): Refresh-token TTL (P1W) and the config keys (access_token_ttl/refresh_token_ttl) are omitted.
- dev-64 (vanilla): Two unlabelled uncited factual claims cap Citation at 40.
- dev-65 (vanilla): Claims total-count-mode=1 (exact) works via 'SQL_CALC_FOUND_ROWS' — ground truth is a second COUNT(*) query over a subquery, not SQL_CALC_FOUND_ROWS; this specific mechanism is not supported by the cited excerpt and is stated as fact rather than flagged as memory/uncertain.
- dev-65 (vanilla): filter/associations/sort/aggregations shape (fact 1, fact 2 core) is reasonably covered; the post-filter-vs-aggregation distinction and the to-one/to-many association-filter nuance (fact 2) are omitted.
- dev-65 (vanilla): One unlabelled uncited factual claim caps Citation at 40; the fabricated SQL_CALC_FOUND_ROWS detail is a further claim outrunning what the cited excerpt supports, which lowers Honesty to 70 rather than 100.
- dev-67 (vanilla): States only author/copyright are mandatory meta fields, when the manifest schema actually requires label, name, author, copyright, license and version — an inaccurate, incomplete required-fields list a developer could rely on and ship an invalid manifest.
- dev-67 (vanilla): For activation, tells the reader to use the Administration UI instead of naming the console command `bin/console app:activate <Name>` — the query specifically asked for console commands, so this is a wrong/incomplete answer to the actual question asked.
- dev-67 (vanilla): One unlabelled uncited factual claim caps Citation at 40.
- dev-69 (vanilla): Facts 2 and 3 (POST body shape, no entity data transmitted, shopware-shop-signature verification) covered well with verbatim quotes.
- dev-69 (vanilla): Fact 1's privilege requirement is omitted: the app must hold the entity's `:read` privilege or the webhook is silently skipped with no message and no delivery.
- dev-69 (vanilla): Two unlabelled uncited factual claims cap Citation at 40.
- dev-70 (vanilla): Covers the pay-url/finalize-url POST/response shape with verbatim quotes, and correctly avoids the legacy pay/pay_partially action names in its example.
- dev-70 (vanilla): Omits that only identifier/name are mandatory manifest fields and every method funnels through the single core AppPaymentHandler (fact 1).
- dev-70 (vanilla): Omits the crucial nuance that `status` is a state-machine transition ACTION name, not a state name, and that a state name (e.g. 'cancelled') throws IllegalTransitionException rather than working (fact 3) — a developer following only this answer could easily pick a state name and break the transition.
- dev-70 (vanilla): Does not mention that the app's response itself must carry a shopware-app-signature header (fact 2).
- dev-70 (vanilla): No unlabelled uncited claims; all four citations verified and matched — clean band-100 citation shape.
- dev-71 (vanilla): Correctly states the Resources/entities.xml location and the /api/search/custom-entity-<name> underscore-to-hyphen URL pattern (facts 1/2 core).
- dev-71 (vanilla): Omits the custom_entity_/ce_ table-name prefix requirement, the automatic `id` primary key, and the entity-1.0.xsd validation (fact 1 detail).
- dev-71 (vanilla): Omits fact 3 entirely: store-api-aware only attaches the ApiAware read flag and creates no Store API route; the automatic CRUD-permission grant on install/update.
- dev-71 (vanilla): Two unlabelled uncited factual claims cap Citation at 40.
- func-01 (vanilla): Fact 2 (per-channel visibility levels: fully visible / hidden from listings / hidden from listing+search) is covered well from the merchant-facing angle.
- func-01 (vanilla): Fact 1 (required fields before first save; no tab bar at all on the create route) is omitted entirely.
- func-01 (vanilla): Fact 3 (the display_group listing bug — a NULL variantListingConfig causes the parent to be hidden and all children collapsed into one arbitrary variant in the listing) is entirely absent; the answer's 'why might it not show up' list stays at the generic active/visibility/assignment level a docs page would give, missing the case's deep DAL-level finding.
- func-01 (vanilla): No unlabelled uncited claims; all three citations verified — clean band-100 citation shape.
- func-02 (vanilla): Gives the generic Rule Builder AND/OR mechanics correctly, and correctly identifies that a rule can be assigned as the method's availability rule.
- func-02 (vanilla): Omits fact 1's specifics (single nullable availability_rule_id FK, NULL = always available, a rule in use cannot be deleted).
- func-02 (vanilla): Omits fact 2 entirely (condition rows nested by parent_id, root always wrapped in AndRule, matching against the serialized payload blob rather than the condition rows).
- func-02 (vanilla): Omits fact 3 entirely (CartRuleLoader's up-to-7-iteration recompute, onlyAvailable filtering, ShippingMethodBlockedError/PaymentMethodBlockedError).
- func-02 (vanilla): Answer stays at summary level for the specific shipping/payment mechanics asked about, without saying how to diagnose a blocked method — Actionability 40.
- func-02 (vanilla): No unlabelled uncited claims; all three citations verified — clean band-100 citation shape.
- func-04 (vanilla): Fact 1 (DataSelections and basicSettings content) covered comprehensively and accurately.
- func-04 (vanilla): Fact 2's premapping list only names 5 of the 8 required items (payment methods, salutations, delivery times / default delivery time; order states, order delivery states, transaction states and newsletter recipient status are omitted), and does not mention the server-side premappingIsIncomplete enforcement.
- func-04 (vanilla): Fact 3 (payment methods have no DataSet at all vs. shipping methods having one; the two premapping-only synthetic rows) is implicitly consistent but not explicitly stated.
- func-04 (vanilla): Two unlabelled uncited factual claims cap Citation at 40.
- func-05 (vanilla): Answer omits the four sales-channel types (hardcoded UUIDs) and the SWSC/no-secret/GET-endpoint access-key mechanics — only the surface 'API Access ID' framing is given
- func-05 (vanilla): 2 unlabelled uncited factual claims found by audit (domain/language/currency detail, access-key detail) -> citation capped at 40
- func-05 (vanilla): selfReportDelta missing calls confirmed housekeeping-only by auditor; no honesty penalty
- func-06 (vanilla): [from memory] claim that Flow Builder actions include 'calling webhooks' is materially wrong: core ships 16 actions and none is HTTP-related; Call URL/webhook is a licensed Commercial extension, not core
- func-06 (vanilla): Omits 6.6 menu placement (Settings>Shop) and the 6.6/6.7 trap around Business Events / payment-status transition
- func-06 (vanilla): selfReportDelta missing calls confirmed housekeeping-only by auditor
- func-07 (vanilla): Answer never reveals the dry-run trap (real writes + rollback, with log/file/media side effects surviving) — describes dry run only as a generic pre-check
- func-07 (vanilla): Omits menu-location version delta and duplicate-mapping-collapse behaviour
- func-07 (vanilla): 3 unlabelled uncited factual claims flagged by audit -> citation capped at 40
- func-08 (vanilla): Covers set/entity assignment, field-type list and Store-API write gist correctly, but omits the three-independent-switches architecture, the restriction to 3 entities, global (not per-set) name uniqueness, and the 6.6 data-loss bug
- func-08 (vanilla): 1 unlabelled uncited factual claim flagged -> citation capped at 40
- func-10 (vanilla): Correctly names admin path, rule-based condition mechanism, and 3 of the 5 usage sites (category, comparison export, CMS slider) — omits cross-selling and the cart rule
- func-10 (vanilla): Misses the 6.6 vs 6.7 version-pin trap (displayAsGroup/internal are 6.7-only)
- func-10 (vanilla): 1 unlabelled uncited factual claim -> citation capped at 40
- func-11 (vanilla): Correctly captures location, the ACL-role-vs-admin-flag split, and one-time access/secret key issuance
- func-11 (vanilla): Omits literal privilege names (viewer/creator/editor) and the WriteProtected/separate-controller mechanism for the admin flag
- func-11 (vanilla): Only 1 citation backs several factual clauses; 2 unlabelled uncited candidates flagged -> citation capped at 40
- func-12 (vanilla): Correctly identifies both features as Commercial-only and names the exact plan tiers (Evolve for webhook, Beyond for custom pricing) matching expected facts closely
- func-12 (vanilla): Omits the core-only alternatives (rule-based advanced pricing, promotion personaCustomers, app-based webhook flow action) that fact 3 requires
- func-12 (vanilla): 2 unlabelled uncited factual claims -> citation capped at 40
- edge-03 (vanilla): Correctly states no Doctrine ORM/EntityManager exists and names EntityDefinition + EntityRepository as the real mechanism
- edge-03 (vanilla): Omits the concrete persistence call (create()/upsert() with array + Context; no persist()/flush()) that fact 3 requires
- edge-03 (vanilla): 2 unlabelled uncited factual claims -> citation capped at 40
- edge-06 (vanilla): Falls into the case's explicit trap on di.xml: presents a one-to-one 'corresponds to services.xml/yaml' mapping [from memory] where the expected answer requires stating no di.xml equivalent exists at all
- edge-06 (vanilla): Store-view and extension mappings are reasonably captured, but attribute-set and di.xml facts are the two the case singles out and one is wrong
- edge-06 (vanilla): 1 unlabelled uncited factual claim -> citation capped at 40
- edge-07 (vanilla): Correctly names Shopware Frontends as the recommended successor, but then fabricates a detailed 'classic PWA setup is still technically possible on 6.7' walkthrough ([from memory]: npm packages, Headless sales-channel, .env config) despite the case's own evidence that 6.7 carries zero PWA references anywhere in core/storefront/administration
- edge-07 (vanilla): This directly violates the case's core requirement that a correct answer 'gives no 6.7 PWA installation steps' — scored as a fabricated how-to for something that does not exist on 6.7
- edge-07 (vanilla): Never names the real 6.7 headless mechanism (API-type sales channel + sw-access-key/sw-context-token) that fact 2 requires
- edge-08 (vanilla): Content is excellent: correctly states EntityRepositoryInterface does not exist, names the concrete EntityRepository class, and gives the exact <argument type="service" id="product.repository"/> wiring
- edge-08 (vanilla): Auditor did NOT mark the missing Bash call (seq=2) as housekeeping-only (auditNotes empty, unlike the majority of this shard) -> treated as a materially under-reported toolCallLog -> honesty=0
- edge-08 (vanilla): 2 unlabelled uncited factual claims -> citation capped at 40
- edge-09 (vanilla): Falls squarely into the documented trap: presents Business Events as an existing (if legacy) admin screen 'Settings > Shop > Business-Events... they remain available only for the B2B-Suite' -- this is the exact debunked docs framing the case flags as unconfirmed by code (no such admin module exists at all)
- edge-09 (vanilla): Does correctly recommend the Flow Builder / checkout.order.placed / send-mail action as the real path
- edge-09 (vanilla): Omits that Business Events survives only as a read-only event catalogue with no write side
- gap-01 (vanilla): Does not flag that the documentation has no plugin Admin-API-controller guide, nor name the closest actual pages (Store API guide, Storefront controller guide, 2022 route-defaults ADR) as the case requires
- gap-01 (vanilla): The core mechanism given (Route defaults for _routeScope/_acl) is verified directly against real vendor code (SeoActionController.php) and matches the expected code facts precisely
- gap-01 (vanilla): Auditor did not mark the missing Bash call as housekeeping (auditNotes empty) -> honesty=0
- gap-05 (vanilla): Correctly confirms via UPGRADE-6.7.md and a repo search that Cached*Route classes are gone in 6.7
- gap-05 (vanilla): The suggested replacement mechanism is vague and wrong in the details: never names the real _httpCache route default or CacheTagCollector::addTag(), and completely omits the critical qualifier that store-api HTTP caching only landed in 6.7.6.0 gated behind the CACHE_REWORK flag (default false) — so on a stock 6.7 install nothing described actually caches the route
- gap-05 (vanilla): Auditor did not mark the missing Bash call as housekeeping (auditNotes empty) -> honesty=0
- gap-06 (vanilla): Correctly names shipping_method.repository DAL write from install()/activate(), and correctly identifies technicalName as Required from 6.7 with an accurate changelog quote
- gap-06 (vanilla): One vendor citation (ShippingMethodDefinition.php:77-77) was actually reached via Bash grep, not Read -- does not meet the vanilla band-100 citation shape requirement of 'matching a Read in the call log' -> citation capped at 40
- gap-06 (vanilla): Auditor's note on this case is about the citation-access-method mismatch, not a housekeeping confirmation -> the missing Bash call counts as a real self-report gap -> honesty=0
- gap-07 (vanilla): Gives the exact MediaService::saveMediaFile() signature verbatim, matching the expected code fact precisely
- gap-07 (vanilla): Frames thumbnail generation as near-instant ('you don't need to trigger a separate command') when the mechanism is actually asynchronous via the message bus and requires a running consumer -- a minor but real imprecision
- gap-07 (vanilla): One citation (FileSaver.php:1-20) was reached via Bash grep rather than Read -> wrong shape for vanilla's band-100 rule -> citation capped at 40; the missing Bash call is not marked housekeeping -> honesty=0
- gap-08 (vanilla): Found the real Composable Frontends troubleshooting and nuxt-module pages (outside the ingested wiki/docs corpus) and gives concrete, correct nuxt.config.ts keys and a 412 explanation consistent with both the docs and the underlying code
- gap-08 (vanilla): 412 explanation is accurate at the surface level but doesn't reach the code-level precision of distinguishing 401 (missing header) / 403 (malformed key) / 412 (well-formed key, wrong/inactive channel)
- gap-08 (vanilla): selfReportDelta shows 3 real retrieval calls (2 Read, 1 Bash) missing from the self-reported toolCallLog, not flagged as housekeeping -> materially under-reported log -> honesty=0
- rule-06 (vanilla): selfReportDelta shows a real, unreported Read call (seq=24) in addition to a housekeeping Bash call — unlike the other five cases in this shard, the audit carries no note excusing this as housekeeping-only, so the self-report materially understates how the answer was obtained: Honesty = 0
- rule-06 (vanilla): The single citation (storefront-controller.html) is verified 1/1 and directly supports the 'no business logic' claim
- rule-06 (vanilla): The rest of the answer (repository-access prohibition, Store API delegation) is an unlabelled, uncited factual claim — Citation capped at 40
- rule-06 (vanilla): The labelled memory sentence about page loaders is a plausible, on-topic elaboration, not fabrication

## Borderline re-scores

| Case | Option | Dimension | First | Second | Taken | Total before → after | Verdict before → after |
| --- | --- | --- | --- | --- | --- | --- | --- |
| dev-11 | vanilla | groundingRelevance | 100 | 70 | 70 | 62% → 55% | partly → fail |
| dev-57 | vanilla | (no dimension changed) | — | — | — | 86% → 86% | pass → pass |
| dev-65 | vanilla | honesty | 70 | 0 | 0 | 62% → 49% | partly → fail |
| dev-65 | vanilla | actionability | 100 | 70 | 70 | 62% → 49% | partly → fail |
| func-08 | vanilla | groundingRelevance | 100 | 70 | 70 | 83% → 59% | partly → fail |
| func-08 | vanilla | accuracy | 70 | 40 | 40 | 83% → 59% | partly → fail |
| func-08 | vanilla | completeness | 100 | 40 | 40 | 83% → 59% | partly → fail |
| func-11 | vanilla | groundingRelevance | 100 | 70 | 70 | 86% → 71% | pass → partly |
| func-11 | vanilla | completeness | 100 | 70 | 70 | 86% → 71% | pass → partly |
| func-11 | vanilla | actionability | 100 | 70 | 70 | 86% → 71% | pass → partly |
| edge-04 | vanilla | (no dimension changed) | — | — | — | 86% → 86% | pass → pass |

## Scorer discrepancies

- dev-11 (vanilla): scorer reported 62%/partly, recomputed 55%/fail
- dev-65 (vanilla): scorer reported 62%/partly, recomputed 49%/fail
- func-08 (vanilla): scorer reported 83%/partly, recomputed 59%/fail
- func-11 (vanilla): scorer reported 86%/pass, recomputed 71%/partly

## Audit warnings

- dev-46: accuracy-pass provisionalAccuracy claim (70) does not match the scorer's actual band (0); accuracy pass appears to have re-derived its own judgment rather than settled the tracked provisional with no documented justification for the shift (0 -> 70). Keeping the scorer's original accuracy band per the nothing-softened rule.
- gap-06: accuracy-pass provisionalAccuracy claim (70) does not match the scorer's actual band (100); accuracy pass appears to have re-derived its own judgment rather than settled the tracked provisional with no documented justification for the shift (100 -> 70). Keeping the scorer's original accuracy band per the nothing-softened rule.
