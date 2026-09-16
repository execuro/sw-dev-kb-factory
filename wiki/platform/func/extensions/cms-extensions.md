---
id: platform/func/extensions/cms-extensions.md
title: Cms Extensions
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/extensions/cms-extensions
sourceHash: b21a22b538080fce6ba11f1ffd3df49cc1f16d81f787bc7784147b85ee0416a7
revision:
  current: true
  range: "1.8.0 - 2.1.0"
  swMax: "2.1.0"
  swMin: "1.8.0"
keywords: ["CMS Extensions", "Quickview", "Scroll Navigation", "rule builder", "form block", "shopping experience", "block visibility", "animated scrolling", "Evolve plan", "Content > shopping experience"]
summary: "Evolve-plan extension adding product Quickview, anchored Scroll Navigation, rule-builder block visibility, and custom forms to Shopping Experiences."
lastBuilt: "2026-09-15"
---

## What it is

CMS Extensions is a Shopware Evolve-plan extension adding Quickview, Scroll Navigation, rule-builder-based block visibility, and individual/custom forms to Shopping Experiences (CMS pages).

## When to use

When merchants need a product quickview in listings or search results, an anchored scroll-navigation menu for long shopping-experience pages, conditional block visibility, or custom lead-generation forms in the CMS.

## Key steps / config

- Install via **Extensions > My Extensions**; activate with the button to the left of the extension.
- **Quickview**: enable per element for the "Three Columns, Product Boxes", "Product Slider", and "Cross Selling" commerce-type elements via item behavior settings in the shopping-experience editor; applies wherever that shopping experience is assigned.
- **Quickview in search results**: activated separately in the extension's own configuration (three-dot menu on the extension entry).
- **Scroll Navigation**: enable per section via a new "Scroll Navigation" block in section settings, set a name; supports animated scrolling with configurable behaviour (e.g. constant/linear, elastic) and animation duration/course curve. Navigation points can also be opened via a URL parameter (e.g. a fragment like `#lorem%20ipsum`).
- **Define visibility of individual blocks**: uses rule builder rules (Settings > Rules) per block, with an option to invert the result ("Visible, if rule does not apply").
- **Individual forms**: add via **Content > shopping experience**, add a block, choose category **form**, then use an existing template or build a new one. Options tab: internal name, headline, confirmation text, recipient address(es), e-mail template. Fields tab: grouped fields of type Text, E-mail, Number, Selection (checkbox), Selection list, Image upload/Picture selection, Text area, HTML editor — each with name, title, type, width, required flag, and error message.

## Essential identifiers

Quickview, Scroll Navigation, rule builder, form block, Content > shopping experience

## Gotchas

- Sections smaller than the screen can cause inaccurate scroll-navigation jumps; sections should fill at least the viewport.
- The course-curve setting for scroll animation has no effect with the constant (linear) or active elastic scroll behaviour.
