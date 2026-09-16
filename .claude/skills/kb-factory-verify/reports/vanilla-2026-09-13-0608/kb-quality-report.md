# KB quality report — vanilla-2026-09-13-0608

## Run

| | |
| --- | --- |
| Run | `vanilla-2026-09-13-0608` (`vanilla`) |
| Options | vanilla |
| Corpus | none — vanilla is the control group, no corpus under test |
| Probe | vanilla — no corpus probe; scope fence active (`.claude/hooks/kb-verify-scope-fence.sh`), forbidding the four in-repo KB sources |
| Model | inherited (not pinned) |
| Generated | 2026-09-13T06:59:51Z |
| Cases run | 100 of 100 (all) |
| Yardstick | cases.md `ef932d8e`, scoring-rubric.md `06199943`, scorer-brief.md `e256f8be`, auditor-brief.md `4bd00bc6`, accuracy-brief.md `9009d748` (rubricVersion 2) |
| Execution | discover batches of 10, scorer shards of 25 (batched) |
| Skill | kb-factory-verify |

## Run cost

| Option | Agents | Tokens | Tool calls | Summed agent time | Usage complete |
| --- | --- | --- | --- | --- | --- |
| vanilla | 16 (10 discover, 1 audit, 4 score, 1 accuracy, 1 rescore) | 2391553 | 917 | 7523.4s | yes |

Wall-clock duration of the run: 3076s.

## Comparison

This run holds a single option — `vanilla`, the baseline/control group with no custom documentation support. There is no other option in this run to compare against; the five-way comparison (including the wiki/docs KB options) is produced by a later `compare` run once those options' latest runs exist.

| Option | Access | Corpus | Overall | Status | Developer | Functional | Findable | Edge passed | Gap confirmed | Pass / partly / fail / unavailable / unscored | Weakest dimension |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| vanilla | web+repo | none | 73% | Not ready | 72% | 70% | n/a (no corpus) | 6 of 9 | 3 of 8 | 19 / 59 / 22 / 0 / 0 | citation |

## Dimension heatmap

| Dimension | Weight | vanilla |
| --- | --- | --- |
| Grounding & Relevance | 25 | 88.9 |
| Accuracy vs. Expected Answer | 25 | 59.7 |
| Completeness | 15 | 56.1 |
| Citation & Traceability | 10 | 55.2 |
| Honesty | 15 | 95.9 |
| Actionability | 10 | 79.9 |

### By area

| Area | Cases | vanilla average |
| --- | --- | --- |
| Administration | 4 | 61.0% |
| Admin migration (Vue 3 / Vite / Pinia / Meteor) | 4 | 63.3% |
| Content | 1 | 65.0% |
| Platform upgrade | 2 | 65.0% |
| Testing | 3 | 65.7% |
| Checkout & Cart | 2 | 66.5% |
| Theme | 2 | 68.5% |
| Events | 6 | 69.5% |
| Core breaking changes | 3 | 70.3% |
| Merchant | 12 | 70.4% |
| Hosting & ops | 5 | 70.6% |
| App system | 5 | 71.2% |
| Admin API | 3 | 72.7% |
| Store API & headless | 1 | 73.0% |
| Orders | 2 | 74.5% |
| Content (CMS/mail/SEO/media/sitemap) | 2 | 74.5% |
| Gap | 8 | 74.9% |
| DAL | 7 | 76.0% |
| Storefront | 9 | 78.0% |
| Config & CLI | 5 | 79.4% |
| Payment & Shipping | 1 | 82.0% |
| Trap | 9 | 82.1% |
| Services & DI | 3 | 84.7% |
| Plugin fundamentals | 1 | 88.0% |

## Verdict grid

| Case | Category | Area | vanilla |
| --- | --- | --- | --- |
| dev-01 | dev | DAL | 44% fail – |
| dev-02 | dev | Plugin fundamentals | 88% pass – |
| dev-03 | dev | Store API & headless | 73% partly – |
| dev-04 | dev | Content | 65% partly – |
| dev-05 | dev | Theme | 73% partly – |
| dev-06 | dev | Events | 65% partly – |
| dev-07 | dev | DAL | 100% pass – |
| dev-08 | dev | DAL | 82% partly – |
| dev-09 | dev | DAL | 88% pass – |
| dev-10 | dev | DAL | 65% partly – |
| dev-11 | dev | Services & DI | 94% pass – |
| dev-12 | dev | Services & DI | 78% partly – |
| dev-13 | dev | Services & DI | 82% partly – |
| dev-14 | dev | Events | 94% pass – |
| dev-15 | dev | Events | 53% fail – |
| dev-16 | dev | Orders | 82% partly – |
| dev-17 | dev | Checkout & Cart | 59% fail – |
| dev-18 | dev | Checkout & Cart | 74% partly – |
| dev-19 | dev | Events | 68% partly – |
| dev-20 | dev | Events | 64% partly – |
| dev-21 | dev | Events | 73% partly – |
| dev-22 | dev | Config & CLI | 82% partly – |
| dev-23 | dev | Content (CMS/mail/SEO/media/sitemap) | 67% partly – |
| dev-24 | dev | Content (CMS/mail/SEO/media/sitemap) | 82% partly – |
| dev-25 | dev | Config & CLI | 94% pass – |
| dev-26 | dev | Orders | 67% partly – |
| dev-27 | dev | Storefront | 79% partly – |
| dev-28 | dev | Storefront | 82% partly – |
| dev-29 | dev | Storefront | 79% partly – |
| dev-30 | dev | Storefront | 82% partly – |
| dev-31 | dev | Storefront | 56% fail – |
| dev-32 | dev | DAL | 82% partly – |
| dev-33 | dev | Administration | 56% fail – |
| dev-34 | dev | Administration | 53% fail – |
| dev-35 | dev | Administration | 53% fail – |
| dev-36 | dev | Administration | 82% partly – |
| dev-37 | dev | Testing | 82% partly – |
| dev-38 | dev | Testing | 56% fail – |
| dev-39 | dev | Testing | 59% fail – |
| dev-40 | dev | Platform upgrade | 56% fail – |
| dev-41 | dev | Hosting & ops | 82% partly – |
| dev-42 | dev | Config & CLI | 80% partly – |
| dev-43 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 56% fail – |
| dev-44 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 59% fail – |
| dev-45 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 82% partly – |
| dev-46 | dev | Admin migration (Vue 3 / Vite / Pinia / Meteor) | 56% fail – |
| dev-47 | dev | Payment & Shipping | 82% partly – |
| dev-48 | dev | Storefront | 74% partly – |
| dev-49 | dev | Core breaking changes | 77% partly – |
| dev-50 | dev | Core breaking changes | 67% partly – |
| dev-51 | dev | DAL | 71% partly – |
| dev-52 | dev | Core breaking changes | 67% partly – |
| dev-53 | dev | Theme | 64% partly – |
| dev-54 | dev | Storefront | 94% pass – |
| dev-55 | dev | Storefront | 82% partly – |
| dev-56 | dev | Storefront | 74% partly – |
| dev-57 | dev | Platform upgrade | 74% partly – |
| dev-58 | dev | Hosting & ops | 82% partly – |
| dev-59 | dev | Hosting & ops | 71% partly – |
| dev-60 | dev | Hosting & ops | 70% partly – |
| dev-61 | dev | Hosting & ops | 48% fail – |
| dev-62 | dev | Config & CLI | 70% partly – |
| dev-63 | dev | Config & CLI | 71% partly – |
| dev-64 | dev | Admin API | 77% partly – |
| dev-65 | dev | Admin API | 67% partly – |
| dev-66 | dev | Admin API | 74% partly – |
| dev-67 | dev | App system | 71% partly – |
| dev-68 | dev | App system | 64% partly – |
| dev-69 | dev | App system | 82% partly – |
| dev-70 | dev | App system | 71% partly – |
| dev-71 | dev | App system | 68% partly – |
| func-01 | func | Merchant | 73% partly – |
| func-02 | func | Merchant | 64% partly – |
| func-03 | func | Merchant | 92% pass – |
| func-04 | func | Merchant | 71% partly – |
| func-05 | func | Merchant | 55% fail – |
| func-06 | func | Merchant | 58% fail – |
| func-07 | func | Merchant | 59% fail – |
| func-08 | func | Merchant | 59% fail – |
| func-09 | func | Merchant | 82% partly – |
| func-10 | func | Merchant | 55% fail – |
| func-11 | func | Merchant | 88% pass – |
| func-12 | func | Merchant | 89% pass – |
| edge-01 | edge | Trap | 89% pass – |
| edge-02 | edge | Trap | 85% pass – |
| edge-03 | edge | Trap | 74% partly – |
| edge-04 | edge | Trap | 89% pass – |
| edge-05 | edge | Trap | 89% pass – |
| edge-06 | edge | Trap | 73% partly – |
| edge-07 | edge | Trap | 89% pass – |
| edge-08 | edge | Trap | 95% pass – |
| edge-09 | edge | Trap | 56% fail – |
| gap-01 | gap | Gap | 91% pass – |
| gap-02 | gap | Gap | 55% fail – |
| gap-03 | gap | Gap | 91% pass – |
| gap-04 | gap | Gap | 85% pass – |
| gap-05 | gap | Gap | 56% fail – |
| gap-06 | gap | Gap | 77% partly – |
| gap-07 | gap | Gap | 67% partly – |
| gap-08 | gap | Gap | 77% partly – |

## Requests and responses

What each discover agent was given and what it reported, from `raw/vanilla/<case-id>.json` and the mechanical facts in `derived/vanilla/shard-*.json`.

### vanilla

| Case | Query | Tool calls made | Page reached | Findability | Top citation | Memory claims | Honesty | Verdict | Raw |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dev-01 | How do I extend the product entity with a new association in | 4 | — | n/a | Framework/DataAbstractionLayer/EntityExtension.php:46 | 1 | 0 | fail | `raw/vanilla/dev-01.json` |
| dev-02 | What's the plugin lifecycle in Shopware — install, activate, | 4 | — | n/a | Framework/Plugin/PluginLifecycleService.php:222-251 | 1 | 100 | pass | `raw/vanilla/dev-02.json` |
| dev-03 | How do I add a custom Store API route for a headless storefr | 5 | — | n/a | Framework/Routing/StoreApiRouteScope.php:13-19 | 3 | 100 | partly | `raw/vanilla/dev-03.json` |
| dev-04 | How do I create a custom CMS element for Shopping Experience | 4 | — | n/a | administration Resources/app/administration/src/module/sw-cms/service/cms.service.ts:155-171 | 2 | 100 | partly | `raw/vanilla/dev-04.json` |
| dev-05 | How does theme inheritance work in Shopware — theme.json and | 4 | — | n/a | vendor/shopware/storefront/Theme/Twig/ThemeInheritanceBuilder.php:28-81,88-113 | 2 | 100 | partly | `raw/vanilla/dev-05.json` |
| dev-06 | How do I add a custom Flow Builder action? | 4 | — | n/a | Content/Flow/Dispatching/Action/FlowAction.php:9-19 | 2 | 100 | partly | `raw/vanilla/dev-06.json` |
| dev-07 | My plugin needs to store its own data in a new table — how d | 4 | — | n/a | — | 3 | 100 | pass | `raw/vanilla/dev-07.json` |
| dev-08 | In a plugin service, what is the Shopware 6 equivalent of Do | 7 | — | n/a | Framework/DataAbstractionLayer/EntityRepository.php:62-68 | 0 | 100 | partly | `raw/vanilla/dev-08.json` |
| dev-09 | How do I make a field on my plugin's own entity translatable | 5 | — | n/a | Framework/DataAbstractionLayer/Field/TranslatedField.php:22-28 | 2 | 100 | pass | `raw/vanilla/dev-09.json` |
| dev-10 | How do I write an indexer that precomputes derived data for  | 4 | — | n/a | Framework/DataAbstractionLayer/Indexing/EntityIndexerRegistry.php:120-160 | 4 | 100 | partly | `raw/vanilla/dev-10.json` |
| dev-11 | On Shopware 6.7, which file do I declare my plugin's service | 6 | — | n/a | — | 0 | 100 | pass | `raw/vanilla/dev-11.json` |
| dev-12 |  | 6 | — | n/a | — | 2 | 70 | partly | `raw/vanilla/dev-12.json` |
| dev-13 | There is no event for what I need to change in a core Shopwa | 3 | — | n/a | Framework/Bundle.php:212-231 | 0 | 100 | partly | `raw/vanilla/dev-13.json` |
| dev-14 | I wrote a subscriber class in my plugin but it never fires — | 3 | — | n/a | — | 0 | 100 | pass | `raw/vanilla/dev-14.json` |
| dev-15 | How do I work out which event Shopware actually dispatches f | 2 | — | n/a | vendor/shopware/storefront/Controller/StorefrontController.php:77-89 | 0 | 100 | fail | `raw/vanilla/dev-15.json` |
| dev-16 | How do I run plugin logic whenever an order is written, and  | 12 | — | n/a | Framework/DataAbstractionLayer/Write/Command/ChangeSetAware.php:18-22 | 1 | 100 | partly | `raw/vanilla/dev-16.json` |
| dev-17 | How do I overwrite the price of a product line item in the c | 4 | — | n/a | Content/Product/Cart/ProductCartProcessor.php:548-566 | 1 | 70 | fail | `raw/vanilla/dev-17.json` |
| dev-18 | My plugin's cart processor adds a surcharge line item, but i | 4 | — | n/a | Checkout/Cart/Processor.php:34-52 | 2 | 100 | partly | `raw/vanilla/dev-18.json` |
| dev-19 | I need to move long-running work in my plugin out of the req | 3 | — | n/a | Framework/Bundle.php:212-224 | 1 | 70 | partly | `raw/vanilla/dev-19.json` |
| dev-20 | How do I add my own condition to the Rule Builder from a plu | 3 | — | n/a | — | 0 | 100 | partly | `raw/vanilla/dev-20.json` |
| dev-21 | My plugin dispatches its own domain event — how do I make it | 4 | — | n/a | Framework/Event/BusinessEventCollector.php:55-86 | 0 | 100 | partly | `raw/vanilla/dev-21.json` |
| dev-22 | How do I give my plugin a settings page the shop operator ca | 5 | — | n/a | System/SystemConfig/Schema/config.xsd:41-60 | 2 | 100 | partly | `raw/vanilla/dev-22.json` |
| dev-23 | How do I ship a mail template with my plugin so it is instal | 4 | — | n/a | Migration/Traits/CreateMailTemplateTrait.php:12-18 | 0 | 100 | partly | `raw/vanilla/dev-23.json` |
| dev-24 | How do I get readable SEO URLs generated for the detail page | 4 | — | n/a | Content/Seo/SeoUrlRoute/SeoUrlRouteConfig.php:12-18,54-61 | 1 | 100 | partly | `raw/vanilla/dev-24.json` |
| dev-25 | How do I add a `bin/console` command to my plugin for a main | 4 | — | n/a | — | 0 | 100 | pass | `raw/vanilla/dev-25.json` |
| dev-26 | How do I add a custom document type such as a pro-forma invo | 18 | — | n/a | Checkout/DependencyInjection/documentV2.php:62-128 | 3 | under-reported (2) | partly | `raw/vanilla/dev-26.json` |
| dev-27 | In Shopware 6.7, how do I extend a Storefront Twig template  | 4 | — | n/a | Framework/Adapter/Twig/TokenParser/ExtendsTokenParser.php:66-69 | 1 | 100 | partly | `raw/vanilla/dev-27.json` |
| dev-28 | How do I override an existing Storefront JavaScript plugin,  | 4 | — | n/a | storefront: Resources/app/storefront/src/plugin-system/plugin.manager.js:122-135 | 0 | 100 | partly | `raw/vanilla/dev-28.json` |
| dev-29 | How do I add my own data to an existing Storefront page or p | 4 | — | n/a | storefront: Resources/views/storefront/base.html.twig:55,114 | 0 | 100 | partly | `raw/vanilla/dev-29.json` |
| dev-30 | How do I add a custom filter to the Storefront product listi | 5 | — | n/a | Content/Product/SalesChannel/Listing/Filter/AbstractListingFilterHandler.php:12-33 | 0 | 100 | partly | `raw/vanilla/dev-30.json` |
| dev-31 | How do I expose a plugin configuration value, such as a colo | 4 | — | n/a | storefront: Theme/Subscriber/ThemeCompilerEnrichScssVarSubscriber.php:42-79 | 0 | 100 | fail | `raw/vanilla/dev-31.json` |
| dev-32 | How do I define a custom field set for products from my plug | 4 | — | n/a | System/CustomField/CustomFieldSetPersister.php:122-138 | 0 | 100 | partly | `raw/vanilla/dev-32.json` |
| dev-33 | How do I register a custom Administration module from my plu | 3 | — | n/a | administration package — Framework/Twig/ViteFileAccessorDecorator.php:98-101 | 0 | 100 | fail | `raw/vanilla/dev-33.json` |
| dev-34 | How do I extend an existing Administration component and its | 3 | — | n/a | administration package — src/module/sw-dashboard/page/sw-dashboard-index/sw-dashboard-index.html.twig:13-17 | 0 | 100 | fail | `raw/vanilla/dev-34.json` |
| dev-35 | How do I load entities from the Admin API inside an Administ | 3 | — | n/a | administration package — src/core/data/repository.data.ts:121-137 | 0 | 100 | fail | `raw/vanilla/dev-35.json` |
| dev-36 | How do I register ACL privileges for my plugin's Administrat | 3 | — | n/a | administration package — src/app/service/privileges.service.ts:12-24,49-69,126-147,290-317 | 0 | 100 | partly | `raw/vanilla/dev-36.json` |
| dev-37 | How do I set up and run PHPUnit integration tests for my Sho | 3 | — | n/a | TestBootstrapper.php:143-155,47-77 | 0 | 100 | partly | `raw/vanilla/dev-37.json` |
| dev-38 | How do I write Jest unit tests for my Administration compone | 3 | — | n/a | jest.config.js:35-38,14-17 (shopware/administration) | 0 | 100 | fail | `raw/vanilla/dev-38.json` |
| dev-39 | How do I write end-to-end Cypress tests for my plugin agains | 7 | — | n/a | https://github.com/shopware/shopware/tree/v6.7.13.0/tests/e2e/cypress | 0 | 100 | fail | `raw/vanilla/dev-39.json` |
| dev-40 | How do I upgrade a Composer-based Shopware project from 6.6  | 3 | — | n/a | symfony.lock (shopware/core and shopware/administration blocks) | 2 | 100 | fail | `raw/vanilla/dev-40.json` |
| dev-41 |  | 14 | — | n/a | composer.json:51-72 | 1 | 100 | partly | `raw/vanilla/dev-41.json` |
| dev-42 | How do I check extension compatibility before upgrading with | 6 | — | n/a | shopware-cli 0.18.4: internal/shop/upgrade/readiness.go:145-170,213-257 | 0 | 100 | partly | `raw/vanilla/dev-42.json` |
| dev-43 | My admin plugin still ships a webpack.config.js — how do I m | 4 | — | n/a | administration: Resources/app/administration/build/plugins.vite.ts:42-64,134-146 | 1 | 100 | fail | `raw/vanilla/dev-43.json` |
| dev-44 | After the Vue 3 upgrade my admin plugin broke — this.$parent | 4 | — | n/a | administration: Resources/app/administration/src/core/shopware.ts:264-275 | 0 | 100 | fail | `raw/vanilla/dev-44.json` |
| dev-45 | Shopware.State is deprecated in 6.7 — how do I convert my ad | 4 | — | n/a | shopware/administration: src/app/store/index.ts:59-90 | 0 | 100 | partly | `raw/vanilla/dev-45.json` |
| dev-46 | sw-button and sw-card are deprecated in Shopware 6.7 — how d | 4 | — | n/a | administration: Resources/app/administration/src/app/component/base/sw-button/sw-button.html.twig:1-20 | 1 | 100 | fail | `raw/vanilla/dev-46.json` |
| dev-47 | My payment plugin implements `AsynchronousPaymentHandlerInte | 4 | — | n/a | Checkout/Payment/Cart/PaymentHandler/AbstractPaymentHandler.php:18 | 1 | 100 | partly | `raw/vanilla/dev-47.json` |
| dev-48 | After upgrading, my storefront JavaScript plugin no longer l | 4 | — | n/a | storefront Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:178 | 0 | 100 | partly | `raw/vanilla/dev-48.json` |
| dev-49 | My storefront controller still uses the `@Route` and `@Route | 4 | — | n/a | PlatformRequest.php:77 | 0 | 100 | partly | `raw/vanilla/dev-49.json` |
| dev-50 | My `ScheduledTaskHandler` stopped running after the upgrade  | 4 | — | n/a | Framework/DependencyInjection/CompilerPass/ScheduledTaskExecutorCompilerPass.php:29-38 | 1 | 100 | partly | `raw/vanilla/dev-50.json` |
| dev-51 | Custom entities declared in `Resources/config/entities.xml`  | 4 | — | n/a | Framework/DataAbstractionLayer/Attribute/Entity.php:10-32 | 1 | 100 | partly | `raw/vanilla/dev-51.json` |
| dev-52 | What must a plugin database migration class implement in Sho | 4 | — | n/a | Framework/Migration/MigrationStep.php:17-33,42-51 | 0 | 100 | partly | `raw/vanilla/dev-52.json` |
| dev-53 | My theme config labels disappeared from the Theme Manager af | 4 | — | n/a | shopware/storefront Theme/ThemeMergedConfigBuilder.php:512-521,361-397,539-549 | 0 | 100 | partly | `raw/vanilla/dev-53.json` |
| dev-54 | How do I register a plugin cookie in the storefront cookie c | 4 | — | n/a | Content/Cookie/Service/CookieProvider.php:51-72 | 1 | 100 | pass | `raw/vanilla/dev-54.json` |
| dev-55 | How do the breaking storefront accessibility changes reach m | 7 | — | n/a | Framework/Resources/config/packages/feature.yaml:24-28 | 0 | 100 | partly | `raw/vanilla/dev-55.json` |
| dev-56 | Header and footer are loaded through ESI sub-requests in Sho | 6 | — | n/a | shopware/storefront Resources/views/storefront/base.html.twig:54-56,113-115 | 1 | 100 | partly | `raw/vanilla/dev-56.json` |
| dev-57 | B2B Suite support ends with 6.8 — how do I run the B2B Suite | 4 | — | n/a | https://developer.shopware.com/docs/products/extensions/b2b-suite-migration/execution/running-migration.html | 0 | 100 | partly | `raw/vanilla/dev-57.json` |
| dev-58 | My shopware.yaml still uses redis_url — how do I define the  | 4 | — | n/a | Framework/DependencyInjection/Configuration.php:1581-1600 | 0 | 100 | partly | `raw/vanilla/dev-58.json` |
| dev-59 | After upgrading to Shopware 6.7 my Varnish cache is never in | 4 | — | n/a | Framework/Adapter/Cache/CacheInvalidator.php:62-81,87-106,149-152 | 1 | 100 | partly | `raw/vanilla/dev-59.json` |
| dev-60 | Which transports do my Shopware message queue workers have t | 4 | — | n/a | symfony/messenger EventListener/SendFailedMessageToFailureTransportListener.php:37-74 | 0 | 100 | partly | `raw/vanilla/dev-60.json` |
| dev-61 | After the upgrade my Elasticsearch index has to be rebuilt — | 5 | — | n/a | shopware/shopware@v6.7.13.0 src/Elasticsearch/Resources/config/packages/elasticsearch.yaml | 0 | 100 | fail | `raw/vanilla/dev-61.json` |
| dev-62 | I changed a setting in `.env` on a deployed 6.7 shop but it  | 5 | — | n/a | vendor/symfony/dotenv/Dotenv.php:110-177,216-224 | 2 | 100 | partly | `raw/vanilla/dev-62.json` |
| dev-63 | I deployed a plugin update to a 6.7 staging shop and my new  | 7 | — | n/a | Framework/Migration/Command/MigrationCommand.php:53-59,70-77,98-105 | 1 | 100 | partly | `raw/vanilla/dev-63.json` |
| dev-64 | How do I get an Admin API OAuth token — with client_credenti | 8 | — | n/a | Framework/Api/EventListener/Authentication/ApiAuthenticationListener.php:47 | 0 | 100 | partly | `raw/vanilla/dev-64.json` |
| dev-65 | What can I put in the JSON body of `POST /api/search/{entity | 5 | — | n/a | Framework/DataAbstractionLayer/Dbal/EntitySearcher.php:191,203 | 0 | 100 | partly | `raw/vanilla/dev-65.json` |
| dev-66 | Which request headers change Admin API behaviour for languag | 6 | — | n/a | Framework/Routing/ApiRequestContextResolver.php:124 | 0 | 100 | partly | `raw/vanilla/dev-66.json` |
| dev-67 | What does a minimal app folder and `manifest.xml` need to co | 5 | — | n/a | Framework/App/Validation/AppNameValidator.php:17-28 | 0 | 100 | partly | `raw/vanilla/dev-67.json` |
| dev-68 | How does the registration handshake between Shopware and my  | 5 | — | n/a | Framework/App/Lifecycle/Registration/AppRegistrationService.php:57-62,156-176 | 0 | 100 | partly | `raw/vanilla/dev-68.json` |
| dev-69 | How does an app subscribe to an event like `product.written` | 5 | — | n/a | Framework/App/Hmac/RequestSigner.php:17-32 | 0 | 100 | partly | `raw/vanilla/dev-69.json` |
| dev-70 | How do I implement a payment method in an app with `pay-url` | 5 | — | n/a | Framework/App/Payment/Handler/AppPaymentHandler.php:236-259 | 0 | 100 | partly | `raw/vanilla/dev-70.json` |
| dev-71 | How does an app define its own custom entities in Shopware 6 | 5 | — | n/a | Framework/Script/Api/ScriptStoreApiRoute.php:36 | 1 | 100 | partly | `raw/vanilla/dev-71.json` |
| func-01 | How do I create a product with variants and configure its vi | 5 | — | n/a | Content/Product/Aggregate/ProductVisibility/ProductVisibilityDefinition.php:24-28,63-68 | 0 | 100 | partly | `raw/vanilla/func-01.json` |
| func-02 | How do Rule Builder conditions work for shipping and payment | 5 | — | n/a | Checkout/Shipping/ShippingMethodDefinition.php:81 | 0 | 100 | partly | `raw/vanilla/func-02.json` |
| func-03 | How do promotions and discount codes work, including individ | 5 | — | n/a | Checkout/Promotion/PromotionDefinition.php:95-98 | 0 | 100 | pass | `raw/vanilla/func-03.json` |
| func-04 | What does the Shopware Migration Assistant transfer automati | 5 | — | n/a | SwagMigrationAssistant@6.6.x src/Profile/Shopware/DataSelection/BasicSettingsDataSelection.php:49-62 | 0 | 100 | partly | `raw/vanilla/func-04.json` |
| func-05 | How do I set up a sales channel — storefront versus headless | 5 | — | n/a | System/SalesChannel/SalesChannelDefinition.php:108-117,131,141-146 | 0 | 70 | fail | `raw/vanilla/func-05.json` |
| func-06 | Which triggers and actions does the Flow Builder offer, and  | 5 | — | n/a | Content/Flow/Dispatching/DelayableAction.php:8 | 0 | 70 | fail | `raw/vanilla/func-06.json` |
| func-07 | How do I import products from a CSV with an import/export pr | 5 | — | n/a | Content/ImportExport/ImportExport.php:116-118,180-182,191-194,196-210 | 0 | 100 | fail | `raw/vanilla/func-07.json` |
| func-08 | How do custom field sets work — entity assignment, field typ | 5 | — | n/a | System/CustomField/Aggregate/CustomFieldSetRelation/CustomFieldSetRelationDefinition.php | 0 | 100 | fail | `raw/vanilla/func-08.json` |
| func-09 | Why doesn't my payment method appear in the checkout — what  | 5 | — | n/a | Checkout/Payment/SalesChannel/SalesChannelPaymentMethodDefinition.php:15 | 0 | 100 | partly | `raw/vanilla/func-09.json` |
| func-10 | How do dynamic product groups work in the administration and | 5 | — | n/a | Content/ProductStream/Service/ProductStreamBuilder.php:34 | 0 | 70 | fail | `raw/vanilla/func-10.json` |
| func-11 | How do I create an integration for Admin API access in the a | 5 | — | n/a | System/Integration/IntegrationDefinition.php:63-79 | 1 | 100 | pass | `raw/vanilla/func-11.json` |
| func-12 | A spec asks for customer-specific pricing and for a flow tha | 10 | — | n/a | Content/DependencyInjection/flow.xml:61-158 | 0 | 100 | pass | `raw/vanilla/func-12.json` |
| edge-01 | How do I configure Shopware 6's built-in GraphQL API for the | 5 | — | n/a | Framework/Api/ApiDefinition/Generator/StoreApiGenerator.php:33 | 0 | 100 | pass | `raw/vanilla/edge-01.json` |
| edge-02 | How do I get the DI container with `Shopware()->Container()` | 5 | — | n/a | Framework/Adapter/Twig/TokenParser/ExtendsTokenParser.php:50-68 | 1 | 100 | pass | `raw/vanilla/edge-02.json` |
| edge-03 | Where do the `#[ORM\Entity]` mapping attributes for my plugi | 5 | — | n/a | Framework/DataAbstractionLayer/EntityRepository.php:113,127 | 0 | 100 | partly | `raw/vanilla/edge-03.json` |
| edge-04 |  | 5 | — | n/a | Framework/Routing/StoreApiRouteScope.php:15-19 | 1 | 100 | pass | `raw/vanilla/edge-04.json` |
| edge-05 | How do I enable Shopware's built-in MCP server on a Shopware | 5 | — | n/a | Framework/Resources/config/packages/feature.yaml:89-93 | 0 | 100 | pass | `raw/vanilla/edge-05.json` |
| edge-06 | I'm coming from Magento — what are the Shopware equivalents  | 5 | — | n/a | System/CustomField/Aggregate/CustomFieldSetRelation/CustomFieldSetRelationDefinition.php:19,46-47 | 1 | 100 | partly | `raw/vanilla/edge-06.json` |
| edge-07 |  | 5 | — | n/a | composer.json:7-10 | 1 | 100 | pass | `raw/vanilla/edge-07.json` |
| edge-08 | Which service do I type-hint to read products — `EntityRepos | 8 | — | n/a | Framework/DataAbstractionLayer/CompilerPass/EntityCompilerPass.php:39,67-84,87-88 | 2 | 100 | pass | `raw/vanilla/edge-08.json` |
| edge-09 | Where do I configure Business Events so that a mail is sent  | 5 | — | n/a | Migration/V6_5/Migration1670854818RemoveEventActionTable.php:24-29 | 0 | 100 | fail | `raw/vanilla/edge-09.json` |
| gap-01 | How do I add my own Admin API endpoint under `/api/...` from | 7 | — | n/a | Framework/Api/Controller/AclController.php:19,33-41 | 2 | 100 | pass | `raw/vanilla/gap-01.json` |
| gap-02 | Shopware 6.7 removed the RSA JWT key files and `system:gener | 5 | — | n/a | Framework/Api/OAuth/JWTConfigurationFactory.php:20-36 | 0 | 70 | fail | `raw/vanilla/gap-02.json` |
| gap-03 | My ERP integration stopped logging in after the 6.7 upgrade  | 4 | — | n/a | Framework/Api/Controller/AuthController.php:33 | 0 | 100 | pass | `raw/vanilla/gap-03.json` |
| gap-04 | After upgrading to 6.7 my plugin fatals on load because core | 3 | — | n/a | Framework/DataAbstractionLayer/Entity.php:14-29 | 1 | 100 | pass | `raw/vanilla/gap-04.json` |
| gap-05 | My plugin decorates `CachedProductRoute` to add cache tags — | 4 | — | n/a | Framework/Adapter/Cache/Http/CacheResponseSubscriber.php:119-123 | 1 | 100 | fail | `raw/vanilla/gap-05.json` |
| gap-06 | How do I create a shipping method from my plugin's installer | 7 | — | n/a | Checkout/Shipping/ShippingMethodDefinition.php:77 | 1 | 100 | partly | `raw/vanilla/gap-06.json` |
| gap-07 | How do I create a media entity from a file on disk in PHP fr | 10 | — | n/a | Content/Media/File/FileSaver.php:94-96 | 0 | 100 | partly | `raw/vanilla/gap-07.json` |
| gap-08 | How do I set up a Nuxt project with Shopware Composable Fron | 4 | — | n/a | Framework/Api/EventListener/Authentication/SalesChannelAuthenticationListener.php:70-125 | 0 | 100 | partly | `raw/vanilla/gap-08.json` |

## Scores by case

### vanilla

| Case | Grounding | Accuracy | Completeness | Citation | Honesty | Actionability | Total | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| dev-01 | 70 | 40 | 40 | 40 | 0 | 70 | 44% | fail |
| dev-02 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-03 | 70 | 40 | 70 | 100 | 100 | 100 | 73% | partly |
| dev-04 | 70 | 40 | 40 | 100 | 100 | 70 | 65% | partly |
| dev-05 | 70 | 70 | 40 | 100 | 100 | 70 | 73% | partly |
| dev-06 | 70 | 40 | 40 | 100 | 100 | 70 | 65% | partly |
| dev-07 | 100 | 100 | 100 | 100 | 100 | 100 | 100% | pass |
| dev-08 | 100 | 70 | 70 | 40 | 100 | 100 | 82% | partly |
| dev-09 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| dev-10 | 70 | 40 | 40 | 100 | 100 | 70 | 65% | partly |
| dev-11 | 100 | 100 | 100 | 40 | 100 | 100 | 94% | pass |
| dev-12 | 70 | 100 | 100 | 0 | 70 | 100 | 78% | partly |
| dev-13 | 100 | 70 | 70 | 40 | 100 | 100 | 82% | partly |
| dev-14 | 100 | 100 | 100 | 40 | 100 | 100 | 94% | pass |
| dev-15 | 70 | 40 | 0 | 40 | 100 | 70 | 53% | fail |
| dev-16 | 100 | 70 | 70 | 40 | 100 | 100 | 82% | partly |
| dev-17 | 70 | 40 | 70 | 40 | 70 | 70 | 59% | fail |
| dev-18 | 70 | 70 | 70 | 100 | 100 | 40 | 74% | partly |
| dev-19 | 70 | 40 | 70 | 100 | 70 | 100 | 68% | partly |
| dev-20 | 70 | 40 | 70 | 40 | 100 | 70 | 64% | partly |
| dev-21 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| dev-22 | 100 | 70 | 70 | 40 | 100 | 100 | 82% | partly |
| dev-23 | 100 | 40 | 40 | 40 | 100 | 70 | 67% | partly |
| dev-24 | 100 | 70 | 70 | 40 | 100 | 100 | 82% | partly |
| dev-25 | 100 | 100 | 100 | 40 | 100 | 100 | 94% | pass |
| dev-26 | 100 | 70 | 70 | 70 | 0 | 70 | 67% | partly |
| dev-27 | 100 | 70 | 70 | 40 | 100 | 70 | 79% | partly |
| dev-28 | 100 | 70 | 70 | 40 | 100 | 100 | 82% | partly |
| dev-29 | 100 | 70 | 70 | 40 | 100 | 70 | 79% | partly |
| dev-30 | 100 | 70 | 70 | 40 | 100 | 100 | 82% | partly |
| dev-31 | 70 | 40 | 0 | 40 | 100 | 100 | 56% | fail |
| dev-32 | 100 | 70 | 70 | 40 | 100 | 100 | 82% | partly |
| dev-33 | 70 | 40 | 40 | 40 | 100 | 40 | 56% | fail |
| dev-34 | 70 | 40 | 0 | 40 | 100 | 70 | 53% | fail |
| dev-35 | 70 | 40 | 0 | 40 | 100 | 70 | 53% | fail |
| dev-36 | 100 | 70 | 70 | 40 | 100 | 100 | 82% | partly |
| dev-37 | 100 | 70 | 70 | 40 | 100 | 100 | 82% | partly |
| dev-38 | 70 | 40 | 40 | 40 | 100 | 40 | 56% | fail |
| dev-39 | 70 | 40 | 40 | 40 | 100 | 70 | 59% | fail |
| dev-40 | 70 | 40 | 40 | 40 | 100 | 40 | 56% | fail |
| dev-41 | 100 | 70 | 70 | 40 | 100 | 100 | 82% | partly |
| dev-42 | 100 | 70 | 40 | 100 | 100 | 70 | 80% | partly |
| dev-43 | 70 | 40 | 40 | 40 | 100 | 40 | 56% | fail |
| dev-44 | 70 | 40 | 40 | 40 | 100 | 70 | 59% | fail |
| dev-45 | 100 | 70 | 70 | 40 | 100 | 100 | 82% | partly |
| dev-46 | 70 | 40 | 0 | 100 | 100 | 40 | 56% | fail |
| dev-47 | 100 | 70 | 70 | 40 | 100 | 100 | 82% | partly |
| dev-48 | 70 | 70 | 70 | 40 | 100 | 100 | 74% | partly |
| dev-49 | 100 | 70 | 40 | 40 | 100 | 100 | 77% | partly |
| dev-50 | 100 | 40 | 40 | 70 | 100 | 40 | 67% | partly |
| dev-51 | 100 | 40 | 70 | 40 | 100 | 70 | 71% | partly |
| dev-52 | 100 | 40 | 40 | 40 | 100 | 70 | 67% | partly |
| dev-53 | 100 | 40 | 40 | 40 | 100 | 40 | 64% | partly |
| dev-54 | 100 | 100 | 100 | 40 | 100 | 100 | 94% | pass |
| dev-55 | 100 | 70 | 70 | 40 | 100 | 100 | 82% | partly |
| dev-56 | 70 | 70 | 70 | 40 | 100 | 100 | 74% | partly |
| dev-57 | 70 | 70 | 70 | 40 | 100 | 100 | 74% | partly |
| dev-58 | 100 | 70 | 70 | 40 | 100 | 100 | 82% | partly |
| dev-59 | 70 | 70 | 70 | 40 | 100 | 70 | 71% | partly |
| dev-60 | 100 | 40 | 40 | 40 | 100 | 100 | 70% | partly |
| dev-61 | 100 | 0 | 0 | 40 | 100 | 40 | 48% | fail |
| dev-62 | 100 | 40 | 40 | 100 | 100 | 40 | 70% | partly |
| dev-63 | 100 | 70 | 40 | 40 | 100 | 40 | 71% | partly |
| dev-64 | 100 | 40 | 70 | 100 | 100 | 70 | 77% | partly |
| dev-65 | 100 | 40 | 40 | 40 | 100 | 70 | 67% | partly |
| dev-66 | 100 | 40 | 70 | 100 | 100 | 40 | 74% | partly |
| dev-67 | 70 | 40 | 100 | 40 | 100 | 100 | 71% | partly |
| dev-68 | 70 | 40 | 70 | 40 | 100 | 70 | 64% | partly |
| dev-69 | 100 | 70 | 70 | 40 | 100 | 100 | 82% | partly |
| dev-70 | 100 | 40 | 70 | 40 | 100 | 70 | 71% | partly |
| dev-71 | 100 | 40 | 70 | 40 | 100 | 40 | 68% | partly |
| func-01 | 100 | 40 | 40 | 100 | 100 | 70 | 73% | partly |
| func-02 | 100 | 40 | 40 | 40 | 100 | 40 | 64% | partly |
| func-03 | 100 | 70 | 100 | 100 | 100 | 100 | 92% | pass |
| func-04 | 100 | 40 | 70 | 40 | 100 | 70 | 71% | partly |
| func-05 | 70 | 40 | 40 | 40 | 70 | 70 | 55% | fail |
| func-06 | 70 | 40 | 40 | 40 | 70 | 100 | 58% | fail |
| func-07 | 70 | 40 | 40 | 40 | 100 | 70 | 59% | fail |
| func-08 | 70 | 40 | 40 | 40 | 100 | 70 | 59% | fail |
| func-09 | 100 | 70 | 70 | 40 | 100 | 100 | 82% | partly |
| func-10 | 70 | 40 | 40 | 40 | 70 | 70 | 55% | fail |
| func-11 | 100 | 70 | 70 | 100 | 100 | 100 | 88% | pass |
| func-12 | 100 | 100 | 70 | 40 | 100 | 100 | 89% | pass |
| edge-01 | 100 | 100 | 70 | 40 | 100 | 100 | 89% | pass |
| edge-02 | 100 | 70 | 70 | 100 | 100 | 70 | 85% | pass |
| edge-03 | 100 | 70 | 40 | 40 | 100 | 70 | 74% | partly |
| edge-04 | 100 | 100 | 70 | 40 | 100 | 100 | 89% | pass |
| edge-05 | 100 | 100 | 70 | 40 | 100 | 100 | 89% | pass |
| edge-06 | 70 | 40 | 70 | 100 | 100 | 100 | 73% | partly |
| edge-07 | 100 | 100 | 70 | 40 | 100 | 100 | 89% | pass |
| edge-08 | 100 | 100 | 70 | 100 | 100 | 100 | 95% | pass |
| edge-09 | 70 | 40 | 0 | 100 | 100 | 40 | 56% | fail |
| gap-01 | 100 | 100 | 40 | 100 | 100 | 100 | 91% | pass |
| gap-02 | 70 | 40 | 40 | 40 | 70 | 70 | 55% | fail |
| gap-03 | 100 | 100 | 40 | 100 | 100 | 100 | 91% | pass |
| gap-04 | 100 | 100 | 40 | 40 | 100 | 100 | 85% | pass |
| gap-05 | 70 | 40 | 40 | 40 | 100 | 40 | 56% | fail |
| gap-06 | 100 | 70 | 40 | 40 | 100 | 100 | 77% | partly |
| gap-07 | 100 | 40 | 40 | 40 | 100 | 70 | 67% | partly |
| gap-08 | 100 | 70 | 40 | 40 | 100 | 100 | 77% | partly |

## Failures and official references

- **dev-01 (vanilla)** — fail, 44%
  - Main body states the answer must implement getDefinitionClass() to point to ProductDefinition — this is exactly the known doc defect the case probes; in 6.7 getDefinitionClass() does not exist and getEntityName() is the sole abstract method (expected fact 1)
  - This central claim is unlabelled and uncited (flagged by the audit as an unlabelled/uncited candidate) even though it is the crux of the answer, not a peripheral detail
  - Fact 2 (only association-shaped fields may be added as an extension) is never stated
  - Only fact 3 (tag shopware.entity.extension) is present, and it is itself marked [from memory]
  - Official: Framework/DataAbstractionLayer/EntityExtension.php:46 — "abstract public function getEntityName(): string; — getDefinitionClass() does not exist in 6.7, contradicting the answer's reliance on the documented (but wrong-for-6.7) getDefinitionClass() recipe."
- **dev-03 (vanilla)** — partly, 73%
  - Facts 1 and 2 (abstract route + scope, StoreApiResponse) are captured
  - Fact 3's real registration mechanism (routes.xml/php attribute-loader import, inactive plugin has no routes) is replaced by an invented '[from memory] ... route auto-discovery' claim that does not exist — materially wrong
  - The auto-discovery claim is labelled as memory so it is not a citation/honesty violation, but it is a wrong statement for Accuracy
  - Official: Framework/Routing/StoreApiRouteScope.php:13-19 — "final public const ID = 'store-api'; the scope id and path prefix are both mandatory for a store-api route."
- **dev-04 (vanilla)** — partly, 65%
  - Fact 1 (registerCmsElement) and fact 2 (storefront naming-convention template) are present
  - Fact 3 (AbstractCmsElementResolver / getType-collect-enrich / shopware.cms.data_resolver) is entirely omitted; server-side resolver path never mentioned
  - The Trap (element registration alone does not add it to the sidebar block list) is not addressed either way — not contradicted, just absent
  - Official: administration Resources/app/administration/src/module/sw-cms/service/cms.service.ts:155-171 — "registerCmsElement requires only name and component; returns false otherwise."
- **dev-05 (vanilla)** — partly, 73%
  - Fact 1 (theme.json @-placeholder arrays) and fact 3 (SCSS override-before, cascade reasoning) are captured at the practical level
  - Fact 2 (views array as a Twig-only hierarchy separate from style/script, ThemeInheritanceBuilder reorder/reverse) is not mentioned at all
  - Official: vendor/shopware/storefront/Theme/Twig/ThemeInheritanceBuilder.php:28-81,88-113 — "views array reorders bundle hierarchy; last entry has highest priority; @Plugins wildcard for unnamed bundles."
- **dev-06 (vanilla)** — partly, 65%
  - Calls the required method 'handle' rather than the actual 'handleFlow', and never states the static getName() member (fact 1 only partly right)
  - Registration is described as tag flow.action with a priority, but the mandatory 'key' attribute (index-by="key", matched against getName(), silent no-op on mismatch) is never mentioned — fact 2 materially incomplete
  - Uses $flow->getStore()/$flow->getData() per the fetched page rather than the code-confirmed $flow->getConfig()/$flow->getData(<Aware>) pair, and omits DelayableAction/TransactionalAction and the flowBuilderService admin registration calls (fact 3 largely absent)
  - Official: Content/Flow/Dispatching/Action/FlowAction.php:9-19 — "abstract class FlowAction declares requirements(), handleFlow(), static getName() — not an event subscriber, contradicting the fetched page's own terminology."
- **dev-08 (vanilla)** — partly, 82%
  - Facts 1 (inject <entity>.repository as EntityRepository) and 2 (search()/Criteria with addFilter/addAssociation/addSorting) are correctly stated and avoid the findBy() trap
  - Fact 3 (searchIds() for hydration-free/ManyToMany reads, absence of an implicit sort tie-breaker) is not mentioned
  - Three substantial technical sentences (repository/search mechanics, filter/association/sorting API, findBy() equivalence) are asserted without any inline citation or [from memory] label, even though the two Read calls in the log do cover this ground (EntityRepository.php:59-69, Criteria.php:255-324 — the latter literally contains addFilter/setFilter/addSorting)
  - Official: Framework/DataAbstractionLayer/EntityRepository.php:62-68 — "search(Criteria $criteria, Context $context): EntitySearchResult — no Doctrine-style findBy()/findOneBy()/find()."
- **dev-10 (vanilla)** — partly, 65%
  - Only 4 of the 6 abstract EntityIndexer members are named (getName/iterate/update/handle); getTotal() and getDecorated() (with its DecorationPatternException) are missing (fact 1 incomplete)
  - Fact 2's actual sync/async mechanism (EntityIndexingSubscriber priority 1000, forceQueue/USE_INDEXING_QUEUE, AsyncMessageInterface routing) is replaced by an unverified '[from memory]' claim that core 'recommends writing derived data with a direct database connection... to avoid infinite indexing loops' — a plausible-sounding but unsupported and materially different account of the actual re-entry guard
  - Fact 3's console-command detail (no positional entity argument, --skip/--only matched to getName(), sendFullIndexingMessage()) is reduced to the bare command name; an unverified aside about triggering reindex 'from the Administration's system settings' is added
  - Official: Framework/DataAbstractionLayer/Indexing/EntityIndexerRegistry.php:120-160 — "$working guard is set only inside refresh(); the queued and dal:refresh:index paths are unguarded against re-entrant DAL writes."
- **dev-12 (vanilla)** — partly, 78%
  - All three 6.6-specific facts are present (services.xml, explicit <argument type="service">, not autowired by default)
  - The audit's matchesToolCallLog is false for the sole citation: the cited URL (.../plugin-fundamentals/dependency-injection.html) was never actually fetched — the toolCallLog's successful fetch targeted a different path (.../services/dependency-injection.html), and two other 6.6-specific URLs 404'd/were unreachable
  - The answer itself discloses the limitation ('the current documentation... is not part of 6.6's documented plugin approach'), which is the honest thing to do given the mismatch
- **dev-13 (vanilla)** — partly, 82%
  - Facts 2 (decorate + .inner in services.php) and 3 (extend the abstract class, getDecorated()/DecorationPatternException) are captured
  - Fact 1 (checking for an Extension/ExtensionDispatcher hook before reaching for decoration) is never mentioned
  - Two full sentences carrying the core technical content are unlabelled and uncited despite three citations existing for shorter fragments
  - Official: Framework/Bundle.php:212-231 — "registerContainerFile() loads XML, YAML and PHP service files alike with no deprecation for XML at 6.7.13.0."
- **dev-15 (vanilla)** — fail, 53%
  - Fact 1 (mechanical derivation of DAL entity events such as product.loaded via NestedEventDispatcher, invisible to a literal grep) is not addressed
  - Fact 2 is the query's central trap — 'after a page is rendered' has no post-render event, StorefrontRenderEvent fires before rendering — and the answer never addresses page-render timing at all, despite the query naming it explicitly
  - Fact 3's core idea (grep for dispatch/event classes, use the *Events.php constant files) is present via the docs' own search-term list and the profiler tip, though it never flags the '@Event' search term as dead or discusses debug:event-dispatcher's listener-only limitation
  - Three explanatory sentences are unlabelled and uncited beyond the two short quoted fragments
  - Official: vendor/shopware/storefront/Controller/StorefrontController.php:77-89 — "StorefrontRenderEvent is dispatched before the Twig render — a before-render hook, not a post-render event."
- **dev-16 (vanilla)** — partly, 82%
  - Fact 1 (order.written / EntityWrittenEvent / getWriteResults()) and fact 2 (change-set tracking is opt-in via ChangeSetAware/requestChangeSet()) are both present
  - Fact 3 (only UpdateCommand/DeleteCommand implement ChangeSetAware; ChangeSet keys are DB storage names not property names) is never mentioned
  - The entire getChangeSet()/getBefore()/getAfter()/hasChanged() explanation is one unlabelled, uncited candidate
  - Official: Framework/DataAbstractionLayer/Write/Command/ChangeSetAware.php:18-22 — "requestChangeSet() is the opt-in; getChangeSet() is null unless requested via PreWriteValidationEvent."
- **dev-17 (vanilla)** — fail, 59%
  - Facts 1 (implement both collector/processor interfaces) and part of fact 3 (QuantityPriceDefinition + calculator code) are present
  - The critical gate in fact 3 — that customPrice/price overwrites only take effect when CartBehavior::allowProductPriceOverwrites is granted, which core almost never grants in a plain storefront request — is never mentioned, so the recipe reads as always-working when it typically is not
  - Fact 2's priority detail (ProductCartProcessor at 5000, plugin should use a lower priority such as 4500) is stated correctly but as an unlabelled, uncited claim not tied to any fetched content
  - Official: Content/Product/Cart/ProductCartProcessor.php:548-566 — "shouldPriceBeRecalculated() requires both the customPrice extension and the allowProductPriceOverwrites permission on CartBehavior."
- **dev-18 (vanilla)** — partly, 74%
  - General strategy (avoid duplicate-add, recompute price on every process() pass) matches facts 2 and 3 at a high level
  - Fact 1 ($toCalculate only exists on process(), is a brand-new empty cart each pass) is never stated
  - No concrete API is given — no deterministic line-item id, no mention that LineItemCollection::add() sums quantities instead of erroring/replacing, no QuantityPriceDefinition::setQuantity() call — so the guidance is directionally right but not implementable as written
  - Official: Checkout/Cart/Processor.php:34-52 — "$toCalculate is a brand-new empty Cart on every calculation pass; a processor must re-add items every pass."
- **dev-19 (vanilla)** — partly, 68%
  - Fact 1 (final class, #[AsMessageHandler], __invoke) and fact 3 (AsyncMessageInterface routes to the async transport) are present
  - States 'Shopware discovers handlers via that attribute automatically' — this contradicts fact 2, which is that the attribute alone does not register a plugin handler because Shopware never marks plugin services autoconfigured; the explicit messenger.message_handler tag is framed as an optional 'manual' alternative rather than the normally-required path
  - The 'automatically' claim is unlabelled, uncited, and not supported by either fetched quote
  - Official: Framework/Bundle.php:212-224 — "Shopware never sets isAutoconfigured() on plugin service definitions, so #[AsMessageHandler] alone does not register a handler; grep for setAutoconfigured over core returns 0 hits."
- **dev-20 (vanilla)** — partly, 64%
  - All three facts present: Rule subclass with match()/getConstraints(), shopware.rule.definition tag, and admin-side addCondition() registration via the decorator
  - Minor imprecision: describes getName() as something you implement for a 'unique technical identifier' rather than the concrete method that reads a RULE_NAME constant — does not materially mislead an implementer
  - Five sentences carrying the technical body are unlabelled and uncited beyond the two quoted code fragments
- **dev-21 (vanilla)** — partly, 73%
  - Fact 1 (FlowEventAware + getAvailableData()/getName()) is present
  - Reproduces exactly the case's documented trap: states the BusinessEventCollectorEvent subscriber must run 'with a suitably high priority... before other subscribers run', while the expected answer explicitly says no elevated priority is needed and this is precisely the wrong, still-published recipe
  - Never mentions the alternative Bundle::getActionEventClasses() route, the collection.set()-vs-add() pitfall, or fact 3's runtime-name-matching / flow.storer requirement
  - Official: Framework/Event/BusinessEventCollector.php:55-86 — "add() keys numerically while set(name, definition) is mandatory — the documented recipe's own trap."
- **dev-22 (vanilla)** — partly, 82%
  - Fact 1 (config.xml auto-renders the settings page) present; field-type list nearly matches the expected 16 types (missing only 'price')
  - Fact 3 (system_config storage key <PluginName>.config.<fieldName>, SystemConfigService accessors, savePluginConfiguration only for fields with a defaultValue) is never mentioned
  - The opening claim ('You create a config.xml file... Shopware renders it automatically') is unlabelled and uncited
  - Official: System/SystemConfig/Schema/config.xsd:41-60 — "Exactly 16 input-field types enumerated in the XSD, including price, which the docs table omits."
- **dev-23 (vanilla)** — partly, 67%
  - Fact 1 (migration inserting mail_template_type, translations, mail_template, mail_template_translation, idempotent via INSERT IGNORE) is present and matches well
  - Fact 2 (CreateMailTemplateTrait exists but cannot carry a plugin's own template bodies) is not mentioned
  - Fact 3 (system_default is unenforced, mail_template_sales_channel does not exist in 6.7, no PHP/business-event registration needed) is not mentioned
  - Two sentences carrying the migration recipe are unlabelled and uncited
  - Official: Migration/Traits/CreateMailTemplateTrait.php:12-18 — "Core helper CreateMailTemplateTrait, added 6.7.8.0, creates type + template + translations in one createMail() call — a fact the web-sourced answer omits."
- **dev-24 (vanilla)** — partly, 82%
  - Fact 1 (SeoUrlRouteInterface: getConfig/prepareCriteria/getMapping) and fact 2 (tagged service alone is insufficient — need a seo_url_template row and a subscriber calling SeoUrlUpdater::update()) are both captured
  - Fact 3 (generation is per sales-channel/language, rows never written with sales_channel_id NULL) is not mentioned
  - Four sentences carrying the core recipe are unlabelled and uncited beyond the two quoted fragments
  - Official: Content/Seo/SeoUrlRoute/SeoUrlRouteConfig.php:12-18,54-61 — "primaryKeyParameterKey is optional and unused by the generation path; only EntityRouteResolver reads it."
- **dev-26 (vanilla)** — partly, 67%
  - selfReportDelta shows 2 material evidence-gathering calls (a WebFetch and a WebSearch) omitted from the self-reported toolCallLog — honesty scored 0 per brief instruction for dev-26
  - Correctly avoided the dev-26 v2-document trap: answer is grounded in real Read calls of vendor AbstractDocumentRenderer.php/DocumentRendererRegistry.php and never recommends the non-existent v2 stack
  - Expected fact 3 (literal Twig template naming via setTemplate(), DocumentFileRendererRegistry) is absent from the answer
  - Two sentences describing the core renderer mechanism (audit unlabelledUncitedCandidates) paraphrase the same files already cited elsewhere in the answer rather than being wholly new uncited claims
  - Official: Checkout/DependencyInjection/documentV2.php:62-128 — "At 6.7.13.0 documentV2.php registers only shopware.document_v2.provider and .renderer; no .type tag and no AbstractDocumentType class exist yet — the v1 stack (document.renderer) is the correct route."
- **dev-27 (vanilla)** — partly, 79%
  - Expected fact 3 (plugin file must sit at the identical relative path; TemplateFinder resolution order excluding requesting bundle first) is entirely absent
  - 3 substantive uncited claims (audit unlabelledUncitedCandidates) explain why sw_extends solves the multi-plugin problem without a supporting citation — caps Citation at 40
  - Correctly warns against plain {% extends %} and names sw_extends as the required tag, matching fact 1
  - Official: Framework/Adapter/Twig/TokenParser/ExtendsTokenParser.php:66-69 — "sw_extends is a Shopware token parser, not plain Twig extends; NodeExtension never replaces Twig's built-in extends."
- **dev-28 (vanilla)** — partly, 82%
  - Facts 1 and 2 (override() call with matching selector, explicit extends of the core class) are both present and correct
  - Fact 3 (CookiePermission registered lazily; register() infers async from missing prototype descriptor; re-register() is a no-op not an override) is missing
  - 5 uncited factual claims carrying the actual code recipe (audit unlabelledUncitedCandidates) — only the 'overridden once' caveat is cited — caps Citation at 40
  - Repeats the doc's 'each plugin can only be overridden once' claim verbatim; this is a documented (if unconfirmed-by-code) claim, not a fabrication
  - Official: storefront: Resources/app/storefront/src/plugin-system/plugin.manager.js:122-135 — "override() with equal from/to name deregisters and re-registers wholesale — no automatic inheritance from the overridden plugin."
- **dev-29 (vanilla)** — partly, 79%
  - Fact 2 (6.7 header/footer rendered via ESI sub-requests, so *PageLoadedEvent subscribers cannot reach header/footer; must use Header/FooterPageletLoadedEvent) is entirely absent — a central expected-answer fact for this case
  - Fact 1 (subscribe to *LoadedEvent, addExtension/addArrayExtension) is present; fact 3 (store-api-route convention) is loosely present
  - 2 uncited factual claims (audit unlabelledUncitedCandidates) restate the core recipe without a supporting citation
  - Official: storefront: Resources/views/storefront/base.html.twig:55,114 — "6.7 renders header and footer as ESI sub-requests unconditionally; no page variable exists in that scope."
- **dev-30 (vanilla)** — partly, 82%
  - Covers the ProductListingCollectFilterEvent subscriber route and the filter-panel.html.twig / component_filter_panel_items block override with sw_include, matching facts 1 and 3
  - Does not mention the AbstractListingFilterHandler + shopware.listing.filter.handler tag route, nor the Filter object's exclude flag / AggregationListingProcessor mechanics (part of facts 1–2)
  - 3 uncited factual claims (audit unlabelledUncitedCandidates) carry the whole technical recipe with only two short quotes actually cited
  - Official: Content/Product/SalesChannel/Listing/Filter/AbstractListingFilterHandler.php:12-33 — "getDecorated() and create() are abstract; the tagged handler route is primary, ProductListingCollectFilterEvent is a secondary route."
- **dev-31 (vanilla)** — fail, 56%
  - Answer used a different, valid Shopware doc page (add-scss-variables-via-subscriber.md, a manual-subscriber route) instead of the canonical <css>-tag mechanism the case's facts require
  - None of the three expected facts (the <css> config.xml tag with the built-in ThemeCompilerEnrichScssVarSubscriber requiring no plugin listener, the colorpicker-vs-bool hasCssValue() string check, or the !default fallback / theme-variables ordering) appear
  - The manual-subscriber approach given is real and documented, so this is not a fabrication, but it fails to carry any of the pinned expected-answer facts — Completeness scored 0
  - 1 uncited factual claim (audit unlabelledUncitedCandidates) carries the whole recipe
  - Official: storefront: Theme/Subscriber/ThemeCompilerEnrichScssVarSubscriber.php:42-79 — "config.xml <css> field is the canonical route, resolved automatically by the core subscriber into theme-variables.scss."
- **dev-32 (vanilla)** — partly, 82%
  - Covers the declarative custom-fields.xml route with <related-entities><product/> and the imperative repository alternative, matching facts 1 and 2
  - Fact 3 (set/field name and type are Immutable; custom_field.editor ACL; not-searchable-by-default since 6.7.7.0 plus reindex requirement) is entirely absent
  - 2 uncited factual claims (audit unlabelledUncitedCandidates) carry the XML/repository recipe with only one short quote cited
  - Official: System/CustomField/CustomFieldSetPersister.php:122-138 — "custom_field_set.extension_name tracks plugin ownership; the declarative custom-fields.xml route is synced on install/update/uninstall."
- **dev-33 (vanilla)** — fail, 56%
  - The query specifically asks 'what has to line up for it to actually show up after a build' but the answer's build-chain coverage is a generic 'run the administration build' statement — misses var/plugins.json, bundle:dump, Vite entrypoints.json and the silent-drop failure mode (fact 2) entirely
  - Fact 1's abort conditions (hyphen requirement, duplicate id, display:false, routes/routeMiddleware requirement) are not stated, only the basic Module.register call
  - Fact 3 (menu entry is separate; needs parent+label; position += 1000; no icon fallback) is not covered
  - 2 uncited factual claims (audit unlabelledUncitedCandidates) restate the module-registration recipe without citation
  - Official: administration package — Framework/Twig/ViteFileAccessorDecorator.php:98-101 — "A missing .vite/entrypoints.json returns [] silently — the module never loads and nothing warns except system:check."
- **dev-34 (vanilla)** — fail, 53%
  - Fetched an old v6.5 docs page rather than the current 6.7 page — content used (Component.override, block name) happens to still be accurate but the override-vs-extend distinction (fact 1) is never discussed
  - Fact 3 (this.$super mechanism, generated from a super registry via regex, getter/setter naming) is entirely absent
  - Correctly names the dashboard block sw_dashboard_index_content_intro_content_headline and mentions {% parent %}, matching part of fact 2
  - 1 uncited factual claim (audit unlabelledUncitedCandidates) about the main.js import mechanism
  - Official: administration package — src/module/sw-dashboard/page/sw-dashboard-index/sw-dashboard-index.html.twig:13-17 — "sw_dashboard_index_content_intro_content_headline is still an Options-API .html.twig block in 6.7.13.0, not a v6.5-only stale block."
- **dev-35 (vanilla)** — fail, 53%
  - States 'the search method requires the Criteria object and the API context as its two parameters', directly contradicting expected fact 1 that the context argument is optional and defaults to Shopware.Context.api — a materially wrong statement
  - Fact 3 (ACL is validated server-side via AclCriteriaValidator, recursing into every association; registering the privilege in the Administration alone does not satisfy it) is entirely absent
  - Criteria usage (setPage/setLimit/addFilter/addSorting) matches fact 2's core surface reasonably well
  - 1 uncited factual claim (audit unlabelledUncitedCandidates) carries the criteria-building recipe
  - Official: administration package — src/core/data/repository.data.ts:121-137 — "search(criteria, context = Shopware.Context.api) — the context argument defaults and is optional, not required as the answer claims."
- **dev-36 (vanilla)** — partly, 82%
  - Correctly gives the addPrivilegeMappingEntry() registration call and the acl.can()/inject:['acl'] check pattern, and captures the fact-3 point that Administration ACL checks only guard the UI and must also be enforced server-side
  - Does not mention the dot-vs-colon naming distinction for admin roles vs API privileges, nor that every role entry must carry both privileges and dependencies (undefaulted, throws if omitted) — part of fact 1
  - Does not mention the declarative gating mechanisms (meta.privilege router guard, settingsItem.privilege, nav-entry privilege filtering) or that no ACL directive exists — part of fact 2
  - 2 uncited factual claims (audit unlabelledUncitedCandidates) about file layout and the UI-only caveat
  - Official: administration package — src/app/service/privileges.service.ts:12-24,49-69,126-147,290-317 — "Every role entry must carry both privileges and dependencies; nothing defaults dependencies and omitting it throws on the roles detail page."
- **dev-37 (vanilla)** — partly, 82%
  - Covers the phpunit.xml + TestBootstrap.php + TestBootstrapper fluent chain, and both IntegrationTestBehaviour and KernelTestBehaviour traits, matching facts 1 and 2 reasonably well but without naming KERNEL_CLASS or test.service_container explicitly
  - Fact 3 (bootstrap() forces the DB name to end in _test; PHPUnit is not shipped by shopware/core and must be required separately) is entirely absent
  - 4 uncited factual claims (audit unlabelledUncitedCandidates) carry most of the technical recipe with only two short quotes actually cited
  - Official: TestBootstrapper.php:143-155,47-77 — "TestBootstrapper appends _test to the DATABASE_URL path; PHPUnit itself is not shipped by shopware/core."
- **dev-38 (vanilla)** — fail, 56%
  - Mounts via 'shallowMount(Shopware.Component.build(...), { props, stubs })' without the Vue-3 test-utils 'global' wrapper the expected answer requires for stubs/mocks/provide — an outdated (Vue 2) API shape
  - Does not mention wrapTestComponent()/flushPromises as globals installed by setupFilesAfterEnv, an alternative recipe named in fact 2
  - States tests can be run via 'composer run admin:unit... from the Shopware root', implying a plugin can use the shipped harness directly — contradicts expected fact 3 that 6.7 ships no Jest harness for a plugin (roots/testMatch cover only Administration/Storefront) and a plugin must supply its own config; this is a materially misleading statement for the query as asked
  - 1 uncited factual claim (audit unlabelledUncitedCandidates) about the mounting/mocking pattern
  - Official: jest.config.js:35-38,14-17 (shopware/administration) — "Shopware 6.7 ships no Jest harness for a plugin; roots/testMatch cover only Administration and Storefront's admin extension."
- **dev-39 (vanilla)** — fail, 59%
  - Correctly identifies the dev-39 Cypress trap: states Cypress is no longer supported/recommended and gives the Playwright + @shopware-ag/acceptance-test-suite replacement path, matching all three expected facts at a reasonable level of detail
  - Does not mention bin/console integration:create <name> --admin as the credential-creation step (part of fact 2), nor the actor-pattern/task-scaffolding terminology (fact 3), though the underlying gist (own Playwright project against the published npm package) is present
  - 2 uncited factual claims (audit unlabelledUncitedCandidates) carry most of the setup recipe
  - Official: https://github.com/shopware/shopware/tree/v6.7.13.0/tests/e2e/cypress — "tests/e2e/cypress reduced to a single 0-byte file at v6.7.13.0 — Cypress is gone; Playwright/@shopware-ag/acceptance-test-suite is current."
- **dev-40 (vanilla)** — fail, 56%
  - States you must 'adjust the other Shopware packages (shopware/administration, shopware/storefront, shopware/elasticsearch, etc.) to matching 6.7 constraints' — this contradicts expected fact 1, which states only shopware/core's constraint needs to change because the others are pinned '*' and follow core automatically
  - Does not mention refreshing Symfony Flex recipes (composer recipes:update / symfony:recipes:install --force --reset), which fact 2 identifies as a required step distinct from the Composer update itself
  - Mentions system:update:finish but not its internal migration/theme-recompile behaviour or the maintenance-mode bracketing (fact 3)
  - 2 uncited factual claims (audit unlabelledUncitedCandidates) carry most of the upgrade steps; memory claims are appropriately labelled
  - Official: symfony.lock (shopware/core and shopware/administration blocks) — "Symfony Flex recipes must be refreshed (composer recipes:update) alongside the shopware/core composer constraint change."
- **dev-41 (vanilla)** — partly, 82%
  - Correctly read the actual installed composer.json (PHP ~8.2.0||~8.3.0||~8.4.0||~8.5.0) and administration package.json (Node engines) rather than relying only on the web — matches facts 1 and part of fact 3 with code-grounded precision
  - Does not mention that the DatabaseConnectionFactory version check only fires inside createConnection() (system:install / web installer), never at boot or during composer update — a central nuance of fact 2
  - Does not name 'composer check-platform-reqs' as the CLI preflight, nor state that bin/console system:check does not answer this — the specific mechanism fact 3 asks for; instead offers generic php -v/node -v checks
  - 1 citation ('...package.json (engines block, read via grep+cat)') has no parseable path:line-range and is a shape failure per the audit (3/4 verified)
  - Official: composer.json:51-72 — "PHP requirement is the enumerated constraint ~8.2.0 || ~8.3.0 || ~8.4.0 || ~8.5.0 — a bounded list, not an open-ended '8.2 or newer'."
- **dev-42 (vanilla)** — partly, 80%
  - Well-cited: all 5 citations are verified against directly-fetched doc quotes, and the audit's unlabelledUncitedCandidates list is empty
  - Captures the gist of fact 2 (custom/plugins extensions outside vendor/ cannot participate in Composer resolution and so block the readiness check) closely, quoting the exact supporting sentence
  - Does not mention the specific --target/--dry-run flags, that --target is mandatory non-interactively, or that project upgrade-check is deprecated (fact 1)
  - Does not mention the .shopware-cli/upgrade/report.md output path or shopware-cli project validate (fact 3)
  - Official: shopware-cli 0.18.4: internal/shop/upgrade/readiness.go:145-170,213-257 — "Plugins in custom/plugins block on the 'Extensions managed through Composer' readiness check, not the extension-compatibility classification."
- **dev-43 (vanilla)** — fail, 56%
  - Presents 'Create a new config file vite.config.mts' as a required step, falling directly into the case's documented Trap: the expected answer states the config is optional and a plugin supplies no build config of its own (fact 1) — the answer implies the opposite
  - Fact 2's nuance (Shopware's inline config is merged over the plugin's file, so root/outDir/base cannot be overridden) is absent
  - Fact 3 (var/plugins.json / bundle:dump / production entrypoints.json chain) is entirely absent
  - 2 uncited factual claims (audit unlabelledUncitedCandidates) restate the migration steps
  - Official: administration: Resources/app/administration/build/plugins.vite.ts:42-64,134-146 — "A plugin supplies no build config of its own; vite.config.mts is optional, not a mandatory drop-in replacement for webpack.config.js."
- **dev-44 (vanilla)** — fail, 59%
  - Correctly gives Shopware.Snippet.tc as the this.$tc prop-default replacement (fact 1), quoting the doc directly
  - Covers the AsyncWrapperComponent / this.$parent.$parent explanation and appropriately flags it as an anti-pattern to avoid rather than a fixed rule, capturing the spirit of fact 2's 'wrong general fix' warning even without the 11-sync-component/$options.name detail
  - Fact 3 (this.$tc still exists but is @deprecated tag:v6.8.0, eslint auto-fix, npm run code-mods, TS files get no warning) is entirely absent
  - 1 uncited claim (audit unlabelledUncitedCandidates) mostly paraphrases the already-cited quotes rather than introducing a new unsupported claim
  - Official: administration: Resources/app/administration/src/core/shopware.ts:264-275 — "Shopware.Snippet.tc replaces this.$tc in a prop default() — there is no component 'this' in a Vue 3 prop default."
- **dev-45 (vanilla)** — partly, 82%
  - Correctly gives Store.register replacing State.registerModule with state-as-function and mutations-not-needed, matching facts 1–2
  - Does not mention that Store.get() throws 'Store with id ... not found' on an unregistered id, nor that Shopware.State is not actually gone in 6.7.13.0 (still live, deprecated only for 6.8) — both part of fact 3
  - 1 uncited factual claim (audit unlabelledUncitedCandidates) gives the exact Store.register code shape without a citation
  - Official: shopware/administration: src/app/store/index.ts:59-90 — "Shopware.Store.register replaces Shopware.State.registerModule; Shopware.State remains a live, deprecated (tag:v6.8.0) Vuex-backed property in 6.7.13.0."
- **dev-46 (vanilla)** — fail, 56%
  - Falls directly into the case's documented Trap: gives the invocation 'composer run admin:code-mods -- --plugin-name example-plugin --fix -v 6.7', which the expected answer states does not exist in a Flex/project install (only in the monorepo) — the docs page itself carries this error and the answer reproduces it faithfully but uncritically
  - The [from memory] claim 'sw-* components ... only emit console warnings' directly contradicts expected fact 1, which states sw-button/sw-card emit no runtime deprecation warning at all
  - Fact 2 (the deprecated-prop mechanism governs only 15 components; sw-tabs/sw-popover/sw-loader/sw-skeleton-bar use different, always-inactive-in-6.7 flags) is entirely absent
  - All 3 citations verified 3/3 with no unlabelled uncited candidates flagged by the audit
  - Official: administration: Resources/app/administration/src/app/component/base/sw-button/sw-button.html.twig:1-20 — "sw-button/sw-card are @deprecated tag:v6.8.0 wrappers already rendering the Meteor component in 6.7 — not removed."
- **dev-47 (vanilla)** — partly, 82%
  - Correctly identifies AbstractPaymentHandler as the 6.7 replacement, the single shopware.payment.method tag, and the pay()/finalize() relationship, matching facts 1–2's core
  - Does not mention that PaymentHandlerType has only RECURRING and REFUND cases (part of fact 2)
  - Fact 3 (payment_method.technicalName Required+unique; handler_identifier must equal the service id; deactivate rather than delete on uninstall) is entirely absent
  - 1 uncited factual claim (audit unlabelledUncitedCandidates) states the tag-change summary without a citation
  - Official: Checkout/Payment/Cart/PaymentHandler/AbstractPaymentHandler.php:18 — "The entire *PaymentHandlerInterface family and per-type tags are gone in 6.7, replaced by AbstractPaymentHandler and the single tag shopware.payment.method."
- **dev-48 (vanilla)** — partly, 74%
  - Correctly gives the ordinary register() call with a lazy import as the async-registration mechanism, matching the core of fact 2 (no separate async API/option)
  - Correctly quotes the exact compiled-file path pattern <plugin root>/.../dist/storefront/js/<plugin-name>/<plugin-name>.js, matching fact 3's core
  - Fact 1 (entry point must be exactly main.ts/main.js, discovered via var/plugins.json; class extends plugin base; init() called on DOMContentLoaded) is entirely absent
  - 2 uncited claims (audit unlabelledUncitedCandidates) largely restate content already covered by the 3 verified citations
  - Official: storefront Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:178 — "main.ts is preferred, falling back to main.js, discovered via var/plugins.json."
- **dev-49 (vanilla)** — partly, 77%
  - Correctly gives the exact #[Route(defaults: [PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [StorefrontRouteScope::ID]])] class-level attribute and per-method #[Route(path:..., name:..., methods:...)], matching fact 1 closely
  - Fact 2 (routes wired via a Resources/config/routes.* glob using the 'attribute' loader type; a 6.4-era type="annotation" import throws LoaderLoadException on symfony/routing 7.4) is entirely absent
  - Fact 3 (route name must start with frontend./widgets./payment. or appear in storefront.router.allowed_routes) is entirely absent
  - 1 uncited factual claim (audit unlabelledUncitedCandidates) gives the whole code recipe without a citation
  - Official: PlatformRequest.php:77 — "#[Route] scope default replaces @RouteScope; no RouteScope annotation/attribute class exists in 6.7."
- **dev-50 (vanilla)** — partly, 67%
  - The query is specifically about a handler that 'stopped running after the upgrade' — the answer's troubleshooting advice (check base class / tag / attribute) never names the actual 6.7-specific cause: ScheduledTaskExecutorCompilerPass scans the messenger.message_handler tag to inject the executor via setScheduledTaskExecutor(), and without it the handler falls back to a deprecated path (fact 3) — this is the central expected fact for this exact query and it is missing
  - Fact 1 (static getTaskName()/getDefaultInterval(); final empty constructor) and fact 2 (no getHandledMessages(); TaskRunner resolves solely via the #[AsMessageHandler] attribute and silently skips a handler lacking it) are only loosely gestured at
  - 2 items flagged by the audit (unlabelledUncitedCandidates) mostly restate already-cited quotes or are appropriately labelled [from memory]
  - Official: Framework/DependencyInjection/CompilerPass/ScheduledTaskExecutorCompilerPass.php:29-38 — "ScheduledTaskExecutorCompilerPass injects the ScheduledTaskExecutor via setScheduledTaskExecutor() — the missing piece behind a stopped-running handler."
- **dev-51 (vanilla)** — partly, 71%
  - expected-answer fact 3 (attribute entities do not create their own DB table; a plugin migration must ship the CREATE TABLE) absent from answer
  - trap missed: answer states (from memory) that entities.xml support 'has been removed for performance reasons', but entities.xml still exists in 6.7 as the app-only Custom Entity feature and the classic EntityDefinition route remains fully supported and undeprecated
  - unlabelledUncitedCandidates: 4 specific technical claims (DI registration mechanics, translated fields, associations, api exposure) beyond the single cited quote
  - Official: Framework/DataAbstractionLayer/Attribute/Entity.php:10-32 — "#[Entity('name')] class attribute plus typed public properties with #[Field]/#[PrimaryKey] — no EntityDefinition subclass needed; the classic route remains fully supported and is not deprecated."
- **dev-52 (vanilla)** — partly, 67%
  - expected-answer fact 2 (migration file location, bundle namespace, registration mechanics) absent from answer
  - expected-answer fact 3's key requirement (branch on $uninstallContext->keepUserData()) absent; answer only says cleanup belongs in uninstall() and attributes it to 'migrations have no rollback mechanism', a different and less accurate reason than the actual core behaviour
  - unlabelledUncitedCandidate: MigrationStep contract restated with more detail than the single citation supports
  - Official: Framework/Migration/MigrationStep.php:17-33,42-51 — "MigrationStep has only two abstract members; the timestamp is validated at runtime (>=1, <2147483647) or MigrationException::implausibleCreationTimestamp is thrown."
- **dev-53 (vanilla)** — partly, 64%
  - expected-answer fact 1 (declaring config fields under config.fields.<fieldName> in Resources/theme.json, unknown-key fatal) entirely absent — the answer only addresses translations, not how to define the fields the query explicitly asked about
  - expected-answer fact 3 mischaracterized: answer implies inline label/helpText were already replaced in 6.7, but they remain a valid fallback in 6.7 and are only stripped when the v6.8.0.0 feature flag is active — the actual 'labels disappeared' mechanism (the flag) is never identified
  - unlabelledUncitedCandidates: 2 specific technical claims (6.8 requirement, deprecated API response fields) beyond the two cited quotes
  - Official: shopware/storefront Theme/ThemeMergedConfigBuilder.php:512-521,361-397,539-549 — "6.7 translations belong in an Administration snippet file under sw-theme.<theme>.<tab>.<block>.<section>.<fieldName>.label — a fact the field-definition-only answer omits."
- **dev-55 (vanilla)** — partly, 82%
  - expected-answer fact 2 (sw_extends inheritance mechanism: unoverridden blocks pick up the new markup automatically, overridden ones go stale and either silently drop or throw RuntimeError on parent()) entirely absent
  - trap correctly avoided: answer never suggests the flag can be toggled off
  - unlabelledUncitedCandidates: 3 detailed technical claims about specific markup changes beyond the two cited quotes
  - Official: Framework/Resources/config/packages/feature.yaml:24-28 — "ACCESSIBILITY_TWEAKS flag still declared but nothing reads it in 6.7 — the new markup is unconditional."
- **dev-56 (vanilla)** — partly, 74%
  - expected-answer fact 2's cache-cost implication (ESI route is HTTP-cacheable and the cache key includes query parameters, so distinct values fragment the cache) not mentioned
  - expected-answer fact 3's HeaderPageletLoadedEvent/FooterPageletLoadedEvent + addExtension() alternative for non-scalar data not mentioned
  - unlabelledUncitedCandidates: 6 detailed technical claims beyond the two cited quotes
  - Official: shopware/storefront Resources/views/storefront/base.html.twig:54-56,113-115 — "headerParameters/footerParameters merge before render_esi() is the query-string channel for header/footer data."
- **dev-57 (vanilla)** — partly, 74%
  - expected-answer fact 3's full status-value list (Complete, Pending, In progress, Complete with error, Has new records) is incomplete in the answer — 'Pending' and 'Has new records' are omitted
  - unlabelledUncitedCandidate: full command syntax (target modules, --batch-size, --reset, --use-queue) restated beyond the three cited quotes
  - Official: https://developer.shopware.com/docs/products/extensions/b2b-suite-migration/execution/running-migration.html — "Migration Command: bin/console b2b:migrate:commercial ... Employee Management ... is migrated first by default, regardless of the specified order. Progress-Tracking Command: bin/console b2b:migrate:pr"
- **dev-58 (vanilla)** — partly, 82%
  - expected-answer fact 2 (redis_url is completely removed in 6.7; every subsystem instead references a named connection, e.g. cart storage, number range, cache invalidation delay) absent — the trap in the query (redis_url no longer valid at all) is never explicitly called out
  - unlabelledUncitedCandidates: yaml example and env-var DSN syntax restated beyond the three cited quotes
  - Official: Framework/DependencyInjection/Configuration.php:1581-1600 — "shopware.redis.connections.<name>.dsn is the only child node; redis_url no longer exists anywhere in 6.7 core."
- **dev-59 (vanilla)** — partly, 71%
  - expected-answer fact 2's effective-vs-deprecated-no-op key distinction (use_varnish_xkey, ban_method, ban_headers, purge_all) not stated
  - expected-answer fact 3's sw-force-cache-invalidate header and cache:clear:http/cache:clear:all specifics not mentioned
  - unlabelledUncitedCandidates: 2 detailed technical claims beyond the two cited quotes
  - Official: Framework/Adapter/Cache/CacheInvalidator.php:62-81,87-106,149-152 — "Invalidation is delayed by default (shopware.cache.invalidation.delay_enabled=true); the shopware.invalidate_cache scheduled task purges Varnish every 5 minutes."
- **dev-60 (vanilla)** — partly, 70%
  - expected-answer fact 3 directly contradicted: answer states 'a CLI worker should also be set up for the failure transport, since otherwise failed messages will not be processed', but the confirmed code evidence shows failed is in no shipped worker transport list and is drained only via messenger:failed:* — the answer faithfully quotes a documentation sentence that the code evidence disproves
  - expected-answer fact 2's requirement that scheduled-task:run becomes mandatory once the admin worker is disabled is not mentioned
  - unlabelledUncitedCandidates: 2 detailed technical claims beyond the three cited quotes
  - Official: symfony/messenger EventListener/SendFailedMessageToFailureTransportListener.php:37-74 — "failed is a dead-letter transport drained with messenger:failed:retry/show/remove, not a transport a standing worker consumes — 'set up a worker for the failed transport' is a documentation error."
- **dev-61 (vanilla)** — fail, 48%
  - expected-answer fact 1 directly contradicted: answer states Shopware 'uses three shards and three replicas by default' for the storefront index in 6.7, but the confirmed code shows the storefront env defaults were emptied in 6.7 (only the admin index still defaults to 3/3) — this is exactly the trap the case's expected answer warns against
  - expected-answer fact 2 misstated: answer recommends bin/console dal:refresh:index as the primary reindex command with es:index only for a 'narrower' pass, but the confirmed code shows the actual (and only) Elasticsearch reindex command is es:index and there is no es:reindex
  - expected-answer fact 3 (separate admin-index config/command es:admin:index, still defaulting to 3/3) entirely absent
  - unlabelledUncitedCandidate: config path and dal:refresh:index command restated with no supporting citation
  - Official: shopware/shopware@v6.7.13.0 src/Elasticsearch/Resources/config/packages/elasticsearch.yaml — "Storefront elasticsearch.index_settings.number_of_shards/number_of_replicas env defaults are empty in 6.7 — Shopware no longer forces 3 shards/3 replicas; only the admin indices still default to 3/3."
- **dev-62 (vanilla)** — partly, 70%
  - expected-answer fact 1's critical .env.local.php mechanism — the actual documented cause of an edited .env having no effect on a deployed shop — is never mentioned; instead the answer offers an unsupported memory claim ('Shopware overwrites the .env file's own content on updates') that does not match the real mechanism and is not confirmed by any evidence
  - expected-answer fact 2 (changing .env never requires cache:clear in prod, except FEATURE_* flags) not addressed
  - expected-answer fact 3's general point (shop-facing system_config settings are not read from .env at all) only partially covered via the single MAILER_DSN example
  - no unlabelled uncited claims — the inaccurate content is transparently labelled as memory
  - Official: vendor/symfony/dotenv/Dotenv.php:110-177,216-224 — "A real environment variable wins over every .env file; a .env.local.php dump, if present, is read exclusively and .env is not consulted at all."
- **dev-63 (vanilla)** — partly, 71%
  - expected-answer fact 2 (silent-failure diagnostics: an unknown identifier prints a note and exits 0, the plugin must be installed/active, a first-ever migration directory needs cache:clear) entirely absent — this is the crux of the 'my migration never ran' troubleshooting question
  - expected-answer fact 3 (the normal path is plugin:update/plugin:refresh lifecycle, and the Deployment Helper skips plugins whose upgradeVersion did not change) entirely absent
  - unlabelledUncitedCandidate: destructive-migration mention restated without a supporting citation
  - Official: Framework/Migration/Command/MigrationCommand.php:53-59,70-77,98-105 — "bin/console database:migrate <Identifier> --all — the identifier is the plugin's bundle name, not a namespace or file path; --all/--until is mandatory."
- **dev-64 (vanilla)** — partly, 77%
  - expected-answer fact 2 contradicted: answer states client_credentials tokens are valid 3600s (one hour) and password-grant tokens 600s, but the confirmed code shows both use the identical access-token TTL (PT10M = 600s) for every grant type — the 3600 figure comes from an inconsistent documentation example the agent trusted
  - expected-answer fact 1's negative point (client_credentials issues no refresh_token) is not stated
  - no unlabelled uncited claims found beyond the two verified citations
  - Official: Framework/Api/EventListener/Authentication/ApiAuthenticationListener.php:47 — "Access-token lifetime is PT10M (600s) for every grant including client_credentials — a single shared TTL, not the divergent 3600/600 figures the fetched pages disagree on."
- **dev-65 (vanilla)** — partly, 67%
  - expected-answer fact 1's key distinction (post-filter restricts only result rows and never narrows aggregation counts, while filter does) not addressed
  - expected-answer fact 3 contradicted: answer states total-count-mode: 1 gives an exact count 'using SQL_CALC_FOUND_ROWS', but the confirmed code shows the exact mode runs a second COUNT(*) query over the subquery — Shopware does not use SQL_CALC_FOUND_ROWS
  - unlabelledUncitedCandidates: 2 detailed technical claims about associations/sorting beyond the single cited quote
  - Official: Framework/DataAbstractionLayer/Dbal/EntitySearcher.php:191,203 — "exact total-count mode resets order/limit and runs a second COUNT(*) over the subquery — not SQL_CALC_FOUND_ROWS."
- **dev-66 (vanilla)** — partly, 74%
  - expected-answer fact 2 contradicted: answer frames sw-inheritance as a boolean 'set to 1', but the header actually works by presence alone — any value, including 0 or false, enables inheritance, and there is no way to disable it via a falsy value; this is a documented footgun the answer gets backward
  - expected-answer fact 1's language fallback chain (requested -> parent -> system) and the languageNotFound error on an invalid id are not mentioned
  - expected-answer fact 3's scope (resolved for every /api route, not just the bulk-import/sync route) is not mentioned
  - no unlabelled uncited claims found beyond the four verified citations
  - Official: Framework/Routing/ApiRequestContextResolver.php:124 — "sw-inheritance switches on considerInheritance by presence alone — any value, including 0 or false, enables it."
- **dev-67 (vanilla)** — partly, 71%
  - expected-answer fact 2's case-insensitive folder/name comparison and the --no-validate bypass option not mentioned
  - unlabelledUncitedCandidates: 2 detailed technical claims (folder naming, install/activate flow) beyond the two cited quotes
  - Official: Framework/App/Validation/AppNameValidator.php:17-28 — "The folder name must equal <meta><name> case-insensitively, enforced by AppNameValidator on app:install/refresh/validate."
- **dev-68 (vanilla)** — partly, 64%
  - expected-answer fact 2's 6.7-specific rule (a returned secret identical to the current stored secret is rejected) not mentioned
  - expected-answer fact 3's shopware-shop-signature-previous header on re-registration not mentioned
  - unlabelledUncitedCandidate: shop-secret generation detail restated without a supporting citation
  - Official: Framework/App/Lifecycle/Registration/AppRegistrationService.php:57-62,156-176 — "proof must be hash_hmac('sha256', shopId . shopUrl . appName, secret) with no separator, compared timing-safe."
- **dev-69 (vanilla)** — partly, 82%
  - expected-answer fact 1 (app must hold the corresponding <entity>:read privilege or the webhook is silently skipped, no message and no log) entirely absent
  - unlabelledUncitedCandidates: 2 detailed technical claims (manifest example, payload shape) beyond the single cited quote
  - Official: Framework/App/Hmac/RequestSigner.php:17-32 — "shopware-shop-signature = hash_hmac('sha256', <raw request body>, <app secret>) — only the body is signed."
- **dev-70 (vanilla)** — partly, 71%
  - expected-answer fact 1 mischaracterized: answer frames payment methods as 'asynchronous' (pay-url + finalize-url) vs 'synchronous' (pay-url only) manifest declarations, but the confirmed code shows there is no separate sync/async handler — every app payment method is served by the single core AppPaymentHandler, and finalize only runs when the app's response carried a redirectUrl
  - expected-answer fact 2's requirement that the app's response itself must carry a valid shopware-app-signature header is not mentioned
  - expected-answer fact 3's 6.7 action-name renaming trap (pay->paid, do_pay->process, pay_partially->paid_partially) and the fact that status is a transition action name (not a state name) are both missing
  - unlabelledUncitedCandidates: 2 detailed technical claims beyond the single cited quote
  - Official: Framework/App/Payment/Handler/AppPaymentHandler.php:236-259 — "status is a state-machine transition action name (paid, process, ...), not a state name; the 6.7 migration renamed pay→paid, do_pay→process."
- **dev-71 (vanilla)** — partly, 68%
  - expected-answer fact 3 contradicted: answer states store-api-aware="true" fields become 'accessible through the Store API, enabling storefront access' (quoting the docs verbatim), but the confirmed code shows this flag only attaches the ApiAware read-protection flag and creates no route — there is no generic Store API route for custom entities in 6.7; storefront access requires an app-script endpoint
  - expected-answer fact 1's custom_entity_/ce_ table-name prefix requirement and the automatically added id primary key are not mentioned
  - expected-answer fact 2's URL underscore-to-hyphen mapping rule and the inactive-app -> notFound (not 403) behaviour are only implied by one example, not stated generally
  - unlabelledUncitedCandidates: 5 detailed technical claims beyond the three cited quotes
  - Official: Framework/Script/Api/ScriptStoreApiRoute.php:36 — "store-api-aware only attaches the ApiAware read-protection flag; there is no generic Store API route for custom entities in 6.7 — storefront access goes through an app script endpoint."
- **func-01 (vanilla)** — partly, 73%
  - expected-answer fact 1 (mandatory pre-save fields: Title, Product number, Tax rate, Price net+gross, Stock; no tab bar renders until the first save) entirely absent
  - expected-answer fact 3 (the write-protected display_group variant-listing mechanism, and that 6.7's 'Generate variants' never persists variantListingConfig, causing only one arbitrary variant to show in a listing) entirely absent — this is the deepest and most specific part of the 'why might it not show up' question
  - citation set is clean; no unlabelled uncited claims found
  - Official: Content/Product/Aggregate/ProductVisibility/ProductVisibilityDefinition.php:24-28,63-68 — "Visibility is a separate product_visibility row per channel with exactly three Choice-enforced levels (10/20/30), not a field on the product."
- **func-02 (vanilla)** — partly, 64%
  - expected-answer fact 1's 'NULL availability rule means always available' and 'a rule in use cannot be deleted' not mentioned; the need to combine several conditions into one rule (rather than stacking rules) is only weakly implied
  - expected-answer fact 2 (conditions as nested rule_condition rows, root always wrapped in an AndRule, matching against the serialized payload so an invalid/un-indexed rule silently blocks the method) entirely absent
  - expected-answer fact 3 (double availability check via pre-computed SalesChannelContext rule ids from CartRuleLoader, distinct blocked-error reasons) entirely absent
  - unlabelledUncitedCandidate: condition-scope list restated without a supporting citation
  - Official: Checkout/Shipping/ShippingMethodDefinition.php:81 — "A shipping/payment method references at most one availability rule via a nullable FK; several conditions must be combined inside one rule."
- **func-04 (vanilla)** — partly, 71%
  - expected-answer fact 2 substantially incomplete: only 3 of the 8 mandatory premapping items (payment methods, salutations, delivery times) are named; order states, order delivery states, transaction states, newsletter recipient status and the default shipping availability rule are all missing
  - expected-answer fact 3 contains a wrong claim: answer states 'shipping costs... must be recreated using the new Rule Builder' as not migrated, but the confirmed evidence shows shipping methods DO have a ShippingMethodDataSet and are migrated as part of customersOrders
  - unlabelledUncitedCandidate: the detailed migrated-data list restated beyond the three quoted citations
  - Official: SwagMigrationAssistant@6.6.x src/Profile/Shopware/DataSelection/BasicSettingsDataSelection.php:49-62 — "basicSettings is the mandatory base DataSelection; payment methods have no DataSet at all, only a premapping reader — the shipping-costs claim looks like a conflation with an unrelated topic."
- **func-05 (vanilla)** — fail, 55%
  - Answer states the access key comes with 'a matching secret', contradicting expected fact 3 that a sales-channel access key has NO secret counterpart (unlike user/integration keys) — materially wrong
  - Only 2 of the 4 sales-channel types (storefront, headless) are named; Product comparison and Agentic commerce are omitted, and no mention that every type carries the same Required fields
  - Never states that only Storefront-type channels are served by domain routing, or that headless channels need no domain at all
  - 3 unlabelled, uncited factual claims (sales-channel creation UI, domain assignment mechanics, API-access-key mechanics) — Citation capped at 40 per memory-audit rule
  - Official: System/SalesChannel/SalesChannelDefinition.php:108-117,131,141-146 — "typeId, languageId, currencyId, paymentMethodId, shippingMethodId, countryId, navigationCategoryId and accessKey are Required for every sales-channel type."
- **func-06 (vanilla)** — fail, 58%
  - Lists 'calling a webhook/URL' as a plain available Flow Builder action with no licence caveat, contradicting expected fact 2 (core ships no HTTP/webhook action; Call URL is a Commercial/licence-gated extension) — materially misleading
  - Never states the admin location (Settings > Shop in 6.6 / Settings > Automation in 6.7) or that the trigger list is not closed (23-24 hardcoded events plus per-state and per-app triggers) — fact 1 essentially absent
  - Does not mention the default order-confirmation flow already shipping for checkout.order.placed, so a merchant's new flow sends an additional mail, not the only one — fact 3 partially covered
  - 1 unlabelled, uncited factual claim (the full action list including the webhook item) — Citation capped at 40
  - Official: Content/Flow/Dispatching/DelayableAction.php:8 — "Core ships no delay/wait action and no Call URL webhook action out of the box — both are licence-gated extensions; the 16 core actions are an identical set in 6.6 and 6.7."
- **func-07 (vanilla)** — fail, 59%
  - States dry run 'lets you test the import completely without it actually being executed', directly contradicting expected fact 3 (dry run performs the real writes and rolls back the DB transaction afterward, while log/file/media side-effects survive) — this repeats the doc's own misleading framing (doc/code divergence) and is the central answer to the query's own 'dry run' clause
  - No mention of the 6.6-vs-6.7 admin menu-location split, the text/csv-only restriction, or that delimiter/enclosure are profile fields (fact 1 absent)
  - Does not mention that mapping the same DAL key to two CSV columns silently collapses rather than being rejected (part of fact 2)
  - 2 unlabelled, uncited factual claims (mapping mechanics, dry-run paragraph) — Citation capped at 40
  - Official: Content/ImportExport/ImportExport.php:116-118,180-182,191-194,196-210 — "Start dry run performs real writes and rolls back only the DBAL transaction; log rows, files and media-filesystem side effects survive."
- **func-08 (vanilla)** — fail, 59%
  - Presents 'Modifiable via Store API' as the sole gate for Store-API writability without naming the write-route restriction (only customer / customer_address / newsletter_recipient are wired to accept a Store-API customFields write) — implies any entity's custom field becomes writable, which is materially misleading per fact 3
  - Does not mention 'Visible in Store API' (read exposure) or 'Available in shopping carts' as the two other independent switches (fact 3 partial)
  - Field types listed match the 11 admin UI options well (fact 2's count), but never states they collapse onto 8 stored types, nor the 6.6-vs-6.7 Twig-variable-name validation gap (fact 2's version delta absent)
  - 1 unlabelled, uncited factual claim (the Store-API writability paragraph) — Citation capped at 40
  - Official: System/CustomField/Aggregate/CustomFieldSetRelation/CustomFieldSetRelationDefinition.php — "A set with no relation row serves no entity at all — reads and writes are blocked on every entity."
- **func-09 (vanilla)** — partly, 82%
  - Correctly and precisely covers fact 1 (sales-channel assignment is a hard gate beyond Active) and fact 2 (availability rule null-or-matched, blank = unrestricted), quoting the doc accurately
  - Never mentions fact 3 — that the listing never checks the payment handler (a dangling handler still shows) or that apps/plugins can drop a method via the checkout gateway's RemovePaymentMethodCommand
  - 1 unlabelled, uncited factual claim (the availability-rule paragraph) — Citation capped at 40 despite otherwise strong grounding
  - Official: Checkout/Payment/SalesChannel/SalesChannelPaymentMethodDefinition.php:15 — "Store API payment-method listing unconditionally filters on payment_method.salesChannels.id = current sales channel."
- **func-10 (vanilla)** — fail, 55%
  - Presents 'Keep matching variants grouped' (displayAsGroup) as a current feature for a case pinned '6.6 + 6.7' with no version caveat, directly violating expected fact 3's explicit trap that this field does not exist in 6.6
  - Adds 'basis for promotions' as a usage of dynamic product groups, which is not among the 5 real usages named in fact 2 (category, cross-selling, CMS slider, product export, cart rule) — an invented use case
  - Never mentions the cart rule usage (cartLineItemInProductStream) or that only that one usage reads the materialised product_stream_mapping table while the rest re-evaluate live (fact 2's core distinction)
  - No mention of the product_stream_filter data model, static/stream row types, or that api_filter/invalid are computed by the indexer (fact 1 absent)
  - Official: Content/ProductStream/Service/ProductStreamBuilder.php:34 — "displayAsGroup and internal do not exist in the 6.6.10.0 ProductStreamDefinition — offering this option for 6.6 is the version-pin trap."
- **edge-03 (vanilla)** — partly, 74%
  - Correctly states Shopware uses no Doctrine ORM (fact 1) and names the real DAL mechanism — EntityDefinition, Entity/EntityCollection, migration-based table creation, repository DI (fact 2) — quoting the doc accurately
  - Never names the persistence call itself (create()/upsert() with an array payload and Context) or contrasts it with the absence of persist()/flush() (fact 3 present only at a generic 'persistence happens through EntityRepository' level)
  - 2 unlabelled, uncited factual claims (the Doctrine-absence statement and the '<entity>.repository' constructor-argument detail) — Citation capped at 40
  - Official: Framework/DataAbstractionLayer/EntityRepository.php:113,127 — "There is no persist()/flush() unit of work; write with create()/upsert() on the <entity_name>.repository service plus a Context."
- **edge-06 (vanilla)** — partly, 73%
  - For attribute sets, the answer names 'Shopware's custom field sets' as the equivalent without stating that no attribute_set entity exists and a product is never restricted to one set — this is exactly the trap the case calls out ('name a look-alike' instead of stating there is no direct counterpart), a materially misleading framing for fact 3
  - Correctly negates di.xml outright ('Shopware does not have a Magento-style DI configuration file') and correctly names Symfony services.xml plus service-decoration as the preferences analogue — fact 4 handled well, matching the trap's requirement for that item
  - Store-view / sales-channel mapping (fact 1) and extension mapping (fact 2) are both present at a reasonable level of detail
  - No unlabelled uncited candidates; the one memory claim is correctly labelled
  - Official: System/CustomField/Aggregate/CustomFieldSetRelation/CustomFieldSetRelationDefinition.php:19,46-47 — "There is no attribute-set equivalent: custom_field_set binds to entity names via custom_field_set_relation, not a per-product attribute-set assignment."
- **edge-09 (vanilla)** — fail, 56%
  - States the flow is configured at 'Settings > Shop > Flow Builder' — wrong menu path for 6.7 (the correct location is Settings > Automation, per fact 2); a developer following this literally would look in the wrong place
  - Repeats the stale Business-Events merchant page's own framing ('replaced by the Flow Builder in the major release 6.4.8.0', 'continues to exist only for the B2B-Suite') as settled fact without checking it against the installed vendor code (available to vanilla via Bash/Read) — this is exactly the doc/code divergence trigger 3 the case is built to catch: expected fact 1 requires stating plainly that NO Business Events admin screen exists at all in 6.6/6.7 (module absent, backing tables dropped by a V6_5 migration), not that it was 'replaced' and partially survives
  - Never mentions that 'Business event' survives only as a read-only event catalogue exposed at GET /api/_info/events.json feeding the Flow Builder trigger picker — fact 3 entirely absent
  - The trigger name (checkout.order.placed) and the 'Send email' action are correctly identified, which is the one part of fact 2 handled correctly
  - Official: Migration/V6_5/Migration1670854818RemoveEventActionTable.php:24-29 — "event_action, event_action_rule and event_action_sales_channel tables are dropped by a V6_5 migration — Business Events has no configuration screen in 6.6 or 6.7."
- **gap-02 (vanilla)** — fail, 55%
  - Instructs setting 'use_app_secret: true in the API configuration' — this specific config-node phrase is not present in any of the report's cited quotes and is not part of the confirmed 6.7 facts, which state signing is HMAC-SHA256 over APP_SECRET with no configurable node at all; this is an invented config detail, directly against fact 3's 'invents no ... config node' requirement
  - Correctly quotes the APP_SECRET length requirement and the system:generate-app-secret command from the (6.6-era) upgrade guide, but never states that system:generate-jwt-secret and JwtCertificateGenerator simply don't exist in 6.7 (only implies the RSA path is 'gone')
  - Never states that the documentation corpus itself carries no 6.7 release-notes/upgrade page on this and that the material found is pre-6.7 (facts 1 and 2 about doc coverage absent)
  - 1 unlabelled, uncited factual claim — Citation capped at 40
  - Official: Framework/Api/OAuth/JWTConfigurationFactory.php:20-36 — "Tokens are signed HMAC-SHA256 over APP_SECRET with no key file read at any point; a FakeCryptKey with empty contents/path is handed to the OAuth server."
- **gap-05 (vanilla)** — fail, 56%
  - Correctly and verifiably confirms (via an actual filesystem search of vendor/shopware/core) that no Cached*Route class exists in 6.7, matching fact 1's core claim
  - For 'how do I cache a Store API route now' — the actual query's second half — the answer only says to 'rely on the reverse-proxy/HTTP cache layer', never naming the real replacement mechanism (`defaults: ['_httpCache' => true]` route attribute) or the CacheTagCollector::addTag() tagging mechanism from facts 2 and 3; this materially fails to answer the practical half of the question
  - No mention of the version-gating nuance (store-api caching only from 6.7.6.0, gated behind the experimental CACHE_REWORK flag defaulting false) — per the brief's guidance this needed no escalation since the answer makes no specific claim about it to check, but its complete absence still leaves the answer unable to explain why '_httpCache alone' would not work on a stock install
  - 1 unlabelled, uncited factual claim — Citation capped at 40
  - Official: Framework/Adapter/Cache/Http/CacheResponseSubscriber.php:119-123 — "Store-api HTTP caching via _httpCache landed only at 6.7.6.0 and is gated behind the default-false CACHE_REWORK flag — declaring _httpCache alone does not cache the route."
- **gap-06 (vanilla)** — partly, 77%
  - Correctly quotes the verified ShippingMethodDefinition Required flag on technical_name and the ADR requirement text, and gives the correct practical route — a plugin migration/install() writing via shipping_method.repository EntityRepository::create() — matching fact 2 and much of fact 3
  - Never states the NOT NULL (6.7-specific) / UNIQUE database-level constraints, that the field is not format-validated, or the specific ShippingException::duplicateTechnicalName() exception on collision (fact 3 partial)
  - Never states that the documentation corpus has no plugin-side guide for this at all (facts 1/2 about doc coverage absent)
  - 1 unlabelled, uncited factual claim — Citation capped at 40
  - Official: Checkout/Shipping/ShippingMethodDefinition.php:77 — "technicalName is a Required StringField, NOT NULL from 6.7 and UNIQUE; a duplicate surfaces as ShippingException::duplicateTechnicalName()."
- **gap-07 (vanilla)** — partly, 67%
  - Gives the exact, code-verified MediaService::saveMediaFile() signature and correctly notes it returns the media id, matching the media-creation half of fact 2 precisely
  - Presents calling ThumbnailService::generate() directly as the way to produce thumbnails, omitting that saveMediaFile() already dispatches an asynchronous GenerateThumbnailsMessage and that thumbnails only appear after a message-bus consumer runs (or via bin/console media:generate-thumbnails) — this materially misrepresents the actual (asynchronous) behaviour described in fact 3
  - Does not mention that generate() requires a MediaCollection with the thumbnails association already loaded, or that generation is silently skipped when the folder configuration lacks createThumbnails
  - Never states that the documentation corpus has no guide for this PHP write path (facts 1/2 about doc coverage absent)
  - Official: Content/Media/File/FileSaver.php:94-96 — "Persisting the file dispatches a GenerateThumbnailsMessage on the message bus — thumbnails appear only after a consumer runs, not synchronously with the save."
- **gap-08 (vanilla)** — partly, 77%
  - Gives the correct nuxt.config.ts shape (accessToken/endpoint) quoted directly from the official troubleshooting page, matching the setup half of the query well
  - For the 412 explanation, repeats the doc's own undifferentiated framing ('the specified accessToken is incorrect or not correct for the specified endpoint') rather than the more precise, code-verified distinction in fact 3 — 412 specifically means a well-formed key that is not a sales-channel key or matches no active channel, while a missing header is 401 and a malformed key is 403, not 412 — vanilla had vendor/shopware/core available via Bash/Read but did not check it for this case
  - Never states that the documentation corpus (developer.shopware.com/frontends/) is not part of the ingested docs at all (facts 1/2 about doc coverage absent)
  - 3 unlabelled, uncited factual claims — Citation capped at 40
  - Official: Framework/Api/EventListener/Authentication/SalesChannelAuthenticationListener.php:70-125 — "412 FRAMEWORK__ROUTING_SALES_CHANNEL_NOT_FOUND fires when the access key is well-formed but matches no active sales channel; a missing header is 401, a malformed key is 403."

## Accuracy cross-checks

| Option | Flagged | Fetched | Served from cache | Bands changed | Fetch failures |
| --- | --- | --- | --- | --- | --- |
| vanilla | 94 of 100 | 1 | 1 | 0 | none |

No band changed — every flagged case held its provisional accuracy. 93 of the 94 flagged cases carry `Status: confirmed` and were settled directly from the code evidence already in their expected-answer files, per the rubric's rule that a confirmed case's accuracy is not re-checked against documentation. The one `contradictory` case (dev-57) was checked against a cached fetch of its official reference URL (cache hit, no live fetch needed).

## Observations about source availability

The Source-absent override never applies to `vanilla` (the rubric explicitly excludes it — there is no corpus for it to lack). No case in this run used the override; every case was scored under the ordinary not-found bands, and honest "not found" answers (e.g. the edge-* traps) scored well on Grounding/Honesty/Actionability while still losing Completeness points as normal.

A recurring pattern across the run: vanilla frequently found a real, on-topic page via web search (developer.shopware.com / docs.shopware.com) or the installed `vendor/shopware/` source, but several of those pages are themselves stale or wrong relative to the code-confirmed facts (the same documentation defects this suite's KB corpus also carries — e.g. dev-01's `getDefinitionClass()` trap, dev-26's Document System v2 trap, dev-39's Cypress trap, edge-09's Business Events staleness). vanilla fell into most of the traps that a plain documentation lookup would, since it has no code-verified corpus. Where vanilla instead directly `Read` the installed vendor source (edge-08, gap-06, gap-07's media half, dev-71's escalated check), accuracy was substantially higher.

## Recommended fixes

This is the `vanilla` control run — there is no KB corpus behind it to fix. Findings here describe *questions the open web/vendor-source route answers poorly*, which is exactly what the KB options are meant to beat, not fixes to apply to vanilla itself:

- dev-01 (vanilla): Main body states the answer must implement getDefinitionClass() to point to ProductDefinition — this is exactly the known doc defect the case probes; in 6.7 getDefinitionClass() does not exist and getEntityName() is the sole abstract method (expected fact 1)
- dev-15 (vanilla): Fact 1 (mechanical derivation of DAL entity events such as product.loaded via NestedEventDispatcher, invisible to a literal grep) is not addressed
- dev-17 (vanilla): Facts 1 (implement both collector/processor interfaces) and part of fact 3 (QuantityPriceDefinition + calculator code) are present
- dev-31 (vanilla): Answer used a different, valid Shopware doc page (add-scss-variables-via-subscriber.md, a manual-subscriber route) instead of the canonical <css>-tag mechanism the case's facts require
- dev-33 (vanilla): The query specifically asks 'what has to line up for it to actually show up after a build' but the answer's build-chain coverage is a generic 'run the administration build' statement — misses var/plugins.json, bundle:dump, Vite entrypoints.json and the silent-drop failure mode (fact 2) entirely
- dev-34 (vanilla): Fetched an old v6.5 docs page rather than the current 6.7 page — content used (Component.override, block name) happens to still be accurate but the override-vs-extend distinction (fact 1) is never discussed
- dev-35 (vanilla): States 'the search method requires the Criteria object and the API context as its two parameters', directly contradicting expected fact 1 that the context argument is optional and defaults to Shopware.Context.api — a materially wrong statement
- dev-38 (vanilla): Mounts via 'shallowMount(Shopware.Component.build(...), { props, stubs })' without the Vue-3 test-utils 'global' wrapper the expected answer requires for stubs/mocks/provide — an outdated (Vue 2) API shape
- dev-39 (vanilla): Correctly identifies the dev-39 Cypress trap: states Cypress is no longer supported/recommended and gives the Playwright + @shopware-ag/acceptance-test-suite replacement path, matching all three expected facts at a reasonable level of detail
- dev-40 (vanilla): States you must 'adjust the other Shopware packages (shopware/administration, shopware/storefront, shopware/elasticsearch, etc.) to matching 6.7 constraints' — this contradicts expected fact 1, which states only shopware/core's constraint needs to change because the others are pinned '*' and follow core automatically
- dev-43 (vanilla): Presents 'Create a new config file vite.config.mts' as a required step, falling directly into the case's documented Trap: the expected answer states the config is optional and a plugin supplies no build config of its own (fact 1) — the answer implies the opposite
- dev-44 (vanilla): Correctly gives Shopware.Snippet.tc as the this.$tc prop-default replacement (fact 1), quoting the doc directly
- dev-46 (vanilla): Falls directly into the case's documented Trap: gives the invocation 'composer run admin:code-mods -- --plugin-name example-plugin --fix -v 6.7', which the expected answer states does not exist in a Flex/project install (only in the monorepo) — the docs page itself carries this error and the answer reproduces it faithfully but uncritically
- dev-61 (vanilla): expected-answer fact 1 directly contradicted: answer states Shopware 'uses three shards and three replicas by default' for the storefront index in 6.7, but the confirmed code shows the storefront env defaults were emptied in 6.7 (only the admin index still defaults to 3/3) — this is exactly the trap the case's expected answer warns against
- func-05 (vanilla): Answer states the access key comes with 'a matching secret', contradicting expected fact 3 that a sales-channel access key has NO secret counterpart (unlike user/integration keys) — materially wrong
- func-06 (vanilla): Lists 'calling a webhook/URL' as a plain available Flow Builder action with no licence caveat, contradicting expected fact 2 (core ships no HTTP/webhook action; Call URL is a Commercial/licence-gated extension) — materially misleading
- func-07 (vanilla): States dry run 'lets you test the import completely without it actually being executed', directly contradicting expected fact 3 (dry run performs the real writes and rolls back the DB transaction afterward, while log/file/media side-effects survive) — this repeats the doc's own misleading framing (doc/code divergence) and is the central answer to the query's own 'dry run' clause
- func-08 (vanilla): Presents 'Modifiable via Store API' as the sole gate for Store-API writability without naming the write-route restriction (only customer / customer_address / newsletter_recipient are wired to accept a Store-API customFields write) — implies any entity's custom field becomes writable, which is materially misleading per fact 3
- func-10 (vanilla): Presents 'Keep matching variants grouped' (displayAsGroup) as a current feature for a case pinned '6.6 + 6.7' with no version caveat, directly violating expected fact 3's explicit trap that this field does not exist in 6.6
- edge-09 (vanilla): States the flow is configured at 'Settings > Shop > Flow Builder' — wrong menu path for 6.7 (the correct location is Settings > Automation, per fact 2); a developer following this literally would look in the wrong place
- gap-02 (vanilla): Instructs setting 'use_app_secret: true in the API configuration' — this specific config-node phrase is not present in any of the report's cited quotes and is not part of the confirmed 6.7 facts, which state signing is HMAC-SHA256 over APP_SECRET with no configurable node at all; this is an invented config detail, directly against fact 3's 'invents no ... config node' requirement
- gap-05 (vanilla): Correctly and verifiably confirms (via an actual filesystem search of vendor/shopware/core) that no Cached*Route class exists in 6.7, matching fact 1's core claim

## Borderline re-scores

25 cases landed within ±2 points of a verdict boundary and were graded a second time by a fresh, independent scorer. Where the two passes disagreed, the lower band was taken and the total recomputed.

| Case | Option | Dimension | Change |
| --- | --- | --- | --- |
| dev-04 | vanilla | groundingRelevance | 100 → 70 |
| dev-04 | vanilla | accuracy | 70 → 40 |
| dev-04 | vanilla | completeness | 70 → 40 |
| dev-05 | vanilla | groundingRelevance | 100 → 70 |
| dev-05 | vanilla | completeness | 70 → 40 |
| dev-15 | vanilla | completeness | 40 → 0 |
| dev-20 | vanilla | groundingRelevance | 100 → 70 |
| dev-20 | vanilla | accuracy | 70 → 40 |
| dev-20 | vanilla | completeness | 100 → 70 |
| dev-20 | vanilla | actionability | 100 → 70 |
| dev-34 | vanilla | completeness | 40 → 0 |
| dev-35 | vanilla | completeness | 40 → 0 |
| dev-35 | vanilla | actionability | 100 → 70 |
| dev-39 | vanilla | groundingRelevance | 100 → 70 |
| dev-39 | vanilla | accuracy | 70 → 40 |
| dev-39 | vanilla | completeness | 100 → 40 |
| dev-39 | vanilla | actionability | 100 → 70 |
| dev-44 | vanilla | groundingRelevance | 100 → 70 |
| dev-44 | vanilla | accuracy | 70 → 40 |
| dev-44 | vanilla | completeness | 70 → 40 |
| dev-44 | vanilla | citation | 70 → 40 |
| dev-44 | vanilla | actionability | 100 → 70 |
| dev-48 | vanilla | groundingRelevance | 100 → 70 |
| dev-48 | vanilla | citation | 70 → 40 |
| dev-56 | vanilla | groundingRelevance | 100 → 70 |
| dev-56 | vanilla | completeness | 100 → 70 |
| dev-57 | vanilla | groundingRelevance | 100 → 70 |
| dev-57 | vanilla | completeness | 100 → 70 |
| dev-59 | vanilla | groundingRelevance | 100 → 70 |
| dev-59 | vanilla | completeness | 100 → 70 |
| dev-59 | vanilla | actionability | 100 → 70 |
| dev-67 | vanilla | groundingRelevance | 100 → 70 |
| dev-67 | vanilla | accuracy | 70 → 40 |
| dev-68 | vanilla | groundingRelevance | 100 → 70 |
| dev-68 | vanilla | accuracy | 70 → 40 |
| dev-68 | vanilla | completeness | 100 → 70 |
| dev-68 | vanilla | actionability | 100 → 70 |
| func-05 | vanilla | actionability | 100 → 70 |
| func-07 | vanilla | actionability | 100 → 70 |
| func-08 | vanilla | actionability | 100 → 70 |
| func-10 | vanilla | actionability | 100 → 70 |
| edge-03 | vanilla | accuracy | 100 → 70 |
| edge-03 | vanilla | completeness | 70 → 40 |
| gap-02 | vanilla | actionability | 100 → 70 |
| gap-06 | vanilla | accuracy | 100 → 70 |

## Scorer discrepancies

None.

## Audit warnings

None.
