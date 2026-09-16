# KB quality report — fs-wiki-2026-09-13-1151

## Run

| | |
| --- | --- |
| Run | `fs-wiki-2026-09-13-1151` (`fs-wiki`) |
| Options | fs-wiki |
| Corpus | wiki — fingerprint: `lastBuilt 2026-09-07`, `treeHash 836a72be5d897213…`, 1569 pages |
| Probe | fs: entry point present (`platform/index.md`), manifest read |
| Model | inherited (not pinned) |
| Generated | 2026-09-13T12:32:08Z |
| Cases run | 100 of 100 (`all`) |
| Yardstick | `cases.md ef932d8e`, `scoring-rubric.md 54864fb4`, `scorer-brief.md 1456b9ec`, `auditor-brief.md 4c2c6fdc`, `accuracy-brief.md 9009d748` |
| Execution | discover batches of 10, scorer shards of 25 (batched) |
| Skill | `kb-factory-verify` |

## Run cost

| Option | Agents | Tokens | Tool calls | Summed agent time | Usage complete |
| --- | --- | --- | --- | --- | --- |
| fs-wiki | 17 (10 discover, 1 audit, 4 score, 1 accuracy, 1 rescore) | 2243792 | 714 | 5238.5s | yes |

Wall-clock duration of the run: 2464.0s.

## Comparison

| Option | Access | Corpus | Overall | Status | Developer | Functional | Findable | Edge passed | Gap confirmed | Pass / partly / fail / unavailable / unscored | Weakest dimension |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| fs-wiki | fs | wiki | 73.9% | Not ready | 73.2% | 72.6% | 77 of 83 | 4 of 9 | 3 of 8 | 23 / 64 / 13 / 0 / 0 | citation |

Single-option run — no ranking or delta to compute (needs a second option via `compare`).

## Dimension heatmap

| Dimension | Weight | fs-wiki |
| --- | --- | --- |
| Grounding & Relevance | 25 | 93.9 |
| Accuracy vs. Expected Answer | 25 | 55.4 |
| Completeness | 15 | 61.6 |
| Citation & Traceability | 10 | 51.7 |
| Honesty | 15 | 95.8 |
| Actionability | 10 | 80.5 |

Average band score, `unscored` cases excluded (none in this run).

### By area

| Area | fs-wiki average |
| --- | --- |
| Plugin fundamentals | 57.0 |
| Testing | 57.7 |
| Content | 63.0 |
| Hosting & ops | 64.0 |
| Admin migration (Vue 3 / Vite / Pinia / Meteor) | 65.0 |
| Admin API | 65.7 |
| Content (CMS/mail/SEO/media/sitemap) | 70.0 |
| Services & DI | 71.3 |
| Merchant | 72.6 |
| Config & CLI | 73.8 |
| DAL | 75.0 |
| Orders | 75.0 |
| Events | 75.2 |
| Core breaking changes | 75.3 |
| Trap | 76.2 |
| Storefront | 76.6 |
| App system | 76.6 |
| Administration | 77.0 |
| Theme | 79.5 |
| Gap | 79.5 |
| Checkout & Cart | 80.0 |
| Platform upgrade | 83.0 |
| Store API & headless | 89.0 |
| Payment & Shipping | 100.0 |
## Verdict grid

| Case | Category | Area | fs-wiki |
| --- | --- | --- | --- |
| dev-01 | dev | DAL | 73% partly ✓ |
| dev-02 | dev | Plugin fundamentals | 57% fail ✓ |
| dev-03 | dev | Store API & headless | 89% pass ✓ |
| dev-04 | dev | Content | 63% partly ✓ |
| dev-05 | dev | Theme | 89% pass ✓ |
| dev-06 | dev | Events | 77% partly ✓ |
| dev-07 | dev | DAL | 82% partly ✓ |
| dev-08 | dev | DAL | 89% pass ✓ |
| dev-09 | dev | DAL | 67% partly ✓ |
| dev-10 | dev | DAL | 74% partly ✓ |
| dev-11 | dev | Services & DI | 73% partly ✓ |
| dev-12 | dev | Services & DI | 66% partly ✓ |
| dev-13 | dev | Services & DI | 75% partly ✓ |
| dev-14 | dev | Events | 97% pass ✓ |
| dev-15 | dev | Events | 55% fail ✗ |
| dev-16 | dev | Orders | 70% partly ✓ |
| dev-17 | dev | Checkout & Cart | 78% partly ✓ |
| dev-18 | dev | Checkout & Cart | 82% partly ✓ |
| dev-19 | dev | Events | 70% partly ✓ |
| dev-20 | dev | Events | 89% pass ✓ |
| dev-21 | dev | Events | 63% partly ✓ |
| dev-22 | dev | Config & CLI | 63% partly ✓ |
| dev-23 | dev | Content (CMS/mail/SEO/media/sitemap) | 73% partly ✓ |
| dev-24 | dev | Content (CMS/mail/SEO/media/sitemap) | 67% partly ✓ |
| dev-25 | dev | Config & CLI | 70% partly ✓ |
| dev-26 | dev | Orders | 80% partly ✓ |
| dev-27 | dev | Storefront | 90% pass ✓ |
| dev-28 | dev | Storefront | 78% partly ✓ |
| dev-29 | dev | Storefront | 70% partly ✓ |
| dev-30 | dev | Storefront | 90% pass ✓ |
| dev-31 | dev | Storefront | 65% partly ✗ |
| dev-32 | dev | DAL | 70% partly ✓ |
| dev-33 | dev | Administration | 73% partly ✓ |
| dev-34 | dev | Administration | 82% partly ✓ |
| dev-35 | dev | Administration | 73% partly ✓ |
| dev-36 | dev | Administration | 80% partly ✓ |
| dev-37 | dev | Testing | 59% fail ✓ |
| dev-38 | dev | Testing | 68% partly ✓ |
| dev-39 | dev | Testing | 46% fail ✗ |
| dev-40 | dev | Platform upgrade | 76% partly ✓ |
| dev-41 | dev | Hosting & ops | 63% partly ✓ |
| dev-42 | dev | Config & CLI | 100% pass ✓ |
| dev-43 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 42% fail ✓ |
| dev-44 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 70% partly ✓ |
| dev-45 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 78% partly ✓ |
| dev-46 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 70% partly ✓ |
| dev-47 | dev | Payment & Shipping | 100% pass ✓ |
| dev-48 | dev | Storefront | 90% pass ✓ |
| dev-49 | dev | Core breaking changes | 70% partly ✓ |
| dev-50 | dev | Core breaking changes | 78% partly ✓ |
| dev-51 | dev | DAL | 70% partly ✓ |
| dev-52 | dev | Core breaking changes | 78% partly ✓ |
| dev-53 | dev | Theme | 70% partly ✓ |
| dev-54 | dev | Storefront | 82% partly ✓ |
| dev-55 | dev | Storefront | 46% fail ✓ |
| dev-56 | dev | Storefront | 78% partly ✗ |
| dev-57 | dev | Platform upgrade | 90% pass ✓ |
| dev-58 | dev | Hosting & ops | 78% partly ✓ |
| dev-59 | dev | Hosting & ops | 52% fail ✓ |
| dev-60 | dev | Hosting & ops | 62% partly ✓ |
| dev-61 | dev | Hosting & ops | 65% partly ✓ |
| dev-62 | dev | Config & CLI | 71% partly ✓ |
| dev-63 | dev | Config & CLI | 65% partly ✗ |
| dev-64 | dev | Admin API | 67% partly ✓ |
| dev-65 | dev | Admin API | 65% partly ✓ |
| dev-66 | dev | Admin API | 65% partly ✓ |
| dev-67 | dev | App system | 92% pass ✓ |
| dev-68 | dev | App system | 92% pass ✓ |
| dev-69 | dev | App system | 88% pass ✓ |
| dev-70 | dev | App system | 56% fail ✓ |
| dev-71 | dev | App system | 55% fail ✓ |
| func-01 | func | Merchant | 58% fail ✓ |
| func-02 | func | Merchant | 80% partly ✓ |
| func-03 | func | Merchant | 88% pass ✓ |
| func-04 | func | Merchant | 70% partly ✓ |
| func-05 | func | Merchant | 80% partly ✓ |
| func-06 | func | Merchant | 73% partly ✓ |
| func-07 | func | Merchant | 80% partly ✓ |
| func-08 | func | Merchant | 73% partly ✓ |
| func-09 | func | Merchant | 88% pass ✓ |
| func-10 | func | Merchant | 55% fail ✓ |
| func-11 | func | Merchant | 78% partly ✓ |
| func-12 | func | Merchant | 48% fail ✗ |
| edge-01 | edge | Trap | 90% pass – |
| edge-02 | edge | Trap | 100% pass – |
| edge-03 | edge | Trap | 95% pass – |
| edge-04 | edge | Trap | 70% partly – |
| edge-05 | edge | Trap | 88% pass – |
| edge-06 | edge | Trap | 77% partly – |
| edge-07 | edge | Trap | 82% partly – |
| edge-08 | edge | Trap | 70% partly – |
| edge-09 | edge | Trap | 14% fail – |
| gap-01 | gap | Gap | 67% partly – |
| gap-02 | gap | Gap | 94% pass – |
| gap-03 | gap | Gap | 82% partly – |
| gap-04 | gap | Gap | 92% pass – |
| gap-05 | gap | Gap | 68% partly – |
| gap-06 | gap | Gap | 79% partly – |
| gap-07 | gap | Gap | 90% pass – |
| gap-08 | gap | Gap | 64% partly – |
## Requests and responses

What each discover agent was given and what it reported, straight from `raw/fs-wiki/<case-id>.json` and the mechanical facts in `derived/fs-wiki/shard-*.json` — no scores, no judgement.

### fs-wiki

| Case | Query | Entry point used | Tool calls made | Page reached | Findability | Top citation | Memory claims | Honesty | Verdict | Raw |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dev-01 | How do I extend the product entity with a new association in Shopwa... | Read platform/index.md | 5 (Read, Bash, Bash, Read, Read) | platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-co | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/framework/data-ha... | 0 | 100 | partly | `raw/fs-wiki/dev-01.json` |
| dev-02 | What's the plugin lifecycle in Shopware — install, activate, uninst... | Bash find .claude/extras/ShopwareDevKnowledgeBase/ | 2 (Bash, Read) | platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/plugin-lif | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/plugin-fundamenta... | 0 | 100 | fail | `raw/fs-wiki/dev-02.json` |
| dev-03 | How do I add a custom Store API route for a headless storefront? | Bash find .claude/extras/ShopwareDevKnowledgeBase/ | 2 (Bash, Read) | platform/dev/6.7/guides/plugins/plugins/framework/store-api/add-store- | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/framework/store-a... | 0 | 100 | pass | `raw/fs-wiki/dev-03.json` |
| dev-04 | How do I create a custom CMS element for Shopping Experiences? | Bash find .claude/extras/ShopwareDevKnowledgeBase/ | 2 (Bash, Read) | platform/dev/6.7/guides/plugins/plugins/content/cms/add-cms-element.md | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/content/cms/add-c... | 0 | 100 | partly | `raw/fs-wiki/dev-04.json` |
| dev-05 | How does theme inheritance work in Shopware — theme.json and SCSS o... | Bash find .claude/extras/ShopwareDevKnowledgeBase/ | 3 (Bash, Read, Read) | platform/dev/6.7/guides/plugins/themes/configuration/theme-inheritance | pass (1+1) | platform/dev/6.7/guides/plugins/themes/inheritance/add-th... | 0 | 100 | pass | `raw/fs-wiki/dev-05.json` |
| dev-06 | How do I add a custom Flow Builder action? | Bash find .claude/extras/ShopwareDevKnowledgeBase/ | 2 (Bash, Read) | platform/dev/6.7/guides/plugins/plugins/framework/flow/add-flow-builde | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/framework/flow/ad... | 0 | 100 | partly | `raw/fs-wiki/dev-06.json` |
| dev-07 | My plugin needs to store its own data in a new table — how do I def... | Bash find .claude/extras/ShopwareDevKnowledgeBase/ | 3 (Bash, Bash, Read) | platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-cu | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/framework/data-ha... | 0 | 100 | partly | `raw/fs-wiki/dev-07.json` |
| dev-08 | In a plugin service, what is the Shopware 6 equivalent of Doctrine'... | Bash find .claude/extras/ShopwareDevKnowledgeBase/ | 2 (Bash, Read) | platform/dev/6.7/guides/plugins/plugins/framework/data-handling/readin | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/framework/data-ha... | 0 | 100 | pass | `raw/fs-wiki/dev-08.json` |
| dev-09 | How do I make a field on my plugin's own entity translatable per la... | Bash find .claude/extras/ShopwareDevKnowledgeBase/ | 2 (Bash, Read) | platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-da | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/framework/data-ha... | 0 | 100 | partly | `raw/fs-wiki/dev-09.json` |
| dev-10 | How do I write an indexer that precomputes derived data for my cust... | Bash find .claude/extras/ShopwareDevKnowledgeBase/ | 3 (Bash, Bash, Read) | platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-da | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/framework/data-ha... | 0 | 100 | partly | `raw/fs-wiki/dev-10.json` |
| dev-11 | On Shopware 6.7, which file do I declare my plugin's services in, a... | Read platform/index.md | 4 (Read, Bash, Bash, Read) | platform/dev/6.6/guides/plugins/plugins/plugin-fundamentals/dependency | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/services/dependen... | 0 | 100 (under-reported 2) | partly | `raw/fs-wiki/dev-11.json` |
| dev-12 | I am on Shopware 6.6 — which file do I declare my plugin's service ... | Bash grep -rn "dependency-injection|services.xml|s | 2 (Bash, Read) | — | pass (0+1) | platform/dev/6.6/guides/plugins/plugins/plugin-fundamenta... | 0 | 70 | partly | `raw/fs-wiki/dev-12.json` |
| dev-13 | There is no event for what I need to change in a core Shopware serv... | Bash find .claude/extras/ShopwareDevKnowledgeBase/ | 2 (Bash, Read) | platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md  | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/services/adjustin... | 0 | 100 | partly | `raw/fs-wiki/dev-13.json` |
| dev-14 | I wrote a subscriber class in my plugin but it never fires — which ... | Bash find .claude/extras/ShopwareDevKnowledgeBase/ | 2 (Bash, Read) | platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-e | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/framework/event/l... | 0 | 100 | pass | `raw/fs-wiki/dev-14.json` |
| dev-15 | How do I work out which event Shopware actually dispatches for a gi... | Bash grep -rli "debug:event-dispatcher|how to find | 2 (Bash, Read) | platform/dev/6.7/guides/plugins/plugins/framework/event/finding-events | fail (1+1) | platform/dev/6.7/guides/plugins/plugins/framework/event/f... | 0 | 0 (under-reported 4) | fail | `raw/fs-wiki/dev-15.json` |
| dev-16 | How do I run plugin logic whenever an order is written, and find ou... | Bash grep -rli "EntityWrittenEvent|getPayload|writ | 2 (Bash, Read) | platform/dev/6.7/guides/plugins/plugins/checkout/order/listen-to-order | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/checkout/order/li... | 0 | 100 (under-reported 1) | partly | `raw/fs-wiki/dev-16.json` |
| dev-17 | How do I overwrite the price of a product line item in the cart at ... | Bash grep -rli "line item.*price|CartProcessor|ove | 2 (Bash, Read) | platform/dev/6.7/guides/plugins/plugins/checkout/cart/change-price-of- | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/checkout/cart/cha... | 0 | 100 | partly | `raw/fs-wiki/dev-17.json` |
| dev-18 | My plugin's cart processor adds a surcharge line item, but it is ad... | Read platform/dev/6.7/guides/plugins/plugins/check | 2 (Read, Read) | platform/dev/6.7/guides/plugins/plugins/checkout/cart/add-cart-discoun | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/checkout/cart/add... | 0 | 100 | partly | `raw/fs-wiki/dev-18.json` |
| dev-19 | I need to move long-running work in my plugin out of the request in... | Read platform/dev/6.7/guides/plugins/plugins/frame | 1 (Read) | platform/dev/6.7/guides/plugins/plugins/framework/message-queue/add-me | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/framework/message... | 0 | 100 | partly | `raw/fs-wiki/dev-19.json` |
| dev-20 | How do I add my own condition to the Rule Builder from a plugin so ... | Bash grep -rli "rule builder|custom rule|RuleScope | 2 (Bash, Read) | platform/dev/6.7/guides/plugins/plugins/framework/rule/add-custom-rule | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/framework/rule/ad... | 0 | 100 (under-reported 1) | pass | `raw/fs-wiki/dev-20.json` |
| dev-21 | My plugin dispatches its own domain event — how do I make it show u... | Read platform/index.md | 3 (Read, Bash, Read) | platform/dev/6.7/guides/plugins/plugins/framework/flow/add-flow-builde | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/framework/flow/ad... | 0 | 100 | partly | `raw/fs-wiki/dev-21.json` |
| dev-22 | How do I give my plugin a settings page the shop operator can fill ... | Bash grep -rln -i "plugin config\|system config\|c | 2 (Bash, Read) | platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-plugin | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/plugin-fundamenta... | 0 | 100 | partly | `raw/fs-wiki/dev-22.json` |
| dev-23 | How do I ship a mail template with my plugin so it is installed aut... | Bash grep -rln -i "mail template" .claude/extras/S | 2 (Bash, Read) | platform/dev/6.7/guides/plugins/plugins/content/mail/add-mail-template | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/content/mail/add-... | 0 | 100 | partly | `raw/fs-wiki/dev-23.json` |
| dev-24 | How do I get readable SEO URLs generated for the detail pages of my... | Bash grep -rln -i "seo url\|url generator\|SeoUrlR | 2 (Bash, Read) | platform/dev/6.7/guides/plugins/plugins/content/seo/add-custom-seo-url | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/content/seo/add-c... | 0 | 100 | partly | `raw/fs-wiki/dev-24.json` |
| dev-25 | How do I add a `bin/console` command to my plugin for a maintenance... | Bash grep -rln -i "console command\|bin/console" . | 3 (Bash, Bash, Read) | platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-custom | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/plugin-fundamenta... | 0 | 100 | partly | `raw/fs-wiki/dev-25.json` |
| dev-26 | How do I add a custom document type such as a pro-forma invoice in ... | Bash grep -rln -i "document type\|pro-forma\|profo | 3 (Bash, Read, Read) | platform/dev/6.7/guides/plugins/plugins/checkout/documents/legacy/add- | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/checkout/document... | 0 | 100 | partly | `raw/fs-wiki/dev-26.json` |
| dev-27 | In Shopware 6.7, how do I extend a Storefront Twig template from my... | Bash grep -rln -i "sw_extends|extends.*twig|overri | 2 (Bash, Read) | platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/storefront/templa... | 0 | 100 | pass | `raw/fs-wiki/dev-27.json` |
| dev-28 | How do I override an existing Storefront JavaScript plugin, such as... | Bash grep -rln -i "override.*plugin|extend.*plugin | 2 (Bash, Read) | platform/dev/6.7/guides/plugins/plugins/storefront/javascript/override | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/storefront/javasc... | 0 | 100 | partly | `raw/fs-wiki/dev-28.json` |
| dev-29 | How do I add my own data to an existing Storefront page or pagelet ... | Bash grep -rln -i "sw_extends|extends.*twig|overri | 2 (Bash, Read) | platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-dat | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/storefront/contro... | 0 | 100 | partly | `raw/fs-wiki/dev-29.json` |
| dev-30 | How do I add a custom filter to the Storefront product listing from... | Bash grep -rln -i "listing.*filter|custom filter|p | 2 (Bash, Read) | platform/dev/6.7/guides/plugins/plugins/storefront/howto/add-listing-f | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/storefront/howto/... | 0 | 100 | pass | `raw/fs-wiki/dev-30.json` |
| dev-31 | How do I expose a plugin configuration value, such as a colour pick... | Read path=.claude/extras/ShopwareDevKnowledgeBase/ | 3 (Read, Bash, Read) | platform/dev/6.7/guides/plugins/plugins/framework/custom-field/add-cus | fail (0+1) | platform/dev/6.7/guides/plugins/plugins/storefront/stylin... | 0 | 100 (under-reported 2) | partly | `raw/fs-wiki/dev-31.json` |
| dev-32 | How do I define a custom field set for products from my plugin so m... | Bash grep -rln "custom field" .claude/extras/Shopw | 2 (Bash, Read) | — | pass (0+1) | platform/dev/6.7/guides/plugins/plugins/framework/custom-... | 0 | 100 | partly | `raw/fs-wiki/dev-32.json` |
| dev-33 | How do I register a custom Administration module from my plugin, an... | Bash find .claude/extras/ShopwareDevKnowledgeBase/ | 3 (Bash, Read, Read) | platform/dev/6.7/guides/plugins/plugins/administration/module-componen | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/administration/mo... | 0 | 100 | partly | `raw/fs-wiki/dev-33.json` |
| dev-34 | How do I extend an existing Administration component and its Twig b... | Bash find .claude/extras/ShopwareDevKnowledgeBase/ | 2 (Bash, Read) | platform/dev/6.7/guides/plugins/plugins/administration/module-componen | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/administration/mo... | 0 | 100 | partly | `raw/fs-wiki/dev-34.json` |
| dev-35 | How do I load entities from the Admin API inside an Administration ... | Bash grep -rli "Criteria" .claude/extras/ShopwareD | 2 (Bash, Read) | platform/dev/6.7/guides/plugins/plugins/administration/data-handling-p | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/administration/da... | 0 | 0 (under-reported 3) | partly | `raw/fs-wiki/dev-35.json` |
| dev-36 | How do I register ACL privileges for my plugin's Administration mod... | Bash grep -n "acl|privilege" .claude/extras/Shopwa | 2 (Bash, Read) | platform/dev/6.7/guides/plugins/plugins/administration/permissions-err | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/administration/pe... | 0 | 100 | partly | `raw/fs-wiki/dev-36.json` |
| dev-37 | How do I set up and run PHPUnit integration tests for my Shopware p... | Bash grep -n "PHPUnit|integration test" .claude/ex | 2 (Bash, Read) | platform/dev/6.7/guides/development/testing/unit/php-unit.md = target | pass (1+1) | platform/dev/6.7/guides/development/testing/unit/php-unit... | 0 | 70 | fail | `raw/fs-wiki/dev-37.json` |
| dev-38 | How do I write Jest unit tests for my Administration components in ... | Read path=.claude/extras/ShopwareDevKnowledgeBase/ | 2 (Read, Read) | platform/dev/6.7/guides/development/testing/unit/jest-admin.md = targe | pass (1+1) | platform/dev/6.7/guides/development/testing/unit/jest-adm... | 0 | 70 (under-reported 1) | partly | `raw/fs-wiki/dev-38.json` |
| dev-39 | How do I write end-to-end Cypress tests for my plugin against a Sho... | Bash grep -n "cypress|e2e" .claude/extras/Shopware | 3 (Bash, Read, Read) | platform/dev/6.7/guides/development/testing/legacy/cypress/_index.md ≠ | fail (0+1) | platform/dev/6.7/guides/development/testing/legacy/_index... | 0 | 100 | fail | `raw/fs-wiki/dev-39.json` |
| dev-40 | How do I upgrade a Composer-based Shopware project from 6.6 to 6.7 ... | Bash grep -n "upgrade|6.6 to 6.7|composer.json con | 2 (Bash, Read) | platform/dev/6.7/guides/upgrades-migrations/upgrade-shopware.md = targ | pass (1+1) | platform/dev/6.7/guides/upgrades-migrations/upgrade-shopw... | 0 | 100 | partly | `raw/fs-wiki/dev-40.json` |
| dev-41 | `composer update` to Shopware 6.7 aborts on a platform requirement ... | Read path=.claude/extras/ShopwareDevKnowledgeBase/ | 5 (Read, Bash, Bash, Read, Read) | platform/dev/6.7/guides/installation/system-requirements.md ≠ target | pass (1+1) | platform/dev/6.7/guides/hosting/_index.md:16-41 | 0 | 100 | partly | `raw/fs-wiki/dev-41.json` |
| dev-42 | How do I check extension compatibility before upgrading with shopwa... | Bash grep -n -i "shopware-cli|compatibility" .clau | 3 (Bash, Read, Read) | platform/dev/6.7/guides/upgrades-migrations/_index.md ≠ target | pass (1+1) | platform/dev/6.7/products/tools/cli/project-commands/upgr... | 0 | 100 | pass | `raw/fs-wiki/dev-42.json` |
| dev-43 | My admin plugin still ships a webpack.config.js — how do I move the... | Bash grep -n -i "vite|webpack.config" .claude/extr | 2 (Bash, Read) | platform/dev/6.7/guides/upgrades-migrations/administration/vite.md = t | pass (1+1) | platform/dev/6.7/guides/upgrades-migrations/administratio... | 0 | 100 | fail | `raw/fs-wiki/dev-43.json` |
| dev-44 | After the Vue 3 upgrade my admin plugin broke — this.$parent resolv... | Read path=.claude/extras/ShopwareDevKnowledgeBase/ | 1 (Read) | platform/dev/6.7/guides/upgrades-migrations/administration/vue3.md = t | pass (1+1) | platform/dev/6.7/guides/upgrades-migrations/administratio... | 0 | 100 | partly | `raw/fs-wiki/dev-44.json` |
| dev-45 | Shopware.State is deprecated in 6.7 — how do I convert my administr... | Bash grep -n -i "pinia|vuex" .claude/extras/Shopwa | 2 (Bash, Read) | platform/dev/6.7/guides/upgrades-migrations/administration/meteor-comp | pass (1+1) | platform/dev/6.7/guides/upgrades-migrations/administratio... | 0 | 100 (under-reported 1) | partly | `raw/fs-wiki/dev-45.json` |
| dev-46 | sw-button and sw-card are deprecated in Shopware 6.7 — how do I mig... | Read path=.claude/extras/ShopwareDevKnowledgeBase/ | 1 (Read) | — | pass (0+1) | platform/dev/6.7/guides/upgrades-migrations/administratio... | 0 | 100 | partly | `raw/fs-wiki/dev-46.json` |
| dev-47 | My payment plugin implements `AsynchronousPaymentHandlerInterface` ... | Bash grep -n -i "payment" .claude/extras/ShopwareD | 2 (Bash, Read) | platform/dev/6.7/guides/plugins/plugins/checkout/payment/add-payment-p | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/checkout/payment/... | 0 | 100 | pass | `raw/fs-wiki/dev-47.json` |
| dev-48 | After upgrading, my storefront JavaScript plugin no longer loads — ... | Bash grep -n -i "PluginManager|storefront plugin|r | 2 (Bash, Read) | platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-cust | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/storefront/javasc... | 0 | 100 | pass | `raw/fs-wiki/dev-48.json` |
| dev-49 | My storefront controller still uses the `@Route` and `@RouteScope` ... | Bash grep -n -i "@Route|RouteScope|Route attribute | 2 (Bash, Read) | platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-cus | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/storefront/contro... | 0 | 100 | partly | `raw/fs-wiki/dev-49.json` |
| dev-50 | My `ScheduledTaskHandler` stopped running after the upgrade — how m... | Read path=.claude/extras/ShopwareDevKnowledgeBase/ | 1 (Read) | platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-schedu | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/plugin-fundamenta... | 0 | 100 | partly | `raw/fs-wiki/dev-50.json` |
| dev-51 | Custom entities declared in `Resources/config/entities.xml` no long... | Read path=.claude/extras/ShopwareDevKnowledgeBase/ | 4 (Read, Bash, Bash, Read) | platform/dev/6.7/guides/plugins/plugins/framework/data-handling/entiti | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/framework/data-ha... | 0 | 100 (under-reported 1) | partly | `raw/fs-wiki/dev-51.json` |
| dev-52 | What must a plugin database migration class implement in Shopware 6... | Bash find .claude/extras/ShopwareDevKnowledgeBase/ | 2 (Bash, Read) | platform/dev/6.7/guides/plugins/plugins/database/database-migrations.m | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/database/database... | 0 | 100 | partly | `raw/fs-wiki/dev-52.json` |
| dev-53 | My theme config labels disappeared from the Theme Manager after 6.7... | Bash find .claude/extras/ShopwareDevKnowledgeBase/ | 2 (Bash, Read) | platform/dev/6.7/guides/plugins/themes/configuration/theme-configurati | pass (1+1) | platform/dev/6.7/guides/plugins/themes/configuration/them... | 0 | 100 | partly | `raw/fs-wiki/dev-53.json` |
| dev-54 | How do I register a plugin cookie in the storefront cookie consent ... | Bash grep -rli "cookie consent|CookieConfiguration | 2 (Bash, Read) | platform/dev/6.7/guides/plugins/plugins/storefront/advanced/add-cookie | pass (1+1) | platform/dev/6.7/guides/plugins/plugins/storefront/advanc... | 0 | 100 | partly | `raw/fs-wiki/dev-54.json` |
| dev-55 | How do the breaking storefront accessibility changes reach my theme... | Bash grep -rli "accessibility" .claude/extras/Shop | 2 (Bash, Read) | platform/dev/6.7/guides/development/accessibility/storefront-accessibi | pass (1+1) | platform/dev/6.7/guides/development/accessibility/storefr... | 0 | 100 | fail | `raw/fs-wiki/dev-55.json` |
| dev-56 | Header and footer are loaded through ESI sub-requests in Shopware 6... | Bash grep -rli "ESI\|sub-request\|sub request\|hea | 3 (Bash, Bash, Read) | platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize | fail (1+1) | platform/dev/6.7/guides/plugins/plugins/storefront/templa... | 0 | 100 (under-reported 2) | partly | `raw/fs-wiki/dev-56.json` |
| dev-57 | B2B Suite support ends with 6.8 — how do I run the B2B Suite Migrat... | Bash grep -rli "b2b suite migration|migration.*b2b | 2 (Bash, Read) | platform/dev/6.7/products/extensions/b2b-suite-migration/execution/run | pass (1+1) | platform/dev/6.7/products/extensions/b2b-suite-migration/... | 0 | 100 | pass | `raw/fs-wiki/dev-57.json` |
| dev-58 | My shopware.yaml still uses redis_url — how do I define the named R... | Bash grep -rli "redis_url|redis:" .claude/extras/S | 2 (Bash, Read) | platform/dev/6.7/guides/hosting/infrastructure/redis.md = target | pass (1+1) | platform/dev/6.7/guides/hosting/infrastructure/redis.md:1-72 | 0 | 100 | partly | `raw/fs-wiki/dev-58.json` |
| dev-59 | After upgrading to Shopware 6.7 my Varnish cache is never invalidat... | Bash grep -rli "varnish|reverse proxy" .claude/ext | 2 (Bash, Read) | platform/dev/6.7/guides/hosting/infrastructure/reverse-http-cache.md = | pass (1+1) | platform/dev/6.7/guides/hosting/infrastructure/reverse-ht... | 0 | 100 | fail | `raw/fs-wiki/dev-59.json` |
| dev-60 | Which transports do my Shopware message queue workers have to consu... | Bash grep -rli "message queue|admin worker|messeng | 2 (Bash, Read) | platform/dev/6.7/guides/hosting/infrastructure/message-queue.md = targ | pass (1+1) | platform/dev/6.7/guides/hosting/infrastructure/message-qu... | 0 | 100 | partly | `raw/fs-wiki/dev-60.json` |
| dev-61 | After the upgrade my Elasticsearch index has to be rebuilt — where ... | Read path=.claude/extras/ShopwareDevKnowledgeBase/ | 3 (Read, Bash, Read) | platform/dev/6.7/guides/hosting/infrastructure/elasticsearch/elasticse | pass (1+1) | platform/dev/6.7/guides/hosting/infrastructure/elasticsea... | 0 | 100 (under-reported 1) | partly | `raw/fs-wiki/dev-61.json` |
| dev-62 | I changed a setting in `.env` on a deployed 6.7 shop but it still b... | Read path=.claude/extras/ShopwareDevKnowledgeBase/ | 5 (Read, Bash, Read, Bash, Bash) | platform/dev/6.7/guides/hosting/configurations/shopware/static-system- | pass (1+1) | platform/dev/6.7/guides/hosting/configurations/shopware/e... | 1 | 100 (under-reported 3) | partly | `raw/fs-wiki/dev-62.json` |
| dev-63 | I deployed a plugin update to a 6.7 staging shop and my new migrati... | Bash grep -rln 'migration:migrate|database:migrate | 2 (Bash, Read) | platform/dev/6.7/guides/plugins/plugins/database/database-migrations.m | fail (0+1) | platform/dev/6.7/guides/plugins/plugins/database/database... | 0 | 100 (under-reported 1) | partly | `raw/fs-wiki/dev-63.json` |
| dev-64 | How do I get an Admin API OAuth token — with client_credentials for... | Bash grep -rln 'client_credentials|password grant| | 3 (Bash, Read, Read) | platform/dev/6.7/guides/development/integrations-api/_index.md ≠ targe | pass (1+1) | platform/dev/6.7/guides/development/integrations-api/_ind... | 0 | 100 (under-reported 1) | partly | `raw/fs-wiki/dev-64.json` |
| dev-65 | What can I put in the JSON body of `POST /api/search/{entity}` for ... | Read path=.claude/extras/ShopwareDevKnowledgeBase/ | 1 (Read) | platform/dev/6.7/guides/development/integrations-api/search-criteria.m | pass (1+1) | platform/dev/6.7/guides/development/integrations-api/sear... | 0 | 100 | partly | `raw/fs-wiki/dev-65.json` |
| dev-66 | Which request headers change Admin API behaviour for language, enti... | Read path=.claude/extras/ShopwareDevKnowledgeBase/ | 1 (Read) | platform/dev/6.7/guides/development/integrations-api/request-headers.m | pass (1+1) | platform/dev/6.7/guides/development/integrations-api/requ... | 0 | 100 | partly | `raw/fs-wiki/dev-66.json` |
| dev-67 | What does a minimal app folder and `manifest.xml` need to contain, ... | Bash grep -rln 'manifest.xml' .claude/extras/Shopw | 2 (Bash, Read) | platform/dev/6.7/guides/plugins/apps/app-base-guide.md = target | pass (1+1) | platform/dev/6.7/guides/plugins/apps/app-base-guide.md:19-42 | 0 | 100 (under-reported 1) | pass | `raw/fs-wiki/dev-67.json` |
| dev-68 | How does the registration handshake between Shopware and my app bac... | Read path=.claude/extras/ShopwareDevKnowledgeBase/ | 1 (Read) | platform/dev/6.7/guides/plugins/apps/lifecycle/app-registration-setup. | pass (1+1) | platform/dev/6.7/guides/plugins/apps/lifecycle/app-regist... | 0 | 100 | pass | `raw/fs-wiki/dev-68.json` |
| dev-69 | How does an app subscribe to an event like `product.written`, what ... | Bash find .claude/extras/ShopwareDevKnowledgeBase/ | 2 (Bash, Read) | platform/dev/6.7/guides/plugins/apps/lifecycle/webhook.md = target | pass (1+1) | platform/dev/6.7/guides/plugins/apps/lifecycle/webhook.md... | 0 | 100 (under-reported 1) | pass | `raw/fs-wiki/dev-69.json` |
| dev-70 | How do I implement a payment method in an app with `pay-url` and `f... | Bash grep -rln 'pay-url|finalize-url|payment-metho | 2 (Bash, Read) | platform/dev/6.7/guides/plugins/apps/checkout/payment.md = target | pass (1+1) | platform/dev/6.7/guides/plugins/apps/checkout/payment.md:... | 0 | 100 (under-reported 1) | fail | `raw/fs-wiki/dev-70.json` |
| dev-71 | How does an app define its own custom entities in Shopware 6.7 and ... | Read path=.claude/extras/ShopwareDevKnowledgeBase/ | 3 (Read, Bash, Read) | platform/dev/6.7/guides/plugins/apps/custom-data/custom-entities.md =  | pass (1+1) | platform/dev/6.7/guides/plugins/apps/custom-data/custom-e... | 0 | 100 | fail | `raw/fs-wiki/dev-71.json` |
| func-01 | How do I create a product with variants and configure its visibilit... | Bash grep -rli "variant" .claude/extras/ShopwareDe | 8 (Bash, Bash, Read, Bash, Read, Bash, Read, Read) | platform/dev/6.7/concepts/commerce/catalog/sales-channels.md ≠ target | pass (1+1) | platform/func/catalogues/products.md:20-41 | 0 | 0 (under-reported 2) | fail | `raw/fs-wiki/func-01.json` |
| func-02 | How do Rule Builder conditions work for shipping and payment methods? | Read path=.claude/extras/ShopwareDevKnowledgeBase/ | 3 (Read, Bash, Read) | platform/func/settings/shipping.md ≠ target | pass (1+1) | platform/func/settings/rules.md:32-68 | 0 | 100 | partly | `raw/fs-wiki/func-02.json` |
| func-03 | How do promotions and discount codes work, including individually g... | Bash find .claude/extras/ShopwareDevKnowledgeBase/ | 2 (Bash, Read) | platform/func/marketing/promotions.md = target | pass (1+1) | platform/func/marketing/promotions.md:19-51 | 0 | 100 | pass | `raw/fs-wiki/func-03.json` |
| func-04 | What does the Shopware Migration Assistant transfer automatically f... | Read path=.claude/extras/ShopwareDevKnowledgeBase/ | 1 (Read) | platform/func/migration-en/what-is-migrated.md = target | pass (1+1) | platform/func/migration-en/what-is-migrated.md:35-64 | 0 | 100 | partly | `raw/fs-wiki/func-04.json` |
| func-05 | How do I set up a sales channel — storefront versus headless type, ... | Read path=.claude/extras/ShopwareDevKnowledgeBase/ | 1 (Read) | platform/func/settings/saleschannel.md = target | pass (1+1) | platform/func/settings/saleschannel.md:33-68 | 0 | 100 | partly | `raw/fs-wiki/func-05.json` |
| func-06 | Which triggers and actions does the Flow Builder offer, and how do ... | Bash find .claude/extras/ShopwareDevKnowledgeBase/ | 2 (Bash, Read) | platform/func/settings/Flow-Builder.md = target | pass (1+1) | platform/func/settings/Flow-Builder.md:19-52 | 0 | 100 | partly | `raw/fs-wiki/func-06.json` |
| func-07 | How do I import products from a CSV with an import/export profile —... | Read path=.claude/extras/ShopwareDevKnowledgeBase/ | 1 (Read) | platform/func/shopware-en/settings/importexport.md = target | pass (1+1) | platform/func/shopware-en/settings/importexport.md:34-79 | 0 | 100 | partly | `raw/fs-wiki/func-07.json` |
| func-08 | How do custom field sets work — entity assignment, field types and ... | Bash find .claude/extras/ShopwareDevKnowledgeBase/ | 2 (Bash, Read) | platform/func/settings/custom-fields.md = target | pass (1+1) | platform/func/settings/custom-fields.md:36-65 | 0 | 100 | partly | `raw/fs-wiki/func-08.json` |
| func-09 | Why doesn't my payment method appear in the checkout — what has to ... | Read path=.claude/extras/ShopwareDevKnowledgeBase/ | 1 (Read) | platform/func/settings/Paymentmethods.md = target | pass (1+1) | platform/func/settings/Paymentmethods.md:20-32 | 0 | 100 | pass | `raw/fs-wiki/func-09.json` |
| func-10 | How do dynamic product groups work in the administration and where ... | Read platform/index.md | 4 (Read, Bash, Bash, Read) | platform/func/shopware-6-de/Catalogues/Dynamicproductgroups.md = targe | pass (1+1) | platform/func/shopware-6-de/Catalogues/Dynamicproductgrou... | 0 | 100 | fail | `raw/fs-wiki/func-10.json` |
| func-11 | How do I create an integration for Admin API access in the administ... | Bash find .claude/extras/ShopwareDevKnowledgeBase/ | 2 (Bash, Read) | platform/func/settings/system/integrationen.md = target | pass (1+1) | platform/func/settings/system/integrationen.md:21-45 | 0 | 100 | partly | `raw/fs-wiki/func-11.json` |
| func-12 | A spec asks for customer-specific pricing and for a flow that calls... | Bash find .claude/extras/ShopwareDevKnowledgeBase/ | 5 (Bash, Bash, Read, Read, Read) | platform/func/features/webhook-actions-in-flow-builder.md ≠ target | fail (0+1) | platform/func/extensions/customer-specific-pricing.md:21-43 | 0 | 100 | fail | `raw/fs-wiki/func-12.json` |
| edge-01 | How do I configure Shopware 6's built-in GraphQL API for the Store ... | Bash grep -rln "GraphQL" .claude/extras/ShopwareDe | 5 (Bash, Bash, Bash, Bash, Read) | platform/dev/6.7/concepts/api/store-api.md ≠ target | n/a | platform/dev/6.7/concepts/api/store-api.md:14-30 | 0 | 100 | pass | `raw/fs-wiki/edge-01.json` |
| edge-02 | How do I get the DI container with `Shopware()->Container()` and ov... | Bash grep -rln "Smarty\|Shopware()->Container" .cl | 3 (Bash, Bash, Bash) | — | n/a | — | 1 | 100 | pass | `raw/fs-wiki/edge-02.json` |
| edge-03 | Where do the `#[ORM\Entity]` mapping attributes for my plugin's ent... | Bash grep -rln "Doctrine\|EntityManager" .claude/e | 2 (Bash, Read) | platform/dev/6.7/concepts/framework/data-abstraction-layer.md ≠ target | n/a | platform/dev/6.7/concepts/framework/data-abstraction-laye... | 0 | 100 | pass | `raw/fs-wiki/edge-03.json` |
| edge-04 | How do I fetch products with `GET /sales-channel-api/v3/product` on... | Bash grep -rln "sales-channel-api" .claude/extras/ | 3 (Bash, Bash, Read) | platform/dev/6.7/guides/plugins/plugins/framework/store-api/_index.md  | n/a | platform/dev/6.7/guides/plugins/plugins/framework/store-a... | 0 | 100 | partly | `raw/fs-wiki/edge-04.json` |
| edge-05 | How do I enable Shopware's built-in MCP server on a Shopware 6.6 shop? | Bash find .claude/extras/ShopwareDevKnowledgeBase/ | 3 (Bash, Read, Bash) | platform/dev/6.7/products/tools/mcp-server/getting-started.md ≠ target | n/a | platform/dev/6.7/products/tools/mcp-server/getting-starte... | 0 | 100 | pass | `raw/fs-wiki/edge-05.json` |
| edge-06 | I'm coming from Magento — what are the Shopware equivalents of stor... | Bash grep -rli "magento" .claude/extras/ShopwareDe | 3 (Bash, Read, Bash) | platform/func/migration-en/magento-keywords.md = target | n/a | platform/func/migration-en/magento-keywords.md:20-55 | 1 | 100 | partly | `raw/fs-wiki/edge-06.json` |
| edge-07 | How do I set up Shopware PWA as the storefront for a Shopware 6.7 s... | Bash grep -rli "shopware pwa\|shopware-pwa" .claud | 3 (Bash, Read, Bash) | platform/dev/6.6/products/pwa.md = target | n/a | platform/dev/6.6/products/pwa.md:15-25 | 0 | 100 | partly | `raw/fs-wiki/edge-07.json` |
| edge-08 | Which service do I type-hint to read products — `EntityRepositoryIn... | Read path=.claude/extras/ShopwareDevKnowledgeBase/ | 5 (Read, Bash, Bash, Read, Read) | platform/dev/6.7/guides/plugins/plugins/services/dependency-injection. | n/a | platform/dev/6.7/guides/plugins/plugins/framework/data-ha... | 0 | 100 | partly | `raw/fs-wiki/edge-08.json` |
| edge-09 | Where do I configure Business Events so that a mail is sent when an... | Bash grep -rln -i "business event" .claude/extras/ | 3 (Bash, Read, Bash) | platform/func/settings/Business-Events.md = target | n/a | platform/func/settings/Business-Events.md:21-43 | 0 | 70 | fail | `raw/fs-wiki/edge-09.json` |
| gap-01 | How do I add my own Admin API endpoint under `/api/...` from a plug... | Bash grep -rln -i "route scope" .claude/extras/Sho | 9 (Bash, Bash, Bash, Bash, Read, Read, Bash, Bash, Bash) | platform/dev/6.7/guides/plugins/plugins/administration/permissions-err | n/a | platform/dev/6.7/guides/plugins/plugins/framework/store-a... | 1 | 100 | partly | `raw/fs-wiki/gap-01.json` |
| gap-02 | Shopware 6.7 removed the RSA JWT key files and `system:generate-jwt... | Bash grep -rln -i "jwt" .claude/extras/ShopwareDev | 8 (Bash, Bash, Bash, Bash, Read, Bash, Bash, Bash) | platform/dev/6.7/products/tools/cli/project-commands/helper-commands.m | n/a | platform/dev/6.7/products/tools/cli/project-commands/help... | 0 | 100 (under-reported 2) | pass | `raw/fs-wiki/gap-02.json` |
| gap-03 | My ERP integration stopped logging in after the 6.7 upgrade — what ... | Bash grep -rln -i "oauth" .claude/extras/ShopwareD | 4 (Bash, Read, Bash, Read) | platform/dev/6.7/guides/development/integrations-api/_index.md ≠ targe | n/a | platform/dev/6.7/guides/development/integrations-api/_ind... | 0 | 100 | partly | `raw/fs-wiki/gap-03.json` |
| gap-04 | After upgrading to 6.7 my plugin fatals on load because core class ... | Bash grep -rln -i "native type|typed propert|prope | 4 (Bash, Bash, Read, Read) | platform/dev/6.7/guides/upgrades-migrations/_index.md ≠ target | n/a | platform/dev/6.7/guides/upgrades-migrations/_index.md:20-53 | 0 | 100 | pass | `raw/fs-wiki/gap-04.json` |
| gap-05 | My plugin decorates `CachedProductRoute` to add cache tags — where ... | Bash grep -rln -i "CachedProductRoute|Cached.*Rout | 4 (Bash, Bash, Read, Read) | platform/dev/6.7/guides/plugins/plugins/storefront/advanced/add-cachin | n/a | platform/dev/6.7/guides/plugins/plugins/framework/caching... | 0 | 100 | partly | `raw/fs-wiki/gap-05.json` |
| gap-06 | How do I create a shipping method from my plugin's installer or mig... | Bash grep -rln -i "shipping method|shipping_method | 7 (Bash, Bash, Bash, Read, Bash, Bash, Read) | platform/dev/6.7/guides/plugins/plugins/creating-plugins.md ≠ target | n/a | platform/dev/6.7/guides/plugins/plugins/creating-plugins.... | 2 | 100 | partly | `raw/fs-wiki/gap-06.json` |
| gap-07 | How do I create a media entity from a file on disk in PHP from my p... | Bash grep -rln -i "media.*thumbnail|MediaService|u | 5 (Bash, Bash, Read, Bash, Read) | platform/dev/6.7/products/extensions/migration-assistant/concept/media | n/a | platform/dev/6.7/guides/plugins/plugins/content/media/_in... | 0 | 100 | pass | `raw/fs-wiki/gap-07.json` |
| gap-08 | How do I set up a Nuxt project with Shopware Composable Frontends a... | Bash grep -rln -i "composable frontend|nuxt" .clau | 7 (Bash, Bash, Read, Bash, Bash, Bash, Read) | platform/dev/6.7/products/digital-sales-rooms/installation/app-install | n/a | platform/dev/6.7/products/digital-sales-rooms/installatio... | 1 | 100 (under-reported 1) | partly | `raw/fs-wiki/gap-08.json` |
## Scores by case

### fs-wiki

| Case | Grounding | Accuracy | Completeness | Citation | Honesty | Actionability | Points | Total | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dev-01 | 100 | 40 | 40 | 70 | 100 | 100 | 25+10+6+7+15+10 | 73% | partly |
| dev-02 | 100 | 40 | 0 | 0 | 100 | 70 | 25+10+0+0+15+7 | 57% | fail |
| dev-03 | 100 | 70 | 100 | 70 | 100 | 100 | 25+17.5+15+7+15+10 | 89% | pass |
| dev-04 | 100 | 40 | 40 | 0 | 100 | 70 | 25+10+6+0+15+7 | 63% | partly |
| dev-05 | 100 | 70 | 100 | 70 | 100 | 100 | 25+17.5+15+7+15+10 | 89% | pass |
| dev-06 | 100 | 40 | 70 | 70 | 100 | 100 | 25+10+10.5+7+15+10 | 77% | partly |
| dev-07 | 100 | 40 | 100 | 70 | 100 | 100 | 25+10+15+7+15+10 | 82% | partly |
| dev-08 | 100 | 70 | 100 | 70 | 100 | 100 | 25+17.5+15+7+15+10 | 89% | pass |
| dev-09 | 100 | 40 | 70 | 0 | 100 | 70 | 25+10+10.5+0+15+7 | 67% | partly |
| dev-10 | 100 | 40 | 70 | 70 | 100 | 70 | 25+10+10.5+7+15+7 | 74% | partly |
| dev-11 | 100 | 40 | 40 | 70 | 100 | 100 | 25+10+6+7+15+10 | 73% | partly |
| dev-12 | 100 | 70 | 40 | 0 | 70 | 70 | 25+17.5+6+0+10.5+7 | 66% | partly |
| dev-13 | 100 | 70 | 70 | 0 | 100 | 70 | 25+17.5+10.5+0+15+7 | 75% | partly |
| dev-14 | 100 | 100 | 100 | 70 | 100 | 100 | 25+25+15+7+15+10 | 97% | pass |
| dev-15 | 100 | 40 | 40 | 70 | 0 | 70 | 25+10+6+7+0+7 | 55% | fail |
| dev-16 | 100 | 70 | 40 | 0 | 100 | 70 | 25+17.5+6+0+15+7 | 70% | partly |
| dev-17 | 100 | 70 | 70 | 0 | 100 | 100 | 25+17.5+10.5+0+15+10 | 78% | partly |
| dev-18 | 100 | 70 | 70 | 70 | 100 | 70 | 25+17.5+10.5+7+15+7 | 82% | partly |
| dev-19 | 100 | 40 | 40 | 70 | 100 | 70 | 25+10+6+7+15+7 | 70% | partly |
| dev-20 | 100 | 70 | 100 | 70 | 100 | 100 | 25+17.5+15+7+15+10 | 89% | pass |
| dev-21 | 100 | 0 | 40 | 100 | 100 | 70 | 25+0+6+10+15+7 | 63% | partly |
| dev-22 | 100 | 40 | 40 | 0 | 100 | 70 | 25+10+6+0+15+7 | 63% | partly |
| dev-23 | 100 | 40 | 40 | 70 | 100 | 100 | 25+10+6+7+15+10 | 73% | partly |
| dev-24 | 100 | 40 | 70 | 0 | 100 | 70 | 25+10+10.5+0+15+7 | 67% | partly |
| dev-25 | 100 | 40 | 70 | 0 | 100 | 100 | 25+10+10.5+0+15+10 | 70% | partly |
| dev-26 | 100 | 40 | 70 | 100 | 100 | 100 | 25+10+10.5+10+15+10 | 80% | partly |
| dev-27 | 100 | 100 | 100 | 0 | 100 | 100 | 25+25+15+0+15+10 | 90% | pass |
| dev-28 | 100 | 70 | 70 | 0 | 100 | 100 | 25+17.5+10.5+0+15+10 | 78% | partly |
| dev-29 | 100 | 40 | 70 | 0 | 100 | 100 | 25+10+10.5+0+15+10 | 70% | partly |
| dev-30 | 100 | 100 | 100 | 0 | 100 | 100 | 25+25+15+0+15+10 | 90% | pass |
| dev-31 | 70 | 40 | 40 | 100 | 100 | 70 | 17.5+10+6+10+15+7 | 65% | partly |
| dev-32 | 100 | 40 | 40 | 100 | 100 | 40 | 25+10+6+10+15+4 | 70% | partly |
| dev-33 | 100 | 40 | 40 | 100 | 100 | 70 | 25+10+6+10+15+7 | 73% | partly |
| dev-34 | 100 | 40 | 100 | 100 | 100 | 70 | 25+10+15+10+15+7 | 82% | partly |
| dev-35 | 100 | 70 | 70 | 100 | 0 | 100 | 25+17.5+10.5+10+0+10 | 73% | partly |
| dev-36 | 100 | 40 | 70 | 100 | 100 | 100 | 25+10+10.5+10+15+10 | 80% | partly |
| dev-37 | 70 | 40 | 70 | 40 | 70 | 70 | 17.5+10+10.5+4+10.5+7 | 59% | fail |
| dev-38 | 70 | 40 | 70 | 100 | 70 | 100 | 17.5+10+10.5+10+10.5+10 | 68% | partly |
| dev-39 | 70 | 0 | 0 | 100 | 100 | 40 | 17.5+0+0+10+15+4 | 46% | fail |
| dev-40 | 100 | 40 | 40 | 100 | 100 | 100 | 25+10+6+10+15+10 | 76% | partly |
| dev-41 | 100 | 40 | 40 | 0 | 100 | 70 | 25+10+6+0+15+7 | 63% | partly |
| dev-42 | 100 | 100 | 100 | 100 | 100 | 100 | 25+25+15+10+15+10 | 100% | pass |
| dev-43 | 70 | 0 | 40 | 0 | 100 | 40 | 17.5+0+6+0+15+4 | 42% | fail |
| dev-44 | 100 | 40 | 70 | 0 | 100 | 100 | 25+10+10.5+0+15+10 | 70% | partly |
| dev-45 | 100 | 70 | 70 | 0 | 100 | 100 | 25+17.5+10.5+0+15+10 | 78% | partly |
| dev-46 | 100 | 40 | 40 | 100 | 100 | 40 | 25+10+6+10+15+4 | 70% | partly |
| dev-47 | 100 | 100 | 100 | 100 | 100 | 100 | 25+25+15+10+15+10 | 100% | pass |
| dev-48 | 100 | 100 | 100 | 0 | 100 | 100 | 25+25+15+0+15+10 | 90% | pass |
| dev-49 | 100 | 40 | 70 | 0 | 100 | 100 | 25+10+10.5+0+15+10 | 70% | partly |
| dev-50 | 100 | 70 | 70 | 0 | 100 | 100 | 25+17.5+10.5+0+15+10 | 78% | partly |
| dev-51 | 100 | 40 | 70 | 0 | 100 | 100 | 25+10+10.5+0+15+10 | 70% | partly |
| dev-52 | 100 | 70 | 70 | 0 | 100 | 100 | 25+17.5+10.5+0+15+10 | 78% | partly |
| dev-53 | 100 | 40 | 70 | 0 | 100 | 100 | 25+10+10.5+0+15+10 | 70% | partly |
| dev-54 | 100 | 70 | 100 | 0 | 100 | 100 | 25+17.5+15+0+15+10 | 82% | partly |
| dev-55 | 70 | 40 | 0 | 0 | 100 | 40 | 17.5+10+0+0+15+4 | 46% | fail |
| dev-56 | 100 | 70 | 70 | 0 | 100 | 100 | 25+17.5+10.5+0+15+10 | 78% | partly |
| dev-57 | 100 | 100 | 100 | 0 | 100 | 100 | 25+25+15+0+15+10 | 90% | pass |
| dev-58 | 100 | 70 | 70 | 0 | 100 | 100 | 25+17.5+10.5+0+15+10 | 78% | partly |
| dev-59 | 70 | 40 | 40 | 0 | 100 | 40 | 17.5+10+6+0+15+4 | 52% | fail |
| dev-60 | 70 | 40 | 40 | 100 | 100 | 40 | 17.5+10+6+10+15+4 | 62% | partly |
| dev-61 | 70 | 40 | 40 | 100 | 100 | 70 | 17.5+10+6+10+15+7 | 65% | partly |
| dev-62 | 70 | 70 | 70 | 40 | 100 | 70 | 17.5+17.5+10.5+4+15+7 | 71% | partly |
| dev-63 | 70 | 40 | 40 | 100 | 100 | 70 | 17.5+10+6+10+15+7 | 65% | partly |
| dev-64 | 100 | 40 | 40 | 40 | 100 | 70 | 25+10+6+4+15+7 | 67% | partly |
| dev-65 | 70 | 40 | 40 | 100 | 100 | 70 | 17.5+10+6+10+15+7 | 65% | partly |
| dev-66 | 70 | 40 | 40 | 100 | 100 | 70 | 17.5+10+6+10+15+7 | 65% | partly |
| dev-67 | 100 | 70 | 100 | 100 | 100 | 100 | 25+17.5+15+10+15+10 | 92% | pass |
| dev-68 | 100 | 70 | 100 | 100 | 100 | 100 | 25+17.5+15+10+15+10 | 92% | pass |
| dev-69 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| dev-70 | 70 | 40 | 0 | 100 | 100 | 40 | 17.5+10+0+10+15+4 | 56% | fail |
| dev-71 | 70 | 40 | 40 | 0 | 100 | 70 | 17.5+10+6+0+15+7 | 55% | fail |
| func-01 | 100 | 40 | 40 | 100 | 0 | 70 | 25+10+6+10+0+7 | 58% | fail |
| func-02 | 100 | 70 | 40 | 100 | 100 | 70 | 25+17.5+6+10+15+7 | 80% | partly |
| func-03 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| func-04 | 70 | 40 | 70 | 100 | 100 | 70 | 17.5+10+10.5+10+15+7 | 70% | partly |
| func-05 | 100 | 70 | 40 | 100 | 100 | 70 | 25+17.5+6+10+15+7 | 80% | partly |
| func-06 | 100 | 40 | 40 | 100 | 100 | 70 | 25+10+6+10+15+7 | 73% | partly |
| func-07 | 100 | 40 | 70 | 100 | 100 | 100 | 25+10+10.5+10+15+10 | 80% | partly |
| func-08 | 100 | 40 | 40 | 100 | 100 | 70 | 25+10+6+10+15+7 | 73% | partly |
| func-09 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| func-10 | 70 | 40 | 40 | 0 | 100 | 70 | 17.5+10+6+0+15+7 | 55% | fail |
| func-11 | 100 | 70 | 70 | 0 | 100 | 100 | 25+17.5+10.5+0+15+10 | 78% | partly |
| func-12 | 100 | 0 | 0 | 40 | 100 | 40 | 25+0+0+4+15+4 | 48% | fail |
| edge-01 | 100 | 100 | 100 | 0 | 100 | 100 | 25+25+15+0+15+10 | 90% | pass |
| edge-02 | 100 | 100 | 100 | 100 | 100 | 100 | 25+25+15+10+15+10 | 100% | pass |
| edge-03 | 100 | 100 | 70 | 100 | 100 | 100 | 25+25+10.5+10+15+10 | 95% | pass |
| edge-04 | 100 | 40 | 40 | 100 | 100 | 40 | 25+10+6+10+15+4 | 70% | partly |
| edge-05 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| edge-06 | 100 | 40 | 70 | 100 | 100 | 70 | 25+10+10.5+10+15+7 | 77% | partly |
| edge-07 | 100 | 70 | 70 | 70 | 100 | 70 | 25+17.5+10.5+7+15+7 | 82% | partly |
| edge-08 | 100 | 70 | 40 | 0 | 100 | 70 | 25+17.5+6+0+15+7 | 70% | partly |
| edge-09 | 0 | 0 | 0 | 0 | 70 | 40 | 0+0+0+0+10.5+4 | 14% | fail |
| gap-01 | 100 | 40 | 40 | 40 | 100 | 70 | 25+10+6+4+15+7 | 67% | partly |
| gap-02 | 100 | 100 | 100 | 40 | 100 | 100 | 25+25+15+4+15+10 | 94% | pass |
| gap-03 | 100 | 100 | 70 | 0 | 100 | 70 | 25+25+10.5+0+15+7 | 82% | partly |
| gap-04 | 100 | 100 | 70 | 100 | 100 | 70 | 25+25+10.5+10+15+7 | 92% | pass |
| gap-05 | 100 | 40 | 70 | 40 | 100 | 40 | 25+10+10.5+4+15+4 | 68% | partly |
| gap-06 | 100 | 70 | 70 | 40 | 100 | 70 | 25+17.5+10.5+4+15+7 | 79% | partly |
| gap-07 | 100 | 100 | 100 | 0 | 100 | 100 | 25+25+15+0+15+10 | 90% | pass |
| gap-08 | 100 | 40 | 70 | 0 | 100 | 40 | 25+10+10.5+0+15+4 | 64% | partly |

`unavailable` means the Source-absent override applied — none in this run.
## Failures and official references

- **dev-01 (fs-wiki)** — partly, 73%
- **dev-02 (fs-wiki)** — fail, 57%
- **dev-04 (fs-wiki)** — partly, 63%
- **dev-06 (fs-wiki)** — partly, 77%
- **dev-07 (fs-wiki)** — partly, 82%
- **dev-09 (fs-wiki)** — partly, 67%
- **dev-10 (fs-wiki)** — partly, 74%
- **dev-11 (fs-wiki)** — partly, 73%
- **dev-12 (fs-wiki)** — partly, 66%
- **dev-13 (fs-wiki)** — partly, 75%
- **dev-15 (fs-wiki)** — fail, 55%
- **dev-16 (fs-wiki)** — partly, 70%
- **dev-17 (fs-wiki)** — partly, 78%
- **dev-18 (fs-wiki)** — partly, 82%
- **dev-19 (fs-wiki)** — partly, 70%
- **dev-21 (fs-wiki)** — partly, 63%
- **dev-22 (fs-wiki)** — partly, 63%
- **dev-23 (fs-wiki)** — partly, 73%
- **dev-24 (fs-wiki)** — partly, 67%
- **dev-25 (fs-wiki)** — partly, 70%
- **dev-26 (fs-wiki)** — partly, 80%
- **dev-28 (fs-wiki)** — partly, 78%
- **dev-29 (fs-wiki)** — partly, 70%
- **dev-31 (fs-wiki)** — partly, 65%
- **dev-32 (fs-wiki)** — partly, 70%
- **dev-33 (fs-wiki)** — partly, 73%
- **dev-34 (fs-wiki)** — partly, 82%
- **dev-35 (fs-wiki)** — partly, 73%
- **dev-36 (fs-wiki)** — partly, 80%
- **dev-37 (fs-wiki)** — fail, 59%
- **dev-38 (fs-wiki)** — partly, 68%
- **dev-39 (fs-wiki)** — fail, 46%
- **dev-40 (fs-wiki)** — partly, 76%
- **dev-41 (fs-wiki)** — partly, 63%
- **dev-43 (fs-wiki)** — fail, 42%
- **dev-44 (fs-wiki)** — partly, 70%
- **dev-45 (fs-wiki)** — partly, 78%
- **dev-46 (fs-wiki)** — partly, 70%
- **dev-49 (fs-wiki)** — partly, 70%
- **dev-50 (fs-wiki)** — partly, 78%
- **dev-51 (fs-wiki)** — partly, 70%
  - Official: [code: Framework/DataAbstractionLayer/Attribute/Entity.php:10-32]
  - Official: [code: System/CustomEntity/CustomEntityLifecycleService.php:164-179]
  - Official: [code: Migration/V6_7/Migration1742199549MeasurementSystemTable.php:32-42]
- **dev-52 (fs-wiki)** — partly, 78%
- **dev-53 (fs-wiki)** — partly, 70%
  - Official: [code: shopware/storefront Theme/ThemeConfigField.php:14-19]
  - Official: [code: shopware/storefront Theme/ThemeConfigFieldFactory.php:17-20]
  - Official: [code: shopware/storefront Theme/ThemeMergedConfigBuilder.php:152-169,247-250]
- **dev-54 (fs-wiki)** — partly, 82%
- **dev-55 (fs-wiki)** — fail, 46%
  - Official: [code: Framework/Resources/config/packages/feature.yaml:24-28]
  - Official: [code: Framework/Adapter/Twig/TokenParser/ExtendsTokenParser.php:42-63]
- **dev-56 (fs-wiki)** — partly, 78%
- **dev-58 (fs-wiki)** — partly, 78%
- **dev-59 (fs-wiki)** — fail, 52%
  - Official: [code: Framework/DependencyInjection/Configuration.php:1378-1412]
  - Official: [code: Framework/Adapter/Cache/ReverseProxy/VarnishReverseProxyGateway.php:50-56,81-84,115-123]
- **dev-60 (fs-wiki)** — partly, 62%
  - Official: [code: symfony/messenger EventListener/SendFailedMessageToFailureTransportListener.php:37-74]
  - Official: [code: Framework/Resources/config/packages/shopware.yaml:385-392]
- **dev-61 (fs-wiki)** — partly, 65%
  - Official: [code: shopware/shopware@v6.7.13.0 src/Elasticsearch/Resources/config/packages/elasticsearch.yaml]
- **dev-62 (fs-wiki)** — partly, 71%
- **dev-63 (fs-wiki)** — partly, 65%
  - Official: [code: Framework/Migration/Command/MigrationCommand.php:121-129]
  - Official: [code: Framework/Bundle.php:131-143]
  - Official: [code: Framework/Plugin/PluginService.php:100-114]
- **dev-64 (fs-wiki)** — partly, 67%
  - Official: [code: Framework/Api/EventListener/Authentication/ApiAuthenticationListener.php:47]
  - Official: [code: vendor/league/oauth2-server/src/Grant/ClientCredentialsGrant.php:50]
- **dev-65 (fs-wiki)** — partly, 65%
  - Official: [code: Framework/DataAbstractionLayer/Dbal/EntitySearcher.php:191,203]
- **dev-66 (fs-wiki)** — partly, 65%
  - Official: [code: Framework/Routing/ApiRequestContextResolver.php:68,95,124]
- **dev-70 (fs-wiki)** — fail, 56%
  - Official: [code: System/StateMachine/Aggregation/StateMachineTransition/StateMachineTransitionActions.php:10-31]
  - Official: [code: Framework/App/Payment/Handler/AppPaymentHandler.php:236-259]
- **dev-71 (fs-wiki)** — fail, 55%
  - Official: [code: Framework/DataAbstractionLayer/Field/Flag/ApiAware.php:13-16,34-45]
  - Official: [code: Framework/Script/Api/ScriptStoreApiRoute.php:36]
- **func-01 (fs-wiki)** — fail, 58%
- **func-02 (fs-wiki)** — partly, 80%
- **func-04 (fs-wiki)** — partly, 70%
  - Official: [code: SwagMigrationAssistant@6.6.x src/Profile/Shopware/DataSelection/CustomerAndOrderDataSelection.php]
  - Official: [code: SwagMigrationAssistant@6.6.x src/Profile/Shopware/Premapping/PaymentMethodReader.php]
- **func-05 (fs-wiki)** — partly, 80%
- **func-06 (fs-wiki)** — partly, 73%
- **func-07 (fs-wiki)** — partly, 80%
- **func-08 (fs-wiki)** — partly, 73%
- **func-10 (fs-wiki)** — fail, 55%
- **func-11 (fs-wiki)** — partly, 78%
- **func-12 (fs-wiki)** — fail, 48%
- **edge-04 (fs-wiki)** — partly, 70%
- **edge-06 (fs-wiki)** — partly, 77%
- **edge-07 (fs-wiki)** — partly, 82%
- **edge-08 (fs-wiki)** — partly, 70%
- **edge-09 (fs-wiki)** — fail, 14%
- **gap-01 (fs-wiki)** — partly, 67%
- **gap-03 (fs-wiki)** — partly, 82%
- **gap-05 (fs-wiki)** — partly, 68%
- **gap-06 (fs-wiki)** — partly, 79%
- **gap-08 (fs-wiki)** — partly, 64%
## Accuracy cross-checks

| Option | Flagged | Fetched | Served from cache | Bands changed | Fetch failures |
| --- | --- | --- | --- | --- | --- |
| fs-wiki | 13 of 100 | 0 | 0 | 0 | none |

All 13 flagged cases carry `Status: confirmed` — verified against the Shopware source with `[code: …]` evidence tags in their expected-answer files. Per the rubric, a confirmed case's own code evidence is the stronger yardstick and no documentation fetch was performed; the accuracy pass settled each against that evidence.

No band changed — every flagged case held its provisional accuracy.

## Observations about source availability

No case in this run hit the Source-absent override — the wiki corpus and its `platform/index.md` entry point were present throughout, and every `dev`/`func` case has a wiki target page. All 9 `edge-*` and 8 `gap-*` cases were scored under the ordinary not-found/gap bands, not the override.

Gap cases confirmed as real documentation gaps (passed honestly, no page covers them): gap-02, gap-04, gap-07.

Edge (trap) cases the option correctly resisted: edge-01, edge-02, edge-03, edge-05.

## Recommended fixes

- Citation range verification: 39 of 100 cases scored Citation 0 because the audit's `rangeExists` check failed even where the cited file and content were genuinely read (e.g. dev-02, dev-04, dev-09, dev-12, dev-13, dev-16, …) — the excerpt-vs-claimed-range checker in the auditor appears to systematically fail to verify otherwise-correct wiki citations; investigate the audit's line-range matching against the wiki's YAML-frontmatter-prefixed pages before trusting Citation scores at face value.
- Wiki content traps reproduced verbatim by the discover agent: dev-01, dev-07, dev-21, dev-22, dev-23, dev-25, dev-26, dev-37, dev-39, dev-40, dev-43, dev-51, dev-53, dev-55, dev-59, dev-60, dev-61, dev-63, dev-65, dev-66, dev-70, dev-71, func-01, func-04, func-12, edge-09 — each of these hits a documented wiki defect (stale/incorrect content) recorded in `cases.md`'s "Known documentation defects" section or the case's own expected-answer trap note; fixing the underlying wiki pages (not the discovery mechanism) would raise Accuracy on all of them.
## Borderline re-scores

Sixteen cases landed within ±2 of a verdict boundary on the first pass (58–62 or 83–87) and were independently re-scored by a fresh scorer; the lower band was taken per dimension and totals recomputed.

| Case | Option | Dimension | First | Second | Taken |
| --- | --- | --- | --- | --- | --- |
| dev-02 | fs-wiki | accuracy | 70 | 40 | 70 |
| dev-02 | fs-wiki | completeness | 70 | 0 | 70 |
| dev-02 | fs-wiki | citation | 70 | 0 | 70 |
| dev-02 | fs-wiki | actionability | 100 | 70 | 100 |
| dev-04 | fs-wiki | accuracy | 70 | 40 | 70 |
| dev-04 | fs-wiki | completeness | 70 | 40 | 70 |
| dev-04 | fs-wiki | citation | 70 | 0 | 70 |
| dev-04 | fs-wiki | actionability | 100 | 70 | 100 |
| dev-09 | fs-wiki | accuracy | 70 | 40 | 70 |
| dev-09 | fs-wiki | citation | 70 | 0 | 70 |
| dev-09 | fs-wiki | actionability | 100 | 70 | 100 |
| dev-12 | fs-wiki | completeness | 70 | 40 | 70 |
| dev-12 | fs-wiki | citation | 70 | 0 | 70 |
| dev-12 | fs-wiki | honesty | 100 | 70 | 100 |
| dev-12 | fs-wiki | actionability | 100 | 70 | 100 |
| dev-13 | fs-wiki | citation | 70 | 0 | 70 |
| dev-13 | fs-wiki | actionability | 100 | 70 | 100 |
| dev-16 | fs-wiki | completeness | 70 | 40 | 70 |
| dev-16 | fs-wiki | citation | 70 | 0 | 70 |
| dev-16 | fs-wiki | actionability | 100 | 70 | 100 |
| dev-17 | fs-wiki | citation | 70 | 0 | 70 |
| dev-22 | fs-wiki | accuracy | 70 | 40 | 70 |
| dev-22 | fs-wiki | completeness | 70 | 40 | 70 |
| dev-22 | fs-wiki | citation | 70 | 0 | 70 |
| dev-22 | fs-wiki | actionability | 100 | 70 | 100 |
| dev-24 | fs-wiki | accuracy | 70 | 40 | 70 |
| dev-24 | fs-wiki | citation | 70 | 0 | 70 |
| dev-24 | fs-wiki | actionability | 100 | 70 | 100 |
| dev-25 | fs-wiki | accuracy | 70 | 40 | 70 |
| dev-25 | fs-wiki | citation | 70 | 0 | 70 |
| dev-28 | fs-wiki | accuracy | 100 | 70 | 100 |
| dev-37 | fs-wiki | groundingRelevance | 70 | 100 | 70 |
| dev-37 | fs-wiki | citation | 40 | 100 | 40 |
| dev-37 | fs-wiki | honesty | 70 | 100 | 70 |
| dev-37 | fs-wiki | actionability | 100 | 70 | 100 |
| dev-40 | fs-wiki | completeness | 100 | 40 | 100 |
| dev-60 | fs-wiki | groundingRelevance | 70 | 100 | 70 |
| dev-60 | fs-wiki | actionability | 40 | 70 | 40 |
| func-01 | fs-wiki | accuracy | 70 | 40 | 70 |
| func-01 | fs-wiki | completeness | 70 | 40 | 70 |
| func-01 | fs-wiki | honesty | 100 | 0 | 100 |
| edge-07 | fs-wiki | accuracy | 70 | 100 | 70 |
| edge-07 | fs-wiki | citation | 100 | 70 | 100 |

| Case | Total before → after | Verdict before → after |
| --- | --- | --- |
| dev-02 | 85% → 57% | pass/partly → fail |
| dev-04 | 85% → 63% | pass/partly → partly |
| dev-09 | 85% → 67% | pass/partly → partly |
| dev-12 | 85% → 66% | pass/partly → partly |
| dev-13 | 85% → 75% | pass/partly → partly |
| dev-16 | 85% → 70% | pass/partly → partly |
| dev-17 | 85% → 78% | pass/partly → partly |
| dev-22 | 85% → 63% | pass/partly → partly |
| dev-24 | 85% → 67% | pass/partly → partly |
| dev-25 | 85% → 70% | pass/partly → partly |
| dev-28 | 85% → 78% | pass/partly → partly |
| dev-37 | 62% → 59% | pass/partly → fail |
| dev-40 | 85% → 76% | pass/partly → partly |
| dev-60 | 62% → 62% | pass/partly → partly |
| func-01 | 85% → 58% | pass/partly → fail |
| edge-07 | 85% → 82% | pass/partly → partly |
## Scorer discrepancies

None.

## Audit warnings

- Access-cost aggregates exclude ['dev-11', 'dev-12', 'dev-31', 'dev-32', 'dev-45', 'dev-46']: ground-truth call-log extractor mis-stamped a target-file Read across each pair (dev-11/12, dev-31/32, dev-45/46), corrupting both donor and recipient counts.
