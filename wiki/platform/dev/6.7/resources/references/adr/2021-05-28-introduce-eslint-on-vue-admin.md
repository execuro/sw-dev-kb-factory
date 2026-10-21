---
id: platform/dev/6.7/resources/references/adr/2021-05-28-introduce-eslint-on-vue-admin.md
title: Vue administration app has ESLint support
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2021-05-28-introduce-eslint-on-vue-admin.html
sourceHash: 642998310b07c58c8aab4f507964d9f6b7cf6e7c
codeCheckedAgainst: "6.7.15.1"
keywords: ["eslint", "linting", "administration", "vue", "eslint-twig-vue-plugin", "*.html.twig", "twig block indentation", "self-closing components", "attribute alignment", "eslint-disable", "eslint.additional.file.extensions", "phpstorm", "vscode", "adr"]
summary: "ADR: ESLint for the Vue administration; JS rule deviations, twig-to-HTML-comment template linting, indentation and attribute rules, IDE setup."
lastBuilt: 2026-10-21
---
## What it is

Architecture decision record (2021-05-28, area administration) introducing ESLint for the Vue-based Administration, for both `*.js` files and `*.html.twig` component templates, and the template-writing conventions that come with it.

## When to use

- When writing or reviewing Administration JS or Twig templates in core or in a plugin and the linter complains.
- When setting up PHPStorm or VSCode to lint Administration templates.

## Key steps / config

**`*.js` linting** follows standard Vue CLI linting with these adjustments:

- `'vue/require-prop-types': 'error'` — always type `props`
- `'vue/require-default-prop': 'error'` — default for optional `props`
- `'vue/no-mutating-props': ['off']` — tradeoff, mutation is already widely used
- `'vue/component-definition-name-casing': ['error', 'kebab-case']`

**`*.spec.js`**: no `max-len` warning in unit tests (long test names and selectors).

**`*.html.twig` linting**: all Twig syntax is converted to HTML comments during linting, so templates are linted like Vue templates. Tradeoff: Twig blocks do not count for indentation. Exceptions:

- `'vue/component-name-in-template-casing': ['error', 'kebab-case']`
- `'vue/no-multiple-template-root': 'off'`, `'vue/valid-template-root': 'off'` — external templates, inheritance
- `'vue/attribute-hyphenation': 'error'` — `hello-word=""`, not `helloWorld=""`
- `'vue/no-parsing-error': ['error', {'nested-comment': false}]`
- `'vue/valid-v-slot': ['error', { allowModifiers: true }]` — `.` in slot names
- `'vue/no-unused-vars': 'off'`, `'vue/no-template-shadow': 'off'`, `'vue/no-lone-template': 'off'`, `'vue/no-v-html': 'off'`

Template conventions enforced by the custom `eslint-twig-vue-plugin` processor:

```html
<div>
    {% block block_name %}
    <div>
        <sw-language-switch />
        <sw-icon
            small
            name="default-basic-shape-circle-filled"
        />
```

- Content inside a `{% block %}` is not indented further than the block tag.
- Components without content are self-closing.
- With more than one attribute, each attribute goes on its own line.

**Disabling a rule in a template**: put an HTML comment with `eslint-disable <rule>` (or `eslint-disable-next-line <rule>`) in front of the element. Follow "know the rules, break the rules", not "don't bug me linter".

**IDE setup**: `*.js` linting works out of the box in PHPStorm and VSCode. For Twig, VSCode works via the repository's `.vscode/settings.json`; in PHPStorm add `html,twig` to `eslint.additional.file.extensions` in the Registry (Help > Find Action..., "registry") and restart. ESLint runs in CI, so a working setup is mandatory.

## Essential identifiers

- `eslint-twig-vue-plugin` (twig-vue processor)
- `eslint.additional.file.extensions` (PHPStorm registry key)
- `eslint-disable`, `eslint-disable-next-line` template comments

## Gotchas

- A heavily red file usually means broken Twig syntax, error `invalid-x-end-tag`: write `{% block block_name %}` with a space before `%}`, never `{% block block_name%}`. Some installed 6.7 templates still contain the no-space form.
- The ADR's example component `sw-language-switcher` is not present in the 6.7 Administration source; the language switch component is `sw-language-switch`.

## Code check (6.7.15.1)
- confirmed `sw-language-switch` — used self-closing in a template — vendor/shopware/administration/Resources/app/administration/src/module/sw-settings-customer-group/page/sw-settings-customer-group-list/sw-settings-customer-group-list.html.twig:43
- confirmed `eslint-disable` — rule-disable HTML comment in a template — vendor/shopware/administration/Resources/app/administration/src/module/sw-product-stream/component/sw-product-stream-value/sw-product-stream-value.html.twig:444
- confirmed `eslint-disable-next-line` — next-line disable comment in a template — vendor/shopware/administration/Resources/app/administration/src/module/sw-settings-tag/page/sw-settings-tag-list/sw-settings-tag-list.html.twig:185
- unverified `sw-language-switcher` — not found in administration src; full index not searched
- unverified `vue/require-prop-types` — ESLint config lives outside the administration src root, out of scope
- unverified `eslint-twig-vue-plugin` — plugin lives in twigVuePlugin outside the administration src root, out of scope
- unverified `eslint.additional.file.extensions` — PHPStorm setting, not in Shopware code
