---
id: platform/func/content/ShoppingExperiences.md
title: ShoppingExperiences
docType: functional
version: "6.7"
versions: ["6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/content/ShoppingExperiences
sourceHash: e58517fe5e96b8470090690040850bcc853ef1bfd9f7e66ac6482c2a77943fe9
revision:
  current: true
  range: "6.7.8.0 - 6.7.8.2"
  swMin: "6.7.8.0"
  swMax: "6.7.8.2"
keywords: ["Shopping Experiences", "CMS extension", "layout editor", "shop page layout", "landing page layout", "category page layout", "product page layout", "bundle page layout", "layout sections blocks elements", "AI Copilot text", "data mapping", "visibility by viewport", "default layout"]
summary: "Shopware's Shopping Experiences CMS: building layouts of sections/blocks/elements for shop pages, landing pages, category and product pages."
lastBuilt: "2026-09-15"
---
## What it is
Shopping Experiences (under **Content**) is Shopware's CMS for building content pages — landing pages, shop pages, and category/product layouts — composed of sections containing blocks, which contain elements.

## When to use
When designing a category, product, landing or shop page layout, or configuring reusable blocks (text, image, slider, gallery, commerce, video, form, HTML, 3D-model, product listing).

## Key steps / config
Overview: list of layouts, search box, Sort by (creation/editing date), Layouts filter menu, per-entry context menu (delete, duplicate, preview), **Create new Layout** button.

Creating a layout: choose a Layout Type — Shop page, Landingpage, Category page (auto-includes product listing), Product page, or Bundle page — then a Section structure (sidebar or full page width), then a Name; the layout editor then opens.

Layout Editor areas: central editing area, right-side menu with Settings, Blocks, Navigator tabs; block/section settings depending on selection; **Layout Assignment** to bind the layout to a category or landing page; `+` buttons to add sections; viewport-switch icons.

Block categories: Text (with data mapping for category/product pages, AI Copilot), Insert link (from 6.4.10.0: URL, product, category, email, phone), Image (Standard/Fill/Stretch display, alignment, link type), Slider (Original/Fixed height/Cropped display modes, arrow/dots navigation, animation duration, automatic transition, decorative images), Gallery (similar display modes plus zoom, fullscreen gallery), Commerce blocks (Product name & manufacturer logo, Three columns product boxes, Product slider, Gallery and Buybox, Product description and review, Cross Selling, Bundles), Video (Video/Youtube/Vimeo), Sidebar, Form, HTML (requires the HTML Sanitizer configured or deactivated), 3D-model (`.glb` files, commercial Rise plan), Product listing (auto-added for Category Page type), Sorting and Filter.

Block Settings: Name, Background colour, Background image, Image mode, Layout - CSS classes. Section settings: Section name, CSS classes, Sizing mode, Mobile sidebar behaviour, Background colour/image, image mode.

Visibility by viewport lets a block or section be shown/hidden per device.

Assigning a layout: via Layout Editor's Layout Assignment, via **Settings > Shop > Basic information** for shop pages, via category assignment, or via a product's Layout tab. Default layouts can be set for all new category or product pages via **Layout assignment > Default layouts > Set as default layout**.

## Essential identifiers
- `Content` (menu location)
- Layout types: Shop page, Landingpage, Category page, Product page, Bundle page
- 3D-model block format: `.glb`

## Version notes
Insert link block support for product/category/email/phone links requires Shopware 6.4.10.0 or later.
