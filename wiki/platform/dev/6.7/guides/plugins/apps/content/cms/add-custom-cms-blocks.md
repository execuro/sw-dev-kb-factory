---
id: platform/dev/6.7/guides/plugins/apps/content/cms/add-custom-cms-blocks.md
title: Add Custom CMS Blocks
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/content/cms/add-custom-cms-blocks.html
sourceHash: 416ccbb6fb2bbd1bd7957da23cc7faeba19f7501
codeCheckedAgainst: "6.7.15.1"
keywords: ["cms.xml", "cms-1.0.xsd", "preview.html", "styles.css", "default-config", "config-value", "sw_extends", "cms-block-image-text.html.twig", "custom cms block", "app cms block", "shopping experiences", "einkaufswelten"]
summary: Apps add CMS blocks via Resources/cms.xml, plus per-block preview.html and styles.css and a Storefront Twig template cms-block-<name>-component.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/content/cms/add-cms-block.md", "platform/dev/6.7/guides/plugins/apps/app-base-guide.md", "platform/dev/6.7/resources/references/app-reference/cms-reference.md"]
---
## What it is

How an app (available since 6.4.4.0) defines custom CMS blocks declaratively in `Resources/cms.xml`, instead of the plugin approach ([plugin guide](platform/dev/6.7/guides/plugins/plugins/content/cms/add-cms-block.md)), which does not work in Shopware cloud stores. App blocks are registered automatically at runtime.

## When to use

You have an app set up ([App Base Guide](platform/dev/6.7/guides/plugins/apps/app-base-guide.md)) and need a new CMS block composed of existing Shopware CMS elements.

## Key steps / config

1. Layout inside the app:

```text
Resources/cms.xml
Resources/cms/blocks/<block-name>/preview.html
Resources/cms/blocks/<block-name>/styles.css
Resources/views/storefront/block/cms-block-<block-name>-component.html.twig
Resources/app/storefront/src/scss/base.scss
```

2. Define blocks in `cms.xml` against `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/Framework/App/Cms/Schema/cms-1.0.xsd`:

```xml
<cms>
  <blocks>
    <block>
      <name>swag-image-text-reversed</name>
      <category>text-image</category>
      <label>...</label><label lang="de-DE">...</label>
      <slots>
        <slot name="left" type="text">
          <config><config-value name="vertical-align" source="static" value="top"/></config>
        </slot>
      </slots>
      <default-config><margin-top>20px</margin-top><sizing-mode>boxed</sizing-mode></default-config>
    </block>
  </blocks>
</cms>
```

   - `<name>` unique technical name; `<category>` one of `commerce`, `form`, `image`, `sidebar`, `text`, `text-image`, `video`; `<label>` translatable; `<slots>` with required `name` and `type` attributes; `<default-config>` margins and `sizing-mode` (`boxed` or `full_width`).
3. Provide both `preview.html` (pure HTML, no Twig) and `styles.css` per block directory. Preview root class pattern: `sw-cms-preview-<name>`; editor class `sw-cms-block-${block.name}-component`; each slot gets `sw-cms-slot-${slot.name}`.
4. Storefront: add `cms-block-${block.name}-component.html.twig` in `Resources/views/storefront/block/`, e.g. `{% sw_extends '@Storefront/storefront/block/cms-block-image-text.html.twig' %}`. Style it in `Resources/app/storefront/src/scss/base.scss`.

## Essential identifiers

- `Resources/cms.xml`, `cms-1.0.xsd`, `<block>`, `<slot>`, `<config-value>`, `<default-config>`
- `preview.html`, `styles.css`
- `cms-block-${block.name}-component.html.twig`, `@Storefront/storefront/block/cms-block-image-text.html.twig`

## Gotchas

- Both `preview.html` and `styles.css` must exist for every block; the installed code throws an `AppCmsExtensionException` when either file is missing.
- No templating engines or preprocessors (Twig, Sass) in the preview; it is sanitized, so script tags and attributes like `:src="assetFilter(...)"` are stripped.
- `cms.xml` blocks can only use Shopware's shipped elements (`src/module/sw-cms/elements`); for a fully custom element use the Meteor Admin SDK approach. Each element's `index.js` there shows which slot `config` it expects.
- On app update, blocks no longer in `cms.xml` are deleted.
- Full schema: [CMS reference](platform/dev/6.7/resources/references/app-reference/cms-reference.md).

## Code check (6.7.15.1)
- confirmed `Resources/cms.xml` — read on app install/update — vendor/shopware/core/Framework/App/Lifecycle/Handler/CmsBlockLifecycleHandler.php:42
- confirmed `deleteOldCmsBlocks()` — blocks removed from cms.xml are deleted on update — vendor/shopware/core/Framework/App/Lifecycle/Handler/CmsBlockLifecycleHandler.php:71
- confirmed `category` — enumeration includes text-image, commerce, form, image, sidebar, text, video — vendor/shopware/core/Framework/App/Cms/Schema/cms-1.0.xsd:31
- confirmed `slot` — name and type attributes required — vendor/shopware/core/Framework/App/Cms/Schema/cms-1.0.xsd:109
- confirmed `config-value` — name, source, value attributes required — vendor/shopware/core/Framework/App/Cms/Schema/cms-1.0.xsd:125
- confirmed `sizing-mode` — boxed or full_width — vendor/shopware/core/Framework/App/Cms/Schema/cms-1.0.xsd:81
- confirmed `preview.html` — required, missing file throws AppCmsExtensionException — vendor/shopware/core/Framework/App/Cms/BlockTemplateLoader.php:20
- confirmed `styles.css` — required, missing file throws AppCmsExtensionException — vendor/shopware/core/Framework/App/Cms/BlockTemplateLoader.php:37
- confirmed `template` — stored with AllowHtml, sanitized by default — vendor/shopware/core/Framework/App/Aggregate/CmsBlock/AppCmsBlockDefinition.php:63
- confirmed `sw-cms-slot-${this.element.slot}` — slot class pattern in the editor — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/component/sw-cms-slot/index.ts:109
