---
id: platform/hubs/shopping-experiences.md
title: "Shopping Experiences"
summary: "Shopware's CMS/Page Builder: layout concepts, extending CMS blocks/elements from plugins and apps, and merchant-facing setup guides."
keywords: ["shopping experiences", "cms", "page builder", "cms block", "cms element", "cmsservice", "registercmsblock", "registercmselement", "layout", "storefront", "app cms", "custom entities", "migration", "onboarding"]
members: ["platform/dev/6.6/concepts/commerce/content/_index.md", "platform/dev/6.6/concepts/commerce/content/shopping-experiences-cms.md", "platform/dev/6.6/guides/plugins/plugins/content/cms/add-cms-block.md", "platform/dev/6.6/products/community-edition.md", "platform/dev/6.6/resources/references/adr/2022-07-19-blog-concept.md", "platform/dev/6.7/concepts/commerce/content/_index.md", "platform/dev/6.7/concepts/commerce/content/shopping-experiences-cms.md", "platform/dev/6.7/guides/development/testing/store/storefront-performance-and-errors.md", "platform/dev/6.7/guides/plugins/apps/administration/add-cms-element-via-admin-sdk.md", "platform/dev/6.7/guides/plugins/apps/content/_index.md", "platform/dev/6.7/guides/plugins/apps/content/cms/_index.md", "platform/dev/6.7/guides/plugins/apps/content/cms/add-custom-cms-blocks.md", "platform/dev/6.7/guides/plugins/plugins/content/_index.md", "platform/dev/6.7/guides/plugins/plugins/content/cms/_index.md", "platform/dev/6.7/guides/plugins/plugins/content/cms/add-cms-block.md", "platform/dev/6.7/guides/plugins/plugins/content/cms/add-cms-element.md", "platform/dev/6.7/resources/references/adr/2022-04-06-add-default-cms-layouts-to-products-and-categories.md", "platform/dev/6.7/resources/references/adr/2022-07-19-blog-concept.md", "platform/dev/6.7/resources/references/adr/2022-10-17-hide-and-show-cms-content.md", "platform/dev/6.7/resources/references/app-reference/cms-reference.md", "platform/func/content/ShoppingExperiences.md", "platform/func/extensions/immersive-elements.md", "platform/func/features/3d-viewer-for-shoppingexperiences.md", "platform/func/features/publisher.md", "platform/func/migration-en/magento-firststeps.md", "platform/func/migration-en/magento-keywords.md", "platform/func/migration-en/what-is-migrated.md", "platform/func/saas/getting-started-with-saas.md", "platform/func/settings/Newsletter-configuration.md", "platform/func/settings/custom-fields.md", "platform/func/tutorials-and-faq/basic-setup.md", "platform/func/tutorials-and-faq/how-to-design-my-homepage.md", "platform/func/tutorials-and-faq/product-representation-in-categories.md", "platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/Dutch.md", "platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/English.md", "platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/Irish.md", "platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/Italian.md", "platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/Polish.md", "platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/Swiss.md", "platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/language-pack.md", "platform/func/tutorials-and-faq/shopware-video-guide.md", "platform/func/tutorials-und-faq/general-information/onboarding.md"]
lastBuilt: 2026-09-15
---

Shopping Experiences is Shopware's content management system: pages are built from a tree of
sections, blocks, slots and elements in the Admin "Page Builder", with element resolvers
hydrating dynamic content at request time. Come here instead of grepping directly when you
need to place, extend, or reason about a CMS layout — as a plugin/app author registering a
custom block or element, or as an operator configuring merchant-facing pages, layouts and
localisation.

## Developer — concepts and core mechanics

- [Content](platform/dev/6.6/concepts/commerce/content/_index.md) — 6.6 concepts overview of Shopping Experiences and the Page Builder in the Admin panel.
- [Shopping Experiences (CMS)](platform/dev/6.6/concepts/commerce/content/shopping-experiences-cms.md) — 6.6 page tree (sections/blocks/slots/elements) and resolver hydration.
- [Content](platform/dev/6.7/concepts/commerce/content/_index.md) — 6.7 equivalent of the concepts overview; also covers cookie consent (`CookieGroupCollectEvent`) alongside CMS.
- [Shopping Experiences (CMS)](platform/dev/6.7/concepts/commerce/content/shopping-experiences-cms.md) — 6.7 equivalent CMS tree concept, naming `SalesChannelCmsPageLoader`, `CmsElementResolverInterface`, `CmsSlotsDataResolver`, `CmsPageLoaderCriteriaEvent`, `CmsPageLoadedEvent`. Near-duplicate of the 6.6 CMS concept page above, updated with 6.7 class names.
- [Community Edition](platform/dev/6.6/products/community-edition.md) — where Shopping Experiences sits among the other Symfony-bundle components (Admin/Store API, DAL, rule builder).

## Developer — extending CMS blocks and elements (plugins)

- [Add CMS block](platform/dev/6.6/guides/plugins/plugins/content/cms/add-cms-block.md) — 6.6 guide: `cmsService.registerCmsBlock`, Vue component/preview, Storefront Twig template.
- [Content](platform/dev/6.7/guides/plugins/plugins/content/_index.md) — 6.7 plugin-guide overview covering CMS, mail templates, SEO, sitemap and media plugin guides.
- [CMS](platform/dev/6.7/guides/plugins/plugins/content/cms/_index.md) — 6.7 overview of the plugin CMS guides (blocks and elements built from reusable content).
- [Add CMS block](platform/dev/6.7/guides/plugins/plugins/content/cms/add-cms-block.md) — 6.7 version of the same `registerCmsBlock` guide as above, using `block.slots.getSlot`/`sw_include` and the `cms-section-block-container.html.twig` template; near-duplicate of the 6.6 add-cms-block guide with updated details.
- [Add CMS Elements](platform/dev/6.7/guides/plugins/plugins/content/cms/add-cms-element.md) — `cmsService.registerCmsElement`, the `cms-element` mixin, and the `cms-element-` Storefront template naming convention.

## Developer — extending CMS blocks and elements (apps)

- [Content](platform/dev/6.7/guides/plugins/apps/content/_index.md) — app-based content overview: assigning content to categories, building layouts, controlling visibility by rule conditions.
- [CMS](platform/dev/6.7/guides/plugins/apps/content/cms/_index.md) — overview of declaring app CMS blocks via `Resources/cms.xml`.
- [Add Custom CMS Blocks](platform/dev/6.7/guides/plugins/apps/content/cms/add-custom-cms-blocks.md) — defining blocks in `cms.xml` with `preview.html`, `styles.css` and a Storefront Twig template, auto-registered on install.
- [Add CMS element](platform/dev/6.7/guides/plugins/apps/administration/add-cms-element-via-admin-sdk.md) — registering a CMS block/element from an app via `@shopware-ag/meteor-admin-sdk` (`cms.registerCmsElement`, `cms.registerCmsBlock`, iframe `location.*` APIs).
- [CMS Reference](platform/dev/6.7/resources/references/app-reference/cms-reference.md) — `Resources/cms.xml` schema reference: block name/category/labels, slots, `config-value`, `default-config`.

## Developer — ADRs and store review

- [Concept for blogs using Shopping Experiences](platform/dev/6.6/resources/references/adr/2022-07-19-blog-concept.md) — 6.6 ADR: blogs implemented as Custom Entities with `admin-ui.xml`/`cms-aware.xml`.
- [Concept for blogs using Shopping Experiences](platform/dev/6.7/resources/references/adr/2022-07-19-blog-concept.md) — 6.7 version of the same ADR; notes the `cms-aware` flag is disabled in 6.7 code. Near-duplicate of the 6.6 ADR above.
- [Add default cms pages to products and categories](platform/dev/6.7/resources/references/adr/2022-04-06-add-default-cms-layouts-to-products-and-categories.md) — ADR on default-layout system config (`core.cms.default_product_cms_page`, `core.cms.default_category_cms_page`).
- [Hide and show CMS content](platform/dev/6.7/resources/references/adr/2022-10-17-hide-and-show-cms-content.md) — ADR on per-viewport visibility JSON for `cms_section`/`cms_block`, edited via `sw-cms-visibility-config`.
- [Storefront, performance, and errors](platform/dev/6.7/guides/development/testing/store/storefront-performance-and-errors.md) — Store review rules for Storefront extensions touching Shopping Experiences pages (responsive, no inline CSS, Lighthouse, console errors).

## Merchant — feature and settings docs

- [ShoppingExperiences](platform/func/content/ShoppingExperiences.md) — merchant-facing overview of building layouts (sections/blocks/elements) for shop, landing, category and product pages.
- [Immersive Elements extension](platform/func/extensions/immersive-elements.md) — third-party extension adding six 3D/immersive Shopping Experiences blocks (galleries, Exploded View, 3D Model Journey, VR Cinema), built with Instorier.
- [3d Viewer For Shoppingexperiences](platform/func/features/3d-viewer-for-shoppingexperiences.md) — 3D Viewer block for placing interactive 3D objects and AR/QR access anywhere in Shopping Experiences.
- [Publisher](platform/func/features/publisher.md) — drafting, saving and scheduling Shopping Experiences page publication with an activity feed.
- [Basic Setup](platform/func/tutorials-and-faq/basic-setup.md) — building footer/service-menu info pages (imprint, privacy, T&C) via categories and Shopping Experiences.
- [How To Design My Homepage](platform/func/tutorials-and-faq/how-to-design-my-homepage.md) — creating a listing-page layout, adding blocks/elements, and assigning/duplicating it for a category.
- [Product Representation In Categories](platform/func/tutorials-and-faq/product-representation-in-categories.md) — how product-box display on category pages is controlled by product-list settings and the Shopping Experiences layout.
- [Custom Fields](platform/func/settings/custom-fields.md) — custom field sets/types, including their exposure in Shopping Experiences and the Store API.
- [Newsletter Configuration](platform/func/settings/Newsletter-configuration.md) — newsletter double opt-in and recipient settings, referenced from Shopping Experiences newsletter elements.
- [Getting Started With Saas](platform/func/saas/getting-started-with-saas.md) — SaaS onboarding checklist including the Shopping Experiences/theme setup step.
- [Shopware Video Guide](platform/func/tutorials-and-faq/shopware-video-guide.md) — uploading and using self-hosted videos in products and CMS pages via the Media Manager.
- [Onboarding](platform/func/tutorials-und-faq/general-information/onboarding.md) — companion onboarding doc covering the setup wizard, catalog and Shopping Experiences steps.

## Merchant — migration

- [Magento Firststeps](platform/func/migration-en/magento-firststeps.md) — first-steps guide for migrating a Magento shop, including Shopping Experiences-related manual review points.
- [Magento Keywords](platform/func/migration-en/magento-keywords.md) — Magento-to-Shopware terminology dictionary, including Shopping Experiences mapping.
- [What Is Migrated](platform/func/migration-en/what-is-migrated.md) — what migrates automatically from Shopware 5 to 6 versus what needs manual mapping.

## Merchant — non-default-language store setup

Each guide below sets up a store in a different locale, covering sales-channel defaults,
domain, tax rate, footer/landing pages and demo-data translation, including the
Shopping-Experiences-built landing/footer pages:

- [Dutch](platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/Dutch.md) — Netherlands, Dutch.
- [English](platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/English.md) — United Kingdom, English.
- [Irish](platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/Irish.md) — Ireland, English.
- [Italian](platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/Italian.md) — Italy, Italian.
- [Polish](platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/Polish.md) — Poland, Polish.
- [Swiss](platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/Swiss.md) — Switzerland, German and French.
- [Language Pack](platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/language-pack.md) — Netherlands/Dutch setup using the unified Shopware language pack extension.
