# KB quality report — fs-docs-2026-09-13-1644

## Run

| | |
| --- | --- |
| Run | `fs-docs-2026-09-13-1644` (`fs-docs`) |
| Options | fs-docs |
| Corpus | docs — fingerprint: developer 3a7f3af9c19f (2026-09-11T18:13:30+02:00), merchant fd093eda5f71 (2026-09-11T03:37:21Z) |
| Probe | fs entry points present: developer/index.md, merchant/index.md |
| Model | inherited (not pinned) |
| Generated | 2026-09-13T18:52:52Z |
| Cases run | 100 of 100 (all) |
| Yardstick | cases.md `ef932d8e`, scoring-rubric.md `54864fb4`, scorer-brief.md `1456b9ec`, auditor-brief.md `4c2c6fdc`, accuracy-brief.md `9009d748` |
| Execution | discover batches of 10, scorer shards of 25 (batched) |
| Skill | kb-factory-verify |

## Run cost

One row per option, sourced from `options.<option>.costs` and `costs.wallClockSeconds`.

| Option | Agents | Tokens | Tool calls | Summed agent time | Usage complete |
| --- | --- | --- | --- | --- | --- |
| fs-docs | 17 (10 discover, 1 audit, 4 score, 1 accuracy, 1 rescore) | 2651197 | 685 | 10382s | yes |

Wall-clock duration of the run: 7677s.

## Comparison

| Option | Access | Corpus | Overall | Status | Developer | Functional | Findable | Edge passed | Gap confirmed | Pass / partly / fail / unavailable / unscored | Weakest dimension |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| fs-docs | fs | docs | 80% | Not ready | 79% | 75% | 77 of 100 | 5 of 9 | 5 of 8 | 40 / 54 / 6 / 0 / 0 | accuracy |

Single-option run — no ranking or delta to compute (needs a second option via `compare`).

## Dimension heatmap

| Dimension | Weight | fs-docs |
| --- | --- | --- |
| Grounding & Relevance | 25 | 98.8 |
| Accuracy vs. Expected Answer | 25 | 55.7 |
| Completeness | 15 | 62.7 |
| Citation & Traceability | 10 | 96.3 |
| Honesty | 15 | 95.6 |
| Actionability | 10 | 81.6 |

Average band score, all 100 cases scored (0 unscored).

### By area

| Area | Cases | fs-docs average |
| --- | --- | --- |
| Admin API | 3 | 71% |
| Admin migration (Vue 3 / Vite / Pinia / Meteor) | 4 | 73% |
| Administration | 4 | 83% |
| App system | 5 | 77% |
| Checkout & Cart | 2 | 83% |
| Config & CLI | 5 | 84% |
| Content | 1 | 85% |
| Content (CMS/mail/SEO/media/sitemap) | 2 | 77% |
| Core breaking changes | 3 | 86% |
| DAL | 7 | 83% |
| Events | 6 | 83% |
| Gap | 8 | 89% |
| Hosting & ops | 5 | 70% |
| Merchant | 12 | 75% |
| Orders | 2 | 65% |
| Payment & Shipping | 1 | 88% |
| Platform upgrade | 2 | 93% |
| Plugin fundamentals | 1 | 85% |
| Services & DI | 3 | 75% |
| Store API & headless | 1 | 92% |
| Storefront | 9 | 83% |
| Testing | 3 | 63% |
| Theme | 2 | 83% |
| Trap | 9 | 83% |

## Verdict grid

| Case | Category | Area | fs-docs |
| --- | --- | --- | --- |
| dev-01 | dev | DAL | 73% partly ✗ |
| dev-02 | dev | Plugin fundamentals | 85% pass ✓ |
| dev-03 | dev | Store API & headless | 92% pass ✓ |
| dev-04 | dev | Content | 85% pass ✓ |
| dev-05 | dev | Theme | 85% pass ✓ |
| dev-06 | dev | Events | 82% partly ✓ |
| dev-07 | dev | DAL | 92% pass ✓ |
| dev-08 | dev | DAL | 92% pass ✓ |
| dev-09 | dev | DAL | 88% pass ✓ |
| dev-10 | dev | DAL | 77% partly ✓ |
| dev-11 | dev | Services & DI | 82% partly ✓ |
| dev-12 | dev | Services & DI | 55% fail – |
| dev-13 | dev | Services & DI | 88% pass ✓ |
| dev-14 | dev | Events | 100% pass ✓ |
| dev-15 | dev | Events | 73% partly ✓ |
| dev-16 | dev | Orders | 70% partly ✓ |
| dev-17 | dev | Checkout & Cart | 92% pass ✓ |
| dev-18 | dev | Checkout & Cart | 74% partly ✓ |
| dev-19 | dev | Events | 77% partly ✓ |
| dev-20 | dev | Events | 92% pass ✓ |
| dev-21 | dev | Events | 73% partly ✓ |
| dev-22 | dev | Config & CLI | 77% partly ✓ |
| dev-23 | dev | Content (CMS/mail/SEO/media/sitemap) | 77% partly ✓ |
| dev-24 | dev | Content (CMS/mail/SEO/media/sitemap) | 77% partly ✓ |
| dev-25 | dev | Config & CLI | 100% pass ✓ |
| dev-26 | dev | Orders | 60% partly ✓ |
| dev-27 | dev | Storefront | 100% pass ✓ |
| dev-28 | dev | Storefront | 95% pass ✓ |
| dev-29 | dev | Storefront | 80% partly ✓ |
| dev-30 | dev | Storefront | 88% pass ✓ |
| dev-31 | dev | Storefront | 73% partly ✓ |
| dev-32 | dev | DAL | 73% partly ✓ |
| dev-33 | dev | Administration | 63% partly ✓ |
| dev-34 | dev | Administration | 100% pass ✓ |
| dev-35 | dev | Administration | 88% pass ✓ |
| dev-36 | dev | Administration | 80% partly ✓ |
| dev-37 | dev | Testing | 80% partly ✓ |
| dev-38 | dev | Testing | 57% fail ✓ |
| dev-39 | dev | Testing | 51% fail – |
| dev-40 | dev | Platform upgrade | 85% pass ✓ |
| dev-41 | dev | Hosting & ops | 57% fail ✓ |
| dev-42 | dev | Config & CLI | 88% pass ✓ |
| dev-43 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 63% partly ✓ |
| dev-44 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 63% partly ✓ |
| dev-45 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 88% pass ✓ |
| dev-46 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 77% partly ✓ |
| dev-47 | dev | Payment & Shipping | 88% pass ✓ |
| dev-48 | dev | Storefront | 92% pass ✓ |
| dev-49 | dev | Core breaking changes | 85% pass ✓ |
| dev-50 | dev | Core breaking changes | 92% pass ✓ |
| dev-51 | dev | DAL | 88% pass ✓ |
| dev-52 | dev | Core breaking changes | 80% partly ✓ |
| dev-53 | dev | Theme | 80% partly ✓ |
| dev-54 | dev | Storefront | 80% partly ✓ |
| dev-55 | dev | Storefront | 56% fail ✓ |
| dev-56 | dev | Storefront | 80% partly ✓ |
| dev-57 | dev | Platform upgrade | 100% pass ✓ |
| dev-58 | dev | Hosting & ops | 88% pass ✓ |
| dev-59 | dev | Hosting & ops | 64% partly ✓ |
| dev-60 | dev | Hosting & ops | 70% partly ✓ |
| dev-61 | dev | Hosting & ops | 73% partly ✓ |
| dev-62 | dev | Config & CLI | 82% partly ✓ |
| dev-63 | dev | Config & CLI | 73% partly ✓ |
| dev-64 | dev | Admin API | 70% partly ✓ |
| dev-65 | dev | Admin API | 73% partly ✓ |
| dev-66 | dev | Admin API | 70% partly ✓ |
| dev-67 | dev | App system | 82% partly ✓ |
| dev-68 | dev | App system | 80% partly ✓ |
| dev-69 | dev | App system | 88% pass ✓ |
| dev-70 | dev | App system | 56% fail ✓ |
| dev-71 | dev | App system | 80% partly ✓ |
| func-01 | func | Merchant | 77% partly ✓ |
| func-02 | func | Merchant | 80% partly ✓ |
| func-03 | func | Merchant | 92% pass ✓ |
| func-04 | func | Merchant | 73% partly ✗ |
| func-05 | func | Merchant | 67% partly ✓ |
| func-06 | func | Merchant | 62% partly ✓ |
| func-07 | func | Merchant | 67% partly ✓ |
| func-08 | func | Merchant | 67% partly ✓ |
| func-09 | func | Merchant | 80% partly ✓ |
| func-10 | func | Merchant | 67% partly ✓ |
| func-11 | func | Merchant | 88% pass ✗ |
| func-12 | func | Merchant | 83% partly ✗ |
| edge-01 | edge | Trap | 100% pass – |
| edge-02 | edge | Trap | 85% pass – |
| edge-03 | edge | Trap | 85% pass – |
| edge-04 | edge | Trap | 67% partly – |
| edge-05 | edge | Trap | 95% pass – |
| edge-06 | edge | Trap | 62% partly – |
| edge-07 | edge | Trap | 71% partly – |
| edge-08 | edge | Trap | 100% pass – |
| edge-09 | edge | Trap | 83% partly – |
| gap-01 | gap | Gap | 100% pass – |
| gap-02 | gap | Gap | 91% pass – |
| gap-03 | gap | Gap | 76% partly – |
| gap-04 | gap | Gap | 74% partly – |
| gap-05 | gap | Gap | 88% pass – |
| gap-06 | gap | Gap | 80% partly – |
| gap-07 | gap | Gap | 100% pass – |
| gap-08 | gap | Gap | 100% pass – |

## Requests and responses

See `raw/fs-docs/<case-id>.json` and `derived/fs-docs/shard-*.json` for the full per-case tool-call logs and citation excerpts (omitted here for length — this report references them by case id above and in Failures below).

## Scores by case

### fs-docs

| Case | Grounding | Accuracy | Completeness | Citation | Honesty | Actionability | Total | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dev-01 | 100 | 40 | 70 | 100 | 70 | 70 | 73% | partly |
| dev-02 | 100 | 70 | 70 | 100 | 100 | 70 | 85% | pass |
| dev-03 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-04 | 100 | 70 | 70 | 100 | 100 | 70 | 85% | pass |
| dev-05 | 100 | 70 | 100 | 100 | 70 | 70 | 85% | pass |
| dev-06 | 100 | 40 | 100 | 100 | 100 | 70 | 82% | partly |
| dev-07 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-08 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-09 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-10 | 100 | 40 | 70 | 100 | 100 | 70 | 77% | partly |
| dev-11 | 100 | 40 | 100 | 100 | 100 | 70 | 82% | partly |
| dev-12 | 70 | 70 | 40 | 0 | 70 | 40 | 55% | fail |
| dev-13 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-14 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-15 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| dev-16 | 100 | 70 | 70 | 100 | 0 | 70 | 70% | partly |
| dev-17 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-18 | 100 | 40 | 70 | 100 | 100 | 40 | 74% | partly |
| dev-19 | 100 | 40 | 70 | 100 | 100 | 70 | 77% | partly |
| dev-20 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-21 | 100 | 40 | 70 | 100 | 70 | 70 | 73% | partly |
| dev-22 | 100 | 40 | 70 | 100 | 100 | 70 | 77% | partly |
| dev-23 | 100 | 40 | 70 | 100 | 100 | 70 | 77% | partly |
| dev-24 | 100 | 40 | 70 | 100 | 100 | 70 | 77% | partly |
| dev-25 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-26 | 100 | 0 | 0 | 100 | 100 | 100 | 60% | partly |
| dev-27 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-28 | 100 | 100 | 70 | 100 | 100 | 100 | 95% | pass |
| dev-29 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| dev-30 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-31 | 100 | 70 | 70 | 100 | 0 | 100 | 73% | partly |
| dev-32 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| dev-33 | 100 | 0 | 40 | 100 | 100 | 70 | 63% | partly |
| dev-34 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-35 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-36 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| dev-37 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| dev-38 | 100 | 0 | 0 | 100 | 100 | 70 | 57% | fail |
| dev-39 | 70 | 0 | 40 | 100 | 70 | 70 | 51% | fail |
| dev-40 | 100 | 40 | 100 | 100 | 100 | 100 | 85% | pass |
| dev-41 | 100 | 0 | 0 | 100 | 100 | 70 | 57% | fail |
| dev-42 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-43 | 100 | 0 | 40 | 100 | 100 | 70 | 63% | partly |
| dev-44 | 100 | 0 | 40 | 100 | 100 | 70 | 63% | partly |
| dev-45 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-46 | 100 | 40 | 70 | 100 | 100 | 70 | 77% | partly |
| dev-47 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-48 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-49 | 100 | 40 | 100 | 100 | 100 | 100 | 85% | pass |
| dev-50 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-51 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-52 | 100 | 70 | 40 | 100 | 100 | 70 | 80% | partly |
| dev-53 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| dev-54 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| dev-55 | 70 | 40 | 0 | 100 | 100 | 40 | 56% | fail |
| dev-56 | 100 | 70 | 40 | 100 | 100 | 70 | 80% | partly |
| dev-57 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-58 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-59 | 100 | 40 | 0 | 100 | 100 | 40 | 64% | partly |
| dev-60 | 100 | 40 | 40 | 100 | 100 | 40 | 70% | partly |
| dev-61 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| dev-62 | 100 | 70 | 70 | 70 | 100 | 70 | 82% | partly |
| dev-63 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| dev-64 | 100 | 40 | 40 | 100 | 100 | 40 | 70% | partly |
| dev-65 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| dev-66 | 100 | 40 | 40 | 70 | 100 | 70 | 70% | partly |
| dev-67 | 100 | 40 | 100 | 70 | 100 | 100 | 82% | partly |
| dev-68 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| dev-69 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-70 | 100 | 0 | 40 | 100 | 100 | 0 | 56% | fail |
| dev-71 | 100 | 70 | 40 | 100 | 100 | 70 | 80% | partly |
| func-01 | 100 | 40 | 70 | 100 | 100 | 70 | 77% | partly |
| func-02 | 100 | 70 | 40 | 100 | 100 | 70 | 80% | partly |
| func-03 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| func-04 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| func-05 | 100 | 40 | 0 | 100 | 100 | 70 | 67% | partly |
| func-06 | 70 | 40 | 0 | 100 | 100 | 100 | 62% | partly |
| func-07 | 100 | 40 | 0 | 100 | 100 | 70 | 67% | partly |
| func-08 | 100 | 40 | 0 | 100 | 100 | 70 | 67% | partly |
| func-09 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| func-10 | 100 | 40 | 0 | 100 | 100 | 70 | 67% | partly |
| func-11 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| func-12 | 100 | 70 | 40 | 100 | 100 | 100 | 83% | partly |
| edge-01 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| edge-02 | 100 | 70 | 70 | 100 | 100 | 70 | 85% | pass |
| edge-03 | 100 | 70 | 70 | 100 | 100 | 70 | 85% | pass |
| edge-04 | 100 | 70 | 40 | 40 | 70 | 40 | 67% | partly |
| edge-05 | 100 | 100 | 70 | 100 | 100 | 100 | 95% | pass |
| edge-06 | 100 | 40 | 40 | 40 | 70 | 70 | 62% | partly |
| edge-07 | 100 | 70 | 70 | 40 | 70 | 40 | 71% | partly |
| edge-08 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| edge-09 | 100 | 70 | 40 | 100 | 100 | 100 | 83% | partly |
| gap-01 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| gap-02 | 100 | 100 | 40 | 100 | 100 | 100 | 91% | pass |
| gap-03 | 100 | 40 | 40 | 100 | 100 | 100 | 76% | partly |
| gap-04 | 100 | 40 | 70 | 100 | 100 | 40 | 74% | partly |
| gap-05 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| gap-06 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| gap-07 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| gap-08 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |

`unavailable` means the Source-absent override applied. None occurred in this run.

## Failures and official references

- **dev-01 (fs-docs)** — partly, 73%
  - Answer states only `getDefinitionClass()` to name the extended entity, reproducing the KB's known 6.7 defect: in 6.7.13.0 `getDefinitionClass()` does not exist and `getEntityName(): string` is the sole abstract method — cases.md flags exactly this as a case that must fail an answer offering only `getDefinitionClass()` for 6.7.
  - Fact 2 (allowed extension field shapes / access via extensions bag) and fact 3 (shopware.entity.extension tag, BulkEntityExtension) are both present and correct.
  - Citation verified 1/1, matches toolCallLog, correct shape.
  - selfReportDelta: 2 missing calls are early `ls`/`mkdir` reconnaissance of the corpus root, not content reads — treated as non-material.
  - Official: [code: Framework/DataAbstractionLayer/EntityExtension.php:46] — `abstract public function getEntityName(): string;` is the sole abstract method in 6.7.13.0; `getDefinitionClass()` does not exist.
- **dev-06 (fs-docs)** — partly, 82%
  - Facts 1 (FlowAction contract incl. static getName()) and 2 (flow.action tag with key) correctly present.
  - Fact 3's PHP-side content (getConfig/getStore/getData) is correct, but the Administration registration is described as overriding the `sw-flow-sequence-action` component — this is the doc claim explicitly disproven by code: the real mechanism is the `flowBuilderService` singleton's additive methods (addActionNames/addLabels/addIcons/addGroups/addActionGroupMapping).
  - Citation 1/1 verified; selfReportDelta 0.
  - Official: [code: vendor/shopware/administration/.../module/sw-flow/service/flow-builder.service.ts:165-206] — registration surface is the flowBuilderService singleton's additive methods, not overriding sw-flow-sequence-action.
- **dev-10 (fs-docs)** — partly, 77%
  - Fact 1 lists only 4 of the 6 abstract members of EntityIndexer (getName, iterate, update, handle) and omits getTotal()/getDecorated() — the expected-answer file explicitly calls out that an answer listing only these four produces a class that cannot be instantiated, i.e. a materially wrong/incomplete recipe.
  - Facts 2 (sync-by-default, forceQueue) and 3 (dal:refresh:index, DISABLE_INDEXING guard) are present.
  - Citation 1/1 verified; selfReportDelta 0.
  - Official: [code: Framework/DataAbstractionLayer/Indexing/EntityIndexer.php:9-49] — six abstract members: getName, iterate, update, handle, getTotal, getDecorated; only getOptions() is non-abstract.
- **dev-11 (fs-docs)** — partly, 82%
  - Answer flatly states 'plugin services are declared in services.php, not services.xml — XML plugin configuration is deprecated in 6.7'. At 6.7.13.0 (the version under test) this is wrong: Bundle::registerContainerFile() loads XML/YAML/PHP alike with no deprecation trigger at all; the deprecation exists only from 6.7.14.0 onward. This is exactly the ADR-vs-installed-version divergence the expected-answer file calls out as a materially wrong claim.
  - Facts 2 (autowiring off by default) and 3 (explicit service('...') argument idiom, repository id conventions) are adequately present.
  - Citation 2/2 verified; selfReportDelta 0.
  - Official: [code: Framework/Bundle.php:212-231] — registerContainerFile() loads services.xml/.yaml/.php with no deprecation trigger in 6.7.13.0.
- **dev-12 (fs-docs)** — fail, 55%
  - The docs target for this case is `none` for the fs-docs corpus (dev-12 is a 6.6-pinned case whose page was removed from the current developer clone), but the agent did not cleanly report not-found — it produced a 'partial' answer synthesized from the ADR, the current (6.7) dependency-injection guide, and one labelled memory claim. The Source-absent override therefore does not apply; scored normally.
  - Both citations in the report carry `matchesToolCallLog: false` in the audit — the agent's toolCallLog contains only two `grep`/`find` Bash calls and no Read of either cited file, yet cites specific line ranges (16-30, 20-53) as if read. The content at those ranges does exist and matches the excerpt, but the citation is not traceable to a logged retrieval of that specific range — scored 0 under the 'citations don't correspond to anything in toolCallLog' band.
  - Fact 3 (autowiring off by default in 6.6) is missing; fact 1 (file location / format flexibility) is only weakly conveyed via inference from the ADR; fact 2 (explicit <argument> injection) is present in generic terms.
  - The memory claim is correctly labelled `[from memory]`, so it does not itself count as a discipline violation.
- **dev-15 (fs-docs)** — partly, 73%
  - Answer twice recommends searching for the literal term `@Event` to locate event classes — this string has zero occurrences anywhere under vendor/shopware and is explicitly disproven in the expected-answer file as a dead search technique. This is a materially misleading discovery method for the query's core ask.
  - States `{route}.encode`/`.controller` are 'since 6.6.11.0' — also explicitly disproven (both already present at v6.6.10.0); minor but repeats a known-wrong doc claim.
  - Correctly conveys that `{route}.render` fires 'before Twig rendering' (fact 2's timing point), but omits the NestedEventDispatcher mechanism explaining why DAL '.loaded' events cannot be found by grepping for a dispatch call (fact 1), and omits `debug:business-events` / the `debug:event-dispatcher` listeners-only limitation (fact 3).
  - Citation 1/1 verified; selfReportDelta 0.
  - Official: [code: Content/Product/ProductEvents.php:14-17] — event constant classes carry no `@Event` annotation; the string has 0 occurrences under vendor/shopware.
- **dev-16 (fs-docs)** — partly, 70%
  - selfReportDelta shows one missing call that is an actual content Read (`using-database-events.md`), not administrative reconnaissance — the self-reported toolCallLog under-represents how the answer was obtained, scored 0 on Honesty per the rubric's hard rule for materially under-reported logs.
  - Facts 1 (OrderEvents::ORDER_WRITTEN_EVENT, EntityWrittenEvent) and 2 (PreWriteValidationEvent opt-in, requestChangeSet()) are present and correct.
  - Fact 3 is only partially present: correctly notes an insert cannot produce a changeset, but omits that ChangeSet keys are DB storage names (snake_case), not property names — a detail that would practically mislead a developer reading the changeset by property name.
  - Citation 1/1 verified.
- **dev-18 (fs-docs)** — partly, 74%
  - The answer's guidance for the query's core complaint (surcharge added again on every recalculation) is to guard the collector with a 'was it already loaded' check — but the actual cause per the expected-answer file is that `$toCalculate` starts empty every pass and `LineItemCollection::add()` sums quantities on an id collision rather than replacing; the fix is a deterministic line-item id / reading the existing item from `$original`, which the answer never states. Following the given advice would not actually fix the reported duplication bug.
  - Fact 3 (stale price — CartDataCollection carried forward, must recompute inside process() every pass) is adequately conveyed.
  - Fact 1 ($toCalculate is a fresh empty Cart each pass; only a processor may add to it) is implied but not explicitly stated.
  - Citation 3/3 verified; selfReportDelta 0.
  - Official: [code: Checkout/Cart/LineItem/LineItem/LineItemCollection.php:30-53] — add() on an existing id sums quantities and marks modified rather than replacing, which is the actual duplication mechanism the answer does not address.
- **dev-19 (fs-docs)** — partly, 77%
  - Answer states the `#[AsMessageHandler]` attribute 'is what marks/registers it as such' while separately saying the service must be tagged `messenger.message_handler` — this is self-contradictory and repeats the exact doc claim disproven by code (the attribute alone is never sufficient for a Shopware plugin service, since Shopware never marks plugin definitions autoconfigured).
  - Also repeats the wrong middleware name 'handle_messages' (correct id is `handle_message`, singular) — an explicitly disproven doc claim.
  - Fact 3 (AsyncMessageInterface routes to the async transport; message class, not handler, decides sync/async) is entirely missing.
  - The actionable instruction to tag the service `messenger.message_handler` is nonetheless present and correct, so the practical registration step still works.
  - Citation 1/1 verified; selfReportDelta 0.
  - Official: [code: vendor/symfony/messenger/Middleware/HandleMessageMiddleware.php:112-115] and [code: Framework/Bundle.php:212-224] — the attribute alone does not register a plugin handler; the middleware id is handle_message (singular).
- **dev-21 (fs-docs)** — partly, 73%
  - This case's expected answer names an explicit Trap: the documented recipe's requirement of listener priority 1000 is disproven by code (no priority is read anywhere in the collect path) and an answer that passes must not require it. The report's answer explicitly repeats this exact disproven requirement ('give this subscriber a high priority (e.g. 1000)') — a materially wrong/misleading statement that fails the case's designed trap.
  - Correctly uses `$collection->set(...)` (not the numerically-keying `add()`) — the other half of the trap is avoided.
  - Fact 3 (runtime dispatch keyed on $event->getName(), flow.storer requirement, no admin-side trigger registration) is not addressed.
  - Citation 2/2 verified. selfReportDelta: 3 missing calls are `find` directory-discovery commands, non-material.
  - Official: [code: Framework/Event/BusinessEventCollector.php:27-49] and [code: Checkout/DependencyInjection/order.xml:154-162] — no priority is read in the collect path; the sole core listener runs at default priority 0.
- **dev-22 (fs-docs)** — partly, 77%
  - Answer states a field `<name>` 'must be at least 4 characters' — explicitly disproven by the XSD, which imposes no length restriction at all (pattern-only). Also lists only 15 of the 16 XSD-enumerated field types, omitting `price`. Both are the exact known documentation defects this case probes, repeated uncritically.
  - Fact 1 (config.xml resolved by path, no PHP class needed) is correctly present.
  - Fact 3 (SystemConfigService read-back, key pattern <PluginName>.config.<fieldName>, defaultValue-gated install-time writes) is entirely missing.
  - Citation 3/3 verified; selfReportDelta 0.
  - Official: [code: System/SystemConfig/Schema/config.xsd:84-88] — name pattern is `[a-zA-Z][a-zA-Z0-9]*` with no length minimum; [code: System/SystemConfig/Schema/config.xsd:41-60] — 16 types including `price`.
- **dev-23 (fs-docs)** — partly, 77%
  - Answer states the mail_template row's `system_default` 'must be set to 0' — explicitly disproven by the expected-answer file: `system_default` is a plain BoolField no code enforces, and core's own migrations/helper (`CreateMailTemplateTrait`) use 1; setting 0 can even break the idempotency lookup used by later trait-based migrations. This is exactly the documented defect the case probes, repeated uncritically.
  - Fact 1 (migration-based insert into mail_template_type/mail_template/translations with idempotency) is well covered.
  - Fact 2 (core's CreateMailTemplateTrait helper, and its inability to carry a plugin's own template bodies) is entirely missing.
  - Citation 2/2 verified; selfReportDelta 0.
  - Official: [code: Content/MailTemplate/MailTemplateDefinition.php:56] — system_default is a plain BoolField with only ApiAware, no enforcement of 0.
- **dev-24 (fs-docs)** — partly, 77%
  - Answer gives `prepareCriteria()` as a single-argument method (`Criteria $criteria` only); the actual 6.7 interface signature is `prepareCriteria(Criteria $criteria, SalesChannelEntity $salesChannel)` — an explicitly disproven doc claim repeated as fact, which would not compile against the real interface.
  - Facts 1 (getConfig/getMapping, tag) and 2 (SeoUrlUpdater::update() call, seo_url_template row) are reasonably present, though the mandatory NULL-sales_channel_id default-template requirement is not emphasized.
  - Fact 3 (per-sales-channel/per-language generation; no entity-side sales-channel association needed) is entirely missing.
  - Citation 2/2 verified; selfReportDelta 0.
  - Official: [code: Content/Seo/SeoUrlRoute/SeoUrlRouteInterface.php:11-16] — prepareCriteria(Criteria $criteria, SalesChannelEntity $salesChannel): void.
- **dev-26 (fs-docs)** — partly, 60%
- **dev-29 (fs-docs)** — partly, 80%
- **dev-31 (fs-docs)** — partly, 73%
- **dev-32 (fs-docs)** — partly, 73%
- **dev-33 (fs-docs)** — partly, 63%
- **dev-36 (fs-docs)** — partly, 80%
- **dev-37 (fs-docs)** — partly, 80%
- **dev-38 (fs-docs)** — fail, 57%
- **dev-39 (fs-docs)** — fail, 51%
- **dev-41 (fs-docs)** — fail, 57%
- **dev-43 (fs-docs)** — partly, 63%
- **dev-44 (fs-docs)** — partly, 63%
- **dev-46 (fs-docs)** — partly, 77%
- **dev-52 (fs-docs)** — partly, 80%
  - Fact 1 (extends MigrationStep, two abstract members) present.
  - Fact 2 (directory/namespace registration mechanics, FQCN match, missing-dir behaviour) entirely absent.
  - Fact 3 present only partially: 'cleanup belongs in uninstall()' stated but the required keepUserData() branching is never mentioned.
- **dev-53 (fs-docs)** — partly, 80%
  - Fact 1 (theme.json location, config.fields) and fact 2 (snippet key pattern) present and accurate.
  - Fact 3 (inline label/helpText still work as fallback in 6.7 until the v6.8.0.0 flag) missing — answer never explains the actual 'labels disappeared' mechanism the query is about.
  - Presents the docs' fixed type enum as if closed, which is misleading given code shows it unvalidated (supporting detail, not one of the 3 facts, but contributes to a misleading overall picture of the 6.7 behaviour).
- **dev-54 (fs-docs)** — partly, 80%
  - Fact 1 (listener on core CookieGroupCollectEvent) and fact 2 (fetch group, add CookieEntry) present, though the cookie-XOR-entries exclusivity/exception is omitted.
  - Fact 3 mischaracterises the legacy CookieProviderInterface path as compatibility 'for 6.7.2 and earlier plugins' rather than stating it is not additive — while a legacy provider is registered core skips its own default groups entirely.
- **dev-55 (fs-docs)** — fail, 56%
  - Trap violated: answer's closing sentence tells the reader to enable ACCESSIBILITY_TWEAKS locally before recompiling — the case's expected answer explicitly states the flag is inert in 6.7 and such advice is wrong.
  - Fact 1 (unconditional in 6.7, flag read by nothing) never stated explicitly; answer frames the whole mechanism in 6.6 flag-conditional terms.
  - Fact 2 (silent drop of stale block overrides, RuntimeError only on parent()) and fact 3 (JS-generated markup changes, correct SCSS trigger) not stated — recompile advice is tied to the (inert) flag rather than the real trigger.
- **dev-56 (fs-docs)** — partly, 80%
  - Fact 1 (block override, headerParameters merge, render_esi path) fully present.
  - Fact 2 present only in part: scalar-only claim stated, but the fragment-cache cost of each distinct parameter value is not mentioned.
  - Fact 3 (HeaderPageletLoadedEvent/FooterPageletLoadedEvent + addExtension, the header-not-page binding, silent failure of page.*) not named specifically — answer only vaguely gestures at 'still possible to add custom data directly'.
- **dev-59 (fs-docs)** — partly, 64%
  - Trap violated: recommends enabling use_varnish_xkey: true as the fix, but the case's expected answer shows this option is a deprecated no-op in 6.7 — Varnish/xkey is already the unconditional default gateway.
  - Never mentions PURGE + xkey header mechanics (fact 1's concrete VCL contract) nor the admin indices/gateway class change.
  - Fact 3 (delayed invalidation on by default, the shopware.invalidate_cache scheduled task as the actual trigger, sw-force-cache-invalidate header) — the most likely real cause of 'Varnish is never invalidated' — is entirely missing; the answer only reaches the cache:clear:http/cache:clear:all command change.
- **dev-60 (fs-docs)** — partly, 70%
  - Fact 3 directly contradicted: answer states 'a CLI worker must also be set up for the failed transport, otherwise failed messages will not be processed' — this is exactly the doc claim the case's expected answer disproves (failed is a dead-letter drain via messenger:failed:*, not a worker transport; retries move to failed, are not deleted).
  - Fact 2 (mandatory bin/console scheduled-task:run process once the admin worker is disabled) never mentioned — disabling the admin worker as instructed, without this, silently stops all scheduled tasks.
  - Fact 1 (explicit naming, nothing implicitly appends low_priority) reasonably present via the example command.
- **dev-61 (fs-docs)** — partly, 73%
  - Trap violated: answer states 'By default Shopware uses three shards and three replicas' for the storefront index — the case's expected answer explicitly flags this as no longer true in 6.7 (env defaults emptied, cluster default applies); this is the named trap for this case.
  - Fact 2 (es:index is the reindex command, settings apply only at creation) only partly present; es:index:cleanup and the creation-time-only constraint are not mentioned.
  - Fact 3 (separate admin search index block, still defaulting 3/3, es:admin:index command) entirely absent.
- **dev-62 (fs-docs)** — partly, 82%
  - Fact 1 (precedence chain, .env.local.php bypass, real env vars win) and fact 3 (system_config is DB-backed, not env-backed; MAILER_DSN admin-override trap) both present and accurate.
  - Fact 2 (does not claim cache:clear is needed for ordinary .env changes, only for FEATURE_* flags) is never explicitly addressed either way.
  - One cited excerpt (symfony-cli-setup.md:54-62) does not correspond to an actual Read in the tool-call log — it was only reached via a Bash grep, weakening its traceability even though the file/range exist and match the excerpt.
- **dev-63 (fs-docs)** — partly, 73%
  - Fact 1 (command + identifier=bundle name) present but omits that --all/--until is mandatory and that destructive changes need a separate database:migrate-destructive command.
  - Fact 2 — the silent-failure diagnostics this deploy-debugging query needs (deactivated plugin has no source; unknown identifier prints a note and exits 0 looking successful; a first-ever Migration directory needs cache:clear) — is entirely missing, despite being the core of the query ('my new migration never ran').
  - Fact 3 (plugin:update as the normal path, plugin:refresh/upgradeVersion gating, Deployment Helper skip condition) only partially present — mentions the Plugin Manager runs migrations automatically but not the refresh/upgradeVersion mechanism.
- **dev-64 (fs-docs)** — partly, 70%
  - Directly contradicts the case's central fact: states client_credentials tokens last 3600s (1 hour) vs the password grant's 600s — code shows every grant (client_credentials included) shares one PT10M (600s) access-token interval; the 3600s figure is the specific doc claim the expected answer disproves.
  - Never states that client_credentials issues no refresh_token at all (fact 1's second half).
  - Password-grant flow (client_id: administration, local-only intent) correctly covered.
- **dev-65 (fs-docs)** — partly, 73%
  - Directly reproduces a disproven claim: states exact-total-count mode requires SQL_CALC_FOUND_ROWS — the case's expected answer shows a second COUNT(*) query is run instead, and this doc/code divergence is explicitly named.
  - Fact 2's critical nuance (nested filter/sort/limit reach the SQL only for to-many associations; silently ignored on to-one) is never mentioned — a materially important gap for a coding agent building nested criteria.
  - Vocabulary/post-filter distinction (fact 1) reasonably covered, though container rule types and the full aggregation-type list are omitted.
- **dev-66 (fs-docs)** — partly, 70%
  - sw-inheritance is presented with example value '1' without stating it is a presence-only check (any value, including 0/false, enables it) — the case's key correction.
  - sw-skip-trigger-flow is framed via the /api/_action/sync example without stating it is resolved for every /api route, and the FILTER_VALIDATE_BOOLEAN truthy requirement is not named.
  - The given example values (1) happen to work correctly regardless of the missing nuance, so no operational harm results from the omissions.
  - Official: [code: Framework/Routing/ApiRequestContextResolver.php:124] — "if ($request->headers->has(PlatformRequest::HEADER_INHERITANCE)) { $parameters['considerInheritance'] = true; }"
- **dev-67 (fs-docs)** — partly, 82%
  - All three facts (manifest/meta minimum, folder-name match, refresh/install/activate command sequence) are present.
  - Repeats a specific disproven claim: 'if <author>/<copyright> are missing or empty, app:refresh fails' — code shows an empty element passes validation and a genuinely missing one is swallowed, with app:refresh reporting 'Nothing to install...' rather than failing.
  - Overstates the required <meta> fields slightly (adds description/icon as 'needed' alongside the six actually-required fields).
  - Official: [code: Framework/App/Manifest/Xml/XmlElement.php:94-101] — "if (!isset($data[$field])) { throw AppException::invalidArgument($field . ' must not be empty'); }"
- **dev-68 (fs-docs)** — partly, 80%
  - Fact 1 (initial GET, params, signatures) and fact 3 (confirmation POST body/signing, shopware-shop-signature-previous) both present and accurate.
  - Fact 2 misses the 6.7-specific rule that a returned secret identical to the currently stored one is rejected.
  - States the shop-secret must be 64-255 characters — the case's expected answer explicitly disproves this: no length validation exists in the registration code.
- **dev-70 (fs-docs)** — fail, 56%
  - Fact 1 directly contradicted: claims the presence of finalize-url decides sync vs async and 'Shopware's internal payment handler defaults to synchronous' without it — code shows one handler class for every app payment method; the finalize step follows from a redirectUrl in the pay response, not from the declared URL set.
  - Fact 3 directly and severely contradicted: lists 'cancelled, refunded, failed, unconfirmed, in_progress, reminded' as valid status response values — these are state names, not transition action names, and returning one throws IllegalTransitionException, leaving the transaction failed. This is precisely the trap the case is built to catch.
  - Fact 2 (payload shape, response-signature requirement) only partially present.
- **dev-71 (fs-docs)** — partly, 80%
  - Fact 2 (Admin API URL is the entity name with underscores turned into hyphens) present with a correct worked example.
  - Fact 1 omits that store-api-aware is mandatory on every scalar field and that the custom_entity_/ce_ prefix is a hard requirement (not merely an optional DB-length shorthand), and never mentions the automatic id primary key.
  - Fact 3 (store-api-aware only attaches a read-protection flag; there is no generic Store API route for custom entities at all in 6.7) is not mentioned — an agent following this answer could go looking for a Store API route that does not exist.
- **func-01 (fs-docs)** — partly, 77%
  - Facts 1 (required fields, tabs after first save) and 2 (per-channel visibility, active flag, category assignment, extended-visibility levels) both reasonably present at the UI level.
  - Fact 3 uses variant-listing display-mode labels ('Single main variant', 'Fan out properties in product list') that the case's expected answer shows do not exist in the 6.7 administration UI (actual labels: 'Display single product' / 'Expand property values in product listings').
  - Misses the documented 6.7.13.0 bug behind the query's own premise: 'Generate variants' leaves variant_listing_config NULL, so the listing shows one arbitrary child variant rather than the parent — a real, load-bearing reason a newly-variant-generated product 'might not show up' as expected.
- **func-02 (fs-docs)** — partly, 80%
  - Correctly notes the Assignments tab is only a navigation aid and that actual assignment happens on the shipping/payment method screens — matches the case's doc/code divergence finding.
  - Fact 1 (one nullable availability rule per method, NULL = always available, RestrictDelete) never stated.
  - Fact 3 (context rule ids, CartRuleLoader recalculation, ShippingMethodBlockedError/PaymentMethodBlockedError distinctions) not covered at all — the answer stays at the UI-condition level and does not explain the underlying availability-check mechanism the query asks about.
- **func-04 (fs-docs)** — partly, 73%
  - Fact 2 (eight premapping items) is reproduced as the docs' disproven five-item list ('Payment methods, Standard Payment Method, Salutation, Delivery time, Standard delivery time') — the case's expected answer shows there are eight premapping readers and no separate 'Standard Payment Method' reader exists at all.
  - Fact 1 (DataSelections, mandatory basicSettings content) reproduces the docs' incomplete six-selection list, omitting three real DataSelections (media, newsletterRecipient, wishlist) and the plugin/non-core nature of the Migration Assistant.
  - Fact 3 (payment methods not migrated as entities vs shipping methods which are; synthetic premapping rows) is reasonably captured — shipping methods correctly listed as auto-migrated, payment methods correctly flagged as needing manual mapping, B2B/themes/templates exclusions correctly named.
- **func-05 (fs-docs)** — partly, 67%
  - Answer names only 3 sales-channel types (storefront/headless/product-comparison), missing the 4th (Agentic Commerce) and never states that every Required field (navigationCategoryId, countryId, paymentMethodId, shippingMethodId, accessKey) applies regardless of type.
  - Domain fields (url/language/currency/snippet set) are stated but the answer never says a headless channel needs no domain, or that only Storefront-type channels are served by domain routing.
  - Access key mechanism (SWSC prefix, no secret counterpart, fetched via GET /api/_action/access-key/sales-channel, not auto-generated) is not described beyond 'generate an API Access ID'.
  - None of the 3 expected-answer facts are stated at the depth required -> Completeness 0. Citation (1/1 verified) and grounding are solid; no fabrication.
- **func-06 (fs-docs)** — partly, 62%
  - Case is pinned to 6.6, but the agent read v1-3-0-1.md (the later/6.7-worded revision) and reported 'Flow Builder is found under Settings > Automation' — wrong menu path for the 6.6 pin (correct 6.6 answer is Settings > Shop per the expected file's own code-backed fact).
  - Answer repeats the doc's disproved claim verbatim: 'checkout.order.payment_method.changed automatically sets the order status to Open' — code shows this only sets the order *transaction* state, not the order state; this is exactly the case's own documented trap and a materially misleading statement.
  - None of the 3 expected facts (trigger-list assembly / 16-action set with no core delay action / recipient.type=custom replaces audience + default order-confirmation flow already exists) are stated -> Completeness 0.
  - Citation (1/1 verified) is sound and matches the call log; no fabrication.
- **func-07 (fs-docs)** — partly, 67%
  - Answer repeats the doc's disproved claim that 'Start dry run ... no data will be written to the database tables' — code shows the real writes happen and are rolled back, while the invalid-records file/log rows and media filesystem changes survive the rollback. This is the exact trap the expected answer targets.
  - Answer also repeats 'you can generally only add information with the import, but not remove it' unqualified — true only for associations; whole-column JSON fields such as price are replaced, wiping unmapped currencies.
  - Matching-identifier mechanism (Second Unique Identifier / updateBy) is described reasonably but the silent duplicate-mapping-collapse fact is missing.
  - None of the 3 expected facts are fully/correctly present -> Completeness 0. Citation (1/1 verified) is sound.
- **func-08 (fs-docs)** — partly, 67%
  - Answer states 'Modifiable via Store API' both makes the field readable and writable ('anyone can access the stored information') — code shows this is disproved: that switch writes only allow_customer_write (write); read visibility is the separate 'Visible in Store API' switch writing store_api_aware. This repeats the doc's disproved claim.
  - Lists 10 field types (matching the doc, which itself omits the Price field per the expected file); no mention of the Twig-name-pattern not being enforced in 6.6, nor of the 6.6 all-non-whitelisted-write data-loss hole.
  - Entity-assignment mechanism (custom_field_set_relation, name uniqueness being global not per-set) is only partially covered.
  - None of the 3 expected facts are fully present -> Completeness 0. Citation (1/1 verified) sound; no fabrication.
- **func-09 (fs-docs)** — partly, 80%
  - Case is pinned to 6.6, but the agent read v1-4-0-0.md and reported 'Settings > Commerce > Payment methods' — that is the 6.7 path; the correct 6.6 path is Settings > Shop per the expected file. Wrong menu path for the version pinned.
  - Sales-channel-assignment gate (fact 1's core claim) and the availability-rule NULL-for-unrestricted gate (fact 2) are both stated correctly and clearly -> 2 of 3 facts present.
  - Fact 3 (checkout gateway can add/remove a method after DB gates pass; dangling handler still listed) is not mentioned.
  - Citation (1/1 verified) sound; answer is actionable and well-grounded despite the wrong menu path.
- **func-10 (fs-docs)** — partly, 67%
  - Case is pinned '6.6 + 6.7' but the answer presents 'Keep matching variants grouped' (displayAsGroup) as an unqualified, always-available toggle; code shows this field does not exist at all in 6.6 — a materially wrong statement for a version-spanning case.
  - Names only 3 use-sites (category, product comparison, CMS slider); code/expected shows 5 (also cross-selling and the cart rule cartLineItemInProductStream) — matches the doc's own known-incomplete enumeration.
  - No mention of api_filter/invalid being computed/write-protected by the indexer.
  - None of the 3 expected facts fully present -> Completeness 0. Citation (1/1 verified) sound and matches this case's own toolCallLog/answer; per the auditor's note, the mechanical findability/retrievalCalls numbers in the audit shard for this caseId are contaminated by a func-11 attribution artifact and are not used to score this case.
- **func-12 (fs-docs)** — partly, 83%
  - Answer opens with 'Both already exist as built-in Shopware capabilities' which is imprecise/self-contradictory against fact 1 (neither exists in open-source core at all — only the trigger checkout.order.placed is core, the actions are not); it is immediately qualified by naming the Commercial requirement, so this reads as an imprecision rather than an outright false claim.
  - Licensing/plan-gating fact (fact 2: Beyond for pricing, Evolve+ for webhook, API-only/no admin UI for custom pricing) is well captured.
  - Fact 3 (what core offers instead — rule-based Rule-Builder customer conditions, promotion personaCustomers, and the app-based webhook route as the real OSS alternative) is entirely absent -> only 1 of 3 facts fully present.
  - Correctly avoids the case's own Trap (does not propose building either feature without naming the commercial dependency). Citations (2/2) verified; grounded and actionable.
- **edge-04 (fs-docs)** — partly, 67%
  - Correctly avoids presenting /sales-channel-api/v3/product as a live endpoint and correctly identifies it as legacy/undocumented (fact 1's substance present).
  - Never gives the actual current endpoint (GET|POST /store-api/product, route store-api.product.search) or the sw-access-key auth requirement -> facts 2 and 3 not present.
  - One of the two cited sources (developer/concepts/api/store-api.md:1-18) does not correspond to any Read/Grep call in this case's own toolCallLog per the audit shard (matchesToolCallLog: false) — the content is genuine (verified to exist and match) but was not actually retrieved in this case's own research pass, most likely carried over unlabelled from earlier context in the same batch (the identical file was Read for edge-01). This is scored as a citation-provenance and honesty issue, not fabrication of false content.
- **edge-06 (fs-docs)** — partly, 62%
  - Falls into the case's own explicitly-named Trap: presents 'Attribute Sets -> Custom field sets' as a direct one-to-one mapping instead of stating that no attribute-set-equivalent object exists (custom_field_set binds to entity *names*, not to a per-product 'set' the way Magento attribute sets do) — this is exactly the invented look-alike the case's Trap warns against.
  - Never mentions the 'app' extension mechanism at all (only names 'plugin'), so fact 2 (plugin OR app) is not present.
  - Store-view/sales-channel mapping (fact 1) and the di.xml-absence + Symfony services mechanism (fact 4) are reasonably captured.
  - One of two citations (developer/guides/plugins/plugins/services/add-custom-service.md:18-72) does not correspond to an actual Read in this case's own toolCallLog (only Grep touched that file; the Read call was for a different file, dependency-injection.md) — content is genuine but mis-attributed as a full-read citation.
- **edge-07 (fs-docs)** — partly, 71%
  - Correctly states no PWA surface is documented in the corpus and correctly names Composable Frontends as the current documented headless approach (facts 1 and 3 present).
  - Never gives the actual 6.7 headless setup mechanics (API-type sales channel, Store API, sw-access-key + sw-context-token) that fact 2 requires — only PaaS-deployment configuration for an already-built composable frontend is described, which does not answer 'how to set it up' at the level the query needs.
  - One cited source (developer/concepts/api/store-api.md:1-18) does not correspond to a Read in this case's own toolCallLog per the audit (matchesToolCallLog: false); the audit also flags a ground-truth Read (developer/guides/plugins/plugins/services/add-custom-service.md) that is present in the transcript but absent from the self-reported toolCallLog.
  - Actionability is limited: the answer tells the reader what doesn't exist and names the real product but does not give steps to actually connect a headless client.
- **edge-09 (fs-docs)** — partly, 83%
  - Answer correctly redirects straight to the Flow Builder with the correct trigger/action pairing (checkout.order.placed + Send mail) -> fact 2 present, and never fabricates a nonexistent Business Events configuration screen.
  - Never explicitly states that no Business Events configuration screen exists (fact 1) or that 'business event' now survives only as a read-only event catalogue (fact 3) — it simply sidesteps the trap silently rather than calling it out, so only 1 of 3 facts is explicitly stated.
  - Citations (3/3) verified; grounded, honest, actionable — the answer is functionally correct even though it does not explicitly name the trap.
- **gap-03 (fs-docs)** — partly, 76%
  - Correctly states the corpus documents only the generic token request and never mentions /api/oauth/authorize or a version-specific scope change (fact 1 present).
  - Reports the auth guide's stale '"scopes": "write"' request-body example verbatim but never flags it as not what a 6.7 server actually reads (a plural key is ignored; scope must be a singular, space-delimited parameter) — since the query is specifically about this exact breaking symptom, repeating the stale example uncorrected risks actively misleading the asking developer. This is scored as a materially misleading omission given the query's stakes.
  - Never states that /api/oauth/authorize itself no longer exists in 6.7 (fact 3) -> only 1 of 3 facts present.
  - No formal citations recorded (empty citations[] per audit) but notFoundClaim is honest and nothing is falsely cited, so Citation scores under the not-found override; no fabrication.
- **gap-04 (fs-docs)** — partly, 74%
  - Correctly states no page enumerates the affected 6.7 properties and correctly names the backward-compatibility guideline as the closest material (facts 1 and 2 present).
  - Recommends searching the codebase for the PropertyTypeNarrowing/PropertyTypeWidening BC-change attributes to find which properties changed in 6.7 — but per the expected file, those attributes' examples target v6.8.0, a *different, future* change, not the historical 6.7 native-typing wave (whose only marker is the old-style '@deprecated tag:v6.7.0 - Will be natively typed' docblock on the 6.6 tree). Directing the reader to the wrong mechanism is a materially misleading suggestion that would not actually help them find the 6.7 changes -> fact 3 not correctly present, and this caps Accuracy.
  - Citation (2/2) verified; no fabrication; honest about the absence of an enumerable list.
- **gap-06 (fs-docs)** — partly, 80%
  - Correctly identifies the gap (no dedicated shipping-method plugin guide) and transparently uses the payment-method guide as an explicit analogy rather than presenting it as documentation of the shipping case -> fact 1 present. Correctly names the only real route (shipping_method.repository via a DAL write, e.g. $repository->create()) -> fact 2 present.
  - Repeats the payment-plugin guide's unverified claim that an omitted technicalName 'can prevent the plugin from being installed or activated', applied here to shipping methods — per the expected file's own doc/code divergence table this claim is not backed by any plugin-lifecycle validation (enforcement is only the DB NOT NULL/UNIQUE constraint, surfaced as ShippingException::duplicateTechnicalName()). Repeating this unverified claim as fact is materially misleading -> fact 3 not correctly present.
  - Citations (2/2) verified; highly actionable with a concrete install()/uninstall() code pattern.

## Accuracy cross-checks

| Option | Flagged | Fetched | Served from cache | Bands changed | Fetch failures |
| --- | --- | --- | --- | --- | --- |
| fs-docs | 1 of 100 | 1 | 0 | 0 | none |

dev-57 (case status `contradictory`) was flagged and fetched fresh (no cache hit); its band held at 100 — the official B2B Suite migration page confirmed the answer's facts. No band changed — every flagged case held its provisional accuracy.

Every other case's `confirmed`-status expected-answer facts (carrying `[code: …]` evidence) served as the accuracy cross-check directly, per the rubric — no external fetch needed or performed for those.

## Observations about source availability

- No case hit the Source-absent override (`unavailable` count: 0) — the docs corpus is present at both entry points and the discover agent could always attempt an answer.
- 12 `dev`/`edge`/`gap` cases have no page in the docs corpus for this corpus (target = `none`): edge-01, edge-02, edge-03, edge-08, gap-01, gap-02, gap-03, gap-04, gap-05, gap-06, gap-07, gap-08.
- The `edge-*` traps mostly behaved as specified: 5 of 9 passed by correctly stating the trap/non-existence.
- The `gap-*` cases confirm 5 of 8 real documentation gaps (agent correctly reported not-covered rather than inventing): gap-01, gap-02, gap-05, gap-07, gap-08.

## Recommended fixes

Derived from scorer findings below `pass`/`unavailable`:

- dev-01 (fs-docs): Answer states only `getDefinitionClass()` to name the extended entity, reproducing the KB's known 6.7 defect: in 6.7.13.0 `getDefinitionClass()` does not exist and `getEntityName(): string` is the sole abstract method — cases.md flags exactly this as a case that must fail an answer offering only `getDefinitionClass()` for 6.7.
- dev-06 (fs-docs): Facts 1 (FlowAction contract incl. static getName()) and 2 (flow.action tag with key) correctly present.
- dev-10 (fs-docs): Fact 1 lists only 4 of the 6 abstract members of EntityIndexer (getName, iterate, update, handle) and omits getTotal()/getDecorated() — the expected-answer file explicitly calls out that an answer listing only these four produces a class that cannot be instantiated, i.e. a materially wrong/incomplete recipe.
- dev-11 (fs-docs): Answer flatly states 'plugin services are declared in services.php, not services.xml — XML plugin configuration is deprecated in 6.7'. At 6.7.13.0 (the version under test) this is wrong: Bundle::registerContainerFile() loads XML/YAML/PHP alike with no deprecation trigger at all; the deprecation exists only from 6.7.14.0 onward. This is exactly the ADR-vs-installed-version divergence the expected-answer file calls out as a materially wrong claim.
- dev-12 (fs-docs): The docs target for this case is `none` for the fs-docs corpus (dev-12 is a 6.6-pinned case whose page was removed from the current developer clone), but the agent did not cleanly report not-found — it produced a 'partial' answer synthesized from the ADR, the current (6.7) dependency-injection guide, and one labelled memory claim. The Source-absent override therefore does not apply; scored normally.
- dev-15 (fs-docs): Answer twice recommends searching for the literal term `@Event` to locate event classes — this string has zero occurrences anywhere under vendor/shopware and is explicitly disproven in the expected-answer file as a dead search technique. This is a materially misleading discovery method for the query's core ask.
- dev-16 (fs-docs): selfReportDelta shows one missing call that is an actual content Read (`using-database-events.md`), not administrative reconnaissance — the self-reported toolCallLog under-represents how the answer was obtained, scored 0 on Honesty per the rubric's hard rule for materially under-reported logs.
- dev-18 (fs-docs): The answer's guidance for the query's core complaint (surcharge added again on every recalculation) is to guard the collector with a 'was it already loaded' check — but the actual cause per the expected-answer file is that `$toCalculate` starts empty every pass and `LineItemCollection::add()` sums quantities on an id collision rather than replacing; the fix is a deterministic line-item id / reading the existing item from `$original`, which the answer never states. Following the given advice would not actually fix the reported duplication bug.
- dev-19 (fs-docs): Answer states the `#[AsMessageHandler]` attribute 'is what marks/registers it as such' while separately saying the service must be tagged `messenger.message_handler` — this is self-contradictory and repeats the exact doc claim disproven by code (the attribute alone is never sufficient for a Shopware plugin service, since Shopware never marks plugin definitions autoconfigured).
- dev-21 (fs-docs): This case's expected answer names an explicit Trap: the documented recipe's requirement of listener priority 1000 is disproven by code (no priority is read anywhere in the collect path) and an answer that passes must not require it. The report's answer explicitly repeats this exact disproven requirement ('give this subscriber a high priority (e.g. 1000)') — a materially wrong/misleading statement that fails the case's designed trap.
- dev-22 (fs-docs): Answer states a field `<name>` 'must be at least 4 characters' — explicitly disproven by the XSD, which imposes no length restriction at all (pattern-only). Also lists only 15 of the 16 XSD-enumerated field types, omitting `price`. Both are the exact known documentation defects this case probes, repeated uncritically.
- dev-23 (fs-docs): Answer states the mail_template row's `system_default` 'must be set to 0' — explicitly disproven by the expected-answer file: `system_default` is a plain BoolField no code enforces, and core's own migrations/helper (`CreateMailTemplateTrait`) use 1; setting 0 can even break the idempotency lookup used by later trait-based migrations. This is exactly the documented defect the case probes, repeated uncritically.
- dev-24 (fs-docs): Answer gives `prepareCriteria()` as a single-argument method (`Criteria $criteria` only); the actual 6.7 interface signature is `prepareCriteria(Criteria $criteria, SalesChannelEntity $salesChannel)` — an explicitly disproven doc claim repeated as fact, which would not compile against the real interface.
- dev-52 (fs-docs): Fact 1 (extends MigrationStep, two abstract members) present.
- dev-53 (fs-docs): Fact 1 (theme.json location, config.fields) and fact 2 (snippet key pattern) present and accurate.
- dev-54 (fs-docs): Fact 1 (listener on core CookieGroupCollectEvent) and fact 2 (fetch group, add CookieEntry) present, though the cookie-XOR-entries exclusivity/exception is omitted.
- dev-55 (fs-docs): Trap violated: answer's closing sentence tells the reader to enable ACCESSIBILITY_TWEAKS locally before recompiling — the case's expected answer explicitly states the flag is inert in 6.7 and such advice is wrong.
- dev-56 (fs-docs): Fact 1 (block override, headerParameters merge, render_esi path) fully present.
- dev-59 (fs-docs): Trap violated: recommends enabling use_varnish_xkey: true as the fix, but the case's expected answer shows this option is a deprecated no-op in 6.7 — Varnish/xkey is already the unconditional default gateway.
- dev-60 (fs-docs): Fact 3 directly contradicted: answer states 'a CLI worker must also be set up for the failed transport, otherwise failed messages will not be processed' — this is exactly the doc claim the case's expected answer disproves (failed is a dead-letter drain via messenger:failed:*, not a worker transport; retries move to failed, are not deleted).
- dev-61 (fs-docs): Trap violated: answer states 'By default Shopware uses three shards and three replicas' for the storefront index — the case's expected answer explicitly flags this as no longer true in 6.7 (env defaults emptied, cluster default applies); this is the named trap for this case.
- dev-62 (fs-docs): Fact 1 (precedence chain, .env.local.php bypass, real env vars win) and fact 3 (system_config is DB-backed, not env-backed; MAILER_DSN admin-override trap) both present and accurate.
- dev-63 (fs-docs): Fact 1 (command + identifier=bundle name) present but omits that --all/--until is mandatory and that destructive changes need a separate database:migrate-destructive command.
- dev-64 (fs-docs): Directly contradicts the case's central fact: states client_credentials tokens last 3600s (1 hour) vs the password grant's 600s — code shows every grant (client_credentials included) shares one PT10M (600s) access-token interval; the 3600s figure is the specific doc claim the expected answer disproves.
- dev-65 (fs-docs): Directly reproduces a disproven claim: states exact-total-count mode requires SQL_CALC_FOUND_ROWS — the case's expected answer shows a second COUNT(*) query is run instead, and this doc/code divergence is explicitly named.
- dev-66 (fs-docs): sw-inheritance is presented with example value '1' without stating it is a presence-only check (any value, including 0/false, enables it) — the case's key correction.
- dev-67 (fs-docs): All three facts (manifest/meta minimum, folder-name match, refresh/install/activate command sequence) are present.
- dev-68 (fs-docs): Fact 1 (initial GET, params, signatures) and fact 3 (confirmation POST body/signing, shopware-shop-signature-previous) both present and accurate.
- dev-70 (fs-docs): Fact 1 directly contradicted: claims the presence of finalize-url decides sync vs async and 'Shopware's internal payment handler defaults to synchronous' without it — code shows one handler class for every app payment method; the finalize step follows from a redirectUrl in the pay response, not from the declared URL set.
- dev-71 (fs-docs): Fact 2 (Admin API URL is the entity name with underscores turned into hyphens) present with a correct worked example.
- func-01 (fs-docs): Facts 1 (required fields, tabs after first save) and 2 (per-channel visibility, active flag, category assignment, extended-visibility levels) both reasonably present at the UI level.
- func-02 (fs-docs): Correctly notes the Assignments tab is only a navigation aid and that actual assignment happens on the shipping/payment method screens — matches the case's doc/code divergence finding.
- func-04 (fs-docs): Fact 2 (eight premapping items) is reproduced as the docs' disproven five-item list ('Payment methods, Standard Payment Method, Salutation, Delivery time, Standard delivery time') — the case's expected answer shows there are eight premapping readers and no separate 'Standard Payment Method' reader exists at all.
- func-05 (fs-docs): Answer names only 3 sales-channel types (storefront/headless/product-comparison), missing the 4th (Agentic Commerce) and never states that every Required field (navigationCategoryId, countryId, paymentMethodId, shippingMethodId, accessKey) applies regardless of type.
- func-06 (fs-docs): Case is pinned to 6.6, but the agent read v1-3-0-1.md (the later/6.7-worded revision) and reported 'Flow Builder is found under Settings > Automation' — wrong menu path for the 6.6 pin (correct 6.6 answer is Settings > Shop per the expected file's own code-backed fact).
- func-07 (fs-docs): Answer repeats the doc's disproved claim that 'Start dry run ... no data will be written to the database tables' — code shows the real writes happen and are rolled back, while the invalid-records file/log rows and media filesystem changes survive the rollback. This is the exact trap the expected answer targets.
- func-08 (fs-docs): Answer states 'Modifiable via Store API' both makes the field readable and writable ('anyone can access the stored information') — code shows this is disproved: that switch writes only allow_customer_write (write); read visibility is the separate 'Visible in Store API' switch writing store_api_aware. This repeats the doc's disproved claim.
- func-09 (fs-docs): Case is pinned to 6.6, but the agent read v1-4-0-0.md and reported 'Settings > Commerce > Payment methods' — that is the 6.7 path; the correct 6.6 path is Settings > Shop per the expected file. Wrong menu path for the version pinned.
- func-10 (fs-docs): Case is pinned '6.6 + 6.7' but the answer presents 'Keep matching variants grouped' (displayAsGroup) as an unqualified, always-available toggle; code shows this field does not exist at all in 6.6 — a materially wrong statement for a version-spanning case.
- func-12 (fs-docs): Answer opens with 'Both already exist as built-in Shopware capabilities' which is imprecise/self-contradictory against fact 1 (neither exists in open-source core at all — only the trigger checkout.order.placed is core, the actions are not); it is immediately qualified by naming the Commercial requirement, so this reads as an imprecision rather than an outright false claim.
- edge-04 (fs-docs): Correctly avoids presenting /sales-channel-api/v3/product as a live endpoint and correctly identifies it as legacy/undocumented (fact 1's substance present).
- edge-06 (fs-docs): Falls into the case's own explicitly-named Trap: presents 'Attribute Sets -> Custom field sets' as a direct one-to-one mapping instead of stating that no attribute-set-equivalent object exists (custom_field_set binds to entity *names*, not to a per-product 'set' the way Magento attribute sets do) — this is exactly the invented look-alike the case's Trap warns against.
- edge-07 (fs-docs): Correctly states no PWA surface is documented in the corpus and correctly names Composable Frontends as the current documented headless approach (facts 1 and 3 present).
- edge-09 (fs-docs): Answer correctly redirects straight to the Flow Builder with the correct trigger/action pairing (checkout.order.placed + Send mail) -> fact 2 present, and never fabricates a nonexistent Business Events configuration screen.
- gap-03 (fs-docs): Correctly states the corpus documents only the generic token request and never mentions /api/oauth/authorize or a version-specific scope change (fact 1 present).
- gap-04 (fs-docs): Correctly states no page enumerates the affected 6.7 properties and correctly names the backward-compatibility guideline as the closest material (facts 1 and 2 present).
- gap-06 (fs-docs): Correctly identifies the gap (no dedicated shipping-method plugin guide) and transparently uses the payment-method guide as an explicit analogy rather than presenting it as documentation of the shipping case -> fact 1 present. Correctly names the only real route (shipping_method.repository via a DAL write, e.g. $repository->create()) -> fact 2 present.

## Borderline re-scores

| Case | Option | Dimension | First | Second | Taken | Total before → after | Verdict before → after |
| --- | --- | --- | --- | --- | --- | --- | --- |
| dev-52 | fs-docs | (see audit warnings) | — | — | — | 83% → 80% | partly → partly |
| dev-62 | fs-docs | (see audit warnings) | — | — | — | 85% → 82% | pass → partly |
| dev-66 | fs-docs | (see audit warnings) | — | — | — | 83% → 70% | partly → partly |
| dev-67 | fs-docs | (see audit warnings) | — | — | — | 85% → 82% | pass → partly |

## Scorer discrepancies

None.

## Audit warnings

- selfReportDelta present for dev-01 (missing 2 call(s)) but honesty=70 — scorer judged non-material per auditNotes; not auto-overridden
- selfReportDelta present for dev-05 (missing 1 call(s)) but honesty=70 — scorer judged non-material per auditNotes; not auto-overridden
- selfReportDelta present for dev-21 (missing 3 call(s)) but honesty=70 — scorer judged non-material per auditNotes; not auto-overridden
- selfReportDelta present for func-10 (missing 3 call(s)) but honesty=100 — scorer judged non-material per auditNotes; not auto-overridden
- selfReportDelta present for edge-07 (missing 1 call(s)) but honesty=70 — scorer judged non-material per auditNotes; not auto-overridden
- rescore dev-52: actionability 100 → 70
- rescore dev-62: actionability 100 → 70
- rescore dev-66: accuracy 70 → 40
- rescore dev-66: citation 100 → 70
- rescore dev-66: actionability 100 → 70
- rescore dev-67: citation 100 → 70
- func-10/func-11 (batch-9): ground-truth call log attributes research shared between both cases to func-10's caseId (extractor follows Write-call boundaries); func-11's own retrievalCalls/findabilityStrict/latency read 0/fail/null as a result — an extractor artifact, not an agent fault. Scorer was instructed not to penalize func-11's content dimensions for this.
- 9 citations flagged matchesToolCallLog:false (excerpt content verified genuine, but not reached via a Read in that case's own tool-call log — reached via grep/context instead): dev-12 (x2), dev-62, edge-04, edge-06, edge-07, gap-04 (x2), gap-08.
- 7 cases had a non-empty selfReportDelta (ground-truth call count exceeds self-reported count): dev-01, dev-05, dev-16, dev-21, dev-31, func-10, edge-07. Scorers judged materiality per case; dev-16 and dev-31 zeroed Honesty as material, others left unchanged as administrative reconnaissance (ls/mkdir) per auditNotes.
- No fence denials recorded for the run (0 across all 100 cases) — the fence log file did not exist, meaning no out-of-scope call was ever attempted or blocked.
