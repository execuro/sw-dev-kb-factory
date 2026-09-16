---
id: platform/dev/6.7/resources/references/adr/2021-05-28-introduce-eslint-on-vue-admin.md
title: Vue administration app has ESLint support
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2021-05-28-introduce-eslint-on-vue-admin.html
sourceHash: 642998310b07c58c8aab4f507964d9f6b7cf6e7c
codeCheckedAgainst: "6.7.13.0"
keywords: ["eslint", "linting", "administration", "vue", "html.twig", "eslint-twig-vue-plugin", "vue/require-prop-types", "vue/attribute-hyphenation", "vue/component-name-in-template-casing", "max-len", "eslint-disable", "eslint.additional.file.extensions", "twig block indentation", "self-closing components", "adr"]
summary: "ADR: ESLint for the Vue administration, JS rule adjustments, twig-as-HTML-comment template linting, block indentation, self-closing tags, attribute per line."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (administration area) introducing ESLint for the Vue administration app: `*.js` files follow a standard Vue CLI lint setup with a few rule changes, and `*.html.twig` templates are linted by converting Twig syntax into HTML comments during linting via a custom `eslint-twig-vue-plugin`.

## When to use

- Writing or reviewing administration components and `*.html.twig` templates in core or a plugin that must pass the ESLint CI step.
- Understanding why admin templates use flat block indentation, self-closing components and one attribute per line.

## Key steps / config

**`*.js` adjustments** to the standard Vue linting:

- `'vue/require-prop-types': 'error'` — always define prop types.
- `'vue/require-default-prop': 'error'` — optional props need a default.
- `'vue/no-mutating-props': ['off']` — tradeoff, mutation already heavily used.
- `'vue/component-definition-name-casing': ['error', 'kebab-case']`.

**`*.spec.js`**: no `max-len` warning for unit tests (long test names, selectors).

**`*.html.twig` exceptions**:

- `'vue/component-name-in-template-casing': ['error', 'kebab-case']`
- `'vue/no-multiple-template-root': 'off'` and `'vue/valid-template-root': 'off'` — external templates and component inheritance
- `'vue/attribute-hyphenation': 'error'` — `hello-word=""`, not `helloWorld=""`
- `'vue/no-parsing-error': ['error', {'nested-comment': false}]` — nested comments from the twig-to-comment conversion
- `'vue/valid-v-slot': ['error', { allowModifiers: true }]` — dots in slot names
- `'vue/no-unused-vars'`, `'vue/no-template-shadow'`, `'vue/no-lone-template'`, `'vue/no-v-html'` — all `'off'`

**Template writing rules** that follow from the parser:

```twig
<div>
    {% block block_name %}
    <div>
        <sw-language-switch />
        <div
            v-for="strategy in strategies"
            class="sw-app-app-url-changed-modal__content-choices"
        >
```

- Content inside a `{% block %}` is not indented further (Twig is treated as a comment, so it does not count for indentation).
- Components without content are self-closing.
- With more than one attribute, each attribute goes on its own line.

**Disabling a rule in a template**: place an HTML comment containing `eslint-disable <rule>` before the element (installed templates use e.g. `eslint-disable vue/no-use-v-if-with-v-for`). Follow "know the rules, break the rules", not "don't bug me linter".

**IDE setup**: `*.js` linting works out of the box in PHPStorm/VSCode; VSCode also handles twig via the repository's `.vscode/settings.json`. In PHPStorm add `html,twig` to the `eslint.additional.file.extensions` registry key and restart.

## Essential identifiers

- `eslint-twig-vue-plugin` (`twigVuePlugin/lib/processors/twig-vue-processor.js`)
- `eslint.additional.file.extensions`
- rule ids listed above, e.g. `vue/require-prop-types`, `vue/attribute-hyphenation`, `vue/no-parsing-error`

## Gotchas

- A heavily red-marked template (`invalid-x-end-tag`) usually means a missing space before `%}`: `{% block block_name %}` is valid, `{% block block_name%}` is not.
- The linter cannot take Twig blocks into account when computing indentation levels.
- ESLint runs in CI, so a working ESLint environment is mandatory.

## Version notes

- The ADR (2021) targets "a standard vue2 app linting"; the installed 6.7 administration boots on Vue 3 (`createApp` from `vue`), so the Vue 2 reference is historical.

## Code check (6.7.13.0)
- confirmed `createApp` — 6.7 admin view adapter uses Vue 3, not vue2 — vendor/shopware/administration/Resources/app/administration/src/app/adapter/view/vue.adapter.ts:14
- confirmed `sw-language-switch` — self-closing, one attribute per line in installed template — vendor/shopware/administration/Resources/app/administration/src/module/sw-settings-state-machine/page/sw-settings-state-machine-detail/sw-settings-state-machine-detail.html.twig:13
- confirmed `eslint-disable` — template-level rule disabling via HTML comment is used — vendor/shopware/administration/Resources/app/administration/src/module/sw-settings-country/component/sw-settings-country-new-snippet-modal/sw-settings-country-new-snippet-modal.html.twig:116
- unverified `eslint-twig-vue-plugin` — lives in twigVuePlugin outside the administration src root, out of scope
- unverified `vue/require-prop-types` — ESLint config file is outside the administration src root, out of scope
- unverified `eslint.additional.file.extensions` — PHPStorm registry key, not in vendor code
