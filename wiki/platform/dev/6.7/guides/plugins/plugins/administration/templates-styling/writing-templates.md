---
id: platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/writing-templates.md
title: Writing templates
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/templates-styling/writing-templates.html
sourceHash: ca46e3e86d46950c4cadf6b43b336f7743c3c2d6
codeCheckedAgainst: "6.7.15.1"
keywords: ["twig", "twigjs", "template", "sw-page", "twig block", "Shopware.Component.register", "metaInfo", "$createTitle", "vue template", "sw-block", "administration", "extendability", "html.twig"]
summary: Administration templates as TwigJS .html.twig files with sw-page and twig blocks, assigned to a component's template property.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/add-custom-styles.md", "platform/dev/6.7/guides/plugins/plugins/administration/advanced-configuration/add-shortcuts.md", "platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/api-reference/block-components/sw-block.md"]
---
## What it is

How Administration component templates are written and attached: a separate TwigJS `.html.twig` file in the component directory, wrapped in twig blocks for extendability, imported and assigned to the component's `template` property. The Administration combines twig (extension) with Vue (reactive data binding).

## When to use

You are writing a new Administration page/component for a plugin module and need its markup to be extendable by other plugins.

## Key steps / config

1. Create the template file named after the component (e.g. `swag-basic-example.html.twig`). Module pages should start with `sw-page` (search bar, page header and a `content` slot); wrap content in twig blocks:

```html
{% block swag_basic_example_page %}
    <sw-page class="swag-example-list">
    </sw-page>
{% endblock %}
```

2. Import the file and assign it to `template`; optionally set the page title with `metaInfo()`:

```javascript
import template from './swag-basic-example.html.twig';

Shopware.Component.register('swag-basic-example', {
    template,
    metaInfo() {
        return { title: this.$createTitle() };
    },
});
```

`this.$createTitle()` builds the title from the admin base title and the current route's module title.

## Essential identifiers

- `Shopware.Component.register`, component property `template`
- `sw-page` with slots `content` and `search-bar`
- `metaInfo()`, `this.$createTitle()`
- `{% block ... %}` / `{% endblock %}` (TwigJS blocks)

## Gotchas

- Twig is for **extending**: overriding a twig block hooks your own markup in, but an override applies to every occurrence of that template.
- Vue links data and DOM reactively; twig blocks are the extension points.
- The source attributes `metaInfo` to vue-meta; in the installed code it is handled by Shopware's own meta-info plugin, which reads the component's `metaInfo` option.

## Version notes

- TwigJS blocks are the stable extension mechanism today. Their native successor is the [`sw-block`](platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/api-reference/block-components/sw-block.md) component of the experimental Single File Component system, documented as available since 6.7.16.0; the 6.7.15.1 code already contains `sw-block`, marked `@private`.

## Code check (6.7.15.1)
- confirmed `Shopware.Component.register` — maps to `AsyncComponentFactory.register` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:135
- confirmed `sw_page_search_bar` — sw-page block wrapping the `search-bar` slot — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-page/sw-page.html.twig:13
- confirmed `content` — sw-page `content` slot — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-page/sw-page.html.twig:158
- confirmed `$createTitle` — global property, `@private`, uses route module title — vendor/shopware/administration/Resources/app/administration/src/app/adapter/view/vue.adapter.ts:783
- corrected `metaInfo` — docs: part of vue-meta; code: Shopware meta-info plugin reads the `metaInfo` component option — vendor/shopware/administration/Resources/app/administration/src/app/plugin/meta-info.plugin.js:35
- confirmed `sw-block` — component present, marked `@private` — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-block-override/sw-block/index.ts:25
