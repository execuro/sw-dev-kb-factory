# KB quality report — fs-wiki-2026-09-13-0802

## Run

| | |
| --- | --- |
| Run | `fs-wiki-2026-09-13-0802` (`fs-wiki`) |
| Options | fs-wiki |
| Corpus | wiki — fingerprint: `lastBuilt 2026-09-07`, `treeHash 836a72be5d89…`, 1569 pages |
| Probe | wiki/platform/index.md present; manifest.json read for fingerprint |
| Model | inherited (not pinned) |
| Generated | 2026-09-13T11:26:36Z |
| Cases run | 100 of 100 (`all`) |
| Yardstick | `cases.md ef932d8e`, `scoring-rubric.md 54864fb4`, `scorer-brief.md 1456b9ec`, `auditor-brief.md 4c2c6fdc`, `accuracy-brief.md 9009d748` |
| Execution | discover batches of 10, scorer shards of 25 (`batched`) |
| Skill | `kb-factory-verify` |

## Run cost

| Option | Agents | Tokens | Tool calls | Summed agent time | Usage complete |
| --- | --- | --- | --- | --- | --- |
| fs-wiki | 17 (10 discover, 1 audit, 4 score, 1 accuracy, 1 rescore) | 27,341,639 | 535 | 3899s | no — the 4 scoring-shard agents wrote their files successfully but hit the account rate limit before returning a usage block, so their tokens/tool-calls/time are not included above |

Wall-clock duration of the run: 12240s.

## Comparison

The headline table — one row per option, straight from `options.<option>` (no new computation).

| Option | Access | Corpus | Overall | Status | Developer | Functional | Findable | Edge passed | Gap confirmed | Pass / partly / fail / unavailable / unscored | Weakest dimension |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| fs-wiki | fs | wiki | 77% | Not ready | 77% | 71% | 60 of 82 | 5 of 9 | 1 of 8 | 35 / 54 / 11 / 0 / 0 | accuracy |

Only one option ran in this session (`fs-wiki`); no `mcp − fs` or `wiki − docs` delta is computable without a second option in the same run. Run `mcp-wiki` and then `compare` to get the wiki access-method delta.

## Dimension heatmap

| Dimension | Weight | fs-wiki |
| --- | --- | --- |
| Grounding & Relevance | 25 | 94.8 |
| Accuracy vs. Expected Answer | 25 | 53.7 |
| Completeness | 15 | 66.3 |
| Citation & Traceability | 10 | 95.0 |
| Honesty | 15 | 84.0 |
| Actionability | 10 | 80.1 |

Average band score, `unscored` cases excluded (none were unscored in this run).

| Area | Cases | fs-wiki average |
| --- | --- | --- |
| Payment & Shipping | 1 | 100% |
| Platform upgrade | 2 | 94% |
| Plugin fundamentals | 1 | 88% |
| Content | 1 | 88% |
| Orders | 2 | 86% |
| App system | 5 | 83% |
| Administration | 4 | 82% |
| Trap | 9 | 81% |
| Storefront | 9 | 81% |
| Checkout & Cart | 2 | 79% |
| Admin API | 3 | 79% |
| Config & CLI | 5 | 78% |
| Services & DI | 3 | 78% |
| Core breaking changes | 3 | 78% |
| Store API & headless | 1 | 77% |
| Theme | 2 | 77% |
| Gap | 8 | 77% |
| Content (CMS/mail/SEO/media/sitemap) | 2 | 76% |
| Events | 6 | 74% |
| DAL | 7 | 72% |
| Merchant | 12 | 71% |
| Admin migration (Vue 3 / Vite / Pinia / Meteor) | 4 | 69% |
| Hosting & ops | 5 | 69% |
| Testing | 3 | 61% |

## Verdict grid

| Case | Category | Area | fs-wiki |
| --- | --- | --- | --- |
| dev-01 | dev | DAL | 24% fail ✗ |
| dev-02 | dev | Plugin fundamentals | 88% pass ✓ |
| dev-03 | dev | Store API & headless | 77% partly ✓ |
| dev-04 | dev | Content | 88% pass ✗ |
| dev-05 | dev | Theme | 77% partly ✓ |
| dev-06 | dev | Events | 77% partly ✗ |
| dev-07 | dev | DAL | 67% partly ✗ |
| dev-08 | dev | DAL | 65% partly ✓ |
| dev-09 | dev | DAL | 88% pass ✗ |
| dev-10 | dev | DAL | 92% pass ✗ |
| dev-11 | dev | Services & DI | 80% partly ✓ |
| dev-12 | dev | Services & DI | 88% pass ✓ |
| dev-13 | dev | Services & DI | 65% partly ✓ |
| dev-14 | dev | Events | 100% pass ✗ |
| dev-15 | dev | Events | 44% fail ✗ |
| dev-16 | dev | Orders | 92% pass ✓ |
| dev-17 | dev | Checkout & Cart | 88% pass ✓ |
| dev-18 | dev | Checkout & Cart | 70% partly ✓ |
| dev-19 | dev | Events | 77% partly ✓ |
| dev-20 | dev | Events | 92% pass ✓ |
| dev-21 | dev | Events | 54% fail ✓ |
| dev-22 | dev | Config & CLI | 85% pass ✓ |
| dev-23 | dev | Content (CMS/mail/SEO/media/sitemap) | 73% partly ✓ |
| dev-24 | dev | Content (CMS/mail/SEO/media/sitemap) | 80% partly ✓ |
| dev-25 | dev | Config & CLI | 88% pass ✓ |
| dev-26 | dev | Orders | 80% partly ✓ |
| dev-27 | dev | Storefront | 100% pass ✓ |
| dev-28 | dev | Storefront | 88% pass ✓ |
| dev-29 | dev | Storefront | 73% partly ✓ |
| dev-30 | dev | Storefront | 73% partly ✗ |
| dev-31 | dev | Storefront | 76% partly ✗ |
| dev-32 | dev | DAL | 88% pass ✗ |
| dev-33 | dev | Administration | 73% partly ✗ |
| dev-34 | dev | Administration | 80% partly ✗ |
| dev-35 | dev | Administration | 80% partly ✗ |
| dev-36 | dev | Administration | 95% pass ✗ |
| dev-37 | dev | Testing | 65% partly ✗ |
| dev-38 | dev | Testing | 73% partly ✗ |
| dev-39 | dev | Testing | 46% fail ✗ |
| dev-40 | dev | Platform upgrade | 88% pass ✗ |
| dev-41 | dev | Hosting & ops | 73% partly ✗ |
| dev-42 | dev | Config & CLI | 88% pass ✓ |
| dev-43 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 80% partly ✓ |
| dev-44 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 63% partly ✓ |
| dev-45 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 70% partly ✓ |
| dev-46 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 62% partly ✓ |
| dev-47 | dev | Payment & Shipping | 100% pass ✓ |
| dev-48 | dev | Storefront | 95% pass ✓ |
| dev-49 | dev | Core breaking changes | 80% partly ✓ |
| dev-50 | dev | Core breaking changes | 88% pass ✓ |
| dev-51 | dev | DAL | 77% partly ✓ |
| dev-52 | dev | Core breaking changes | 65% partly ✓ |
| dev-53 | dev | Theme | 77% partly ✓ |
| dev-54 | dev | Storefront | 92% pass ✓ |
| dev-55 | dev | Storefront | 42% fail ✓ |
| dev-56 | dev | Storefront | 92% pass ✓ |
| dev-57 | dev | Platform upgrade | 100% pass ✓ |
| dev-58 | dev | Hosting & ops | 88% pass ✓ |
| dev-59 | dev | Hosting & ops | 74% partly ✓ |
| dev-60 | dev | Hosting & ops | 31% fail ✓ |
| dev-61 | dev | Hosting & ops | 77% partly ✓ |
| dev-62 | dev | Config & CLI | 55% fail ✓ |
| dev-63 | dev | Config & CLI | 73% partly ✓ |
| dev-64 | dev | Admin API | 77% partly ✓ |
| dev-65 | dev | Admin API | 82% partly ✓ |
| dev-66 | dev | Admin API | 77% partly ✓ |
| dev-67 | dev | App system | 92% pass ✓ |
| dev-68 | dev | App system | 92% pass ✓ |
| dev-69 | dev | App system | 88% pass ✓ |
| dev-70 | dev | App system | 70% partly ✓ |
| dev-71 | dev | App system | 74% partly ✓ |
| func-01 | func | Merchant | 62% partly ✗ |
| func-02 | func | Merchant | 73% partly ✓ |
| func-03 | func | Merchant | 92% pass ✓ |
| func-04 | func | Merchant | 70% partly ✓ |
| func-05 | func | Merchant | 73% partly ✓ |
| func-06 | func | Merchant | 77% partly ✓ |
| func-07 | func | Merchant | 74% partly ✓ |
| func-08 | func | Merchant | 73% partly ✓ |
| func-09 | func | Merchant | 35% fail ✗ |
| func-10 | func | Merchant | 73% partly ✓ |
| func-11 | func | Merchant | 100% pass ✓ |
| func-12 | func | Merchant | 52% fail – |
| edge-01 | edge | Trap | 100% pass – |
| edge-02 | edge | Trap | 79% partly – |
| edge-03 | edge | Trap | 100% pass – |
| edge-04 | edge | Trap | 100% pass – |
| edge-05 | edge | Trap | 88% pass – |
| edge-06 | edge | Trap | 52% fail – |
| edge-07 | edge | Trap | 85% pass – |
| edge-08 | edge | Trap | 77% partly – |
| edge-09 | edge | Trap | 52% fail – |
| gap-01 | gap | Gap | 62% partly – |
| gap-02 | gap | Gap | 82% partly – |
| gap-03 | gap | Gap | 70% partly – |
| gap-04 | gap | Gap | 82% partly – |
| gap-05 | gap | Gap | 77% partly – |
| gap-06 | gap | Gap | 77% partly – |
| gap-07 | gap | Gap | 70% partly – |
| gap-08 | gap | Gap | 95% pass – |
## Requests and responses

What each discover agent was given and what it reported, straight from `raw/fs-wiki/<case-id>.json` and the mechanical facts in `derived/fs-wiki/shard-*.json` — no scores, no judgement. One table per option, one row per case.

### fs-wiki

| Case | Query | Entry point used | Tool calls made | Page reached | Findability | Top citation | Memory claims | Verdict | Raw |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dev-01 | `How do I extend the product entity with a new associat…` | Read platform/index.md | 5 | platform/dev/6.7/guides/plugi… ≠ target | fail (3+0) | platform/dev/6.7/guides/plugins/pl… | 1 | fail | `raw/fs-wiki/dev-01.json` |
| dev-02 | `What's the plugin lifecycle in Shopware — install, act…` | warm (reused from batch) | 2 | platform/dev/6.7/guides/plugins/pl… = target | pass (1+1) | platform/dev/6.7/guides/plugins/pl… | 0 | pass | `raw/fs-wiki/dev-02.json` |
| dev-03 | `How do I add a custom Store API route for a headless s…` | warm (reused from batch) | 2 | platform/dev/6.7/guides/plugins/pl… = target | pass (1+1) | platform/dev/6.7/guides/plugins/pl… | 0 | partly | `raw/fs-wiki/dev-03.json` |
| dev-04 | `How do I create a custom CMS element for Shopping Expe…` | warm (reused from batch) | 2 | platform/dev/6.7/guides/plugins/pl… = target | fail (0+0) | platform/dev/6.7/guides/plugins/pl… | 0 | pass | `raw/fs-wiki/dev-04.json` |
| dev-05 | `How does theme inheritance work in Shopware — theme.js…` | warm (reused from batch) | 2 | platform/dev/6.7/guides/plugins/th… = target | pass (1+1) | platform/dev/6.7/guides/plugins/th… | 0 | partly | `raw/fs-wiki/dev-05.json` |
| dev-06 | `How do I add a custom Flow Builder action?` | warm (reused from batch) | 2 | platform/dev/6.7/guides/plugins/pl… = target | fail (0+0) | platform/dev/6.7/guides/plugins/pl… | 0 | partly | `raw/fs-wiki/dev-06.json` |
| dev-07 | `My plugin needs to store its own data in a new table —…` | warm (reused from batch) | 0 (warm) | platform/dev/6.7/guides/plugins/pl… = target | fail (0+0) | platform/dev/6.7/guides/plugins/pl… | 0 | partly | `raw/fs-wiki/dev-07.json` |
| dev-08 | `In a plugin service, what is the Shopware 6 equivalent…` | warm (reused from batch) | 1 | platform/dev/6.7/guides/plugins/pl… = target | pass (0+1) | platform/dev/6.7/guides/plugins/pl… | 0 | partly | `raw/fs-wiki/dev-08.json` |
| dev-09 | `How do I make a field on my plugin's own entity transl…` | warm (reused from batch) | 1 | platform/dev/6.7/guides/plugins/pl… = target | fail (0+0) | platform/dev/6.7/guides/plugins/pl… | 0 | pass | `raw/fs-wiki/dev-09.json` |
| dev-10 | `How do I write an indexer that precomputes derived dat…` | warm (reused from batch) | 1 | platform/dev/6.7/guides/plugins/pl… = target | fail (0+0) | platform/dev/6.7/guides/plugins/pl… | 0 | pass | `raw/fs-wiki/dev-10.json` |
| dev-11 | `On Shopware 6.7, which file do I declare my plugin's s…` | Read platform/index.md | 3 | platform/dev/6.7/guides/plugins/pl… = target | pass (1+1) | platform/dev/6.7/guides/plugins/pl… | 0 | partly | `raw/fs-wiki/dev-11.json` |
| dev-12 | `I am on Shopware 6.6 — which file do I declare my plug…` | warm (reused from batch) | 2 | platform/dev/6.6/guides/plugins/pl… = target | pass (1+1) | platform/dev/6.6/guides/plugins/pl… | 0 | pass | `raw/fs-wiki/dev-12.json` |
| dev-13 | `There is no event for what I need to change in a core …` | warm (reused from batch) | 2 | platform/dev/6.7/guides/plugins/pl… = target | pass (0+1) | platform/dev/6.7/guides/plugins/pl… | 0 | partly | `raw/fs-wiki/dev-13.json` |
| dev-14 | `I wrote a subscriber class in my plugin but it never f…` | warm (reused from batch) | 1 | platform/dev/6.7/guides/plugins/pl… = target | fail (0+0) | platform/dev/6.7/guides/plugins/pl… | 0 | pass | `raw/fs-wiki/dev-14.json` |
| dev-15 | `How do I work out which event Shopware actually dispat…` | warm (reused from batch) | 4 | platform/dev/6.7/guides/plugins/pl… = target | fail (4+1) | platform/dev/6.7/guides/plugins/pl… | 0 | fail | `raw/fs-wiki/dev-15.json` |
| dev-16 | `How do I run plugin logic whenever an order is written…` | warm (reused from batch) | 2 | platform/dev/6.7/guides/plugins/pl… = target | pass (1+1) | platform/dev/6.7/guides/plugins/pl… | 0 | pass | `raw/fs-wiki/dev-16.json` |
| dev-17 | `How do I overwrite the price of a product line item in…` | warm (reused from batch) | 2 | platform/dev/6.7/guides/plugins/pl… = target | pass (1+1) | platform/dev/6.7/guides/plugins/pl… | 0 | pass | `raw/fs-wiki/dev-17.json` |
| dev-18 | `My plugin's cart processor adds a surcharge line item,…` | warm (reused from batch) | 4 | platform/dev/6.7/guides/plugins/pl… = target | pass (0+1) | platform/dev/6.7/guides/plugins/pl… | 1 | partly | `raw/fs-wiki/dev-18.json` |
| dev-19 | `I need to move long-running work in my plugin out of t…` | warm (reused from batch) | 3 | platform/dev/6.7/guides/plugins/pl… = target | pass (1+1) | platform/dev/6.7/guides/plugins/pl… | 0 | partly | `raw/fs-wiki/dev-19.json` |
| dev-20 | `How do I add my own condition to the Rule Builder from…` | warm (reused from batch) | 2 | platform/dev/6.7/guides/plugins/pl… = target | pass (1+1) | platform/dev/6.7/guides/plugins/pl… | 0 | pass | `raw/fs-wiki/dev-20.json` |
| dev-21 | `My plugin dispatches its own domain event — how do I m…` | Read platform/index.md | 4 | platform/dev/6.7/guides/plugins/pl… = target | pass (2+1) | platform/dev/6.7/guides/plugins/pl… | 0 | fail | `raw/fs-wiki/dev-21.json` |
| dev-22 | `How do I give my plugin a settings page the shop opera…` | warm (reused from batch) | 2 | platform/dev/6.7/guides/plugins/pl… = target | pass (1+1) | platform/dev/6.7/guides/plugins/pl… | 0 | pass | `raw/fs-wiki/dev-22.json` |
| dev-23 | `How do I ship a mail template with my plugin so it is …` | warm (reused from batch) | 2 | platform/dev/6.7/guides/plugins/pl… = target | pass (1+1) | platform/dev/6.7/guides/plugins/pl… | 0 | partly | `raw/fs-wiki/dev-23.json` |
| dev-24 | `How do I get readable SEO URLs generated for the detai…` | warm (reused from batch) | 2 | platform/dev/6.7/guides/plugins/pl… = target | pass (1+1) | platform/dev/6.7/guides/plugins/pl… | 0 | partly | `raw/fs-wiki/dev-24.json` |
| dev-25 | `How do I add a `bin/console` command to my plugin for …` | warm (reused from batch) | 3 | platform/dev/6.7/guides/plugins/pl… = target | pass (2+1) | platform/dev/6.7/guides/plugins/pl… | 0 | pass | `raw/fs-wiki/dev-25.json` |
| dev-26 | `How do I add a custom document type such as a pro-form…` | warm (reused from batch) | 4 | platform/dev/6.7/guides/plugi… ≠ target | pass (1+1) | platform/dev/6.7/guides/plugins/pl… | 0 | partly | `raw/fs-wiki/dev-26.json` |
| dev-27 | `In Shopware 6.7, how do I extend a Storefront Twig tem…` | warm (reused from batch) | 2 | platform/dev/6.7/guides/plugins/pl… = target | pass (1+1) | platform/dev/6.7/guides/plugins/pl… | 0 | pass | `raw/fs-wiki/dev-27.json` |
| dev-28 | `How do I override an existing Storefront JavaScript pl…` | warm (reused from batch) | 2 | platform/dev/6.7/guides/plugins/pl… = target | pass (1+1) | platform/dev/6.7/guides/plugins/pl… | 0 | pass | `raw/fs-wiki/dev-28.json` |
| dev-29 | `How do I add my own data to an existing Storefront pag…` | warm (reused from batch) | 2 | platform/dev/6.7/guides/plugins/pl… = target | pass (0+1) | platform/dev/6.7/guides/plugins/pl… | 0 | partly | `raw/fs-wiki/dev-29.json` |
| dev-30 | `How do I add a custom filter to the Storefront product…` | warm (reused from batch) | 2 | platform/dev/6.7/guides/plugins/pl… = target | fail (0+0) | platform/dev/6.7/guides/plugins/pl… | 0 | partly | `raw/fs-wiki/dev-30.json` |
| dev-31 | `How do I expose a plugin configuration value, such as …` | warm (reused from batch) | 4 | platform/dev/6.7/guides/plugi… ≠ target | fail (2+0) | platform/dev/6.7/guides/plugins/pl… | 0 | partly | `raw/fs-wiki/dev-31.json` |
| dev-32 | `How do I define a custom field set for products from m…` | warm (reused from batch) | 2 | platform/dev/6.7/guides/plugins/pl… = target | fail (1+0) | platform/dev/6.7/guides/plugins/pl… | 0 | pass | `raw/fs-wiki/dev-32.json` |
| dev-33 | `How do I register a custom Administration module from …` | warm (reused from batch) | 2 | platform/dev/6.7/guides/plugins/pl… = target | fail (1+0) | platform/dev/6.7/guides/plugins/pl… | 0 | partly | `raw/fs-wiki/dev-33.json` |
| dev-34 | `How do I extend an existing Administration component a…` | warm (reused from batch) | 2 | platform/dev/6.7/guides/plugins/pl… = target | fail (1+0) | platform/dev/6.7/guides/plugins/pl… | 0 | partly | `raw/fs-wiki/dev-34.json` |
| dev-35 | `How do I load entities from the Admin API inside an Ad…` | warm (reused from batch) | 3 | platform/dev/6.7/guides/plugins/pl… = target | fail (1+0) | platform/dev/6.7/guides/plugins/pl… | 0 | partly | `raw/fs-wiki/dev-35.json` |
| dev-36 | `How do I register ACL privileges for my plugin's Admin…` | warm (reused from batch) | 2 | platform/dev/6.7/guides/plugins/pl… = target | fail (1+0) | platform/dev/6.7/guides/plugins/pl… | 0 | pass | `raw/fs-wiki/dev-36.json` |
| dev-37 | `How do I set up and run PHPUnit integration tests for …` | warm (reused from batch) | 2 | platform/dev/6.7/guides/developmen… = target | fail (2+0) | platform/dev/6.7/guides/developmen… | 0 | partly | `raw/fs-wiki/dev-37.json` |
| dev-38 | `How do I write Jest unit tests for my Administration c…` | warm (reused from batch) | 1 | platform/dev/6.7/guides/developmen… = target | fail (0+0) | platform/dev/6.7/guides/developmen… | 0 | partly | `raw/fs-wiki/dev-38.json` |
| dev-39 | `How do I write end-to-end Cypress tests for my plugin …` | warm (reused from batch) | 1 | platform/dev/6.7/guides/devel… ≠ target | fail (0+0) | platform/dev/6.7/guides/developmen… | 0 | fail | `raw/fs-wiki/dev-39.json` |
| dev-40 | `How do I upgrade a Composer-based Shopware project fro…` | warm (reused from batch) | 2 | platform/dev/6.7/guides/upgrades-m… = target | fail (1+0) | platform/dev/6.7/guides/upgrades-m… | 0 | pass | `raw/fs-wiki/dev-40.json` |
| dev-41 | ``composer update` to Shopware 6.7 aborts on a platform…` | Read platform/index.md | 11 | platform/dev/6.7/guides/hosting/_i… = target | fail (4+1) | platform/dev/6.7/guides/hosting/_i… | 0 | partly | `raw/fs-wiki/dev-41.json` |
| dev-42 | `How do I check extension compatibility before upgradin…` | warm (reused from batch) | 2 | platform/dev/6.7/products/tools/cl… = target | pass (1+1) | platform/dev/6.7/products/tools/cl… | 0 | pass | `raw/fs-wiki/dev-42.json` |
| dev-43 | `My admin plugin still ships a webpack.config.js — how …` | warm (reused from batch) | 2 | platform/dev/6.7/guides/upgrades-m… = target | pass (1+1) | platform/dev/6.7/guides/upgrades-m… | 0 | partly | `raw/fs-wiki/dev-43.json` |
| dev-44 | `After the Vue 3 upgrade my admin plugin broke — this.$…` | warm (reused from batch) | 2 | platform/dev/6.7/guides/upgrades-m… = target | pass (1+1) | platform/dev/6.7/guides/upgrades-m… | 0 | partly | `raw/fs-wiki/dev-44.json` |
| dev-45 | `Shopware.State is deprecated in 6.7 — how do I convert…` | warm (reused from batch) | 2 | platform/dev/6.7/guides/upgrades-m… = target | pass (1+1) | platform/dev/6.7/guides/upgrades-m… | 0 | partly | `raw/fs-wiki/dev-45.json` |
| dev-46 | `sw-button and sw-card are deprecated in Shopware 6.7 —…` | warm (reused from batch) | 2 | platform/dev/6.7/guides/upgrades-m… = target | pass (1+1) | platform/dev/6.7/guides/upgrades-m… | 0 | partly | `raw/fs-wiki/dev-46.json` |
| dev-47 | `My payment plugin implements `AsynchronousPaymentHandl…` | warm (reused from batch) | 2 | platform/dev/6.7/guides/plugins/pl… = target | pass (1+1) | platform/dev/6.7/guides/plugins/pl… | 0 | pass | `raw/fs-wiki/dev-47.json` |
| dev-48 | `After upgrading, my storefront JavaScript plugin no lo…` | warm (reused from batch) | 2 | platform/dev/6.7/guides/plugins/pl… = target | pass (1+1) | platform/dev/6.7/guides/plugins/pl… | 0 | pass | `raw/fs-wiki/dev-48.json` |
| dev-49 | `My storefront controller still uses the `@Route` and `…` | warm (reused from batch) | 2 | platform/dev/6.7/guides/plugins/pl… = target | pass (1+1) | platform/dev/6.7/guides/plugins/pl… | 0 | partly | `raw/fs-wiki/dev-49.json` |
| dev-50 | `My `ScheduledTaskHandler` stopped running after the up…` | warm (reused from batch) | 2 | platform/dev/6.7/guides/plugins/pl… = target | pass (1+1) | platform/dev/6.7/guides/plugins/pl… | 0 | pass | `raw/fs-wiki/dev-50.json` |
| dev-51 | `Custom entities declared in `Resources/config/entities…` | Read platform/index.md | 3 | platform/dev/6.7/guides/plugins/pl… = target | pass (1+1) | platform/dev/6.7/guides/plugins/pl… | 0 | partly | `raw/fs-wiki/dev-51.json` |
| dev-52 | `What must a plugin database migration class implement …` | warm (reused from batch) | 2 | platform/dev/6.7/guides/plugins/pl… = target | pass (1+1) | platform/dev/6.7/guides/plugins/pl… | 0 | partly | `raw/fs-wiki/dev-52.json` |
| dev-53 | `My theme config labels disappeared from the Theme Mana…` | warm (reused from batch) | 2 | platform/dev/6.7/guides/plugins/th… = target | pass (1+1) | platform/dev/6.7/guides/plugins/th… | 0 | partly | `raw/fs-wiki/dev-53.json` |
| dev-54 | `How do I register a plugin cookie in the storefront co…` | warm (reused from batch) | 3 | platform/dev/6.7/guides/plugins/pl… = target | pass (2+1) | platform/dev/6.7/guides/plugins/pl… | 0 | pass | `raw/fs-wiki/dev-54.json` |
| dev-55 | `How do the breaking storefront accessibility changes r…` | warm (reused from batch) | 2 | platform/dev/6.7/guides/developmen… = target | pass (1+1) | platform/dev/6.7/guides/developmen… | 0 | fail | `raw/fs-wiki/dev-55.json` |
| dev-56 | `Header and footer are loaded through ESI sub-requests …` | warm (reused from batch) | 2 | platform/dev/6.7/guides/plugins/pl… = target | pass (1+1) | platform/dev/6.7/guides/plugins/pl… | 0 | pass | `raw/fs-wiki/dev-56.json` |
| dev-57 | `B2B Suite support ends with 6.8 — how do I run the B2B…` | warm (reused from batch) | 2 | platform/dev/6.7/products/extensio… = target | pass (1+1) | platform/dev/6.7/products/extensio… | 0 | pass | `raw/fs-wiki/dev-57.json` |
| dev-58 | `My shopware.yaml still uses redis_url — how do I defin…` | warm (reused from batch) | 2 | platform/dev/6.7/guides/hosting/in… = target | pass (1+1) | platform/dev/6.7/guides/hosting/in… | 0 | pass | `raw/fs-wiki/dev-58.json` |
| dev-59 | `After upgrading to Shopware 6.7 my Varnish cache is ne…` | warm (reused from batch) | 1 | platform/dev/6.7/guides/hosting/in… = target | pass (0+1) | platform/dev/6.7/guides/hosting/in… | 0 | partly | `raw/fs-wiki/dev-59.json` |
| dev-60 | `Which transports do my Shopware message queue workers …` | warm (reused from batch) | 2 | platform/dev/6.7/guides/hosting/in… = target | pass (2+1) | platform/dev/6.7/guides/hosting/in… | 0 | fail | `raw/fs-wiki/dev-60.json` |
| dev-61 | `After the upgrade my Elasticsearch index has to be reb…` | Read platform/index.md | 3 | platform/dev/6.7/guides/hosting/in… = target | pass (1+1) | platform/dev/6.7/guides/hosting/in… | 0 | partly | `raw/fs-wiki/dev-61.json` |
| dev-62 | `I changed a setting in `.env` on a deployed 6.7 shop b…` | warm (reused from batch) | 5 | platform/dev/6.7/guides/hosti… ≠ target | pass (0+1) | platform/dev/6.7/guides/hosting/co… | 1 | fail | `raw/fs-wiki/dev-62.json` |
| dev-63 | `I deployed a plugin update to a 6.7 staging shop and m…` | warm (reused from batch) | 2 | platform/dev/6.7/guides/plugi… ≠ target | pass (1+0) | platform/dev/6.7/guides/plugins/pl… | 0 | partly | `raw/fs-wiki/dev-63.json` |
| dev-64 | `How do I get an Admin API OAuth token — with client_cr…` | warm (reused from batch) | 3 | platform/dev/6.7/guides/devel… ≠ target | pass (1+1) | platform/dev/6.7/guides/developmen… | 1 | partly | `raw/fs-wiki/dev-64.json` |
| dev-65 | `What can I put in the JSON body of `POST /api/search/{…` | warm (reused from batch) | 1 | platform/dev/6.7/guides/developmen… = target | pass (0+1) | platform/dev/6.7/guides/developmen… | 0 | partly | `raw/fs-wiki/dev-65.json` |
| dev-66 | `Which request headers change Admin API behaviour for l…` | warm (reused from batch) | 1 | platform/dev/6.7/guides/developmen… = target | pass (0+1) | platform/dev/6.7/guides/developmen… | 0 | partly | `raw/fs-wiki/dev-66.json` |
| dev-67 | `What does a minimal app folder and `manifest.xml` need…` | warm (reused from batch) | 2 | platform/dev/6.7/guides/plugins/ap… = target | pass (1+1) | platform/dev/6.7/guides/plugins/ap… | 0 | pass | `raw/fs-wiki/dev-67.json` |
| dev-68 | `How does the registration handshake between Shopware a…` | warm (reused from batch) | 1 | platform/dev/6.7/guides/plugins/ap… = target | pass (0+1) | platform/dev/6.7/guides/plugins/ap… | 0 | pass | `raw/fs-wiki/dev-68.json` |
| dev-69 | `How does an app subscribe to an event like `product.wr…` | warm (reused from batch) | 1 | platform/dev/6.7/guides/plugins/ap… = target | pass (0+1) | platform/dev/6.7/guides/plugins/ap… | 0 | pass | `raw/fs-wiki/dev-69.json` |
| dev-70 | `How do I implement a payment method in an app with `pa…` | warm (reused from batch) | 2 | platform/dev/6.7/guides/plugins/ap… = target | pass (1+1) | platform/dev/6.7/guides/plugins/ap… | 0 | partly | `raw/fs-wiki/dev-70.json` |
| dev-71 | `How does an app define its own custom entities in Shop…` | Read platform/index.md | 3 | platform/dev/6.7/guides/plugins/ap… = target | pass (1+1) | platform/dev/6.7/guides/plugins/ap… | 0 | partly | `raw/fs-wiki/dev-71.json` |
| func-01 | `How do I create a product with variants and configure …` | warm (reused from batch) | 8 | platform/func/catalogues/products.… = target | fail (3+1) | platform/func/catalogues/products.… | 1 | partly | `raw/fs-wiki/func-01.json` |
| func-02 | `How do Rule Builder conditions work for shipping and p…` | warm (reused from batch) | 5 | platform/func/settings/rules.md = target | pass (1+1) | platform/func/settings/rules.md:32… | 0 | partly | `raw/fs-wiki/func-02.json` |
| func-03 | `How do promotions and discount codes work, including i…` | warm (reused from batch) | 2 | platform/func/marketing/promotions… = target | pass (1+1) | platform/func/marketing/promotions… | 0 | pass | `raw/fs-wiki/func-03.json` |
| func-04 | `What does the Shopware Migration Assistant transfer au…` | warm (reused from batch) | 1 | platform/func/migration-en/what-is… = target | pass (0+1) | platform/func/migration-en/what-is… | 0 | partly | `raw/fs-wiki/func-04.json` |
| func-05 | `How do I set up a sales channel — storefront versus he…` | warm (reused from batch) | 1 | platform/func/settings/saleschanne… = target | pass (0+1) | platform/func/settings/saleschanne… | 0 | partly | `raw/fs-wiki/func-05.json` |
| func-06 | `Which triggers and actions does the Flow Builder offer…` | warm (reused from batch) | 2 | platform/func/settings/Flow-Builde… = target | pass (1+1) | platform/func/settings/Flow-Builde… | 0 | partly | `raw/fs-wiki/func-06.json` |
| func-07 | `How do I import products from a CSV with an import/exp…` | warm (reused from batch) | 1 | platform/func/shopware-en/settings… = target | pass (0+1) | platform/func/shopware-en/settings… | 0 | partly | `raw/fs-wiki/func-07.json` |
| func-08 | `How do custom field sets work — entity assignment, fie…` | warm (reused from batch) | 2 | platform/func/settings/custom-fiel… = target | pass (1+1) | platform/func/settings/custom-fiel… | 0 | partly | `raw/fs-wiki/func-08.json` |
| func-09 | `Why doesn't my payment method appear in the checkout —…` | warm (reused from batch) | 1 | platform/func/settings/Paymentmeth… = target | fail (1+0) | platform/func/settings/Paymentmeth… | 0 | fail | `raw/fs-wiki/func-09.json` |
| func-10 | `How do dynamic product groups work in the administrati…` | Read platform/index.md | 3 | platform/func/shopware-6-de/Catalo… = target | pass (1+1) | platform/func/shopware-6-de/Catalo… | 0 | partly | `raw/fs-wiki/func-10.json` |
| func-11 | `How do I create an integration for Admin API access in…` | warm (reused from batch) | 4 | platform/func/settings/system/inte… = target | pass (1+1) | platform/func/settings/system/inte… | 0 | pass | `raw/fs-wiki/func-11.json` |
| func-12 | `A spec asks for customer-specific pricing and for a fl…` | warm (reused from batch) | 3 | platform/func/extensions/cust… ≠ target | n/a | platform/func/extensions/customer-… | 0 | fail | `raw/fs-wiki/func-12.json` |
| edge-01 | `How do I configure Shopware 6's built-in GraphQL API f…` | warm (reused from batch) | 4 | platform/dev/6.7/concepts/api… ≠ target | n/a | platform/dev/6.7/concepts/api/_ind… | 0 | pass | `raw/fs-wiki/edge-01.json` |
| edge-02 | `How do I get the DI container with `Shopware()->Contai…` | warm (reused from batch) | 2 | — | n/a | — | 1 | partly | `raw/fs-wiki/edge-02.json` |
| edge-03 | `Where do the `#[ORM\Entity]` mapping attributes for my…` | warm (reused from batch) | 2 | platform/dev/6.7/concepts/fra… ≠ target | n/a | platform/dev/6.7/concepts/framewor… | 0 | pass | `raw/fs-wiki/edge-03.json` |
| edge-04 | `How do I fetch products with `GET /sales-channel-api/v…` | warm (reused from batch) | 3 | platform/dev/6.7/guides/devel… ≠ target | n/a | platform/dev/6.7/guides/developmen… | 1 | pass | `raw/fs-wiki/edge-04.json` |
| edge-05 | `How do I enable Shopware's built-in MCP server on a Sh…` | warm (reused from batch) | 2 | platform/dev/6.7/products/too… ≠ target | n/a | platform/dev/6.7/products/tools/mc… | 0 | pass | `raw/fs-wiki/edge-05.json` |
| edge-06 | `I'm coming from Magento — what are the Shopware equiva…` | warm (reused from batch) | 5 | platform/func/migration-en/magento… = target | n/a | platform/func/migration-en/magento… | 0 | fail | `raw/fs-wiki/edge-06.json` |
| edge-07 | `How do I set up Shopware PWA as the storefront for a S…` | warm (reused from batch) | 2 | platform/dev/6.6/products/pwa.md = target | n/a | platform/dev/6.6/products/pwa.md:1… | 0 | pass | `raw/fs-wiki/edge-07.json` |
| edge-08 | `Which service do I type-hint to read products — `Entit…` | Read platform/index.md | 5 | platform/dev/6.7/guides/plugi… ≠ target | n/a | platform/dev/6.7/guides/plugins/pl… | 0 | partly | `raw/fs-wiki/edge-08.json` |
| edge-09 | `Where do I configure Business Events so that a mail is…` | warm (reused from batch) | 4 | platform/func/settings/Business-Ev… = target | n/a | platform/func/settings/Business-Ev… | 0 | fail | `raw/fs-wiki/edge-09.json` |
| gap-01 | `How do I add my own Admin API endpoint under `/api/...…` | warm (reused from batch) | 8 | platform/dev/6.7/guides/plugi… ≠ target | n/a | platform/dev/6.7/guides/plugins/pl… | 1 | partly | `raw/fs-wiki/gap-01.json` |
| gap-02 | `Shopware 6.7 removed the RSA JWT key files and `system…` | warm (reused from batch) | 8 | platform/dev/6.6/resources/re… ≠ target | n/a | platform/dev/6.6/resources/referen… | 1 | partly | `raw/fs-wiki/gap-02.json` |
| gap-03 | `My ERP integration stopped logging in after the 6.7 up…` | warm (reused from batch) | 4 | platform/dev/6.7/guides/devel… ≠ target | n/a | — | 0 | partly | `raw/fs-wiki/gap-03.json` |
| gap-04 | `After upgrading to 6.7 my plugin fatals on load becaus…` | warm (reused from batch) | 3 | — | n/a | — | 0 | partly | `raw/fs-wiki/gap-04.json` |
| gap-05 | `My plugin decorates `CachedProductRoute` to add cache …` | warm (reused from batch) | 2 | platform/dev/6.7/guides/plugi… ≠ target | n/a | platform/dev/6.7/guides/plugins/pl… | 0 | partly | `raw/fs-wiki/gap-05.json` |
| gap-06 | `How do I create a shipping method from my plugin's ins…` | warm (reused from batch) | 5 | platform/dev/6.7/guides/plugi… ≠ target | n/a | platform/dev/6.7/guides/plugins/ap… | 1 | partly | `raw/fs-wiki/gap-06.json` |
| gap-07 | `How do I create a media entity from a file on disk in …` | warm (reused from batch) | 6 | platform/dev/6.7/guides/plugi… ≠ target | n/a | platform/dev/6.7/guides/plugins/pl… | 1 | partly | `raw/fs-wiki/gap-07.json` |
| gap-08 | `How do I set up a Nuxt project with Shopware Composabl…` | warm (reused from batch) | 8 | platform/dev/6.7/products/paa… ≠ target | n/a | platform/dev/6.7/products/paas/sho… | 0 | pass | `raw/fs-wiki/gap-08.json` |

Fence denials for fs-wiki: 0 (none recorded — every call stayed within `platform/`).

Self-report fidelity: 20 of 100 cases show a `selfReportDelta` (self-reported tool-call count differs from the ground-truth transcript); each is noted in that case's `notes`/`findings` in `scores.json`.
## Scores by case

The scorers' analysis. One table per option, one row per case: six dimension scores (band values), the six points, recomputed total and verdict. `unscored` cases show `—` in every score column.

### fs-wiki

| Case | Grounding | Accuracy | Completeness | Citation | Honesty | Actionability | Points | Total | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dev-01 | 40 | 0 | 0 | 100 | 0 | 40 | 10+0+0+10+0+4 | 24% | fail |
| dev-02 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| dev-03 | 100 | 70 | 100 | 100 | 0 | 100 | 25+17.5+15+10+0+10 | 77% | partly |
| dev-04 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| dev-05 | 100 | 70 | 100 | 100 | 0 | 100 | 25+17.5+15+10+0+10 | 77% | partly |
| dev-06 | 100 | 40 | 70 | 100 | 100 | 70 | 25+10+10.5+10+15+7 | 77% | partly |
| dev-07 | 100 | 70 | 100 | 0 | 0 | 100 | 25+17.5+15+0+0+10 | 67% | partly |
| dev-08 | 100 | 40 | 70 | 100 | 0 | 100 | 25+10+10.5+10+0+10 | 65% | partly |
| dev-09 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| dev-10 | 100 | 70 | 100 | 100 | 100 | 100 | 25+17.5+15+10+15+10 | 92% | pass |
| dev-11 | 100 | 40 | 70 | 100 | 100 | 100 | 25+10+10.5+10+15+10 | 80% | partly |
| dev-12 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| dev-13 | 100 | 40 | 70 | 100 | 0 | 100 | 25+10+10.5+10+0+10 | 65% | partly |
| dev-14 | 100 | 100 | 100 | 100 | 100 | 100 | 25+25+15+10+15+10 | 100% | pass |
| dev-15 | 70 | 40 | 40 | 40 | 0 | 70 | 17.5+10+6+4+0+7 | 44% | fail |
| dev-16 | 100 | 70 | 100 | 100 | 100 | 100 | 25+17.5+15+10+15+10 | 92% | pass |
| dev-17 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| dev-18 | 70 | 40 | 70 | 100 | 100 | 70 | 17.5+10+10.5+10+15+7 | 70% | partly |
| dev-19 | 100 | 40 | 70 | 100 | 100 | 70 | 25+10+10.5+10+15+7 | 77% | partly |
| dev-20 | 100 | 70 | 100 | 100 | 100 | 100 | 25+17.5+15+10+15+10 | 92% | pass |
| dev-21 | 100 | 0 | 0 | 100 | 100 | 40 | 25+0+0+10+15+4 | 54% | fail |
| dev-22 | 100 | 70 | 70 | 100 | 100 | 70 | 25+17.5+10.5+10+15+7 | 85% | pass |
| dev-23 | 100 | 40 | 40 | 100 | 100 | 70 | 25+10+6+10+15+7 | 73% | partly |
| dev-24 | 100 | 40 | 70 | 100 | 100 | 100 | 25+10+10.5+10+15+10 | 80% | partly |
| dev-25 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| dev-26 | 100 | 40 | 70 | 100 | 100 | 100 | 25+10+10.5+10+15+10 | 80% | partly |
| dev-27 | 100 | 100 | 100 | 100 | 100 | 100 | 25+25+15+10+15+10 | 100% | pass |
| dev-28 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| dev-29 | 100 | 70 | 70 | 100 | 0 | 100 | 25+17.5+10.5+10+0+10 | 73% | partly |
| dev-30 | 100 | 70 | 70 | 100 | 0 | 100 | 25+17.5+10.5+10+0+10 | 73% | partly |
| dev-31 | 100 | 40 | 40 | 100 | 100 | 100 | 25+10+6+10+15+10 | 76% | partly |
| dev-32 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| dev-33 | 100 | 40 | 40 | 100 | 100 | 70 | 25+10+6+10+15+7 | 73% | partly |
| dev-34 | 100 | 100 | 70 | 100 | 0 | 100 | 25+25+10.5+10+0+10 | 80% | partly |
| dev-35 | 100 | 40 | 70 | 100 | 100 | 100 | 25+10+10.5+10+15+10 | 80% | partly |
| dev-36 | 100 | 100 | 70 | 100 | 100 | 100 | 25+25+10.5+10+15+10 | 95% | pass |
| dev-37 | 100 | 40 | 70 | 100 | 0 | 100 | 25+10+10.5+10+0+10 | 65% | partly |
| dev-38 | 100 | 40 | 40 | 100 | 100 | 70 | 25+10+6+10+15+7 | 73% | partly |
| dev-39 | 70 | 0 | 0 | 100 | 100 | 40 | 17.5+0+0+10+15+4 | 46% | fail |
| dev-40 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| dev-41 | 100 | 40 | 40 | 100 | 100 | 70 | 25+10+6+10+15+7 | 73% | partly |
| dev-42 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| dev-43 | 100 | 40 | 70 | 100 | 100 | 100 | 25+10+10.5+10+15+10 | 80% | partly |
| dev-44 | 100 | 0 | 40 | 100 | 100 | 70 | 25+0+6+10+15+7 | 63% | partly |
| dev-45 | 100 | 0 | 70 | 100 | 100 | 100 | 25+0+10.5+10+15+10 | 70% | partly |
| dev-46 | 70 | 40 | 40 | 100 | 100 | 40 | 17.5+10+6+10+15+4 | 62% | partly |
| dev-47 | 100 | 100 | 100 | 100 | 100 | 100 | 25+25+15+10+15+10 | 100% | pass |
| dev-48 | 100 | 100 | 70 | 100 | 100 | 100 | 25+25+10.5+10+15+10 | 95% | pass |
| dev-49 | 100 | 40 | 70 | 100 | 100 | 100 | 25+10+10.5+10+15+10 | 80% | partly |
| dev-50 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| dev-51 | 100 | 40 | 70 | 100 | 100 | 70 | 25+10+10.5+10+15+7 | 77% | partly |
| dev-52 | 70 | 40 | 40 | 100 | 100 | 70 | 17.5+10+6+10+15+7 | 65% | partly |
| dev-53 | 100 | 40 | 70 | 100 | 100 | 70 | 25+10+10.5+10+15+7 | 77% | partly |
| dev-54 | 100 | 70 | 100 | 100 | 100 | 100 | 25+17.5+15+10+15+10 | 92% | pass |
| dev-55 | 70 | 0 | 0 | 100 | 100 | 0 | 17.5+0+0+10+15+0 | 42% | fail |
| dev-56 | 100 | 70 | 100 | 100 | 100 | 100 | 25+17.5+15+10+15+10 | 92% | pass |
| dev-57 | 100 | 100 | 100 | 100 | 100 | 100 | 25+25+15+10+15+10 | 100% | pass |
| dev-58 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| dev-59 | 100 | 40 | 70 | 100 | 100 | 40 | 25+10+10.5+10+15+4 | 74% | partly |
| dev-60 | 70 | 0 | 40 | 40 | 0 | 40 | 17.5+0+6+4+0+4 | 31% | fail |
| dev-61 | 100 | 40 | 70 | 100 | 100 | 70 | 25+10+10.5+10+15+7 | 77% | partly |
| dev-62 | 100 | 40 | 40 | 100 | 0 | 40 | 25+10+6+10+0+4 | 55% | fail |
| dev-63 | 100 | 40 | 40 | 100 | 100 | 70 | 25+10+6+10+15+7 | 73% | partly |
| dev-64 | 70 | 70 | 70 | 100 | 100 | 70 | 17.5+17.5+10.5+10+15+7 | 77% | partly |
| dev-65 | 100 | 40 | 100 | 100 | 100 | 70 | 25+10+15+10+15+7 | 82% | partly |
| dev-66 | 100 | 40 | 70 | 100 | 100 | 70 | 25+10+10.5+10+15+7 | 77% | partly |
| dev-67 | 100 | 70 | 100 | 100 | 100 | 100 | 25+17.5+15+10+15+10 | 92% | pass |
| dev-68 | 100 | 70 | 100 | 100 | 100 | 100 | 25+17.5+15+10+15+10 | 92% | pass |
| dev-69 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| dev-70 | 100 | 40 | 40 | 100 | 100 | 40 | 25+10+6+10+15+4 | 70% | partly |
| dev-71 | 100 | 40 | 70 | 100 | 100 | 40 | 25+10+10.5+10+15+4 | 74% | partly |
| func-01 | 70 | 40 | 40 | 100 | 100 | 40 | 17.5+10+6+10+15+4 | 62% | partly |
| func-02 | 100 | 40 | 40 | 100 | 100 | 70 | 25+10+6+10+15+7 | 73% | partly |
| func-03 | 100 | 70 | 100 | 100 | 100 | 100 | 25+17.5+15+10+15+10 | 92% | pass |
| func-04 | 100 | 40 | 40 | 100 | 100 | 40 | 25+10+6+10+15+4 | 70% | partly |
| func-05 | 100 | 40 | 40 | 100 | 100 | 70 | 25+10+6+10+15+7 | 73% | partly |
| func-06 | 100 | 40 | 70 | 100 | 100 | 70 | 25+10+10.5+10+15+7 | 77% | partly |
| func-07 | 100 | 40 | 70 | 100 | 100 | 40 | 25+10+10.5+10+15+4 | 74% | partly |
| func-08 | 100 | 40 | 40 | 100 | 100 | 70 | 25+10+6+10+15+7 | 73% | partly |
| func-09 | 0 | 70 | 70 | 0 | 0 | 70 | 0+17.5+10.5+0+0+7 | 35% | fail |
| func-10 | 100 | 40 | 40 | 100 | 100 | 70 | 25+10+6+10+15+7 | 73% | partly |
| func-11 | 100 | 100 | 100 | 100 | 100 | 100 | 25+25+15+10+15+10 | 100% | pass |
| func-12 | 70 | 0 | 40 | 100 | 100 | 40 | 17.5+0+6+10+15+4 | 52% | fail |
| edge-01 | 100 | 100 | 100 | 100 | 100 | 100 | 25+25+15+10+15+10 | 100% | pass |
| edge-02 | 100 | 70 | 70 | 40 | 100 | 70 | 25+17.5+10.5+4+15+7 | 79% | partly |
| edge-03 | 100 | 100 | 100 | 100 | 100 | 100 | 25+25+15+10+15+10 | 100% | pass |
| edge-04 | 100 | 100 | 100 | 100 | 100 | 100 | 25+25+15+10+15+10 | 100% | pass |
| edge-05 | 100 | 70 | 70 | 100 | 100 | 100 | 25+17.5+10.5+10+15+10 | 88% | pass |
| edge-06 | 70 | 0 | 40 | 100 | 100 | 40 | 17.5+0+6+10+15+4 | 52% | fail |
| edge-07 | 100 | 70 | 70 | 100 | 100 | 70 | 25+17.5+10.5+10+15+7 | 85% | pass |
| edge-08 | 100 | 40 | 70 | 100 | 100 | 70 | 25+10+10.5+10+15+7 | 77% | partly |
| edge-09 | 70 | 0 | 40 | 100 | 100 | 40 | 17.5+0+6+10+15+4 | 52% | fail |
| gap-01 | 100 | 40 | 70 | 100 | 0 | 70 | 25+10+10.5+10+0+7 | 62% | partly |
| gap-02 | 100 | 100 | 100 | 100 | 0 | 70 | 25+25+15+10+0+7 | 82% | partly |
| gap-03 | 100 | 40 | 40 | 40 | 100 | 100 | 25+10+6+4+15+10 | 70% | partly |
| gap-04 | 100 | 70 | 70 | 40 | 100 | 100 | 25+17.5+10.5+4+15+10 | 82% | partly |
| gap-05 | 100 | 40 | 70 | 100 | 100 | 70 | 25+10+10.5+10+15+7 | 77% | partly |
| gap-06 | 100 | 40 | 70 | 100 | 100 | 70 | 25+10+10.5+10+15+7 | 77% | partly |
| gap-07 | 100 | 40 | 40 | 100 | 100 | 40 | 25+10+6+10+15+4 | 70% | partly |
| gap-08 | 100 | 100 | 70 | 100 | 100 | 100 | 25+25+10.5+10+15+10 | 95% | pass |

`unavailable` means the Source-absent override applied — the corpus had nothing and the agent honestly reported that; it is not a failure. No case in this run hit the override.

## Failures and official references

One bullet per case with verdict `partly`, `fail` or `unscored` (not `unavailable` — that belongs in Observations). Each bullet: `<case-id> (<option>)`, verdict, total, the scorer's findings verbatim, then the official reference(s) as `URL — "quoted sentence"`.

- **dev-01 (fs-wiki)** — fail, 24%
  - expected fact 1 (EntityExtension abstract getEntityName vs getDefinitionClass 6.6/6.7 trap) absent; answer describes generic DAL association wiring instead of the EntityExtension recipe for extending an existing (core) entity
  - expected fact 2 (association-shaped field restriction, Extension flag) absent
  - expected fact 3 (shopware.entity.extension tag, BulkEntityExtension) absent
  - agent read add-data-associations.md instead of the target add-complex-data-to-existing-entities.md; that page's content does not carry the extend-an-existing-entity mechanism, so findability=fail is not a drift case
  - selfReportDelta shows an unreported Read of add-custom-complex-data.md (dev-07's target) — materially under-reported toolCallLog
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/add-complex-data-to-existing-entities.html — "6.7.13.0 declares only extendFields, modifyFields, extendProtections, abstract getEntityName; getDefinitionClass() does not exist in 6.7."
- **dev-03 (fs-wiki)** — partly, 77%
  - all three expected facts (abstract route pattern, StoreApiResponse contract, two-step registration) are covered with concrete code
  - fact 3's 'inactive plugin has no routes at all' nuance is omitted
  - selfReportDelta shows an unreported Read of dev-04's target (add-cms-element.md) — materially under-reported toolCallLog, honesty=0
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/framework/store-api/add-store-api-route.html — "class StoreApiResponse extends Response — concrete."
- **dev-05 (fs-wiki)** — partly, 77%
  - all three facts (theme.json placeholder mechanism, views hierarchy order, style/SCSS ordering) are substantively covered with a concrete example
  - fact 3's cascade-not-override / !default rationale is only implied (via 'overrides.scss stays first'), not explicitly stated — risks a reader assuming path-based file shadowing
  - selfReportDelta shows an unreported Read of dev-06's target — materially under-reported toolCallLog, honesty=0
  - Official: https://developer.shopware.com/docs/guides/plugins/themes/inheritance/add-theme-inheritance.html — "createFromThemeJson reads only the ten listed keys; parentage comes from @-entries and configInheritance."
- **dev-06 (fs-wiki)** — partly, 77%
  - fact 1's 'getName() is static' and 'not an event subscriber' points are omitted
  - fact 2 (flow.action tag + key attribute) is correctly covered
  - fact 3's Administration registration is described via overriding sw-flow-sequence-action rather than the documented flowBuilderService.addActionNames/addLabels/addIcons/addGroups mechanism — a divergent, unverified registration path
  - DelayableAction/TransactionalAction markers (part of fact 3) are not mentioned
  - findability=fail per ground truth (target not actually read in this case's turn) despite an accurate matching citation
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/framework/flow/add-flow-builder-action.html — "AutoconfigureCompilerPass has no entry for FlowAction (only FlowStorer); every core action is tagged explicitly."
- **dev-07 (fs-wiki)** — partly, 67%
  - the report's toolCallLog is empty, yet the answer cites a specific line range (add-custom-complex-data.md:1-71) with detailed content — the audit's matchesToolCallLog=false confirms the citation corresponds to nothing in the agent's own reported process
  - answer asserts detailed, specifically-cited content with no supporting entry in its own (correctly self-reported, empty) call log — honesty=0 per the base rubric text regardless of selfReportDelta arithmetic
  - all three expected facts (EntityDefinition's two abstract members, shopware.entity.definition + EntityCompilerPass synthesising the repository, migration must create the table) are substantively covered
  - fact 2's caveat that the tag's 'entity' attribute is not actually read (only getEntityName() drives the repository id) is omitted; the answer implies the attribute must be set to match
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/add-custom-complex-data.html — "EntityCompilerPass never reads tag attributes; it does new $class() and calls getEntityName()."
- **dev-08 (fs-wiki)** — partly, 65%
  - the case's central trap — EntityRepositoryInterface no longer exists in 6.7 and is a fatal type-hint — is not mentioned at all; the answer only says to 'inject the entity repository'
  - facts 2 and 3 (search()/Criteria mechanics incl. addAssociation/getAssociation, searchIds() for mapping entities, RepositoryIterator's lack of a tie-breaker sort) are covered well, including the deterministic-sort caveat
  - selfReportDelta shows two unreported Reads (dev-09 and dev-10 targets) — materially under-reported toolCallLog, honesty=0
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/reading-data.html — "The full public surface is getDefinition, search, aggregate, searchIds, update, upsert, create, delete, createVersion, merge, clone."
- **dev-11 (fs-wiki)** — partly, 80%
  - fact 1 is mischaracterized: the answer states services.php as the file, omitting that services.xml/.yaml also load on 6.7.13.0 and that the XML deprecation only starts at 6.7.14.0 — could wrongly suggest an existing plugin's services.xml no longer works
  - fact 2 (autowiring off by default) is correctly explained
  - fact 3's DAL-repository named-autowiring-alias nuance (EntityRepository $productRepository resolving without an explicit argument) is omitted
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/services/dependency-injection.html — "up to 6.7.13.0 XML loads silently and bin/console plugin:create scaffolds services.xml; from 6.7.14.0 onward loading an .xml config triggers a deprecation."
- **dev-13 (fs-wiki)** — partly, 65%
  - fact 1 (checking Extension/ExtensionDispatcher extension points before decorating) is entirely omitted — the answer goes straight to decoration
  - fact 2 (decoration via services.php decorate()/.inner) is correctly covered
  - fact 3's compile-time ServiceNotFoundException on a missing decoration target, and the no-#[Route]-on-decorators rule, are omitted
  - selfReportDelta shows an unreported Read — materially under-reported toolCallLog, honesty=0
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/services/adjusting-service.html — "only 22 core classes extend Extension in 6.7, so decoration remains the mechanism for every other core service."
- **dev-15 (fs-wiki)** — fail, 44%
  - the answer recommends searching for the literal term '@Event' to find event-constant classes; the case's decisive code evidence confirms that string has zero occurrences under vendor/shopware — a materially wrong, dead-end search technique
  - fact 1's core mechanism (EntityLoadedEvent's nameless dispatch unwrapped by NestedEventDispatcher, explaining why grep finds no dispatch site for 'product.loaded') is not mentioned, only the generic entity_name.event naming convention
  - fact 2's before-vs-after-render point ({route}.render fires before Twig) is correctly captured
  - fact 3's debug:event-dispatcher (lists only already-registered listeners) vs debug:business-events distinction is not addressed
  - selfReportDelta shows two unreported Bash calls — materially under-reported toolCallLog, honesty=0
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/framework/event/finding-events.html — "The documented @Event search term is dead — the string does not occur anywhere under vendor/shopware."
- **dev-18 (fs-wiki)** — partly, 70%
  - fact 1 (collect() has no $toCalculate; only the processor may add lines) and fact 3's recompute-per-pass principle are covered
  - fact 2's core duplication mechanism (CartRuleLoader's up-to-7-iteration loop feeding the result cart back in, LineItemCollection::add() summing quantities instead of replacing) is not found in the corpus reached; the report honestly discloses this gap in a labelled memory sentence rather than fabricating a fix
  - well-grounded, investigative behaviour across three related pages (add-cart-processor-collector.md, cart-process.md, add-cart-discounts.md)
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/cart/add-cart-processor-collector.html — "LineItemCollection::add() on an already-present id does not replace the item — it sums the quantities and marks it modified."
- **dev-19 (fs-wiki)** — partly, 77%
  - answer states handlers are 'automatically tagged with messenger.message_handler — no manual services.php tagging is required', directly contradicting the case's decisive evidence that Shopware loads plugin services with no autoconfiguration defaults, so the explicit tag is normally required
  - fact 3 (message class, not handler, determines async routing via AsyncMessageInterface) is covered, though the bus id is given inverted as 'messenger.default_bus' rather than 'messenger.bus.default'
  - fact 1's 'final class' requirement and 'no Shopware base class' framing are not stated
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/framework/message-queue/add-message-handler.html — "Shopware never sets that [autoconfigure] — Bundle::registerContainerFile() loads the plugin's Resources/config/services.* with no <defaults>, and grep setAutoconfigured|->autoconfigure( over core returns 0 hits."
- **dev-21 (fs-wiki)** — fail, 54%
  - answer states event data is read from a StorableFlow 'rather than getAvailableData()' since 6.5.0.0, directly contradicting the case's confirmed fact that getAvailableData() is still required and consumed by the collector in 6.7
  - answer recommends giving the BusinessEventCollectorEvent subscriber 'a high priority (e.g. 1000)' — precisely the trap the case's expected answer flags as false; no priority is load-bearing in 6.7
  - fact 3 (dispatch keys on $event->getName(), so define()'s custom name is cosmetic only; flow.storer requirement for data) is not addressed
  - both wrong statements directly hit the case's documented Trap; the wiki page appears to reproduce outdated guide content that the code contradicts
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/framework/flow/add-flow-builder-trigger.html — "add() must not be used: it appends under a numeric key, so the by-name lookups ... miss and the trigger exposes no variables."
- **dev-23 (fs-wiki)** — partly, 73%
  - answer states 'system_default must be 0', directly contradicting the case's decisive evidence that this 'must be 0' framing is editorial and that 1 is the safer value (the trait's own idempotency lookup filters on system_default=1)
  - fact 2 (CreateMailTemplateTrait helper, and that it cannot carry a plugin's own template bodies) is entirely omitted
  - fact 1's migration/idempotency mechanism (guard on technical_name, INSERT IGNORE) is otherwise correctly and specifically described
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/content/mail/add-mail-template.html — "mail_template.system_default is a plain BoolField that no code enforces ... so 1 is the safer value for a type's canonical template — the docs' "must be 0" is editorial."
- **dev-24 (fs-wiki)** — partly, 80%
  - facts 1 and 2 (SeoUrlRouteInterface shape, mandatory seo_url_template row, and that a plugin must call SeoUrlUpdater::update() manually since no indexer picks a plugin route up) are accurately and specifically covered
  - answer states a soft-deleted seo_url row 'stays reachable' and the controller must check isDeleted, directly contradicting the case's decisive evidence that every read path already filters is_deleted=0
  - fact 3 (per-sales-channel/language generation, rows never written with sales_channel_id null) is entirely omitted
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/content/seo/add-custom-seo-url.html — "SeoUrlUpdater::loadUrlTemplate() throws SeoException::invalidTemplate('Default templates not configured')."
- **dev-26 (fs-wiki)** — partly, 80%
  - Answer falls into the documented trap: presents Document System v2 (AbstractDocumentType, tags shopware.document_v2.type/.provider) as a viable current alternative, contradicting the confirmed fact that AbstractDocumentType and the .type tag do not exist at 6.7.13.0
  - Facts 2 (document_type row + number range requirement) and 3 (literal template naming via setTemplate) are substantively present
  - Citations 2/2 verified, excerpts support the cited content
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/document/add-custom-document-type.html — "Shopware\Core\Checkout\DocumentV2\Type\AbstractDocumentType and the tag shopware.document_v2.type do not exist in 6.7.13.0."
- **dev-29 (fs-wiki)** — partly, 73%
  - selfReportDelta shows the toolCallLog under-reports the ground-truth call count (reported 2 vs actual 3, missing a Read of add-listing-filters.md) — honesty scored 0 per rubric
  - Fact 1 (subscribe to *LoadedEvent, addExtension, .extensions.<name>) is present
  - Fact 2 (header/footer rendered via ESI, no page variable, must use Header/FooterPageletLoadedEvent) is entirely absent from the answer, a material omission given the query's scope
  - Fact 3 (store-api-route convention, not a platform constraint) is roughly present
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/controllers/add-data-to-storefront-page.html — "no page variable exists in storefront/layout/header/*.twig or layout/footer/*.twig."
- **dev-30 (fs-wiki)** — partly, 73%
  - Ground-truth transcript shows zero retrieval calls for this case even though the self-reported toolCallLog claims a grep+Read — the content appears to have been carried over from the adjacent dev-29 turn (which shows the matching Read as an unreported extra call there); this misattributed call log is scored honesty 0
  - Answer content itself (Filter constructor fields, AggregationListingProcessor, filter-panel.html.twig block) matches all three expected-answer facts and the cited excerpt genuinely supports it
  - Official: none recorded for this case
- **dev-31 (fs-wiki)** — partly, 76%
  - Agent read the sibling subscriber-based guide instead of the target add-scss-variables.md page, and the answer describes only the hand-written-subscriber approach, entirely omitting the declarative config.xml <css> tag mechanism that core already ships (ThemeCompilerEnrichScssVarSubscriber) — the expected answer's primary fact
  - hasCssValue()'s string-only requirement (colorpicker works, bool/checkbox silently dropped) is not mentioned
  - !default fallback guidance is correctly present
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/styling/add-scss-variables.html — "ThemeConfigValueAccessor::getCssVarValues() reads only merged theme.json fields, so a plugin <css> value never becomes a --custom-property."
- **dev-33 (fs-wiki)** — partly, 73%
  - Directly contradicts the confirmed Trap by claiming settingsItem.group must be one of shop/system/plugins, when no runtime validation exists and 'shop' is not even in the 6.7 TypeScript union
  - Omits the whole build-chain diagnosis (var/plugins.json, Vite entrypoints.json, that a missing entrypoints.json silently drops the bundle with only bin/console system:check surfacing it) — the query's actual troubleshooting need
  - Omits menu-entry validation rules (parent+label required, position+=1000, no icon fallback)
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/administration/module-component-management/add-custom-module.html — "that entry file has to be exactly <plugin root>/src/Resources/app/administration/src/main.js or main.ts — no other name is detected."
- **dev-34 (fs-wiki)** — partly, 80%
  - selfReportDelta shows an under-reported toolCallLog (reported 2 vs actual 3, missing a Read of customizing-modules.md) — honesty scored 0
  - Override vs extend distinction, block matching, {% parent %}, $super and the experimental Composition API caveat are all correctly covered
  - Omits the exact $super trigger condition (source text matching /\.$super/) and the getter/setter '<name>.get'/'<name>.set' naming detail
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/administration/module-component-management/customizing-components.html — "Shopware.Component.override('sw-dashboard-index', { template }) changes an existing component in place, whereas Shopware.Component.extend('<new-name>', ...) registers a new component under a new name."
- **dev-35 (fs-wiki)** — partly, 80%
  - Reproduces the documented doc/code divergence: states setTotalCountMode(2) fetches 'limit * 5 + 1' rows, matching the (wrong) doc-comment claim, when confirmed code shows EntitySearcher actually fetches limit * 6 + 1 — only the pagination-link maths uses * 5 + 1
  - Fact 3 (server-side ACL validation via AclCriteriaValidator, recursing into associations, 403 on missing privileges) is entirely omitted
  - repositoryFactory injection, create(), search()/Criteria methods are correctly covered
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/administration/data-handling-processing/using-data-handling.html — "EntitySearcher::addTotalCountMode() actually fetches limit * 6 + 1 rows; only the pagination-link maths uses * 5 + 1."
- **dev-37 (fs-wiki)** — partly, 65%
  - selfReportDelta shows an under-reported toolCallLog (reported 2 vs actual 3, missing a Bash find call) — honesty scored 0
  - Introduces an unverified claim ('composer require --dev dev-tools' is needed to use PHPUnit at all) that contradicts the confirmed fact that PHPUnit is not shipped by shopware/core and the project pins phpunit/phpunit ^11.5 directly — no such 'dev-tools' package appears in the evidence
  - Omits that TestBootstrapper::bootstrap() forcibly appends _test to the database name
  - phpunit.xml/TestBootstrap.php chain and IntegrationTestBehaviour usage are otherwise correctly described
  - Official: https://developer.shopware.com/docs/guides/development/testing/unit/php-unit.html — "TestBootstrapper::bootstrap() never runs against the configured database: it appends _test to the DATABASE_URL path unless it already ends that way."
- **dev-38 (fs-wiki)** — partly, 73%
  - Entirely omits the confirmed fact that Shopware 6.7 ships no Jest harness for a plugin, and instead recommends platform-repo-only commands (composer run admin:create:test, composer run admin:unit) as if usable directly in a plugin project — misleading for the query's actual context
  - Does not state that Vue-3 test-utils requires stubs/mocks/provide nested under a `global` key, describing them as flat mount() options instead
  - Never names Jest, jest-environment-jsdom or @vue/test-utils 2.4.6 explicitly, nor that this is Jest rather than Vitest
  - Official: https://developer.shopware.com/docs/guides/development/testing/unit/jest-admin.html — "Shopware 6.7 ships no Jest harness for a plugin ... a plugin must supply its own Jest configuration."
- **dev-39 (fs-wiki)** — fail, 46%
  - Falls exactly into the confirmed trap this case tests: gives a full, detailed legacy-Cypress setup recipe for a Shopware 6.7 store, despite confirmed evidence that Shopware 6.7 has zero Cypress infrastructure (0-byte upstream file, no dependency, no npm script)
  - Entirely omits the actual current path — the Playwright @shopware-ag/acceptance-test-suite package, .env/integration:create setup, and the actor/fixture pattern — beyond a single passing mention that Playwright is 'recommended'
  - Completeness 0/3: none of the three expected-answer facts (no-Cypress-support, Playwright setup specifics, actor-pattern/fixtures) are correctly stated
  - Official: https://developer.shopware.com/docs/guides/development/testing/e2e-playwright/install-configure.html — "There is no Cypress support in Shopware 6.7 — the premise of the question is stale."
- **dev-41 (fs-wiki)** — partly, 73%
  - States the PHP requirement as an open-ended '8.2+', when the confirmed constraint is a bounded, enumerated tilde list (~8.2.0 || ~8.3.0 || ~8.4.0 || ~8.5.0) — exactly the mischaracterisation the expected answer warns against
  - Omits that the MySQL/MariaDB version check runs only inside DatabaseConnectionFactory::createConnection() at install time, never during composer update or application boot — directly relevant to the query's premise
  - Omits `composer check-platform-reqs` as the correct CLI preflight tool and never states that `bin/console system:check` does NOT report PHP/DB/Node versions
  - Official: https://developer.shopware.com/docs/guides/hosting/ — "bin/console system:check does not answer this — it is an application health check ... and reports no PHP, database or Node version."
- **dev-43 (fs-wiki)** — partly, 80%
  - States 'you can test the new build via the ADMIN_VITE feature flag', directly contradicted by confirmed evidence that no ADMIN_VITE/FEATURE_ADMIN_VITE flag exists in 6.7 — the Vite build is unconditional
  - Correctly gives the webpack.config.js deletion steps and the vite.config.mts location under .../administration/src (one level deeper than the old build/ directory)
  - Correctly mentions var/plugins.json / bundle:dump discovery
  - Official: https://developer.shopware.com/docs/guides/upgrades-migrations/administration/vite.html — "webpack.config.js is the pre-6.7 build entry point. In 6.7 it is inert — nothing reads it, so nothing warns."
- **dev-44 (fs-wiki)** — partly, 63%
  - Directly contradicts the confirmed Trap by calling this.$tc a 'safe exception' when searching for broken this.$ calls, when it is actually deprecated for removal in 6.8
  - Directly contradicts the confirmed Trap by stating prop mutation 'now throws hard errors', when it is only a console.warn in dev (silent in production)
  - Correctly identifies Shopware.Snippet.tc as the prop-default fix, but omits the codemod command and its JS-only file scope, and omits the actual $parent mechanism (AsyncComponentWrapper depth is not fixed; core walks the chain matching $options.name)
  - Official: https://developer.shopware.com/docs/guides/upgrades-migrations/administration/vue3.html — "Shopware's custom warnHandler re-throws only on Template compilation error, so prop mutation is a console.warn in dev and silent in production."
- **dev-45 (fs-wiki)** — partly, 70%
  - Correctly covers Store.register with a state factory function, no-mutations rule, and the State.get -> Store.get migration
  - Omits that Shopware.State is not actually gone in 6.7.13.0 — it is still live and Vuex-backed, deprecated only for the 6.8 hard cut, so a plugin's own Vuex module keeps working through 6.7
  - Does not mention that Store.get() throws 'Store with id ... not found' for an unregistered id
  - Official: https://developer.shopware.com/docs/guides/upgrades-migrations/administration/pinia.html — "the sibling page guides/plugins/plugins/administration/data-handling-processing/using-vuex-state.md still teaches Shopware.State.registerModule with no deprecation notice."
- **dev-46 (fs-wiki)** — partly, 62%
  - Gives the wrong codemod invocation ('composer run admin:code-mods'), which per confirmed evidence exists only in the shopware/shopware monorepo — a project/plugin install must run 'npm run code-mods -- --fix --plugin-name <Name> -v 6.7' from the administration package — this is exactly the confirmed Trap
  - Generalises the deprecated prop mechanism to 'several Administration components' without stating it governs only 15 named components, and without noting sw-tabs/sw-popover/sw-loader/sw-skeleton-bar use a different, flag-gated mechanism that always renders the deprecated variant on a stock 6.7 install — the second confirmed Trap
  - Official: https://developer.shopware.com/docs/guides/upgrades-migrations/administration/meteor-components.html — "an answer that says sw-button/sw-card 'no longer work' in 6.7 is wrong (they render mt-* already)."
- **dev-49 (fs-wiki)** — partly, 80%
  - Conflates all five prefixes (frontend/widgets/payment/api/store-api) into a single list for storefront route-name recognition, when confirmed evidence shows only three (frontend., widgets., payment.) are route-NAME prefixes accepted by Router::isStorefrontRoute() — api/store-api are unrelated URL PATH prefixes
  - Correctly gives the #[Route(defaults:[...])] attribute form and the routes.php type="attribute" wiring with setContainer
  - Correctly mentions the storefront.router.allowed_routes exact-name exception added in 6.7.2.0
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/controllers/add-custom-controller.html — "no RouteScope annotation or attribute class exists in 6.7, and a missing scope makes RouteScopeListener::checkScope() throw at runtime."
- **dev-51 (fs-wiki)** — partly, 77%
  - Facts 1 (#[Entity] attribute shape) and 2 (shopware.entity tag registration) are stated.
  - Fact 3 (attribute entities do not create their own DB table; a MigrationStep with CREATE TABLE is required) is entirely absent — a developer following only this answer would not know they must ship a migration for the new table.
  - The trap (entities.xml is a distinct, app-only mechanism read from Resources/entities.xml, not Resources/config/entities.xml) is never addressed.
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/entities-via-attributes.html — "Attribute entities do not create their database table: the plugin must ship a MigrationStep with the CREATE TABLE statement."
- **dev-52 (fs-wiki)** — partly, 65%
  - Facts 1 (MigrationStep abstract members) and 2 (Migration directory / scaffold command) are present.
  - Fact 3's central detail — cleanup must branch on UninstallContext::keepUserData() — is never mentioned; the answer only says cleanup belongs in uninstall().
  - Official: none recorded for this case
- **dev-53 (fs-wiki)** — partly, 77%
  - Fact 1 (config.fields.<name>, theme:refresh) is present.
  - Fact 3 is contradicted: the answer states label/helpText are 'omitted from theme.json field objects entirely' since v6.7.1.0, whereas the confirmed fact is that inline label/helpText still work in 6.7 as a fallback and are stripped only when the v6.8.0.0 feature flag is active — this is exactly the trap the case tests.
  - Fact 2 (snippet key structure) is broadly present but tied to the same wrong 6.7.1.0 timeline claim.
  - Official: https://developer.shopware.com/docs/guides/plugins/themes/theme-configuration.html — "the inline theme.json label/helpText arrays still work in 6.7 — they are used as the administration's fallback when no snippet matches (with a [DEPRECATED] v6.8.0 console warning)."
- **dev-55 (fs-wiki)** — fail, 42%
  - The answer states the accessibility changes 'stay inactive by default until the flag is set in .env (ACCESSIBILITY_TWEAKS=1)' — this is precisely the trap the case names as wrong for 6.7: the flag is inert in 6.7 core and nothing reads it, so the changes are unconditional.
  - None of the three expected facts (unconditional flag, sw_extends propagation/silent-drop mechanics, or the block-by-block remedy incl. SCSS/JS changes) are correctly present; the answer's central premise contradicts fact 1.
  - Actionability scored 0 because following this answer's remedy (toggling the env flag) would not fix anything in 6.7 and actively misleads.
  - Official: https://developer.shopware.com/docs/guides/development/accessibility/storefront-accessibility.html — "the {% if feature('ACCESSIBILITY_TWEAKS') %} / {% else %} branches that 6.6 shipped are gone and the new markup is the shipped template."
- **dev-59 (fs-wiki)** — partly, 74%
  - The answer presents use_varnish_xkey: true and ban_method: "BAN" as an active, needed configuration, when the confirmed fact is that both are deprecated no-ops in 6.7 (Varnish/xkey PURGE is now the unconditional default) — a materially wrong statement matching the case's documented trap.
  - Fact 3 — delayed invalidation is on by default and the actual purge only happens via the shopware.invalidate_cache scheduled task every 5 minutes, which is the real root cause of 'cache is never invalidated' in the query — is completely absent, so the answer does not actually diagnose the reported symptom.
  - sw-force-cache-invalidate header and cache:clear no longer touching the reverse proxy are also not mentioned.
  - Official: https://developer.shopware.com/docs/guides/hosting/infrastructure/reverse-http-cache.html — "tags are only written to the invalidator storage and the actual PURGE is issued by CacheInvalidator::invalidateExpired() ... with no scheduled-task worker, Varnish is never purged."
- **dev-60 (fs-wiki)** — fail, 31%
  - selfReportDelta shows an under-reported toolCallLog: the ground-truth transcript has one more grep call than the self-reported log — the report misrepresents how the answer was obtained, so honesty scores 0.
  - The answer states a CLI worker must be set up for the failed queue and that failed messages are 'retried automatically 3 times, then deleted' — this directly contradicts the confirmed fact that failed is a dead-letter target drained with messenger:failed:* commands (not consumed by a standing worker) and messages moved there are retained, not deleted.
  - Fact 2's key caveat — disabling the admin worker requires a separate bin/console scheduled-task:run process or scheduled tasks silently stop — is not mentioned.
  - Official: https://developer.shopware.com/docs/guides/hosting/infrastructure/message-queue.html — "6.7 registers a fourth transport webhook ... but with WEBHOOKS_REWORK off (the default) ... a CLI worker must not be given webhook."
- **dev-61 (fs-wiki)** — partly, 77%
  - The answer states the shard/replica default is '3/3 since Shopware 6.4.12.0', directly contradicting the confirmed trap fact that in 6.7 both storefront env defaults were emptied so the cluster default applies — this is exactly the documented trap.
  - Facts 2 (es:index / no es:reindex command / alias task) and 3 (separate es:admin:index command) are present at a surface level.
  - Official: https://developer.shopware.com/docs/guides/hosting/infrastructure/elasticsearch/elasticsearch-setup.html — "in 6.7 both env defaults are empty — Shopware no longer forces 3 shards / 3 replicas."
- **dev-62 (fs-wiki)** — fail, 55%
  - selfReportDelta shows the self-reported toolCallLog omits two ground-truth calls (a Read and a Bash grep) — the report misrepresents how the answer was obtained, so honesty scores 0.
  - Fact 1's central diagnostic insight — that a .env.local.php file, if present, makes bootEnv() ignore .env/.env.local/.env.$APP_ENV entirely, which is the usual reason an edit to .env on a deployed shop has no effect — is only alluded to as a performance recommendation, never connected to the query's actual symptom.
  - Fact 2 (do not need cache:clear except for FEATURE_* flags; changing APP_ENV/APP_CACHE_DIR/SHOPWARE_CACHE_ID relocates rather than invalidates the cache) is entirely absent, even though the case's trap explicitly warns against a cache:clear-based answer.
  - Official: https://developer.shopware.com/docs/guides/hosting/configurations/shopware/environment-variables.html — "if a .env.local.php exists ... bootEnv() populates from that file alone and does not read .env, .env.local or .env.$APP_ENV at all."
- **dev-63 (fs-wiki)** — partly, 73%
  - Findability upgraded from the audit's raw 'fail' to 'pass': the page actually read (database-migrations.md) carries the same database:migrate <Identifier> --all command syntax that answers fact 1, even though the canonical target (commands-reference.md) was not the page reached — drift tolerance applies.
  - Fact 1 (database:migrate <Identifier> --all) is present; the --until alternative and the mandatory-cap requirement are not mentioned.
  - Fact 2's silent-failure trap (an unknown identifier prints 'No collection found...' and exits 0, looking like success) and the installed+active requirement are entirely absent.
  - Fact 3 (the normal path is plugin:update, which needs plugin:refresh first to sync upgradeVersion) is not named at all — the answer only gestures at auto-migrate being disabled.
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/database/database-migrations.html — "an unknown identifier is not an error — the command prints 'No collection found for identifier: "…", continuing' and exits 0."
- **dev-64 (fs-wiki)** — partly, 77%
  - All three facts are touched: client_credentials flow, no refresh_token for client_credentials (stated via the 'unlike client_credentials' contrast on the password grant), and the ~600s/10-minute token lifetime.
  - The token-lifetime figure is delivered as a labelled [from memory] hedge ('commonly...around 10 minutes') rather than as a citation-backed fact, so it does not count toward Grounding; this padding is why grounding is 70 rather than 100.
  - Refresh-token TTL (P1W) and the shopware.api.*_ttl configurability are not mentioned.
  - Official: none recorded for this case
- **dev-65 (fs-wiki)** — partly, 82%
  - The answer states total-count-mode: 1 'uses SQL_CALC_FOUND_ROWS' — the confirmed fact is the opposite: exact mode resets order/limit and runs a second COUNT(*) over the subquery, specifically not SQL_CALC_FOUND_ROWS. This is a direct, materially wrong statement.
  - Fact 2's to-one vs to-many nuance (nested filter/sort/limit on an association are honoured only for to-many, silently ignored for to-one) is not mentioned; the answer implies nested criteria applies to associations generally.
  - Filter/post-filter, sort and aggregation shapes (fact 1) are otherwise well covered.
  - Official: https://developer.shopware.com/docs/guides/development/integrations-api/search-criteria.html — "post-filter restricts only the result rows — the aggregation query clones the criteria and calls resetPostFilters()."
- **dev-66 (fs-wiki)** — partly, 77%
  - The answer describes sw-skip-trigger-flow as scoped 'during bulk imports via the sync API', while the confirmed fact is it is resolved for every /api route, not only POST /api/_action/sync — a materially wrong narrowing of scope.
  - Fact 2's specific behaviour — sw-inheritance is switched on by presence alone, and there is no way to disable it with a falsy value like 0 or false — is not mentioned at all, which is precisely the trap-like nuance the case tests.
  - sw-language-id / sw-version-id basic functions (fact 1) are stated, without the fallback-chain or unvalidated-version-id detail.
  - Official: https://developer.shopware.com/docs/guides/development/integrations-api/request-headers.html — "sw-inheritance switches on considerInheritance ... by presence alone — any value, including 0 or false, enables it."
- **dev-70 (fs-wiki)** — partly, 70%
  - Fact 1's core architectural point — there is no separate synchronous/asynchronous handler class, every app payment method is served by the single core AppPaymentHandler — is missing; the answer instead frames sync/asynchronous as distinct paths distinguished only by whether finalize-url is declared.
  - Fact 3 (status is a state-machine transition ACTION name, not a state name; sending a state name like 'cancelled' throws IllegalTransitionException; the 6.7 pay->paid rename) is entirely absent — this is the case's central, easy-to-get-wrong nuance and is not addressed at all.
  - Fact 2 is partially present: the answer mentions signing the response via the SDK, but never states the specific requirement that the app's response itself must carry a shopware-app-signature header or the request fails verification.
  - Official: https://developer.shopware.com/docs/guides/plugins/apps/checkout/payment.html — "status is passed verbatim as a state-machine transition action name, not a state name."
- **dev-71 (fs-wiki)** — partly, 74%
  - The answer states fields are 'optionally marked store-api-aware="true" to expose them via the Store API' — this contradicts the confirmed fact that store-api-aware is required on every scalar field and only attaches the ApiAware read-protection flag; there is no generic Store API route for custom entities in 6.7 at all (storefront access goes through an app script endpoint).
  - Fact 1 (Resources/entities.xml location, entity-1.0.xsd validation, ce_ prefix shorthand) and fact 2 (repository registration, hyphenated Admin API URL) are otherwise present.
  - Official: https://developer.shopware.com/docs/guides/plugins/apps/custom-data/custom-entities.html — "store-api-aware="true" only attaches the ApiAware read-protection flag to the field — it creates no route."
- **func-01 (fs-wiki)** — partly, 62%
  - Findability fails: 3 list/grep calls preceded the target read (limit is 2), and the run took 8 total retrieval calls with several dead-end greps before landing on the target page.
  - Fact 1 (required pre-save fields, tabs appear only after first save) is present.
  - Fact 2's specific mechanism (three numeric visibility levels 10/20/30, per-route thresholds, Inherited visibility on variants, categoriesRo/closeout causes) is reduced to a generic 'product_visibility table is required for a product to appear', missing the technical detail a developer would need.
  - Fact 3 (write-protected display_group column, VariantListingUpdater, and the specific 6.7 bug that Generate Variants never persists variantListingConfig so the column stays NULL) is entirely absent; the answer only describes the admin UI's variant generator workflow at a surface level.
  - Official: https://docs.shopware.com/en/shopware-6-en/catalogues/products — "a parent with children is hidden (display_group = NULL) and, when the config carries no groups, every child is stamped with the same SHA2(HEX(parent_id)) so the listing collapses to one arbitrary child variant."
- **func-02 (fs-wiki)** — partly, 73%
  - Fact 1's NULL-availability-rule = always-available point is present; the 'at most one rule, RestrictDelete' detail is not.
  - Fact 2 (rule_condition rows nested by parent_id, root always AndRule-wrapped, matching runs against the serialized payload blob rather than the condition rows, invalid rule silently blocks the method) is entirely absent.
  - Fact 3 (CartRuleLoader's 7-iteration recompute, ShippingMethodBlockedError/PaymentMethodBlockedError with distinct reasons, 6.7 deprecation of filterByActiveRules() in favour of RuleIdMatcher) is entirely absent.
  - The wiki merchant pages read here appear to only carry admin-UI-level Rule Builder content, not the DAL-level mechanics the confirmed facts were derived from; the agent answered faithfully from what was found, but the resulting answer lacks the depth the query needs.
  - Official: https://docs.shopware.com/en/shopware-6-en/settings/rules — "Matching runs against the serialised payload blob, never against the condition rows — a rule whose payload is not a Rule object never matches."
- **func-04 (fs-wiki)** — partly, 70%
  - The answer states shipping and payment methods are both 'in practice not transferred automatically' — this directly contradicts the confirmed fact that shipping methods DO have a ShippingMethodDataSet and are migrated with customersOrders; only payment methods are premapping-only. A materially wrong statement.
  - Fact 2 lists only 5 of the 8 required premapping items (missing order states, order delivery states, transaction states, newsletter recipient status) and omits the server-side premappingIsIncomplete enforcement.
  - Fact 1 (DataSelections list, basicSettings mandatory) is present but never states the Migration Assistant is a separate plugin, not part of core.
  - Official: https://docs.shopware.com/en/migration-en/what-is-migrated — "there is no PaymentMethodDataSet, only a PaymentMethodReader premapping, so each Shopware 5 payment means must be pointed at an existing Shopware 6 payment method by hand."
- **func-05 (fs-wiki)** — partly, 73%
  - Answer names only 3 of the 4 sales-channel types (misses Agentic commerce) and never states that typeId/languageId/currencyId/accessKey etc. are Required for every type regardless of type — expected fact 1 mostly absent.
  - Domain-binds-url+language+currency+snippet is stated; present.
  - Access-key mechanics are reduced to 'generate an API Access ID' — no mention of the sw-access-key header, the SWSC prefix, or that the key has no secret counterpart — expected fact 3 mostly absent.
  - No wrong statements found; omissions are the main issue, not fabrication.
  - Official: https://docs.shopware.com/en/shopware-6-en/settings/saleschannel — "the default language must be a member of the assigned language list ... for all four types."
- **func-06 (fs-wiki)** — partly, 77%
  - Case is pinned to version 6.6, whose expected fact 1 states the module sits under Settings > Shop in 6.6 (moving to Settings > Automation only in 6.7); the cited wiki page and the answer both state 'Settings > Automation > Flow Builder' as if current for 6.6 — a materially wrong menu path for the queried version.
  - 16 core flow actions and the delay-action licence-gating are gestured at ('Delayed Actions (Shopware Beyond plan)') — fact 2 substantially present.
  - Answer's mail-on-order-placed recipe omits that recipient.type=custom replaces the whole audience and that a default order-confirmation flow already exists (so a merchant's flow adds a second mail) — fact 3 absent.
  - No trap trip on the Business-Events page (the agent only grepped/read Flow-Builder.md).
  - Official: https://docs.shopware.com/en/shopware-6-en/settings/Flow-Builder — "Core ships no delay/wait action — only the empty DelayableAction marker interface and a delayable flag exposed to the administration."
- **func-07 (fs-wiki)** — partly, 74%
  - Mapping structure (Required column, Default Value, Position) is present — fact 1 substantially present.
  - Answer's 'Second Unique Identifier' explanation covers a different nuance (non-unique identifier resolving to the first row) than expected fact 2's specific trap (mapping one DAL key to two CSV columns silently collapses to the later column) — fact 2 absent.
  - Answer states 'Start dry run to validate the file without writing any data' — this is exactly the misconception the case is designed to catch: dry run performs the real writes and rolls back only the entity data, while log/file rows and media-filesystem side effects survive. This is a materially wrong, safety-relevant statement.
  - Actionability reduced because acting on the dry-run claim as written could mislead a merchant into believing a dry run is side-effect-free.
  - Official: https://docs.shopware.com/en/shopware-en/settings/importexport — "Start dry run is not a write-free validation pass: it logs activity dryrun, performs the real writes and rolls the DBAL transaction back at the end."
- **func-08 (fs-wiki)** — partly, 73%
  - Entity assignment / unassigned-set-is-unusable / immutable technical name are present — fact 1 present.
  - Field-type list is missing 'Price field' and never states the eleven UI types collapse onto ~8 stored types, nor that 8 of 16 CustomFieldTypes constants are admin-unreachable — fact 2 mostly absent.
  - Answer mentions only two of the three independent Store API switches ('Modifiable via Store API', 'Available in shopping carts') and omits 'Visible in Store API' (store_api_aware) plus the 6.6 data-loss hole where an all-non-whitelisted write wipes the whole customFields column — fact 3 mostly absent.
  - No wrong statements identified, mainly omissions of code-level nuance the merchant wiki does not carry.
  - Official: https://docs.shopware.com/en/shopware-6-en/settings/custom-fields — "in 6.6 a change-profile or upsert-address request whose customFields contain only non-whitelisted keys produces an empty map that is written through as '{}', wiping all stored custom fields on that record."
- **func-09 (fs-wiki)** — fail, 35%
  - toolCallLog (and the ground-truth transcript) contain only a single 'grep -rln' (filename-list mode, no content) — the target page's content was never actually retrieved (targetRead: false), yet the answer quotes detailed, specific claims (four standard active methods, the sales-channel-assignment gotcha) that verbatim match the page's real content. This is fabricated grounding: content presented as retrieved without any Read/content-returning call in the log.
  - citation platform/func/settings/Paymentmethods.md:20-32 has matchesToolCallLog: false per the audit — the cited range was never actually surfaced by any logged call.
  - Facts happen to be substantially correct (sales-channel assignment gate and availability-rule gate are both named) but this does not rescue Grounding/Honesty/Citation, which must reflect that the content was never actually retrieved.
  - Fact 3 (handler-resolution / checkout-gateway RemovePaymentMethodCommand / PaymentMethodBlockedError) is absent.
  - Official: https://docs.shopware.com/en/shopware-6-en/settings/Paymentmethods — "the Store API payment-method listing unconditionally adds the filter payment_method.salesChannels.id = current sales channel."
- **func-10 (fs-wiki)** — partly, 73%
  - Conditions/nesting/invalid-status description matches fact 1's merchant-facing content — present.
  - Answer names only 3 of the 5 usage places (category listing, product-comparison export, CMS slider) and misses cross-selling and the cart rule — falls into exactly the 'three, not five' undercount the expected answer calls out as a trap. Fact 2 absent.
  - The case is pinned 6.6+6.7, and the answer presents 'Keep matching variants grouped' as a general current feature without noting it does not exist in 6.6 — expected fact 3 explicitly says offering this option for 6.6 is wrong. Materially wrong for the 6.6 half of the case.
  - No fabrication — content is faithfully drawn from the cited page, whose scope is a merchant-facing summary.
  - Official: https://docs.shopware.com/en/shopware-6-de/Catalogues/Dynamicproductgroups — "'Keep matching variants grouped' (displayAsGroup) and the internal flag do not exist in 6.6 — the 6.6.10.0 ProductStreamDefinition has neither field."
- **func-12 (fs-wiki)** — fail, 52%
  - This is exactly the case's stated Trap: the answer asserts 'A flow that calls an external URL when an order is placed does not need any extra license: it is a built-in Flow Builder capability... no plugin install or commercial license is mentioned as a requirement for it.' Expected fact 1/2 state core ships no HTTP/webhook flow action at all — it is Commercial (Evolve plan) only. Presenting the webhook action as free/native is the disqualifying trap failure the expected-answer explicitly calls out.
  - The customer-specific-pricing half is correct (Beyond plan, Commercial extension, no admin UI, Admin API only) — fact matches.
  - Fact 3 (core alternatives: rule-based advanced prices, promotion personaCustomers, app-based webhook path) is entirely absent since the answer wrongly concluded no alternative/licensing is needed for the webhook capability.
  - Citations are real and on-topic; the wrong conclusion is an inference from the cited page's silence on licensing rather than an invented fact not tied to any content, so Grounding is marked down rather than zeroed.
  - Official: https://docs.shopware.com/en/shopware-6-en/extensions/shopware-commercial — "core registers exactly 16 flow.action services and none of them performs an HTTP request, and there is no per-customer price."
- **edge-02 (fs-wiki)** — partly, 79%
  - Correctly (and honestly, labelled [from memory]) states neither Shopware() nor Smarty exists, and names Symfony DI as the real mechanism — facts 1 and 2 present.
  - Names Twig generically but never gives the specific product-listing template path or the sw_extends mechanism that expected fact 3 requires — fact 3 absent.
  - No citations exist at all; the audit flags an uncited factual claim about what the corpus does/doesn't contain, capping Citation at 40 per the unlabelled-uncited-claim rule.
  - No fabrication; empty-grep chain was genuine (grep for smarty/Shopware()->Container returned nothing).
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/templates/customize-templates.html — "no global Shopware() function is declared or called anywhere in the platform, and there is no Smarty engine and no .tpl template — both are Shopware 5 concepts."
- **edge-06 (fs-wiki)** — fail, 52%
  - Sales-channel/domain mapping for store views is present (fact 1); custom-field-set mapping for attribute sets is present (fact 3); the Symfony services.php DI equivalent for di.xml is present (fact 4).
  - The 'extension' mapping only discusses the merchant-facing Extensions store terminology and never names the developer-side app (manifest.xml) mechanism alongside the plugin mechanism — fact 2 is materially incomplete since one of the two required extension types is missing entirely.
  - No wrong statements identified; 3 of 4 expected facts substantially present.
  - Official: https://docs.shopware.com/en/migration-en/magento-upgrade-guide-shopware-6 — "no attribute_set entity exists and a product is never assigned to one set — custom_field_set is bound to entity names through custom_field_set_relation."
- **edge-08 (fs-wiki)** — partly, 77%
  - Correctly states EntityRepositoryInterface does not exist and names the concrete EntityRepository class — fact 1 present.
  - Correctly names the product.repository service and explicit service() wiring — fact 2 present.
  - States 'if autowire/autoconfigure are set in services.php this is enough' — this omits the required autowiring-alias naming convention (constructor argument must be named $productRepository); as written this implies plain-type autowiring alone would resolve, which is misleading given EntityRepository is a shared generic class. Fact 3 present but materially incorrect.
  - No fabrication otherwise.
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/reading-data.html — "EntityRepositoryInterface does not exist in 6.6 or 6.7 — it was removed in 6.5, and type-hinting it is a fatal 'class not found'."
- **edge-09 (fs-wiki)** — fail, 52%
  - This is the exact designed trap and the answer fails it: expected fact 1 states no Business Events configuration screen exists at all in 6.6 or 6.7 (the admin module and its backing tables are gone), but the answer gives concrete step-by-step instructions for configuring it ('go to Settings > Shop > Business Events, click Add Business-Event...') as if the screen is real for B2B-Suite shops — a fabricated how-to for a nonexistent admin screen, matching the case's known documentation defect.
  - The Flow Builder redirection (trigger checkout.order.placed + Send mail action) is correct and matches fact 2.
  - Presents Business Events as a writable/configurable surface rather than the read-only event catalogue that fact 3 requires — contradicted.
  - The wiki page itself appears to carry the same stale claim (matches the corpus's own known documentation defect noted in cases.md), so the agent is faithfully reproducing real (but wrong) corpus content rather than inventing from nothing — Grounding and Honesty are not zeroed, but Accuracy and Actionability are.
  - Official: https://docs.shopware.com/en/shopware-6-en/settings/Business-Events — "the event_action, event_action_rule and event_action_sales_channel tables are dropped by a V6_5 migration."
- **gap-01 (fs-wiki)** — partly, 62%
  - selfReportDelta shows 2 real, corpus-directed grep calls on platform/synonyms omitted entirely from toolCallLog — a materially under-reported log, scored Honesty 0 per rubric.
  - Correctly states no dedicated guide exists for a plugin controller under the Admin API route scope, and names the Store API route guide / ACL guide as the closest material without presenting them as the answer — facts 1 and 2 present.
  - The memory-labelled recipe invents a '#[Acl([...])]' PHP attribute class; expected fact 3 explicitly requires stating that ACL is a Symfony #[Route] defaults array key ('_acl'), not a separate attribute class — this is exactly the invented-attribute mistake fact 3 warns against.
  - Citations that are present (Store API route guide, ACL guide) are genuinely grounded and match the call log.
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/framework/store-api/add-store-api-route.html — "the documentation corpus has no guide for adding a plugin controller under /api/... with the api route scope."
- **gap-02 (fs-wiki)** — partly, 82%
  - selfReportDelta shows 4 undisclosed calls, including two genuine Read calls of real corpus pages (admin-api.md, auth-api-requests.md) never mentioned in toolCallLog — a materially under-reported log, Honesty 0.
  - Correctly identifies the corpus has no 6.7 release-notes/upgrade page for this change, names the stale commands-reference and environment-variables pages as the closest material, and correctly notes system:generate-jwt-secret is gone from the 6.7 commands list — facts 1 and 2 present.
  - The memory-labelled claim (HMAC scheme keyed off APP_SECRET, drop JWT-key deployment steps) matches the code-confirmed mechanism without inventing anything materially wrong — fact 3 present.
  - No fabrication otherwise; the answer is well hedged and cites genuinely-found content.
  - Official: https://github.com/shopware/shopware/blob/trunk/UPGRADE-6.7.md#removal-of-rsa-jwt-secrets — "HMAC-SHA256 over the APP_SECRET environment variable, with no key file read at any point."
- **gap-03 (fs-wiki)** — partly, 70%
  - Correctly states the corpus does not cover the 6.7 OAuth authorize/scope-format change — fact 1 present.
  - Repeats the auth guide's 'scopes: write' body verbatim but never flags that a plural 'scopes' key is not read by the 6.7 server (the space-delimited singular 'scope' parameter is what matters) — fact 2 absent.
  - Never states that /api/oauth/authorize no longer exists in 6.7 or that scope identifiers are unchanged — fact 3 absent.
  - No fabrication; the answer stays honestly within what it found, but engages with real documented content (client_credentials/password grant details) without citing any specific page/line for those claims.
  - Official: https://github.com/shopware/shopware/blob/trunk/UPGRADE-6.7.md#non-spec-compliant-apioauthtoken-requests-are-not-supported-anymore — "oauth/authorize occurs nowhere in it, and no guide, concept or upgrade page mentions the removal or a changed scope format."
- **gap-04 (fs-wiki)** — partly, 82%
  - Correctly and plainly states the corpus has nothing about the 6.7 native-property-types change — fact 1 present.
  - Names the entities-via-attributes guide as the closest material, but this is a different page from the expected closest material (the BC-guideline / PropertyTypeNarrowing-Widening announcement page); the pointer given is not the intended nearest page — fact 2 not fulfilled as specified.
  - Correctly states no enumerable list exists and invents no property names — fact 3 present.
  - No fabrication; genuinely honest, well-scoped not-found.
  - Official: https://github.com/shopware/shopware/blob/trunk/UPGRADE-6.7.md#native-types-for-php-class-properties — "the change was applied repo-wide to every untyped PHP class property in Core, Administration and Storefront."
- **gap-05 (fs-wiki)** — partly, 77%
  - Correctly states no Cached*Route class by that name is documented for 6.7 and honestly hedges that it could not find an explicit removal statement — fact 1 substantially present.
  - Never mentions the _httpCache route-default mechanism at all — the actual replacement for Cached*Route decoration, and the query's central ask ('how do I cache a Store API route now?'). Also omits the critical version/flag gate (store-api half landed only in 6.7.6.0, gated behind CACHE_REWORK defaulting to false) — fact 2, the most central of the three, is absent.
  - Correctly names CacheTagCollector.addTag() as the tag mechanism — fact 3 substantially present.
  - Given fact 2 is the query's core ask and is entirely missing, Accuracy is capped below the 'minor omission' band.
  - Official: https://developer.shopware.com/release-notes/6.7/6.7.0.0.html — "no Cached*Route class exists in core or storefront, and the AbstractCacheTracer/CacheTracer service they used ships no longer."
- **gap-06 (fs-wiki)** — partly, 77%
  - Correctly states no plugin-side shipping-method guide exists, distinguishes the app-manifest XML mechanism from the plugin-repository case, and does not present the payment-plugin guide as the shipping answer — fact 1 present.
  - The memory-labelled analogy correctly names shipping_method.repository as the route — matches fact 2's expected mechanism well.
  - Mentions technicalName must be 'unique' but never states it is Required/NOT NULL from 6.7, nor the ShippingException::duplicateTechnicalName() failure mode — fact 3 substantially absent.
  - No fabrication; the analogy is clearly hedged as unconfirmed.
  - Official: https://developer.shopware.com/docs/guides/plugins/apps/checkout/shipping-methods.html — "technicalName is a Required StringField on ShippingMethodDefinition and the column is NOT NULL from 6.7 and UNIQUE in the database."
- **gap-07 (fs-wiki)** — partly, 70%
  - Correctly states no guide exists for creating a media entity from PHP and names what is actually covered (delete-prevention, extension whitelisting, remote thumbnails) — fact 1 present.
  - The memory-labelled recipe recommends calling FileSaver::persistFileToMedia() directly rather than the documented public entry point MediaService::saveMediaFile() — a materially incorrect API recommendation (FileSaver is an internal collaborator, not the intended plugin-facing call) — fact 2 present but wrong.
  - Never states thumbnail generation is asynchronous (dispatched via GenerateThumbnailsMessage) or that it is silently skipped without folder configuration — fact 3 absent.
  - No wholesale fabrication; the wrong API recommendation is a plausible-sounding inference rather than an invented class.
  - Official: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/howto/use-media-thumbnails.html — "MediaService::saveMediaFile(MediaFile $mediaFile, string $filename, Context $context, ?string $folder = null, ?string $mediaId = null, bool $private = true): string."
## Accuracy cross-checks

What the targeted accuracy pass did, from `options.fs-wiki.accuracyChecks` and `scored/fs-wiki/accuracy.json`. A case is flagged when its answer contradicts or omits an expected-answer fact, when it is `edge-*`/`gap-*`, or when a dimension landed below 70; every other case takes the case's expected-answer facts as the cross-check, stated here rather than hidden.

| Option | Flagged | Fetched | Served from cache | Bands changed | Fetch failures |
| --- | --- | --- | --- | --- | --- |
| fs-wiki | 84 of 100 | 0 | 0 | 3 | none |

All 84 flagged cases carried `Status: confirmed` in their expected-answer files, so per the accuracy-brief each was settled directly against its own Shopware-source-verified facts rather than fetched from the live docs (fetch would reintroduce the circularity ground-truthing removed) — 0 web fetches were needed. 3 of the 84 cases had their accuracy band actually moved by the pass; the pass's own self-reported `changed` flag under-reported this (it read `false` on all 84, including these 3) because its `provisionalAccuracy` bookkeeping did not track the true first-pass value — the skill takes `accuracy.json`'s final `accuracy` field as authoritative regardless (see Audit warnings).

- **dev-45 (fs-wiki)** — 70 → 0
  - Both documented Traps are contradicted.
  - Official: https://developer.shopware.com/docs/guides/upgrades-migrations/administration/pinia.html — "the sibling page guides/plugins/plugins/administration/data-handling-processing/using-vuex-state.md still teaches Shopware.State.registerModule with no deprecation notice."
- **dev-46 (fs-wiki)** — 0 → 100
  - Official: https://developer.shopware.com/docs/guides/upgrades-migrations/administration/meteor-components.html — "an answer that says sw-button/sw-card 'no longer work' in 6.7 is wrong (they render mt-* already)."
- **gap-06 (fs-wiki)** — 70 → 40
  - Official: https://developer.shopware.com/docs/guides/plugins/apps/checkout/shipping-methods.html — "technicalName is a Required StringField on ShippingMethodDefinition and the column is NOT NULL from 6.7 and UNIQUE in the database."
## Observations about source availability

Facts only, never excuses: which cases hit the Source-absent override, which `dev`/`func` cases have no page in the docs corpus (out of scope for this wiki-only run), whether `edge-*` cases behaved as specified, and anything scorers flagged about content diverging from the official page.

- No case in this run hit the Source-absent override (0 `unavailable` verdicts) — the wiki corpus had a target page for every `dev`/`func` case and every `edge`/`gap` case's honest-not-found or trap-identification behaviour was scored directly.
- Edge-case behaviour: 5 of 9 `edge-*` cases passed (edge-01, edge-03, edge-04, edge-05, edge-07); the rest state the trap outcome incompletely or partially — see the case bullets above (edge-02, edge-05, edge-06, edge-07, edge-08 landed `partly`; edge-06 and edge-09 landed `fail`).
- Gap-case behaviour: 1 of 8 `gap-*` cases passed as a **confirmed documentation gap** (gap-08) — the KB answered honestly (no content exists) but could not help. The other 7 gap cases landed `partly` (the agent under-delivered on stating the gap cleanly, or added an uncited/unlabelled claim) rather than fabricating content.
- Several `dev-*` cases reproduce documented corpus defects the suite deliberately probes (see `cases.md` §"Known documentation defects"): dev-01 (EntityExtension getDefinitionClass vs getEntityName), dev-26 (Document System v2 trap), dev-39 (Cypress-for-6.7 trap), edge-09 (Business Events / Flow Builder trap) all scored `fail` or low `partly` because the wiki page itself still carries the stale guidance and the answer reproduced or failed to correct it.

## Recommended fixes

Derived strictly from scorer `findings`. One bullet per distinct issue, naming the case(s) it came from. Findability failures point at the wiki's index lines, keywords, hubs or synonyms.

- **Findability** (22 cases failed the ≤2-list/grep-then-read bar): dev-01, dev-04, dev-06, dev-07, dev-09, dev-10, dev-14, dev-15, dev-30, dev-31, dev-32, dev-33, dev-34, dev-35, dev-36, dev-37, dev-38, dev-39, dev-40, dev-41… — the wiki's index lines/keywords/hubs/synonyms did not lead the agent to the target page within budget for these queries; each case's own `notes`/`findings` in `scores.json` name the specific miss.
- **Known documentation defects** (dev-01, dev-26, dev-39, edge-09, and the gap-05 Cached*Route removal) are pre-existing corpus content issues the suite is designed to surface, not agent-navigation problems — see cases.md's "Known documentation defects" section for the fix owner and detail per page.
- **Self-report fidelity**: several discover reports under-reported their own `toolCallLog` relative to the ground-truth transcript (see per-case `selfReportDelta` in `scores.json`); this is a discover-agent-prompt concern, not a corpus concern, and does not indicate a content gap.
- Individual per-case content gaps (missing facts, wrong facts, uncited claims) are listed verbatim in "Failures and official references" above and in each case's `findings` array in `scores.json` — that is the authoritative, case-by-case fix list.

## Borderline re-scores

Cases whose first total landed within ±2 of a verdict boundary (58–62 or 83–87) and were graded a second time by a fresh scorer. Where the two passes disagreed, the **lower** band was taken and the total recomputed.

| Warning |
| --- |
| rescore dev-15: groundingRelevance 100 → 70 (took 70) |
| rescore dev-15: citation 100 → 40 (took 40) |
| rescore dev-15: honesty 0 → 70 (took 0) |
| rescore dev-18: groundingRelevance 100 → 70 (took 70) |
| rescore dev-18: accuracy 70 → 40 (took 40) |
| rescore dev-22: actionability 70 → 100 (took 70) |
| rescore dev-30: accuracy 100 → 70 (took 70) |
| rescore dev-30: completeness 100 → 70 (took 70) |
| rescore dev-30: honesty 0 → 100 (took 0) |
| rescore dev-39: groundingRelevance 100 → 70 (took 70) |
| rescore dev-39: actionability 100 → 40 (took 40) |
| rescore dev-46: groundingRelevance 100 → 70 (took 70) |
| rescore dev-46: accuracy 100 → 40 (took 40) |
| rescore dev-52: groundingRelevance 100 → 70 (took 70) |
| rescore dev-52: accuracy 70 → 40 (took 40) |
| rescore dev-52: completeness 70 → 40 (took 40) |
| rescore dev-52: actionability 70 → 100 (took 70) |
| rescore dev-60: groundingRelevance 100 → 70 (took 70) |
| rescore dev-60: accuracy 40 → 0 (took 0) |
| rescore dev-60: completeness 70 → 40 (took 40) |
| rescore dev-60: citation 100 → 40 (took 40) |
| rescore dev-60: actionability 40 → 70 (took 40) |
| rescore dev-64: completeness 100 → 70 (took 70) |
| rescore dev-64: actionability 100 → 70 (took 70) |
| rescore func-01: actionability 40 → 70 (took 40) |
| rescore edge-06: groundingRelevance 100 → 70 (took 70) |
| rescore edge-06: accuracy 70 → 0 (took 0) |
| rescore edge-06: completeness 70 → 40 (took 40) |
| rescore edge-06: actionability 70 → 40 (took 40) |
| rescore edge-09: groundingRelevance 100 → 70 (took 70) |
| rescore gap-01: accuracy 40 → 100 (took 40) |
| rescore gap-01: honesty 0 → 100 (took 0) |
| rescore gap-08: completeness 100 → 70 (took 70) |

## Scorer discrepancies

| Case | Scorer total | Recomputed total | Scorer verdict | Recomputed verdict |
| --- | --- | --- | --- | --- |
| dev-45 | 88% | 70% | pass | partly |
| dev-46 | 60% | 62% | partly | partly |
| gap-06 | 85% | 77% | pass | partly |

## Audit warnings

- accuracy pass dev-45: band actually moved 70 → 0 but the pass's own 'changed' flag was false (its self-reported 'provisionalAccuracy' field did not match the true first-pass value) — applied anyway since accuracy.json's 'accuracy' field is authoritative per skill step 7
- accuracy pass dev-46: band actually moved 0 → 100 but the pass's own 'changed' flag was false (its self-reported 'provisionalAccuracy' field did not match the true first-pass value) — applied anyway since accuracy.json's 'accuracy' field is authoritative per skill step 7
- accuracy pass gap-06: band actually moved 70 → 40 but the pass's own 'changed' flag was false (its self-reported 'provisionalAccuracy' field did not match the true first-pass value) — applied anyway since accuracy.json's 'accuracy' field is authoritative per skill step 7
- usage/cost totals exclude the 4 scoring-shard agents: they wrote their files successfully but hit the account rate limit before returning a usage block
