---
id: platform/hubs/shopping-experiences.md
title: "Shopping Experiences"
summary: "Shopping Experiences CMS hub: page tree, custom blocks and elements for plugins and apps, ADRs, and merchant layout guides."
keywords: ["shopping experiences", "cms", "cms block", "cms element", "page builder", "layouts", "cms.xml", "registerCmsBlock", "registerCmsElement", "element resolver", "cms_page", "einkaufswelten"]
members: ["platform/dev/6.6/concepts/commerce/content/_index.md", "platform/dev/6.6/concepts/commerce/content/shopping-experiences-cms.md", "platform/dev/6.6/guides/plugins/plugins/content/cms/add-cms-block.md", "platform/dev/6.6/products/community-edition.md", "platform/dev/6.6/resources/references/adr/2022-07-19-blog-concept.md", "platform/dev/6.7/concepts/commerce/content/_index.md", "platform/dev/6.7/concepts/commerce/content/shopping-experiences-cms.md", "platform/dev/6.7/guides/plugins/apps/administration/add-cms-element-via-admin-sdk.md", "platform/dev/6.7/guides/plugins/apps/content/_index.md", "platform/dev/6.7/guides/plugins/apps/content/cms/_index.md", "platform/dev/6.7/guides/plugins/apps/content/cms/add-custom-cms-blocks.md", "platform/dev/6.7/guides/plugins/plugins/content/_index.md", "platform/dev/6.7/guides/plugins/plugins/content/cms/_index.md", "platform/dev/6.7/guides/plugins/plugins/content/cms/add-cms-block.md", "platform/dev/6.7/guides/plugins/plugins/content/cms/add-cms-element.md", "platform/dev/6.7/resources/references/adr/2022-04-06-add-default-cms-layouts-to-products-and-categories.md", "platform/dev/6.7/resources/references/adr/2022-07-19-blog-concept.md", "platform/dev/6.7/resources/references/adr/2022-10-17-hide-and-show-cms-content.md", "platform/dev/6.7/resources/references/app-reference/cms-reference.md", "platform/func/content/ShoppingExperiences.md", "platform/func/extensions/immersive-elements.md", "platform/func/features/3d-viewer-for-shoppingexperiences.md", "platform/func/features/publisher.md", "platform/func/migration-en/magento-firststeps.md", "platform/func/migration-en/magento-keywords.md", "platform/func/migration-en/what-is-migrated.md", "platform/func/saas/getting-started-with-saas.md", "platform/func/settings/Newsletter-configuration.md", "platform/func/settings/custom-fields.md", "platform/func/tutorials-and-faq/basic-setup.md", "platform/func/tutorials-and-faq/how-to-design-my-homepage.md", "platform/func/tutorials-and-faq/product-representation-in-categories.md", "platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/Dutch.md", "platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/English.md", "platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/Irish.md", "platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/Italian.md", "platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/Polish.md", "platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/Swiss.md", "platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/language-pack.md", "platform/func/tutorials-and-faq/shopware-video-guide.md", "platform/func/tutorials-und-faq/general-information/onboarding.md"]
lastBuilt: 2026-10-21
---

Shopping Experiences is Shopware's CMS: layouts are built in the Administration Page Builder as a tree of page, sections, blocks, slots and elements, and resolvers hydrate dynamic content at runtime. Come here for how the CMS is modelled, how plugins and apps add blocks and elements, the design decisions (ADRs) behind layouts, and the merchant-facing guides. Pages that only mention Shopping Experiences in passing (migration, setup, language guides) are listed last.

## Developer: 6.7

Concepts
- [Content](platform/dev/6.7/concepts/commerce/content/_index.md) — Shopping Experiences layouts and cookie consent management.
- [Shopping Experiences (CMS)](platform/dev/6.7/concepts/commerce/content/shopping-experiences-cms.md) — page tree, SalesChannelCmsPageLoader pipeline, CmsElementResolverInterface, events.

Plugins
- [Content](platform/dev/6.7/guides/plugins/plugins/content/_index.md) — entry point for plugin content guides (CMS, mail templates, SEO, sitemap, media).
- [CMS](platform/dev/6.7/guides/plugins/plugins/content/cms/_index.md) — overview of extending the CMS with blocks, elements and Admin SDK access.
- [Add CMS block](platform/dev/6.7/guides/plugins/plugins/content/cms/add-cms-block.md) — cmsService.registerCmsBlock and the Storefront cms-block Twig template.
- [Add CMS Elements](platform/dev/6.7/guides/plugins/plugins/content/cms/add-cms-element.md) — cmsService.registerCmsElement, config component, Twig template.

Apps
- [Content](platform/dev/6.7/guides/plugins/apps/content/_index.md) — app guides for categories, layouts and content visibility.
- [CMS](platform/dev/6.7/guides/plugins/apps/content/cms/_index.md) — extending the CMS from an app with blocks or elements.
- [Add Custom CMS Blocks](platform/dev/6.7/guides/plugins/apps/content/cms/add-custom-cms-blocks.md) — Resources/cms.xml, preview.html, styles.css, Twig template.
- [Add CMS element](platform/dev/6.7/guides/plugins/apps/administration/add-cms-element-via-admin-sdk.md) — register app CMS block and element via the Meteor Admin SDK.
- [CMS Reference](platform/dev/6.7/resources/references/app-reference/cms-reference.md) — cms.xml schema reference.

ADRs
- [Add default cms pages to products and categories](platform/dev/6.7/resources/references/adr/2022-04-06-add-default-cms-layouts-to-products-and-categories.md) — default layout system config keys.
- [Concept for blogs using Shopping Experiences](platform/dev/6.7/resources/references/adr/2022-07-19-blog-concept.md) — blogs as Custom Entities; cms-aware is disabled in 6.7.
- [Hide and show CMS content](platform/dev/6.7/resources/references/adr/2022-10-17-hide-and-show-cms-content.md) — per-device visibility field and CSS classes.

## Developer: 6.6

These four are near-duplicates of the 6.7 pages of the same name; use them for 6.6 projects.
- [Content](platform/dev/6.6/concepts/commerce/content/_index.md) — introduces Shopping Experiences and Page Builder.
- [Shopping Experiences (CMS)](platform/dev/6.6/concepts/commerce/content/shopping-experiences-cms.md) — page tree and resolvers.
- [Add CMS block](platform/dev/6.6/guides/plugins/plugins/content/cms/add-cms-block.md) — registering a custom block.
- [Concept for blogs using Shopping Experiences](platform/dev/6.6/resources/references/adr/2022-07-19-blog-concept.md) — blog ADR with cms-aware.xml (differs from 6.7 where cms-aware is disabled).
- [Community Edition](platform/dev/6.6/products/community-edition.md) — product overview that lists Shopping Experiences among core features.

## Merchant

- [ShoppingExperiences](platform/func/content/ShoppingExperiences.md) — building layouts for shop, landing, category and product pages.
- [How To Design My Homepage](platform/func/tutorials-and-faq/how-to-design-my-homepage.md) — create, assign and duplicate a listing-page layout.
- [Product Representation In Categories](platform/func/tutorials-and-faq/product-representation-in-categories.md) — product box display on category pages.
- [Basic Setup](platform/func/tutorials-and-faq/basic-setup.md) — footer and service-menu info pages via categories and layouts.
- [Publisher](platform/func/features/publisher.md) — drafts and scheduled publishing of pages.
- [3d Viewer For Shoppingexperiences](platform/func/features/3d-viewer-for-shoppingexperiences.md) — 3D Viewer block with AR/QR access.
- [Immersive Elements](platform/func/extensions/immersive-elements.md) — extension with six immersive blocks built with Instorier (Rise plan).
- [Shopware Video Guide](platform/func/tutorials-and-faq/shopware-video-guide.md) — self-hosted videos in products and CMS pages.
- [Custom Fields](platform/func/settings/custom-fields.md) — custom field sets and data mapping.
- [Newsletter Configuration](platform/func/settings/Newsletter-configuration.md) — double opt-in and registration links.

## Merchant: setup, onboarding and migration (passing mentions)

- [Onboarding](platform/func/tutorials-und-faq/general-information/onboarding.md) — installation, setup wizard, catalog.
- [Getting Started With Saas](platform/func/saas/getting-started-with-saas.md) — SaaS dashboard checklist.
- [What Is Migrated](platform/func/migration-en/what-is-migrated.md) — Shopware 5 to 6 migration scope.
- [Magento Firststeps](platform/func/migration-en/magento-firststeps.md) — Magento migration first steps.
- [Magento Keywords](platform/func/migration-en/magento-keywords.md) — Magento-to-Shopware terminology.

Language-specific store setup (each covers sales channel, domain, tax rate, footer and landing pages):
- [Dutch](platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/Dutch.md), [English](platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/English.md), [Irish](platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/Irish.md), [Italian](platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/Italian.md), [Polish](platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/Polish.md), [Swiss](platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/Swiss.md)
- [Language Pack](platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/language-pack.md) — Dutch store via the unified language pack extension.
