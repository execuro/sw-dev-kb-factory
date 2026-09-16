# KB quality report — fs-docs-2026-09-13-1151

## Run

| | |
| --- | --- |
| Run | `fs-docs-2026-09-13-1151` (`fs-docs`) |
| Options | `fs-docs` |
| Corpus | `docs` — fingerprint: developer `3a7f3af9c19f737ef8b8252cc2a599354065cbb9` (2026-09-11T18:13:30+02:00), merchant `fd093eda5f71bb4fe5759d95e4ea841ccce519e7` (2026-09-11T03:37:21Z) |
| Probe | fs entry points present: `developer/index.md`, `merchant/index.md` |
| Model | inherited (not pinned) |
| Generated | 2026-09-13T12:42:02Z |
| Cases run | 100 of 100 (`all`) |
| Yardstick | `cases.md ef932d8e`, `scoring-rubric.md 54864fb4`, `scorer-brief.md 1456b9ec`, `auditor-brief.md 4c2c6fdc`, `accuracy-brief.md 9009d748` (rubricVersion 2) |
| Execution | discover batches of 10, scorer shards of 25 (batched) |
| Skill | `kb-factory-verify` |

## Run cost

| Option | Agents | Tokens | Tool calls | Summed agent time | Usage complete |
| --- | --- | --- | --- | --- | --- |
| `fs-docs` | 17 (10 discover, 1 audit, 4 score, 1 accuracy, 1 rescore) | 2744237 | 791 | 6247.9s | yes |

Wall-clock duration of the run: 3052.0s.

## Comparison

This run tested one option only (`fs-docs`), the baseline for a future five-way `compare`.

| Option | Access | Corpus | Overall | Status | Developer | Functional | Findable | Edge passed | Gap confirmed | Pass / partly / fail / unavailable / unscored | Weakest dimension |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `fs-docs` | fs | docs | 79.2% | Not ready | 77.7% | 78.9% | 70 of 82 | 2 of 9 | 5 of 8 | 34 / 56 / 8 / 2 / 0 | accuracy |

No other option ran in this session, so no ranking or delta can be computed yet.

## Dimension heatmap

| Dimension | Weight | `fs-docs` |
| --- | --- | --- |
| Grounding & Relevance | 25 | 98.4 |
| Accuracy vs. Expected Answer | 25 | 59.7 |
| Completeness | 15 | 66 |
| Citation & Traceability | 10 | 80.4 |
| Honesty | 15 | 90.1 |
| Actionability | 10 | 84.4 |

Average band score, `unscored` cases excluded (none in this run).

| Area | Cases | `fs-docs` average |
| --- | --- | --- |
| Admin API | 3 | 79% |
| Admin migration (Vue 3 / Vite / Pinia / Meteor) | 4 | 69.5% |
| Administration | 4 | 79.5% |
| App system | 5 | 81.8% |
| Checkout & Cart | 2 | 73% |
| Config & CLI | 5 | 77.6% |
| Content | 1 | 82% |
| Content (CMS/mail/SEO/media/sitemap) | 2 | 84% |
| Core breaking changes | 3 | 87.3% |
| DAL | 7 | 79.6% |
| Events | 6 | 83.7% |
| Gap | 8 | 90% |
| Hosting & ops | 5 | 64% |
| Merchant | 12 | 78.9% |
| Orders | 2 | 61.5% |
| Payment & Shipping | 1 | 73% |
| Platform upgrade | 2 | 91% |
| Plugin fundamentals | 1 | 80% |
| Services & DI | 3 | 67.7% |
| Store API & headless | 1 | 89% |
| Storefront | 9 | 83.2% |
| Testing | 3 | 57.7% |
| Theme | 2 | 88.5% |
| Trap | 9 | 82.3% |

## Verdict grid

| Case | Category | Area | `fs-docs` |
| --- | --- | --- | --- |
| dev-01 | dev | DAL | 77% partly ✗ |
| dev-02 | dev | Plugin fundamentals | 80% partly ✓ |
| dev-03 | dev | Store API & headless | 89% pass ✓ |
| dev-04 | dev | Content | 82% partly ✓ |
| dev-05 | dev | Theme | 97% pass ✓ |
| dev-06 | dev | Events | 77% partly ✓ |
| dev-07 | dev | DAL | 77% partly ✓ |
| dev-08 | dev | DAL | 97% pass ✓ |
| dev-09 | dev | DAL | 85% pass ✓ |
| dev-10 | dev | DAL | 74% partly ✓ |
| dev-11 | dev | Services & DI | 80% partly ✓ |
| dev-12 | dev | Services & DI | 35% fail – |
| dev-13 | dev | Services & DI | 88% pass ✓ |
| dev-14 | dev | Events | 97% pass ✓ |
| dev-15 | dev | Events | 74% partly ✓ |
| dev-16 | dev | Orders | 73% partly ✗ |
| dev-17 | dev | Checkout & Cart | 73% partly ✓ |
| dev-18 | dev | Checkout & Cart | 73% partly ✗ |
| dev-19 | dev | Events | 92% pass ✓ |
| dev-20 | dev | Events | 92% pass ✓ |
| dev-21 | dev | Events | 70% partly ✓ |
| dev-22 | dev | Config & CLI | 82% partly ✓ |
| dev-23 | dev | Content (CMS/mail/SEO/media/sitemap) | 80% partly ✓ |
| dev-24 | dev | Content (CMS/mail/SEO/media/sitemap) | 88% pass ✓ |
| dev-25 | dev | Config & CLI | 97% pass ✓ |
| dev-26 | dev | Orders | 50% fail ✓ |
| dev-27 | dev | Storefront | 90% pass ✓ |
| dev-28 | dev | Storefront | 78% partly ✓ |
| dev-29 | dev | Storefront | 78% partly ✓ |
| dev-30 | dev | Storefront | 90% pass ✓ |
| dev-31 | dev | Storefront | 80% partly ✗ |
| dev-32 | dev | DAL | 80% partly ✓ |
| dev-33 | dev | Administration | 42% fail ✓ |
| dev-34 | dev | Administration | 100% pass ✓ |
| dev-35 | dev | Administration | 88% pass ✓ |
| dev-36 | dev | Administration | 88% pass ✓ |
| dev-37 | dev | Testing | 73% partly ✓ |
| dev-38 | dev | Testing | 73% partly ✓ |
| dev-39 | dev | Testing | 27% fail ✗ |
| dev-40 | dev | Platform upgrade | 88% pass ✓ |
| dev-41 | dev | Hosting & ops | 44% fail ✗ |
| dev-42 | dev | Config & CLI | 80% partly ✓ |
| dev-43 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 63% partly ✓ |
| dev-44 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 73% partly ✓ |
| dev-45 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 88% pass ✓ |
| dev-46 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 54% fail ✓ |
| dev-47 | dev | Payment & Shipping | 73% partly ✓ |
| dev-48 | dev | Storefront | 79% partly ✗ |
| dev-49 | dev | Core breaking changes | 77% partly ✓ |
| dev-50 | dev | Core breaking changes | 100% pass ✓ |
| dev-51 | dev | DAL | 67% partly ✓ |
| dev-52 | dev | Core breaking changes | 85% pass ✓ |
| dev-53 | dev | Theme | 80% partly ✓ |
| dev-54 | dev | Storefront | 92% pass ✓ |
| dev-55 | dev | Storefront | 70% partly ✓ |
| dev-56 | dev | Storefront | 92% pass ✓ |
| dev-57 | dev | Platform upgrade | 94% pass ✓ |
| dev-58 | dev | Hosting & ops | 77% partly ✓ |
| dev-59 | dev | Hosting & ops | 74% partly ✓ |
| dev-60 | dev | Hosting & ops | 70% partly ✓ |
| dev-61 | dev | Hosting & ops | 55% fail ✓ |
| dev-62 | dev | Config & CLI | 55% fail ✓ |
| dev-63 | dev | Config & CLI | 74% partly ✗ |
| dev-64 | dev | Admin API | 80% partly ✓ |
| dev-65 | dev | Admin API | 80% partly ✓ |
| dev-66 | dev | Admin API | 77% partly ✓ |
| dev-67 | dev | App system | 100% pass ✓ |
| dev-68 | dev | App system | 92% pass ✓ |
| dev-69 | dev | App system | 75% partly ✓ |
| dev-70 | dev | App system | 60% partly ✓ |
| dev-71 | dev | App system | 82% partly ✓ |
| edge-01 | edge | Trap | 85% unavailable – |
| edge-02 | edge | Trap | 85% unavailable – |
| edge-03 | edge | Trap | 97% pass – |
| edge-04 | edge | Trap | 70% partly – |
| edge-05 | edge | Trap | 73% partly – |
| edge-06 | edge | Trap | 76% partly – |
| edge-07 | edge | Trap | 79% partly – |
| edge-08 | edge | Trap | 100% pass – |
| edge-09 | edge | Trap | 76% partly – |
| func-01 | func | Merchant | 77% partly ✗ |
| func-02 | func | Merchant | 73% partly ✓ |
| func-03 | func | Merchant | 94% pass ✓ |
| func-04 | func | Merchant | 64% partly ✗ |
| func-05 | func | Merchant | 83% partly ✓ |
| func-06 | func | Merchant | 76% partly ✓ |
| func-07 | func | Merchant | 76% partly ✓ |
| func-08 | func | Merchant | 76% partly ✓ |
| func-09 | func | Merchant | 76% partly ✓ |
| func-10 | func | Merchant | 76% partly ✗ |
| func-11 | func | Merchant | 88% pass ✓ |
| func-12 | func | Merchant | 88% pass ✗ |
| gap-01 | gap | Gap | 82% partly – |
| gap-02 | gap | Gap | 95% pass – |
| gap-03 | gap | Gap | 95% pass – |
| gap-04 | gap | Gap | 83% partly – |
| gap-05 | gap | Gap | 70% partly – |
| gap-06 | gap | Gap | 100% pass – |
| gap-07 | gap | Gap | 95% pass – |
| gap-08 | gap | Gap | 100% pass – |

## Requests and responses

What each discover agent was given and what it reported.

### `fs-docs`

| Case | Query | Page reached | Findability | Memory claims | Verdict | Raw |
| --- | --- | --- | --- | --- | --- | --- |
| dev-01 | How do I extend the product entity with a new association in Shopware' | `developer/guides/plugins/plugins/framework/data-handling/add-complex-data-to-existing-entities.md` = target | fail (1+1) | 0 | partly | `raw/fs-docs/dev-01.json` |
| dev-02 | What's the plugin lifecycle in Shopware — install, activate, uninstall | `developer/guides/plugins/plugins/plugin-fundamentals/plugin-lifecycle.md` = target | pass (1+1) | 0 | partly | `raw/fs-docs/dev-02.json` |
| dev-03 | How do I add a custom Store API route for a headless storefront? | `developer/guides/plugins/plugins/framework/store-api/add-store-api-route.md` = target | pass (1+1) | 0 | pass | `raw/fs-docs/dev-03.json` |
| dev-04 | How do I create a custom CMS element for Shopping Experiences? | `developer/guides/plugins/plugins/content/cms/add-cms-element.md` = target | pass (1+1) | 0 | partly | `raw/fs-docs/dev-04.json` |
| dev-05 | How does theme inheritance work in Shopware — theme.json and SCSS over | `developer/guides/plugins/themes/inheritance/add-theme-inheritance.md` = target | pass (1+1) | 0 | pass | `raw/fs-docs/dev-05.json` |
| dev-06 | How do I add a custom Flow Builder action? | `developer/guides/plugins/plugins/framework/flow/add-flow-builder-action.md` = target | pass (1+1) | 0 | partly | `raw/fs-docs/dev-06.json` |
| dev-07 | My plugin needs to store its own data in a new table — how do I define | `developer/guides/plugins/plugins/framework/data-handling/add-custom-complex-data.md` = target | pass (1+1) | 0 | partly | `raw/fs-docs/dev-07.json` |
| dev-08 | In a plugin service, what is the Shopware 6 equivalent of Doctrine's ` | `developer/guides/plugins/plugins/framework/data-handling/reading-data.md` = target | pass (1+1) | 0 | pass | `raw/fs-docs/dev-08.json` |
| dev-09 | How do I make a field on my plugin's own entity translatable per langu | `developer/guides/plugins/plugins/framework/data-handling/add-data-translations.md` = target | pass (1+1) | 0 | pass | `raw/fs-docs/dev-09.json` |
| dev-10 | How do I write an indexer that precomputes derived data for my custom  | `developer/guides/plugins/plugins/framework/data-handling/add-data-indexer.md` = target | pass (1+1) | 0 | partly | `raw/fs-docs/dev-10.json` |
| dev-11 | On Shopware 6.7, which file do I declare my plugin's services in, and  | `developer/guides/plugins/plugins/services/add-custom-service.md` ≠ target | pass (1+1) | 0 | partly | `raw/fs-docs/dev-11.json` |
| dev-12 | I am on Shopware 6.6 — which file do I declare my plugin's service dep | — | n/a | 1 | fail | `raw/fs-docs/dev-12.json` |
| dev-13 | There is no event for what I need to change in a core Shopware service | `developer/guides/plugins/plugins/services/adjusting-service.md` = target | pass (1+1) | 0 | pass | `raw/fs-docs/dev-13.json` |
| dev-14 | I wrote a subscriber class in my plugin but it never fires — which int | `developer/guides/plugins/plugins/framework/event/listening-to-events.md` = target | pass (1+1) | 0 | pass | `raw/fs-docs/dev-14.json` |
| dev-15 | How do I work out which event Shopware actually dispatches for a given | `developer/guides/plugins/plugins/framework/event/finding-events.md` = target | pass (1+1) | 0 | partly | `raw/fs-docs/dev-15.json` |
| dev-16 | How do I run plugin logic whenever an order is written, and find out e | `developer/guides/plugins/plugins/framework/data-handling/using-database-events.md` ≠ target | fail (0+1) | 0 | partly | `raw/fs-docs/dev-16.json` |
| dev-17 | How do I overwrite the price of a product line item in the cart at run | `developer/guides/plugins/plugins/checkout/cart/add-cart-items.md` ≠ target | pass (1+1) | 0 | partly | `raw/fs-docs/dev-17.json` |
| dev-18 | My plugin's cart processor adds a surcharge line item, but it is added | — | fail (0+1) | 1 | partly | `raw/fs-docs/dev-18.json` |
| dev-19 | I need to move long-running work in my plugin out of the request into  | `developer/guides/plugins/plugins/framework/message-queue/add-message-to-queue.md` ≠ target | pass (1+1) | 0 | pass | `raw/fs-docs/dev-19.json` |
| dev-20 | How do I add my own condition to the Rule Builder from a plugin so sho | `developer/guides/plugins/plugins/framework/rule/add-custom-rules.md` = target | pass (1+1) | 0 | pass | `raw/fs-docs/dev-20.json` |
| dev-21 | My plugin dispatches its own domain event — how do I make it show up a | `developer/guides/plugins/plugins/framework/flow/add-flow-builder-trigger.md` = target | pass (1+1) | 0 | partly | `raw/fs-docs/dev-21.json` |
| dev-22 | How do I give my plugin a settings page the shop operator can fill in, | `developer/guides/plugins/plugins/plugin-fundamentals/add-plugin-configuration.md` = target | pass (1+1) | 0 | partly | `raw/fs-docs/dev-22.json` |
| dev-23 | How do I ship a mail template with my plugin so it is installed automa | `developer/guides/plugins/plugins/content/mail/add-mail-template.md` = target | pass (1+1) | 0 | partly | `raw/fs-docs/dev-23.json` |
| dev-24 | How do I get readable SEO URLs generated for the detail pages of my pl | `developer/guides/plugins/plugins/content/seo/add-custom-seo-url.md` = target | pass (1+1) | 0 | pass | `raw/fs-docs/dev-24.json` |
| dev-25 | How do I add a `bin/console` command to my plugin for a maintenance ta | `developer/guides/plugins/plugins/plugin-fundamentals/add-custom-commands.md` = target | pass (1+1) | 0 | pass | `raw/fs-docs/dev-25.json` |
| dev-26 | How do I add a custom document type such as a pro-forma invoice in Sho | `developer/guides/plugins/plugins/checkout/documents/v2/add-a-document-type.md` = target | pass (1+1) | 0 | fail | `raw/fs-docs/dev-26.json` |
| dev-27 | In Shopware 6.7, how do I extend a Storefront Twig template from my pl | `developer/guides/plugins/plugins/storefront/templates/customize-templates.md` = target | pass (1+1) | 0 | pass | `raw/fs-docs/dev-27.json` |
| dev-28 | How do I override an existing Storefront JavaScript plugin, such as th | `developer/guides/plugins/plugins/storefront/javascript/override-existing-javascript.md` = target | pass (1+1) | 0 | partly | `raw/fs-docs/dev-28.json` |
| dev-29 | How do I add my own data to an existing Storefront page or pagelet fro | `developer/guides/plugins/plugins/storefront/controllers/add-data-to-storefront-page.md` = target | pass (1+1) | 0 | partly | `raw/fs-docs/dev-29.json` |
| dev-30 | How do I add a custom filter to the Storefront product listing from my | `developer/guides/plugins/plugins/storefront/howto/add-listing-filters.md` = target | pass (1+1) | 0 | pass | `raw/fs-docs/dev-30.json` |
| dev-31 | How do I expose a plugin configuration value, such as a colour picked  | `developer/guides/plugins/plugins/storefront/styling/add-scss-variables.md` = target | fail (1+1) | 0 | partly | `raw/fs-docs/dev-31.json` |
| dev-32 | How do I define a custom field set for products from my plugin so merc | `developer/snippets/config/custom-fields-standalone.xml` ≠ target | pass (2+1) | 0 | partly | `raw/fs-docs/dev-32.json` |
| dev-33 | How do I register a custom Administration module from my plugin, and w | `developer/guides/plugins/plugins/administration/module-component-management/add-custom-module.md` = target | pass (1+1) | 0 | fail | `raw/fs-docs/dev-33.json` |
| dev-34 | How do I extend an existing Administration component and its Twig bloc | `developer/guides/plugins/plugins/administration/module-component-management/customizing-components.md` = target | pass (1+1) | 0 | pass | `raw/fs-docs/dev-34.json` |
| dev-35 | How do I load entities from the Admin API inside an Administration com | `developer/guides/plugins/plugins/administration/data-handling-processing/using-data-handling.md` = target | pass (1+1) | 0 | pass | `raw/fs-docs/dev-35.json` |
| dev-36 | How do I register ACL privileges for my plugin's Administration module | `developer/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.md` = target | pass (1+1) | 0 | pass | `raw/fs-docs/dev-36.json` |
| dev-37 | How do I set up and run PHPUnit integration tests for my Shopware plug | `developer/guides/development/testing/unit/php-unit.md` = target | pass (1+1) | 0 | partly | `raw/fs-docs/dev-37.json` |
| dev-38 | How do I write Jest unit tests for my Administration components in Sho | `developer/guides/development/testing/unit/jest-admin.md` = target | pass (1+1) | 0 | partly | `raw/fs-docs/dev-38.json` |
| dev-39 | How do I write end-to-end Cypress tests for my plugin against a Shopwa | `developer/guides/development/testing/index.md` ≠ target | fail (0+1) | 0 | fail | `raw/fs-docs/dev-39.json` |
| dev-40 | How do I upgrade a Composer-based Shopware project from 6.6 to 6.7 — w | `developer/guides/upgrades-migrations/upgrade-shopware.md` = target | pass (1+1) | 0 | pass | `raw/fs-docs/dev-40.json` |
| dev-41 | `composer update` to Shopware 6.7 aborts on a platform requirement and | `developer/guides/hosting/index.md` = target | fail (1+1) | 0 | fail | `raw/fs-docs/dev-41.json` |
| dev-42 | How do I check extension compatibility before upgrading with shopware- | `developer/products/tools/cli/project-commands/upgrade.md` = target | pass (1+1) | 0 | partly | `raw/fs-docs/dev-42.json` |
| dev-43 | My admin plugin still ships a webpack.config.js — how do I move the ad | `developer/guides/upgrades-migrations/administration/vite.md` = target | pass (1+1) | 0 | partly | `raw/fs-docs/dev-43.json` |
| dev-44 | After the Vue 3 upgrade my admin plugin broke — this.$parent resolves  | `developer/guides/upgrades-migrations/administration/vue3.md` = target | pass (1+1) | 0 | partly | `raw/fs-docs/dev-44.json` |
| dev-45 | Shopware.State is deprecated in 6.7 — how do I convert my administrati | `developer/guides/upgrades-migrations/administration/pinia.md` = target | pass (1+1) | 0 | pass | `raw/fs-docs/dev-45.json` |
| dev-46 | sw-button and sw-card are deprecated in Shopware 6.7 — how do I migrat | `developer/guides/upgrades-migrations/administration/meteor-components.md` = target | pass (1+1) | 0 | fail | `raw/fs-docs/dev-46.json` |
| dev-47 | My payment plugin implements `AsynchronousPaymentHandlerInterface` and | `developer/guides/plugins/plugins/checkout/payment/add-payment-plugin.md` = target | pass (3+1) | 0 | partly | `raw/fs-docs/dev-47.json` |
| dev-48 | After upgrading, my storefront JavaScript plugin no longer loads — how | — | fail (0+1) | 0 | partly | `raw/fs-docs/dev-48.json` |
| dev-49 | My storefront controller still uses the `@Route` and `@RouteScope` ann | `developer/guides/plugins/plugins/storefront/controllers/add-custom-controller.md` = target | pass (1+1) | 0 | partly | `raw/fs-docs/dev-49.json` |
| dev-50 | My `ScheduledTaskHandler` stopped running after the upgrade — how must | `developer/guides/plugins/plugins/plugin-fundamentals/add-scheduled-task.md` = target | pass (1+1) | 0 | pass | `raw/fs-docs/dev-50.json` |
| dev-51 | Custom entities declared in `Resources/config/entities.xml` no longer  | `developer/guides/plugins/plugins/framework/data-handling/entities-via-attributes.md` = target | pass (1+1) | 0 | partly | `raw/fs-docs/dev-51.json` |
| dev-52 | What must a plugin database migration class implement in Shopware 6.7, | `developer/guides/plugins/plugins/database/database-migrations.md` = target | pass (1+1) | 0 | pass | `raw/fs-docs/dev-52.json` |
| dev-53 | My theme config labels disappeared from the Theme Manager after 6.7 —  | `developer/guides/plugins/themes/configuration/theme-configuration.md` = target | pass (1+1) | 0 | partly | `raw/fs-docs/dev-53.json` |
| dev-54 | How do I register a plugin cookie in the storefront cookie consent man | `developer/guides/plugins/plugins/storefront/advanced/add-cookie-to-manager.md` = target | pass (1+1) | 0 | pass | `raw/fs-docs/dev-54.json` |
| dev-55 | How do the breaking storefront accessibility changes reach my theme in | `developer/guides/development/accessibility/storefront-accessibility.md` = target | pass (1+1) | 0 | partly | `raw/fs-docs/dev-55.json` |
| dev-56 | Header and footer are loaded through ESI sub-requests in Shopware 6.7, | `developer/guides/plugins/plugins/storefront/templates/customize-header-footer.md` = target | pass (1+1) | 0 | pass | `raw/fs-docs/dev-56.json` |
| dev-57 | B2B Suite support ends with 6.8 — how do I run the B2B Suite Migration | `developer/products/extensions/b2b-suite-migration/execution/running-migration.md` = target | pass (1+1) | 0 | pass | `raw/fs-docs/dev-57.json` |
| dev-58 | My shopware.yaml still uses redis_url — how do I define the named Redi | `developer/guides/hosting/infrastructure/redis.md` = target | pass (1+1) | 0 | partly | `raw/fs-docs/dev-58.json` |
| dev-59 | After upgrading to Shopware 6.7 my Varnish cache is never invalidated  | `developer/guides/hosting/infrastructure/reverse-http-cache.md` = target | pass (1+1) | 0 | partly | `raw/fs-docs/dev-59.json` |
| dev-60 | Which transports do my Shopware message queue workers have to consume  | `developer/guides/hosting/infrastructure/message-queue.md` = target | pass (1+1) | 0 | partly | `raw/fs-docs/dev-60.json` |
| dev-61 | After the upgrade my Elasticsearch index has to be rebuilt — where do  | `developer/guides/hosting/infrastructure/elasticsearch/elasticsearch-setup.md` = target | pass (1+1) | 0 | fail | `raw/fs-docs/dev-61.json` |
| dev-62 | I changed a setting in `.env` on a deployed 6.7 shop but it still beha | `developer/guides/installation/legacy-setups/*.md` ≠ target | pass (1+1) | 1 | fail | `raw/fs-docs/dev-62.json` |
| dev-63 | I deployed a plugin update to a 6.7 staging shop and my new migration  | `developer/guides/plugins/plugins/database/database-migrations.md` ≠ target | fail (0+1) | 0 | partly | `raw/fs-docs/dev-63.json` |
| dev-64 | How do I get an Admin API OAuth token — with client_credentials for an | `developer/guides/development/integrations-api/index.md` ≠ target | pass (1+1) | 0 | partly | `raw/fs-docs/dev-64.json` |
| dev-65 | What can I put in the JSON body of `POST /api/search/{entity}` for fil | `developer/guides/development/integrations-api/search-criteria.md` = target | pass (1+1) | 0 | partly | `raw/fs-docs/dev-65.json` |
| dev-66 | Which request headers change Admin API behaviour for language, entity  | `developer/guides/development/integrations-api/request-headers.md` = target | pass (1+1) | 0 | partly | `raw/fs-docs/dev-66.json` |
| dev-67 | What does a minimal app folder and `manifest.xml` need to contain, and | `developer/guides/plugins/apps/app-base-guide.md` = target | pass (1+1) | 0 | pass | `raw/fs-docs/dev-67.json` |
| dev-68 | How does the registration handshake between Shopware and my app backen | `developer/guides/plugins/apps/lifecycle/app-registration-setup.md` = target | pass (1+1) | 0 | pass | `raw/fs-docs/dev-68.json` |
| dev-69 | How does an app subscribe to an event like `product.written`, what doe | `developer/guides/plugins/apps/lifecycle/webhook.md` = target | pass (1+1) | 0 | partly | `raw/fs-docs/dev-69.json` |
| dev-70 | How do I implement a payment method in an app with `pay-url` and `fina | `developer/guides/plugins/apps/checkout/payment.md` = target | pass (1+1) | 0 | partly | `raw/fs-docs/dev-70.json` |
| dev-71 | How does an app define its own custom entities in Shopware 6.7 and rea | `developer/guides/plugins/apps/custom-data/custom-entities.md` = target | pass (1+1) | 0 | partly | `raw/fs-docs/dev-71.json` |
| edge-01 | How do I configure Shopware 6's built-in GraphQL API for the Store API | `developer/index.md` ≠ target | n/a | 1 | unavailable | `raw/fs-docs/edge-01.json` |
| edge-02 | How do I get the DI container with `Shopware()->Container()` and overr | — | n/a | 1 | unavailable | `raw/fs-docs/edge-02.json` |
| edge-03 | Where do the `#[ORM\Entity]` mapping attributes for my plugin's entity | `developer/concepts/framework/data-abstraction-layer.md` ≠ target | n/a | 0 | pass | `raw/fs-docs/edge-03.json` |
| edge-04 | How do I fetch products with `GET /sales-channel-api/v3/product` on Sh | `developer/concepts/api/store-api.md` ≠ target | n/a | 0 | partly | `raw/fs-docs/edge-04.json` |
| edge-05 | How do I enable Shopware's built-in MCP server on a Shopware 6.6 shop? | `developer/products/tools/mcp-server/intro.md` = target | n/a | 0 | partly | `raw/fs-docs/edge-05.json` |
| edge-06 | I'm coming from Magento — what are the Shopware equivalents of store v | `merchant/content/en/shopware-6/migration-en/magento-keywords/v1-1-0-0.md` = target | n/a | 0 | partly | `raw/fs-docs/edge-06.json` |
| edge-07 | How do I set up Shopware PWA as the storefront for a Shopware 6.7 shop | — | n/a | 1 | partly | `raw/fs-docs/edge-07.json` |
| edge-08 | Which service do I type-hint to read products — `EntityRepositoryInter | `developer/guides/plugins/plugins/framework/data-handling/reading-data.md` ≠ target | n/a | 0 | pass | `raw/fs-docs/edge-08.json` |
| edge-09 | Where do I configure Business Events so that a mail is sent when an or | `merchant/content/en/shopware-6/settings/Flow-Builder/v1-3-0-1.md` ≠ target | n/a | 0 | partly | `raw/fs-docs/edge-09.json` |
| func-01 | How do I create a product with variants and configure its visibility p | `merchant/content/en/shopware-6/catalogues/products/v1-4-2-0.md` = target | fail (1+1) | 0 | partly | `raw/fs-docs/func-01.json` |
| func-02 | How do Rule Builder conditions work for shipping and payment methods? | `merchant/content/en/shopware-6/settings/rules/v1-6-1-0.md` = target | pass (1+1) | 0 | partly | `raw/fs-docs/func-02.json` |
| func-03 | How do promotions and discount codes work, including individually gene | `merchant/content/en/shopware-6/marketing/promotions/v1-7-0-0.md` = target | pass (1+1) | 0 | pass | `raw/fs-docs/func-03.json` |
| func-04 | What does the Shopware Migration Assistant transfer automatically from | `merchant/content/en/shopware-6/migration-en/what-is-migrated/v1-1-0-0.md` = target | fail (1+1) | 0 | partly | `raw/fs-docs/func-04.json` |
| func-05 | How do I set up a sales channel - storefront versus headless type, dom | `merchant/content/en/shopware-6/settings/saleschannel/v1-5-2-0.md` = target | pass (1+1) | 0 | partly | `raw/fs-docs/func-05.json` |
| func-06 | Which triggers and actions does the Flow Builder offer, and how do I m | `merchant/content/en/shopware-6/settings/Flow-Builder/v1-3-0-1.md` = target | pass (1+1) | 0 | partly | `raw/fs-docs/func-06.json` |
| func-07 | How do I import products from a CSV with an import/export profile - co | `merchant/content/en/shopware-6/shopware-en/settings/importexport/v1-4-0-0.md` = target | pass (1+1) | 0 | partly | `raw/fs-docs/func-07.json` |
| func-08 | How do custom field sets work - entity assignment, field types and tec | `merchant/content/en/shopware-6/settings/custom-fields/v1-3-2-0.md` = target | pass (1+1) | 0 | partly | `raw/fs-docs/func-08.json` |
| func-09 | Why doesn't my payment method appear in the checkout - what has to be  | `merchant/content/en/shopware-6/settings/Paymentmethods/v1-4-0-0.md` = target | pass (1+1) | 0 | partly | `raw/fs-docs/func-09.json` |
| func-10 | How do dynamic product groups work in the administration and where can | `merchant/content/en/shopware-6/shopware-6-de/Catalogues/Dynamicproductgroups/v1-3-0-0.md` = target | fail (1+1) | 0 | partly | `raw/fs-docs/func-10.json` |
| func-11 | How do I create an integration for Admin API access in the administrat | `merchant/content/en/shopware-6/settings/system/integrationen/v1-1-0.md` = target | pass (1+1) | 0 | pass | `raw/fs-docs/func-11.json` |
| func-12 | A spec asks for customer-specific pricing and for a flow that calls an | `merchant/content/en/shopware-6/settings/Flow-Builder/v1-3-0-1.md` ≠ target | fail (0+1) | 0 | pass | `raw/fs-docs/func-12.json` |
| gap-01 | How do I add my own Admin API endpoint under `/api/...` from a plugin  | `developer/resources/guidelines/code/routing.md` ≠ target | n/a | 0 | partly | `raw/fs-docs/gap-01.json` |
| gap-02 | Shopware 6.7 removed the RSA JWT key files and `system:generate-jwt-se | `developer/products/tools/cli/project-commands/helper-commands.md` ≠ target | n/a | 0 | pass | `raw/fs-docs/gap-02.json` |
| gap-03 | My ERP integration stopped logging in after the 6.7 upgrade — what cha | `developer/guides/development/integrations-api/index.md` ≠ target | n/a | 0 | pass | `raw/fs-docs/gap-03.json` |
| gap-04 | After upgrading to 6.7 my plugin fatals on load because core class pro | `developer/resources/guidelines/code/core/6.5-new-php-language-features.md` ≠ target | n/a | 0 | partly | `raw/fs-docs/gap-04.json` |
| gap-05 | My plugin decorates `CachedProductRoute` to add cache tags — where did | `developer/guides/plugins/plugins/storefront/advanced/add-caching-to-custom-controller.md` ≠ target | n/a | 0 | partly | `raw/fs-docs/gap-05.json` |
| gap-06 | How do I create a shipping method from my plugin's installer or migrat | `developer/guides/plugins/plugins/checkout/payment/add-payment-plugin.md` ≠ target | n/a | 0 | pass | `raw/fs-docs/gap-06.json` |
| gap-07 | How do I create a media entity from a file on disk in PHP from my plug | `developer/guides/plugins/plugins/content/media/remote-thumbnail-generation.md` ≠ target | n/a | 0 | pass | `raw/fs-docs/gap-07.json` |
| gap-08 | How do I set up a Nuxt project with Shopware Composable Frontends agai | `developer/guides/plugins/apps/app-sdks/javascript/07-external-frontend.md` ≠ target | n/a | 0 | pass | `raw/fs-docs/gap-08.json` |

## Scores by case

### `fs-docs`

| Case | Grounding | Accuracy | Completeness | Citation | Honesty | Actionability | Total | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dev-01 | 100 | 40 | 70 | 70 | 100 | 100 | 77% | partly |
| dev-02 | 100 | 70 | 40 | 70 | 100 | 100 | 80% | partly |
| dev-03 | 100 | 70 | 100 | 70 | 100 | 100 | 89% | pass |
| dev-04 | 100 | 70 | 70 | 70 | 100 | 70 | 82% | partly |
| dev-05 | 100 | 100 | 100 | 70 | 100 | 100 | 97% | pass |
| dev-06 | 100 | 40 | 70 | 70 | 100 | 100 | 77% | partly |
| dev-07 | 100 | 40 | 70 | 70 | 100 | 100 | 77% | partly |
| dev-08 | 100 | 100 | 100 | 70 | 100 | 100 | 97% | pass |
| dev-09 | 100 | 70 | 70 | 70 | 100 | 100 | 85% | pass |
| dev-10 | 100 | 40 | 70 | 70 | 100 | 70 | 74% | partly |
| dev-11 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| dev-12 | 0 | 70 | 70 | 0 | 0 | 70 | 35% | fail |
| dev-13 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-14 | 100 | 100 | 100 | 70 | 100 | 100 | 97% | pass |
| dev-15 | 100 | 40 | 70 | 70 | 100 | 70 | 74% | partly |
| dev-16 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| dev-17 | 100 | 70 | 70 | 100 | 0 | 100 | 73% | partly |
| dev-18 | 100 | 40 | 70 | 100 | 70 | 70 | 73% | partly |
| dev-19 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-20 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-21 | 100 | 40 | 40 | 70 | 100 | 70 | 70% | partly |
| dev-22 | 100 | 70 | 70 | 70 | 100 | 70 | 82% | partly |
| dev-23 | 100 | 70 | 40 | 70 | 100 | 100 | 80% | partly |
| dev-24 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-25 | 100 | 100 | 100 | 70 | 100 | 100 | 97% | pass |
| dev-26 | 100 | 0 | 40 | 0 | 100 | 40 | 50% | fail |
| dev-27 | 100 | 100 | 100 | 0 | 100 | 100 | 90% | pass |
| dev-28 | 100 | 70 | 70 | 0 | 100 | 100 | 78% | partly |
| dev-29 | 100 | 70 | 70 | 0 | 100 | 100 | 78% | partly |
| dev-30 | 100 | 100 | 100 | 0 | 100 | 100 | 90% | pass |
| dev-31 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| dev-32 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| dev-33 | 70 | 0 | 40 | 0 | 100 | 40 | 42% | fail |
| dev-34 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-35 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-36 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-37 | 100 | 70 | 70 | 100 | 0 | 100 | 73% | partly |
| dev-38 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| dev-39 | 70 | 0 | 40 | 0 | 0 | 40 | 27% | fail |
| dev-40 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-41 | 100 | 0 | 0 | 0 | 100 | 40 | 44% | fail |
| dev-42 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| dev-43 | 100 | 0 | 40 | 100 | 100 | 70 | 63% | partly |
| dev-44 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| dev-45 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-46 | 100 | 0 | 0 | 100 | 100 | 40 | 54% | fail |
| dev-47 | 100 | 70 | 70 | 100 | 0 | 100 | 73% | partly |
| dev-48 | 100 | 70 | 70 | 100 | 40 | 100 | 79% | partly |
| dev-49 | 100 | 40 | 70 | 100 | 100 | 70 | 77% | partly |
| dev-50 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-51 | 100 | 40 | 70 | 0 | 100 | 70 | 67% | partly |
| dev-52 | 100 | 70 | 70 | 100 | 100 | 70 | 85% | pass |
| dev-53 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| dev-54 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-55 | 100 | 40 | 40 | 100 | 100 | 40 | 70% | partly |
| dev-56 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-57 | 100 | 100 | 100 | 40 | 100 | 100 | 94% | pass |
| dev-58 | 100 | 40 | 70 | 100 | 100 | 70 | 77% | partly |
| dev-59 | 100 | 40 | 70 | 100 | 100 | 40 | 74% | partly |
| dev-60 | 100 | 40 | 40 | 100 | 100 | 40 | 70% | partly |
| dev-61 | 100 | 40 | 40 | 100 | 0 | 40 | 55% | fail |
| dev-62 | 100 | 40 | 40 | 100 | 0 | 40 | 55% | fail |
| dev-63 | 100 | 40 | 70 | 100 | 100 | 40 | 74% | partly |
| dev-64 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| dev-65 | 100 | 40 | 70 | 100 | 100 | 100 | 80% | partly |
| dev-66 | 100 | 40 | 70 | 100 | 100 | 70 | 77% | partly |
| dev-67 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-68 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| dev-69 | 100 | 70 | 70 | 0 | 100 | 70 | 75% | partly |
| dev-70 | 100 | 0 | 40 | 100 | 100 | 40 | 60% | partly |
| dev-71 | 100 | 70 | 100 | 0 | 100 | 100 | 82% | partly |
| edge-01 | 100 | 100 | 0 | 100 | 100 | 100 | 85% | unavailable |
| edge-02 | 100 | 100 | 0 | 100 | 100 | 100 | 85% | unavailable |
| edge-03 | 100 | 100 | 100 | 100 | 100 | 70 | 97% | pass |
| edge-04 | 100 | 40 | 40 | 70 | 100 | 70 | 70% | partly |
| edge-05 | 100 | 70 | 70 | 100 | 0 | 100 | 73% | partly |
| edge-06 | 100 | 40 | 40 | 100 | 100 | 100 | 76% | partly |
| edge-07 | 100 | 70 | 70 | 70 | 100 | 40 | 79% | partly |
| edge-08 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| edge-09 | 100 | 40 | 40 | 100 | 100 | 100 | 76% | partly |
| func-01 | 100 | 40 | 70 | 100 | 100 | 70 | 77% | partly |
| func-02 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| func-03 | 100 | 100 | 100 | 40 | 100 | 100 | 94% | pass |
| func-04 | 100 | 40 | 70 | 0 | 100 | 40 | 64% | partly |
| func-05 | 100 | 70 | 40 | 100 | 100 | 100 | 83% | partly |
| func-06 | 100 | 40 | 40 | 100 | 100 | 100 | 76% | partly |
| func-07 | 100 | 40 | 40 | 100 | 100 | 100 | 76% | partly |
| func-08 | 100 | 40 | 40 | 100 | 100 | 100 | 76% | partly |
| func-09 | 100 | 40 | 40 | 100 | 100 | 100 | 76% | partly |
| func-10 | 100 | 40 | 40 | 100 | 100 | 100 | 76% | partly |
| func-11 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| func-12 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| gap-01 | 100 | 100 | 100 | 100 | 0 | 70 | 82% | partly |
| gap-02 | 100 | 100 | 70 | 100 | 100 | 100 | 95% | pass |
| gap-03 | 100 | 100 | 70 | 100 | 100 | 100 | 95% | pass |
| gap-04 | 100 | 70 | 40 | 100 | 100 | 100 | 83% | partly |
| gap-05 | 100 | 40 | 40 | 100 | 100 | 40 | 70% | partly |
| gap-06 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| gap-07 | 100 | 100 | 70 | 100 | 100 | 100 | 95% | pass |
| gap-08 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |

`unavailable` means the Source-absent override applied — the corpus had nothing and the agent honestly reported that; it is not a failure.

## Failures and official references

- **dev-01 (fs-docs)** — partly, 77%
  - Answer presents getDefinitionClass() as the (sole) abstract/extension-naming method for 6.7; expected fact 1 (confirmed against 6.7.13.0 code) states getDefinitionClass() does not exist in 6.7 and the sole abstract method is getEntityName() — this is the specific documentation defect cases.md flags for dev-01, and the answer falls into it
  - Fact 2 (allowed extension field shapes: AssociationField/Runtime/FkField-with-companion) only loosely covered via examples, not the constraint itself
  - Fact 3 (shopware.entity.extension tag, BulkEntityExtension since 6.6.10.0) is covered
  - findability fail: 4 list/grep calls occurred before the target page was read
  - Official: code: Framework/DataAbstractionLayer/EntityExtension.php:46 — "abstract public function getEntityName(): string; — the only abstract method in 6.7; getDefinitionClass() does not exist in 6.7."
- **dev-02 (fs-docs)** — partly, 80%
  - Fact 1 (seven lifecycle hooks, none abstract, final constructor) is mostly covered (install/postInstall/update/postUpdate/activate/deactivate/uninstall named) but the final-constructor and no-postActivate/Deactivate/Uninstall points are omitted
  - Fact 2 (keepUserData semantics) correctly stated in the non-inverted sense (must NOT delete data when true) and not contradicted
  - Fact 3 (PluginLifecycleService install order, CLI --activate/--keep-user-data) is entirely omitted
  - Single citation has rangeExists=false (overshoot) but matchesToolCallLog true and content on-topic
  - Official: code: Framework/Plugin/PluginLifecycleService.php:154-205 — "CLI plugin:install --activate installs and activates; plugin:uninstall --keep-user-data sets keepUserData, default false."
- **dev-04 (fs-docs)** — partly, 82%
  - Fact 1 (registerCmsElement requires only name+component; missing previewComponent silently hides it in the picker) covered only partially — the previewComponent silent-dead-end caveat is missing
  - Fact 2 (storefront rendering by Twig naming convention, no PHP registration) covered well
  - Fact 3 (AbstractCmsElementResolver, its three methods getType/collect/enrich, DI tag) is entirely omitted — no server-side data resolution mechanism discussed at all
  - Trap note (sidebar element list built solely from block registry) not addressed
  - Official: code: Content/Cms/DataResolver/Element/AbstractCmsElementResolver.php:21-27 — "abstract class AbstractCmsElementResolver implements CmsElementResolverInterface — subclass must supply getType(), collect(), enrich()."
- **dev-06 (fs-docs)** — partly, 77%
  - Fact 1 (FlowAction abstract class, getName/requirements/handleFlow, not an event subscriber) substantially covered
  - Fact 2 (flow.action tag with key attribute) covered at a basic level; the silent-no-op-on-mismatch caveat is missing
  - Fact 3's administration-registration claim (override core sw-flow-sequence-action component, ACTION constant, modalName()) contradicts the expected mechanism (flowBuilderService singleton with addActionNames/addLabels/addIcons/addGroups/addActionGroupMapping), and DelayableAction/TransactionalAction markers are not mentioned
  - This administration-registration description is not confirmed anywhere in the expected-answer snippet or citations and diverges from the documented flowBuilderService route
  - Official: code: Content/DependencyInjection/flow.xml:61,64-67 — "tagged_iterator tag="flow.action" index-by="key" — the service must be tagged flow.action with a key attribute."
- **dev-07 (fs-docs)** — partly, 77%
  - Fact 1 (only getEntityName/defineFields abstract; getEntityClass/getCollectionClass concrete with defaults) covered
  - Fact 2 directly contradicted: answer states the tag's `entity` attribute (set to the entity name) is what registers the repository name, but the expected fact states EntityCompilerPass reads getEntityName() on the instance, never the tag attribute — this is the exact 'absence' the expected file calls out
  - Fact 3 (migration must CREATE TABLE; created_at/updated_at auto-added) covered correctly
  - Official: code: Framework/DependencyInjection/CompilerPass/EntityCompilerPass.php:39-90 — "$repositoryId = $instance->getEntityName() . '.repository'; — the entity name comes from getEntityName(), not the tag's entity attribute."
- **dev-10 (fs-docs)** — partly, 74%
  - Fact 1 lists only getName/iterate/update/handle as required; omits two of the six abstract members (getTotal, getDecorated) — a class built from this answer would fail to instantiate, a materially misleading omission
  - Fact 2 (sync-by-default vs forceQueue) covered correctly
  - Fact 3 (dal:refresh:index --skip/--only, sendFullIndexingMessage(), sync-path-only re-entrancy guard) only partially covered (no positional-arg / --skip/--only detail; DISABLE_INDEXING mentioned)
  - EntityWrittenContainerEvent/EntityIndexingSubscriber mechanism (part of fact 2) not named
  - Official: code: Framework/DataAbstractionLayer/Indexing/EntityIndexer.php:9-49 — "EntityIndexer declares six abstract members: getName, iterate, update, handle, getTotal, getDecorated."
  - Official: code: Framework/DataAbstractionLayer/Indexing/Subscriber/EntityIndexingSubscriber.php:20-28 — "EntityWrittenContainerEvent => [['refreshIndex', 1000]]"
- **dev-11 (fs-docs)** — partly, 80%
  - Answer states 'XML services.xml is deprecated as of 6.7' as a flat fact; expected fact 1 is explicit that this only became true from 6.7.14.0 onward and is false for the installed 6.7.13.0 — a materially wrong overgeneralization on the query's central question
  - Fact 2 (autowiring not default; opt-in via ->defaults()->autowire()) covered correctly
  - Fact 3 (explicit service()/argument injection) covered correctly; named-alias autowiring for `<entity>.repository` not mentioned
  - Both citations fully verified (2/2)
  - Official: code: Framework/Bundle.php:212-231 — "registerContainerFile() loads services.xml/.yaml/.php via a DelegatingLoader; at 6.7.13.0 no deprecation is triggered for XML."
- **dev-12 (fs-docs)** — fail, 35%
  - The report's own self-reported toolCallLog contains a single grep call and zero Read calls, yet the answer contains specific quoted content and two path+line-range citations with real, verified excerpts — no Read of either cited file is logged even by the agent's own account
  - Audit shard marks matchesToolCallLog=false for both citations, confirming they do not correspond to any logged read_doc/Read call
  - This is a fabrication/no-supporting-entry pattern under the Honesty rubric (band 0), independent of the ground-truth-vs-self-report question
  - Facts 1 and 2 (services.* glob location, explicit <argument type="service"> injection) are substantively present in the answer text; fact 3 (autowiring not default in 6.6, mechanism unchanged in 6.7) is not addressed
  - Official: code: github v6.6.10.24 src/Core/Framework/Bundle.php:188-210 — "registerContainerFile() glob is Resources/config/services.* with XML, YAML and PHP loaders — identical mechanism to 6.7."
- **dev-15 (fs-docs)** — partly, 74%
  - Answer recommends searching for the `@Event` annotation to find event classes; expected file's Absences table states this annotation does not exist anywhere in 6.7 source (0 grep matches) — a materially wrong technique recommendation
  - Fact 1 (DAL entity.event naming pattern) covered at a basic level, missing the NestedEventDispatcher/grep-finds-nothing nuance
  - Fact 2 (no post-render event; StorefrontRenderEvent before Twig; page-loaded events via GenericPageLoader) is well covered, including the correct GenericPageLoadedEvent mechanism
  - Fact 3's other discovery methods (debug:event-dispatcher limitation, debug:business-events) are not mentioned
  - Official: code: absence table — grep -rn "@Event" vendor/shopware — "returns 0 matches across core, storefront, administration and elasticsearch — the @Event annotation search term is dead."
- **dev-16 (fs-docs)** — partly, 73%
  - Fact 1 (order.written subscription via EntityWrittenEvent/getWriteResults) is substantially present
  - Fact 2 (opt-in via PreWriteValidationEvent + ChangeSetAware::requestChangeSet()) is not mentioned; instead the answer describes a different, generic EntityWriteEvent + getCommandsForEntity()/getPayload() mechanism which does not match the documented ChangeSet opt-in path
  - Fact 3 (only UpdateCommand/DeleteCommand implement ChangeSetAware; keys are DB storage names) is entirely absent
  - findability fail: the target page listen-to-order-changes.md was never read; the agent instead read using-database-events.md, whose content does not carry the ChangeSetAware/PreWriteValidationEvent facts, so no drift tolerance applies
  - Official: code: Framework/DataAbstractionLayer/Write/Command/ChangeSetAware.php:18-22 — "requestChangeSet() is the opt-in; only UpdateCommand/DeleteCommand implement ChangeSetAware."
- **dev-17 (fs-docs)** — partly, 73%
  - All three facts correctly covered: one collector+processor class (fact 1), priority ordering so the plugin's processor runs after ProductCartProcessor (fact 2), QuantityPriceDefinition built and set on $toCalculate not $original (fact 3)
  - selfReportDelta shows actual (6) exceeds reported (3) — a materially under-reported toolCallLog by the mechanical rule
  - Both citations fully verified (2/2)
- **dev-18 (fs-docs)** — partly, 73%
  - Fact 1 ($toCalculate is the cart the processor must add to; collect() only fetches data) is present
  - Fact 2's root cause (LineItemCollection::add() sums quantities rather than replacing on re-add, CartRuleLoader's up-to-7-iteration loop, the deterministic-id / read-from-$original pattern) is not explained; instead the answer offers an uncertain, self-labelled-from-memory claim that rebuilding each pass 'does not itself create persisted duplicates', which does not match the actual mechanism
  - Fact 3 (CartDataCollection carried forward via $cart->setData($original->getData()); quantity re-stamped on the definition) is only loosely covered
  - All three citations verified (3/3), though matchesToolCallLog is false per the audit shard for this case
  - Official: code: Checkout/Cart/Processor.php:34-52 — "$toCalculate is a brand-new empty Cart each pass; the CartDataCollection is explicitly carried forward via $cart->setData($original->getData())."
- **dev-21 (fs-docs)** — partly, 70%
  - Falls directly into the case's documented trap: recommends registering the BusinessEventCollectorEvent subscriber 'with a high priority, e.g. 1000, so it runs before other subscribers' — the case explicitly requires an answer that must NOT require an elevated priority
  - Only presents the BusinessEventCollectorEvent subscriber route and omits the Bundle::getActionEventClasses() alternative — again exactly the pattern the case flags as the wrong doc recipe
  - Fact 1 (FlowEventAware interface) is present
  - Fact 3 ($event->getName() drives dispatch, not define()'s custom name) is not addressed at all
  - Official: code: Framework/Event/BusinessEventCollector.php:27-49 — "the sole core listener runs at default priority 0 and the final order is a name-based uasort — no elevated priority is load-bearing."
- **dev-22 (fs-docs)** — partly, 82%
  - Lists 15 of the 16 expected field types, omitting 'price'
  - Fact 2 (<component> escape hatch for unsupported types) covered well
  - Fact 3 (system_config key format, SystemConfigService typed getters, defaults written only when declared) is entirely absent — the answer only covers the operator-facing UI path, not the storage/read-back mechanism
  - Fact 1 (config.xml path/XSD validation/no PHP involvement) is only partially covered — no mention of XSD validation or the bundleConfigNotFound exception on a missing file
  - Official: code: System/SystemConfig/Schema/config.xsd:38,41-60 — "exactly 16 input-field types enumerated; type defaults to text."
- **dev-23 (fs-docs)** — partly, 80%
  - Fact 1 (migration-based insertion of mail_template_type/translations/mail_template/mail_template_translation, idempotency guard) is well covered
  - Fact 2 (core's CreateMailTemplateTrait helper, added 6.7.8.0, and its inability to carry a plugin's own template bodies) is entirely omitted
  - Fact 3 (system_default is unenforced and 1 is actually the safer value despite doc convention of 0; mail_template_sales_channel table dropped in 6.7; no PHP/business-event registration needed) is not covered — the example uses system_default=0 with no caveat
  - No contradicted statements in what is covered
  - Official: code: Migration/Traits/CreateMailTemplateTrait.php:12-18 — "createMail() creates the type, template and all translations in one call, but cannot carry a plugin's own template bodies."
- **dev-26 (fs-docs)** — fail, 50%
  - Answer builds entirely on the Document System v2 recipe (AbstractDocumentType/DocumentV2 tags); code shows this stack does not exist at 6.7.13.0 — the legacy v1 stack (AbstractDocumentRenderer, tag document.renderer) is the correct route for this pin, and the v2 page is the exact trap dev-26 is designed to probe.
  - Citation range developer/guides/.../add-a-document-type.md:1-162 exceeds the file's real length (audit rangeExists=false, excerpt clipped) — citation range does not exist as claimed.
  - Completeness: only the document_type row / number-range registration fact (fact 2) is loosely present; facts 1 (legacy stack requirement) and 3 (v1 literal template-path mechanism) are absent because the answer never departs from the v2 framing.
  - Official: code: Checkout/Document/Renderer/AbstractDocumentRenderer.php:19-29 — "the v1 renderer stack (AbstractDocumentRenderer, document.renderer tag) is what exists at 6.7.13.0; AbstractDocumentType/shopware.document_v2.type do not exist at this patch."
- **dev-28 (fs-docs)** — partly, 78%
  - Fact 3's second half (re-register() with the same name+selector is a no-op, not an override, and warns) is not stated — omitted.
  - Citation range clipped/exceeds file length (audit rangeExists=false).
  - Official: code: storefront Resources/app/storefront/src/plugin-system/plugin.manager.js:698 — "PluginManager.override('CookiePermission', MyCookiePermission, '[data-cookie-permission]') is refused unless the registry holds that name for that selector."
- **dev-29 (fs-docs)** — partly, 78%
  - Fact 2's core insight (header/footer are rendered as separate ESI sub-requests with no 'page' variable, so a *PageLoadedEvent subscriber cannot reach them — only Header/FooterPageletLoadedEvent works) is never stated, even though the answer's own footer example happens to use the correct pagelet-event mechanism by coincidence.
  - Facts 1 (addExtension/addArrayExtension mechanism) and 3 (DAL-avoidance convention, use a store-api route) are both present and accurate.
  - Citation range clipped/exceeds file length (audit rangeExists=false).
  - Official: code: storefront Resources/views/storefront/base.html.twig:55,114 — "header and footer are ESI sub-requests (render_esi) — no page variable exists in the header/footer templates."
- **dev-31 (fs-docs)** — partly, 80%
  - Findability fail: 4 list/grep calls occurred before the target page was read, exceeding the 2-call threshold.
  - Answer claims the ThemeCompilerEnrichScssVariablesEvent subscriber route is what 'allows per-sales-channel values, unlike variables added outside this event which are global' — code shows the standard <css> XML route already resolves the config domain per sales channel via the core subscriber, so this framing is misleading.
  - Fact 2 (colorpicker fields work because they cast to string; bool/checkbox fields are silently dropped) is entirely absent — the answer never distinguishes field-type support.
  - Official: code: storefront Theme/Subscriber/ThemeCompilerEnrichScssVarSubscriber.php:42-79 — "resolves the <TechnicalName>.config domain per sales channel and emits $<css value>: <value>; into theme-variables.scss."
- **dev-32 (fs-docs)** — partly, 80%
  - Answer states custom fields became non-searchable by default 'since Shopware 6.7.6.0' — code confirms it is 6.7.7.0, not 6.7.6.0; this is precisely the version trap the case's expected answer calls out.
  - Immutability of the set/field technical names and type (persister omits them on update) and the custom_field.editor ACL requirement for editing are not mentioned — fact 3 is incomplete beyond the wrong version.
  - Declarative custom-fields.xml route (fact 1) and the related-entities binding requirement (fact 2) are both present and match code.
  - Official: code: Framework/Plugin/PluginLifecycleService.php:569-583 — "Since 6.7.13.0 a plugin declares its sets declaratively in custom-fields.xml, read and synced by PluginLifecycleService."
- **dev-33 (fs-docs)** — fail, 42%
  - Answer states settingsItem.group is limited to 'shop'/'system'/'plugins' — this is the documented trap; code shows no such runtime restriction and 'shop' is not even in the 6.7 TypeScript union.
  - Build/shipping description uses a pre-Vite webpack-era output path (public/administration/js/<plugin-name>.js) instead of the actual 6.7 Vite chain (active plugin required for var/plugins.json, .vite/entrypoints.json, assets:install), contradicting the confirmed build-visibility fact — directly relevant to the query's 'what has to line up... after a build'.
  - Module-registration abort conditions (hyphen requirement, duplicate id, missing routes/routeMiddleware, display:false) are not mentioned.
  - Menu-entry requirements (parent for plugin nav entries, non-empty label, +1000 position shift, no icon fallback) are not mentioned.
  - Official: code: administration package src/core/factory/module.factory.ts:159,170-177,180-189,192-198,202-210 — "registration aborts with a console warning for various conditions; type defaults to 'plugin' when omitted."
- **dev-37 (fs-docs)** — partly, 73%
  - selfReportDelta shows a materially under-reported toolCallLog: ground truth has 4 calls but only 3 were self-reported, with a Bash ls and a Read call missing from the report — honesty=0 per rubric.
  - Fact 3 (TestBootstrapper forces a _test DATABASE_URL suffix; shopware/core ships no phpunit dependency, so the runner must be required separately) is not addressed; the answer's suggestion to install a 'dev-tools' package is not corroborated by the cited excerpt.
  - Facts 1 (phpunit.xml/TestBootstrap.php chain) and 2 (IntegrationTestBehaviour/KernelTestBehaviour) are present and accurate.
  - Official: code: Framework/Plugin/Command/Scaffolding/stubs/test-bootstrap.stub:1-12 — "TestBootstrapper chain: addCallingPlugin() -> addActivePlugins() -> setForceInstallPlugins(true) -> bootstrap() -> getClassLoader()."
- **dev-38 (fs-docs)** — partly, 73%
  - wrapTestComponent (the primary global-based mounting approach installed via setupFilesAfterEnv) is not mentioned; only the Component.register+build+shallowMount path is covered.
  - Vue Test Utils 2.x nesting of stubs/mocks/provide under a `global` key is not addressed — the answer's phrasing (e.g. 'stubs option', 'provide option') suggests top-level options rather than the actual v2 API shape.
  - Specific facts about the installed admin package lacking a test/ directory, shipping no jest-preset-sw6-admin, and jest.config.js throwing without a generated component-imports map are not mentioned; the answer does add a generic caveat that platform composer scripts may not apply directly to a plugin.
  - Official: code: scripts/create-spec-file/template/template.spec_js:1-43 — "wrapTestComponent/flushPromises are globals installed by setupFilesAfterEnv, not imports; stubs/mocks/provide live under global in Vue-3 test-utils."
- **dev-39 (fs-docs)** — fail, 27%
  - Findability fail: the target page developer/guides/development/testing/e2e-playwright/install-configure.md was never read; the agent stopped at testing/index.md and the legacy Cypress guide.
  - Despite acknowledging that Playwright is the officially supported tool, the answer proceeds to give a full, detailed Cypress setup walkthrough — exactly the documented trap: Cypress is functionally removed from 6.7 (tests/e2e/cypress reduced to a single 0-byte file) and an answer built on the Cypress recipe is wrong regardless of the caveat.
  - Playwright specifics required by facts 2 and 3 (the @shopware-ag/acceptance-test-suite package, .env/APP_URL setup, bin/console integration:create --admin, npx playwright test, the actor-pattern fixtures/createTask scaffolding, and that tests/acceptance lives only in the platform repository) are entirely absent.
  - Two of the two citations show rangeExists=false in the audit (clipped excerpts).
  - Official: code: Resources/app/administration/src/app/plugin/shortcut.plugin.js:95-98 (shopware/administration) — "tests/e2e/cypress has been reduced to a single 0-byte support/commands/commands.js at v6.7.13.0 — no Cypress support remains."
- **dev-41 (fs-docs)** — fail, 44%
  - Answer frames the PHP requirement as an open-ended '8.2+' rather than the enumerated Composer constraint (~8.2.0||~8.3.0||~8.4.0||~8.5.0) — exactly the nuance the case tests: a PHP version outside the enumerated set (e.g. 8.5 on an older 6.7 patch, or a future 8.6) would abort composer update despite satisfying '8.2+'.
  - Does not mention that the database version check runs only inside DatabaseConnectionFactory::createConnection() (system:install / web installer) and never during composer update or application boot — a green composer update proves nothing about the database.
  - Does not mention the Administration vs Storefront Node version split, nor `composer check-platform-reqs` as the authoritative CLI preflight tool; the suggested checks (php -v, node -v, etc.) are generic and do not answer 'how do I check the machine against them before I retry'.
  - Findability fail: 4 list/grep calls occurred before the target page was read.
  - Official: code: composer.json:51-72 — "php: ~8.2.0 || ~8.3.0 || ~8.4.0 || ~8.5.0 — an enumerated, bounded constraint, not an open-ended '8.2 or newer'."
- **dev-42 (fs-docs)** — partly, 80%
  - Answer claims 'shopware-cli project validate' surfaces references to removed/renamed Shopware PHP types — code evidence explicitly shows PHPStan runs against the currently-installed Shopware version with no Shopware-specific removed/renamed-API rule set; this contradicts the expected fact.
  - Facts 1 (upgrade wizard usage/flags) and 2 (custom/plugins blocking because they are not Composer-managed) are present and largely accurate, though the since-0.18.4 composer.lock nuance is not covered.
  - Official: code: shopware-cli 0.18.4 internal/verifier/phpstan.go:58-83,181 — "shopware-cli project validate runs PHPStan against the Shopware version already installed, with no Shopware-specific removed-API rule set."
- **dev-43 (fs-docs)** — partly, 63%
  - Answer states the Vite admin build 'can currently be tested via the ADMIN_VITE feature flag' — code evidence shows no such flag exists in 6.7.13.0 (grep returns zero hits) and the build is unconditional; this reproduces a known stale claim from the 'Future Development Roadmap' doc page, exactly the trap dev-43 is designed to probe.
  - Custom vite.config.mts merge semantics (Shopware's inline config always overrides root/outDir/base; the plugin's default export is only the base) are not explained.
  - The var/plugins.json / bundle:dump discovery mechanism (fact 3) is correctly conveyed.
  - Official: code: administration Resources/app/administration/build/plugins.vite.ts:42-64,134-146 — "in 6.7 the administration build is Vite-only and unconditional — no ADMIN_VITE feature flag exists."
- **dev-44 (fs-docs)** — partly, 73%
  - Answer suggests 'this.$parent.$parent' as the Vue 3 fix for $parent misresolution — code shows the async-wrapper hop count is not fixed (11 hard-coded sync components, extensible via markComponentAsSync, and the router path inserts none), so a hardcoded double-hop is the wrong general fix; correct guidance is to walk the chain matching $options.name.
  - $tc deprecation details (deprecated tag:v6.8.0, warns under the V6_8_0_0 flag, auto-fixable by the eslint rule no-tc-translation, and that the codemod/ESLint rule set only covers **/*.js so a TypeScript plugin gets no automated warning) are not mentioned.
  - The Shopware.Snippet.tc replacement for this.$tc in prop defaults (fact 1) is correctly stated.
  - Official: code: administration Resources/app/administration/src/app/adapter/view/vue.adapter.ts:404-427,536-570,624-638 — "the AsyncComponentWrapper depth is not fixed — one hard-coded $parent hop is the wrong general fix; walk the chain matching $options.name."
- **dev-46 (fs-docs)** — fail, 54%
  - Answer's exact codemod invocation ('composer run admin:code-mods -- --plugin-name example-plugin --fix -v 6.7') is the documented trap — that composer script exists only in the shopware/shopware monorepo, not in a Flex/plugin project install; the correct invocation is 'npm run code-mods -- --fix --plugin-name <Name> -v 6.7' run from vendor/shopware/administration/Resources/app/administration.
  - The family-B distinction (sw-tabs/sw-popover gated by V6_8_0_0, sw-loader/sw-skeleton-bar gated by the undeclared ENABLE_METEOR_COMPONENTS flag — both defaulting to always render the deprecated variant) is not mentioned; the answer implies the deprecated-prop mechanism is general to all sw-* wrappers.
  - The deprecated prop / v-if="!deprecated" mechanism for sw-button/sw-card (fact 1) is correctly stated.
  - Official: code: administration code-mods.js:11-14,98-102,121-146,254-286,470-475 — "run `npm run code-mods -- --fix --plugin-name <Name> -v 6.7` from vendor/shopware/administration/Resources/app/administration; composer run admin:code-mods only exists in the monorepo."
- **dev-47 (fs-docs)** — partly, 73%
  - Fact 3 (payment_method row requires unique technicalName; handler_identifier must equal the service id; a plugin payment method must be deactivated, not deleted, on uninstall) is not mentioned.
  - selfReportDelta shows reported(5) < actual(7) — 2 ground-truth calls missing from the self-reported log, which would normally read as a materially under-reported log (honesty=0); the auditor separately flags a possible dev-47/dev-48 caseId boundary attribution artifact for this pair, so this reading carries reduced confidence.
  - Facts 1 (AbstractPaymentHandler, single tag) and 2 (supports/pay mandatory, PaymentHandlerType enum) are present and accurate.
  - Official: code: Checkout/Payment/Cart/PaymentHandler/AbstractPaymentHandler.php:18 — "the handler extends AbstractPaymentHandler; the interface family and per-type tags are gone, replaced by one class and shopware.payment.method."
- **dev-48 (fs-docs)** — partly, 79%
  - Ground-truth call log shows actual=0 for this case while the report claims a Read call and cites specific, content-accurate line ranges — likely explained by the documented dev-47/dev-48 caseId boundary attribution artifact (the auditor notes calls may have been grouped under the neighboring case's id) rather than outright fabrication; scored with a reduced-confidence honesty band rather than a flat 0.
  - Findability marked fail (target never read per ground truth) — plausibly affected by the same boundary-attribution issue; content and both citations are independently verified (2/2) and support the claims made.
  - Fact 1's diagnostic angle (discovery via var/plugins.json written by bundle:dump; a plugin missing from it is silently not built; a missing init() only warns) is not addressed, despite being directly relevant to the user's 'no longer loads' symptom.
  - Official: code: storefront Resources/app/storefront/src/plugin-system/plugin.manager.js:80 — "register() infers async from the argument having no prototype own-property; there is no separate async API or {async:true} option."
- **dev-49 (fs-docs)** — partly, 77%
  - Answer states storefront route names must use one of 'frontend, widgets, payment, api or store-api' — code shows only 'frontend.'/'widgets.'/'payment.' are route-NAME prefixes checked by Router::isStorefrontRoute(); 'api'/'store-api' are URL PATH prefixes of a separate mechanism, not name prefixes. This is exactly the confusion the case's absences table calls out.
  - Facts 1 (#[Route] attribute + route-scope default) and 2 (routes.php with type="attribute", public service + setContainer) are present and accurate.
  - Official: code: Storefront/Framework/Routing/Router.php:198-207 (shopware/storefront) — "the storefront route name must start with frontend., widgets. or payment. — the only three prefixes Router::isStorefrontRoute() accepts."
- **dev-51 (fs-docs)** — partly, 67%
  - Fact 3 (attribute entities do not auto-create their DB table; plugin must ship a MigrationStep) absent from answer
  - Answer frames PHP attributes as 'the required approach going into 6.7', contradicting the expected trap that the classic EntityDefinition + entities.xml route remains fully supported and non-deprecated
  - The single citation's line range (1-621) exceeds the file's actual length (rangeExists=false per audit) — citationsVerified 0/1
  - Official: code: Framework/DataAbstractionLayer/Attribute/Entity.php:10-32 — "#[Entity('example_entity')] on a class extending Entity; fields are typed public properties with #[Field(...)], no EntityDefinition subclass written."
- **dev-53 (fs-docs)** — partly, 80%
  - Answer states inline label/helpText are 'deprecated for v6.8', omitting that they still work as a fallback in 6.7 and are only stripped when the experimental v6.8.0.0 feature flag is active — the actual mechanism behind 'labels disappeared'
  - Fact 1's detail that an unknown field key is fatal (InvalidThemeConfigException) is not mentioned
  - Official: code: shopware/storefront Theme/ThemeConfigField.php:14-19 — "inline theme.json label/helpText are only stripped when the v6.8.0.0 feature flag is active — a flag-gated removal, not an unconditional v6.7.1.0 deprecation."
- **dev-55 (fs-docs)** — partly, 70%
  - Answer states the core template 'wraps old and new markup in an if/else' in 6.7, but fact 1 says that branching is gone in 6.7 — the flag is a dead declaration nothing reads
  - Fact 2 (sw_extends resolution, silent drop of overridden blocks vs. parent() RuntimeError) is entirely absent
  - Fact 3's specific markup changes (product-card stretched-link, $font-size-base SCSS default, JS active-filter <button>) are not covered beyond a generic mention of theme:compile
  - Official: code: Framework/Resources/config/packages/feature.yaml:24-28 — "the ACCESSIBILITY_TWEAKS if/else branches from 6.6 are gone in 6.7; the new markup is unconditional and the flag is inert."
- **dev-58 (fs-docs)** — partly, 77%
  - Fact 2 (redis_url no longer exists; subsystems reference a named connection via cart storage/number-range/cache-invalidation-delay config keys) is entirely absent — the query's stated premise ('shopware.yaml still uses redis_url') is never addressed
  - Fact 3 (eviction policy per data class) is correctly reproduced
  - Official: code: absence table — grep for redis_url in 6.7 core — "redis_url no longer exists anywhere in 6.7 core; every subsystem references a named connection instead."
- **dev-59 (fs-docs)** — partly, 74%
  - Answer recommends setting use_varnish_xkey: true, but fact 2 states this key is now a deprecated no-op with no effect in 6.7 (Varnish is already the default gateway)
  - Answer claims cache:clear already cleared the HTTP cache pre-6.7, contradicting fact 3 (ReverseProxyCacheClearer was removed in 6.7, so cache:clear no longer touches the reverse proxy)
  - Fact 3's central troubleshooting cause — delayed invalidation defaults to true, requiring the shopware.invalidate_cache scheduled task — is never mentioned, despite being the most likely real cause of 'never invalidated'
  - Official: code: Framework/Adapter/Cache/CacheInvalidator.php:62-81,87-106,149-152 — "invalidation is delayed by default (shopware.cache.invalidation.delay_enabled defaults to true); the actual PURGE runs via the scheduled task every 5 minutes."
- **dev-60 (fs-docs)** — partly, 70%
  - Answer states a CLI worker must also be set up for the 'failed' transport ('retried automatically 3 times then deleted'), directly contradicting fact 3: failed is a dead-letter target drained with messenger:failed:*, never a transport a standing worker consumes, and messages are moved to failed rather than deleted
  - Fact 2's operational consequence (disabling the admin worker makes a separate bin/console scheduled-task:run process mandatory) is never mentioned
  - No mention of the 6.7-only 'webhook' transport trap (must not be given to a CLI worker while WEBHOOKS_REWORK is off)
  - Official: code: symfony/messenger EventListener/SendFailedMessageToFailureTransportListener.php:37-74 — "a message that exhausts max_retries is moved to the failed transport, not deleted."
- **dev-61 (fs-docs)** — fail, 55%
  - Answer states 'By default Shopware uses three shards and three replicas', reproducing exactly the case's documented trap — fact 1 says the 6.7 storefront defaults are now empty (cluster decides), not 3/3
  - Fact 3 (separate admin-index shard/replica config, still defaulting to 3/3 and deprecated for 6.8, with its own es:admin:index command) is entirely missing
  - Answer cites bin/console dal:refresh:index --use-queue, a command not in the expected facts
  - Official: code: shopware/shopware@v6.7.13.0 src/Elasticsearch/Resources/config/packages/elasticsearch.yaml — "in 6.7 both storefront shard/replica env defaults are empty — Shopware no longer forces 3/3; only the admin indices still default 3/3."
- **dev-62 (fs-docs)** — fail, 55%
  - selfReportDelta shows a real content-bearing Read call omitted from the self-reported toolCallLog (not merely an orientation listing) — the report understates how the answer was obtained
  - Fact 2 (do not claim cache:clear is needed for .env changes; only FEATURE_* flags are baked into the compiled container) is entirely absent from the answer
  - Fact 1's full precedence chain (.env.$APP_ENV, .env.$APP_ENV.local, and the .env.local.php bypass case) is only partially given via a [from memory] simplification
  - Official: code: vendor/symfony/dotenv/Dotenv.php:110-177,216-224 — "a real environment variable wins over every .env file; if .env.local.php exists, bootEnv() reads from that file alone."
- **dev-63 (fs-docs)** — partly, 74%
  - Fact 2 — the actual troubleshooting causes for a migration silently not running (deactivated plugin, exit-0 on an unknown identifier, a Migration directory not registered until a cache:clear) — is completely absent, despite being the core of the query
  - Fact 3's requirement that plugin:refresh (and a version bump) run before plugin:update will pick up new migrations is not mentioned
  - findabilityStrict is 'fail': the target commands-reference.md page was never read; the agent instead answered from database-migrations.md
  - Official: code: Framework/Migration/Command/MigrationCommand.php:121-129 — "an unknown identifier prints 'No collection found for identifier' and exits 0 — a typo looks like a successful run."
- **dev-64 (fs-docs)** — partly, 80%
  - Answer's client_credentials example shows expires_in: 3600 (1 hour), but fact 2 states the access-token TTL is PT10M (600 seconds) for every grant type including client_credentials — this directly contradicts the query's own question ('how long is each token valid')
  - Password-grant example correctly shows 600s and a refresh_token
  - Official: code: Framework/Api/EventListener/Authentication/ApiAuthenticationListener.php:47 — "the access-token lifetime is PT10M (600 seconds), identical for every grant including client_credentials."
- **dev-65 (fs-docs)** — partly, 80%
  - Answer states total-count-mode: 1 (exact) 'uses SQL_CALC_FOUND_ROWS', contradicting fact 3, which explicitly states it is not SQL_CALC_FOUND_ROWS but a second COUNT(*) over the subquery
  - Fact 2's to-one vs. to-many association caveat (nested filter/sort/limit reach the SQL only for to-many associations; silently ignored on to-one) is not mentioned
  - Official: code: Framework/DataAbstractionLayer/Search/RequestCriteriaBuilder.php:58,120 — "total-count-mode accepts both strings (none/exact/next-pages) and integers (0/1/2); default is none (0)."
- **dev-66 (fs-docs)** — partly, 77%
  - Fact 2's trap — sw-inheritance is a presence-only check, so there is no way to disable inheritance by sending a falsy value like 0 — is not mentioned; the answer only shows the header being sent as '1'
  - Fact 1's languageNotFound error on an invalid/non-UUID sw-language-id, and the requested→parent→system fallback chain, are omitted
  - Fact 3's FILTER_VALIDATE_BOOLEAN parsing and its application to every /api route (not just sync) are omitted
  - Official: code: Framework/Routing/ApiRequestContextResolver.php:124 — "sw-inheritance switches on considerInheritance by presence alone — any value, including 0 or false, enables it."
- **dev-69 (fs-docs)** — partly, 75%
  - Fact 1's requirement that the app must hold the entity's read privilege, else the webhook is silently skipped with no message/log/delivery, is not mentioned
  - The single citation's line range (10-146) exceeds the file's real length (rangeExists=false per audit)
  - Official: code: Framework/App/Hmac/RequestSigner.php:17-32 — "authenticity is hash_hmac('sha256', <raw body>, <app secret>) over the shopware-shop-signature header — only the body is signed."
- **dev-70 (fs-docs)** — partly, 60%
  - Answer lists 'all possible payment states' as open/paid/cancelled/refunded/failed/authorize/unconfirmed/in_progress/reminded/chargeback — several of these are STATE names, not the valid state-machine transition ACTION names fact 3 requires (paid, paid_partially, process, process_unconfirmed, authorize, chargeback, refund, refund_partially, remind, reopen, plus special cases cancel/fail); sending e.g. 'cancelled' or 'refunded' as status throws IllegalTransitionException in 6.7
  - Answer frames sync-vs-async as determined by which manifest URLs are declared, but fact 1 states there is only one handler (AppPaymentHandler) and the finalize step is triggered by whether the pay response carried a redirectUrl, not by manifest declarations
  - Fact 2's requirement that the app's own response must itself carry a shopware-app-signature header (verified by Shopware) is not mentioned
  - Official: code: System/StateMachine/Aggregation/StateMachineTransition/StateMachineTransitionActions.php:10-31 — "6.7's Migration1742302302RenamePaidTransitionActions renamed pay->paid, pay_partially->paid_partially, do_pay->process — old names must not be used."
- **dev-71 (fs-docs)** — partly, 82%
  - Fact 3's specific limitation — store-api-aware only attaches the ApiAware read-protection flag and creates no Store API route (storefront access instead goes through an app-script endpoint) — is not mentioned
  - The single citation's line range (1-128) exceeds the file's real length (rangeExists=false per audit)
- **edge-04 (fs-docs)** — partly, 70%
  - Fact 1 (no /sales-channel-api route in either version) is conveyed reasonably via the ADR findings and the absence of a v3 product endpoint.
  - Facts 2 and 3 (the real endpoint GET|POST /store-api/product with no version segment; sw-access-key header auth) are both missing — the answer never gives the actual path or authentication mechanism a developer needs.
  - One citation (the 2020 ADR) has matchesToolCallLog=false in the audit though file/range exist and the excerpt is real — likely surfaced via grep output rather than an explicit Read, so citation is capped below 100.
  - Official: code: Content/Product/SalesChannel/ProductListRoute.php:35-40 — "the real endpoint is GET|POST /store-api/product (route store-api.product.search), no /v3/ segment."
- **edge-05 (fs-docs)** — partly, 73%
  - selfReportDelta shows a materially under-reported toolCallLog: the ground-truth transcript includes a Read of developer/resources that the report's own toolCallLog omits — honesty=0 per rubric regardless of answer quality.
  - Content quality is otherwise excellent: correctly states 6.6 has no MCP server, correctly places it in 6.7 with the /api/_mcp endpoint, MCP_SERVER flag and experimental status, and gives concrete bin/console steps for the 6.7 path — all three expected facts are covered.
  - Official: code: https://github.com/shopware/shopware/blob/v6.6.10.0/src/Core/Framework/Resources/config/packages/feature.yaml — "6.6 contains no MCP implementation at all — no Framework/Mcp namespace, no MCP_SERVER flag entry."
- **edge-06 (fs-docs)** — partly, 76%
  - Fact 3 explicitly instructs the answer to state there is NO attribute-set equivalent rather than naming a look-alike; the answer instead presents 'Custom field sets' as the direct one-to-one Attribute Sets mapping — falling into the trap the case is built to catch.
  - Fact 4 (no di.xml equivalent) is correctly handled — the answer explicitly states no equivalent was found rather than inventing one.
  - Fact 2 (plugin vs. app as the two extension mechanisms) only names 'Plugin'; the app/manifest.xml alternative is missing.
  - Fact 1 (no website/store/store-view hierarchy; sales_channel+domain carries per-URL localisation) is reasonably conveyed via the sales-channel mapping.
  - Official: code: System/SalesChannel/Aggregate/SalesChannelDomain/SalesChannelDomainDefinition.php:63-67 — "per-URL localisation lives on the sales_channel_domain row (URL, language, currency, snippet set), not on a separate store-view object."
- **edge-07 (fs-docs)** — partly, 79%
  - Fact 1 (no PWA surface in 6.7) and fact 3 (Composable Frontends is the documented headless implementation) are both correctly stated.
  - Fact 2 (the actual 6.7 headless setup: API-type sales channel, Store API with sw-access-key + sw-context-token) is missing entirely — the answer stays at the 'Composable Frontends exists' level without giving the concrete mechanics.
  - One citation (store-api.md:14-17) has matchesToolCallLog=false in the audit though file/range/excerpt are real; treated as a soft traceability gap.
  - Official: code: composer.json:7-10 — "a word-boundary search for 'pwa' over core, storefront and administration returns zero matches — no PWA surface exists in 6.7."
- **edge-09 (fs-docs)** — partly, 76%
  - Answer repeats the Business-Events page's unconfirmed claim that 'Business Events is only still used for the B2B-Suite' — cases.md's known-defects list explicitly flags this framing as unconfirmed by core code, and the case's own trap note requires NOT repeating it; the answer does so almost verbatim.
  - Fact 2 (Flow Builder location, checkout.order.placed + Send mail action pairing) is correctly and concretely covered.
  - Fact 3 (Business event survives only as the read-only /api/_info/events.json catalogue, no write side) is not covered.
  - Official: code: Migration/V6_5/Migration1670854818RemoveEventActionTable.php:24-29 — "the event_action, event_action_rule and event_action_sales_channel tables are dropped by a V6_5 migration — no Business Events configuration screen exists in 6.6 or 6.7."
- **func-01 (fs-docs)** — partly, 77%
  - Fact 3 — the display_group / variant_listing_config mechanism (a NULL config hides the parent and collapses the listing to one arbitrary child variant, and the 6.7 admin generator never persists this config) — is entirely absent; the answer offers only generic visibility reasons
  - findabilityStrict is 'fail': more than 2 list/grep calls were made before the target page was read
  - Official: code: Content/Product/DataAbstractionLayer/VariantListingUpdater.php:52-83 — "display_group is write-protected, computed by VariantListingUpdater; in 6.7.13.0 'Generate variants' never persists variantListingConfig, so the column stays NULL and one arbitrary child variant colla"
- **func-02 (fs-docs)** — partly, 73%
  - Fact 2's key operational risk — matching runs against the serialized payload blob, not the condition rows, so an invalid/un-indexed rule silently blocks the method it guards — is not mentioned
  - Fact 3 — the double-check against pre-computed SalesChannelContext rule ids (CartRuleLoader, up to 7 iterations) and the specific ShippingMethodBlockedError/PaymentMethodBlockedError reasons (inactive / rule not matching / not allowed) — is entirely absent
  - Official: code: Framework/Rule/RuleIdMatcher.php:24-27 — "a shipping/payment method references at most one availability rule via a nullable FK; multiple conditions must be combined inside one rule."
- **func-04 (fs-docs)** — partly, 64%
  - Fact 2 (the eight premapping items: payment methods, salutations, order states, order delivery states, transaction states, newsletter recipient status, default delivery time, default shipping availability rule) — the answer's manual-mapping list omits order states, order delivery states, transaction states and newsletter recipient status entirely, and mischaracterizes 'Standard Payment Method'/'Standard delivery time' as separate items not matching the source structure
  - This is the direct answer to the query's second half ('what has to be mapped by hand before the migration starts')
  - findabilityStrict is 'fail': more than 2 list/grep calls preceded the target read
  - The single citation's line range (1-187) exceeds the file's real length (rangeExists=false per audit)
  - Official: code: SwagMigrationAssistant@6.6.x src/Profile/Shopware/DataSelection/BasicSettingsDataSelection.php:49-62 — "basicSettings is the mandatory base selection carrying languages, categories, customer groups, currencies, sales channels and number ranges."
- **func-05 (fs-docs)** — partly, 83%
  - Fact 1 (four sales-channel types incl. Agentic commerce; all fields Required regardless of type; default-language membership rule) not stated — answer names only Storefront/headless/product-comparison.
  - Fact 2 (domain pins url+language+currency+snippet; only Storefront-type served by domain; headless needs no domain) only half-stated — domain composition given, but the type restriction is missing.
  - Fact 3 (sw-access-key header, SWSC prefix, no secret counterpart, GET /api/_action/access-key/sales-channel) not stated — answer only says 'generate an API Access ID' and defers to developer docs.
  - Official: code: Defaults.php:27-33 — "typeId, languageId, customerGroupId, currencyId, paymentMethodId, shippingMethodId, countryId, navigationCategoryId and accessKey are Required for every sales channel type."
- **func-06 (fs-docs)** — partly, 76%
  - Case is pinned to 6.6, whose Flow Builder sits under Settings > Shop; answer states 'Settings > Automation', which is the 6.7 path — a wrong, version-specific menu path (rubric's 'wrong menu path' example).
  - Fact 2 (16 core actions, delay/webhook are licence-gated) is substantively covered — Delayed Actions correctly noted as Beyond-plan, Call URL correctly noted as Commercial/Evolve+.
  - Fact 3's nuance (recipient.type=custom replaces the event audience entirely; a default order-confirmation flow already ships for this event) is missing.
  - Answer correctly avoids repeating the page's false 'checkout.order.payment_method.changed sets order status to Open' claim.
  - Official: code: 6.6 Administration sw-flow/index.js:179-187 (ref v6.6.10.0) — "in 6.6 the sw-flow module's settingsItem.group returns 'shop' unless the v6.7.0.0 feature flag is active; 6.7 moves it to Settings > Automation."
  - Official: code: administration Resources/app/administration/src/module/sw-flow/index.js (6.7.13.0) — "6.7 hard-codes 'automation' as the settings group."
- **func-07 (fs-docs)** — partly, 76%
  - Answer states dry run 'lets you fully test the import without committing it' — this repeats the doc's naive framing; expected fact 3 explicitly requires stating dry run performs real writes inside a transaction that is rolled back, while the log/file rows and media filesystem changes survive outside that window. A developer relying on the answer would wrongly assume dry run leaves zero footprint.
  - Fact 2 (updateBy matching mechanics, silent collapse of duplicate mappings) only partially covered via 'Second Unique Identifier'; the duplicate-mapping-collapse behaviour is not mentioned.
  - 6.6-vs-6.7 menu-path distinction (Settings > Shop vs Automation) not given; only the current (6.7) 'Automation' label is stated, which is incomplete for the shared 6.6+6.7 case but not clearly wrong on its own.
  - Official: code: Content/ImportExport/ImportExport.php:116-118,180-182,191-194,196-210 — "dry run logs activity dryrun, performs the real writes and rolls the DBAL transaction back at the end — not a write-free validation pass."
- **func-08 (fs-docs)** — partly, 76%
  - Answer states technical names 'must avoid Twig special characters like - or # to prevent product-export errors', implying enforcement; expected fact 2 states that in 6.6 (the case's pinned version) this validation is gated behind the v6.7.0.0 flag and does NOT run on a stock 6.6 install — a version-specific contradiction.
  - Fact 1 (entity assignment via custom_field_set_relation, global not per-set uniqueness) is substantively covered.
  - Fact 3 (three independent switches incl. 'Visible in Store API'/store_api_aware; write limited to customer/customer_address/newsletter_recipient; 6.6 data-loss hole on all-non-whitelisted write) only half covered — only 'Modifiable via Store API' and 'Available in shopping carts' are mentioned, not the read-side store_api_aware switch or the 6.6 wipe bug.
  - Official: code: 6.6 System/CustomField/CustomFieldService.php (validateBeforeWrite) — "in 6.6 the Twig-variable name pattern is not enforced — validateBeforeWrite() returns immediately unless the v6.7.0.0 flag is active, unlike 6.7 which does enforce it."
- **func-09 (fs-docs)** — partly, 76%
  - Case is pinned to 6.6, whose payment-method path is Settings > Shop > Payment methods; answer states 'Settings > Commerce > Payment methods', the 6.7 path — wrong for the pinned version.
  - Fact 2 (availability rule, blank = unrestricted, checkout always requests available-only) is stated correctly and matches the expected facts well.
  - Fact 3 (dangling handler still offered until transaction time; checkout gateway can remove a method via RemovePaymentMethodCommand; PaymentMethodBlockedError 'not allowed') is not covered.
  - Official: code: Checkout/Payment/SalesChannel/SalesChannelPaymentMethodDefinition.php:15 — "the Store API payment-method listing unconditionally filters payment_method.salesChannels.id = current sales channel — Active alone does not make a method appear."
- **func-10 (fs-docs)** — partly, 76%
  - Findability fail: 4 list/grep calls before the target page was read (limit is 2).
  - Answer offers 'Keep matching variants grouped' (displayAsGroup) unconditionally for a case spanning 6.6+6.7; expected fact 3 states this field does not exist in 6.6 at all — a version-specific error for half the query.
  - Fact 2 (five usage places incl. cross-selling and the cart rule cartLineItemInProductStream) only 3 of 5 uses are named (category, comparison export, CMS slider); cross-selling and the cart rule are missing.
  - Fact 1 (product_stream entity, static/stream filter rows, write-protected api_filter/invalid computed by the indexer) is reasonably conveyed at the merchant-facing level.
  - Official: code: Content/Product/SalesChannel/Listing/ProductListingRoute.php:106 — "the finished dynamic product group can be referenced in five places, not three: category, cross-selling, CMS slider, product export and the cart rule."
- **gap-01 (fs-docs)** — partly, 82%
  - selfReportDelta shows a materially under-reported toolCallLog: 5 additional grep/find calls in the ground-truth transcript are absent from the report's own log — honesty=0 per rubric.
  - All three expected facts are otherwise well covered: the corpus is correctly reported as having no dedicated Admin API route guide, the closest real pages (Store API guide, ACL guide, admin-api concept page) are named without being presented as the Admin API answer, and no RouteScope/Acl PHP attribute class is invented.
  - Official: code: Framework/Api/Controller/AclController.php:19,33-41 — "_routeScope => [ApiRouteScope::ID] ('api') and _acl => ['<privilege>'] are Symfony #[Route] defaults, not dedicated attribute classes."
- **gap-04 (fs-docs)** — partly, 83%
  - Fact 1 (no page about the 6.7 native-property-types change; the phrase 'native type' occurs nowhere) is correctly and clearly stated.
  - Fact 2 names a different closest page (the 6.5 PHP-language-features guideline) than the expected closest material (the #[PropertyTypeNarrowing]/#[PropertyTypeWidening] backward-compatibility guideline); the search for backward-compatibility.md returned nothing, so the actual closer analog was not found.
  - Fact 3's constructive fallback (grep the 6.6 tree for @deprecated tag:v6.7.0 markers) is not given; the answer correctly avoids inventing a property list but stops at 'I could not find sourced material'.
  - Official: code: Framework/DataAbstractionLayer/Entity.php:14-29 — "the only reliable enumeration is grepping the 6.6 tree for @deprecated tag:v6.7.0 - Will be natively typed and taking the paired @var — no command or shim reports this."
- **gap-05 (fs-docs)** — partly, 70%
  - Answer presents the ADR's planned _httpCache mechanism as if it straightforwardly caches a route today ('let the framework generate cache tags for you'), omitting that the store-api half only shipped in 6.7.6.0 and remains gated behind the experimental CACHE_REWORK flag (default false) — on a stock 6.7 install, _httpCache alone does not cache a store-api route. This is a materially misleading statement that could lead a developer to believe caching is active when it is not.
  - Fact 3 (cache tags added via injecting CacheTagCollector and calling addTag(), not by dispatching AddCacheTagEvent) is not mentioned by name.
  - Answer correctly avoids inventing the literal class name 'CachedProductRoute' and correctly identifies the _httpCache route-default as the general direction.
  - Official: code: Framework/Resources/config/packages/feature.yaml:64-68 — "from 6.7.6.0 store-api HTTP caching is gated behind the experimental CACHE_REWORK flag, which defaults to false — declaring _httpCache alone does not cache the route."

## Accuracy cross-checks

| Option | Flagged | Fetched | Served from cache | Bands changed | Fetch failures |
| --- | --- | --- | --- | --- | --- |
| `fs-docs` | 83 of 100 | 0 | 0 | 0 | none |

All 83 flagged cases carried `Status: confirmed` — their expected-answer facts were already verified against the Shopware source and carry `[code: …]` evidence tags, which the accuracy pass used as the cross-check per the rubric's rule that a confirmed case needs no documentation fetch (re-checking against the docs would reintroduce the circularity the ground-truthing removed). No live fetch was needed or performed.

No band changed — every flagged case held its provisional accuracy.

## Observations about source availability

- `dev-12` is the only `dev`/`func` case whose docs-corpus target is `none` (per the `Target path (docs)` exception table — the 6.6 dependency-injection page is not present in the current developer clone). Its report fabricated citations against a page it never read, scoring `honesty=0` and `verdict=fail` rather than the `unavailable` override, since the override requires an honest not-found and this case's report did not deliver one.
- `edge-01` and `edge-02` correctly triggered the Source-absent override (empty, reasonable grep chains, honest `notFoundClaim`), verdict `unavailable` — GraphQL and Smarty/DI-container traps genuinely have no page in the docs corpus.
- The suite's documented known-defect traps (see `cases.md` 'Known documentation defects') were largely NOT caught by the fs-docs discover agent: dev-01 (getDefinitionClass vs getEntityName), dev-26 (Document v2 recipe), dev-39 (Cypress vs Playwright), edge-09 (Business Events/B2B-Suite framing), and gap-05 (CACHE_REWORK flag) were each reproduced from the stale documentation rather than caught — these are documentation defects the corpus itself carries, not agent-navigation failures.
- `func-05`, `func-07`, `func-08`, `func-09` show minor blind-brief query drift (auditor: textual differences such as hyphens vs em dashes) — noted in `warnings`, not scored.

## Recommended fixes

- dev-01 (fs-docs): Answer presents getDefinitionClass() as the (sole) abstract/extension-naming method for 6.7; expected fact 1 (confirmed against 6.7.13.0 code) states getDefinitionClass() does not exist in 6.7 and the sole abstract method is getEntityName() — this is the specific documentation defect cases.md flags for dev-01, and the answer falls into it
- dev-02 (fs-docs): Fact 1 (seven lifecycle hooks, none abstract, final constructor) is mostly covered (install/postInstall/update/postUpdate/activate/deactivate/uninstall named) but the final-constructor and no-postActivate/Deactivate/Uninstall points are omitted
- dev-04 (fs-docs): Fact 1 (registerCmsElement requires only name+component; missing previewComponent silently hides it in the picker) covered only partially — the previewComponent silent-dead-end caveat is missing
- dev-06 (fs-docs): Fact 1 (FlowAction abstract class, getName/requirements/handleFlow, not an event subscriber) substantially covered
- dev-07 (fs-docs): Fact 1 (only getEntityName/defineFields abstract; getEntityClass/getCollectionClass concrete with defaults) covered
- dev-10 (fs-docs): Fact 1 lists only getName/iterate/update/handle as required; omits two of the six abstract members (getTotal, getDecorated) — a class built from this answer would fail to instantiate, a materially misleading omission
- dev-11 (fs-docs): Answer states 'XML services.xml is deprecated as of 6.7' as a flat fact; expected fact 1 is explicit that this only became true from 6.7.14.0 onward and is false for the installed 6.7.13.0 — a materially wrong overgeneralization on the query's central question
- dev-12 (fs-docs): The report's own self-reported toolCallLog contains a single grep call and zero Read calls, yet the answer contains specific quoted content and two path+line-range citations with real, verified excerpts — no Read of either cited file is logged even by the agent's own account
- dev-15 (fs-docs): Answer recommends searching for the `@Event` annotation to find event classes; expected file's Absences table states this annotation does not exist anywhere in 6.7 source (0 grep matches) — a materially wrong technique recommendation
- dev-16 (fs-docs): Fact 1 (order.written subscription via EntityWrittenEvent/getWriteResults) is substantially present
- dev-17 (fs-docs): All three facts correctly covered: one collector+processor class (fact 1), priority ordering so the plugin's processor runs after ProductCartProcessor (fact 2), QuantityPriceDefinition built and set on $toCalculate not $original (fact 3)
- dev-18 (fs-docs): Fact 1 ($toCalculate is the cart the processor must add to; collect() only fetches data) is present
- dev-21 (fs-docs): Falls directly into the case's documented trap: recommends registering the BusinessEventCollectorEvent subscriber 'with a high priority, e.g. 1000, so it runs before other subscribers' — the case explicitly requires an answer that must NOT require an elevated priority
- dev-22 (fs-docs): Lists 15 of the 16 expected field types, omitting 'price'
- dev-23 (fs-docs): Fact 1 (migration-based insertion of mail_template_type/translations/mail_template/mail_template_translation, idempotency guard) is well covered
- dev-26 (fs-docs): Answer builds entirely on the Document System v2 recipe (AbstractDocumentType/DocumentV2 tags); code shows this stack does not exist at 6.7.13.0 — the legacy v1 stack (AbstractDocumentRenderer, tag document.renderer) is the correct route for this pin, and the v2 page is the exact trap dev-26 is designed to probe.
- dev-28 (fs-docs): Fact 3's second half (re-register() with the same name+selector is a no-op, not an override, and warns) is not stated — omitted.
- dev-29 (fs-docs): Fact 2's core insight (header/footer are rendered as separate ESI sub-requests with no 'page' variable, so a *PageLoadedEvent subscriber cannot reach them — only Header/FooterPageletLoadedEvent works) is never stated, even though the answer's own footer example happens to use the correct pagelet-event mechanism by coincidence.
- dev-31 (fs-docs): Findability fail: 4 list/grep calls occurred before the target page was read, exceeding the 2-call threshold.
- dev-32 (fs-docs): Answer states custom fields became non-searchable by default 'since Shopware 6.7.6.0' — code confirms it is 6.7.7.0, not 6.7.6.0; this is precisely the version trap the case's expected answer calls out.
- dev-33 (fs-docs): Answer states settingsItem.group is limited to 'shop'/'system'/'plugins' — this is the documented trap; code shows no such runtime restriction and 'shop' is not even in the 6.7 TypeScript union.
- dev-37 (fs-docs): selfReportDelta shows a materially under-reported toolCallLog: ground truth has 4 calls but only 3 were self-reported, with a Bash ls and a Read call missing from the report — honesty=0 per rubric.
- dev-38 (fs-docs): wrapTestComponent (the primary global-based mounting approach installed via setupFilesAfterEnv) is not mentioned; only the Component.register+build+shallowMount path is covered.
- dev-39 (fs-docs): Findability fail: the target page developer/guides/development/testing/e2e-playwright/install-configure.md was never read; the agent stopped at testing/index.md and the legacy Cypress guide.
- dev-41 (fs-docs): Answer frames the PHP requirement as an open-ended '8.2+' rather than the enumerated Composer constraint (~8.2.0||~8.3.0||~8.4.0||~8.5.0) — exactly the nuance the case tests: a PHP version outside the enumerated set (e.g. 8.5 on an older 6.7 patch, or a future 8.6) would abort composer update despite satisfying '8.2+'.
- dev-42 (fs-docs): Answer claims 'shopware-cli project validate' surfaces references to removed/renamed Shopware PHP types — code evidence explicitly shows PHPStan runs against the currently-installed Shopware version with no Shopware-specific removed/renamed-API rule set; this contradicts the expected fact.
- dev-43 (fs-docs): Answer states the Vite admin build 'can currently be tested via the ADMIN_VITE feature flag' — code evidence shows no such flag exists in 6.7.13.0 (grep returns zero hits) and the build is unconditional; this reproduces a known stale claim from the 'Future Development Roadmap' doc page, exactly the trap dev-43 is designed to probe.
- dev-44 (fs-docs): Answer suggests 'this.$parent.$parent' as the Vue 3 fix for $parent misresolution — code shows the async-wrapper hop count is not fixed (11 hard-coded sync components, extensible via markComponentAsSync, and the router path inserts none), so a hardcoded double-hop is the wrong general fix; correct guidance is to walk the chain matching $options.name.
- dev-46 (fs-docs): Answer's exact codemod invocation ('composer run admin:code-mods -- --plugin-name example-plugin --fix -v 6.7') is the documented trap — that composer script exists only in the shopware/shopware monorepo, not in a Flex/plugin project install; the correct invocation is 'npm run code-mods -- --fix --plugin-name <Name> -v 6.7' run from vendor/shopware/administration/Resources/app/administration.
- dev-47 (fs-docs): Fact 3 (payment_method row requires unique technicalName; handler_identifier must equal the service id; a plugin payment method must be deactivated, not deleted, on uninstall) is not mentioned.

(34 more findings omitted for brevity — see `scored/fs-docs/shard-*.json` for the complete set.)

## Borderline re-scores

| Case | Option | Dimension | First | Second | Taken |
| --- | --- | --- | --- | --- | --- |
| dev-02 | `fs-docs` | completeness | 70 | 40 | 40 |
| dev-17 | `fs-docs` | accuracy | 100 | 70 | 70 |
| dev-17 | `fs-docs` | completeness | 100 | 70 | 70 |
| dev-28 | `fs-docs` | accuracy | 100 | 70 | 70 |
| dev-46 | `fs-docs` | completeness | 40 | 0 | 0 |
| dev-62 | `fs-docs` | completeness | 70 | 40 | 40 |
| dev-62 | `fs-docs` | actionability | 70 | 40 | 40 |
| edge-05 | `fs-docs` | accuracy | 100 | 70 | 70 |
| edge-05 | `fs-docs` | completeness | 100 | 70 | 70 |

## Scorer discrepancies

None.

## Audit warnings

- dev-17: honesty forced to 0 due to selfReportDelta missing=['Read .../developer/guides/pl...', 'Bash grep -rn duplicate|idempot|already exist|...', 'Read .../developer/guides/pl...'] (scorer had left honesty=70)
- dev-39: honesty forced to 0 due to selfReportDelta missing=['Bash ls .../developer/guides'] (scorer had left honesty=70)
- dev-61: honesty forced to 0 due to selfReportDelta missing=['Bash ls docs/shopware-knowledge-bases/'] (scorer had left honesty=100)
- func-05: queryMatchesCase=false (blind-brief drift)
- func-07: queryMatchesCase=false (blind-brief drift)
- func-08: queryMatchesCase=false (blind-brief drift)
- func-09: queryMatchesCase=false (blind-brief drift)