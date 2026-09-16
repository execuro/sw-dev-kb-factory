---
id: platform/dev/6.6/resources/guidelines/code/pageloader.md
title: Page Loader
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/guidelines/code/pageloader.html"
sourceHash: "c81e1bd5301205c77f14502289431e79c665fa43"
keywords: ["page loader", "PageLoaded event", "decoration pattern", "Page class", "store api", "storefront domains", "abstract class", "page object"]
summary: "Page loaders sit per Storefront domain, derive from an abstract class, fire PageLoaded, and load data only via the Store API, not repositories."
lastBuilt: "2026-09-15"
relatedPages:
  - "platform/dev/6.6/resources/references/adr/2020-11-25-decoration-pattern.md"
---
## What it is
Coding guideline for Storefront page loaders: how they must be structured and which data-access rules they follow.

## Key steps / config
- Page loaders must be divided into appropriate domains that represent the different sections of the Storefront, e.g. "products", "account".
- Each page loader must have an abstract class from which it derives (see the [decoration pattern](platform/dev/6.6/resources/references/adr/2020-11-25-decoration-pattern.md)); this pattern can be used to completely replace the page loader in a project.
- Each page loader has a page object to return, containing all necessary information for the page.
- At the end of each page loader, an individual `PageLoaded` event is thrown so third-party developers can provide further data.
- Page loaders are not allowed to work directly with repositories; they may only load data via the Store API, so all storefront functionality can also be accessed via the Store API.
- A page object must always extend the base `\Shopware\Storefront\Page\Page` class.

## Essential identifiers
- `PageLoaded` event
- `\Shopware\Storefront\Page\Page`
