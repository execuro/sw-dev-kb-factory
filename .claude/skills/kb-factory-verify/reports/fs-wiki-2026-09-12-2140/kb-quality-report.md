# KB quality report — fs-wiki-2026-09-12-2140

## Run

| | |
| --- | --- |
| Run | `fs-wiki-2026-09-12-2140` (`fs-wiki`) |
| Options | fs-wiki |
| Corpus | wiki — fingerprint: lastBuilt 2026-09-07, treeHash 836a72be5d89…, 1569 pages |
| Probe | ls wiki/platform/index.md succeeded; manifest.json read |
| Model | inherited (not pinned) |
| Generated | 2026-09-13T05:38:27Z |
| Cases run | 100 of 100 (all) |
| Yardstick | cases.md ef932d8e, scoring-rubric.md 06199943, scorer-brief.md e256f8be, auditor-brief.md 4bd00bc6, accuracy-brief.md 9009d748 |
| Execution | discover batches of 10, scorer shards of 25 (batched) |
| Skill | kb-factory-verify |

## Run cost

| Option | Agents | Tokens | Tool calls | Summed agent time | Usage complete |
| --- | --- | --- | --- | --- | --- |
| fs-wiki | 18 (11 discover [10 batches, 1 rate-limit retry], 1 audit, 4 score, 1 accuracy, 1 rescore) | 25,430,718 | 755 | 6,763.0s | yes |

Wall-clock duration of the run: 28,652s (compare: n/a — single-option run).

## Comparison

The headline table — one row per option, straight from `options.<option>` (no new computation).

| Option | Access | Corpus | Overall | Status | Developer | Functional | Findable | Edge passed | Gap confirmed | Pass / partly / fail / unavailable / unscored | Weakest dimension |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| fs-wiki | fs | wiki | 79.1% | Not ready | 77.7% | 79.2% | 78 of 83 | 5 of 9 | 4 of 8 | 49 / 42 / 9 / 0 / 0 | accuracy |

Single-option run: no ranking or delta comparison to compute (that is `compare`'s job across options).

## Dimension heatmap

| Dimension | Weight | fs-wiki |
| --- | --- | --- |
| Grounding & Relevance | 25 | 95.8 |
| Accuracy vs. Expected Answer | 25 | 58.6 |
| Completeness | 15 | 66.7 |
| Citation & Traceability | 10 | 85.1 |
| Honesty | 15 | 91.7 |
| Actionability | 10 | 83.9 |

Average band score, `unscored` cases excluded (none unscored in this run).

### By area

| Area | Cases | fs-wiki average |
| --- | --- | --- |
| Admin API | 3 | 62.7 |
| Admin migration (Vue 3 / Vite / Pinia / Meteor) | 4 | 71.2 |
| Administration | 4 | 87.0 |
| App system | 5 | 83.8 |
| Checkout & Cart | 2 | 84.0 |
| Config & CLI | 5 | 66.6 |
| Content | 1 | 83.0 |
| Content (CMS/mail/SEO/media/sitemap) | 2 | 80.5 |
| Core breaking changes | 3 | 83.7 |
| DAL | 7 | 80.4 |
| Events | 6 | 77.0 |
| Gap | 8 | 86.2 |
| Hosting & ops | 5 | 73.0 |
| Merchant | 12 | 79.2 |
| Orders | 2 | 71.0 |
| Payment & Shipping | 1 | 100.0 |
| Platform upgrade | 2 | 92.5 |
| Plugin fundamentals | 1 | 88.0 |
| Services & DI | 3 | 77.0 |
| Store API & headless | 1 | 88.0 |
| Storefront | 9 | 76.8 |
| Testing | 3 | 68.0 |
| Theme | 2 | 82.5 |
| Trap | 9 | 83.2 |

## Verdict grid

| Case | Category | Area | fs-wiki |
| --- | --- | --- | --- |
| dev-01 | dev | DAL | 70% partly ✓ |
| dev-02 | dev | Plugin fundamentals | 88% pass ✓ |
| dev-03 | dev | Store API & headless | 88% pass ✓ |
| dev-04 | dev | Content | 83% partly ✓ |
| dev-05 | dev | Theme | 88% pass ✓ |
| dev-06 | dev | Events | 88% pass ✓ |
| dev-07 | dev | DAL | 85% pass ✓ |
| dev-08 | dev | DAL | 88% pass ✓ |
| dev-09 | dev | DAL | 88% pass ✓ |
| dev-10 | dev | DAL | 77% partly ✓ |
| dev-11 | dev | Services & DI | 80% partly ✓ |
| dev-12 | dev | Services & DI | 78% partly ✓ |
| dev-13 | dev | Services & DI | 73% partly ✓ |
| dev-14 | dev | Events | 90% pass ✓ |
| dev-15 | dev | Events | 48% fail ✓ |
| dev-16 | dev | Orders | 88% pass ✓ |
| dev-17 | dev | Checkout & Cart | 88% pass ✓ |
| dev-18 | dev | Checkout & Cart | 80% partly ✓ |
| dev-19 | dev | Events | 77% partly ✓ |
| dev-20 | dev | Events | 92% pass ✓ |
| dev-21 | dev | Events | 67% partly ✓ |
| dev-22 | dev | Config & CLI | 88% pass ✓ |
| dev-23 | dev | Content (CMS/mail/SEO/media/sitemap) | 73% partly ✓ |
| dev-24 | dev | Content (CMS/mail/SEO/media/sitemap) | 88% pass ✓ |
| dev-25 | dev | Config & CLI | 88% pass ✓ |
| dev-26 | dev | Orders | 54% fail ✓ |
| dev-27 | dev | Storefront | 88% pass ✓ |
| dev-28 | dev | Storefront | 88% pass ✓ |
| dev-29 | dev | Storefront | 88% pass ✓ |
| dev-30 | dev | Storefront | 88% pass ✓ |
| dev-31 | dev | Storefront | 88% pass ✓ |
| dev-32 | dev | DAL | 70% partly ✓ |
| dev-33 | dev | Administration | 80% partly ✓ |
| dev-34 | dev | Administration | 88% pass ✓ |
| dev-35 | dev | Administration | 88% pass ✓ |
| dev-36 | dev | Administration | 92% pass ✓ |
| dev-37 | dev | Testing | 88% pass ✓ |
| dev-38 | dev | Testing | 77% partly ✓ |
| dev-39 | dev | Testing | 39% fail ✗ |
| dev-40 | dev | Platform upgrade | 85% pass ✓ |
| dev-41 | dev | Hosting & ops | 75% partly ✓ |
| dev-42 | dev | Config & CLI | 88% pass ✓ |
| dev-43 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 79% partly ✓ |
| dev-44 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 48% fail ✓ |
| dev-45 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 88% pass ✓ |
| dev-46 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 70% partly ✓ |
| dev-47 | dev | Payment & Shipping | 100% pass ✓ |
| dev-48 | dev | Storefront | 92% pass ✓ |
| dev-49 | dev | Core breaking changes | 74% partly ✓ |
| dev-50 | dev | Core breaking changes | 85% pass ✓ |
| dev-51 | dev | DAL | 85% pass ✓ |
| dev-52 | dev | Core breaking changes | 92% pass ✓ |
| dev-53 | dev | Theme | 77% partly ✓ |
| dev-54 | dev | Storefront | 77% partly ✓ |
| dev-55 | dev | Storefront | 0% fail ✗ |
| dev-56 | dev | Storefront | 82% partly ✓ |
| dev-57 | dev | Platform upgrade | 100% pass ✓ |
| dev-58 | dev | Hosting & ops | 80% partly ✓ |
| dev-59 | dev | Hosting & ops | 70% partly ✓ |
| dev-60 | dev | Hosting & ops | 70% partly ✓ |
| dev-61 | dev | Hosting & ops | 70% partly ✓ |
| dev-62 | dev | Config & CLI | 49% fail ✓ |
| dev-63 | dev | Config & CLI | 20% fail ✗ |
| dev-64 | dev | Admin API | 42% fail ✗ |
| dev-65 | dev | Admin API | 73% partly ✓ |
| dev-66 | dev | Admin API | 73% partly ✓ |
| dev-67 | dev | App system | 92% pass ✓ |
| dev-68 | dev | App system | 92% pass ✓ |
| dev-69 | dev | App system | 88% pass ✓ |
| dev-70 | dev | App system | 70% partly ✓ |
| dev-71 | dev | App system | 77% partly ✓ |
| func-01 | func | Merchant | 88% pass ✓ |
| func-02 | func | Merchant | 88% pass ✓ |
| func-03 | func | Merchant | 100% pass ✓ |
| func-04 | func | Merchant | 70% partly ✓ |
| func-05 | func | Merchant | 80% partly ✓ |
| func-06 | func | Merchant | 80% partly ✓ |
| func-07 | func | Merchant | 76% partly ✓ |
| func-08 | func | Merchant | 88% pass ✓ |
| func-09 | func | Merchant | 88% pass ✓ |
| func-10 | func | Merchant | 66% partly ✓ |
| func-11 | func | Merchant | 78% partly ✓ |
| func-12 | func | Merchant | 48% fail ✗ |
| edge-01 | edge | Trap | 100% pass – |
| edge-02 | edge | Trap | 88% pass – |
| edge-03 | edge | Trap | 77% partly – |
| edge-04 | edge | Trap | 65% partly – |
| edge-05 | edge | Trap | 100% pass – |
| edge-06 | edge | Trap | 80% partly – |
| edge-07 | edge | Trap | 88% pass – |
| edge-08 | edge | Trap | 88% pass – |
| edge-09 | edge | Trap | 63% partly – |
| gap-01 | gap | Gap | 74% partly – |
| gap-02 | gap | Gap | 95% pass – |
| gap-03 | gap | Gap | 83% partly – |
| gap-04 | gap | Gap | 73% partly – |
| gap-05 | gap | Gap | 92% pass – |
| gap-06 | gap | Gap | 100% pass – |
| gap-07 | gap | Gap | 73% partly – |
| gap-08 | gap | Gap | 100% pass – |

## Requests and responses

What each discover agent was given and what it reported, straight from raw reports and the audit shards — no scores, no judgement.

### fs-wiki

| Case | Query | Entry point used | Tool calls made | Page reached | Findability | Top citation | Memory claims | Honesty | Verdict | Raw |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dev-01 | How do I extend the product entity with a new association… | {'tool': 'Read', 'args': 'platform/index | 3 | -handling/add-complex-data-to-existing-entities.md = target | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/framework/ | 0 | 100 | partly | raw/fs-wiki/dev-01.json |
| dev-02 | What's the plugin lifecycle in Shopware — install, activa… | {'tool': 'Bash', 'args': 'grep -n -i "li | 3 | ns/plugins/plugin-fundamentals/plugin-lifecycle.md = target | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/plugin-fun | 0 | 100 | pass | raw/fs-wiki/dev-02.json |
| dev-03 | How do I add a custom Store API route for a headless stor… | {'tool': 'Bash', 'args': 'grep -n -i "st | 2 | plugins/framework/store-api/add-store-api-route.md = target | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/framework/ | 0 | 100 | pass | raw/fs-wiki/dev-03.json |
| dev-04 | How do I create a custom CMS element for Shopping Experie… | {'tool': 'Bash', 'args': 'grep -n -i "cm | 2 | des/plugins/plugins/content/cms/add-cms-element.md = target | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/content/cm | 0 | 100 | partly | raw/fs-wiki/dev-04.json |
| dev-05 | How does theme inheritance work in Shopware — theme.json … | {'tool': 'Bash', 'args': 'grep -n -i "th | 2 | lugins/themes/inheritance/add-theme-inheritance.md = target | pass (1+1) | platform/dev/6.7/guides/plugins/themes/inheritance | 0 | 100 | pass | raw/fs-wiki/dev-05.json |
| dev-06 | How do I add a custom Flow Builder action? | {'tool': 'Bash', 'args': 'grep -n -i "fl | 2 | /plugins/framework/flow/add-flow-builder-action.md = target | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/framework/ | 0 | 100 | pass | raw/fs-wiki/dev-06.json |
| dev-07 | My plugin needs to store its own data in a new table — ho… | {'tool': 'Bash', 'args': 'grep -n -i "cu | 2 | framework/data-handling/add-custom-complex-data.md = target | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/framework/ | 0 | 100 | pass | raw/fs-wiki/dev-07.json |
| dev-08 | In a plugin service, what is the Shopware 6 equivalent of… | {'tool': 'Read', 'args': 'platform/dev/6 | 1 | ns/plugins/framework/data-handling/reading-data.md = target | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/framework/ | 0 | 100 | pass | raw/fs-wiki/dev-08.json |
| dev-09 | How do I make a field on my plugin's own entity translata… | {'tool': 'Read', 'args': 'platform/dev/6 | 1 | s/framework/data-handling/add-data-translations.md = target | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/framework/ | 0 | 100 | pass | raw/fs-wiki/dev-09.json |
| dev-10 | How do I write an indexer that precomputes derived data f… | {'tool': 'Read', 'args': 'platform/dev/6 | 1 | lugins/framework/data-handling/add-data-indexer.md = target | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/framework/ | 0 | 100 | partly | raw/fs-wiki/dev-10.json |
| dev-11 | On Shopware 6.7, which file do I declare my plugin's serv… | {'tool': 'Read', 'args': 'path=.claude/e | 5 | s/plugins/plugins/services/dependency-injection.md = target | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/services/d | 0 | 100 | partly | raw/fs-wiki/dev-11.json |
| dev-12 | I am on Shopware 6.6 — which file do I declare my plugin'… | {'tool': 'Bash', 'args': 'grep -n -i "se | 2 | lugins/plugin-fundamentals/dependency-injection.md = target | pass (1+1) | platform/dev/6.6/guides/plugins/plugins/plugin-fun | 0 | 100 | partly | raw/fs-wiki/dev-12.json |
| dev-13 | There is no event for what I need to change in a core Sho… | {'tool': 'Bash', 'args': 'grep -n -i "de | 2 | ides/plugins/plugins/services/adjusting-service.md = target | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/services/a | 0 | 100 | partly | raw/fs-wiki/dev-13.json |
| dev-14 | I wrote a subscriber class in my plugin but it never fire… | {'tool': 'Read', 'args': 'path=.claude/e | 1 | ins/plugins/framework/event/listening-to-events.md = target | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/framework/ | 0 | 100 | pass | raw/fs-wiki/dev-14.json |
| dev-15 | How do I work out which event Shopware actually dispatche… | {'tool': 'Bash', 'args': 'grep -n -i "de | 2 | /plugins/checkout/order/listen-to-order-changes.md ≠ target | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/framework/ | 0 | 0 (under-reported 1) | fail | raw/fs-wiki/dev-15.json |
| dev-16 | How do I run plugin logic whenever an order is written, a… | {'tool': 'Read', 'args': 'platform/index | 3 | /plugins/checkout/order/listen-to-order-changes.md = target | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/checkout/o | 0 | 100 | pass | raw/fs-wiki/dev-16.json |
| dev-17 | How do I overwrite the price of a product line item in th… | {'tool': 'Bash', 'args': 'grep -rln "lin | 2 | gins/plugins/checkout/cart/change-price-of-item.md = target | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/checkout/c | 0 | 100 | pass | raw/fs-wiki/dev-17.json |
| dev-18 | My plugin's cart processor adds a surcharge line item, bu… | {'tool': 'Read', 'args': 'platform/dev/6 | 3 | gins/checkout/cart/add-cart-processor-collector.md = target | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/checkout/c | 0 | 100 | partly | raw/fs-wiki/dev-18.json |
| dev-19 | I need to move long-running work in my plugin out of the … | {'tool': 'Bash', 'args': 'grep -rln "mes | 2 | ins/framework/message-queue/add-message-handler.md = target | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/framework/ | 0 | 100 | partly | raw/fs-wiki/dev-19.json |
| dev-20 | How do I add my own condition to the Rule Builder from a … | {'tool': 'Bash', 'args': 'grep -rln "cus | 3 | plugins/plugins/framework/rule/add-custom-rules.md = target | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/framework/ | 0 | 100 | pass | raw/fs-wiki/dev-20.json |
| dev-21 | My plugin dispatches its own domain event — how do I make… | {'tool': 'Read', 'args': 'platform/index | 3 | plugins/framework/flow/add-flow-builder-trigger.md = target | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/framework/ | 0 | 100 | partly | raw/fs-wiki/dev-21.json |
| dev-22 | How do I give my plugin a settings page the shop operator… | {'tool': 'Bash', 'args': 'grep -n -i "co | 3 | ns/plugin-fundamentals/add-plugin-configuration.md = target | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/plugin-fun | 0 | 100 | pass | raw/fs-wiki/dev-22.json |
| dev-23 | How do I ship a mail template with my plugin so it is ins… | {'tool': 'Bash', 'args': 'grep -n -i "ma | 2 | /plugins/plugins/content/mail/add-mail-template.md = target | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/content/ma | 0 | 100 | partly | raw/fs-wiki/dev-23.json |
| dev-24 | How do I get readable SEO URLs generated for the detail p… | {'tool': 'Bash', 'args': 'grep -n -i "se | 2 | /plugins/plugins/content/seo/add-custom-seo-url.md = target | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/content/se | 0 | 100 | pass | raw/fs-wiki/dev-24.json |
| dev-25 | How do I add a `bin/console` command to my plugin for a m… | {'tool': 'Bash', 'args': 'grep -n -i "co | 2 | plugins/plugin-fundamentals/add-custom-commands.md = target | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/plugin-fun | 0 | 100 | pass | raw/fs-wiki/dev-25.json |
| dev-26 | How do I add a custom document type such as a pro-forma i… | {'tool': 'Bash', 'args': 'grep -n -i "do | 2 | ugins/checkout/documents/v2/add-a-document-type.md = target | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/checkout/d | 0 | 100 | fail | raw/fs-wiki/dev-26.json |
| dev-27 | In Shopware 6.7, how do I extend a Storefront Twig templa… | {'tool': 'Bash', 'args': 'grep -n -i "te | 2 | lugins/storefront/templates/customize-templates.md = target | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/storefront | 0 | 100 | pass | raw/fs-wiki/dev-27.json |
| dev-28 | How do I override an existing Storefront JavaScript plugi… | {'tool': 'Bash', 'args': 'grep -n -i "ja | 2 | refront/javascript/override-existing-javascript.md = target | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/storefront | 0 | 100 | pass | raw/fs-wiki/dev-28.json |
| dev-29 | How do I add my own data to an existing Storefront page o… | {'tool': 'Bash', 'args': 'grep -n -i "te | 2 | refront/controllers/add-data-to-storefront-page.md = target | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/storefront | 0 | 100 | pass | raw/fs-wiki/dev-29.json |
| dev-30 | How do I add a custom filter to the Storefront product li… | {'tool': 'Bash', 'args': 'grep -n -i "ja | 2 | ns/plugins/storefront/howto/add-listing-filters.md = target | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/storefront | 0 | 100 | pass | raw/fs-wiki/dev-30.json |
| dev-31 | How do I expose a plugin configuration value, such as a c… | {'tool': 'Read', 'args': 'platform/index | 4 | s/plugins/storefront/styling/add-scss-variables.md = target | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/storefront | 0 | 100 | pass | raw/fs-wiki/dev-31.json |
| dev-32 | How do I define a custom field set for products from my p… | {'tool': 'Bash', 'args': 'grep -n "custo | 2 | plugins/framework/custom-field/add-custom-field.md = target | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/framework/ | 0 | 100 | partly | raw/fs-wiki/dev-32.json |
| dev-33 | How do I register a custom Administration module from my … | {'tool': 'Bash', 'args': 'grep -n -i "mo | 2 | n/module-component-management/add-custom-module.md = target | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/administra | 0 | 100 | partly | raw/fs-wiki/dev-33.json |
| dev-34 | How do I extend an existing Administration component and … | {'tool': 'Read', 'args': 'platform/dev/6 | 1 | ule-component-management/customizing-components.md = target | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/administra | 0 | 100 | pass | raw/fs-wiki/dev-34.json |
| dev-35 | How do I load entities from the Admin API inside an Admin… | {'tool': 'Bash', 'args': 'grep -n -i "re | 2 | on/data-handling-processing/using-data-handling.md = target | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/administra | 0 | 100 | pass | raw/fs-wiki/dev-35.json |
| dev-36 | How do I register ACL privileges for my plugin's Administ… | {'tool': 'Bash', 'args': 'grep -n -i "ac | 2 | ration/permissions-error-handling/add-acl-rules.md = target | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/administra | 0 | 100 | pass | raw/fs-wiki/dev-36.json |
| dev-37 | How do I set up and run PHPUnit integration tests for my … | {'tool': 'Bash', 'args': 'grep -n -i "ph | 2 | ev/6.7/guides/development/testing/unit/php-unit.md = target | pass (1+1) | platform/dev/6.7/guides/development/testing/unit/p | 0 | 100 | pass | raw/fs-wiki/dev-37.json |
| dev-38 | How do I write Jest unit tests for my Administration comp… | {'tool': 'Read', 'args': 'platform/dev/6 | 1 | /6.7/guides/development/testing/unit/jest-admin.md = target | pass (1+1) | platform/dev/6.7/guides/development/testing/unit/j | 0 | 100 | partly | raw/fs-wiki/dev-38.json |
| dev-39 | How do I write end-to-end Cypress tests for my plugin aga… | {'tool': 'Bash', 'args': 'grep -n -i "cy | 3 | uides/development/testing/legacy/cypress/_index.md ≠ target | fail (0+1) | platform/dev/6.7/guides/development/testing/legacy | 0 | 100 | fail | raw/fs-wiki/dev-39.json |
| dev-40 | How do I upgrade a Composer-based Shopware project from 6… | {'tool': 'Bash', 'args': 'grep -n -i "up | 2 | 6.7/guides/upgrades-migrations/upgrade-shopware.md = target | pass (1+1) | platform/dev/6.7/guides/upgrades-migrations/upgrad | 0 | 100 | pass | raw/fs-wiki/dev-40.json |
| dev-41 | `composer update` to Shopware 6.7 aborts on a platform re… | {'tool': 'Read', 'args': 'path=.claude/e | 3 | platform/dev/6.7/guides/hosting/_index.md = target | pass (1+1) | platform/dev/6.7/guides/hosting/_index.md:16-41 | 0 | 100 (under-reported 1) | partly | raw/fs-wiki/dev-41.json |
| dev-42 | How do I check extension compatibility before upgrading w… | {'tool': 'Bash', 'args': 'grep -rn "upgr | 3 | 6.7/products/tools/cli/project-commands/upgrade.md = target | pass (1+1) | platform/dev/6.7/products/tools/cli/project-comman | 0 | 100 | pass | raw/fs-wiki/dev-42.json |
| dev-43 | My admin plugin still ships a webpack.config.js — how do … | {'tool': 'Bash', 'args': 'grep -rn "vite | 2 | /guides/upgrades-migrations/administration/vite.md = target | pass (1+1) | platform/dev/6.7/guides/upgrades-migrations/admini | 0 | 100 | partly | raw/fs-wiki/dev-43.json |
| dev-44 | After the Vue 3 upgrade my admin plugin broke — this.$par… | {'tool': 'Read', 'args': 'path=.claude/e | 1 | /guides/upgrades-migrations/administration/vue3.md = target | pass (1+1) | platform/dev/6.7/guides/upgrades-migrations/admini | 0 | 100 | fail | raw/fs-wiki/dev-44.json |
| dev-45 | Shopware.State is deprecated in 6.7 — how do I convert my… | {'tool': 'Bash', 'args': 'grep -rn "pini | 2 | guides/upgrades-migrations/administration/pinia.md = target | pass (1+1) | platform/dev/6.7/guides/upgrades-migrations/admini | 0 | 100 | pass | raw/fs-wiki/dev-45.json |
| dev-46 | sw-button and sw-card are deprecated in Shopware 6.7 — ho… | {'tool': 'Read', 'args': 'path=.claude/e | 1 | des-migrations/administration/meteor-components.md = target | pass (1+1) | platform/dev/6.7/guides/upgrades-migrations/admini | 0 | 100 | partly | raw/fs-wiki/dev-46.json |
| dev-47 | My payment plugin implements `AsynchronousPaymentHandlerI… | {'tool': 'Bash', 'args': 'grep -rn "paym | 2 | ins/plugins/checkout/payment/add-payment-plugin.md = target | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/checkout/p | 0 | 100 | pass | raw/fs-wiki/dev-47.json |
| dev-48 | After upgrading, my storefront JavaScript plugin no longe… | {'tool': 'Bash', 'args': 'grep -rn "Plug | 2 | ins/storefront/javascript/add-custom-javascript.md = target | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/storefront | 0 | 100 | pass | raw/fs-wiki/dev-48.json |
| dev-49 | My storefront controller still uses the `@Route` and `@Ro… | {'tool': 'Bash', 'args': 'grep -rn "Rout | 2 | ns/storefront/controllers/add-custom-controller.md = target | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/storefront | 0 | 100 | partly | raw/fs-wiki/dev-49.json |
| dev-50 | My `ScheduledTaskHandler` stopped running after the upgra… | {'tool': 'Bash', 'args': 'grep -rn "Sche | 2 | /plugins/plugin-fundamentals/add-scheduled-task.md = target | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/plugin-fun | 0 | 100 | pass | raw/fs-wiki/dev-50.json |
| dev-51 | Custom entities declared in `Resources/config/entities.xm… | {'tool': 'Read', 'args': 'path=.claude/e | 4 | framework/data-handling/entities-via-attributes.md = target | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/framework/ | 0 | 100 | pass | raw/fs-wiki/dev-51.json |
| dev-52 | What must a plugin database migration class implement in … | {'tool': 'Read', 'args': 'path=.claude/e | 1 | es/plugins/plugins/database/database-migrations.md = target | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/database/d | 0 | 100 | pass | raw/fs-wiki/dev-52.json |
| dev-53 | My theme config labels disappeared from the Theme Manager… | {'tool': 'Bash', 'args': 'grep -rln "the | 2 | lugins/themes/configuration/theme-configuration.md = target | pass (1+1) | platform/dev/6.7/guides/plugins/themes/configurati | 0 | 100 | partly | raw/fs-wiki/dev-53.json |
| dev-54 | How do I register a plugin cookie in the storefront cooki… | {'tool': 'Bash', 'args': 'grep -rln "coo | 2 | elopment/accessibility/storefront-accessibility.md ≠ target | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/storefront | 0 | 0 (under-reported 1) | partly | raw/fs-wiki/dev-54.json |
| dev-55 | How do the breaking storefront accessibility changes reac… | {'tool': 'Bash', 'args': 'grep -rln "acc | 2 | — — | fail (0+1) | platform/dev/6.7/guides/development/accessibility/ | 0 | 0 | fail | raw/fs-wiki/dev-55.json |
| dev-56 | Header and footer are loaded through ESI sub-requests in … | {'tool': 'Bash', 'args': 'grep -rln "ESI | 2 | ns/storefront/templates/customize-header-footer.md = target | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/storefront | 0 | 100 | partly | raw/fs-wiki/dev-56.json |
| dev-57 | B2B Suite support ends with 6.8 — how do I run the B2B Su… | {'tool': 'Bash', 'args': 'grep -rln "B2B | 3 | b2b-suite-migration/execution/running-migration.md = target | pass (1+1) | platform/dev/6.7/products/extensions/b2b-suite-mig | 0 | 100 | pass | raw/fs-wiki/dev-57.json |
| dev-58 | My shopware.yaml still uses redis_url — how do I define t… | {'tool': 'Bash', 'args': 'grep -rln "red | 2 | orm/dev/6.7/guides/hosting/infrastructure/redis.md = target | pass (1+1) | platform/dev/6.7/guides/hosting/infrastructure/red | 0 | 100 | partly | raw/fs-wiki/dev-58.json |
| dev-59 | After upgrading to Shopware 6.7 my Varnish cache is never… | {'tool': 'Read', 'args': 'path=.claude/e | 1 | uides/hosting/infrastructure/reverse-http-cache.md = target | pass (1+1) | platform/dev/6.7/guides/hosting/infrastructure/rev | 0 | 100 | partly | raw/fs-wiki/dev-59.json |
| dev-60 | Which transports do my Shopware message queue workers hav… | {'tool': 'Bash', 'args': 'grep -rln "mes | 2 | 6.7/guides/hosting/infrastructure/message-queue.md = target | pass (1+1) | platform/dev/6.7/guides/hosting/infrastructure/mes | 0 | 100 | partly | raw/fs-wiki/dev-60.json |
| dev-61 | After the upgrade my Elasticsearch index has to be rebuil… | {'tool': 'Read', 'args': 'path=.claude/e | 3 | nfrastructure/elasticsearch/elasticsearch-setup.md = target | pass (1+1) | platform/dev/6.7/guides/hosting/infrastructure/ela | 0 | 100 | partly | raw/fs-wiki/dev-61.json |
| dev-62 | I changed a setting in `.env` on a deployed 6.7 shop but … | {'tool': 'Bash', 'args': 'grep -rln -i " | 6 | es/plugins/plugins/database/database-migrations.md ≠ target | pass (1+1) | platform/dev/6.7/guides/hosting/configurations/sho | 1 | 0 (under-reported 2) | fail | raw/fs-wiki/dev-62.json |
| dev-63 | I deployed a plugin update to a 6.7 staging shop and my n… | {'tool': 'Bash', 'args': 'grep -rn -i "p | 2 | /6.7/guides/development/integrations-api/_index.md ≠ target | fail (0+1) | platform/dev/6.7/guides/plugins/plugins/database/d | 0 | 0 (under-reported 2) | fail | raw/fs-wiki/dev-63.json |
| dev-64 | How do I get an Admin API OAuth token — with client_crede… | {'tool': 'Bash', 'args': 'grep -n -i "oa | 5 | v/6.7/products/tools/mcp-server/getting-started.md ≠ target | fail (0+1) | platform/dev/6.7/guides/development/integrations-a | 0 | 0 (under-reported 1) | fail | raw/fs-wiki/dev-64.json |
| dev-65 | What can I put in the JSON body of `POST /api/search/{ent… | {'tool': 'Bash', 'args': 'grep -n -i "se | 2 | es/development/integrations-api/search-criteria.md = target | pass (1+1) | platform/dev/6.7/guides/development/integrations-a | 0 | 100 | partly | raw/fs-wiki/dev-65.json |
| dev-66 | Which request headers change Admin API behaviour for lang… | {'tool': 'Read', 'args': 'path=.claude/e | 1 | es/development/integrations-api/request-headers.md = target | pass (1+1) | platform/dev/6.7/guides/development/integrations-a | 0 | 100 | partly | raw/fs-wiki/dev-66.json |
| dev-67 | What does a minimal app folder and `manifest.xml` need to… | {'tool': 'Bash', 'args': 'grep -n -i "ma | 2 | form/dev/6.7/guides/plugins/apps/app-base-guide.md = target | pass (1+1) | platform/dev/6.7/guides/plugins/apps/app-base-guid | 0 | 100 | pass | raw/fs-wiki/dev-67.json |
| dev-68 | How does the registration handshake between Shopware and … | {'tool': 'Read', 'args': 'path=.claude/e | 1 | s/plugins/apps/lifecycle/app-registration-setup.md = target | pass (1+1) | platform/dev/6.7/guides/plugins/apps/lifecycle/app | 0 | 100 | pass | raw/fs-wiki/dev-68.json |
| dev-69 | How does an app subscribe to an event like `product.writt… | {'tool': 'Read', 'args': 'path=.claude/e | 1 | m/dev/6.7/guides/plugins/apps/lifecycle/webhook.md = target | pass (1+1) | platform/dev/6.7/guides/plugins/apps/lifecycle/web | 0 | 100 | pass | raw/fs-wiki/dev-69.json |
| dev-70 | How do I implement a payment method in an app with `pay-u… | {'tool': 'Bash', 'args': 'grep -n -i "pa | 2 | rm/dev/6.7/guides/plugins/apps/checkout/payment.md = target | pass (1+1) | platform/dev/6.7/guides/plugins/apps/checkout/paym | 0 | 100 | partly | raw/fs-wiki/dev-70.json |
| dev-71 | How does an app define its own custom entities in Shopwar… | {'tool': 'Read', 'args': 'platform/index | 3 | guides/plugins/apps/custom-data/custom-entities.md = target | pass (1+1) | platform/dev/6.7/guides/plugins/apps/custom-data/c | 0 | 100 | partly | raw/fs-wiki/dev-71.json |
| func-01 | How do I create a product with variants and configure its… | {'tool': 'Bash', 'args': 'grep -n -i "va | 7 | platform/func/settings/productlist.md ≠ target | pass (1+1) | platform/func/catalogues/products.md:20-41 | 0 | 100 | pass | raw/fs-wiki/func-01.json |
| func-02 | How do Rule Builder conditions work for shipping and paym… | {'tool': 'Bash', 'args': 'grep -n -i "ru | 3 | nc/tutorials-and-faq/rule-builder-example-rules.md ≠ target | pass (1+1) | platform/func/settings/rules.md:32-50 | 0 | 100 | pass | raw/fs-wiki/func-02.json |
| func-03 | How do promotions and discount codes work, including indi… | {'tool': 'Read', 'args': 'platform/func/ | 1 | platform/func/marketing/promotions.md = target | pass (1+1) | platform/func/marketing/promotions.md:19-51 | 0 | 100 | pass | raw/fs-wiki/func-03.json |
| func-04 | What does the Shopware Migration Assistant transfer autom… | {'tool': 'Read', 'args': 'platform/func/ | 1 | platform/func/migration-en/what-is-migrated.md = target | pass (1+1) | platform/func/migration-en/what-is-migrated.md:35- | 0 | 100 | partly | raw/fs-wiki/func-04.json |
| func-05 | How do I set up a sales channel — storefront versus headl… | {'tool': 'Read', 'args': 'platform/func/ | 1 | platform/func/settings/saleschannel.md = target | pass (1+1) | platform/func/settings/saleschannel.md:33-68 | 0 | 100 | partly | raw/fs-wiki/func-05.json |
| func-06 | Which triggers and actions does the Flow Builder offer, a… | {'tool': 'Read', 'args': 'platform/func/ | 1 | platform/func/settings/Flow-Builder.md = target | pass (1+1) | platform/func/settings/Flow-Builder.md:19-48 | 0 | 100 | partly | raw/fs-wiki/func-06.json |
| func-07 | How do I import products from a CSV with an import/export… | {'tool': 'Bash', 'args': 'grep -n -i "im | 2 | platform/func/shopware-en/settings/importexport.md = target | pass (1+1) | platform/func/shopware-en/settings/importexport.md | 0 | 100 | partly | raw/fs-wiki/func-07.json |
| func-08 | How do custom field sets work — entity assignment, field … | {'tool': 'Read', 'args': 'platform/func/ | 1 | platform/func/settings/custom-fields.md = target | pass (1+1) | platform/func/settings/custom-fields.md:35-65 | 0 | 100 | pass | raw/fs-wiki/func-08.json |
| func-09 | Why doesn't my payment method appear in the checkout — wh… | {'tool': 'Read', 'args': 'platform/func/ | 1 | platform/func/settings/Paymentmethods.md = target | pass (1+1) | platform/func/settings/Paymentmethods.md:20-32 | 0 | 100 | pass | raw/fs-wiki/func-09.json |
| func-10 | How do dynamic product groups work in the administration … | {'tool': 'Read', 'args': 'path=.claude/e | 3 | c/shopware-6-de/Catalogues/Dynamicproductgroups.md = target | pass (1+1) | platform/func/shopware-6-de/Catalogues/Dynamicprod | 0 | 100 | partly | raw/fs-wiki/func-10.json |
| func-11 | How do I create an integration for Admin API access in th… | {'tool': 'Bash', 'args': 'grep -rni "int | 3 | platform/func/settings/system/user.md ≠ target | pass (1+1) | platform/func/settings/system/integrationen.md:21- | 0 | 100 | partly | raw/fs-wiki/func-11.json |
| func-12 | A spec asks for customer-specific pricing and for a flow … | {'tool': 'Read', 'args': 'path=.claude/e | 2 | m/func/features/webhook-actions-in-flow-builder.md ≠ target | fail (0+1) | platform/func/extensions/customer-specific-pricing | 0 | 70 | fail | raw/fs-wiki/func-12.json |
| edge-01 | How do I configure Shopware 6's built-in GraphQL API for … | {'tool': 'Bash', 'args': 'grep -rni "gra | 6 | platform/hubs/store-api.md ≠ target | n/a | platform/hubs/store-api.md:40-64 | 0 | 100 (under-reported 1) | pass | raw/fs-wiki/edge-01.json |
| edge-02 | How do I get the DI container with `Shopware()->Container… | {'tool': 'Bash', 'args': 'grep -rli "sma | 3 | — — | n/a | platform/hubs/index.md:36-36 | 1 | 100 (under-reported 1) | pass | raw/fs-wiki/edge-02.json |
| edge-03 | Where do the `#[ORM\Entity]` mapping attributes for my pl… | {'tool': 'Bash', 'args': 'grep -rli "doc | 2 | ides/plugins/plugins/framework/store-api/_index.md ≠ target | n/a | platform/dev/6.7/concepts/framework/data-abstracti | 0 | 0 (under-reported 3) | partly | raw/fs-wiki/edge-03.json |
| edge-04 | How do I fetch products with `GET /sales-channel-api/v3/p… | {'tool': 'Bash', 'args': 'grep -rni "sal | 3 | — — | n/a | platform/dev/6.7/guides/plugins/plugins/framework/ | 1 | 0 | partly | raw/fs-wiki/edge-04.json |
| edge-05 | How do I enable Shopware's built-in MCP server on a Shopw… | {'tool': 'Bash', 'args': 'grep -rni "mcp | 3 | v/6.7/products/tools/mcp-server/getting-started.md ≠ target | n/a | platform/dev/6.7/products/tools/mcp-server/getting | 0 | 100 (under-reported 1) | pass | raw/fs-wiki/edge-05.json |
| edge-06 | I'm coming from Magento — what are the Shopware equivalen… | {'tool': 'Bash', 'args': 'grep -rli "mag | 3 | platform/func/migration-en/magento-keywords.md = target | n/a | platform/func/migration-en/magento-keywords.md:20- | 1 | 100 (under-reported 1) | partly | raw/fs-wiki/edge-06.json |
| edge-07 | How do I set up Shopware PWA as the storefront for a Shop… | {'tool': 'Bash', 'args': 'grep -rni "sho | 3 | platform/dev/6.6/products/pwa.md = target | n/a | platform/dev/6.6/products/pwa.md:15-25 | 1 | 100 (under-reported 1) | pass | raw/fs-wiki/edge-07.json |
| edge-08 | Which service do I type-hint to read products — `EntityRe… | {'tool': 'Read', 'args': 'path=.claude/e | 6 | s/plugins/plugins/services/dependency-injection.md ≠ target | n/a | platform/dev/6.7/guides/plugins/plugins/framework/ | 1 | 100 | pass | raw/fs-wiki/edge-08.json |
| edge-09 | Where do I configure Business Events so that a mail is se… | {'tool': 'Bash', 'args': 'grep -n "busin | 4 | platform/func/settings/Flow-Builder.md ≠ target | n/a | platform/func/settings/Business-Events.md:21-42 | 0 | 100 | partly | raw/fs-wiki/edge-09.json |
| gap-01 | How do I add my own Admin API endpoint under `/api/...` f… | {'tool': 'Bash', 'args': 'grep -n "api r | 10 | platform/hubs/admin-api.md ≠ target | n/a | platform/dev/6.7/guides/plugins/plugins/framework/ | 1 | 100 (under-reported 2) | partly | raw/fs-wiki/gap-01.json |
| gap-02 | Shopware 6.7 removed the RSA JWT key files and `system:ge… | {'tool': 'Bash', 'args': 'grep -n "jwt\|J | 5 | — — | n/a | platform/dev/6.7/products/tools/cli/project-comman | 0 | 100 | pass | raw/fs-wiki/gap-02.json |
| gap-03 | My ERP integration stopped logging in after the 6.7 upgra… | {'tool': 'Bash', 'args': 'grep -rln "oau | 4 | /development/integrations-api/auth-api-requests.md ≠ target | n/a | platform/dev/6.7/guides/development/integrations-a | 0 | 100 | partly | raw/fs-wiki/gap-03.json |
| gap-04 | After upgrading to 6.7 my plugin fatals on load because c… | {'tool': 'Bash', 'args': 'grep -n "nativ | 5 | — — | n/a | platform/dev/6.7/guides/upgrades-migrations/_index | 0 | 100 | partly | raw/fs-wiki/gap-04.json |
| gap-05 | My plugin decorates `CachedProductRoute` to add cache tag… | {'tool': 'Bash', 'args': 'grep -n "Cache | 5 | plugins/framework/store-api/add-store-api-route.md ≠ target | n/a | platform/dev/6.7/guides/plugins/plugins/framework/ | 1 | 100 | pass | raw/fs-wiki/gap-05.json |
| gap-06 | How do I create a shipping method from my plugin's instal… | {'tool': 'Bash', 'args': 'grep -n "shipp | 3 | ins/plugins/checkout/payment/add-payment-plugin.md ≠ target | n/a | platform/dev/6.7/guides/plugins/plugins/checkout/p | 1 | 100 | pass | raw/fs-wiki/gap-06.json |
| gap-07 | How do I create a media entity from a file on disk in PHP… | {'tool': 'Bash', 'args': 'grep -n "media | 3 | ns/migration-assistant/concept/media-processing.md ≠ target | n/a | platform/dev/6.7/products/extensions/migration-ass | 1 | 100 | partly | raw/fs-wiki/gap-07.json |
| gap-08 | How do I set up a Nuxt project with Shopware Composable F… | {'tool': 'Bash', 'args': 'grep -n "Compo | 4 | platform/hubs/store-api.md ≠ target | n/a | platform/hubs/store-api.md:40-70 | 0 | 100 | pass | raw/fs-wiki/gap-08.json |

## Scores by case

### fs-wiki

| Case | Grounding | Accuracy | Completeness | Citation | Honesty | Actionability | Points | Total | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dev-01 | 100 | 40 | 70 | 0 | 100 | 100 | 25+10+10.5+0+15+10 | 70% | partly |
| dev-02 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| dev-03 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| dev-04 | 100 | 70 | 40 | 100 | 100 | 100 | 25+17.5+6+10+15+10 | 83% | partly |
| dev-05 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| dev-06 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| dev-07 | 100 | 40 | 100 | 100 | 100 | 100 | 25+10+15+10+15+10 | 85% | pass |
| dev-08 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| dev-09 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| dev-10 | 100 | 40 | 70 | 100 | 100 | 70 | 25+10+10.5+10+15+7 | 77% | partly |
| dev-11 | 100 | 40 | 70 | 100 | 100 | 100 | 25+10+10.5+10+15+10 | 80% | partly |
| dev-12 | 100 | 70 | 70 | 0 | 100 | 100 | 25+17.5+10.5+0+15+10 | 78% | partly |
| dev-13 | 100 | 70 | 40 | 0 | 100 | 100 | 25+17.5+6+0+15+10 | 73% | partly |
| dev-14 | 100 | 100 | 100 | 0 | 100 | 100 | 25+25+15+0+15+10 | 90% | pass |
| dev-15 | 100 | 40 | 40 | 0 | 0 | 70 | 25+10+6+0+0+7 | 48% | fail |
| dev-16 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| dev-17 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| dev-18 | 100 | 70 | 40 | 100 | 100 | 70 | 25+17.5+6+10+15+7 | 80% | partly |
| dev-19 | 100 | 40 | 70 | 100 | 100 | 70 | 25+10+10.5+10+15+7 | 77% | partly |
| dev-20 | 100 | 70 | 100 | 100 | 100 | 100 | 25+17.5+15+10+15+10 | 92% | pass |
| dev-21 | 100 | 0 | 70 | 100 | 100 | 70 | 25+0+10.5+10+15+7 | 67% | partly |
| dev-22 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| dev-23 | 100 | 40 | 40 | 100 | 100 | 70 | 25+10+6+10+15+7 | 73% | partly |
| dev-24 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| dev-25 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| dev-26 | 100 | 0 | 0 | 100 | 100 | 40 | 25+0+0+10+15+4 | 54% | fail |
| dev-27 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| dev-28 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| dev-29 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| dev-30 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| dev-31 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| dev-32 | 100 | 40 | 40 | 100 | 100 | 40 | 25+10+6+10+15+4 | 70% | partly |
| dev-33 | 100 | 70 | 40 | 100 | 100 | 70 | 25+17.5+6+10+15+7 | 80% | partly |
| dev-34 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| dev-35 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| dev-36 | 100 | 70 | 100 | 100 | 100 | 100 | 25+17.5+15+10+15+10 | 92% | pass |
| dev-37 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| dev-38 | 100 | 40 | 70 | 100 | 100 | 70 | 25+10+10.5+10+15+7 | 77% | partly |
| dev-39 | 40 | 0 | 0 | 100 | 100 | 40 | 10+0+0+10+15+4 | 39% | fail |
| dev-40 | 100 | 40 | 100 | 100 | 100 | 100 | 25+10+15+10+15+10 | 85% | pass |
| dev-41 | 100 | 70 | 70 | 0 | 100 | 70 | 25+17.5+10.5+0+15+7 | 75% | partly |
| dev-42 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| dev-43 | 100 | 40 | 100 | 100 | 100 | 40 | 25+10+15+10+15+4 | 79% | partly |
| dev-44 | 70 | 0 | 40 | 100 | 100 | 0 | 17.5+0+6+10+15+0 | 48% | fail |
| dev-45 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| dev-46 | 100 | 40 | 40 | 100 | 100 | 40 | 25+10+6+10+15+4 | 70% | partly |
| dev-47 | 100 | 100 | 100 | 100 | 100 | 100 | 25+25+15+10+15+10 | 100% | pass |
| dev-48 | 100 | 70 | 100 | 100 | 100 | 100 | 25+17.5+15+10+15+10 | 92% | pass |
| dev-49 | 100 | 40 | 70 | 100 | 100 | 40 | 25+10+10.5+10+15+4 | 74% | partly |
| dev-50 | 100 | 70 | 70 | 100 | 100 | 70 | 25+17.5+10.5+10+15+7 | 85% | pass |
| dev-51 | 100 | 70 | 70 | 100 | 100 | 70 | 25+17.5+10.5+10+15+7 | 85% | pass |
| dev-52 | 100 | 70 | 100 | 100 | 100 | 100 | 25+17.5+15+10+15+10 | 92% | pass |
| dev-53 | 100 | 40 | 70 | 100 | 100 | 70 | 25+10+10.5+10+15+7 | 77% | partly |
| dev-54 | 100 | 70 | 100 | 100 | 0 | 100 | 25+17.5+15+10+0+10 | 77% | partly |
| dev-55 | 0 | 0 | 0 | 0 | 0 | 0 | 0+0+0+0+0+0 | 0% | fail |
| dev-56 | 100 | 70 | 100 | 0 | 100 | 100 | 25+17.5+15+0+15+10 | 82% | partly |
| dev-57 | 100 | 100 | 100 | 100 | 100 | 100 | 25+25+15+10+15+10 | 100% | pass |
| dev-58 | 100 | 40 | 70 | 100 | 100 | 100 | 25+10+10.5+10+15+10 | 80% | partly |
| dev-59 | 100 | 40 | 40 | 100 | 100 | 40 | 25+10+6+10+15+4 | 70% | partly |
| dev-60 | 100 | 40 | 40 | 100 | 100 | 40 | 25+10+6+10+15+4 | 70% | partly |
| dev-61 | 100 | 40 | 40 | 100 | 100 | 40 | 25+10+6+10+15+4 | 70% | partly |
| dev-62 | 100 | 40 | 40 | 40 | 0 | 40 | 25+10+6+4+0+4 | 49% | fail |
| dev-63 | 0 | 40 | 40 | 0 | 0 | 40 | 0+10+6+0+0+4 | 20% | fail |
| dev-64 | 0 | 70 | 100 | 0 | 0 | 100 | 0+17.5+15+0+0+10 | 42% | fail |
| dev-65 | 100 | 40 | 40 | 100 | 100 | 70 | 25+10+6+10+15+7 | 73% | partly |
| dev-66 | 100 | 40 | 40 | 100 | 100 | 70 | 25+10+6+10+15+7 | 73% | partly |
| dev-67 | 100 | 70 | 100 | 100 | 100 | 100 | 25+17.5+15+10+15+10 | 92% | pass |
| dev-68 | 100 | 70 | 100 | 100 | 100 | 100 | 25+17.5+15+10+15+10 | 92% | pass |
| dev-69 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| dev-70 | 100 | 40 | 40 | 100 | 100 | 40 | 25+10+6+10+15+4 | 70% | partly |
| dev-71 | 100 | 40 | 70 | 100 | 100 | 70 | 25+10+10.5+10+15+7 | 77% | partly |
| func-01 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| func-02 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| func-03 | 100 | 100 | 100 | 100 | 100 | 100 | 25+25+15+10+15+10 | 100% | pass |
| func-04 | 100 | 40 | 40 | 100 | 100 | 40 | 25+10+6+10+15+4 | 70% | partly |
| func-05 | 100 | 70 | 40 | 100 | 100 | 70 | 25+17.5+6+10+15+7 | 80% | partly |
| func-06 | 100 | 40 | 70 | 100 | 100 | 100 | 25+10+10.5+10+15+10 | 80% | partly |
| func-07 | 100 | 40 | 40 | 100 | 100 | 100 | 25+10+6+10+15+10 | 76% | partly |
| func-08 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| func-09 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| func-10 | 100 | 40 | 40 | 0 | 100 | 100 | 25+10+6+0+15+10 | 66% | partly |
| func-11 | 100 | 70 | 70 | 0 | 100 | 100 | 25+17.5+10.5+0+15+10 | 78% | partly |
| func-12 | 70 | 40 | 40 | 0 | 70 | 40 | 17.5+10+6+0+10.5+4 | 48% | fail |
| edge-01 | 100 | 100 | 100 | 100 | 100 | 100 | 25+25+15+10+15+10 | 100% | pass |
| edge-02 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| edge-03 | 100 | 70 | 100 | 100 | 0 | 100 | 25+17.5+15+10+0+10 | 77% | partly |
| edge-04 | 100 | 40 | 70 | 100 | 0 | 100 | 25+10+10.5+10+0+10 | 65% | partly |
| edge-05 | 100 | 100 | 100 | 100 | 100 | 100 | 25+25+15+10+15+10 | 100% | pass |
| edge-06 | 100 | 40 | 70 | 100 | 100 | 100 | 25+10+10.5+10+15+10 | 80% | partly |
| edge-07 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| edge-08 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| edge-09 | 100 | 0 | 40 | 100 | 100 | 70 | 25+0+6+10+15+7 | 63% | partly |
| gap-01 | 100 | 40 | 70 | 70 | 100 | 70 | 25+10+10.5+7+15+7 | 74% | partly |
| gap-02 | 100 | 100 | 70 | 100 | 100 | 100 | 25+25+10.5+10+15+10 | 95% | pass |
| gap-03 | 100 | 70 | 40 | 100 | 100 | 100 | 25+17.5+6+10+15+10 | 83% | partly |
| gap-04 | 100 | 70 | 40 | 0 | 100 | 100 | 25+17.5+6+0+15+10 | 73% | partly |
| gap-05 | 100 | 70 | 100 | 100 | 100 | 100 | 25+17.5+15+10+15+10 | 92% | pass |
| gap-06 | 100 | 100 | 100 | 100 | 100 | 100 | 25+25+15+10+15+10 | 100% | pass |
| gap-07 | 100 | 40 | 40 | 100 | 100 | 70 | 25+10+6+10+15+7 | 73% | partly |
| gap-08 | 100 | 100 | 100 | 100 | 100 | 100 | 25+25+15+10+15+10 | 100% | pass |

`unavailable` means the Source-absent override applied. None occurred in this run.

## Failures and official references

One bullet per case with verdict `partly`, `fail` or `unscored`.

- **dev-15 (fs-wiki)** — fail, 48%
  - selfReportDelta shows the ground-truth call log includes a Read of listen-to-order-changes.md that the report's toolCallLog never discloses — a materially under-reported log, forcing honesty to 0
  - Recommends grepping for the literal string '@Event' to find event constant classes — the confirmed evidence states this exact search term is dead (zero occurrences in the corpus) — a materially wrong technique presented as the way to discover events
  - Lists route-level event aliases ({route}.render etc.) but never states the key nuance that there is no true post-render hook — StorefrontRenderEvent fires before the Twig call, not after
  - Official: code: Framework/DataAbstractionLayer/Event/EntityLoadedEvent.php:31 — "sets event name to <entityName>.loaded"
- **dev-26 (fs-wiki)** — fail, 54%
  - Answer is built entirely on the Document System v2 recipe (AbstractDocumentType, shopware.document_v2.type), which the expected-answer file confirms against code does not exist at 6.7.13.0 (class first appears 6.7.14.0, marked @internal) — this is the exact documented trap dev-26 is designed to catch, and the answer falls into it
  - The legacy v1 stack (AbstractDocumentRenderer, document.renderer tag) that is the actually-correct 6.7.13.0 answer is only mentioned as a side aside ('still exists but deprecated, slated for removal in 6.9'), inverting which stack is current
  - None of the 3 expected-answer facts (v1 renderer contract, document_type/number-range wiring, literal v1 template resolution) are correctly stated — the answer states the v2 equivalents instead
  - Official: code: Checkout/Document/Renderer/AbstractDocumentRenderer.php:19-29 — "supports()/render()/getDecorated() — Document v2 stack does not exist at 6.7.13.0"
- **dev-39 (fs-wiki)** — fail, 39%
  - findability fail: the agent read the legacy/cypress/_index.md page instead of the actual target testing/e2e-playwright/install-configure.md, and never reached the Playwright page at all
  - Despite opening with the correct 'Cypress is deprecated, use Playwright' statement, the answer proceeds to give a full, actionable Cypress setup recipe (folder structure, npm packages, config files, run commands) for the exact scenario ('write end-to-end Cypress tests ... against a Shopware 6.7 store') the case's Trap says must not be given
  - The correct answer (Playwright acceptance-test-suite, actor pattern, npx playwright test, bin/console integration:create) is only mentioned in passing, with none of expected-answer facts 2 or 3's specifics
  - Official: code: Resources/app/administration/src/app/plugin/shortcut.plugin.js:95-98 — "window.Cypress guard is the only surviving trace; Cypress support removed from 6.7"
- **dev-44 (fs-wiki)** — fail, 48%
  - Correctly identifies the prop-default fix: use Shopware.Snippet.tc instead of this.$tc (expected-answer fact 1) — matches exactly
  - Recommends 'this.$parent.$parent' as the fix for the $parent shift — the expected-answer file explicitly states this is 'the wrong general fix' because the async-wrapper depth is not fixed (11 sync components, extensible at runtime); the answer gives exactly the fix the case flags as wrong
  - States 'this.$tc being an exception' to the 'search for this.$' rule that survives Vue 3 — the expected file's Trap explicitly says this is wrong: $tc is deprecated tag:v6.8.0 and the answer repeats the disproven claim
  - Official: code: administration src/core/shopware.ts:264-275 — "Shopware.Snippet.tc getter aliasing tc to t"
- **dev-55 (fs-wiki)** — fail, 0%
  - Ground truth shows zero actual retrieval calls occurred (retrievalCalls:0, pageReached:null) even though the self-reported toolCallLog claims a grep + a Read; the cited excerpt's matchesToolCallLog is false — the whole answer is unsupported by any real retrieval
  - The answer states the ACCESSIBILITY_TWEAKS flag must be set to enable the 6.7 changes and that they 'become the default' only 'with major version v6.7.0' if the flag is toggled — this is exactly the documented Trap the case warns against (in 6.7 the flag is inert; nothing reads it; the changes are unconditional)
  - Target page was never actually read; findability fail
  - Official: code: Framework/Resources/config/packages/feature.yaml:24-28 — "ACCESSIBILITY_TWEAKS flag declared but nothing reads it in 6.7"
- **dev-62 (fs-wiki)** — fail, 49%
  - Ground truth shows two calls (a grep and a Read of database-migrations.md) not disclosed in the self-reported toolCallLog — materially under-reported log, honesty forced to 0
  - Expected fact 1's crucial mechanism (.env.local.php bypasses .env/.env.local/.env.$APP_ENV entirely — the usual real-world reason an edited .env has no effect) is missing; only the labelled-memory sentence gives a simplified real-env-var > .env.local > .env precedence with no mention of file-order nuance or .env.local.php
  - Expected fact 2 (cache:clear is not needed for most env changes; only FEATURE_* flags are baked into the compiled container) is entirely absent
  - Official: code: vendor/symfony/dotenv/Dotenv.php:110-177,216-224 — "bootEnv(overrideExistingVars=false); real environment variable wins over .env files"
- **dev-63 (fs-wiki)** — fail, 20%
  - The target page (commands-reference.md) was never read; ground truth shows the actual retrieval was two Reads unrelated to database migrations (auth-api-requests.md and integrations-api/_index.md), and the single self-reported Read of database-migrations.md does not appear in the ground-truth call log at all — the cited source was not actually retrieved in this session (citation's matchesToolCallLog is false)
  - Materially under-reported/misrepresented call log — honesty 0
  - Expected facts 2 (installed/active plugin requirement, silent 'No collection found' exit-0 behavior, cache:clear needed for a brand-new Migration directory) and 3 (plugin:refresh / upgradeVersion gating that is the actual reason a deployed migration silently never ran) are both absent — the answer never addresses the staging-deployment scenario the query describes
  - Official: code: Framework/Migration/Command/MigrationCommand.php:53-59,70-77,98-105 — "database:migrate <Identifier> --all; --all or --until is mandatory"
- **dev-64 (fs-wiki)** — fail, 42%
  - Ground truth shows only 2 actual retrieval calls, while the self-report claims 5 — a severe over-report, and even the one call that did happen (a Read of mcp-server/getting-started.md) is missing from the self-reported toolCallLog; two of the three cited pages (the actual target auth-api-requests.md, and integrations-api/_index.md) have matchesToolCallLog:false in the audit, meaning the cited content was never actually retrieved in this session
  - Target page (auth-api-requests.md) was never actually read per ground truth; findability fail
  - Answer content itself (client_credentials flow, 10-minute token TTL, password-grant shortcut) is largely accurate and matches expected facts at a high level, though it does not mention the 1-week refresh-token TTL
- **func-12 (fs-wiki)** — fail, 48%
  - findabilityStrict=fail: target platform/func/extensions/shopware-commercial.md was never read; agent read customer-specific-pricing.md and webhook-actions-in-flow-builder.md instead
  - Answer states the Flow Builder webhook/Call-URL action 'uses the standard Flow Builder that ships with Shopware, not a separately licensed extension' — expected-answer fact 2 states this is an Evolve-plan Shopware Commercial feature, exactly the build-vs-buy trap the case names
  - Customer-specific pricing is correctly identified as a Commercial/Beyond-plan feature
  - Official: code: Content/DependencyInjection/flow.xml:61-158 — "16 flow.action services registered; none performs HTTP request in open source"
- **dev-01 (fs-wiki)** — partly, 70%
  - Answer states getDefinitionClass() is the method to implement for 6.7 and never mentions getEntityName(), the sole abstract 6.7 method — this is the exact documented trap (dev-01's known defect) and contradicts the confirmed fact
  - Omits the exact 'only association-shaped fields' restriction and error text (fact 2 not clearly stated)
  - Citation range does not exist (cited end line 72 vs file's actual 71 lines) — audit citationsVerified 0/1
  - Official: code: Framework/DataAbstractionLayer/EntityExtension.php:46,:18 — "abstract public function getEntityName(): string; ... getDefinitionClass() does not exist in 6.7"
- **dev-04 (fs-wiki)** — partly, 83%
  - Covers admin registerCmsElement() and storefront naming-convention template (facts 1-2 present) but omits the previewComponent 'silently invisible in picker' gotcha
  - Entirely omits the server-side AbstractCmsElementResolver / CmsElementResolverInterface data-resolution path (fact 3 wholly absent) despite the query asking to 'create a custom CMS element'
  - Does not address the case's Trap (sidebar list is built solely from the block registry, so an element alone can never be dragged onto the stage)
  - Official: code: Content/Cms/DataResolver/Element/CmsElementResolverInterface.php:11-18 — "public function getType(): string; public function collect(...): ?CriteriaCollection; public function enrich(...): void;"
- **dev-10 (fs-wiki)** — partly, 77%
  - Lists only 4 of the 6 required abstract EntityIndexer members (getName, iterate, update, handle) and omits getTotal() and getDecorated() as if the list were complete — a developer following this would fail to implement the abstract class, a materially misleading claim
  - Correctly covers getPrimaryKeys() narrowing, forceQueue for async handling, dal:refresh:index, and the DISABLE_INDEXING reentry guard
  - Official: code: Framework/DataAbstractionLayer/Indexing/EntityIndexer.php:9-49 — "abstract public function iterate(?array $offset): ?EntityIndexingMessage;"
- **dev-11 (fs-wiki)** — partly, 80%
  - States flatly 'plugin services are declared in services.php... not services.xml' — the confirmed fact says XML still loads silently and is still scaffolded up to 6.7.13.0 (the version this suite is verified against), with the deprecation only starting at 6.7.14.0; this is a materially wrong/overstated claim for the pinned 6.7 target
  - Correctly shows explicit-argument injection with service(SystemConfigService::class) but omits the DAL-repository named-autowiring-alias exception
  - Official: code: Framework/Bundle.php:212-231 — "registers XmlFileLoader, YamlFileLoader and PhpFileLoader for services.*"
- **dev-12 (fs-wiki)** — partly, 78%
  - Correctly identifies services.xml file location and the constructor-argument injection pattern (facts 1-2 present)
  - Does not state that autowiring is off by default (Symfony Definition defaults autowired=false and registerContainerFile() injects no <defaults>) — fact 3 absent
  - Citation range does not exist (cited end line 56 vs file's actual 55 lines) — audit citationsVerified 0/1
  - Official: code: github v6.6.10.24 src/Core/Framework/Bundle.php:188-210 — "registerContainerFile() glob <bundle path>/Resources/config/services.*"
- **dev-13 (fs-wiki)** — partly, 73%
  - Entirely omits the 6.7 extension-point mechanism (Extension/ExtensionDispatcher, kernel.event_subscriber on <NAME>.pre/.post/.error) that should be checked before reaching for decoration — fact 1 wholly absent
  - Covers decoration via decorate()/.inner and the abstract-class contract reasonably well (facts 2-3 partially present), but omits DecorationPatternException by name and the compile-time ServiceNotFoundException on a missing decorated id
  - Citation range does not exist (cited end line 75 vs file's actual 74 lines) — audit citationsVerified 0/1
  - Official: code: Framework/Extensions/ExtensionDispatcher.php:52-77 — "publish(name: ...) hookable via kernel.event_subscriber keyed on <NAME>.pre/.post/.error"
- **dev-18 (fs-wiki)** — partly, 80%
  - Correctly states that only the processor can add to $toCalculate and that data must be recomputed from current cart state on every pass (facts 1 and 3 partially present)
  - Explicitly and honestly states that the corpus does not spell out how to avoid re-adding a duplicate line item across recalculation passes — this is the core mechanism the query asks about (CartRuleLoader's MAX_ITERATION loop, LineItemCollection::add() summing quantities instead of replacing) and it is left unanswered (fact 2 substantially absent)
  - sourceVerdict is 'partial' per the report itself, consistent with this gap
  - Official: code: Checkout/Cart/CartDataCollectorInterface.php:12 — "collect(CartDataCollection $data, Cart $original, SalesChannelContext $context, CartBehavior $behavior)"
- **dev-19 (fs-wiki)** — partly, 77%
  - States 'No manual service-tag wiring is needed: handlers marked this way are automatically registered/tagged with messenger.message_handler' — this directly contradicts the confirmed fact that Shopware plugin services are never marked autoconfigured, so Symfony's #[AsMessageHandler] autoconfigurator does not apply and the tag (or the plugin's own autoconfigure="true") is required
  - Covers the class shape (final-ish, #[AsMessageHandler], __invoke()) reasonably though omits the 'final' requirement and its PHPStan enforcement
  - Never mentions AsyncMessageInterface/LowPriorityMessageInterface routing to transports, or that an unrouted message runs synchronously (fact 3 absent)
  - Official: code: Framework/App/MessageHandler/RotateAppSecretHandler.php:9-29 — "final class ... #[AsMessageHandler] __invoke(<Message> $message): void"
- **dev-21 (fs-wiki)** — partly, 67%
  - States that getAvailableData() is 'deprecated' and replaced by StorableFlow since 6.5.0.0 — the confirmed fact is the opposite: FlowEventAware still mandates getAvailableData() and it is 'still required and still consumed by the collector in 6.7'
  - Recommends 'giving the subscriber a high priority (e.g. 1000) so it registers before other trigger subscribers' — this is exactly the case's documented Trap; the confirmed facts state no elevated priority is needed
  - Never mentions that the runtime trigger match is driven by $event->getName() (not the BusinessEventCollector::define() custom label) and never mentions the flow.storer requirement for trigger data (fact 3 absent)
  - Official: code: Framework/Event/FlowEventAware.php:9-14 — "getAvailableData(): EventDataCollection ... getName(): string"
- **dev-23 (fs-wiki)** — partly, 73%
  - Covers the migration-based insert path for mail_template_type/mail_template/translations with an idempotency guard (fact 1 present)
  - States 'system_default — must be 0' — the confirmed fact is that no code enforces this, the docs' 'must be 0' is editorial, and 1 is actually the safer value for a type's canonical template; this is a materially wrong statement contradicting a confirmed fact
  - Never mentions the CreateMailTemplateTrait helper (added 6.7.8.0) or that mail_template_sales_channel no longer exists in 6.7 (facts 2 and part of fact 3 absent)
  - Official: code: Content/MailTemplate/Aggregate/MailTemplateType/MailTemplateTypeDefinition.php:58 — "technical_name Required and UNIQUE"
- **dev-32 (fs-wiki)** — partly, 70%
  - States custom fields become searchable-by-default-false 'since 6.7.6.0' — the expected-answer file explicitly confirms this against code as 6.7.7.0, not 6.7.6.0, and calls out 6.7.6.0 as the wrong version to name; this is a materially wrong statement
  - The imperative repository example given carries no 'relations' entry binding the set to the product entity — omits expected-answer fact 2 (a set must be bound via custom_field_set_relation to 'product' or it is silently never fetched/rendered), so the example as written would not show up on the product page
  - Does not mention that the set/field technical names and field type are Immutable, nor the custom_field.editor ACL requirement (expected-answer fact 3)
  - Official: code: Framework/Plugin/PluginLifecycleService.php:569-583 — "PluginLifecycleService reads src/Resources/config/custom-fields.xml, syncs via CustomFieldSetPersister"
- **dev-33 (fs-wiki)** — partly, 80%
  - Covers Module.register(), main.js entry, routes/navigation/snippets at a high level
  - Omits all of the specific abort conditions from expected-answer fact 1 (hyphen-less id, duplicate id, missing routes/routeMiddleware, display:false)
  - Omits the specific build chain from expected-answer fact 2 (var/plugins.json via bundle:dump, Vite writing entrypoints.json, assets:install copying Resources/public, silent drop with no warning except system:check)
  - Official: code: administration src/core/factory/module.factory.ts:159,170-177,180-189,192-198,202-210 — "Shopware.Module.register aborts with console warning on invalid manifest"
- **dev-38 (fs-wiki)** — partly, 77%
  - Covers spec co-location and the Component.register()+build()+mount() pattern well; does not mention the wrapTestComponent()/flushPromises() globals installed via setupFilesAfterEnv
  - Entirely omits expected-answer fact 3: that Shopware ships no Jest harness for a plugin (roots/testMatch cover only Administration + Storefront's admin extension), so a plugin must supply its own Jest config — a central practical point for the query as asked
  - Official: code: Resources/app/administration/jest.config.js:50,61,166-181 — "6.7 Administration is Jest, not Vitest"
- **dev-41 (fs-wiki)** — partly, 75%
  - Audit shard marks the sole citation's line range as not existing (cited end line 41 exceeds the file's actual 40 lines by one) — citationsVerified is 0/1, so Citation is scored 0 per the rubric's 'cited range does not exist' band
  - Covers PHP 8.2+/memory/execution-time, MySQL/MariaDB floors, and Node minimums at a general level
  - Omits that the PHP constraint is a bounded enumerated list (~8.2||~8.3||~8.4||~8.5, not open-ended '8.2+'), that required extensions are Composer platform packages capable of independently aborting the update, and that the DB check only runs inside DatabaseConnectionFactory (never at boot or during composer update)
  - Official: code: composer.json:51-72 — ""php": "~8.2.0 || ~8.3.0 || ~8.4.0 || ~8.5.0""
- **dev-43 (fs-wiki)** — partly, 79%
  - States 'you can test the new system behind the ADMIN_VITE feature flag' — the expected-answer file confirms against code that in 6.7 the Vite build is unconditional and no ADMIN_VITE flag exists; this is a materially wrong statement matching the case's documented trap
  - Correctly covers deleting webpack.config.js/deps, the vite.config.mts optional location, and the var/plugins.json + bundle:dump + entrypoints.json build chain
  - Official: code: administration Resources/app/administration/build/plugins.vite.ts:42-64,134-146 — "no ADMIN_VITE feature flag exists; Vite-only and unconditional"
- **dev-46 (fs-wiki)** — partly, 70%
  - Correctly describes sw-button/sw-card as already-Meteor-by-default with a `deprecated` prop to opt back into 6.6-compatible rendering
  - Gives the invocation `composer run admin:code-mods -- --plugin-name example-plugin --fix -v 6.7` as the way to run the codemod — the expected-answer file's Trap explicitly states this script exists only in the shopware/shopware monorepo's composer.json and does NOT exist in a Flex/project install; a plugin developer following this command verbatim would get 'command not found'
  - Does not mention that the deprecated-prop pattern covers only 15 named components and does not generalise to sw-tabs/sw-popover/sw-loader/sw-skeleton-bar, which gate on different (and in 6.7, always-false) feature flags
  - Official: code: administration src/app/component/base/sw-button/sw-button.html.twig:1-20 — "v-if="!deprecated" ... v-else falls back to sw-button-deprecated"
- **dev-49 (fs-wiki)** — partly, 74%
  - States storefront route names should use the 'frontend, widgets, payment, api or store-api' prefix — the expected-answer file explicitly confirms against code that only frontend./widgets./payment. are valid storefront route-name prefixes, and that api/store-api are URL path prefixes of a separate mechanism, not name prefixes; this directly contradicts the case's confirmed fact and is the documented trap
  - Correctly covers the #[Route] attribute replacing @RouteScope/@Route annotations and the routes.php import with type='attribute'
  - Does not mention the storefront.router.allowed_routes exact-name allow-list added in 6.7.2.0 as the third valid path, nor that a missing scope throws at runtime via RouteScopeListener
  - Official: code: Storefront/Controller/AccountOrderController.php:43,49 — "#[Route(defaults: [PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [StorefrontRouteScope::ID]])]"
- **dev-53 (fs-wiki)** — partly, 77%
  - Answer states 'as of Shopware 6.7.1.0, label/helpText are omitted from theme.json field objects entirely', which directly contradicts expected fact 3 and the case's own Absences table ('theme.json config labels were removed in 6.7' is verdict absent) — inline label/helpText still work in 6.7 as a fallback and are only stripped by the (default-off) v6.8.0.0 feature flag
  - Expected fact 1 and 2 (config.fields location, admin snippet key structure) are captured correctly
  - Official: code: shopware/storefront Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:144 — "config.fields.<fieldName> stored verbatim; missing setter is fatal"
- **dev-54 (fs-wiki)** — partly, 77%
  - Ground-truth call log (per audit shard) shows an extra Read (of the accessibility page) not disclosed in the self-reported toolCallLog — materially under-reported log, honesty forced to 0
  - Content itself covers all three expected facts (core CookieGroupCollectEvent listener, entry-adding pattern, legacy deprecation) at an adequate level
- **dev-56 (fs-wiki)** — partly, 82%
  - All three expected facts addressed at core level (base_esi_header/footer override, query-string-only scalar constraint, StorefrontRenderEvent injection alternative); cache-cost detail and PageletLoadedEvent alternative omitted but not contradicted
  - Cited end line (75) exceeds the file's actual line count (74) by one — a minor range-boundary defect, not a wrong-shape or nonexistent citation
- **dev-58 (fs-wiki)** — partly, 80%
  - Expected fact 2 (redis_url no longer exists anywhere in 6.7; every subsystem now uses a named connection instead) is never addressed — the answer never tells the user their existing redis_url key is dead, which is the exact premise/Trap the query poses
  - Facts 1 and 3 (named connections under shopware.redis.connections.<name>.dsn, and the three-category eviction-policy split) are present and accurate
  - Official: code: Framework/DependencyInjection/Configuration.php:1581-1600 — "shopware.redis.connections.<name>.dsn is the only child node and required"
- **dev-59 (fs-wiki)** — partly, 70%
  - Answer presents 'use_varnish_xkey: true' and 'ban_method' as the fix, but expected fact 2 states these keys are deprecated no-ops in 6.7 (Varnish/xkey is now the unconditional default) — this is exactly the case's documented Trap, reproduced rather than corrected
  - Expected fact 3 (default-on delayed invalidation; the scheduled task that actually drains the queue; sw-force-cache-invalidate header) — the single most relevant explanation for 'my cache is never invalidated' — is entirely absent from the answer
  - cache:clear:http/:all commands are mentioned correctly per fact 3's tail, but the root-cause explanation is missing
  - Official: code: Framework/DependencyInjection/cache.xml:233-238 — "VarnishReverseProxyGateway is now the default gateway class; tag invalidation via HTTP PURGE with xkey"
- **dev-60 (fs-wiki)** — partly, 70%
  - Answer states 'set up a CLI worker for the failed-message transport, otherwise failed messages are never processed' and that failed messages are 'retried automatically 3 times, then deleted' — this directly contradicts expected fact 3: 'failed' is a dead-letter target drained with messenger:failed:retry/show/remove (not consumed by a standing worker), and an exhausted message is moved to failed, not deleted
  - Expected fact 2 (disabling the admin worker requires a separate bin/console scheduled-task:run process, or no scheduled task ever runs again) is entirely absent — a serious operational gap given the query is specifically about disabling the admin worker
  - Official: code: Framework/Resources/config/packages/framework.yaml:57-93 — "nothing appends low_priority implicitly; worker consumes exactly the receivers given"
- **dev-61 (fs-wiki)** — partly, 70%
  - Answer claims the storefront shard/replica default is '3/3 since 6.4.12.0' and frames the task as 'overriding' that default — this directly contradicts expected fact 1: in 6.7 both storefront env defaults are empty (no forced 3/3), which is exactly the case's documented Trap
  - Expected fact 3 (the separate admin search index configuration and es:admin:index command, which still defaults to 3/3) is entirely absent
  - Introduces 'bin/console dal:refresh:index --use-queue' as the preferred reindex command, which is not the ES-specific command named in the expected facts (es:index / es:create:alias / es:index:cleanup)
  - Official: code: shopware/shopware@v6.7.13.0 src/Elasticsearch/Resources/config/packages/elasticsearch.yaml — "env defaults for number_of_shards/replicas are empty in 6.7 for storefront indices"
- **dev-65 (fs-wiki)** — partly, 73%
  - Answer states total-count-mode: 1 'runs SQL_CALC_FOUND_ROWS for exact pagination' — this directly contradicts expected fact 3, which states the exact count uses a second COUNT(*) subquery, not SQL_CALC_FOUND_ROWS
  - Expected fact 2's key nuance (nested filter/sort/limit on an association reach the SQL only for to-many associations; they are silently ignored on to-one associations) is entirely absent
  - Fact 1 (KNOWN_FIELDS, filter vs post-filter, sort/aggregation shapes) is addressed reasonably though aggregation types are only referenced generically rather than enumerated
  - Official: code: Framework/DataAbstractionLayer/Search/RequestCriteriaBuilder.php:40,86,284 — "total-count-mode exact resets order/limit and runs a second COUNT(*) over the subquery, not SQL_CALC_FOUND_ROWS"
- **dev-66 (fs-wiki)** — partly, 73%
  - Answer frames sw-skip-trigger-flow as specific to 'bulk imports via the sync API', but expected fact 3 states it is resolved for every /api route, not only POST /api/_action/sync — a materially narrowing, misleading statement
  - Expected fact 2's key nuance (sw-inheritance is a presence-only switch — any value including 0/false enables it, with no way to disable via a falsy value) is entirely absent
  - Fact 1 (language/version headers) is addressed at a surface level
  - Official: code: Framework/Routing/ApiRequestContextResolver.php:114 — "sw-language-id expanded into requested -> parent -> system fallback chain"
- **dev-70 (fs-wiki)** — partly, 70%
  - Answer lists 'cancelled, refunded, failed, in_progress, reminded' among valid payment status values — expected fact 3 explicitly says these are STATE names, not the accepted transition ACTION names, and are NOT accepted; the answer mixes state and action names, exactly the trap the case documents (compounded by the 6.7 rename of pay->paid, pay_partially->paid_partially, do_pay->process)
  - Expected fact 2's requirement that the app's own response must carry a shopware-app-signature header for verification is entirely absent — a security-relevant omission
  - Fact 1 (finalize-url distinguishing async, omitting pay-url leaves transaction open) is present and accurate
  - Official: code: Framework/App/Manifest/Schema/manifest-3.0.xsd:520-538 — "status is a state-machine transition action name, not a state name"
- **dev-71 (fs-wiki)** — partly, 77%
  - Answer states fields marked store-api-aware="true" are used 'to expose them via the Store API' — this directly contradicts expected fact 3: store-api-aware only attaches the ApiAware read-protection flag and creates NO route; there is no generic Store API route for custom entities in 6.7 at all
  - Facts 1 (Resources/entities.xml, entity-1.0.xsd, ce_ shorthand) and 2 (repository service, hyphenated Admin API route) are present and accurate
  - Official: code: System/CustomEntity/CustomEntityLifecycleService.php:46-59 — "entities declared in app's Resources/entities.xml, validated against entity-1.0.xsd"
- **edge-03 (fs-wiki)** — partly, 77%
  - toolCallLog self-reports only 2 calls (1 grep + 1 Read) but the ground-truth transcript shows 4, including an entire extra Read of a different file and an unrelated grep — a materially under-reported log
  - Content itself correctly states no Doctrine ORM/EntityManager exists and names EntityRepository/constructor injection as the real mechanism (facts 1, 3)
  - Fact 2's Shopware attribute-based entity alternative (#[Entity], #[Field]) is not mentioned; the answer implies PHP-defined entities are the only mechanism
  - Official: code: Framework/DataAbstractionLayer/CompilerPass/EntityCompilerPass.php:39-84 — "container auto-creates <entity_name>.repository service; no EntityManager exists"
- **edge-04 (fs-wiki)** — partly, 65%
  - toolCallLog self-reports 3 calls but ground truth shows only 1 actually happened — the log over-claims process that did not occur
  - Correctly states the sales-channel-api prefix is not to be used and Store API is the replacement (fact 1)
  - The unlabelled-but-memory-tagged endpoint guesses ('POST /store-api/product/{productId}', '/store-api/product-listing/{categoryId}', '/store-api/search') do not match the expected-answer fact 2's correct endpoint (GET|POST /store-api/product, no version segment) — a wrong-endpoint memory claim
  - Official: code: Framework/Routing/StoreApiRouteScope.php:15-19 — "route scope allows the single path store-api; no /sales-channel-api exists"
- **edge-06 (fs-wiki)** — partly, 80%
  - Answer maps 'Attribute Sets -> Custom field sets' as a direct equivalent; expected-answer fact 3 explicitly requires stating there is NO attribute-set equivalent and warns against naming a look-alike — this is exactly the trap the case is built to catch
  - Store View -> Sales channel and di.xml -> Symfony DI (facts 1, 4) are correctly stated
  - property_group/property_group_option as the actual variant/filter-attribute analogue (part of fact 3) is not mentioned
  - Official: code: System/SalesChannel/Aggregate/SalesChannelDomain/SalesChannelDomainDefinition.php:63-67 — "per-domain URL, language, currency, snippet set — no store-view hierarchy"
- **edge-09 (fs-wiki)** — partly, 63%
  - Answer invents step-by-step 'Add Business-Event' setup instructions for a screen the expected answer (confirmed against code) states does not exist in 6.6 or 6.7 at all — the event_action* tables were dropped by a V6_5 migration
  - Answer repeats the wiki page's own outdated framing ('replaced in 6.4.8.0 / still used by the B2B Suite') which cases.md's known-defects list explicitly flags as unconfirmed by core code — this is the documented trap for this exact case
  - Correctly names the Flow Builder / checkout.order.placed / action.mail.send as the real configuration path (fact 2)
  - Official: code: Migration/V6_5/Migration1670854818RemoveEventActionTable.php:24-29 — "event_action, event_action_rule, event_action_sales_channel tables dropped by a V6_5 migration"
- **func-04 (fs-wiki)** — partly, 70%
  - Answer states 'shipping and payment methods themselves are not actually transferred automatically' — this directly contradicts expected fact 3: shipping methods DO have a DataSet and ARE migrated with customersOrders; only payment methods are excluded (premapping only) — the answer wrongly generalises the payment-method gap to shipping methods too
  - Expected fact 2 lists 8 premapping items and a server-side enforcement mechanism (premappingIsIncomplete); the answer names only 5 items (payment methods, standard payment method, salutation, delivery time, standard delivery time) and omits order states, order delivery states, transaction states and newsletter recipient status entirely, plus the enforcement detail
  - Fact 1 (plugin is separate from core, basicSettings mandatory) is present
  - Official: code: SwagMigrationAssistant@6.6.x src/Profile/Shopware/DataSelection/BasicSettingsDataSelection.php:49-62 — "basicSettings mandatory DataSelection carrying languages, categories, customer groups, currencies, sales channels, number ranges"
- **func-05 (fs-wiki)** — partly, 80%
  - Answer lists only 3 sales-channel types (storefront, headless, product-comparison export); expected-answer fact 1 requires a fourth type, Agentic Commerce, and 'the type does not relax any requirement' framing is absent
  - Fact 2 (domain binds url+language+currency+snippet set) is correctly and clearly stated
  - Fact 3 (access key mechanics: SWSC prefix, no secret counterpart, fetched via GET /api/_action/access-key/sales-channel) is absent; answer only says the key is 'generated under the API access setting'
  - Official: code: Defaults.php:27-33 — "four sales channel type UUIDs including Agentic commerce"
- **func-06 (fs-wiki)** — partly, 80%
  - Case pins version 6.6; answer states 'Settings > Automation > Flow Builder' but expected-answer fact 1 is explicit that in 6.6 the module sits under Settings > Shop, not Automation — a wrong menu path for the pinned version
  - 16 core actions and the licence-gating of delay/webhook actions (fact 2) are stated correctly
  - Trigger + action.mail.send pairing for order-placed (fact 3) is stated; the two-flow / recipient-type nuance is omitted
  - Official: code: 6.6 Administration sw-flow/index.js:179-187 (ref v6.6.10.0) — "settingsItem.group callback returns 'shop' unless v6.7.0.0 flag active"
- **func-07 (fs-wiki)** — partly, 76%
  - Answer states 'Start dry run validates the file without writing any data'; expected-answer fact 3 (confirmed against code) is that dry run performs the real writes and rolls back the transaction — logs/files/media survive outside that window. The answer states the opposite of the ground-truthed fact
  - Second Unique Identifier / matching-by-productNumber (fact 2 core) is correctly described; the duplicate-mapping-collapses nuance is omitted
  - Version-specific menu location (Shop in 6.6 vs Automation in 6.7) is not differentiated for this 6.6+6.7 case
  - Official: code: Content/ImportExport/ImportExport.php:116-118,180-182,191-194,196-210 — "dry run performs the real writes and rolls the DBAL transaction back at the end"
- **func-10 (fs-wiki)** — partly, 66%
  - Cited range platform/func/shopware-6-de/Catalogues/Dynamicproductgroups.md:33-71 exceeds the file's actual line count (70) by 1 — audit marks the citation unverified
  - Answer offers 'Keep matching variants grouped' unconditionally for a 6.6+6.7 case; expected-answer fact 3 explicitly states this option (displayAsGroup) does not exist in 6.6 and flags exactly this as wrong
  - Only 3 of the 5 documented use-places (category, product-comparison export, CMS slider) are given; cross-selling and the cart rule cartLineItemInProductStream are omitted
  - Official: code: Content/ProductStream/Service/ProductStreamBuilder.php:34 — "displayAsGroup and internal do not exist in 6.6.10.0 ProductStreamDefinition"
- **func-11 (fs-wiki)** — partly, 78%
  - Both cited ranges (integrationen.md:21-45, user.md:44-76) exceed the respective files' actual line counts by 1 — audit marks both unverified
  - 'Admin flag vs. Role' as the two exclusive ways to grant privileges (fact 2) is well matched
  - Specific privilege names (integration.viewer/creator/editor) and the OAuth client_credentials usage of the key pair (facts 1, 3) are not named
  - Official: code: administration src/module/sw-integration/index.js:14-46 — "sw-integration module gated by integration.viewer privilege"
- **gap-01 (fs-wiki)** — partly, 74%
  - Correctly reports no plugin-controller-under-/api/... guide exists and names the closest pages read (store-api route guide, ACL guide, admin-api hub) without presenting them as the answer (facts 1, 2)
  - Memory-labelled claim names an 'AdminApiRouteScope' class and a '#[Acl([...])]' PHP attribute; expected-answer fact 3 states neither exists — the real mechanism is Symfony #[Route] defaults (ApiRouteScope::ID / PlatformRequest::ATTRIBUTE_ACL) — the invented class/attribute names are exactly the trap fact 3 warns against
  - add-store-api-route.md citation does not correspond to a matching toolCallLog entry per the audit
  - Official: code: Framework/Api/Controller/AclController.php:19,33-41 — "AclAnnotationValidator enforces PlatformRequest::ATTRIBUTE_ACL as Route default"
- **gap-03 (fs-wiki)** — partly, 83%
  - Correctly and honestly reports that no corpus page covers the 6.7 OAuth change and names the auth guide actually read (fact 1)
  - Does not flag the doc's 'scopes: write' request body as inconsistent with the real singular space-delimited scope parameter (fact 2)
  - Does not state that /api/oauth/authorize no longer exists in 6.7 (fact 3)
  - Official: code: Framework/Api/Controller/AuthController.php:33 — "AuthController declares only POST /api/oauth/token"
- **gap-04 (fs-wiki)** — partly, 73%
  - Correctly and honestly reports no page lists 6.7 native-property-type changes (fact 1)
  - Cites the general Upgrades and Migrations index rather than the backward-compatibility guideline (#[PropertyTypeNarrowing]/#[PropertyTypeWidening]) named in expected-answer fact 2 — a different, less specific 'closest page'
  - Correctly avoids inventing a property list (fact 3's invention requirement met)
  - Official: code: Framework/DataAbstractionLayer/Entity.php:14-29 — "repo-wide native property typing change, no enumerable list exists"
- **gap-07 (fs-wiki)** — partly, 73%
  - Correctly and honestly reports no general plugin guide exists for creating a media entity from a local file (fact 1)
  - Memory-labelled claim names the method as 'MediaService::saveFile()'; expected-answer fact 2 gives the real signature as 'MediaService::saveMediaFile(...)' — a wrong method name
  - Memory-labelled claim states thumbnail generation happens 'through the DAL/media indexer'; fact 3 states it is deferred via a GenerateThumbnailsMessage on the message bus requiring a consumer or CLI run — a materially different, misleading mechanism description
  - Official: code: Content/Media/MediaService.php:53-68 — "saveMediaFile(MediaFile $mediaFile, string $filename, Context $context, ?string $folder=null, ?string $mediaId=null, bool $private=true)"

## Accuracy cross-checks

| Option | Flagged | Fetched | Served from cache | Bands changed | Fetch failures |
| --- | --- | --- | --- | --- | --- |
| fs-wiki | 89 of 100 | 0 | 0 | 0 | none |

All 89 flagged cases carried `Status: confirmed` in their expected-answer file, so the accuracy pass settled each against its own code-verified facts (`[code: …]` evidence tags) rather than fetching the live official page — per the rubric, a `confirmed` case's own evidence *is* the stronger cross-check, and re-fetching the docs would reintroduce the circularity the suite's ground-truthing removed. No band was changed from its provisional value; only `dev-57` (the single `contradictory` case) would have required a real fetch, and it was not flagged for accuracy re-check.

No band changed — every flagged case held its provisional accuracy.

## Observations about source availability

- No case in this run hit the Source-absent override (`sourceAbsentOverrideApplied: false` in every one of the 100 cases): the wiki corpus had a target page for every `dev`/`func` case, and every `edge`/`gap` case was scored on the honest not-found/gap-reporting bands instead.
- 9 `dev`/`func` cases genuinely failed to find or correctly report material the corpus *did* have (dev-15, dev-26, dev-39, dev-44, dev-55, dev-62, dev-63, dev-64, func-12) — these are real misses, not source-absence.
- Several answers (dev-01, dev-21, dev-23, dev-26, dev-59, dev-61, dev-70) faithfully reproduced known, documented defects already recorded in `cases.md`'s "Known documentation defects" section — the wiki page itself teaches the wrong thing, and the agent quoted it correctly. These are corpus-content failures, not discovery failures, and are the clearest argument for fixing the ingested pages rather than the discover agent.
- `gap-02`, `gap-05`, `gap-06`, `gap-08` passed as confirmed documentation gaps — the KB honestly reported "not covered" for topics the corpus genuinely does not carry (undocumented JWT/OAuth changes, the removed `Cached*Route` classes, PHP-side media creation, Composable Frontends setup). These are correct outcomes, not KB successes.
- `edge-04`'s docs target is `none` per the cases.md exception table but the agent found substantive real content and gave a direction-correct answer rather than a pure not-found, so the override did not apply there either; it was scored on the normal fact bands.

## Recommended fixes

Derived strictly from scorer `findings`.

- dev-01 (fs-wiki): the ingested EntityExtension guide still teaches `getDefinitionClass()` for 6.7 with no deprecation notice; the sole abstract method in 6.7.13.0 is `getEntityName()`. Fix the source page, not the agent.
- dev-21 (fs-wiki): the Flow Builder trigger guide still teaches the deprecated `getAvailableData()` framing and a priority-1000 recipe that the confirmed evidence says is wrong for 6.7 — page needs correction.
- dev-23 (fs-wiki): mail template guide states `system_default` should not be 0, contradicting the confirmed fact — page needs correction.
- dev-26 (fs-wiki): the Document System v2 guide is presented as the 6.7 answer but the v2 classes do not exist at 6.7.13.0; page should point to the legacy (v1) recipe instead, per cases.md's documented defect.
- dev-39 (fs-wiki): findability fail — the Cypress legacy page outranks/overshadows the intended Playwright target (`testing/e2e-playwright/install-configure.md`); the deprecated Cypress guide should be more clearly marked historical or removed from primary navigation.
- dev-44 (fs-wiki): Vue 3 migration guide gives multiple contradicted specifics (`this.$parent`, `this.$tc` prop-default handling) — page needs correction against the confirmed code facts.
- dev-55 (fs-wiki): agent fabricated content with zero retrieval calls in the ground-truth log yet claimed a page was read — a genuine discover-agent honesty failure worth flagging to the agent's own instructions, not a corpus defect.
- dev-59 (fs-wiki), dev-61 (fs-wiki): hosting pages (`reverse-http-cache.md`, `elasticsearch-setup.md`) still present deprecated/wrong defaults (Varnish xkey block; ES shard/replica counts) that the case's confirmed evidence contradicts — pages need correction.
- dev-70 (fs-wiki): order-changes/order-state guide's state/action name list mismatches the confirmed values — a developer following it risks `IllegalTransitionException`.
- func-06 (fs-wiki), func-10 (fs-wiki): merchant pages (`Flow-Builder.md`, dynamic product groups) carry a version-pin trap or wrong menu path for the pinned version — pages need a version-qualified correction.
- func-12 (fs-wiki): findability fail — the agent never reached `extensions/shopware-commercial.md`, which states the Call-URL flow-action licence gate; the commercial-features page should be more discoverable from a generic "does Shopware already ship X" query (index lines/keywords/synonyms).
- Citation off-by-one: 12 cases (see Audit warnings) cite an end line exactly 1 past the actual file length — worth checking whether the ingestion pipeline appends a line the discover agents then over-count, or whether it's purely an agent-side range-computation habit.

## Borderline re-scores

Cases whose first total landed within ±2 of a verdict boundary (58–62 or 83–87), graded a second time by a fresh scorer. Where the two passes disagreed, the lower band was taken.

| Case | Option | Dimension | First | Second | Taken | Total before → after | Verdict before → after |
| --- | --- | --- | --- | --- | --- | --- | --- |
| dev-04 | fs-wiki | accuracy | 70 | 100 | 70 | 91% → 90% | pass → pass |
| dev-04 | fs-wiki | completeness | 100 | 70 | 70 |  |  |
| dev-38 | fs-wiki | accuracy | 70 | 40 | 40 | 81% → 65% | partly → partly |
| dev-38 | fs-wiki | actionability | 100 | 70 | 70 |  |  |
| dev-40 | fs-wiki | accuracy | 70 | 40 | 40 | 85% → 78% | pass → partly |
| dev-50 | fs-wiki | accuracy | 70 | 70 | 70 | 85% → 100% | pass → pass |
| dev-50 | fs-wiki | completeness | 70 | 100 | 70 |  |  |
| dev-50 | fs-wiki | actionability | 70 | 100 | 70 |  |  |
| dev-51 | fs-wiki | accuracy | 70 | 70 | 70 | 85% → 91% | pass → pass |
| dev-51 | fs-wiki | actionability | 70 | 100 | 70 |  |  |
| dev-56 | fs-wiki | accuracy | 70 | 70 | 70 | 87% → 90% | pass → pass |
| dev-56 | fs-wiki | citation | 40 | 0 | 0 |  |  |
| func-05 | fs-wiki | accuracy | 70 | 70 | 70 | 85% → 89% | pass → pass |
| func-05 | fs-wiki | completeness | 100 | 70 | 70 |  |  |
| func-05 | fs-wiki | actionability | 100 | 70 | 70 |  |  |
| func-12 | fs-wiki | groundingRelevance | 100 | 70 | 70 | 58% → 46% | partly → fail |
| func-12 | fs-wiki | actionability | 100 | 40 | 40 |  |  |
| gap-03 | fs-wiki | accuracy | 70 | 70 | 70 | 58% → 91% | partly → pass |
| gap-04 | fs-wiki | accuracy | 70 | 70 | 70 | 58% → 90% | partly → pass |
| gap-04 | fs-wiki | completeness | 100 | 40 | 40 |  |  |
| gap-04 | fs-wiki | citation | 100 | 0 | 0 |  |  |

`dev-07` was the only borderline case where both passes agreed on every dimension (accuracy 40 both times) — it held at 85% pass unchanged. Every other borderline case moved at least one dimension down per the lower-band rule; two cases crossed a verdict boundary as a result (`dev-40`: pass → partly; `func-12`: partly → fail), and two crossed upward into a cleaner pass once the confirmed-code Accuracy check replaced the scoring wave's provisional guess (`gap-03`, `gap-04`: partly → pass).

## Scorer discrepancies

None. Every case's recomputed total/verdict matched the scorer's own reported total/verdict before the borderline rescore was applied.

## Audit warnings

- rescore dev-04: accuracy 70 → 100 (took lower: 70)
- rescore dev-04: completeness 40 → 70 (took lower: 40)
- rescore dev-38: accuracy 70 → 40 (took lower: 40)
- rescore dev-38: actionability 70 → 100 (took lower: 70)
- rescore dev-40: accuracy 40 → 70 (took lower: 40)
- rescore dev-50: accuracy 70 → 100 (took lower: 70)
- rescore dev-50: completeness 70 → 100 (took lower: 70)
- rescore dev-50: actionability 70 → 100 (took lower: 70)
- rescore dev-51: accuracy 70 → 100 (took lower: 70)
- rescore dev-51: actionability 70 → 100 (took lower: 70)
- rescore dev-56: accuracy 70 → 100 (took lower: 70)
- rescore dev-56: citation 40 → 0 (took lower: 0)
- rescore func-05: accuracy 70 → 100 (took lower: 70)
- rescore func-05: completeness 40 → 70 (took lower: 40)
- rescore func-05: actionability 100 → 70 (took lower: 70)
- rescore func-12: groundingRelevance 100 → 70 (took lower: 70)
- rescore func-12: actionability 100 → 40 (took lower: 40)
- rescore gap-03: accuracy 70 → 100 (took lower: 70)
- rescore gap-04: accuracy 70 → 100 (took lower: 70)
- rescore gap-04: completeness 40 → 100 (took lower: 40)
- rescore gap-04: citation 100 → 0 (took lower: 0)
- discover batch 2 (dev-11..dev-20) hit an API rate-limit failure partway through (after dev-11..dev-15); the remaining cases (dev-16..dev-20) were completed by a fresh retry agent into the same output directory, and both agents' ground-truth call logs were merged into one batch-2.calls.json before auditing — see run notes.
- Citation range overshoot pattern: dev-01, dev-12, dev-13, dev-14, dev-15, dev-41, dev-56, dev-64, func-10, func-11, func-12, gap-01 all cite an end line exactly 1 past the wiki page's actual line count, driving citationsVerified/Citation to 0 even where the quoted excerpt content was accurate. This looks like a systematic off-by-one in how discover agents compute the end line of a Read range (or a trailing-newline miscount in the ingested wiki files) rather than 12 independent citation failures — worth a harness-level look before trusting the Citation dimension at face value for fs-wiki.
- Multiple scorers independently flagged a suspected cross-case tool-call attribution artifact within shared discover batches (cases named: dev-21, dev-26, dev-45, dev-53, dev-54, dev-62, dev-63, dev-64, edge-05, edge-06, func-12, gap-02) — ground-truth call logs for these cases appear to include reads/citations belonging to a neighbouring case in the same 10-case batch. Per the skill's rule the audit shard's ground-truth log was treated as authoritative in every case (never second-guessed), but this pattern recurred often enough across shards that it may indicate a real batch/case-boundary bug in extract-agent-calls.mjs's per-case attribution rather than 12 independent agent mistakes. Filed as feedback for engineering follow-up; scores were not adjusted for it beyond what each scorer already judged case-by-case.
- Borderline second-opinion rescore (11 cases within ±2 of a verdict boundary) changed one or more dimension bands (taking the lower per rule) in 9 of 11 cases: dev-04, dev-38, dev-40, dev-50, dev-51, dev-56, func-05, func-12, gap-03, gap-04.
