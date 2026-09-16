---
id: platform/dev/6.6/resources/guidelines/testing/store/quality-guidelines-plugins/_index.md
title: Quality guidelines for apps in the plugin system
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/guidelines/testing/store/quality-guidelines-plugins/
sourceHash: 6756a803a6f2c87c2bdfe1d0b77f9893181fe986
keywords: ["quality guidelines", "plugin system", "composer.json", "config.xml", "shopware-cli", "executeComposerCommands", "PhpStan", "SonarQube", "message queue limit", "API test button", "Store description", "differentiator clusters"]
summary: "Store quality-review checklist for plugin-system apps: functional, storefront, admin, and code-review requirements."
lastBuilt: "2026-09-15"
relatedPages: ["platform/dev/6.6/resources/guidelines/testing/Differentiator-Clusters.md", "platform/dev/6.6/guides/plugins/plugins/storefront/add-scss-variables.md", "platform/dev/6.6/concepts/commerce/content/shopping-experiences-cms.md", "platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/add-custom-field.md"]
---
## What it is
Quality guidelines Shopware applies when testing apps built on the plugin system before releasing them to the Shopware Store.

## When to use
When preparing a plugin-system-based extension for Store submission, to check functional, storefront, administration, and automatic code-review requirements.

## Key steps / config
- Testing process: a first test, then a follow-up test on the current Shopware version; no errors in administration or frontend; test against the actual current SW6 version (e.g. `shopware/testenv:6.6.6`).
- Checklist: automatic and manual code review; full functional test across viewports and `config.xml` sales-channel configs; uninstall/reinstall; a functional-comparison check against the [differentiator clusters](platform/dev/6.6/resources/guidelines/testing/Differentiator-Clusters.md).
- Store description: short description 150-185 characters, description min. 200 characters, limited inline HTML (`<a> <p> <br> <b> <strong> <i> <ul> <ol> <li> <h2> <h3> <h4> <h5>`); display name may not contain "plugin" or "shopware"; store-display name must match `composer.json` and `config.xml`; up to 2 YouTube videos; manufacturer profile needs English and German text plus a logo.
- Technical requirements: license identified in `composer.json`; favicon `plugin.png` (40x40px) under `src/Resources/config/`; per-sales-channel `config.xml` configuration; external links need `rel="noopener"` and `target="_blank"`; errors logged via a custom log service under `/var/log/`, named like `MyExtension-Year-Month-Day.log`; own composer dependencies declared in `composer.json`, with `executeComposerCommands() === true` on the plugin base class enabling automatic dependency installation; message queue payloads capped at 262,144 bytes (256 KB).
- Uninstall must let the user choose to fully delete data, or keep app data/text snippets/media/table changes.
- Storefront: no `<hX>` tags, no inline CSS, avoid `!important`; new XHR/document requests need `X-Robots-Tag: noindex, nofollow`, or `sitemap.xml` plus canonical/meta/title tags if indexable.
- Administration: no main-menu entries; API-credential apps need an API test button, with status logged to `/var/log/` or the database; [Shopping Worlds elements](platform/dev/6.6/concepts/commerce/content/shopping-experiences-cms.md) need an element icon; automatic code review runs PhpStan/SonarQube (blocked statements: `die`, `exit`, `var_dump`); [`shopware-cli`](https://github.com/shopware/shopware-cli) helps build, validate, and upload releases.

## Essential identifiers
- `composer.json` (`extra.shopware-plugin-class`), `config.xml`
- `plugin.png` favicon (40x40px), under `src/Resources/config/`
- `executeComposerCommands()`
- `X-Robots-Tag: noindex, nofollow`

## Gotchas
Automatic code review commonly fails when the technical app name in `composer.json` doesn't match the Store/account name (e.g. `Swag\MyPlugin\SwagMyPluginSW6` instead of `Swag\MyPlugin\SwagMyPlugin`); an unpinned `"shopware/core": "*"` requirement can pull in an Early Access build instead of a stable release — pin it, e.g. `"shopware/core": "~6.1.0"` with `"minimum-stability": "RC"`; a missing `shopware/frontend` requirement causes `Class Shopware\Storefront\* not found`; an outdated `composer.lock` must be deleted from the app archive.
