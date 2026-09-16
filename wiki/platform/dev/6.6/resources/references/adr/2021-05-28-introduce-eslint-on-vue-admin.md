---
id: platform/dev/6.6/resources/references/adr/2021-05-28-introduce-eslint-on-vue-admin.md
title: Vue administration app has ESLint support
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/adr/2021-05-28-introduce-eslint-on-vue-admin.html
sourceHash: 642998310b07c58c8aab4f507964d9f6b7cf6e7c
keywords: ["ESLint", "eslint-twig-vue-plugin", "vue2", "administration", "html.twig", "linting", "vue/require-prop-types", "vue/no-mutating-props", "vue/component-definition-name-casing", "twig-to-html-comment", "PHPStorm", "VSCode"]
summary: "ADR adding ESLint to the administration Vue app for .js and .html.twig files via a custom twig-to-HTML-comment lint pass."
lastBuilt: "2026-09-15"
---
## What it is

An architecture decision record introducing ESLint for the administration Vue app, covering both `*.js` files and `*.html.twig` templates, to give developers instant feedback and consistent code quality.

## Key steps / config

- `*.js` linting follows a standard Vue CLI setup with adjustments: `'vue/require-prop-types': 'error'`, `'vue/require-default-prop': 'error'`, `'vue/no-mutating-props': ['off']` (kept because mutating props is already heavily used), `'vue/component-definition-name-casing': ['error', 'kebab-case']`.
- `*.spec.js` files are exempted from the `max-len` rule.
- `*.html.twig` linting converts all twig syntax to HTML comments during linting via a custom `eslint-twig-vue-plugin`, so the linter treats twig templates like plain Vue templates but cannot account for twig blocks when computing indentation. Rule adjustments here include `'vue/component-name-in-template-casing': ['error', 'kebab-case']`, `'vue/no-multiple-template-root': 'off'`, `'vue/attribute-hyphenation': 'error'`, `'vue/no-parsing-error': ['error', {'nested-comment': false}]`, `'vue/no-v-html': 'off'`.
- Template writing changes required: `{% block block_name %}` content is no longer indented one level deeper; self-closing components like `<sw-language-switcher />` replace `<sw-language-switcher></sw-language-switcher>`; once a tag has more than one attribute, each attribute goes on its own line.
- ESLint is part of the CI pipeline. `*.js` linting works out of the box with PHPStorm or VSCode; for `*.html.twig` linting in PHPStorm, add `html,twig` to the `eslint.additional.file.extensions` list in Registry and restart the IDE.

## Essential identifiers

- `eslint-twig-vue-plugin`
- `'vue/require-prop-types'`, `'vue/require-default-prop'`, `'vue/no-mutating-props'`, `'vue/component-definition-name-casing'`, `'vue/component-name-in-template-casing'`, `'vue/no-multiple-template-root'`, `'vue/attribute-hyphenation'`, `'vue/no-parsing-error'`, `'vue/no-v-html'`

## Gotchas

- A file marked heavily invalid by the linter (`invalid-x-end-tag`-style errors) usually means `{% block block_name %}` is missing the space before `%}` (`{% block block_name%}` is invalid).
- The twig-to-html-comment tradeoff means the linter cannot check indentation across twig block boundaries.
