---
id: platform/dev/6.6/resources/guidelines/testing/store/quality-guidelines-apps/_index.md
title: Quality guidelines for apps and themes in the app system
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/guidelines/testing/store/quality-guidelines-apps/
sourceHash: 427499e8a8e1429a80ac3e6a0e01080b339ba5b4
keywords: ["quality guidelines", "app system", "theme testing", "manifest.xml", "config.xml", "shopware-cli", "Cookie Consent Manager", "differentiator clusters", "PhpStan", "SonarQube", "message queue limit", "Store description"]
summary: "Store quality-review checklist for app-system apps and themes: functional, storefront, admin, and code-review rules."
lastBuilt: "2026-09-15"
relatedPages: ["platform/dev/6.6/resources/guidelines/testing/Differentiator-Clusters.md", "platform/dev/6.6/guides/plugins/apps/storefront/cookies-with-apps.md", "platform/dev/6.6/resources/references/app-reference/manifest-reference.md", "platform/dev/6.6/concepts/commerce/content/shopping-experiences-cms.md"]
---
## What it is
Quality guidelines Shopware applies when testing apps and themes built on the app system before releasing them to the Shopware Store.

## When to use
When preparing an app-system-based app or theme for Store submission, to check functional, storefront, administration, and automatic code-review requirements.

## Key steps / config
- Testing process: a first test, then a follow-up test on the most current Shopware version; the app must not produce errors in administration or frontend; always test against the actual current SW6 version (e.g. `shopware/testenv:6.6.6`).
- Checklist: automatic and manual code review for security/coding standards; full functional test across viewports and per-sales-channel `config.xml` configs; uninstall/reinstall; a functional-comparison check against the [differentiator clusters](platform/dev/6.6/resources/guidelines/testing/Differentiator-Clusters.md) to avoid duplicate-value rejection.
- Store description: short description 150-185 characters, description min. 200 characters, allowed inline HTML limited to `<a> <p> <br> <b> <strong> <i> <ul> <ol> <li> <h2> <h3> <h4> <h5>`; display name may not contain "plugin" or "shopware"; up to 2 embedded YouTube videos; English screenshots mandatory, German optional; manufacturer profile requires English and German text plus a logo.
- Technical requirements: license identified via `manifest.xml`; favicon `plugin.png` (40x40px) stored under `src/Resources/config/`; per-sales-channel configuration for apps using `config.xml`; external links need `rel="noopener"` and `target="_blank"`; errors logged only via a custom log service under `/var/log/`, never Shopware's own log; avoid 500 errors always, 400 errors unless API-related; uncompiled JavaScript delivered alongside the minified `main.js` build; message queue payloads capped at 262,144 bytes (256 KB).
- Storefront: no `<hX>` tags, no inline CSS, avoid `!important`; new XHR/document requests need an `X-Robots-Tag: noindex, nofollow` header, or `sitemap.xml` plus canonical/meta/title tags if indexable; cookies must be registered with the [Cookie Consent Manager](platform/dev/6.6/guides/plugins/apps/storefront/cookies-with-apps.md).
- Administration: no main-menu entries; [Shopping Worlds elements](platform/dev/6.6/concepts/commerce/content/shopping-experiences-cms.md) need an element icon; Themes need their own preview image; automatic code review runs PhpStan/SonarQube (blocked statements: `die`, `exit`, `var_dump`); the [`shopware-cli`](https://github.com/shopware/shopware-cli) tool helps build, validate, and upload releases.

## Essential identifiers
- `manifest.xml`, `config.xml`, `theme.json`
- `plugin.png` favicon (40x40px), stored under `src/Resources/config/`
- `X-Robots-Tag: noindex, nofollow`
- `shopware-cli`

## Gotchas
Automatic code review commonly fails when the technical app name in `manifest.xml` doesn't match the Store/account name (e.g. `Swag\MyPlugin\SwagMyPluginSW6` instead of `Swag\MyPlugin\SwagMyPlugin`, see the [manifest reference](platform/dev/6.6/resources/references/app-reference/manifest-reference.md)); a missing `shopware/frontend` requirement in `theme.json` causes `Class Shopware\Storefront\* not found`; an outdated `composer.lock` must be deleted from the app archive; message-queue messages over 256 KB are rejected.
