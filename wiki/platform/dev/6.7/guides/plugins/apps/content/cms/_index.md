---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/guides/plugins/apps/content/cms/_index.md
sourceHash: 116d0708e65a0322f15df8ffef5785238d6cff1e
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/content/cms/
title: CMS
version: "6.7"
versions:
  - "6.7"
keywords: ["app cms block", "cms.xml", "Resources/cms.xml", "cms-1.0.xsd", "preview.html", "styles.css", "shopping experiences", "erlebniswelten", "CmsExtensions", "CmsBlockLifecycleHandler", "custom cms block", "layout"]
summary: "Overview of adding custom CMS blocks from an app: blocks declared in Resources/cms.xml become available in the Administration layout editor after install."
lastBuilt: 2026-09-15
---
## What it is

Section overview for extending Shopware's CMS (Shopping Experiences) from an app. An app can define its own CMS blocks containing custom content such as text, images or HTML, positioned within a CMS layout as needed. Once the app is installed and activated, the blocks are available in the Administration for building layouts.

## When to use

You build an app (not a plugin) and want merchants to place app-provided CMS blocks in their layouts.

## Key steps / config

The installed code shows how app blocks are loaded (the detailed how-to lives on the child pages of this section):

1. Place `Resources/cms.xml` in the app; the lifecycle handler skips CMS registration when the file is absent. It is validated against `cms-1.0.xsd`.
2. Declare blocks — skeleton per the schema:
   ```xml
   <cms>
       <blocks>
           <block>
               <name>...</name>
               <category>text-image</category>
               <label lang="de-DE">...</label>
               <slots>
                   <slot name="..." type="...">
                       <config><config-value name="..." source="..." value="..."/></config>
                   </slot>
               </slots>
               <default-config>...</default-config>
           </block>
       </blocks>
   </cms>
   ```
3. `category` must be one of `commerce`, `form`, `image`, `sidebar`, `text`, `text-image`, `video`. Block `name` and slot `name` must be unique.
4. For each block, provide `cms/blocks/<block name>/preview.html` and `cms/blocks/<block name>/styles.css` next to `cms.xml`; a missing file raises an `AppCmsExtensionException`.
5. `default-config` accepts `margin-bottom`, `margin-top`, `margin-left`, `margin-right`, `sizing-mode` (`boxed`/`full_width`), `background-color`.

## Essential identifiers

- `Resources/cms.xml`, `cms-1.0.xsd`, `preview.html`, `styles.css`
- `Shopware\Core\Framework\App\Cms\CmsExtensions`
- `Shopware\Core\Framework\App\Lifecycle\Handler\CmsBlockLifecycleHandler`
- `Shopware\Core\Framework\App\Cms\BlockTemplateLoader`

## Code check (6.7.13.0)
- confirmed `Resources/cms.xml` — optional file read on app install/update — vendor/shopware/core/Framework/App/Lifecycle/Handler/CmsBlockLifecycleHandler.php:42
- confirmed `CmsExtensions::XSD_FILE` — validated against cms-1.0.xsd — vendor/shopware/core/Framework/App/Cms/CmsExtensions.php:16
- confirmed `category` — enumeration commerce, form, image, sidebar, text, text-image, video — vendor/shopware/core/Framework/App/Cms/Schema/cms-1.0.xsd:31
- confirmed `default-config` — required block child — vendor/shopware/core/Framework/App/Cms/Schema/cms-1.0.xsd:66
- confirmed `sizingMode` — boxed or full_width — vendor/shopware/core/Framework/App/Cms/Schema/cms-1.0.xsd:149
- confirmed `BlockTemplateLoader::getTemplateForBlock()` — reads cms/blocks/<name>/preview.html — vendor/shopware/core/Framework/App/Cms/BlockTemplateLoader.php:15
- confirmed `BlockTemplateLoader::getStylesForBlock()` — reads cms/blocks/<name>/styles.css — vendor/shopware/core/Framework/App/Cms/BlockTemplateLoader.php:32
